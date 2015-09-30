(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MetaMap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('babel/polyfill');
require('core-js');
window.$ = window.jQuery = require('jquery');
require('jquery-ui');
require('bootstrap');
window.riot = require('riot');
window._ = require('lodash');
window.Promise = require('bluebird');

var Auth0 = require('./js/app/auth0');
var User = require('./js/app/user.js');
var Router = require('./js/app/Router.js');
var Eventer = require('./js/app/Eventer.js');
var PageFactory = require('./js/pages/PageFactory.js');
var NProgress = window.NProgress;
var Config = require('./js/app//Config.js');
var ga = require('./js/integrations/google.js');
var shims = require('./js/tools/shims.js');
var AirbrakeClient = require('airbrake-js');
var Integrations = require('./js/app/Integrations');

var MetaMap = (function () {
    function MetaMap() {
        _classCallCheck(this, MetaMap);

        this.Config = new Config();
        this.config = this.Config.config;
        this.MetaFire = this.Config.MetaFire;
        this.Eventer = new Eventer(this);
        this.airbrake = new AirbrakeClient({ projectId: 114900, projectKey: 'dc9611db6f77120ccecd1a273745a5ae' });
        this.onReady();
        var that = this;
        Promise.onPossiblyUnhandledRejection(function (error) {
            that.error(error);
            return this;
        });
    }

    _createClass(MetaMap, [{
        key: 'onReady',
        value: function onReady() {
            var _this = this;

            if (!this._onReady) {
                this._onReady = new Promise(function (fulfill, reject) {
                    _this.Config.onReady().then(function (config) {
                        _this.Auth0 = new Auth0(config.auth0);
                        fulfill();
                    })['catch'](function (err) {
                        reject(err);
                    });
                });
            }
            return this._onReady;
        }
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            this.onReady().then(function () {
                _this2.Auth0.login().then(function (profile) {
                    _this2.MetaFire.login().then(function (auth) {
                        _this2.User = new User(profile, auth, _this2.Eventer, _this2.MetaFire);
                        _this2.Integrations = new Integrations(_this2, _this2.User);
                        _this2.User.onReady().then(function (user) {
                            _this2.PageFactory = new PageFactory(_this2.Eventer, _this2.MetaFire);
                            _this2.Router = new Router(_this2);
                            _this2.Router.init();
                            _this2.Integrations.init();
                        });
                    });
                });
            });
        }
    }, {
        key: 'log',
        value: function log(val) {
            if (!this.debug) {
                this.Integrations.sendEvent(val, 'event', 'log', 'label');
            }
            window.console.info(val);
        }
    }, {
        key: 'error',
        value: function error(val) {
            window.console.error(val);
            if (!this.debug) {
                this.Integrations.sendEvent(val, 'exception');
                this.airbrake.notify(val);
            }
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.MetaFire.logout();
            this.Auth0.logout();
        }
    }, {
        key: 'debug',
        get: function get() {
            return window.location.host.startsWith('localhost');
        }
    }]);

    return MetaMap;
})();

var mm = new MetaMap();
module.exports = mm;

},{"./js/app//Config.js":13,"./js/app/Eventer.js":14,"./js/app/Integrations":16,"./js/app/Router.js":17,"./js/app/auth0":18,"./js/app/user.js":19,"./js/integrations/google.js":42,"./js/pages/PageFactory.js":43,"./js/tools/shims.js":66,"airbrake-js":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"jquery":undefined,"jquery-ui":undefined,"lodash":undefined,"riot":"riot"}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');

var Action = (function (_ActionBase) {
    _inherits(Action, _ActionBase);

    function Action() {
        _classCallCheck(this, Action);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Action.prototype), 'constructor', this).apply(this, params);
        this._actions = {};
    }

    _createClass(Action, [{
        key: '_getAction',
        value: function _getAction(action) {
            var ret = this._actions[action];
            if (!ret) {
                var Method = null;
                switch (action) {
                    case CONSTANTS.ACTIONS.MAP:
                        Method = require('./OpenMap.js');
                        break;
                    case CONSTANTS.ACTIONS.NEW_MAP:
                        Method = require('./NewMap.js');
                        break;
                    case CONSTANTS.ACTIONS.COPY_MAP:
                        Method = require('./CopyMap.js');
                        break;
                    case CONSTANTS.ACTIONS.DELETE_MAP:
                        Method = require('./DeleteMap.js');
                        break;
                    case CONSTANTS.ACTIONS.MY_MAPS:
                        Method = require('./MyMaps.js');
                        break;
                    case CONSTANTS.ACTIONS.LOGOUT:
                        Method = require('./Logout.js');
                        break;
                    case CONSTANTS.ACTIONS.TERMS_AND_CONDITIONS:
                        Method = require('./Terms.js');
                        break;
                        break;
                    case CONSTANTS.ACTIONS.FEEDBACK:
                        Method = require('./Feedback');
                        break;
                    default:
                        Method = require('./Home.js');
                        break;
                }
                if (Method) {
                    ret = new Method(this.metaFire, this.eventer, this.pageFactory);
                    this._actions[action] = ret;
                }
            }
            return ret;
        }
    }, {
        key: 'act',
        value: function act(action) {
            _get(Object.getPrototypeOf(Action.prototype), 'act', this).call(this);
            var method = this._getAction(action);
            if (method) {
                for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    params[_key2 - 1] = arguments[_key2];
                }

                return method.act.apply(method, params);
            }
        }
    }]);

    return Action;
})(ActionBase);

module.exports = Action;

},{"../constants/constants":24,"./ActionBase.js":3,"./CopyMap.js":4,"./DeleteMap.js":5,"./Feedback":6,"./Home.js":7,"./Logout.js":8,"./MyMaps.js":9,"./NewMap.js":10,"./OpenMap.js":11,"./Terms.js":12}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CONSTANTS = require('../constants/constants');

var ActionBase = (function () {
    function ActionBase(metaFire, eventer, pageFactory) {
        _classCallCheck(this, ActionBase);

        this.metaFire = metaFire;
        this.eventer = eventer;
        this.pageFactory = pageFactory;
        this.metaMap = require('../../MetaMap.js');
    }

    _createClass(ActionBase, [{
        key: 'act',
        value: function act() {}
    }, {
        key: 'toggleSidebar',
        value: function toggleSidebar() {
            if (this.sidebarOpen) {
                this.openSidebar();
            } else {
                this.closeSidebar();
            }
        }
    }, {
        key: 'openSidebar',
        value: function openSidebar() {
            this.sidebarOpen = true;
            this.eventer['do'](CONSTANTS.EVENTS.SIDEBAR_OPEN);
        }
    }, {
        key: 'closeSidebar',
        value: function closeSidebar() {
            this.sidebarOpen = false;
            this.eventer['do'](CONSTANTS.EVENTS.SIDEBAR_CLOSE);
        }
    }]);

    return ActionBase;
})();

module.exports = ActionBase;

},{"../../MetaMap.js":1,"../constants/constants":24}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');

var CopyMap = (function (_ActionBase) {
    _inherits(CopyMap, _ActionBase);

    function CopyMap() {
        _classCallCheck(this, CopyMap);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(CopyMap.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(CopyMap, [{
        key: 'act',
        value: function act(id) {
            var _get2,
                _this = this;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(CopyMap.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            if (!id) {
                return new Error('Must have a map in order to copy.');
            }
            this.metaFire.getData('' + CONSTANTS.ROUTES.MAPS_LIST + id).then(function (oldMap) {
                var newMap = {
                    created_at: new Date(),
                    owner: _this.metaMap.User.userId,
                    name: _this.appendCopy(oldMap.name)
                };
                _this.metaFire.getData('' + CONSTANTS.ROUTES.MAPS_DATA + id).then(function (oldMapData) {
                    var pushState = _this.metaFire.pushData(newMap, '' + CONSTANTS.ROUTES.MAPS_LIST);
                    var mapId = pushState.key();
                    _this.metaFire.setData(oldMapData, '' + CONSTANTS.ROUTES.MAPS_DATA + mapId);
                    _this.metaMap.Router.to('map/' + mapId);
                });
            });
            return true;
        }
    }, {
        key: 'appendCopy',
        value: function appendCopy(str) {
            var ret = str;
            if (!_.contains(str, '(Copy')) {
                ret = ret + ' (Copy 1)';
            } else {
                var mess = str.split(' ');
                var cnt = 2;
                if (mess[mess.length - 2] == '(Copy') {
                    var grbg = mess[mess.length - 1];
                    if (grbg) {
                        grbg = grbg.replace(')', '');
                        cnt = +grbg + 1;
                        ret = mess.slice(0, mess.length - 2).join(' ');
                    }
                }
                ret += ' (Copy ' + cnt + ')';
            }
            return ret;
        }
    }]);

    return CopyMap;
})(ActionBase);

module.exports = CopyMap;

},{"../constants/constants":24,"./ActionBase.js":3}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');
var _ = require('lodash');

var DeleteMap = (function (_ActionBase) {
    _inherits(DeleteMap, _ActionBase);

    function DeleteMap() {
        _classCallCheck(this, DeleteMap);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(DeleteMap.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(DeleteMap, [{
        key: 'act',
        value: function act(id) {
            var _get2;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(DeleteMap.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            DeleteMap.deleteAll([id]);
            return true;
        }
    }], [{
        key: 'deleteAll',
        value: function deleteAll(ids) {
            var path = arguments.length <= 1 || arguments[1] === undefined ? CONSTANTS.PAGES.HOME : arguments[1];

            var metaMap = require('../../MetaMap.js');
            try {
                _.each(ids, function (id) {
                    metaMap.MetaFire.deleteData('' + CONSTANTS.ROUTES.MAPS_DATA + id);
                    metaMap.MetaFire.deleteData('' + CONSTANTS.ROUTES.MAPS_LIST + id);
                });
            } catch (e) {} finally {
                metaMap.Router.to(path);
            }
        }
    }]);

    return DeleteMap;
})(ActionBase);

module.exports = DeleteMap;

},{"../../MetaMap.js":1,"../constants/constants":24,"./ActionBase.js":3,"lodash":undefined}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionBase = require('./ActionBase.js');

var Feedback = (function (_ActionBase) {
    _inherits(Feedback, _ActionBase);

    function Feedback() {
        _classCallCheck(this, Feedback);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Feedback.prototype), 'constructor', this).apply(this, params);
        this.userSnap = window.UserSnap;
    }

    _createClass(Feedback, [{
        key: 'act',
        value: function act() {
            _get(Object.getPrototypeOf(Feedback.prototype), 'act', this).call(this);
            this.userSnap.openReportWindow();
            return true;
        }
    }]);

    return Feedback;
})(ActionBase);

module.exports = Feedback;

},{"./ActionBase.js":3}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var riot = require('riot');
var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');
var home = require('../tags/pages/home');

var Home = (function (_ActionBase) {
    _inherits(Home, _ActionBase);

    function Home() {
        _classCallCheck(this, Home);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Home.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(Home, [{
        key: 'act',
        value: function act(id) {
            var _get2, _eventer;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(Home.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            $('#' + CONSTANTS.ELEMENTS.APP_CONTAINER).empty();
            riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.HOME);
            (_eventer = this.eventer)['do'].apply(_eventer, [CONSTANTS.EVENTS.PAGE_NAME, { name: 'Home' }].concat(params));
            this.closeSidebar();
            return true;
        }
    }]);

    return Home;
})(ActionBase);

module.exports = Home;

},{"../constants/constants":24,"../tags/pages/home":62,"./ActionBase.js":3,"riot":"riot"}],8:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');
var _ = require('lodash');

var Logout = (function (_ActionBase) {
    _inherits(Logout, _ActionBase);

    function Logout() {
        _classCallCheck(this, Logout);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Logout.prototype), 'constructor', this).apply(this, params);
        this.metaMap = require('../../MetaMap.js');
    }

    _createClass(Logout, [{
        key: 'act',
        value: function act(id) {
            var _get2;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(Logout.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            this.metaMap.logout();
            return true;
        }
    }]);

    return Logout;
})(ActionBase);

module.exports = Logout;

},{"../../MetaMap.js":1,"../constants/constants":24,"./ActionBase.js":3,"lodash":undefined}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var riot = require('riot');
var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');
var home = require('../tags/pages/my-maps');

var MyMaps = (function (_ActionBase) {
    _inherits(MyMaps, _ActionBase);

    function MyMaps() {
        _classCallCheck(this, MyMaps);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(MyMaps.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(MyMaps, [{
        key: 'act',
        value: function act(id) {
            var _get2, _eventer, _eventer2;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(MyMaps.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            $('#' + CONSTANTS.ELEMENTS.APP_CONTAINER).empty();
            riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.MY_MAPS);
            (_eventer = this.eventer)['do'].apply(_eventer, [CONSTANTS.PAGES.MY_MAPS, { id: id }].concat(params));
            (_eventer2 = this.eventer)['do'].apply(_eventer2, [CONSTANTS.EVENTS.PAGE_NAME, { name: 'My Maps' }].concat(params));
            this.closeSidebar();

            return true;
        }
    }]);

    return MyMaps;
})(ActionBase);

module.exports = MyMaps;

},{"../constants/constants":24,"../tags/pages/my-maps":63,"./ActionBase.js":3,"riot":"riot"}],10:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');

var NewMap = (function (_ActionBase) {
    _inherits(NewMap, _ActionBase);

    function NewMap() {
        _classCallCheck(this, NewMap);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(NewMap.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(NewMap, [{
        key: 'act',
        value: function act() {
            var _this = this;

            _get(Object.getPrototypeOf(NewMap.prototype), 'act', this).call(this);
            this.metaFire.getData('' + CONSTANTS.ROUTES.MAPS_NEW_MAP).then(function (blankMap) {
                var newMap = {
                    created_at: new Date(),
                    owner: _this.metaMap.User.userId,
                    name: 'Untitled Map'
                };
                var pushState = _this.metaFire.pushData(newMap, '' + CONSTANTS.ROUTES.MAPS_LIST);
                var mapId = pushState.key();
                _this.metaFire.setData(newMap, '' + CONSTANTS.ROUTES.MAPS_DATA + mapId);
                _this.metaMap.Router.to('map/' + mapId);
            });
            return true;
        }
    }]);

    return NewMap;
})(ActionBase);

module.exports = NewMap;

},{"../constants/constants":24,"./ActionBase.js":3}],11:[function(require,module,exports){
/// <reference path="../../../../typings/riotjs/riotjs.d.ts" />

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var riot = require('riot');
var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');
var metaCanvas = require('../tags/canvas/meta-canvas.js');

var OpenMap = (function (_ActionBase) {
    _inherits(OpenMap, _ActionBase);

    function OpenMap() {
        _classCallCheck(this, OpenMap);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(OpenMap.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(OpenMap, [{
        key: 'act',
        value: function act(id) {
            var _get2,
                _this = this;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(OpenMap.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            $('#' + CONSTANTS.ELEMENTS.APP_CONTAINER).empty();
            this.metaFire.getData('' + CONSTANTS.ROUTES.MAPS_LIST + id).then(function (map) {
                if (map) {
                    var _eventer, _eventer2, _eventer3;

                    riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.META_CANVAS);
                    map.id = id;
                    (_eventer = _this.eventer)['do'].apply(_eventer, [CONSTANTS.EVENTS.NAV, 'map', map].concat(params));
                    (_eventer2 = _this.eventer)['do'].apply(_eventer2, [CONSTANTS.EVENTS.PAGE_NAME, map].concat(params));
                    (_eventer3 = _this.eventer)['do'].apply(_eventer3, [CONSTANTS.EVENTS.MAP, map].concat(params));
                    _this.openSidebar();
                }
            });
            return true;
        }
    }]);

    return OpenMap;
})(ActionBase);

module.exports = OpenMap;

},{"../constants/constants":24,"../tags/canvas/meta-canvas.js":44,"./ActionBase.js":3,"riot":"riot"}],12:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var riot = require('riot');
var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');
var terms = require('../tags/pages/terms');

var Terms = (function (_ActionBase) {
    _inherits(Terms, _ActionBase);

    function Terms() {
        _classCallCheck(this, Terms);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Terms.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(Terms, [{
        key: 'act',
        value: function act(id) {
            var _get2, _eventer;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(Terms.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            $('#' + CONSTANTS.ELEMENTS.APP_CONTAINER).empty();
            riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.TERMS);
            (_eventer = this.eventer)['do'].apply(_eventer, [CONSTANTS.EVENTS.PAGE_NAME, { name: 'Terms and Conditions' }].concat(params));
            this.closeSidebar();
            return true;
        }
    }]);

    return Terms;
})(ActionBase);

module.exports = Terms;

},{"../constants/constants":24,"../tags/pages/terms":64,"./ActionBase.js":3,"riot":"riot"}],13:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./Firebase');
var _ = require('lodash');

var config = function config() {
    var SITES = {
        CRL_STAGING: {
            db: 'meta-map-staging'
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
    first = first.split(':')[0];

    switch (first.toLowerCase()) {

        case 'localhost':
        case 'meta-map-staging':
        default:
            ret.site = SITES.CRL_STAGING;
            break;
    }

    return ret;
};

var Config = (function () {
    function Config(tags) {
        _classCallCheck(this, Config);

        this.tags = tags;
        this.config = config();
        this.MetaFire = new MetaFire(this.config);
    }

    _createClass(Config, [{
        key: 'onReady',
        value: function onReady() {
            var _this = this;

            if (!this._onReady) {
                this._onReady = new Promise(function (fulfill, reject) {
                    _this.MetaFire.on('config', function (data) {
                        _this.MetaFire.on('metamap/canvas', function (canvas) {
                            try {
                                _.extend(_this.config.site, data);
                                _this.config.canvas = canvas;
                                document.title = _this.config.site.title;
                                var favico = document.getElementById('favico');
                                favico.setAttribute('href', _this.config.site.imageUrl + 'favicon.ico');
                                _this.init();
                                fulfill(_this.config.site);
                            } catch (e) {
                                reject(e);
                            }
                        });
                    });
                });
            }

            return this._onReady;
        }
    }, {
        key: 'init',
        value: function init() {
            return this.onReady();
        }
    }, {
        key: 'site',
        get: function get() {
            return 'frontend';
        }
    }]);

    return Config;
})();

module.exports = Config;

},{"./Firebase":15,"lodash":undefined}],14:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var riot = require('riot');
var _ = require('lodash');

var Eventer = (function () {
    function Eventer(metaMap) {
        _classCallCheck(this, Eventer);

        riot.observable(this);

        this.events = {};
    }

    _createClass(Eventer, [{
        key: 'every',
        value: function every(event, reaction) {
            var _this = this;

            //let callback = reaction;
            //if (this.events[event]) {
            //    let piggyback = this.events[event];
            //    callback = (...params) => {
            //        piggyback(...params);
            //        reaction(...params);
            //    }
            //}
            var events = event.split(' ');
            _.each(events, function () {
                _this.events[event] = reaction;
                _this.on(event, reaction);
            });
        }
    }, {
        key: 'forget',
        value: function forget(event, callback) {
            var _this2 = this;

            var events = event.split(' ');
            _.each(events, function () {
                if (!callback) {
                    delete _this2.events[event];
                    _this2.off(event);
                } else {
                    _this2.off(event, callback);
                }
            });
        }
    }, {
        key: 'do',
        value: function _do(event) {
            var _this3 = this;

            for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                params[_key - 1] = arguments[_key];
            }

            var events = event.split(' ');
            _.each(events, function () {
                _this3.trigger.apply(_this3, [event].concat(params));
            });
        }
    }]);

    return Eventer;
})();

module.exports = Eventer;

},{"lodash":undefined,"riot":"riot"}],15:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Firebase = window.Firebase;
var Promise = require('bluebird');
var localforage = require('localforage');

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

            if (!this._login) {
                this._login = new Promise(function (fulfill, reject) {
                    window.MetaMap.Auth0.getSession().then(function (profile) {

                        window.MetaMap.Auth0.lock.getClient().getDelegationToken({
                            target: _this.config.site.auth0.api,
                            id_token: profile.id_token,
                            api_type: 'firebase'
                        }, function (err, delegationResult) {
                            if (err) {
                                reject(err);
                            } else {
                                profile.firebase_token = delegationResult.id_token;
                                _this.firebase_token = delegationResult.id_token;
                                localforage.setItem('firebase_token', _this.firebase_token);
                                _this.fb.authWithCustomToken(_this.firebase_token, function (error, authData) {
                                    if (error) {
                                        _this.metaMap.error(error);
                                        reject(error);
                                    } else {
                                        fulfill(authData);
                                    }
                                });
                            }
                        });
                    })['catch'](function (err) {
                        console.log(err);
                        debugger;
                    });
                });
                this._onReady = this._login;
            }
            return this._login;
        }
    }, {
        key: 'onReady',
        value: function onReady() {
            if (!this._onReady) {
                this._onReady = new Promise(function (fulfill, reject) {
                    fulfill();
                });
            }
            return this._onReady;
        }
    }, {
        key: 'getChild',
        value: function getChild(path) {
            return this.fb.child(path);
        }
    }, {
        key: 'getData',
        value: function getData(path) {
            var _this2 = this;

            return this.onReady().then(function () {
                var child = _this2.fb;
                if (path) {
                    child = _this2.getChild(path);
                }
                return new Promise(function (resolve, reject) {

                    child.once('value', function (snapshot) {
                        var data = snapshot.val();
                        try {
                            resolve(data);
                        } catch (e) {
                            _this2.metaMap.error(e);
                        }
                    }, function (error) {
                        _this2.error(e, path);
                        reject(error);
                    });
                });
            });
        }
    }, {
        key: 'on',
        value: function on(path, callback) {
            var _this3 = this;

            var event = arguments.length <= 2 || arguments[2] === undefined ? 'value' : arguments[2];

            if (path) {
                this.onReady().then(function () {
                    var child = _this3.getChild(path);
                    var method = function method(snapshot) {
                        try {
                            if (!snapshot.exists()) {
                                child.off(event, method);
                                throw new Error('There is no data at ' + path);
                            }
                            var data = snapshot.val();
                            callback(data);
                        } catch (e) {
                            child.off(event, method);
                            _this3.error(e, path);
                        }
                    };
                    child.on(event, method);
                });
            }
        }
    }, {
        key: 'off',
        value: function off(path, method, callback) {
            var _this4 = this;

            if (method === undefined) method = 'value';

            if (path) {
                this.onReady().then(function () {
                    var child = _this4.getChild(path);
                    if (callback) {
                        child.off(method, callback);
                    } else {
                        child.off(method);
                    }
                });
            }
        }
    }, {
        key: 'setData',
        value: function setData(data, path) {
            var _this5 = this;

            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            try {
                return child.set(data, function (e) {
                    if (e) {
                        _this5.error(e, path);
                    }
                });
            } catch (e) {
                this.error(e, path);
            }
        }
    }, {
        key: 'deleteData',
        value: function deleteData(path) {
            return this.setData(null, path);
        }
    }, {
        key: 'pushData',
        value: function pushData(data, path) {
            var _this6 = this;

            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            try {
                return child.push(data, function (e) {
                    if (e) {
                        _this6.error(e, path);
                    }
                });
            } catch (e) {
                this.error(e, path);
            }
        }
    }, {
        key: 'setDataInTransaction',
        value: function setDataInTransaction(data, path, callback) {
            var _this7 = this;

            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            try {
                return child.transaction(function (currentValue) {
                    try {
                        return data;
                    } catch (e) {
                        _this7.error(e, path);
                    }
                });
            } catch (e) {
                this.error(e, path);
            }
        }
    }, {
        key: 'error',
        value: function error(e, path) {
            if (e) {
                this.metaMap.error(e);
            }
            if (path) {
                this.metaMap.error({ message: 'Permission denied to ' + path });
            }
        }
    }, {
        key: 'logout',
        value: function logout() {
            this._login = null;
            this._onReady = null;
            localforage.removeItem('firebase_token');
            this.fb.unauth();
        }
    }, {
        key: 'metaMap',
        get: function get() {
            if (!this._metaMap) {
                this._metaMap = require('../../MetaMap.js');
            }
            return this._metaMap;
        }
    }]);

    return MetaFire;
})();

module.exports = MetaFire;

},{"../../MetaMap.js":1,"bluebird":undefined,"localforage":undefined}],16:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');

var Twiiter = require('../integrations/Twitter');
var Facebook = require('../integrations/Facebook');

var Integrations = (function () {
	function Integrations(metaMap, user) {
		_classCallCheck(this, Integrations);

		this.config = metaMap.config;
		this.metaMap = metaMap;
		this.user = user;
		this._features = {
			google: require('../integrations/Google'),
			usersnap: require('../integrations/UserSnap'),
			intercom: require('../integrations/Intercom'),
			zendesk: require('../integrations/Zendesk'),
			addthis: require('../integrations/AddThis'),
			newrelic: require('../integrations/NewRelic')
		};
	}

	_createClass(Integrations, [{
		key: 'init',
		value: function init() {
			var _this = this;

			_.each(this._features, function (Feature, name) {
				if (Feature) {
					try {
						var config = _this.config.site[name];
						_this[name] = new Feature(config, _this.user);
						_this[name].init();
						_this[name].setUser();
					} catch (e) {
						_this.metaMap.error(e);
					}
				}
			});
		}
	}, {
		key: 'setUser',
		value: function setUser() {
			var _this2 = this;

			_.each(this._features, function (Feature, name) {
				if (name) {
					try {
						_this2[name].setUser();
					} catch (e) {
						console.error(e);
					}
				}
			});
		}
	}, {
		key: 'sendEvent',
		value: function sendEvent(val) {
			var _this3 = this;

			for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				params[_key - 1] = arguments[_key];
			}

			if (!this.metaMap.debug) {
				_.each(this._features, function (Feature, name) {
					if (name) {
						try {
							var _name;

							(_name = _this3[name]).sendEvent.apply(_name, [val].concat(params));
						} catch (e) {
							console.log(e);
						}
					}
				});
			}
		}
	}, {
		key: 'updatePath',
		value: function updatePath() {}
	}, {
		key: 'logout',
		value: function logout() {
			var _this4 = this;

			_.each(this._features, function (Feature, name) {
				if (name) {
					try {
						_this4[name].logout();
					} catch (e) {
						_this4.metaMap.error(e);
					}
				}
			});
		}
	}]);

	return Integrations;
})();

module.exports = Integrations;

},{"../integrations/AddThis":33,"../integrations/Facebook":34,"../integrations/Google":35,"../integrations/Intercom":36,"../integrations/NewRelic":37,"../integrations/Twitter":38,"../integrations/UserSnap":39,"../integrations/Zendesk":40,"lodash":undefined}],17:[function(require,module,exports){
/// <reference path="../../../../typings/riotjs/riotjs.d.ts" />
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var riot = require('riot');
var CONSTANTS = require('../constants/constants');

var Router = (function () {
    function Router(metaMap) {
        _classCallCheck(this, Router);

        this.integrations = metaMap.Integrations;
        this.user = metaMap.User;
        this.PageFactory = metaMap.PageFactory;
        this.eventer = metaMap.Eventer;
        this.isHidden = false;
    }

    _createClass(Router, [{
        key: 'init',
        value: function init() {
            var _this = this;

            riot.route.start();
            riot.route(function (target) {
                for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                    params[_key - 3] = arguments[_key];
                }

                var _PageFactory;

                var id = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
                var action = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

                _this.path = _this.getPath(target);

                _this.toggleMain(true, _this.path);
                (_PageFactory = _this.PageFactory).navigate.apply(_PageFactory, [_this.path, id, action].concat(params));

                _this.eventer['do']('history', window.location.hash);
            });
            this.to(this.currentPage);
        }
    }, {
        key: 'getPreviousPage',
        value: function getPreviousPage() {
            var pageNo = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];

            var page = 'home';
            var pageCnt = this.user.history.length;
            if (pageCnt > 0) {
                page = this.getPath(this.user.history[pageCnt - pageNo]);
            }
            return page;
        }
    }, {
        key: 'track',
        value: function track(path) {
            this.integrations.updatePath(path);
        }
    }, {
        key: 'toggleMain',
        value: function toggleMain(hide, path) {
            this.track(path);
            if (hide) {
                this.isHidden = true;
            } else {
                this.isHidden = false;
            }
        }
    }, {
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
            path = this.getPath(path);
            if (path) {
                this.toggleMain(true, path);
                riot.route('' + path);
            }
        }
    }, {
        key: 'back',
        value: function back() {
            var path = 'home';
            var pageCnt = this.user.history.length;
            if (pageCnt > 1 && (this.currentPage != 'mymaps' || this.currentPage != this.previousPage)) {
                path = this.previousPage;
                var backNo = 2;
                while (!this.isTracked(path) && this.user.history[backNo]) {
                    backNo += 1;
                    path = this.getPreviousPage(backNo);
                }
            }
            return this.to(path);
        }
    }, {
        key: 'isTracked',
        value: function isTracked(path) {
            var pth = this.getPath(path);
            return _.any(this.doNotTrack, function (p) {
                return !pth.startsWith(p);
            });
        }
    }, {
        key: 'currentPage',
        get: function get() {
            var page = window.location.hash || 'home';
            if (!this.isTracked(page)) {
                var pageCnt = this.user.history.length;
                if (pageCnt > 0) {
                    page = this.getPath(this.user.history[pageCnt - 1]);
                }
            }
            return page;
        }
    }, {
        key: 'currentPath',
        get: function get() {
            return this.path;
        }
    }, {
        key: 'previousPage',
        get: function get() {
            return this.getPreviousPage(2);
        }
    }, {
        key: 'doNotTrack',
        get: function get() {
            if (!this._doNotTrack) {
                this._doNotTrack = [CONSTANTS.ACTIONS.DELETE_MAP, CONSTANTS.ACTIONS.COPY_MAP, CONSTANTS.ACTIONS.LOGOUT, CONSTANTS.ACTIONS.NEW_MAP, CONSTANTS.ACTIONS.FEEDBACK];
            }
            return this._doNotTrack;
        }
    }]);

    return Router;
})();

