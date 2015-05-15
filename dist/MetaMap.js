(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MetaMap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./js/integrations/auth0');
require('./js/integrations/googleanalytics');
require('./js/integrations/newrelic');
require('./js/integrations/raygun');
require('./js/integrations/usersnap');

require('./tags/page-actions.tag');
require('./tags/page-container.tag');
require('./tags/page-content.tag');
require('./tags/page-footer.tag');
require('./tags/page-header.tag');
require('./tags/page-logo.tag');
require('./tags/page-search.tag');
require('./tags/page-sidebar.tag');
require('./tags/page-topmenu.tag');
require('./tags/page-body.tag');

var mm = require('./MetaMap');

module.exports = new mm();

},{"./MetaMap":2,"./js/integrations/auth0":3,"./js/integrations/googleanalytics":5,"./js/integrations/newrelic":6,"./js/integrations/raygun":7,"./js/integrations/usersnap":8,"./tags/page-actions.tag":9,"./tags/page-body.tag":10,"./tags/page-container.tag":11,"./tags/page-content.tag":12,"./tags/page-footer.tag":13,"./tags/page-header.tag":14,"./tags/page-logo.tag":15,"./tags/page-search.tag":16,"./tags/page-sidebar.tag":17,"./tags/page-topmenu.tag":18}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');

var MetaMap = (function () {
    function MetaMap() {
        _classCallCheck(this, MetaMap);

        this.MetaFire = new MetaFire();
        this.Auth0 = new Auth0();
        usersnap();
    }

    _createClass(MetaMap, [{
        key: 'init',
        value: function init() {
            this.Auth0.login().then(function (profile) {
                riot.mount('*');
                _.delay(function () {
                    Metronic.init(); // init metronic core componets
                    Layout.init(); // init layout
                    Demo.init(); // init demo features
                    Index.init(); // init index page
                    Tasks.initDashboardWidget(); // init tash dashboard widget
                }, 250);
            });
        }
    }]);

    return MetaMap;
})();

module.exports = MetaMap;

},{"./js/integrations/auth0":3,"./js/integrations/firebase":4,"./js/integrations/usersnap":8}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
                                that.profile = profile;
                                fulfill(profile);
                            }
                        });
                    }
                });
            });
            return promise;
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
                        fulfill(profile);
                    }
                });
            };
            var promise = new Promise(function (fulfill, reject) {
                var fulfilled = false;
                localforage.getItem('refresh_token').then(function (token) {
                    if (token) {
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
            window.location.reload();
        }
    }]);

    return Auth0;
})();

