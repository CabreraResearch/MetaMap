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

},{"./js/app//Config.js":14,"./js/app/Eventer.js":15,"./js/app/Integrations":17,"./js/app/Router.js":19,"./js/app/auth0":21,"./js/app/user.js":22,"./js/integrations/google.js":46,"./js/pages/PageFactory.js":47,"./js/tools/shims.js":71,"airbrake-js":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"jquery":undefined,"jquery-ui":undefined,"lodash":undefined,"riot":"riot"}],2:[function(require,module,exports){
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

},{"../../MetaMap":1,"../tools/Common":70,"../tools/uuid.js":72,"lodash":undefined}],23:[function(require,module,exports){
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
                        return node.data.parent || node.id;
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
                    throttleSave();
                });

                jsPlumb.on("relationshipEdgeDump", "click", dumpEdgeCounts());

                //CTRL + click enables the lasso
                jsPlumb.on(document, 'mousedown', function (event) {
                    if (event.ctrlKey) {
                        renderer.setMode('select');
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

},{"../actions/Action.js":2,"../constants/constants":27,"../tags/page-body.js":58}],48:[function(require,module,exports){
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

},{"riot":"riot"}],51:[function(require,module,exports){
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

},{"../../../MetaMap":1,"../../constants/constants":27,"../components/raw":50,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],52:[function(require,module,exports){
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
                        sessionId: MetaMap.Auth0.ctoken,
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

},{"../../../MetaMap":1,"../../app/Sharing":20,"../../constants/constants":27,"../../tools/shims":71,"bootstrap-select":undefined,"jquery":undefined,"riot":"riot","typeahead.js":undefined}],53:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"../../constants/constants":27,"../../tools/shims":71,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"moment":undefined,"riot":"riot"}],55:[function(require,module,exports){
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

},{"../../MetaMap":1,"../app/Permissions":18,"../constants/constants":27,"../tools/shims":71,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],58:[function(require,module,exports){
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

},{"../../MetaMap":1,"../constants/constants":27,"./page-container":59,"./page-footer":61,"./page-header":62,"riot":"riot"}],59:[function(require,module,exports){
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

},{"../../MetaMap":1,"./cortex/chat":51,"./page-content":60,"./page-sidebar":65,"riot":"riot"}],60:[function(require,module,exports){
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

},{"../../MetaMap":1,"../constants/constants":27,"lodash":undefined,"riot":"riot"}],61:[function(require,module,exports){
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

var html = '\n<div class ="page-logo">\n    <a id="meta_logo" href="#home">\n        <img src="src/images/metamap_cloud.png" alt="logo" class ="logo-default" />\n    </a>\n    <div id="meta_menu_toggle" class="menu-toggler sidebar-toggler" onclick="{ onClick }" style="{ getDisplay(\'menu\') }">\n        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->\n    </div>\n</div>\n<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">\n</a>\n';

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
                        html += '<span class="label" data-toggle="tooltip" data-placement="bottom" title="' + share.name + '"><img alt="' + share.name + '" height="30" width="30" class="img-circle" src="' + share.picture + '"></span>';
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
        var html = '<span class="label"><img alt="' + item.owner.name + '" height="30" width="30" class="img-circle" src="' + item.owner.picture + '"></span>';
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
                $('[data-toggle="tooltip"]').tooltip();
            }, 500);
        });
    });
});

},{"../../../MetaMap.js":1,"../../actions/DeleteMap.js":5,"../../actions/ShareMap":12,"../../constants/constants":27,"../components/raw":50,"datatables":undefined,"datatables-bootstrap3-plugin":undefined,"jquery":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],69:[function(require,module,exports){
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

},{"moment":undefined}],71:[function(require,module,exports){
'use strict';

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

},{}],72:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3B5TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRGVsZXRlTWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRmVlZGJhY2suanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Ib21lLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTG9nb3V0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTXlNYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTmV3TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvT3Blbk1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1NoYXJlTWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvVGVybXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0NvbmZpZy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvRXZlbnRlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvRmlyZWJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0ludGVncmF0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvUGVybWlzc2lvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1JvdXRlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvU2hhcmluZy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvYXV0aDAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL3VzZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY2FudmFzL2NhbnZhcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jYW52YXMvbGF5b3V0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9hY3Rpb25zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9jYW52YXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NvbnN0YW50cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZHNycC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWRpdFN0YXR1cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWxlbWVudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2V2ZW50cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvbm90aWZpY2F0aW9uLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9wYWdlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvcm91dGVzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy90YWJzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy90YWdzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9BZGRUaGlzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9GYWNlYm9vay5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvR29vZ2xlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9JbnRlcmNvbS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvTmV3UmVsaWMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1R3aXR0ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1VzZXJTbmFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9aZW5kZXNrLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9fSW50ZWdyYXRpb25zQmFzZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3BhZ2VzL1BhZ2VGYWN0b3J5LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY2FudmFzL21ldGEtY2FudmFzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY2FudmFzL25vZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9jb21wb25lbnRzL3Jhdy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NvcnRleC9jaGF0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvZGlhbG9ncy9zaGFyZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1oZWxwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLW5vdGlmaWNhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtcG9pbnRzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLXVzZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWFjdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWJvZHkuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRhaW5lci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtY29udGVudC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtZm9vdGVyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1oZWFkZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWxvZ28uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXNlYXJjaC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2lkZWJhci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtdG9wbWVudS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL2hvbWUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9teS1tYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdGVybXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvQ29tbW9uLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3NoaW1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3V1aWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkIsTUFBTSxDQUFDLENB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LENBQUM7QUFDbEIsV0FBTyxJQUFJLENBQUM7Q0FDZixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMnKTtcclxud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbnJlcXVpcmUoJ2pxdWVyeS11aScpO1xyXG5yZXF1aXJlKCdib290c3RyYXAnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxuXHJcbmNvbnN0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9hcHAvYXV0aDAnKTtcclxuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vanMvYXBwL3VzZXIuanMnKTtcclxuY29uc3QgUm91dGVyID0gcmVxdWlyZSgnLi9qcy9hcHAvUm91dGVyLmpzJyk7XHJcbmNvbnN0IEV2ZW50ZXIgPSByZXF1aXJlKCcuL2pzL2FwcC9FdmVudGVyLmpzJyk7XHJcbmNvbnN0IFBhZ2VGYWN0b3J5ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcycpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDb25maWcgPSByZXF1aXJlKCcuL2pzL2FwcC8vQ29uZmlnLmpzJyk7XHJcbmNvbnN0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XHJcbmNvbnN0IHNoaW1zID0gcmVxdWlyZSgnLi9qcy90b29scy9zaGltcy5qcycpO1xyXG5jb25zdCBBaXJicmFrZUNsaWVudCA9IHJlcXVpcmUoJ2FpcmJyYWtlLWpzJylcclxuY29uc3QgSW50ZWdyYXRpb25zID0gcmVxdWlyZSgnLi9qcy9hcHAvSW50ZWdyYXRpb25zJylcclxuXHJcbmNsYXNzIE1ldGFNYXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuQ29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5Db25maWcuY29uZmlnO1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSB0aGlzLkNvbmZpZy5NZXRhRmlyZTtcclxuICAgICAgICB0aGlzLkV2ZW50ZXIgPSBuZXcgRXZlbnRlcih0aGlzKTtcclxuICAgICAgICB0aGlzLmFpcmJyYWtlID0gbmV3IEFpcmJyYWtlQ2xpZW50KHsgcHJvamVjdElkOiAxMTQ5MDAsIHByb2plY3RLZXk6ICdkYzk2MTFkYjZmNzcxMjBjY2VjZDFhMjczNzQ1YTVhZScgfSk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgUHJvbWlzZS5vblBvc3NpYmx5VW5oYW5kbGVkUmVqZWN0aW9uKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aGF0LmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ29uZmlnLm9uUmVhZHkoKS50aGVuKChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKGNvbmZpZy5hdXRoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dpbigpLnRoZW4oKGF1dGgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlVzZXIgPSBuZXcgVXNlcihwcm9maWxlLCBhdXRoLCB0aGlzLkV2ZW50ZXIsIHRoaXMuTWV0YUZpcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zID0gbmV3IEludGVncmF0aW9ucyh0aGlzLCB0aGlzLlVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlci5vblJlYWR5KCkudGhlbigodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbmV3IFBhZ2VGYWN0b3J5KHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyID0gbmV3IFJvdXRlcih0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb3V0ZXIuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlYnVnKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdC5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKVxyXG4gICAgfVxyXG5cclxuICAgIGxvZyh2YWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVidWcpIHtcclxuICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHZhbCwgJ2V2ZW50JywgJ2xvZycsICdsYWJlbCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmluZm8odmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBlcnJvcih2YWwpIHtcclxuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcih2YWwpO1xyXG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXhjZXB0aW9uJylcclxuICAgICAgICAgICAgdGhpcy5haXJicmFrZS5ub3RpZnkodmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dvdXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbW0gPSBuZXcgTWV0YU1hcCgpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG1tOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgQWN0aW9uIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBfZ2V0QWN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgIGxldCByZXQgPSB0aGlzLl9hY3Rpb25zW2FjdGlvbl07XHJcbiAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgbGV0IE1ldGhvZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHN3aXRjaChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vT3Blbk1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ORVdfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTmV3TWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vQ29weU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ERUxFVEVfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vRGVsZXRlTWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLk1ZX01BUFM6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9NeU1hcHMuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTE9HT1VUOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTG9nb3V0LmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlNIQVJFX01BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL1NoYXJlTWFwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlRFUk1TX0FORF9DT05ESVRJT05TOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vVGVybXMuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuRkVFREJBQ0s6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9GZWVkYmFjaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0hvbWUuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoTWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSBuZXcgTWV0aG9kKHRoaXMubWV0YUZpcmUsIHRoaXMuZXZlbnRlciwgdGhpcy5wYWdlRmFjdG9yeSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3Rpb25zW2FjdGlvbl0gPSByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoYWN0aW9uLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoKTtcclxuICAgICAgICBsZXQgbWV0aG9kID0gdGhpcy5fZ2V0QWN0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmFjdCguLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uOyIsImNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IobWV0YUZpcmUsIGV2ZW50ZXIsIHBhZ2VGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5wYWdlRmFjdG9yeSA9IHBhZ2VGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRvZ2dsZVNpZGViYXIoKSB7XHJcbiAgICAgICAgaWYodGhpcy5zaWRlYmFyT3Blbikge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9wZW5TaWRlYmFyKCkge1xyXG4gICAgICAgIHRoaXMuc2lkZWJhck9wZW4gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsb3NlU2lkZWJhcigpIHtcclxuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uQmFzZTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIENvcHlNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgaWYgKCFpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdNdXN0IGhhdmUgYSBtYXAgaW4gb3JkZXIgdG8gY29weS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigob2xkTWFwKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBgJHtuZXcgRGF0ZSgpfWAsXHJcbiAgICAgICAgICAgICAgICBvd25lcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubWV0YU1hcC5Vc2VyLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMubWV0YU1hcC5Vc2VyLnBpY3R1cmVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmFwcGVuZENvcHkob2xkTWFwLm5hbWUpLFxyXG4gICAgICAgICAgICAgICAgc2hhcmVkX3dpdGg6IHtcclxuICAgICAgICAgICAgICAgICAgICBhZG1pbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICcqJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IGZhbHNlIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHtpZH1gKS50aGVuKChvbGRNYXBEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHVzaFN0YXRlID0gdGhpcy5tZXRhRmlyZS5wdXNoRGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfWApO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKG9sZE1hcERhdGEsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7bWFwSWR9YCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kQ29weShzdHIpIHtcclxuICAgICAgICBsZXQgcmV0ID0gc3RyO1xyXG4gICAgICAgIGlmICghXy5jb250YWlucyhzdHIsICcoQ29weScpKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHJldCArICcgKENvcHkgMSknO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBtZXNzID0gc3RyLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAyO1xyXG4gICAgICAgICAgICBpZiAobWVzcy5sZW5ndGggLSBtZXNzLmxhc3RJbmRleE9mKCcoQ29weScpIDw9IDQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBncmJnID0gbWVzc1ttZXNzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyYmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBncmJnID0gZ3JiZy5yZXBsYWNlKCcpJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNudCA9ICtncmJnICsgMTtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSBtZXNzLnNsaWNlKDAsIG1lc3MubGVuZ3RoIC0gMikuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldCArPSBgIChDb3B5ICR7Y250fSlgO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvcHlNYXA7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNsYXNzIERlbGV0ZU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICBEZWxldGVNYXAuZGVsZXRlQWxsKFtpZF0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBkZWxldGVBbGwoaWRzLCBwYXRoID0gQ09OU1RBTlRTLlBBR0VTLkhPTUUpIHtcclxuICAgICAgICBjb25zdCBtZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIF8uZWFjaChpZHMsIChpZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbWV0YU1hcC5NZXRhRmlyZS5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7aWR9YCk7XHJcbiAgICAgICAgICAgICAgICBtZXRhTWFwLk1ldGFGaXJlLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIG1ldGFNYXAuUm91dGVyLnRvKHBhdGgpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlbGV0ZU1hcDsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcblxyXG5jbGFzcyBGZWVkYmFjayBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdCgpIHtcclxuICAgICAgICBzdXBlci5hY3QoKTtcclxuICAgICAgICB0aGlzLnVzZXJTbmFwLm9wZW5SZXBvcnRXaW5kb3coKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGZWVkYmFjazsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBob21lID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy9ob21lJyk7XHJcblxyXG5jbGFzcyBIb21lIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLkhPTUUpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnSG9tZScgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNsYXNzIExvZ291dCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwLmxvZ291dCgpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExvZ291dDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBob21lID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy9teS1tYXBzJyk7XHJcblxyXG5jbGFzcyBNeU1hcHMgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuTVlfTUFQUyk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5QQUdFUy5NWV9NQVBTLCB7IGlkOiBpZCB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnTXkgTWFwcycgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE15TWFwczsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIE5ld01hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KCk7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19ORVdfTUFQfWApLnRoZW4oKGJsYW5rTWFwKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBgJHtuZXcgRGF0ZSgpfWAsXHJcbiAgICAgICAgICAgICAgICBvd25lcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubWV0YU1hcC5Vc2VyLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMubWV0YU1hcC5Vc2VyLnBpY3R1cmVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmV3IFVudGl0bGVkIE1hcCcsXHJcbiAgICAgICAgICAgICAgICBzaGFyZWRfd2l0aDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkbWluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJyonOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogZmFsc2UgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwdXNoU3RhdGUgPSB0aGlzLm1ldGFGaXJlLnB1c2hEYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9YCk7XHJcbiAgICAgICAgICAgIGxldCBtYXBJZCA9IHB1c2hTdGF0ZS5rZXkoKTtcclxuICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHttYXBJZH1gKTtcclxuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci50byhgbWFwLyR7bWFwSWR9YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV3TWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBtZXRhQ2FudmFzID0gcmVxdWlyZSgnLi4vdGFncy9jYW52YXMvbWV0YS1jYW52YXMuanMnKTtcclxuXHJcbmNsYXNzIE9wZW5NYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChtYXApID0+IHtcclxuICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLk1FVEFfQ0FOVkFTKTtcclxuICAgICAgICAgICAgICAgIG1hcC5pZCA9IGlkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuTkFWLCAnbWFwJywgbWFwLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCBtYXAsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5NQVAsIG1hcCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblNpZGViYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9wZW5NYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxucmVxdWlyZSgnLi4vdGFncy9kaWFsb2dzL3NoYXJlJylcclxuXHJcbmNsYXNzIFNoYXJlTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG1hcCkgPT4ge1xyXG4gICAgICAgICAgICBtYXAuaWQgPSBpZFxyXG4gICAgICAgICAgICBTaGFyZU1hcC5hY3QoeyBtYXA6IG1hcCB9KVxyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLmJhY2soKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhY3QobWFwKSB7XHJcbiAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICBsZXQgbW9kYWwgPSByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX01PREFMX0RJQUxPR19DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5TSEFSRSlbMF1cclxuICAgICAgICAgICAgbW9kYWwudXBkYXRlKG1hcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcmVNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgdGVybXMgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL3Rlcm1zJyk7XHJcblxyXG5jbGFzcyBUZXJtcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5URVJNUyk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdUZXJtcyBhbmQgQ29uZGl0aW9ucycgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcm1zOyIsImNvbnN0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9GaXJlYmFzZScpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNvbnN0IGNvbmZpZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IFNJVEVTID0ge1xyXG4gICAgICAgIENSTF9TVEFHSU5HOiB7XHJcbiAgICAgICAgICAgIGRiOiAnbWV0YS1tYXAtc3RhZ2luZydcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmV0ID0ge1xyXG4gICAgICAgIGhvc3Q6IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxyXG4gICAgICAgIHNpdGU6IHt9XHJcbiAgICB9XHJcbiAgICBsZXQgc2VnbWVudHMgPSByZXQuaG9zdC5zcGxpdCgnLicpO1xyXG4gICAgbGV0IGZpcnN0ID0gc2VnbWVudHNbMF07XHJcbiAgICBpZiAoZmlyc3QgPT09ICd3d3cnKSB7XHJcbiAgICAgICAgZmlyc3QgPSBzZWdtZW50c1sxXTtcclxuICAgIH1cclxuICAgIGZpcnN0ID0gZmlyc3Quc3BsaXQoJzonKVswXTtcclxuXHJcbiAgICBzd2l0Y2ggKGZpcnN0LnRvTG93ZXJDYXNlKCkpIHtcclxuXHJcbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcclxuICAgICAgICBjYXNlICdtZXRhLW1hcC1zdGFnaW5nJzpcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTLkNSTF9TVEFHSU5HO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWdzKSB7XHJcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXRlKCkge1xyXG4gICAgICAgIHJldHVybiAnZnJvbnRlbmQnO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLm9uKCdjb25maWcnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ21ldGFtYXAvY2FudmFzJywgKGNhbnZhcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQodGhpcy5jb25maWcuc2l0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuY29uZmlnLnNpdGUudGl0bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmF2aWNvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdmljbycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmF2aWNvLnNldEF0dHJpYnV0ZSgnaHJlZicsIGAke3RoaXMuY29uZmlnLnNpdGUuaW1hZ2VVcmx9ZmF2aWNvbi5pY29gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLmNvbmZpZy5zaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb25maWc7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIEV2ZW50ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICBcclxuICAgICAgICByaW90Lm9ic2VydmFibGUodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRzID0ge31cclxuICAgIH1cclxuXHJcbiAgICBldmVyeShldmVudCwgcmVhY3Rpb24pIHtcclxuICAgICAgICAvL2xldCBjYWxsYmFjayA9IHJlYWN0aW9uO1xyXG4gICAgICAgIC8vaWYgKHRoaXMuZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICAgIC8vICAgIGxldCBwaWdneWJhY2sgPSB0aGlzLmV2ZW50c1tldmVudF07XHJcbiAgICAgICAgLy8gICAgY2FsbGJhY2sgPSAoLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgIHBpZ2d5YmFjayguLi5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgICAgICByZWFjdGlvbiguLi5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgIH1cclxuICAgICAgICAvL31cclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IHJlYWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLm9uKGV2ZW50LCByZWFjdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yZ2V0KGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xyXG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW2V2ZW50XTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRvKGV2ZW50LCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihldmVudCwgLi4ucGFyYW1zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRlcjsiLCJsZXQgRmlyZWJhc2UgPSB3aW5kb3cuRmlyZWJhc2U7XHJcbmxldCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxyXG5sZXQgbG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpXHJcblxyXG5jbGFzcyBNZXRhRmlyZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1ldGFNYXAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tZXRhTWFwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXRhTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuTWV0YU1hcC5BdXRoMC5nZXRTZXNzaW9uKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmNvbmZpZy5zaXRlLmF1dGgwLmFwaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBwcm9maWxlLmlkX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoaXMuZmlyZWJhc2VfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGlzLmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhLCAuLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gdGhpcy5fbG9naW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpbjtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uY2UoJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uKHBhdGgsIGNhbGxiYWNrLCBldmVudCA9ICd2YWx1ZScpIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWV0aG9kID0gKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbmFwc2hvdC5leGlzdHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKGV2ZW50LCBtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyBkYXRhIGF0ICR7cGF0aH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY2hpbGQub24oZXZlbnQsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvZmYocGF0aCwgbWV0aG9kID0gJ3ZhbHVlJywgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVEYXRhKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXREYXRhKG51bGwsIHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2hEYXRhKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnB1c2goZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhSW5UcmFuc2FjdGlvbihkYXRhLCBwYXRoLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQudHJhbnNhY3Rpb24oKGN1cnJlbnRWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVycm9yKGUsIHBhdGgpIHtcclxuICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcih7IG1lc3NhZ2U6IGBQZXJtaXNzaW9uIGRlbmllZCB0byAke3BhdGh9YCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9vblJlYWR5ID0gbnVsbDtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdmaXJlYmFzZV90b2tlbicpO1xyXG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNvbnN0IFR3aWl0ZXIgPSByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvVHdpdHRlcicpO1xyXG5jb25zdCBGYWNlYm9vayA9IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9GYWNlYm9vaycpO1xyXG5cclxuY2xhc3MgSW50ZWdyYXRpb25zIHtcclxuXHJcblx0Y29uc3RydWN0b3IobWV0YU1hcCwgdXNlcikge1xyXG5cdFx0dGhpcy5jb25maWcgPSBtZXRhTWFwLmNvbmZpZztcclxuXHRcdHRoaXMubWV0YU1hcCA9IG1ldGFNYXA7XHJcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xyXG5cdFx0dGhpcy5fZmVhdHVyZXMgPSB7XHJcblx0XHRcdGdvb2dsZTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0dvb2dsZScpLFxyXG5cdFx0XHR1c2Vyc25hcDogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1VzZXJTbmFwJyksXHJcblx0XHRcdGludGVyY29tOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvSW50ZXJjb20nKSxcclxuXHRcdFx0emVuZGVzazogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1plbmRlc2snKSxcclxuXHRcdFx0YWRkdGhpczogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0FkZFRoaXMnKSxcclxuXHRcdFx0bmV3cmVsaWM6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9OZXdSZWxpYycpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0aW5pdCgpIHtcclxuICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChGZWF0dXJlKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGxldCBjb25maWcgPSB0aGlzLmNvbmZpZy5zaXRlW25hbWVdO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXSA9IG5ldyBGZWF0dXJlKGNvbmZpZywgdGhpcy51c2VyKTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0uaW5pdCgpO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5zZXRVc2VyKCk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHRzZXRVc2VyKCkge1xyXG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNldFVzZXIoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRzZW5kRXZlbnQodmFsLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMubWV0YU1hcC5kZWJ1Zykge1xyXG4gICAgICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbbmFtZV0uc2VuZEV2ZW50KHZhbCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHJcblx0fVxyXG5cclxuXHRsb2dvdXQoKSB7XHJcblx0XHRfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0ubG9nb3V0KCk7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlZ3JhdGlvbnM7IiwiY2xhc3MgUGVybWlzc2lvbnMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbWFwXHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcbiAgICB9XHJcblxyXG4gICAgY2FuRWRpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc01hcE93bmVyKCkgfHwgdGhpcy5pc1NoYXJlZEVkaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIGNhblZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXBPd25lcigpIHx8IHRoaXMuaXNTaGFyZWRWaWV3KClcclxuICAgIH1cclxuXHJcbiAgICBpc01hcE93bmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJiB0aGlzLm1hcC5vd25lci51c2VySWQgPT0gdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaGFyZWRFZGl0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxyXG4gICAgICAgICAgICB0aGlzLm1hcC5zaGFyZWRfd2l0aCAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMubWV0YU1hcC5Vc2VyLmlzQWRtaW4gfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdICYmIHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkpXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaGFyZWRWaWV3KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxyXG4gICAgICAgICAgICB0aGlzLmlzU2hhcmVkRWRpdCgpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdLnJlYWQgPT0gdHJ1ZSkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlKVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBlcm1pc3Npb25zOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XHJcbmNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgUm91dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9ucyA9IG1ldGFNYXAuSW50ZWdyYXRpb25zO1xyXG4gICAgICAgIHRoaXMudXNlciA9IG1ldGFNYXAuVXNlcjtcclxuICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbWV0YU1hcC5QYWdlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBtZXRhTWFwLkV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xyXG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgaWQgPSAnJywgYWN0aW9uID0gJycsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhdGggPSB0aGlzLmdldFBhdGgodGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCB0aGlzLnBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5Lm5hdmlnYXRlKHRoaXMucGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbygnaGlzdG9yeScsIHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50UGFnZSgpIHtcclxuICAgICAgICBsZXQgcGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJztcclxuICAgICAgICBpZiAoIXRoaXMuaXNUcmFja2VkKHBhZ2UpKSB7XHJcbiAgICAgICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UgPSB0aGlzLmdldFBhdGgodGhpcy51c2VyLmhpc3RvcnlbcGFnZUNudCAtIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFBhdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcmV2aW91c1BhZ2UocGFnZU5vID0gMikge1xyXG4gICAgICAgIGxldCBwYWdlID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMCkge1xyXG4gICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSBwYWdlTm9dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByZXZpb3VzUGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmV2aW91c1BhZ2UoMik7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2socGF0aCkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb25zLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlTWFpbihoaWRlLCBwYXRoKSB7XHJcbiAgICAgICAgdGhpcy50cmFjayhwYXRoKTtcclxuICAgICAgICBpZiAoaGlkZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHRvKHBhdGgpIHtcclxuICAgICAgICBwYXRoID0gdGhpcy5nZXRQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCBwYXRoKTtcclxuICAgICAgICAgICAgcmlvdC5yb3V0ZShgJHtwYXRofWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiYWNrKCkge1xyXG4gICAgICAgIGxldCBwYXRoID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMSAmJiAodGhpcy5jdXJyZW50UGFnZSAhPSAnbXltYXBzJyB8fCB0aGlzLmN1cnJlbnRQYWdlICE9IHRoaXMucHJldmlvdXNQYWdlKSkge1xyXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5wcmV2aW91c1BhZ2U7XHJcbiAgICAgICAgICAgIGxldCBiYWNrTm8gPSAyO1xyXG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNUcmFja2VkKHBhdGgpICYmIHRoaXMudXNlci5oaXN0b3J5W2JhY2tOb10pIHtcclxuICAgICAgICAgICAgICAgIGJhY2tObyArPSAxO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UHJldmlvdXNQYWdlKGJhY2tObyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG8ocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRvTm90VHJhY2soKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9kb05vdFRyYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RvTm90VHJhY2sgPSBbQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuQ09QWV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVCwgQ09OU1RBTlRTLkFDVElPTlMuTkVXX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuRkVFREJBQ0ssIENPTlNUQU5UUy5BQ1RJT05TLlNIQVJFX01BUF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9kb05vdFRyYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVHJhY2tlZChwYXRoKSB7XHJcbiAgICAgICAgbGV0IHB0aCA9IHRoaXMuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICByZXR1cm4gXy5hbnkodGhpcy5kb05vdFRyYWNrLCAocCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXB0aC5zdGFydHNXaXRoKHApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJjb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5cclxuY29uc3QgdG9Cb29sID0gKHZhbCkgPT4ge1xyXG4gICAgbGV0IHJldCA9IGZhbHNlO1xyXG4gICAgaWYgKHZhbCA9PT0gdHJ1ZSB8fCB2YWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0ID0gdmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoXy5jb250YWlucyhbJ3RydWUnLCAneWVzJywgJzEnXSwgdmFsICsgJycudG9Mb3dlckNhc2UoKS50cmltKCkpKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxufVxyXG5cclxuY2xhc3MgU2hhcmluZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXNlcikge1xyXG4gICAgICAgIHRoaXMudXNlciA9IHVzZXJcclxuICAgICAgICB0aGlzLl9tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcbiAgICAgICAgdGhpcy5fZmIgPSB0aGlzLl9tZXRhTWFwLk1ldGFGaXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFNoYXJlKG1hcCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XHJcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmIuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICByZWFkOiB0b0Jvb2wob3B0cy5yZWFkKSxcclxuICAgICAgICAgICAgICAgIHdyaXRlOiB0b0Jvb2wob3B0cy53cml0ZSksXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBvcHRzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBwaWN0dXJlOiBvcHRzLnBpY3R1cmVcclxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHNoYXJlZCBhIG1hcCwgJHttYXAubmFtZX0sIHdpdGggeW91IWAsXHJcbiAgICAgICAgICAgICAgICBtYXBJZDogbWFwLmlkLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQ09OU1RBTlRTLk5PVElGSUNBVElPTi5NQVAsXHJcbiAgICAgICAgICAgICAgICB0aW1lOiBgJHtuZXcgRGF0ZSgpfWBcclxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdCh1c2VyRGF0YS5pZCl9YClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlU2hhcmUobWFwLCB1c2VyRGF0YSkge1xyXG4gICAgICAgIGlmIChtYXAgJiYgbWFwLmlkICYmIHVzZXJEYXRhICYmIHVzZXJEYXRhLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHJlbW92ZWQgYSBtYXAsICR7bWFwLm5hbWV9LCB0aGF0IHdhcyBwcmV2aW91c2x5IHNoYXJlZC5gLFxyXG4gICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKX1gXHJcbiAgICAgICAgICAgIH0sIGAke0NPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQodXNlckRhdGEuaWQpfWApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVkaXRTaGFyZShtYXBJZCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFyaW5nIiwiY29uc3QgQXV0aDBMb2NrID0gcmVxdWlyZSgnYXV0aDAtbG9jaycpXG5jb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcblxuY2xhc3MgQXV0aDAge1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCBtZXRhTWFwKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKGNvbmZpZy5hcGksIGNvbmZpZy5hcHApO1xuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvd0xvZ2luID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbkFmdGVyU2lnbnVwOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbChlcnIsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gcHJvZmlsZS5jdG9rZW4gPSBjdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnY3Rva2VuJywgdGhpcy5jdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIHRoaXMuaWRfdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgdGhpcy5wcm9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaF90b2tlbiA9IHByb2ZpbGUucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dMb2dpbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICAgIH1cblxuICAgIGxpbmtBY2NvdW50KCkge1xuICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICBjYWxsYmFja1VSTDogbG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSxcbiAgICAgICAgICAgIGRpY3Q6IHtcbiAgICAgICAgICAgICAgICBzaWduaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLmN0b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkZhaWwoZXJyLCByZWplY3QpIHtcbiAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycik7XG4gICAgICAgIGlmIChyZWplY3QpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuX2dldFNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIChlcnIsIHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdjdG9rZW4nKS50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBwcm9maWxlLmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ05vIHNlc3Npb24nKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRTZXNzaW9uO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnaWRfdG9rZW4nKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBudWxsO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuXG5cbiIsImNvbnN0IHV1aWQgPSByZXF1aXJlKCcuLi90b29scy91dWlkLmpzJyk7XHJcbmNvbnN0IENvbW1vbiA9IHJlcXVpcmUoJy4uL3Rvb2xzL0NvbW1vbicpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIFVzZXIge1xyXG4gICAgY29uc3RydWN0b3IocHJvZmlsZSwgYXV0aCwgZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLmF1dGggPSBhdXRoO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMudXNlcktleSA9IHV1aWQoKTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgbGV0IHRyYWNrSGlzdG9yeSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZXZlcnkoJ2hpc3RvcnknLCAocGFnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpc3RvcnkubGVuZ3RoID09IDAgfHwgcGFnZSAhPSB0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEodGhpcy5oaXN0b3J5LCBgdXNlcnMvJHt0aGlzLmF1dGgudWlkfS9oaXN0b3J5YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5vbihgdXNlcnMvJHt0aGlzLmF1dGgudWlkfWAsICh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlci5oaXN0b3J5ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSB1c2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2tIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX2lkZW50aXR5KCkge1xyXG4gICAgICAgIGxldCByZXQgPSB7fTtcclxuICAgICAgICBpZiAodGhpcy5wcm9maWxlICYmIHRoaXMucHJvZmlsZS5pZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb2ZpbGUuaWRlbnRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNyZWF0ZWRPbigpIHtcclxuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9jcmVhdGVkT24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlZE9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGR0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiBDb21tb24uZ2V0VGlja3NGcm9tRGF0ZShkdClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlZE9uIHx8IHsgZGF0ZTogbnVsbCwgdGlja3M6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuZnVsbE5hbWU7XHJcbiAgICAgICAgaWYgKHJldCkge1xyXG4gICAgICAgICAgICByZXQgPSByZXQuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXQgJiYgdGhpcy5faWRlbnRpdHkubmlja25hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmlja25hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmdWxsTmFtZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZW1haWwoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5lbWFpbCkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5lbWFpbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGljdHVyZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnBpY3R1cmUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucGljdHVyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXNlcklkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGgudWlkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0FkbWluKCkge1xyXG4gICAgICAgIGxldCByZXQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucm9sZXMpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucm9sZXMuYWRtaW4gPT0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhpc3RvcnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZmlsZS5oaXN0b3J5IHx8IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVVc2VyRWRpdG9yT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvcl9vcHRpb25zOiBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyOyIsImNvbnN0IGpzUGx1bWIgPSB3aW5kb3cuanNQbHVtYjtcclxuY29uc3QganNQbHVtYlRvb2xraXQgPSB3aW5kb3cuanNQbHVtYlRvb2xraXQ7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxuY29uc3QgUGVybWlzc2lvbnMgPSByZXF1aXJlKCcuLi9hcHAvUGVybWlzc2lvbnMnKVxyXG5cclxucmVxdWlyZSgnLi9sYXlvdXQnKVxyXG5cclxuY2xhc3MgQ2FudmFzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtYXAsIG1hcElkKSB7XHJcbiAgICAgICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICAgICAgdGhpcy5tYXBJZCA9IG1hcElkO1xyXG4gICAgICAgIHRoaXMudG9vbGtpdCA9IHt9O1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxyXG4gICAgICAgIGxldCBwZXJtaXNzaW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIGxldCByZWFkeSA9IHRoaXMubWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcElkfWApLnRoZW4oKG1hcEluZm8pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvID0gbWFwSW5mb1xyXG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG5ldyBQZXJtaXNzaW9ucyhtYXBJbmZvKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgY29uc3QgdGhyb3R0bGVTYXZlID0gXy50aHJvdHRsZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9ucy5jYW5FZGl0KCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB3aW5kb3cudG9vbGtpdC5leHBvcnREYXRhKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZF9ieToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YUluVHJhbnNhY3Rpb24ocG9zdERhdGEsIGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLkludGVncmF0aW9ucy5zZW5kRXZlbnQodGhpcy5tYXBJZCwgJ2V2ZW50JywgJ2F1dG9zYXZlJywgJ2F1dG9zYXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgIHJlYWR5LnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29ybmVyXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cclxuICAgICAgICAgICAgICAgIHZhciB0b29sa2l0ID0gd2luZG93LnRvb2xraXQgPSBqc1BsdW1iVG9vbGtpdC5uZXdJbnN0YW5jZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU3RhcnRDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCBlZGdlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29ybmVyID0gZWRnZVR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGVkZ2VUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZUNvbm5lY3Q6ZnVuY3Rpb24oZnJvbU5vZGUsIHRvTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9QcmV2ZW50IHNlbGYtcmVmZXJlbmNpbmcgY29ubmVjdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZnJvbU5vZGUgPT0gdG9Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQmV0d2VlbiB0aGUgc2FtZSB0d28gbm9kZXMsIG9ubHkgb25lIHBlcnNwZWN0aXZlIGNvbm5lY3Rpb24gbWF5IGV4aXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goY3VycmVudENvcm5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BlcnNwZWN0aXZlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gZnJvbU5vZGUuZ2V0RWRnZXMoeyBmaWx0ZXI6IGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuZGF0YS50eXBlID09ICdwZXJzcGVjdGl2ZScgfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZCA9IGVkZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoKGVkLnNvdXJjZSA9PSBmcm9tTm9kZSAmJiBlZC50YXJnZXQgPT0gdG9Ob2RlKSB8fCAoZWQudGFyZ2V0ID09IGZyb21Ob2RlICYmIGVkLnNvdXJjZSA9PSB0b05vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gZHVtbXkgZm9yIGEgbmV3IG5vZGUuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgdmFyIF9uZXdOb2RlID0gZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9dHlwZXx8XCJpZGVhXCJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3OjEwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaDoxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOlwiaWRlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgcHJveHkgKGRyYWcgaGFuZGxlKVxyXG4gICAgICAgICAgICAgICAgdmFyIF9uZXdQcm94eSA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSB8fCAncHJveHlQZXJzcGVjdGl2ZSdcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3OjEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoOjEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWFpbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmp0ay1kZW1vLW1haW5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanRrLWRlbW8tY2FudmFzXCIpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvL1doZW5ldmVyIGNoYW5naW5nIHRoZSBzZWxlY3Rpb24sIGNsZWFyIHdoYXQgd2FzIHByZXZpb3VzbHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgIHZhciBjbGVhclNlbGVjdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5zZXRTZWxlY3Rpb24ob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uZmlndXJlIHRoZSByZW5kZXJlclxyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gdG9vbGtpdC5yZW5kZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogY2FudmFzRWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0RyYWdnYWJsZTogcGVybWlzc2lvbnMuY2FuRWRpdCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZVBhbkJ1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxheW91dDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGN1c3RvbSBsYXlvdXQgZm9yIHRoaXMgYXBwLiBzaW1wbGUgZXh0ZW5zaW9uIG9mIHRoZSBzcHJpbmcgbGF5b3V0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwibWV0YW1hcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgaG93IHlvdSBjYW4gYXNzb2NpYXRlIGdyb3VwcyBvZiBub2Rlcy4gSGVyZSwgYmVjYXVzZSBvZiB0aGVcclxuICAgICAgICAgICAgICAgICAgICAvLyB3YXkgSSBoYXZlIHJlcHJlc2VudGVkIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGEsIHdlIGVpdGhlciByZXR1cm5cclxuICAgICAgICAgICAgICAgICAgICAvLyBhIHBhcnQncyBcInBhcmVudFwiIGFzIHRoZSBwb3NzZSwgb3IgaWYgaXQgaXMgbm90IGEgcGFydCB0aGVuIHdlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBub2RlJ3MgaWQuIFRoZXJlIGFyZSBhZGRUb1Bvc3NlIGFuZCByZW1vdmVGcm9tUG9zc2VcclxuICAgICAgICAgICAgICAgICAgICAvLyBtZXRob2RzIHRvbyAob24gdGhlIHJlbmRlcmVyLCBub3QgdGhlIHRvb2xraXQpOyB0aGVzZSBjYW4gYmUgdXNlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdHJhbnNmZXJyaW5nIGEgcGFydCBmcm9tIG9uZSBwYXJlbnQgdG8gYW5vdGhlci5cclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25Qb3NzZTpmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmRhdGEucGFyZW50IHx8IG5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB6b29tVG9GaXQ6ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldzp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXA6IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24ob2JqLm5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uKG9iaikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOlwidG1wbE5vZGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkZWE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiZGVmYXVsdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyLXRoaW5nXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiaWRlYVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsRHJhZ1Byb3h5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yczogWydDb250aW51b3VzJywgJ0NlbnRlciddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlQZXJzcGVjdGl2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJwcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZWxhdGlvbnNoaXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwicHJveHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmoubm9kZS5kYXRhLnR5cGUgPSAnci10aGluZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqLm5vZGUuc2V0VHlwZSgnci10aGluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1VwZGF0aW5nIHRoZSBub2RlIHR5cGUgZG9lcyBub3Qgc2VlbSB0byBzdGljazsgaW5zdGVhZCwgY3JlYXRlIGEgbmV3IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gcmVuZGVyZXIubWFwRXZlbnRMb2NhdGlvbihvYmouZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGdlcyA9IG9iai5ub2RlLmdldEVkZ2VzKClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLncgPSBlZGdlc1swXS5zb3VyY2UuZGF0YS53ICogMC44O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5oID0gZWRnZXNbMF0uc291cmNlLmRhdGEuaCAqIDAuODtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShqc1BsdW1iLmV4dGVuZChfbmV3Tm9kZShcInItdGhpbmdcIiksIGQpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JlLWNyZWF0ZSB0aGUgZWRnZSBjb25uZWN0aW9ucyBvbiB0aGUgbmV3IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9MSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVkZ2VzW2ldLnNvdXJjZSA9PSBvYmoubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpuZXdOb2RlLCB0YXJnZXQ6ZWRnZXNbaV0udGFyZ2V0LCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGVkZ2VzW2ldLnRhcmdldCA9PSBvYmoubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTplZGdlc1tpXS5zb3VyY2UsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgdGhlIHByb3h5IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlTm9kZShvYmoubm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXA6IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9iai5lLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT0gJ3JlbGF0aW9uc2hpcC1vdmVybGF5JyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKG9iai5lZGdlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JzOltcIkNvbnRpbnVvdXNcIixcIkNvbnRpbnVvdXNcIl0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3I6W1wiU3RhdGVNYWNoaW5lXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxLjAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJ2aW5lc3M6MTVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXJlbGF0aW9uc2hpcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheXM6W1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIFwiUGxhaW5BcnJvd1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjoxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcInJlbGF0aW9uc2hpcC1vdmVybGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBQcm94eTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXJlbGF0aW9uc2hpcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRzOlsgXCJCbGFua1wiLCBbIFwiRG90XCIsIHsgcmFkaXVzOjUsIGNzc0NsYXNzOlwib3JhbmdlXCIgfV1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlUHJveHk6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1wZXJzcGVjdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czoxLCBjc3NDbGFzczpcIm9yYW5nZV9wcm94eVwiIH1dXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNEYmxDbGljazpmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYW4gSWRlYSBub2RlIGF0IHRoZSBsb2NhdGlvbiBhdCB3aGljaCB0aGUgZXZlbnQgb2NjdXJyZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gcmVuZGVyZXIubWFwRXZlbnRMb2NhdGlvbihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTW92ZSAxLzIgdGhlIGhlaWdodCBhbmQgd2lkdGggdXAgYW5kIHRvIHRoZSBsZWZ0IHRvIGNlbnRlciB0aGUgbm9kZSBvbiB0aGUgbW91c2UgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogd2hlbiBoZWlnaHQvd2lkdGggaXMgY29uZmlndXJhYmxlLCByZW1vdmUgaGFyZC1jb2RlZCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy5sZWZ0ID0gcG9zLmxlZnQtNTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy50b3AgPSBwb3MudG9wLTUwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoanNQbHVtYi5leHRlbmQoX25ld05vZGUoKSwgcG9zKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVBZGRlZDpfcmVnaXN0ZXJIYW5kbGVycywgLy8gc2VlIGJlbG93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VBZGRlZDogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxheW91dDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhcmlvdXMgZHJhZy9kcm9wIGhhbmRsZXIgZXZlbnQgZXhwZXJpbWVudHMgbGl2ZWQgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBkcmFnT3B0aW9uczp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjpcIi5zZWdtZW50XCIgICAgICAgLy8gY2FuJ3QgZHJhZyBub2RlcyBieSB0aGUgY29sb3Igc2VnbWVudHMuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWxvZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5pbml0aWFsaXplKHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBcIi5kbGdcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLyBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4gICAgICAgICAgICAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyAgICBNb3VzZSBoYW5kbGVycy4gU29tZSBhcmUgd2lyZWQgdXA7IGFsbCBsb2cgdGhlIGN1cnJlbnQgbm9kZSBkYXRhIHRvIHRoZSBjb25zb2xlLlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBfdHlwZXMgPSBbIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiZ3JlZW5cIiwgXCJibHVlXCIsIFwidGV4dFwiIF07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNsaWNrTG9nZ2VyID0gZnVuY3Rpb24odHlwZSwgZXZlbnQsIGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQgKyAnICcgKyB0eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50ID09ICdkYmxjbGljaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgX2NsaWNrSGFuZGxlcnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdSJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyZWVuOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignRycsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdPJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdCJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdUJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRibGNsaWNrOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignUicsICdkYmxjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmVlbjpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0cnLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9IG5vZGUuZGF0YS53ICogMC44O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0hlaWdodCA9IG5vZGUuZGF0YS5oICogMC44O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5jaGlsZHJlbiA9IG5vZGUuZGF0YS5jaGlsZHJlbiB8fCBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdMYWJlbCA9IG5vZGUuZGF0YS5sYWJlbCArIFwiOiBQYXJ0IFwiICsgKG5vZGUuZGF0YS5jaGlsZHJlbi5sZW5ndGgrMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoe3BhcmVudDpub2RlLmlkLHc6bmV3V2lkdGgsaDpuZXdIZWlnaHQsbGFiZWw6IG5ld0xhYmVsfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4ucHVzaChuZXdOb2RlLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbGF5b3V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yYW5nZTpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ08nLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3h5Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3UHJveHkoJ3Byb3h5UGVyc3BlY3RpdmUnKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bm9kZSwgdGFyZ2V0OnByb3h5Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInBlcnNwZWN0aXZlUHJveHlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInBlcnNwZWN0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZTpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0InLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3h5Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3UHJveHkoJ3Byb3h5UmVsYXRpb25zaGlwJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5vZGUsIHRhcmdldDpwcm94eU5vZGUsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpwcm94eU5vZGUsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1QnLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LkRpYWxvZ3Muc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZGxnVGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVudGVyIGxhYmVsOlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uT0s6IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQudXBkYXRlTm9kZShub2RlLCB7IGxhYmVsOmQudGV4dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Om5vZGUuZGF0YS5sYWJlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgX2N1cnJ5SGFuZGxlciA9IGZ1bmN0aW9uKGVsLCBzZWdtZW50LCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9lbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBzZWdtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKF9lbCwgXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jbGlja0hhbmRsZXJzW1wiY2xpY2tcIl1bc2VnbWVudF0oZWwsIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24oX2VsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NsaWNrSGFuZGxlcnNbXCJkYmxjbGlja1wiXVtzZWdtZW50XShlbCwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyBzZXR1cCB0aGUgY2xpY2tpbmcgYWN0aW9ucyBhbmQgdGhlIGxhYmVsIGRyYWcuIEZvciB0aGUgZHJhZyB3ZSBjcmVhdGUgYW5cclxuICAgICAgICAgICAgICAgIC8vIGluc3RhbmNlIG9mIGpzUGx1bWIgZm9yIG5vdCBvdGhlciBwdXJwb3NlIHRoYW4gdG8gbWFuYWdlIHRoZSBkcmFnZ2luZyBvZlxyXG4gICAgICAgICAgICAgICAgLy8gbGFiZWxzLiBXaGVuIGEgZHJhZyBzdGFydHMgd2Ugc2V0IHRoZSB6b29tIG9uIHRoYXQganNQbHVtYiBpbnN0YW5jZSB0b1xyXG4gICAgICAgICAgICAgICAgLy8gbWF0Y2ggb3VyIGN1cnJlbnQgem9vbS5cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWxEcmFnSGFuZGxlciA9IGpzUGx1bWIuZ2V0SW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIF9yZWdpc3RlckhhbmRsZXJzKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGhlcmUgeW91IGhhdmUgcGFyYW1zLmVsLCB0aGUgRE9NIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgcGFyYW1zLm5vZGUsIHRoZSB1bmRlcmx5aW5nIG5vZGUuIGl0IGhhcyBhIGBkYXRhYCBtZW1iZXIgd2l0aCB0aGUgbm9kZSdzIHBheWxvYWQuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0gcGFyYW1zLmVsLCBub2RlID0gcGFyYW1zLm5vZGUsIGxhYmVsID0gZWwucXVlcnlTZWxlY3RvcihcIi5uYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3R5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jdXJyeUhhbmRsZXIoZWwsIF90eXBlc1tpXSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBsYWJlbCBkcmFnZ2FibGUgKHNlZSBub3RlIGFib3ZlKS5cclxuICAgICAgICAgICAgICAgICAgICBsYWJlbERyYWdIYW5kbGVyLmRyYWdnYWJsZShsYWJlbCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDpmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxEcmFnSGFuZGxlci5zZXRab29tKHJlbmRlcmVyLmdldFpvb20oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3A6ZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmxhYmVsUG9zaXRpb24gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQobGFiZWwuc3R5bGUubGVmdCwgMTApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLnRvcCwgMTApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgbGFiZWwgZWRpdGFibGUgdmlhIGEgZGlhbG9nXHJcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYi5vbihsYWJlbCwgXCJkYmxjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZGxnVGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRW50ZXIgbGFiZWw6XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9LOiBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQudXBkYXRlTm9kZShub2RlLCB7IGxhYmVsOmQudGV4dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6bm9kZS5kYXRhLmxhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgKiBzaG93cyBpbmZvIGluIHdpbmRvdyBvbiBib3R0b20gcmlnaHQuXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gX2luZm8odGV4dCkge1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbG9hZCB0aGUgZGF0YS5cclxuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm1hcCAmJiB0aGF0Lm1hcC5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5sb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGF0Lm1hcC5kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5sb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOlwiZGF0YS5qc29uXCJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIC8vIGEgY291cGxlIG9mIHJhbmRvbSBleGFtcGxlcyBvZiB0aGUgZmlsdGVyIGZ1bmN0aW9uLCBhbGxvd2luZyB5b3UgdG8gcXVlcnkgeW91ciBkYXRhXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNvdW50RWRnZXNPZlR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvb2xraXQuZmlsdGVyKGZ1bmN0aW9uKG9iaikgeyByZXR1cm4gb2JqLm9iamVjdFR5cGUgPT0gXCJFZGdlXCIgJiYgb2JqLmRhdGEudHlwZT09PXR5cGU7IH0pLmdldEVkZ2VDb3VudCgpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIGR1bXBFZGdlQ291bnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSBhcmUgXCIgKyBjb3VudEVkZ2VzT2ZUeXBlKFwicmVsYXRpb25zaGlwXCIpICsgXCIgcmVsYXRpb25zaGlwIGVkZ2VzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYXJlIFwiICsgY291bnRFZGdlc09mVHlwZShcInBlcnNwZWN0aXZlXCIpICsgXCIgcGVyc3BlY3RpdmUgZWRnZXNcIik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRvb2xraXQuYmluZChcImRhdGFVcGRhdGVkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGR1bXBFZGdlQ291bnRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVTYXZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oXCJyZWxhdGlvbnNoaXBFZGdlRHVtcFwiLCBcImNsaWNrXCIsIGR1bXBFZGdlQ291bnRzKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vQ1RSTCArIGNsaWNrIGVuYWJsZXMgdGhlIGxhc3NvXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAnbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldE1vZGUoJ3NlbGVjdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGRlbGV0ZUFsbCA9IGZ1bmN0aW9uKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBpbXBsZW1lbnQgbG9naWMgdG8gZGVsZXRlIHdob2xlIGVkZ2UrcHJveHkrZWRnZSBzdHJ1Y3R1cmVcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5lYWNoRWRnZShmdW5jdGlvbihpLGUpIHsgY29uc29sZS5sb2coZSkgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vUmVjdXJzZSBvdmVyIGFsbCBjaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmVhY2hOb2RlKGZ1bmN0aW9uKGksbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVjdXJzZSA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5vZGUgJiYgbm9kZS5kYXRhLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8bm9kZS5kYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSs9MSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSB0b29sa2l0LmdldE5vZGUobm9kZS5kYXRhLmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9EZWxldGUgY2hpbGRyZW4gYmVmb3JlIHBhcmVudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlTm9kZShub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3Vyc2Uobik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmUoc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vbWFwIGJhY2tzcGFjZSB0byBkZWxldGUgaWYgYW55dGhpbmcgaXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oZG9jdW1lbnQsICdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdG9vbGtpdC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVBbGwoc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0b29sa2l0LmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQWxsKHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzOyIsIi8qKlxuKiBDdXN0b20gbGF5b3V0IGZvciBtZXRhbWFwLiBFeHRlbmRzIHRoZSBTcHJpbmcgbGF5b3V0LiBBZnRlciBTcHJpbmcgcnVucywgdGhpc1xuKiBsYXlvdXQgZmluZHMgJ3BhcnQnIG5vZGVzIGFuZCBhbGlnbnMgdGhlbSB1bmRlcm5lYXRoIHRoZWlyIHBhcmVudHMuIFRoZSBhbGlnbm1lbnRcbiogLSBsZWZ0IG9yIHJpZ2h0IC0gaXMgc2V0IGluIHRoZSBwYXJlbnQgbm9kZSdzIGRhdGEsIGFzIGBwYXJ0QWxpZ25gLlxuKi9cbjsoZnVuY3Rpb24oKSB7XG5cbiAganNQbHVtYlRvb2xraXQuTGF5b3V0c1tcIm1ldGFtYXBcIl0gPSBmdW5jdGlvbigpIHtcbiAgICBqc1BsdW1iVG9vbGtpdC5MYXlvdXRzLlNwcmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIF9vbmVTZXQgPSBmdW5jdGlvbihwYXJlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgdmFyIHBhZGRpbmcgPSBwYXJhbXMucGFydFBhZGRpbmcgfHwgNTA7XG4gICAgICBpZiAocGFyZW50LmRhdGEuY2hpbGRyZW4pIHtcblxuICAgICAgICB2YXIgYyA9IHBhcmVudC5kYXRhLmNoaWxkcmVuLFxuICAgICAgICAgICAgcGFyZW50UG9zID0gdGhpcy5nZXRQb3NpdGlvbihwYXJlbnQuaWQpLFxuICAgICAgICAgICAgcGFyZW50U2l6ZSA9IHRoaXMuZ2V0U2l6ZShwYXJlbnQuaWQpLFxuICAgICAgICAgICAgbWFnbmV0aXplTm9kZXMgPSBbIHBhcmVudC5pZCBdLFxuICAgICAgICAgICAgYWxpZ24gPSAocGFyZW50LmRhdGEucGFydEFsaWduIHx8IFwicmlnaHRcIikgPT09IFwibGVmdFwiID8gMCA6IDEsXG4gICAgICAgICAgICB5ID0gcGFyZW50UG9zWzFdICsgcGFyZW50U2l6ZVsxXSArIHBhZGRpbmc7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYoY1tpXSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkU2l6ZSA9IHRoaXMuZ2V0U2l6ZShjW2ldKSxcbiAgICAgICAgICAgICAgICB4ID0gcGFyZW50UG9zWzBdICsgKGFsaWduICogKHBhcmVudFNpemVbMF0gLSBjaGlsZFNpemVbMF0pKTtcbiAgXG4gICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGNbaV0sIHgsIHksIHRydWUpO1xuICAgICAgICAgICAgbWFnbmV0aXplTm9kZXMucHVzaChjW2ldKTtcbiAgICAgICAgICAgIHkgKz0gKGNoaWxkU2l6ZVsxXSArIHBhZGRpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gc3Rhc2ggb3JpZ2luYWwgZW5kIGNhbGxiYWNrIGFuZCBvdmVycmlkZS4gcGxhY2UgYWxsIFBhcnQgbm9kZXMgd3J0IHRoZWlyXG4gICAgLy8gcGFyZW50cywgdGhlbiBjYWxsIG9yaWdpbmFsIGVuZCBjYWxsYmFjayBhbmQgZmluYWxseSB0ZWxsIHRoZSBsYXlvdXRcbiAgICAvLyB0byBkcmF3IGl0c2VsZiBhZ2Fpbi5cbiAgICB2YXIgX3N1cGVyRW5kID0gdGhpcy5lbmQ7XG4gICAgdGhpcy5lbmQgPSBmdW5jdGlvbih0b29sa2l0LCBwYXJhbXMpIHtcbiAgICAgIHZhciBuYyA9IHRvb2xraXQuZ2V0Tm9kZUNvdW50KCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5jOyBpKyspIHtcbiAgICAgICAgdmFyIG4gPSB0b29sa2l0LmdldE5vZGVBdChpKTtcbiAgICAgICAgLy8gb25seSBwcm9jZXNzIG5vZGVzIHRoYXQgYXJlIG5vdCBQYXJ0IG5vZGVzICh0aGVyZSBjb3VsZCBvZiBjb3Vyc2UgYmVcbiAgICAgICAgLy8gYSBtaWxsaW9uIHdheXMgb2YgZGV0ZXJtaW5pbmcgd2hhdCBpcyBhIFBhcnQgbm9kZS4uLmhlcmUgSSBqdXN0IHVzZVxuICAgICAgICAvLyBhIHJ1ZGltZW50YXJ5IGNvbnN0cnVjdCBpbiB0aGUgZGF0YSlcbiAgICAgICAgaWYgKG4uZGF0YS5wYXJlbnQgPT0gbnVsbCkge1xuICAgICAgICAgIF9vbmVTZXQobiwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3VwZXJFbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gIH07XG5cbn0pKCk7XG4iLCJjb25zdCBBQ1RJT05TID0ge1xyXG4gICAgTUFQOiAnbWFwJyxcclxuICAgIE5FV19NQVA6ICduZXdfbWFwJyxcclxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxyXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxyXG4gICAgSE9NRTogJ2hvbWUnLFxyXG4gICAgTVlfTUFQUzogJ215bWFwcycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcclxuICAgIExPR09VVDogJ2xvZ291dCcsXHJcbiAgICBGRUVEQkFDSzogJ2ZlZWRiYWNrJyxcclxuICAgIFNIQVJFX01BUDogJ3NoYXJlX21hcCdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQUNUSU9OUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFDVElPTlM7IiwiY29uc3QgQ0FOVkFTID0ge1xyXG4gICAgTEVGVDogJ2xlZnQnLFxyXG4gICAgUklHSFQ6ICdyaWdodCdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQ0FOVkFTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ0FOVkFTOyIsImNvbnN0IENPTlNUQU5UUyA9IHtcclxuXHRBQ1RJT05TOiByZXF1aXJlKCcuL2FjdGlvbnMnKSxcclxuXHRDQU5WQVM6IHJlcXVpcmUoJy4vY2FudmFzJyksXHJcblx0RFNSUDogcmVxdWlyZSgnLi9kc3JwJyksXHJcblx0RURJVF9TVEFUVVM6IHJlcXVpcmUoJy4vZWRpdFN0YXR1cycpLFxyXG5cdEVMRU1FTlRTOiByZXF1aXJlKCcuL2VsZW1lbnRzJyksXHJcbiAgICBFVkVOVFM6IHJlcXVpcmUoJy4vZXZlbnRzJyksXHJcbiAgICBOT1RJRklDQVRJT046IHJlcXVpcmUoJy4vbm90aWZpY2F0aW9uJyksXHJcblx0UEFHRVM6IHJlcXVpcmUoJy4vcGFnZXMnKSxcclxuXHRST1VURVM6IHJlcXVpcmUoJy4vcm91dGVzJyksXHJcblx0VEFCUzogcmVxdWlyZSgnLi90YWJzJyksXHJcblx0VEFHUzogcmVxdWlyZSgnLi90YWdzJylcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQ09OU1RBTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ09OU1RBTlRTOyIsImNvbnN0IERTUlAgPSB7XHJcblx0RDogJ0QnLFxyXG5cdFM6ICdTJyxcclxuXHRSOiAnUicsXHJcblx0UDogJ1AnXHJcbn1cclxuXHJcbk9iamVjdC5mcmVlemUoRFNSUCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERTUlA7IiwiY29uc3Qgc3RhdHVzID0ge1xyXG4gICAgTEFTVF9VUERBVEVEOiAnJyxcclxuICAgIFJFQURfT05MWTogJ1ZpZXcgb25seScsXHJcbiAgICBTQVZJTkc6ICdTYXZpbmcuLi4nLFxyXG4gICAgU0FWRV9PSzogJ0FsbCBjaGFuZ2VzIHNhdmVkJyxcclxuICAgIFNBVkVfRkFJTEVEOiAnQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQnXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKHN0YXR1cyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXR1czsiLCJjb25zdCBFTEVNRU5UUyA9IHtcclxuICAgIEFQUF9DT05UQUlORVI6ICdhcHAtY29udGFpbmVyJyxcclxuICAgIE1FVEFfUFJPR1JFU1M6ICdtZXRhX3Byb2dyZXNzJyxcclxuICAgIE1FVEFfUFJPR1JFU1NfTkVYVDogJ21ldGFfcHJvZ3Jlc3NfbmV4dCcsXHJcbiAgICBNRVRBX01PREFMX0RJQUxPR19DT05UQUlORVI6ICdtZXRhX21vZGFsX2RpYWxvZ19jb250YWluZXInXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKEVMRU1FTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRUxFTUVOVFM7IiwiY29uc3QgRVZFTlRTID0ge1xyXG5cdFNJREVCQVJfT1BFTjogJ3NpZGViYXItb3BlbicsXHJcblx0U0lERUJBUl9DTE9TRTogJ3NpZGViYXItY2xvc2UnLFxyXG5cdFNJREVCQVJfVE9HR0xFOiAnc2lkZWJhci10b2dnbGUnLFxyXG5cdFBBR0VfTkFNRTogJ3BhZ2VOYW1lJyxcclxuXHROQVY6ICduYXYnLFxyXG5cdE1BUDogJ21hcCdcclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShFVkVOVFMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFVkVOVFM7IiwiY29uc3QgTk9USUZJQ0FUSU9OID0ge1xyXG5cdE1BUDogJ21hcCdcclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShOT1RJRklDQVRJT04pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOT1RJRklDQVRJT047IiwiY29uc3QgQUNUSU9OUyA9IHJlcXVpcmUoJy4vYWN0aW9ucy5qcycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBQQUdFUyA9IHtcclxuICAgIE1BUDogJ21hcCcsXHJcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXHJcbiAgICBDT1BZX01BUDogJ2NvcHlfbWFwJyxcclxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcclxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxyXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICd0ZXJtcycsXHJcbiAgICBIT01FOiAnaG9tZSdcclxufTtcclxuXHJcbl8uZXh0ZW5kKClcclxuXHJcbk9iamVjdC5mcmVlemUoUEFHRVMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQQUdFUzsiLCJjb25zdCBST1VURVMgPSB7XHJcbiAgICBNQVBTX0xJU1Q6ICdtYXBzL2xpc3QvJyxcclxuICAgIE1BUFNfREFUQTogJ21hcHMvZGF0YS8nLFxyXG4gICAgTUFQU19ORVdfTUFQOiAnbWFwcy9uZXctbWFwLycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ21ldGFtYXAvdGVybXMtYW5kLWNvbmRpdGlvbnMvJyxcclxuICAgIEhPTUU6ICdtZXRhbWFwL2hvbWUvJyxcclxuICAgIE5PVElGSUNBVElPTlM6ICd1c2Vycy97MH0vbm90aWZpY2F0aW9ucydcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoUk9VVEVTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUk9VVEVTOyIsImNvbnN0IFRBQlMgPSB7XHJcbiAgICBUQUJfSURfUFJFU0VOVEVSIDogJ3ByZXNlbnRlci10YWInLFxyXG4gICAgVEFCX0lEX0FOQUxZVElDU19NQVAgOiAnYW5hbHl0aWNzLXRhYi1tYXAnLFxyXG4gICAgVEFCX0lEX0FOQUxZVElDU19USElORyA6ICdhbmFseXRpY3MtdGFiLXRoaW5nJyxcclxuICAgIFRBQl9JRF9QRVJTUEVDVElWRVMgOiAncGVyc3BlY3RpdmVzLXRhYicsXHJcbiAgICBUQUJfSURfRElTVElOQ1RJT05TIDogJ2Rpc3RpbmN0aW9ucy10YWInLFxyXG4gICAgVEFCX0lEX0FUVEFDSE1FTlRTIDogJ2F0dGFjaG1lbnRzLXRhYicsXHJcbiAgICBUQUJfSURfR0VORVJBVE9SIDogJ2dlbmVyYXRvci10YWInLFxyXG4gICAgVEFCX0lEX1NUQU5EQVJEUyA6ICdzdGFuZGFyZHMtdGFiJ1xyXG59O1xyXG5PYmplY3QuZnJlZXplKFRBQlMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUQUJTOyIsImNvbnN0IFRBR1MgPSB7XHJcbiAgICBNRVRBX0NBTlZBUzogJ21ldGEtY2FudmFzJyxcclxuICAgIEhPTUU6ICdob21lJyxcclxuICAgIFRFUk1TOiAndGVybXMnLFxyXG4gICAgTVlfTUFQUzogJ215LW1hcHMnLFxyXG4gICAgU0hBUkU6ICdzaGFyZSdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoVEFHUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRBR1M7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgQWRkVGhpcyBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgICAgICAgIHQgPSB3aW5kb3cuYWRkdGhpcyB8fCB7fTtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcclxuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIGpzLnNyYyA9IGAvL3M3LmFkZHRoaXMuY29tL2pzLzMwMC9hZGR0aGlzX3dpZGdldC5qcyNwdWJpZD0ke2NvbmZpZy5wdWJpZH1gO1xyXG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwiYWRkLXRoaXMtanNcIikpO1xyXG4gICAgICAgIHRoaXMuYWRkdGhpcyA9IHdpbmRvdy5hZGR0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5hZGR0aGlzID0gdGhpcy5hZGR0aGlzIHx8IHdpbmRvdy5hZGR0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFkZFRoaXM7XHJcblxyXG5cclxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgRmFjZWJvb2sgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF07XHJcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgICAgICBqcy5zcmMgPSBcIi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvc2RrLmpzXCI7XHJcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgICB9IChkb2N1bWVudCwgJ3NjcmlwdCcsICdmYWNlYm9vay1qc3NkaycpKTtcclxuICAgICAgICB0aGlzLkZCID0gd2luZG93LkZCO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLmluaXQoe1xyXG4gICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuYXBwaWQsXHJcbiAgICAgICAgICAgIHhmYm1sOiB0aGlzLmNvbmZpZy54ZmJtbCxcclxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy5jb25maWcudmVyc2lvblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLkV2ZW50LnN1YnNjcmliZSgnZWRnZS5jcmVhdGUnLCBmdW5jdGlvbiAodGFyZ2V0VXJsKSB7XHJcbiAgICAgICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCdmYWNlYm9vaycsIHRhcmdldFVybCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uRXZlbnQuc3Vic2NyaWJlKCdlZGdlLnJlbW92ZScsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5FdmVudC5zdWJzY3JpYmUoJ21lc3NhZ2Uuc2VuZCcsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuRkIgPSB0aGlzLkZCIHx8IHdpbmRvdy5GQjtcclxuICAgICAgICByZXR1cm4gdGhpcy5GQjtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZhY2Vib29rO1xyXG5cclxuXHJcbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIEdvb2dsZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgbGV0IHBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IHBvLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JzsgcG8uYXN5bmMgPSB0cnVlO1xyXG4gICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xyXG4gICAgICBsZXQgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XHJcbiAgICB9KSgpO1xyXG4gICAgICBcclxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxyXG4gICAgKGZ1bmN0aW9uICh3LCBkLCBzLCBsLCBpKSB7XHJcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xyXG4gICAgICAgICdndG0uc3RhcnQnOlxyXG4gICAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCBldmVudDogJ2d0bS5qcydcclxuICAgICAgfSk7IGxldCBmID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cclxuICAgICAgICAnLy93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RtLmpzP2lkPScgKyBpICsgZGw7IGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJ2RhdGFMYXllcicsIHRoaXMuY29uZmlnLnRhZ21hbmFnZXIpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoaSwgcywgbywgZywgciwgYSwgbSkge1xyXG4gICAgICBpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXSA9IHI7IGlbcl0gPSBpW3JdIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAoaVtyXS5xID0gaVtyXS5xIHx8IFtdKS5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgIH0sIGlbcl0ubCA9IDEgKiBuZXcgRGF0ZSgpOyBhID0gcy5jcmVhdGVFbGVtZW50KG8pLFxyXG4gICAgICBtID0gcy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTsgYS5hc3luYyA9IDE7IGEuc3JjID0gZztcclxuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcclxuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzJywgJ2dhJyk7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgdGhpcy5nYSA9IHRoaXMuZ2EgfHwgd2luZG93LmdhO1xyXG4gICAgcmV0dXJuIHRoaXMuZ2E7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgbGV0IG1vZGUgPSAnYXV0byc7XHJcbiAgICBsZXQgZG9tYWluID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICBpZihkb21haW4uc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcclxuICAgICAgbW9kZSA9ICdub25lJztcclxuICAgIH1cclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ2NyZWF0ZScsIHRoaXMuY29uZmlnLmFuYWx5dGljcywgbW9kZSk7XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyKCkge1xyXG4gICAgc3VwZXIuc2V0VXNlcigpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0JywgJ3VzZXJJZCcsIHRoaXMudXNlci51c2VySWQpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRTb2NpYWwobmV0d29yaywgdGFyZ2V0VXJsLCB0eXBlID0gJ3NlbmQnKSB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCBuZXR3b3JrLCB0eXBlLCB0YXJnZXRVcmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xyXG4gICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XHJcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICBpZiAoc291cmNlICYmIHR5cGUpIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdmFsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHZhbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgdXBkYXRlUGF0aChwYXRoKSB7XHJcbiAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCB7XHJcbiAgICAgICAgICAgIHBhZ2U6IHBhdGhcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZEV2ZW50KGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCkge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB1cmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR29vZ2xlO1xyXG5cclxuXHJcbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIEludGVyY29tIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG5cclxuICAgICAgICBsZXQgaSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaS5jKGFyZ3VtZW50cylcclxuICAgICAgICB9O1xyXG4gICAgICAgIGkucSA9IFtdO1xyXG4gICAgICAgIGkuYyA9IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgICAgICAgIGkucS5wdXNoKGFyZ3MpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB3aW5kb3cuSW50ZXJjb20gPSBpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgICAgICBzLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICAgICAgcy5zcmMgPSBgaHR0cHM6Ly93aWRnZXQuaW50ZXJjb20uaW8vd2lkZ2V0LyR7Y29uZmlnLmFwcGlkfX1gO1xyXG4gICAgICAgICAgICBsZXQgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICAgICAgeC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzLCB4KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmludGVyY29tID0gd2luZG93LkludGVyY29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLmludGVyY29tID0gdGhpcy5pbnRlcmNvbSB8fCB3aW5kb3cuSW50ZXJjb207XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJjb207XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignYm9vdCcsIHtcclxuICAgICAgICAgICAgYXBwX2lkOiB0aGlzLmNvbmZpZy5hcHBpZCxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy51c2VyLmZ1bGxOYW1lLFxyXG4gICAgICAgICAgICBlbWFpbDogdGhpcy51c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBjcmVhdGVkX2F0OiB0aGlzLnVzZXIuY3JlYXRlZE9uLnRpY2tzLFxyXG4gICAgICAgICAgICB1c2VyX2lkOiB0aGlzLnVzZXIudXNlcklkXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZW5kRXZlbnQoJ3VwZGF0ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRFdmVudChldmVudCA9ICd1cGRhdGUnKSB7XHJcbiAgICAgICAgc3VwZXIuc2VuZEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCd1cGRhdGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCd1cGRhdGUnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHN1cGVyLmxvZ291dCgpO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NodXRkb3duJyk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY29tOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIE5ld1JlbGljIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG5cclxuICAgICAgICB0aGlzLk5ld1JlbGljID0gd2luZG93Lk5SRVVNO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLk5ld1JlbGljID0gdGhpcy5OZXdSZWxpYyB8fCB3aW5kb3cuTlJFVU07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuTmV3UmVsaWM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW50ZWdyYXRpb24gJiYgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUoJ3VzZXJuYW1lJywgdGhpcy51c2VyLmVtYWlsKTtcclxuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUoJ2FjY2NvdW50SUQnLCB0aGlzLnVzZXIudXNlcklkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xyXG4gICAgICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG4gICAgICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZWdyYXRpb24uYWRkVG9UcmFjZSh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGFnZVZpZXdOYW1lKHBhdGgsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV3UmVsaWM7XHJcblxyXG5cclxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgVHdpdHRlciBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgICAgIGxldCBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgICAgICAgIHQgPSB3aW5kb3cudHd0dHIgfHwge307XHJcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgICAgICBqcy5zcmMgPSBcImh0dHBzOi8vcGxhdGZvcm0udHdpdHRlci5jb20vd2lkZ2V0cy5qc1wiO1xyXG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwidHdpdHRlci13anNcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24ucmVhZHkoKHR3aXR0ZXIpID0+IHtcclxuICAgICAgICAgICAgdHdpdHRlci53aWRnZXRzLmxvYWQoKTtcclxuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnY2xpY2snLCB0aGlzLl9jbGlja0V2ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCd0d2VldCcsIHRoaXMuX3R3ZWV0SW50ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdyZXR3ZWV0JywgdGhpcy5fcmV0d2VldEludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnZmF2b3JpdGUnLCB0aGlzLl9mYXZJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ2ZvbGxvdycsIHRoaXMuX2ZvbGxvd0ludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHRyeUNvdW50ID0gMDtcclxuICAgICAgICBsZXQgbG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy50d3R0ciAmJiB3aW5kb3cudHd0dHIud2lkZ2V0cykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy50d3R0ci53aWRnZXRzLmxvYWQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0cnlDb3VudCA8IDUpIHtcclxuICAgICAgICAgICAgICAgIHRyeUNvdW50ICs9IDE7XHJcbiAgICAgICAgICAgICAgICBfLmRlbGF5KGxvYWQsIDI1MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMudHd0dHIgPSB0aGlzLnR3dHRyIHx8IHdpbmRvdy50d3R0cjtcclxuICAgICAgICByZXR1cm4gdGhpcy50d3R0cjtcclxuICAgIH1cclxuXHJcbiAgICBfZm9sbG93SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhYmVsID0gaW50ZW50RXZlbnQuZGF0YS51c2VyX2lkICsgXCIgKFwiICsgaW50ZW50RXZlbnQuZGF0YS5zY3JlZW5fbmFtZSArIFwiKVwiO1xyXG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIF9yZXR3ZWV0SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhYmVsID0gaW50ZW50RXZlbnQuZGF0YS5zb3VyY2VfdHdlZXRfaWQ7XHJcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2ZhdkludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5fdHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3R3ZWV0SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhYmVsID0gXCJ0d2VldFwiO1xyXG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xyXG4gICAgfVxyXG4gICAgX2NsaWNrRXZlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcclxuICAgICAgICBsZXQgbGFiZWwgPSBpbnRlbnRFdmVudC5yZWdpb247XHJcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHdpdHRlcjtcclxuXHJcblxyXG4iLCJcclxuY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgVXNlclNuYXAgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgbGV0IGFwaUtleSwgcywgeDtcclxuICAgICAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uZmlnID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFwaUtleSA9IGNvbmZpZy5hcGk7XHJcbiAgICAgICAgaWYgKGFwaUtleSAmJiAhd2luZG93LmxvY2F0aW9uLmhvc3Quc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcclxuICAgICAgICAgICAgbGV0IHVzQ29uZiA9IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsQm94OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWxCb3hWYWx1ZTogdXNlci5lbWFpbCxcclxuICAgICAgICAgICAgICAgIGVtYWlsUmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlUmVjb3JkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdvb2dsZS5zZW5kRXZlbnQoJ2ZlZWRiYWNrJywgJ3VzZXJzbmFwJywgJ3dpZGdldCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0gd2luZG93Ll91c2Vyc25hcGNvbmZpZyA9IHVzQ29uZjtcclxuXHJcbiAgICAgICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XHJcbiAgICAgICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgICAgICB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gdGhpcy51c2VyU25hcCB8fCB3aW5kb3cuVXNlclNuYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlclNuYXA7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyU25hcDsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBaZW5EZXNrIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgICAgIGxldCB6TyA9IHt9O1xyXG4gICAgICAgIHdpbmRvdy56RW1iZWQgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZSwgdCkge1xyXG4gICAgICAgICAgICBsZXQgbiwgbywgZCwgaSwgcywgYSA9IFtdLCByID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTsgd2luZG93LnpFbWJlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGEucHVzaChhcmd1bWVudHMpXHJcbiAgICAgICAgICAgIH0sIHdpbmRvdy56RSA9IHdpbmRvdy56RSB8fCB3aW5kb3cuekVtYmVkLCByLnNyYyA9IFwiamF2YXNjcmlwdDpmYWxzZVwiLCByLnRpdGxlID0gXCJcIiwgci5yb2xlID0gXCJwcmVzZW50YXRpb25cIiwgKHIuZnJhbWVFbGVtZW50IHx8IHIpLnN0eWxlLmNzc1RleHQgPSBcImRpc3BsYXk6IG5vbmVcIiwgZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpLCBkID0gZFtkLmxlbmd0aCAtIDFdLCBkLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHIsIGQpLCBpID0gci5jb250ZW50V2luZG93LCBzID0gaS5kb2N1bWVudDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIG8gPSBzXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGMpIHtcclxuICAgICAgICAgICAgICAgIG4gPSBkb2N1bWVudC5kb21haW4sIHIuc3JjID0gJ2phdmFzY3JpcHQ6bGV0IGQ9ZG9jdW1lbnQub3BlbigpO2QuZG9tYWluPVwiJyArIG4gKyAnXCI7dm9pZCgwKTsnLCBvID0gc1xyXG4gICAgICAgICAgICB9IG8ub3BlbigpLl9sID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7IG4gJiYgKHRoaXMuZG9tYWluID0gbiksIG8uaWQgPSBcImpzLWlmcmFtZS1hc3luY1wiLCBvLnNyYyA9IGUsIHRoaXMudCA9ICtuZXcgRGF0ZSwgdGhpcy56ZW5kZXNrSG9zdCA9IHQsIHRoaXMuekVRdWV1ZSA9IGEsIHRoaXMuYm9keS5hcHBlbmRDaGlsZChvKVxyXG4gICAgICAgICAgICAgICAgek8ubG9naWMgPSB3aW5kb3cuekU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG8ud3JpdGUoJzxib2R5IG9ubG9hZD1cImRvY3VtZW50Ll9sKCk7XCI+JyksXHJcbiAgICAgICAgICAgIG8uY2xvc2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgKFwiaHR0cHM6Ly9hc3NldHMuemVuZGVzay5jb20vZW1iZWRkYWJsZV9mcmFtZXdvcmsvbWFpbi5qc1wiLCBjb25maWcuc2l0ZSk7XHJcblxyXG4gICAgICAgIHpPLndpZGdldCA9IHdpbmRvdy56RW1iZWQ7XHJcbiAgICAgICAgek8ubG9naWMgPSB3aW5kb3cuekU7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KClcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy56RTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVc2VyKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5pZGVudGlmeSh7IG5hbWU6IHRoaXMudXNlci5mdWxsTmFtZSwgZW1haWw6IHRoaXMudXNlci5lbWFpbCB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNvbnN0IHplbkRlc2sgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcblxyXG4gICAgcmV0dXJuIHpPO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBaZW5EZXNrOyIsImNsYXNzIEludGVncmF0aW9uc0Jhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XHJcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xyXG5cdH1cclxuXHRcclxuXHRpbml0KCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdGdldCBpbnRlZ3JhdGlvbigpIHtcclxuXHRcdHJldHVybiB7fTtcclxuXHR9XHJcblx0XHJcblx0c2V0VXNlcigpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRzZW5kRXZlbnQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRsb2dvdXQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zQmFzZTsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBHb29nbGUgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcclxuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xyXG4gICAgfSkoKTtcclxuICAgICAgXHJcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcclxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAnZ3RtLnN0YXJ0JzpcclxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXHJcbiAgICAgIH0pOyBsZXQgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XHJcbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCB0aGlzLmNvbmZpZy50YWdtYW5hZ2VyKTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcclxuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcclxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcclxuICAgIHJldHVybiB0aGlzLmdhO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHN1cGVyLmluaXQoKTtcclxuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xyXG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG4gICAgaWYoZG9tYWluLnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XHJcbiAgICAgIG1vZGUgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdjcmVhdGUnLCB0aGlzLmNvbmZpZy5hbmFseXRpY3MsIG1vZGUpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcigpIHtcclxuICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsICd1c2VySWQnLCB0aGlzLnVzZXIudXNlcklkKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgaWYgKHNvdXJjZSAmJiB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCB2YWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xyXG4gICAgICAgICAgICBwYWdlOiBwYXRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRFdmVudChldmVudCwgc291cmNlLCB0eXBlLCB1cmwpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcclxuXHJcblxyXG4iLCJjb25zdCByaW90ID0gd2luZG93LnJpb3Q7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IHBhZ2VCb2R5ID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlLWJvZHkuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9BY3Rpb24uanMnKTtcclxuXHJcbmNsYXNzIFBhZ2VGYWN0b3J5IHtcclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50ZXIsIG1ldGFGaXJlKSB7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gbmV3IEFjdGlvbnMobWV0YUZpcmUsIGV2ZW50ZXIsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25SZWFkeSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuTUVUQV9QUk9HUkVTU31gKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoJyonKTtcclxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5jb25maWd1cmUoeyBwYXJlbnQ6IGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuTUVUQV9QUk9HUkVTU19ORVhUfWAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdCgpOyAvLyBpbml0IG1ldHJvbmljIGNvcmUgY29tcG9uZXRzXHJcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmluaXQoKTsgLy8gaW5pdCBsYXlvdXRcclxuICAgICAgICAgICAgICAgICAgICBEZW1vLmluaXQoKTsgLy8gaW5pdCBkZW1vIGZlYXR1cmVzXHJcbiAgICAgICAgICAgICAgICAgICAgSW5kZXguaW5pdCgpOyAvLyBpbml0IGluZGV4IHBhZ2VcclxuICAgICAgICAgICAgICAgICAgICBUYXNrcy5pbml0RGFzaGJvYXJkV2lkZ2V0KCk7IC8vIGluaXQgdGFzaCBkYXNoYm9hcmQgd2lkZ2V0XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMjUwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlKHBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcykge1xyXG4gICAgICAgIGxldCBhY3QgPSB0aGlzLmFjdGlvbnMuYWN0KHBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgaWYgKCFhY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKHBhdGgsIHBhdGgsIHsgaWQ6IGlkLCBhY3Rpb246IGFjdGlvbiB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWdlRmFjdG9yeTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDYW52YXMgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJyk7XHJcbnJlcXVpcmUoJy4vbm9kZScpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodCBqdGstZGVtby1tYWluXCIgc3R5bGU9XCJwYWRkaW5nOiAwOyBcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJqdGstZGVtby1jYW52YXMgY2FudmFzLXdpZGVcIiBpZD1cImRpYWdyYW1cIj5cclxuXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtZXRhLWNhbnZhcycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMubWFwSWQgPSBudWxsO1xyXG4gICAgdGhpcy5jYW52YXMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuYnVpbGRDYW52YXMgPSAobWFwKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhbnZhcykge1xyXG4gICAgICAgICAgICAkKHRoaXMuZGlhZ3JhbSkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICQodGhpcy5kaWFncmFtKS53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gICQodGhpcy5kaWFncmFtKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB4TG9jID0gd2lkdGgvMiAtIDI1LFxyXG4gICAgICAgICAgICAgICAgeUxvYyA9IDEwMDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbmV3IENhbnZhcyhtYXAsIHRoaXMubWFwSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG1hcC5jaGFuZ2VkX2J5ICE9IE1ldGFNYXAuVXNlci51c2VyS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkID0gKG9wdHMpID0+IHtcclxuICAgICAgICBpZiAob3B0cy5pZCAhPSB0aGlzLm1hcElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYG1hcHMvZGF0YS8ke3RoaXMubWFwSWR9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XHJcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWFwcy9kYXRhLyR7b3B0cy5pZH1gLCB0aGlzLmJ1aWxkQ2FudmFzKTtcclxuICAgICAgICAgICAgTWV0YU1hcC5FdmVudGVyLmZvcmdldCgnbWFwJywgdGhpcy5idWlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgnbWFwJywgdGhpcy5idWlsZCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0SGVpZ2h0ID0gKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5kaWFncmFtKS5jc3Moe1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCArICdweCdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJyk7XHJcblxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuYFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbm9kZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuY29uc3QgUHMgPSByZXF1aXJlKCdwZXJmZWN0LXNjcm9sbGJhcicpO1xyXG5cclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhci13cmFwcGVyXCIgc3R5bGU9XCJ7IGdldERpc3BsYXkoKSB9XCI+XHJcbiAgICA8ZGl2IGlkPVwiY2hhdF9zaGVsbFwiIGNsYXNzPVwicGFnZS1zaWRlYmFyIHBhbmVsXCIgZGF0YS1rZWVwLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWF1dG8tc2Nyb2xsPVwidHJ1ZVwiIGRhdGEtc2xpZGUtc3BlZWQ9XCIyMDBcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiYm90X3RpdGxlXCIgY2xhc3M9XCJwYW5lbC10aXRsZSBjaGF0LXdlbGNvbWVcIj5Db3J0ZXggTWFuPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZD1cImNoYXRfYm9keVwiIGNsYXNzPVwicGFuZWwtYm9keVwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiPlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJtZWRpYS1saXN0IGV4YW1wbGUtY2hhdC1tZXNzYWdlc1wiIGlkPVwiZXhhbXBsZS1tZXNzYWdlc1wiPlxyXG4gICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lc3NhZ2VzIH1cIiBjbGFzcz1cIm1lZGlhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInB1bGwteyBsZWZ0OiBhdXRob3IgPT0gJ2NvcnRleCcsIHJpZ2h0OiBhdXRob3IgIT0gJ2NvcnRleCcgfVwiIGhyZWY9XCIjXCI+PGltZyBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cIm1lZGlhLW9iamVjdCBpbWctY2lyY2xlXCIgc3JjPVwieyBwaWN0dXJlIH1cIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keSBidWJibGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IG1lc3NhZ2UgfVwiPjwvcmF3PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz1cInRleHQtbXV0ZWRcIj48YnI+eyBwYXJlbnQuZ2V0UmVsYXRpdmVUaW1lKHRpbWUpIH08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtZm9vdGVyXCIgc3R5bGU9XCJwb3NpdGlvbjogZml4ZWQ7IHdpZHRoOiAyMzNweDsgYm90dG9tOiAyNnB4O1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJjaGF0X2lucHV0X2Zvcm1cIiBvbnN1Ym1pdD1cInsgb25TdWJtaXQgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNoYXRfaW5wdXRcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBtZXNzYWdlLi4uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYmx1ZVwiIHR5cGU9XCJzdWJtaXRcIj5TZW5kPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYFxyXG5cclxucmlvdC50YWcoJ2NoYXQnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIHRoaXMuY29ydGV4UGljdHVyZSA9ICdzcmMvaW1hZ2VzL2NvcnRleC1hdmF0YXItc21hbGwuanBnJztcclxuICAgIHRoaXMubWVzc2FnZXMgPSBbe1xyXG4gICAgICAgIG1lc3NhZ2U6IGBIZWxsbywgSSdtIENvcnRleCBNYW4uIEFzayBtZSBhbnl0aGluZy4gVHJ5IDxjb2RlPi9oZWxwPC9jb2RlPiBpZiB5b3UgZ2V0IGxvc3QuYCxcclxuICAgICAgICBhdXRob3I6ICdjb3J0ZXgnLFxyXG4gICAgICAgIHBpY3R1cmU6IHRoaXMuY29ydGV4UGljdHVyZSxcclxuICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpXHJcbiAgICB9XTtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmNoYXRfc2hlbGwuc3R5bGUuaGVpZ2h0ID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCkgKyAncHgnXHJcbiAgICAgICAgdGhpcy5jaGF0X2JvZHkuc3R5bGUuaGVpZ2h0ID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDI2NykgKyAncHgnXHJcbiAgICAgICAgUHMudXBkYXRlKHRoaXMuY2hhdF9ib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIFBzLmluaXRpYWxpemUodGhpcy5jaGF0X2JvZHkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0UmVsYXRpdmVUaW1lID0gKGRhdGUgPSBuZXcgRGF0ZSgpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblN1Ym1pdCA9IChvYmopID0+IHtcclxuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmNoYXRfaW5wdXQudmFsdWUsXHJcbiAgICAgICAgICAgIGF1dGhvcjogTWV0YU1hcC5Vc2VyLnVzZXJOYW1lLFxyXG4gICAgICAgICAgICBwaWN0dXJlOiBNZXRhTWFwLlVzZXIucGljdHVyZSxcclxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFlvdSBhc2tlZCBtZSAke3RoaXMuY2hhdF9pbnB1dC52YWx1ZX0uIFRoYXQncyBncmVhdCFgLFxyXG4gICAgICAgICAgICBhdXRob3I6ICdjb3J0ZXgnLFxyXG4gICAgICAgICAgICBwaWN0dXJlOiB0aGlzLmNvcnRleFBpY3R1cmUsXHJcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuY2hhdF9pbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLmNoYXRfYm9keS5zY3JvbGxUb3AgPSB0aGlzLmNoYXRfYm9keS5zY3JvbGxIZWlnaHRcclxuICAgICAgICBQcy51cGRhdGUodGhpcy5jaGF0X2JvZHkpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2dnbGUgPSAoc3RhdGUpID0+IHtcclxuICAgICAgICB0aGlzLmRpc3BsYXkgPSBzdGF0ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICBNZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTilcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2dnbGUodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCd0eXBlYWhlYWQuanMnKVxyXG5yZXF1aXJlKCdib290c3RyYXAtc2VsZWN0JylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuLi8uLi90b29scy9zaGltcycpO1xyXG5jb25zdCBTaGFyaW5nID0gcmVxdWlyZSgnLi4vLi4vYXBwL1NoYXJpbmcnKVxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cInNoYXJlX21vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGEgaWQ9XCJzaGFyZV9wdWJsaWNfbGlua1wiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmbG9hdDogcmlnaHQ7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCJcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLWNsaXBib2FyZC10ZXh0PVwie3dpbmRvdy5sb2NhdGlvbi5ob3N0KycvJyt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUrJy9tYXBzLycrb3B0cy5tYXAuaWR9XCJcclxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBnZXRQdWJsaWNMaW5rIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgR2V0IHNoYXJhYmxlIGxpbmsgIDxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT48L2E+XHJcbiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPlNoYXJlIHdpdGggb3RoZXJzPC9oND5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8cD5QZW9wbGU8L3A+XHJcbiAgICAgICAgICAgICAgICA8Zm9ybSByb2xlPVwiZm9ybVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cInNoYXJlX3R5cGVhaGVhZFwiIGNsYXNzPVwiY29sLW1kLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBzdHlsZT1cImhlaWdodDogMzVweDtcIiBpZD1cInNoYXJlX2lucHV0XCIgY2xhc3M9XCJ0eXBlYWhlYWQgZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkVudGVyIG5hbWVzIG9yIGVtYWlsIGFkZHJlc3Nlcy4uLlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNoYXJlX3Blcm1pc3Npb25cIiBjbGFzcz1cInNlbGVjdHBpY2tlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlYWRcIiBkYXRhLWNvbnRlbnQ9XCI8c3Bhbj48aSBjbGFzcz0nZmEgZmEtZXllJz48L2k+IENhbiB2aWV3PC9zcGFuPlwiPkNhbiB2aWV3PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid3JpdGVcIiBkYXRhLWNvbnRlbnQ9XCI8c3Bhbj48aSBjbGFzcz0nZmEgZmEtcGVuY2lsJz48L2k+IENhbiBlZGl0PC9zcGFuPlwiPkNhbiBlZGl0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZD1cInNoYXJlX2J1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1pY29uLW9ubHkgZ3JlZW5cIiBvbmNsaWNrPVwieyBvblNoYXJlIH1cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlmPVwieyBvcHRzICYmIG9wdHMubWFwICYmIG9wdHMubWFwLnNoYXJlZF93aXRofVwiIGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImxhYmVsIGxhYmVsLWRlZmF1bHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiA1cHg7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZj1cInsgaSAhPSAnYWRtaW4nICYmICh2YWwud3JpdGUgfHwgdmFsLnJlYWQpIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGksIHZhbCBpbiBvcHRzLm1hcC5zaGFyZWRfd2l0aH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBpZj1cInsgdmFsLndyaXRlIH1cIiBjbGFzcz1cImZhIGZhLXBlbmNpbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBpZj1cInsgIXZhbC53cml0ZSB9XCIgY2xhc3M9XCJmYSBmYS1leWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWwubmFtZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25VblNoYXJlIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5Eb25lPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc2hhcmUnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJylcclxuICAgIGNvbnN0IHNoYXJlID0gbmV3IFNoYXJpbmcoTWV0YU1hcC5Vc2VyKVxyXG5cclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG5cclxuICAgIHRoaXMuZ2V0UHVibGljTGluayA9IChlLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblNoYXJlID0gKGUsIG9wdHMpID0+IHtcclxuICAgICAgICB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW3RoaXMuc3VnZ2VzdGlvbi5pZF0gPSB7XHJcbiAgICAgICAgICAgIHJlYWQ6IHRoaXMucGlja2VyLnZhbCgpID09ICdyZWFkJyB8fCB0aGlzLnBpY2tlci52YWwoKSA9PSAnd3JpdGUnLFxyXG4gICAgICAgICAgICB3cml0ZTogdGhpcy5waWNrZXIudmFsKCkgPT0gJ3dyaXRlJyxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5zdWdnZXN0aW9uLm5hbWUsXHJcbiAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMuc3VnZ2VzdGlvbi5waWN0dXJlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYXJlLmFkZFNoYXJlKHRoaXMub3B0cy5tYXAsIHRoaXMuc3VnZ2VzdGlvbiwgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLnN1Z2dlc3Rpb24uaWRdKVxyXG5cclxuICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBudWxsXHJcbiAgICAgICAgdGhpcy50YS50eXBlYWhlYWQoJ3ZhbCcsICcnKVxyXG4gICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLmhpZGUoKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25VblNoYXJlID0gKGUsIG9wdHMpID0+IHtcclxuICAgICAgICBlLml0ZW0udmFsLmlkID0gZS5pdGVtLmlcclxuICAgICAgICBkZWxldGUgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFtlLml0ZW0uaV1cclxuICAgICAgICBzaGFyZS5yZW1vdmVTaGFyZSh0aGlzLm9wdHMubWFwLCBlLml0ZW0udmFsKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsIChvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKG9wdHMpIHtcclxuICAgICAgICAgICAgXy5leHRlbmQodGhpcy5vcHRzLCBvcHRzKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKGUsIG9wdHMpID0+IHtcclxuICAgICAgICAkKHRoaXMuc2hhcmVfbW9kYWwpLm1vZGFsKCdzaG93JylcclxuICAgICAgICB0aGlzLnRhID0gJCgnI3NoYXJlX3R5cGVhaGVhZCAudHlwZWFoZWFkJykudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSx7XHJcbiAgICAgICAgICAgIHNvdXJjZTogKHF1ZXJ5LCBzeW5jTWV0aG9kLCBhc3luY01ldGhvZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1ldGFtYXAuY28vdXNlcnMvZmluZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJJZDogTWV0YU1hcC5Vc2VyLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbklkOiBNZXRhTWFwLkF1dGgwLmN0b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRVc2VyczogXy5rZXlzKHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IHF1ZXJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICcqJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6ICdzcmMvaW1hZ2VzL3dvcmxkLWdsb2JlLmpwZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUHVibGljJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luY01ldGhvZChkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmoubmFtZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICBlbXB0eTogW1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJwYWRkaW5nOiA1cHggMTBweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ1VuYWJsZSB0byBmaW5kIGFueSB1c2VycyBtYXRjaGluZyB0aGlzIHF1ZXJ5JyxcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICBdLmpvaW4oJ1xcbicpLFxyXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbjogKHZhbHVlKSA9PiB7IHJldHVybiBgPGRpdj48aW1nIGFsdD1cIiR7dmFsdWUubmFtZX1cIiBoZWlnaHQ9XCIzMFwiIHdpZHRoPVwiMzBcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCIke3ZhbHVlLnBpY3R1cmV9XCI+ICR7dmFsdWUubmFtZX08L2Rpdj5gIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50YS5vbigndHlwZWFoZWFkOnNlbGVjdCcsIChldiwgc3VnZ2VzdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXHJcbiAgICAgICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLnNob3coKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50YS5vbigndHlwZWFoZWFkOmF1dG9jb21wbGV0ZScsIChldiwgc3VnZ2VzdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXHJcbiAgICAgICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLnNob3coKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5waWNrZXIgPSAkKCcuc2VsZWN0cGlja2VyJykuc2VsZWN0cGlja2VyKHtcclxuICAgICAgICAgICAgd2lkdGg6ICdhdXRvJ1xyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdyYWR1YXRpb24tY2FwXCI+PC9pPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNzBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IGhlbHAgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGhlbHAgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1oZWxwJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oZWxwID0gbnVsbDtcclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvaGVscCcsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVscCA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuLi8uLi90b29scy9zaGltcycpXHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWJlbGwtb1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBub3RpZmljYXRpb25zLmxlbmd0aCB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV4dGVybmFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IG5vdGlmaWNhdGlvbnMubGVuZ3RoIH0gcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9ueyBzOiBub3RpZmljYXRpb25zLmxlbmd0aCA9PSAwIHx8IG5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyBhbGxOb3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyB0cnVlICE9IGFyY2hpdmVkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IHZhbCwgaSBpbiBub3RpZmljYXRpb25zIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWY9XCJ7IHZhbCAmJiB2YWwucGhvdG8gfVwiIGNsYXNzPVwicGhvdG9cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cInsgdmFsLnBob3RvIH1cIiBjbGFzcz1cImltZy1jaXJjbGVcIiBhbHQ9XCJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN1YmplY3RcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImZyb21cIj57IHZhbC5mcm9tIH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJ0aW1lXCIgc3R5bGU9XCJwYWRkaW5nOiAwO1wiPnsgcGFyZW50LmdldFRpbWUodmFsLnRpbWUpIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtZXNzYWdlXCI+eyB2YWwuZXZlbnQgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtbm90aWZpY2F0aW9ucycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIGNvbnN0IGZiUGF0aCA9IENPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQoTWV0YU1hcC5Vc2VyLnVzZXJJZClcclxuXHJcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBbXTtcclxuICAgIHRoaXMuYWxsTm90aWZpY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBldmVudC5pdGVtLnZhbFxyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YSh0cnVlLCBgJHtmYlBhdGh9LyR7aXRlbS5pZH0vYXJjaGl2ZWApXHJcbiAgICAgICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuTk9USUZJQ0FUSU9OLk1BUDpcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHtpdGVtLm1hcElkfWApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0VGltZSA9ICh0aW1lKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZSh0aW1lKSkuZnJvbU5vdygpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGZiUGF0aClcclxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUucHVzaERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudDogJ1lvdSBzaWduZWQgdXAgZm9yIE1ldGFNYXAhJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKSB9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjaGl2ZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LCBmYlBhdGgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQoTWV0YU1hcC5Vc2VyLnVzZXJJZCksIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxOb3RpZmljYXRpb25zID0gXy5tYXAoZGF0YSwgKG4sIGlkKSA9PiB7IG4uaWQgPSBpZDsgcmV0dXJuIG47ICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBfLmZpbHRlcihfLnNvcnRCeSh0aGlzLmFsbE5vdGlmaWNhdGlvbnMsICdkYXRlJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtdHJvcGh5XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2Utc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHBvaW50cy5sZW5ndGggfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJib2xkXCI+eyBwb2ludHMubGVuZ3RoIH0gbmV3IDwvc3Bhbj4gYWNoaWV2ZW1lbnR7IHM6IHBvaW50cy5sZW5ndGggPT0gMCB8fCBwb2ludHMubGVuZ3RoID4gMSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBwb2ludHMgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgcG9pbnRzIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZVwiPnsgdGltZSB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRldGFpbHNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBldmVudCB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtcG9pbnRzJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYHVzZXJzLyR7TWV0YU1hcC5Vc2VyLnVzZXJJZH0vcG9pbnRzYCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVzZXJuYW1lIHVzZXJuYW1lLWhpZGUtb24tbW9iaWxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlcm5hbWUgfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGlmPVwieyBwaWN0dXJlIH1cIiBhbHQ9XCJcIiBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCJ7IHBpY3R1cmUgfVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgbWVudSB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgbWVudSB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyBsaW5rIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS11c2VyJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMubWVudSA9IFtdO1xyXG4gICAgdGhpcy51c2VybmFtZSA9ICcnO1xyXG4gICAgdGhpcy5waWN0dXJlID0gJyc7XHJcblxyXG4gICAgdGhpcy5sb2dvdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5sb2dvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxpbmtBY2NvdW50ID0gKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuQXV0aDAubGlua0FjY291bnQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIHN3aXRjaChldmVudC5pdGVtLmxpbmspIHtcclxuICAgICAgICAgICAgY2FzZSAnI2xpbmstc29jaWFsLWFjY291bnRzJzpcclxuICAgICAgICAgICAgICAgIHRoaXMubGlua0FjY291bnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWV0YW1hcC91c2VyYCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IE1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZTtcclxuICAgICAgICAgICAgdGhpcy5waWN0dXJlID0gTWV0YU1hcC5Vc2VyLnBpY3R1cmU7XHJcbiAgICAgICAgICAgIHRoaXMubWVudSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuLi90b29scy9zaGltcycpO1xyXG5jb25zdCBQZXJtaXNzaW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9QZXJtaXNzaW9ucycpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1hY3Rpb25zXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gcmVkLWhhemUgYnRuLXNtIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRkZW4tc20gaGlkZGVuLXhzXCI+QWN0aW9ucyZuYnNwOzwvc3Bhbj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxyXG4gICAgICAgICAgICA8bGkgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEgfVwiIGNsYXNzPVwieyBzdGFydDogaSA9PSAwLCBhY3RpdmU6IGkgPT0gMCB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBpZj1cInsgcGFyZW50LmdldExpbmtBbGxvd2VkKHZhbCkgfVwiIGhyZWY9XCJ7IHBhcmVudC5nZXRBY3Rpb25MaW5rKHZhbCkgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyB2YWwuaWNvbiB9XCI+PC9pPiB7IHZhbC50aXRsZSB9XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxyXG4gICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3NldHRpbmdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1nZWFyXCI+PC9pPiBTZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8c3BhbiBzdHlsZT1cInBhZGRpbmctbGVmdDogNXB4O1wiPlxyXG4gICAgICAgIDxzcGFuIGlmPVwieyBwYWdlTmFtZSB9XCJcclxuICAgICAgICAgICAgICAgIGlkPVwibWFwX25hbWVcIlxyXG4gICAgICAgICAgICAgICAgZGF0YS10eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICBkYXRhLXRpdGxlPVwiRW50ZXIgbWFwIG5hbWVcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPlxyXG4gICAgICAgICAgICB7IHBhZ2VOYW1lIH1cclxuICAgICAgICA8L3NwYW4+XHJcbiAgICA8L3NwYW4+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1hY3Rpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy5wYWdlTmFtZSA9ICdIb21lJztcclxuICAgIHRoaXMudXJsID0gTWV0YU1hcC5jb25maWcuc2l0ZS5kYiArICcuZmlyZWJhc2Vpby5jb20nO1xyXG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuZ2V0QWN0aW9uTGluayA9IChvYmopID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gb2JqLmxpbms7XHJcbiAgICAgICAgaWYgKG9iai51cmxfcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gW107XHJcbiAgICAgICAgICAgIF8uZWFjaChvYmoudXJsX3BhcmFtcywgKHBybSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKHRoaXNbcHJtLm5hbWVdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldCA9IG9iai5saW5rLmZvcm1hdC5jYWxsKG9iai5saW5rLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldExpbmtBbGxvd2VkID0gKG9iaikgPT4ge1xyXG4gICAgICAgIGxldCByZXQgPSB0cnVlID09IG9ialsnYWxsb3dlZC1vbiddWycqJ107XHJcbiAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gTWV0YU1hcC5Sb3V0ZXIuY3VycmVudFBhdGg7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bY3VycmVudFBhZ2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmV0ICYmIHRoaXMubWFwICYmIHBlcm1pc3Npb25zKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAob2JqLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdTaGFyZSBNYXAnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnRGVsZXRlIE1hcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGVybWlzc2lvbnMuaXNNYXBPd25lcigpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVBhZ2VOYW1lID0gKG1hcCkgPT4ge1xyXG4gICAgICAgIHBlcm1pc3Npb25zID0gbmV3IFBlcm1pc3Npb25zKG1hcClcclxuICAgICAgICB0aGlzLm1hcCA9IG1hcCB8fCB7fVxyXG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pc01hcE93bmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG1hcC5uYW1lIHx8ICcnXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG1hcC5uYW1lICsgJyAoU2hhcmVkIGJ5ICcgKyBtYXAub3duZXIubmFtZSArICcpJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVybWlzc2lvbnMgJiYgcGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5tYXBfbmFtZSkuZWRpdGFibGUoeyB1bnNhdmVkY2xhc3M6IG51bGwgfSkub24oJ3NhdmUnLCAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH0vbmFtZWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubG9hZGVkKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5tYXBfbmFtZSkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH1gKTtcclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG51bGxcclxuICAgICAgICAgICAgdGhpcy5tYXAgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRzLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFwSWQgPSBvcHRzLmlkO1xyXG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke29wdHMuaWR9YCwgKG1hcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlTmFtZShtYXApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhZ2VOYW1lID0gb3B0cy5uYW1lIHx8ICdIb21lJztcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9hY3Rpb25zJywgKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZUhlYWRlciA9IHJlcXVpcmUoJy4vcGFnZS1oZWFkZXInKTtcclxuY29uc3QgcGFnZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vcGFnZS1jb250YWluZXInKTtcclxuY29uc3QgcGFnZUZvb3RlciA9IHJlcXVpcmUoJy4vcGFnZS1mb290ZXInKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cInBhZ2VfYm9keVwiIGNsYXNzPVwicGFnZS1oZWFkZXItZml4ZWQgcGFnZS1zaWRlYmFyLWNsb3NlZC1oaWRlLWxvZ28gcGFnZS1zaWRlYmFyLWNsb3NlZC1oaWRlLWxvZ29cIj5cclxuXHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2hlYWRlclwiPjwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250YWluZXJcIj48L2Rpdj5cclxuXHJcbjwvZGl2PmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWJvZHknLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2hlYWRlciwgJ3BhZ2UtaGVhZGVyJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250YWluZXIsICdwYWdlLWNvbnRhaW5lcicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5wYWdlX2JvZHkpLmFkZENsYXNzKCdwYWdlLXNpZGViYXItcmV2ZXJzZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5wYWdlX2JvZHkpLnJlbW92ZUNsYXNzKCdwYWdlLXNpZGViYXItcmV2ZXJzZWQnKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZVNpZGViYXIgPSByZXF1aXJlKCcuL3BhZ2Utc2lkZWJhcicpO1xyXG5jb25zdCBjaGF0ID0gcmVxdWlyZSgnLi9jb3J0ZXgvY2hhdCcpXHJcbmNvbnN0IHBhZ2VDb250ZW50ID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRlbnQnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9zaWRlYmFyXCI+PC9kaXY+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2NvbnRlbnRcIj48L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvbnRhaW5lcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2Vfc2lkZWJhciwgJ2NoYXQnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2NvbnRlbnQsICdwYWdlLWNvbnRlbnQnKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRlbnQtd3JhcHBlclwiPlxyXG4gICAgPGRpdiBpZD1cInBhZ2UtY29udGVudFwiIGNsYXNzPVwicGFnZS1jb250ZW50XCI+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWhlYWRcIj5cclxuXHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG5cclxuICAgICAgICA8ZGl2IGlkPVwiYXBwLWNvbnRhaW5lclwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY29udGVudCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLmhhc1NpZGViYXIgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMucmVzaXplID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1NpZGViYXIpIHtcclxuICAgICAgICAgICAgJCh0aGlzWydhcHAtY29udGFpbmVyJ10pLmNzcyh7IHdpZHRoOiBgMTAwJWAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHdpZHRoID0gYCR7d2luZG93LmlubmVyV2lkdGggLSA0MH1weGA7XHJcbiAgICAgICAgICAgICQodGhpc1snYXBwLWNvbnRhaW5lciddKS5jc3MoeyB3aWR0aDogd2lkdGggfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzaXplKClcclxuICAgIH0pO1xyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaGFzU2lkZWJhciA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKVxyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaGFzU2lkZWJhciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVzaXplKClcclxuICAgIH0pO1xyXG5cclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1mb290ZXJcIiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAwO1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBhZ2UtZm9vdGVyLWlubmVyXCI+XHJcbiAgICAgICAgPGEgaHJlZj1cIiN0ZXJtc1wiPiZjb3B5OzIwMTU8L2E+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBwYWdlTG9nbyA9IHJlcXVpcmUoJy4vcGFnZS1sb2dvLmpzJyk7XHJcbmNvbnN0IHBhZ2VBY3Rpb25zID0gcmVxdWlyZSgnLi9wYWdlLWFjdGlvbnMuanMnKTtcclxuY29uc3QgcGFnZVNlYXJjaCA9IHJlcXVpcmUoJy4vcGFnZS1zZWFyY2guanMnKTtcclxuY29uc3QgcGFnZVRvcE1lbnUgPSByZXF1aXJlKCcuL3BhZ2UtdG9wbWVudScpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cImhlYWRlci10b3BcIiBjbGFzcz1cInBhZ2UtaGVhZGVyIG5hdmJhciBuYXZiYXItZml4ZWQtdG9wXCI+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wcm9ncmVzc19uZXh0XCIgc3R5bGU9XCJvdmVyZmxvdzogaW5oZXJpdDtcIj48L2Rpdj5cclxuICAgIDxkaXYgaWQ9XCJoZWFkZXItY29udGVudFwiIGNsYXNzPVwicGFnZS1oZWFkZXItaW5uZXJcIj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9sb2dvXCI+PC9kaXY+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9hY3Rpb25zXCI+PC9kaXY+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV90b3BcIiBjbGFzcz1cInBhZ2UtdG9wXCI+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2Vfc2VhcmNoXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcG1lbnVcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1oZWFkZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2xvZ28sICdwYWdlLWxvZ28nKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2FjdGlvbnMsICdwYWdlLWFjdGlvbnMnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3RvcCwgJ3BhZ2Utc2VhcmNoJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV90b3AsICdwYWdlLXRvcG1lbnUnKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcyA9XCJwYWdlLWxvZ29cIj5cclxuICAgIDxhIGlkPVwibWV0YV9sb2dvXCIgaHJlZj1cIiNob21lXCI+XHJcbiAgICAgICAgPGltZyBzcmM9XCJzcmMvaW1hZ2VzL21ldGFtYXBfY2xvdWQucG5nXCIgYWx0PVwibG9nb1wiIGNsYXNzID1cImxvZ28tZGVmYXVsdFwiIC8+XHJcbiAgICA8L2E+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9tZW51X3RvZ2dsZVwiIGNsYXNzPVwibWVudS10b2dnbGVyIHNpZGViYXItdG9nZ2xlclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiIHN0eWxlPVwieyBnZXREaXNwbGF5KCdtZW51JykgfVwiPlxyXG4gICAgICAgIDwhLS1ET0M6IFJlbW92ZSB0aGUgYWJvdmUgXCJoaWRlXCIgdG8gZW5hYmxlIHRoZSBzaWRlYmFyIHRvZ2dsZXIgYnV0dG9uIG9uIGhlYWRlci0tPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG48YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3MgPVwibWVudS10b2dnbGVyIHJlc3BvbnNpdmUtdG9nZ2xlclwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj5cclxuPC9hPlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1sb2dvJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFKTtcclxuICAgIH1cclxuXHJcbi8vICAgICB0aGlzLmdldERpc3BsYXkgPSAoZWwpID0+IHtcclxuLy9cclxuLy8gICAgICAgICBpZighdGhpcy5kaXNwbGF5KSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiAnZGlzcGxheTogbm9uZTsnO1xyXG4vLyAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiAnJztcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vXHJcbi8vICAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbi8vICAgICAgICAgdGhpcy5kaXNwbGF5ID0gZmFsc2U7XHJcbi8vICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuLy8gICAgIH0pO1xyXG4vL1xyXG4vL1xyXG4vLyAgICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbi8vICAgICAgICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcclxuLy8gICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4vLyAgICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPCEtLSBET0M6IEFwcGx5IFwic2VhcmNoLWZvcm0tZXhwYW5kZWRcIiByaWdodCBhZnRlciB0aGUgXCJzZWFyY2gtZm9ybVwiIGNsYXNzIHRvIGhhdmUgaGFsZiBleHBhbmRlZCBzZWFyY2ggYm94IC0tPlxyXG48Zm9ybSBjbGFzcz1cInNlYXJjaC1mb3JtXCIgYWN0aW9uPVwiZXh0cmFfc2VhcmNoLmh0bWxcIiBtZXRob2Q9XCJHRVRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2guLi5cIiBuYW1lPVwicXVlcnlcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0biBzdWJtaXRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG48L2Zvcm0+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXNlYXJjaCcsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIFxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyLXdyYXBwZXJcIiBzdHlsZT1cInsgZ2V0RGlzcGxheSgpIH1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwYWdlLXNpZGViYXIgbmF2YmFyLWNvbGxhcHNlIGNvbGxhcHNlXCI+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwicGFnZS1zaWRlYmFyLW1lbnUgXCIgZGF0YS1rZWVwLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWF1dG8tc2Nyb2xsPVwidHJ1ZVwiIGRhdGEtc2xpZGUtc3BlZWQ9XCIyMDBcIj5cclxuXHJcbiAgICAgICAgICAgIDxsaSBpZj1cInsgZGF0YSB9XCIgb25jbGljaz1cInsgcGFyZW50LmNsaWNrIH1cIiBlYWNoPVwieyBkYXRhIH1cIj5cclxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBpY29uIH1cIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiIHN0eWxlPVwiY29sb3I6I3sgY29sb3IgfTtcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInsgYXJyb3c6IG1lbnUubGVuZ3RoIH1cIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgaWY9XCJ7IG1lbnUgJiYgbWVudS5sZW5ndGggfVwiIGNsYXNzPVwic3ViLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgZWFjaD1cInsgbWVudSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgIDwvdWw+XHJcblxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1zaWRlYmFyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5jbGljayA9IGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZygnZm9vJykgfVxyXG4gICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvc2lkZWJhcicsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChpbmNsdWRlICYmIGQubWVudSAmJiBkLm1lbnUpIHtcclxuICAgICAgICAgICAgICAgIGQubWVudSA9IF8uZmlsdGVyKF8uc29ydEJ5KGQubWVudSwgJ29yZGVyJyksIChtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0uYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBcclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IG1ldGFQb2ludHMgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1wb2ludHMuanMnKTtcclxuY29uc3QgbWV0YUhlbHAgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1oZWxwLmpzJyk7XHJcbmNvbnN0IG1ldGFVc2VyID0gcmVxdWlyZSgnLi9tZW51L21ldGEtdXNlci5qcycpO1xyXG5jb25zdCBtZXRhTm90ID0gcmVxdWlyZSgnLi9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XHJcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBwdWxsLXJpZ2h0XCI+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfZGFzaGJvYXJkX2JhclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGhyZWY9XCIjaG9tZVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ob21lXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9saT5cclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX25vdGlmaWNhdGlvbl9iYXJcIj48L2xpPlxyXG5cclxuYFxyXG4gICAgICAgICAgICAvLyA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XHJcbiAgICAgICAgICAgIC8vIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX3BvaW50c19iYXJcIj48L2xpPlxyXG4rIGBcclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl9oZWxwX2JhclwiIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCI+PC9saT5cclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl91c2VyX21lbnVcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLXVzZXIgZHJvcGRvd25cIj48L2xpPlxyXG4gICAgPC91bD5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRvcG1lbnUnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIC8vVE9ETzogcmVzdG9yZSBub3RpZmljYXRpb25zIHdoZW4gbG9naWMgaXMgY29tcGxldGVcclxuICAgICAgICAvL3Jpb3QubW91bnQodGhpcy5oZWFkZXJfcG9pbnRzX2JhciwgJ21ldGEtcG9pbnRzJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9ub3RpZmljYXRpb25fYmFyLCAnbWV0YS1ub3RpZmljYXRpb25zJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9oZWxwX2JhciwgJ21ldGEtaGVscCcpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfdXNlcl9tZW51LCAnbWV0YS11c2VyJyk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdyBtYXJnaW4tYm90dG9tLTMwXCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPnsgaGVhZGVyLnRpdGxlIH08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8bGkgZWFjaD1cInsgYXJlYXMgfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0XHRcdFx0PCEtLSBCbG9ja3F1b3RlcyAtLT5cclxuXHRcdFx0XHRcdFx0XHQ8YmxvY2txdW90ZSBjbGFzcz1cImhlcm9cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwPnsgcXVvdGUudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNtYWxsPnsgcXVvdGUuYnkgfTwvc21hbGw+XHJcblx0XHRcdFx0XHRcdFx0PC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkZHRoaXNfaG9yaXpvbnRhbF9mb2xsb3dfdG9vbGJveFwiPjwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcyA9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpZnJhbWUgaWY9XCJ7IGhlYWRlci55b3V0dWJlaWQgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ5dHBsYXllclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHQvaHRtbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQveyBoZWFkZXIueW91dHViZWlkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzID1cImZpdHZpZHNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiaGVpZ2h0OiAzMjdweDsgd2lkdGg6IDEwMCU7IGRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tbGVmdDogYXV0bzsgbWFyZ2luLXJpZ2h0OiBhdXRvOyBicm9kZXI6IDA7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcblx0XHRcdFx0XHRcdFx0PC9pZnJhbWU+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRsaW5lXCI+XHJcblx0XHRcdFx0XHRcdDxoMz57IHVzZXJOYW1lIH17IHZpc2lvbi50aXRsZSB9PC9oMz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgdmlzaW9uLnRleHQgfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdob21lJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5hcmVhcyA9IFtdXHJcbiAgICB0aGlzLmhlYWRlciA9IHt9XHJcblxyXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLkhPTUUsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuYXJlYXMsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnF1b3RlID0gZGF0YS5xdW90ZTtcclxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xyXG4gICAgICAgIHRoaXMudmlzaW9uID0gZGF0YS52aXNpb247XHJcblxyXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2RhdGF0YWJsZXMnKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcclxuY29uc3QgU2hhcmVNYXAgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL1NoYXJlTWFwJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgaWQ9XCJteV9tYXBzX3BhZ2VcIiBjbGFzcz1cInBvcnRsZXQgYm94IGdyZXktY2FzY2FkZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtdGl0bGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tdGgtbGFyZ2VcIj48L2k+TWV0YU1hcHNcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGlmPVwieyBtZW51IH1cIiBjbGFzcz1cImFjdGlvbnNcIj5cclxuICAgICAgICAgICAgPGEgZWFjaD1cInsgbWVudS5idXR0b25zIH1cIiBocmVmPVwieyBsaW5rIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25BY3Rpb25DbGljayB9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDo7XCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY29nc1wiPjwvaT4gVG9vbHMgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lbnUubWVudSB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uTWVudUNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBwb3J0bGV0LXRhYnNcIj5cclxuICAgICAgICAgICAgPGxpIG9uY2xpY2s9XCJ7IHBhcmVudC5vblRhYlN3aXRjaCB9XCIgZWFjaD1cInsgdmFsLCBpIGluIHRhYnMgfVwiIGNsYXNzPVwieyBhY3RpdmU6IGkgPT0gMCB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI215bWFwc18xX3sgaSB9XCIgZGF0YS10b2dnbGU9XCJ0YWJcIiBhcmlhLWV4cGFuZGVkPVwieyB0cnVlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgeyB2YWwudGl0bGUgfTwvYT5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS10b29sYmFyXCI+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInRhYi1wYW5lIGZhc2UgaW4geyBhY3RpdmU6IGkgPT0gMCB9XCIgaWQ9XCJteW1hcHNfMV97IGkgfVwiPlxyXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlclwiIGlkPVwibXltYXBzX3RhYmxlX3sgaSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJ0YWJsZS1jaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJncm91cC1jaGVja2FibGVcIiBkYXRhLXNldD1cIiNteW1hcHNfdGFibGVfeyBpIH0gLmNoZWNrYm94ZXNcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZWQgT25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE93bmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgaWY9XCJ7IHBhcmVudC5kYXRhICYmIHBhcmVudC5kYXRhW2ldIH1cIiBlYWNoPVwieyBwYXJlbnQuZGF0YVtpXSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIHx8IHBhcmVudC51c2VyLmlzQWRtaW4gfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hlc1wiIHZhbHVlPVwiMVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc20gYmx1ZSBmaWx0ZXItc3VibWl0XCIgb25jbGljaz1cInsgcGFyZW50Lm9uT3BlbiB9XCI+T3BlbjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIH1cIiBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uU2hhcmUgfVwiPlNoYXJlIDxpIGNsYXNzPVwiZmEgZmEtc2hhcmVcIj48L2k+PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIiBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uQ29weSB9XCI+Q29weSA8aSBjbGFzcz1cImZhIGZhLWNsb25lXCI+PC9pPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IGVkaXRhYmxlIH1cIiBjbGFzcz1cIm1ldGFfZWRpdGFibGVfeyBpIH1cIiBkYXRhLXBrPVwieyBpZCB9XCIgZGF0YS10aXRsZT1cIkVkaXQgTWFwIE5hbWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyAhZWRpdGFibGUgfVwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj57IG5hbWUgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgY3JlYXRlZF9hdCB9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhdyBjb250ZW50PVwieyBwYXJlbnQuZ2V0U3RhdHVzKHRoaXMpIH1cIj48L3Jhdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgcGFyZW50LmdldE93bmVyKHRoaXMpIH1cIj48L3Jhdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbXktbWFwcycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLnVzZXIgPSBNZXRhTWFwLlVzZXI7XHJcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgdGhpcy5tZW51ID0gbnVsbDtcclxuICAgIGxldCB0YWJzID0gW1xyXG4gICAgICAgIHsgdGl0bGU6ICdNeSBNYXBzJywgb3JkZXI6IDAsIGVkaXRhYmxlOiB0cnVlIH0sXHJcbiAgICAgICAgeyB0aXRsZTogJ1NoYXJlZCB3aXRoIE1lJywgb3JkZXI6IDEsIGVkaXRhYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIHsgdGl0bGU6ICdQdWJsaWMnLCBvcmRlcjogMiwgZWRpdGFibGU6IGZhbHNlIH1cclxuICAgIF07XHJcbiAgICBpZiAodGhpcy51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgICB0YWJzLnB1c2goeyB0aXRsZTogJ0FsbCBNYXBzJywgb3JkZXI6IDMsIGVkaXRhYmxlOiB0cnVlIH0pXHJcbiAgICAgICAgdGFicy5wdXNoKHsgdGl0bGU6ICdUZW1wbGF0ZXMnLCBvcmRlcjogNCwgZWRpdGFibGU6IHRydWUgfSlcclxuICAgIH1cclxuICAgIHRoaXMudGFicyA9IF8uc29ydEJ5KHRhYnMsICdvcmRlcicpXHJcblxyXG4gICAgdGhpcy5jdXJyZW50VGFiID0gJ015IE1hcHMnO1xyXG5cclxuICAgIC8vXHJcbiAgICB0aGlzLmdldFN0YXR1cyA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgbGV0IHN0YXR1cyA9ICdQcml2YXRlJ1xyXG4gICAgICAgIGxldCBjb2RlID0gJ2RlZmF1bHQnXHJcbiAgICAgICAgbGV0IGh0bWwgPSAnJztcclxuICAgICAgICBpZiAoaXRlbS5zaGFyZWRfd2l0aCkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5zaGFyZWRfd2l0aFsnKiddICYmIChpdGVtLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlIHx8IGl0ZW0uc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ1B1YmxpYydcclxuICAgICAgICAgICAgICAgIGNvZGUgPSAncHJpbWFyeSdcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChpdGVtLnNoYXJlZF93aXRoLCAoc2hhcmUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGFyZS5waWN0dXJlICYmIGtleSAhPSAnKicgJiYga2V5ICE9ICdhZG1pbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJsYWJlbFwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtcGxhY2VtZW50PVwiYm90dG9tXCIgdGl0bGU9XCIke3NoYXJlLm5hbWV9XCI+PGltZyBhbHQ9XCIke3NoYXJlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtzaGFyZS5waWN0dXJlfVwiPjwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGlmIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9ICc8c3BhbiBjbGFzcz1cIlwiPlNoYXJlZCB3aXRoOiA8L3NwYW4+JyArIGh0bWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaHRtbCA9IGh0bWwgfHwgYDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtJHtjb2RlfVwiPiR7c3RhdHVzfTwvc3Bhbj5gXHJcblxyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0T3duZXIgPSAoaXRlbSkgPT4ge1xyXG4gICAgICAgIGxldCBodG1sID0gYDxzcGFuIGNsYXNzPVwibGFiZWxcIj48aW1nIGFsdD1cIiR7aXRlbS5vd25lci5uYW1lfVwiIGhlaWdodD1cIjMwXCIgd2lkdGg9XCIzMFwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cIiR7aXRlbS5vd25lci5waWN0dXJlfVwiPjwvc3Bhbj5gXHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy9FdmVudHNcclxuICAgIHRoaXMub25PcGVuID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2V2ZW50Lml0ZW0uaWR9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblNoYXJlID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgbGV0IG9wdHMgPSB7XHJcbiAgICAgICAgICAgIG1hcDogZXZlbnQuaXRlbVxyXG4gICAgICAgIH1cclxuICAgICAgICBTaGFyZU1hcC5hY3Qob3B0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkNvcHkgPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY29weScpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblRhYlN3aXRjaCA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRhYiA9IGV2ZW50Lml0ZW0udmFsLnRpdGxlO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5jdXJyZW50VGFiKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ015IE1hcHMnOlxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQWN0aW9uQ2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25NZW51Q2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUYWIgPT0gJ015IE1hcHMnKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQuaXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkZWxldGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZU1hcHMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0RlbGV0ZU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJy5hY3RpdmUnKS5maW5kKCcubWFwaWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHNlbGVjdGVkLCAoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChjZWxsLmlubmVySFRNTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlTWFwcy5kZWxldGVBbGwoaWRzLCBDT05TVEFOVFMuUEFHRVMuTVlfTUFQUyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmQgPSB0aGlzW2B0YWJsZTBgXS5maW5kKCd0Ym9keSB0ciAuY2hlY2tib3hlcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmQuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBqUXVlcnkudW5pZm9ybS51cGRhdGUoZmluZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG5cclxuICAgIH0pXHJcblxyXG4gICAgLy9SaW90IGJpbmRpbmdzXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL215bWFwcycsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lbnUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogXy5zb3J0QnkoZGF0YS5idXR0b25zLCAnb3JkZXInKSxcclxuICAgICAgICAgICAgICAgICAgICBtZW51OiBfLnNvcnRCeShkYXRhLm1lbnUsICdvcmRlcicpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBidWlsZFRhYmxlID0gKGlkeCwgbGlzdCwgZWRpdGFibGUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpZHhdID0gbGlzdDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzW2B0YWJsZSR7aWR4fWBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdID0gJCh0aGlzW2BteW1hcHNfdGFibGVfJHtpZHh9YF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0gPSB0aGlzW2B0YWJsZSR7aWR4fWBdLkRhdGFUYWJsZSh7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVuY29tbWVudCBiZWxvdyBsaW5lKCdkb20nIHBhcmFtZXRlcikgdG8gZml4IHRoZSBkcm9wZG93biBvdmVyZmxvdyBpc3N1ZSBpbiB0aGUgZGF0YXRhYmxlIGNlbGxzLiBUaGUgZGVmYXVsdCBkYXRhdGFibGUgbGF5b3V0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgdXNlcyBzY3JvbGxhYmxlIGRpdih0YWJsZS1zY3JvbGxhYmxlKSB3aXRoIG92ZXJmbG93OmF1dG8gdG8gZW5hYmxlIHZlcnRpY2FsIHNjcm9sbChzZWU6IGFzc2V0cy9nbG9iYWwvcGx1Z2lucy9kYXRhdGFibGVzL3BsdWdpbnMvYm9vdHN0cmFwL2RhdGFUYWJsZXMuYm9vdHN0cmFwLmpzKS5cclxuICAgICAgICAgICAgICAgICAgICAvLyBTbyB3aGVuIGRyb3Bkb3ducyB1c2VkIHRoZSBzY3JvbGxhYmxlIGRpdiBzaG91bGQgYmUgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLydkb20nOiAnPCdyb3cnPCdjb2wtbWQtNiBjb2wtc20tMTInbD48J2NvbC1tZC02IGNvbC1zbS0xMidmPnI+dDwncm93JzwnY29sLW1kLTUgY29sLXNtLTEyJ2k+PCdjb2wtbWQtNyBjb2wtc20tMTIncD4+JyxcclxuICAgICAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbHVtbnMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdDaGNrQngnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyMHB4J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTmFtZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0NyZWF0ZWQgT24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdTdGF0dXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXNbYHRhYmxlJHtpZHh9YF1Ub29scyA9IG5ldyAkLmZuLmRhdGFUYWJsZS5UYWJsZVRvb2xzKHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLCB7fSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlV3JhcHBlciA9IHRoaXNbYHRhYmxlJHtpZHh9YF0ucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZChgI215bWFwc18ke2lkeH1fdGFibGVfd3JhcHBlcmApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0uZmluZCgnLmdyb3VwLWNoZWNrYWJsZScpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNldCA9IGpRdWVyeSh0aGlzKS5hdHRyKCdkYXRhLXNldCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VkID0galF1ZXJ5KHRoaXMpLmlzKCc6Y2hlY2tlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeShzZXQpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeS51bmlmb3JtLnVwZGF0ZShzZXQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpc1tgdGFibGUke2lkeH1gXS5vbignY2hhbmdlJywgJ3Rib2R5IHRyIC5jaGVja2JveGVzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0YWJsZVdyYXBwZXIuZmluZCgnLmRhdGFUYWJsZXNfbGVuZ3RoIHNlbGVjdCcpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wgaW5wdXQteHNtYWxsIGlucHV0LWlubGluZScpOyAvLyBtb2RpZnkgdGFibGUgcGVyIHBhZ2UgZHJvcGRvd25cclxuXHJcbiAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNldCAmJiB0aGlzLmRhdGFzZXQucGspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHtpZH0vbmFtZWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vRmV0Y2ggQWxsIG1hcHNcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldENoaWxkKENPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUKS5vbigndmFsdWUnLCAodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB2YWwudmFsKCk7XHJcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnRhYnMsICh0YWIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXBzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGFiLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVGVtcGxhdGVzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNeSBNYXBzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgPT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCkgeyAvL09ubHkgaW5jbHVkZSBteSBvd24gbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdTaGFyZWQgd2l0aCBNZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoICYmIC8vRXhjbHVkZSBhbnl0aGluZyB0aGF0IGlzbid0IHNoYXJlZCBhdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIW9iai5zaGFyZWRfd2l0aFsnKiddIHx8IChvYmouc2hhcmVkX3dpdGhbJyonXS5yZWFkICE9IHRydWUgfHwgb2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgIT0gdHJ1ZSkpICYmIC8vRXhjbHVkZSBwdWJsaWMgbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXSAmJiAvL0luY2x1ZGUgc2hhcmVzIHdpaCBteSB1c2VySWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUgfHwgLy9JbmNsdWRlIGFueXRoaW5nIEkgY2FuIHdyaXRlIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLnJlYWQgPT0gdHJ1ZSkgLy9JbmNsdWRlIGFueXRoaW5nIEkgY2FuIHJlYWQgZnJvbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IChvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdQdWJsaWMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCAhPSBNZXRhTWFwLlVzZXIudXNlcklkICYmIC8vRG9uJ3QgaW5jbHVkZSBteSBvd24gbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aCAmJiAvL0V4Y2x1ZGUgYW55dGhpbmcgdGhhdCBpc24ndCBzaGFyZWQgYXQgYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iai5zaGFyZWRfd2l0aFsnKiddICYmIChvYmouc2hhcmVkX3dpdGhbJyonXS5yZWFkID09IHRydWUgfHwgb2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkgKSAvL0luY2x1ZGUgcHVibGljIG1hcHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSAob2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBbGwgTWFwcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTGlrZSBpdCBzYXlzLCBhbGwgbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobWFwcykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLmZpbHRlcihtYXBzLCAobWFwKSA9PiB7IHJldHVybiBtYXAgJiYgbWFwLmlkIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRUYWJsZSh0YWIub3JkZXIsIG1hcHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHsgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKSB9LCA1MDApO1xyXG4gICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBvcnRsZXQgbGlnaHRcIj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG9ydGxldC1ib2R5XCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93IG1hcmdpbi1ib3R0b20tMzBcIj5cclxuXHRcdFx0XHRcdFx0PGRpdiBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPnsgaGVhZGVyLnRpdGxlIH08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgYXJlYXMgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGxpbmVcIj5cclxuICAgIFx0XHRcdFx0XHRcdDxoMz57IHRpdGxlIH08L2gzPlxyXG4gICAgXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyB0ZXh0IH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxsaSBlYWNoPVwieyBpdGVtcyB9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XHJcblx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0PC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCd0ZXJtcycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgXHJcbiAgICB0aGlzLmFyZWFzID0gW11cclxuICAgIHRoaXMuaGVhZGVyID0ge31cclxuXHJcbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuVEVSTVNfQU5EX0NPTkRJVElPTlMsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuc2VjdGlvbnMsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICBpZihpbmNsdWRlKSB7XHJcbiAgICAgICAgICAgICAgICBkLml0ZW1zID0gXy5maWx0ZXIoXy5zb3J0QnkoZC5pdGVtcywgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluY2x1ZGUyID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGUyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcclxuICAgICAgICB0aGlzLnVzZXJOYW1lID0gTWV0YU1hcC5Vc2VyLmZ1bGxOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuXHJcbmNsYXNzIENvbW1vbiB7XHJcblxyXG4gICAgc3RhdGljIHNwbGl0TGluZXModGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXh0LnNwbGl0KC9cXG4vKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0RXZlbnRUaW1lKHQsIG5vdykge1xyXG4gICAgICAgIGxldCB0aW1lID0gbW9tZW50KHQsICdZWVlZLU1NLUREIEhIOm1tOnNzLlNTUycpO1xyXG4gICAgICAgIGxldCBub3d0aW1lID0gbW9tZW50KG5vdywgJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3Q6ICAgICAgICcgKyB0KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm93OiAgICAgJyArIG5vdyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RpbWU6ICAgICcgKyB0aW1lLmZvcm1hdCgpKTsgLy8gKyAnICcgKyB0aW1lLmlzVmFsaWQoKSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vd3RpbWU6ICcgKyBub3d0aW1lLmZvcm1hdCgpKTsgLy8gKyAnICcgKyBub3d0aW1lLmlzVmFsaWQoKSk7XHJcbiAgICAgICAgcmV0dXJuIHRpbWUuZnJvbShub3d0aW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2xhc3NJZihrbGFzcywgYikge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2NsYXNzSWY6ICcgKyBrbGFzcyArICcsICcgKyBiKTtcclxuICAgICAgICByZXR1cm4gKGIgPyBrbGFzcyA6ICcnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhdm9pZCAnJGFwcGx5IGFscmVhZHkgaW4gcHJvZ3Jlc3MnIGVycm9yIChzb3VyY2U6IGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wL25naXNtYSlcclxuICAgIHN0YXRpYyBzYWZlQXBwbHkoZm4pIHtcclxuICAgICAgICBpZiAoZm4gJiYgKHR5cGVvZiAoZm4pID09PSAnZnVuY3Rpb24nKSkge1xyXG4gICAgICAgICAgICBmbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzb3VyY2U6IGh0dHA6Ly9jdHJscS5vcmcvY29kZS8xOTYxNi1kZXRlY3QtdG91Y2gtc2NyZWVuLWphdmFzY3JpcHRcclxuICAgIHN0YXRpYyBpc1RvdWNoRGV2aWNlKCkge1xyXG4gICAgICAgIHJldHVybiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgKG5hdmlnYXRvci5NYXhUb3VjaFBvaW50cyA+IDApIHx8IChuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDApKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0VGlja3NGcm9tRGF0ZShkYXRlKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IG51bGw7XHJcbiAgICAgICAgaWYoZGF0ZSAmJiBkYXRlLmdldFRpbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gZGF0ZS5nZXRUaW1lKCkvMTAwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tbW9uOyIsImlmICghU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxuICAgICAgICAgICAgICA6IG1hdGNoXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59IiwiY29uc3QgdXVpZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBoZXhEaWdpdHMsIGksIHMsIHV1aWQ7XHJcbiAgICBzID0gW107XHJcbiAgICBzLmxlbmd0aCA9IDM2O1xyXG4gICAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xyXG4gICAgaSA9IDA7XHJcbiAgICB3aGlsZSAoaSA8IDM2KSB7XHJcbiAgICAgICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpO1xyXG4gICAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIHNbMTRdID0gJzQnO1xyXG4gICAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpO1xyXG4gICAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJztcclxuICAgIHV1aWQgPSBzLmpvaW4oJycpO1xyXG4gICAgcmV0dXJuIHV1aWQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7Il19
