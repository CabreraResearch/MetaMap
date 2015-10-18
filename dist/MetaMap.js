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

},{"./js/app//Config.js":14,"./js/app/Eventer.js":15,"./js/app/Integrations":17,"./js/app/Router.js":19,"./js/app/auth0":21,"./js/app/user.js":22,"./js/integrations/google.js":46,"./js/pages/PageFactory.js":47,"./js/tools/shims.js":75,"airbrake-js":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"jquery":undefined,"jquery-ui":undefined,"lodash":undefined,"riot":"riot"}],2:[function(require,module,exports){
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
                    case CONSTANTS.ACTIONS.SHARE_MAP:
                        Method = require('./ShareMap');
                        break;
                    case CONSTANTS.ACTIONS.TERMS_AND_CONDITIONS:
                        Method = require('./Terms.js');
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

},{"../constants/constants":27,"./ActionBase.js":3,"./CopyMap.js":4,"./DeleteMap.js":5,"./Feedback":6,"./Home.js":7,"./Logout.js":8,"./MyMaps.js":9,"./NewMap.js":10,"./OpenMap.js":11,"./ShareMap":12,"./Terms.js":13}],3:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"../constants/constants":27}],4:[function(require,module,exports){
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
                    created_at: '' + new Date(),
                    owner: {
                        userId: _this.metaMap.User.userId,
                        name: _this.metaMap.User.displayName,
                        picture: _this.metaMap.User.picture
                    },
                    name: _this.appendCopy(oldMap.name),
                    shared_with: {
                        admin: {
                            read: true,
                            write: true },
                        '*': {
                            read: false,
                            write: false }
                    }
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
                if (mess.length - mess.lastIndexOf('(Copy') <= 4) {
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

},{"../constants/constants":27,"./ActionBase.js":3}],5:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"../constants/constants":27,"./ActionBase.js":3,"lodash":undefined}],6:[function(require,module,exports){
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

},{"../constants/constants":27,"../tags/pages/home":67,"./ActionBase.js":3,"riot":"riot"}],8:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"../constants/constants":27,"./ActionBase.js":3,"lodash":undefined}],9:[function(require,module,exports){
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

},{"../constants/constants":27,"../tags/pages/my-maps":68,"./ActionBase.js":3,"riot":"riot"}],10:[function(require,module,exports){
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
                    created_at: '' + new Date(),
                    owner: {
                        userId: _this.metaMap.User.userId,
                        name: _this.metaMap.User.displayName,
                        picture: _this.metaMap.User.picture
                    },
                    name: 'New Untitled Map',
                    shared_with: {
                        admin: {
                            read: true,
                            write: true },
                        '*': {
                            read: false,
                            write: false }
                    }
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

},{"../constants/constants":27,"./ActionBase.js":3}],11:[function(require,module,exports){
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

},{"../constants/constants":27,"../tags/canvas/meta-canvas.js":48,"./ActionBase.js":3,"riot":"riot"}],12:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var riot = require('riot');
var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');
require('../tags/dialogs/share');

var ShareMap = (function (_ActionBase) {
    _inherits(ShareMap, _ActionBase);

    function ShareMap() {
        _classCallCheck(this, ShareMap);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(ShareMap.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(ShareMap, [{
        key: 'act',
        value: function act(id) {
            var _get2,
                _this = this;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(ShareMap.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            this.metaFire.getData('' + CONSTANTS.ROUTES.MAPS_LIST + id).then(function (map) {
                map.id = id;
                ShareMap.act({ map: map });
                _this.metaMap.Router.back();
            });
            return true;
        }
    }], [{
        key: 'act',
        value: function act(map) {
            if (map) {
                var modal = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.META_MODAL_DIALOG_CONTAINER), CONSTANTS.TAGS.SHARE)[0];
                modal.update(map);
            }
        }
    }]);

    return ShareMap;
})(ActionBase);

module.exports = ShareMap;

},{"../constants/constants":27,"../tags/dialogs/share":52,"./ActionBase.js":3,"riot":"riot"}],13:[function(require,module,exports){
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

},{"../constants/constants":27,"../tags/pages/terms":69,"./ActionBase.js":3,"riot":"riot"}],14:[function(require,module,exports){
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

},{"./Firebase":16,"lodash":undefined}],15:[function(require,module,exports){
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

},{"lodash":undefined,"riot":"riot"}],16:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"bluebird":undefined,"localforage":undefined}],17:[function(require,module,exports){
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

},{"../integrations/AddThis":37,"../integrations/Facebook":38,"../integrations/Google":39,"../integrations/Intercom":40,"../integrations/NewRelic":41,"../integrations/Twitter":42,"../integrations/UserSnap":43,"../integrations/Zendesk":44,"lodash":undefined}],18:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Permissions = (function () {
    function Permissions(map) {
        _classCallCheck(this, Permissions);

        this.map = map;
        this.metaMap = require('../../MetaMap');
    }

    _createClass(Permissions, [{
        key: 'canEdit',
        value: function canEdit() {
            return this.isMapOwner() || this.isSharedEdit();
        }
    }, {
        key: 'canView',
        value: function canView() {
            return this.isMapOwner() || this.isSharedView();
        }
    }, {
        key: 'isMapOwner',
        value: function isMapOwner() {
            return this.map && this.map.owner.userId == this.metaMap.User.userId;
        }
    }, {
        key: 'isSharedEdit',
        value: function isSharedEdit() {
            return this.map && this.map.shared_with && (this.metaMap.User.isAdmin || this.map.shared_with[this.metaMap.User.userId] && this.map.shared_with[this.metaMap.User.userId].write == true || this.map.shared_with['*'] && this.map.shared_with['*'].write == true);
        }
    }, {
        key: 'isSharedView',
        value: function isSharedView() {
            return this.map && this.isSharedEdit() || this.map.shared_with[this.metaMap.User.userId] && this.map.shared_with[this.metaMap.User.userId].read == true || this.map.shared_with['*'] && this.map.shared_with['*'].read == true;
        }
    }]);

    return Permissions;
})();

module.exports = Permissions;

},{"../../MetaMap":1}],19:[function(require,module,exports){
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
                this._doNotTrack = [CONSTANTS.ACTIONS.DELETE_MAP, CONSTANTS.ACTIONS.COPY_MAP, CONSTANTS.ACTIONS.LOGOUT, CONSTANTS.ACTIONS.NEW_MAP, CONSTANTS.ACTIONS.FEEDBACK, CONSTANTS.ACTIONS.SHARE_MAP];
            }
            return this._doNotTrack;
        }
    }]);

    return Router;
})();

module.exports = Router;

},{"../constants/constants":27,"riot":"riot"}],20:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var localforage = require('localforage');
var _ = require('lodash');
var CONSTANTS = require('../constants/constants');

var toBool = function toBool(val) {
    var ret = false;
    if (val === true || val === false) {
        ret = val;
    } else {
        if (_.contains(['true', 'yes', '1'], val + ''.toLowerCase().trim())) {
            ret = true;
        }
    }
    return ret;
};

var Sharing = (function () {
    function Sharing(user) {
        _classCallCheck(this, Sharing);

        this.user = user;
        this._metaMap = require('../../MetaMap');
        this._fb = this._metaMap.MetaFire;
    }

    _createClass(Sharing, [{
        key: 'addShare',
        value: function addShare(map, userData) {
            var opts = arguments.length <= 2 || arguments[2] === undefined ? { read: true, write: false } : arguments[2];

            if (map && map.id && userData && userData.id) {
                this._fb.setData({
                    read: toBool(opts.read),
                    write: toBool(opts.write),
                    name: opts.name,
                    picture: opts.picture
                }, CONSTANTS.ROUTES.MAPS_LIST + '/' + map.id + '/shared_with/' + userData.id);
                this._fb.pushData({
                    event: this.user.displayName + ' shared a map, ' + map.name + ', with you!',
                    mapId: map.id,
                    type: CONSTANTS.NOTIFICATION.MAP,
                    time: '' + new Date()
                }, '' + CONSTANTS.ROUTES.NOTIFICATIONS.format(userData.id));
            }
        }
    }, {
        key: 'removeShare',
        value: function removeShare(map, userData) {
            if (map && map.id && userData && userData.id) {
                this._fb.deleteData(CONSTANTS.ROUTES.MAPS_LIST + '/' + map.id + '/shared_with/' + userData.id);
                this._fb.pushData({
                    event: this.user.displayName + ' removed a map, ' + map.name + ', that was previously shared.',
                    time: '' + new Date()
                }, '' + CONSTANTS.ROUTES.NOTIFICATIONS.format(userData.id));
            }
        }
    }, {
        key: 'editShare',
        value: function editShare(mapId, userData) {
            var opts = arguments.length <= 2 || arguments[2] === undefined ? { read: true, write: false } : arguments[2];
        }
    }]);

    return Sharing;
})();

module.exports = Sharing;

},{"../../MetaMap":1,"../constants/constants":27,"localforage":undefined,"lodash":undefined}],21:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Auth0Lock = require('auth0-lock');
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
                                _this.ctoken = profile.ctoken = ctoken;
                                localforage.setItem('ctoken', _this.ctoken);

                                _this.id_token = profile.id_token = id_token;
                                localforage.setItem('id_token', _this.id_token);

                                _this.profile = profile;
                                localforage.setItem('profile', _this.profile);

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
                                    localforage.getItem('ctoken').then(function (token) {
                                        _this2.ctoken = token;
                                    });
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

},{"auth0-lock":undefined,"bluebird":undefined,"localforage":undefined,"lodash":undefined}],22:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var uuid = require('../tools/uuid.js');
var Common = require('../tools/Common');
var _ = require('lodash');

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
                ret = this._identity.roles.admin == true;
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

},{"../../MetaMap":1,"../tools/Common":74,"../tools/uuid.js":76,"lodash":undefined}],23:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var jsPlumb = window.jsPlumb;
var jsPlumbToolkit = window.jsPlumbToolkit;
var _ = require('lodash');
var CONSTANTS = require('../constants/constants');
var Permissions = require('../app/Permissions');

require('./layout');

var Canvas = (function () {
    function Canvas(map, mapId) {
        var _this = this;

        _classCallCheck(this, Canvas);

        this.map = map;
        this.mapId = mapId;
        this.toolkit = {};
        this.metaMap = require('../../MetaMap');
        var permissions = null;

        var ready = this.metaMap.MetaFire.getData(CONSTANTS.ROUTES.MAPS_LIST + '/' + mapId).then(function (mapInfo) {
            _this.mapInfo = mapInfo;
            permissions = new Permissions(mapInfo);
        });

        var that = this;

        var throttleSave = _.throttle(function () {
            if (permissions.canEdit()) {
                var postData = {
                    data: window.toolkit.exportData(),
                    changed_by: {
                        userId: _this.metaMap.User.userId
                    }
                };
                _this.metaMap.MetaFire.setDataInTransaction(postData, 'maps/data/' + _this.mapId);
                _this.metaMap.Integrations.sendEvent(_this.mapId, 'event', 'autosave', 'autosave');
            }
        }, 500);

        ready.then(function () {

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
                        w: 50,
                        h: 50,
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
                    elementsDraggable: permissions.canEdit(),
                    enablePanButtons: false,
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
                        return node.data.parent ? { posse: node.data.parent, active: false } : node.id;
                    },
                    zoomToFit: false,
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

                                        d.w = edges[0].source.data.w * 0.667;
                                        d.h = edges[0].source.data.h * 0.667;

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
                                    curviness: 15
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
                                endpoints: ["Blank", ["Dot", { radius: 5, cssClass: "orange" }]],
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
                            //various drag/drop handler event experiments lived here
                        },
                        nodeDropped: function nodeDropped(params) {
                            alert("node " + params.source.id + " was dropped on " + params.target.id);
                        }
                    },
                    elementsDroppable: true,
                    dragOptions: {
                        filter: ".segment", // can't drag nodes by the color segments.
                        stop: function stop() {
                            // when _any_ node stops dragging, run the layout again.
                            // this will cause child nodes to snap to their new parent, and also
                            // cleanup nicely if a node is dropped on another node.
                            renderer.refresh();
                        }
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
                            var newWidth = node.data.w * 0.667;
                            var newHeight = node.data.h * 0.667;

                            node.data.children = node.data.children || [];
                            var newLabel = 'Part';

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
                            throttleSave();
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
                    throttleSave();
                });

                jsPlumb.on("relationshipEdgeDump", "click", dumpEdgeCounts());

                //CTRL + click enables the lasso
                jsPlumb.on(document, 'mousedown', function (event) {
                    if (event.ctrlKey) {
                        event.preventDefault();
                    }
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

                var mode = null;
                //map backspace to delete if anything is selected
                jsPlumb.on(document, 'keyup', function (event) {
                    mode = null;
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
                    if (event.ctrlKey) {
                        if (!mode) {
                            mode = 'select';
                            renderer.setMode('select');
                        }
                    } else {
                        switch (event.keyCode) {
                            case 8:
                                event.preventDefault();
                                break;
                            case 46:
                                var selected = toolkit.getSelection();
                                deleteAll(selected);
                                break;
                        }
                    }
                });

                //KLUDGE:
                //The SVG segments for letters and buttons are not grouped together, so the css:hover trick doesn't work
                //Instead, use jQuery
                var toggleOpacity = function toggleOpacity(node, on) {
                    //Mouse Over
                    var letter = $(node);
                    var cssClass = node.classList[1];
                    var button = '';
                    switch (cssClass.toLowerCase()) {
                        case 'p':
                            button = 'orange';
                            break;
                        case 'd':
                            button = 'red';
                            break;
                        case 'r':
                            button = 'blue';
                            break;
                        case 's':
                            button = 'green';
                            break;
                        default:
                            break;
                    }
                    $(letter).parent().parent().find('.' + button + '.segment').css('opacity', on);
                };

                $('.letter').hover(function () {
                    //Mouse Over
                    toggleOpacity(this, 1);
                }, function () {
                    //Mouse Out
                });

                $('.segment').hover(function () {
                    //Mouse Over
                    $(this).css('opacity', 1);
                }, function () {
                    //Mouse Out
                    $(this).css('opacity', 0);
                });
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

},{"../../MetaMap":1,"../app/Permissions":18,"../constants/constants":27,"./layout":24,"lodash":undefined}],24:[function(require,module,exports){
/**
* Custom layout for metamap. Extends the Spring layout. After Spring runs, this
* layout finds 'part' nodes and aligns them underneath their parents. The alignment
* - left or right - is set in the parent node's data, as `partAlign`.
*
* Layout can be suspended on a per-node basis by setting `suspendLayout` in the Node's
* data.
*
* Child nodes 
*/
"use strict";

;(function () {

  function childNodeComparator(c1, c2) {
    if (c2.data.order == null) return -1;
    if (c1.data.order == null) return 1;
    return c1.data.order < c2.data.order ? -1 : 1;
  }

  jsPlumbToolkit.Layouts["metamap"] = function () {
    jsPlumbToolkit.Layouts.Spring.apply(this, arguments);

    var _oneSet = (function (parent, params, toolkit) {
      params = params || {};
      var padding = params.partPadding || 20;
      if (parent.data.children && parent.data.suspendLayout !== true) {

        var c = parent.data.children,
            childNodes = _.map(c, toolkit.getNode),
            parentPos = this.getPosition(parent.id),
            parentSize = this.getSize(parent.id),
            magnetizeNodes = [parent.id],
            align = (parent.data.partAlign || "right") === "left" ? 0 : 1,
            y = parentPos[1] + parentSize[1] + padding;

        // sort nodes	
        childNodes.sort(childNodeComparator);
        // and run through them and assign order; any that didn't previously have order will get order
        // set, and any that had order will retain the same value.
        _.each(childNodes, function (cn, i) {
          cn.data.order = i;
        });

        for (var i = 0; i < childNodes.length; i++) {
          var cn = childNodes[i];
          if (cn) {
            var childSize = this.getSize(cn.id),
                x = parentPos[0] + align * (parentSize[0] - childSize[0]);

            this.setPosition(cn.id, x, y, true);
            magnetizeNodes.push(cn.id);
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
          _oneSet(n, params, toolkit);
        }
      }

      _superEnd.apply(this, arguments);
      this.draw();
    };
  };
})();

},{}],25:[function(require,module,exports){
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
    FEEDBACK: 'feedback',
    SHARE_MAP: 'share_map'
};

Object.freeze(ACTIONS);

module.exports = ACTIONS;

},{}],26:[function(require,module,exports){
'use strict';

var CANVAS = {
    LEFT: 'left',
    RIGHT: 'right'
};

Object.freeze(CANVAS);

module.exports = CANVAS;

},{}],27:[function(require,module,exports){
'use strict';

var CONSTANTS = {
	ACTIONS: require('./actions'),
	CANVAS: require('./canvas'),
	DSRP: require('./dsrp'),
	EDIT_STATUS: require('./editStatus'),
	ELEMENTS: require('./elements'),
	EVENTS: require('./events'),
	NOTIFICATION: require('./notification'),
	PAGES: require('./pages'),
	ROUTES: require('./routes'),
	TABS: require('./tabs'),
	TAGS: require('./tags')
};

Object.freeze(CONSTANTS);

module.exports = CONSTANTS;

},{"./actions":25,"./canvas":26,"./dsrp":28,"./editStatus":29,"./elements":30,"./events":31,"./notification":32,"./pages":33,"./routes":34,"./tabs":35,"./tags":36}],28:[function(require,module,exports){
'use strict';

var DSRP = {
	D: 'D',
	S: 'S',
	R: 'R',
	P: 'P'
};

Object.freeze(DSRP);

module.exports = DSRP;

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
'use strict';

var ELEMENTS = {
    APP_CONTAINER: 'app-container',
    META_PROGRESS: 'meta_progress',
    META_PROGRESS_NEXT: 'meta_progress_next',
    META_MODAL_DIALOG_CONTAINER: 'meta_modal_dialog_container'
};

Object.freeze(ELEMENTS);

module.exports = ELEMENTS;

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
'use strict';

var NOTIFICATION = {
	MAP: 'map'
};

Object.freeze(NOTIFICATION);

module.exports = NOTIFICATION;

},{}],33:[function(require,module,exports){
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

},{"./actions.js":25,"lodash":undefined}],34:[function(require,module,exports){
'use strict';

var ROUTES = {
    MAPS_LIST: 'maps/list/',
    MAPS_DATA: 'maps/data/',
    MAPS_NEW_MAP: 'maps/new-map/',
    TERMS_AND_CONDITIONS: 'metamap/terms-and-conditions/',
    HOME: 'metamap/home/',
    NOTIFICATIONS: 'users/{0}/notifications'
};

Object.freeze(ROUTES);

module.exports = ROUTES;

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
'use strict';

var TAGS = {
    META_CANVAS: 'meta-canvas',
    HOME: 'home',
    TERMS: 'terms',
    MY_MAPS: 'my-maps',
    SHARE: 'share'
};

Object.freeze(TAGS);

module.exports = TAGS;

},{}],37:[function(require,module,exports){
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

},{"./_IntegrationsBase":45}],38:[function(require,module,exports){
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

},{"./_IntegrationsBase":45,"./google":46}],39:[function(require,module,exports){
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

},{"./_IntegrationsBase":45}],40:[function(require,module,exports){
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

},{"./_IntegrationsBase":45}],41:[function(require,module,exports){
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
            if (this.integration && this.integration.setCustomAttribute) {
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

},{"./_IntegrationsBase":45}],42:[function(require,module,exports){
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

},{"./_IntegrationsBase":45,"./google":46}],43:[function(require,module,exports){
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

},{"./_IntegrationsBase":45,"./google":46}],44:[function(require,module,exports){
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

},{"./_IntegrationsBase":45}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{"./_IntegrationsBase":45}],47:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var riot = window.riot;
var NProgress = window.NProgress;
var pageBody = require('../tags/page-body.js');
var CONSTANTS = require('../constants/constants');
var Actions = require('../actions/Action.js');
var Metronic = require('../template/metronic');
var Layout = require('../template/layout');
var Demo = require('../template/demo');
var QuickSidebar = require('../template/quick-sidebar');

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
                        QuickSidebar.init();

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

},{"../actions/Action.js":2,"../constants/constants":27,"../tags/page-body.js":58,"../template/demo":70,"../template/layout":71,"../template/metronic":72,"../template/quick-sidebar":73}],48:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var Canvas = require('../../canvas/canvas');
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

},{"../../../MetaMap.js":1,"../../canvas/canvas":23,"./node":49,"riot":"riot"}],49:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var Editor = require('../../canvas/canvas');

var html = '\n';

module.exports = riot.tag('node', html, function (opts) {});

},{"../../canvas/canvas":23,"riot":"riot"}],50:[function(require,module,exports){
'use strict';

var riot = require('riot');
var moment = require('moment');
var Ps = require('perfect-scrollbar');

var raw = require('./raw');
var CONSTANTS = require('../../constants/constants');

var html = '\n<div class="page-quick-sidebar-wrapper">\n    <div class="page-quick-sidebar">\n        <div class="nav-justified">\n            <ul class="nav nav-tabs nav-justified">\n                <li class="active">\n                    <a href="#quick_sidebar_tab_1" data-toggle="tab">\n                    Cortex Man\n                    </a>\n                </li>\n                <li>\n                    <a href="#quick_sidebar_tab_2" data-toggle="tab">\n                    Outline\n                    </a>\n                </li>\n            </ul>\n            <div class="tab-content">\n                <div class="tab-pane active page-quick-sidebar-chat page-quick-sidebar-content-item-shown" id="quick_sidebar_tab_1">\n                    <div class="page-quick-sidebar-chat-users" data-rail-color="#ddd" data-wrapper-class="page-quick-sidebar-list">\n                    </div>\n                    <div class="page-quick-sidebar-item">\n                        <div class="page-quick-sidebar-chat-user">\n                            <div class="page-quick-sidebar-chat-user-messages">\n                                <div each="{ messages }" class="post { out: author == \'cortex\', in: author != \'cortex\' }">\n                                    <img height="39" width="39" class="avatar" alt="" src="{ picture }"/>\n                                    <div class="message">\n                                        <span class="arrow"></span>\n                                        <a href="javascript:;" class="name">{ name }</a>\n                                        <span class="datetime">{ parent.getRelativeTime(time) }</span>\n                                        <span class="body">\n                                        <raw content="{ message }"></raw> </span>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="page-quick-sidebar-chat-user-form">\n                                <form id="chat_input_form" onsubmit="{ onSubmit }">\n                                    <div class="input-group">\n                                        <input id="chat_input" type="text" class="form-control" placeholder="Type a message here...">\n                                        <div class="input-group-btn">\n                                            <button type="submit" class="btn blue"><i class="fa fa-paperclip"></i></button>\n                                        </div>\n                                    </div>\n                                </form>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class="tab-pane page-quick-sidebar-alerts" id="quick_sidebar_tab_2">\n                    <div class="page-quick-sidebar-alerts-list">\n                        <h3 class="list-heading">Intro</h3>\n                        <h3 class="list-heading">Section 1</h3>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n';

riot.tag('quick-sidebar', html, function (opts) {
    var _this = this;

    this.cortexPicture = 'src/images/cortex-avatar-small.jpg';
    this.messages = [{
        message: 'Hello, I\'m Cortex Man. Ask me anything. Try <code>/help</code> if you get lost.',
        author: 'cortex',
        picture: this.cortexPicture,
        time: new Date()
    }];

    var MetaMap = require('../../../MetaMap');

    this.on('update', function () {});

    this.on('mount', function () {

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
});

},{"../../../MetaMap":1,"../../constants/constants":27,"./raw":51,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],51:[function(require,module,exports){
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

},{"riot":"riot"}],52:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('typeahead.js');
require('bootstrap-select');

var CONSTANTS = require('../../constants/constants');
require('../../tools/shims');
var Sharing = require('../../app/Sharing');

var html = '\n<div id="share_modal" class="modal fade">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header">\n                <a id="share_public_link"\n                    style="float: right; vertical-align: middle;"\n                    data-clipboard-text="{window.location.host+\'/\'+window.location.pathname+\'/maps/\'+opts.map.id}"\n                    onclick="{ getPublicLink }">\n                        Get sharable link  <i class="fa fa-link"></i></a>\n                <h4 class="modal-title">Share with others</h4>\n            </div>\n            <div class="modal-body">\n                <p>People</p>\n                <form role="form">\n                    <div class="row">\n                        <div id="share_typeahead" class="col-md-8">\n                            <input style="height: 35px;" id="share_input" class="typeahead form-control" type="text" placeholder="Enter names or email addresses..." />\n                        </div>\n                        <div class="col-md-4">\n                            <div class="row">\n                                <div class="col-md-8">\n                                    <select id="share_permission" class="selectpicker">\n                                        <option value="read" data-content="<span><i class=\'fa fa-eye\'></i> Can view</span>">Can view</option>\n                                        <option value="write" data-content="<span><i class=\'fa fa-pencil\'></i> Can edit</span>">Can edit</option>\n                                    </select>\n                                </div>\n                                <div class="col-md-2">\n                                    <a id="share_button" class="btn btn-icon-only green" onclick="{ onShare }" style="display: none;">\n                                        <i class="fa fa-plus"></i>\n                                    </a>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div if="{ opts && opts.map && opts.map.shared_with}" class="row">\n                        <br>\n                        <div class="col-md-12">\n                            <span\n                                class="label label-default"\n                                style="margin-right: 5px;"\n                                if="{ i != \'admin\' && (val.write || val.read) }"\n                                each="{ i, val in opts.map.shared_with}">\n                                <i if="{ val.write }" class="fa fa-pencil"></i>\n                                <i if="{ !val.write }" class="fa fa-eye"></i>\n                                </i>\n                                  { val.name }\n                                <i\n                                    class="fa fa-times-circle"\n                                    style="cursor: pointer;"\n                                    onclick="{ parent.onUnShare }"\n                                    >\n                                </i>\n                            </span>\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class="modal-footer">\n                <button type="button" class="btn btn-primary" data-dismiss="modal">Done</button>\n            </div>\n        </div>\n    </div>\n</div>\n';

module.exports = riot.tag('share', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap');
    var share = new Sharing(MetaMap.User);

    this.data = [];

    this.getPublicLink = function (e, opts) {
        debugger;
    };

    this.onShare = function (e, opts) {
        _this.opts.map.shared_with[_this.suggestion.id] = {
            read: _this.picker.val() == 'read' || _this.picker.val() == 'write',
            write: _this.picker.val() == 'write',
            name: _this.suggestion.name,
            picture: _this.suggestion.picture
        };
        share.addShare(_this.opts.map, _this.suggestion, _this.opts.map.shared_with[_this.suggestion.id]);

        _this.suggestion = null;
        _this.ta.typeahead('val', '');
        $(_this.share_button).hide();
    };

    this.onUnShare = function (e, opts) {
        e.item.val.id = e.item.i;
        delete _this.opts.map.shared_with[e.item.i];
        share.removeShare(_this.opts.map, e.item.val);
    };

    this.on('update', function (opts) {
        if (opts) {
            _.extend(_this.opts, opts);
        }
    });

    this.on('mount', function (e, opts) {
        $(_this.share_modal).modal('show');
        _this.ta = $('#share_typeahead .typeahead').typeahead({
            highlight: true
        }, {
            source: function source(query, syncMethod, asyncMethod) {
                return $.ajax({
                    type: 'post',
                    url: 'https://api.metamap.co/users/find',
                    data: JSON.stringify({
                        currentUserId: MetaMap.User.userId,
                        sessionId: MetaMap.MetaFire.firebase_token,
                        excludedUsers: _.keys(_this.opts.map.shared_with),
                        search: query
                    }),
                    contentType: 'application/json; charset=utf-8',
                    success: function success(data) {
                        data.push({
                            id: '*',
                            picture: 'src/images/world-globe.jpg',
                            name: 'Public'
                        });
                        asyncMethod(data);
                    },
                    error: function error(e) {
                        console.log(e);
                    }
                });
            },
            display: function display(obj) {
                return obj.name;
            },
            templates: {
                empty: ['<div style="padding: 5px 10px; text-align: center;">', 'Unable to find any users matching this query', '</div>'].join('\n'),
                suggestion: function suggestion(value) {
                    return '<div><img alt="' + value.name + '" height="30" width="30" class="img-circle" src="' + value.picture + '"> ' + value.name + '</div>';
                }
            }
        });
        _this.ta.on('typeahead:select', function (ev, suggestion) {
            _this.suggestion = suggestion;
            $(_this.share_button).show();
        });
        _this.ta.on('typeahead:autocomplete', function (ev, suggestion) {
            _this.suggestion = suggestion;
            $(_this.share_button).show();
        });
        _this.picker = $('.selectpicker').selectpicker({
            width: 'auto'
        });
    });
});

},{"../../../MetaMap":1,"../../app/Sharing":20,"../../constants/constants":27,"../../tools/shims":75,"bootstrap-select":undefined,"jquery":undefined,"riot":"riot","typeahead.js":undefined}],53:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('bootstrap-hover-dropdown');

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

},{"../../../MetaMap":1,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],54:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('bootstrap-hover-dropdown');
var moment = require('moment');

var CONSTANTS = require('../../constants/constants');
require('../../tools/shims');

var html = '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n                    <i class="fa fa-bell-o"></i>\n                    <span class="badge badge-success">\n                        { notifications.length }\n                    </span>\n                </a>\n                <ul class="dropdown-menu">\n                    <li class="external">\n                        <h3>\n                            <span class ="bold">{ notifications.length } pending</span> notification{ s: notifications.length == 0 || notifications.length > 1 }\n                        </h3>\n                        <a if="{ allNotifications.length > 1 }" href="javascript:;">view all</a>\n                    </li>\n                    <li>\n                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">\n                            <li if="{ true != archived }"\n                                each="{ val, i in notifications }"\n                                onclick="{ parent.onClick }">\n                                <a>\n                                    <span if="{ val && val.photo }" class="photo">\n\t\t\t\t\t\t\t\t\t\t<img src="{ val.photo }" class="img-circle" alt="">\n                                    </span>\n                                    <span class="subject">\n\t\t\t\t\t\t\t\t\t\t<span class="from">{ val.from }</span>\n\t\t\t\t\t\t\t\t\t\t<span class="time" style="padding: 0;">{ parent.getTime(val.time) }</span>\n                                    </span>\n                                    <span class="message">{ val.event }</span>\n                                </a>\n                            </li>\n                        </ul>\n                    </li>\n                </ul>\n';

riot.tag('meta-notifications', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');
    var fbPath = CONSTANTS.ROUTES.NOTIFICATIONS.format(MetaMap.User.userId);

    this.notifications = [];
    this.allNotifications = [];

    this.onClick = function (event, params) {
        var item = event.item.val;
        MetaMap.MetaFire.setData(true, fbPath + '/' + item.id + '/archive');
        switch (item.type) {
            case CONSTANTS.NOTIFICATION.MAP:
                MetaMap.Router.to('map/' + item.mapId);
                break;
        }
        return true;
    };

    this.getTime = function (time) {
        return moment(new Date(time)).fromNow();
    };

    this.on('mount', function () {
        MetaMap.MetaFire.getData(fbPath).then(function (data) {
            if (!data) {
                MetaMap.MetaFire.pushData({
                    event: 'You signed up for MetaMap!',
                    time: '' + new Date(),
                    archive: false
                }, fbPath);
            }
            MetaMap.MetaFire.on(CONSTANTS.ROUTES.NOTIFICATIONS.format(MetaMap.User.userId), function (data) {
                _this.allNotifications = _.map(data, function (n, id) {
                    n.id = id;return n;
                });
                _this.notifications = _.filter(_.sortBy(_this.allNotifications, 'date'), function (d) {
                    var include = d.archive != true;
                    return include;
                });
                _this.update();
            });
        });
    });
});

},{"../../../MetaMap.js":1,"../../constants/constants":27,"../../tools/shims":75,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"moment":undefined,"riot":"riot"}],55:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('bootstrap-hover-dropdown');

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

},{"../../../MetaMap.js":1,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],56:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('bootstrap-hover-dropdown');

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

},{"../../../MetaMap.js":1,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],57:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('bootstrap-hover-dropdown');

var CONSTANTS = require('../constants/constants');
require('../tools/shims');
var Permissions = require('../app/Permissions');

var html = '\n<div class="page-actions">\n    <div class="btn-group">\n        <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n            <span class="hidden-sm hidden-xs">Actions&nbsp;</span>\n            <i class="fa fa-angle-down"></i>\n        </button>\n        <ul class="dropdown-menu" role="menu">\n            <li each="{ val, i in data }" class="{ start: i == 0, active: i == 0 }">\n                <a if="{ parent.getLinkAllowed(val) }" href="{ parent.getActionLink(val) }">\n                    <i class="{ val.icon }"></i> { val.title }\n                </a>\n            </li>\n            <li class="divider"></li>\n            <li>\n                <a href="#settings">\n                    <i class="fa fa-gear"></i> Settings\n                </a>\n            </li>\n        </ul>\n    </div>\n\n    <span style="padding-left: 5px;">\n        <span if="{ pageName }"\n                id="map_name"\n                data-type="text"\n                data-title="Enter map name"\n                style="vertical-align: middle;">\n            { pageName }\n        </span>\n    </span>\n</div>\n';

module.exports = riot.tag('page-actions', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.data = [];
    this.pageName = 'Home';
    this.url = MetaMap.config.site.db + '.firebaseio.com';
    this.loaded = false;

    var permissions = null;

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
        if (ret && _this.map && permissions) {
            switch (obj.title) {
                case 'Share Map':
                case 'Delete Map':
                    ret = permissions.isMapOwner();
                    break;
            }
        }
        return ret;
    };

    this.updatePageName = function (map) {
        permissions = new Permissions(map);
        _this.map = map || {};
        if (permissions.isMapOwner()) {
            _this.pageName = map.name || '';
        } else {
            _this.pageName = map.name + ' (Shared by ' + map.owner.name + ')';
        }
        if (permissions && permissions.isMapOwner()) {
            $(_this.map_name).editable({ unsavedclass: null }).on('save', function (event, params) {
                MetaMap.MetaFire.setData(params.newValue, CONSTANTS.ROUTES.MAPS_LIST + '/' + _this.mapId + '/name');
            });
            _this.loaded = true;
        }
        _this.update();
    };

    MetaMap.Eventer.every('pageName', function (opts) {
        if (_this.loaded) {
            $(_this.map_name).editable('destroy');
        }
        if (_this.mapId) {
            MetaMap.MetaFire.off(CONSTANTS.ROUTES.MAPS_LIST + '/' + _this.mapId);
            _this.mapId = null;
            _this.map = null;
        }
        if (opts.id) {
            _this.mapId = opts.id;
            MetaMap.MetaFire.on(CONSTANTS.ROUTES.MAPS_LIST + '/' + opts.id, function (map) {
                _this.updatePageName(map);
            });
        }
        _this.pageName = opts.name || 'Home';
        _this.update();
    });

    MetaMap.MetaFire.on('metamap/actions', function (data) {
        _this.data = _.filter(_.sortBy(data, 'order'), function (d) {
            var include = d.archive != true;
            return include;
        });
        _this.update();
    });
});

},{"../../MetaMap":1,"../app/Permissions":18,"../constants/constants":27,"../tools/shims":75,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],58:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageHeader = require('./page-header');
var pageContainer = require('./page-container');
var pageFooter = require('./page-footer');
var CONSTANTS = require('../constants/constants');

var html = '\n<div id="page_body" class="page-header-fixed page-sidebar-reversed">\n\n    <div id="meta_page_header"></div>\n\n    <div class="clearfix">\n    </div>\n\n    <div id="meta_page_container"></div>\n\n</div>';

module.exports = riot.tag('page-body', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('mount', function () {
        riot.mount(_this.meta_page_header, 'page-header');
        riot.mount(_this.meta_page_container, 'page-container');
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        //$(this.page_body).addClass('page-sidebar-reversed');
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        //$(this.page_body).removeClass('page-sidebar-reversed');
    });
});

},{"../../MetaMap":1,"../constants/constants":27,"./page-container":59,"./page-footer":61,"./page-header":62,"riot":"riot"}],59:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageSidebar = require('./page-sidebar');
var pageContent = require('./page-content');

var html = '\n<div class="page-container">\n\n    <div id="meta_page_content"></div>\n</div>\n';

module.exports = riot.tag('page-container', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('mount', function () {
        riot.mount(_this.meta_page_content, 'page-content');
    });
});

},{"../../MetaMap":1,"./page-content":60,"./page-sidebar":65,"riot":"riot"}],60:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');
var _ = require('lodash');
require('./components/quick-sidebar');

var html = '\n<div class="page-content-wrapper">\n    <div id="page-content" class="page-content">\n\n        <div class="page-head"></div>\n\n        <div id="app-container"></div>\n\n        <div id="quick_sidebar_container"></div>\n    </div>\n</div>\n';

module.exports = riot.tag('page-content', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('mount', function () {
        riot.mount(_this.quick_sidebar_container, 'quick-sidebar');
        _this.resize();
    });

    this.resize = function () {
        var width = window.innerWidth - 40 + 'px';
        $(_this['app-container']).css({ width: width });
    };

    $(window).on('resize', function () {
        _this.resize();
    });
});

},{"../../MetaMap":1,"../constants/constants":27,"./components/quick-sidebar":50,"lodash":undefined,"riot":"riot"}],61:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<div class="page-footer" style="position: fixed; bottom: 0;">\n    <div class="page-footer-inner">\n        <a href="#terms">&copy;2015</a>\n    </div>\n</div>\n';

module.exports = riot.tag('page-footer', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],62:[function(require,module,exports){
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

},{"../../MetaMap":1,"./page-actions.js":57,"./page-logo.js":63,"./page-search.js":64,"./page-topmenu":66,"riot":"riot"}],63:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');

var html = '\n<div class ="page-logo">\n    <a id="meta_logo" href="#home">\n        <img src="src/images/metamap_cloud.png" alt="logo" class ="logo-default" />\n    </a>\n    \n    <div id="meta_menu_toggle" class="menu-toggler sidebar-toggler quick-sidebar-toggler" onclick="{ onClick }" style="visibility:{ getDisplay() };">\n        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->\n    </div>\n</div>\n<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">\n</a>\n';

module.exports = riot.tag('page-logo', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.onClick = function () {
        // MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_TOGGLE);
    };

    this.getDisplay = function (el) {

        if (MetaMap && MetaMap.Router && MetaMap.Router.currentPath == 'map') {
            return 'visible';
        } else {
            return 'hidden';
        }
    };

    MetaMap.Eventer.every('pageName', function (opts) {
        _this.update();
    });

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

},{"../../MetaMap":1,"../constants/constants":27,"riot":"riot"}],64:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<!-- DOC: Apply "search-form-expanded" right after the "search-form" class to have half expanded search box -->\n<form class="search-form" action="extra_search.html" method="GET">\n    <div class="input-group">\n        <input type="text" class="form-control input-sm" placeholder="Search..." name="query">\n            <span class="input-group-btn">\n                <a href="javascript:;" class="btn submit">\n                    <i class="fa fa-search"></i>\n                </a>\n            </span>\n        </div>\n</form>\n';

module.exports = riot.tag('page-search', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],65:[function(require,module,exports){
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

},{"../../MetaMap":1,"../constants/constants":27,"riot":"riot"}],66:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('bootstrap-hover-dropdown');

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

},{"./menu/meta-help.js":53,"./menu/meta-notifications.js":54,"./menu/meta-points.js":55,"./menu/meta-user.js":56,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],67:[function(require,module,exports){
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

},{"../../../MetaMap":1,"../../constants/constants":27,"riot":"riot"}],68:[function(require,module,exports){
'use strict';

var riot = require('riot');
var moment = require('moment');
var NProgress = window.NProgress;
var _ = require('lodash');
var $ = require('jquery');
require('datatables');
require('datatables-bootstrap3-plugin');

var CONSTANTS = require('../../constants/constants');
var raw = require('../components/raw');
var ShareMap = require('../../actions/ShareMap');

var html = '\n<div id="my_maps_page" class="portlet box grey-cascade">\n    <div class="portlet-title">\n        <div class="caption">\n            <i class="fa fa-icon-th-large"></i>MetaMaps\n        </div>\n        <div if="{ menu }" class="actions">\n            <a each="{ menu.buttons }" href="{ link }" onclick="{ parent.onActionClick }" class="btn btn-default btn-sm">\n                <i class="{ icon }"></i> { title }\n            </a>\n            <div class="btn-group">\n                <a class="btn btn-default btn-sm" href="javascript:;" data-toggle="dropdown">\n                    <i class="fa fa-cogs"></i> Tools <i class="fa fa-angle-down"></i>\n                </a>\n                <ul class="dropdown-menu pull-right">\n                    <li each="{ menu.menu }" onclick="{ parent.onMenuClick }">\n                        <a href="{ link }">\n                            <i class="{ icon }"></i> { title }\n                        </a>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class="portlet-body">\n        <ul class="nav nav-tabs portlet-tabs">\n            <li onclick="{ parent.onTabSwitch }" each="{ val, i in tabs }" class="{ active: i == 0 }">\n                <a href="#mymaps_1_{ i }" data-toggle="tab" aria-expanded="{ true: i == 0 }">\n                { val.title }</a>\n            </li>\n        </ul>\n        <div class="table-toolbar">\n\n        </div>\n        <div class="tab-content">\n            <div each="{ val, i in tabs }" class="tab-pane fase in { active: i == 0 }" id="mymaps_1_{ i }">\n                <table class="table table-striped table-bordered table-hover" id="mymaps_table_{ i }">\n                    <thead>\n                        <tr>\n                            <th class="table-checkbox">\n                                <input if="{ val.title == \'My Maps\' }" type="checkbox" class="group-checkable" data-set="#mymaps_table_{ i } .checkboxes"/>\n                            </th>\n                            <th>\n                                Action\n                            </th>\n                            <th>\n                                Name\n                            </th>\n                            <th>\n                                Created On\n                            </th>\n                            <th if="{ val.title == \'My Maps\' }">\n                                Status\n                            </th>\n                            </th>\n                            <th if="{ val.title != \'My Maps\' }">\n                                Owner\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr if="{ parent.data && parent.data[i] }" each="{ parent.data[i] }" class="odd gradeX">\n                            <td>\n                                <input if="{ val.title == \'My Maps\' || parent.user.isAdmin }" type="checkbox" class="checkboxes" value="1"/>\n                            </td>\n                            <td>\n                                <button class="btn btn-sm blue filter-submit" onclick="{ parent.onOpen }">Open</button>\n                                <a if="{ val.title == \'My Maps\' }" class="btn btn-sm red" onclick="{ parent.onShare }">Share <i class="fa fa-share"></i></a>\n                                <a if="{ val.title != \'My Maps\' }" class="btn btn-sm red" onclick="{ parent.onCopy }">Copy <i class="fa fa-clone"></i></a>\n                            </td>\n                            <td if="{ editable }" class="meta_editable_{ i }" data-pk="{ id }" data-title="Edit Map Name" style="vertical-align: middle;">{ name }</td>\n                            <td if="{ !editable }" style="vertical-align: middle;">{ name }</td>\n                            <td style="vertical-align: middle;">{ created_at }</td>\n                            <td if="{ val.title == \'My Maps\' }">\n                                <raw content="{ parent.getStatus(this) }"></raw>\n                            </td>\n                            <td if="{ val.title != \'My Maps\' }">\n                                <raw content="{ parent.getOwner(this) }"></raw>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</div>\n';

module.exports = riot.tag('my-maps', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User;
    this.data = null;
    this.menu = null;
    var tabs = [{ title: 'My Maps', order: 0, editable: true }, { title: 'Shared with Me', order: 1, editable: false }, { title: 'Public', order: 2, editable: false }];
    if (this.user.isAdmin) {
        tabs.push({ title: 'All Maps', order: 3, editable: true });
        tabs.push({ title: 'Templates', order: 4, editable: true });
    }
    this.tabs = _.sortBy(tabs, 'order');

    this.currentTab = 'My Maps';

    //
    this.getStatus = function (item) {
        var status = 'Private';
        var code = 'default';
        var html = '';
        if (item.shared_with) {
            if (item.shared_with['*'] && (item.shared_with['*'].read == true || item.shared_with['*'].write == true)) {
                status = 'Public';
                code = 'primary';
            } else {
                _.each(item.shared_with, function (share, key) {
                    if (share.picture && key != '*' && key != 'admin') {
                        html += '<span class="label owner-label" data-toggle="tooltip" data-placement="bottom" title="' + share.name + '"><img alt="' + share.name + '" height="30" width="30" class="img-circle" src="' + share.picture + '"></span>';
                    }
                });
                if (html) {
                    html = '<span class="">Shared with: </span>' + html;
                }
            }
        }
        html = html || '<span class="label label-sm label-' + code + '">' + status + '</span>';

        return html;
    };

    this.getOwner = function (item) {
        var html = '<span class="label owner-label" data-toggle="tooltip" data-placement="bottom" title="' + item.owner.name + '"><img alt="' + item.owner.name + '" height="30" width="30" class="img-circle" src="' + item.owner.picture + '"></span>';
        return html;
    };

    //Events
    this.onOpen = function (event) {
        MetaMap.Router.to('map/' + event.item.id);
    };

    this.onShare = function (event) {
        var opts = {
            map: event.item
        };
        ShareMap.act(opts);
    };

    this.onCopy = function (event) {
        console.log('copy');
    };

    this.onTabSwitch = function (event) {
        _this.currentTab = event.item.val.title;
        _.delay(function () {
            $('.owner-label').tooltip();
        }, 250);
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

    this.on('update', function () {});

    //Riot bindings
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
                        name: 'ChckBx',
                        orderable: false
                    }, {
                        name: 'Action',
                        orderable: false,
                        width: '120px'
                    }, {
                        name: 'Name',
                        orderable: true
                    }, {
                        name: 'Created On',
                        orderable: true
                    }, {
                        name: 'Status',
                        orderable: false
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

                $('.meta_editable_' + idx).editable({ unsavedclass: null }).on('save', function (event, params) {
                    if (this.dataset && this.dataset.pk) {
                        var id = this.dataset.pk;
                        MetaMap.MetaFire.setData(params.newValue, CONSTANTS.ROUTES.MAPS_LIST + '/' + id + '/name');
                    }
                    return true;
                });

                NProgress.done();
            } catch (e) {
                NProgress.done();
                MetaMap.error(e);
            }
        };

        //Fetch All maps
        MetaMap.MetaFire.getChild(CONSTANTS.ROUTES.MAPS_LIST).on('value', function (val) {
            var list = val.val();
            _.each(_this.tabs, function (tab) {
                var maps = null;
                switch (tab.title) {
                    case 'Templates':
                    case 'My Maps':
                        maps = _.map(list, function (obj, key) {
                            if (obj.owner.userId == MetaMap.User.userId) {
                                //Only include my own maps
                                obj.editable = true;
                                obj.id = key;
                                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                                return obj;
                            } else {
                                return;
                            }
                        });
                        break;
                    case 'Shared with Me':
                        maps = _.map(list, function (obj, key) {
                            if (obj.owner.userId != MetaMap.User.userId && //Don't include my own maps
                            obj.shared_with && ( //Exclude anything that isn't shared at all
                            !obj.shared_with['*'] || (obj.shared_with['*'].read != true || obj.shared_with['*'].write != true)) && //Exclude public maps
                            obj.shared_with[MetaMap.User.userId] && ( //Include shares wih my userId
                            obj.shared_with[MetaMap.User.userId].write == true || //Include anything I can write to
                            obj.shared_with[MetaMap.User.userId].read == true) //Include anything I can read from
                            ) {
                                    obj.editable = obj.shared_with[MetaMap.User.userId].write == true;
                                    obj.id = key;
                                    obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                                    return obj;
                                } else {
                                return;
                            }
                        });
                        break;
                    case 'Public':
                        maps = _.map(list, function (obj, key) {
                            if (obj.owner.userId != MetaMap.User.userId && //Don't include my own maps
                            obj.shared_with && ( //Exclude anything that isn't shared at all
                            obj.shared_with['*'] && (obj.shared_with['*'].read == true || obj.shared_with['*'].write == true)) //Include public maps
                            ) {
                                    obj.editable = obj.shared_with['*'].write == true;
                                    obj.id = key;
                                    obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                                    return obj;
                                } else {
                                return;
                            }
                        });
                        break;
                    case 'All Maps':
                        if (_this.user.isAdmin) {
                            maps = _.map(list, function (obj, key) {
                                //Like it says, all maps
                                obj.editable = true;
                                obj.id = key;
                                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                                return obj;
                            });
                        }
                        break;
                }
                if (maps) {
                    maps = _.filter(maps, function (map) {
                        return map && map.id;
                    });
                    buildTable(tab.order, maps);
                }
            });
            _.delay(function () {
                $('.owner-label').tooltip();
            }, 250);
        });
    });
});

},{"../../../MetaMap.js":1,"../../actions/DeleteMap.js":5,"../../actions/ShareMap":12,"../../constants/constants":27,"../components/raw":51,"datatables":undefined,"datatables-bootstrap3-plugin":undefined,"jquery":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],69:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"../../constants/constants":27,"riot":"riot"}],70:[function(require,module,exports){
'use strict';

var $ = require('jquery');
/**
Demo script to handle the theme demo
**/
var Demo = (function () {

    // Handle Theme Settings
    var handleTheme = function handleTheme() {

        var panel = $('.theme-panel');

        if ($(document.getElementById('page_body')).hasClass('page-boxed') === false) {
            $('.layout-option', panel).val("fluid");
        }

        $('.sidebar-option', panel).val("default");
        $('.page-header-option', panel).val("fixed");
        $('.page-footer-option', panel).val("default");
        if ($('.sidebar-pos-option').attr("disabled") === false) {
            $('.sidebar-pos-option', panel).val(Metronic.isRTL() ? 'right' : 'left');
        }

        //handle theme layout
        var resetLayout = function resetLayout() {
            $(document.getElementById('page_body')).removeClass("page-boxed").removeClass("page-footer-fixed").removeClass("page-sidebar-fixed").removeClass("page-header-fixed").removeClass("page-sidebar-reversed");

            $('.page-header > .page-header-inner').removeClass("container");

            if ($('.page-container').parent(".container").size() === 1) {
                $('.page-container').insertAfter('body > .clearfix');
            }

            if ($('.page-footer > .container').size() === 1) {
                $('.page-footer').html($('.page-footer > .container').html());
            } else if ($('.page-footer').parent(".container").size() === 1) {
                $('.page-footer').insertAfter('.page-container');
                $('.scroll-to-top').insertAfter('.page-footer');
            }

            $(".top-menu > .navbar-nav > li.dropdown").removeClass("dropdown-dark");

            $('body > .container').remove();
        };

        var lastSelectedLayout = '';

        var setLayout = function setLayout() {

            var layoutOption = $('.layout-option', panel).val();
            var sidebarOption = $('.sidebar-option', panel).val();
            var headerOption = $('.page-header-option', panel).val();
            var footerOption = $('.page-footer-option', panel).val();
            var sidebarPosOption = $('.sidebar-pos-option', panel).val();
            var sidebarStyleOption = $('.sidebar-style-option', panel).val();
            var sidebarMenuOption = $('.sidebar-menu-option', panel).val();
            var headerTopDropdownStyle = $('.page-header-top-dropdown-style-option', panel).val();

            if (sidebarOption == "fixed" && headerOption == "default") {
                alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.');
                $('.page-header-option', panel).val("fixed");
                $('.sidebar-option', panel).val("fixed");
                sidebarOption = 'fixed';
                headerOption = 'fixed';
            }

            resetLayout(); // reset layout to default state

            if (layoutOption === "boxed") {
                $(document.getElementById('page_body')).addClass("page-boxed");

                // set header
                $('.page-header > .page-header-inner').addClass("container");
                var cont = $('body > .clearfix').after('<div class="container"></div>');

                // set content
                $('.page-container').appendTo('body > .container');

                // set footer
                if (footerOption === 'fixed') {
                    $('.page-footer').html('<div class="container">' + $('.page-footer').html() + '</div>');
                } else {
                    $('.page-footer').appendTo('body > .container');
                }
            }

            if (lastSelectedLayout != layoutOption) {
                //layout changed, run responsive handler:
                Metronic.runResizeHandlers();
            }
            lastSelectedLayout = layoutOption;

            //header
            if (headerOption === 'fixed') {
                $(document.getElementById('page_body')).addClass("page-header-fixed");
                $(".page-header").removeClass("navbar-static-top").addClass("navbar-fixed-top");
            } else {
                $(document.getElementById('page_body')).removeClass("page-header-fixed");
                $(".page-header").removeClass("navbar-fixed-top").addClass("navbar-static-top");
            }

            //sidebar
            if ($(document.getElementById('page_body')).hasClass('page-full-width') === false) {
                if (sidebarOption === 'fixed') {
                    $(document.getElementById('page_body')).addClass("page-sidebar-fixed");
                    $("page-sidebar-menu").addClass("page-sidebar-menu-fixed");
                    $("page-sidebar-menu").removeClass("page-sidebar-menu-default");
                    Layout.initFixedSidebarHoverEffect();
                } else {
                    $(document.getElementById('page_body')).removeClass("page-sidebar-fixed");
                    $("page-sidebar-menu").addClass("page-sidebar-menu-default");
                    $("page-sidebar-menu").removeClass("page-sidebar-menu-fixed");
                    $('.page-sidebar-menu').unbind('mouseenter').unbind('mouseleave');
                }
            }

            // top dropdown style
            if (headerTopDropdownStyle === 'dark') {
                $(".top-menu > .navbar-nav > li.dropdown").addClass("dropdown-dark");
            } else {
                $(".top-menu > .navbar-nav > li.dropdown").removeClass("dropdown-dark");
            }

            //footer
            if (footerOption === 'fixed') {
                $(document.getElementById('page_body')).addClass("page-footer-fixed");
            } else {
                $(document.getElementById('page_body')).removeClass("page-footer-fixed");
            }

            //sidebar style
            if (sidebarStyleOption === 'compact') {
                $(".page-sidebar-menu").addClass("page-sidebar-menu-compact");
            } else {
                $(".page-sidebar-menu").removeClass("page-sidebar-menu-compact");
            }

            //sidebar menu
            if (sidebarMenuOption === 'hover') {
                if (sidebarOption == 'fixed') {
                    $('.sidebar-menu-option', panel).val("accordion");
                    alert("Hover Sidebar Menu is not compatible with Fixed Sidebar Mode. Select Default Sidebar Mode Instead.");
                } else {
                    $(".page-sidebar-menu").addClass("page-sidebar-menu-hover-submenu");
                }
            } else {
                $(".page-sidebar-menu").removeClass("page-sidebar-menu-hover-submenu");
            }

            //sidebar position
            if (Metronic.isRTL()) {
                if (sidebarPosOption === 'left') {
                    $(document.getElementById('page_body')).addClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({
                        placement: 'right'
                    });
                } else {
                    $(document.getElementById('page_body')).removeClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({
                        placement: 'left'
                    });
                }
            } else {
                if (sidebarPosOption === 'right') {
                    $(document.getElementById('page_body')).addClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({
                        placement: 'left'
                    });
                } else {
                    $(document.getElementById('page_body')).removeClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({
                        placement: 'right'
                    });
                }
            }

            Layout.fixContentHeight(); // fix content height
            Layout.initFixedSidebar(); // reinitialize fixed sidebar
        };

        // handle theme colors
        var setColor = function setColor(color) {
            var color_ = Metronic.isRTL() ? color + '-rtl' : color;
            $('#style_color').attr("href", Layout.getLayoutCssPath() + 'themes/' + color_ + ".css");
        };

        $('.theme-colors > li', panel).click(function () {
            var color = $(this).attr("data-theme");
            setColor(color);
            $('ul > li', panel).removeClass("active");
            $(this).addClass("active");

            if (color === 'dark') {
                $('.page-actions .btn').removeClass('red-haze').addClass('btn-default btn-transparent');
            } else {
                $('.page-actions .btn').removeClass('btn-default btn-transparent').addClass('red-haze');
            }
        });

        // set default theme options:

        if ($(document.getElementById('page_body')).hasClass("page-boxed")) {
            $('.layout-option', panel).val("boxed");
        }

        if ($(document.getElementById('page_body')).hasClass("page-sidebar-fixed")) {
            $('.sidebar-option', panel).val("fixed");
        }

        if ($(document.getElementById('page_body')).hasClass("page-header-fixed")) {
            $('.page-header-option', panel).val("fixed");
        }

        if ($(document.getElementById('page_body')).hasClass("page-footer-fixed")) {
            $('.page-footer-option', panel).val("fixed");
        }

        if ($(document.getElementById('page_body')).hasClass("page-sidebar-reversed")) {
            $('.sidebar-pos-option', panel).val("right");
        }

        if ($(".page-sidebar-menu").hasClass("page-sidebar-menu-light")) {
            $('.sidebar-style-option', panel).val("light");
        }

        if ($(".page-sidebar-menu").hasClass("page-sidebar-menu-hover-submenu")) {
            $('.sidebar-menu-option', panel).val("hover");
        }

        var sidebarOption = $('.sidebar-option', panel).val();
        var headerOption = $('.page-header-option', panel).val();
        var footerOption = $('.page-footer-option', panel).val();
        var sidebarPosOption = $('.sidebar-pos-option', panel).val();
        var sidebarStyleOption = $('.sidebar-style-option', panel).val();
        var sidebarMenuOption = $('.sidebar-menu-option', panel).val();

        $('.layout-option, .page-header-top-dropdown-style-option, .page-header-option, .sidebar-option, .page-footer-option, .sidebar-pos-option, .sidebar-style-option, .sidebar-menu-option', panel).change(setLayout);
    };

    // handle theme style
    var setThemeStyle = function setThemeStyle(style) {
        var file = style === 'rounded' ? 'components-rounded' : 'components';
        file = Metronic.isRTL() ? file + '-rtl' : file;

        $('#style_components').attr("href", Metronic.getGlobalCssPath() + file + ".css");

        if ($.cookie) {
            $.cookie('layout-style-option', style);
        }
    };

    return {

        //main function to initiate the theme
        init: function init() {
            // handles style customer tool
            handleTheme();

            // handle layout style change
            $('.theme-panel .layout-style-option').change(function () {
                setThemeStyle($(this).val());
            });

            // set layout style from cookie
            if ($.cookie && $.cookie('layout-style-option') === 'rounded') {
                setThemeStyle($.cookie('layout-style-option'));
                $('.theme-panel .layout-style-option').val($.cookie('layout-style-option'));
            }
        }
    };
})();

module.exports = Demo;

},{"jquery":undefined}],71:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var Metronic = require('./metronic');
/**
Core script to handle the entire theme and core functions
**/
var Layout = (function () {

    var layoutImgPath = 'admin/layout4/img/';

    var layoutCssPath = 'admin/layout4/css/';

    var resBreakpointMd = Metronic.getResponsiveBreakpoint('md');

    //* BEGIN:CORE HANDLERS *//
    // this function handles responsive layout on screen size resize or mobile device rotate.

    // Handle sidebar menu links
    var handleSidebarMenuActiveLink = function handleSidebarMenuActiveLink(mode, el) {
        var url = location.hash.toLowerCase();

        var menu = $('.page-sidebar-menu');

        if (mode === 'click' || mode === 'set') {
            el = $(el);
        } else if (mode === 'match') {
            menu.find("li > a").each(function () {
                var path = $(this).attr("href").toLowerCase();
                // url match condition
                if (path.length > 1 && url.substr(1, path.length - 1) == path.substr(1)) {
                    el = $(this);
                    return;
                }
            });
        }

        if (!el || el.size() == 0) {
            return;
        }

        if (el.attr('href').toLowerCase() === 'javascript:;' || el.attr('href').toLowerCase() === '#') {
            return;
        }

        var slideSpeed = parseInt(menu.data("slide-speed"));
        var keepExpand = menu.data("keep-expanded");

        // disable active states
        menu.find('li.active').removeClass('active');
        menu.find('li > a > .selected').remove();

        if (menu.hasClass('page-sidebar-menu-hover-submenu') === false) {
            menu.find('li.open').each(function () {
                if ($(this).children('.sub-menu').size() === 0) {
                    $(this).removeClass('open');
                    $(this).find('> a > .arrow.open').removeClass('open');
                }
            });
        } else {
            menu.find('li.open').removeClass('open');
        }

        el.parents('li').each(function () {
            $(this).addClass('active');
            $(this).find('> a > span.arrow').addClass('open');

            if ($(this).parent('ul.page-sidebar-menu').size() === 1) {
                $(this).find('> a').append('<span class="selected"></span>');
            }

            if ($(this).children('ul.sub-menu').size() === 1) {
                $(this).addClass('open');
            }
        });

        if (mode === 'click') {
            if (Metronic.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) {
                // close the menu on mobile view while laoding a page
                $('.page-header .responsive-toggler').click();
            }
        }
    };

    // Handle sidebar menu
    var handleSidebarMenu = function handleSidebarMenu() {
        $('.page-sidebar').on('click', 'li > a', function (e) {

            if (Metronic.getViewPort().width >= resBreakpointMd && $(this).parents('.page-sidebar-menu-hover-submenu').size() === 1) {
                // exit of hover sidebar menu
                return;
            }

            if ($(this).next().hasClass('sub-menu') === false) {
                if (Metronic.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) {
                    // close the menu on mobile view while laoding a page
                    $('.page-header .responsive-toggler').click();
                }
                return;
            }

            if ($(this).next().hasClass('sub-menu always-open')) {
                return;
            }

            var parent = $(this).parent().parent();
            var the = $(this);
            var menu = $('.page-sidebar-menu');
            var sub = $(this).next();

            var autoScroll = menu.data("auto-scroll");
            var slideSpeed = parseInt(menu.data("slide-speed"));
            var keepExpand = menu.data("keep-expanded");

            if (keepExpand !== true) {
                parent.children('li.open').children('a').children('.arrow').removeClass('open');
                parent.children('li.open').children('.sub-menu:not(.always-open)').slideUp(slideSpeed);
                parent.children('li.open').removeClass('open');
            }

            var slideOffeset = -200;

            if (sub.is(":visible")) {
                $('.arrow', $(this)).removeClass("open");
                $(this).parent().removeClass("open");
                sub.slideUp(slideSpeed, function () {
                    if (autoScroll === true && $(document.getElementById('page_body')).hasClass('page-sidebar-closed') === false) {
                        if ($(document.getElementById('page_body')).hasClass('page-sidebar-fixed')) {
                            menu.slimScroll({
                                'scrollTo': the.position().top
                            });
                        } else {
                            Metronic.scrollTo(the, slideOffeset);
                        }
                    }
                });
            } else {
                $('.arrow', $(this)).addClass("open");
                $(this).parent().addClass("open");
                sub.slideDown(slideSpeed, function () {
                    if (autoScroll === true && $(document.getElementById('page_body')).hasClass('page-sidebar-closed') === false) {
                        if ($(document.getElementById('page_body')).hasClass('page-sidebar-fixed')) {
                            menu.slimScroll({
                                'scrollTo': the.position().top
                            });
                        } else {
                            Metronic.scrollTo(the, slideOffeset);
                        }
                    }
                });
            }

            e.preventDefault();
        });

        // handle ajax links within sidebar menu
        $('.page-sidebar').on('click', ' li > a.ajaxify', function (e) {
            e.preventDefault();
            Metronic.scrollTop();

            var url = $(this).attr("href");
            var menuContainer = $('.page-sidebar ul');
            var pageContent = $('.page-content');
            var pageContentBody = $('.page-content .page-content-body');

            menuContainer.children('li.active').removeClass('active');
            menuContainer.children('arrow.open').removeClass('open');

            $(this).parents('li').each(function () {
                $(this).addClass('active');
                $(this).children('a > span.arrow').addClass('open');
            });
            $(this).parents('li').addClass('active');

            if (Metronic.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) {
                // close the menu on mobile view while laoding a page
                $('.page-header .responsive-toggler').click();
            }

            Metronic.startPageLoading();

            var the = $(this);

            $.ajax({
                type: "GET",
                cache: false,
                url: url,
                dataType: "html",
                success: function success(res) {

                    if (the.parents('li.open').size() === 0) {
                        $('.page-sidebar-menu > li.open > a').click();
                    }

                    Metronic.stopPageLoading();
                    pageContentBody.html(res);
                    Layout.fixContentHeight(); // fix content height
                    Metronic.initAjax(); // initialize core stuff
                },
                error: function error(xhr, ajaxOptions, thrownError) {
                    Metronic.stopPageLoading();
                    pageContentBody.html('<h4>Could not load the requested content.</h4>');
                }
            });
        });

        // handle ajax link within main content
        $('.page-content').on('click', '.ajaxify', function (e) {
            e.preventDefault();
            Metronic.scrollTop();

            var url = $(this).attr("href");
            var pageContent = $('.page-content');
            var pageContentBody = $('.page-content .page-content-body');

            Metronic.startPageLoading();

            if (Metronic.getViewPort().width < resBreakpointMd && $('.page-sidebar').hasClass("in")) {
                // close the menu on mobile view while laoding a page
                $('.page-header .responsive-toggler').click();
            }

            $.ajax({
                type: "GET",
                cache: false,
                url: url,
                dataType: "html",
                success: function success(res) {
                    Metronic.stopPageLoading();
                    pageContentBody.html(res);
                    Layout.fixContentHeight(); // fix content height
                    Metronic.initAjax(); // initialize core stuff
                },
                error: function error(xhr, ajaxOptions, thrownError) {
                    pageContentBody.html('<h4>Could not load the requested content.</h4>');
                    Metronic.stopPageLoading();
                }
            });
        });

        // handle scrolling to top on responsive menu toggler click when header is fixed for mobile view
        $(document).on('click', '.page-header-fixed-mobile .responsive-toggler', function () {
            Metronic.scrollTop();
        });
    };

    // Helper function to calculate sidebar height for fixed sidebar layout.
    var _calculateFixedSidebarViewportHeight = function _calculateFixedSidebarViewportHeight() {
        var sidebarHeight = Metronic.getViewPort().height - $('.page-header').outerHeight() - 30;
        if ($(document.getElementById('page_body')).hasClass("page-footer-fixed")) {
            sidebarHeight = sidebarHeight - $('.page-footer').outerHeight();
        }

        return sidebarHeight;
    };

    // Handles fixed sidebar
    var handleFixedSidebar = function handleFixedSidebar() {
        var menu = $('.page-sidebar-menu');

        Metronic.destroySlimScroll(menu);

        if ($('.page-sidebar-fixed').size() === 0) {
            return;
        }

        if (Metronic.getViewPort().width >= resBreakpointMd) {
            menu.attr("data-height", _calculateFixedSidebarViewportHeight());
            Metronic.initSlimScroll(menu);
        }
    };

    // Handles sidebar toggler to close/hide the sidebar.
    var handleFixedSidebarHoverEffect = function handleFixedSidebarHoverEffect() {
        var body = $(document.getElementById('page_body'));
        if (body.hasClass('page-sidebar-fixed')) {
            $('.page-sidebar').on('mouseenter', function () {
                if (body.hasClass('page-sidebar-closed')) {
                    $(this).find('.page-sidebar-menu').removeClass('page-sidebar-menu-closed');
                }
            }).on('mouseleave', function () {
                if (body.hasClass('page-sidebar-closed')) {
                    $(this).find('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
                }
            });
        }
    };

    // Hanles sidebar toggler
    var handleSidebarToggler = function handleSidebarToggler() {
        var body = $(document.getElementById('page_body'));

        // handle sidebar show/hide
        $(document.getElementById('page_body')).on('click', '.sidebar-toggler', function (e) {
            var sidebar = $('.page-sidebar');
            var sidebarMenu = $('.page-sidebar-menu');
            $(".sidebar-search", sidebar).removeClass("open");

            if (body.hasClass("page-sidebar-closed")) {
                body.removeClass("page-sidebar-closed");
                sidebarMenu.removeClass("page-sidebar-menu-closed");
                if ($.cookie) {
                    $.cookie('sidebar_closed', '0');
                }
            } else {
                body.addClass("page-sidebar-closed");
                sidebarMenu.addClass("page-sidebar-menu-closed");
                if (body.hasClass("page-sidebar-fixed")) {
                    sidebarMenu.trigger("mouseleave");
                }
                if ($.cookie) {
                    $.cookie('sidebar_closed', '1');
                }
            }

            $(window).trigger('resize');
        });

        handleFixedSidebarHoverEffect();

        // handle the search bar close
        $('.page-sidebar').on('click', '.sidebar-search .remove', function (e) {
            e.preventDefault();
            $('.sidebar-search').removeClass("open");
        });

        // handle the search query submit on enter press
        $('.page-sidebar .sidebar-search').on('keypress', 'input.form-control', function (e) {
            if (e.which == 13) {
                $('.sidebar-search').submit();
                return false; //<---- Add this line
            }
        });

        // handle the search submit(for sidebar search and responsive mode of the header search)
        $('.sidebar-search .submit').on('click', function (e) {
            e.preventDefault();
            if ($(document.getElementById('page_body')).hasClass("page-sidebar-closed")) {
                if ($('.sidebar-search').hasClass('open') === false) {
                    if ($('.page-sidebar-fixed').size() === 1) {
                        $('.page-sidebar .sidebar-toggler').click(); //trigger sidebar toggle button
                    }
                    $('.sidebar-search').addClass("open");
                } else {
                    $('.sidebar-search').submit();
                }
            } else {
                $('.sidebar-search').submit();
            }
        });

        // handle close on body click
        if ($('.sidebar-search').size() !== 0) {
            $('.sidebar-search .input-group').on('click', function (e) {
                e.stopPropagation();
            });

            $(document.getElementById('page_body')).on('click', function () {
                if ($('.sidebar-search').hasClass('open')) {
                    $('.sidebar-search').removeClass("open");
                }
            });
        }
    };

    // Handles the horizontal menu
    var handleHeader = function handleHeader() {
        // handle search box expand/collapse
        $('.page-header').on('click', '.search-form', function (e) {
            $(this).addClass("open");
            $(this).find('.form-control').focus();

            $('.page-header .search-form .form-control').on('blur', function (e) {
                $(this).closest('.search-form').removeClass("open");
                $(this).unbind("blur");
            });
        });

        // handle hor menu search form on enter press
        $('.page-header').on('keypress', '.hor-menu .search-form .form-control', function (e) {
            if (e.which == 13) {
                $(this).closest('.search-form').submit();
                return false;
            }
        });

        // handle header search button click
        $('.page-header').on('mousedown', '.search-form.open .submit', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('.search-form').submit();
        });
    };

    // Handles the go to top button at the footer
    var handleGoTop = function handleGoTop() {
        var offset = 300;
        var duration = 500;

        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            // ios supported
            $(window).bind("touchend touchcancel touchleave", function (e) {
                if ($(this).scrollTop() > offset) {
                    $('.scroll-to-top').fadeIn(duration);
                } else {
                    $('.scroll-to-top').fadeOut(duration);
                }
            });
        } else {
            // general
            $(window).scroll(function () {
                if ($(this).scrollTop() > offset) {
                    $('.scroll-to-top').fadeIn(duration);
                } else {
                    $('.scroll-to-top').fadeOut(duration);
                }
            });
        }

        $('.scroll-to-top').click(function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, duration);
            return false;
        });
    };
    //* END:CORE HANDLERS *//

    return {

        // Main init methods to initialize the layout
        // IMPORTANT!!!: Do not modify the core handlers call order.

        initHeader: function initHeader() {
            handleHeader(); // handles horizontal menu
        },

        setSidebarMenuActiveLink: function setSidebarMenuActiveLink(mode, el) {
            handleSidebarMenuActiveLink(mode, el);
        },

        initSidebar: function initSidebar() {
            //layout handlers
            handleFixedSidebar(); // handles fixed sidebar menu
            handleSidebarMenu(); // handles main menu
            handleSidebarToggler(); // handles sidebar hide/show

            if (Metronic.isAngularJsApp()) {
                handleSidebarMenuActiveLink('match'); // init sidebar active links
            }

            Metronic.addResizeHandler(handleFixedSidebar); // reinitialize fixed sidebar on window resize
        },

        initContent: function initContent() {
            return;
        },

        initFooter: function initFooter() {
            handleGoTop(); //handles scroll to top functionality in the footer
        },

        init: function init() {
            this.initHeader();
            this.initSidebar();
            this.initContent();
            this.initFooter();
        },

        //public function to fix the sidebar and content height accordingly
        fixContentHeight: function fixContentHeight() {
            return;
        },

        initFixedSidebarHoverEffect: function initFixedSidebarHoverEffect() {
            handleFixedSidebarHoverEffect();
        },

        initFixedSidebar: function initFixedSidebar() {
            handleFixedSidebar();
        },

        getLayoutImgPath: function getLayoutImgPath() {
            return Metronic.getAssetsPath() + layoutImgPath;
        },

        getLayoutCssPath: function getLayoutCssPath() {
            return Metronic.getAssetsPath() + layoutCssPath;
        }
    };
})();

module.exports = Layout;

},{"./metronic":72,"jquery":undefined}],72:[function(require,module,exports){
'use strict';

var $ = require('jquery');

/**
Core script to handle the entire theme and core functions
**/
var Metronic = (function () {

    // IE mode
    var _isRTL = false;
    var _isIE8 = false;
    var _isIE9 = false;
    var isIE10 = false;

    var resizeHandlers = [];

    var assetsPath = '../../assets/';

    var globalImgPath = 'global/img/';

    var globalPluginsPath = 'global/plugins/';

    var globalCssPath = 'global/css/';

    // theme layout color set

    var brandColors = {
        'blue': '#89C4F4',
        'red': '#F3565D',
        'green': '#1bbc9b',
        'purple': '#9b59b6',
        'grey': '#95a5a6',
        'yellow': '#F8CB00'
    };

    // initializes main settings
    var handleInit = function handleInit() {

        if ($(document.getElementById('page_body')).css('direction') === 'rtl') {
            _isRTL = true;
        }

        _isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        _isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            $('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || _isIE9 || _isIE8) {
            $('html').addClass('ie'); // detect IE10 version
        }
    };

    // runs callback functions set by Metronic.addResponsiveHandler().
    var _runResizeHandlers = function _runResizeHandlers() {
        // reinitialize other subscribed elements
        for (var i = 0; i < resizeHandlers.length; i++) {
            var each = resizeHandlers[i];
            each.call();
        }
    };

    // handle the layout reinitialization on window resize
    var handleOnResize = function handleOnResize() {
        var resize;
        if (_isIE8) {
            var currheight;
            $(window).resize(function () {
                if (currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    _runResizeHandlers();
                }, 50); // wait 50ms until window resize finishes.
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
                $(window).resize(function () {
                    if (resize) {
                        clearTimeout(resize);
                    }
                    resize = setTimeout(function () {
                        _runResizeHandlers();
                    }, 50); // wait 50ms until window resize finishes.
                });
            }
    };

    // Handles portlet tools & actions
    var handlePortletTools = function handlePortletTools() {
        // handle portlet remove
        $(document.getElementById('page_body')).on('click', '.portlet > .portlet-title > .tools > a.remove', function (e) {
            e.preventDefault();
            var portlet = $(this).closest(".portlet");

            if ($(document.getElementById('page_body')).hasClass('page-portlet-fullscreen')) {
                $(document.getElementById('page_body')).removeClass('page-portlet-fullscreen');
            }

            portlet.find('.portlet-title .fullscreen').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .reload').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .remove').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .config').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip('destroy');

            portlet.remove();
        });

        // handle portlet fullscreen
        $(document.getElementById('page_body')).on('click', '.portlet > .portlet-title .fullscreen', function (e) {
            e.preventDefault();
            var portlet = $(this).closest(".portlet");
            if (portlet.hasClass('portlet-fullscreen')) {
                $(this).removeClass('on');
                portlet.removeClass('portlet-fullscreen');
                $(document.getElementById('page_body')).removeClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', 'auto');
            } else {
                var height = Metronic.getViewPort().height - portlet.children('.portlet-title').outerHeight() - parseInt(portlet.children('.portlet-body').css('padding-top')) - parseInt(portlet.children('.portlet-body').css('padding-bottom'));

                $(this).addClass('on');
                portlet.addClass('portlet-fullscreen');
                $(document.getElementById('page_body')).addClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', height);
            }
        });

        $(document.getElementById('page_body')).on('click', '.portlet > .portlet-title > .tools > a.reload', function (e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            var url = $(this).attr("data-url");
            var _error = $(this).attr("data-error-display");
            if (url) {
                Metronic.blockUI({
                    target: el,
                    animate: true,
                    overlayColor: 'none'
                });
                $.ajax({
                    type: "GET",
                    cache: false,
                    url: url,
                    dataType: "html",
                    success: function success(res) {
                        Metronic.unblockUI(el);
                        el.html(res);
                    },
                    error: function error(xhr, ajaxOptions, thrownError) {
                        Metronic.unblockUI(el);
                        var msg = 'Error on reloading the content. Please check your connection and try again.';
                        if (_error == "toastr" && toastr) {
                            toastr.error(msg);
                        } else if (_error == "notific8" && $.notific8) {
                            $.notific8('zindex', 11500);
                            $.notific8(msg, {
                                theme: 'ruby',
                                life: 3000
                            });
                        } else {
                            alert(msg);
                        }
                    }
                });
            } else {
                // for demo purpose
                Metronic.blockUI({
                    target: el,
                    animate: true,
                    overlayColor: 'none'
                });
                window.setTimeout(function () {
                    Metronic.unblockUI(el);
                }, 1000);
            }
        });

        // load ajax data on page init
        $('.portlet .portlet-title a.reload[data-load="true"]').click();

        $(document.getElementById('page_body')).on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            if ($(this).hasClass("collapse")) {
                $(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            } else {
                $(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    };

    // Handles custom checkboxes & radios using jQuery Uniform plugin
    var handleUniform = function handleUniform() {
        if (!$().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    };

    // Handlesmaterial design checkboxes
    var handleMaterialDesign = function handleMaterialDesign() {

        // Material design ckeckbox and radio effects
        $(document.getElementById('page_body')).on('click', '.md-checkbox > label, .md-radio > label', function () {
            var the = $(this);
            // find the first span which is our circle/bubble
            var el = $(this).children('span:first-child');

            // add the bubble class (we do this so it doesnt show on page load)
            el.addClass('inc');

            // clone it
            var newone = el.clone(true);

            // add the cloned version before our original
            el.before(newone);

            // remove the original so that it is ready to run on next click
            $("." + el.attr("class") + ":last", the).remove();
        });

        if ($(document.getElementById('page_body')).hasClass('page-md')) {
            // Material design click effect
            // credit where credit's due; http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design
            var element, circle, d, x, y;
            $(document.getElementById('page_body')).on('click', 'a.btn, button.btn, input.btn, label.btn', function (e) {
                element = $(this);

                if (element.find(".md-click-circle").length == 0) {
                    element.prepend("<span class='md-click-circle'></span>");
                }

                circle = element.find(".md-click-circle");
                circle.removeClass("md-click-animate");

                if (!circle.height() && !circle.width()) {
                    d = Math.max(element.outerWidth(), element.outerHeight());
                    circle.css({ height: d, width: d });
                }

                x = e.pageX - element.offset().left - circle.width() / 2;
                y = e.pageY - element.offset().top - circle.height() / 2;

                circle.css({ top: y + 'px', left: x + 'px' }).addClass("md-click-animate");

                setTimeout(function () {
                    circle.remove();
                }, 1000);
            });
        }

        // Floating labels
        var handleInput = function handleInput(el) {
            if (el.val() != "") {
                el.addClass('edited');
            } else {
                el.removeClass('edited');
            }
        };

        $(document.getElementById('page_body')).on('keydown', '.form-md-floating-label .form-control', function (e) {
            handleInput($(this));
        });
        $(document.getElementById('page_body')).on('blur', '.form-md-floating-label .form-control', function (e) {
            handleInput($(this));
        });

        $('.form-md-floating-label .form-control').each(function () {
            if ($(this).val().length > 0) {
                $(this).addClass('edited');
            }
        });
    };

    // Handles custom checkboxes & radios using jQuery iCheck plugin
    var handleiCheck = function handleiCheck() {
        if (!$().iCheck) {
            return;
        }

        $('.icheck').each(function () {
            var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
            var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';

            if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
                $(this).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass,
                    insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                });
            } else {
                $(this).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass
                });
            }
        });
    };

    // Handles Bootstrap switches
    var handleBootstrapSwitch = function handleBootstrapSwitch() {
        if (!$().bootstrapSwitch) {
            return;
        }
        $('.make-switch').bootstrapSwitch();
    };

    // Handles Bootstrap confirmations
    var handleBootstrapConfirmation = function handleBootstrapConfirmation() {
        if (!$().confirmation) {
            return;
        }
        $('[data-toggle=confirmation]').confirmation({ container: document.getElementById('page_body'), btnOkClass: 'btn btn-sm btn-success', btnCancelClass: 'btn btn-sm btn-danger' });
    };

    // Handles Bootstrap Accordions.
    var handleAccordions = function handleAccordions() {
        $(document.getElementById('page_body')).on('shown.bs.collapse', '.accordion.scrollable', function (e) {
            Metronic.scrollTo($(e.target));
        });
    };

    // Handles Bootstrap Tabs.
    var handleTabs = function handleTabs() {
        //activate tab if tab id provided in the URL
        if (location.hash) {
            var tabid = encodeURI(location.hash.substr(1));
            $('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function () {
                var tabid = $(this).attr("id");
                $('a[href="#' + tabid + '"]').click();
            });
            $('a[href="#' + tabid + '"]').click();
        }

        if ($().tabdrop) {
            $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
            });
        }
    };

    // Handles Bootstrap Modals.
    var handleModals = function handleModals() {
        // fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class.
        $(document.getElementById('page_body')).on('hide.bs.modal', function () {
            if ($('.modal:visible').size() > 1 && $('html').hasClass('modal-open') === false) {
                $('html').addClass('modal-open');
            } else if ($('.modal:visible').size() <= 1) {
                $('html').removeClass('modal-open');
            }
        });

        // fix page scrollbars issue
        $(document.getElementById('page_body')).on('show.bs.modal', '.modal', function () {
            if ($(this).hasClass("modal-scroll")) {
                $(document.getElementById('page_body')).addClass("modal-open-noscroll");
            }
        });

        // fix page scrollbars issue
        $(document.getElementById('page_body')).on('hide.bs.modal', '.modal', function () {
            $(document.getElementById('page_body')).removeClass("modal-open-noscroll");
        });

        // remove ajax content and remove cache on modal closed
        $(document.getElementById('page_body')).on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
            $(this).removeData('bs.modal');
        });
    };

    // Handles Bootstrap Tooltips.
    var handleTooltips = function handleTooltips() {
        // global tooltips
        $('.tooltips').tooltip();

        // portlet tooltips
        $('.portlet > .portlet-title .fullscreen').tooltip({
            container: document.getElementById('page_body'),
            title: 'Fullscreen'
        });
        $('.portlet > .portlet-title > .tools > .reload').tooltip({
            container: document.getElementById('page_body'),
            title: 'Reload'
        });
        $('.portlet > .portlet-title > .tools > .remove').tooltip({
            container: document.getElementById('page_body'),
            title: 'Remove'
        });
        $('.portlet > .portlet-title > .tools > .config').tooltip({
            container: document.getElementById('page_body'),
            title: 'Settings'
        });
        $('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip({
            container: document.getElementById('page_body'),
            title: 'Collapse/Expand'
        });
    };

    // Handles Bootstrap Dropdowns
    var handleDropdowns = function handleDropdowns() {
        /*
          Hold dropdown on click
        */
        $(document.getElementById('page_body')).on('click', '.dropdown-menu.hold-on-click', function (e) {
            e.stopPropagation();
        });
    };

    var handleAlerts = function handleAlerts() {
        $(document.getElementById('page_body')).on('click', '[data-close="alert"]', function (e) {
            $(this).parent('.alert').hide();
            $(this).closest('.note').hide();
            e.preventDefault();
        });

        $(document.getElementById('page_body')).on('click', '[data-close="note"]', function (e) {
            $(this).closest('.note').hide();
            e.preventDefault();
        });

        $(document.getElementById('page_body')).on('click', '[data-remove="note"]', function (e) {
            $(this).closest('.note').remove();
            e.preventDefault();
        });
    };

    // Handle Hower Dropdowns
    var handleDropdownHover = function handleDropdownHover() {
        $('[data-hover="dropdown"]').not('.hover-initialized').each(function () {
            $(this).dropdownHover();
            $(this).addClass('hover-initialized');
        });
    };

    // Handle textarea autosize
    var handleTextareaAutosize = function handleTextareaAutosize() {
        if (typeof autosize == "function") {
            autosize(document.querySelector('textarea.autosizeme'));
        }
    };

    // Handles Bootstrap Popovers

    // last popep popover
    var lastPopedPopover;

    var handlePopovers = function handlePopovers() {
        $('.popovers').popover();

        // close last displayed popover

        $(document).on('click.bs.popover.data-api', function (e) {
            if (lastPopedPopover) {
                lastPopedPopover.popover('hide');
            }
        });
    };

    // Handles scrollable contents using jQuery SlimScroll plugin.
    var handleScrollers = function handleScrollers() {
        Metronic.initSlimScroll('.scroller');
    };

    // Handles Image Preview using jQuery Fancybox plugin
    var handleFancybox = function handleFancybox() {
        if (!jQuery.fancybox) {
            return;
        }

        if ($(".fancybox-button").size() > 0) {
            $(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    };

    // Fix input placeholder issue for IE8 and IE9
    var handleFixInputPlaceholderForIE = function handleFixInputPlaceholderForIE() {
        //fix html5 placeholder attribute for ie7 & ie8
        if (_isIE8 || _isIE9) {
            // ie8 & ie9
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {
                var input = $(this);

                if (input.val() === '' && input.attr("placeholder") !== '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function () {
                    if (input.val() === '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    };

    // Handle Select2 Dropdowns
    var handleSelect2 = function handleSelect2() {
        if ($().select2) {
            $('.select2me').select2({
                placeholder: "Select",
                allowClear: true
            });
        }
    };

    // handle group element heights
    var handleHeight = function handleHeight() {
        $('[data-auto-height]').each(function () {
            var parent = $(this);
            var items = $('[data-height]', parent);
            var height = 0;
            var mode = parent.attr('data-mode');
            var offset = parseInt(parent.attr('data-offset') ? parent.attr('data-offset') : 0);

            items.each(function () {
                if ($(this).attr('data-height') == "height") {
                    $(this).css('height', '');
                } else {
                    $(this).css('min-height', '');
                }

                var height_ = mode == 'base-height' ? $(this).outerHeight() : $(this).outerHeight(true);
                if (height_ > height) {
                    height = height_;
                }
            });

            height = height + offset;

            items.each(function () {
                if ($(this).attr('data-height') == "height") {
                    $(this).css('height', height);
                } else {
                    $(this).css('min-height', height);
                }
            });
        });
    };

    //* END:CORE HANDLERS *//

    return {

        //main function to initiate the theme
        init: function init() {
            //IMPORTANT!!!: Do not modify the core handlers call order.

            //Core handlers
            handleInit(); // initialize core variables
            handleOnResize(); // set and handle responsive

            //UI Component handlers
            handleMaterialDesign(); // handle material design
            handleUniform(); // hanfle custom radio & checkboxes
            handleiCheck(); // handles custom icheck radio and checkboxes
            handleBootstrapSwitch(); // handle bootstrap switch plugin
            handleScrollers(); // handles slim scrolling contents
            handleFancybox(); // handle fancy box
            handleSelect2(); // handle custom Select2 dropdowns
            handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            handleAlerts(); //handle closabled alerts
            handleDropdowns(); // handle dropdowns
            handleTabs(); // handle tabs
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); //handles accordions
            handleModals(); // handle modals
            handleBootstrapConfirmation(); // handle bootstrap confirmations
            handleTextareaAutosize(); // handle autosize textareas

            //Handle group element heights
            handleHeight();
            this.addResizeHandler(handleHeight); // handle auto calculating height on window resize

            // Hacks
            handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
        },

        //main function to initiate core javascript after ajax complete
        initAjax: function initAjax() {
            handleUniform(); // handles custom radio & checkboxes
            handleiCheck(); // handles custom icheck radio and checkboxes
            handleBootstrapSwitch(); // handle bootstrap switch plugin
            handleDropdownHover(); // handles dropdown hover
            handleScrollers(); // handles slim scrolling contents
            handleSelect2(); // handle custom Select2 dropdowns
            handleFancybox(); // handle fancy box
            handleDropdowns(); // handle dropdowns
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); //handles accordions
            handleBootstrapConfirmation(); // handle bootstrap confirmations
        },

        //init main components
        initComponents: function initComponents() {
            this.initAjax();
        },

        //public function to remember last opened popover that needs to be closed on click
        setLastPopedPopover: function setLastPopedPopover(el) {
            lastPopedPopover = el;
        },

        //public function to add callback a function which will be called on window resize
        addResizeHandler: function addResizeHandler(func) {
            resizeHandlers.push(func);
        },

        //public functon to call _runresizeHandlers
        runResizeHandlers: function runResizeHandlers() {
            _runResizeHandlers();
        },

        // wrMetronicer function to scroll(focus) to an element
        scrollTo: function scrollTo(el, offeset) {
            var pos = el && el.size() > 0 ? el.offset().top : 0;

            if (el) {
                if ($(document.getElementById('page_body')).hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                } else if ($(document.getElementById('page_body')).hasClass('page-header-top-fixed')) {
                    pos = pos - $('.page-header-top').height();
                } else if ($(document.getElementById('page_body')).hasClass('page-header-menu-fixed')) {
                    pos = pos - $('.page-header-menu').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }

            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },

        initSlimScroll: function initSlimScroll(el) {
            $(el).each(function () {
                if ($(this).attr("data-initialized")) {
                    return; // exit
                }

                var height;

                if ($(this).attr("data-height")) {
                    height = $(this).attr("data-height");
                } else {
                    height = $(this).css('height');
                }

                $(this).slimScroll({
                    allowPageScroll: true, // allow page scroll when the element scroll is ended
                    size: '7px',
                    color: $(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb',
                    wrapperClass: $(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv',
                    railColor: $(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea',
                    position: _isRTL ? 'left' : 'right',
                    height: height,
                    alwaysVisible: $(this).attr("data-always-visible") == "1" ? true : false,
                    railVisible: $(this).attr("data-rail-visible") == "1" ? true : false,
                    disableFadeOut: true
                });

                $(this).attr("data-initialized", "1");
            });
        },

        destroySlimScroll: function destroySlimScroll(el) {
            $(el).each(function () {
                if ($(this).attr("data-initialized") === "1") {
                    // destroy existing instance before updating the height
                    $(this).removeAttr("data-initialized");
                    $(this).removeAttr("style");

                    var attrList = {};

                    // store the custom attribures so later we will reassign.
                    if ($(this).attr("data-handle-color")) {
                        attrList["data-handle-color"] = $(this).attr("data-handle-color");
                    }
                    if ($(this).attr("data-wrapper-class")) {
                        attrList["data-wrapper-class"] = $(this).attr("data-wrapper-class");
                    }
                    if ($(this).attr("data-rail-color")) {
                        attrList["data-rail-color"] = $(this).attr("data-rail-color");
                    }
                    if ($(this).attr("data-always-visible")) {
                        attrList["data-always-visible"] = $(this).attr("data-always-visible");
                    }
                    if ($(this).attr("data-rail-visible")) {
                        attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
                    }

                    $(this).slimScroll({
                        wrapperClass: $(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv',
                        destroy: true
                    });

                    var the = $(this);

                    // reassign custom attributes
                    $.each(attrList, function (key, value) {
                        the.attr(key, value);
                    });
                }
            });
        },

        // function to scroll to the top
        scrollTop: function scrollTop() {
            Metronic.scrollTo();
        },

        // wrMetronicer function to  block element(indicate loading)
        blockUI: function blockUI(options) {
            options = $.extend(true, {}, options);
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }

            if (options.target) {
                // element blocking
                var el = $(options.target);
                if (el.height() <= $(window).height()) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else {
                // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },

        // wrMetronicer function to  un-block element(finish loading)
        unblockUI: function unblockUI(target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function onUnblock() {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        },

        startPageLoading: function startPageLoading(options) {
            if (options && options.animate) {
                $('.page-spinner-bar').remove();
                $(document.getElementById('page_body')).append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            } else {
                $('.page-loading').remove();
                $(document.getElementById('page_body')).append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>');
            }
        },

        stopPageLoading: function stopPageLoading() {
            $('.page-loading, .page-spinner-bar').remove();
        },

        alert: function alert(options) {

            options = $.extend(true, {
                container: "", // alerts parent container(by default placed after the page breadcrumbs)
                place: "append", // "append" or "prepend" in container
                type: 'success', // alert's type
                message: "", // alert's message
                close: true, // make alert closable
                reset: true, // close all previouse alerts first
                focus: true, // auto scroll to the alert after shown
                closeInSeconds: 0, // auto close after defined seconds
                icon: "" // put icon before the message
            }, options);

            var id = Metronic.getUniqueID("Metronic_alert");

            var html = '<div id="' + id + '" class="Metronic-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

            if (options.reset) {
                $('.Metronic-alerts').remove();
            }

            if (!options.container) {
                if ($(document.getElementById('page_body')).hasClass("page-container-bg-solid")) {
                    $('.page-title').after(html);
                } else {
                    if ($('.page-bar').size() > 0) {
                        $('.page-bar').after(html);
                    } else {
                        $('.page-breadcrumb').after(html);
                    }
                }
            } else {
                if (options.place == "append") {
                    $(options.container).append(html);
                } else {
                    $(options.container).prepend(html);
                }
            }

            if (options.focus) {
                Metronic.scrollTo($('#' + id));
            }

            if (options.closeInSeconds > 0) {
                setTimeout(function () {
                    $('#' + id).remove();
                }, options.closeInSeconds * 1000);
            }

            return id;
        },

        // initializes uniform elements
        initUniform: function initUniform(els) {
            if (els) {
                $(els).each(function () {
                    if ($(this).parents(".checker").size() === 0) {
                        $(this).show();
                        $(this).uniform();
                    }
                });
            } else {
                handleUniform();
            }
        },

        //wrMetronicer function to update/sync jquery uniform checkbox & radios
        updateUniform: function updateUniform(els) {
            $.uniform.update(els); // update the uniform checkbox & radios UI after the actual input control state changed
        },

        //public function to initialize the fancybox plugin
        initFancybox: function initFancybox() {
            handleFancybox();
        },

        //public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
        getActualVal: function getActualVal(el) {
            el = $(el);
            if (el.val() === el.attr("placeholder")) {
                return "";
            }
            return el.val();
        },

        //public function to get a paremeter by name from URL
        getURLParameter: function getURLParameter(paramName) {
            var searchString = window.location.search.substring(1),
                i,
                val,
                params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },

        // check for device touch support
        isTouchDevice: function isTouchDevice() {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },

        // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        getViewPort: function getViewPort() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        getUniqueID: function getUniqueID(prefix) {
            return 'prefix_' + Math.floor(Math.random() * new Date().getTime());
        },

        // check IE8 mode
        isIE8: function isIE8() {
            return _isIE8;
        },

        // check IE9 mode
        isIE9: function isIE9() {
            return _isIE9;
        },

        //check RTL mode
        isRTL: function isRTL() {
            return _isRTL;
        },

        // check IE8 mode
        isAngularJsApp: function isAngularJsApp() {
            return typeof angular == 'undefined' ? false : true;
        },

        getAssetsPath: function getAssetsPath() {
            return assetsPath;
        },

        setAssetsPath: function setAssetsPath(path) {
            assetsPath = path;
        },

        setGlobalImgPath: function setGlobalImgPath(path) {
            globalImgPath = path;
        },

        getGlobalImgPath: function getGlobalImgPath() {
            return assetsPath + globalImgPath;
        },

        setGlobalPluginsPath: function setGlobalPluginsPath(path) {
            globalPluginsPath = path;
        },

        getGlobalPluginsPath: function getGlobalPluginsPath() {
            return assetsPath + globalPluginsPath;
        },

        getGlobalCssPath: function getGlobalCssPath() {
            return assetsPath + globalCssPath;
        },

        // get layout color code by color name
        getBrandColor: function getBrandColor(name) {
            if (brandColors[name]) {
                return brandColors[name];
            } else {
                return '';
            }
        },

        getResponsiveBreakpoint: function getResponsiveBreakpoint(size) {
            // bootstrap responsive breakpoints
            var sizes = {
                'xs': 480, // extra small
                'sm': 768, // small
                'md': 992, // medium
                'lg': 1200 // large
            };

            return sizes[size] ? sizes[size] : 0;
        }
    };
})();

module.exports = Metronic;

},{"jquery":undefined}],73:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var Metronic = require('./metronic');

/**
Core script to handle the entire theme and core functions
**/
var QuickSidebar = (function () {

    // Handles quick sidebar toggler
    var handleQuickSidebarToggler = function handleQuickSidebarToggler() {
        // quick sidebar toggler
        $('.page-header .quick-sidebar-toggler, .page-quick-sidebar-toggler').click(function (e) {
            $('body').toggleClass('page-quick-sidebar-open');
        });
    };

    // Handles quick sidebar chats
    var handleQuickSidebarChat = function handleQuickSidebarChat() {
        var wrapper = $('.page-quick-sidebar-wrapper');
        var wrapperChat = wrapper.find('.page-quick-sidebar-chat');

        var initChatSlimScroll = function initChatSlimScroll() {
            var chatUsers = wrapper.find('.page-quick-sidebar-chat-users');
            var chatUsersHeight;

            chatUsersHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight();

            // chat user list
            Metronic.destroySlimScroll(chatUsers);
            chatUsers.attr("data-height", chatUsersHeight);
            Metronic.initSlimScroll(chatUsers);

            var chatMessages = wrapperChat.find('.page-quick-sidebar-chat-user-messages');
            var chatMessagesHeight = chatUsersHeight - wrapperChat.find('.page-quick-sidebar-chat-user-form').outerHeight() - wrapperChat.find('.page-quick-sidebar-nav').outerHeight();

            // user chat messages
            Metronic.destroySlimScroll(chatMessages);
            chatMessages.attr("data-height", chatMessagesHeight);
            Metronic.initSlimScroll(chatMessages);
        };

        initChatSlimScroll();
        Metronic.addResizeHandler(initChatSlimScroll); // reinitialize on window resize

        wrapper.find('.page-quick-sidebar-chat-users .media-list > .media').click(function () {
            wrapperChat.addClass("page-quick-sidebar-content-item-shown");
        });

        wrapper.find('.page-quick-sidebar-chat-user .page-quick-sidebar-back-to-list').click(function () {
            wrapperChat.removeClass("page-quick-sidebar-content-item-shown");
        });
    };

    // Handles quick sidebar tasks
    var handleQuickSidebarAlerts = function handleQuickSidebarAlerts() {
        var wrapper = $('.page-quick-sidebar-wrapper');
        var wrapperAlerts = wrapper.find('.page-quick-sidebar-alerts');

        var initAlertsSlimScroll = function initAlertsSlimScroll() {
            var alertList = wrapper.find('.page-quick-sidebar-alerts-list');
            var alertListHeight;

            alertListHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight();

            // alerts list
            Metronic.destroySlimScroll(alertList);
            alertList.attr("data-height", alertListHeight);
            Metronic.initSlimScroll(alertList);
        };

        initAlertsSlimScroll();
        Metronic.addResizeHandler(initAlertsSlimScroll); // reinitialize on window resize
    };

    return {

        init: function init() {
            //layout handlers
            handleQuickSidebarToggler(); // handles quick sidebar's toggler
            handleQuickSidebarChat(); // handles quick sidebar's chats
            handleQuickSidebarAlerts(); // handles quick sidebar's alerts
        }
    };
})();

module.exports = QuickSidebar;

},{"./metronic":72,"jquery":undefined}],74:[function(require,module,exports){
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

},{"moment":undefined}],75:[function(require,module,exports){
'use strict';

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

},{}],76:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL01ldGFNYXAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQWN0aW9uLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQ29weU1hcC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9EZWxldGVNYXAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRmVlZGJhY2suanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvSG9tZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Mb2dvdXQuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTXlNYXBzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL05ld01hcC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9PcGVuTWFwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1NoYXJlTWFwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvQ29uZmlnLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvRXZlbnRlci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvSW50ZWdyYXRpb25zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvUGVybWlzc2lvbnMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC9Sb3V0ZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC9TaGFyaW5nLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvYXV0aDAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC91c2VyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jYW52YXMvY2FudmFzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jYW52YXMvbGF5b3V0LmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvYWN0aW9ucy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NhbnZhcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2RzcnAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9lZGl0U3RhdHVzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWxlbWVudHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ldmVudHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ub3RpZmljYXRpb24uanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9wYWdlcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3JvdXRlcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3RhYnMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy90YWdzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvQWRkVGhpcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL0ZhY2Vib29rLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvR29vZ2xlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvSW50ZXJjb20uanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9OZXdSZWxpYy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1R3aXR0ZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Vc2VyU25hcC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1plbmRlc2suanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9fSW50ZWdyYXRpb25zQmFzZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvcGFnZXMvUGFnZUZhY3RvcnkuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvY2FudmFzL21ldGEtY2FudmFzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9ub2RlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL2NvbXBvbmVudHMvcXVpY2stc2lkZWJhci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9jb21wb25lbnRzL3Jhdy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9kaWFsb2dzL3NoYXJlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1oZWxwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1ub3RpZmljYXRpb25zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1wb2ludHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLXVzZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1hY3Rpb25zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtYm9keS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRhaW5lci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRlbnQuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1mb290ZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1oZWFkZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1sb2dvLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2VhcmNoLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2lkZWJhci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXRvcG1lbnUuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvaG9tZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9teS1tYXBzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL3Rlcm1zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9kZW1vLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9sYXlvdXQuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RlbXBsYXRlL21ldHJvbmljLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9xdWljay1zaWRlYmFyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90b29scy9Db21tb24uanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3NoaW1zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90b29scy91dWlkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25CLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0MsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JCLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQixNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFckMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDekMsSUFBTSxNQUFN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Q0FBQztBQUM3RCxTQUFDLElBQUksQ0FBQyxDQUFDO0tBQ1Y7QUFDRCxLQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ1osS0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxLQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ25DLFFBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCLFdBQU8sSUFBSSxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCdiYWJlbC9wb2x5ZmlsbCcpO1xucmVxdWlyZSgnY29yZS1qcycpO1xud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5yZXF1aXJlKCdqcXVlcnktdWknKTtcbnJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG53aW5kb3cuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xud2luZG93LlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuXG5jb25zdCBBdXRoMCA9IHJlcXVpcmUoJy4vanMvYXBwL2F1dGgwJyk7XG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi9qcy9hcHAvdXNlci5qcycpO1xuY29uc3QgUm91dGVyID0gcmVxdWlyZSgnLi9qcy9hcHAvUm91dGVyLmpzJyk7XG5jb25zdCBFdmVudGVyID0gcmVxdWlyZSgnLi9qcy9hcHAvRXZlbnRlci5qcycpO1xuY29uc3QgUGFnZUZhY3RvcnkgPSByZXF1aXJlKCcuL2pzL3BhZ2VzL1BhZ2VGYWN0b3J5LmpzJyk7XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xuY29uc3QgQ29uZmlnID0gcmVxdWlyZSgnLi9qcy9hcHAvL0NvbmZpZy5qcycpO1xuY29uc3QgZ2EgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9nb29nbGUuanMnKTtcbmNvbnN0IHNoaW1zID0gcmVxdWlyZSgnLi9qcy90b29scy9zaGltcy5qcycpO1xuY29uc3QgQWlyYnJha2VDbGllbnQgPSByZXF1aXJlKCdhaXJicmFrZS1qcycpXG5jb25zdCBJbnRlZ3JhdGlvbnMgPSByZXF1aXJlKCcuL2pzL2FwcC9JbnRlZ3JhdGlvbnMnKVxuXG5jbGFzcyBNZXRhTWFwIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkNvbmZpZyA9IG5ldyBDb25maWcoKTtcbiAgICAgICAgdGhpcy5jb25maWcgPSB0aGlzLkNvbmZpZy5jb25maWc7XG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSB0aGlzLkNvbmZpZy5NZXRhRmlyZTtcbiAgICAgICAgdGhpcy5FdmVudGVyID0gbmV3IEV2ZW50ZXIodGhpcyk7XG4gICAgICAgIHRoaXMuYWlyYnJha2UgPSBuZXcgQWlyYnJha2VDbGllbnQoeyBwcm9qZWN0SWQ6IDExNDkwMCwgcHJvamVjdEtleTogJ2RjOTYxMWRiNmY3NzEyMGNjZWNkMWEyNzM3NDVhNWFlJyB9KTtcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBQcm9taXNlLm9uUG9zc2libHlVbmhhbmRsZWRSZWplY3Rpb24oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICB0aGF0LmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5Db25maWcub25SZWFkeSgpLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKGNvbmZpZy5hdXRoMCk7XG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUubG9naW4oKS50aGVuKChhdXRoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlciA9IG5ldyBVc2VyKHByb2ZpbGUsIGF1dGgsIHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zID0gbmV3IEludGVncmF0aW9ucyh0aGlzLCB0aGlzLlVzZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlVzZXIub25SZWFkeSgpLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFnZUZhY3RvcnkgPSBuZXcgUGFnZUZhY3RvcnkodGhpcy5FdmVudGVyLCB0aGlzLk1ldGFGaXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyID0gbmV3IFJvdXRlcih0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGRlYnVnKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3Quc3RhcnRzV2l0aCgnbG9jYWxob3N0JylcbiAgICB9XG5cbiAgICBsb2codmFsKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHZhbCwgJ2V2ZW50JywgJ2xvZycsICdsYWJlbCcpXG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmNvbnNvbGUuaW5mbyh2YWwpO1xuICAgIH1cblxuICAgIGVycm9yKHZhbCkge1xuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcih2YWwpO1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLnNlbmRFdmVudCh2YWwsICdleGNlcHRpb24nKVxuICAgICAgICAgICAgdGhpcy5haXJicmFrZS5ub3RpZnkodmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dvdXQoKTtcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dvdXQoKTtcbiAgICB9XG59XG5cbmNvbnN0IG1tID0gbmV3IE1ldGFNYXAoKTtcbm1vZHVsZS5leHBvcnRzID0gbW07IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBBY3Rpb24gZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5fYWN0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIF9nZXRBY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgIGxldCByZXQgPSB0aGlzLl9hY3Rpb25zW2FjdGlvbl07XG4gICAgICAgIGlmICghcmV0KSB7XG4gICAgICAgICAgICBsZXQgTWV0aG9kID0gbnVsbDtcbiAgICAgICAgICAgIHN3aXRjaChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLk1BUDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9PcGVuTWFwLmpzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTkVXX01BUDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9OZXdNYXAuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5DT1BZX01BUDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Db3B5TWFwLmpzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9EZWxldGVNYXAuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5NWV9NQVBTOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL015TWFwcy5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Mb2dvdXQuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vU2hhcmVNYXAnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5URVJNU19BTkRfQ09ORElUSU9OUzpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9UZXJtcy5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0ZlZWRiYWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vSG9tZS5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNZXRob2QpIHtcbiAgICAgICAgICAgICAgICByZXQgPSBuZXcgTWV0aG9kKHRoaXMubWV0YUZpcmUsIHRoaXMuZXZlbnRlciwgdGhpcy5wYWdlRmFjdG9yeSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1thY3Rpb25dID0gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgYWN0KGFjdGlvbiwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdCgpO1xuICAgICAgICBsZXQgbWV0aG9kID0gdGhpcy5fZ2V0QWN0aW9uKGFjdGlvbik7XG4gICAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYWN0KC4uLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247IiwiY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihtZXRhRmlyZSwgZXZlbnRlciwgcGFnZUZhY3RvcnkpIHtcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xuICAgICAgICB0aGlzLnBhZ2VGYWN0b3J5ID0gcGFnZUZhY3Rvcnk7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICB9XG5cbiAgICBhY3QoKSB7XG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICB0b2dnbGVTaWRlYmFyKCkge1xuICAgICAgICBpZih0aGlzLnNpZGViYXJPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIG9wZW5TaWRlYmFyKCkge1xuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOKTtcbiAgICB9XG4gICAgXG4gICAgY2xvc2VTaWRlYmFyKCkge1xuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb25CYXNlOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY2xhc3MgQ29weU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignTXVzdCBoYXZlIGEgbWFwIGluIG9yZGVyIHRvIGNvcHkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigob2xkTWFwKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3TWFwID0ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IGAke25ldyBEYXRlKCl9YCxcbiAgICAgICAgICAgICAgICBvd25lcjoge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5tZXRhTWFwLlVzZXIuZGlzcGxheU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMubWV0YU1hcC5Vc2VyLnBpY3R1cmVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMuYXBwZW5kQ29weShvbGRNYXAubmFtZSksXG4gICAgICAgICAgICAgICAgc2hhcmVkX3dpdGg6IHtcbiAgICAgICAgICAgICAgICAgICAgYWRtaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAnKic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHtpZH1gKS50aGVuKChvbGRNYXBEYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcbiAgICAgICAgICAgICAgICBsZXQgbWFwSWQgPSBwdXNoU3RhdGUua2V5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKG9sZE1hcERhdGEsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7bWFwSWR9YCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci50byhgbWFwLyR7bWFwSWR9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFwcGVuZENvcHkoc3RyKSB7XG4gICAgICAgIGxldCByZXQgPSBzdHI7XG4gICAgICAgIGlmICghXy5jb250YWlucyhzdHIsICcoQ29weScpKSB7XG4gICAgICAgICAgICByZXQgPSByZXQgKyAnIChDb3B5IDEpJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBtZXNzID0gc3RyLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICBsZXQgY250ID0gMjtcbiAgICAgICAgICAgIGlmIChtZXNzLmxlbmd0aCAtIG1lc3MubGFzdEluZGV4T2YoJyhDb3B5JykgPD0gNCkge1xuICAgICAgICAgICAgICAgIGxldCBncmJnID0gbWVzc1ttZXNzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIGlmIChncmJnKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYmcgPSBncmJnLnJlcGxhY2UoJyknLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGNudCA9ICtncmJnICsgMTtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gbWVzcy5zbGljZSgwLCBtZXNzLmxlbmd0aCAtIDIpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgKz0gYCAoQ29weSAke2NudH0pYDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb3B5TWFwOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuY2xhc3MgRGVsZXRlTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICBEZWxldGVNYXAuZGVsZXRlQWxsKFtpZF0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZGVsZXRlQWxsKGlkcywgcGF0aCA9IENPTlNUQU5UUy5QQUdFUy5IT01FKSB7XG4gICAgICAgIGNvbnN0IG1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBfLmVhY2goaWRzLCAoaWQpID0+IHtcbiAgICAgICAgICAgICAgICBtZXRhTWFwLk1ldGFGaXJlLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHtpZH1gKTtcbiAgICAgICAgICAgICAgICBtZXRhTWFwLk1ldGFGaXJlLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgbWV0YU1hcC5Sb3V0ZXIudG8ocGF0aCk7XG4gICAgICAgIH0gICAgICAgIFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZWxldGVNYXA7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuXG5jbGFzcyBGZWVkYmFjayBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xuICAgIH1cblxuICAgIGFjdCgpIHtcbiAgICAgICAgc3VwZXIuYWN0KCk7XG4gICAgICAgIHRoaXMudXNlclNuYXAub3BlblJlcG9ydFdpbmRvdygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmVlZGJhY2s7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvaG9tZScpO1xuXG5jbGFzcyBIb21lIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuSE9NRSk7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnSG9tZScgfSwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5jbGFzcyBMb2dvdXQgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5tZXRhTWFwLmxvZ291dCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9nb3V0OyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL215LW1hcHMnKTtcblxuY2xhc3MgTXlNYXBzIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuTVlfTUFQUyk7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuUEFHRVMuTVlfTUFQUywgeyBpZDogaWQgfSwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdNeSBNYXBzJyB9LCAuLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE15TWFwczsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNsYXNzIE5ld01hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdCgpIHtcbiAgICAgICAgc3VwZXIuYWN0KCk7XG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTkVXX01BUH1gKS50aGVuKChibGFua01hcCkgPT4ge1xuICAgICAgICAgICAgbGV0IG5ld01hcCA9IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBgJHtuZXcgRGF0ZSgpfWAsXG4gICAgICAgICAgICAgICAgb3duZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubWV0YU1hcC5Vc2VyLmRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlOiB0aGlzLm1ldGFNYXAuVXNlci5waWN0dXJlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmV3IFVudGl0bGVkIE1hcCcsXG4gICAgICAgICAgICAgICAgc2hhcmVkX3dpdGg6IHtcbiAgICAgICAgICAgICAgICAgICAgYWRtaW46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAnKic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcHVzaFN0YXRlID0gdGhpcy5tZXRhRmlyZS5wdXNoRGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfWApO1xuICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xuICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHttYXBJZH1gKTtcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke21hcElkfWApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld01hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgbWV0YUNhbnZhcyA9IHJlcXVpcmUoJy4uL3RhZ3MvY2FudmFzL21ldGEtY2FudmFzLmpzJyk7XG5cbmNsYXNzIE9wZW5NYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG1hcCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5NRVRBX0NBTlZBUyk7XG4gICAgICAgICAgICAgICAgbWFwLmlkID0gaWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuTkFWLCAnbWFwJywgbWFwLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgbWFwLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLk1BUCwgbWFwLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHRoaXMub3BlblNpZGViYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPcGVuTWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbnJlcXVpcmUoJy4uL3RhZ3MvZGlhbG9ncy9zaGFyZScpXG5cbmNsYXNzIFNoYXJlTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChtYXApID0+IHtcbiAgICAgICAgICAgIG1hcC5pZCA9IGlkXG4gICAgICAgICAgICBTaGFyZU1hcC5hY3QoeyBtYXA6IG1hcCB9KVxuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci5iYWNrKClcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBhY3QobWFwKSB7XG4gICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgIGxldCBtb2RhbCA9IHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfTU9EQUxfRElBTE9HX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLlNIQVJFKVswXVxuICAgICAgICAgICAgbW9kYWwudXBkYXRlKG1hcClcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZU1hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCB0ZXJtcyA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvdGVybXMnKTtcblxuY2xhc3MgVGVybXMgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5URVJNUyk7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnVGVybXMgYW5kIENvbmRpdGlvbnMnIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXJtczsiLCJjb25zdCBNZXRhRmlyZSA9IHJlcXVpcmUoJy4vRmlyZWJhc2UnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG5jb25zdCBjb25maWcgPSAoKSA9PiB7XG4gICAgY29uc3QgU0lURVMgPSB7XG4gICAgICAgIENSTF9TVEFHSU5HOiB7XG4gICAgICAgICAgICBkYjogJ21ldGEtbWFwLXN0YWdpbmcnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXQgPSB7XG4gICAgICAgIGhvc3Q6IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxuICAgICAgICBzaXRlOiB7fVxuICAgIH1cbiAgICBsZXQgc2VnbWVudHMgPSByZXQuaG9zdC5zcGxpdCgnLicpO1xuICAgIGxldCBmaXJzdCA9IHNlZ21lbnRzWzBdO1xuICAgIGlmIChmaXJzdCA9PT0gJ3d3dycpIHtcbiAgICAgICAgZmlyc3QgPSBzZWdtZW50c1sxXTtcbiAgICB9XG4gICAgZmlyc3QgPSBmaXJzdC5zcGxpdCgnOicpWzBdO1xuXG4gICAgc3dpdGNoIChmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XG5cbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcbiAgICAgICAgY2FzZSAnbWV0YS1tYXAtc3RhZ2luZyc6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTLkNSTF9TVEFHSU5HO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbmNsYXNzIENvbmZpZyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0YWdzKSB7XG4gICAgICAgIHRoaXMudGFncyA9IHRhZ3M7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xuICAgIH1cblxuICAgIGdldCBzaXRlKCkge1xuICAgICAgICByZXR1cm4gJ2Zyb250ZW5kJztcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5vbignY29uZmlnJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5vbignbWV0YW1hcC9jYW52YXMnLCAoY2FudmFzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKHRoaXMuY29uZmlnLnNpdGUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHRoaXMuY29uZmlnLnNpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG5jbGFzcyBFdmVudGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcbiAgICAgICAgXG4gICAgICAgIHJpb3Qub2JzZXJ2YWJsZSh0aGlzKTtcblxuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9XG4gICAgfVxuXG4gICAgZXZlcnkoZXZlbnQsIHJlYWN0aW9uKSB7XG4gICAgICAgIC8vbGV0IGNhbGxiYWNrID0gcmVhY3Rpb247XG4gICAgICAgIC8vaWYgKHRoaXMuZXZlbnRzW2V2ZW50XSkge1xuICAgICAgICAvLyAgICBsZXQgcGlnZ3liYWNrID0gdGhpcy5ldmVudHNbZXZlbnRdO1xuICAgICAgICAvLyAgICBjYWxsYmFjayA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgICAgLy8gICAgICAgIHBpZ2d5YmFjayguLi5wYXJhbXMpO1xuICAgICAgICAvLyAgICAgICAgcmVhY3Rpb24oLi4ucGFyYW1zKTtcbiAgICAgICAgLy8gICAgfVxuICAgICAgICAvL31cbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IHJlYWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5vbihldmVudCwgcmVhY3Rpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3JnZXQoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkbyhldmVudCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoZXZlbnQsIC4uLnBhcmFtcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50ZXI7IiwibGV0IEZpcmViYXNlID0gd2luZG93LkZpcmViYXNlO1xubGV0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5sZXQgbG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpXG5cbmNsYXNzIE1ldGFGaXJlIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XG4gICAgfVxuXG4gICAgZ2V0IG1ldGFNYXAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWV0YU1hcCkge1xuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbWV0YU1hcDtcbiAgICB9XG5cbiAgICBsb2dpbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sb2dpbikge1xuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAuZ2V0U2Vzc2lvbigpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChwcm9maWxlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5NZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMuY29uZmlnLnNpdGUuYXV0aDAuYXBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBwcm9maWxlLmlkX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBkZWxlZ2F0aW9uUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2ZpcmViYXNlX3Rva2VuJywgdGhpcy5maXJlYmFzZV90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGlzLmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhLCAuLi5wYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChhdXRoRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IHRoaXMuX2xvZ2luO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpbjtcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcbiAgICB9XG5cbiAgICBnZXREYXRhKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcbiAgICAgICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGNoaWxkLm9uY2UoJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb24ocGF0aCwgY2FsbGJhY2ssIGV2ZW50ID0gJ3ZhbHVlJykge1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgICAgICAgICBsZXQgbWV0aG9kID0gKHNuYXBzaG90KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNuYXBzaG90LmV4aXN0cygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKGV2ZW50LCBtZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gZGF0YSBhdCAke3BhdGh9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNoaWxkLm9uKGV2ZW50LCBtZXRob2QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvZmYocGF0aCwgbWV0aG9kID0gJ3ZhbHVlJywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldERhdGEoZGF0YSwgcGF0aCkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQuc2V0KGRhdGEsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlbGV0ZURhdGEocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXREYXRhKG51bGwsIHBhdGgpO1xuICAgIH1cblxuICAgIHB1c2hEYXRhKGRhdGEsIHBhdGgpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnB1c2goZGF0YSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RGF0YUluVHJhbnNhY3Rpb24oZGF0YSwgcGF0aCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnRyYW5zYWN0aW9uKChjdXJyZW50VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlcnJvcihlLCBwYXRoKSB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcih7IG1lc3NhZ2U6IGBQZXJtaXNzaW9uIGRlbmllZCB0byAke3BhdGh9YCB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgdGhpcy5fbG9naW4gPSBudWxsO1xuICAgICAgICB0aGlzLl9vblJlYWR5ID0gbnVsbDtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnZmlyZWJhc2VfdG9rZW4nKTtcbiAgICAgICAgdGhpcy5mYi51bmF1dGgoKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IE1ldGFGaXJlOyIsImNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG5jb25zdCBUd2lpdGVyID0gcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1R3aXR0ZXInKTtcbmNvbnN0IEZhY2Vib29rID0gcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0ZhY2Vib29rJyk7XG5cbmNsYXNzIEludGVncmF0aW9ucyB7XG5cblx0Y29uc3RydWN0b3IobWV0YU1hcCwgdXNlcikge1xuXHRcdHRoaXMuY29uZmlnID0gbWV0YU1hcC5jb25maWc7XG5cdFx0dGhpcy5tZXRhTWFwID0gbWV0YU1hcDtcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xuXHRcdHRoaXMuX2ZlYXR1cmVzID0ge1xuXHRcdFx0Z29vZ2xlOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvR29vZ2xlJyksXG5cdFx0XHR1c2Vyc25hcDogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1VzZXJTbmFwJyksXG5cdFx0XHRpbnRlcmNvbTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0ludGVyY29tJyksXG5cdFx0XHR6ZW5kZXNrOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvWmVuZGVzaycpLFxuXHRcdFx0YWRkdGhpczogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0FkZFRoaXMnKSxcblx0XHRcdG5ld3JlbGljOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvTmV3UmVsaWMnKVxuXHRcdH07XG5cdH1cblxuXHRpbml0KCkge1xuICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoRmVhdHVyZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGxldCBjb25maWcgPSB0aGlzLmNvbmZpZy5zaXRlW25hbWVdO1xuXHRcdFx0XHRcdHRoaXNbbmFtZV0gPSBuZXcgRmVhdHVyZShjb25maWcsIHRoaXMudXNlcik7XG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5pbml0KCk7XG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5zZXRVc2VyKCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cdHNldFVzZXIoKSB7XG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNldFVzZXIoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgfVxuXHRcdFx0fVxuICAgICAgICB9KTtcblx0fVxuXG5cdHNlbmRFdmVudCh2YWwsIC4uLnBhcmFtcykge1xuICAgICAgICBpZiAoIXRoaXMubWV0YU1hcC5kZWJ1Zykge1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNlbmRFdmVudCh2YWwsIC4uLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblx0fVxuXG5cdHVwZGF0ZVBhdGgoKSB7XG5cblx0fVxuXG5cdGxvZ291dCgpIHtcblx0XHRfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAobmFtZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHRoaXNbbmFtZV0ubG9nb3V0KCk7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHRoaXMubWV0YU1hcC5lcnJvcihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuICAgICAgICB9KTtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zOyIsImNsYXNzIFBlcm1pc3Npb25zIHtcblxuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJylcbiAgICB9XG5cbiAgICBjYW5FZGl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc01hcE93bmVyKCkgfHwgdGhpcy5pc1NoYXJlZEVkaXQoKVxuICAgIH1cblxuICAgIGNhblZpZXcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzTWFwT3duZXIoKSB8fCB0aGlzLmlzU2hhcmVkVmlldygpXG4gICAgfVxuXG4gICAgaXNNYXBPd25lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICYmIHRoaXMubWFwLm93bmVyLnVzZXJJZCA9PSB0aGlzLm1ldGFNYXAuVXNlci51c2VySWRcbiAgICB9XG5cbiAgICBpc1NoYXJlZEVkaXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxuICAgICAgICAgICAgdGhpcy5tYXAuc2hhcmVkX3dpdGggJiZcbiAgICAgICAgICAgICAgICAodGhpcy5tZXRhTWFwLlVzZXIuaXNBZG1pbiB8fFxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdICYmIHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSkgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpKVxuICAgIH1cblxuICAgIGlzU2hhcmVkVmlldygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICYmXG4gICAgICAgICAgICB0aGlzLmlzU2hhcmVkRWRpdCgpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0gJiYgdGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXS5yZWFkID09IHRydWUpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10gJiYgdGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXS5yZWFkID09IHRydWUpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcm1pc3Npb25zOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XG5jb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNsYXNzIFJvdXRlciB7XG4gICAgY29uc3RydWN0b3IobWV0YU1hcCkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9ucyA9IG1ldGFNYXAuSW50ZWdyYXRpb25zO1xuICAgICAgICB0aGlzLnVzZXIgPSBtZXRhTWFwLlVzZXI7XG4gICAgICAgIHRoaXMuUGFnZUZhY3RvcnkgPSBtZXRhTWFwLlBhZ2VGYWN0b3J5O1xuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBtZXRhTWFwLkV2ZW50ZXI7XG4gICAgICAgIHRoaXMuaXNIaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICByaW90LnJvdXRlLnN0YXJ0KCk7XG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgaWQgPSAnJywgYWN0aW9uID0gJycsIC4uLnBhcmFtcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYXRoID0gdGhpcy5nZXRQYXRoKHRhcmdldCk7XG5cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCB0aGlzLnBhdGgpO1xuICAgICAgICAgICAgdGhpcy5QYWdlRmFjdG9yeS5uYXZpZ2F0ZSh0aGlzLnBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcyk7XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbygnaGlzdG9yeScsIHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudG8odGhpcy5jdXJyZW50UGFnZSk7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYWdlKCkge1xuICAgICAgICBsZXQgcGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJztcbiAgICAgICAgaWYgKCF0aGlzLmlzVHJhY2tlZChwYWdlKSkge1xuICAgICAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcbiAgICAgICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSAxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2U7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYXRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXRoO1xuICAgIH1cblxuICAgIGdldFByZXZpb3VzUGFnZShwYWdlTm8gPSAyKSB7XG4gICAgICAgIGxldCBwYWdlID0gJ2hvbWUnO1xuICAgICAgICBsZXQgcGFnZUNudCA9IHRoaXMudXNlci5oaXN0b3J5Lmxlbmd0aDtcbiAgICAgICAgaWYgKHBhZ2VDbnQgPiAwKSB7XG4gICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSBwYWdlTm9dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZTtcbiAgICB9XG5cbiAgICBnZXQgcHJldmlvdXNQYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmV2aW91c1BhZ2UoMik7XG4gICAgfVxuXG4gICAgdHJhY2socGF0aCkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9ucy51cGRhdGVQYXRoKHBhdGgpO1xuICAgIH1cblxuICAgIHRvZ2dsZU1haW4oaGlkZSwgcGF0aCkge1xuICAgICAgICB0aGlzLnRyYWNrKHBhdGgpO1xuICAgICAgICBpZiAoaGlkZSkge1xuICAgICAgICAgICAgdGhpcy5pc0hpZGRlbiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQYXRoKHBhdGgpIHtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG5cbiAgICB0byhwYXRoKSB7XG4gICAgICAgIHBhdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1haW4odHJ1ZSwgcGF0aCk7XG4gICAgICAgICAgICByaW90LnJvdXRlKGAke3BhdGh9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiYWNrKCkge1xuICAgICAgICBsZXQgcGF0aCA9ICdob21lJztcbiAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgIGlmIChwYWdlQ250ID4gMSAmJiAodGhpcy5jdXJyZW50UGFnZSAhPSAnbXltYXBzJyB8fCB0aGlzLmN1cnJlbnRQYWdlICE9IHRoaXMucHJldmlvdXNQYWdlKSkge1xuICAgICAgICAgICAgcGF0aCA9IHRoaXMucHJldmlvdXNQYWdlO1xuICAgICAgICAgICAgbGV0IGJhY2tObyA9IDI7XG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNUcmFja2VkKHBhdGgpICYmIHRoaXMudXNlci5oaXN0b3J5W2JhY2tOb10pIHtcbiAgICAgICAgICAgICAgICBiYWNrTm8gKz0gMTtcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5nZXRQcmV2aW91c1BhZ2UoYmFja05vKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy50byhwYXRoKTtcbiAgICB9XG5cbiAgICBnZXQgZG9Ob3RUcmFjaygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kb05vdFRyYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9kb05vdFRyYWNrID0gW0NPTlNUQU5UUy5BQ1RJT05TLkRFTEVURV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQLCBDT05TVEFOVFMuQUNUSU9OUy5MT0dPVVQsIENPTlNUQU5UUy5BQ1RJT05TLk5FV19NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLLCBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kb05vdFRyYWNrO1xuICAgIH1cblxuICAgIGlzVHJhY2tlZChwYXRoKSB7XG4gICAgICAgIGxldCBwdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XG4gICAgICAgIHJldHVybiBfLmFueSh0aGlzLmRvTm90VHJhY2ssIChwKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIXB0aC5zdGFydHNXaXRoKHApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUm91dGVyOyIsImNvbnN0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcblxuY29uc3QgdG9Cb29sID0gKHZhbCkgPT4ge1xuICAgIGxldCByZXQgPSBmYWxzZTtcbiAgICBpZiAodmFsID09PSB0cnVlIHx8IHZhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0ID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmNvbnRhaW5zKFsndHJ1ZScsICd5ZXMnLCAnMSddLCB2YWwgKyAnJy50b0xvd2VyQ2FzZSgpLnRyaW0oKSkpIHtcbiAgICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuY2xhc3MgU2hhcmluZyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1c2VyKSB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXJcbiAgICAgICAgdGhpcy5fbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxuICAgICAgICB0aGlzLl9mYiA9IHRoaXMuX21ldGFNYXAuTWV0YUZpcmU7XG4gICAgfVxuXG4gICAgYWRkU2hhcmUobWFwLCB1c2VyRGF0YSwgb3B0cyA9IHsgcmVhZDogdHJ1ZSwgd3JpdGU6IGZhbHNlIH0pIHtcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZiLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHJlYWQ6IHRvQm9vbChvcHRzLnJlYWQpLFxuICAgICAgICAgICAgICAgIHdyaXRlOiB0b0Jvb2wob3B0cy53cml0ZSksXG4gICAgICAgICAgICAgICAgbmFtZTogb3B0cy5uYW1lLFxuICAgICAgICAgICAgICAgIHBpY3R1cmU6IG9wdHMucGljdHVyZVxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXG4gICAgICAgICAgICB0aGlzLl9mYi5wdXNoRGF0YSh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGAke3RoaXMudXNlci5kaXNwbGF5TmFtZX0gc2hhcmVkIGEgbWFwLCAke21hcC5uYW1lfSwgd2l0aCB5b3UhYCxcbiAgICAgICAgICAgICAgICBtYXBJZDogbWFwLmlkLFxuICAgICAgICAgICAgICAgIHR5cGU6IENPTlNUQU5UUy5OT1RJRklDQVRJT04uTUFQLFxuICAgICAgICAgICAgICAgIHRpbWU6IGAke25ldyBEYXRlKCl9YFxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdCh1c2VyRGF0YS5pZCl9YClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVNoYXJlKG1hcCwgdXNlckRhdGEpIHtcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZiLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXG4gICAgICAgICAgICB0aGlzLl9mYi5wdXNoRGF0YSh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGAke3RoaXMudXNlci5kaXNwbGF5TmFtZX0gcmVtb3ZlZCBhIG1hcCwgJHttYXAubmFtZX0sIHRoYXQgd2FzIHByZXZpb3VzbHkgc2hhcmVkLmAsXG4gICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKX1gXG4gICAgICAgICAgICB9LCBgJHtDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KHVzZXJEYXRhLmlkKX1gKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZWRpdFNoYXJlKG1hcElkLCB1c2VyRGF0YSwgb3B0cyA9IHsgcmVhZDogdHJ1ZSwgd3JpdGU6IGZhbHNlIH0pIHtcblxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJpbmciLCJjb25zdCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJylcbmNvbnN0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXG5jbGFzcyBBdXRoMCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIG1ldGFNYXApIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IG1ldGFNYXA7XG4gICAgICAgIHRoaXMubG9jayA9IG5ldyBBdXRoMExvY2soY29uZmlnLmFwaSwgY29uZmlnLmFwcCk7XG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzaG93TG9naW4gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIHByb2ZpbGUsIGlkX3Rva2VuLCBjdG9rZW4sIG9wdCwgcmVmcmVzaF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSBwcm9maWxlLmN0b2tlbiA9IGN0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdjdG9rZW4nLCB0aGlzLmN0b2tlbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkX3Rva2VuID0gcHJvZmlsZS5pZF90b2tlbiA9IGlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgdGhpcy5pZF90b2tlbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCB0aGlzLnByb2ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gcHJvZmlsZS5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRTZXNzaW9uID0gZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TG9naW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gICAgfVxuXG4gICAgbGlua0FjY291bnQoKSB7XG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgIGNhbGxiYWNrVVJMOiBsb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpLFxuICAgICAgICAgICAgZGljdDoge1xuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0xpbmsgd2l0aCBhbm90aGVyIGFjY291bnQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoaXMuY3Rva2VuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRmFpbChlcnIsIHJlamVjdCkge1xuICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyKTtcbiAgICAgICAgaWYgKHJlamVjdCkge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2Vzc2lvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBmdWxmaWxsKHRoaXMucHJvZmlsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGhpcy5fZ2V0U2Vzc2lvbikge1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWRfdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgKGVyciwgcHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkZhaWwoZXJyLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2N0b2tlbicpLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN0b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignTm8gc2Vzc2lvbicpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFNlc3Npb247XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3Byb2ZpbGUnKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG51bGw7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gQXV0aDA7XG5cblxuIiwiY29uc3QgdXVpZCA9IHJlcXVpcmUoJy4uL3Rvb2xzL3V1aWQuanMnKTtcbmNvbnN0IENvbW1vbiA9IHJlcXVpcmUoJy4uL3Rvb2xzL0NvbW1vbicpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbmNsYXNzIFVzZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2ZpbGUsIGF1dGgsIGV2ZW50ZXIsIG1ldGFGaXJlKSB7XG4gICAgICAgIHRoaXMuYXV0aCA9IGF1dGg7XG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcbiAgICAgICAgdGhpcy51c2VyS2V5ID0gdXVpZCgpO1xuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xuICAgICAgICAgICAgbGV0IHRyYWNrSGlzdG9yeSA9IF8ub25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmV2ZXJ5KCdoaXN0b3J5JywgKHBhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlzdG9yeS5sZW5ndGggPT0gMCB8fCBwYWdlICE9IHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKHRoaXMuaGlzdG9yeSwgYHVzZXJzLyR7dGhpcy5hdXRoLnVpZH0vaGlzdG9yeWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5vbihgdXNlcnMvJHt0aGlzLmF1dGgudWlkfWAsICh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIuaGlzdG9yeSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSB1c2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrSGlzdG9yeSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwodXNlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcbiAgICB9XG5cbiAgICBnZXQgX2lkZW50aXR5KCkge1xuICAgICAgICBsZXQgcmV0ID0ge307XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUgJiYgdGhpcy5wcm9maWxlLmlkZW50aXR5KSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb2ZpbGUuaWRlbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXQgY3JlYXRlZE9uKCkge1xuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9jcmVhdGVkT24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5jcmVhdGVkX2F0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGR0ID0gbmV3IERhdGUodGhpcy5faWRlbnRpdHkuY3JlYXRlZF9hdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlZE9uID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBkdCxcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IENvbW1vbi5nZXRUaWNrc0Zyb21EYXRlKGR0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlZE9uIHx8IHsgZGF0ZTogbnVsbCwgdGlja3M6IG51bGwgfTtcbiAgICB9XG5cbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XG4gICAgICAgIGxldCByZXQgPSB0aGlzLmZ1bGxOYW1lO1xuICAgICAgICBpZiAocmV0KSB7XG4gICAgICAgICAgICByZXQgPSByZXQuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJldCAmJiB0aGlzLl9pZGVudGl0eS5uaWNrbmFtZSkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmlja25hbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGdldCBmdWxsTmFtZSgpIHtcbiAgICAgICAgbGV0IHJldCA9ICcnO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkubmFtZSkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGdldCBlbWFpbCgpIHtcbiAgICAgICAgbGV0IHJldCA9ICcnO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkuZW1haWwpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LmVtYWlsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZ2V0IHBpY3R1cmUoKSB7XG4gICAgICAgIGxldCByZXQgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnBpY3R1cmUpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LnBpY3R1cmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXQgdXNlcklkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoLnVpZDtcbiAgICB9XG5cbiAgICBnZXQgaXNBZG1pbigpIHtcbiAgICAgICAgbGV0IHJldCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucm9sZXMpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LnJvbGVzLmFkbWluID09IHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0XG4gICAgfVxuXG4gICAgZ2V0IGhpc3RvcnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2ZpbGUuaGlzdG9yeSB8fCBbXTtcbiAgICB9XG5cbiAgICBzYXZlVXNlckVkaXRvck9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICBlZGl0b3Jfb3B0aW9uczogSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlcjsiLCJjb25zdCBqc1BsdW1iID0gd2luZG93LmpzUGx1bWI7XG5jb25zdCBqc1BsdW1iVG9vbGtpdCA9IHdpbmRvdy5qc1BsdW1iVG9vbGtpdDtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5jb25zdCBQZXJtaXNzaW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9QZXJtaXNzaW9ucycpXG5cbnJlcXVpcmUoJy4vbGF5b3V0JylcblxuY2xhc3MgQ2FudmFzIHtcblxuICAgIGNvbnN0cnVjdG9yKG1hcCwgbWFwSWQpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgICAgIHRoaXMubWFwSWQgPSBtYXBJZDtcbiAgICAgICAgdGhpcy50b29sa2l0ID0ge307XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxuICAgICAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xuXG4gICAgICAgIGxldCByZWFkeSA9IHRoaXMubWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcElkfWApLnRoZW4oKG1hcEluZm8pID0+IHtcbiAgICAgICAgICAgIHRoaXMubWFwSW5mbyA9IG1hcEluZm9cbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gbmV3IFBlcm1pc3Npb25zKG1hcEluZm8pXG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IHRocm90dGxlU2F2ZSA9IF8udGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb25zLmNhbkVkaXQoKSkge1xuICAgICAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogd2luZG93LnRvb2xraXQuZXhwb3J0RGF0YSgpLFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkX2J5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YUluVHJhbnNhY3Rpb24ocG9zdERhdGEsIGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xuICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHRoaXMubWFwSWQsICdldmVudCcsICdhdXRvc2F2ZScsICdhdXRvc2F2ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMCk7XG5cbiAgICAgICAgcmVhZHkudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29ybmVyXG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFRvb2xraXQuIHByb3ZpZGUgYSBzZXQgb2YgbWV0aG9kcyB0aGF0IGNvbnRyb2wgd2hvIGNhbiBjb25uZWN0IHRvIHdoYXQsIGFuZCB3aGVuLlxuICAgICAgICAgICAgICAgIHZhciB0b29sa2l0ID0gd2luZG93LnRvb2xraXQgPSBqc1BsdW1iVG9vbGtpdC5uZXdJbnN0YW5jZSh7XG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVN0YXJ0Q29ubmVjdDpmdW5jdGlvbihmcm9tTm9kZSwgZWRnZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb3JuZXIgPSBlZGdlVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBlZGdlVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCB0b05vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9QcmV2ZW50IHNlbGYtcmVmZXJlbmNpbmcgY29ubmVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZyb21Ob2RlID09IHRvTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0JldHdlZW4gdGhlIHNhbWUgdHdvIG5vZGVzLCBvbmx5IG9uZSBwZXJzcGVjdGl2ZSBjb25uZWN0aW9uIG1heSBleGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaChjdXJyZW50Q29ybmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BlcnNwZWN0aXZlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGdlcyA9IGZyb21Ob2RlLmdldEVkZ2VzKHsgZmlsdGVyOiBmdW5jdGlvbihlKSB7IHJldHVybiBlLmRhdGEudHlwZSA9PSAncGVyc3BlY3RpdmUnIH19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8ZWRnZXMubGVuZ3RoOyBpKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZCA9IGVkZ2VzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKChlZC5zb3VyY2UgPT0gZnJvbU5vZGUgJiYgZWQudGFyZ2V0ID09IHRvTm9kZSkgfHwgKGVkLnRhcmdldCA9PSBmcm9tTm9kZSAmJiBlZC5zb3VyY2UgPT0gdG9Ob2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgbm9kZS5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIHZhciBfbmV3Tm9kZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZT10eXBlfHxcImlkZWFcIlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdzo1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDpcImlkZWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6dHlwZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgcHJveHkgKGRyYWcgaGFuZGxlKVxuICAgICAgICAgICAgICAgIHZhciBfbmV3UHJveHkgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8ICdwcm94eVBlcnNwZWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdzoxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6MTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIG1haW5FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5qdGstZGVtby1tYWluXCIpLFxuICAgICAgICAgICAgICAgICAgICBjYW52YXNFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5qdGstZGVtby1jYW52YXNcIik7XG5cblxuICAgICAgICAgICAgICAgIC8vV2hlbmV2ZXIgY2hhbmdpbmcgdGhlIHNlbGVjdGlvbiwgY2xlYXIgd2hhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIHZhciBjbGVhclNlbGVjdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5zZXRTZWxlY3Rpb24ob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNvbmZpZ3VyZSB0aGUgcmVuZGVyZXJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSB0b29sa2l0LnJlbmRlcih7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogY2FudmFzRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNEcmFnZ2FibGU6IHBlcm1pc3Npb25zLmNhbkVkaXQoKSxcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlUGFuQnV0dG9uczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dDp7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjdXN0b20gbGF5b3V0IGZvciB0aGlzIGFwcC4gc2ltcGxlIGV4dGVuc2lvbiBvZiB0aGUgc3ByaW5nIGxheW91dC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJtZXRhbWFwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBob3cgeW91IGNhbiBhc3NvY2lhdGUgZ3JvdXBzIG9mIG5vZGVzLiBIZXJlLCBiZWNhdXNlIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyB3YXkgSSBoYXZlIHJlcHJlc2VudGVkIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGEsIHdlIGVpdGhlciByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgLy8gYSBwYXJ0J3MgXCJwYXJlbnRcIiBhcyB0aGUgcG9zc2UsIG9yIGlmIGl0IGlzIG5vdCBhIHBhcnQgdGhlbiB3ZVxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gdGhlIG5vZGUncyBpZC4gVGhlcmUgYXJlIGFkZFRvUG9zc2UgYW5kIHJlbW92ZUZyb21Qb3NzZVxuICAgICAgICAgICAgICAgICAgICAvLyBtZXRob2RzIHRvbyAob24gdGhlIHJlbmRlcmVyLCBub3QgdGhlIHRvb2xraXQpOyB0aGVzZSBjYW4gYmUgdXNlZFxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHRyYW5zZmVycmluZyBhIHBhcnQgZnJvbSBvbmUgcGFyZW50IHRvIGFub3RoZXIuXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnblBvc3NlOmZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmRhdGEucGFyZW50ID8geyBwb3NzZTpub2RlLmRhdGEucGFyZW50LCBhY3RpdmU6ZmFsc2UgfSA6IG5vZGUuaWQ7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHpvb21Ub0ZpdDpmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlldzp7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlczp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihvYmoubm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbihvYmopIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsTm9kZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJkZWZhdWx0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwici10aGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJpZGVhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsRHJhZ1Byb3h5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcnM6IFsnQ29udGludW91cycsICdDZW50ZXInXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlQZXJzcGVjdGl2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwicHJveHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZWxhdGlvbnNoaXA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcInByb3h5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqLm5vZGUuZGF0YS50eXBlID0gJ3ItdGhpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmoubm9kZS5zZXRUeXBlKCdyLXRoaW5nJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1VwZGF0aW5nIHRoZSBub2RlIHR5cGUgZG9lcyBub3Qgc2VlbSB0byBzdGljazsgaW5zdGVhZCwgY3JlYXRlIGEgbmV3IG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHJlbmRlcmVyLm1hcEV2ZW50TG9jYXRpb24ob2JqLmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gb2JqLm5vZGUuZ2V0RWRnZXMoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC53ID0gZWRnZXNbMF0uc291cmNlLmRhdGEudyAqIDAuNjY3O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQuaCA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLmggKiAwLjY2NztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKGpzUGx1bWIuZXh0ZW5kKF9uZXdOb2RlKFwici10aGluZ1wiKSwgZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZS1jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGlvbnMgb24gdGhlIG5ldyBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8ZWRnZXMubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVkZ2VzW2ldLnNvdXJjZSA9PSBvYmoubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bmV3Tm9kZSwgdGFyZ2V0OmVkZ2VzW2ldLnRhcmdldCwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlZGdlc1tpXS50YXJnZXQgPT0gb2JqLm5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOmVkZ2VzW2ldLnNvdXJjZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RlbGV0ZSB0aGUgcHJveHkgbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlTm9kZShvYmoubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZXM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9iai5lLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT0gJ3JlbGF0aW9uc2hpcC1vdmVybGF5JyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKG9iai5lZGdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JzOltcIkNvbnRpbnVvdXNcIixcIkNvbnRpbnVvdXNcIl0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rvcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcjpbXCJTdGF0ZU1hY2hpbmVcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VydmluZXNzOjE1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcmVsYXRpb25zaGlwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6XCJCbGFua1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5czpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIFwiUGxhaW5BcnJvd1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDoxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6MTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJyZWxhdGlvbnNoaXAtb3ZlcmxheVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBQcm94eTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1yZWxhdGlvbnNoaXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czo1LCBjc3NDbGFzczpcIm9yYW5nZVwiIH1dXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZVByb3h5OntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czoxLCBjc3NDbGFzczpcIm9yYW5nZV9wcm94eVwiIH1dXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBldmVudHM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNEYmxDbGljazpmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGFuIElkZWEgbm9kZSBhdCB0aGUgbG9jYXRpb24gYXQgd2hpY2ggdGhlIGV2ZW50IG9jY3VycmVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSByZW5kZXJlci5tYXBFdmVudExvY2F0aW9uKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTW92ZSAxLzIgdGhlIGhlaWdodCBhbmQgd2lkdGggdXAgYW5kIHRvIHRoZSBsZWZ0IHRvIGNlbnRlciB0aGUgbm9kZSBvbiB0aGUgbW91c2UgY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHdoZW4gaGVpZ2h0L3dpZHRoIGlzIGNvbmZpZ3VyYWJsZSwgcmVtb3ZlIGhhcmQtY29kZWQgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmxlZnQgPSBwb3MubGVmdC01MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy50b3AgPSBwb3MudG9wLTUwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5hZGROb2RlKGpzUGx1bWIuZXh0ZW5kKF9uZXdOb2RlKCksIHBvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVBZGRlZDpfcmVnaXN0ZXJIYW5kbGVycywgLy8gc2VlIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlQWRkZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXlvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyaW91cyBkcmFnL2Ryb3AgaGFuZGxlciBldmVudCBleHBlcmltZW50cyBsaXZlZCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXHRcdFx0XHRcdFx0bm9kZURyb3BwZWQ6ZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdGFsZXJ0KFwibm9kZSBcIiArIHBhcmFtcy5zb3VyY2UuaWQgKyBcIiB3YXMgZHJvcHBlZCBvbiBcIiArIHBhcmFtcy50YXJnZXQuaWQpO1xuXHRcdFx0XHRcdFx0fVxuICAgICAgICAgICAgICAgICAgICB9LFxuXHRcdFx0XHRcdGVsZW1lbnRzRHJvcHBhYmxlOnRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRyYWdPcHRpb25zOntcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjpcIi5zZWdtZW50XCIsICAgICAgIC8vIGNhbid0IGRyYWcgbm9kZXMgYnkgdGhlIGNvbG9yIHNlZ21lbnRzLlxuXHRcdFx0XHRcdFx0c3RvcDpmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Ly8gd2hlbiBfYW55XyBub2RlIHN0b3BzIGRyYWdnaW5nLCBydW4gdGhlIGxheW91dCBhZ2Fpbi5cblx0XHRcdFx0XHRcdFx0Ly8gdGhpcyB3aWxsIGNhdXNlIGNoaWxkIG5vZGVzIHRvIHNuYXAgdG8gdGhlaXIgbmV3IHBhcmVudCwgYW5kIGFsc29cblx0XHRcdFx0XHRcdFx0Ly8gY2xlYW51cCBuaWNlbHkgaWYgYSBub2RlIGlzIGRyb3BwZWQgb24gYW5vdGhlciBub2RlLlxuXHRcdFx0XHRcdFx0XHRyZW5kZXJlci5yZWZyZXNoKCk7XG5cdFx0XHRcdFx0XHR9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5pbml0aWFsaXplKHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogXCIuZGxnXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8gZGlhbG9ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgICAgICAgICAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICBNb3VzZSBoYW5kbGVycy4gU29tZSBhcmUgd2lyZWQgdXA7IGFsbCBsb2cgdGhlIGN1cnJlbnQgbm9kZSBkYXRhIHRvIHRoZSBjb25zb2xlLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgICAgICB2YXIgX3R5cGVzID0gWyBcInJlZFwiLCBcIm9yYW5nZVwiLCBcImdyZWVuXCIsIFwiYmx1ZVwiLCBcInRleHRcIiBdO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNsaWNrTG9nZ2VyID0gZnVuY3Rpb24odHlwZSwgZXZlbnQsIGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50ICsgJyAnICsgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG5vZGUuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50ID09ICdkYmxjbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBfY2xpY2tIYW5kbGVycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1InLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBncmVlbjpmdW5jdGlvbihlbCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdHJywgJ2NsaWNrJywgZWwsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JhbmdlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ08nLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBibHVlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0InLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1QnLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1InLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW46ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignRycsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9IG5vZGUuZGF0YS53ICogMC42Njc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0hlaWdodCA9IG5vZGUuZGF0YS5oICogMC42Njc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4gPSBub2RlLmRhdGEuY2hpbGRyZW4gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0xhYmVsID0gJ1BhcnQnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoe3BhcmVudDpub2RlLmlkLHc6bmV3V2lkdGgsaDpuZXdIZWlnaHQsbGFiZWw6IG5ld0xhYmVsfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmNoaWxkcmVuLnB1c2gobmV3Tm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIucmVsYXlvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignTycsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVBlcnNwZWN0aXZlJykpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bm9kZSwgdGFyZ2V0OnByb3h5Tm9kZSwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwZXJzcGVjdGl2ZVByb3h5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwZXJzcGVjdGl2ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignQicsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVJlbGF0aW9uc2hpcCcpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5vZGUsIHRhcmdldDpwcm94eU5vZGUsIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwUHJveHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpwcm94eU5vZGUsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignVCcsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogXCJkbGdUZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVudGVyIGxhYmVsOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9LOiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC51cGRhdGVOb2RlKG5vZGUsIHsgbGFiZWw6ZC50ZXh0IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6bm9kZS5kYXRhLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgX2N1cnJ5SGFuZGxlciA9IGZ1bmN0aW9uKGVsLCBzZWdtZW50LCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLlwiICsgc2VnbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24oX2VsLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jbGlja0hhbmRsZXJzW1wiY2xpY2tcIl1bc2VnbWVudF0oZWwsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYi5vbihfZWwsIFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NsaWNrSGFuZGxlcnNbXCJkYmxjbGlja1wiXVtzZWdtZW50XShlbCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIHNldHVwIHRoZSBjbGlja2luZyBhY3Rpb25zIGFuZCB0aGUgbGFiZWwgZHJhZy4gRm9yIHRoZSBkcmFnIHdlIGNyZWF0ZSBhblxuICAgICAgICAgICAgICAgIC8vIGluc3RhbmNlIG9mIGpzUGx1bWIgZm9yIG5vdCBvdGhlciBwdXJwb3NlIHRoYW4gdG8gbWFuYWdlIHRoZSBkcmFnZ2luZyBvZlxuICAgICAgICAgICAgICAgIC8vIGxhYmVscy4gV2hlbiBhIGRyYWcgc3RhcnRzIHdlIHNldCB0aGUgem9vbSBvbiB0aGF0IGpzUGx1bWIgaW5zdGFuY2UgdG9cbiAgICAgICAgICAgICAgICAvLyBtYXRjaCBvdXIgY3VycmVudCB6b29tLlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsRHJhZ0hhbmRsZXIgPSBqc1BsdW1iLmdldEluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gX3JlZ2lzdGVySGFuZGxlcnMocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhlcmUgeW91IGhhdmUgcGFyYW1zLmVsLCB0aGUgRE9NIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHBhcmFtcy5ub2RlLCB0aGUgdW5kZXJseWluZyBub2RlLiBpdCBoYXMgYSBgZGF0YWAgbWVtYmVyIHdpdGggdGhlIG5vZGUncyBwYXlsb2FkLlxuICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSBwYXJhbXMuZWwsIG5vZGUgPSBwYXJhbXMubm9kZSwgbGFiZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLm5hbWVcIik7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3R5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY3VycnlIYW5kbGVyKGVsLCBfdHlwZXNbaV0sIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgbGFiZWwgZHJhZ2dhYmxlIChzZWUgbm90ZSBhYm92ZSkuXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsRHJhZ0hhbmRsZXIuZHJhZ2dhYmxlKGxhYmVsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDpmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRHJhZ0hhbmRsZXIuc2V0Wm9vbShyZW5kZXJlci5nZXRab29tKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3A6ZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5sYWJlbFBvc2l0aW9uID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChsYWJlbC5zdHlsZS5sZWZ0LCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLnRvcCwgMTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlU2F2ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIGxhYmVsIGVkaXRhYmxlIHZpYSBhIGRpYWxvZ1xuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGxhYmVsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImRsZ1RleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9LOiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnVwZGF0ZU5vZGUobm9kZSwgeyBsYWJlbDpkLnRleHQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Om5vZGUuZGF0YS5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAqIHNob3dzIGluZm8gaW4gd2luZG93IG9uIGJvdHRvbSByaWdodC5cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIF9pbmZvKHRleHQpIHtcblxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgICAgICAvLyBsb2FkIHRoZSBkYXRhLlxuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1hcCAmJiB0aGF0Lm1hcC5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGF0Lm1hcC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy8gYSBjb3VwbGUgb2YgcmFuZG9tIGV4YW1wbGVzIG9mIHRoZSBmaWx0ZXIgZnVuY3Rpb24sIGFsbG93aW5nIHlvdSB0byBxdWVyeSB5b3VyIGRhdGFcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgICAgICB2YXIgY291bnRFZGdlc09mVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvb2xraXQuZmlsdGVyKGZ1bmN0aW9uKG9iaikgeyByZXR1cm4gb2JqLm9iamVjdFR5cGUgPT0gXCJFZGdlXCIgJiYgb2JqLmRhdGEudHlwZT09PXR5cGU7IH0pLmdldEVkZ2VDb3VudCgpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgZHVtcEVkZ2VDb3VudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSBhcmUgXCIgKyBjb3VudEVkZ2VzT2ZUeXBlKFwicmVsYXRpb25zaGlwXCIpICsgXCIgcmVsYXRpb25zaGlwIGVkZ2VzXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFyZSBcIiArIGNvdW50RWRnZXNPZlR5cGUoXCJwZXJzcGVjdGl2ZVwiKSArIFwiIHBlcnNwZWN0aXZlIGVkZ2VzXCIpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0b29sa2l0LmJpbmQoXCJkYXRhVXBkYXRlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZHVtcEVkZ2VDb3VudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVTYXZlKCk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oXCJyZWxhdGlvbnNoaXBFZGdlRHVtcFwiLCBcImNsaWNrXCIsIGR1bXBFZGdlQ291bnRzKCkpO1xuXG4gICAgICAgICAgICAgICAgLy9DVFJMICsgY2xpY2sgZW5hYmxlcyB0aGUgbGFzc29cbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAnbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlbGV0ZUFsbCA9IGZ1bmN0aW9uKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaW1wbGVtZW50IGxvZ2ljIHRvIGRlbGV0ZSB3aG9sZSBlZGdlK3Byb3h5K2VkZ2Ugc3RydWN0dXJlXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmVhY2hFZGdlKGZ1bmN0aW9uKGksZSkgeyBjb25zb2xlLmxvZyhlKSB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvL1JlY3Vyc2Ugb3ZlciBhbGwgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaE5vZGUoZnVuY3Rpb24oaSxuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjdXJzZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihub2RlICYmIG5vZGUuZGF0YS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxub2RlLmRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSB0b29sa2l0LmdldE5vZGUobm9kZS5kYXRhLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRGVsZXRlIGNoaWxkcmVuIGJlZm9yZSBwYXJlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmVOb2RlKG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNlKG4pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmUoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBtb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAvL21hcCBiYWNrc3BhY2UgdG8gZGVsZXRlIGlmIGFueXRoaW5nIGlzIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZSA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdG9vbGtpdC5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQWxsKHNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlID0gJ3NlbGVjdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRNb2RlKCdzZWxlY3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHRvb2xraXQuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUFsbChzZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vS0xVREdFOlxuICAgICAgICAgICAgICAgIC8vVGhlIFNWRyBzZWdtZW50cyBmb3IgbGV0dGVycyBhbmQgYnV0dG9ucyBhcmUgbm90IGdyb3VwZWQgdG9nZXRoZXIsIHNvIHRoZSBjc3M6aG92ZXIgdHJpY2sgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICAgICAgLy9JbnN0ZWFkLCB1c2UgalF1ZXJ5XG4gICAgICAgICAgICAgICAgY29uc3QgdG9nZ2xlT3BhY2l0eSA9IChub2RlLCBvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL01vdXNlIE92ZXJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxldHRlciA9ICQobm9kZSlcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNzc0NsYXNzID0gbm9kZS5jbGFzc0xpc3RbMV1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1dHRvbiA9ICcnXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY3NzQ2xhc3MudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uID0gJ29yYW5nZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9ICdyZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24gPSAnYmx1ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9ICdncmVlbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChsZXR0ZXIpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoYC4ke2J1dHRvbn0uc2VnbWVudGApLmNzcygnb3BhY2l0eScsIG9uKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQoJy5sZXR0ZXInKS5ob3ZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vTW91c2UgT3ZlclxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVPcGFjaXR5KHRoaXMsIDEpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9Nb3VzZSBPdXRcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICQoJy5zZWdtZW50JykuaG92ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvL01vdXNlIE92ZXJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ29wYWNpdHknLCAxKVxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9Nb3VzZSBPdXRcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcblxuICAgIH1cbn1cblxuLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7XG4iLCIvKipcbiogQ3VzdG9tIGxheW91dCBmb3IgbWV0YW1hcC4gRXh0ZW5kcyB0aGUgU3ByaW5nIGxheW91dC4gQWZ0ZXIgU3ByaW5nIHJ1bnMsIHRoaXNcbiogbGF5b3V0IGZpbmRzICdwYXJ0JyBub2RlcyBhbmQgYWxpZ25zIHRoZW0gdW5kZXJuZWF0aCB0aGVpciBwYXJlbnRzLiBUaGUgYWxpZ25tZW50XG4qIC0gbGVmdCBvciByaWdodCAtIGlzIHNldCBpbiB0aGUgcGFyZW50IG5vZGUncyBkYXRhLCBhcyBgcGFydEFsaWduYC5cbipcbiogTGF5b3V0IGNhbiBiZSBzdXNwZW5kZWQgb24gYSBwZXItbm9kZSBiYXNpcyBieSBzZXR0aW5nIGBzdXNwZW5kTGF5b3V0YCBpbiB0aGUgTm9kZSdzXG4qIGRhdGEuXG4qXG4qIENoaWxkIG5vZGVzIFxuKi9cbjsoZnVuY3Rpb24oKSB7XG5cdFxuXHRmdW5jdGlvbiBjaGlsZE5vZGVDb21wYXJhdG9yKGMxLCBjMikge1xuXHRcdGlmIChjMi5kYXRhLm9yZGVyID09IG51bGwpIHJldHVybiAtMTtcblx0XHRpZiAoYzEuZGF0YS5vcmRlciA9PSBudWxsKSByZXR1cm4gMTtcblx0XHRyZXR1cm4gYzEuZGF0YS5vcmRlciA8IGMyLmRhdGEub3JkZXIgPyAtMSA6IDE7XG5cdH1cblxuICBqc1BsdW1iVG9vbGtpdC5MYXlvdXRzW1wibWV0YW1hcFwiXSA9IGZ1bmN0aW9uKCkge1xuICAgIGpzUGx1bWJUb29sa2l0LkxheW91dHMuU3ByaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgX29uZVNldCA9IGZ1bmN0aW9uKHBhcmVudCwgcGFyYW1zLCB0b29sa2l0KSB7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICB2YXIgcGFkZGluZyA9IHBhcmFtcy5wYXJ0UGFkZGluZyB8fCAyMDtcbiAgICAgIGlmIChwYXJlbnQuZGF0YS5jaGlsZHJlbiAmJiBwYXJlbnQuZGF0YS5zdXNwZW5kTGF5b3V0ICE9PSB0cnVlKSB7XG5cbiAgICAgICAgdmFyIGMgPSBwYXJlbnQuZGF0YS5jaGlsZHJlbixcblx0XHQgIFx0Y2hpbGROb2RlcyA9IF8ubWFwKCBjLCB0b29sa2l0LmdldE5vZGUgKSxcbiAgICAgICAgICAgIHBhcmVudFBvcyA9IHRoaXMuZ2V0UG9zaXRpb24ocGFyZW50LmlkKSxcbiAgICAgICAgICAgIHBhcmVudFNpemUgPSB0aGlzLmdldFNpemUocGFyZW50LmlkKSxcbiAgICAgICAgICAgIG1hZ25ldGl6ZU5vZGVzID0gWyBwYXJlbnQuaWQgXSxcbiAgICAgICAgICAgIGFsaWduID0gKHBhcmVudC5kYXRhLnBhcnRBbGlnbiB8fCBcInJpZ2h0XCIpID09PSBcImxlZnRcIiA/IDAgOiAxLFxuICAgICAgICAgICAgeSA9IHBhcmVudFBvc1sxXSArIHBhcmVudFNpemVbMV0gKyBwYWRkaW5nO1xuXHRcdFxuXHRcdC8vIHNvcnQgbm9kZXNcdFxuXHRcdGNoaWxkTm9kZXMuc29ydChjaGlsZE5vZGVDb21wYXJhdG9yKTtcblx0XHQvLyBhbmQgcnVuIHRocm91Z2ggdGhlbSBhbmQgYXNzaWduIG9yZGVyOyBhbnkgdGhhdCBkaWRuJ3QgcHJldmlvdXNseSBoYXZlIG9yZGVyIHdpbGwgZ2V0IG9yZGVyXG5cdFx0Ly8gc2V0LCBhbmQgYW55IHRoYXQgaGFkIG9yZGVyIHdpbGwgcmV0YWluIHRoZSBzYW1lIHZhbHVlLlxuXHRcdF8uZWFjaChjaGlsZE5vZGVzLCBmdW5jdGlvbihjbiwgaSkge1xuXHRcdFx0Y24uZGF0YS5vcmRlciA9IGk7XG5cdFx0fSk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBjbiA9IGNoaWxkTm9kZXNbaV07XG4gICAgICAgICAgICBpZihjbikge1xuICAgICAgICAgICAgICB2YXIgY2hpbGRTaXplID0gdGhpcy5nZXRTaXplKGNuLmlkKSxcbiAgICAgICAgICAgICAgICAgIHggPSBwYXJlbnRQb3NbMF0gKyAoYWxpZ24gKiAocGFyZW50U2l6ZVswXSAtIGNoaWxkU2l6ZVswXSkpO1xuXG4gICAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb24oY24uaWQsIHgsIHksIHRydWUpO1xuICAgICAgICAgICAgICBtYWduZXRpemVOb2Rlcy5wdXNoKGNuLmlkKTtcbiAgICAgICAgICAgICAgeSArPSAoY2hpbGRTaXplWzFdICsgcGFkZGluZyk7XG4gICAgICAgICAgICB9XG5cdFx0fVxuICAgICAgICAgIFxuXG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gc3Rhc2ggb3JpZ2luYWwgZW5kIGNhbGxiYWNrIGFuZCBvdmVycmlkZS4gcGxhY2UgYWxsIFBhcnQgbm9kZXMgd3J0IHRoZWlyXG4gICAgLy8gcGFyZW50cywgdGhlbiBjYWxsIG9yaWdpbmFsIGVuZCBjYWxsYmFjayBhbmQgZmluYWxseSB0ZWxsIHRoZSBsYXlvdXRcbiAgICAvLyB0byBkcmF3IGl0c2VsZiBhZ2Fpbi5cbiAgICB2YXIgX3N1cGVyRW5kID0gdGhpcy5lbmQ7XG4gICAgdGhpcy5lbmQgPSBmdW5jdGlvbih0b29sa2l0LCBwYXJhbXMpIHtcbiAgICAgIHZhciBuYyA9IHRvb2xraXQuZ2V0Tm9kZUNvdW50KCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5jOyBpKyspIHtcbiAgICAgICAgdmFyIG4gPSB0b29sa2l0LmdldE5vZGVBdChpKTtcbiAgICAgICAgLy8gb25seSBwcm9jZXNzIG5vZGVzIHRoYXQgYXJlIG5vdCBQYXJ0IG5vZGVzICh0aGVyZSBjb3VsZCBvZiBjb3Vyc2UgYmVcbiAgICAgICAgLy8gYSBtaWxsaW9uIHdheXMgb2YgZGV0ZXJtaW5pbmcgd2hhdCBpcyBhIFBhcnQgbm9kZS4uLmhlcmUgSSBqdXN0IHVzZVxuICAgICAgICAvLyBhIHJ1ZGltZW50YXJ5IGNvbnN0cnVjdCBpbiB0aGUgZGF0YSlcbiAgICAgICAgaWYgKG4uZGF0YS5wYXJlbnQgPT0gbnVsbCkge1xuICAgICAgICAgIF9vbmVTZXQobiwgcGFyYW1zLCB0b29sa2l0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3VwZXJFbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gIH07XG5cbn0pKCk7XG4iLCJjb25zdCBBQ1RJT05TID0ge1xuICAgIE1BUDogJ21hcCcsXG4gICAgTkVXX01BUDogJ25ld19tYXAnLFxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcbiAgICBIT01FOiAnaG9tZScsXG4gICAgTVlfTUFQUzogJ215bWFwcycsXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICd0ZXJtcycsXG4gICAgTE9HT1VUOiAnbG9nb3V0JyxcbiAgICBGRUVEQkFDSzogJ2ZlZWRiYWNrJyxcbiAgICBTSEFSRV9NQVA6ICdzaGFyZV9tYXAnXG59O1xuXG5PYmplY3QuZnJlZXplKEFDVElPTlMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFDVElPTlM7IiwiY29uc3QgQ0FOVkFTID0ge1xuICAgIExFRlQ6ICdsZWZ0JyxcbiAgICBSSUdIVDogJ3JpZ2h0J1xufTtcblxuT2JqZWN0LmZyZWV6ZShDQU5WQVMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENBTlZBUzsiLCJjb25zdCBDT05TVEFOVFMgPSB7XG5cdEFDVElPTlM6IHJlcXVpcmUoJy4vYWN0aW9ucycpLFxuXHRDQU5WQVM6IHJlcXVpcmUoJy4vY2FudmFzJyksXG5cdERTUlA6IHJlcXVpcmUoJy4vZHNycCcpLFxuXHRFRElUX1NUQVRVUzogcmVxdWlyZSgnLi9lZGl0U3RhdHVzJyksXG5cdEVMRU1FTlRTOiByZXF1aXJlKCcuL2VsZW1lbnRzJyksXG4gICAgRVZFTlRTOiByZXF1aXJlKCcuL2V2ZW50cycpLFxuICAgIE5PVElGSUNBVElPTjogcmVxdWlyZSgnLi9ub3RpZmljYXRpb24nKSxcblx0UEFHRVM6IHJlcXVpcmUoJy4vcGFnZXMnKSxcblx0Uk9VVEVTOiByZXF1aXJlKCcuL3JvdXRlcycpLFxuXHRUQUJTOiByZXF1aXJlKCcuL3RhYnMnKSxcblx0VEFHUzogcmVxdWlyZSgnLi90YWdzJylcbn07XG5cbk9iamVjdC5mcmVlemUoQ09OU1RBTlRTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDT05TVEFOVFM7IiwiY29uc3QgRFNSUCA9IHtcblx0RDogJ0QnLFxuXHRTOiAnUycsXG5cdFI6ICdSJyxcblx0UDogJ1AnXG59XG5cbk9iamVjdC5mcmVlemUoRFNSUCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRFNSUDsiLCJjb25zdCBzdGF0dXMgPSB7XG4gICAgTEFTVF9VUERBVEVEOiAnJyxcbiAgICBSRUFEX09OTFk6ICdWaWV3IG9ubHknLFxuICAgIFNBVklORzogJ1NhdmluZy4uLicsXG4gICAgU0FWRV9PSzogJ0FsbCBjaGFuZ2VzIHNhdmVkJyxcbiAgICBTQVZFX0ZBSUxFRDogJ0NoYW5nZXMgY291bGQgbm90IGJlIHNhdmVkJ1xufTtcblxuT2JqZWN0LmZyZWV6ZShzdGF0dXMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXR1czsiLCJjb25zdCBFTEVNRU5UUyA9IHtcbiAgICBBUFBfQ09OVEFJTkVSOiAnYXBwLWNvbnRhaW5lcicsXG4gICAgTUVUQV9QUk9HUkVTUzogJ21ldGFfcHJvZ3Jlc3MnLFxuICAgIE1FVEFfUFJPR1JFU1NfTkVYVDogJ21ldGFfcHJvZ3Jlc3NfbmV4dCcsXG4gICAgTUVUQV9NT0RBTF9ESUFMT0dfQ09OVEFJTkVSOiAnbWV0YV9tb2RhbF9kaWFsb2dfY29udGFpbmVyJ1xufTtcblxuT2JqZWN0LmZyZWV6ZShFTEVNRU5UUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRUxFTUVOVFM7IiwiY29uc3QgRVZFTlRTID0ge1xuXHRTSURFQkFSX09QRU46ICdzaWRlYmFyLW9wZW4nLFxuXHRTSURFQkFSX0NMT1NFOiAnc2lkZWJhci1jbG9zZScsXG5cdFNJREVCQVJfVE9HR0xFOiAnc2lkZWJhci10b2dnbGUnLFxuXHRQQUdFX05BTUU6ICdwYWdlTmFtZScsXG5cdE5BVjogJ25hdicsXG5cdE1BUDogJ21hcCdcbn1cblxuT2JqZWN0LmZyZWV6ZShFVkVOVFMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVWRU5UUzsiLCJjb25zdCBOT1RJRklDQVRJT04gPSB7XG5cdE1BUDogJ21hcCdcbn1cblxuT2JqZWN0LmZyZWV6ZShOT1RJRklDQVRJT04pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5PVElGSUNBVElPTjsiLCJjb25zdCBBQ1RJT05TID0gcmVxdWlyZSgnLi9hY3Rpb25zLmpzJyk7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNvbnN0IFBBR0VTID0ge1xuICAgIE1BUDogJ21hcCcsXG4gICAgTkVXX01BUDogJ25ld19tYXAnLFxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcbiAgICBNWV9NQVBTOiAnbXltYXBzJyxcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcbiAgICBIT01FOiAnaG9tZSdcbn07XG5cbl8uZXh0ZW5kKClcblxuT2JqZWN0LmZyZWV6ZShQQUdFUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUEFHRVM7IiwiY29uc3QgUk9VVEVTID0ge1xuICAgIE1BUFNfTElTVDogJ21hcHMvbGlzdC8nLFxuICAgIE1BUFNfREFUQTogJ21hcHMvZGF0YS8nLFxuICAgIE1BUFNfTkVXX01BUDogJ21hcHMvbmV3LW1hcC8nLFxuICAgIFRFUk1TX0FORF9DT05ESVRJT05TOiAnbWV0YW1hcC90ZXJtcy1hbmQtY29uZGl0aW9ucy8nLFxuICAgIEhPTUU6ICdtZXRhbWFwL2hvbWUvJyxcbiAgICBOT1RJRklDQVRJT05TOiAndXNlcnMvezB9L25vdGlmaWNhdGlvbnMnXG59O1xuXG5PYmplY3QuZnJlZXplKFJPVVRFUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUk9VVEVTOyIsImNvbnN0IFRBQlMgPSB7XG4gICAgVEFCX0lEX1BSRVNFTlRFUiA6ICdwcmVzZW50ZXItdGFiJyxcbiAgICBUQUJfSURfQU5BTFlUSUNTX01BUCA6ICdhbmFseXRpY3MtdGFiLW1hcCcsXG4gICAgVEFCX0lEX0FOQUxZVElDU19USElORyA6ICdhbmFseXRpY3MtdGFiLXRoaW5nJyxcbiAgICBUQUJfSURfUEVSU1BFQ1RJVkVTIDogJ3BlcnNwZWN0aXZlcy10YWInLFxuICAgIFRBQl9JRF9ESVNUSU5DVElPTlMgOiAnZGlzdGluY3Rpb25zLXRhYicsXG4gICAgVEFCX0lEX0FUVEFDSE1FTlRTIDogJ2F0dGFjaG1lbnRzLXRhYicsXG4gICAgVEFCX0lEX0dFTkVSQVRPUiA6ICdnZW5lcmF0b3ItdGFiJyxcbiAgICBUQUJfSURfU1RBTkRBUkRTIDogJ3N0YW5kYXJkcy10YWInXG59O1xuT2JqZWN0LmZyZWV6ZShUQUJTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUQUJTOyIsImNvbnN0IFRBR1MgPSB7XG4gICAgTUVUQV9DQU5WQVM6ICdtZXRhLWNhbnZhcycsXG4gICAgSE9NRTogJ2hvbWUnLFxuICAgIFRFUk1TOiAndGVybXMnLFxuICAgIE1ZX01BUFM6ICdteS1tYXBzJyxcbiAgICBTSEFSRTogJ3NoYXJlJ1xufTtcblxuT2JqZWN0LmZyZWV6ZShUQUdTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUQUdTOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcblxuY2xhc3MgQWRkVGhpcyBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XG4gICAgICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXG4gICAgICAgICAgICAgICAgdCA9IHdpbmRvdy5hZGR0aGlzIHx8IHt9O1xuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xuICAgICAgICAgICAganMuaWQgPSBpZDtcbiAgICAgICAgICAgIGpzLnNyYyA9IGAvL3M3LmFkZHRoaXMuY29tL2pzLzMwMC9hZGR0aGlzX3dpZGdldC5qcyNwdWJpZD0ke2NvbmZpZy5wdWJpZH1gO1xuICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuXG4gICAgICAgICAgICB0Ll9lID0gW107XG4gICAgICAgICAgICB0LnJlYWR5ID0gZnVuY3Rpb24gKGYpIHtcbiAgICAgICAgICAgICAgICB0Ll9lLnB1c2goZik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwiYWRkLXRoaXMtanNcIikpO1xuICAgICAgICB0aGlzLmFkZHRoaXMgPSB3aW5kb3cuYWRkdGhpcztcbiAgICB9XG4gICAgXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgICAgICB0aGlzLmFkZHRoaXMgPSB0aGlzLmFkZHRoaXMgfHwgd2luZG93LmFkZHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZHRoaXM7XG4gICAgfVxuICAgIFxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLmluaXQoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWRkVGhpcztcblxuXG4iLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xuXG5jbGFzcyBGYWNlYm9vayBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XG4gICAgICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF07XG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcbiAgICAgICAgICAgIGpzLmlkID0gaWQ7XG4gICAgICAgICAgICBqcy5zcmMgPSBcIi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvc2RrLmpzXCI7XG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG4gICAgICAgIH0gKGRvY3VtZW50LCAnc2NyaXB0JywgJ2ZhY2Vib29rLWpzc2RrJykpO1xuICAgICAgICB0aGlzLkZCID0gd2luZG93LkZCO1xuICAgIH1cbiAgICBcbiAgICBpbml0KCkge1xuICAgICAgICBzdXBlci5pbml0KCk7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uaW5pdCh7XG4gICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuYXBwaWQsXG4gICAgICAgICAgICB4ZmJtbDogdGhpcy5jb25maWcueGZibWwsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLmNvbmZpZy52ZXJzaW9uXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uRXZlbnQuc3Vic2NyaWJlKCdlZGdlLmNyZWF0ZScsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcbiAgICAgICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCdmYWNlYm9vaycsIHRhcmdldFVybCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uRXZlbnQuc3Vic2NyaWJlKCdlZGdlLnJlbW92ZScsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcbiAgICAgICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCdmYWNlYm9vaycsIHRhcmdldFVybCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uRXZlbnQuc3Vic2NyaWJlKCdtZXNzYWdlLnNlbmQnLCBmdW5jdGlvbiAodGFyZ2V0VXJsKSB7XG4gICAgICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgnZmFjZWJvb2snLCB0YXJnZXRVcmwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgICAgICB0aGlzLkZCID0gdGhpcy5GQiB8fCB3aW5kb3cuRkI7XG4gICAgICAgIHJldHVybiB0aGlzLkZCO1xuICAgIH1cbiAgICBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGYWNlYm9vaztcblxuXG4iLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXG5cbmNsYXNzIEdvb2dsZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XG4gICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xuICAgIH0pKCk7XG4gICAgICBcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcbiAgICAoZnVuY3Rpb24gKHcsIGQsIHMsIGwsIGkpIHtcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xuICAgICAgICAnZ3RtLnN0YXJ0JzpcbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xuICAgICAgfSk7IGxldCBmID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XG4gICAgICAgICcvL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndG0uanM/aWQ9JyArIGkgKyBkbDsgZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLCBmKTtcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJ2RhdGFMYXllcicsIHRoaXMuY29uZmlnLnRhZ21hbmFnZXIpO1xuXG4gICAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XG4gICAgICBpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXSA9IHI7IGlbcl0gPSBpW3JdIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xuICAgICAgfSwgaVtyXS5sID0gMSAqIG5ldyBEYXRlKCk7IGEgPSBzLmNyZWF0ZUVsZW1lbnQobyksXG4gICAgICBtID0gcy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTsgYS5hc3luYyA9IDE7IGEuc3JjID0gZztcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcblxuICB9XG5cbiAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcbiAgICByZXR1cm4gdGhpcy5nYTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgc3VwZXIuaW5pdCgpO1xuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xuICAgIGxldCBkb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcbiAgICBpZihkb21haW4uc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcbiAgICAgIG1vZGUgPSAnbm9uZSc7XG4gICAgfVxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ2NyZWF0ZScsIHRoaXMuY29uZmlnLmFuYWx5dGljcywgbW9kZSk7XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xuICB9XG5cbiAgc2V0VXNlcigpIHtcbiAgICBzdXBlci5zZXRVc2VyKCk7XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0JywgJ3VzZXJJZCcsIHRoaXMudXNlci51c2VySWQpO1xuICB9XG5cbiAgc3RhdGljIHNlbmRTb2NpYWwobmV0d29yaywgdGFyZ2V0VXJsLCB0eXBlID0gJ3NlbmQnKSB7XG4gICAgaWYgKHdpbmRvdy5nYSkge1xuICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsIG5ldHdvcmssIHR5cGUsIHRhcmdldFVybCk7XG4gICAgfVxuICB9XG5cbiAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XG4gICAgICBpZiAoc291cmNlICYmIHR5cGUpIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHZhbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVQYXRoKHBhdGgpIHtcbiAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsIHtcbiAgICAgICAgICAgIHBhZ2U6IHBhdGhcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2VuZEV2ZW50KGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCkge1xuICAgIGlmICh3aW5kb3cuZ2EpIHtcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCk7XG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGU7XG5cblxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuXG5jbGFzcyBJbnRlcmNvbSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuXG4gICAgICAgIGxldCBpID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaS5jKGFyZ3VtZW50cylcbiAgICAgICAgfTtcbiAgICAgICAgaS5xID0gW107XG4gICAgICAgIGkuYyA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgICBpLnEucHVzaChhcmdzKVxuICAgICAgICB9O1xuICAgICAgICB3aW5kb3cuSW50ZXJjb20gPSBpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICAgICAgcy5hc3luYyA9IHRydWU7XG4gICAgICAgICAgICBzLnNyYyA9IGBodHRwczovL3dpZGdldC5pbnRlcmNvbS5pby93aWRnZXQvJHtjb25maWcuYXBwaWR9fWA7XG4gICAgICAgICAgICBsZXQgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgICAgIHgucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocywgeCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW50ZXJjb20gPSB3aW5kb3cuSW50ZXJjb207XG4gICAgfVxuXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgICAgICB0aGlzLmludGVyY29tID0gdGhpcy5pbnRlcmNvbSB8fCB3aW5kb3cuSW50ZXJjb207XG4gICAgICAgIHJldHVybiB0aGlzLmludGVyY29tO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBzZXRVc2VyKCkge1xuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ2Jvb3QnLCB7XG4gICAgICAgICAgICBhcHBfaWQ6IHRoaXMuY29uZmlnLmFwcGlkLFxuICAgICAgICAgICAgbmFtZTogdGhpcy51c2VyLmZ1bGxOYW1lLFxuICAgICAgICAgICAgZW1haWw6IHRoaXMudXNlci5lbWFpbCxcbiAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IHRoaXMudXNlci5jcmVhdGVkT24udGlja3MsXG4gICAgICAgICAgICB1c2VyX2lkOiB0aGlzLnVzZXIudXNlcklkXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNlbmRFdmVudCgndXBkYXRlJyk7XG4gICAgfVxuXG4gICAgc2VuZEV2ZW50KGV2ZW50ID0gJ3VwZGF0ZScpIHtcbiAgICAgICAgc3VwZXIuc2VuZEV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbigndXBkYXRlJyk7XG4gICAgfVxuXG4gICAgdXBkYXRlUGF0aChwYXRoKSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3VwZGF0ZScpO1xuICAgIH1cbiAgICBcbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIHN1cGVyLmxvZ291dCgpO1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzaHV0ZG93bicpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY29tOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcblxuY2xhc3MgTmV3UmVsaWMgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcblxuICAgICAgICB0aGlzLk5ld1JlbGljID0gd2luZG93Lk5SRVVNO1xuICAgIH1cblxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcbiAgICAgICAgdGhpcy5OZXdSZWxpYyA9IHRoaXMuTmV3UmVsaWMgfHwgd2luZG93Lk5SRVVNO1xuICAgICAgICByZXR1cm4gdGhpcy5OZXdSZWxpYztcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgc2V0VXNlcigpIHtcbiAgICAgICAgc3VwZXIuc2V0VXNlcigpO1xuICAgICAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbiAmJiB0aGlzLmludGVncmF0aW9uLnNldEN1c3RvbUF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUoJ3VzZXJuYW1lJywgdGhpcy51c2VyLmVtYWlsKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZWdyYXRpb24uc2V0Q3VzdG9tQXR0cmlidXRlKCdhY2Njb3VudElEJywgdGhpcy51c2VyLnVzZXJJZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XG4gICAgICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xuICAgICAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5hZGRUb1RyYWNlKHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVQYXRoKHBhdGgpIHtcbiAgICAgICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcbiAgICAgICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0UGFnZVZpZXdOYW1lKHBhdGgsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld1JlbGljO1xuXG5cbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcbmNvbnN0IEdvb2dsZSA9IHJlcXVpcmUoJy4vZ29vZ2xlJyk7XG5cbmNsYXNzIFR3aXR0ZXIgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcbiAgICAgICAgKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xuICAgICAgICAgICAgbGV0IGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxuICAgICAgICAgICAgICAgIHQgPSB3aW5kb3cudHd0dHIgfHwge307XG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XG4gICAgICAgICAgICBqcy5pZCA9IGlkO1xuICAgICAgICAgICAganMuc3JjID0gXCJodHRwczovL3BsYXRmb3JtLnR3aXR0ZXIuY29tL3dpZGdldHMuanNcIjtcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcblxuICAgICAgICAgICAgdC5fZSA9IFtdO1xuICAgICAgICAgICAgdC5yZWFkeSA9IGZ1bmN0aW9uIChmKSB7XG4gICAgICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgIH0gKGRvY3VtZW50LCBcInNjcmlwdFwiLCBcInR3aXR0ZXItd2pzXCIpKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICBzdXBlci5pbml0KCk7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24ucmVhZHkoKHR3aXR0ZXIpID0+IHtcbiAgICAgICAgICAgIHR3aXR0ZXIud2lkZ2V0cy5sb2FkKCk7XG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdjbGljaycsIHRoaXMuX2NsaWNrRXZlbnRUb0FuYWx5dGljcyk7XG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCd0d2VldCcsIHRoaXMuX3R3ZWV0SW50ZW50VG9BbmFseXRpY3MpO1xuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgncmV0d2VldCcsIHRoaXMuX3JldHdlZXRJbnRlbnRUb0FuYWx5dGljcyk7XG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdmYXZvcml0ZScsIHRoaXMuX2ZhdkludGVudFRvQW5hbHl0aWNzKTtcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ2ZvbGxvdycsIHRoaXMuX2ZvbGxvd0ludGVudFRvQW5hbHl0aWNzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHRyeUNvdW50ID0gMDtcbiAgICAgICAgbGV0IGxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAod2luZG93LnR3dHRyICYmIHdpbmRvdy50d3R0ci53aWRnZXRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy50d3R0ci53aWRnZXRzLmxvYWQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHJ5Q291bnQgPCA1KSB7XG4gICAgICAgICAgICAgICAgdHJ5Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICBfLmRlbGF5KGxvYWQsIDI1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgICAgIHRoaXMudHd0dHIgPSB0aGlzLnR3dHRyIHx8IHdpbmRvdy50d3R0cjtcbiAgICAgICAgcmV0dXJuIHRoaXMudHd0dHI7XG4gICAgfVxuXG4gICAgX2ZvbGxvd0ludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XG4gICAgICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcbiAgICAgICAgbGV0IGxhYmVsID0gaW50ZW50RXZlbnQuZGF0YS51c2VyX2lkICsgXCIgKFwiICsgaW50ZW50RXZlbnQuZGF0YS5zY3JlZW5fbmFtZSArIFwiKVwiO1xuICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgndHdpdHRlcicsIGxhYmVsLCBpbnRlbnRFdmVudC50eXBlKTtcbiAgICB9XG5cbiAgICBfcmV0d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XG4gICAgICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcbiAgICAgICAgbGV0IGxhYmVsID0gaW50ZW50RXZlbnQuZGF0YS5zb3VyY2VfdHdlZXRfaWQ7XG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xuICAgIH1cblxuICAgIF9mYXZJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xuICAgICAgICB0aGlzLl90d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KTtcbiAgICB9XG5cbiAgICBfdHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XG4gICAgICAgIGxldCBsYWJlbCA9IFwidHdlZXRcIjtcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XG4gICAgfVxuICAgIF9jbGlja0V2ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcbiAgICAgICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xuICAgICAgICBsZXQgbGFiZWwgPSBpbnRlbnRFdmVudC5yZWdpb247XG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUd2l0dGVyO1xuXG5cbiIsIlxuY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuY29uc3QgR29vZ2xlID0gcmVxdWlyZSgnLi9nb29nbGUnKTtcblxuY2xhc3MgVXNlclNuYXAgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcbiAgICAgICAgbGV0IGFwaUtleSwgcywgeDtcbiAgICAgICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBhcGlLZXkgPSBjb25maWcuYXBpO1xuICAgICAgICBpZiAoYXBpS2V5ICYmICF3aW5kb3cubG9jYXRpb24uaG9zdC5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xuICAgICAgICAgICAgbGV0IHVzQ29uZiA9IHtcbiAgICAgICAgICAgICAgICBlbWFpbEJveDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbWFpbEJveFZhbHVlOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgICAgIGVtYWlsUmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgY29uc29sZVJlY29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1vZGU6ICdyZXBvcnQnLFxuICAgICAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgR29vZ2xlLnNlbmRFdmVudCgnZmVlZGJhY2snLCAndXNlcnNuYXAnLCAnd2lkZ2V0Jywgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB3aW5kb3cudXNlcnNuYXBjb25maWcgPSB3aW5kb3cuX3VzZXJzbmFwY29uZmlnID0gdXNDb25mO1xuXG4gICAgICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICBzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgICAgIHMuYXN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xuICAgICAgICAgICAgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgICAgICB4LmFwcGVuZENoaWxkKHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB3aW5kb3cuVXNlclNuYXA7XG4gICAgfVxuXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgICAgICB0aGlzLnVzZXJTbmFwID0gdGhpcy51c2VyU25hcCB8fCB3aW5kb3cuVXNlclNuYXA7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJTbmFwO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBzZXRVc2VyKCkge1xuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XG4gICAgfVxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyU25hcDsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXG5cbmNsYXNzIFplbkRlc2sgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcbiAgICAgICAgbGV0IHpPID0ge307XG4gICAgICAgIHdpbmRvdy56RW1iZWQgfHxcbiAgICAgICAgZnVuY3Rpb24gKGUsIHQpIHtcbiAgICAgICAgICAgIGxldCBuLCBvLCBkLCBpLCBzLCBhID0gW10sIHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpOyB3aW5kb3cuekVtYmVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGEucHVzaChhcmd1bWVudHMpXG4gICAgICAgICAgICB9LCB3aW5kb3cuekUgPSB3aW5kb3cuekUgfHwgd2luZG93LnpFbWJlZCwgci5zcmMgPSBcImphdmFzY3JpcHQ6ZmFsc2VcIiwgci50aXRsZSA9IFwiXCIsIHIucm9sZSA9IFwicHJlc2VudGF0aW9uXCIsIChyLmZyYW1lRWxlbWVudCB8fCByKS5zdHlsZS5jc3NUZXh0ID0gXCJkaXNwbGF5OiBub25lXCIsIGQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSwgZCA9IGRbZC5sZW5ndGggLSAxXSwgZC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyLCBkKSwgaSA9IHIuY29udGVudFdpbmRvdywgcyA9IGkuZG9jdW1lbnQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG8gPSBzXG4gICAgICAgICAgICB9IGNhdGNoIChjKSB7XG4gICAgICAgICAgICAgICAgbiA9IGRvY3VtZW50LmRvbWFpbiwgci5zcmMgPSAnamF2YXNjcmlwdDpsZXQgZD1kb2N1bWVudC5vcGVuKCk7ZC5kb21haW49XCInICsgbiArICdcIjt2b2lkKDApOycsIG8gPSBzXG4gICAgICAgICAgICB9IG8ub3BlbigpLl9sID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxldCBvID0gdGhpcy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpOyBuICYmICh0aGlzLmRvbWFpbiA9IG4pLCBvLmlkID0gXCJqcy1pZnJhbWUtYXN5bmNcIiwgby5zcmMgPSBlLCB0aGlzLnQgPSArbmV3IERhdGUsIHRoaXMuemVuZGVza0hvc3QgPSB0LCB0aGlzLnpFUXVldWUgPSBhLCB0aGlzLmJvZHkuYXBwZW5kQ2hpbGQobylcbiAgICAgICAgICAgICAgICB6Ty5sb2dpYyA9IHdpbmRvdy56RTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvLndyaXRlKCc8Ym9keSBvbmxvYWQ9XCJkb2N1bWVudC5fbCgpO1wiPicpLFxuICAgICAgICAgICAgby5jbG9zZSgpXG4gICAgICAgIH1cbiAgICAgICAgICAgIChcImh0dHBzOi8vYXNzZXRzLnplbmRlc2suY29tL2VtYmVkZGFibGVfZnJhbWV3b3JrL21haW4uanNcIiwgY29uZmlnLnNpdGUpO1xuXG4gICAgICAgIHpPLndpZGdldCA9IHdpbmRvdy56RW1iZWQ7XG4gICAgICAgIHpPLmxvZ2ljID0gd2luZG93LnpFO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLmluaXQoKVxuICAgIH1cblxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy56RTtcbiAgICB9XG5cbiAgICBzZXRVc2VyKCkge1xuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5pZGVudGlmeSh7IG5hbWU6IHRoaXMudXNlci5mdWxsTmFtZSwgZW1haWw6IHRoaXMudXNlci5lbWFpbCB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbmNvbnN0IHplbkRlc2sgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG5cbiAgICByZXR1cm4gek87XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFplbkRlc2s7IiwiY2xhc3MgSW50ZWdyYXRpb25zQmFzZSB7XG5cdGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuXHRcdHRoaXMuY29uZmlnID0gY29uZmlnO1xuXHRcdHRoaXMudXNlciA9IHVzZXI7XG5cdH1cblx0XG5cdGluaXQoKSB7XG5cdFx0XG5cdH1cblx0XG5cdGdldCBpbnRlZ3JhdGlvbigpIHtcblx0XHRyZXR1cm4ge307XG5cdH1cblx0XG5cdHNldFVzZXIoKSB7XG5cdFx0XG5cdH1cblx0XG5cdHNlbmRFdmVudCgpIHtcblx0XHRcblx0fVxuXHRcblx0dXBkYXRlUGF0aCgpIHtcblx0XHRcblx0fVxuXHRcblx0bG9nb3V0KCkge1xuXHRcdFxuXHR9XG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVncmF0aW9uc0Jhc2U7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuXG5jbGFzcyBHb29nbGUgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcbiAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XG4gICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IHBvLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JzsgcG8uYXN5bmMgPSB0cnVlO1xuICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcbiAgICAgIGxldCBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvLCBzKTtcbiAgICB9KSgpO1xuICAgICAgXG4gICAgLy9Hb29nbGUgVGFnIE1hbmFnZXIgQVBJXG4gICAgKGZ1bmN0aW9uICh3LCBkLCBzLCBsLCBpKSB7XG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcbiAgICAgICAgJ2d0bS5zdGFydCc6XG4gICAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCBldmVudDogJ2d0bS5qcydcbiAgICAgIH0pOyBsZXQgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXG4gICAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxuICAgICAgICAnLy93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RtLmpzP2lkPScgKyBpICsgZGw7IGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCB0aGlzLmNvbmZpZy50YWdtYW5hZ2VyKTtcblxuICAgIChmdW5jdGlvbiAoaSwgcywgbywgZywgciwgYSwgbSkge1xuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIChpW3JdLnEgPSBpW3JdLnEgfHwgW10pLnB1c2goYXJndW1lbnRzKTtcbiAgICAgIH0sIGlbcl0ubCA9IDEgKiBuZXcgRGF0ZSgpOyBhID0gcy5jcmVhdGVFbGVtZW50KG8pLFxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XG4gICAgICBtLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsIG0pO1xuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzJywgJ2dhJyk7XG5cbiAgfVxuXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcbiAgICB0aGlzLmdhID0gdGhpcy5nYSB8fCB3aW5kb3cuZ2E7XG4gICAgcmV0dXJuIHRoaXMuZ2E7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHN1cGVyLmluaXQoKTtcbiAgICBsZXQgbW9kZSA9ICdhdXRvJztcbiAgICBsZXQgZG9tYWluID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XG4gICAgaWYoZG9tYWluLnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XG4gICAgICBtb2RlID0gJ25vbmUnO1xuICAgIH1cbiAgICB0aGlzLmludGVncmF0aW9uKCdjcmVhdGUnLCB0aGlzLmNvbmZpZy5hbmFseXRpY3MsIG1vZGUpO1xuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgfVxuXG4gIHNldFVzZXIoKSB7XG4gICAgc3VwZXIuc2V0VXNlcigpO1xuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsICd1c2VySWQnLCB0aGlzLnVzZXIudXNlcklkKTtcbiAgfVxuXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xuICAgIGlmICh3aW5kb3cuZ2EpIHtcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCBuZXR3b3JrLCB0eXBlLCB0YXJnZXRVcmwpO1xuICAgIH1cbiAgfVxuXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcbiAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xuICAgICAgaWYgKHNvdXJjZSAmJiB0eXBlKSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCB2YWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlUGF0aChwYXRoKSB7XG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCB7XG4gICAgICAgICAgICBwYWdlOiBwYXRoXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHNlbmRFdmVudChldmVudCwgc291cmNlLCB0eXBlLCB1cmwpIHtcbiAgICBpZiAod2luZG93LmdhKSB7XG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB1cmwpO1xuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR29vZ2xlO1xuXG5cbiIsImNvbnN0IHJpb3QgPSB3aW5kb3cucmlvdFxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xuY29uc3QgcGFnZUJvZHkgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2UtYm9keS5qcycpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcbmNvbnN0IEFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FjdGlvbi5qcycpXG5jb25zdCBNZXRyb25pYyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL21ldHJvbmljJylcbmNvbnN0IExheW91dCA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL2xheW91dCcpXG5jb25zdCBEZW1vID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvZGVtbycpXG5jb25zdCBRdWlja1NpZGViYXIgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9xdWljay1zaWRlYmFyJylcblxuY2xhc3MgUGFnZUZhY3Rvcnkge1xuICAgIGNvbnN0cnVjdG9yKGV2ZW50ZXIsIG1ldGFGaXJlKSB7XG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gbmV3IEFjdGlvbnMobWV0YUZpcmUsIGV2ZW50ZXIsIHRoaXMpO1xuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfUFJPR1JFU1N9YCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudCgnKicpO1xuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5jb25maWd1cmUoeyBwYXJlbnQ6IGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuTUVUQV9QUk9HUkVTU19ORVhUfWAgfSk7XG5cbiAgICAgICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdCgpOyAvLyBpbml0IG1ldHJvbmljIGNvcmUgY29tcG9uZXRzXG4gICAgICAgICAgICAgICAgICAgIExheW91dC5pbml0KCk7IC8vIGluaXQgbGF5b3V0XG4gICAgICAgICAgICAgICAgICAgIERlbW8uaW5pdCgpOyAvLyBpbml0IGRlbW8gZmVhdHVyZXNcbiAgICAgICAgICAgICAgICAgICAgUXVpY2tTaWRlYmFyLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcbiAgICAgICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgbmF2aWdhdGUocGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKSB7XG4gICAgICAgIGxldCBhY3QgPSB0aGlzLmFjdGlvbnMuYWN0KHBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcyk7XG4gICAgICAgIGlmICghYWN0KSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8ocGF0aCwgcGF0aCwgeyBpZDogaWQsIGFjdGlvbjogYWN0aW9uIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFnZUZhY3Rvcnk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XG5jb25zdCBDYW52YXMgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJyk7XG5yZXF1aXJlKCcuL25vZGUnKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBvcnRsZXQgbGlnaHQganRrLWRlbW8tbWFpblwiIHN0eWxlPVwicGFkZGluZzogMDsgXCI+XG4gICAgPGRpdiBjbGFzcz1cImp0ay1kZW1vLWNhbnZhcyBjYW52YXMtd2lkZVwiIGlkPVwiZGlhZ3JhbVwiPlxuXG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ21ldGEtY2FudmFzJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcblxuICAgIHRoaXMubWFwSWQgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzID0gbnVsbDtcblxuICAgIHRoaXMuYnVpbGRDYW52YXMgPSAobWFwKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5jYW52YXMpIHtcbiAgICAgICAgICAgICQodGhpcy5kaWFncmFtKS5lbXB0eSgpO1xuXG4gICAgICAgICAgICB2YXIgd2lkdGggPSAkKHRoaXMuZGlhZ3JhbSkud2lkdGgoKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSAgJCh0aGlzLmRpYWdyYW0pLmhlaWdodCgpO1xuXG4gICAgICAgICAgICB2YXIgeExvYyA9IHdpZHRoLzIgLSAyNSxcbiAgICAgICAgICAgICAgICB5TG9jID0gMTAwO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXMobWFwLCB0aGlzLm1hcElkKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmluaXQoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobWFwLmNoYW5nZWRfYnkgIT0gTWV0YU1hcC5Vc2VyLnVzZXJLZXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkID0gKG9wdHMpID0+IHtcbiAgICAgICAgaWYgKG9wdHMuaWQgIT0gdGhpcy5tYXBJZCkge1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBudWxsXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub2ZmKGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XG4gICAgICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcblxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWFwcy9kYXRhLyR7b3B0cy5pZH1gLCB0aGlzLmJ1aWxkQ2FudmFzKTtcbiAgICAgICAgICAgIE1ldGFNYXAuRXZlbnRlci5mb3JnZXQoJ21hcCcsIHRoaXMuYnVpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdtYXAnLCB0aGlzLmJ1aWxkKTtcblxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcbiAgICAgICAgJCh0aGlzLmRpYWdyYW0pLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCArICdweCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi4vLi4vY2FudmFzL2NhbnZhcycpO1xuXG5cbmNvbnN0IGh0bWwgPSBgXG5gXG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ25vZGUnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcbmNvbnN0IFBzID0gcmVxdWlyZSgncGVyZmVjdC1zY3JvbGxiYXInKTtcblxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi9yYXcnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9XG5cdGBcbjxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItd3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdi1qdXN0aWZpZWRcIj5cbiAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBuYXYtanVzdGlmaWVkXCI+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiYWN0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjcXVpY2tfc2lkZWJhcl90YWJfMVwiIGRhdGEtdG9nZ2xlPVwidGFiXCI+XG4gICAgICAgICAgICAgICAgICAgIENvcnRleCBNYW5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3F1aWNrX3NpZGViYXJfdGFiXzJcIiBkYXRhLXRvZ2dsZT1cInRhYlwiPlxuICAgICAgICAgICAgICAgICAgICBPdXRsaW5lXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItcGFuZSBhY3RpdmUgcGFnZS1xdWljay1zaWRlYmFyLWNoYXQgcGFnZS1xdWljay1zaWRlYmFyLWNvbnRlbnQtaXRlbS1zaG93blwiIGlkPVwicXVpY2tfc2lkZWJhcl90YWJfMVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnNcIiBkYXRhLXJhaWwtY29sb3I9XCIjZGRkXCIgZGF0YS13cmFwcGVyLWNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1tZXNzYWdlc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGVhY2g9XCJ7IG1lc3NhZ2VzIH1cIiBjbGFzcz1cInBvc3QgeyBvdXQ6IGF1dGhvciA9PSAnY29ydGV4JywgaW46IGF1dGhvciAhPSAnY29ydGV4JyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGhlaWdodD1cIjM5XCIgd2lkdGg9XCIzOVwiIGNsYXNzPVwiYXZhdGFyXCIgYWx0PVwiXCIgc3JjPVwieyBwaWN0dXJlIH1cIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXJyb3dcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwibmFtZVwiPnsgbmFtZSB9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGF0ZXRpbWVcIj57IHBhcmVudC5nZXRSZWxhdGl2ZVRpbWUodGltZSkgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IG1lc3NhZ2UgfVwiPjwvcmF3PiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItZm9ybVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImNoYXRfaW5wdXRfZm9ybVwiIG9uc3VibWl0PVwieyBvblN1Ym1pdCB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjaGF0X2lucHV0XCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiVHlwZSBhIG1lc3NhZ2UgaGVyZS4uLlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYmx1ZVwiPjxpIGNsYXNzPVwiZmEgZmEtcGFwZXJjbGlwXCI+PC9pPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLXBhbmUgcGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0c1wiIGlkPVwicXVpY2tfc2lkZWJhcl90YWJfMlwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cy1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsaXN0LWhlYWRpbmdcIj5JbnRybzwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsaXN0LWhlYWRpbmdcIj5TZWN0aW9uIDE8L2gzPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuXG5yaW90LnRhZygncXVpY2stc2lkZWJhcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuXHR0aGlzLmNvcnRleFBpY3R1cmUgPSAnc3JjL2ltYWdlcy9jb3J0ZXgtYXZhdGFyLXNtYWxsLmpwZyc7XG5cdHRoaXMubWVzc2FnZXMgPSBbe1xuXHRcdG1lc3NhZ2U6IGBIZWxsbywgSSdtIENvcnRleCBNYW4uIEFzayBtZSBhbnl0aGluZy4gVHJ5IDxjb2RlPi9oZWxwPC9jb2RlPiBpZiB5b3UgZ2V0IGxvc3QuYCxcblx0XHRhdXRob3I6ICdjb3J0ZXgnLFxuXHRcdHBpY3R1cmU6IHRoaXMuY29ydGV4UGljdHVyZSxcblx0XHR0aW1lOiBuZXcgRGF0ZSgpXG5cdH1dO1xuXG5cdGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XG5cblx0dGhpcy5vbigndXBkYXRlJywgKCkgPT4ge30pO1xuXG5cdHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuXG5cdFx0dGhpcy51cGRhdGUoKTtcblx0fSk7XG5cblx0dGhpcy5nZXREaXNwbGF5ID0gKCkgPT4ge1xuXHRcdGlmICghdGhpcy5kaXNwbGF5KSB7XG5cdFx0XHRyZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7Jztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuZ2V0UmVsYXRpdmVUaW1lID0gKGRhdGUgPSBuZXcgRGF0ZSgpKSA9PiB7XG5cdFx0cmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XG5cdH1cblxuXHR0aGlzLm9uU3VibWl0ID0gKG9iaikgPT4ge1xuXHRcdHRoaXMubWVzc2FnZXMucHVzaCh7XG5cdFx0XHRtZXNzYWdlOiB0aGlzLmNoYXRfaW5wdXQudmFsdWUsXG5cdFx0XHRhdXRob3I6IE1ldGFNYXAuVXNlci51c2VyTmFtZSxcblx0XHRcdHBpY3R1cmU6IE1ldGFNYXAuVXNlci5waWN0dXJlLFxuXHRcdFx0dGltZTogbmV3IERhdGUoKVxuXHRcdH0pXG5cdFx0dGhpcy5tZXNzYWdlcy5wdXNoKHtcblx0XHRcdG1lc3NhZ2U6IGBZb3UgYXNrZWQgbWUgJHt0aGlzLmNoYXRfaW5wdXQudmFsdWV9LiBUaGF0J3MgZ3JlYXQhYCxcblx0XHRcdGF1dGhvcjogJ2NvcnRleCcsXG5cdFx0XHRwaWN0dXJlOiB0aGlzLmNvcnRleFBpY3R1cmUsXG5cdFx0XHR0aW1lOiBuZXcgRGF0ZSgpXG5cdFx0fSlcblx0XHR0aGlzLmNoYXRfaW5wdXQudmFsdWUgPSAnJ1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0dGhpcy5jaGF0X2JvZHkuc2Nyb2xsVG9wID0gdGhpcy5jaGF0X2JvZHkuc2Nyb2xsSGVpZ2h0XG5cdFx0UHMudXBkYXRlKHRoaXMuY2hhdF9ib2R5KVxuXHR9XG5cblx0dGhpcy50b2dnbGUgPSAoc3RhdGUpID0+IHtcblx0XHR0aGlzLmRpc3BsYXkgPSBzdGF0ZTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHR9XG5cbn0pO1xuIiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xuICAgIHRoaXMudXBkYXRlQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IChvcHRzKSA/IChvcHRzLmNvbnRlbnQgfHwgJycpIDogJyc7XG4gICAgfTtcblxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ3R5cGVhaGVhZC5qcycpXG5yZXF1aXJlKCdib290c3RyYXAtc2VsZWN0JylcblxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5yZXF1aXJlKCcuLi8uLi90b29scy9zaGltcycpO1xuY29uc3QgU2hhcmluZyA9IHJlcXVpcmUoJy4uLy4uL2FwcC9TaGFyaW5nJylcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJzaGFyZV9tb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8YSBpZD1cInNoYXJlX3B1YmxpY19saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmbG9hdDogcmlnaHQ7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jbGlwYm9hcmQtdGV4dD1cInt3aW5kb3cubG9jYXRpb24uaG9zdCsnLycrd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKycvbWFwcy8nK29wdHMubWFwLmlkfVwiXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IGdldFB1YmxpY0xpbmsgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgR2V0IHNoYXJhYmxlIGxpbmsgIDxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5TaGFyZSB3aXRoIG90aGVyczwvaDQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgPHA+UGVvcGxlPC9wPlxuICAgICAgICAgICAgICAgIDxmb3JtIHJvbGU9XCJmb3JtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzaGFyZV90eXBlYWhlYWRcIiBjbGFzcz1cImNvbC1tZC04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHN0eWxlPVwiaGVpZ2h0OiAzNXB4O1wiIGlkPVwic2hhcmVfaW5wdXRcIiBjbGFzcz1cInR5cGVhaGVhZCBmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgbmFtZXMgb3IgZW1haWwgYWRkcmVzc2VzLi4uXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJzaGFyZV9wZXJtaXNzaW9uXCIgY2xhc3M9XCJzZWxlY3RwaWNrZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmVhZFwiIGRhdGEtY29udGVudD1cIjxzcGFuPjxpIGNsYXNzPSdmYSBmYS1leWUnPjwvaT4gQ2FuIHZpZXc8L3NwYW4+XCI+Q2FuIHZpZXc8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid3JpdGVcIiBkYXRhLWNvbnRlbnQ9XCI8c3Bhbj48aSBjbGFzcz0nZmEgZmEtcGVuY2lsJz48L2k+IENhbiBlZGl0PC9zcGFuPlwiPkNhbiBlZGl0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWQ9XCJzaGFyZV9idXR0b25cIiBjbGFzcz1cImJ0biBidG4taWNvbi1vbmx5IGdyZWVuXCIgb25jbGljaz1cInsgb25TaGFyZSB9XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWY9XCJ7IG9wdHMgJiYgb3B0cy5tYXAgJiYgb3B0cy5tYXAuc2hhcmVkX3dpdGh9XCIgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImxhYmVsIGxhYmVsLWRlZmF1bHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cIm1hcmdpbi1yaWdodDogNXB4O1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmPVwieyBpICE9ICdhZG1pbicgJiYgKHZhbC53cml0ZSB8fCB2YWwucmVhZCkgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGksIHZhbCBpbiBvcHRzLm1hcC5zaGFyZWRfd2l0aH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgaWY9XCJ7IHZhbC53cml0ZSB9XCIgY2xhc3M9XCJmYSBmYS1wZW5jaWxcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGlmPVwieyAhdmFsLndyaXRlIH1cIiBjbGFzcz1cImZhIGZhLWV5ZVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdmFsLm5hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vblVuU2hhcmUgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkRvbmU8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc2hhcmUnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKVxuICAgIGNvbnN0IHNoYXJlID0gbmV3IFNoYXJpbmcoTWV0YU1hcC5Vc2VyKVxuXG4gICAgdGhpcy5kYXRhID0gW107XG5cbiAgICB0aGlzLmdldFB1YmxpY0xpbmsgPSAoZSwgb3B0cykgPT4ge1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICB9XG5cbiAgICB0aGlzLm9uU2hhcmUgPSAoZSwgb3B0cykgPT4ge1xuICAgICAgICB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW3RoaXMuc3VnZ2VzdGlvbi5pZF0gPSB7XG4gICAgICAgICAgICByZWFkOiB0aGlzLnBpY2tlci52YWwoKSA9PSAncmVhZCcgfHwgdGhpcy5waWNrZXIudmFsKCkgPT0gJ3dyaXRlJyxcbiAgICAgICAgICAgIHdyaXRlOiB0aGlzLnBpY2tlci52YWwoKSA9PSAnd3JpdGUnLFxuICAgICAgICAgICAgbmFtZTogdGhpcy5zdWdnZXN0aW9uLm5hbWUsXG4gICAgICAgICAgICBwaWN0dXJlOiB0aGlzLnN1Z2dlc3Rpb24ucGljdHVyZVxuICAgICAgICB9XG4gICAgICAgIHNoYXJlLmFkZFNoYXJlKHRoaXMub3B0cy5tYXAsIHRoaXMuc3VnZ2VzdGlvbiwgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLnN1Z2dlc3Rpb24uaWRdKVxuXG4gICAgICAgIHRoaXMuc3VnZ2VzdGlvbiA9IG51bGxcbiAgICAgICAgdGhpcy50YS50eXBlYWhlYWQoJ3ZhbCcsICcnKVxuICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5oaWRlKClcbiAgICB9XG5cbiAgICB0aGlzLm9uVW5TaGFyZSA9IChlLCBvcHRzKSA9PiB7XG4gICAgICAgIGUuaXRlbS52YWwuaWQgPSBlLml0ZW0uaVxuICAgICAgICBkZWxldGUgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFtlLml0ZW0uaV1cbiAgICAgICAgc2hhcmUucmVtb3ZlU2hhcmUodGhpcy5vcHRzLm1hcCwgZS5pdGVtLnZhbClcbiAgICB9XG5cbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAob3B0cykgPT4ge1xuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgXy5leHRlbmQodGhpcy5vcHRzLCBvcHRzKTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdtb3VudCcsIChlLCBvcHRzKSA9PiB7XG4gICAgICAgICQodGhpcy5zaGFyZV9tb2RhbCkubW9kYWwoJ3Nob3cnKVxuICAgICAgICB0aGlzLnRhID0gJCgnI3NoYXJlX3R5cGVhaGVhZCAudHlwZWFoZWFkJykudHlwZWFoZWFkKHtcbiAgICAgICAgICAgIGhpZ2hsaWdodDogdHJ1ZVxuICAgICAgICB9LHtcbiAgICAgICAgICAgIHNvdXJjZTogKHF1ZXJ5LCBzeW5jTWV0aG9kLCBhc3luY01ldGhvZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1ldGFtYXAuY28vdXNlcnMvZmluZCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcklkOiBNZXRhTWFwLlVzZXIudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbklkOiBNZXRhTWFwLk1ldGFGaXJlLmZpcmViYXNlX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRVc2VyczogXy5rZXlzKHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBxdWVyeVxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICcqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWN0dXJlOiAnc3JjL2ltYWdlcy93b3JsZC1nbG9iZS5qcGcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdQdWJsaWMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNNZXRob2QoZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzcGxheTogKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoubmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICAgICBlbXB0eTogW1xuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwicGFkZGluZzogNXB4IDEwcHg7IHRleHQtYWxpZ246IGNlbnRlcjtcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnVW5hYmxlIHRvIGZpbmQgYW55IHVzZXJzIG1hdGNoaW5nIHRoaXMgcXVlcnknLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgXS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uOiAodmFsdWUpID0+IHsgcmV0dXJuIGA8ZGl2PjxpbWcgYWx0PVwiJHt2YWx1ZS5uYW1lfVwiIGhlaWdodD1cIjMwXCIgd2lkdGg9XCIzMFwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cIiR7dmFsdWUucGljdHVyZX1cIj4gJHt2YWx1ZS5uYW1lfTwvZGl2PmAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRhLm9uKCd0eXBlYWhlYWQ6c2VsZWN0JywgKGV2LCBzdWdnZXN0aW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXG4gICAgICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5zaG93KClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy50YS5vbigndHlwZWFoZWFkOmF1dG9jb21wbGV0ZScsIChldiwgc3VnZ2VzdGlvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gc3VnZ2VzdGlvblxuICAgICAgICAgICAgJCh0aGlzLnNoYXJlX2J1dHRvbikuc2hvdygpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMucGlja2VyID0gJCgnLnNlbGVjdHBpY2tlcicpLnNlbGVjdHBpY2tlcih7XG4gICAgICAgICAgICB3aWR0aDogJ2F1dG8nXG4gICAgICAgIH0pXG4gICAgfSlcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5cbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ncmFkdWF0aW9uLWNhcFwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI3MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IGhlbHAgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBoZWxwIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuYDtcblxucmlvdC50YWcoJ21ldGEtaGVscCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuaGVscCA9IG51bGw7XG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvaGVscCcsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhlbHAgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcbnJlcXVpcmUoJy4uLy4uL3Rvb2xzL3NoaW1zJylcblxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtYmVsbC1vXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbm90aWZpY2F0aW9ucy5sZW5ndGggfVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJib2xkXCI+eyBub3RpZmljYXRpb25zLmxlbmd0aCB9IHBlbmRpbmc8L3NwYW4+IG5vdGlmaWNhdGlvbnsgczogbm90aWZpY2F0aW9ucy5sZW5ndGggPT0gMCB8fCBub3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyBhbGxOb3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgdHJ1ZSAhPSBhcmNoaXZlZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgdmFsLCBpIGluIG5vdGlmaWNhdGlvbnMgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZj1cInsgdmFsICYmIHZhbC5waG90byB9XCIgY2xhc3M9XCJwaG90b1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cInsgdmFsLnBob3RvIH1cIiBjbGFzcz1cImltZy1jaXJjbGVcIiBhbHQ9XCJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3ViamVjdFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImZyb21cIj57IHZhbC5mcm9tIH08L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwidGltZVwiIHN0eWxlPVwicGFkZGluZzogMDtcIj57IHBhcmVudC5nZXRUaW1lKHZhbC50aW1lKSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtZXNzYWdlXCI+eyB2YWwuZXZlbnQgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG5gO1xuXG5yaW90LnRhZygnbWV0YS1ub3RpZmljYXRpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XG4gICAgY29uc3QgZmJQYXRoID0gQ09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdChNZXRhTWFwLlVzZXIudXNlcklkKVxuXG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gW107XG4gICAgdGhpcy5hbGxOb3RpZmljYXRpb25zID0gW107XG5cbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xuICAgICAgICBsZXQgaXRlbSA9IGV2ZW50Lml0ZW0udmFsXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YSh0cnVlLCBgJHtmYlBhdGh9LyR7aXRlbS5pZH0vYXJjaGl2ZWApXG4gICAgICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5OT1RJRklDQVRJT04uTUFQOlxuICAgICAgICAgICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHtpdGVtLm1hcElkfWApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0VGltZSA9ICh0aW1lKSA9PiB7XG4gICAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUodGltZSkpLmZyb21Ob3coKVxuICAgIH1cblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldERhdGEoZmJQYXRoKVxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5wdXNoRGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudDogJ1lvdSBzaWduZWQgdXAgZm9yIE1ldGFNYXAhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGAke25ldyBEYXRlKCkgfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNoaXZlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9LCBmYlBhdGgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdChNZXRhTWFwLlVzZXIudXNlcklkKSwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxOb3RpZmljYXRpb25zID0gXy5tYXAoZGF0YSwgKG4sIGlkKSA9PiB7IG4uaWQgPSBpZDsgcmV0dXJuIG47ICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gXy5maWx0ZXIoXy5zb3J0QnkodGhpcy5hbGxOb3RpZmljYXRpb25zLCAnZGF0ZScpLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxuXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS10cm9waHlcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2Utc3VjY2Vzc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyBwb2ludHMubGVuZ3RoIH1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV4dGVybmFsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3MgPVwiYm9sZFwiPnsgcG9pbnRzLmxlbmd0aCB9IG5ldyA8L3NwYW4+IGFjaGlldmVtZW50eyBzOiBwb2ludHMubGVuZ3RoID09IDAgfHwgcG9pbnRzLmxlbmd0aCA+IDEgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgcG9pbnRzIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBwb2ludHMgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lXCI+eyB0aW1lIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRldGFpbHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxhYmVsIGxhYmVsLXNtIGxhYmVsLWljb24gbGFiZWwtc3VjY2Vzc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZXZlbnQgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbmA7XG5cbnJpb3QudGFnKCdtZXRhLXBvaW50cycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuICAgIHRoaXMucG9pbnRzID0gW107XG5cbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYHVzZXJzLyR7TWV0YU1hcC5Vc2VyLnVzZXJJZH0vcG9pbnRzYCwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxuXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1c2VybmFtZSB1c2VybmFtZS1oaWRlLW9uLW1vYmlsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VybmFtZSB9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBpZj1cInsgcGljdHVyZSB9XCIgYWx0PVwiXCIgaGVpZ2h0PVwiMzlcIiB3aWR0aD1cIjM5XCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwieyBwaWN0dXJlIH1cIiAvPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtZGVmYXVsdFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IG1lbnUgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBtZW51IH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbmA7XG5cbnJpb3QudGFnKCdtZXRhLXVzZXInLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcblxuICAgIHRoaXMubWVudSA9IFtdO1xuICAgIHRoaXMudXNlcm5hbWUgPSAnJztcbiAgICB0aGlzLnBpY3R1cmUgPSAnJztcblxuICAgIHRoaXMubG9nb3V0ID0gKCkgPT4ge1xuICAgICAgICBNZXRhTWFwLmxvZ291dCgpO1xuICAgIH1cblxuICAgIHRoaXMubGlua0FjY291bnQgPSAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuQXV0aDAubGlua0FjY291bnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xuICAgICAgICBzd2l0Y2goZXZlbnQuaXRlbS5saW5rKSB7XG4gICAgICAgICAgICBjYXNlICcjbGluay1zb2NpYWwtYWNjb3VudHMnOlxuICAgICAgICAgICAgICAgIHRoaXMubGlua0FjY291bnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWV0YW1hcC91c2VyYCwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBNZXRhTWFwLlVzZXIuZGlzcGxheU5hbWU7XG4gICAgICAgICAgICB0aGlzLnBpY3R1cmUgPSBNZXRhTWFwLlVzZXIucGljdHVyZTtcbiAgICAgICAgICAgIHRoaXMubWVudSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcblxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5yZXF1aXJlKCcuLi90b29scy9zaGltcycpO1xuY29uc3QgUGVybWlzc2lvbnMgPSByZXF1aXJlKCcuLi9hcHAvUGVybWlzc2lvbnMnKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBhZ2UtYWN0aW9uc1wiPlxuICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gcmVkLWhhemUgYnRuLXNtIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaGlkZGVuLXNtIGhpZGRlbi14c1wiPkFjdGlvbnMmbmJzcDs8L3NwYW4+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICAgIDxsaSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YSB9XCIgY2xhc3M9XCJ7IHN0YXJ0OiBpID09IDAsIGFjdGl2ZTogaSA9PSAwIH1cIj5cbiAgICAgICAgICAgICAgICA8YSBpZj1cInsgcGFyZW50LmdldExpbmtBbGxvd2VkKHZhbCkgfVwiIGhyZWY9XCJ7IHBhcmVudC5nZXRBY3Rpb25MaW5rKHZhbCkgfVwiPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgdmFsLmljb24gfVwiPjwvaT4geyB2YWwudGl0bGUgfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJkaXZpZGVyXCI+PC9saT5cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3NldHRpbmdzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtZ2VhclwiPjwvaT4gU2V0dGluZ3NcbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgIDwvZGl2PlxuXG4gICAgPHNwYW4gc3R5bGU9XCJwYWRkaW5nLWxlZnQ6IDVweDtcIj5cbiAgICAgICAgPHNwYW4gaWY9XCJ7IHBhZ2VOYW1lIH1cIlxuICAgICAgICAgICAgICAgIGlkPVwibWFwX25hbWVcIlxuICAgICAgICAgICAgICAgIGRhdGEtdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgIGRhdGEtdGl0bGU9XCJFbnRlciBtYXAgbmFtZVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPlxuICAgICAgICAgICAgeyBwYWdlTmFtZSB9XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L3NwYW4+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYWN0aW9ucycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5kYXRhID0gW107XG4gICAgdGhpcy5wYWdlTmFtZSA9ICdIb21lJztcbiAgICB0aGlzLnVybCA9IE1ldGFNYXAuY29uZmlnLnNpdGUuZGIgKyAnLmZpcmViYXNlaW8uY29tJztcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuXG4gICAgbGV0IHBlcm1pc3Npb25zID0gbnVsbDtcblxuICAgIHRoaXMuZ2V0QWN0aW9uTGluayA9IChvYmopID0+IHtcbiAgICAgICAgbGV0IHJldCA9IG9iai5saW5rO1xuICAgICAgICBpZiAob2JqLnVybF9wYXJhbXMpIHtcbiAgICAgICAgICAgIGxldCBhcmdzID0gW107XG4gICAgICAgICAgICBfLmVhY2gob2JqLnVybF9wYXJhbXMsIChwcm0pID0+IHtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2godGhpc1twcm0ubmFtZV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXQgPSBvYmoubGluay5mb3JtYXQuY2FsbChvYmoubGluaywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICB0aGlzLmdldExpbmtBbGxvd2VkID0gKG9iaikgPT4ge1xuICAgICAgICBsZXQgcmV0ID0gdHJ1ZSA9PSBvYmpbJ2FsbG93ZWQtb24nXVsnKiddO1xuICAgICAgICBpZiAoIXJldCkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gTWV0YU1hcC5Sb3V0ZXIuY3VycmVudFBhdGg7XG4gICAgICAgICAgICByZXQgPSB0cnVlID09IG9ialsnYWxsb3dlZC1vbiddW2N1cnJlbnRQYWdlXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmV0ICYmIHRoaXMubWFwICYmIHBlcm1pc3Npb25zKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG9iai50aXRsZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NoYXJlIE1hcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnRGVsZXRlIE1hcCc6XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHBlcm1pc3Npb25zLmlzTWFwT3duZXIoKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlUGFnZU5hbWUgPSAobWFwKSA9PiB7XG4gICAgICAgIHBlcm1pc3Npb25zID0gbmV3IFBlcm1pc3Npb25zKG1hcClcbiAgICAgICAgdGhpcy5tYXAgPSBtYXAgfHwge31cbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmlzTWFwT3duZXIoKSkge1xuICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG1hcC5uYW1lIHx8ICcnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbWFwLm5hbWUgKyAnIChTaGFyZWQgYnkgJyArIG1hcC5vd25lci5uYW1lICsgJyknXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBlcm1pc3Npb25zICYmIHBlcm1pc3Npb25zLmlzTWFwT3duZXIoKSkge1xuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIChldmVudCwgcGFyYW1zKSA9PiB7XG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH0vbmFtZWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH1cblxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgncGFnZU5hbWUnLCAob3B0cykgPT4ge1xuICAgICAgICBpZiAodGhpcy5sb2FkZWQpIHtcbiAgICAgICAgICAgICQodGhpcy5tYXBfbmFtZSkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH1gKTtcbiAgICAgICAgICAgIHRoaXMubWFwSWQgPSBudWxsXG4gICAgICAgICAgICB0aGlzLm1hcCA9IG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5pZCkge1xuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke29wdHMuaWR9YCwgKG1hcCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZU5hbWUobWFwKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG9wdHMubmFtZSB8fCAnSG9tZSc7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2FjdGlvbnMnLCAoZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfSk7XG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBwYWdlSGVhZGVyID0gcmVxdWlyZSgnLi9wYWdlLWhlYWRlcicpO1xuY29uc3QgcGFnZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vcGFnZS1jb250YWluZXInKTtcbmNvbnN0IHBhZ2VGb290ZXIgPSByZXF1aXJlKCcuL3BhZ2UtZm9vdGVyJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGlkPVwicGFnZV9ib2R5XCIgY2xhc3M9XCJwYWdlLWhlYWRlci1maXhlZCBwYWdlLXNpZGViYXItcmV2ZXJzZWRcIj5cblxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfaGVhZGVyXCI+PC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfY29udGFpbmVyXCI+PC9kaXY+XG5cbjwvZGl2PmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYm9keScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9oZWFkZXIsICdwYWdlLWhlYWRlcicpO1xuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2NvbnRhaW5lciwgJ3BhZ2UtY29udGFpbmVyJyk7XG4gICAgfSk7XG5cbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XG4gICAgICAgIC8vJCh0aGlzLnBhZ2VfYm9keSkuYWRkQ2xhc3MoJ3BhZ2Utc2lkZWJhci1yZXZlcnNlZCcpO1xuICAgIH0pO1xuXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XG4gICAgICAgIC8vJCh0aGlzLnBhZ2VfYm9keSkucmVtb3ZlQ2xhc3MoJ3BhZ2Utc2lkZWJhci1yZXZlcnNlZCcpO1xuICAgIH0pO1xuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgcGFnZVNpZGViYXIgPSByZXF1aXJlKCcuL3BhZ2Utc2lkZWJhcicpO1xuY29uc3QgcGFnZUNvbnRlbnQgPSByZXF1aXJlKCcuL3BhZ2UtY29udGVudCcpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBhZ2UtY29udGFpbmVyXCI+XG5cbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2NvbnRlbnRcIj48L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb250YWluZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfY29udGVudCwgJ3BhZ2UtY29udGVudCcpO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9xdWljay1zaWRlYmFyJylcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRlbnQtd3JhcHBlclwiPlxuICAgIDxkaXYgaWQ9XCJwYWdlLWNvbnRlbnRcIiBjbGFzcz1cInBhZ2UtY29udGVudFwiPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWhlYWRcIj48L2Rpdj5cblxuICAgICAgICA8ZGl2IGlkPVwiYXBwLWNvbnRhaW5lclwiPjwvZGl2PlxuXG4gICAgICAgIDxkaXYgaWQ9XCJxdWlja19zaWRlYmFyX2NvbnRhaW5lclwiPjwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvbnRlbnQnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICByaW90Lm1vdW50KHRoaXMucXVpY2tfc2lkZWJhcl9jb250YWluZXIsICdxdWljay1zaWRlYmFyJylcbiAgICAgICAgdGhpcy5yZXNpemUoKVxuICAgIH0pXG5cbiAgICB0aGlzLnJlc2l6ZSA9ICgpID0+IHtcbiAgICAgICAgbGV0IHdpZHRoID0gYCR7d2luZG93LmlubmVyV2lkdGggLSA0MH1weGA7XG4gICAgICAgICQodGhpc1snYXBwLWNvbnRhaW5lciddKS5jc3MoeyB3aWR0aDogd2lkdGggfSk7XG4gICAgfVxuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVzaXplKClcbiAgICB9KTtcblxuXG5cblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJwYWdlLWZvb3RlclwiIHN0eWxlPVwicG9zaXRpb246IGZpeGVkOyBib3R0b206IDA7XCI+XG4gICAgPGRpdiBjbGFzcz1cInBhZ2UtZm9vdGVyLWlubmVyXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjdGVybXNcIj4mY29weTsyMDE1PC9hPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgcGFnZUxvZ28gPSByZXF1aXJlKCcuL3BhZ2UtbG9nby5qcycpO1xuY29uc3QgcGFnZUFjdGlvbnMgPSByZXF1aXJlKCcuL3BhZ2UtYWN0aW9ucy5qcycpO1xuY29uc3QgcGFnZVNlYXJjaCA9IHJlcXVpcmUoJy4vcGFnZS1zZWFyY2guanMnKTtcbmNvbnN0IHBhZ2VUb3BNZW51ID0gcmVxdWlyZSgnLi9wYWdlLXRvcG1lbnUnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJoZWFkZXItdG9wXCIgY2xhc3M9XCJwYWdlLWhlYWRlciBuYXZiYXIgbmF2YmFyLWZpeGVkLXRvcFwiPlxuICAgIDxkaXYgaWQ9XCJtZXRhX3Byb2dyZXNzX25leHRcIiBzdHlsZT1cIm92ZXJmbG93OiBpbmhlcml0O1wiPjwvZGl2PlxuICAgIDxkaXYgaWQ9XCJoZWFkZXItY29udGVudFwiIGNsYXNzPVwicGFnZS1oZWFkZXItaW5uZXJcIj5cblxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2xvZ29cIj48L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfYWN0aW9uc1wiPjwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV90b3BcIiBjbGFzcz1cInBhZ2UtdG9wXCI+XG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3NlYXJjaFwiPjwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcG1lbnVcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cblxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWhlYWRlcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9sb2dvLCAncGFnZS1sb2dvJyk7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfYWN0aW9ucywgJ3BhZ2UtYWN0aW9ucycpO1xuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3RvcCwgJ3BhZ2Utc2VhcmNoJyk7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfdG9wLCAncGFnZS10b3BtZW51Jyk7XG4gICAgfSk7XG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzID1cInBhZ2UtbG9nb1wiPlxuICAgIDxhIGlkPVwibWV0YV9sb2dvXCIgaHJlZj1cIiNob21lXCI+XG4gICAgICAgIDxpbWcgc3JjPVwic3JjL2ltYWdlcy9tZXRhbWFwX2Nsb3VkLnBuZ1wiIGFsdD1cImxvZ29cIiBjbGFzcyA9XCJsb2dvLWRlZmF1bHRcIiAvPlxuICAgIDwvYT5cbiAgICBcbiAgICA8ZGl2IGlkPVwibWV0YV9tZW51X3RvZ2dsZVwiIGNsYXNzPVwibWVudS10b2dnbGVyIHNpZGViYXItdG9nZ2xlciBxdWljay1zaWRlYmFyLXRvZ2dsZXJcIiBvbmNsaWNrPVwieyBvbkNsaWNrIH1cIiBzdHlsZT1cInZpc2liaWxpdHk6eyBnZXREaXNwbGF5KCkgfTtcIj5cbiAgICAgICAgPCEtLURPQzogUmVtb3ZlIHRoZSBhYm92ZSBcImhpZGVcIiB0byBlbmFibGUgdGhlIHNpZGViYXIgdG9nZ2xlciBidXR0b24gb24gaGVhZGVyLS0+XG4gICAgPC9kaXY+XG48L2Rpdj5cbjxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcyA9XCJtZW51LXRvZ2dsZXIgcmVzcG9uc2l2ZS10b2dnbGVyXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1jb2xsYXBzZVwiPlxuPC9hPlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1sb2dvJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMub25DbGljayA9ICgpID0+IHtcbiAgICAgICAvLyBNZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX1RPR0dMRSk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXREaXNwbGF5ID0gKGVsKSA9PiB7XG5cbiAgICAgICAgaWYoTWV0YU1hcCAmJiBNZXRhTWFwLlJvdXRlciAmJiBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aCA9PSAnbWFwJykge1xuICAgICAgICAgICAgcmV0dXJuICd2aXNpYmxlJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdoaWRkZW4nXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNZXRhTWFwLkV2ZW50ZXIuZXZlcnkoJ3BhZ2VOYW1lJywgKG9wdHMpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH0pXG5cbi8vXG4vLyAgICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xuLy8gICAgICAgICB0aGlzLmRpc3BsYXkgPSBmYWxzZTtcbi8vICAgICAgICAgdGhpcy51cGRhdGUoKTtcbi8vICAgICB9KTtcbi8vXG4vL1xuLy8gICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xuLy8gICAgICAgICB0aGlzLmRpc3BsYXkgPSB0cnVlO1xuLy8gICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuLy8gICAgIH0pO1xuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuXG5jb25zdCBodG1sID0gYFxuPCEtLSBET0M6IEFwcGx5IFwic2VhcmNoLWZvcm0tZXhwYW5kZWRcIiByaWdodCBhZnRlciB0aGUgXCJzZWFyY2gtZm9ybVwiIGNsYXNzIHRvIGhhdmUgaGFsZiBleHBhbmRlZCBzZWFyY2ggYm94IC0tPlxuPGZvcm0gY2xhc3M9XCJzZWFyY2gtZm9ybVwiIGFjdGlvbj1cImV4dHJhX3NlYXJjaC5odG1sXCIgbWV0aG9kPVwiR0VUXCI+XG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2guLi5cIiBuYW1lPVwicXVlcnlcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiYnRuIHN1Ym1pdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiPjwvaT5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuPC9mb3JtPlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1zZWFyY2gnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhci13cmFwcGVyXCIgc3R5bGU9XCJ7IGdldERpc3BsYXkoKSB9XCI+XG4gICAgPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhciBuYXZiYXItY29sbGFwc2UgY29sbGFwc2VcIj5cbiAgICAgICAgPHVsIGNsYXNzPVwicGFnZS1zaWRlYmFyLW1lbnUgXCIgZGF0YS1rZWVwLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWF1dG8tc2Nyb2xsPVwidHJ1ZVwiIGRhdGEtc2xpZGUtc3BlZWQ9XCIyMDBcIj5cblxuICAgICAgICAgICAgPGxpIGlmPVwieyBkYXRhIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQuY2xpY2sgfVwiIGVhY2g9XCJ7IGRhdGEgfVwiPlxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBpY29uIH1cIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIiBzdHlsZT1cImNvbG9yOiN7IGNvbG9yIH07XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInsgYXJyb3c6IG1lbnUubGVuZ3RoIH1cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBpZj1cInsgbWVudSAmJiBtZW51Lmxlbmd0aCB9XCIgY2xhc3M9XCJzdWItbWVudVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgZWFjaD1cInsgbWVudSB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2xpPlxuXG4gICAgICAgIDwvdWw+XG5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1zaWRlYmFyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMuY2xpY2sgPSBmdW5jdGlvbigpIHsgY29uc29sZS5sb2coJ2ZvbycpIH1cbiAgICB0aGlzLmRpc3BsYXkgPSB0cnVlO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9zaWRlYmFyJywgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5kYXRhID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGluY2x1ZGUgJiYgZC5tZW51ICYmIGQubWVudSkge1xuICAgICAgICAgICAgICAgIGQubWVudSA9IF8uZmlsdGVyKF8uc29ydEJ5KGQubWVudSwgJ29yZGVyJyksIChtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XG4gICAgICAgIGlmKCF0aGlzLmRpc3BsYXkpIHtcbiAgICAgICAgICAgIHJldHVybiAnZGlzcGxheTogbm9uZTsnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UsICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfSk7XG4gICAgXG4gICAgXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxuXG5jb25zdCBtZXRhUG9pbnRzID0gcmVxdWlyZSgnLi9tZW51L21ldGEtcG9pbnRzLmpzJyk7XG5jb25zdCBtZXRhSGVscCA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLWhlbHAuanMnKTtcbmNvbnN0IG1ldGFVc2VyID0gcmVxdWlyZSgnLi9tZW51L21ldGEtdXNlci5qcycpO1xuY29uc3QgbWV0YU5vdCA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLW5vdGlmaWNhdGlvbnMuanMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJ0b3AtbWVudVwiPlxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IHB1bGwtcmlnaHRcIj5cbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiIGlkPVwiaGVhZGVyX2Rhc2hib2FyZF9iYXJcIiBvbmNsaWNrPVwieyBvbkNsaWNrIH1cIj5cbiAgICAgICAgICAgIDxhIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgaHJlZj1cIiNob21lXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ob21lXCI+PC9pPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICA8L2xpPlxuXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfbm90aWZpY2F0aW9uX2JhclwiPjwvbGk+XG5cbmBcbiAgICAgICAgICAgIC8vIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cbiAgICAgICAgICAgIC8vIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX3BvaW50c19iYXJcIj48L2xpPlxuKyBgXG5cbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxuICAgICAgICA8bGkgaWQ9XCJoZWFkZXJfaGVscF9iYXJcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiPjwvbGk+XG5cbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxuICAgICAgICA8bGkgaWQ9XCJoZWFkZXJfdXNlcl9tZW51XCIgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi11c2VyIGRyb3Bkb3duXCI+PC9saT5cbiAgICA8L3VsPlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRvcG1lbnUnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICAvL1RPRE86IHJlc3RvcmUgbm90aWZpY2F0aW9ucyB3aGVuIGxvZ2ljIGlzIGNvbXBsZXRlXG4gICAgICAgIC8vcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9wb2ludHNfYmFyLCAnbWV0YS1wb2ludHMnKTtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9ub3RpZmljYXRpb25fYmFyLCAnbWV0YS1ub3RpZmljYXRpb25zJyk7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfaGVscF9iYXIsICdtZXRhLWhlbHAnKTtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl91c2VyX21lbnUsICdtZXRhLXVzZXInKTtcbiAgICB9KTtcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG9ydGxldC1ib2R5XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdyBtYXJnaW4tYm90dG9tLTMwXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+eyBoZWFkZXIudGl0bGUgfTwvaDE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxuXHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxsaSBlYWNoPVwieyBhcmVhcyB9XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XG5cdFx0XHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdFx0PC91bD5cblx0XHRcdFx0XHRcdFx0PCEtLSBCbG9ja3F1b3RlcyAtLT5cblx0XHRcdFx0XHRcdFx0PGJsb2NrcXVvdGUgY2xhc3M9XCJoZXJvXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+eyBxdW90ZS50ZXh0IH08L3A+XG5cdFx0XHRcdFx0XHRcdFx0PHNtYWxsPnsgcXVvdGUuYnkgfTwvc21hbGw+XG5cdFx0XHRcdFx0XHRcdDwvYmxvY2txdW90ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWRkdGhpc19ob3Jpem9udGFsX2ZvbGxvd190b29sYm94XCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3MgPVwiY29sLW1kLTZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlmcmFtZSBpZj1cInsgaGVhZGVyLnlvdXR1YmVpZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ5dHBsYXllclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0L2h0bWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC97IGhlYWRlci55b3V0dWJlaWQgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcyA9XCJmaXR2aWRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJoZWlnaHQ6IDMyN3B4OyB3aWR0aDogMTAwJTsgZGlzcGxheTogYmxvY2s7IG1hcmdpbi1sZWZ0OiBhdXRvOyBtYXJnaW4tcmlnaHQ6IGF1dG87IGJyb2RlcjogMDtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG5cdFx0XHRcdFx0XHRcdDwvaWZyYW1lPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxuXHRcdFx0XHRcdFx0PGgzPnsgdXNlck5hbWUgfXsgdmlzaW9uLnRpdGxlIH08L2gzPlxuXHRcdFx0XHRcdDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyB2aXNpb24udGV4dCB9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ2hvbWUnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5hcmVhcyA9IFtdXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxuXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLkhPTUUsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuYXJlYXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLmFyZWFzLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucXVvdGUgPSBkYXRhLnF1b3RlO1xuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICB0aGlzLnZpc2lvbiA9IGRhdGEudmlzaW9uO1xuXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XG5cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnZGF0YXRhYmxlcycpXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcblxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcbmNvbnN0IFNoYXJlTWFwID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9TaGFyZU1hcCcpXG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGlkPVwibXlfbWFwc19wYWdlXCIgY2xhc3M9XCJwb3J0bGV0IGJveCBncmV5LWNhc2NhZGVcIj5cbiAgICA8ZGl2IGNsYXNzPVwicG9ydGxldC10aXRsZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1pY29uLXRoLWxhcmdlXCI+PC9pPk1ldGFNYXBzXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlmPVwieyBtZW51IH1cIiBjbGFzcz1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxhIGVhY2g9XCJ7IG1lbnUuYnV0dG9ucyB9XCIgaHJlZj1cInsgbGluayB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQWN0aW9uQ2xpY2sgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY29nc1wiPjwvaT4gVG9vbHMgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lbnUubWVudSB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uTWVudUNsaWNrIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxuICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnMgcG9ydGxldC10YWJzXCI+XG4gICAgICAgICAgICA8bGkgb25jbGljaz1cInsgcGFyZW50Lm9uVGFiU3dpdGNoIH1cIiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ7IGFjdGl2ZTogaSA9PSAwIH1cIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI215bWFwc18xX3sgaSB9XCIgZGF0YS10b2dnbGU9XCJ0YWJcIiBhcmlhLWV4cGFuZGVkPVwieyB0cnVlOiBpID09IDAgfVwiPlxuICAgICAgICAgICAgICAgIHsgdmFsLnRpdGxlIH08L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGUtdG9vbGJhclwiPlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIHRhYnMgfVwiIGNsYXNzPVwidGFiLXBhbmUgZmFzZSBpbiB7IGFjdGl2ZTogaSA9PSAwIH1cIiBpZD1cIm15bWFwc18xX3sgaSB9XCI+XG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlclwiIGlkPVwibXltYXBzX3RhYmxlX3sgaSB9XCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJ0YWJsZS1jaGVja2JveFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiZ3JvdXAtY2hlY2thYmxlXCIgZGF0YS1zZXQ9XCIjbXltYXBzX3RhYmxlX3sgaSB9IC5jaGVja2JveGVzXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVkIE9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3duZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGlmPVwieyBwYXJlbnQuZGF0YSAmJiBwYXJlbnQuZGF0YVtpXSB9XCIgZWFjaD1cInsgcGFyZW50LmRhdGFbaV0gfVwiIGNsYXNzPVwib2RkIGdyYWRlWFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIHx8IHBhcmVudC51c2VyLmlzQWRtaW4gfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hlc1wiIHZhbHVlPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc20gYmx1ZSBmaWx0ZXItc3VibWl0XCIgb25jbGljaz1cInsgcGFyZW50Lm9uT3BlbiB9XCI+T3BlbjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vblNoYXJlIH1cIj5TaGFyZSA8aSBjbGFzcz1cImZhIGZhLXNoYXJlXCI+PC9pPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiIGNsYXNzPVwiYnRuIGJ0bi1zbSByZWRcIiBvbmNsaWNrPVwieyBwYXJlbnQub25Db3B5IH1cIj5Db3B5IDxpIGNsYXNzPVwiZmEgZmEtY2xvbmVcIj48L2k+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyBlZGl0YWJsZSB9XCIgY2xhc3M9XCJtZXRhX2VkaXRhYmxlX3sgaSB9XCIgZGF0YS1waz1cInsgaWQgfVwiIGRhdGEtdGl0bGU9XCJFZGl0IE1hcCBOYW1lXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgbmFtZSB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7ICFlZGl0YWJsZSB9XCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgbmFtZSB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgY3JlYXRlZF9hdCB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IHBhcmVudC5nZXRTdGF0dXModGhpcykgfVwiPjwvcmF3PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhdyBjb250ZW50PVwieyBwYXJlbnQuZ2V0T3duZXIodGhpcykgfVwiPjwvcmF3PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ215LW1hcHMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcblxuICAgIHRoaXMudXNlciA9IE1ldGFNYXAuVXNlcjtcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICAgIHRoaXMubWVudSA9IG51bGw7XG4gICAgbGV0IHRhYnMgPSBbXG4gICAgICAgIHsgdGl0bGU6ICdNeSBNYXBzJywgb3JkZXI6IDAsIGVkaXRhYmxlOiB0cnVlIH0sXG4gICAgICAgIHsgdGl0bGU6ICdTaGFyZWQgd2l0aCBNZScsIG9yZGVyOiAxLCBlZGl0YWJsZTogZmFsc2UgfSxcbiAgICAgICAgeyB0aXRsZTogJ1B1YmxpYycsIG9yZGVyOiAyLCBlZGl0YWJsZTogZmFsc2UgfVxuICAgIF07XG4gICAgaWYgKHRoaXMudXNlci5pc0FkbWluKSB7XG4gICAgICAgIHRhYnMucHVzaCh7IHRpdGxlOiAnQWxsIE1hcHMnLCBvcmRlcjogMywgZWRpdGFibGU6IHRydWUgfSlcbiAgICAgICAgdGFicy5wdXNoKHsgdGl0bGU6ICdUZW1wbGF0ZXMnLCBvcmRlcjogNCwgZWRpdGFibGU6IHRydWUgfSlcbiAgICB9XG4gICAgdGhpcy50YWJzID0gXy5zb3J0QnkodGFicywgJ29yZGVyJylcblxuICAgIHRoaXMuY3VycmVudFRhYiA9ICdNeSBNYXBzJztcblxuICAgIC8vXG4gICAgdGhpcy5nZXRTdGF0dXMgPSAoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgc3RhdHVzID0gJ1ByaXZhdGUnXG4gICAgICAgIGxldCBjb2RlID0gJ2RlZmF1bHQnXG4gICAgICAgIGxldCBodG1sID0gJyc7XG4gICAgICAgIGlmIChpdGVtLnNoYXJlZF93aXRoKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5zaGFyZWRfd2l0aFsnKiddICYmIChpdGVtLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlIHx8IGl0ZW0uc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdQdWJsaWMnXG4gICAgICAgICAgICAgICAgY29kZSA9ICdwcmltYXJ5J1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLmVhY2goaXRlbS5zaGFyZWRfd2l0aCwgKHNoYXJlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoYXJlLnBpY3R1cmUgJiYga2V5ICE9ICcqJyAmJiBrZXkgIT0gJ2FkbWluJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJsYWJlbCBvd25lci1sYWJlbFwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtcGxhY2VtZW50PVwiYm90dG9tXCIgdGl0bGU9XCIke3NoYXJlLm5hbWV9XCI+PGltZyBhbHQ9XCIke3NoYXJlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtzaGFyZS5waWN0dXJlfVwiPjwvc3Bhbj5gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGlmIChodG1sKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSAnPHNwYW4gY2xhc3M9XCJcIj5TaGFyZWQgd2l0aDogPC9zcGFuPicgKyBodG1sO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBodG1sID0gaHRtbCB8fCBgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC0ke2NvZGV9XCI+JHtzdGF0dXN9PC9zcGFuPmBcblxuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICB0aGlzLmdldE93bmVyID0gKGl0ZW0pID0+IHtcbiAgICAgICAgbGV0IGh0bWwgPSBgPHNwYW4gY2xhc3M9XCJsYWJlbCBvd25lci1sYWJlbFwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtcGxhY2VtZW50PVwiYm90dG9tXCIgdGl0bGU9XCIke2l0ZW0ub3duZXIubmFtZX1cIj48aW1nIGFsdD1cIiR7aXRlbS5vd25lci5uYW1lfVwiIGhlaWdodD1cIjMwXCIgd2lkdGg9XCIzMFwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cIiR7aXRlbS5vd25lci5waWN0dXJlfVwiPjwvc3Bhbj5gXG4gICAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8vRXZlbnRzXG4gICAgdGhpcy5vbk9wZW4gPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2V2ZW50Lml0ZW0uaWR9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5vblNoYXJlID0gKGV2ZW50LCAuLi5vKSA9PiB7XG4gICAgICAgIGxldCBvcHRzID0ge1xuICAgICAgICAgICAgbWFwOiBldmVudC5pdGVtXG4gICAgICAgIH1cbiAgICAgICAgU2hhcmVNYXAuYWN0KG9wdHMpO1xuICAgIH1cblxuICAgIHRoaXMub25Db3B5ID0gKGV2ZW50LCAuLi5vKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb3B5JylcbiAgICB9XG5cbiAgICB0aGlzLm9uVGFiU3dpdGNoID0gKGV2ZW50LCAuLi5vKSA9PiB7XG4gICAgICAgIHRoaXMuY3VycmVudFRhYiA9IGV2ZW50Lml0ZW0udmFsLnRpdGxlO1xuICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAkKCcub3duZXItbGFiZWwnKS50b29sdGlwKClcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRUYWIpIHtcbiAgICAgICAgICAgIGNhc2UgJ015IE1hcHMnOlxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9uQWN0aW9uQ2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm9uTWVudUNsaWNrID0gKGV2ZW50LCB0YWcpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRhYiA9PSAnTXkgTWFwcycpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQuaXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlTWFwcyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvRGVsZXRlTWFwLmpzJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJy5hY3RpdmUnKS5maW5kKCcubWFwaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goc2VsZWN0ZWQsIChjZWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChjZWxsLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGVNYXBzLmRlbGV0ZUFsbChpZHMsIENPTlNUQU5UUy5QQUdFUy5NWV9NQVBTKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmQgPSB0aGlzW2B0YWJsZTBgXS5maW5kKCd0Ym9keSB0ciAuY2hlY2tib3hlcycpO1xuICAgICAgICAgICAgICAgICAgICBmaW5kLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeS51bmlmb3JtLnVwZGF0ZShmaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XG5cbiAgICB9KVxuXG4gICAgLy9SaW90IGJpbmRpbmdzXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL215bWFwcycsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWVudSA9IHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogXy5zb3J0QnkoZGF0YS5idXR0b25zLCAnb3JkZXInKSxcbiAgICAgICAgICAgICAgICAgICAgbWVudTogXy5zb3J0QnkoZGF0YS5tZW51LCAnb3JkZXInKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYnVpbGRUYWJsZSA9IChpZHgsIGxpc3QsIGVkaXRhYmxlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaWR4XSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbYHRhYmxlJHtpZHh9YF0pIHtcbiAgICAgICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdID0gJCh0aGlzW2BteW1hcHNfdGFibGVfJHtpZHh9YF0pO1xuICAgICAgICAgICAgICAgIHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdID0gdGhpc1tgdGFibGUke2lkeH1gXS5EYXRhVGFibGUoe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVuY29tbWVudCBiZWxvdyBsaW5lKCdkb20nIHBhcmFtZXRlcikgdG8gZml4IHRoZSBkcm9wZG93biBvdmVyZmxvdyBpc3N1ZSBpbiB0aGUgZGF0YXRhYmxlIGNlbGxzLiBUaGUgZGVmYXVsdCBkYXRhdGFibGUgbGF5b3V0XG4gICAgICAgICAgICAgICAgICAgIC8vIHNldHVwIHVzZXMgc2Nyb2xsYWJsZSBkaXYodGFibGUtc2Nyb2xsYWJsZSkgd2l0aCBvdmVyZmxvdzphdXRvIHRvIGVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGwoc2VlOiBhc3NldHMvZ2xvYmFsL3BsdWdpbnMvZGF0YXRhYmxlcy9wbHVnaW5zL2Jvb3RzdHJhcC9kYXRhVGFibGVzLmJvb3RzdHJhcC5qcykuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHdoZW4gZHJvcGRvd25zIHVzZWQgdGhlIHNjcm9sbGFibGUgZGl2IHNob3VsZCBiZSByZW1vdmVkLlxuICAgICAgICAgICAgICAgICAgICAvLydkb20nOiAnPCdyb3cnPCdjb2wtbWQtNiBjb2wtc20tMTInbD48J2NvbC1tZC02IGNvbC1zbS0xMidmPnI+dDwncm93JzwnY29sLW1kLTUgY29sLXNtLTEyJ2k+PCdjb2wtbWQtNyBjb2wtc20tMTIncD4+JyxcbiAgICAgICAgICAgICAgICAgICAgLy8nYlN0YXRlU2F2ZSc6IHRydWUsIC8vIHNhdmUgZGF0YXRhYmxlIHN0YXRlKHBhZ2luYXRpb24sIHNvcnQsIGV0YykgaW4gY29va2llLlxuICAgICAgICAgICAgICAgICAgICAnY29sdW1ucyc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ2hja0J4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyMHB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ3JlYXRlZCBPbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1N0YXR1cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy90aGlzW2B0YWJsZSR7aWR4fWBdVG9vbHMgPSBuZXcgJC5mbi5kYXRhVGFibGUuVGFibGVUb29scyh0aGlzW2BkYXRhVGFibGUke2lkeH1gXSwge30pO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlV3JhcHBlciA9IHRoaXNbYHRhYmxlJHtpZHh9YF0ucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZChgI215bWFwc18ke2lkeH1fdGFibGVfd3JhcHBlcmApO1xuXG4gICAgICAgICAgICAgICAgdGhpc1tgdGFibGUke2lkeH1gXS5maW5kKCcuZ3JvdXAtY2hlY2thYmxlJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNldCA9IGpRdWVyeSh0aGlzKS5hdHRyKCdkYXRhLXNldCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlZCA9IGpRdWVyeSh0aGlzKS5pcygnOmNoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KHNldCkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5LnVuaWZvcm0udXBkYXRlKHNldCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdLm9uKCdjaGFuZ2UnLCAndGJvZHkgdHIgLmNoZWNrYm94ZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0YWJsZVdyYXBwZXIuZmluZCgnLmRhdGFUYWJsZXNfbGVuZ3RoIHNlbGVjdCcpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wgaW5wdXQteHNtYWxsIGlucHV0LWlubGluZScpOyAvLyBtb2RpZnkgdGFibGUgcGVyIHBhZ2UgZHJvcGRvd25cblxuICAgICAgICAgICAgICAgICQoYC5tZXRhX2VkaXRhYmxlXyR7aWR4fWApLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNldCAmJiB0aGlzLmRhdGFzZXQucGspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuZGF0YXNldC5waztcbiAgICAgICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YShwYXJhbXMubmV3VmFsdWUsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke2lkfS9uYW1lYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLmVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vRmV0Y2ggQWxsIG1hcHNcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5nZXRDaGlsZChDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVCkub24oJ3ZhbHVlJywgKHZhbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnRhYnMsICh0YWIpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbWFwcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0YWIudGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVGVtcGxhdGVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTXkgTWFwcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgPT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCkgeyAvL09ubHkgaW5jbHVkZSBteSBvd24gbWFwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnU2hhcmVkIHdpdGggTWUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aCAmJiAvL0V4Y2x1ZGUgYW55dGhpbmcgdGhhdCBpc24ndCBzaGFyZWQgYXQgYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICghb2JqLnNoYXJlZF93aXRoWycqJ10gfHwgKG9iai5zaGFyZWRfd2l0aFsnKiddLnJlYWQgIT0gdHJ1ZSB8fCBvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSAhPSB0cnVlKSkgJiYgLy9FeGNsdWRlIHB1YmxpYyBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXSAmJiAvL0luY2x1ZGUgc2hhcmVzIHdpaCBteSB1c2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXS53cml0ZSA9PSB0cnVlIHx8IC8vSW5jbHVkZSBhbnl0aGluZyBJIGNhbiB3cml0ZSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ucmVhZCA9PSB0cnVlKSAvL0luY2x1ZGUgYW55dGhpbmcgSSBjYW4gcmVhZCBmcm9tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSAob2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUHVibGljJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCAhPSBNZXRhTWFwLlVzZXIudXNlcklkICYmIC8vRG9uJ3QgaW5jbHVkZSBteSBvd24gbWFwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2hhcmVkX3dpdGggJiYgLy9FeGNsdWRlIGFueXRoaW5nIHRoYXQgaXNuJ3Qgc2hhcmVkIGF0IGFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoWycqJ10gJiYgKG9iai5zaGFyZWRfd2l0aFsnKiddLnJlYWQgPT0gdHJ1ZSB8fCBvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSApIC8vSW5jbHVkZSBwdWJsaWMgbWFwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gKG9iai5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQWxsIE1hcHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlci5pc0FkbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0xpa2UgaXQgc2F5cywgYWxsIG1hcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5jcmVhdGVkX2F0ID0gbW9tZW50KG5ldyBEYXRlKG9iai5jcmVhdGVkX2F0KSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1hcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8uZmlsdGVyKG1hcHMsIChtYXApID0+IHsgcmV0dXJuIG1hcCAmJiBtYXAuaWQgfSlcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRUYWJsZSh0YWIub3JkZXIsIG1hcHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKCcub3duZXItbGFiZWwnKS50b29sdGlwKClcbiAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgfSk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93IG1hcmdpbi1ib3R0b20tMzBcIj5cblx0XHRcdFx0XHRcdDxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+eyBoZWFkZXIudGl0bGUgfTwvaDE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgYXJlYXMgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRsaW5lXCI+XG4gICAgXHRcdFx0XHRcdFx0PGgzPnsgdGl0bGUgfTwvaDM+XG4gICAgXHRcdFx0XHRcdDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IHRleHQgfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC11bnN0eWxlZCBtYXJnaW4tdG9wLTEwIG1hcmdpbi1ib3R0b20tMTBcIj5cblx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj5cblx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XG5cdFx0XHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0XHQ8L3VsPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Rlcm1zJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICBcbiAgICB0aGlzLmFyZWFzID0gW11cbiAgICB0aGlzLmhlYWRlciA9IHt9XG5cbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuVEVSTVNfQU5EX0NPTkRJVElPTlMsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuYXJlYXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLnNlY3Rpb25zLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgIGxldCBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICBpZihpbmNsdWRlKSB7XG4gICAgICAgICAgICAgICAgZC5pdGVtcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGQuaXRlbXMsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5jbHVkZTIgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGUyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgdGhpcy51c2VyTmFtZSA9IE1ldGFNYXAuVXNlci5mdWxsTmFtZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIFxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgIH0pO1xufSk7IiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG4vKipcbkRlbW8gc2NyaXB0IHRvIGhhbmRsZSB0aGUgdGhlbWUgZGVtb1xuKiovXG52YXIgRGVtbyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIEhhbmRsZSBUaGVtZSBTZXR0aW5nc1xuICAgIHZhciBoYW5kbGVUaGVtZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgcGFuZWwgPSAkKCcudGhlbWUtcGFuZWwnKTtcblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWJveGVkJykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAkKCcubGF5b3V0LW9wdGlvbicsIHBhbmVsKS52YWwoXCJmbHVpZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJkZWZhdWx0XCIpO1xuICAgICAgICAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xuICAgICAgICAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImRlZmF1bHRcIik7XG4gICAgICAgIGlmICgkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJykuYXR0cihcImRpc2FibGVkXCIpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgJCgnLnNpZGViYXItcG9zLW9wdGlvbicsIHBhbmVsKS52YWwoTWV0cm9uaWMuaXNSVEwoKSA/ICdyaWdodCcgOiAnbGVmdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9oYW5kbGUgdGhlbWUgbGF5b3V0XG4gICAgICAgIHZhciByZXNldExheW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1ib3hlZFwiKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikuXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIikuXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcblxuICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyID4gLnBhZ2UtaGVhZGVyLWlubmVyJykucmVtb3ZlQ2xhc3MoXCJjb250YWluZXJcIik7XG5cbiAgICAgICAgICAgIGlmICgkKCcucGFnZS1jb250YWluZXInKS5wYXJlbnQoXCIuY29udGFpbmVyXCIpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLWNvbnRhaW5lcicpLmluc2VydEFmdGVyKCdib2R5ID4gLmNsZWFyZml4Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKCcucGFnZS1mb290ZXIgPiAuY29udGFpbmVyJykuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgkKCcucGFnZS1mb290ZXIgPiAuY29udGFpbmVyJykuaHRtbCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCgnLnBhZ2UtZm9vdGVyJykucGFyZW50KFwiLmNvbnRhaW5lclwiKS5zaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5pbnNlcnRBZnRlcignLnBhZ2UtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5pbnNlcnRBZnRlcignLnBhZ2UtZm9vdGVyJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLnJlbW92ZUNsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcblxuICAgICAgICAgICAgJCgnYm9keSA+IC5jb250YWluZXInKS5yZW1vdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbGFzdFNlbGVjdGVkTGF5b3V0ID0gJyc7XG5cbiAgICAgICAgdmFyIHNldExheW91dCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGxheW91dE9wdGlvbiA9ICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJPcHRpb24gPSAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgaGVhZGVyT3B0aW9uID0gJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmb290ZXJPcHRpb24gPSAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJQb3NPcHRpb24gPSAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJTdHlsZU9wdGlvbiA9ICQoJy5zaWRlYmFyLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudU9wdGlvbiA9ICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGhlYWRlclRvcERyb3Bkb3duU3R5bGUgPSAkKCcucGFnZS1oZWFkZXItdG9wLWRyb3Bkb3duLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcblxuXG4gICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PSBcImZpeGVkXCIgJiYgaGVhZGVyT3B0aW9uID09IFwiZGVmYXVsdFwiKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0RlZmF1bHQgSGVhZGVyIHdpdGggRml4ZWQgU2lkZWJhciBvcHRpb24gaXMgbm90IHN1cHBvcnRlZC4gUHJvY2VlZCB3aXRoIEZpeGVkIEhlYWRlciB3aXRoIEZpeGVkIFNpZGViYXIuJyk7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgc2lkZWJhck9wdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgICAgICAgICAgaGVhZGVyT3B0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzZXRMYXlvdXQoKTsgLy8gcmVzZXQgbGF5b3V0IHRvIGRlZmF1bHQgc3RhdGVcblxuICAgICAgICAgICAgaWYgKGxheW91dE9wdGlvbiA9PT0gXCJib3hlZFwiKSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1ib3hlZFwiKTtcblxuICAgICAgICAgICAgICAgIC8vIHNldCBoZWFkZXJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgPiAucGFnZS1oZWFkZXItaW5uZXInKS5hZGRDbGFzcyhcImNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICB2YXIgY29udCA9ICQoJ2JvZHkgPiAuY2xlYXJmaXgnKS5hZnRlcignPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGNvbnRlbnRcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1jb250YWluZXInKS5hcHBlbmRUbygnYm9keSA+IC5jb250YWluZXInKTtcblxuICAgICAgICAgICAgICAgIC8vIHNldCBmb290ZXJcbiAgICAgICAgICAgICAgICBpZiAoZm9vdGVyT3B0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmh0bWwoJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4nICsgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgpICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmFwcGVuZFRvKCdib2R5ID4gLmNvbnRhaW5lcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxhc3RTZWxlY3RlZExheW91dCAhPSBsYXlvdXRPcHRpb24pIHtcbiAgICAgICAgICAgICAgICAvL2xheW91dCBjaGFuZ2VkLCBydW4gcmVzcG9uc2l2ZSBoYW5kbGVyOlxuICAgICAgICAgICAgICAgIE1ldHJvbmljLnJ1blJlc2l6ZUhhbmRsZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0U2VsZWN0ZWRMYXlvdXQgPSBsYXlvdXRPcHRpb247XG5cbiAgICAgICAgICAgIC8vaGVhZGVyXG4gICAgICAgICAgICBpZiAoaGVhZGVyT3B0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLWhlYWRlclwiKS5yZW1vdmVDbGFzcyhcIm5hdmJhci1zdGF0aWMtdG9wXCIpLmFkZENsYXNzKFwibmF2YmFyLWZpeGVkLXRvcFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLWhlYWRlclwiKS5yZW1vdmVDbGFzcyhcIm5hdmJhci1maXhlZC10b3BcIikuYWRkQ2xhc3MoXCJuYXZiYXItc3RhdGljLXRvcFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaWRlYmFyXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWZ1bGwtd2lkdGgnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWZpeGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1kZWZhdWx0XCIpO1xuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdEZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1kZWZhdWx0XCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1maXhlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhci1tZW51JykudW5iaW5kKCdtb3VzZWVudGVyJykudW5iaW5kKCdtb3VzZWxlYXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0b3AgZHJvcGRvd24gc3R5bGVcbiAgICAgICAgICAgIGlmIChoZWFkZXJUb3BEcm9wZG93blN0eWxlID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICAkKFwiLnRvcC1tZW51ID4gLm5hdmJhci1uYXYgPiBsaS5kcm9wZG93blwiKS5hZGRDbGFzcyhcImRyb3Bkb3duLWRhcmtcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLnJlbW92ZUNsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9mb290ZXJcbiAgICAgICAgICAgIGlmIChmb290ZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2lkZWJhciBzdHlsZVxuICAgICAgICAgICAgaWYgKHNpZGViYXJTdHlsZU9wdGlvbiA9PT0gJ2NvbXBhY3QnKSB7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNvbXBhY3RcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1jb21wYWN0XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NpZGViYXIgbWVudVxuICAgICAgICAgICAgaWYgKHNpZGViYXJNZW51T3B0aW9uID09PSAnaG92ZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJPcHRpb24gPT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoXCJhY2NvcmRpb25cIik7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiSG92ZXIgU2lkZWJhciBNZW51IGlzIG5vdCBjb21wYXRpYmxlIHdpdGggRml4ZWQgU2lkZWJhciBNb2RlLiBTZWxlY3QgRGVmYXVsdCBTaWRlYmFyIE1vZGUgSW5zdGVhZC5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaWRlYmFyIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuaXNSVEwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyUG9zT3B0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAnbGVmdCdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhclBvc09wdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAnbGVmdCdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIExheW91dC5maXhDb250ZW50SGVpZ2h0KCk7IC8vIGZpeCBjb250ZW50IGhlaWdodFxuICAgICAgICAgICAgTGF5b3V0LmluaXRGaXhlZFNpZGViYXIoKTsgLy8gcmVpbml0aWFsaXplIGZpeGVkIHNpZGViYXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBoYW5kbGUgdGhlbWUgY29sb3JzXG4gICAgICAgIHZhciBzZXRDb2xvciA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICAgICAgdmFyIGNvbG9yXyA9IChNZXRyb25pYy5pc1JUTCgpID8gY29sb3IgKyAnLXJ0bCcgOiBjb2xvcik7XG4gICAgICAgICAgICAkKCcjc3R5bGVfY29sb3InKS5hdHRyKFwiaHJlZlwiLCBMYXlvdXQuZ2V0TGF5b3V0Q3NzUGF0aCgpICsgJ3RoZW1lcy8nICsgY29sb3JfICsgXCIuY3NzXCIpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgJCgnLnRoZW1lLWNvbG9ycyA+IGxpJywgcGFuZWwpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb2xvciA9ICQodGhpcykuYXR0cihcImRhdGEtdGhlbWVcIik7XG4gICAgICAgICAgICBzZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICAkKCd1bCA+IGxpJywgcGFuZWwpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKGNvbG9yID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1hY3Rpb25zIC5idG4nKS5yZW1vdmVDbGFzcygncmVkLWhhemUnKS5hZGRDbGFzcygnYnRuLWRlZmF1bHQgYnRuLXRyYW5zcGFyZW50Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLWFjdGlvbnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tZGVmYXVsdCBidG4tdHJhbnNwYXJlbnQnKS5hZGRDbGFzcygncmVkLWhhemUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2V0IGRlZmF1bHQgdGhlbWUgb3B0aW9uczpcblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1ib3hlZFwiKSkge1xuICAgICAgICAgICAgJCgnLmxheW91dC1vcHRpb24nLCBwYW5lbCkudmFsKFwiYm94ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIikpIHtcbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikpIHtcbiAgICAgICAgICAgICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbChcInJpZ2h0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1saWdodFwiKSkge1xuICAgICAgICAgICAgJCgnLnNpZGViYXItc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbChcImxpZ2h0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51XCIpKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoXCJob3ZlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaWRlYmFyT3B0aW9uID0gJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGhlYWRlck9wdGlvbiA9ICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgZm9vdGVyT3B0aW9uID0gJCgnLnBhZ2UtZm9vdGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyUG9zT3B0aW9uID0gJCgnLnNpZGViYXItcG9zLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyU3R5bGVPcHRpb24gPSAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhck1lbnVPcHRpb24gPSAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoKTtcblxuICAgICAgICAkKCcubGF5b3V0LW9wdGlvbiwgLnBhZ2UtaGVhZGVyLXRvcC1kcm9wZG93bi1zdHlsZS1vcHRpb24sIC5wYWdlLWhlYWRlci1vcHRpb24sIC5zaWRlYmFyLW9wdGlvbiwgLnBhZ2UtZm9vdGVyLW9wdGlvbiwgLnNpZGViYXItcG9zLW9wdGlvbiwgLnNpZGViYXItc3R5bGUtb3B0aW9uLCAuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS5jaGFuZ2Uoc2V0TGF5b3V0KTtcbiAgICB9O1xuXG4gICAgLy8gaGFuZGxlIHRoZW1lIHN0eWxlXG4gICAgdmFyIHNldFRoZW1lU3R5bGUgPSBmdW5jdGlvbihzdHlsZSkge1xuICAgICAgICB2YXIgZmlsZSA9IChzdHlsZSA9PT0gJ3JvdW5kZWQnID8gJ2NvbXBvbmVudHMtcm91bmRlZCcgOiAnY29tcG9uZW50cycpO1xuICAgICAgICBmaWxlID0gKE1ldHJvbmljLmlzUlRMKCkgPyBmaWxlICsgJy1ydGwnIDogZmlsZSk7XG5cbiAgICAgICAgJCgnI3N0eWxlX2NvbXBvbmVudHMnKS5hdHRyKFwiaHJlZlwiLCBNZXRyb25pYy5nZXRHbG9iYWxDc3NQYXRoKCkgKyBmaWxlICsgXCIuY3NzXCIpO1xuXG4gICAgICAgIGlmICgkLmNvb2tpZSkge1xuICAgICAgICAgICAgJC5jb29raWUoJ2xheW91dC1zdHlsZS1vcHRpb24nLCBzdHlsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgdGhlIHRoZW1lXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaGFuZGxlcyBzdHlsZSBjdXN0b21lciB0b29sXG4gICAgICAgICAgICBoYW5kbGVUaGVtZSgpO1xuXG4gICAgICAgICAgICAvLyBoYW5kbGUgbGF5b3V0IHN0eWxlIGNoYW5nZVxuICAgICAgICAgICAgJCgnLnRoZW1lLXBhbmVsIC5sYXlvdXQtc3R5bGUtb3B0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICBzZXRUaGVtZVN0eWxlKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNldCBsYXlvdXQgc3R5bGUgZnJvbSBjb29raWVcbiAgICAgICAgICAgIGlmICgkLmNvb2tpZSAmJiAkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpID09PSAncm91bmRlZCcpIHtcbiAgICAgICAgICAgICAgICBzZXRUaGVtZVN0eWxlKCQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykpO1xuICAgICAgICAgICAgICAgICQoJy50aGVtZS1wYW5lbCAubGF5b3V0LXN0eWxlLW9wdGlvbicpLnZhbCgkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbn0gKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVtbyIsImNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxuY29uc3QgTWV0cm9uaWMgPSByZXF1aXJlKCcuL21ldHJvbmljJylcbi8qKlxuQ29yZSBzY3JpcHQgdG8gaGFuZGxlIHRoZSBlbnRpcmUgdGhlbWUgYW5kIGNvcmUgZnVuY3Rpb25zXG4qKi9cbnZhciBMYXlvdXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBsYXlvdXRJbWdQYXRoID0gJ2FkbWluL2xheW91dDQvaW1nLyc7XG5cbiAgICB2YXIgbGF5b3V0Q3NzUGF0aCA9ICdhZG1pbi9sYXlvdXQ0L2Nzcy8nO1xuXG4gICAgdmFyIHJlc0JyZWFrcG9pbnRNZCA9IE1ldHJvbmljLmdldFJlc3BvbnNpdmVCcmVha3BvaW50KCdtZCcpO1xuXG4gICAgLy8qIEJFR0lOOkNPUkUgSEFORExFUlMgKi8vXG4gICAgLy8gdGhpcyBmdW5jdGlvbiBoYW5kbGVzIHJlc3BvbnNpdmUgbGF5b3V0IG9uIHNjcmVlbiBzaXplIHJlc2l6ZSBvciBtb2JpbGUgZGV2aWNlIHJvdGF0ZS5cblxuXG4gICAgLy8gSGFuZGxlIHNpZGViYXIgbWVudSBsaW5rc1xuICAgIHZhciBoYW5kbGVTaWRlYmFyTWVudUFjdGl2ZUxpbmsgPSBmdW5jdGlvbihtb2RlLCBlbCkge1xuICAgICAgICB2YXIgdXJsID0gbG9jYXRpb24uaGFzaC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XG5cbiAgICAgICAgaWYgKG1vZGUgPT09ICdjbGljaycgfHwgbW9kZSA9PT0gJ3NldCcpIHtcbiAgICAgICAgICAgIGVsID0gJChlbCk7XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ21hdGNoJykge1xuICAgICAgICAgICAgbWVudS5maW5kKFwibGkgPiBhXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgLy8gdXJsIG1hdGNoIGNvbmRpdGlvblxuICAgICAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA+IDEgJiYgdXJsLnN1YnN0cigxLCBwYXRoLmxlbmd0aCAtIDEpID09IHBhdGguc3Vic3RyKDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFlbCB8fCBlbC5zaXplKCkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsLmF0dHIoJ2hyZWYnKS50b0xvd2VyQ2FzZSgpID09PSAnamF2YXNjcmlwdDo7JyB8fCBlbC5hdHRyKCdocmVmJykudG9Mb3dlckNhc2UoKSA9PT0gJyMnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2xpZGVTcGVlZCA9IHBhcnNlSW50KG1lbnUuZGF0YShcInNsaWRlLXNwZWVkXCIpKTtcbiAgICAgICAgdmFyIGtlZXBFeHBhbmQgPSBtZW51LmRhdGEoXCJrZWVwLWV4cGFuZGVkXCIpO1xuXG4gICAgICAgIC8vIGRpc2FibGUgYWN0aXZlIHN0YXRlc1xuICAgICAgICBtZW51LmZpbmQoJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgbWVudS5maW5kKCdsaSA+IGEgPiAuc2VsZWN0ZWQnKS5yZW1vdmUoKTtcblxuICAgICAgICBpZiAobWVudS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudScpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbWVudS5maW5kKCdsaS5vcGVuJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmNoaWxkcmVuKCcuc3ViLW1lbnUnKS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz4gYSA+IC5hcnJvdy5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICBtZW51LmZpbmQoJ2xpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWwucGFyZW50cygnbGknKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+IGEgPiBzcGFuLmFycm93JykuYWRkQ2xhc3MoJ29wZW4nKTtcblxuICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50KCd1bC5wYWdlLXNpZGViYXItbWVudScpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnPiBhJykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInNlbGVjdGVkXCI+PC9zcGFuPicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5jaGlsZHJlbigndWwuc3ViLW1lbnUnKS5zaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtb2RlID09PSAnY2xpY2snKSB7XG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgc2lkZWJhciBtZW51XG4gICAgdmFyIGhhbmRsZVNpZGViYXJNZW51ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnbGkgPiBhJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA+PSByZXNCcmVha3BvaW50TWQgJiYgJCh0aGlzKS5wYXJlbnRzKCcucGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudScpLnNpemUoKSA9PT0gMSkgeyAvLyBleGl0IG9mIGhvdmVyIHNpZGViYXIgbWVudVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCQodGhpcykubmV4dCgpLmhhc0NsYXNzKCdzdWItbWVudScpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkuaGFzQ2xhc3MoJ3N1Yi1tZW51IGFsd2F5cy1vcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpO1xuICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgbWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xuICAgICAgICAgICAgdmFyIHN1YiA9ICQodGhpcykubmV4dCgpO1xuXG4gICAgICAgICAgICB2YXIgYXV0b1Njcm9sbCA9IG1lbnUuZGF0YShcImF1dG8tc2Nyb2xsXCIpO1xuICAgICAgICAgICAgdmFyIHNsaWRlU3BlZWQgPSBwYXJzZUludChtZW51LmRhdGEoXCJzbGlkZS1zcGVlZFwiKSk7XG4gICAgICAgICAgICB2YXIga2VlcEV4cGFuZCA9IG1lbnUuZGF0YShcImtlZXAtZXhwYW5kZWRcIik7XG5cbiAgICAgICAgICAgIGlmIChrZWVwRXhwYW5kICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuKCdsaS5vcGVuJykuY2hpbGRyZW4oJ2EnKS5jaGlsZHJlbignLmFycm93JykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5jaGlsZHJlbignLnN1Yi1tZW51Om5vdCguYWx3YXlzLW9wZW4pJykuc2xpZGVVcChzbGlkZVNwZWVkKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc2xpZGVPZmZlc2V0ID0gLTIwMDtcblxuICAgICAgICAgICAgaWYgKHN1Yi5pcyhcIjp2aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmFycm93JywgJCh0aGlzKSkucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIHN1Yi5zbGlkZVVwKHNsaWRlU3BlZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b1Njcm9sbCA9PT0gdHJ1ZSAmJiAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5zbGltU2Nyb2xsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Njcm9sbFRvJzogKHRoZS5wb3NpdGlvbigpKS50b3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8odGhlLCBzbGlkZU9mZmVzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5hcnJvdycsICQodGhpcykpLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICBzdWIuc2xpZGVEb3duKHNsaWRlU3BlZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b1Njcm9sbCA9PT0gdHJ1ZSAmJiAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5zbGltU2Nyb2xsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Njcm9sbFRvJzogKHRoZS5wb3NpdGlvbigpKS50b3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8odGhlLCBzbGlkZU9mZmVzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIGFqYXggbGlua3Mgd2l0aGluIHNpZGViYXIgbWVudVxuICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ2NsaWNrJywgJyBsaSA+IGEuYWpheGlmeScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcbiAgICAgICAgICAgIHZhciBtZW51Q29udGFpbmVyID0gJCgnLnBhZ2Utc2lkZWJhciB1bCcpO1xuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gJCgnLnBhZ2UtY29udGVudCcpO1xuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50Qm9keSA9ICQoJy5wYWdlLWNvbnRlbnQgLnBhZ2UtY29udGVudC1ib2R5Jyk7XG5cbiAgICAgICAgICAgIG1lbnVDb250YWluZXIuY2hpbGRyZW4oJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIG1lbnVDb250YWluZXIuY2hpbGRyZW4oJ2Fycm93Lm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ2xpJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCdhID4gc3Bhbi5hcnJvdycpLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnbGknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBNZXRyb25pYy5zdGFydFBhZ2VMb2FkaW5nKCk7XG5cbiAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlLnBhcmVudHMoJ2xpLm9wZW4nKS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXItbWVudSA+IGxpLm9wZW4gPiBhJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbChyZXMpO1xuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdEFqYXgoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHN0dWZmXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKCc8aDQ+Q291bGQgbm90IGxvYWQgdGhlIHJlcXVlc3RlZCBjb250ZW50LjwvaDQ+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBhamF4IGxpbmsgd2l0aGluIG1haW4gY29udGVudFxuICAgICAgICAkKCcucGFnZS1jb250ZW50Jykub24oJ2NsaWNrJywgJy5hamF4aWZ5JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gJCgnLnBhZ2UtY29udGVudCcpO1xuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50Qm9keSA9ICQoJy5wYWdlLWNvbnRlbnQgLnBhZ2UtY29udGVudC1ib2R5Jyk7XG5cbiAgICAgICAgICAgIE1ldHJvbmljLnN0YXJ0UGFnZUxvYWRpbmcoKTtcblxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmZpeENvbnRlbnRIZWlnaHQoKTsgLy8gZml4IGNvbnRlbnQgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLmluaXRBamF4KCk7IC8vIGluaXRpYWxpemUgY29yZSBzdHVmZlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKCc8aDQ+Q291bGQgbm90IGxvYWQgdGhlIHJlcXVlc3RlZCBjb250ZW50LjwvaDQ+Jyk7XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgc2Nyb2xsaW5nIHRvIHRvcCBvbiByZXNwb25zaXZlIG1lbnUgdG9nZ2xlciBjbGljayB3aGVuIGhlYWRlciBpcyBmaXhlZCBmb3IgbW9iaWxlIHZpZXdcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5wYWdlLWhlYWRlci1maXhlZC1tb2JpbGUgLnJlc3BvbnNpdmUtdG9nZ2xlcicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjYWxjdWxhdGUgc2lkZWJhciBoZWlnaHQgZm9yIGZpeGVkIHNpZGViYXIgbGF5b3V0LlxuICAgIHZhciBfY2FsY3VsYXRlRml4ZWRTaWRlYmFyVmlld3BvcnRIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNpZGViYXJIZWlnaHQgPSBNZXRyb25pYy5nZXRWaWV3UG9ydCgpLmhlaWdodCAtICQoJy5wYWdlLWhlYWRlcicpLm91dGVySGVpZ2h0KCkgLSAzMDtcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpKSB7XG4gICAgICAgICAgICBzaWRlYmFySGVpZ2h0ID0gc2lkZWJhckhlaWdodCAtICQoJy5wYWdlLWZvb3RlcicpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2lkZWJhckhlaWdodDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBmaXhlZCBzaWRlYmFyXG4gICAgdmFyIGhhbmRsZUZpeGVkU2lkZWJhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xuXG4gICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKG1lbnUpO1xuXG4gICAgICAgIGlmICgkKCcucGFnZS1zaWRlYmFyLWZpeGVkJykuc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA+PSByZXNCcmVha3BvaW50TWQpIHtcbiAgICAgICAgICAgIG1lbnUuYXR0cihcImRhdGEtaGVpZ2h0XCIsIF9jYWxjdWxhdGVGaXhlZFNpZGViYXJWaWV3cG9ydEhlaWdodCgpKTtcbiAgICAgICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKG1lbnUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgc2lkZWJhciB0b2dnbGVyIHRvIGNsb3NlL2hpZGUgdGhlIHNpZGViYXIuXG4gICAgdmFyIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYm9keSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKTtcbiAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XG4gICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5wYWdlLXNpZGViYXItbWVudScpLnJlbW92ZUNsYXNzKCdwYWdlLXNpZGViYXItbWVudS1jbG9zZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnBhZ2Utc2lkZWJhci1tZW51JykuYWRkQ2xhc3MoJ3BhZ2Utc2lkZWJhci1tZW51LWNsb3NlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEhhbmxlcyBzaWRlYmFyIHRvZ2dsZXJcbiAgICB2YXIgaGFuZGxlU2lkZWJhclRvZ2dsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGJvZHkgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHNpZGViYXIgc2hvdy9oaWRlXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnNpZGViYXItdG9nZ2xlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyID0gJCgnLnBhZ2Utc2lkZWJhcicpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJNZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XG4gICAgICAgICAgICAkKFwiLnNpZGViYXItc2VhcmNoXCIsIHNpZGViYXIpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcblxuICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpKSB7XG4gICAgICAgICAgICAgICAgYm9keS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIik7XG4gICAgICAgICAgICAgICAgc2lkZWJhck1lbnUucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1jbG9zZWRcIik7XG4gICAgICAgICAgICAgICAgaWYgKCQuY29va2llKSB7XG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdzaWRlYmFyX2Nsb3NlZCcsICcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib2R5LmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKTtcbiAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNsb3NlZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS50cmlnZ2VyKFwibW91c2VsZWF2ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQuY29va2llKSB7XG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdzaWRlYmFyX2Nsb3NlZCcsICcxJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggYmFyIGNsb3NlXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnLnNpZGViYXItc2VhcmNoIC5yZW1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSB0aGUgc2VhcmNoIHF1ZXJ5IHN1Ym1pdCBvbiBlbnRlciBwcmVzc1xuICAgICAgICAkKCcucGFnZS1zaWRlYmFyIC5zaWRlYmFyLXNlYXJjaCcpLm9uKCdrZXlwcmVzcycsICdpbnB1dC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy88LS0tLSBBZGQgdGhpcyBsaW5lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSB0aGUgc2VhcmNoIHN1Ym1pdChmb3Igc2lkZWJhciBzZWFyY2ggYW5kIHJlc3BvbnNpdmUgbW9kZSBvZiB0aGUgaGVhZGVyIHNlYXJjaClcbiAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoIC5zdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKSkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5oYXNDbGFzcygnb3BlbicpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnLnBhZ2Utc2lkZWJhci1maXhlZCcpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhciAuc2lkZWJhci10b2dnbGVyJykuY2xpY2soKTsgLy90cmlnZ2VyIHNpZGViYXIgdG9nZ2xlIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgY2xvc2Ugb24gYm9keSBjbGlja1xuICAgICAgICBpZiAoJCgnLnNpZGViYXItc2VhcmNoJykuc2l6ZSgpICE9PSAwKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2ggLmlucHV0LWdyb3VwJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5oYXNDbGFzcygnb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHRoZSBob3Jpem9udGFsIG1lbnVcbiAgICB2YXIgaGFuZGxlSGVhZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGhhbmRsZSBzZWFyY2ggYm94IGV4cGFuZC9jb2xsYXBzZVxuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbignY2xpY2snLCAnLnNlYXJjaC1mb3JtJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5mb3JtLWNvbnRyb2wnKS5mb2N1cygpO1xuXG4gICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnNlYXJjaC1mb3JtIC5mb3JtLWNvbnRyb2wnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5zZWFyY2gtZm9ybScpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnVuYmluZChcImJsdXJcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIGhvciBtZW51IHNlYXJjaCBmb3JtIG9uIGVudGVyIHByZXNzXG4gICAgICAgICQoJy5wYWdlLWhlYWRlcicpLm9uKCdrZXlwcmVzcycsICcuaG9yLW1lbnUgLnNlYXJjaC1mb3JtIC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykuc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgaGVhZGVyIHNlYXJjaCBidXR0b24gY2xpY2tcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyJykub24oJ21vdXNlZG93bicsICcuc2VhcmNoLWZvcm0ub3BlbiAuc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykuc3VibWl0KCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHRoZSBnbyB0byB0b3AgYnV0dG9uIGF0IHRoZSBmb290ZXJcbiAgICB2YXIgaGFuZGxlR29Ub3AgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IDMwMDtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gNTAwO1xuXG4gICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpKSB7IC8vIGlvcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICQod2luZG93KS5iaW5kKFwidG91Y2hlbmQgdG91Y2hjYW5jZWwgdG91Y2hsZWF2ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlSW4oZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZU91dChkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIGdlbmVyYWxcbiAgICAgICAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlSW4oZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZU91dChkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgIH0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyogRU5EOkNPUkUgSEFORExFUlMgKi8vXG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8vIE1haW4gaW5pdCBtZXRob2RzIHRvIGluaXRpYWxpemUgdGhlIGxheW91dFxuICAgICAgICAvLyBJTVBPUlRBTlQhISE6IERvIG5vdCBtb2RpZnkgdGhlIGNvcmUgaGFuZGxlcnMgY2FsbCBvcmRlci5cblxuICAgICAgICBpbml0SGVhZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZUhlYWRlcigpOyAvLyBoYW5kbGVzIGhvcml6b250YWwgbWVudVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldFNpZGViYXJNZW51QWN0aXZlTGluazogZnVuY3Rpb24obW9kZSwgZWwpIHtcbiAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluayhtb2RlLCBlbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFNpZGViYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9sYXlvdXQgaGFuZGxlcnNcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhcigpOyAvLyBoYW5kbGVzIGZpeGVkIHNpZGViYXIgbWVudVxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhck1lbnUoKTsgLy8gaGFuZGxlcyBtYWluIG1lbnVcbiAgICAgICAgICAgIGhhbmRsZVNpZGViYXJUb2dnbGVyKCk7IC8vIGhhbmRsZXMgc2lkZWJhciBoaWRlL3Nob3dcblxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmlzQW5ndWxhckpzQXBwKCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVTaWRlYmFyTWVudUFjdGl2ZUxpbmsoJ21hdGNoJyk7IC8vIGluaXQgc2lkZWJhciBhY3RpdmUgbGlua3NcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgTWV0cm9uaWMuYWRkUmVzaXplSGFuZGxlcihoYW5kbGVGaXhlZFNpZGViYXIpOyAvLyByZWluaXRpYWxpemUgZml4ZWQgc2lkZWJhciBvbiB3aW5kb3cgcmVzaXplXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdENvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRGb290ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlR29Ub3AoKTsgLy9oYW5kbGVzIHNjcm9sbCB0byB0b3AgZnVuY3Rpb25hbGl0eSBpbiB0aGUgZm9vdGVyXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pbml0SGVhZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRTaWRlYmFyKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRDb250ZW50KCk7XG4gICAgICAgICAgICB0aGlzLmluaXRGb290ZXIoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBmaXggdGhlIHNpZGViYXIgYW5kIGNvbnRlbnQgaGVpZ2h0IGFjY29yZGluZ2x5XG4gICAgICAgIGZpeENvbnRlbnRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRGaXhlZFNpZGViYXJIb3ZlckVmZmVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXJIb3ZlckVmZmVjdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRGaXhlZFNpZGViYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TGF5b3V0SW1nUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gTWV0cm9uaWMuZ2V0QXNzZXRzUGF0aCgpICsgbGF5b3V0SW1nUGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRMYXlvdXRDc3NQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBNZXRyb25pYy5nZXRBc3NldHNQYXRoKCkgKyBsYXlvdXRDc3NQYXRoO1xuICAgICAgICB9XG4gICAgfTtcblxufSAoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXQ7IiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5cbi8qKlxuQ29yZSBzY3JpcHQgdG8gaGFuZGxlIHRoZSBlbnRpcmUgdGhlbWUgYW5kIGNvcmUgZnVuY3Rpb25zXG4qKi9cbnZhciBNZXRyb25pYyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gSUUgbW9kZVxuICAgIHZhciBpc1JUTCA9IGZhbHNlO1xuICAgIHZhciBpc0lFOCA9IGZhbHNlO1xuICAgIHZhciBpc0lFOSA9IGZhbHNlO1xuICAgIHZhciBpc0lFMTAgPSBmYWxzZTtcblxuICAgIHZhciByZXNpemVIYW5kbGVycyA9IFtdO1xuXG4gICAgdmFyIGFzc2V0c1BhdGggPSAnLi4vLi4vYXNzZXRzLyc7XG5cbiAgICB2YXIgZ2xvYmFsSW1nUGF0aCA9ICdnbG9iYWwvaW1nLyc7XG5cbiAgICB2YXIgZ2xvYmFsUGx1Z2luc1BhdGggPSAnZ2xvYmFsL3BsdWdpbnMvJztcblxuICAgIHZhciBnbG9iYWxDc3NQYXRoID0gJ2dsb2JhbC9jc3MvJztcblxuICAgIC8vIHRoZW1lIGxheW91dCBjb2xvciBzZXRcblxuICAgIHZhciBicmFuZENvbG9ycyA9IHtcbiAgICAgICAgJ2JsdWUnOiAnIzg5QzRGNCcsXG4gICAgICAgICdyZWQnOiAnI0YzNTY1RCcsXG4gICAgICAgICdncmVlbic6ICcjMWJiYzliJyxcbiAgICAgICAgJ3B1cnBsZSc6ICcjOWI1OWI2JyxcbiAgICAgICAgJ2dyZXknOiAnIzk1YTVhNicsXG4gICAgICAgICd5ZWxsb3cnOiAnI0Y4Q0IwMCdcbiAgICB9O1xuXG4gICAgLy8gaW5pdGlhbGl6ZXMgbWFpbiBzZXR0aW5nc1xuICAgIHZhciBoYW5kbGVJbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5jc3MoJ2RpcmVjdGlvbicpID09PSAncnRsJykge1xuICAgICAgICAgICAgaXNSVEwgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNJRTggPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgOC4wLyk7XG4gICAgICAgIGlzSUU5ID0gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFIDkuMC8pO1xuICAgICAgICBpc0lFMTAgPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgMTAuMC8pO1xuXG4gICAgICAgIGlmIChpc0lFMTApIHtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaWUxMCcpOyAvLyBkZXRlY3QgSUUxMCB2ZXJzaW9uXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNJRTEwIHx8IGlzSUU5IHx8IGlzSUU4KSB7XG4gICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2llJyk7IC8vIGRldGVjdCBJRTEwIHZlcnNpb25cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBydW5zIGNhbGxiYWNrIGZ1bmN0aW9ucyBzZXQgYnkgTWV0cm9uaWMuYWRkUmVzcG9uc2l2ZUhhbmRsZXIoKS5cbiAgICB2YXIgX3J1blJlc2l6ZUhhbmRsZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIHJlaW5pdGlhbGl6ZSBvdGhlciBzdWJzY3JpYmVkIGVsZW1lbnRzXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzaXplSGFuZGxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlYWNoID0gcmVzaXplSGFuZGxlcnNbaV07XG4gICAgICAgICAgICBlYWNoLmNhbGwoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBoYW5kbGUgdGhlIGxheW91dCByZWluaXRpYWxpemF0aW9uIG9uIHdpbmRvdyByZXNpemVcbiAgICB2YXIgaGFuZGxlT25SZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlc2l6ZTtcbiAgICAgICAgaWYgKGlzSUU4KSB7XG4gICAgICAgICAgICB2YXIgY3VycmhlaWdodDtcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJoZWlnaHQgPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vcXVpdGUgZXZlbnQgc2luY2Ugb25seSBib2R5IHJlc2l6ZWQgbm90IHdpbmRvdy5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzaXplID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgX3J1blJlc2l6ZUhhbmRsZXJzKCk7XG4gICAgICAgICAgICAgICAgfSwgNTApOyAvLyB3YWl0IDUwbXMgdW50aWwgd2luZG93IHJlc2l6ZSBmaW5pc2hlcy5cbiAgICAgICAgICAgICAgICBjdXJyaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gc3RvcmUgbGFzdCBib2R5IGNsaWVudCBoZWlnaHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNpemUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcbiAgICAgICAgICAgICAgICB9LCA1MCk7IC8vIHdhaXQgNTBtcyB1bnRpbCB3aW5kb3cgcmVzaXplIGZpbmlzaGVzLlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBwb3J0bGV0IHRvb2xzICYgYWN0aW9uc1xuICAgIHZhciBoYW5kbGVQb3J0bGV0VG9vbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaGFuZGxlIHBvcnRsZXQgcmVtb3ZlXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IGEucmVtb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHBvcnRsZXQgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKTtcblxuICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKSkge1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVsb2FkJykudG9vbHRpcCgnZGVzdHJveScpO1xuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZW1vdmUnKS50b29sdGlwKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbmZpZycpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJykudG9vbHRpcCgnZGVzdHJveScpO1xuXG4gICAgICAgICAgICBwb3J0bGV0LnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgcG9ydGxldCBmdWxsc2NyZWVuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBwb3J0bGV0ID0gJCh0aGlzKS5jbG9zZXN0KFwiLnBvcnRsZXRcIik7XG4gICAgICAgICAgICBpZiAocG9ydGxldC5oYXNDbGFzcygncG9ydGxldC1mdWxsc2NyZWVuJykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvbicpO1xuICAgICAgICAgICAgICAgIHBvcnRsZXQucmVtb3ZlQ2xhc3MoJ3BvcnRsZXQtZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS5oZWlnaHQgLVxuICAgICAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC10aXRsZScpLm91dGVySGVpZ2h0KCkgLVxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcpKSAtXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnb24nKTtcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmFkZENsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoJ3BhZ2UtcG9ydGxldC1mdWxsc2NyZWVuJyk7XG4gICAgICAgICAgICAgICAgcG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gYS5yZWxvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKS5jaGlsZHJlbihcIi5wb3J0bGV0LWJvZHlcIik7XG4gICAgICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKFwiZGF0YS11cmxcIik7XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWVycm9yLWRpc3BsYXlcIik7XG4gICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuYmxvY2tVSSh7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogZWwsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb2xvcjogJ25vbmUnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnVuYmxvY2tVSShlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5odG1sKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSAnRXJyb3Igb24gcmVsb2FkaW5nIHRoZSBjb250ZW50LiBQbGVhc2UgY2hlY2sgeW91ciBjb25uZWN0aW9uIGFuZCB0cnkgYWdhaW4uJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvciA9PSBcInRvYXN0clwiICYmIHRvYXN0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciA9PSBcIm5vdGlmaWM4XCIgJiYgJC5ub3RpZmljOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQubm90aWZpYzgoJ3ppbmRleCcsIDExNTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLm5vdGlmaWM4KG1zZywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVtZTogJ3J1YnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaWZlOiAzMDAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KG1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZm9yIGRlbW8gcHVycG9zZVxuICAgICAgICAgICAgICAgIE1ldHJvbmljLmJsb2NrVUkoe1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGVsLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q29sb3I6ICdub25lJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy51bmJsb2NrVUkoZWwpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBsb2FkIGFqYXggZGF0YSBvbiBwYWdlIGluaXRcbiAgICAgICAgJCgnLnBvcnRsZXQgLnBvcnRsZXQtdGl0bGUgYS5yZWxvYWRbZGF0YS1sb2FkPVwidHJ1ZVwiXScpLmNsaWNrKCk7XG5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbGxhcHNlLCAucG9ydGxldCAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5leHBhbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKS5jaGlsZHJlbihcIi5wb3J0bGV0LWJvZHlcIik7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNvbGxhcHNlXCIpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImNvbGxhcHNlXCIpLmFkZENsYXNzKFwiZXhwYW5kXCIpO1xuICAgICAgICAgICAgICAgIGVsLnNsaWRlVXAoMjAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImV4cGFuZFwiKS5hZGRDbGFzcyhcImNvbGxhcHNlXCIpO1xuICAgICAgICAgICAgICAgIGVsLnNsaWRlRG93bigyMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBjdXN0b20gY2hlY2tib3hlcyAmIHJhZGlvcyB1c2luZyBqUXVlcnkgVW5pZm9ybSBwbHVnaW5cbiAgICB2YXIgaGFuZGxlVW5pZm9ybSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoKS51bmlmb3JtKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRlc3QgPSAkKFwiaW5wdXRbdHlwZT1jaGVja2JveF06bm90KC50b2dnbGUsIC5tZC1jaGVjaywgLm1kLXJhZGlvYnRuLCAubWFrZS1zd2l0Y2gsIC5pY2hlY2spLCBpbnB1dFt0eXBlPXJhZGlvXTpub3QoLnRvZ2dsZSwgLm1kLWNoZWNrLCAubWQtcmFkaW9idG4sIC5zdGFyLCAubWFrZS1zd2l0Y2gsIC5pY2hlY2spXCIpO1xuICAgICAgICBpZiAodGVzdC5zaXplKCkgPiAwKSB7XG4gICAgICAgICAgICB0ZXN0LmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50cyhcIi5jaGVja2VyXCIpLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS51bmlmb3JtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlc21hdGVyaWFsIGRlc2lnbiBjaGVja2JveGVzXG4gICAgdmFyIGhhbmRsZU1hdGVyaWFsRGVzaWduID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gTWF0ZXJpYWwgZGVzaWduIGNrZWNrYm94IGFuZCByYWRpbyBlZmZlY3RzXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLm1kLWNoZWNrYm94ID4gbGFiZWwsIC5tZC1yYWRpbyA+IGxhYmVsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcbiAgICAgICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IHNwYW4gd2hpY2ggaXMgb3VyIGNpcmNsZS9idWJibGVcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2hpbGRyZW4oJ3NwYW46Zmlyc3QtY2hpbGQnKTtcblxuICAgICAgICAgICAgLy8gYWRkIHRoZSBidWJibGUgY2xhc3MgKHdlIGRvIHRoaXMgc28gaXQgZG9lc250IHNob3cgb24gcGFnZSBsb2FkKVxuICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2luYycpO1xuXG4gICAgICAgICAgICAvLyBjbG9uZSBpdFxuICAgICAgICAgICAgdmFyIG5ld29uZSA9IGVsLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICAvLyBhZGQgdGhlIGNsb25lZCB2ZXJzaW9uIGJlZm9yZSBvdXIgb3JpZ2luYWxcbiAgICAgICAgICAgIGVsLmJlZm9yZShuZXdvbmUpO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIG9yaWdpbmFsIHNvIHRoYXQgaXQgaXMgcmVhZHkgdG8gcnVuIG9uIG5leHQgY2xpY2tcbiAgICAgICAgICAgICQoXCIuXCIgKyBlbC5hdHRyKFwiY2xhc3NcIikgKyBcIjpsYXN0XCIsIHRoZSkucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtbWQnKSkge1xuICAgICAgICAgICAgLy8gTWF0ZXJpYWwgZGVzaWduIGNsaWNrIGVmZmVjdFxuICAgICAgICAgICAgLy8gY3JlZGl0IHdoZXJlIGNyZWRpdCdzIGR1ZTsgaHR0cDovL3RoZWNvZGVwbGF5ZXIuY29tL3dhbGt0aHJvdWdoL3JpcHBsZS1jbGljay1lZmZlY3QtZ29vZ2xlLW1hdGVyaWFsLWRlc2lnblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQsIGNpcmNsZSwgZCwgeCwgeTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnYS5idG4sIGJ1dHRvbi5idG4sIGlucHV0LmJ0biwgbGFiZWwuYnRuJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudC5maW5kKFwiLm1kLWNsaWNrLWNpcmNsZVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnByZXBlbmQoXCI8c3BhbiBjbGFzcz0nbWQtY2xpY2stY2lyY2xlJz48L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNpcmNsZSA9IGVsZW1lbnQuZmluZChcIi5tZC1jbGljay1jaXJjbGVcIik7XG4gICAgICAgICAgICAgICAgY2lyY2xlLnJlbW92ZUNsYXNzKFwibWQtY2xpY2stYW5pbWF0ZVwiKTtcblxuICAgICAgICAgICAgICAgIGlmKCFjaXJjbGUuaGVpZ2h0KCkgJiYgIWNpcmNsZS53aWR0aCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSBNYXRoLm1heChlbGVtZW50Lm91dGVyV2lkdGgoKSwgZWxlbWVudC5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlLmNzcyh7aGVpZ2h0OiBkLCB3aWR0aDogZH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHggPSBlLnBhZ2VYIC0gZWxlbWVudC5vZmZzZXQoKS5sZWZ0IC0gY2lyY2xlLndpZHRoKCkvMjtcbiAgICAgICAgICAgICAgICB5ID0gZS5wYWdlWSAtIGVsZW1lbnQub2Zmc2V0KCkudG9wIC0gY2lyY2xlLmhlaWdodCgpLzI7XG5cbiAgICAgICAgICAgICAgICBjaXJjbGUuY3NzKHt0b3A6IHkrJ3B4JywgbGVmdDogeCsncHgnfSkuYWRkQ2xhc3MoXCJtZC1jbGljay1hbmltYXRlXCIpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGbG9hdGluZyBsYWJlbHNcbiAgICAgICAgdmFyIGhhbmRsZUlucHV0ID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGlmIChlbC52YWwoKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2VkaXRlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmVDbGFzcygnZWRpdGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2tleWRvd24nLCAnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZUlucHV0KCQodGhpcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdibHVyJywgJy5mb3JtLW1kLWZsb2F0aW5nLWxhYmVsIC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBoYW5kbGVJbnB1dCgkKHRoaXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdlZGl0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyBjdXN0b20gY2hlY2tib3hlcyAmIHJhZGlvcyB1c2luZyBqUXVlcnkgaUNoZWNrIHBsdWdpblxuICAgIHZhciBoYW5kbGVpQ2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCEkKCkuaUNoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuaWNoZWNrJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGVja2JveENsYXNzID0gJCh0aGlzKS5hdHRyKCdkYXRhLWNoZWNrYm94JykgPyAkKHRoaXMpLmF0dHIoJ2RhdGEtY2hlY2tib3gnKSA6ICdpY2hlY2tib3hfbWluaW1hbC1ncmV5JztcbiAgICAgICAgICAgIHZhciByYWRpb0NsYXNzID0gJCh0aGlzKS5hdHRyKCdkYXRhLXJhZGlvJykgPyAkKHRoaXMpLmF0dHIoJ2RhdGEtcmFkaW8nKSA6ICdpcmFkaW9fbWluaW1hbC1ncmV5JztcblxuICAgICAgICAgICAgaWYgKGNoZWNrYm94Q2xhc3MuaW5kZXhPZignX2xpbmUnKSA+IC0xIHx8IHJhZGlvQ2xhc3MuaW5kZXhPZignX2xpbmUnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soe1xuICAgICAgICAgICAgICAgICAgICBjaGVja2JveENsYXNzOiBjaGVja2JveENsYXNzLFxuICAgICAgICAgICAgICAgICAgICByYWRpb0NsYXNzOiByYWRpb0NsYXNzLFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICc8ZGl2IGNsYXNzPVwiaWNoZWNrX2xpbmUtaWNvblwiPjwvZGl2PicgKyAkKHRoaXMpLmF0dHIoXCJkYXRhLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcykuaUNoZWNrKHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hDbGFzczogY2hlY2tib3hDbGFzcyxcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9DbGFzczogcmFkaW9DbGFzc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgc3dpdGNoZXNcbiAgICB2YXIgaGFuZGxlQm9vdHN0cmFwU3dpdGNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgpLmJvb3RzdHJhcFN3aXRjaCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoJy5tYWtlLXN3aXRjaCcpLmJvb3RzdHJhcFN3aXRjaCgpO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBjb25maXJtYXRpb25zXG4gICAgdmFyIGhhbmRsZUJvb3RzdHJhcENvbmZpcm1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoKS5jb25maXJtYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKCdbZGF0YS10b2dnbGU9Y29uZmlybWF0aW9uXScpLmNvbmZpcm1hdGlvbih7IGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLCBidG5Pa0NsYXNzOiAnYnRuIGJ0bi1zbSBidG4tc3VjY2VzcycsIGJ0bkNhbmNlbENsYXNzOiAnYnRuIGJ0bi1zbSBidG4tZGFuZ2VyJ30pO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIEFjY29yZGlvbnMuXG4gICAgdmFyIGhhbmRsZUFjY29yZGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdzaG93bi5icy5jb2xsYXBzZScsICcuYWNjb3JkaW9uLnNjcm9sbGFibGUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygkKGUudGFyZ2V0KSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBUYWJzLlxuICAgIHZhciBoYW5kbGVUYWJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vYWN0aXZhdGUgdGFiIGlmIHRhYiBpZCBwcm92aWRlZCBpbiB0aGUgVVJMXG4gICAgICAgIGlmIChsb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgICAgICB2YXIgdGFiaWQgPSBlbmNvZGVVUkkobG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xuICAgICAgICAgICAgJCgnYVtocmVmPVwiIycgKyB0YWJpZCArICdcIl0nKS5wYXJlbnRzKCcudGFiLXBhbmU6aGlkZGVuJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFiaWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAgICAgICAkKCdhW2hyZWY9XCIjJyArIHRhYmlkICsgJ1wiXScpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCkudGFiZHJvcCkge1xuICAgICAgICAgICAgJCgnLnRhYmJhYmxlLXRhYmRyb3AgLm5hdi1waWxscywgLnRhYmJhYmxlLXRhYmRyb3AgLm5hdi10YWJzJykudGFiZHJvcCh7XG4gICAgICAgICAgICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZmEgZmEtZWxsaXBzaXMtdlwiPjwvaT4mbmJzcDs8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgTW9kYWxzLlxuICAgIHZhciBoYW5kbGVNb2RhbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gZml4IHN0YWNrYWJsZSBtb2RhbCBpc3N1ZTogd2hlbiAyIG9yIG1vcmUgbW9kYWxzIG9wZW5lZCwgY2xvc2luZyBvbmUgb2YgbW9kYWwgd2lsbCByZW1vdmUgLm1vZGFsLW9wZW4gY2xhc3MuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZS5icy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCQoJy5tb2RhbDp2aXNpYmxlJykuc2l6ZSgpID4gMSAmJiAkKCdodG1sJykuaGFzQ2xhc3MoJ21vZGFsLW9wZW4nKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCgnLm1vZGFsOnZpc2libGUnKS5zaXplKCkgPD0gMSkge1xuICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmaXggcGFnZSBzY3JvbGxiYXJzIGlzc3VlXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignc2hvdy5icy5tb2RhbCcsICcubW9kYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwibW9kYWwtc2Nyb2xsXCIpKSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwibW9kYWwtb3Blbi1ub3Njcm9sbFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZml4IHBhZ2Ugc2Nyb2xsYmFycyBpc3N1ZVxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2hpZGUuYnMubW9kYWwnLCAnLm1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJtb2RhbC1vcGVuLW5vc2Nyb2xsXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZW1vdmUgYWpheCBjb250ZW50IGFuZCByZW1vdmUgY2FjaGUgb24gbW9kYWwgY2xvc2VkXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZGVuLmJzLm1vZGFsJywgJy5tb2RhbDpub3QoLm1vZGFsLWNhY2hlZCknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZURhdGEoJ2JzLm1vZGFsJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBUb29sdGlwcy5cbiAgICB2YXIgaGFuZGxlVG9vbHRpcHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gZ2xvYmFsIHRvb2x0aXBzXG4gICAgICAgICQoJy50b29sdGlwcycpLnRvb2x0aXAoKTtcblxuICAgICAgICAvLyBwb3J0bGV0IHRvb2x0aXBzXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgLmZ1bGxzY3JlZW4nKS50b29sdGlwKHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxuICAgICAgICAgICAgdGl0bGU6ICdGdWxsc2NyZWVuJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZWxvYWQnKS50b29sdGlwKHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxuICAgICAgICAgICAgdGl0bGU6ICdSZWxvYWQnXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbW92ZScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXG4gICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSdcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29uZmlnJykudG9vbHRpcCh7XG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcbiAgICAgICAgICAgIHRpdGxlOiAnU2V0dGluZ3MnXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbGxhcHNlLCAucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmV4cGFuZCcpLnRvb2x0aXAoe1xuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXG4gICAgICAgICAgICB0aXRsZTogJ0NvbGxhcHNlL0V4cGFuZCdcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIERyb3Bkb3duc1xuICAgIHZhciBoYW5kbGVEcm9wZG93bnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLypcbiAgICAgICAgICBIb2xkIGRyb3Bkb3duIG9uIGNsaWNrXG4gICAgICAgICovXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLmRyb3Bkb3duLW1lbnUuaG9sZC1vbi1jbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgaGFuZGxlQWxlcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtY2xvc2U9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCcuYWxlcnQnKS5oaWRlKCk7XG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5ub3RlJykuaGlkZSgpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ1tkYXRhLWNsb3NlPVwibm90ZVwiXScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5oaWRlKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtcmVtb3ZlPVwibm90ZVwiXScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBIb3dlciBEcm9wZG93bnNcbiAgICB2YXIgaGFuZGxlRHJvcGRvd25Ib3ZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCdbZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCJdJykubm90KCcuaG92ZXItaW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5kcm9wZG93bkhvdmVyKCk7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdob3Zlci1pbml0aWFsaXplZCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRleHRhcmVhIGF1dG9zaXplXG4gICAgdmFyIGhhbmRsZVRleHRhcmVhQXV0b3NpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZihhdXRvc2l6ZSkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBhdXRvc2l6ZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYS5hdXRvc2l6ZW1lJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgUG9wb3ZlcnNcblxuICAgIC8vIGxhc3QgcG9wZXAgcG9wb3ZlclxuICAgIHZhciBsYXN0UG9wZWRQb3BvdmVyO1xuXG4gICAgdmFyIGhhbmRsZVBvcG92ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wb3BvdmVycycpLnBvcG92ZXIoKTtcblxuICAgICAgICAvLyBjbG9zZSBsYXN0IGRpc3BsYXllZCBwb3BvdmVyXG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLnBvcG92ZXIuZGF0YS1hcGknLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAobGFzdFBvcGVkUG9wb3Zlcikge1xuICAgICAgICAgICAgICAgIGxhc3RQb3BlZFBvcG92ZXIucG9wb3ZlcignaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBzY3JvbGxhYmxlIGNvbnRlbnRzIHVzaW5nIGpRdWVyeSBTbGltU2Nyb2xsIHBsdWdpbi5cbiAgICB2YXIgaGFuZGxlU2Nyb2xsZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKCcuc2Nyb2xsZXInKTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBJbWFnZSBQcmV2aWV3IHVzaW5nIGpRdWVyeSBGYW5jeWJveCBwbHVnaW5cbiAgICB2YXIgaGFuZGxlRmFuY3lib3ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFqUXVlcnkuZmFuY3lib3gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKFwiLmZhbmN5Ym94LWJ1dHRvblwiKS5zaXplKCkgPiAwKSB7XG4gICAgICAgICAgICAkKFwiLmZhbmN5Ym94LWJ1dHRvblwiKS5mYW5jeWJveCh7XG4gICAgICAgICAgICAgICAgZ3JvdXBBdHRyOiAnZGF0YS1yZWwnLFxuICAgICAgICAgICAgICAgIHByZXZFZmZlY3Q6ICdub25lJyxcbiAgICAgICAgICAgICAgICBuZXh0RWZmZWN0OiAnbm9uZScsXG4gICAgICAgICAgICAgICAgY2xvc2VCdG46IHRydWUsXG4gICAgICAgICAgICAgICAgaGVscGVyczoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luc2lkZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEZpeCBpbnB1dCBwbGFjZWhvbGRlciBpc3N1ZSBmb3IgSUU4IGFuZCBJRTlcbiAgICB2YXIgaGFuZGxlRml4SW5wdXRQbGFjZWhvbGRlckZvcklFID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vZml4IGh0bWw1IHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBmb3IgaWU3ICYgaWU4XG4gICAgICAgIGlmIChpc0lFOCB8fCBpc0lFOSkgeyAvLyBpZTggJiBpZTlcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgaHRtbDUgcGxhY2Vob2xkZXIgZml4IGZvciBpbnB1dHMsIGlucHV0cyB3aXRoIHBsYWNlaG9sZGVyLW5vLWZpeCBjbGFzcyB3aWxsIGJlIHNraXBwZWQoZS5nOiB3ZSBuZWVkIHRoaXMgZm9yIHBhc3N3b3JkIGZpZWxkcylcbiAgICAgICAgICAgICQoJ2lucHV0W3BsYWNlaG9sZGVyXTpub3QoLnBsYWNlaG9sZGVyLW5vLWZpeCksIHRleHRhcmVhW3BsYWNlaG9sZGVyXTpub3QoLnBsYWNlaG9sZGVyLW5vLWZpeCknKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsKCkgPT09ICcnICYmIGlucHV0LmF0dHIoXCJwbGFjZWhvbGRlclwiKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYWRkQ2xhc3MoXCJwbGFjZWhvbGRlclwiKS52YWwoaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaW5wdXQuZm9jdXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PSBpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWwoJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsKCkgPT09ICcnIHx8IGlucHV0LnZhbCgpID09IGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbChpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIFNlbGVjdDIgRHJvcGRvd25zXG4gICAgdmFyIGhhbmRsZVNlbGVjdDIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoKS5zZWxlY3QyKSB7XG4gICAgICAgICAgICAkKCcuc2VsZWN0Mm1lJykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiU2VsZWN0XCIsXG4gICAgICAgICAgICAgICAgYWxsb3dDbGVhcjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gaGFuZGxlIGdyb3VwIGVsZW1lbnQgaGVpZ2h0c1xuICAgIHZhciBoYW5kbGVIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAkKCdbZGF0YS1hdXRvLWhlaWdodF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgaXRlbXMgPSAkKCdbZGF0YS1oZWlnaHRdJywgcGFyZW50KTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAwO1xuICAgICAgICAgICAgdmFyIG1vZGUgPSBwYXJlbnQuYXR0cignZGF0YS1tb2RlJyk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gcGFyc2VJbnQocGFyZW50LmF0dHIoJ2RhdGEtb2Zmc2V0JykgPyBwYXJlbnQuYXR0cignZGF0YS1vZmZzZXQnKSA6IDApO1xuXG4gICAgICAgICAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtaGVpZ2h0JykgPT0gXCJoZWlnaHRcIikge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdtaW4taGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHRfID0gKG1vZGUgPT0gJ2Jhc2UtaGVpZ2h0JyA/ICQodGhpcykub3V0ZXJIZWlnaHQoKSA6ICQodGhpcykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xuICAgICAgICAgICAgICAgIGlmIChoZWlnaHRfID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodF87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCArIG9mZnNldDtcblxuICAgICAgICAgICAgaXRlbXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLWhlaWdodCcpID09IFwiaGVpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ21pbi1oZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vKiBFTkQ6Q09SRSBIQU5ETEVSUyAqLy9cblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIHRoZSB0aGVtZVxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vSU1QT1JUQU5UISEhOiBEbyBub3QgbW9kaWZ5IHRoZSBjb3JlIGhhbmRsZXJzIGNhbGwgb3JkZXIuXG5cbiAgICAgICAgICAgIC8vQ29yZSBoYW5kbGVyc1xuICAgICAgICAgICAgaGFuZGxlSW5pdCgpOyAvLyBpbml0aWFsaXplIGNvcmUgdmFyaWFibGVzXG4gICAgICAgICAgICBoYW5kbGVPblJlc2l6ZSgpOyAvLyBzZXQgYW5kIGhhbmRsZSByZXNwb25zaXZlXG5cbiAgICAgICAgICAgIC8vVUkgQ29tcG9uZW50IGhhbmRsZXJzXG4gICAgICAgICAgICBoYW5kbGVNYXRlcmlhbERlc2lnbigpOyAvLyBoYW5kbGUgbWF0ZXJpYWwgZGVzaWduXG4gICAgICAgICAgICBoYW5kbGVVbmlmb3JtKCk7IC8vIGhhbmZsZSBjdXN0b20gcmFkaW8gJiBjaGVja2JveGVzXG4gICAgICAgICAgICBoYW5kbGVpQ2hlY2soKTsgLy8gaGFuZGxlcyBjdXN0b20gaWNoZWNrIHJhZGlvIGFuZCBjaGVja2JveGVzXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBTd2l0Y2goKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBzd2l0Y2ggcGx1Z2luXG4gICAgICAgICAgICBoYW5kbGVTY3JvbGxlcnMoKTsgLy8gaGFuZGxlcyBzbGltIHNjcm9sbGluZyBjb250ZW50c1xuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTsgLy8gaGFuZGxlIGZhbmN5IGJveFxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0MigpOyAvLyBoYW5kbGUgY3VzdG9tIFNlbGVjdDIgZHJvcGRvd25zXG4gICAgICAgICAgICBoYW5kbGVQb3J0bGV0VG9vbHMoKTsgLy8gaGFuZGxlcyBwb3J0bGV0IGFjdGlvbiBiYXIgZnVuY3Rpb25hbGl0eShyZWZyZXNoLCBjb25maWd1cmUsIHRvZ2dsZSwgcmVtb3ZlKVxuICAgICAgICAgICAgaGFuZGxlQWxlcnRzKCk7IC8vaGFuZGxlIGNsb3NhYmxlZCBhbGVydHNcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3ducygpOyAvLyBoYW5kbGUgZHJvcGRvd25zXG4gICAgICAgICAgICBoYW5kbGVUYWJzKCk7IC8vIGhhbmRsZSB0YWJzXG4gICAgICAgICAgICBoYW5kbGVUb29sdGlwcygpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHRvb2x0aXBzXG4gICAgICAgICAgICBoYW5kbGVQb3BvdmVycygpOyAvLyBoYW5kbGVzIGJvb3RzdHJhcCBwb3BvdmVyc1xuICAgICAgICAgICAgaGFuZGxlQWNjb3JkaW9ucygpOyAvL2hhbmRsZXMgYWNjb3JkaW9uc1xuICAgICAgICAgICAgaGFuZGxlTW9kYWxzKCk7IC8vIGhhbmRsZSBtb2RhbHNcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcENvbmZpcm1hdGlvbigpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIGNvbmZpcm1hdGlvbnNcbiAgICAgICAgICAgIGhhbmRsZVRleHRhcmVhQXV0b3NpemUoKTsgLy8gaGFuZGxlIGF1dG9zaXplIHRleHRhcmVhc1xuXG4gICAgICAgICAgICAvL0hhbmRsZSBncm91cCBlbGVtZW50IGhlaWdodHNcbiAgICAgICAgICAgIGhhbmRsZUhlaWdodCgpO1xuICAgICAgICAgICAgdGhpcy5hZGRSZXNpemVIYW5kbGVyKGhhbmRsZUhlaWdodCk7IC8vIGhhbmRsZSBhdXRvIGNhbGN1bGF0aW5nIGhlaWdodCBvbiB3aW5kb3cgcmVzaXplXG5cbiAgICAgICAgICAgIC8vIEhhY2tzXG4gICAgICAgICAgICBoYW5kbGVGaXhJbnB1dFBsYWNlaG9sZGVyRm9ySUUoKTsgLy9JRTggJiBJRTkgaW5wdXQgcGxhY2Vob2xkZXIgaXNzdWUgZml4XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIGNvcmUgamF2YXNjcmlwdCBhZnRlciBhamF4IGNvbXBsZXRlXG4gICAgICAgIGluaXRBamF4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTsgLy8gaGFuZGxlcyBjdXN0b20gcmFkaW8gJiBjaGVja2JveGVzXG4gICAgICAgICAgICBoYW5kbGVpQ2hlY2soKTsgLy8gaGFuZGxlcyBjdXN0b20gaWNoZWNrIHJhZGlvIGFuZCBjaGVja2JveGVzXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBTd2l0Y2goKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBzd2l0Y2ggcGx1Z2luXG4gICAgICAgICAgICBoYW5kbGVEcm9wZG93bkhvdmVyKCk7IC8vIGhhbmRsZXMgZHJvcGRvd24gaG92ZXJcbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbGVycygpOyAvLyBoYW5kbGVzIHNsaW0gc2Nyb2xsaW5nIGNvbnRlbnRzXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3QyKCk7IC8vIGhhbmRsZSBjdXN0b20gU2VsZWN0MiBkcm9wZG93bnNcbiAgICAgICAgICAgIGhhbmRsZUZhbmN5Ym94KCk7IC8vIGhhbmRsZSBmYW5jeSBib3hcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3ducygpOyAvLyBoYW5kbGUgZHJvcGRvd25zXG4gICAgICAgICAgICBoYW5kbGVUb29sdGlwcygpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHRvb2x0aXBzXG4gICAgICAgICAgICBoYW5kbGVQb3BvdmVycygpOyAvLyBoYW5kbGVzIGJvb3RzdHJhcCBwb3BvdmVyc1xuICAgICAgICAgICAgaGFuZGxlQWNjb3JkaW9ucygpOyAvL2hhbmRsZXMgYWNjb3JkaW9uc1xuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uKCk7IC8vIGhhbmRsZSBib290c3RyYXAgY29uZmlybWF0aW9uc1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vaW5pdCBtYWluIGNvbXBvbmVudHNcbiAgICAgICAgaW5pdENvbXBvbmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5pbml0QWpheCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIHJlbWVtYmVyIGxhc3Qgb3BlbmVkIHBvcG92ZXIgdGhhdCBuZWVkcyB0byBiZSBjbG9zZWQgb24gY2xpY2tcbiAgICAgICAgc2V0TGFzdFBvcGVkUG9wb3ZlcjogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGxhc3RQb3BlZFBvcG92ZXIgPSBlbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBhZGQgY2FsbGJhY2sgYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCBvbiB3aW5kb3cgcmVzaXplXG4gICAgICAgIGFkZFJlc2l6ZUhhbmRsZXI6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICAgIHJlc2l6ZUhhbmRsZXJzLnB1c2goZnVuYyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wdWJsaWMgZnVuY3RvbiB0byBjYWxsIF9ydW5yZXNpemVIYW5kbGVyc1xuICAgICAgICBydW5SZXNpemVIYW5kbGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gc2Nyb2xsKGZvY3VzKSB0byBhbiBlbGVtZW50XG4gICAgICAgIHNjcm9sbFRvOiBmdW5jdGlvbihlbCwgb2ZmZXNldCkge1xuICAgICAgICAgICAgdmFyIHBvcyA9IChlbCAmJiBlbC5zaXplKCkgPiAwKSA/IGVsLm9mZnNldCgpLnRvcCA6IDA7XG5cbiAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyJykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLXRvcC1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlci10b3AnKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItbWVudS1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlci1tZW51JykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBvcyA9IHBvcyArIChvZmZlc2V0ID8gb2ZmZXNldCA6IC0xICogZWwuaGVpZ2h0KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHBvc1xuICAgICAgICAgICAgfSwgJ3Nsb3cnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0U2xpbVNjcm9sbDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICQoZWwpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBleGl0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodDtcblxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhlaWdodFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAkKHRoaXMpLmNzcygnaGVpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zbGltU2Nyb2xsKHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dQYWdlU2Nyb2xsOiB0cnVlLCAvLyBhbGxvdyBwYWdlIHNjcm9sbCB3aGVuIHRoZSBlbGVtZW50IHNjcm9sbCBpcyBlbmRlZFxuICAgICAgICAgICAgICAgICAgICBzaXplOiAnN3B4JyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKSA/ICQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpIDogJyNiYmInKSxcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpIDogJ3NsaW1TY3JvbGxEaXYnKSxcbiAgICAgICAgICAgICAgICAgICAgcmFpbENvbG9yOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLWNvbG9yXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLWNvbG9yXCIpIDogJyNlYWVhZWEnKSxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGlzUlRMID8gJ2xlZnQnIDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGFsd2F5c1Zpc2libGU6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLWFsd2F5cy12aXNpYmxlXCIpID09IFwiMVwiID8gdHJ1ZSA6IGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgcmFpbFZpc2libGU6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKSA9PSBcIjFcIiA/IHRydWUgOiBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVGYWRlT3V0OiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIsIFwiMVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3lTbGltU2Nyb2xsOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgJChlbCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiKSA9PT0gXCIxXCIpIHsgLy8gZGVzdHJveSBleGlzdGluZyBpbnN0YW5jZSBiZWZvcmUgdXBkYXRpbmcgdGhlIGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ckxpc3QgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSB0aGUgY3VzdG9tIGF0dHJpYnVyZXMgc28gbGF0ZXIgd2Ugd2lsbCByZWFzc2lnbi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtaGFuZGxlLWNvbG9yXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXdyYXBwZXItY2xhc3NcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXJhaWwtY29sb3JcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1hbHdheXMtdmlzaWJsZVwiXSA9ICQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC12aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtcmFpbC12aXNpYmxlXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLXZpc2libGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaW1TY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpIDogJ3NsaW1TY3JvbGxEaXYnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVhc3NpZ24gY3VzdG9tIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGF0dHJMaXN0LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUuYXR0cihrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmdW5jdGlvbiB0byBzY3JvbGwgdG8gdGhlIHRvcFxuICAgICAgICBzY3JvbGxUb3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gIGJsb2NrIGVsZW1lbnQoaW5kaWNhdGUgbG9hZGluZylcbiAgICAgICAgYmxvY2tVSTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPicgKyAnPGRpdiBjbGFzcz1cImJsb2NrLXNwaW5uZXItYmFyXCI+PGRpdiBjbGFzcz1cImJvdW5jZTFcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlMlwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UzXCI+PC9kaXY+PC9kaXY+JyArICc8L2Rpdj4nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmljb25Pbmx5KSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiIGFsaWduPVwiXCI+PC9kaXY+JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy50ZXh0T25seSkge1xuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48c3Bhbj4mbmJzcDsmbmJzcDsnICsgKG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMT0FESU5HLi4uJykgKyAnPC9zcGFuPjwvZGl2Pic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48aW1nIHNyYz1cIicgKyB0aGlzLmdldEdsb2JhbEltZ1BhdGgoKSArICdsb2FkaW5nLXNwaW5uZXItZ3JleS5naWZcIiBhbGlnbj1cIlwiPjxzcGFuPiZuYnNwOyZuYnNwOycgKyAob3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xPQURJTkcuLi4nKSArICc8L3NwYW4+PC9kaXY+JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7IC8vIGVsZW1lbnQgYmxvY2tpbmdcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSAkKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZiAoZWwuaGVpZ2h0KCkgPD0gKCQod2luZG93KS5oZWlnaHQoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jZW5yZXJZID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWwuYmxvY2soe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBodG1sLFxuICAgICAgICAgICAgICAgICAgICBiYXNlWjogb3B0aW9ucy56SW5kZXggPyBvcHRpb25zLnpJbmRleCA6IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlclk6IG9wdGlvbnMuY2VucmVyWSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jZW5yZXJZIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNTUzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogb3B0aW9ucy5ib3hlZCA/IDAuMDUgOiAwLjEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICd3YWl0J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBwYWdlIGJsb2NraW5nXG4gICAgICAgICAgICAgICAgJC5ibG9ja1VJKHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaHRtbCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZVo6IG9wdGlvbnMuekluZGV4ID8gb3B0aW9ucy56SW5kZXggOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNTUzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogb3B0aW9ucy5ib3hlZCA/IDAuMDUgOiAwLjEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICd3YWl0J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvICB1bi1ibG9jayBlbGVtZW50KGZpbmlzaCBsb2FkaW5nKVxuICAgICAgICB1bmJsb2NrVUk6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICQodGFyZ2V0KS51bmJsb2NrKHtcbiAgICAgICAgICAgICAgICAgICAgb25VbmJsb2NrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGFyZ2V0KS5jc3MoJ3Bvc2l0aW9uJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YXJnZXQpLmNzcygnem9vbScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkLnVuYmxvY2tVSSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0UGFnZUxvYWRpbmc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLXNwaW5uZXItYmFyJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInBhZ2Utc3Bpbm5lci1iYXJcIj48ZGl2IGNsYXNzPVwiYm91bmNlMVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UyXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTNcIj48L2Rpdj48L2Rpdj4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtbG9hZGluZycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJwYWdlLWxvYWRpbmdcIj48aW1nIHNyYz1cIicgKyB0aGlzLmdldEdsb2JhbEltZ1BhdGgoKSArICdsb2FkaW5nLXNwaW5uZXItZ3JleS5naWZcIi8+Jm5ic3A7Jm5ic3A7PHNwYW4+JyArIChvcHRpb25zICYmIG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMb2FkaW5nLi4uJykgKyAnPC9zcGFuPjwvZGl2PicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0b3BQYWdlTG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcucGFnZS1sb2FkaW5nLCAucGFnZS1zcGlubmVyLWJhcicpLnJlbW92ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFsZXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiBcIlwiLCAvLyBhbGVydHMgcGFyZW50IGNvbnRhaW5lcihieSBkZWZhdWx0IHBsYWNlZCBhZnRlciB0aGUgcGFnZSBicmVhZGNydW1icylcbiAgICAgICAgICAgICAgICBwbGFjZTogXCJhcHBlbmRcIiwgLy8gXCJhcHBlbmRcIiBvciBcInByZXBlbmRcIiBpbiBjb250YWluZXJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsIC8vIGFsZXJ0J3MgdHlwZVxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiXCIsIC8vIGFsZXJ0J3MgbWVzc2FnZVxuICAgICAgICAgICAgICAgIGNsb3NlOiB0cnVlLCAvLyBtYWtlIGFsZXJ0IGNsb3NhYmxlXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHRydWUsIC8vIGNsb3NlIGFsbCBwcmV2aW91c2UgYWxlcnRzIGZpcnN0XG4gICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsIC8vIGF1dG8gc2Nyb2xsIHRvIHRoZSBhbGVydCBhZnRlciBzaG93blxuICAgICAgICAgICAgICAgIGNsb3NlSW5TZWNvbmRzOiAwLCAvLyBhdXRvIGNsb3NlIGFmdGVyIGRlZmluZWQgc2Vjb25kc1xuICAgICAgICAgICAgICAgIGljb246IFwiXCIgLy8gcHV0IGljb24gYmVmb3JlIHRoZSBtZXNzYWdlXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICAgICAgdmFyIGlkID0gTWV0cm9uaWMuZ2V0VW5pcXVlSUQoXCJNZXRyb25pY19hbGVydFwiKTtcblxuICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGRpdiBpZD1cIicgKyBpZCArICdcIiBjbGFzcz1cIk1ldHJvbmljLWFsZXJ0cyBhbGVydCBhbGVydC0nICsgb3B0aW9ucy50eXBlICsgJyBmYWRlIGluXCI+JyArIChvcHRpb25zLmNsb3NlID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvYnV0dG9uPicgOiAnJykgKyAob3B0aW9ucy5pY29uICE9PSBcIlwiID8gJzxpIGNsYXNzPVwiZmEtbGcgZmEgZmEtJyArIG9wdGlvbnMuaWNvbiArICdcIj48L2k+ICAnIDogJycpICsgb3B0aW9ucy5tZXNzYWdlICsgJzwvZGl2Pic7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlc2V0KSB7XG4gICAgICAgICAgICAgICAgJCgnLk1ldHJvbmljLWFsZXJ0cycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtY29udGFpbmVyLWJnLXNvbGlkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXRpdGxlJykuYWZ0ZXIoaHRtbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWJhcicpLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWJhcicpLmFmdGVyKGh0bWwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtYnJlYWRjcnVtYicpLmFmdGVyKGh0bWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5wbGFjZSA9PSBcImFwcGVuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQob3B0aW9ucy5jb250YWluZXIpLmFwcGVuZChodG1sKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKG9wdGlvbnMuY29udGFpbmVyKS5wcmVwZW5kKGh0bWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZm9jdXMpIHtcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygkKCcjJyArIGlkKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNsb3NlSW5TZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyMnICsgaWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuY2xvc2VJblNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGluaXRpYWxpemVzIHVuaWZvcm0gZWxlbWVudHNcbiAgICAgICAgaW5pdFVuaWZvcm06IGZ1bmN0aW9uKGVscykge1xuICAgICAgICAgICAgaWYgKGVscykge1xuICAgICAgICAgICAgICAgICQoZWxzKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudW5pZm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvL3dyTWV0cm9uaWNlciBmdW5jdGlvbiB0byB1cGRhdGUvc3luYyBqcXVlcnkgdW5pZm9ybSBjaGVja2JveCAmIHJhZGlvc1xuICAgICAgICB1cGRhdGVVbmlmb3JtOiBmdW5jdGlvbihlbHMpIHtcbiAgICAgICAgICAgICQudW5pZm9ybS51cGRhdGUoZWxzKTsgLy8gdXBkYXRlIHRoZSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zIFVJIGFmdGVyIHRoZSBhY3R1YWwgaW5wdXQgY29udHJvbCBzdGF0ZSBjaGFuZ2VkXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aGUgZmFuY3lib3ggcGx1Z2luXG4gICAgICAgIGluaXRGYW5jeWJveDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVGYW5jeWJveCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgYWN0dWFsIGlucHV0IHZhbHVlKHVzZWQgaW4gSUU5IGFuZCBJRTggZHVlIHRvIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBub3Qgc3VwcG9ydGVkKVxuICAgICAgICBnZXRBY3R1YWxWYWw6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBlbCA9ICQoZWwpO1xuICAgICAgICAgICAgaWYgKGVsLnZhbCgpID09PSBlbC5hdHRyKFwicGxhY2Vob2xkZXJcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbC52YWwoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBnZXQgYSBwYXJlbWV0ZXIgYnkgbmFtZSBmcm9tIFVSTFxuICAgICAgICBnZXRVUkxQYXJhbWV0ZXI6IGZ1bmN0aW9uKHBhcmFtTmFtZSkge1xuICAgICAgICAgICAgdmFyIHNlYXJjaFN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpLFxuICAgICAgICAgICAgICAgIGksIHZhbCwgcGFyYW1zID0gc2VhcmNoU3RyaW5nLnNwbGl0KFwiJlwiKTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhbCA9IHBhcmFtc1tpXS5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICAgICAgaWYgKHZhbFswXSA9PSBwYXJhbU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZXNjYXBlKHZhbFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIGRldmljZSB0b3VjaCBzdXBwb3J0XG4gICAgICAgIGlzVG91Y2hEZXZpY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVFdmVudChcIlRvdWNoRXZlbnRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGdldCB0aGUgY29ycmVjdCB2aWV3cG9ydCB3aWR0aCBiYXNlZCBvbiAgaHR0cDovL2FuZHlsYW5ndG9uLmNvLnVrL2FydGljbGVzL2phdmFzY3JpcHQvZ2V0LXZpZXdwb3J0LXNpemUtamF2YXNjcmlwdC9cbiAgICAgICAgZ2V0Vmlld1BvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGUgPSB3aW5kb3csXG4gICAgICAgICAgICAgICAgYSA9ICdpbm5lcic7XG4gICAgICAgICAgICBpZiAoISgnaW5uZXJXaWR0aCcgaW4gd2luZG93KSkge1xuICAgICAgICAgICAgICAgIGEgPSAnY2xpZW50JztcbiAgICAgICAgICAgICAgICBlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGVbYSArICdXaWR0aCddLFxuICAgICAgICAgICAgICAgIGhlaWdodDogZVthICsgJ0hlaWdodCddXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVuaXF1ZUlEOiBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiAncHJlZml4XycgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobmV3IERhdGUoKSkuZ2V0VGltZSgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjaGVjayBJRTggbW9kZVxuICAgICAgICBpc0lFODogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNJRTg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hlY2sgSUU5IG1vZGVcbiAgICAgICAgaXNJRTk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzSUU5O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vY2hlY2sgUlRMIG1vZGVcbiAgICAgICAgaXNSVEw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzUlRMO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGNoZWNrIElFOCBtb2RlXG4gICAgICAgIGlzQW5ndWxhckpzQXBwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIGFuZ3VsYXIgPT0gJ3VuZGVmaW5lZCcpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEFzc2V0c1BhdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0QXNzZXRzUGF0aDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgYXNzZXRzUGF0aCA9IHBhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0R2xvYmFsSW1nUGF0aDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgZ2xvYmFsSW1nUGF0aCA9IHBhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0R2xvYmFsSW1nUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbEltZ1BhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0R2xvYmFsUGx1Z2luc1BhdGg6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgICAgIGdsb2JhbFBsdWdpbnNQYXRoID0gcGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRHbG9iYWxQbHVnaW5zUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbFBsdWdpbnNQYXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdsb2JhbENzc1BhdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGggKyBnbG9iYWxDc3NQYXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGdldCBsYXlvdXQgY29sb3IgY29kZSBieSBjb2xvciBuYW1lXG4gICAgICAgIGdldEJyYW5kQ29sb3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChicmFuZENvbG9yc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBicmFuZENvbG9yc1tuYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJlc3BvbnNpdmVCcmVha3BvaW50OiBmdW5jdGlvbihzaXplKSB7XG4gICAgICAgICAgICAvLyBib290c3RyYXAgcmVzcG9uc2l2ZSBicmVha3BvaW50c1xuICAgICAgICAgICAgdmFyIHNpemVzID0ge1xuICAgICAgICAgICAgICAgICd4cycgOiA0ODAsICAgICAvLyBleHRyYSBzbWFsbFxuICAgICAgICAgICAgICAgICdzbScgOiA3NjgsICAgICAvLyBzbWFsbFxuICAgICAgICAgICAgICAgICdtZCcgOiA5OTIsICAgICAvLyBtZWRpdW1cbiAgICAgICAgICAgICAgICAnbGcnIDogMTIwMCAgICAgLy8gbGFyZ2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBzaXplc1tzaXplXSA/IHNpemVzW3NpemVdIDogMDtcbiAgICAgICAgfVxuICAgIH07XG5cbn0gKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0cm9uaWM7IiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5jb25zdCBNZXRyb25pYyA9IHJlcXVpcmUoJy4vbWV0cm9uaWMnKVxuXG4vKipcbkNvcmUgc2NyaXB0IHRvIGhhbmRsZSB0aGUgZW50aXJlIHRoZW1lIGFuZCBjb3JlIGZ1bmN0aW9uc1xuKiovXG52YXIgUXVpY2tTaWRlYmFyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gSGFuZGxlcyBxdWljayBzaWRlYmFyIHRvZ2dsZXJcbiAgICB2YXIgaGFuZGxlUXVpY2tTaWRlYmFyVG9nZ2xlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gcXVpY2sgc2lkZWJhciB0b2dnbGVyXG4gICAgICAgICQoJy5wYWdlLWhlYWRlciAucXVpY2stc2lkZWJhci10b2dnbGVyLCAucGFnZS1xdWljay1zaWRlYmFyLXRvZ2dsZXInKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdwYWdlLXF1aWNrLXNpZGViYXItb3BlbicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBxdWljayBzaWRlYmFyIGNoYXRzXG4gICAgdmFyIGhhbmRsZVF1aWNrU2lkZWJhckNoYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0gJCgnLnBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyJyk7XG4gICAgICAgIHZhciB3cmFwcGVyQ2hhdCA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0Jyk7XG5cbiAgICAgICAgdmFyIGluaXRDaGF0U2xpbVNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjaGF0VXNlcnMgPSB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VycycpO1xuICAgICAgICAgICAgdmFyIGNoYXRVc2Vyc0hlaWdodDtcblxuICAgICAgICAgICAgY2hhdFVzZXJzSGVpZ2h0ID0gd3JhcHBlci5oZWlnaHQoKSAtIHdyYXBwZXIuZmluZCgnLm5hdi1qdXN0aWZpZWQgPiAubmF2LXRhYnMnKS5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICAvLyBjaGF0IHVzZXIgbGlzdFxuICAgICAgICAgICAgTWV0cm9uaWMuZGVzdHJveVNsaW1TY3JvbGwoY2hhdFVzZXJzKTtcbiAgICAgICAgICAgIGNoYXRVc2Vycy5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgY2hhdFVzZXJzSGVpZ2h0KTtcbiAgICAgICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGNoYXRVc2Vycyk7XG5cbiAgICAgICAgICAgIHZhciBjaGF0TWVzc2FnZXMgPSB3cmFwcGVyQ2hhdC5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1tZXNzYWdlcycpO1xuICAgICAgICAgICAgdmFyIGNoYXRNZXNzYWdlc0hlaWdodCA9IGNoYXRVc2Vyc0hlaWdodCAtIHdyYXBwZXJDaGF0LmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyLWZvcm0nKS5vdXRlckhlaWdodCgpIC0gd3JhcHBlckNoYXQuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1uYXYnKS5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICAvLyB1c2VyIGNoYXQgbWVzc2FnZXNcbiAgICAgICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKGNoYXRNZXNzYWdlcyk7XG4gICAgICAgICAgICBjaGF0TWVzc2FnZXMuYXR0cihcImRhdGEtaGVpZ2h0XCIsIGNoYXRNZXNzYWdlc0hlaWdodCk7XG4gICAgICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbChjaGF0TWVzc2FnZXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGluaXRDaGF0U2xpbVNjcm9sbCgpO1xuICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGluaXRDaGF0U2xpbVNjcm9sbCk7IC8vIHJlaW5pdGlhbGl6ZSBvbiB3aW5kb3cgcmVzaXplXG5cbiAgICAgICAgd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnMgLm1lZGlhLWxpc3QgPiAubWVkaWEnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3cmFwcGVyQ2hhdC5hZGRDbGFzcyhcInBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXIgLnBhZ2UtcXVpY2stc2lkZWJhci1iYWNrLXRvLWxpc3QnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3cmFwcGVyQ2hhdC5yZW1vdmVDbGFzcyhcInBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIik7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgdGFza3NcbiAgICB2YXIgaGFuZGxlUXVpY2tTaWRlYmFyQWxlcnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9ICQoJy5wYWdlLXF1aWNrLXNpZGViYXItd3JhcHBlcicpO1xuICAgICAgICB2YXIgd3JhcHBlckFsZXJ0cyA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1hbGVydHMnKTtcblxuICAgICAgICB2YXIgaW5pdEFsZXJ0c1NsaW1TY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYWxlcnRMaXN0ID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cy1saXN0Jyk7XG4gICAgICAgICAgICB2YXIgYWxlcnRMaXN0SGVpZ2h0O1xuXG4gICAgICAgICAgICBhbGVydExpc3RIZWlnaHQgPSB3cmFwcGVyLmhlaWdodCgpIC0gd3JhcHBlci5maW5kKCcubmF2LWp1c3RpZmllZCA+IC5uYXYtdGFicycpLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIC8vIGFsZXJ0cyBsaXN0XG4gICAgICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChhbGVydExpc3QpO1xuICAgICAgICAgICAgYWxlcnRMaXN0LmF0dHIoXCJkYXRhLWhlaWdodFwiLCBhbGVydExpc3RIZWlnaHQpO1xuICAgICAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoYWxlcnRMaXN0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpbml0QWxlcnRzU2xpbVNjcm9sbCgpO1xuICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGluaXRBbGVydHNTbGltU2Nyb2xsKTsgLy8gcmVpbml0aWFsaXplIG9uIHdpbmRvdyByZXNpemVcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL2xheW91dCBoYW5kbGVyc1xuICAgICAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyVG9nZ2xlcigpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyB0b2dnbGVyXG4gICAgICAgICAgICBoYW5kbGVRdWlja1NpZGViYXJDaGF0KCk7IC8vIGhhbmRsZXMgcXVpY2sgc2lkZWJhcidzIGNoYXRzXG4gICAgICAgICAgICBoYW5kbGVRdWlja1NpZGViYXJBbGVydHMoKTsgLy8gaGFuZGxlcyBxdWljayBzaWRlYmFyJ3MgYWxlcnRzXG4gICAgICAgIH1cbiAgICB9O1xuXG59ICgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU2lkZWJhciIsImNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5jbGFzcyBDb21tb24ge1xuXG4gICAgc3RhdGljIHNwbGl0TGluZXModGV4dCkge1xuICAgICAgICByZXR1cm4gdGV4dC5zcGxpdCgvXFxuLyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEV2ZW50VGltZSh0LCBub3cpIHtcbiAgICAgICAgbGV0IHRpbWUgPSBtb21lbnQodCwgJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyk7XG4gICAgICAgIGxldCBub3d0aW1lID0gbW9tZW50KG5vdywgJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0OiAgICAgICAnICsgdCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3c6ICAgICAnICsgbm93KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RpbWU6ICAgICcgKyB0aW1lLmZvcm1hdCgpKTsgLy8gKyAnICcgKyB0aW1lLmlzVmFsaWQoKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3d0aW1lOiAnICsgbm93dGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgbm93dGltZS5pc1ZhbGlkKCkpO1xuICAgICAgICByZXR1cm4gdGltZS5mcm9tKG5vd3RpbWUpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjbGFzc0lmKGtsYXNzLCBiKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2NsYXNzSWY6ICcgKyBrbGFzcyArICcsICcgKyBiKTtcbiAgICAgICAgcmV0dXJuIChiID8ga2xhc3MgOiAnJyk7XG4gICAgfVxuXG4gICAgLy8gYXZvaWQgJyRhcHBseSBhbHJlYWR5IGluIHByb2dyZXNzJyBlcnJvciAoc291cmNlOiBodHRwczovL2NvZGVyd2FsbC5jb20vcC9uZ2lzbWEpXG4gICAgc3RhdGljIHNhZmVBcHBseShmbikge1xuICAgICAgICBpZiAoZm4gJiYgKHR5cGVvZiAoZm4pID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNvdXJjZTogaHR0cDovL2N0cmxxLm9yZy9jb2RlLzE5NjE2LWRldGVjdC10b3VjaC1zY3JlZW4tamF2YXNjcmlwdFxuICAgIHN0YXRpYyBpc1RvdWNoRGV2aWNlKCkge1xuICAgICAgICByZXR1cm4gKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IChuYXZpZ2F0b3IuTWF4VG91Y2hQb2ludHMgPiAwKSB8fCAobmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFRpY2tzRnJvbURhdGUoZGF0ZSkge1xuICAgICAgICBsZXQgcmV0ID0gbnVsbDtcbiAgICAgICAgaWYoZGF0ZSAmJiBkYXRlLmdldFRpbWUpIHtcbiAgICAgICAgICAgIHJldCA9IGRhdGUuZ2V0VGltZSgpLzEwMDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21tb247IiwiaWYgKCFTdHJpbmcucHJvdG90eXBlLmZvcm1hdCkge1xuICAgIFN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24gKG1hdGNoLCBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgID8gYXJnc1tudW1iZXJdXG4gICAgICAgICAgICAgIDogbWF0Y2hcbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0iLCJjb25zdCB1dWlkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBoZXhEaWdpdHMsIGksIHMsIHV1aWQ7XG4gICAgcyA9IFtdO1xuICAgIHMubGVuZ3RoID0gMzY7XG4gICAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgMzYpIHtcbiAgICAgICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpO1xuICAgICAgICBpICs9IDE7XG4gICAgfVxuICAgIHNbMTRdID0gJzQnO1xuICAgIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKTtcbiAgICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gJy0nO1xuICAgIHV1aWQgPSBzLmpvaW4oJycpO1xuICAgIHJldHVybiB1dWlkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dWlkOyJdfQ==
