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

var CRLab = require('./CRLab');
module.exports = new CRLab();

},{"./CRLab":2,"./tags/page-banner.tag":6,"./tags/page-clients.tag":7,"./tags/page-countmein.tag":8,"./tags/page-footer.tag":9,"./tags/page-message.tag":10,"./tags/page-navbar-menu.tag":11,"./tags/page-navbar.tag":12,"./tags/page-news.tag":13,"./tags/page-projects.tag":14,"./tags/page-testimonials.tag":15,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],2:[function(require,module,exports){
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
var riot = require('riot');
module.exports = riot.tag('page-banner', '<div class="fullwidthbanner"> <div id="tp_banner" class="tp-banner"> <ul>  <li data-transition="fade" data-slotamount="5" data-masterspeed="1000" data-title="Powerful Theme">  <img src="crlab/dist/img/book_banner.png" alt="darkblurbg" data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat"> <div class="caption title-2 sft" data-x="50" data-y="100" data-speed="1000" data-start="1000" data-easing="easeOutExpo"> Become a <br> Systems Thinker </div> <div class="caption text sfl" data-x="50" data-y="220" data-speed="1000" data-start="1800" data-easing="easeOutExpo"> Solve everyday and wicked problems. <br> Increase your personal effectiveness. <br> Transform your organization. <br> This book is for anyone interested in learning <br> the foundational ideas of systems thinking. </div> <div class="caption sfb rev-buttons tp-resizeme" data-x="50" data-y="375" data-speed="500" data-start="1800" data-easing="Sine.easeOut"> <a href="#" class="btn btn-theme-bg btn-lg">Pre-order Now</a> </div> </li> </ul> </div> </div>', function(opts) {
this.data = [];

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
},{"riot":"riot"}],7:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-clients', '<section id="clients-carousel"> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2>Collective Impact</h2> <span class="center-line"></span> <p class="lead"> The collective impact of our research and work spans many public and private organizations and individuals. </p> </div> </div> </div> <div id="clients-slider"> <div class="item"> <a href="#"> <img src="crlab/dist/img/cl-1.png" alt=""> </a> </div> <div class="item"> <a href="#"> <img src="crlab/dist/img/cl-2.png" alt=""> </a> </div> <div class="item"> <a href="#"> <img src="crlab/dist/img/cl-3.png" alt=""> </a> </div> <div class="item"> <a href="#"> <img src="crlab/dist/img/cl-4.png" alt=""> </a> </div> <div class="item"> <a href="#"> <img src="crlab/dist/img/cl-5.png" alt=""> </a> </div> </div> </div> </section>', function(opts) {
});
},{"riot":"riot"}],8:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-countmein', '<section class="fun-fact-wrap fun-facts-bg"> <div class="container"> <div class="row"> <div class="col-md-4 margin20 facts-in"> <h3> <span class="counter">876,539</span> + </h3> <h4>Systems Thinkers</h4> </div>  <div class="col-md-4 margin20 facts-in"> <h3> <span style="border: 1px;" class="">Count Me In</span> </h3> <h4></h4> </div> </div> </div> </section>', function(opts) {
});
},{"riot":"riot"}],9:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<footer id="footer"> <div class="container"> <div class="row"> <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>About assan</h3> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing condimentum tristique vel, eleifend sed turpis. Pellentesque cursus arcu id magna euismod in elementum purus molestie. </p> <ul class="list-inline social-1"> <li> <a href="#"> <i class="fa fa-facebook"></i> </a> </li> <li> <a href="#"> <i class="fa fa-twitter"></i> </a> </li> <li> <a href="#"> <i class="fa fa-google-plus"></i> </a> </li> <li> <a href="#"> <i class="fa fa-pinterest"></i> </a> </li> <li> <a href="#"> <i class="fa fa-dribbble"></i> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Contact</h3> <ul class="list-unstyled contact"> <li> <p> <strong> <i class="fa fa-map-marker"></i> Address: </strong> vaisahali, jaipur, 302012 </p> </li> <li> <p> <strong> <i class="fa fa-envelope"></i> Mail Us: </strong> <a href="#">Support@designmylife.com</a> </p> </li> <li> <p> <strong> <i class="fa fa-phone"></i> Phone: </strong> +91 1800 2345 2132 </p> </li> <li> <p> <strong> <i class="fa fa-print"></i> Fax </strong> 1800 2345 2132 </p> </li> <li> <p> <strong> <i class="fa fa-skype"></i> Skype </strong> assan.856 </p> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Featured Work</h3> <ul class="list-inline f2-work"> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-1.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-2.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-3.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-4.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-5.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-6.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-7.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-8.jpg" class="img-responsive" alt=""> </a> </li> <li> <a href="portfolio-single.html"> <img src="crlab/dist/img/img-9.jpg" class="img-responsive" alt=""> </a> </li> </ul> </div> </div>  <div class="col-md-3 col-sm-6 margin30"> <div class="footer-col"> <h3>Newsletter</h3> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, </p> <form role="form" class="subscribe-form"> <div class="input-group"> <input type="text" class="form-control" placeholder="Enter email to subscribe"> <span class="input-group-btn"> <button class="btn btn-theme-dark btn-lg" type="submit">Ok</button> </span> </div> </form> </div> </div>  </div> <div class="row"> <div class="col-md-12 text-center"> <div class="footer-btm"> <span>&copy;2014. Theme by Design_mylife</span> </div> </div> </div> </div> </footer>', function(opts) {
});
},{"riot":"riot"}],10:[function(require,module,exports){
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
},{"riot":"riot"}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-menu-navbar', '<div class="navbar-collapse collapse"> <ul class="nav navbar-nav navbar-right"> <li class="{ dropdown: true, active: data && data.indexOf(this) == 1}" each="{ data }"> <a if="{ title }" href="#" class="dropdown-toggle" data-toggle="dropdown"> <i if="{ icon }" class="{ icon }" ></i> { title } <i if="{ menu && menu.length }" class="fa fa-angle-down" ></i> </a> <ul if="{ menu && menu.length }" class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu"> <li each="{ menu }" > <a href="#"> <i if="{ icon }" class="{ icon }"></i> <span class="title">{ title }</span> </a> </li> </ul> </li> </ul> </div>', function(opts) {
var that = this;
that.data = [];
CRLab.MetaFire.getData('crlab/navbar').then(function (data) {
    that.data = data;
    that.update();
});
});
},{"riot":"riot"}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-navbar', '<div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#"> <img height="21px" width="21px" riot-src="crlab/dist/img/{ data.img }" alt="{ data.alt }"> </a> </div> <page-menu-navbar></page-menu-navbar> </div> </div>', function(opts) {
var that = this;
that.data = [];
CRLab.MetaFire.getData('crlab/logo').then(function (data) {
    that.data = data;
    that.update();
});
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-news', '<div class="container"> <div class="row"> <div class="col-md-12"> <h3 class="heading">Latest News</h3> <div id="news_carousel" class="owl-carousel owl-spaced"> <div each="{ data }">   <div class="news-desc"> <span>{ category || \'News\' }</span> <h4> <a href="javascript:;">{ Humanize.truncate(title, 125) }</a> </h4> <span> By <a href="{ by ? by.link : \'javascript:;\' }">{ by ? by.title : \'CRL\' }</a> on { moment(date).format(\'MM/DD/YY\') } </span> <span> <a href="{ link }">Read more...</a> </span> </div> </div> </div> </div> </div> </div>', function(opts) {var _this = this;

this.data = [];

CRLab.MetaFire.getData('crlab/news').then(function (data) {
        _this.data = _.toArray(data);
        _this.update();
        $(_this.news_carousel).owlCarousel({
                // Most important owl features
                items: 4,
                itemsCustom: false,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [980, 4],
                itemsTablet: [768, 4],
                itemsTabletSmall: false,
                itemsMobile: [479, 4],
                singleItem: false,
                startDragging: true,
                autoPlay: 4000
        });
});
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-projects', '<div class="container"> <div class="row"> <div class="col-md-12"> <div class="center-heading"> <h2> <strong>Explore</strong> </h2> <span class="center-line"></span> </div> </div> </div> </div> <div class="container"> <div class="cube-masonry"> <div id="filters-container" class="cbp-l-filters-alignCenter"> <div data-filter=".featured" class="cbp-filter-item-active cbp-filter-item"> Featured <div class="cbp-filter-counter"></div> </div> <div data-filter=".publications" class="cbp-filter-item"> Publications <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics" class="cbp-filter-item"> Infographics <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Software <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Products <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Videos <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Training <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Speaking <div class="cbp-filter-counter"></div> </div> <div data-filter=".infographics, .featured" class="cbp-filter-item"> Special Projects <div class="cbp-filter-counter"></div> </div> <div data-filter="*" class=" cbp-filter-item"> All <div class="cbp-filter-counter"></div> </div> </div> <div id="masnory-container" class="cbp"> <div class="cbp-item featured"> <a class="cbp-caption cbp-lightbox" data-title="Easy Note"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/mas-1.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Easy Note</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> <div class="cbp-item publications"> <a class="cbp-caption cbp-lightbox" data-title="The Gang Blue"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/img-1.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">The Gang Blue</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> <div class="cbp-item infographics featured"> <a class="cbp-caption cbp-lightbox" data-title="Tiger"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/img-2.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Tiger</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> <div class="cbp-item infographics"> <a class="cbp-caption cbp-lightbox" data-title="Flat Roman Typeface Ui"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/mas-2.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Flat Roman Typeface Ui</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> <div class="cbp-item featured"> <a class="cbp-caption cbp-lightbox" data-title="Seemple* Music for iPad"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/mas-1.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Seemple* Music for iPad</div> <div class="cbp-l-caption-desc">by Tiberiu Neamu</div> </div> </div> </div> </a> </div> <div class="cbp-item infographics"> <a class="cbp-caption cbp-lightbox" data-title="Remind~Me More"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/img-3.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Remind~Me More</div> <div class="cbp-l-caption-desc">by Tiberiu Neamu</div> </div> </div> </div> </a> </div> <div class="cbp-item publications"> <a class="cbp-caption cbp-lightbox" data-title="Workout Buddy"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/img-4.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Workout Buddy</div> <div class="cbp-l-caption-desc">by Tiberiu Neamu</div> </div> </div> </div> </a> </div> <div class="cbp-item featured"> <a class="cbp-caption cbp-lightbox" data-title="Volume Knob"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/img-5.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Volume Knob</div> <div class="cbp-l-caption-desc">by Paul Flavius Nechita</div> </div> </div> </div> </a> </div> <div class="cbp-item featured"> <a class="cbp-caption cbp-lightbox" data-title="Ski * Buddy"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/mas-1.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Ski * Buddy</div> <div class="cbp-l-caption-desc">by Tiberiu Neamu</div> </div> </div> </div> </a> </div> <div class="cbp-item publications infographics"> <a class="cbp-caption cbp-lightbox" data-title="Virtualization Icon"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/img-6.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Virtualization Icon</div> <div class="cbp-l-caption-desc">by Paul Flavius Nechita</div> </div> </div> </div> </a> </div> <div class="cbp-item publications infographics"> <a class="cbp-caption cbp-lightbox" data-title="World Clock Widget"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/img-7.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">World Clock Widget</div> <div class="cbp-l-caption-desc">by Paul Flavius Nechita</div> </div> </div> </div> </a> </div> <div class="cbp-item publications infographics"> <a class="cbp-caption cbp-lightbox" data-title="Sickpuppy"> <div class="cbp-caption-defaultWrap"> <img src="crlab/dist/img/img-8.jpg" alt=""> </div> <div class="cbp-caption-activeWrap"> <div class="cbp-l-caption-alignCenter"> <div class="cbp-l-caption-body"> <div class="cbp-l-caption-title">Sickpuppy</div> <div class="cbp-l-caption-desc">by Cosmin Capitanu</div> </div> </div> </div> </a> </div> </div> </div>  </div> <div class="divide50"></div> <div class="text-center"> <a href="masonry-portfolio-4.html" class="btn btn-theme-dark btn-lg">View All Work</a> </div>', function(opts) {
});
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-testimonials', '<div class="container"> <div class="row"> <div class="col-sm-8 col-sm-offset-2"> <div class="center-heading"> <h2> <strong>What</strong> Our Users Say </h2> <span class="center-line"></span> </div> </div> </div> <div class="row"> <div class="col-md-4 margin-btm-20"> <div class="quote dark"> <blockquote> <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s. </p> </blockquote> </div> <div class="quote-footer text-right"> <div class="quote-author-img"> <img src="crlab/dist/img/customer-1.jpg" alt=""> </div> <h4>Rakesh Sharma</h4> <p> <strong>Design_mylife</strong> </p> </div> </div>  <div class="col-md-4 margin-btm-20"> <div class="quote green"> <blockquote> <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s. </p> </blockquote> </div> <div class="quote-footer text-right"> <div class="quote-author-img"> <img src="crlab/dist/img/customer-2.jpg" alt=""> </div> <h4>Rakesh Sharma</h4> <p> <strong>Design_mylife</strong> </p> </div> </div>  <div class="col-md-4 margin-btm-20"> <div class="quote dark"> <blockquote> <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s. </p> </blockquote> </div> <div class="quote-footer text-right"> <div class="quote-author-img"> <img src="crlab/dist/img/customer-3.jpg" alt=""> </div> <h4>Rakesh Sharma</h4> <p> <strong>Design_mylife</strong> </p> </div> </div>  </div>  </div>', function(opts) {
});
},{"riot":"riot"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvQ1JMYWIuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9jcmxhYi9zcmMvanMvaW50ZWdyYXRpb25zL2F1dGgwLmpzIiwiQzovR2l0aHViL01ldGFNYXAvY3JsYWIvc3JjL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZS5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL2NybGFiL3NyYy9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAuanMiLCJjcmxhYi9zcmMvdGFncy9wYWdlLWJhbm5lci50YWciLCJjcmxhYi9zcmMvdGFncy9wYWdlLWNsaWVudHMudGFnIiwiY3JsYWIvc3JjL3RhZ3MvcGFnZS1jb3VudG1laW4udGFnIiwiY3JsYWIvc3JjL3RhZ3MvcGFnZS1mb290ZXIudGFnIiwiY3JsYWIvc3JjL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtbmF2YmFyLW1lbnUudGFnIiwiY3JsYWIvc3JjL3RhZ3MvcGFnZS1uYXZiYXIudGFnIiwiY3JsYWIvc3JjL3RhZ3MvcGFnZS1uZXdzLnRhZyIsImNybGFiL3NyYy90YWdzL3BhZ2UtcHJvamVjdHMudGFnIiwiY3JsYWIvc3JjL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQixNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztB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QTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCdiYWJlbC9wb2x5ZmlsbCcpO1xyXG53aW5kb3cucmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxud2luZG93Ll8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxud2luZG93LlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5yZXF1aXJlKCdjb3JlLWpzJyk7XHJcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5yZXF1aXJlKCdqcXVlcnktdWknKTtcclxucmVxdWlyZSgnYm9vdHN0cmFwJyk7XHJcbndpbmRvdy5GaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJyk7XHJcbndpbmRvdy5IdW1hbml6ZSA9IHJlcXVpcmUoJ2h1bWFuaXplLXBsdXMnKTtcclxud2luZG93Lm1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG53aW5kb3cuVVJJID0gcmVxdWlyZSgnVVJJanMnKTtcclxud2luZG93LmxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKTtcclxuXHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWJhbm5lci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtY2xpZW50cy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtY291bnRtZWluLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1mb290ZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5hdmJhci1tZW51LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1uYXZiYXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLW5ld3MudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLXByb2plY3RzLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1tZXNzYWdlLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS10ZXN0aW1vbmlhbHMudGFnJyk7XHJcblxyXG52YXIgQ1JMYWIgPSByZXF1aXJlKCcuL0NSTGFiJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IENSTGFiKCk7IiwidmFyIE1ldGFGaXJlID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UnKTtcclxudmFyIEF1dGgwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAnKTtcclxudmFyIHVzZXJzbmFwID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAnKTtcclxuXHJcbmNsYXNzIENSTGFiIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IG5ldyBNZXRhRmlyZSgpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAoKTtcclxuICAgICAgICB1c2Vyc25hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgcmlvdC5tb3VudCgnKicpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dvdXQoKTtcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ291dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENSTGFiOyIsImxldCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJyk7XG5cbmNsYXNzIEF1dGgwIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKCd3c09uYXJ0MjN5VmlJU2hxVDR3ZkoxOHcydnQyY2wzMicsICdtZXRhbWFwLmF1dGgwLmNvbScpO1xuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoYXQuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocHJvZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQubG9jay5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIHByb2ZpbGUsIGlkX3Rva2VuLCBjdG9rZW4sIG9wdCwgcmVmcmVzaF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncmVmcmVzaF90b2tlbicsIHJlZnJlc2hfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnByb2ZpbGUgPSBwcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBsaW5rQWNjb3VudCgpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICBjYWxsYmFja1VSTDogJ2h0dHBzOi8vcG9wcGluZy1maXJlLTg5Ny5maXJlYmFzZWFwcC5jb20vJyxcbiAgICAgICAgICAgIGRpY3Q6IHtcbiAgICAgICAgICAgICAgICBzaWduaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGF0LmlkX3Rva2VuIHx8IHRoYXQucHJvZmlsZS5pZGVudGl0aWVzWzBdLmFjY2Vzc190b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRTZXNzaW9uKCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGxldCBnZXRQcm9maWxlID0gKGlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGF0LmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgZnVuY3Rpb24oZXJyLCBwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIHRoYXQucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSwgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZ1bGZpbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgncmVmcmVzaF90b2tlbicpLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQucmVmcmVzaF90b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmxvY2suZ2V0Q2xpZW50KCkucmVmcmVzaFRva2VuKHRva2VuLCAoYSwgdG9rT2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKHRva09iai5pZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdpZF90b2tlbicpLnRoZW4oKGlkX3Rva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9maWxlKGlkX3Rva2VuLCBmdWxmaWxsLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ2lkX3Rva2VuJyk7XG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3JlZnJlc2hfdG9rZW4nKTtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgncHJvZmlsZScpO1xuICAgICAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcblxuXG4iLCJsZXQgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpO1xuXG5jbGFzcyBNZXRhRmlyZSB7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3BvcHBpbmctZmlyZS04OTcuZmlyZWJhc2Vpby5jb21cIik7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgbGV0IHJldCA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLkF1dGgwLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5BdXRoMC5sb2NrLmdldENsaWVudCgpLmdldERlbGVnYXRpb25Ub2tlbih7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHByb2ZpbGUuY2xpZW50SUQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogaWRfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGlfdHlwZTogJ2ZpcmViYXNlJ1xuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBkZWxlZ2F0aW9uUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2ZpcmViYXNlX3Rva2VuJywgdGhhdC5maXJlYmFzZV90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZiLmF1dGhXaXRoQ3VzdG9tVG9rZW4odGhhdC5maXJlYmFzZV90b2tlbiwgKGVycm9yLCBhdXRoRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcbiAgICB9XG5cbiAgICBnZXREYXRhIChwYXRoKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY2hpbGQub24oJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzbmFwc2hvdC52YWwoKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgc2V0RGF0YSAoZGF0YSwgcGF0aCkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSk7XG4gICAgfVxuXG4gICAgbG9nb3V0ICgpIHtcbiAgICAgICAgdGhpcy5mYi51bmF1dGgoKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1ldGFGaXJlO1xuXG5cbiIsIlxudmFyIHVzZXJTbmFwID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgdmFyIGFwaUtleSA9ICcwMzJiYWY4Ny04NTQ1LTRlYmMtYTU1Ny05MzQ4NTkzNzFmYTUuanMnLCBzLCB4O1xuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxuICAgIGFwaUtleSA9IGNvbmZpZy5VU0VSX1NOQVBfQVBJX0tFWTtcbiAgICBpZiAoYXBpS2V5ICYmIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSAhPT0gJ2xvY2FsaG9zdCcpIHtcclxuICAgICAgICB3aW5kb3cudXNlcnNuYXBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIG1vZGU6ICdyZXBvcnQnLFxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXG4gICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNuYXAuc2V0RW1haWxCb3goRG9jLmFwcC51c2VyLnVzZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XG4gICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgIHMuYXN5bmMgPSB0cnVlO1xuICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICByZXR1cm4geC5hcHBlbmRDaGlsZChzKTtcclxuICAgIH1cclxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcblxuXG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYmFubmVyJywgJzxkaXYgY2xhc3M9XCJmdWxsd2lkdGhiYW5uZXJcIj4gPGRpdiBpZD1cInRwX2Jhbm5lclwiIGNsYXNzPVwidHAtYmFubmVyXCI+IDx1bD4gIDxsaSBkYXRhLXRyYW5zaXRpb249XCJmYWRlXCIgZGF0YS1zbG90YW1vdW50PVwiNVwiIGRhdGEtbWFzdGVyc3BlZWQ9XCIxMDAwXCIgZGF0YS10aXRsZT1cIlBvd2VyZnVsIFRoZW1lXCI+ICA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL2Jvb2tfYmFubmVyLnBuZ1wiIGFsdD1cImRhcmtibHVyYmdcIiBkYXRhLWJnZml0PVwiY292ZXJcIiBkYXRhLWJncG9zaXRpb249XCJsZWZ0IHRvcFwiIGRhdGEtYmdyZXBlYXQ9XCJuby1yZXBlYXRcIj4gPGRpdiBjbGFzcz1cImNhcHRpb24gdGl0bGUtMiBzZnRcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjEwMFwiIGRhdGEtc3BlZWQ9XCIxMDAwXCIgZGF0YS1zdGFydD1cIjEwMDBcIiBkYXRhLWVhc2luZz1cImVhc2VPdXRFeHBvXCI+IEJlY29tZSBhIDxicj4gU3lzdGVtcyBUaGlua2VyIDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2FwdGlvbiB0ZXh0IHNmbFwiIGRhdGEteD1cIjUwXCIgZGF0YS15PVwiMjIwXCIgZGF0YS1zcGVlZD1cIjEwMDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiZWFzZU91dEV4cG9cIj4gU29sdmUgZXZlcnlkYXkgYW5kIHdpY2tlZCBwcm9ibGVtcy4gPGJyPiBJbmNyZWFzZSB5b3VyIHBlcnNvbmFsIGVmZmVjdGl2ZW5lc3MuIDxicj4gVHJhbnNmb3JtIHlvdXIgb3JnYW5pemF0aW9uLiA8YnI+IFRoaXMgYm9vayBpcyBmb3IgYW55b25lIGludGVyZXN0ZWQgaW4gbGVhcm5pbmcgPGJyPiB0aGUgZm91bmRhdGlvbmFsIGlkZWFzIG9mIHN5c3RlbXMgdGhpbmtpbmcuIDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2FwdGlvbiBzZmIgcmV2LWJ1dHRvbnMgdHAtcmVzaXplbWVcIiBkYXRhLXg9XCI1MFwiIGRhdGEteT1cIjM3NVwiIGRhdGEtc3BlZWQ9XCI1MDBcIiBkYXRhLXN0YXJ0PVwiMTgwMFwiIGRhdGEtZWFzaW5nPVwiU2luZS5lYXNlT3V0XCI+IDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLXRoZW1lLWJnIGJ0bi1sZ1wiPlByZS1vcmRlciBOb3c8L2E+IDwvZGl2PiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xudGhpcy5kYXRhID0gW107XG5cbiQodGhpcy50cF9iYW5uZXIpLnJldm9sdXRpb24oe1xuICAgIGRlbGF5OiA2MDAwLFxuICAgIHN0YXJ0d2lkdGg6IDExNzAsXG4gICAgc3RhcnRoZWlnaHQ6IDYwMCxcbiAgICBoaWRlVGh1bWJzOiAxMCxcbiAgICAvL2Z1bGxXaWR0aDogXCJvblwiLFxuICAgIC8vZm9yY2VGdWxsV2lkdGg6IFwib25cIixcbiAgICBsYXp5TG9hZDogXCJvblwiXG4gICAgLy8gbmF2aWdhdGlvblN0eWxlOiBcInByZXZpZXc0XCJcbn0pO1xuXG4vL0NSTGFiLk1ldGFGaXJlLmdldERhdGEoJ2NybGFiL2Jhbm5lcicpLnRoZW4oIChkYXRhKSA9PiB7XG4vLyAgICB0aGlzLmRhdGEgPSBkYXRhO1xuLy8gICAgdGhpcy51cGRhdGUoKTtcbi8vfSlcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jbGllbnRzJywgJzxzZWN0aW9uIGlkPVwiY2xpZW50cy1jYXJvdXNlbFwiPiA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPkNvbGxlY3RpdmUgSW1wYWN0PC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPHAgY2xhc3M9XCJsZWFkXCI+IFRoZSBjb2xsZWN0aXZlIGltcGFjdCBvZiBvdXIgcmVzZWFyY2ggYW5kIHdvcmsgc3BhbnMgbWFueSBwdWJsaWMgYW5kIHByaXZhdGUgb3JnYW5pemF0aW9ucyBhbmQgaW5kaXZpZHVhbHMuIDwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cImNsaWVudHMtc2xpZGVyXCI+IDxkaXYgY2xhc3M9XCJpdGVtXCI+IDxhIGhyZWY9XCIjXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvY2wtMS5wbmdcIiBhbHQ9XCJcIj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cIml0ZW1cIj4gPGEgaHJlZj1cIiNcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9jbC0yLnBuZ1wiIGFsdD1cIlwiPiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiaXRlbVwiPiA8YSBocmVmPVwiI1wiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL2NsLTMucG5nXCIgYWx0PVwiXCI+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJpdGVtXCI+IDxhIGhyZWY9XCIjXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvY2wtNC5wbmdcIiBhbHQ9XCJcIj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cIml0ZW1cIj4gPGEgaHJlZj1cIiNcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9jbC01LnBuZ1wiIGFsdD1cIlwiPiA8L2E+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY291bnRtZWluJywgJzxzZWN0aW9uIGNsYXNzPVwiZnVuLWZhY3Qtd3JhcCBmdW4tZmFjdHMtYmdcIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBtYXJnaW4yMCBmYWN0cy1pblwiPiA8aDM+IDxzcGFuIGNsYXNzPVwiY291bnRlclwiPjg3Niw1Mzk8L3NwYW4+ICsgPC9oMz4gPGg0PlN5c3RlbXMgVGhpbmtlcnM8L2g0PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBtYXJnaW4yMCBmYWN0cy1pblwiPiA8aDM+IDxzcGFuIHN0eWxlPVwiYm9yZGVyOiAxcHg7XCIgY2xhc3M9XCJcIj5Db3VudCBNZSBJbjwvc3Bhbj4gPC9oMz4gPGg0PjwvaDQ+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvc2VjdGlvbj4nLCBmdW5jdGlvbihvcHRzKSB7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgJzxmb290ZXIgaWQ9XCJmb290ZXJcIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+QWJvdXQgYXNzYW48L2gzPiA8cD4gTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gSW50ZWdlciBsb3JlbSBxdWFtLCBhZGlwaXNjaW5nIGNvbmRpbWVudHVtIHRyaXN0aXF1ZSB2ZWwsIGVsZWlmZW5kIHNlZCB0dXJwaXMuIFBlbGxlbnRlc3F1ZSBjdXJzdXMgYXJjdSBpZCBtYWduYSBldWlzbW9kIGluIGVsZW1lbnR1bSBwdXJ1cyBtb2xlc3RpZS4gPC9wPiA8dWwgY2xhc3M9XCJsaXN0LWlubGluZSBzb2NpYWwtMVwiPiA8bGk+IDxhIGhyZWY9XCIjXCI+IDxpIGNsYXNzPVwiZmEgZmEtZmFjZWJvb2tcIj48L2k+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiI1wiPiA8aSBjbGFzcz1cImZhIGZhLXR3aXR0ZXJcIj48L2k+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiI1wiPiA8aSBjbGFzcz1cImZhIGZhLWdvb2dsZS1wbHVzXCI+PC9pPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cIiNcIj4gPGkgY2xhc3M9XCJmYSBmYS1waW50ZXJlc3RcIj48L2k+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiI1wiPiA8aSBjbGFzcz1cImZhIGZhLWRyaWJiYmxlXCI+PC9pPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+Q29udGFjdDwvaDM+IDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgY29udGFjdFwiPiA8bGk+IDxwPiA8c3Ryb25nPiA8aSBjbGFzcz1cImZhIGZhLW1hcC1tYXJrZXJcIj48L2k+IEFkZHJlc3M6IDwvc3Ryb25nPiB2YWlzYWhhbGksIGphaXB1ciwgMzAyMDEyIDwvcD4gPC9saT4gPGxpPiA8cD4gPHN0cm9uZz4gPGkgY2xhc3M9XCJmYSBmYS1lbnZlbG9wZVwiPjwvaT4gTWFpbCBVczogPC9zdHJvbmc+IDxhIGhyZWY9XCIjXCI+U3VwcG9ydEBkZXNpZ25teWxpZmUuY29tPC9hPiA8L3A+IDwvbGk+IDxsaT4gPHA+IDxzdHJvbmc+IDxpIGNsYXNzPVwiZmEgZmEtcGhvbmVcIj48L2k+IFBob25lOiA8L3N0cm9uZz4gKzkxIDE4MDAgMjM0NSAyMTMyIDwvcD4gPC9saT4gPGxpPiA8cD4gPHN0cm9uZz4gPGkgY2xhc3M9XCJmYSBmYS1wcmludFwiPjwvaT4gRmF4IDwvc3Ryb25nPiAxODAwIDIzNDUgMjEzMiA8L3A+IDwvbGk+IDxsaT4gPHA+IDxzdHJvbmc+IDxpIGNsYXNzPVwiZmEgZmEtc2t5cGVcIj48L2k+IFNreXBlIDwvc3Ryb25nPiBhc3Nhbi44NTYgPC9wPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTMgY29sLXNtLTYgbWFyZ2luMzBcIj4gPGRpdiBjbGFzcz1cImZvb3Rlci1jb2xcIj4gPGgzPkZlYXR1cmVkIFdvcms8L2gzPiA8dWwgY2xhc3M9XCJsaXN0LWlubGluZSBmMi13b3JrXCI+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL2ltZy0xLmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9pbWctMi5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvaW1nLTMuanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL2ltZy00LmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9pbWctNS5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvaW1nLTYuanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cInBvcnRmb2xpby1zaW5nbGUuaHRtbFwiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL2ltZy03LmpwZ1wiIGNsYXNzPVwiaW1nLXJlc3BvbnNpdmVcIiBhbHQ9XCJcIj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJwb3J0Zm9saW8tc2luZ2xlLmh0bWxcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9pbWctOC5qcGdcIiBjbGFzcz1cImltZy1yZXNwb25zaXZlXCIgYWx0PVwiXCI+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwicG9ydGZvbGlvLXNpbmdsZS5odG1sXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvaW1nLTkuanBnXCIgY2xhc3M9XCJpbWctcmVzcG9uc2l2ZVwiIGFsdD1cIlwiPiA8L2E+IDwvbGk+IDwvdWw+IDwvZGl2PiA8L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb2wtbWQtMyBjb2wtc20tNiBtYXJnaW4zMFwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWNvbFwiPiA8aDM+TmV3c2xldHRlcjwvaDM+IDxwPiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LiBJbnRlZ2VyIGxvcmVtIHF1YW0sIDwvcD4gPGZvcm0gcm9sZT1cImZvcm1cIiBjbGFzcz1cInN1YnNjcmliZS1mb3JtXCI+IDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgZW1haWwgdG8gc3Vic2NyaWJlXCI+IDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+IDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXRoZW1lLWRhcmsgYnRuLWxnXCIgdHlwZT1cInN1Ym1pdFwiPk9rPC9idXR0b24+IDwvc3Bhbj4gPC9kaXY+IDwvZm9ybT4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiZm9vdGVyLWJ0bVwiPiA8c3Bhbj4mY29weTsyMDE0LiBUaGVtZSBieSBEZXNpZ25fbXlsaWZlPC9zcGFuPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9mb290ZXI+JywgZnVuY3Rpb24ob3B0cykge1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1lc3NhZ2UnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgXCI+IDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGluZ1wiPiA8aDI+eyBoZWFkZXIudGl0bGUgfTwvaDI+IDxzcGFuIGNsYXNzPVwiY2VudGVyLWxpbmVcIj48L3NwYW4+IDxwPnsgaGVhZGVyLnRleHQgfTwvcD4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvdyBzcGVjaWFsLWZlYXR1cmVcIj4gPGRpdiBlYWNoPVwieyBpdGVtcyB9XCIgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBtYXJnaW4xMFwiPiA8ZGl2IGNsYXNzPVwicy1mZWF0dXJlLWJveCB0ZXh0LWNlbnRlciB3b3cgYW5pbWF0ZWQgZmFkZUluXCIgZGF0YS13b3ctZHVyYXRpb249XCI3MDBtc1wiIGRhdGEtd293LWRlbGF5PVwiMjAwbXNcIj4gPGRpdiBjbGFzcz1cIm1hc2stdG9wXCI+ICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiAgPGg0PnsgdGl0bGUgfTwvaDQ+IDwvZGl2PiA8ZGl2IGNsYXNzPVwibWFzay1ib3R0b21cIj4gIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+ICA8aDQ+eyB0aXRsZSB9PC9oND4gIDxwPnsgdGV4dCB9PC9wPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuaGVhZGVyID0ge307XG50aGlzLml0ZW1zID0gW107XG5DUkxhYi5NZXRhRmlyZS5nZXREYXRhKCdjcmxhYi9tZXNzYWdlJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIF90aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgIF90aGlzLml0ZW1zID0gZGF0YS5pdGVtcztcbiAgICBfdGhpcy51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW1lbnUtbmF2YmFyJywgJzxkaXYgY2xhc3M9XCJuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIj4gPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0XCI+IDxsaSBjbGFzcz1cInsgZHJvcGRvd246IHRydWUsIGFjdGl2ZTogZGF0YSAmJiBkYXRhLmluZGV4T2YodGhpcykgPT0gMX1cIiBlYWNoPVwieyBkYXRhIH1cIj4gPGEgaWY9XCJ7IHRpdGxlIH1cIiBocmVmPVwiI1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPiA8aSBpZj1cInsgaWNvbiB9XCIgY2xhc3M9XCJ7IGljb24gfVwiID48L2k+IHsgdGl0bGUgfSA8aSBpZj1cInsgbWVudSAmJiBtZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCIgPjwvaT4gPC9hPiA8dWwgaWY9XCJ7IG1lbnUgJiYgbWVudS5sZW5ndGggfVwiIGNsYXNzPVwiZHJvcGRvd24tbWVudSBtdWx0aS1sZXZlbFwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZHJvcGRvd25NZW51XCI+IDxsaSBlYWNoPVwieyBtZW51IH1cIiA+IDxhIGhyZWY9XCIjXCI+IDxpIGlmPVwieyBpY29uIH1cIiBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPiA8L2E+IDwvbGk+IDwvdWw+IDwvbGk+IDwvdWw+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbnZhciB0aGF0ID0gdGhpcztcbnRoYXQuZGF0YSA9IFtdO1xuQ1JMYWIuTWV0YUZpcmUuZ2V0RGF0YSgnY3JsYWIvbmF2YmFyJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoYXQuZGF0YSA9IGRhdGE7XG4gICAgdGhhdC51cGRhdGUoKTtcbn0pO1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLW5hdmJhcicsICc8ZGl2IGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1zdGF0aWMtdG9wIHlhbW0gc3RpY2t5XCIgcm9sZT1cIm5hdmlnYXRpb25cIj4gPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwibmF2YmFyLWhlYWRlclwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5hdmJhci10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+IDxzcGFuIGNsYXNzPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImljb24tYmFyXCI+PC9zcGFuPiA8L2J1dHRvbj4gPGEgY2xhc3M9XCJuYXZiYXItYnJhbmRcIiBocmVmPVwiI1wiPiA8aW1nIGhlaWdodD1cIjIxcHhcIiB3aWR0aD1cIjIxcHhcIiByaW90LXNyYz1cImNybGFiL2Rpc3QvaW1nL3sgZGF0YS5pbWcgfVwiIGFsdD1cInsgZGF0YS5hbHQgfVwiPiA8L2E+IDwvZGl2PiA8cGFnZS1tZW51LW5hdmJhcj48L3BhZ2UtbWVudS1uYXZiYXI+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG52YXIgdGhhdCA9IHRoaXM7XG50aGF0LmRhdGEgPSBbXTtcbkNSTGFiLk1ldGFGaXJlLmdldERhdGEoJ2NybGFiL2xvZ28nKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhhdC5kYXRhID0gZGF0YTtcbiAgICB0aGF0LnVwZGF0ZSgpO1xufSk7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbmV3cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8aDMgY2xhc3M9XCJoZWFkaW5nXCI+TGF0ZXN0IE5ld3M8L2gzPiA8ZGl2IGlkPVwibmV3c19jYXJvdXNlbFwiIGNsYXNzPVwib3dsLWNhcm91c2VsIG93bC1zcGFjZWRcIj4gPGRpdiBlYWNoPVwieyBkYXRhIH1cIj4gICA8ZGl2IGNsYXNzPVwibmV3cy1kZXNjXCI+IDxzcGFuPnsgY2F0ZWdvcnkgfHwgXFwnTmV3c1xcJyB9PC9zcGFuPiA8aDQ+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj57IEh1bWFuaXplLnRydW5jYXRlKHRpdGxlLCAxMjUpIH08L2E+IDwvaDQ+IDxzcGFuPiBCeSA8YSBocmVmPVwieyBieSA/IGJ5LmxpbmsgOiBcXCdqYXZhc2NyaXB0OjtcXCcgfVwiPnsgYnkgPyBieS50aXRsZSA6IFxcJ0NSTFxcJyB9PC9hPiBvbiB7IG1vbWVudChkYXRlKS5mb3JtYXQoXFwnTU0vREQvWVlcXCcpIH0gPC9zcGFuPiA8c3Bhbj4gPGEgaHJlZj1cInsgbGluayB9XCI+UmVhZCBtb3JlLi4uPC9hPiA8L3NwYW4+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge3ZhciBfdGhpcyA9IHRoaXM7XG5cbnRoaXMuZGF0YSA9IFtdO1xuXG5DUkxhYi5NZXRhRmlyZS5nZXREYXRhKCdjcmxhYi9uZXdzJykudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBfdGhpcy5kYXRhID0gXy50b0FycmF5KGRhdGEpO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgJChfdGhpcy5uZXdzX2Nhcm91c2VsKS5vd2xDYXJvdXNlbCh7XG4gICAgICAgICAgICAgICAgLy8gTW9zdCBpbXBvcnRhbnQgb3dsIGZlYXR1cmVzXG4gICAgICAgICAgICAgICAgaXRlbXM6IDQsXG4gICAgICAgICAgICAgICAgaXRlbXNDdXN0b206IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcDogWzExOTksIDRdLFxuICAgICAgICAgICAgICAgIGl0ZW1zRGVza3RvcFNtYWxsOiBbOTgwLCA0XSxcbiAgICAgICAgICAgICAgICBpdGVtc1RhYmxldDogWzc2OCwgNF0sXG4gICAgICAgICAgICAgICAgaXRlbXNUYWJsZXRTbWFsbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXNNb2JpbGU6IFs0NzksIDRdLFxuICAgICAgICAgICAgICAgIHNpbmdsZUl0ZW06IGZhbHNlLFxuICAgICAgICAgICAgICAgIHN0YXJ0RHJhZ2dpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgYXV0b1BsYXk6IDQwMDBcbiAgICAgICAgfSk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1wcm9qZWN0cycsICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+IDxkaXYgY2xhc3M9XCJyb3dcIj4gPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPiA8ZGl2IGNsYXNzPVwiY2VudGVyLWhlYWRpbmdcIj4gPGgyPiA8c3Ryb25nPkV4cGxvcmU8L3N0cm9uZz4gPC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4gPGRpdiBjbGFzcz1cImN1YmUtbWFzb25yeVwiPiA8ZGl2IGlkPVwiZmlsdGVycy1jb250YWluZXJcIiBjbGFzcz1cImNicC1sLWZpbHRlcnMtYWxpZ25DZW50ZXJcIj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtLWFjdGl2ZSBjYnAtZmlsdGVyLWl0ZW1cIj4gRmVhdHVyZWQgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5wdWJsaWNhdGlvbnNcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBQdWJsaWNhdGlvbnMgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3NcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBJbmZvZ3JhcGhpY3MgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3MsIC5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtXCI+IFNvZnR3YXJlIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDxkaXYgZGF0YS1maWx0ZXI9XCIuaW5mb2dyYXBoaWNzLCAuZmVhdHVyZWRcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBQcm9kdWN0cyA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGRhdGEtZmlsdGVyPVwiLmluZm9ncmFwaGljcywgLmZlYXR1cmVkXCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW1cIj4gVmlkZW9zIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDxkaXYgZGF0YS1maWx0ZXI9XCIuaW5mb2dyYXBoaWNzLCAuZmVhdHVyZWRcIiBjbGFzcz1cImNicC1maWx0ZXItaXRlbVwiPiBUcmFpbmluZyA8ZGl2IGNsYXNzPVwiY2JwLWZpbHRlci1jb3VudGVyXCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGRhdGEtZmlsdGVyPVwiLmluZm9ncmFwaGljcywgLmZlYXR1cmVkXCIgY2xhc3M9XCJjYnAtZmlsdGVyLWl0ZW1cIj4gU3BlYWtpbmcgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIi5pbmZvZ3JhcGhpY3MsIC5mZWF0dXJlZFwiIGNsYXNzPVwiY2JwLWZpbHRlci1pdGVtXCI+IFNwZWNpYWwgUHJvamVjdHMgPGRpdiBjbGFzcz1cImNicC1maWx0ZXItY291bnRlclwiPjwvZGl2PiA8L2Rpdj4gPGRpdiBkYXRhLWZpbHRlcj1cIipcIiBjbGFzcz1cIiBjYnAtZmlsdGVyLWl0ZW1cIj4gQWxsIDxkaXYgY2xhc3M9XCJjYnAtZmlsdGVyLWNvdW50ZXJcIj48L2Rpdj4gPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPVwibWFzbm9yeS1jb250YWluZXJcIiBjbGFzcz1cImNicFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gZmVhdHVyZWRcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiRWFzeSBOb3RlXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL21hcy0xLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPkVhc3kgTm90ZTwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1kZXNjXCI+YnkgQ29zbWluIENhcGl0YW51PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBwdWJsaWNhdGlvbnNcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiVGhlIEdhbmcgQmx1ZVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9pbWctMS5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5UaGUgR2FuZyBCbHVlPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGluZm9ncmFwaGljcyBmZWF0dXJlZFwiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJUaWdlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9pbWctMi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5UaWdlcjwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1kZXNjXCI+YnkgQ29zbWluIENhcGl0YW51PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiRmxhdCBSb21hbiBUeXBlZmFjZSBVaVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9tYXMtMi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5GbGF0IFJvbWFuIFR5cGVmYWNlIFVpPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGZlYXR1cmVkXCI+IDxhIGNsYXNzPVwiY2JwLWNhcHRpb24gY2JwLWxpZ2h0Ym94XCIgZGF0YS10aXRsZT1cIlNlZW1wbGUqIE11c2ljIGZvciBpUGFkXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL21hcy0xLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPlNlZW1wbGUqIE11c2ljIGZvciBpUGFkPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBUaWJlcml1IE5lYW11PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvYT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtaXRlbSBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiUmVtaW5kfk1lIE1vcmVcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvaW1nLTMuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+UmVtaW5kfk1lIE1vcmU8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIHB1YmxpY2F0aW9uc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJXb3Jrb3V0IEJ1ZGR5XCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL2ltZy00LmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPldvcmtvdXQgQnVkZHk8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIGZlYXR1cmVkXCI+IDxhIGNsYXNzPVwiY2JwLWNhcHRpb24gY2JwLWxpZ2h0Ym94XCIgZGF0YS10aXRsZT1cIlZvbHVtZSBLbm9iXCI+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1kZWZhdWx0V3JhcFwiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL2ltZy01LmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWFjdGl2ZVdyYXBcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYWxpZ25DZW50ZXJcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tYm9keVwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi10aXRsZVwiPlZvbHVtZSBLbm9iPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gZmVhdHVyZWRcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiU2tpICogQnVkZHlcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvbWFzLTEuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+U2tpICogQnVkZHk8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tZGVzY1wiPmJ5IFRpYmVyaXUgTmVhbXU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPGRpdiBjbGFzcz1cImNicC1pdGVtIHB1YmxpY2F0aW9ucyBpbmZvZ3JhcGhpY3NcIj4gPGEgY2xhc3M9XCJjYnAtY2FwdGlvbiBjYnAtbGlnaHRib3hcIiBkYXRhLXRpdGxlPVwiVmlydHVhbGl6YXRpb24gSWNvblwiPiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tZGVmYXVsdFdyYXBcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9pbWctNi5qcGdcIiBhbHQ9XCJcIj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtY2FwdGlvbi1hY3RpdmVXcmFwXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWFsaWduQ2VudGVyXCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWJvZHlcIj4gPGRpdiBjbGFzcz1cImNicC1sLWNhcHRpb24tdGl0bGVcIj5WaXJ0dWFsaXphdGlvbiBJY29uPC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gcHVibGljYXRpb25zIGluZm9ncmFwaGljc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJXb3JsZCBDbG9jayBXaWRnZXRcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvaW1nLTcuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+V29ybGQgQ2xvY2sgV2lkZ2V0PC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBQYXVsIEZsYXZpdXMgTmVjaGl0YTwvZGl2PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2E+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWl0ZW0gcHVibGljYXRpb25zIGluZm9ncmFwaGljc1wiPiA8YSBjbGFzcz1cImNicC1jYXB0aW9uIGNicC1saWdodGJveFwiIGRhdGEtdGl0bGU9XCJTaWNrcHVwcHlcIj4gPGRpdiBjbGFzcz1cImNicC1jYXB0aW9uLWRlZmF1bHRXcmFwXCI+IDxpbWcgc3JjPVwiY3JsYWIvZGlzdC9pbWcvaW1nLTguanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2JwLWNhcHRpb24tYWN0aXZlV3JhcFwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1hbGlnbkNlbnRlclwiPiA8ZGl2IGNsYXNzPVwiY2JwLWwtY2FwdGlvbi1ib2R5XCI+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLXRpdGxlXCI+U2lja3B1cHB5PC9kaXY+IDxkaXYgY2xhc3M9XCJjYnAtbC1jYXB0aW9uLWRlc2NcIj5ieSBDb3NtaW4gQ2FwaXRhbnU8L2Rpdj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9hPiA8L2Rpdj4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+IDxkaXYgY2xhc3M9XCJkaXZpZGU1MFwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj4gPGEgaHJlZj1cIm1hc29ucnktcG9ydGZvbGlvLTQuaHRtbFwiIGNsYXNzPVwiYnRuIGJ0bi10aGVtZS1kYXJrIGJ0bi1sZ1wiPlZpZXcgQWxsIFdvcms8L2E+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS10ZXN0aW1vbmlhbHMnLCAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPiA8ZGl2IGNsYXNzPVwicm93XCI+IDxkaXYgY2xhc3M9XCJjb2wtc20tOCBjb2wtc20tb2Zmc2V0LTJcIj4gPGRpdiBjbGFzcz1cImNlbnRlci1oZWFkaW5nXCI+IDxoMj4gPHN0cm9uZz5XaGF0PC9zdHJvbmc+IE91ciBVc2VycyBTYXkgPC9oMj4gPHNwYW4gY2xhc3M9XCJjZW50ZXItbGluZVwiPjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cInJvd1wiPiA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgbWFyZ2luLWJ0bS0yMFwiPiA8ZGl2IGNsYXNzPVwicXVvdGUgZGFya1wiPiA8YmxvY2txdW90ZT4gPHA+IExvcmVtIElwc3VtIGlzIHNpbXBseSBkdW1teSB0ZXh0IG9mIHRoZSBwcmludGluZyBhbmQgdHlwZXNldHRpbmcgaW5kdXN0cnkuIExvcmVtIElwc3VtIGhhcyBiZWVuIHRoZSBpbmR1c3RyeVxcJ3Mgc3RhbmRhcmQgZHVtbXkgdGV4dCBldmVyIHNpbmNlIHRoZSAxNTAwcy4gPC9wPiA8L2Jsb2NrcXVvdGU+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicXVvdGUtZm9vdGVyIHRleHQtcmlnaHRcIj4gPGRpdiBjbGFzcz1cInF1b3RlLWF1dGhvci1pbWdcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9jdXN0b21lci0xLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGg0PlJha2VzaCBTaGFybWE8L2g0PiA8cD4gPHN0cm9uZz5EZXNpZ25fbXlsaWZlPC9zdHJvbmc+IDwvcD4gPC9kaXY+IDwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbC1tZC00IG1hcmdpbi1idG0tMjBcIj4gPGRpdiBjbGFzcz1cInF1b3RlIGdyZWVuXCI+IDxibG9ja3F1b3RlPiA8cD4gTG9yZW0gSXBzdW0gaXMgc2ltcGx5IGR1bW15IHRleHQgb2YgdGhlIHByaW50aW5nIGFuZCB0eXBlc2V0dGluZyBpbmR1c3RyeS4gTG9yZW0gSXBzdW0gaGFzIGJlZW4gdGhlIGluZHVzdHJ5XFwncyBzdGFuZGFyZCBkdW1teSB0ZXh0IGV2ZXIgc2luY2UgdGhlIDE1MDBzLiA8L3A+IDwvYmxvY2txdW90ZT4gPC9kaXY+IDxkaXYgY2xhc3M9XCJxdW90ZS1mb290ZXIgdGV4dC1yaWdodFwiPiA8ZGl2IGNsYXNzPVwicXVvdGUtYXV0aG9yLWltZ1wiPiA8aW1nIHNyYz1cImNybGFiL2Rpc3QvaW1nL2N1c3RvbWVyLTIuanBnXCIgYWx0PVwiXCI+IDwvZGl2PiA8aDQ+UmFrZXNoIFNoYXJtYTwvaDQ+IDxwPiA8c3Ryb25nPkRlc2lnbl9teWxpZmU8L3N0cm9uZz4gPC9wPiA8L2Rpdj4gPC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgbWFyZ2luLWJ0bS0yMFwiPiA8ZGl2IGNsYXNzPVwicXVvdGUgZGFya1wiPiA8YmxvY2txdW90ZT4gPHA+IExvcmVtIElwc3VtIGlzIHNpbXBseSBkdW1teSB0ZXh0IG9mIHRoZSBwcmludGluZyBhbmQgdHlwZXNldHRpbmcgaW5kdXN0cnkuIExvcmVtIElwc3VtIGhhcyBiZWVuIHRoZSBpbmR1c3RyeVxcJ3Mgc3RhbmRhcmQgZHVtbXkgdGV4dCBldmVyIHNpbmNlIHRoZSAxNTAwcy4gPC9wPiA8L2Jsb2NrcXVvdGU+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicXVvdGUtZm9vdGVyIHRleHQtcmlnaHRcIj4gPGRpdiBjbGFzcz1cInF1b3RlLWF1dGhvci1pbWdcIj4gPGltZyBzcmM9XCJjcmxhYi9kaXN0L2ltZy9jdXN0b21lci0zLmpwZ1wiIGFsdD1cIlwiPiA8L2Rpdj4gPGg0PlJha2VzaCBTaGFybWE8L2g0PiA8cD4gPHN0cm9uZz5EZXNpZ25fbXlsaWZlPC9zdHJvbmc+IDwvcD4gPC9kaXY+IDwvZGl2PiAgPC9kaXY+ICA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG59KTsiXX0=
