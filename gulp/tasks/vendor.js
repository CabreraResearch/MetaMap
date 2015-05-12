
  var Logger, browserify, concat, gulp, handleErrors, notify, pkg, runbrowserify, runconcat, source;

  browserify = require('browserify');

  Logger = require('../util/bundleLogger');

  notify = require('../util/notify');

  gulp = require('gulp');

  handleErrors = require('../util/handleErrors');

  source = require('vinyl-source-stream');

  pkg = require('../../package.json');

  concat = require('gulp-concat');

  runconcat = function() {
    var bundleLogger, libs, module, path;
    bundleLogger = new Logger('vendor');
    bundleLogger.start();
    libs = (function() {
      var _ref, _results;
      _ref = pkg['browser'];
      _results = [];
      for (module in _ref) {
        path = _ref[module];
        _results.push(require.resolve('../.' + path));
      }
      return _results;
    })();
    return gulp.src(libs).pipe(concat('vendor.js')).pipe(gulp.dest('./dist')).pipe(notify.message('Vendor bundle complete.')).on('error', handleErrors).on('end', function() {
      return bundleLogger.end();
    });
  };

  runbrowserify = function() {
      var bundleLogger, bundler, module, path, _ref;
      bundleLogger = new Logger('vendor-browserify');
      bundler = browserify();

      for (module in pkg['dependencies']) {
          bundler.require(module);
      }
      for (module in pkg['browser']) {
          bundler.require(module);
      }

      bundleLogger.start();
      //bundler.transform();
      return bundler.bundle()
          .on('error', handleErrors)
          .pipe(source('vendor.js'))
          .pipe(gulp.dest('./dist'))
          .pipe(notify.message('Finished bundling vendor packages'))
          .on('end', function() {
              return bundleLogger.end();
          });
  };

  gulp.task('vendor', function() {
      return runbrowserify();
  });


