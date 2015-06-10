(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CRLab = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

require('./tags/page-banner.tag');
require('./tags/page-impact.tag');
require('./tags/page-countmein.tag');
require('./tags/page-footer.tag');
require('./tags/page-navbar-menu.tag');
require('./tags/page-navbar.tag');
require('./tags/page-news.tag');
require('./tags/page-projects.tag');
require('./tags/page-message.tag');
require('./tags/page-testimonials.tag');

var configMixin = require('./js/mixins/config.js');
riot.mixin('config', configMixin);

var CRLab = require('./CRLab');
module.exports = new CRLab();

},{"./CRLab":2,"./js/mixins/config.js":6,"./tags/page-banner.tag":7,"./tags/page-countmein.tag":8,"./tags/page-footer.tag":9,"./tags/page-impact.tag":10,"./tags/page-message.tag":11,"./tags/page-navbar-menu.tag":12,"./tags/page-navbar.tag":13,"./tags/page-news.tag":14,"./tags/page-projects.tag":15,"./tags/page-testimonials.tag":16,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');

var CRLab = (function () {
    function CRLab() {
        _classCallCheck(this, CRLab);

        this.MetaFire = new MetaFire();
        this.Auth0 = new Auth0();
        usersnap();
    }

    _createClass(CRLab, [{
        key: 'site',
        get: function () {
            return 'crlab';
        }
    }, {
        key: 'init',
        value: function init() {
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

    return CRLab;
})();

module.exports = CRLab;

},{"./js/integrations/auth0":3,"./js/integrations/firebase":4,"./js/integrations/usersnap":5}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Auth0Lock = require('auth0-lock');

var Auth0 = (function () {
    function Auth0() {
        _classCallCheck(this, Auth0);

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
                callbackURL: 'https://popping-fire-897.firebaseapp.com/',
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

var MetaFire = (function () {
    function MetaFire() {
        _classCallCheck(this, MetaFire);

        this.fb = new Firebase('https://popping-fire-897.firebaseio.com');
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
'use strict';

var config = {
    pathImg: function pathImg() {
        return CRLab.site + '/dist/img/';
    }
};

module.exports = config;

},{}],7:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li data-transition="fade" data-slotamount="5" data-masterspeed="1000" data-title="Powerful Theme">  <img src="crlab/dist/img/site/book_banner.png" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> Become a <br> Systems Thinker </div> <div class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> Solve everyday and wicked problems. <br> Increase your personal effectiveness. <br> Transform your organization. <br> This book is for anyone interested in learning <br> the foundational ideas of systems thinking. </div> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="355" data-speed="500" data-start="1800" data-easing="Sine.easeOut"> <a href="#" class="btn btn-theme-bg btn-lg">Pre-order Now</a> </div> </li> </ul> </div> </div>', function(opts) {
this.data = [];
this.mixin("config");
this.url = this.pathImg();

$(this.tp_banner).revolution({
    delay: 6000,
    startwidth: 1170,
    startheight: 600,
    hideThumbs: 10,
    //fullWidth: "on",
    //forceFullWidth: "on",
    lazyLoad: "on"
    // navigationStyle: "preview4"
});

//CRLab.MetaFire.getData(CRLab.site + '/banner').then( (data) => {
//    this.data = data;
//    this.update();
//})
});
},{"riot":"riot"}],8:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section class="fun-fact-wrap fun-facts-bg"> <div class="container"> <div class="row"> <div class="col-md-4 margin20 facts-in"> <h3> <span class="counter">876,539</span> + </h3> <h4>Systems Thinkers</h4> </div>  <div class="col-md-4 margin20 facts-in"> <h3> <span style="border: 1px;" class="">Count Me In</span> </h3> <h4></h4> </div> </div> </div> </section>', function(opts) {
});
},{"riot":"riot"}],9:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>About assan</h3> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing condimentum tristique vel, eleifend sed turpis. Pellentesque cursus arcu id magna euismod in elementum purus molestie. </p> <ul class="list-inline social-1"> <li> <a href="#"> <i class="fa fa-facebook"></i> </a> </li> <li> <a href="#"> <i class="fa fa-twitter"></i> </a> </li> <li> <a href="#"> <i class="fa fa-google-plus"></i> </a> </li> <li> <a href="#"> <i class="fa fa-pinterest"></i> </a> </li> <li> <a href="#"> <i class="fa fa-dribbble"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Contact</h3> <ul class="list-unstyled contact"> <li> <p> <strong> <i class="fa fa-map-marker"></i> Address: </strong> vaisahali, jaipur, 302012 </p> </li> <li> <p> <strong> <i class="fa fa-envelope"></i> Mail Us: </strong> <a href="#">Support@designmylife.com</a> </p> </li> <li> <p> <strong> <i class="fa fa-phone"></i> Phone: </strong> +91 1800 2345 2132 </p> </li> <li> <p> <strong> <i class="fa fa-print"></i> Fax </strong> 1800 2345 2132 </p> </li> <li> <p> <strong> <i class="fa fa-skype"></i> Skype </strong> assan.856 </p> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Featured Work</h3> <ul class="list-inline f2-work"> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-1.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-2.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-3.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-4.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-5.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-6.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-7.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-8.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-9.jpg" class="img-responsive" alt=""> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Newsletter</h3> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, </p> <form role="form" class="subscribe-form"> <div class="input-group"> <input type="text" class="form-control" placeholder="Enter email to subscribe"> <span class="input-group-btn"> <button class="btn btn-theme-dark btn-lg" type="submit">Ok</button> </span> </div> </form> </div> </div>  </div> <div class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span>&copy;2014. Theme by Design_mylife</span> </div> </div> </div> </div> </footer>', function(opts) {
this.mixin('config');
this.url = this.pathImg() + 'temp/';
});
},{"riot":"riot"}],10:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-impact', '<section id="impact_carousel"> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2 if="{ header }">{ header.title }</h2> <span class="center-line"></span> <p if="{ header }" class="lead"> { header.text } </p> </div> </div> </div> <div id="impact_slider"> <div class="item" each="{ items }"> <a href="javascript:;"> <img width="200px" height="125px" riot-src="{ parent.url }impact/{ img }" alt="{ title }"> </a> </div> </div> </div> </section>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

