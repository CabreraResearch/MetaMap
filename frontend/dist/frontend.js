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
            google: {
                analytics: 'UA-63193554-2',
                tagmanager: 'GTM-KZQ2C2'
            }
        },
        THINK_WATER: {
            frontEnd: 'thinkwater',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'ThinkWater',
            google: {
                analytics: 'UA-63193554-2',
                tagmanager: 'GTM-KZQ2C2'
            }
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

        ga(this.config.site.google);
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
require('./tags/components/buttons.tag');
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

},{"./FrontEnd":1,"./js/mixins/config.js":10,"./tags/components/buttons.tag":11,"./tags/components/modal-dialog.tag":12,"./tags/dialogs/blog-dialog.tag":13,"./tags/page-banner.tag":14,"./tags/page-countmein.tag":15,"./tags/page-explore.tag":16,"./tags/page-footer.tag":17,"./tags/page-impact.tag":18,"./tags/page-message.tag":19,"./tags/page-methodology.tag":20,"./tags/page-navbar-menu.tag":21,"./tags/page-navbar.tag":22,"./tags/page-news.tag":23,"./tags/page-testimonials.tag":24,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"firepad":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var staticRoutes = {
    'contact': true,
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
                if (path.startsWith('!')) {
                    path = path.substr(1);
                }
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
                if (staticRoutes[path]) {
                    riot.route(path);
                } else {
                    riot.route('!' + path);
                }
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
                child.orderByChild('order').on('value', function (snapshot) {
                    var data = snapshot.val();
                    resolve(data);
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
                child.orderByChild('order').on(event, function (snapshot) {
                    var data = snapshot.val();
                    callback(data);
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

var googleAnalytics = function googleAnalytics(api) {

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

    //Google Tag Manager API
    (function (w, d, s, l, i) {
        w[l] = w[l] || [];w[l].push({
            'gtm.start': new Date().getTime(), event: 'gtm.js'
        });var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';j.async = true;j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', api.tagmanager);

    window.ga('create', api.analytics, 'auto');
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

    var tryCount = 0;
    var load = function load() {
        if (window.twttr && window.twttr.widgets) {
            return window.twttr.widgets.load();
        } else if (tryCount < 5) {
            tryCount += 1;
            _.delay(load, 250);
        }
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
module.exports = riot.tag('buttons', '<div class="row center-heading"> <span each="{ _.sortBy(opts.buttons,\'order\') }"> <a if="{ !amazonid }" role="button" data-link="{ link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { title } </a> <div if="{ amazonid }" class="col-sm-{ parent.cell } "> <iframe style="width: 120px; height: 240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" riot-src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=cabrreselab-20&marketplace=amazon&region=US&placement={ amazonid }&asins={ amazonid }&linkId=DIY3TUOPDFH3NQWF&show_border=false&link_opens_in_new_window=true"></iframe> </div> </span> </div>', function(opts) {var _this = this;

this.cell = 6;
this.on('mount', function () {
    if (opts && opts.buttons) {
        _this.cell = Math.round(12 / _.keys(opts.buttons).length);
        _this.update();
    }
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
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
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('blog-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> </div> <iframe if="{ data.youtubeid }" id="ytplayer" type="text/html" width="720" height="405" riot-src="https://www.youtube.com/embed/{ data.youtubeid }?autoplay=1" frameborder="0" allowfullscreen=""></iframe> <iframe if="{ data.vimeoid }" riot-src="https://player.vimeo.com/video/{ data.vimeoid }" width="720" height="405" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""> </iframe> <div if="{ blog }" class="row"> <div class="col-sm-10 "> <div > <raw content="{ blog }"></raw> </div> <buttons buttons="{ data.buttons }"></buttons> </div> <div class="well col-sm-2" riot-style="width: 120px; position: fixed; margin-left: { margin }px"> <ul class="list-unstyled contact "> <li> <a href="https://twitter.com/share" class="twitter-share-button" data-via="{ social.twitter.title }">Tweet</a> </li> <li> <div style="margin-top: 10px;" id="gplusone" class="g-plusone" data-size="small"></div> </li> <li> <div class="fb-share-button" data-href="{ url }" data-layout="button_count"></div> </li> </ul> </div> </div> <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons> </div> </div>', function(opts) {var _this = this;

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
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li each="{ data }" data-transition="fade" data-slotamount="5" data-title="{ title }" style="background: rgb(240,110,30);" >  <img if="{ !youtubeid && img }" riot-src="{ parent.url + img }" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div if="{ !youtubeid && title }" class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> <raw content="{ title }"></raw> </div> <div if="{ !youtubeid && subtext }" class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> <raw content="{ subtext }"></raw> </div> <div if="{ !youtubeid }" each="{ _.sortBy(buttons, \'order\') }"> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut" onclick="{ parent.getLink }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> <div if="{ youtubeid }" class="tp-caption sft customout tp-videolayer" data-x="center" data-hoffset="0" data-y="center" data-voffset="0" data-customin="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:5;scaleY:5;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-customout="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:0.75;scaleY:0.75;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-speed="600" data-start="1000" data-easing="Power4.easeOut" data-endspeed="500" data-endeasing="Power4.easeOut" data-autoplay="true" data-autoplayonlyfirsttime="false" data-nextslideatend="false" data-thumbimage="https://img.youtube.com/vi/{ youtubeid }/mqdefault.jpg"> <iframe riot-src="https://www.youtube.com/embed/{ youtubeid }?hd=1&wmode=opaque&controls=1&showinfo=0" width="1066px" height="600px" style="width:1066px;height:600px;"> </iframe> </div> </li> </ul> </div> </div>', 'id="home"', function(opts) {var _this = this;

this.data = [];
this.mixin('config');
this.url = this.pathImg('site');
this.mounted = false;

this.watchData('/banner', function (data) {
    if (false == _this.mounted) {
        _this.mounted = true;
        _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
            return i.archive != true;
        });
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
module.exports = riot.tag('page-countmein', '<section style="background: rgb(212, 214, 215);"> <div class="divide50"></div> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p class="lead">{ header.text }</p> </div> </div> </div> <div class="divide30"></div> <div class="row"> <div class="col-md-6"> <div id="impact_img" class="row"> <img class="img-responsive" alt="7 billion thinkers" riot-src="{ url+impact.img }"></img> </div> <div class="row"> <h4 style="color: #f06e1e;">{ impact.text }</h4> </div> </div>  <div class="col-md-6"> <div class="facts-in"> <h3 style="color: #f06e1e;"> <span id="counter" class="counter">{ data.total }</span>+ </h3> <h4 style="color: #f06e1e;">{ engage.subtext }</h4> <br> <div class="center-heading" style="margin-bottom: 0px;"> <p style="font-size: 26px; color: #f06e1e;" class="pill">{ engage.hashtag }</p> </div> </div> <div class="no-padding-inner gray"> <h3 class="wow animated fadeInDownfadeInRight animated" style="visibility: visible; text-align: center;"> <span class="colored-text">Six</span> things you can do </h3> <div each="{ val, i in _.sortBy(engage.options, \'order\') }" class="services-box margin30 wow animated fadeInRight animated" style="visibility: visible; animation-name: fadeInRight; -webkit-animation-name: fadeInRight;"> <div class="services-box-icon"> <i class="{ val.icon }"></i> </div> <div class="services-box-info"> <h4>{ val.title }</h4> <p>{ val.text }</p> <div if="{ val.buttons }" each="{ _.sortBy(val.buttons, \'order\') }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> </div> </div>  </div> </div> </div> </section>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg('site');

FrontEnd.MetaFire.getData(FrontEnd.site + '/count-me-in').then(function (data) {
    _this.data = data;
    _this.impact = data.impact;
    _this.engage = data.engage;
    _this.header = data.header;

    _this.update();

    $(_this.counter).counterUp({
        delay: 100,
        time: 800
    });
});
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-explore', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <div id="{ id }" onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption"> <div class="cbp-caption-defaultWrap"> <img if="{ img }" riot-src="{ parent.url + type + \'/\' + img }" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ title }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </div> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="javascript:;" onclick="{ showAll }" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', 'id="explore"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

this.showAll = function () {
    $(_this.masonry_container).cubeportfolio('filter', '*');
};

this.onClick = function (e) {
    FrontEnd.Router.to(_.kebabCase(e.item.title), e, _this);
};

FrontEnd.MetaFire.getData(FrontEnd.site + '/explore').then(function (data) {
    _this.filters = _.filter(_.sortBy(data.filters, 'order'), function (i) {
        return i.archive != true;
    });
    _this.header = data.header;
    _this.items = _.sortBy(_.map(data.items, function (val, key) {
        if (val && !(val.archive === true)) {
            val.id = key;
            return val;
        }
    }), 'order');
    _this.content = _this.items;
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
});
},{"riot":"riot"}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div id="contact" class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p style="color: #fff;">{ data.about.text }</p> <ul class="list-unstyled contact"> <li each="{ _.sortBy(data.contact,\'order\') }"> <p style="color: #fff;"> <strong> <i class="{ icon }"></i>{ title || \'\' } </strong> <a if="{ link }" href="{ link }" style="color: #fff" >{ text || link }</a> <span if="{ !link }">{ text }</span> </p> </li> </ul> <ul id="social_follow" class="list-inline social-1"> <li each="{ _.sortBy(data.about.social, \'order\') }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Follow Us</h3> <a if="{ social.twitter }" class="twitter-timeline" href="https://twitter.com/{ social.twitter.title }" data-widget-id="{ social.twitter.api }">Tweets by @{ social.twitter.title }</a> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Like Us</h3> <div if="{ social.facebook }" class="fb-page" data-href="https://www.facebook.com/{ social.facebook.title }" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-height="300" data-width="280" data-show-posts="true"> <div class="fb-xfbml-parse-ignore"> <blockquote cite="https://www.facebook.com/{ social.facebook.title }"> <a href="https://www.facebook.com/{ social.facebook.title }">{ title }</a> </blockquote> </div> </div> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Join Us</h3> <div id="mc_embed_signup"> <form action="//cabreralabs.us4.list-manage.com/subscribe/post?u=58947385383d323caf9047f39&amp;id=9799d3a7b9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="" target="_blank" novalidate=""> <p style="color: #fff;">{ data.newsletter.text }</p> <div id="mc_embed_signup_scroll"> <div class="mc-field-group"> <div class="input-group"> <input type="email" placeholder="Email..." style="height: 31px;" value="" name="EMAIL" class="form-control" id="mce-EMAIL"> <span class="input-group-btn"> <input role="button" type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="btn btn-theme-bg">Subscribe</input> </span> </div> </div>  <div style="position: absolute; left: -5000px;"> <input type="text" name="b_58947385383d323caf9047f39_9799d3a7b9" tabindex="-1" value=""> </div> <div id="mce-responses" class="clear" style="margin-top: 5px;"> <div class="response" id="mce-error-response" style="color: red; display:none"></div> <div class="response" id="mce-success-response" style="color: #fff; display:none"></div> </div> </div> </form> </div> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

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
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
                return i.archive != true;
        });
        _this.update();

        $(_this.impact_slider).owlCarousel({
                autoPlay: 5000,
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
    _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
        return i.archive != true;
    });
    _this.update();
});
});
},{"riot":"riot"}],20:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-methodology', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p class="lead">{ header.text }</p> </div> </div> </div> <div class="divide30"></div> <div class="row"> <div class="col-md-6"> <div class="center-heading"> <h4>{ frameworks.header.title }</h4> <p class="lead">{ frameworks.header.text }</p> </div> <div class="panel-group" id="frameworks"> <div each="{ val, i in _.sortBy(frameworks.items, \'order\') }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#frameworks" href="#collapseFrameworks_{ i }"> { val.title } </a> </h4> </div> <div id="collapseFrameworks_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div>  <div class="col-md-6"> <div class="center-heading"> <h4>{ partners.header.title }</h4> <p class="lead">{ partners.header.text }</p> </div> <div class="panel-group" id="accordion"> <div each="{ val, i in _.sortBy(partners.items, \'order\') }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne_{ i }"> { val.title } </a> </h4> </div> <div id="collapseOne_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

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
    _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
        return i.archive != true;
    });
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
module.exports = riot.tag('page-news', '<div class="container"> <div class="row"> <div class="col-md-12"> <h3 class="heading">Latest News</h3> <div id="news_carousel" class="owl-carousel owl-spaced"> <div each="{ data }"> <div class="news-desc"> <p> <a href="{ link }" target="_blank">{ Humanize.truncate(title, 125) }</a> </p> </div> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.data = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/news').then(function (data) {
    _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
        return i.archive != true;
    });
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
        autoPlay: 5000,
        loop: true
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
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
                return i.archive != true;
        });
        _this.update();

        $(_this.testimonial_slide).flexslider({
                slideshowSpeed: 5000,
                directionNav: false,
                animation: 'fade'
        });
});
});
},{"riot":"riot"}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvY29yZS9Sb3V0ZXIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9mYWNlYm9vay5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdHdpdHRlci5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvYnV0dG9ucy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9jb21wb25lbnRzL21vZGFsLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL2Jsb2ctZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtYmFubmVyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtY291bnRtZWluLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtZXhwbG9yZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWZvb3Rlci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWltcGFjdC50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW1lc3NhZ2UudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tZXRob2RvbG9neS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5hdmJhci1tZW51LnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbmF2YmFyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbmV3cy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMvQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2hELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ3RELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOztBQUV4RCxJQUFNLFFBQVEsR0FBRywySUFBMkksQ0FBQzs7QUFFN0osSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLEdBQVM7QUFDakIsUUFBTSxLQUFLLEdBQUc7QUFDVixXQUFHLEVBQUU7QUFDRCxvQkFBUSxFQUFFLE9BQU87QUFDakIsY0FBRSxFQUFFLGtCQUFrQjtBQUN0QixzQkFBVSxFQUFFLEVBQUU7QUFDZCxpQkFBSyxFQUFFLHNCQUFzQjtBQUM3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QUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UnKTtcclxubGV0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAnKTtcclxubGV0IHVzZXJzbmFwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAnKTtcclxubGV0IHJpb3QgPSB3aW5kb3cucmlvdDtcclxubGV0IFJvdXRlciA9IHJlcXVpcmUoJy4vanMvY29yZS9Sb3V0ZXInKTtcclxubGV0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XHJcbmxldCB0d2l0dGVyID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdHdpdHRlci5qcycpO1xyXG5sZXQgZmFjZWJvb2sgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9mYWNlYm9vay5qcycpO1xyXG5cclxuY29uc3QgaW1hZ2VVcmwgPSAnLy9jNjhmNzk4MWE4YmJlOTI2YTFlMDE1NGNiZmJkNWFmMWI0ZGYwZjIxLmdvb2dsZWRyaXZlLmNvbS9ob3N0LzBCNkdBTjRnWDFiblNmbFJuZFRSSmVGWjVORXN6U0VGbFN6VktaRFpKU3pGeGVEZGljRnBvTFhWd1NETkZSV04wUkZoZlMyYy8nO1xyXG5cclxuY29uc3QgY29uZmlnID0gKCkgPT4ge1xyXG4gICAgY29uc3QgU0lURVMgPSB7XHJcbiAgICAgICAgQ1JMOiB7XHJcbiAgICAgICAgICAgIGZyb250RW5kOiAnY3JsYWInLFxyXG4gICAgICAgICAgICBkYjogJ3BvcHBpbmctZmlyZS04OTcnLFxyXG4gICAgICAgICAgICBtZXRhTWFwVXJsOiAnJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdDYWJyZXJhIFJlc2VhcmNoIExhYicsXHJcbiAgICAgICAgICAgIGdvb2dsZToge1xyXG4gICAgICAgICAgICAgICAgYW5hbHl0aWNzOiAnVUEtNjMxOTM1NTQtMicsXHJcbiAgICAgICAgICAgICAgICB0YWdtYW5hZ2VyOiAnR1RNLUtaUTJDMidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVEhJTktfV0FURVI6IHtcclxuICAgICAgICAgICAgZnJvbnRFbmQ6ICd0aGlua3dhdGVyJyxcclxuICAgICAgICAgICAgZGI6ICdwb3BwaW5nLWZpcmUtODk3JyxcclxuICAgICAgICAgICAgbWV0YU1hcFVybDogJycsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnVGhpbmtXYXRlcicsXHJcbiAgICAgICAgICAgIGdvb2dsZToge1xyXG4gICAgICAgICAgICAgICAgYW5hbHl0aWNzOiAnVUEtNjMxOTM1NTQtMicsXHJcbiAgICAgICAgICAgICAgICB0YWdtYW5hZ2VyOiAnR1RNLUtaUTJDMidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXQgPSB7XHJcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3QsXHJcbiAgICAgICAgc2l0ZToge31cclxuICAgIH1cclxuICAgIGxldCBzZWdtZW50cyA9IHJldC5ob3N0LnNwbGl0KCcuJyk7XHJcbiAgICBsZXQgZmlyc3QgPSBzZWdtZW50c1swXTtcclxuICAgIGlmIChmaXJzdCA9PT0gJ3d3dycpIHtcclxuICAgICAgICBmaXJzdCA9IHNlZ21lbnRzWzFdO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgY2FzZSAnbWV0YS1tYXAtc3RhZ2luZyc6XHJcbiAgICAgICAgY2FzZSAnZnJvbnRlbmQnOlxyXG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydDUkwnXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAndGhpbmt3YXRlci1zdGFnaW5nJzpcclxuICAgICAgICBjYXNlICd0aGlua3dhdGVyJzpcclxuICAgICAgICAgICAgcmV0LnNpdGUgPSBTSVRFU1snVEhJTktfV0FURVInXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy9Gb3Igbm93LCBkZWZhdWx0IHRvIENSTFxyXG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydDUkwnXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmZyZWV6ZShyZXQpO1xyXG4gICAgcmV0dXJuIHJldDtcclxufTtcclxuXHJcbmNsYXNzIEZyb250RW5kIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWdzKSB7XHJcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZygpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuY29uZmlnLnNpdGUudGl0bGU7XHJcbiAgICAgICAgbGV0IGZhdmljbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYXZpY28nKTtcclxuICAgICAgICBmYXZpY28uc2V0QXR0cmlidXRlKCdocmVmJywgYCR7aW1hZ2VVcmx9JHt0aGlzLmNvbmZpZy5zaXRlLmZyb250RW5kfS9mYXZpY29uLmljb2ApO1xyXG5cclxuICAgICAgICB0aGlzLk1ldGFGaXJlID0gbmV3IE1ldGFGaXJlKHRoaXMuY29uZmlnKTtcclxuICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKHRoaXMuY29uZmlnKTtcclxuXHJcbiAgICAgICAgZ2EodGhpcy5jb25maWcuc2l0ZS5nb29nbGUpO1xyXG4gICAgICAgIHRoaXMuaW5pdFR3aXR0ZXIgPSB0d2l0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RmFjZWJvb2sgPSBmYWNlYm9vaygpO1xyXG4gICAgICAgIHVzZXJzbmFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFNvY2lhbCgpIHtcclxuICAgICAgICB0aGlzLmluaXRUd2l0dGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RmFjZWJvb2soKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc2l0ZS5mcm9udEVuZDtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIC8vXy5lYWNoKHRoaXMudGFncywgKHRhZykgPT4ge1xyXG4gICAgICAgIC8vICAgIHJpb3QubW91bnQodGFnLCB0aGlzKTtcclxuICAgICAgICAvL30pO1xyXG4gICAgICAgIHJpb3QubW91bnQoJyonKTtcclxuICAgICAgICB0aGlzLlJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dpbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dvdXQoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGcm9udEVuZDsiLCJyZXF1aXJlKCdiYWJlbC9wb2x5ZmlsbCcpO1xyXG53aW5kb3cucmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxud2luZG93Ll8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxud2luZG93LlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5yZXF1aXJlKCdjb3JlLWpzJyk7XHJcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5yZXF1aXJlKCdqcXVlcnktdWknKTtcclxucmVxdWlyZSgnYm9vdHN0cmFwJyk7XHJcbndpbmRvdy5GaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbndpbmRvdy5GaXJlcGFkID0gcmVxdWlyZSgnZmlyZXBhZCcpO1xyXG53aW5kb3cuSHVtYW5pemUgPSByZXF1aXJlKCdodW1hbml6ZS1wbHVzJyk7XHJcbndpbmRvdy5tb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxud2luZG93LlVSSSA9IHJlcXVpcmUoJ1VSSWpzJyk7XHJcbndpbmRvdy5sb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJyk7XHJcbndpbmRvdy5QcyA9IHJlcXVpcmUoJ3BlcmZlY3Qtc2Nyb2xsYmFyJyk7XHJcblxyXG5sZXQgdGFncyA9IFtcclxuICAgICdwYWdlLWhlYWQnLFxyXG4gICAgJ3BhZ2UtYmFubmVyJyxcclxuICAgICdwYWdlLWltcGFjdCcsXHJcbiAgICAncGFnZS1jb3VudG1laW4nLFxyXG4gICAgJ3BhZ2UtZm9vdGVyJyxcclxuICAgICdwYWdlLW5hdmJhci1tZW51JyxcclxuICAgICdwYWdlLW5hdmJhcicsXHJcbiAgICAncGFnZS1uZXdzJyxcclxuICAgICdwYWdlLWV4cGxvcmUnLFxyXG4gICAgJ3BhZ2UtbWVzc2FnZScsXHJcbiAgICAncGFnZS1tZXRob2RvbG9neScsXHJcbiAgICAncGFnZS10ZXN0aW1vbmlhbHMnXHJcbl07XHJcblxyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy9ibG9nLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2NvbXBvbmVudHMvYnV0dG9ucy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2NvbXBvbmVudHMvbW9kYWwtZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1iYW5uZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWltcGFjdC50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtY291bnRtZWluLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1mb290ZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci1tZW51LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uYXZiYXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5ld3MudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWV4cGxvcmUudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW1lc3NhZ2UudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW1ldGhvZG9sb2d5LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnJyk7XHJcblxyXG52YXIgY29uZmlnTWl4aW4gPSByZXF1aXJlKCcuL2pzL21peGlucy9jb25maWcuanMnKTtcclxucmlvdC5taXhpbignY29uZmlnJywgY29uZmlnTWl4aW4pO1xyXG5cclxucmlvdC50YWcoJ3JhdycsICc8c3Bhbj48L3NwYW4+JywgZnVuY3Rpb24gKG9wdHMpIHtcclxuICAgIHRoaXMudXBkYXRlQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gKG9wdHMpID8gKG9wdHMuY29udGVudCB8fCAnJykgOiAnJztcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbn0pO1xyXG5cclxudmFyIEZyb250RW5kID0gcmVxdWlyZSgnLi9Gcm9udEVuZCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBGcm9udEVuZCh0YWdzKTsiLCJjb25zdCBzdGF0aWNSb3V0ZXMgPSB7XHJcbiAgICAnY29udGFjdCc6IHRydWUsXHJcbiAgICAnaG9tZSc6IHRydWUsXHJcbiAgICAnZXhwbG9yZSc6IHRydWVcclxufVxyXG5cclxuY2xhc3MgUm91dGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICByaW90LnJvdXRlLnN0YXJ0KCk7XHJcbiAgICAgICAgcmlvdC5yb3V0ZSgodGFyZ2V0LCAuLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSB0aGlzLmdldFBhdGgodGFyZ2V0KTtcclxuICAgICAgICAgICAgaWYgKCFzdGF0aWNSb3V0ZXNbcGF0aF0pIHtcclxuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoJ21vZGFsLWRpYWxvZycsIHsgaWQ6IHBhdGggfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvKHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIHJldHVybiByb3V0ZS5nZXRQYXRoKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0byhwYXRoKSB7XHJcbiAgICAgICAgcGF0aCA9IHJvdXRlLmdldFBhdGgocGF0aCk7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHN0YXRpY1JvdXRlc1twYXRoXSkge1xyXG4gICAgICAgICAgICAgICAgcmlvdC5yb3V0ZShwYXRoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJpb3Qucm91dGUoYCEke3BhdGh9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gcm91dGUudG8ocGF0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHJvdXRlID0gUm91dGVyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXI7IiwibGV0IEF1dGgwTG9jayA9IHJlcXVpcmUoJ2F1dGgwLWxvY2snKTtcclxubGV0IFByb21pc2UgPSB3aW5kb3cuUHJvbWlzZTtcclxubGV0IGxvY2FsZm9yYWdlID0gd2luZG93LmxvY2FsZm9yYWdlO1xyXG5cclxuY2xhc3MgQXV0aDAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKCd3c09uYXJ0MjN5VmlJU2hxVDR3ZkoxOHcydnQyY2wzMicsICdtZXRhbWFwLmF1dGgwLmNvbScpO1xyXG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb2ZpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmxvY2suc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5BZnRlclNpZ251cDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3JlZnJlc2hfdG9rZW4nLCByZWZyZXNoX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaWRfdG9rZW4gPSBpZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnJlZnJlc2hfdG9rZW4gPSByZWZyZXNoX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBsaW5rQWNjb3VudCgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5sb2NrLnNob3coe1xyXG4gICAgICAgICAgICBjYWxsYmFja1VSTDogdGhhdC5jYWxsYmFja1VSTCxcclxuICAgICAgICAgICAgZGljdDoge1xyXG4gICAgICAgICAgICAgICAgc2lnbmluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoYXQuaWRfdG9rZW4gfHwgdGhhdC5wcm9maWxlLmlkZW50aXRpZXNbMF0uYWNjZXNzX3Rva2VuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZXNzaW9uKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgZ2V0UHJvZmlsZSA9IChpZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgZnVuY3Rpb24oZXJyLCBwcm9maWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5wcm9maWxlID0gcHJvZmlsZTtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZnVsZmlsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ3JlZnJlc2hfdG9rZW4nKS50aGVuKCh0b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLmdldENsaWVudCgpLnJlZnJlc2hUb2tlbih0b2tlbiwgKGEsIHRva09iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKHRva09iai5pZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb2ZpbGUoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ2lkX3Rva2VuJyk7XHJcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgncmVmcmVzaF90b2tlbicpO1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3Byb2ZpbGUnKTtcclxuICAgICAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgZmFjZWJvb2tBcGkgPSBmdW5jdGlvbiAoYXBpS2V5KSB7XHJcbiAgICBcclxuICAgIHdpbmRvdy5mYkFzeW5jSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuRkIuaW5pdCh7XHJcbiAgICAgICAgICAgIGFwcElkOiAnODQ3NzAyNzc1MzA0OTA2JyxcclxuICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgIHZlcnNpb246ICd2Mi4zJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdO1xyXG4gICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAganMuc3JjID0gXCIvL2Nvbm5lY3QuZmFjZWJvb2submV0L2VuX1VTL3Nkay5qc1wiO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgIH0oZG9jdW1lbnQsICdzY3JpcHQnLCAnZmFjZWJvb2stanNzZGsnKSk7XHJcblxyXG4gICAgcmV0dXJuIHdpbmRvdy5mYkFzeW5jSW5pdDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmFjZWJvb2tBcGk7XHJcblxyXG5cclxuIiwibGV0IEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKTtcclxubGV0IFByb21pc2UgPSB3aW5kb3cuUHJvbWlzZTtcclxubGV0IGxvY2FsZm9yYWdlID0gd2luZG93LmxvY2FsZm9yYWdlO1xyXG5sZXQgTWV0YU1hcCA9IHdpbmRvdy5NZXRhTWFwO1xyXG5cclxuY2xhc3MgTWV0YUZpcmUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmZiID0gbmV3IEZpcmViYXNlKGBodHRwczovLyR7dGhpcy5jb25maWcuc2l0ZS5kYn0uZmlyZWJhc2Vpby5jb21gKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IHJldCA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5BdXRoMC5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBwcm9maWxlLmNsaWVudElELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogaWRfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnZmlyZWJhc2VfdG9rZW4nLCB0aGF0LmZpcmViYXNlX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYi5hdXRoV2l0aEN1c3RvbVRva2VuKHRoYXQuZmlyZWJhc2VfdG9rZW4sIChlcnJvciwgYXV0aERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGlsZChwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmIuY2hpbGQocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YSAocGF0aCkge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNoaWxkLm9yZGVyQnlDaGlsZCgnb3JkZXInKS5vbigndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBvbiAocGF0aCwgY2FsbGJhY2ssIGV2ZW50ID0gJ3ZhbHVlJyApIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICBjaGlsZC5vcmRlckJ5Q2hpbGQoJ29yZGVyJykub24oZXZlbnQsIChzbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YSAoZGF0YSwgcGF0aCkge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2hpbGQuc2V0KGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCAoKSB7XHJcbiAgICAgICAgdGhpcy5mYi51bmF1dGgoKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGFGaXJlOyIsIlxyXG52YXIgZ29vZ2xlQW5hbHl0aWNzID0gZnVuY3Rpb24gKGFwaSkge1xyXG4gICAgXHJcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IHBvLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JzsgcG8uYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XHJcbiAgICAgICAgdmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xyXG4gICAgfSkoKTtcclxuXHJcbiAgICAvLyBHb29nbGUgQW5hbHl0aWNzIEFQSVxyXG4gIChmdW5jdGlvbihpLHMsbyxnLHIsYSxtKXtpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXT1yO2lbcl09aVtyXXx8ZnVuY3Rpb24oKXtcclxuICAgICAgKGlbcl0ucT1pW3JdLnF8fFtdKS5wdXNoKGFyZ3VtZW50cyl9LGlbcl0ubD0xKm5ldyBEYXRlKCk7YT1zLmNyZWF0ZUVsZW1lbnQobyksXHJcbiAgICAgIG09cy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTthLmFzeW5jPTE7YS5zcmM9ZztcclxuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcclxuICB9KSh3aW5kb3csZG9jdW1lbnQsJ3NjcmlwdCcsJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsJ2dhJyk7XHJcblxyXG4gICAgLy9Hb29nbGUgVGFnIE1hbmFnZXIgQVBJXHJcbiAgKGZ1bmN0aW9uICh3LCBkLCBzLCBsLCBpKSB7XHJcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xyXG4gICAgICAgICAgJ2d0bS5zdGFydCc6XHJcbiAgICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXHJcbiAgICAgIH0pOyB2YXIgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxyXG4gICAgICAnLy93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RtLmpzP2lkPScgKyBpICsgZGw7IGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XHJcbiAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCBhcGkudGFnbWFuYWdlcik7XHJcblxyXG4gICAgd2luZG93LmdhKCdjcmVhdGUnLCBhcGkuYW5hbHl0aWNzLCAnYXV0bycpO1xyXG4gICAgd2luZG93LmdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgICByZXR1cm4gd2luZG93LmdhO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnb29nbGVBbmFseXRpY3M7XHJcblxyXG5cclxuIiwiXHJcbnZhciB0d2l0dGVyQXBpID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgXHJcbiAgICB3aW5kb3cudHd0dHIgPSAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgICAgdCA9IHdpbmRvdy50d3R0ciB8fCB7fTtcclxuICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xyXG4gICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAganMuc3JjID0gXCJodHRwczovL3BsYXRmb3JtLnR3aXR0ZXIuY29tL3dpZGdldHMuanNcIjtcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgIHQuX2UgPSBbXTtcclxuICAgICAgICB0LnJlYWR5ID0gZnVuY3Rpb24gKGYpIHtcclxuICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfShkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJ0d2l0dGVyLXdqc1wiKSk7XHJcblxyXG4gICAgbGV0IHRyeUNvdW50ID0gMDtcclxuICAgIGxldCBsb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cudHd0dHIgJiYgd2luZG93LnR3dHRyLndpZGdldHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy50d3R0ci53aWRnZXRzLmxvYWQoKTtcclxuICAgICAgICB9IGVsc2UgaWYodHJ5Q291bnQgPCA1KSB7XHJcbiAgICAgICAgICAgIHRyeUNvdW50ICs9IDE7XHJcbiAgICAgICAgICAgIF8uZGVsYXkobG9hZCwgMjUwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxvYWQ7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0d2l0dGVyQXBpO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgdXNlclNuYXAgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICB2YXIgYXBpS2V5ID0gJzAzMmJhZjg3LTg1NDUtNGViYy1hNTU3LTkzNDg1OTM3MWZhNS5qcycsIHMsIHg7XHJcbiAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICBjb25maWcgPSB7fTtcclxuICAgIH1cclxuICAgIGFwaUtleSA9IGNvbmZpZy5VU0VSX1NOQVBfQVBJX0tFWTtcclxuICAgIGlmIChhcGlLZXkgJiYgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICE9PSAnbG9jYWxob3N0Jykge1xyXG4gICAgICAgIHdpbmRvdy51c2Vyc25hcGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgbW9kZTogJ3JlcG9ydCcsXHJcbiAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxyXG4gICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNuYXAuc2V0RW1haWxCb3goRG9jLmFwcC51c2VyLnVzZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIHMuc3JjID0gJy8vYXBpLnVzZXJzbmFwLmNvbS9sb2FkLycgKyBhcGlLZXkgKyAnLmpzJztcclxuICAgICAgICB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcclxuICAgICAgICByZXR1cm4geC5hcHBlbmRDaGlsZChzKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXNlclNuYXA7XHJcblxyXG5cclxuIiwiXHJcbmxldCBjb25maWcgPSB7XHJcbiAgICBwYXRoSW1nOiAoZm9sZGVyKSA9PiB7XHJcbiAgICAgICAgbGV0IHJldCA9IGAvL2M2OGY3OTgxYThiYmU5MjZhMWUwMTU0Y2JmYmQ1YWYxYjRkZjBmMjEuZ29vZ2xlZHJpdmUuY29tL2hvc3QvMEI2R0FONGdYMWJuU2ZsUm5kVFJKZUZaNU5Fc3pTRUZsU3pWS1pEWkpTekZ4ZURkaWNGcG9MWFZ3U0RORlJXTjBSRmhmUzJjLyR7d2luZG93LkZyb250RW5kLnNpdGV9L2A7XHJcbiAgICAgICAgaWYgKGZvbGRlcikge1xyXG4gICAgICAgICAgICByZXQgKz0gYCR7Zm9sZGVyfS9gO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfSxcclxuICAgIGdldERhdGE6IChwYXRoLCBjYWxsYmFjaywgdGhhdCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5NZXRhRmlyZS5vbihgJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vJHtwYXRofWAsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoYXQudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB3YXRjaERhdGE6IChwYXRoLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5NZXRhRmlyZS5vbihgJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vJHtwYXRofWAsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29uZmlnOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnYnV0dG9ucycsICc8ZGl2IGNsYXNzPVwicm93IGNlbnRlci1oZWFkaW5nXCI+IDxzcGFuIGVhY2g9XCJ7IF8uc29ydEJ5KG9wdHMuYnV0dG9ucyxcXCdvcmRlclxcJykgfVwiPiA8YSBpZj1cInsgIWFtYXpvbmlkIH1cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS1saW5rPVwieyBsaW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB0aXRsZSB9IDwvYT4gPGRpdiBpZj1cInsgYW1hem9uaWQgfVwiIGNsYXNzPVwiY29sLXNtLXsgcGFyZW50LmNlbGwgfSBcIj4gPGlmcmFtZSBzdHlsZT1cIndpZHRoOiAxMjBweDsgaGVpZ2h0OiAyNDBweDtcIiBtYXJnaW53aWR0aD1cIjBcIiBtYXJnaW5oZWlnaHQ9XCIwXCIgc2Nyb2xsaW5nPVwibm9cIiBmcmFtZWJvcmRlcj1cIjBcIiByaW90LXNyYz1cIi8vd3MtbmEuYW1hem9uLWFkc3lzdGVtLmNvbS93aWRnZXRzL3E/U2VydmljZVZlcnNpb249MjAwNzA4MjImT25lSlM9MSZPcGVyYXRpb249R2V0QWRIdG1sJk1hcmtldFBsYWNlPVVTJnNvdXJjZT1hYyZyZWY9dGZfdGlsJmFkX3R5cGU9cHJvZHVjdF9saW5rJnRyYWNraW5nX2lkPWNhYnJyZXNlbGFiLTIwJm1hcmtldHBsYWNlPWFtYXpvbiZyZWdpb249VVMmcGxhY2VtZW50PXsgYW1hem9uaWQgfSZhc2lucz17IGFtYXpvbmlkIH0mbGlua0lkPURJWTNUVU9QREZIM05RV0Ymc2hvd19ib3JkZXI9ZmFsc2UmbGlua19vcGVuc19pbl9uZXdfd2luZG93PXRydWVcIj48L2lmcmFtZT4gPC9kaXY+IDwvc3Bhbj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuY2VsbCA9IDY7XG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLmJ1dHRvbnMpIHtcbiAgICAgICAgX3RoaXMuY2VsbCA9IE1hdGgucm91bmQoMTIgLyBfLmtleXMob3B0cy5idXR0b25zKS5sZW5ndGgpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbW9kYWwtZGlhbG9nJywgJzxkaXYgY2xhc3M9XCJtb2RhbCBmYWRlXCIgaWQ9XCJ7IF8ua2ViYWJDYXNlKGRhdGEudGl0bGUpIH1cIiA+IDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2cgbW9kYWwtbGdcIj4gPGRpdiBpZD1cIm1vZGFsXCIgY2xhc3M9XCJtb2RhbC1jb250ZW50XCIgcmlvdC1zdHlsZT1cImhlaWdodDogeyBoZWlnaHQgfXB4OyBwb3NpdGlvbjogZml4ZWQ7IHdpZHRoOiAxMDAlO1wiID4gPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+IDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+IDwvYnV0dG9uPiA8c2VjdGlvbiBpZD1cIm1vZGFsX2RpYWxvZ19jb250YWluZXJcIj4gPC9zZWN0aW9uPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xudGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSA3NTtcbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuaWQgJiYgb3B0cy5pZCAhPSAnIycpIHtcblxuICAgICAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2V4cGxvcmUvaXRlbXMvJyArIG9wdHMuaWQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS50eXBlKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBkYXRhLnR5cGU7XG5cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgb3B0cy5ldmVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW06IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogb3B0cy5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZzogX3RoaXMubW9kYWxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICByaW90Lm1vdW50KF90aGlzLm1vZGFsX2RpYWxvZ19jb250YWluZXIsICdibG9nLWRpYWxvZycsIG9wdHMpO1xuXG4gICAgICAgICAgICAgICAgICAgIFBzLmluaXRpYWxpemUoX3RoaXMubW9kYWwpO1xuXG4gICAgICAgICAgICAgICAgICAgICQoX3RoaXMucm9vdC5maXJzdENoaWxkKS5tb2RhbCgpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy51bm1vdW50KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3RvcmUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGcm9udEVuZC5Sb3V0ZXIudG8oJ2hvbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJvbnRFbmQuUm91dGVyLnRvKCdleHBsb3JlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnYmxvZy1kaWFsb2cnLCAnPGRpdiBpZj1cIm9wdHNcIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8L2Rpdj4gPGlmcmFtZSBpZj1cInsgZGF0YS55b3V0dWJlaWQgfVwiIGlkPVwieXRwbGF5ZXJcIiB0eXBlPVwidGV4dC9odG1sXCIgd2lkdGg9XCI3MjBcIiBoZWlnaHQ9XCI0MDVcIiByaW90LXNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgZGF0YS55b3V0dWJlaWQgfT9hdXRvcGxheT0xXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPVwiXCI+PC9pZnJhbWU+IDxpZnJhbWUgaWY9XCJ7IGRhdGEudmltZW9pZCB9XCIgcmlvdC1zcmM9XCJodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8veyBkYXRhLnZpbWVvaWQgfVwiIHdpZHRoPVwiNzIwXCIgaGVpZ2h0PVwiNDA1XCIgZnJhbWVib3JkZXI9XCIwXCIgd2Via2l0YWxsb3dmdWxsc2NyZWVuPVwiXCIgbW96YWxsb3dmdWxsc2NyZWVuPVwiXCIgYWxsb3dmdWxsc2NyZWVuPVwiXCI+IDwvaWZyYW1lPiA8ZGl2IGlmPVwieyBibG9nIH1cIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEwIFwiPiA8ZGl2ID4gPHJhdyBjb250ZW50PVwieyBibG9nIH1cIj48L3Jhdz4gPC9kaXY+IDxidXR0b25zIGJ1dHRvbnM9XCJ7IGRhdGEuYnV0dG9ucyB9XCI+PC9idXR0b25zPiA8L2Rpdj4gPGRpdiBjbGFzcz1cIndlbGwgY29sLXNtLTJcIiByaW90LXN0eWxlPVwid2lkdGg6IDEyMHB4OyBwb3NpdGlvbjogZml4ZWQ7IG1hcmdpbi1sZWZ0OiB7IG1hcmdpbiB9cHhcIj4gPHVsIGNsYXNzPVwibGlzdC11bnN0eWxlZCBjb250YWN0IFwiPiA8bGk+IDxhIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL3NoYXJlXCIgY2xhc3M9XCJ0d2l0dGVyLXNoYXJlLWJ1dHRvblwiIGRhdGEtdmlhPVwieyBzb2NpYWwudHdpdHRlci50aXRsZSB9XCI+VHdlZXQ8L2E+IDwvbGk+IDxsaT4gPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6IDEwcHg7XCIgaWQ9XCJncGx1c29uZVwiIGNsYXNzPVwiZy1wbHVzb25lXCIgZGF0YS1zaXplPVwic21hbGxcIj48L2Rpdj4gPC9saT4gPGxpPiA8ZGl2IGNsYXNzPVwiZmItc2hhcmUtYnV0dG9uXCIgZGF0YS1ocmVmPVwieyB1cmwgfVwiIGRhdGEtbGF5b3V0PVwiYnV0dG9uX2NvdW50XCI+PC9kaXY+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gPGJ1dHRvbnMgaWY9XCJ7ICFibG9nIH1cIiBidXR0b25zPVwieyBkYXRhLmJ1dHRvbnMgfVwiPjwvYnV0dG9ucz4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLmV2ZW50LmlkKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG5cbiAgICAgICAgX3RoaXMubWFyZ2luID0gd2luZG93LmlubmVyV2lkdGggLSAkKCcjbW9kYWwnKS53aWR0aCgpICsgMjIwO1xuICAgICAgICBfdGhpcy51cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9zb2NpYWwnKS50aGVuKGZ1bmN0aW9uIChzb2NpYWwpIHtcbiAgICAgICAgICAgIF90aGlzLnNvY2lhbCA9IHNvY2lhbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHJlZiA9IEZyb250RW5kLk1ldGFGaXJlLmdldENoaWxkKEZyb250RW5kLnNpdGUgKyAnL2NvbnRlbnQvJyArIG9wdHMuZXZlbnQuaWQpO1xuICAgICAgICB2YXIgZmlyZXBhZCA9IG5ldyBGaXJlcGFkLkhlYWRsZXNzKHJlZik7XG4gICAgICAgIGZpcmVwYWQuZ2V0SHRtbChmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICAgICAgX3RoaXMuYmxvZyA9IGh0bWw7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIFBzLnVwZGF0ZShvcHRzLmV2ZW50LmRpYWxvZyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xudmFyIGlnbm9yZSA9IGZhbHNlO1xudGhpcy5vbigndXBkYXRlJywgZnVuY3Rpb24gKCkge1xuICAgIGlmICghaWdub3JlICYmICQoJyNtb2RhbCcpLndpZHRoKCkgPiAxMDApIHtcbiAgICAgICAgX3RoaXMubWFyZ2luID0gd2luZG93LmlubmVyV2lkdGggLSAkKCcjbW9kYWwnKS53aWR0aCgpICsgMjIwO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgRnJvbnRFbmQuaW5pdFNvY2lhbCgpO1xuICAgICAgICBnYXBpLnBsdXNvbmUucmVuZGVyKCdncGx1c29uZScpO1xuICAgICAgICBpZ25vcmUgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlnbm9yZSA9IGZhbHNlO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWJhbm5lcicsICc8ZGl2IGNsYXNzPVwiZnVsbHdpZHRoYmFubmVyXCI+IDxkaXYgaWQ9XCJ0cF9iYW5uZXJcIiBjbGFzcz1cInRwLWJhbm5lclwiPiA8dWw+ICA8bGkgZWFjaD1cInsgZGF0YSB9XCIgZGF0YS10cmFuc2l0aW9uPVwiZmFkZVwiIGRhdGEtc2xvdGFtb3VudD1cIjVcIiBkYXRhLXRpdGxlPVwieyB0aXRsZSB9XCIgc3R5bGU9XCJiYWNrZ3JvdW5kOiByZ2IoMjQwLDExMCwzMCk7XCIgPiAgPGltZyBpZj1cInsgIXlvdXR1YmVpZCAmJiBpbWcgfVwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nIH1cIiBhbHQ9XCJkYXJrYmx1cmJnXCIgZGF0YS1iZ2ZpdD1cImNvdmVyXCIgZGF0YS1iZ3Bvc2l0aW9uPVwibGVmdCB0b3BcIiBkYXRhLWJncmVwZWF0PVwibm8tcmVwZWF0XCI+IDxkaXYgaWY9XCJ7ICF5b3V0dWJlaWQgJiYgdGl0bGUgfVwiIGNsYXNzPVwiY2FwdGlvbiB0aXRsZS0yIHNmdFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMTAwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTAwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gPHJhdyBjb250ZW50PVwieyB0aXRsZSB9XCI+PC9yYXc+IDwvZGl2PiA8ZGl2IGlmPVwieyAheW91dHViZWlkICYmIHN1YnRleHQgfVwiIGNsYXNzPVwiY2FwdGlvbiB0ZXh0IHNmbFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMjIwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gPHJhdyBjb250ZW50PVwieyBzdWJ0ZXh0IH1cIj48L3Jhdz4gPC9kaXY+IDxkaXYgaWY9XCJ7ICF5b3V0dWJlaWQgfVwiIGVhY2g9XCJ7IF8uc29ydEJ5KGJ1dHRvbnMsIFxcJ29yZGVyXFwnKSB9XCI+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHNmYiByZXYtYnV0dG9ucyB0cC1yZXNpemVtZVwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMzU1XCIgZGF0YS1zcGVlZD1cIjUwMFwiIGRhdGEtc3RhcnQ9XCIxODAwXCIgZGF0YS1lYXNpbmc9XCJTaW5lLmVhc2VPdXRcIiBvbmNsaWNrPVwieyBwYXJlbnQuZ2V0TGluayB9XCI+IDxhIGhyZWY9XCJ7IGxpbmsgfHwgXFwnXFwnIH1cIiB0YXJnZXQ9XCJ7IHRhcmdldCB8fCBcXCdcXCd9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCI+eyB0aXRsZSB9PC9hPiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWY9XCJ7IHlvdXR1YmVpZCB9XCIgY2xhc3M9XCJ0cC1jYXB0aW9uIHNmdCBjdXN0b21vdXQgdHAtdmlkZW9sYXllclwiIGRhdGEteD1cImNlbnRlclwiIGRhdGEtaG9mZnNldD1cIjBcIiBkYXRhLXk9XCJjZW50ZXJcIiBkYXRhLXZvZmZzZXQ9XCIwXCIgZGF0YS1jdXN0b21pbj1cIng6MDt5OjA7ejowO3JvdGF0aW9uWDowO3JvdGF0aW9uWTowO3JvdGF0aW9uWjowO3NjYWxlWDo1O3NjYWxlWTo1O3NrZXdYOjA7c2tld1k6MDtvcGFjaXR5OjA7dHJhbnNmb3JtUGVyc3BlY3RpdmU6NjAwO3RyYW5zZm9ybU9yaWdpbjo1MCUgNTAlO1wiIGRhdGEtY3VzdG9tb3V0PVwieDowO3k6MDt6OjA7cm90YXRpb25YOjA7cm90YXRpb25ZOjA7cm90YXRpb25aOjA7c2NhbGVYOjAuNzU7c2NhbGVZOjAuNzU7c2tld1g6MDtza2V3WTowO29wYWNpdHk6MDt0cmFuc2Zvcm1QZXJzcGVjdGl2ZTo2MDA7dHJhbnNmb3JtT3JpZ2luOjUwJSA1MCU7XCIgZGF0YS1zcGVlZD1cIjYwMFwiIGRhdGEtc3RhcnQ9XCIxMDAwXCIgZGF0YS1lYXNpbmc9XCJQb3dlcjQuZWFzZU91dFwiIGRhdGEtZW5kc3BlZWQ9XCI1MDBcIiBkYXRhLWVuZGVhc2luZz1cIlBvd2VyNC5lYXNlT3V0XCIgZGF0YS1hdXRvcGxheT1cInRydWVcIiBkYXRhLWF1dG9wbGF5b25seWZpcnN0dGltZT1cImZhbHNlXCIgZGF0YS1uZXh0c2xpZGVhdGVuZD1cImZhbHNlXCIgZGF0YS10aHVtYmltYWdlPVwiaHR0cHM6Ly9pbWcueW91dHViZS5jb20vdmkveyB5b3V0dWJlaWQgfS9tcWRlZmF1bHQuanBnXCI+IDxpZnJhbWUgcmlvdC1zcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC97IHlvdXR1YmVpZCB9P2hkPTEmd21vZGU9b3BhcXVlJmNvbnRyb2xzPTEmc2hvd2luZm89MFwiIHdpZHRoPVwiMTA2NnB4XCIgaGVpZ2h0PVwiNjAwcHhcIiBzdHlsZT1cIndpZHRoOjEwNjZweDtoZWlnaHQ6NjAwcHg7XCI+IDwvaWZyYW1lPiA8L2Rpdj4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PicsICdpZD1cImhvbWVcIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBbXTtcbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3NpdGUnKTtcbnRoaXMubW91bnRlZCA9IGZhbHNlO1xuXG50aGlzLndhdGNoRGF0YSgnL2Jhbm5lcicsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGZhbHNlID09IF90aGlzLm1vdW50ZWQpIHtcbiAgICAgICAgX3RoaXMubW91bnRlZCA9IHRydWU7XG4gICAgICAgIF90aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMudHBfYmFubmVyKS5yZXZvbHV0aW9uKHtcbiAgICAgICAgICAgIHN0b3BBdFNsaWRlOiAxLFxuICAgICAgICAgICAgc3RvcEFmdGVyTG9vcHM6IDAsXG4gICAgICAgICAgICBzdGFydHdpZHRoOiAxMTcwLFxuICAgICAgICAgICAgc3RhcnRoZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgIGhpZGVUaHVtYnM6IDEwXG4gICAgICAgICAgICAvL2Z1bGxXaWR0aDogXCJvblwiLFxuICAgICAgICAgICAgLy9mb3JjZUZ1bGxXaWR0aDogXCJvblwiLFxuICAgICAgICAgICAgLy9sYXp5TG9hZDogXCJvblwiXG4gICAgICAgICAgICAvLyBuYXZpZ2F0aW9uU3R5bGU6IFwicHJldmlldzRcIlxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy9lbHNlIHtcbiAgICAvLyAgICB0aGlzLnVubW91bnQodHJ1ZSk7XG4gICAgLy8gICAgcmlvdC5tb3VudCgncGFnZS1iYW5uZXInKTtcbiAgICAvL31cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvdW50bWVpbicsICc8c2VjdGlvbiBzdHlsZT1cImJhY2tncm91bmQ6IHJnYigyMTIsIDIxNCwgMjE1KTtcIj4gPGRpdiBjbGFzcz1cImRpdmlkZTUwXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwIGNsYXNzPVwibGVhZFwiPnsgaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTMwXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxkaXYgaWQ9XCJpbXBhY3RfaW1nXCIgY2xhc3M9XCJyb3dcIj4gPGltZyBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiNyBiaWxsaW9uIHRoaW5rZXJzXCIgcmlvdC1zcmM9XCJ7IHVybCtpbXBhY3QuaW1nIH1cIj48L2ltZz4gPC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGg0IHN0eWxlPVwiY29sb3I6ICNmMDZlMWU7XCI+eyBpbXBhY3QudGV4dCB9PC9oND4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxkaXYgY2xhc3M9XCJmYWN0cy1pblwiPiA8aDMgc3R5bGU9XCJjb2xvcjogI2YwNmUxZTtcIj4gPHNwYW4gaWQ9XCJjb3VudGVyXCIgY2xhc3M9XCJjb3VudGVyXCI+eyBkYXRhLnRvdGFsIH08L3NwYW4+KyA8L2gzPiA8aDQgc3R5bGU9XCJjb2xvcjogI2YwNmUxZTtcIj57IGVuZ2FnZS5zdWJ0ZXh0IH08L2g0PiA8YnI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMHB4O1wiPiA8cCBzdHlsZT1cImZvbnQtc2l6ZTogMjZweDsgY29sb3I6ICNmMDZlMWU7XCIgY2xhc3M9XCJwaWxsXCI+eyBlbmdhZ2UuaGFzaHRhZyB9PC9wPiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJuby1wYWRkaW5nLWlubmVyIGdyYXlcIj4gPGgzIGNsYXNzPVwid293IGFuaW1hdGVkIGZhZGVJbkRvd25mYWRlSW5SaWdodCBhbmltYXRlZFwiIHN0eWxlPVwidmlzaWJpbGl0eTogdmlzaWJsZTsgdGV4dC1hbGlnbjogY2VudGVyO1wiPiA8c3BhbiBjbGFzcz1cImNvbG9yZWQtdGV4dFwiPlNpeDwvc3Bhbj4gdGhpbmdzIHlvdSBjYW4gZG8gPC9oMz4gPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gXy5zb3J0QnkoZW5nYWdlLm9wdGlvbnMsIFxcJ29yZGVyXFwnKSB9XCIgY2xhc3M9XCJzZXJ2aWNlcy1ib3ggbWFyZ2luMzAgd293IGFuaW1hdGVkIGZhZGVJblJpZ2h0IGFuaW1hdGVkXCIgc3R5bGU9XCJ2aXNpYmlsaXR5OiB2aXNpYmxlOyBhbmltYXRpb24tbmFtZTogZmFkZUluUmlnaHQ7IC13ZWJraXQtYW5pbWF0aW9uLW5hbWU6IGZhZGVJblJpZ2h0O1wiPiA8ZGl2IGNsYXNzPVwic2VydmljZXMtYm94LWljb25cIj4gPGkgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIj48L2k+IDwvZGl2PiA8ZGl2IGNsYXNzPVwic2VydmljZXMtYm94LWluZm9cIj4gPGg0PnsgdmFsLnRpdGxlIH08L2g0PiA8cD57IHZhbC50ZXh0IH08L3A+IDxkaXYgaWY9XCJ7IHZhbC5idXR0b25zIH1cIiBlYWNoPVwieyBfLnNvcnRCeSh2YWwuYnV0dG9ucywgXFwnb3JkZXJcXCcpIH1cIj4gPGEgaHJlZj1cInsgbGluayB8fCBcXCdcXCcgfVwiIHRhcmdldD1cInsgdGFyZ2V0IHx8IFxcJ1xcJ31cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIj57IHRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9zZWN0aW9uPicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCdzaXRlJyk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvY291bnQtbWUtaW4nKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgX3RoaXMuaW1wYWN0ID0gZGF0YS5pbXBhY3Q7XG4gICAgX3RoaXMuZW5nYWdlID0gZGF0YS5lbmdhZ2U7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG5cbiAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICQoX3RoaXMuY291bnRlcikuY291bnRlclVwKHtcbiAgICAgICAgZGVsYXk6IDEwMCxcbiAgICAgICAgdGltZTogODAwXG4gICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1leHBsb3JlJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+IDxzdHJvbmc+eyBoZWFkZXIudGl0bGUgfTwvc3Ryb25nPiA8L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwiY3ViZS1tYXNvbnJ5XCI+IDxkaXYgaWQ9XCJmaWx0ZXJzX2NvbnRhaW5lclwiIGNsYXNzPVwiY2JwLWwtZmlsdGVycy1hbGlnbkNlbnRlclwiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBmaWx0ZXJzIH1cIiBkYXRhLWZpbHRlcj1cIi57IHZhbC50YWcgfVwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtIHsgXFwnY2JwLWZpbHRlci1pdGVtLWFjdGl2ZVxcJzogaSA9PSAwIH1cIj4geyB2YWwubmFtZSB9IDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwibWFzb25yeV9jb250YWluZXJcIiBjbGFzcz1cImNicFwiPiA8ZGl2IGlkPVwieyBpZCB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiIGVhY2g9XCJ7IGNvbnRlbnQgfVwiIGNsYXNzPVwiY2JwLWl0ZW0geyB0eXBlIH0geyBfLmtleXModGFncykuam9pbihcXCcgXFwnKSB9XCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvblwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBpZj1cInsgaW1nIH1cIiByaW90LXNyYz1cInsgcGFyZW50LnVybCArIHR5cGUgKyBcXCcvXFwnICsgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBpZj1cInsgdGl0bGUgfVwiIGNsYXNzPVwieyBcXCdjYnAtbC1jYXB0aW9uLXRpdGxlXFwnOiB0cnVlIH1cIiA+eyB0aXRsZSB9PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIG9uY2xpY2s9XCJ7IHNob3dBbGwgfVwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPkV4cGxvcmUgQWxsPC9hPiA8L2Rpdj4nLCAnaWQ9XCJleHBsb3JlXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG50aGlzLnNob3dBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChfdGhpcy5tYXNvbnJ5X2NvbnRhaW5lcikuY3ViZXBvcnRmb2xpbygnZmlsdGVyJywgJyonKTtcbn07XG5cbnRoaXMub25DbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgRnJvbnRFbmQuUm91dGVyLnRvKF8ua2ViYWJDYXNlKGUuaXRlbS50aXRsZSksIGUsIF90aGlzKTtcbn07XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZXhwbG9yZScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5maWx0ZXJzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5maWx0ZXJzLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgIH0pO1xuICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgIF90aGlzLml0ZW1zID0gXy5zb3J0QnkoXy5tYXAoZGF0YS5pdGVtcywgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh2YWwgJiYgISh2YWwuYXJjaGl2ZSA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgIHZhbC5pZCA9IGtleTtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICB9KSwgJ29yZGVyJyk7XG4gICAgX3RoaXMuY29udGVudCA9IF90aGlzLml0ZW1zO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgdmFyIGRlZmF1bHRGaWx0ZXIgPSBfLmZpcnN0KF90aGlzLmZpbHRlcnMsIGZ1bmN0aW9uIChmaWx0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlclsnZGVmYXVsdCddID09PSB0cnVlO1xuICAgIH0pO1xuXG4gICAgJChfdGhpcy5tYXNvbnJ5X2NvbnRhaW5lcikuY3ViZXBvcnRmb2xpbyh7XG4gICAgICAgIGZpbHRlcnM6ICcjZmlsdGVyc19jb250YWluZXInLFxuICAgICAgICBsYXlvdXRNb2RlOiAnZ3JpZCcsXG4gICAgICAgIGRlZmF1bHRGaWx0ZXI6ICcuJyArIGRlZmF1bHRGaWx0ZXIudGFnLFxuICAgICAgICBhbmltYXRpb25UeXBlOiAnZmxpcE91dERlbGF5JyxcbiAgICAgICAgZ2FwSG9yaXpvbnRhbDogMjAsXG4gICAgICAgIGdhcFZlcnRpY2FsOiAyMCxcbiAgICAgICAgZ3JpZEFkanVzdG1lbnQ6ICdyZXNwb25zaXZlJyxcbiAgICAgICAgbWVkaWFRdWVyaWVzOiBbe1xuICAgICAgICAgICAgd2lkdGg6IDExMDAsXG4gICAgICAgICAgICBjb2xzOiA0XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgICAgICBjb2xzOiAzXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICBjb2xzOiAyXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiAzMjAsXG4gICAgICAgICAgICBjb2xzOiAxXG4gICAgICAgIH1dLFxuICAgICAgICBjYXB0aW9uOiAnb3ZlcmxheUJvdHRvbUFsb25nJyxcbiAgICAgICAgZGlzcGxheVR5cGU6ICdib3R0b21Ub1RvcCcsXG4gICAgICAgIGRpc3BsYXlUeXBlU3BlZWQ6IDEwMFxuICAgIH0pO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgJzxmb290ZXIgaWQ9XCJmb290ZXJcIj4gPGRpdiBpZD1cImNvbnRhY3RcIiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+eyBkYXRhLmFib3V0LnRpdGxlIH08L2gzPiA8cCBzdHlsZT1cImNvbG9yOiAjZmZmO1wiPnsgZGF0YS5hYm91dC50ZXh0IH08L3A+IDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgY29udGFjdFwiPiA8bGkgZWFjaD1cInsgXy5zb3J0QnkoZGF0YS5jb250YWN0LFxcJ29yZGVyXFwnKSB9XCI+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+IDxzdHJvbmc+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+eyB0aXRsZSB8fCBcXCdcXCcgfSA8L3N0cm9uZz4gPGEgaWY9XCJ7IGxpbmsgfVwiIGhyZWY9XCJ7IGxpbmsgfVwiIHN0eWxlPVwiY29sb3I6ICNmZmZcIiA+eyB0ZXh0IHx8IGxpbmsgfTwvYT4gPHNwYW4gaWY9XCJ7ICFsaW5rIH1cIj57IHRleHQgfTwvc3Bhbj4gPC9wPiA8L2xpPiA8L3VsPiA8dWwgaWQ9XCJzb2NpYWxfZm9sbG93XCIgY2xhc3M9XCJsaXN0LWlubGluZSBzb2NpYWwtMVwiPiA8bGkgZWFjaD1cInsgXy5zb3J0QnkoZGF0YS5hYm91dC5zb2NpYWwsIFxcJ29yZGVyXFwnKSB9XCI+IDxhIGhyZWY9XCJ7IGxpbmsgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+Rm9sbG93IFVzPC9oMz4gPGEgaWY9XCJ7IHNvY2lhbC50d2l0dGVyIH1cIiBjbGFzcz1cInR3aXR0ZXItdGltZWxpbmVcIiBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS97IHNvY2lhbC50d2l0dGVyLnRpdGxlIH1cIiBkYXRhLXdpZGdldC1pZD1cInsgc29jaWFsLnR3aXR0ZXIuYXBpIH1cIj5Ud2VldHMgYnkgQHsgc29jaWFsLnR3aXR0ZXIudGl0bGUgfTwvYT4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5MaWtlIFVzPC9oMz4gPGRpdiBpZj1cInsgc29jaWFsLmZhY2Vib29rIH1cIiBjbGFzcz1cImZiLXBhZ2VcIiBkYXRhLWhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20veyBzb2NpYWwuZmFjZWJvb2sudGl0bGUgfVwiIGRhdGEtc21hbGwtaGVhZGVyPVwidHJ1ZVwiIGRhdGEtYWRhcHQtY29udGFpbmVyLXdpZHRoPVwidHJ1ZVwiIGRhdGEtaGlkZS1jb3Zlcj1cImZhbHNlXCIgZGF0YS1zaG93LWZhY2VwaWxlPVwidHJ1ZVwiIGRhdGEtaGVpZ2h0PVwiMzAwXCIgZGF0YS13aWR0aD1cIjI4MFwiIGRhdGEtc2hvdy1wb3N0cz1cInRydWVcIj4gPGRpdiBjbGFzcz1cImZiLXhmYm1sLXBhcnNlLWlnbm9yZVwiPiA8YmxvY2txdW90ZSBjaXRlPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3sgc29jaWFsLmZhY2Vib29rLnRpdGxlIH1cIj4gPGEgaHJlZj1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS97IHNvY2lhbC5mYWNlYm9vay50aXRsZSB9XCI+eyB0aXRsZSB9PC9hPiA8L2Jsb2NrcXVvdGU+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5Kb2luIFVzPC9oMz4gPGRpdiBpZD1cIm1jX2VtYmVkX3NpZ251cFwiPiA8Zm9ybSBhY3Rpb249XCIvL2NhYnJlcmFsYWJzLnVzNC5saXN0LW1hbmFnZS5jb20vc3Vic2NyaWJlL3Bvc3Q/dT01ODk0NzM4NTM4M2QzMjNjYWY5MDQ3ZjM5JmFtcDtpZD05Nzk5ZDNhN2I5XCIgbWV0aG9kPVwicG9zdFwiIGlkPVwibWMtZW1iZWRkZWQtc3Vic2NyaWJlLWZvcm1cIiBuYW1lPVwibWMtZW1iZWRkZWQtc3Vic2NyaWJlLWZvcm1cIiBjbGFzcz1cIlwiIHRhcmdldD1cIl9ibGFua1wiIG5vdmFsaWRhdGU9XCJcIj4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj57IGRhdGEubmV3c2xldHRlci50ZXh0IH08L3A+IDxkaXYgaWQ9XCJtY19lbWJlZF9zaWdudXBfc2Nyb2xsXCI+IDxkaXYgY2xhc3M9XCJtYy1maWVsZC1ncm91cFwiPiA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gPGlucHV0IHR5cGU9XCJlbWFpbFwiIHBsYWNlaG9sZGVyPVwiRW1haWwuLi5cIiBzdHlsZT1cImhlaWdodDogMzFweDtcIiB2YWx1ZT1cIlwiIG5hbWU9XCJFTUFJTFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtY2UtRU1BSUxcIj4gPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gPGlucHV0IHJvbGU9XCJidXR0b25cIiB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJTdWJzY3JpYmVcIiBuYW1lPVwic3Vic2NyaWJlXCIgaWQ9XCJtYy1lbWJlZGRlZC1zdWJzY3JpYmVcIiBjbGFzcz1cImJ0biBidG4tdGhlbWUtYmdcIj5TdWJzY3JpYmU8L2lucHV0PiA8L3NwYW4+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IC01MDAwcHg7XCI+IDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJiXzU4OTQ3Mzg1MzgzZDMyM2NhZjkwNDdmMzlfOTc5OWQzYTdiOVwiIHRhYmluZGV4PVwiLTFcIiB2YWx1ZT1cIlwiPiA8L2Rpdj4gPGRpdiBpZD1cIm1jZS1yZXNwb25zZXNcIiBjbGFzcz1cImNsZWFyXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiA1cHg7XCI+IDxkaXYgY2xhc3M9XCJyZXNwb25zZVwiIGlkPVwibWNlLWVycm9yLXJlc3BvbnNlXCIgc3R5bGU9XCJjb2xvcjogcmVkOyBkaXNwbGF5Om5vbmVcIj48L2Rpdj4gPGRpdiBjbGFzcz1cInJlc3BvbnNlXCIgaWQ9XCJtY2Utc3VjY2Vzcy1yZXNwb25zZVwiIHN0eWxlPVwiY29sb3I6ICNmZmY7IGRpc3BsYXk6bm9uZVwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZm9ybT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Zvb3Rlcj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG50aGlzLnNvY2lhbCA9IG51bGw7XG50aGlzLmRhdGEgPSBudWxsO1xudGhpcy50aXRsZSA9IEZyb250RW5kLmNvbmZpZy5zaXRlLnRpdGxlO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2Zvb3RlcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgIEZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvc29jaWFsJykudGhlbihmdW5jdGlvbiAoc29jaWFsKSB7XG4gICAgICAgIF90aGlzLnNvY2lhbCA9IHNvY2lhbDtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIEZyb250RW5kLmluaXRTb2NpYWwoKTtcbiAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWltcGFjdCcsICc8c2VjdGlvbj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMiBpZj1cInsgaGVhZGVyIH1cIj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJsZWFkXCI+IHsgaGVhZGVyLnRleHQgfSA8L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9XCJpbXBhY3Rfc2xpZGVyXCIgY2xhc3M9XCJvd2wtY2Fyb3VzZWxcIj4gPGRpdiBjbGFzcz1cIml0ZW1cIiBlYWNoPVwieyBpdGVtcyB9XCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGltZyBpZj1cInsgaW1nIH1cIiB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMTI1cHhcIiByaW90LXNyYz1cInsgcGFyZW50LnVybCB9aW1wYWN0L3sgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9pbXBhY3QnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuaXRlbXMsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMuaW1wYWN0X3NsaWRlcikub3dsQ2Fyb3VzZWwoe1xuICAgICAgICAgICAgICAgIGF1dG9QbGF5OiA1MDAwLFxuICAgICAgICAgICAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxuICAgICAgICAgICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5OTEsIDJdXG4gICAgICAgIH0pO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVzc2FnZScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+PHJhdyBjb250ZW50PVwieyBoZWFkZXIudGV4dCB9XCI+PC9yYXc+IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvdyBzcGVjaWFsLWZlYXR1cmVcIj4gPGRpdiBlYWNoPVwieyBpdGVtcyB9XCIgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBtYXJnaW4xMFwiPiA8ZGl2IGNsYXNzPVwicy1mZWF0dXJlLWJveCB0ZXh0LWNlbnRlciB3b3cgYW5pbWF0ZWQgZmFkZUluXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMjAwbXNcIj4gPGRpdiBjbGFzcz1cIm1hc2stdG9wXCI+ICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiAgPGg0PnsgdGl0bGUgfTwvaDQ+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibWFzay1ib3R0b21cIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gIDxwPnsgdGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuaGVhZGVyID0ge307XG50aGlzLml0ZW1zID0gW107XG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL21lc3NhZ2UnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLml0ZW1zLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgIH0pO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWV0aG9kb2xvZ3knLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgY2xhc3M9XCJsZWFkXCI+eyBoZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlMzBcIj48L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoND57IGZyYW1ld29ya3MuaGVhZGVyLnRpdGxlIH08L2g0PiA8cCBjbGFzcz1cImxlYWRcIj57IGZyYW1ld29ya3MuaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJwYW5lbC1ncm91cFwiIGlkPVwiZnJhbWV3b3Jrc1wiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBfLnNvcnRCeShmcmFtZXdvcmtzLml0ZW1zLCBcXCdvcmRlclxcJykgfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiA8aDQgY2xhc3M9XCJwYW5lbC10aXRsZVwiPiA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS1wYXJlbnQ9XCIjZnJhbWV3b3Jrc1wiIGhyZWY9XCIjY29sbGFwc2VGcmFtZXdvcmtzX3sgaSB9XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2g0PiA8L2Rpdj4gPGRpdiBpZD1cImNvbGxhcHNlRnJhbWV3b3Jrc197IGkgfVwiIGNsYXNzPVwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgeyBpbjogaSA9PSAwIH1cIj4gPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4geyB2YWwudGV4dCB9IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGg0PnsgcGFydG5lcnMuaGVhZGVyLnRpdGxlIH08L2g0PiA8cCBjbGFzcz1cImxlYWRcIj57IHBhcnRuZXJzLmhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicGFuZWwtZ3JvdXBcIiBpZD1cImFjY29yZGlvblwiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBfLnNvcnRCeShwYXJ0bmVycy5pdGVtcywgXFwnb3JkZXJcXCcpIH1cIiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj4gPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gPGg0IGNsYXNzPVwicGFuZWwtdGl0bGVcIj4gPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtcGFyZW50PVwiI2FjY29yZGlvblwiIGhyZWY9XCIjY29sbGFwc2VPbmVfeyBpIH1cIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvaDQ+IDwvZGl2PiA8ZGl2IGlkPVwiY29sbGFwc2VPbmVfeyBpIH1cIiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlIHsgaW46IGkgPT0gMCB9XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+IHsgdmFsLnRleHQgfSA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL21ldGhvZG9sb2d5JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuZnJhbWV3b3JrcyA9IGRhdGEuZnJhbWV3b3JrcztcbiAgICAgICAgX3RoaXMucGFydG5lcnMgPSBkYXRhLnBhcnRuZXJzO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVudS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPiA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj4gPGxpIGNsYXNzPVwieyBkcm9wZG93bjogdHJ1ZSwgYWN0aXZlOiBpID09IDAgfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhIH1cIj4gPGEgaWY9XCJ7IHZhbC50aXRsZSB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiIGhyZWY9XCJ7IHZhbC5saW5rIHx8IFxcJyNcXCcgfVwiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPiA8aSBpZj1cInsgdmFsLmljb24gfVwiIGNsYXNzPVwieyB2YWwuaWNvbiB9XCIgPjwvaT4geyB2YWwudGl0bGUgfSA8aSBpZj1cInsgdmFsLm1lbnUgJiYgdmFsLm1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIiA+PC9pPiA8L2E+IDx1bCBpZj1cInsgdmFsLm1lbnUgJiYgdmFsLm1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgbXVsdGktbGV2ZWxcIiByb2xlPVwibWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImRyb3Bkb3duTWVudVwiPiA8bGkgZWFjaD1cInsgdmFsLm1lbnUgfVwiID4gPGEgb25jbGljaz1cInBhcmVudC5vbmNsaWNrXCIgaHJlZj1cInsgbGluayB8fCBcXCcjXFwnIH1cIj4gPGkgaWY9XCJ7IGljb24gfVwiIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG50aGlzLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZSwgdGFnKSB7XG4gICAgaWYgKGUuaXRlbSAmJiBlLml0ZW0udmFsLmxpbmspIHtcbiAgICAgICAgRnJvbnRFbmQuUm91dGVyLnRvKGUuaXRlbS52YWwubGluayk7XG4gICAgfSBlbHNlIGlmIChlLml0ZW0gJiYgZS5pdGVtLnZhbC5hY3Rpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coZS5pdGVtLnZhbC5hY3Rpb24pO1xuICAgIH1cbn07XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbmF2YmFyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgIH0pO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLXN0YXRpYy10b3AgeWFtbSBzdGlja3lcIiByb2xlPVwibmF2aWdhdGlvblwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJuYXZiYXItaGVhZGVyXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmF2YmFyLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj4gPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDwvYnV0dG9uPiA8ZGl2PiA8aW1nIGlmPVwieyBkYXRhIH1cIiBzdHlsZT1cIm1hcmdpbi10b3A6IDdweDsgbWFyZ2luLXJpZ2h0OiAxNXB4O1wiIHJpb3Qtc3JjPVwieyB1cmwgfXNpdGUveyBkYXRhLmltZyB9XCIgYWx0PVwieyBkYXRhLmFsdCB9XCI+IDwvZGl2PiA8L2Rpdj4gPHBhZ2UtbWVudS1uYXZiYXI+PC9wYWdlLW1lbnUtbmF2YmFyPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9sb2dvJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmV3cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8aDMgY2xhc3M9XCJoZWFkaW5nXCI+TGF0ZXN0IE5ld3M8L2gzPiA8ZGl2IGlkPVwibmV3c19jYXJvdXNlbFwiIGNsYXNzPVwib3dsLWNhcm91c2VsIG93bC1zcGFjZWRcIj4gPGRpdiBlYWNoPVwieyBkYXRhIH1cIj4gPGRpdiBjbGFzcz1cIm5ld3MtZGVzY1wiPiA8cD4gPGEgaHJlZj1cInsgbGluayB9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+eyBIdW1hbml6ZS50cnVuY2F0ZSh0aXRsZSwgMTI1KSB9PC9hPiA8L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL25ld3MnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gaS5hcmNoaXZlICE9IHRydWU7XG4gICAgfSk7XG4gICAgX3RoaXMudXBkYXRlKCk7XG4gICAgJChfdGhpcy5uZXdzX2Nhcm91c2VsKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgIC8vIE1vc3QgaW1wb3J0YW50IG93bCBmZWF0dXJlc1xuICAgICAgICBpdGVtczogNCxcbiAgICAgICAgaXRlbXNDdXN0b206IGZhbHNlLFxuICAgICAgICBpdGVtc0Rlc2t0b3A6IFsxMTk5LCA0XSxcbiAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5ODAsIDJdLFxuICAgICAgICBpdGVtc1RhYmxldDogWzc2OCwgMl0sXG4gICAgICAgIGl0ZW1zVGFibGV0U21hbGw6IGZhbHNlLFxuICAgICAgICBpdGVtc01vYmlsZTogWzQ3OSwgMV0sXG4gICAgICAgIHNpbmdsZUl0ZW06IGZhbHNlLFxuICAgICAgICBzdGFydERyYWdnaW5nOiB0cnVlLFxuICAgICAgICBhdXRvUGxheTogNTAwMCxcbiAgICAgICAgbG9vcDogdHJ1ZVxuICAgIH0pO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtdGVzdGltb25pYWxzJywgJzxkaXYgaWQ9XCJ0ZXN0aW1vbmlhbHMtY2Fyb3VzZWxcIiBjbGFzcz1cInRlc3RpbW9uaWFscyB0ZXN0aW1vbmlhbHMtdi0yIHdvdyBhbmltYXRlZCBmYWRlSW5VcFwiIGRhdGEtd293LWR1cmF0aW9uPVwiNzAwbXNcIiBkYXRhLXdvdy1kZWxheT1cIjEwMG1zXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPnsgaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPiA8ZGl2IGlkPVwidGVzdGltb25pYWxfc2xpZGVcIiBjbGFzcz1cInRlc3RpLXNsaWRlXCI+IDx1bCBjbGFzcz1cInNsaWRlc1wiPiA8bGkgZWFjaD1cInsgaXRlbXMgfVwiPiA8aW1nIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nIH1cIiBhbHQ9XCJ7IHVzZXIgfVwiPiA8aDQ+IDxpIGNsYXNzPVwiZmEgZmEtcXVvdGUtbGVmdCBpb24tcXVvdGVcIj48L2k+IHsgdGV4dH0gPC9oND4gPHAgY2xhc3M9XCJ0ZXN0LWF1dGhvclwiPiB7IHVzZXIgfSAtIDxlbT57IHN1YnRleHQgfTwvZW0+IDwvcD4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTMwXCI+PC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygndGVzdGltb25pYWxzJyk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvdGVzdGltb25pYWxzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLml0ZW1zLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaS5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKF90aGlzLnRlc3RpbW9uaWFsX3NsaWRlKS5mbGV4c2xpZGVyKHtcbiAgICAgICAgICAgICAgICBzbGlkZXNob3dTcGVlZDogNTAwMCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25OYXY6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUnXG4gICAgICAgIH0pO1xufSk7XG59KTsiXX0=
