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

require('./js/integrations/auth0');
require('./js/integrations/googleanalytics');
require('./js/integrations/newrelic');
require('./js/integrations/raygun');
require('./js/integrations/usersnap');

require('./tags/components/meta-dialog.tag');
require('./tags/components/meta-table.tag');
require('./tags/page-actions.tag');
require('./tags/page-container.tag');
require('./tags/page-content.tag');
require('./tags/page-footer.tag');
require('./tags/page-header.tag');
require('./tags/page-logo.tag');
require('./tags/page-search.tag');
require('./tags/page-sidebar.tag');
require('./tags/page-topmenu.tag');
require('./tags/page-body.tag');

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