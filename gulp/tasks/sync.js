(function() {
  var browserSync, gulp;

  gulp = require('gulp');

  browserSync = require('browser-sync');

  gulp.task('sync', function() {
    browserSync({
      server: true,
      startPath: '/dev.html',
      files: ['./*.html', './dist/**/*.js', './dist/**/*.css']
    });
    gulp.watch(['src/less/**/*.less', 'dist/*.less'], ['less']);
    return gulp.watch('src/coffee/**/*.coffee', ['browserify-dev']);
  });

}).call(this);