module.exports = Router;

},{"../constants/constants":24,"riot":"riot"}],18:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Auth0Lock = window.Auth0Lock; //require('auth0-lock');
var localforage = require('localforage');
var _ = require('lodash');
var Promise = require('bluebird');

var Auth0 = (function () {
    function Auth0(config, metaMap) {
        _classCallCheck(this, Auth0);

        this.config = config;
        this.metaMap = metaMap;
        this.lock = new Auth0Lock(config.api, config.app);
        this.lock.on('loading ready', function () {});
    }

    _createClass(Auth0, [{
        key: 'login',
        value: function login() {
            var _this = this;

            if (!this._login) {
                this._login = new Promise(function (fulfill, reject) {
                    var showLogin = function showLogin() {
                        _this.lock.show({
                            closable: false,
                            loginAfterSignup: true,
                            authParams: {
                                scope: 'openid offline_access'
                            }
                        }, function (err, profile, id_token, ctoken, opt, refresh_token) {
                            if (err) {
                                _this.onFail(err, reject);
                            } else {
                                localforage.setItem('id_token', id_token);
                                localforage.setItem('profile', profile);

                                _this.ctoken = profile.ctoken = ctoken;
                                _this.id_token = profile.id_token = id_token;
                                _this.profile = profile;
                                _this.refresh_token = profile.refresh_token = refresh_token;
                                _this._getSession = fulfill(profile);
                            }
                        });
                    };
                    _this.getSession().then(function (profile) {
                        if (profile) {
                            fulfill(profile);
                        } else {
                            showLogin();
                        }
                    })['catch'](function (err) {
                        showLogin();
                    });
                });
            }
            return this._login;
        }
    }, {
        key: 'linkAccount',
        value: function linkAccount() {
            this.lock.show({
                callbackURL: location.href.replace(location.hash, ''),
                dict: {
                    signin: {
                        title: 'Link with another account'
                    }
                },
                authParams: {
                    access_token: this.ctoken
                }
            });
        }
    }, {
        key: 'onFail',
        value: function onFail(err, reject) {
            this.metaMap.error(err);
            if (reject) {
                reject(err);
                this.logout();
            }
        }
    }, {
        key: 'getSession',
        value: function getSession() {
            var _this2 = this;

            if (this.profile) {
                this._getSession = new Promise(function (fulfill, reject) {
                    fulfill(_this2.profile);
                });
            } else if (!this._getSession) {
                this._getSession = new Promise(function (fulfill, reject) {
                    return localforage.getItem('id_token').then(function (id_token) {
                        if (id_token) {
                            return _this2.lock.getProfile(id_token, function (err, profile) {
                                if (err) {
                                    _this2.onFail(err, reject);
                                } else {
                                    localforage.setItem('id_token', id_token);
                                    localforage.setItem('profile', profile);
                                    _this2.id_token = profile.id_token = id_token;
                                    _this2.profile = profile;
                                    return fulfill(profile);
                                }
                            });
                        } else {
                            return reject(new Error('No session'));
                        }
                    });
                });
            }
            return this._getSession;
        }
    }, {
        key: 'logout',
        value: function logout() {
            var _this3 = this;

            localforage.removeItem('id_token').then(function () {
                return localforage.removeItem('profile');
            }).then(function () {
                _this3.profile = null;
                _this3.ctoken = null;
                _this3.id_token = null;
                _this3.refresh_token = null;
                _this3._login = null;
                _this3._getSession = null;
                window.location.reload();
            });
        }
    }]);

    return Auth0;
})();

module.exports = Auth0;

},{"bluebird":undefined,"localforage":undefined,"lodash":undefined}],19:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var uuid = require('../tools/uuid.js');
var Common = require('../tools/Common');

var User = (function () {
    function User(profile, auth, eventer, metaFire) {
        _classCallCheck(this, User);

        this.auth = auth;
        this.eventer = eventer;
        this.metaFire = metaFire;
        this.userKey = uuid();
        this.onReady();
        this.metaMap = require('../../MetaMap');
    }

    _createClass(User, [{
        key: 'onReady',
        value: function onReady() {
            var _this = this;

            if (!this._onReady) {
                (function () {
                    var trackHistory = _.once(function () {
                        _this.eventer.every('history', function (page) {
                            if (_this.history.length == 0 || page != _this.history[_this.history.length - 1]) {
                                _this.history.push(page);
                                _this.metaFire.setData(_this.history, 'users/' + _this.auth.uid + '/history');
                            }
                        });
                    });
                    _this._onReady = new Promise(function (fulfill, reject) {
                        _this.metaFire.on('users/' + _this.auth.uid, function (user) {
                            if (user) {
                                try {
                                    if (!user.history) {
                                        user.history = [];
                                    }
                                    _this.profile = user;
                                    trackHistory();
                                } catch (e) {
                                    _this.metaMap.error(e);
                                }
                                fulfill(user);
                            }
                        });
                    });
                })();
            }
            return this._onReady;
        }
    }, {
        key: 'saveUserEditorOptions',
        value: function saveUserEditorOptions(options) {
            var data = {
                user: {
                    editor_options: JSON.stringify(options)
                }
            };
        }
    }, {
        key: '_identity',
        get: function get() {
            var ret = {};
            if (this.profile && this.profile.identity) {
                ret = this.profile.identity;
            }
            return ret;
        }
    }, {
        key: 'createdOn',
        get: function get() {
            if (null == this._createdOn) {
                if (this._identity.created_at) {
                    var dt = new Date(this._identity.created_at);
                    this._createdOn = {
                        date: dt,
                        ticks: Common.getTicksFromDate(dt)
                    };
                }
            }
            return this._createdOn || { date: null, ticks: null };
        }
    }, {
        key: 'displayName',
        get: function get() {
            var ret = this.fullName;
            if (ret) {
                ret = ret.split(' ')[0];
            }
            if (!ret && this._identity.nickname) {
                ret = this._identity.nickname;
            }

            return ret;
        }
    }, {
        key: 'fullName',
        get: function get() {
            var ret = '';
            if (this._identity.name) {
                ret = this._identity.name;
            }
            return ret;
        }
    }, {
        key: 'email',
        get: function get() {
            var ret = '';
            if (this._identity.email) {
                ret = this._identity.email;
            }
            return ret;
        }
    }, {
        key: 'picture',
        get: function get() {
            var ret = '';
            if (this._identity.picture) {
                ret = this._identity.picture;
            }
            return ret;
        }
    }, {
        key: 'userId',
        get: function get() {
            return this.auth.uid;
        }
    }, {
        key: 'isAdmin',
        get: function get() {
            var ret = false;
            if (this._identity.roles) {
                ret = this._identity.roles.indexOf('admin') !== -1;
            }
            return ret;
        }
    }, {
        key: 'history',
        get: function get() {
            return this.profile.history || [];
        }
    }]);

    return User;
})();

module.exports = User;

},{"../../MetaMap":1,"../tools/Common":65,"../tools/uuid.js":67}],20:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var jsPlumb = window.jsPlumb;
var jsPlumbToolkit = window.jsPlumbToolkit;
var _ = require('lodash');

require('./layout');

var Canvas = (function () {
    function Canvas(map, mapId) {
        var _this = this;

        _classCallCheck(this, Canvas);

        this.map = map;
        this.mapId = mapId;
        this.toolkit = {};
        this.metaMap = require('../../MetaMap');

        var that = this;

        var throttleSave = _.throttle(function () {
            var postData = {
                data: _this.toolkit.exportData(),
                changed_by: _this.metaMap.User.userKey
            };
            _this.metaMap.MetaFire.setDataInTransaction(postData, 'maps/data/' + _this.mapId);
            _this.metaMap.Integrations.sendEvent(_this.mapId, 'event', 'autosave', 'autosave');
        }, 500);

        jsPlumbToolkit.ready(function () {

            var currentCorner;

            // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.
            var toolkit = window.toolkit = jsPlumbToolkit.newInstance({
                beforeStartConnect: function beforeStartConnect(fromNode, edgeType) {
                    currentCorner = edgeType;
                    return {
                        type: edgeType
                    };
                },
                beforeConnect: function beforeConnect(fromNode, toNode) {
                    var ret = true;
                    //Prevent self-referencing connections
                    if (fromNode == toNode) {
                        ret = false;
                    } else {
                        //Between the same two nodes, only one perspective connection may exist
                        switch (currentCorner) {
                            case 'perspective':
                                var edges = fromNode.getEdges({ filter: function filter(e) {
                                        return e.data.type == 'perspective';
                                    } });
                                for (var i = 0; i < edges.length; i += 1) {
                                    var ed = edges[i];
                                    if (ed.source == fromNode && ed.target == toNode || ed.target == fromNode && ed.source == toNode) {
                                        ret = false;
                                        break;
                                    }
                                }
                                break;
                        }
                    }
                    return ret;
                }
            });

            //
            // dummy for a new node.
            //
            var _newNode = function _newNode(type) {
                type = type || "idea";
                return {
                    w: 100,
                    h: 100,
                    label: "idea",
                    type: type
                };
            };

            // dummy for a new proxy (drag handle)
            var _newProxy = function _newProxy(type) {
                type = type || 'proxyPerspective';
                return {
                    w: 10,
                    h: 10,
                    type: type
                };
            };

            var mainElement = document.querySelector(".jtk-demo-main"),
                canvasElement = mainElement.querySelector(".jtk-demo-canvas");

            //Whenever changing the selection, clear what was previously selected
            var clearSelection = function clearSelection(obj) {
                toolkit.clearSelection();
                if (obj) {
                    toolkit.setSelection(obj);
                }
            };

            // configure the renderer
            var renderer = toolkit.render({
                container: canvasElement,
                layout: {
                    // custom layout for this app. simple extension of the spring layout.
                    type: "metamap"
                },
                //
                // this is how you can associate groups of nodes. Here, because of the
                // way I have represented the relationship in the data, we either return
                // a part's "parent" as the posse, or if it is not a part then we
                // return the node's id. There are addToPosse and removeFromPosse
                // methods too (on the renderer, not the toolkit); these can be used
                // when transferring a part from one parent to another.
                assignPosse: function assignPosse(node) {
                    return node.data.parent || node.id;
                },
                zoomToFit: true,
                view: {
                    nodes: {
                        all: {
                            events: {
                                tap: function tap(obj) {
                                    clearSelection(obj.node);
                                },
                                mouseenter: function mouseenter(obj) {}
                            }
                        },
                        'default': {
                            parent: "all",
                            template: "tmplNode"
                        },
                        idea: {
                            parent: "default"
                        },
                        "r-thing": {
                            parent: "idea"
                        },
                        proxy: {
                            parent: "all",
                            template: "tmplDragProxy",
                            anchors: ['Continuous', 'Center']
                        },
                        proxyPerspective: {
                            parent: "proxy"
                        },
                        proxyRelationship: {
                            parent: "proxy",
                            events: {
                                dblclick: function dblclick(obj) {
                                    //obj.node.data.type = 'r-thing'
                                    //obj.node.setType('r-thing')
                                    //Updating the node type does not seem to stick; instead, create a new node
                                    var d = renderer.mapEventLocation(obj.e);
                                    var edges = obj.node.getEdges();

                                    d.w = edges[0].source.data.w * 0.8;
                                    d.h = edges[0].source.data.h * 0.8;

                                    var newNode = toolkit.addNode(jsPlumb.extend(_newNode("r-thing"), d));

                                    //re-create the edge connections on the new node
                                    for (var i = 0; i < edges.length; i += 1) {
                                        if (edges[i].source == obj.node) {
                                            toolkit.connect({ source: newNode, target: edges[i].target, data: {
                                                    type: "relationship"
                                                } });
                                        } else if (edges[i].target == obj.node) {
                                            toolkit.connect({ source: edges[i].source, target: newNode, data: {
                                                    type: "relationshipProxy"
                                                } });
                                        }
                                    }

                                    //delete the proxy node
                                    toolkit.removeNode(obj.node);
                                }
                            }
                        }
                    },
                    edges: {
                        all: {
                            events: {
                                tap: function tap(obj) {
                                    if (obj.e.target.getAttribute('class') == 'relationship-overlay') {
                                        debugger;
                                    }
                                    clearSelection(obj.edge);
                                }
                            }
                        },
                        'default': {
                            parent: "all",
                            anchors: ["Continuous", "Continuous"]

                        },
                        connector: {
                            parent: "all",
                            connector: ["StateMachine", {
                                margin: 1.01,
                                curviness: 30
                            }]
                        },
                        relationship: {
                            cssClass: "edge-relationship",
                            parent: "connector",
                            endpoint: "Blank",
                            overlays: [["PlainArrow", {
                                location: 1,
                                width: 10,
                                length: 10,
                                cssClass: "relationship-overlay"
                            }]]

                        },
                        relationshipProxy: {
                            cssClass: "edge-relationship",
                            parent: "connector",
                            endpoint: "Blank"
                        },
                        perspective: {
                            cssClass: "edge-perspective",
                            endpoints: ["Blank", ["Dot", { radius: 10, cssClass: "orange" }]],
                            parent: "connector"
                        },
                        perspectiveProxy: {
                            cssClass: "edge-perspective",
                            endpoints: ["Blank", ["Dot", { radius: 1, cssClass: "orange_proxy" }]],
                            parent: "connector"
                        }
                    }
                },
                events: {
                    canvasClick: function canvasClick(e) {
                        clearSelection();
                    },
                    canvasDblClick: function canvasDblClick(e) {
                        // add an Idea node at the location at which the event occurred.
                        var pos = renderer.mapEventLocation(e);
                        //Move 1/2 the height and width up and to the left to center the node on the mouse click
                        //TODO: when height/width is configurable, remove hard-coded values
                        pos.left = pos.left - 50;
                        pos.top = pos.top - 50;
                        toolkit.addNode(jsPlumb.extend(_newNode(), pos));
                    },
                    nodeAdded: _registerHandlers, // see below
                    edgeAdded: function edgeAdded(obj) {
                        //
                    },
                    relayout: function relayout() {

                        var currentDrag = null;

                        var nodes = document.querySelectorAll('.Leaded_square_frame_1_ > path');
                        _.each(nodes, function (n) {
                            n.setAttribute('draggable', 'true');
                            n.addEventListener('drop', function () {
                                debugger;
                            });
                            n.addEventListener('dragstart', function () {
                                debugger;
                            });
                            n.addEventListener('drag', function () {
                                debugger;
                            });
                            n.addEventListener('dragenter', function () {
                                debugger;
                            });
                            n.addEventListener('dragleave', function () {
                                debugger;
                            });
                            n.addEventListener('dragover', function () {
                                debugger;
                            });
                            n.addEventListener('dragend', function () {
                                debugger;
                            });
                            var isDragging = false;
                            $(n).mousedown(function (event) {
                                isDragging = false;
                            }).mousemove(function (event) {
                                isDragging = true;
                                currentDrag = this;
                            }).mouseup(function (event) {
                                var target = event.target.parentNode.parentNode.parentNode.parentNode;
                                if (target != this) {}

                                //var wasDragging = isDragging;
                                isDragging = false;
                            });
                        });

                        //
                        //                 $('.jtk-node').mouseup(function(event) {
                        //                     if(currentDrag != this) {
                        //                         debugger
                        //                     }
                        //                 })
                        //
                        //                 $('.jtk-node').draggable()
                        //                 $('.jtk-node').droppable({
                        //                     drop: function() {
                        //                         debugger
                        //                     }
                        //                 })
                    }
                },
                dragOptions: {
                    filter: ".segment" // can't drag nodes by the color segments.
                }
            });

            // ------------------------- dialogs -------------------------------------

            jsPlumbToolkit.Dialogs.initialize({
                selector: ".dlg"
            });

            // ------------------------- / dialogs ----------------------------------

            //  ----------------------------------------------------------------------------------------
            //
            //    Mouse handlers. Some are wired up; all log the current node data to the console.
            //
            // -----------------------------------------------------------------------------------------

            var _types = ["red", "orange", "green", "blue", "text"];

            var clickLogger = function clickLogger(type, event, el, node) {
                console.log(event + ' ' + type);
                console.dir(node.data);
                if (event == 'dblclick') {
                    toolkit.clearSelection();
                }
            };

            var _clickHandlers = {
                click: {
                    red: function red(el, node) {
                        clickLogger('R', 'click', el, node);
                    },
                    green: function green(el, node) {
                        clickLogger('G', 'click', el, node);
                    },
                    orange: function orange(el, node) {
                        clickLogger('O', 'click', el, node);
                    },
                    blue: function blue(el, node) {
                        clickLogger('B', 'click', el, node);
                    },
                    text: function text(el, node) {
                        clickLogger('T', 'click', el, node);
                    }
                },
                dblclick: {
                    red: function red(el, node) {
                        clickLogger('R', 'dblclick', el, node);
                        toolkit.addNode(_newNode());
                    },
                    green: function green(el, node) {
                        clickLogger('G', 'dblclick', el, node);
                        var newWidth = node.data.w * 0.8;
                        var newHeight = node.data.h * 0.8;

                        node.data.children = node.data.children || [];
                        var newLabel = node.data.label + ": Part " + (node.data.children.length + 1);

                        var newNode = toolkit.addNode({ parent: node.id, w: newWidth, h: newHeight, label: newLabel });
                        node.data.children.push(newNode.id);
                        renderer.relayout();
                    },
                    orange: function orange(el, node) {
                        clickLogger('O', 'dblclick', el, node);
                        var newNode = toolkit.addNode(_newNode());
                        var proxyNode = toolkit.addNode(_newProxy('proxyPerspective'));

                        toolkit.connect({ source: node, target: proxyNode, data: {
                                type: "perspectiveProxy"
                            } });
                        toolkit.connect({ source: proxyNode, target: newNode, data: {
                                type: "perspective"
                            } });
                    },
                    blue: function blue(el, node) {
                        clickLogger('B', 'dblclick', el, node);
                        var newNode = toolkit.addNode(_newNode());
                        var proxyNode = toolkit.addNode(_newProxy('proxyRelationship'));

                        toolkit.connect({ source: node, target: proxyNode, data: {
                                type: "relationshipProxy"
                            } });
                        toolkit.connect({ source: proxyNode, target: newNode, data: {
                                type: "relationship"
                            } });
                    },
                    text: function text(el, node) {
                        clickLogger('T', 'dblclick', el, node);
                        var label = el.querySelector(".name");
                        jsPlumbToolkit.Dialogs.show({
                            id: "dlgText",
                            title: "Enter label:",
                            onOK: function onOK(d) {
                                toolkit.updateNode(node, { label: d.text });
                            },
                            data: {
                                text: node.data.label
                            }
                        });
                    }
                }
            };

            var _curryHandler = function _curryHandler(el, segment, node) {
                var _el = el.querySelector("." + segment);
                jsPlumb.on(_el, "click", function () {
                    _clickHandlers["click"][segment](el, node);
                });
                jsPlumb.on(_el, "dblclick", function () {
                    _clickHandlers["dblclick"][segment](el, node);
                });
            };

            //
            // setup the clicking actions and the label drag. For the drag we create an
            // instance of jsPlumb for not other purpose than to manage the dragging of
            // labels. When a drag starts we set the zoom on that jsPlumb instance to
            // match our current zoom.
            //
            var labelDragHandler = jsPlumb.getInstance();
            function _registerHandlers(params) {
                // here you have params.el, the DOM element
                // and params.node, the underlying node. it has a `data` member with the node's payload.
                var el = params.el,
                    node = params.node,
                    label = el.querySelector(".name");
                for (var i = 0; i < _types.length; i++) {
                    _curryHandler(el, _types[i], node);
                }

                // make the label draggable (see note above).
                labelDragHandler.draggable(label, {
                    start: function start() {
                        labelDragHandler.setZoom(renderer.getZoom());
                    },
                    stop: function stop(e) {
                        node.data.labelPosition = [parseInt(label.style.left, 10), parseInt(label.style.top, 10)];
                    }
                });

                // make the label editable via a dialog
                jsPlumb.on(label, "dblclick", function () {
                    jsPlumbToolkit.Dialogs.show({
                        id: "dlgText",
                        title: "Enter label:",
                        onOK: function onOK(d) {
                            toolkit.updateNode(node, { label: d.text });
                        },
                        data: {
                            text: node.data.label
                        }
                    });
                });
            }

            /**
            * shows info in window on bottom right.
            */
            function _info(text) {}

            // ----------------------------------------------------------------------------------------------------------------------

            // load the data.
            if (that.map && that.map.data) {
                toolkit.load({
                    type: 'json',
                    data: that.map.data
                });
            } else {
                toolkit.load({
                    url: "data.json"
                });
            }

            // --------------------------------------------------------------------------------------------------------
            // a couple of random examples of the filter function, allowing you to query your data
            // --------------------------------------------------------------------------------------------------------

            var countEdgesOfType = function countEdgesOfType(type) {
                return toolkit.filter(function (obj) {
                    return obj.objectType == "Edge" && obj.data.type === type;
                }).getEdgeCount();
            };
            var dumpEdgeCounts = function dumpEdgeCounts() {
                console.log("There are " + countEdgesOfType("relationship") + " relationship edges");
                console.log("There are " + countEdgesOfType("perspective") + " perspective edges");
            };

            toolkit.bind("dataUpdated", function () {
                dumpEdgeCounts();
                //TODO: wire up autosave here
            });

            jsPlumb.on("relationshipEdgeDump", "click", dumpEdgeCounts());

            //CTRL + click enables the lasso
            jsPlumb.on(document, 'mousedown', function (event) {
                if (event.ctrlKey) {
                    renderer.setMode('select');
                }
            });

            //CTRL + click enables the lasso
            jsPlumb.on('beforeDrop', function (event) {
                debugger;
            });

            var deleteAll = function deleteAll(selected) {
                //TODO: implement logic to delete whole edge+proxy+edge structure
                selected.eachEdge(function (i, e) {
                    console.log(e);
                });

                //Recurse over all children
                selected.eachNode(function (i, n) {
                    var recurse = function recurse(node) {
                        if (node && node.data.children) {
                            for (var i = 0; i < node.data.children.length; i += 1) {
                                var child = toolkit.getNode(node.data.children[i]);
                                recurse(child);
                            }
                        }
                        //Delete children before parents
                        toolkit.removeNode(node);
                    };
                    recurse(n);
                });
                toolkit.remove(selected);
            };

            //map backspace to delete if anything is selected
            jsPlumb.on(document, 'keyup', function (event) {
                var selected = toolkit.getSelection();
                switch (event.keyCode) {
                    case 8:
                        if (selected) {
                            event.preventDefault();
                        }
                    case 46:
                        deleteAll(selected);
                        break;
                }
            });

            jsPlumb.on(document, 'keydown', function (event) {
                switch (event.keyCode) {
                    case 46:
                        var selected = toolkit.getSelection();
                        deleteAll(selected);
                        break;
                }
            });
        });
    }

    // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.

    _createClass(Canvas, [{
        key: 'init',
        value: function init() {}
    }]);

    return Canvas;
})();

module.exports = Canvas;

},{"../../MetaMap":1,"./layout":21,"lodash":undefined}],21:[function(require,module,exports){
/**
* Custom layout for metamap. Extends the Spring layout. After Spring runs, this
* layout finds 'part' nodes and aligns them underneath their parents. The alignment
* - left or right - is set in the parent node's data, as `partAlign`.
*/
"use strict";

;(function () {

  jsPlumbToolkit.Layouts["metamap"] = function () {
    jsPlumbToolkit.Layouts.Spring.apply(this, arguments);

    var _oneSet = (function (parent, params) {
      params = params || {};
      var padding = params.partPadding || 50;
      if (parent.data.children) {

        var c = parent.data.children,
            parentPos = this.getPosition(parent.id),
            parentSize = this.getSize(parent.id),
            magnetizeNodes = [parent.id],
            align = (parent.data.partAlign || "right") === "left" ? 0 : 1,
            y = parentPos[1] + parentSize[1] + padding;

        for (var i = 0; i < c.length; i++) {
          if (c[i]) {
            var childSize = this.getSize(c[i]),
                x = parentPos[0] + align * (parentSize[0] - childSize[0]);

            this.setPosition(c[i], x, y, true);
            magnetizeNodes.push(c[i]);
            y += childSize[1] + padding;
          }
        }
      }
    }).bind(this);

    // stash original end callback and override. place all Part nodes wrt their
    // parents, then call original end callback and finally tell the layout
    // to draw itself again.
    var _superEnd = this.end;
    this.end = function (toolkit, params) {
      var nc = toolkit.getNodeCount();
      for (var i = 0; i < nc; i++) {
        var n = toolkit.getNodeAt(i);
        // only process nodes that are not Part nodes (there could of course be
        // a million ways of determining what is a Part node...here I just use
        // a rudimentary construct in the data)
        if (n.data.parent == null) {
          _oneSet(n, params);
        }
      }

      _superEnd.apply(this, arguments);
      this.draw();
    };
  };
})();

},{}],22:[function(require,module,exports){
'use strict';

var ACTIONS = {
    MAP: 'map',
    NEW_MAP: 'new_map',
    COPY_MAP: 'copy_map',
    DELETE_MAP: 'delete_map',
    HOME: 'home',
    MY_MAPS: 'mymaps',
    TERMS_AND_CONDITIONS: 'terms',
    LOGOUT: 'logout',
    FEEDBACK: 'feedback'
};

Object.freeze(ACTIONS);

module.exports = ACTIONS;

},{}],23:[function(require,module,exports){
'use strict';

var CANVAS = {
    LEFT: 'left',
    RIGHT: 'right'
};

Object.freeze(CANVAS);

module.exports = CANVAS;

},{}],24:[function(require,module,exports){
'use strict';

var CONSTANTS = {
	ACTIONS: require('./actions'),
	CANVAS: require('./canvas'),
	DSRP: require('./dsrp'),
	EDIT_STATUS: require('./editStatus'),
	ELEMENTS: require('./elements'),
	EVENTS: require('./events'),
	PAGES: require('./pages'),
	ROUTES: require('./routes'),
	TABS: require('./tabs'),
	TAGS: require('./tags')
};

Object.freeze(CONSTANTS);

module.exports = CONSTANTS;

},{"./actions":22,"./canvas":23,"./dsrp":25,"./editStatus":26,"./elements":27,"./events":28,"./pages":29,"./routes":30,"./tabs":31,"./tags":32}],25:[function(require,module,exports){
'use strict';

var DSRP = {
	D: 'D',
	S: 'S',
	R: 'R',
	P: 'P'
};

Object.freeze(DSRP);

module.exports = DSRP;

},{}],26:[function(require,module,exports){
'use strict';

var status = {
    LAST_UPDATED: '',
    READ_ONLY: 'View only',
    SAVING: 'Saving...',
    SAVE_OK: 'All changes saved',
    SAVE_FAILED: 'Changes could not be saved'
};

Object.freeze(status);

module.exports = status;

},{}],27:[function(require,module,exports){
'use strict';

var ELEMENTS = {
    APP_CONTAINER: 'app-container',
    META_PROGRESS: 'meta_progress',
    META_PROGRESS_NEXT: 'meta_progress_next'
};

Object.freeze(ELEMENTS);

module.exports = ELEMENTS;

},{}],28:[function(require,module,exports){
'use strict';

var EVENTS = {
	SIDEBAR_OPEN: 'sidebar-open',
	SIDEBAR_CLOSE: 'sidebar-close',
	SIDEBAR_TOGGLE: 'sidebar-toggle',
	PAGE_NAME: 'pageName',
	NAV: 'nav',
	MAP: 'map'
};

Object.freeze(EVENTS);

module.exports = EVENTS;

},{}],29:[function(require,module,exports){
'use strict';

var ACTIONS = require('./actions.js');
var _ = require('lodash');

var PAGES = {
    MAP: 'map',
    NEW_MAP: 'new_map',
    COPY_MAP: 'copy_map',
    DELETE_MAP: 'delete_map',
    MY_MAPS: 'mymaps',
    TERMS_AND_CONDITIONS: 'terms',
    HOME: 'home'
};

_.extend();

Object.freeze(PAGES);

module.exports = PAGES;

},{"./actions.js":22,"lodash":undefined}],30:[function(require,module,exports){
'use strict';

var ROUTES = {
    MAPS_LIST: 'maps/list/',
    MAPS_DATA: 'maps/data/',
    MAPS_NEW_MAP: 'maps/new-map/',
    TERMS_AND_CONDITIONS: 'metamap/terms-and-conditions/',
    HOME: 'metamap/home/'
};

Object.freeze(ROUTES);

module.exports = ROUTES;

},{}],31:[function(require,module,exports){
'use strict';

var TABS = {
    TAB_ID_PRESENTER: 'presenter-tab',
    TAB_ID_ANALYTICS_MAP: 'analytics-tab-map',
    TAB_ID_ANALYTICS_THING: 'analytics-tab-thing',
    TAB_ID_PERSPECTIVES: 'perspectives-tab',
    TAB_ID_DISTINCTIONS: 'distinctions-tab',
    TAB_ID_ATTACHMENTS: 'attachments-tab',
    TAB_ID_GENERATOR: 'generator-tab',
    TAB_ID_STANDARDS: 'standards-tab'
};
Object.freeze(TABS);

module.exports = TABS;

},{}],32:[function(require,module,exports){
'use strict';

var TAGS = {
    META_CANVAS: 'meta-canvas',
    HOME: 'home',
    TERMS: 'terms',
    MY_MAPS: 'my-maps'
};

Object.freeze(TAGS);

module.exports = TAGS;

},{}],33:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');

var AddThis = (function (_IntegrationsBase) {
    _inherits(AddThis, _IntegrationsBase);

    function AddThis(config, user) {
        _classCallCheck(this, AddThis);

        _get(Object.getPrototypeOf(AddThis.prototype), "constructor", this).call(this, config, user);
        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0],
                t = window.addthis || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "//s7.addthis.com/js/300/addthis_widget.js#pubid=" + config.pubid;
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function (f) {
                t._e.push(f);
            };

            return t;
        })(document, "script", "add-this-js");
        this.addthis = window.addthis;
    }

    _createClass(AddThis, [{
        key: "init",
        value: function init() {
            _get(Object.getPrototypeOf(AddThis.prototype), "init", this).call(this);
        }
    }, {
        key: "integration",
        get: function get() {
            this.addthis = this.addthis || window.addthis;
            return this.addthis;
        }
    }]);

    return AddThis;
})(IntegrationsBase);

