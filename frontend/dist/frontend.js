(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FrontEnd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');
var riot = window.riot;
var Router = require('./js/core/Router');
var ga = require('./js/integrations/google.js');
var twitter = require('./js/integrations/twitter.js');
var facebook = require('./js/integrations/facebook.js');

var imageUrl = '//c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/';

var config = function config() {
    var SITES = {
        CRL: {
            frontEnd: 'crlab',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'Cabrera Research Lab',
            GA: 'UA-63193554-2'
        },
        THINK_WATER: {
            frontEnd: 'thinkwater',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'ThinkWater'
        }
    };

    var ret = {
        host: window.location.host,
        site: {}
    };
    var segments = ret.host.split('.');
    var first = segments[0];
    if (first === 'www') {
        first = segments[1];
    }
    switch (first.toLowerCase()) {
        case 'meta-map-staging':
        case 'frontend':
            ret.site = SITES['CRL'];
            break;
        case 'thinkwater-staging':
        case 'thinkwater':
            ret.site = SITES['THINK_WATER'];
            break;
        default:
            //For now, default to CRL
            ret.site = SITES['CRL'];
            break;
    }

    Object.freeze(ret);
    return ret;
};

var FrontEnd = (function () {
    function FrontEnd(tags) {
        _classCallCheck(this, FrontEnd);

        this.tags = tags;
        this.config = config();

        document.title = this.config.site.title;
        var favico = document.getElementById('favico');
        favico.setAttribute('href', '' + imageUrl + '' + this.config.site.frontEnd + '/favicon.ico');

        this.MetaFire = new MetaFire(this.config);
        this.Auth0 = new Auth0(this.config);

        ga(this.config.GA);
        this.initTwitter = twitter();
        this.initFacebook = facebook();
        usersnap();
    }

    _createClass(FrontEnd, [{
        key: 'initSocial',
        value: function initSocial() {
            this.initTwitter();
            this.initFacebook();
        }
    }, {
        key: 'site',
        get: function () {
            return this.config.site.frontEnd;
        }
    }, {
        key: 'init',
        value: function init() {
            //_.each(this.tags, (tag) => {
            //    riot.mount(tag, this);
            //});
            riot.mount('*');
            this.Router = new Router();
        }
    }, {
        key: 'login',
        value: function login() {
            var self = this;
            this.Auth0.login().then(function (profile) {});
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.MetaFire.logout();
            this.Auth0.logout();
        }
    }]);

    return FrontEnd;
})();

module.exports = FrontEnd;

},{"./js/core/Router":3,"./js/integrations/auth0":4,"./js/integrations/facebook.js":5,"./js/integrations/firebase":6,"./js/integrations/google.js":7,"./js/integrations/twitter.js":8,"./js/integrations/usersnap":9}],2:[function(require,module,exports){
'use strict';

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

var tags = ['page-head', 'page-banner', 'page-impact', 'page-countmein', 'page-footer', 'page-navbar-menu', 'page-navbar', 'page-news', 'page-explore', 'page-message', 'page-methodology', 'page-testimonials'];

require('./tags/dialogs/blog-dialog.tag');
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
    var _this = this;

    this.updateContent = function () {
        this.root.innerHTML = opts ? opts.content || '' : '';
    };

    this.on('update', function () {
        _this.updateContent();
    });

    this.updateContent();
});

var FrontEnd = require('./FrontEnd');
module.exports = new FrontEnd(tags);

},{"./FrontEnd":1,"./js/mixins/config.js":10,"./tags/components/modal-dialog.tag":11,"./tags/dialogs/blog-dialog.tag":12,"./tags/dialogs/store-dialog.tag":13,"./tags/page-banner.tag":14,"./tags/page-countmein.tag":15,"./tags/page-explore.tag":16,"./tags/page-footer.tag":17,"./tags/page-impact.tag":18,"./tags/page-message.tag":19,"./tags/page-methodology.tag":20,"./tags/page-navbar-menu.tag":21,"./tags/page-navbar.tag":22,"./tags/page-news.tag":23,"./tags/page-testimonials.tag":24,"./tags/social/follow-facebook.tag":25,"./tags/social/follow-twitter.tag":26,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"firepad":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var staticRoutes = {
    'footer': true,
    'home': true,
    'explore': true
};

var Router = (function () {
    function Router() {
        var _this = this;

        _classCallCheck(this, Router);

        riot.route.start();
        riot.route(function (target) {
            for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                params[_key - 1] = arguments[_key];
            }

            var path = _this.getPath(target);
            if (!staticRoutes[path]) {
                riot.mount('modal-dialog', { id: path });
            }
        });
        this.to(window.location.hash || 'home');
    }

    _createClass(Router, [{
        key: 'getPath',
        value: function getPath(path) {
            return route.getPath(path);
        }
    }, {
        key: 'to',
        value: function to(path) {
            return route.to(path);
        }
    }], [{
        key: 'getPath',
        value: function getPath(path) {
            if (path) {
                if (path.startsWith('#')) {
                    path = path.substr(1);
                }
            }
            return path;
        }
    }, {
        key: 'to',
        value: function to(path) {
            path = route.getPath(path);
            if (path) {
                riot.route(path);
            }
        }
    }]);

    return Router;
})();

var route = Router;

module.exports = Router;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Auth0Lock = require('auth0-lock');
var Promise = window.Promise;
var localforage = window.localforage;

var Auth0 = (function () {
    function Auth0(config) {
        _classCallCheck(this, Auth0);

        this.config = config;
        this.callbackURL = window.location.href;
        this.lock = new Auth0Lock('wsOnart23yViIShqT4wfJ18w2vt2cl32', 'metamap.auth0.com');
        this.lock.on('loading ready', function () {
            for (var _len = arguments.length, e = Array(_len), _key = 0; _key < _len; _key++) {
                e[_key] = arguments[_key];
            }
        });
    }

    _createClass(Auth0, [{
        key: 'login',
        value: function login() {
            var that = this;

            var promise = new Promise(function (fulfill, reject) {
                that.getSession().then(function (profile) {
                    if (profile) {
                        fulfill(profile);
                    } else {
                        that.lock.show({
                            closable: false,
                            loginAfterSignup: true,
                            authParams: {
                                scope: 'openid offline_access'
                            }
                        }, function (err, profile, id_token, ctoken, opt, refresh_token) {
                            if (err) {
                                reject(err);
                            } else {
                                localforage.setItem('id_token', id_token);
                                localforage.setItem('profile', profile);
                                localforage.setItem('refresh_token', refresh_token);
                                that.id_token = id_token;
                                that.profile = profile;
                                that.refresh_token = refresh_token;
                                fulfill(profile);
                            }
                        });
                    }
                });
            });
            return promise;
        }
    }, {
        key: 'linkAccount',
        value: function linkAccount() {
            var that = this;
            this.lock.show({
                callbackURL: that.callbackURL,
                dict: {
                    signin: {
                        title: 'Link with another account'
                    }
                },
                authParams: {
                    access_token: that.id_token || that.profile.identities[0].access_token
                }
            });
        }
    }, {
        key: 'getSession',
        value: function getSession() {
            var that = this;
            var getProfile = function getProfile(id_token, fulfill, reject) {
                return that.lock.getProfile(id_token, function (err, profile) {
                    if (err) {
                        reject(err);
                    } else {
                        localforage.setItem('id_token', id_token);
                        localforage.setItem('profile', profile);
                        that.id_token = id_token;
                        that.profile = profile;
                        fulfill(profile, id_token);
                    }
                });
            };
            var promise = new Promise(function (fulfill, reject) {
                var fulfilled = false;
                localforage.getItem('refresh_token').then(function (token) {
                    if (token) {
                        that.refresh_token = token;
                        that.lock.getClient().refreshToken(token, function (a, tokObj) {
                            getProfile(tokObj.id_token, fulfill, reject);
                        }, function (error) {
                            reject(error);
                        });
                    } else {
                        localforage.getItem('id_token').then(function (id_token) {
                            if (token) {
                                getProfile(id_token, fulfill, reject);
                            } else {
                                fulfill(null);
                            }
                        });
                    }
                });
            });
            return promise;
        }
    }, {
        key: 'logout',
        value: function logout() {
            localforage.removeItem('id_token');
            localforage.removeItem('refresh_token');
            localforage.removeItem('profile');
            this.profile = null;
            window.location.reload();
        }
    }]);

    return Auth0;
})();

