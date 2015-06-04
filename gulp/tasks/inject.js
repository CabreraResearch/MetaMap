(function () {
    var gulp = require('gulp');
    var gutil = require('gulp-util');
    var rename = require('gulp-rename');
    var path = require('path');
    var wiredep = require('wiredep');
    var wiredepStream = wiredep.stream;
    var inject = require('gulp-inject');
    var handleErrors = require('../util/handleErrors');
    var logger = require('../util/bundleLogger');
    var notify = require('../util/notify');
    var content = require('../util/files');
    var argv = require('yargs').argv;

    var getSrc = function(app) {
        app = app || 'metamap';
        var path = '';
        switch (app) {
            case 'metamap':
                path = '/' + app;
                break;
        }
        return ['.'+path+'/src/css/**/*.css', '.'+path+'/src/tags/**/*.tag'];
    }
    var injectTask = function (path, pageName, sourceFiles, exclude, includeDevDependencies) {
        if (path == null) {
            path = '';
        }
        if (pageName == null) {
            pageName = '';
        }
        if (sourceFiles == null) {
            sourceFiles = [];
        }
        if (exclude == null) {
            exclude = [];
        }
        if (includeDevDependencies == null) {
            includeDevDependencies = false;
        }
        return gulp
            .src(path + '/' + pageName + '.tmpl')
            .pipe(rename({
                extname: '.html'
            }))
            .pipe(
                inject(
                    gulp.src(sourceFiles, {
                        read: false
                    }), {
                        addRootSlash: false,
                        addPrefix: '..',
                        transform: function (filepath) {
                            if (filepath.slice(-4) === '.tag') {
                                return '<script src="src/' + filepath + '" type="riot/tag"></script>';
                            }
                            // Use the default transform as fallback: 
                            return inject.transform.apply(inject.transform, arguments);
                        }
                    })
            )
            .pipe(wiredepStream({
                exclude: exclude,
                devDependencies: includeDevDependencies
            }))
            .pipe(gulp.dest(path))
            .pipe(notify.message(pageName + '.html includes dynamically injected.'))
            .on('error', handleErrors);
    };

    gulp.task('inject-dev', function () {
        var app = argv.app || 'metamap';
        return injectTask('./'+app, 'dev', getSrc(app), [/google/, /backbone/, /underscore/, /require/, /jquery.min.js/, /jqueryy-migrate/, /jquery-ui/, /raygun4js/]);
    });

    gulp.task('inject-release', function () {
        var app = argv.app || 'metamap';
        return injectTask('./'+app, 'index', getSrc(app), [/[.]js$/, /google/]);
    });

    gulp.task('inject-all', ['inject-dev', 'inject-release']);

}).call(this);
