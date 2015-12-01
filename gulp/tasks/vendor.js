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
var rework = require('gulp-rework');
var reworkUrl = require('rework-plugin-url')

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

var downloadAndParse = function (url, doParse) {
    try {
        if (doParse) {
            var arr = url.split('/')
            arr.splice(arr.length - 1, 1)
            var prefix = arr.join('/')
            if (!prefix.endsWith('/')) {
                prefix += '/'
            }
            return download([url])
                .pipe(rework(reworkUrl(function (url) {
                    if (url && !url.startsWith('data:')) {
                        return prefix + url
                    } else {
                        return url
                    }
                })))
                .pipe(gulp.dest("src/vendor/cdn"))
        } else {
            return download([url])
                .pipe(gulp.dest("src/vendor/cdn"))
        }
    } catch (e) {
        console.log(e)
    }
}

gulp.task('cdn', function () {
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css')
        //'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.css', true)
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/Uniform.js/2.1.2/themes/default/css/uniform.default.css', true)
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.2/css/bootstrap3/bootstrap-switch.min.css')
        downloadAndParse('https://cdn.datatables.net/plug-ins/1.10.9/integration/bootstrap/3/dataTables.bootstrap.css')
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.1/bootstrap3-editable/css/bootstrap-editable.css', true)
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.7.5/css/bootstrap-select.min.css')
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.2.0/min/dropzone.min.css')
        downloadAndParse('https://code.jquery.com/ui/1.11.4/themes/ui-lightness/jquery-ui.css', true)
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.7/css/perfect-scrollbar.min.css')
        downloadAndParse('https://cdn.auth0.com/js/lock-7.min.js')
        downloadAndParse('https://cdn.firebase.com/js/client/2.3.2/firebase.js')
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/Uniform.js/2.1.2/jquery.uniform.min.js')
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.1/bootstrap3-editable/js/bootstrap-editable.min.js')
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js')
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.0.0/jquery.contextMenu.min.js')
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.0.0/jquery.contextMenu.css', true)
        downloadAndParse('https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.0.0/jquery.ui.position.min.js')
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

gulp.task('vendor-all', function (cb) {
    return runSequence(
        'vendor1',
        'vendor2',
        function (error) {
            if (error) {
                console.log(error.message);
            }
            cb(error);
        })
});

gulp.task('vendor', function(cb) {
    return runSequence(
        'vendor1',
        'concatOthers',
        function (error) {
            if (error) {
                console.log(error.message);
            }
            cb(error);
        })
})