module.exports = Auth0;

},{"auth0-lock":undefined}],5:[function(require,module,exports){
'use strict';

var facebookApi = function facebookApi(apiKey) {

    window.fbAsyncInit = function () {
        window.FB.init({
            appId: '847702775304906',
            xfbml: true,
            version: 'v2.3'
        });
    };

    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    return window.fbAsyncInit;
};

module.exports = facebookApi;

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Firebase = require('firebase');
var Promise = window.Promise;
var localforage = window.localforage;
var MetaMap = window.MetaMap;

var MetaFire = (function () {
    function MetaFire(config) {
        _classCallCheck(this, MetaFire);

        this.config = config;
        this.fb = new Firebase('https://' + this.config.site.db + '.firebaseio.com');
    }

    _createClass(MetaFire, [{
        key: 'login',
        value: function login() {
            var _this = this;

            var that = this;
            var ret = new Promise(function (fulfill, reject) {
                localforage.getItem('id_token').then(function (id_token) {
                    MetaMap.Auth0.getSession().then(function (profile) {

                        MetaMap.Auth0.lock.getClient().getDelegationToken({
                            target: profile.clientID,
                            id_token: id_token,
                            api_type: 'firebase'
                        }, function (err, delegationResult) {
                            that.firebase_token = delegationResult.id_token;
                            localforage.setItem('firebase_token', that.firebase_token);
                            _this.fb.authWithCustomToken(that.firebase_token, function (error, authData) {
                                if (error) {
                                    reject(error);
                                } else {
                                    fulfill(authData);
                                }
                            });
                        });
                    });
                });
            });
            return ret;
        }
    }, {
        key: 'getChild',
        value: function getChild(path) {
            return this.fb.child(path);
        }
    }, {
        key: 'getData',
        value: function getData(path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            var promise = new Promise(function (resolve, reject) {
                child.on('value', function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });

            return promise;
        }
    }, {
        key: 'on',
        value: function on(path, callback) {
            var event = arguments[2] === undefined ? 'value' : arguments[2];

            if (path) {
                var child = this.getChild(path);
                child.on(event, function (snapshot) {
                    callback(snapshot.val());
                });
            }
        }
    }, {
        key: 'setData',
        value: function setData(data, path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            return child.set(data);
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.fb.unauth();
        }
    }]);

    return MetaFire;
})();

module.exports = MetaFire;

},{"firebase":undefined}],7:[function(require,module,exports){
'use strict';

var googleAnalytics = function googleAnalytics(apiKey) {

    // Google Plus API
    (function () {
        var po = document.createElement('script');po.type = 'text/javascript';po.async = true;
        po.src = 'https://apis.google.com/js/platform.js';
        var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(po, s);
    })();

    // Google Analytics API
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    window.ga('create', apiKey, 'auto');
    window.ga('send', 'pageview');
    return window.ga;
};

module.exports = googleAnalytics;

},{}],8:[function(require,module,exports){
"use strict";

var twitterApi = function twitterApi(apiKey) {

    window.twttr = (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    })(document, "script", "twitter-wjs");

    var load = function load() {
        return window.twttr.widgets.load();
    };

    return load;
};

module.exports = twitterApi;

},{}],9:[function(require,module,exports){
'use strict';

var userSnap = function userSnap(config) {
    var apiKey = '032baf87-8545-4ebc-a557-934859371fa5.js',
        s,
        x;
    if (config == null) {
        config = {};
    }
    apiKey = config.USER_SNAP_API_KEY;
    if (apiKey && window.location.hostname !== 'localhost') {
        window.usersnapconfig = {
            mode: 'report',
            shortcut: true,
            beforeOpen: function beforeOpen(obj) {
                return UserSnap.setEmailBox(Doc.app.user.userName);
            }
        };
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//api.usersnap.com/load/' + apiKey + '.js';
        x = document.getElementsByTagName('head')[0];
        return x.appendChild(s);
    }
};

module.exports = userSnap;

},{}],10:[function(require,module,exports){
"use strict";

var config = {
    pathImg: function pathImg(folder) {
        var ret = "//c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/" + window.FrontEnd.site + "/";
        if (folder) {
            ret += "" + folder + "/";
        }
        return ret;
    },
    getData: function getData(path, callback, that) {
        window.FrontEnd.MetaFire.on("" + window.FrontEnd.site + "/" + path, function (data) {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    },
    watchData: function watchData(path, callback) {
        window.FrontEnd.MetaFire.on("" + window.FrontEnd.site + "/" + path, function (data) {
            if (callback) {
                callback(data);
            }
        });
    }
};

module.exports = config;

},{}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('modal-dialog', '<div class="modal fade" id="{ _.kebabCase(data.title) }" > <div class="modal-dialog modal-lg"> <div id="modal" class="modal-content" riot-style="height: { height }px; position: fixed; width: 100%;" > <div class="modal-body"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <section id="modal_dialog_container"> </section> </div> </div> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();
this.height = window.innerHeight - 75;
this.on('mount', function () {
    if (opts && opts.id && opts.id != '#') {

        FrontEnd.MetaFire.getData(FrontEnd.site + '/explore/items/' + opts.id).then(function (data) {

            if (data && data.type) {
                (function () {
                    var type = data.type;

                    _this.update();

                    opts.event = {
                        item: data,
                        id: opts.id,
                        dialog: _this.modal
                    };

                    riot.mount(_this.modal_dialog_container, 'blog-dialog', opts);

                    Ps.initialize(_this.modal);

                    $(_this.root.firstChild).modal().on('hidden.bs.modal', function () {
                        _this.unmount(true);
                        switch (type) {
                            case 'html':
                            case 'store':
                                FrontEnd.Router.to('home');
                                break;
                            default:
                                FrontEnd.Router.to('explore');
                                break;
                        }
                    });
                })();
            }
        });
    }
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('blog-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> </div> <div if="{ blog }" class="row"> <div class="col-sm-10 "> <div > <raw content="{ blog }"></raw> </div> <div class="center-heading"> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> <div class="well col-sm-2" riot-style="width: 120px; position: fixed; margin-left: { margin }px"> <ul class="list-unstyled contact "> <li> <a href="https://twitter.com/share" class="twitter-share-button" data-via="{ social.twitter.title }">Tweet</a> </li> <li> <div style="margin-top: 10px;" id="gplusone" class="g-plusone" data-size="small"></div> </li> <li> <div class="fb-share-button" data-href="{ url }" data-layout="button_count"></div> </li> </ul> </div> </div> <div if="{ !blog }" class="center-heading"> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.event.id) {
        _this.data = opts.event.item;

        _this.margin = window.innerWidth - $('#modal').width() + 220;
        _this.url = window.location.href;

        _this.update();
        FrontEnd.MetaFire.getData(FrontEnd.site + '/social').then(function (social) {
            _this.social = social;
        });

        var ref = FrontEnd.MetaFire.getChild(FrontEnd.site + '/content/' + opts.event.id);
        var firepad = new Firepad.Headless(ref);
        firepad.getHtml(function (html) {
            _this.blog = html;
            _this.update();
            Ps.update(opts.event.dialog);
        });
    }
});
var ignore = false;
this.on('update', function () {
    if (!ignore && $('#modal').width() > 100) {
        _this.margin = window.innerWidth - $('#modal').width() + 220;
        _this.update();
        FrontEnd.initSocial();
        gapi.plusone.render('gplusone');
        ignore = true;
    } else {
        ignore = false;
    }
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('store-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <div> <iframe riot-src="{ data.link }" width="95%" height="1000px" frameborder="0" scrolling="no"></iframe> </div> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li each="{ data }" data-transition="fade" data-slotamount="5" data-title="{ title }">  <img if="{ img }" riot-src="{ parent.url + img }" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div if="{ title }" class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> <raw content="{ title }"></raw> </div> <div if="{ subtext }" class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> <raw content="{ subtext }"></raw> </div> <div each="{ buttons }"> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut" onclick="{ parent.getLink }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> </li> </ul> </div> </div>', 'id="home"', function(opts) {var _this = this;

this.data = [];
this.mixin('config');
this.url = this.pathImg('site');
this.mounted = false;

this.getLink = function (e) {
    var ret = '';
    switch (e.item.type) {
        case 'amazon':
            ret = 'http://www.amazon.com/gp/product/' + ASIN + '/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=' + ASIN + '&linkCode=as2&tag=cabrreselab-20&linkId=H2P2IFCPWG7KPHJN';

        default:
            ret = '#';
    }
    console.log(ret);
};

this.watchData('/banner', function (data) {
    if (false == _this.mounted) {
        _this.mounted = true;
        _this.data = _.sortBy(data, 'order');
        _this.update();

        $(_this.tp_banner).revolution({
            stopAtSlide: 1,
            stopAfterLoops: 0,
            startwidth: 1170,
            startheight: 600,
            hideThumbs: 10
            //fullWidth: "on",
            //forceFullWidth: "on",
            //lazyLoad: "on"
            // navigationStyle: "preview4"
        });
    }
    //else {
    //    this.unmount(true);
    //    riot.mount('page-banner');
    //}
});
});
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section class="fun-fact-wrap fun-facts-bg"> <div class="container"> <div class="row"> <div class="col-md-12 facts-in"> <h3> <span class="counter">876,539</span>+ </h3> <h4>Systems Thinkers</h4> <br> <a href="javascript:;" class="btn btn-lg btn-theme-dark">Count Me In</a> </div> </div> </div> </section>', function(opts) {
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-explore', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <div id="{ id }" onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption" data-title="{ text }" href="{ link || parent.url + type + \'/\' + img }"> <div class="cbp-caption-defaultWrap"> <img if="{ img }" riot-src="{ parent.url + type + \'/\' + img }" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ title }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </div> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="javascript:;" onclick="{ showAll }" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', 'id="explore"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

this.showAll = function () {
    $(_this.masonry_container).cubeportfolio('filter', '*');
};

this.onClick = function (e) {
    riot.route(_.kebabCase(e.item.title), e, _this);
};

FrontEnd.MetaFire.getData(FrontEnd.site + '/explore').then(function (data) {
    _this.filters = _.sortBy(data.filters, 'order');
    _this.header = data.header;
    _this.items = _.sortBy(_.map(data.items, function (val, key) {
        if (val && !(val.archive === true)) {
            val.id = key;
            return val;
        }
    }), 'order');
    _this.content = _this.items; //_.filter( this.items, (item) => { return !(item.archive === true) } );
    _this.update();

    var defaultFilter = _.first(_this.filters, function (filter) {
        return filter['default'] === true;
    });

    $(_this.masonry_container).cubeportfolio({
        filters: '#filters_container',
        layoutMode: 'grid',
        defaultFilter: '.' + defaultFilter.tag,
        animationType: 'flipOutDelay',
        gapHorizontal: 20,
        gapVertical: 20,
        gridAdjustment: 'responsive',
        mediaQueries: [{
            width: 1100,
            cols: 4
        }, {
            width: 800,
            cols: 3
        }, {
            width: 500,
            cols: 2
        }, {
            width: 320,
            cols: 1
        }],
        caption: 'overlayBottomAlong',
        displayType: 'bottomToTop',
        displayTypeSpeed: 100
    });
});
//riot.mount('modal-dialog', { event: e, tag: this })
});
},{"riot":"riot"}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div id="contact" class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p style="color: #fff;">{ data.about.text }</p> <ul class="list-unstyled contact"> <li each="{ data.contact }"> <p style="color: #fff;"> <strong> <i class="{ icon }"></i>{ title }: </strong> <a if="{ link }" href="{ link }" style="color: #fff" >{ link }</a> <span if="{ !link }">{ text }</span> </p> </li> </ul> <ul id="social_follow" class="list-inline social-1"> <li each="{ data.about.social }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Follow Us</h3> <a if="{ social.twitter }" class="twitter-timeline" href="https://twitter.com/{ social.twitter.title }" data-widget-id="{ social.twitter.api }">Tweets by @{ social.twitter.title }</a> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Like Us</h3> <div if="{ social.facebook }" class="fb-page" data-href="https://www.facebook.com/{ social.facebook.title }" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-height="300" data-show-posts="true"> <div class="fb-xfbml-parse-ignore"> <blockquote cite="https://www.facebook.com/{ social.facebook.title }"> <a href="https://www.facebook.com/{ social.facebook.title }">{ title }</a> </blockquote> </div> </div> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Join Us</h3> <div id="mc_embed_signup"> <form action="//cabreralabs.us4.list-manage.com/subscribe/post?u=58947385383d323caf9047f39&amp;id=9799d3a7b9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="" target="_blank" novalidate=""> <p style="color: #fff;">{ data.newsletter.text }</p> <div id="mc_embed_signup_scroll"> <div class="mc-field-group"> <div class="input-group"> <input type="email" placeholder="Email..." style="height: 31px;" value="" name="EMAIL" class="form-control" id="mce-EMAIL"> <span class="input-group-btn"> <input role="button" type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="btn btn-theme-bg">Subscribe</input> </span> </div> </div>  <div style="position: absolute; left: -5000px;"> <input type="text" name="b_58947385383d323caf9047f39_9799d3a7b9" tabindex="-1" value=""> </div> <div id="mce-responses" class="clear" style="margin-top: 5px;"> <div class="response" id="mce-error-response" style="color: red; display:none"></div> <div class="response" id="mce-success-response" style="color: #fff; display:none"></div> </div> </div> </form> </div>   </div> </div>  </div> </div> </footer>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

this.social = null;
this.data = null;
this.title = FrontEnd.config.site.title;

FrontEnd.MetaFire.getData(FrontEnd.site + '/footer').then(function (data) {
    _this.data = data;
    _this.update();

    FrontEnd.MetaFire.getData(FrontEnd.site + '/social').then(function (social) {
        _this.social = social;
        _this.update();
        FrontEnd.initSocial();
    });
});
});
},{"riot":"riot"}],18:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-impact', '<section> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2 if="{ header }">{ header.title }</h2> <span class="center-line"></span> <p if="{ header }" class="lead"> { header.text } </p> </div> </div> </div> <div id="impact_slider" class="owl-carousel"> <div class="item" each="{ items }"> <a href="javascript:;"> <img if="{ img }" width="200px" height="125px" riot-src="{ parent.url }impact/{ img }" alt="{ title }"> </a> </div> </div> </div> </section>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/impact').then(function (data) {
        _this.header = data.header;
        _this.items = data.items;
        _this.update();

        $(_this.impact_slider).owlCarousel({
                autoPlay: 3000,
                pagination: false,
                items: 4,
                loop: true,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [991, 2]
        });
});
});
},{"riot":"riot"}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-message', '<div class="container"> <div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p><raw content="{ header.text }"></raw> </p> </div> </div> </div> <div class="row special-feature"> <div each="{ items }" class="col-md-4 col-sm-4 margin10"> <div class="s-feature-box text-center wow animated fadeIn" data-wow-duration="700ms" data-wow-delay="200ms"> <div class="mask-top">  <i class="{ icon }"></i>  <h4>{ title }</h4> </div> <div class="mask-bottom">  <i class="{ icon }"></i>  <h4>{ title }</h4>  <p>{ text }</p> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.header = {};
this.items = [];
FrontEnd.MetaFire.getData(FrontEnd.site + '/message').then(function (data) {
    _this.header = data.header;
    _this.items = data.items;
    _this.update();
});
});
},{"riot":"riot"}],20:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-methodology', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p class="lead">{ header.text }</p> </div> </div> </div> <div class="divide30"></div> <div class="row"> <div class="col-md-6"> <div class="center-heading"> <h4>{ frameworks.header.title }</h4> <p class="lead">{ frameworks.header.text }</p> </div> <div class="panel-group" id="frameworks"> <div each="{ val, i in frameworks.items }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#frameworks" href="#collapseFrameworks_{ i }"> { val.title } </a> </h4> </div> <div id="collapseFrameworks_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div>  <div class="col-md-6"> <div class="center-heading"> <h4>{ partners.header.title }</h4> <p class="lead">{ partners.header.text }</p> </div> <div class="panel-group" id="accordion"> <div each="{ val, i in partners.items }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne_{ i }"> { val.title } </a> </h4> </div> <div id="collapseOne_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/methodology').then(function (data) {
        _this.header = data.header;
        _this.frameworks = data.frameworks;
        _this.partners = data.partners;

        _this.update();
});
});
},{"riot":"riot"}],21:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-menu-navbar', '<div class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }"> <a if="{ val.title }" onclick="{ parent.onClick }" href="{ val.link || \'#\' }" class="dropdown-toggle" data-toggle="dropdown"> <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i> </a> <ul if="{ val.menu && val.menu.length }" class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu"> <li each="{ val.menu }" > <a onclick="parent.onclick" href="{ link || \'#\' }"> <i if="{ icon }" class="{ icon }"></i> <span class="title">{ title }</span> </a> </li> </ul> </li> </ul> </div>', function(opts) {var _this = this;

this.data = [];

this.onClick = function (e, tag) {
    if (e.item && e.item.val.link) {
        FrontEnd.Router.to(e.item.val.link);
    } else if (e.item && e.item.val.action) {
        console.log(e.item.val.action);
    }
};

FrontEnd.MetaFire.getData(FrontEnd.site + '/navbar').then(function (data) {
    _this.data = _.sortBy(data, 'order');
    _this.update();
});
});
},{"riot":"riot"}],22:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <div> <img if="{ data }" style="margin-top: 7px; margin-right: 15px;" riot-src="{ url }site/{ data.img }" alt="{ data.alt }"> </div> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],23:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-news', '<div class="container"> <div class="row"> <div class="col-md-12"> <h3 class="heading">Latest News</h3> <div id="news_carousel" class="owl-carousel owl-spaced"> <div each="{ data }">   <div class="news-desc"> <h5> <a href="{ by ? link : \'javascript:;\' }" target="_blank">{ Humanize.truncate(title, 125) }</a> </h5> </div> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.data = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/news').then(function (data) {
        _this.data = _.toArray(data);
        _this.update();
        $(_this.news_carousel).owlCarousel({
                // Most important owl features
                items: 4,
                itemsCustom: false,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [980, 2],
                itemsTablet: [768, 2],
                itemsTabletSmall: false,
                itemsMobile: [479, 1],
                singleItem: false,
                startDragging: true,
                autoPlay: 4000
        });
});
});
},{"riot":"riot"}],24:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-testimonials', '<div id="testimonials-carousel" class="testimonials testimonials-v-2 wow animated fadeInUp" data-wow-duration="700ms" data-wow-delay="100ms"> <div class="container"> <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p>{ header.text }</p> </div> </div> </div>  <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div id="testimonial_slide" class="testi-slide"> <ul class="slides"> <li each="{ items }"> <img riot-src="{ parent.url + img }" alt="{ user }"> <h4> <i class="fa fa-quote-left ion-quote"></i> { text} </h4> <p class="test-author"> { user } - <em>{ subtext }</em> </p> </li> </ul> </div> </div> </div> <div class="divide30"></div> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg('testimonials');

