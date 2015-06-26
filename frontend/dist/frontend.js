(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FrontEnd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');
var riot = window.riot;

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
            riot.route.start();
            riot.route(function (target) {
                for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    params[_key - 1] = arguments[_key];
                }

                riot.mount('modal-dialog', { id: target });
            });
            var hash = window.location.hash;
            if (hash) {
                if (hash.startsWith('#')) {
                    hash = hash.substr(1);
                }
                _.delay(function () {
                    riot.route(hash);
                }, 250);
            }
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

},{"./js/integrations/auth0":3,"./js/integrations/firebase":4,"./js/integrations/usersnap":5}],2:[function(require,module,exports){
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

},{"./FrontEnd":1,"./js/mixins/config.js":6,"./tags/components/modal-dialog.tag":7,"./tags/dialogs/infographic-dialog.tag":8,"./tags/dialogs/product-dialog.tag":9,"./tags/dialogs/project-dialog.tag":10,"./tags/dialogs/publication-dialog.tag":11,"./tags/dialogs/software-dialog.tag":12,"./tags/dialogs/speaking-dialog.tag":13,"./tags/dialogs/training-dialog.tag":14,"./tags/dialogs/video-dialog.tag":15,"./tags/page-banner.tag":16,"./tags/page-countmein.tag":17,"./tags/page-explore.tag":18,"./tags/page-footer.tag":19,"./tags/page-impact.tag":20,"./tags/page-message.tag":21,"./tags/page-methodology.tag":22,"./tags/page-navbar-menu.tag":23,"./tags/page-navbar.tag":24,"./tags/page-news.tag":25,"./tags/page-testimonials.tag":26,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],3:[function(require,module,exports){
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

},{"auth0-lock":undefined}],4:[function(require,module,exports){
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

},{"firebase":undefined}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('modal-dialog', '<div class="modal fade" id="{ _.kebabCase(data.title) }"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-body"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <section id="modal_dialog_container"> </section> </div> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.id) {

        FrontEnd.MetaFire.getData(FrontEnd.site + '/explore/items/' + opts.id).then(function (data) {

            var type = data.type;
            console.log(type);

            _this.update();

            opts.event = {};
            opts.event.item = data;

            riot.mount(_this.modal_dialog_container, type + '-dialog', opts);

            $(_this.root.firstChild).modal().on('hidden.bs.modal', function () {
                _this.unmount(true);
                riot.route('#');
            });
        });
    }
});
});
},{"riot":"riot"}],8:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('infographic-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],9:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('product-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],10:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('project-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('publication-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('software-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('speaking-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('training-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('video-dialog', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <a each="{ val, i in data.buttons }" role="button" data-link="{ val.link }" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { val.title } </a> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        _this.data = opts.event.item;
        _this.update();
    }
});
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li if="{ title }" each="{ data }" data-transition="fade" data-slotamount="5" data-title="{ title }">  <img if="{ img }" riot-src="{ parent.url + img }" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> <raw content="{ title }"></raw> </div> <div if="{ subtext }" class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> <raw content="{ subtext }"></raw> </div> <div each="{ buttons }"> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut"> <a href="#" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> </li> </ul> </div> </div>', 'id="banner"', function(opts) {var _this = this;

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
},{"riot":"riot"}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section class="fun-fact-wrap fun-facts-bg"> <div class="container"> <div class="row"> <div class="col-md-12 facts-in"> <h3> <span class="counter">876,539</span>+ </h3> <h4>Systems Thinkers</h4> <br> <a href="javascript:;" class="btn btn-lg btn-theme-dark">Count Me In</a> </div> </div> </div> </section>', function(opts) {
});
},{"riot":"riot"}],18:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-explore', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <div id="{ id }" onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption" data-title="{ text }" href="{ link || parent.url + type + \'/\' + img }"> <div class="cbp-caption-defaultWrap"> <img if="{ img }" riot-src="{ parent.url + type + \'/\' + img }" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ title }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </div> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="masonry-portfolio-4.html" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', function(opts) {var _this = this;

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
},{"riot":"riot"}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p style="color: #fff;">{ data.about.text }</p> <ul class="list-inline social-1"> <li each="{ data.about.social }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Contact Us</h3> <ul class="list-unstyled contact"> <li each="{ data.contact }"> <p style="color: #fff;"> <strong> <i class="{ icon }"></i> { title }: </strong> { text } </p> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Recent</h3> <ul class="list-inline f2-work"> <li each="{ data.recent }"> <a href="{ link }"> <img riot-src="{ url + img }" class="img-responsive" alt="{ title }"> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Newsletter</h3> <p style="color: #fff;">{ data.newsletter.text }</p> <form role="form" class="subscribe-form"> <div class="input-group"> <input type="text" class="form-control" placeholder="Enter email to subscribe"> <span class="input-group-btn"> <button class="btn btn-lg" type="submit">Ok</button> </span> </div> </form> </div> </div>  </div> <div class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span>&copy;2015 Cabrera Research Lab</span> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();
FrontEnd.MetaFire.getData(FrontEnd.site + '/footer').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],20:[function(require,module,exports){
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
},{"riot":"riot"}],21:[function(require,module,exports){
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
},{"riot":"riot"}],22:[function(require,module,exports){
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
},{"riot":"riot"}],23:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-menu-navbar', '<div class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }"> <a if="{ val.title }" href="#" class="dropdown-toggle" data-toggle="dropdown"> <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i> </a> <ul if="{ val.menu && val.menu.length }" class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu"> <li each="{ val.menu }" > <a href="#"> <i if="{ icon }" class="{ icon }"></i> <span class="title">{ title }</span> </a> </li> </ul> </li> </ul> </div>', function(opts) {
var that = this;
that.data = [];
FrontEnd.MetaFire.getData(FrontEnd.site + '/navbar').then(function (data) {
    that.data = data;
    that.update();
});
});
},{"riot":"riot"}],24:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#"> <img if="{ data }" height="21px" width="21px" riot-src="{ url }site/{ data.img }" alt="{ data.alt }"> </a> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],25:[function(require,module,exports){
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
},{"riot":"riot"}],26:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvbW9kYWwtZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2RpYWxvZ3MvaW5mb2dyYXBoaWMtZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2RpYWxvZ3MvcHJvZHVjdC1kaWFsb2cudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvZGlhbG9ncy9wcm9qZWN0LWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3B1YmxpY2F0aW9uLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3NvZnR3YXJlLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3NwZWFraW5nLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3RyYWluaW5nLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3ZpZGVvLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWJhbm5lci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWNvdW50bWVpbi50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWV4cGxvcmUudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1mb290ZXIudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1pbXBhY3QudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5hdmJhci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5ld3MudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDL0MsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7QUFFdkIsSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLEdBQVM7QUFDakIsUUFBTSxLQUFLLEdBQUc7QUFDVixXQUFHLEVBQUU7QUFDRCxvQkFBUSxFQUFFLE9BQU87QUFDakIsY0FBRSxFQUFFLGtCQUFrQjtBQUN0QixzQkFBVSxFQUFFLEVBQUU7QUFDZCxpQkFBSyxFQUFFLHNCQUFzQjtBQUM3QixrQkFBTSxFQUFFLG1DQUFtQztTQUM5QztBQUNELG1CQUFXLEVBQUU7QUFDVCxvQkFBUSxFQUFFLFlBQVk7QUFDdEIsY0FBRSxFQUFFLGtCQUFrQjtBQUN0QixzQkFBVSxFQUFFLEVBQUU7QUFDZCxpQkFBSyxFQUFFLFlBQVk7QUFDbkIsa0JBQU0sRUFBRSxtQ0FBbUM7U0FDOUM7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UnKTtcclxubGV0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAnKTtcclxubGV0IHVzZXJzbmFwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAnKTtcclxubGV0IHJpb3QgPSB3aW5kb3cucmlvdDtcclxuXHJcbmNvbnN0IGNvbmZpZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IFNJVEVTID0ge1xyXG4gICAgICAgIENSTDoge1xyXG4gICAgICAgICAgICBmcm9udEVuZDogJ2NybGFiJyxcclxuICAgICAgICAgICAgZGI6ICdwb3BwaW5nLWZpcmUtODk3JyxcclxuICAgICAgICAgICAgbWV0YU1hcFVybDogJycsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnQ2FicmVyYSBSZXNlYXJjaCBMYWInLFxyXG4gICAgICAgICAgICBmYXZpY286ICdmcm9udGVuZC9kaXN0L2ltZy9pY28vZmF2aWNvbi5pY28nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBUSElOS19XQVRFUjoge1xyXG4gICAgICAgICAgICBmcm9udEVuZDogJ3RoaW5rd2F0ZXInLFxyXG4gICAgICAgICAgICBkYjogJ3BvcHBpbmctZmlyZS04OTcnLFxyXG4gICAgICAgICAgICBtZXRhTWFwVXJsOiAnJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdUaGlua1dhdGVyJyxcclxuICAgICAgICAgICAgZmF2aWNvOiAnZnJvbnRlbmQvZGlzdC9pbWcvaWNvL2Zhdmljb24uaWNvJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXQgPSB7XHJcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3QsXHJcbiAgICAgICAgc2l0ZToge31cclxuICAgIH1cclxuICAgIGxldCBzZWdtZW50cyA9IHJldC5ob3N0LnNwbGl0KCcuJyk7XHJcbiAgICBsZXQgZmlyc3QgPSBzZWdtZW50c1swXTtcclxuICAgIGlmIChmaXJzdCA9PT0gJ3d3dycpIHtcclxuICAgICAgICBmaXJzdCA9IHNlZ21lbnRzWzFdO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICBjYXNlICdtZXRhLW1hcC1zdGFnaW5nJzpcclxuICAgIGNhc2UgJ2Zyb250ZW5kJzpcclxuICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydDUkwnXTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ3RoaW5rd2F0ZXItc3RhZ2luZyc6XHJcbiAgICBjYXNlICd0aGlua3dhdGVyJzpcclxuICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydUSElOS19XQVRFUiddO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgICAvL0ZvciBub3csIGRlZmF1bHQgdG8gQ1JMXHJcbiAgICAgICAgcmV0LnNpdGUgPSBTSVRFU1snQ1JMJ107XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmZyZWV6ZShyZXQpO1xyXG4gICAgcmV0dXJuIHJldDtcclxufTtcclxuXHJcbmNsYXNzIEZyb250RW5kIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWdzKSB7XHJcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5jb25maWcuc2l0ZS50aXRsZTtcclxuICAgICAgICBsZXQgZmF2aWNvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdmljbycpO1xyXG4gICAgICAgIGZhdmljby5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgLy9jNjhmNzk4MWE4YmJlOTI2YTFlMDE1NGNiZmJkNWFmMWI0ZGYwZjIxLmdvb2dsZWRyaXZlLmNvbS9ob3N0LzBCNkdBTjRnWDFiblNmbFJuZFRSSmVGWjVORXN6U0VGbFN6VktaRFpKU3pGeGVEZGljRnBvTFhWd1NETkZSV04wUkZoZlMyYy8ke3RoaXMuY29uZmlnLnNpdGUuZnJvbnRFbmR9L2Zhdmljb24uaWNvYCk7XHJcblxyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHVzZXJzbmFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnNpdGUuZnJvbnRFbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICAvL18uZWFjaCh0aGlzLnRhZ3MsICh0YWcpID0+IHtcclxuICAgICAgICAvLyAgICByaW90Lm1vdW50KHRhZywgdGhpcyk7XHJcbiAgICAgICAgLy99KTtcclxuICAgICAgICByaW90Lm1vdW50KCcqJyk7XHJcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xyXG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIHJpb3QubW91bnQoJ21vZGFsLWRpYWxvZycsIHsgaWQ6IHRhcmdldCB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xyXG4gICAgICAgIGlmIChoYXNoKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXNoLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgaGFzaCA9IGhhc2guc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmlvdC5yb3V0ZShoYXNoKTtcclxuICAgICAgICAgICAgfSwgMjUwKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dvdXQoKTtcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ291dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZyb250RW5kOyIsInJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XHJcbndpbmRvdy5yaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG53aW5kb3cuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG53aW5kb3cuUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMnKTtcclxud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbnJlcXVpcmUoJ2pxdWVyeS11aScpO1xyXG5yZXF1aXJlKCdib290c3RyYXAnKTtcclxud2luZG93LkZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKTtcclxud2luZG93Lkh1bWFuaXplID0gcmVxdWlyZSgnaHVtYW5pemUtcGx1cycpO1xyXG53aW5kb3cubW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbndpbmRvdy5VUkkgPSByZXF1aXJlKCdVUklqcycpO1xyXG53aW5kb3cubG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpO1xyXG5cclxubGV0IHRhZ3MgPSBbXHJcbiAgICAncGFnZS1oZWFkJyxcclxuICAgICdwYWdlLWJhbm5lcicsXHJcbiAgICAncGFnZS1pbXBhY3QnLFxyXG4gICAgJ3BhZ2UtY291bnRtZWluJyxcclxuICAgICdwYWdlLWZvb3RlcicsXHJcbiAgICAncGFnZS1uYXZiYXItbWVudScsXHJcbiAgICAncGFnZS1uYXZiYXInLFxyXG4gICAgJ3BhZ2UtbmV3cycsXHJcbiAgICAncGFnZS1leHBsb3JlJyxcclxuICAgICdwYWdlLW1lc3NhZ2UnLFxyXG4gICAgJ3BhZ2UtbWV0aG9kb2xvZ3knLFxyXG4gICAgJ3BhZ2UtdGVzdGltb25pYWxzJ1xyXG5dO1xyXG5cclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3MvaW5mb2dyYXBoaWMtZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy9wcm9kdWN0LWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3MvcHJvamVjdC1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL3B1YmxpY2F0aW9uLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3Mvc29mdHdhcmUtZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy9zcGVha2luZy1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL3RyYWluaW5nLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3MvdmlkZW8tZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvY29tcG9uZW50cy9tb2RhbC1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWJhbm5lci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtaW1wYWN0LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1jb3VudG1laW4udGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWZvb3Rlci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLW1lbnUudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmV3cy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZXhwbG9yZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWVzc2FnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWcnKTtcclxuXHJcbnZhciBjb25maWdNaXhpbiA9IHJlcXVpcmUoJy4vanMvbWl4aW5zL2NvbmZpZy5qcycpO1xyXG5yaW90Lm1peGluKCdjb25maWcnLCBjb25maWdNaXhpbik7XHJcblxyXG5yaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7XHJcblxyXG52YXIgRnJvbnRFbmQgPSByZXF1aXJlKCcuL0Zyb250RW5kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IEZyb250RW5kKHRhZ3MpOyIsImxldCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJyk7XHJcbmxldCBQcm9taXNlID0gd2luZG93LlByb21pc2U7XHJcbmxldCBsb2NhbGZvcmFnZSA9IHdpbmRvdy5sb2NhbGZvcmFnZTtcclxuXHJcbmNsYXNzIEF1dGgwIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmNhbGxiYWNrVVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgdGhpcy5sb2NrID0gbmV3IEF1dGgwTG9jaygnd3NPbmFydDIzeVZpSVNocVQ0d2ZKMTh3MnZ0MmNsMzInLCAnbWV0YW1hcC5hdXRoMC5jb20nKTtcclxuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgcHJvZmlsZSwgaWRfdG9rZW4sIGN0b2tlbiwgb3B0LCByZWZyZXNoX3Rva2VuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnaWRfdG9rZW4nLCBpZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnByb2ZpbGUgPSBwcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbGlua0FjY291bnQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcclxuICAgICAgICAgICAgY2FsbGJhY2tVUkw6IHRoYXQuY2FsbGJhY2tVUkwsXHJcbiAgICAgICAgICAgIGRpY3Q6IHtcclxuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGluayB3aXRoIGFub3RoZXIgYWNjb3VudCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXV0aFBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGF0LmlkX3Rva2VuIHx8IHRoYXQucHJvZmlsZS5pZGVudGl0aWVzWzBdLmFjY2Vzc190b2tlblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2Vzc2lvbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGdldFByb2ZpbGUgPSAoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhhdC5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIGZ1bmN0aW9uKGVyciwgcHJvZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pZF90b2tlbiA9IGlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlLCBpZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZ1bGZpbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdyZWZyZXNoX3Rva2VuJykudGhlbigodG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVmcmVzaF90b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQubG9jay5nZXRDbGllbnQoKS5yZWZyZXNoVG9rZW4odG9rZW4sIChhLCB0b2tPYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvZmlsZSh0b2tPYmouaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKGlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpO1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3JlZnJlc2hfdG9rZW4nKTtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XHJcbiAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcclxuXHJcblxyXG4iLCJsZXQgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xyXG5sZXQgUHJvbWlzZSA9IHdpbmRvdy5Qcm9taXNlO1xyXG5sZXQgbG9jYWxmb3JhZ2UgPSB3aW5kb3cubG9jYWxmb3JhZ2U7XHJcbmxldCBNZXRhTWFwID0gd2luZG93Lk1ldGFNYXA7XHJcblxyXG5jbGFzcyBNZXRhRmlyZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoYGh0dHBzOi8vJHt0aGlzLmNvbmZpZy5zaXRlLmRifS5maXJlYmFzZWlvLmNvbWApO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgcmV0ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdpZF90b2tlbicpLnRoZW4oKGlkX3Rva2VuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHByb2ZpbGUuY2xpZW50SUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBpZF90b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBkZWxlZ2F0aW9uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZmlyZWJhc2VfdG9rZW4gPSBkZWxlZ2F0aW9uUmVzdWx0LmlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoYXQuZmlyZWJhc2VfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZiLmF1dGhXaXRoQ3VzdG9tVG9rZW4odGhhdC5maXJlYmFzZV90b2tlbiwgKGVycm9yLCBhdXRoRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChhdXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoaWxkKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhIChwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY2hpbGQub24oJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgIChzbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc25hcHNob3QudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBvbiAocGF0aCwgY2FsbGJhY2ssIGV2ZW50ID0gJ3ZhbHVlJyApIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICBjaGlsZC5vbihldmVudCwgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhzbmFwc2hvdC52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhIChkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0ICgpIHtcclxuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiXHJcbnZhciB1c2VyU25hcCA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXkgPSAnMDMyYmFmODctODU0NS00ZWJjLWE1NTctOTM0ODU5MzcxZmE1LmpzJywgcywgeDtcclxuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYXBpS2V5ID0gY29uZmlnLlVTRVJfU05BUF9BUElfS0VZO1xyXG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0ge1xyXG4gICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU25hcC5zZXRFbWFpbEJveChEb2MuYXBwLnVzZXIudXNlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgcy5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xyXG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHJldHVybiB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcclxuXHJcblxyXG4iLCJcclxubGV0IGNvbmZpZyA9IHtcclxuICAgIHBhdGhJbWc6IChmb2xkZXIpID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gYC8vYzY4Zjc5ODFhOGJiZTkyNmExZTAxNTRjYmZiZDVhZjFiNGRmMGYyMS5nb29nbGVkcml2ZS5jb20vaG9zdC8wQjZHQU40Z1gxYm5TZmxSbmRUUkplRlo1TkVzelNFRmxTelZLWkRaSlN6RnhlRGRpY0Zwb0xYVndTRE5GUldOMFJGaGZTMmMvJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vYDtcclxuICAgICAgICBpZiAoZm9sZGVyKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBgJHtmb2xkZXJ9L2A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0YTogKHBhdGgsIGNhbGxiYWNrLCB0aGF0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHdhdGNoRGF0YTogKHBhdGgsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtb2RhbC1kaWFsb2cnLCAnPGRpdiBjbGFzcz1cIm1vZGFsIGZhZGVcIiBpZD1cInsgXy5rZWJhYkNhc2UoZGF0YS50aXRsZSkgfVwiPiA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nIG1vZGFsLWxnXCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPiA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPiA8L2J1dHRvbj4gPHNlY3Rpb24gaWQ9XCJtb2RhbF9kaWFsb2dfY29udGFpbmVyXCI+IDwvc2VjdGlvbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuaWQpIHtcblxuICAgICAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2V4cGxvcmUvaXRlbXMvJyArIG9wdHMuaWQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAgICAgdmFyIHR5cGUgPSBkYXRhLnR5cGU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlKTtcblxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIG9wdHMuZXZlbnQgPSB7fTtcbiAgICAgICAgICAgIG9wdHMuZXZlbnQuaXRlbSA9IGRhdGE7XG5cbiAgICAgICAgICAgIHJpb3QubW91bnQoX3RoaXMubW9kYWxfZGlhbG9nX2NvbnRhaW5lciwgdHlwZSArICctZGlhbG9nJywgb3B0cyk7XG5cbiAgICAgICAgICAgICQoX3RoaXMucm9vdC5maXJzdENoaWxkKS5tb2RhbCgpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudW5tb3VudCh0cnVlKTtcbiAgICAgICAgICAgICAgICByaW90LnJvdXRlKCcjJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ2luZm9ncmFwaGljLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwcm9kdWN0LWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwcm9qZWN0LWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwdWJsaWNhdGlvbi1kaWFsb2cnLCAnPGRpdiBpZj1cIm9wdHNcIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8YSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YS5idXR0b25zIH1cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS1saW5rPVwieyB2YWwubGluayB9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cykge1xuICAgICAgICBfdGhpcy5kYXRhID0gb3B0cy5ldmVudC5pdGVtO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc29mdHdhcmUtZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3NwZWFraW5nLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCd0cmFpbmluZy1kaWFsb2cnLCAnPGRpdiBpZj1cIm9wdHNcIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8YSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YS5idXR0b25zIH1cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS1saW5rPVwieyB2YWwubGluayB9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cykge1xuICAgICAgICBfdGhpcy5kYXRhID0gb3B0cy5ldmVudC5pdGVtO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygndmlkZW8tZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYmFubmVyJywgJzxkaXYgY2xhc3M9XCJmdWxsd2lkdGhiYW5uZXJcIj4gPGRpdiBpZD1cInRwX2Jhbm5lclwiIGNsYXNzPVwidHAtYmFubmVyXCI+IDx1bD4gIDxsaSBpZj1cInsgdGl0bGUgfVwiIGVhY2g9XCJ7IGRhdGEgfVwiIGRhdGEtdHJhbnNpdGlvbj1cImZhZGVcIiBkYXRhLXNsb3RhbW91bnQ9XCI1XCIgZGF0YS10aXRsZT1cInsgdGl0bGUgfVwiPiAgPGltZyBpZj1cInsgaW1nIH1cIiByaW90LXNyYz1cInsgcGFyZW50LnVybCArIGltZyB9XCIgYWx0PVwiZGFya2JsdXJiZ1wiIGRhdGEtYmdmaXQ9XCJjb3ZlclwiIGRhdGEtYmdwb3NpdGlvbj1cImxlZnQgdG9wXCIgZGF0YS1iZ3JlcGVhdD1cIm5vLXJlcGVhdFwiPiA8ZGl2IGNsYXNzPVwiY2FwdGlvbiB0aXRsZS0yIHNmdFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMTAwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTAwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gPHJhdyBjb250ZW50PVwieyB0aXRsZSB9XCI+PC9yYXc+IDwvZGl2PiA8ZGl2IGlmPVwieyBzdWJ0ZXh0IH1cIiBjbGFzcz1cImNhcHRpb24gdGV4dCBzZmxcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjIyMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IDxyYXcgY29udGVudD1cInsgc3VidGV4dCB9XCI+PC9yYXc+IDwvZGl2PiA8ZGl2IGVhY2g9XCJ7IGJ1dHRvbnMgfVwiPiA8ZGl2IGNsYXNzPVwiY2FwdGlvbiBzZmIgcmV2LWJ1dHRvbnMgdHAtcmVzaXplbWVcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjM1NVwiIGRhdGEtc3BlZWQ9XCI1MDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiU2luZS5lYXNlT3V0XCI+IDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCI+eyB0aXRsZSB9PC9hPiA8L2Rpdj4gPC9kaXY+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4nLCAnaWQ9XCJiYW5uZXJcIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBbXTtcbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3NpdGUnKTtcbnRoaXMubW91bnRlZCA9IGZhbHNlO1xuXG50aGlzLndhdGNoRGF0YSgnL2Jhbm5lcicsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGZhbHNlID09IF90aGlzLm1vdW50ZWQpIHtcbiAgICAgICAgX3RoaXMubW91bnRlZCA9IHRydWU7XG4gICAgICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKF90aGlzLnRwX2Jhbm5lcikucmV2b2x1dGlvbih7XG4gICAgICAgICAgICBzdG9wQXRTbGlkZTogMSxcbiAgICAgICAgICAgIHN0b3BBZnRlckxvb3BzOiAwLFxuICAgICAgICAgICAgc3RhcnR3aWR0aDogMTE3MCxcbiAgICAgICAgICAgIHN0YXJ0aGVpZ2h0OiA2MDAsXG4gICAgICAgICAgICBoaWRlVGh1bWJzOiAxMCxcbiAgICAgICAgICAgIC8vZnVsbFdpZHRoOiBcIm9uXCIsXG4gICAgICAgICAgICAvL2ZvcmNlRnVsbFdpZHRoOiBcIm9uXCIsXG4gICAgICAgICAgICBsYXp5TG9hZDogJ29uJ1xuICAgICAgICAgICAgLy8gbmF2aWdhdGlvblN0eWxlOiBcInByZXZpZXc0XCJcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vZWxzZSB7XG4gICAgLy8gICAgdGhpcy51bm1vdW50KHRydWUpO1xuICAgIC8vICAgIHJpb3QubW91bnQoJ3BhZ2UtYmFubmVyJyk7XG4gICAgLy99XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb3VudG1laW4nLCAnPHNlY3Rpb24gY2xhc3M9XCJmdW4tZmFjdC13cmFwIGZ1bi1mYWN0cy1iZ1wiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiBmYWN0cy1pblwiPiA8aDM+IDxzcGFuIGNsYXNzPVwiY291bnRlclwiPjg3Niw1Mzk8L3NwYW4+KyA8L2gzPiA8aDQ+U3lzdGVtcyBUaGlua2VyczwvaDQ+IDxicj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPkNvdW50IE1lIEluPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgZnVuY3Rpb24ob3B0cykge1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWV4cGxvcmUnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj4gPHN0cm9uZz57IGhlYWRlci50aXRsZSB9PC9zdHJvbmc+IDwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJjdWJlLW1hc29ucnlcIj4gPGRpdiBpZD1cImZpbHRlcnNfY29udGFpbmVyXCIgY2xhc3M9XCJjYnAtbC1maWx0ZXJzLWFsaWduQ2VudGVyXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIGZpbHRlcnMgfVwiIGRhdGEtZmlsdGVyPVwiLnsgdmFsLnRhZyB9XCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW0geyBcXCdjYnAtZmlsdGVyLWl0ZW0tYWN0aXZlXFwnOiBpID09IDAgfVwiPiB7IHZhbC5uYW1lIH0gPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9XCJtYXNvbnJ5X2NvbnRhaW5lclwiIGNsYXNzPVwiY2JwXCI+IDxkaXYgaWQ9XCJ7IGlkIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCIgZWFjaD1cInsgY29udGVudCB9XCIgY2xhc3M9XCJjYnAtaXRlbSB7IHR5cGUgfSB7IF8ua2V5cyh0YWdzKS5qb2luKFxcJyBcXCcpIH1cIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uXCIgZGF0YS10aXRsZT1cInsgdGV4dCB9XCIgaHJlZj1cInsgbGluayB8fCBwYXJlbnQudXJsICsgdHlwZSArIFxcJy9cXCcgKyBpbWcgfVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBpZj1cInsgaW1nIH1cIiByaW90LXNyYz1cInsgcGFyZW50LnVybCArIHR5cGUgKyBcXCcvXFwnICsgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBpZj1cInsgdGl0bGUgfVwiIGNsYXNzPVwieyBcXCdjYnAtbC1jYXB0aW9uLXRpdGxlXFwnOiB0cnVlIH1cIiA+eyB0aXRsZSB9PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cIm1hc29ucnktcG9ydGZvbGlvLTQuaHRtbFwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPkV4cGxvcmUgQWxsPC9hPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG50aGlzLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgIHJpb3Qucm91dGUoXy5rZWJhYkNhc2UoZS5pdGVtLnRpdGxlKSwgZSwgX3RoaXMpO1xufTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9leHBsb3JlJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmZpbHRlcnMgPSBfLnNvcnRCeShkYXRhLmZpbHRlcnMsICdvcmRlcicpO1xuICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgIF90aGlzLml0ZW1zID0gXy5tYXAoZGF0YS5pdGVtcywgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgIHZhbC5pZCA9IGtleTtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9KTtcbiAgICBfdGhpcy5jb250ZW50ID0gXy5maWx0ZXIoX3RoaXMuaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiAhKGl0ZW0uYXJjaGl2ZSA9PT0gdHJ1ZSk7XG4gICAgfSk7XG4gICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAkKF90aGlzLm1hc29ucnlfY29udGFpbmVyKS5jdWJlcG9ydGZvbGlvKHtcbiAgICAgICAgZmlsdGVyczogJyNmaWx0ZXJzX2NvbnRhaW5lcicsXG4gICAgICAgIGxheW91dE1vZGU6ICdncmlkJyxcbiAgICAgICAgZGVmYXVsdEZpbHRlcjogJy5mZWF0dXJlZCcsXG4gICAgICAgIGFuaW1hdGlvblR5cGU6ICdmbGlwT3V0RGVsYXknLFxuICAgICAgICBnYXBIb3Jpem9udGFsOiAyMCxcbiAgICAgICAgZ2FwVmVydGljYWw6IDIwLFxuICAgICAgICBncmlkQWRqdXN0bWVudDogJ3Jlc3BvbnNpdmUnLFxuICAgICAgICBtZWRpYVF1ZXJpZXM6IFt7XG4gICAgICAgICAgICB3aWR0aDogMTEwMCxcbiAgICAgICAgICAgIGNvbHM6IDRcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgIGNvbHM6IDNcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgIGNvbHM6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgd2lkdGg6IDMyMCxcbiAgICAgICAgICAgIGNvbHM6IDFcbiAgICAgICAgfV0sXG4gICAgICAgIGNhcHRpb246ICdvdmVybGF5Qm90dG9tQWxvbmcnLFxuICAgICAgICBkaXNwbGF5VHlwZTogJ2JvdHRvbVRvVG9wJyxcbiAgICAgICAgZGlzcGxheVR5cGVTcGVlZDogMTAwXG4gICAgfSk7XG59KTtcbi8vcmlvdC5tb3VudCgnbW9kYWwtZGlhbG9nJywgeyBldmVudDogZSwgdGFnOiB0aGlzIH0pXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgJzxmb290ZXIgaWQ9XCJmb290ZXJcIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+eyBkYXRhLmFib3V0LnRpdGxlIH08L2gzPiA8cCBzdHlsZT1cImNvbG9yOiAjZmZmO1wiPnsgZGF0YS5hYm91dC50ZXh0IH08L3A+IDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHNvY2lhbC0xXCI+IDxsaSBlYWNoPVwieyBkYXRhLmFib3V0LnNvY2lhbCB9XCI+IDxhIGhyZWY9XCJ7IGxpbmsgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+Q29udGFjdCBVczwvaDM+IDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgY29udGFjdFwiPiA8bGkgZWFjaD1cInsgZGF0YS5jb250YWN0IH1cIj4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj4gPHN0cm9uZz4gPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9OiA8L3N0cm9uZz4geyB0ZXh0IH0gPC9wPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPlJlY2VudDwvaDM+IDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIGYyLXdvcmtcIj4gPGxpIGVhY2g9XCJ7IGRhdGEucmVjZW50IH1cIj4gPGEgaHJlZj1cInsgbGluayB9XCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCArIGltZyB9XCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+TmV3c2xldHRlcjwvaDM+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+eyBkYXRhLm5ld3NsZXR0ZXIudGV4dCB9PC9wPiA8Zm9ybSByb2xlPVwiZm9ybVwiIGNsYXNzPVwic3Vic2NyaWJlLWZvcm1cIj4gPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+IDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCB0byBzdWJzY3JpYmVcIj4gPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tbGdcIiB0eXBlPVwic3VibWl0XCI+T2s8L2J1dHRvbj4gPC9zcGFuPiA8L2Rpdj4gPC9mb3JtPiA8L2Rpdj4gPC9kaXY+ICA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtY2VudGVyXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItYnRtXCI+IDxzcGFuPiZjb3B5OzIwMTUgQ2FicmVyYSBSZXNlYXJjaCBMYWI8L3NwYW4+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Zvb3Rlcj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9mb290ZXInKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgX3RoaXMudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1pbXBhY3QnLCAnPHNlY3Rpb24+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDIgaWY9XCJ7IGhlYWRlciB9XCI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwIGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwibGVhZFwiPiB7IGhlYWRlci50ZXh0IH0gPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwiaW1wYWN0X3NsaWRlclwiIGNsYXNzPVwib3dsLWNhcm91c2VsXCI+IDxkaXYgY2xhc3M9XCJpdGVtXCIgZWFjaD1cInsgaXRlbXMgfVwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpbWcgaWY9XCJ7IGltZyB9XCIgd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjEyNXB4XCIgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgfWltcGFjdC97IGltZyB9XCIgYWx0PVwieyB0aXRsZSB9XCI+IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9zZWN0aW9uPicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvaW1wYWN0JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKF90aGlzLmltcGFjdF9zbGlkZXIpLm93bENhcm91c2VsKHtcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogMzAwMCxcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtczogNCxcbiAgICAgICAgICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcFNtYWxsOiBbOTkxLCAyXVxuICAgICAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1lc3NhZ2UnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPjxyYXcgY29udGVudD1cInsgaGVhZGVyLnRleHQgfVwiPjwvcmF3PiA8L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJyb3cgc3BlY2lhbC1mZWF0dXJlXCI+IDxkaXYgZWFjaD1cInsgaXRlbXMgfVwiIGNsYXNzPVwiY29sLW1kLTQgY29sLXNtLTQgbWFyZ2luMTBcIj4gPGRpdiBjbGFzcz1cInMtZmVhdHVyZS1ib3ggdGV4dC1jZW50ZXIgd293IGFuaW1hdGVkIGZhZGVJblwiIGRhdGEtd293LWR1cmF0aW9uPVwiNzAwbXNcIiBkYXRhLXdvdy1kZWxheT1cIjIwMG1zXCI+IDxkaXYgY2xhc3M9XCJtYXNrLXRvcFwiPiAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gIDxoND57IHRpdGxlIH08L2g0PiA8L2Rpdj4gPGRpdiBjbGFzcz1cIm1hc2stYm90dG9tXCI+ICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiAgPGg0PnsgdGl0bGUgfTwvaDQ+ICA8cD57IHRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmhlYWRlciA9IHt9O1xudGhpcy5pdGVtcyA9IFtdO1xuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9tZXNzYWdlJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1ldGhvZG9sb2d5JywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwIGNsYXNzPVwibGVhZFwiPnsgaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTMwXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDQ+eyBmcmFtZXdvcmtzLmhlYWRlci50aXRsZSB9PC9oND4gPHAgY2xhc3M9XCJsZWFkXCI+eyBmcmFtZXdvcmtzLmhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicGFuZWwtZ3JvdXBcIiBpZD1cImZyYW1ld29ya3NcIj4gPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gZnJhbWV3b3Jrcy5pdGVtcyB9XCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+IDxoNCBjbGFzcz1cInBhbmVsLXRpdGxlXCI+IDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXBhcmVudD1cIiNmcmFtZXdvcmtzXCIgaHJlZj1cIiNjb2xsYXBzZUZyYW1ld29ya3NfeyBpIH1cIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvaDQ+IDwvZGl2PiA8ZGl2IGlkPVwiY29sbGFwc2VGcmFtZXdvcmtzX3sgaSB9XCIgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZSB7IGluOiBpID09IDAgfVwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPiB7IHZhbC50ZXh0IH0gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDQ+eyBwYXJ0bmVycy5oZWFkZXIudGl0bGUgfTwvaDQ+IDxwIGNsYXNzPVwibGVhZFwiPnsgcGFydG5lcnMuaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJwYW5lbC1ncm91cFwiIGlkPVwiYWNjb3JkaW9uXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIHBhcnRuZXJzLml0ZW1zIH1cIiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj4gPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gPGg0IGNsYXNzPVwicGFuZWwtdGl0bGVcIj4gPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtcGFyZW50PVwiI2FjY29yZGlvblwiIGhyZWY9XCIjY29sbGFwc2VPbmVfeyBpIH1cIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvaDQ+IDwvZGl2PiA8ZGl2IGlkPVwiY29sbGFwc2VPbmVfeyBpIH1cIiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlIHsgaW46IGkgPT0gMCB9XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+IHsgdmFsLnRleHQgfSA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL21ldGhvZG9sb2d5JykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuZnJhbWV3b3JrcyA9IGRhdGEuZnJhbWV3b3JrcztcbiAgICAgICAgX3RoaXMucGFydG5lcnMgPSBkYXRhLnBhcnRuZXJzO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVudS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPiA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj4gPGxpIGNsYXNzPVwieyBkcm9wZG93bjogdHJ1ZSwgYWN0aXZlOiBpID09IDAgfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhIH1cIj4gPGEgaWY9XCJ7IHZhbC50aXRsZSB9XCIgaHJlZj1cIiNcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj4gPGkgaWY9XCJ7IHZhbC5pY29uIH1cIiBjbGFzcz1cInsgdmFsLmljb24gfVwiID48L2k+IHsgdmFsLnRpdGxlIH0gPGkgaWY9XCJ7IHZhbC5tZW51ICYmIHZhbC5tZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCIgPjwvaT4gPC9hPiA8dWwgaWY9XCJ7IHZhbC5tZW51ICYmIHZhbC5tZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJkcm9wZG93bi1tZW51IG11bHRpLWxldmVsXCIgcm9sZT1cIm1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJkcm9wZG93bk1lbnVcIj4gPGxpIGVhY2g9XCJ7IHZhbC5tZW51IH1cIiA+IDxhIGhyZWY9XCIjXCI+IDxpIGlmPVwieyBpY29uIH1cIiBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPiA8L2E+IDwvbGk+IDwvdWw+IDwvbGk+IDwvdWw+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbnZhciB0aGF0ID0gdGhpcztcbnRoYXQuZGF0YSA9IFtdO1xuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9uYXZiYXInKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhhdC5kYXRhID0gZGF0YTtcbiAgICB0aGF0LnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLXN0YXRpYy10b3AgeWFtbSBzdGlja3lcIiByb2xlPVwibmF2aWdhdGlvblwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJuYXZiYXItaGVhZGVyXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmF2YmFyLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj4gPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDwvYnV0dG9uPiA8YSBjbGFzcz1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIjXCI+IDxpbWcgaWY9XCJ7IGRhdGEgfVwiIGhlaWdodD1cIjIxcHhcIiB3aWR0aD1cIjIxcHhcIiByaW90LXNyYz1cInsgdXJsIH1zaXRlL3sgZGF0YS5pbWcgfVwiIGFsdD1cInsgZGF0YS5hbHQgfVwiPiA8L2E+IDwvZGl2PiA8cGFnZS1tZW51LW5hdmJhcj48L3BhZ2UtbWVudS1uYXZiYXI+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2xvZ28nKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgX3RoaXMudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1uZXdzJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxoMyBjbGFzcz1cImhlYWRpbmdcIj5MYXRlc3QgTmV3czwvaDM+IDxkaXYgaWQ9XCJuZXdzX2Nhcm91c2VsXCIgY2xhc3M9XCJvd2wtY2Fyb3VzZWwgb3dsLXNwYWNlZFwiPiA8ZGl2IGVhY2g9XCJ7IGRhdGEgfVwiPiAgIDxkaXYgY2xhc3M9XCJuZXdzLWRlc2NcIj4gPGg1PiA8YSBocmVmPVwieyBieSA/IGxpbmsgOiBcXCdqYXZhc2NyaXB0OjtcXCcgfVwiIHRhcmdldD1cIl9ibGFua1wiPnsgSHVtYW5pemUudHJ1bmNhdGUodGl0bGUsIDEyNSkgfTwvYT4gPC9oNT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5kYXRhID0gW107XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbmV3cycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IF8udG9BcnJheShkYXRhKTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICQoX3RoaXMubmV3c19jYXJvdXNlbCkub3dsQ2Fyb3VzZWwoe1xuICAgICAgICAgICAgICAgIC8vIE1vc3QgaW1wb3J0YW50IG93bCBmZWF0dXJlc1xuICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxuICAgICAgICAgICAgICAgIGl0ZW1zQ3VzdG9tOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtc0Rlc2t0b3A6IFsxMTk5LCA0XSxcbiAgICAgICAgICAgICAgICBpdGVtc0Rlc2t0b3BTbWFsbDogWzk4MCwgMl0sXG4gICAgICAgICAgICAgICAgaXRlbXNUYWJsZXQ6IFs3NjgsIDJdLFxuICAgICAgICAgICAgICAgIGl0ZW1zVGFibGV0U21hbGw6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zTW9iaWxlOiBbNDc5LCAxXSxcbiAgICAgICAgICAgICAgICBzaW5nbGVJdGVtOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzdGFydERyYWdnaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgIGF1dG9QbGF5OiA0MDAwXG4gICAgICAgIH0pO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtdGVzdGltb25pYWxzJywgJzxkaXYgaWQ9XCJ0ZXN0aW1vbmlhbHMtY2Fyb3VzZWxcIiBjbGFzcz1cInRlc3RpbW9uaWFscyB0ZXN0aW1vbmlhbHMtdi0yIHdvdyBhbmltYXRlZCBmYWRlSW5VcFwiIGRhdGEtd293LWR1cmF0aW9uPVwiNzAwbXNcIiBkYXRhLXdvdy1kZWxheT1cIjEwMG1zXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPnsgaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPiA8ZGl2IGlkPVwidGVzdGltb25pYWxfc2xpZGVcIiBjbGFzcz1cInRlc3RpLXNsaWRlXCI+IDx1bCBjbGFzcz1cInNsaWRlc1wiPiA8bGkgZWFjaD1cInsgaXRlbXMgfVwiPiA8aW1nIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nIH1cIiBhbHQ9XCJ7IHVzZXIgfVwiPiA8aDQ+IDxpIGNsYXNzPVwiZmEgZmEtcXVvdGUtbGVmdCBpb24tcXVvdGVcIj48L2k+IHsgdGV4dH0gPC9oND4gPHAgY2xhc3M9XCJ0ZXN0LWF1dGhvclwiPiB7IHVzZXIgfSAtIDxlbT57IHN1YnRleHQgfTwvZW0+IDwvcD4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTMwXCI+PC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygndGVzdGltb25pYWxzJyk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvdGVzdGltb25pYWxzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKF90aGlzLnRlc3RpbW9uaWFsX3NsaWRlKS5mbGV4c2xpZGVyKHtcbiAgICAgICAgICAgICAgICBzbGlkZXNob3dTcGVlZDogNTAwMCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25OYXY6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUnXG4gICAgICAgIH0pO1xufSk7XG59KTsiXX0=
