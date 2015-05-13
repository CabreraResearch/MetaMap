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
riot.mount('*');

var mm = require('./MetaMap');

module.exports = new mm();

},{"./MetaMap":2,"./js/integrations/auth0":3,"./js/integrations/googleanalytics":5,"./js/integrations/newrelic":6,"./js/integrations/raygun":7,"./js/integrations/usersnap":8,"./tags/page-actions.tag":9,"./tags/page-body.tag":10,"./tags/page-container.tag":11,"./tags/page-content.tag":12,"./tags/page-footer.tag":13,"./tags/page-header.tag":14,"./tags/page-logo.tag":15,"./tags/page-search.tag":16,"./tags/page-sidebar.tag":17,"./tags/page-topmenu.tag":18}],2:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');

var MetaMap = function MetaMap() {
    _classCallCheck(this, MetaMap);

    this.MetaFire = new MetaFire();
};

},{"./js/integrations/firebase":4}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Auth0 = (function () {
    function Auth0() {
        _classCallCheck(this, Auth0);
    }

    _createClass(Auth0, [{
        key: "init",
        value: function init(opts) {
            this.config = opts;
            return this.config;
        }
    }, {
        key: "login",
        value: function login(username, password) {
            var authResponse;
            authResponse = null;
            return authResponse;
        }
    }, {
        key: "getSession",
        value: function getSession() {
            var promise;
            promise = null;
            return promise;
        }
    }, {
        key: "logout",
        value: function logout() {
            var logoutReq;
            logoutReq = null; //getLogout();
            return logoutReq;
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
    var apiKey, s, x;
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
riot.tag('page-container', 'require(\'./page-sidebar\'); require(\'./page-content\'); <div class="page-container"> <page-sidebar></page-sidebar> <page-content></page-content> </div>', function(opts) {

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
riot.tag('page-sidebar', '<div class="page-sidebar-wrapper">   <div class="page-sidebar navbar-collapse collapse">        <ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200"> <li each="{ data }" onclick="{ parent.once }"> <a if="{ icon }" href="javascript:;"> <i class="{ icon }" riot-style="color:#{ color };"></i> <span class="title">{ title }</span> <span class="{ arrow: menu.length }"></span> </a> <ul if="{ menu.length }" class="sub-menu"> <li each="{ menu }"> <a href="javascript:;"> <i class="{ icon }"></i> <span class="title">{ title }</span> </a> </li> </ul> </li> </ul> </div> </div>', function(opts) {
        this.data = [];
        this.MetaMap = require('MetaMap');
        this.MetaMap.MetaFire.getData('menu/sidebar').then( (data) => {
            this.data = data;
            this.update();
        } )

        this.once = function() {
            _.once(window.Layout.init);
        }.bind(this);

    
});
},{"MetaMap":undefined,"riot":"riot"}],18:[function(require,module,exports){
var riot = require('riot');
riot.tag('page-topmenu', '<div class="top-menu"> <ul class="nav navbar-nav pull-right"> <li class="separator hide"> </li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_notification_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-bell-o"></i> <span class="badge badge-success"> 1 </span> </a> <ul class="dropdown-menu"> <li class="external"> <h3><span class="bold">1 pending</span> notification</h3> <a href="javascript:;">view all</a> </li> <li> <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <span class="time">just now</span> <span class="details"> <span class="label label-sm label-icon label-success"> <i class="fa fa-plus"></i> </span> New user registered. </span> </a> </li> </ul> </li> </ul> </li> <li class="separator hide"> </li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_points_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-trophy"></i> <span class="badge badge-success"> 3 </span> </a> <ul class="dropdown-menu"> <li class="external"> <h3><span class="bold">3 new</span> achievements</h3> <a href="javascript:;">view all</a> </li> <li> <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <span class="time">just now</span> <span class="details"> <span class="label label-sm label-icon label-success"> <i class="fa fa-plus"></i> </span> Created a perspective circle! </span> </a> </li> </ul> </li> </ul> </li>  <li class="separator hide">  <li class="dropdown" id="header_dashboard_bar"> <a class="dropdown-toggle" href="javascript:;"> <i class="fa fa-home"></i> </a> </li> <li class="separator hide"> </li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_help_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-graduation-cap"></i> </a> <ul class="dropdown-menu"> <li> <ul class="dropdown-menu-list scroller" style="height: 270px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <i class="fa fa-lightbulb-o"></i> <span class="title">Tutorial</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-question"></i> <span class="title">FAQ</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-life-ring"></i> <span class="title">Support</span> </a> </li> <li> <a href="javascript:;" onclick="UserSnap.openReportWindow();"> <i class="fa fa-frown-o"></i> <span class="title">Feedback</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-bullseye"></i> <span class="title">Inline Training</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-laptop"></i> <span class="title">Online Training</span> </a> </li> </ul> </li> </ul> </li> <li class="separator hide"> </li>   <li class="dropdown dropdown-user dropdown"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <span class="username username-hide-on-mobile"> Nick </span>  <img alt="" class="img-circle" src="assets/admin/layout4/img/avatar9.jpg"> </a> <ul class="dropdown-menu dropdown-menu-default"> <li> <a href="extra_profile.html"> <i class="fa fa-user"></i> My Profile </a> </li> <li> <a href="login.html"> <i class="fa fa-sign-out"></i> Log Out </a> </li> </ul> </li>  </ul> </div>', function(opts) {


});
},{"riot":"riot"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvZW50cnkuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkM6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2ZpcmViYXNlLmpzIiwiQzovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9nb29nbGVhbmFseXRpY3MuanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL25ld3JlbGljLmpzIiwiQzovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9yYXlndW4uanMiLCJDOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL3VzZXJzbmFwLmpzIiwic3JjL3RhZ3MvcGFnZS1hY3Rpb25zLnRhZyIsInNyYy90YWdzL3BhZ2UtYm9keS50YWciLCJzcmMvdGFncy9wYWdlLWNvbnRhaW5lci50YWciLCJzcmMvdGFncy9wYWdlLWNvbnRlbnQudGFnIiwic3JjL3RhZ3MvcGFnZS1mb290ZXIudGFnIiwic3JjL3RhZ3MvcGFnZS1oZWFkZXIudGFnIiwic3JjL3RhZ3MvcGFnZS1sb2dvLnRhZyIsInNyYy90YWdzL3BhZ2Utc2VhcmNoLnRhZyIsInNyYy90YWdzL3BhZ2Utc2lkZWJhci50YWciLCJzcmMvdGFncy9wYWdlLXRvcG1lbnUudGFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNuQyxPQUFPLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUM3QyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN0QyxPQUFPLENBQUMsMEJBQTBCLENBQUMs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LENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO3FCQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtpQkFBRSxBQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTthQUFFLEFBQUMsSUFBSSxVQUFVLElBQUksT0FBTyxZQUFZLEVBQUUsT0FBTyxZQUFZLENBQUMsQUFBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxPQUFPLENBQUMsQ0FBQTtTQUFFLENBQUEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFBRSw2QkFBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxBQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQUFBQyxPQUFPLENBQUMsQ0FBQTtxQkFBRSxBQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7cUJBQUUsQUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFBRSwrQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO3FCQUFFLEFBQUMsU0FBUyxDQUFDLEdBQUc7QUFBRSwrQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7cUJBQUUsQUFBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUE7aUJBQUUsQUFBQyxTQUFTLENBQUMsR0FBRztBQUFFLDJCQUFPLEVBQUUsQ0FBQTtpQkFBRSxBQUFDLElBQUksQ0FBQyxHQUFHLFlBQVk7b0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxBQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUE7YUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsaUJBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsd0JBQUk7QUFBRSx5QkFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFD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QUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQUFBQyxJQUFJLElBQUksRUFBQSxDQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtpQkFBRSxDQUFDLENBQUE7YUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsR0FBRyxFQUFHLEFBQUMsSUFBSSxNQUFNLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7QUFBRSx3QkFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFO0FBQUUsNEJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUMsWUFBWSxLQUFLLEtBQUssSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxD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QUFDLENBQUMsQUFBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7eUJBQUU7cUJBQUU7aUJBQUUsQUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsd0JBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQUFBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQTtpQkFBRSxBQUFDLElBQUksTUFBTSxDQUFDLGNBQWMsSUFBSSxjQUFjLENBQUMsU0FBUyxJQUFJLGNBQWMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUFFLHFCQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxBQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDO3dCQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTTt3QkFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxZQUFZO0FBQUUsNEJBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7cUJBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx1Q0FBZSxJQUFJLEtBQUssSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtxQkFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU87NEJBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxBQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLGdDQUFJLENBQUMsR0FBRyxD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LENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUF5QixFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFDLFlBQVksY0FBYyxJQUFJLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtxQkFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFDLFlBQVksY0FBYyxLQUFLLFFBQVEsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQSxBQUFDLEVBQUUsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUEsQUFBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUEsS0FBTSxJQUFJLENBQUMsVUFBVSxHQUFHLEFBQUMsSUFBSSxJQUFJLEVBQUEsQ0FBRSxPQUFPLEVBQUUsQ0FBQSxBQUFDLENBQUEsQUFBQyxDQUFBO3FCQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSw0QkFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEFBQUMsSUFBSSxJQUFJLEVBQUEsQ0FBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7cUJBQUUsQ0FBQyxDQUFBO2lCQUFFO2FBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLGlCQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQUUsd0JBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO3dCQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUTt3QkFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEFBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEFBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQUFBQyxRQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQUFBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUEsQUFBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQSxBQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBLENBQUE7aUJBQUUsQ0FBQTthQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsaUJBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFBO2FBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx3QkFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEFBQUMsSUFBSSxNQUFNLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSTtBQUFFLGdDQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUE7cUJBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFHLEFBQUMsUUFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFBO2lCQUFFLEFBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQUFBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTthQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUseUJBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsMkJBQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEFBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFBO2lCQUFFLEFBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtvQkFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEFBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7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QUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsd0JBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQUUsQ0FBQyxHQUFHLEVBQUU7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxBQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBLEFBQUMsQ0FBQyxBQUFDLE9BQU8sQ0FBQyxDQUFBO2lCQUFFLEFBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQUFBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTthQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUseUJBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUscUJBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsRUFBRSxXQUFXLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsQUFBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxBQUFDLE9BQU8sQ0FBQyxDQUFBO2lCQUFFLEFBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7YUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUFFLHlCQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFBRSwyQkFBTyxFQUFFLENBQUMsSUFBSSxVQUFVLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUE7aUJBQUUsQUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFFLENBQUMsR0FBRyxZQUFZO29CQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxBQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEVBQUU7QUFBRSw2QkFBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQUUsaUNBQVMsU0FBUyxHQUFHO0FBQUUsZ0NBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEFBQUMsSUFBSTtBQUFFLGlDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTs2QkFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQUUsaUNBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7NkJBQUUsQUFBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQUFBQyxJQUFJO0FBQUUsdUNBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOzZCQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFBRSx1Q0FBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUE7NkJBQUUsU0FBUztBQUFFLGlDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7NkJBQUU7eUJBQUUsQUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUEsQUFBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFNBQVMsQ0FBQSxBQUFDLENBQUE7cUJBQUUsQUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFBRSx5QkFBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEFBQUMsSUFBSSxDQUFDOzRCQUFFLENBQUM7NEJBQUUsQ0FBQzs0QkFBRSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFF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QyxDQUFDO0FBQ3JDLFNBQUMsQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7QUFDM0IsU0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDZixTQUFDLENBQUMsR0FBRyxHQUFHLDBCQUEwQixHQUFHLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEQsU0FBQyxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxlQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDM0I7Q0FDSixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7QUN4QjFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79cclxucmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvYXV0aDAnKTtcclxucmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlYW5hbHl0aWNzJyk7XHJcbnJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL25ld3JlbGljJyk7XHJcbnJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL3JheWd1bicpO1xyXG5yZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy91c2Vyc25hcCcpO1xyXG5cclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtYWN0aW9ucy50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtY29udGFpbmVyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1jb250ZW50LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1mb290ZXIudGFnJyk7XHJcbnJlcXVpcmUoJy4vdGFncy9wYWdlLWhlYWRlci50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2UtbG9nby50YWcnKTtcclxucmVxdWlyZSgnLi90YWdzL3BhZ2Utc2VhcmNoLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1zaWRlYmFyLnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS10b3BtZW51LnRhZycpO1xyXG5yZXF1aXJlKCcuL3RhZ3MvcGFnZS1ib2R5LnRhZycpO1xyXG5yaW90Lm1vdW50KCcqJyk7XHJcblxyXG52YXIgbW0gPSByZXF1aXJlKCcuL01ldGFNYXAnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IG1tKCk7Iiwi77u/dmFyIE1ldGFGaXJlID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZmlyZWJhc2UnKTtcclxuXHJcbmNsYXNzIE1ldGFNYXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlID0gbmV3IE1ldGFGaXJlKCk7XHJcbiAgICB9XHJcblxyXG59Iiwi77u/Y2xhc3MgQXV0aDAge1xuXG4gICAgaW5pdChvcHRzKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gb3B0cztcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICAgIH1cblxuICAgIGxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICB2YXIgYXV0aFJlc3BvbnNlO1xuICAgICAgICBhdXRoUmVzcG9uc2UgPSBudWxsO1xuICAgICAgICByZXR1cm4gYXV0aFJlc3BvbnNlO1xuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIHZhciBwcm9taXNlO1xuICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB2YXIgbG9nb3V0UmVxO1xuICAgICAgICBsb2dvdXRSZXEgPSBudWxsOy8vZ2V0TG9nb3V0KCk7XG4gICAgICAgIHJldHVybiBsb2dvdXRSZXE7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcblxuXG4iLCLvu79jbGFzcyBNZXRhRmlyZSB7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3BvcHBpbmctZmlyZS04OTcuZmlyZWJhc2Vpby5jb21cIik7XG4gICAgfVxuXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcbiAgICB9XG5cbiAgICBnZXREYXRhIChwYXRoKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY2hpbGQub24oJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzbmFwc2hvdC52YWwoKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgc2V0RGF0YSAoZGF0YSwgcGF0aCkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTtcblxuXG4iLCLvu79cbnZhciBnb29nbGVBbmFseXRpY3MgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICB2YXIgYXBpS2V5LCBlLCByO1xuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxuICAgIGFwaUtleSA9IGNvbmZpZy5HT09HTEVfQU5BTFlUSUNTX1RSQUNLSU5HX0lEO1xuICAgIGlmIChhcGlLZXkgJiYgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICE9PSAnbG9jYWxob3N0Jykge1xyXG4gICAgICAgIHdpbmRvdy5Hb29nbGVBbmFseXRpY3NPYmplY3QgPSAnZ2EnO1xuICAgICAgICB3aW5kb3cuZ2EgfHwgKHdpbmRvdy5nYSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgKHdpbmRvdy5nYS5xID0gd2luZG93LmdhLnEgfHwgW10pLnB1c2goYXJndW1lbnRzKTtcclxuICAgICAgICB9KTtcbiAgICAgICAgd2luZG93LmdhLmdhID0gKyhuZXcgRGF0ZSk7XG4gICAgICAgIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgZS5zcmMgPSAnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzJztcbiAgICAgICAgci5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLCByKTtcbiAgICAgICAgZ2EoJ2NyZWF0ZScsIGFwaUtleSk7XG4gICAgICAgIHJldHVybiBnYSgnc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgfVxyXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdvb2dsZUFuYWx5dGljcztcblxuXG4iLCLvu79cbnZhciBuZXdSZWxpYyA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcHBJZCwgbGljZW5zZUtleTtcbiAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICBjb25maWcgPSB7fTtcclxuICAgIH1cbiAgICBsaWNlbnNlS2V5ID0gY29uZmlnLk5FV19SRUxJQ19MSUNFTlNFX0tFWTtcbiAgICBhcHBJZCA9IGNvbmZpZy5ORVdfUkVMSUNfQVBQTElDQVRJT05fSUQ7XG4gICAgaWYgKGxpY2Vuc2VLZXkgJiYgYXBwSWQgJiYgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICE9PSAnbG9jYWxob3N0Jykge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuTlJFVU0gfHwgKE5SRVVNID0ge30pLCBfX25yX3JlcXVpcmUgPSBmdW5jdGlvbiAodCwgZSwgbikgeyBmdW5jdGlvbiByKG4pIHsgaWYgKCFlW25dKSB7IHZhciBvID0gZVtuXSA9IHsgZXhwb3J0czoge30gfTsgdFtuXVswXS5jYWxsKG8uZXhwb3J0cywgZnVuY3Rpb24gKGUpIHsgdmFyIG8gPSB0W25dWzFdW2VdOyByZXR1cm4gcihvID8gbyA6IGUpIH0sIG8sIG8uZXhwb3J0cykgfSByZXR1cm4gZVtuXS5leHBvcnRzIH0gaWYgKFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgX19ucl9yZXF1aXJlKSByZXR1cm4gX19ucl9yZXF1aXJlOyBmb3IgKHZhciBvID0gMDsgbyA8IG4ubGVuZ3RoOyBvKyspIHIobltvXSk7IHJldHVybiByIH0oeyBRSmYzYXg6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKHQpIHsgZnVuY3Rpb24gZShlLCBuLCBhKSB7IHQgJiYgdChlLCBuLCBhKSwgYSB8fCAoYSA9IHt9KTsgZm9yICh2YXIgYyA9IHMoZSksIGYgPSBjLmxlbmd0aCwgdSA9IGkoYSwgbywgciksIGQgPSAwOyBmID4gZDsgZCsrKSBjW2RdLmFwcGx5KHUsIG4pOyByZXR1cm4gdSB9IGZ1bmN0aW9uIGEodCwgZSkgeyBmW3RdID0gcyh0KS5jb25jYXQoZSkgfSBmdW5jdGlvbiBzKHQpIHsgcmV0dXJuIGZbdF0gfHwgW10gfSBmdW5jdGlvbiBjKCkgeyByZXR1cm4gbihlKSB9IHZhciBmID0ge307IHJldHVybiB7IG9uOiBhLCBlbWl0OiBlLCBjcmVhdGU6IGMsIGxpc3RlbmVyczogcywgX2V2ZW50czogZiB9IH0gZnVuY3Rpb24gcigpIHsgcmV0dXJuIHt9IH0gdmFyIG8gPSBcIm5yQGNvbnRleHRcIiwgaSA9IHQoXCJnb3NcIik7IGUuZXhwb3J0cyA9IG4oKSB9LCB7IGdvczogXCI3ZVNERmhcIiB9XSwgZWU6IFtmdW5jdGlvbiAodCwgZSkgeyBlLmV4cG9ydHMgPSB0KFwiUUpmM2F4XCIpIH0sIHt9XSwgMzogW2Z1bmN0aW9uICh0KSB7IGZ1bmN0aW9uIGUodCwgZSwgbiwgaSwgcykgeyB0cnkgeyBjID8gYyAtPSAxIDogcihcImVyclwiLCBbcyB8fCBuZXcgVW5jYXVnaHRFeGNlcHRpb24odCwgZSwgbildKSB9IGNhdGNoIChmKSB7IHRyeSB7IHIoXCJpZXJyXCIsIFtmLCAobmV3IERhdGUpLmdldFRpbWUoKSwgITBdKSB9IGNhdGNoICh1KSB7IH0gfSByZXR1cm4gXCJmdW5jdGlvblwiID09IHR5cGVvZiBhID8gYS5hcHBseSh0aGlzLCBvKGFyZ3VtZW50cykpIDogITEgfSBmdW5jdGlvbiBVbmNhdWdodEV4Y2VwdGlvbih0LCBlLCBuKSB7IHRoaXMubWVzc2FnZSA9IHQgfHwgXCJVbmNhdWdodCBlcnJvciB3aXRoIG5vIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cIiwgdGhpcy5zb3VyY2VVUkwgPSBlLCB0aGlzLmxpbmUgPSBuIH0gZnVuY3Rpb24gbih0KSB7IHIoXCJlcnJcIiwgW3QsIChuZXcgRGF0ZSkuZ2V0VGltZSgpXSkgfSB2YXIgciA9IHQoXCJoYW5kbGVcIiksIG8gPSB0KDUpLCBpID0gdChcImVlXCIpLCBhID0gd2luZG93Lm9uZXJyb3IsIHMgPSAhMSwgYyA9IDA7IHQoXCJsb2FkZXJcIikuZmVhdHVyZXMuZXJyID0gITAsIHdpbmRvdy5vbmVycm9yID0gZSwgTlJFVU0ubm90aWNlRXJyb3IgPSBuOyB0cnkgeyB0aHJvdyBuZXcgRXJyb3IgfSBjYXRjaCAoZikgeyBcInN0YWNrXCIgaW4gZiAmJiAodCgxKSwgdCg0KSwgXCJhZGRFdmVudExpc3RlbmVyXCIgaW4gd2luZG93ICYmIHQoMiksIHdpbmRvdy5YTUxIdHRwUmVxdWVzdCAmJiBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUgJiYgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgJiYgdCgzKSwgcyA9ICEwKSB9IGkub24oXCJmbi1zdGFydFwiLCBmdW5jdGlvbiAoKSB7IHMgJiYgKGMgKz0gMSkgfSksIGkub24oXCJmbi1lcnJcIiwgZnVuY3Rpb24gKHQsIGUsIHIpIHsgcyAmJiAodGhpcy50aHJvd24gPSAhMCwgbihyKSkgfSksIGkub24oXCJmbi1lbmRcIiwgZnVuY3Rpb24gKCkgeyBzICYmICF0aGlzLnRocm93biAmJiBjID4gMCAmJiAoYyAtPSAxKSB9KSwgaS5vbihcImludGVybmFsLWVycm9yXCIsIGZ1bmN0aW9uICh0KSB7IHIoXCJpZXJyXCIsIFt0LCAobmV3IERhdGUpLmdldFRpbWUoKSwgITBdKSB9KSB9LCB7IDE6IDgsIDI6IDUsIDM6IDksIDQ6IDcsIDU6IDIxLCBlZTogXCJRSmYzYXhcIiwgaGFuZGxlOiBcIkQ1RHVMUFwiLCBsb2FkZXI6IFwiRzl6MEJsXCIgfV0sIDQ6IFtmdW5jdGlvbiAodCkgeyBmdW5jdGlvbiBlKCkgeyB9IGlmICh3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZyAmJiB3aW5kb3cucGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5VHlwZSkgeyB2YXIgbiA9IHQoXCJlZVwiKSwgciA9IHQoXCJoYW5kbGVcIiksIG8gPSB0KDIpOyB0KFwibG9hZGVyXCIpLmZlYXR1cmVzLnN0biA9ICEwLCB0KDEpLCBuLm9uKFwiZm4tc3RhcnRcIiwgZnVuY3Rpb24gKHQpIHsgdmFyIGUgPSB0WzBdOyBlIGluc3RhbmNlb2YgRXZlbnQgJiYgKHRoaXMuYnN0U3RhcnQgPSBEYXRlLm5vdygpKSB9KSwgbi5vbihcImZuLWVuZFwiLCBmdW5jdGlvbiAodCwgZSkgeyB2YXIgbiA9IHRbMF07IG4gaW5zdGFuY2VvZiBFdmVudCAmJiByKFwiYnN0XCIsIFtuLCBlLCB0aGlzLmJzdFN0YXJ0LCBEYXRlLm5vdygpXSkgfSksIG8ub24oXCJmbi1zdGFydFwiLCBmdW5jdGlvbiAodCwgZSwgbikgeyB0aGlzLmJzdFN0YXJ0ID0gRGF0ZS5ub3coKSwgdGhpcy5ic3RUeXBlID0gbiB9KSwgby5vbihcImZuLWVuZFwiLCBmdW5jdGlvbiAodCwgZSkgeyByKFwiYnN0VGltZXJcIiwgW2UsIHRoaXMuYnN0U3RhcnQsIERhdGUubm93KCksIHRoaXMuYnN0VHlwZV0pIH0pLCBuLm9uKFwicHVzaFN0YXRlLXN0YXJ0XCIsIGZ1bmN0aW9uICgpIHsgdGhpcy50aW1lID0gRGF0ZS5ub3coKSwgdGhpcy5zdGFydFBhdGggPSBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLmhhc2ggfSksIG4ub24oXCJwdXNoU3RhdGUtZW5kXCIsIGZ1bmN0aW9uICgpIHsgcihcImJzdEhpc3RcIiwgW2xvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uaGFzaCwgdGhpcy5zdGFydFBhdGgsIHRoaXMudGltZV0pIH0pLCBcImFkZEV2ZW50TGlzdGVuZXJcIiBpbiB3aW5kb3cucGVyZm9ybWFuY2UgJiYgKHdpbmRvdy5wZXJmb3JtYW5jZS5hZGRFdmVudExpc3RlbmVyKFwid2Via2l0cmVzb3VyY2V0aW1pbmdidWZmZXJmdWxsXCIsIGZ1bmN0aW9uICgpIHsgcihcImJzdFJlc291cmNlXCIsIFt3aW5kb3cucGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5VHlwZShcInJlc291cmNlXCIpXSksIHdpbmRvdy5wZXJmb3JtYW5jZS53ZWJraXRDbGVhclJlc291cmNlVGltaW5ncygpIH0sICExKSwgd2luZG93LnBlcmZvcm1hbmNlLmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNvdXJjZXRpbWluZ2J1ZmZlcmZ1bGxcIiwgZnVuY3Rpb24gKCkgeyByKFwiYnN0UmVzb3VyY2VcIiwgW3dpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKFwicmVzb3VyY2VcIildKSwgd2luZG93LnBlcmZvcm1hbmNlLmNsZWFyUmVzb3VyY2VUaW1pbmdzKCkgfSwgITEpKSwgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBlLCAhMSksIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBlLCAhMSksIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlLCAhMSkgfSB9LCB7IDE6IDYsIDI6IDgsIGVlOiBcIlFKZjNheFwiLCBoYW5kbGU6IFwiRDVEdUxQXCIsIGxvYWRlcjogXCJHOXowQmxcIiB9XSwgNTogW2Z1bmN0aW9uICh0LCBlKSB7IGZ1bmN0aW9uIG4odCkgeyBpLmluUGxhY2UodCwgW1wiYWRkRXZlbnRMaXN0ZW5lclwiLCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIl0sIFwiLVwiLCByKSB9IGZ1bmN0aW9uIHIodCkgeyByZXR1cm4gdFsxXSB9IHZhciBvID0gKHQoMSksIHQoXCJlZVwiKS5jcmVhdGUoKSksIGkgPSB0KDIpKG8pLCBhID0gdChcImdvc1wiKTsgaWYgKGUuZXhwb3J0cyA9IG8sIG4od2luZG93KSwgXCJnZXRQcm90b3R5cGVPZlwiIGluIE9iamVjdCkgeyBmb3IgKHZhciBzID0gZG9jdW1lbnQ7IHMgJiYgIXMuaGFzT3duUHJvcGVydHkoXCJhZGRFdmVudExpc3RlbmVyXCIpIDspIHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yocyk7IHMgJiYgbihzKTsgZm9yICh2YXIgYyA9IFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZTsgYyAmJiAhYy5oYXNPd25Qcm9wZXJ0eShcImFkZEV2ZW50TGlzdGVuZXJcIikgOykgYyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjKTsgYyAmJiBuKGMpIH0gZWxzZSBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoXCJhZGRFdmVudExpc3RlbmVyXCIpICYmIG4oWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlKTsgby5vbihcImFkZEV2ZW50TGlzdGVuZXItc3RhcnRcIiwgZnVuY3Rpb24gKHQpIHsgaWYgKHRbMV0pIHsgdmFyIGUgPSB0WzFdOyBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGUgPyB0aGlzLndyYXBwZWQgPSB0WzFdID0gYShlLCBcIm5yQHdyYXBwZWRcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gaShlLCBcImZuLVwiLCBudWxsLCBlLm5hbWUgfHwgXCJhbm9ueW1vdXNcIikgfSkgOiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGUuaGFuZGxlRXZlbnQgJiYgaS5pblBsYWNlKGUsIFtcImhhbmRsZUV2ZW50XCJdLCBcImZuLVwiKSB9IH0pLCBvLm9uKFwicmVtb3ZlRXZlbnRMaXN0ZW5lci1zdGFydFwiLCBmdW5jdGlvbiAodCkgeyB2YXIgZSA9IHRoaXMud3JhcHBlZDsgZSAmJiAodFsxXSA9IGUpIH0pIH0sIHsgMTogMjEsIDI6IDIyLCBlZTogXCJRSmYzYXhcIiwgZ29zOiBcIjdlU0RGaFwiIH1dLCA2OiBbZnVuY3Rpb24gKHQsIGUpIHsgdmFyIG4gPSAodCgyKSwgdChcImVlXCIpLmNyZWF0ZSgpKSwgciA9IHQoMSkobik7IGUuZXhwb3J0cyA9IG4sIHIuaW5QbGFjZSh3aW5kb3cuaGlzdG9yeSwgW1wicHVzaFN0YXRlXCJdLCBcIi1cIikgfSwgeyAxOiAyMiwgMjogMjEsIGVlOiBcIlFKZjNheFwiIH1dLCA3OiBbZnVuY3Rpb24gKHQsIGUpIHsgdmFyIG4gPSAodCgyKSwgdChcImVlXCIpLmNyZWF0ZSgpKSwgciA9IHQoMSkobik7IGUuZXhwb3J0cyA9IG4sIHIuaW5QbGFjZSh3aW5kb3csIFtcInJlcXVlc3RBbmltYXRpb25GcmFtZVwiLCBcIm1velJlcXVlc3RBbmltYXRpb25GcmFtZVwiLCBcIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVwiLCBcIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdLCBcInJhZi1cIiksIG4ub24oXCJyYWYtc3RhcnRcIiwgZnVuY3Rpb24gKHQpIHsgdFswXSA9IHIodFswXSwgXCJmbi1cIikgfSkgfSwgeyAxOiAyMiwgMjogMjEsIGVlOiBcIlFKZjNheFwiIH1dLCA4OiBbZnVuY3Rpb24gKHQsIGUpIHsgZnVuY3Rpb24gbih0LCBlLCBuKSB7IHZhciByID0gdFswXTsgXCJzdHJpbmdcIiA9PSB0eXBlb2YgciAmJiAociA9IG5ldyBGdW5jdGlvbihyKSksIHRbMF0gPSBvKHIsIFwiZm4tXCIsIG51bGwsIG4pIH0gdmFyIHIgPSAodCgyKSwgdChcImVlXCIpLmNyZWF0ZSgpKSwgbyA9IHQoMSkocik7IGUuZXhwb3J0cyA9IHIsIG8uaW5QbGFjZSh3aW5kb3csIFtcInNldFRpbWVvdXRcIiwgXCJzZXRJbnRlcnZhbFwiLCBcInNldEltbWVkaWF0ZVwiXSwgXCJzZXRUaW1lci1cIiksIHIub24oXCJzZXRUaW1lci1zdGFydFwiLCBuKSB9LCB7IDE6IDIyLCAyOiAyMSwgZWU6IFwiUUpmM2F4XCIgfV0sIDk6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKCkgeyBjLmluUGxhY2UodGhpcywgZCwgXCJmbi1cIikgfSBmdW5jdGlvbiByKHQsIGUpIHsgYy5pblBsYWNlKGUsIFtcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiXSwgXCJmbi1cIikgfSBmdW5jdGlvbiBvKHQsIGUpIHsgcmV0dXJuIGUgfSB2YXIgaSA9IHQoXCJlZVwiKS5jcmVhdGUoKSwgYSA9IHQoMSksIHMgPSB0KDIpLCBjID0gcyhpKSwgZiA9IHMoYSksIHUgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QsIGQgPSBbXCJvbmxvYWRcIiwgXCJvbmVycm9yXCIsIFwib25hYm9ydFwiLCBcIm9ubG9hZHN0YXJ0XCIsIFwib25sb2FkZW5kXCIsIFwib25wcm9ncmVzc1wiLCBcIm9udGltZW91dFwiXTsgZS5leHBvcnRzID0gaSwgd2luZG93LlhNTEh0dHBSZXF1ZXN0ID0gZnVuY3Rpb24gKHQpIHsgdmFyIGUgPSBuZXcgdSh0KTsgdHJ5IHsgaS5lbWl0KFwibmV3LXhoclwiLCBbXSwgZSksIGYuaW5QbGFjZShlLCBbXCJhZGRFdmVudExpc3RlbmVyXCIsIFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiXSwgXCItXCIsIGZ1bmN0aW9uICh0LCBlKSB7IHJldHVybiBlIH0pLCBlLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIG4sICExKSB9IGNhdGNoIChyKSB7IHRyeSB7IGkuZW1pdChcImludGVybmFsLWVycm9yXCIsIFtyXSkgfSBjYXRjaCAobykgeyB9IH0gcmV0dXJuIGUgfSwgd2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZSA9IHUucHJvdG90eXBlLCBjLmluUGxhY2UoWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLCBbXCJvcGVuXCIsIFwic2VuZFwiXSwgXCIteGhyLVwiLCBvKSwgaS5vbihcInNlbmQteGhyLXN0YXJ0XCIsIHIpLCBpLm9uKFwib3Blbi14aHItc3RhcnRcIiwgcikgfSwgeyAxOiA1LCAyOiAyMiwgZWU6IFwiUUpmM2F4XCIgfV0sIDEwOiBbZnVuY3Rpb24gKHQpIHsgZnVuY3Rpb24gZSh0KSB7IGlmIChcInN0cmluZ1wiID09IHR5cGVvZiB0ICYmIHQubGVuZ3RoKSByZXR1cm4gdC5sZW5ndGg7IGlmIChcIm9iamVjdFwiICE9IHR5cGVvZiB0KSByZXR1cm4gdm9pZCAwOyBpZiAoXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgQXJyYXlCdWZmZXIgJiYgdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyICYmIHQuYnl0ZUxlbmd0aCkgcmV0dXJuIHQuYnl0ZUxlbmd0aDsgaWYgKFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIEJsb2IgJiYgdCBpbnN0YW5jZW9mIEJsb2IgJiYgdC5zaXplKSByZXR1cm4gdC5zaXplOyBpZiAoXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgRm9ybURhdGEgJiYgdCBpbnN0YW5jZW9mIEZvcm1EYXRhKSByZXR1cm4gdm9pZCAwOyB0cnkgeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkodCkubGVuZ3RoIH0gY2F0Y2ggKGUpIHsgcmV0dXJuIHZvaWQgMCB9IH0gZnVuY3Rpb24gbih0KSB7IHZhciBuID0gdGhpcy5wYXJhbXMsIHIgPSB0aGlzLm1ldHJpY3M7IGlmICghdGhpcy5lbmRlZCkgeyB0aGlzLmVuZGVkID0gITA7IGZvciAodmFyIGkgPSAwOyBjID4gaTsgaSsrKSB0LnJlbW92ZUV2ZW50TGlzdGVuZXIoc1tpXSwgdGhpcy5saXN0ZW5lciwgITEpOyBpZiAoIW4uYWJvcnRlZCkgeyBpZiAoci5kdXJhdGlvbiA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWUsIDQgPT09IHQucmVhZHlTdGF0ZSkgeyBuLnN0YXR1cyA9IHQuc3RhdHVzOyB2YXIgYSA9IHQucmVzcG9uc2VUeXBlLCBmID0gXCJhcnJheWJ1ZmZlclwiID09PSBhIHx8IFwiYmxvYlwiID09PSBhIHx8IFwianNvblwiID09PSBhID8gdC5yZXNwb25zZSA6IHQucmVzcG9uc2VUZXh0LCB1ID0gZShmKTsgaWYgKHUgJiYgKHIucnhTaXplID0gdSksIHRoaXMuc2FtZU9yaWdpbikgeyB2YXIgZCA9IHQuZ2V0UmVzcG9uc2VIZWFkZXIoXCJYLU5ld1JlbGljLUFwcC1EYXRhXCIpOyBkICYmIChuLmNhdCA9IGQuc3BsaXQoXCIsIFwiKS5wb3AoKSkgfSB9IGVsc2Ugbi5zdGF0dXMgPSAwOyByLmNiVGltZSA9IHRoaXMuY2JUaW1lLCBvKFwieGhyXCIsIFtuLCByLCB0aGlzLnN0YXJ0VGltZV0pIH0gfSB9IGZ1bmN0aW9uIHIodCwgZSkgeyB2YXIgbiA9IGkoZSksIHIgPSB0LnBhcmFtczsgci5ob3N0ID0gbi5ob3N0bmFtZSArIFwiOlwiICsgbi5wb3J0LCByLnBhdGhuYW1lID0gbi5wYXRobmFtZSwgdC5zYW1lT3JpZ2luID0gbi5zYW1lT3JpZ2luIH0gaWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCAmJiBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUgJiYgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgJiYgIS9DcmlPUy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkgeyB0KFwibG9hZGVyXCIpLmZlYXR1cmVzLnhociA9ICEwOyB2YXIgbyA9IHQoXCJoYW5kbGVcIiksIGkgPSB0KDIpLCBhID0gdChcImVlXCIpLCBzID0gW1wibG9hZFwiLCBcImVycm9yXCIsIFwiYWJvcnRcIiwgXCJ0aW1lb3V0XCJdLCBjID0gcy5sZW5ndGgsIGYgPSB0KDEpOyB0KDQpLCB0KDMpLCBhLm9uKFwibmV3LXhoclwiLCBmdW5jdGlvbiAoKSB7IHRoaXMudG90YWxDYnMgPSAwLCB0aGlzLmNhbGxlZCA9IDAsIHRoaXMuY2JUaW1lID0gMCwgdGhpcy5lbmQgPSBuLCB0aGlzLmVuZGVkID0gITEsIHRoaXMueGhyR3VpZHMgPSB7fSB9KSwgYS5vbihcIm9wZW4teGhyLXN0YXJ0XCIsIGZ1bmN0aW9uICh0KSB7IHRoaXMucGFyYW1zID0geyBtZXRob2Q6IHRbMF0gfSwgcih0aGlzLCB0WzFdKSwgdGhpcy5tZXRyaWNzID0ge30gfSksIGEub24oXCJvcGVuLXhoci1lbmRcIiwgZnVuY3Rpb24gKHQsIGUpIHsgXCJsb2FkZXJfY29uZmlnXCIgaW4gTlJFVU0gJiYgXCJ4cGlkXCIgaW4gTlJFVU0ubG9hZGVyX2NvbmZpZyAmJiB0aGlzLnNhbWVPcmlnaW4gJiYgZS5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1OZXdSZWxpYy1JRFwiLCBOUkVVTS5sb2FkZXJfY29uZmlnLnhwaWQpIH0pLCBhLm9uKFwic2VuZC14aHItc3RhcnRcIiwgZnVuY3Rpb24gKHQsIG4pIHsgdmFyIHIgPSB0aGlzLm1ldHJpY3MsIG8gPSB0WzBdLCBpID0gdGhpczsgaWYgKHIgJiYgbykgeyB2YXIgZiA9IGUobyk7IGYgJiYgKHIudHhTaXplID0gZikgfSB0aGlzLnN0YXJ0VGltZSA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpLCB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKHQpIHsgdHJ5IHsgXCJhYm9ydFwiID09PSB0LnR5cGUgJiYgKGkucGFyYW1zLmFib3J0ZWQgPSAhMCksIChcImxvYWRcIiAhPT0gdC50eXBlIHx8IGkuY2FsbGVkID09PSBpLnRvdGFsQ2JzICYmIChpLm9ubG9hZENhbGxlZCB8fCBcImZ1bmN0aW9uXCIgIT0gdHlwZW9mIG4ub25sb2FkKSkgJiYgaS5lbmQobikgfSBjYXRjaCAoZSkgeyB0cnkgeyBhLmVtaXQoXCJpbnRlcm5hbC1lcnJvclwiLCBbZV0pIH0gY2F0Y2ggKHIpIHsgfSB9IH07IGZvciAodmFyIHUgPSAwOyBjID4gdTsgdSsrKSBuLmFkZEV2ZW50TGlzdGVuZXIoc1t1XSwgdGhpcy5saXN0ZW5lciwgITEpIH0pLCBhLm9uKFwieGhyLWNiLXRpbWVcIiwgZnVuY3Rpb24gKHQsIGUsIG4pIHsgdGhpcy5jYlRpbWUgKz0gdCwgZSA/IHRoaXMub25sb2FkQ2FsbGVkID0gITAgOiB0aGlzLmNhbGxlZCArPSAxLCB0aGlzLmNhbGxlZCAhPT0gdGhpcy50b3RhbENicyB8fCAhdGhpcy5vbmxvYWRDYWxsZWQgJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBuLm9ubG9hZCB8fCB0aGlzLmVuZChuKSB9KSwgYS5vbihcInhoci1sb2FkLWFkZGVkXCIsIGZ1bmN0aW9uICh0LCBlKSB7IHZhciBuID0gXCJcIiArIGYodCkgKyAhIWU7IHRoaXMueGhyR3VpZHMgJiYgIXRoaXMueGhyR3VpZHNbbl0gJiYgKHRoaXMueGhyR3VpZHNbbl0gPSAhMCwgdGhpcy50b3RhbENicyArPSAxKSB9KSwgYS5vbihcInhoci1sb2FkLXJlbW92ZWRcIiwgZnVuY3Rpb24gKHQsIGUpIHsgdmFyIG4gPSBcIlwiICsgZih0KSArICEhZTsgdGhpcy54aHJHdWlkcyAmJiB0aGlzLnhockd1aWRzW25dICYmIChkZWxldGUgdGhpcy54aHJHdWlkc1tuXSwgdGhpcy50b3RhbENicyAtPSAxKSB9KSwgYS5vbihcImFkZEV2ZW50TGlzdGVuZXItZW5kXCIsIGZ1bmN0aW9uICh0LCBlKSB7IGUgaW5zdGFuY2VvZiBYTUxIdHRwUmVxdWVzdCAmJiBcImxvYWRcIiA9PT0gdFswXSAmJiBhLmVtaXQoXCJ4aHItbG9hZC1hZGRlZFwiLCBbdFsxXSwgdFsyXV0sIGUpIH0pLCBhLm9uKFwicmVtb3ZlRXZlbnRMaXN0ZW5lci1lbmRcIiwgZnVuY3Rpb24gKHQsIGUpIHsgZSBpbnN0YW5jZW9mIFhNTEh0dHBSZXF1ZXN0ICYmIFwibG9hZFwiID09PSB0WzBdICYmIGEuZW1pdChcInhoci1sb2FkLXJlbW92ZWRcIiwgW3RbMV0sIHRbMl1dLCBlKSB9KSwgYS5vbihcImZuLXN0YXJ0XCIsIGZ1bmN0aW9uICh0LCBlLCBuKSB7IGUgaW5zdGFuY2VvZiBYTUxIdHRwUmVxdWVzdCAmJiAoXCJvbmxvYWRcIiA9PT0gbiAmJiAodGhpcy5vbmxvYWQgPSAhMCksIChcImxvYWRcIiA9PT0gKHRbMF0gJiYgdFswXS50eXBlKSB8fCB0aGlzLm9ubG9hZCkgJiYgKHRoaXMueGhyQ2JTdGFydCA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpKSkgfSksIGEub24oXCJmbi1lbmRcIiwgZnVuY3Rpb24gKHQsIGUpIHsgdGhpcy54aHJDYlN0YXJ0ICYmIGEuZW1pdChcInhoci1jYi10aW1lXCIsIFsobmV3IERhdGUpLmdldFRpbWUoKSAtIHRoaXMueGhyQ2JTdGFydCwgdGhpcy5vbmxvYWQsIGVdLCBlKSB9KSB9IH0sIHsgMTogXCJYTDdIQklcIiwgMjogMTEsIDM6IDksIDQ6IDUsIGVlOiBcIlFKZjNheFwiLCBoYW5kbGU6IFwiRDVEdUxQXCIsIGxvYWRlcjogXCJHOXowQmxcIiB9XSwgMTE6IFtmdW5jdGlvbiAodCwgZSkgeyBlLmV4cG9ydHMgPSBmdW5jdGlvbiAodCkgeyB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpLCBuID0gd2luZG93LmxvY2F0aW9uLCByID0ge307IGUuaHJlZiA9IHQsIHIucG9ydCA9IGUucG9ydDsgdmFyIG8gPSBlLmhyZWYuc3BsaXQoXCI6Ly9cIik7IHJldHVybiAhci5wb3J0ICYmIG9bMV0gJiYgKHIucG9ydCA9IG9bMV0uc3BsaXQoXCIvXCIpWzBdLnNwbGl0KFwiQFwiKS5wb3AoKS5zcGxpdChcIjpcIilbMV0pLCByLnBvcnQgJiYgXCIwXCIgIT09IHIucG9ydCB8fCAoci5wb3J0ID0gXCJodHRwc1wiID09PSBvWzBdID8gXCI0NDNcIiA6IFwiODBcIiksIHIuaG9zdG5hbWUgPSBlLmhvc3RuYW1lIHx8IG4uaG9zdG5hbWUsIHIucGF0aG5hbWUgPSBlLnBhdGhuYW1lLCByLnByb3RvY29sID0gb1swXSwgXCIvXCIgIT09IHIucGF0aG5hbWUuY2hhckF0KDApICYmIChyLnBhdGhuYW1lID0gXCIvXCIgKyByLnBhdGhuYW1lKSwgci5zYW1lT3JpZ2luID0gIWUuaG9zdG5hbWUgfHwgZS5ob3N0bmFtZSA9PT0gZG9jdW1lbnQuZG9tYWluICYmIGUucG9ydCA9PT0gbi5wb3J0ICYmIGUucHJvdG9jb2wgPT09IG4ucHJvdG9jb2wsIHIgfSB9LCB7fV0sIGdvczogW2Z1bmN0aW9uICh0LCBlKSB7IGUuZXhwb3J0cyA9IHQoXCI3ZVNERmhcIikgfSwge31dLCBcIjdlU0RGaFwiOiBbZnVuY3Rpb24gKHQsIGUpIHsgZnVuY3Rpb24gbih0LCBlLCBuKSB7IGlmIChyLmNhbGwodCwgZSkpIHJldHVybiB0W2VdOyB2YXIgbyA9IG4oKTsgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3Qua2V5cykgdHJ5IHsgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCBlLCB7IHZhbHVlOiBvLCB3cml0YWJsZTogITAsIGVudW1lcmFibGU6ICExIH0pLCBvIH0gY2F0Y2ggKGkpIHsgfSByZXR1cm4gdFtlXSA9IG8sIG8gfSB2YXIgciA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7IGUuZXhwb3J0cyA9IG4gfSwge31dLCBENUR1TFA6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKHQsIGUsIG4pIHsgcmV0dXJuIHIubGlzdGVuZXJzKHQpLmxlbmd0aCA/IHIuZW1pdCh0LCBlLCBuKSA6IChvW3RdIHx8IChvW3RdID0gW10pLCB2b2lkIG9bdF0ucHVzaChlKSkgfSB2YXIgciA9IHQoXCJlZVwiKS5jcmVhdGUoKSwgbyA9IHt9OyBlLmV4cG9ydHMgPSBuLCBuLmVlID0gciwgci5xID0gbyB9LCB7IGVlOiBcIlFKZjNheFwiIH1dLCBoYW5kbGU6IFtmdW5jdGlvbiAodCwgZSkgeyBlLmV4cG9ydHMgPSB0KFwiRDVEdUxQXCIpIH0sIHt9XSwgWEw3SEJJOiBbZnVuY3Rpb24gKHQsIGUpIHsgZnVuY3Rpb24gbih0KSB7IHZhciBlID0gdHlwZW9mIHQ7IHJldHVybiAhdCB8fCBcIm9iamVjdFwiICE9PSBlICYmIFwiZnVuY3Rpb25cIiAhPT0gZSA/IC0xIDogdCA9PT0gd2luZG93ID8gMCA6IGkodCwgbywgZnVuY3Rpb24gKCkgeyByZXR1cm4gcisrIH0pIH0gdmFyIHIgPSAxLCBvID0gXCJuckBpZFwiLCBpID0gdChcImdvc1wiKTsgZS5leHBvcnRzID0gbiB9LCB7IGdvczogXCI3ZVNERmhcIiB9XSwgaWQ6IFtmdW5jdGlvbiAodCwgZSkgeyBlLmV4cG9ydHMgPSB0KFwiWEw3SEJJXCIpIH0sIHt9XSwgbG9hZGVyOiBbZnVuY3Rpb24gKHQsIGUpIHsgZS5leHBvcnRzID0gdChcIkc5ejBCbFwiKSB9LCB7fV0sIEc5ejBCbDogW2Z1bmN0aW9uICh0LCBlKSB7IGZ1bmN0aW9uIG4oKSB7IHZhciB0ID0gbC5pbmZvID0gTlJFVU0uaW5mbzsgaWYgKHQgJiYgdC5saWNlbnNlS2V5ICYmIHQuYXBwbGljYXRpb25JRCAmJiBmICYmIGYuYm9keSkgeyBzKGgsIGZ1bmN0aW9uIChlLCBuKSB7IGUgaW4gdCB8fCAodFtlXSA9IG4pIH0pLCBsLnByb3RvID0gXCJodHRwc1wiID09PSBwLnNwbGl0KFwiOlwiKVswXSB8fCB0LnNzbEZvckh0dHAgPyBcImh0dHBzOi8vXCIgOiBcImh0dHA6Ly9cIiwgYShcIm1hcmtcIiwgW1wib25sb2FkXCIsIGkoKV0pOyB2YXIgZSA9IGYuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTsgZS5zcmMgPSBsLnByb3RvICsgdC5hZ2VudCwgZi5ib2R5LmFwcGVuZENoaWxkKGUpIH0gfSBmdW5jdGlvbiByKCkgeyBcImNvbXBsZXRlXCIgPT09IGYucmVhZHlTdGF0ZSAmJiBvKCkgfSBmdW5jdGlvbiBvKCkgeyBhKFwibWFya1wiLCBbXCJkb21Db250ZW50XCIsIGkoKV0pIH0gZnVuY3Rpb24gaSgpIHsgcmV0dXJuIChuZXcgRGF0ZSkuZ2V0VGltZSgpIH0gdmFyIGEgPSB0KFwiaGFuZGxlXCIpLCBzID0gdCgxKSwgYyA9IHdpbmRvdywgZiA9IGMuZG9jdW1lbnQsIHUgPSBcImFkZEV2ZW50TGlzdGVuZXJcIiwgZCA9IFwiYXR0YWNoRXZlbnRcIiwgcCA9IChcIlwiICsgbG9jYXRpb24pLnNwbGl0KFwiP1wiKVswXSwgaCA9IHsgYmVhY29uOiBcImJhbS5uci1kYXRhLm5ldFwiLCBlcnJvckJlYWNvbjogXCJiYW0ubnItZGF0YS5uZXRcIiwgYWdlbnQ6IFwianMtYWdlbnQubmV3cmVsaWMuY29tL25yLTUxNS5taW4uanNcIiB9LCBsID0gZS5leHBvcnRzID0geyBvZmZzZXQ6IGkoKSwgb3JpZ2luOiBwLCBmZWF0dXJlczoge30gfTsgZlt1XSA/IChmW3VdKFwiRE9NQ29udGVudExvYWRlZFwiLCBvLCAhMSksIGNbdV0oXCJsb2FkXCIsIG4sICExKSkgOiAoZltkXShcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLCByKSwgY1tkXShcIm9ubG9hZFwiLCBuKSksIGEoXCJtYXJrXCIsIFtcImZpcnN0Ynl0ZVwiLCBpKCldKSB9LCB7IDE6IDIwLCBoYW5kbGU6IFwiRDVEdUxQXCIgfV0sIDIwOiBbZnVuY3Rpb24gKHQsIGUpIHsgZnVuY3Rpb24gbih0LCBlKSB7IHZhciBuID0gW10sIG8gPSBcIlwiLCBpID0gMDsgZm9yIChvIGluIHQpIHIuY2FsbCh0LCBvKSAmJiAobltpXSA9IGUobywgdFtvXSksIGkgKz0gMSk7IHJldHVybiBuIH0gdmFyIHIgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5OyBlLmV4cG9ydHMgPSBuIH0sIHt9XSwgMjE6IFtmdW5jdGlvbiAodCwgZSkgeyBmdW5jdGlvbiBuKHQsIGUsIG4pIHsgZSB8fCAoZSA9IDApLCBcInVuZGVmaW5lZFwiID09IHR5cGVvZiBuICYmIChuID0gdCA/IHQubGVuZ3RoIDogMCk7IGZvciAodmFyIHIgPSAtMSwgbyA9IG4gLSBlIHx8IDAsIGkgPSBBcnJheSgwID4gbyA/IDAgOiBvKSA7ICsrciA8IG87KSBpW3JdID0gdFtlICsgcl07IHJldHVybiBpIH0gZS5leHBvcnRzID0gbiB9LCB7fV0sIDIyOiBbZnVuY3Rpb24gKHQsIGUpIHsgZnVuY3Rpb24gbih0KSB7IHJldHVybiAhKHQgJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiB0ICYmIHQuYXBwbHkgJiYgIXRbaV0pIH0gdmFyIHIgPSB0KFwiZWVcIiksIG8gPSB0KDEpLCBpID0gXCJuckB3cmFwcGVyXCIsIGEgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5OyBlLmV4cG9ydHMgPSBmdW5jdGlvbiAodCkgeyBmdW5jdGlvbiBlKHQsIGUsIHIsIGEpIHsgZnVuY3Rpb24gbnJXcmFwcGVyKCkgeyB2YXIgbiwgaSwgcywgZjsgdHJ5IHsgaSA9IHRoaXMsIG4gPSBvKGFyZ3VtZW50cyksIHMgPSByICYmIHIobiwgaSkgfHwge30gfSBjYXRjaCAoZCkgeyB1KFtkLCBcIlwiLCBbbiwgaSwgYV0sIHNdKSB9IGMoZSArIFwic3RhcnRcIiwgW24sIGksIGFdLCBzKTsgdHJ5IHsgcmV0dXJuIGYgPSB0LmFwcGx5KGksIG4pIH0gY2F0Y2ggKHApIHsgdGhyb3cgYyhlICsgXCJlcnJcIiwgW24sIGksIHBdLCBzKSwgcCB9IGZpbmFsbHkgeyBjKGUgKyBcImVuZFwiLCBbbiwgaSwgZl0sIHMpIH0gfSByZXR1cm4gbih0KSA/IHQgOiAoZSB8fCAoZSA9IFwiXCIpLCBucldyYXBwZXJbaV0gPSAhMCwgZih0LCBucldyYXBwZXIpLCBucldyYXBwZXIpIH0gZnVuY3Rpb24gcyh0LCByLCBvLCBpKSB7IG8gfHwgKG8gPSBcIlwiKTsgdmFyIGEsIHMsIGMsIGYgPSBcIi1cIiA9PT0gby5jaGFyQXQoMCk7IGZvciAoYyA9IDA7IGMgPCByLmxlbmd0aDsgYysrKSBzID0gcltjXSwgYSA9IHRbc10sIG4oYSkgfHwgKHRbc10gPSBlKGEsIGYgPyBzICsgbyA6IG8sIGksIHMsIHQpKSB9IGZ1bmN0aW9uIGMoZSwgbiwgcikgeyB0cnkgeyB0LmVtaXQoZSwgbiwgcikgfSBjYXRjaCAobykgeyB1KFtvLCBlLCBuLCByXSkgfSB9IGZ1bmN0aW9uIGYodCwgZSkgeyBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5rZXlzKSB0cnkgeyB2YXIgbiA9IE9iamVjdC5rZXlzKHQpOyByZXR1cm4gbi5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCBuLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdFtuXSB9LCBzZXQ6IGZ1bmN0aW9uIChlKSB7IHJldHVybiB0W25dID0gZSwgZSB9IH0pIH0pLCBlIH0gY2F0Y2ggKHIpIHsgdShbcl0pIH0gZm9yICh2YXIgbyBpbiB0KSBhLmNhbGwodCwgbykgJiYgKGVbb10gPSB0W29dKTsgcmV0dXJuIGUgfSBmdW5jdGlvbiB1KGUpIHsgdHJ5IHsgdC5lbWl0KFwiaW50ZXJuYWwtZXJyb3JcIiwgZSkgfSBjYXRjaCAobikgeyB9IH0gcmV0dXJuIHQgfHwgKHQgPSByKSwgZS5pblBsYWNlID0gcywgZS5mbGFnID0gaSwgZSB9IH0sIHsgMTogMjEsIGVlOiBcIlFKZjNheFwiIH1dIH0sIHt9LCBbXCJHOXowQmxcIiwgMywgMTAsIDRdKTtcbiAgICAgICAgOyBOUkVVTS5pbmZvID0geyBiZWFjb246IFwiYmFtLm5yLWRhdGEubmV0XCIsIGVycm9yQmVhY29uOiBcImJhbS5uci1kYXRhLm5ldFwiLCBsaWNlbnNlS2V5OiBsaWNlbnNlS2V5LCBhcHBsaWNhdGlvbklEOiBhcHBJZCwgc2E6IDEsIGFnZW50OiBcImpzLWFnZW50Lm5ld3JlbGljLmNvbS9uci01MTUubWluLmpzXCIgfVxuICAgICAgICA7XHJcbiAgICB9XHJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3UmVsaWM7XG4iLCLvu79cclxudmFyIHJheUd1biA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBhcGlLZXk7XHJcbiAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICBjb25maWcgPSB7fTtcclxuICAgIH1cclxuICAgIGFwaUtleSA9IGNvbmZpZy5SQVlHVU5fQVBJX0tFWTtcclxuICAgIGlmIChhcGlLZXkgJiYgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICE9PSAnbG9jYWxob3N0Jykge1xyXG4gICAgICAgIGlmIChSYXlndW4gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBSYXlndW4uaW5pdChhcGlLZXksIHtcclxuICAgICAgICAgICAgICAgIGlnbm9yZTNyZFBhcnR5RXJyb3JzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pLmF0dGFjaCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUmF5Z3VuICE9IG51bGwgPyBSYXlndW4uZmlsdGVyU2Vuc2l0aXZlRGF0YShbJ3Bhc3N3b3JkJ10pIDogdm9pZCAwO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByYXlHdW47Iiwi77u/XG52YXIgdXNlclNuYXAgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICB2YXIgYXBpS2V5LCBzLCB4O1xuICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgfVxuICAgIGFwaUtleSA9IGNvbmZpZy5VU0VSX1NOQVBfQVBJX0tFWTtcbiAgICBpZiAoYXBpS2V5ICYmIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSAhPT0gJ2xvY2FsaG9zdCcpIHtcclxuICAgICAgICB3aW5kb3cudXNlcnNuYXBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIG1vZGU6ICdyZXBvcnQnLFxuICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXG4gICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNuYXAuc2V0RW1haWxCb3goRG9jLmFwcC51c2VyLnVzZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XG4gICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgIHMuYXN5bmMgPSB0cnVlO1xuICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XG4gICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICByZXR1cm4geC5hcHBlbmRDaGlsZChzKTtcclxuICAgIH1cclxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1c2VyU25hcDtcblxuXG4iLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJpb3QudGFnKCdwYWdlLWFjdGlvbnMnLCAnPGRpdiBjbGFzcz1cInBhZ2UtYWN0aW9uc1wiPiA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIHJlZC1oYXplIGJ0bi1zbSBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+IDxzcGFuIGNsYXNzPVwiaGlkZGVuLXNtIGhpZGRlbi14c1wiPkFjdGlvbnMmbmJzcDs8L3NwYW4+PGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPiA8L2J1dHRvbj4gPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+IDxsaSBjbGFzcz1cInN0YXJ0IGFjdGl2ZSBcIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aSBjbGFzcz1cImZhIGZhLXBlbmNpbC1zcXVhcmUtb1wiPiBOZXcgTWFwIDwvaT4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS1wcmludFwiPiBFeHBvcnQvUHJpbnQgPC9pPiA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aSBjbGFzcz1cImZhIGZhLXRhZ1wiPiBUYWcgTWFwIDwvaT4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS1jb3B5XCI+PC9pPiBEdXBsaWNhdGUgTWFwIDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtdXNlcnNcIj48L2k+IFNoYXJlIE1hcCA8L2E+IDwvbGk+IDxsaSBjbGFzcz1cImRpdmlkZXJcIj4gPC9saT4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtZ2VhclwiPjwvaT4gU2V0dGluZ3MgPC9hPiA8L2xpPiA8L3VsPiA8L2Rpdj4gPHNwYW4+Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7UGFnZSBUaXRsZSA8L3NwYW4+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcblxufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5yaW90LnRhZygncGFnZS1ib2R5JywgJzxkaXYgY2xhc3M9XCJwYWdlLWhlYWRlci1maXhlZCBwYWdlLXNpZGViYXItY2xvc2VkLWhpZGUtbG9nbyBwYWdlLXNpZGViYXItY2xvc2VkLWhpZGUtbG9nb1wiPiA8cGFnZS1oZWFkZXI+PC9wYWdlLWhlYWRlcj4gPGRpdiBjbGFzcz1cImNsZWFyZml4XCI+IDwvZGl2PiA8cGFnZS1jb250YWluZXI+PC9wYWdlLWNvbnRhaW5lcj4gPHBhZ2UtZm9vdGVyPjwvcGFnZS1mb290ZXI+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJpb3QudGFnKCdwYWdlLWNvbnRhaW5lcicsICdyZXF1aXJlKFxcJy4vcGFnZS1zaWRlYmFyXFwnKTsgcmVxdWlyZShcXCcuL3BhZ2UtY29udGVudFxcJyk7IDxkaXYgY2xhc3M9XCJwYWdlLWNvbnRhaW5lclwiPiA8cGFnZS1zaWRlYmFyPjwvcGFnZS1zaWRlYmFyPiA8cGFnZS1jb250ZW50PjwvcGFnZS1jb250ZW50PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XHJcblxufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5yaW90LnRhZygncGFnZS1jb250ZW50JywgJzxkaXYgY2xhc3M9XCJwYWdlLWNvbnRlbnQtd3JhcHBlclwiPiA8ZGl2IGNsYXNzPVwicGFnZS1jb250ZW50XCI+IDxkaXYgY2xhc3M9XCJwYWdlLWhlYWRcIj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG5cbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xucmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgJzxkaXYgY2xhc3M9XCJwYWdlLWZvb3RlclwiPiA8ZGl2IGNsYXNzPVwicGFnZS1mb290ZXItaW5uZXJcIj4gMjAxNSAmY29weTsgQ2FicmVyYSBSZXNlYXJjaCBMYWIgPC9kaXY+IDxkaXYgY2xhc3M9XCJzY3JvbGwtdG8tdG9wXCI+IDxpIGNsYXNzPVwiaWNvbi1hcnJvdy11cFwiPjwvaT4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcblxufSk7IiwidmFyIHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5yaW90LnRhZygncGFnZS1oZWFkZXInLCAnPGRpdiBpZD1cImhlYWRlci10b3BcIiBjbGFzcz1cInBhZ2UtaGVhZGVyIG5hdmJhciBuYXZiYXItZml4ZWQtdG9wXCI+IDxkaXYgaWQ9XCJoZWFkZXItY29udGVudFwiIGNsYXNzPVwicGFnZS1oZWFkZXItaW5uZXJcIj4gPHBhZ2UtbG9nbz48L3BhZ2UtbG9nbz4gPHBhZ2UtYWN0aW9ucz48L3BhZ2UtYWN0aW9ucz4gPGRpdiBjbGFzcz1cInBhZ2UtdG9wXCI+IDxwYWdlLXNlYXJjaD48L3BhZ2Utc2VhcmNoPiA8cGFnZS10b3BtZW51PjwvcGFnZS10b3BtZW51PiA8L2Rpdj4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJpb3QudGFnKCdwYWdlLWxvZ28nLCAnPGRpdiBjbGFzcz1cInBhZ2UtbG9nb1wiPiA8YSBocmVmPVwiaW5kZXguaHRtbFwiPiA8aW1nIHNyYz1cImFzc2V0cy9pbWcvbWV0YW1hcF9jbG91ZC5wbmdcIiBhbHQ9XCJsb2dvXCIgY2xhc3M9XCJsb2dvLWRlZmF1bHRcIj4gPC9hPiA8ZGl2IGNsYXNzPVwibWVudS10b2dnbGVyIHNpZGViYXItdG9nZ2xlclwiPiAgPC9kaXY+IDwvZGl2PiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJtZW51LXRvZ2dsZXIgcmVzcG9uc2l2ZS10b2dnbGVyXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1jb2xsYXBzZVwiPiA8L2E+JywgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJpb3QudGFnKCdwYWdlLXNlYXJjaCcsICcgPGZvcm0gY2xhc3M9XCJzZWFyY2gtZm9ybVwiIGFjdGlvbj1cImV4dHJhX3NlYXJjaC5odG1sXCIgbWV0aG9kPVwiR0VUXCI+IDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoLi4uXCIgbmFtZT1cInF1ZXJ5XCI+IDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0biBzdWJtaXRcIj48aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiPjwvaT48L2E+IDwvc3Bhbj4gPC9kaXY+IDwvZm9ybT4nLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG5cbn0pOyIsInZhciByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xucmlvdC50YWcoJ3BhZ2Utc2lkZWJhcicsICc8ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyLXdyYXBwZXJcIj4gICA8ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyIG5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPiAgICAgICAgPHVsIGNsYXNzPVwicGFnZS1zaWRlYmFyLW1lbnUgXCIgZGF0YS1rZWVwLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWF1dG8tc2Nyb2xsPVwidHJ1ZVwiIGRhdGEtc2xpZGUtc3BlZWQ9XCIyMDBcIj4gPGxpIGVhY2g9XCJ7IGRhdGEgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbmNlIH1cIj4gPGEgaWY9XCJ7IGljb24gfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJ7IGljb24gfVwiIHJpb3Qtc3R5bGU9XCJjb2xvcjojeyBjb2xvciB9O1wiPjwvaT4gPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJ7IGFycm93OiBtZW51Lmxlbmd0aCB9XCI+PC9zcGFuPiA8L2E+IDx1bCBpZj1cInsgbWVudS5sZW5ndGggfVwiIGNsYXNzPVwic3ViLW1lbnVcIj4gPGxpIGVhY2g9XCJ7IG1lbnUgfVwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9kaXY+IDwvZGl2PicsIGZ1bmN0aW9uKG9wdHMpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgICAgICB0aGlzLk1ldGFNYXAgPSByZXF1aXJlKCdNZXRhTWFwJyk7XHJcbiAgICAgICAgdGhpcy5NZXRhTWFwLk1ldGFGaXJlLmdldERhdGEoJ21lbnUvc2lkZWJhcicpLnRoZW4oIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSApXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXHJcclxyXG5cclxuICAgICAgICB0aGlzLm9uY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF8ub25jZSh3aW5kb3cuTGF5b3V0LmluaXQpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxyXG4gICAgXG59KTsiLCJ2YXIgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbnJpb3QudGFnKCdwYWdlLXRvcG1lbnUnLCAnPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+IDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IHB1bGwtcmlnaHRcIj4gPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj4gPC9saT4gIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX25vdGlmaWNhdGlvbl9iYXJcIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPiA8aSBjbGFzcz1cImZhIGZhLWJlbGwtb1wiPjwvaT4gPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1zdWNjZXNzXCI+IDEgPC9zcGFuPiA8L2E+IDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4gPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj4gPGgzPjxzcGFuIGNsYXNzPVwiYm9sZFwiPjEgcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9uPC9oMz4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPnZpZXcgYWxsPC9hPiA8L2xpPiA8bGk+IDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNTBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxzcGFuIGNsYXNzPVwidGltZVwiPmp1c3Qgbm93PC9zcGFuPiA8c3BhbiBjbGFzcz1cImRldGFpbHNcIj4gPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC1pY29uIGxhYmVsLXN1Y2Nlc3NcIj4gPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPiA8L3NwYW4+IE5ldyB1c2VyIHJlZ2lzdGVyZWQuIDwvc3Bhbj4gPC9hPiA8L2xpPiA8L3VsPiA8L2xpPiA8L3VsPiA8L2xpPiA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPiA8L2xpPiAgPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfcG9pbnRzX2JhclwiPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+IDxpIGNsYXNzPVwiZmEgZmEtdHJvcGh5XCI+PC9pPiA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj4gMyA8L3NwYW4+IDwvYT4gPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPiA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPiA8aDM+PHNwYW4gY2xhc3M9XCJib2xkXCI+MyBuZXc8L3NwYW4+IGFjaGlldmVtZW50czwvaDM+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT4gPC9saT4gPGxpPiA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+IDxsaT4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8c3BhbiBjbGFzcz1cInRpbWVcIj5qdXN0IG5vdzwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJkZXRhaWxzXCI+IDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+IDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9zcGFuPiBDcmVhdGVkIGEgcGVyc3BlY3RpdmUgY2lyY2xlISA8L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9saT4gIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+ICA8bGkgY2xhc3M9XCJkcm9wZG93blwiIGlkPVwiaGVhZGVyX2Rhc2hib2FyZF9iYXJcIj4gPGEgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtaG9tZVwiPjwvaT4gPC9hPiA8L2xpPiA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPiA8L2xpPiAgPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfaGVscF9iYXJcIj4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPiA8aSBjbGFzcz1cImZhIGZhLWdyYWR1YXRpb24tY2FwXCI+PC9pPiA8L2E+IDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4gPGxpPiA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjcwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+IDxsaT4gPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPiA8aSBjbGFzcz1cImZhIGZhLWxpZ2h0YnVsYi1vXCI+PC9pPiA8c3BhbiBjbGFzcz1cInRpdGxlXCI+VHV0b3JpYWw8L3NwYW4+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtcXVlc3Rpb25cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj5GQVE8L3NwYW4+IDwvYT4gPC9saT4gPGxpPiA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+IDxpIGNsYXNzPVwiZmEgZmEtbGlmZS1yaW5nXCI+PC9pPiA8c3BhbiBjbGFzcz1cInRpdGxlXCI+U3VwcG9ydDwvc3Bhbj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBvbmNsaWNrPVwiVXNlclNuYXAub3BlblJlcG9ydFdpbmRvdygpO1wiPiA8aSBjbGFzcz1cImZhIGZhLWZyb3duLW9cIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj5GZWVkYmFjazwvc3Bhbj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS1idWxsc2V5ZVwiPjwvaT4gPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPklubGluZSBUcmFpbmluZzwvc3Bhbj4gPC9hPiA8L2xpPiA8bGk+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj4gPGkgY2xhc3M9XCJmYSBmYS1sYXB0b3BcIj48L2k+IDxzcGFuIGNsYXNzPVwidGl0bGVcIj5PbmxpbmUgVHJhaW5pbmc8L3NwYW4+IDwvYT4gPC9saT4gPC91bD4gPC9saT4gPC91bD4gPC9saT4gPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj4gPC9saT4gICA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi11c2VyIGRyb3Bkb3duXCI+IDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj4gPHNwYW4gY2xhc3M9XCJ1c2VybmFtZSB1c2VybmFtZS1oaWRlLW9uLW1vYmlsZVwiPiBOaWNrIDwvc3Bhbj4gIDxpbWcgYWx0PVwiXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiYXNzZXRzL2FkbWluL2xheW91dDQvaW1nL2F2YXRhcjkuanBnXCI+IDwvYT4gPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBkcm9wZG93bi1tZW51LWRlZmF1bHRcIj4gPGxpPiA8YSBocmVmPVwiZXh0cmFfcHJvZmlsZS5odG1sXCI+IDxpIGNsYXNzPVwiZmEgZmEtdXNlclwiPjwvaT4gTXkgUHJvZmlsZSA8L2E+IDwvbGk+IDxsaT4gPGEgaHJlZj1cImxvZ2luLmh0bWxcIj4gPGkgY2xhc3M9XCJmYSBmYS1zaWduLW91dFwiPjwvaT4gTG9nIE91dCA8L2E+IDwvbGk+IDwvdWw+IDwvbGk+ICA8L3VsPiA8L2Rpdj4nLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG5cbn0pOyJdfQ==
