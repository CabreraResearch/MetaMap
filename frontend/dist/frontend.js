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
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li each="{ data }" data-transition="fade" data-slotamount="5" data-title="{ title }" style="background: rgb(240,110,30);" >  <img if="{ img }" riot-src="{ parent.url + img }" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div if="{ title }" class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> <raw content="{ title }"></raw> </div> <div if="{ subtext }" class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> <raw content="{ subtext }"></raw> </div> <div each="{ buttons }"> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut" onclick="{ parent.getLink }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> <div if="{ youtubeid }" class="tp-caption sft customout tp-videolayer" data-x="center" data-hoffset="134" data-y="center" data-voffset="-6" data-customin="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:5;scaleY:5;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-customout="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:0.75;scaleY:0.75;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-speed="600" data-start="1000" data-easing="Power4.easeOut" data-endspeed="500" data-endeasing="Power4.easeOut" data-autoplay="true" data-autoplayonlyfirsttime="false" data-nextslideatend="false" data-thumbimage="https://img.youtube.com/vi/{ youtubeid }/mqdefault.jpg"> <iframe riot-src="https://www.youtube.com/embed/{ youtubeid }?hd=1&wmode=opaque&controls=1&showinfo=0" width="640" height="360" style="width:640px;height:360px;"> </iframe> </div> </li> </ul> </div> </div>', 'id="home"', function(opts) {var _this = this;

