(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FrontEnd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');
var riot = window.riot;
var Router = require('./js/core/Router');

var config = function config() {
    var SITES = {
        CRL: {
            frontEnd: 'crlab',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'Cabrera Research Lab',
            favico: 'frontend/dist/img/ico/favicon.ico'
        },
        THINK_WATER: {
            frontEnd: 'thinkwater',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'ThinkWater',
            favico: 'frontend/dist/img/ico/favicon.ico'
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
        favico.setAttribute('href', '//c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/' + this.config.site.frontEnd + '/favicon.ico');

        this.MetaFire = new MetaFire(this.config);
        this.Auth0 = new Auth0(this.config);
        usersnap();
    }

    _createClass(FrontEnd, [{
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

},{"./js/core/Router":3,"./js/integrations/auth0":4,"./js/integrations/firebase":5,"./js/integrations/usersnap":6}],2:[function(require,module,exports){
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
window.Humanize = require('humanize-plus');
window.moment = require('moment');
window.URI = require('URIjs');
window.localforage = require('localforage');

var tags = ['page-head', 'page-banner', 'page-impact', 'page-countmein', 'page-footer', 'page-navbar-menu', 'page-navbar', 'page-news', 'page-explore', 'page-message', 'page-methodology', 'page-testimonials'];

require('./tags/dialogs/infographic-dialog.tag');
require('./tags/dialogs/product-dialog.tag');
require('./tags/dialogs/project-dialog.tag');
require('./tags/dialogs/publication-dialog.tag');
require('./tags/dialogs/software-dialog.tag');
require('./tags/dialogs/speaking-dialog.tag');
require('./tags/dialogs/training-dialog.tag');
require('./tags/dialogs/video-dialog.tag');
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

},{"./FrontEnd":1,"./js/mixins/config.js":7,"./tags/components/modal-dialog.tag":8,"./tags/dialogs/infographic-dialog.tag":9,"./tags/dialogs/product-dialog.tag":10,"./tags/dialogs/project-dialog.tag":11,"./tags/dialogs/publication-dialog.tag":12,"./tags/dialogs/software-dialog.tag":13,"./tags/dialogs/speaking-dialog.tag":14,"./tags/dialogs/training-dialog.tag":15,"./tags/dialogs/video-dialog.tag":16,"./tags/page-banner.tag":17,"./tags/page-countmein.tag":18,"./tags/page-explore.tag":19,"./tags/page-footer.tag":20,"./tags/page-impact.tag":21,"./tags/page-message.tag":22,"./tags/page-methodology.tag":23,"./tags/page-navbar-menu.tag":24,"./tags/page-navbar.tag":25,"./tags/page-news.tag":26,"./tags/page-testimonials.tag":27,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],3:[function(require,module,exports){
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

},{"firebase":undefined}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('modal-dialog', '<div class="modal fade" id="{ _.kebabCase(data.title) }"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-body"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <section id="modal_dialog_container"> </section> </div> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.id && opts.id != '#') {

        FrontEnd.MetaFire.getData(FrontEnd.site + '/explore/items/' + opts.id).then(function (data) {

            if (data && data.type) {
                var type = data.type;
                console.log(type);

                _this.update();

                opts.event = {};
                opts.event.item = data;

                riot.mount(_this.modal_dialog_container, type + '-dialog', opts);

                $(_this.root.firstChild).modal().on('hidden.bs.modal', function () {
                    _this.unmount(true);
                    FrontEnd.Router.to('explore');
                });
            }
        });
    }
});
});
},{"riot":"riot"}],9:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('infographic-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],10:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('product-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('project-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('publication-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('software-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('speaking-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('training-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('video-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li if="{ title }" each="{ data }" data-transition="fade" data-slotamount="5" data-title="{ title }">  <img if="{ img }" riot-src="{ parent.url + img }" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> <raw content="{ title }"></raw> </div> <div if="{ subtext }" class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> <raw content="{ subtext }"></raw> </div> <div each="{ buttons }"> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut"> <a href="#" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> </li> </ul> </div> </div>', 'id="home"', function(opts) {var _this = this;

this.data = [];
this.mixin('config');
this.url = this.pathImg('site');
this.mounted = false;

this.watchData('/banner', function (data) {
    if (false == _this.mounted) {
        _this.mounted = true;
        _this.data = data;
        _this.update();

        $(_this.tp_banner).revolution({
            stopAtSlide: 1,
            stopAfterLoops: 0,
            startwidth: 1170,
            startheight: 600,
            hideThumbs: 10,
            //fullWidth: "on",
            //forceFullWidth: "on",
            lazyLoad: 'on'
            // navigationStyle: "preview4"
        });
    }
    //else {
    //    this.unmount(true);
    //    riot.mount('page-banner');
    //}
});
});
},{"riot":"riot"}],18:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section class="fun-fact-wrap fun-facts-bg"> <div class="container"> <div class="row"> <div class="col-md-12 facts-in"> <h3> <span class="counter">876,539</span>+ </h3> <h4>Systems Thinkers</h4> <br> <a href="javascript:;" class="btn btn-lg btn-theme-dark">Count Me In</a> </div> </div> </div> </section>', function(opts) {
});
},{"riot":"riot"}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-explore', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <div id="{ id }" onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption" data-title="{ text }" href="{ link || parent.url + type + \'/\' + img }"> <div class="cbp-caption-defaultWrap"> <img if="{ img }" riot-src="{ parent.url + type + \'/\' + img }" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ title }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </div> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="masonry-portfolio-4.html" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', 'id="explore" anchor="explore"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

this.onClick = function (e) {
    riot.route(_.kebabCase(e.item.title), e, _this);
};