module.exports = Auth0;

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MetaFire = (function () {
    function MetaFire() {
        _classCallCheck(this, MetaFire);

        this.fb = new Firebase("https://popping-fire-897.firebaseio.com");
    }

    _createClass(MetaFire, [{
        key: "getChild",
        value: function getChild(path) {
            return this.fb.child(path);
        }
    }, {
        key: "getData",
        value: function getData(path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            var promise = new Promise(function (resolve, reject) {
                child.on("value", function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });

            return promise;
        }
    }, {
        key: "setData",
        value: function setData(data, path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            return child.set(data);
        }
    }]);

    return MetaFire;
})();

module.exports = MetaFire;

},{}],5:[function(require,module,exports){
'use strict';

var googleAnalytics = function googleAnalytics(config) {
    var apiKey, e, r;
    if (config == null) {
        config = {};
    }
    apiKey = config.GOOGLE_ANALYTICS_TRACKING_ID;
    if (apiKey && window.location.hostname !== 'localhost') {
        window.GoogleAnalyticsObject = 'ga';
        window.ga || (window.ga = function () {
            (window.ga.q = window.ga.q || []).push(arguments);
        });
        window.ga.ga = +new Date();
        e = document.createElement('script');
        r = document.getElementsByTagName('script')[0];
        e.src = '//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e, r);
        ga('create', apiKey);
        return ga('send', 'pageview');
    }
};

module.exports = googleAnalytics;

},{}],6:[function(require,module,exports){
"use strict";

var newRelic = function newRelic(config) {
    var appId, licenseKey;
    if (config == null) {
        config = {};
    }
    licenseKey = config.NEW_RELIC_LICENSE_KEY;
    appId = config.NEW_RELIC_APPLICATION_ID;
    if (licenseKey && appId && window.location.hostname !== "localhost") {
        return (window.NREUM || (NREUM = {}), __nr_require = (function (t, e, n) {
            function r(n) {
                if (!e[n]) {
                    var o = e[n] = { exports: {} };t[n][0].call(o.exports, function (e) {
                        var o = t[n][1][e];return r(o ? o : e);
                    }, o, o.exports);
                }return e[n].exports;
            }if ("function" == typeof __nr_require) return __nr_require;for (var o = 0; o < n.length; o++) r(n[o]);return r;
        })({ QJf3ax: [function (t, e) {
                function n(t) {
                    function e(e, n, a) {
                        t && t(e, n, a), a || (a = {});for (var c = s(e), f = c.length, u = i(a, o, r), d = 0; f > d; d++) c[d].apply(u, n);return u;
                    }function a(t, e) {
                        f[t] = s(t).concat(e);
                    }function s(t) {
                        return f[t] || [];
                    }function c() {
                        return n(e);
                    }var f = {};return { on: a, emit: e, create: c, listeners: s, _events: f };
                }function r() {
                    return {};
                }var o = "nr@context",
                    i = t("gos");e.exports = n();
            }, { gos: "7eSDFh" }], ee: [function (t, e) {
                e.exports = t("QJf3ax");
            }, {}], 3: [function (t) {
                function e(t, e, n, i, s) {
                    try {
                        c ? c -= 1 : r("err", [s || new UncaughtException(t, e, n)]);
                    } catch (f) {
                        try {
                            r("ierr", [f, new Date().getTime(), !0]);
                        } catch (u) {}
                    }return "function" == typeof a ? a.apply(this, o(arguments)) : !1;
                }function UncaughtException(t, e, n) {
                    this.message = t || "Uncaught error with no additional information", this.sourceURL = e, this.line = n;
                }function n(t) {
                    r("err", [t, new Date().getTime()]);
                }var r = t("handle"),
                    o = t(5),
                    i = t("ee"),
                    a = window.onerror,
                    s = !1,
                    c = 0;t("loader").features.err = !0, window.onerror = e, NREUM.noticeError = n;try {
                    throw new Error();
                } catch (f) {
                    "stack" in f && (t(1), t(4), "addEventListener" in window && t(2), window.XMLHttpRequest && XMLHttpRequest.prototype && XMLHttpRequest.prototype.addEventListener && t(3), s = !0);
                }i.on("fn-start", function () {
                    s && (c += 1);
                }), i.on("fn-err", function (t, e, r) {
                    s && (this.thrown = !0, n(r));
                }), i.on("fn-end", function () {
                    s && !this.thrown && c > 0 && (c -= 1);
                }), i.on("internal-error", function (t) {
                    r("ierr", [t, new Date().getTime(), !0]);
                });
            }, { 1: 8, 2: 5, 3: 9, 4: 7, 5: 21, ee: "QJf3ax", handle: "D5DuLP", loader: "G9z0Bl" }], 4: [function (t) {
                function e() {}if (window.performance && window.performance.timing && window.performance.getEntriesByType) {
                    var n = t("ee"),
                        r = t("handle"),
                        o = t(2);t("loader").features.stn = !0, t(1), n.on("fn-start", function (t) {
                        var e = t[0];e instanceof Event && (this.bstStart = Date.now());
                    }), n.on("fn-end", function (t, e) {
                        var n = t[0];n instanceof Event && r("bst", [n, e, this.bstStart, Date.now()]);
                    }), o.on("fn-start", function (t, e, n) {
                        this.bstStart = Date.now(), this.bstType = n;
                    }), o.on("fn-end", function (t, e) {
                        r("bstTimer", [e, this.bstStart, Date.now(), this.bstType]);
                    }), n.on("pushState-start", function () {
                        this.time = Date.now(), this.startPath = location.pathname + location.hash;
                    }), n.on("pushState-end", function () {
                        r("bstHist", [location.pathname + location.hash, this.startPath, this.time]);
                    }), "addEventListener" in window.performance && (window.performance.addEventListener("webkitresourcetimingbufferfull", function () {
                        r("bstResource", [window.performance.getEntriesByType("resource")]), window.performance.webkitClearResourceTimings();
                    }, !1), window.performance.addEventListener("resourcetimingbufferfull", function () {
                        r("bstResource", [window.performance.getEntriesByType("resource")]), window.performance.clearResourceTimings();
                    }, !1)), document.addEventListener("scroll", e, !1), document.addEventListener("keypress", e, !1), document.addEventListener("click", e, !1);
                }
            }, { 1: 6, 2: 8, ee: "QJf3ax", handle: "D5DuLP", loader: "G9z0Bl" }], 5: [function (t, e) {
                function n(t) {
                    i.inPlace(t, ["addEventListener", "removeEventListener"], "-", r);
                }function r(t) {
                    return t[1];
                }var o = (t(1), t("ee").create()),
                    i = t(2)(o),
                    a = t("gos");if ((e.exports = o, n(window), "getPrototypeOf" in Object)) {
                    for (var s = document; s && !s.hasOwnProperty("addEventListener");) s = Object.getPrototypeOf(s);s && n(s);for (var c = XMLHttpRequest.prototype; c && !c.hasOwnProperty("addEventListener");) c = Object.getPrototypeOf(c);c && n(c);
                } else XMLHttpRequest.prototype.hasOwnProperty("addEventListener") && n(XMLHttpRequest.prototype);o.on("addEventListener-start", function (t) {
                    if (t[1]) {
                        var e = t[1];"function" == typeof e ? this.wrapped = t[1] = a(e, "nr@wrapped", function () {
                            return i(e, "fn-", null, e.name || "anonymous");
                        }) : "function" == typeof e.handleEvent && i.inPlace(e, ["handleEvent"], "fn-");
                    }
                }), o.on("removeEventListener-start", function (t) {
                    var e = this.wrapped;e && (t[1] = e);
                });
            }, { 1: 21, 2: 22, ee: "QJf3ax", gos: "7eSDFh" }], 6: [function (t, e) {
                var n = (t(2), t("ee").create()),
                    r = t(1)(n);e.exports = n, r.inPlace(window.history, ["pushState"], "-");
            }, { 1: 22, 2: 21, ee: "QJf3ax" }], 7: [function (t, e) {
                var n = (t(2), t("ee").create()),
                    r = t(1)(n);e.exports = n, r.inPlace(window, ["requestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame", "msRequestAnimationFrame"], "raf-"), n.on("raf-start", function (t) {
                    t[0] = r(t[0], "fn-");
                });
            }, { 1: 22, 2: 21, ee: "QJf3ax" }], 8: [function (t, e) {
                function n(t, e, n) {
                    var r = t[0];"string" == typeof r && (r = new Function(r)), t[0] = o(r, "fn-", null, n);
                }var r = (t(2), t("ee").create()),
                    o = t(1)(r);e.exports = r, o.inPlace(window, ["setTimeout", "setInterval", "setImmediate"], "setTimer-"), r.on("setTimer-start", n);
            }, { 1: 22, 2: 21, ee: "QJf3ax" }], 9: [function (t, e) {
                function n() {
                    c.inPlace(this, d, "fn-");
                }function r(t, e) {
                    c.inPlace(e, ["onreadystatechange"], "fn-");
                }function o(t, e) {
                    return e;
                }var i = t("ee").create(),
                    a = t(1),
                    s = t(2),
                    c = s(i),
                    f = s(a),
                    u = window.XMLHttpRequest,
                    d = ["onload", "onerror", "onabort", "onloadstart", "onloadend", "onprogress", "ontimeout"];e.exports = i, window.XMLHttpRequest = function (t) {
                    var e = new u(t);try {
                        i.emit("new-xhr", [], e), f.inPlace(e, ["addEventListener", "removeEventListener"], "-", function (t, e) {
                            return e;
                        }), e.addEventListener("readystatechange", n, !1);
                    } catch (r) {
                        try {
                            i.emit("internal-error", [r]);
                        } catch (o) {}
                    }return e;
                }, window.XMLHttpRequest.prototype = u.prototype, c.inPlace(XMLHttpRequest.prototype, ["open", "send"], "-xhr-", o), i.on("send-xhr-start", r), i.on("open-xhr-start", r);
            }, { 1: 5, 2: 22, ee: "QJf3ax" }], 10: [function (t) {
                function e(t) {
                    if ("string" == typeof t && t.length) return t.length;if ("object" != typeof t) return void 0;if ("undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer && t.byteLength) return t.byteLength;if ("undefined" != typeof Blob && t instanceof Blob && t.size) return t.size;if ("undefined" != typeof FormData && t instanceof FormData) return void 0;try {
                        return JSON.stringify(t).length;
                    } catch (e) {
                        return void 0;
                    }
                }function n(t) {
                    var n = this.params,
                        r = this.metrics;if (!this.ended) {
                        this.ended = !0;for (var i = 0; c > i; i++) t.removeEventListener(s[i], this.listener, !1);if (!n.aborted) {
                            if ((r.duration = new Date().getTime() - this.startTime, 4 === t.readyState)) {
                                n.status = t.status;var a = t.responseType,
                                    f = "arraybuffer" === a || "blob" === a || "json" === a ? t.response : t.responseText,
                                    u = e(f);if ((u && (r.rxSize = u), this.sameOrigin)) {
                                    var d = t.getResponseHeader("X-NewRelic-App-Data");d && (n.cat = d.split(", ").pop());
                                }
                            } else n.status = 0;r.cbTime = this.cbTime, o("xhr", [n, r, this.startTime]);
                        }
                    }
                }function r(t, e) {
                    var n = i(e),
                        r = t.params;r.host = n.hostname + ":" + n.port, r.pathname = n.pathname, t.sameOrigin = n.sameOrigin;
                }if (window.XMLHttpRequest && XMLHttpRequest.prototype && XMLHttpRequest.prototype.addEventListener && !/CriOS/.test(navigator.userAgent)) {
                    t("loader").features.xhr = !0;var o = t("handle"),
                        i = t(2),
                        a = t("ee"),
                        s = ["load", "error", "abort", "timeout"],
                        c = s.length,
                        f = t(1);t(4), t(3), a.on("new-xhr", function () {
                        this.totalCbs = 0, this.called = 0, this.cbTime = 0, this.end = n, this.ended = !1, this.xhrGuids = {};
                    }), a.on("open-xhr-start", function (t) {
                        this.params = { method: t[0] }, r(this, t[1]), this.metrics = {};
                    }), a.on("open-xhr-end", function (t, e) {
                        "loader_config" in NREUM && "xpid" in NREUM.loader_config && this.sameOrigin && e.setRequestHeader("X-NewRelic-ID", NREUM.loader_config.xpid);
                    }), a.on("send-xhr-start", function (t, n) {
                        var r = this.metrics,
                            o = t[0],
                            i = this;if (r && o) {
                            var f = e(o);f && (r.txSize = f);
                        }this.startTime = new Date().getTime(), this.listener = function (t) {
                            try {
                                "abort" === t.type && (i.params.aborted = !0), ("load" !== t.type || i.called === i.totalCbs && (i.onloadCalled || "function" != typeof n.onload)) && i.end(n);
                            } catch (e) {
                                try {
                                    a.emit("internal-error", [e]);
                                } catch (r) {}
                            }
                        };for (var u = 0; c > u; u++) n.addEventListener(s[u], this.listener, !1);
                    }), a.on("xhr-cb-time", function (t, e, n) {
                        this.cbTime += t, e ? this.onloadCalled = !0 : this.called += 1, this.called !== this.totalCbs || !this.onloadCalled && "function" == typeof n.onload || this.end(n);
                    }), a.on("xhr-load-added", function (t, e) {
                        var n = "" + f(t) + !!e;this.xhrGuids && !this.xhrGuids[n] && (this.xhrGuids[n] = !0, this.totalCbs += 1);
                    }), a.on("xhr-load-removed", function (t, e) {
                        var n = "" + f(t) + !!e;this.xhrGuids && this.xhrGuids[n] && (delete this.xhrGuids[n], this.totalCbs -= 1);
                    }), a.on("addEventListener-end", function (t, e) {
                        e instanceof XMLHttpRequest && "load" === t[0] && a.emit("xhr-load-added", [t[1], t[2]], e);
                    }), a.on("removeEventListener-end", function (t, e) {
                        e instanceof XMLHttpRequest && "load" === t[0] && a.emit("xhr-load-removed", [t[1], t[2]], e);
                    }), a.on("fn-start", function (t, e, n) {
                        e instanceof XMLHttpRequest && ("onload" === n && (this.onload = !0), ("load" === (t[0] && t[0].type) || this.onload) && (this.xhrCbStart = new Date().getTime()));
                    }), a.on("fn-end", function (t, e) {
                        this.xhrCbStart && a.emit("xhr-cb-time", [new Date().getTime() - this.xhrCbStart, this.onload, e], e);
                    });
                }
            }, { 1: "XL7HBI", 2: 11, 3: 9, 4: 5, ee: "QJf3ax", handle: "D5DuLP", loader: "G9z0Bl" }], 11: [function (t, e) {
                e.exports = function (t) {
                    var e = document.createElement("a"),
                        n = window.location,
                        r = {};e.href = t, r.port = e.port;var o = e.href.split("://");return (!r.port && o[1] && (r.port = o[1].split("/")[0].split("@").pop().split(":")[1]), r.port && "0" !== r.port || (r.port = "https" === o[0] ? "443" : "80"), r.hostname = e.hostname || n.hostname, r.pathname = e.pathname, r.protocol = o[0], "/" !== r.pathname.charAt(0) && (r.pathname = "/" + r.pathname), r.sameOrigin = !e.hostname || e.hostname === document.domain && e.port === n.port && e.protocol === n.protocol, r);
                };
            }, {}], gos: [function (t, e) {
                e.exports = t("7eSDFh");
            }, {}], "7eSDFh": [function (t, e) {
                function n(t, e, n) {
                    if (r.call(t, e)) return t[e];var o = n();if (Object.defineProperty && Object.keys) try {
                        return (Object.defineProperty(t, e, { value: o, writable: !0, enumerable: !1 }), o);
                    } catch (i) {}return (t[e] = o, o);
                }var r = Object.prototype.hasOwnProperty;e.exports = n;
            }, {}], D5DuLP: [function (t, e) {
                function n(t, e, n) {
                    return r.listeners(t).length ? r.emit(t, e, n) : (o[t] || (o[t] = []), void o[t].push(e));
                }var r = t("ee").create(),
                    o = {};e.exports = n, n.ee = r, r.q = o;
            }, { ee: "QJf3ax" }], handle: [function (t, e) {
                e.exports = t("D5DuLP");
            }, {}], XL7HBI: [function (t, e) {
                function n(t) {
                    var e = typeof t;return !t || "object" !== e && "function" !== e ? -1 : t === window ? 0 : i(t, o, function () {
                        return r++;
                    });
                }var r = 1,
                    o = "nr@id",
                    i = t("gos");e.exports = n;
            }, { gos: "7eSDFh" }], id: [function (t, e) {
                e.exports = t("XL7HBI");
            }, {}], loader: [function (t, e) {
                e.exports = t("G9z0Bl");
            }, {}], G9z0Bl: [function (t, e) {
                function n() {
                    var t = l.info = NREUM.info;if (t && t.licenseKey && t.applicationID && f && f.body) {
                        s(h, function (e, n) {
                            e in t || (t[e] = n);
                        }), l.proto = "https" === p.split(":")[0] || t.sslForHttp ? "https://" : "http://", a("mark", ["onload", i()]);var e = f.createElement("script");e.src = l.proto + t.agent, f.body.appendChild(e);
                    }
                }function r() {
                    "complete" === f.readyState && o();
                }function o() {
                    a("mark", ["domContent", i()]);
                }function i() {
                    return new Date().getTime();
                }var a = t("handle"),
                    s = t(1),
                    c = window,
                    f = c.document,
                    u = "addEventListener",
                    d = "attachEvent",
                    p = ("" + location).split("?")[0],
                    h = { beacon: "bam.nr-data.net", errorBeacon: "bam.nr-data.net", agent: "js-agent.newrelic.com/nr-515.min.js" },
                    l = e.exports = { offset: i(), origin: p, features: {} };f[u] ? (f[u]("DOMContentLoaded", o, !1), c[u]("load", n, !1)) : (f[d]("onreadystatechange", r), c[d]("onload", n)), a("mark", ["firstbyte", i()]);
            }, { 1: 20, handle: "D5DuLP" }], 20: [function (t, e) {
                function n(t, e) {
                    var n = [],
                        o = "",
                        i = 0;for (o in t) r.call(t, o) && (n[i] = e(o, t[o]), i += 1);return n;
                }var r = Object.prototype.hasOwnProperty;e.exports = n;
            }, {}], 21: [function (t, e) {
                function n(t, e, n) {
                    e || (e = 0), "undefined" == typeof n && (n = t ? t.length : 0);for (var r = -1, o = n - e || 0, i = Array(0 > o ? 0 : o); ++r < o;) i[r] = t[e + r];return i;
                }e.exports = n;
            }, {}], 22: [function (t, e) {
                function n(t) {
                    return !(t && "function" == typeof t && t.apply && !t[i]);
                }var r = t("ee"),
                    o = t(1),
                    i = "nr@wrapper",
                    a = Object.prototype.hasOwnProperty;e.exports = function (t) {
                    function e(t, e, r, a) {
                        function nrWrapper() {
                            var n, i, s, f;try {
                                i = this, n = o(arguments), s = r && r(n, i) || {};
                            } catch (d) {
                                u([d, "", [n, i, a], s]);
                            }c(e + "start", [n, i, a], s);try {
                                return f = t.apply(i, n);
                            } catch (p) {
                                throw (c(e + "err", [n, i, p], s), p);
                            } finally {
                                c(e + "end", [n, i, f], s);
                            }
                        }return n(t) ? t : (e || (e = ""), nrWrapper[i] = !0, f(t, nrWrapper), nrWrapper);
                    }function s(t, r, o, i) {
                        o || (o = "");var a,
                            s,
                            c,
                            f = "-" === o.charAt(0);for (c = 0; c < r.length; c++) s = r[c], a = t[s], n(a) || (t[s] = e(a, f ? s + o : o, i, s, t));
                    }function c(e, n, r) {
                        try {
                            t.emit(e, n, r);
                        } catch (o) {
                            u([o, e, n, r]);
                        }
                    }function f(t, e) {
                        if (Object.defineProperty && Object.keys) try {
                            var n = Object.keys(t);return (n.forEach(function (n) {
                                Object.defineProperty(e, n, { get: function get() {
                                        return t[n];
                                    }, set: function set(e) {
                                        return (t[n] = e, e);
                                    } });
                            }), e);
                        } catch (r) {
                            u([r]);
                        }for (var o in t) a.call(t, o) && (e[o] = t[o]);return e;
                    }function u(e) {
                        try {
                            t.emit("internal-error", e);
                        } catch (n) {}
                    }return (t || (t = r), e.inPlace = s, e.flag = i, e);
                };
            }, { 1: 21, ee: "QJf3ax" }] }, {}, ["G9z0Bl", 3, 10, 4]));
        ;NREUM.info = { beacon: "bam.nr-data.net", errorBeacon: "bam.nr-data.net", licenseKey: licenseKey, applicationID: appId, sa: 1, agent: "js-agent.newrelic.com/nr-515.min.js" };
    }
};

module.exports = newRelic;

},{}],7:[function(require,module,exports){
'use strict';

var rayGun = function rayGun(config) {
    var apiKey;
    if (config == null) {
        config = {};
    }
    apiKey = config.RAYGUN_API_KEY;
    if (apiKey && window.location.hostname !== 'localhost') {
        if (Raygun != null) {
            Raygun.init(apiKey, {
                ignore3rdPartyErrors: true
            }).attach();
        }
        return Raygun != null ? Raygun.filterSensitiveData(['password']) : void 0;
    }
};

module.exports = rayGun;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-actions', '<div class="page-actions"> <div class="btn-group"> <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <span class="hidden-sm hidden-xs">Actions&nbsp;</span><i class="fa fa-angle-down"></i> </button> <ul class="dropdown-menu" role="menu"> <li class="start active "> <a href="javascript:;"> <i class="fa fa-pencil-square-o"> New Map </i> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-print"> Export/Print </i> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-tag"> Tag Map </i> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-copy"></i> Duplicate Map </a> </li> <li> <a href="javascript:;"> <i class="fa fa-users"></i> Share Map </a> </li> <li class="divider"> </li> <li> <a href="javascript:;"> <i class="fa fa-gear"></i> Settings </a> </li> </ul> </div> <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Page Title </span> </div>', function(opts) {
});
},{"riot":"riot"}],10:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-body', '<div class="page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo"> <page-header></page-header> <div class="clearfix"> </div> <page-container></page-container> <page-footer></page-footer> </div>', function(opts) {
});
},{"riot":"riot"}],11:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-container', '<div class="page-container"> <page-sidebar></page-sidebar> <page-content></page-content> </div>', function(opts) {
});
},{"riot":"riot"}],12:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-content', '<div class="page-content-wrapper"> <div class="page-content"> <div class="page-head"> </div> </div> </div>', function(opts) {
});
},{"riot":"riot"}],13:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-footer', '<div class="page-footer"> <div class="page-footer-inner"> 2015 &copy; Cabrera Research Lab </div> <div class="scroll-to-top"> <i class="icon-arrow-up"></i> </div> </div>', function(opts) {
});
},{"riot":"riot"}],14:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-header', '<div id="header-top" class="page-header navbar navbar-fixed-top"> <div id="header-content" class="page-header-inner"> <page-logo></page-logo> <page-actions></page-actions> <div class="page-top"> <page-search></page-search> <page-topmenu></page-topmenu> </div> </div> </div>', function(opts) {
});
},{"riot":"riot"}],15:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-logo', '<div class="page-logo"> <a href="index.html"> <img src="assets/img/metamap_cloud.png" alt="logo" class="logo-default"> </a> <div class="menu-toggler sidebar-toggler">  </div> </div> <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"> </a>', function(opts) {
});
},{"riot":"riot"}],16:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-search', ' <form class="search-form" action="extra_search.html" method="GET"> <div class="input-group"> <input type="text" class="form-control input-sm" placeholder="Search..." name="query"> <span class="input-group-btn"> <a href="javascript:;" class="btn submit"><i class="fa fa-search"></i></a> </span> </div> </form>', function(opts) {
});
},{"riot":"riot"}],17:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-sidebar', '<div class="page-sidebar-wrapper">   <div class="page-sidebar navbar-collapse collapse">        <ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200"> <li each="{ data }"> <a if="{ icon }" href="javascript:;"> <i class="{ icon }" riot-style="color:#{ color };"></i> <span class="title">{ title }</span> <span class="{ arrow: menu.length }"></span> </a> <ul if="{ menu.length }" class="sub-menu"> <li each="{ menu }"> <a href="javascript:;"> <i class="{ icon }"></i> <span class="title">{ title }</span> </a> </li> </ul> </li> </ul> </div> </div>', function(opts) {