module.exports = AddThis;

},{"./_IntegrationsBase":41}],34:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');
var Google = require('./google');

var Facebook = (function (_IntegrationsBase) {
    _inherits(Facebook, _IntegrationsBase);

    function Facebook(config, user) {
        _classCallCheck(this, Facebook);

        _get(Object.getPrototypeOf(Facebook.prototype), 'constructor', this).call(this, config, user);
        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
        this.FB = window.FB;
    }

    _createClass(Facebook, [{
        key: 'init',
        value: function init() {
            _get(Object.getPrototypeOf(Facebook.prototype), 'init', this).call(this);
            this.integration.init({
                appId: this.config.appid,
                xfbml: this.config.xfbml,
                version: this.config.version
            });

            this.integration.Event.subscribe('edge.create', function (targetUrl) {
                Google.sendSocial('facebook', targetUrl);
            });

            this.integration.Event.subscribe('edge.remove', function (targetUrl) {
                Google.sendSocial('facebook', targetUrl);
            });

            this.integration.Event.subscribe('message.send', function (targetUrl) {
                Google.sendSocial('facebook', targetUrl);
            });
        }
    }, {
        key: 'integration',
        get: function get() {
            this.FB = this.FB || window.FB;
            return this.FB;
        }
    }]);

    return Facebook;
})(IntegrationsBase);

module.exports = Facebook;

},{"./_IntegrationsBase":41,"./google":42}],35:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');

var Google = (function (_IntegrationsBase) {
  _inherits(Google, _IntegrationsBase);

  function Google(config, user) {
    _classCallCheck(this, Google);

    _get(Object.getPrototypeOf(Google.prototype), 'constructor', this).call(this, config, user);
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
    })(window, document, 'script', 'dataLayer', this.config.tagmanager);

    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
  }

  _createClass(Google, [{
    key: 'init',
    value: function init() {
      _get(Object.getPrototypeOf(Google.prototype), 'init', this).call(this);
      var mode = 'auto';
      var domain = window.location.host;
      if (domain.startsWith('localhost')) {
        mode = 'none';
      }
      this.integration('create', this.config.analytics, mode);
      this.integration('send', 'pageview');
    }
  }, {
    key: 'setUser',
    value: function setUser() {
      _get(Object.getPrototypeOf(Google.prototype), 'setUser', this).call(this);
      this.integration('set', 'userId', this.user.userId);
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(val, event, source, type) {
      _get(Object.getPrototypeOf(Google.prototype), 'sendEvent', this).call(this, val, event, source, type);
      if (this.integration) {
        if (source && type) {
          this.integration('send', event, source, type, val);
        } else {
          this.integration('send', event, val);
        }
      }
    }
  }, {
    key: 'updatePath',
    value: function updatePath(path) {
      _get(Object.getPrototypeOf(Google.prototype), 'updatePath', this).call(this, path);
      if (this.integration) {
        this.integration('set', {
          page: path
        });
        this.integration('send', 'pageview');
      }
    }
  }, {
    key: 'integration',
    get: function get() {
      this.ga = this.ga || window.ga;
      return this.ga;
    }
  }], [{
    key: 'sendSocial',
    value: function sendSocial(network, targetUrl) {
      var type = arguments.length <= 2 || arguments[2] === undefined ? 'send' : arguments[2];

      if (window.ga) {
        window.ga('send', 'social', network, type, targetUrl);
      }
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(event, source, type, url) {
      if (window.ga) {
        window.ga('send', event, source, type, url);
      }
    }
  }]);

  return Google;
})(IntegrationsBase);

module.exports = Google;

},{"./_IntegrationsBase":41}],36:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');

var Intercom = (function (_IntegrationsBase) {
    _inherits(Intercom, _IntegrationsBase);

    function Intercom(config, user) {
        _classCallCheck(this, Intercom);

        _get(Object.getPrototypeOf(Intercom.prototype), 'constructor', this).call(this, config, user);

        var i = function i() {
            i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args);
        };
        window.Intercom = i;
        try {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://widget.intercom.io/widget/' + config.appid + '}';
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        } catch (e) {}
        this.intercom = window.Intercom;
    }

    _createClass(Intercom, [{
        key: 'init',
        value: function init() {
            _get(Object.getPrototypeOf(Intercom.prototype), 'init', this).call(this);
        }
    }, {
        key: 'setUser',
        value: function setUser() {
            _get(Object.getPrototypeOf(Intercom.prototype), 'setUser', this).call(this);
            this.integration('boot', {
                app_id: this.config.appid,
                name: this.user.fullName,
                email: this.user.email,
                created_at: this.user.createdOn.ticks,
                user_id: this.user.userId
            });
            this.sendEvent('update');
        }
    }, {
        key: 'sendEvent',
        value: function sendEvent() {
            var event = arguments.length <= 0 || arguments[0] === undefined ? 'update' : arguments[0];

            _get(Object.getPrototypeOf(Intercom.prototype), 'sendEvent', this).call(this, event);
            this.integration('update');
        }
    }, {
        key: 'updatePath',
        value: function updatePath(path) {
            this.integration('update');
        }
    }, {
        key: 'logout',
        value: function logout() {
            _get(Object.getPrototypeOf(Intercom.prototype), 'logout', this).call(this);
            this.integration('shutdown');
        }
    }, {
        key: 'integration',
        get: function get() {
            this.intercom = this.intercom || window.Intercom;
            return this.intercom;
        }
    }]);

    return Intercom;
})(IntegrationsBase);

module.exports = Intercom;

},{"./_IntegrationsBase":41}],37:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');

var NewRelic = (function (_IntegrationsBase) {
    _inherits(NewRelic, _IntegrationsBase);

    function NewRelic(config, user) {
        _classCallCheck(this, NewRelic);

        _get(Object.getPrototypeOf(NewRelic.prototype), 'constructor', this).call(this, config, user);

        this.NewRelic = window.NREUM;
    }

    _createClass(NewRelic, [{
        key: 'init',
        value: function init() {
            _get(Object.getPrototypeOf(NewRelic.prototype), 'init', this).call(this);
        }
    }, {
        key: 'setUser',
        value: function setUser() {
            _get(Object.getPrototypeOf(NewRelic.prototype), 'setUser', this).call(this);
            if (this.integration) {
                this.integration.setCustomAttribute('username', this.user.email);
                this.integration.setCustomAttribute('acccountID', this.user.userId);
            }
        }
    }, {
        key: 'sendEvent',
        value: function sendEvent(val, event, source, type) {
            _get(Object.getPrototypeOf(NewRelic.prototype), 'sendEvent', this).call(this, val, event, source, type);
            if (this.integration) {
                this.integration.addToTrace(val);
            }
        }
    }, {
        key: 'updatePath',
        value: function updatePath(path) {
            _get(Object.getPrototypeOf(NewRelic.prototype), 'updatePath', this).call(this, path);
            if (this.integration) {
                this.setPageViewName(path, window.location.hostname);
            }
        }
    }, {
        key: 'integration',
        get: function get() {
            this.NewRelic = this.NewRelic || window.NREUM;
            return this.NewRelic;
        }
    }]);

    return NewRelic;
})(IntegrationsBase);

module.exports = NewRelic;

},{"./_IntegrationsBase":41}],38:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');
var Google = require('./google');

var Twitter = (function (_IntegrationsBase) {
    _inherits(Twitter, _IntegrationsBase);

    function Twitter(config, user) {
        _classCallCheck(this, Twitter);

        _get(Object.getPrototypeOf(Twitter.prototype), 'constructor', this).call(this, config, user);
        (function (d, s, id) {
            var js = undefined,
                fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function (f) {
                t._e.push(f);
            };

            return t;
        })(document, "script", "twitter-wjs");
    }

    _createClass(Twitter, [{
        key: 'init',
        value: function init() {
            var _this = this;

            _get(Object.getPrototypeOf(Twitter.prototype), 'init', this).call(this);
            this.integration.ready(function (twitter) {
                twitter.widgets.load();
                twitter.events.bind('click', _this._clickEventToAnalytics);
                twitter.events.bind('tweet', _this._tweetIntentToAnalytics);
                twitter.events.bind('retweet', _this._retweetIntentToAnalytics);
                twitter.events.bind('favorite', _this._favIntentToAnalytics);
                twitter.events.bind('follow', _this._followIntentToAnalytics);
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
        }
    }, {
        key: '_followIntentToAnalytics',
        value: function _followIntentToAnalytics(intentEvent) {
            if (!intentEvent) return;
            var label = intentEvent.data.user_id + " (" + intentEvent.data.screen_name + ")";
            Google.sendSocial('twitter', label, intentEvent.type);
        }
    }, {
        key: '_retweetIntentToAnalytics',
        value: function _retweetIntentToAnalytics(intentEvent) {
            if (!intentEvent) return;
            var label = intentEvent.data.source_tweet_id;
            Google.sendSocial('twitter', label, intentEvent.type);
        }
    }, {
        key: '_favIntentToAnalytics',
        value: function _favIntentToAnalytics(intentEvent) {
            this._tweetIntentToAnalytics(intentEvent);
        }
    }, {
        key: '_tweetIntentToAnalytics',
        value: function _tweetIntentToAnalytics(intentEvent) {
            if (!intentEvent) return;
            var label = "tweet";
            Google.sendSocial('twitter', label, intentEvent.type);
        }
    }, {
        key: '_clickEventToAnalytics',
        value: function _clickEventToAnalytics(intentEvent) {
            if (!intentEvent) return;
            var label = intentEvent.region;
            Google.sendSocial('twitter', label, intentEvent.type);
        }
    }, {
        key: 'integration',
        get: function get() {
            this.twttr = this.twttr || window.twttr;
            return this.twttr;
        }
    }]);

    return Twitter;
})(IntegrationsBase);

module.exports = Twitter;

},{"./_IntegrationsBase":41,"./google":42}],39:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');
var Google = require('./google');

var UserSnap = (function (_IntegrationsBase) {
    _inherits(UserSnap, _IntegrationsBase);

    function UserSnap(config, user) {
        _classCallCheck(this, UserSnap);

        _get(Object.getPrototypeOf(UserSnap.prototype), 'constructor', this).call(this, config, user);
        var apiKey = undefined,
            s = undefined,
            x = undefined;
        if (config == null) {
            config = {};
        }
        apiKey = config.api;
        if (apiKey && !window.location.host.startsWith('localhost')) {
            var usConf = {
                emailBox: true,
                emailBoxValue: user.email,
                emailRequired: true,
                consoleRecorder: true,
                mode: 'report',
                shortcut: true,
                beforeOpen: function beforeOpen(obj) {
                    Google.sendEvent('feedback', 'usersnap', 'widget', window.location.href);
                }
            };
            window.usersnapconfig = window._usersnapconfig = usConf;

            s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = '//api.usersnap.com/load/' + apiKey + '.js';
            x = document.getElementsByTagName('head')[0];
            x.appendChild(s);
        }
        this.userSnap = window.UserSnap;
    }

    _createClass(UserSnap, [{
        key: 'init',
        value: function init() {
            _get(Object.getPrototypeOf(UserSnap.prototype), 'init', this).call(this);
        }
    }, {
        key: 'setUser',
        value: function setUser() {
            _get(Object.getPrototypeOf(UserSnap.prototype), 'setUser', this).call(this);
        }
    }, {
        key: 'integration',
        get: function get() {
            this.userSnap = this.userSnap || window.UserSnap;
            return this.userSnap;
        }
    }]);

    return UserSnap;
})(IntegrationsBase);

module.exports = UserSnap;

},{"./_IntegrationsBase":41,"./google":42}],40:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');

var ZenDesk = (function (_IntegrationsBase) {
    _inherits(ZenDesk, _IntegrationsBase);

    function ZenDesk(config, user) {
        _classCallCheck(this, ZenDesk);

        _get(Object.getPrototypeOf(ZenDesk.prototype), "constructor", this).call(this, config, user);
        var zO = {};
        window.zEmbed || (function (e, t) {
            var n = undefined,
                o = undefined,
                d = undefined,
                i = undefined,
                s = undefined,
                a = [],
                r = document.createElement("iframe");window.zEmbed = function () {
                a.push(arguments);
            }, window.zE = window.zE || window.zEmbed, r.src = "javascript:false", r.title = "", r.role = "presentation", (r.frameElement || r).style.cssText = "display: none", d = document.getElementsByTagName("script"), d = d[d.length - 1], d.parentNode.insertBefore(r, d), i = r.contentWindow, s = i.document;
            try {
                o = s;
            } catch (c) {
                n = document.domain, r.src = 'javascript:let d=document.open();d.domain="' + n + '";void(0);', o = s;
            }o.open()._l = function () {
                var o = this.createElement("script");n && (this.domain = n), o.id = "js-iframe-async", o.src = e, this.t = +new Date(), this.zendeskHost = t, this.zEQueue = a, this.body.appendChild(o);
                zO.logic = window.zE;
            }, o.write('<body onload="document._l();">'), o.close();
        })("https://assets.zendesk.com/embeddable_framework/main.js", config.site);

        zO.widget = window.zEmbed;
        zO.logic = window.zE;
    }

    _createClass(ZenDesk, [{
        key: "init",
        value: function init() {
            _get(Object.getPrototypeOf(ZenDesk.prototype), "init", this).call(this);
        }
    }, {
        key: "setUser",
        value: function setUser() {
            var _this = this;

            _get(Object.getPrototypeOf(ZenDesk.prototype), "setUser", this).call(this);
            this.integration(function () {
                _this.integration.identify({ name: _this.user.fullName, email: _this.user.email });
            });
        }
    }, {
        key: "integration",
        get: function get() {
            return window.zE;
        }
    }]);

    return ZenDesk;
})(IntegrationsBase);

var zenDesk = function zenDesk(config) {

    return zO;
};

module.exports = ZenDesk;

},{"./_IntegrationsBase":41}],41:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IntegrationsBase = (function () {
	function IntegrationsBase(config, user) {
		_classCallCheck(this, IntegrationsBase);

		this.config = config;
		this.user = user;
	}

	_createClass(IntegrationsBase, [{
		key: "init",
		value: function init() {}
	}, {
		key: "setUser",
		value: function setUser() {}
	}, {
		key: "sendEvent",
		value: function sendEvent() {}
	}, {
		key: "updatePath",
		value: function updatePath() {}
	}, {
		key: "logout",
		value: function logout() {}
	}, {
		key: "integration",
		get: function get() {
			return {};
		}
	}]);

	return IntegrationsBase;
})();

module.exports = IntegrationsBase;

},{}],42:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');

var Google = (function (_IntegrationsBase) {
  _inherits(Google, _IntegrationsBase);

  function Google(config, user) {
    _classCallCheck(this, Google);

    _get(Object.getPrototypeOf(Google.prototype), 'constructor', this).call(this, config, user);
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
    })(window, document, 'script', 'dataLayer', this.config.tagmanager);

    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
  }

  _createClass(Google, [{
    key: 'init',
    value: function init() {
      _get(Object.getPrototypeOf(Google.prototype), 'init', this).call(this);
      var mode = 'auto';
      var domain = window.location.host;
      if (domain.startsWith('localhost')) {
        mode = 'none';
      }
      this.integration('create', this.config.analytics, mode);
      this.integration('send', 'pageview');
    }
  }, {
    key: 'setUser',
    value: function setUser() {
      _get(Object.getPrototypeOf(Google.prototype), 'setUser', this).call(this);
      this.integration('set', 'userId', this.user.userId);
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(val, event, source, type) {
      _get(Object.getPrototypeOf(Google.prototype), 'sendEvent', this).call(this, val, event, source, type);
      if (this.integration) {
        if (source && type) {
          this.integration('send', event, source, type, val);
        } else {
          this.integration('send', event, val);
        }
      }
    }
  }, {
    key: 'updatePath',
    value: function updatePath(path) {
      _get(Object.getPrototypeOf(Google.prototype), 'updatePath', this).call(this, path);
      if (this.integration) {
        this.integration('set', {
          page: path
        });
        this.integration('send', 'pageview');
      }
    }
  }, {
    key: 'integration',
    get: function get() {
      this.ga = this.ga || window.ga;
      return this.ga;
    }
  }], [{
    key: 'sendSocial',
    value: function sendSocial(network, targetUrl) {
      var type = arguments.length <= 2 || arguments[2] === undefined ? 'send' : arguments[2];

      if (window.ga) {
        window.ga('send', 'social', network, type, targetUrl);
      }
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(event, source, type, url) {
      if (window.ga) {
        window.ga('send', event, source, type, url);
      }
    }
  }]);

  return Google;
})(IntegrationsBase);

module.exports = Google;

},{"./_IntegrationsBase":41}],43:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var riot = window.riot;
var NProgress = window.NProgress;
var pageBody = require('../tags/page-body.js');
var CONSTANTS = require('../constants/constants');
var Actions = require('../actions/Action.js');

var PageFactory = (function () {
    function PageFactory(eventer, metaFire) {
        _classCallCheck(this, PageFactory);

        this.metaFire = metaFire;
        this.eventer = eventer;
        this.actions = new Actions(metaFire, eventer, this);
        this.onReady();
    }

    _createClass(PageFactory, [{
        key: 'onReady',
        value: function onReady() {
            if (!this._onReady) {
                this._onReady = new Promise(function (fulfill, reject) {
                    $('#' + CONSTANTS.ELEMENTS.META_PROGRESS).remove();
                    riot.mount('*');
                    NProgress.configure({ parent: '#' + CONSTANTS.ELEMENTS.META_PROGRESS_NEXT });

                    _.delay(function () {
                        Metronic.init(); // init metronic core componets
                        Layout.init(); // init layout
                        Demo.init(); // init demo features
                        Index.init(); // init index page
                        Tasks.initDashboardWidget(); // init tash dashboard widget
                        fulfill();
                    }, 250);
                });
            }
            return this._onReady;
        }
    }, {
        key: 'navigate',
        value: function navigate(path, id, action) {
            var _actions;

            for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                params[_key - 3] = arguments[_key];
            }

            var act = (_actions = this.actions).act.apply(_actions, [path, id, action].concat(params));
            if (!act) {
                var _eventer;

                (_eventer = this.eventer)['do'].apply(_eventer, [path, path, { id: id, action: action }].concat(params));
            }
        }
    }]);

    return PageFactory;
})();

module.exports = PageFactory;

},{"../actions/Action.js":2,"../constants/constants":24,"../tags/page-body.js":53}],44:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var Canvas = require('../../canvas/canvas');
var d3 = require('d3');
require('./node');

var html = '\n<div class="portlet light jtk-demo-main" style="padding: 0; ">\n    <div class="jtk-demo-canvas canvas-wide" id="diagram">\n\n    </div>\n</div>\n';

module.exports = riot.tag('meta-canvas', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.mapId = null;
    this.canvas = null;

    this.buildCanvas = function (map) {
        if (!_this.canvas) {
            $(_this.diagram).empty();

            var width = $(_this.diagram).width(),
                height = $(_this.diagram).height();

            var xLoc = width / 2 - 25,
                yLoc = 100;

            _this.canvas = new Canvas(map, _this.mapId);
            _this.canvas.init();

            _this.update();
        } else {
            if (map.changed_by != MetaMap.User.userKey) {
                _this.canvas.init();
            }
        }
        NProgress.done();
    };

    this.build = function (opts) {
        if (opts.id != _this.mapId) {
            _this.canvas = null;
            if (_this.mapId) {
                MetaMap.MetaFire.off('maps/data/' + _this.mapId);
            }
            _this.mapId = opts.id;
            NProgress.start();

            MetaMap.MetaFire.on('maps/data/' + opts.id, _this.buildCanvas);
            MetaMap.Eventer.forget('map', _this.build);
        }
    };

    MetaMap.Eventer.every('map', this.build);

    this.correctHeight = function () {
        $(_this.diagram).css({
            height: window.innerHeight - 120 + 'px'
        });
    };

    this.on('update', function () {
        _this.correctHeight();
    });

    $(window).resize(function () {
        _this.correctHeight();
    });
});

},{"../../../MetaMap.js":1,"../../canvas/canvas":20,"./node":45,"d3":undefined,"riot":"riot"}],45:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var Editor = require('../../canvas/canvas');
var d3 = require('d3');

var html = '\n';

module.exports = riot.tag('node', html, function (opts) {});

},{"../../canvas/canvas":20,"d3":undefined,"riot":"riot"}],46:[function(require,module,exports){
'use strict';

var riot = require('riot');

module.exports = riot.tag('raw', '<span></span>', function (opts) {
    var _this = this;

    this.updateContent = function () {
        this.root.innerHTML = opts ? opts.content || '' : '';
    };

    this.on('update', function () {
        _this.updateContent();
    });

    this.updateContent();
});

},{"riot":"riot"}],47:[function(require,module,exports){
'use strict';

var riot = require('riot');
var moment = require('moment');
var Ps = require('perfect-scrollbar');

var raw = require('../components/raw');
var CONSTANTS = require('../../constants/constants');

var html = '\n<div class="page-sidebar-wrapper" style="{ getDisplay() }">\n    <div id="chat_shell" class="page-sidebar panel" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">\n        <div class="panel-heading">\n            <div id="bot_title" class="panel-title chat-welcome">Cortex Man</div>\n        </div>\n        <div id="chat_body" class="panel-body" style="position: absolute;">\n            <ul class="media-list example-chat-messages" id="example-messages">\n                <li each="{ messages }" class="media">\n                    <div class="media-body">\n                        <div class="media">\n                            <a class="pull-{ left: author == \'cortex\', right: author != \'cortex\' }" href="#"><img height="39" width="39" class="media-object img-circle" src="{ picture }"></a>\n                            <div class="media-body bubble">\n                                <raw content="{ message }"></raw>\n                                <small class="text-muted"><br>{ parent.getRelativeTime(time) }</small>\n                            </div>\n                        </div>\n                    </div>\n                </li>\n            </ul>\n        </div>\n        <div class="panel-footer" style="position: fixed; width: 233px; bottom: 26px;">\n            <div class="row">\n                <div class="col-lg-12">\n                    <form id="chat_input_form" onsubmit="{ onSubmit }">\n                        <div class="input-group">\n                            <input id="chat_input" type="text" class="form-control" placeholder="Enter message...">\n                            <span class="input-group-btn">\n                                <button class="btn blue" type="submit">Send</button>\n                            </span>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n';

riot.tag('chat', html, function (opts) {
    var _this = this;

    this.cortexPicture = 'src/images/cortex-avatar-small.jpg';
    this.messages = [{
        message: 'Hello, I\'m Cortex Man. Ask me anything. Try <code>/help</code> if you get lost.',
        author: 'cortex',
        picture: this.cortexPicture,
        time: new Date()
    }];

    var MetaMap = require('../../../MetaMap');

    this.correctHeight = function () {
        _this.chat_shell.style.height = window.innerHeight - 120 + 'px';
        _this.chat_body.style.height = window.innerHeight - 267 + 'px';
        Ps.update(_this.chat_body);
    };

    $(window).resize(function () {
        _this.correctHeight();
    });

    this.on('update', function () {
        _this.correctHeight();
    });

    this.on('mount', function () {
        Ps.initialize(_this.chat_body);
        _this.update();
    });

    this.getDisplay = function () {
        if (!_this.display) {
            return 'display: none;';
        } else {
            return '';
        }
    };

    this.getRelativeTime = function () {
        var date = arguments.length <= 0 || arguments[0] === undefined ? new Date() : arguments[0];

        return moment(date).fromNow();
    };

    this.onSubmit = function (obj) {
        _this.messages.push({
            message: _this.chat_input.value,
            author: MetaMap.User.userName,
            picture: MetaMap.User.picture,
            time: new Date()
        });
        _this.messages.push({
            message: 'You asked me ' + _this.chat_input.value + '. That\'s great!',
            author: 'cortex',
            picture: _this.cortexPicture,
            time: new Date()
        });
        _this.chat_input.value = '';
        _this.update();
        _this.chat_body.scrollTop = _this.chat_body.scrollHeight;
        Ps.update(_this.chat_body);
    };

    this.toggle = function (state) {
        _this.display = state;
        _this.update();
    };

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_TOGGLE, function () {
        if (_this.display) {
            MetaMap.Eventer['do'](CONSTANTS.EVENTS.SIDEBAR_CLOSE);
        } else {
            MetaMap.Eventer['do'](CONSTANTS.EVENTS.SIDEBAR_OPEN);
        }
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        _this.toggle(false);
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        _this.toggle(true);
    });
});

},{"../../../MetaMap":1,"../../constants/constants":24,"../components/raw":46,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],48:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n            <i class="fa fa-graduation-cap"></i>\n        </a>\n        <ul class="dropdown-menu">\n            <li>\n                <ul class="dropdown-menu-list scroller" style="height: 270px;" data-handle-color="#637283">\n                    <li if="{ help }"\n                        each="{ help }"\n                        onclick="{ parent.onClick }">\n                        <a href="{ link }">\n                            <i class="{ icon }"></i>\n                            <span class="title">{ title }</span>\n                        </a>\n                    </li>\n                </ul>\n            </li>\n        </ul>\n';

riot.tag('meta-help', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap');

    this.onClick = function (event, params) {
        console.log(event, params);
        return true;
    };

    this.help = null;
    this.on('mount', function () {
        MetaMap.MetaFire.on('metamap/help', function (data) {
            _this.help = _.filter(_.sortBy(data, 'order'), function (d) {
                var include = d.archive != true;
                return include;
            });
            _this.update();
        });
    });
});

},{"../../../MetaMap":1,"riot":"riot"}],49:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n                    <i class="fa fa-bell-o"></i>\n                    <span class="badge badge-success">\n                        { notifications.length }\n                    </span>\n                </a>\n                <ul class="dropdown-menu">\n                    <li class="external">\n                        <h3>\n                            <span class ="bold">{ notifications.length } pending</span> notification{ s: notifications.length == 0 || notifications.length > 1 }\n                        </h3>\n                        <a href="javascript:;">view all</a>\n                    </li>\n                    <li>\n                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">\n                            <li if="{ notifications }"\n                                each="{ notifications }"\n                                onclick="{ parent.onClick }">\n                                <a href="javascript:;">\n                                    <span class="time">{ time }</span>\n                                    <span class="details">\n                                        <span class="label label-sm label-icon label-success">\n                                            <i class="fa fa-plus"></i>\n                                        </span>\n                                        { event }\n                                    </span>\n                                </a>\n                            </li>\n                        </ul>\n                    </li>\n                </ul>\n';

riot.tag('meta-notifications', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.notifications = [];

    this.onClick = function (event, params) {
        console.log(event, params);
        return true;
    };

    this.on('mount', function () {
        MetaMap.MetaFire.on('metamap/notifications', function (data) {
            _this.notifications = _.filter(_.sortBy(data, 'order'), function (d) {
                var include = d.archive != true;
                return include;
            });
            _this.update();
        });
    });
});

},{"../../../MetaMap.js":1,"riot":"riot"}],50:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n                    <i class="fa fa-trophy"></i>\n                    <span class="badge badge-success">\n                        { points.length }\n                    </span>\n                </a>\n                <ul class="dropdown-menu">\n                    <li class="external">\n                        <h3>\n                            <span class ="bold">{ points.length } new </span> achievement{ s: points.length == 0 || points.length > 1 }\n                        </h3>\n                        <a href="javascript:;">view all</a>\n                    </li>\n                    <li>\n                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">\n                            <li if="{ points }"\n                                each="{ points }"\n                                onclick="{ parent.onClick }">\n                                <a href="javascript:;">\n                                    <span class="time">{ time }</span>\n                                    <span class="details">\n                                        <span class="label label-sm label-icon label-success">\n                                            <i class="fa fa-plus"></i>\n                                        </span>\n                                        { event }\n                                    </span>\n                                </a>\n                            </li>\n                        </ul>\n                    </li>\n                </ul>\n';

riot.tag('meta-points', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');
    this.points = [];

    this.onClick = function (event, params) {
        console.log(event, params);
        return true;
    };

    this.on('mount', function () {
        MetaMap.MetaFire.on('users/' + MetaMap.User.userId + '/points', function (data) {
            _this.points = _.filter(_.sortBy(data, 'order'), function (d) {
                var include = d.archive != true;
                return include;
            });
            _this.update();
        });
    });
});

},{"../../../MetaMap.js":1,"riot":"riot"}],51:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n                    <span class="username username-hide-on-mobile">\n                        { username }\n                    </span>\n                    <img if="{ picture }" alt="" height="39" width="39" class="img-circle" src="{ picture }" />\n                </a>\n                <ul class="dropdown-menu dropdown-menu-default">\n                    <li if="{ menu }"\n                        each="{ menu }"\n                        onclick="{ parent.onClick }">\n                        <a href="{ link }">\n                            <i class="{ icon }"></i> { title }\n                        </a>\n                    </li>\n                </ul>\n';

riot.tag('meta-user', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.menu = [];
    this.username = '';
    this.picture = '';

    this.logout = function () {
        MetaMap.logout();
    };

    this.linkAccount = function () {
        MetaMap.Auth0.linkAccount();
    };

    this.onClick = function (event, params) {
        switch (event.item.link) {
            case '#link-social-accounts':
                _this.linkAccount();
                return false;
                break;

            default:
                console.log(event, params);
                return true;
                break;
        }
    };

    this.on('mount', function () {
        MetaMap.MetaFire.on('metamap/user', function (data) {
            _this.username = MetaMap.User.displayName;
            _this.picture = MetaMap.User.picture;
            _this.menu = _.filter(_.sortBy(data, 'order'), function (d) {
                var include = d.archive != true;
                return include;
            });
            _this.update();
        });
    });
});

},{"../../../MetaMap.js":1,"riot":"riot"}],52:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');
require('../tools/shims');

