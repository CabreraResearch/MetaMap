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
                        return node.data.parent ? [node.data.parent, false] : node.id;
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
*/
"use strict";

;(function () {

  jsPlumbToolkit.Layouts["metamap"] = function () {
    jsPlumbToolkit.Layouts.Spring.apply(this, arguments);

    var _oneSet = (function (parent, params) {
      params = params || {};
      var padding = params.partPadding || 20;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL01ldGFNYXAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQWN0aW9uLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQ29weU1hcC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9EZWxldGVNYXAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRmVlZGJhY2suanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvSG9tZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Mb2dvdXQuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTXlNYXBzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL05ld01hcC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9PcGVuTWFwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1NoYXJlTWFwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvQ29uZmlnLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvRXZlbnRlci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvSW50ZWdyYXRpb25zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvUGVybWlzc2lvbnMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC9Sb3V0ZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC9TaGFyaW5nLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvYXV0aDAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC91c2VyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jYW52YXMvY2FudmFzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jYW52YXMvbGF5b3V0LmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvYWN0aW9ucy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NhbnZhcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2RzcnAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9lZGl0U3RhdHVzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWxlbWVudHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ldmVudHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ub3RpZmljYXRpb24uanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9wYWdlcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3JvdXRlcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3RhYnMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy90YWdzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvQWRkVGhpcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL0ZhY2Vib29rLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvR29vZ2xlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvSW50ZXJjb20uanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9OZXdSZWxpYy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1R3aXR0ZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Vc2VyU25hcC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1plbmRlc2suanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9fSW50ZWdyYXRpb25zQmFzZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvcGFnZXMvUGFnZUZhY3RvcnkuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvY2FudmFzL21ldGEtY2FudmFzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9ub2RlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL2NvbXBvbmVudHMvcXVpY2stc2lkZWJhci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9jb21wb25lbnRzL3Jhdy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9kaWFsb2dzL3NoYXJlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1oZWxwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1ub3RpZmljYXRpb25zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1wb2ludHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLXVzZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1hY3Rpb25zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtYm9keS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRhaW5lci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRlbnQuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1mb290ZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1oZWFkZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1sb2dvLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2VhcmNoLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2lkZWJhci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXRvcG1lbnUuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvaG9tZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9teS1tYXBzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL3Rlcm1zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9kZW1vLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9sYXlvdXQuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RlbXBsYXRlL21ldHJvbmljLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9xdWljay1zaWRlYmFyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90b29scy9Db21tb24uanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3NoaW1zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90b29scy91dWlkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25CLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0MsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JCLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQixNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFckMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDekMsSUFBTSxNQUFN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QyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0QsU0FBQyxJQUFJLENBQUMsQ0FBQztLQUNWO0FBQ0QsS0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNaLEtBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEFBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsS0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNuQyxRQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNsQixXQUFPLElBQUksQ0FBQztDQUNmLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcbnJlcXVpcmUoJ2NvcmUtanMnKTtcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xucmVxdWlyZSgnanF1ZXJ5LXVpJyk7XG5yZXF1aXJlKCdib290c3RyYXAnKTtcbndpbmRvdy5yaW90ID0gcmVxdWlyZSgncmlvdCcpO1xud2luZG93Ll8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcblxuY29uc3QgQXV0aDAgPSByZXF1aXJlKCcuL2pzL2FwcC9hdXRoMCcpO1xuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vanMvYXBwL3VzZXIuanMnKTtcbmNvbnN0IFJvdXRlciA9IHJlcXVpcmUoJy4vanMvYXBwL1JvdXRlci5qcycpO1xuY29uc3QgRXZlbnRlciA9IHJlcXVpcmUoJy4vanMvYXBwL0V2ZW50ZXIuanMnKTtcbmNvbnN0IFBhZ2VGYWN0b3J5ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcycpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IENvbmZpZyA9IHJlcXVpcmUoJy4vanMvYXBwLy9Db25maWcuanMnKTtcbmNvbnN0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XG5jb25zdCBzaGltcyA9IHJlcXVpcmUoJy4vanMvdG9vbHMvc2hpbXMuanMnKTtcbmNvbnN0IEFpcmJyYWtlQ2xpZW50ID0gcmVxdWlyZSgnYWlyYnJha2UtanMnKVxuY29uc3QgSW50ZWdyYXRpb25zID0gcmVxdWlyZSgnLi9qcy9hcHAvSW50ZWdyYXRpb25zJylcblxuY2xhc3MgTWV0YU1hcCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5Db25maWcgPSBuZXcgQ29uZmlnKCk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5Db25maWcuY29uZmlnO1xuICAgICAgICB0aGlzLk1ldGFGaXJlID0gdGhpcy5Db25maWcuTWV0YUZpcmU7XG4gICAgICAgIHRoaXMuRXZlbnRlciA9IG5ldyBFdmVudGVyKHRoaXMpO1xuICAgICAgICB0aGlzLmFpcmJyYWtlID0gbmV3IEFpcmJyYWtlQ2xpZW50KHsgcHJvamVjdElkOiAxMTQ5MDAsIHByb2plY3RLZXk6ICdkYzk2MTFkYjZmNzcxMjBjY2VjZDFhMjczNzQ1YTVhZScgfSk7XG4gICAgICAgIHRoaXMub25SZWFkeSgpO1xuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgUHJvbWlzZS5vblBvc3NpYmx5VW5oYW5kbGVkUmVqZWN0aW9uKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgdGhhdC5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25SZWFkeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuQ29uZmlnLm9uUmVhZHkoKS50aGVuKChjb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5BdXRoMCA9IG5ldyBBdXRoMChjb25maWcuYXV0aDApO1xuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5BdXRoMC5sb2dpbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ2luKCkudGhlbigoYXV0aCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlVzZXIgPSBuZXcgVXNlcihwcm9maWxlLCBhdXRoLCB0aGlzLkV2ZW50ZXIsIHRoaXMuTWV0YUZpcmUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucyA9IG5ldyBJbnRlZ3JhdGlvbnModGhpcywgdGhpcy5Vc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Vc2VyLm9uUmVhZHkoKS50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbmV3IFBhZ2VGYWN0b3J5KHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvdXRlciA9IG5ldyBSb3V0ZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvdXRlci5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBkZWJ1ZygpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0LnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpXG4gICAgfVxuXG4gICAgbG9nKHZhbCkge1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLnNlbmRFdmVudCh2YWwsICdldmVudCcsICdsb2cnLCAnbGFiZWwnKVxuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmluZm8odmFsKTtcbiAgICB9XG5cbiAgICBlcnJvcih2YWwpIHtcbiAgICAgICAgd2luZG93LmNvbnNvbGUuZXJyb3IodmFsKTtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXhjZXB0aW9uJylcbiAgICAgICAgICAgIHRoaXMuYWlyYnJha2Uubm90aWZ5KHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XG4gICAgICAgIHRoaXMuQXV0aDAubG9nb3V0KCk7XG4gICAgfVxufVxuXG5jb25zdCBtbSA9IG5ldyBNZXRhTWFwKCk7XG5tb2R1bGUuZXhwb3J0cyA9IG1tOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY2xhc3MgQWN0aW9uIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuX2FjdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBfZ2V0QWN0aW9uKGFjdGlvbikge1xuICAgICAgICBsZXQgcmV0ID0gdGhpcy5fYWN0aW9uc1thY3Rpb25dO1xuICAgICAgICBpZiAoIXJldCkge1xuICAgICAgICAgICAgbGV0IE1ldGhvZCA9IG51bGw7XG4gICAgICAgICAgICBzd2l0Y2goYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vT3Blbk1hcC5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLk5FV19NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTmV3TWFwLmpzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuQ09QWV9NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vQ29weU1hcC5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkRFTEVURV9NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vRGVsZXRlTWFwLmpzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTVlfTUFQUzpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9NeU1hcHMuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5MT0dPVVQ6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTG9nb3V0LmpzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuU0hBUkVfTUFQOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL1NoYXJlTWFwJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuVEVSTVNfQU5EX0NPTkRJVElPTlM6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vVGVybXMuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5GRUVEQkFDSzpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9GZWVkYmFjaycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0hvbWUuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gbmV3IE1ldGhvZCh0aGlzLm1ldGFGaXJlLCB0aGlzLmV2ZW50ZXIsIHRoaXMucGFnZUZhY3RvcnkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGlvbnNbYWN0aW9uXSA9IHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGFjdChhY3Rpb24sIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoKTtcbiAgICAgICAgbGV0IG1ldGhvZCA9IHRoaXMuX2dldEFjdGlvbihhY3Rpb24pO1xuICAgICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmFjdCguLi5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uOyIsImNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY2xhc3MgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IobWV0YUZpcmUsIGV2ZW50ZXIsIHBhZ2VGYWN0b3J5KSB7XG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcbiAgICAgICAgdGhpcy5wYWdlRmFjdG9yeSA9IHBhZ2VGYWN0b3J5O1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XG4gICAgfVxuXG4gICAgYWN0KCkge1xuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgdG9nZ2xlU2lkZWJhcigpIHtcbiAgICAgICAgaWYodGhpcy5zaWRlYmFyT3Blbikge1xuICAgICAgICAgICAgdGhpcy5vcGVuU2lkZWJhcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvcGVuU2lkZWJhcigpIHtcbiAgICAgICAgdGhpcy5zaWRlYmFyT3BlbiA9IHRydWU7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTik7XG4gICAgfVxuICAgIFxuICAgIGNsb3NlU2lkZWJhcigpIHtcbiAgICAgICAgdGhpcy5zaWRlYmFyT3BlbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uQmFzZTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNsYXNzIENvcHlNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ011c3QgaGF2ZSBhIG1hcCBpbiBvcmRlciB0byBjb3B5LicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG9sZE1hcCkgPT4ge1xuICAgICAgICAgICAgbGV0IG5ld01hcCA9IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBgJHtuZXcgRGF0ZSgpfWAsXG4gICAgICAgICAgICAgICAgb3duZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubWV0YU1hcC5Vc2VyLmRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlOiB0aGlzLm1ldGFNYXAuVXNlci5waWN0dXJlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmFwcGVuZENvcHkob2xkTWFwLm5hbWUpLFxuICAgICAgICAgICAgICAgIHNoYXJlZF93aXRoOiB7XG4gICAgICAgICAgICAgICAgICAgIGFkbWluOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgJyonOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7aWR9YCkudGhlbigob2xkTWFwRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwdXNoU3RhdGUgPSB0aGlzLm1ldGFGaXJlLnB1c2hEYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9YCk7XG4gICAgICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuc2V0RGF0YShvbGRNYXBEYXRhLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke21hcElkfWApO1xuICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke21hcElkfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhcHBlbmRDb3B5KHN0cikge1xuICAgICAgICBsZXQgcmV0ID0gc3RyO1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc3RyLCAnKENvcHknKSkge1xuICAgICAgICAgICAgcmV0ID0gcmV0ICsgJyAoQ29weSAxKSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbWVzcyA9IHN0ci5zcGxpdCgnICcpO1xuICAgICAgICAgICAgbGV0IGNudCA9IDI7XG4gICAgICAgICAgICBpZiAobWVzcy5sZW5ndGggLSBtZXNzLmxhc3RJbmRleE9mKCcoQ29weScpIDw9IDQpIHtcbiAgICAgICAgICAgICAgICBsZXQgZ3JiZyA9IG1lc3NbbWVzcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAoZ3JiZykge1xuICAgICAgICAgICAgICAgICAgICBncmJnID0gZ3JiZy5yZXBsYWNlKCcpJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBjbnQgPSArZ3JiZyArIDE7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IG1lc3Muc2xpY2UoMCwgbWVzcy5sZW5ndGggLSAyKS5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ICs9IGAgKENvcHkgJHtjbnR9KWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29weU1hcDsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNsYXNzIERlbGV0ZU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgRGVsZXRlTWFwLmRlbGV0ZUFsbChbaWRdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlbGV0ZUFsbChpZHMsIHBhdGggPSBDT05TVEFOVFMuUEFHRVMuSE9NRSkge1xuICAgICAgICBjb25zdCBtZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXy5lYWNoKGlkcywgKGlkKSA9PiB7XG4gICAgICAgICAgICAgICAgbWV0YU1hcC5NZXRhRmlyZS5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7aWR9YCk7XG4gICAgICAgICAgICAgICAgbWV0YU1hcC5NZXRhRmlyZS5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIG1ldGFNYXAuUm91dGVyLnRvKHBhdGgpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVsZXRlTWFwOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcblxuY2xhc3MgRmVlZGJhY2sgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHdpbmRvdy5Vc2VyU25hcDtcbiAgICB9XG5cbiAgICBhY3QoKSB7XG4gICAgICAgIHN1cGVyLmFjdCgpO1xuICAgICAgICB0aGlzLnVzZXJTbmFwLm9wZW5SZXBvcnRXaW5kb3coKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRiYWNrOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL2hvbWUnKTtcblxuY2xhc3MgSG9tZSBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLkhPTUUpO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ0hvbWUnIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIb21lOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuY2xhc3MgTG9nb3V0IGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMubWV0YU1hcC5sb2dvdXQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ291dDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCBob21lID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy9teS1tYXBzJyk7XG5cbmNsYXNzIE15TWFwcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLk1ZX01BUFMpO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMsIHsgaWQ6IGlkIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnTXkgTWFwcycgfSwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNeU1hcHM7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBOZXdNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoKSB7XG4gICAgICAgIHN1cGVyLmFjdCgpO1xuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX05FV19NQVB9YCkudGhlbigoYmxhbmtNYXApID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogYCR7bmV3IERhdGUoKX1gLFxuICAgICAgICAgICAgICAgIG93bmVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ05ldyBVbnRpdGxlZCBNYXAnLFxuICAgICAgICAgICAgICAgIHNoYXJlZF93aXRoOiB7XG4gICAgICAgICAgICAgICAgICAgIGFkbWluOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgJyonOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcbiAgICAgICAgICAgIGxldCBtYXBJZCA9IHB1c2hTdGF0ZS5rZXkoKTtcbiAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuc2V0RGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7bWFwSWR9YCk7XG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXdNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IG1ldGFDYW52YXMgPSByZXF1aXJlKCcuLi90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcycpO1xuXG5jbGFzcyBPcGVuTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChtYXApID0+IHtcbiAgICAgICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuTUVUQV9DQU5WQVMpO1xuICAgICAgICAgICAgICAgIG1hcC5pZCA9IGlkO1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLk5BViwgJ21hcCcsIG1hcCwgLi4ucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIG1hcCwgLi4ucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5NQVAsIG1hcCwgLi4ucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT3Blbk1hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5yZXF1aXJlKCcuLi90YWdzL2RpYWxvZ3Mvc2hhcmUnKVxuXG5jbGFzcyBTaGFyZU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigobWFwKSA9PiB7XG4gICAgICAgICAgICBtYXAuaWQgPSBpZFxuICAgICAgICAgICAgU2hhcmVNYXAuYWN0KHsgbWFwOiBtYXAgfSlcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5Sb3V0ZXIuYmFjaygpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYWN0KG1hcCkge1xuICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICBsZXQgbW9kYWwgPSByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX01PREFMX0RJQUxPR19DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5TSEFSRSlbMF1cbiAgICAgICAgICAgIG1vZGFsLnVwZGF0ZShtYXApXG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcmVNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgdGVybXMgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL3Rlcm1zJyk7XG5cbmNsYXNzIFRlcm1zIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuVEVSTVMpO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ1Rlcm1zIGFuZCBDb25kaXRpb25zJyB9LCAuLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGVybXM7IiwiY29uc3QgTWV0YUZpcmUgPSByZXF1aXJlKCcuL0ZpcmViYXNlJyk7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcblxuY29uc3QgY29uZmlnID0gKCkgPT4ge1xuICAgIGNvbnN0IFNJVEVTID0ge1xuICAgICAgICBDUkxfU1RBR0lORzoge1xuICAgICAgICAgICAgZGI6ICdtZXRhLW1hcC1zdGFnaW5nJ1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmV0ID0ge1xuICAgICAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdCxcbiAgICAgICAgc2l0ZToge31cbiAgICB9XG4gICAgbGV0IHNlZ21lbnRzID0gcmV0Lmhvc3Quc3BsaXQoJy4nKTtcbiAgICBsZXQgZmlyc3QgPSBzZWdtZW50c1swXTtcbiAgICBpZiAoZmlyc3QgPT09ICd3d3cnKSB7XG4gICAgICAgIGZpcnN0ID0gc2VnbWVudHNbMV07XG4gICAgfVxuICAgIGZpcnN0ID0gZmlyc3Quc3BsaXQoJzonKVswXTtcblxuICAgIHN3aXRjaCAoZmlyc3QudG9Mb3dlckNhc2UoKSkge1xuXG4gICAgICAgIGNhc2UgJ2xvY2FsaG9zdCc6XG4gICAgICAgIGNhc2UgJ21ldGEtbWFwLXN0YWdpbmcnOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0LnNpdGUgPSBTSVRFUy5DUkxfU1RBR0lORztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59O1xuXG5jbGFzcyBDb25maWcge1xuXG4gICAgY29uc3RydWN0b3IodGFncykge1xuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICB0aGlzLk1ldGFGaXJlID0gbmV3IE1ldGFGaXJlKHRoaXMuY29uZmlnKTtcbiAgICB9XG5cbiAgICBnZXQgc2l0ZSgpIHtcbiAgICAgICAgcmV0dXJuICdmcm9udGVuZCc7XG4gICAgfVxuXG4gICAgb25SZWFkeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ2NvbmZpZycsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ21ldGFtYXAvY2FudmFzJywgKGNhbnZhcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZCh0aGlzLmNvbmZpZy5zaXRlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLmNvbmZpZy5zaXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblJlYWR5KCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZzsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcblxuY2xhc3MgRXZlbnRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihtZXRhTWFwKSB7XG4gICAgICAgIFxuICAgICAgICByaW90Lm9ic2VydmFibGUodGhpcyk7XG5cbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fVxuICAgIH1cblxuICAgIGV2ZXJ5KGV2ZW50LCByZWFjdGlvbikge1xuICAgICAgICAvL2xldCBjYWxsYmFjayA9IHJlYWN0aW9uO1xuICAgICAgICAvL2lmICh0aGlzLmV2ZW50c1tldmVudF0pIHtcbiAgICAgICAgLy8gICAgbGV0IHBpZ2d5YmFjayA9IHRoaXMuZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgLy8gICAgY2FsbGJhY2sgPSAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICAgIC8vICAgICAgICBwaWdneWJhY2soLi4ucGFyYW1zKTtcbiAgICAgICAgLy8gICAgICAgIHJlYWN0aW9uKC4uLnBhcmFtcyk7XG4gICAgICAgIC8vICAgIH1cbiAgICAgICAgLy99XG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSByZWFjdGlvbjtcbiAgICAgICAgICAgIHRoaXMub24oZXZlbnQsIHJlYWN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZm9yZ2V0KGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcbiAgICAgICAgXy5lYWNoKGV2ZW50cywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tldmVudF07XG4gICAgICAgICAgICAgICAgdGhpcy5vZmYoZXZlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldmVudCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZG8oZXZlbnQsIC4uLnBhcmFtcykge1xuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcbiAgICAgICAgXy5lYWNoKGV2ZW50cywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKGV2ZW50LCAuLi5wYXJhbXMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudGVyOyIsImxldCBGaXJlYmFzZSA9IHdpbmRvdy5GaXJlYmFzZTtcbmxldCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxubGV0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxuXG5jbGFzcyBNZXRhRmlyZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoYGh0dHBzOi8vJHt0aGlzLmNvbmZpZy5zaXRlLmRifS5maXJlYmFzZWlvLmNvbWApO1xuICAgIH1cblxuICAgIGdldCBtZXRhTWFwKCkge1xuICAgICAgICBpZiAoIXRoaXMuX21ldGFNYXApIHtcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX21ldGFNYXA7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5NZXRhTWFwLkF1dGgwLmdldFNlc3Npb24oKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigocHJvZmlsZSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuTWV0YU1hcC5BdXRoMC5sb2NrLmdldENsaWVudCgpLmdldERlbGVnYXRpb25Ub2tlbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmNvbmZpZy5zaXRlLmF1dGgwLmFwaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogcHJvZmlsZS5pZF90b2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGlfdHlwZTogJ2ZpcmViYXNlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZS5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZWJhc2VfdG9rZW4gPSBkZWxlZ2F0aW9uUmVzdWx0LmlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoaXMuZmlyZWJhc2VfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZiLmF1dGhXaXRoQ3VzdG9tVG9rZW4odGhpcy5maXJlYmFzZV90b2tlbiwgKGVycm9yLCBhdXRoRGF0YSwgLi4ucGFyYW1zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSB0aGlzLl9sb2dpbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gICAgfVxuXG4gICAgb25SZWFkeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xuICAgIH1cblxuICAgIGdldENoaWxkKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmIuY2hpbGQocGF0aCk7XG4gICAgfVxuXG4gICAgZ2V0RGF0YShwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjaGlsZC5vbmNlKCd2YWx1ZScsXG4gICAgICAgICAgICAgICAgICAgIChzbmFwc2hvdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uKHBhdGgsIGNhbGxiYWNrLCBldmVudCA9ICd2YWx1ZScpIHtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGhvZCA9IChzbmFwc2hvdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbmFwc2hvdC5leGlzdHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIGRhdGEgYXQgJHtwYXRofWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYoZXZlbnQsIG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjaGlsZC5vbihldmVudCwgbWV0aG9kKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb2ZmKHBhdGgsIG1ldGhvZCA9ICd2YWx1ZScsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXREYXRhKGRhdGEsIHBhdGgpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnNldChkYXRhLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGVEYXRhKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0RGF0YShudWxsLCBwYXRoKTtcbiAgICB9XG5cbiAgICBwdXNoRGF0YShkYXRhLCBwYXRoKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wdXNoKGRhdGEsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldERhdGFJblRyYW5zYWN0aW9uKGRhdGEsIHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC50cmFuc2FjdGlvbigoY3VycmVudFZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJyb3IoZSwgcGF0aCkge1xuICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoeyBtZXNzYWdlOiBgUGVybWlzc2lvbiBkZW5pZWQgdG8gJHtwYXRofWAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb25SZWFkeSA9IG51bGw7XG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ2ZpcmViYXNlX3Rva2VuJyk7XG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcblxuY29uc3QgVHdpaXRlciA9IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9Ud2l0dGVyJyk7XG5jb25zdCBGYWNlYm9vayA9IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9GYWNlYm9vaycpO1xuXG5jbGFzcyBJbnRlZ3JhdGlvbnMge1xuXG5cdGNvbnN0cnVjdG9yKG1ldGFNYXAsIHVzZXIpIHtcblx0XHR0aGlzLmNvbmZpZyA9IG1ldGFNYXAuY29uZmlnO1xuXHRcdHRoaXMubWV0YU1hcCA9IG1ldGFNYXA7XG5cdFx0dGhpcy51c2VyID0gdXNlcjtcblx0XHR0aGlzLl9mZWF0dXJlcyA9IHtcblx0XHRcdGdvb2dsZTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0dvb2dsZScpLFxuXHRcdFx0dXNlcnNuYXA6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9Vc2VyU25hcCcpLFxuXHRcdFx0aW50ZXJjb206IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9JbnRlcmNvbScpLFxuXHRcdFx0emVuZGVzazogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1plbmRlc2snKSxcblx0XHRcdGFkZHRoaXM6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9BZGRUaGlzJyksXG5cdFx0XHRuZXdyZWxpYzogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL05ld1JlbGljJylcblx0XHR9O1xuXHR9XG5cblx0aW5pdCgpIHtcbiAgICAgICAgXy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKEZlYXR1cmUpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRsZXQgY29uZmlnID0gdGhpcy5jb25maWcuc2l0ZVtuYW1lXTtcblx0XHRcdFx0XHR0aGlzW25hbWVdID0gbmV3IEZlYXR1cmUoY29uZmlnLCB0aGlzLnVzZXIpO1xuXHRcdFx0XHRcdHRoaXNbbmFtZV0uaW5pdCgpO1xuXHRcdFx0XHRcdHRoaXNbbmFtZV0uc2V0VXNlcigpO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0dGhpcy5tZXRhTWFwLmVycm9yKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXHRzZXRVc2VyKCkge1xuXHRcdF8uZWFjaCh0aGlzLl9mZWF0dXJlcywgKEZlYXR1cmUsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tuYW1lXS5zZXRVc2VyKCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgIH1cblx0XHRcdH1cbiAgICAgICAgfSk7XG5cdH1cblxuXHRzZW5kRXZlbnQodmFsLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1ldGFNYXAuZGVidWcpIHtcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9mZWF0dXJlcywgKEZlYXR1cmUsIG5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1tuYW1lXS5zZW5kRXZlbnQodmFsLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cdH1cblxuXHR1cGRhdGVQYXRoKCkge1xuXG5cdH1cblxuXHRsb2dvdXQoKSB7XG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5hbWUpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR0aGlzW25hbWVdLmxvZ291dCgpO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cbiAgICAgICAgfSk7XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVncmF0aW9uczsiLCJjbGFzcyBQZXJtaXNzaW9ucyB7XG5cbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXG4gICAgfVxuXG4gICAgY2FuRWRpdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXBPd25lcigpIHx8IHRoaXMuaXNTaGFyZWRFZGl0KClcbiAgICB9XG5cbiAgICBjYW5WaWV3KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc01hcE93bmVyKCkgfHwgdGhpcy5pc1NoYXJlZFZpZXcoKVxuICAgIH1cblxuICAgIGlzTWFwT3duZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJiB0aGlzLm1hcC5vd25lci51c2VySWQgPT0gdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXG4gICAgfVxuXG4gICAgaXNTaGFyZWRFZGl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAgJiZcbiAgICAgICAgICAgIHRoaXMubWFwLnNoYXJlZF93aXRoICYmXG4gICAgICAgICAgICAgICAgKHRoaXMubWV0YU1hcC5Vc2VyLmlzQWRtaW4gfHxcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10gJiYgdGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSlcbiAgICB9XG5cbiAgICBpc1NoYXJlZFZpZXcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxuICAgICAgICAgICAgdGhpcy5pc1NoYXJlZEVkaXQoKSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdICYmIHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0ucmVhZCA9PSB0cnVlKSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQZXJtaXNzaW9uczsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vdHlwaW5ncy9yaW90anMvcmlvdGpzLmQudHNcIiAvPlxuY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBSb3V0ZXIge1xuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbnMgPSBtZXRhTWFwLkludGVncmF0aW9ucztcbiAgICAgICAgdGhpcy51c2VyID0gbWV0YU1hcC5Vc2VyO1xuICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbWV0YU1hcC5QYWdlRmFjdG9yeTtcbiAgICAgICAgdGhpcy5ldmVudGVyID0gbWV0YU1hcC5FdmVudGVyO1xuICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xuICAgICAgICByaW90LnJvdXRlKCh0YXJnZXQsIGlkID0gJycsIGFjdGlvbiA9ICcnLCAuLi5wYXJhbXMpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IHRoaXMuZ2V0UGF0aCh0YXJnZXQpO1xuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1haW4odHJ1ZSwgdGhpcy5wYXRoKTtcbiAgICAgICAgICAgIHRoaXMuUGFnZUZhY3RvcnkubmF2aWdhdGUodGhpcy5wYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpO1xuXG4gICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oJ2hpc3RvcnknLCB3aW5kb3cubG9jYXRpb24uaGFzaCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRvKHRoaXMuY3VycmVudFBhZ2UpO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50UGFnZSgpIHtcbiAgICAgICAgbGV0IHBhZ2UgPSB3aW5kb3cubG9jYXRpb24uaGFzaCB8fCAnaG9tZSc7XG4gICAgICAgIGlmICghdGhpcy5pc1RyYWNrZWQocGFnZSkpIHtcbiAgICAgICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKHBhZ2VDbnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHRoaXMuZ2V0UGF0aCh0aGlzLnVzZXIuaGlzdG9yeVtwYWdlQ250IC0gMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWdlO1xuICAgIH1cblxuICAgIGdldCBjdXJyZW50UGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcbiAgICB9XG5cbiAgICBnZXRQcmV2aW91c1BhZ2UocGFnZU5vID0gMikge1xuICAgICAgICBsZXQgcGFnZSA9ICdob21lJztcbiAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgIGlmIChwYWdlQ250ID4gMCkge1xuICAgICAgICAgICAgcGFnZSA9IHRoaXMuZ2V0UGF0aCh0aGlzLnVzZXIuaGlzdG9yeVtwYWdlQ250IC0gcGFnZU5vXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2U7XG4gICAgfVxuXG4gICAgZ2V0IHByZXZpb3VzUGFnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UHJldmlvdXNQYWdlKDIpO1xuICAgIH1cblxuICAgIHRyYWNrKHBhdGgpIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbnMudXBkYXRlUGF0aChwYXRoKTtcbiAgICB9XG5cbiAgICB0b2dnbGVNYWluKGhpZGUsIHBhdGgpIHtcbiAgICAgICAgdGhpcy50cmFjayhwYXRoKTtcbiAgICAgICAgaWYgKGhpZGUpIHtcbiAgICAgICAgICAgIHRoaXMuaXNIaWRkZW4gPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UGF0aChwYXRoKSB7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICB3aGlsZSAocGF0aC5zdGFydHNXaXRoKCchJykgfHwgcGF0aC5zdGFydHNXaXRoKCcjJykpIHtcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuXG4gICAgdG8ocGF0aCkge1xuICAgICAgICBwYXRoID0gdGhpcy5nZXRQYXRoKHBhdGgpO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVNYWluKHRydWUsIHBhdGgpO1xuICAgICAgICAgICAgcmlvdC5yb3V0ZShgJHtwYXRofWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmFjaygpIHtcbiAgICAgICAgbGV0IHBhdGggPSAnaG9tZSc7XG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xuICAgICAgICBpZiAocGFnZUNudCA+IDEgJiYgKHRoaXMuY3VycmVudFBhZ2UgIT0gJ215bWFwcycgfHwgdGhpcy5jdXJyZW50UGFnZSAhPSB0aGlzLnByZXZpb3VzUGFnZSkpIHtcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLnByZXZpb3VzUGFnZTtcbiAgICAgICAgICAgIGxldCBiYWNrTm8gPSAyO1xuICAgICAgICAgICAgd2hpbGUgKCF0aGlzLmlzVHJhY2tlZChwYXRoKSAmJiB0aGlzLnVzZXIuaGlzdG9yeVtiYWNrTm9dKSB7XG4gICAgICAgICAgICAgICAgYmFja05vICs9IDE7XG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UHJldmlvdXNQYWdlKGJhY2tObyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudG8ocGF0aCk7XG4gICAgfVxuXG4gICAgZ2V0IGRvTm90VHJhY2soKSB7XG4gICAgICAgIGlmICghdGhpcy5fZG9Ob3RUcmFjaykge1xuICAgICAgICAgICAgdGhpcy5fZG9Ob3RUcmFjayA9IFtDT05TVEFOVFMuQUNUSU9OUy5ERUxFVEVfTUFQLCBDT05TVEFOVFMuQUNUSU9OUy5DT1BZX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuTE9HT1VULCBDT05TVEFOVFMuQUNUSU9OUy5ORVdfTUFQLCBDT05TVEFOVFMuQUNUSU9OUy5GRUVEQkFDSywgQ09OU1RBTlRTLkFDVElPTlMuU0hBUkVfTUFQXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZG9Ob3RUcmFjaztcbiAgICB9XG5cbiAgICBpc1RyYWNrZWQocGF0aCkge1xuICAgICAgICBsZXQgcHRoID0gdGhpcy5nZXRQYXRoKHBhdGgpO1xuICAgICAgICByZXR1cm4gXy5hbnkodGhpcy5kb05vdFRyYWNrLCAocCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICFwdGguc3RhcnRzV2l0aChwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJjb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5cbmNvbnN0IHRvQm9vbCA9ICh2YWwpID0+IHtcbiAgICBsZXQgcmV0ID0gZmFsc2U7XG4gICAgaWYgKHZhbCA9PT0gdHJ1ZSB8fCB2YWwgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldCA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoXy5jb250YWlucyhbJ3RydWUnLCAneWVzJywgJzEnXSwgdmFsICsgJycudG9Mb3dlckNhc2UoKS50cmltKCkpKSB7XG4gICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbmNsYXNzIFNoYXJpbmcge1xuXG4gICAgY29uc3RydWN0b3IodXNlcikge1xuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyXG4gICAgICAgIHRoaXMuX21ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJylcbiAgICAgICAgdGhpcy5fZmIgPSB0aGlzLl9tZXRhTWFwLk1ldGFGaXJlO1xuICAgIH1cblxuICAgIGFkZFNoYXJlKG1hcCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XG4gICAgICAgIGlmIChtYXAgJiYgbWFwLmlkICYmIHVzZXJEYXRhICYmIHVzZXJEYXRhLmlkKSB7XG4gICAgICAgICAgICB0aGlzLl9mYi5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICByZWFkOiB0b0Jvb2wob3B0cy5yZWFkKSxcbiAgICAgICAgICAgICAgICB3cml0ZTogdG9Cb29sKG9wdHMud3JpdGUpLFxuICAgICAgICAgICAgICAgIG5hbWU6IG9wdHMubmFtZSxcbiAgICAgICAgICAgICAgICBwaWN0dXJlOiBvcHRzLnBpY3R1cmVcbiAgICAgICAgICAgIH0sIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcC5pZH0vc2hhcmVkX3dpdGgvJHt1c2VyRGF0YS5pZH1gKVxuICAgICAgICAgICAgdGhpcy5fZmIucHVzaERhdGEoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHNoYXJlZCBhIG1hcCwgJHttYXAubmFtZX0sIHdpdGggeW91IWAsXG4gICAgICAgICAgICAgICAgbWFwSWQ6IG1hcC5pZCxcbiAgICAgICAgICAgICAgICB0eXBlOiBDT05TVEFOVFMuTk9USUZJQ0FUSU9OLk1BUCxcbiAgICAgICAgICAgICAgICB0aW1lOiBgJHtuZXcgRGF0ZSgpfWBcbiAgICAgICAgICAgIH0sIGAke0NPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQodXNlckRhdGEuaWQpfWApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVTaGFyZShtYXAsIHVzZXJEYXRhKSB7XG4gICAgICAgIGlmIChtYXAgJiYgbWFwLmlkICYmIHVzZXJEYXRhICYmIHVzZXJEYXRhLmlkKSB7XG4gICAgICAgICAgICB0aGlzLl9mYi5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcC5pZH0vc2hhcmVkX3dpdGgvJHt1c2VyRGF0YS5pZH1gKVxuICAgICAgICAgICAgdGhpcy5fZmIucHVzaERhdGEoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHJlbW92ZWQgYSBtYXAsICR7bWFwLm5hbWV9LCB0aGF0IHdhcyBwcmV2aW91c2x5IHNoYXJlZC5gLFxuICAgICAgICAgICAgICAgIHRpbWU6IGAke25ldyBEYXRlKCl9YFxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdCh1c2VyRGF0YS5pZCl9YClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVkaXRTaGFyZShtYXBJZCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XG5cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyaW5nIiwiY29uc3QgQXV0aDBMb2NrID0gcmVxdWlyZSgnYXV0aDAtbG9jaycpXG5jb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcblxuY2xhc3MgQXV0aDAge1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCBtZXRhTWFwKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKGNvbmZpZy5hcGksIGNvbmZpZy5hcHApO1xuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvd0xvZ2luID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbkFmdGVyU2lnbnVwOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbChlcnIsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gcHJvZmlsZS5jdG9rZW4gPSBjdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnY3Rva2VuJywgdGhpcy5jdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIHRoaXMuaWRfdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgdGhpcy5wcm9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaF90b2tlbiA9IHByb2ZpbGUucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dMb2dpbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICAgIH1cblxuICAgIGxpbmtBY2NvdW50KCkge1xuICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICBjYWxsYmFja1VSTDogbG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSxcbiAgICAgICAgICAgIGRpY3Q6IHtcbiAgICAgICAgICAgICAgICBzaWduaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLmN0b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkZhaWwoZXJyLCByZWplY3QpIHtcbiAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycik7XG4gICAgICAgIGlmIChyZWplY3QpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuX2dldFNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIChlcnIsIHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdjdG9rZW4nKS50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBwcm9maWxlLmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ05vIHNlc3Npb24nKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRTZXNzaW9uO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnaWRfdG9rZW4nKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBudWxsO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuXG5cbiIsImNvbnN0IHV1aWQgPSByZXF1aXJlKCcuLi90b29scy91dWlkLmpzJyk7XG5jb25zdCBDb21tb24gPSByZXF1aXJlKCcuLi90b29scy9Db21tb24nKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG5jbGFzcyBVc2VyIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9maWxlLCBhdXRoLCBldmVudGVyLCBtZXRhRmlyZSkge1xuICAgICAgICB0aGlzLmF1dGggPSBhdXRoO1xuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XG4gICAgICAgIHRoaXMudXNlcktleSA9IHV1aWQoKTtcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcbiAgICAgICAgICAgIGxldCB0cmFja0hpc3RvcnkgPSBfLm9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5ldmVyeSgnaGlzdG9yeScsIChwYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpc3RvcnkubGVuZ3RoID09IDAgfHwgcGFnZSAhPSB0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpc3RvcnkucHVzaChwYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuc2V0RGF0YSh0aGlzLmhpc3RvcnksIGB1c2Vycy8ke3RoaXMuYXV0aC51aWR9L2hpc3RvcnlgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWV0YUZpcmUub24oYHVzZXJzLyR7dGhpcy5hdXRoLnVpZH1gLCAodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXIuaGlzdG9yeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyLmhpc3RvcnkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gdXNlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFja0hpc3RvcnkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHVzZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgZ2V0IF9pZGVudGl0eSgpIHtcbiAgICAgICAgbGV0IHJldCA9IHt9O1xuICAgICAgICBpZiAodGhpcy5wcm9maWxlICYmIHRoaXMucHJvZmlsZS5pZGVudGl0eSkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5wcm9maWxlLmlkZW50aXR5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZ2V0IGNyZWF0ZWRPbigpIHtcbiAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5fY3JlYXRlZE9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkuY3JlYXRlZF9hdCkge1xuICAgICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZWRPbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogZHQsXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiBDb21tb24uZ2V0VGlja3NGcm9tRGF0ZShkdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZWRPbiB8fCB7IGRhdGU6IG51bGwsIHRpY2tzOiBudWxsIH07XG4gICAgfVxuXG4gICAgZ2V0IGRpc3BsYXlOYW1lKCkge1xuICAgICAgICBsZXQgcmV0ID0gdGhpcy5mdWxsTmFtZTtcbiAgICAgICAgaWYgKHJldCkge1xuICAgICAgICAgICAgcmV0ID0gcmV0LnNwbGl0KCcgJylbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXQgJiYgdGhpcy5faWRlbnRpdHkubmlja25hbWUpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5Lm5pY2tuYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXQgZnVsbE5hbWUoKSB7XG4gICAgICAgIGxldCByZXQgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5Lm5hbWUpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5Lm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXQgZW1haWwoKSB7XG4gICAgICAgIGxldCByZXQgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LmVtYWlsKSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5lbWFpbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGdldCBwaWN0dXJlKCkge1xuICAgICAgICBsZXQgcmV0ID0gJyc7XG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5waWN0dXJlKSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5waWN0dXJlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZ2V0IHVzZXJJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aC51aWQ7XG4gICAgfVxuXG4gICAgZ2V0IGlzQWRtaW4oKSB7XG4gICAgICAgIGxldCByZXQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnJvbGVzKSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5yb2xlcy5hZG1pbiA9PSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFxuICAgIH1cblxuICAgIGdldCBoaXN0b3J5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9maWxlLmhpc3RvcnkgfHwgW107XG4gICAgfVxuXG4gICAgc2F2ZVVzZXJFZGl0b3JPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICAgICAgZWRpdG9yX29wdGlvbnM6IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXI7IiwiY29uc3QganNQbHVtYiA9IHdpbmRvdy5qc1BsdW1iO1xuY29uc3QganNQbHVtYlRvb2xraXQgPSB3aW5kb3cuanNQbHVtYlRvb2xraXQ7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxuY29uc3QgUGVybWlzc2lvbnMgPSByZXF1aXJlKCcuLi9hcHAvUGVybWlzc2lvbnMnKVxuXG5yZXF1aXJlKCcuL2xheW91dCcpXG5cbmNsYXNzIENhbnZhcyB7XG5cbiAgICBjb25zdHJ1Y3RvcihtYXAsIG1hcElkKSB7XG4gICAgICAgIHRoaXMubWFwID0gbWFwO1xuICAgICAgICB0aGlzLm1hcElkID0gbWFwSWQ7XG4gICAgICAgIHRoaXMudG9vbGtpdCA9IHt9O1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJylcbiAgICAgICAgbGV0IHBlcm1pc3Npb25zID0gbnVsbDtcblxuICAgICAgICBsZXQgcmVhZHkgPSB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHttYXBJZH1gKS50aGVuKChtYXBJbmZvKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1hcEluZm8gPSBtYXBJbmZvXG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG5ldyBQZXJtaXNzaW9ucyhtYXBJbmZvKVxuICAgICAgICB9KVxuXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcblxuICAgICAgICBjb25zdCB0aHJvdHRsZVNhdmUgPSBfLnRocm90dGxlKCgpID0+IHtcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9ucy5jYW5FZGl0KCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgcG9zdERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHdpbmRvdy50b29sa2l0LmV4cG9ydERhdGEoKSxcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZF9ieToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLk1ldGFGaXJlLnNldERhdGFJblRyYW5zYWN0aW9uKHBvc3REYXRhLCBgbWFwcy9kYXRhLyR7dGhpcy5tYXBJZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuSW50ZWdyYXRpb25zLnNlbmRFdmVudCh0aGlzLm1hcElkLCAnZXZlbnQnLCAnYXV0b3NhdmUnLCAnYXV0b3NhdmUnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCA1MDApO1xuXG4gICAgICAgIHJlYWR5LnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5yZWFkeShmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENvcm5lclxuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cbiAgICAgICAgICAgICAgICB2YXIgdG9vbGtpdCA9IHdpbmRvdy50b29sa2l0ID0ganNQbHVtYlRvb2xraXQubmV3SW5zdGFuY2Uoe1xuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTdGFydENvbm5lY3Q6ZnVuY3Rpb24oZnJvbU5vZGUsIGVkZ2VUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29ybmVyID0gZWRnZVR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZWRnZVR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlQ29ubmVjdDpmdW5jdGlvbihmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vUHJldmVudCBzZWxmLXJlZmVyZW5jaW5nIGNvbm5lY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihmcm9tTm9kZSA9PSB0b05vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9CZXR3ZWVuIHRoZSBzYW1lIHR3byBub2Rlcywgb25seSBvbmUgcGVyc3BlY3RpdmUgY29ubmVjdGlvbiBtYXkgZXhpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goY3VycmVudENvcm5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdwZXJzcGVjdGl2ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZXMgPSBmcm9tTm9kZS5nZXRFZGdlcyh7IGZpbHRlcjogZnVuY3Rpb24oZSkgeyByZXR1cm4gZS5kYXRhLnR5cGUgPT0gJ3BlcnNwZWN0aXZlJyB9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWQgPSBlZGdlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZigoZWQuc291cmNlID09IGZyb21Ob2RlICYmIGVkLnRhcmdldCA9PSB0b05vZGUpIHx8IChlZC50YXJnZXQgPT0gZnJvbU5vZGUgJiYgZWQuc291cmNlID09IHRvTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gZHVtbXkgZm9yIGEgbmV3IG5vZGUuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICB2YXIgX25ld05vZGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9dHlwZXx8XCJpZGVhXCJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHc6NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBoOjUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6XCJpZGVhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gZHVtbXkgZm9yIGEgbmV3IHByb3h5IChkcmFnIGhhbmRsZSlcbiAgICAgICAgICAgICAgICB2YXIgX25ld1Byb3h5ID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSB8fCAncHJveHlQZXJzcGVjdGl2ZSdcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHc6MTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBoOjEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTp0eXBlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBtYWluRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanRrLWRlbW8tbWFpblwiKSxcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanRrLWRlbW8tY2FudmFzXCIpO1xuXG5cbiAgICAgICAgICAgICAgICAvL1doZW5ldmVyIGNoYW5naW5nIHRoZSBzZWxlY3Rpb24sIGNsZWFyIHdoYXQgd2FzIHByZXZpb3VzbHkgc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICB2YXIgY2xlYXJTZWxlY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBpZihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuc2V0U2VsZWN0aW9uKG9iaik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBjb25maWd1cmUgdGhlIHJlbmRlcmVyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gdG9vbGtpdC5yZW5kZXIoe1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IGNhbnZhc0VsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzRHJhZ2dhYmxlOiBwZXJtaXNzaW9ucy5jYW5FZGl0KCksXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZVBhbkJ1dHRvbnM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBsYXlvdXQ6e1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3VzdG9tIGxheW91dCBmb3IgdGhpcyBhcHAuIHNpbXBsZSBleHRlbnNpb24gb2YgdGhlIHNwcmluZyBsYXlvdXQuXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwibWV0YW1hcFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgaG93IHlvdSBjYW4gYXNzb2NpYXRlIGdyb3VwcyBvZiBub2Rlcy4gSGVyZSwgYmVjYXVzZSBvZiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gd2F5IEkgaGF2ZSByZXByZXNlbnRlZCB0aGUgcmVsYXRpb25zaGlwIGluIHRoZSBkYXRhLCB3ZSBlaXRoZXIgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgcGFydCdzIFwicGFyZW50XCIgYXMgdGhlIHBvc3NlLCBvciBpZiBpdCBpcyBub3QgYSBwYXJ0IHRoZW4gd2VcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBub2RlJ3MgaWQuIFRoZXJlIGFyZSBhZGRUb1Bvc3NlIGFuZCByZW1vdmVGcm9tUG9zc2VcbiAgICAgICAgICAgICAgICAgICAgLy8gbWV0aG9kcyB0b28gKG9uIHRoZSByZW5kZXJlciwgbm90IHRoZSB0b29sa2l0KTsgdGhlc2UgY2FuIGJlIHVzZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0cmFuc2ZlcnJpbmcgYSBwYXJ0IGZyb20gb25lIHBhcmVudCB0byBhbm90aGVyLlxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25Qb3NzZTpmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5kYXRhLnBhcmVudCA/IFsgbm9kZS5kYXRhLnBhcmVudCwgZmFsc2UgXSA6IG5vZGUuaWQ7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHpvb21Ub0ZpdDpmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlldzp7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlczp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihvYmoubm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbihvYmopIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsTm9kZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJkZWZhdWx0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwici10aGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJpZGVhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsRHJhZ1Byb3h5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcnM6IFsnQ29udGludW91cycsICdDZW50ZXInXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlQZXJzcGVjdGl2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwicHJveHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZWxhdGlvbnNoaXA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcInByb3h5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqLm5vZGUuZGF0YS50eXBlID0gJ3ItdGhpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmoubm9kZS5zZXRUeXBlKCdyLXRoaW5nJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1VwZGF0aW5nIHRoZSBub2RlIHR5cGUgZG9lcyBub3Qgc2VlbSB0byBzdGljazsgaW5zdGVhZCwgY3JlYXRlIGEgbmV3IG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHJlbmRlcmVyLm1hcEV2ZW50TG9jYXRpb24ob2JqLmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gb2JqLm5vZGUuZ2V0RWRnZXMoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC53ID0gZWRnZXNbMF0uc291cmNlLmRhdGEudyAqIDAuNjY3O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQuaCA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLmggKiAwLjY2NztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKGpzUGx1bWIuZXh0ZW5kKF9uZXdOb2RlKFwici10aGluZ1wiKSwgZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZS1jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGlvbnMgb24gdGhlIG5ldyBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8ZWRnZXMubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVkZ2VzW2ldLnNvdXJjZSA9PSBvYmoubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bmV3Tm9kZSwgdGFyZ2V0OmVkZ2VzW2ldLnRhcmdldCwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlZGdlc1tpXS50YXJnZXQgPT0gb2JqLm5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOmVkZ2VzW2ldLnNvdXJjZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RlbGV0ZSB0aGUgcHJveHkgbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlTm9kZShvYmoubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZXM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9iai5lLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT0gJ3JlbGF0aW9uc2hpcC1vdmVybGF5JyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKG9iai5lZGdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JzOltcIkNvbnRpbnVvdXNcIixcIkNvbnRpbnVvdXNcIl0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rvcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcjpbXCJTdGF0ZU1hY2hpbmVcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VydmluZXNzOjE1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcmVsYXRpb25zaGlwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6XCJCbGFua1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5czpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIFwiUGxhaW5BcnJvd1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDoxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6MTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJyZWxhdGlvbnNoaXAtb3ZlcmxheVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBQcm94eTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1yZWxhdGlvbnNoaXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czo1LCBjc3NDbGFzczpcIm9yYW5nZVwiIH1dXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZVByb3h5OntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czoxLCBjc3NDbGFzczpcIm9yYW5nZV9wcm94eVwiIH1dXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBldmVudHM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNEYmxDbGljazpmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGFuIElkZWEgbm9kZSBhdCB0aGUgbG9jYXRpb24gYXQgd2hpY2ggdGhlIGV2ZW50IG9jY3VycmVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSByZW5kZXJlci5tYXBFdmVudExvY2F0aW9uKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTW92ZSAxLzIgdGhlIGhlaWdodCBhbmQgd2lkdGggdXAgYW5kIHRvIHRoZSBsZWZ0IHRvIGNlbnRlciB0aGUgbm9kZSBvbiB0aGUgbW91c2UgY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHdoZW4gaGVpZ2h0L3dpZHRoIGlzIGNvbmZpZ3VyYWJsZSwgcmVtb3ZlIGhhcmQtY29kZWQgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmxlZnQgPSBwb3MubGVmdC01MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy50b3AgPSBwb3MudG9wLTUwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5hZGROb2RlKGpzUGx1bWIuZXh0ZW5kKF9uZXdOb2RlKCksIHBvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVBZGRlZDpfcmVnaXN0ZXJIYW5kbGVycywgLy8gc2VlIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlQWRkZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXlvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyaW91cyBkcmFnL2Ryb3AgaGFuZGxlciBldmVudCBleHBlcmltZW50cyBsaXZlZCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRyYWdPcHRpb25zOntcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjpcIi5zZWdtZW50XCIgICAgICAgLy8gY2FuJ3QgZHJhZyBub2RlcyBieSB0aGUgY29sb3Igc2VnbWVudHMuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5pbml0aWFsaXplKHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogXCIuZGxnXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8gZGlhbG9ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgICAgICAgICAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICBNb3VzZSBoYW5kbGVycy4gU29tZSBhcmUgd2lyZWQgdXA7IGFsbCBsb2cgdGhlIGN1cnJlbnQgbm9kZSBkYXRhIHRvIHRoZSBjb25zb2xlLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgICAgICB2YXIgX3R5cGVzID0gWyBcInJlZFwiLCBcIm9yYW5nZVwiLCBcImdyZWVuXCIsIFwiYmx1ZVwiLCBcInRleHRcIiBdO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNsaWNrTG9nZ2VyID0gZnVuY3Rpb24odHlwZSwgZXZlbnQsIGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50ICsgJyAnICsgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG5vZGUuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50ID09ICdkYmxjbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBfY2xpY2tIYW5kbGVycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1InLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBncmVlbjpmdW5jdGlvbihlbCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdHJywgJ2NsaWNrJywgZWwsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JhbmdlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ08nLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBibHVlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0InLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1QnLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1InLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW46ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignRycsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9IG5vZGUuZGF0YS53ICogMC42Njc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0hlaWdodCA9IG5vZGUuZGF0YS5oICogMC42Njc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4gPSBub2RlLmRhdGEuY2hpbGRyZW4gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0xhYmVsID0gJ1BhcnQnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoe3BhcmVudDpub2RlLmlkLHc6bmV3V2lkdGgsaDpuZXdIZWlnaHQsbGFiZWw6IG5ld0xhYmVsfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmNoaWxkcmVuLnB1c2gobmV3Tm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIucmVsYXlvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignTycsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVBlcnNwZWN0aXZlJykpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bm9kZSwgdGFyZ2V0OnByb3h5Tm9kZSwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwZXJzcGVjdGl2ZVByb3h5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwZXJzcGVjdGl2ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignQicsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVJlbGF0aW9uc2hpcCcpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5vZGUsIHRhcmdldDpwcm94eU5vZGUsIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwUHJveHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpwcm94eU5vZGUsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignVCcsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogXCJkbGdUZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVudGVyIGxhYmVsOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9LOiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC51cGRhdGVOb2RlKG5vZGUsIHsgbGFiZWw6ZC50ZXh0IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6bm9kZS5kYXRhLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgX2N1cnJ5SGFuZGxlciA9IGZ1bmN0aW9uKGVsLCBzZWdtZW50LCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLlwiICsgc2VnbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24oX2VsLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jbGlja0hhbmRsZXJzW1wiY2xpY2tcIl1bc2VnbWVudF0oZWwsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYi5vbihfZWwsIFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NsaWNrSGFuZGxlcnNbXCJkYmxjbGlja1wiXVtzZWdtZW50XShlbCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIHNldHVwIHRoZSBjbGlja2luZyBhY3Rpb25zIGFuZCB0aGUgbGFiZWwgZHJhZy4gRm9yIHRoZSBkcmFnIHdlIGNyZWF0ZSBhblxuICAgICAgICAgICAgICAgIC8vIGluc3RhbmNlIG9mIGpzUGx1bWIgZm9yIG5vdCBvdGhlciBwdXJwb3NlIHRoYW4gdG8gbWFuYWdlIHRoZSBkcmFnZ2luZyBvZlxuICAgICAgICAgICAgICAgIC8vIGxhYmVscy4gV2hlbiBhIGRyYWcgc3RhcnRzIHdlIHNldCB0aGUgem9vbSBvbiB0aGF0IGpzUGx1bWIgaW5zdGFuY2UgdG9cbiAgICAgICAgICAgICAgICAvLyBtYXRjaCBvdXIgY3VycmVudCB6b29tLlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsRHJhZ0hhbmRsZXIgPSBqc1BsdW1iLmdldEluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gX3JlZ2lzdGVySGFuZGxlcnMocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhlcmUgeW91IGhhdmUgcGFyYW1zLmVsLCB0aGUgRE9NIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHBhcmFtcy5ub2RlLCB0aGUgdW5kZXJseWluZyBub2RlLiBpdCBoYXMgYSBgZGF0YWAgbWVtYmVyIHdpdGggdGhlIG5vZGUncyBwYXlsb2FkLlxuICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSBwYXJhbXMuZWwsIG5vZGUgPSBwYXJhbXMubm9kZSwgbGFiZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLm5hbWVcIik7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3R5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY3VycnlIYW5kbGVyKGVsLCBfdHlwZXNbaV0sIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgbGFiZWwgZHJhZ2dhYmxlIChzZWUgbm90ZSBhYm92ZSkuXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsRHJhZ0hhbmRsZXIuZHJhZ2dhYmxlKGxhYmVsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDpmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRHJhZ0hhbmRsZXIuc2V0Wm9vbShyZW5kZXJlci5nZXRab29tKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3A6ZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5sYWJlbFBvc2l0aW9uID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChsYWJlbC5zdHlsZS5sZWZ0LCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLnRvcCwgMTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlU2F2ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIGxhYmVsIGVkaXRhYmxlIHZpYSBhIGRpYWxvZ1xuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGxhYmVsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImRsZ1RleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9LOiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnVwZGF0ZU5vZGUobm9kZSwgeyBsYWJlbDpkLnRleHQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Om5vZGUuZGF0YS5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAqIHNob3dzIGluZm8gaW4gd2luZG93IG9uIGJvdHRvbSByaWdodC5cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIF9pbmZvKHRleHQpIHtcblxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgICAgICAvLyBsb2FkIHRoZSBkYXRhLlxuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1hcCAmJiB0aGF0Lm1hcC5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGF0Lm1hcC5kYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy8gYSBjb3VwbGUgb2YgcmFuZG9tIGV4YW1wbGVzIG9mIHRoZSBmaWx0ZXIgZnVuY3Rpb24sIGFsbG93aW5nIHlvdSB0byBxdWVyeSB5b3VyIGRhdGFcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgICAgICB2YXIgY291bnRFZGdlc09mVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvb2xraXQuZmlsdGVyKGZ1bmN0aW9uKG9iaikgeyByZXR1cm4gb2JqLm9iamVjdFR5cGUgPT0gXCJFZGdlXCIgJiYgb2JqLmRhdGEudHlwZT09PXR5cGU7IH0pLmdldEVkZ2VDb3VudCgpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgZHVtcEVkZ2VDb3VudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSBhcmUgXCIgKyBjb3VudEVkZ2VzT2ZUeXBlKFwicmVsYXRpb25zaGlwXCIpICsgXCIgcmVsYXRpb25zaGlwIGVkZ2VzXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFyZSBcIiArIGNvdW50RWRnZXNPZlR5cGUoXCJwZXJzcGVjdGl2ZVwiKSArIFwiIHBlcnNwZWN0aXZlIGVkZ2VzXCIpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0b29sa2l0LmJpbmQoXCJkYXRhVXBkYXRlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZHVtcEVkZ2VDb3VudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVTYXZlKCk7XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oXCJyZWxhdGlvbnNoaXBFZGdlRHVtcFwiLCBcImNsaWNrXCIsIGR1bXBFZGdlQ291bnRzKCkpO1xuXG4gICAgICAgICAgICAgICAgLy9DVFJMICsgY2xpY2sgZW5hYmxlcyB0aGUgbGFzc29cbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAnbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlbGV0ZUFsbCA9IGZ1bmN0aW9uKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaW1wbGVtZW50IGxvZ2ljIHRvIGRlbGV0ZSB3aG9sZSBlZGdlK3Byb3h5K2VkZ2Ugc3RydWN0dXJlXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmVhY2hFZGdlKGZ1bmN0aW9uKGksZSkgeyBjb25zb2xlLmxvZyhlKSB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvL1JlY3Vyc2Ugb3ZlciBhbGwgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaE5vZGUoZnVuY3Rpb24oaSxuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjdXJzZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihub2RlICYmIG5vZGUuZGF0YS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxub2RlLmRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSB0b29sa2l0LmdldE5vZGUobm9kZS5kYXRhLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRGVsZXRlIGNoaWxkcmVuIGJlZm9yZSBwYXJlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmVOb2RlKG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNlKG4pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmUoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBtb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAvL21hcCBiYWNrc3BhY2UgdG8gZGVsZXRlIGlmIGFueXRoaW5nIGlzIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZSA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdG9vbGtpdC5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQWxsKHNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlID0gJ3NlbGVjdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRNb2RlKCdzZWxlY3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHRvb2xraXQuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUFsbChzZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vS0xVREdFOlxuICAgICAgICAgICAgICAgIC8vVGhlIFNWRyBzZWdtZW50cyBmb3IgbGV0dGVycyBhbmQgYnV0dG9ucyBhcmUgbm90IGdyb3VwZWQgdG9nZXRoZXIsIHNvIHRoZSBjc3M6aG92ZXIgdHJpY2sgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICAgICAgLy9JbnN0ZWFkLCB1c2UgalF1ZXJ5XG4gICAgICAgICAgICAgICAgY29uc3QgdG9nZ2xlT3BhY2l0eSA9IChub2RlLCBvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvL01vdXNlIE92ZXJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxldHRlciA9ICQobm9kZSlcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNzc0NsYXNzID0gbm9kZS5jbGFzc0xpc3RbMV1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1dHRvbiA9ICcnXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY3NzQ2xhc3MudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uID0gJ29yYW5nZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9ICdyZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24gPSAnYmx1ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9ICdncmVlbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChsZXR0ZXIpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoYC4ke2J1dHRvbn0uc2VnbWVudGApLmNzcygnb3BhY2l0eScsIG9uKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQoJy5sZXR0ZXInKS5ob3ZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vTW91c2UgT3ZlclxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVPcGFjaXR5KHRoaXMsIDEpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9Nb3VzZSBPdXRcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICQoJy5zZWdtZW50JykuaG92ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvL01vdXNlIE92ZXJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ29wYWNpdHknLCAxKVxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9Nb3VzZSBPdXRcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ29wYWNpdHknLCAwKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcblxuICAgIH1cbn1cblxuLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7XG4iLCIvKipcbiogQ3VzdG9tIGxheW91dCBmb3IgbWV0YW1hcC4gRXh0ZW5kcyB0aGUgU3ByaW5nIGxheW91dC4gQWZ0ZXIgU3ByaW5nIHJ1bnMsIHRoaXNcbiogbGF5b3V0IGZpbmRzICdwYXJ0JyBub2RlcyBhbmQgYWxpZ25zIHRoZW0gdW5kZXJuZWF0aCB0aGVpciBwYXJlbnRzLiBUaGUgYWxpZ25tZW50XG4qIC0gbGVmdCBvciByaWdodCAtIGlzIHNldCBpbiB0aGUgcGFyZW50IG5vZGUncyBkYXRhLCBhcyBgcGFydEFsaWduYC5cbiovXG47KGZ1bmN0aW9uKCkge1xuXG4gIGpzUGx1bWJUb29sa2l0LkxheW91dHNbXCJtZXRhbWFwXCJdID0gZnVuY3Rpb24oKSB7XG4gICAganNQbHVtYlRvb2xraXQuTGF5b3V0cy5TcHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBfb25lU2V0ID0gZnVuY3Rpb24ocGFyZW50LCBwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgIHZhciBwYWRkaW5nID0gcGFyYW1zLnBhcnRQYWRkaW5nIHx8IDIwO1xuICAgICAgaWYgKHBhcmVudC5kYXRhLmNoaWxkcmVuKSB7XG5cbiAgICAgICAgdmFyIGMgPSBwYXJlbnQuZGF0YS5jaGlsZHJlbixcbiAgICAgICAgICAgIHBhcmVudFBvcyA9IHRoaXMuZ2V0UG9zaXRpb24ocGFyZW50LmlkKSxcbiAgICAgICAgICAgIHBhcmVudFNpemUgPSB0aGlzLmdldFNpemUocGFyZW50LmlkKSxcbiAgICAgICAgICAgIG1hZ25ldGl6ZU5vZGVzID0gWyBwYXJlbnQuaWQgXSxcbiAgICAgICAgICAgIGFsaWduID0gKHBhcmVudC5kYXRhLnBhcnRBbGlnbiB8fCBcInJpZ2h0XCIpID09PSBcImxlZnRcIiA/IDAgOiAxLFxuICAgICAgICAgICAgeSA9IHBhcmVudFBvc1sxXSArIHBhcmVudFNpemVbMV0gKyBwYWRkaW5nO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmKGNbaV0pIHtcbiAgICAgICAgICAgIHZhciBjaGlsZFNpemUgPSB0aGlzLmdldFNpemUoY1tpXSksXG4gICAgICAgICAgICAgICAgeCA9IHBhcmVudFBvc1swXSArIChhbGlnbiAqIChwYXJlbnRTaXplWzBdIC0gY2hpbGRTaXplWzBdKSk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb24oY1tpXSwgeCwgeSwgdHJ1ZSk7XG4gICAgICAgICAgICBtYWduZXRpemVOb2Rlcy5wdXNoKGNbaV0pO1xuICAgICAgICAgICAgeSArPSAoY2hpbGRTaXplWzFdICsgcGFkZGluZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAvLyBzdGFzaCBvcmlnaW5hbCBlbmQgY2FsbGJhY2sgYW5kIG92ZXJyaWRlLiBwbGFjZSBhbGwgUGFydCBub2RlcyB3cnQgdGhlaXJcbiAgICAvLyBwYXJlbnRzLCB0aGVuIGNhbGwgb3JpZ2luYWwgZW5kIGNhbGxiYWNrIGFuZCBmaW5hbGx5IHRlbGwgdGhlIGxheW91dFxuICAgIC8vIHRvIGRyYXcgaXRzZWxmIGFnYWluLlxuICAgIHZhciBfc3VwZXJFbmQgPSB0aGlzLmVuZDtcbiAgICB0aGlzLmVuZCA9IGZ1bmN0aW9uKHRvb2xraXQsIHBhcmFtcykge1xuICAgICAgdmFyIG5jID0gdG9vbGtpdC5nZXROb2RlQ291bnQoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmM7IGkrKykge1xuICAgICAgICB2YXIgbiA9IHRvb2xraXQuZ2V0Tm9kZUF0KGkpO1xuICAgICAgICAvLyBvbmx5IHByb2Nlc3Mgbm9kZXMgdGhhdCBhcmUgbm90IFBhcnQgbm9kZXMgKHRoZXJlIGNvdWxkIG9mIGNvdXJzZSBiZVxuICAgICAgICAvLyBhIG1pbGxpb24gd2F5cyBvZiBkZXRlcm1pbmluZyB3aGF0IGlzIGEgUGFydCBub2RlLi4uaGVyZSBJIGp1c3QgdXNlXG4gICAgICAgIC8vIGEgcnVkaW1lbnRhcnkgY29uc3RydWN0IGluIHRoZSBkYXRhKVxuICAgICAgICBpZiAobi5kYXRhLnBhcmVudCA9PSBudWxsKSB7XG4gICAgICAgICAgX29uZVNldChuLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9zdXBlckVuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgfTtcblxufSkoKTtcbiIsImNvbnN0IEFDVElPTlMgPSB7XG4gICAgTUFQOiAnbWFwJyxcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXG4gICAgQ09QWV9NQVA6ICdjb3B5X21hcCcsXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxuICAgIEhPTUU6ICdob21lJyxcbiAgICBNWV9NQVBTOiAnbXltYXBzJyxcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcbiAgICBMT0dPVVQ6ICdsb2dvdXQnLFxuICAgIEZFRURCQUNLOiAnZmVlZGJhY2snLFxuICAgIFNIQVJFX01BUDogJ3NoYXJlX21hcCdcbn07XG5cbk9iamVjdC5mcmVlemUoQUNUSU9OUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQUNUSU9OUzsiLCJjb25zdCBDQU5WQVMgPSB7XG4gICAgTEVGVDogJ2xlZnQnLFxuICAgIFJJR0hUOiAncmlnaHQnXG59O1xuXG5PYmplY3QuZnJlZXplKENBTlZBUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ0FOVkFTOyIsImNvbnN0IENPTlNUQU5UUyA9IHtcblx0QUNUSU9OUzogcmVxdWlyZSgnLi9hY3Rpb25zJyksXG5cdENBTlZBUzogcmVxdWlyZSgnLi9jYW52YXMnKSxcblx0RFNSUDogcmVxdWlyZSgnLi9kc3JwJyksXG5cdEVESVRfU1RBVFVTOiByZXF1aXJlKCcuL2VkaXRTdGF0dXMnKSxcblx0RUxFTUVOVFM6IHJlcXVpcmUoJy4vZWxlbWVudHMnKSxcbiAgICBFVkVOVFM6IHJlcXVpcmUoJy4vZXZlbnRzJyksXG4gICAgTk9USUZJQ0FUSU9OOiByZXF1aXJlKCcuL25vdGlmaWNhdGlvbicpLFxuXHRQQUdFUzogcmVxdWlyZSgnLi9wYWdlcycpLFxuXHRST1VURVM6IHJlcXVpcmUoJy4vcm91dGVzJyksXG5cdFRBQlM6IHJlcXVpcmUoJy4vdGFicycpLFxuXHRUQUdTOiByZXF1aXJlKCcuL3RhZ3MnKVxufTtcblxuT2JqZWN0LmZyZWV6ZShDT05TVEFOVFMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENPTlNUQU5UUzsiLCJjb25zdCBEU1JQID0ge1xuXHREOiAnRCcsXG5cdFM6ICdTJyxcblx0UjogJ1InLFxuXHRQOiAnUCdcbn1cblxuT2JqZWN0LmZyZWV6ZShEU1JQKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEU1JQOyIsImNvbnN0IHN0YXR1cyA9IHtcbiAgICBMQVNUX1VQREFURUQ6ICcnLFxuICAgIFJFQURfT05MWTogJ1ZpZXcgb25seScsXG4gICAgU0FWSU5HOiAnU2F2aW5nLi4uJyxcbiAgICBTQVZFX09LOiAnQWxsIGNoYW5nZXMgc2F2ZWQnLFxuICAgIFNBVkVfRkFJTEVEOiAnQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQnXG59O1xuXG5PYmplY3QuZnJlZXplKHN0YXR1cyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhdHVzOyIsImNvbnN0IEVMRU1FTlRTID0ge1xuICAgIEFQUF9DT05UQUlORVI6ICdhcHAtY29udGFpbmVyJyxcbiAgICBNRVRBX1BST0dSRVNTOiAnbWV0YV9wcm9ncmVzcycsXG4gICAgTUVUQV9QUk9HUkVTU19ORVhUOiAnbWV0YV9wcm9ncmVzc19uZXh0JyxcbiAgICBNRVRBX01PREFMX0RJQUxPR19DT05UQUlORVI6ICdtZXRhX21vZGFsX2RpYWxvZ19jb250YWluZXInXG59O1xuXG5PYmplY3QuZnJlZXplKEVMRU1FTlRTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFTEVNRU5UUzsiLCJjb25zdCBFVkVOVFMgPSB7XG5cdFNJREVCQVJfT1BFTjogJ3NpZGViYXItb3BlbicsXG5cdFNJREVCQVJfQ0xPU0U6ICdzaWRlYmFyLWNsb3NlJyxcblx0U0lERUJBUl9UT0dHTEU6ICdzaWRlYmFyLXRvZ2dsZScsXG5cdFBBR0VfTkFNRTogJ3BhZ2VOYW1lJyxcblx0TkFWOiAnbmF2Jyxcblx0TUFQOiAnbWFwJ1xufVxuXG5PYmplY3QuZnJlZXplKEVWRU5UUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRVZFTlRTOyIsImNvbnN0IE5PVElGSUNBVElPTiA9IHtcblx0TUFQOiAnbWFwJ1xufVxuXG5PYmplY3QuZnJlZXplKE5PVElGSUNBVElPTik7XG5cbm1vZHVsZS5leHBvcnRzID0gTk9USUZJQ0FUSU9OOyIsImNvbnN0IEFDVElPTlMgPSByZXF1aXJlKCcuL2FjdGlvbnMuanMnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuY29uc3QgUEFHRVMgPSB7XG4gICAgTUFQOiAnbWFwJyxcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXG4gICAgQ09QWV9NQVA6ICdjb3B5X21hcCcsXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxuICAgIFRFUk1TX0FORF9DT05ESVRJT05TOiAndGVybXMnLFxuICAgIEhPTUU6ICdob21lJ1xufTtcblxuXy5leHRlbmQoKVxuXG5PYmplY3QuZnJlZXplKFBBR0VTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQQUdFUzsiLCJjb25zdCBST1VURVMgPSB7XG4gICAgTUFQU19MSVNUOiAnbWFwcy9saXN0LycsXG4gICAgTUFQU19EQVRBOiAnbWFwcy9kYXRhLycsXG4gICAgTUFQU19ORVdfTUFQOiAnbWFwcy9uZXctbWFwLycsXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICdtZXRhbWFwL3Rlcm1zLWFuZC1jb25kaXRpb25zLycsXG4gICAgSE9NRTogJ21ldGFtYXAvaG9tZS8nLFxuICAgIE5PVElGSUNBVElPTlM6ICd1c2Vycy97MH0vbm90aWZpY2F0aW9ucydcbn07XG5cbk9iamVjdC5mcmVlemUoUk9VVEVTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBST1VURVM7IiwiY29uc3QgVEFCUyA9IHtcbiAgICBUQUJfSURfUFJFU0VOVEVSIDogJ3ByZXNlbnRlci10YWInLFxuICAgIFRBQl9JRF9BTkFMWVRJQ1NfTUFQIDogJ2FuYWx5dGljcy10YWItbWFwJyxcbiAgICBUQUJfSURfQU5BTFlUSUNTX1RISU5HIDogJ2FuYWx5dGljcy10YWItdGhpbmcnLFxuICAgIFRBQl9JRF9QRVJTUEVDVElWRVMgOiAncGVyc3BlY3RpdmVzLXRhYicsXG4gICAgVEFCX0lEX0RJU1RJTkNUSU9OUyA6ICdkaXN0aW5jdGlvbnMtdGFiJyxcbiAgICBUQUJfSURfQVRUQUNITUVOVFMgOiAnYXR0YWNobWVudHMtdGFiJyxcbiAgICBUQUJfSURfR0VORVJBVE9SIDogJ2dlbmVyYXRvci10YWInLFxuICAgIFRBQl9JRF9TVEFOREFSRFMgOiAnc3RhbmRhcmRzLXRhYidcbn07XG5PYmplY3QuZnJlZXplKFRBQlMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRBQlM7IiwiY29uc3QgVEFHUyA9IHtcbiAgICBNRVRBX0NBTlZBUzogJ21ldGEtY2FudmFzJyxcbiAgICBIT01FOiAnaG9tZScsXG4gICAgVEVSTVM6ICd0ZXJtcycsXG4gICAgTVlfTUFQUzogJ215LW1hcHMnLFxuICAgIFNIQVJFOiAnc2hhcmUnXG59O1xuXG5PYmplY3QuZnJlZXplKFRBR1MpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRBR1M7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuXG5jbGFzcyBBZGRUaGlzIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG4gICAgICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcbiAgICAgICAgICAgICAgICB0ID0gd2luZG93LmFkZHRoaXMgfHwge307XG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XG4gICAgICAgICAgICBqcy5pZCA9IGlkO1xuICAgICAgICAgICAganMuc3JjID0gYC8vczcuYWRkdGhpcy5jb20vanMvMzAwL2FkZHRoaXNfd2lkZ2V0LmpzI3B1YmlkPSR7Y29uZmlnLnB1YmlkfWA7XG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG5cbiAgICAgICAgICAgIHQuX2UgPSBbXTtcbiAgICAgICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xuICAgICAgICAgICAgICAgIHQuX2UucHVzaChmKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICB9IChkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJhZGQtdGhpcy1qc1wiKSk7XG4gICAgICAgIHRoaXMuYWRkdGhpcyA9IHdpbmRvdy5hZGR0aGlzO1xuICAgIH1cbiAgICBcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgICAgIHRoaXMuYWRkdGhpcyA9IHRoaXMuYWRkdGhpcyB8fCB3aW5kb3cuYWRkdGhpcztcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkdGhpcztcbiAgICB9XG4gICAgXG4gICAgaW5pdCgpIHtcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBZGRUaGlzO1xuXG5cbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcbmNvbnN0IEdvb2dsZSA9IHJlcXVpcmUoJy4vZ29vZ2xlJyk7XG5cbmNsYXNzIEZhY2Vib29rIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG4gICAgICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xuICAgICAgICAgICAganMuaWQgPSBpZDtcbiAgICAgICAgICAgIGpzLnNyYyA9IFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9zZGsuanNcIjtcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcbiAgICAgICAgfSAoZG9jdW1lbnQsICdzY3JpcHQnLCAnZmFjZWJvb2stanNzZGsnKSk7XG4gICAgICAgIHRoaXMuRkIgPSB3aW5kb3cuRkI7XG4gICAgfVxuICAgIFxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLmluaXQoKTtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5pbml0KHtcbiAgICAgICAgICAgIGFwcElkOiB0aGlzLmNvbmZpZy5hcHBpZCxcbiAgICAgICAgICAgIHhmYm1sOiB0aGlzLmNvbmZpZy54ZmJtbCxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMuY29uZmlnLnZlcnNpb25cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5FdmVudC5zdWJzY3JpYmUoJ2VkZ2UuY3JlYXRlJywgZnVuY3Rpb24gKHRhcmdldFVybCkge1xuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5FdmVudC5zdWJzY3JpYmUoJ2VkZ2UucmVtb3ZlJywgZnVuY3Rpb24gKHRhcmdldFVybCkge1xuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5FdmVudC5zdWJzY3JpYmUoJ21lc3NhZ2Uuc2VuZCcsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcbiAgICAgICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCdmYWNlYm9vaycsIHRhcmdldFVybCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgICAgIHRoaXMuRkIgPSB0aGlzLkZCIHx8IHdpbmRvdy5GQjtcbiAgICAgICAgcmV0dXJuIHRoaXMuRkI7XG4gICAgfVxuICAgIFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZhY2Vib29rO1xuXG5cbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcblxuY2xhc3MgR29vZ2xlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcbiAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XG4gICAgICBsZXQgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XG4gICAgfSkoKTtcbiAgICAgIFxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xuICAgICAgd1tsXSA9IHdbbF0gfHwgW107IHdbbF0ucHVzaCh7XG4gICAgICAgICdndG0uc3RhcnQnOlxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXG4gICAgICB9KTsgbGV0IGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxuICAgICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgdGhpcy5jb25maWcudGFnbWFuYWdlcik7XG5cbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICAoaVtyXS5xID0gaVtyXS5xIHx8IFtdKS5wdXNoKGFyZ3VtZW50cyk7XG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcbiAgICAgIG0gPSBzLmdldEVsZW1lbnRzQnlUYWdOYW1lKG8pWzBdOyBhLmFzeW5jID0gMTsgYS5zcmMgPSBnO1xuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xuXG4gIH1cblxuICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgdGhpcy5nYSA9IHRoaXMuZ2EgfHwgd2luZG93LmdhO1xuICAgIHJldHVybiB0aGlzLmdhO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBzdXBlci5pbml0KCk7XG4gICAgbGV0IG1vZGUgPSAnYXV0byc7XG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xuICAgIGlmKGRvbWFpbi5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xuICAgICAgbW9kZSA9ICdub25lJztcbiAgICB9XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignY3JlYXRlJywgdGhpcy5jb25maWcuYW5hbHl0aWNzLCBtb2RlKTtcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gIH1cblxuICBzZXRVc2VyKCkge1xuICAgIHN1cGVyLnNldFVzZXIoKTtcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCAndXNlcklkJywgdGhpcy51c2VyLnVzZXJJZCk7XG4gIH1cblxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcbiAgICBpZiAod2luZG93LmdhKSB7XG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcbiAgICB9XG4gIH1cblxuICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XG4gICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcbiAgICAgIGlmIChzb3VyY2UgJiYgdHlwZSkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xuICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xuICAgICAgICAgICAgcGFnZTogcGF0aFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzZW5kRXZlbnQoZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKSB7XG4gICAgaWYgKHdpbmRvdy5nYSkge1xuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcblxuXG4iLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXG5cbmNsYXNzIEludGVyY29tIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG5cbiAgICAgICAgbGV0IGkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpLmMoYXJndW1lbnRzKVxuICAgICAgICB9O1xuICAgICAgICBpLnEgPSBbXTtcbiAgICAgICAgaS5jID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgICAgIGkucS5wdXNoKGFyZ3MpXG4gICAgICAgIH07XG4gICAgICAgIHdpbmRvdy5JbnRlcmNvbSA9IGk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgICAgICBzLmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgIHMuc3JjID0gYGh0dHBzOi8vd2lkZ2V0LmludGVyY29tLmlvL3dpZGdldC8ke2NvbmZpZy5hcHBpZH19YDtcbiAgICAgICAgICAgIGxldCB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgICAgICAgICAgeC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzLCB4KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcmNvbSA9IHdpbmRvdy5JbnRlcmNvbTtcbiAgICB9XG5cbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgICAgIHRoaXMuaW50ZXJjb20gPSB0aGlzLmludGVyY29tIHx8IHdpbmRvdy5JbnRlcmNvbTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJjb207XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIHNldFVzZXIoKSB7XG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignYm9vdCcsIHtcbiAgICAgICAgICAgIGFwcF9pZDogdGhpcy5jb25maWcuYXBwaWQsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLnVzZXIuZnVsbE5hbWUsXG4gICAgICAgICAgICBlbWFpbDogdGhpcy51c2VyLmVtYWlsLFxuICAgICAgICAgICAgY3JlYXRlZF9hdDogdGhpcy51c2VyLmNyZWF0ZWRPbi50aWNrcyxcbiAgICAgICAgICAgIHVzZXJfaWQ6IHRoaXMudXNlci51c2VySWRcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2VuZEV2ZW50KCd1cGRhdGUnKTtcbiAgICB9XG5cbiAgICBzZW5kRXZlbnQoZXZlbnQgPSAndXBkYXRlJykge1xuICAgICAgICBzdXBlci5zZW5kRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCd1cGRhdGUnKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQYXRoKHBhdGgpIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbigndXBkYXRlJyk7XG4gICAgfVxuICAgIFxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgc3VwZXIubG9nb3V0KCk7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NodXRkb3duJyk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjb207IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuXG5jbGFzcyBOZXdSZWxpYyBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuXG4gICAgICAgIHRoaXMuTmV3UmVsaWMgPSB3aW5kb3cuTlJFVU07XG4gICAgfVxuXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgICAgICB0aGlzLk5ld1JlbGljID0gdGhpcy5OZXdSZWxpYyB8fCB3aW5kb3cuTlJFVU07XG4gICAgICAgIHJldHVybiB0aGlzLk5ld1JlbGljO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBzZXRVc2VyKCkge1xuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XG4gICAgICAgIGlmICh0aGlzLmludGVncmF0aW9uICYmIHRoaXMuaW50ZWdyYXRpb24uc2V0Q3VzdG9tQXR0cmlidXRlKSB7XG4gICAgICAgICAgICB0aGlzLmludGVncmF0aW9uLnNldEN1c3RvbUF0dHJpYnV0ZSgndXNlcm5hbWUnLCB0aGlzLnVzZXIuZW1haWwpO1xuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUoJ2FjY2NvdW50SUQnLCB0aGlzLnVzZXIudXNlcklkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcbiAgICAgICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XG4gICAgICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmludGVncmF0aW9uLmFkZFRvVHJhY2UodmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVBhdGgocGF0aCkge1xuICAgICAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xuICAgICAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zZXRQYWdlVmlld05hbWUocGF0aCwgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3UmVsaWM7XG5cblxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuY29uc3QgR29vZ2xlID0gcmVxdWlyZSgnLi9nb29nbGUnKTtcblxuY2xhc3MgVHdpdHRlciBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XG4gICAgICAgICAgICBsZXQganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXG4gICAgICAgICAgICAgICAgdCA9IHdpbmRvdy50d3R0ciB8fCB7fTtcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcbiAgICAgICAgICAgIGpzLmlkID0gaWQ7XG4gICAgICAgICAgICBqcy5zcmMgPSBcImh0dHBzOi8vcGxhdGZvcm0udHdpdHRlci5jb20vd2lkZ2V0cy5qc1wiO1xuICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuXG4gICAgICAgICAgICB0Ll9lID0gW107XG4gICAgICAgICAgICB0LnJlYWR5ID0gZnVuY3Rpb24gKGYpIHtcbiAgICAgICAgICAgICAgICB0Ll9lLnB1c2goZik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwidHdpdHRlci13anNcIikpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLmluaXQoKTtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5yZWFkeSgodHdpdHRlcikgPT4ge1xuICAgICAgICAgICAgdHdpdHRlci53aWRnZXRzLmxvYWQoKTtcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ2NsaWNrJywgdGhpcy5fY2xpY2tFdmVudFRvQW5hbHl0aWNzKTtcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ3R3ZWV0JywgdGhpcy5fdHdlZXRJbnRlbnRUb0FuYWx5dGljcyk7XG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdyZXR3ZWV0JywgdGhpcy5fcmV0d2VldEludGVudFRvQW5hbHl0aWNzKTtcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ2Zhdm9yaXRlJywgdGhpcy5fZmF2SW50ZW50VG9BbmFseXRpY3MpO1xuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnZm9sbG93JywgdGhpcy5fZm9sbG93SW50ZW50VG9BbmFseXRpY3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgdHJ5Q291bnQgPSAwO1xuICAgICAgICBsZXQgbG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cudHd0dHIgJiYgd2luZG93LnR3dHRyLndpZGdldHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnR3dHRyLndpZGdldHMubG9hZCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0cnlDb3VudCA8IDUpIHtcbiAgICAgICAgICAgICAgICB0cnlDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgIF8uZGVsYXkobG9hZCwgMjUwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcbiAgICAgICAgdGhpcy50d3R0ciA9IHRoaXMudHd0dHIgfHwgd2luZG93LnR3dHRyO1xuICAgICAgICByZXR1cm4gdGhpcy50d3R0cjtcbiAgICB9XG5cbiAgICBfZm9sbG93SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcbiAgICAgICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xuICAgICAgICBsZXQgbGFiZWwgPSBpbnRlbnRFdmVudC5kYXRhLnVzZXJfaWQgKyBcIiAoXCIgKyBpbnRlbnRFdmVudC5kYXRhLnNjcmVlbl9uYW1lICsgXCIpXCI7XG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xuICAgIH1cblxuICAgIF9yZXR3ZWV0SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcbiAgICAgICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xuICAgICAgICBsZXQgbGFiZWwgPSBpbnRlbnRFdmVudC5kYXRhLnNvdXJjZV90d2VldF9pZDtcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XG4gICAgfVxuXG4gICAgX2ZhdkludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XG4gICAgICAgIHRoaXMuX3R3ZWV0SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpO1xuICAgIH1cblxuICAgIF90d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XG4gICAgICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcbiAgICAgICAgbGV0IGxhYmVsID0gXCJ0d2VldFwiO1xuICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgndHdpdHRlcicsIGxhYmVsLCBpbnRlbnRFdmVudC50eXBlKTtcbiAgICB9XG4gICAgX2NsaWNrRXZlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XG4gICAgICAgIGxldCBsYWJlbCA9IGludGVudEV2ZW50LnJlZ2lvbjtcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFR3aXR0ZXI7XG5cblxuIiwiXG5jb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xuXG5jbGFzcyBVc2VyU25hcCBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgICAgICBsZXQgYXBpS2V5LCBzLCB4O1xuICAgICAgICBpZiAoY29uZmlnID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGFwaUtleSA9IGNvbmZpZy5hcGk7XG4gICAgICAgIGlmIChhcGlLZXkgJiYgIXdpbmRvdy5sb2NhdGlvbi5ob3N0LnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XG4gICAgICAgICAgICBsZXQgdXNDb25mID0ge1xuICAgICAgICAgICAgICAgIGVtYWlsQm94OiB0cnVlLFxuICAgICAgICAgICAgICAgIGVtYWlsQm94VmFsdWU6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICAgICAgZW1haWxSZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25zb2xlUmVjb3JkZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9kZTogJ3JlcG9ydCcsXG4gICAgICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgICAgICBHb29nbGUuc2VuZEV2ZW50KCdmZWVkYmFjaycsICd1c2Vyc25hcCcsICd3aWRnZXQnLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHdpbmRvdy51c2Vyc25hcGNvbmZpZyA9IHdpbmRvdy5fdXNlcnNuYXBjb25maWcgPSB1c0NvbmY7XG5cbiAgICAgICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICAgICAgcy5hc3luYyA9IHRydWU7XG4gICAgICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XG4gICAgICAgICAgICB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIHguYXBwZW5kQ2hpbGQocyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHdpbmRvdy5Vc2VyU25hcDtcbiAgICB9XG5cbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB0aGlzLnVzZXJTbmFwIHx8IHdpbmRvdy5Vc2VyU25hcDtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlclNuYXA7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIHNldFVzZXIoKSB7XG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcbiAgICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJTbmFwOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcblxuY2xhc3MgWmVuRGVzayBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgICAgICBsZXQgek8gPSB7fTtcbiAgICAgICAgd2luZG93LnpFbWJlZCB8fFxuICAgICAgICBmdW5jdGlvbiAoZSwgdCkge1xuICAgICAgICAgICAgbGV0IG4sIG8sIGQsIGksIHMsIGEgPSBbXSwgciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7IHdpbmRvdy56RW1iZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGFyZ3VtZW50cylcbiAgICAgICAgICAgIH0sIHdpbmRvdy56RSA9IHdpbmRvdy56RSB8fCB3aW5kb3cuekVtYmVkLCByLnNyYyA9IFwiamF2YXNjcmlwdDpmYWxzZVwiLCByLnRpdGxlID0gXCJcIiwgci5yb2xlID0gXCJwcmVzZW50YXRpb25cIiwgKHIuZnJhbWVFbGVtZW50IHx8IHIpLnN0eWxlLmNzc1RleHQgPSBcImRpc3BsYXk6IG5vbmVcIiwgZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpLCBkID0gZFtkLmxlbmd0aCAtIDFdLCBkLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHIsIGQpLCBpID0gci5jb250ZW50V2luZG93LCBzID0gaS5kb2N1bWVudDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbyA9IHNcbiAgICAgICAgICAgIH0gY2F0Y2ggKGMpIHtcbiAgICAgICAgICAgICAgICBuID0gZG9jdW1lbnQuZG9tYWluLCByLnNyYyA9ICdqYXZhc2NyaXB0OmxldCBkPWRvY3VtZW50Lm9wZW4oKTtkLmRvbWFpbj1cIicgKyBuICsgJ1wiO3ZvaWQoMCk7JywgbyA9IHNcbiAgICAgICAgICAgIH0gby5vcGVuKCkuX2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7IG4gJiYgKHRoaXMuZG9tYWluID0gbiksIG8uaWQgPSBcImpzLWlmcmFtZS1hc3luY1wiLCBvLnNyYyA9IGUsIHRoaXMudCA9ICtuZXcgRGF0ZSwgdGhpcy56ZW5kZXNrSG9zdCA9IHQsIHRoaXMuekVRdWV1ZSA9IGEsIHRoaXMuYm9keS5hcHBlbmRDaGlsZChvKVxuICAgICAgICAgICAgICAgIHpPLmxvZ2ljID0gd2luZG93LnpFO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG8ud3JpdGUoJzxib2R5IG9ubG9hZD1cImRvY3VtZW50Ll9sKCk7XCI+JyksXG4gICAgICAgICAgICBvLmNsb3NlKClcbiAgICAgICAgfVxuICAgICAgICAgICAgKFwiaHR0cHM6Ly9hc3NldHMuemVuZGVzay5jb20vZW1iZWRkYWJsZV9mcmFtZXdvcmsvbWFpbi5qc1wiLCBjb25maWcuc2l0ZSk7XG5cbiAgICAgICAgek8ud2lkZ2V0ID0gd2luZG93LnpFbWJlZDtcbiAgICAgICAgek8ubG9naWMgPSB3aW5kb3cuekU7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgc3VwZXIuaW5pdCgpXG4gICAgfVxuXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnpFO1xuICAgIH1cblxuICAgIHNldFVzZXIoKSB7XG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmludGVncmF0aW9uLmlkZW50aWZ5KHsgbmFtZTogdGhpcy51c2VyLmZ1bGxOYW1lLCBlbWFpbDogdGhpcy51c2VyLmVtYWlsIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuY29uc3QgemVuRGVzayA9IGZ1bmN0aW9uIChjb25maWcpIHtcblxuICAgIHJldHVybiB6Tztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWmVuRGVzazsiLCJjbGFzcyBJbnRlZ3JhdGlvbnNCYXNlIHtcblx0Y29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdFx0dGhpcy51c2VyID0gdXNlcjtcblx0fVxuXHRcblx0aW5pdCgpIHtcblx0XHRcblx0fVxuXHRcblx0Z2V0IGludGVncmF0aW9uKCkge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXHRcblx0c2V0VXNlcigpIHtcblx0XHRcblx0fVxuXHRcblx0c2VuZEV2ZW50KCkge1xuXHRcdFxuXHR9XG5cdFxuXHR1cGRhdGVQYXRoKCkge1xuXHRcdFxuXHR9XG5cdFxuXHRsb2dvdXQoKSB7XG5cdFx0XG5cdH1cblx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zQmFzZTsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXG5cbmNsYXNzIEdvb2dsZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XG4gICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xuICAgIH0pKCk7XG4gICAgICBcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcbiAgICAoZnVuY3Rpb24gKHcsIGQsIHMsIGwsIGkpIHtcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xuICAgICAgICAnZ3RtLnN0YXJ0JzpcbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xuICAgICAgfSk7IGxldCBmID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XG4gICAgICAgICcvL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndG0uanM/aWQ9JyArIGkgKyBkbDsgZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLCBmKTtcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJ2RhdGFMYXllcicsIHRoaXMuY29uZmlnLnRhZ21hbmFnZXIpO1xuXG4gICAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XG4gICAgICBpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXSA9IHI7IGlbcl0gPSBpW3JdIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xuICAgICAgfSwgaVtyXS5sID0gMSAqIG5ldyBEYXRlKCk7IGEgPSBzLmNyZWF0ZUVsZW1lbnQobyksXG4gICAgICBtID0gcy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTsgYS5hc3luYyA9IDE7IGEuc3JjID0gZztcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcblxuICB9XG5cbiAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcbiAgICByZXR1cm4gdGhpcy5nYTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgc3VwZXIuaW5pdCgpO1xuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xuICAgIGxldCBkb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcbiAgICBpZihkb21haW4uc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcbiAgICAgIG1vZGUgPSAnbm9uZSc7XG4gICAgfVxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ2NyZWF0ZScsIHRoaXMuY29uZmlnLmFuYWx5dGljcywgbW9kZSk7XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xuICB9XG5cbiAgc2V0VXNlcigpIHtcbiAgICBzdXBlci5zZXRVc2VyKCk7XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0JywgJ3VzZXJJZCcsIHRoaXMudXNlci51c2VySWQpO1xuICB9XG5cbiAgc3RhdGljIHNlbmRTb2NpYWwobmV0d29yaywgdGFyZ2V0VXJsLCB0eXBlID0gJ3NlbmQnKSB7XG4gICAgaWYgKHdpbmRvdy5nYSkge1xuICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsIG5ldHdvcmssIHR5cGUsIHRhcmdldFVybCk7XG4gICAgfVxuICB9XG5cbiAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XG4gICAgICBpZiAoc291cmNlICYmIHR5cGUpIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHZhbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVQYXRoKHBhdGgpIHtcbiAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsIHtcbiAgICAgICAgICAgIHBhZ2U6IHBhdGhcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2VuZEV2ZW50KGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCkge1xuICAgIGlmICh3aW5kb3cuZ2EpIHtcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCk7XG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGU7XG5cblxuIiwiY29uc3QgcmlvdCA9IHdpbmRvdy5yaW90XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzXG5jb25zdCBwYWdlQm9keSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZS1ib2R5LmpzJylcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxuY29uc3QgQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvQWN0aW9uLmpzJylcbmNvbnN0IE1ldHJvbmljID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvbWV0cm9uaWMnKVxuY29uc3QgTGF5b3V0ID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvbGF5b3V0JylcbmNvbnN0IERlbW8gPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9kZW1vJylcbmNvbnN0IFF1aWNrU2lkZWJhciA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL3F1aWNrLXNpZGViYXInKVxuXG5jbGFzcyBQYWdlRmFjdG9yeSB7XG4gICAgY29uc3RydWN0b3IoZXZlbnRlciwgbWV0YUZpcmUpIHtcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xuICAgICAgICB0aGlzLmFjdGlvbnMgPSBuZXcgQWN0aW9ucyhtZXRhRmlyZSwgZXZlbnRlciwgdGhpcyk7XG4gICAgICAgIHRoaXMub25SZWFkeSgpO1xuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuTUVUQV9QUk9HUkVTU31gKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KCcqJyk7XG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmNvbmZpZ3VyZSh7IHBhcmVudDogYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTX05FWFR9YCB9KTtcblxuICAgICAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0KCk7IC8vIGluaXQgbWV0cm9uaWMgY29yZSBjb21wb25ldHNcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmluaXQoKTsgLy8gaW5pdCBsYXlvdXRcbiAgICAgICAgICAgICAgICAgICAgRGVtby5pbml0KCk7IC8vIGluaXQgZGVtbyBmZWF0dXJlc1xuICAgICAgICAgICAgICAgICAgICBRdWlja1NpZGViYXIuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcbiAgICB9XG5cbiAgICBuYXZpZ2F0ZShwYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgbGV0IGFjdCA9IHRoaXMuYWN0aW9ucy5hY3QocGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcbiAgICAgICAgaWYgKCFhY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhwYXRoLCBwYXRoLCB7IGlkOiBpZCwgYWN0aW9uOiBhY3Rpb24gfSwgLi4ucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYWdlRmFjdG9yeTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IENhbnZhcyA9IHJlcXVpcmUoJy4uLy4uL2NhbnZhcy9jYW52YXMnKTtcbnJlcXVpcmUoJy4vbm9kZScpXG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodCBqdGstZGVtby1tYWluXCIgc3R5bGU9XCJwYWRkaW5nOiAwOyBcIj5cbiAgICA8ZGl2IGNsYXNzPVwianRrLWRlbW8tY2FudmFzIGNhbnZhcy13aWRlXCIgaWQ9XCJkaWFncmFtXCI+XG5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbWV0YS1jYW52YXMnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuXG4gICAgdGhpcy5tYXBJZCA9IG51bGw7XG4gICAgdGhpcy5jYW52YXMgPSBudWxsO1xuXG4gICAgdGhpcy5idWlsZENhbnZhcyA9IChtYXApID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmNhbnZhcykge1xuICAgICAgICAgICAgJCh0aGlzLmRpYWdyYW0pLmVtcHR5KCk7XG5cbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICQodGhpcy5kaWFncmFtKS53aWR0aCgpLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9ICAkKHRoaXMuZGlhZ3JhbSkuaGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIHZhciB4TG9jID0gd2lkdGgvMiAtIDI1LFxuICAgICAgICAgICAgICAgIHlMb2MgPSAxMDA7XG5cbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbmV3IENhbnZhcyhtYXAsIHRoaXMubWFwSWQpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXMuaW5pdCgpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtYXAuY2hhbmdlZF9ieSAhPSBNZXRhTWFwLlVzZXIudXNlcktleSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmluaXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGQgPSAob3B0cykgPT4ge1xuICAgICAgICBpZiAob3B0cy5pZCAhPSB0aGlzLm1hcElkKSB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG51bGxcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcElkKSB7XG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYG1hcHMvZGF0YS8ke3RoaXMubWFwSWR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1hcElkID0gb3B0cy5pZDtcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xuXG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGBtYXBzL2RhdGEvJHtvcHRzLmlkfWAsIHRoaXMuYnVpbGRDYW52YXMpO1xuICAgICAgICAgICAgTWV0YU1hcC5FdmVudGVyLmZvcmdldCgnbWFwJywgdGhpcy5idWlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNZXRhTWFwLkV2ZW50ZXIuZXZlcnkoJ21hcCcsIHRoaXMuYnVpbGQpO1xuXG4gICAgdGhpcy5jb3JyZWN0SGVpZ2h0ID0gKCkgPT4ge1xuICAgICAgICAkKHRoaXMuZGlhZ3JhbSkuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IC0gMTIwICsgJ3B4J1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY29ycmVjdEhlaWdodCgpO1xuICAgIH0pO1xuXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuY29ycmVjdEhlaWdodCgpO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJyk7XG5cblxuY29uc3QgaHRtbCA9IGBcbmBcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbm9kZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxuY29uc3QgUHMgPSByZXF1aXJlKCdwZXJmZWN0LXNjcm9sbGJhcicpO1xuXG5jb25zdCByYXcgPSByZXF1aXJlKCcuL3JhdycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jb25zdCBodG1sID1cblx0YFxuPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmF2LWp1c3RpZmllZFwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdi10YWJzIG5hdi1qdXN0aWZpZWRcIj5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJhY3RpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNxdWlja19zaWRlYmFyX3RhYl8xXCIgZGF0YS10b2dnbGU9XCJ0YWJcIj5cbiAgICAgICAgICAgICAgICAgICAgQ29ydGV4IE1hblxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjcXVpY2tfc2lkZWJhcl90YWJfMlwiIGRhdGEtdG9nZ2xlPVwidGFiXCI+XG4gICAgICAgICAgICAgICAgICAgIE91dGxpbmVcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1wYW5lIGFjdGl2ZSBwYWdlLXF1aWNrLXNpZGViYXItY2hhdCBwYWdlLXF1aWNrLXNpZGViYXItY29udGVudC1pdGVtLXNob3duXCIgaWQ9XCJxdWlja19zaWRlYmFyX3RhYl8xXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2Vyc1wiIGRhdGEtcmFpbC1jb2xvcj1cIiNkZGRcIiBkYXRhLXdyYXBwZXItY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyLW1lc3NhZ2VzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgbWVzc2FnZXMgfVwiIGNsYXNzPVwicG9zdCB7IG91dDogYXV0aG9yID09ICdjb3J0ZXgnLCBpbjogYXV0aG9yICE9ICdjb3J0ZXgnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgaGVpZ2h0PVwiMzlcIiB3aWR0aD1cIjM5XCIgY2xhc3M9XCJhdmF0YXJcIiBhbHQ9XCJcIiBzcmM9XCJ7IHBpY3R1cmUgfVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhcnJvd1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJuYW1lXCI+eyBuYW1lIH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkYXRldGltZVwiPnsgcGFyZW50LmdldFJlbGF0aXZlVGltZSh0aW1lKSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgbWVzc2FnZSB9XCI+PC9yYXc+IDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1mb3JtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiY2hhdF9pbnB1dF9mb3JtXCIgb25zdWJtaXQ9XCJ7IG9uU3VibWl0IH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNoYXRfaW5wdXRcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJUeXBlIGEgbWVzc2FnZSBoZXJlLi4uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBibHVlXCI+PGkgY2xhc3M9XCJmYSBmYS1wYXBlcmNsaXBcIj48L2k+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItcGFuZSBwYWdlLXF1aWNrLXNpZGViYXItYWxlcnRzXCIgaWQ9XCJxdWlja19zaWRlYmFyX3RhYl8yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItYWxlcnRzLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cImxpc3QtaGVhZGluZ1wiPkludHJvPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cImxpc3QtaGVhZGluZ1wiPlNlY3Rpb24gMTwvaDM+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gXG5cbnJpb3QudGFnKCdxdWljay1zaWRlYmFyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG5cdHRoaXMuY29ydGV4UGljdHVyZSA9ICdzcmMvaW1hZ2VzL2NvcnRleC1hdmF0YXItc21hbGwuanBnJztcblx0dGhpcy5tZXNzYWdlcyA9IFt7XG5cdFx0bWVzc2FnZTogYEhlbGxvLCBJJ20gQ29ydGV4IE1hbi4gQXNrIG1lIGFueXRoaW5nLiBUcnkgPGNvZGU+L2hlbHA8L2NvZGU+IGlmIHlvdSBnZXQgbG9zdC5gLFxuXHRcdGF1dGhvcjogJ2NvcnRleCcsXG5cdFx0cGljdHVyZTogdGhpcy5jb3J0ZXhQaWN0dXJlLFxuXHRcdHRpbWU6IG5ldyBEYXRlKClcblx0fV07XG5cblx0Y29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKTtcblxuXHR0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7fSk7XG5cblx0dGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG5cblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHR9KTtcblxuXHR0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XG5cdFx0aWYgKCF0aGlzLmRpc3BsYXkpIHtcblx0XHRcdHJldHVybiAnZGlzcGxheTogbm9uZTsnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5nZXRSZWxhdGl2ZVRpbWUgPSAoZGF0ZSA9IG5ldyBEYXRlKCkpID0+IHtcblx0XHRyZXR1cm4gbW9tZW50KGRhdGUpLmZyb21Ob3coKTtcblx0fVxuXG5cdHRoaXMub25TdWJtaXQgPSAob2JqKSA9PiB7XG5cdFx0dGhpcy5tZXNzYWdlcy5wdXNoKHtcblx0XHRcdG1lc3NhZ2U6IHRoaXMuY2hhdF9pbnB1dC52YWx1ZSxcblx0XHRcdGF1dGhvcjogTWV0YU1hcC5Vc2VyLnVzZXJOYW1lLFxuXHRcdFx0cGljdHVyZTogTWV0YU1hcC5Vc2VyLnBpY3R1cmUsXG5cdFx0XHR0aW1lOiBuZXcgRGF0ZSgpXG5cdFx0fSlcblx0XHR0aGlzLm1lc3NhZ2VzLnB1c2goe1xuXHRcdFx0bWVzc2FnZTogYFlvdSBhc2tlZCBtZSAke3RoaXMuY2hhdF9pbnB1dC52YWx1ZX0uIFRoYXQncyBncmVhdCFgLFxuXHRcdFx0YXV0aG9yOiAnY29ydGV4Jyxcblx0XHRcdHBpY3R1cmU6IHRoaXMuY29ydGV4UGljdHVyZSxcblx0XHRcdHRpbWU6IG5ldyBEYXRlKClcblx0XHR9KVxuXHRcdHRoaXMuY2hhdF9pbnB1dC52YWx1ZSA9ICcnXG5cdFx0dGhpcy51cGRhdGUoKTtcblx0XHR0aGlzLmNoYXRfYm9keS5zY3JvbGxUb3AgPSB0aGlzLmNoYXRfYm9keS5zY3JvbGxIZWlnaHRcblx0XHRQcy51cGRhdGUodGhpcy5jaGF0X2JvZHkpXG5cdH1cblxuXHR0aGlzLnRvZ2dsZSA9IChzdGF0ZSkgPT4ge1xuXHRcdHRoaXMuZGlzcGxheSA9IHN0YXRlO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdH1cblxufSk7XG4iLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdyYXcnLCAnPHNwYW4+PC9zcGFuPicsIGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gKG9wdHMpID8gKG9wdHMuY29udGVudCB8fCAnJykgOiAnJztcbiAgICB9O1xuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgndHlwZWFoZWFkLmpzJylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1zZWxlY3QnKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcbnJlcXVpcmUoJy4uLy4uL3Rvb2xzL3NoaW1zJyk7XG5jb25zdCBTaGFyaW5nID0gcmVxdWlyZSgnLi4vLi4vYXBwL1NoYXJpbmcnKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBpZD1cInNoYXJlX21vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxhIGlkPVwic2hhcmVfcHVibGljX2xpbmtcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImZsb2F0OiByaWdodDsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWNsaXBib2FyZC10ZXh0PVwie3dpbmRvdy5sb2NhdGlvbi5ob3N0KycvJyt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUrJy9tYXBzLycrb3B0cy5tYXAuaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgZ2V0UHVibGljTGluayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBHZXQgc2hhcmFibGUgbGluayAgPGkgY2xhc3M9XCJmYSBmYS1saW5rXCI+PC9pPjwvYT5cbiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPlNoYXJlIHdpdGggb3RoZXJzPC9oND5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICA8cD5QZW9wbGU8L3A+XG4gICAgICAgICAgICAgICAgPGZvcm0gcm9sZT1cImZvcm1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cInNoYXJlX3R5cGVhaGVhZFwiIGNsYXNzPVwiY29sLW1kLThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7XCIgaWQ9XCJzaGFyZV9pbnB1dFwiIGNsYXNzPVwidHlwZWFoZWFkIGZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJFbnRlciBuYW1lcyBvciBlbWFpbCBhZGRyZXNzZXMuLi5cIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNoYXJlX3Blcm1pc3Npb25cIiBjbGFzcz1cInNlbGVjdHBpY2tlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyZWFkXCIgZGF0YS1jb250ZW50PVwiPHNwYW4+PGkgY2xhc3M9J2ZhIGZhLWV5ZSc+PC9pPiBDYW4gdmlldzwvc3Bhbj5cIj5DYW4gdmlldzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3cml0ZVwiIGRhdGEtY29udGVudD1cIjxzcGFuPjxpIGNsYXNzPSdmYSBmYS1wZW5jaWwnPjwvaT4gQ2FuIGVkaXQ8L3NwYW4+XCI+Q2FuIGVkaXQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZD1cInNoYXJlX2J1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1pY29uLW9ubHkgZ3JlZW5cIiBvbmNsaWNrPVwieyBvblNoYXJlIH1cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZj1cInsgb3B0cyAmJiBvcHRzLm1hcCAmJiBvcHRzLm1hcC5zaGFyZWRfd2l0aH1cIiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibGFiZWwgbGFiZWwtZGVmYXVsdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiA1cHg7XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWY9XCJ7IGkgIT0gJ2FkbWluJyAmJiAodmFsLndyaXRlIHx8IHZhbC5yZWFkKSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgaSwgdmFsIGluIG9wdHMubWFwLnNoYXJlZF93aXRofVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBpZj1cInsgdmFsLndyaXRlIH1cIiBjbGFzcz1cImZhIGZhLXBlbmNpbFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgaWY9XCJ7ICF2YWwud3JpdGUgfVwiIGNsYXNzPVwiZmEgZmEtZXllXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWwubmFtZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZhIGZhLXRpbWVzLWNpcmNsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uVW5TaGFyZSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+RG9uZTwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdzaGFyZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpXG4gICAgY29uc3Qgc2hhcmUgPSBuZXcgU2hhcmluZyhNZXRhTWFwLlVzZXIpXG5cbiAgICB0aGlzLmRhdGEgPSBbXTtcblxuICAgIHRoaXMuZ2V0UHVibGljTGluayA9IChlLCBvcHRzKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgIH1cblxuICAgIHRoaXMub25TaGFyZSA9IChlLCBvcHRzKSA9PiB7XG4gICAgICAgIHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5zdWdnZXN0aW9uLmlkXSA9IHtcbiAgICAgICAgICAgIHJlYWQ6IHRoaXMucGlja2VyLnZhbCgpID09ICdyZWFkJyB8fCB0aGlzLnBpY2tlci52YWwoKSA9PSAnd3JpdGUnLFxuICAgICAgICAgICAgd3JpdGU6IHRoaXMucGlja2VyLnZhbCgpID09ICd3cml0ZScsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLnN1Z2dlc3Rpb24ubmFtZSxcbiAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMuc3VnZ2VzdGlvbi5waWN0dXJlXG4gICAgICAgIH1cbiAgICAgICAgc2hhcmUuYWRkU2hhcmUodGhpcy5vcHRzLm1hcCwgdGhpcy5zdWdnZXN0aW9uLCB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW3RoaXMuc3VnZ2VzdGlvbi5pZF0pXG5cbiAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gbnVsbFxuICAgICAgICB0aGlzLnRhLnR5cGVhaGVhZCgndmFsJywgJycpXG4gICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLmhpZGUoKVxuICAgIH1cblxuICAgIHRoaXMub25VblNoYXJlID0gKGUsIG9wdHMpID0+IHtcbiAgICAgICAgZS5pdGVtLnZhbC5pZCA9IGUuaXRlbS5pXG4gICAgICAgIGRlbGV0ZSB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW2UuaXRlbS5pXVxuICAgICAgICBzaGFyZS5yZW1vdmVTaGFyZSh0aGlzLm9wdHMubWFwLCBlLml0ZW0udmFsKVxuICAgIH1cblxuICAgIHRoaXMub24oJ3VwZGF0ZScsIChvcHRzKSA9PiB7XG4gICAgICAgIGlmIChvcHRzKSB7XG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLm9wdHMsIG9wdHMpO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub24oJ21vdW50JywgKGUsIG9wdHMpID0+IHtcbiAgICAgICAgJCh0aGlzLnNoYXJlX21vZGFsKS5tb2RhbCgnc2hvdycpXG4gICAgICAgIHRoaXMudGEgPSAkKCcjc2hhcmVfdHlwZWFoZWFkIC50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXG4gICAgICAgIH0se1xuICAgICAgICAgICAgc291cmNlOiAocXVlcnksIHN5bmNNZXRob2QsIGFzeW5jTWV0aG9kKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWV0YW1hcC5jby91c2Vycy9maW5kJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VySWQ6IE1ldGFNYXAuVXNlci51c2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uSWQ6IE1ldGFNYXAuTWV0YUZpcmUuZmlyZWJhc2VfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlZFVzZXJzOiBfLmtleXModGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IHF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJyonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6ICdzcmMvaW1hZ2VzL3dvcmxkLWdsb2JlLmpwZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1B1YmxpYydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luY01ldGhvZChkYXRhKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvciA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXNwbGF5OiAob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5uYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlczoge1xuICAgICAgICAgICAgICAgIGVtcHR5OiBbXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJwYWRkaW5nOiA1cHggMTBweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPicsXG4gICAgICAgICAgICAgICAgICAgICdVbmFibGUgdG8gZmluZCBhbnkgdXNlcnMgbWF0Y2hpbmcgdGhpcyBxdWVyeScsXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICAgICBdLmpvaW4oJ1xcbicpLFxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb246ICh2YWx1ZSkgPT4geyByZXR1cm4gYDxkaXY+PGltZyBhbHQ9XCIke3ZhbHVlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHt2YWx1ZS5waWN0dXJlfVwiPiAke3ZhbHVlLm5hbWV9PC9kaXY+YCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudGEub24oJ3R5cGVhaGVhZDpzZWxlY3QnLCAoZXYsIHN1Z2dlc3Rpb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbiA9IHN1Z2dlc3Rpb25cbiAgICAgICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLnNob3coKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRhLm9uKCd0eXBlYWhlYWQ6YXV0b2NvbXBsZXRlJywgKGV2LCBzdWdnZXN0aW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXG4gICAgICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5zaG93KClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5waWNrZXIgPSAkKCcuc2VsZWN0cGlja2VyJykuc2VsZWN0cGlja2VyKHtcbiAgICAgICAgICAgIHdpZHRoOiAnYXV0bydcbiAgICAgICAgfSlcbiAgICB9KVxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcblxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdyYWR1YXRpb24tY2FwXCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjcwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgaGVscCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGhlbHAgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyBsaW5rIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG5gO1xuXG5yaW90LnRhZygnbWV0YS1oZWxwJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5oZWxwID0gbnVsbDtcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9oZWxwJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGVscCA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5cbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxucmVxdWlyZSgnLi4vLi4vdG9vbHMvc2hpbXMnKVxuXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1iZWxsLW9cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2Utc3VjY2Vzc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyBub3RpZmljYXRpb25zLmxlbmd0aCB9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IG5vdGlmaWNhdGlvbnMubGVuZ3RoIH0gcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9ueyBzOiBub3RpZmljYXRpb25zLmxlbmd0aCA9PSAwIHx8IG5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWY9XCJ7IGFsbE5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPnZpZXcgYWxsPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyB0cnVlICE9IGFyY2hpdmVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyB2YWwsIGkgaW4gbm90aWZpY2F0aW9ucyB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGlmPVwieyB2YWwgJiYgdmFsLnBob3RvIH1cIiBjbGFzcz1cInBob3RvXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwieyB2YWwucGhvdG8gfVwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIGFsdD1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzdWJqZWN0XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZnJvbVwiPnsgdmFsLmZyb20gfTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJ0aW1lXCIgc3R5bGU9XCJwYWRkaW5nOiAwO1wiPnsgcGFyZW50LmdldFRpbWUodmFsLnRpbWUpIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1lc3NhZ2VcIj57IHZhbC5ldmVudCB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbmA7XG5cbnJpb3QudGFnKCdtZXRhLW5vdGlmaWNhdGlvbnMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICBjb25zdCBmYlBhdGggPSBDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KE1ldGFNYXAuVXNlci51c2VySWQpXG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgICB0aGlzLmFsbE5vdGlmaWNhdGlvbnMgPSBbXTtcblxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGxldCBpdGVtID0gZXZlbnQuaXRlbS52YWxcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHRydWUsIGAke2ZiUGF0aH0vJHtpdGVtLmlkfS9hcmNoaXZlYClcbiAgICAgICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLk5PVElGSUNBVElPTi5NQVA6XG4gICAgICAgICAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2l0ZW0ubWFwSWR9YCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRUaW1lID0gKHRpbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZSh0aW1lKSkuZnJvbU5vdygpXG4gICAgfVxuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0RGF0YShmYlBhdGgpXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnB1c2hEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiAnWW91IHNpZ25lZCB1cCBmb3IgTWV0YU1hcCEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKSB9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY2hpdmU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0sIGZiUGF0aClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KE1ldGFNYXAuVXNlci51c2VySWQpLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbE5vdGlmaWNhdGlvbnMgPSBfLm1hcChkYXRhLCAobiwgaWQpID0+IHsgbi5pZCA9IGlkOyByZXR1cm4gbjsgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBfLmZpbHRlcihfLnNvcnRCeSh0aGlzLmFsbE5vdGlmaWNhdGlvbnMsICdkYXRlJyksIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5cbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1zdWNjZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7IHBvaW50cy5sZW5ndGggfVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJib2xkXCI+eyBwb2ludHMubGVuZ3RoIH0gbmV3IDwvc3Bhbj4gYWNoaWV2ZW1lbnR7IHM6IHBvaW50cy5sZW5ndGggPT0gMCB8fCBwb2ludHMubGVuZ3RoID4gMSB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPnZpZXcgYWxsPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBwb2ludHMgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IHBvaW50cyB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVcIj57IHRpbWUgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGV0YWlsc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBldmVudCB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuYDtcblxucmlvdC50YWcoJ21ldGEtcG9pbnRzJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XG4gICAgdGhpcy5wb2ludHMgPSBbXTtcblxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgdXNlcnMvJHtNZXRhTWFwLlVzZXIudXNlcklkfS9wb2ludHNgLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5cbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVzZXJuYW1lIHVzZXJuYW1lLWhpZGUtb24tbW9iaWxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7IHVzZXJuYW1lIH1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGlmPVwieyBwaWN0dXJlIH1cIiBhbHQ9XCJcIiBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCJ7IHBpY3R1cmUgfVwiIC8+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1kZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgbWVudSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IG1lbnUgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyBsaW5rIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuYDtcblxucmlvdC50YWcoJ21ldGEtdXNlcicsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuXG4gICAgdGhpcy5tZW51ID0gW107XG4gICAgdGhpcy51c2VybmFtZSA9ICcnO1xuICAgIHRoaXMucGljdHVyZSA9ICcnO1xuXG4gICAgdGhpcy5sb2dvdXQgPSAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAubG9nb3V0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5saW5rQWNjb3VudCA9ICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5BdXRoMC5saW5rQWNjb3VudCgpO1xuICAgIH1cblxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIHN3aXRjaChldmVudC5pdGVtLmxpbmspIHtcbiAgICAgICAgICAgIGNhc2UgJyNsaW5rLXNvY2lhbC1hY2NvdW50cyc6XG4gICAgICAgICAgICAgICAgdGhpcy5saW5rQWNjb3VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGBtZXRhbWFwL3VzZXJgLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IE1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZTtcbiAgICAgICAgICAgIHRoaXMucGljdHVyZSA9IE1ldGFNYXAuVXNlci5waWN0dXJlO1xuICAgICAgICAgICAgdGhpcy5tZW51ID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcbnJlcXVpcmUoJy4uL3Rvb2xzL3NoaW1zJyk7XG5jb25zdCBQZXJtaXNzaW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9QZXJtaXNzaW9ucycpXG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biByZWQtaGF6ZSBidG4tc20gZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRkZW4tc20gaGlkZGVuLXhzXCI+QWN0aW9ucyZuYnNwOzwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhIH1cIiBjbGFzcz1cInsgc3RhcnQ6IGkgPT0gMCwgYWN0aXZlOiBpID09IDAgfVwiPlxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBwYXJlbnQuZ2V0TGlua0FsbG93ZWQodmFsKSB9XCIgaHJlZj1cInsgcGFyZW50LmdldEFjdGlvbkxpbmsodmFsKSB9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyB2YWwuaWNvbiB9XCI+PC9pPiB7IHZhbC50aXRsZSB9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxuICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjc2V0dGluZ3NcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1nZWFyXCI+PC9pPiBTZXR0aW5nc1xuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgPC9kaXY+XG5cbiAgICA8c3BhbiBzdHlsZT1cInBhZGRpbmctbGVmdDogNXB4O1wiPlxuICAgICAgICA8c3BhbiBpZj1cInsgcGFnZU5hbWUgfVwiXG4gICAgICAgICAgICAgICAgaWQ9XCJtYXBfbmFtZVwiXG4gICAgICAgICAgICAgICAgZGF0YS10eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgZGF0YS10aXRsZT1cIkVudGVyIG1hcCBuYW1lXCJcbiAgICAgICAgICAgICAgICBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+XG4gICAgICAgICAgICB7IHBhZ2VOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgIDwvc3Bhbj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1hY3Rpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnBhZ2VOYW1lID0gJ0hvbWUnO1xuICAgIHRoaXMudXJsID0gTWV0YU1hcC5jb25maWcuc2l0ZS5kYiArICcuZmlyZWJhc2Vpby5jb20nO1xuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG5cbiAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xuXG4gICAgdGhpcy5nZXRBY3Rpb25MaW5rID0gKG9iaikgPT4ge1xuICAgICAgICBsZXQgcmV0ID0gb2JqLmxpbms7XG4gICAgICAgIGlmIChvYmoudXJsX3BhcmFtcykge1xuICAgICAgICAgICAgbGV0IGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChvYmoudXJsX3BhcmFtcywgKHBybSkgPT4ge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzW3BybS5uYW1lXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldCA9IG9iai5saW5rLmZvcm1hdC5jYWxsKG9iai5saW5rLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHRoaXMuZ2V0TGlua0FsbG93ZWQgPSAob2JqKSA9PiB7XG4gICAgICAgIGxldCByZXQgPSB0cnVlID09IG9ialsnYWxsb3dlZC1vbiddWycqJ107XG4gICAgICAgIGlmICghcmV0KSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFBhZ2UgPSBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aDtcbiAgICAgICAgICAgIHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bY3VycmVudFBhZ2VdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXQgJiYgdGhpcy5tYXAgJiYgcGVybWlzc2lvbnMpIHtcbiAgICAgICAgICAgIHN3aXRjaCAob2JqLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU2hhcmUgTWFwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdEZWxldGUgTWFwJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGVybWlzc2lvbnMuaXNNYXBPd25lcigpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVQYWdlTmFtZSA9IChtYXApID0+IHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMobWFwKVxuICAgICAgICB0aGlzLm1hcCA9IG1hcCB8fCB7fVxuICAgICAgICBpZiAocGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbWFwLm5hbWUgfHwgJydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFnZU5hbWUgPSBtYXAubmFtZSArICcgKFNoYXJlZCBieSAnICsgbWFwLm93bmVyLm5hbWUgKyAnKSdcbiAgICAgICAgfVxuICAgICAgICBpZiAocGVybWlzc2lvbnMgJiYgcGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XG4gICAgICAgICAgICAkKHRoaXMubWFwX25hbWUpLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfS9uYW1lYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfVxuXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmxvYWRlZCkge1xuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSgnZGVzdHJveScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1hcElkKSB7XG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9mZihgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfWApO1xuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG51bGxcbiAgICAgICAgICAgIHRoaXMubWFwID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLm1hcElkID0gb3B0cy5pZDtcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7b3B0cy5pZH1gLCAobWFwKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlTmFtZShtYXApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2VOYW1lID0gb3B0cy5uYW1lIHx8ICdIb21lJztcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvYWN0aW9ucycsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IHBhZ2VIZWFkZXIgPSByZXF1aXJlKCcuL3BhZ2UtaGVhZGVyJyk7XG5jb25zdCBwYWdlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRhaW5lcicpO1xuY29uc3QgcGFnZUZvb3RlciA9IHJlcXVpcmUoJy4vcGFnZS1mb290ZXInKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJwYWdlX2JvZHlcIiBjbGFzcz1cInBhZ2UtaGVhZGVyLWZpeGVkIHBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiPlxuXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9oZWFkZXJcIj48L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250YWluZXJcIj48L2Rpdj5cblxuPC9kaXY+YDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1ib2R5JywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2hlYWRlciwgJ3BhZ2UtaGVhZGVyJyk7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfY29udGFpbmVyLCAncGFnZS1jb250YWluZXInKTtcbiAgICB9KTtcblxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UsICgpID0+IHtcbiAgICAgICAgLy8kKHRoaXMucGFnZV9ib2R5KS5hZGRDbGFzcygncGFnZS1zaWRlYmFyLXJldmVyc2VkJyk7XG4gICAgfSk7XG5cbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sICgpID0+IHtcbiAgICAgICAgLy8kKHRoaXMucGFnZV9ib2R5KS5yZW1vdmVDbGFzcygncGFnZS1zaWRlYmFyLXJldmVyc2VkJyk7XG4gICAgfSk7XG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBwYWdlU2lkZWJhciA9IHJlcXVpcmUoJy4vcGFnZS1zaWRlYmFyJyk7XG5jb25zdCBwYWdlQ29udGVudCA9IHJlcXVpcmUoJy4vcGFnZS1jb250ZW50Jyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicGFnZS1jb250YWluZXJcIj5cblxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfY29udGVudFwiPjwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvbnRhaW5lcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250ZW50LCAncGFnZS1jb250ZW50Jyk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL3F1aWNrLXNpZGViYXInKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBhZ2UtY29udGVudC13cmFwcGVyXCI+XG4gICAgPGRpdiBpZD1cInBhZ2UtY29udGVudFwiIGNsYXNzPVwicGFnZS1jb250ZW50XCI+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtaGVhZFwiPjwvZGl2PlxuXG4gICAgICAgIDxkaXYgaWQ9XCJhcHAtY29udGFpbmVyXCI+PC9kaXY+XG5cbiAgICAgICAgPGRpdiBpZD1cInF1aWNrX3NpZGViYXJfY29udGFpbmVyXCI+PC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY29udGVudCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5xdWlja19zaWRlYmFyX2NvbnRhaW5lciwgJ3F1aWNrLXNpZGViYXInKVxuICAgICAgICB0aGlzLnJlc2l6ZSgpXG4gICAgfSlcblxuICAgIHRoaXMucmVzaXplID0gKCkgPT4ge1xuICAgICAgICBsZXQgd2lkdGggPSBgJHt3aW5kb3cuaW5uZXJXaWR0aCAtIDQwfXB4YDtcbiAgICAgICAgJCh0aGlzWydhcHAtY29udGFpbmVyJ10pLmNzcyh7IHdpZHRoOiB3aWR0aCB9KTtcbiAgICB9XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5yZXNpemUoKVxuICAgIH0pO1xuXG5cblxuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBhZ2UtZm9vdGVyXCIgc3R5bGU9XCJwb3NpdGlvbjogZml4ZWQ7IGJvdHRvbTogMDtcIj5cbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1mb290ZXItaW5uZXJcIj5cbiAgICAgICAgPGEgaHJlZj1cIiN0ZXJtc1wiPiZjb3B5OzIwMTU8L2E+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBwYWdlTG9nbyA9IHJlcXVpcmUoJy4vcGFnZS1sb2dvLmpzJyk7XG5jb25zdCBwYWdlQWN0aW9ucyA9IHJlcXVpcmUoJy4vcGFnZS1hY3Rpb25zLmpzJyk7XG5jb25zdCBwYWdlU2VhcmNoID0gcmVxdWlyZSgnLi9wYWdlLXNlYXJjaC5qcycpO1xuY29uc3QgcGFnZVRvcE1lbnUgPSByZXF1aXJlKCcuL3BhZ2UtdG9wbWVudScpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBpZD1cImhlYWRlci10b3BcIiBjbGFzcz1cInBhZ2UtaGVhZGVyIG5hdmJhciBuYXZiYXItZml4ZWQtdG9wXCI+XG4gICAgPGRpdiBpZD1cIm1ldGFfcHJvZ3Jlc3NfbmV4dFwiIHN0eWxlPVwib3ZlcmZsb3c6IGluaGVyaXQ7XCI+PC9kaXY+XG4gICAgPGRpdiBpZD1cImhlYWRlci1jb250ZW50XCIgY2xhc3M9XCJwYWdlLWhlYWRlci1pbm5lclwiPlxuXG4gICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfbG9nb1wiPjwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9hY3Rpb25zXCI+PC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcFwiIGNsYXNzPVwicGFnZS10b3BcIj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2Vfc2VhcmNoXCI+PC9kaXY+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfdG9wbWVudVwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgIDwvZGl2PlxuXG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtaGVhZGVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2xvZ28sICdwYWdlLWxvZ28nKTtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9hY3Rpb25zLCAncGFnZS1hY3Rpb25zJyk7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfdG9wLCAncGFnZS1zZWFyY2gnKTtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV90b3AsICdwYWdlLXRvcG1lbnUnKTtcbiAgICB9KTtcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3MgPVwicGFnZS1sb2dvXCI+XG4gICAgPGEgaWQ9XCJtZXRhX2xvZ29cIiBocmVmPVwiI2hvbWVcIj5cbiAgICAgICAgPGltZyBzcmM9XCJzcmMvaW1hZ2VzL21ldGFtYXBfY2xvdWQucG5nXCIgYWx0PVwibG9nb1wiIGNsYXNzID1cImxvZ28tZGVmYXVsdFwiIC8+XG4gICAgPC9hPlxuICAgIFxuICAgIDxkaXYgaWQ9XCJtZXRhX21lbnVfdG9nZ2xlXCIgY2xhc3M9XCJtZW51LXRvZ2dsZXIgc2lkZWJhci10b2dnbGVyIHF1aWNrLXNpZGViYXItdG9nZ2xlclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiIHN0eWxlPVwidmlzaWJpbGl0eTp7IGdldERpc3BsYXkoKSB9O1wiPlxuICAgICAgICA8IS0tRE9DOiBSZW1vdmUgdGhlIGFib3ZlIFwiaGlkZVwiIHRvIGVuYWJsZSB0aGUgc2lkZWJhciB0b2dnbGVyIGJ1dHRvbiBvbiBoZWFkZXItLT5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzID1cIm1lbnUtdG9nZ2xlciByZXNwb25zaXZlLXRvZ2dsZXJcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+XG48L2E+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWxvZ28nLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5vbkNsaWNrID0gKCkgPT4ge1xuICAgICAgIC8vIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldERpc3BsYXkgPSAoZWwpID0+IHtcblxuICAgICAgICBpZihNZXRhTWFwICYmIE1ldGFNYXAuUm91dGVyICYmIE1ldGFNYXAuUm91dGVyLmN1cnJlbnRQYXRoID09ICdtYXAnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3Zpc2libGUnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hpZGRlbidcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgncGFnZU5hbWUnLCAob3B0cykgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfSlcblxuLy9cbi8vICAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XG4vLyAgICAgICAgIHRoaXMuZGlzcGxheSA9IGZhbHNlO1xuLy8gICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuLy8gICAgIH0pO1xuLy9cbi8vXG4vLyAgICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XG4vLyAgICAgICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XG4vLyAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4vLyAgICAgfSk7XG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48IS0tIERPQzogQXBwbHkgXCJzZWFyY2gtZm9ybS1leHBhbmRlZFwiIHJpZ2h0IGFmdGVyIHRoZSBcInNlYXJjaC1mb3JtXCIgY2xhc3MgdG8gaGF2ZSBoYWxmIGV4cGFuZGVkIHNlYXJjaCBib3ggLS0+XG48Zm9ybSBjbGFzcz1cInNlYXJjaC1mb3JtXCIgYWN0aW9uPVwiZXh0cmFfc2VhcmNoLmh0bWxcIiBtZXRob2Q9XCJHRVRcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIiBwbGFjZWhvbGRlcj1cIlNlYXJjaC4uLlwiIG5hbWU9XCJxdWVyeVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJidG4gc3VibWl0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCI+PC9pPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG48L2Zvcm0+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXNlYXJjaCcsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICBcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyLXdyYXBwZXJcIiBzdHlsZT1cInsgZ2V0RGlzcGxheSgpIH1cIj5cbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyIG5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPlxuICAgICAgICA8dWwgY2xhc3M9XCJwYWdlLXNpZGViYXItbWVudSBcIiBkYXRhLWtlZXAtZXhwYW5kZWQ9XCJmYWxzZVwiIGRhdGEtYXV0by1zY3JvbGw9XCJ0cnVlXCIgZGF0YS1zbGlkZS1zcGVlZD1cIjIwMFwiPlxuXG4gICAgICAgICAgICA8bGkgaWY9XCJ7IGRhdGEgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5jbGljayB9XCIgZWFjaD1cInsgZGF0YSB9XCI+XG4gICAgICAgICAgICAgICAgPGEgaWY9XCJ7IGljb24gfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiIHN0eWxlPVwiY29sb3I6I3sgY29sb3IgfTtcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwieyBhcnJvdzogbWVudS5sZW5ndGggfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPHVsIGlmPVwieyBtZW51ICYmIG1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cInN1Yi1tZW51XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBlYWNoPVwieyBtZW51IH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbGk+XG5cbiAgICAgICAgPC91bD5cblxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXNpZGViYXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5jbGljayA9IGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZygnZm9vJykgfVxuICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XG4gICAgdGhpcy5kYXRhID0gW107XG5cbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL3NpZGViYXInLCAoZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICBpZiAoaW5jbHVkZSAmJiBkLm1lbnUgJiYgZC5tZW51KSB7XG4gICAgICAgICAgICAgICAgZC5tZW51ID0gXy5maWx0ZXIoXy5zb3J0QnkoZC5tZW51LCAnb3JkZXInKSwgKG0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0uYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuZ2V0RGlzcGxheSA9ICgpID0+IHtcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xuICAgICAgICAgICAgcmV0dXJuICdkaXNwbGF5OiBub25lOyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcbiAgICBcbiAgICBcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5cbmNvbnN0IG1ldGFQb2ludHMgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1wb2ludHMuanMnKTtcbmNvbnN0IG1ldGFIZWxwID0gcmVxdWlyZSgnLi9tZW51L21ldGEtaGVscC5qcycpO1xuY29uc3QgbWV0YVVzZXIgPSByZXF1aXJlKCcuL21lbnUvbWV0YS11c2VyLmpzJyk7XG5jb25zdCBtZXRhTm90ID0gcmVxdWlyZSgnLi9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcycpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgcHVsbC1yaWdodFwiPlxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfZGFzaGJvYXJkX2JhclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBocmVmPVwiI2hvbWVcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWhvbWVcIj48L2k+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvbGk+XG5cbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIiBpZD1cImhlYWRlcl9ub3RpZmljYXRpb25fYmFyXCI+PC9saT5cblxuYFxuICAgICAgICAgICAgLy8gPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxuICAgICAgICAgICAgLy8gPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfcG9pbnRzX2JhclwiPjwvbGk+XG4rIGBcblxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl9oZWxwX2JhclwiIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCI+PC9saT5cblxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl91c2VyX21lbnVcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLXVzZXIgZHJvcGRvd25cIj48L2xpPlxuICAgIDwvdWw+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtdG9wbWVudScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIC8vVE9ETzogcmVzdG9yZSBub3RpZmljYXRpb25zIHdoZW4gbG9naWMgaXMgY29tcGxldGVcbiAgICAgICAgLy9yaW90Lm1vdW50KHRoaXMuaGVhZGVyX3BvaW50c19iYXIsICdtZXRhLXBvaW50cycpO1xuICAgICAgICByaW90Lm1vdW50KHRoaXMuaGVhZGVyX25vdGlmaWNhdGlvbl9iYXIsICdtZXRhLW5vdGlmaWNhdGlvbnMnKTtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9oZWxwX2JhciwgJ21ldGEtaGVscCcpO1xuICAgICAgICByaW90Lm1vdW50KHRoaXMuaGVhZGVyX3VzZXJfbWVudSwgJ21ldGEtdXNlcicpO1xuICAgIH0pO1xuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93IG1hcmdpbi1ib3R0b20tMzBcIj5cblx0XHRcdFx0XHRcdDxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb2wtbWQtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT57IGhlYWRlci50aXRsZSB9PC9oMT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IGhlYWRlci50ZXh0IH08L3A+XG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGFyZWFzIH1cIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxiPnsgdGl0bGUgfTwvYj4geyB0ZXh0IH1cblx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdFx0XHQ8IS0tIEJsb2NrcXVvdGVzIC0tPlxuXHRcdFx0XHRcdFx0XHQ8YmxvY2txdW90ZSBjbGFzcz1cImhlcm9cIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD57IHF1b3RlLnRleHQgfTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8c21hbGw+eyBxdW90ZS5ieSB9PC9zbWFsbD5cblx0XHRcdFx0XHRcdFx0PC9ibG9ja3F1b3RlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZGR0aGlzX2hvcml6b250YWxfZm9sbG93X3Rvb2xib3hcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcyA9XCJjb2wtbWQtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIGlmPVwieyBoZWFkZXIueW91dHViZWlkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cInl0cGxheWVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHQvaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgaGVhZGVyLnlvdXR1YmVpZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzID1cImZpdHZpZHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImhlaWdodDogMzI3cHg7IHdpZHRoOiAxMDAlOyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bzsgYnJvZGVyOiAwO1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cblx0XHRcdFx0XHRcdFx0PC9pZnJhbWU+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRsaW5lXCI+XG5cdFx0XHRcdFx0XHQ8aDM+eyB1c2VyTmFtZSB9eyB2aXNpb24udGl0bGUgfTwvaDM+XG5cdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57IHZpc2lvbi50ZXh0IH08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnaG9tZScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLmFyZWFzID0gW11cbiAgICB0aGlzLmhlYWRlciA9IHt9XG5cbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuSE9NRSwgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuYXJlYXMsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5xdW90ZSA9IGRhdGEucXVvdGU7XG4gICAgICAgIHRoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIHRoaXMudmlzaW9uID0gZGF0YS52aXNpb247XG5cbiAgICAgICAgdGhpcy51c2VyTmFtZSA9IE1ldGFNYXAuVXNlci5mdWxsTmFtZTtcblxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5yZXF1aXJlKCdkYXRhdGFibGVzJylcbnJlcXVpcmUoJ2RhdGF0YWJsZXMtYm9vdHN0cmFwMy1wbHVnaW4nKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCByYXcgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL3JhdycpO1xuY29uc3QgU2hhcmVNYXAgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL1NoYXJlTWFwJylcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJteV9tYXBzX3BhZ2VcIiBjbGFzcz1cInBvcnRsZXQgYm94IGdyZXktY2FzY2FkZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LXRpdGxlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tdGgtbGFyZ2VcIj48L2k+TWV0YU1hcHNcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWY9XCJ7IG1lbnUgfVwiIGNsYXNzPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgPGEgZWFjaD1cInsgbWVudS5idXR0b25zIH1cIiBocmVmPVwieyBsaW5rIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25BY3Rpb25DbGljayB9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jb2dzXCI+PC9pPiBUb29scyA8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgZWFjaD1cInsgbWVudS5tZW51IH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25NZW51Q2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicG9ydGxldC1ib2R5XCI+XG4gICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBwb3J0bGV0LXRhYnNcIj5cbiAgICAgICAgICAgIDxsaSBvbmNsaWNrPVwieyBwYXJlbnQub25UYWJTd2l0Y2ggfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInsgYWN0aXZlOiBpID09IDAgfVwiPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjbXltYXBzXzFfeyBpIH1cIiBkYXRhLXRvZ2dsZT1cInRhYlwiIGFyaWEtZXhwYW5kZWQ9XCJ7IHRydWU6IGkgPT0gMCB9XCI+XG4gICAgICAgICAgICAgICAgeyB2YWwudGl0bGUgfTwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS10b29sYmFyXCI+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ0YWItcGFuZSBmYXNlIGluIHsgYWN0aXZlOiBpID09IDAgfVwiIGlkPVwibXltYXBzXzFfeyBpIH1cIj5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWhvdmVyXCIgaWQ9XCJteW1hcHNfdGFibGVfeyBpIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInRhYmxlLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJncm91cC1jaGVja2FibGVcIiBkYXRhLXNldD1cIiNteW1hcHNfdGFibGVfeyBpIH0gLmNoZWNrYm94ZXNcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZWQgT25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPd25lclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgaWY9XCJ7IHBhcmVudC5kYXRhICYmIHBhcmVudC5kYXRhW2ldIH1cIiBlYWNoPVwieyBwYXJlbnQuZGF0YVtpXSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfHwgcGFyZW50LnVzZXIuaXNBZG1pbiB9XCIgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjaGVja2JveGVzXCIgdmFsdWU9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zbSBibHVlIGZpbHRlci1zdWJtaXRcIiBvbmNsaWNrPVwieyBwYXJlbnQub25PcGVuIH1cIj5PcGVuPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIH1cIiBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uU2hhcmUgfVwiPlNoYXJlIDxpIGNsYXNzPVwiZmEgZmEtc2hhcmVcIj48L2k+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZj1cInsgdmFsLnRpdGxlICE9ICdNeSBNYXBzJyB9XCIgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNvcHkgfVwiPkNvcHkgPGkgY2xhc3M9XCJmYSBmYS1jbG9uZVwiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IGVkaXRhYmxlIH1cIiBjbGFzcz1cIm1ldGFfZWRpdGFibGVfeyBpIH1cIiBkYXRhLXBrPVwieyBpZCB9XCIgZGF0YS10aXRsZT1cIkVkaXQgTWFwIE5hbWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgIWVkaXRhYmxlIH1cIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBjcmVhdGVkX2F0IH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgcGFyZW50LmdldFN0YXR1cyh0aGlzKSB9XCI+PC9yYXc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IHBhcmVudC5nZXRPd25lcih0aGlzKSB9XCI+PC9yYXc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbXktbWFwcycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuXG4gICAgdGhpcy51c2VyID0gTWV0YU1hcC5Vc2VyO1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gICAgdGhpcy5tZW51ID0gbnVsbDtcbiAgICBsZXQgdGFicyA9IFtcbiAgICAgICAgeyB0aXRsZTogJ015IE1hcHMnLCBvcmRlcjogMCwgZWRpdGFibGU6IHRydWUgfSxcbiAgICAgICAgeyB0aXRsZTogJ1NoYXJlZCB3aXRoIE1lJywgb3JkZXI6IDEsIGVkaXRhYmxlOiBmYWxzZSB9LFxuICAgICAgICB7IHRpdGxlOiAnUHVibGljJywgb3JkZXI6IDIsIGVkaXRhYmxlOiBmYWxzZSB9XG4gICAgXTtcbiAgICBpZiAodGhpcy51c2VyLmlzQWRtaW4pIHtcbiAgICAgICAgdGFicy5wdXNoKHsgdGl0bGU6ICdBbGwgTWFwcycsIG9yZGVyOiAzLCBlZGl0YWJsZTogdHJ1ZSB9KVxuICAgICAgICB0YWJzLnB1c2goeyB0aXRsZTogJ1RlbXBsYXRlcycsIG9yZGVyOiA0LCBlZGl0YWJsZTogdHJ1ZSB9KVxuICAgIH1cbiAgICB0aGlzLnRhYnMgPSBfLnNvcnRCeSh0YWJzLCAnb3JkZXInKVxuXG4gICAgdGhpcy5jdXJyZW50VGFiID0gJ015IE1hcHMnO1xuXG4gICAgLy9cbiAgICB0aGlzLmdldFN0YXR1cyA9IChpdGVtKSA9PiB7XG4gICAgICAgIGxldCBzdGF0dXMgPSAnUHJpdmF0ZSdcbiAgICAgICAgbGV0IGNvZGUgPSAnZGVmYXVsdCdcbiAgICAgICAgbGV0IGh0bWwgPSAnJztcbiAgICAgICAgaWYgKGl0ZW0uc2hhcmVkX3dpdGgpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLnNoYXJlZF93aXRoWycqJ10gJiYgKGl0ZW0uc2hhcmVkX3dpdGhbJyonXS5yZWFkID09IHRydWUgfHwgaXRlbS5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ1B1YmxpYydcbiAgICAgICAgICAgICAgICBjb2RlID0gJ3ByaW1hcnknXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8uZWFjaChpdGVtLnNoYXJlZF93aXRoLCAoc2hhcmUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2hhcmUucGljdHVyZSAmJiBrZXkgIT0gJyonICYmIGtleSAhPSAnYWRtaW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cImxhYmVsIG93bmVyLWxhYmVsXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1wbGFjZW1lbnQ9XCJib3R0b21cIiB0aXRsZT1cIiR7c2hhcmUubmFtZX1cIj48aW1nIGFsdD1cIiR7c2hhcmUubmFtZX1cIiBoZWlnaHQ9XCIzMFwiIHdpZHRoPVwiMzBcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCIke3NoYXJlLnBpY3R1cmV9XCI+PC9zcGFuPmBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9ICc8c3BhbiBjbGFzcz1cIlwiPlNoYXJlZCB3aXRoOiA8L3NwYW4+JyArIGh0bWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGh0bWwgPSBodG1sIHx8IGA8c3BhbiBjbGFzcz1cImxhYmVsIGxhYmVsLXNtIGxhYmVsLSR7Y29kZX1cIj4ke3N0YXR1c308L3NwYW4+YFxuXG4gICAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0T3duZXIgPSAoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgaHRtbCA9IGA8c3BhbiBjbGFzcz1cImxhYmVsIG93bmVyLWxhYmVsXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1wbGFjZW1lbnQ9XCJib3R0b21cIiB0aXRsZT1cIiR7aXRlbS5vd25lci5uYW1lfVwiPjxpbWcgYWx0PVwiJHtpdGVtLm93bmVyLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtpdGVtLm93bmVyLnBpY3R1cmV9XCI+PC9zcGFuPmBcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLy9FdmVudHNcbiAgICB0aGlzLm9uT3BlbiA9IChldmVudCwgLi4ubykgPT4ge1xuICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgbWFwLyR7ZXZlbnQuaXRlbS5pZH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uU2hhcmUgPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgbGV0IG9wdHMgPSB7XG4gICAgICAgICAgICBtYXA6IGV2ZW50Lml0ZW1cbiAgICAgICAgfVxuICAgICAgICBTaGFyZU1hcC5hY3Qob3B0cyk7XG4gICAgfVxuXG4gICAgdGhpcy5vbkNvcHkgPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvcHknKVxuICAgIH1cblxuICAgIHRoaXMub25UYWJTd2l0Y2ggPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGFiID0gZXZlbnQuaXRlbS52YWwudGl0bGU7XG4gICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICQoJy5vd25lci1sYWJlbCcpLnRvb2x0aXAoKVxuICAgICAgICB9LCAyNTApO1xuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VycmVudFRhYikge1xuICAgICAgICAgICAgY2FzZSAnTXkgTWFwcyc6XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub25BY3Rpb25DbGljayA9IChldmVudCwgdGFnKSA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMub25NZW51Q2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50VGFiID09ICdNeSBNYXBzJykge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5pdGVtLnRpdGxlLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVNYXBzID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9EZWxldGVNYXAuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpc1tgdGFibGUwYF0uZmluZCgnLmFjdGl2ZScpLmZpbmQoJy5tYXBpZCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaWRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChzZWxlY3RlZCwgKGNlbGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5wdXNoKGNlbGwuaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZU1hcHMuZGVsZXRlQWxsKGlkcywgQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmluZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJ3Rib2R5IHRyIC5jaGVja2JveGVzJyk7XG4gICAgICAgICAgICAgICAgICAgIGZpbmQuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5LnVuaWZvcm0udXBkYXRlKGZpbmQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcblxuICAgIH0pXG5cbiAgICAvL1Jpb3QgYmluZGluZ3NcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgTlByb2dyZXNzLnN0YXJ0KCk7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvbXltYXBzJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZW51ID0ge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBfLnNvcnRCeShkYXRhLmJ1dHRvbnMsICdvcmRlcicpLFxuICAgICAgICAgICAgICAgICAgICBtZW51OiBfLnNvcnRCeShkYXRhLm1lbnUsICdvcmRlcicpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBidWlsZFRhYmxlID0gKGlkeCwgbGlzdCwgZWRpdGFibGUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpZHhdID0gbGlzdDtcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tgdGFibGUke2lkeH1gXSkge1xuICAgICAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSgnZGVzdHJveScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0gPSAkKHRoaXNbYG15bWFwc190YWJsZV8ke2lkeH1gXSk7XG4gICAgICAgICAgICAgICAgdGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0gPSB0aGlzW2B0YWJsZSR7aWR4fWBdLkRhdGFUYWJsZSh7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgdXNlcyBzY3JvbGxhYmxlIGRpdih0YWJsZS1zY3JvbGxhYmxlKSB3aXRoIG92ZXJmbG93OmF1dG8gdG8gZW5hYmxlIHZlcnRpY2FsIHNjcm9sbChzZWU6IGFzc2V0cy9nbG9iYWwvcGx1Z2lucy9kYXRhdGFibGVzL3BsdWdpbnMvYm9vdHN0cmFwL2RhdGFUYWJsZXMuYm9vdHN0cmFwLmpzKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gU28gd2hlbiBkcm9wZG93bnMgdXNlZCB0aGUgc2Nyb2xsYWJsZSBkaXYgc2hvdWxkIGJlIHJlbW92ZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxuICAgICAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXG4gICAgICAgICAgICAgICAgICAgICdjb2x1bW5zJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdDaGNrQngnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTIwcHgnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ05hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdDcmVhdGVkIE9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU3RhdHVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL3RoaXNbYHRhYmxlJHtpZHh9YF1Ub29scyA9IG5ldyAkLmZuLmRhdGFUYWJsZS5UYWJsZVRvb2xzKHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLCB7fSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGFibGVXcmFwcGVyID0gdGhpc1tgdGFibGUke2lkeH1gXS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAjbXltYXBzXyR7aWR4fV90YWJsZV93cmFwcGVyYCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdLmZpbmQoJy5ncm91cC1jaGVja2FibGUnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2V0ID0galF1ZXJ5KHRoaXMpLmF0dHIoJ2RhdGEtc2V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VkID0galF1ZXJ5KHRoaXMpLmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoc2V0KS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkudW5pZm9ybS51cGRhdGUoc2V0KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0ub24oJ2NoYW5nZScsICd0Ym9keSB0ciAuY2hlY2tib3hlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRhYmxlV3JhcHBlci5maW5kKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0JykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCBpbnB1dC14c21hbGwgaW5wdXQtaW5saW5lJyk7IC8vIG1vZGlmeSB0YWJsZSBwZXIgcGFnZSBkcm9wZG93blxuXG4gICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoeyB1bnNhdmVkY2xhc3M6IG51bGwgfSkub24oJ3NhdmUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xuICAgICAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7aWR9L25hbWVgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgICAgICAgICAgICAgIE1ldGFNYXAuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9GZXRjaCBBbGwgbWFwc1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldENoaWxkKENPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUKS5vbigndmFsdWUnLCAodmFsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gdmFsLnZhbCgpO1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMudGFicywgKHRhYikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtYXBzID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhYi50aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdUZW1wbGF0ZXMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNeSBNYXBzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCA9PSBNZXRhTWFwLlVzZXIudXNlcklkKSB7IC8vT25seSBpbmNsdWRlIG15IG93biBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdTaGFyZWQgd2l0aCBNZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgIT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCAmJiAvL0Rvbid0IGluY2x1ZGUgbXkgb3duIG1hcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoICYmIC8vRXhjbHVkZSBhbnl0aGluZyB0aGF0IGlzbid0IHNoYXJlZCBhdCBhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFvYmouc2hhcmVkX3dpdGhbJyonXSB8fCAob2JqLnNoYXJlZF93aXRoWycqJ10ucmVhZCAhPSB0cnVlIHx8IG9iai5zaGFyZWRfd2l0aFsnKiddLndyaXRlICE9IHRydWUpKSAmJiAvL0V4Y2x1ZGUgcHVibGljIG1hcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdICYmIC8vSW5jbHVkZSBzaGFyZXMgd2loIG15IHVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUgfHwgLy9JbmNsdWRlIGFueXRoaW5nIEkgY2FuIHdyaXRlIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXS5yZWFkID09IHRydWUpIC8vSW5jbHVkZSBhbnl0aGluZyBJIGNhbiByZWFkIGZyb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IChvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdQdWJsaWMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aCAmJiAvL0V4Y2x1ZGUgYW55dGhpbmcgdGhhdCBpc24ndCBzaGFyZWQgYXQgYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmouc2hhcmVkX3dpdGhbJyonXSAmJiAob2JqLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlIHx8IG9iai5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpICkgLy9JbmNsdWRlIHB1YmxpYyBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSAob2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdBbGwgTWFwcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VyLmlzQWRtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTGlrZSBpdCBzYXlzLCBhbGwgbWFwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWFwcykge1xuICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5maWx0ZXIobWFwcywgKG1hcCkgPT4geyByZXR1cm4gbWFwICYmIG1hcC5pZCB9KVxuICAgICAgICAgICAgICAgICAgICBidWlsZFRhYmxlKHRhYi5vcmRlciwgbWFwcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoJy5vd25lci1sYWJlbCcpLnRvb2x0aXAoKVxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBvcnRsZXQgbGlnaHRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxuXHRcdFx0XHRcdFx0PGRpdiBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT57IGhlYWRlci50aXRsZSB9PC9oMT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IGhlYWRlci50ZXh0IH08L3A+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBlYWNoPVwieyBhcmVhcyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGxpbmVcIj5cbiAgICBcdFx0XHRcdFx0XHQ8aDM+eyB0aXRsZSB9PC9oMz5cbiAgICBcdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgdGV4dCB9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxuXHRcdFx0XHRcdFx0XHQ8bGkgZWFjaD1cInsgaXRlbXMgfVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxiPnsgdGl0bGUgfTwvYj4geyB0ZXh0IH1cblx0XHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdDwvdWw+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygndGVybXMnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuICAgIFxuICAgIHRoaXMuYXJlYXMgPSBbXVxuICAgIHRoaXMuaGVhZGVyID0ge31cblxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5URVJNU19BTkRfQ09ORElUSU9OUywgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuc2VjdGlvbnMsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgbGV0IGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgIGlmKGluY2x1ZGUpIHtcbiAgICAgICAgICAgICAgICBkLml0ZW1zID0gXy5maWx0ZXIoXy5zb3J0QnkoZC5pdGVtcywgJ29yZGVyJyksIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmNsdWRlMiA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICB0aGlzLnVzZXJOYW1lID0gTWV0YU1hcC5Vc2VyLmZ1bGxOYW1lO1xuICAgICAgICBcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XG4gICAgfSk7XG59KTsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jylcbi8qKlxuRGVtbyBzY3JpcHQgdG8gaGFuZGxlIHRoZSB0aGVtZSBkZW1vXG4qKi9cbnZhciBEZW1vID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gSGFuZGxlIFRoZW1lIFNldHRpbmdzXG4gICAgdmFyIGhhbmRsZVRoZW1lID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBwYW5lbCA9ICQoJy50aGVtZS1wYW5lbCcpO1xuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtYm94ZWQnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbChcImZsdWlkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbChcImRlZmF1bHRcIik7XG4gICAgICAgICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXBvcy1vcHRpb24nKS5hdHRyKFwiZGlzYWJsZWRcIikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbChNZXRyb25pYy5pc1JUTCgpID8gJ3JpZ2h0JyA6ICdsZWZ0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2hhbmRsZSB0aGVtZSBsYXlvdXRcbiAgICAgICAgdmFyIHJlc2V0TGF5b3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLlxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWJveGVkXCIpLlxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpLlxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xuXG4gICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgPiAucGFnZS1oZWFkZXItaW5uZXInKS5yZW1vdmVDbGFzcyhcImNvbnRhaW5lclwiKTtcblxuICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWNvbnRhaW5lcicpLnBhcmVudChcIi5jb250YWluZXJcIikuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtY29udGFpbmVyJykuaW5zZXJ0QWZ0ZXIoJ2JvZHkgPiAuY2xlYXJmaXgnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWZvb3RlciA+IC5jb250YWluZXInKS5zaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5odG1sKCQoJy5wYWdlLWZvb3RlciA+IC5jb250YWluZXInKS5odG1sKCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcucGFnZS1mb290ZXInKS5wYXJlbnQoXCIuY29udGFpbmVyXCIpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmluc2VydEFmdGVyKCcucGFnZS1jb250YWluZXInKTtcbiAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmluc2VydEFmdGVyKCcucGFnZS1mb290ZXInKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJChcIi50b3AtbWVudSA+IC5uYXZiYXItbmF2ID4gbGkuZHJvcGRvd25cIikucmVtb3ZlQ2xhc3MoXCJkcm9wZG93bi1kYXJrXCIpO1xuXG4gICAgICAgICAgICAkKCdib2R5ID4gLmNvbnRhaW5lcicpLnJlbW92ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBsYXN0U2VsZWN0ZWRMYXlvdXQgPSAnJztcblxuICAgICAgICB2YXIgc2V0TGF5b3V0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgbGF5b3V0T3B0aW9uID0gJCgnLmxheW91dC1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhck9wdGlvbiA9ICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBoZWFkZXJPcHRpb24gPSAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZvb3Rlck9wdGlvbiA9ICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhclBvc09wdGlvbiA9ICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhclN0eWxlT3B0aW9uID0gJCgnLnNpZGViYXItc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJNZW51T3B0aW9uID0gJCgnLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgaGVhZGVyVG9wRHJvcGRvd25TdHlsZSA9ICQoJy5wYWdlLWhlYWRlci10b3AtZHJvcGRvd24tc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuXG5cbiAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09IFwiZml4ZWRcIiAmJiBoZWFkZXJPcHRpb24gPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnRGVmYXVsdCBIZWFkZXIgd2l0aCBGaXhlZCBTaWRlYmFyIG9wdGlvbiBpcyBub3Qgc3VwcG9ydGVkLiBQcm9jZWVkIHdpdGggRml4ZWQgSGVhZGVyIHdpdGggRml4ZWQgU2lkZWJhci4nKTtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgICAgICAgICBzaWRlYmFyT3B0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgICAgICBoZWFkZXJPcHRpb24gPSAnZml4ZWQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNldExheW91dCgpOyAvLyByZXNldCBsYXlvdXQgdG8gZGVmYXVsdCBzdGF0ZVxuXG4gICAgICAgICAgICBpZiAobGF5b3V0T3B0aW9uID09PSBcImJveGVkXCIpIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWJveGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGhlYWRlclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciA+IC5wYWdlLWhlYWRlci1pbm5lcicpLmFkZENsYXNzKFwiY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIHZhciBjb250ID0gJCgnYm9keSA+IC5jbGVhcmZpeCcpLmFmdGVyKCc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgY29udGVudFxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWNvbnRhaW5lcicpLmFwcGVuZFRvKCdib2R5ID4gLmNvbnRhaW5lcicpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGZvb3RlclxuICAgICAgICAgICAgICAgIGlmIChmb290ZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPicgKyAkKCcucGFnZS1mb290ZXInKS5odG1sKCkgKyAnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuYXBwZW5kVG8oJ2JvZHkgPiAuY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGFzdFNlbGVjdGVkTGF5b3V0ICE9IGxheW91dE9wdGlvbikge1xuICAgICAgICAgICAgICAgIC8vbGF5b3V0IGNoYW5nZWQsIHJ1biByZXNwb25zaXZlIGhhbmRsZXI6XG4gICAgICAgICAgICAgICAgTWV0cm9uaWMucnVuUmVzaXplSGFuZGxlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RTZWxlY3RlZExheW91dCA9IGxheW91dE9wdGlvbjtcblxuICAgICAgICAgICAgLy9oZWFkZXJcbiAgICAgICAgICAgIGlmIChoZWFkZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKTtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2UtaGVhZGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2YmFyLXN0YXRpYy10b3BcIikuYWRkQ2xhc3MoXCJuYXZiYXItZml4ZWQtdG9wXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKTtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2UtaGVhZGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2YmFyLWZpeGVkLXRvcFwiKS5hZGRDbGFzcyhcIm5hdmJhci1zdGF0aWMtdG9wXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NpZGViYXJcbiAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtZnVsbC13aWR0aCcpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWRlZmF1bHRcIik7XG4gICAgICAgICAgICAgICAgICAgIExheW91dC5pbml0Rml4ZWRTaWRlYmFySG92ZXJFZmZlY3QoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWRlZmF1bHRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWZpeGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKS51bmJpbmQoJ21vdXNlZW50ZXInKS51bmJpbmQoJ21vdXNlbGVhdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRvcCBkcm9wZG93biBzdHlsZVxuICAgICAgICAgICAgaWYgKGhlYWRlclRvcERyb3Bkb3duU3R5bGUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLmFkZENsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcIi50b3AtbWVudSA+IC5uYXZiYXItbmF2ID4gbGkuZHJvcGRvd25cIikucmVtb3ZlQ2xhc3MoXCJkcm9wZG93bi1kYXJrXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2Zvb3RlclxuICAgICAgICAgICAgaWYgKGZvb3Rlck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaWRlYmFyIHN0eWxlXG4gICAgICAgICAgICBpZiAoc2lkZWJhclN0eWxlT3B0aW9uID09PSAnY29tcGFjdCcpIHtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY29tcGFjdFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNvbXBhY3RcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2lkZWJhciBtZW51XG4gICAgICAgICAgICBpZiAoc2lkZWJhck1lbnVPcHRpb24gPT09ICdob3ZlcicpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PSAnZml4ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbChcImFjY29yZGlvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJIb3ZlciBTaWRlYmFyIE1lbnUgaXMgbm90IGNvbXBhdGlibGUgd2l0aCBGaXhlZCBTaWRlYmFyIE1vZGUuIFNlbGVjdCBEZWZhdWx0IFNpZGViYXIgTW9kZSBJbnN0ZWFkLlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NpZGViYXIgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5pc1JUTCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJQb3NPcHRpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAncmlnaHQnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdsZWZ0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyUG9zT3B0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdsZWZ0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAncmlnaHQnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgTGF5b3V0LmZpeENvbnRlbnRIZWlnaHQoKTsgLy8gZml4IGNvbnRlbnQgaGVpZ2h0XG4gICAgICAgICAgICBMYXlvdXQuaW5pdEZpeGVkU2lkZWJhcigpOyAvLyByZWluaXRpYWxpemUgZml4ZWQgc2lkZWJhclxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGhhbmRsZSB0aGVtZSBjb2xvcnNcbiAgICAgICAgdmFyIHNldENvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgICAgICB2YXIgY29sb3JfID0gKE1ldHJvbmljLmlzUlRMKCkgPyBjb2xvciArICctcnRsJyA6IGNvbG9yKTtcbiAgICAgICAgICAgICQoJyNzdHlsZV9jb2xvcicpLmF0dHIoXCJocmVmXCIsIExheW91dC5nZXRMYXlvdXRDc3NQYXRoKCkgKyAndGhlbWVzLycgKyBjb2xvcl8gKyBcIi5jc3NcIik7XG4gICAgICAgIH07XG5cblxuICAgICAgICAkKCcudGhlbWUtY29sb3JzID4gbGknLCBwYW5lbCkuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbG9yID0gJCh0aGlzKS5hdHRyKFwiZGF0YS10aGVtZVwiKTtcbiAgICAgICAgICAgIHNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgICQoJ3VsID4gbGknLCBwYW5lbCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXG4gICAgICAgICAgICBpZiAoY29sb3IgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLWFjdGlvbnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdyZWQtaGF6ZScpLmFkZENsYXNzKCdidG4tZGVmYXVsdCBidG4tdHJhbnNwYXJlbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtYWN0aW9ucyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2J0bi1kZWZhdWx0IGJ0bi10cmFuc3BhcmVudCcpLmFkZENsYXNzKCdyZWQtaGF6ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZXQgZGVmYXVsdCB0aGVtZSBvcHRpb25zOlxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWJveGVkXCIpKSB7XG4gICAgICAgICAgICAkKCcubGF5b3V0LW9wdGlvbicsIHBhbmVsKS52YWwoXCJib3hlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIikpIHtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKSkge1xuICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKSkge1xuICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIikpIHtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKFwicmlnaHRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWxpZ2h0XCIpKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKFwibGlnaHRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIikpIHtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbChcImhvdmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNpZGViYXJPcHRpb24gPSAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgaGVhZGVyT3B0aW9uID0gJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmb290ZXJPcHRpb24gPSAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJQb3NPcHRpb24gPSAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJTdHlsZU9wdGlvbiA9ICQoJy5zaWRlYmFyLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudU9wdGlvbiA9ICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuXG4gICAgICAgICQoJy5sYXlvdXQtb3B0aW9uLCAucGFnZS1oZWFkZXItdG9wLWRyb3Bkb3duLXN0eWxlLW9wdGlvbiwgLnBhZ2UtaGVhZGVyLW9wdGlvbiwgLnNpZGViYXItb3B0aW9uLCAucGFnZS1mb290ZXItb3B0aW9uLCAuc2lkZWJhci1wb3Mtb3B0aW9uLCAuc2lkZWJhci1zdHlsZS1vcHRpb24sIC5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLmNoYW5nZShzZXRMYXlvdXQpO1xuICAgIH07XG5cbiAgICAvLyBoYW5kbGUgdGhlbWUgc3R5bGVcbiAgICB2YXIgc2V0VGhlbWVTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgICAgIHZhciBmaWxlID0gKHN0eWxlID09PSAncm91bmRlZCcgPyAnY29tcG9uZW50cy1yb3VuZGVkJyA6ICdjb21wb25lbnRzJyk7XG4gICAgICAgIGZpbGUgPSAoTWV0cm9uaWMuaXNSVEwoKSA/IGZpbGUgKyAnLXJ0bCcgOiBmaWxlKTtcblxuICAgICAgICAkKCcjc3R5bGVfY29tcG9uZW50cycpLmF0dHIoXCJocmVmXCIsIE1ldHJvbmljLmdldEdsb2JhbENzc1BhdGgoKSArIGZpbGUgKyBcIi5jc3NcIik7XG5cbiAgICAgICAgaWYgKCQuY29va2llKSB7XG4gICAgICAgICAgICAkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicsIHN0eWxlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8vbWFpbiBmdW5jdGlvbiB0byBpbml0aWF0ZSB0aGUgdGhlbWVcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBoYW5kbGVzIHN0eWxlIGN1c3RvbWVyIHRvb2xcbiAgICAgICAgICAgIGhhbmRsZVRoZW1lKCk7XG5cbiAgICAgICAgICAgIC8vIGhhbmRsZSBsYXlvdXQgc3R5bGUgY2hhbmdlXG4gICAgICAgICAgICAkKCcudGhlbWUtcGFuZWwgLmxheW91dC1zdHlsZS1vcHRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgIHNldFRoZW1lU3R5bGUoJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2V0IGxheW91dCBzdHlsZSBmcm9tIGNvb2tpZVxuICAgICAgICAgICAgaWYgKCQuY29va2llICYmICQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykgPT09ICdyb3VuZGVkJykge1xuICAgICAgICAgICAgICAgIHNldFRoZW1lU3R5bGUoJC5jb29raWUoJ2xheW91dC1zdHlsZS1vcHRpb24nKSk7XG4gICAgICAgICAgICAgICAgJCgnLnRoZW1lLXBhbmVsIC5sYXlvdXQtc3R5bGUtb3B0aW9uJykudmFsKCQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxufSAoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZW1vIiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5jb25zdCBNZXRyb25pYyA9IHJlcXVpcmUoJy4vbWV0cm9uaWMnKVxuLyoqXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcbioqL1xudmFyIExheW91dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGxheW91dEltZ1BhdGggPSAnYWRtaW4vbGF5b3V0NC9pbWcvJztcblxuICAgIHZhciBsYXlvdXRDc3NQYXRoID0gJ2FkbWluL2xheW91dDQvY3NzLyc7XG5cbiAgICB2YXIgcmVzQnJlYWtwb2ludE1kID0gTWV0cm9uaWMuZ2V0UmVzcG9uc2l2ZUJyZWFrcG9pbnQoJ21kJyk7XG5cbiAgICAvLyogQkVHSU46Q09SRSBIQU5ETEVSUyAqLy9cbiAgICAvLyB0aGlzIGZ1bmN0aW9uIGhhbmRsZXMgcmVzcG9uc2l2ZSBsYXlvdXQgb24gc2NyZWVuIHNpemUgcmVzaXplIG9yIG1vYmlsZSBkZXZpY2Ugcm90YXRlLlxuXG5cbiAgICAvLyBIYW5kbGUgc2lkZWJhciBtZW51IGxpbmtzXG4gICAgdmFyIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluayA9IGZ1bmN0aW9uKG1vZGUsIGVsKSB7XG4gICAgICAgIHZhciB1cmwgPSBsb2NhdGlvbi5oYXNoLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgdmFyIG1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcblxuICAgICAgICBpZiAobW9kZSA9PT0gJ2NsaWNrJyB8fCBtb2RlID09PSAnc2V0Jykge1xuICAgICAgICAgICAgZWwgPSAkKGVsKTtcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnbWF0Y2gnKSB7XG4gICAgICAgICAgICBtZW51LmZpbmQoXCJsaSA+IGFcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9ICQodGhpcykuYXR0cihcImhyZWZcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAvLyB1cmwgbWF0Y2ggY29uZGl0aW9uXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID4gMSAmJiB1cmwuc3Vic3RyKDEsIHBhdGgubGVuZ3RoIC0gMSkgPT0gcGF0aC5zdWJzdHIoMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWVsIHx8IGVsLnNpemUoKSA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWwuYXR0cignaHJlZicpLnRvTG93ZXJDYXNlKCkgPT09ICdqYXZhc2NyaXB0OjsnIHx8IGVsLmF0dHIoJ2hyZWYnKS50b0xvd2VyQ2FzZSgpID09PSAnIycpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzbGlkZVNwZWVkID0gcGFyc2VJbnQobWVudS5kYXRhKFwic2xpZGUtc3BlZWRcIikpO1xuICAgICAgICB2YXIga2VlcEV4cGFuZCA9IG1lbnUuZGF0YShcImtlZXAtZXhwYW5kZWRcIik7XG5cbiAgICAgICAgLy8gZGlzYWJsZSBhY3RpdmUgc3RhdGVzXG4gICAgICAgIG1lbnUuZmluZCgnbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBtZW51LmZpbmQoJ2xpID4gYSA+IC5zZWxlY3RlZCcpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChtZW51Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51JykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtZW51LmZpbmQoJ2xpLm9wZW4nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnPiBhID4gLmFycm93Lm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgIG1lbnUuZmluZCgnbGkub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBlbC5wYXJlbnRzKCdsaScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz4gYSA+IHNwYW4uYXJyb3cnKS5hZGRDbGFzcygnb3BlbicpO1xuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnQoJ3VsLnBhZ2Utc2lkZWJhci1tZW51Jykuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+IGEnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwic2VsZWN0ZWRcIj48L3NwYW4+Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmNoaWxkcmVuKCd1bC5zdWItbWVudScpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1vZGUgPT09ICdjbGljaycpIHtcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBzaWRlYmFyIG1lbnVcbiAgICB2YXIgaGFuZGxlU2lkZWJhck1lbnUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICdsaSA+IGEnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoID49IHJlc0JyZWFrcG9pbnRNZCAmJiAkKHRoaXMpLnBhcmVudHMoJy5wYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51Jykuc2l6ZSgpID09PSAxKSB7IC8vIGV4aXQgb2YgaG92ZXIgc2lkZWJhciBtZW51XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkuaGFzQ2xhc3MoJ3N1Yi1tZW51JykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKHRoaXMpLm5leHQoKS5oYXNDbGFzcygnc3ViLW1lbnUgYWx3YXlzLW9wZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhcmVudCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCk7XG4gICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XG4gICAgICAgICAgICB2YXIgc3ViID0gJCh0aGlzKS5uZXh0KCk7XG5cbiAgICAgICAgICAgIHZhciBhdXRvU2Nyb2xsID0gbWVudS5kYXRhKFwiYXV0by1zY3JvbGxcIik7XG4gICAgICAgICAgICB2YXIgc2xpZGVTcGVlZCA9IHBhcnNlSW50KG1lbnUuZGF0YShcInNsaWRlLXNwZWVkXCIpKTtcbiAgICAgICAgICAgIHZhciBrZWVwRXhwYW5kID0gbWVudS5kYXRhKFwia2VlcC1leHBhbmRlZFwiKTtcblxuICAgICAgICAgICAgaWYgKGtlZXBFeHBhbmQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5jaGlsZHJlbignYScpLmNoaWxkcmVuKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbignbGkub3BlbicpLmNoaWxkcmVuKCcuc3ViLW1lbnU6bm90KC5hbHdheXMtb3BlbiknKS5zbGlkZVVwKHNsaWRlU3BlZWQpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbignbGkub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzbGlkZU9mZmVzZXQgPSAtMjAwO1xuXG4gICAgICAgICAgICBpZiAoc3ViLmlzKFwiOnZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICAkKCcuYXJyb3cnLCAkKHRoaXMpKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgICAgICAgICAgc3ViLnNsaWRlVXAoc2xpZGVTcGVlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvU2Nyb2xsID09PSB0cnVlICYmICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51LnNsaW1TY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2Nyb2xsVG8nOiAodGhlLnBvc2l0aW9uKCkpLnRvcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbyh0aGUsIHNsaWRlT2ZmZXNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmFycm93JywgJCh0aGlzKSkuYWRkQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIHN1Yi5zbGlkZURvd24oc2xpZGVTcGVlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvU2Nyb2xsID09PSB0cnVlICYmICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51LnNsaW1TY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2Nyb2xsVG8nOiAodGhlLnBvc2l0aW9uKCkpLnRvcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbyh0aGUsIHNsaWRlT2ZmZXNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgYWpheCBsaW5rcyB3aXRoaW4gc2lkZWJhciBtZW51XG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnIGxpID4gYS5hamF4aWZ5JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xuICAgICAgICAgICAgdmFyIG1lbnVDb250YWluZXIgPSAkKCcucGFnZS1zaWRlYmFyIHVsJyk7XG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSAkKCcucGFnZS1jb250ZW50Jyk7XG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnRCb2R5ID0gJCgnLnBhZ2UtY29udGVudCAucGFnZS1jb250ZW50LWJvZHknKTtcblxuICAgICAgICAgICAgbWVudUNvbnRhaW5lci5jaGlsZHJlbignbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgbWVudUNvbnRhaW5lci5jaGlsZHJlbignYXJyb3cub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnbGknKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICQodGhpcykuY2hpbGRyZW4oJ2EgPiBzcGFuLmFycm93JykuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIE1ldHJvbmljLnN0YXJ0UGFnZUxvYWRpbmcoKTtcblxuICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGUucGFyZW50cygnbGkub3BlbicpLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhci1tZW51ID4gbGkub3BlbiA+IGEnKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIExheW91dC5maXhDb250ZW50SGVpZ2h0KCk7IC8vIGZpeCBjb250ZW50IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0QWpheCgpOyAvLyBpbml0aWFsaXplIGNvcmUgc3R1ZmZcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwoJzxoND5Db3VsZCBub3QgbG9hZCB0aGUgcmVxdWVzdGVkIGNvbnRlbnQuPC9oND4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIGFqYXggbGluayB3aXRoaW4gbWFpbiBjb250ZW50XG4gICAgICAgICQoJy5wYWdlLWNvbnRlbnQnKS5vbignY2xpY2snLCAnLmFqYXhpZnknLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcblxuICAgICAgICAgICAgdmFyIHVybCA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSAkKCcucGFnZS1jb250ZW50Jyk7XG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnRCb2R5ID0gJCgnLnBhZ2UtY29udGVudCAucGFnZS1jb250ZW50LWJvZHknKTtcblxuICAgICAgICAgICAgTWV0cm9uaWMuc3RhcnRQYWdlTG9hZGluZygpO1xuXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbChyZXMpO1xuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdEFqYXgoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHN0dWZmXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwoJzxoND5Db3VsZCBub3QgbG9hZCB0aGUgcmVxdWVzdGVkIGNvbnRlbnQuPC9oND4nKTtcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBzY3JvbGxpbmcgdG8gdG9wIG9uIHJlc3BvbnNpdmUgbWVudSB0b2dnbGVyIGNsaWNrIHdoZW4gaGVhZGVyIGlzIGZpeGVkIGZvciBtb2JpbGUgdmlld1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnBhZ2UtaGVhZGVyLWZpeGVkLW1vYmlsZSAucmVzcG9uc2l2ZS10b2dnbGVyJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvcCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBzaWRlYmFyIGhlaWdodCBmb3IgZml4ZWQgc2lkZWJhciBsYXlvdXQuXG4gICAgdmFyIF9jYWxjdWxhdGVGaXhlZFNpZGViYXJWaWV3cG9ydEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2lkZWJhckhlaWdodCA9IE1ldHJvbmljLmdldFZpZXdQb3J0KCkuaGVpZ2h0IC0gJCgnLnBhZ2UtaGVhZGVyJykub3V0ZXJIZWlnaHQoKSAtIDMwO1xuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikpIHtcbiAgICAgICAgICAgIHNpZGViYXJIZWlnaHQgPSBzaWRlYmFySGVpZ2h0IC0gJCgnLnBhZ2UtZm9vdGVyJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaWRlYmFySGVpZ2h0O1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIGZpeGVkIHNpZGViYXJcbiAgICB2YXIgaGFuZGxlRml4ZWRTaWRlYmFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XG5cbiAgICAgICAgTWV0cm9uaWMuZGVzdHJveVNsaW1TY3JvbGwobWVudSk7XG5cbiAgICAgICAgaWYgKCQoJy5wYWdlLXNpZGViYXItZml4ZWQnKS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoID49IHJlc0JyZWFrcG9pbnRNZCkge1xuICAgICAgICAgICAgbWVudS5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgX2NhbGN1bGF0ZUZpeGVkU2lkZWJhclZpZXdwb3J0SGVpZ2h0KCkpO1xuICAgICAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwobWVudSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBzaWRlYmFyIHRvZ2dsZXIgdG8gY2xvc2UvaGlkZSB0aGUgc2lkZWJhci5cbiAgICB2YXIgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBib2R5ID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpO1xuICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnBhZ2Utc2lkZWJhci1tZW51JykucmVtb3ZlQ2xhc3MoJ3BhZ2Utc2lkZWJhci1tZW51LWNsb3NlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItY2xvc2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcucGFnZS1zaWRlYmFyLW1lbnUnKS5hZGRDbGFzcygncGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFubGVzIHNpZGViYXIgdG9nZ2xlclxuICAgIHZhciBoYW5kbGVTaWRlYmFyVG9nZ2xlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYm9keSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKTtcblxuICAgICAgICAvLyBoYW5kbGUgc2lkZWJhciBzaG93L2hpZGVcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcuc2lkZWJhci10b2dnbGVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIHNpZGViYXIgPSAkKCcucGFnZS1zaWRlYmFyJyk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhck1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcbiAgICAgICAgICAgICQoXCIuc2lkZWJhci1zZWFyY2hcIiwgc2lkZWJhcikucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuXG4gICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIikpIHtcbiAgICAgICAgICAgICAgICBib2R5LnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKTtcbiAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNsb3NlZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoJC5jb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ3NpZGViYXJfY2xvc2VkJywgJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJvZHkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpO1xuICAgICAgICAgICAgICAgIHNpZGViYXJNZW51LmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkXCIpO1xuICAgICAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXJNZW51LnRyaWdnZXIoXCJtb3VzZWxlYXZlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJC5jb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ3NpZGViYXJfY2xvc2VkJywgJzEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QoKTtcblxuICAgICAgICAvLyBoYW5kbGUgdGhlIHNlYXJjaCBiYXIgY2xvc2VcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICcuc2lkZWJhci1zZWFyY2ggLnJlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggcXVlcnkgc3VibWl0IG9uIGVudGVyIHByZXNzXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXIgLnNpZGViYXItc2VhcmNoJykub24oJ2tleXByZXNzJywgJ2lucHV0LmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLzwtLS0tIEFkZCB0aGlzIGxpbmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggc3VibWl0KGZvciBzaWRlYmFyIHNlYXJjaCBhbmQgcmVzcG9uc2l2ZSBtb2RlIG9mIHRoZSBoZWFkZXIgc2VhcmNoKVxuICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2ggLnN1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXNlYXJjaCcpLmhhc0NsYXNzKCdvcGVuJykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcucGFnZS1zaWRlYmFyLWZpeGVkJykuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyIC5zaWRlYmFyLXRvZ2dsZXInKS5jbGljaygpOyAvL3RyaWdnZXIgc2lkZWJhciB0b2dnbGUgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuYWRkQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuc3VibWl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBjbG9zZSBvbiBib2R5IGNsaWNrXG4gICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5zaXplKCkgIT09IDApIHtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCAuaW5wdXQtZ3JvdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXNlYXJjaCcpLmhhc0NsYXNzKCdvcGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgdGhlIGhvcml6b250YWwgbWVudVxuICAgIHZhciBoYW5kbGVIZWFkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaGFuZGxlIHNlYXJjaCBib3ggZXhwYW5kL2NvbGxhcHNlXG4gICAgICAgICQoJy5wYWdlLWhlYWRlcicpLm9uKCdjbGljaycsICcuc2VhcmNoLWZvcm0nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmZvcm0tY29udHJvbCcpLmZvY3VzKCk7XG5cbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAuc2VhcmNoLWZvcm0gLmZvcm0tY29udHJvbCcpLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgICQodGhpcykudW5iaW5kKFwiYmx1clwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgaG9yIG1lbnUgc2VhcmNoIGZvcm0gb24gZW50ZXIgcHJlc3NcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyJykub24oJ2tleXByZXNzJywgJy5ob3ItbWVudSAuc2VhcmNoLWZvcm0gLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBoZWFkZXIgc2VhcmNoIGJ1dHRvbiBjbGlja1xuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbignbW91c2Vkb3duJywgJy5zZWFyY2gtZm9ybS5vcGVuIC5zdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5zdWJtaXQoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgdGhlIGdvIHRvIHRvcCBidXR0b24gYXQgdGhlIGZvb3RlclxuICAgIHZhciBoYW5kbGVHb1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gMzAwO1xuICAgICAgICB2YXIgZHVyYXRpb24gPSA1MDA7XG5cbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSkpIHsgLy8gaW9zIHN1cHBvcnRlZFxuICAgICAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJ0b3VjaGVuZCB0b3VjaGNhbmNlbCB0b3VjaGxlYXZlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVJbihkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlT3V0KGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHsgLy8gZ2VuZXJhbFxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVJbihkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlT3V0KGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vKiBFTkQ6Q09SRSBIQU5ETEVSUyAqLy9cblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLy8gTWFpbiBpbml0IG1ldGhvZHMgdG8gaW5pdGlhbGl6ZSB0aGUgbGF5b3V0XG4gICAgICAgIC8vIElNUE9SVEFOVCEhITogRG8gbm90IG1vZGlmeSB0aGUgY29yZSBoYW5kbGVycyBjYWxsIG9yZGVyLlxuXG4gICAgICAgIGluaXRIZWFkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlSGVhZGVyKCk7IC8vIGhhbmRsZXMgaG9yaXpvbnRhbCBtZW51XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2lkZWJhck1lbnVBY3RpdmVMaW5rOiBmdW5jdGlvbihtb2RlLCBlbCkge1xuICAgICAgICAgICAgaGFuZGxlU2lkZWJhck1lbnVBY3RpdmVMaW5rKG1vZGUsIGVsKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0U2lkZWJhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL2xheW91dCBoYW5kbGVyc1xuICAgICAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFyKCk7IC8vIGhhbmRsZXMgZml4ZWQgc2lkZWJhciBtZW51XG4gICAgICAgICAgICBoYW5kbGVTaWRlYmFyTWVudSgpOyAvLyBoYW5kbGVzIG1haW4gbWVudVxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhclRvZ2dsZXIoKTsgLy8gaGFuZGxlcyBzaWRlYmFyIGhpZGUvc2hvd1xuXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuaXNBbmd1bGFySnNBcHAoKSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluaygnbWF0Y2gnKTsgLy8gaW5pdCBzaWRlYmFyIGFjdGl2ZSBsaW5rc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGhhbmRsZUZpeGVkU2lkZWJhcik7IC8vIHJlaW5pdGlhbGl6ZSBmaXhlZCBzaWRlYmFyIG9uIHdpbmRvdyByZXNpemVcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0Q29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEZvb3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVHb1RvcCgpOyAvL2hhbmRsZXMgc2Nyb2xsIHRvIHRvcCBmdW5jdGlvbmFsaXR5IGluIHRoZSBmb290ZXJcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNpZGViYXIoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdENvbnRlbnQoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEZvb3RlcigpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGZpeCB0aGUgc2lkZWJhciBhbmQgY29udGVudCBoZWlnaHQgYWNjb3JkaW5nbHlcbiAgICAgICAgZml4Q29udGVudEhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEZpeGVkU2lkZWJhckhvdmVyRWZmZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEZpeGVkU2lkZWJhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXIoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRMYXlvdXRJbWdQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBNZXRyb25pYy5nZXRBc3NldHNQYXRoKCkgKyBsYXlvdXRJbWdQYXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldExheW91dENzc1BhdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1ldHJvbmljLmdldEFzc2V0c1BhdGgoKSArIGxheW91dENzc1BhdGg7XG4gICAgICAgIH1cbiAgICB9O1xuXG59ICgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcblxuLyoqXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcbioqL1xudmFyIE1ldHJvbmljID0gZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBJRSBtb2RlXG4gICAgdmFyIGlzUlRMID0gZmFsc2U7XG4gICAgdmFyIGlzSUU4ID0gZmFsc2U7XG4gICAgdmFyIGlzSUU5ID0gZmFsc2U7XG4gICAgdmFyIGlzSUUxMCA9IGZhbHNlO1xuXG4gICAgdmFyIHJlc2l6ZUhhbmRsZXJzID0gW107XG5cbiAgICB2YXIgYXNzZXRzUGF0aCA9ICcuLi8uLi9hc3NldHMvJztcblxuICAgIHZhciBnbG9iYWxJbWdQYXRoID0gJ2dsb2JhbC9pbWcvJztcblxuICAgIHZhciBnbG9iYWxQbHVnaW5zUGF0aCA9ICdnbG9iYWwvcGx1Z2lucy8nO1xuXG4gICAgdmFyIGdsb2JhbENzc1BhdGggPSAnZ2xvYmFsL2Nzcy8nO1xuXG4gICAgLy8gdGhlbWUgbGF5b3V0IGNvbG9yIHNldFxuXG4gICAgdmFyIGJyYW5kQ29sb3JzID0ge1xuICAgICAgICAnYmx1ZSc6ICcjODlDNEY0JyxcbiAgICAgICAgJ3JlZCc6ICcjRjM1NjVEJyxcbiAgICAgICAgJ2dyZWVuJzogJyMxYmJjOWInLFxuICAgICAgICAncHVycGxlJzogJyM5YjU5YjYnLFxuICAgICAgICAnZ3JleSc6ICcjOTVhNWE2JyxcbiAgICAgICAgJ3llbGxvdyc6ICcjRjhDQjAwJ1xuICAgIH07XG5cbiAgICAvLyBpbml0aWFsaXplcyBtYWluIHNldHRpbmdzXG4gICAgdmFyIGhhbmRsZUluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmNzcygnZGlyZWN0aW9uJykgPT09ICdydGwnKSB7XG4gICAgICAgICAgICBpc1JUTCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpc0lFOCA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTVNJRSA4LjAvKTtcbiAgICAgICAgaXNJRTkgPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgOS4wLyk7XG4gICAgICAgIGlzSUUxMCA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTVNJRSAxMC4wLyk7XG5cbiAgICAgICAgaWYgKGlzSUUxMCkge1xuICAgICAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpZTEwJyk7IC8vIGRldGVjdCBJRTEwIHZlcnNpb25cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0lFMTAgfHwgaXNJRTkgfHwgaXNJRTgpIHtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaWUnKTsgLy8gZGV0ZWN0IElFMTAgdmVyc2lvblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIHJ1bnMgY2FsbGJhY2sgZnVuY3Rpb25zIHNldCBieSBNZXRyb25pYy5hZGRSZXNwb25zaXZlSGFuZGxlcigpLlxuICAgIHZhciBfcnVuUmVzaXplSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gcmVpbml0aWFsaXplIG90aGVyIHN1YnNjcmliZWQgZWxlbWVudHNcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNpemVIYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVhY2ggPSByZXNpemVIYW5kbGVyc1tpXTtcbiAgICAgICAgICAgIGVhY2guY2FsbCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGhhbmRsZSB0aGUgbGF5b3V0IHJlaW5pdGlhbGl6YXRpb24gb24gd2luZG93IHJlc2l6ZVxuICAgIHZhciBoYW5kbGVPblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVzaXplO1xuICAgICAgICBpZiAoaXNJRTgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyaGVpZ2h0O1xuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmhlaWdodCA9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy9xdWl0ZSBldmVudCBzaW5jZSBvbmx5IGJvZHkgcmVzaXplZCBub3Qgd2luZG93LlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNpemUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcbiAgICAgICAgICAgICAgICB9LCA1MCk7IC8vIHdhaXQgNTBtcyB1bnRpbCB3aW5kb3cgcmVzaXplIGZpbmlzaGVzLlxuICAgICAgICAgICAgICAgIGN1cnJoZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBzdG9yZSBsYXN0IGJvZHkgY2xpZW50IGhlaWdodFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2l6ZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIF9ydW5SZXNpemVIYW5kbGVycygpO1xuICAgICAgICAgICAgICAgIH0sIDUwKTsgLy8gd2FpdCA1MG1zIHVudGlsIHdpbmRvdyByZXNpemUgZmluaXNoZXMuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHBvcnRsZXQgdG9vbHMgJiBhY3Rpb25zXG4gICAgdmFyIGhhbmRsZVBvcnRsZXRUb29scyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBoYW5kbGUgcG9ydGxldCByZW1vdmVcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gYS5yZW1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgcG9ydGxldCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpO1xuXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpKSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlIC5mdWxsc2NyZWVuJykudG9vbHRpcCgnZGVzdHJveScpO1xuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZWxvYWQnKS50b29sdGlwKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbW92ZScpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29uZmlnJykudG9vbHRpcCgnZGVzdHJveScpO1xuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb2xsYXBzZSwgLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5leHBhbmQnKS50b29sdGlwKCdkZXN0cm95Jyk7XG5cbiAgICAgICAgICAgIHBvcnRsZXQucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBwb3J0bGV0IGZ1bGxzY3JlZW5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlIC5mdWxsc2NyZWVuJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHBvcnRsZXQgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKTtcbiAgICAgICAgICAgIGlmIChwb3J0bGV0Lmhhc0NsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKSkge1xuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29uJyk7XG4gICAgICAgICAgICAgICAgcG9ydGxldC5yZW1vdmVDbGFzcygncG9ydGxldC1mdWxsc2NyZWVuJyk7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBNZXRyb25pYy5nZXRWaWV3UG9ydCgpLmhlaWdodCAtXG4gICAgICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LXRpdGxlJykub3V0ZXJIZWlnaHQoKSAtXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ3BhZGRpbmctdG9wJykpIC1cbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygncGFkZGluZy1ib3R0b20nKSk7XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvbicpO1xuICAgICAgICAgICAgICAgIHBvcnRsZXQuYWRkQ2xhc3MoJ3BvcnRsZXQtZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiBhLnJlbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpLmNoaWxkcmVuKFwiLnBvcnRsZXQtYm9keVwiKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXVybFwiKTtcbiAgICAgICAgICAgIHZhciBlcnJvciA9ICQodGhpcykuYXR0cihcImRhdGEtZXJyb3ItZGlzcGxheVwiKTtcbiAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5ibG9ja1VJKHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBlbCxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNvbG9yOiAnbm9uZSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmh0bWwocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy51bmJsb2NrVUkoZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9ICdFcnJvciBvbiByZWxvYWRpbmcgdGhlIGNvbnRlbnQuIFBsZWFzZSBjaGVjayB5b3VyIGNvbm5lY3Rpb24gYW5kIHRyeSBhZ2Fpbi4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yID09IFwidG9hc3RyXCIgJiYgdG9hc3RyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yID09IFwibm90aWZpYzhcIiAmJiAkLm5vdGlmaWM4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5ub3RpZmljOCgnemluZGV4JywgMTE1MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQubm90aWZpYzgobXNnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiAncnVieScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpZmU6IDMwMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQobXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBmb3IgZGVtbyBwdXJwb3NlXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuYmxvY2tVSSh7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogZWwsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb2xvcjogJ25vbmUnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnVuYmxvY2tVSShlbCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGxvYWQgYWpheCBkYXRhIG9uIHBhZ2UgaW5pdFxuICAgICAgICAkKCcucG9ydGxldCAucG9ydGxldC10aXRsZSBhLnJlbG9hZFtkYXRhLWxvYWQ9XCJ0cnVlXCJdJykuY2xpY2soKTtcblxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmV4cGFuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpLmNoaWxkcmVuKFwiLnBvcnRsZXQtYm9keVwiKTtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY29sbGFwc2VcIikpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiY29sbGFwc2VcIikuYWRkQ2xhc3MoXCJleHBhbmRcIik7XG4gICAgICAgICAgICAgICAgZWwuc2xpZGVVcCgyMDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiZXhwYW5kXCIpLmFkZENsYXNzKFwiY29sbGFwc2VcIik7XG4gICAgICAgICAgICAgICAgZWwuc2xpZGVEb3duKDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIGN1c3RvbSBjaGVja2JveGVzICYgcmFkaW9zIHVzaW5nIGpRdWVyeSBVbmlmb3JtIHBsdWdpblxuICAgIHZhciBoYW5kbGVVbmlmb3JtID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgpLnVuaWZvcm0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGVzdCA9ICQoXCJpbnB1dFt0eXBlPWNoZWNrYm94XTpub3QoLnRvZ2dsZSwgLm1kLWNoZWNrLCAubWQtcmFkaW9idG4sIC5tYWtlLXN3aXRjaCwgLmljaGVjayksIGlucHV0W3R5cGU9cmFkaW9dOm5vdCgudG9nZ2xlLCAubWQtY2hlY2ssIC5tZC1yYWRpb2J0biwgLnN0YXIsIC5tYWtlLXN3aXRjaCwgLmljaGVjaylcIik7XG4gICAgICAgIGlmICh0ZXN0LnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgIHRlc3QuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnVuaWZvcm0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzbWF0ZXJpYWwgZGVzaWduIGNoZWNrYm94ZXNcbiAgICB2YXIgaGFuZGxlTWF0ZXJpYWxEZXNpZ24gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBNYXRlcmlhbCBkZXNpZ24gY2tlY2tib3ggYW5kIHJhZGlvIGVmZmVjdHNcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcubWQtY2hlY2tib3ggPiBsYWJlbCwgLm1kLXJhZGlvID4gbGFiZWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xuICAgICAgICAgICAgLy8gZmluZCB0aGUgZmlyc3Qgc3BhbiB3aGljaCBpcyBvdXIgY2lyY2xlL2J1YmJsZVxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKS5jaGlsZHJlbignc3BhbjpmaXJzdC1jaGlsZCcpO1xuXG4gICAgICAgICAgICAvLyBhZGQgdGhlIGJ1YmJsZSBjbGFzcyAod2UgZG8gdGhpcyBzbyBpdCBkb2VzbnQgc2hvdyBvbiBwYWdlIGxvYWQpXG4gICAgICAgICAgICBlbC5hZGRDbGFzcygnaW5jJyk7XG5cbiAgICAgICAgICAgIC8vIGNsb25lIGl0XG4gICAgICAgICAgICB2YXIgbmV3b25lID0gZWwuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIGFkZCB0aGUgY2xvbmVkIHZlcnNpb24gYmVmb3JlIG91ciBvcmlnaW5hbFxuICAgICAgICAgICAgZWwuYmVmb3JlKG5ld29uZSk7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgb3JpZ2luYWwgc28gdGhhdCBpdCBpcyByZWFkeSB0byBydW4gb24gbmV4dCBjbGlja1xuICAgICAgICAgICAgJChcIi5cIiArIGVsLmF0dHIoXCJjbGFzc1wiKSArIFwiOmxhc3RcIiwgdGhlKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1tZCcpKSB7XG4gICAgICAgICAgICAvLyBNYXRlcmlhbCBkZXNpZ24gY2xpY2sgZWZmZWN0XG4gICAgICAgICAgICAvLyBjcmVkaXQgd2hlcmUgY3JlZGl0J3MgZHVlOyBodHRwOi8vdGhlY29kZXBsYXllci5jb20vd2Fsa3Rocm91Z2gvcmlwcGxlLWNsaWNrLWVmZmVjdC1nb29nbGUtbWF0ZXJpYWwtZGVzaWduXG4gICAgICAgICAgICB2YXIgZWxlbWVudCwgY2lyY2xlLCBkLCB4LCB5O1xuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdhLmJ0biwgYnV0dG9uLmJ0biwgaW5wdXQuYnRuLCBsYWJlbC5idG4nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZihlbGVtZW50LmZpbmQoXCIubWQtY2xpY2stY2lyY2xlXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucHJlcGVuZChcIjxzcGFuIGNsYXNzPSdtZC1jbGljay1jaXJjbGUnPjwvc3Bhbj5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2lyY2xlID0gZWxlbWVudC5maW5kKFwiLm1kLWNsaWNrLWNpcmNsZVwiKTtcbiAgICAgICAgICAgICAgICBjaXJjbGUucmVtb3ZlQ2xhc3MoXCJtZC1jbGljay1hbmltYXRlXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYoIWNpcmNsZS5oZWlnaHQoKSAmJiAhY2lyY2xlLndpZHRoKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IE1hdGgubWF4KGVsZW1lbnQub3V0ZXJXaWR0aCgpLCBlbGVtZW50Lm91dGVySGVpZ2h0KCkpO1xuICAgICAgICAgICAgICAgICAgICBjaXJjbGUuY3NzKHtoZWlnaHQ6IGQsIHdpZHRoOiBkfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeCA9IGUucGFnZVggLSBlbGVtZW50Lm9mZnNldCgpLmxlZnQgLSBjaXJjbGUud2lkdGgoKS8yO1xuICAgICAgICAgICAgICAgIHkgPSBlLnBhZ2VZIC0gZWxlbWVudC5vZmZzZXQoKS50b3AgLSBjaXJjbGUuaGVpZ2h0KCkvMjtcblxuICAgICAgICAgICAgICAgIGNpcmNsZS5jc3Moe3RvcDogeSsncHgnLCBsZWZ0OiB4KydweCd9KS5hZGRDbGFzcyhcIm1kLWNsaWNrLWFuaW1hdGVcIik7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjaXJjbGUucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZsb2F0aW5nIGxhYmVsc1xuICAgICAgICB2YXIgaGFuZGxlSW5wdXQgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgaWYgKGVsLnZhbCgpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBlbC5hZGRDbGFzcygnZWRpdGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNsYXNzKCdlZGl0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbigna2V5ZG93bicsICcuZm9ybS1tZC1mbG9hdGluZy1sYWJlbCAuZm9ybS1jb250cm9sJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaGFuZGxlSW5wdXQoJCh0aGlzKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2JsdXInLCAnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZUlucHV0KCQodGhpcykpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuZm9ybS1tZC1mbG9hdGluZy1sYWJlbCAuZm9ybS1jb250cm9sJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2VkaXRlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGVzIGN1c3RvbSBjaGVja2JveGVzICYgcmFkaW9zIHVzaW5nIGpRdWVyeSBpQ2hlY2sgcGx1Z2luXG4gICAgdmFyIGhhbmRsZWlDaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoKS5pQ2hlY2spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5pY2hlY2snKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNoZWNrYm94Q2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtY2hlY2tib3gnKSA/ICQodGhpcykuYXR0cignZGF0YS1jaGVja2JveCcpIDogJ2ljaGVja2JveF9taW5pbWFsLWdyZXknO1xuICAgICAgICAgICAgdmFyIHJhZGlvQ2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtcmFkaW8nKSA/ICQodGhpcykuYXR0cignZGF0YS1yYWRpbycpIDogJ2lyYWRpb19taW5pbWFsLWdyZXknO1xuXG4gICAgICAgICAgICBpZiAoY2hlY2tib3hDbGFzcy5pbmRleE9mKCdfbGluZScpID4gLTEgfHwgcmFkaW9DbGFzcy5pbmRleE9mKCdfbGluZScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmlDaGVjayh7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94Q2xhc3M6IGNoZWNrYm94Q2xhc3MsXG4gICAgICAgICAgICAgICAgICAgIHJhZGlvQ2xhc3M6IHJhZGlvQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgIGluc2VydDogJzxkaXYgY2xhc3M9XCJpY2hlY2tfbGluZS1pY29uXCI+PC9kaXY+JyArICQodGhpcykuYXR0cihcImRhdGEtbGFiZWxcIilcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soe1xuICAgICAgICAgICAgICAgICAgICBjaGVja2JveENsYXNzOiBjaGVja2JveENsYXNzLFxuICAgICAgICAgICAgICAgICAgICByYWRpb0NsYXNzOiByYWRpb0NsYXNzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBzd2l0Y2hlc1xuICAgIHZhciBoYW5kbGVCb290c3RyYXBTd2l0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCEkKCkuYm9vdHN0cmFwU3dpdGNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJCgnLm1ha2Utc3dpdGNoJykuYm9vdHN0cmFwU3dpdGNoKCk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIGNvbmZpcm1hdGlvbnNcbiAgICB2YXIgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgpLmNvbmZpcm1hdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1jb25maXJtYXRpb25dJykuY29uZmlybWF0aW9uKHsgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksIGJ0bk9rQ2xhc3M6ICdidG4gYnRuLXNtIGJ0bi1zdWNjZXNzJywgYnRuQ2FuY2VsQ2xhc3M6ICdidG4gYnRuLXNtIGJ0bi1kYW5nZXInfSk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgQWNjb3JkaW9ucy5cbiAgICB2YXIgaGFuZGxlQWNjb3JkaW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ3Nob3duLmJzLmNvbGxhcHNlJywgJy5hY2NvcmRpb24uc2Nyb2xsYWJsZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvKCQoZS50YXJnZXQpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIFRhYnMuXG4gICAgdmFyIGhhbmRsZVRhYnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9hY3RpdmF0ZSB0YWIgaWYgdGFiIGlkIHByb3ZpZGVkIGluIHRoZSBVUkxcbiAgICAgICAgaWYgKGxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgICAgIHZhciB0YWJpZCA9IGVuY29kZVVSSShsb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XG4gICAgICAgICAgICAkKCdhW2hyZWY9XCIjJyArIHRhYmlkICsgJ1wiXScpLnBhcmVudHMoJy50YWItcGFuZTpoaWRkZW4nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB0YWJpZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnYVtocmVmPVwiIycgKyB0YWJpZCArICdcIl0nKS5jbGljaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoKS50YWJkcm9wKSB7XG4gICAgICAgICAgICAkKCcudGFiYmFibGUtdGFiZHJvcCAubmF2LXBpbGxzLCAudGFiYmFibGUtdGFiZHJvcCAubmF2LXRhYnMnKS50YWJkcm9wKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1lbGxpcHNpcy12XCI+PC9pPiZuYnNwOzxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT4nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBNb2RhbHMuXG4gICAgdmFyIGhhbmRsZU1vZGFscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBmaXggc3RhY2thYmxlIG1vZGFsIGlzc3VlOiB3aGVuIDIgb3IgbW9yZSBtb2RhbHMgb3BlbmVkLCBjbG9zaW5nIG9uZSBvZiBtb2RhbCB3aWxsIHJlbW92ZSAubW9kYWwtb3BlbiBjbGFzcy5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRlLmJzLm1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoJCgnLm1vZGFsOnZpc2libGUnKS5zaXplKCkgPiAxICYmICQoJ2h0bWwnKS5oYXNDbGFzcygnbW9kYWwtb3BlbicpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnbW9kYWwtb3BlbicpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcubW9kYWw6dmlzaWJsZScpLnNpemUoKSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZpeCBwYWdlIHNjcm9sbGJhcnMgaXNzdWVcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdzaG93LmJzLm1vZGFsJywgJy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJtb2RhbC1zY3JvbGxcIikpIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJtb2RhbC1vcGVuLW5vc2Nyb2xsXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmaXggcGFnZSBzY3JvbGxiYXJzIGlzc3VlXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZS5icy5tb2RhbCcsICcubW9kYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcIm1vZGFsLW9wZW4tbm9zY3JvbGxcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJlbW92ZSBhamF4IGNvbnRlbnQgYW5kIHJlbW92ZSBjYWNoZSBvbiBtb2RhbCBjbG9zZWRcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCAnLm1vZGFsOm5vdCgubW9kYWwtY2FjaGVkKScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlRGF0YSgnYnMubW9kYWwnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIFRvb2x0aXBzLlxuICAgIHZhciBoYW5kbGVUb29sdGlwcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBnbG9iYWwgdG9vbHRpcHNcbiAgICAgICAgJCgnLnRvb2x0aXBzJykudG9vbHRpcCgpO1xuXG4gICAgICAgIC8vIHBvcnRsZXQgdG9vbHRpcHNcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicpLnRvb2x0aXAoe1xuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXG4gICAgICAgICAgICB0aXRsZTogJ0Z1bGxzY3JlZW4nXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbG9hZCcpLnRvb2x0aXAoe1xuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXG4gICAgICAgICAgICB0aXRsZTogJ1JlbG9hZCdcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVtb3ZlJykudG9vbHRpcCh7XG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcbiAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb25maWcnKS50b29sdGlwKHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxuICAgICAgICAgICAgdGl0bGU6ICdTZXR0aW5ncydcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJykudG9vbHRpcCh7XG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcbiAgICAgICAgICAgIHRpdGxlOiAnQ29sbGFwc2UvRXhwYW5kJ1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgRHJvcGRvd25zXG4gICAgdmFyIGhhbmRsZURyb3Bkb3ducyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKlxuICAgICAgICAgIEhvbGQgZHJvcGRvd24gb24gY2xpY2tcbiAgICAgICAgKi9cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcuZHJvcGRvd24tbWVudS5ob2xkLW9uLWNsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBoYW5kbGVBbGVydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdbZGF0YS1jbG9zZT1cImFsZXJ0XCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJy5hbGVydCcpLmhpZGUoKTtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5oaWRlKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtY2xvc2U9XCJub3RlXCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLmhpZGUoKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdbZGF0YS1yZW1vdmU9XCJub3RlXCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIEhvd2VyIERyb3Bkb3duc1xuICAgIHZhciBoYW5kbGVEcm9wZG93bkhvdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJ1tkYXRhLWhvdmVyPVwiZHJvcGRvd25cIl0nKS5ub3QoJy5ob3Zlci1pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmRyb3Bkb3duSG92ZXIoKTtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyLWluaXRpYWxpemVkJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGV4dGFyZWEgYXV0b3NpemVcbiAgICB2YXIgaGFuZGxlVGV4dGFyZWFBdXRvc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHlwZW9mKGF1dG9zaXplKSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGF1dG9zaXplKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhLmF1dG9zaXplbWUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBQb3BvdmVyc1xuXG4gICAgLy8gbGFzdCBwb3BlcCBwb3BvdmVyXG4gICAgdmFyIGxhc3RQb3BlZFBvcG92ZXI7XG5cbiAgICB2YXIgaGFuZGxlUG9wb3ZlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBvcG92ZXJzJykucG9wb3ZlcigpO1xuXG4gICAgICAgIC8vIGNsb3NlIGxhc3QgZGlzcGxheWVkIHBvcG92ZXJcblxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMucG9wb3Zlci5kYXRhLWFwaScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChsYXN0UG9wZWRQb3BvdmVyKSB7XG4gICAgICAgICAgICAgICAgbGFzdFBvcGVkUG9wb3Zlci5wb3BvdmVyKCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHNjcm9sbGFibGUgY29udGVudHMgdXNpbmcgalF1ZXJ5IFNsaW1TY3JvbGwgcGx1Z2luLlxuICAgIHZhciBoYW5kbGVTY3JvbGxlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoJy5zY3JvbGxlcicpO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEltYWdlIFByZXZpZXcgdXNpbmcgalF1ZXJ5IEZhbmN5Ym94IHBsdWdpblxuICAgIHZhciBoYW5kbGVGYW5jeWJveCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIWpRdWVyeS5mYW5jeWJveCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoXCIuZmFuY3lib3gtYnV0dG9uXCIpLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgICQoXCIuZmFuY3lib3gtYnV0dG9uXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgICAgICAgICBncm91cEF0dHI6ICdkYXRhLXJlbCcsXG4gICAgICAgICAgICAgICAgcHJldkVmZmVjdDogJ25vbmUnLFxuICAgICAgICAgICAgICAgIG5leHRFZmZlY3Q6ICdub25lJyxcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoZWxwZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5zaWRlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRml4IGlucHV0IHBsYWNlaG9sZGVyIGlzc3VlIGZvciBJRTggYW5kIElFOVxuICAgIHZhciBoYW5kbGVGaXhJbnB1dFBsYWNlaG9sZGVyRm9ySUUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9maXggaHRtbDUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIGZvciBpZTcgJiBpZThcbiAgICAgICAgaWYgKGlzSUU4IHx8IGlzSUU5KSB7IC8vIGllOCAmIGllOVxuICAgICAgICAgICAgLy8gdGhpcyBpcyBodG1sNSBwbGFjZWhvbGRlciBmaXggZm9yIGlucHV0cywgaW5wdXRzIHdpdGggcGxhY2Vob2xkZXItbm8tZml4IGNsYXNzIHdpbGwgYmUgc2tpcHBlZChlLmc6IHdlIG5lZWQgdGhpcyBmb3IgcGFzc3dvcmQgZmllbGRzKVxuICAgICAgICAgICAgJCgnaW5wdXRbcGxhY2Vob2xkZXJdOm5vdCgucGxhY2Vob2xkZXItbm8tZml4KSwgdGV4dGFyZWFbcGxhY2Vob2xkZXJdOm5vdCgucGxhY2Vob2xkZXItbm8tZml4KScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PT0gJycgJiYgaW5wdXQuYXR0cihcInBsYWNlaG9sZGVyXCIpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5hZGRDbGFzcyhcInBsYWNlaG9sZGVyXCIpLnZhbChpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5mb2N1cyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbCgpID09IGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmJsdXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PT0gJycgfHwgaW5wdXQudmFsKCkgPT0gaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsKGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgU2VsZWN0MiBEcm9wZG93bnNcbiAgICB2YXIgaGFuZGxlU2VsZWN0MiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCgpLnNlbGVjdDIpIHtcbiAgICAgICAgICAgICQoJy5zZWxlY3QybWUnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJTZWxlY3RcIixcbiAgICAgICAgICAgICAgICBhbGxvd0NsZWFyOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBoYW5kbGUgZ3JvdXAgZWxlbWVudCBoZWlnaHRzXG4gICAgdmFyIGhhbmRsZUhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICQoJ1tkYXRhLWF1dG8taGVpZ2h0XScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBpdGVtcyA9ICQoJ1tkYXRhLWhlaWdodF0nLCBwYXJlbnQpO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDA7XG4gICAgICAgICAgICB2YXIgbW9kZSA9IHBhcmVudC5hdHRyKCdkYXRhLW1vZGUnKTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBwYXJzZUludChwYXJlbnQuYXR0cignZGF0YS1vZmZzZXQnKSA/IHBhcmVudC5hdHRyKCdkYXRhLW9mZnNldCcpIDogMCk7XG5cbiAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1oZWlnaHQnKSA9PSBcImhlaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ21pbi1oZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodF8gPSAobW9kZSA9PSAnYmFzZS1oZWlnaHQnID8gJCh0aGlzKS5vdXRlckhlaWdodCgpIDogJCh0aGlzKS5vdXRlckhlaWdodCh0cnVlKSk7XG4gICAgICAgICAgICAgICAgaWYgKGhlaWdodF8gPiBoZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0XztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0ICsgb2Zmc2V0O1xuXG4gICAgICAgICAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtaGVpZ2h0JykgPT0gXCJoZWlnaHRcIikge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnbWluLWhlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8qIEVORDpDT1JFIEhBTkRMRVJTICovL1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgdGhlIHRoZW1lXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9JTVBPUlRBTlQhISE6IERvIG5vdCBtb2RpZnkgdGhlIGNvcmUgaGFuZGxlcnMgY2FsbCBvcmRlci5cblxuICAgICAgICAgICAgLy9Db3JlIGhhbmRsZXJzXG4gICAgICAgICAgICBoYW5kbGVJbml0KCk7IC8vIGluaXRpYWxpemUgY29yZSB2YXJpYWJsZXNcbiAgICAgICAgICAgIGhhbmRsZU9uUmVzaXplKCk7IC8vIHNldCBhbmQgaGFuZGxlIHJlc3BvbnNpdmVcblxuICAgICAgICAgICAgLy9VSSBDb21wb25lbnQgaGFuZGxlcnNcbiAgICAgICAgICAgIGhhbmRsZU1hdGVyaWFsRGVzaWduKCk7IC8vIGhhbmRsZSBtYXRlcmlhbCBkZXNpZ25cbiAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTsgLy8gaGFuZmxlIGN1c3RvbSByYWRpbyAmIGNoZWNrYm94ZXNcbiAgICAgICAgICAgIGhhbmRsZWlDaGVjaygpOyAvLyBoYW5kbGVzIGN1c3RvbSBpY2hlY2sgcmFkaW8gYW5kIGNoZWNrYm94ZXNcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcFN3aXRjaCgpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHN3aXRjaCBwbHVnaW5cbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbGVycygpOyAvLyBoYW5kbGVzIHNsaW0gc2Nyb2xsaW5nIGNvbnRlbnRzXG4gICAgICAgICAgICBoYW5kbGVGYW5jeWJveCgpOyAvLyBoYW5kbGUgZmFuY3kgYm94XG4gICAgICAgICAgICBoYW5kbGVTZWxlY3QyKCk7IC8vIGhhbmRsZSBjdXN0b20gU2VsZWN0MiBkcm9wZG93bnNcbiAgICAgICAgICAgIGhhbmRsZVBvcnRsZXRUb29scygpOyAvLyBoYW5kbGVzIHBvcnRsZXQgYWN0aW9uIGJhciBmdW5jdGlvbmFsaXR5KHJlZnJlc2gsIGNvbmZpZ3VyZSwgdG9nZ2xlLCByZW1vdmUpXG4gICAgICAgICAgICBoYW5kbGVBbGVydHMoKTsgLy9oYW5kbGUgY2xvc2FibGVkIGFsZXJ0c1xuICAgICAgICAgICAgaGFuZGxlRHJvcGRvd25zKCk7IC8vIGhhbmRsZSBkcm9wZG93bnNcbiAgICAgICAgICAgIGhhbmRsZVRhYnMoKTsgLy8gaGFuZGxlIHRhYnNcbiAgICAgICAgICAgIGhhbmRsZVRvb2x0aXBzKCk7IC8vIGhhbmRsZSBib290c3RyYXAgdG9vbHRpcHNcbiAgICAgICAgICAgIGhhbmRsZVBvcG92ZXJzKCk7IC8vIGhhbmRsZXMgYm9vdHN0cmFwIHBvcG92ZXJzXG4gICAgICAgICAgICBoYW5kbGVBY2NvcmRpb25zKCk7IC8vaGFuZGxlcyBhY2NvcmRpb25zXG4gICAgICAgICAgICBoYW5kbGVNb2RhbHMoKTsgLy8gaGFuZGxlIG1vZGFsc1xuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uKCk7IC8vIGhhbmRsZSBib290c3RyYXAgY29uZmlybWF0aW9uc1xuICAgICAgICAgICAgaGFuZGxlVGV4dGFyZWFBdXRvc2l6ZSgpOyAvLyBoYW5kbGUgYXV0b3NpemUgdGV4dGFyZWFzXG5cbiAgICAgICAgICAgIC8vSGFuZGxlIGdyb3VwIGVsZW1lbnQgaGVpZ2h0c1xuICAgICAgICAgICAgaGFuZGxlSGVpZ2h0KCk7XG4gICAgICAgICAgICB0aGlzLmFkZFJlc2l6ZUhhbmRsZXIoaGFuZGxlSGVpZ2h0KTsgLy8gaGFuZGxlIGF1dG8gY2FsY3VsYXRpbmcgaGVpZ2h0IG9uIHdpbmRvdyByZXNpemVcblxuICAgICAgICAgICAgLy8gSGFja3NcbiAgICAgICAgICAgIGhhbmRsZUZpeElucHV0UGxhY2Vob2xkZXJGb3JJRSgpOyAvL0lFOCAmIElFOSBpbnB1dCBwbGFjZWhvbGRlciBpc3N1ZSBmaXhcbiAgICAgICAgfSxcblxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgY29yZSBqYXZhc2NyaXB0IGFmdGVyIGFqYXggY29tcGxldGVcbiAgICAgICAgaW5pdEFqYXg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlVW5pZm9ybSgpOyAvLyBoYW5kbGVzIGN1c3RvbSByYWRpbyAmIGNoZWNrYm94ZXNcbiAgICAgICAgICAgIGhhbmRsZWlDaGVjaygpOyAvLyBoYW5kbGVzIGN1c3RvbSBpY2hlY2sgcmFkaW8gYW5kIGNoZWNrYm94ZXNcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcFN3aXRjaCgpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHN3aXRjaCBwbHVnaW5cbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3duSG92ZXIoKTsgLy8gaGFuZGxlcyBkcm9wZG93biBob3ZlclxuICAgICAgICAgICAgaGFuZGxlU2Nyb2xsZXJzKCk7IC8vIGhhbmRsZXMgc2xpbSBzY3JvbGxpbmcgY29udGVudHNcbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdDIoKTsgLy8gaGFuZGxlIGN1c3RvbSBTZWxlY3QyIGRyb3Bkb3duc1xuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTsgLy8gaGFuZGxlIGZhbmN5IGJveFxuICAgICAgICAgICAgaGFuZGxlRHJvcGRvd25zKCk7IC8vIGhhbmRsZSBkcm9wZG93bnNcbiAgICAgICAgICAgIGhhbmRsZVRvb2x0aXBzKCk7IC8vIGhhbmRsZSBib290c3RyYXAgdG9vbHRpcHNcbiAgICAgICAgICAgIGhhbmRsZVBvcG92ZXJzKCk7IC8vIGhhbmRsZXMgYm9vdHN0cmFwIHBvcG92ZXJzXG4gICAgICAgICAgICBoYW5kbGVBY2NvcmRpb25zKCk7IC8vaGFuZGxlcyBhY2NvcmRpb25zXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBDb25maXJtYXRpb24oKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBjb25maXJtYXRpb25zXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9pbml0IG1haW4gY29tcG9uZW50c1xuICAgICAgICBpbml0Q29tcG9uZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRBamF4KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gcmVtZW1iZXIgbGFzdCBvcGVuZWQgcG9wb3ZlciB0aGF0IG5lZWRzIHRvIGJlIGNsb3NlZCBvbiBjbGlja1xuICAgICAgICBzZXRMYXN0UG9wZWRQb3BvdmVyOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbGFzdFBvcGVkUG9wb3ZlciA9IGVsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGFkZCBjYWxsYmFjayBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIG9uIHdpbmRvdyByZXNpemVcbiAgICAgICAgYWRkUmVzaXplSGFuZGxlcjogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgICAgcmVzaXplSGFuZGxlcnMucHVzaChmdW5jKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdG9uIHRvIGNhbGwgX3J1bnJlc2l6ZUhhbmRsZXJzXG4gICAgICAgIHJ1blJlc2l6ZUhhbmRsZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9ydW5SZXNpemVIYW5kbGVycygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byBzY3JvbGwoZm9jdXMpIHRvIGFuIGVsZW1lbnRcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uKGVsLCBvZmZlc2V0KSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gKGVsICYmIGVsLnNpemUoKSA+IDApID8gZWwub2Zmc2V0KCkudG9wIDogMDtcblxuICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItZml4ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBwb3MgLSAkKCcucGFnZS1oZWFkZXInKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItdG9wLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyLXRvcCcpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWhlYWRlci1tZW51LWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyLW1lbnUnKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcG9zID0gcG9zICsgKG9mZmVzZXQgPyBvZmZlc2V0IDogLTEgKiBlbC5oZWlnaHQoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcG9zXG4gICAgICAgICAgICB9LCAnc2xvdycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRTbGltU2Nyb2xsOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgJChlbCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIGV4aXRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaGVpZ2h0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9ICQodGhpcykuYXR0cihcImRhdGEtaGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9ICQodGhpcykuY3NzKCdoZWlnaHQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaW1TY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICBhbGxvd1BhZ2VTY3JvbGw6IHRydWUsIC8vIGFsbG93IHBhZ2Ugc2Nyb2xsIHdoZW4gdGhlIGVsZW1lbnQgc2Nyb2xsIGlzIGVuZGVkXG4gICAgICAgICAgICAgICAgICAgIHNpemU6ICc3cHgnLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogKCQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIikgOiAnI2JiYicpLFxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxuICAgICAgICAgICAgICAgICAgICByYWlsQ29sb3I6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikgOiAnI2VhZWFlYScpLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogaXNSVEwgPyAnbGVmdCcgOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgYWx3YXlzVmlzaWJsZTogKCQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIikgPT0gXCIxXCIgPyB0cnVlIDogZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgICByYWlsVmlzaWJsZTogKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC12aXNpYmxlXCIpID09IFwiMVwiID8gdHJ1ZSA6IGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUZhZGVPdXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIiwgXCIxXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveVNsaW1TY3JvbGw6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAkKGVsKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpID09PSBcIjFcIikgeyAvLyBkZXN0cm95IGV4aXN0aW5nIGluc3RhbmNlIGJlZm9yZSB1cGRhdGluZyB0aGUgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQXR0cihcInN0eWxlXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyTGlzdCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBjdXN0b20gYXR0cmlidXJlcyBzbyBsYXRlciB3ZSB3aWxsIHJlYXNzaWduLlxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1oYW5kbGUtY29sb3JcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtd3JhcHBlci1jbGFzc1wiXSA9ICQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLWNvbG9yXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtcmFpbC1jb2xvclwiXSA9ICQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1hbHdheXMtdmlzaWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLWFsd2F5cy12aXNpYmxlXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1hbHdheXMtdmlzaWJsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLXZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1yYWlsLXZpc2libGVcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2xpbVNjcm9sbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyByZWFzc2lnbiBjdXN0b20gYXR0cmlidXRlc1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goYXR0ckxpc3QsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZS5hdHRyKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGZ1bmN0aW9uIHRvIHNjcm9sbCB0byB0aGUgdG9wXG4gICAgICAgIHNjcm9sbFRvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byAgYmxvY2sgZWxlbWVudChpbmRpY2F0ZSBsb2FkaW5nKVxuICAgICAgICBibG9ja1VJOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xuICAgICAgICAgICAgdmFyIGh0bWwgPSAnJztcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+JyArICc8ZGl2IGNsYXNzPVwiYmxvY2stc3Bpbm5lci1iYXJcIj48ZGl2IGNsYXNzPVwiYm91bmNlMVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UyXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTNcIj48L2Rpdj48L2Rpdj4nICsgJzwvZGl2Pic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaWNvbk9ubHkpIHtcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIgYWxpZ249XCJcIj48L2Rpdj4nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnRleHRPbmx5KSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPjxzcGFuPiZuYnNwOyZuYnNwOycgKyAob3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xPQURJTkcuLi4nKSArICc8L3NwYW4+PC9kaXY+JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiIGFsaWduPVwiXCI+PHNwYW4+Jm5ic3A7Jm5ic3A7JyArIChvcHRpb25zLm1lc3NhZ2UgPyBvcHRpb25zLm1lc3NhZ2UgOiAnTE9BRElORy4uLicpICsgJzwvc3Bhbj48L2Rpdj4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50YXJnZXQpIHsgLy8gZWxlbWVudCBibG9ja2luZ1xuICAgICAgICAgICAgICAgIHZhciBlbCA9ICQob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlmIChlbC5oZWlnaHQoKSA8PSAoJCh3aW5kb3cpLmhlaWdodCgpKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNlbnJlclkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbC5ibG9jayh7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGh0bWwsXG4gICAgICAgICAgICAgICAgICAgIGJhc2VaOiBvcHRpb25zLnpJbmRleCA/IG9wdGlvbnMuekluZGV4IDogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyWTogb3B0aW9ucy5jZW5yZXJZICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNlbnJlclkgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICcxMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q1NTOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG9wdGlvbnMub3ZlcmxheUNvbG9yID8gb3B0aW9ucy5vdmVybGF5Q29sb3IgOiAnIzU1NScsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3dhaXQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIHBhZ2UgYmxvY2tpbmdcbiAgICAgICAgICAgICAgICAkLmJsb2NrVUkoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBodG1sLFxuICAgICAgICAgICAgICAgICAgICBiYXNlWjogb3B0aW9ucy56SW5kZXggPyBvcHRpb25zLnpJbmRleCA6IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q1NTOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG9wdGlvbnMub3ZlcmxheUNvbG9yID8gb3B0aW9ucy5vdmVybGF5Q29sb3IgOiAnIzU1NScsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3dhaXQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gIHVuLWJsb2NrIGVsZW1lbnQoZmluaXNoIGxvYWRpbmcpXG4gICAgICAgIHVuYmxvY2tVSTogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgJCh0YXJnZXQpLnVuYmxvY2soe1xuICAgICAgICAgICAgICAgICAgICBvblVuYmxvY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YXJnZXQpLmNzcygncG9zaXRpb24nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRhcmdldCkuY3NzKCd6b29tJywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQudW5ibG9ja1VJKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhcnRQYWdlTG9hZGluZzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2Utc3Bpbm5lci1iYXInKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGFnZS1zcGlubmVyLWJhclwiPjxkaXYgY2xhc3M9XCJib3VuY2UxXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlM1wiPjwvZGl2PjwvZGl2PicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1sb2FkaW5nJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInBhZ2UtbG9hZGluZ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiLz4mbmJzcDsmbmJzcDs8c3Bhbj4nICsgKG9wdGlvbnMgJiYgb3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xvYWRpbmcuLi4nKSArICc8L3NwYW4+PC9kaXY+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RvcFBhZ2VMb2FkaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJy5wYWdlLWxvYWRpbmcsIC5wYWdlLXNwaW5uZXItYmFyJykucmVtb3ZlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWxlcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXI6IFwiXCIsIC8vIGFsZXJ0cyBwYXJlbnQgY29udGFpbmVyKGJ5IGRlZmF1bHQgcGxhY2VkIGFmdGVyIHRoZSBwYWdlIGJyZWFkY3J1bWJzKVxuICAgICAgICAgICAgICAgIHBsYWNlOiBcImFwcGVuZFwiLCAvLyBcImFwcGVuZFwiIG9yIFwicHJlcGVuZFwiIGluIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJywgLy8gYWxlcnQncyB0eXBlXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJcIiwgLy8gYWxlcnQncyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgY2xvc2U6IHRydWUsIC8vIG1ha2UgYWxlcnQgY2xvc2FibGVcbiAgICAgICAgICAgICAgICByZXNldDogdHJ1ZSwgLy8gY2xvc2UgYWxsIHByZXZpb3VzZSBhbGVydHMgZmlyc3RcbiAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSwgLy8gYXV0byBzY3JvbGwgdG8gdGhlIGFsZXJ0IGFmdGVyIHNob3duXG4gICAgICAgICAgICAgICAgY2xvc2VJblNlY29uZHM6IDAsIC8vIGF1dG8gY2xvc2UgYWZ0ZXIgZGVmaW5lZCBzZWNvbmRzXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIiAvLyBwdXQgaWNvbiBiZWZvcmUgdGhlIG1lc3NhZ2VcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB2YXIgaWQgPSBNZXRyb25pYy5nZXRVbmlxdWVJRChcIk1ldHJvbmljX2FsZXJ0XCIpO1xuXG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwiTWV0cm9uaWMtYWxlcnRzIGFsZXJ0IGFsZXJ0LScgKyBvcHRpb25zLnR5cGUgKyAnIGZhZGUgaW5cIj4nICsgKG9wdGlvbnMuY2xvc2UgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9idXR0b24+JyA6ICcnKSArIChvcHRpb25zLmljb24gIT09IFwiXCIgPyAnPGkgY2xhc3M9XCJmYS1sZyBmYSBmYS0nICsgb3B0aW9ucy5pY29uICsgJ1wiPjwvaT4gICcgOiAnJykgKyBvcHRpb25zLm1lc3NhZ2UgKyAnPC9kaXY+JztcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucmVzZXQpIHtcbiAgICAgICAgICAgICAgICAkKCcuTWV0cm9uaWMtYWxlcnRzJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1jb250YWluZXItYmctc29saWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtdGl0bGUnKS5hZnRlcihodG1sKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnLnBhZ2UtYmFyJykuc2l6ZSgpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtYmFyJykuYWZ0ZXIoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1icmVhZGNydW1iJykuYWZ0ZXIoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnBsYWNlID09IFwiYXBwZW5kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJChvcHRpb25zLmNvbnRhaW5lcikuYXBwZW5kKGh0bWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQob3B0aW9ucy5jb250YWluZXIpLnByZXBlbmQoaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5mb2N1cykge1xuICAgICAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvKCQoJyMnICsgaWQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2xvc2VJblNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnIycgKyBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSwgb3B0aW9ucy5jbG9zZUluU2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZXMgdW5pZm9ybSBlbGVtZW50c1xuICAgICAgICBpbml0VW5pZm9ybTogZnVuY3Rpb24oZWxzKSB7XG4gICAgICAgICAgICBpZiAoZWxzKSB7XG4gICAgICAgICAgICAgICAgJChlbHMpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudHMoXCIuY2hlY2tlclwiKS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS51bmlmb3JtKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5pZm9ybSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvIHVwZGF0ZS9zeW5jIGpxdWVyeSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zXG4gICAgICAgIHVwZGF0ZVVuaWZvcm06IGZ1bmN0aW9uKGVscykge1xuICAgICAgICAgICAgJC51bmlmb3JtLnVwZGF0ZShlbHMpOyAvLyB1cGRhdGUgdGhlIHVuaWZvcm0gY2hlY2tib3ggJiByYWRpb3MgVUkgYWZ0ZXIgdGhlIGFjdHVhbCBpbnB1dCBjb250cm9sIHN0YXRlIGNoYW5nZWRcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBpbml0aWFsaXplIHRoZSBmYW5jeWJveCBwbHVnaW5cbiAgICAgICAgaW5pdEZhbmN5Ym94OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZUZhbmN5Ym94KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wdWJsaWMgaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBhY3R1YWwgaW5wdXQgdmFsdWUodXNlZCBpbiBJRTkgYW5kIElFOCBkdWUgdG8gcGxhY2Vob2xkZXIgYXR0cmlidXRlIG5vdCBzdXBwb3J0ZWQpXG4gICAgICAgIGdldEFjdHVhbFZhbDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGVsID0gJChlbCk7XG4gICAgICAgICAgICBpZiAoZWwudmFsKCkgPT09IGVsLmF0dHIoXCJwbGFjZWhvbGRlclwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsLnZhbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGdldCBhIHBhcmVtZXRlciBieSBuYW1lIGZyb20gVVJMXG4gICAgICAgIGdldFVSTFBhcmFtZXRlcjogZnVuY3Rpb24ocGFyYW1OYW1lKSB7XG4gICAgICAgICAgICB2YXIgc2VhcmNoU3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSksXG4gICAgICAgICAgICAgICAgaSwgdmFsLCBwYXJhbXMgPSBzZWFyY2hTdHJpbmcuc3BsaXQoXCImXCIpO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gcGFyYW1zW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsWzBdID09IHBhcmFtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5lc2NhcGUodmFsWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjaGVjayBmb3IgZGV2aWNlIHRvdWNoIHN1cHBvcnRcbiAgICAgICAgaXNUb3VjaERldmljZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiVG91Y2hFdmVudFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gZ2V0IHRoZSBjb3JyZWN0IHZpZXdwb3J0IHdpZHRoIGJhc2VkIG9uICBodHRwOi8vYW5keWxhbmd0b24uY28udWsvYXJ0aWNsZXMvamF2YXNjcmlwdC9nZXQtdmlld3BvcnQtc2l6ZS1qYXZhc2NyaXB0L1xuICAgICAgICBnZXRWaWV3UG9ydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZSA9IHdpbmRvdyxcbiAgICAgICAgICAgICAgICBhID0gJ2lubmVyJztcbiAgICAgICAgICAgIGlmICghKCdpbm5lcldpZHRoJyBpbiB3aW5kb3cpKSB7XG4gICAgICAgICAgICAgICAgYSA9ICdjbGllbnQnO1xuICAgICAgICAgICAgICAgIGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogZVthICsgJ1dpZHRoJ10sXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBlW2EgKyAnSGVpZ2h0J11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VW5pcXVlSUQ6IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgICAgICAgcmV0dXJuICdwcmVmaXhfJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGNoZWNrIElFOCBtb2RlXG4gICAgICAgIGlzSUU4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0lFODtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjaGVjayBJRTkgbW9kZVxuICAgICAgICBpc0lFOTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNJRTk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9jaGVjayBSVEwgbW9kZVxuICAgICAgICBpc1JUTDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNSVEw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hlY2sgSUU4IG1vZGVcbiAgICAgICAgaXNBbmd1bGFySnNBcHA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgYW5ndWxhciA9PSAndW5kZWZpbmVkJykgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0QXNzZXRzUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRBc3NldHNQYXRoOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgICAgICBhc3NldHNQYXRoID0gcGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRHbG9iYWxJbWdQYXRoOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgICAgICBnbG9iYWxJbWdQYXRoID0gcGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRHbG9iYWxJbWdQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NldHNQYXRoICsgZ2xvYmFsSW1nUGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRHbG9iYWxQbHVnaW5zUGF0aDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgZ2xvYmFsUGx1Z2luc1BhdGggPSBwYXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdsb2JhbFBsdWdpbnNQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NldHNQYXRoICsgZ2xvYmFsUGx1Z2luc1BhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0R2xvYmFsQ3NzUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbENzc1BhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gZ2V0IGxheW91dCBjb2xvciBjb2RlIGJ5IGNvbG9yIG5hbWVcbiAgICAgICAgZ2V0QnJhbmRDb2xvcjogZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgaWYgKGJyYW5kQ29sb3JzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJyYW5kQ29sb3JzW25hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmVzcG9uc2l2ZUJyZWFrcG9pbnQ6IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgICAgICAgIC8vIGJvb3RzdHJhcCByZXNwb25zaXZlIGJyZWFrcG9pbnRzXG4gICAgICAgICAgICB2YXIgc2l6ZXMgPSB7XG4gICAgICAgICAgICAgICAgJ3hzJyA6IDQ4MCwgICAgIC8vIGV4dHJhIHNtYWxsXG4gICAgICAgICAgICAgICAgJ3NtJyA6IDc2OCwgICAgIC8vIHNtYWxsXG4gICAgICAgICAgICAgICAgJ21kJyA6IDk5MiwgICAgIC8vIG1lZGl1bVxuICAgICAgICAgICAgICAgICdsZycgOiAxMjAwICAgICAvLyBsYXJnZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHNpemVzW3NpemVdID8gc2l6ZXNbc2l6ZV0gOiAwO1xuICAgICAgICB9XG4gICAgfTtcblxufSAoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXRyb25pYzsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbmNvbnN0IE1ldHJvbmljID0gcmVxdWlyZSgnLi9tZXRyb25pYycpXG5cbi8qKlxuQ29yZSBzY3JpcHQgdG8gaGFuZGxlIHRoZSBlbnRpcmUgdGhlbWUgYW5kIGNvcmUgZnVuY3Rpb25zXG4qKi9cbnZhciBRdWlja1NpZGViYXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgdG9nZ2xlclxuICAgIHZhciBoYW5kbGVRdWlja1NpZGViYXJUb2dnbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBxdWljayBzaWRlYmFyIHRvZ2dsZXJcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5xdWljay1zaWRlYmFyLXRvZ2dsZXIsIC5wYWdlLXF1aWNrLXNpZGViYXItdG9nZ2xlcicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3BhZ2UtcXVpY2stc2lkZWJhci1vcGVuJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgY2hhdHNcbiAgICB2YXIgaGFuZGxlUXVpY2tTaWRlYmFyQ2hhdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSAkKCcucGFnZS1xdWljay1zaWRlYmFyLXdyYXBwZXInKTtcbiAgICAgICAgdmFyIHdyYXBwZXJDaGF0ID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQnKTtcblxuICAgICAgICB2YXIgaW5pdENoYXRTbGltU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNoYXRVc2VycyA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJzJyk7XG4gICAgICAgICAgICB2YXIgY2hhdFVzZXJzSGVpZ2h0O1xuXG4gICAgICAgICAgICBjaGF0VXNlcnNIZWlnaHQgPSB3cmFwcGVyLmhlaWdodCgpIC0gd3JhcHBlci5maW5kKCcubmF2LWp1c3RpZmllZCA+IC5uYXYtdGFicycpLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIC8vIGNoYXQgdXNlciBsaXN0XG4gICAgICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChjaGF0VXNlcnMpO1xuICAgICAgICAgICAgY2hhdFVzZXJzLmF0dHIoXCJkYXRhLWhlaWdodFwiLCBjaGF0VXNlcnNIZWlnaHQpO1xuICAgICAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoY2hhdFVzZXJzKTtcblxuICAgICAgICAgICAgdmFyIGNoYXRNZXNzYWdlcyA9IHdyYXBwZXJDaGF0LmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyLW1lc3NhZ2VzJyk7XG4gICAgICAgICAgICB2YXIgY2hhdE1lc3NhZ2VzSGVpZ2h0ID0gY2hhdFVzZXJzSGVpZ2h0IC0gd3JhcHBlckNoYXQuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItZm9ybScpLm91dGVySGVpZ2h0KCkgLSB3cmFwcGVyQ2hhdC5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLW5hdicpLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIC8vIHVzZXIgY2hhdCBtZXNzYWdlc1xuICAgICAgICAgICAgTWV0cm9uaWMuZGVzdHJveVNsaW1TY3JvbGwoY2hhdE1lc3NhZ2VzKTtcbiAgICAgICAgICAgIGNoYXRNZXNzYWdlcy5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgY2hhdE1lc3NhZ2VzSGVpZ2h0KTtcbiAgICAgICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGNoYXRNZXNzYWdlcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaW5pdENoYXRTbGltU2Nyb2xsKCk7XG4gICAgICAgIE1ldHJvbmljLmFkZFJlc2l6ZUhhbmRsZXIoaW5pdENoYXRTbGltU2Nyb2xsKTsgLy8gcmVpbml0aWFsaXplIG9uIHdpbmRvdyByZXNpemVcblxuICAgICAgICB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VycyAubWVkaWEtbGlzdCA+IC5tZWRpYScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdyYXBwZXJDaGF0LmFkZENsYXNzKFwicGFnZS1xdWljay1zaWRlYmFyLWNvbnRlbnQtaXRlbS1zaG93blwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlciAucGFnZS1xdWljay1zaWRlYmFyLWJhY2stdG8tbGlzdCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdyYXBwZXJDaGF0LnJlbW92ZUNsYXNzKFwicGFnZS1xdWljay1zaWRlYmFyLWNvbnRlbnQtaXRlbS1zaG93blwiKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgcXVpY2sgc2lkZWJhciB0YXNrc1xuICAgIHZhciBoYW5kbGVRdWlja1NpZGViYXJBbGVydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0gJCgnLnBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyJyk7XG4gICAgICAgIHZhciB3cmFwcGVyQWxlcnRzID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cycpO1xuXG4gICAgICAgIHZhciBpbml0QWxlcnRzU2xpbVNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhbGVydExpc3QgPSB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItYWxlcnRzLWxpc3QnKTtcbiAgICAgICAgICAgIHZhciBhbGVydExpc3RIZWlnaHQ7XG5cbiAgICAgICAgICAgIGFsZXJ0TGlzdEhlaWdodCA9IHdyYXBwZXIuaGVpZ2h0KCkgLSB3cmFwcGVyLmZpbmQoJy5uYXYtanVzdGlmaWVkID4gLm5hdi10YWJzJykub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgLy8gYWxlcnRzIGxpc3RcbiAgICAgICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKGFsZXJ0TGlzdCk7XG4gICAgICAgICAgICBhbGVydExpc3QuYXR0cihcImRhdGEtaGVpZ2h0XCIsIGFsZXJ0TGlzdEhlaWdodCk7XG4gICAgICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbChhbGVydExpc3QpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGluaXRBbGVydHNTbGltU2Nyb2xsKCk7XG4gICAgICAgIE1ldHJvbmljLmFkZFJlc2l6ZUhhbmRsZXIoaW5pdEFsZXJ0c1NsaW1TY3JvbGwpOyAvLyByZWluaXRpYWxpemUgb24gd2luZG93IHJlc2l6ZVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vbGF5b3V0IGhhbmRsZXJzXG4gICAgICAgICAgICBoYW5kbGVRdWlja1NpZGViYXJUb2dnbGVyKCk7IC8vIGhhbmRsZXMgcXVpY2sgc2lkZWJhcidzIHRvZ2dsZXJcbiAgICAgICAgICAgIGhhbmRsZVF1aWNrU2lkZWJhckNoYXQoKTsgLy8gaGFuZGxlcyBxdWljayBzaWRlYmFyJ3MgY2hhdHNcbiAgICAgICAgICAgIGhhbmRsZVF1aWNrU2lkZWJhckFsZXJ0cygpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyBhbGVydHNcbiAgICAgICAgfVxuICAgIH07XG5cbn0gKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gUXVpY2tTaWRlYmFyIiwiY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5cbmNsYXNzIENvbW1vbiB7XG5cbiAgICBzdGF0aWMgc3BsaXRMaW5lcyh0ZXh0KSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnNwbGl0KC9cXG4vKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RXZlbnRUaW1lKHQsIG5vdykge1xuICAgICAgICBsZXQgdGltZSA9IG1vbWVudCh0LCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnKTtcbiAgICAgICAgbGV0IG5vd3RpbWUgPSBtb21lbnQobm93LCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3Q6ICAgICAgICcgKyB0KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vdzogICAgICcgKyBub3cpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndGltZTogICAgJyArIHRpbWUuZm9ybWF0KCkpOyAvLyArICcgJyArIHRpbWUuaXNWYWxpZCgpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vd3RpbWU6ICcgKyBub3d0aW1lLmZvcm1hdCgpKTsgLy8gKyAnICcgKyBub3d0aW1lLmlzVmFsaWQoKSk7XG4gICAgICAgIHJldHVybiB0aW1lLmZyb20obm93dGltZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNsYXNzSWYoa2xhc3MsIGIpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2xhc3NJZjogJyArIGtsYXNzICsgJywgJyArIGIpO1xuICAgICAgICByZXR1cm4gKGIgPyBrbGFzcyA6ICcnKTtcbiAgICB9XG5cbiAgICAvLyBhdm9pZCAnJGFwcGx5IGFscmVhZHkgaW4gcHJvZ3Jlc3MnIGVycm9yIChzb3VyY2U6IGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wL25naXNtYSlcbiAgICBzdGF0aWMgc2FmZUFwcGx5KGZuKSB7XG4gICAgICAgIGlmIChmbiAmJiAodHlwZW9mIChmbikgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICBmbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc291cmNlOiBodHRwOi8vY3RybHEub3JnL2NvZGUvMTk2MTYtZGV0ZWN0LXRvdWNoLXNjcmVlbi1qYXZhc2NyaXB0XG4gICAgc3RhdGljIGlzVG91Y2hEZXZpY2UoKSB7XG4gICAgICAgIHJldHVybiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgKG5hdmlnYXRvci5NYXhUb3VjaFBvaW50cyA+IDApIHx8IChuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDApKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0VGlja3NGcm9tRGF0ZShkYXRlKSB7XG4gICAgICAgIGxldCByZXQgPSBudWxsO1xuICAgICAgICBpZihkYXRlICYmIGRhdGUuZ2V0VGltZSkge1xuICAgICAgICAgICAgcmV0ID0gZGF0ZS5nZXRUaW1lKCkvMTAwMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1vbjsiLCJpZiAoIVN0cmluZy5wcm90b3R5cGUuZm9ybWF0KSB7XG4gICAgU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhcmdzW251bWJlcl0gIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgPyBhcmdzW251bWJlcl1cbiAgICAgICAgICAgICAgOiBtYXRjaFxuICAgICAgICAgICAgO1xuICAgICAgICB9KTtcbiAgICB9O1xufSIsImNvbnN0IHV1aWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhleERpZ2l0cywgaSwgcywgdXVpZDtcbiAgICBzID0gW107XG4gICAgcy5sZW5ndGggPSAzNjtcbiAgICBoZXhEaWdpdHMgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCAzNikge1xuICAgICAgICBzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSk7XG4gICAgICAgIGkgKz0gMTtcbiAgICB9XG4gICAgc1sxNF0gPSAnNCc7XG4gICAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpO1xuICAgIHNbOF0gPSBzWzEzXSA9IHNbMThdID0gc1syM10gPSAnLSc7XG4gICAgdXVpZCA9IHMuam9pbignJyk7XG4gICAgcmV0dXJuIHV1aWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7Il19
