# Gurt-Frags

Standard fragments for [Gurt](//github.com/learningscience/gurt)

Gurt-Frags provide a set of transforms common to front-end projects including linting, pre-processing, concatenation, revisioning, reference injection and post-processing. Almost no configuration is required and frags mostly filter by file type, imposing few organisational limits on your project structure.

If this module fails to satisfy your project's requirements you are encouraged to extend it with your own. One of Gurt's strengths is the ability to mix and match frags from multiple modules into a single pipeline. For writing your own frags see Gurt's readme, and take a look at this module's tiny ~100 LoC.

## Install

```sh
npm install -g gurt-frags
```

```sh
man gurt-frags
```

## Usage

To write custom frags, see [Gurt](//github.com/learningscience/gurt). For quick start, see below:

**Structure**: Gurt's default `--source` directory is `./code`, gurt-frags also expects `libs` (bower directory), `base` (shared code) and `apps` (project code). These facilitate bower file processing and reference injection order.

```text
└── code
    ├── libs
    ├── base
    └── apps
```

**index.html**: Gurt expects an index.html under the source directory for serving, gurt-frags also targets this file for css and js reference injection. Add the following injection tags to your index.html, the order is important.

```html
<!-- libs:css -->
<!-- endinject -->
<!-- libs:js -->
<!-- endinject -->

<!-- base:css -->
<!-- endinject -->
<!-- base:js -->
<!-- endinject -->

<!-- apps:css -->
<!-- endinject -->
<!-- apps:js -->
<!-- endinject -->
```

**Build**: Gurt `serve` and `build` basically do the same thing with different default chains. Gurt `serve` also watches the source directory for changes and serves up the target directory through browserSync, injecting updated styles.

```sh
# watch source (./code) build into target (./dist) and serve
gurt serve
# reads source (./code) build into target (./dist) and exits
gurt build
```

**That's it!** Build your project off `index.html`, install bower components, put your files in `base` and `apps`. All js and css is automatically injected, _all_ content will pass through to the target directory (defaults to `dist`).

## Contribute

Suggestions and contributions will be considered. When crafting a pull request please consider if your contribution is a good fit with the project, follow contribution best practices and use the github "flow" workflow.

## License

[The MIT License](LICENSE.md)