FrontEnd.MetaFire.getData(FrontEnd.site + '/testimonials').then(function (data) {
        _this.header = data.header;
        _this.items = data.items;
        _this.update();

        $(_this.testimonial_slide).flexslider({
                slideshowSpeed: 5000,
                directionNav: false,
                animation: 'fade'
        });
});
});
},{"riot":"riot"}],25:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('follow-facebook', '<div class="fb-follow" data-href="https://www.facebook.com/{ data.title }" data-layout="standard" colorscheme="dark" data-show-faces="false"></div>', function(opts) {var _this = this;

this.data = null;
this.on('mount', function () {
    if (opts) {
        _this.data = opts;
        _this.update();
    }
});
});

},{"riot":"riot"}],26:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('follow-twitter', '<li > <a href="https://twitter.com/{ data.title }" class="twitter-follow-button" data-show-count="true">Follow @{ data.title }</a> </li>', function(opts) {var _this = this;

this.data = null;
this.on('mount', function () {
    if (opts) {
        _this.data = opts;
        _this.update();
        twttr.widgets.load();
    }
});
});

},{"riot":"riot"}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvY29yZS9Sb3V0ZXIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9mYWNlYm9vay5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdHdpdHRlci5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvbW9kYWwtZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2RpYWxvZ3MvYmxvZy1kaWFsb2cudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvZGlhbG9ncy9zdG9yZS1kaWFsb2cudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1iYW5uZXIudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1jb3VudG1laW4udGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1leHBsb3JlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtZm9vdGVyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtaW1wYWN0LnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbWVzc2FnZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW1ldGhvZG9sb2d5LnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbmF2YmFyLW1lbnUudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uYXZiYXIudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uZXdzLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtdGVzdGltb25pYWxzLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3NvY2lhbC9mb2xsb3ctZmFjZWJvb2sudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3Mvc29jaWFsL2ZvbGxvdy10d2l0dGVyLnRhZyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3JELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQy9DLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3JELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDdkIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDekMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDaEQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7QUFDdEQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7O0FBRXhELElBQU0sUUFBUSxHQUFHLDJJQUEySSxDQUFDOztBQUU3SixJQUFNLE1BQU0sR0FBRyxTQUFULE1BQU0sR0FBUztBQUNqQixRQUFNLEtBQUssR0FBRztBQUNWLFdBQUcsRUFBRTtBQUNELG9CQUFRLEVBQUUsT0FBTztBQUNqQixjQUFFLEVBQUUsa0JBQWtCO0FBQ3RCLHNCQUFVLEVBQUUsRUFBRTtBQUNkLGlCQUFLLEVBQUUsc0JBQXNCO0FBQzdCLGNBQUUsRUFBRSxlQUFlO1NBQ3RCO0FBQ0QsbUJBQVcsRUFBRTtBQUNULG9CQUFRLEVBQUUsWUFBWTtBQUN0QixjQUFFLEVBQUUsa0JBQWtCO0FBQ3RCLHNCQUFVLEVBQUUsRUFBRTtBQUNkLGlCQUFLLEVBQUUsWUFBWTtTQUN0QjtLQUNKLENBQUE7O0FBRUQsUUFBTSxHQUFHLEdBQUc7QUFDUixZQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJO0FBQzFCLFlBQUksRUFBRSxFQUFFO0tBQ1gsQ0FBQTtBQUNELFFBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLFFBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixRQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7QUFDakIsYUFBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN2QjtBQUNELFlBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUMzQixhQUFLLGtCQUFrQixDQUFDO0FBQ3hCLGFBQUssVUFBVTtBQUNYLGVBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLGtCQUFNO0FBQUEsQUFDVixhQUFLLG9CQUFvQixDQUFDO0FBQzFCLGFBQUssWUFBWTtBQUNiLGVBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hDLGtCQUFNO0FBQUEsQUFDVjs7QUFFSSxlQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixrQkFBTTtBQUFBLEtBQ1Q7O0FBRUQsVUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixXQUFPLEdBQUcsQ0FBQztDQUNkLENBQUM7O0lBRUksUUFBUTtBQUVDLGFBRlQsUUFBUSxDQUVFLElBQUksRUFBRTs4QkFGaEIsUUFBUTs7QUFHTixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDOztBQUV2QixnQkFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDeEMsWUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxjQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sT0FBSyxRQUFRLFFBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxrQkFBZSxDQUFDOztBQUVuRixZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFcEMsVUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsWUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsRUFBRSxDQUFDO0FBQy9CLGdCQUFRLEVBQUUsQ0FBQztLQUNkOztpQkFqQkMsUUFBUTs7ZUFtQkEsc0JBQUc7QUFDVCxnQkFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDdkI7OzthQUVPLFlBQUc7QUFDUCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDcEM7OztlQUVHLGdCQUFHOzs7O0FBSUgsZ0JBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEIsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztTQUM5Qjs7O2VBRUksaUJBQUc7QUFDSixnQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGdCQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSyxFQUVwQyxDQUFDLENBQUM7U0FDTjs7O2VBRUssa0JBQUc7QUFDTCxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN2QixnQkFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN2Qjs7O1dBOUNDLFFBQVE7OztBQWlEZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7QUN6RzFCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQixPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckIsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDM0MsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUIsTUFBTSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFekMsSUFBSSxJQUFJLEdBQUcsQ0FDUCxXQUFXLEVBQ1gsYUFBYSxFQUNiLGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLGtCQUFrQixFQUNsQixhQUFhLEVBQ2IsV0FBVyxFQUNYLGNBQWMsRUFDZCxjQUFjLEVBQ2Qsa0JBQWtCLEVBQ2xCLG1CQUFtQixDQUN0QixDQUFDOztBQUVGLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzFDLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQzNDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQzdDLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQzVDLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzlDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3JDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3ZDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2hDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ25DLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ25DLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3ZDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztBQUV4QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQzs7QUFFbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLFVBQVUsSUFBSSxFQUFFOzs7QUFDN0MsUUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZO0FBQzdCLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEFBQUMsSUFBSSxHQUFLLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxHQUFJLEVBQUUsQ0FBQztLQUM1RCxDQUFDOztBQUVGLFFBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDcEIsY0FBSyxhQUFhLEVBQUUsQ0FBQztLQUN4QixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0NBQ3hCLENBQUMsQ0FBQzs7QUFFSCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7Ozs7O0FDaEVwQyxJQUFNLFlBQVksR0FBRztBQUNqQixZQUFRLEVBQUUsSUFBSTtBQUNkLFVBQU0sRUFBRSxJQUFJO0FBQ1osYUFBUyxFQUFFLElBQUk7Q0FDbEIsQ0FBQTs7SUFFSyxNQUFNO0FBRUcsYUFGVCxNQUFNLEdBRU07Ozs4QkFGWixNQUFNOztBQUdKLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbkIsWUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFDLE1BQU0sRUFBZ0I7OENBQVgsTUFBTTtBQUFOLHNCQUFNOzs7QUFDekIsZ0JBQUksSUFBSSxHQUFHLE1BQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLGdCQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3JCLG9CQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQzVDO1NBQ0osQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQztLQUMzQzs7aUJBWEMsTUFBTTs7ZUFzQkQsaUJBQUMsSUFBSSxFQUFFO0FBQ1YsbUJBQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5Qjs7O2VBU0MsWUFBQyxJQUFJLEVBQUU7QUFDTCxtQkFBTyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pCOzs7ZUF0QmEsaUJBQUMsSUFBSSxFQUFFO0FBQ2pCLGdCQUFJLElBQUksRUFBRTtBQUNOLG9CQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdEIsd0JBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNKO0FBQ0QsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztlQU1RLFlBQUMsSUFBSSxFQUFFO0FBQ1osZ0JBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLGdCQUFJLElBQUksRUFBRTtBQUNOLG9CQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BCO1NBQ0o7OztXQS9CQyxNQUFNOzs7QUFzQ1osSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDOztBQUVyQixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7Ozs7Ozs7O0FDOUN4QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUM3QixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDOztJQUUvQixLQUFLO0FBRUksYUFGVCxLQUFLLENBRUssTUFBTSxFQUFFOzhCQUZsQixLQUFLOztBQUdILFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDeEMsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxrQ0FBa0MsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ25GLFlBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFVOzhDQUFOLENBQUM7QUFBRCxpQkFBQzs7U0FFbEMsQ0FBQyxDQUFDO0tBQ047O2lCQVRDLEtBQUs7O2VBV0YsaUJBQUc7QUFDSixnQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixnQkFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzNDLG9CQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQ2hDLHdCQUFJLE9BQU8sRUFBRTtBQUNULCtCQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ3BCLE1BQU07QUFDSCw0QkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDWCxvQ0FBUSxFQUFFLEtBQUs7QUFDZiw0Q0FBZ0IsRUFBRSxJQUFJO0FBQ3RCLHNDQUFVLEVBQUU7QUFDUixxQ0FBSyxFQUFFLHVCQUF1Qjs2QkFDakM7eUJBQ0osRUFBRSxVQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFLO0FBQ3ZELGdDQUFJLEdBQUcsRUFBRTtBQUNMLHNDQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7NkJBQ2YsTUFBTTtBQUNILDJDQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxQywyQ0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEMsMkNBQVcsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3BELG9DQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixvQ0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsb0NBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBQ25DLHVDQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7NkJBQ3BCO3lCQUNKLENBQUMsQ0FBQztxQkFDTjtpQkFDSixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7QUFDSCxtQkFBTyxPQUFPLENBQUM7U0FDbEI7OztlQUVVLHVCQUFHO0FBQ1YsZ0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixnQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDWCwyQkFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQzdCLG9CQUFJLEVBQUU7QUFDRiwwQkFBTSxFQUFFO0FBQ0osNkJBQUssRUFBRSwyQkFBMkI7cUJBQ3JDO2lCQUNKO0FBQ0QsMEJBQVUsRUFBRTtBQUNSLGdDQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZO2lCQUN6RTthQUNKLENBQUMsQ0FBQztTQUNOOzs7ZUFFUyxzQkFBRztBQUNULGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsZ0JBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzVDLHVCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxVQUFTLEdBQUcsRUFBRSxPQUFPLEVBQUU7QUFDekQsd0JBQUksR0FBRyxFQUFFO0FBQ0wsOEJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDZixNQUFNO0FBQ0gsbUNBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLG1DQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4Qyw0QkFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsNEJBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLCtCQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUM5QjtpQkFDSixDQUFDLENBQUM7YUFDTixDQUFBO0FBQ0QsZ0JBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUMzQyxvQkFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLDJCQUFXLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssRUFBSztBQUNqRCx3QkFBSSxLQUFLLEVBQUU7QUFDUCw0QkFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDM0IsNEJBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxVQUFDLENBQUMsRUFBRSxNQUFNLEVBQUs7QUFDckQsc0NBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzt5QkFDaEQsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNWLGtDQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7eUJBQ2pCLENBQUMsQ0FBQztxQkFDTixNQUFNO0FBQ0gsbUNBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQy9DLGdDQUFJLEtBQUssRUFBRTtBQUNQLDBDQUFVLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzs2QkFDekMsTUFBTTtBQUNILHVDQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7NkJBQ2pCO3lCQUNKLENBQUMsQ0FBQztxQkFDTjtpQkFDSixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7QUFDSCxtQkFBTyxPQUFPLENBQUM7U0FDbEI7OztlQUNLLGtCQUFHO0FBQ0wsdUJBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsdUJBQVcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDeEMsdUJBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEMsZ0JBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGtCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzVCOzs7V0F2R0MsS0FBSzs7O0FBeUdYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOzs7OztBQzVHdkIsSUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQWEsTUFBTSxFQUFFOztBQUVoQyxVQUFNLENBQUMsV0FBVyxHQUFHLFlBQVk7QUFDN0IsY0FBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDWCxpQkFBSyxFQUFFLGlCQUFpQjtBQUN4QixpQkFBSyxFQUFFLElBQUk7QUFDWCxtQkFBTyxFQUFFLE1BQU07U0FDbEIsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7QUFFRixBQUFDLEtBQUEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtBQUNqQixZQUFJLEVBQUU7WUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0QixtQkFBTztTQUNWO0FBQ0QsVUFBRSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsVUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDWCxVQUFFLENBQUMsR0FBRyxHQUFHLHFDQUFxQyxDQUFDO0FBQy9DLFdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUN4QyxDQUFBLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFFOztBQUV6QyxXQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUM7Q0FDN0IsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQzs7Ozs7Ozs7O0FDekI3QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUM3QixJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3JDLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0lBRXZCLFFBQVE7QUFFRSxhQUZWLFFBQVEsQ0FFRyxNQUFNLEVBQUU7OEJBRm5CLFFBQVE7O0FBR04sWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsWUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLFFBQVEsY0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLHFCQUFrQixDQUFDO0tBQzNFOztpQkFMQyxRQUFROztlQU9MLGlCQUFHOzs7QUFDSixnQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGdCQUFJLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdkMsMkJBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQy9DLDJCQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSzs7QUFFekMsK0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0FBQzlDLGtDQUFNLEVBQUUsT0FBTyxDQUFDLFFBQVE7QUFDeEIsb0NBQVEsRUFBRSxRQUFRO0FBQ2xCLG9DQUFRLEVBQUUsVUFBVTt5QkFDdkIsRUFBRSxVQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBSztBQUMxQixnQ0FBSSxDQUFDLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7QUFDaEQsdUNBQVcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzNELGtDQUFLLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBSztBQUNsRSxvQ0FBSSxLQUFLLEVBQUU7QUFDUCwwQ0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lDQUNqQixNQUFNO0FBQ0gsMkNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztpQ0FDckI7NkJBQ0osQ0FBQyxDQUFDO3lCQUNOLENBQUMsQ0FBQztxQkFDTixDQUFDLENBQUM7aUJBQ04sQ0FBQyxDQUFDO2FBQ04sQ0FBQyxDQUFDO0FBQ0gsbUJBQU8sR0FBRyxDQUFDO1NBQ2Q7OztlQUVPLGtCQUFDLElBQUksRUFBRTtBQUNYLG1CQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCOzs7ZUFFTyxpQkFBQyxJQUFJLEVBQUU7QUFDWCxnQkFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNwQixnQkFBSSxJQUFJLEVBQUU7QUFDTixxQkFBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDL0I7QUFDRCxnQkFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUUsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzVDLHFCQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFDWixVQUFDLFFBQVEsRUFBSztBQUNWLDJCQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQzNCLEVBQ0QsVUFBQyxLQUFLLEVBQUs7QUFDUCwwQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNqQixDQUFDLENBQUM7YUFDVixDQUFDLENBQUM7O0FBRUgsbUJBQU8sT0FBTyxDQUFDO1NBQ2xCOzs7ZUFFRSxZQUFDLElBQUksRUFBRSxRQUFRLEVBQW9CO2dCQUFsQixLQUFLLGdDQUFHLE9BQU87O0FBQy9CLGdCQUFJLElBQUksRUFBRTtBQUNOLG9CQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLHFCQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFDLFFBQVEsRUFBSztBQUMxQiw0QkFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUM1QixDQUFDLENBQUM7YUFDTjtTQUNKOzs7ZUFFTyxpQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2pCLGdCQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3BCLGdCQUFJLElBQUksRUFBRTtBQUNOLHFCQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvQjtBQUNELG1CQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7OztlQUVNLGtCQUFHO0FBQ04sZ0JBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDcEI7OztXQTNFQyxRQUFROzs7QUE2RWQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Ozs7O0FDakYxQixJQUFJLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQWEsTUFBTSxFQUFFOzs7QUFHcEMsS0FBQyxZQUFZO0FBQ1QsWUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxBQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUMsQUFBQyxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN4RixVQUFFLENBQUMsR0FBRyxHQUFHLHdDQUF3QyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN4RixDQUFBLEVBQUcsQ0FBQzs7O0FBR1AsS0FBQyxVQUFTLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQztBQUFDLFNBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFFLFlBQVU7QUFDdkUsYUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUUsRUFBRSxDQUFBLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUM3RSxDQUFDLEdBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDO0FBQ2pELFNBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNuQyxDQUFBLENBQUUsTUFBTSxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMseUNBQXlDLEVBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTFFLFVBQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwQyxVQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM5QixXQUFPLE1BQU0sQ0FBQyxFQUFFLENBQUM7Q0FDcEIsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQzs7Ozs7QUNyQmpDLElBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFhLE1BQU0sRUFBRTs7QUFFL0IsVUFBTSxDQUFDLEtBQUssR0FBSSxDQUFBLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7QUFDaEMsWUFBSSxFQUFFO1lBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQ3pCLFlBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuQyxVQUFFLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixVQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNYLFVBQUUsQ0FBQyxHQUFHLEdBQUcseUNBQXlDLENBQUM7QUFDbkQsV0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVyQyxTQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNWLFNBQUMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEVBQUU7QUFDbkIsYUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEIsQ0FBQzs7QUFFRixlQUFPLENBQUMsQ0FBQztLQUNaLENBQUEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxBQUFDLENBQUM7O0FBRXRDLFFBQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxHQUFTO0FBQ2IsZUFBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN0QyxDQUFBOztBQUVELFdBQU8sSUFBSSxDQUFDO0NBRWYsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQzs7Ozs7QUMzQjVCLElBQUksUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFhLE1BQU0sRUFBRTtBQUM3QixRQUFJLE1BQU0sR0FBRyx5Q0FBeUM7UUFBRSxDQUFDO1FBQUUsQ0FBQyxDQUFDO0FBQzdELFFBQUksTUFBTSxJQUFJLElBQUksRUFBRTtBQUNoQixjQUFNLEdBQUcsRUFBRSxDQUFDO0tBQ2Y7QUFDRCxVQUFNLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0FBQ2xDLFFBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLFdBQVcsRUFBRTtBQUNwRCxjQUFNLENBQUMsY0FBYyxHQUFHO0FBQ3BCLGdCQUFJLEVBQUUsUUFBUTtBQUNkLG9CQUFRLEVBQUUsSUFBSTtBQUNkLHNCQUFVLEVBQUUsb0JBQVUsR0FBRyxFQUFFO0FBQ3ZCLHVCQUFPLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDdEQ7U0FDSixDQUFDO0FBQ0YsU0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckMsU0FBQyxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztBQUMzQixTQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNmLFNBQUMsQ0FBQyxHQUFHLEdBQUcsMEJBQTBCLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwRCxTQUFDLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLGVBQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMzQjtDQUNKLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Ozs7O0FDdkIxQixJQUFJLE1BQU0sR0FBRztBQUNULFdBQU8sRUFBRSxpQkFBQyxNQUFNLEVBQUs7QUFDakIsWUFBSSxHQUFHLGlKQUErSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksTUFBRyxDQUFDO0FBQzlLLFlBQUksTUFBTSxFQUFFO0FBQ1IsZUFBRyxTQUFPLE1BQU0sTUFBRyxDQUFDO1NBQ3ZCO0FBQ0QsZUFBTyxHQUFHLENBQUM7S0FDZDtBQUNELFdBQU8sRUFBRSxpQkFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBSztBQUMvQixjQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFNBQUksSUFBSSxFQUFJLFVBQUMsSUFBSSxFQUFLO0FBQ3JFLGdCQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixnQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2QsZ0JBQUksUUFBUSxFQUFFO0FBQ1Ysd0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsQjtTQUNKLENBQUMsQ0FBQztLQUNOO0FBQ0QsYUFBUyxFQUFFLG1CQUFDLElBQUksRUFBRSxRQUFRLEVBQUs7QUFDM0IsY0FBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxTQUFJLElBQUksRUFBSSxVQUFDLElBQUksRUFBSztBQUNyRSxnQkFBSSxRQUFRLEVBQUU7QUFDVix3QkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xCO1NBQ0osQ0FBQyxDQUFDO0tBQ047Q0FDSixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7QUMzQnhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UnKTtcclxubGV0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAnKTtcclxubGV0IHVzZXJzbmFwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAnKTtcclxubGV0IHJpb3QgPSB3aW5kb3cucmlvdDtcclxubGV0IFJvdXRlciA9IHJlcXVpcmUoJy4vanMvY29yZS9Sb3V0ZXInKTtcclxubGV0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XHJcbmxldCB0d2l0dGVyID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdHdpdHRlci5qcycpO1xyXG5sZXQgZmFjZWJvb2sgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9mYWNlYm9vay5qcycpO1xyXG5cclxuY29uc3QgaW1hZ2VVcmwgPSAnLy9jNjhmNzk4MWE4YmJlOTI2YTFlMDE1NGNiZmJkNWFmMWI0ZGYwZjIxLmdvb2dsZWRyaXZlLmNvbS9ob3N0LzBCNkdBTjRnWDFiblNmbFJuZFRSSmVGWjVORXN6U0VGbFN6VktaRFpKU3pGeGVEZGljRnBvTFhWd1NETkZSV04wUkZoZlMyYy8nO1xyXG5cclxuY29uc3QgY29uZmlnID0gKCkgPT4ge1xyXG4gICAgY29uc3QgU0lURVMgPSB7XHJcbiAgICAgICAgQ1JMOiB7XHJcbiAgICAgICAgICAgIGZyb250RW5kOiAnY3JsYWInLFxyXG4gICAgICAgICAgICBkYjogJ3BvcHBpbmctZmlyZS04OTcnLFxyXG4gICAgICAgICAgICBtZXRhTWFwVXJsOiAnJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdDYWJyZXJhIFJlc2VhcmNoIExhYicsXHJcbiAgICAgICAgICAgIEdBOiAnVUEtNjMxOTM1NTQtMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIFRISU5LX1dBVEVSOiB7XHJcbiAgICAgICAgICAgIGZyb250RW5kOiAndGhpbmt3YXRlcicsXHJcbiAgICAgICAgICAgIGRiOiAncG9wcGluZy1maXJlLTg5NycsXHJcbiAgICAgICAgICAgIG1ldGFNYXBVcmw6ICcnLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1RoaW5rV2F0ZXInXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJldCA9IHtcclxuICAgICAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxuICAgICAgICBzaXRlOiB7fVxyXG4gICAgfVxyXG4gICAgbGV0IHNlZ21lbnRzID0gcmV0Lmhvc3Quc3BsaXQoJy4nKTtcclxuICAgIGxldCBmaXJzdCA9IHNlZ21lbnRzWzBdO1xyXG4gICAgaWYgKGZpcnN0ID09PSAnd3d3Jykge1xyXG4gICAgICAgIGZpcnN0ID0gc2VnbWVudHNbMV07XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKGZpcnN0LnRvTG93ZXJDYXNlKCkpIHtcclxuICAgIGNhc2UgJ21ldGEtbWFwLXN0YWdpbmcnOlxyXG4gICAgY2FzZSAnZnJvbnRlbmQnOlxyXG4gICAgICAgIHJldC5zaXRlID0gU0lURVNbJ0NSTCddO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAndGhpbmt3YXRlci1zdGFnaW5nJzpcclxuICAgIGNhc2UgJ3RoaW5rd2F0ZXInOlxyXG4gICAgICAgIHJldC5zaXRlID0gU0lURVNbJ1RISU5LX1dBVEVSJ107XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vRm9yIG5vdywgZGVmYXVsdCB0byBDUkxcclxuICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydDUkwnXTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QuZnJlZXplKHJldCk7XHJcbiAgICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuY2xhc3MgRnJvbnRFbmQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ3MpIHtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XHJcbiBcclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuY29uZmlnLnNpdGUudGl0bGU7XHJcbiAgICAgICAgbGV0IGZhdmljbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYXZpY28nKTtcclxuICAgICAgICBmYXZpY28uc2V0QXR0cmlidXRlKCdocmVmJywgYCR7aW1hZ2VVcmx9JHt0aGlzLmNvbmZpZy5zaXRlLmZyb250RW5kfS9mYXZpY29uLmljb2ApO1xyXG5cclxuICAgICAgICB0aGlzLk1ldGFGaXJlID0gbmV3IE1ldGFGaXJlKHRoaXMuY29uZmlnKTtcclxuICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKHRoaXMuY29uZmlnKTtcclxuXHJcbiAgICAgICAgZ2EodGhpcy5jb25maWcuR0EpO1xyXG4gICAgICAgIHRoaXMuaW5pdFR3aXR0ZXIgPSB0d2l0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RmFjZWJvb2sgPSBmYWNlYm9vaygpO1xyXG4gICAgICAgIHVzZXJzbmFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFNvY2lhbCgpIHtcclxuICAgICAgICB0aGlzLmluaXRUd2l0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RmFjZWJvb2soKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc2l0ZS5mcm9udEVuZDtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIC8vXy5lYWNoKHRoaXMudGFncywgKHRhZykgPT4ge1xyXG4gICAgICAgIC8vICAgIHJpb3QubW91bnQodGFnLCB0aGlzKTtcclxuICAgICAgICAvL30pO1xyXG4gICAgICAgIHJpb3QubW91bnQoJyonKTtcclxuICAgICAgICB0aGlzLlJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dpbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dvdXQoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGcm9udEVuZDsiLCJyZXF1aXJlKCdiYWJlbC9wb2x5ZmlsbCcpO1xyXG53aW5kb3cucmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxud2luZG93Ll8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxud2luZG93LlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5yZXF1aXJlKCdjb3JlLWpzJyk7XHJcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5yZXF1aXJlKCdqcXVlcnktdWknKTtcclxucmVxdWlyZSgnYm9vdHN0cmFwJyk7XHJcbndpbmRvdy5GaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbndpbmRvdy5GaXJlcGFkID0gcmVxdWlyZSgnZmlyZXBhZCcpO1xyXG53aW5kb3cuSHVtYW5pemUgPSByZXF1aXJlKCdodW1hbml6ZS1wbHVzJyk7XHJcbndpbmRvdy5tb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxud2luZG93LlVSSSA9IHJlcXVpcmUoJ1VSSWpzJyk7XHJcbndpbmRvdy5sb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJyk7XHJcbndpbmRvdy5QcyA9IHJlcXVpcmUoJ3BlcmZlY3Qtc2Nyb2xsYmFyJyk7XHJcblxyXG5sZXQgdGFncyA9IFtcclxuICAgICdwYWdlLWhlYWQnLFxyXG4gICAgJ3BhZ2UtYmFubmVyJyxcclxuICAgICdwYWdlLWltcGFjdCcsXHJcbiAgICAncGFnZS1jb3VudG1laW4nLFxyXG4gICAgJ3BhZ2UtZm9vdGVyJyxcclxuICAgICdwYWdlLW5hdmJhci1tZW51JyxcclxuICAgICdwYWdlLW5hdmJhcicsXHJcbiAgICAncGFnZS1uZXdzJyxcclxuICAgICdwYWdlLWV4cGxvcmUnLFxyXG4gICAgJ3BhZ2UtbWVzc2FnZScsXHJcbiAgICAncGFnZS1tZXRob2RvbG9neScsXHJcbiAgICAncGFnZS10ZXN0aW1vbmlhbHMnXHJcbl07XHJcblxyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy9ibG9nLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3Mvc3RvcmUtZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3Mvc29jaWFsL2ZvbGxvdy1mYWNlYm9vay50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3NvY2lhbC9mb2xsb3ctdHdpdHRlci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2NvbXBvbmVudHMvbW9kYWwtZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1iYW5uZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWltcGFjdC50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtY291bnRtZWluLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1mb290ZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci1tZW51LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uYXZiYXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5ld3MudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWV4cGxvcmUudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW1lc3NhZ2UudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW1ldGhvZG9sb2d5LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnJyk7XHJcblxyXG52YXIgY29uZmlnTWl4aW4gPSByZXF1aXJlKCcuL2pzL21peGlucy9jb25maWcuanMnKTtcclxucmlvdC5taXhpbignY29uZmlnJywgY29uZmlnTWl4aW4pO1xyXG5cclxucmlvdC50YWcoJ3JhdycsICc8c3Bhbj48L3NwYW4+JywgZnVuY3Rpb24gKG9wdHMpIHtcclxuICAgIHRoaXMudXBkYXRlQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gKG9wdHMpID8gKG9wdHMuY29udGVudCB8fCAnJykgOiAnJztcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbn0pO1xyXG5cclxudmFyIEZyb250RW5kID0gcmVxdWlyZSgnLi9Gcm9udEVuZCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBGcm9udEVuZCh0YWdzKTsiLCJjb25zdCBzdGF0aWNSb3V0ZXMgPSB7XHJcbiAgICAnZm9vdGVyJzogdHJ1ZSxcclxuICAgICdob21lJzogdHJ1ZSxcclxuICAgICdleHBsb3JlJzogdHJ1ZVxyXG59XHJcblxyXG5jbGFzcyBSb3V0ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHJpb3Qucm91dGUuc3RhcnQoKTtcclxuICAgICAgICByaW90LnJvdXRlKCh0YXJnZXQsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGF0aCA9IHRoaXMuZ2V0UGF0aCh0YXJnZXQpO1xyXG4gICAgICAgICAgICBpZiAoIXN0YXRpY1JvdXRlc1twYXRoXSkge1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudCgnbW9kYWwtZGlhbG9nJywgeyBpZDogcGF0aCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG8od2luZG93LmxvY2F0aW9uLmhhc2ggfHwgJ2hvbWUnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0UGF0aChwYXRoKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHBhdGguc3RhcnRzV2l0aCgnIycpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aChwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlLmdldFBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRvKHBhdGgpIHtcclxuICAgICAgICBwYXRoID0gcm91dGUuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICByaW90LnJvdXRlKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0byhwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlLnRvKHBhdGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCByb3V0ZSA9IFJvdXRlcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUm91dGVyOyIsImxldCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJyk7XHJcbmxldCBQcm9taXNlID0gd2luZG93LlByb21pc2U7XHJcbmxldCBsb2NhbGZvcmFnZSA9IHdpbmRvdy5sb2NhbGZvcmFnZTtcclxuXHJcbmNsYXNzIEF1dGgwIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmNhbGxiYWNrVVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgdGhpcy5sb2NrID0gbmV3IEF1dGgwTG9jaygnd3NPbmFydDIzeVZpSVNocVQ0d2ZKMTh3MnZ0MmNsMzInLCAnbWV0YW1hcC5hdXRoMC5jb20nKTtcclxuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgcHJvZmlsZSwgaWRfdG9rZW4sIGN0b2tlbiwgb3B0LCByZWZyZXNoX3Rva2VuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnaWRfdG9rZW4nLCBpZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnByb2ZpbGUgPSBwcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbGlua0FjY291bnQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcclxuICAgICAgICAgICAgY2FsbGJhY2tVUkw6IHRoYXQuY2FsbGJhY2tVUkwsXHJcbiAgICAgICAgICAgIGRpY3Q6IHtcclxuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGluayB3aXRoIGFub3RoZXIgYWNjb3VudCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXV0aFBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGF0LmlkX3Rva2VuIHx8IHRoYXQucHJvZmlsZS5pZGVudGl0aWVzWzBdLmFjY2Vzc190b2tlblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2Vzc2lvbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGdldFByb2ZpbGUgPSAoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhhdC5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIGZ1bmN0aW9uKGVyciwgcHJvZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pZF90b2tlbiA9IGlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlLCBpZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZ1bGZpbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdyZWZyZXNoX3Rva2VuJykudGhlbigodG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVmcmVzaF90b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQubG9jay5nZXRDbGllbnQoKS5yZWZyZXNoVG9rZW4odG9rZW4sIChhLCB0b2tPYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvZmlsZSh0b2tPYmouaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKGlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpO1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3JlZnJlc2hfdG9rZW4nKTtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XHJcbiAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcclxuXHJcblxyXG4iLCJcclxudmFyIGZhY2Vib29rQXBpID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgXHJcbiAgICB3aW5kb3cuZmJBc3luY0luaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LkZCLmluaXQoe1xyXG4gICAgICAgICAgICBhcHBJZDogJzg0NzcwMjc3NTMwNDkwNicsXHJcbiAgICAgICAgICAgIHhmYm1sOiB0cnVlLFxyXG4gICAgICAgICAgICB2ZXJzaW9uOiAndjIuMydcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcclxuICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgIGpzLnNyYyA9IFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9zZGsuanNcIjtcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcbiAgICB9KGRvY3VtZW50LCAnc2NyaXB0JywgJ2ZhY2Vib29rLWpzc2RrJykpO1xyXG5cclxuICAgIHJldHVybiB3aW5kb3cuZmJBc3luY0luaXQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZhY2Vib29rQXBpO1xyXG5cclxuXHJcbiIsImxldCBGaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbmxldCBQcm9taXNlID0gd2luZG93LlByb21pc2U7XHJcbmxldCBsb2NhbGZvcmFnZSA9IHdpbmRvdy5sb2NhbGZvcmFnZTtcclxubGV0IE1ldGFNYXAgPSB3aW5kb3cuTWV0YU1hcDtcclxuXHJcbmNsYXNzIE1ldGFGaXJlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGxldCByZXQgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuQXV0aDAuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5BdXRoMC5sb2NrLmdldENsaWVudCgpLmdldERlbGVnYXRpb25Ub2tlbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogcHJvZmlsZS5jbGllbnRJRCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfdG9rZW46IGlkX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGlfdHlwZTogJ2ZpcmViYXNlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIGRlbGVnYXRpb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2ZpcmViYXNlX3Rva2VuJywgdGhhdC5maXJlYmFzZV90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGF0LmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGF1dGhEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEgKHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjaGlsZC5vbigndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzbmFwc2hvdC52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uIChwYXRoLCBjYWxsYmFjaywgZXZlbnQgPSAndmFsdWUnICkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9uKGV2ZW50LCAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNuYXBzaG90LnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEgKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkLnNldChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQgKCkge1xyXG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJcclxudmFyIGdvb2dsZUFuYWx5dGljcyA9IGZ1bmN0aW9uIChhcGlLZXkpIHtcclxuICAgIFxyXG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xyXG4gICAgICAgIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvLCBzKTtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgLy8gR29vZ2xlIEFuYWx5dGljcyBBUElcclxuICAoZnVuY3Rpb24oaSxzLG8sZyxyLGEsbSl7aVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J109cjtpW3JdPWlbcl18fGZ1bmN0aW9uKCl7XHJcbiAgICAgIChpW3JdLnE9aVtyXS5xfHxbXSkucHVzaChhcmd1bWVudHMpfSxpW3JdLmw9MSpuZXcgRGF0ZSgpO2E9cy5jcmVhdGVFbGVtZW50KG8pLFxyXG4gICAgICBtPXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07YS5hc3luYz0xO2Euc3JjPWc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgfSkod2luZG93LGRvY3VtZW50LCdzY3JpcHQnLCcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCdnYScpO1xyXG5cclxuICAgIHdpbmRvdy5nYSgnY3JlYXRlJywgYXBpS2V5LCAnYXV0bycpO1xyXG4gICAgd2luZG93LmdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgICByZXR1cm4gd2luZG93LmdhO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnb29nbGVBbmFseXRpY3M7XHJcblxyXG5cclxuIiwiXHJcbnZhciB0d2l0dGVyQXBpID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgXHJcbiAgICB3aW5kb3cudHd0dHIgPSAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgICAgdCA9IHdpbmRvdy50d3R0ciB8fCB7fTtcclxuICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xyXG4gICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAganMuc3JjID0gXCJodHRwczovL3BsYXRmb3JtLnR3aXR0ZXIuY29tL3dpZGdldHMuanNcIjtcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgIHQuX2UgPSBbXTtcclxuICAgICAgICB0LnJlYWR5ID0gZnVuY3Rpb24gKGYpIHtcclxuICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfShkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJ0d2l0dGVyLXdqc1wiKSk7XHJcblxyXG4gICAgbGV0IGxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy50d3R0ci53aWRnZXRzLmxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbG9hZDtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHR3aXR0ZXJBcGk7XHJcblxyXG5cclxuIiwiXHJcbnZhciB1c2VyU25hcCA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXkgPSAnMDMyYmFmODctODU0NS00ZWJjLWE1NTctOTM0ODU5MzcxZmE1LmpzJywgcywgeDtcclxuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYXBpS2V5ID0gY29uZmlnLlVTRVJfU05BUF9BUElfS0VZO1xyXG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0ge1xyXG4gICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU25hcC5zZXRFbWFpbEJveChEb2MuYXBwLnVzZXIudXNlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgcy5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xyXG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHJldHVybiB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcclxuXHJcblxyXG4iLCJcclxubGV0IGNvbmZpZyA9IHtcclxuICAgIHBhdGhJbWc6IChmb2xkZXIpID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gYC8vYzY4Zjc5ODFhOGJiZTkyNmExZTAxNTRjYmZiZDVhZjFiNGRmMGYyMS5nb29nbGVkcml2ZS5jb20vaG9zdC8wQjZHQU40Z1gxYm5TZmxSbmRUUkplRlo1TkVzelNFRmxTelZLWkRaSlN6RnhlRGRpY0Zwb0xYVndTRE5GUldOMFJGaGZTMmMvJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vYDtcclxuICAgICAgICBpZiAoZm9sZGVyKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBgJHtmb2xkZXJ9L2A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0YTogKHBhdGgsIGNhbGxiYWNrLCB0aGF0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHdhdGNoRGF0YTogKHBhdGgsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtb2RhbC1kaWFsb2cnLCAnPGRpdiBjbGFzcz1cIm1vZGFsIGZhZGVcIiBpZD1cInsgXy5rZWJhYkNhc2UoZGF0YS50aXRsZSkgfVwiID4gPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZyBtb2RhbC1sZ1wiPiA8ZGl2IGlkPVwibW9kYWxcIiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIiByaW90LXN0eWxlPVwiaGVpZ2h0OiB7IGhlaWdodCB9cHg7IHBvc2l0aW9uOiBmaXhlZDsgd2lkdGg6IDEwMCU7XCIgPiA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj4gPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj4gPC9idXR0b24+IDxzZWN0aW9uIGlkPVwibW9kYWxfZGlhbG9nX2NvbnRhaW5lclwiPiA8L3NlY3Rpb24+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG50aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDc1O1xudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMgJiYgb3B0cy5pZCAmJiBvcHRzLmlkICE9ICcjJykge1xuXG4gICAgICAgIEZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZXhwbG9yZS9pdGVtcy8nICsgb3B0cy5pZCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGRhdGEudHlwZTtcblxuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICBvcHRzLmV2ZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBvcHRzLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nOiBfdGhpcy5tb2RhbFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHJpb3QubW91bnQoX3RoaXMubW9kYWxfZGlhbG9nX2NvbnRhaW5lciwgJ2Jsb2ctZGlhbG9nJywgb3B0cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgUHMuaW5pdGlhbGl6ZShfdGhpcy5tb2RhbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJChfdGhpcy5yb290LmZpcnN0Q2hpbGQpLm1vZGFsKCkub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnVubW91bnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzdG9yZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZyb250RW5kLlJvdXRlci50bygnaG9tZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGcm9udEVuZC5Sb3V0ZXIudG8oJ2V4cGxvcmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdibG9nLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDwvZGl2PiA8ZGl2IGlmPVwieyBibG9nIH1cIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEwIFwiPiA8ZGl2ID4gPHJhdyBjb250ZW50PVwieyBibG9nIH1cIj48L3Jhdz4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8YSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YS5idXR0b25zIH1cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS1saW5rPVwieyB2YWwubGluayB9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJ3ZWxsIGNvbC1zbS0yXCIgcmlvdC1zdHlsZT1cIndpZHRoOiAxMjBweDsgcG9zaXRpb246IGZpeGVkOyBtYXJnaW4tbGVmdDogeyBtYXJnaW4gfXB4XCI+IDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgY29udGFjdCBcIj4gPGxpPiA8YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9zaGFyZVwiIGNsYXNzPVwidHdpdHRlci1zaGFyZS1idXR0b25cIiBkYXRhLXZpYT1cInsgc29jaWFsLnR3aXR0ZXIudGl0bGUgfVwiPlR3ZWV0PC9hPiA8L2xpPiA8bGk+IDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOiAxMHB4O1wiIGlkPVwiZ3BsdXNvbmVcIiBjbGFzcz1cImctcGx1c29uZVwiIGRhdGEtc2l6ZT1cInNtYWxsXCI+PC9kaXY+IDwvbGk+IDxsaT4gPGRpdiBjbGFzcz1cImZiLXNoYXJlLWJ1dHRvblwiIGRhdGEtaHJlZj1cInsgdXJsIH1cIiBkYXRhLWxheW91dD1cImJ1dHRvbl9jb3VudFwiPjwvZGl2PiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWY9XCJ7ICFibG9nIH1cIiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuZXZlbnQuaWQpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcblxuICAgICAgICBfdGhpcy5tYXJnaW4gPSB3aW5kb3cuaW5uZXJXaWR0aCAtICQoJyNtb2RhbCcpLndpZHRoKCkgKyAyMjA7XG4gICAgICAgIF90aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3NvY2lhbCcpLnRoZW4oZnVuY3Rpb24gKHNvY2lhbCkge1xuICAgICAgICAgICAgX3RoaXMuc29jaWFsID0gc29jaWFsO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcmVmID0gRnJvbnRFbmQuTWV0YUZpcmUuZ2V0Q2hpbGQoRnJvbnRFbmQuc2l0ZSArICcvY29udGVudC8nICsgb3B0cy5ldmVudC5pZCk7XG4gICAgICAgIHZhciBmaXJlcGFkID0gbmV3IEZpcmVwYWQuSGVhZGxlc3MocmVmKTtcbiAgICAgICAgZmlyZXBhZC5nZXRIdG1sKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICAgICAgICBfdGhpcy5ibG9nID0gaHRtbDtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgUHMudXBkYXRlKG9wdHMuZXZlbnQuZGlhbG9nKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG52YXIgaWdub3JlID0gZmFsc2U7XG50aGlzLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFpZ25vcmUgJiYgJCgnI21vZGFsJykud2lkdGgoKSA+IDEwMCkge1xuICAgICAgICBfdGhpcy5tYXJnaW4gPSB3aW5kb3cuaW5uZXJXaWR0aCAtICQoJyNtb2RhbCcpLndpZHRoKCkgKyAyMjA7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICBGcm9udEVuZC5pbml0U29jaWFsKCk7XG4gICAgICAgIGdhcGkucGx1c29uZS5yZW5kZXIoJ2dwbHVzb25lJyk7XG4gICAgICAgIGlnbm9yZSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWdub3JlID0gZmFsc2U7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3N0b3JlLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxkaXY+IDxpZnJhbWUgcmlvdC1zcmM9XCJ7IGRhdGEubGluayB9XCIgd2lkdGg9XCI5NSVcIiBoZWlnaHQ9XCIxMDAwcHhcIiBmcmFtZWJvcmRlcj1cIjBcIiBzY3JvbGxpbmc9XCJub1wiPjwvaWZyYW1lPiA8L2Rpdj4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYmFubmVyJywgJzxkaXYgY2xhc3M9XCJmdWxsd2lkdGhiYW5uZXJcIj4gPGRpdiBpZD1cInRwX2Jhbm5lclwiIGNsYXNzPVwidHAtYmFubmVyXCI+IDx1bD4gIDxsaSBlYWNoPVwieyBkYXRhIH1cIiBkYXRhLXRyYW5zaXRpb249XCJmYWRlXCIgZGF0YS1zbG90YW1vdW50PVwiNVwiIGRhdGEtdGl0bGU9XCJ7IHRpdGxlIH1cIj4gIDxpbWcgaWY9XCJ7IGltZyB9XCIgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgKyBpbWcgfVwiIGFsdD1cImRhcmtibHVyYmdcIiBkYXRhLWJnZml0PVwiY292ZXJcIiBkYXRhLWJncG9zaXRpb249XCJsZWZ0IHRvcFwiIGRhdGEtYmdyZXBlYXQ9XCJuby1yZXBlYXRcIj4gPGRpdiBpZj1cInsgdGl0bGUgfVwiIGNsYXNzPVwiY2FwdGlvbiB0aXRsZS0yIHNmdFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMTAwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTAwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gPHJhdyBjb250ZW50PVwieyB0aXRsZSB9XCI+PC9yYXc+IDwvZGl2PiA8ZGl2IGlmPVwieyBzdWJ0ZXh0IH1cIiBjbGFzcz1cImNhcHRpb24gdGV4dCBzZmxcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjIyMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IDxyYXcgY29udGVudD1cInsgc3VidGV4dCB9XCI+PC9yYXc+IDwvZGl2PiA8ZGl2IGVhY2g9XCJ7IGJ1dHRvbnMgfVwiPiA8ZGl2IGNsYXNzPVwiY2FwdGlvbiBzZmIgcmV2LWJ1dHRvbnMgdHAtcmVzaXplbWVcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjM1NVwiIGRhdGEtc3BlZWQ9XCI1MDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiU2luZS5lYXNlT3V0XCIgb25jbGljaz1cInsgcGFyZW50LmdldExpbmsgfVwiPiA8YSBocmVmPVwieyBsaW5rIHx8IFxcJ1xcJyB9XCIgdGFyZ2V0PVwieyB0YXJnZXQgfHwgXFwnXFwnfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPnsgdGl0bGUgfTwvYT4gPC9kaXY+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+JywgJ2lkPVwiaG9tZVwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygnc2l0ZScpO1xudGhpcy5tb3VudGVkID0gZmFsc2U7XG5cbnRoaXMuZ2V0TGluayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHJldCA9ICcnO1xuICAgIHN3aXRjaCAoZS5pdGVtLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnYW1hem9uJzpcbiAgICAgICAgICAgIHJldCA9ICdodHRwOi8vd3d3LmFtYXpvbi5jb20vZ3AvcHJvZHVjdC8nICsgQVNJTiArICcvcmVmPWFzX2xpX3RsP2llPVVURjgmY2FtcD0xNzg5JmNyZWF0aXZlPTkzMjUmY3JlYXRpdmVBU0lOPScgKyBBU0lOICsgJyZsaW5rQ29kZT1hczImdGFnPWNhYnJyZXNlbGFiLTIwJmxpbmtJZD1IMlAySUZDUFdHN0tQSEpOJztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0ID0gJyMnO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhyZXQpO1xufTtcblxudGhpcy53YXRjaERhdGEoJy9iYW5uZXInLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmIChmYWxzZSA9PSBfdGhpcy5tb3VudGVkKSB7XG4gICAgICAgIF90aGlzLm1vdW50ZWQgPSB0cnVlO1xuICAgICAgICBfdGhpcy5kYXRhID0gXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMudHBfYmFubmVyKS5yZXZvbHV0aW9uKHtcbiAgICAgICAgICAgIHN0b3BBdFNsaWRlOiAxLFxuICAgICAgICAgICAgc3RvcEFmdGVyTG9vcHM6IDAsXG4gICAgICAgICAgICBzdGFydHdpZHRoOiAxMTcwLFxuICAgICAgICAgICAgc3RhcnRoZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgIGhpZGVUaHVtYnM6IDEwXG4gICAgICAgICAgICAvL2Z1bGxXaWR0aDogXCJvblwiLFxuICAgICAgICAgICAgLy9mb3JjZUZ1bGxXaWR0aDogXCJvblwiLFxuICAgICAgICAgICAgLy9sYXp5TG9hZDogXCJvblwiXG4gICAgICAgICAgICAvLyBuYXZpZ2F0aW9uU3R5bGU6IFwicHJldmlldzRcIlxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy9lbHNlIHtcbiAgICAvLyAgICB0aGlzLnVubW91bnQodHJ1ZSk7XG4gICAgLy8gICAgcmlvdC5tb3VudCgncGFnZS1iYW5uZXInKTtcbiAgICAvL31cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvdW50bWVpbicsICc8c2VjdGlvbiBjbGFzcz1cImZ1bi1mYWN0LXdyYXAgZnVuLWZhY3RzLWJnXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIGZhY3RzLWluXCI+IDxoMz4gPHNwYW4gY2xhc3M9XCJjb3VudGVyXCI+ODc2LDUzOTwvc3Bhbj4rIDwvaDM+IDxoND5TeXN0ZW1zIFRoaW5rZXJzPC9oND4gPGJyPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCI+Q291bnQgTWUgSW48L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZXhwbG9yZScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPiA8c3Ryb25nPnsgaGVhZGVyLnRpdGxlIH08L3N0cm9uZz4gPC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cImN1YmUtbWFzb25yeVwiPiA8ZGl2IGlkPVwiZmlsdGVyc19jb250YWluZXJcIiBjbGFzcz1cImNicC1sLWZpbHRlcnMtYWxpZ25DZW50ZXJcIj4gPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gZmlsdGVycyB9XCIgZGF0YS1maWx0ZXI9XCIueyB2YWwudGFnIH1cIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbSB7IFxcJ2NicC1maWx0ZXItaXRlbS1hY3RpdmVcXCc6IGkgPT0gMCB9XCI+IHsgdmFsLm5hbWUgfSA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cIm1hc29ucnlfY29udGFpbmVyXCIgY2xhc3M9XCJjYnBcIj4gPGRpdiBpZD1cInsgaWQgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIiBlYWNoPVwieyBjb250ZW50IH1cIiBjbGFzcz1cImNicC1pdGVtIHsgdHlwZSB9IHsgXy5rZXlzKHRhZ3MpLmpvaW4oXFwnIFxcJykgfVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb25cIiBkYXRhLXRpdGxlPVwieyB0ZXh0IH1cIiBocmVmPVwieyBsaW5rIHx8IHBhcmVudC51cmwgKyB0eXBlICsgXFwnL1xcJyArIGltZyB9XCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIGlmPVwieyBpbWcgfVwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgdHlwZSArIFxcJy9cXCcgKyBpbWcgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGlmPVwieyB0aXRsZSB9XCIgY2xhc3M9XCJ7IFxcJ2NicC1sLWNhcHRpb24tdGl0bGVcXCc6IHRydWUgfVwiID57IHRpdGxlIH08L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+ICA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTUwXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgb25jbGljaz1cInsgc2hvd0FsbCB9XCIgY2xhc3M9XCJidG4gYnRuLXRoZW1lLWRhcmsgYnRuLWxnXCI+RXhwbG9yZSBBbGw8L2E+IDwvZGl2PicsICdpZD1cImV4cGxvcmVcIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbnRoaXMuc2hvd0FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKF90aGlzLm1hc29ucnlfY29udGFpbmVyKS5jdWJlcG9ydGZvbGlvKCdmaWx0ZXInLCAnKicpO1xufTtcblxudGhpcy5vbkNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICByaW90LnJvdXRlKF8ua2ViYWJDYXNlKGUuaXRlbS50aXRsZSksIGUsIF90aGlzKTtcbn07XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZXhwbG9yZScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5maWx0ZXJzID0gXy5zb3J0QnkoZGF0YS5maWx0ZXJzLCAnb3JkZXInKTtcbiAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICBfdGhpcy5pdGVtcyA9IF8uc29ydEJ5KF8ubWFwKGRhdGEuaXRlbXMsIGZ1bmN0aW9uICh2YWwsIGtleSkge1xuICAgICAgICBpZiAodmFsICYmICEodmFsLmFyY2hpdmUgPT09IHRydWUpKSB7XG4gICAgICAgICAgICB2YWwuaWQgPSBrZXk7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgfSksICdvcmRlcicpO1xuICAgIF90aGlzLmNvbnRlbnQgPSBfdGhpcy5pdGVtczsgLy9fLmZpbHRlciggdGhpcy5pdGVtcywgKGl0ZW0pID0+IHsgcmV0dXJuICEoaXRlbS5hcmNoaXZlID09PSB0cnVlKSB9ICk7XG4gICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICB2YXIgZGVmYXVsdEZpbHRlciA9IF8uZmlyc3QoX3RoaXMuZmlsdGVycywgZnVuY3Rpb24gKGZpbHRlcikge1xuICAgICAgICByZXR1cm4gZmlsdGVyWydkZWZhdWx0J10gPT09IHRydWU7XG4gICAgfSk7XG5cbiAgICAkKF90aGlzLm1hc29ucnlfY29udGFpbmVyKS5jdWJlcG9ydGZvbGlvKHtcbiAgICAgICAgZmlsdGVyczogJyNmaWx0ZXJzX2NvbnRhaW5lcicsXG4gICAgICAgIGxheW91dE1vZGU6ICdncmlkJyxcbiAgICAgICAgZGVmYXVsdEZpbHRlcjogJy4nICsgZGVmYXVsdEZpbHRlci50YWcsXG4gICAgICAgIGFuaW1hdGlvblR5cGU6ICdmbGlwT3V0RGVsYXknLFxuICAgICAgICBnYXBIb3Jpem9udGFsOiAyMCxcbiAgICAgICAgZ2FwVmVydGljYWw6IDIwLFxuICAgICAgICBncmlkQWRqdXN0bWVudDogJ3Jlc3BvbnNpdmUnLFxuICAgICAgICBtZWRpYVF1ZXJpZXM6IFt7XG4gICAgICAgICAgICB3aWR0aDogMTEwMCxcbiAgICAgICAgICAgIGNvbHM6IDRcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgIGNvbHM6IDNcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgIGNvbHM6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgd2lkdGg6IDMyMCxcbiAgICAgICAgICAgIGNvbHM6IDFcbiAgICAgICAgfV0sXG4gICAgICAgIGNhcHRpb246ICdvdmVybGF5Qm90dG9tQWxvbmcnLFxuICAgICAgICBkaXNwbGF5VHlwZTogJ2JvdHRvbVRvVG9wJyxcbiAgICAgICAgZGlzcGxheVR5cGVTcGVlZDogMTAwXG4gICAgfSk7XG59KTtcbi8vcmlvdC5tb3VudCgnbW9kYWwtZGlhbG9nJywgeyBldmVudDogZSwgdGFnOiB0aGlzIH0pXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgJzxmb290ZXIgaWQ9XCJmb290ZXJcIj4gPGRpdiBpZD1cImNvbnRhY3RcIiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+eyBkYXRhLmFib3V0LnRpdGxlIH08L2gzPiA8cCBzdHlsZT1cImNvbG9yOiAjZmZmO1wiPnsgZGF0YS5hYm91dC50ZXh0IH08L3A+IDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgY29udGFjdFwiPiA8bGkgZWFjaD1cInsgZGF0YS5jb250YWN0IH1cIj4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj4gPHN0cm9uZz4gPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT57IHRpdGxlIH06IDwvc3Ryb25nPiA8YSBpZj1cInsgbGluayB9XCIgaHJlZj1cInsgbGluayB9XCIgc3R5bGU9XCJjb2xvcjogI2ZmZlwiID57IGxpbmsgfTwvYT4gPHNwYW4gaWY9XCJ7ICFsaW5rIH1cIj57IHRleHQgfTwvc3Bhbj4gPC9wPiA8L2xpPiA8L3VsPiA8dWwgaWQ9XCJzb2NpYWxfZm9sbG93XCIgY2xhc3M9XCJsaXN0LWlubGluZSBzb2NpYWwtMVwiPiA8bGkgZWFjaD1cInsgZGF0YS5hYm91dC5zb2NpYWwgfVwiPiA8YSBocmVmPVwieyBsaW5rIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPkZvbGxvdyBVczwvaDM+IDxhIGlmPVwieyBzb2NpYWwudHdpdHRlciB9XCIgY2xhc3M9XCJ0d2l0dGVyLXRpbWVsaW5lXCIgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20veyBzb2NpYWwudHdpdHRlci50aXRsZSB9XCIgZGF0YS13aWRnZXQtaWQ9XCJ7IHNvY2lhbC50d2l0dGVyLmFwaSB9XCI+VHdlZXRzIGJ5IEB7IHNvY2lhbC50d2l0dGVyLnRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+TGlrZSBVczwvaDM+IDxkaXYgaWY9XCJ7IHNvY2lhbC5mYWNlYm9vayB9XCIgY2xhc3M9XCJmYi1wYWdlXCIgZGF0YS1ocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3sgc29jaWFsLmZhY2Vib29rLnRpdGxlIH1cIiBkYXRhLXNtYWxsLWhlYWRlcj1cInRydWVcIiBkYXRhLWFkYXB0LWNvbnRhaW5lci13aWR0aD1cInRydWVcIiBkYXRhLWhpZGUtY292ZXI9XCJmYWxzZVwiIGRhdGEtc2hvdy1mYWNlcGlsZT1cInRydWVcIiBkYXRhLWhlaWdodD1cIjMwMFwiIGRhdGEtc2hvdy1wb3N0cz1cInRydWVcIj4gPGRpdiBjbGFzcz1cImZiLXhmYm1sLXBhcnNlLWlnbm9yZVwiPiA8YmxvY2txdW90ZSBjaXRlPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3sgc29jaWFsLmZhY2Vib29rLnRpdGxlIH1cIj4gPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS97IHNvY2lhbC5mYWNlYm9vay50aXRsZSB9XCI+eyB0aXRsZSB9PC9hPiA8L2Jsb2NrcXVvdGU+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5Kb2luIFVzPC9oMz4gPGRpdiBpZD1cIm1jX2VtYmVkX3NpZ251cFwiPiA8Zm9ybSBhY3Rpb249XCIvL2NhYnJlcmFsYWJzLnVzNC5saXN0LW1hbmFnZS5jb20vc3Vic2NyaWJlL3Bvc3Q/dT01ODk0NzM4NTM4M2QzMjNjYWY5MDQ3ZjM5JmFtcDtpZD05Nzk5ZDNhN2I5XCIgbWV0aG9kPVwicG9zdFwiIGlkPVwibWMtZW1iZWRkZWQtc3Vic2NyaWJlLWZvcm1cIiBuYW1lPVwibWMtZW1iZWRkZWQtc3Vic2NyaWJlLWZvcm1cIiBjbGFzcz1cIlwiIHRhcmdldD1cIl9ibGFua1wiIG5vdmFsaWRhdGU9XCJcIj4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj57IGRhdGEubmV3c2xldHRlci50ZXh0IH08L3A+IDxkaXYgaWQ9XCJtY19lbWJlZF9zaWdudXBfc2Nyb2xsXCI+IDxkaXYgY2xhc3M9XCJtYy1maWVsZC1ncm91cFwiPiA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gPGlucHV0IHR5cGU9XCJlbWFpbFwiIHBsYWNlaG9sZGVyPVwiRW1haWwuLi5cIiBzdHlsZT1cImhlaWdodDogMzFweDtcIiB2YWx1ZT1cIlwiIG5hbWU9XCJFTUFJTFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtY2UtRU1BSUxcIj4gPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gPGlucHV0IHJvbGU9XCJidXR0b25cIiB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJTdWJzY3JpYmVcIiBuYW1lPVwic3Vic2NyaWJlXCIgaWQ9XCJtYy1lbWJlZGRlZC1zdWJzY3JpYmVcIiBjbGFzcz1cImJ0biBidG4tdGhlbWUtYmdcIj5TdWJzY3JpYmU8L2lucHV0PiA8L3NwYW4+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IC01MDAwcHg7XCI+IDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJiXzU4OTQ3Mzg1MzgzZDMyM2NhZjkwNDdmMzlfOTc5OWQzYTdiOVwiIHRhYmluZGV4PVwiLTFcIiB2YWx1ZT1cIlwiPiA8L2Rpdj4gPGRpdiBpZD1cIm1jZS1yZXNwb25zZXNcIiBjbGFzcz1cImNsZWFyXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiA1cHg7XCI+IDxkaXYgY2xhc3M9XCJyZXNwb25zZVwiIGlkPVwibWNlLWVycm9yLXJlc3BvbnNlXCIgc3R5bGU9XCJjb2xvcjogcmVkOyBkaXNwbGF5Om5vbmVcIj48L2Rpdj4gPGRpdiBjbGFzcz1cInJlc3BvbnNlXCIgaWQ9XCJtY2Utc3VjY2Vzcy1yZXNwb25zZVwiIHN0eWxlPVwiY29sb3I6ICNmZmY7IGRpc3BsYXk6bm9uZVwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZm9ybT4gPC9kaXY+ICAgPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDwvZGl2PiA8L2Zvb3Rlcj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG50aGlzLnNvY2lhbCA9IG51bGw7XG50aGlzLmRhdGEgPSBudWxsO1xudGhpcy50aXRsZSA9IEZyb250RW5kLmNvbmZpZy5zaXRlLnRpdGxlO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2Zvb3RlcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgIEZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvc29jaWFsJykudGhlbihmdW5jdGlvbiAoc29jaWFsKSB7XG4gICAgICAgIF90aGlzLnNvY2lhbCA9IHNvY2lhbDtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIEZyb250RW5kLmluaXRTb2NpYWwoKTtcbiAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWltcGFjdCcsICc8c2VjdGlvbj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMiBpZj1cInsgaGVhZGVyIH1cIj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJsZWFkXCI+IHsgaGVhZGVyLnRleHQgfSA8L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9XCJpbXBhY3Rfc2xpZGVyXCIgY2xhc3M9XCJvd2wtY2Fyb3VzZWxcIj4gPGRpdiBjbGFzcz1cIml0ZW1cIiBlYWNoPVwieyBpdGVtcyB9XCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGltZyBpZj1cInsgaW1nIH1cIiB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMTI1cHhcIiByaW90LXNyYz1cInsgcGFyZW50LnVybCB9aW1wYWN0L3sgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9pbXBhY3QnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMuaW1wYWN0X3NsaWRlcikub3dsQ2Fyb3VzZWwoe1xuICAgICAgICAgICAgICAgIGF1dG9QbGF5OiAzMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxuICAgICAgICAgICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5OTEsIDJdXG4gICAgICAgIH0pO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVzc2FnZScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+PHJhdyBjb250ZW50PVwieyBoZWFkZXIudGV4dCB9XCI+PC9yYXc+IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvdyBzcGVjaWFsLWZlYXR1cmVcIj4gPGRpdiBlYWNoPVwieyBpdGVtcyB9XCIgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBtYXJnaW4xMFwiPiA8ZGl2IGNsYXNzPVwicy1mZWF0dXJlLWJveCB0ZXh0LWNlbnRlciB3b3cgYW5pbWF0ZWQgZmFkZUluXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMjAwbXNcIj4gPGRpdiBjbGFzcz1cIm1hc2stdG9wXCI+ICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiAgPGg0PnsgdGl0bGUgfTwvaDQ+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibWFzay1ib3R0b21cIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gIDxwPnsgdGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuaGVhZGVyID0ge307XG50aGlzLml0ZW1zID0gW107XG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL21lc3NhZ2UnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWV0aG9kb2xvZ3knLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgY2xhc3M9XCJsZWFkXCI+eyBoZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlMzBcIj48L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoND57IGZyYW1ld29ya3MuaGVhZGVyLnRpdGxlIH08L2g0PiA8cCBjbGFzcz1cImxlYWRcIj57IGZyYW1ld29ya3MuaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJwYW5lbC1ncm91cFwiIGlkPVwiZnJhbWV3b3Jrc1wiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBmcmFtZXdvcmtzLml0ZW1zIH1cIiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj4gPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gPGg0IGNsYXNzPVwicGFuZWwtdGl0bGVcIj4gPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtcGFyZW50PVwiI2ZyYW1ld29ya3NcIiBocmVmPVwiI2NvbGxhcHNlRnJhbWV3b3Jrc197IGkgfVwiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9oND4gPC9kaXY+IDxkaXYgaWQ9XCJjb2xsYXBzZUZyYW1ld29ya3NfeyBpIH1cIiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlIHsgaW46IGkgPT0gMCB9XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+IHsgdmFsLnRleHQgfSA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoND57IHBhcnRuZXJzLmhlYWRlci50aXRsZSB9PC9oND4gPHAgY2xhc3M9XCJsZWFkXCI+eyBwYXJ0bmVycy5oZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInBhbmVsLWdyb3VwXCIgaWQ9XCJhY2NvcmRpb25cIj4gPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gcGFydG5lcnMuaXRlbXMgfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiA8aDQgY2xhc3M9XCJwYW5lbC10aXRsZVwiPiA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS1wYXJlbnQ9XCIjYWNjb3JkaW9uXCIgaHJlZj1cIiNjb2xsYXBzZU9uZV97IGkgfVwiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9oND4gPC9kaXY+IDxkaXYgaWQ9XCJjb2xsYXBzZU9uZV97IGkgfVwiIGNsYXNzPVwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgeyBpbjogaSA9PSAwIH1cIj4gPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4geyB2YWwudGV4dCB9IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbWV0aG9kb2xvZ3knKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5mcmFtZXdvcmtzID0gZGF0YS5mcmFtZXdvcmtzO1xuICAgICAgICBfdGhpcy5wYXJ0bmVycyA9IGRhdGEucGFydG5lcnM7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZW51LW5hdmJhcicsICc8ZGl2IGNsYXNzPVwibmF2YmFyLWNvbGxhcHNlIGNvbGxhcHNlXCI+IDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodFwiPiA8bGkgY2xhc3M9XCJ7IGRyb3Bkb3duOiB0cnVlLCBhY3RpdmU6IGkgPT0gMCB9XCIgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEgfVwiPiA8YSBpZj1cInsgdmFsLnRpdGxlIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCIgaHJlZj1cInsgdmFsLmxpbmsgfHwgXFwnI1xcJyB9XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+IDxpIGlmPVwieyB2YWwuaWNvbiB9XCIgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIiA+PC9pPiB7IHZhbC50aXRsZSB9IDxpIGlmPVwieyB2YWwubWVudSAmJiB2YWwubWVudS5sZW5ndGggfVwiIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiID48L2k+IDwvYT4gPHVsIGlmPVwieyB2YWwubWVudSAmJiB2YWwubWVudS5sZW5ndGggfVwiIGNsYXNzPVwiZHJvcGRvd24tbWVudSBtdWx0aS1sZXZlbFwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZHJvcGRvd25NZW51XCI+IDxsaSBlYWNoPVwieyB2YWwubWVudSB9XCIgPiA8YSBvbmNsaWNrPVwicGFyZW50Lm9uY2xpY2tcIiBocmVmPVwieyBsaW5rIHx8IFxcJyNcXCcgfVwiPiA8aSBpZj1cInsgaWNvbiB9XCIgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj4gPC9hPiA8L2xpPiA8L3VsPiA8L2xpPiA8L3VsPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5kYXRhID0gW107XG5cbnRoaXMub25DbGljayA9IGZ1bmN0aW9uIChlLCB0YWcpIHtcbiAgICBpZiAoZS5pdGVtICYmIGUuaXRlbS52YWwubGluaykge1xuICAgICAgICBGcm9udEVuZC5Sb3V0ZXIudG8oZS5pdGVtLnZhbC5saW5rKTtcbiAgICB9IGVsc2UgaWYgKGUuaXRlbSAmJiBlLml0ZW0udmFsLmFjdGlvbikge1xuICAgICAgICBjb25zb2xlLmxvZyhlLml0ZW0udmFsLmFjdGlvbik7XG4gICAgfVxufTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9uYXZiYXInKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuZGF0YSA9IF8uc29ydEJ5KGRhdGEsICdvcmRlcicpO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLXN0YXRpYy10b3AgeWFtbSBzdGlja3lcIiByb2xlPVwibmF2aWdhdGlvblwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJuYXZiYXItaGVhZGVyXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmF2YmFyLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj4gPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDwvYnV0dG9uPiA8ZGl2PiA8aW1nIGlmPVwieyBkYXRhIH1cIiBzdHlsZT1cIm1hcmdpbi10b3A6IDdweDsgbWFyZ2luLXJpZ2h0OiAxNXB4O1wiIHJpb3Qtc3JjPVwieyB1cmwgfXNpdGUveyBkYXRhLmltZyB9XCIgYWx0PVwieyBkYXRhLmFsdCB9XCI+IDwvZGl2PiA8L2Rpdj4gPHBhZ2UtbWVudS1uYXZiYXI+PC9wYWdlLW1lbnUtbmF2YmFyPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9sb2dvJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmV3cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8aDMgY2xhc3M9XCJoZWFkaW5nXCI+TGF0ZXN0IE5ld3M8L2gzPiA8ZGl2IGlkPVwibmV3c19jYXJvdXNlbFwiIGNsYXNzPVwib3dsLWNhcm91c2VsIG93bC1zcGFjZWRcIj4gPGRpdiBlYWNoPVwieyBkYXRhIH1cIj4gICA8ZGl2IGNsYXNzPVwibmV3cy1kZXNjXCI+IDxoNT4gPGEgaHJlZj1cInsgYnkgPyBsaW5rIDogXFwnamF2YXNjcmlwdDo7XFwnIH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj57IEh1bWFuaXplLnRydW5jYXRlKHRpdGxlLCAxMjUpIH08L2E+IDwvaDU+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL25ld3MnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBfLnRvQXJyYXkoZGF0YSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAkKF90aGlzLm5ld3NfY2Fyb3VzZWwpLm93bENhcm91c2VsKHtcbiAgICAgICAgICAgICAgICAvLyBNb3N0IGltcG9ydGFudCBvd2wgZmVhdHVyZXNcbiAgICAgICAgICAgICAgICBpdGVtczogNCxcbiAgICAgICAgICAgICAgICBpdGVtc0N1c3RvbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5ODAsIDJdLFxuICAgICAgICAgICAgICAgIGl0ZW1zVGFibGV0OiBbNzY4LCAyXSxcbiAgICAgICAgICAgICAgICBpdGVtc1RhYmxldFNtYWxsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtc01vYmlsZTogWzQ3OSwgMV0sXG4gICAgICAgICAgICAgICAgc2luZ2xlSXRlbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3RhcnREcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogNDAwMFxuICAgICAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRlc3RpbW9uaWFscycsICc8ZGl2IGlkPVwidGVzdGltb25pYWxzLWNhcm91c2VsXCIgY2xhc3M9XCJ0ZXN0aW1vbmlhbHMgdGVzdGltb25pYWxzLXYtMiB3b3cgYW5pbWF0ZWQgZmFkZUluVXBcIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIxMDBtc1wiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD57IGhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBpZD1cInRlc3RpbW9uaWFsX3NsaWRlXCIgY2xhc3M9XCJ0ZXN0aS1zbGlkZVwiPiA8dWwgY2xhc3M9XCJzbGlkZXNcIj4gPGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj4gPGltZyByaW90LXNyYz1cInsgcGFyZW50LnVybCArIGltZyB9XCIgYWx0PVwieyB1c2VyIH1cIj4gPGg0PiA8aSBjbGFzcz1cImZhIGZhLXF1b3RlLWxlZnQgaW9uLXF1b3RlXCI+PC9pPiB7IHRleHR9IDwvaDQ+IDxwIGNsYXNzPVwidGVzdC1hdXRob3JcIj4geyB1c2VyIH0gLSA8ZW0+eyBzdWJ0ZXh0IH08L2VtPiA8L3A+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3Rlc3RpbW9uaWFscycpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3Rlc3RpbW9uaWFscycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy50ZXN0aW1vbmlhbF9zbGlkZSkuZmxleHNsaWRlcih7XG4gICAgICAgICAgICAgICAgc2xpZGVzaG93U3BlZWQ6IDUwMDAsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uTmF2OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdmYWRlJ1xuICAgICAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdmb2xsb3ctZmFjZWJvb2snLCAnPGRpdiBjbGFzcz1cImZiLWZvbGxvd1wiIGRhdGEtaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS97IGRhdGEudGl0bGUgfVwiIGRhdGEtbGF5b3V0PVwic3RhbmRhcmRcIiBjb2xvcnNjaGVtZT1cImRhcmtcIiBkYXRhLXNob3ctZmFjZXM9XCJmYWxzZVwiPjwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBudWxsO1xudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHM7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7XHJcbiIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnZm9sbG93LXR3aXR0ZXInLCAnPGxpID4gPGEgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20veyBkYXRhLnRpdGxlIH1cIiBjbGFzcz1cInR3aXR0ZXItZm9sbG93LWJ1dHRvblwiIGRhdGEtc2hvdy1jb3VudD1cInRydWVcIj5Gb2xsb3cgQHsgZGF0YS50aXRsZSB9PC9hPiA8L2xpPicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBudWxsO1xudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHM7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB0d3R0ci53aWRnZXRzLmxvYWQoKTtcbiAgICB9XG59KTtcbn0pO1xyXG4iXX0=
