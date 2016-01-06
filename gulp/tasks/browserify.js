"use strict";

var browserify = require('browserify');
var watchify = require('watchify');
var Logger = require('../util/bundleLogger');
var notify = require('../util/notify');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var argv = require('yargs').argv;
var babelify = require('babelify')
var browserify_shim = require('browserify-shim')

var config = function (app) {
    return {
        dev: {
            entries: './src/Homunculus.js',
            filename: 'Homunculus.js',
            dest: './dist',
            debug: true,
            fullPaths: true
        },
        release: {
            entries: './src/Homunculus.js',
            filename: 'Homunculus.min.js',
            debug: true,
            dest: './dist',
            fullPaths: false
        }
    }
};



var runbrowserify = function (name) {
    var pkg = global.HomunculusPackage
    var standalone = 'Homunculus';

    var module;
    var bundleLogger = new Logger(name);
    var cfg = config('Homunculus')[name];
    var bundleMethod = (global.isWatching ? watchify : browserify);
    var bundleCfg = {
        entries: cfg.entries,
        fullPaths: false,
        extensions: ['.js'],
        builtins: false,
        debug: true,
        bundleExternal: false,
        standalone: standalone
    };

    var bundler = bundleMethod(bundleCfg);
    bundler.transform(babelify.configure({
        presets: ["es2015"]
    }))
    bundler.transform(browserify_shim)

    if(name != 'dev') {
        bundler.plugin('minifyify', {map: 'Homunculus.map.json', output: 'dist/Homunculus.map.json'});
    }

    for (module in pkg['dependencies']) {
        bundler.external(module);
    }
    for (module in pkg['browser']) {
        bundler.external(module);
    }

    var bundle = function () {
        bundleLogger.start();
        return bundler.bundle()
            .on('error', handleErrors)
            .pipe(source(cfg.filename))
            .pipe(gulp.dest(cfg.dest))
            .pipe(notify.message('Finished bundling ' + name))
            .on('end', function () {
                return bundleLogger.end();
            });
    };
    if (global.isWatching) {
        bundler.on('update', bundle);
    }
    return bundle();
};

gulp.task('browserify', ['browserify-dev', 'browserify-release']);

gulp.task('browserify-dev', function () {
    return runbrowserify('dev');
});

gulp.task('browserify-release', function () {
    return runbrowserify('release');
});