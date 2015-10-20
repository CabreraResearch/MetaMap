var gulp = require('gulp');
var argv = require('yargs').argv;
var _slack = require('node-slack');
var slack = new _slack('https://hooks.slack.com/services/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');
var through = require('through2');
var client = require('firebase-tools');

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
    message.text = 'Just deployed new release to https://www.metamap.co that: ' + p;

    client.deploy({
        message: p
    }).then(function () {
      sendToSlack(message)
    })

})