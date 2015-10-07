var browserify = require('browserify');
var watchify = require('watchify');
var Logger = require('../util/bundleLogger');
var notify = require('../util/notify');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var pkg = require('../../package.json');
var riotify = require('riotify');
var argv = require('yargs').argv;
var transforms = [riotify];

var config = function (app) {
    var path = '';
    return {
        dev: {
            entries: '.' + path + '/src/MetaMap.js',
            export: {
                glob: '.' + path + '/src/tags/**/*.tag',
                cwd: '.' + path + '/src/tag'
            },
            filename: app + '.js',
            dest: '.' + path + '/dist',
            transforms: transforms,
            debug: true,
            fullPaths: true
        },
        release: {
            entries: '.' + path + '/src/MetaMap.js',
            export: {
                glob: '.' + path + '/src/tags/**/*.tag',
                cwd: '.' + path + '/src/tags'
            },
            filename: app + '.min.js',
            transforms: transforms,
            debug: true,
            dest: '.' + path + '/dist',
            fullPaths: false
        }
    }
};

var runbrowserify = function (name) {
    var standalone = 'MetaMap';

    var module;
    var bundleLogger = new Logger(name);
    var cfg = config('metamap')[name];
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

    bundler.plugin('minifyify', {map: 'metamap.map.json', output: 'dist/metamap.map.json'});

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