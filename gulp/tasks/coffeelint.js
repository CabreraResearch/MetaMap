(function() {
  var coffeelint, content, files, gulp;

  gulp = require('gulp');

  coffeelint = require('gulp-coffeelint');

  content = require('../util/files');

  files = content.files;

  gulp.task('coffeeLint', function() {
    return gulp.src(files.coffee).pipe(coffeelint()).pipe(coffeelint.reporter());
  });

}).call(this);
