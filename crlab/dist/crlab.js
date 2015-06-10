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
require('./tags/page-clients.tag');
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

},{"./CRLab":2,"./js/mixins/config.js":6,"./tags/page-banner.tag":7,"./tags/page-clients.tag":8,"./tags/page-countmein.tag":9,"./tags/page-footer.tag":10,"./tags/page-message.tag":11,"./tags/page-navbar-menu.tag":12,"./tags/page-navbar.tag":13,"./tags/page-news.tag":14,"./tags/page-projects.tag":15,"./tags/page-testimonials.tag":16,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],2:[function(require,module,exports){
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

//CRLab.MetaFire.getData('crlab/banner').then( (data) => {
//    this.data = data;
//    this.update();
//})
});
},{"riot":"riot"}],8:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-clients', '<section id="clients-carousel"> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2>Collective Impact</h2> <span class="center-line"></span> <p class="lead"> The collective impact of our research and work spans many public and private organizations and individuals. </p> </div> </div> </div> <div id="clients-slider"> <div class="item"> <a href="#"> <img riot-src="{ url }cl-1.png" alt=""> </a> </div> <div class="item"> <a href="#"> <img riot-src="{ url }cl-2.png" alt=""> </a> </div> <div class="item"> <a href="#"> <img riot-src="{ url }cl-3.png" alt=""> </a> </div> <div class="item"> <a href="#"> <img riot-src="{ url }cl-4.png" alt=""> </a> </div> <div class="item"> <a href="#"> <img riot-src="{ url }cl-5.png" alt=""> </a> </div> </div> </div> </section>', function(opts) {
this.mixin('config');
this.url = this.pathImg() + 'temp/';
});
},{"riot":"riot"}],9:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section class="fun-fact-wrap fun-facts-bg"> <div class="container"> <div class="row"> <div class="col-md-4 margin20 facts-in"> <h3> <span class="counter">876,539</span> + </h3> <h4>Systems Thinkers</h4> </div>  <div class="col-md-4 margin20 facts-in"> <h3> <span style="border: 1px;" class="">Count Me In</span> </h3> <h4></h4> </div> </div> </div> </section>', function(opts) {
});
},{"riot":"riot"}],10:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>About assan</h3> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing condimentum tristique vel, eleifend sed turpis. Pellentesque cursus arcu id magna euismod in elementum purus molestie. </p> <ul class="list-inline social-1"> <li> <a href="#"> <i class="fa fa-facebook"></i> </a> </li> <li> <a href="#"> <i class="fa fa-twitter"></i> </a> </li> <li> <a href="#"> <i class="fa fa-google-plus"></i> </a> </li> <li> <a href="#"> <i class="fa fa-pinterest"></i> </a> </li> <li> <a href="#"> <i class="fa fa-dribbble"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Contact</h3> <ul class="list-unstyled contact"> <li> <p> <strong> <i class="fa fa-map-marker"></i> Address: </strong> vaisahali, jaipur, 302012 </p> </li> <li> <p> <strong> <i class="fa fa-envelope"></i> Mail Us: </strong> <a href="#">Support@designmylife.com</a> </p> </li> <li> <p> <strong> <i class="fa fa-phone"></i> Phone: </strong> +91 1800 2345 2132 </p> </li> <li> <p> <strong> <i class="fa fa-print"></i> Fax </strong> 1800 2345 2132 </p> </li> <li> <p> <strong> <i class="fa fa-skype"></i> Skype </strong> assan.856 </p> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Featured Work</h3> <ul class="list-inline f2-work"> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-1.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-2.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-3.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-4.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-5.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-6.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-7.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-8.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img riot-src="{ url }img-9.jpg" class="img-responsive" alt=""> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Newsletter</h3> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, </p> <form role="form" class="subscribe-form"> <div class="input-group"> <input type="text" class="form-control" placeholder="Enter email to subscribe"> <span class="input-group-btn"> <button class="btn btn-theme-dark btn-lg" type="submit">Ok</button> </span> </div> </form> </div> </div>  </div> <div class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span>&copy;2014. Theme by Design_mylife</span> </div> </div> </div> </div> </footer>', function(opts) {
this.mixin('config');
this.url = this.pathImg() + 'temp/';
});
},{"riot":"riot"}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-message', '<div class="container"> <div class="row"> <div class="col-sm-12 "> <div class="center-heading"> <h2>{ header.title }</h2> <span class="center-line"></span> <p>{ header.text }</p> </div> </div> </div> <div class="row special-feature"> <div each="{ items }" class="col-md-4 col-sm-4 margin10"> <div class="s-feature-box text-center wow animated fadeIn" data-wow-duration="700ms" data-wow-delay="200ms"> <div class="mask-top">  <i class="{ icon }"></i>  <h4>{ title }</h4> </div> <div class="mask-bottom">  <i class="{ icon }"></i>  <h4>{ title }</h4>  <p>{ text }</p> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.header = {};
this.items = [];
CRLab.MetaFire.getData('crlab/message').then(function (data) {
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
CRLab.MetaFire.getData('crlab/navbar').then(function (data) {
    that.data = data;
    that.update();
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#"> <img if="{ data }" height="21px" width="21px" riot-src="{ url }site/{ data.img }" alt="{ data.alt }"> </a> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {var _this = this;

this.mixin('config');
this.url = this.pathImg();

CRLab.MetaFire.getData('crlab/logo').then(function (data) {
    _this.data = data;
    _this.update();
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-news', '<div class="container"> <div class="row"> <div class="col-md-12"> <h3 class="heading">Latest News</h3> <div id="news_carousel" class="owl-carousel owl-spaced"> <div each="{ data }">   <div class="news-desc"> <h5> <a href="{ by ? link : \'javascript:;\' }" target="_blank">{ Humanize.truncate(title, 125) }</a> </h5> </div> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.data = [];

CRLab.MetaFire.getData('crlab/news').then(function (data) {
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
module.exports = riot.tag('page-testimonials', '<div class="container"> <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div class="center-heading"> <h2> <strong>What</strong> Our Users Say </h2> <span class="center-line"></span> </div> </div> </div> <div class="row"> <div class="col-md-4 margin-btm-20"> <div class="quote dark"> <blockquote> <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s. </p> </blockquote> </div> <div class="quote-footer text-right"> <div class="quote-author-img"> <img riot-src="{ url }customer-1.jpg" alt=""> </div> <h4>Rakesh Sharma</h4> <p> <strong>Design_mylife</strong> </p> </div> </div>  <div class="col-md-4 margin-btm-20"> <div class="quote green"> <blockquote> <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s. </p> </blockquote> </div> <div class="quote-footer text-right"> <div class="quote-author-img"> <img riot-src="{ url }customer-2.jpg" alt=""> </div> <h4>Rakesh Sharma</h4> <p> <strong>Design_mylife</strong> </p> </div> </div>  <div class="col-md-4 margin-btm-20"> <div class="quote dark"> <blockquote> <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s. </p> </blockquote> </div> <div class="quote-footer text-right"> <div class="quote-author-img"> <img riot-src="{ url }customer-3.jpg" alt=""> </div> <h4>Rakesh Sharma</h4> <p> <strong>Design_mylife</strong> </p> </div> </div>  </div>  </div>', function(opts) {
this.mixin('config');
this.url = this.pathImg() + 'temp/';
});
},{"riot":"riot"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvQ1JMYWIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvY3JsYWIvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2NybGFiL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvanMvbWl4aW5zL2NvbmZpZy5qcyIsImNybGFiL3NyYy90YWdzL3BhZ2UtYmFubmVyLnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtY2xpZW50cy50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLWNvdW50bWVpbi50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLWZvb3Rlci50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLW1lc3NhZ2UudGFnIiwiY3JsYWIvc3JjL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLW5hdmJhci50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLW5ld3MudGFnIiwiY3JsYWIvc3JjL3RhZ3MvcGFnZS1wcm9qZWN0cy50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLXRlc3RpbW9uaWFscy50YWciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FB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QUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCO0NBQ0osQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7QUN4QjFCLElBQUksTUFBTSxHQUFHO0FBQ1QsV0FBTyxFQUFFLG1CQUFXO0FBQ2hCLGVBQU8sS0FBSyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7S0FDcEM7Q0FDSixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7QUNOeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxucmVxdWlyZSgnY29yZS1qcycpO1xyXG53aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcclxucmVxdWlyZSgnanF1ZXJ5LXVpJyk7XHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xyXG53aW5kb3cuRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xyXG53aW5kb3cuSHVtYW5pemUgPSByZXF1aXJlKCdodW1hbml6ZS1wbHVzJyk7XHJcbndpbmRvdy5tb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxud2luZG93LlVSSSA9IHJlcXVpcmUoJ1VSSWpzJyk7XHJcbndpbmRvdy5sb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJyk7XHJcblxyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1iYW5uZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWNsaWVudHMudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWNvdW50bWVpbi50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZm9vdGVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uYXZiYXItbWVudS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbmF2YmFyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uZXdzLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1wcm9qZWN0cy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbWVzc2FnZS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtdGVzdGltb25pYWxzLnRhZycpO1xyXG5cclxudmFyIGNvbmZpZ01peGluID0gcmVxdWlyZSgnLi9qcy9taXhpbnMvY29uZmlnLmpzJyk7XHJcbnJpb3QubWl4aW4oJ2NvbmZpZycsIGNvbmZpZ01peGluKTtcclxuXHJcbnZhciBDUkxhYiA9IHJlcXVpcmUoJy4vQ1JMYWInKTtcclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ1JMYWIoKTsiLCJ2YXIgTWV0YUZpcmUgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZScpO1xyXG52YXIgQXV0aDAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9hdXRoMCcpO1xyXG52YXIgdXNlcnNuYXAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcCcpO1xyXG5cclxuY2xhc3MgQ1JMYWIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlID0gbmV3IE1ldGFGaXJlKCk7XHJcbiAgICAgICAgdGhpcy5BdXRoMCA9IG5ldyBBdXRoMCgpO1xyXG4gICAgICAgIHVzZXJzbmFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdjcmxhYic7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICByaW90Lm1vdW50KCcqJyk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9naW4oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ291dCgpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9nb3V0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ1JMYWI7IiwibGV0IEF1dGgwTG9jayA9IHJlcXVpcmUoJ2F1dGgwLWxvY2snKTtcblxuY2xhc3MgQXV0aDAge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubG9jayA9IG5ldyBBdXRoMExvY2soJ3dzT25hcnQyM3lWaUlTaHFUNHdmSjE4dzJ2dDJjbDMyJywgJ21ldGFtYXAuYXV0aDAuY29tJyk7XG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5BZnRlclNpZ251cDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZTogJ29wZW5pZCBvZmZsaW5lX2FjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgcHJvZmlsZSwgaWRfdG9rZW4sIGN0b2tlbiwgb3B0LCByZWZyZXNoX3Rva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaF90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5pZF90b2tlbiA9IGlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGxpbmtBY2NvdW50KCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgIGNhbGxiYWNrVVJMOiAnaHR0cHM6Ly9wb3BwaW5nLWZpcmUtODk3LmZpcmViYXNlYXBwLmNvbS8nLFxuICAgICAgICAgICAgZGljdDoge1xuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0xpbmsgd2l0aCBhbm90aGVyIGFjY291bnQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoYXQuaWRfdG9rZW4gfHwgdGhhdC5wcm9maWxlLmlkZW50aXRpZXNbMF0uYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgbGV0IGdldFByb2ZpbGUgPSAoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQubG9jay5nZXRQcm9maWxlKGlkX3Rva2VuLCBmdW5jdGlvbihlcnIsIHByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlLCBpZF90b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgZnVsZmlsbGVkID0gZmFsc2U7XG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdyZWZyZXNoX3Rva2VuJykudGhlbigodG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoX3Rva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubG9jay5nZXRDbGllbnQoKS5yZWZyZXNoVG9rZW4odG9rZW4sIChhLCB0b2tPYmopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb2ZpbGUodG9rT2JqLmlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb2ZpbGUoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnaWRfdG9rZW4nKTtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgncmVmcmVzaF90b2tlbicpO1xuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XG4gICAgICAgIHRoaXMucHJvZmlsZSA9IG51bGw7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuXG5cbiIsImxldCBGaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XG5cbmNsYXNzIE1ldGFGaXJlIHtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShcImh0dHBzOi8vcG9wcGluZy1maXJlLTg5Ny5maXJlYmFzZWlvLmNvbVwiKTtcbiAgICB9XG5cbiAgICBsb2dpbigpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBsZXQgcmV0ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgIE1ldGFNYXAuQXV0aDAuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogcHJvZmlsZS5jbGllbnRJRCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBpZF90b2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIGRlbGVnYXRpb25SZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuZmlyZWJhc2VfdG9rZW4gPSBkZWxlZ2F0aW9uUmVzdWx0LmlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnZmlyZWJhc2VfdG9rZW4nLCB0aGF0LmZpcmViYXNlX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGF0LmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChhdXRoRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXRDaGlsZChwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xuICAgIH1cblxuICAgIGdldERhdGEgKHBhdGgpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjaGlsZC5vbigndmFsdWUnLFxuICAgICAgICAgICAgICAgIChzbmFwc2hvdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNuYXBzaG90LnZhbCgpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICBzZXREYXRhIChkYXRhLCBwYXRoKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoaWxkLnNldChkYXRhKTtcbiAgICB9XG5cbiAgICBsb2dvdXQgKCkge1xuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7XG5cblxuIiwiXG52YXIgdXNlclNuYXAgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICB2YXIgYXBpS2V5ID0gJzAzMmJhZjg3LTg1NDUtNGViYy1hNTU3LTkzNDg1OTM3MWZhNS5qcycsIHMsIHg7XG4gICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XHJcbiAgICAgICAgY29uZmlnID0ge307XHJcbiAgICB9XG4gICAgYXBpS2V5ID0gY29uZmlnLlVTRVJfU05BUF9BUElfS0VZO1xuICAgIGlmIChhcGlLZXkgJiYgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICE9PSAnbG9jYWxob3N0Jykge1xyXG4gICAgICAgIHdpbmRvdy51c2Vyc25hcGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgbW9kZTogJ3JlcG9ydCcsXG4gICAgICAgICAgICBzaG9ydGN1dDogdHJ1ZSxcbiAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU25hcC5zZXRFbWFpbEJveChEb2MuYXBwLnVzZXIudXNlck5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcbiAgICAgICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgcy5hc3luYyA9IHRydWU7XG4gICAgICAgIHMuc3JjID0gJy8vYXBpLnVzZXJzbmFwLmNvbS9sb2FkLycgKyBhcGlLZXkgKyAnLmpzJztcbiAgICAgICAgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgIHJldHVybiB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgfVxyXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVzZXJTbmFwO1xuXG5cbiIsImxldCBjb25maWcgPSB7XHJcbiAgICBwYXRoSW1nOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gQ1JMYWIuc2l0ZSArICcvZGlzdC9pbWcvJztcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29uZmlnOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1iYW5uZXInLCAnPGRpdiBjbGFzcz1cImZ1bGx3aWR0aGJhbm5lclwiPiA8ZGl2IGlkPVwidHBfYmFubmVyXCIgY2xhc3M9XCJ0cC1iYW5uZXJcIj4gPHVsPiAgPGxpIGRhdGEtdHJhbnNpdGlvbj1cImZhZGVcIiBkYXRhLXNsb3RhbW91bnQ9XCI1XCIgZGF0YS1tYXN0ZXJzcGVlZD1cIjEwMDBcIiBkYXRhLXRpdGxlPVwiUG93ZXJmdWwgVGhlbWVcIj4gIDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvc2l0ZS9ib29rX2Jhbm5lci5wbmdcIiBhbHQ9XCJkYXJrYmx1cmJnXCIgZGF0YS1iZ2ZpdD1cImNvdmVyXCIgZGF0YS1iZ3Bvc2l0aW9uPVwibGVmdCB0b3BcIiBkYXRhLWJncmVwZWF0PVwibm8tcmVwZWF0XCI+IDxkaXYgY2xhc3M9XCJjYXB0aW9uIHRpdGxlLTIgc2Z0XCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIxMDBcIiBkYXRhLXNwZWVkPVwiMTAwMFwiIGRhdGEtc3RhcnQ9XCIxMDAwXCIgZGF0YS1lYXNpbmc9XCJlYXNlT3V0RXhwb1wiPiBCZWNvbWUgYSA8YnI+IFN5c3RlbXMgVGhpbmtlciA8L2Rpdj4gPGRpdiBjbGFzcz1cImNhcHRpb24gdGV4dCBzZmxcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjIyMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IFNvbHZlIGV2ZXJ5ZGF5IGFuZCB3aWNrZWQgcHJvYmxlbXMuIDxicj4gSW5jcmVhc2UgeW91ciBwZXJzb25hbCBlZmZlY3RpdmVuZXNzLiA8YnI+IFRyYW5zZm9ybSB5b3VyIG9yZ2FuaXphdGlvbi4gPGJyPiBUaGlzIGJvb2sgaXMgZm9yIGFueW9uZSBpbnRlcmVzdGVkIGluIGxlYXJuaW5nIDxicj4gdGhlIGZvdW5kYXRpb25hbCBpZGVhcyBvZiBzeXN0ZW1zIHRoaW5raW5nLiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNhcHRpb24gc2ZiIHJldi1idXR0b25zIHRwLXJlc2l6ZW1lXCIgZGF0YS14PVwiNTBcIiBkYXRhLXk9XCIzNTVcIiBkYXRhLXNwZWVkPVwiNTAwXCIgZGF0YS1zdGFydD1cIjE4MDBcIiBkYXRhLWVhc2luZz1cIlNpbmUuZWFzZU91dFwiPiA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1iZyBidG4tbGdcIj5QcmUtb3JkZXIgTm93PC9hPiA8L2Rpdj4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbnRoaXMuZGF0YSA9IFtdO1xudGhpcy5taXhpbihcImNvbmZpZ1wiKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCk7XG5cbiQodGhpcy50cF9iYW5uZXIpLnJldm9sdXRpb24oe1xuICAgIGRlbGF5OiA2MDAwLFxuICAgIHN0YXJ0d2lkdGg6IDExNzAsXG4gICAgc3RhcnRoZWlnaHQ6IDYwMCxcbiAgICBoaWRlVGh1bWJzOiAxMCxcbiAgICAvL2Z1bGxXaWR0aDogXCJvblwiLFxuICAgIC8vZm9yY2VGdWxsV2lkdGg6IFwib25cIixcbiAgICBsYXp5TG9hZDogXCJvblwiXG4gICAgLy8gbmF2aWdhdGlvblN0eWxlOiBcInByZXZpZXc0XCJcbn0pO1xuXG4vL0NSTGFiLk1ldGFGaXJlLmdldERhdGEoJ2NybGFiL2Jhbm5lcicpLnRoZW4oIChkYXRhKSA9PiB7XG4vLyAgICB0aGlzLmRhdGEgPSBkYXRhO1xuLy8gICAgdGhpcy51cGRhdGUoKTtcbi8vfSlcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jbGllbnRzJywgJzxzZWN0aW9uIGlkPVwiY2xpZW50cy1jYXJvdXNlbFwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPkNvbGxlY3RpdmUgSW1wYWN0PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgY2xhc3M9XCJsZWFkXCI+IFRoZSBjb2xsZWN0aXZlIGltcGFjdCBvZiBvdXIgcmVzZWFyY2ggYW5kIHdvcmsgc3BhbnMgbWFueSBwdWJsaWMgYW5kIHByaXZhdGUgb3JnYW5pemF0aW9ucyBhbmQgaW5kaXZpZHVhbHMuIDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cImNsaWVudHMtc2xpZGVyXCI+IDxkaXYgY2xhc3M9XCJpdGVtXCI+IDxhIGhyZWY9XCIjXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9Y2wtMS5wbmdcIiBhbHQ9XCJcIj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cIml0ZW1cIj4gPGEgaHJlZj1cIiNcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1jbC0yLnBuZ1wiIGFsdD1cIlwiPiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiaXRlbVwiPiA8YSBocmVmPVwiI1wiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWNsLTMucG5nXCIgYWx0PVwiXCI+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJpdGVtXCI+IDxhIGhyZWY9XCIjXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9Y2wtNC5wbmdcIiBhbHQ9XCJcIj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cIml0ZW1cIj4gPGEgaHJlZj1cIiNcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1jbC01LnBuZ1wiIGFsdD1cIlwiPiA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7XG50aGlzLm1peGluKCdjb25maWcnKTtcbnRoaXMudXJsID0gdGhpcy5wYXRoSW1nKCkgKyAndGVtcC8nO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvdW50bWVpbicsICc8c2VjdGlvbiBjbGFzcz1cImZ1bi1mYWN0LXdyYXAgZnVuLWZhY3RzLWJnXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgbWFyZ2luMjAgZmFjdHMtaW5cIj4gPGgzPiA8c3BhbiBjbGFzcz1cImNvdW50ZXJcIj44NzYsNTM5PC9zcGFuPiArIDwvaDM+IDxoND5TeXN0ZW1zIFRoaW5rZXJzPC9oND4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgbWFyZ2luMjAgZmFjdHMtaW5cIj4gPGgzPiA8c3BhbiBzdHlsZT1cImJvcmRlcjogMXB4O1wiIGNsYXNzPVwiXCI+Q291bnQgTWUgSW48L3NwYW4+IDwvaDM+IDxoND48L2g0PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L3NlY3Rpb24+JywgZnVuY3Rpb24ob3B0cykge1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsICc8Zm9vdGVyIGlkPVwiZm9vdGVyXCI+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPkFib3V0IGFzc2FuPC9oMz4gPHA+IExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIEludGVnZXIgbG9yZW0gcXVhbSwgYWRpcGlzY2luZyBjb25kaW1lbnR1bSB0cmlzdGlxdWUgdmVsLCBlbGVpZmVuZCBzZWQgdHVycGlzLiBQZWxsZW50ZXNxdWUgY3Vyc3VzIGFyY3UgaWQgbWFnbmEgZXVpc21vZCBpbiBlbGVtZW50dW0gcHVydXMgbW9sZXN0aWUuIDwvcD4gPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgc29jaWFsLTFcIj4gPGxpPiA8YSBocmVmPVwiI1wiPiA8aSBjbGFzcz1cImZhIGZhLWZhY2Vib29rXCI+PC9pPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cIiNcIj4gPGkgY2xhc3M9XCJmYSBmYS10d2l0dGVyXCI+PC9pPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cIiNcIj4gPGkgY2xhc3M9XCJmYSBmYS1nb29nbGUtcGx1c1wiPjwvaT4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCIjXCI+IDxpIGNsYXNzPVwiZmEgZmEtcGludGVyZXN0XCI+PC9pPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cIiNcIj4gPGkgY2xhc3M9XCJmYSBmYS1kcmliYmJsZVwiPjwvaT4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPkNvbnRhY3Q8L2gzPiA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIGNvbnRhY3RcIj4gPGxpPiA8cD4gPHN0cm9uZz4gPGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPiBBZGRyZXNzOiA8L3N0cm9uZz4gdmFpc2FoYWxpLCBqYWlwdXIsIDMwMjAxMiA8L3A+IDwvbGk+IDxsaT4gPHA+IDxzdHJvbmc+IDxpIGNsYXNzPVwiZmEgZmEtZW52ZWxvcGVcIj48L2k+IE1haWwgVXM6IDwvc3Ryb25nPiA8YSBocmVmPVwiI1wiPlN1cHBvcnRAZGVzaWdubXlsaWZlLmNvbTwvYT4gPC9wPiA8L2xpPiA8bGk+IDxwPiA8c3Ryb25nPiA8aSBjbGFzcz1cImZhIGZhLXBob25lXCI+PC9pPiBQaG9uZTogPC9zdHJvbmc+ICs5MSAxODAwIDIzNDUgMjEzMiA8L3A+IDwvbGk+IDxsaT4gPHA+IDxzdHJvbmc+IDxpIGNsYXNzPVwiZmEgZmEtcHJpbnRcIj48L2k+IEZheCA8L3N0cm9uZz4gMTgwMCAyMzQ1IDIxMzIgPC9wPiA8L2xpPiA8bGk+IDxwPiA8c3Ryb25nPiA8aSBjbGFzcz1cImZhIGZhLXNreXBlXCI+PC9pPiBTa3lwZSA8L3N0cm9uZz4gYXNzYW4uODU2IDwvcD4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC1zbS02IG1hcmdpbjMwXCI+IDxkaXYgY2xhc3M9XCJmb290ZXItY29sXCI+IDxoMz5GZWF0dXJlZCBXb3JrPC9oMz4gPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgZjItd29ya1wiPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctMS5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTIuanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy0zLmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctNC5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTUuanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy02LmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctNy5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTguanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy05LmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPk5ld3NsZXR0ZXI8L2gzPiA8cD4gTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gSW50ZWdlciBsb3JlbSBxdWFtLCA8L3A+IDxmb3JtIHJvbGU9XCJmb3JtXCIgY2xhc3M9XCJzdWJzY3JpYmUtZm9ybVwiPiA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cIkVudGVyIGVtYWlsIHRvIHN1YnNjcmliZVwiPiA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiIHR5cGU9XCJzdWJtaXRcIj5PazwvYnV0dG9uPiA8L3NwYW4+IDwvZGl2PiA8L2Zvcm0+IDwvZGl2PiA8L2Rpdj4gIDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1jZW50ZXJcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1idG1cIj4gPHNwYW4+JmNvcHk7MjAxNC4gVGhlbWUgYnkgRGVzaWduX215bGlmZTwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZm9vdGVyPicsIGZ1bmN0aW9uKG9wdHMpIHtcbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKSArICd0ZW1wLyc7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVzc2FnZScsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj57IGhlYWRlci50aXRsZSB9PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHA+eyBoZWFkZXIudGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicm93IHNwZWNpYWwtZmVhdHVyZVwiPiA8ZGl2IGVhY2g9XCJ7IGl0ZW1zIH1cIiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS00IG1hcmdpbjEwXCI+IDxkaXYgY2xhc3M9XCJzLWZlYXR1cmUtYm94IHRleHQtY2VudGVyIHdvdyBhbmltYXRlZCBmYWRlSW5cIiBkYXRhLXdvdy1kdXJhdGlvbj1cIjcwMG1zXCIgZGF0YS13b3ctZGVsYXk9XCIyMDBtc1wiPiA8ZGl2IGNsYXNzPVwibWFzay10b3BcIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gPC9kaXY+IDxkaXYgY2xhc3M9XCJtYXNrLWJvdHRvbVwiPiAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gIDxoND57IHRpdGxlIH08L2g0PiAgPHA+eyB0ZXh0IH08L3A+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5oZWFkZXIgPSB7fTtcbnRoaXMuaXRlbXMgPSBbXTtcbkNSTGFiLk1ldGFGaXJlLmdldERhdGEoJ2NybGFiL21lc3NhZ2UnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgX3RoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgX3RoaXMuaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbWVudS1uYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPiA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHRcIj4gPGxpIGNsYXNzPVwieyBkcm9wZG93bjogdHJ1ZSwgYWN0aXZlOiBkYXRhICYmIGRhdGEuaW5kZXhPZih0aGlzKSA9PSAxfVwiIGVhY2g9XCJ7IGRhdGEgfVwiPiA8YSBpZj1cInsgdGl0bGUgfVwiIGhyZWY9XCIjXCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+IDxpIGlmPVwieyBpY29uIH1cIiBjbGFzcz1cInsgaWNvbiB9XCIgPjwvaT4geyB0aXRsZSB9IDxpIGlmPVwieyBtZW51ICYmIG1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIiA+PC9pPiA8L2E+IDx1bCBpZj1cInsgbWVudSAmJiBtZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJkcm9wZG93bi1tZW51IG11bHRpLWxldmVsXCIgcm9sZT1cIm1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJkcm9wZG93bk1lbnVcIj4gPGxpIGVhY2g9XCJ7IG1lbnUgfVwiID4gPGEgaHJlZj1cIiNcIj4gPGkgaWY9XCJ7IGljb24gfVwiIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xudmFyIHRoYXQgPSB0aGlzO1xudGhhdC5kYXRhID0gW107XG5DUkxhYi5NZXRhRmlyZS5nZXREYXRhKCdjcmxhYi9uYXZiYXInKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhhdC5kYXRhID0gZGF0YTtcbiAgICB0aGF0LnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLXN0YXRpYy10b3AgeWFtbSBzdGlja3lcIiByb2xlPVwibmF2aWdhdGlvblwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJuYXZiYXItaGVhZGVyXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmF2YmFyLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj4gPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDxzcGFuIGNsYXNzPVwiaWNvbi1iYXJcIj48L3NwYW4+IDwvYnV0dG9uPiA8YSBjbGFzcz1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIjXCI+IDxpbWcgaWY9XCJ7IGRhdGEgfVwiIGhlaWdodD1cIjIxcHhcIiB3aWR0aD1cIjIxcHhcIiByaW90LXNyYz1cInsgdXJsIH1zaXRlL3sgZGF0YS5pbWcgfVwiIGFsdD1cInsgZGF0YS5hbHQgfVwiPiA8L2E+IDwvZGl2PiA8cGFnZS1tZW51LW5hdmJhcj48L3BhZ2UtbWVudS1uYXZiYXI+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7dmFyIF90aGlzID0gdGhpcztcblxudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpO1xuXG5DUkxhYi5NZXRhRmlyZS5nZXREYXRhKCdjcmxhYi9sb2dvJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgIF90aGlzLnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmV3cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8aDMgY2xhc3M9XCJoZWFkaW5nXCI+TGF0ZXN0IE5ld3M8L2gzPiA8ZGl2IGlkPVwibmV3c19jYXJvdXNlbFwiIGNsYXNzPVwib3dsLWNhcm91c2VsIG93bC1zcGFjZWRcIj4gPGRpdiBlYWNoPVwieyBkYXRhIH1cIj4gICA8ZGl2IGNsYXNzPVwibmV3cy1kZXNjXCI+IDxoNT4gPGEgaHJlZj1cInsgYnkgPyBsaW5rIDogXFwnamF2YXNjcmlwdDo7XFwnIH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj57IEh1bWFuaXplLnRydW5jYXRlKHRpdGxlLCAxMjUpIH08L2E+IDwvaDU+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG5DUkxhYi5NZXRhRmlyZS5nZXREYXRhKCdjcmxhYi9uZXdzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5kYXRhID0gXy50b0FycmF5KGRhdGEpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgJChfdGhpcy5uZXdzX2Nhcm91c2VsKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICAgICAgLy8gTW9zdCBpbXBvcnRhbnQgb3dsIGZlYXR1cmVzXG4gICAgICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICAgICAgaXRlbXNDdXN0b206IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcFNtYWxsOiBbOTgwLCAyXSxcbiAgICAgICAgICAgICAgICBpdGVtc1RhYmxldDogWzc2OCwgMl0sXG4gICAgICAgICAgICAgICAgaXRlbXNUYWJsZXRTbWFsbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXNNb2JpbGU6IFs0NzksIDFdLFxuICAgICAgICAgICAgICAgIHNpbmdsZUl0ZW06IGZhbHNlLFxuICAgICAgICAgICAgICAgIHN0YXJ0RHJhZ2dpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6IDQwMDBcbiAgICAgICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1wcm9qZWN0cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPiA8c3Ryb25nPkV4cGxvcmU8L3N0cm9uZz4gPC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cImN1YmUtbWFzb25yeVwiPiA8ZGl2IGlkPVwiZmlsdGVycy1jb250YWluZXJcIiBjbGFzcz1cImNicC1sLWZpbHRlcnMtYWxpZ25DZW50ZXJcIj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtLWFjdGl2ZSBjYnAtZmlsdGVyLWl0ZW1cIj4gRmVhdHVyZWQgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5wdWJsaWNhdGlvbnNcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBQdWJsaWNhdGlvbnMgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3NcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBJbmZvZ3JhcGhpY3MgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3MsIC5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtXCI+IFNvZnR3YXJlIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDxkaXYgZGF0YS1maWx0ZXI9XCIuaW5mb2dyYXBoaWNzLCAuZmVhdHVyZWRcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBQcm9kdWN0cyA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGRhdGEtZmlsdGVyPVwiLmluZm9ncmFwaGljcywgLmZlYXR1cmVkXCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW1cIj4gVmlkZW9zIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDxkaXYgZGF0YS1maWx0ZXI9XCIuaW5mb2dyYXBoaWNzLCAuZmVhdHVyZWRcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBUcmFpbmluZyA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGRhdGEtZmlsdGVyPVwiLmluZm9ncmFwaGljcywgLmZlYXR1cmVkXCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW1cIj4gU3BlYWtpbmcgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3MsIC5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtXCI+IFNwZWNpYWwgUHJvamVjdHMgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIipcIiBjbGFzcz1cIiBjYnAtZmlsdGVyLWl0ZW1cIj4gQWxsIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwibWFzbm9yeS1jb250YWluZXJcIiBjbGFzcz1cImNicFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gZmVhdHVyZWRcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiRWFzeSBOb3RlXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfW1hcy0xLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPkVhc3kgTm90ZTwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1kZXNjXCI+YnkgQ29zbWluIENhcGl0YW51PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBwdWJsaWNhdGlvbnNcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiVGhlIEdhbmcgQmx1ZVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctMS5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5UaGUgR2FuZyBCbHVlPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGluZm9ncmFwaGljcyBmZWF0dXJlZFwiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJUaWdlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctMi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5UaWdlcjwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1kZXNjXCI+YnkgQ29zbWluIENhcGl0YW51PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiRmxhdCBSb21hbiBUeXBlZmFjZSBVaVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1tYXMtMi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5GbGF0IFJvbWFuIFR5cGVmYWNlIFVpPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGZlYXR1cmVkXCI+IDxhIGNsYXNzPVwiY2JwLWNhcHRpb24gY2JwLWxpZ2h0Ym94XCIgZGF0YS10aXRsZT1cIlNlZW1wbGUqIE11c2ljIGZvciBpUGFkXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfW1hcy0xLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPlNlZW1wbGUqIE11c2ljIGZvciBpUGFkPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBUaWJlcml1IE5lYW11PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiUmVtaW5kfk1lIE1vcmVcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTMuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+UmVtaW5kfk1lIE1vcmU8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIHB1YmxpY2F0aW9uc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJXb3Jrb3V0IEJ1ZGR5XCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy00LmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPldvcmtvdXQgQnVkZHk8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGZlYXR1cmVkXCI+IDxhIGNsYXNzPVwiY2JwLWNhcHRpb24gY2JwLWxpZ2h0Ym94XCIgZGF0YS10aXRsZT1cIlZvbHVtZSBLbm9iXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHJpb3Qtc3JjPVwieyB1cmwgfWltZy01LmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPlZvbHVtZSBLbm9iPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gZmVhdHVyZWRcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiU2tpICogQnVkZHlcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9bWFzLTEuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+U2tpICogQnVkZHk8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIHB1YmxpY2F0aW9ucyBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiVmlydHVhbGl6YXRpb24gSWNvblwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1pbWctNi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5WaXJ0dWFsaXphdGlvbiBJY29uPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gcHVibGljYXRpb25zIGluZm9ncmFwaGljc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJXb3JsZCBDbG9jayBXaWRnZXRcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTcuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+V29ybGQgQ2xvY2sgV2lkZ2V0PC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gcHVibGljYXRpb25zIGluZm9ncmFwaGljc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJTaWNrcHVwcHlcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9aW1nLTguanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+U2lja3B1cHB5PC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cIm1hc29ucnktcG9ydGZvbGlvLTQuaHRtbFwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPlZpZXcgQWxsIFdvcms8L2E+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbnRoaXMubWl4aW4oJ2NvbmZpZycpO1xudGhpcy51cmwgPSB0aGlzLnBhdGhJbWcoKSArICd0ZW1wLyc7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtdGVzdGltb25pYWxzJywgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+IDxzdHJvbmc+V2hhdDwvc3Ryb25nPiBPdXIgVXNlcnMgU2F5IDwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC00IG1hcmdpbi1idG0tMjBcIj4gPGRpdiBjbGFzcz1cInF1b3RlIGRhcmtcIj4gPGJsb2NrcXVvdGU+IDxwPiBMb3JlbSBJcHN1bSBpcyBzaW1wbHkgZHVtbXkgdGV4dCBvZiB0aGUgcHJpbnRpbmcgYW5kIHR5cGVzZXR0aW5nIGluZHVzdHJ5LiBMb3JlbSBJcHN1bSBoYXMgYmVlbiB0aGUgaW5kdXN0cnlcXCdzIHN0YW5kYXJkIGR1bW15IHRleHQgZXZlciBzaW5jZSB0aGUgMTUwMHMuIDwvcD4gPC9ibG9ja3F1b3RlPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInF1b3RlLWZvb3RlciB0ZXh0LXJpZ2h0XCI+IDxkaXYgY2xhc3M9XCJxdW90ZS1hdXRob3ItaW1nXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9Y3VzdG9tZXItMS5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxoND5SYWtlc2ggU2hhcm1hPC9oND4gPHA+IDxzdHJvbmc+RGVzaWduX215bGlmZTwvc3Ryb25nPiA8L3A+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBtYXJnaW4tYnRtLTIwXCI+IDxkaXYgY2xhc3M9XCJxdW90ZSBncmVlblwiPiA8YmxvY2txdW90ZT4gPHA+IExvcmVtIElwc3VtIGlzIHNpbXBseSBkdW1teSB0ZXh0IG9mIHRoZSBwcmludGluZyBhbmQgdHlwZXNldHRpbmcgaW5kdXN0cnkuIExvcmVtIElwc3VtIGhhcyBiZWVuIHRoZSBpbmR1c3RyeVxcJ3Mgc3RhbmRhcmQgZHVtbXkgdGV4dCBldmVyIHNpbmNlIHRoZSAxNTAwcy4gPC9wPiA8L2Jsb2NrcXVvdGU+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicXVvdGUtZm9vdGVyIHRleHQtcmlnaHRcIj4gPGRpdiBjbGFzcz1cInF1b3RlLWF1dGhvci1pbWdcIj4gPGltZyByaW90LXNyYz1cInsgdXJsIH1jdXN0b21lci0yLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGg0PlJha2VzaCBTaGFybWE8L2g0PiA8cD4gPHN0cm9uZz5EZXNpZ25fbXlsaWZlPC9zdHJvbmc+IDwvcD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC00IG1hcmdpbi1idG0tMjBcIj4gPGRpdiBjbGFzcz1cInF1b3RlIGRhcmtcIj4gPGJsb2NrcXVvdGU+IDxwPiBMb3JlbSBJcHN1bSBpcyBzaW1wbHkgZHVtbXkgdGV4dCBvZiB0aGUgcHJpbnRpbmcgYW5kIHR5cGVzZXR0aW5nIGluZHVzdHJ5LiBMb3JlbSBJcHN1bSBoYXMgYmVlbiB0aGUgaW5kdXN0cnlcXCdzIHN0YW5kYXJkIGR1bW15IHRleHQgZXZlciBzaW5jZSB0aGUgMTUwMHMuIDwvcD4gPC9ibG9ja3F1b3RlPiA8L2Rpdj4gPGRpdiBjbGFzcz1cInF1b3RlLWZvb3RlciB0ZXh0LXJpZ2h0XCI+IDxkaXYgY2xhc3M9XCJxdW90ZS1hdXRob3ItaW1nXCI+IDxpbWcgcmlvdC1zcmM9XCJ7IHVybCB9Y3VzdG9tZXItMy5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxoND5SYWtlc2ggU2hhcm1hPC9oND4gPHA+IDxzdHJvbmc+RGVzaWduX215bGlmZTwvc3Ryb25nPiA8L3A+IDwvZGl2PiA8L2Rpdj4gIDwvZGl2PiAgPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xudGhpcy5taXhpbignY29uZmlnJyk7XG50aGlzLnVybCA9IHRoaXMucGF0aEltZygpICsgJ3RlbXAvJztcbn0pOyJdfQ==
