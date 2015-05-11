(function() {
  var gulp, gutil;

  gulp = require('gulp');

  gutil = require('gulp-util');

  gulp.task('npm', function(done) {
    require('child_process').spawn('npm', ['publish'], {
      stdio: 'inherit'
    }).on('close', done).on('error', gutil.log);
  });

}).call(this);
