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

},{"./FrontEnd":1,"./js/mixins/config.js":6,"./tags/components/modal-dialog.tag":7,"./tags/page-banner.tag":8,"./tags/page-countmein.tag":9,"./tags/page-explore.tag":10,"./tags/page-footer.tag":11,"./tags/page-impact.tag":12,"./tags/page-message.tag":13,"./tags/page-methodology.tag":14,"./tags/page-navbar-menu.tag":15,"./tags/page-navbar.tag":16,"./tags/page-news.tag":17,"./tags/page-testimonials.tag":18,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],3:[function(require,module,exports){
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
module.exports = riot.tag('modal-dialog', '<div if="{ opts }" class="modal fade" id="{ opts.id }"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-body container"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <p>One fine body&hellip;</p> </div> </div> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts) {
        $(_this.root.firstChild).modal();
    }
});
});
},{"riot":"riot"}],8:[function(require,module,exports){
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
},{"riot":"riot"}],9:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section class="fun-fact-wrap fun-facts-bg"> <div class="container"> <div class="row"> <div class="col-md-12 facts-in"> <h3> <span class="counter">876,539</span>+ </h3> <h4>Systems Thinkers</h4> <br> <a href="javascript:;" class="btn btn-lg btn-theme-dark">Count Me In</a> </div> </div> </div> </section>', function(opts) {
});
},{"riot":"riot"}],10:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-explore', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <div each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption cbp-lightbox" data-title="{ text }" href="{ link || parent.url + type + \'/\' + img }"> <div class="cbp-caption-defaultWrap"> <img if="{ img }" riot-src="{ parent.url + type + \'/\' + img }" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ buttons }" each="{ val, i in buttons }" data-link="{ val.link }" class="{ \'cbp-l-caption-title\': i == 0, \'cbp-singlePage\': i == 0, \'cbp-l-caption-buttonLeft\': i == 0, \'cbp-l-caption-title\': i == 1, \'cbp-lightbox\': i == 1, \'cbp-l-caption-buttonRight\': i == 1 }" >{ val.title }</div> <div if="{ !buttons }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </div> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="masonry-portfolio-4.html" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();
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
            displayTypeSpeed: 100,

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>'
        });
    });
});
});
},{"riot":"riot"}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p>{ data.about.text }</p> <ul class="list-inline social-1"> <li each="{ data.about.social }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Contact Us</h3> <ul class="list-unstyled contact"> <li each="{ data.contact }"> <p> <strong> <i class="{ icon }"></i> { title }: </strong> { text } </p> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Recent</h3> <ul class="list-inline f2-work"> <li each="{ data.recent }"> <a href="{ link }"> <img riot-src="{ url + img }" class="img-responsive" alt="{ title }"> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Newsletter</h3> <p>{ data.newsletter.text }</p> <form role="form" class="subscribe-form"> <div class="input-group"> <input type="text" class="form-control" placeholder="Enter email to subscribe"> <span class="input-group-btn"> <button class="btn btn-theme-dark btn-lg" type="submit">Ok</button> </span> </div> </form> </div> </div>  </div> <div class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span>&copy;2015 by Cabrera Research Lab</span> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();
FrontEnd.MetaFire.getData(FrontEnd.site + '/footer').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
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
},{"riot":"riot"}],13:[function(require,module,exports){
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
},{"riot":"riot"}],14:[function(require,module,exports){
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
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-menu-navbar', '<div class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }"> <a if="{ val.title }" href="#" class="dropdown-toggle" data-toggle="dropdown"> <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i> </a> <ul if="{ val.menu && val.menu.length }" class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu"> <li each="{ val.menu }" > <a href="#"> <i if="{ icon }" class="{ icon }"></i> <span class="title">{ title }</span> </a> </li> </ul> </li> </ul> </div>', function(opts) {
var that = this;
that.data = [];
FrontEnd.MetaFire.getData(FrontEnd.site + '/navbar').then(function (data) {
    that.data = data;
    that.update();
});
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#"> <img if="{ data }" height="21px" width="21px" riot-src="{ url }site/{ data.img }" alt="{ data.alt }"> </a> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],17:[function(require,module,exports){
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
},{"riot":"riot"}],18:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvbW9kYWwtZGlhbG9nLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtYmFubmVyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtY291bnRtZWluLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtZXhwbG9yZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWZvb3Rlci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWltcGFjdC50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW1lc3NhZ2UudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tZXRob2RvbG9neS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5hdmJhci1tZW51LnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbmF2YmFyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbmV3cy50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7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TyxHQUFHLE1BQU0sQ0FBQzs7O0FDM0J4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgTWV0YUZpcmUgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZScpO1xyXG5sZXQgQXV0aDAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9hdXRoMCcpO1xyXG5sZXQgdXNlcnNuYXAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcCcpO1xyXG5sZXQgcmlvdCA9IHdpbmRvdy5yaW90O1xyXG5cclxuY29uc3QgY29uZmlnID0gKCkgPT4ge1xyXG4gICAgY29uc3QgU0lURVMgPSB7XHJcbiAgICAgICAgQ1JMOiB7XHJcbiAgICAgICAgICAgIGZyb250RW5kOiAnY3JsYWInLFxyXG4gICAgICAgICAgICBkYjogJ3BvcHBpbmctZmlyZS04OTcnLFxyXG4gICAgICAgICAgICBtZXRhTWFwVXJsOiAnJyxcclxuICAgICAgICAgICAgdGl0bGU6ICdDYWJyZXJhIFJlc2VhcmNoIExhYicsXHJcbiAgICAgICAgICAgIGZhdmljbzogJ2Zyb250ZW5kL2Rpc3QvaW1nL2ljby9mYXZpY29uLmljbydcclxuICAgICAgICB9LFxyXG4gICAgICAgIFRISU5LX1dBVEVSOiB7XHJcbiAgICAgICAgICAgIGZyb250RW5kOiAndGhpbmt3YXRlcicsXHJcbiAgICAgICAgICAgIGRiOiAncG9wcGluZy1maXJlLTg5NycsXHJcbiAgICAgICAgICAgIG1ldGFNYXBVcmw6ICcnLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1RoaW5rV2F0ZXInLFxyXG4gICAgICAgICAgICBmYXZpY286ICdmcm9udGVuZC9kaXN0L2ltZy9pY28vZmF2aWNvbi5pY28nXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJldCA9IHtcclxuICAgICAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxuICAgICAgICBzaXRlOiB7fVxyXG4gICAgfVxyXG4gICAgbGV0IHNlZ21lbnRzID0gcmV0Lmhvc3Quc3BsaXQoJy4nKTtcclxuICAgIGxldCBmaXJzdCA9IHNlZ21lbnRzWzBdO1xyXG4gICAgaWYgKGZpcnN0ID09PSAnd3d3Jykge1xyXG4gICAgICAgIGZpcnN0ID0gc2VnbWVudHNbMV07XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKGZpcnN0LnRvTG93ZXJDYXNlKCkpIHtcclxuICAgIGNhc2UgJ21ldGEtbWFwLXN0YWdpbmcnOlxyXG4gICAgY2FzZSAnZnJvbnRlbmQnOlxyXG4gICAgICAgIHJldC5zaXRlID0gU0lURVNbJ0NSTCddO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAndGhpbmt3YXRlci1zdGFnaW5nJzpcclxuICAgIGNhc2UgJ3RoaW5rd2F0ZXInOlxyXG4gICAgICAgIHJldC5zaXRlID0gU0lURVNbJ1RISU5LX1dBVEVSJ107XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vRm9yIG5vdywgZGVmYXVsdCB0byBDUkxcclxuICAgICAgICByZXQuc2l0ZSA9IFNJVEVTWydDUkwnXTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QuZnJlZXplKHJldCk7XHJcbiAgICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuY2xhc3MgRnJvbnRFbmQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ3MpIHtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy5jb25maWcuc2l0ZS50aXRsZTtcclxuICAgICAgICBsZXQgZmF2aWNvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdmljbycpO1xyXG4gICAgICAgIGZhdmljby5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgLy9jNjhmNzk4MWE4YmJlOTI2YTFlMDE1NGNiZmJkNWFmMWI0ZGYwZjIxLmdvb2dsZWRyaXZlLmNvbS9ob3N0LzBCNkdBTjRnWDFiblNmbFJuZFRSSmVGWjVORXN6U0VGbFN6VktaRFpKU3pGeGVEZGljRnBvTFhWd1NETkZSV04wUkZoZlMyYy8ke3RoaXMuY29uZmlnLnNpdGUuZnJvbnRFbmR9L2Zhdmljb24uaWNvYCk7XHJcblxyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAodGhpcy5jb25maWcpO1xyXG4gICAgICAgIHVzZXJzbmFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnNpdGUuZnJvbnRFbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICAvL18uZWFjaCh0aGlzLnRhZ3MsICh0YWcpID0+IHtcclxuICAgICAgICAvLyAgICByaW90Lm1vdW50KHRhZywgdGhpcyk7XHJcbiAgICAgICAgLy99KTtcclxuICAgICAgICByaW90Lm1vdW50KCcqJyk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9naW4oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ291dCgpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9nb3V0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRnJvbnRFbmQ7IiwicmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxucmVxdWlyZSgnY29yZS1qcycpO1xyXG53aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcclxucmVxdWlyZSgnanF1ZXJ5LXVpJyk7XHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xyXG53aW5kb3cuRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xyXG53aW5kb3cuSHVtYW5pemUgPSByZXF1aXJlKCdodW1hbml6ZS1wbHVzJyk7XHJcbndpbmRvdy5tb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxud2luZG93LlVSSSA9IHJlcXVpcmUoJ1VSSWpzJyk7XHJcbndpbmRvdy5sb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJyk7XHJcblxyXG5sZXQgdGFncyA9IFtcclxuICAgICdwYWdlLWhlYWQnLFxyXG4gICAgJ3BhZ2UtYmFubmVyJyxcclxuICAgICdwYWdlLWltcGFjdCcsXHJcbiAgICAncGFnZS1jb3VudG1laW4nLFxyXG4gICAgJ3BhZ2UtZm9vdGVyJyxcclxuICAgICdwYWdlLW5hdmJhci1tZW51JyxcclxuICAgICdwYWdlLW5hdmJhcicsXHJcbiAgICAncGFnZS1uZXdzJyxcclxuICAgICdwYWdlLWV4cGxvcmUnLFxyXG4gICAgJ3BhZ2UtbWVzc2FnZScsXHJcbiAgICAncGFnZS1tZXRob2RvbG9neScsXHJcbiAgICAncGFnZS10ZXN0aW1vbmlhbHMnXHJcbl07XHJcblxyXG5yZXF1aXJlKCcuL3RhZ3MvY29tcG9uZW50cy9tb2RhbC1kaWFsb2cudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWJhbm5lci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtaW1wYWN0LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1jb3VudG1laW4udGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWZvb3Rlci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLW1lbnUudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmV3cy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZXhwbG9yZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWVzc2FnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWcnKTtcclxuXHJcbnZhciBjb25maWdNaXhpbiA9IHJlcXVpcmUoJy4vanMvbWl4aW5zL2NvbmZpZy5qcycpO1xyXG5yaW90Lm1peGluKCdjb25maWcnLCBjb25maWdNaXhpbik7XHJcblxyXG5yaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7XHJcblxyXG52YXIgRnJvbnRFbmQgPSByZXF1aXJlKCcuL0Zyb250RW5kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IEZyb250RW5kKHRhZ3MpOyIsImxldCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJyk7XHJcbmxldCBQcm9taXNlID0gd2luZG93LlByb21pc2U7XHJcbmxldCBsb2NhbGZvcmFnZSA9IHdpbmRvdy5sb2NhbGZvcmFnZTtcclxuXHJcbmNsYXNzIEF1dGgwIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmNhbGxiYWNrVVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgdGhpcy5sb2NrID0gbmV3IEF1dGgwTG9jaygnd3NPbmFydDIzeVZpSVNocVQ0d2ZKMTh3MnZ0MmNsMzInLCAnbWV0YW1hcC5hdXRoMC5jb20nKTtcclxuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoYXQuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgcHJvZmlsZSwgaWRfdG9rZW4sIGN0b2tlbiwgb3B0LCByZWZyZXNoX3Rva2VuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnaWRfdG9rZW4nLCBpZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnByb2ZpbGUgPSBwcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbGlua0FjY291bnQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcclxuICAgICAgICAgICAgY2FsbGJhY2tVUkw6IHRoYXQuY2FsbGJhY2tVUkwsXHJcbiAgICAgICAgICAgIGRpY3Q6IHtcclxuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGluayB3aXRoIGFub3RoZXIgYWNjb3VudCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXV0aFBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGF0LmlkX3Rva2VuIHx8IHRoYXQucHJvZmlsZS5pZGVudGl0aWVzWzBdLmFjY2Vzc190b2tlblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2Vzc2lvbigpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGdldFByb2ZpbGUgPSAoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhhdC5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIGZ1bmN0aW9uKGVyciwgcHJvZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pZF90b2tlbiA9IGlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlLCBpZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZ1bGZpbGxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdyZWZyZXNoX3Rva2VuJykudGhlbigodG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVmcmVzaF90b2tlbiA9IHRva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQubG9jay5nZXRDbGllbnQoKS5yZWZyZXNoVG9rZW4odG9rZW4sIChhLCB0b2tPYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvZmlsZSh0b2tPYmouaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKGlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpO1xyXG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3JlZnJlc2hfdG9rZW4nKTtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XHJcbiAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcclxuXHJcblxyXG4iLCJsZXQgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xyXG5sZXQgUHJvbWlzZSA9IHdpbmRvdy5Qcm9taXNlO1xyXG5sZXQgbG9jYWxmb3JhZ2UgPSB3aW5kb3cubG9jYWxmb3JhZ2U7XHJcbmxldCBNZXRhTWFwID0gd2luZG93Lk1ldGFNYXA7XHJcblxyXG5jbGFzcyBNZXRhRmlyZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoYGh0dHBzOi8vJHt0aGlzLmNvbmZpZy5zaXRlLmRifS5maXJlYmFzZWlvLmNvbWApO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgcmV0ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdpZF90b2tlbicpLnRoZW4oKGlkX3Rva2VuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHByb2ZpbGUuY2xpZW50SUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBpZF90b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcclxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBkZWxlZ2F0aW9uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZmlyZWJhc2VfdG9rZW4gPSBkZWxlZ2F0aW9uUmVzdWx0LmlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoYXQuZmlyZWJhc2VfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZiLmF1dGhXaXRoQ3VzdG9tVG9rZW4odGhhdC5maXJlYmFzZV90b2tlbiwgKGVycm9yLCBhdXRoRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChhdXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoaWxkKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhIChwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY2hpbGQub24oJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgIChzbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc25hcHNob3QudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBvbiAocGF0aCwgY2FsbGJhY2ssIGV2ZW50ID0gJ3ZhbHVlJyApIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICBjaGlsZC5vbihldmVudCwgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhzbmFwc2hvdC52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhIChkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0ICgpIHtcclxuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiXHJcbnZhciB1c2VyU25hcCA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXkgPSAnMDMyYmFmODctODU0NS00ZWJjLWE1NTctOTM0ODU5MzcxZmE1LmpzJywgcywgeDtcclxuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYXBpS2V5ID0gY29uZmlnLlVTRVJfU05BUF9BUElfS0VZO1xyXG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0ge1xyXG4gICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU25hcC5zZXRFbWFpbEJveChEb2MuYXBwLnVzZXIudXNlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgcy5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xyXG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgIHJldHVybiB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcclxuXHJcblxyXG4iLCJcclxubGV0IGNvbmZpZyA9IHtcclxuICAgIHBhdGhJbWc6IChmb2xkZXIpID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gYC8vYzY4Zjc5ODFhOGJiZTkyNmExZTAxNTRjYmZiZDVhZjFiNGRmMGYyMS5nb29nbGVkcml2ZS5jb20vaG9zdC8wQjZHQU40Z1gxYm5TZmxSbmRUUkplRlo1TkVzelNFRmxTelZLWkRaSlN6RnhlRGRpY0Zwb0xYVndTRE5GUldOMFJGaGZTMmMvJHt3aW5kb3cuRnJvbnRFbmQuc2l0ZX0vYDtcclxuICAgICAgICBpZiAoZm9sZGVyKSB7XHJcbiAgICAgICAgICAgIHJldCArPSBgJHtmb2xkZXJ9L2A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0YTogKHBhdGgsIGNhbGxiYWNrLCB0aGF0KSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhhdC5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHdhdGNoRGF0YTogKHBhdGgsIGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgd2luZG93LkZyb250RW5kLk1ldGFGaXJlLm9uKGAke3dpbmRvdy5Gcm9udEVuZC5zaXRlfS8ke3BhdGh9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtb2RhbC1kaWFsb2cnLCAnPGRpdiBpZj1cInsgb3B0cyB9XCIgY2xhc3M9XCJtb2RhbCBmYWRlXCIgaWQ9XCJ7IG9wdHMuaWQgfVwiPiA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nIG1vZGFsLWxnXCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+IDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IGNvbnRhaW5lclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj4gPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj4gPC9idXR0b24+IDxwPk9uZSBmaW5lIGJvZHkmaGVsbGlwOzwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAgICQoX3RoaXMucm9vdC5maXJzdENoaWxkKS5tb2RhbCgpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWJhbm5lcicsICc8ZGl2IGNsYXNzPVwiZnVsbHdpZHRoYmFubmVyXCI+IDxkaXYgaWQ9XCJ0cF9iYW5uZXJcIiBjbGFzcz1cInRwLWJhbm5lclwiPiA8dWw+ICA8bGkgaWY9XCJ7IHRpdGxlIH1cIiBlYWNoPVwieyBkYXRhIH1cIiBkYXRhLXRyYW5zaXRpb249XCJmYWRlXCIgZGF0YS1zbG90YW1vdW50PVwiNVwiIGRhdGEtdGl0bGU9XCJ7IHRpdGxlIH1cIj4gIDxpbWcgaWY9XCJ7IGltZyB9XCIgcmlvdC1zcmM9XCJ7IHBhcmVudC51cmwgKyBpbWcgfVwiIGFsdD1cImRhcmtibHVyYmdcIiBkYXRhLWJnZml0PVwiY292ZXJcIiBkYXRhLWJncG9zaXRpb249XCJsZWZ0IHRvcFwiIGRhdGEtYmdyZXBlYXQ9XCJuby1yZXBlYXRcIj4gPGRpdiBjbGFzcz1cImNhcHRpb24gdGl0bGUtMiBzZnRcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjEwMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjEwMDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IDxyYXcgY29udGVudD1cInsgdGl0bGUgfVwiPjwvcmF3PiA8L2Rpdj4gPGRpdiBpZj1cInsgc3VidGV4dCB9XCIgY2xhc3M9XCJjYXB0aW9uIHRleHQgc2ZsXCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIyMjBcIiBkYXRhLXNwZWVkPVwiMTAwMFwiIGRhdGEtc3RhcnQ9XCIxODAwXCIgZGF0YS1lYXNpbmc9XCJlYXNlT3V0RXhwb1wiPiA8cmF3IGNvbnRlbnQ9XCJ7IHN1YnRleHQgfVwiPjwvcmF3PiA8L2Rpdj4gPGRpdiBlYWNoPVwieyBidXR0b25zIH1cIj4gPGRpdiBjbGFzcz1cImNhcHRpb24gc2ZiIHJldi1idXR0b25zIHRwLXJlc2l6ZW1lXCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIzNTVcIiBkYXRhLXNwZWVkPVwiNTAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cIlNpbmUuZWFzZU91dFwiPiA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPnsgdGl0bGUgfTwvYT4gPC9kaXY+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+JywgJ2lkPVwiYmFubmVyXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5kYXRhID0gW107XG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCdzaXRlJyk7XG50aGlzLm1vdW50ZWQgPSBmYWxzZTtcblxudGhpcy53YXRjaERhdGEoJy9iYW5uZXInLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmIChmYWxzZSA9PSBfdGhpcy5tb3VudGVkKSB7XG4gICAgICAgIF90aGlzLm1vdW50ZWQgPSB0cnVlO1xuICAgICAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy50cF9iYW5uZXIpLnJldm9sdXRpb24oe1xuICAgICAgICAgICAgc3RvcEF0U2xpZGU6IDEsXG4gICAgICAgICAgICBzdG9wQWZ0ZXJMb29wczogMCxcbiAgICAgICAgICAgIHN0YXJ0d2lkdGg6IDExNzAsXG4gICAgICAgICAgICBzdGFydGhlaWdodDogNjAwLFxuICAgICAgICAgICAgaGlkZVRodW1iczogMTAsXG4gICAgICAgICAgICAvL2Z1bGxXaWR0aDogXCJvblwiLFxuICAgICAgICAgICAgLy9mb3JjZUZ1bGxXaWR0aDogXCJvblwiLFxuICAgICAgICAgICAgbGF6eUxvYWQ6ICdvbidcbiAgICAgICAgICAgIC8vIG5hdmlnYXRpb25TdHlsZTogXCJwcmV2aWV3NFwiXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvL2Vsc2Uge1xuICAgIC8vICAgIHRoaXMudW5tb3VudCh0cnVlKTtcbiAgICAvLyAgICByaW90Lm1vdW50KCdwYWdlLWJhbm5lcicpO1xuICAgIC8vfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY291bnRtZWluJywgJzxzZWN0aW9uIGNsYXNzPVwiZnVuLWZhY3Qtd3JhcCBmdW4tZmFjdHMtYmdcIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgZmFjdHMtaW5cIj4gPGgzPiA8c3BhbiBjbGFzcz1cImNvdW50ZXJcIj44NzYsNTM5PC9zcGFuPisgPC9oMz4gPGg0PlN5c3RlbXMgVGhpbmtlcnM8L2g0PiA8YnI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIj5Db3VudCBNZSBJbjwvYT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9zZWN0aW9uPicsIGZ1bmN0aW9uKG9wdHMpIHtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1leHBsb3JlJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+IDxzdHJvbmc+eyBoZWFkZXIudGl0bGUgfTwvc3Ryb25nPiA8L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwiY3ViZS1tYXNvbnJ5XCI+IDxkaXYgaWQ9XCJmaWx0ZXJzX2NvbnRhaW5lclwiIGNsYXNzPVwiY2JwLWwtZmlsdGVycy1hbGlnbkNlbnRlclwiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBmaWx0ZXJzIH1cIiBkYXRhLWZpbHRlcj1cIi57IHZhbC50YWcgfVwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtIHsgXFwnY2JwLWZpbHRlci1pdGVtLWFjdGl2ZVxcJzogaSA9PSAwIH1cIj4geyB2YWwubmFtZSB9IDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwibWFzb25yeV9jb250YWluZXJcIiBjbGFzcz1cImNicFwiPiA8ZGl2IGVhY2g9XCJ7IGNvbnRlbnQgfVwiIGNsYXNzPVwiY2JwLWl0ZW0geyB0eXBlIH0geyBfLmtleXModGFncykuam9pbihcXCcgXFwnKSB9XCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwieyB0ZXh0IH1cIiBocmVmPVwieyBsaW5rIHx8IHBhcmVudC51cmwgKyB0eXBlICsgXFwnL1xcJyArIGltZyB9XCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIGlmPVwieyBpbWcgfVwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgdHlwZSArIFxcJy9cXCcgKyBpbWcgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGlmPVwieyBidXR0b25zIH1cIiBlYWNoPVwieyB2YWwsIGkgaW4gYnV0dG9ucyB9XCIgZGF0YS1saW5rPVwieyB2YWwubGluayB9XCIgY2xhc3M9XCJ7IFxcJ2NicC1sLWNhcHRpb24tdGl0bGVcXCc6IGkgPT0gMCwgXFwnY2JwLXNpbmdsZVBhZ2VcXCc6IGkgPT0gMCwgXFwnY2JwLWwtY2FwdGlvbi1idXR0b25MZWZ0XFwnOiBpID09IDAsIFxcJ2NicC1sLWNhcHRpb24tdGl0bGVcXCc6IGkgPT0gMSwgXFwnY2JwLWxpZ2h0Ym94XFwnOiBpID09IDEsIFxcJ2NicC1sLWNhcHRpb24tYnV0dG9uUmlnaHRcXCc6IGkgPT0gMSB9XCIgPnsgdmFsLnRpdGxlIH08L2Rpdj4gPGRpdiBpZj1cInsgIWJ1dHRvbnMgfVwiIGNsYXNzPVwieyBcXCdjYnAtbC1jYXB0aW9uLXRpdGxlXFwnOiB0cnVlIH1cIiA+eyB0aXRsZSB9PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cIm1hc29ucnktcG9ydGZvbGlvLTQuaHRtbFwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPkV4cGxvcmUgQWxsPC9hPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9leHBsb3JlJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmZpbHRlcnMgPSBfLnNvcnRCeShkYXRhLmZpbHRlcnMsICdvcmRlcicpO1xuICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2NvbnRlbnQnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmNvbnRlbnQgPSBfLnNvcnRCeShfLnRvQXJyYXkoZGF0YSksICdvcmRlcicpO1xuICAgICAgICBfdGhpcy5jb250ZW50ID0gXy51bmlvbihfdGhpcy5jb250ZW50LCBfdGhpcy5pdGVtcyk7XG4gICAgICAgIF90aGlzLmNvbnRlbnQgPSBfLmZpbHRlcihfdGhpcy5jb250ZW50LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuICEoaXRlbS5hcmNoaXZlZCA9PT0gdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgJChfdGhpcy5tYXNvbnJ5X2NvbnRhaW5lcikuY3ViZXBvcnRmb2xpbyh7XG4gICAgICAgICAgICBmaWx0ZXJzOiAnI2ZpbHRlcnNfY29udGFpbmVyJyxcbiAgICAgICAgICAgIGxheW91dE1vZGU6ICdncmlkJyxcbiAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXI6ICcuZmVhdHVyZWQnLFxuICAgICAgICAgICAgYW5pbWF0aW9uVHlwZTogJ2ZsaXBPdXREZWxheScsXG4gICAgICAgICAgICBnYXBIb3Jpem9udGFsOiAyMCxcbiAgICAgICAgICAgIGdhcFZlcnRpY2FsOiAyMCxcbiAgICAgICAgICAgIGdyaWRBZGp1c3RtZW50OiAncmVzcG9uc2l2ZScsXG4gICAgICAgICAgICBtZWRpYVF1ZXJpZXM6IFt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDExMDAsXG4gICAgICAgICAgICAgICAgY29sczogNFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgICAgICAgICAgY29sczogM1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICAgICAgY29sczogMlxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAzMjAsXG4gICAgICAgICAgICAgICAgY29sczogMVxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBjYXB0aW9uOiAnb3ZlcmxheUJvdHRvbUFsb25nJyxcbiAgICAgICAgICAgIGRpc3BsYXlUeXBlOiAnYm90dG9tVG9Ub3AnLFxuICAgICAgICAgICAgZGlzcGxheVR5cGVTcGVlZDogMTAwLFxuXG4gICAgICAgICAgICAvLyBsaWdodGJveFxuICAgICAgICAgICAgbGlnaHRib3hEZWxlZ2F0ZTogJy5jYnAtbGlnaHRib3gnLFxuICAgICAgICAgICAgbGlnaHRib3hHYWxsZXJ5OiB0cnVlLFxuICAgICAgICAgICAgbGlnaHRib3hUaXRsZVNyYzogJ2RhdGEtdGl0bGUnLFxuICAgICAgICAgICAgbGlnaHRib3hDb3VudGVyOiAnPGRpdiBjbGFzcz1cImNicC1wb3B1cC1saWdodGJveC1jb3VudGVyXCI+e3tjdXJyZW50fX0gb2Yge3t0b3RhbH19PC9kaXY+J1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsICc8Zm9vdGVyIGlkPVwiZm9vdGVyXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPnsgZGF0YS5hYm91dC50aXRsZSB9PC9oMz4gPHA+eyBkYXRhLmFib3V0LnRleHQgfTwvcD4gPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgc29jaWFsLTFcIj4gPGxpIGVhY2g9XCJ7IGRhdGEuYWJvdXQuc29jaWFsIH1cIj4gPGEgaHJlZj1cInsgbGluayB9XCIgYWx0PVwieyB0aXRsZSB9XCI+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDwvYT4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5Db250YWN0IFVzPC9oMz4gPHVsIGNsYXNzPVwibGlzdC11bnN0eWxlZCBjb250YWN0XCI+IDxsaSBlYWNoPVwieyBkYXRhLmNvbnRhY3QgfVwiPiA8cD4gPHN0cm9uZz4gPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9OiA8L3N0cm9uZz4geyB0ZXh0IH0gPC9wPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPlJlY2VudDwvaDM+IDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIGYyLXdvcmtcIj4gPGxpIGVhY2g9XCJ7IGRhdGEucmVjZW50IH1cIj4gPGEgaHJlZj1cInsgbGluayB9XCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCArIGltZyB9XCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+TmV3c2xldHRlcjwvaDM+IDxwPnsgZGF0YS5uZXdzbGV0dGVyLnRleHQgfTwvcD4gPGZvcm0gcm9sZT1cImZvcm1cIiBjbGFzcz1cInN1YnNjcmliZS1mb3JtXCI+IDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgZW1haWwgdG8gc3Vic2NyaWJlXCI+IDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+IDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXRoZW1lLWRhcmsgYnRuLWxnXCIgdHlwZT1cInN1Ym1pdFwiPk9rPC9idXR0b24+IDwvc3Bhbj4gPC9kaXY+IDwvZm9ybT4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWJ0bVwiPiA8c3Bhbj4mY29weTsyMDE1IGJ5IENhYnJlcmEgUmVzZWFyY2ggTGFiPC9zcGFuPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9mb290ZXI+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZm9vdGVyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtaW1wYWN0JywgJzxzZWN0aW9uPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyIGlmPVwieyBoZWFkZXIgfVwiPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cCBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImxlYWRcIj4geyBoZWFkZXIudGV4dCB9IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cImltcGFjdF9zbGlkZXJcIiBjbGFzcz1cIm93bC1jYXJvdXNlbFwiPiA8ZGl2IGNsYXNzPVwiaXRlbVwiIGVhY2g9XCJ7IGl0ZW1zIH1cIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aW1nIGlmPVwieyBpbWcgfVwiIHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIxMjVweFwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsIH1pbXBhY3QveyBpbWcgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2ltcGFjdCcpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy5pbXBhY3Rfc2xpZGVyKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6IDMwMDAsXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpdGVtc0Rlc2t0b3A6IFsxMTk5LCA0XSxcbiAgICAgICAgICAgICAgICBpdGVtc0Rlc2t0b3BTbWFsbDogWzk5MSwgMl1cbiAgICAgICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZXNzYWdlJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIFwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD48cmF3IGNvbnRlbnQ9XCJ7IGhlYWRlci50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93IHNwZWNpYWwtZmVhdHVyZVwiPiA8ZGl2IGVhY2g9XCJ7IGl0ZW1zIH1cIiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS00IG1hcmdpbjEwXCI+IDxkaXYgY2xhc3M9XCJzLWZlYXR1cmUtYm94IHRleHQtY2VudGVyIHdvdyBhbmltYXRlZCBmYWRlSW5cIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIyMDBtc1wiPiA8ZGl2IGNsYXNzPVwibWFzay10b3BcIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gPC9kaXY+IDxkaXYgY2xhc3M9XCJtYXNrLWJvdHRvbVwiPiAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gIDxoND57IHRpdGxlIH08L2g0PiAgPHA+eyB0ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5oZWFkZXIgPSB7fTtcbnRoaXMuaXRlbXMgPSBbXTtcbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbWVzc2FnZScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICBfdGhpcy5pdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgX3RoaXMudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1tZXRob2RvbG9neScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cCBjbGFzcz1cImxlYWRcIj57IGhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGg0PnsgZnJhbWV3b3Jrcy5oZWFkZXIudGl0bGUgfTwvaDQ+IDxwIGNsYXNzPVwibGVhZFwiPnsgZnJhbWV3b3Jrcy5oZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInBhbmVsLWdyb3VwXCIgaWQ9XCJmcmFtZXdvcmtzXCI+IDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIGZyYW1ld29ya3MuaXRlbXMgfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiA8aDQgY2xhc3M9XCJwYW5lbC10aXRsZVwiPiA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS1wYXJlbnQ9XCIjZnJhbWV3b3Jrc1wiIGhyZWY9XCIjY29sbGFwc2VGcmFtZXdvcmtzX3sgaSB9XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2g0PiA8L2Rpdj4gPGRpdiBpZD1cImNvbGxhcHNlRnJhbWV3b3Jrc197IGkgfVwiIGNsYXNzPVwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgeyBpbjogaSA9PSAwIH1cIj4gPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4geyB2YWwudGV4dCB9IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGg0PnsgcGFydG5lcnMuaGVhZGVyLnRpdGxlIH08L2g0PiA8cCBjbGFzcz1cImxlYWRcIj57IHBhcnRuZXJzLmhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicGFuZWwtZ3JvdXBcIiBpZD1cImFjY29yZGlvblwiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBwYXJ0bmVycy5pdGVtcyB9XCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+IDxoNCBjbGFzcz1cInBhbmVsLXRpdGxlXCI+IDxhIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXBhcmVudD1cIiNhY2NvcmRpb25cIiBocmVmPVwiI2NvbGxhcHNlT25lX3sgaSB9XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2g0PiA8L2Rpdj4gPGRpdiBpZD1cImNvbGxhcHNlT25lX3sgaSB9XCIgY2xhc3M9XCJwYW5lbC1jb2xsYXBzZSBjb2xsYXBzZSB7IGluOiBpID09IDAgfVwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPiB7IHZhbC50ZXh0IH0gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9tZXRob2RvbG9neScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLmZyYW1ld29ya3MgPSBkYXRhLmZyYW1ld29ya3M7XG4gICAgICAgIF90aGlzLnBhcnRuZXJzID0gZGF0YS5wYXJ0bmVycztcblxuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1lbnUtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIj4gPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+IDxsaSBjbGFzcz1cInsgZHJvcGRvd246IHRydWUsIGFjdGl2ZTogaSA9PSAwIH1cIiBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YSB9XCI+IDxhIGlmPVwieyB2YWwudGl0bGUgfVwiIGhyZWY9XCIjXCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+IDxpIGlmPVwieyB2YWwuaWNvbiB9XCIgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIiA+PC9pPiB7IHZhbC50aXRsZSB9IDxpIGlmPVwieyB2YWwubWVudSAmJiB2YWwubWVudS5sZW5ndGggfVwiIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiID48L2k+IDwvYT4gPHVsIGlmPVwieyB2YWwubWVudSAmJiB2YWwubWVudS5sZW5ndGggfVwiIGNsYXNzPVwiZHJvcGRvd24tbWVudSBtdWx0aS1sZXZlbFwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZHJvcGRvd25NZW51XCI+IDxsaSBlYWNoPVwieyB2YWwubWVudSB9XCIgPiA8YSBocmVmPVwiI1wiPiA8aSBpZj1cInsgaWNvbiB9XCIgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj4gPC9hPiA8L2xpPiA8L3VsPiA8L2xpPiA8L3VsPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG52YXIgdGhhdCA9IHRoaXM7XG50aGF0LmRhdGEgPSBbXTtcbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbmF2YmFyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoYXQuZGF0YSA9IGRhdGE7XG4gICAgdGhhdC51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5hdmJhcicsICc8ZGl2IGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1zdGF0aWMtdG9wIHlhbW0gc3RpY2t5XCIgcm9sZT1cIm5hdmlnYXRpb25cIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwibmF2YmFyLWhlYWRlclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5hdmJhci10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+IDxzcGFuIGNsYXNzPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8L2J1dHRvbj4gPGEgY2xhc3M9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiI1wiPiA8aW1nIGlmPVwieyBkYXRhIH1cIiBoZWlnaHQ9XCIyMXB4XCIgd2lkdGg9XCIyMXB4XCIgcmlvdC1zcmM9XCJ7IHVybCB9c2l0ZS97IGRhdGEuaW1nIH1cIiBhbHQ9XCJ7IGRhdGEuYWx0IH1cIj4gPC9hPiA8L2Rpdj4gPHBhZ2UtbWVudS1uYXZiYXI+PC9wYWdlLW1lbnUtbmF2YmFyPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9sb2dvJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmV3cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8aDMgY2xhc3M9XCJoZWFkaW5nXCI+TGF0ZXN0IE5ld3M8L2gzPiA8ZGl2IGlkPVwibmV3c19jYXJvdXNlbFwiIGNsYXNzPVwib3dsLWNhcm91c2VsIG93bC1zcGFjZWRcIj4gPGRpdiBlYWNoPVwieyBkYXRhIH1cIj4gICA8ZGl2IGNsYXNzPVwibmV3cy1kZXNjXCI+IDxoNT4gPGEgaHJlZj1cInsgYnkgPyBsaW5rIDogXFwnamF2YXNjcmlwdDo7XFwnIH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj57IEh1bWFuaXplLnRydW5jYXRlKHRpdGxlLCAxMjUpIH08L2E+IDwvaDU+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL25ld3MnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBfLnRvQXJyYXkoZGF0YSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAkKF90aGlzLm5ld3NfY2Fyb3VzZWwpLm93bENhcm91c2VsKHtcbiAgICAgICAgICAgICAgICAvLyBNb3N0IGltcG9ydGFudCBvd2wgZmVhdHVyZXNcbiAgICAgICAgICAgICAgICBpdGVtczogNCxcbiAgICAgICAgICAgICAgICBpdGVtc0N1c3RvbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wOiBbMTE5OSwgNF0sXG4gICAgICAgICAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5ODAsIDJdLFxuICAgICAgICAgICAgICAgIGl0ZW1zVGFibGV0OiBbNzY4LCAyXSxcbiAgICAgICAgICAgICAgICBpdGVtc1RhYmxldFNtYWxsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpdGVtc01vYmlsZTogWzQ3OSwgMV0sXG4gICAgICAgICAgICAgICAgc2luZ2xlSXRlbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3RhcnREcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhdXRvUGxheTogNDAwMFxuICAgICAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRlc3RpbW9uaWFscycsICc8ZGl2IGlkPVwidGVzdGltb25pYWxzLWNhcm91c2VsXCIgY2xhc3M9XCJ0ZXN0aW1vbmlhbHMgdGVzdGltb25pYWxzLXYtMiB3b3cgYW5pbWF0ZWQgZmFkZUluVXBcIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIxMDBtc1wiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD57IGhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBpZD1cInRlc3RpbW9uaWFsX3NsaWRlXCIgY2xhc3M9XCJ0ZXN0aS1zbGlkZVwiPiA8dWwgY2xhc3M9XCJzbGlkZXNcIj4gPGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj4gPGltZyByaW90LXNyYz1cInsgcGFyZW50LnVybCArIGltZyB9XCIgYWx0PVwieyB1c2VyIH1cIj4gPGg0PiA8aSBjbGFzcz1cImZhIGZhLXF1b3RlLWxlZnQgaW9uLXF1b3RlXCI+PC9pPiB7IHRleHR9IDwvaDQ+IDxwIGNsYXNzPVwidGVzdC1hdXRob3JcIj4geyB1c2VyIH0gLSA8ZW0+eyBzdWJ0ZXh0IH08L2VtPiA8L3A+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3Rlc3RpbW9uaWFscycpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3Rlc3RpbW9uaWFscycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy50ZXN0aW1vbmlhbF9zbGlkZSkuZmxleHNsaWRlcih7XG4gICAgICAgICAgICAgICAgc2xpZGVzaG93U3BlZWQ6IDUwMDAsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uTmF2OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdmYWRlJ1xuICAgICAgICB9KTtcbn0pO1xufSk7Il19
