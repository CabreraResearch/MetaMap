var gulp = require('gulp')
var git = require('gulp-git')
var argv = require('yargs').argv

// Run git push
// remote is the remote repo
// branch is the remote branch to push to
gulp.task('commit', function () {
    var p = argv.message;
    return gulp.src('./')
        .pipe(git.add())
        .pipe(git.commit(p))
});

gulp.task('push', function () {
    git.push('origin', 'master', function (err) {
        if (err) throw err;
    });
});

// Tag the repo with a version
gulp.task('tag', function () {
    var pkg = require('../../package.json')
    var p = argv.message;
    git.tag('v' + pkg.version, p, function (err) {
        if (err) throw err;
    });
});