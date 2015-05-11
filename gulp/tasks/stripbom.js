(function() {
  var gulp, stripBom;

  gulp = require('gulp');

  stripBom = require('gulp-stripbom');


  /*
   Bump the version in bower and package json
   */

  gulp.task('stripBom', function() {
    return gulp.src(['./src/**/*.coffee', './*.tmpl', './*.html', './src/**/*.js', './src/**/*.less', './src/**/*.json', './dist/*.js', './dist/*.css', './dist/*.less', './dist/*.coffee'], {
      base: './'
    }).pipe(stripBom()).pipe(gulp.dest('./'));
  });

}).call(this);
