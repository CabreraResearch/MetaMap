var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', ['compile', 'test', 'watch']);

gulp.task('compile', ['compile-src']);

gulp.task('compile-src', ['browserify-dev']);

gulp.task('compile-all', ['vendor', 'browserify']);

gulp.task('default', ['build']);

gulp.task('release', function (cb) {
    runSequence(
        'compile-all',
        'css',
        'deploy',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('RELEASE FINISHED SUCCESSFULLY');
            }
            cb(error);
        });
})