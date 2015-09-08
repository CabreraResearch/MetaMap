var run = require('gulp-run');
var gulp = require('gulp');
var argv = require('yargs').argv;
var _slack = require('node-slack');
var slack = new _slack('https://hooks.slack.com/services/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');
var through = require('through2');

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

// Use gulp-run to start a pipeline
gulp.task('deploy', function () {
    var p = argv.message;
    var target = argv.target || 'staging';
    message.text = 'Just deployed new release to '+target+' that: ' + p;

    switch(target) {
        case 'staging':
        default:
            //run('firebase deploy --firebase=thinkwater-staging -m "' + p + '"').exec();
            run('firebase deploy --firebase=meta-map-staging --message="' + p + '"').exec()
                .pipe(sendToSlack(message));
            break;
    }


})