var that = this;
that.data = [];
that.MetaMap = MetaMap;
that.MetaMap.MetaFire.getData('menu/sidebar').then(function (data) {
    that.data = data;
    that.update();
});
});
},{"riot":"riot"}],18:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-topmenu', '<div class="top-menu"> <ul class="nav navbar-nav pull-right"> <li class="separator hide"> </li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_notification_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-bell-o"></i> <span class="badge badge-success"> 1 </span> </a> <ul class="dropdown-menu"> <li class="external"> <h3> <span class="bold">1 pending</span> notification </h3> <a href="javascript:;">view all</a> </li> <li> <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <span class="time">just now</span> <span class="details"> <span class="label label-sm label-icon label-success"> <i class="fa fa-plus"></i> </span> New user registered. </span> </a> </li> </ul> </li> </ul> </li> <li class="separator hide"> </li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_points_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-trophy"></i> <span class="badge badge-success"> 3 </span> </a> <ul class="dropdown-menu"> <li class="external"> <h3> <span class="bold">3 new</span> achievements </h3> <a href="javascript:;">view all</a> </li> <li> <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <span class="time">just now</span> <span class="details"> <span class="label label-sm label-icon label-success"> <i class="fa fa-plus"></i> </span> Created a perspective circle! </span> </a> </li> </ul> </li> </ul> </li>  <li class="separator hide"> </li>  <li class="dropdown" id="header_dashboard_bar"> <a class="dropdown-toggle" href="javascript:;"> <i class="fa fa-home"></i> </a> </li> <li class="separator hide"> </li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_help_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-graduation-cap"></i> </a> <ul class="dropdown-menu"> <li> <ul class="dropdown-menu-list scroller" style="height: 270px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <i class="fa fa-lightbulb-o"></i> <span class="title">Tutorial</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-question"></i> <span class="title">FAQ</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-life-ring"></i> <span class="title">Support</span> </a> </li> <li> <a href="javascript:;" onclick="UserSnap.openReportWindow();"> <i class="fa fa-frown-o"></i> <span class="title">Feedback</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-bullseye"></i> <span class="title">Inline Training</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-laptop"></i> <span class="title">Online Training</span> </a> </li> </ul> </li> </ul> </li> <li class="separator hide"> </li> <li onclick="{ parent.once }" class="dropdown dropdown-user dropdown"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <span class="username username-hide-on-mobile"> { username } </span>  <img alt="" height="39" width="39" class="img-circle" riot-src="{ picture }"> </a> <ul onclick="{ parent.log }" class="dropdown-menu dropdown-menu-default"> <li> <a href="javascript:;"> <i class="fa fa-user"></i> My Profile </a> </li> <li onclick="{ parent.log }" onmouseenter="{ parent.log }"> <a href="javascript:;" onclick="{ parent.log }"> <i class="fa fa-sign-out" onclick="{ parent.log }"></i> Log Out </a> </li> </ul> </li> </ul> </div>', function(opts) {
this.username = '';
this.picture = '';

this.once = function () {
        console.log('foo');
};

var that = this;
localforage.getItem('profile').then(function (profile) {
        that.username = profile.nickname;
        that.picture = profile.picture || 'assets/admin/layout4/img/avatar.jpg';
        that.update();
});