CRLab.MetaFire.getData(CRLab.site + '/impact').then(function (data) {
    _this.header = data.header;
    _this.items = data.items;
    _this.update();

    $(_this.impact_slider).owlCarousel({
        autoPlay: 3000,
        pagination: false,
        items: 4,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [991, 2]
    });
});
});
},{"riot":"riot"}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-message', '<div class="container"> <div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p>{ header.text }</p> </div> </div> </div> <div class="row special-feature"> <div each="{ items }" class="col-md-4 col-sm-4 margin10"> <div class="s-feature-box text-center wow animated fadeIn" data-wow-duration="700ms" data-wow-delay="200ms"> <div class="mask-top">  <i class="{ icon }"></i>  <h4>{ title }</h4> </div> <div class="mask-bottom">  <i class="{ icon }"></i>  <h4>{ title }</h4>  <p>{ text }</p> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.header = {};
this.items = [];
CRLab.MetaFire.getData(CRLab.site + '/message').then(function (data) {
    _this.header = data.header;
    _this.items = data.items;
    _this.update();
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-menu-navbar', '<div class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li class="{ dropdown: true, active: data && data.indexOf(this) == 1}" each="{ data }"> <a if="{ title }" href="#" class="dropdown-toggle" data-toggle="dropdown"> <i if="{ icon }" class="{ icon }" ></i> { title } <i if="{ menu && menu.length }" class="fa fa-angle-down" ></i> </a> <ul if="{ menu && menu.length }" class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu"> <li each="{ menu }" > <a href="#"> <i if="{ icon }" class="{ icon }"></i> <span class="title">{ title }</span> </a> </li> </ul> </li> </ul> </div>', function(opts) {
var that = this;
that.data = [];
CRLab.MetaFire.getData(CRLab.site + '/navbar').then(function (data) {
    that.data = data;
    that.update();
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#"> <img if="{ data }" height="21px" width="21px" riot-src="{ url }site/{ data.img }" alt="{ data.alt }"> </a> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

CRLab.MetaFire.getData(CRLab.site + '/logo').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-news', '<div class="container"> <div class="row"> <div class="col-md-12"> <h3 class="heading">Latest News</h3> <div id="news_carousel" class="owl-carousel owl-spaced"> <div each="{ data }">   <div class="news-desc"> <h5> <a href="{ by ? link : \'javascript:;\' }" target="_blank">{ Humanize.truncate(title, 125) }</a> </h5> </div> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.data = [];

CRLab.MetaFire.getData(CRLab.site + '/news').then(function (data) {
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
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-projects', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>Explore</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div class="container"> <div class="cube-masonry"> <div id="filters-container" class="cbp-l-filters-alignCenter"> <div data-filter=".featured" class="cbp-filter-item-active cbp-filter-item"> Featured <div class="cbp-filter-counter"></div> </div> <div data-filter=".publications" class="cbp-filter-item"> Publications <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics" class="cbp-filter-item"> Infographics <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Software <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Products <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Videos <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Training <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Speaking <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Special Projects <div class="cbp-filter-counter"></div> </div> <div data-filter="*" class=" cbp-filter-item"> All <div class="cbp-filter-counter"></div> </div> </div> <div id="masnory-container" class="cbp"> <div class="cbp-item featured"> <a class="cbp-caption cbp-lightbox" data-title="Easy Note"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }mas-1.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Easy Note</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> <div class="cbp-item publications"> <a class="cbp-caption cbp-lightbox" data-title="The Gang Blue"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }img-1.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">The Gang Blue</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> <div class="cbp-item infographics featured"> <a class="cbp-caption cbp-lightbox" data-title="Tiger"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }img-2.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Tiger</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> <div class="cbp-item infographics"> <a class="cbp-caption cbp-lightbox" data-title="Flat Roman Typeface Ui"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }mas-2.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Flat Roman Typeface Ui</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> <div class="cbp-item featured"> <a class="cbp-caption cbp-lightbox" data-title="Seemple* Music for iPad"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }mas-1.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Seemple* Music for iPad</div> <div class="cbp-l-caption-desc">by Tiberiu Neamu</div> </div> </div> </div> </a> </div> <div class="cbp-item infographics"> <a class="cbp-caption cbp-lightbox" data-title="Remind~Me More"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }img-3.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Remind~Me More</div> <div class="cbp-l-caption-desc">by Tiberiu Neamu</div> </div> </div> </div> </a> </div> <div class="cbp-item publications"> <a class="cbp-caption cbp-lightbox" data-title="Workout Buddy"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }img-4.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Workout Buddy</div> <div class="cbp-l-caption-desc">by Tiberiu Neamu</div> </div> </div> </div> </a> </div> <div class="cbp-item featured"> <a class="cbp-caption cbp-lightbox" data-title="Volume Knob"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }img-5.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Volume Knob</div> <div class="cbp-l-caption-desc">by Paul Flavius Nechita</div> </div> </div> </div> </a> </div> <div class="cbp-item featured"> <a class="cbp-caption cbp-lightbox" data-title="Ski * Buddy"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }mas-1.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Ski * Buddy</div> <div class="cbp-l-caption-desc">by Tiberiu Neamu</div> </div> </div> </div> </a> </div> <div class="cbp-item publications infographics"> <a class="cbp-caption cbp-lightbox" data-title="Virtualization Icon"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }img-6.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Virtualization Icon</div> <div class="cbp-l-caption-desc">by Paul Flavius Nechita</div> </div> </div> </div> </a> </div> <div class="cbp-item publications infographics"> <a class="cbp-caption cbp-lightbox" data-title="World Clock Widget"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }img-7.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">World Clock Widget</div> <div class="cbp-l-caption-desc">by Paul Flavius Nechita</div> </div> </div> </div> </a> </div> <div class="cbp-item publications infographics"> <a class="cbp-caption cbp-lightbox" data-title="Sickpuppy"> <div class="cbp-caption-defaultWrap"> <img riot-src="{ url }img-8.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Sickpuppy</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="masonry-portfolio-4.html" class="btn btn-theme-dark btn-lg">View All Work</a> </div>', function(opts) {
this.mixin('config');
this.url = this.pathImg() + 'temp/';
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-testimonials', '<div id="testimonials-carousel" class="testimonials-v-2 wow animated fadeInUp" data-wow-duration="700ms" data-wow-delay="100ms"> <div class="container"> <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> </div> </div> </div>  <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div id="testimonial_slide" class="testi-slide"> <ul class="slides"> <li each="{ items }"> <img riot-src="{ parent.url + img }" alt="{ user }"> <p> <i class="ion-quote"></i> { text} </p> <h4 class="test-author"> { user } - <em>{ subtext }</em> </h4> </li> </ul> </div> </div> </div> <div class="divide30"></div> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg() + 'testimonials/';

CRLab.MetaFire.getData(CRLab.site + '/testimonials').then(function (data) {
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
},{"riot":"riot"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvQ1JMYWIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvY3JsYWIvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2NybGFiL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImNybGFiL3NyYy90YWdzL3BhZ2UtYmFubmVyLnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtY291bnRtZWluLnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtZm9vdGVyLnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtaW1wYWN0LnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtbWVzc2FnZS50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLW5hdmJhci1tZW51LnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtbmF2YmFyLnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtbmV3cy50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLXByb2plY3RzLnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtdGVzdGltb25pYWxzLnRhZyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUIsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFD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b290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCdiYWJlbC9wb2x5ZmlsbCcpO1xyXG53aW5kb3cucmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxud2luZG93Ll8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxud2luZG93LlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5yZXF1aXJlKCdjb3JlLWpzJyk7XHJcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5yZXF1aXJlKCdqcXVlcnktdWknKTtcclxucmVxdWlyZSgnYm9vdHN0cmFwJyk7XHJcbndpbmRvdy5GaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbndpbmRvdy5IdW1hbml6ZSA9IHJlcXVpcmUoJ2h1bWFuaXplLXBsdXMnKTtcclxud2luZG93Lm1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG53aW5kb3cuVVJJID0gcmVxdWlyZSgnVVJJanMnKTtcclxud2luZG93LmxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKTtcclxuXHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWJhbm5lci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtaW1wYWN0LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1jb3VudG1laW4udGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWZvb3Rlci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLW1lbnUudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmV3cy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtcHJvamVjdHMudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW1lc3NhZ2UudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWcnKTtcclxuXHJcbnZhciBjb25maWdNaXhpbiA9IHJlcXVpcmUoJy4vanMvbWl4aW5zL2NvbmZpZy5qcycpO1xyXG5yaW90Lm1peGluKCdjb25maWcnLCBjb25maWdNaXhpbik7XHJcblxyXG52YXIgQ1JMYWIgPSByZXF1aXJlKCcuL0NSTGFiJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IENSTGFiKCk7IiwidmFyIE1ldGFGaXJlID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UnKTtcclxudmFyIEF1dGgwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAnKTtcclxudmFyIHVzZXJzbmFwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAnKTtcclxuXHJcbmNsYXNzIENSTGFiIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IG5ldyBNZXRhRmlyZSgpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAoKTtcclxuICAgICAgICB1c2Vyc25hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXRlKCkge1xyXG4gICAgICAgIHJldHVybiAnY3JsYWInO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgcmlvdC5tb3VudCgnKicpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dvdXQoKTtcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ291dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENSTGFiOyIsImxldCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJyk7XG5cbmNsYXNzIEF1dGgwIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKCd3c09uYXJ0MjN5VmlJU2hxVDR3ZkoxOHcydnQyY2wzMicsICdtZXRhbWFwLmF1dGgwLmNvbScpO1xuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoYXQuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocHJvZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubG9jay5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIHByb2ZpbGUsIGlkX3Rva2VuLCBjdG9rZW4sIG9wdCwgcmVmcmVzaF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncmVmcmVzaF90b2tlbicsIHJlZnJlc2hfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnByb2ZpbGUgPSBwcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBsaW5rQWNjb3VudCgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICBjYWxsYmFja1VSTDogJ2h0dHBzOi8vcG9wcGluZy1maXJlLTg5Ny5maXJlYmFzZWFwcC5jb20vJyxcbiAgICAgICAgICAgIGRpY3Q6IHtcbiAgICAgICAgICAgICAgICBzaWduaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGF0LmlkX3Rva2VuIHx8IHRoYXQucHJvZmlsZS5pZGVudGl0aWVzWzBdLmFjY2Vzc190b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRTZXNzaW9uKCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGxldCBnZXRQcm9maWxlID0gKGlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgZnVuY3Rpb24oZXJyLCBwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSwgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZ1bGZpbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgncmVmcmVzaF90b2tlbicpLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVmcmVzaF90b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmxvY2suZ2V0Q2xpZW50KCkucmVmcmVzaFRva2VuKHRva2VuLCAoYSwgdG9rT2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKHRva09iai5pZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdpZF90b2tlbicpLnRoZW4oKGlkX3Rva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKGlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ2lkX3Rva2VuJyk7XG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3JlZnJlc2hfdG9rZW4nKTtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgncHJvZmlsZScpO1xuICAgICAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcblxuXG4iLCJsZXQgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xuXG5jbGFzcyBNZXRhRmlyZSB7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3BvcHBpbmctZmlyZS04OTcuZmlyZWJhc2Vpby5jb21cIik7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgbGV0IHJldCA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5BdXRoMC5sb2NrLmdldENsaWVudCgpLmdldERlbGVnYXRpb25Ub2tlbih7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHByb2ZpbGUuY2xpZW50SUQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogaWRfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGlfdHlwZTogJ2ZpcmViYXNlJ1xuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBkZWxlZ2F0aW9uUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2ZpcmViYXNlX3Rva2VuJywgdGhhdC5maXJlYmFzZV90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZiLmF1dGhXaXRoQ3VzdG9tVG9rZW4odGhhdC5maXJlYmFzZV90b2tlbiwgKGVycm9yLCBhdXRoRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcbiAgICB9XG5cbiAgICBnZXREYXRhIChwYXRoKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY2hpbGQub24oJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzbmFwc2hvdC52YWwoKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgc2V0RGF0YSAoZGF0YSwgcGF0aCkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSk7XG4gICAgfVxuXG4gICAgbG9nb3V0ICgpIHtcbiAgICAgICAgdGhpcy5mYi51bmF1dGgoKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1ldGFGaXJlO1xuXG5cbiIsIlxudmFyIHVzZXJTbmFwID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgdmFyIGFwaUtleSA9ICcwMzJiYWY4Ny04NTQ1LTRlYmMtYTU1Ny05MzQ4NTkzNzFmYTUuanMnLCBzLCB4O1xuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxuICAgIGFwaUtleSA9IGNvbmZpZy5VU0VSX1NOQVBfQVBJX0tFWTtcbiAgICBpZiAoYXBpS2V5ICYmIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSAhPT0gJ2xvY2FsaG9zdCcpIHtcclxuICAgICAgICB3aW5kb3cudXNlcnNuYXBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIG1vZGU6ICdyZXBvcnQnLFxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXG4gICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNuYXAuc2V0RW1haWxCb3goRG9jLmFwcC51c2VyLnVzZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XG4gICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgIHMuYXN5bmMgPSB0cnVlO1xuICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICByZXR1cm4geC5hcHBlbmRDaGlsZChzKTtcclxuICAgIH1cclxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcblxuXG4iLCJsZXQgY29uZmlnID0ge1xyXG4gICAgcGF0aEltZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIENSTGFiLnNpdGUgKyAnL2Rpc3QvaW1nLyc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYmFubmVyJywgJzxkaXYgY2xhc3M9XCJmdWxsd2lkdGhiYW5uZXJcIj4gPGRpdiBpZD1cInRwX2Jhbm5lclwiIGNsYXNzPVwidHAtYmFubmVyXCI+IDx1bD4gIDxsaSBkYXRhLXRyYW5zaXRpb249XCJmYWRlXCIgZGF0YS1zbG90YW1vdW50PVwiNVwiIGRhdGEtbWFzdGVyc3BlZWQ9XCIxMDAwXCIgZGF0YS10aXRsZT1cIlBvd2VyZnVsIFRoZW1lXCI+ICA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL3NpdGUvYm9va19iYW5uZXIucG5nXCIgYWx0PVwiZGFya2JsdXJiZ1wiIGRhdGEtYmdmaXQ9XCJjb3ZlclwiIGRhdGEtYmdwb3NpdGlvbj1cImxlZnQgdG9wXCIgZGF0YS1iZ3JlcGVhdD1cIm5vLXJlcGVhdFwiPiA8ZGl2IGNsYXNzPVwiY2FwdGlvbiB0aXRsZS0yIHNmdFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMTAwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTAwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gQmVjb21lIGEgPGJyPiBTeXN0ZW1zIFRoaW5rZXIgPC9kaXY+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHRleHQgc2ZsXCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIyMjBcIiBkYXRhLXNwZWVkPVwiMTAwMFwiIGRhdGEtc3RhcnQ9XCIxODAwXCIgZGF0YS1lYXNpbmc9XCJlYXNlT3V0RXhwb1wiPiBTb2x2ZSBldmVyeWRheSBhbmQgd2lja2VkIHByb2JsZW1zLiA8YnI+IEluY3JlYXNlIHlvdXIgcGVyc29uYWwgZWZmZWN0aXZlbmVzcy4gPGJyPiBUcmFuc2Zvcm0geW91ciBvcmdhbml6YXRpb24uIDxicj4gVGhpcyBib29rIGlzIGZvciBhbnlvbmUgaW50ZXJlc3RlZCBpbiBsZWFybmluZyA8YnI+IHRoZSBmb3VuZGF0aW9uYWwgaWRlYXMgb2Ygc3lzdGVtcyB0aGlua2luZy4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHNmYiByZXYtYnV0dG9ucyB0cC1yZXNpemVtZVwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMzU1XCIgZGF0YS1zcGVlZD1cIjUwMFwiIGRhdGEtc3RhcnQ9XCIxODAwXCIgZGF0YS1lYXNpbmc9XCJTaW5lLmVhc2VPdXRcIj4gPGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0biBidG4tdGhlbWUtYmcgYnRuLWxnXCI+UHJlLW9yZGVyIE5vdzwvYT4gPC9kaXY+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG50aGlzLmRhdGEgPSBbXTtcbnRoaXMubWl4aW4oXCJjb25maWdcIik7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG4kKHRoaXMudHBfYmFubmVyKS5yZXZvbHV0aW9uKHtcbiAgICBkZWxheTogNjAwMCxcbiAgICBzdGFydHdpZHRoOiAxMTcwLFxuICAgIHN0YXJ0aGVpZ2h0OiA2MDAsXG4gICAgaGlkZVRodW1iczogMTAsXG4gICAgLy9mdWxsV2lkdGg6IFwib25cIixcbiAgICAvL2ZvcmNlRnVsbFdpZHRoOiBcIm9uXCIsXG4gICAgbGF6eUxvYWQ6IFwib25cIlxuICAgIC8vIG5hdmlnYXRpb25TdHlsZTogXCJwcmV2aWV3NFwiXG59KTtcblxuLy9DUkxhYi5NZXRhRmlyZS5nZXREYXRhKENSTGFiLnNpdGUgKyAnL2Jhbm5lcicpLnRoZW4oIChkYXRhKSA9PiB7XG4vLyAgICB0aGlzLmRhdGEgPSBkYXRhO1xuLy8gICAgdGhpcy51cGRhdGUoKTtcbi8vfSlcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb3VudG1laW4nLCAnPHNlY3Rpb24gY2xhc3M9XCJmdW4tZmFjdC13cmFwIGZ1bi1mYWN0cy1iZ1wiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC00IG1hcmdpbjIwIGZhY3RzLWluXCI+IDxoMz4gPHNwYW4gY2xhc3M9XCJjb3VudGVyXCI+ODc2LDUzOTwvc3Bhbj4gKyA8L2gzPiA8aDQ+U3lzdGVtcyBUaGlua2VyczwvaDQ+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC00IG1hcmdpbjIwIGZhY3RzLWluXCI+IDxoMz4gPHNwYW4gc3R5bGU9XCJib3JkZXI6IDFweDtcIiBjbGFzcz1cIlwiPkNvdW50IE1lIEluPC9zcGFuPiA8L2gzPiA8aDQ+PC9oND4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9zZWN0aW9uPicsIGZ1bmN0aW9uKG9wdHMpIHtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1mb290ZXInLCAnPGZvb3RlciBpZD1cImZvb3RlclwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5BYm91dCBhc3NhbjwvaDM+IDxwPiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LiBJbnRlZ2VyIGxvcmVtIHF1YW0sIGFkaXBpc2NpbmcgY29uZGltZW50dW0gdHJpc3RpcXVlIHZlbCwgZWxlaWZlbmQgc2VkIHR1cnBpcy4gUGVsbGVudGVzcXVlIGN1cnN1cyBhcmN1IGlkIG1hZ25hIGV1aXNtb2QgaW4gZWxlbWVudHVtIHB1cnVzIG1vbGVzdGllLiA8L3A+IDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHNvY2lhbC0xXCI+IDxsaT4gPGEgaHJlZj1cIiNcIj4gPGkgY2xhc3M9XCJmYSBmYS1mYWNlYm9va1wiPjwvaT4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCIjXCI+IDxpIGNsYXNzPVwiZmEgZmEtdHdpdHRlclwiPjwvaT4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCIjXCI+IDxpIGNsYXNzPVwiZmEgZmEtZ29vZ2xlLXBsdXNcIj48L2k+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiI1wiPiA8aSBjbGFzcz1cImZhIGZhLXBpbnRlcmVzdFwiPjwvaT4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCIjXCI+IDxpIGNsYXNzPVwiZmEgZmEtZHJpYmJibGVcIj48L2k+IDwvYT4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5Db250YWN0PC9oMz4gPHVsIGNsYXNzPVwibGlzdC11bnN0eWxlZCBjb250YWN0XCI+IDxsaT4gPHA+IDxzdHJvbmc+IDxpIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiPjwvaT4gQWRkcmVzczogPC9zdHJvbmc+IHZhaXNhaGFsaSwgamFpcHVyLCAzMDIwMTIgPC9wPiA8L2xpPiA8bGk+IDxwPiA8c3Ryb25nPiA8aSBjbGFzcz1cImZhIGZhLWVudmVsb3BlXCI+PC9pPiBNYWlsIFVzOiA8L3N0cm9uZz4gPGEgaHJlZj1cIiNcIj5TdXBwb3J0QGRlc2lnbm15bGlmZS5jb208L2E+IDwvcD4gPC9saT4gPGxpPiA8cD4gPHN0cm9uZz4gPGkgY2xhc3M9XCJmYSBmYS1waG9uZVwiPjwvaT4gUGhvbmU6IDwvc3Ryb25nPiArOTEgMTgwMCAyMzQ1IDIxMzIgPC9wPiA8L2xpPiA8bGk+IDxwPiA8c3Ryb25nPiA8aSBjbGFzcz1cImZhIGZhLXByaW50XCI+PC9pPiBGYXggPC9zdHJvbmc+IDE4MDAgMjM0NSAyMTMyIDwvcD4gPC9saT4gPGxpPiA8cD4gPHN0cm9uZz4gPGkgY2xhc3M9XCJmYSBmYS1za3lwZVwiPjwvaT4gU2t5cGUgPC9zdHJvbmc+IGFzc2FuLjg1NiA8L3A+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+RmVhdHVyZWQgV29yazwvaDM+IDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIGYyLXdvcmtcIj4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTEuanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy0yLmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctMy5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTQuanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy01LmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctNi5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTcuanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy04LmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctOS5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5OZXdzbGV0dGVyPC9oMz4gPHA+IExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIEludGVnZXIgbG9yZW0gcXVhbSwgPC9wPiA8Zm9ybSByb2xlPVwiZm9ybVwiIGNsYXNzPVwic3Vic2NyaWJlLWZvcm1cIj4gPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+IDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCB0byBzdWJzY3JpYmVcIj4gPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tdGhlbWUtZGFyayBidG4tbGdcIiB0eXBlPVwic3VibWl0XCI+T2s8L2J1dHRvbj4gPC9zcGFuPiA8L2Rpdj4gPC9mb3JtPiA8L2Rpdj4gPC9kaXY+ICA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtY2VudGVyXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItYnRtXCI+IDxzcGFuPiZjb3B5OzIwMTQuIFRoZW1lIGJ5IERlc2lnbl9teWxpZmU8L3NwYW4+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Zvb3Rlcj4nLCBmdW5jdGlvbihvcHRzKSB7XG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCkgKyAndGVtcC8nO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWltcGFjdCcsICc8c2VjdGlvbiBpZD1cImltcGFjdF9jYXJvdXNlbFwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyIGlmPVwieyBoZWFkZXIgfVwiPnsgaGVhZGVyLnRpdGxlIH08L2gyPiA8c3BhbiBjbGFzcz1cImNlbnRlci1saW5lXCI+PC9zcGFuPiA8cCBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImxlYWRcIj4geyBoZWFkZXIudGV4dCB9IDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cImltcGFjdF9zbGlkZXJcIj4gPGRpdiBjbGFzcz1cIml0ZW1cIiBlYWNoPVwieyBpdGVtcyB9XCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGltZyB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMTI1cHhcIiByaW90LXNyYz1cInsgcGFyZW50LnVybCB9aW1wYWN0L3sgaW1nIH1cIiBhbHQ9XCJ7IHRpdGxlIH1cIj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKTtcblxuQ1JMYWIuTWV0YUZpcmUuZ2V0RGF0YShDUkxhYi5zaXRlICsgJy9pbXBhY3QnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgJChfdGhpcy5pbXBhY3Rfc2xpZGVyKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgIGF1dG9QbGF5OiAzMDAwLFxuICAgICAgICBwYWdpbmF0aW9uOiBmYWxzZSxcbiAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDNdLFxuICAgICAgICBpdGVtc0Rlc2t0b3BTbWFsbDogWzk5MSwgMl1cbiAgICB9KTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1lc3NhZ2UnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPnsgaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvdyBzcGVjaWFsLWZlYXR1cmVcIj4gPGRpdiBlYWNoPVwieyBpdGVtcyB9XCIgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBtYXJnaW4xMFwiPiA8ZGl2IGNsYXNzPVwicy1mZWF0dXJlLWJveCB0ZXh0LWNlbnRlciB3b3cgYW5pbWF0ZWQgZmFkZUluXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMjAwbXNcIj4gPGRpdiBjbGFzcz1cIm1hc2stdG9wXCI+ICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiAgPGg0PnsgdGl0bGUgfTwvaDQ+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibWFzay1ib3R0b21cIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gIDxwPnsgdGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuaGVhZGVyID0ge307XG50aGlzLml0ZW1zID0gW107XG5DUkxhYi5NZXRhRmlyZS5nZXREYXRhKENSTGFiLnNpdGUgKyAnL21lc3NhZ2UnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVudS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPiA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj4gPGxpIGNsYXNzPVwieyBkcm9wZG93bjogdHJ1ZSwgYWN0aXZlOiBkYXRhICYmIGRhdGEuaW5kZXhPZih0aGlzKSA9PSAxfVwiIGVhY2g9XCJ7IGRhdGEgfVwiPiA8YSBpZj1cInsgdGl0bGUgfVwiIGhyZWY9XCIjXCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+IDxpIGlmPVwieyBpY29uIH1cIiBjbGFzcz1cInsgaWNvbiB9XCIgPjwvaT4geyB0aXRsZSB9IDxpIGlmPVwieyBtZW51ICYmIG1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIiA+PC9pPiA8L2E+IDx1bCBpZj1cInsgbWVudSAmJiBtZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJkcm9wZG93bi1tZW51IG11bHRpLWxldmVsXCIgcm9sZT1cIm1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJkcm9wZG93bk1lbnVcIj4gPGxpIGVhY2g9XCJ7IG1lbnUgfVwiID4gPGEgaHJlZj1cIiNcIj4gPGkgaWY9XCJ7IGljb24gfVwiIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xudmFyIHRoYXQgPSB0aGlzO1xudGhhdC5kYXRhID0gW107XG5DUkxhYi5NZXRhRmlyZS5nZXREYXRhKENSTGFiLnNpdGUgKyAnL25hdmJhcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGF0LmRhdGEgPSBkYXRhO1xuICAgIHRoYXQudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItc3RhdGljLXRvcCB5YW1tIHN0aWNreVwiIHJvbGU9XCJuYXZpZ2F0aW9uXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cIm5hdmJhci1oZWFkZXJcIj4gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuYXZiYXItdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1jb2xsYXBzZVwiPiA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJpY29uLWJhclwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJpY29uLWJhclwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJpY29uLWJhclwiPjwvc3Bhbj4gPC9idXR0b24+IDxhIGNsYXNzPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIiNcIj4gPGltZyBpZj1cInsgZGF0YSB9XCIgaGVpZ2h0PVwiMjFweFwiIHdpZHRoPVwiMjFweFwiIHJpb3Qtc3JjPVwieyB1cmwgfXNpdGUveyBkYXRhLmltZyB9XCIgYWx0PVwieyBkYXRhLmFsdCB9XCI+IDwvYT4gPC9kaXY+IDxwYWdlLW1lbnUtbmF2YmFyPjwvcGFnZS1tZW51LW5hdmJhcj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbkNSTGFiLk1ldGFGaXJlLmdldERhdGEoQ1JMYWIuc2l0ZSArICcvbG9nbycpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5ld3MnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj4gPGgzIGNsYXNzPVwiaGVhZGluZ1wiPkxhdGVzdCBOZXdzPC9oMz4gPGRpdiBpZD1cIm5ld3NfY2Fyb3VzZWxcIiBjbGFzcz1cIm93bC1jYXJvdXNlbCBvd2wtc3BhY2VkXCI+IDxkaXYgZWFjaD1cInsgZGF0YSB9XCI+ICAgPGRpdiBjbGFzcz1cIm5ld3MtZGVzY1wiPiA8aDU+IDxhIGhyZWY9XCJ7IGJ5ID8gbGluayA6IFxcJ2phdmFzY3JpcHQ6O1xcJyB9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+eyBIdW1hbml6ZS50cnVuY2F0ZSh0aXRsZSwgMTI1KSB9PC9hPiA8L2g1PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHt2YXIgX3RoaXMgPSB0aGlzO1xuXG50aGlzLmRhdGEgPSBbXTtcblxuQ1JMYWIuTWV0YUZpcmUuZ2V0RGF0YShDUkxhYi5zaXRlICsgJy9uZXdzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5kYXRhID0gXy50b0FycmF5KGRhdGEpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgJChfdGhpcy5uZXdzX2Nhcm91c2VsKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICAgICAgLy8gTW9zdCBpbXBvcnRhbnQgb3dsIGZlYXR1cmVzXG4gICAgICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICAgICAgaXRlbXNDdXN0b206IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcFNtYWxsOiBbOTgwLCAyXSxcbiAgICAgICAgICAgICAgICBpdGVtc1RhYmxldDogWzc2OCwgMl0sXG4gICAgICAgICAgICAgICAgaXRlbXNUYWJsZXRTbWFsbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXNNb2JpbGU6IFs0NzksIDFdLFxuICAgICAgICAgICAgICAgIHNpbmdsZUl0ZW06IGZhbHNlLFxuICAgICAgICAgICAgICAgIHN0YXJ0RHJhZ2dpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6IDQwMDBcbiAgICAgICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1wcm9qZWN0cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPiA8c3Ryb25nPkV4cGxvcmU8L3N0cm9uZz4gPC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cImN1YmUtbWFzb25yeVwiPiA8ZGl2IGlkPVwiZmlsdGVycy1jb250YWluZXJcIiBjbGFzcz1cImNicC1sLWZpbHRlcnMtYWxpZ25DZW50ZXJcIj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtLWFjdGl2ZSBjYnAtZmlsdGVyLWl0ZW1cIj4gRmVhdHVyZWQgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5wdWJsaWNhdGlvbnNcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBQdWJsaWNhdGlvbnMgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3NcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBJbmZvZ3JhcGhpY3MgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3MsIC5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtXCI+IFNvZnR3YXJlIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDxkaXYgZGF0YS1maWx0ZXI9XCIuaW5mb2dyYXBoaWNzLCAuZmVhdHVyZWRcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBQcm9kdWN0cyA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGRhdGEtZmlsdGVyPVwiLmluZm9ncmFwaGljcywgLmZlYXR1cmVkXCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW1cIj4gVmlkZW9zIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDxkaXYgZGF0YS1maWx0ZXI9XCIuaW5mb2dyYXBoaWNzLCAuZmVhdHVyZWRcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBUcmFpbmluZyA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGRhdGEtZmlsdGVyPVwiLmluZm9ncmFwaGljcywgLmZlYXR1cmVkXCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW1cIj4gU3BlYWtpbmcgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3MsIC5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtXCI+IFNwZWNpYWwgUHJvamVjdHMgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIipcIiBjbGFzcz1cIiBjYnAtZmlsdGVyLWl0ZW1cIj4gQWxsIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwibWFzbm9yeS1jb250YWluZXJcIiBjbGFzcz1cImNicFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gZmVhdHVyZWRcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiRWFzeSBOb3RlXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfW1hcy0xLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPkVhc3kgTm90ZTwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1kZXNjXCI+YnkgQ29zbWluIENhcGl0YW51PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBwdWJsaWNhdGlvbnNcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiVGhlIEdhbmcgQmx1ZVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctMS5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5UaGUgR2FuZyBCbHVlPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGluZm9ncmFwaGljcyBmZWF0dXJlZFwiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJUaWdlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctMi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5UaWdlcjwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1kZXNjXCI+YnkgQ29zbWluIENhcGl0YW51PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiRmxhdCBSb21hbiBUeXBlZmFjZSBVaVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1tYXMtMi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5GbGF0IFJvbWFuIFR5cGVmYWNlIFVpPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGZlYXR1cmVkXCI+IDxhIGNsYXNzPVwiY2JwLWNhcHRpb24gY2JwLWxpZ2h0Ym94XCIgZGF0YS10aXRsZT1cIlNlZW1wbGUqIE11c2ljIGZvciBpUGFkXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfW1hcy0xLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPlNlZW1wbGUqIE11c2ljIGZvciBpUGFkPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBUaWJlcml1IE5lYW11PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiUmVtaW5kfk1lIE1vcmVcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTMuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+UmVtaW5kfk1lIE1vcmU8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIHB1YmxpY2F0aW9uc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJXb3Jrb3V0IEJ1ZGR5XCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy00LmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPldvcmtvdXQgQnVkZHk8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGZlYXR1cmVkXCI+IDxhIGNsYXNzPVwiY2JwLWNhcHRpb24gY2JwLWxpZ2h0Ym94XCIgZGF0YS10aXRsZT1cIlZvbHVtZSBLbm9iXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy01LmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPlZvbHVtZSBLbm9iPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gZmVhdHVyZWRcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiU2tpICogQnVkZHlcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9bWFzLTEuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+U2tpICogQnVkZHk8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIHB1YmxpY2F0aW9ucyBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiVmlydHVhbGl6YXRpb24gSWNvblwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctNi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5WaXJ0dWFsaXphdGlvbiBJY29uPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gcHVibGljYXRpb25zIGluZm9ncmFwaGljc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJXb3JsZCBDbG9jayBXaWRnZXRcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTcuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+V29ybGQgQ2xvY2sgV2lkZ2V0PC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gcHVibGljYXRpb25zIGluZm9ncmFwaGljc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJTaWNrcHVwcHlcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTguanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+U2lja3B1cHB5PC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cIm1hc29ucnktcG9ydGZvbGlvLTQuaHRtbFwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPlZpZXcgQWxsIFdvcms8L2E+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKSArICd0ZW1wLyc7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtdGVzdGltb25pYWxzJywgJzxkaXYgaWQ9XCJ0ZXN0aW1vbmlhbHMtY2Fyb3VzZWxcIiBjbGFzcz1cInRlc3RpbW9uaWFscy12LTIgd293IGFuaW1hdGVkIGZhZGVJblVwXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMTAwbXNcIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPiA8ZGl2IGlkPVwidGVzdGltb25pYWxfc2xpZGVcIiBjbGFzcz1cInRlc3RpLXNsaWRlXCI+IDx1bCBjbGFzcz1cInNsaWRlc1wiPiA8bGkgZWFjaD1cInsgaXRlbXMgfVwiPiA8aW1nIHJpb3Qtc3JjPVwieyBwYXJlbnQudXJsICsgaW1nIH1cIiBhbHQ9XCJ7IHVzZXIgfVwiPiA8cD4gPGkgY2xhc3M9XCJpb24tcXVvdGVcIj48L2k+IHsgdGV4dH0gPC9wPiA8aDQgY2xhc3M9XCJ0ZXN0LWF1dGhvclwiPiB7IHVzZXIgfSAtIDxlbT57IHN1YnRleHQgfTwvZW0+IDwvaDQ+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGUzMFwiPjwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKSArICd0ZXN0aW1vbmlhbHMvJztcblxuQ1JMYWIuTWV0YUZpcmUuZ2V0RGF0YShDUkxhYi5zaXRlICsgJy90ZXN0aW1vbmlhbHMnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgJChfdGhpcy50ZXN0aW1vbmlhbF9zbGlkZSkuZmxleHNsaWRlcih7XG4gICAgICAgIHNsaWRlc2hvd1NwZWVkOiA1MDAwLFxuICAgICAgICBkaXJlY3Rpb25OYXY6IGZhbHNlLFxuICAgICAgICBhbmltYXRpb246ICdmYWRlJ1xuICAgIH0pO1xufSk7XG59KTsiXX0=
