var gulp = require('gulp');
var replace = require('gulp-replace')
var rev = require('gulp-rev-append')
var rename = require("gulp-rename")

gulp.task('cacheBust', function () {
    return gulp.src('**/_*.html')
        .pipe(rev())
        .pipe(rename(function (path) {
            path.basename = path.basename.slice(1)
        }))
        .pipe(gulp.dest('./'));
});