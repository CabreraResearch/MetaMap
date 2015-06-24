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
    message.text = 'Just deployed new release that: ' + p;

    run('firebase deploy --firebase=meta-map-staging -m ' + p).exec() // prints "Hello World\n". 
        .pipe(sendToSlack(message));
    run('firebase deploy --firebase=thinkwater-staging -m ' + p).exec() // prints "Hello World\n". 
        .pipe(sendToSlack(message));
})