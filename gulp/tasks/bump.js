"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var header = require('gulp-header');

  /*
   Bump the version in bower and package json
   */

gulp.task('bump', function() {
    return gulp.src(['./package.json','./.about']).pipe(bump()).pipe(gulp.dest('./'));
});

gulp.task('bumpDist', function () {
    var pkg = require('../../package.json');

      var banner = `/**
* ${pkg.title} - ${pkg.description}
* @version v${pkg.version}
* @link ${pkg.homepage}
* @license ${pkg.license}
*/

`
      return gulp.src(['./dist/*.js', './dist/*.css'])
          .pipe(header(banner, false))
          .pipe(gulp.dest('./dist'))
  })