var fs = require('fs')
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
global.HomunculusPackage = pkg

require('./gulp');