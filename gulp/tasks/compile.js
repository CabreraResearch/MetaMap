var gulp = require('gulp');
var argv = require('yargs').argv;
var _slack = require('node-slack');
var slack = new _slack('https://hooks.slack.com/services/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');
var through = require('through2');
var client = require('firebase-tools');
var runSequence = require('run-sequence');

gulp.task('default', ['compile']);

gulp.task('compile', function (cb) {
    var ret = runSequence(
        'browserify-dev',
        'cacheBust',
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
    return ret
})

gulp.task('compile-all', function (cb) {
    var ret = runSequence(
        'vendor',
        'browserify',
        'css',
        'cacheBust',
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
    return ret
})

gulp.task('compile-test', function (cb) {
    return runSequence(
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

var message = {
    token: 'KpnhJmwZLEav6suDAG90B8bf',
    team: 'cabreraresearch',
    channel: '#tech',
    icon_emoji: ':bowtie:',
    username: 'ibid'
};

var sendToSlack = function(i) {
    slack.send(i);
    return through.obj(i);
};

gulp.task('release', function (cb) {
    var pkg = require('../../package.json');
    var p = argv.message;
    message.text = 'Just deployed MetaMap v'+pkg.version+' to https://www.metamap.co (' + p + ').';
    runSequence(
        'bump',
        'compile-all',
        'bumpDist',
        'commit',
        'tag',
        function (error) {
            if (error) {
                console.log(error.message);
                cb(error);
            } else {
                client.deploy({
                    message: p
                }).then(function () {
                    sendToSlack(message)
                    setTimeout(function () {
                        console.log('RELEASE FINISHED SUCCESSFULLY');
                        cb();
                        process.nextTick(function () {
                            process.exit(0);
                        });
                    }, 5000)
                })
            }

        });
})

