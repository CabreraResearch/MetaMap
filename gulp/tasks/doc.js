(function() {
  var glob, gulp, spawn;

  gulp = require('gulp');

  spawn = require('child_process').spawn;

  glob = require('glob');

  gulp.task('doc', function() {
    var proc;
    proc = spawn('codo', ['-p'].concat(glob.sync('./src/coffee/**/*.coffee')), {
      stdio: 'inherit'
    });
    return proc.on('error', function(e) {
      if (e.code === 'ENOENT') {
        console.log('Error occurred spawning codo. Please ensure codo is installed: npm install -g codo');
      }
      return console.log(e);
    });
  });

}).call(this);