FrontEnd.MetaFire.getData(FrontEnd.site + '/explore').then(function (data) {
    _this.filters = _.sortBy(data.filters, 'order');
    _this.header = data.header;
    _this.items = _.map(data.items, function (val, key) {
        val.id = key;
        return val;
    });
    _this.content = _.filter(_this.items, function (item) {
        return !(item.archive === true);
    });
    _this.update();

    $(_this.masonry_container).cubeportfolio({
        filters: '#filters_container',
        layoutMode: 'grid',
        defaultFilter: '.featured',
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
},{"riot":"riot"}],20:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p style="color: #fff;">{ data.about.text }</p> <ul class="list-inline social-1"> <li each="{ data.about.social }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Contact Us</h3> <ul class="list-unstyled contact"> <li each="{ data.contact }"> <p style="color: #fff;"> <strong> <i class="{ icon }"></i> { title }: </strong> { text } </p> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Recent</h3> <ul class="list-inline f2-work"> <li each="{ data.recent }"> <a href="{ link }"> <img riot-src="{ url + img }" class="img-responsive" alt="{ title }"> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Newsletter</h3> <p style="color: #fff;">{ data.newsletter.text }</p> <form role="form" class="subscribe-form"> <div class="input-group"> <input type="text" class="form-control" placeholder="Enter email to subscribe"> <span class="input-group-btn"> <button class="btn btn-lg" type="submit">Ok</button> </span> </div> </form> </div> </div>  </div> <div class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span>&copy;2015 Cabrera Research Lab</span> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();
FrontEnd.MetaFire.getData(FrontEnd.site + '/footer').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],21:[function(require,module,exports){
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
},{"riot":"riot"}],22:[function(require,module,exports){
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
},{"riot":"riot"}],23:[function(require,module,exports){
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
},{"riot":"riot"}],24:[function(require,module,exports){
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
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],25:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#"> <img if="{ data }" height="21px" width="21px" riot-src="{ url }site/{ data.img }" alt="{ data.alt }"> </a> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],26:[function(require,module,exports){
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
},{"riot":"riot"}],27:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvY29yZS9Sb3V0ZXIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvbW9kYWwtZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2RpYWxvZ3MvaW5mb2dyYXBoaWMtZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2RpYWxvZ3MvcHJvZHVjdC1kaWFsb2cudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvZGlhbG9ncy9wcm9qZWN0LWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3B1YmxpY2F0aW9uLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3NvZnR3YXJlLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3NwZWFraW5nLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3RyYWluaW5nLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3ZpZGVvLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWJhbm5lci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWNvdW50bWVpbi50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWV4cGxvcmUudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1mb290ZXIudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1pbXBhY3QudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5hdmJhci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5ld3MudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDL0MsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFekMsSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLEdBQVM7QUFDakIsUUFBTSxLQUFLLEdBQUc7QUFDVixXQUFHLEVBQUU7QUFDRCxvQkFBUSxFQUFFLE9BQU87QUFDakIsY0FBRSxFQUFFLGtCQUFrQjtBQUN0QixzQkFBVSxFQUFFLEVBQUU7QUFDZCxpQkFBSyxFQUFFLHNCQUFzQjtBQUM3QixrQkFBTSxFQUFFLG1DQUFtQztTQUM5QztBQUNELG1CQUFXLEVBQUU7QUFDVCxvQkFBUSxFQUFFLFlB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Q1Ysd0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsQjtTQUNKLENBQUMsQ0FBQztLQUNOO0NBQ0osQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7O0FDM0J4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UnKTtcclxubGV0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAnKTtcclxubGV0IHVzZXJzbmFwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAnKTtcclxubGV0IHJpb3QgPSB3aW5kb3cucmlvdDtcclxubGV0IFJvdXRlciA9IHJlcXVpcmUoJy4vanMvY29yZS9Sb3V0ZXInKTtcclxuXHJcbmNvbnN0IGNvbmZpZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IFNJVEVTID0ge1xyXG4gICAgICAgIENSTDoge1xyXG4gICAgICAgICAgICBmcm9udEVuZDogJ2NybGFiJyxcclxuICAgICAgICAgICAgZGI6ICdwb3BwaW5nLWZpcmUtODk3JyxcclxuICAgICAgICAgICAgbWV0YU1hcFVybDogJycsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnQ2FicmVyYSBSZXNlYXJjaCBMYWInLFxyXG4gICAgICAgICAgICBmYXZpY286ICdmcm9udGVuZC9kaXN0L2ltZy9pY28vZmF2aWNvbi5pY28nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBUSElOS19XQVRFUjoge1xyXG4gICAgICAgICAgICBmcm9udEVuZDogJ3RoaW5rd2F0ZXInLFxyXG4gICAgICAgICAgICBkYjogJ3BvcHBpbmctZmlyZS04OTcnLFxyXG4gICAgICAgICAgICBtZXRhTWFwVXJsOiAnJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdUaGlua1dhdGVyJyxcclxuICAgICAgICAgICAgZmF2aWNvOiAnZnJvbnRlbmQvZGlzdC9pbWcvaWNvL2Zhdmljb24uaWNvJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXQgPSB7XHJcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3QsXHJcbiAgICAgICAgc2l0ZToge31cclxuICAgIH1cclxuICAgIGxldCBzZWdtZW50cyA9IHJldC5ob3N0LnNwbGl0KCcuJyk7XHJcbiAgICBsZXQgZmlyc3QgPSBzZWdtZW50c1swXTtcclxuICAgIGlmIChmaXJzdCA9PT0gJ3d3dycpIHtcclxuICAgICAgICBmaXJzdCA9IHNlZ21lbnRzWzFdO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICBjYXNlICdtZXRhLW1hcC1zdGFnaW5nJzpcclxuICAgIGNhc2UgJ2Zyb250ZW5kJzpcclxuICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydDUkwnXTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ3RoaW5rd2F0ZXItc3RhZ2luZyc6XHJcbiAgICBjYXNlICd0aGlua3dhdGVyJzpcclxuICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydUSElOS19XQVRFUiddO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgICAvL0ZvciBub3csIGRlZmF1bHQgdG8gQ1JMXHJcbiAgICAgICAgcmV0LnNpdGUgPSBTSVRFU1snQ1JMJ107XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmZyZWV6ZShyZXQpO1xyXG4gICAgcmV0dXJuIHJldDtcclxufTtcclxuXHJcbmNsYXNzIEZyb250RW5kIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWdzKSB7XHJcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZygpO1xyXG4gXHJcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmNvbmZpZy5zaXRlLnRpdGxlO1xyXG4gICAgICAgIGxldCBmYXZpY28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmF2aWNvJyk7XHJcbiAgICAgICAgZmF2aWNvLnNldEF0dHJpYnV0ZSgnaHJlZicsIGAvL2M2OGY3OTgxYThiYmU5MjZhMWUwMTU0Y2JmYmQ1YWYxYjRkZjBmMjEuZ29vZ2xlZHJpdmUuY29tL2hvc3QvMEI2R0FONGdYMWJuU2ZsUm5kVFJKZUZaNU5Fc3pTRUZsU3pWS1pEWkpTekZ4ZURkaWNGcG9MWFZ3U0RORlJXTjBSRmhmUzJjLyR7dGhpcy5jb25maWcuc2l0ZS5mcm9udEVuZH0vZmF2aWNvbi5pY29gKTtcclxuXHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IG5ldyBNZXRhRmlyZSh0aGlzLmNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5BdXRoMCA9IG5ldyBBdXRoMCh0aGlzLmNvbmZpZyk7XHJcbiAgICAgICAgdXNlcnNuYXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc2l0ZS5mcm9udEVuZDtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIC8vXy5lYWNoKHRoaXMudGFncywgKHRhZykgPT4ge1xyXG4gICAgICAgIC8vICAgIHJpb3QubW91bnQodGFnLCB0aGlzKTtcclxuICAgICAgICAvL30pO1xyXG4gICAgICAgIHJpb3QubW91bnQoJyonKTtcclxuICAgICAgICB0aGlzLlJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dpbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dvdXQoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGcm9udEVuZDsiLCJyZXF1aXJlKCdiYWJlbC9wb2x5ZmlsbCcpO1xyXG53aW5kb3cucmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxud2luZG93Ll8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxud2luZG93LlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5yZXF1aXJlKCdjb3JlLWpzJyk7XHJcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5yZXF1aXJlKCdqcXVlcnktdWknKTtcclxucmVxdWlyZSgnYm9vdHN0cmFwJyk7XHJcbndpbmRvdy5GaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbndpbmRvdy5IdW1hbml6ZSA9IHJlcXVpcmUoJ2h1bWFuaXplLXBsdXMnKTtcclxud2luZG93Lm1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG53aW5kb3cuVVJJID0gcmVxdWlyZSgnVVJJanMnKTtcclxud2luZG93LmxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKTtcclxuXHJcbmxldCB0YWdzID0gW1xyXG4gICAgJ3BhZ2UtaGVhZCcsXHJcbiAgICAncGFnZS1iYW5uZXInLFxyXG4gICAgJ3BhZ2UtaW1wYWN0JyxcclxuICAgICdwYWdlLWNvdW50bWVpbicsXHJcbiAgICAncGFnZS1mb290ZXInLFxyXG4gICAgJ3BhZ2UtbmF2YmFyLW1lbnUnLFxyXG4gICAgJ3BhZ2UtbmF2YmFyJyxcclxuICAgICdwYWdlLW5ld3MnLFxyXG4gICAgJ3BhZ2UtZXhwbG9yZScsXHJcbiAgICAncGFnZS1tZXNzYWdlJyxcclxuICAgICdwYWdlLW1ldGhvZG9sb2d5JyxcclxuICAgICdwYWdlLXRlc3RpbW9uaWFscydcclxuXTtcclxuXHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL2luZm9ncmFwaGljLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3MvcHJvZHVjdC1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL3Byb2plY3QtZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy9wdWJsaWNhdGlvbi1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL3NvZnR3YXJlLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3Mvc3BlYWtpbmctZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy90cmFpbmluZy1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL3ZpZGVvLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2NvbXBvbmVudHMvbW9kYWwtZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1iYW5uZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWltcGFjdC50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtY291bnRtZWluLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1mb290ZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci1tZW51LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uYXZiYXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5ld3MudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWV4cGxvcmUudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW1lc3NhZ2UudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW1ldGhvZG9sb2d5LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnJyk7XHJcblxyXG52YXIgY29uZmlnTWl4aW4gPSByZXF1aXJlKCcuL2pzL21peGlucy9jb25maWcuanMnKTtcclxucmlvdC5taXhpbignY29uZmlnJywgY29uZmlnTWl4aW4pO1xyXG5cclxucmlvdC50YWcoJ3JhdycsICc8c3Bhbj48L3NwYW4+JywgZnVuY3Rpb24gKG9wdHMpIHtcclxuICAgIHRoaXMudXBkYXRlQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gKG9wdHMpID8gKG9wdHMuY29udGVudCB8fCAnJykgOiAnJztcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbn0pO1xyXG5cclxudmFyIEZyb250RW5kID0gcmVxdWlyZSgnLi9Gcm9udEVuZCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBGcm9udEVuZCh0YWdzKTsiLCJjb25zdCBzdGF0aWNSb3V0ZXMgPSB7XHJcbiAgICAnZm9vdGVyJzogdHJ1ZSxcclxuICAgICdob21lJzogdHJ1ZSxcclxuICAgICdleHBsb3JlJzogdHJ1ZVxyXG59XHJcblxyXG5jbGFzcyBSb3V0ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHJpb3Qucm91dGUuc3RhcnQoKTtcclxuICAgICAgICByaW90LnJvdXRlKCh0YXJnZXQsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcGF0aCA9IHRoaXMuZ2V0UGF0aCh0YXJnZXQpO1xyXG4gICAgICAgICAgICBpZiAoIXN0YXRpY1JvdXRlc1twYXRoXSkge1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudCgnbW9kYWwtZGlhbG9nJywgeyBpZDogcGF0aCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG8od2luZG93LmxvY2F0aW9uLmhhc2ggfHwgJ2hvbWUnKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0UGF0aChwYXRoKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHBhdGguc3RhcnRzV2l0aCgnIycpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aChwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlLmdldFBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRvKHBhdGgpIHtcclxuICAgICAgICBwYXRoID0gcm91dGUuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICByaW90LnJvdXRlKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0byhwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlLnRvKHBhdGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCByb3V0ZSA9IFJvdXRlcjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUm91dGVyOyIsImxldCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJyk7XHJcbmxldCBQcm9taXNlID0gd2luZG93LlByb21pc2U7XHJcbmxldCBsb2NhbGZvcmFnZSA9IHdpbmRvdy5sb2NhbGZvcmFnZTtcclxuXHJcbmNsYXNzIEF1dGgwIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmNhbGxiYWNrVVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgdGhpcy5sb2NrID0gbmV3IEF1dGgwTG9jaygnd3NPbmFydDIzeVZpSVNocVQ0d2ZKMTh3MnZ0MmNsMzInLCAnbWV0YW1hcC5hdXRoMC5jb20nKTtcclxuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgcHJvZmlsZSwgaWRfdG9rZW4sIGN0b2tlbiwgb3B0LCByZWZyZXNoX3Rva2VuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnaWRfdG9rZW4nLCBpZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnByb2ZpbGUgPSBwcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbGlua0FjY291bnQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcclxuICAgICAgICAgICAgY2FsbGJhY2tVUkw6IHRoYXQuY2FsbGJhY2tVUkwsXHJcbiAgICAgICAgICAgIGRpY3Q6IHtcclxuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGluayB3aXRoIGFub3RoZXIgYWNjb3VudCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXV0aFBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGF0LmlkX3Rva2VuIHx8IHRoYXQucHJvZmlsZS5pZGVudGl0aWVzWzBdLmFjY2Vzc190b2tlblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2Vzc2lvbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGdldFByb2ZpbGUgPSAoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhhdC5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIGZ1bmN0aW9uKGVyciwgcHJvZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pZF90b2tlbiA9IGlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlLCBpZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZ1bGZpbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdyZWZyZXNoX3Rva2VuJykudGhlbigodG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVmcmVzaF90b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQubG9jay5nZXRDbGllbnQoKS5yZWZyZXNoVG9rZW4odG9rZW4sIChhLCB0b2tPYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvZmlsZSh0b2tPYmouaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKGlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpO1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3JlZnJlc2hfdG9rZW4nKTtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XHJcbiAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcclxuXHJcblxyXG4iLCJsZXQgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xyXG5sZXQgUHJvbWlzZSA9IHdpbmRvdy5Qcm9taXNlO1xyXG5sZXQgbG9jYWxmb3JhZ2UgPSB3aW5kb3cubG9jYWxmb3JhZ2U7XHJcbmxldCBNZXRhTWFwID0gd2luZG93Lk1ldGFNYXA7XHJcblxyXG5jbGFzcyBNZXRhRmlyZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoYGh0dHBzOi8vJHt0aGlzLmNvbmZpZy5zaXRlLmRifS5maXJlYmFzZWlvLmNvbWApO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgcmV0ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdpZF90b2tlbicpLnRoZW4oKGlkX3Rva2VuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHByb2ZpbGUuY2xpZW50SUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBpZF90b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBkZWxlZ2F0aW9uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZmlyZWJhc2VfdG9rZW4gPSBkZWxlZ2F0aW9uUmVzdWx0LmlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoYXQuZmlyZWJhc2VfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZiLmF1dGhXaXRoQ3VzdG9tVG9rZW4odGhhdC5maXJlYmFzZV90b2tlbiwgKGVycm9yLCBhdXRoRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChhdXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoaWxkKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhIChwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY2hpbGQub24oJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgIChzbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc25hcHNob3QudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBvbiAocGF0aCwgY2FsbGJhY2ssIGV2ZW50ID0gJ3ZhbHVlJyApIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICBjaGlsZC5vbihldmVudCwgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhzbmFwc2hvdC52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhIChkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0ICgpIHtcclxuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiXHJcbnZhciB1c2VyU25hcCA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXkgPSAnMDMyYmFmODctODU0NS00ZWJjLWE1NTctOTM0ODU5MzcxZmE1LmpzJywgcywgeDtcclxuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYXBpS2V5ID0gY29uZmlnLlVTRVJfU05BUF9BUElfS0VZO1xyXG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0ge1xyXG4gICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU25hcC5zZXRFbWFpbEJveChEb2MuYXBwLnVzZXIudXNlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgcy5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xyXG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHJldHVybiB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcclxuXHJcblxyXG4iLCJcclxubGV0IGNvbmZpZyA9IHtcclxuICAgIHBhdGhJbWc6IChmb2xkZXIpID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gYC8vYzY4Zjc5ODFhOGJiZTkyNmExZTAxNTRjYmZiZDVhZjFiNGRmMGYyMS5nb29nbGVkcml2ZS5jb20vaG9zdC8wQjZHQU40Z1gxYm5TZmxSbmRUUkplRlo1TkVzelNFRmxTelZLWkRaSlN6RnhlRGRpY0Zwb0xYVndTRE5GUldOMFJGaGZTMmMvJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vYDtcclxuICAgICAgICBpZiAoZm9sZGVyKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBgJHtmb2xkZXJ9L2A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0YTogKHBhdGgsIGNhbGxiYWNrLCB0aGF0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHdhdGNoRGF0YTogKHBhdGgsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtb2RhbC1kaWFsb2cnLCAnPGRpdiBjbGFzcz1cIm1vZGFsIGZhZGVcIiBpZD1cInsgXy5rZWJhYkNhc2UoZGF0YS50aXRsZSkgfVwiPiA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nIG1vZGFsLWxnXCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPiA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPiA8L2J1dHRvbj4gPHNlY3Rpb24gaWQ9XCJtb2RhbF9kaWFsb2dfY29udGFpbmVyXCI+IDwvc2VjdGlvbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuaWQgJiYgb3B0cy5pZCAhPSAnIycpIHtcblxuICAgICAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2V4cGxvcmUvaXRlbXMvJyArIG9wdHMuaWQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS50eXBlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBkYXRhLnR5cGU7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codHlwZSk7XG5cbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIG9wdHMuZXZlbnQgPSB7fTtcbiAgICAgICAgICAgICAgICBvcHRzLmV2ZW50Lml0ZW0gPSBkYXRhO1xuXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudChfdGhpcy5tb2RhbF9kaWFsb2dfY29udGFpbmVyLCB0eXBlICsgJy1kaWFsb2cnLCBvcHRzKTtcblxuICAgICAgICAgICAgICAgICQoX3RoaXMucm9vdC5maXJzdENoaWxkKS5tb2RhbCgpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnVubW91bnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIEZyb250RW5kLlJvdXRlci50bygnZXhwbG9yZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnaW5mb2dyYXBoaWMtZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Byb2R1Y3QtZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Byb2plY3QtZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3B1YmxpY2F0aW9uLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdzb2Z0d2FyZS1kaWFsb2cnLCAnPGRpdiBpZj1cIm9wdHNcIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8YSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YS5idXR0b25zIH1cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS1saW5rPVwieyB2YWwubGluayB9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cykge1xuICAgICAgICBfdGhpcy5kYXRhID0gb3B0cy5ldmVudC5pdGVtO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc3BlYWtpbmctZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3RyYWluaW5nLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCd2aWRlby1kaWFsb2cnLCAnPGRpdiBpZj1cIm9wdHNcIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8YSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YS5idXR0b25zIH1cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS1saW5rPVwieyB2YWwubGluayB9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cykge1xuICAgICAgICBfdGhpcy5kYXRhID0gb3B0cy5ldmVudC5pdGVtO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1iYW5uZXInLCAnPGRpdiBjbGFzcz1cImZ1bGx3aWR0aGJhbm5lclwiPiA8ZGl2IGlkPVwidHBfYmFubmVyXCIgY2xhc3M9XCJ0cC1iYW5uZXJcIj4gPHVsPiAgPGxpIGlmPVwieyB0aXRsZSB9XCIgZWFjaD1cInsgZGF0YSB9XCIgZGF0YS10cmFuc2l0aW9uPVwiZmFkZVwiIGRhdGEtc2xvdGFtb3VudD1cIjVcIiBkYXRhLXRpdGxlPVwieyB0aXRsZSB9XCI+ICA8aW1nIGlmPVwieyBpbWcgfVwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nIH1cIiBhbHQ9XCJkYXJrYmx1cmJnXCIgZGF0YS1iZ2ZpdD1cImNvdmVyXCIgZGF0YS1iZ3Bvc2l0aW9uPVwibGVmdCB0b3BcIiBkYXRhLWJncmVwZWF0PVwibm8tcmVwZWF0XCI+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHRpdGxlLTIgc2Z0XCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIxMDBcIiBkYXRhLXNwZWVkPVwiMTAwMFwiIGRhdGEtc3RhcnQ9XCIxMDAwXCIgZGF0YS1lYXNpbmc9XCJlYXNlT3V0RXhwb1wiPiA8cmF3IGNvbnRlbnQ9XCJ7IHRpdGxlIH1cIj48L3Jhdz4gPC9kaXY+IDxkaXYgaWY9XCJ7IHN1YnRleHQgfVwiIGNsYXNzPVwiY2FwdGlvbiB0ZXh0IHNmbFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMjIwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gPHJhdyBjb250ZW50PVwieyBzdWJ0ZXh0IH1cIj48L3Jhdz4gPC9kaXY+IDxkaXYgZWFjaD1cInsgYnV0dG9ucyB9XCI+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHNmYiByZXYtYnV0dG9ucyB0cC1yZXNpemVtZVwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMzU1XCIgZGF0YS1zcGVlZD1cIjUwMFwiIGRhdGEtc3RhcnQ9XCIxODAwXCIgZGF0YS1lYXNpbmc9XCJTaW5lLmVhc2VPdXRcIj4gPGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIj57IHRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PicsICdpZD1cImhvbWVcIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBbXTtcbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3NpdGUnKTtcbnRoaXMubW91bnRlZCA9IGZhbHNlO1xuXG50aGlzLndhdGNoRGF0YSgnL2Jhbm5lcicsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGZhbHNlID09IF90aGlzLm1vdW50ZWQpIHtcbiAgICAgICAgX3RoaXMubW91bnRlZCA9IHRydWU7XG4gICAgICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKF90aGlzLnRwX2Jhbm5lcikucmV2b2x1dGlvbih7XG4gICAgICAgICAgICBzdG9wQXRTbGlkZTogMSxcbiAgICAgICAgICAgIHN0b3BBZnRlckxvb3BzOiAwLFxuICAgICAgICAgICAgc3RhcnR3aWR0aDogMTE3MCxcbiAgICAgICAgICAgIHN0YXJ0aGVpZ2h0OiA2MDAsXG4gICAgICAgICAgICBoaWRlVGh1bWJzOiAxMCxcbiAgICAgICAgICAgIC8vZnVsbFdpZHRoOiBcIm9uXCIsXG4gICAgICAgICAgICAvL2ZvcmNlRnVsbFdpZHRoOiBcIm9uXCIsXG4gICAgICAgICAgICBsYXp5TG9hZDogJ29uJ1xuICAgICAgICAgICAgLy8gbmF2aWdhdGlvblN0eWxlOiBcInByZXZpZXc0XCJcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vZWxzZSB7XG4gICAgLy8gICAgdGhpcy51bm1vdW50KHRydWUpO1xuICAgIC8vICAgIHJpb3QubW91bnQoJ3BhZ2UtYmFubmVyJyk7XG4gICAgLy99XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb3VudG1laW4nLCAnPHNlY3Rpb24gY2xhc3M9XCJmdW4tZmFjdC13cmFwIGZ1bi1mYWN0cy1iZ1wiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiBmYWN0cy1pblwiPiA8aDM+IDxzcGFuIGNsYXNzPVwiY291bnRlclwiPjg3Niw1Mzk8L3NwYW4+KyA8L2gzPiA8aDQ+U3lzdGVtcyBUaGlua2VyczwvaDQ+IDxicj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPkNvdW50IE1lIEluPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgZnVuY3Rpb24ob3B0cykge1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWV4cGxvcmUnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj4gPHN0cm9uZz57IGhlYWRlci50aXRsZSB9PC9zdHJvbmc+IDwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJjdWJlLW1hc29ucnlcIj4gPGRpdiBpZD1cImZpbHRlcnNfY29udGFpbmVyXCIgY2xhc3M9XCJjYnAtbC1maWx0ZXJzLWFsaWduQ2VudGVyXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIGZpbHRlcnMgfVwiIGRhdGEtZmlsdGVyPVwiLnsgdmFsLnRhZyB9XCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW0geyBcXCdjYnAtZmlsdGVyLWl0ZW0tYWN0aXZlXFwnOiBpID09IDAgfVwiPiB7IHZhbC5uYW1lIH0gPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9XCJtYXNvbnJ5X2NvbnRhaW5lclwiIGNsYXNzPVwiY2JwXCI+IDxkaXYgaWQ9XCJ7IGlkIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCIgZWFjaD1cInsgY29udGVudCB9XCIgY2xhc3M9XCJjYnAtaXRlbSB7IHR5cGUgfSB7IF8ua2V5cyh0YWdzKS5qb2luKFxcJyBcXCcpIH1cIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uXCIgZGF0YS10aXRsZT1cInsgdGV4dCB9XCIgaHJlZj1cInsgbGluayB8fCBwYXJlbnQudXJsICsgdHlwZSArIFxcJy9cXCcgKyBpbWcgfVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBpZj1cInsgaW1nIH1cIiByaW90LXNyYz1cInsgcGFyZW50LnVybCArIHR5cGUgKyBcXCcvXFwnICsgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBpZj1cInsgdGl0bGUgfVwiIGNsYXNzPVwieyBcXCdjYnAtbC1jYXB0aW9uLXRpdGxlXFwnOiB0cnVlIH1cIiA+eyB0aXRsZSB9PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cIm1hc29ucnktcG9ydGZvbGlvLTQuaHRtbFwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPkV4cGxvcmUgQWxsPC9hPiA8L2Rpdj4nLCAnaWQ9XCJleHBsb3JlXCIgYW5jaG9yPVwiZXhwbG9yZVwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxudGhpcy5vbkNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICByaW90LnJvdXRlKF8ua2ViYWJDYXNlKGUuaXRlbS50aXRsZSksIGUsIF90aGlzKTtcbn07XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZXhwbG9yZScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5maWx0ZXJzID0gXy5zb3J0QnkoZGF0YS5maWx0ZXJzLCAnb3JkZXInKTtcbiAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICBfdGhpcy5pdGVtcyA9IF8ubWFwKGRhdGEuaXRlbXMsIGZ1bmN0aW9uICh2YWwsIGtleSkge1xuICAgICAgICB2YWwuaWQgPSBrZXk7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfSk7XG4gICAgX3RoaXMuY29udGVudCA9IF8uZmlsdGVyKF90aGlzLml0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4gIShpdGVtLmFyY2hpdmUgPT09IHRydWUpO1xuICAgIH0pO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgJChfdGhpcy5tYXNvbnJ5X2NvbnRhaW5lcikuY3ViZXBvcnRmb2xpbyh7XG4gICAgICAgIGZpbHRlcnM6ICcjZmlsdGVyc19jb250YWluZXInLFxuICAgICAgICBsYXlvdXRNb2RlOiAnZ3JpZCcsXG4gICAgICAgIGRlZmF1bHRGaWx0ZXI6ICcuZmVhdHVyZWQnLFxuICAgICAgICBhbmltYXRpb25UeXBlOiAnZmxpcE91dERlbGF5JyxcbiAgICAgICAgZ2FwSG9yaXpvbnRhbDogMjAsXG4gICAgICAgIGdhcFZlcnRpY2FsOiAyMCxcbiAgICAgICAgZ3JpZEFkanVzdG1lbnQ6ICdyZXNwb25zaXZlJyxcbiAgICAgICAgbWVkaWFRdWVyaWVzOiBbe1xuICAgICAgICAgICAgd2lkdGg6IDExMDAsXG4gICAgICAgICAgICBjb2xzOiA0XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgICAgICBjb2xzOiAzXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICBjb2xzOiAyXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHdpZHRoOiAzMjAsXG4gICAgICAgICAgICBjb2xzOiAxXG4gICAgICAgIH1dLFxuICAgICAgICBjYXB0aW9uOiAnb3ZlcmxheUJvdHRvbUFsb25nJyxcbiAgICAgICAgZGlzcGxheVR5cGU6ICdib3R0b21Ub1RvcCcsXG4gICAgICAgIGRpc3BsYXlUeXBlU3BlZWQ6IDEwMFxuICAgIH0pO1xufSk7XG4vL3Jpb3QubW91bnQoJ21vZGFsLWRpYWxvZycsIHsgZXZlbnQ6IGUsIHRhZzogdGhpcyB9KVxufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsICc8Zm9vdGVyIGlkPVwiZm9vdGVyXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPnsgZGF0YS5hYm91dC50aXRsZSB9PC9oMz4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj57IGRhdGEuYWJvdXQudGV4dCB9PC9wPiA8dWwgY2xhc3M9XCJsaXN0LWlubGluZSBzb2NpYWwtMVwiPiA8bGkgZWFjaD1cInsgZGF0YS5hYm91dC5zb2NpYWwgfVwiPiA8YSBocmVmPVwieyBsaW5rIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPkNvbnRhY3QgVXM8L2gzPiA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIGNvbnRhY3RcIj4gPGxpIGVhY2g9XCJ7IGRhdGEuY29udGFjdCB9XCI+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+IDxzdHJvbmc+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfTogPC9zdHJvbmc+IHsgdGV4dCB9IDwvcD4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5SZWNlbnQ8L2gzPiA8dWwgY2xhc3M9XCJsaXN0LWlubGluZSBmMi13b3JrXCI+IDxsaSBlYWNoPVwieyBkYXRhLnJlY2VudCB9XCI+IDxhIGhyZWY9XCJ7IGxpbmsgfVwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgKyBpbWcgfVwiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPk5ld3NsZXR0ZXI8L2gzPiA8cCBzdHlsZT1cImNvbG9yOiAjZmZmO1wiPnsgZGF0YS5uZXdzbGV0dGVyLnRleHQgfTwvcD4gPGZvcm0gcm9sZT1cImZvcm1cIiBjbGFzcz1cInN1YnNjcmliZS1mb3JtXCI+IDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgZW1haWwgdG8gc3Vic2NyaWJlXCI+IDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+IDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWxnXCIgdHlwZT1cInN1Ym1pdFwiPk9rPC9idXR0b24+IDwvc3Bhbj4gPC9kaXY+IDwvZm9ybT4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWJ0bVwiPiA8c3Bhbj4mY29weTsyMDE1IENhYnJlcmEgUmVzZWFyY2ggTGFiPC9zcGFuPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9mb290ZXI+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZm9vdGVyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtaW1wYWN0JywgJzxzZWN0aW9uPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyIGlmPVwieyBoZWFkZXIgfVwiPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cCBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImxlYWRcIj4geyBoZWFkZXIudGV4dCB9IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cImltcGFjdF9zbGlkZXJcIiBjbGFzcz1cIm93bC1jYXJvdXNlbFwiPiA8ZGl2IGNsYXNzPVwiaXRlbVwiIGVhY2g9XCJ7IGl0ZW1zIH1cIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aW1nIGlmPVwieyBpbWcgfVwiIHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIxMjVweFwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsIH1pbXBhY3QveyBpbWcgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2ltcGFjdCcpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy5pbXBhY3Rfc2xpZGVyKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6IDMwMDAsXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpdGVtc0Rlc2t0b3A6IFsxMTk5LCA0XSxcbiAgICAgICAgICAgICAgICBpdGVtc0Rlc2t0b3BTbWFsbDogWzk5MSwgMl1cbiAgICAgICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZXNzYWdlJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD48cmF3IGNvbnRlbnQ9XCJ7IGhlYWRlci50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93IHNwZWNpYWwtZmVhdHVyZVwiPiA8ZGl2IGVhY2g9XCJ7IGl0ZW1zIH1cIiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS00IG1hcmdpbjEwXCI+IDxkaXYgY2xhc3M9XCJzLWZlYXR1cmUtYm94IHRleHQtY2VudGVyIHdvdyBhbmltYXRlZCBmYWRlSW5cIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIyMDBtc1wiPiA8ZGl2IGNsYXNzPVwibWFzay10b3BcIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gPC9kaXY+IDxkaXYgY2xhc3M9XCJtYXNrLWJvdHRvbVwiPiAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gIDxoND57IHRpdGxlIH08L2g0PiAgPHA+eyB0ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5oZWFkZXIgPSB7fTtcbnRoaXMuaXRlbXMgPSBbXTtcbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbWVzc2FnZScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICBfdGhpcy5pdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgX3RoaXMudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZXRob2RvbG9neScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cCBjbGFzcz1cImxlYWRcIj57IGhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGg0PnsgZnJhbWV3b3Jrcy5oZWFkZXIudGl0bGUgfTwvaDQ+IDxwIGNsYXNzPVwibGVhZFwiPnsgZnJhbWV3b3Jrcy5oZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInBhbmVsLWdyb3VwXCIgaWQ9XCJmcmFtZXdvcmtzXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIGZyYW1ld29ya3MuaXRlbXMgfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiA8aDQgY2xhc3M9XCJwYW5lbC10aXRsZVwiPiA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS1wYXJlbnQ9XCIjZnJhbWV3b3Jrc1wiIGhyZWY9XCIjY29sbGFwc2VGcmFtZXdvcmtzX3sgaSB9XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2g0PiA8L2Rpdj4gPGRpdiBpZD1cImNvbGxhcHNlRnJhbWV3b3Jrc197IGkgfVwiIGNsYXNzPVwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgeyBpbjogaSA9PSAwIH1cIj4gPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4geyB2YWwudGV4dCB9IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGg0PnsgcGFydG5lcnMuaGVhZGVyLnRpdGxlIH08L2g0PiA8cCBjbGFzcz1cImxlYWRcIj57IHBhcnRuZXJzLmhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicGFuZWwtZ3JvdXBcIiBpZD1cImFjY29yZGlvblwiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBwYXJ0bmVycy5pdGVtcyB9XCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+IDxoNCBjbGFzcz1cInBhbmVsLXRpdGxlXCI+IDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXBhcmVudD1cIiNhY2NvcmRpb25cIiBocmVmPVwiI2NvbGxhcHNlT25lX3sgaSB9XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2g0PiA8L2Rpdj4gPGRpdiBpZD1cImNvbGxhcHNlT25lX3sgaSB9XCIgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZSB7IGluOiBpID09IDAgfVwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPiB7IHZhbC50ZXh0IH0gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9tZXRob2RvbG9neScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLmZyYW1ld29ya3MgPSBkYXRhLmZyYW1ld29ya3M7XG4gICAgICAgIF90aGlzLnBhcnRuZXJzID0gZGF0YS5wYXJ0bmVycztcblxuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1lbnUtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIj4gPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+IDxsaSBjbGFzcz1cInsgZHJvcGRvd246IHRydWUsIGFjdGl2ZTogaSA9PSAwIH1cIiBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YSB9XCI+IDxhIGlmPVwieyB2YWwudGl0bGUgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIiBocmVmPVwieyB2YWwubGluayB8fCBcXCcjXFwnIH1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj4gPGkgaWY9XCJ7IHZhbC5pY29uIH1cIiBjbGFzcz1cInsgdmFsLmljb24gfVwiID48L2k+IHsgdmFsLnRpdGxlIH0gPGkgaWY9XCJ7IHZhbC5tZW51ICYmIHZhbC5tZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCIgPjwvaT4gPC9hPiA8dWwgaWY9XCJ7IHZhbC5tZW51ICYmIHZhbC5tZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJkcm9wZG93bi1tZW51IG11bHRpLWxldmVsXCIgcm9sZT1cIm1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJkcm9wZG93bk1lbnVcIj4gPGxpIGVhY2g9XCJ7IHZhbC5tZW51IH1cIiA+IDxhIG9uY2xpY2s9XCJwYXJlbnQub25jbGlja1wiIGhyZWY9XCJ7IGxpbmsgfHwgXFwnI1xcJyB9XCI+IDxpIGlmPVwieyBpY29uIH1cIiBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPiA8L2E+IDwvbGk+IDwvdWw+IDwvbGk+IDwvdWw+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBbXTtcblxudGhpcy5vbkNsaWNrID0gZnVuY3Rpb24gKGUsIHRhZykge1xuICAgIGlmIChlLml0ZW0gJiYgZS5pdGVtLnZhbC5saW5rKSB7XG4gICAgICAgIEZyb250RW5kLlJvdXRlci50byhlLml0ZW0udmFsLmxpbmspO1xuICAgIH0gZWxzZSBpZiAoZS5pdGVtICYmIGUuaXRlbS52YWwuYWN0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUuaXRlbS52YWwuYWN0aW9uKTtcbiAgICB9XG59O1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL25hdmJhcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5hdmJhcicsICc8ZGl2IGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1zdGF0aWMtdG9wIHlhbW0gc3RpY2t5XCIgcm9sZT1cIm5hdmlnYXRpb25cIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwibmF2YmFyLWhlYWRlclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5hdmJhci10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+IDxzcGFuIGNsYXNzPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8L2J1dHRvbj4gPGEgY2xhc3M9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiI1wiPiA8aW1nIGlmPVwieyBkYXRhIH1cIiBoZWlnaHQ9XCIyMXB4XCIgd2lkdGg9XCIyMXB4XCIgcmlvdC1zcmM9XCJ7IHVybCB9c2l0ZS97IGRhdGEuaW1nIH1cIiBhbHQ9XCJ7IGRhdGEuYWx0IH1cIj4gPC9hPiA8L2Rpdj4gPHBhZ2UtbWVudS1uYXZiYXI+PC9wYWdlLW1lbnUtbmF2YmFyPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9sb2dvJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmV3cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8aDMgY2xhc3M9XCJoZWFkaW5nXCI+TGF0ZXN0IE5ld3M8L2gzPiA8ZGl2IGlkPVwibmV3c19jYXJvdXNlbFwiIGNsYXNzPVwib3dsLWNhcm91c2VsIG93bC1zcGFjZWRcIj4gPGRpdiBlYWNoPVwieyBkYXRhIH1cIj4gICA8ZGl2IGNsYXNzPVwibmV3cy1kZXNjXCI+IDxoNT4gPGEgaHJlZj1cInsgYnkgPyBsaW5rIDogXFwnamF2YXNjcmlwdDo7XFwnIH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj57IEh1bWFuaXplLnRydW5jYXRlKHRpdGxlLCAxMjUpIH08L2E+IDwvaDU+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL25ld3MnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBfLnRvQXJyYXkoZGF0YSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAkKF90aGlzLm5ld3NfY2Fyb3VzZWwpLm93bENhcm91c2VsKHtcbiAgICAgICAgICAgICAgICAvLyBNb3N0IGltcG9ydGFudCBvd2wgZmVhdHVyZXNcbiAgICAgICAgICAgICAgICBpdGVtczogNCxcbiAgICAgICAgICAgICAgICBpdGVtc0N1c3RvbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5ODAsIDJdLFxuICAgICAgICAgICAgICAgIGl0ZW1zVGFibGV0OiBbNzY4LCAyXSxcbiAgICAgICAgICAgICAgICBpdGVtc1RhYmxldFNtYWxsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtc01vYmlsZTogWzQ3OSwgMV0sXG4gICAgICAgICAgICAgICAgc2luZ2xlSXRlbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3RhcnREcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogNDAwMFxuICAgICAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRlc3RpbW9uaWFscycsICc8ZGl2IGlkPVwidGVzdGltb25pYWxzLWNhcm91c2VsXCIgY2xhc3M9XCJ0ZXN0aW1vbmlhbHMgdGVzdGltb25pYWxzLXYtMiB3b3cgYW5pbWF0ZWQgZmFkZUluVXBcIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIxMDBtc1wiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD57IGhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBpZD1cInRlc3RpbW9uaWFsX3NsaWRlXCIgY2xhc3M9XCJ0ZXN0aS1zbGlkZVwiPiA8dWwgY2xhc3M9XCJzbGlkZXNcIj4gPGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj4gPGltZyByaW90LXNyYz1cInsgcGFyZW50LnVybCArIGltZyB9XCIgYWx0PVwieyB1c2VyIH1cIj4gPGg0PiA8aSBjbGFzcz1cImZhIGZhLXF1b3RlLWxlZnQgaW9uLXF1b3RlXCI+PC9pPiB7IHRleHR9IDwvaDQ+IDxwIGNsYXNzPVwidGVzdC1hdXRob3JcIj4geyB1c2VyIH0gLSA8ZW0+eyBzdWJ0ZXh0IH08L2VtPiA8L3A+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3Rlc3RpbW9uaWFscycpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3Rlc3RpbW9uaWFscycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy50ZXN0aW1vbmlhbF9zbGlkZSkuZmxleHNsaWRlcih7XG4gICAgICAgICAgICAgICAgc2xpZGVzaG93U3BlZWQ6IDUwMDAsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uTmF2OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdmYWRlJ1xuICAgICAgICB9KTtcbn0pO1xufSk7Il19
