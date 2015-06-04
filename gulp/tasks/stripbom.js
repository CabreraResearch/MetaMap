(function() {
  var gulp = require('gulp');
  var stripBom = require('gulp-stripbom');
  var paths = [
      './crlab/**/*.js',
      './crlab/**/*.tag',
      './crlab/**/*.scss',
      './crlab/**/*.css',
      './*.tmpl',
      './*.html',
      './metamap/**/*.js',
      './metamap/**/*.tag',
      './metamap/**/*.css',
      './metamap/**/*.scss',
      './metamap/**/*.tmpl',
      './metamap/**/*.html'
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
