"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var header = require('gulp-header');
var fs = require('fs');

  /*
   Bump the version in bower and package json
   */

gulp.task('bump', function() {
    var ret = gulp.src(['./package.json', './about.json']).pipe(bump()).pipe(gulp.dest('./'));
    ret.on('end', function () {
        var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
        global.MetaMapPackage = pkg
    })
    return ret;
});

gulp.task('bumpDist', function () {
    var pkg = global.MetaMapPackage

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