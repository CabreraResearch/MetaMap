(function() {
  var Logger, basename, browserify, config, debug, glob, gulp, handleErrors, notify, pkg, runbrowserify, source, transforms, uglify, watchify;

  browserify = require('browserify');

  watchify = require('watchify');

  Logger = require('../util/bundleLogger');

  notify = require('../util/notify');

  gulp = require('gulp');

  handleErrors = require('../util/handleErrors');

  source = require('vinyl-source-stream');

  glob = require('glob');

  debug = require('gulp-debug');

  basename = require('path').basename;

  pkg = require('../../package.json');

  uglify = require('uglifyify');
    
  var riotify = require('riotify');

  transforms = [riotify];

  config = {
    dev: {
      entries: './src/entry.js',
      export: {
        glob: './src/tags/**/*.tag',
        cwd: './src/tag'
      },
      filename: 'MetaMap.js',
      dest: './dist',
      transforms: transforms,
      debug: true,
      fullPaths: true
    },
    release: {
      entries: './src/entry.js',
      export: {
        glob: './src/tags/**/*.tag',
        cwd: './src/tags'
      },
      filename: 'MetaMap.min.js',
      transforms: transforms,
      debug: true,
      dest: './dist',
      fullPaths: false
    },
    test: {
      entries: ['./src/entry.js', './test/entry.js'],
      dest: './test',
      filename: 'test.js',
      external: {
        glob: './src/tags/**/*.tag',
        cwd: './src/tags'
      },
      transforms: transforms,
      debug: true,
      fullPaths: true
    }
  };

    runbrowserify = function(name) {
        var bundle, bundleCfg, bundleLogger, bundleMethod, bundler, cfg, module, transform, _i, _len, _ref;
        bundleLogger = new Logger(name);
        cfg = config[name];
        bundleMethod = (global.isWatching ? watchify : browserify);
        bundleCfg = {
            entries: cfg.entries,
            fullPaths: false,
            extensions: ['.tag'],
            debug: true,
            bundleExternal: false,
            standalone: 'MetaMap'
        };
        bundler = bundleMethod(bundleCfg);
        //_ref = cfg.transforms;
        //for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        //    transform = _ref[_i];
        //    switch (transform) {
        //    case 'uglifyify':
        //        bundler.transform({
        //            global: true
        //        }, transform);
        //        break;
        //    case 'minifyify':
        //        bundler.plugin(transform, {
        //            output: cfg.dest + '/' + cfg.filename
        //        });
        //        break;
        //    default:
        //        bundler.transform(riotify);
        //    }
        //}

        for (module in pkg['dependencies']) {
            bundler.external(module);
        }
        for (module in pkg['browser']) {
            bundler.external(module);
        }
        bundle = function() {
            bundleLogger.start();
            return bundler.bundle()
                .on('error', handleErrors)
                .pipe(source(cfg.filename))
                .pipe(gulp.dest(cfg.dest))
                .pipe(notify.message('Finished bundling ' + name))
                .on('end', function() {
                    return bundleLogger.end();
                });
        };
        if (global.isWatching) {
            bundler.on('update', bundle);
        }
        return bundle();
    };

  gulp.task('browserify', ['browserify-dev', 'browserify-test', 'browserify-release']);

  gulp.task('browserify-dev', function() {
    return runbrowserify('dev');
  });

  gulp.task('browserify-release', function() {
    return runbrowserify('release');
  });

  gulp.task('browserify-test', ['browserify-dev'], function() {
    //return runbrowserify('test');
  });

}).call(this);