var html = '\n<div class="page-actions">\n    <div class="btn-group">\n        <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n            <span class="hidden-sm hidden-xs">Actions&nbsp;</span>\n            <i class="fa fa-angle-down"></i>\n        </button>\n        <ul class="dropdown-menu" role="menu">\n            <li each="{ val, i in data }" class="{ start: i == 0, active: i == 0 }">\n                <a if="{ parent.getLinkAllowed(val) }" href="{ parent.getActionLink(val) }">\n                    <i class="{ val.icon }"></i> { val.title }\n                </a>\n            </li>\n            <li class="divider"></li>\n            <li>\n                <a href="#settings">\n                    <i class="fa fa-gear"></i> Settings\n                </a>\n            </li>\n        </ul>\n    </div>\n\n    <span style="padding-left: 5px;">\n        <span if="{ pageName }"\n                id="map_name"\n                data-type="text"\n                data-title="Enter map name">\n            { pageName }\n        </span>\n    </span>\n</div>\n';

module.exports = riot.tag('page-actions', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.data = [];
    this.pageName = 'Home';
    this.url = MetaMap.config.site.db + '.firebaseio.com';
    this.loaded = false;

    this.getActionLink = function (obj) {
        var ret = obj.link;
        if (obj.url_params) {
            (function () {
                var args = [];
                _.each(obj.url_params, function (prm) {
                    args.push(_this[prm.name]);
                });
                ret = obj.link.format.call(obj.link, args);
            })();
        }
        return ret;
    };

    this.getLinkAllowed = function (obj) {
        var ret = true == obj['allowed-on']['*'];
        if (!ret) {
            var currentPage = MetaMap.Router.currentPath;
            ret = true == obj['allowed-on'][currentPage];
        }
        return ret;
    };

    this.bindTopageName = _.once(function () {
        if (_this.mapId) {
            MetaMap.MetaFire.on(CONSTANTS.ROUTES.MAPS_LIST + '/' + _this.mapId + '/name', function (name) {
                _this.pageName = name || '';
                _this.update();
            });
        }
        _this.loaded = true;
    });

    MetaMap.Eventer.every('pageName', function (opts) {
        if (_this.loaded) {
            $(_this.map_name).editable('destroy');
        }
        if (_this.mapId) {
            MetaMap.MetaFire.off(CONSTANTS.ROUTES.MAPS_LIST + '/' + _this.mapId + '/name');
            if (opts.id) {
                MetaMap.MetaFire.on(CONSTANTS.ROUTES.MAPS_LIST + '/' + opts.id + '/name', function (name) {
                    _this.pageName = name;
                    _this.update();
                });
            }
        }
        _this.pageName = opts.name || 'Home';
        _this.mapId = opts.id;
        _this.update();
        if (_this.mapId) {
            $(_this.map_name).editable({ unsavedclass: null }).on('save', function (event, params) {
                MetaMap.MetaFire.setData(params.newValue, CONSTANTS.ROUTES.MAPS_LIST + '/' + _this.mapId + '/name');
            });
            _this.bindTopageName();
        }
    });

    MetaMap.MetaFire.on('metamap/actions', function (data) {
        _this.data = _.filter(_.sortBy(data, 'order'), function (d) {
            var include = d.archive != true;
            return include;
        });
        _this.update();
    });
});

},{"../../MetaMap":1,"../constants/constants":24,"../tools/shims":66,"riot":"riot"}],53:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageHeader = require('./page-header');
var pageContainer = require('./page-container');
var pageFooter = require('./page-footer');
var CONSTANTS = require('../constants/constants');

var html = '\n<div id="page_body" class="page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo">\n\n    <div id="meta_page_header"></div>\n\n    <div class="clearfix">\n    </div>\n\n    <div id="meta_page_container"></div>\n\n</div>';

module.exports = riot.tag('page-body', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('mount', function () {
        riot.mount(_this.meta_page_header, 'page-header');
        riot.mount(_this.meta_page_container, 'page-container');
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        $(_this.page_body).addClass('page-sidebar-reversed');
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        $(_this.page_body).removeClass('page-sidebar-reversed');
    });
});

},{"../../MetaMap":1,"../constants/constants":24,"./page-container":54,"./page-footer":56,"./page-header":57,"riot":"riot"}],54:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageSidebar = require('./page-sidebar');
var chat = require('./cortex/chat');
var pageContent = require('./page-content');

var html = '\n<div class="page-container">\n    <div id="meta_page_sidebar"></div>\n    <div id="meta_page_content"></div>\n</div>\n';

module.exports = riot.tag('page-container', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('mount', function () {
        riot.mount(_this.meta_page_sidebar, 'chat');
        riot.mount(_this.meta_page_content, 'page-content');
    });
});

},{"../../MetaMap":1,"./cortex/chat":47,"./page-content":55,"./page-sidebar":60,"riot":"riot"}],55:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');
var _ = require('lodash');

var html = '\n<div class="page-content-wrapper">\n    <div id="page-content" class="page-content">\n\n        <div class="page-head">\n\n        </div>\n\n\n        <div id="app-container">\n\n        </div>\n    </div>\n</div>\n';

module.exports = riot.tag('page-content', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.hasSidebar = true;

    this.resize = function () {
        if (_this.hasSidebar) {
            $(_this['app-container']).css({ width: '100%' });
        } else {
            var width = window.innerWidth - 40 + 'px';
            $(_this['app-container']).css({ width: width });
        }
    };

    $(window).on('resize', function () {
        _this.resize();
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        _this.hasSidebar = true;
        _this.resize();
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        _this.hasSidebar = false;
        _this.resize();
    });
});

},{"../../MetaMap":1,"../constants/constants":24,"lodash":undefined,"riot":"riot"}],56:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<div class="page-footer" style="position: fixed; bottom: 0;">\n    <div class="page-footer-inner">\n        <a href="#terms">&copy;2015</a>\n    </div>\n</div>\n';

module.exports = riot.tag('page-footer', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],57:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageLogo = require('./page-logo.js');
var pageActions = require('./page-actions.js');
var pageSearch = require('./page-search.js');
var pageTopMenu = require('./page-topmenu');

var html = '\n<div id="header-top" class="page-header navbar navbar-fixed-top">\n    <div id="meta_progress_next" style="overflow: inherit;"></div>\n    <div id="header-content" class="page-header-inner">\n\n        <div id="meta_page_logo"></div>\n        \n        <div id="meta_page_actions"></div>\n        \n        <div id="meta_page_top" class="page-top">\n            <div id="meta_page_search"></div>\n            \n            <div id="meta_page_topmenu"></div>\n        </div>\n\n    </div>\n\n</div>\n';

module.exports = riot.tag('page-header', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('mount', function () {
        riot.mount(_this.meta_page_logo, 'page-logo');
        riot.mount(_this.meta_page_actions, 'page-actions');
        riot.mount(_this.meta_page_top, 'page-search');
        riot.mount(_this.meta_page_top, 'page-topmenu');
    });
});

},{"../../MetaMap":1,"./page-actions.js":52,"./page-logo.js":58,"./page-search.js":59,"./page-topmenu":61,"riot":"riot"}],58:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');

var html = '\n<div class ="page-logo">\n    <a id="meta_logo" href="#home">\n        <img src="assets/img/metamap_cloud.png" alt="logo" class ="logo-default" />\n    </a>\n    <div id="meta_menu_toggle" class="menu-toggler sidebar-toggler" onclick="{ onClick }" style="{ getDisplay(\'menu\') }">\n        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->\n    </div>\n</div>\n<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">\n</a>\n';

module.exports = riot.tag('page-logo', html, function (opts) {

    var MetaMap = require('../../MetaMap');

    this.onClick = function () {
        MetaMap.Eventer['do'](CONSTANTS.EVENTS.SIDEBAR_TOGGLE);
    };

    //     this.getDisplay = (el) => {
    //
    //         if(!this.display) {
    //             return 'display: none;';
    //         } else {
    //             return '';
    //         }
    //     }
    //
    //     MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
    //         this.display = false;
    //         this.update();
    //     });
    //
    //
    //     MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, () => {
    //         this.display = true;
    //         this.update();
    //     });
});

},{"../../MetaMap":1,"../constants/constants":24,"riot":"riot"}],59:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<!-- DOC: Apply "search-form-expanded" right after the "search-form" class to have half expanded search box -->\n<form class="search-form" action="extra_search.html" method="GET">\n    <div class="input-group">\n        <input type="text" class="form-control input-sm" placeholder="Search..." name="query">\n            <span class="input-group-btn">\n                <a href="javascript:;" class="btn submit">\n                    <i class="fa fa-search"></i>\n                </a>\n            </span>\n        </div>\n</form>\n';

module.exports = riot.tag('page-search', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],60:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');

var html = '\n<div class="page-sidebar-wrapper" style="{ getDisplay() }">\n    <div class="page-sidebar navbar-collapse collapse">\n        <ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">\n\n            <li if="{ data }" onclick="{ parent.click }" each="{ data }">\n                <a if="{ icon }" href="javascript:;">\n                    <i class="{ icon }" style="color:#{ color };"></i>\n                    <span class="title">{ title }</span>\n                    <span class="{ arrow: menu.length }"></span>\n                </a>\n                <ul if="{ menu && menu.length }" class="sub-menu">\n                    <li each="{ menu }">\n                        <a href="javascript:;">\n                            <i class="{ icon }"></i>\n                            <span class="title">{ title }</span>\n                        </a>\n                    </li>\n                </ul>\n            </li>\n\n        </ul>\n\n    </div>\n</div>\n';

module.exports = riot.tag('page-sidebar', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.click = function () {
        console.log('foo');
    };
    this.display = true;
    this.data = [];

    MetaMap.MetaFire.on('metamap/sidebar', function (data) {
        _this.data = _.filter(_.sortBy(data, 'order'), function (d) {
            var include = d.archive != true;
            if (include && d.menu && d.menu) {
                d.menu = _.filter(_.sortBy(d.menu, 'order'), function (m) {
                    return m.archive != true;
                });
            }
            return include;
        });
        _this.update();
    });

    this.getDisplay = function () {
        if (!_this.display) {
            return 'display: none;';
        } else {
            return '';
        }
    };

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        _this.display = false;
        _this.update();
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        _this.display = true;
        _this.update();
    });
});

},{"../../MetaMap":1,"../constants/constants":24,"riot":"riot"}],61:[function(require,module,exports){
'use strict';

var riot = require('riot');
var metaPoints = require('./menu/meta-points.js');
var metaHelp = require('./menu/meta-help.js');
var metaUser = require('./menu/meta-user.js');
var metaNot = require('./menu/meta-notifications.js');

var html = '\n<div class="top-menu">\n    <ul class="nav navbar-nav pull-right">\n        <li class="separator hide"></li>\n        <li class="dropdown" id="header_dashboard_bar" onclick="{ onClick }">\n            <a class="dropdown-toggle" href="#home">\n                <i class="fa fa-home"></i>\n            </a>\n        </li>\n\n        <li class="separator hide"></li>\n        <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_notification_bar"></li>\n\n'
// <li class="separator hide"></li>
// <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_points_bar"></li>
 + '\n\n        <li class="separator hide"></li>\n        <li id="header_help_bar" class="dropdown dropdown-extended dropdown-notification dropdown"></li>\n\n        <li class="separator hide"></li>\n        <li id="header_user_menu" class="dropdown dropdown-user dropdown"></li>\n    </ul>\n</div>\n';

module.exports = riot.tag('page-topmenu', html, function (opts) {
    var _this = this;

    this.onClick = function (event, params) {
        console.log(event, params);
        return true;
    };

    this.on('mount', function () {
        //TODO: restore notifications when logic is complete
        //riot.mount(this.header_points_bar, 'meta-points');
        riot.mount(_this.header_notification_bar, 'meta-notifications');
        riot.mount(_this.header_help_bar, 'meta-help');
        riot.mount(_this.header_user_menu, 'meta-user');
    });
});

},{"./menu/meta-help.js":48,"./menu/meta-notifications.js":49,"./menu/meta-points.js":50,"./menu/meta-user.js":51,"riot":"riot"}],62:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var CONSTANTS = require('../../constants/constants');

var html = '\n<div class="portlet light">\n\t\t\t\t<div class="portlet-body">\n\t\t\t\t\t<div class="row margin-bottom-30">\n\t\t\t\t\t\t<div if="{ header }" class="col-md-6">\n                            <h1>{ header.title }</h1>\n                            <p>{ header.text }</p>\n\t\t\t\t\t\t\t<ul class="list-unstyled margin-top-10 margin-bottom-10">\n\t\t\t\t\t\t\t\t<li each="{ areas }">\n\t\t\t\t\t\t\t\t\t<i class="{ icon }"></i> <b>{ title }</b> { text }\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t<!-- Blockquotes -->\n\t\t\t\t\t\t\t<blockquote class="hero">\n\t\t\t\t\t\t\t\t<p>{ quote.text }</p>\n\t\t\t\t\t\t\t\t<small>{ quote.by }</small>\n\t\t\t\t\t\t\t</blockquote>\n                            <div class="addthis_horizontal_follow_toolbox"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class ="col-md-6">\n                          <iframe if="{ header.youtubeid }"\n                                id="ytplayer"\n                                type="text/html"\n                                src="https://www.youtube.com/embed/{ header.youtubeid }"\n                                frameborder="0" allowfullscreen\n                                class ="fitvids"\n                                style="height: 327px; width: 100%; display: block; margin-left: auto; margin-right: auto; broder: 0;"\n                            />\n\t\t\t\t\t\t\t</iframe>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n                    <div class="headline">\n\t\t\t\t\t\t<h3>{ userName }{ vision.title }</h3>\n\t\t\t\t\t</div>\n                    <div>\n                        <p>{ vision.text }</p>\n                    </div>\n\t\t\t\t</div>\n\t\t\t</div>\n';

module.exports = riot.tag('home', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap');

    this.areas = [];
    this.header = {};

    MetaMap.MetaFire.on(CONSTANTS.ROUTES.HOME, function (data) {
        _this.areas = _.filter(_.sortBy(data.areas, 'order'), function (d) {
            var include = d.archive != true;
            return include;
        });
        _this.quote = data.quote;
        _this.header = data.header;
        _this.vision = data.vision;

        _this.userName = MetaMap.User.fullName;

        _this.update();

        NProgress.done();
    });
});

},{"../../../MetaMap":1,"../../constants/constants":24,"riot":"riot"}],63:[function(require,module,exports){
'use strict';

var riot = require('riot');
var moment = require('moment');
var NProgress = window.NProgress;
var _ = require('lodash');
var CONSTANTS = require('../../constants/constants');

var html = '\n<div class="portlet box grey-cascade">\n    <div class="portlet-title">\n        <div class="caption">\n            <i class="fa fa-icon-th-large"></i>MetaMaps\n        </div>\n        <div if="{ menu }" class="actions">\n            <a each="{ menu.buttons }" href="{ link }" onclick="{ parent.onActionClick }" class="btn btn-default btn-sm">\n                <i class="{ icon }"></i> { title }\n            </a>\n            <div class="btn-group">\n                <a class="btn btn-default btn-sm" href="javascript:;" data-toggle="dropdown">\n                    <i class="fa fa-cogs"></i> Tools <i class="fa fa-angle-down"></i>\n                </a>\n                <ul class="dropdown-menu pull-right">\n                    <li each="{ menu.menu }" onclick="{ parent.onMenuClick }">\n                        <a href="{ link }">\n                            <i class="{ icon }"></i> { title }\n                        </a>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class="portlet-body">\n        <ul class="nav nav-tabs portlet-tabs">\n            <li onclick="{ parent.onTabSwitch }" each="{ val, i in tabs }" class="{ active: i == 0 }">\n                <a href="#mymaps_1_{ i }" data-toggle="tab" aria-expanded="{ true: i == 0 }">\n                { val.title }</a>\n            </li>\n        </ul>\n        <div class="table-toolbar">\n\n        </div>\n        <div class="tab-content">\n            <div each="{ val, i in tabs }" class="tab-pane fase in { active: i == 0 }" id="mymaps_1_{ i }">\n                <table class="table table-striped table-bordered table-hover" id="mymaps_table_{ i }">\n                    <thead>\n                        <tr>\n                            <th style="display: none;">\n                                MapId\n                            </th>\n                            <th class="table-checkbox">\n                                <input if="{ parent.currentTab == \'My Maps\' }" type="checkbox" class="group-checkable" data-set="#mymaps_table_{ i } .checkboxes"/>\n                            </th>\n                            <th style="display: none;">\n                                UserId\n                            </th>\n                            <th>\n                                Name\n                            </th>\n                            <th>\n                                Created On\n                            </th>\n                            <th>\n                                Status\n                            </th>\n                            <th>\n                                Action\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr if="{ parent.data && parent.data[i] }" each="{ parent.data[i] }" class="odd gradeX">\n                            <td style="display: none;" ><span data-selector="id" class ="mapid">{ id }</span></td>\n                            <td>\n                                <input if="{ parent.currentTab == \'My Maps\' }" type="checkbox" class="checkboxes" value="1"/>\n                            </td>\n                            <td style="display: none;">{ user_id }</td>\n                            <td if="{ val.editable }" class="meta_editable_{ i }" data-pk="{ id }" data-title="Edit Map Name">{ name }</td>\n                            <td if="{ !val.editable }">{ name }</td>\n                            <td class="center">{ created_at }</td>\n                            <td>\n                                <span class="label label-sm label-success">\n                                    Private\n                                </span>\n                            </td>\n                            <td>\n                                <button class="btn btn-sm blue filter-submit" onclick="{ parent.onOpen }">\n                                    <i class="fa fa-icon-eye-open"></i> Open\n                                </button>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</div>\n';

module.exports = riot.tag('my-maps', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.data = null;
    this.menu = null;
    this.tabs = _.sortBy([{ title: 'My Maps', order: 0, editable: true }, { title: 'Shared with Me', order: 1, editable: false }], 'order');
    this.currentTab = 'My Maps';

    this.onOpen = function (event) {
        MetaMap.Router.to('map/' + event.item.id);
    };

    this.onTabSwitch = function (event) {
        _this.currentTab = event.item.val.title;
        switch (_this.currentTab) {
            case 'My Maps':

                break;
        }
    };

    this.onActionClick = function (event, tag) {
        return true;
    };

    this.onMenuClick = function (event, tag) {
        if (_this.currentTab == 'My Maps') {
            switch (event.item.title.toLowerCase()) {
                case 'delete':
                    var deleteMaps = require('../../actions/DeleteMap.js');
                    var selected = _this['table0'].find('.active').find('.mapid');
                    var ids = [];
                    _.each(selected, function (cell) {
                        ids.push(cell.innerHTML);
                    });
                    deleteMaps.deleteAll(ids, CONSTANTS.PAGES.MY_MAPS);
                    var find = _this['table0'].find('tbody tr .checkboxes');
                    find.each(function () {
                        $(this).attr('checked', false);
                        $(this).parents('tr').removeClass('active');
                    });
                    jQuery.uniform.update(find);
                    break;
            }
        }
    };

    this.on('mount', function () {
        NProgress.start();
        MetaMap.MetaFire.on('metamap/mymaps', function (data) {
            if (data) {
                _this.menu = {
                    buttons: _.sortBy(data.buttons, 'order'),
                    menu: _.sortBy(data.menu, 'order')
                };
                _this.update();
            }
        });

        var buildTable = function buildTable(idx, list, editable) {
            try {
                _this.data = _this.data || {};
                _this.data[idx] = list;
                if (_this['table' + idx]) {
                    $('.meta_editable_' + idx).editable('destroy');
                    _this['dataTable' + idx].destroy();
                }

                _this.update();

                _this['table' + idx] = $(_this['mymaps_table_' + idx]);
                _this['dataTable' + idx] = _this['table' + idx].DataTable({

                    // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                    // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
                    // So when dropdowns used the scrollable div should be removed.
                    //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',

                    //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                    'columns': [{
                        orderable: false
                    }, {
                        'orderable': false
                    }, {
                        'orderable': true
                    }, {
                        'orderable': true
                    }, {
                        'orderable': true
                    }, {
                        'orderable': false
                    }, {
                        'orderable': false
                    }]
                });
                //this[`table${idx}`]Tools = new $.fn.dataTable.TableTools(this[`dataTable${idx}`], {});

                var tableWrapper = _this['table' + idx].parent().parent().parent().find('#mymaps_' + idx + '_table_wrapper');

                _this['table' + idx].find('.group-checkable').change(function () {
                    var set = jQuery(this).attr('data-set');
                    var checked = jQuery(this).is(':checked');
                    jQuery(set).each(function () {
                        if (checked) {
                            $(this).attr('checked', true);
                            $(this).parents('tr').addClass('active');
                        } else {
                            $(this).attr('checked', false);
                            $(this).parents('tr').removeClass('active');
                        }
                    });
                    jQuery.uniform.update(set);
                });

                _this['table' + idx].on('change', 'tbody tr .checkboxes', function () {
                    $(this).parents('tr').toggleClass('active');
                });

                tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline'); // modify table per page dropdown

                if (editable) {
                    $('.meta_editable_' + idx).editable({ unsavedclass: null }).on('save', function (event, params) {
                        if (this.dataset && this.dataset.pk) {
                            var id = this.dataset.pk;
                            MetaMap.MetaFire.setData(params.newValue, CONSTANTS.ROUTES.MAPS_LIST + '/' + id + '/name');
                        }
                        return true;
                    });
                }
                NProgress.done();
            } catch (e) {
                NProgress.done();
                MetaMap.error(e);
            }
        };

        MetaMap.MetaFire.getChild(CONSTANTS.ROUTES.MAPS_LIST).orderByChild('owner').equalTo(MetaMap.User.userId).on('value', function (val) {
            var list = val.val();
            var maps = _.map(list, function (obj, key) {
                obj.id = key;
                obj.created_at = moment(obj.created_at).format('YYYY-MM-DD');
                return obj;
            });
            buildTable(0, maps);
        });

        MetaMap.MetaFire.getChild(CONSTANTS.ROUTES.MAPS_LIST).on('value', function (val) {
            var list = val.val();
            var maps = _.map(list, function (obj, key) {
                if (obj.owner == MetaMap.User.userId || !obj.shared_with || obj.shared_with[MetaMap.User.userId] != true) {
                    return;
                } else {
                    obj.id = key;
                    obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                    return obj;
                }
            });
            maps = _.filter(maps, function (map) {
                return map && map.id;
            });
            buildTable(1, maps);
        });
    });
});

},{"../../../MetaMap.js":1,"../../actions/DeleteMap.js":5,"../../constants/constants":24,"lodash":undefined,"moment":undefined,"riot":"riot"}],64:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var CONSTANTS = require('../../constants/constants');

var html = '\n<div class="portlet light">\n\t\t\t\t<div class="portlet-body">\n\t\t\t\t\t<div class="row margin-bottom-30">\n\t\t\t\t\t\t<div if="{ header }" class="col-md-12">\n                            <h1>{ header.title }</h1>\n                            <p>{ header.text }</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n                    <div each="{ areas }">\n                        <div class="headline">\n    \t\t\t\t\t\t<h3>{ title }</h3>\n    \t\t\t\t\t</div>\n                        <div>\n                            <p>{ text }</p>\n                        </div>\n                        <ul class="list-unstyled margin-top-10 margin-bottom-10">\n\t\t\t\t\t\t\t<li each="{ items }">\n\t\t\t\t\t\t\t\t<i class="{ icon }"></i> <b>{ title }</b> { text }\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ul>\n                    </div>\n\t\t\t\t</div>\n\t\t\t</div>\n';

module.exports = riot.tag('terms', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.areas = [];
    this.header = {};

    MetaMap.MetaFire.on(CONSTANTS.ROUTES.TERMS_AND_CONDITIONS, function (data) {
        _this.areas = _.filter(_.sortBy(data.sections, 'order'), function (d) {
            var include = d.archive != true;
            if (include) {
                d.items = _.filter(_.sortBy(d.items, 'order'), function (d) {
                    var include2 = d.archive != true;
                    return include2;
                });
            }
            return include;
        });

        _this.header = data.header;
        _this.userName = MetaMap.User.fullName;

        _this.update();

        NProgress.done();
    });
});

},{"../../../MetaMap.js":1,"../../constants/constants":24,"riot":"riot"}],65:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var moment = require('moment');

var Common = (function () {
    function Common() {
        _classCallCheck(this, Common);
    }

    _createClass(Common, null, [{
        key: 'splitLines',
        value: function splitLines(text) {
            return text.split(/\n/);
        }
    }, {
        key: 'getEventTime',
        value: function getEventTime(t, now) {
            var time = moment(t, 'YYYY-MM-DD HH:mm:ss.SSS');
            var nowtime = moment(now, 'YYYY-MM-DD HH:mm:ss.SSS');
            // console.log('t:       ' + t);
            // console.log('now:     ' + now);
            // console.log('time:    ' + time.format()); // + ' ' + time.isValid());
            // console.log('nowtime: ' + nowtime.format()); // + ' ' + nowtime.isValid());
            return time.from(nowtime);
        }
    }, {
        key: 'classIf',
        value: function classIf(klass, b) {
            //console.log('classIf: ' + klass + ', ' + b);
            return b ? klass : '';
        }

        // avoid '$apply already in progress' error (source: https://coderwall.com/p/ngisma)
    }, {
        key: 'safeApply',
        value: function safeApply(fn) {
            if (fn && typeof fn === 'function') {
                fn();
            }
        }

        // source: http://ctrlq.org/code/19616-detect-touch-screen-javascript
    }, {
        key: 'isTouchDevice',
        value: function isTouchDevice() {
            return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        }
    }, {
        key: 'getTicksFromDate',
        value: function getTicksFromDate(date) {
            var ret = null;
            if (date && date.getTime) {
                ret = date.getTime() / 1000;
            }
            return ret;
        }
    }]);

    return Common;
})();

