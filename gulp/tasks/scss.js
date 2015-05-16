var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    gulp.src('./src/scss/metamap.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist/sandbank.css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});