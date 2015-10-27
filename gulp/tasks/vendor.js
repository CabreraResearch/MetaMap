var browserify = require('browserify');
var Logger = require('../util/bundleLogger');
var notify = require('../util/notify');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var pkg = require('../../package.json');
var minify = require('minifyify')
var concat = require('gulp-concat');

var concatOthers = function () {
    gulp.src(['src/vendor/jsPlumb/jsPlumb-2.1.0.js', 'src/vendor/jsPlumb/jsPlumbToolkit-1.1.0.js'])
        .pipe(concat('vendor2.js'))
        .pipe(gulp.dest('dist'))
}

var runbrowserify = function () {
    var module;
    var bundleLogger = new Logger('vendor-browserify');
    var bundler = browserify(
    {
            builtins: true,
            debug: true
    });

    bundler.plugin('minifyify', {map: 'vendor.map.json', output: 'dist/vendor.map.json'});

    for (module in pkg['dependencies']) {
        bundler.require(module);
    }
    for (module in pkg['browser']) {
        bundler.require(module);
    }
    for (module in pkg['optionalDependencies']) {
        bundler.require(module);
    }

    bundleLogger.start();
    //bundler.transform();
    return bundler.bundle()
        .on('error', handleErrors)
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(notify.message('Finished bundling vendor packages to /dist'))
        .on('end', function () {
            return bundleLogger.end();
        });
};

gulp.task('vendor1', function () {
    return runbrowserify();
});

gulp.task('vendor2', function () {
    return concatOthers();
});

gulp.task('vendor', ['vendor1', 'vendor2']);


