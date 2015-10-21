var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', ['compile']);

gulp.task('compile', function (cb) {
    runSequence(
        'browserify-dev',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Compile finished');
            }
            cb(error);
        });

    gulp.on('stop', function () {
        process.nextTick(function () {
            process.exit(0);
        });
    });
})

gulp.task('compile-all', function (cb) {
    runSequence(
        'vendor',
        'browserify',
        'css',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Compile finished');
            }
            cb(error);
        });

    gulp.on('stop', function () {
        process.nextTick(function () {
            process.exit(0);
        });
    });
})

gulp.task('compile-test', function (cb) {
    runSequence(
        'compile-all',
        'test',
        'watch',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Compile finished');
            }
            cb(error);
        });
})

gulp.task('release', function (cb) {
    runSequence(
        'compile-all',
        'deploy',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('RELEASE FINISHED SUCCESSFULLY');
            }
            cb(error);
        });

    gulp.on('stop', function () {
        process.nextTick(function () {
            process.exit(0);
        });
    });
})

