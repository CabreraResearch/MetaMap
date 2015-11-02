var browserify = require('browserify');
var Logger = require('../util/bundleLogger');
var notify = require('../util/notify');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var pkg = require('../../package.json');
var minify = require('minifyify')
var concat = require('gulp-concat');
var download = require("gulp-download")
var runSequence = require('run-sequence');

gulp.task('concatOthers', function () {
    return gulp.src(['src/vendor/jsPlumb/jsPlumb-2.1.0.js', 'src/vendor/jsPlumb/jsPlumbToolkit-1.1.0.js', 'src/vendor/cdn/**/*.js'])
        .pipe(concat('vendor2.js'))
        .pipe(gulp.dest('dist'))
})

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

gulp.task('cdn', function () {
    return download([
        'https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css',
        //'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/Uniform.js/2.1.2/themes/default/css/uniform.default.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/css/bootstrap3/bootstrap-switch.min.css',
        'https://cdn.datatables.net/plug-ins/1.10.9/integration/bootstrap/3/dataTables.bootstrap.css',
        'https://cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.1/bootstrap3-editable/css/bootstrap-editable.css',
        'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.7.4/css/bootstrap-select.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.2.0/min/dropzone.min.css',
        'https://code.jquery.com/ui/1.11.4/themes/ui-lightness/jquery-ui.css',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.7/css/perfect-scrollbar.min.css',
        'https://cdn.auth0.com/js/lock-7.min.js',
        'https://cdn.firebase.com/js/client/2.2.9/firebase.js',
        'https://cdnjs.cloudflare.com/ajax/libs/Uniform.js/2.1.2/jquery.uniform.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.1/bootstrap3-editable/js/bootstrap-editable.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js'
    ])
        .pipe(gulp.dest("src/vendor/cdn"));
})

gulp.task('vendor1', function () {
    return runbrowserify();
});

gulp.task('vendor2', function (cb) {
    return runSequence(
        'cdn',
        'concatOthers',
        function (error) {
            if (error) {
                console.log(error.message);
            }
            cb(error);
        });
});

gulp.task('vendor', ['vendor1', 'vendor2']);


