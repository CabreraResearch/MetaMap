(function() {
  var bowerFiles, concat, gulp, gutil;

  gulp = require('gulp');

  gutil = require('gulp-util');

  bowerFiles = require('main-bower-files');

  concat = require('gulp-concat');

  gulp.task('bower', function() {
    var src;
    src = bowerFiles({
      filter: /[.]js$/
    });
    return gulp.src(src).pipe(concat('vendor.js')).pipe(gulp.dest('./dist')).on('error', gutil.log);
  });

}).call(this);