this.logout = function () {
        debugger;
        MetaMap.Auth0.logout();
};
});
},{"riot":"riot"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2ZpcmViYXNlLmpzIiwiQzovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9nb29nbGVhbmFseXRpY3MuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL25ld3JlbGljLmpzIiwiQzovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9yYXlndW4uanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL3VzZXJzbmFwLmpzIiwic3JjL3RhZ3MvcGFnZS1hY3Rpb25zLnRhZyIsInNyYy90YWdzL3BhZ2UtYm9keS50YWciLCJzcmMvdGFncy9wYWdlLWNvbnRhaW5lci50YWciLCJzcmMvdGFncy9wYWdlLWNvbnRlbnQudGFnIiwic3JjL3RhZ3MvcGFnZS1mb290ZXIudGFnIiwic3JjL3RhZ3MvcGFnZS1oZWFkZXIudGFnIiwic3JjL3RhZ3MvcGFnZS1sb2dvLnRhZyIsInNyYy90YWdzL3BhZ2Utc2VhcmNoLnRhZyIsInNyYy90YWdzL3BhZ2Utc2lkZWJhci50YWciLCJzcmMvdGFncy9wYWdlLXRvcG1lbnUudGFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNuQyxPQUFPLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUM3QyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN0QyxPQUFPLENBQUMsMEJBQTBCLENBQUMs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QUFLLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQ3hDLFFBQUksVUFBVSxJQUFJLEtBQUssSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7QUFDakUsZ0JBQU8sTUFBTSxDQUFDLEtBQUssS0FBSyxLQUFLLEdBQUcsRUFBRSxDQUFBLEFBQUMsRUFBRSxZQUFZLEdBQUcsQ0FBQSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUscUJBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUFFLG9CQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQUUsd0JBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsRUFBRTtBQUFFLDRCQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO3FCQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtpQkFBRSxBQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTthQUFFLEFBQUMsSUFBSSxVQUFVLElBQUksT0FBTyxZQUFZLEVBQUUsT0FBTyxZQUFZLENBQUMsQUFBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxPQUFPLENBQUMsQ0FBQTtTQUFFLENBQUEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFBRSw2QkFBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxBQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQUFBQyxPQUFPLENBQUMsQ0FBQTtxQkFBRSxBQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7cUJBQUUsQUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFBRSwrQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO3FCQUFFLEFBQUMsU0FBUyxDQUFDLEdBQUc7QUFBRSwrQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7cUJBQUUsQUFBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUs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LEFBQUMsQ0FBQTtpQkFBRSxBQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQVk7QUFBRSxxQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUEsQUFBQyxDQUFBO2lCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUscUJBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUE7aUJBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQVk7QUFBRSxxQkFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUEsQUFBQyxDQUFBO2lCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxFQUFFO0FBQUUscUJBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQUFBQyxJQUFJLElBQUksRUFBQSxDQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFBRSxDQUFDLENBQUE7YUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsR0FBRyxFQUFHLEFBQUMsSUFBSSxNQUFNLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7QUFBRSx3QkFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFO0FBQUUsNEJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUMsWUFBWSxLQUFLLEtBQUssSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7cUJBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7cUJBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFlBQVk7QUFBRSw0QkFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUE7cUJBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQVk7QUFBRSx5QkFBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxrQkFBa0IsSUFBSSxNQUFNLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsZ0NBQWdDLEVBQUUsWUFBWTtBQUFFLHlCQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsRUFBRSxDQUFBO3FCQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixFQUFFLFlBQVk7QUFBRSx5QkFBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtxQkFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsQUFBQyxFQUFFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO2lCQUFFO2FBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUseUJBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUFFLHFCQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO2lCQUFFLEFBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQUUsMkJBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2lCQUFFLEFBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQSxBQUFDO29CQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQUFBQyxLQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQkFBZ0IsSUFBSSxNQUFNLENBQUEsRUFBRTtBQUFFLHlCQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMs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TSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWTtvQ0FBRSxDQUFDLEdBQUcsYUFBYSxLQUFLLENBQUMsSUFBSSxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsWUFBWTtvQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsQUFBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUEsRUFBRTtBQUFFLHdDQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxBQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFBO2lDQUFFOzZCQUFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQUFBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7eUJBQUU7cUJBQUU7aUJBQUUsQUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsd0JBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQUFBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQTtpQkFBRSxBQUFDLElBQUksTUFBTSxDQUFDLGNBQWMsSUFBSSxjQUFjLENBQUMsU0FBUyxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUFFLHFCQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxBQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDO3dCQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTTt3QkFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxZQUFZO0FBQUUsNEJBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7cUJBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx1Q0FBZSxJQUFJLEtBQUssSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtxQkFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU87NEJBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxBQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLGdDQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFBO3lCQUFFLEFBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxBQUFDLElBQUksSUFBSSxFQUFBLENBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsRUFBRTtBQUFFLGdDQUFJO0FBQUUsdUNBQU8sS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFBLEFBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsWUFBWSxJQUFJLFVBQVUsSUFBSSxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUEsQUFBQyxDQUFBLElBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTs2QkFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQUUsb0NBQUk7QUFBRSxxQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7aUNBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFHOzZCQUFFO3lCQUFFLENBQUMsQUFBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsNEJBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksVUFBVSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLDRCQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFBLEFBQUMsQ0FBQTtxQkFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQSxBQUFDLENBQUE7cUJBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUseUJBQUMsWUFBWSxjQUFjLElBQUksTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUF5QixFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFDLFlBQVksY0FBYyxJQUFJLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtxQkFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFDLFlBQVksY0FBYyxLQUFLLFFBQVEsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQSxBQUFDLEVBQUUsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUEsQUFBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUEsS0FBTSxJQUFJLENBQUMsVUFBVSxHQUFHLEFBQUMsSUFBSSxJQUFJLEVBQUEsQ0FBRSxPQUFPLEVBQUUsQ0FBQSxBQUFDLENBQUEsQUFBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEFBQUMsSUFBSSxJQUFJLEVBQUEsQ0FBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7cUJBQUUsQ0FBQyxDQUFBO2lCQUFFO2FBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLGlCQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQUUsd0JBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO3dCQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUTt3QkFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEFBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEFBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQUFBQyxRQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQUFBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUEsQUFBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQSxBQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBLENBQUE7aUJBQUUsQ0FBQTthQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsaUJBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx3QkFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEFBQUMsSUFBSSxNQUFNLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSTtBQUFFLGdDQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUE7cUJBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFHLEFBQUMsUUFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFBO2lCQUFFLEFBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQUFBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTthQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUseUJBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsMkJBQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEFBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFBO2lCQUFFLEFBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtvQkFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEFBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7YUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsaUJBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQUUsd0JBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEFBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxRQUFRLEtBQUssQ0FBQyxJQUFJLFVBQVUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUs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LEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQSxJQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsd0JBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQUUsQ0FBQyxHQUFHLEVBQUU7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxBQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBLEFBQUMsQ0FBQyxBQUFDLE9BQU8sQ0FBQyxDQUFBO2lCQUFFLEFBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQUFBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTthQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUseUJBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUscUJBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsRUFBRSxXQUFXLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsQUFBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxBQUFDLE9BQU8sQ0FBQyxDQUFBO2lCQUFFLEFBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7YUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFBRSwyQkFBTyxFQUFFLENBQUMsSUFBSSxVQUFVLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUE7aUJBQUUsQUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFFLENBQUMsR0FBRyxZQUFZO29CQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxBQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEVBQUU7QUFBRSw2QkFBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsaUNBQVMsU0FBUyxHQUFHO0FBQUUsZ0NBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEFBQUMsSUFBSTtBQUFFLGlDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTs2QkFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQUUsaUNBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7NkJBQUUsQUFBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQUFBQyxJQUFJO0FBQUUsdUNBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOzZCQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFBRSx1Q0FBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUE7NkJBQUUsU0FBUztBQUFFLGlDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7NkJBQUU7eUJBQUUsQUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUEsQUFBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFNBQVMsQ0FBQSxBQUFDLENBQUE7cUJBQUUsQUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEFBQUMsSUFBSSxDQUFDOzRCQUFFLENBQUM7NEJBQUUsQ0FBQzs0QkFBRSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUE7cUJBQUUsQUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLDRCQUFJO0FBQUUsNkJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTt5QkFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQUUsNkJBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7eUJBQUU7cUJBQUUsQUFBQyxTQUFTLENBQUMs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QTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/XHJcbnJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2F1dGgwJyk7XHJcbnJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2dvb2dsZWFuYWx5dGljcycpO1xyXG5yZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9uZXdyZWxpYycpO1xyXG5yZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9yYXlndW4nKTtcclxucmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvdXNlcnNuYXAnKTtcclxuXHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWFjdGlvbnMudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWNvbnRhaW5lci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtY29udGVudC50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtZm9vdGVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1oZWFkZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWxvZ28udGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLXNlYXJjaC50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2Utc2lkZWJhci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtdG9wbWVudS50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtYm9keS50YWcnKTtcclxuXHJcbnZhciBtbSA9IHJlcXVpcmUoJy4vTWV0YU1hcCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgbW0oKTsiLCLvu792YXIgTWV0YUZpcmUgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9maXJlYmFzZScpO1xyXG52YXIgQXV0aDAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9hdXRoMCcpO1xyXG52YXIgdXNlcnNuYXAgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcCcpO1xyXG5cclxuY2xhc3MgTWV0YU1hcCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUoKTtcclxuICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKCk7XHJcbiAgICAgICAgdXNlcnNuYXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9naW4oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgIHJpb3QubW91bnQoJyonKTtcclxuICAgICAgICAgICAgXy5kZWxheShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0KCk7IC8vIGluaXQgbWV0cm9uaWMgY29yZSBjb21wb25ldHNcclxuICAgICAgICAgICAgICAgIExheW91dC5pbml0KCk7IC8vIGluaXQgbGF5b3V0XHJcbiAgICAgICAgICAgICAgICBEZW1vLmluaXQoKTsgLy8gaW5pdCBkZW1vIGZlYXR1cmVzXHJcbiAgICAgICAgICAgICAgICBJbmRleC5pbml0KCk7IC8vIGluaXQgaW5kZXggcGFnZVxyXG4gICAgICAgICAgICAgICAgVGFza3MuaW5pdERhc2hib2FyZFdpZGdldCgpOyAvLyBpbml0IHRhc2ggZGFzaGJvYXJkIHdpZGdldFxyXG4gICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGFNYXA7Iiwi77u/Y2xhc3MgQXV0aDAge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubG9jayA9IG5ldyBBdXRoMExvY2soJ3dzT25hcnQyM3lWaUlTaHFUNHdmSjE4dzJ2dDJjbDMyJywgJ21ldGFtYXAuYXV0aDAuY29tJyk7XG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhhdC5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5BZnRlclNpZ251cDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZTogJ29wZW5pZCBvZmZsaW5lX2FjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgcHJvZmlsZSwgaWRfdG9rZW4sIGN0b2tlbiwgb3B0LCByZWZyZXNoX3Rva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdyZWZyZXNoX3Rva2VuJywgcmVmcmVzaF90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgbGV0IGdldFByb2ZpbGUgPSAoaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoYXQubG9jay5nZXRQcm9maWxlKGlkX3Rva2VuLCBmdW5jdGlvbihlcnIsIHByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgZnVsZmlsbGVkID0gZmFsc2U7XG4gICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdyZWZyZXNoX3Rva2VuJykudGhlbigodG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5sb2NrLmdldENsaWVudCgpLnJlZnJlc2hUb2tlbih0b2tlbiwgKGEsIHRva09iaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvZmlsZSh0b2tPYmouaWRfdG9rZW4sIGZ1bGZpbGwsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvZmlsZShpZF90b2tlbiwgZnVsZmlsbCwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgbG9nb3V0KCkge1xuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpO1xuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdyZWZyZXNoX3Rva2VuJyk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuXG5cbiIsIu+7v2NsYXNzIE1ldGFGaXJlIHtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShcImh0dHBzOi8vcG9wcGluZy1maXJlLTg5Ny5maXJlYmFzZWlvLmNvbVwiKTtcbiAgICB9XG5cbiAgICBnZXRDaGlsZChwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xuICAgIH1cblxuICAgIGdldERhdGEgKHBhdGgpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjaGlsZC5vbigndmFsdWUnLFxuICAgICAgICAgICAgICAgIChzbmFwc2hvdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNuYXBzaG90LnZhbCgpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICBzZXREYXRhIChkYXRhLCBwYXRoKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoaWxkLnNldChkYXRhKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1ldGFGaXJlO1xuXG5cbiIsIu+7v1xudmFyIGdvb2dsZUFuYWx5dGljcyA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXksIGUsIHI7XG4gICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XHJcbiAgICAgICAgY29uZmlnID0ge307XHJcbiAgICB9XG4gICAgYXBpS2V5ID0gY29uZmlnLkdPT0dMRV9BTkFMWVRJQ1NfVFJBQ0tJTkdfSUQ7XG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgd2luZG93Lkdvb2dsZUFuYWx5dGljc09iamVjdCA9ICdnYSc7XG4gICAgICAgIHdpbmRvdy5nYSB8fCAod2luZG93LmdhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAod2luZG93LmdhLnEgPSB3aW5kb3cuZ2EucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICAgIH0pO1xuICAgICAgICB3aW5kb3cuZ2EuZ2EgPSArKG5ldyBEYXRlKTtcbiAgICAgICAgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICByID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgICAgICBlLnNyYyA9ICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnO1xuICAgICAgICByLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsIHIpO1xuICAgICAgICBnYSgnY3JlYXRlJywgYXBpS2V5KTtcbiAgICAgICAgcmV0dXJuIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgICB9XHJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ29vZ2xlQW5hbHl0aWNzO1xuXG5cbiIsIu+7v1xudmFyIG5ld1JlbGljID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgdmFyIGFwcElkLCBsaWNlbnNlS2V5O1xuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxuICAgIGxpY2Vuc2VLZXkgPSBjb25maWcuTkVXX1JFTElDX0xJQ0VOU0VfS0VZO1xuICAgIGFwcElkID0gY29uZmlnLk5FV19SRUxJQ19BUFBMSUNBVElPTl9JRDtcbiAgICBpZiAobGljZW5zZUtleSAmJiBhcHBJZCAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5OUkVVTSB8fCAoTlJFVU0gPSB7fSksIF9fbnJfcmVxdWlyZSA9IGZ1bmN0aW9uICh0LCBlLCBuKSB7IGZ1bmN0aW9uIHIobikgeyBpZiAoIWVbbl0pIHsgdmFyIG8gPSBlW25dID0geyBleHBvcnRzOiB7fSB9OyB0W25dWzBdLmNhbGwoby5leHBvcnRzLCBmdW5jdGlvbiAoZSkgeyB2YXIgbyA9IHRbbl1bMV1bZV07IHJldHVybiByKG8gPyBvIDogZSkgfSwgbywgby5leHBvcnRzKSB9IHJldHVybiBlW25dLmV4cG9ydHMgfSBpZiAoXCJmdW5jdGlvblwiID09IHR5cGVvZiBfX25yX3JlcXVpcmUpIHJldHVybiBfX25yX3JlcXVpcmU7IGZvciAodmFyIG8gPSAwOyBvIDwgbi5sZW5ndGg7IG8rKykgcihuW29dKTsgcmV0dXJuIHIgfSh7IFFKZjNheDogW2Z1bmN0aW9uICh0LCBlKSB7IGZ1bmN0aW9uIG4odCkgeyBmdW5jdGlvbiBlKGUsIG4sIGEpIHsgdCAmJiB0KGUsIG4sIGEpLCBhIHx8IChhID0ge30pOyBmb3IgKHZhciBjID0gcyhlKSwgZiA9IGMubGVuZ3RoLCB1ID0gaShhLCBvLCByKSwgZCA9IDA7IGYgPiBkOyBkKyspIGNbZF0uYXBwbHkodSwgbik7IHJldHVybiB1IH0gZnVuY3Rpb24gYSh0LCBlKSB7IGZbdF0gPSBzKHQpLmNvbmNhdChlKSB9IGZ1bmN0aW9uIHModCkgeyByZXR1cm4gZlt0XSB8fCBbXSB9IGZ1bmN0aW9uIGMoKSB7IHJldHVybiBuKGUpIH0gdmFyIGYgPSB7fTsgcmV0dXJuIHsgb246IGEsIGVtaXQ6IGUsIGNyZWF0ZTogYywgbGlzdGVuZXJzOiBzLCBfZXZlbnRzOiBmIH0gfSBmdW5jdGlvbiByKCkgeyByZXR1cm4ge30gfSB2YXIgbyA9IFwibnJAY29udGV4dFwiLCBpID0gdChcImdvc1wiKTsgZS5leHBvcnRzID0gbigpIH0sIHsgZ29zOiBcIjdlU0RGaFwiIH1dLCBlZTogW2Z1bmN0aW9uICh0LCBlKSB7IGUuZXhwb3J0cyA9IHQoXCJRSmYzYXhcIikgfSwge31dLCAzOiBbZnVuY3Rpb24gKHQpIHsgZnVuY3Rpb24gZSh0LCBlLCBuLCBpLCBzKSB7IHRyeSB7IGMgPyBjIC09IDEgOiByKFwiZXJyXCIsIFtzIHx8IG5ldyBVbmNhdWdodEV4Y2VwdGlvbih0LCBlLCBuKV0pIH0gY2F0Y2ggKGYpIHsgdHJ5IHsgcihcImllcnJcIiwgW2YsIChuZXcgRGF0ZSkuZ2V0VGltZSgpLCAhMF0pIH0gY2F0Y2ggKHUpIHsgfSB9IHJldHVybiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGEgPyBhLmFwcGx5KHRoaXMsIG8oYXJndW1lbnRzKSkgOiAhMSB9IGZ1bmN0aW9uIFVuY2F1Z2h0RXhjZXB0aW9uKHQsIGUsIG4pIHsgdGhpcy5tZXNzYWdlID0gdCB8fCBcIlVuY2F1Z2h0IGVycm9yIHdpdGggbm8gYWRkaXRpb25hbCBpbmZvcm1hdGlvblwiLCB0aGlzLnNvdXJjZVVSTCA9IGUsIHRoaXMubGluZSA9IG4gfSBmdW5jdGlvbiBuKHQpIHsgcihcImVyclwiLCBbdCwgKG5ldyBEYXRlKS5nZXRUaW1lKCldKSB9IHZhciByID0gdChcImhhbmRsZVwiKSwgbyA9IHQoNSksIGkgPSB0KFwiZWVcIiksIGEgPSB3aW5kb3cub25lcnJvciwgcyA9ICExLCBjID0gMDsgdChcImxvYWRlclwiKS5mZWF0dXJlcy5lcnIgPSAhMCwgd2luZG93Lm9uZXJyb3IgPSBlLCBOUkVVTS5ub3RpY2VFcnJvciA9IG47IHRyeSB7IHRocm93IG5ldyBFcnJvciB9IGNhdGNoIChmKSB7IFwic3RhY2tcIiBpbiBmICYmICh0KDEpLCB0KDQpLCBcImFkZEV2ZW50TGlzdGVuZXJcIiBpbiB3aW5kb3cgJiYgdCgyKSwgd2luZG93LlhNTEh0dHBSZXF1ZXN0ICYmIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZSAmJiBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciAmJiB0KDMpLCBzID0gITApIH0gaS5vbihcImZuLXN0YXJ0XCIsIGZ1bmN0aW9uICgpIHsgcyAmJiAoYyArPSAxKSB9KSwgaS5vbihcImZuLWVyclwiLCBmdW5jdGlvbiAodCwgZSwgcikgeyBzICYmICh0aGlzLnRocm93biA9ICEwLCBuKHIpKSB9KSwgaS5vbihcImZuLWVuZFwiLCBmdW5jdGlvbiAoKSB7IHMgJiYgIXRoaXMudGhyb3duICYmIGMgPiAwICYmIChjIC09IDEpIH0pLCBpLm9uKFwiaW50ZXJuYWwtZXJyb3JcIiwgZnVuY3Rpb24gKHQpIHsgcihcImllcnJcIiwgW3QsIChuZXcgRGF0ZSkuZ2V0VGltZSgpLCAhMF0pIH0pIH0sIHsgMTogOCwgMjogNSwgMzogOSwgNDogNywgNTogMjEsIGVlOiBcIlFKZjNheFwiLCBoYW5kbGU6IFwiRDVEdUxQXCIsIGxvYWRlcjogXCJHOXowQmxcIiB9XSwgNDogW2Z1bmN0aW9uICh0KSB7IGZ1bmN0aW9uIGUoKSB7IH0gaWYgKHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2UudGltaW5nICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKSB7IHZhciBuID0gdChcImVlXCIpLCByID0gdChcImhhbmRsZVwiKSwgbyA9IHQoMik7IHQoXCJsb2FkZXJcIikuZmVhdHVyZXMuc3RuID0gITAsIHQoMSksIG4ub24oXCJmbi1zdGFydFwiLCBmdW5jdGlvbiAodCkgeyB2YXIgZSA9IHRbMF07IGUgaW5zdGFuY2VvZiBFdmVudCAmJiAodGhpcy5ic3RTdGFydCA9IERhdGUubm93KCkpIH0pLCBuLm9uKFwiZm4tZW5kXCIsIGZ1bmN0aW9uICh0LCBlKSB7IHZhciBuID0gdFswXTsgbiBpbnN0YW5jZW9mIEV2ZW50ICYmIHIoXCJic3RcIiwgW24sIGUsIHRoaXMuYnN0U3RhcnQsIERhdGUubm93KCldKSB9KSwgby5vbihcImZuLXN0YXJ0XCIsIGZ1bmN0aW9uICh0LCBlLCBuKSB7IHRoaXMuYnN0U3RhcnQgPSBEYXRlLm5vdygpLCB0aGlzLmJzdFR5cGUgPSBuIH0pLCBvLm9uKFwiZm4tZW5kXCIsIGZ1bmN0aW9uICh0LCBlKSB7IHIoXCJic3RUaW1lclwiLCBbZSwgdGhpcy5ic3RTdGFydCwgRGF0ZS5ub3coKSwgdGhpcy5ic3RUeXBlXSkgfSksIG4ub24oXCJwdXNoU3RhdGUtc3RhcnRcIiwgZnVuY3Rpb24gKCkgeyB0aGlzLnRpbWUgPSBEYXRlLm5vdygpLCB0aGlzLnN0YXJ0UGF0aCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uaGFzaCB9KSwgbi5vbihcInB1c2hTdGF0ZS1lbmRcIiwgZnVuY3Rpb24gKCkgeyByKFwiYnN0SGlzdFwiLCBbbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5oYXNoLCB0aGlzLnN0YXJ0UGF0aCwgdGhpcy50aW1lXSkgfSksIFwiYWRkRXZlbnRMaXN0ZW5lclwiIGluIHdpbmRvdy5wZXJmb3JtYW5jZSAmJiAod2luZG93LnBlcmZvcm1hbmNlLmFkZEV2ZW50TGlzdGVuZXIoXCJ3ZWJraXRyZXNvdXJjZXRpbWluZ2J1ZmZlcmZ1bGxcIiwgZnVuY3Rpb24gKCkgeyByKFwiYnN0UmVzb3VyY2VcIiwgW3dpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKFwicmVzb3VyY2VcIildKSwgd2luZG93LnBlcmZvcm1hbmNlLndlYmtpdENsZWFyUmVzb3VyY2VUaW1pbmdzKCkgfSwgITEpLCB3aW5kb3cucGVyZm9ybWFuY2UuYWRkRXZlbnRMaXN0ZW5lcihcInJlc291cmNldGltaW5nYnVmZmVyZnVsbFwiLCBmdW5jdGlvbiAoKSB7IHIoXCJic3RSZXNvdXJjZVwiLCBbd2luZG93LnBlcmZvcm1hbmNlLmdldEVudHJpZXNCeVR5cGUoXCJyZXNvdXJjZVwiKV0pLCB3aW5kb3cucGVyZm9ybWFuY2UuY2xlYXJSZXNvdXJjZVRpbWluZ3MoKSB9LCAhMSkpLCBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGUsICExKSwgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGUsICExKSwgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUsICExKSB9IH0sIHsgMTogNiwgMjogOCwgZWU6IFwiUUpmM2F4XCIsIGhhbmRsZTogXCJENUR1TFBcIiwgbG9hZGVyOiBcIkc5ejBCbFwiIH1dLCA1OiBbZnVuY3Rpb24gKHQsIGUpIHsgZnVuY3Rpb24gbih0KSB7IGkuaW5QbGFjZSh0LCBbXCJhZGRFdmVudExpc3RlbmVyXCIsIFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiXSwgXCItXCIsIHIpIH0gZnVuY3Rpb24gcih0KSB7IHJldHVybiB0WzFdIH0gdmFyIG8gPSAodCgxKSwgdChcImVlXCIpLmNyZWF0ZSgpKSwgaSA9IHQoMikobyksIGEgPSB0KFwiZ29zXCIpOyBpZiAoZS5leHBvcnRzID0gbywgbih3aW5kb3cpLCBcImdldFByb3RvdHlwZU9mXCIgaW4gT2JqZWN0KSB7IGZvciAodmFyIHMgPSBkb2N1bWVudDsgcyAmJiAhcy5oYXNPd25Qcm9wZXJ0eShcImFkZEV2ZW50TGlzdGVuZXJcIikgOykgcyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihzKTsgcyAmJiBuKHMpOyBmb3IgKHZhciBjID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlOyBjICYmICFjLmhhc093blByb3BlcnR5KFwiYWRkRXZlbnRMaXN0ZW5lclwiKSA7KSBjID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGMpOyBjICYmIG4oYykgfSBlbHNlIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShcImFkZEV2ZW50TGlzdGVuZXJcIikgJiYgbihYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUpOyBvLm9uKFwiYWRkRXZlbnRMaXN0ZW5lci1zdGFydFwiLCBmdW5jdGlvbiAodCkgeyBpZiAodFsxXSkgeyB2YXIgZSA9IHRbMV07IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZSA/IHRoaXMud3JhcHBlZCA9IHRbMV0gPSBhKGUsIFwibnJAd3JhcHBlZFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBpKGUsIFwiZm4tXCIsIG51bGwsIGUubmFtZSB8fCBcImFub255bW91c1wiKSB9KSA6IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZS5oYW5kbGVFdmVudCAmJiBpLmluUGxhY2UoZSwgW1wiaGFuZGxlRXZlbnRcIl0sIFwiZm4tXCIpIH0gfSksIG8ub24oXCJyZW1vdmVFdmVudExpc3RlbmVyLXN0YXJ0XCIsIGZ1bmN0aW9uICh0KSB7IHZhciBlID0gdGhpcy53cmFwcGVkOyBlICYmICh0WzFdID0gZSkgfSkgfSwgeyAxOiAyMSwgMjogMjIsIGVlOiBcIlFKZjNheFwiLCBnb3M6IFwiN2VTREZoXCIgfV0sIDY6IFtmdW5jdGlvbiAodCwgZSkgeyB2YXIgbiA9ICh0KDIpLCB0KFwiZWVcIikuY3JlYXRlKCkpLCByID0gdCgxKShuKTsgZS5leHBvcnRzID0gbiwgci5pblBsYWNlKHdpbmRvdy5oaXN0b3J5LCBbXCJwdXNoU3RhdGVcIl0sIFwiLVwiKSB9LCB7IDE6IDIyLCAyOiAyMSwgZWU6IFwiUUpmM2F4XCIgfV0sIDc6IFtmdW5jdGlvbiAodCwgZSkgeyB2YXIgbiA9ICh0KDIpLCB0KFwiZWVcIikuY3JlYXRlKCkpLCByID0gdCgxKShuKTsgZS5leHBvcnRzID0gbiwgci5pblBsYWNlKHdpbmRvdywgW1wicmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIsIFwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIsIFwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIsIFwibXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl0sIFwicmFmLVwiKSwgbi5vbihcInJhZi1zdGFydFwiLCBmdW5jdGlvbiAodCkgeyB0WzBdID0gcih0WzBdLCBcImZuLVwiKSB9KSB9LCB7IDE6IDIyLCAyOiAyMSwgZWU6IFwiUUpmM2F4XCIgfV0sIDg6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKHQsIGUsIG4pIHsgdmFyIHIgPSB0WzBdOyBcInN0cmluZ1wiID09IHR5cGVvZiByICYmIChyID0gbmV3IEZ1bmN0aW9uKHIpKSwgdFswXSA9IG8ociwgXCJmbi1cIiwgbnVsbCwgbikgfSB2YXIgciA9ICh0KDIpLCB0KFwiZWVcIikuY3JlYXRlKCkpLCBvID0gdCgxKShyKTsgZS5leHBvcnRzID0gciwgby5pblBsYWNlKHdpbmRvdywgW1wic2V0VGltZW91dFwiLCBcInNldEludGVydmFsXCIsIFwic2V0SW1tZWRpYXRlXCJdLCBcInNldFRpbWVyLVwiKSwgci5vbihcInNldFRpbWVyLXN0YXJ0XCIsIG4pIH0sIHsgMTogMjIsIDI6IDIxLCBlZTogXCJRSmYzYXhcIiB9XSwgOTogW2Z1bmN0aW9uICh0LCBlKSB7IGZ1bmN0aW9uIG4oKSB7IGMuaW5QbGFjZSh0aGlzLCBkLCBcImZuLVwiKSB9IGZ1bmN0aW9uIHIodCwgZSkgeyBjLmluUGxhY2UoZSwgW1wib25yZWFkeXN0YXRlY2hhbmdlXCJdLCBcImZuLVwiKSB9IGZ1bmN0aW9uIG8odCwgZSkgeyByZXR1cm4gZSB9IHZhciBpID0gdChcImVlXCIpLmNyZWF0ZSgpLCBhID0gdCgxKSwgcyA9IHQoMiksIGMgPSBzKGkpLCBmID0gcyhhKSwgdSA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCwgZCA9IFtcIm9ubG9hZFwiLCBcIm9uZXJyb3JcIiwgXCJvbmFib3J0XCIsIFwib25sb2Fkc3RhcnRcIiwgXCJvbmxvYWRlbmRcIiwgXCJvbnByb2dyZXNzXCIsIFwib250aW1lb3V0XCJdOyBlLmV4cG9ydHMgPSBpLCB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBmdW5jdGlvbiAodCkgeyB2YXIgZSA9IG5ldyB1KHQpOyB0cnkgeyBpLmVtaXQoXCJuZXcteGhyXCIsIFtdLCBlKSwgZi5pblBsYWNlKGUsIFtcImFkZEV2ZW50TGlzdGVuZXJcIiwgXCJyZW1vdmVFdmVudExpc3RlbmVyXCJdLCBcIi1cIiwgZnVuY3Rpb24gKHQsIGUpIHsgcmV0dXJuIGUgfSksIGUuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgbiwgITEpIH0gY2F0Y2ggKHIpIHsgdHJ5IHsgaS5lbWl0KFwiaW50ZXJuYWwtZXJyb3JcIiwgW3JdKSB9IGNhdGNoIChvKSB7IH0gfSByZXR1cm4gZSB9LCB3aW5kb3cuWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlID0gdS5wcm90b3R5cGUsIGMuaW5QbGFjZShYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUsIFtcIm9wZW5cIiwgXCJzZW5kXCJdLCBcIi14aHItXCIsIG8pLCBpLm9uKFwic2VuZC14aHItc3RhcnRcIiwgciksIGkub24oXCJvcGVuLXhoci1zdGFydFwiLCByKSB9LCB7IDE6IDUsIDI6IDIyLCBlZTogXCJRSmYzYXhcIiB9XSwgMTA6IFtmdW5jdGlvbiAodCkgeyBmdW5jdGlvbiBlKHQpIHsgaWYgKFwic3RyaW5nXCIgPT0gdHlwZW9mIHQgJiYgdC5sZW5ndGgpIHJldHVybiB0Lmxlbmd0aDsgaWYgKFwib2JqZWN0XCIgIT0gdHlwZW9mIHQpIHJldHVybiB2b2lkIDA7IGlmIChcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBBcnJheUJ1ZmZlciAmJiB0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgJiYgdC5ieXRlTGVuZ3RoKSByZXR1cm4gdC5ieXRlTGVuZ3RoOyBpZiAoXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgQmxvYiAmJiB0IGluc3RhbmNlb2YgQmxvYiAmJiB0LnNpemUpIHJldHVybiB0LnNpemU7IGlmIChcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBGb3JtRGF0YSAmJiB0IGluc3RhbmNlb2YgRm9ybURhdGEpIHJldHVybiB2b2lkIDA7IHRyeSB7IHJldHVybiBKU09OLnN0cmluZ2lmeSh0KS5sZW5ndGggfSBjYXRjaCAoZSkgeyByZXR1cm4gdm9pZCAwIH0gfSBmdW5jdGlvbiBuKHQpIHsgdmFyIG4gPSB0aGlzLnBhcmFtcywgciA9IHRoaXMubWV0cmljczsgaWYgKCF0aGlzLmVuZGVkKSB7IHRoaXMuZW5kZWQgPSAhMDsgZm9yICh2YXIgaSA9IDA7IGMgPiBpOyBpKyspIHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihzW2ldLCB0aGlzLmxpc3RlbmVyLCAhMSk7IGlmICghbi5hYm9ydGVkKSB7IGlmIChyLmR1cmF0aW9uID0gKG5ldyBEYXRlKS5nZXRUaW1lKCkgLSB0aGlzLnN0YXJ0VGltZSwgNCA9PT0gdC5yZWFkeVN0YXRlKSB7IG4uc3RhdHVzID0gdC5zdGF0dXM7IHZhciBhID0gdC5yZXNwb25zZVR5cGUsIGYgPSBcImFycmF5YnVmZmVyXCIgPT09IGEgfHwgXCJibG9iXCIgPT09IGEgfHwgXCJqc29uXCIgPT09IGEgPyB0LnJlc3BvbnNlIDogdC5yZXNwb25zZVRleHQsIHUgPSBlKGYpOyBpZiAodSAmJiAoci5yeFNpemUgPSB1KSwgdGhpcy5zYW1lT3JpZ2luKSB7IHZhciBkID0gdC5nZXRSZXNwb25zZUhlYWRlcihcIlgtTmV3UmVsaWMtQXBwLURhdGFcIik7IGQgJiYgKG4uY2F0ID0gZC5zcGxpdChcIiwgXCIpLnBvcCgpKSB9IH0gZWxzZSBuLnN0YXR1cyA9IDA7IHIuY2JUaW1lID0gdGhpcy5jYlRpbWUsIG8oXCJ4aHJcIiwgW24sIHIsIHRoaXMuc3RhcnRUaW1lXSkgfSB9IH0gZnVuY3Rpb24gcih0LCBlKSB7IHZhciBuID0gaShlKSwgciA9IHQucGFyYW1zOyByLmhvc3QgPSBuLmhvc3RuYW1lICsgXCI6XCIgKyBuLnBvcnQsIHIucGF0aG5hbWUgPSBuLnBhdGhuYW1lLCB0LnNhbWVPcmlnaW4gPSBuLnNhbWVPcmlnaW4gfSBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0ICYmIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZSAmJiBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciAmJiAhL0NyaU9TLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7IHQoXCJsb2FkZXJcIikuZmVhdHVyZXMueGhyID0gITA7IHZhciBvID0gdChcImhhbmRsZVwiKSwgaSA9IHQoMiksIGEgPSB0KFwiZWVcIiksIHMgPSBbXCJsb2FkXCIsIFwiZXJyb3JcIiwgXCJhYm9ydFwiLCBcInRpbWVvdXRcIl0sIGMgPSBzLmxlbmd0aCwgZiA9IHQoMSk7IHQoNCksIHQoMyksIGEub24oXCJuZXcteGhyXCIsIGZ1bmN0aW9uICgpIHsgdGhpcy50b3RhbENicyA9IDAsIHRoaXMuY2FsbGVkID0gMCwgdGhpcy5jYlRpbWUgPSAwLCB0aGlzLmVuZCA9IG4sIHRoaXMuZW5kZWQgPSAhMSwgdGhpcy54aHJHdWlkcyA9IHt9IH0pLCBhLm9uKFwib3Blbi14aHItc3RhcnRcIiwgZnVuY3Rpb24gKHQpIHsgdGhpcy5wYXJhbXMgPSB7IG1ldGhvZDogdFswXSB9LCByKHRoaXMsIHRbMV0pLCB0aGlzLm1ldHJpY3MgPSB7fSB9KSwgYS5vbihcIm9wZW4teGhyLWVuZFwiLCBmdW5jdGlvbiAodCwgZSkgeyBcImxvYWRlcl9jb25maWdcIiBpbiBOUkVVTSAmJiBcInhwaWRcIiBpbiBOUkVVTS5sb2FkZXJfY29uZmlnICYmIHRoaXMuc2FtZU9yaWdpbiAmJiBlLnNldFJlcXVlc3RIZWFkZXIoXCJYLU5ld1JlbGljLUlEXCIsIE5SRVVNLmxvYWRlcl9jb25maWcueHBpZCkgfSksIGEub24oXCJzZW5kLXhoci1zdGFydFwiLCBmdW5jdGlvbiAodCwgbikgeyB2YXIgciA9IHRoaXMubWV0cmljcywgbyA9IHRbMF0sIGkgPSB0aGlzOyBpZiAociAmJiBvKSB7IHZhciBmID0gZShvKTsgZiAmJiAoci50eFNpemUgPSBmKSB9IHRoaXMuc3RhcnRUaW1lID0gKG5ldyBEYXRlKS5nZXRUaW1lKCksIHRoaXMubGlzdGVuZXIgPSBmdW5jdGlvbiAodCkgeyB0cnkgeyBcImFib3J0XCIgPT09IHQudHlwZSAmJiAoaS5wYXJhbXMuYWJvcnRlZCA9ICEwKSwgKFwibG9hZFwiICE9PSB0LnR5cGUgfHwgaS5jYWxsZWQgPT09IGkudG90YWxDYnMgJiYgKGkub25sb2FkQ2FsbGVkIHx8IFwiZnVuY3Rpb25cIiAhPSB0eXBlb2Ygbi5vbmxvYWQpKSAmJiBpLmVuZChuKSB9IGNhdGNoIChlKSB7IHRyeSB7IGEuZW1pdChcImludGVybmFsLWVycm9yXCIsIFtlXSkgfSBjYXRjaCAocikgeyB9IH0gfTsgZm9yICh2YXIgdSA9IDA7IGMgPiB1OyB1KyspIG4uYWRkRXZlbnRMaXN0ZW5lcihzW3VdLCB0aGlzLmxpc3RlbmVyLCAhMSkgfSksIGEub24oXCJ4aHItY2ItdGltZVwiLCBmdW5jdGlvbiAodCwgZSwgbikgeyB0aGlzLmNiVGltZSArPSB0LCBlID8gdGhpcy5vbmxvYWRDYWxsZWQgPSAhMCA6IHRoaXMuY2FsbGVkICs9IDEsIHRoaXMuY2FsbGVkICE9PSB0aGlzLnRvdGFsQ2JzIHx8ICF0aGlzLm9ubG9hZENhbGxlZCAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIG4ub25sb2FkIHx8IHRoaXMuZW5kKG4pIH0pLCBhLm9uKFwieGhyLWxvYWQtYWRkZWRcIiwgZnVuY3Rpb24gKHQsIGUpIHsgdmFyIG4gPSBcIlwiICsgZih0KSArICEhZTsgdGhpcy54aHJHdWlkcyAmJiAhdGhpcy54aHJHdWlkc1tuXSAmJiAodGhpcy54aHJHdWlkc1tuXSA9ICEwLCB0aGlzLnRvdGFsQ2JzICs9IDEpIH0pLCBhLm9uKFwieGhyLWxvYWQtcmVtb3ZlZFwiLCBmdW5jdGlvbiAodCwgZSkgeyB2YXIgbiA9IFwiXCIgKyBmKHQpICsgISFlOyB0aGlzLnhockd1aWRzICYmIHRoaXMueGhyR3VpZHNbbl0gJiYgKGRlbGV0ZSB0aGlzLnhockd1aWRzW25dLCB0aGlzLnRvdGFsQ2JzIC09IDEpIH0pLCBhLm9uKFwiYWRkRXZlbnRMaXN0ZW5lci1lbmRcIiwgZnVuY3Rpb24gKHQsIGUpIHsgZSBpbnN0YW5jZW9mIFhNTEh0dHBSZXF1ZXN0ICYmIFwibG9hZFwiID09PSB0WzBdICYmIGEuZW1pdChcInhoci1sb2FkLWFkZGVkXCIsIFt0WzFdLCB0WzJdXSwgZSkgfSksIGEub24oXCJyZW1vdmVFdmVudExpc3RlbmVyLWVuZFwiLCBmdW5jdGlvbiAodCwgZSkgeyBlIGluc3RhbmNlb2YgWE1MSHR0cFJlcXVlc3QgJiYgXCJsb2FkXCIgPT09IHRbMF0gJiYgYS5lbWl0KFwieGhyLWxvYWQtcmVtb3ZlZFwiLCBbdFsxXSwgdFsyXV0sIGUpIH0pLCBhLm9uKFwiZm4tc3RhcnRcIiwgZnVuY3Rpb24gKHQsIGUsIG4pIHsgZSBpbnN0YW5jZW9mIFhNTEh0dHBSZXF1ZXN0ICYmIChcIm9ubG9hZFwiID09PSBuICYmICh0aGlzLm9ubG9hZCA9ICEwKSwgKFwibG9hZFwiID09PSAodFswXSAmJiB0WzBdLnR5cGUpIHx8IHRoaXMub25sb2FkKSAmJiAodGhpcy54aHJDYlN0YXJ0ID0gKG5ldyBEYXRlKS5nZXRUaW1lKCkpKSB9KSwgYS5vbihcImZuLWVuZFwiLCBmdW5jdGlvbiAodCwgZSkgeyB0aGlzLnhockNiU3RhcnQgJiYgYS5lbWl0KFwieGhyLWNiLXRpbWVcIiwgWyhuZXcgRGF0ZSkuZ2V0VGltZSgpIC0gdGhpcy54aHJDYlN0YXJ0LCB0aGlzLm9ubG9hZCwgZV0sIGUpIH0pIH0gfSwgeyAxOiBcIlhMN0hCSVwiLCAyOiAxMSwgMzogOSwgNDogNSwgZWU6IFwiUUpmM2F4XCIsIGhhbmRsZTogXCJENUR1TFBcIiwgbG9hZGVyOiBcIkc5ejBCbFwiIH1dLCAxMTogW2Z1bmN0aW9uICh0LCBlKSB7IGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0KSB7IHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIiksIG4gPSB3aW5kb3cubG9jYXRpb24sIHIgPSB7fTsgZS5ocmVmID0gdCwgci5wb3J0ID0gZS5wb3J0OyB2YXIgbyA9IGUuaHJlZi5zcGxpdChcIjovL1wiKTsgcmV0dXJuICFyLnBvcnQgJiYgb1sxXSAmJiAoci5wb3J0ID0gb1sxXS5zcGxpdChcIi9cIilbMF0uc3BsaXQoXCJAXCIpLnBvcCgpLnNwbGl0KFwiOlwiKVsxXSksIHIucG9ydCAmJiBcIjBcIiAhPT0gci5wb3J0IHx8IChyLnBvcnQgPSBcImh0dHBzXCIgPT09IG9bMF0gPyBcIjQ0M1wiIDogXCI4MFwiKSwgci5ob3N0bmFtZSA9IGUuaG9zdG5hbWUgfHwgbi5ob3N0bmFtZSwgci5wYXRobmFtZSA9IGUucGF0aG5hbWUsIHIucHJvdG9jb2wgPSBvWzBdLCBcIi9cIiAhPT0gci5wYXRobmFtZS5jaGFyQXQoMCkgJiYgKHIucGF0aG5hbWUgPSBcIi9cIiArIHIucGF0aG5hbWUpLCByLnNhbWVPcmlnaW4gPSAhZS5ob3N0bmFtZSB8fCBlLmhvc3RuYW1lID09PSBkb2N1bWVudC5kb21haW4gJiYgZS5wb3J0ID09PSBuLnBvcnQgJiYgZS5wcm90b2NvbCA9PT0gbi5wcm90b2NvbCwgciB9IH0sIHt9XSwgZ29zOiBbZnVuY3Rpb24gKHQsIGUpIHsgZS5leHBvcnRzID0gdChcIjdlU0RGaFwiKSB9LCB7fV0sIFwiN2VTREZoXCI6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKHQsIGUsIG4pIHsgaWYgKHIuY2FsbCh0LCBlKSkgcmV0dXJuIHRbZV07IHZhciBvID0gbigpOyBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5rZXlzKSB0cnkgeyByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsIGUsIHsgdmFsdWU6IG8sIHdyaXRhYmxlOiAhMCwgZW51bWVyYWJsZTogITEgfSksIG8gfSBjYXRjaCAoaSkgeyB9IHJldHVybiB0W2VdID0gbywgbyB9IHZhciByID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTsgZS5leHBvcnRzID0gbiB9LCB7fV0sIEQ1RHVMUDogW2Z1bmN0aW9uICh0LCBlKSB7IGZ1bmN0aW9uIG4odCwgZSwgbikgeyByZXR1cm4gci5saXN0ZW5lcnModCkubGVuZ3RoID8gci5lbWl0KHQsIGUsIG4pIDogKG9bdF0gfHwgKG9bdF0gPSBbXSksIHZvaWQgb1t0XS5wdXNoKGUpKSB9IHZhciByID0gdChcImVlXCIpLmNyZWF0ZSgpLCBvID0ge307IGUuZXhwb3J0cyA9IG4sIG4uZWUgPSByLCByLnEgPSBvIH0sIHsgZWU6IFwiUUpmM2F4XCIgfV0sIGhhbmRsZTogW2Z1bmN0aW9uICh0LCBlKSB7IGUuZXhwb3J0cyA9IHQoXCJENUR1TFBcIikgfSwge31dLCBYTDdIQkk6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKHQpIHsgdmFyIGUgPSB0eXBlb2YgdDsgcmV0dXJuICF0IHx8IFwib2JqZWN0XCIgIT09IGUgJiYgXCJmdW5jdGlvblwiICE9PSBlID8gLTEgOiB0ID09PSB3aW5kb3cgPyAwIDogaSh0LCBvLCBmdW5jdGlvbiAoKSB7IHJldHVybiByKysgfSkgfSB2YXIgciA9IDEsIG8gPSBcIm5yQGlkXCIsIGkgPSB0KFwiZ29zXCIpOyBlLmV4cG9ydHMgPSBuIH0sIHsgZ29zOiBcIjdlU0RGaFwiIH1dLCBpZDogW2Z1bmN0aW9uICh0LCBlKSB7IGUuZXhwb3J0cyA9IHQoXCJYTDdIQklcIikgfSwge31dLCBsb2FkZXI6IFtmdW5jdGlvbiAodCwgZSkgeyBlLmV4cG9ydHMgPSB0KFwiRzl6MEJsXCIpIH0sIHt9XSwgRzl6MEJsOiBbZnVuY3Rpb24gKHQsIGUpIHsgZnVuY3Rpb24gbigpIHsgdmFyIHQgPSBsLmluZm8gPSBOUkVVTS5pbmZvOyBpZiAodCAmJiB0LmxpY2Vuc2VLZXkgJiYgdC5hcHBsaWNhdGlvbklEICYmIGYgJiYgZi5ib2R5KSB7IHMoaCwgZnVuY3Rpb24gKGUsIG4pIHsgZSBpbiB0IHx8ICh0W2VdID0gbikgfSksIGwucHJvdG8gPSBcImh0dHBzXCIgPT09IHAuc3BsaXQoXCI6XCIpWzBdIHx8IHQuc3NsRm9ySHR0cCA/IFwiaHR0cHM6Ly9cIiA6IFwiaHR0cDovL1wiLCBhKFwibWFya1wiLCBbXCJvbmxvYWRcIiwgaSgpXSk7IHZhciBlID0gZi5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpOyBlLnNyYyA9IGwucHJvdG8gKyB0LmFnZW50LCBmLmJvZHkuYXBwZW5kQ2hpbGQoZSkgfSB9IGZ1bmN0aW9uIHIoKSB7IFwiY29tcGxldGVcIiA9PT0gZi5yZWFkeVN0YXRlICYmIG8oKSB9IGZ1bmN0aW9uIG8oKSB7IGEoXCJtYXJrXCIsIFtcImRvbUNvbnRlbnRcIiwgaSgpXSkgfSBmdW5jdGlvbiBpKCkgeyByZXR1cm4gKG5ldyBEYXRlKS5nZXRUaW1lKCkgfSB2YXIgYSA9IHQoXCJoYW5kbGVcIiksIHMgPSB0KDEpLCBjID0gd2luZG93LCBmID0gYy5kb2N1bWVudCwgdSA9IFwiYWRkRXZlbnRMaXN0ZW5lclwiLCBkID0gXCJhdHRhY2hFdmVudFwiLCBwID0gKFwiXCIgKyBsb2NhdGlvbikuc3BsaXQoXCI/XCIpWzBdLCBoID0geyBiZWFjb246IFwiYmFtLm5yLWRhdGEubmV0XCIsIGVycm9yQmVhY29uOiBcImJhbS5uci1kYXRhLm5ldFwiLCBhZ2VudDogXCJqcy1hZ2VudC5uZXdyZWxpYy5jb20vbnItNTE1Lm1pbi5qc1wiIH0sIGwgPSBlLmV4cG9ydHMgPSB7IG9mZnNldDogaSgpLCBvcmlnaW46IHAsIGZlYXR1cmVzOiB7fSB9OyBmW3VdID8gKGZbdV0oXCJET01Db250ZW50TG9hZGVkXCIsIG8sICExKSwgY1t1XShcImxvYWRcIiwgbiwgITEpKSA6IChmW2RdKFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIHIpLCBjW2RdKFwib25sb2FkXCIsIG4pKSwgYShcIm1hcmtcIiwgW1wiZmlyc3RieXRlXCIsIGkoKV0pIH0sIHsgMTogMjAsIGhhbmRsZTogXCJENUR1TFBcIiB9XSwgMjA6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKHQsIGUpIHsgdmFyIG4gPSBbXSwgbyA9IFwiXCIsIGkgPSAwOyBmb3IgKG8gaW4gdCkgci5jYWxsKHQsIG8pICYmIChuW2ldID0gZShvLCB0W29dKSwgaSArPSAxKTsgcmV0dXJuIG4gfSB2YXIgciA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7IGUuZXhwb3J0cyA9IG4gfSwge31dLCAyMTogW2Z1bmN0aW9uICh0LCBlKSB7IGZ1bmN0aW9uIG4odCwgZSwgbikgeyBlIHx8IChlID0gMCksIFwidW5kZWZpbmVkXCIgPT0gdHlwZW9mIG4gJiYgKG4gPSB0ID8gdC5sZW5ndGggOiAwKTsgZm9yICh2YXIgciA9IC0xLCBvID0gbiAtIGUgfHwgMCwgaSA9IEFycmF5KDAgPiBvID8gMCA6IG8pIDsgKytyIDwgbzspIGlbcl0gPSB0W2UgKyByXTsgcmV0dXJuIGkgfSBlLmV4cG9ydHMgPSBuIH0sIHt9XSwgMjI6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKHQpIHsgcmV0dXJuICEodCAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHQgJiYgdC5hcHBseSAmJiAhdFtpXSkgfSB2YXIgciA9IHQoXCJlZVwiKSwgbyA9IHQoMSksIGkgPSBcIm5yQHdyYXBwZXJcIiwgYSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7IGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0KSB7IGZ1bmN0aW9uIGUodCwgZSwgciwgYSkgeyBmdW5jdGlvbiBucldyYXBwZXIoKSB7IHZhciBuLCBpLCBzLCBmOyB0cnkgeyBpID0gdGhpcywgbiA9IG8oYXJndW1lbnRzKSwgcyA9IHIgJiYgcihuLCBpKSB8fCB7fSB9IGNhdGNoIChkKSB7IHUoW2QsIFwiXCIsIFtuLCBpLCBhXSwgc10pIH0gYyhlICsgXCJzdGFydFwiLCBbbiwgaSwgYV0sIHMpOyB0cnkgeyByZXR1cm4gZiA9IHQuYXBwbHkoaSwgbikgfSBjYXRjaCAocCkgeyB0aHJvdyBjKGUgKyBcImVyclwiLCBbbiwgaSwgcF0sIHMpLCBwIH0gZmluYWxseSB7IGMoZSArIFwiZW5kXCIsIFtuLCBpLCBmXSwgcykgfSB9IHJldHVybiBuKHQpID8gdCA6IChlIHx8IChlID0gXCJcIiksIG5yV3JhcHBlcltpXSA9ICEwLCBmKHQsIG5yV3JhcHBlciksIG5yV3JhcHBlcikgfSBmdW5jdGlvbiBzKHQsIHIsIG8sIGkpIHsgbyB8fCAobyA9IFwiXCIpOyB2YXIgYSwgcywgYywgZiA9IFwiLVwiID09PSBvLmNoYXJBdCgwKTsgZm9yIChjID0gMDsgYyA8IHIubGVuZ3RoOyBjKyspIHMgPSByW2NdLCBhID0gdFtzXSwgbihhKSB8fCAodFtzXSA9IGUoYSwgZiA/IHMgKyBvIDogbywgaSwgcywgdCkpIH0gZnVuY3Rpb24gYyhlLCBuLCByKSB7IHRyeSB7IHQuZW1pdChlLCBuLCByKSB9IGNhdGNoIChvKSB7IHUoW28sIGUsIG4sIHJdKSB9IH0gZnVuY3Rpb24gZih0LCBlKSB7IGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmtleXMpIHRyeSB7IHZhciBuID0gT2JqZWN0LmtleXModCk7IHJldHVybiBuLmZvckVhY2goZnVuY3Rpb24gKG4pIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsIG4sIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0W25dIH0sIHNldDogZnVuY3Rpb24gKGUpIHsgcmV0dXJuIHRbbl0gPSBlLCBlIH0gfSkgfSksIGUgfSBjYXRjaCAocikgeyB1KFtyXSkgfSBmb3IgKHZhciBvIGluIHQpIGEuY2FsbCh0LCBvKSAmJiAoZVtvXSA9IHRbb10pOyByZXR1cm4gZSB9IGZ1bmN0aW9uIHUoZSkgeyB0cnkgeyB0LmVtaXQoXCJpbnRlcm5hbC1lcnJvclwiLCBlKSB9IGNhdGNoIChuKSB7IH0gfSByZXR1cm4gdCB8fCAodCA9IHIpLCBlLmluUGxhY2UgPSBzLCBlLmZsYWcgPSBpLCBlIH0gfSwgeyAxOiAyMSwgZWU6IFwiUUpmM2F4XCIgfV0gfSwge30sIFtcIkc5ejBCbFwiLCAzLCAxMCwgNF0pO1xuICAgICAgICA7IE5SRVVNLmluZm8gPSB7IGJlYWNvbjogXCJiYW0ubnItZGF0YS5uZXRcIiwgZXJyb3JCZWFjb246IFwiYmFtLm5yLWRhdGEubmV0XCIsIGxpY2Vuc2VLZXk6IGxpY2Vuc2VLZXksIGFwcGxpY2F0aW9uSUQ6IGFwcElkLCBzYTogMSwgYWdlbnQ6IFwianMtYWdlbnQubmV3cmVsaWMuY29tL25yLTUxNS5taW4uanNcIiB9XG4gICAgICAgIDtcclxuICAgIH1cclxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXdSZWxpYztcbiIsIu+7v1xyXG52YXIgcmF5R3VuID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgdmFyIGFwaUtleTtcclxuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYXBpS2V5ID0gY29uZmlnLlJBWUdVTl9BUElfS0VZO1xyXG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgaWYgKFJheWd1biAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIFJheWd1bi5pbml0KGFwaUtleSwge1xyXG4gICAgICAgICAgICAgICAgaWdub3JlM3JkUGFydHlFcnJvcnM6IHRydWVcclxuICAgICAgICAgICAgfSkuYXR0YWNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBSYXlndW4gIT0gbnVsbCA/IFJheWd1bi5maWx0ZXJTZW5zaXRpdmVEYXRhKFsncGFzc3dvcmQnXSkgOiB2b2lkIDA7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJheUd1bjsiLCLvu79cbnZhciB1c2VyU25hcCA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXkgPSAnMDMyYmFmODctODU0NS00ZWJjLWE1NTctOTM0ODU5MzcxZmE1LmpzJywgcywgeDtcbiAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICBjb25maWcgPSB7fTtcclxuICAgIH1cbiAgICBhcGlLZXkgPSBjb25maWcuVVNFUl9TTkFQX0FQSV9LRVk7XG4gICAgaWYgKGFwaUtleSAmJiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgIT09ICdsb2NhbGhvc3QnKSB7XHJcbiAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0ge1xyXG4gICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcbiAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxuICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTbmFwLnNldEVtYWlsQm94KERvYy5hcHAudXNlci51c2VyTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xuICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICBzLmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xuICAgICAgICB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgcmV0dXJuIHguYXBwZW5kQ2hpbGQocyk7XHJcbiAgICB9XHJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdXNlclNuYXA7XG5cblxuIiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5yaW90LnRhZygncGFnZS1hY3Rpb25zJywgJzxkaXYgY2xhc3M9XCJwYWdlLWFjdGlvbnNcIj4gPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biByZWQtaGF6ZSBidG4tc20gZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPiA8c3BhbiBjbGFzcz1cImhpZGRlbi1zbSBoaWRkZW4teHNcIj5BY3Rpb25zJm5ic3A7PC9zcGFuPjxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT4gPC9idXR0b24+IDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPiA8bGkgY2xhc3M9XCJzdGFydCBhY3RpdmUgXCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWwtc3F1YXJlLW9cIj4gTmV3IE1hcCA8L2k+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtcHJpbnRcIj4gRXhwb3J0L1ByaW50IDwvaT4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS10YWdcIj4gVGFnIE1hcCA8L2k+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtY29weVwiPjwvaT4gRHVwbGljYXRlIE1hcCA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aSBjbGFzcz1cImZhIGZhLXVzZXJzXCI+PC9pPiBTaGFyZSBNYXAgPC9hPiA8L2xpPiA8bGkgY2xhc3M9XCJkaXZpZGVyXCI+IDwvbGk+IDxsaT4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aSBjbGFzcz1cImZhIGZhLWdlYXJcIj48L2k+IFNldHRpbmdzIDwvYT4gPC9saT4gPC91bD4gPC9kaXY+IDxzcGFuPiZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwO1BhZ2UgVGl0bGUgPC9zcGFuPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJpb3QudGFnKCdwYWdlLWJvZHknLCAnPGRpdiBjbGFzcz1cInBhZ2UtaGVhZGVyLWZpeGVkIHBhZ2Utc2lkZWJhci1jbG9zZWQtaGlkZS1sb2dvIHBhZ2Utc2lkZWJhci1jbG9zZWQtaGlkZS1sb2dvXCI+IDxwYWdlLWhlYWRlcj48L3BhZ2UtaGVhZGVyPiA8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj4gPC9kaXY+IDxwYWdlLWNvbnRhaW5lcj48L3BhZ2UtY29udGFpbmVyPiA8cGFnZS1mb290ZXI+PC9wYWdlLWZvb3Rlcj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5yaW90LnRhZygncGFnZS1jb250YWluZXInLCAnPGRpdiBjbGFzcz1cInBhZ2UtY29udGFpbmVyXCI+IDxwYWdlLXNpZGViYXI+PC9wYWdlLXNpZGViYXI+IDxwYWdlLWNvbnRlbnQ+PC9wYWdlLWNvbnRlbnQ+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xucmlvdC50YWcoJ3BhZ2UtY29udGVudCcsICc8ZGl2IGNsYXNzPVwicGFnZS1jb250ZW50LXdyYXBwZXJcIj4gPGRpdiBjbGFzcz1cInBhZ2UtY29udGVudFwiPiA8ZGl2IGNsYXNzPVwicGFnZS1oZWFkXCI+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5yaW90LnRhZygncGFnZS1mb290ZXInLCAnPGRpdiBjbGFzcz1cInBhZ2UtZm9vdGVyXCI+IDxkaXYgY2xhc3M9XCJwYWdlLWZvb3Rlci1pbm5lclwiPiAyMDE1ICZjb3B5OyBDYWJyZXJhIFJlc2VhcmNoIExhYiA8L2Rpdj4gPGRpdiBjbGFzcz1cInNjcm9sbC10by10b3BcIj4gPGkgY2xhc3M9XCJpY29uLWFycm93LXVwXCI+PC9pPiA8L2Rpdj4gPC9kaXY+JywgZnVuY3Rpb24ob3B0cykge1xufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5yaW90LnRhZygncGFnZS1oZWFkZXInLCAnPGRpdiBpZD1cImhlYWRlci10b3BcIiBjbGFzcz1cInBhZ2UtaGVhZGVyIG5hdmJhciBuYXZiYXItZml4ZWQtdG9wXCI+IDxkaXYgaWQ9XCJoZWFkZXItY29udGVudFwiIGNsYXNzPVwicGFnZS1oZWFkZXItaW5uZXJcIj4gPHBhZ2UtbG9nbz48L3BhZ2UtbG9nbz4gPHBhZ2UtYWN0aW9ucz48L3BhZ2UtYWN0aW9ucz4gPGRpdiBjbGFzcz1cInBhZ2UtdG9wXCI+IDxwYWdlLXNlYXJjaD48L3BhZ2Utc2VhcmNoPiA8cGFnZS10b3BtZW51PjwvcGFnZS10b3BtZW51PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xucmlvdC50YWcoJ3BhZ2UtbG9nbycsICc8ZGl2IGNsYXNzPVwicGFnZS1sb2dvXCI+IDxhIGhyZWY9XCJpbmRleC5odG1sXCI+IDxpbWcgc3JjPVwiYXNzZXRzL2ltZy9tZXRhbWFwX2Nsb3VkLnBuZ1wiIGFsdD1cImxvZ29cIiBjbGFzcz1cImxvZ28tZGVmYXVsdFwiPiA8L2E+IDxkaXYgY2xhc3M9XCJtZW51LXRvZ2dsZXIgc2lkZWJhci10b2dnbGVyXCI+ICA8L2Rpdj4gPC9kaXY+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cIm1lbnUtdG9nZ2xlciByZXNwb25zaXZlLXRvZ2dsZXJcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+IDwvYT4nLCBmdW5jdGlvbihvcHRzKSB7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJpb3QudGFnKCdwYWdlLXNlYXJjaCcsICcgPGZvcm0gY2xhc3M9XCJzZWFyY2gtZm9ybVwiIGFjdGlvbj1cImV4dHJhX3NlYXJjaC5odG1sXCIgbWV0aG9kPVwiR0VUXCI+IDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoLi4uXCIgbmFtZT1cInF1ZXJ5XCI+IDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0biBzdWJtaXRcIj48aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiPjwvaT48L2E+IDwvc3Bhbj4gPC9kaXY+IDwvZm9ybT4nLCBmdW5jdGlvbihvcHRzKSB7XG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJpb3QudGFnKCdwYWdlLXNpZGViYXInLCAnPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhci13cmFwcGVyXCI+ICAgPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhciBuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIj4gICAgICAgIDx1bCBjbGFzcz1cInBhZ2Utc2lkZWJhci1tZW51IFwiIGRhdGEta2VlcC1leHBhbmRlZD1cImZhbHNlXCIgZGF0YS1hdXRvLXNjcm9sbD1cInRydWVcIiBkYXRhLXNsaWRlLXNwZWVkPVwiMjAwXCI+IDxsaSBlYWNoPVwieyBkYXRhIH1cIj4gPGEgaWY9XCJ7IGljb24gfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJ7IGljb24gfVwiIHJpb3Qtc3R5bGU9XCJjb2xvcjojeyBjb2xvciB9O1wiPjwvaT4gPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJ7IGFycm93OiBtZW51Lmxlbmd0aCB9XCI+PC9zcGFuPiA8L2E+IDx1bCBpZj1cInsgbWVudS5sZW5ndGggfVwiIGNsYXNzPVwic3ViLW1lbnVcIj4gPGxpIGVhY2g9XCJ7IG1lbnUgfVwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcblxudmFyIHRoYXQgPSB0aGlzO1xudGhhdC5kYXRhID0gW107XG50aGF0Lk1ldGFNYXAgPSBNZXRhTWFwO1xudGhhdC5NZXRhTWFwLk1ldGFGaXJlLmdldERhdGEoJ21lbnUvc2lkZWJhcicpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGF0LmRhdGEgPSBkYXRhO1xuICAgIHRoYXQudXBkYXRlKCk7XG59KTtcbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xucmlvdC50YWcoJ3BhZ2UtdG9wbWVudScsICc8ZGl2IGNsYXNzPVwidG9wLW1lbnVcIj4gPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgcHVsbC1yaWdodFwiPiA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPiA8L2xpPiAgPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfbm90aWZpY2F0aW9uX2JhclwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+IDxpIGNsYXNzPVwiZmEgZmEtYmVsbC1vXCI+PC9pPiA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj4gMSA8L3NwYW4+IDwvYT4gPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPiA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPiA8aDM+IDxzcGFuIGNsYXNzPVwiYm9sZFwiPjEgcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9uIDwvaDM+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT4gPC9saT4gPGxpPiA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+IDxsaT4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8c3BhbiBjbGFzcz1cInRpbWVcIj5qdXN0IG5vdzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJkZXRhaWxzXCI+IDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+IDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9zcGFuPiBOZXcgdXNlciByZWdpc3RlcmVkLiA8L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9saT4gPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj4gPC9saT4gIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX3BvaW50c19iYXJcIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPiA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT4gPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1zdWNjZXNzXCI+IDMgPC9zcGFuPiA8L2E+IDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4gPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj4gPGgzPiA8c3BhbiBjbGFzcz1cImJvbGRcIj4zIG5ldzwvc3Bhbj4gYWNoaWV2ZW1lbnRzIDwvaDM+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT4gPC9saT4gPGxpPiA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+IDxsaT4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8c3BhbiBjbGFzcz1cInRpbWVcIj5qdXN0IG5vdzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJkZXRhaWxzXCI+IDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+IDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9zcGFuPiBDcmVhdGVkIGEgcGVyc3BlY3RpdmUgY2lyY2xlISA8L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9saT4gIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+IDwvbGk+ICA8bGkgY2xhc3M9XCJkcm9wZG93blwiIGlkPVwiaGVhZGVyX2Rhc2hib2FyZF9iYXJcIj4gPGEgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtaG9tZVwiPjwvaT4gPC9hPiA8L2xpPiA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPiA8L2xpPiAgPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfaGVscF9iYXJcIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPiA8aSBjbGFzcz1cImZhIGZhLWdyYWR1YXRpb24tY2FwXCI+PC9pPiA8L2E+IDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4gPGxpPiA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjcwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+IDxsaT4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aSBjbGFzcz1cImZhIGZhLWxpZ2h0YnVsYi1vXCI+PC9pPiA8c3BhbiBjbGFzcz1cInRpdGxlXCI+VHV0b3JpYWw8L3NwYW4+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtcXVlc3Rpb25cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj5GQVE8L3NwYW4+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtbGlmZS1yaW5nXCI+PC9pPiA8c3BhbiBjbGFzcz1cInRpdGxlXCI+U3VwcG9ydDwvc3Bhbj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBvbmNsaWNrPVwiVXNlclNuYXAub3BlblJlcG9ydFdpbmRvdygpO1wiPiA8aSBjbGFzcz1cImZhIGZhLWZyb3duLW9cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj5GZWVkYmFjazwvc3Bhbj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS1idWxsc2V5ZVwiPjwvaT4gPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPklubGluZSBUcmFpbmluZzwvc3Bhbj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS1sYXB0b3BcIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj5PbmxpbmUgVHJhaW5pbmc8L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9saT4gPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj4gPC9saT4gPGxpIG9uY2xpY2s9XCJ7IHBhcmVudC5vbmNlIH1cIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLXVzZXIgZHJvcGRvd25cIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPiA8c3BhbiBjbGFzcz1cInVzZXJuYW1lIHVzZXJuYW1lLWhpZGUtb24tbW9iaWxlXCI+IHsgdXNlcm5hbWUgfSA8L3NwYW4+ICA8aW1nIGFsdD1cIlwiIGhlaWdodD1cIjM5XCIgd2lkdGg9XCIzOVwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHJpb3Qtc3JjPVwieyBwaWN0dXJlIH1cIj4gPC9hPiA8dWwgb25jbGljaz1cInsgcGFyZW50LmxvZyB9XCIgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtZGVmYXVsdFwiPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS11c2VyXCI+PC9pPiBNeSBQcm9maWxlIDwvYT4gPC9saT4gPGxpIG9uY2xpY2s9XCJ7IHBhcmVudC5sb2cgfVwiIG9ubW91c2VlbnRlcj1cInsgcGFyZW50LmxvZyB9XCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBvbmNsaWNrPVwieyBwYXJlbnQubG9nIH1cIj4gPGkgY2xhc3M9XCJmYSBmYS1zaWduLW91dFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5sb2cgfVwiPjwvaT4gTG9nIE91dCA8L2E+IDwvbGk+IDwvdWw+IDwvbGk+IDwvdWw+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcbnRoaXMudXNlcm5hbWUgPSAnJztcbnRoaXMucGljdHVyZSA9ICcnO1xuXG50aGlzLm9uY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmb28nKTtcbn07XG5cbnZhciB0aGF0ID0gdGhpcztcbmxvY2FsZm9yYWdlLmdldEl0ZW0oJ3Byb2ZpbGUnKS50aGVuKGZ1bmN0aW9uIChwcm9maWxlKSB7XG4gICAgICAgIHRoYXQudXNlcm5hbWUgPSBwcm9maWxlLm5pY2tuYW1lO1xuICAgICAgICB0aGF0LnBpY3R1cmUgPSBwcm9maWxlLnBpY3R1cmUgfHwgJ2Fzc2V0cy9hZG1pbi9sYXlvdXQ0L2ltZy9hdmF0YXIuanBnJztcbiAgICAgICAgdGhhdC51cGRhdGUoKTtcbn0pO1xuXG50aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgIE1ldGFNYXAuQXV0aDAubG9nb3V0KCk7XG59O1xufSk7Il19