this.data = [];
this.mixin('config');
this.url = this.pathImg('site');
this.mounted = false;

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
module.exports = riot.tag('page-footer', '<footer id="footer"> <div id="contact" class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p style="color: #fff;">{ data.about.text }</p> <ul class="list-unstyled contact"> <li each="{ data.contact }"> <p style="color: #fff;"> <strong> <i class="{ icon }"></i>{ title }: </strong> <a if="{ link }" href="{ link }" style="color: #fff" >{ text || link }</a> <span if="{ !link }">{ text }</span> </p> </li> </ul> <ul id="social_follow" class="list-inline social-1"> <li each="{ data.about.social }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Follow Us</h3> <a if="{ social.twitter }" class="twitter-timeline" href="https://twitter.com/{ social.twitter.title }" data-widget-id="{ social.twitter.api }">Tweets by @{ social.twitter.title }</a> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Like Us</h3> <div if="{ social.facebook }" class="fb-page" data-href="https://www.facebook.com/{ social.facebook.title }" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-height="300" data-width="280" data-show-posts="true"> <div class="fb-xfbml-parse-ignore"> <blockquote cite="https://www.facebook.com/{ social.facebook.title }"> <a href="https://www.facebook.com/{ social.facebook.title }">{ title }</a> </blockquote> </div> </div> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Join Us</h3> <div id="mc_embed_signup"> <form action="//cabreralabs.us4.list-manage.com/subscribe/post?u=58947385383d323caf9047f39&amp;id=9799d3a7b9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="" target="_blank" novalidate=""> <p style="color: #fff;">{ data.newsletter.text }</p> <div id="mc_embed_signup_scroll"> <div class="mc-field-group"> <div class="input-group"> <input type="email" placeholder="Email..." style="height: 31px;" value="" name="EMAIL" class="form-control" id="mce-EMAIL"> <span class="input-group-btn"> <input role="button" type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="btn btn-theme-bg">Subscribe</input> </span> </div> </div>  <div style="position: absolute; left: -5000px;"> <input type="text" name="b_58947385383d323caf9047f39_9799d3a7b9" tabindex="-1" value=""> </div> <div id="mce-responses" class="clear" style="margin-top: 5px;"> <div class="response" id="mce-error-response" style="color: red; display:none"></div> <div class="response" id="mce-success-response" style="color: #fff; display:none"></div> </div> </div> </form> </div> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

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
},{"riot":"riot"}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvY29yZS9Sb3V0ZXIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9mYWNlYm9vay5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdHdpdHRlci5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvYnV0dG9ucy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9jb21wb25lbnRzL21vZGFsLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL2Jsb2ctZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtYmFubmVyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtY291bnRtZWluLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtZXhwbG9yZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWZvb3Rlci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWltcGFjdC50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW1lc3NhZ2UudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tZXRob2RvbG9neS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5hdmJhci1tZW51LnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbmF2YmFyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbmV3cy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMvQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2hELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ3RELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOztBQUV4RCxJQUFNLFFBQVEsR0FBRywySUFBMkksQ0FBQzs7QUFFN0osSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLEdBQVM7QUFDakIsUUFBTSxLQUFLLEdBQUc7QUFDVixXQUFHLEVBQUU7QUFDRCxvQkFBUSxFQUFFLE9BQU87QUFDakIsY0FBRSxFQUFFLGtCQUFrQjtBQUN0QixzQkFBVSxFQUFFLEVBQUU7QUFDZCxpQkFBSyxFQUFFLHNCQUFzQjtBQUM3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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgTWV0YUZpcmUgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZScpO1xyXG5sZXQgQXV0aDAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9hdXRoMCcpO1xyXG5sZXQgdXNlcnNuYXAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcCcpO1xyXG5sZXQgcmlvdCA9IHdpbmRvdy5yaW90O1xyXG5sZXQgUm91dGVyID0gcmVxdWlyZSgnLi9qcy9jb3JlL1JvdXRlcicpO1xyXG5sZXQgZ2EgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9nb29nbGUuanMnKTtcclxubGV0IHR3aXR0ZXIgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy90d2l0dGVyLmpzJyk7XHJcbmxldCBmYWNlYm9vayA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2ZhY2Vib29rLmpzJyk7XHJcblxyXG5jb25zdCBpbWFnZVVybCA9ICcvL2M2OGY3OTgxYThiYmU5MjZhMWUwMTU0Y2JmYmQ1YWYxYjRkZjBmMjEuZ29vZ2xlZHJpdmUuY29tL2hvc3QvMEI2R0FONGdYMWJuU2ZsUm5kVFJKZUZaNU5Fc3pTRUZsU3pWS1pEWkpTekZ4ZURkaWNGcG9MWFZ3U0RORlJXTjBSRmhmUzJjLyc7XHJcblxyXG5jb25zdCBjb25maWcgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBTSVRFUyA9IHtcclxuICAgICAgICBDUkw6IHtcclxuICAgICAgICAgICAgZnJvbnRFbmQ6ICdjcmxhYicsXHJcbiAgICAgICAgICAgIGRiOiAncG9wcGluZy1maXJlLTg5NycsXHJcbiAgICAgICAgICAgIG1ldGFNYXBVcmw6ICcnLFxyXG4gICAgICAgICAgICB0aXRsZTogJ0NhYnJlcmEgUmVzZWFyY2ggTGFiJyxcclxuICAgICAgICAgICAgR0E6ICdVQS02MzE5MzU1NC0yJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVEhJTktfV0FURVI6IHtcclxuICAgICAgICAgICAgZnJvbnRFbmQ6ICd0aGlua3dhdGVyJyxcclxuICAgICAgICAgICAgZGI6ICdwb3BwaW5nLWZpcmUtODk3JyxcclxuICAgICAgICAgICAgbWV0YU1hcFVybDogJycsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnVGhpbmtXYXRlcidcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmV0ID0ge1xyXG4gICAgICAgIGhvc3Q6IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxyXG4gICAgICAgIHNpdGU6IHt9XHJcbiAgICB9XHJcbiAgICBsZXQgc2VnbWVudHMgPSByZXQuaG9zdC5zcGxpdCgnLicpO1xyXG4gICAgbGV0IGZpcnN0ID0gc2VnbWVudHNbMF07XHJcbiAgICBpZiAoZmlyc3QgPT09ICd3d3cnKSB7XHJcbiAgICAgICAgZmlyc3QgPSBzZWdtZW50c1sxXTtcclxuICAgIH1cclxuICAgIHN3aXRjaCAoZmlyc3QudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgY2FzZSAnbWV0YS1tYXAtc3RhZ2luZyc6XHJcbiAgICBjYXNlICdmcm9udGVuZCc6XHJcbiAgICAgICAgcmV0LnNpdGUgPSBTSVRFU1snQ1JMJ107XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICd0aGlua3dhdGVyLXN0YWdpbmcnOlxyXG4gICAgY2FzZSAndGhpbmt3YXRlcic6XHJcbiAgICAgICAgcmV0LnNpdGUgPSBTSVRFU1snVEhJTktfV0FURVInXTtcclxuICAgICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgLy9Gb3Igbm93LCBkZWZhdWx0IHRvIENSTFxyXG4gICAgICAgIHJldC5zaXRlID0gU0lURVNbJ0NSTCddO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5mcmVlemUocmV0KTtcclxuICAgIHJldHVybiByZXQ7XHJcbn07XHJcblxyXG5jbGFzcyBGcm9udEVuZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFncykge1xyXG4gICAgICAgIHRoaXMudGFncyA9IHRhZ3M7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcoKTtcclxuIFxyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5jb25maWcuc2l0ZS50aXRsZTtcclxuICAgICAgICBsZXQgZmF2aWNvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdmljbycpO1xyXG4gICAgICAgIGZhdmljby5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgJHtpbWFnZVVybH0ke3RoaXMuY29uZmlnLnNpdGUuZnJvbnRFbmR9L2Zhdmljb24uaWNvYCk7XHJcblxyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAodGhpcy5jb25maWcpO1xyXG5cclxuICAgICAgICBnYSh0aGlzLmNvbmZpZy5HQSk7XHJcbiAgICAgICAgdGhpcy5pbml0VHdpdHRlciA9IHR3aXR0ZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRGYWNlYm9vayA9IGZhY2Vib29rKCk7XHJcbiAgICAgICAgdXNlcnNuYXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0U29jaWFsKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdFR3aXR0ZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRGYWNlYm9vaygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5zaXRlLmZyb250RW5kO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgLy9fLmVhY2godGhpcy50YWdzLCAodGFnKSA9PiB7XHJcbiAgICAgICAgLy8gICAgcmlvdC5tb3VudCh0YWcsIHRoaXMpO1xyXG4gICAgICAgIC8vfSk7XHJcbiAgICAgICAgcmlvdC5tb3VudCgnKicpO1xyXG4gICAgICAgIHRoaXMuUm91dGVyID0gbmV3IFJvdXRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dvdXQoKTtcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ291dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZyb250RW5kOyIsInJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XHJcbndpbmRvdy5yaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG53aW5kb3cuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG53aW5kb3cuUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMnKTtcclxud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbnJlcXVpcmUoJ2pxdWVyeS11aScpO1xyXG5yZXF1aXJlKCdib290c3RyYXAnKTtcclxud2luZG93LkZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKTtcclxud2luZG93LkZpcmVwYWQgPSByZXF1aXJlKCdmaXJlcGFkJyk7XHJcbndpbmRvdy5IdW1hbml6ZSA9IHJlcXVpcmUoJ2h1bWFuaXplLXBsdXMnKTtcclxud2luZG93Lm1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG53aW5kb3cuVVJJID0gcmVxdWlyZSgnVVJJanMnKTtcclxud2luZG93LmxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKTtcclxud2luZG93LlBzID0gcmVxdWlyZSgncGVyZmVjdC1zY3JvbGxiYXInKTtcclxuXHJcbmxldCB0YWdzID0gW1xyXG4gICAgJ3BhZ2UtaGVhZCcsXHJcbiAgICAncGFnZS1iYW5uZXInLFxyXG4gICAgJ3BhZ2UtaW1wYWN0JyxcclxuICAgICdwYWdlLWNvdW50bWVpbicsXHJcbiAgICAncGFnZS1mb290ZXInLFxyXG4gICAgJ3BhZ2UtbmF2YmFyLW1lbnUnLFxyXG4gICAgJ3BhZ2UtbmF2YmFyJyxcclxuICAgICdwYWdlLW5ld3MnLFxyXG4gICAgJ3BhZ2UtZXhwbG9yZScsXHJcbiAgICAncGFnZS1tZXNzYWdlJyxcclxuICAgICdwYWdlLW1ldGhvZG9sb2d5JyxcclxuICAgICdwYWdlLXRlc3RpbW9uaWFscydcclxuXTtcclxuXHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL2Jsb2ctZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvY29tcG9uZW50cy9idXR0b25zLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvY29tcG9uZW50cy9tb2RhbC1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWJhbm5lci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtaW1wYWN0LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1jb3VudG1laW4udGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWZvb3Rlci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLW1lbnUudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmV3cy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZXhwbG9yZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWVzc2FnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWcnKTtcclxuXHJcbnZhciBjb25maWdNaXhpbiA9IHJlcXVpcmUoJy4vanMvbWl4aW5zL2NvbmZpZy5qcycpO1xyXG5yaW90Lm1peGluKCdjb25maWcnLCBjb25maWdNaXhpbik7XHJcblxyXG5yaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7XHJcblxyXG52YXIgRnJvbnRFbmQgPSByZXF1aXJlKCcuL0Zyb250RW5kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IEZyb250RW5kKHRhZ3MpOyIsImNvbnN0IHN0YXRpY1JvdXRlcyA9IHtcclxuICAgICdmb290ZXInOiB0cnVlLFxyXG4gICAgJ2hvbWUnOiB0cnVlLFxyXG4gICAgJ2V4cGxvcmUnOiB0cnVlXHJcbn1cclxuXHJcbmNsYXNzIFJvdXRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xyXG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoID0gdGhpcy5nZXRQYXRoKHRhcmdldCk7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGljUm91dGVzW3BhdGhdKSB7XHJcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KCdtb2RhbC1kaWFsb2cnLCB7IGlkOiBwYXRoIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50byh3aW5kb3cubG9jYXRpb24uaGFzaCB8fCAnaG9tZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRQYXRoKHBhdGgpIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBpZiAocGF0aC5zdGFydHNXaXRoKCcjJykpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gcm91dGUuZ2V0UGF0aChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdG8ocGF0aCkge1xyXG4gICAgICAgIHBhdGggPSByb3V0ZS5nZXRQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHJpb3Qucm91dGUocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gcm91dGUudG8ocGF0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHJvdXRlID0gUm91dGVyO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXI7IiwibGV0IEF1dGgwTG9jayA9IHJlcXVpcmUoJ2F1dGgwLWxvY2snKTtcclxubGV0IFByb21pc2UgPSB3aW5kb3cuUHJvbWlzZTtcclxubGV0IGxvY2FsZm9yYWdlID0gd2luZG93LmxvY2FsZm9yYWdlO1xyXG5cclxuY2xhc3MgQXV0aDAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKCd3c09uYXJ0MjN5VmlJU2hxVDR3ZkoxOHcydnQyY2wzMicsICdtZXRhbWFwLmF1dGgwLmNvbScpO1xyXG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb2ZpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmxvY2suc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5BZnRlclNpZ251cDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3JlZnJlc2hfdG9rZW4nLCByZWZyZXNoX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaWRfdG9rZW4gPSBpZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnJlZnJlc2hfdG9rZW4gPSByZWZyZXNoX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBsaW5rQWNjb3VudCgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5sb2NrLnNob3coe1xyXG4gICAgICAgICAgICBjYWxsYmFja1VSTDogdGhhdC5jYWxsYmFja1VSTCxcclxuICAgICAgICAgICAgZGljdDoge1xyXG4gICAgICAgICAgICAgICAgc2lnbmluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoYXQuaWRfdG9rZW4gfHwgdGhhdC5wcm9maWxlLmlkZW50aXRpZXNbMF0uYWNjZXNzX3Rva2VuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZXNzaW9uKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgZ2V0UHJvZmlsZSA9IChpZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgZnVuY3Rpb24oZXJyLCBwcm9maWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5wcm9maWxlID0gcHJvZmlsZTtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZnVsZmlsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ3JlZnJlc2hfdG9rZW4nKS50aGVuKCh0b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLmdldENsaWVudCgpLnJlZnJlc2hUb2tlbih0b2tlbiwgKGEsIHRva09iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKHRva09iai5pZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb2ZpbGUoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ2lkX3Rva2VuJyk7XHJcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgncmVmcmVzaF90b2tlbicpO1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3Byb2ZpbGUnKTtcclxuICAgICAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgZmFjZWJvb2tBcGkgPSBmdW5jdGlvbiAoYXBpS2V5KSB7XHJcbiAgICBcclxuICAgIHdpbmRvdy5mYkFzeW5jSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuRkIuaW5pdCh7XHJcbiAgICAgICAgICAgIGFwcElkOiAnODQ3NzAyNzc1MzA0OTA2JyxcclxuICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgIHZlcnNpb246ICd2Mi4zJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdO1xyXG4gICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAganMuc3JjID0gXCIvL2Nvbm5lY3QuZmFjZWJvb2submV0L2VuX1VTL3Nkay5qc1wiO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgIH0oZG9jdW1lbnQsICdzY3JpcHQnLCAnZmFjZWJvb2stanNzZGsnKSk7XHJcblxyXG4gICAgcmV0dXJuIHdpbmRvdy5mYkFzeW5jSW5pdDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmFjZWJvb2tBcGk7XHJcblxyXG5cclxuIiwibGV0IEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKTtcclxubGV0IFByb21pc2UgPSB3aW5kb3cuUHJvbWlzZTtcclxubGV0IGxvY2FsZm9yYWdlID0gd2luZG93LmxvY2FsZm9yYWdlO1xyXG5sZXQgTWV0YU1hcCA9IHdpbmRvdy5NZXRhTWFwO1xyXG5cclxuY2xhc3MgTWV0YUZpcmUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmZiID0gbmV3IEZpcmViYXNlKGBodHRwczovLyR7dGhpcy5jb25maWcuc2l0ZS5kYn0uZmlyZWJhc2Vpby5jb21gKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IHJldCA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5BdXRoMC5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBwcm9maWxlLmNsaWVudElELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogaWRfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnZmlyZWJhc2VfdG9rZW4nLCB0aGF0LmZpcmViYXNlX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYi5hdXRoV2l0aEN1c3RvbVRva2VuKHRoYXQuZmlyZWJhc2VfdG9rZW4sIChlcnJvciwgYXV0aERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGlsZChwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmIuY2hpbGQocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YSAocGF0aCkge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNoaWxkLm9uKCd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNuYXBzaG90LnZhbCgpKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb24gKHBhdGgsIGNhbGxiYWNrLCBldmVudCA9ICd2YWx1ZScgKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgY2hpbGQub24oZXZlbnQsIChzbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soc25hcHNob3QudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YSAoZGF0YSwgcGF0aCkge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2hpbGQuc2V0KGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCAoKSB7XHJcbiAgICAgICAgdGhpcy5mYi51bmF1dGgoKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGFGaXJlOyIsIlxyXG52YXIgZ29vZ2xlQW5hbHl0aWNzID0gZnVuY3Rpb24gKGFwaUtleSkge1xyXG4gICAgXHJcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IHBvLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JzsgcG8uYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XHJcbiAgICAgICAgdmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xyXG4gICAgfSkoKTtcclxuXHJcbiAgICAvLyBHb29nbGUgQW5hbHl0aWNzIEFQSVxyXG4gIChmdW5jdGlvbihpLHMsbyxnLHIsYSxtKXtpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXT1yO2lbcl09aVtyXXx8ZnVuY3Rpb24oKXtcclxuICAgICAgKGlbcl0ucT1pW3JdLnF8fFtdKS5wdXNoKGFyZ3VtZW50cyl9LGlbcl0ubD0xKm5ldyBEYXRlKCk7YT1zLmNyZWF0ZUVsZW1lbnQobyksXHJcbiAgICAgIG09cy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTthLmFzeW5jPTE7YS5zcmM9ZztcclxuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcclxuICB9KSh3aW5kb3csZG9jdW1lbnQsJ3NjcmlwdCcsJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsJ2dhJyk7XHJcblxyXG4gICAgd2luZG93LmdhKCdjcmVhdGUnLCBhcGlLZXksICdhdXRvJyk7XHJcbiAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgIHJldHVybiB3aW5kb3cuZ2E7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdvb2dsZUFuYWx5dGljcztcclxuXHJcblxyXG4iLCJcclxudmFyIHR3aXR0ZXJBcGkgPSBmdW5jdGlvbiAoYXBpS2V5KSB7XHJcbiAgICBcclxuICAgIHdpbmRvdy50d3R0ciA9IChmdW5jdGlvbiAoZCwgcywgaWQpIHtcclxuICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgICB0ID0gd2luZG93LnR3dHRyIHx8IHt9O1xyXG4gICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuIHQ7XHJcbiAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAganMuaWQgPSBpZDtcclxuICAgICAgICBqcy5zcmMgPSBcImh0dHBzOi8vcGxhdGZvcm0udHdpdHRlci5jb20vd2lkZ2V0cy5qc1wiO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuXHJcbiAgICAgICAgdC5fZSA9IFtdO1xyXG4gICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgICAgICB0Ll9lLnB1c2goZik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9KGRvY3VtZW50LCBcInNjcmlwdFwiLCBcInR3aXR0ZXItd2pzXCIpKTtcclxuXHJcbiAgICBsZXQgdHJ5Q291bnQgPSAwO1xyXG4gICAgbGV0IGxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy50d3R0ciAmJiB3aW5kb3cudHd0dHIud2lkZ2V0cykge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LnR3dHRyLndpZGdldHMubG9hZCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZih0cnlDb3VudCA8IDUpIHtcclxuICAgICAgICAgICAgdHJ5Q291bnQgKz0gMTtcclxuICAgICAgICAgICAgXy5kZWxheShsb2FkLCAyNTApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbG9hZDtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHR3aXR0ZXJBcGk7XHJcblxyXG5cclxuIiwiXHJcbnZhciB1c2VyU25hcCA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXkgPSAnMDMyYmFmODctODU0NS00ZWJjLWE1NTctOTM0ODU5MzcxZmE1LmpzJywgcywgeDtcclxuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYXBpS2V5ID0gY29uZmlnLlVTRVJfU05BUF9BUElfS0VZO1xyXG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0ge1xyXG4gICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU25hcC5zZXRFbWFpbEJveChEb2MuYXBwLnVzZXIudXNlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgcy5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xyXG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHJldHVybiB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcclxuXHJcblxyXG4iLCJcclxubGV0IGNvbmZpZyA9IHtcclxuICAgIHBhdGhJbWc6IChmb2xkZXIpID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gYC8vYzY4Zjc5ODFhOGJiZTkyNmExZTAxNTRjYmZiZDVhZjFiNGRmMGYyMS5nb29nbGVkcml2ZS5jb20vaG9zdC8wQjZHQU40Z1gxYm5TZmxSbmRUUkplRlo1TkVzelNFRmxTelZLWkRaSlN6RnhlRGRpY0Zwb0xYVndTRE5GUldOMFJGaGZTMmMvJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vYDtcclxuICAgICAgICBpZiAoZm9sZGVyKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBgJHtmb2xkZXJ9L2A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0YTogKHBhdGgsIGNhbGxiYWNrLCB0aGF0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHdhdGNoRGF0YTogKHBhdGgsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdidXR0b25zJywgJzxkaXYgY2xhc3M9XCJyb3cgY2VudGVyLWhlYWRpbmdcIj4gPHNwYW4gZWFjaD1cInsgXy5zb3J0Qnkob3B0cy5idXR0b25zLFxcJ29yZGVyXFwnKSB9XCI+IDxhIGlmPVwieyAhYW1hem9uaWQgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IGxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHRpdGxlIH0gPC9hPiA8ZGl2IGlmPVwieyBhbWF6b25pZCB9XCIgY2xhc3M9XCJjb2wtc20teyBwYXJlbnQuY2VsbCB9IFwiPiA8aWZyYW1lIHN0eWxlPVwid2lkdGg6IDEyMHB4OyBoZWlnaHQ6IDI0MHB4O1wiIG1hcmdpbndpZHRoPVwiMFwiIG1hcmdpbmhlaWdodD1cIjBcIiBzY3JvbGxpbmc9XCJub1wiIGZyYW1lYm9yZGVyPVwiMFwiIHJpb3Qtc3JjPVwiLy93cy1uYS5hbWF6b24tYWRzeXN0ZW0uY29tL3dpZGdldHMvcT9TZXJ2aWNlVmVyc2lvbj0yMDA3MDgyMiZPbmVKUz0xJk9wZXJhdGlvbj1HZXRBZEh0bWwmTWFya2V0UGxhY2U9VVMmc291cmNlPWFjJnJlZj10Zl90aWwmYWRfdHlwZT1wcm9kdWN0X2xpbmsmdHJhY2tpbmdfaWQ9Y2FicnJlc2VsYWItMjAmbWFya2V0cGxhY2U9YW1hem9uJnJlZ2lvbj1VUyZwbGFjZW1lbnQ9eyBhbWF6b25pZCB9JmFzaW5zPXsgYW1hem9uaWQgfSZsaW5rSWQ9RElZM1RVT1BERkgzTlFXRiZzaG93X2JvcmRlcj1mYWxzZSZsaW5rX29wZW5zX2luX25ld193aW5kb3c9dHJ1ZVwiPjwvaWZyYW1lPiA8L2Rpdj4gPC9zcGFuPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5jZWxsID0gNjtcbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuYnV0dG9ucykge1xuICAgICAgICBfdGhpcy5jZWxsID0gTWF0aC5yb3VuZCgxMiAvIF8ua2V5cyhvcHRzLmJ1dHRvbnMpLmxlbmd0aCk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtb2RhbC1kaWFsb2cnLCAnPGRpdiBjbGFzcz1cIm1vZGFsIGZhZGVcIiBpZD1cInsgXy5rZWJhYkNhc2UoZGF0YS50aXRsZSkgfVwiID4gPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZyBtb2RhbC1sZ1wiPiA8ZGl2IGlkPVwibW9kYWxcIiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIiByaW90LXN0eWxlPVwiaGVpZ2h0OiB7IGhlaWdodCB9cHg7IHBvc2l0aW9uOiBmaXhlZDsgd2lkdGg6IDEwMCU7XCIgPiA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj4gPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj4gPC9idXR0b24+IDxzZWN0aW9uIGlkPVwibW9kYWxfZGlhbG9nX2NvbnRhaW5lclwiPiA8L3NlY3Rpb24+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG50aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDc1O1xudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMgJiYgb3B0cy5pZCAmJiBvcHRzLmlkICE9ICcjJykge1xuXG4gICAgICAgIEZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZXhwbG9yZS9pdGVtcy8nICsgb3B0cy5pZCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGRhdGEudHlwZTtcblxuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICBvcHRzLmV2ZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBvcHRzLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nOiBfdGhpcy5tb2RhbFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHJpb3QubW91bnQoX3RoaXMubW9kYWxfZGlhbG9nX2NvbnRhaW5lciwgJ2Jsb2ctZGlhbG9nJywgb3B0cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgUHMuaW5pdGlhbGl6ZShfdGhpcy5tb2RhbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJChfdGhpcy5yb290LmZpcnN0Q2hpbGQpLm1vZGFsKCkub24oJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnVubW91bnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzdG9yZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZyb250RW5kLlJvdXRlci50bygnaG9tZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBGcm9udEVuZC5Sb3V0ZXIudG8oJ2V4cGxvcmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdibG9nLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDwvZGl2PiA8aWZyYW1lIGlmPVwieyBkYXRhLnlvdXR1YmVpZCB9XCIgaWQ9XCJ5dHBsYXllclwiIHR5cGU9XCJ0ZXh0L2h0bWxcIiB3aWR0aD1cIjcyMFwiIGhlaWdodD1cIjQwNVwiIHJpb3Qtc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQveyBkYXRhLnlvdXR1YmVpZCB9P2F1dG9wbGF5PTFcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIj48L2lmcmFtZT4gPGlmcmFtZSBpZj1cInsgZGF0YS52aW1lb2lkIH1cIiByaW90LXNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby97IGRhdGEudmltZW9pZCB9XCIgd2lkdGg9XCI3MjBcIiBoZWlnaHQ9XCI0MDVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW49XCJcIiBtb3phbGxvd2Z1bGxzY3JlZW49XCJcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIj4gPC9pZnJhbWU+IDxkaXYgaWY9XCJ7IGJsb2cgfVwiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTAgXCI+IDxkaXYgPiA8cmF3IGNvbnRlbnQ9XCJ7IGJsb2cgfVwiPjwvcmF3PiA8L2Rpdj4gPGJ1dHRvbnMgYnV0dG9ucz1cInsgZGF0YS5idXR0b25zIH1cIj48L2J1dHRvbnM+IDwvZGl2PiA8ZGl2IGNsYXNzPVwid2VsbCBjb2wtc20tMlwiIHJpb3Qtc3R5bGU9XCJ3aWR0aDogMTIwcHg7IHBvc2l0aW9uOiBmaXhlZDsgbWFyZ2luLWxlZnQ6IHsgbWFyZ2luIH1weFwiPiA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIGNvbnRhY3QgXCI+IDxsaT4gPGEgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vc2hhcmVcIiBjbGFzcz1cInR3aXR0ZXItc2hhcmUtYnV0dG9uXCIgZGF0YS12aWE9XCJ7IHNvY2lhbC50d2l0dGVyLnRpdGxlIH1cIj5Ud2VldDwvYT4gPC9saT4gPGxpPiA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDogMTBweDtcIiBpZD1cImdwbHVzb25lXCIgY2xhc3M9XCJnLXBsdXNvbmVcIiBkYXRhLXNpemU9XCJzbWFsbFwiPjwvZGl2PiA8L2xpPiA8bGk+IDxkaXYgY2xhc3M9XCJmYi1zaGFyZS1idXR0b25cIiBkYXRhLWhyZWY9XCJ7IHVybCB9XCIgZGF0YS1sYXlvdXQ9XCJidXR0b25fY291bnRcIj48L2Rpdj4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiA8YnV0dG9ucyBpZj1cInsgIWJsb2cgfVwiIGJ1dHRvbnM9XCJ7IGRhdGEuYnV0dG9ucyB9XCI+PC9idXR0b25zPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuZXZlbnQuaWQpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcblxuICAgICAgICBfdGhpcy5tYXJnaW4gPSB3aW5kb3cuaW5uZXJXaWR0aCAtICQoJyNtb2RhbCcpLndpZHRoKCkgKyAyMjA7XG4gICAgICAgIF90aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3NvY2lhbCcpLnRoZW4oZnVuY3Rpb24gKHNvY2lhbCkge1xuICAgICAgICAgICAgX3RoaXMuc29jaWFsID0gc29jaWFsO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcmVmID0gRnJvbnRFbmQuTWV0YUZpcmUuZ2V0Q2hpbGQoRnJvbnRFbmQuc2l0ZSArICcvY29udGVudC8nICsgb3B0cy5ldmVudC5pZCk7XG4gICAgICAgIHZhciBmaXJlcGFkID0gbmV3IEZpcmVwYWQuSGVhZGxlc3MocmVmKTtcbiAgICAgICAgZmlyZXBhZC5nZXRIdG1sKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICAgICAgICBfdGhpcy5ibG9nID0gaHRtbDtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgUHMudXBkYXRlKG9wdHMuZXZlbnQuZGlhbG9nKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG52YXIgaWdub3JlID0gZmFsc2U7XG50aGlzLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFpZ25vcmUgJiYgJCgnI21vZGFsJykud2lkdGgoKSA+IDEwMCkge1xuICAgICAgICBfdGhpcy5tYXJnaW4gPSB3aW5kb3cuaW5uZXJXaWR0aCAtICQoJyNtb2RhbCcpLndpZHRoKCkgKyAyMjA7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICBGcm9udEVuZC5pbml0U29jaWFsKCk7XG4gICAgICAgIGdhcGkucGx1c29uZS5yZW5kZXIoJ2dwbHVzb25lJyk7XG4gICAgICAgIGlnbm9yZSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWdub3JlID0gZmFsc2U7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYmFubmVyJywgJzxkaXYgY2xhc3M9XCJmdWxsd2lkdGhiYW5uZXJcIj4gPGRpdiBpZD1cInRwX2Jhbm5lclwiIGNsYXNzPVwidHAtYmFubmVyXCI+IDx1bD4gIDxsaSBlYWNoPVwieyBkYXRhIH1cIiBkYXRhLXRyYW5zaXRpb249XCJmYWRlXCIgZGF0YS1zbG90YW1vdW50PVwiNVwiIGRhdGEtdGl0bGU9XCJ7IHRpdGxlIH1cIiBzdHlsZT1cImJhY2tncm91bmQ6IHJnYigyNDAsMTEwLDMwKTtcIiA+ICA8aW1nIGlmPVwieyBpbWcgfVwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nIH1cIiBhbHQ9XCJkYXJrYmx1cmJnXCIgZGF0YS1iZ2ZpdD1cImNvdmVyXCIgZGF0YS1iZ3Bvc2l0aW9uPVwibGVmdCB0b3BcIiBkYXRhLWJncmVwZWF0PVwibm8tcmVwZWF0XCI+IDxkaXYgaWY9XCJ7IHRpdGxlIH1cIiBjbGFzcz1cImNhcHRpb24gdGl0bGUtMiBzZnRcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjEwMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjEwMDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IDxyYXcgY29udGVudD1cInsgdGl0bGUgfVwiPjwvcmF3PiA8L2Rpdj4gPGRpdiBpZj1cInsgc3VidGV4dCB9XCIgY2xhc3M9XCJjYXB0aW9uIHRleHQgc2ZsXCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIyMjBcIiBkYXRhLXNwZWVkPVwiMTAwMFwiIGRhdGEtc3RhcnQ9XCIxODAwXCIgZGF0YS1lYXNpbmc9XCJlYXNlT3V0RXhwb1wiPiA8cmF3IGNvbnRlbnQ9XCJ7IHN1YnRleHQgfVwiPjwvcmF3PiA8L2Rpdj4gPGRpdiBlYWNoPVwieyBidXR0b25zIH1cIj4gPGRpdiBjbGFzcz1cImNhcHRpb24gc2ZiIHJldi1idXR0b25zIHRwLXJlc2l6ZW1lXCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIzNTVcIiBkYXRhLXNwZWVkPVwiNTAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cIlNpbmUuZWFzZU91dFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5nZXRMaW5rIH1cIj4gPGEgaHJlZj1cInsgbGluayB8fCBcXCdcXCcgfVwiIHRhcmdldD1cInsgdGFyZ2V0IHx8IFxcJ1xcJ31cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIj57IHRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZj1cInsgeW91dHViZWlkIH1cIiBjbGFzcz1cInRwLWNhcHRpb24gc2Z0IGN1c3RvbW91dCB0cC12aWRlb2xheWVyXCIgZGF0YS14PVwiY2VudGVyXCIgZGF0YS1ob2Zmc2V0PVwiMTM0XCIgZGF0YS15PVwiY2VudGVyXCIgZGF0YS12b2Zmc2V0PVwiLTZcIiBkYXRhLWN1c3RvbWluPVwieDowO3k6MDt6OjA7cm90YXRpb25YOjA7cm90YXRpb25ZOjA7cm90YXRpb25aOjA7c2NhbGVYOjU7c2NhbGVZOjU7c2tld1g6MDtza2V3WTowO29wYWNpdHk6MDt0cmFuc2Zvcm1QZXJzcGVjdGl2ZTo2MDA7dHJhbnNmb3JtT3JpZ2luOjUwJSA1MCU7XCIgZGF0YS1jdXN0b21vdXQ9XCJ4OjA7eTowO3o6MDtyb3RhdGlvblg6MDtyb3RhdGlvblk6MDtyb3RhdGlvblo6MDtzY2FsZVg6MC43NTtzY2FsZVk6MC43NTtza2V3WDowO3NrZXdZOjA7b3BhY2l0eTowO3RyYW5zZm9ybVBlcnNwZWN0aXZlOjYwMDt0cmFuc2Zvcm1PcmlnaW46NTAlIDUwJTtcIiBkYXRhLXNwZWVkPVwiNjAwXCIgZGF0YS1zdGFydD1cIjEwMDBcIiBkYXRhLWVhc2luZz1cIlBvd2VyNC5lYXNlT3V0XCIgZGF0YS1lbmRzcGVlZD1cIjUwMFwiIGRhdGEtZW5kZWFzaW5nPVwiUG93ZXI0LmVhc2VPdXRcIiBkYXRhLWF1dG9wbGF5PVwidHJ1ZVwiIGRhdGEtYXV0b3BsYXlvbmx5Zmlyc3R0aW1lPVwiZmFsc2VcIiBkYXRhLW5leHRzbGlkZWF0ZW5kPVwiZmFsc2VcIiBkYXRhLXRodW1iaW1hZ2U9XCJodHRwczovL2ltZy55b3V0dWJlLmNvbS92aS97IHlvdXR1YmVpZCB9L21xZGVmYXVsdC5qcGdcIj4gPGlmcmFtZSByaW90LXNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgeW91dHViZWlkIH0/aGQ9MSZ3bW9kZT1vcGFxdWUmY29udHJvbHM9MSZzaG93aW5mbz0wXCIgd2lkdGg9XCI2NDBcIiBoZWlnaHQ9XCIzNjBcIiBzdHlsZT1cIndpZHRoOjY0MHB4O2hlaWdodDozNjBweDtcIj4gPC9pZnJhbWU+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+JywgJ2lkPVwiaG9tZVwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygnc2l0ZScpO1xudGhpcy5tb3VudGVkID0gZmFsc2U7XG5cbnRoaXMud2F0Y2hEYXRhKCcvYmFubmVyJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZmFsc2UgPT0gX3RoaXMubW91bnRlZCkge1xuICAgICAgICBfdGhpcy5tb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMuZGF0YSA9IF8uc29ydEJ5KGRhdGEsICdvcmRlcicpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKF90aGlzLnRwX2Jhbm5lcikucmV2b2x1dGlvbih7XG4gICAgICAgICAgICBzdG9wQXRTbGlkZTogMSxcbiAgICAgICAgICAgIHN0b3BBZnRlckxvb3BzOiAwLFxuICAgICAgICAgICAgc3RhcnR3aWR0aDogMTE3MCxcbiAgICAgICAgICAgIHN0YXJ0aGVpZ2h0OiA2MDAsXG4gICAgICAgICAgICBoaWRlVGh1bWJzOiAxMFxuICAgICAgICAgICAgLy9mdWxsV2lkdGg6IFwib25cIixcbiAgICAgICAgICAgIC8vZm9yY2VGdWxsV2lkdGg6IFwib25cIixcbiAgICAgICAgICAgIC8vbGF6eUxvYWQ6IFwib25cIlxuICAgICAgICAgICAgLy8gbmF2aWdhdGlvblN0eWxlOiBcInByZXZpZXc0XCJcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vZWxzZSB7XG4gICAgLy8gICAgdGhpcy51bm1vdW50KHRydWUpO1xuICAgIC8vICAgIHJpb3QubW91bnQoJ3BhZ2UtYmFubmVyJyk7XG4gICAgLy99XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb3VudG1laW4nLCAnPHNlY3Rpb24gY2xhc3M9XCJmdW4tZmFjdC13cmFwIGZ1bi1mYWN0cy1iZ1wiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiBmYWN0cy1pblwiPiA8aDM+IDxzcGFuIGNsYXNzPVwiY291bnRlclwiPjg3Niw1Mzk8L3NwYW4+KyA8L2gzPiA8aDQ+U3lzdGVtcyBUaGlua2VyczwvaDQ+IDxicj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPkNvdW50IE1lIEluPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgZnVuY3Rpb24ob3B0cykge1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWV4cGxvcmUnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj4gPHN0cm9uZz57IGhlYWRlci50aXRsZSB9PC9zdHJvbmc+IDwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJjdWJlLW1hc29ucnlcIj4gPGRpdiBpZD1cImZpbHRlcnNfY29udGFpbmVyXCIgY2xhc3M9XCJjYnAtbC1maWx0ZXJzLWFsaWduQ2VudGVyXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIGZpbHRlcnMgfVwiIGRhdGEtZmlsdGVyPVwiLnsgdmFsLnRhZyB9XCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW0geyBcXCdjYnAtZmlsdGVyLWl0ZW0tYWN0aXZlXFwnOiBpID09IDAgfVwiPiB7IHZhbC5uYW1lIH0gPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9XCJtYXNvbnJ5X2NvbnRhaW5lclwiIGNsYXNzPVwiY2JwXCI+IDxkaXYgaWQ9XCJ7IGlkIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCIgZWFjaD1cInsgY29udGVudCB9XCIgY2xhc3M9XCJjYnAtaXRlbSB7IHR5cGUgfSB7IF8ua2V5cyh0YWdzKS5qb2luKFxcJyBcXCcpIH1cIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uXCIgZGF0YS10aXRsZT1cInsgdGV4dCB9XCIgaHJlZj1cInsgbGluayB8fCBwYXJlbnQudXJsICsgdHlwZSArIFxcJy9cXCcgKyBpbWcgfVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBpZj1cInsgaW1nIH1cIiByaW90LXNyYz1cInsgcGFyZW50LnVybCArIHR5cGUgKyBcXCcvXFwnICsgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBpZj1cInsgdGl0bGUgfVwiIGNsYXNzPVwieyBcXCdjYnAtbC1jYXB0aW9uLXRpdGxlXFwnOiB0cnVlIH1cIiA+eyB0aXRsZSB9PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIG9uY2xpY2s9XCJ7IHNob3dBbGwgfVwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPkV4cGxvcmUgQWxsPC9hPiA8L2Rpdj4nLCAnaWQ9XCJleHBsb3JlXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG50aGlzLnNob3dBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChfdGhpcy5tYXNvbnJ5X2NvbnRhaW5lcikuY3ViZXBvcnRmb2xpbygnZmlsdGVyJywgJyonKTtcbn07XG5cbnRoaXMub25DbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgcmlvdC5yb3V0ZShfLmtlYmFiQ2FzZShlLml0ZW0udGl0bGUpLCBlLCBfdGhpcyk7XG59O1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2V4cGxvcmUnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuZmlsdGVycyA9IF8uc29ydEJ5KGRhdGEuZmlsdGVycywgJ29yZGVyJyk7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBfLnNvcnRCeShfLm1hcChkYXRhLml0ZW1zLCBmdW5jdGlvbiAodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHZhbCAmJiAhKHZhbC5hcmNoaXZlID09PSB0cnVlKSkge1xuICAgICAgICAgICAgdmFsLmlkID0ga2V5O1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgIH0pLCAnb3JkZXInKTtcbiAgICBfdGhpcy5jb250ZW50ID0gX3RoaXMuaXRlbXM7IC8vXy5maWx0ZXIoIHRoaXMuaXRlbXMsIChpdGVtKSA9PiB7IHJldHVybiAhKGl0ZW0uYXJjaGl2ZSA9PT0gdHJ1ZSkgfSApO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgdmFyIGRlZmF1bHRGaWx0ZXIgPSBfLmZpcnN0KF90aGlzLmZpbHRlcnMsIGZ1bmN0aW9uIChmaWx0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGZpbHRlclsnZGVmYXVsdCddID09PSB0cnVlO1xuICAgIH0pO1xuXG4gICAgJChfdGhpcy5tYXNvbnJ5X2NvbnRhaW5lcikuY3ViZXBvcnRmb2xpbyh7XG4gICAgICAgIGZpbHRlcnM6ICcjZmlsdGVyc19jb250YWluZXInLFxuICAgICAgICBsYXlvdXRNb2RlOiAnZ3JpZCcsXG4gICAgICAgIGRlZmF1bHRGaWx0ZXI6ICcuJyArIGRlZmF1bHRGaWx0ZXIudGFnLFxuICAgICAgICBhbmltYXRpb25UeXBlOiAnZmxpcE91dERlbGF5JyxcbiAgICAgICAgZ2FwSG9yaXpvbnRhbDogMjAsXG4gICAgICAgIGdhcFZlcnRpY2FsOiAyMCxcbiAgICAgICAgZ3JpZEFkanVzdG1lbnQ6ICdyZXNwb25zaXZlJyxcbiAgICAgICAgbWVkaWFRdWVyaWVzOiBbe1xuICAgICAgICAgICAgd2lkdGg6IDExMDAsXG4gICAgICAgICAgICBjb2xzOiA0XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgICAgICBjb2xzOiAzXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICBjb2xzOiAyXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiAzMjAsXG4gICAgICAgICAgICBjb2xzOiAxXG4gICAgICAgIH1dLFxuICAgICAgICBjYXB0aW9uOiAnb3ZlcmxheUJvdHRvbUFsb25nJyxcbiAgICAgICAgZGlzcGxheVR5cGU6ICdib3R0b21Ub1RvcCcsXG4gICAgICAgIGRpc3BsYXlUeXBlU3BlZWQ6IDEwMFxuICAgIH0pO1xufSk7XG4vL3Jpb3QubW91bnQoJ21vZGFsLWRpYWxvZycsIHsgZXZlbnQ6IGUsIHRhZzogdGhpcyB9KVxufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsICc8Zm9vdGVyIGlkPVwiZm9vdGVyXCI+IDxkaXYgaWQ9XCJjb250YWN0XCIgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPnsgZGF0YS5hYm91dC50aXRsZSB9PC9oMz4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj57IGRhdGEuYWJvdXQudGV4dCB9PC9wPiA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIGNvbnRhY3RcIj4gPGxpIGVhY2g9XCJ7IGRhdGEuY29udGFjdCB9XCI+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+IDxzdHJvbmc+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+eyB0aXRsZSB9OiA8L3N0cm9uZz4gPGEgaWY9XCJ7IGxpbmsgfVwiIGhyZWY9XCJ7IGxpbmsgfVwiIHN0eWxlPVwiY29sb3I6ICNmZmZcIiA+eyB0ZXh0IHx8IGxpbmsgfTwvYT4gPHNwYW4gaWY9XCJ7ICFsaW5rIH1cIj57IHRleHQgfTwvc3Bhbj4gPC9wPiA8L2xpPiA8L3VsPiA8dWwgaWQ9XCJzb2NpYWxfZm9sbG93XCIgY2xhc3M9XCJsaXN0LWlubGluZSBzb2NpYWwtMVwiPiA8bGkgZWFjaD1cInsgZGF0YS5hYm91dC5zb2NpYWwgfVwiPiA8YSBocmVmPVwieyBsaW5rIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPkZvbGxvdyBVczwvaDM+IDxhIGlmPVwieyBzb2NpYWwudHdpdHRlciB9XCIgY2xhc3M9XCJ0d2l0dGVyLXRpbWVsaW5lXCIgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20veyBzb2NpYWwudHdpdHRlci50aXRsZSB9XCIgZGF0YS13aWRnZXQtaWQ9XCJ7IHNvY2lhbC50d2l0dGVyLmFwaSB9XCI+VHdlZXRzIGJ5IEB7IHNvY2lhbC50d2l0dGVyLnRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+TGlrZSBVczwvaDM+IDxkaXYgaWY9XCJ7IHNvY2lhbC5mYWNlYm9vayB9XCIgY2xhc3M9XCJmYi1wYWdlXCIgZGF0YS1ocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3sgc29jaWFsLmZhY2Vib29rLnRpdGxlIH1cIiBkYXRhLXNtYWxsLWhlYWRlcj1cInRydWVcIiBkYXRhLWFkYXB0LWNvbnRhaW5lci13aWR0aD1cInRydWVcIiBkYXRhLWhpZGUtY292ZXI9XCJmYWxzZVwiIGRhdGEtc2hvdy1mYWNlcGlsZT1cInRydWVcIiBkYXRhLWhlaWdodD1cIjMwMFwiIGRhdGEtd2lkdGg9XCIyODBcIiBkYXRhLXNob3ctcG9zdHM9XCJ0cnVlXCI+IDxkaXYgY2xhc3M9XCJmYi14ZmJtbC1wYXJzZS1pZ25vcmVcIj4gPGJsb2NrcXVvdGUgY2l0ZT1cImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS97IHNvY2lhbC5mYWNlYm9vay50aXRsZSB9XCI+IDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20veyBzb2NpYWwuZmFjZWJvb2sudGl0bGUgfVwiPnsgdGl0bGUgfTwvYT4gPC9ibG9ja3F1b3RlPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+Sm9pbiBVczwvaDM+IDxkaXYgaWQ9XCJtY19lbWJlZF9zaWdudXBcIj4gPGZvcm0gYWN0aW9uPVwiLy9jYWJyZXJhbGFicy51czQubGlzdC1tYW5hZ2UuY29tL3N1YnNjcmliZS9wb3N0P3U9NTg5NDczODUzODNkMzIzY2FmOTA0N2YzOSZhbXA7aWQ9OTc5OWQzYTdiOVwiIG1ldGhvZD1cInBvc3RcIiBpZD1cIm1jLWVtYmVkZGVkLXN1YnNjcmliZS1mb3JtXCIgbmFtZT1cIm1jLWVtYmVkZGVkLXN1YnNjcmliZS1mb3JtXCIgY2xhc3M9XCJcIiB0YXJnZXQ9XCJfYmxhbmtcIiBub3ZhbGlkYXRlPVwiXCI+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+eyBkYXRhLm5ld3NsZXR0ZXIudGV4dCB9PC9wPiA8ZGl2IGlkPVwibWNfZW1iZWRfc2lnbnVwX3Njcm9sbFwiPiA8ZGl2IGNsYXNzPVwibWMtZmllbGQtZ3JvdXBcIj4gPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+IDxpbnB1dCB0eXBlPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cIkVtYWlsLi4uXCIgc3R5bGU9XCJoZWlnaHQ6IDMxcHg7XCIgdmFsdWU9XCJcIiBuYW1lPVwiRU1BSUxcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwibWNlLUVNQUlMXCI+IDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+IDxpbnB1dCByb2xlPVwiYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU3Vic2NyaWJlXCIgbmFtZT1cInN1YnNjcmliZVwiIGlkPVwibWMtZW1iZWRkZWQtc3Vic2NyaWJlXCIgY2xhc3M9XCJidG4gYnRuLXRoZW1lLWJnXCI+U3Vic2NyaWJlPC9pbnB1dD4gPC9zcGFuPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAtNTAwMHB4O1wiPiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYl81ODk0NzM4NTM4M2QzMjNjYWY5MDQ3ZjM5Xzk3OTlkM2E3YjlcIiB0YWJpbmRleD1cIi0xXCIgdmFsdWU9XCJcIj4gPC9kaXY+IDxkaXYgaWQ9XCJtY2UtcmVzcG9uc2VzXCIgY2xhc3M9XCJjbGVhclwiIHN0eWxlPVwibWFyZ2luLXRvcDogNXB4O1wiPiA8ZGl2IGNsYXNzPVwicmVzcG9uc2VcIiBpZD1cIm1jZS1lcnJvci1yZXNwb25zZVwiIHN0eWxlPVwiY29sb3I6IHJlZDsgZGlzcGxheTpub25lXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJyZXNwb25zZVwiIGlkPVwibWNlLXN1Y2Nlc3MtcmVzcG9uc2VcIiBzdHlsZT1cImNvbG9yOiAjZmZmOyBkaXNwbGF5Om5vbmVcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Zvcm0+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9mb290ZXI+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxudGhpcy5zb2NpYWwgPSBudWxsO1xudGhpcy5kYXRhID0gbnVsbDtcbnRoaXMudGl0bGUgPSBGcm9udEVuZC5jb25maWcuc2l0ZS50aXRsZTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9mb290ZXInKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3NvY2lhbCcpLnRoZW4oZnVuY3Rpb24gKHNvY2lhbCkge1xuICAgICAgICBfdGhpcy5zb2NpYWwgPSBzb2NpYWw7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICBGcm9udEVuZC5pbml0U29jaWFsKCk7XG4gICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1pbXBhY3QnLCAnPHNlY3Rpb24+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDIgaWY9XCJ7IGhlYWRlciB9XCI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwIGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwibGVhZFwiPiB7IGhlYWRlci50ZXh0IH0gPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwiaW1wYWN0X3NsaWRlclwiIGNsYXNzPVwib3dsLWNhcm91c2VsXCI+IDxkaXYgY2xhc3M9XCJpdGVtXCIgZWFjaD1cInsgaXRlbXMgfVwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpbWcgaWY9XCJ7IGltZyB9XCIgd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjEyNXB4XCIgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgfWltcGFjdC97IGltZyB9XCIgYWx0PVwieyB0aXRsZSB9XCI+IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9zZWN0aW9uPicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvaW1wYWN0JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKF90aGlzLmltcGFjdF9zbGlkZXIpLm93bENhcm91c2VsKHtcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogMzAwMCxcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtczogNCxcbiAgICAgICAgICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcFNtYWxsOiBbOTkxLCAyXVxuICAgICAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1lc3NhZ2UnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPjxyYXcgY29udGVudD1cInsgaGVhZGVyLnRleHQgfVwiPjwvcmF3PiA8L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJyb3cgc3BlY2lhbC1mZWF0dXJlXCI+IDxkaXYgZWFjaD1cInsgaXRlbXMgfVwiIGNsYXNzPVwiY29sLW1kLTQgY29sLXNtLTQgbWFyZ2luMTBcIj4gPGRpdiBjbGFzcz1cInMtZmVhdHVyZS1ib3ggdGV4dC1jZW50ZXIgd293IGFuaW1hdGVkIGZhZGVJblwiIGRhdGEtd293LWR1cmF0aW9uPVwiNzAwbXNcIiBkYXRhLXdvdy1kZWxheT1cIjIwMG1zXCI+IDxkaXYgY2xhc3M9XCJtYXNrLXRvcFwiPiAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gIDxoND57IHRpdGxlIH08L2g0PiA8L2Rpdj4gPGRpdiBjbGFzcz1cIm1hc2stYm90dG9tXCI+ICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiAgPGg0PnsgdGl0bGUgfTwvaDQ+ICA8cD57IHRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmhlYWRlciA9IHt9O1xudGhpcy5pdGVtcyA9IFtdO1xuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9tZXNzYWdlJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1ldGhvZG9sb2d5JywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwIGNsYXNzPVwibGVhZFwiPnsgaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTMwXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDQ+eyBmcmFtZXdvcmtzLmhlYWRlci50aXRsZSB9PC9oND4gPHAgY2xhc3M9XCJsZWFkXCI+eyBmcmFtZXdvcmtzLmhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicGFuZWwtZ3JvdXBcIiBpZD1cImZyYW1ld29ya3NcIj4gPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gZnJhbWV3b3Jrcy5pdGVtcyB9XCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+IDxoNCBjbGFzcz1cInBhbmVsLXRpdGxlXCI+IDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXBhcmVudD1cIiNmcmFtZXdvcmtzXCIgaHJlZj1cIiNjb2xsYXBzZUZyYW1ld29ya3NfeyBpIH1cIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvaDQ+IDwvZGl2PiA8ZGl2IGlkPVwiY29sbGFwc2VGcmFtZXdvcmtzX3sgaSB9XCIgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZSB7IGluOiBpID09IDAgfVwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPiB7IHZhbC50ZXh0IH0gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDQ+eyBwYXJ0bmVycy5oZWFkZXIudGl0bGUgfTwvaDQ+IDxwIGNsYXNzPVwibGVhZFwiPnsgcGFydG5lcnMuaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJwYW5lbC1ncm91cFwiIGlkPVwiYWNjb3JkaW9uXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIHBhcnRuZXJzLml0ZW1zIH1cIiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj4gPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gPGg0IGNsYXNzPVwicGFuZWwtdGl0bGVcIj4gPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtcGFyZW50PVwiI2FjY29yZGlvblwiIGhyZWY9XCIjY29sbGFwc2VPbmVfeyBpIH1cIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvaDQ+IDwvZGl2PiA8ZGl2IGlkPVwiY29sbGFwc2VPbmVfeyBpIH1cIiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlIHsgaW46IGkgPT0gMCB9XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+IHsgdmFsLnRleHQgfSA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL21ldGhvZG9sb2d5JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuZnJhbWV3b3JrcyA9IGRhdGEuZnJhbWV3b3JrcztcbiAgICAgICAgX3RoaXMucGFydG5lcnMgPSBkYXRhLnBhcnRuZXJzO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVudS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPiA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj4gPGxpIGNsYXNzPVwieyBkcm9wZG93bjogdHJ1ZSwgYWN0aXZlOiBpID09IDAgfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhIH1cIj4gPGEgaWY9XCJ7IHZhbC50aXRsZSB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiIGhyZWY9XCJ7IHZhbC5saW5rIHx8IFxcJyNcXCcgfVwiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPiA8aSBpZj1cInsgdmFsLmljb24gfVwiIGNsYXNzPVwieyB2YWwuaWNvbiB9XCIgPjwvaT4geyB2YWwudGl0bGUgfSA8aSBpZj1cInsgdmFsLm1lbnUgJiYgdmFsLm1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIiA+PC9pPiA8L2E+IDx1bCBpZj1cInsgdmFsLm1lbnUgJiYgdmFsLm1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgbXVsdGktbGV2ZWxcIiByb2xlPVwibWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImRyb3Bkb3duTWVudVwiPiA8bGkgZWFjaD1cInsgdmFsLm1lbnUgfVwiID4gPGEgb25jbGljaz1cInBhcmVudC5vbmNsaWNrXCIgaHJlZj1cInsgbGluayB8fCBcXCcjXFwnIH1cIj4gPGkgaWY9XCJ7IGljb24gfVwiIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG50aGlzLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZSwgdGFnKSB7XG4gICAgaWYgKGUuaXRlbSAmJiBlLml0ZW0udmFsLmxpbmspIHtcbiAgICAgICAgRnJvbnRFbmQuUm91dGVyLnRvKGUuaXRlbS52YWwubGluayk7XG4gICAgfSBlbHNlIGlmIChlLml0ZW0gJiYgZS5pdGVtLnZhbC5hY3Rpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coZS5pdGVtLnZhbC5hY3Rpb24pO1xuICAgIH1cbn07XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbmF2YmFyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBfLnNvcnRCeShkYXRhLCAnb3JkZXInKTtcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5hdmJhcicsICc8ZGl2IGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1zdGF0aWMtdG9wIHlhbW0gc3RpY2t5XCIgcm9sZT1cIm5hdmlnYXRpb25cIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwibmF2YmFyLWhlYWRlclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5hdmJhci10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+IDxzcGFuIGNsYXNzPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8L2J1dHRvbj4gPGRpdj4gPGltZyBpZj1cInsgZGF0YSB9XCIgc3R5bGU9XCJtYXJnaW4tdG9wOiA3cHg7IG1hcmdpbi1yaWdodDogMTVweDtcIiByaW90LXNyYz1cInsgdXJsIH1zaXRlL3sgZGF0YS5pbWcgfVwiIGFsdD1cInsgZGF0YS5hbHQgfVwiPiA8L2Rpdj4gPC9kaXY+IDxwYWdlLW1lbnUtbmF2YmFyPjwvcGFnZS1tZW51LW5hdmJhcj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbG9nbycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5ld3MnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGgzIGNsYXNzPVwiaGVhZGluZ1wiPkxhdGVzdCBOZXdzPC9oMz4gPGRpdiBpZD1cIm5ld3NfY2Fyb3VzZWxcIiBjbGFzcz1cIm93bC1jYXJvdXNlbCBvd2wtc3BhY2VkXCI+IDxkaXYgZWFjaD1cInsgZGF0YSB9XCI+ICAgPGRpdiBjbGFzcz1cIm5ld3MtZGVzY1wiPiA8aDU+IDxhIGhyZWY9XCJ7IGJ5ID8gbGluayA6IFxcJ2phdmFzY3JpcHQ6O1xcJyB9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+eyBIdW1hbml6ZS50cnVuY2F0ZSh0aXRsZSwgMTI1KSB9PC9hPiA8L2g1PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBbXTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9uZXdzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5kYXRhID0gXy50b0FycmF5KGRhdGEpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgJChfdGhpcy5uZXdzX2Nhcm91c2VsKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICAgICAgLy8gTW9zdCBpbXBvcnRhbnQgb3dsIGZlYXR1cmVzXG4gICAgICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICAgICAgaXRlbXNDdXN0b206IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcFNtYWxsOiBbOTgwLCAyXSxcbiAgICAgICAgICAgICAgICBpdGVtc1RhYmxldDogWzc2OCwgMl0sXG4gICAgICAgICAgICAgICAgaXRlbXNUYWJsZXRTbWFsbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXNNb2JpbGU6IFs0NzksIDFdLFxuICAgICAgICAgICAgICAgIHNpbmdsZUl0ZW06IGZhbHNlLFxuICAgICAgICAgICAgICAgIHN0YXJ0RHJhZ2dpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6IDQwMDBcbiAgICAgICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS10ZXN0aW1vbmlhbHMnLCAnPGRpdiBpZD1cInRlc3RpbW9uaWFscy1jYXJvdXNlbFwiIGNsYXNzPVwidGVzdGltb25pYWxzIHRlc3RpbW9uaWFscy12LTIgd293IGFuaW1hdGVkIGZhZGVJblVwXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMTAwbXNcIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+eyBoZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+IDxkaXYgaWQ9XCJ0ZXN0aW1vbmlhbF9zbGlkZVwiIGNsYXNzPVwidGVzdGktc2xpZGVcIj4gPHVsIGNsYXNzPVwic2xpZGVzXCI+IDxsaSBlYWNoPVwieyBpdGVtcyB9XCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgKyBpbWcgfVwiIGFsdD1cInsgdXNlciB9XCI+IDxoND4gPGkgY2xhc3M9XCJmYSBmYS1xdW90ZS1sZWZ0IGlvbi1xdW90ZVwiPjwvaT4geyB0ZXh0fSA8L2g0PiA8cCBjbGFzcz1cInRlc3QtYXV0aG9yXCI+IHsgdXNlciB9IC0gPGVtPnsgc3VidGV4dCB9PC9lbT4gPC9wPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlMzBcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCd0ZXN0aW1vbmlhbHMnKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy90ZXN0aW1vbmlhbHMnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMudGVzdGltb25pYWxfc2xpZGUpLmZsZXhzbGlkZXIoe1xuICAgICAgICAgICAgICAgIHNsaWRlc2hvd1NwZWVkOiA1MDAwLFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbk5hdjogZmFsc2UsXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnZmFkZSdcbiAgICAgICAgfSk7XG59KTtcbn0pOyJdfQ==
