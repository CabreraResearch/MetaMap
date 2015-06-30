require('babel/polyfill');
window.riot = require('riot');
window._ = require('lodash');
window.Promise = require('bluebird');
require('core-js');
window.$ = window.jQuery = require('jquery');
require('jquery-ui');
require('bootstrap');
window.Firebase = require('firebase');
window.Firepad = require('firepad');
window.Humanize = require('humanize-plus');
window.moment = require('moment');
window.URI = require('URIjs');
window.localforage = require('localforage');
window.Ps = require('perfect-scrollbar');

let tags = [
    'page-head',
    'page-banner',
    'page-impact',
    'page-countmein',
    'page-footer',
    'page-navbar-menu',
    'page-navbar',
    'page-news',
    'page-explore',
    'page-message',
    'page-methodology',
    'page-testimonials'
];

require('./tags/dialogs/blog-dialog.tag');
require('./tags/dialogs/infographic-dialog.tag');
require('./tags/dialogs/product-dialog.tag');
require('./tags/dialogs/project-dialog.tag');
require('./tags/dialogs/publication-dialog.tag');
require('./tags/dialogs/software-dialog.tag');
require('./tags/dialogs/speaking-dialog.tag');
require('./tags/dialogs/training-dialog.tag');
require('./tags/dialogs/video-dialog.tag');
require('./tags/dialogs/store-dialog.tag');
require('./tags/social/follow-facebook.tag');
require('./tags/social/follow-twitter.tag');
require('./tags/components/modal-dialog.tag');
require('./tags/page-banner.tag');
require('./tags/page-impact.tag');
require('./tags/page-countmein.tag');
require('./tags/page-footer.tag');
require('./tags/page-navbar-menu.tag');
require('./tags/page-navbar.tag');
require('./tags/page-news.tag');
require('./tags/page-explore.tag');
require('./tags/page-message.tag');
require('./tags/page-methodology.tag');
require('./tags/page-testimonials.tag');

var configMixin = require('./js/mixins/config.js');
riot.mixin('config', configMixin);

riot.tag('raw', '<span></span>', function (opts) {
    this.updateContent = function () {
        this.root.innerHTML = (opts) ? (opts.content || '') : '';
    };

    this.on('update', () => {
        this.updateContent();
    });

    this.updateContent();
});

var FrontEnd = require('./FrontEnd');
module.exports = new FrontEnd(tags);