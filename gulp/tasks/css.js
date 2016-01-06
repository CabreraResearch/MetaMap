// loads various gulp modules
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var runSequence = require('run-sequence');

gulp.task('css', function (cb) {
    return runSequence(
        'meta-css',
        'vendor-css',
        function (error) {
            if (error) {
                console.log(error.message);
            }
            cb(error);
        });
});

// create task
gulp.task('meta-css', function(){
    return gulp.src('src/css/**/*.css')
        .pipe(concat('Homunculus.css'))
        .pipe(gulp.dest('dist'))
        .pipe(minifyCSS())
        .pipe(concat('Homunculus.min.css'))
        .pipe(gulp.dest('dist'))
});

gulp.task('vendor-css', function () {
    return gulp.src('src/vendor/**/*.css')
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dist'))
        .pipe(minifyCSS())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('dist'))
});