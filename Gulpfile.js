var fs = require('fs')
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
global.MetaMapPackage = pkg

require('./gulp');