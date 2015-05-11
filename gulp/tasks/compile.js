(function() {
  var gulp;

  gulp = require('gulp');

  gulp.task('build', ['compile', 'test', 'watch']);

  gulp.task('compile', ['compile-src']);

  gulp.task('compile-src', ['browserify-dev', 'inject-dev']);

  gulp.task('compile-all', ['vendor', 'browserify', 'inject-all']);

  gulp.task('default', ['build']);

}).call(this);
