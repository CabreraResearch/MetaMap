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

},{"./js/app//Config.js":14,"./js/app/Eventer.js":15,"./js/app/Integrations":17,"./js/app/Router.js":19,"./js/app/auth0":21,"./js/app/user.js":22,"./js/integrations/google.js":46,"./js/pages/PageFactory.js":47,"./js/tools/shims.js":74,"airbrake-js":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"jquery":undefined,"jquery-ui":undefined,"lodash":undefined,"riot":"riot"}],2:[function(require,module,exports){
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

},{"../../MetaMap":1,"../tools/Common":73,"../tools/uuid.js":75,"lodash":undefined}],23:[function(require,module,exports){
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
var Metronic = require('../template/metronic');
var Layout = require('../template/layout');
var Demo = require('../template/demo');

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

},{"../actions/Action.js":2,"../constants/constants":27,"../tags/page-body.js":58,"../template/demo":70,"../template/layout":71,"../template/metronic":72}],48:[function(require,module,exports){
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

},{"../../../MetaMap":1,"../../app/Sharing":20,"../../constants/constants":27,"../../tools/shims":74,"bootstrap-select":undefined,"jquery":undefined,"riot":"riot","typeahead.js":undefined}],53:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"../../constants/constants":27,"../../tools/shims":74,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"moment":undefined,"riot":"riot"}],55:[function(require,module,exports){
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

},{"../../MetaMap":1,"../app/Permissions":18,"../constants/constants":27,"../tools/shims":74,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],58:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageHeader = require('./page-header');
var pageContainer = require('./page-container');
var pageFooter = require('./page-footer');
var CONSTANTS = require('../constants/constants');

var html = '\n<div id="page_body" class="page-header-fixed page-sidebar-open">\n\n    <div id="meta_page_header"></div>\n\n    <div class="clearfix">\n    </div>\n\n    <div id="meta_page_container"></div>\n\n</div>';

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

var html = '\n<div class ="page-logo">\n    <a id="meta_logo" href="#home">\n        <img src="src/images/metamap_cloud.png" alt="logo" class ="logo-default" />\n    </a>\n    <div id="meta_menu_toggle" class="menu-toggler sidebar-toggler" onclick="{ onClick }" style="visibility:{ getDisplay() };">\n        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->\n    </div>\n</div>\n<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">\n</a>\n';

module.exports = riot.tag('page-logo', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.onClick = function () {
        MetaMap.Eventer['do'](CONSTANTS.EVENTS.SIDEBAR_TOGGLE);
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

},{"moment":undefined}],74:[function(require,module,exports){
'use strict';

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

},{}],75:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3B5TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRGVsZXRlTWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRmVlZGJhY2suanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Ib21lLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTG9nb3V0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTXlNYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTmV3TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvT3Blbk1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1NoYXJlTWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvVGVybXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0NvbmZpZy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvRXZlbnRlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvRmlyZWJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0ludGVncmF0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvUGVybWlzc2lvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1JvdXRlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvU2hhcmluZy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvYXV0aDAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL3VzZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY2FudmFzL2NhbnZhcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jYW52YXMvbGF5b3V0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9hY3Rpb25zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9jYW52YXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NvbnN0YW50cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZHNycC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWRpdFN0YXR1cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWxlbWVudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2V2ZW50cy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvbm90aWZpY2F0aW9uLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9wYWdlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvcm91dGVzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy90YWJzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy90YWdzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9BZGRUaGlzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9GYWNlYm9vay5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvR29vZ2xlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9JbnRlcmNvbS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvTmV3UmVsaWMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1R3aXR0ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1VzZXJTbmFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9aZW5kZXNrLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9fSW50ZWdyYXRpb25zQmFzZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3BhZ2VzL1BhZ2VGYWN0b3J5LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY2FudmFzL21ldGEtY2FudmFzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY2FudmFzL25vZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9jb21wb25lbnRzL3Jhdy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NvcnRleC9jaGF0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvZGlhbG9ncy9zaGFyZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1oZWxwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLW5vdGlmaWNhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtcG9pbnRzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLXVzZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWFjdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWJvZHkuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRhaW5lci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtY29udGVudC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtZm9vdGVyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1oZWFkZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWxvZ28uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXNlYXJjaC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2lkZWJhci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtdG9wbWVudS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL2hvbWUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9teS1tYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdGVybXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGVtcGxhdGUvZGVtby5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9sYXlvdXQuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGVtcGxhdGUvbWV0cm9uaWMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvQ29tbW9uLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3NoaW1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAv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LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcclxucmVxdWlyZSgnY29yZS1qcycpO1xyXG53aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcclxucmVxdWlyZSgnanF1ZXJ5LXVpJyk7XHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcCcpO1xyXG53aW5kb3cucmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxud2luZG93Ll8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxud2luZG93LlByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xyXG5cclxuY29uc3QgQXV0aDAgPSByZXF1aXJlKCcuL2pzL2FwcC9hdXRoMCcpO1xyXG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi9qcy9hcHAvdXNlci5qcycpO1xyXG5jb25zdCBSb3V0ZXIgPSByZXF1aXJlKCcuL2pzL2FwcC9Sb3V0ZXIuanMnKTtcclxuY29uc3QgRXZlbnRlciA9IHJlcXVpcmUoJy4vanMvYXBwL0V2ZW50ZXIuanMnKTtcclxuY29uc3QgUGFnZUZhY3RvcnkgPSByZXF1aXJlKCcuL2pzL3BhZ2VzL1BhZ2VGYWN0b3J5LmpzJyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IENvbmZpZyA9IHJlcXVpcmUoJy4vanMvYXBwLy9Db25maWcuanMnKTtcclxuY29uc3QgZ2EgPSByZXF1aXJlKCcuL2pzL2ludGVncmF0aW9ucy9nb29nbGUuanMnKTtcclxuY29uc3Qgc2hpbXMgPSByZXF1aXJlKCcuL2pzL3Rvb2xzL3NoaW1zLmpzJyk7XHJcbmNvbnN0IEFpcmJyYWtlQ2xpZW50ID0gcmVxdWlyZSgnYWlyYnJha2UtanMnKVxyXG5jb25zdCBJbnRlZ3JhdGlvbnMgPSByZXF1aXJlKCcuL2pzL2FwcC9JbnRlZ3JhdGlvbnMnKVxyXG5cclxuY2xhc3MgTWV0YU1hcCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5Db25maWcgPSBuZXcgQ29uZmlnKCk7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSB0aGlzLkNvbmZpZy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IHRoaXMuQ29uZmlnLk1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMuRXZlbnRlciA9IG5ldyBFdmVudGVyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYWlyYnJha2UgPSBuZXcgQWlyYnJha2VDbGllbnQoeyBwcm9qZWN0SWQ6IDExNDkwMCwgcHJvamVjdEtleTogJ2RjOTYxMWRiNmY3NzEyMGNjZWNkMWEyNzM3NDVhNWFlJyB9KTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICBQcm9taXNlLm9uUG9zc2libHlVbmhhbmRsZWRSZWplY3Rpb24oZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoYXQuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db25maWcub25SZWFkeSgpLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAoY29uZmlnLmF1dGgwKTtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuQXV0aDAubG9naW4oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ2luKCkudGhlbigoYXV0aCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlciA9IG5ldyBVc2VyKHByb2ZpbGUsIGF1dGgsIHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMgPSBuZXcgSW50ZWdyYXRpb25zKHRoaXMsIHRoaXMuVXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Vc2VyLm9uUmVhZHkoKS50aGVuKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFnZUZhY3RvcnkgPSBuZXcgUGFnZUZhY3RvcnkodGhpcy5FdmVudGVyLCB0aGlzLk1ldGFGaXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb3V0ZXIgPSBuZXcgUm91dGVyKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvdXRlci5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGVidWcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0LnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpXHJcbiAgICB9XHJcblxyXG4gICAgbG9nKHZhbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXZlbnQnLCAnbG9nJywgJ2xhYmVsJylcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LmNvbnNvbGUuaW5mbyh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGVycm9yKHZhbCkge1xyXG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKHZhbCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLnNlbmRFdmVudCh2YWwsICdleGNlcHRpb24nKVxyXG4gICAgICAgICAgICB0aGlzLmFpcmJyYWtlLm5vdGlmeSh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dvdXQoKTtcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ291dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtbSA9IG5ldyBNZXRhTWFwKCk7XHJcbm1vZHVsZS5leHBvcnRzID0gbW07IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb24gZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5fYWN0aW9ucyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIF9nZXRBY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuX2FjdGlvbnNbYWN0aW9uXTtcclxuICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICBsZXQgTWV0aG9kID0gbnVsbDtcclxuICAgICAgICAgICAgc3dpdGNoKGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9PcGVuTWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLk5FV19NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9OZXdNYXAuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuQ09QWV9NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Db3B5TWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkRFTEVURV9NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9EZWxldGVNYXAuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTVlfTUFQUzpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL015TWFwcy5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5MT0dPVVQ6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Mb2dvdXQuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuU0hBUkVfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vU2hhcmVNYXAnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuVEVSTVNfQU5EX0NPTkRJVElPTlM6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9UZXJtcy5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5GRUVEQkFDSzpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0ZlZWRiYWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vSG9tZS5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChNZXRob2QpIHtcclxuICAgICAgICAgICAgICAgIHJldCA9IG5ldyBNZXRob2QodGhpcy5tZXRhRmlyZSwgdGhpcy5ldmVudGVyLCB0aGlzLnBhZ2VGYWN0b3J5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGlvbnNbYWN0aW9uXSA9IHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChhY3Rpb24sIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdCgpO1xyXG4gICAgICAgIGxldCBtZXRob2QgPSB0aGlzLl9nZXRBY3Rpb24oYWN0aW9uKTtcclxuICAgICAgICBpZiAobWV0aG9kKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYWN0KC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247IiwiY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXRhRmlyZSwgZXZlbnRlciwgcGFnZUZhY3RvcnkpIHtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcclxuICAgICAgICB0aGlzLnBhZ2VGYWN0b3J5ID0gcGFnZUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdCgpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgdG9nZ2xlU2lkZWJhcigpIHtcclxuICAgICAgICBpZih0aGlzLnNpZGViYXJPcGVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BlblNpZGViYXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgb3BlblNpZGViYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zaWRlYmFyT3BlbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2xvc2VTaWRlYmFyKCkge1xyXG4gICAgICAgIHRoaXMuc2lkZWJhck9wZW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb25CYXNlOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgQ29weU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICBpZiAoIWlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ011c3QgaGF2ZSBhIG1hcCBpbiBvcmRlciB0byBjb3B5LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChvbGRNYXApID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld01hcCA9IHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IGAke25ldyBEYXRlKCl9YCxcclxuICAgICAgICAgICAgICAgIG93bmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5tZXRhTWFwLlVzZXIuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMuYXBwZW5kQ29weShvbGRNYXAubmFtZSksXHJcbiAgICAgICAgICAgICAgICBzaGFyZWRfd2l0aDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkbWluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJyonOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogZmFsc2UgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke2lkfWApLnRoZW4oKG9sZE1hcERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwdXNoU3RhdGUgPSB0aGlzLm1ldGFGaXJlLnB1c2hEYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9YCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWFwSWQgPSBwdXNoU3RhdGUua2V5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEob2xkTWFwRGF0YSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHttYXBJZH1gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke21hcElkfWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRDb3B5KHN0cikge1xyXG4gICAgICAgIGxldCByZXQgPSBzdHI7XHJcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHN0ciwgJyhDb3B5JykpIHtcclxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgJyAoQ29weSAxKSc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG1lc3MgPSBzdHIuc3BsaXQoJyAnKTtcclxuICAgICAgICAgICAgbGV0IGNudCA9IDI7XHJcbiAgICAgICAgICAgIGlmIChtZXNzLmxlbmd0aCAtIG1lc3MubGFzdEluZGV4T2YoJyhDb3B5JykgPD0gNCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyYmcgPSBtZXNzW21lc3MubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JiZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYmcgPSBncmJnLnJlcGxhY2UoJyknLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY250ID0gK2dyYmcgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IG1lc3Muc2xpY2UoMCwgbWVzcy5sZW5ndGggLSAyKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0ICs9IGAgKENvcHkgJHtjbnR9KWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29weU1hcDsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY2xhc3MgRGVsZXRlTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIERlbGV0ZU1hcC5kZWxldGVBbGwoW2lkXSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRlbGV0ZUFsbChpZHMsIHBhdGggPSBDT05TVEFOVFMuUEFHRVMuSE9NRSkge1xyXG4gICAgICAgIGNvbnN0IG1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgXy5lYWNoKGlkcywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtZXRhTWFwLk1ldGFGaXJlLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHtpZH1gKTtcclxuICAgICAgICAgICAgICAgIG1ldGFNYXAuTWV0YUZpcmUuZGVsZXRlRGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgbWV0YU1hcC5Sb3V0ZXIudG8ocGF0aCk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVsZXRlTWFwOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuXHJcbmNsYXNzIEZlZWRiYWNrIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB3aW5kb3cuVXNlclNuYXA7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KCkge1xyXG4gICAgICAgIHN1cGVyLmFjdCgpO1xyXG4gICAgICAgIHRoaXMudXNlclNuYXAub3BlblJlcG9ydFdpbmRvdygpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRiYWNrOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL2hvbWUnKTtcclxuXHJcbmNsYXNzIEhvbWUgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuSE9NRSk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdIb21lJyB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSG9tZTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY2xhc3MgTG9nb3V0IGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAubG9nb3V0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTG9nb3V0OyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL215LW1hcHMnKTtcclxuXHJcbmNsYXNzIE15TWFwcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5NWV9NQVBTKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMsIHsgaWQ6IGlkIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdNeSBNYXBzJyB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTXlNYXBzOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgTmV3TWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdCgpIHtcclxuICAgICAgICBzdXBlci5hY3QoKTtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX05FV19NQVB9YCkudGhlbigoYmxhbmtNYXApID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld01hcCA9IHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IGAke25ldyBEYXRlKCl9YCxcclxuICAgICAgICAgICAgICAgIG93bmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5tZXRhTWFwLlVzZXIuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdOZXcgVW50aXRsZWQgTWFwJyxcclxuICAgICAgICAgICAgICAgIHNoYXJlZF93aXRoOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRtaW46IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAnKic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiBmYWxzZSB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcclxuICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke21hcElkfWApO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZXdNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IG1ldGFDYW52YXMgPSByZXF1aXJlKCcuLi90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcycpO1xyXG5cclxuY2xhc3MgT3Blbk1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG1hcCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuTUVUQV9DQU5WQVMpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmlkID0gaWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5OQVYsICdtYXAnLCBtYXAsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIG1hcCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLk1BUCwgbWFwLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuU2lkZWJhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3Blbk1hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5yZXF1aXJlKCcuLi90YWdzL2RpYWxvZ3Mvc2hhcmUnKVxyXG5cclxuY2xhc3MgU2hhcmVNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigobWFwKSA9PiB7XHJcbiAgICAgICAgICAgIG1hcC5pZCA9IGlkXHJcbiAgICAgICAgICAgIFNoYXJlTWFwLmFjdCh7IG1hcDogbWFwIH0pXHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5Sb3V0ZXIuYmFjaygpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFjdChtYXApIHtcclxuICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgIGxldCBtb2RhbCA9IHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfTU9EQUxfRElBTE9HX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLlNIQVJFKVswXVxyXG4gICAgICAgICAgICBtb2RhbC51cGRhdGUobWFwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZU1hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCB0ZXJtcyA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvdGVybXMnKTtcclxuXHJcbmNsYXNzIFRlcm1zIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLlRFUk1TKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ1Rlcm1zIGFuZCBDb25kaXRpb25zJyB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGVybXM7IiwiY29uc3QgTWV0YUZpcmUgPSByZXF1aXJlKCcuL0ZpcmViYXNlJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG5cclxuY29uc3QgY29uZmlnID0gKCkgPT4ge1xyXG4gICAgY29uc3QgU0lURVMgPSB7XHJcbiAgICAgICAgQ1JMX1NUQUdJTkc6IHtcclxuICAgICAgICAgICAgZGI6ICdtZXRhLW1hcC1zdGFnaW5nJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXQgPSB7XHJcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3QsXHJcbiAgICAgICAgc2l0ZToge31cclxuICAgIH1cclxuICAgIGxldCBzZWdtZW50cyA9IHJldC5ob3N0LnNwbGl0KCcuJyk7XHJcbiAgICBsZXQgZmlyc3QgPSBzZWdtZW50c1swXTtcclxuICAgIGlmIChmaXJzdCA9PT0gJ3d3dycpIHtcclxuICAgICAgICBmaXJzdCA9IHNlZ21lbnRzWzFdO1xyXG4gICAgfVxyXG4gICAgZmlyc3QgPSBmaXJzdC5zcGxpdCgnOicpWzBdO1xyXG5cclxuICAgIHN3aXRjaCAoZmlyc3QudG9Mb3dlckNhc2UoKSkge1xyXG5cclxuICAgICAgICBjYXNlICdsb2NhbGhvc3QnOlxyXG4gICAgICAgIGNhc2UgJ21ldGEtbWFwLXN0YWdpbmcnOlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldC5zaXRlID0gU0lURVMuQ1JMX1NUQUdJTkc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXQ7XHJcbn07XHJcblxyXG5jbGFzcyBDb25maWcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ3MpIHtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IG5ldyBNZXRhRmlyZSh0aGlzLmNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdmcm9udGVuZCc7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ2NvbmZpZycsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5vbignbWV0YW1hcC9jYW52YXMnLCAoY2FudmFzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZCh0aGlzLmNvbmZpZy5zaXRlLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmNhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLmNvbmZpZy5zaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb25maWc7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIEV2ZW50ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICBcclxuICAgICAgICByaW90Lm9ic2VydmFibGUodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRzID0ge31cclxuICAgIH1cclxuXHJcbiAgICBldmVyeShldmVudCwgcmVhY3Rpb24pIHtcclxuICAgICAgICAvL2xldCBjYWxsYmFjayA9IHJlYWN0aW9uO1xyXG4gICAgICAgIC8vaWYgKHRoaXMuZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICAgIC8vICAgIGxldCBwaWdneWJhY2sgPSB0aGlzLmV2ZW50c1tldmVudF07XHJcbiAgICAgICAgLy8gICAgY2FsbGJhY2sgPSAoLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgIHBpZ2d5YmFjayguLi5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgICAgICByZWFjdGlvbiguLi5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgIH1cclxuICAgICAgICAvL31cclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IHJlYWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLm9uKGV2ZW50LCByZWFjdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yZ2V0KGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xyXG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW2V2ZW50XTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRvKGV2ZW50LCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihldmVudCwgLi4ucGFyYW1zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRlcjsiLCJsZXQgRmlyZWJhc2UgPSB3aW5kb3cuRmlyZWJhc2U7XHJcbmxldCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxyXG5sZXQgbG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpXHJcblxyXG5jbGFzcyBNZXRhRmlyZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1ldGFNYXAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tZXRhTWFwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXRhTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuTWV0YU1hcC5BdXRoMC5nZXRTZXNzaW9uKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmNvbmZpZy5zaXRlLmF1dGgwLmFwaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBwcm9maWxlLmlkX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoaXMuZmlyZWJhc2VfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGlzLmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhLCAuLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gdGhpcy5fbG9naW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpbjtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uY2UoJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uKHBhdGgsIGNhbGxiYWNrLCBldmVudCA9ICd2YWx1ZScpIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWV0aG9kID0gKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbmFwc2hvdC5leGlzdHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKGV2ZW50LCBtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyBkYXRhIGF0ICR7cGF0aH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY2hpbGQub24oZXZlbnQsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvZmYocGF0aCwgbWV0aG9kID0gJ3ZhbHVlJywgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVEYXRhKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXREYXRhKG51bGwsIHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2hEYXRhKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnB1c2goZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhSW5UcmFuc2FjdGlvbihkYXRhLCBwYXRoLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQudHJhbnNhY3Rpb24oKGN1cnJlbnRWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVycm9yKGUsIHBhdGgpIHtcclxuICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcih7IG1lc3NhZ2U6IGBQZXJtaXNzaW9uIGRlbmllZCB0byAke3BhdGh9YCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9vblJlYWR5ID0gbnVsbDtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdmaXJlYmFzZV90b2tlbicpO1xyXG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNvbnN0IFR3aWl0ZXIgPSByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvVHdpdHRlcicpO1xyXG5jb25zdCBGYWNlYm9vayA9IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9GYWNlYm9vaycpO1xyXG5cclxuY2xhc3MgSW50ZWdyYXRpb25zIHtcclxuXHJcblx0Y29uc3RydWN0b3IobWV0YU1hcCwgdXNlcikge1xyXG5cdFx0dGhpcy5jb25maWcgPSBtZXRhTWFwLmNvbmZpZztcclxuXHRcdHRoaXMubWV0YU1hcCA9IG1ldGFNYXA7XHJcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xyXG5cdFx0dGhpcy5fZmVhdHVyZXMgPSB7XHJcblx0XHRcdGdvb2dsZTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0dvb2dsZScpLFxyXG5cdFx0XHR1c2Vyc25hcDogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1VzZXJTbmFwJyksXHJcblx0XHRcdGludGVyY29tOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvSW50ZXJjb20nKSxcclxuXHRcdFx0emVuZGVzazogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1plbmRlc2snKSxcclxuXHRcdFx0YWRkdGhpczogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0FkZFRoaXMnKSxcclxuXHRcdFx0bmV3cmVsaWM6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9OZXdSZWxpYycpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0aW5pdCgpIHtcclxuICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChGZWF0dXJlKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGxldCBjb25maWcgPSB0aGlzLmNvbmZpZy5zaXRlW25hbWVdO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXSA9IG5ldyBGZWF0dXJlKGNvbmZpZywgdGhpcy51c2VyKTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0uaW5pdCgpO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5zZXRVc2VyKCk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHRzZXRVc2VyKCkge1xyXG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNldFVzZXIoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRzZW5kRXZlbnQodmFsLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMubWV0YU1hcC5kZWJ1Zykge1xyXG4gICAgICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbbmFtZV0uc2VuZEV2ZW50KHZhbCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHJcblx0fVxyXG5cclxuXHRsb2dvdXQoKSB7XHJcblx0XHRfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0ubG9nb3V0KCk7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlZ3JhdGlvbnM7IiwiY2xhc3MgUGVybWlzc2lvbnMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbWFwXHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcbiAgICB9XHJcblxyXG4gICAgY2FuRWRpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc01hcE93bmVyKCkgfHwgdGhpcy5pc1NoYXJlZEVkaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIGNhblZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXBPd25lcigpIHx8IHRoaXMuaXNTaGFyZWRWaWV3KClcclxuICAgIH1cclxuXHJcbiAgICBpc01hcE93bmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJiB0aGlzLm1hcC5vd25lci51c2VySWQgPT0gdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaGFyZWRFZGl0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxyXG4gICAgICAgICAgICB0aGlzLm1hcC5zaGFyZWRfd2l0aCAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMubWV0YU1hcC5Vc2VyLmlzQWRtaW4gfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdICYmIHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkpXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaGFyZWRWaWV3KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxyXG4gICAgICAgICAgICB0aGlzLmlzU2hhcmVkRWRpdCgpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdLnJlYWQgPT0gdHJ1ZSkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlKVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBlcm1pc3Npb25zOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XHJcbmNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgUm91dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9ucyA9IG1ldGFNYXAuSW50ZWdyYXRpb25zO1xyXG4gICAgICAgIHRoaXMudXNlciA9IG1ldGFNYXAuVXNlcjtcclxuICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbWV0YU1hcC5QYWdlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBtZXRhTWFwLkV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xyXG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgaWQgPSAnJywgYWN0aW9uID0gJycsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhdGggPSB0aGlzLmdldFBhdGgodGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCB0aGlzLnBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5Lm5hdmlnYXRlKHRoaXMucGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbygnaGlzdG9yeScsIHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50UGFnZSgpIHtcclxuICAgICAgICBsZXQgcGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJztcclxuICAgICAgICBpZiAoIXRoaXMuaXNUcmFja2VkKHBhZ2UpKSB7XHJcbiAgICAgICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UgPSB0aGlzLmdldFBhdGgodGhpcy51c2VyLmhpc3RvcnlbcGFnZUNudCAtIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFBhdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcmV2aW91c1BhZ2UocGFnZU5vID0gMikge1xyXG4gICAgICAgIGxldCBwYWdlID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMCkge1xyXG4gICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSBwYWdlTm9dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByZXZpb3VzUGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmV2aW91c1BhZ2UoMik7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2socGF0aCkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb25zLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlTWFpbihoaWRlLCBwYXRoKSB7XHJcbiAgICAgICAgdGhpcy50cmFjayhwYXRoKTtcclxuICAgICAgICBpZiAoaGlkZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHRvKHBhdGgpIHtcclxuICAgICAgICBwYXRoID0gdGhpcy5nZXRQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCBwYXRoKTtcclxuICAgICAgICAgICAgcmlvdC5yb3V0ZShgJHtwYXRofWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiYWNrKCkge1xyXG4gICAgICAgIGxldCBwYXRoID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMSAmJiAodGhpcy5jdXJyZW50UGFnZSAhPSAnbXltYXBzJyB8fCB0aGlzLmN1cnJlbnRQYWdlICE9IHRoaXMucHJldmlvdXNQYWdlKSkge1xyXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5wcmV2aW91c1BhZ2U7XHJcbiAgICAgICAgICAgIGxldCBiYWNrTm8gPSAyO1xyXG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNUcmFja2VkKHBhdGgpICYmIHRoaXMudXNlci5oaXN0b3J5W2JhY2tOb10pIHtcclxuICAgICAgICAgICAgICAgIGJhY2tObyArPSAxO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UHJldmlvdXNQYWdlKGJhY2tObyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG8ocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRvTm90VHJhY2soKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9kb05vdFRyYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RvTm90VHJhY2sgPSBbQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuQ09QWV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVCwgQ09OU1RBTlRTLkFDVElPTlMuTkVXX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuRkVFREJBQ0ssIENPTlNUQU5UUy5BQ1RJT05TLlNIQVJFX01BUF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9kb05vdFRyYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVHJhY2tlZChwYXRoKSB7XHJcbiAgICAgICAgbGV0IHB0aCA9IHRoaXMuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICByZXR1cm4gXy5hbnkodGhpcy5kb05vdFRyYWNrLCAocCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXB0aC5zdGFydHNXaXRoKHApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJjb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5cclxuY29uc3QgdG9Cb29sID0gKHZhbCkgPT4ge1xyXG4gICAgbGV0IHJldCA9IGZhbHNlO1xyXG4gICAgaWYgKHZhbCA9PT0gdHJ1ZSB8fCB2YWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0ID0gdmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoXy5jb250YWlucyhbJ3RydWUnLCAneWVzJywgJzEnXSwgdmFsICsgJycudG9Mb3dlckNhc2UoKS50cmltKCkpKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxufVxyXG5cclxuY2xhc3MgU2hhcmluZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXNlcikge1xyXG4gICAgICAgIHRoaXMudXNlciA9IHVzZXJcclxuICAgICAgICB0aGlzLl9tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcbiAgICAgICAgdGhpcy5fZmIgPSB0aGlzLl9tZXRhTWFwLk1ldGFGaXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFNoYXJlKG1hcCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XHJcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmIuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICByZWFkOiB0b0Jvb2wob3B0cy5yZWFkKSxcclxuICAgICAgICAgICAgICAgIHdyaXRlOiB0b0Jvb2wob3B0cy53cml0ZSksXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBvcHRzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBwaWN0dXJlOiBvcHRzLnBpY3R1cmVcclxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHNoYXJlZCBhIG1hcCwgJHttYXAubmFtZX0sIHdpdGggeW91IWAsXHJcbiAgICAgICAgICAgICAgICBtYXBJZDogbWFwLmlkLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQ09OU1RBTlRTLk5PVElGSUNBVElPTi5NQVAsXHJcbiAgICAgICAgICAgICAgICB0aW1lOiBgJHtuZXcgRGF0ZSgpfWBcclxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdCh1c2VyRGF0YS5pZCl9YClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlU2hhcmUobWFwLCB1c2VyRGF0YSkge1xyXG4gICAgICAgIGlmIChtYXAgJiYgbWFwLmlkICYmIHVzZXJEYXRhICYmIHVzZXJEYXRhLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHJlbW92ZWQgYSBtYXAsICR7bWFwLm5hbWV9LCB0aGF0IHdhcyBwcmV2aW91c2x5IHNoYXJlZC5gLFxyXG4gICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKX1gXHJcbiAgICAgICAgICAgIH0sIGAke0NPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQodXNlckRhdGEuaWQpfWApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVkaXRTaGFyZShtYXBJZCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFyaW5nIiwiY29uc3QgQXV0aDBMb2NrID0gcmVxdWlyZSgnYXV0aDAtbG9jaycpXG5jb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcblxuY2xhc3MgQXV0aDAge1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCBtZXRhTWFwKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKGNvbmZpZy5hcGksIGNvbmZpZy5hcHApO1xuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvd0xvZ2luID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbkFmdGVyU2lnbnVwOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbChlcnIsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gcHJvZmlsZS5jdG9rZW4gPSBjdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnY3Rva2VuJywgdGhpcy5jdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIHRoaXMuaWRfdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgdGhpcy5wcm9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaF90b2tlbiA9IHByb2ZpbGUucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dMb2dpbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICAgIH1cblxuICAgIGxpbmtBY2NvdW50KCkge1xuICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICBjYWxsYmFja1VSTDogbG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSxcbiAgICAgICAgICAgIGRpY3Q6IHtcbiAgICAgICAgICAgICAgICBzaWduaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLmN0b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkZhaWwoZXJyLCByZWplY3QpIHtcbiAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycik7XG4gICAgICAgIGlmIChyZWplY3QpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuX2dldFNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIChlcnIsIHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdjdG9rZW4nKS50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBwcm9maWxlLmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ05vIHNlc3Npb24nKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRTZXNzaW9uO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnaWRfdG9rZW4nKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBudWxsO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuXG5cbiIsImNvbnN0IHV1aWQgPSByZXF1aXJlKCcuLi90b29scy91dWlkLmpzJyk7XHJcbmNvbnN0IENvbW1vbiA9IHJlcXVpcmUoJy4uL3Rvb2xzL0NvbW1vbicpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIFVzZXIge1xyXG4gICAgY29uc3RydWN0b3IocHJvZmlsZSwgYXV0aCwgZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLmF1dGggPSBhdXRoO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMudXNlcktleSA9IHV1aWQoKTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgbGV0IHRyYWNrSGlzdG9yeSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZXZlcnkoJ2hpc3RvcnknLCAocGFnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpc3RvcnkubGVuZ3RoID09IDAgfHwgcGFnZSAhPSB0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEodGhpcy5oaXN0b3J5LCBgdXNlcnMvJHt0aGlzLmF1dGgudWlkfS9oaXN0b3J5YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5vbihgdXNlcnMvJHt0aGlzLmF1dGgudWlkfWAsICh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlci5oaXN0b3J5ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSB1c2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2tIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX2lkZW50aXR5KCkge1xyXG4gICAgICAgIGxldCByZXQgPSB7fTtcclxuICAgICAgICBpZiAodGhpcy5wcm9maWxlICYmIHRoaXMucHJvZmlsZS5pZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb2ZpbGUuaWRlbnRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNyZWF0ZWRPbigpIHtcclxuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9jcmVhdGVkT24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlZE9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGR0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiBDb21tb24uZ2V0VGlja3NGcm9tRGF0ZShkdClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlZE9uIHx8IHsgZGF0ZTogbnVsbCwgdGlja3M6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuZnVsbE5hbWU7XHJcbiAgICAgICAgaWYgKHJldCkge1xyXG4gICAgICAgICAgICByZXQgPSByZXQuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXQgJiYgdGhpcy5faWRlbnRpdHkubmlja25hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmlja25hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmdWxsTmFtZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZW1haWwoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5lbWFpbCkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5lbWFpbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGljdHVyZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnBpY3R1cmUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucGljdHVyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXNlcklkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGgudWlkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0FkbWluKCkge1xyXG4gICAgICAgIGxldCByZXQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucm9sZXMpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucm9sZXMuYWRtaW4gPT0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhpc3RvcnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZmlsZS5oaXN0b3J5IHx8IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVVc2VyRWRpdG9yT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvcl9vcHRpb25zOiBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyOyIsImNvbnN0IGpzUGx1bWIgPSB3aW5kb3cuanNQbHVtYjtcclxuY29uc3QganNQbHVtYlRvb2xraXQgPSB3aW5kb3cuanNQbHVtYlRvb2xraXQ7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxuY29uc3QgUGVybWlzc2lvbnMgPSByZXF1aXJlKCcuLi9hcHAvUGVybWlzc2lvbnMnKVxyXG5cclxucmVxdWlyZSgnLi9sYXlvdXQnKVxyXG5cclxuY2xhc3MgQ2FudmFzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtYXAsIG1hcElkKSB7XHJcbiAgICAgICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICAgICAgdGhpcy5tYXBJZCA9IG1hcElkO1xyXG4gICAgICAgIHRoaXMudG9vbGtpdCA9IHt9O1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxyXG4gICAgICAgIGxldCBwZXJtaXNzaW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIGxldCByZWFkeSA9IHRoaXMubWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcElkfWApLnRoZW4oKG1hcEluZm8pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvID0gbWFwSW5mb1xyXG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG5ldyBQZXJtaXNzaW9ucyhtYXBJbmZvKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgY29uc3QgdGhyb3R0bGVTYXZlID0gXy50aHJvdHRsZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9ucy5jYW5FZGl0KCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB3aW5kb3cudG9vbGtpdC5leHBvcnREYXRhKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZF9ieToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YUluVHJhbnNhY3Rpb24ocG9zdERhdGEsIGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLkludGVncmF0aW9ucy5zZW5kRXZlbnQodGhpcy5tYXBJZCwgJ2V2ZW50JywgJ2F1dG9zYXZlJywgJ2F1dG9zYXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgIHJlYWR5LnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29ybmVyXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cclxuICAgICAgICAgICAgICAgIHZhciB0b29sa2l0ID0gd2luZG93LnRvb2xraXQgPSBqc1BsdW1iVG9vbGtpdC5uZXdJbnN0YW5jZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU3RhcnRDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCBlZGdlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29ybmVyID0gZWRnZVR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGVkZ2VUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZUNvbm5lY3Q6ZnVuY3Rpb24oZnJvbU5vZGUsIHRvTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9QcmV2ZW50IHNlbGYtcmVmZXJlbmNpbmcgY29ubmVjdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZnJvbU5vZGUgPT0gdG9Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQmV0d2VlbiB0aGUgc2FtZSB0d28gbm9kZXMsIG9ubHkgb25lIHBlcnNwZWN0aXZlIGNvbm5lY3Rpb24gbWF5IGV4aXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goY3VycmVudENvcm5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BlcnNwZWN0aXZlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gZnJvbU5vZGUuZ2V0RWRnZXMoeyBmaWx0ZXI6IGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuZGF0YS50eXBlID09ICdwZXJzcGVjdGl2ZScgfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZCA9IGVkZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoKGVkLnNvdXJjZSA9PSBmcm9tTm9kZSAmJiBlZC50YXJnZXQgPT0gdG9Ob2RlKSB8fCAoZWQudGFyZ2V0ID09IGZyb21Ob2RlICYmIGVkLnNvdXJjZSA9PSB0b05vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gZHVtbXkgZm9yIGEgbmV3IG5vZGUuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgdmFyIF9uZXdOb2RlID0gZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9dHlwZXx8XCJpZGVhXCJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3OjEwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaDoxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOlwiaWRlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgcHJveHkgKGRyYWcgaGFuZGxlKVxyXG4gICAgICAgICAgICAgICAgdmFyIF9uZXdQcm94eSA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSB8fCAncHJveHlQZXJzcGVjdGl2ZSdcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3OjEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoOjEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWFpbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmp0ay1kZW1vLW1haW5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanRrLWRlbW8tY2FudmFzXCIpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvL1doZW5ldmVyIGNoYW5naW5nIHRoZSBzZWxlY3Rpb24sIGNsZWFyIHdoYXQgd2FzIHByZXZpb3VzbHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgIHZhciBjbGVhclNlbGVjdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5zZXRTZWxlY3Rpb24ob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uZmlndXJlIHRoZSByZW5kZXJlclxyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gdG9vbGtpdC5yZW5kZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogY2FudmFzRWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0RyYWdnYWJsZTogcGVybWlzc2lvbnMuY2FuRWRpdCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZVBhbkJ1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxheW91dDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGN1c3RvbSBsYXlvdXQgZm9yIHRoaXMgYXBwLiBzaW1wbGUgZXh0ZW5zaW9uIG9mIHRoZSBzcHJpbmcgbGF5b3V0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwibWV0YW1hcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgaG93IHlvdSBjYW4gYXNzb2NpYXRlIGdyb3VwcyBvZiBub2Rlcy4gSGVyZSwgYmVjYXVzZSBvZiB0aGVcclxuICAgICAgICAgICAgICAgICAgICAvLyB3YXkgSSBoYXZlIHJlcHJlc2VudGVkIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGEsIHdlIGVpdGhlciByZXR1cm5cclxuICAgICAgICAgICAgICAgICAgICAvLyBhIHBhcnQncyBcInBhcmVudFwiIGFzIHRoZSBwb3NzZSwgb3IgaWYgaXQgaXMgbm90IGEgcGFydCB0aGVuIHdlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBub2RlJ3MgaWQuIFRoZXJlIGFyZSBhZGRUb1Bvc3NlIGFuZCByZW1vdmVGcm9tUG9zc2VcclxuICAgICAgICAgICAgICAgICAgICAvLyBtZXRob2RzIHRvbyAob24gdGhlIHJlbmRlcmVyLCBub3QgdGhlIHRvb2xraXQpOyB0aGVzZSBjYW4gYmUgdXNlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdHJhbnNmZXJyaW5nIGEgcGFydCBmcm9tIG9uZSBwYXJlbnQgdG8gYW5vdGhlci5cclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25Qb3NzZTpmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmRhdGEucGFyZW50IHx8IG5vZGUuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB6b29tVG9GaXQ6ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlldzp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXA6IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24ob2JqLm5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uKG9iaikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOlwidG1wbE5vZGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkZWE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiZGVmYXVsdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyLXRoaW5nXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiaWRlYVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsRHJhZ1Byb3h5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yczogWydDb250aW51b3VzJywgJ0NlbnRlciddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlQZXJzcGVjdGl2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJwcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZWxhdGlvbnNoaXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwicHJveHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmoubm9kZS5kYXRhLnR5cGUgPSAnci10aGluZydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqLm5vZGUuc2V0VHlwZSgnci10aGluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1VwZGF0aW5nIHRoZSBub2RlIHR5cGUgZG9lcyBub3Qgc2VlbSB0byBzdGljazsgaW5zdGVhZCwgY3JlYXRlIGEgbmV3IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gcmVuZGVyZXIubWFwRXZlbnRMb2NhdGlvbihvYmouZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGdlcyA9IG9iai5ub2RlLmdldEVkZ2VzKClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLncgPSBlZGdlc1swXS5zb3VyY2UuZGF0YS53ICogMC42Njc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLmggPSBlZGdlc1swXS5zb3VyY2UuZGF0YS5oICogMC42Njc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoanNQbHVtYi5leHRlbmQoX25ld05vZGUoXCJyLXRoaW5nXCIpLCBkKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZS1jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGlvbnMgb24gdGhlIG5ldyBub2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxlZGdlcy5sZW5ndGg7IGkrPTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlZGdlc1tpXS5zb3VyY2UgPT0gb2JqLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bmV3Tm9kZSwgdGFyZ2V0OmVkZ2VzW2ldLnRhcmdldCwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlZGdlc1tpXS50YXJnZXQgPT0gb2JqLm5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6ZWRnZXNbaV0uc291cmNlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwUHJveHlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZGVsZXRlIHRoZSBwcm94eSBub2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnJlbW92ZU5vZGUob2JqLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlczp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihvYmouZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpID09ICdyZWxhdGlvbnNoaXAtb3ZlcmxheScgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihvYmouZWRnZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yczpbXCJDb250aW51b3VzXCIsXCJDb250aW51b3VzXCJdLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3I6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9yOltcIlN0YXRlTWFjaGluZVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMS4wMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VydmluZXNzOjE1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1yZWxhdGlvbnNoaXBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6XCJCbGFua1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXlzOltcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWyBcIlBsYWluQXJyb3dcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246MSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOjEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOjEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJyZWxhdGlvbnNoaXAtb3ZlcmxheVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwUHJveHk6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1yZWxhdGlvbnNoaXBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6XCJCbGFua1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmU6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1wZXJzcGVjdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czo1LCBjc3NDbGFzczpcIm9yYW5nZVwiIH1dXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZVByb3h5OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcGVyc3BlY3RpdmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludHM6WyBcIkJsYW5rXCIsIFsgXCJEb3RcIiwgeyByYWRpdXM6MSwgY3NzQ2xhc3M6XCJvcmFuZ2VfcHJveHlcIiB9XV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50czp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhc0NsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzRGJsQ2xpY2s6ZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGFuIElkZWEgbm9kZSBhdCB0aGUgbG9jYXRpb24gYXQgd2hpY2ggdGhlIGV2ZW50IG9jY3VycmVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IHJlbmRlcmVyLm1hcEV2ZW50TG9jYXRpb24oZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL01vdmUgMS8yIHRoZSBoZWlnaHQgYW5kIHdpZHRoIHVwIGFuZCB0byB0aGUgbGVmdCB0byBjZW50ZXIgdGhlIG5vZGUgb24gdGhlIG1vdXNlIGNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHdoZW4gaGVpZ2h0L3dpZHRoIGlzIGNvbmZpZ3VyYWJsZSwgcmVtb3ZlIGhhcmQtY29kZWQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3MubGVmdCA9IHBvcy5sZWZ0LTUwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3MudG9wID0gcG9zLnRvcC01MFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5hZGROb2RlKGpzUGx1bWIuZXh0ZW5kKF9uZXdOb2RlKCksIHBvcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlQWRkZWQ6X3JlZ2lzdGVySGFuZGxlcnMsIC8vIHNlZSBiZWxvd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlQWRkZWQ6IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXlvdXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXJpb3VzIGRyYWcvZHJvcCBoYW5kbGVyIGV2ZW50IGV4cGVyaW1lbnRzIGxpdmVkIGhlcmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ09wdGlvbnM6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6XCIuc2VnbWVudFwiICAgICAgIC8vIGNhbid0IGRyYWcgbm9kZXMgYnkgdGhlIGNvbG9yIHNlZ21lbnRzLlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LkRpYWxvZ3MuaW5pdGlhbGl6ZSh7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogXCIuZGxnXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8gZGlhbG9ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gICAgTW91c2UgaGFuZGxlcnMuIFNvbWUgYXJlIHdpcmVkIHVwOyBhbGwgbG9nIHRoZSBjdXJyZW50IG5vZGUgZGF0YSB0byB0aGUgY29uc29sZS5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgX3R5cGVzID0gWyBcInJlZFwiLCBcIm9yYW5nZVwiLCBcImdyZWVuXCIsIFwiYmx1ZVwiLCBcInRleHRcIiBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjbGlja0xvZ2dlciA9IGZ1bmN0aW9uKHR5cGUsIGV2ZW50LCBlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50ICsgJyAnICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIobm9kZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihldmVudCA9PSAnZGJsY2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIF9jbGlja0hhbmRsZXJzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignUicsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmVlbjpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0cnLCAnY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JhbmdlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignTycsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBibHVlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignQicsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignVCcsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBkYmxjbGljazp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZDpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1InLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW46ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdHJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3V2lkdGggPSBub2RlLmRhdGEudyAqIDAuNjY3O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0hlaWdodCA9IG5vZGUuZGF0YS5oICogMC42Njc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmNoaWxkcmVuID0gbm9kZS5kYXRhLmNoaWxkcmVuIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0xhYmVsID0gbm9kZS5kYXRhLmxhYmVsICsgXCI6IFBhcnQgXCIgKyAobm9kZS5kYXRhLmNoaWxkcmVuLmxlbmd0aCsxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZSh7cGFyZW50Om5vZGUuaWQsdzpuZXdXaWR0aCxoOm5ld0hlaWdodCxsYWJlbDogbmV3TGFiZWx9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5jaGlsZHJlbi5wdXNoKG5ld05vZGUuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIucmVsYXlvdXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3JhbmdlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignTycsICdkYmxjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJveHlOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdQcm94eSgncHJveHlQZXJzcGVjdGl2ZScpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpub2RlLCB0YXJnZXQ6cHJveHlOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicGVyc3BlY3RpdmVQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpwcm94eU5vZGUsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicGVyc3BlY3RpdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBibHVlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignQicsICdkYmxjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJveHlOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdQcm94eSgncHJveHlSZWxhdGlvbnNoaXAnKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bm9kZSwgdGFyZ2V0OnByb3h5Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFByb3h5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOnByb3h5Tm9kZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignVCcsICdkYmxjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gZWwucXVlcnlTZWxlY3RvcihcIi5uYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogXCJkbGdUZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRW50ZXIgbGFiZWw6XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25PSzogZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC51cGRhdGVOb2RlKG5vZGUsIHsgbGFiZWw6ZC50ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6bm9kZS5kYXRhLmxhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBfY3VycnlIYW5kbGVyID0gZnVuY3Rpb24oZWwsIHNlZ21lbnQsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgX2VsID0gZWwucXVlcnlTZWxlY3RvcihcIi5cIiArIHNlZ21lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24oX2VsLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NsaWNrSGFuZGxlcnNbXCJjbGlja1wiXVtzZWdtZW50XShlbCwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYi5vbihfZWwsIFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2xpY2tIYW5kbGVyc1tcImRibGNsaWNrXCJdW3NlZ21lbnRdKGVsLCBub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIHNldHVwIHRoZSBjbGlja2luZyBhY3Rpb25zIGFuZCB0aGUgbGFiZWwgZHJhZy4gRm9yIHRoZSBkcmFnIHdlIGNyZWF0ZSBhblxyXG4gICAgICAgICAgICAgICAgLy8gaW5zdGFuY2Ugb2YganNQbHVtYiBmb3Igbm90IG90aGVyIHB1cnBvc2UgdGhhbiB0byBtYW5hZ2UgdGhlIGRyYWdnaW5nIG9mXHJcbiAgICAgICAgICAgICAgICAvLyBsYWJlbHMuIFdoZW4gYSBkcmFnIHN0YXJ0cyB3ZSBzZXQgdGhlIHpvb20gb24gdGhhdCBqc1BsdW1iIGluc3RhbmNlIHRvXHJcbiAgICAgICAgICAgICAgICAvLyBtYXRjaCBvdXIgY3VycmVudCB6b29tLlxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIHZhciBsYWJlbERyYWdIYW5kbGVyID0ganNQbHVtYi5nZXRJbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gX3JlZ2lzdGVySGFuZGxlcnMocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGVyZSB5b3UgaGF2ZSBwYXJhbXMuZWwsIHRoZSBET00gZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBwYXJhbXMubm9kZSwgdGhlIHVuZGVybHlpbmcgbm9kZS4gaXQgaGFzIGEgYGRhdGFgIG1lbWJlciB3aXRoIHRoZSBub2RlJ3MgcGF5bG9hZC5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSBwYXJhbXMuZWwsIG5vZGUgPSBwYXJhbXMubm9kZSwgbGFiZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLm5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2N1cnJ5SGFuZGxlcihlbCwgX3R5cGVzW2ldLCBub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIGxhYmVsIGRyYWdnYWJsZSAoc2VlIG5vdGUgYWJvdmUpLlxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsRHJhZ0hhbmRsZXIuZHJhZ2dhYmxlKGxhYmVsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OmZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbERyYWdIYW5kbGVyLnNldFpvb20ocmVuZGVyZXIuZ2V0Wm9vbSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcDpmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEubGFiZWxQb3NpdGlvbiA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChsYWJlbC5zdHlsZS5sZWZ0LCAxMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQobGFiZWwuc3R5bGUudG9wLCAxMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBsYWJlbCBlZGl0YWJsZSB2aWEgYSBkaWFsb2dcclxuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGxhYmVsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LkRpYWxvZ3Muc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogXCJkbGdUZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uT0s6IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC51cGRhdGVOb2RlKG5vZGUsIHsgbGFiZWw6ZC50ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpub2RlLmRhdGEubGFiZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAqIHNob3dzIGluZm8gaW4gd2luZG93IG9uIGJvdHRvbSByaWdodC5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBfaW5mbyh0ZXh0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBsb2FkIHRoZSBkYXRhLlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQubWFwICYmIHRoYXQubWFwLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoYXQubWFwLmRhdGFcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6XCJkYXRhLmpzb25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgLy8gYSBjb3VwbGUgb2YgcmFuZG9tIGV4YW1wbGVzIG9mIHRoZSBmaWx0ZXIgZnVuY3Rpb24sIGFsbG93aW5nIHlvdSB0byBxdWVyeSB5b3VyIGRhdGFcclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY291bnRFZGdlc09mVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9vbGtpdC5maWx0ZXIoZnVuY3Rpb24ob2JqKSB7IHJldHVybiBvYmoub2JqZWN0VHlwZSA9PSBcIkVkZ2VcIiAmJiBvYmouZGF0YS50eXBlPT09dHlwZTsgfSkuZ2V0RWRnZUNvdW50KClcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgZHVtcEVkZ2VDb3VudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFyZSBcIiArIGNvdW50RWRnZXNPZlR5cGUoXCJyZWxhdGlvbnNoaXBcIikgKyBcIiByZWxhdGlvbnNoaXAgZWRnZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSBhcmUgXCIgKyBjb3VudEVkZ2VzT2ZUeXBlKFwicGVyc3BlY3RpdmVcIikgKyBcIiBwZXJzcGVjdGl2ZSBlZGdlc1wiKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdG9vbGtpdC5iaW5kKFwiZGF0YVVwZGF0ZWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHVtcEVkZ2VDb3VudHMoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZVNhdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihcInJlbGF0aW9uc2hpcEVkZ2VEdW1wXCIsIFwiY2xpY2tcIiwgZHVtcEVkZ2VDb3VudHMoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9DVFJMICsgY2xpY2sgZW5hYmxlcyB0aGUgbGFzc29cclxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oZG9jdW1lbnQsICdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0TW9kZSgnc2VsZWN0JylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZGVsZXRlQWxsID0gZnVuY3Rpb24oc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RPRE86IGltcGxlbWVudCBsb2dpYyB0byBkZWxldGUgd2hvbGUgZWRnZStwcm94eStlZGdlIHN0cnVjdHVyZVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmVhY2hFZGdlKGZ1bmN0aW9uKGksZSkgeyBjb25zb2xlLmxvZyhlKSB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9SZWN1cnNlIG92ZXIgYWxsIGNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaE5vZGUoZnVuY3Rpb24oaSxuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN1cnNlID0gZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobm9kZSAmJiBub2RlLmRhdGEuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxub2RlLmRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKz0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IHRvb2xraXQuZ2V0Tm9kZShub2RlLmRhdGEuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0RlbGV0ZSBjaGlsZHJlbiBiZWZvcmUgcGFyZW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmVOb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShuKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnJlbW92ZShzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9tYXAgYmFja3NwYWNlIHRvIGRlbGV0ZSBpZiBhbnl0aGluZyBpcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0b29sa2l0LmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0NjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUFsbChzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oZG9jdW1lbnQsICdrZXlkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0NjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHRvb2xraXQuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVBbGwoc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAvL0tMVURHRTpcclxuICAgICAgICAgICAgICAgIC8vVGhlIFNWRyBzZWdtZW50cyBmb3IgbGV0dGVycyBhbmQgYnV0dG9ucyBhcmUgbm90IGdyb3VwZWQgdG9nZXRoZXIsIHNvIHRoZSBjc3M6aG92ZXIgdHJpY2sgZG9lc24ndCB3b3JrXHJcbiAgICAgICAgICAgICAgICAvL0luc3RlYWQsIHVzZSBqUXVlcnlcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvZ2dsZU9wYWNpdHkgPSAobm9kZSwgb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvL01vdXNlIE92ZXJcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGV0dGVyID0gJChub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjc3NDbGFzcyA9IG5vZGUuY2xhc3NMaXN0WzFdXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1dHRvbiA9ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjc3NDbGFzcy50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3AnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uID0gJ29yYW5nZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9ICdyZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24gPSAnYmx1ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9ICdncmVlbidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICQobGV0dGVyKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAuJHtidXR0b259LnNlZ21lbnRgKS5jc3MoJ29wYWNpdHknLCBvbilcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkKCcubGV0dGVyJykuaG92ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vTW91c2UgT3ZlclxyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZU9wYWNpdHkodGhpcywgMSk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9Nb3VzZSBPdXRcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICQoJy5zZWdtZW50JykuaG92ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vTW91c2UgT3ZlclxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywgMSlcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL01vdXNlIE91dFxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywgMClcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzOyIsIi8qKlxuKiBDdXN0b20gbGF5b3V0IGZvciBtZXRhbWFwLiBFeHRlbmRzIHRoZSBTcHJpbmcgbGF5b3V0LiBBZnRlciBTcHJpbmcgcnVucywgdGhpc1xuKiBsYXlvdXQgZmluZHMgJ3BhcnQnIG5vZGVzIGFuZCBhbGlnbnMgdGhlbSB1bmRlcm5lYXRoIHRoZWlyIHBhcmVudHMuIFRoZSBhbGlnbm1lbnRcbiogLSBsZWZ0IG9yIHJpZ2h0IC0gaXMgc2V0IGluIHRoZSBwYXJlbnQgbm9kZSdzIGRhdGEsIGFzIGBwYXJ0QWxpZ25gLlxuKi9cbjsoZnVuY3Rpb24oKSB7XG5cbiAganNQbHVtYlRvb2xraXQuTGF5b3V0c1tcIm1ldGFtYXBcIl0gPSBmdW5jdGlvbigpIHtcbiAgICBqc1BsdW1iVG9vbGtpdC5MYXlvdXRzLlNwcmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIF9vbmVTZXQgPSBmdW5jdGlvbihwYXJlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgdmFyIHBhZGRpbmcgPSBwYXJhbXMucGFydFBhZGRpbmcgfHwgNTA7XG4gICAgICBpZiAocGFyZW50LmRhdGEuY2hpbGRyZW4pIHtcblxuICAgICAgICB2YXIgYyA9IHBhcmVudC5kYXRhLmNoaWxkcmVuLFxuICAgICAgICAgICAgcGFyZW50UG9zID0gdGhpcy5nZXRQb3NpdGlvbihwYXJlbnQuaWQpLFxuICAgICAgICAgICAgcGFyZW50U2l6ZSA9IHRoaXMuZ2V0U2l6ZShwYXJlbnQuaWQpLFxuICAgICAgICAgICAgbWFnbmV0aXplTm9kZXMgPSBbIHBhcmVudC5pZCBdLFxuICAgICAgICAgICAgYWxpZ24gPSAocGFyZW50LmRhdGEucGFydEFsaWduIHx8IFwicmlnaHRcIikgPT09IFwibGVmdFwiID8gMCA6IDEsXG4gICAgICAgICAgICB5ID0gcGFyZW50UG9zWzFdICsgcGFyZW50U2l6ZVsxXSArIHBhZGRpbmc7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYoY1tpXSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkU2l6ZSA9IHRoaXMuZ2V0U2l6ZShjW2ldKSxcbiAgICAgICAgICAgICAgICB4ID0gcGFyZW50UG9zWzBdICsgKGFsaWduICogKHBhcmVudFNpemVbMF0gLSBjaGlsZFNpemVbMF0pKTtcbiAgXG4gICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGNbaV0sIHgsIHksIHRydWUpO1xuICAgICAgICAgICAgbWFnbmV0aXplTm9kZXMucHVzaChjW2ldKTtcbiAgICAgICAgICAgIHkgKz0gKGNoaWxkU2l6ZVsxXSArIHBhZGRpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gc3Rhc2ggb3JpZ2luYWwgZW5kIGNhbGxiYWNrIGFuZCBvdmVycmlkZS4gcGxhY2UgYWxsIFBhcnQgbm9kZXMgd3J0IHRoZWlyXG4gICAgLy8gcGFyZW50cywgdGhlbiBjYWxsIG9yaWdpbmFsIGVuZCBjYWxsYmFjayBhbmQgZmluYWxseSB0ZWxsIHRoZSBsYXlvdXRcbiAgICAvLyB0byBkcmF3IGl0c2VsZiBhZ2Fpbi5cbiAgICB2YXIgX3N1cGVyRW5kID0gdGhpcy5lbmQ7XG4gICAgdGhpcy5lbmQgPSBmdW5jdGlvbih0b29sa2l0LCBwYXJhbXMpIHtcbiAgICAgIHZhciBuYyA9IHRvb2xraXQuZ2V0Tm9kZUNvdW50KCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5jOyBpKyspIHtcbiAgICAgICAgdmFyIG4gPSB0b29sa2l0LmdldE5vZGVBdChpKTtcbiAgICAgICAgLy8gb25seSBwcm9jZXNzIG5vZGVzIHRoYXQgYXJlIG5vdCBQYXJ0IG5vZGVzICh0aGVyZSBjb3VsZCBvZiBjb3Vyc2UgYmVcbiAgICAgICAgLy8gYSBtaWxsaW9uIHdheXMgb2YgZGV0ZXJtaW5pbmcgd2hhdCBpcyBhIFBhcnQgbm9kZS4uLmhlcmUgSSBqdXN0IHVzZVxuICAgICAgICAvLyBhIHJ1ZGltZW50YXJ5IGNvbnN0cnVjdCBpbiB0aGUgZGF0YSlcbiAgICAgICAgaWYgKG4uZGF0YS5wYXJlbnQgPT0gbnVsbCkge1xuICAgICAgICAgIF9vbmVTZXQobiwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3VwZXJFbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gIH07XG5cbn0pKCk7XG4iLCJjb25zdCBBQ1RJT05TID0ge1xyXG4gICAgTUFQOiAnbWFwJyxcclxuICAgIE5FV19NQVA6ICduZXdfbWFwJyxcclxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxyXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxyXG4gICAgSE9NRTogJ2hvbWUnLFxyXG4gICAgTVlfTUFQUzogJ215bWFwcycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcclxuICAgIExPR09VVDogJ2xvZ291dCcsXHJcbiAgICBGRUVEQkFDSzogJ2ZlZWRiYWNrJyxcclxuICAgIFNIQVJFX01BUDogJ3NoYXJlX21hcCdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQUNUSU9OUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFDVElPTlM7IiwiY29uc3QgQ0FOVkFTID0ge1xyXG4gICAgTEVGVDogJ2xlZnQnLFxyXG4gICAgUklHSFQ6ICdyaWdodCdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQ0FOVkFTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ0FOVkFTOyIsImNvbnN0IENPTlNUQU5UUyA9IHtcclxuXHRBQ1RJT05TOiByZXF1aXJlKCcuL2FjdGlvbnMnKSxcclxuXHRDQU5WQVM6IHJlcXVpcmUoJy4vY2FudmFzJyksXHJcblx0RFNSUDogcmVxdWlyZSgnLi9kc3JwJyksXHJcblx0RURJVF9TVEFUVVM6IHJlcXVpcmUoJy4vZWRpdFN0YXR1cycpLFxyXG5cdEVMRU1FTlRTOiByZXF1aXJlKCcuL2VsZW1lbnRzJyksXHJcbiAgICBFVkVOVFM6IHJlcXVpcmUoJy4vZXZlbnRzJyksXHJcbiAgICBOT1RJRklDQVRJT046IHJlcXVpcmUoJy4vbm90aWZpY2F0aW9uJyksXHJcblx0UEFHRVM6IHJlcXVpcmUoJy4vcGFnZXMnKSxcclxuXHRST1VURVM6IHJlcXVpcmUoJy4vcm91dGVzJyksXHJcblx0VEFCUzogcmVxdWlyZSgnLi90YWJzJyksXHJcblx0VEFHUzogcmVxdWlyZSgnLi90YWdzJylcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQ09OU1RBTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ09OU1RBTlRTOyIsImNvbnN0IERTUlAgPSB7XHJcblx0RDogJ0QnLFxyXG5cdFM6ICdTJyxcclxuXHRSOiAnUicsXHJcblx0UDogJ1AnXHJcbn1cclxuXHJcbk9iamVjdC5mcmVlemUoRFNSUCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERTUlA7IiwiY29uc3Qgc3RhdHVzID0ge1xyXG4gICAgTEFTVF9VUERBVEVEOiAnJyxcclxuICAgIFJFQURfT05MWTogJ1ZpZXcgb25seScsXHJcbiAgICBTQVZJTkc6ICdTYXZpbmcuLi4nLFxyXG4gICAgU0FWRV9PSzogJ0FsbCBjaGFuZ2VzIHNhdmVkJyxcclxuICAgIFNBVkVfRkFJTEVEOiAnQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQnXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKHN0YXR1cyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXR1czsiLCJjb25zdCBFTEVNRU5UUyA9IHtcclxuICAgIEFQUF9DT05UQUlORVI6ICdhcHAtY29udGFpbmVyJyxcclxuICAgIE1FVEFfUFJPR1JFU1M6ICdtZXRhX3Byb2dyZXNzJyxcclxuICAgIE1FVEFfUFJPR1JFU1NfTkVYVDogJ21ldGFfcHJvZ3Jlc3NfbmV4dCcsXHJcbiAgICBNRVRBX01PREFMX0RJQUxPR19DT05UQUlORVI6ICdtZXRhX21vZGFsX2RpYWxvZ19jb250YWluZXInXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKEVMRU1FTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRUxFTUVOVFM7IiwiY29uc3QgRVZFTlRTID0ge1xyXG5cdFNJREVCQVJfT1BFTjogJ3NpZGViYXItb3BlbicsXHJcblx0U0lERUJBUl9DTE9TRTogJ3NpZGViYXItY2xvc2UnLFxyXG5cdFNJREVCQVJfVE9HR0xFOiAnc2lkZWJhci10b2dnbGUnLFxyXG5cdFBBR0VfTkFNRTogJ3BhZ2VOYW1lJyxcclxuXHROQVY6ICduYXYnLFxyXG5cdE1BUDogJ21hcCdcclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShFVkVOVFMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFVkVOVFM7IiwiY29uc3QgTk9USUZJQ0FUSU9OID0ge1xyXG5cdE1BUDogJ21hcCdcclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShOT1RJRklDQVRJT04pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOT1RJRklDQVRJT047IiwiY29uc3QgQUNUSU9OUyA9IHJlcXVpcmUoJy4vYWN0aW9ucy5qcycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBQQUdFUyA9IHtcclxuICAgIE1BUDogJ21hcCcsXHJcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXHJcbiAgICBDT1BZX01BUDogJ2NvcHlfbWFwJyxcclxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcclxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxyXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICd0ZXJtcycsXHJcbiAgICBIT01FOiAnaG9tZSdcclxufTtcclxuXHJcbl8uZXh0ZW5kKClcclxuXHJcbk9iamVjdC5mcmVlemUoUEFHRVMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQQUdFUzsiLCJjb25zdCBST1VURVMgPSB7XHJcbiAgICBNQVBTX0xJU1Q6ICdtYXBzL2xpc3QvJyxcclxuICAgIE1BUFNfREFUQTogJ21hcHMvZGF0YS8nLFxyXG4gICAgTUFQU19ORVdfTUFQOiAnbWFwcy9uZXctbWFwLycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ21ldGFtYXAvdGVybXMtYW5kLWNvbmRpdGlvbnMvJyxcclxuICAgIEhPTUU6ICdtZXRhbWFwL2hvbWUvJyxcclxuICAgIE5PVElGSUNBVElPTlM6ICd1c2Vycy97MH0vbm90aWZpY2F0aW9ucydcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoUk9VVEVTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUk9VVEVTOyIsImNvbnN0IFRBQlMgPSB7XHJcbiAgICBUQUJfSURfUFJFU0VOVEVSIDogJ3ByZXNlbnRlci10YWInLFxyXG4gICAgVEFCX0lEX0FOQUxZVElDU19NQVAgOiAnYW5hbHl0aWNzLXRhYi1tYXAnLFxyXG4gICAgVEFCX0lEX0FOQUxZVElDU19USElORyA6ICdhbmFseXRpY3MtdGFiLXRoaW5nJyxcclxuICAgIFRBQl9JRF9QRVJTUEVDVElWRVMgOiAncGVyc3BlY3RpdmVzLXRhYicsXHJcbiAgICBUQUJfSURfRElTVElOQ1RJT05TIDogJ2Rpc3RpbmN0aW9ucy10YWInLFxyXG4gICAgVEFCX0lEX0FUVEFDSE1FTlRTIDogJ2F0dGFjaG1lbnRzLXRhYicsXHJcbiAgICBUQUJfSURfR0VORVJBVE9SIDogJ2dlbmVyYXRvci10YWInLFxyXG4gICAgVEFCX0lEX1NUQU5EQVJEUyA6ICdzdGFuZGFyZHMtdGFiJ1xyXG59O1xyXG5PYmplY3QuZnJlZXplKFRBQlMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUQUJTOyIsImNvbnN0IFRBR1MgPSB7XHJcbiAgICBNRVRBX0NBTlZBUzogJ21ldGEtY2FudmFzJyxcclxuICAgIEhPTUU6ICdob21lJyxcclxuICAgIFRFUk1TOiAndGVybXMnLFxyXG4gICAgTVlfTUFQUzogJ215LW1hcHMnLFxyXG4gICAgU0hBUkU6ICdzaGFyZSdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoVEFHUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRBR1M7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgQWRkVGhpcyBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgICAgICAgIHQgPSB3aW5kb3cuYWRkdGhpcyB8fCB7fTtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcclxuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIGpzLnNyYyA9IGAvL3M3LmFkZHRoaXMuY29tL2pzLzMwMC9hZGR0aGlzX3dpZGdldC5qcyNwdWJpZD0ke2NvbmZpZy5wdWJpZH1gO1xyXG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwiYWRkLXRoaXMtanNcIikpO1xyXG4gICAgICAgIHRoaXMuYWRkdGhpcyA9IHdpbmRvdy5hZGR0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5hZGR0aGlzID0gdGhpcy5hZGR0aGlzIHx8IHdpbmRvdy5hZGR0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFkZFRoaXM7XHJcblxyXG5cclxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgRmFjZWJvb2sgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF07XHJcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgICAgICBqcy5zcmMgPSBcIi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvc2RrLmpzXCI7XHJcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgICB9IChkb2N1bWVudCwgJ3NjcmlwdCcsICdmYWNlYm9vay1qc3NkaycpKTtcclxuICAgICAgICB0aGlzLkZCID0gd2luZG93LkZCO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLmluaXQoe1xyXG4gICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuYXBwaWQsXHJcbiAgICAgICAgICAgIHhmYm1sOiB0aGlzLmNvbmZpZy54ZmJtbCxcclxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy5jb25maWcudmVyc2lvblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLkV2ZW50LnN1YnNjcmliZSgnZWRnZS5jcmVhdGUnLCBmdW5jdGlvbiAodGFyZ2V0VXJsKSB7XHJcbiAgICAgICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCdmYWNlYm9vaycsIHRhcmdldFVybCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uRXZlbnQuc3Vic2NyaWJlKCdlZGdlLnJlbW92ZScsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5FdmVudC5zdWJzY3JpYmUoJ21lc3NhZ2Uuc2VuZCcsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuRkIgPSB0aGlzLkZCIHx8IHdpbmRvdy5GQjtcclxuICAgICAgICByZXR1cm4gdGhpcy5GQjtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZhY2Vib29rO1xyXG5cclxuXHJcbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIEdvb2dsZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgbGV0IHBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IHBvLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JzsgcG8uYXN5bmMgPSB0cnVlO1xyXG4gICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xyXG4gICAgICBsZXQgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XHJcbiAgICB9KSgpO1xyXG4gICAgICBcclxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxyXG4gICAgKGZ1bmN0aW9uICh3LCBkLCBzLCBsLCBpKSB7XHJcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xyXG4gICAgICAgICdndG0uc3RhcnQnOlxyXG4gICAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCBldmVudDogJ2d0bS5qcydcclxuICAgICAgfSk7IGxldCBmID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cclxuICAgICAgICAnLy93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RtLmpzP2lkPScgKyBpICsgZGw7IGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJ2RhdGFMYXllcicsIHRoaXMuY29uZmlnLnRhZ21hbmFnZXIpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoaSwgcywgbywgZywgciwgYSwgbSkge1xyXG4gICAgICBpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXSA9IHI7IGlbcl0gPSBpW3JdIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAoaVtyXS5xID0gaVtyXS5xIHx8IFtdKS5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgIH0sIGlbcl0ubCA9IDEgKiBuZXcgRGF0ZSgpOyBhID0gcy5jcmVhdGVFbGVtZW50KG8pLFxyXG4gICAgICBtID0gcy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTsgYS5hc3luYyA9IDE7IGEuc3JjID0gZztcclxuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcclxuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzJywgJ2dhJyk7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgdGhpcy5nYSA9IHRoaXMuZ2EgfHwgd2luZG93LmdhO1xyXG4gICAgcmV0dXJuIHRoaXMuZ2E7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgbGV0IG1vZGUgPSAnYXV0byc7XHJcbiAgICBsZXQgZG9tYWluID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICBpZihkb21haW4uc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcclxuICAgICAgbW9kZSA9ICdub25lJztcclxuICAgIH1cclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ2NyZWF0ZScsIHRoaXMuY29uZmlnLmFuYWx5dGljcywgbW9kZSk7XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyKCkge1xyXG4gICAgc3VwZXIuc2V0VXNlcigpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0JywgJ3VzZXJJZCcsIHRoaXMudXNlci51c2VySWQpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRTb2NpYWwobmV0d29yaywgdGFyZ2V0VXJsLCB0eXBlID0gJ3NlbmQnKSB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCBuZXR3b3JrLCB0eXBlLCB0YXJnZXRVcmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xyXG4gICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XHJcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICBpZiAoc291cmNlICYmIHR5cGUpIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdmFsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHZhbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgdXBkYXRlUGF0aChwYXRoKSB7XHJcbiAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCB7XHJcbiAgICAgICAgICAgIHBhZ2U6IHBhdGhcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZEV2ZW50KGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCkge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB1cmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR29vZ2xlO1xyXG5cclxuXHJcbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIEludGVyY29tIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG5cclxuICAgICAgICBsZXQgaSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaS5jKGFyZ3VtZW50cylcclxuICAgICAgICB9O1xyXG4gICAgICAgIGkucSA9IFtdO1xyXG4gICAgICAgIGkuYyA9IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgICAgICAgIGkucS5wdXNoKGFyZ3MpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB3aW5kb3cuSW50ZXJjb20gPSBpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgICAgICBzLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICAgICAgcy5zcmMgPSBgaHR0cHM6Ly93aWRnZXQuaW50ZXJjb20uaW8vd2lkZ2V0LyR7Y29uZmlnLmFwcGlkfX1gO1xyXG4gICAgICAgICAgICBsZXQgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICAgICAgeC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzLCB4KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmludGVyY29tID0gd2luZG93LkludGVyY29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLmludGVyY29tID0gdGhpcy5pbnRlcmNvbSB8fCB3aW5kb3cuSW50ZXJjb207XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJjb207XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignYm9vdCcsIHtcclxuICAgICAgICAgICAgYXBwX2lkOiB0aGlzLmNvbmZpZy5hcHBpZCxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy51c2VyLmZ1bGxOYW1lLFxyXG4gICAgICAgICAgICBlbWFpbDogdGhpcy51c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBjcmVhdGVkX2F0OiB0aGlzLnVzZXIuY3JlYXRlZE9uLnRpY2tzLFxyXG4gICAgICAgICAgICB1c2VyX2lkOiB0aGlzLnVzZXIudXNlcklkXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZW5kRXZlbnQoJ3VwZGF0ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRFdmVudChldmVudCA9ICd1cGRhdGUnKSB7XHJcbiAgICAgICAgc3VwZXIuc2VuZEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCd1cGRhdGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCd1cGRhdGUnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHN1cGVyLmxvZ291dCgpO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NodXRkb3duJyk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY29tOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIE5ld1JlbGljIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG5cclxuICAgICAgICB0aGlzLk5ld1JlbGljID0gd2luZG93Lk5SRVVNO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLk5ld1JlbGljID0gdGhpcy5OZXdSZWxpYyB8fCB3aW5kb3cuTlJFVU07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuTmV3UmVsaWM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW50ZWdyYXRpb24gJiYgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUoJ3VzZXJuYW1lJywgdGhpcy51c2VyLmVtYWlsKTtcclxuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUoJ2FjY2NvdW50SUQnLCB0aGlzLnVzZXIudXNlcklkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xyXG4gICAgICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG4gICAgICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZWdyYXRpb24uYWRkVG9UcmFjZSh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGFnZVZpZXdOYW1lKHBhdGgsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV3UmVsaWM7XHJcblxyXG5cclxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgVHdpdHRlciBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgICAgIGxldCBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgICAgICAgIHQgPSB3aW5kb3cudHd0dHIgfHwge307XHJcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgICAgICBqcy5zcmMgPSBcImh0dHBzOi8vcGxhdGZvcm0udHdpdHRlci5jb20vd2lkZ2V0cy5qc1wiO1xyXG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwidHdpdHRlci13anNcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24ucmVhZHkoKHR3aXR0ZXIpID0+IHtcclxuICAgICAgICAgICAgdHdpdHRlci53aWRnZXRzLmxvYWQoKTtcclxuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnY2xpY2snLCB0aGlzLl9jbGlja0V2ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCd0d2VldCcsIHRoaXMuX3R3ZWV0SW50ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdyZXR3ZWV0JywgdGhpcy5fcmV0d2VldEludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgnZmF2b3JpdGUnLCB0aGlzLl9mYXZJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ2ZvbGxvdycsIHRoaXMuX2ZvbGxvd0ludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHRyeUNvdW50ID0gMDtcclxuICAgICAgICBsZXQgbG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy50d3R0ciAmJiB3aW5kb3cudHd0dHIud2lkZ2V0cykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy50d3R0ci53aWRnZXRzLmxvYWQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0cnlDb3VudCA8IDUpIHtcclxuICAgICAgICAgICAgICAgIHRyeUNvdW50ICs9IDE7XHJcbiAgICAgICAgICAgICAgICBfLmRlbGF5KGxvYWQsIDI1MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMudHd0dHIgPSB0aGlzLnR3dHRyIHx8IHdpbmRvdy50d3R0cjtcclxuICAgICAgICByZXR1cm4gdGhpcy50d3R0cjtcclxuICAgIH1cclxuXHJcbiAgICBfZm9sbG93SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhYmVsID0gaW50ZW50RXZlbnQuZGF0YS51c2VyX2lkICsgXCIgKFwiICsgaW50ZW50RXZlbnQuZGF0YS5zY3JlZW5fbmFtZSArIFwiKVwiO1xyXG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIF9yZXR3ZWV0SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhYmVsID0gaW50ZW50RXZlbnQuZGF0YS5zb3VyY2VfdHdlZXRfaWQ7XHJcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2ZhdkludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5fdHdlZXRJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3R3ZWV0SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhYmVsID0gXCJ0d2VldFwiO1xyXG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xyXG4gICAgfVxyXG4gICAgX2NsaWNrRXZlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgICAgIGlmICghaW50ZW50RXZlbnQpIHJldHVybjtcclxuICAgICAgICBsZXQgbGFiZWwgPSBpbnRlbnRFdmVudC5yZWdpb247XHJcbiAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ3R3aXR0ZXInLCBsYWJlbCwgaW50ZW50RXZlbnQudHlwZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHdpdHRlcjtcclxuXHJcblxyXG4iLCJcclxuY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgVXNlclNuYXAgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgbGV0IGFwaUtleSwgcywgeDtcclxuICAgICAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uZmlnID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFwaUtleSA9IGNvbmZpZy5hcGk7XHJcbiAgICAgICAgaWYgKGFwaUtleSAmJiAhd2luZG93LmxvY2F0aW9uLmhvc3Quc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcclxuICAgICAgICAgICAgbGV0IHVzQ29uZiA9IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsQm94OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWxCb3hWYWx1ZTogdXNlci5lbWFpbCxcclxuICAgICAgICAgICAgICAgIGVtYWlsUmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlUmVjb3JkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdvb2dsZS5zZW5kRXZlbnQoJ2ZlZWRiYWNrJywgJ3VzZXJzbmFwJywgJ3dpZGdldCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0gd2luZG93Ll91c2Vyc25hcGNvbmZpZyA9IHVzQ29uZjtcclxuXHJcbiAgICAgICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XHJcbiAgICAgICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgICAgICB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gdGhpcy51c2VyU25hcCB8fCB3aW5kb3cuVXNlclNuYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlclNuYXA7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyU25hcDsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBaZW5EZXNrIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgICAgIGxldCB6TyA9IHt9O1xyXG4gICAgICAgIHdpbmRvdy56RW1iZWQgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZSwgdCkge1xyXG4gICAgICAgICAgICBsZXQgbiwgbywgZCwgaSwgcywgYSA9IFtdLCByID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTsgd2luZG93LnpFbWJlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGEucHVzaChhcmd1bWVudHMpXHJcbiAgICAgICAgICAgIH0sIHdpbmRvdy56RSA9IHdpbmRvdy56RSB8fCB3aW5kb3cuekVtYmVkLCByLnNyYyA9IFwiamF2YXNjcmlwdDpmYWxzZVwiLCByLnRpdGxlID0gXCJcIiwgci5yb2xlID0gXCJwcmVzZW50YXRpb25cIiwgKHIuZnJhbWVFbGVtZW50IHx8IHIpLnN0eWxlLmNzc1RleHQgPSBcImRpc3BsYXk6IG5vbmVcIiwgZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpLCBkID0gZFtkLmxlbmd0aCAtIDFdLCBkLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHIsIGQpLCBpID0gci5jb250ZW50V2luZG93LCBzID0gaS5kb2N1bWVudDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIG8gPSBzXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGMpIHtcclxuICAgICAgICAgICAgICAgIG4gPSBkb2N1bWVudC5kb21haW4sIHIuc3JjID0gJ2phdmFzY3JpcHQ6bGV0IGQ9ZG9jdW1lbnQub3BlbigpO2QuZG9tYWluPVwiJyArIG4gKyAnXCI7dm9pZCgwKTsnLCBvID0gc1xyXG4gICAgICAgICAgICB9IG8ub3BlbigpLl9sID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG8gPSB0aGlzLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7IG4gJiYgKHRoaXMuZG9tYWluID0gbiksIG8uaWQgPSBcImpzLWlmcmFtZS1hc3luY1wiLCBvLnNyYyA9IGUsIHRoaXMudCA9ICtuZXcgRGF0ZSwgdGhpcy56ZW5kZXNrSG9zdCA9IHQsIHRoaXMuekVRdWV1ZSA9IGEsIHRoaXMuYm9keS5hcHBlbmRDaGlsZChvKVxyXG4gICAgICAgICAgICAgICAgek8ubG9naWMgPSB3aW5kb3cuekU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG8ud3JpdGUoJzxib2R5IG9ubG9hZD1cImRvY3VtZW50Ll9sKCk7XCI+JyksXHJcbiAgICAgICAgICAgIG8uY2xvc2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgKFwiaHR0cHM6Ly9hc3NldHMuemVuZGVzay5jb20vZW1iZWRkYWJsZV9mcmFtZXdvcmsvbWFpbi5qc1wiLCBjb25maWcuc2l0ZSk7XHJcblxyXG4gICAgICAgIHpPLndpZGdldCA9IHdpbmRvdy56RW1iZWQ7XHJcbiAgICAgICAgek8ubG9naWMgPSB3aW5kb3cuekU7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KClcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy56RTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVc2VyKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5pZGVudGlmeSh7IG5hbWU6IHRoaXMudXNlci5mdWxsTmFtZSwgZW1haWw6IHRoaXMudXNlci5lbWFpbCB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNvbnN0IHplbkRlc2sgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcblxyXG4gICAgcmV0dXJuIHpPO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBaZW5EZXNrOyIsImNsYXNzIEludGVncmF0aW9uc0Jhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XHJcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xyXG5cdH1cclxuXHRcclxuXHRpbml0KCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdGdldCBpbnRlZ3JhdGlvbigpIHtcclxuXHRcdHJldHVybiB7fTtcclxuXHR9XHJcblx0XHJcblx0c2V0VXNlcigpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRzZW5kRXZlbnQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRsb2dvdXQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zQmFzZTsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBHb29nbGUgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcclxuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xyXG4gICAgfSkoKTtcclxuICAgICAgXHJcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcclxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAnZ3RtLnN0YXJ0JzpcclxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXHJcbiAgICAgIH0pOyBsZXQgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XHJcbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCB0aGlzLmNvbmZpZy50YWdtYW5hZ2VyKTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcclxuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcclxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcclxuICAgIHJldHVybiB0aGlzLmdhO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHN1cGVyLmluaXQoKTtcclxuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xyXG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG4gICAgaWYoZG9tYWluLnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XHJcbiAgICAgIG1vZGUgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdjcmVhdGUnLCB0aGlzLmNvbmZpZy5hbmFseXRpY3MsIG1vZGUpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcigpIHtcclxuICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsICd1c2VySWQnLCB0aGlzLnVzZXIudXNlcklkKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgaWYgKHNvdXJjZSAmJiB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCB2YWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xyXG4gICAgICAgICAgICBwYWdlOiBwYXRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRFdmVudChldmVudCwgc291cmNlLCB0eXBlLCB1cmwpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcclxuXHJcblxyXG4iLCJjb25zdCByaW90ID0gd2luZG93LnJpb3RcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xyXG5jb25zdCBwYWdlQm9keSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZS1ib2R5LmpzJylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbmNvbnN0IEFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FjdGlvbi5qcycpXHJcbmNvbnN0IE1ldHJvbmljID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvbWV0cm9uaWMnKVxyXG5jb25zdCBMYXlvdXQgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9sYXlvdXQnKVxyXG5jb25zdCBEZW1vID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvZGVtbycpXHJcblxyXG5cclxuY2xhc3MgUGFnZUZhY3Rvcnkge1xyXG4gICAgY29uc3RydWN0b3IoZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBuZXcgQWN0aW9ucyhtZXRhRmlyZSwgZXZlbnRlciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTfWApLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudCgnKicpO1xyXG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmNvbmZpZ3VyZSh7IHBhcmVudDogYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTX05FWFR9YCB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0KCk7IC8vIGluaXQgbWV0cm9uaWMgY29yZSBjb21wb25ldHNcclxuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdCgpOyAvLyBpbml0IGxheW91dFxyXG4gICAgICAgICAgICAgICAgICAgIERlbW8uaW5pdCgpOyAvLyBpbml0IGRlbW8gZmVhdHVyZXNcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMjUwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlKHBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcykge1xyXG4gICAgICAgIGxldCBhY3QgPSB0aGlzLmFjdGlvbnMuYWN0KHBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgaWYgKCFhY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKHBhdGgsIHBhdGgsIHsgaWQ6IGlkLCBhY3Rpb246IGFjdGlvbiB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWdlRmFjdG9yeTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDYW52YXMgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJyk7XHJcbnJlcXVpcmUoJy4vbm9kZScpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodCBqdGstZGVtby1tYWluXCIgc3R5bGU9XCJwYWRkaW5nOiAwOyBcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJqdGstZGVtby1jYW52YXMgY2FudmFzLXdpZGVcIiBpZD1cImRpYWdyYW1cIj5cclxuXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtZXRhLWNhbnZhcycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMubWFwSWQgPSBudWxsO1xyXG4gICAgdGhpcy5jYW52YXMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuYnVpbGRDYW52YXMgPSAobWFwKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhbnZhcykge1xyXG4gICAgICAgICAgICAkKHRoaXMuZGlhZ3JhbSkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9ICQodGhpcy5kaWFncmFtKS53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gICQodGhpcy5kaWFncmFtKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB4TG9jID0gd2lkdGgvMiAtIDI1LFxyXG4gICAgICAgICAgICAgICAgeUxvYyA9IDEwMDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbmV3IENhbnZhcyhtYXAsIHRoaXMubWFwSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG1hcC5jaGFuZ2VkX2J5ICE9IE1ldGFNYXAuVXNlci51c2VyS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkID0gKG9wdHMpID0+IHtcclxuICAgICAgICBpZiAob3B0cy5pZCAhPSB0aGlzLm1hcElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYG1hcHMvZGF0YS8ke3RoaXMubWFwSWR9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XHJcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWFwcy9kYXRhLyR7b3B0cy5pZH1gLCB0aGlzLmJ1aWxkQ2FudmFzKTtcclxuICAgICAgICAgICAgTWV0YU1hcC5FdmVudGVyLmZvcmdldCgnbWFwJywgdGhpcy5idWlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgnbWFwJywgdGhpcy5idWlsZCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0SGVpZ2h0ID0gKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5kaWFncmFtKS5jc3Moe1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCArICdweCdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJyk7XHJcblxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuYFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbm9kZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuY29uc3QgUHMgPSByZXF1aXJlKCdwZXJmZWN0LXNjcm9sbGJhcicpO1xyXG5cclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhci13cmFwcGVyXCIgc3R5bGU9XCJ7IGdldERpc3BsYXkoKSB9XCI+XHJcbiAgICA8ZGl2IGlkPVwiY2hhdF9zaGVsbFwiIGNsYXNzPVwicGFnZS1zaWRlYmFyIHBhbmVsXCIgZGF0YS1rZWVwLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWF1dG8tc2Nyb2xsPVwidHJ1ZVwiIGRhdGEtc2xpZGUtc3BlZWQ9XCIyMDBcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiYm90X3RpdGxlXCIgY2xhc3M9XCJwYW5lbC10aXRsZSBjaGF0LXdlbGNvbWVcIj5Db3J0ZXggTWFuPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZD1cImNoYXRfYm9keVwiIGNsYXNzPVwicGFuZWwtYm9keVwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiPlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJtZWRpYS1saXN0IGV4YW1wbGUtY2hhdC1tZXNzYWdlc1wiIGlkPVwiZXhhbXBsZS1tZXNzYWdlc1wiPlxyXG4gICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lc3NhZ2VzIH1cIiBjbGFzcz1cIm1lZGlhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInB1bGwteyBsZWZ0OiBhdXRob3IgPT0gJ2NvcnRleCcsIHJpZ2h0OiBhdXRob3IgIT0gJ2NvcnRleCcgfVwiIGhyZWY9XCIjXCI+PGltZyBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cIm1lZGlhLW9iamVjdCBpbWctY2lyY2xlXCIgc3JjPVwieyBwaWN0dXJlIH1cIj48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keSBidWJibGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IG1lc3NhZ2UgfVwiPjwvcmF3PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbCBjbGFzcz1cInRleHQtbXV0ZWRcIj48YnI+eyBwYXJlbnQuZ2V0UmVsYXRpdmVUaW1lKHRpbWUpIH08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtZm9vdGVyXCIgc3R5bGU9XCJwb3NpdGlvbjogZml4ZWQ7IHdpZHRoOiAyMzNweDsgYm90dG9tOiAyNnB4O1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJjaGF0X2lucHV0X2Zvcm1cIiBvbnN1Ym1pdD1cInsgb25TdWJtaXQgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNoYXRfaW5wdXRcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBtZXNzYWdlLi4uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYmx1ZVwiIHR5cGU9XCJzdWJtaXRcIj5TZW5kPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYFxyXG5cclxucmlvdC50YWcoJ2NoYXQnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIHRoaXMuY29ydGV4UGljdHVyZSA9ICdzcmMvaW1hZ2VzL2NvcnRleC1hdmF0YXItc21hbGwuanBnJztcclxuICAgIHRoaXMubWVzc2FnZXMgPSBbe1xyXG4gICAgICAgIG1lc3NhZ2U6IGBIZWxsbywgSSdtIENvcnRleCBNYW4uIEFzayBtZSBhbnl0aGluZy4gVHJ5IDxjb2RlPi9oZWxwPC9jb2RlPiBpZiB5b3UgZ2V0IGxvc3QuYCxcclxuICAgICAgICBhdXRob3I6ICdjb3J0ZXgnLFxyXG4gICAgICAgIHBpY3R1cmU6IHRoaXMuY29ydGV4UGljdHVyZSxcclxuICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpXHJcbiAgICB9XTtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmNoYXRfc2hlbGwuc3R5bGUuaGVpZ2h0ID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCkgKyAncHgnXHJcbiAgICAgICAgdGhpcy5jaGF0X2JvZHkuc3R5bGUuaGVpZ2h0ID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDI2NykgKyAncHgnXHJcbiAgICAgICAgUHMudXBkYXRlKHRoaXMuY2hhdF9ib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIFBzLmluaXRpYWxpemUodGhpcy5jaGF0X2JvZHkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0UmVsYXRpdmVUaW1lID0gKGRhdGUgPSBuZXcgRGF0ZSgpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblN1Ym1pdCA9IChvYmopID0+IHtcclxuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmNoYXRfaW5wdXQudmFsdWUsXHJcbiAgICAgICAgICAgIGF1dGhvcjogTWV0YU1hcC5Vc2VyLnVzZXJOYW1lLFxyXG4gICAgICAgICAgICBwaWN0dXJlOiBNZXRhTWFwLlVzZXIucGljdHVyZSxcclxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5wdXNoKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFlvdSBhc2tlZCBtZSAke3RoaXMuY2hhdF9pbnB1dC52YWx1ZX0uIFRoYXQncyBncmVhdCFgLFxyXG4gICAgICAgICAgICBhdXRob3I6ICdjb3J0ZXgnLFxyXG4gICAgICAgICAgICBwaWN0dXJlOiB0aGlzLmNvcnRleFBpY3R1cmUsXHJcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuY2hhdF9pbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLmNoYXRfYm9keS5zY3JvbGxUb3AgPSB0aGlzLmNoYXRfYm9keS5zY3JvbGxIZWlnaHRcclxuICAgICAgICBQcy51cGRhdGUodGhpcy5jaGF0X2JvZHkpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2dnbGUgPSAoc3RhdGUpID0+IHtcclxuICAgICAgICB0aGlzLmRpc3BsYXkgPSBzdGF0ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICBNZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTilcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2dnbGUoZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2dnbGUodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCd0eXBlYWhlYWQuanMnKVxyXG5yZXF1aXJlKCdib290c3RyYXAtc2VsZWN0JylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuLi8uLi90b29scy9zaGltcycpO1xyXG5jb25zdCBTaGFyaW5nID0gcmVxdWlyZSgnLi4vLi4vYXBwL1NoYXJpbmcnKVxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cInNoYXJlX21vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGEgaWQ9XCJzaGFyZV9wdWJsaWNfbGlua1wiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmbG9hdDogcmlnaHQ7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCJcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLWNsaXBib2FyZC10ZXh0PVwie3dpbmRvdy5sb2NhdGlvbi5ob3N0KycvJyt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUrJy9tYXBzLycrb3B0cy5tYXAuaWR9XCJcclxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBnZXRQdWJsaWNMaW5rIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgR2V0IHNoYXJhYmxlIGxpbmsgIDxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT48L2E+XHJcbiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPlNoYXJlIHdpdGggb3RoZXJzPC9oND5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8cD5QZW9wbGU8L3A+XHJcbiAgICAgICAgICAgICAgICA8Zm9ybSByb2xlPVwiZm9ybVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cInNoYXJlX3R5cGVhaGVhZFwiIGNsYXNzPVwiY29sLW1kLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBzdHlsZT1cImhlaWdodDogMzVweDtcIiBpZD1cInNoYXJlX2lucHV0XCIgY2xhc3M9XCJ0eXBlYWhlYWQgZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkVudGVyIG5hbWVzIG9yIGVtYWlsIGFkZHJlc3Nlcy4uLlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNoYXJlX3Blcm1pc3Npb25cIiBjbGFzcz1cInNlbGVjdHBpY2tlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlYWRcIiBkYXRhLWNvbnRlbnQ9XCI8c3Bhbj48aSBjbGFzcz0nZmEgZmEtZXllJz48L2k+IENhbiB2aWV3PC9zcGFuPlwiPkNhbiB2aWV3PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid3JpdGVcIiBkYXRhLWNvbnRlbnQ9XCI8c3Bhbj48aSBjbGFzcz0nZmEgZmEtcGVuY2lsJz48L2k+IENhbiBlZGl0PC9zcGFuPlwiPkNhbiBlZGl0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZD1cInNoYXJlX2J1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1pY29uLW9ubHkgZ3JlZW5cIiBvbmNsaWNrPVwieyBvblNoYXJlIH1cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlmPVwieyBvcHRzICYmIG9wdHMubWFwICYmIG9wdHMubWFwLnNoYXJlZF93aXRofVwiIGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImxhYmVsIGxhYmVsLWRlZmF1bHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiA1cHg7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZj1cInsgaSAhPSAnYWRtaW4nICYmICh2YWwud3JpdGUgfHwgdmFsLnJlYWQpIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGksIHZhbCBpbiBvcHRzLm1hcC5zaGFyZWRfd2l0aH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBpZj1cInsgdmFsLndyaXRlIH1cIiBjbGFzcz1cImZhIGZhLXBlbmNpbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBpZj1cInsgIXZhbC53cml0ZSB9XCIgY2xhc3M9XCJmYSBmYS1leWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWwubmFtZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25VblNoYXJlIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5Eb25lPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc2hhcmUnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJylcclxuICAgIGNvbnN0IHNoYXJlID0gbmV3IFNoYXJpbmcoTWV0YU1hcC5Vc2VyKVxyXG5cclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG5cclxuICAgIHRoaXMuZ2V0UHVibGljTGluayA9IChlLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblNoYXJlID0gKGUsIG9wdHMpID0+IHtcclxuICAgICAgICB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW3RoaXMuc3VnZ2VzdGlvbi5pZF0gPSB7XHJcbiAgICAgICAgICAgIHJlYWQ6IHRoaXMucGlja2VyLnZhbCgpID09ICdyZWFkJyB8fCB0aGlzLnBpY2tlci52YWwoKSA9PSAnd3JpdGUnLFxyXG4gICAgICAgICAgICB3cml0ZTogdGhpcy5waWNrZXIudmFsKCkgPT0gJ3dyaXRlJyxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy5zdWdnZXN0aW9uLm5hbWUsXHJcbiAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMuc3VnZ2VzdGlvbi5waWN0dXJlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNoYXJlLmFkZFNoYXJlKHRoaXMub3B0cy5tYXAsIHRoaXMuc3VnZ2VzdGlvbiwgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLnN1Z2dlc3Rpb24uaWRdKVxyXG5cclxuICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBudWxsXHJcbiAgICAgICAgdGhpcy50YS50eXBlYWhlYWQoJ3ZhbCcsICcnKVxyXG4gICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLmhpZGUoKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25VblNoYXJlID0gKGUsIG9wdHMpID0+IHtcclxuICAgICAgICBlLml0ZW0udmFsLmlkID0gZS5pdGVtLmlcclxuICAgICAgICBkZWxldGUgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFtlLml0ZW0uaV1cclxuICAgICAgICBzaGFyZS5yZW1vdmVTaGFyZSh0aGlzLm9wdHMubWFwLCBlLml0ZW0udmFsKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsIChvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKG9wdHMpIHtcclxuICAgICAgICAgICAgXy5leHRlbmQodGhpcy5vcHRzLCBvcHRzKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKGUsIG9wdHMpID0+IHtcclxuICAgICAgICAkKHRoaXMuc2hhcmVfbW9kYWwpLm1vZGFsKCdzaG93JylcclxuICAgICAgICB0aGlzLnRhID0gJCgnI3NoYXJlX3R5cGVhaGVhZCAudHlwZWFoZWFkJykudHlwZWFoZWFkKHtcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSx7XHJcbiAgICAgICAgICAgIHNvdXJjZTogKHF1ZXJ5LCBzeW5jTWV0aG9kLCBhc3luY01ldGhvZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1ldGFtYXAuY28vdXNlcnMvZmluZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJJZDogTWV0YU1hcC5Vc2VyLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbklkOiBNZXRhTWFwLkF1dGgwLmN0b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRVc2VyczogXy5rZXlzKHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IHF1ZXJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICcqJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6ICdzcmMvaW1hZ2VzL3dvcmxkLWdsb2JlLmpwZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUHVibGljJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luY01ldGhvZChkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmoubmFtZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICBlbXB0eTogW1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJwYWRkaW5nOiA1cHggMTBweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ1VuYWJsZSB0byBmaW5kIGFueSB1c2VycyBtYXRjaGluZyB0aGlzIHF1ZXJ5JyxcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICBdLmpvaW4oJ1xcbicpLFxyXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbjogKHZhbHVlKSA9PiB7IHJldHVybiBgPGRpdj48aW1nIGFsdD1cIiR7dmFsdWUubmFtZX1cIiBoZWlnaHQ9XCIzMFwiIHdpZHRoPVwiMzBcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCIke3ZhbHVlLnBpY3R1cmV9XCI+ICR7dmFsdWUubmFtZX08L2Rpdj5gIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50YS5vbigndHlwZWFoZWFkOnNlbGVjdCcsIChldiwgc3VnZ2VzdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXHJcbiAgICAgICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLnNob3coKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50YS5vbigndHlwZWFoZWFkOmF1dG9jb21wbGV0ZScsIChldiwgc3VnZ2VzdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXHJcbiAgICAgICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLnNob3coKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5waWNrZXIgPSAkKCcuc2VsZWN0cGlja2VyJykuc2VsZWN0cGlja2VyKHtcclxuICAgICAgICAgICAgd2lkdGg6ICdhdXRvJ1xyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdyYWR1YXRpb24tY2FwXCI+PC9pPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNzBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IGhlbHAgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGhlbHAgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1oZWxwJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oZWxwID0gbnVsbDtcclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvaGVscCcsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVscCA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuLi8uLi90b29scy9zaGltcycpXHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWJlbGwtb1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBub3RpZmljYXRpb25zLmxlbmd0aCB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV4dGVybmFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IG5vdGlmaWNhdGlvbnMubGVuZ3RoIH0gcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9ueyBzOiBub3RpZmljYXRpb25zLmxlbmd0aCA9PSAwIHx8IG5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyBhbGxOb3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyB0cnVlICE9IGFyY2hpdmVkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IHZhbCwgaSBpbiBub3RpZmljYXRpb25zIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWY9XCJ7IHZhbCAmJiB2YWwucGhvdG8gfVwiIGNsYXNzPVwicGhvdG9cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cInsgdmFsLnBob3RvIH1cIiBjbGFzcz1cImltZy1jaXJjbGVcIiBhbHQ9XCJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN1YmplY3RcIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImZyb21cIj57IHZhbC5mcm9tIH08L3NwYW4+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJ0aW1lXCIgc3R5bGU9XCJwYWRkaW5nOiAwO1wiPnsgcGFyZW50LmdldFRpbWUodmFsLnRpbWUpIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtZXNzYWdlXCI+eyB2YWwuZXZlbnQgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtbm90aWZpY2F0aW9ucycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIGNvbnN0IGZiUGF0aCA9IENPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQoTWV0YU1hcC5Vc2VyLnVzZXJJZClcclxuXHJcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBbXTtcclxuICAgIHRoaXMuYWxsTm90aWZpY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSBldmVudC5pdGVtLnZhbFxyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YSh0cnVlLCBgJHtmYlBhdGh9LyR7aXRlbS5pZH0vYXJjaGl2ZWApXHJcbiAgICAgICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuTk9USUZJQ0FUSU9OLk1BUDpcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHtpdGVtLm1hcElkfWApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0VGltZSA9ICh0aW1lKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZSh0aW1lKSkuZnJvbU5vdygpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGZiUGF0aClcclxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUucHVzaERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudDogJ1lvdSBzaWduZWQgdXAgZm9yIE1ldGFNYXAhJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKSB9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjaGl2ZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LCBmYlBhdGgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQoTWV0YU1hcC5Vc2VyLnVzZXJJZCksIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxOb3RpZmljYXRpb25zID0gXy5tYXAoZGF0YSwgKG4sIGlkKSA9PiB7IG4uaWQgPSBpZDsgcmV0dXJuIG47ICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBfLmZpbHRlcihfLnNvcnRCeSh0aGlzLmFsbE5vdGlmaWNhdGlvbnMsICdkYXRlJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtdHJvcGh5XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2Utc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHBvaW50cy5sZW5ndGggfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJib2xkXCI+eyBwb2ludHMubGVuZ3RoIH0gbmV3IDwvc3Bhbj4gYWNoaWV2ZW1lbnR7IHM6IHBvaW50cy5sZW5ndGggPT0gMCB8fCBwb2ludHMubGVuZ3RoID4gMSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBwb2ludHMgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgcG9pbnRzIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZVwiPnsgdGltZSB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRldGFpbHNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBldmVudCB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtcG9pbnRzJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYHVzZXJzLyR7TWV0YU1hcC5Vc2VyLnVzZXJJZH0vcG9pbnRzYCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVzZXJuYW1lIHVzZXJuYW1lLWhpZGUtb24tbW9iaWxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlcm5hbWUgfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGlmPVwieyBwaWN0dXJlIH1cIiBhbHQ9XCJcIiBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCJ7IHBpY3R1cmUgfVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgbWVudSB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgbWVudSB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyBsaW5rIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS11c2VyJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMubWVudSA9IFtdO1xyXG4gICAgdGhpcy51c2VybmFtZSA9ICcnO1xyXG4gICAgdGhpcy5waWN0dXJlID0gJyc7XHJcblxyXG4gICAgdGhpcy5sb2dvdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5sb2dvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxpbmtBY2NvdW50ID0gKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuQXV0aDAubGlua0FjY291bnQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIHN3aXRjaChldmVudC5pdGVtLmxpbmspIHtcclxuICAgICAgICAgICAgY2FzZSAnI2xpbmstc29jaWFsLWFjY291bnRzJzpcclxuICAgICAgICAgICAgICAgIHRoaXMubGlua0FjY291bnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWV0YW1hcC91c2VyYCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IE1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZTtcclxuICAgICAgICAgICAgdGhpcy5waWN0dXJlID0gTWV0YU1hcC5Vc2VyLnBpY3R1cmU7XHJcbiAgICAgICAgICAgIHRoaXMubWVudSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuLi90b29scy9zaGltcycpO1xyXG5jb25zdCBQZXJtaXNzaW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9QZXJtaXNzaW9ucycpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1hY3Rpb25zXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gcmVkLWhhemUgYnRuLXNtIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRkZW4tc20gaGlkZGVuLXhzXCI+QWN0aW9ucyZuYnNwOzwvc3Bhbj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxyXG4gICAgICAgICAgICA8bGkgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEgfVwiIGNsYXNzPVwieyBzdGFydDogaSA9PSAwLCBhY3RpdmU6IGkgPT0gMCB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBpZj1cInsgcGFyZW50LmdldExpbmtBbGxvd2VkKHZhbCkgfVwiIGhyZWY9XCJ7IHBhcmVudC5nZXRBY3Rpb25MaW5rKHZhbCkgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyB2YWwuaWNvbiB9XCI+PC9pPiB7IHZhbC50aXRsZSB9XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxyXG4gICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3NldHRpbmdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1nZWFyXCI+PC9pPiBTZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8c3BhbiBzdHlsZT1cInBhZGRpbmctbGVmdDogNXB4O1wiPlxyXG4gICAgICAgIDxzcGFuIGlmPVwieyBwYWdlTmFtZSB9XCJcclxuICAgICAgICAgICAgICAgIGlkPVwibWFwX25hbWVcIlxyXG4gICAgICAgICAgICAgICAgZGF0YS10eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICBkYXRhLXRpdGxlPVwiRW50ZXIgbWFwIG5hbWVcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPlxyXG4gICAgICAgICAgICB7IHBhZ2VOYW1lIH1cclxuICAgICAgICA8L3NwYW4+XHJcbiAgICA8L3NwYW4+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1hY3Rpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy5wYWdlTmFtZSA9ICdIb21lJztcclxuICAgIHRoaXMudXJsID0gTWV0YU1hcC5jb25maWcuc2l0ZS5kYiArICcuZmlyZWJhc2Vpby5jb20nO1xyXG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuZ2V0QWN0aW9uTGluayA9IChvYmopID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gb2JqLmxpbms7XHJcbiAgICAgICAgaWYgKG9iai51cmxfcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gW107XHJcbiAgICAgICAgICAgIF8uZWFjaChvYmoudXJsX3BhcmFtcywgKHBybSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKHRoaXNbcHJtLm5hbWVdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldCA9IG9iai5saW5rLmZvcm1hdC5jYWxsKG9iai5saW5rLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldExpbmtBbGxvd2VkID0gKG9iaikgPT4ge1xyXG4gICAgICAgIGxldCByZXQgPSB0cnVlID09IG9ialsnYWxsb3dlZC1vbiddWycqJ107XHJcbiAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gTWV0YU1hcC5Sb3V0ZXIuY3VycmVudFBhdGg7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bY3VycmVudFBhZ2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmV0ICYmIHRoaXMubWFwICYmIHBlcm1pc3Npb25zKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAob2JqLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdTaGFyZSBNYXAnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnRGVsZXRlIE1hcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGVybWlzc2lvbnMuaXNNYXBPd25lcigpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVBhZ2VOYW1lID0gKG1hcCkgPT4ge1xyXG4gICAgICAgIHBlcm1pc3Npb25zID0gbmV3IFBlcm1pc3Npb25zKG1hcClcclxuICAgICAgICB0aGlzLm1hcCA9IG1hcCB8fCB7fVxyXG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pc01hcE93bmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG1hcC5uYW1lIHx8ICcnXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG1hcC5uYW1lICsgJyAoU2hhcmVkIGJ5ICcgKyBtYXAub3duZXIubmFtZSArICcpJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVybWlzc2lvbnMgJiYgcGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5tYXBfbmFtZSkuZWRpdGFibGUoeyB1bnNhdmVkY2xhc3M6IG51bGwgfSkub24oJ3NhdmUnLCAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH0vbmFtZWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubG9hZGVkKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5tYXBfbmFtZSkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH1gKTtcclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG51bGxcclxuICAgICAgICAgICAgdGhpcy5tYXAgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRzLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFwSWQgPSBvcHRzLmlkO1xyXG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke29wdHMuaWR9YCwgKG1hcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlTmFtZShtYXApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhZ2VOYW1lID0gb3B0cy5uYW1lIHx8ICdIb21lJztcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9hY3Rpb25zJywgKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZUhlYWRlciA9IHJlcXVpcmUoJy4vcGFnZS1oZWFkZXInKTtcclxuY29uc3QgcGFnZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vcGFnZS1jb250YWluZXInKTtcclxuY29uc3QgcGFnZUZvb3RlciA9IHJlcXVpcmUoJy4vcGFnZS1mb290ZXInKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cInBhZ2VfYm9keVwiIGNsYXNzPVwicGFnZS1oZWFkZXItZml4ZWQgcGFnZS1zaWRlYmFyLW9wZW5cIj5cclxuXHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2hlYWRlclwiPjwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250YWluZXJcIj48L2Rpdj5cclxuXHJcbjwvZGl2PmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWJvZHknLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2hlYWRlciwgJ3BhZ2UtaGVhZGVyJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250YWluZXIsICdwYWdlLWNvbnRhaW5lcicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5wYWdlX2JvZHkpLmFkZENsYXNzKCdwYWdlLXNpZGViYXItcmV2ZXJzZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5wYWdlX2JvZHkpLnJlbW92ZUNsYXNzKCdwYWdlLXNpZGViYXItcmV2ZXJzZWQnKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZVNpZGViYXIgPSByZXF1aXJlKCcuL3BhZ2Utc2lkZWJhcicpO1xyXG5jb25zdCBjaGF0ID0gcmVxdWlyZSgnLi9jb3J0ZXgvY2hhdCcpXHJcbmNvbnN0IHBhZ2VDb250ZW50ID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRlbnQnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9zaWRlYmFyXCI+PC9kaXY+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2NvbnRlbnRcIj48L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvbnRhaW5lcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2Vfc2lkZWJhciwgJ2NoYXQnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2NvbnRlbnQsICdwYWdlLWNvbnRlbnQnKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRlbnQtd3JhcHBlclwiPlxyXG4gICAgPGRpdiBpZD1cInBhZ2UtY29udGVudFwiIGNsYXNzPVwicGFnZS1jb250ZW50XCI+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWhlYWRcIj5cclxuXHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG5cclxuICAgICAgICA8ZGl2IGlkPVwiYXBwLWNvbnRhaW5lclwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY29udGVudCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLmhhc1NpZGViYXIgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMucmVzaXplID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1NpZGViYXIpIHtcclxuICAgICAgICAgICAgJCh0aGlzWydhcHAtY29udGFpbmVyJ10pLmNzcyh7IHdpZHRoOiBgMTAwJWAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHdpZHRoID0gYCR7d2luZG93LmlubmVyV2lkdGggLSA0MH1weGA7XHJcbiAgICAgICAgICAgICQodGhpc1snYXBwLWNvbnRhaW5lciddKS5jc3MoeyB3aWR0aDogd2lkdGggfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzaXplKClcclxuICAgIH0pO1xyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaGFzU2lkZWJhciA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKVxyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaGFzU2lkZWJhciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVzaXplKClcclxuICAgIH0pO1xyXG5cclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1mb290ZXJcIiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAwO1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBhZ2UtZm9vdGVyLWlubmVyXCI+XHJcbiAgICAgICAgPGEgaHJlZj1cIiN0ZXJtc1wiPiZjb3B5OzIwMTU8L2E+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBwYWdlTG9nbyA9IHJlcXVpcmUoJy4vcGFnZS1sb2dvLmpzJyk7XHJcbmNvbnN0IHBhZ2VBY3Rpb25zID0gcmVxdWlyZSgnLi9wYWdlLWFjdGlvbnMuanMnKTtcclxuY29uc3QgcGFnZVNlYXJjaCA9IHJlcXVpcmUoJy4vcGFnZS1zZWFyY2guanMnKTtcclxuY29uc3QgcGFnZVRvcE1lbnUgPSByZXF1aXJlKCcuL3BhZ2UtdG9wbWVudScpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cImhlYWRlci10b3BcIiBjbGFzcz1cInBhZ2UtaGVhZGVyIG5hdmJhciBuYXZiYXItZml4ZWQtdG9wXCI+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wcm9ncmVzc19uZXh0XCIgc3R5bGU9XCJvdmVyZmxvdzogaW5oZXJpdDtcIj48L2Rpdj5cclxuICAgIDxkaXYgaWQ9XCJoZWFkZXItY29udGVudFwiIGNsYXNzPVwicGFnZS1oZWFkZXItaW5uZXJcIj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9sb2dvXCI+PC9kaXY+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9hY3Rpb25zXCI+PC9kaXY+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV90b3BcIiBjbGFzcz1cInBhZ2UtdG9wXCI+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2Vfc2VhcmNoXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcG1lbnVcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1oZWFkZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2xvZ28sICdwYWdlLWxvZ28nKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2FjdGlvbnMsICdwYWdlLWFjdGlvbnMnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3RvcCwgJ3BhZ2Utc2VhcmNoJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV90b3AsICdwYWdlLXRvcG1lbnUnKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcyA9XCJwYWdlLWxvZ29cIj5cclxuICAgIDxhIGlkPVwibWV0YV9sb2dvXCIgaHJlZj1cIiNob21lXCI+XHJcbiAgICAgICAgPGltZyBzcmM9XCJzcmMvaW1hZ2VzL21ldGFtYXBfY2xvdWQucG5nXCIgYWx0PVwibG9nb1wiIGNsYXNzID1cImxvZ28tZGVmYXVsdFwiIC8+XHJcbiAgICA8L2E+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9tZW51X3RvZ2dsZVwiIGNsYXNzPVwibWVudS10b2dnbGVyIHNpZGViYXItdG9nZ2xlclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiIHN0eWxlPVwidmlzaWJpbGl0eTp7IGdldERpc3BsYXkoKSB9O1wiPlxyXG4gICAgICAgIDwhLS1ET0M6IFJlbW92ZSB0aGUgYWJvdmUgXCJoaWRlXCIgdG8gZW5hYmxlIHRoZSBzaWRlYmFyIHRvZ2dsZXIgYnV0dG9uIG9uIGhlYWRlci0tPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG48YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3MgPVwibWVudS10b2dnbGVyIHJlc3BvbnNpdmUtdG9nZ2xlclwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj5cclxuPC9hPlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1sb2dvJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoZWwpID0+IHtcclxuXHJcbiAgICAgICAgaWYoTWV0YU1hcCAmJiBNZXRhTWFwLlJvdXRlciAmJiBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aCA9PSAnbWFwJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3Zpc2libGUnXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICdoaWRkZW4nXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgncGFnZU5hbWUnLCAob3B0cykgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH0pXHJcblxyXG4vL1xyXG4vLyAgICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4vLyAgICAgICAgIHRoaXMuZGlzcGxheSA9IGZhbHNlO1xyXG4vLyAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbi8vICAgICB9KTtcclxuLy9cclxuLy9cclxuLy8gICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4vLyAgICAgICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XHJcbi8vICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuLy8gICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjwhLS0gRE9DOiBBcHBseSBcInNlYXJjaC1mb3JtLWV4cGFuZGVkXCIgcmlnaHQgYWZ0ZXIgdGhlIFwic2VhcmNoLWZvcm1cIiBjbGFzcyB0byBoYXZlIGhhbGYgZXhwYW5kZWQgc2VhcmNoIGJveCAtLT5cclxuPGZvcm0gY2xhc3M9XCJzZWFyY2gtZm9ybVwiIGFjdGlvbj1cImV4dHJhX3NlYXJjaC5odG1sXCIgbWV0aG9kPVwiR0VUXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoLi4uXCIgbmFtZT1cInF1ZXJ5XCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJidG4gc3VibWl0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zZWFyY2hcIj48L2k+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuPC9mb3JtPlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1zZWFyY2gnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICBcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhci13cmFwcGVyXCIgc3R5bGU9XCJ7IGdldERpc3BsYXkoKSB9XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyIG5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cInBhZ2Utc2lkZWJhci1tZW51IFwiIGRhdGEta2VlcC1leHBhbmRlZD1cImZhbHNlXCIgZGF0YS1hdXRvLXNjcm9sbD1cInRydWVcIiBkYXRhLXNsaWRlLXNwZWVkPVwiMjAwXCI+XHJcblxyXG4gICAgICAgICAgICA8bGkgaWY9XCJ7IGRhdGEgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5jbGljayB9XCIgZWFjaD1cInsgZGF0YSB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBpZj1cInsgaWNvbiB9XCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIiBzdHlsZT1cImNvbG9yOiN7IGNvbG9yIH07XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ7IGFycm93OiBtZW51Lmxlbmd0aCB9XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGlmPVwieyBtZW51ICYmIG1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cInN1Yi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lbnUgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG5cclxuICAgICAgICA8L3VsPlxyXG5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2Utc2lkZWJhcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuY2xpY2sgPSBmdW5jdGlvbigpIHsgY29uc29sZS5sb2coJ2ZvbycpIH1cclxuICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XHJcbiAgICB0aGlzLmRhdGEgPSBbXTtcclxuXHJcbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL3NpZGViYXInLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoaW5jbHVkZSAmJiBkLm1lbnUgJiYgZC5tZW51KSB7XHJcbiAgICAgICAgICAgICAgICBkLm1lbnUgPSBfLmZpbHRlcihfLnNvcnRCeShkLm1lbnUsICdvcmRlcicpLCAobSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgdGhpcy5nZXREaXNwbGF5ID0gKCkgPT4ge1xyXG4gICAgICAgIGlmKCF0aGlzLmRpc3BsYXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdkaXNwbGF5OiBub25lOyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sICgpID0+IHtcclxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcblxyXG5jb25zdCBtZXRhUG9pbnRzID0gcmVxdWlyZSgnLi9tZW51L21ldGEtcG9pbnRzLmpzJyk7XHJcbmNvbnN0IG1ldGFIZWxwID0gcmVxdWlyZSgnLi9tZW51L21ldGEtaGVscC5qcycpO1xyXG5jb25zdCBtZXRhVXNlciA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLXVzZXIuanMnKTtcclxuY29uc3QgbWV0YU5vdCA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLW5vdGlmaWNhdGlvbnMuanMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJ0b3AtbWVudVwiPlxyXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgcHVsbC1yaWdodFwiPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiIGlkPVwiaGVhZGVyX2Rhc2hib2FyZF9iYXJcIiBvbmNsaWNrPVwieyBvbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBocmVmPVwiI2hvbWVcIj5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtaG9tZVwiPjwvaT5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIiBpZD1cImhlYWRlcl9ub3RpZmljYXRpb25fYmFyXCI+PC9saT5cclxuXHJcbmBcclxuICAgICAgICAgICAgLy8gPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgICAgICAvLyA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIiBpZD1cImhlYWRlcl9wb2ludHNfYmFyXCI+PC9saT5cclxuKyBgXHJcblxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgaWQ9XCJoZWFkZXJfaGVscF9iYXJcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiPjwvbGk+XHJcblxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgaWQ9XCJoZWFkZXJfdXNlcl9tZW51XCIgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi11c2VyIGRyb3Bkb3duXCI+PC9saT5cclxuICAgIDwvdWw+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS10b3BtZW51JywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICAvL1RPRE86IHJlc3RvcmUgbm90aWZpY2F0aW9ucyB3aGVuIGxvZ2ljIGlzIGNvbXBsZXRlXHJcbiAgICAgICAgLy9yaW90Lm1vdW50KHRoaXMuaGVhZGVyX3BvaW50c19iYXIsICdtZXRhLXBvaW50cycpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfbm90aWZpY2F0aW9uX2JhciwgJ21ldGEtbm90aWZpY2F0aW9ucycpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfaGVscF9iYXIsICdtZXRhLWhlbHAnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMuaGVhZGVyX3VzZXJfbWVudSwgJ21ldGEtdXNlcicpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT57IGhlYWRlci50aXRsZSB9PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgaGVhZGVyLnRleHQgfTwvcD5cclxuXHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGFyZWFzIH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPGI+eyB0aXRsZSB9PC9iPiB7IHRleHQgfVxyXG5cdFx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHRcdFx0XHRcdDwhLS0gQmxvY2txdW90ZXMgLS0+XHJcblx0XHRcdFx0XHRcdFx0PGJsb2NrcXVvdGUgY2xhc3M9XCJoZXJvXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cD57IHF1b3RlLnRleHQgfTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdDxzbWFsbD57IHF1b3RlLmJ5IH08L3NtYWxsPlxyXG5cdFx0XHRcdFx0XHRcdDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZGR0aGlzX2hvcml6b250YWxfZm9sbG93X3Rvb2xib3hcIj48L2Rpdj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3MgPVwiY29sLW1kLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIGlmPVwieyBoZWFkZXIueW91dHViZWlkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwieXRwbGF5ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0L2h0bWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgaGVhZGVyLnlvdXR1YmVpZCB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcyA9XCJmaXR2aWRzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImhlaWdodDogMzI3cHg7IHdpZHRoOiAxMDAlOyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bzsgYnJvZGVyOiAwO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG5cdFx0XHRcdFx0XHRcdDwvaWZyYW1lPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxyXG5cdFx0XHRcdFx0XHQ8aDM+eyB1c2VyTmFtZSB9eyB2aXNpb24udGl0bGUgfTwvaDM+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57IHZpc2lvbi50ZXh0IH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnaG9tZScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuYXJlYXMgPSBbXVxyXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5IT01FLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuYXJlYXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLmFyZWFzLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5xdW90ZSA9IGRhdGEucXVvdGU7XHJcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcclxuICAgICAgICB0aGlzLnZpc2lvbiA9IGRhdGEudmlzaW9uO1xyXG5cclxuICAgICAgICB0aGlzLnVzZXJOYW1lID0gTWV0YU1hcC5Vc2VyLmZ1bGxOYW1lO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzJylcclxucmVxdWlyZSgnZGF0YXRhYmxlcy1ib290c3RyYXAzLXBsdWdpbicpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IHJhdyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvcmF3Jyk7XHJcbmNvbnN0IFNoYXJlTWFwID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9TaGFyZU1hcCcpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwibXlfbWFwc19wYWdlXCIgY2xhc3M9XCJwb3J0bGV0IGJveCBncmV5LWNhc2NhZGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LXRpdGxlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1pY29uLXRoLWxhcmdlXCI+PC9pPk1ldGFNYXBzXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZj1cInsgbWVudSB9XCIgY2xhc3M9XCJhY3Rpb25zXCI+XHJcbiAgICAgICAgICAgIDxhIGVhY2g9XCJ7IG1lbnUuYnV0dG9ucyB9XCIgaHJlZj1cInsgbGluayB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQWN0aW9uQ2xpY2sgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNvZ3NcIj48L2k+IFRvb2xzIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBlYWNoPVwieyBtZW51Lm1lbnUgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk1lbnVDbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnMgcG9ydGxldC10YWJzXCI+XHJcbiAgICAgICAgICAgIDxsaSBvbmNsaWNrPVwieyBwYXJlbnQub25UYWJTd2l0Y2ggfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInsgYWN0aXZlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNteW1hcHNfMV97IGkgfVwiIGRhdGEtdG9nZ2xlPVwidGFiXCIgYXJpYS1leHBhbmRlZD1cInsgdHJ1ZTogaSA9PSAwIH1cIj5cclxuICAgICAgICAgICAgICAgIHsgdmFsLnRpdGxlIH08L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGUtdG9vbGJhclwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ0YWItcGFuZSBmYXNlIGluIHsgYWN0aXZlOiBpID09IDAgfVwiIGlkPVwibXltYXBzXzFfeyBpIH1cIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQgdGFibGUtaG92ZXJcIiBpZD1cIm15bWFwc190YWJsZV97IGkgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwidGFibGUtY2hlY2tib3hcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiZ3JvdXAtY2hlY2thYmxlXCIgZGF0YS1zZXQ9XCIjbXltYXBzX3RhYmxlX3sgaSB9IC5jaGVja2JveGVzXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVkIE9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPd25lclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGlmPVwieyBwYXJlbnQuZGF0YSAmJiBwYXJlbnQuZGF0YVtpXSB9XCIgZWFjaD1cInsgcGFyZW50LmRhdGFbaV0gfVwiIGNsYXNzPVwib2RkIGdyYWRlWFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB8fCBwYXJlbnQudXNlci5pc0FkbWluIH1cIiB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNoZWNrYm94ZXNcIiB2YWx1ZT1cIjFcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNtIGJsdWUgZmlsdGVyLXN1Ym1pdFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk9wZW4gfVwiPk9wZW48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vblNoYXJlIH1cIj5TaGFyZSA8aSBjbGFzcz1cImZhIGZhLXNoYXJlXCI+PC9pPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZj1cInsgdmFsLnRpdGxlICE9ICdNeSBNYXBzJyB9XCIgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNvcHkgfVwiPkNvcHkgPGkgY2xhc3M9XCJmYSBmYS1jbG9uZVwiPjwvaT48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyBlZGl0YWJsZSB9XCIgY2xhc3M9XCJtZXRhX2VkaXRhYmxlX3sgaSB9XCIgZGF0YS1waz1cInsgaWQgfVwiIGRhdGEtdGl0bGU9XCJFZGl0IE1hcCBOYW1lXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgbmFtZSB9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgIWVkaXRhYmxlIH1cIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj57IGNyZWF0ZWRfYXQgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgcGFyZW50LmdldFN0YXR1cyh0aGlzKSB9XCI+PC9yYXc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IHBhcmVudC5nZXRPd25lcih0aGlzKSB9XCI+PC9yYXc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ215LW1hcHMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcblxyXG4gICAgdGhpcy51c2VyID0gTWV0YU1hcC5Vc2VyO1xyXG4gICAgdGhpcy5kYXRhID0gbnVsbDtcclxuICAgIHRoaXMubWVudSA9IG51bGw7XHJcbiAgICBsZXQgdGFicyA9IFtcclxuICAgICAgICB7IHRpdGxlOiAnTXkgTWFwcycsIG9yZGVyOiAwLCBlZGl0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICAgIHsgdGl0bGU6ICdTaGFyZWQgd2l0aCBNZScsIG9yZGVyOiAxLCBlZGl0YWJsZTogZmFsc2UgfSxcclxuICAgICAgICB7IHRpdGxlOiAnUHVibGljJywgb3JkZXI6IDIsIGVkaXRhYmxlOiBmYWxzZSB9XHJcbiAgICBdO1xyXG4gICAgaWYgKHRoaXMudXNlci5pc0FkbWluKSB7XHJcbiAgICAgICAgdGFicy5wdXNoKHsgdGl0bGU6ICdBbGwgTWFwcycsIG9yZGVyOiAzLCBlZGl0YWJsZTogdHJ1ZSB9KVxyXG4gICAgICAgIHRhYnMucHVzaCh7IHRpdGxlOiAnVGVtcGxhdGVzJywgb3JkZXI6IDQsIGVkaXRhYmxlOiB0cnVlIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLnRhYnMgPSBfLnNvcnRCeSh0YWJzLCAnb3JkZXInKVxyXG5cclxuICAgIHRoaXMuY3VycmVudFRhYiA9ICdNeSBNYXBzJztcclxuXHJcbiAgICAvL1xyXG4gICAgdGhpcy5nZXRTdGF0dXMgPSAoaXRlbSkgPT4ge1xyXG4gICAgICAgIGxldCBzdGF0dXMgPSAnUHJpdmF0ZSdcclxuICAgICAgICBsZXQgY29kZSA9ICdkZWZhdWx0J1xyXG4gICAgICAgIGxldCBodG1sID0gJyc7XHJcbiAgICAgICAgaWYgKGl0ZW0uc2hhcmVkX3dpdGgpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uc2hhcmVkX3dpdGhbJyonXSAmJiAoaXRlbS5zaGFyZWRfd2l0aFsnKiddLnJlYWQgPT0gdHJ1ZSB8fCBpdGVtLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdQdWJsaWMnXHJcbiAgICAgICAgICAgICAgICBjb2RlID0gJ3ByaW1hcnknXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfLmVhY2goaXRlbS5zaGFyZWRfd2l0aCwgKHNoYXJlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hhcmUucGljdHVyZSAmJiBrZXkgIT0gJyonICYmIGtleSAhPSAnYWRtaW4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwibGFiZWwgb3duZXItbGFiZWxcIiBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIiBkYXRhLXBsYWNlbWVudD1cImJvdHRvbVwiIHRpdGxlPVwiJHtzaGFyZS5uYW1lfVwiPjxpbWcgYWx0PVwiJHtzaGFyZS5uYW1lfVwiIGhlaWdodD1cIjMwXCIgd2lkdGg9XCIzMFwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cIiR7c2hhcmUucGljdHVyZX1cIj48L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSAnPHNwYW4gY2xhc3M9XCJcIj5TaGFyZWQgd2l0aDogPC9zcGFuPicgKyBodG1sO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGh0bWwgPSBodG1sIHx8IGA8c3BhbiBjbGFzcz1cImxhYmVsIGxhYmVsLXNtIGxhYmVsLSR7Y29kZX1cIj4ke3N0YXR1c308L3NwYW4+YFxyXG5cclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldE93bmVyID0gKGl0ZW0pID0+IHtcclxuICAgICAgICBsZXQgaHRtbCA9IGA8c3BhbiBjbGFzcz1cImxhYmVsIG93bmVyLWxhYmVsXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1wbGFjZW1lbnQ9XCJib3R0b21cIiB0aXRsZT1cIiR7aXRlbS5vd25lci5uYW1lfVwiPjxpbWcgYWx0PVwiJHtpdGVtLm93bmVyLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtpdGVtLm93bmVyLnBpY3R1cmV9XCI+PC9zcGFuPmBcclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICAvL0V2ZW50c1xyXG4gICAgdGhpcy5vbk9wZW4gPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgbWFwLyR7ZXZlbnQuaXRlbS5pZH1gKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uU2hhcmUgPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICBsZXQgb3B0cyA9IHtcclxuICAgICAgICAgICAgbWFwOiBldmVudC5pdGVtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNoYXJlTWFwLmFjdChvcHRzKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQ29weSA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjb3B5JylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uVGFiU3dpdGNoID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VGFiID0gZXZlbnQuaXRlbS52YWwudGl0bGU7XHJcbiAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xyXG4gICAgICAgICAgICAkKCcub3duZXItbGFiZWwnKS50b29sdGlwKClcclxuICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5jdXJyZW50VGFiKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ015IE1hcHMnOlxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQWN0aW9uQ2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25NZW51Q2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUYWIgPT0gJ015IE1hcHMnKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQuaXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkZWxldGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZU1hcHMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0RlbGV0ZU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJy5hY3RpdmUnKS5maW5kKCcubWFwaWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHNlbGVjdGVkLCAoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChjZWxsLmlubmVySFRNTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlTWFwcy5kZWxldGVBbGwoaWRzLCBDT05TVEFOVFMuUEFHRVMuTVlfTUFQUyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmQgPSB0aGlzW2B0YWJsZTBgXS5maW5kKCd0Ym9keSB0ciAuY2hlY2tib3hlcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmQuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBqUXVlcnkudW5pZm9ybS51cGRhdGUoZmluZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG5cclxuICAgIH0pXHJcblxyXG4gICAgLy9SaW90IGJpbmRpbmdzXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL215bWFwcycsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lbnUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogXy5zb3J0QnkoZGF0YS5idXR0b25zLCAnb3JkZXInKSxcclxuICAgICAgICAgICAgICAgICAgICBtZW51OiBfLnNvcnRCeShkYXRhLm1lbnUsICdvcmRlcicpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBidWlsZFRhYmxlID0gKGlkeCwgbGlzdCwgZWRpdGFibGUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpZHhdID0gbGlzdDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzW2B0YWJsZSR7aWR4fWBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdID0gJCh0aGlzW2BteW1hcHNfdGFibGVfJHtpZHh9YF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0gPSB0aGlzW2B0YWJsZSR7aWR4fWBdLkRhdGFUYWJsZSh7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVuY29tbWVudCBiZWxvdyBsaW5lKCdkb20nIHBhcmFtZXRlcikgdG8gZml4IHRoZSBkcm9wZG93biBvdmVyZmxvdyBpc3N1ZSBpbiB0aGUgZGF0YXRhYmxlIGNlbGxzLiBUaGUgZGVmYXVsdCBkYXRhdGFibGUgbGF5b3V0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgdXNlcyBzY3JvbGxhYmxlIGRpdih0YWJsZS1zY3JvbGxhYmxlKSB3aXRoIG92ZXJmbG93OmF1dG8gdG8gZW5hYmxlIHZlcnRpY2FsIHNjcm9sbChzZWU6IGFzc2V0cy9nbG9iYWwvcGx1Z2lucy9kYXRhdGFibGVzL3BsdWdpbnMvYm9vdHN0cmFwL2RhdGFUYWJsZXMuYm9vdHN0cmFwLmpzKS5cclxuICAgICAgICAgICAgICAgICAgICAvLyBTbyB3aGVuIGRyb3Bkb3ducyB1c2VkIHRoZSBzY3JvbGxhYmxlIGRpdiBzaG91bGQgYmUgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLydkb20nOiAnPCdyb3cnPCdjb2wtbWQtNiBjb2wtc20tMTInbD48J2NvbC1tZC02IGNvbC1zbS0xMidmPnI+dDwncm93JzwnY29sLW1kLTUgY29sLXNtLTEyJ2k+PCdjb2wtbWQtNyBjb2wtc20tMTIncD4+JyxcclxuICAgICAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbHVtbnMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdDaGNrQngnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyMHB4J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTmFtZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0NyZWF0ZWQgT24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdTdGF0dXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXNbYHRhYmxlJHtpZHh9YF1Ub29scyA9IG5ldyAkLmZuLmRhdGFUYWJsZS5UYWJsZVRvb2xzKHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLCB7fSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlV3JhcHBlciA9IHRoaXNbYHRhYmxlJHtpZHh9YF0ucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZChgI215bWFwc18ke2lkeH1fdGFibGVfd3JhcHBlcmApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0uZmluZCgnLmdyb3VwLWNoZWNrYWJsZScpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNldCA9IGpRdWVyeSh0aGlzKS5hdHRyKCdkYXRhLXNldCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VkID0galF1ZXJ5KHRoaXMpLmlzKCc6Y2hlY2tlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeShzZXQpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeS51bmlmb3JtLnVwZGF0ZShzZXQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpc1tgdGFibGUke2lkeH1gXS5vbignY2hhbmdlJywgJ3Rib2R5IHRyIC5jaGVja2JveGVzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0YWJsZVdyYXBwZXIuZmluZCgnLmRhdGFUYWJsZXNfbGVuZ3RoIHNlbGVjdCcpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wgaW5wdXQteHNtYWxsIGlucHV0LWlubGluZScpOyAvLyBtb2RpZnkgdGFibGUgcGVyIHBhZ2UgZHJvcGRvd25cclxuXHJcbiAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNldCAmJiB0aGlzLmRhdGFzZXQucGspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHtpZH0vbmFtZWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vRmV0Y2ggQWxsIG1hcHNcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldENoaWxkKENPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUKS5vbigndmFsdWUnLCAodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB2YWwudmFsKCk7XHJcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnRhYnMsICh0YWIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXBzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGFiLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVGVtcGxhdGVzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNeSBNYXBzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgPT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCkgeyAvL09ubHkgaW5jbHVkZSBteSBvd24gbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdTaGFyZWQgd2l0aCBNZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoICYmIC8vRXhjbHVkZSBhbnl0aGluZyB0aGF0IGlzbid0IHNoYXJlZCBhdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIW9iai5zaGFyZWRfd2l0aFsnKiddIHx8IChvYmouc2hhcmVkX3dpdGhbJyonXS5yZWFkICE9IHRydWUgfHwgb2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgIT0gdHJ1ZSkpICYmIC8vRXhjbHVkZSBwdWJsaWMgbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXSAmJiAvL0luY2x1ZGUgc2hhcmVzIHdpaCBteSB1c2VySWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUgfHwgLy9JbmNsdWRlIGFueXRoaW5nIEkgY2FuIHdyaXRlIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLnJlYWQgPT0gdHJ1ZSkgLy9JbmNsdWRlIGFueXRoaW5nIEkgY2FuIHJlYWQgZnJvbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IChvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdQdWJsaWMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCAhPSBNZXRhTWFwLlVzZXIudXNlcklkICYmIC8vRG9uJ3QgaW5jbHVkZSBteSBvd24gbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aCAmJiAvL0V4Y2x1ZGUgYW55dGhpbmcgdGhhdCBpc24ndCBzaGFyZWQgYXQgYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iai5zaGFyZWRfd2l0aFsnKiddICYmIChvYmouc2hhcmVkX3dpdGhbJyonXS5yZWFkID09IHRydWUgfHwgb2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkgKSAvL0luY2x1ZGUgcHVibGljIG1hcHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSAob2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBbGwgTWFwcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTGlrZSBpdCBzYXlzLCBhbGwgbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobWFwcykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLmZpbHRlcihtYXBzLCAobWFwKSA9PiB7IHJldHVybiBtYXAgJiYgbWFwLmlkIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRUYWJsZSh0YWIub3JkZXIsIG1hcHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICQoJy5vd25lci1sYWJlbCcpLnRvb2x0aXAoKVxyXG4gICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBvcnRsZXQgbGlnaHRcIj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG9ydGxldC1ib2R5XCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93IG1hcmdpbi1ib3R0b20tMzBcIj5cclxuXHRcdFx0XHRcdFx0PGRpdiBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPnsgaGVhZGVyLnRpdGxlIH08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgYXJlYXMgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGxpbmVcIj5cclxuICAgIFx0XHRcdFx0XHRcdDxoMz57IHRpdGxlIH08L2gzPlxyXG4gICAgXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyB0ZXh0IH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxsaSBlYWNoPVwieyBpdGVtcyB9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XHJcblx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0PC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCd0ZXJtcycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgXHJcbiAgICB0aGlzLmFyZWFzID0gW11cclxuICAgIHRoaXMuaGVhZGVyID0ge31cclxuXHJcbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuVEVSTVNfQU5EX0NPTkRJVElPTlMsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuc2VjdGlvbnMsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICBpZihpbmNsdWRlKSB7XHJcbiAgICAgICAgICAgICAgICBkLml0ZW1zID0gXy5maWx0ZXIoXy5zb3J0QnkoZC5pdGVtcywgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluY2x1ZGUyID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGUyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcclxuICAgICAgICB0aGlzLnVzZXJOYW1lID0gTWV0YU1hcC5Vc2VyLmZ1bGxOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuLyoqXHJcbkRlbW8gc2NyaXB0IHRvIGhhbmRsZSB0aGUgdGhlbWUgZGVtb1xyXG4qKi9cclxudmFyIERlbW8gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gSGFuZGxlIFRoZW1lIFNldHRpbmdzXHJcbiAgICB2YXIgaGFuZGxlVGhlbWUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHZhciBwYW5lbCA9ICQoJy50aGVtZS1wYW5lbCcpO1xyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWJveGVkJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbChcImZsdWlkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbChcImRlZmF1bHRcIik7XHJcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImRlZmF1bHRcIik7XHJcbiAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXBvcy1vcHRpb24nKS5hdHRyKFwiZGlzYWJsZWRcIikgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKE1ldHJvbmljLmlzUlRMKCkgPyAncmlnaHQnIDogJ2xlZnQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaGFuZGxlIHRoZW1lIGxheW91dFxyXG4gICAgICAgIHZhciByZXNldExheW91dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLlxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2UtYm94ZWRcIikuXHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikuXHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpLlxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2UtaGVhZGVyLWZpeGVkXCIpLlxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcclxuXHJcbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciA+IC5wYWdlLWhlYWRlci1pbm5lcicpLnJlbW92ZUNsYXNzKFwiY29udGFpbmVyXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWNvbnRhaW5lcicpLnBhcmVudChcIi5jb250YWluZXJcIikuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1jb250YWluZXInKS5pbnNlcnRBZnRlcignYm9keSA+IC5jbGVhcmZpeCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJCgnLnBhZ2UtZm9vdGVyID4gLmNvbnRhaW5lcicpLnNpemUoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgkKCcucGFnZS1mb290ZXIgPiAuY29udGFpbmVyJykuaHRtbCgpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcucGFnZS1mb290ZXInKS5wYXJlbnQoXCIuY29udGFpbmVyXCIpLnNpemUoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaW5zZXJ0QWZ0ZXIoJy5wYWdlLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5pbnNlcnRBZnRlcignLnBhZ2UtZm9vdGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLnJlbW92ZUNsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcclxuXHJcbiAgICAgICAgICAgICQoJ2JvZHkgPiAuY29udGFpbmVyJykucmVtb3ZlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGxhc3RTZWxlY3RlZExheW91dCA9ICcnO1xyXG5cclxuICAgICAgICB2YXIgc2V0TGF5b3V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGxheW91dE9wdGlvbiA9ICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhck9wdGlvbiA9ICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIGhlYWRlck9wdGlvbiA9ICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBmb290ZXJPcHRpb24gPSAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhclBvc09wdGlvbiA9ICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyU3R5bGVPcHRpb24gPSAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudU9wdGlvbiA9ICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyVG9wRHJvcGRvd25TdHlsZSA9ICQoJy5wYWdlLWhlYWRlci10b3AtZHJvcGRvd24tc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09IFwiZml4ZWRcIiAmJiBoZWFkZXJPcHRpb24gPT0gXCJkZWZhdWx0XCIpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdEZWZhdWx0IEhlYWRlciB3aXRoIEZpeGVkIFNpZGViYXIgb3B0aW9uIGlzIG5vdCBzdXBwb3J0ZWQuIFByb2NlZWQgd2l0aCBGaXhlZCBIZWFkZXIgd2l0aCBGaXhlZCBTaWRlYmFyLicpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICAgICAgICAgIHNpZGViYXJPcHRpb24gPSAnZml4ZWQnO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyT3B0aW9uID0gJ2ZpeGVkJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzZXRMYXlvdXQoKTsgLy8gcmVzZXQgbGF5b3V0IHRvIGRlZmF1bHQgc3RhdGVcclxuXHJcbiAgICAgICAgICAgIGlmIChsYXlvdXRPcHRpb24gPT09IFwiYm94ZWRcIikge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1ib3hlZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgaGVhZGVyXHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgPiAucGFnZS1oZWFkZXItaW5uZXInKS5hZGRDbGFzcyhcImNvbnRhaW5lclwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ID0gJCgnYm9keSA+IC5jbGVhcmZpeCcpLmFmdGVyKCc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2V0IGNvbnRlbnRcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWNvbnRhaW5lcicpLmFwcGVuZFRvKCdib2R5ID4gLmNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNldCBmb290ZXJcclxuICAgICAgICAgICAgICAgIGlmIChmb290ZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5odG1sKCc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+JyArICQoJy5wYWdlLWZvb3RlcicpLmh0bWwoKSArICc8L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuYXBwZW5kVG8oJ2JvZHkgPiAuY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsYXN0U2VsZWN0ZWRMYXlvdXQgIT0gbGF5b3V0T3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAvL2xheW91dCBjaGFuZ2VkLCBydW4gcmVzcG9uc2l2ZSBoYW5kbGVyOlxyXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMucnVuUmVzaXplSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXN0U2VsZWN0ZWRMYXlvdXQgPSBsYXlvdXRPcHRpb247XHJcblxyXG4gICAgICAgICAgICAvL2hlYWRlclxyXG4gICAgICAgICAgICBpZiAoaGVhZGVyT3B0aW9uID09PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICQoXCIucGFnZS1oZWFkZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXZiYXItc3RhdGljLXRvcFwiKS5hZGRDbGFzcyhcIm5hdmJhci1maXhlZC10b3BcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICQoXCIucGFnZS1oZWFkZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXZiYXItZml4ZWQtdG9wXCIpLmFkZENsYXNzKFwibmF2YmFyLXN0YXRpYy10b3BcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc2lkZWJhclxyXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWZ1bGwtd2lkdGgnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWRlZmF1bHRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmluaXRGaXhlZFNpZGViYXJIb3ZlckVmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtZGVmYXVsdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKS51bmJpbmQoJ21vdXNlZW50ZXInKS51bmJpbmQoJ21vdXNlbGVhdmUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdG9wIGRyb3Bkb3duIHN0eWxlXHJcbiAgICAgICAgICAgIGlmIChoZWFkZXJUb3BEcm9wZG93blN0eWxlID09PSAnZGFyaycpIHtcclxuICAgICAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLmFkZENsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLnJlbW92ZUNsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9mb290ZXJcclxuICAgICAgICAgICAgaWYgKGZvb3Rlck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9zaWRlYmFyIHN0eWxlXHJcbiAgICAgICAgICAgIGlmIChzaWRlYmFyU3R5bGVPcHRpb24gPT09ICdjb21wYWN0Jykge1xyXG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNvbXBhY3RcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY29tcGFjdFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9zaWRlYmFyIG1lbnVcclxuICAgICAgICAgICAgaWYgKHNpZGViYXJNZW51T3B0aW9uID09PSAnaG92ZXInKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkudmFsKFwiYWNjb3JkaW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiSG92ZXIgU2lkZWJhciBNZW51IGlzIG5vdCBjb21wYXRpYmxlIHdpdGggRml4ZWQgU2lkZWJhciBNb2RlLiBTZWxlY3QgRGVmYXVsdCBTaWRlYmFyIE1vZGUgSW5zdGVhZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc2lkZWJhciBwb3NpdGlvblxyXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuaXNSVEwoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJQb3NPcHRpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAncmlnaHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAnbGVmdCdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyUG9zT3B0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdsZWZ0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcclxuICAgICAgICAgICAgTGF5b3V0LmluaXRGaXhlZFNpZGViYXIoKTsgLy8gcmVpbml0aWFsaXplIGZpeGVkIHNpZGViYXJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgdGhlbWUgY29sb3JzXHJcbiAgICAgICAgdmFyIHNldENvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2xvcl8gPSAoTWV0cm9uaWMuaXNSVEwoKSA/IGNvbG9yICsgJy1ydGwnIDogY29sb3IpO1xyXG4gICAgICAgICAgICAkKCcjc3R5bGVfY29sb3InKS5hdHRyKFwiaHJlZlwiLCBMYXlvdXQuZ2V0TGF5b3V0Q3NzUGF0aCgpICsgJ3RoZW1lcy8nICsgY29sb3JfICsgXCIuY3NzXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAkKCcudGhlbWUtY29sb3JzID4gbGknLCBwYW5lbCkuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY29sb3IgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXRoZW1lXCIpO1xyXG4gICAgICAgICAgICBzZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgICQoJ3VsID4gbGknLCBwYW5lbCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT09ICdkYXJrJykge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtYWN0aW9ucyAuYnRuJykucmVtb3ZlQ2xhc3MoJ3JlZC1oYXplJykuYWRkQ2xhc3MoJ2J0bi1kZWZhdWx0IGJ0bi10cmFuc3BhcmVudCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtYWN0aW9ucyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2J0bi1kZWZhdWx0IGJ0bi10cmFuc3BhcmVudCcpLmFkZENsYXNzKCdyZWQtaGF6ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHNldCBkZWZhdWx0IHRoZW1lIG9wdGlvbnM6XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWJveGVkXCIpKSB7XHJcbiAgICAgICAgICAgICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbChcImJveGVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKSkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIikpIHtcclxuICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKSkge1xyXG4gICAgICAgICAgICAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKSkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbChcInJpZ2h0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1saWdodFwiKSkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKFwibGlnaHRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIikpIHtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkudmFsKFwiaG92ZXJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2lkZWJhck9wdGlvbiA9ICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIGhlYWRlck9wdGlvbiA9ICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBmb290ZXJPcHRpb24gPSAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhclBvc09wdGlvbiA9ICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyU3R5bGVPcHRpb24gPSAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudU9wdGlvbiA9ICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG5cclxuICAgICAgICAkKCcubGF5b3V0LW9wdGlvbiwgLnBhZ2UtaGVhZGVyLXRvcC1kcm9wZG93bi1zdHlsZS1vcHRpb24sIC5wYWdlLWhlYWRlci1vcHRpb24sIC5zaWRlYmFyLW9wdGlvbiwgLnBhZ2UtZm9vdGVyLW9wdGlvbiwgLnNpZGViYXItcG9zLW9wdGlvbiwgLnNpZGViYXItc3R5bGUtb3B0aW9uLCAuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS5jaGFuZ2Uoc2V0TGF5b3V0KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gaGFuZGxlIHRoZW1lIHN0eWxlXHJcbiAgICB2YXIgc2V0VGhlbWVTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIGZpbGUgPSAoc3R5bGUgPT09ICdyb3VuZGVkJyA/ICdjb21wb25lbnRzLXJvdW5kZWQnIDogJ2NvbXBvbmVudHMnKTtcclxuICAgICAgICBmaWxlID0gKE1ldHJvbmljLmlzUlRMKCkgPyBmaWxlICsgJy1ydGwnIDogZmlsZSk7XHJcblxyXG4gICAgICAgICQoJyNzdHlsZV9jb21wb25lbnRzJykuYXR0cihcImhyZWZcIiwgTWV0cm9uaWMuZ2V0R2xvYmFsQ3NzUGF0aCgpICsgZmlsZSArIFwiLmNzc1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCQuY29va2llKSB7XHJcbiAgICAgICAgICAgICQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJywgc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIHRoZSB0aGVtZVxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBoYW5kbGVzIHN0eWxlIGN1c3RvbWVyIHRvb2xcclxuICAgICAgICAgICAgaGFuZGxlVGhlbWUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSBsYXlvdXQgc3R5bGUgY2hhbmdlXHJcbiAgICAgICAgICAgICQoJy50aGVtZS1wYW5lbCAubGF5b3V0LXN0eWxlLW9wdGlvbicpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICBzZXRUaGVtZVN0eWxlKCQodGhpcykudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldCBsYXlvdXQgc3R5bGUgZnJvbSBjb29raWVcclxuICAgICAgICAgICAgaWYgKCQuY29va2llICYmICQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykgPT09ICdyb3VuZGVkJykge1xyXG4gICAgICAgICAgICAgICAgc2V0VGhlbWVTdHlsZSgkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpKTtcclxuICAgICAgICAgICAgICAgICQoJy50aGVtZS1wYW5lbCAubGF5b3V0LXN0eWxlLW9wdGlvbicpLnZhbCgkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59ICgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZW1vIiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbmNvbnN0IE1ldHJvbmljID0gcmVxdWlyZSgnLi9tZXRyb25pYycpXHJcbi8qKlxyXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcclxuKiovXHJcbnZhciBMYXlvdXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgbGF5b3V0SW1nUGF0aCA9ICdhZG1pbi9sYXlvdXQ0L2ltZy8nO1xyXG5cclxuICAgIHZhciBsYXlvdXRDc3NQYXRoID0gJ2FkbWluL2xheW91dDQvY3NzLyc7XHJcblxyXG4gICAgdmFyIHJlc0JyZWFrcG9pbnRNZCA9IE1ldHJvbmljLmdldFJlc3BvbnNpdmVCcmVha3BvaW50KCdtZCcpO1xyXG5cclxuICAgIC8vKiBCRUdJTjpDT1JFIEhBTkRMRVJTICovL1xyXG4gICAgLy8gdGhpcyBmdW5jdGlvbiBoYW5kbGVzIHJlc3BvbnNpdmUgbGF5b3V0IG9uIHNjcmVlbiBzaXplIHJlc2l6ZSBvciBtb2JpbGUgZGV2aWNlIHJvdGF0ZS5cclxuXHJcblxyXG4gICAgLy8gSGFuZGxlIHNpZGViYXIgbWVudSBsaW5rc1xyXG4gICAgdmFyIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluayA9IGZ1bmN0aW9uKG1vZGUsIGVsKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IGxvY2F0aW9uLmhhc2gudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgdmFyIG1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGUgPT09ICdjbGljaycgfHwgbW9kZSA9PT0gJ3NldCcpIHtcclxuICAgICAgICAgICAgZWwgPSAkKGVsKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdtYXRjaCcpIHtcclxuICAgICAgICAgICAgbWVudS5maW5kKFwibGkgPiBhXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9ICQodGhpcykuYXR0cihcImhyZWZcIikudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIC8vIHVybCBtYXRjaCBjb25kaXRpb25cclxuICAgICAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA+IDEgJiYgdXJsLnN1YnN0cigxLCBwYXRoLmxlbmd0aCAtIDEpID09IHBhdGguc3Vic3RyKDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWVsIHx8IGVsLnNpemUoKSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbC5hdHRyKCdocmVmJykudG9Mb3dlckNhc2UoKSA9PT0gJ2phdmFzY3JpcHQ6OycgfHwgZWwuYXR0cignaHJlZicpLnRvTG93ZXJDYXNlKCkgPT09ICcjJykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2xpZGVTcGVlZCA9IHBhcnNlSW50KG1lbnUuZGF0YShcInNsaWRlLXNwZWVkXCIpKTtcclxuICAgICAgICB2YXIga2VlcEV4cGFuZCA9IG1lbnUuZGF0YShcImtlZXAtZXhwYW5kZWRcIik7XHJcblxyXG4gICAgICAgIC8vIGRpc2FibGUgYWN0aXZlIHN0YXRlc1xyXG4gICAgICAgIG1lbnUuZmluZCgnbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIG1lbnUuZmluZCgnbGkgPiBhID4gLnNlbGVjdGVkJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGlmIChtZW51Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51JykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG1lbnUuZmluZCgnbGkub3BlbicpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmNoaWxkcmVuKCcuc3ViLW1lbnUnKS5zaXplKCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+IGEgPiAuYXJyb3cub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICBtZW51LmZpbmQoJ2xpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWwucGFyZW50cygnbGknKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnPiBhID4gc3Bhbi5hcnJvdycpLmFkZENsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnQoJ3VsLnBhZ2Utc2lkZWJhci1tZW51Jykuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz4gYScpLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJzZWxlY3RlZFwiPjwvc3Bhbj4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuY2hpbGRyZW4oJ3VsLnN1Yi1tZW51Jykuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGUgPT09ICdjbGljaycpIHtcclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlIHNpZGViYXIgbWVudVxyXG4gICAgdmFyIGhhbmRsZVNpZGViYXJNZW51ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICdsaSA+IGEnLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA+PSByZXNCcmVha3BvaW50TWQgJiYgJCh0aGlzKS5wYXJlbnRzKCcucGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudScpLnNpemUoKSA9PT0gMSkgeyAvLyBleGl0IG9mIGhvdmVyIHNpZGViYXIgbWVudVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkuaGFzQ2xhc3MoJ3N1Yi1tZW51JykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykubmV4dCgpLmhhc0NsYXNzKCdzdWItbWVudSBhbHdheXMtb3BlbicpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpO1xyXG4gICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIG1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcclxuICAgICAgICAgICAgdmFyIHN1YiA9ICQodGhpcykubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF1dG9TY3JvbGwgPSBtZW51LmRhdGEoXCJhdXRvLXNjcm9sbFwiKTtcclxuICAgICAgICAgICAgdmFyIHNsaWRlU3BlZWQgPSBwYXJzZUludChtZW51LmRhdGEoXCJzbGlkZS1zcGVlZFwiKSk7XHJcbiAgICAgICAgICAgIHZhciBrZWVwRXhwYW5kID0gbWVudS5kYXRhKFwia2VlcC1leHBhbmRlZFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChrZWVwRXhwYW5kICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5jaGlsZHJlbignYScpLmNoaWxkcmVuKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuKCdsaS5vcGVuJykuY2hpbGRyZW4oJy5zdWItbWVudTpub3QoLmFsd2F5cy1vcGVuKScpLnNsaWRlVXAoc2xpZGVTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgc2xpZGVPZmZlc2V0ID0gLTIwMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdWIuaXMoXCI6dmlzaWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLmFycm93JywgJCh0aGlzKSkucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICBzdWIuc2xpZGVVcChzbGlkZVNwZWVkLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b1Njcm9sbCA9PT0gdHJ1ZSAmJiAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbnUuc2xpbVNjcm9sbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Njcm9sbFRvJzogKHRoZS5wb3NpdGlvbigpKS50b3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8odGhlLCBzbGlkZU9mZmVzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuYXJyb3cnLCAkKHRoaXMpKS5hZGRDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgIHN1Yi5zbGlkZURvd24oc2xpZGVTcGVlZCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF1dG9TY3JvbGwgPT09IHRydWUgJiYgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXNpZGViYXItY2xvc2VkJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51LnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzY3JvbGxUbyc6ICh0aGUucG9zaXRpb24oKSkudG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvKHRoZSwgc2xpZGVPZmZlc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBhamF4IGxpbmtzIHdpdGhpbiBzaWRlYmFyIG1lbnVcclxuICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ2NsaWNrJywgJyBsaSA+IGEuYWpheGlmeScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG4gICAgICAgICAgICB2YXIgbWVudUNvbnRhaW5lciA9ICQoJy5wYWdlLXNpZGViYXIgdWwnKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gJCgnLnBhZ2UtY29udGVudCcpO1xyXG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnRCb2R5ID0gJCgnLnBhZ2UtY29udGVudCAucGFnZS1jb250ZW50LWJvZHknKTtcclxuXHJcbiAgICAgICAgICAgIG1lbnVDb250YWluZXIuY2hpbGRyZW4oJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgbWVudUNvbnRhaW5lci5jaGlsZHJlbignYXJyb3cub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ2xpJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbignYSA+IHNwYW4uYXJyb3cnKS5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIE1ldHJvbmljLnN0YXJ0UGFnZUxvYWRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlLnBhcmVudHMoJ2xpLm9wZW4nKS5zaXplKCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhci1tZW51ID4gbGkub3BlbiA+IGEnKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0QWpheCgpOyAvLyBpbml0aWFsaXplIGNvcmUgc3R1ZmZcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbCgnPGg0PkNvdWxkIG5vdCBsb2FkIHRoZSByZXF1ZXN0ZWQgY29udGVudC48L2g0PicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIGFqYXggbGluayB3aXRoaW4gbWFpbiBjb250ZW50XHJcbiAgICAgICAgJCgnLnBhZ2UtY29udGVudCcpLm9uKCdjbGljaycsICcuYWpheGlmeScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSAkKCcucGFnZS1jb250ZW50Jyk7XHJcbiAgICAgICAgICAgIHZhciBwYWdlQ29udGVudEJvZHkgPSAkKCcucGFnZS1jb250ZW50IC5wYWdlLWNvbnRlbnQtYm9keScpO1xyXG5cclxuICAgICAgICAgICAgTWV0cm9uaWMuc3RhcnRQYWdlTG9hZGluZygpO1xyXG5cclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmZpeENvbnRlbnRIZWlnaHQoKTsgLy8gZml4IGNvbnRlbnQgaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdEFqYXgoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHN0dWZmXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwoJzxoND5Db3VsZCBub3QgbG9hZCB0aGUgcmVxdWVzdGVkIGNvbnRlbnQuPC9oND4nKTtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBzY3JvbGxpbmcgdG8gdG9wIG9uIHJlc3BvbnNpdmUgbWVudSB0b2dnbGVyIGNsaWNrIHdoZW4gaGVhZGVyIGlzIGZpeGVkIGZvciBtb2JpbGUgdmlld1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucGFnZS1oZWFkZXItZml4ZWQtbW9iaWxlIC5yZXNwb25zaXZlLXRvZ2dsZXInLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBzaWRlYmFyIGhlaWdodCBmb3IgZml4ZWQgc2lkZWJhciBsYXlvdXQuXHJcbiAgICB2YXIgX2NhbGN1bGF0ZUZpeGVkU2lkZWJhclZpZXdwb3J0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNpZGViYXJIZWlnaHQgPSBNZXRyb25pYy5nZXRWaWV3UG9ydCgpLmhlaWdodCAtICQoJy5wYWdlLWhlYWRlcicpLm91dGVySGVpZ2h0KCkgLSAzMDtcclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikpIHtcclxuICAgICAgICAgICAgc2lkZWJhckhlaWdodCA9IHNpZGViYXJIZWlnaHQgLSAkKCcucGFnZS1mb290ZXInKS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNpZGViYXJIZWlnaHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgZml4ZWQgc2lkZWJhclxyXG4gICAgdmFyIGhhbmRsZUZpeGVkU2lkZWJhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XHJcblxyXG4gICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKG1lbnUpO1xyXG5cclxuICAgICAgICBpZiAoJCgnLnBhZ2Utc2lkZWJhci1maXhlZCcpLnNpemUoKSA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA+PSByZXNCcmVha3BvaW50TWQpIHtcclxuICAgICAgICAgICAgbWVudS5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgX2NhbGN1bGF0ZUZpeGVkU2lkZWJhclZpZXdwb3J0SGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbChtZW51KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgc2lkZWJhciB0b2dnbGVyIHRvIGNsb3NlL2hpZGUgdGhlIHNpZGViYXIuXHJcbiAgICB2YXIgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGJvZHkgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSk7XHJcbiAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItY2xvc2VkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5wYWdlLXNpZGViYXItbWVudScpLnJlbW92ZUNsYXNzKCdwYWdlLXNpZGViYXItbWVudS1jbG9zZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcucGFnZS1zaWRlYmFyLW1lbnUnKS5hZGRDbGFzcygncGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFubGVzIHNpZGViYXIgdG9nZ2xlclxyXG4gICAgdmFyIGhhbmRsZVNpZGViYXJUb2dnbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGJvZHkgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBzaWRlYmFyIHNob3cvaGlkZVxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnNpZGViYXItdG9nZ2xlcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXIgPSAkKCcucGFnZS1zaWRlYmFyJyk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xyXG4gICAgICAgICAgICAkKFwiLnNpZGViYXItc2VhcmNoXCIsIHNpZGViYXIpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgYm9keS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIik7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNsb3NlZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICgkLmNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdzaWRlYmFyX2Nsb3NlZCcsICcwJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBib2R5LmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKTtcclxuICAgICAgICAgICAgICAgIHNpZGViYXJNZW51LmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS50cmlnZ2VyKFwibW91c2VsZWF2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgkLmNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdzaWRlYmFyX2Nsb3NlZCcsICcxJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QoKTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggYmFyIGNsb3NlXHJcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICcuc2lkZWJhci1zZWFyY2ggLnJlbW92ZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSB0aGUgc2VhcmNoIHF1ZXJ5IHN1Ym1pdCBvbiBlbnRlciBwcmVzc1xyXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXIgLnNpZGViYXItc2VhcmNoJykub24oJ2tleXByZXNzJywgJ2lucHV0LmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLzwtLS0tIEFkZCB0aGlzIGxpbmVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgdGhlIHNlYXJjaCBzdWJtaXQoZm9yIHNpZGViYXIgc2VhcmNoIGFuZCByZXNwb25zaXZlIG1vZGUgb2YgdGhlIGhlYWRlciBzZWFyY2gpXHJcbiAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoIC5zdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5oYXNDbGFzcygnb3BlbicpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcucGFnZS1zaWRlYmFyLWZpeGVkJykuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXIgLnNpZGViYXItdG9nZ2xlcicpLmNsaWNrKCk7IC8vdHJpZ2dlciBzaWRlYmFyIHRvZ2dsZSBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuYWRkQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBjbG9zZSBvbiBib2R5IGNsaWNrXHJcbiAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXNlYXJjaCcpLnNpemUoKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2ggLmlucHV0LWdyb3VwJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCgnLnNpZGViYXItc2VhcmNoJykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIHRoZSBob3Jpem9udGFsIG1lbnVcclxuICAgIHZhciBoYW5kbGVIZWFkZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBoYW5kbGUgc2VhcmNoIGJveCBleHBhbmQvY29sbGFwc2VcclxuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbignY2xpY2snLCAnLnNlYXJjaC1mb3JtJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuZm9ybS1jb250cm9sJykuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAuc2VhcmNoLWZvcm0gLmZvcm0tY29udHJvbCcpLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnVuYmluZChcImJsdXJcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgaG9yIG1lbnUgc2VhcmNoIGZvcm0gb24gZW50ZXIgcHJlc3NcclxuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbigna2V5cHJlc3MnLCAnLmhvci1tZW51IC5zZWFyY2gtZm9ybSAuZm9ybS1jb250cm9sJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgaGVhZGVyIHNlYXJjaCBidXR0b24gY2xpY2tcclxuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbignbW91c2Vkb3duJywgJy5zZWFyY2gtZm9ybS5vcGVuIC5zdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5zdWJtaXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyB0aGUgZ28gdG8gdG9wIGJ1dHRvbiBhdCB0aGUgZm9vdGVyXHJcbiAgICB2YXIgaGFuZGxlR29Ub3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gMzAwO1xyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IDUwMDtcclxuXHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSkpIHsgLy8gaW9zIHN1cHBvcnRlZFxyXG4gICAgICAgICAgICAkKHdpbmRvdykuYmluZChcInRvdWNoZW5kIHRvdWNoY2FuY2VsIHRvdWNobGVhdmVcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVJbihkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZU91dChkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vIGdlbmVyYWxcclxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlSW4oZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVPdXQoZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxyXG4gICAgICAgICAgICB9LCBkdXJhdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLyogRU5EOkNPUkUgSEFORExFUlMgKi8vXHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgLy8gTWFpbiBpbml0IG1ldGhvZHMgdG8gaW5pdGlhbGl6ZSB0aGUgbGF5b3V0XHJcbiAgICAgICAgLy8gSU1QT1JUQU5UISEhOiBEbyBub3QgbW9kaWZ5IHRoZSBjb3JlIGhhbmRsZXJzIGNhbGwgb3JkZXIuXHJcblxyXG4gICAgICAgIGluaXRIZWFkZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVIZWFkZXIoKTsgLy8gaGFuZGxlcyBob3Jpem9udGFsIG1lbnVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRTaWRlYmFyTWVudUFjdGl2ZUxpbms6IGZ1bmN0aW9uKG1vZGUsIGVsKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluayhtb2RlLCBlbCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdFNpZGViYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL2xheW91dCBoYW5kbGVyc1xyXG4gICAgICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXIoKTsgLy8gaGFuZGxlcyBmaXhlZCBzaWRlYmFyIG1lbnVcclxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhck1lbnUoKTsgLy8gaGFuZGxlcyBtYWluIG1lbnVcclxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhclRvZ2dsZXIoKTsgLy8gaGFuZGxlcyBzaWRlYmFyIGhpZGUvc2hvd1xyXG5cclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmlzQW5ndWxhckpzQXBwKCkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluaygnbWF0Y2gnKTsgLy8gaW5pdCBzaWRlYmFyIGFjdGl2ZSBsaW5rc1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGhhbmRsZUZpeGVkU2lkZWJhcik7IC8vIHJlaW5pdGlhbGl6ZSBmaXhlZCBzaWRlYmFyIG9uIHdpbmRvdyByZXNpemVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0Q29udGVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0Rm9vdGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlR29Ub3AoKTsgLy9oYW5kbGVzIHNjcm9sbCB0byB0b3AgZnVuY3Rpb25hbGl0eSBpbiB0aGUgZm9vdGVyXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0U2lkZWJhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRDb250ZW50KCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEZvb3RlcigpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGZpeCB0aGUgc2lkZWJhciBhbmQgY29udGVudCBoZWlnaHQgYWNjb3JkaW5nbHlcclxuICAgICAgICBmaXhDb250ZW50SGVpZ2h0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRGaXhlZFNpZGViYXJIb3ZlckVmZmVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdEZpeGVkU2lkZWJhcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhcigpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldExheW91dEltZ1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWV0cm9uaWMuZ2V0QXNzZXRzUGF0aCgpICsgbGF5b3V0SW1nUGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRMYXlvdXRDc3NQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1ldHJvbmljLmdldEFzc2V0c1BhdGgoKSArIGxheW91dENzc1BhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0gKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuXHJcbi8qKlxyXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcclxuKiovXHJcbnZhciBNZXRyb25pYyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8vIElFIG1vZGVcclxuICAgIHZhciBpc1JUTCA9IGZhbHNlO1xyXG4gICAgdmFyIGlzSUU4ID0gZmFsc2U7XHJcbiAgICB2YXIgaXNJRTkgPSBmYWxzZTtcclxuICAgIHZhciBpc0lFMTAgPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgcmVzaXplSGFuZGxlcnMgPSBbXTtcclxuXHJcbiAgICB2YXIgYXNzZXRzUGF0aCA9ICcuLi8uLi9hc3NldHMvJztcclxuXHJcbiAgICB2YXIgZ2xvYmFsSW1nUGF0aCA9ICdnbG9iYWwvaW1nLyc7XHJcblxyXG4gICAgdmFyIGdsb2JhbFBsdWdpbnNQYXRoID0gJ2dsb2JhbC9wbHVnaW5zLyc7XHJcblxyXG4gICAgdmFyIGdsb2JhbENzc1BhdGggPSAnZ2xvYmFsL2Nzcy8nO1xyXG5cclxuICAgIC8vIHRoZW1lIGxheW91dCBjb2xvciBzZXRcclxuXHJcbiAgICB2YXIgYnJhbmRDb2xvcnMgPSB7XHJcbiAgICAgICAgJ2JsdWUnOiAnIzg5QzRGNCcsXHJcbiAgICAgICAgJ3JlZCc6ICcjRjM1NjVEJyxcclxuICAgICAgICAnZ3JlZW4nOiAnIzFiYmM5YicsXHJcbiAgICAgICAgJ3B1cnBsZSc6ICcjOWI1OWI2JyxcclxuICAgICAgICAnZ3JleSc6ICcjOTVhNWE2JyxcclxuICAgICAgICAneWVsbG93JzogJyNGOENCMDAnXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGluaXRpYWxpemVzIG1haW4gc2V0dGluZ3NcclxuICAgIHZhciBoYW5kbGVJbml0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuY3NzKCdkaXJlY3Rpb24nKSA9PT0gJ3J0bCcpIHtcclxuICAgICAgICAgICAgaXNSVEwgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXNJRTggPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgOC4wLyk7XHJcbiAgICAgICAgaXNJRTkgPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgOS4wLyk7XHJcbiAgICAgICAgaXNJRTEwID0gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFIDEwLjAvKTtcclxuXHJcbiAgICAgICAgaWYgKGlzSUUxMCkge1xyXG4gICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2llMTAnKTsgLy8gZGV0ZWN0IElFMTAgdmVyc2lvblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzSUUxMCB8fCBpc0lFOSB8fCBpc0lFOCkge1xyXG4gICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2llJyk7IC8vIGRldGVjdCBJRTEwIHZlcnNpb25cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHJ1bnMgY2FsbGJhY2sgZnVuY3Rpb25zIHNldCBieSBNZXRyb25pYy5hZGRSZXNwb25zaXZlSGFuZGxlcigpLlxyXG4gICAgdmFyIF9ydW5SZXNpemVIYW5kbGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHJlaW5pdGlhbGl6ZSBvdGhlciBzdWJzY3JpYmVkIGVsZW1lbnRzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNpemVIYW5kbGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZWFjaCA9IHJlc2l6ZUhhbmRsZXJzW2ldO1xyXG4gICAgICAgICAgICBlYWNoLmNhbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGhhbmRsZSB0aGUgbGF5b3V0IHJlaW5pdGlhbGl6YXRpb24gb24gd2luZG93IHJlc2l6ZVxyXG4gICAgdmFyIGhhbmRsZU9uUmVzaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlc2l6ZTtcclxuICAgICAgICBpZiAoaXNJRTgpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJoZWlnaHQ7XHJcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmhlaWdodCA9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvL3F1aXRlIGV2ZW50IHNpbmNlIG9ubHkgYm9keSByZXNpemVkIG5vdCB3aW5kb3cuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNpemUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9ydW5SZXNpemVIYW5kbGVycygpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTApOyAvLyB3YWl0IDUwbXMgdW50aWwgd2luZG93IHJlc2l6ZSBmaW5pc2hlcy5cclxuICAgICAgICAgICAgICAgIGN1cnJoZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBzdG9yZSBsYXN0IGJvZHkgY2xpZW50IGhlaWdodFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzaXplID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwKTsgLy8gd2FpdCA1MG1zIHVudGlsIHdpbmRvdyByZXNpemUgZmluaXNoZXMuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBwb3J0bGV0IHRvb2xzICYgYWN0aW9uc1xyXG4gICAgdmFyIGhhbmRsZVBvcnRsZXRUb29scyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGhhbmRsZSBwb3J0bGV0IHJlbW92ZVxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IGEucmVtb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBwb3J0bGV0ID0gJCh0aGlzKS5jbG9zZXN0KFwiLnBvcnRsZXRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoJ3BhZ2UtcG9ydGxldC1mdWxsc2NyZWVuJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgLmZ1bGxzY3JlZW4nKS50b29sdGlwKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVsb2FkJykudG9vbHRpcCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbW92ZScpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb25maWcnKS50b29sdGlwKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJykudG9vbHRpcCgnZGVzdHJveScpO1xyXG5cclxuICAgICAgICAgICAgcG9ydGxldC5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHBvcnRsZXQgZnVsbHNjcmVlblxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgcG9ydGxldCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpO1xyXG4gICAgICAgICAgICBpZiAocG9ydGxldC5oYXNDbGFzcygncG9ydGxldC1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgICAgICAgICBwb3J0bGV0LnJlbW92ZUNsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS5oZWlnaHQgLVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LXRpdGxlJykub3V0ZXJIZWlnaHQoKSAtXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygncGFkZGluZy10b3AnKSkgLVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmFkZENsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gYS5yZWxvYWQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKS5jbG9zZXN0KFwiLnBvcnRsZXRcIikuY2hpbGRyZW4oXCIucG9ydGxldC1ib2R5XCIpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKFwiZGF0YS11cmxcIik7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9ICQodGhpcykuYXR0cihcImRhdGEtZXJyb3ItZGlzcGxheVwiKTtcclxuICAgICAgICAgICAgaWYgKHVybCkge1xyXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuYmxvY2tVSSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBlbCxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb2xvcjogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy51bmJsb2NrVUkoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5odG1sKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9ICdFcnJvciBvbiByZWxvYWRpbmcgdGhlIGNvbnRlbnQuIFBsZWFzZSBjaGVjayB5b3VyIGNvbm5lY3Rpb24gYW5kIHRyeSBhZ2Fpbi4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgPT0gXCJ0b2FzdHJcIiAmJiB0b2FzdHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yID09IFwibm90aWZpYzhcIiAmJiAkLm5vdGlmaWM4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLm5vdGlmaWM4KCd6aW5kZXgnLCAxMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLm5vdGlmaWM4KG1zZywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiAncnVieScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlmZTogMzAwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgZGVtbyBwdXJwb3NlXHJcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5ibG9ja1VJKHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGxvYWQgYWpheCBkYXRhIG9uIHBhZ2UgaW5pdFxyXG4gICAgICAgICQoJy5wb3J0bGV0IC5wb3J0bGV0LXRpdGxlIGEucmVsb2FkW2RhdGEtbG9hZD1cInRydWVcIl0nKS5jbGljaygpO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmV4cGFuZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKS5jaGlsZHJlbihcIi5wb3J0bGV0LWJvZHlcIik7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY29sbGFwc2VcIikpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZVwiKS5hZGRDbGFzcyhcImV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGVsLnNsaWRlVXAoMjAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJleHBhbmRcIikuYWRkQ2xhc3MoXCJjb2xsYXBzZVwiKTtcclxuICAgICAgICAgICAgICAgIGVsLnNsaWRlRG93bigyMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgY3VzdG9tIGNoZWNrYm94ZXMgJiByYWRpb3MgdXNpbmcgalF1ZXJ5IFVuaWZvcm0gcGx1Z2luXHJcbiAgICB2YXIgaGFuZGxlVW5pZm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghJCgpLnVuaWZvcm0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGVzdCA9ICQoXCJpbnB1dFt0eXBlPWNoZWNrYm94XTpub3QoLnRvZ2dsZSwgLm1kLWNoZWNrLCAubWQtcmFkaW9idG4sIC5tYWtlLXN3aXRjaCwgLmljaGVjayksIGlucHV0W3R5cGU9cmFkaW9dOm5vdCgudG9nZ2xlLCAubWQtY2hlY2ssIC5tZC1yYWRpb2J0biwgLnN0YXIsIC5tYWtlLXN3aXRjaCwgLmljaGVjaylcIik7XHJcbiAgICAgICAgaWYgKHRlc3Quc2l6ZSgpID4gMCkge1xyXG4gICAgICAgICAgICB0ZXN0LmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS51bmlmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlc21hdGVyaWFsIGRlc2lnbiBjaGVja2JveGVzXHJcbiAgICB2YXIgaGFuZGxlTWF0ZXJpYWxEZXNpZ24gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy8gTWF0ZXJpYWwgZGVzaWduIGNrZWNrYm94IGFuZCByYWRpbyBlZmZlY3RzXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcubWQtY2hlY2tib3ggPiBsYWJlbCwgLm1kLXJhZGlvID4gbGFiZWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IHNwYW4gd2hpY2ggaXMgb3VyIGNpcmNsZS9idWJibGVcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKS5jaGlsZHJlbignc3BhbjpmaXJzdC1jaGlsZCcpO1xyXG5cclxuICAgICAgICAgICAgLy8gYWRkIHRoZSBidWJibGUgY2xhc3MgKHdlIGRvIHRoaXMgc28gaXQgZG9lc250IHNob3cgb24gcGFnZSBsb2FkKVxyXG4gICAgICAgICAgICBlbC5hZGRDbGFzcygnaW5jJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBjbG9uZSBpdFxyXG4gICAgICAgICAgICB2YXIgbmV3b25lID0gZWwuY2xvbmUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBhZGQgdGhlIGNsb25lZCB2ZXJzaW9uIGJlZm9yZSBvdXIgb3JpZ2luYWxcclxuICAgICAgICAgICAgZWwuYmVmb3JlKG5ld29uZSk7XHJcblxyXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIG9yaWdpbmFsIHNvIHRoYXQgaXQgaXMgcmVhZHkgdG8gcnVuIG9uIG5leHQgY2xpY2tcclxuICAgICAgICAgICAgJChcIi5cIiArIGVsLmF0dHIoXCJjbGFzc1wiKSArIFwiOmxhc3RcIiwgdGhlKS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1tZCcpKSB7XHJcbiAgICAgICAgICAgIC8vIE1hdGVyaWFsIGRlc2lnbiBjbGljayBlZmZlY3RcclxuICAgICAgICAgICAgLy8gY3JlZGl0IHdoZXJlIGNyZWRpdCdzIGR1ZTsgaHR0cDovL3RoZWNvZGVwbGF5ZXIuY29tL3dhbGt0aHJvdWdoL3JpcHBsZS1jbGljay1lZmZlY3QtZ29vZ2xlLW1hdGVyaWFsLWRlc2lnblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCwgY2lyY2xlLCBkLCB4LCB5O1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ2EuYnRuLCBidXR0b24uYnRuLCBpbnB1dC5idG4sIGxhYmVsLmJ0bicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuZmluZChcIi5tZC1jbGljay1jaXJjbGVcIikubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnByZXBlbmQoXCI8c3BhbiBjbGFzcz0nbWQtY2xpY2stY2lyY2xlJz48L3NwYW4+XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNpcmNsZSA9IGVsZW1lbnQuZmluZChcIi5tZC1jbGljay1jaXJjbGVcIik7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGUucmVtb3ZlQ2xhc3MoXCJtZC1jbGljay1hbmltYXRlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFjaXJjbGUuaGVpZ2h0KCkgJiYgIWNpcmNsZS53aWR0aCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IE1hdGgubWF4KGVsZW1lbnQub3V0ZXJXaWR0aCgpLCBlbGVtZW50Lm91dGVySGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZS5jc3Moe2hlaWdodDogZCwgd2lkdGg6IGR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB4ID0gZS5wYWdlWCAtIGVsZW1lbnQub2Zmc2V0KCkubGVmdCAtIGNpcmNsZS53aWR0aCgpLzI7XHJcbiAgICAgICAgICAgICAgICB5ID0gZS5wYWdlWSAtIGVsZW1lbnQub2Zmc2V0KCkudG9wIC0gY2lyY2xlLmhlaWdodCgpLzI7XHJcblxyXG4gICAgICAgICAgICAgICAgY2lyY2xlLmNzcyh7dG9wOiB5KydweCcsIGxlZnQ6IHgrJ3B4J30pLmFkZENsYXNzKFwibWQtY2xpY2stYW5pbWF0ZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZsb2F0aW5nIGxhYmVsc1xyXG4gICAgICAgIHZhciBoYW5kbGVJbnB1dCA9IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChlbC52YWwoKSAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBlbC5hZGRDbGFzcygnZWRpdGVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmVDbGFzcygnZWRpdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbigna2V5ZG93bicsICcuZm9ybS1tZC1mbG9hdGluZy1sYWJlbCAuZm9ybS1jb250cm9sJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBoYW5kbGVJbnB1dCgkKHRoaXMpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2JsdXInLCAnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaGFuZGxlSW5wdXQoJCh0aGlzKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5mb3JtLW1kLWZsb2F0aW5nLWxhYmVsIC5mb3JtLWNvbnRyb2wnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2VkaXRlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlcyBjdXN0b20gY2hlY2tib3hlcyAmIHJhZGlvcyB1c2luZyBqUXVlcnkgaUNoZWNrIHBsdWdpblxyXG4gICAgdmFyIGhhbmRsZWlDaGVjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghJCgpLmlDaGVjaykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcuaWNoZWNrJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGNoZWNrYm94Q2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtY2hlY2tib3gnKSA/ICQodGhpcykuYXR0cignZGF0YS1jaGVja2JveCcpIDogJ2ljaGVja2JveF9taW5pbWFsLWdyZXknO1xyXG4gICAgICAgICAgICB2YXIgcmFkaW9DbGFzcyA9ICQodGhpcykuYXR0cignZGF0YS1yYWRpbycpID8gJCh0aGlzKS5hdHRyKCdkYXRhLXJhZGlvJykgOiAnaXJhZGlvX21pbmltYWwtZ3JleSc7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hlY2tib3hDbGFzcy5pbmRleE9mKCdfbGluZScpID4gLTEgfHwgcmFkaW9DbGFzcy5pbmRleE9mKCdfbGluZScpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuaUNoZWNrKHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja2JveENsYXNzOiBjaGVja2JveENsYXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhZGlvQ2xhc3M6IHJhZGlvQ2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAnPGRpdiBjbGFzcz1cImljaGVja19saW5lLWljb25cIj48L2Rpdj4nICsgJCh0aGlzKS5hdHRyKFwiZGF0YS1sYWJlbFwiKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmlDaGVjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hDbGFzczogY2hlY2tib3hDbGFzcyxcclxuICAgICAgICAgICAgICAgICAgICByYWRpb0NsYXNzOiByYWRpb0NsYXNzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBzd2l0Y2hlc1xyXG4gICAgdmFyIGhhbmRsZUJvb3RzdHJhcFN3aXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghJCgpLmJvb3RzdHJhcFN3aXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJy5tYWtlLXN3aXRjaCcpLmJvb3RzdHJhcFN3aXRjaCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBjb25maXJtYXRpb25zXHJcbiAgICB2YXIgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCEkKCkuY29uZmlybWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPWNvbmZpcm1hdGlvbl0nKS5jb25maXJtYXRpb24oeyBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSwgYnRuT2tDbGFzczogJ2J0biBidG4tc20gYnRuLXN1Y2Nlc3MnLCBidG5DYW5jZWxDbGFzczogJ2J0biBidG4tc20gYnRuLWRhbmdlcid9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBBY2NvcmRpb25zLlxyXG4gICAgdmFyIGhhbmRsZUFjY29yZGlvbnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ3Nob3duLmJzLmNvbGxhcHNlJywgJy5hY2NvcmRpb24uc2Nyb2xsYWJsZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oJChlLnRhcmdldCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBUYWJzLlxyXG4gICAgdmFyIGhhbmRsZVRhYnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL2FjdGl2YXRlIHRhYiBpZiB0YWIgaWQgcHJvdmlkZWQgaW4gdGhlIFVSTFxyXG4gICAgICAgIGlmIChsb2NhdGlvbi5oYXNoKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWJpZCA9IGVuY29kZVVSSShsb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XHJcbiAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykucGFyZW50cygnLnRhYi1wYW5lOmhpZGRlbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFiaWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcclxuICAgICAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykuY2xpY2soKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKCkudGFiZHJvcCkge1xyXG4gICAgICAgICAgICAkKCcudGFiYmFibGUtdGFiZHJvcCAubmF2LXBpbGxzLCAudGFiYmFibGUtdGFiZHJvcCAubmF2LXRhYnMnKS50YWJkcm9wKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImZhIGZhLWVsbGlwc2lzLXZcIj48L2k+Jm5ic3A7PGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBNb2RhbHMuXHJcbiAgICB2YXIgaGFuZGxlTW9kYWxzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gZml4IHN0YWNrYWJsZSBtb2RhbCBpc3N1ZTogd2hlbiAyIG9yIG1vcmUgbW9kYWxzIG9wZW5lZCwgY2xvc2luZyBvbmUgb2YgbW9kYWwgd2lsbCByZW1vdmUgLm1vZGFsLW9wZW4gY2xhc3MuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRlLmJzLm1vZGFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICgkKCcubW9kYWw6dmlzaWJsZScpLnNpemUoKSA+IDEgJiYgJCgnaHRtbCcpLmhhc0NsYXNzKCdtb2RhbC1vcGVuJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcubW9kYWw6dmlzaWJsZScpLnNpemUoKSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBmaXggcGFnZSBzY3JvbGxiYXJzIGlzc3VlXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdzaG93LmJzLm1vZGFsJywgJy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcIm1vZGFsLXNjcm9sbFwiKSkge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwibW9kYWwtb3Blbi1ub3Njcm9sbFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBmaXggcGFnZSBzY3JvbGxiYXJzIGlzc3VlXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRlLmJzLm1vZGFsJywgJy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJtb2RhbC1vcGVuLW5vc2Nyb2xsXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWpheCBjb250ZW50IGFuZCByZW1vdmUgY2FjaGUgb24gbW9kYWwgY2xvc2VkXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCAnLm1vZGFsOm5vdCgubW9kYWwtY2FjaGVkKScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVEYXRhKCdicy5tb2RhbCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBUb29sdGlwcy5cclxuICAgIHZhciBoYW5kbGVUb29sdGlwcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGdsb2JhbCB0b29sdGlwc1xyXG4gICAgICAgICQoJy50b29sdGlwcycpLnRvb2x0aXAoKTtcclxuXHJcbiAgICAgICAgLy8gcG9ydGxldCB0b29sdGlwc1xyXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgLmZ1bGxzY3JlZW4nKS50b29sdGlwKHtcclxuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXHJcbiAgICAgICAgICAgIHRpdGxlOiAnRnVsbHNjcmVlbidcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbG9hZCcpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcclxuICAgICAgICAgICAgdGl0bGU6ICdSZWxvYWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZW1vdmUnKS50b29sdGlwKHtcclxuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXHJcbiAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29uZmlnJykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1NldHRpbmdzJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxyXG4gICAgICAgICAgICB0aXRsZTogJ0NvbGxhcHNlL0V4cGFuZCdcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgRHJvcGRvd25zXHJcbiAgICB2YXIgaGFuZGxlRHJvcGRvd25zID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgIEhvbGQgZHJvcGRvd24gb24gY2xpY2tcclxuICAgICAgICAqL1xyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLmRyb3Bkb3duLW1lbnUuaG9sZC1vbi1jbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGhhbmRsZUFsZXJ0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtY2xvc2U9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJy5hbGVydCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLmhpZGUoKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ1tkYXRhLWNsb3NlPVwibm90ZVwiXScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLmhpZGUoKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ1tkYXRhLXJlbW92ZT1cIm5vdGVcIl0nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGUgSG93ZXIgRHJvcGRvd25zXHJcbiAgICB2YXIgaGFuZGxlRHJvcGRvd25Ib3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJ1tkYXRhLWhvdmVyPVwiZHJvcGRvd25cIl0nKS5ub3QoJy5ob3Zlci1pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZHJvcGRvd25Ib3ZlcigpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdob3Zlci1pbml0aWFsaXplZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGUgdGV4dGFyZWEgYXV0b3NpemVcclxuICAgIHZhciBoYW5kbGVUZXh0YXJlYUF1dG9zaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZihhdXRvc2l6ZSkgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGF1dG9zaXplKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhLmF1dG9zaXplbWUnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIFBvcG92ZXJzXHJcblxyXG4gICAgLy8gbGFzdCBwb3BlcCBwb3BvdmVyXHJcbiAgICB2YXIgbGFzdFBvcGVkUG9wb3ZlcjtcclxuXHJcbiAgICB2YXIgaGFuZGxlUG9wb3ZlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcucG9wb3ZlcnMnKS5wb3BvdmVyKCk7XHJcblxyXG4gICAgICAgIC8vIGNsb3NlIGxhc3QgZGlzcGxheWVkIHBvcG92ZXJcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLnBvcG92ZXIuZGF0YS1hcGknLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmIChsYXN0UG9wZWRQb3BvdmVyKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0UG9wZWRQb3BvdmVyLnBvcG92ZXIoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIHNjcm9sbGFibGUgY29udGVudHMgdXNpbmcgalF1ZXJ5IFNsaW1TY3JvbGwgcGx1Z2luLlxyXG4gICAgdmFyIGhhbmRsZVNjcm9sbGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKCcuc2Nyb2xsZXInKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBJbWFnZSBQcmV2aWV3IHVzaW5nIGpRdWVyeSBGYW5jeWJveCBwbHVnaW5cclxuICAgIHZhciBoYW5kbGVGYW5jeWJveCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghalF1ZXJ5LmZhbmN5Ym94KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKFwiLmZhbmN5Ym94LWJ1dHRvblwiKS5zaXplKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICQoXCIuZmFuY3lib3gtYnV0dG9uXCIpLmZhbmN5Ym94KHtcclxuICAgICAgICAgICAgICAgIGdyb3VwQXR0cjogJ2RhdGEtcmVsJyxcclxuICAgICAgICAgICAgICAgIHByZXZFZmZlY3Q6ICdub25lJyxcclxuICAgICAgICAgICAgICAgIG5leHRFZmZlY3Q6ICdub25lJyxcclxuICAgICAgICAgICAgICAgIGNsb3NlQnRuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaGVscGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnNpZGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEZpeCBpbnB1dCBwbGFjZWhvbGRlciBpc3N1ZSBmb3IgSUU4IGFuZCBJRTlcclxuICAgIHZhciBoYW5kbGVGaXhJbnB1dFBsYWNlaG9sZGVyRm9ySUUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL2ZpeCBodG1sNSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgZm9yIGllNyAmIGllOFxyXG4gICAgICAgIGlmIChpc0lFOCB8fCBpc0lFOSkgeyAvLyBpZTggJiBpZTlcclxuICAgICAgICAgICAgLy8gdGhpcyBpcyBodG1sNSBwbGFjZWhvbGRlciBmaXggZm9yIGlucHV0cywgaW5wdXRzIHdpdGggcGxhY2Vob2xkZXItbm8tZml4IGNsYXNzIHdpbGwgYmUgc2tpcHBlZChlLmc6IHdlIG5lZWQgdGhpcyBmb3IgcGFzc3dvcmQgZmllbGRzKVxyXG4gICAgICAgICAgICAkKCdpbnB1dFtwbGFjZWhvbGRlcl06bm90KC5wbGFjZWhvbGRlci1uby1maXgpLCB0ZXh0YXJlYVtwbGFjZWhvbGRlcl06bm90KC5wbGFjZWhvbGRlci1uby1maXgpJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbCgpID09PSAnJyAmJiBpbnB1dC5hdHRyKFwicGxhY2Vob2xkZXJcIikgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYWRkQ2xhc3MoXCJwbGFjZWhvbGRlclwiKS52YWwoaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaW5wdXQuZm9jdXMoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbCgpID09IGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PT0gJycgfHwgaW5wdXQudmFsKCkgPT0gaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWwoaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlIFNlbGVjdDIgRHJvcGRvd25zXHJcbiAgICB2YXIgaGFuZGxlU2VsZWN0MiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICgkKCkuc2VsZWN0Mikge1xyXG4gICAgICAgICAgICAkKCcuc2VsZWN0Mm1lJykuc2VsZWN0Mih7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJTZWxlY3RcIixcclxuICAgICAgICAgICAgICAgIGFsbG93Q2xlYXI6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBoYW5kbGUgZ3JvdXAgZWxlbWVudCBoZWlnaHRzXHJcbiAgICB2YXIgaGFuZGxlSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAkKCdbZGF0YS1hdXRvLWhlaWdodF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gJCgnW2RhdGEtaGVpZ2h0XScsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbW9kZSA9IHBhcmVudC5hdHRyKCdkYXRhLW1vZGUnKTtcclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHBhcnNlSW50KHBhcmVudC5hdHRyKCdkYXRhLW9mZnNldCcpID8gcGFyZW50LmF0dHIoJ2RhdGEtb2Zmc2V0JykgOiAwKTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLWhlaWdodCcpID09IFwiaGVpZ2h0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnaGVpZ2h0JywgJycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnbWluLWhlaWdodCcsICcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0XyA9IChtb2RlID09ICdiYXNlLWhlaWdodCcgPyAkKHRoaXMpLm91dGVySGVpZ2h0KCkgOiAkKHRoaXMpLm91dGVySGVpZ2h0KHRydWUpKTtcclxuICAgICAgICAgICAgICAgIGlmIChoZWlnaHRfID4gaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0XztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgKyBvZmZzZXQ7XHJcblxyXG4gICAgICAgICAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1oZWlnaHQnKSA9PSBcImhlaWdodFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdtaW4taGVpZ2h0JywgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyogRU5EOkNPUkUgSEFORExFUlMgKi8vXHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIHRoZSB0aGVtZVxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL0lNUE9SVEFOVCEhITogRG8gbm90IG1vZGlmeSB0aGUgY29yZSBoYW5kbGVycyBjYWxsIG9yZGVyLlxyXG5cclxuICAgICAgICAgICAgLy9Db3JlIGhhbmRsZXJzXHJcbiAgICAgICAgICAgIGhhbmRsZUluaXQoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHZhcmlhYmxlc1xyXG4gICAgICAgICAgICBoYW5kbGVPblJlc2l6ZSgpOyAvLyBzZXQgYW5kIGhhbmRsZSByZXNwb25zaXZlXHJcblxyXG4gICAgICAgICAgICAvL1VJIENvbXBvbmVudCBoYW5kbGVyc1xyXG4gICAgICAgICAgICBoYW5kbGVNYXRlcmlhbERlc2lnbigpOyAvLyBoYW5kbGUgbWF0ZXJpYWwgZGVzaWduXHJcbiAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTsgLy8gaGFuZmxlIGN1c3RvbSByYWRpbyAmIGNoZWNrYm94ZXNcclxuICAgICAgICAgICAgaGFuZGxlaUNoZWNrKCk7IC8vIGhhbmRsZXMgY3VzdG9tIGljaGVjayByYWRpbyBhbmQgY2hlY2tib3hlc1xyXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBTd2l0Y2goKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBzd2l0Y2ggcGx1Z2luXHJcbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbGVycygpOyAvLyBoYW5kbGVzIHNsaW0gc2Nyb2xsaW5nIGNvbnRlbnRzXHJcbiAgICAgICAgICAgIGhhbmRsZUZhbmN5Ym94KCk7IC8vIGhhbmRsZSBmYW5jeSBib3hcclxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0MigpOyAvLyBoYW5kbGUgY3VzdG9tIFNlbGVjdDIgZHJvcGRvd25zXHJcbiAgICAgICAgICAgIGhhbmRsZVBvcnRsZXRUb29scygpOyAvLyBoYW5kbGVzIHBvcnRsZXQgYWN0aW9uIGJhciBmdW5jdGlvbmFsaXR5KHJlZnJlc2gsIGNvbmZpZ3VyZSwgdG9nZ2xlLCByZW1vdmUpXHJcbiAgICAgICAgICAgIGhhbmRsZUFsZXJ0cygpOyAvL2hhbmRsZSBjbG9zYWJsZWQgYWxlcnRzXHJcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3ducygpOyAvLyBoYW5kbGUgZHJvcGRvd25zXHJcbiAgICAgICAgICAgIGhhbmRsZVRhYnMoKTsgLy8gaGFuZGxlIHRhYnNcclxuICAgICAgICAgICAgaGFuZGxlVG9vbHRpcHMoKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCB0b29sdGlwc1xyXG4gICAgICAgICAgICBoYW5kbGVQb3BvdmVycygpOyAvLyBoYW5kbGVzIGJvb3RzdHJhcCBwb3BvdmVyc1xyXG4gICAgICAgICAgICBoYW5kbGVBY2NvcmRpb25zKCk7IC8vaGFuZGxlcyBhY2NvcmRpb25zXHJcbiAgICAgICAgICAgIGhhbmRsZU1vZGFscygpOyAvLyBoYW5kbGUgbW9kYWxzXHJcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcENvbmZpcm1hdGlvbigpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIGNvbmZpcm1hdGlvbnNcclxuICAgICAgICAgICAgaGFuZGxlVGV4dGFyZWFBdXRvc2l6ZSgpOyAvLyBoYW5kbGUgYXV0b3NpemUgdGV4dGFyZWFzXHJcblxyXG4gICAgICAgICAgICAvL0hhbmRsZSBncm91cCBlbGVtZW50IGhlaWdodHNcclxuICAgICAgICAgICAgaGFuZGxlSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUmVzaXplSGFuZGxlcihoYW5kbGVIZWlnaHQpOyAvLyBoYW5kbGUgYXV0byBjYWxjdWxhdGluZyBoZWlnaHQgb24gd2luZG93IHJlc2l6ZVxyXG5cclxuICAgICAgICAgICAgLy8gSGFja3NcclxuICAgICAgICAgICAgaGFuZGxlRml4SW5wdXRQbGFjZWhvbGRlckZvcklFKCk7IC8vSUU4ICYgSUU5IGlucHV0IHBsYWNlaG9sZGVyIGlzc3VlIGZpeFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vbWFpbiBmdW5jdGlvbiB0byBpbml0aWF0ZSBjb3JlIGphdmFzY3JpcHQgYWZ0ZXIgYWpheCBjb21wbGV0ZVxyXG4gICAgICAgIGluaXRBamF4OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlVW5pZm9ybSgpOyAvLyBoYW5kbGVzIGN1c3RvbSByYWRpbyAmIGNoZWNrYm94ZXNcclxuICAgICAgICAgICAgaGFuZGxlaUNoZWNrKCk7IC8vIGhhbmRsZXMgY3VzdG9tIGljaGVjayByYWRpbyBhbmQgY2hlY2tib3hlc1xyXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBTd2l0Y2goKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBzd2l0Y2ggcGx1Z2luXHJcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3duSG92ZXIoKTsgLy8gaGFuZGxlcyBkcm9wZG93biBob3ZlclxyXG4gICAgICAgICAgICBoYW5kbGVTY3JvbGxlcnMoKTsgLy8gaGFuZGxlcyBzbGltIHNjcm9sbGluZyBjb250ZW50c1xyXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3QyKCk7IC8vIGhhbmRsZSBjdXN0b20gU2VsZWN0MiBkcm9wZG93bnNcclxuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTsgLy8gaGFuZGxlIGZhbmN5IGJveFxyXG4gICAgICAgICAgICBoYW5kbGVEcm9wZG93bnMoKTsgLy8gaGFuZGxlIGRyb3Bkb3duc1xyXG4gICAgICAgICAgICBoYW5kbGVUb29sdGlwcygpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHRvb2x0aXBzXHJcbiAgICAgICAgICAgIGhhbmRsZVBvcG92ZXJzKCk7IC8vIGhhbmRsZXMgYm9vdHN0cmFwIHBvcG92ZXJzXHJcbiAgICAgICAgICAgIGhhbmRsZUFjY29yZGlvbnMoKTsgLy9oYW5kbGVzIGFjY29yZGlvbnNcclxuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uKCk7IC8vIGhhbmRsZSBib290c3RyYXAgY29uZmlybWF0aW9uc1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vaW5pdCBtYWluIGNvbXBvbmVudHNcclxuICAgICAgICBpbml0Q29tcG9uZW50czogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEFqYXgoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byByZW1lbWJlciBsYXN0IG9wZW5lZCBwb3BvdmVyIHRoYXQgbmVlZHMgdG8gYmUgY2xvc2VkIG9uIGNsaWNrXHJcbiAgICAgICAgc2V0TGFzdFBvcGVkUG9wb3ZlcjogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgbGFzdFBvcGVkUG9wb3ZlciA9IGVsO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGFkZCBjYWxsYmFjayBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIG9uIHdpbmRvdyByZXNpemVcclxuICAgICAgICBhZGRSZXNpemVIYW5kbGVyOiBmdW5jdGlvbihmdW5jKSB7XHJcbiAgICAgICAgICAgIHJlc2l6ZUhhbmRsZXJzLnB1c2goZnVuYyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3RvbiB0byBjYWxsIF9ydW5yZXNpemVIYW5kbGVyc1xyXG4gICAgICAgIHJ1blJlc2l6ZUhhbmRsZXJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgX3J1blJlc2l6ZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvIHNjcm9sbChmb2N1cykgdG8gYW4gZWxlbWVudFxyXG4gICAgICAgIHNjcm9sbFRvOiBmdW5jdGlvbihlbCwgb2ZmZXNldCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gKGVsICYmIGVsLnNpemUoKSA+IDApID8gZWwub2Zmc2V0KCkudG9wIDogMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlcicpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLXRvcC1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyLXRvcCcpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLW1lbnUtZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlci1tZW51JykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwb3MgPSBwb3MgKyAob2ZmZXNldCA/IG9mZmVzZXQgOiAtMSAqIGVsLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHBvc1xyXG4gICAgICAgICAgICB9LCAnc2xvdycpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRTbGltU2Nyb2xsOiBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAkKGVsKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIGV4aXRcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhlaWdodFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9ICQodGhpcykuYXR0cihcImRhdGEtaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAkKHRoaXMpLmNzcygnaGVpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zbGltU2Nyb2xsKHtcclxuICAgICAgICAgICAgICAgICAgICBhbGxvd1BhZ2VTY3JvbGw6IHRydWUsIC8vIGFsbG93IHBhZ2Ugc2Nyb2xsIHdoZW4gdGhlIGVsZW1lbnQgc2Nyb2xsIGlzIGVuZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogJzdweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKSA/ICQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpIDogJyNiYmInKSxcclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhaWxDb2xvcjogKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKSA/ICQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKSA6ICcjZWFlYWVhJyksXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGlzUlRMID8gJ2xlZnQnIDogJ3JpZ2h0JyxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBhbHdheXNWaXNpYmxlOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1hbHdheXMtdmlzaWJsZVwiKSA9PSBcIjFcIiA/IHRydWUgOiBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmFpbFZpc2libGU6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKSA9PSBcIjFcIiA/IHRydWUgOiBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUZhZGVPdXQ6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIiwgXCIxXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZXN0cm95U2xpbVNjcm9sbDogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgJChlbCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpID09PSBcIjFcIikgeyAvLyBkZXN0cm95IGV4aXN0aW5nIGluc3RhbmNlIGJlZm9yZSB1cGRhdGluZyB0aGUgaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBjdXN0b20gYXR0cmlidXJlcyBzbyBsYXRlciB3ZSB3aWxsIHJlYXNzaWduLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtaGFuZGxlLWNvbG9yXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXdyYXBwZXItY2xhc3NcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXJhaWwtY29sb3JcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWFsd2F5cy12aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1hbHdheXMtdmlzaWJsZVwiXSA9ICQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtcmFpbC12aXNpYmxlXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyByZWFzc2lnbiBjdXN0b20gYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChhdHRyTGlzdCwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUuYXR0cihrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGZ1bmN0aW9uIHRvIHNjcm9sbCB0byB0aGUgdG9wXHJcbiAgICAgICAgc2Nyb2xsVG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gIGJsb2NrIGVsZW1lbnQoaW5kaWNhdGUgbG9hZGluZylcclxuICAgICAgICBibG9ja1VJOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj4nICsgJzxkaXYgY2xhc3M9XCJibG9jay1zcGlubmVyLWJhclwiPjxkaXYgY2xhc3M9XCJib3VuY2UxXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlM1wiPjwvZGl2PjwvZGl2PicgKyAnPC9kaXY+JztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmljb25Pbmx5KSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIgYWxpZ249XCJcIj48L2Rpdj4nO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMudGV4dE9ubHkpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48c3Bhbj4mbmJzcDsmbmJzcDsnICsgKG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMT0FESU5HLi4uJykgKyAnPC9zcGFuPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIgYWxpZ249XCJcIj48c3Bhbj4mbmJzcDsmbmJzcDsnICsgKG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMT0FESU5HLi4uJykgKyAnPC9zcGFuPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnRhcmdldCkgeyAvLyBlbGVtZW50IGJsb2NraW5nXHJcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSAkKG9wdGlvbnMudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5oZWlnaHQoKSA8PSAoJCh3aW5kb3cpLmhlaWdodCgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY2VucmVyWSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbC5ibG9jayh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaHRtbCxcclxuICAgICAgICAgICAgICAgICAgICBiYXNlWjogb3B0aW9ucy56SW5kZXggPyBvcHRpb25zLnpJbmRleCA6IDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyWTogb3B0aW9ucy5jZW5yZXJZICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNlbnJlclkgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDU1M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAnd2FpdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gcGFnZSBibG9ja2luZ1xyXG4gICAgICAgICAgICAgICAgJC5ibG9ja1VJKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBodG1sLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhc2VaOiBvcHRpb25zLnpJbmRleCA/IG9wdGlvbnMuekluZGV4IDogMTAwMCxcclxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDU1M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAnd2FpdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byAgdW4tYmxvY2sgZWxlbWVudChmaW5pc2ggbG9hZGluZylcclxuICAgICAgICB1bmJsb2NrVUk6IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAkKHRhcmdldCkudW5ibG9jayh7XHJcbiAgICAgICAgICAgICAgICAgICAgb25VbmJsb2NrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YXJnZXQpLmNzcygncG9zaXRpb24nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGFyZ2V0KS5jc3MoJ3pvb20nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkLnVuYmxvY2tVSSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RhcnRQYWdlTG9hZGluZzogZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLXNwaW5uZXItYmFyJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGFnZS1zcGlubmVyLWJhclwiPjxkaXYgY2xhc3M9XCJib3VuY2UxXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlM1wiPjwvZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtbG9hZGluZycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInBhZ2UtbG9hZGluZ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiLz4mbmJzcDsmbmJzcDs8c3Bhbj4nICsgKG9wdGlvbnMgJiYgb3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xvYWRpbmcuLi4nKSArICc8L3NwYW4+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdG9wUGFnZUxvYWRpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcucGFnZS1sb2FkaW5nLCAucGFnZS1zcGlubmVyLWJhcicpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFsZXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiBcIlwiLCAvLyBhbGVydHMgcGFyZW50IGNvbnRhaW5lcihieSBkZWZhdWx0IHBsYWNlZCBhZnRlciB0aGUgcGFnZSBicmVhZGNydW1icylcclxuICAgICAgICAgICAgICAgIHBsYWNlOiBcImFwcGVuZFwiLCAvLyBcImFwcGVuZFwiIG9yIFwicHJlcGVuZFwiIGluIGNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLCAvLyBhbGVydCdzIHR5cGVcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiXCIsIC8vIGFsZXJ0J3MgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgY2xvc2U6IHRydWUsIC8vIG1ha2UgYWxlcnQgY2xvc2FibGVcclxuICAgICAgICAgICAgICAgIHJlc2V0OiB0cnVlLCAvLyBjbG9zZSBhbGwgcHJldmlvdXNlIGFsZXJ0cyBmaXJzdFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsIC8vIGF1dG8gc2Nyb2xsIHRvIHRoZSBhbGVydCBhZnRlciBzaG93blxyXG4gICAgICAgICAgICAgICAgY2xvc2VJblNlY29uZHM6IDAsIC8vIGF1dG8gY2xvc2UgYWZ0ZXIgZGVmaW5lZCBzZWNvbmRzXHJcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiIC8vIHB1dCBpY29uIGJlZm9yZSB0aGUgbWVzc2FnZVxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpZCA9IE1ldHJvbmljLmdldFVuaXF1ZUlEKFwiTWV0cm9uaWNfYWxlcnRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwiTWV0cm9uaWMtYWxlcnRzIGFsZXJ0IGFsZXJ0LScgKyBvcHRpb25zLnR5cGUgKyAnIGZhZGUgaW5cIj4nICsgKG9wdGlvbnMuY2xvc2UgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9idXR0b24+JyA6ICcnKSArIChvcHRpb25zLmljb24gIT09IFwiXCIgPyAnPGkgY2xhc3M9XCJmYS1sZyBmYSBmYS0nICsgb3B0aW9ucy5pY29uICsgJ1wiPjwvaT4gICcgOiAnJykgKyBvcHRpb25zLm1lc3NhZ2UgKyAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuTWV0cm9uaWMtYWxlcnRzJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWNvbnRhaW5lci1iZy1zb2xpZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXRpdGxlJykuYWZ0ZXIoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcucGFnZS1iYXInKS5zaXplKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWJhcicpLmFmdGVyKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWJyZWFkY3J1bWInKS5hZnRlcihodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5wbGFjZSA9PSBcImFwcGVuZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChvcHRpb25zLmNvbnRhaW5lcikuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKG9wdGlvbnMuY29udGFpbmVyKS5wcmVwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5mb2N1cykge1xyXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oJCgnIycgKyBpZCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jbG9zZUluU2Vjb25kcyA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBvcHRpb25zLmNsb3NlSW5TZWNvbmRzICogMTAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplcyB1bmlmb3JtIGVsZW1lbnRzXHJcbiAgICAgICAgaW5pdFVuaWZvcm06IGZ1bmN0aW9uKGVscykge1xyXG4gICAgICAgICAgICBpZiAoZWxzKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVscykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnVuaWZvcm0oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvIHVwZGF0ZS9zeW5jIGpxdWVyeSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zXHJcbiAgICAgICAgdXBkYXRlVW5pZm9ybTogZnVuY3Rpb24oZWxzKSB7XHJcbiAgICAgICAgICAgICQudW5pZm9ybS51cGRhdGUoZWxzKTsgLy8gdXBkYXRlIHRoZSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zIFVJIGFmdGVyIHRoZSBhY3R1YWwgaW5wdXQgY29udHJvbCBzdGF0ZSBjaGFuZ2VkXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aGUgZmFuY3lib3ggcGx1Z2luXHJcbiAgICAgICAgaW5pdEZhbmN5Ym94OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBoZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGFjdHVhbCBpbnB1dCB2YWx1ZSh1c2VkIGluIElFOSBhbmQgSUU4IGR1ZSB0byBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgbm90IHN1cHBvcnRlZClcclxuICAgICAgICBnZXRBY3R1YWxWYWw6IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgIGVsID0gJChlbCk7XHJcbiAgICAgICAgICAgIGlmIChlbC52YWwoKSA9PT0gZWwuYXR0cihcInBsYWNlaG9sZGVyXCIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWwudmFsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gZ2V0IGEgcGFyZW1ldGVyIGJ5IG5hbWUgZnJvbSBVUkxcclxuICAgICAgICBnZXRVUkxQYXJhbWV0ZXI6IGZ1bmN0aW9uKHBhcmFtTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoU3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSksXHJcbiAgICAgICAgICAgICAgICBpLCB2YWwsIHBhcmFtcyA9IHNlYXJjaFN0cmluZy5zcGxpdChcIiZcIik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBwYXJhbXNbaV0uc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbFswXSA9PSBwYXJhbU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5lc2NhcGUodmFsWzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBjaGVjayBmb3IgZGV2aWNlIHRvdWNoIHN1cHBvcnRcclxuICAgICAgICBpc1RvdWNoRGV2aWNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiVG91Y2hFdmVudFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBUbyBnZXQgdGhlIGNvcnJlY3Qgdmlld3BvcnQgd2lkdGggYmFzZWQgb24gIGh0dHA6Ly9hbmR5bGFuZ3Rvbi5jby51ay9hcnRpY2xlcy9qYXZhc2NyaXB0L2dldC12aWV3cG9ydC1zaXplLWphdmFzY3JpcHQvXHJcbiAgICAgICAgZ2V0Vmlld1BvcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IHdpbmRvdyxcclxuICAgICAgICAgICAgICAgIGEgPSAnaW5uZXInO1xyXG4gICAgICAgICAgICBpZiAoISgnaW5uZXJXaWR0aCcgaW4gd2luZG93KSkge1xyXG4gICAgICAgICAgICAgICAgYSA9ICdjbGllbnQnO1xyXG4gICAgICAgICAgICAgICAgZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGVbYSArICdXaWR0aCddLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBlW2EgKyAnSGVpZ2h0J11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRVbmlxdWVJRDogZnVuY3Rpb24ocHJlZml4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncHJlZml4XycgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobmV3IERhdGUoKSkuZ2V0VGltZSgpKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBjaGVjayBJRTggbW9kZVxyXG4gICAgICAgIGlzSUU4OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzSUU4O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGNoZWNrIElFOSBtb2RlXHJcbiAgICAgICAgaXNJRTk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNJRTk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9jaGVjayBSVEwgbW9kZVxyXG4gICAgICAgIGlzUlRMOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzUlRMO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGNoZWNrIElFOCBtb2RlXHJcbiAgICAgICAgaXNBbmd1bGFySnNBcHA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBhbmd1bGFyID09ICd1bmRlZmluZWQnKSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBc3NldHNQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0QXNzZXRzUGF0aDogZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICBhc3NldHNQYXRoID0gcGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRHbG9iYWxJbWdQYXRoOiBmdW5jdGlvbihwYXRoKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbEltZ1BhdGggPSBwYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdsb2JhbEltZ1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbEltZ1BhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0R2xvYmFsUGx1Z2luc1BhdGg6IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgZ2xvYmFsUGx1Z2luc1BhdGggPSBwYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdsb2JhbFBsdWdpbnNQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGggKyBnbG9iYWxQbHVnaW5zUGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRHbG9iYWxDc3NQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGggKyBnbG9iYWxDc3NQYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGdldCBsYXlvdXQgY29sb3IgY29kZSBieSBjb2xvciBuYW1lXHJcbiAgICAgICAgZ2V0QnJhbmRDb2xvcjogZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoYnJhbmRDb2xvcnNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBicmFuZENvbG9yc1tuYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldFJlc3BvbnNpdmVCcmVha3BvaW50OiBmdW5jdGlvbihzaXplKSB7XHJcbiAgICAgICAgICAgIC8vIGJvb3RzdHJhcCByZXNwb25zaXZlIGJyZWFrcG9pbnRzXHJcbiAgICAgICAgICAgIHZhciBzaXplcyA9IHtcclxuICAgICAgICAgICAgICAgICd4cycgOiA0ODAsICAgICAvLyBleHRyYSBzbWFsbFxyXG4gICAgICAgICAgICAgICAgJ3NtJyA6IDc2OCwgICAgIC8vIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAnbWQnIDogOTkyLCAgICAgLy8gbWVkaXVtXHJcbiAgICAgICAgICAgICAgICAnbGcnIDogMTIwMCAgICAgLy8gbGFyZ2VcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzaXplc1tzaXplXSA/IHNpemVzW3NpemVdIDogMDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSAoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWV0cm9uaWM7IiwiY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5jbGFzcyBDb21tb24ge1xyXG5cclxuICAgIHN0YXRpYyBzcGxpdExpbmVzKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGV4dC5zcGxpdCgvXFxuLyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEV2ZW50VGltZSh0LCBub3cpIHtcclxuICAgICAgICBsZXQgdGltZSA9IG1vbWVudCh0LCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnKTtcclxuICAgICAgICBsZXQgbm93dGltZSA9IG1vbWVudChub3csICdZWVlZLU1NLUREIEhIOm1tOnNzLlNTUycpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0OiAgICAgICAnICsgdCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vdzogICAgICcgKyBub3cpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aW1lOiAgICAnICsgdGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgdGltZS5pc1ZhbGlkKCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3d0aW1lOiAnICsgbm93dGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgbm93dGltZS5pc1ZhbGlkKCkpO1xyXG4gICAgICAgIHJldHVybiB0aW1lLmZyb20obm93dGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNsYXNzSWYoa2xhc3MsIGIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbGFzc0lmOiAnICsga2xhc3MgKyAnLCAnICsgYik7XHJcbiAgICAgICAgcmV0dXJuIChiID8ga2xhc3MgOiAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYXZvaWQgJyRhcHBseSBhbHJlYWR5IGluIHByb2dyZXNzJyBlcnJvciAoc291cmNlOiBodHRwczovL2NvZGVyd2FsbC5jb20vcC9uZ2lzbWEpXHJcbiAgICBzdGF0aWMgc2FmZUFwcGx5KGZuKSB7XHJcbiAgICAgICAgaWYgKGZuICYmICh0eXBlb2YgKGZuKSA9PT0gJ2Z1bmN0aW9uJykpIHtcclxuICAgICAgICAgICAgZm4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc291cmNlOiBodHRwOi8vY3RybHEub3JnL2NvZGUvMTk2MTYtZGV0ZWN0LXRvdWNoLXNjcmVlbi1qYXZhc2NyaXB0XHJcbiAgICBzdGF0aWMgaXNUb3VjaERldmljZSgpIHtcclxuICAgICAgICByZXR1cm4gKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IChuYXZpZ2F0b3IuTWF4VG91Y2hQb2ludHMgPiAwKSB8fCAobmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFRpY2tzRnJvbURhdGUoZGF0ZSkge1xyXG4gICAgICAgIGxldCByZXQgPSBudWxsO1xyXG4gICAgICAgIGlmKGRhdGUgJiYgZGF0ZS5nZXRUaW1lKSB7XHJcbiAgICAgICAgICAgIHJldCA9IGRhdGUuZ2V0VGltZSgpLzEwMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1vbjsiLCJpZiAoIVN0cmluZy5wcm90b3R5cGUuZm9ybWF0KSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24gKG1hdGNoLCBudW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhcmdzW251bWJlcl0gIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgPyBhcmdzW251bWJlcl1cbiAgICAgICAgICAgICAgOiBtYXRjaFxuICAgICAgICAgICAgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufSIsImNvbnN0IHV1aWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaGV4RGlnaXRzLCBpLCBzLCB1dWlkO1xyXG4gICAgcyA9IFtdO1xyXG4gICAgcy5sZW5ndGggPSAzNjtcclxuICAgIGhleERpZ2l0cyA9ICcwMTIzNDU2Nzg5YWJjZGVmJztcclxuICAgIGkgPSAwO1xyXG4gICAgd2hpbGUgKGkgPCAzNikge1xyXG4gICAgICAgIHNbaV0gPSBoZXhEaWdpdHMuc3Vic3RyKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDB4MTApLCAxKTtcclxuICAgICAgICBpICs9IDE7XHJcbiAgICB9XHJcbiAgICBzWzE0XSA9ICc0JztcclxuICAgIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKTtcclxuICAgIHNbOF0gPSBzWzEzXSA9IHNbMThdID0gc1syM10gPSAnLSc7XHJcbiAgICB1dWlkID0gcy5qb2luKCcnKTtcclxuICAgIHJldHVybiB1dWlkO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1dWlkOyJdfQ==
