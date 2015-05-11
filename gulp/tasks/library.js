(function() {
  var distinctNames, gulp, inject, path;

  path = require('path');

  gulp = require('gulp');

  inject = require('gulp-inject');

  distinctNames = [];

  gulp.task('library', function() {
    return gulp.src('./src/coffee/files.json').pipe(inject(gulp.src(['./src/**/*.coffee', './src/**/*.css', './src/**/*.less'], {
      read: false
    }), {
      starttag: '"{{ext}}": {',
      endtag: '}',
      transform: function(filepath, file, i, length) {
        var last, name, segments;
        last = '';
        if (i !== length - 1) {
          last = ",";
        }
        segments = filepath.split('/');
        name = segments[segments.length - 1].replace('.coffee', '');
        name = name.replace('-', '');
        if (-1 !== distinctNames.indexOf(name)) {
          name = segments[segments.length - 2] + name;
        }
        if (-1 !== distinctNames.indexOf(name)) {
          throw new Error('Could not create unique library name for ' + name);
        }
        distinctNames.push(name);
        path = '.' + segments.join('/');
        return '"' + name + '": "' + path + '"' + last;
      }
    })).pipe(gulp.dest('./src/coffee'));
  });

}).call(this);
