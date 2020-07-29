'use strict';

const plugin = require('gulp-load-plugins')();

plugin.inject.transform.html.js = (path, file) => {
	file = file.contents.toString();
	let test = /(?:^|\n)\s*(import|export)\s+/;
	let type = test.test(file) ? 'module' : '';
	return `<script type="${type}" src="${path}"></script>`;
};

const exp = module.exports;

/**
 * Frags
 */

exp['Pre-Process'] = (stream, filter) => stream
	.pipe(plugin.dependents())
	.pipe(filter('**/*.scss'))
	.pipe(plugin.sass())
	.pipe(filter('**/*.yml'))
	.pipe(plugin.yaml());

exp['Bundle'] = (stream, filter) => stream
	.pipe(filter('**/*.js'))
	.pipe(plugin.autoRollup());

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
	.pipe(filter('**/*.css'))
	.pipe(plugin.csso())
	.pipe(filter('**/*.js'))
	.pipe(plugin.terser());

/**
 * Chain
 */

exp['build'] = 'Pre-Process.Bundle.Concat.Inject.Post-Process';
exp['serve'] = 'Pre-Process.Inject';
