(function() {
  var gulp = require('gulp');
  var stripBom = require('gulp-stripbom');
  var paths = [
      './src/**/*.js',
      './src/**/*.scss',
      './src/**/*.css',
      './*.tmpl',
      './*.html'
      ];

  /*
   Bump the version in bower and package json
   */

  gulp.task('stripBom', function() {
    return gulp.src(paths, {
      base: './'
    }).pipe(stripBom()).pipe(gulp.dest('./'));
  });

}).call(this);
