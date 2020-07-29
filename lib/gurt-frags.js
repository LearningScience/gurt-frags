'use strict';

const plugin = require('gulp-load-plugins')(),
	revTree = require('rev-tree');

plugin.inject.transform.html.js = (path, file) => {
	file = file.contents.toString();
	let test = /(?:^|\n)\s*(import|export)\s+/;
	let type = test.test(file) ? 'module' : '';
	return `<script type="${type}" src="${path}"></script>`;
};

const mod = (__dirname.includes(process.cwd()) ? process.cwd() : __dirname + '/..');

const exp = module.exports;

/**
 * Frags
 */

exp['Pre-Process'] = (stream, filter) => stream
	.pipe(plugin.dependents())
	.pipe(filter('**/*.md'))
	.pipe(plugin.marked())
	.pipe(filter('**/*.scss'))
	.pipe(plugin.sass())
	.pipe(filter('**/*.coffee'))
	.pipe(plugin.coffee())
	.pipe(filter('**/*.yml'))
	.pipe(plugin.yaml());

exp['Bundle'] = (stream, filter) => stream
	.pipe(filter('**/*.js'))
	.pipe(plugin.autoRollup(path => ({
		format: 'iife'
	})));

exp['Transpile'] = (stream, filter) => stream
	.pipe(filter('**/*.js'))
	.pipe(plugin.babel({
		presets: [[mod + '/node_modules/babel-preset-env', {modules: false}]]
	}));

exp['Concat'] = (stream, filter) => stream
	// libs
	.pipe(filter('libs/**/*.css'))
	.pipe(plugin.cssretarget({
		root: 'libs',
		silent: true
	}))
	.pipe(plugin.concat({
		path: process.cwd() + '/libs/libs.css'
	}))
	.pipe(filter('libs/**/*.js'))
	.pipe(plugin.concat({
		path: process.cwd() + '/libs/libs.js'
	}))
	// base
	.pipe(filter('base/**/*.css'))
	.pipe(plugin.cssretarget({
		root: 'base',
		silent: true
	}))
	.pipe(plugin.concat({
		path: process.cwd() + '/base/base.css'
	}))
	.pipe(filter('base/**/*.js'))
	.pipe(plugin.concat({
		path: process.cwd() + '/base/base.js'
	}))
	// apps
	.pipe(filter('apps/**/*.css'))
	.pipe(plugin.cssretarget({
		root: 'apps',
		silent: true
	}))
	.pipe(plugin.concat({
		path: process.cwd() + '/apps/apps.css'
	}))
	.pipe(filter('apps/**/*.js'))
	.pipe(plugin.concat({
		path: process.cwd() + '/apps/apps.js'
	}));

exp['Revision'] = (stream, filter) => stream
	.pipe(revTree({
		dontRemap: /index.html/,
		hashLabel: /<rev-hash>/g,
		dateLabel: /<rev-date>/g
	}));

exp['Inject'] = (stream, filter) => stream
	// libs
	.pipe(filter('index.html'))
	.pipe(plugin.inject(stream.pipe(plugin.filter(
		['libs/**/*.*']
	)), {
		name: 'libs',
		addRootSlash: false,
		quiet: true
	}))
	// base
	.pipe(filter('index.html'))
	.pipe(plugin.inject(stream.pipe(plugin.filter(
		['base/**/*.*']
	)), {
		name: 'base',
		addRootSlash: false,
		quiet: true
	}))
	// apps
	.pipe(filter('index.html'))
	.pipe(plugin.inject(stream.pipe(plugin.filter(
		['apps/**/*.*']
	)), {
		name: 'apps',
		addRootSlash: false,
		quiet: true
	}));

exp['Post-Process'] = (stream, filter) => stream
	.pipe(plugin.dependents())
	.pipe(filter('**/*.html'))
	.pipe(plugin.htmlmin())
	.pipe(filter('**/*.css'))
	.pipe(plugin.autoprefixer())
	.pipe(plugin.csso())
	.pipe(filter('**/*.js'))
	.pipe(plugin.ngAnnotate())
	.pipe(plugin.uglify({output: {ascii_only: true}}))
	.pipe(filter('**/*.json'))
	.pipe(plugin.jsonminify());

/**
 * Chain
 */

exp['build'] = 'Pre-Process.Bundle.Transpile.Concat.Revision.Inject.Post-Process';
exp['serve'] = 'Pre-Process.Inject';