module.exports = Common;

},{"moment":undefined}],66:[function(require,module,exports){
'use strict';

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

},{}],67:[function(require,module,exports){
'use strict';

var uuid = function uuid() {
    var hexDigits, i, s, uuid;
    s = [];
    s.length = 36;
    hexDigits = '0123456789abcdef';
    i = 0;
    while (i < 36) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        i += 1;
    }
    s[14] = '4';
    s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = '-';
    uuid = s.join('');
    return uuid;
};

module.exports = uuid;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3B5TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRGVsZXRlTWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRmVlZGJhY2suanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Ib21lLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTG9nb3V0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTXlNYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTmV3TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvT3Blbk1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9Db25maWcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0V2ZW50ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9JbnRlZ3JhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1JvdXRlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvYXV0aDAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL3VzZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY2FudmFzL2NhbnZhcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jYW52YXMvbGF5b3V0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9hY3Rpb25zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9jYW52YXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NvbnN0YW50cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZHNycC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWRpdFN0YXR1cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWxlbWVudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2V2ZW50cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvcGFnZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3JvdXRlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFicy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFncy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvQWRkVGhpcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvRmFjZWJvb2suanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL0dvb2dsZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvSW50ZXJjb20uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL05ld1JlbGljLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Ud2l0dGVyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Vc2VyU25hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvWmVuZGVzay5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvX0ludGVncmF0aW9uc0Jhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9ub2RlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9yYXcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9jb3J0ZXgvY2hhdC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1oZWxwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLW5vdGlmaWNhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtcG9pbnRzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLXVzZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWFjdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWJvZHkuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRhaW5lci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtY29udGVudC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtZm9vdGVyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1oZWFkZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWxvZ28uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXNlYXJjaC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2lkZWJhci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtdG9wbWVudS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL2hvbWUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9teS1tYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdGVybXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvQ29tbW9uLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3NoaW1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3V1aWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkIsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLE1BQU0sQ0FBQyxPQUFP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QUMsQUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdEYsQ0FBQSxFQUFHLENBQUM7OztBQUdMLEtBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3hCLE9BQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMzQixtQkFBVyxFQUNYLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVE7T0FDdEMsQ0FBQyxDQUFDLEFBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUN0QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7VUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLFdBQVcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxBQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEFBQUMsQ0FBQyxDQUFDLEdBQUcsR0FDckYsdUNBQXVDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxBQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNyRixDQUFBLENBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXBFLEtBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDOUIsT0FBQyxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDLEFBQUMsQ0FB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LENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdELFNBQUMsSUFBSSxDQUFDLENBQUM7S0FDVjtBQUNELEtBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDWixLQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxBQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEtBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDbkMsUUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsV0FBTyxJQUFJLENBQUM7Q0FDZixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMnKTtcclxud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbnJlcXVpcmUoJ2pxdWVyeS11aScpO1xyXG5yZXF1aXJlKCdib290c3RyYXAnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxuXHJcbmNvbnN0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9hcHAvYXV0aDAnKTtcclxuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vanMvYXBwL3VzZXIuanMnKTtcclxuY29uc3QgUm91dGVyID0gcmVxdWlyZSgnLi9qcy9hcHAvUm91dGVyLmpzJyk7XHJcbmNvbnN0IEV2ZW50ZXIgPSByZXF1aXJlKCcuL2pzL2FwcC9FdmVudGVyLmpzJyk7XHJcbmNvbnN0IFBhZ2VGYWN0b3J5ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcycpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDb25maWcgPSByZXF1aXJlKCcuL2pzL2FwcC8vQ29uZmlnLmpzJyk7XHJcbmNvbnN0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XHJcbmNvbnN0IHNoaW1zID0gcmVxdWlyZSgnLi9qcy90b29scy9zaGltcy5qcycpO1xyXG5jb25zdCBBaXJicmFrZUNsaWVudCA9IHJlcXVpcmUoJ2FpcmJyYWtlLWpzJylcclxuY29uc3QgSW50ZWdyYXRpb25zID0gcmVxdWlyZSgnLi9qcy9hcHAvSW50ZWdyYXRpb25zJylcclxuXHJcbmNsYXNzIE1ldGFNYXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuQ29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5Db25maWcuY29uZmlnO1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSB0aGlzLkNvbmZpZy5NZXRhRmlyZTtcclxuICAgICAgICB0aGlzLkV2ZW50ZXIgPSBuZXcgRXZlbnRlcih0aGlzKTtcclxuICAgICAgICB0aGlzLmFpcmJyYWtlID0gbmV3IEFpcmJyYWtlQ2xpZW50KHsgcHJvamVjdElkOiAxMTQ5MDAsIHByb2plY3RLZXk6ICdkYzk2MTFkYjZmNzcxMjBjY2VjZDFhMjczNzQ1YTVhZScgfSk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgUHJvbWlzZS5vblBvc3NpYmx5VW5oYW5kbGVkUmVqZWN0aW9uKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aGF0LmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ29uZmlnLm9uUmVhZHkoKS50aGVuKChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKGNvbmZpZy5hdXRoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dpbigpLnRoZW4oKGF1dGgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlVzZXIgPSBuZXcgVXNlcihwcm9maWxlLCBhdXRoLCB0aGlzLkV2ZW50ZXIsIHRoaXMuTWV0YUZpcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zID0gbmV3IEludGVncmF0aW9ucyh0aGlzLCB0aGlzLlVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlci5vblJlYWR5KCkudGhlbigodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbmV3IFBhZ2VGYWN0b3J5KHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyID0gbmV3IFJvdXRlcih0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb3V0ZXIuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlYnVnKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdC5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKVxyXG4gICAgfVxyXG5cclxuICAgIGxvZyh2YWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVidWcpIHtcclxuICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHZhbCwgJ2V2ZW50JywgJ2xvZycsICdsYWJlbCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmluZm8odmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBlcnJvcih2YWwpIHtcclxuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcih2YWwpO1xyXG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXhjZXB0aW9uJylcclxuICAgICAgICAgICAgdGhpcy5haXJicmFrZS5ub3RpZnkodmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dvdXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbW0gPSBuZXcgTWV0YU1hcCgpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG1tOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgQWN0aW9uIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBfZ2V0QWN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgIGxldCByZXQgPSB0aGlzLl9hY3Rpb25zW2FjdGlvbl07XHJcbiAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgbGV0IE1ldGhvZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHN3aXRjaChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vT3Blbk1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ORVdfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTmV3TWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vQ29weU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ERUxFVEVfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vRGVsZXRlTWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLk1ZX01BUFM6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9NeU1hcHMuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTE9HT1VUOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTG9nb3V0LmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlRFUk1TX0FORF9DT05ESVRJT05TOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vVGVybXMuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuRkVFREJBQ0s6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9GZWVkYmFjaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0hvbWUuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoTWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSBuZXcgTWV0aG9kKHRoaXMubWV0YUZpcmUsIHRoaXMuZXZlbnRlciwgdGhpcy5wYWdlRmFjdG9yeSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3Rpb25zW2FjdGlvbl0gPSByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoYWN0aW9uLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoKTtcclxuICAgICAgICBsZXQgbWV0aG9kID0gdGhpcy5fZ2V0QWN0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmFjdCguLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uOyIsImNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IobWV0YUZpcmUsIGV2ZW50ZXIsIHBhZ2VGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5wYWdlRmFjdG9yeSA9IHBhZ2VGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRvZ2dsZVNpZGViYXIoKSB7XHJcbiAgICAgICAgaWYodGhpcy5zaWRlYmFyT3Blbikge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9wZW5TaWRlYmFyKCkge1xyXG4gICAgICAgIHRoaXMuc2lkZWJhck9wZW4gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsb3NlU2lkZWJhcigpIHtcclxuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uQmFzZTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIENvcHlNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgaWYgKCFpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdNdXN0IGhhdmUgYSBtYXAgaW4gb3JkZXIgdG8gY29weS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigob2xkTWFwKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgb3duZXI6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMuYXBwZW5kQ29weShvbGRNYXAubmFtZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHtpZH1gKS50aGVuKChvbGRNYXBEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHVzaFN0YXRlID0gdGhpcy5tZXRhRmlyZS5wdXNoRGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfWApO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKG9sZE1hcERhdGEsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7bWFwSWR9YCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kQ29weShzdHIpIHtcclxuICAgICAgICBsZXQgcmV0ID0gc3RyO1xyXG4gICAgICAgIGlmICghXy5jb250YWlucyhzdHIsICcoQ29weScpKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHJldCArICcgKENvcHkgMSknO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBtZXNzID0gc3RyLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAyO1xyXG4gICAgICAgICAgICBpZiAobWVzc1ttZXNzLmxlbmd0aCAtIDJdID09ICcoQ29weScpIHtcclxuICAgICAgICAgICAgICAgIGxldCBncmJnID0gbWVzc1ttZXNzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyYmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBncmJnID0gZ3JiZy5yZXBsYWNlKCcpJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNudCA9ICtncmJnICsgMTtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSBtZXNzLnNsaWNlKDAsIG1lc3MubGVuZ3RoIC0gMikuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldCArPSBgIChDb3B5ICR7Y250fSlgO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvcHlNYXA7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNsYXNzIERlbGV0ZU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICBEZWxldGVNYXAuZGVsZXRlQWxsKFtpZF0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkZWxldGVBbGwoaWRzLCBwYXRoID0gQ09OU1RBTlRTLlBBR0VTLkhPTUUpIHtcclxuICAgICAgICBjb25zdCBtZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIF8uZWFjaChpZHMsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbWV0YU1hcC5NZXRhRmlyZS5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7aWR9YCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhTWFwLk1ldGFGaXJlLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIG1ldGFNYXAuUm91dGVyLnRvKHBhdGgpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlbGV0ZU1hcDsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcblxyXG5jbGFzcyBGZWVkYmFjayBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdCgpIHtcclxuICAgICAgICBzdXBlci5hY3QoKTtcclxuICAgICAgICB0aGlzLnVzZXJTbmFwLm9wZW5SZXBvcnRXaW5kb3coKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGZWVkYmFjazsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBob21lID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy9ob21lJyk7XHJcblxyXG5jbGFzcyBIb21lIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLkhPTUUpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnSG9tZScgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNsYXNzIExvZ291dCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwLmxvZ291dCgpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExvZ291dDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBob21lID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy9teS1tYXBzJyk7XHJcblxyXG5jbGFzcyBNeU1hcHMgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuTVlfTUFQUyk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5QQUdFUy5NWV9NQVBTLCB7IGlkOiBpZCB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnTXkgTWFwcycgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15TWFwczsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIE5ld01hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KCk7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19ORVdfTUFQfWApLnRoZW4oKGJsYW5rTWFwKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgb3duZXI6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdVbnRpdGxlZCBNYXAnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcclxuICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke21hcElkfWApO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZXdNYXA7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL3R5cGluZ3MvcmlvdGpzL3Jpb3Rqcy5kLnRzXCIgLz5cclxuXHJcbmNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBtZXRhQ2FudmFzID0gcmVxdWlyZSgnLi4vdGFncy9jYW52YXMvbWV0YS1jYW52YXMuanMnKTtcclxuXHJcbmNsYXNzIE9wZW5NYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChtYXApID0+IHtcclxuICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLk1FVEFfQ0FOVkFTKTtcclxuICAgICAgICAgICAgICAgIG1hcC5pZCA9IGlkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuTkFWLCAnbWFwJywgbWFwLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCBtYXAsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5NQVAsIG1hcCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblNpZGViYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9wZW5NYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgdGVybXMgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL3Rlcm1zJyk7XHJcblxyXG5jbGFzcyBUZXJtcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5URVJNUyk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdUZXJtcyBhbmQgQ29uZGl0aW9ucycgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcm1zOyIsImNvbnN0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9GaXJlYmFzZScpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNvbnN0IGNvbmZpZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IFNJVEVTID0ge1xyXG4gICAgICAgIENSTF9TVEFHSU5HOiB7XHJcbiAgICAgICAgICAgIGRiOiAnbWV0YS1tYXAtc3RhZ2luZydcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmV0ID0ge1xyXG4gICAgICAgIGhvc3Q6IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxyXG4gICAgICAgIHNpdGU6IHt9XHJcbiAgICB9XHJcbiAgICBsZXQgc2VnbWVudHMgPSByZXQuaG9zdC5zcGxpdCgnLicpO1xyXG4gICAgbGV0IGZpcnN0ID0gc2VnbWVudHNbMF07XHJcbiAgICBpZiAoZmlyc3QgPT09ICd3d3cnKSB7XHJcbiAgICAgICAgZmlyc3QgPSBzZWdtZW50c1sxXTtcclxuICAgIH1cclxuICAgIGZpcnN0ID0gZmlyc3Quc3BsaXQoJzonKVswXTtcclxuXHJcbiAgICBzd2l0Y2ggKGZpcnN0LnRvTG93ZXJDYXNlKCkpIHtcclxuXHJcbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcclxuICAgICAgICBjYXNlICdtZXRhLW1hcC1zdGFnaW5nJzpcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTLkNSTF9TVEFHSU5HO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWdzKSB7XHJcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXRlKCkge1xyXG4gICAgICAgIHJldHVybiAnZnJvbnRlbmQnO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLm9uKCdjb25maWcnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ21ldGFtYXAvY2FudmFzJywgKGNhbnZhcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQodGhpcy5jb25maWcuc2l0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuY29uZmlnLnNpdGUudGl0bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmF2aWNvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdmljbycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmF2aWNvLnNldEF0dHJpYnV0ZSgnaHJlZicsIGAke3RoaXMuY29uZmlnLnNpdGUuaW1hZ2VVcmx9ZmF2aWNvbi5pY29gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLmNvbmZpZy5zaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb25maWc7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIEV2ZW50ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICBcclxuICAgICAgICByaW90Lm9ic2VydmFibGUodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRzID0ge31cclxuICAgIH1cclxuXHJcbiAgICBldmVyeShldmVudCwgcmVhY3Rpb24pIHtcclxuICAgICAgICAvL2xldCBjYWxsYmFjayA9IHJlYWN0aW9uO1xyXG4gICAgICAgIC8vaWYgKHRoaXMuZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICAgIC8vICAgIGxldCBwaWdneWJhY2sgPSB0aGlzLmV2ZW50c1tldmVudF07XHJcbiAgICAgICAgLy8gICAgY2FsbGJhY2sgPSAoLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgIHBpZ2d5YmFjayguLi5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgICAgICByZWFjdGlvbiguLi5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgIH1cclxuICAgICAgICAvL31cclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IHJlYWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLm9uKGV2ZW50LCByZWFjdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yZ2V0KGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xyXG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW2V2ZW50XTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRvKGV2ZW50LCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihldmVudCwgLi4ucGFyYW1zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRlcjsiLCJsZXQgRmlyZWJhc2UgPSB3aW5kb3cuRmlyZWJhc2U7XHJcbmxldCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxyXG5sZXQgbG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpXHJcblxyXG5jbGFzcyBNZXRhRmlyZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1ldGFNYXAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tZXRhTWFwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXRhTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuTWV0YU1hcC5BdXRoMC5nZXRTZXNzaW9uKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmNvbmZpZy5zaXRlLmF1dGgwLmFwaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBwcm9maWxlLmlkX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoaXMuZmlyZWJhc2VfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGlzLmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhLCAuLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gdGhpcy5fbG9naW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpbjtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uY2UoJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uKHBhdGgsIGNhbGxiYWNrLCBldmVudCA9ICd2YWx1ZScpIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWV0aG9kID0gKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbmFwc2hvdC5leGlzdHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKGV2ZW50LCBtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyBkYXRhIGF0ICR7cGF0aH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY2hpbGQub24oZXZlbnQsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvZmYocGF0aCwgbWV0aG9kID0gJ3ZhbHVlJywgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVEYXRhKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXREYXRhKG51bGwsIHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2hEYXRhKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnB1c2goZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhSW5UcmFuc2FjdGlvbihkYXRhLCBwYXRoLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQudHJhbnNhY3Rpb24oKGN1cnJlbnRWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVycm9yKGUsIHBhdGgpIHtcclxuICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcih7IG1lc3NhZ2U6IGBQZXJtaXNzaW9uIGRlbmllZCB0byAke3BhdGh9YCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9vblJlYWR5ID0gbnVsbDtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdmaXJlYmFzZV90b2tlbicpO1xyXG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNvbnN0IFR3aWl0ZXIgPSByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvVHdpdHRlcicpO1xyXG5jb25zdCBGYWNlYm9vayA9IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9GYWNlYm9vaycpO1xyXG5cclxuY2xhc3MgSW50ZWdyYXRpb25zIHtcclxuXHJcblx0Y29uc3RydWN0b3IobWV0YU1hcCwgdXNlcikge1xyXG5cdFx0dGhpcy5jb25maWcgPSBtZXRhTWFwLmNvbmZpZztcclxuXHRcdHRoaXMubWV0YU1hcCA9IG1ldGFNYXA7XHJcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xyXG5cdFx0dGhpcy5fZmVhdHVyZXMgPSB7XHJcblx0XHRcdGdvb2dsZTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0dvb2dsZScpLFxyXG5cdFx0XHR1c2Vyc25hcDogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1VzZXJTbmFwJyksXHJcblx0XHRcdGludGVyY29tOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvSW50ZXJjb20nKSxcclxuXHRcdFx0emVuZGVzazogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1plbmRlc2snKSxcclxuXHRcdFx0YWRkdGhpczogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0FkZFRoaXMnKSxcclxuXHRcdFx0bmV3cmVsaWM6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9OZXdSZWxpYycpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0aW5pdCgpIHtcclxuICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChGZWF0dXJlKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGxldCBjb25maWcgPSB0aGlzLmNvbmZpZy5zaXRlW25hbWVdO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXSA9IG5ldyBGZWF0dXJlKGNvbmZpZywgdGhpcy51c2VyKTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0uaW5pdCgpO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5zZXRVc2VyKCk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHRzZXRVc2VyKCkge1xyXG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNldFVzZXIoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRzZW5kRXZlbnQodmFsLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMubWV0YU1hcC5kZWJ1Zykge1xyXG4gICAgICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbbmFtZV0uc2VuZEV2ZW50KHZhbCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHJcblx0fVxyXG5cclxuXHRsb2dvdXQoKSB7XHJcblx0XHRfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0ubG9nb3V0KCk7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlZ3JhdGlvbnM7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL3R5cGluZ3MvcmlvdGpzL3Jpb3Rqcy5kLnRzXCIgLz5cclxuY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBSb3V0ZXIge1xyXG4gICAgY29uc3RydWN0b3IobWV0YU1hcCkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb25zID0gbWV0YU1hcC5JbnRlZ3JhdGlvbnM7XHJcbiAgICAgICAgdGhpcy51c2VyID0gbWV0YU1hcC5Vc2VyO1xyXG4gICAgICAgIHRoaXMuUGFnZUZhY3RvcnkgPSBtZXRhTWFwLlBhZ2VGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IG1ldGFNYXAuRXZlbnRlcjtcclxuICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICByaW90LnJvdXRlLnN0YXJ0KCk7XHJcbiAgICAgICAgcmlvdC5yb3V0ZSgodGFyZ2V0LCBpZCA9ICcnLCBhY3Rpb24gPSAnJywgLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IHRoaXMuZ2V0UGF0aCh0YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50b2dnbGVNYWluKHRydWUsIHRoaXMucGF0aCk7XHJcbiAgICAgICAgICAgIHRoaXMuUGFnZUZhY3RvcnkubmF2aWdhdGUodGhpcy5wYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKCdoaXN0b3J5Jywgd2luZG93LmxvY2F0aW9uLmhhc2gpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG8odGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRQYWdlKCkge1xyXG4gICAgICAgIGxldCBwYWdlID0gd2luZG93LmxvY2F0aW9uLmhhc2ggfHwgJ2hvbWUnO1xyXG4gICAgICAgIGlmICghdGhpcy5pc1RyYWNrZWQocGFnZSkpIHtcclxuICAgICAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmIChwYWdlQ250ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcGFnZSA9IHRoaXMuZ2V0UGF0aCh0aGlzLnVzZXIuaGlzdG9yeVtwYWdlQ250IC0gMV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50UGF0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByZXZpb3VzUGFnZShwYWdlTm8gPSAyKSB7XHJcbiAgICAgICAgbGV0IHBhZ2UgPSAnaG9tZSc7XHJcbiAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBhZ2VDbnQgPiAwKSB7XHJcbiAgICAgICAgICAgIHBhZ2UgPSB0aGlzLmdldFBhdGgodGhpcy51c2VyLmhpc3RvcnlbcGFnZUNudCAtIHBhZ2VOb10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcHJldmlvdXNQYWdlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFByZXZpb3VzUGFnZSgyKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFjayhwYXRoKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbnMudXBkYXRlUGF0aChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVNYWluKGhpZGUsIHBhdGgpIHtcclxuICAgICAgICB0aGlzLnRyYWNrKHBhdGgpO1xyXG4gICAgICAgIGlmIChoaWRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNIaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNIaWRkZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF0aChwYXRoKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHBhdGguc3RhcnRzV2l0aCgnIScpIHx8IHBhdGguc3RhcnRzV2l0aCgnIycpKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgdG8ocGF0aCkge1xyXG4gICAgICAgIHBhdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy50b2dnbGVNYWluKHRydWUsIHBhdGgpO1xyXG4gICAgICAgICAgICByaW90LnJvdXRlKGAke3BhdGh9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJhY2soKSB7XHJcbiAgICAgICAgbGV0IHBhdGggPSAnaG9tZSc7XHJcbiAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBhZ2VDbnQgPiAxICYmICh0aGlzLmN1cnJlbnRQYWdlICE9ICdteW1hcHMnIHx8IHRoaXMuY3VycmVudFBhZ2UgIT0gdGhpcy5wcmV2aW91c1BhZ2UpKSB7XHJcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLnByZXZpb3VzUGFnZTtcclxuICAgICAgICAgICAgbGV0IGJhY2tObyA9IDI7XHJcbiAgICAgICAgICAgIHdoaWxlICghdGhpcy5pc1RyYWNrZWQocGF0aCkgJiYgdGhpcy51c2VyLmhpc3RvcnlbYmFja05vXSkge1xyXG4gICAgICAgICAgICAgICAgYmFja05vICs9IDE7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5nZXRQcmV2aW91c1BhZ2UoYmFja05vKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy50byhwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZG9Ob3RUcmFjaygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2RvTm90VHJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fZG9Ob3RUcmFjayA9IFtDT05TVEFOVFMuQUNUSU9OUy5ERUxFVEVfTUFQLCBDT05TVEFOVFMuQUNUSU9OUy5DT1BZX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuTE9HT1VULCBDT05TVEFOVFMuQUNUSU9OUy5ORVdfTUFQLCBDT05TVEFOVFMuQUNUSU9OUy5GRUVEQkFDS107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9kb05vdFRyYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVHJhY2tlZChwYXRoKSB7XHJcbiAgICAgICAgbGV0IHB0aCA9IHRoaXMuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICByZXR1cm4gXy5hbnkodGhpcy5kb05vdFRyYWNrLCAocCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXB0aC5zdGFydHNXaXRoKHApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJjb25zdCBBdXRoMExvY2sgPSB3aW5kb3cuQXV0aDBMb2NrOyAvL3JlcXVpcmUoJ2F1dGgwLWxvY2snKTtcbmNvbnN0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXG5jbGFzcyBBdXRoMCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIG1ldGFNYXApIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IG1ldGFNYXA7XG4gICAgICAgIHRoaXMubG9jayA9IG5ldyBBdXRoMExvY2soY29uZmlnLmFwaSwgY29uZmlnLmFwcCk7XG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzaG93TG9naW4gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIHByb2ZpbGUsIGlkX3Rva2VuLCBjdG9rZW4sIG9wdCwgcmVmcmVzaF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnaWRfdG9rZW4nLCBpZF90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSBwcm9maWxlLmN0b2tlbiA9IGN0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkX3Rva2VuID0gcHJvZmlsZS5pZF90b2tlbiA9IGlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gcHJvZmlsZS5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRTZXNzaW9uID0gZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TG9naW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gICAgfVxuXG4gICAgbGlua0FjY291bnQoKSB7XG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgIGNhbGxiYWNrVVJMOiBsb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpLFxuICAgICAgICAgICAgZGljdDoge1xuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0xpbmsgd2l0aCBhbm90aGVyIGFjY291bnQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoaXMuY3Rva2VuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRmFpbChlcnIsIHJlamVjdCkge1xuICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyKTtcbiAgICAgICAgaWYgKHJlamVjdCkge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2Vzc2lvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBmdWxmaWxsKHRoaXMucHJvZmlsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGhpcy5fZ2V0U2Vzc2lvbikge1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWRfdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgKGVyciwgcHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkZhaWwoZXJyLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBwcm9maWxlLmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ05vIHNlc3Npb24nKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRTZXNzaW9uO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnaWRfdG9rZW4nKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBudWxsO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuXG5cbiIsImNvbnN0IHV1aWQgPSByZXF1aXJlKCcuLi90b29scy91dWlkLmpzJyk7XHJcbmNvbnN0IENvbW1vbiA9IHJlcXVpcmUoJy4uL3Rvb2xzL0NvbW1vbicpO1xyXG5cclxuY2xhc3MgVXNlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9maWxlLCBhdXRoLCBldmVudGVyLCBtZXRhRmlyZSkge1xyXG4gICAgICAgIHRoaXMuYXV0aCA9IGF1dGg7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XHJcbiAgICAgICAgdGhpcy51c2VyS2V5ID0gdXVpZCgpO1xyXG4gICAgICAgIHRoaXMub25SZWFkeSgpO1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICBsZXQgdHJhY2tIaXN0b3J5ID0gXy5vbmNlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5ldmVyeSgnaGlzdG9yeScsIChwYWdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlzdG9yeS5sZW5ndGggPT0gMCB8fCBwYWdlICE9IHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuc2V0RGF0YSh0aGlzLmhpc3RvcnksIGB1c2Vycy8ke3RoaXMuYXV0aC51aWR9L2hpc3RvcnlgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLm9uKGB1c2Vycy8ke3RoaXMuYXV0aC51aWR9YCwgKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VyLmhpc3RvcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyLmhpc3RvcnkgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHVzZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFja0hpc3RvcnkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwodXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBfaWRlbnRpdHkoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHt9O1xyXG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUgJiYgdGhpcy5wcm9maWxlLmlkZW50aXR5KSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRoaXMucHJvZmlsZS5pZGVudGl0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3JlYXRlZE9uKCkge1xyXG4gICAgICAgIGlmIChudWxsID09IHRoaXMuX2NyZWF0ZWRPbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkuY3JlYXRlZF9hdCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGR0ID0gbmV3IERhdGUodGhpcy5faWRlbnRpdHkuY3JlYXRlZF9hdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVkT24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogZHQsXHJcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IENvbW1vbi5nZXRUaWNrc0Zyb21EYXRlKGR0KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVkT24gfHwgeyBkYXRlOiBudWxsLCB0aWNrczogbnVsbCB9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkaXNwbGF5TmFtZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gdGhpcy5mdWxsTmFtZTtcclxuICAgICAgICBpZiAocmV0KSB7XHJcbiAgICAgICAgICAgIHJldCA9IHJldC5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXJldCAmJiB0aGlzLl9pZGVudGl0eS5uaWNrbmFtZSkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5uaWNrbmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZ1bGxOYW1lKCkge1xyXG4gICAgICAgIGxldCByZXQgPSAnJztcclxuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkubmFtZSkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5uYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBlbWFpbCgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LmVtYWlsKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LmVtYWlsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwaWN0dXJlKCkge1xyXG4gICAgICAgIGxldCByZXQgPSAnJztcclxuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucGljdHVyZSkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5waWN0dXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB1c2VySWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aC51aWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzQWRtaW4oKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5yb2xlcykge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5yb2xlcy5pbmRleE9mKCdhZG1pbicpICE9PSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGlzdG9yeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9maWxlLmhpc3RvcnkgfHwgW107XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZVVzZXJFZGl0b3JPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgdXNlcjoge1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yX29wdGlvbnM6IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXI7IiwiY29uc3QganNQbHVtYiA9IHdpbmRvdy5qc1BsdW1iO1xyXG5jb25zdCBqc1BsdW1iVG9vbGtpdCA9IHdpbmRvdy5qc1BsdW1iVG9vbGtpdDtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5yZXF1aXJlKCcuL2xheW91dCcpXHJcblxyXG5jbGFzcyBDYW52YXMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1hcCwgbWFwSWQpIHtcclxuICAgICAgICB0aGlzLm1hcCA9IG1hcDtcclxuICAgICAgICB0aGlzLm1hcElkID0gbWFwSWQ7XHJcbiAgICAgICAgdGhpcy50b29sa2l0ID0ge307XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcblxyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgY29uc3QgdGhyb3R0bGVTYXZlID0gXy50aHJvdHRsZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMudG9vbGtpdC5leHBvcnREYXRhKCksXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VkX2J5OiB0aGlzLm1ldGFNYXAuVXNlci51c2VyS2V5XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhSW5UcmFuc2FjdGlvbihwb3N0RGF0YSwgYG1hcHMvZGF0YS8ke3RoaXMubWFwSWR9YCk7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHRoaXMubWFwSWQsICdldmVudCcsICdhdXRvc2F2ZScsICdhdXRvc2F2ZScpXHJcbiAgICAgICAgfSwgNTAwKTtcclxuXHJcbiAgICAgICAganNQbHVtYlRvb2xraXQucmVhZHkoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudENvcm5lclxyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cclxuICAgICAgICAgICAgdmFyIHRvb2xraXQgPSB3aW5kb3cudG9vbGtpdCA9IGpzUGx1bWJUb29sa2l0Lm5ld0luc3RhbmNlKHtcclxuICAgICAgICAgICAgICAgIGJlZm9yZVN0YXJ0Q29ubmVjdDpmdW5jdGlvbihmcm9tTm9kZSwgZWRnZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29ybmVyID0gZWRnZVR5cGVcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBlZGdlVHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCB0b05vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvL1ByZXZlbnQgc2VsZi1yZWZlcmVuY2luZyBjb25uZWN0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGZyb21Ob2RlID09IHRvTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0JldHdlZW4gdGhlIHNhbWUgdHdvIG5vZGVzLCBvbmx5IG9uZSBwZXJzcGVjdGl2ZSBjb25uZWN0aW9uIG1heSBleGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goY3VycmVudENvcm5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncGVyc3BlY3RpdmUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGdlcyA9IGZyb21Ob2RlLmdldEVkZ2VzKHsgZmlsdGVyOiBmdW5jdGlvbihlKSB7IHJldHVybiBlLmRhdGEudHlwZSA9PSAncGVyc3BlY3RpdmUnIH19KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkID0gZWRnZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKChlZC5zb3VyY2UgPT0gZnJvbU5vZGUgJiYgZWQudGFyZ2V0ID09IHRvTm9kZSkgfHwgKGVkLnRhcmdldCA9PSBmcm9tTm9kZSAmJiBlZC5zb3VyY2UgPT0gdG9Ob2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIGR1bW15IGZvciBhIG5ldyBub2RlLlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB2YXIgX25ld05vZGUgPSBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlPXR5cGV8fFwiaWRlYVwiXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHc6MTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGg6MTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOlwiaWRlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6dHlwZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIGR1bW15IGZvciBhIG5ldyBwcm94eSAoZHJhZyBoYW5kbGUpXHJcbiAgICAgICAgICAgIHZhciBfbmV3UHJveHkgPSBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSB8fCAncHJveHlQZXJzcGVjdGl2ZSdcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdzoxMCxcclxuICAgICAgICAgICAgICAgICAgICBoOjEwLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6dHlwZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYWluRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanRrLWRlbW8tbWFpblwiKSxcclxuICAgICAgICAgICAgICAgIGNhbnZhc0VsZW1lbnQgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmp0ay1kZW1vLWNhbnZhc1wiKTtcclxuXHJcblxyXG4gICAgICAgICAgICAvL1doZW5ldmVyIGNoYW5naW5nIHRoZSBzZWxlY3Rpb24sIGNsZWFyIHdoYXQgd2FzIHByZXZpb3VzbHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgdmFyIGNsZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sa2l0LmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZihvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnNldFNlbGVjdGlvbihvYmopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjb25maWd1cmUgdGhlIHJlbmRlcmVyXHJcbiAgICAgICAgICAgIHZhciByZW5kZXJlciA9IHRvb2xraXQucmVuZGVyKHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjpjYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0OntcclxuICAgICAgICAgICAgICAgICAgICAvLyBjdXN0b20gbGF5b3V0IGZvciB0aGlzIGFwcC4gc2ltcGxlIGV4dGVuc2lvbiBvZiB0aGUgc3ByaW5nIGxheW91dC5cclxuICAgICAgICAgICAgICAgICAgICB0eXBlOlwibWV0YW1hcFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgaG93IHlvdSBjYW4gYXNzb2NpYXRlIGdyb3VwcyBvZiBub2Rlcy4gSGVyZSwgYmVjYXVzZSBvZiB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHdheSBJIGhhdmUgcmVwcmVzZW50ZWQgdGhlIHJlbGF0aW9uc2hpcCBpbiB0aGUgZGF0YSwgd2UgZWl0aGVyIHJldHVyblxyXG4gICAgICAgICAgICAgICAgLy8gYSBwYXJ0J3MgXCJwYXJlbnRcIiBhcyB0aGUgcG9zc2UsIG9yIGlmIGl0IGlzIG5vdCBhIHBhcnQgdGhlbiB3ZVxyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBub2RlJ3MgaWQuIFRoZXJlIGFyZSBhZGRUb1Bvc3NlIGFuZCByZW1vdmVGcm9tUG9zc2VcclxuICAgICAgICAgICAgICAgIC8vIG1ldGhvZHMgdG9vIChvbiB0aGUgcmVuZGVyZXIsIG5vdCB0aGUgdG9vbGtpdCk7IHRoZXNlIGNhbiBiZSB1c2VkXHJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRyYW5zZmVycmluZyBhIHBhcnQgZnJvbSBvbmUgcGFyZW50IHRvIGFub3RoZXIuXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25Qb3NzZTpmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZGF0YS5wYXJlbnQgfHwgbm9kZS5pZDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB6b29tVG9GaXQ6dHJ1ZSxcclxuICAgICAgICAgICAgICAgIHZpZXc6e1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXA6IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihvYmoubm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uKG9iaikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOlwidG1wbE5vZGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiZGVmYXVsdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwici10aGluZ1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiaWRlYVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTpcInRtcGxEcmFnUHJveHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcnM6IFsnQ29udGludW91cycsICdDZW50ZXInXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVBlcnNwZWN0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwicHJveHlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlbGF0aW9uc2hpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcInByb3h5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYmxjbGljazogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqLm5vZGUuZGF0YS50eXBlID0gJ3ItdGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqLm5vZGUuc2V0VHlwZSgnci10aGluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVXBkYXRpbmcgdGhlIG5vZGUgdHlwZSBkb2VzIG5vdCBzZWVtIHRvIHN0aWNrOyBpbnN0ZWFkLCBjcmVhdGUgYSBuZXcgbm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHJlbmRlcmVyLm1hcEV2ZW50TG9jYXRpb24ob2JqLmUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGdlcyA9IG9iai5ub2RlLmdldEVkZ2VzKClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQudyA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLncgKiAwLjg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQuaCA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLmggKiAwLjg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShqc1BsdW1iLmV4dGVuZChfbmV3Tm9kZShcInItdGhpbmdcIiksIGQpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmUtY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3Rpb25zIG9uIHRoZSBuZXcgbm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxlZGdlcy5sZW5ndGg7IGkrPTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVkZ2VzW2ldLnNvdXJjZSA9PSBvYmoubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5ld05vZGUsIHRhcmdldDplZGdlc1tpXS50YXJnZXQsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZWRnZXNbaV0udGFyZ2V0ID09IG9iai5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6ZWRnZXNbaV0uc291cmNlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RlbGV0ZSB0aGUgcHJveHkgbm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnJlbW92ZU5vZGUob2JqLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZXM6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcDogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihvYmouZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpID09ICdyZWxhdGlvbnNoaXAtb3ZlcmxheScgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihvYmouZWRnZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yczpbXCJDb250aW51b3VzXCIsXCJDb250aW51b3VzXCJdLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3I6W1wiU3RhdGVNYWNoaW5lXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDEuMDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VydmluZXNzOjMwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXJlbGF0aW9uc2hpcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6XCJCbGFua1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheXM6W1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgXCJQbGFpbkFycm93XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aDoxMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJyZWxhdGlvbnNoaXAtb3ZlcmxheVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBQcm94eTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcmVsYXRpb25zaGlwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmU6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludHM6WyBcIkJsYW5rXCIsIFsgXCJEb3RcIiwgeyByYWRpdXM6MTAsIGNzc0NsYXNzOlwib3JhbmdlXCIgfV1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlUHJveHk6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludHM6WyBcIkJsYW5rXCIsIFsgXCJEb3RcIiwgeyByYWRpdXM6MSwgY3NzQ2xhc3M6XCJvcmFuZ2VfcHJveHlcIiB9XV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBldmVudHM6e1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhc0NsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzRGJsQ2xpY2s6ZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYW4gSWRlYSBub2RlIGF0IHRoZSBsb2NhdGlvbiBhdCB3aGljaCB0aGUgZXZlbnQgb2NjdXJyZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSByZW5kZXJlci5tYXBFdmVudExvY2F0aW9uKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL01vdmUgMS8yIHRoZSBoZWlnaHQgYW5kIHdpZHRoIHVwIGFuZCB0byB0aGUgbGVmdCB0byBjZW50ZXIgdGhlIG5vZGUgb24gdGhlIG1vdXNlIGNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogd2hlbiBoZWlnaHQvd2lkdGggaXMgY29uZmlndXJhYmxlLCByZW1vdmUgaGFyZC1jb2RlZCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmxlZnQgPSBwb3MubGVmdC01MFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MudG9wID0gcG9zLnRvcC01MFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoanNQbHVtYi5leHRlbmQoX25ld05vZGUoKSwgcG9zKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBub2RlQWRkZWQ6X3JlZ2lzdGVySGFuZGxlcnMsIC8vIHNlZSBiZWxvd1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VBZGRlZDogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICByZWxheW91dDogZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnREcmFnID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5MZWFkZWRfc3F1YXJlX2ZyYW1lXzFfID4gcGF0aCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChub2RlcywgZnVuY3Rpb24obil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgbi5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgbi5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKG4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubW91c2Vkb3duKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tb3VzZW1vdmUoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RHJhZyA9IHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubW91c2V1cChmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRhcmdldCAhPSB0aGlzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgd2FzRHJhZ2dpbmcgPSBpc0RyYWdnaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAkKCcuanRrLW5vZGUnKS5tb3VzZXVwKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50RHJhZyAhPSB0aGlzKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAkKCcuanRrLW5vZGUnKS5kcmFnZ2FibGUoKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAkKCcuanRrLW5vZGUnKS5kcm9wcGFibGUoe1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgZHJvcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRyYWdPcHRpb25zOntcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6XCIuc2VnbWVudFwiICAgICAgIC8vIGNhbid0IGRyYWcgbm9kZXMgYnkgdGhlIGNvbG9yIHNlZ21lbnRzLlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5pbml0aWFsaXplKHtcclxuICAgICAgICAgICAgc2VsZWN0b3I6IFwiLmRsZ1wiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLyBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4gICAgICAgIC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICBNb3VzZSBoYW5kbGVycy4gU29tZSBhcmUgd2lyZWQgdXA7IGFsbCBsb2cgdGhlIGN1cnJlbnQgbm9kZSBkYXRhIHRvIHRoZSBjb25zb2xlLlxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgIHZhciBfdHlwZXMgPSBbIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiZ3JlZW5cIiwgXCJibHVlXCIsIFwidGV4dFwiIF07XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xpY2tMb2dnZXIgPSBmdW5jdGlvbih0eXBlLCBldmVudCwgZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50ICsgJyAnICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgaWYoZXZlbnQgPT0gJ2RibGNsaWNrJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIF9jbGlja0hhbmRsZXJzID0ge1xyXG4gICAgICAgICAgICAgICAgY2xpY2s6e1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZDpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignUicsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JlZW46ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0cnLCAnY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9yYW5nZTpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignTycsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYmx1ZTpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignQicsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignVCcsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYmxjbGljazp7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdSJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdyZWVuOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdHJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9IG5vZGUuZGF0YS53ICogMC44O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SGVpZ2h0ID0gbm9kZS5kYXRhLmggKiAwLjg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4gPSBub2RlLmRhdGEuY2hpbGRyZW4gfHwgW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdMYWJlbCA9IG5vZGUuZGF0YS5sYWJlbCArIFwiOiBQYXJ0IFwiICsgKG5vZGUuZGF0YS5jaGlsZHJlbi5sZW5ndGgrMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZSh7cGFyZW50Om5vZGUuaWQsdzpuZXdXaWR0aCxoOm5ld0hlaWdodCxsYWJlbDogbmV3TGFiZWx9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmNoaWxkcmVuLnB1c2gobmV3Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbGF5b3V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ08nLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVBlcnNwZWN0aXZlJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bm9kZSwgdGFyZ2V0OnByb3h5Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicGVyc3BlY3RpdmVQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicGVyc3BlY3RpdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBibHVlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdCJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJveHlOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdQcm94eSgncHJveHlSZWxhdGlvbnNoaXAnKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpub2RlLCB0YXJnZXQ6cHJveHlOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignVCcsICdkYmxjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLm5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LkRpYWxvZ3Muc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogXCJkbGdUZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uT0s6IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC51cGRhdGVOb2RlKG5vZGUsIHsgbGFiZWw6ZC50ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6bm9kZS5kYXRhLmxhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciBfY3VycnlIYW5kbGVyID0gZnVuY3Rpb24oZWwsIHNlZ21lbnQsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLlwiICsgc2VnbWVudCk7XHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKF9lbCwgXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NsaWNrSGFuZGxlcnNbXCJjbGlja1wiXVtzZWdtZW50XShlbCwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oX2VsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBfY2xpY2tIYW5kbGVyc1tcImRibGNsaWNrXCJdW3NlZ21lbnRdKGVsLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gc2V0dXAgdGhlIGNsaWNraW5nIGFjdGlvbnMgYW5kIHRoZSBsYWJlbCBkcmFnLiBGb3IgdGhlIGRyYWcgd2UgY3JlYXRlIGFuXHJcbiAgICAgICAgICAgIC8vIGluc3RhbmNlIG9mIGpzUGx1bWIgZm9yIG5vdCBvdGhlciBwdXJwb3NlIHRoYW4gdG8gbWFuYWdlIHRoZSBkcmFnZ2luZyBvZlxyXG4gICAgICAgICAgICAvLyBsYWJlbHMuIFdoZW4gYSBkcmFnIHN0YXJ0cyB3ZSBzZXQgdGhlIHpvb20gb24gdGhhdCBqc1BsdW1iIGluc3RhbmNlIHRvXHJcbiAgICAgICAgICAgIC8vIG1hdGNoIG91ciBjdXJyZW50IHpvb20uXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIHZhciBsYWJlbERyYWdIYW5kbGVyID0ganNQbHVtYi5nZXRJbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBfcmVnaXN0ZXJIYW5kbGVycyhwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGhlcmUgeW91IGhhdmUgcGFyYW1zLmVsLCB0aGUgRE9NIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIC8vIGFuZCBwYXJhbXMubm9kZSwgdGhlIHVuZGVybHlpbmcgbm9kZS4gaXQgaGFzIGEgYGRhdGFgIG1lbWJlciB3aXRoIHRoZSBub2RlJ3MgcGF5bG9hZC5cclxuICAgICAgICAgICAgICAgIHZhciBlbCA9IHBhcmFtcy5lbCwgbm9kZSA9IHBhcmFtcy5ub2RlLCBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3R5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2N1cnJ5SGFuZGxlcihlbCwgX3R5cGVzW2ldLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBsYWJlbCBkcmFnZ2FibGUgKHNlZSBub3RlIGFib3ZlKS5cclxuICAgICAgICAgICAgICAgIGxhYmVsRHJhZ0hhbmRsZXIuZHJhZ2dhYmxlKGxhYmVsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxEcmFnSGFuZGxlci5zZXRab29tKHJlbmRlcmVyLmdldFpvb20oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzdG9wOmZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmxhYmVsUG9zaXRpb24gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChsYWJlbC5zdHlsZS5sZWZ0LCAxMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChsYWJlbC5zdHlsZS50b3AsIDEwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgbGFiZWwgZWRpdGFibGUgdmlhIGEgZGlhbG9nXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGxhYmVsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZGxnVGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25PSzogZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQudXBkYXRlTm9kZShub2RlLCB7IGxhYmVsOmQudGV4dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6bm9kZS5kYXRhLmxhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiBzaG93cyBpbmZvIGluIHdpbmRvdyBvbiBib3R0b20gcmlnaHQuXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9pbmZvKHRleHQpIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgIC8vIGxvYWQgdGhlIGRhdGEuXHJcbiAgICAgICAgICAgIGlmICh0aGF0Lm1hcCAmJiB0aGF0Lm1hcC5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0b29sa2l0LmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGF0Lm1hcC5kYXRhXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9vbGtpdC5sb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6XCJkYXRhLmpzb25cIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyBhIGNvdXBsZSBvZiByYW5kb20gZXhhbXBsZXMgb2YgdGhlIGZpbHRlciBmdW5jdGlvbiwgYWxsb3dpbmcgeW91IHRvIHF1ZXJ5IHlvdXIgZGF0YVxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICB2YXIgY291bnRFZGdlc09mVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b29sa2l0LmZpbHRlcihmdW5jdGlvbihvYmopIHsgcmV0dXJuIG9iai5vYmplY3RUeXBlID09IFwiRWRnZVwiICYmIG9iai5kYXRhLnR5cGU9PT10eXBlOyB9KS5nZXRFZGdlQ291bnQoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgZHVtcEVkZ2VDb3VudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYXJlIFwiICsgY291bnRFZGdlc09mVHlwZShcInJlbGF0aW9uc2hpcFwiKSArIFwiIHJlbGF0aW9uc2hpcCBlZGdlc1wiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYXJlIFwiICsgY291bnRFZGdlc09mVHlwZShcInBlcnNwZWN0aXZlXCIpICsgXCIgcGVyc3BlY3RpdmUgZWRnZXNcIik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0b29sa2l0LmJpbmQoXCJkYXRhVXBkYXRlZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGR1bXBFZGdlQ291bnRzKCk7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IHdpcmUgdXAgYXV0b3NhdmUgaGVyZVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAganNQbHVtYi5vbihcInJlbGF0aW9uc2hpcEVkZ2VEdW1wXCIsIFwiY2xpY2tcIiwgZHVtcEVkZ2VDb3VudHMoKSk7XHJcblxyXG4gICAgICAgICAgICAvL0NUUkwgKyBjbGljayBlbmFibGVzIHRoZSBsYXNzb1xyXG4gICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAnbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRNb2RlKCdzZWxlY3QnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vQ1RSTCArIGNsaWNrIGVuYWJsZXMgdGhlIGxhc3NvXHJcbiAgICAgICAgICAgIGpzUGx1bWIub24oJ2JlZm9yZURyb3AnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRlbGV0ZUFsbCA9IGZ1bmN0aW9uKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RPRE86IGltcGxlbWVudCBsb2dpYyB0byBkZWxldGUgd2hvbGUgZWRnZStwcm94eStlZGdlIHN0cnVjdHVyZVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaEVkZ2UoZnVuY3Rpb24oaSxlKSB7IGNvbnNvbGUubG9nKGUpIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vUmVjdXJzZSBvdmVyIGFsbCBjaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaE5vZGUoZnVuY3Rpb24oaSxuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3Vyc2UgPSBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5vZGUgJiYgbm9kZS5kYXRhLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxub2RlLmRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKz0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gdG9vbGtpdC5nZXROb2RlKG5vZGUuZGF0YS5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9EZWxldGUgY2hpbGRyZW4gYmVmb3JlIHBhcmVudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmVOb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2Uobik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlKHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9tYXAgYmFja3NwYWNlIHRvIGRlbGV0ZSBpZiBhbnl0aGluZyBpcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5dXAnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdG9vbGtpdC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUFsbChzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0NjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdG9vbGtpdC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQWxsKHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzOyIsIi8qKlxuKiBDdXN0b20gbGF5b3V0IGZvciBtZXRhbWFwLiBFeHRlbmRzIHRoZSBTcHJpbmcgbGF5b3V0LiBBZnRlciBTcHJpbmcgcnVucywgdGhpc1xuKiBsYXlvdXQgZmluZHMgJ3BhcnQnIG5vZGVzIGFuZCBhbGlnbnMgdGhlbSB1bmRlcm5lYXRoIHRoZWlyIHBhcmVudHMuIFRoZSBhbGlnbm1lbnRcbiogLSBsZWZ0IG9yIHJpZ2h0IC0gaXMgc2V0IGluIHRoZSBwYXJlbnQgbm9kZSdzIGRhdGEsIGFzIGBwYXJ0QWxpZ25gLlxuKi9cbjsoZnVuY3Rpb24oKSB7XG5cbiAganNQbHVtYlRvb2xraXQuTGF5b3V0c1tcIm1ldGFtYXBcIl0gPSBmdW5jdGlvbigpIHtcbiAgICBqc1BsdW1iVG9vbGtpdC5MYXlvdXRzLlNwcmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIF9vbmVTZXQgPSBmdW5jdGlvbihwYXJlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgdmFyIHBhZGRpbmcgPSBwYXJhbXMucGFydFBhZGRpbmcgfHwgNTA7XG4gICAgICBpZiAocGFyZW50LmRhdGEuY2hpbGRyZW4pIHtcblxuICAgICAgICB2YXIgYyA9IHBhcmVudC5kYXRhLmNoaWxkcmVuLFxuICAgICAgICAgICAgcGFyZW50UG9zID0gdGhpcy5nZXRQb3NpdGlvbihwYXJlbnQuaWQpLFxuICAgICAgICAgICAgcGFyZW50U2l6ZSA9IHRoaXMuZ2V0U2l6ZShwYXJlbnQuaWQpLFxuICAgICAgICAgICAgbWFnbmV0aXplTm9kZXMgPSBbIHBhcmVudC5pZCBdLFxuICAgICAgICAgICAgYWxpZ24gPSAocGFyZW50LmRhdGEucGFydEFsaWduIHx8IFwicmlnaHRcIikgPT09IFwibGVmdFwiID8gMCA6IDEsXG4gICAgICAgICAgICB5ID0gcGFyZW50UG9zWzFdICsgcGFyZW50U2l6ZVsxXSArIHBhZGRpbmc7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYoY1tpXSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkU2l6ZSA9IHRoaXMuZ2V0U2l6ZShjW2ldKSxcbiAgICAgICAgICAgICAgICB4ID0gcGFyZW50UG9zWzBdICsgKGFsaWduICogKHBhcmVudFNpemVbMF0gLSBjaGlsZFNpemVbMF0pKTtcbiAgXG4gICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGNbaV0sIHgsIHksIHRydWUpO1xuICAgICAgICAgICAgbWFnbmV0aXplTm9kZXMucHVzaChjW2ldKTtcbiAgICAgICAgICAgIHkgKz0gKGNoaWxkU2l6ZVsxXSArIHBhZGRpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gc3Rhc2ggb3JpZ2luYWwgZW5kIGNhbGxiYWNrIGFuZCBvdmVycmlkZS4gcGxhY2UgYWxsIFBhcnQgbm9kZXMgd3J0IHRoZWlyXG4gICAgLy8gcGFyZW50cywgdGhlbiBjYWxsIG9yaWdpbmFsIGVuZCBjYWxsYmFjayBhbmQgZmluYWxseSB0ZWxsIHRoZSBsYXlvdXRcbiAgICAvLyB0byBkcmF3IGl0c2VsZiBhZ2Fpbi5cbiAgICB2YXIgX3N1cGVyRW5kID0gdGhpcy5lbmQ7XG4gICAgdGhpcy5lbmQgPSBmdW5jdGlvbih0b29sa2l0LCBwYXJhbXMpIHtcbiAgICAgIHZhciBuYyA9IHRvb2xraXQuZ2V0Tm9kZUNvdW50KCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5jOyBpKyspIHtcbiAgICAgICAgdmFyIG4gPSB0b29sa2l0LmdldE5vZGVBdChpKTtcbiAgICAgICAgLy8gb25seSBwcm9jZXNzIG5vZGVzIHRoYXQgYXJlIG5vdCBQYXJ0IG5vZGVzICh0aGVyZSBjb3VsZCBvZiBjb3Vyc2UgYmVcbiAgICAgICAgLy8gYSBtaWxsaW9uIHdheXMgb2YgZGV0ZXJtaW5pbmcgd2hhdCBpcyBhIFBhcnQgbm9kZS4uLmhlcmUgSSBqdXN0IHVzZVxuICAgICAgICAvLyBhIHJ1ZGltZW50YXJ5IGNvbnN0cnVjdCBpbiB0aGUgZGF0YSlcbiAgICAgICAgaWYgKG4uZGF0YS5wYXJlbnQgPT0gbnVsbCkge1xuICAgICAgICAgIF9vbmVTZXQobiwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3VwZXJFbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gIH07XG5cbn0pKCk7XG4iLCJjb25zdCBBQ1RJT05TID0ge1xyXG4gICAgTUFQOiAnbWFwJyxcclxuICAgIE5FV19NQVA6ICduZXdfbWFwJyxcclxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxyXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxyXG4gICAgSE9NRTogJ2hvbWUnLFxyXG4gICAgTVlfTUFQUzogJ215bWFwcycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcclxuICAgIExPR09VVDogJ2xvZ291dCcsXHJcbiAgICBGRUVEQkFDSzogJ2ZlZWRiYWNrJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShBQ1RJT05TKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQUNUSU9OUzsiLCJjb25zdCBDQU5WQVMgPSB7XHJcbiAgICBMRUZUOiAnbGVmdCcsXHJcbiAgICBSSUdIVDogJ3JpZ2h0J1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShDQU5WQVMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDQU5WQVM7IiwiY29uc3QgQ09OU1RBTlRTID0ge1xyXG5cdEFDVElPTlM6IHJlcXVpcmUoJy4vYWN0aW9ucycpLFxyXG5cdENBTlZBUzogcmVxdWlyZSgnLi9jYW52YXMnKSxcclxuXHREU1JQOiByZXF1aXJlKCcuL2RzcnAnKSxcclxuXHRFRElUX1NUQVRVUzogcmVxdWlyZSgnLi9lZGl0U3RhdHVzJyksXHJcblx0RUxFTUVOVFM6IHJlcXVpcmUoJy4vZWxlbWVudHMnKSxcclxuXHRFVkVOVFM6IHJlcXVpcmUoJy4vZXZlbnRzJyksXHJcblx0UEFHRVM6IHJlcXVpcmUoJy4vcGFnZXMnKSxcclxuXHRST1VURVM6IHJlcXVpcmUoJy4vcm91dGVzJyksXHJcblx0VEFCUzogcmVxdWlyZSgnLi90YWJzJyksXHJcblx0VEFHUzogcmVxdWlyZSgnLi90YWdzJylcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQ09OU1RBTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ09OU1RBTlRTOyIsImNvbnN0IERTUlAgPSB7XHJcblx0RDogJ0QnLFxyXG5cdFM6ICdTJyxcclxuXHRSOiAnUicsXHJcblx0UDogJ1AnXHJcbn1cclxuXHJcbk9iamVjdC5mcmVlemUoRFNSUCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERTUlA7IiwiY29uc3Qgc3RhdHVzID0ge1xyXG4gICAgTEFTVF9VUERBVEVEOiAnJyxcclxuICAgIFJFQURfT05MWTogJ1ZpZXcgb25seScsXHJcbiAgICBTQVZJTkc6ICdTYXZpbmcuLi4nLFxyXG4gICAgU0FWRV9PSzogJ0FsbCBjaGFuZ2VzIHNhdmVkJyxcclxuICAgIFNBVkVfRkFJTEVEOiAnQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQnXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKHN0YXR1cyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXR1czsiLCJjb25zdCBFTEVNRU5UUyA9IHtcclxuICAgIEFQUF9DT05UQUlORVI6ICdhcHAtY29udGFpbmVyJyxcclxuICAgIE1FVEFfUFJPR1JFU1M6ICdtZXRhX3Byb2dyZXNzJyxcclxuICAgIE1FVEFfUFJPR1JFU1NfTkVYVDogJ21ldGFfcHJvZ3Jlc3NfbmV4dCdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoRUxFTUVOVFMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFTEVNRU5UUzsiLCJjb25zdCBFVkVOVFMgPSB7XHJcblx0U0lERUJBUl9PUEVOOiAnc2lkZWJhci1vcGVuJyxcclxuXHRTSURFQkFSX0NMT1NFOiAnc2lkZWJhci1jbG9zZScsXHJcblx0U0lERUJBUl9UT0dHTEU6ICdzaWRlYmFyLXRvZ2dsZScsXHJcblx0UEFHRV9OQU1FOiAncGFnZU5hbWUnLFxyXG5cdE5BVjogJ25hdicsXHJcblx0TUFQOiAnbWFwJ1xyXG59XHJcblxyXG5PYmplY3QuZnJlZXplKEVWRU5UUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVWRU5UUzsiLCJjb25zdCBBQ1RJT05TID0gcmVxdWlyZSgnLi9hY3Rpb25zLmpzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFBBR0VTID0ge1xyXG4gICAgTUFQOiAnbWFwJyxcclxuICAgIE5FV19NQVA6ICduZXdfbWFwJyxcclxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxyXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxyXG4gICAgTVlfTUFQUzogJ215bWFwcycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcclxuICAgIEhPTUU6ICdob21lJ1xyXG59O1xyXG5cclxuXy5leHRlbmQoKVxyXG5cclxuT2JqZWN0LmZyZWV6ZShQQUdFUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBBR0VTOyIsImNvbnN0IFJPVVRFUyA9IHtcclxuICAgIE1BUFNfTElTVDogJ21hcHMvbGlzdC8nLFxyXG4gICAgTUFQU19EQVRBOiAnbWFwcy9kYXRhLycsXHJcbiAgICBNQVBTX05FV19NQVA6ICdtYXBzL25ldy1tYXAvJyxcclxuICAgIFRFUk1TX0FORF9DT05ESVRJT05TOiAnbWV0YW1hcC90ZXJtcy1hbmQtY29uZGl0aW9ucy8nLFxyXG4gICAgSE9NRTogJ21ldGFtYXAvaG9tZS8nXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKFJPVVRFUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJPVVRFUzsiLCJjb25zdCBUQUJTID0ge1xyXG4gICAgVEFCX0lEX1BSRVNFTlRFUiA6ICdwcmVzZW50ZXItdGFiJyxcclxuICAgIFRBQl9JRF9BTkFMWVRJQ1NfTUFQIDogJ2FuYWx5dGljcy10YWItbWFwJyxcclxuICAgIFRBQl9JRF9BTkFMWVRJQ1NfVEhJTkcgOiAnYW5hbHl0aWNzLXRhYi10aGluZycsXHJcbiAgICBUQUJfSURfUEVSU1BFQ1RJVkVTIDogJ3BlcnNwZWN0aXZlcy10YWInLFxyXG4gICAgVEFCX0lEX0RJU1RJTkNUSU9OUyA6ICdkaXN0aW5jdGlvbnMtdGFiJyxcclxuICAgIFRBQl9JRF9BVFRBQ0hNRU5UUyA6ICdhdHRhY2htZW50cy10YWInLFxyXG4gICAgVEFCX0lEX0dFTkVSQVRPUiA6ICdnZW5lcmF0b3ItdGFiJyxcclxuICAgIFRBQl9JRF9TVEFOREFSRFMgOiAnc3RhbmRhcmRzLXRhYidcclxufTtcclxuT2JqZWN0LmZyZWV6ZShUQUJTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVEFCUzsiLCJjb25zdCBUQUdTID0ge1xyXG4gICAgTUVUQV9DQU5WQVM6ICdtZXRhLWNhbnZhcycsXHJcbiAgICBIT01FOiAnaG9tZScsXHJcbiAgICBURVJNUzogJ3Rlcm1zJyxcclxuICAgIE1ZX01BUFM6ICdteS1tYXBzJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShUQUdTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVEFHUzsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBBZGRUaGlzIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcclxuICAgICAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgICAgICAgICAgdCA9IHdpbmRvdy5hZGR0aGlzIHx8IHt9O1xyXG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICAgICAganMuaWQgPSBpZDtcclxuICAgICAgICAgICAganMuc3JjID0gYC8vczcuYWRkdGhpcy5jb20vanMvMzAwL2FkZHRoaXNfd2lkZ2V0LmpzI3B1YmlkPSR7Y29uZmlnLnB1YmlkfWA7XHJcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuXHJcbiAgICAgICAgICAgIHQuX2UgPSBbXTtcclxuICAgICAgICAgICAgdC5yZWFkeSA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgICAgICAgICB0Ll9lLnB1c2goZik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9IChkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJhZGQtdGhpcy1qc1wiKSk7XHJcbiAgICAgICAgdGhpcy5hZGR0aGlzID0gd2luZG93LmFkZHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLmFkZHRoaXMgPSB0aGlzLmFkZHRoaXMgfHwgd2luZG93LmFkZHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWRkVGhpcztcclxuXHJcblxyXG4iLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcbmNvbnN0IEdvb2dsZSA9IHJlcXVpcmUoJy4vZ29vZ2xlJyk7XHJcblxyXG5jbGFzcyBGYWNlYm9vayBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIGpzLnNyYyA9IFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9zZGsuanNcIjtcclxuICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xyXG4gICAgICAgIH0gKGRvY3VtZW50LCAnc2NyaXB0JywgJ2ZhY2Vib29rLWpzc2RrJykpO1xyXG4gICAgICAgIHRoaXMuRkIgPSB3aW5kb3cuRkI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uaW5pdCh7XHJcbiAgICAgICAgICAgIGFwcElkOiB0aGlzLmNvbmZpZy5hcHBpZCxcclxuICAgICAgICAgICAgeGZibWw6IHRoaXMuY29uZmlnLnhmYm1sLFxyXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLmNvbmZpZy52ZXJzaW9uXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uRXZlbnQuc3Vic2NyaWJlKCdlZGdlLmNyZWF0ZScsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5FdmVudC5zdWJzY3JpYmUoJ2VkZ2UucmVtb3ZlJywgZnVuY3Rpb24gKHRhcmdldFVybCkge1xyXG4gICAgICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgnZmFjZWJvb2snLCB0YXJnZXRVcmwpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLkV2ZW50LnN1YnNjcmliZSgnbWVzc2FnZS5zZW5kJywgZnVuY3Rpb24gKHRhcmdldFVybCkge1xyXG4gICAgICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgnZmFjZWJvb2snLCB0YXJnZXRVcmwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5GQiA9IHRoaXMuRkIgfHwgd2luZG93LkZCO1xyXG4gICAgICAgIHJldHVybiB0aGlzLkZCO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmFjZWJvb2s7XHJcblxyXG5cclxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgR29vZ2xlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XHJcbiAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XHJcbiAgICAgIGxldCBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvLCBzKTtcclxuICAgIH0pKCk7XHJcbiAgICAgIFxyXG4gICAgLy9Hb29nbGUgVGFnIE1hbmFnZXIgQVBJXHJcbiAgICAoZnVuY3Rpb24gKHcsIGQsIHMsIGwsIGkpIHtcclxuICAgICAgd1tsXSA9IHdbbF0gfHwgW107IHdbbF0ucHVzaCh7XHJcbiAgICAgICAgJ2d0bS5zdGFydCc6XHJcbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xyXG4gICAgICB9KTsgbGV0IGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxyXG4gICAgICAgICcvL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndG0uanM/aWQ9JyArIGkgKyBkbDsgZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLCBmKTtcclxuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgdGhpcy5jb25maWcudGFnbWFuYWdlcik7XHJcblxyXG4gICAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XHJcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIChpW3JdLnEgPSBpW3JdLnEgfHwgW10pLnB1c2goYXJndW1lbnRzKTtcclxuICAgICAgfSwgaVtyXS5sID0gMSAqIG5ldyBEYXRlKCk7IGEgPSBzLmNyZWF0ZUVsZW1lbnQobyksXHJcbiAgICAgIG0gPSBzLmdldEVsZW1lbnRzQnlUYWdOYW1lKG8pWzBdOyBhLmFzeW5jID0gMTsgYS5zcmMgPSBnO1xyXG4gICAgICBtLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsIG0pO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICB0aGlzLmdhID0gdGhpcy5nYSB8fCB3aW5kb3cuZ2E7XHJcbiAgICByZXR1cm4gdGhpcy5nYTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBzdXBlci5pbml0KCk7XHJcbiAgICBsZXQgbW9kZSA9ICdhdXRvJztcclxuICAgIGxldCBkb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgIGlmKGRvbWFpbi5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xyXG4gICAgICBtb2RlID0gJ25vbmUnO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignY3JlYXRlJywgdGhpcy5jb25maWcuYW5hbHl0aWNzLCBtb2RlKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICB9XHJcblxyXG4gIHNldFVzZXIoKSB7XHJcbiAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCAndXNlcklkJywgdGhpcy51c2VyLnVzZXJJZCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsIG5ldHdvcmssIHR5cGUsIHRhcmdldFVybCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XHJcbiAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgIGlmIChzb3VyY2UgJiYgdHlwZSkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB2YWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgdmFsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsIHtcclxuICAgICAgICAgICAgcGFnZTogcGF0aFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kRXZlbnQoZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKSB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGU7XHJcblxyXG5cclxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgSW50ZXJjb20gZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcblxyXG4gICAgICAgIGxldCBpID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpLmMoYXJndW1lbnRzKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaS5xID0gW107XHJcbiAgICAgICAgaS5jID0gZnVuY3Rpb24gKGFyZ3MpIHtcclxuICAgICAgICAgICAgaS5xLnB1c2goYXJncylcclxuICAgICAgICB9O1xyXG4gICAgICAgIHdpbmRvdy5JbnRlcmNvbSA9IGk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICBzLnNyYyA9IGBodHRwczovL3dpZGdldC5pbnRlcmNvbS5pby93aWRnZXQvJHtjb25maWcuYXBwaWR9fWA7XHJcbiAgICAgICAgICAgIGxldCB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG4gICAgICAgICAgICB4LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHMsIHgpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW50ZXJjb20gPSB3aW5kb3cuSW50ZXJjb207XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuaW50ZXJjb20gPSB0aGlzLmludGVyY29tIHx8IHdpbmRvdy5JbnRlcmNvbTtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcmNvbTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVc2VyKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdib290Jywge1xyXG4gICAgICAgICAgICBhcHBfaWQ6IHRoaXMuY29uZmlnLmFwcGlkLFxyXG4gICAgICAgICAgICBuYW1lOiB0aGlzLnVzZXIuZnVsbE5hbWUsXHJcbiAgICAgICAgICAgIGVtYWlsOiB0aGlzLnVzZXIuZW1haWwsXHJcbiAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHRoaXMudXNlci5jcmVhdGVkT24udGlja3MsXHJcbiAgICAgICAgICAgIHVzZXJfaWQ6IHRoaXMudXNlci51c2VySWRcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNlbmRFdmVudCgndXBkYXRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZEV2ZW50KGV2ZW50ID0gJ3VwZGF0ZScpIHtcclxuICAgICAgICBzdXBlci5zZW5kRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3VwZGF0ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3VwZGF0ZScpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICAgc3VwZXIubG9nb3V0KCk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2h1dGRvd24nKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjb207IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgTmV3UmVsaWMgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcblxyXG4gICAgICAgIHRoaXMuTmV3UmVsaWMgPSB3aW5kb3cuTlJFVU07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuTmV3UmVsaWMgPSB0aGlzLk5ld1JlbGljIHx8IHdpbmRvdy5OUkVVTTtcclxuICAgICAgICByZXR1cm4gdGhpcy5OZXdSZWxpYztcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVc2VyKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgICAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmludGVncmF0aW9uLnNldEN1c3RvbUF0dHJpYnV0ZSgndXNlcm5hbWUnLCB0aGlzLnVzZXIuZW1haWwpO1xyXG4gICAgICAgICAgICB0aGlzLmludGVncmF0aW9uLnNldEN1c3RvbUF0dHJpYnV0ZSgnYWNjY291bnRJRCcsIHRoaXMudXNlci51c2VySWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XHJcbiAgICAgICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5hZGRUb1RyYWNlKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRQYWdlVmlld05hbWUocGF0aCwgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZXdSZWxpYztcclxuXHJcblxyXG4iLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcbmNvbnN0IEdvb2dsZSA9IHJlcXVpcmUoJy4vZ29vZ2xlJyk7XHJcblxyXG5jbGFzcyBUd2l0dGVyIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcclxuICAgICAgICAgICAgbGV0IGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgICAgICAgICAgdCA9IHdpbmRvdy50d3R0ciB8fCB7fTtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcclxuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIGpzLnNyYyA9IFwiaHR0cHM6Ly9wbGF0Zm9ybS50d2l0dGVyLmNvbS93aWRnZXRzLmpzXCI7XHJcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuXHJcbiAgICAgICAgICAgIHQuX2UgPSBbXTtcclxuICAgICAgICAgICAgdC5yZWFkeSA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgICAgICAgICB0Ll9lLnB1c2goZik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9IChkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJ0d2l0dGVyLXdqc1wiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5yZWFkeSgodHdpdHRlcikgPT4ge1xyXG4gICAgICAgICAgICB0d2l0dGVyLndpZGdldHMubG9hZCgpO1xyXG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdjbGljaycsIHRoaXMuX2NsaWNrRXZlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ3R3ZWV0JywgdGhpcy5fdHdlZXRJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ3JldHdlZXQnLCB0aGlzLl9yZXR3ZWV0SW50ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdmYXZvcml0ZScsIHRoaXMuX2ZhdkludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnZm9sbG93JywgdGhpcy5fZm9sbG93SW50ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgdHJ5Q291bnQgPSAwO1xyXG4gICAgICAgIGxldCBsb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LnR3dHRyICYmIHdpbmRvdy50d3R0ci53aWRnZXRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnR3dHRyLndpZGdldHMubG9hZCgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRyeUNvdW50IDwgNSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5Q291bnQgKz0gMTtcclxuICAgICAgICAgICAgICAgIF8uZGVsYXkobG9hZCwgMjUwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy50d3R0ciA9IHRoaXMudHd0dHIgfHwgd2luZG93LnR3dHRyO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnR3dHRyO1xyXG4gICAgfVxyXG5cclxuICAgIF9mb2xsb3dJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcclxuICAgICAgICBsZXQgbGFiZWwgPSBpbnRlbnRFdmVudC5kYXRhLnVzZXJfaWQgKyBcIiAoXCIgKyBpbnRlbnRFdmVudC5kYXRhLnNjcmVlbl9uYW1lICsgXCIpXCI7XHJcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3JldHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcclxuICAgICAgICBsZXQgbGFiZWwgPSBpbnRlbnRFdmVudC5kYXRhLnNvdXJjZV90d2VldF9pZDtcclxuICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgndHdpdHRlcicsIGxhYmVsLCBpbnRlbnRFdmVudC50eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBfZmF2SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgICAgICB0aGlzLl90d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBfdHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcclxuICAgICAgICBsZXQgbGFiZWwgPSBcInR3ZWV0XCI7XHJcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XHJcbiAgICB9XHJcbiAgICBfY2xpY2tFdmVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGludGVudEV2ZW50LnJlZ2lvbjtcclxuICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgndHdpdHRlcicsIGxhYmVsLCBpbnRlbnRFdmVudC50eXBlKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUd2l0dGVyO1xyXG5cclxuXHJcbiIsIlxyXG5jb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcbmNvbnN0IEdvb2dsZSA9IHJlcXVpcmUoJy4vZ29vZ2xlJyk7XHJcblxyXG5jbGFzcyBVc2VyU25hcCBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICBsZXQgYXBpS2V5LCBzLCB4O1xyXG4gICAgICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25maWcgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXBpS2V5ID0gY29uZmlnLmFwaTtcclxuICAgICAgICBpZiAoYXBpS2V5ICYmICF3aW5kb3cubG9jYXRpb24uaG9zdC5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xyXG4gICAgICAgICAgICBsZXQgdXNDb25mID0ge1xyXG4gICAgICAgICAgICAgICAgZW1haWxCb3g6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWFpbEJveFZhbHVlOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgZW1haWxSZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbnNvbGVSZWNvcmRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1vZGU6ICdyZXBvcnQnLFxyXG4gICAgICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR29vZ2xlLnNlbmRFdmVudCgnZmVlZGJhY2snLCAndXNlcnNuYXAnLCAnd2lkZ2V0Jywgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3aW5kb3cudXNlcnNuYXBjb25maWcgPSB3aW5kb3cuX3VzZXJzbmFwY29uZmlnID0gdXNDb25mO1xyXG5cclxuICAgICAgICAgICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICBzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuICAgICAgICAgICAgcy5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgICAgIHMuc3JjID0gJy8vYXBpLnVzZXJzbmFwLmNvbS9sb2FkLycgKyBhcGlLZXkgKyAnLmpzJztcclxuICAgICAgICAgICAgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XHJcbiAgICAgICAgICAgIHguYXBwZW5kQ2hpbGQocyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB3aW5kb3cuVXNlclNuYXA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB0aGlzLnVzZXJTbmFwIHx8IHdpbmRvdy5Vc2VyU25hcDtcclxuICAgICAgICByZXR1cm4gdGhpcy51c2VyU25hcDtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVc2VyKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJTbmFwOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIFplbkRlc2sgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgbGV0IHpPID0ge307XHJcbiAgICAgICAgd2luZG93LnpFbWJlZCB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChlLCB0KSB7XHJcbiAgICAgICAgICAgIGxldCBuLCBvLCBkLCBpLCBzLCBhID0gW10sIHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpOyB3aW5kb3cuekVtYmVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYS5wdXNoKGFyZ3VtZW50cylcclxuICAgICAgICAgICAgfSwgd2luZG93LnpFID0gd2luZG93LnpFIHx8IHdpbmRvdy56RW1iZWQsIHIuc3JjID0gXCJqYXZhc2NyaXB0OmZhbHNlXCIsIHIudGl0bGUgPSBcIlwiLCByLnJvbGUgPSBcInByZXNlbnRhdGlvblwiLCAoci5mcmFtZUVsZW1lbnQgfHwgcikuc3R5bGUuY3NzVGV4dCA9IFwiZGlzcGxheTogbm9uZVwiLCBkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIiksIGQgPSBkW2QubGVuZ3RoIC0gMV0sIGQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUociwgZCksIGkgPSByLmNvbnRlbnRXaW5kb3csIHMgPSBpLmRvY3VtZW50O1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbyA9IHNcclxuICAgICAgICAgICAgfSBjYXRjaCAoYykge1xyXG4gICAgICAgICAgICAgICAgbiA9IGRvY3VtZW50LmRvbWFpbiwgci5zcmMgPSAnamF2YXNjcmlwdDpsZXQgZD1kb2N1bWVudC5vcGVuKCk7ZC5kb21haW49XCInICsgbiArICdcIjt2b2lkKDApOycsIG8gPSBzXHJcbiAgICAgICAgICAgIH0gby5vcGVuKCkuX2wgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbyA9IHRoaXMuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTsgbiAmJiAodGhpcy5kb21haW4gPSBuKSwgby5pZCA9IFwianMtaWZyYW1lLWFzeW5jXCIsIG8uc3JjID0gZSwgdGhpcy50ID0gK25ldyBEYXRlLCB0aGlzLnplbmRlc2tIb3N0ID0gdCwgdGhpcy56RVF1ZXVlID0gYSwgdGhpcy5ib2R5LmFwcGVuZENoaWxkKG8pXHJcbiAgICAgICAgICAgICAgICB6Ty5sb2dpYyA9IHdpbmRvdy56RTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgby53cml0ZSgnPGJvZHkgb25sb2FkPVwiZG9jdW1lbnQuX2woKTtcIj4nKSxcclxuICAgICAgICAgICAgby5jbG9zZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICAoXCJodHRwczovL2Fzc2V0cy56ZW5kZXNrLmNvbS9lbWJlZGRhYmxlX2ZyYW1ld29yay9tYWluLmpzXCIsIGNvbmZpZy5zaXRlKTtcclxuXHJcbiAgICAgICAgek8ud2lkZ2V0ID0gd2luZG93LnpFbWJlZDtcclxuICAgICAgICB6Ty5sb2dpYyA9IHdpbmRvdy56RTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93LnpFO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFVzZXIoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0VXNlcigpO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmludGVncmF0aW9uLmlkZW50aWZ5KHsgbmFtZTogdGhpcy51c2VyLmZ1bGxOYW1lLCBlbWFpbDogdGhpcy51c2VyLmVtYWlsIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY29uc3QgemVuRGVzayA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuXHJcbiAgICByZXR1cm4gek87XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFplbkRlc2s7IiwiY2xhc3MgSW50ZWdyYXRpb25zQmFzZSB7XHJcblx0Y29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcblx0XHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuXHRcdHRoaXMudXNlciA9IHVzZXI7XHJcblx0fVxyXG5cdFxyXG5cdGluaXQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0Z2V0IGludGVncmF0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHt9O1xyXG5cdH1cclxuXHRcclxuXHRzZXRVc2VyKCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdHNlbmRFdmVudCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHR1cGRhdGVQYXRoKCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdGxvZ291dCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlZ3JhdGlvbnNCYXNlOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIEdvb2dsZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgbGV0IHBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IHBvLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JzsgcG8uYXN5bmMgPSB0cnVlO1xyXG4gICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xyXG4gICAgICBsZXQgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XHJcbiAgICB9KSgpO1xyXG4gICAgICBcclxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxyXG4gICAgKGZ1bmN0aW9uICh3LCBkLCBzLCBsLCBpKSB7XHJcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xyXG4gICAgICAgICdndG0uc3RhcnQnOlxyXG4gICAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCBldmVudDogJ2d0bS5qcydcclxuICAgICAgfSk7IGxldCBmID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cclxuICAgICAgICAnLy93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RtLmpzP2lkPScgKyBpICsgZGw7IGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJ2RhdGFMYXllcicsIHRoaXMuY29uZmlnLnRhZ21hbmFnZXIpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoaSwgcywgbywgZywgciwgYSwgbSkge1xyXG4gICAgICBpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXSA9IHI7IGlbcl0gPSBpW3JdIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAoaVtyXS5xID0gaVtyXS5xIHx8IFtdKS5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgIH0sIGlbcl0ubCA9IDEgKiBuZXcgRGF0ZSgpOyBhID0gcy5jcmVhdGVFbGVtZW50KG8pLFxyXG4gICAgICBtID0gcy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTsgYS5hc3luYyA9IDE7IGEuc3JjID0gZztcclxuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcclxuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzJywgJ2dhJyk7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgdGhpcy5nYSA9IHRoaXMuZ2EgfHwgd2luZG93LmdhO1xyXG4gICAgcmV0dXJuIHRoaXMuZ2E7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgbGV0IG1vZGUgPSAnYXV0byc7XHJcbiAgICBsZXQgZG9tYWluID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICBpZihkb21haW4uc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcclxuICAgICAgbW9kZSA9ICdub25lJztcclxuICAgIH1cclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ2NyZWF0ZScsIHRoaXMuY29uZmlnLmFuYWx5dGljcywgbW9kZSk7XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyKCkge1xyXG4gICAgc3VwZXIuc2V0VXNlcigpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0JywgJ3VzZXJJZCcsIHRoaXMudXNlci51c2VySWQpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRTb2NpYWwobmV0d29yaywgdGFyZ2V0VXJsLCB0eXBlID0gJ3NlbmQnKSB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCBuZXR3b3JrLCB0eXBlLCB0YXJnZXRVcmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xyXG4gICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XHJcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICBpZiAoc291cmNlICYmIHR5cGUpIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdmFsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHZhbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgdXBkYXRlUGF0aChwYXRoKSB7XHJcbiAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCB7XHJcbiAgICAgICAgICAgIHBhZ2U6IHBhdGhcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZEV2ZW50KGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCkge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB1cmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR29vZ2xlO1xyXG5cclxuXHJcbiIsImNvbnN0IHJpb3QgPSB3aW5kb3cucmlvdDtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgcGFnZUJvZHkgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2UtYm9keS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IEFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FjdGlvbi5qcycpO1xyXG5cclxuY2xhc3MgUGFnZUZhY3Rvcnkge1xyXG4gICAgY29uc3RydWN0b3IoZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBuZXcgQWN0aW9ucyhtZXRhRmlyZSwgZXZlbnRlciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTfWApLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudCgnKicpO1xyXG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmNvbmZpZ3VyZSh7IHBhcmVudDogYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTX05FWFR9YCB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0KCk7IC8vIGluaXQgbWV0cm9uaWMgY29yZSBjb21wb25ldHNcclxuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdCgpOyAvLyBpbml0IGxheW91dFxyXG4gICAgICAgICAgICAgICAgICAgIERlbW8uaW5pdCgpOyAvLyBpbml0IGRlbW8gZmVhdHVyZXNcclxuICAgICAgICAgICAgICAgICAgICBJbmRleC5pbml0KCk7IC8vIGluaXQgaW5kZXggcGFnZVxyXG4gICAgICAgICAgICAgICAgICAgIFRhc2tzLmluaXREYXNoYm9hcmRXaWRnZXQoKTsgLy8gaW5pdCB0YXNoIGRhc2hib2FyZCB3aWRnZXRcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgbmF2aWdhdGUocGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgbGV0IGFjdCA9IHRoaXMuYWN0aW9ucy5hY3QocGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcclxuICAgICAgICBpZiAoIWFjdCkge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8ocGF0aCwgcGF0aCwgeyBpZDogaWQsIGFjdGlvbjogYWN0aW9uIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2VGYWN0b3J5OyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IENhbnZhcyA9IHJlcXVpcmUoJy4uLy4uL2NhbnZhcy9jYW52YXMnKTtcclxuY29uc3QgZDMgPSByZXF1aXJlKCdkMycpXHJcbnJlcXVpcmUoJy4vbm9kZScpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodCBqdGstZGVtby1tYWluXCIgc3R5bGU9XCJwYWRkaW5nOiAwOyBcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJqdGstZGVtby1jYW52YXMgY2FudmFzLXdpZGVcIiBpZD1cImRpYWdyYW1cIj5cclxuXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtZXRhLWNhbnZhcycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMubWFwSWQgPSBudWxsO1xyXG4gICAgdGhpcy5jYW52YXMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuYnVpbGRDYW52YXMgPSAobWFwKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhbnZhcykge1xyXG4gICAgICAgICAgICAkKHRoaXMuZGlhZ3JhbSkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICQodGhpcy5kaWFncmFtKS53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gICQodGhpcy5kaWFncmFtKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB4TG9jID0gd2lkdGgvMiAtIDI1LFxyXG4gICAgICAgICAgICAgICAgeUxvYyA9IDEwMDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbmV3IENhbnZhcyhtYXAsIHRoaXMubWFwSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG1hcC5jaGFuZ2VkX2J5ICE9IE1ldGFNYXAuVXNlci51c2VyS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkID0gKG9wdHMpID0+IHtcclxuICAgICAgICBpZiAob3B0cy5pZCAhPSB0aGlzLm1hcElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYG1hcHMvZGF0YS8ke3RoaXMubWFwSWR9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XHJcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWFwcy9kYXRhLyR7b3B0cy5pZH1gLCB0aGlzLmJ1aWxkQ2FudmFzKTtcclxuICAgICAgICAgICAgTWV0YU1hcC5FdmVudGVyLmZvcmdldCgnbWFwJywgdGhpcy5idWlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgnbWFwJywgdGhpcy5idWlsZCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0SGVpZ2h0ID0gKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5kaWFncmFtKS5jc3Moe1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCArICdweCdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJyk7XHJcbmNvbnN0IGQzID0gcmVxdWlyZSgnZDMnKVxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuYFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbm9kZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuY29uc3QgUHMgPSByZXF1aXJlKCdwZXJmZWN0LXNjcm9sbGJhcicpO1xyXG5cclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhci13cmFwcGVyXCIgc3R5bGU9XCJ7IGdldERpc3BsYXkoKSB9XCI+XHJcbiAgICA8ZGl2IGlkPVwiY2hhdF9zaGVsbFwiIGNsYXNzPVwicGFnZS1zaWRlYmFyIHBhbmVsXCIgZGF0YS1rZWVwLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWF1dG8tc2Nyb2xsPVwidHJ1ZVwiIGRhdGEtc2xpZGUtc3BlZWQ9XCIyMDBcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiYm90X3RpdGxlXCIgY2xhc3M9XCJwYW5lbC10aXRsZSBjaGF0LXdlbGNvbWVcIj5Db3J0ZXggTWFuPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZD1cImNoYXRfYm9keVwiIGNsYXNzPVwicGFuZWwtYm9keVwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiPlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJtZWRpYS1saXN0IGV4YW1wbGUtY2hhdC1tZXNzYWdlc1wiIGlkPVwiZXhhbXBsZS1tZXNzYWdlc1wiPlxyXG4gICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lc3NhZ2VzIH1cIiBjbGFzcz1cIm1lZGlhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInB1bGwteyBsZWZ0OiBhdXRob3IgPT0gJ2NvcnRleCcsIHJpZ2h0OiBhdXRob3IgIT0gJ2NvcnRleCcgfVwiIGhyZWY9XCIjXCI+PGltZyBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cIm1lZGlhLW9iamVjdCBpbWctY2lyY2xlXCIgc3JjPVwieyBwaWN0dXJlIH1cIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keSBidWJibGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IG1lc3NhZ2UgfVwiPjwvcmF3PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz1cInRleHQtbXV0ZWRcIj48YnI+eyBwYXJlbnQuZ2V0UmVsYXRpdmVUaW1lKHRpbWUpIH08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtZm9vdGVyXCIgc3R5bGU9XCJwb3NpdGlvbjogZml4ZWQ7IHdpZHRoOiAyMzNweDsgYm90dG9tOiAyNnB4O1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJjaGF0X2lucHV0X2Zvcm1cIiBvbnN1Ym1pdD1cInsgb25TdWJtaXQgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNoYXRfaW5wdXRcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBtZXNzYWdlLi4uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYmx1ZVwiIHR5cGU9XCJzdWJtaXRcIj5TZW5kPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYFxyXG5cclxucmlvdC50YWcoJ2NoYXQnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIHRoaXMuY29ydGV4UGljdHVyZSA9ICdzcmMvaW1hZ2VzL2NvcnRleC1hdmF0YXItc21hbGwuanBnJztcclxuICAgIHRoaXMubWVzc2FnZXMgPSBbe1xyXG4gICAgICAgIG1lc3NhZ2U6IGBIZWxsbywgSSdtIENvcnRleCBNYW4uIEFzayBtZSBhbnl0aGluZy4gVHJ5IDxjb2RlPi9oZWxwPC9jb2RlPiBpZiB5b3UgZ2V0IGxvc3QuYCxcclxuICAgICAgICBhdXRob3I6ICdjb3J0ZXgnLFxyXG4gICAgICAgIHBpY3R1cmU6IHRoaXMuY29ydGV4UGljdHVyZSxcclxuICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpXHJcbiAgICB9XTtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmNoYXRfc2hlbGwuc3R5bGUuaGVpZ2h0ID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCkgKyAncHgnXHJcbiAgICAgICAgdGhpcy5jaGF0X2JvZHkuc3R5bGUuaGVpZ2h0ID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDI2NykgKyAncHgnXHJcbiAgICAgICAgUHMudXBkYXRlKHRoaXMuY2hhdF9ib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIFBzLmluaXRpYWxpemUodGhpcy5jaGF0X2JvZHkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0UmVsYXRpdmVUaW1lID0gKGRhdGUgPSBuZXcgRGF0ZSgpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblN1Ym1pdCA9IChvYmopID0+IHtcclxuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmNoYXRfaW5wdXQudmFsdWUsXHJcbiAgICAgICAgICAgIGF1dGhvcjogTWV0YU1hcC5Vc2VyLnVzZXJOYW1lLFxyXG4gICAgICAgICAgICBwaWN0dXJlOiBNZXRhTWFwLlVzZXIucGljdHVyZSxcclxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFlvdSBhc2tlZCBtZSAke3RoaXMuY2hhdF9pbnB1dC52YWx1ZX0uIFRoYXQncyBncmVhdCFgLFxyXG4gICAgICAgICAgICBhdXRob3I6ICdjb3J0ZXgnLFxyXG4gICAgICAgICAgICBwaWN0dXJlOiB0aGlzLmNvcnRleFBpY3R1cmUsXHJcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuY2hhdF9pbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLmNoYXRfYm9keS5zY3JvbGxUb3AgPSB0aGlzLmNoYXRfYm9keS5zY3JvbGxIZWlnaHRcclxuICAgICAgICBQcy51cGRhdGUodGhpcy5jaGF0X2JvZHkpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2dnbGUgPSAoc3RhdGUpID0+IHtcclxuICAgICAgICB0aGlzLmRpc3BsYXkgPSBzdGF0ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICBNZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTilcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2dnbGUodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ncmFkdWF0aW9uLWNhcFwiPjwvaT5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjcwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBoZWxwIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBoZWxwIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtaGVscCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgdGhpcy5oZWxwID0gbnVsbDtcclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvaGVscCcsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVscCA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1iZWxsLW9cIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbm90aWZpY2F0aW9ucy5sZW5ndGggfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJib2xkXCI+eyBub3RpZmljYXRpb25zLmxlbmd0aCB9IHBlbmRpbmc8L3NwYW4+IG5vdGlmaWNhdGlvbnsgczogbm90aWZpY2F0aW9ucy5sZW5ndGggPT0gMCB8fCBub3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+dmlldyBhbGw8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNTBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgbm90aWZpY2F0aW9ucyB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBub3RpZmljYXRpb25zIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZVwiPnsgdGltZSB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRldGFpbHNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBldmVudCB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtbm90aWZpY2F0aW9ucycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBbXTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9ub3RpZmljYXRpb25zJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBwb2ludHMubGVuZ3RoIH1cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3MgPVwiYm9sZFwiPnsgcG9pbnRzLmxlbmd0aCB9IG5ldyA8L3NwYW4+IGFjaGlldmVtZW50eyBzOiBwb2ludHMubGVuZ3RoID09IDAgfHwgcG9pbnRzLmxlbmd0aCA+IDEgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+dmlldyBhbGw8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNTBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgcG9pbnRzIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IHBvaW50cyB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVcIj57IHRpbWUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkZXRhaWxzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxhYmVsIGxhYmVsLXNtIGxhYmVsLWljb24gbGFiZWwtc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZXZlbnQgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuYDtcclxuXHJcbnJpb3QudGFnKCdtZXRhLXBvaW50cycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIHRoaXMucG9pbnRzID0gW107XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGB1c2Vycy8ke01ldGFNYXAuVXNlci51c2VySWR9L3BvaW50c2AsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVzZXJuYW1lIHVzZXJuYW1lLWhpZGUtb24tbW9iaWxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlcm5hbWUgfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGlmPVwieyBwaWN0dXJlIH1cIiBhbHQ9XCJcIiBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCJ7IHBpY3R1cmUgfVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgbWVudSB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgbWVudSB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyBsaW5rIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS11c2VyJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMubWVudSA9IFtdO1xyXG4gICAgdGhpcy51c2VybmFtZSA9ICcnO1xyXG4gICAgdGhpcy5waWN0dXJlID0gJyc7XHJcblxyXG4gICAgdGhpcy5sb2dvdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5sb2dvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxpbmtBY2NvdW50ID0gKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuQXV0aDAubGlua0FjY291bnQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIHN3aXRjaChldmVudC5pdGVtLmxpbmspIHtcclxuICAgICAgICAgICAgY2FzZSAnI2xpbmstc29jaWFsLWFjY291bnRzJzpcclxuICAgICAgICAgICAgICAgIHRoaXMubGlua0FjY291bnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWV0YW1hcC91c2VyYCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IE1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZTtcclxuICAgICAgICAgICAgdGhpcy5waWN0dXJlID0gTWV0YU1hcC5Vc2VyLnBpY3R1cmU7XHJcbiAgICAgICAgICAgIHRoaXMubWVudSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxucmVxdWlyZSgnLi4vdG9vbHMvc2hpbXMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWFjdGlvbnNcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biByZWQtaGF6ZSBidG4tc20gZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImhpZGRlbi1zbSBoaWRkZW4teHNcIj5BY3Rpb25zJm5ic3A7PC9zcGFuPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XHJcbiAgICAgICAgICAgIDxsaSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YSB9XCIgY2xhc3M9XCJ7IHN0YXJ0OiBpID09IDAsIGFjdGl2ZTogaSA9PSAwIH1cIj5cclxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBwYXJlbnQuZ2V0TGlua0FsbG93ZWQodmFsKSB9XCIgaHJlZj1cInsgcGFyZW50LmdldEFjdGlvbkxpbmsodmFsKSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIj48L2k+IHsgdmFsLnRpdGxlIH1cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+XHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjc2V0dGluZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdlYXJcIj48L2k+IFNldHRpbmdzXHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxzcGFuIHN0eWxlPVwicGFkZGluZy1sZWZ0OiA1cHg7XCI+XHJcbiAgICAgICAgPHNwYW4gaWY9XCJ7IHBhZ2VOYW1lIH1cIlxyXG4gICAgICAgICAgICAgICAgaWQ9XCJtYXBfbmFtZVwiXHJcbiAgICAgICAgICAgICAgICBkYXRhLXR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgIGRhdGEtdGl0bGU9XCJFbnRlciBtYXAgbmFtZVwiPlxyXG4gICAgICAgICAgICB7IHBhZ2VOYW1lIH1cclxuICAgICAgICA8L3NwYW4+XHJcbiAgICA8L3NwYW4+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1hY3Rpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy5wYWdlTmFtZSA9ICdIb21lJztcclxuICAgIHRoaXMudXJsID0gTWV0YU1hcC5jb25maWcuc2l0ZS5kYiArICcuZmlyZWJhc2Vpby5jb20nO1xyXG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmdldEFjdGlvbkxpbmsgPSAob2JqKSA9PiB7XHJcbiAgICAgICAgbGV0IHJldCA9IG9iai5saW5rO1xyXG4gICAgICAgIGlmIChvYmoudXJsX3BhcmFtcykge1xyXG4gICAgICAgICAgICBsZXQgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICBfLmVhY2gob2JqLnVybF9wYXJhbXMsIChwcm0pID0+IHtcclxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzW3BybS5uYW1lXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXQgPSBvYmoubGluay5mb3JtYXQuY2FsbChvYmoubGluaywgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRMaW5rQWxsb3dlZCA9IChvYmopID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gdHJ1ZSA9PSBvYmpbJ2FsbG93ZWQtb24nXVsnKiddO1xyXG4gICAgICAgIGlmICghcmV0KSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50UGFnZSA9IE1ldGFNYXAuUm91dGVyLmN1cnJlbnRQYXRoO1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlID09IG9ialsnYWxsb3dlZC1vbiddW2N1cnJlbnRQYWdlXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJpbmRUb3BhZ2VOYW1lID0gXy5vbmNlKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke3RoaXMubWFwSWR9L25hbWVgLCAobmFtZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG5hbWUgfHwgJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubG9hZGVkKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5tYXBfbmFtZSkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH0vbmFtZWApO1xyXG4gICAgICAgICAgICBpZiAob3B0cy5pZCkge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHtvcHRzLmlkfS9uYW1lYCwgKG5hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG9wdHMubmFtZSB8fCAnSG9tZSc7XHJcbiAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICAkKHRoaXMubWFwX25hbWUpLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YShwYXJhbXMubmV3VmFsdWUsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke3RoaXMubWFwSWR9L25hbWVgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYmluZFRvcGFnZU5hbWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2FjdGlvbnMnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBwYWdlSGVhZGVyID0gcmVxdWlyZSgnLi9wYWdlLWhlYWRlcicpO1xyXG5jb25zdCBwYWdlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRhaW5lcicpO1xyXG5jb25zdCBwYWdlRm9vdGVyID0gcmVxdWlyZSgnLi9wYWdlLWZvb3RlcicpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwicGFnZV9ib2R5XCIgY2xhc3M9XCJwYWdlLWhlYWRlci1maXhlZCBwYWdlLXNpZGViYXItY2xvc2VkLWhpZGUtbG9nbyBwYWdlLXNpZGViYXItY2xvc2VkLWhpZGUtbG9nb1wiPlxyXG5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfaGVhZGVyXCI+PC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImNsZWFyZml4XCI+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2NvbnRhaW5lclwiPjwvZGl2PlxyXG5cclxuPC9kaXY+YDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYm9keScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfaGVhZGVyLCAncGFnZS1oZWFkZXInKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2NvbnRhaW5lciwgJ3BhZ2UtY29udGFpbmVyJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgJCh0aGlzLnBhZ2VfYm9keSkuYWRkQ2xhc3MoJ3BhZ2Utc2lkZWJhci1yZXZlcnNlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbiAgICAgICAgJCh0aGlzLnBhZ2VfYm9keSkucmVtb3ZlQ2xhc3MoJ3BhZ2Utc2lkZWJhci1yZXZlcnNlZCcpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBwYWdlU2lkZWJhciA9IHJlcXVpcmUoJy4vcGFnZS1zaWRlYmFyJyk7XHJcbmNvbnN0IGNoYXQgPSByZXF1aXJlKCcuL2NvcnRleC9jaGF0JylcclxuY29uc3QgcGFnZUNvbnRlbnQgPSByZXF1aXJlKCcuL3BhZ2UtY29udGVudCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2UtY29udGFpbmVyXCI+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3NpZGViYXJcIj48L2Rpdj5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfY29udGVudFwiPjwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY29udGFpbmVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9zaWRlYmFyLCAnY2hhdCcpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfY29udGVudCwgJ3BhZ2UtY29udGVudCcpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2UtY29udGVudC13cmFwcGVyXCI+XHJcbiAgICA8ZGl2IGlkPVwicGFnZS1jb250ZW50XCIgY2xhc3M9XCJwYWdlLWNvbnRlbnRcIj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtaGVhZFwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcblxyXG4gICAgICAgIDxkaXYgaWQ9XCJhcHAtY29udGFpbmVyXCI+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb250ZW50JywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuaGFzU2lkZWJhciA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5yZXNpemUgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzU2lkZWJhcikge1xyXG4gICAgICAgICAgICAkKHRoaXNbJ2FwcC1jb250YWluZXInXSkuY3NzKHsgd2lkdGg6IGAxMDAlYCB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgd2lkdGggPSBgJHt3aW5kb3cuaW5uZXJXaWR0aCAtIDQwfXB4YDtcclxuICAgICAgICAgICAgJCh0aGlzWydhcHAtY29udGFpbmVyJ10pLmNzcyh7IHdpZHRoOiB3aWR0aCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKVxyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5oYXNTaWRlYmFyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpXHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5oYXNTaWRlYmFyID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKVxyXG4gICAgfSk7XHJcblxyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWZvb3RlclwiIHN0eWxlPVwicG9zaXRpb246IGZpeGVkOyBib3R0b206IDA7XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1mb290ZXItaW5uZXJcIj5cclxuICAgICAgICA8YSBocmVmPVwiI3Rlcm1zXCI+JmNvcHk7MjAxNTwvYT5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IHBhZ2VMb2dvID0gcmVxdWlyZSgnLi9wYWdlLWxvZ28uanMnKTtcclxuY29uc3QgcGFnZUFjdGlvbnMgPSByZXF1aXJlKCcuL3BhZ2UtYWN0aW9ucy5qcycpO1xyXG5jb25zdCBwYWdlU2VhcmNoID0gcmVxdWlyZSgnLi9wYWdlLXNlYXJjaC5qcycpO1xyXG5jb25zdCBwYWdlVG9wTWVudSA9IHJlcXVpcmUoJy4vcGFnZS10b3BtZW51Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwiaGVhZGVyLXRvcFwiIGNsYXNzPVwicGFnZS1oZWFkZXIgbmF2YmFyIG5hdmJhci1maXhlZC10b3BcIj5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3Byb2dyZXNzX25leHRcIiBzdHlsZT1cIm92ZXJmbG93OiBpbmhlcml0O1wiPjwvZGl2PlxyXG4gICAgPGRpdiBpZD1cImhlYWRlci1jb250ZW50XCIgY2xhc3M9XCJwYWdlLWhlYWRlci1pbm5lclwiPlxyXG5cclxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2xvZ29cIj48L2Rpdj5cclxuICAgICAgICBcclxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2FjdGlvbnNcIj48L2Rpdj5cclxuICAgICAgICBcclxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcFwiIGNsYXNzPVwicGFnZS10b3BcIj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9zZWFyY2hcIj48L2Rpdj5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfdG9wbWVudVwiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWhlYWRlcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfbG9nbywgJ3BhZ2UtbG9nbycpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfYWN0aW9ucywgJ3BhZ2UtYWN0aW9ucycpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfdG9wLCAncGFnZS1zZWFyY2gnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3RvcCwgJ3BhZ2UtdG9wbWVudScpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzID1cInBhZ2UtbG9nb1wiPlxyXG4gICAgPGEgaWQ9XCJtZXRhX2xvZ29cIiBocmVmPVwiI2hvbWVcIj5cclxuICAgICAgICA8aW1nIHNyYz1cImFzc2V0cy9pbWcvbWV0YW1hcF9jbG91ZC5wbmdcIiBhbHQ9XCJsb2dvXCIgY2xhc3MgPVwibG9nby1kZWZhdWx0XCIgLz5cclxuICAgIDwvYT5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX21lbnVfdG9nZ2xlXCIgY2xhc3M9XCJtZW51LXRvZ2dsZXIgc2lkZWJhci10b2dnbGVyXCIgb25jbGljaz1cInsgb25DbGljayB9XCIgc3R5bGU9XCJ7IGdldERpc3BsYXkoJ21lbnUnKSB9XCI+XHJcbiAgICAgICAgPCEtLURPQzogUmVtb3ZlIHRoZSBhYm92ZSBcImhpZGVcIiB0byBlbmFibGUgdGhlIHNpZGViYXIgdG9nZ2xlciBidXR0b24gb24gaGVhZGVyLS0+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbjxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcyA9XCJtZW51LXRvZ2dsZXIgcmVzcG9uc2l2ZS10b2dnbGVyXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1jb2xsYXBzZVwiPlxyXG48L2E+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWxvZ28nLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuICAgIFxyXG4gICAgdGhpcy5vbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFKTtcclxuICAgIH1cclxuXHJcbi8vICAgICB0aGlzLmdldERpc3BsYXkgPSAoZWwpID0+IHtcclxuLy9cclxuLy8gICAgICAgICBpZighdGhpcy5kaXNwbGF5KSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiAnZGlzcGxheTogbm9uZTsnO1xyXG4vLyAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiAnJztcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vXHJcbi8vICAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbi8vICAgICAgICAgdGhpcy5kaXNwbGF5ID0gZmFsc2U7XHJcbi8vICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuLy8gICAgIH0pO1xyXG4vL1xyXG4vL1xyXG4vLyAgICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbi8vICAgICAgICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcclxuLy8gICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4vLyAgICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPCEtLSBET0M6IEFwcGx5IFwic2VhcmNoLWZvcm0tZXhwYW5kZWRcIiByaWdodCBhZnRlciB0aGUgXCJzZWFyY2gtZm9ybVwiIGNsYXNzIHRvIGhhdmUgaGFsZiBleHBhbmRlZCBzZWFyY2ggYm94IC0tPlxyXG48Zm9ybSBjbGFzcz1cInNlYXJjaC1mb3JtXCIgYWN0aW9uPVwiZXh0cmFfc2VhcmNoLmh0bWxcIiBtZXRob2Q9XCJHRVRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2guLi5cIiBuYW1lPVwicXVlcnlcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0biBzdWJtaXRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG48L2Zvcm0+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXNlYXJjaCcsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIFxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyLXdyYXBwZXJcIiBzdHlsZT1cInsgZ2V0RGlzcGxheSgpIH1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwYWdlLXNpZGViYXIgbmF2YmFyLWNvbGxhcHNlIGNvbGxhcHNlXCI+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwicGFnZS1zaWRlYmFyLW1lbnUgXCIgZGF0YS1rZWVwLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWF1dG8tc2Nyb2xsPVwidHJ1ZVwiIGRhdGEtc2xpZGUtc3BlZWQ9XCIyMDBcIj5cclxuXHJcbiAgICAgICAgICAgIDxsaSBpZj1cInsgZGF0YSB9XCIgb25jbGljaz1cInsgcGFyZW50LmNsaWNrIH1cIiBlYWNoPVwieyBkYXRhIH1cIj5cclxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBpY29uIH1cIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiIHN0eWxlPVwiY29sb3I6I3sgY29sb3IgfTtcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInsgYXJyb3c6IG1lbnUubGVuZ3RoIH1cIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgaWY9XCJ7IG1lbnUgJiYgbWVudS5sZW5ndGggfVwiIGNsYXNzPVwic3ViLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgZWFjaD1cInsgbWVudSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgIDwvdWw+XHJcblxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1zaWRlYmFyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5jbGljayA9IGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZygnZm9vJykgfVxyXG4gICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvc2lkZWJhcicsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChpbmNsdWRlICYmIGQubWVudSAmJiBkLm1lbnUpIHtcclxuICAgICAgICAgICAgICAgIGQubWVudSA9IF8uZmlsdGVyKF8uc29ydEJ5KGQubWVudSwgJ29yZGVyJyksIChtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0uYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBcclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBtZXRhUG9pbnRzID0gcmVxdWlyZSgnLi9tZW51L21ldGEtcG9pbnRzLmpzJyk7XHJcbmNvbnN0IG1ldGFIZWxwID0gcmVxdWlyZSgnLi9tZW51L21ldGEtaGVscC5qcycpO1xyXG5jb25zdCBtZXRhVXNlciA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLXVzZXIuanMnKTtcclxuY29uc3QgbWV0YU5vdCA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLW5vdGlmaWNhdGlvbnMuanMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJ0b3AtbWVudVwiPlxyXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgcHVsbC1yaWdodFwiPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiIGlkPVwiaGVhZGVyX2Rhc2hib2FyZF9iYXJcIiBvbmNsaWNrPVwieyBvbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBocmVmPVwiI2hvbWVcIj5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtaG9tZVwiPjwvaT5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIiBpZD1cImhlYWRlcl9ub3RpZmljYXRpb25fYmFyXCI+PC9saT5cclxuXHJcbmBcclxuICAgICAgICAgICAgLy8gPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgICAgICAvLyA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIiBpZD1cImhlYWRlcl9wb2ludHNfYmFyXCI+PC9saT5cclxuKyBgXHJcblxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgaWQ9XCJoZWFkZXJfaGVscF9iYXJcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiPjwvbGk+XHJcblxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgaWQ9XCJoZWFkZXJfdXNlcl9tZW51XCIgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi11c2VyIGRyb3Bkb3duXCI+PC9saT5cclxuICAgIDwvdWw+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS10b3BtZW51JywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICAvL1RPRE86IHJlc3RvcmUgbm90aWZpY2F0aW9ucyB3aGVuIGxvZ2ljIGlzIGNvbXBsZXRlXHJcbiAgICAgICAgLy9yaW90Lm1vdW50KHRoaXMuaGVhZGVyX3BvaW50c19iYXIsICdtZXRhLXBvaW50cycpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfbm90aWZpY2F0aW9uX2JhciwgJ21ldGEtbm90aWZpY2F0aW9ucycpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfaGVscF9iYXIsICdtZXRhLWhlbHAnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMuaGVhZGVyX3VzZXJfbWVudSwgJ21ldGEtdXNlcicpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT57IGhlYWRlci50aXRsZSB9PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgaGVhZGVyLnRleHQgfTwvcD5cclxuXHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGFyZWFzIH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPGI+eyB0aXRsZSB9PC9iPiB7IHRleHQgfVxyXG5cdFx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHRcdFx0XHRcdDwhLS0gQmxvY2txdW90ZXMgLS0+XHJcblx0XHRcdFx0XHRcdFx0PGJsb2NrcXVvdGUgY2xhc3M9XCJoZXJvXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cD57IHF1b3RlLnRleHQgfTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdDxzbWFsbD57IHF1b3RlLmJ5IH08L3NtYWxsPlxyXG5cdFx0XHRcdFx0XHRcdDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZGR0aGlzX2hvcml6b250YWxfZm9sbG93X3Rvb2xib3hcIj48L2Rpdj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3MgPVwiY29sLW1kLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIGlmPVwieyBoZWFkZXIueW91dHViZWlkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwieXRwbGF5ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0L2h0bWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgaGVhZGVyLnlvdXR1YmVpZCB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcyA9XCJmaXR2aWRzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImhlaWdodDogMzI3cHg7IHdpZHRoOiAxMDAlOyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bzsgYnJvZGVyOiAwO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG5cdFx0XHRcdFx0XHRcdDwvaWZyYW1lPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxyXG5cdFx0XHRcdFx0XHQ8aDM+eyB1c2VyTmFtZSB9eyB2aXNpb24udGl0bGUgfTwvaDM+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57IHZpc2lvbi50ZXh0IH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnaG9tZScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuYXJlYXMgPSBbXVxyXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5IT01FLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuYXJlYXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLmFyZWFzLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5xdW90ZSA9IGRhdGEucXVvdGU7XHJcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcclxuICAgICAgICB0aGlzLnZpc2lvbiA9IGRhdGEudmlzaW9uO1xyXG5cclxuICAgICAgICB0aGlzLnVzZXJOYW1lID0gTWV0YU1hcC5Vc2VyLmZ1bGxOYW1lO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGJveCBncmV5LWNhc2NhZGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LXRpdGxlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1pY29uLXRoLWxhcmdlXCI+PC9pPk1ldGFNYXBzXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZj1cInsgbWVudSB9XCIgY2xhc3M9XCJhY3Rpb25zXCI+XHJcbiAgICAgICAgICAgIDxhIGVhY2g9XCJ7IG1lbnUuYnV0dG9ucyB9XCIgaHJlZj1cInsgbGluayB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQWN0aW9uQ2xpY2sgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNvZ3NcIj48L2k+IFRvb2xzIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBlYWNoPVwieyBtZW51Lm1lbnUgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk1lbnVDbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnMgcG9ydGxldC10YWJzXCI+XHJcbiAgICAgICAgICAgIDxsaSBvbmNsaWNrPVwieyBwYXJlbnQub25UYWJTd2l0Y2ggfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInsgYWN0aXZlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNteW1hcHNfMV97IGkgfVwiIGRhdGEtdG9nZ2xlPVwidGFiXCIgYXJpYS1leHBhbmRlZD1cInsgdHJ1ZTogaSA9PSAwIH1cIj5cclxuICAgICAgICAgICAgICAgIHsgdmFsLnRpdGxlIH08L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGUtdG9vbGJhclwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ0YWItcGFuZSBmYXNlIGluIHsgYWN0aXZlOiBpID09IDAgfVwiIGlkPVwibXltYXBzXzFfeyBpIH1cIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQgdGFibGUtaG92ZXJcIiBpZD1cIm15bWFwc190YWJsZV97IGkgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXBJZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInRhYmxlLWNoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlmPVwieyBwYXJlbnQuY3VycmVudFRhYiA9PSAnTXkgTWFwcycgfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiZ3JvdXAtY2hlY2thYmxlXCIgZGF0YS1zZXQ9XCIjbXltYXBzX3RhYmxlX3sgaSB9IC5jaGVja2JveGVzXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXNlcklkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlZCBPblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgaWY9XCJ7IHBhcmVudC5kYXRhICYmIHBhcmVudC5kYXRhW2ldIH1cIiBlYWNoPVwieyBwYXJlbnQuZGF0YVtpXSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiID48c3BhbiBkYXRhLXNlbGVjdG9yPVwiaWRcIiBjbGFzcyA9XCJtYXBpZFwiPnsgaWQgfTwvc3Bhbj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgcGFyZW50LmN1cnJlbnRUYWIgPT0gJ015IE1hcHMnIH1cIiB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNoZWNrYm94ZXNcIiB2YWx1ZT1cIjFcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj57IHVzZXJfaWQgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC5lZGl0YWJsZSB9XCIgY2xhc3M9XCJtZXRhX2VkaXRhYmxlX3sgaSB9XCIgZGF0YS1waz1cInsgaWQgfVwiIGRhdGEtdGl0bGU9XCJFZGl0IE1hcCBOYW1lXCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyAhdmFsLmVkaXRhYmxlIH1cIj57IG5hbWUgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZW50ZXJcIj57IGNyZWF0ZWRfYXQgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByaXZhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNtIGJsdWUgZmlsdGVyLXN1Ym1pdFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk9wZW4gfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tZXllLW9wZW5cIj48L2k+IE9wZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbXktbWFwcycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgdGhpcy5tZW51ID0gbnVsbDtcclxuICAgIHRoaXMudGFicyA9IF8uc29ydEJ5KFt7IHRpdGxlOiAnTXkgTWFwcycsIG9yZGVyOiAwLCBlZGl0YWJsZTogdHJ1ZSB9LCB7IHRpdGxlOiAnU2hhcmVkIHdpdGggTWUnLCBvcmRlcjogMSwgZWRpdGFibGU6IGZhbHNlIH1dLCAnb3JkZXInKTtcclxuICAgIHRoaXMuY3VycmVudFRhYiA9ICdNeSBNYXBzJztcclxuXHJcbiAgICB0aGlzLm9uT3BlbiA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHtldmVudC5pdGVtLmlkfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25UYWJTd2l0Y2ggPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUYWIgPSBldmVudC5pdGVtLnZhbC50aXRsZTtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VycmVudFRhYikge1xyXG4gICAgICAgICAgICBjYXNlICdNeSBNYXBzJzpcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkFjdGlvbkNsaWNrID0gKGV2ZW50LCB0YWcpID0+IHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uTWVudUNsaWNrID0gKGV2ZW50LCB0YWcpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VGFiID09ICdNeSBNYXBzJykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50Lml0ZW0udGl0bGUudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVNYXBzID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9EZWxldGVNYXAuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzW2B0YWJsZTBgXS5maW5kKCcuYWN0aXZlJykuZmluZCgnLm1hcGlkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChzZWxlY3RlZCwgKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnB1c2goY2VsbC5pbm5lckhUTUwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZU1hcHMuZGVsZXRlQWxsKGlkcywgQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaW5kID0gdGhpc1tgdGFibGUwYF0uZmluZCgndGJvZHkgdHIgLmNoZWNrYm94ZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICBmaW5kLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5LnVuaWZvcm0udXBkYXRlKGZpbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvbXltYXBzJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVudSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBfLnNvcnRCeShkYXRhLmJ1dHRvbnMsICdvcmRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lbnU6IF8uc29ydEJ5KGRhdGEubWVudSwgJ29yZGVyJylcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkVGFibGUgPSAoaWR4LCBsaXN0LCBlZGl0YWJsZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2lkeF0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbYHRhYmxlJHtpZHh9YF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0gPSAkKHRoaXNbYG15bWFwc190YWJsZV8ke2lkeH1gXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXSA9IHRoaXNbYHRhYmxlJHtpZHh9YF0uRGF0YVRhYmxlKHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCB1c2VzIHNjcm9sbGFibGUgZGl2KHRhYmxlLXNjcm9sbGFibGUpIHdpdGggb3ZlcmZsb3c6YXV0byB0byBlbmFibGUgdmVydGljYWwgc2Nyb2xsKHNlZTogYXNzZXRzL2dsb2JhbC9wbHVnaW5zL2RhdGF0YWJsZXMvcGx1Z2lucy9ib290c3RyYXAvZGF0YVRhYmxlcy5ib290c3RyYXAuanMpLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHdoZW4gZHJvcGRvd25zIHVzZWQgdGhlIHNjcm9sbGFibGUgZGl2IHNob3VsZCBiZSByZW1vdmVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbHVtbnMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29yZGVyYWJsZSc6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcmFibGUnOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcmFibGUnOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcmFibGUnOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcmFibGUnOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb3JkZXJhYmxlJzogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzW2B0YWJsZSR7aWR4fWBdVG9vbHMgPSBuZXcgJC5mbi5kYXRhVGFibGUuVGFibGVUb29scyh0aGlzW2BkYXRhVGFibGUke2lkeH1gXSwge30pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0YWJsZVdyYXBwZXIgPSB0aGlzW2B0YWJsZSR7aWR4fWBdLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoYCNteW1hcHNfJHtpZHh9X3RhYmxlX3dyYXBwZXJgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdLmZpbmQoJy5ncm91cC1jaGVja2FibGUnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXQgPSBqUXVlcnkodGhpcykuYXR0cignZGF0YS1zZXQnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlZCA9IGpRdWVyeSh0aGlzKS5pcygnOmNoZWNrZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoc2V0KS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBqUXVlcnkudW5pZm9ybS51cGRhdGUoc2V0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0ub24oJ2NoYW5nZScsICd0Ym9keSB0ciAuY2hlY2tib3hlcycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGFibGVXcmFwcGVyLmZpbmQoJy5kYXRhVGFibGVzX2xlbmd0aCBzZWxlY3QnKS5hZGRDbGFzcygnZm9ybS1jb250cm9sIGlucHV0LXhzbWFsbCBpbnB1dC1pbmxpbmUnKTsgLy8gbW9kaWZ5IHRhYmxlIHBlciBwYWdlIGRyb3Bkb3duXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoeyB1bnNhdmVkY2xhc3M6IG51bGwgfSkub24oJ3NhdmUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7aWR9L25hbWVgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0Q2hpbGQoQ09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1QpLm9yZGVyQnlDaGlsZCgnb3duZXInKS5lcXVhbFRvKE1ldGFNYXAuVXNlci51c2VySWQpLm9uKCd2YWx1ZScsICh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcclxuICAgICAgICAgICAgY29uc3QgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQob2JqLmNyZWF0ZWRfYXQpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGJ1aWxkVGFibGUoMCwgbWFwcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0Q2hpbGQoQ09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1QpLm9uKCd2YWx1ZScsICh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcclxuICAgICAgICAgICAgbGV0IG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIgPT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCB8fCAhb2JqLnNoYXJlZF93aXRoIHx8IG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXSAhPSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbWFwcyA9IF8uZmlsdGVyKG1hcHMsIChtYXApID0+IHsgcmV0dXJuIG1hcCAmJiBtYXAuaWQgfSlcclxuICAgICAgICAgICAgYnVpbGRUYWJsZSgxLCBtYXBzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+eyBoZWFkZXIudGl0bGUgfTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IGhlYWRlci50ZXh0IH08L3A+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBlYWNoPVwieyBhcmVhcyB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxyXG4gICAgXHRcdFx0XHRcdFx0PGgzPnsgdGl0bGUgfTwvaDM+XHJcbiAgICBcdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IHRleHQgfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxiPnsgdGl0bGUgfTwvYj4geyB0ZXh0IH1cclxuXHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHQ8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Rlcm1zJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICBcclxuICAgIHRoaXMuYXJlYXMgPSBbXVxyXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5URVJNU19BTkRfQ09ORElUSU9OUywgKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLmFyZWFzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5zZWN0aW9ucywgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKGluY2x1ZGUpIHtcclxuICAgICAgICAgICAgICAgIGQuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkLml0ZW1zLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5jbHVkZTIgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xyXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICBcclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5cclxuY2xhc3MgQ29tbW9uIHtcclxuXHJcbiAgICBzdGF0aWMgc3BsaXRMaW5lcyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQoL1xcbi8pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRFdmVudFRpbWUodCwgbm93KSB7XHJcbiAgICAgICAgbGV0IHRpbWUgPSBtb21lbnQodCwgJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyk7XHJcbiAgICAgICAgbGV0IG5vd3RpbWUgPSBtb21lbnQobm93LCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndDogICAgICAgJyArIHQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3c6ICAgICAnICsgbm93KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndGltZTogICAgJyArIHRpbWUuZm9ybWF0KCkpOyAvLyArICcgJyArIHRpbWUuaXNWYWxpZCgpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm93dGltZTogJyArIG5vd3RpbWUuZm9ybWF0KCkpOyAvLyArICcgJyArIG5vd3RpbWUuaXNWYWxpZCgpKTtcclxuICAgICAgICByZXR1cm4gdGltZS5mcm9tKG5vd3RpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjbGFzc0lmKGtsYXNzLCBiKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2xhc3NJZjogJyArIGtsYXNzICsgJywgJyArIGIpO1xyXG4gICAgICAgIHJldHVybiAoYiA/IGtsYXNzIDogJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGF2b2lkICckYXBwbHkgYWxyZWFkeSBpbiBwcm9ncmVzcycgZXJyb3IgKHNvdXJjZTogaHR0cHM6Ly9jb2RlcndhbGwuY29tL3Avbmdpc21hKVxyXG4gICAgc3RhdGljIHNhZmVBcHBseShmbikge1xyXG4gICAgICAgIGlmIChmbiAmJiAodHlwZW9mIChmbikgPT09ICdmdW5jdGlvbicpKSB7XHJcbiAgICAgICAgICAgIGZuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNvdXJjZTogaHR0cDovL2N0cmxxLm9yZy9jb2RlLzE5NjE2LWRldGVjdC10b3VjaC1zY3JlZW4tamF2YXNjcmlwdFxyXG4gICAgc3RhdGljIGlzVG91Y2hEZXZpY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCAobmF2aWdhdG9yLk1heFRvdWNoUG9pbnRzID4gMCkgfHwgKG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUaWNrc0Zyb21EYXRlKGRhdGUpIHtcclxuICAgICAgICBsZXQgcmV0ID0gbnVsbDtcclxuICAgICAgICBpZihkYXRlICYmIGRhdGUuZ2V0VGltZSkge1xyXG4gICAgICAgICAgICByZXQgPSBkYXRlLmdldFRpbWUoKS8xMDAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21tb247IiwiaWYgKCFTdHJpbmcucHJvdG90eXBlLmZvcm1hdCkge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgID8gYXJnc1tudW1iZXJdXG4gICAgICAgICAgICAgIDogbWF0Y2hcbiAgICAgICAgICAgIDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0iLCJjb25zdCB1dWlkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGhleERpZ2l0cywgaSwgcywgdXVpZDtcclxuICAgIHMgPSBbXTtcclxuICAgIHMubGVuZ3RoID0gMzY7XHJcbiAgICBoZXhEaWdpdHMgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XHJcbiAgICBpID0gMDtcclxuICAgIHdoaWxlIChpIDwgMzYpIHtcclxuICAgICAgICBzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSk7XHJcbiAgICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgc1sxNF0gPSAnNCc7XHJcbiAgICBzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSk7XHJcbiAgICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gJy0nO1xyXG4gICAgdXVpZCA9IHMuam9pbignJyk7XHJcbiAgICByZXR1cm4gdXVpZDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXVpZDsiXX0=
