require('babel/polyfill');
window.riot = require('riot');
window._ = require('lodash');
window.Promise = require('bluebird');
require('core-js');
window.$ = window.jQuery = require('jquery');
require('jquery-ui');
require('bootstrap');
window.Firebase = require('firebase');
window.Humanize = require('humanize-plus');
window.moment = require('moment');
window.URI = require('URIjs');
window.localforage = require('localforage');


require('./js/canvas/editor.js');
require('./js/canvas/user.js');
require('./js/canvas/editor_options.js');
require('./js/canvas/analytics.js');
require('./js/canvas/attachments.js');
require('./js/canvas/autosave.js');
require('./js/canvas/generator.js');
require('./js/canvas/layouts.js');
require('./js/canvas/map.js');
require('./js/canvas/perspectives.js');
require('./js/canvas/presenter.js');
require('./js/canvas/sharing.js');
require('./js/canvas/standards.js');
require('./js/canvas/tagging.js');
require('./js/canvas/templates.js');
require('./js/canvas/tests.js');
require('./js/canvas/ui.js');

var mm = require('./MetaMap');

module.exports = new mm();