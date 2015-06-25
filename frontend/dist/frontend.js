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
module.exports = riot.tag('modal-dialog', '<div if="{ opts }" class="modal fade" id="{ opts.id }"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-body"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <section id="modal_dialog_container"> </section> </div> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {

        var type = opts.event.item.type;
        console.log(type);
        riot.mount(_this.modal_dialog_container, type + '-dialog', opts);

        $(_this.root.firstChild).modal();
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
module.exports = riot.tag('page-explore', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <div onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption" data-title="{ text }" href="{ link || parent.url + type + \'/\' + img }"> <div class="cbp-caption-defaultWrap"> <img if="{ img }" riot-src="{ parent.url + type + \'/\' + img }" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ title }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </div> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="masonry-portfolio-4.html" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

this.onClick = function (e) {
    riot.mount('modal-dialog', { event: e, tag: _this });
};

FrontEnd.MetaFire.getData(FrontEnd.site + '/explore').then(function (data) {
    _this.filters = _.sortBy(data.filters, 'order');
    _this.header = data.header;
    _this.items = data.items;
    FrontEnd.MetaFire.getData(FrontEnd.site + '/content').then(function (data) {
        _this.content = _.sortBy(_.toArray(data), 'order');
        _this.content = _.union(_this.content, _this.items);
        _this.content = _.filter(_this.content, function (item) {
            return !(item.archived === true);
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
});
// lightbox
//lightboxDelegate: '.cbp-lightbox',
//lightboxGallery: true,
//lightboxTitleSrc: 'data-title',
//lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
});
},{"riot":"riot"}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p>{ data.about.text }</p> <ul class="list-inline social-1"> <li each="{ data.about.social }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Contact Us</h3> <ul class="list-unstyled contact"> <li each="{ data.contact }"> <p> <strong> <i class="{ icon }"></i> { title }: </strong> { text } </p> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Recent</h3> <ul class="list-inline f2-work"> <li each="{ data.recent }"> <a href="{ link }"> <img riot-src="{ url + img }" class="img-responsive" alt="{ title }"> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Newsletter</h3> <p>{ data.newsletter.text }</p> <form role="form" class="subscribe-form"> <div class="input-group"> <input type="text" class="form-control" placeholder="Enter email to subscribe"> <span class="input-group-btn"> <button class="btn btn-theme-dark btn-lg" type="submit">Ok</button> </span> </div> </form> </div> </div>  </div> <div class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span>&copy;2015 by Cabrera Research Lab</span> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvbW9kYWwtZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2RpYWxvZ3MvaW5mb2dyYXBoaWMtZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2RpYWxvZ3MvcHJvZHVjdC1kaWFsb2cudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvZGlhbG9ncy9wcm9qZWN0LWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3B1YmxpY2F0aW9uLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3NvZnR3YXJlLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3NwZWFraW5nLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3RyYWluaW5nLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9kaWFsb2dzL3ZpZGVvLWRpYWxvZy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWJhbm5lci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWNvdW50bWVpbi50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWV4cGxvcmUudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1mb290ZXIudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1pbXBhY3QudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5hdmJhci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5ld3MudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDL0MsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7QUFFdkIsSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLEdBQVM7QUFDakIsUUFBTSxLQUFLLEdBQUc7QUFDVixXQUFHLEVBQUU7QUFDRCxvQkFBUSxFQUFFLE9BQU87QUFDakIsY0FBRSxFQUFFLGtCQUFrQjtBQUN0QixzQkFBVSxFQUFFLEVBQUU7QUFDZCxpQkFBSyxFQUFFLHNCQUFzQjtBQUM3QixrQkFBTSxFQUFFLG1DQUFtQztTQUM5QztBQUNELG1CQUFXLEVBQUU7QUFDVCxvQkFBUSxFQUFFLFlBQVk7QUFDdEIsY0FBRSxFQUFFLGtCQUFrQjtBQUN0QixzQkFBVSxFQUFFLEVBQUU7QUFDZCxpQkFBSyxFQUFFLFlBQVk7QUFDbkIsa0JBQU0sRUFBRSxtQ0FBbUM7U0FDOUM7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgTWV0YUZpcmUgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZScpO1xyXG5sZXQgQXV0aDAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9hdXRoMCcpO1xyXG5sZXQgdXNlcnNuYXAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcCcpO1xyXG5sZXQgcmlvdCA9IHdpbmRvdy5yaW90O1xyXG5cclxuY29uc3QgY29uZmlnID0gKCkgPT4ge1xyXG4gICAgY29uc3QgU0lURVMgPSB7XHJcbiAgICAgICAgQ1JMOiB7XHJcbiAgICAgICAgICAgIGZyb250RW5kOiAnY3JsYWInLFxyXG4gICAgICAgICAgICBkYjogJ3BvcHBpbmctZmlyZS04OTcnLFxyXG4gICAgICAgICAgICBtZXRhTWFwVXJsOiAnJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdDYWJyZXJhIFJlc2VhcmNoIExhYicsXHJcbiAgICAgICAgICAgIGZhdmljbzogJ2Zyb250ZW5kL2Rpc3QvaW1nL2ljby9mYXZpY29uLmljbydcclxuICAgICAgICB9LFxyXG4gICAgICAgIFRISU5LX1dBVEVSOiB7XHJcbiAgICAgICAgICAgIGZyb250RW5kOiAndGhpbmt3YXRlcicsXHJcbiAgICAgICAgICAgIGRiOiAncG9wcGluZy1maXJlLTg5NycsXHJcbiAgICAgICAgICAgIG1ldGFNYXBVcmw6ICcnLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1RoaW5rV2F0ZXInLFxyXG4gICAgICAgICAgICBmYXZpY286ICdmcm9udGVuZC9kaXN0L2ltZy9pY28vZmF2aWNvbi5pY28nXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJldCA9IHtcclxuICAgICAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxuICAgICAgICBzaXRlOiB7fVxyXG4gICAgfVxyXG4gICAgbGV0IHNlZ21lbnRzID0gcmV0Lmhvc3Quc3BsaXQoJy4nKTtcclxuICAgIGxldCBmaXJzdCA9IHNlZ21lbnRzWzBdO1xyXG4gICAgaWYgKGZpcnN0ID09PSAnd3d3Jykge1xyXG4gICAgICAgIGZpcnN0ID0gc2VnbWVudHNbMV07XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKGZpcnN0LnRvTG93ZXJDYXNlKCkpIHtcclxuICAgIGNhc2UgJ21ldGEtbWFwLXN0YWdpbmcnOlxyXG4gICAgY2FzZSAnZnJvbnRlbmQnOlxyXG4gICAgICAgIHJldC5zaXRlID0gU0lURVNbJ0NSTCddO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAndGhpbmt3YXRlci1zdGFnaW5nJzpcclxuICAgIGNhc2UgJ3RoaW5rd2F0ZXInOlxyXG4gICAgICAgIHJldC5zaXRlID0gU0lURVNbJ1RISU5LX1dBVEVSJ107XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vRm9yIG5vdywgZGVmYXVsdCB0byBDUkxcclxuICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydDUkwnXTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QuZnJlZXplKHJldCk7XHJcbiAgICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuY2xhc3MgRnJvbnRFbmQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ3MpIHtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5jb25maWcuc2l0ZS50aXRsZTtcclxuICAgICAgICBsZXQgZmF2aWNvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdmljbycpO1xyXG4gICAgICAgIGZhdmljby5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgLy9jNjhmNzk4MWE4YmJlOTI2YTFlMDE1NGNiZmJkNWFmMWI0ZGYwZjIxLmdvb2dsZWRyaXZlLmNvbS9ob3N0LzBCNkdBTjRnWDFiblNmbFJuZFRSSmVGWjVORXN6U0VGbFN6VktaRFpKU3pGeGVEZGljRnBvTFhWd1NETkZSV04wUkZoZlMyYy8ke3RoaXMuY29uZmlnLnNpdGUuZnJvbnRFbmR9L2Zhdmljb24uaWNvYCk7XHJcblxyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHVzZXJzbmFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnNpdGUuZnJvbnRFbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICAvL18uZWFjaCh0aGlzLnRhZ3MsICh0YWcpID0+IHtcclxuICAgICAgICAvLyAgICByaW90Lm1vdW50KHRhZywgdGhpcyk7XHJcbiAgICAgICAgLy99KTtcclxuICAgICAgICByaW90Lm1vdW50KCcqJyk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9naW4oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ291dCgpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9nb3V0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRnJvbnRFbmQ7IiwicmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxucmVxdWlyZSgnY29yZS1qcycpO1xyXG53aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcclxucmVxdWlyZSgnanF1ZXJ5LXVpJyk7XHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xyXG53aW5kb3cuRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xyXG53aW5kb3cuSHVtYW5pemUgPSByZXF1aXJlKCdodW1hbml6ZS1wbHVzJyk7XHJcbndpbmRvdy5tb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxud2luZG93LlVSSSA9IHJlcXVpcmUoJ1VSSWpzJyk7XHJcbndpbmRvdy5sb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJyk7XHJcblxyXG5sZXQgdGFncyA9IFtcclxuICAgICdwYWdlLWhlYWQnLFxyXG4gICAgJ3BhZ2UtYmFubmVyJyxcclxuICAgICdwYWdlLWltcGFjdCcsXHJcbiAgICAncGFnZS1jb3VudG1laW4nLFxyXG4gICAgJ3BhZ2UtZm9vdGVyJyxcclxuICAgICdwYWdlLW5hdmJhci1tZW51JyxcclxuICAgICdwYWdlLW5hdmJhcicsXHJcbiAgICAncGFnZS1uZXdzJyxcclxuICAgICdwYWdlLWV4cGxvcmUnLFxyXG4gICAgJ3BhZ2UtbWVzc2FnZScsXHJcbiAgICAncGFnZS1tZXRob2RvbG9neScsXHJcbiAgICAncGFnZS10ZXN0aW1vbmlhbHMnXHJcbl07XHJcblxyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy9pbmZvZ3JhcGhpYy1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL3Byb2R1Y3QtZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy9wcm9qZWN0LWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3MvcHVibGljYXRpb24tZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy9zb2Z0d2FyZS1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9kaWFsb2dzL3NwZWFraW5nLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL2RpYWxvZ3MvdHJhaW5pbmctZGlhbG9nLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvZGlhbG9ncy92aWRlby1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9jb21wb25lbnRzL21vZGFsLWRpYWxvZy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtYmFubmVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1pbXBhY3QudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWNvdW50bWVpbi50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZm9vdGVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uZXdzLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1leHBsb3JlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tZXRob2RvbG9neS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtdGVzdGltb25pYWxzLnRhZycpO1xyXG5cclxudmFyIGNvbmZpZ01peGluID0gcmVxdWlyZSgnLi9qcy9taXhpbnMvY29uZmlnLmpzJyk7XHJcbnJpb3QubWl4aW4oJ2NvbmZpZycsIGNvbmZpZ01peGluKTtcclxuXHJcbnJpb3QudGFnKCdyYXcnLCAnPHNwYW4+PC9zcGFuPicsIGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IChvcHRzKSA/IChvcHRzLmNvbnRlbnQgfHwgJycpIDogJyc7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xyXG59KTtcclxuXHJcbnZhciBGcm9udEVuZCA9IHJlcXVpcmUoJy4vRnJvbnRFbmQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRnJvbnRFbmQodGFncyk7IiwibGV0IEF1dGgwTG9jayA9IHJlcXVpcmUoJ2F1dGgwLWxvY2snKTtcclxubGV0IFByb21pc2UgPSB3aW5kb3cuUHJvbWlzZTtcclxubGV0IGxvY2FsZm9yYWdlID0gd2luZG93LmxvY2FsZm9yYWdlO1xyXG5cclxuY2xhc3MgQXV0aDAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKCd3c09uYXJ0MjN5VmlJU2hxVDR3ZkoxOHcydnQyY2wzMicsICdtZXRhbWFwLmF1dGgwLmNvbScpO1xyXG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb2ZpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmxvY2suc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5BZnRlclNpZ251cDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3JlZnJlc2hfdG9rZW4nLCByZWZyZXNoX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaWRfdG9rZW4gPSBpZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnJlZnJlc2hfdG9rZW4gPSByZWZyZXNoX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBsaW5rQWNjb3VudCgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5sb2NrLnNob3coe1xyXG4gICAgICAgICAgICBjYWxsYmFja1VSTDogdGhhdC5jYWxsYmFja1VSTCxcclxuICAgICAgICAgICAgZGljdDoge1xyXG4gICAgICAgICAgICAgICAgc2lnbmluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoYXQuaWRfdG9rZW4gfHwgdGhhdC5wcm9maWxlLmlkZW50aXRpZXNbMF0uYWNjZXNzX3Rva2VuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZXNzaW9uKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgZ2V0UHJvZmlsZSA9IChpZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgZnVuY3Rpb24oZXJyLCBwcm9maWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5wcm9maWxlID0gcHJvZmlsZTtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZnVsZmlsbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ3JlZnJlc2hfdG9rZW4nKS50aGVuKCh0b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLmdldENsaWVudCgpLnJlZnJlc2hUb2tlbih0b2tlbiwgKGEsIHRva09iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKHRva09iai5pZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb2ZpbGUoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ2lkX3Rva2VuJyk7XHJcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgncmVmcmVzaF90b2tlbicpO1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3Byb2ZpbGUnKTtcclxuICAgICAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xyXG5cclxuXHJcbiIsImxldCBGaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbmxldCBQcm9taXNlID0gd2luZG93LlByb21pc2U7XHJcbmxldCBsb2NhbGZvcmFnZSA9IHdpbmRvdy5sb2NhbGZvcmFnZTtcclxubGV0IE1ldGFNYXAgPSB3aW5kb3cuTWV0YU1hcDtcclxuXHJcbmNsYXNzIE1ldGFGaXJlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGxldCByZXQgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuQXV0aDAuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5BdXRoMC5sb2NrLmdldENsaWVudCgpLmdldERlbGVnYXRpb25Ub2tlbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogcHJvZmlsZS5jbGllbnRJRCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfdG9rZW46IGlkX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGlfdHlwZTogJ2ZpcmViYXNlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIGRlbGVnYXRpb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2ZpcmViYXNlX3Rva2VuJywgdGhhdC5maXJlYmFzZV90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGF0LmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGF1dGhEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEgKHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjaGlsZC5vbigndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzbmFwc2hvdC52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uIChwYXRoLCBjYWxsYmFjaywgZXZlbnQgPSAndmFsdWUnICkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9uKGV2ZW50LCAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNuYXBzaG90LnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEgKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkLnNldChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQgKCkge1xyXG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJcclxudmFyIHVzZXJTbmFwID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgdmFyIGFwaUtleSA9ICcwMzJiYWY4Ny04NTQ1LTRlYmMtYTU1Ny05MzQ4NTkzNzFmYTUuanMnLCBzLCB4O1xyXG4gICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XHJcbiAgICAgICAgY29uZmlnID0ge307XHJcbiAgICB9XHJcbiAgICBhcGlLZXkgPSBjb25maWcuVVNFUl9TTkFQX0FQSV9LRVk7XHJcbiAgICBpZiAoYXBpS2V5ICYmIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSAhPT0gJ2xvY2FsaG9zdCcpIHtcclxuICAgICAgICB3aW5kb3cudXNlcnNuYXBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIG1vZGU6ICdyZXBvcnQnLFxyXG4gICAgICAgICAgICBzaG9ydGN1dDogdHJ1ZSxcclxuICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTbmFwLnNldEVtYWlsQm94KERvYy5hcHAudXNlci51c2VyTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuICAgICAgICBzLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XHJcbiAgICAgICAgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XHJcbiAgICAgICAgcmV0dXJuIHguYXBwZW5kQ2hpbGQocyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVzZXJTbmFwO1xyXG5cclxuXHJcbiIsIlxyXG5sZXQgY29uZmlnID0ge1xyXG4gICAgcGF0aEltZzogKGZvbGRlcikgPT4ge1xyXG4gICAgICAgIGxldCByZXQgPSBgLy9jNjhmNzk4MWE4YmJlOTI2YTFlMDE1NGNiZmJkNWFmMWI0ZGYwZjIxLmdvb2dsZWRyaXZlLmNvbS9ob3N0LzBCNkdBTjRnWDFiblNmbFJuZFRSSmVGWjVORXN6U0VGbFN6VktaRFpKU3pGeGVEZGljRnBvTFhWd1NETkZSV04wUkZoZlMyYy8ke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS9gO1xyXG4gICAgICAgIGlmIChmb2xkZXIpIHtcclxuICAgICAgICAgICAgcmV0ICs9IGAke2ZvbGRlcn0vYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0sXHJcbiAgICBnZXREYXRhOiAocGF0aCwgY2FsbGJhY2ssIHRoYXQpID0+IHtcclxuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuTWV0YUZpcmUub24oYCR7d2luZG93LkZyb250RW5kLnNpdGV9LyR7cGF0aH1gLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGF0LmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGF0LnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgd2F0Y2hEYXRhOiAocGF0aCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuTWV0YUZpcmUub24oYCR7d2luZG93LkZyb250RW5kLnNpdGV9LyR7cGF0aH1gLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ21vZGFsLWRpYWxvZycsICc8ZGl2IGlmPVwieyBvcHRzIH1cIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiBpZD1cInsgb3B0cy5pZCB9XCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2cgbW9kYWwtbGdcIj4gPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+IDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+IDwvYnV0dG9uPiA8c2VjdGlvbiBpZD1cIm1vZGFsX2RpYWxvZ19jb250YWluZXJcIj4gPC9zZWN0aW9uPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcblxuICAgICAgICB2YXIgdHlwZSA9IG9wdHMuZXZlbnQuaXRlbS50eXBlO1xuICAgICAgICBjb25zb2xlLmxvZyh0eXBlKTtcbiAgICAgICAgcmlvdC5tb3VudChfdGhpcy5tb2RhbF9kaWFsb2dfY29udGFpbmVyLCB0eXBlICsgJy1kaWFsb2cnLCBvcHRzKTtcblxuICAgICAgICAkKF90aGlzLnJvb3QuZmlyc3RDaGlsZCkubW9kYWwoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnaW5mb2dyYXBoaWMtZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Byb2R1Y3QtZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Byb2plY3QtZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3B1YmxpY2F0aW9uLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdzb2Z0d2FyZS1kaWFsb2cnLCAnPGRpdiBpZj1cIm9wdHNcIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8YSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YS5idXR0b25zIH1cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS1saW5rPVwieyB2YWwubGluayB9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cykge1xuICAgICAgICBfdGhpcy5kYXRhID0gb3B0cy5ldmVudC5pdGVtO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc3BlYWtpbmctZGlhbG9nJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGEgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEuYnV0dG9ucyB9XCIgcm9sZT1cImJ1dHRvblwiIGRhdGEtbGluaz1cInsgdmFsLmxpbmsgfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiAxMHB4O1wiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3RyYWluaW5nLWRpYWxvZycsICc8ZGl2IGlmPVwib3B0c1wiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBkYXRhLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLnRleHQgfVwiPjwvcmF3PiA8L3A+IDxhIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhLmJ1dHRvbnMgfVwiIHJvbGU9XCJidXR0b25cIiBkYXRhLWxpbms9XCJ7IHZhbC5saW5rIH1cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCd2aWRlby1kaWFsb2cnLCAnPGRpdiBpZj1cIm9wdHNcIiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgZGF0YS50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+IDxyYXcgY29udGVudD1cInsgZGF0YS50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8YSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YS5idXR0b25zIH1cIiByb2xlPVwiYnV0dG9uXCIgZGF0YS1saW5rPVwieyB2YWwubGluayB9XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDEwcHg7XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cykge1xuICAgICAgICBfdGhpcy5kYXRhID0gb3B0cy5ldmVudC5pdGVtO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1iYW5uZXInLCAnPGRpdiBjbGFzcz1cImZ1bGx3aWR0aGJhbm5lclwiPiA8ZGl2IGlkPVwidHBfYmFubmVyXCIgY2xhc3M9XCJ0cC1iYW5uZXJcIj4gPHVsPiAgPGxpIGlmPVwieyB0aXRsZSB9XCIgZWFjaD1cInsgZGF0YSB9XCIgZGF0YS10cmFuc2l0aW9uPVwiZmFkZVwiIGRhdGEtc2xvdGFtb3VudD1cIjVcIiBkYXRhLXRpdGxlPVwieyB0aXRsZSB9XCI+ICA8aW1nIGlmPVwieyBpbWcgfVwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nIH1cIiBhbHQ9XCJkYXJrYmx1cmJnXCIgZGF0YS1iZ2ZpdD1cImNvdmVyXCIgZGF0YS1iZ3Bvc2l0aW9uPVwibGVmdCB0b3BcIiBkYXRhLWJncmVwZWF0PVwibm8tcmVwZWF0XCI+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHRpdGxlLTIgc2Z0XCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIxMDBcIiBkYXRhLXNwZWVkPVwiMTAwMFwiIGRhdGEtc3RhcnQ9XCIxMDAwXCIgZGF0YS1lYXNpbmc9XCJlYXNlT3V0RXhwb1wiPiA8cmF3IGNvbnRlbnQ9XCJ7IHRpdGxlIH1cIj48L3Jhdz4gPC9kaXY+IDxkaXYgaWY9XCJ7IHN1YnRleHQgfVwiIGNsYXNzPVwiY2FwdGlvbiB0ZXh0IHNmbFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMjIwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gPHJhdyBjb250ZW50PVwieyBzdWJ0ZXh0IH1cIj48L3Jhdz4gPC9kaXY+IDxkaXYgZWFjaD1cInsgYnV0dG9ucyB9XCI+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHNmYiByZXYtYnV0dG9ucyB0cC1yZXNpemVtZVwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMzU1XCIgZGF0YS1zcGVlZD1cIjUwMFwiIGRhdGEtc3RhcnQ9XCIxODAwXCIgZGF0YS1lYXNpbmc9XCJTaW5lLmVhc2VPdXRcIj4gPGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIj57IHRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PicsICdpZD1cImJhbm5lclwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygnc2l0ZScpO1xudGhpcy5tb3VudGVkID0gZmFsc2U7XG5cbnRoaXMud2F0Y2hEYXRhKCcvYmFubmVyJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZmFsc2UgPT0gX3RoaXMubW91bnRlZCkge1xuICAgICAgICBfdGhpcy5tb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMudHBfYmFubmVyKS5yZXZvbHV0aW9uKHtcbiAgICAgICAgICAgIHN0b3BBdFNsaWRlOiAxLFxuICAgICAgICAgICAgc3RvcEFmdGVyTG9vcHM6IDAsXG4gICAgICAgICAgICBzdGFydHdpZHRoOiAxMTcwLFxuICAgICAgICAgICAgc3RhcnRoZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgIGhpZGVUaHVtYnM6IDEwLFxuICAgICAgICAgICAgLy9mdWxsV2lkdGg6IFwib25cIixcbiAgICAgICAgICAgIC8vZm9yY2VGdWxsV2lkdGg6IFwib25cIixcbiAgICAgICAgICAgIGxhenlMb2FkOiAnb24nXG4gICAgICAgICAgICAvLyBuYXZpZ2F0aW9uU3R5bGU6IFwicHJldmlldzRcIlxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy9lbHNlIHtcbiAgICAvLyAgICB0aGlzLnVubW91bnQodHJ1ZSk7XG4gICAgLy8gICAgcmlvdC5tb3VudCgncGFnZS1iYW5uZXInKTtcbiAgICAvL31cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvdW50bWVpbicsICc8c2VjdGlvbiBjbGFzcz1cImZ1bi1mYWN0LXdyYXAgZnVuLWZhY3RzLWJnXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIGZhY3RzLWluXCI+IDxoMz4gPHNwYW4gY2xhc3M9XCJjb3VudGVyXCI+ODc2LDUzOTwvc3Bhbj4rIDwvaDM+IDxoND5TeXN0ZW1zIFRoaW5rZXJzPC9oND4gPGJyPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi10aGVtZS1kYXJrXCI+Q291bnQgTWUgSW48L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZXhwbG9yZScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPiA8c3Ryb25nPnsgaGVhZGVyLnRpdGxlIH08L3N0cm9uZz4gPC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cImN1YmUtbWFzb25yeVwiPiA8ZGl2IGlkPVwiZmlsdGVyc19jb250YWluZXJcIiBjbGFzcz1cImNicC1sLWZpbHRlcnMtYWxpZ25DZW50ZXJcIj4gPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gZmlsdGVycyB9XCIgZGF0YS1maWx0ZXI9XCIueyB2YWwudGFnIH1cIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbSB7IFxcJ2NicC1maWx0ZXItaXRlbS1hY3RpdmVcXCc6IGkgPT0gMCB9XCI+IHsgdmFsLm5hbWUgfSA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cIm1hc29ucnlfY29udGFpbmVyXCIgY2xhc3M9XCJjYnBcIj4gPGRpdiBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCIgZWFjaD1cInsgY29udGVudCB9XCIgY2xhc3M9XCJjYnAtaXRlbSB7IHR5cGUgfSB7IF8ua2V5cyh0YWdzKS5qb2luKFxcJyBcXCcpIH1cIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uXCIgZGF0YS10aXRsZT1cInsgdGV4dCB9XCIgaHJlZj1cInsgbGluayB8fCBwYXJlbnQudXJsICsgdHlwZSArIFxcJy9cXCcgKyBpbWcgfVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBpZj1cInsgaW1nIH1cIiByaW90LXNyYz1cInsgcGFyZW50LnVybCArIHR5cGUgKyBcXCcvXFwnICsgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBpZj1cInsgdGl0bGUgfVwiIGNsYXNzPVwieyBcXCdjYnAtbC1jYXB0aW9uLXRpdGxlXFwnOiB0cnVlIH1cIiA+eyB0aXRsZSB9PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cIm1hc29ucnktcG9ydGZvbGlvLTQuaHRtbFwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPkV4cGxvcmUgQWxsPC9hPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG50aGlzLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgIHJpb3QubW91bnQoJ21vZGFsLWRpYWxvZycsIHsgZXZlbnQ6IGUsIHRhZzogX3RoaXMgfSk7XG59O1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2V4cGxvcmUnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuZmlsdGVycyA9IF8uc29ydEJ5KGRhdGEuZmlsdGVycywgJ29yZGVyJyk7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgIEZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvY29udGVudCcpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuY29udGVudCA9IF8uc29ydEJ5KF8udG9BcnJheShkYXRhKSwgJ29yZGVyJyk7XG4gICAgICAgIF90aGlzLmNvbnRlbnQgPSBfLnVuaW9uKF90aGlzLmNvbnRlbnQsIF90aGlzLml0ZW1zKTtcbiAgICAgICAgX3RoaXMuY29udGVudCA9IF8uZmlsdGVyKF90aGlzLmNvbnRlbnQsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gIShpdGVtLmFyY2hpdmVkID09PSB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAkKF90aGlzLm1hc29ucnlfY29udGFpbmVyKS5jdWJlcG9ydGZvbGlvKHtcbiAgICAgICAgICAgIGZpbHRlcnM6ICcjZmlsdGVyc19jb250YWluZXInLFxuICAgICAgICAgICAgbGF5b3V0TW9kZTogJ2dyaWQnLFxuICAgICAgICAgICAgZGVmYXVsdEZpbHRlcjogJy5mZWF0dXJlZCcsXG4gICAgICAgICAgICBhbmltYXRpb25UeXBlOiAnZmxpcE91dERlbGF5JyxcbiAgICAgICAgICAgIGdhcEhvcml6b250YWw6IDIwLFxuICAgICAgICAgICAgZ2FwVmVydGljYWw6IDIwLFxuICAgICAgICAgICAgZ3JpZEFkanVzdG1lbnQ6ICdyZXNwb25zaXZlJyxcbiAgICAgICAgICAgIG1lZGlhUXVlcmllczogW3tcbiAgICAgICAgICAgICAgICB3aWR0aDogMTEwMCxcbiAgICAgICAgICAgICAgICBjb2xzOiA0XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgICAgICBjb2xzOiAzXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgICAgICAgICBjb2xzOiAyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDMyMCxcbiAgICAgICAgICAgICAgICBjb2xzOiAxXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGNhcHRpb246ICdvdmVybGF5Qm90dG9tQWxvbmcnLFxuICAgICAgICAgICAgZGlzcGxheVR5cGU6ICdib3R0b21Ub1RvcCcsXG4gICAgICAgICAgICBkaXNwbGF5VHlwZVNwZWVkOiAxMDBcblxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuLy8gbGlnaHRib3hcbi8vbGlnaHRib3hEZWxlZ2F0ZTogJy5jYnAtbGlnaHRib3gnLFxuLy9saWdodGJveEdhbGxlcnk6IHRydWUsXG4vL2xpZ2h0Ym94VGl0bGVTcmM6ICdkYXRhLXRpdGxlJyxcbi8vbGlnaHRib3hDb3VudGVyOiAnPGRpdiBjbGFzcz1cImNicC1wb3B1cC1saWdodGJveC1jb3VudGVyXCI+e3tjdXJyZW50fX0gb2Yge3t0b3RhbH19PC9kaXY+Jyxcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1mb290ZXInLCAnPGZvb3RlciBpZD1cImZvb3RlclwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz57IGRhdGEuYWJvdXQudGl0bGUgfTwvaDM+IDxwPnsgZGF0YS5hYm91dC50ZXh0IH08L3A+IDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHNvY2lhbC0xXCI+IDxsaSBlYWNoPVwieyBkYXRhLmFib3V0LnNvY2lhbCB9XCI+IDxhIGhyZWY9XCJ7IGxpbmsgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+Q29udGFjdCBVczwvaDM+IDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgY29udGFjdFwiPiA8bGkgZWFjaD1cInsgZGF0YS5jb250YWN0IH1cIj4gPHA+IDxzdHJvbmc+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfTogPC9zdHJvbmc+IHsgdGV4dCB9IDwvcD4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5SZWNlbnQ8L2gzPiA8dWwgY2xhc3M9XCJsaXN0LWlubGluZSBmMi13b3JrXCI+IDxsaSBlYWNoPVwieyBkYXRhLnJlY2VudCB9XCI+IDxhIGhyZWY9XCJ7IGxpbmsgfVwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgKyBpbWcgfVwiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPk5ld3NsZXR0ZXI8L2gzPiA8cD57IGRhdGEubmV3c2xldHRlci50ZXh0IH08L3A+IDxmb3JtIHJvbGU9XCJmb3JtXCIgY2xhc3M9XCJzdWJzY3JpYmUtZm9ybVwiPiA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cIkVudGVyIGVtYWlsIHRvIHN1YnNjcmliZVwiPiA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiIHR5cGU9XCJzdWJtaXRcIj5PazwvYnV0dG9uPiA8L3NwYW4+IDwvZGl2PiA8L2Zvcm0+IDwvZGl2PiA8L2Rpdj4gIDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1jZW50ZXJcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1idG1cIj4gPHNwYW4+JmNvcHk7MjAxNSBieSBDYWJyZXJhIFJlc2VhcmNoIExhYjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZm9vdGVyPicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2Zvb3RlcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWltcGFjdCcsICc8c2VjdGlvbj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMiBpZj1cInsgaGVhZGVyIH1cIj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJsZWFkXCI+IHsgaGVhZGVyLnRleHQgfSA8L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9XCJpbXBhY3Rfc2xpZGVyXCIgY2xhc3M9XCJvd2wtY2Fyb3VzZWxcIj4gPGRpdiBjbGFzcz1cIml0ZW1cIiBlYWNoPVwieyBpdGVtcyB9XCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGltZyBpZj1cInsgaW1nIH1cIiB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMTI1cHhcIiByaW90LXNyYz1cInsgcGFyZW50LnVybCB9aW1wYWN0L3sgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9pbXBhY3QnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMuaW1wYWN0X3NsaWRlcikub3dsQ2Fyb3VzZWwoe1xuICAgICAgICAgICAgICAgIGF1dG9QbGF5OiAzMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxuICAgICAgICAgICAgICAgIGxvb3A6IHRydWUsXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5OTEsIDJdXG4gICAgICAgIH0pO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVzc2FnZScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+PHJhdyBjb250ZW50PVwieyBoZWFkZXIudGV4dCB9XCI+PC9yYXc+IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvdyBzcGVjaWFsLWZlYXR1cmVcIj4gPGRpdiBlYWNoPVwieyBpdGVtcyB9XCIgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBtYXJnaW4xMFwiPiA8ZGl2IGNsYXNzPVwicy1mZWF0dXJlLWJveCB0ZXh0LWNlbnRlciB3b3cgYW5pbWF0ZWQgZmFkZUluXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMjAwbXNcIj4gPGRpdiBjbGFzcz1cIm1hc2stdG9wXCI+ICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiAgPGg0PnsgdGl0bGUgfTwvaDQ+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibWFzay1ib3R0b21cIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gIDxwPnsgdGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuaGVhZGVyID0ge307XG50aGlzLml0ZW1zID0gW107XG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL21lc3NhZ2UnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWV0aG9kb2xvZ3knLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgY2xhc3M9XCJsZWFkXCI+eyBoZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlMzBcIj48L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoND57IGZyYW1ld29ya3MuaGVhZGVyLnRpdGxlIH08L2g0PiA8cCBjbGFzcz1cImxlYWRcIj57IGZyYW1ld29ya3MuaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJwYW5lbC1ncm91cFwiIGlkPVwiZnJhbWV3b3Jrc1wiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBmcmFtZXdvcmtzLml0ZW1zIH1cIiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj4gPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gPGg0IGNsYXNzPVwicGFuZWwtdGl0bGVcIj4gPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtcGFyZW50PVwiI2ZyYW1ld29ya3NcIiBocmVmPVwiI2NvbGxhcHNlRnJhbWV3b3Jrc197IGkgfVwiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9oND4gPC9kaXY+IDxkaXYgaWQ9XCJjb2xsYXBzZUZyYW1ld29ya3NfeyBpIH1cIiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlIHsgaW46IGkgPT0gMCB9XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+IHsgdmFsLnRleHQgfSA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoND57IHBhcnRuZXJzLmhlYWRlci50aXRsZSB9PC9oND4gPHAgY2xhc3M9XCJsZWFkXCI+eyBwYXJ0bmVycy5oZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInBhbmVsLWdyb3VwXCIgaWQ9XCJhY2NvcmRpb25cIj4gPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gcGFydG5lcnMuaXRlbXMgfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiA8aDQgY2xhc3M9XCJwYW5lbC10aXRsZVwiPiA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS1wYXJlbnQ9XCIjYWNjb3JkaW9uXCIgaHJlZj1cIiNjb2xsYXBzZU9uZV97IGkgfVwiPiB7IHZhbC50aXRsZSB9IDwvYT4gPC9oND4gPC9kaXY+IDxkaXYgaWQ9XCJjb2xsYXBzZU9uZV97IGkgfVwiIGNsYXNzPVwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgeyBpbjogaSA9PSAwIH1cIj4gPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4geyB2YWwudGV4dCB9IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbWV0aG9kb2xvZ3knKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5mcmFtZXdvcmtzID0gZGF0YS5mcmFtZXdvcmtzO1xuICAgICAgICBfdGhpcy5wYXJ0bmVycyA9IGRhdGEucGFydG5lcnM7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZW51LW5hdmJhcicsICc8ZGl2IGNsYXNzPVwibmF2YmFyLWNvbGxhcHNlIGNvbGxhcHNlXCI+IDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodFwiPiA8bGkgY2xhc3M9XCJ7IGRyb3Bkb3duOiB0cnVlLCBhY3RpdmU6IGkgPT0gMCB9XCIgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEgfVwiPiA8YSBpZj1cInsgdmFsLnRpdGxlIH1cIiBocmVmPVwiI1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPiA8aSBpZj1cInsgdmFsLmljb24gfVwiIGNsYXNzPVwieyB2YWwuaWNvbiB9XCIgPjwvaT4geyB2YWwudGl0bGUgfSA8aSBpZj1cInsgdmFsLm1lbnUgJiYgdmFsLm1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIiA+PC9pPiA8L2E+IDx1bCBpZj1cInsgdmFsLm1lbnUgJiYgdmFsLm1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgbXVsdGktbGV2ZWxcIiByb2xlPVwibWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImRyb3Bkb3duTWVudVwiPiA8bGkgZWFjaD1cInsgdmFsLm1lbnUgfVwiID4gPGEgaHJlZj1cIiNcIj4gPGkgaWY9XCJ7IGljb24gfVwiIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xudmFyIHRoYXQgPSB0aGlzO1xudGhhdC5kYXRhID0gW107XG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL25hdmJhcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGF0LmRhdGEgPSBkYXRhO1xuICAgIHRoYXQudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItc3RhdGljLXRvcCB5YW1tIHN0aWNreVwiIHJvbGU9XCJuYXZpZ2F0aW9uXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cIm5hdmJhci1oZWFkZXJcIj4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuYXZiYXItdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1jb2xsYXBzZVwiPiA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJpY29uLWJhclwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJpY29uLWJhclwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJpY29uLWJhclwiPjwvc3Bhbj4gPC9idXR0b24+IDxhIGNsYXNzPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIiNcIj4gPGltZyBpZj1cInsgZGF0YSB9XCIgaGVpZ2h0PVwiMjFweFwiIHdpZHRoPVwiMjFweFwiIHJpb3Qtc3JjPVwieyB1cmwgfXNpdGUveyBkYXRhLmltZyB9XCIgYWx0PVwieyBkYXRhLmFsdCB9XCI+IDwvYT4gPC9kaXY+IDxwYWdlLW1lbnUtbmF2YmFyPjwvcGFnZS1tZW51LW5hdmJhcj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbG9nbycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5ld3MnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGgzIGNsYXNzPVwiaGVhZGluZ1wiPkxhdGVzdCBOZXdzPC9oMz4gPGRpdiBpZD1cIm5ld3NfY2Fyb3VzZWxcIiBjbGFzcz1cIm93bC1jYXJvdXNlbCBvd2wtc3BhY2VkXCI+IDxkaXYgZWFjaD1cInsgZGF0YSB9XCI+ICAgPGRpdiBjbGFzcz1cIm5ld3MtZGVzY1wiPiA8aDU+IDxhIGhyZWY9XCJ7IGJ5ID8gbGluayA6IFxcJ2phdmFzY3JpcHQ6O1xcJyB9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+eyBIdW1hbml6ZS50cnVuY2F0ZSh0aXRsZSwgMTI1KSB9PC9hPiA8L2g1PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBbXTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9uZXdzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5kYXRhID0gXy50b0FycmF5KGRhdGEpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgJChfdGhpcy5uZXdzX2Nhcm91c2VsKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICAgICAgLy8gTW9zdCBpbXBvcnRhbnQgb3dsIGZlYXR1cmVzXG4gICAgICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICAgICAgaXRlbXNDdXN0b206IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcFNtYWxsOiBbOTgwLCAyXSxcbiAgICAgICAgICAgICAgICBpdGVtc1RhYmxldDogWzc2OCwgMl0sXG4gICAgICAgICAgICAgICAgaXRlbXNUYWJsZXRTbWFsbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXNNb2JpbGU6IFs0NzksIDFdLFxuICAgICAgICAgICAgICAgIHNpbmdsZUl0ZW06IGZhbHNlLFxuICAgICAgICAgICAgICAgIHN0YXJ0RHJhZ2dpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6IDQwMDBcbiAgICAgICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS10ZXN0aW1vbmlhbHMnLCAnPGRpdiBpZD1cInRlc3RpbW9uaWFscy1jYXJvdXNlbFwiIGNsYXNzPVwidGVzdGltb25pYWxzIHRlc3RpbW9uaWFscy12LTIgd293IGFuaW1hdGVkIGZhZGVJblVwXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMTAwbXNcIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+eyBoZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+IDxkaXYgaWQ9XCJ0ZXN0aW1vbmlhbF9zbGlkZVwiIGNsYXNzPVwidGVzdGktc2xpZGVcIj4gPHVsIGNsYXNzPVwic2xpZGVzXCI+IDxsaSBlYWNoPVwieyBpdGVtcyB9XCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgKyBpbWcgfVwiIGFsdD1cInsgdXNlciB9XCI+IDxoND4gPGkgY2xhc3M9XCJmYSBmYS1xdW90ZS1sZWZ0IGlvbi1xdW90ZVwiPjwvaT4geyB0ZXh0fSA8L2g0PiA8cCBjbGFzcz1cInRlc3QtYXV0aG9yXCI+IHsgdXNlciB9IC0gPGVtPnsgc3VidGV4dCB9PC9lbT4gPC9wPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlMzBcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCd0ZXN0aW1vbmlhbHMnKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy90ZXN0aW1vbmlhbHMnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMudGVzdGltb25pYWxfc2xpZGUpLmZsZXhzbGlkZXIoe1xuICAgICAgICAgICAgICAgIHNsaWRlc2hvd1NwZWVkOiA1MDAwLFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbk5hdjogZmFsc2UsXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnZmFkZSdcbiAgICAgICAgfSk7XG59KTtcbn0pOyJdfQ==
