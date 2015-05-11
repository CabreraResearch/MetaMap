(function() {
  var content, gulp, gutil, mochaPhantomJS;

  gulp = require('gulp');

  gutil = require('gulp-util');

  content = require('../util/files');

  mochaPhantomJS = require('gulp-mocha-phantomjs');

  gulp.task('test', function() {
    var _ref;
    return gulp.src('./test.html', {
      read: false
    }).pipe(mochaPhantomJS({
      reporter: (_ref = process.env['REPORTER']) != null ? _ref : 'dot'
    }));
  });

}).call(this);
