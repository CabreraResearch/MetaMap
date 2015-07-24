(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FrontEnd = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var usersnap = require('./js/integrations/usersnap');
var riot = window.riot;
var Router = require('./js/core/Router');
var ga = require('./js/integrations/google.js');
var twitter = require('./js/integrations/twitter.js');
var facebook = require('./js/integrations/facebook.js');
var addThis = require('./js/integrations/addthis.js');

var config = function config() {
    var SITES = {
        CRL: {
            db: 'meta-map-production'
        },
        THINK_WATER: {
            db: 'thinkwater-production'
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
        case 'crlab':
        case 'meta-map-staging':
        case 'frontend':
            ret.site = SITES['CRL'];
            break;
        case 'thinkwater-production':
        case 'thinkwater-staging':
        case 'thinkwater':
            ret.site = SITES['THINK_WATER'];
            break;
        default:
            //For now, default to CRL
            ret.site = SITES['CRL'];
            break;
    }

    return ret;
};

var FrontEnd = (function () {
    function FrontEnd(tags) {
        _classCallCheck(this, FrontEnd);

        this.tags = tags;
        this.config = config();

        this.MetaFire = new MetaFire(this.config);
        this.socialFeatures = [];
    }

    _createClass(FrontEnd, [{
        key: 'initSocial',
        value: function initSocial() {
            _.each(this.socialFeatures, function (feature) {
                if (feature) feature();
            });
        }
    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            this.MetaFire.on('config', function (data) {
                _.extend(_this.config.site, data);
                document.title = _this.config.site.title;
                var favico = document.getElementById('favico');
                favico.setAttribute('href', _this.config.site.imageUrl + 'favicon.ico');

                ga(_this.config.site.google);
                _this.socialFeatures.push(twitter());
                _this.socialFeatures.push(facebook());
                _this.socialFeatures.push(addThis(_this.config.site.addthis.pubid));
                usersnap();

                riot.mount('*');
                _this.Router = new Router();
            });
        }
    }, {
        key: 'log',
        value: function log(val) {
            if (window.ga) {
                window.ga('send', 'event', 'log', 'label', val);
            }
            console.log(val);
        }
    }, {
        key: 'error',
        value: function error(val) {
            if (window.ga) {
                window.ga('send', 'exception', {
                    'exDescription': val.message,
                    'exFatal': true
                });
            }
            console.error(val);
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
        }
    }, {
        key: 'site',
        get: function get() {
            return 'frontend';
        }
    }]);

    return FrontEnd;
})();

module.exports = FrontEnd;

},{"./js/core/Router":3,"./js/integrations/addthis.js":4,"./js/integrations/facebook.js":5,"./js/integrations/firebase":6,"./js/integrations/google.js":7,"./js/integrations/twitter.js":8,"./js/integrations/usersnap":9}],2:[function(require,module,exports){
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

require('./tags/pages/blog-page.tag');
require('./tags/pages/manifesto-page.tag');
require('./tags/pages/stms-page.tag');
require('./tags/pages/not-found-page.tag');
require('./tags/components/buttons.tag');
require('./tags/components/dynamic-page.tag');
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
require('./tags/page-main.tag');

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

},{"./FrontEnd":1,"./js/mixins/config.js":10,"./tags/components/buttons.tag":11,"./tags/components/dynamic-page.tag":12,"./tags/page-banner.tag":13,"./tags/page-countmein.tag":14,"./tags/page-explore.tag":15,"./tags/page-footer.tag":16,"./tags/page-impact.tag":17,"./tags/page-main.tag":18,"./tags/page-message.tag":19,"./tags/page-methodology.tag":20,"./tags/page-navbar-menu.tag":21,"./tags/page-navbar.tag":22,"./tags/page-news.tag":23,"./tags/page-testimonials.tag":24,"./tags/pages/blog-page.tag":25,"./tags/pages/manifesto-page.tag":26,"./tags/pages/not-found-page.tag":27,"./tags/pages/stms-page.tag":28,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"firepad":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var staticRoutes = {
    'contact': true,
    'home': true,
    'explore': true
};

var isHidden = false;
var toggleMain = function toggleMain(hide, path) {
    track(path);
    if (hide) {
        isHidden = true;
        $('#main').hide();
        $('#at4-share').parent().show();
    } else {
        isHidden = false;
        $('#at4-share').parent().hide();
        $('#main').show();
        $('dynamic-page').empty();
    }
};

var track = function track(path) {
    if (window.ga) {
        window.ga('set', {
            page: path
        });
        window.ga('send', 'pageview');
    }
};

var Router = (function () {
    function Router() {
        var _this = this;

        _classCallCheck(this, Router);

        riot.route.start();
        riot.route(function (target) {
            var path = _this.getPath(target);
            if (!staticRoutes[path]) {
                toggleMain(true, path);
                riot.mount('dynamic-page', { id: path });
            } else {
                toggleMain(false, path);
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
                while (path.startsWith('!') || path.startsWith('#')) {
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
                    toggleMain(false, path);
                    riot.route(path);
                } else {
                    toggleMain(true, path);
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
"use strict";

var addThis = function addThis(apiKey) {

    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0],
            t = window.addthis || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "//s7.addthis.com/js/300/addthis_widget.js#pubid=" + apiKey;
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    })(document, "script", "add-this-js");

    var init = function init() {
        window.addthis.ready(function () {
            if (["#home", "#contact"].indexOf(window.location.hash) >= 0) {
                var tryCount = 0;
                var hideShares = function hideShares(keepGoing) {
                    if ($("#at4-share") && $("#at4-share").length >= 1) {
                        $("#at4-share").parent().hide();
                        if (keepGoing) {
                            _.delay(hideShares, 3000);
                        }
                    } else {
                        tryCount += 1;
                        if (tryCount < 60) {
                            _.delay(hideShares, 250);
                        }
                    }
                };
                hideShares(true);
            }
        });
    };
    return init;
};

module.exports = addThis;

},{}],5:[function(require,module,exports){
'use strict';

var facebookApi = function facebookApi(apiKey) {

    window.fbAsyncInit = function () {
        window.FB.init({
            appId: '847702775304906',
            xfbml: true,
            version: 'v2.3'
        });

        window.FB.Event.subscribe('edge.create', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'like', targetUrl);
        });

        window.FB.Event.subscribe('edge.remove', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'unlike', targetUrl);
        });

        window.FB.Event.subscribe('message.send', function (targetUrl) {
            window.ga('send', 'social', 'facebook', 'send', targetUrl);
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

var Firebase = window.Firebase; //require('firebase');
var Promise = window.Promise;
var localforage = window.localforage;

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
                    window.MetaMap.Auth0.getSession().then(function (profile) {

                        window.MetaMap.Auth0.lock.getClient().getDelegationToken({
                            target: profile.clientID,
                            id_token: id_token,
                            api_type: 'firebase'
                        }, function (err, delegationResult) {
                            that.firebase_token = delegationResult.id_token;
                            localforage.setItem('firebase_token', that.firebase_token);
                            _this.fb.authWithCustomToken(that.firebase_token, function (error, authData) {
                                if (error) {
                                    window.FrontEnd.error(error);
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
                    try {
                        resolve(data);
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
                }, function (error) {
                    window.FrontEnd.error({ message: 'Cannot access ' + path });
                    reject(error);
                });
            });

            return promise;
        }
    }, {
        key: 'on',
        value: function on(path, callback) {
            var event = arguments.length <= 2 || arguments[2] === undefined ? 'value' : arguments[2];

            if (path) {
                var child = this.getChild(path);
                child.orderByChild('order').on(event, function (snapshot) {
                    var data = snapshot.val();
                    try {
                        callback(data);
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
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

},{}],7:[function(require,module,exports){
'use strict';

var googleAnalytics = function googleAnalytics(api) {

    // Google Plus API
    (function () {
        var po = document.createElement('script');po.type = 'text/javascript';po.async = true;
        po.src = 'https://apis.google.com/js/platform.js';
        var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(po, s);
    })();

    //Google Tag Manager API
    (function (w, d, s, l, i) {
        w[l] = w[l] || [];w[l].push({
            'gtm.start': new Date().getTime(), event: 'gtm.js'
        });var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';j.async = true;j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', api.tagmanager);

    // Google Analytics API
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    window.ga('create', api.analytics, 'auto');
    window.ga('send', 'pageview');
    return window.ga;
};

module.exports = googleAnalytics;

},{}],8:[function(require,module,exports){
// Define our custom event handlers
'use strict';

function clickEventToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.region;
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function tweetIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = 'tweet';
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function favIntentToAnalytics(intentEvent) {
    tweetIntentToAnalytics(intentEvent);
}

function retweetIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.data.source_tweet_id;
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

function followIntentToAnalytics(intentEvent) {
    if (!intentEvent) return;
    var label = intentEvent.data.user_id + ' (' + intentEvent.data.screen_name + ')';
    window.ga('send', 'social', 'twitter', intentEvent.type, label);
}

var twitterApi = function twitterApi(apiKey) {

    window.twttr = (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };

        return t;
    })(document, 'script', 'twitter-wjs');

    window.twttr.ready(function (twitter) {
        twitter.widgets.load();
        twitter.events.bind('click', clickEventToAnalytics);
        twitter.events.bind('tweet', tweetIntentToAnalytics);
        twitter.events.bind('retweet', retweetIntentToAnalytics);
        twitter.events.bind('favorite', favIntentToAnalytics);
        twitter.events.bind('follow', followIntentToAnalytics);
    });

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
'use strict';

var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if (!num || (num = num.toString()).length > 9) return 'overflow';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;var str = '';
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += n[5] != 0 ? (str != '' ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str;
}

var config = {
    pathImg: function pathImg(folder) {
        var ret = '' + window.FrontEnd.config.site.imageUrl;
        if (folder) {
            ret += folder + '/';
        }
        return ret;
    },
    getData: function getData(path, callback, that) {
        window.FrontEnd.MetaFire.on(window.FrontEnd.site + '/' + path, function (data) {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    },
    watchData: function watchData(path, callback) {
        window.FrontEnd.MetaFire.on(window.FrontEnd.site + '/' + path, function (data) {
            if (callback) {
                callback(data);
            }
        });
    },
    numberToWords: inWords
};

module.exports = config;

},{}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('buttons', '<div class="row center-heading"> <span each="{ _.sortBy(opts.buttons,\'order\') }"> <a if="{ !amazonid }" role="button" href="{ link }" target="_blank" class="btn btn-lg btn-theme-dark" style="margin-right: 10px;"> { title } </a> <div if="{ amazonid }" class="col-sm-{ parent.cell } "> <iframe style="width: 120px; height: 240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" riot-src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=cabrreselab-20&marketplace=amazon&region=US&placement={ amazonid }&asins={ amazonid }&linkId=DIY3TUOPDFH3NQWF&show_border=false&link_opens_in_new_window=true"></iframe> </div> </span> </div>', function(opts) {var _this = this;

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
module.exports = riot.tag('dynamic-page', '<section id="{ _.kebabCase(data.title) }" > <div class="divide50"></div> <div class="container"> <div id="modal_dialog_container"> </div> </div> </section>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();
this.height = window.innerHeight - 75;
this.on('mount', function () {
    if (opts && opts.id && opts.id != '#') {

        FrontEnd.MetaFire.getData(FrontEnd.site + '/explore/items/' + opts.id).then(function (data) {
            var dialogClass = 'blog-page';

            if (opts.id == 'the-systems-thinking-manifesto-poster') {
                data = data || {};
                dialogClass = 'manifesto-page';
            } else if (opts.id == 'stms') {
                data = data || {};
                dialogClass = 'stms-page';
            } else if (!data) {
                data = data || {};
                dialogClass = 'not-found-page';
            }

            if (data) {

                _this.update();

                opts.event = {
                    item: data,
                    id: opts.id,
                    dialog: _this.modal
                };

                riot.mount(_this.modal_dialog_container, dialogClass, opts);
            }
        });
    }
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li each="{ data }" data-transition="fade" data-slotamount="5" data-title="{ title }" style="background: rgb(240,110,30);" >  <img if="{ !youtubeid && img && img != \'undefined\' }" riot-src="{ parent.url + img + \'?banner\' }" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div if="{ !youtubeid && title }" class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> <raw content="{ title }"></raw> </div> <div if="{ !youtubeid && subtext }" class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> <raw content="{ subtext }"></raw> </div> <div if="{ !youtubeid }" each="{ _.sortBy(buttons, \'order\') }"> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut" onclick="{ parent.getLink }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> <div if="{ youtubeid }" class="tp-caption sft customout tp-videolayer" data-x="center" data-hoffset="0" data-y="center" data-voffset="0" data-customin="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:5;scaleY:5;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-customout="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:0.75;scaleY:0.75;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;" data-speed="600" data-start="1000" data-easing="Power4.easeOut" data-endspeed="500" data-endeasing="Power4.easeOut" data-autoplay="true" data-autoplayonlyfirsttime="false" data-nextslideatend="false" data-thumbimage="https://img.youtube.com/vi/{ youtubeid }/mqdefault.jpg"> <iframe riot-src="https://www.youtube.com/embed/{ youtubeid }?hd=1&wmode=opaque&controls=1&showinfo=0" width="1066px" height="600px" style="width:1066px;height:600px;" > </iframe> </div> </li> </ul> </div> </div>', 'id="home"', function(opts) {var _this = this;

this.data = [];
this.mixin('config');
this.url = this.pathImg('site');
this.mounted = false;

this.watchData('/banner', function (data) {
    try {
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
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section if="{ data }" style="background: rgb(212, 214, 215);"> <div class="divide50"></div> <div class="container"> <div class="row"> <div id="impact_img" class="col-md-6"> <img class="img-responsive" alt="7 billion thinkers" riot-src="{ url+impact.img + \'?countmein\' }"></img> </div> <div class="col-md-6"> <br> <div class="facts-in"> <h3> <span id="counter" class="counter">{ Humanize.formatNumber(data.total) }</span>+ </h3> <br> <h3 style="font-size: 35px; font-weight: 700;">{ engage.subtext }</h3> <div id="mc_embed_signup"> <form action="//cabreralabs.us4.list-manage.com/subscribe/post?u=58947385383d323caf9047f39&amp;id=9799d3a7b9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="" target="_blank" novalidate=""> <p style="color: #fff;">{ data.newsletter.text }</p> <div id="mc_embed_signup_scroll"> <div class="mc-field-group"> <div class="input-group"> <input type="email" placeholder="Email..." style="height: 31px;" value="" name="EMAIL" class="form-control" id="mce-EMAIL"> <span class="input-group-btn"> <input role="button" type="submit" style="font-variant: small-caps; text-transform: none;" value="{ impact.text }" name="subscribe" id="mc-embedded-subscribe" class="btn btn-theme-bg">{ impact.text }</input> </span> </div> </div>  <div style="position: absolute; left: -5000px;"> <input type="text" name="b_58947385383d323caf9047f39_9799d3a7b9" tabindex="-1" value=""> </div> <div id="mce-responses" class="clear" style="margin-top: 5px;"> <div class="response" id="mce-error-response" style="color: red; display:none"></div> <div class="response" id="mce-success-response" style="color: #fff; display:none"></div> </div> </div> </form> </div> <div class="row"> <div class="col-md-4 col-sm-4 col-xs-4"> </div> <div class="col-md-6 col-sm-4 col-xs-4"> <div class="addthis_horizontal_follow_toolbox"></div> </div> <div class="col-md-3 margin30 hidden-xs hidden-sm"> </div> </div> </div> </div> <div class="row"> <div class="col-md-12"> <div class="row"> <div class="col-md-12"> <div class="no-padding-inner gray"> <h3 class="wow animated fadeInDownfadeInRight animated" style="visibility: visible; text-align: center;"> { numberToWords(engage.options.length) } more things you can do: </h3> <div class="row"> <div class="col-md-4" each="{ val, i in engage.options }"> <div class="services-box margin30 wow animated fadeInRight animated" style="visibility: visible; animation-name: fadeInRight; -webkit-animation-name: fadeInRight;"> <div class="services-box-icon"> <i class="{ val.icon }"></i> </div> <div class="services-box-info"> <h4>{ val.title }</h4> <p>{ val.text }</p> <div if="{ val.buttons }" each="{ _.sortBy(val.buttons, \'order\') }"> <a href="{ link || \'\' }" target="{ target || \'\'}" class="btn btn-lg btn-theme-dark">{ title }</a> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </section>', 'id="countmein"', function(opts) {var _this = this;

this.data = null;
this.mixin('config');
this.url = this.pathImg('site');

FrontEnd.MetaFire.getData(FrontEnd.site + '/count-me-in').then(function (data) {
    try {
        _this.data = data;
        _this.impact = data.impact;
        _this.engage = data.engage;
        _this.engage.options = _.filter(_.sortBy(data.engage.options, 'order'), function (opt) {
            return opt.archive != true;
        });
        _this.header = data.header;

        _this.update();

        $(_this.counter).counterUp({
            delay: 100,
            time: 800
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-explore', '<div if="{ header }" class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>{ header.title }</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div if="{ filters }" class="container"> <div class="cube-masonry"> <div id="filters_container" class="cbp-l-filters-alignCenter"> <div each="{ val, i in filters }" data-filter=".{ val.tag }" class="cbp-filter-item { \'cbp-filter-item-active\': i == 0 }"> { val.name } <div class="cbp-filter-counter"></div> </div> </div> <div id="masonry_container" class="cbp"> <a id="{ id }" href="{ link || \'#!\'+id }" target="_blank" onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(\' \') }"> <div class="cbp-caption"> <div class="cbp-caption-defaultWrap"> <img if="{ img }" riot-src="{ parent.url + type + \'/\' + img }" alt="{ title }"> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div if="{ title }" class="{ \'cbp-l-caption-title\': true }" >{ title }</div> </div> </div> </div> </div> </a> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="javascript:;" onclick="{ showAll }" class="btn btn-theme-dark btn-lg">Explore All</a> </div>', 'id="explore"', function(opts) {var _this = this;

this.filters = [];
this.header = [];
this.content = [];

this.mixin('config');
this.url = this.pathImg();

this.showAll = function () {
    $(_this.masonry_container).cubeportfolio('filter', '*');
};

this.onClick = function (e) {
    if (this.link) return true;
    FrontEnd.Router.to(_.kebabCase(e.item.id), e, this);
};

FrontEnd.MetaFire.getData(FrontEnd.site + '/explore').then(function (data) {
    try {
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
            gapHorizontal: 25,
            gapVertical: 25,
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
            displayType: 'lazyLoading',
            displayTypeSpeed: 100
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div id="contact" class="container"> <div class="row"> <div class="col-md-4 col-sm-6 margin30"> <div class="footer-col"> <h3>{ data.about.title }</h3> <p style="color: #fff;">{ data.about.text }</p> <ul class="list-unstyled contact"> <li each="{ _.sortBy(data.contact,\'order\') }"> <p style="color: #fff;"> <strong> <i class="{ icon }"></i>{ title || \'\' } </strong> <a if="{ link }" href="{ link }" style="color: #fff" >{ text || link }</a> <span if="{ !link }">{ text }</span> </p> </li> </ul> <ul id="social_follow" class="list-inline social-1"> <li each="{ _.sortBy(data.about.social, \'order\') }"> <a href="{ link }" alt="{ title }"> <i class="{ icon }"></i> </a> </li> </ul> </div> </div>  <div class="col-md-4 col-sm-6 margin30 hidden-xs hidden-sm"> <div class="footer-col"> <h3>Follow Us</h3> <a if="{ social.twitter }" class="twitter-timeline" href="https://twitter.com/{ social.twitter.title }" data-widget-id="{ social.twitter.api }">Tweets by @{ social.twitter.title }</a> </div> </div>  <div class="col-md-4 col-sm-6 margin30 hidden-xs hidden-sm" style="padding-right: 1px;"> <div class="footer-col"> <h3>Like Us</h3> <div if="{ social.facebook }" class="fb-page" data-href="https://www.facebook.com/{ social.facebook.title }" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-height="300" data-show-posts="true"> <div class="fb-xfbml-parse-ignore"> <blockquote cite="https://www.facebook.com/{ social.facebook.title }"> <a href="https://www.facebook.com/{ social.facebook.title }">{ title }</a> </blockquote> </div> </div> </div> </div> </div> <div if="{ data.copyright }" class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span> <raw content="{ data.copyright.text }"></raw> </span> <img style="display: block; margin-left: auto; margin-right: auto; height: 5%; width: 5%;" riot-src="{ url+data.copyright.img+\'?copy1\' }"></img> <span style="font-size: 8px;">{ data.copyright.license }</span> <img style="display: block; margin-left: auto; margin-right: auto; height: 3%; width: 3%;" riot-src="{ url+data.copyright.img2+\'?copy2\' }"></img> </div> </div> </div> </div> </footer>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg('site');

this.social = null;
this.data = null;
this.title = FrontEnd.config.site.title;

FrontEnd.MetaFire.getData(FrontEnd.site + '/footer').then(function (data) {
    try {
        _this.data = data;
        _this.update();

        FrontEnd.MetaFire.getData(FrontEnd.site + '/social').then(function (social) {
            _this.social = social;
            _this.update();
            FrontEnd.initSocial();
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-impact', '<section> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2 if="{ header }">{ header.title }</h2> <span class="center-line"></span> <p if="{ header }" class="lead"> { header.text } </p> </div> </div> </div> <div id="impact_slider" class="owl-carousel"> <div class="item" each="{ items }"> <a href="javascript:;"> <img if="{ img }" width="200px" height="125px" riot-src="{ parent.url }impact/{ img }" alt="{ title }"> </a> </div> </div> </div> </section>', 'id="impact"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/impact').then(function (data) {
    try {
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
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],18:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-main', '<page-banner></page-banner> <div class="divide60"></div> <page-message></page-message> <div class="divide80"></div> <page-methodology></page-methodology> <div class="divide50"></div> <page-testimonials></page-testimonials> <div class="divide50"></div> <page-impact></page-impact> <div class="divide50"></div> <page-countmein></page-countmein> <div class="divide70"></div> <page-news></page-news> <div class="divide50"></div> <div id="explore_container"> </div> <div class="divide40"></div>', 'id="main"', function(opts) {var _this = this;

var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
if (!isSafari) {
    this.on('mount', function () {
        window.setTimeout(function () {
            riot.mount(_this.explore_container, 'page-explore', { items: [] });
        }, 250);
    });
}
});
},{"riot":"riot"}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-message', '<div class="container"> <div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p><raw content="{ header.text }"></raw> </p> </div> </div> </div> <div class="row special-feature"> <div each="{ items }" class="col-md-4 col-sm-4 margin10"> <div class="s-feature-box text-center wow animated fadeIn" data-wow-duration="700ms" data-wow-delay="200ms"> <div class="mask-top">  <i class="{ icon }"></i>  <h4>{ title }</h4> </div> <div class="mask-bottom">  <i class="{ icon }"></i>  <h4>{ title }</h4>  <p>{ text }</p> </div> </div> </div> </div> </div>', 'id="message"', function(opts) {var _this = this;

this.header = {};
this.items = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/message').then(function (data) {

    try {
        _this.header = data.header;
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],20:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-methodology', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p class="lead">{ header.text }</p> </div> </div> </div> <div class="divide30"></div> <div class="row"> <div class="col-md-6"> <div class="center-heading"> <h4>{ frameworks.header.title }</h4> <p class="lead">{ frameworks.header.text }</p> </div> <div class="panel-group" id="frameworks"> <div each="{ val, i in _.sortBy(frameworks.items, \'order\') }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#frameworks" href="#collapseFrameworks_{ i }"> { val.title } </a> </h4> </div> <div id="collapseFrameworks_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div>  <div class="col-md-6"> <div class="center-heading"> <h4>{ partners.header.title }</h4> <p class="lead">{ partners.header.text }</p> </div> <div class="panel-group" id="accordion"> <div each="{ val, i in _.sortBy(partners.items, \'order\') }" class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne_{ i }"> { val.title } </a> </h4> </div> <div id="collapseOne_{ i }" class="panel-collapse collapse { in: i == 0 }"> <div class="panel-body"> { val.text } </div> </div> </div> </div> </div> </div> </div>', 'id="methodology"', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/methodology').then(function (data) {
    try {
        _this.header = data.header;
        _this.frameworks = data.frameworks;
        _this.partners = data.partners;

        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],21:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-menu-navbar', '<div class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }"> <a if="{ val.title }" href="{ val.link || \'#\' }" target="{ _blank: val.link.startsWith(\'http\') }" > <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i> </a> </li> </ul> </div>', function(opts) {var _this = this;

this.data = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/navbar').then(function (data) {

    try {
        _this.data = _.filter(_.sortBy(data, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],22:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <div> <a href="#home"><img if="{ data }" style="margin-top: 7px; margin-right: 15px;" riot-src="{ url }site/{ data.img }" alt="{ data.alt }"> </a> </div> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then(function (data) {

    try {
        _this.data = data;
        _this.update();
        $(".sticky").sticky({ topSpacing: 0 });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],23:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-news', '<div class="container"> <div class="row"> <div class="col-md-12"> <h3 class="heading">Latest News</h3> <div id="news_carousel" class="owl-carousel owl-spaced"> <div each="{ data }"> <div class="news-desc"> <p> <a href="{ link }" target="_blank">{ Humanize.truncate(title, 125) }</a> </p> </div> </div> </div> </div> </div> </div>', 'id="news"', function(opts) {var _this = this;

this.data = [];

FrontEnd.MetaFire.getData(FrontEnd.site + '/news').then(function (data) {
    try {
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
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],24:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-testimonials', '<div id="testimonials-carousel" class="testimonials testimonials-v-2 wow animated fadeInUp" data-wow-duration="700ms" data-wow-delay="100ms"> <div class="container"> <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p>{ header.text }</p> </div> </div> </div>  <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div id="testimonial_slide" class="testi-slide"> <ul class="slides"> <li each="{ items }"> <img riot-src="{ parent.url + img }" alt="{ user }"> <h4> <i class="fa fa-quote-left ion-quote"></i> { text} </h4> <p class="test-author"> { user } - <em>{ subtext }</em> </p> </li> </ul> </div> </div> </div> <div class="divide30"></div> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg('testimonials');

FrontEnd.MetaFire.getData(FrontEnd.site + '/testimonials').then(function (data) {
    try {
        _this.header = data.header;
        _this.items = _.filter(_.sortBy(data.items, 'order'), function (i) {
            return i.archive != true;
        });
        _this.update();

        $(_this.testimonial_slide).flexslider({
            slideshowSpeed: 5000,
            directionNav: false,
            animation: "fade"
        });
    } catch (e) {
        window.FrontEnd.error(e);
    }
});
});
},{"riot":"riot"}],25:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('blog-page', '<div if="opts" class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> </div> <iframe if="{ data.youtubeid }" id="ytplayer" type="text/html" width="720" height="405" riot-src="https://www.youtube.com/embed/{ data.youtubeid }?autoplay=1" frameborder="0" allowfullscreen="" class="fitvids" style="height: 405px; width: 720px; display: block; margin-left: auto; margin-right: auto;"></iframe> <iframe if="{ data.vimeoid }" riot-src="https://player.vimeo.com/video/{ data.vimeoid }" width="720" height="405" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" class="fitvids" style="height: 405px; width: 720px; display: block; margin-left: auto; margin-right: auto;"></iframe> <div if="{ blog }" class="row"> <div class="col-sm-12 "> <div > <raw content="{ blog }"></raw> </div> <buttons buttons="{ data.buttons }"></buttons> </div> </div> <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.event.id) {
        _this.data = opts.event.item;

        _this.url = window.location.href;

        _this.update();

        var ref = FrontEnd.MetaFire.getChild(FrontEnd.site + '/content/' + opts.event.id);
        var firepad = new Firepad.Headless(ref);
        firepad.getHtml(function (html) {
            _this.blog = html;
            _this.update();
        });
    }
});
});
},{"riot":"riot"}],26:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('manifesto-page', '<div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.text }"></raw> </p> <img src="https://c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/crlab/site/manifesto_poster_no_diagram.png" alt="Systems Thinking Manifesto" class="img-responsive"></img> </div> <div if="{ blog }" class="row"> <div class="col-sm-12 "> <div > <raw content="{ blog }"></raw> </div> <buttons buttons="{ data.buttons }"></buttons> </div> </div> <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons> </div> </div>', function(opts) {var _this = this;

this.on('mount', function () {
    if (opts && opts.event.id) {
        _this.data = opts.event.item;

        _this.url = window.location.href;

        _this.update();

        var ref = FrontEnd.MetaFire.getChild(FrontEnd.site + '/content/systems-thinking-manifesto');
        var firepad = new Firepad.Headless(ref);
        firepad.getHtml(function (html) {
            _this.blog = html;
            _this.update();
        });
    }
});
});
},{"riot":"riot"}],27:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('not-found-page', '<div class="divide80"></div> <div class="container"> <div class="row"> <div class="col-md-12 text-center error-text"> <div class="divide30"></div> <h1 class="error-digit wow animated fadeInUp margin20 animated" style="visibility: visible; animation-name: fadeInUp; -webkit-animation-name: fadeInUp;"><i class="fa fa-thumbs-down"></i></h1> <h2>{ data.message }</h2> <p><a href="#explore" class="btn btn-lg btn-theme-dark">Go Back</a></p> </div> </div> </div>', function(opts) {var _this = this;

this.data = {
    message: 'Oops, that page could not be found!'
};

this.on('mount', function () {
    _this.update();
});
});
},{"riot":"riot"}],28:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('stms-page', '<div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ data.header.title }</h2> <span class="center-line"></span> <p> <raw content="{ data.header.text }"></raw> </p> </div> <div class="row"> <div each="{ _.sortBy(data.items,\'order\') }" class="col-sm-6"> <div > <iframe if="{ youtubeid }" id="ytplayer_{ youtubeid }" type="text/html" height="400" riot-src="https://www.youtube.com/embed/{ youtubeid }?autoplay=0" frameborder="0" allowfullscreen=""></iframe> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.data = null;
this.on('mount', function () {
    FrontEnd.MetaFire.getData(FrontEnd.site + '/stms').then(function (data) {
        _this.data = data;
        _this.update();
    });
});
});
},{"riot":"riot"}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvRnJvbnRFbmQuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvY29yZS9Sb3V0ZXIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2FkZHRoaXMuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9mcm9udGVuZC9zcmMvanMvaW50ZWdyYXRpb25zL2ZhY2Vib29rLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy90d2l0dGVyLmpzIiwiQzovR2l0aHViL01ldGFNYXAvZnJvbnRlbmQvc3JjL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcC5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2Zyb250ZW5kL3NyYy9qcy9taXhpbnMvY29uZmlnLmpzIiwiZnJvbnRlbmQvc3JjL3RhZ3MvY29tcG9uZW50cy9idXR0b25zLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL2NvbXBvbmVudHMvZHluYW1pYy1wYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtYmFubmVyLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtY291bnRtZWluLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtZXhwbG9yZS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWZvb3Rlci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLWltcGFjdC50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW1haW4udGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5hdmJhci50YWciLCJmcm9udGVuZC9zcmMvdGFncy9wYWdlLW5ld3MudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnIiwiZnJvbnRlbmQvc3JjL3RhZ3MvcGFnZXMvYmxvZy1wYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2VzL21hbmlmZXN0by1wYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2VzL25vdC1mb3VuZC1wYWdlLnRhZyIsImZyb250ZW5kL3NyYy90YWdzL3BhZ2VzL3N0bXMtcGFnZS50YWciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2hELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ3RELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ3hELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztBQUV0RCxJQUFNLE1BQU0sR0FBRyxTQUFULE1BQU0sR0FBUztB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QyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLEdBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUN4RixPQUFHLElBQUksQUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLEdBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUN2RixPQUFHLElBQUksQUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLEdBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUMzRixPQUFHLElBQUksQUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMs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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UnKTtcclxubGV0IHVzZXJzbmFwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAnKTtcclxubGV0IHJpb3QgPSB3aW5kb3cucmlvdDtcclxubGV0IFJvdXRlciA9IHJlcXVpcmUoJy4vanMvY29yZS9Sb3V0ZXInKTtcclxubGV0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XHJcbmxldCB0d2l0dGVyID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdHdpdHRlci5qcycpO1xyXG5sZXQgZmFjZWJvb2sgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9mYWNlYm9vay5qcycpO1xyXG5sZXQgYWRkVGhpcyA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2FkZHRoaXMuanMnKTtcclxuXHJcbmNvbnN0IGNvbmZpZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IFNJVEVTID0ge1xyXG4gICAgICAgIENSTDoge1xyXG4gICAgICAgICAgICBkYjogJ21ldGEtbWFwLXByb2R1Y3Rpb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBUSElOS19XQVRFUjoge1xyXG4gICAgICAgICAgICBkYjogJ3RoaW5rd2F0ZXItcHJvZHVjdGlvbidcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmV0ID0ge1xyXG4gICAgICAgIGhvc3Q6IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxyXG4gICAgICAgIHNpdGU6IHt9XHJcbiAgICB9XHJcbiAgICBsZXQgc2VnbWVudHMgPSByZXQuaG9zdC5zcGxpdCgnLicpO1xyXG4gICAgbGV0IGZpcnN0ID0gc2VnbWVudHNbMF07XHJcbiAgICBpZiAoZmlyc3QgPT09ICd3d3cnKSB7XHJcbiAgICAgICAgZmlyc3QgPSBzZWdtZW50c1sxXTtcclxuICAgIH1cclxuICAgIHN3aXRjaCAoZmlyc3QudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgIGNhc2UgJ2NybGFiJzpcclxuICAgICAgICBjYXNlICdtZXRhLW1hcC1zdGFnaW5nJzpcclxuICAgICAgICBjYXNlICdmcm9udGVuZCc6XHJcbiAgICAgICAgICAgIHJldC5zaXRlID0gU0lURVNbJ0NSTCddO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICd0aGlua3dhdGVyLXByb2R1Y3Rpb24nOlxyXG4gICAgICAgIGNhc2UgJ3RoaW5rd2F0ZXItc3RhZ2luZyc6XHJcbiAgICAgICAgY2FzZSAndGhpbmt3YXRlcic6XHJcbiAgICAgICAgICAgIHJldC5zaXRlID0gU0lURVNbJ1RISU5LX1dBVEVSJ107XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIC8vRm9yIG5vdywgZGVmYXVsdCB0byBDUkxcclxuICAgICAgICAgICAgcmV0LnNpdGUgPSBTSVRFU1snQ1JMJ107XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXQ7XHJcbn07XHJcblxyXG5jbGFzcyBGcm9udEVuZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFncykge1xyXG4gICAgICAgIHRoaXMudGFncyA9IHRhZ3M7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IG5ldyBNZXRhRmlyZSh0aGlzLmNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5zb2NpYWxGZWF0dXJlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRTb2NpYWwoKSB7XHJcbiAgICAgICAgXy5lYWNoKHRoaXMuc29jaWFsRmVhdHVyZXMsIChmZWF0dXJlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGZlYXR1cmUpIGZlYXR1cmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l0ZSgpIHtcclxuICAgICAgICByZXR1cm4gJ2Zyb250ZW5kJztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ2NvbmZpZycsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIF8uZXh0ZW5kKHRoaXMuY29uZmlnLnNpdGUsIGRhdGEpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuY29uZmlnLnNpdGUudGl0bGU7XHJcbiAgICAgICAgICAgIGxldCBmYXZpY28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmF2aWNvJyk7XHJcbiAgICAgICAgICAgIGZhdmljby5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgJHt0aGlzLmNvbmZpZy5zaXRlLmltYWdlVXJsfWZhdmljb24uaWNvYCk7XHJcblxyXG4gICAgICAgICAgICBnYSh0aGlzLmNvbmZpZy5zaXRlLmdvb2dsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc29jaWFsRmVhdHVyZXMucHVzaCh0d2l0dGVyKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnNvY2lhbEZlYXR1cmVzLnB1c2goZmFjZWJvb2soKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc29jaWFsRmVhdHVyZXMucHVzaChhZGRUaGlzKHRoaXMuY29uZmlnLnNpdGUuYWRkdGhpcy5wdWJpZCkpO1xyXG4gICAgICAgICAgICB1c2Vyc25hcCgpO1xyXG5cclxuICAgICAgICAgICAgcmlvdC5tb3VudCgnKicpO1xyXG4gICAgICAgICAgICB0aGlzLlJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2codmFsKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnZXZlbnQnLCAnbG9nJywgJ2xhYmVsJywgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBlcnJvcih2YWwpIHtcclxuICAgICAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdleGNlcHRpb24nLCB7XHJcbiAgICAgICAgICAgICAgICAnZXhEZXNjcmlwdGlvbic6IHZhbC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgJ2V4RmF0YWwnOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmVycm9yKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9naW4oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ291dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZyb250RW5kOyIsInJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XHJcbndpbmRvdy5yaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG53aW5kb3cuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG53aW5kb3cuUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMnKTtcclxud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbnJlcXVpcmUoJ2pxdWVyeS11aScpO1xyXG5yZXF1aXJlKCdib290c3RyYXAnKTtcclxud2luZG93LkZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKTtcclxud2luZG93LkZpcmVwYWQgPSByZXF1aXJlKCdmaXJlcGFkJyk7XHJcbndpbmRvdy5IdW1hbml6ZSA9IHJlcXVpcmUoJ2h1bWFuaXplLXBsdXMnKTtcclxud2luZG93Lm1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG53aW5kb3cuVVJJID0gcmVxdWlyZSgnVVJJanMnKTtcclxud2luZG93LmxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKTtcclxud2luZG93LlBzID0gcmVxdWlyZSgncGVyZmVjdC1zY3JvbGxiYXInKTtcclxuXHJcbmxldCB0YWdzID0gW1xyXG4gICAgJ3BhZ2UtaGVhZCcsXHJcbiAgICAncGFnZS1iYW5uZXInLFxyXG4gICAgJ3BhZ2UtaW1wYWN0JyxcclxuICAgICdwYWdlLWNvdW50bWVpbicsXHJcbiAgICAncGFnZS1mb290ZXInLFxyXG4gICAgJ3BhZ2UtbmF2YmFyLW1lbnUnLFxyXG4gICAgJ3BhZ2UtbmF2YmFyJyxcclxuICAgICdwYWdlLW5ld3MnLFxyXG4gICAgJ3BhZ2UtZXhwbG9yZScsXHJcbiAgICAncGFnZS1tZXNzYWdlJyxcclxuICAgICdwYWdlLW1ldGhvZG9sb2d5JyxcclxuICAgICdwYWdlLXRlc3RpbW9uaWFscydcclxuXTtcclxuXHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlcy9ibG9nLXBhZ2UudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlcy9tYW5pZmVzdG8tcGFnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2VzL3N0bXMtcGFnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2VzL25vdC1mb3VuZC1wYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvY29tcG9uZW50cy9idXR0b25zLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvY29tcG9uZW50cy9keW5hbWljLXBhZ2UudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWJhbm5lci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtaW1wYWN0LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1jb3VudG1laW4udGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWZvb3Rlci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLW1lbnUudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmV3cy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZXhwbG9yZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWVzc2FnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWV0aG9kb2xvZ3kudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWFpbi50YWcnKTtcclxuXHJcbnZhciBjb25maWdNaXhpbiA9IHJlcXVpcmUoJy4vanMvbWl4aW5zL2NvbmZpZy5qcycpO1xyXG5yaW90Lm1peGluKCdjb25maWcnLCBjb25maWdNaXhpbik7XHJcblxyXG5yaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7XHJcblxyXG52YXIgRnJvbnRFbmQgPSByZXF1aXJlKCcuL0Zyb250RW5kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IEZyb250RW5kKHRhZ3MpOyIsImNvbnN0IHN0YXRpY1JvdXRlcyA9IHtcclxuICAgICdjb250YWN0JzogdHJ1ZSxcclxuICAgICdob21lJzogdHJ1ZSxcclxuICAgICdleHBsb3JlJzogdHJ1ZVxyXG59XHJcblxyXG5sZXQgaXNIaWRkZW4gPSBmYWxzZTtcclxubGV0IHRvZ2dsZU1haW4gPSAoaGlkZSwgcGF0aCkgPT4ge1xyXG4gICAgdHJhY2socGF0aCk7XHJcbiAgICBpZiAoaGlkZSkge1xyXG4gICAgICAgIGlzSGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICAkKCcjbWFpbicpLmhpZGUoKTtcclxuICAgICAgICAkKCcjYXQ0LXNoYXJlJykucGFyZW50KCkuc2hvdygpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXNIaWRkZW4gPSBmYWxzZTtcclxuICAgICAgICAkKCcjYXQ0LXNoYXJlJykucGFyZW50KCkuaGlkZSgpO1xyXG4gICAgICAgICQoJyNtYWluJykuc2hvdygpO1xyXG4gICAgICAgICQoJ2R5bmFtaWMtcGFnZScpLmVtcHR5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCB0cmFjayA9IChwYXRoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgICAgd2luZG93LmdhKCdzZXQnLCB7XHJcbiAgICAgICAgICAgIHBhZ2U6IHBhdGhcclxuICAgICAgICB9KTtcclxuICAgICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUm91dGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICByaW90LnJvdXRlLnN0YXJ0KCk7XHJcbiAgICAgICAgcmlvdC5yb3V0ZSgodGFyZ2V0LCAuLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSB0aGlzLmdldFBhdGgodGFyZ2V0KTtcclxuICAgICAgICAgICAgaWYgKCFzdGF0aWNSb3V0ZXNbcGF0aF0pIHtcclxuICAgICAgICAgICAgICAgIHRvZ2dsZU1haW4odHJ1ZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KCdkeW5hbWljLXBhZ2UnLCB7IGlkOiBwYXRoIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9nZ2xlTWFpbihmYWxzZSwgcGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvKHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIHJldHVybiByb3V0ZS5nZXRQYXRoKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB0byhwYXRoKSB7XHJcbiAgICAgICAgcGF0aCA9IHJvdXRlLmdldFBhdGgocGF0aCk7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHN0YXRpY1JvdXRlc1twYXRoXSkge1xyXG4gICAgICAgICAgICAgICAgdG9nZ2xlTWFpbihmYWxzZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICByaW90LnJvdXRlKHBhdGgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9nZ2xlTWFpbih0cnVlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIHJpb3Qucm91dGUoYCEke3BhdGh9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG8ocGF0aCkge1xyXG4gICAgICAgIHJldHVybiByb3V0ZS50byhwYXRoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgcm91dGUgPSBSb3V0ZXI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJ2YXIgYWRkVGhpcyA9IGZ1bmN0aW9uIChhcGlLZXkpIHtcclxuICAgIFxyXG4gICAgKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgIHQgPSB3aW5kb3cuYWRkdGhpcyB8fCB7fTtcclxuICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xyXG4gICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAganMuc3JjID0gYC8vczcuYWRkdGhpcy5jb20vanMvMzAwL2FkZHRoaXNfd2lkZ2V0LmpzI3B1YmlkPSR7YXBpS2V5fWA7XHJcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xyXG5cclxuICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgdC5yZWFkeSA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgICAgIHQuX2UucHVzaChmKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH0oZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwiYWRkLXRoaXMtanNcIikpO1xyXG5cclxuICAgIGxldCBpbml0ID0gKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5hZGR0aGlzLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoWycjaG9tZScsICcjY29udGFjdCddLmluZGV4T2Yod2luZG93LmxvY2F0aW9uLmhhc2gpID49IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciB0cnlDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGlkZVNoYXJlcyA9IGZ1bmN0aW9uKGtlZXBHb2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcjYXQ0LXNoYXJlJykgJiYgJCgnI2F0NC1zaGFyZScpLmxlbmd0aCA+PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNhdDQtc2hhcmUnKS5wYXJlbnQoKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZWVwR29pbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZGVsYXkoaGlkZVNoYXJlcywgMzAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnlDb3VudCArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHJ5Q291bnQgPCA2MCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5kZWxheShoaWRlU2hhcmVzLCAyNTApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaGlkZVNoYXJlcyh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBpbml0O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhZGRUaGlzO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgZmFjZWJvb2tBcGkgPSBmdW5jdGlvbiAoYXBpS2V5KSB7XHJcbiAgICBcclxuICAgIHdpbmRvdy5mYkFzeW5jSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuRkIuaW5pdCh7XHJcbiAgICAgICAgICAgIGFwcElkOiAnODQ3NzAyNzc1MzA0OTA2JyxcclxuICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgIHZlcnNpb246ICd2Mi4zJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB3aW5kb3cuRkIuRXZlbnQuc3Vic2NyaWJlKCdlZGdlLmNyZWF0ZScsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsICdmYWNlYm9vaycsICdsaWtlJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LkZCLkV2ZW50LnN1YnNjcmliZSgnZWRnZS5yZW1vdmUnLCBmdW5jdGlvbiAodGFyZ2V0VXJsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCAnZmFjZWJvb2snLCAndW5saWtlJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LkZCLkV2ZW50LnN1YnNjcmliZSgnbWVzc2FnZS5zZW5kJywgZnVuY3Rpb24gKHRhcmdldFVybCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgJ2ZhY2Vib29rJywgJ3NlbmQnLCB0YXJnZXRVcmwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdO1xyXG4gICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAganMuc3JjID0gXCIvL2Nvbm5lY3QuZmFjZWJvb2submV0L2VuX1VTL3Nkay5qc1wiO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgIH0oZG9jdW1lbnQsICdzY3JpcHQnLCAnZmFjZWJvb2stanNzZGsnKSk7XHJcblxyXG4gICAgcmV0dXJuIHdpbmRvdy5mYkFzeW5jSW5pdDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmFjZWJvb2tBcGk7XHJcblxyXG5cclxuIiwibGV0IEZpcmViYXNlID0gd2luZG93LkZpcmViYXNlOyAvL3JlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbmxldCBQcm9taXNlID0gd2luZG93LlByb21pc2U7XHJcbmxldCBsb2NhbGZvcmFnZSA9IHdpbmRvdy5sb2NhbGZvcmFnZTtcclxuXHJcbmNsYXNzIE1ldGFGaXJlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGxldCByZXQgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5NZXRhTWFwLkF1dGgwLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5NZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBwcm9maWxlLmNsaWVudElELFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogaWRfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnZmlyZWJhc2VfdG9rZW4nLCB0aGF0LmZpcmViYXNlX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYi5hdXRoV2l0aEN1c3RvbVRva2VuKHRoYXQuZmlyZWJhc2VfdG9rZW4sIChlcnJvciwgYXV0aERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChhdXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoaWxkKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhIChwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY2hpbGQub3JkZXJCeUNoaWxkKCdvcmRlcicpLm9uKCd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcih7IG1lc3NhZ2U6IGBDYW5ub3QgYWNjZXNzICR7cGF0aH1gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uIChwYXRoLCBjYWxsYmFjaywgZXZlbnQgPSAndmFsdWUnICkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgIGNoaWxkLm9yZGVyQnlDaGlsZCgnb3JkZXInKS5vbihldmVudCwgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhIChkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0ICgpIHtcclxuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiXHJcbnZhciBnb29nbGVBbmFseXRpY3MgPSBmdW5jdGlvbiAoYXBpKSB7XHJcbiAgICBcclxuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcclxuICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxyXG4gIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAgICdndG0uc3RhcnQnOlxyXG4gICAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xyXG4gICAgICB9KTsgdmFyIGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cclxuICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgYXBpLnRhZ21hbmFnZXIpO1xyXG5cclxuICAgIC8vIEdvb2dsZSBBbmFseXRpY3MgQVBJXHJcbiAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XHJcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcclxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcclxuXHJcbiAgICB3aW5kb3cuZ2EoJ2NyZWF0ZScsIGFwaS5hbmFseXRpY3MsICdhdXRvJyk7XHJcbiAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgIHJldHVybiB3aW5kb3cuZ2E7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdvb2dsZUFuYWx5dGljcztcclxuXHJcblxyXG4iLCIvLyBEZWZpbmUgb3VyIGN1c3RvbSBldmVudCBoYW5kbGVyc1xyXG5mdW5jdGlvbiBjbGlja0V2ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcclxuICAgIHZhciBsYWJlbCA9IGludGVudEV2ZW50LnJlZ2lvbjtcclxuICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCAndHdpdHRlcicsIGludGVudEV2ZW50LnR5cGUsIGxhYmVsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgdmFyIGxhYmVsID0gXCJ0d2VldFwiO1xyXG4gICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsICd0d2l0dGVyJywgaW50ZW50RXZlbnQudHlwZSwgbGFiZWwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmYXZJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgdHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJldHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgdmFyIGxhYmVsID0gaW50ZW50RXZlbnQuZGF0YS5zb3VyY2VfdHdlZXRfaWQ7XHJcbiAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgJ3R3aXR0ZXInLCBpbnRlbnRFdmVudC50eXBlLCBsYWJlbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvbGxvd0ludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICB2YXIgbGFiZWwgPSBpbnRlbnRFdmVudC5kYXRhLnVzZXJfaWQgKyBcIiAoXCIgKyBpbnRlbnRFdmVudC5kYXRhLnNjcmVlbl9uYW1lICsgXCIpXCI7XHJcbiAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgJ3R3aXR0ZXInLCBpbnRlbnRFdmVudC50eXBlLCBsYWJlbCk7XHJcbn1cclxuXHJcblxyXG52YXIgdHdpdHRlckFwaSA9IGZ1bmN0aW9uIChhcGlLZXkpIHtcclxuICAgIFxyXG4gICAgd2luZG93LnR3dHRyID0gKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgIHQgPSB3aW5kb3cudHd0dHIgfHwge307XHJcbiAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcclxuICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgIGpzLnNyYyA9IFwiaHR0cHM6Ly9wbGF0Zm9ybS50d2l0dGVyLmNvbS93aWRnZXRzLmpzXCI7XHJcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xyXG5cclxuICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgdC5yZWFkeSA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgICAgIHQuX2UucHVzaChmKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH0oZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwidHdpdHRlci13anNcIikpO1xyXG5cclxuICAgIHdpbmRvdy50d3R0ci5yZWFkeSgodHdpdHRlcikgPT4ge1xyXG4gICAgICAgIHR3aXR0ZXIud2lkZ2V0cy5sb2FkKCk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnY2xpY2snLCBjbGlja0V2ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ3R3ZWV0JywgdHdlZXRJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgncmV0d2VldCcsIHJldHdlZXRJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnZmF2b3JpdGUnLCBmYXZJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnZm9sbG93JywgZm9sbG93SW50ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IHRyeUNvdW50ID0gMDtcclxuICAgIGxldCBsb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cudHd0dHIgJiYgd2luZG93LnR3dHRyLndpZGdldHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy50d3R0ci53aWRnZXRzLmxvYWQoKTtcclxuICAgICAgICB9IGVsc2UgaWYodHJ5Q291bnQgPCA1KSB7XHJcbiAgICAgICAgICAgIHRyeUNvdW50ICs9IDE7XHJcbiAgICAgICAgICAgIF8uZGVsYXkobG9hZCwgMjUwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxvYWQ7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0d2l0dGVyQXBpO1xyXG5cclxuXHJcbiIsIlxyXG52YXIgdXNlclNuYXAgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICB2YXIgYXBpS2V5ID0gJzAzMmJhZjg3LTg1NDUtNGViYy1hNTU3LTkzNDg1OTM3MWZhNS5qcycsIHMsIHg7XHJcbiAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICBjb25maWcgPSB7fTtcclxuICAgIH1cclxuICAgIGFwaUtleSA9IGNvbmZpZy5VU0VSX1NOQVBfQVBJX0tFWTtcclxuICAgIGlmIChhcGlLZXkgJiYgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICE9PSAnbG9jYWxob3N0Jykge1xyXG4gICAgICAgIHdpbmRvdy51c2Vyc25hcGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgbW9kZTogJ3JlcG9ydCcsXHJcbiAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxyXG4gICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNuYXAuc2V0RW1haWxCb3goRG9jLmFwcC51c2VyLnVzZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIHMuc3JjID0gJy8vYXBpLnVzZXJzbmFwLmNvbS9sb2FkLycgKyBhcGlLZXkgKyAnLmpzJztcclxuICAgICAgICB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcclxuICAgICAgICByZXR1cm4geC5hcHBlbmRDaGlsZChzKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXNlclNuYXA7XHJcblxyXG5cclxuIiwiY29uc3QgYSA9IFsnJywgJ29uZSAnLCAndHdvICcsICd0aHJlZSAnLCAnZm91ciAnLCAnZml2ZSAnLCAnc2l4ICcsICdzZXZlbiAnLCAnZWlnaHQgJywgJ25pbmUgJywgJ3RlbiAnLCAnZWxldmVuICcsICd0d2VsdmUgJywgJ3RoaXJ0ZWVuICcsICdmb3VydGVlbiAnLCAnZmlmdGVlbiAnLCAnc2l4dGVlbiAnLCAnc2V2ZW50ZWVuICcsICdlaWdodGVlbiAnLCAnbmluZXRlZW4gJ107XHJcbmNvbnN0IGIgPSBbJycsICcnLCAndHdlbnR5JywgJ3RoaXJ0eScsICdmb3J0eScsICdmaWZ0eScsICdzaXh0eScsICdzZXZlbnR5JywgJ2VpZ2h0eScsICduaW5ldHknXTtcclxuXHJcbmZ1bmN0aW9uIGluV29yZHMobnVtKSB7XHJcbiAgICBpZiAoIW51bSB8fCAoKG51bSA9IG51bS50b1N0cmluZygpKS5sZW5ndGggPiA5KSkgcmV0dXJuICdvdmVyZmxvdyc7XHJcbiAgICBsZXQgbiA9ICgnMDAwMDAwMDAwJyArIG51bSkuc3Vic3RyKC05KS5tYXRjaCgvXihcXGR7Mn0pKFxcZHsyfSkoXFxkezJ9KShcXGR7MX0pKFxcZHsyfSkkLyk7XHJcbiAgICBpZiAoIW4pIHJldHVybjsgdmFyIHN0ciA9ICcnO1xyXG4gICAgc3RyICs9IChuWzFdICE9IDApID8gKGFbTnVtYmVyKG5bMV0pXSB8fCBiW25bMV1bMF1dICsgJyAnICsgYVtuWzFdWzFdXSkgKyAnY3JvcmUgJyA6ICcnO1xyXG4gICAgc3RyICs9IChuWzJdICE9IDApID8gKGFbTnVtYmVyKG5bMl0pXSB8fCBiW25bMl1bMF1dICsgJyAnICsgYVtuWzJdWzFdXSkgKyAnbGFraCAnIDogJyc7XHJcbiAgICBzdHIgKz0gKG5bM10gIT0gMCkgPyAoYVtOdW1iZXIoblszXSldIHx8IGJbblszXVswXV0gKyAnICcgKyBhW25bM11bMV1dKSArICd0aG91c2FuZCAnIDogJyc7XHJcbiAgICBzdHIgKz0gKG5bNF0gIT0gMCkgPyAoYVtOdW1iZXIobls0XSldIHx8IGJbbls0XVswXV0gKyAnICcgKyBhW25bNF1bMV1dKSArICdodW5kcmVkICcgOiAnJztcclxuICAgIHN0ciArPSAobls1XSAhPSAwKSA/ICgoc3RyICE9ICcnKSA/ICdhbmQgJyA6ICcnKSArIChhW051bWJlcihuWzVdKV0gfHwgYltuWzVdWzBdXSArICcgJyArIGFbbls1XVsxXV0pICsgJycgOiAnJztcclxuICAgIHJldHVybiBzdHI7XHJcbn1cclxuXHJcbmxldCBjb25maWcgPSB7XHJcbiAgICBwYXRoSW1nOiAoZm9sZGVyKSA9PiB7XHJcbiAgICAgICAgbGV0IHJldCA9IGAke3dpbmRvdy5Gcm9udEVuZC5jb25maWcuc2l0ZS5pbWFnZVVybH1gO1xyXG4gICAgICAgIGlmIChmb2xkZXIpIHtcclxuICAgICAgICAgICAgcmV0ICs9IGAke2ZvbGRlcn0vYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0sXHJcbiAgICBnZXREYXRhOiAocGF0aCwgY2FsbGJhY2ssIHRoYXQpID0+IHtcclxuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuTWV0YUZpcmUub24oYCR7d2luZG93LkZyb250RW5kLnNpdGV9LyR7cGF0aH1gLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGF0LmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGF0LnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgd2F0Y2hEYXRhOiAocGF0aCwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuTWV0YUZpcmUub24oYCR7d2luZG93LkZyb250RW5kLnNpdGV9LyR7cGF0aH1gLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgbnVtYmVyVG9Xb3JkczogaW5Xb3Jkc1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdidXR0b25zJywgJzxkaXYgY2xhc3M9XCJyb3cgY2VudGVyLWhlYWRpbmdcIj4gPHNwYW4gZWFjaD1cInsgXy5zb3J0Qnkob3B0cy5idXR0b25zLFxcJ29yZGVyXFwnKSB9XCI+IDxhIGlmPVwieyAhYW1hem9uaWQgfVwiIHJvbGU9XCJidXR0b25cIiBocmVmPVwieyBsaW5rIH1cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogMTBweDtcIj4geyB0aXRsZSB9IDwvYT4gPGRpdiBpZj1cInsgYW1hem9uaWQgfVwiIGNsYXNzPVwiY29sLXNtLXsgcGFyZW50LmNlbGwgfSBcIj4gPGlmcmFtZSBzdHlsZT1cIndpZHRoOiAxMjBweDsgaGVpZ2h0OiAyNDBweDtcIiBtYXJnaW53aWR0aD1cIjBcIiBtYXJnaW5oZWlnaHQ9XCIwXCIgc2Nyb2xsaW5nPVwibm9cIiBmcmFtZWJvcmRlcj1cIjBcIiByaW90LXNyYz1cIi8vd3MtbmEuYW1hem9uLWFkc3lzdGVtLmNvbS93aWRnZXRzL3E/U2VydmljZVZlcnNpb249MjAwNzA4MjImT25lSlM9MSZPcGVyYXRpb249R2V0QWRIdG1sJk1hcmtldFBsYWNlPVVTJnNvdXJjZT1hYyZyZWY9dGZfdGlsJmFkX3R5cGU9cHJvZHVjdF9saW5rJnRyYWNraW5nX2lkPWNhYnJyZXNlbGFiLTIwJm1hcmtldHBsYWNlPWFtYXpvbiZyZWdpb249VVMmcGxhY2VtZW50PXsgYW1hem9uaWQgfSZhc2lucz17IGFtYXpvbmlkIH0mbGlua0lkPURJWTNUVU9QREZIM05RV0Ymc2hvd19ib3JkZXI9ZmFsc2UmbGlua19vcGVuc19pbl9uZXdfd2luZG93PXRydWVcIj48L2lmcmFtZT4gPC9kaXY+IDwvc3Bhbj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuY2VsbCA9IDY7XG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLmJ1dHRvbnMpIHtcbiAgICAgICAgX3RoaXMuY2VsbCA9IE1hdGgucm91bmQoMTIgLyBfLmtleXMob3B0cy5idXR0b25zKS5sZW5ndGgpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnZHluYW1pYy1wYWdlJywgJzxzZWN0aW9uIGlkPVwieyBfLmtlYmFiQ2FzZShkYXRhLnRpdGxlKSB9XCIgPiA8ZGl2IGNsYXNzPVwiZGl2aWRlNTBcIj48L2Rpdj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGlkPVwibW9kYWxfZGlhbG9nX2NvbnRhaW5lclwiPiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xudGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSA3NTtcbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuaWQgJiYgb3B0cy5pZCAhPSAnIycpIHtcblxuICAgICAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2V4cGxvcmUvaXRlbXMvJyArIG9wdHMuaWQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkaWFsb2dDbGFzcyA9ICdibG9nLXBhZ2UnO1xuXG4gICAgICAgICAgICBpZiAob3B0cy5pZCA9PSAndGhlLXN5c3RlbXMtdGhpbmtpbmctbWFuaWZlc3RvLXBvc3RlcicpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgICAgICBkaWFsb2dDbGFzcyA9ICdtYW5pZmVzdG8tcGFnZSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHMuaWQgPT0gJ3N0bXMnKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgICAgICAgICAgZGlhbG9nQ2xhc3MgPSAnc3Rtcy1wYWdlJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgICAgICBkaWFsb2dDbGFzcyA9ICdub3QtZm91bmQtcGFnZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIG9wdHMuZXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBvcHRzLmlkLFxuICAgICAgICAgICAgICAgICAgICBkaWFsb2c6IF90aGlzLm1vZGFsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoX3RoaXMubW9kYWxfZGlhbG9nX2NvbnRhaW5lciwgZGlhbG9nQ2xhc3MsIG9wdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1iYW5uZXInLCAnPGRpdiBjbGFzcz1cImZ1bGx3aWR0aGJhbm5lclwiPiA8ZGl2IGlkPVwidHBfYmFubmVyXCIgY2xhc3M9XCJ0cC1iYW5uZXJcIj4gPHVsPiAgPGxpIGVhY2g9XCJ7IGRhdGEgfVwiIGRhdGEtdHJhbnNpdGlvbj1cImZhZGVcIiBkYXRhLXNsb3RhbW91bnQ9XCI1XCIgZGF0YS10aXRsZT1cInsgdGl0bGUgfVwiIHN0eWxlPVwiYmFja2dyb3VuZDogcmdiKDI0MCwxMTAsMzApO1wiID4gIDxpbWcgaWY9XCJ7ICF5b3V0dWJlaWQgJiYgaW1nICYmIGltZyAhPSBcXCd1bmRlZmluZWRcXCcgfVwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nICsgXFwnP2Jhbm5lclxcJyB9XCIgYWx0PVwiZGFya2JsdXJiZ1wiIGRhdGEtYmdmaXQ9XCJjb3ZlclwiIGRhdGEtYmdwb3NpdGlvbj1cImxlZnQgdG9wXCIgZGF0YS1iZ3JlcGVhdD1cIm5vLXJlcGVhdFwiPiA8ZGl2IGlmPVwieyAheW91dHViZWlkICYmIHRpdGxlIH1cIiBjbGFzcz1cImNhcHRpb24gdGl0bGUtMiBzZnRcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjEwMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjEwMDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IDxyYXcgY29udGVudD1cInsgdGl0bGUgfVwiPjwvcmF3PiA8L2Rpdj4gPGRpdiBpZj1cInsgIXlvdXR1YmVpZCAmJiBzdWJ0ZXh0IH1cIiBjbGFzcz1cImNhcHRpb24gdGV4dCBzZmxcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjIyMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IDxyYXcgY29udGVudD1cInsgc3VidGV4dCB9XCI+PC9yYXc+IDwvZGl2PiA8ZGl2IGlmPVwieyAheW91dHViZWlkIH1cIiBlYWNoPVwieyBfLnNvcnRCeShidXR0b25zLCBcXCdvcmRlclxcJykgfVwiPiA8ZGl2IGNsYXNzPVwiY2FwdGlvbiBzZmIgcmV2LWJ1dHRvbnMgdHAtcmVzaXplbWVcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjM1NVwiIGRhdGEtc3BlZWQ9XCI1MDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiU2luZS5lYXNlT3V0XCIgb25jbGljaz1cInsgcGFyZW50LmdldExpbmsgfVwiPiA8YSBocmVmPVwieyBsaW5rIHx8IFxcJ1xcJyB9XCIgdGFyZ2V0PVwieyB0YXJnZXQgfHwgXFwnXFwnfVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPnsgdGl0bGUgfTwvYT4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlmPVwieyB5b3V0dWJlaWQgfVwiIGNsYXNzPVwidHAtY2FwdGlvbiBzZnQgY3VzdG9tb3V0IHRwLXZpZGVvbGF5ZXJcIiBkYXRhLXg9XCJjZW50ZXJcIiBkYXRhLWhvZmZzZXQ9XCIwXCIgZGF0YS15PVwiY2VudGVyXCIgZGF0YS12b2Zmc2V0PVwiMFwiIGRhdGEtY3VzdG9taW49XCJ4OjA7eTowO3o6MDtyb3RhdGlvblg6MDtyb3RhdGlvblk6MDtyb3RhdGlvblo6MDtzY2FsZVg6NTtzY2FsZVk6NTtza2V3WDowO3NrZXdZOjA7b3BhY2l0eTowO3RyYW5zZm9ybVBlcnNwZWN0aXZlOjYwMDt0cmFuc2Zvcm1PcmlnaW46NTAlIDUwJTtcIiBkYXRhLWN1c3RvbW91dD1cIng6MDt5OjA7ejowO3JvdGF0aW9uWDowO3JvdGF0aW9uWTowO3JvdGF0aW9uWjowO3NjYWxlWDowLjc1O3NjYWxlWTowLjc1O3NrZXdYOjA7c2tld1k6MDtvcGFjaXR5OjA7dHJhbnNmb3JtUGVyc3BlY3RpdmU6NjAwO3RyYW5zZm9ybU9yaWdpbjo1MCUgNTAlO1wiIGRhdGEtc3BlZWQ9XCI2MDBcIiBkYXRhLXN0YXJ0PVwiMTAwMFwiIGRhdGEtZWFzaW5nPVwiUG93ZXI0LmVhc2VPdXRcIiBkYXRhLWVuZHNwZWVkPVwiNTAwXCIgZGF0YS1lbmRlYXNpbmc9XCJQb3dlcjQuZWFzZU91dFwiIGRhdGEtYXV0b3BsYXk9XCJ0cnVlXCIgZGF0YS1hdXRvcGxheW9ubHlmaXJzdHRpbWU9XCJmYWxzZVwiIGRhdGEtbmV4dHNsaWRlYXRlbmQ9XCJmYWxzZVwiIGRhdGEtdGh1bWJpbWFnZT1cImh0dHBzOi8vaW1nLnlvdXR1YmUuY29tL3ZpL3sgeW91dHViZWlkIH0vbXFkZWZhdWx0LmpwZ1wiPiA8aWZyYW1lIHJpb3Qtc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQveyB5b3V0dWJlaWQgfT9oZD0xJndtb2RlPW9wYXF1ZSZjb250cm9scz0xJnNob3dpbmZvPTBcIiB3aWR0aD1cIjEwNjZweFwiIGhlaWdodD1cIjYwMHB4XCIgc3R5bGU9XCJ3aWR0aDoxMDY2cHg7aGVpZ2h0OjYwMHB4O1wiID4gPC9pZnJhbWU+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+JywgJ2lkPVwiaG9tZVwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygnc2l0ZScpO1xudGhpcy5tb3VudGVkID0gZmFsc2U7XG5cbnRoaXMud2F0Y2hEYXRhKCcvYmFubmVyJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAoZmFsc2UgPT0gX3RoaXMubW91bnRlZCkge1xuICAgICAgICAgICAgX3RoaXMubW91bnRlZCA9IHRydWU7XG4gICAgICAgICAgICBfdGhpcy5kYXRhID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgJChfdGhpcy50cF9iYW5uZXIpLnJldm9sdXRpb24oe1xuICAgICAgICAgICAgICAgIHN0b3BBdFNsaWRlOiAxLFxuICAgICAgICAgICAgICAgIHN0b3BBZnRlckxvb3BzOiAwLFxuICAgICAgICAgICAgICAgIHN0YXJ0d2lkdGg6IDExNzAsXG4gICAgICAgICAgICAgICAgc3RhcnRoZWlnaHQ6IDYwMCxcbiAgICAgICAgICAgICAgICBoaWRlVGh1bWJzOiAxMFxuICAgICAgICAgICAgICAgIC8vZnVsbFdpZHRoOiBcIm9uXCIsXG4gICAgICAgICAgICAgICAgLy9mb3JjZUZ1bGxXaWR0aDogXCJvblwiLFxuICAgICAgICAgICAgICAgIC8vbGF6eUxvYWQ6IFwib25cIlxuICAgICAgICAgICAgICAgIC8vIG5hdmlnYXRpb25TdHlsZTogXCJwcmV2aWV3NFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvdW50bWVpbicsICc8c2VjdGlvbiBpZj1cInsgZGF0YSB9XCIgc3R5bGU9XCJiYWNrZ3JvdW5kOiByZ2IoMjEyLCAyMTQsIDIxNSk7XCI+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBpZD1cImltcGFjdF9pbWdcIiBjbGFzcz1cImNvbC1tZC02XCI+IDxpbWcgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIjcgYmlsbGlvbiB0aGlua2Vyc1wiIHJpb3Qtc3JjPVwieyB1cmwraW1wYWN0LmltZyArIFxcJz9jb3VudG1laW5cXCcgfVwiPjwvaW1nPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbC1tZC02XCI+IDxicj4gPGRpdiBjbGFzcz1cImZhY3RzLWluXCI+IDxoMz4gPHNwYW4gaWQ9XCJjb3VudGVyXCIgY2xhc3M9XCJjb3VudGVyXCI+eyBIdW1hbml6ZS5mb3JtYXROdW1iZXIoZGF0YS50b3RhbCkgfTwvc3Bhbj4rIDwvaDM+IDxicj4gPGgzIHN0eWxlPVwiZm9udC1zaXplOiAzNXB4OyBmb250LXdlaWdodDogNzAwO1wiPnsgZW5nYWdlLnN1YnRleHQgfTwvaDM+IDxkaXYgaWQ9XCJtY19lbWJlZF9zaWdudXBcIj4gPGZvcm0gYWN0aW9uPVwiLy9jYWJyZXJhbGFicy51czQubGlzdC1tYW5hZ2UuY29tL3N1YnNjcmliZS9wb3N0P3U9NTg5NDczODUzODNkMzIzY2FmOTA0N2YzOSZhbXA7aWQ9OTc5OWQzYTdiOVwiIG1ldGhvZD1cInBvc3RcIiBpZD1cIm1jLWVtYmVkZGVkLXN1YnNjcmliZS1mb3JtXCIgbmFtZT1cIm1jLWVtYmVkZGVkLXN1YnNjcmliZS1mb3JtXCIgY2xhc3M9XCJcIiB0YXJnZXQ9XCJfYmxhbmtcIiBub3ZhbGlkYXRlPVwiXCI+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+eyBkYXRhLm5ld3NsZXR0ZXIudGV4dCB9PC9wPiA8ZGl2IGlkPVwibWNfZW1iZWRfc2lnbnVwX3Njcm9sbFwiPiA8ZGl2IGNsYXNzPVwibWMtZmllbGQtZ3JvdXBcIj4gPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+IDxpbnB1dCB0eXBlPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cIkVtYWlsLi4uXCIgc3R5bGU9XCJoZWlnaHQ6IDMxcHg7XCIgdmFsdWU9XCJcIiBuYW1lPVwiRU1BSUxcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwibWNlLUVNQUlMXCI+IDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+IDxpbnB1dCByb2xlPVwiYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiIHN0eWxlPVwiZm9udC12YXJpYW50OiBzbWFsbC1jYXBzOyB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcIiB2YWx1ZT1cInsgaW1wYWN0LnRleHQgfVwiIG5hbWU9XCJzdWJzY3JpYmVcIiBpZD1cIm1jLWVtYmVkZGVkLXN1YnNjcmliZVwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1iZ1wiPnsgaW1wYWN0LnRleHQgfTwvaW5wdXQ+IDwvc3Bhbj4gPC9kaXY+IDwvZGl2PiAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogLTUwMDBweDtcIj4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImJfNTg5NDczODUzODNkMzIzY2FmOTA0N2YzOV85Nzk5ZDNhN2I5XCIgdGFiaW5kZXg9XCItMVwiIHZhbHVlPVwiXCI+IDwvZGl2PiA8ZGl2IGlkPVwibWNlLXJlc3BvbnNlc1wiIGNsYXNzPVwiY2xlYXJcIiBzdHlsZT1cIm1hcmdpbi10b3A6IDVweDtcIj4gPGRpdiBjbGFzcz1cInJlc3BvbnNlXCIgaWQ9XCJtY2UtZXJyb3ItcmVzcG9uc2VcIiBzdHlsZT1cImNvbG9yOiByZWQ7IGRpc3BsYXk6bm9uZVwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwicmVzcG9uc2VcIiBpZD1cIm1jZS1zdWNjZXNzLXJlc3BvbnNlXCIgc3R5bGU9XCJjb2xvcjogI2ZmZjsgZGlzcGxheTpub25lXCI+PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9mb3JtPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgY29sLXNtLTQgY29sLXhzLTRcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBjb2wtc20tNCBjb2wteHMtNFwiPiA8ZGl2IGNsYXNzPVwiYWRkdGhpc19ob3Jpem9udGFsX2ZvbGxvd190b29sYm94XCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgbWFyZ2luMzAgaGlkZGVuLXhzIGhpZGRlbi1zbVwiPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwibm8tcGFkZGluZy1pbm5lciBncmF5XCI+IDxoMyBjbGFzcz1cIndvdyBhbmltYXRlZCBmYWRlSW5Eb3duZmFkZUluUmlnaHQgYW5pbWF0ZWRcIiBzdHlsZT1cInZpc2liaWxpdHk6IHZpc2libGU7IHRleHQtYWxpZ246IGNlbnRlcjtcIj4geyBudW1iZXJUb1dvcmRzKGVuZ2FnZS5vcHRpb25zLmxlbmd0aCkgfSBtb3JlIHRoaW5ncyB5b3UgY2FuIGRvOiA8L2gzPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNFwiIGVhY2g9XCJ7IHZhbCwgaSBpbiBlbmdhZ2Uub3B0aW9ucyB9XCI+IDxkaXYgY2xhc3M9XCJzZXJ2aWNlcy1ib3ggbWFyZ2luMzAgd293IGFuaW1hdGVkIGZhZGVJblJpZ2h0IGFuaW1hdGVkXCIgc3R5bGU9XCJ2aXNpYmlsaXR5OiB2aXNpYmxlOyBhbmltYXRpb24tbmFtZTogZmFkZUluUmlnaHQ7IC13ZWJraXQtYW5pbWF0aW9uLW5hbWU6IGZhZGVJblJpZ2h0O1wiPiA8ZGl2IGNsYXNzPVwic2VydmljZXMtYm94LWljb25cIj4gPGkgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIj48L2k+IDwvZGl2PiA8ZGl2IGNsYXNzPVwic2VydmljZXMtYm94LWluZm9cIj4gPGg0PnsgdmFsLnRpdGxlIH08L2g0PiA8cD57IHZhbC50ZXh0IH08L3A+IDxkaXYgaWY9XCJ7IHZhbC5idXR0b25zIH1cIiBlYWNoPVwieyBfLnNvcnRCeSh2YWwuYnV0dG9ucywgXFwnb3JkZXJcXCcpIH1cIj4gPGEgaHJlZj1cInsgbGluayB8fCBcXCdcXCcgfVwiIHRhcmdldD1cInsgdGFyZ2V0IHx8IFxcJ1xcJ31cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXRoZW1lLWRhcmtcIj57IHRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCAnaWQ9XCJjb3VudG1laW5cIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBudWxsO1xudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygnc2l0ZScpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2NvdW50LW1lLWluJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBfdGhpcy5pbXBhY3QgPSBkYXRhLmltcGFjdDtcbiAgICAgICAgX3RoaXMuZW5nYWdlID0gZGF0YS5lbmdhZ2U7XG4gICAgICAgIF90aGlzLmVuZ2FnZS5vcHRpb25zID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5lbmdhZ2Uub3B0aW9ucywgJ29yZGVyJyksIGZ1bmN0aW9uIChvcHQpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJChfdGhpcy5jb3VudGVyKS5jb3VudGVyVXAoe1xuICAgICAgICAgICAgZGVsYXk6IDEwMCxcbiAgICAgICAgICAgIHRpbWU6IDgwMFxuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1leHBsb3JlJywgJzxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+IDxzdHJvbmc+eyBoZWFkZXIudGl0bGUgfTwvc3Ryb25nPiA8L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZj1cInsgZmlsdGVycyB9XCIgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cImN1YmUtbWFzb25yeVwiPiA8ZGl2IGlkPVwiZmlsdGVyc19jb250YWluZXJcIiBjbGFzcz1cImNicC1sLWZpbHRlcnMtYWxpZ25DZW50ZXJcIj4gPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gZmlsdGVycyB9XCIgZGF0YS1maWx0ZXI9XCIueyB2YWwudGFnIH1cIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbSB7IFxcJ2NicC1maWx0ZXItaXRlbS1hY3RpdmVcXCc6IGkgPT0gMCB9XCI+IHsgdmFsLm5hbWUgfSA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cIm1hc29ucnlfY29udGFpbmVyXCIgY2xhc3M9XCJjYnBcIj4gPGEgaWQ9XCJ7IGlkIH1cIiBocmVmPVwieyBsaW5rIHx8IFxcJyMhXFwnK2lkIH1cIiB0YXJnZXQ9XCJfYmxhbmtcIiBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCIgZWFjaD1cInsgY29udGVudCB9XCIgY2xhc3M9XCJjYnAtaXRlbSB7IHR5cGUgfSB7IF8ua2V5cyh0YWdzKS5qb2luKFxcJyBcXCcpIH1cIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIGlmPVwieyBpbWcgfVwiIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgdHlwZSArIFxcJy9cXCcgKyBpbWcgfVwiIGFsdD1cInsgdGl0bGUgfVwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGlmPVwieyB0aXRsZSB9XCIgY2xhc3M9XCJ7IFxcJ2NicC1sLWNhcHRpb24tdGl0bGVcXCc6IHRydWUgfVwiID57IHRpdGxlIH08L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIG9uY2xpY2s9XCJ7IHNob3dBbGwgfVwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPkV4cGxvcmUgQWxsPC9hPiA8L2Rpdj4nLCAnaWQ9XCJleHBsb3JlXCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5maWx0ZXJzID0gW107XG50aGlzLmhlYWRlciA9IFtdO1xudGhpcy5jb250ZW50ID0gW107XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxudGhpcy5zaG93QWxsID0gZnVuY3Rpb24gKCkge1xuICAgICQoX3RoaXMubWFzb25yeV9jb250YWluZXIpLmN1YmVwb3J0Zm9saW8oJ2ZpbHRlcicsICcqJyk7XG59O1xuXG50aGlzLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICh0aGlzLmxpbmspIHJldHVybiB0cnVlO1xuICAgIEZyb250RW5kLlJvdXRlci50byhfLmtlYmFiQ2FzZShlLml0ZW0uaWQpLCBlLCB0aGlzKTtcbn07XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZXhwbG9yZScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBfdGhpcy5maWx0ZXJzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5maWx0ZXJzLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IF8uc29ydEJ5KF8ubWFwKGRhdGEuaXRlbXMsIGZ1bmN0aW9uICh2YWwsIGtleSkge1xuICAgICAgICAgICAgaWYgKHZhbCAmJiAhKHZhbC5hcmNoaXZlID09PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgIHZhbC5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgJ29yZGVyJyk7XG4gICAgICAgIF90aGlzLmNvbnRlbnQgPSBfdGhpcy5pdGVtcztcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRGaWx0ZXIgPSBfLmZpcnN0KF90aGlzLmZpbHRlcnMsIGZ1bmN0aW9uIChmaWx0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJbJ2RlZmF1bHQnXSA9PT0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChfdGhpcy5tYXNvbnJ5X2NvbnRhaW5lcikuY3ViZXBvcnRmb2xpbyh7XG4gICAgICAgICAgICBmaWx0ZXJzOiAnI2ZpbHRlcnNfY29udGFpbmVyJyxcbiAgICAgICAgICAgIGxheW91dE1vZGU6ICdncmlkJyxcbiAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXI6ICcuJyArIGRlZmF1bHRGaWx0ZXIudGFnLFxuICAgICAgICAgICAgYW5pbWF0aW9uVHlwZTogJ2ZsaXBPdXREZWxheScsXG4gICAgICAgICAgICBnYXBIb3Jpem9udGFsOiAyNSxcbiAgICAgICAgICAgIGdhcFZlcnRpY2FsOiAyNSxcbiAgICAgICAgICAgIGdyaWRBZGp1c3RtZW50OiAncmVzcG9uc2l2ZScsXG4gICAgICAgICAgICBtZWRpYVF1ZXJpZXM6IFt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDExMDAsXG4gICAgICAgICAgICAgICAgY29sczogNFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgICAgICAgICAgY29sczogM1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgICAgICAgICAgY29sczogMlxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAzMjAsXG4gICAgICAgICAgICAgICAgY29sczogMVxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBkaXNwbGF5VHlwZTogJ2xhenlMb2FkaW5nJyxcbiAgICAgICAgICAgIGRpc3BsYXlUeXBlU3BlZWQ6IDEwMFxuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1mb290ZXInLCAnPGZvb3RlciBpZD1cImZvb3RlclwiPiA8ZGl2IGlkPVwiY29udGFjdFwiIGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz57IGRhdGEuYWJvdXQudGl0bGUgfTwvaDM+IDxwIHN0eWxlPVwiY29sb3I6ICNmZmY7XCI+eyBkYXRhLmFib3V0LnRleHQgfTwvcD4gPHVsIGNsYXNzPVwibGlzdC11bnN0eWxlZCBjb250YWN0XCI+IDxsaSBlYWNoPVwieyBfLnNvcnRCeShkYXRhLmNvbnRhY3QsXFwnb3JkZXJcXCcpIH1cIj4gPHAgc3R5bGU9XCJjb2xvcjogI2ZmZjtcIj4gPHN0cm9uZz4gPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT57IHRpdGxlIHx8IFxcJ1xcJyB9IDwvc3Ryb25nPiA8YSBpZj1cInsgbGluayB9XCIgaHJlZj1cInsgbGluayB9XCIgc3R5bGU9XCJjb2xvcjogI2ZmZlwiID57IHRleHQgfHwgbGluayB9PC9hPiA8c3BhbiBpZj1cInsgIWxpbmsgfVwiPnsgdGV4dCB9PC9zcGFuPiA8L3A+IDwvbGk+IDwvdWw+IDx1bCBpZD1cInNvY2lhbF9mb2xsb3dcIiBjbGFzcz1cImxpc3QtaW5saW5lIHNvY2lhbC0xXCI+IDxsaSBlYWNoPVwieyBfLnNvcnRCeShkYXRhLmFib3V0LnNvY2lhbCwgXFwnb3JkZXJcXCcpIH1cIj4gPGEgaHJlZj1cInsgbGluayB9XCIgYWx0PVwieyB0aXRsZSB9XCI+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDwvYT4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS02IG1hcmdpbjMwIGhpZGRlbi14cyBoaWRkZW4tc21cIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPkZvbGxvdyBVczwvaDM+IDxhIGlmPVwieyBzb2NpYWwudHdpdHRlciB9XCIgY2xhc3M9XCJ0d2l0dGVyLXRpbWVsaW5lXCIgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20veyBzb2NpYWwudHdpdHRlci50aXRsZSB9XCIgZGF0YS13aWRnZXQtaWQ9XCJ7IHNvY2lhbC50d2l0dGVyLmFwaSB9XCI+VHdlZXRzIGJ5IEB7IHNvY2lhbC50d2l0dGVyLnRpdGxlIH08L2E+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNiBtYXJnaW4zMCBoaWRkZW4teHMgaGlkZGVuLXNtXCIgc3R5bGU9XCJwYWRkaW5nLXJpZ2h0OiAxcHg7XCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5MaWtlIFVzPC9oMz4gPGRpdiBpZj1cInsgc29jaWFsLmZhY2Vib29rIH1cIiBjbGFzcz1cImZiLXBhZ2VcIiBkYXRhLWhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20veyBzb2NpYWwuZmFjZWJvb2sudGl0bGUgfVwiIGRhdGEtc21hbGwtaGVhZGVyPVwidHJ1ZVwiIGRhdGEtYWRhcHQtY29udGFpbmVyLXdpZHRoPVwidHJ1ZVwiIGRhdGEtaGlkZS1jb3Zlcj1cImZhbHNlXCIgZGF0YS1zaG93LWZhY2VwaWxlPVwidHJ1ZVwiIGRhdGEtaGVpZ2h0PVwiMzAwXCIgZGF0YS1zaG93LXBvc3RzPVwidHJ1ZVwiPiA8ZGl2IGNsYXNzPVwiZmIteGZibWwtcGFyc2UtaWdub3JlXCI+IDxibG9ja3F1b3RlIGNpdGU9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20veyBzb2NpYWwuZmFjZWJvb2sudGl0bGUgfVwiPiA8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3sgc29jaWFsLmZhY2Vib29rLnRpdGxlIH1cIj57IHRpdGxlIH08L2E+IDwvYmxvY2txdW90ZT4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlmPVwieyBkYXRhLmNvcHlyaWdodCB9XCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWJ0bVwiPiA8c3Bhbj4gPHJhdyBjb250ZW50PVwieyBkYXRhLmNvcHlyaWdodC50ZXh0IH1cIj48L3Jhdz4gPC9zcGFuPiA8aW1nIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7IG1hcmdpbi1sZWZ0OiBhdXRvOyBtYXJnaW4tcmlnaHQ6IGF1dG87IGhlaWdodDogNSU7IHdpZHRoOiA1JTtcIiByaW90LXNyYz1cInsgdXJsK2RhdGEuY29weXJpZ2h0LmltZytcXCc/Y29weTFcXCcgfVwiPjwvaW1nPiA8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogOHB4O1wiPnsgZGF0YS5jb3B5cmlnaHQubGljZW5zZSB9PC9zcGFuPiA8aW1nIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7IG1hcmdpbi1sZWZ0OiBhdXRvOyBtYXJnaW4tcmlnaHQ6IGF1dG87IGhlaWdodDogMyU7IHdpZHRoOiAzJTtcIiByaW90LXNyYz1cInsgdXJsK2RhdGEuY29weXJpZ2h0LmltZzIrXFwnP2NvcHkyXFwnIH1cIj48L2ltZz4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZm9vdGVyPicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCdzaXRlJyk7XG5cbnRoaXMuc29jaWFsID0gbnVsbDtcbnRoaXMuZGF0YSA9IG51bGw7XG50aGlzLnRpdGxlID0gRnJvbnRFbmQuY29uZmlnLnNpdGUudGl0bGU7XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvZm9vdGVyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3NvY2lhbCcpLnRoZW4oZnVuY3Rpb24gKHNvY2lhbCkge1xuICAgICAgICAgICAgX3RoaXMuc29jaWFsID0gc29jaWFsO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICBGcm9udEVuZC5pbml0U29jaWFsKCk7XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWltcGFjdCcsICc8c2VjdGlvbj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMiBpZj1cInsgaGVhZGVyIH1cIj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJsZWFkXCI+IHsgaGVhZGVyLnRleHQgfSA8L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9XCJpbXBhY3Rfc2xpZGVyXCIgY2xhc3M9XCJvd2wtY2Fyb3VzZWxcIj4gPGRpdiBjbGFzcz1cIml0ZW1cIiBlYWNoPVwieyBpdGVtcyB9XCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGltZyBpZj1cInsgaW1nIH1cIiB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMTI1cHhcIiByaW90LXNyYz1cInsgcGFyZW50LnVybCB9aW1wYWN0L3sgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgJ2lkPVwiaW1wYWN0XCInLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL2ltcGFjdCcpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLml0ZW1zLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMuaW1wYWN0X3NsaWRlcikub3dsQ2Fyb3VzZWwoe1xuICAgICAgICAgICAgYXV0b1BsYXk6IDUwMDAsXG4gICAgICAgICAgICBwYWdpbmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGl0ZW1zOiA0LFxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgaXRlbXNEZXNrdG9wU21hbGw6IFs5OTEsIDJdXG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1haW4nLCAnPHBhZ2UtYmFubmVyPjwvcGFnZS1iYW5uZXI+IDxkaXYgY2xhc3M9XCJkaXZpZGU2MFwiPjwvZGl2PiA8cGFnZS1tZXNzYWdlPjwvcGFnZS1tZXNzYWdlPiA8ZGl2IGNsYXNzPVwiZGl2aWRlODBcIj48L2Rpdj4gPHBhZ2UtbWV0aG9kb2xvZ3k+PC9wYWdlLW1ldGhvZG9sb2d5PiA8ZGl2IGNsYXNzPVwiZGl2aWRlNTBcIj48L2Rpdj4gPHBhZ2UtdGVzdGltb25pYWxzPjwvcGFnZS10ZXN0aW1vbmlhbHM+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8cGFnZS1pbXBhY3Q+PC9wYWdlLWltcGFjdD4gPGRpdiBjbGFzcz1cImRpdmlkZTUwXCI+PC9kaXY+IDxwYWdlLWNvdW50bWVpbj48L3BhZ2UtY291bnRtZWluPiA8ZGl2IGNsYXNzPVwiZGl2aWRlNzBcIj48L2Rpdj4gPHBhZ2UtbmV3cz48L3BhZ2UtbmV3cz4gPGRpdiBjbGFzcz1cImRpdmlkZTUwXCI+PC9kaXY+IDxkaXYgaWQ9XCJleHBsb3JlX2NvbnRhaW5lclwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImRpdmlkZTQwXCI+PC9kaXY+JywgJ2lkPVwibWFpblwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnZhciBpc1NhZmFyaSA9IC9TYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FwcGxlIENvbXB1dGVyLy50ZXN0KG5hdmlnYXRvci52ZW5kb3IpO1xuaWYgKCFpc1NhZmFyaSkge1xuICAgIHRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByaW90Lm1vdW50KF90aGlzLmV4cGxvcmVfY29udGFpbmVyLCAncGFnZS1leHBsb3JlJywgeyBpdGVtczogW10gfSk7XG4gICAgICAgIH0sIDI1MCk7XG4gICAgfSk7XG59XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVzc2FnZScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+PHJhdyBjb250ZW50PVwieyBoZWFkZXIudGV4dCB9XCI+PC9yYXc+IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvdyBzcGVjaWFsLWZlYXR1cmVcIj4gPGRpdiBlYWNoPVwieyBpdGVtcyB9XCIgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBtYXJnaW4xMFwiPiA8ZGl2IGNsYXNzPVwicy1mZWF0dXJlLWJveCB0ZXh0LWNlbnRlciB3b3cgYW5pbWF0ZWQgZmFkZUluXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMjAwbXNcIj4gPGRpdiBjbGFzcz1cIm1hc2stdG9wXCI+ICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiAgPGg0PnsgdGl0bGUgfTwvaDQ+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibWFzay1ib3R0b21cIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gIDxwPnsgdGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgJ2lkPVwibWVzc2FnZVwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuaGVhZGVyID0ge307XG50aGlzLml0ZW1zID0gW107XG5cbkZyb250RW5kLk1ldGFGaXJlLmdldERhdGEoRnJvbnRFbmQuc2l0ZSArICcvbWVzc2FnZScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICBfdGhpcy5pdGVtcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuaXRlbXMsICdvcmRlcicpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB3aW5kb3cuRnJvbnRFbmQuZXJyb3IoZSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWV0aG9kb2xvZ3knLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgY2xhc3M9XCJsZWFkXCI+eyBoZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiZGl2aWRlMzBcIj48L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoND57IGZyYW1ld29ya3MuaGVhZGVyLnRpdGxlIH08L2g0PiA8cCBjbGFzcz1cImxlYWRcIj57IGZyYW1ld29ya3MuaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDxkaXYgY2xhc3M9XCJwYW5lbC1ncm91cFwiIGlkPVwiZnJhbWV3b3Jrc1wiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBfLnNvcnRCeShmcmFtZXdvcmtzLml0ZW1zLCBcXCdvcmRlclxcJykgfVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPiA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiA8aDQgY2xhc3M9XCJwYW5lbC10aXRsZVwiPiA8YSBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS1wYXJlbnQ9XCIjZnJhbWV3b3Jrc1wiIGhyZWY9XCIjY29sbGFwc2VGcmFtZXdvcmtzX3sgaSB9XCI+IHsgdmFsLnRpdGxlIH0gPC9hPiA8L2g0PiA8L2Rpdj4gPGRpdiBpZD1cImNvbGxhcHNlRnJhbWV3b3Jrc197IGkgfVwiIGNsYXNzPVwicGFuZWwtY29sbGFwc2UgY29sbGFwc2UgeyBpbjogaSA9PSAwIH1cIj4gPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4geyB2YWwudGV4dCB9IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtNlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGg0PnsgcGFydG5lcnMuaGVhZGVyLnRpdGxlIH08L2g0PiA8cCBjbGFzcz1cImxlYWRcIj57IHBhcnRuZXJzLmhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicGFuZWwtZ3JvdXBcIiBpZD1cImFjY29yZGlvblwiPiA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiBfLnNvcnRCeShwYXJ0bmVycy5pdGVtcywgXFwnb3JkZXJcXCcpIH1cIiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj4gPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gPGg0IGNsYXNzPVwicGFuZWwtdGl0bGVcIj4gPGEgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtcGFyZW50PVwiI2FjY29yZGlvblwiIGhyZWY9XCIjY29sbGFwc2VPbmVfeyBpIH1cIj4geyB2YWwudGl0bGUgfSA8L2E+IDwvaDQ+IDwvZGl2PiA8ZGl2IGlkPVwiY29sbGFwc2VPbmVfeyBpIH1cIiBjbGFzcz1cInBhbmVsLWNvbGxhcHNlIGNvbGxhcHNlIHsgaW46IGkgPT0gMCB9XCI+IDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+IHsgdmFsLnRleHQgfSA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCAnaWQ9XCJtZXRob2RvbG9neVwiJywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9tZXRob2RvbG9neScpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuZnJhbWV3b3JrcyA9IGRhdGEuZnJhbWV3b3JrcztcbiAgICAgICAgX3RoaXMucGFydG5lcnMgPSBkYXRhLnBhcnRuZXJzO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1lbnUtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIj4gPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+IDxsaSBjbGFzcz1cInsgZHJvcGRvd246IHRydWUsIGFjdGl2ZTogaSA9PSAwIH1cIiBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YSB9XCI+IDxhIGlmPVwieyB2YWwudGl0bGUgfVwiIGhyZWY9XCJ7IHZhbC5saW5rIHx8IFxcJyNcXCcgfVwiIHRhcmdldD1cInsgX2JsYW5rOiB2YWwubGluay5zdGFydHNXaXRoKFxcJ2h0dHBcXCcpIH1cIiA+IDxpIGlmPVwieyB2YWwuaWNvbiB9XCIgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIiA+PC9pPiB7IHZhbC50aXRsZSB9IDxpIGlmPVwieyB2YWwubWVudSAmJiB2YWwubWVudS5sZW5ndGggfVwiIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiID48L2k+IDwvYT4gPC9saT4gPC91bD4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL25hdmJhcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5hdmJhcicsICc8ZGl2IGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1zdGF0aWMtdG9wIHlhbW0gc3RpY2t5XCIgcm9sZT1cIm5hdmlnYXRpb25cIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwibmF2YmFyLWhlYWRlclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5hdmJhci10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+IDxzcGFuIGNsYXNzPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8L2J1dHRvbj4gPGRpdj4gPGEgaHJlZj1cIiNob21lXCI+PGltZyBpZj1cInsgZGF0YSB9XCIgc3R5bGU9XCJtYXJnaW4tdG9wOiA3cHg7IG1hcmdpbi1yaWdodDogMTVweDtcIiByaW90LXNyYz1cInsgdXJsIH1zaXRlL3sgZGF0YS5pbWcgfVwiIGFsdD1cInsgZGF0YS5hbHQgfVwiPiA8L2E+IDwvZGl2PiA8L2Rpdj4gPHBhZ2UtbWVudS1uYXZiYXI+PC9wYWdlLW1lbnUtbmF2YmFyPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9sb2dvJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAkKFwiLnN0aWNreVwiKS5zdGlja3koeyB0b3BTcGFjaW5nOiAwIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5ld3MnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGgzIGNsYXNzPVwiaGVhZGluZ1wiPkxhdGVzdCBOZXdzPC9oMz4gPGRpdiBpZD1cIm5ld3NfY2Fyb3VzZWxcIiBjbGFzcz1cIm93bC1jYXJvdXNlbCBvd2wtc3BhY2VkXCI+IDxkaXYgZWFjaD1cInsgZGF0YSB9XCI+IDxkaXYgY2xhc3M9XCJuZXdzLWRlc2NcIj4gPHA+IDxhIGhyZWY9XCJ7IGxpbmsgfVwiIHRhcmdldD1cIl9ibGFua1wiPnsgSHVtYW5pemUudHJ1bmNhdGUodGl0bGUsIDEyNSkgfTwvYT4gPC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsICdpZD1cIm5ld3NcIicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBbXTtcblxuRnJvbnRFbmQuTWV0YUZpcmUuZ2V0RGF0YShGcm9udEVuZC5zaXRlICsgJy9uZXdzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAkKF90aGlzLm5ld3NfY2Fyb3VzZWwpLm93bENhcm91c2VsKHtcbiAgICAgICAgICAgIC8vIE1vc3QgaW1wb3J0YW50IG93bCBmZWF0dXJlc1xuICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICBpdGVtc0N1c3RvbTogZmFsc2UsXG4gICAgICAgICAgICBpdGVtc0Rlc2t0b3A6IFsxMTk5LCA0XSxcbiAgICAgICAgICAgIGl0ZW1zRGVza3RvcFNtYWxsOiBbOTgwLCAyXSxcbiAgICAgICAgICAgIGl0ZW1zVGFibGV0OiBbNzY4LCAyXSxcbiAgICAgICAgICAgIGl0ZW1zVGFibGV0U21hbGw6IGZhbHNlLFxuICAgICAgICAgICAgaXRlbXNNb2JpbGU6IFs0NzksIDFdLFxuICAgICAgICAgICAgc2luZ2xlSXRlbTogZmFsc2UsXG4gICAgICAgICAgICBzdGFydERyYWdnaW5nOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1BsYXk6IDUwMDAsXG4gICAgICAgICAgICBsb29wOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2luZG93LkZyb250RW5kLmVycm9yKGUpO1xuICAgIH1cbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRlc3RpbW9uaWFscycsICc8ZGl2IGlkPVwidGVzdGltb25pYWxzLWNhcm91c2VsXCIgY2xhc3M9XCJ0ZXN0aW1vbmlhbHMgdGVzdGltb25pYWxzLXYtMiB3b3cgYW5pbWF0ZWQgZmFkZUluVXBcIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIxMDBtc1wiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD57IGhlYWRlci50ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBpZD1cInRlc3RpbW9uaWFsX3NsaWRlXCIgY2xhc3M9XCJ0ZXN0aS1zbGlkZVwiPiA8dWwgY2xhc3M9XCJzbGlkZXNcIj4gPGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj4gPGltZyByaW90LXNyYz1cInsgcGFyZW50LnVybCArIGltZyB9XCIgYWx0PVwieyB1c2VyIH1cIj4gPGg0PiA8aSBjbGFzcz1cImZhIGZhLXF1b3RlLWxlZnQgaW9uLXF1b3RlXCI+PC9pPiB7IHRleHR9IDwvaDQ+IDxwIGNsYXNzPVwidGVzdC1hdXRob3JcIj4geyB1c2VyIH0gLSA8ZW0+eyBzdWJ0ZXh0IH08L2VtPiA8L3A+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoJ3Rlc3RpbW9uaWFscycpO1xuXG5Gcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3Rlc3RpbW9uaWFscycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgICBfdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgX3RoaXMuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLml0ZW1zLCAnb3JkZXInKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQoX3RoaXMudGVzdGltb25pYWxfc2xpZGUpLmZsZXhzbGlkZXIoe1xuICAgICAgICAgICAgc2xpZGVzaG93U3BlZWQ6IDUwMDAsXG4gICAgICAgICAgICBkaXJlY3Rpb25OYXY6IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcImZhZGVcIlxuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHdpbmRvdy5Gcm9udEVuZC5lcnJvcihlKTtcbiAgICB9XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnYmxvZy1wYWdlJywgJzxkaXYgaWY9XCJvcHRzXCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPC9kaXY+IDxpZnJhbWUgaWY9XCJ7IGRhdGEueW91dHViZWlkIH1cIiBpZD1cInl0cGxheWVyXCIgdHlwZT1cInRleHQvaHRtbFwiIHdpZHRoPVwiNzIwXCIgaGVpZ2h0PVwiNDA1XCIgcmlvdC1zcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC97IGRhdGEueW91dHViZWlkIH0/YXV0b3BsYXk9MVwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj1cIlwiIGNsYXNzPVwiZml0dmlkc1wiIHN0eWxlPVwiaGVpZ2h0OiA0MDVweDsgd2lkdGg6IDcyMHB4OyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bztcIj48L2lmcmFtZT4gPGlmcmFtZSBpZj1cInsgZGF0YS52aW1lb2lkIH1cIiByaW90LXNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby97IGRhdGEudmltZW9pZCB9XCIgd2lkdGg9XCI3MjBcIiBoZWlnaHQ9XCI0MDVcIiBmcmFtZWJvcmRlcj1cIjBcIiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW49XCJcIiBtb3phbGxvd2Z1bGxzY3JlZW49XCJcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBjbGFzcz1cImZpdHZpZHNcIiBzdHlsZT1cImhlaWdodDogNDA1cHg7IHdpZHRoOiA3MjBweDsgZGlzcGxheTogYmxvY2s7IG1hcmdpbi1sZWZ0OiBhdXRvOyBtYXJnaW4tcmlnaHQ6IGF1dG87XCI+PC9pZnJhbWU+IDxkaXYgaWY9XCJ7IGJsb2cgfVwiIGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgPiA8cmF3IGNvbnRlbnQ9XCJ7IGJsb2cgfVwiPjwvcmF3PiA8L2Rpdj4gPGJ1dHRvbnMgYnV0dG9ucz1cInsgZGF0YS5idXR0b25zIH1cIj48L2J1dHRvbnM+IDwvZGl2PiA8L2Rpdj4gPGJ1dHRvbnMgaWY9XCJ7ICFibG9nIH1cIiBidXR0b25zPVwieyBkYXRhLmJ1dHRvbnMgfVwiPjwvYnV0dG9ucz4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLmV2ZW50LmlkKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBvcHRzLmV2ZW50Lml0ZW07XG5cbiAgICAgICAgX3RoaXMudXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgdmFyIHJlZiA9IEZyb250RW5kLk1ldGFGaXJlLmdldENoaWxkKEZyb250RW5kLnNpdGUgKyAnL2NvbnRlbnQvJyArIG9wdHMuZXZlbnQuaWQpO1xuICAgICAgICB2YXIgZmlyZXBhZCA9IG5ldyBGaXJlcGFkLkhlYWRsZXNzKHJlZik7XG4gICAgICAgIGZpcmVwYWQuZ2V0SHRtbChmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICAgICAgX3RoaXMuYmxvZyA9IGh0bWw7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ21hbmlmZXN0by1wYWdlJywgJzxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPiA8cmF3IGNvbnRlbnQ9XCJ7IGRhdGEudGV4dCB9XCI+PC9yYXc+IDwvcD4gPGltZyBzcmM9XCJodHRwczovL2M2OGY3OTgxYThiYmU5MjZhMWUwMTU0Y2JmYmQ1YWYxYjRkZjBmMjEuZ29vZ2xlZHJpdmUuY29tL2hvc3QvMEI2R0FONGdYMWJuU2ZsUm5kVFJKZUZaNU5Fc3pTRUZsU3pWS1pEWkpTekZ4ZURkaWNGcG9MWFZ3U0RORlJXTjBSRmhmUzJjL2NybGFiL3NpdGUvbWFuaWZlc3RvX3Bvc3Rlcl9ub19kaWFncmFtLnBuZ1wiIGFsdD1cIlN5c3RlbXMgVGhpbmtpbmcgTWFuaWZlc3RvXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiPjwvaW1nPiA8L2Rpdj4gPGRpdiBpZj1cInsgYmxvZyB9XCIgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiA+IDxyYXcgY29udGVudD1cInsgYmxvZyB9XCI+PC9yYXc+IDwvZGl2PiA8YnV0dG9ucyBidXR0b25zPVwieyBkYXRhLmJ1dHRvbnMgfVwiPjwvYnV0dG9ucz4gPC9kaXY+IDwvZGl2PiA8YnV0dG9ucyBpZj1cInsgIWJsb2cgfVwiIGJ1dHRvbnM9XCJ7IGRhdGEuYnV0dG9ucyB9XCI+PC9idXR0b25zPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChvcHRzICYmIG9wdHMuZXZlbnQuaWQpIHtcbiAgICAgICAgX3RoaXMuZGF0YSA9IG9wdHMuZXZlbnQuaXRlbTtcblxuICAgICAgICBfdGhpcy51cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICB2YXIgcmVmID0gRnJvbnRFbmQuTWV0YUZpcmUuZ2V0Q2hpbGQoRnJvbnRFbmQuc2l0ZSArICcvY29udGVudC9zeXN0ZW1zLXRoaW5raW5nLW1hbmlmZXN0bycpO1xuICAgICAgICB2YXIgZmlyZXBhZCA9IG5ldyBGaXJlcGFkLkhlYWRsZXNzKHJlZik7XG4gICAgICAgIGZpcmVwYWQuZ2V0SHRtbChmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICAgICAgX3RoaXMuYmxvZyA9IGh0bWw7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ25vdC1mb3VuZC1wYWdlJywgJzxkaXYgY2xhc3M9XCJkaXZpZGU4MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWNlbnRlciBlcnJvci10ZXh0XCI+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8aDEgY2xhc3M9XCJlcnJvci1kaWdpdCB3b3cgYW5pbWF0ZWQgZmFkZUluVXAgbWFyZ2luMjAgYW5pbWF0ZWRcIiBzdHlsZT1cInZpc2liaWxpdHk6IHZpc2libGU7IGFuaW1hdGlvbi1uYW1lOiBmYWRlSW5VcDsgLXdlYmtpdC1hbmltYXRpb24tbmFtZTogZmFkZUluVXA7XCI+PGkgY2xhc3M9XCJmYSBmYS10aHVtYnMtZG93blwiPjwvaT48L2gxPiA8aDI+eyBkYXRhLm1lc3NhZ2UgfTwvaDI+IDxwPjxhIGhyZWY9XCIjZXhwbG9yZVwiIGNsYXNzPVwiYnRuIGJ0bi1sZyBidG4tdGhlbWUtZGFya1wiPkdvIEJhY2s8L2E+PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSB7XG4gICAgbWVzc2FnZTogJ09vcHMsIHRoYXQgcGFnZSBjb3VsZCBub3QgYmUgZm91bmQhJ1xufTtcblxudGhpcy5vbignbW91bnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc3Rtcy1wYWdlJywgJzxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGRhdGEuaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cD4gPHJhdyBjb250ZW50PVwieyBkYXRhLmhlYWRlci50ZXh0IH1cIj48L3Jhdz4gPC9wPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGVhY2g9XCJ7IF8uc29ydEJ5KGRhdGEuaXRlbXMsXFwnb3JkZXJcXCcpIH1cIiBjbGFzcz1cImNvbC1zbS02XCI+IDxkaXYgPiA8aWZyYW1lIGlmPVwieyB5b3V0dWJlaWQgfVwiIGlkPVwieXRwbGF5ZXJfeyB5b3V0dWJlaWQgfVwiIHR5cGU9XCJ0ZXh0L2h0bWxcIiBoZWlnaHQ9XCI0MDBcIiByaW90LXNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgeW91dHViZWlkIH0/YXV0b3BsYXk9MFwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj1cIlwiPjwvaWZyYW1lPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IG51bGw7XG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICBGcm9udEVuZC5NZXRhRmlyZS5nZXREYXRhKEZyb250RW5kLnNpdGUgKyAnL3N0bXMnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcbn0pO1xufSk7Il19
