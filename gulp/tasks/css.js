// loads various gulp modules
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');



// create task
gulp.task('css', function(){
    gulp.src('src/css/**/*.css')
        .pipe(concat('MetaMap.css'))
        .pipe(gulp.dest('dist'))
        .pipe(minifyCSS())
        .pipe(concat('MetaMap.min.css'))
        .pipe(gulp.dest('dist'))
});