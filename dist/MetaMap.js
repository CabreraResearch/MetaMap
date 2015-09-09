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
            this.Integrations.sendEvent(val, 'event', 'log', 'label');
            window.console.info(val);
        }
    }, {
        key: 'error',
        value: function error(val) {
            window.console.error(val);
            this.Integrations.sendEvent(val, 'exception');
            this.airbrake.notify(val);
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.MetaFire.logout();
            this.Auth0.logout();
        }
    }]);

    return MetaMap;
})();

var mm = new MetaMap();
module.exports = mm;

},{"./js/app//Config.js":13,"./js/app/Eventer.js":14,"./js/app/Integrations":16,"./js/app/Router.js":17,"./js/app/auth0":18,"./js/app/user.js":19,"./js/integrations/google.js":41,"./js/pages/PageFactory.js":42,"./js/tools/shims.js":63,"airbrake-js":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"jquery":undefined,"jquery-ui":undefined,"lodash":undefined,"riot":"riot"}],2:[function(require,module,exports){
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

},{"../constants/constants":23,"./ActionBase.js":3,"./CopyMap.js":4,"./DeleteMap.js":5,"./Feedback":6,"./Home.js":7,"./Logout.js":8,"./MyMaps.js":9,"./NewMap.js":10,"./OpenMap.js":11,"./Terms.js":12}],3:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"../constants/constants":23}],4:[function(require,module,exports){
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

},{"../constants/constants":23,"./ActionBase.js":3}],5:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"../constants/constants":23,"./ActionBase.js":3,"lodash":undefined}],6:[function(require,module,exports){
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

},{"../constants/constants":23,"../tags/pages/home":59,"./ActionBase.js":3,"riot":"riot"}],8:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"../constants/constants":23,"./ActionBase.js":3,"lodash":undefined}],9:[function(require,module,exports){
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

},{"../constants/constants":23,"../tags/pages/my-maps":60,"./ActionBase.js":3,"riot":"riot"}],10:[function(require,module,exports){
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

},{"../constants/constants":23,"./ActionBase.js":3}],11:[function(require,module,exports){
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

},{"../constants/constants":23,"../tags/canvas/meta-canvas.js":43,"./ActionBase.js":3,"riot":"riot"}],12:[function(require,module,exports){
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

},{"../constants/constants":23,"../tags/pages/terms":61,"./ActionBase.js":3,"riot":"riot"}],13:[function(require,module,exports){
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
					_this2[name].setUser();
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

			_.each(this._features, function (Feature, name) {
				if (name) {
					var _name;

					(_name = _this3[name]).sendEvent.apply(_name, [val].concat(params));
				}
			});
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

},{"../integrations/AddThis":32,"../integrations/Facebook":33,"../integrations/Google":34,"../integrations/Intercom":35,"../integrations/NewRelic":36,"../integrations/Twitter":37,"../integrations/UserSnap":38,"../integrations/Zendesk":39,"lodash":undefined}],17:[function(require,module,exports){
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

},{"../constants/constants":23,"riot":"riot"}],18:[function(require,module,exports){
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

},{"../../MetaMap":1,"../tools/Common":62,"../tools/uuid.js":64}],20:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var jsPlumb = window.jsPlumb;
var jsPlumbToolkit = window.jsPlumbToolkit;

var Canvas = (function () {
    function Canvas(map, mapId) {
        var _this = this;

        _classCallCheck(this, Canvas);

        this.map = map;
        this.mapId = mapId;
        this.toolkit = {};
        this.metaMap = require('../../MetaMap');

        jsPlumbToolkit.ready(function () {
            _this.toolkit = window.toolkit = jsPlumbToolkit.newInstance({
                autoSave: true,
                saveUrl: 'https://localhost:10',
                onAutoSaveError: function onAutoSaveError(msg) {
                    var postData = {
                        data: _this.toolkit.exportData(),
                        changed_by: _this.metaMap.User.userKey
                    };
                    // $scope.map.loadMapExtraData(response.data.map);
                    _this.metaMap.MetaFire.setDataInTransaction(postData, 'maps/data/' + _this.mapId);
                    _this.metaMap.Integrations.sendEvent(_this.mapId, 'event', 'autosave', 'autosave');
                },
                onAutoSaveSuccess: function onAutoSaveSuccess(response) {
                    console.log('Success should not happen');
                },
                model: {
                    beforeStartConnect: function beforeStartConnect(fromNode, edgeType) {
                        return true;
                    },
                    beforeConnect: function beforeConnect(fromNode, toNode) {
                        return true;
                    }
                }
            });

            //
            // dummy for a new node.
            //
            var _newNode = function _newNode() {
                return {
                    w: 150,
                    h: 150,
                    label: 'idea',
                    type: 'idea'
                };
            };

            var mainElement = document.querySelector('.jtk-demo-main'),
                canvasElement = mainElement.querySelector('.jtk-demo-canvas'),
                miniviewElement = mainElement.querySelector('.miniview');

            var renderer = _this.toolkit.render({
                container: canvasElement,
                miniview: {
                    container: miniviewElement
                },
                layout: {
                    type: 'Spring',
                    absoluteBacked: false
                },
                zoomToFit: true,
                view: {
                    nodes: {
                        'default': {
                            template: 'tmplNode',
                            parameters: {
                                w: 150,
                                h: 150
                            }
                        }
                    },
                    edges: {
                        'default': {
                            anchor: ['Perimeter', { shape: 'Circle' }]
                        },
                        relationship: {
                            cssClass: 'edge-relationship',
                            connector: 'StateMachine',
                            endpoint: 'Blank',
                            overlays: [['PlainArrow', { location: 1, width: 10, length: 10, cssClass: 'relationship-overlay' }]]
                        },
                        perspective: {
                            connector: 'StateMachine',
                            cssClass: 'edge-perspective',
                            endpoints: ['Blank', ['Dot', { radius: 10, cssClass: 'orange' }]]
                        }
                    }
                },
                events: {
                    canvasDblClick: function canvasDblClick(e) {
                        // add an Idea node at the location at which the event occurred.
                        var pos = renderer.mapEventLocation(e);
                        _this.toolkit.addNode(jsPlumb.extend(_newNode(), pos));
                    },
                    nodeAdded: _registerHandlers // see below
                },
                dragOptions: {
                    filter: '.segment', // can't drag nodes by the color segments.
                    stop: function stop() {},
                    start: function start(params) {}
                }
            });

            //  ----------------------------------------------------------------------------------------
            //
            //    Mouse handlers. Some are wired up; all log the current node data to the console.
            //
            // -----------------------------------------------------------------------------------------

            var _types = ['red', 'orange', 'green', 'blue'];

            var _clickHandlers = {
                'click': {
                    'red': function red(el, node) {
                        console.log('click red');
                        console.dir(node.data);
                        _info('Double click to create a new idea. Right-click to mark with a distinction flag');
                    },
                    'green': function green(el, node) {
                        console.log('click green');
                        console.dir(node.data);
                        _info('Double click to add a part. Single click to show/hide parts');
                    },
                    'orange': function orange(el, node) {
                        console.log('click orange');
                        console.dir(node.data);
                        _info('Drag to create a Perspective. Double click to open Perspective Editor');
                    },
                    'blue': function blue(el, node) {
                        console.log('click blue');
                        console.dir(node.data);
                        _info('Double click to create a new related idea. Drag to relate to an existing idea.');
                    }
                },
                'dblclick': {
                    'red': function red(el, node) {
                        console.log('double click red');
                        console.dir(node.data);
                    },
                    'green': function green(el, node) {
                        console.log('double click green');
                        console.dir(node.data);
                    },
                    'orange': function orange(el, node) {
                        console.log('double click orange');
                        console.dir(node.data);
                    },
                    'blue': function blue(el, node) {
                        console.log('double click blue');
                        console.dir(node.data);
                        _this.toolkit.batch(function () {
                            var newNode = _this.toolkit.addNode(_newNode());
                            _this.toolkit.connect({ source: node, target: newNode, data: {
                                    type: 'perspective'
                                } });
                        });
                    }
                }
            };

            var _curryHandler = function _curryHandler(el, segment, node) {
                var _el = el.querySelector('.' + segment);
                jsPlumb.on(_el, 'click', function () {
                    _clickHandlers['click'][segment](el, node);
                });
                jsPlumb.on(_el, 'dblclick', function () {
                    _clickHandlers['dblclick'][segment](el, node);
                });
            };

            //
            // setup the clicking actions and the label drag (which is a little shaky right now; jsPlumb's
            // drag is not exactly intended as an ad-hoc drag because it assumes things about the node's
            // offsetParent. a simple, dedicated, drag handler is simple to write)
            //
            function _registerHandlers(params) {
                // here you have params.el, the DOM element
                // and params.node, the underlying node. it has a `data` member with the node's payload.
                var el = params.el,
                    node = params.node,
                    label = el.querySelector('.name');
                for (var i = 0; i < _types.length; i++) {
                    _curryHandler(el, _types[i], node);
                }

                // make the label draggable (see note above).
                jsPlumb.draggable(label, {
                    stop: function stop(e) {
                        node.data.labelPosition = [parseInt(label.style.left, 10), parseInt(label.style.top, 10)];
                    }
                });
            }

            function _info(text) {
                document.getElementById('info').innerHTML = text;
            }

            // --------------------------------------------------------------------------------------------------------
            // a couple of random examples of the filter function, allowing you to query your data
            // --------------------------------------------------------------------------------------------------------

            var countEdgesOfType = function countEdgesOfType(type) {
                return _this.toolkit.filter(function (obj) {
                    return obj.objectType == 'Edge' && obj.data.type === type;
                }).getEdgeCount();
            };
            var dumpEdgeCounts = function dumpEdgeCounts() {
                console.log('There are ' + countEdgesOfType('relationship') + ' relationship edges');
                console.log('There are ' + countEdgesOfType('perspective') + ' perspective edges');
            };

            jsPlumb.on('relationshipEdgeDump', 'click', dumpEdgeCounts());

            _this.toolkit.bind('dataUpdated', function () {
                dumpEdgeCounts();
            });
        }); //jsPlumb.ready
    }

    // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.

    _createClass(Canvas, [{
        key: 'init',
        value: function init() {
            if (this.map && this.map.data) {
                this.toolkit.load({
                    type: 'json',
                    data: this.map.data
                });
            }
        }
    }]);

    return Canvas;
})();

module.exports = Canvas;

},{"../../MetaMap":1}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
'use strict';

var CANVAS = {
    LEFT: 'left',
    RIGHT: 'right'
};

Object.freeze(CANVAS);

module.exports = CANVAS;

},{}],23:[function(require,module,exports){
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

},{"./actions":21,"./canvas":22,"./dsrp":24,"./editStatus":25,"./elements":26,"./events":27,"./pages":28,"./routes":29,"./tabs":30,"./tags":31}],24:[function(require,module,exports){
'use strict';

var DSRP = {
	D: 'D',
	S: 'S',
	R: 'R',
	P: 'P'
};

Object.freeze(DSRP);

module.exports = DSRP;

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
'use strict';

var ELEMENTS = {
    APP_CONTAINER: 'app-container',
    META_PROGRESS: 'meta_progress',
    META_PROGRESS_NEXT: 'meta_progress_next'
};

Object.freeze(ELEMENTS);

module.exports = ELEMENTS;

},{}],27:[function(require,module,exports){
'use strict';

var EVENTS = {
	SIDEBAR_OPEN: 'sidebar-open',
	SIDEBAR_CLOSE: 'sidebar-close',
	PAGE_NAME: 'pageName',
	NAV: 'nav',
	MAP: 'map'
};

Object.freeze(EVENTS);

module.exports = EVENTS;

},{}],28:[function(require,module,exports){
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

},{"./actions.js":21,"lodash":undefined}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
'use strict';

var TAGS = {
    META_CANVAS: 'meta-canvas',
    HOME: 'home',
    TERMS: 'terms',
    MY_MAPS: 'my-maps'
};

Object.freeze(TAGS);

module.exports = TAGS;

},{}],32:[function(require,module,exports){
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

},{"./_IntegrationsBase":40}],33:[function(require,module,exports){
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

},{"./_IntegrationsBase":40,"./google":41}],34:[function(require,module,exports){
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

},{"./_IntegrationsBase":40}],35:[function(require,module,exports){
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

},{"./_IntegrationsBase":40}],36:[function(require,module,exports){
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
            this.integration.setCustomAttribute('username', this.user.email);
            this.integration.setCustomAttribute('acccountID', this.user.userId);
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

},{"./_IntegrationsBase":40}],37:[function(require,module,exports){
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

},{"./_IntegrationsBase":40,"./google":41}],38:[function(require,module,exports){
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
        if (apiKey) {
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

},{"./_IntegrationsBase":40,"./google":41}],39:[function(require,module,exports){
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

},{"./_IntegrationsBase":40}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"./_IntegrationsBase":40}],42:[function(require,module,exports){
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

},{"../actions/Action.js":2,"../constants/constants":23,"../tags/page-body.js":50}],43:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var Canvas = require('../../canvas/canvas');
var d3 = require('d3');
require('./node');

var html = '\n<div class="portlet light jtk-demo-main" style="padding: 0; ">\n    <div class="jtk-demo-canvas canvas-wide" id="diagram">\n\n    </div>\n    <div class="miniview"></div>\n</div>\n<div id="info"></div>\n';

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
            height: window.innerHeight - 154 + 'px'
        });
    };

    this.on('update', function () {
        _this.correctHeight();
    });

    $(window).resize(function () {
        _this.correctHeight();
    });
});

},{"../../../MetaMap.js":1,"../../canvas/canvas":20,"./node":44,"d3":undefined,"riot":"riot"}],44:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var Editor = require('../../canvas/canvas');
var d3 = require('d3');

var html = '\n';

module.exports = riot.tag('node', html, function (opts) {});

},{"../../canvas/canvas":20,"d3":undefined,"riot":"riot"}],45:[function(require,module,exports){
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

},{"../../../MetaMap":1,"riot":"riot"}],46:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"riot":"riot"}],47:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"riot":"riot"}],48:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n                    <span class="username username-hide-on-mobile">\n                        { username }\n                    </span>\n                    <img alt="" height="39" width="39" class="img-circle" src="{ picture }" />\n                </a>\n                <ul class="dropdown-menu dropdown-menu-default">\n                    <li if="{ menu }"\n                        each="{ menu }"\n                        onclick="{ parent.onClick }">\n                        <a href="{ link }">\n                            <i class="{ icon }"></i> { title }\n                        </a>\n                    </li>\n                </ul>\n';

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

},{"../../../MetaMap.js":1,"riot":"riot"}],49:[function(require,module,exports){
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

},{"../../MetaMap":1,"../constants/constants":23,"../tools/shims":63,"riot":"riot"}],50:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageHeader = require('./page-header');
var pageContainer = require('./page-container');
var pageFooter = require('./page-footer');
var CONSTANTS = require('../constants/constants');

var html = '\n<div id="page_body" class="page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo">\n\n    <div id="meta_page_header"></div>\n\n    <div class="clearfix">\n    </div>\n\n    <div id="meta_page_container"></div>\n\n</div>\n\n<div id="meta_page_footer"></div>';

module.exports = riot.tag('page-body', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('mount', function () {
        riot.mount(_this.meta_page_header, 'page-header');
        riot.mount(_this.meta_page_container, 'page-container');
        //        riot.mount(this.meta_page_dialog, 'meta-dialog');
        riot.mount(_this.meta_page_footer, 'page-footer');
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        $(_this.page_body).addClass('page-sidebar-reversed');
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        $(_this.page_body).removeClass('page-sidebar-reversed');
    });
});

},{"../../MetaMap":1,"../constants/constants":23,"./page-container":51,"./page-footer":53,"./page-header":54,"riot":"riot"}],51:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageSidebar = require('./page-sidebar.js');
var pageContent = require('./page-content.js');

var html = '\n<div class="page-container">\n    <div id="meta_page_sidebar"></div>\n    <div id="meta_page_content"></div>\n</div>\n';

module.exports = riot.tag('page-container', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('mount', function () {
        riot.mount(_this.meta_page_sidebar, 'page-sidebar');
        riot.mount(_this.meta_page_content, 'page-content');
    });
});

},{"../../MetaMap":1,"./page-content.js":52,"./page-sidebar.js":57,"riot":"riot"}],52:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');
var _ = require('lodash');

var html = '\n<div class="page-content-wrapper">\n    <div id="page-content" class="page-content">\n\n        <div class="page-head">\n\n        </div>\n\n\n        <div id="app-container">\n\n        </div>\n    </div>\n</div>\n';

module.exports = riot.tag('page-content', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        var width = window.innerWidth;
        $(_this['app-container']).css({ width: width - 46 + 'px' });
    });

    $(window).on('resize', function () {
        $(_this['app-container']).css({ width: '100%' });
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        $(_this['app-container']).css({ width: '100%' });
    });
});

},{"../../MetaMap":1,"../constants/constants":23,"lodash":undefined,"riot":"riot"}],53:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<div class="page-footer" style="position: fixed; bottom: 0;">\n    <div class="page-footer-inner">\n        <a href="#terms">&copy;2015</a>\n    </div>\n</div>\n';

module.exports = riot.tag('page-footer', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],54:[function(require,module,exports){
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

},{"../../MetaMap":1,"./page-actions.js":49,"./page-logo.js":55,"./page-search.js":56,"./page-topmenu":58,"riot":"riot"}],55:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');

var html = '\n<div class ="page-logo">\n    <a id="meta_logo" href="#home">\n        <img src="assets/img/metamap_cloud.png" alt="logo" class ="logo-default" />\n    </a>\n    <div id="meta_menu_toggle" class ="menu-toggler sidebar-toggler" style="{ getDisplay(\'menu\') }">\n        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->\n    </div>\n</div>\n<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">\n</a>\n';

module.exports = riot.tag('page-logo', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');
    this.display = true;

    this.getDisplay = function (el) {

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

},{"../../MetaMap":1,"../constants/constants":23,"riot":"riot"}],56:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<!-- DOC: Apply "search-form-expanded" right after the "search-form" class to have half expanded search box -->\n<form class="search-form" action="extra_search.html" method="GET">\n    <div class="input-group">\n        <input type="text" class="form-control input-sm" placeholder="Search..." name="query">\n            <span class="input-group-btn">\n                <a href="javascript:;" class="btn submit">\n                    <i class="fa fa-search"></i>\n                </a>\n            </span>\n        </div>\n</form>\n';

module.exports = riot.tag('page-search', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],57:[function(require,module,exports){
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

},{"../../MetaMap":1,"../constants/constants":23,"riot":"riot"}],58:[function(require,module,exports){
'use strict';

var riot = require('riot');
var metaPoints = require('./menu/meta-points.js');
var metaHelp = require('./menu/meta-help.js');
var metaUser = require('./menu/meta-user.js');
var metaNot = require('./menu/meta-notifications.js');

var html = '\n<div class="top-menu">\n    <ul class="nav navbar-nav pull-right">\n        <li class="separator hide"></li>\n        <li class="dropdown" id="header_dashboard_bar" onclick="{ onClick }">\n            <a class="dropdown-toggle" href="#home">\n                <i class="fa fa-home"></i>\n            </a>\n        </li>\n        \n        <li class="separator hide"></li>\n        <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_notification_bar"></li>\n\n        <li class="separator hide"></li>\n        <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_points_bar"></li>\n                   \n        <li class="separator hide"></li>\n        <li id="header_help_bar" class="dropdown dropdown-extended dropdown-notification dropdown"></li>\n            \n        <li class="separator hide"></li>\n        <li id="header_user_menu" class="dropdown dropdown-user dropdown"></li>\n    </ul>\n</div>\n';

module.exports = riot.tag('page-topmenu', html, function (opts) {
    var _this = this;

    this.onClick = function (event, params) {
        console.log(event, params);
        return true;
    };

    this.on('mount', function () {
        riot.mount(_this.header_points_bar, 'meta-points');
        riot.mount(_this.header_notification_bar, 'meta-notifications');
        riot.mount(_this.header_help_bar, 'meta-help');
        riot.mount(_this.header_user_menu, 'meta-user');
    });
});

},{"./menu/meta-help.js":45,"./menu/meta-notifications.js":46,"./menu/meta-points.js":47,"./menu/meta-user.js":48,"riot":"riot"}],59:[function(require,module,exports){
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

},{"../../../MetaMap":1,"../../constants/constants":23,"riot":"riot"}],60:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"../../actions/DeleteMap.js":5,"../../constants/constants":23,"lodash":undefined,"moment":undefined,"riot":"riot"}],61:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"../../constants/constants":23,"riot":"riot"}],62:[function(require,module,exports){
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

},{"moment":undefined}],63:[function(require,module,exports){
'use strict';

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

},{}],64:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3B5TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRGVsZXRlTWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvRmVlZGJhY2suanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Ib21lLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTG9nb3V0LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTXlNYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTmV3TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvT3Blbk1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9Db25maWcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0V2ZW50ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9JbnRlZ3JhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1JvdXRlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hcHAvYXV0aDAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL3VzZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY2FudmFzL2NhbnZhcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvYWN0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvY2FudmFzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9jb25zdGFudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2RzcnAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VkaXRTdGF0dXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VsZW1lbnRzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ldmVudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3BhZ2VzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9yb3V0ZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3RhYnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3RhZ3MuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL0FkZFRoaXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL0ZhY2Vib29rLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Hb29nbGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL0ludGVyY29tLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9OZXdSZWxpYy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvVHdpdHRlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvVXNlclNuYXAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1plbmRlc2suanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL19JbnRlZ3JhdGlvbnNCYXNlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9nb29nbGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvcGFnZXMvUGFnZUZhY3RvcnkuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9jYW52YXMvbWV0YS1jYW52YXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9jYW52YXMvbm9kZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1oZWxwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLW5vdGlmaWNhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtcG9pbnRzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLXVzZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWFjdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWJvZHkuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRhaW5lci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtY29udGVudC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtZm9vdGVyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1oZWFkZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWxvZ28uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXNlYXJjaC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2lkZWJhci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtdG9wbWVudS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL2hvbWUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9teS1tYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdGVybXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvQ29tbW9uLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3NoaW1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3Rvb2xzL3V1aWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkIsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVyQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN6QyxJQUFNLE1B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QyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7QUFDMUIsS0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNQLEtBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2QsYUFBUyxHQUFHLGtCQUFrQixDQUFDO0FBQy9CLEtBQUMsR0FBRyxDQUFDLENBQUM7QUFDTixXQUFPLENBQUMsR0FBRyxFQUFFLEVBQUU7QUFDWCxTQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3RCxTQUFDLElBQUksQ0FBQyxDQUFDO0tBQ1Y7QUFDRCxLQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ1osS0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxLQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ25DLFFBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCLFdBQU8sSUFBSSxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCdiYWJlbC9wb2x5ZmlsbCcpO1xyXG5yZXF1aXJlKCdjb3JlLWpzJyk7XHJcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5yZXF1aXJlKCdqcXVlcnktdWknKTtcclxucmVxdWlyZSgnYm9vdHN0cmFwJyk7XHJcbndpbmRvdy5yaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG53aW5kb3cuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG53aW5kb3cuUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XHJcblxyXG5jb25zdCBBdXRoMCA9IHJlcXVpcmUoJy4vanMvYXBwL2F1dGgwJyk7XHJcbmNvbnN0IFVzZXIgPSByZXF1aXJlKCcuL2pzL2FwcC91c2VyLmpzJyk7XHJcbmNvbnN0IFJvdXRlciA9IHJlcXVpcmUoJy4vanMvYXBwL1JvdXRlci5qcycpO1xyXG5jb25zdCBFdmVudGVyID0gcmVxdWlyZSgnLi9qcy9hcHAvRXZlbnRlci5qcycpO1xyXG5jb25zdCBQYWdlRmFjdG9yeSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvUGFnZUZhY3RvcnkuanMnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgQ29uZmlnID0gcmVxdWlyZSgnLi9qcy9hcHAvL0NvbmZpZy5qcycpO1xyXG5jb25zdCBnYSA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcycpO1xyXG5jb25zdCBzaGltcyA9IHJlcXVpcmUoJy4vanMvdG9vbHMvc2hpbXMuanMnKTtcclxuY29uc3QgQWlyYnJha2VDbGllbnQgPSByZXF1aXJlKCdhaXJicmFrZS1qcycpXHJcbmNvbnN0IEludGVncmF0aW9ucyA9IHJlcXVpcmUoJy4vanMvYXBwL0ludGVncmF0aW9ucycpXHJcblxyXG5jbGFzcyBNZXRhTWFwIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLkNvbmZpZyA9IG5ldyBDb25maWcoKTtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IHRoaXMuQ29uZmlnLmNvbmZpZztcclxuICAgICAgICB0aGlzLk1ldGFGaXJlID0gdGhpcy5Db25maWcuTWV0YUZpcmU7XHJcbiAgICAgICAgdGhpcy5FdmVudGVyID0gbmV3IEV2ZW50ZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5haXJicmFrZSA9IG5ldyBBaXJicmFrZUNsaWVudCh7IHByb2plY3RJZDogMTE0OTAwLCBwcm9qZWN0S2V5OiAnZGM5NjExZGI2Zjc3MTIwY2NlY2QxYTI3Mzc0NWE1YWUnIH0pO1xyXG4gICAgICAgIHRoaXMub25SZWFkeSgpO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIFByb21pc2Uub25Qb3NzaWJseVVuaGFuZGxlZFJlamVjdGlvbihmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhhdC5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvbmZpZy5vblJlYWR5KCkudGhlbigoY29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5BdXRoMCA9IG5ldyBBdXRoMChjb25maWcuYXV0aDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5BdXRoMC5sb2dpbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUubG9naW4oKS50aGVuKChhdXRoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Vc2VyID0gbmV3IFVzZXIocHJvZmlsZSwgYXV0aCwgdGhpcy5FdmVudGVyLCB0aGlzLk1ldGFGaXJlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucyA9IG5ldyBJbnRlZ3JhdGlvbnModGhpcywgdGhpcy5Vc2VyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlVzZXIub25SZWFkeSgpLnRoZW4oKHVzZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYWdlRmFjdG9yeSA9IG5ldyBQYWdlRmFjdG9yeSh0aGlzLkV2ZW50ZXIsIHRoaXMuTWV0YUZpcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvdXRlciA9IG5ldyBSb3V0ZXIodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZyh2YWwpIHtcclxuICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXZlbnQnLCAnbG9nJywgJ2xhYmVsJylcclxuICAgICAgICB3aW5kb3cuY29uc29sZS5pbmZvKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXJyb3IodmFsKSB7XHJcbiAgICAgICAgd2luZG93LmNvbnNvbGUuZXJyb3IodmFsKTtcclxuICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXhjZXB0aW9uJylcclxuICAgICAgICB0aGlzLmFpcmJyYWtlLm5vdGlmeSh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ291dCgpO1xyXG4gICAgICAgIHRoaXMuQXV0aDAubG9nb3V0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IG1tID0gbmV3IE1ldGFNYXAoKTtcclxubW9kdWxlLmV4cG9ydHMgPSBtbTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIEFjdGlvbiBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLl9hY3Rpb25zID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgX2dldEFjdGlvbihhY3Rpb24pIHtcclxuICAgICAgICBsZXQgcmV0ID0gdGhpcy5fYWN0aW9uc1thY3Rpb25dO1xyXG4gICAgICAgIGlmICghcmV0KSB7XHJcbiAgICAgICAgICAgIGxldCBNZXRob2QgPSBudWxsO1xyXG4gICAgICAgICAgICBzd2l0Y2goYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLk1BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL09wZW5NYXAuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTkVXX01BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL05ld01hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5DT1BZX01BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0NvcHlNYXAuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0RlbGV0ZU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5NWV9NQVBTOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTXlNYXBzLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0xvZ291dC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5URVJNU19BTkRfQ09ORElUSU9OUzpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL1Rlcm1zLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vRmVlZGJhY2snKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Ib21lLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0ID0gbmV3IE1ldGhvZCh0aGlzLm1ldGFGaXJlLCB0aGlzLmV2ZW50ZXIsIHRoaXMucGFnZUZhY3RvcnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1thY3Rpb25dID0gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGFjdGlvbiwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KCk7XHJcbiAgICAgICAgbGV0IG1ldGhvZCA9IHRoaXMuX2dldEFjdGlvbihhY3Rpb24pO1xyXG4gICAgICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5hY3QoLi4ucGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbjsiLCJjb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKG1ldGFGaXJlLCBldmVudGVyLCBwYWdlRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xyXG4gICAgICAgIHRoaXMucGFnZUZhY3RvcnkgPSBwYWdlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0b2dnbGVTaWRlYmFyKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2lkZWJhck9wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuU2lkZWJhcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvcGVuU2lkZWJhcigpIHtcclxuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbG9zZVNpZGViYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zaWRlYmFyT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbkJhc2U7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBDb3B5TWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIGlmICghaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignTXVzdCBoYXZlIGEgbWFwIGluIG9yZGVyIHRvIGNvcHkuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG9sZE1hcCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3TWFwID0ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmFwcGVuZENvcHkob2xkTWFwLm5hbWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7aWR9YCkudGhlbigob2xkTWFwRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcclxuICAgICAgICAgICAgICAgIGxldCBtYXBJZCA9IHB1c2hTdGF0ZS5rZXkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuc2V0RGF0YShvbGRNYXBEYXRhLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke21hcElkfWApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci50byhgbWFwLyR7bWFwSWR9YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZENvcHkoc3RyKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHN0cjtcclxuICAgICAgICBpZiAoIV8uY29udGFpbnMoc3RyLCAnKENvcHknKSkge1xyXG4gICAgICAgICAgICByZXQgPSByZXQgKyAnIChDb3B5IDEpJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbWVzcyA9IHN0ci5zcGxpdCgnICcpO1xyXG4gICAgICAgICAgICBsZXQgY250ID0gMjtcclxuICAgICAgICAgICAgaWYgKG1lc3NbbWVzcy5sZW5ndGggLSAyXSA9PSAnKENvcHknKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JiZyA9IG1lc3NbbWVzcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGlmIChncmJnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JiZyA9IGdyYmcucmVwbGFjZSgnKScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjbnQgPSArZ3JiZyArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gbWVzcy5zbGljZSgwLCBtZXNzLmxlbmd0aCAtIDIpLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXQgKz0gYCAoQ29weSAke2NudH0pYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb3B5TWFwOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jbGFzcyBEZWxldGVNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgRGVsZXRlTWFwLmRlbGV0ZUFsbChbaWRdKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGVsZXRlQWxsKGlkcywgcGF0aCA9IENPTlNUQU5UUy5QQUdFUy5IT01FKSB7XHJcbiAgICAgICAgY29uc3QgbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfLmVhY2goaWRzLCAoaWQpID0+IHtcclxuICAgICAgICAgICAgICAgIG1ldGFNYXAuTWV0YUZpcmUuZGVsZXRlRGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke2lkfWApO1xyXG4gICAgICAgICAgICAgICAgbWV0YU1hcC5NZXRhRmlyZS5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICBtZXRhTWFwLlJvdXRlci50byhwYXRoKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZWxldGVNYXA7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5cclxuY2xhc3MgRmVlZGJhY2sgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHdpbmRvdy5Vc2VyU25hcDtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KCk7XHJcbiAgICAgICAgdGhpcy51c2VyU25hcC5vcGVuUmVwb3J0V2luZG93KCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmVlZGJhY2s7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvaG9tZScpO1xyXG5cclxuY2xhc3MgSG9tZSBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5IT01FKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ0hvbWUnIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIb21lOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jbGFzcyBMb2dvdXQgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubWV0YU1hcC5sb2dvdXQoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMb2dvdXQ7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvbXktbWFwcycpO1xyXG5cclxuY2xhc3MgTXlNYXBzIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLk1ZX01BUFMpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuUEFHRVMuTVlfTUFQUywgeyBpZDogaWQgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ015IE1hcHMnIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeU1hcHM7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBOZXdNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KCkge1xyXG4gICAgICAgIHN1cGVyLmFjdCgpO1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTkVXX01BUH1gKS50aGVuKChibGFua01hcCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3TWFwID0ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnVW50aXRsZWQgTWFwJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwdXNoU3RhdGUgPSB0aGlzLm1ldGFGaXJlLnB1c2hEYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9YCk7XHJcbiAgICAgICAgICAgIGxldCBtYXBJZCA9IHB1c2hTdGF0ZS5rZXkoKTtcclxuICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHttYXBJZH1gKTtcclxuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci50byhgbWFwLyR7bWFwSWR9YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmV3TWFwOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XHJcblxyXG5jb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgbWV0YUNhbnZhcyA9IHJlcXVpcmUoJy4uL3RhZ3MvY2FudmFzL21ldGEtY2FudmFzLmpzJyk7XHJcblxyXG5jbGFzcyBPcGVuTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigobWFwKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5NRVRBX0NBTlZBUyk7XHJcbiAgICAgICAgICAgICAgICBtYXAuaWQgPSBpZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLk5BViwgJ21hcCcsIG1hcCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgbWFwLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuTUFQLCBtYXAsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcGVuTWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IHRlcm1zID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy90ZXJtcycpO1xyXG5cclxuY2xhc3MgVGVybXMgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuVEVSTVMpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnVGVybXMgYW5kIENvbmRpdGlvbnMnIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXJtczsiLCJjb25zdCBNZXRhRmlyZSA9IHJlcXVpcmUoJy4vRmlyZWJhc2UnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5jb25zdCBjb25maWcgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBTSVRFUyA9IHtcclxuICAgICAgICBDUkxfU1RBR0lORzoge1xyXG4gICAgICAgICAgICBkYjogJ21ldGEtbWFwLXN0YWdpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJldCA9IHtcclxuICAgICAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxuICAgICAgICBzaXRlOiB7fVxyXG4gICAgfVxyXG4gICAgbGV0IHNlZ21lbnRzID0gcmV0Lmhvc3Quc3BsaXQoJy4nKTtcclxuICAgIGxldCBmaXJzdCA9IHNlZ21lbnRzWzBdO1xyXG4gICAgaWYgKGZpcnN0ID09PSAnd3d3Jykge1xyXG4gICAgICAgIGZpcnN0ID0gc2VnbWVudHNbMV07XHJcbiAgICB9XHJcbiAgICBmaXJzdCA9IGZpcnN0LnNwbGl0KCc6JylbMF07XHJcblxyXG4gICAgc3dpdGNoIChmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XHJcblxyXG4gICAgICAgIGNhc2UgJ2xvY2FsaG9zdCc6XHJcbiAgICAgICAgY2FzZSAnbWV0YS1tYXAtc3RhZ2luZyc6XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0LnNpdGUgPSBTSVRFUy5DUkxfU1RBR0lORztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJldDtcclxufTtcclxuXHJcbmNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFncykge1xyXG4gICAgICAgIHRoaXMudGFncyA9IHRhZ3M7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcoKTtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlID0gbmV3IE1ldGFGaXJlKHRoaXMuY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l0ZSgpIHtcclxuICAgICAgICByZXR1cm4gJ2Zyb250ZW5kJztcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5vbignY29uZmlnJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2NhbnZhcycsIChjYW52YXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKHRoaXMuY29uZmlnLnNpdGUsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmNvbmZpZy5zaXRlLnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZhdmljbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYXZpY28nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhdmljby5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBgJHt0aGlzLmNvbmZpZy5zaXRlLmltYWdlVXJsfWZhdmljb24uaWNvYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwodGhpcy5jb25maWcuc2l0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vblJlYWR5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5jbGFzcyBFdmVudGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXRhTWFwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmlvdC5vYnNlcnZhYmxlKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9XHJcbiAgICB9XHJcblxyXG4gICAgZXZlcnkoZXZlbnQsIHJlYWN0aW9uKSB7XHJcbiAgICAgICAgLy9sZXQgY2FsbGJhY2sgPSByZWFjdGlvbjtcclxuICAgICAgICAvL2lmICh0aGlzLmV2ZW50c1tldmVudF0pIHtcclxuICAgICAgICAvLyAgICBsZXQgcGlnZ3liYWNrID0gdGhpcy5ldmVudHNbZXZlbnRdO1xyXG4gICAgICAgIC8vICAgIGNhbGxiYWNrID0gKC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICBwaWdneWJhY2soLi4ucGFyYW1zKTtcclxuICAgICAgICAvLyAgICAgICAgcmVhY3Rpb24oLi4ucGFyYW1zKTtcclxuICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XHJcbiAgICAgICAgXy5lYWNoKGV2ZW50cywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSByZWFjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5vbihldmVudCwgcmVhY3Rpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcmdldChldmVudCwgY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tldmVudF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldmVudCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldmVudCwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkbyhldmVudCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XHJcbiAgICAgICAgXy5lYWNoKGV2ZW50cywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoZXZlbnQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50ZXI7IiwibGV0IEZpcmViYXNlID0gd2luZG93LkZpcmViYXNlO1xyXG5sZXQgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcclxubGV0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxyXG5cclxuY2xhc3MgTWV0YUZpcmUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoYGh0dHBzOi8vJHt0aGlzLmNvbmZpZy5zaXRlLmRifS5maXJlYmFzZWlvLmNvbWApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtZXRhTWFwKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbWV0YU1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWV0YU1hcDtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAuZ2V0U2Vzc2lvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5NZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5jb25maWcuc2l0ZS5hdXRoMC5hcGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogcHJvZmlsZS5pZF90b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIGRlbGVnYXRpb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZS5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnZmlyZWJhc2VfdG9rZW4nLCB0aGlzLmZpcmViYXNlX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZiLmF1dGhXaXRoQ3VzdG9tVG9rZW4odGhpcy5maXJlYmFzZV90b2tlbiwgKGVycm9yLCBhdXRoRGF0YSwgLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGF1dGhEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IHRoaXMuX2xvZ2luO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW47XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoaWxkKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBjaGlsZC5vbmNlKCd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gc25hcHNob3QudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbihwYXRoLCBjYWxsYmFjaywgZXZlbnQgPSAndmFsdWUnKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1ldGhvZCA9IChzbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc25hcHNob3QuZXhpc3RzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gZGF0YSBhdCAke3BhdGh9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYoZXZlbnQsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uKGV2ZW50LCBtZXRob2QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb2ZmKHBhdGgsIG1ldGhvZCA9ICd2YWx1ZScsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKG1ldGhvZCwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEoZGF0YSwgcGF0aCkge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQuc2V0KGRhdGEsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlRGF0YShwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0RGF0YShudWxsLCBwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoRGF0YShkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wdXNoKGRhdGEsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YUluVHJhbnNhY3Rpb24oZGF0YSwgcGF0aCwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnRyYW5zYWN0aW9uKChjdXJyZW50VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlcnJvcihlLCBwYXRoKSB7XHJcbiAgICAgICAgaWYgKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoeyBtZXNzYWdlOiBgUGVybWlzc2lvbiBkZW5pZWQgdG8gJHtwYXRofWAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLl9sb2dpbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fb25SZWFkeSA9IG51bGw7XHJcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnZmlyZWJhc2VfdG9rZW4nKTtcclxuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5jb25zdCBUd2lpdGVyID0gcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1R3aXR0ZXInKTtcclxuY29uc3QgRmFjZWJvb2sgPSByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvRmFjZWJvb2snKTtcclxuXHJcbmNsYXNzIEludGVncmF0aW9ucyB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKG1ldGFNYXAsIHVzZXIpIHtcclxuXHRcdHRoaXMuY29uZmlnID0gbWV0YU1hcC5jb25maWc7XHJcblx0XHR0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xyXG5cdFx0dGhpcy51c2VyID0gdXNlcjtcclxuXHRcdHRoaXMuX2ZlYXR1cmVzID0ge1xyXG5cdFx0XHRnb29nbGU6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9Hb29nbGUnKSxcclxuXHRcdFx0dXNlcnNuYXA6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9Vc2VyU25hcCcpLFxyXG5cdFx0XHRpbnRlcmNvbTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0ludGVyY29tJyksXHJcblx0XHRcdHplbmRlc2s6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9aZW5kZXNrJyksXHJcblx0XHRcdGFkZHRoaXM6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9BZGRUaGlzJyksXHJcblx0XHRcdG5ld3JlbGljOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvTmV3UmVsaWMnKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGluaXQoKSB7XHJcbiAgICAgICAgXy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoRmVhdHVyZSkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgY29uZmlnID0gdGhpcy5jb25maWcuc2l0ZVtuYW1lXTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0gPSBuZXcgRmVhdHVyZShjb25maWcsIHRoaXMudXNlcik7XHJcblx0XHRcdFx0XHR0aGlzW25hbWVdLmluaXQoKTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0uc2V0VXNlcigpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblx0c2V0VXNlcigpIHtcclxuXHRcdF8uZWFjaCh0aGlzLl9mZWF0dXJlcywgKEZlYXR1cmUsIG5hbWUpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcclxuXHRcdFx0XHR0aGlzW25hbWVdLnNldFVzZXIoKTtcclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxuXHRcclxuXHRzZW5kRXZlbnQodmFsLCAuLi5wYXJhbXMpIHtcclxuXHRcdF8uZWFjaCh0aGlzLl9mZWF0dXJlcywgKEZlYXR1cmUsIG5hbWUpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcclxuXHRcdFx0XHR0aGlzW25hbWVdLnNlbmRFdmVudCh2YWwsIC4uLnBhcmFtcyk7XHJcblx0XHRcdH1cclxuICAgICAgICB9KTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVBhdGgoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0bG9nb3V0KCkge1xyXG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR0aGlzW25hbWVdLmxvZ291dCgpO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XHJcbmNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgUm91dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9ucyA9IG1ldGFNYXAuSW50ZWdyYXRpb25zO1xyXG4gICAgICAgIHRoaXMudXNlciA9IG1ldGFNYXAuVXNlcjtcclxuICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbWV0YU1hcC5QYWdlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBtZXRhTWFwLkV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xyXG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgaWQgPSAnJywgYWN0aW9uID0gJycsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhdGggPSB0aGlzLmdldFBhdGgodGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCB0aGlzLnBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5Lm5hdmlnYXRlKHRoaXMucGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbygnaGlzdG9yeScsIHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50UGFnZSgpIHtcclxuICAgICAgICBsZXQgcGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJztcclxuICAgICAgICBpZiAoIXRoaXMuaXNUcmFja2VkKHBhZ2UpKSB7XHJcbiAgICAgICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UgPSB0aGlzLmdldFBhdGgodGhpcy51c2VyLmhpc3RvcnlbcGFnZUNudCAtIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFBhdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcmV2aW91c1BhZ2UocGFnZU5vID0gMikge1xyXG4gICAgICAgIGxldCBwYWdlID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMCkge1xyXG4gICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSBwYWdlTm9dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByZXZpb3VzUGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmV2aW91c1BhZ2UoMik7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2socGF0aCkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb25zLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlTWFpbihoaWRlLCBwYXRoKSB7XHJcbiAgICAgICAgdGhpcy50cmFjayhwYXRoKTtcclxuICAgICAgICBpZiAoaGlkZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHRvKHBhdGgpIHtcclxuICAgICAgICBwYXRoID0gdGhpcy5nZXRQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCBwYXRoKTtcclxuICAgICAgICAgICAgcmlvdC5yb3V0ZShgJHtwYXRofWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiYWNrKCkge1xyXG4gICAgICAgIGxldCBwYXRoID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMSAmJiAodGhpcy5jdXJyZW50UGFnZSAhPSAnbXltYXBzJyB8fCB0aGlzLmN1cnJlbnRQYWdlICE9IHRoaXMucHJldmlvdXNQYWdlKSkge1xyXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5wcmV2aW91c1BhZ2U7XHJcbiAgICAgICAgICAgIGxldCBiYWNrTm8gPSAyO1xyXG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNUcmFja2VkKHBhdGgpICYmIHRoaXMudXNlci5oaXN0b3J5W2JhY2tOb10pIHtcclxuICAgICAgICAgICAgICAgIGJhY2tObyArPSAxO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UHJldmlvdXNQYWdlKGJhY2tObyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG8ocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRvTm90VHJhY2soKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9kb05vdFRyYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RvTm90VHJhY2sgPSBbQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuQ09QWV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVCwgQ09OU1RBTlRTLkFDVElPTlMuTkVXX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuRkVFREJBQ0tdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZG9Ob3RUcmFjaztcclxuICAgIH1cclxuXHJcbiAgICBpc1RyYWNrZWQocGF0aCkge1xyXG4gICAgICAgIGxldCBwdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XHJcbiAgICAgICAgcmV0dXJuIF8uYW55KHRoaXMuZG9Ob3RUcmFjaywgKHApID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICFwdGguc3RhcnRzV2l0aChwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXI7IiwiY29uc3QgQXV0aDBMb2NrID0gd2luZG93LkF1dGgwTG9jazsgLy9yZXF1aXJlKCdhdXRoMC1sb2NrJyk7XG5jb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcblxuY2xhc3MgQXV0aDAge1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCBtZXRhTWFwKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKGNvbmZpZy5hcGksIGNvbmZpZy5hcHApO1xuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvd0xvZ2luID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbkFmdGVyU2lnbnVwOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbChlcnIsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gcHJvZmlsZS5jdG9rZW4gPSBjdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaF90b2tlbiA9IHByb2ZpbGUucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dMb2dpbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICAgIH1cblxuICAgIGxpbmtBY2NvdW50KCkge1xuICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICBjYWxsYmFja1VSTDogbG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSxcbiAgICAgICAgICAgIGRpY3Q6IHtcbiAgICAgICAgICAgICAgICBzaWduaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLmN0b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkZhaWwoZXJyLCByZWplY3QpIHtcbiAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycik7XG4gICAgICAgIGlmIChyZWplY3QpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuX2dldFNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIChlcnIsIHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkX3Rva2VuID0gcHJvZmlsZS5pZF90b2tlbiA9IGlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdObyBzZXNzaW9uJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0U2Vzc2lvbjtcbiAgICB9XG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ2lkX3Rva2VuJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgncHJvZmlsZScpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmN0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmlkX3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaF90b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9nZXRTZXNzaW9uID0gbnVsbDtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcblxuXG4iLCJjb25zdCB1dWlkID0gcmVxdWlyZSgnLi4vdG9vbHMvdXVpZC5qcycpO1xyXG5jb25zdCBDb21tb24gPSByZXF1aXJlKCcuLi90b29scy9Db21tb24nKTtcclxuXHJcbmNsYXNzIFVzZXIge1xyXG4gICAgY29uc3RydWN0b3IocHJvZmlsZSwgYXV0aCwgZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLmF1dGggPSBhdXRoO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMudXNlcktleSA9IHV1aWQoKTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgbGV0IHRyYWNrSGlzdG9yeSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZXZlcnkoJ2hpc3RvcnknLCAocGFnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpc3RvcnkubGVuZ3RoID09IDAgfHwgcGFnZSAhPSB0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEodGhpcy5oaXN0b3J5LCBgdXNlcnMvJHt0aGlzLmF1dGgudWlkfS9oaXN0b3J5YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5vbihgdXNlcnMvJHt0aGlzLmF1dGgudWlkfWAsICh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlci5oaXN0b3J5ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSB1c2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2tIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX2lkZW50aXR5KCkge1xyXG4gICAgICAgIGxldCByZXQgPSB7fTtcclxuICAgICAgICBpZiAodGhpcy5wcm9maWxlICYmIHRoaXMucHJvZmlsZS5pZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb2ZpbGUuaWRlbnRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNyZWF0ZWRPbigpIHtcclxuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9jcmVhdGVkT24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlZE9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGR0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiBDb21tb24uZ2V0VGlja3NGcm9tRGF0ZShkdClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlZE9uIHx8IHsgZGF0ZTogbnVsbCwgdGlja3M6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuZnVsbE5hbWU7XHJcbiAgICAgICAgaWYgKHJldCkge1xyXG4gICAgICAgICAgICByZXQgPSByZXQuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXQgJiYgdGhpcy5faWRlbnRpdHkubmlja25hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmlja25hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmdWxsTmFtZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZW1haWwoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5lbWFpbCkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5lbWFpbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGljdHVyZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnBpY3R1cmUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucGljdHVyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXNlcklkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGgudWlkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0FkbWluKCkge1xyXG4gICAgICAgIGxldCByZXQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucm9sZXMpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucm9sZXMuaW5kZXhPZignYWRtaW4nKSAhPT0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhpc3RvcnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZmlsZS5oaXN0b3J5IHx8IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVVc2VyRWRpdG9yT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvcl9vcHRpb25zOiBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyOyIsImNvbnN0IGpzUGx1bWIgPSB3aW5kb3cuanNQbHVtYjtcclxuY29uc3QganNQbHVtYlRvb2xraXQgPSB3aW5kb3cuanNQbHVtYlRvb2xraXQ7XHJcblxyXG5jbGFzcyBDYW52YXMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1hcCwgbWFwSWQpIHtcclxuICAgICAgICB0aGlzLm1hcCA9IG1hcDtcclxuICAgICAgICB0aGlzLm1hcElkID0gbWFwSWQ7XHJcbiAgICAgICAgdGhpcy50b29sa2l0ID0ge307XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcblxyXG4gICAgICAgIGpzUGx1bWJUb29sa2l0LnJlYWR5KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50b29sa2l0ID0gd2luZG93LnRvb2xraXQgPSBqc1BsdW1iVG9vbGtpdC5uZXdJbnN0YW5jZSh7XHJcbiAgICAgICAgICAgICAgICBhdXRvU2F2ZTp0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2F2ZVVybDonaHR0cHM6Ly9sb2NhbGhvc3Q6MTAnLFxyXG4gICAgICAgICAgICAgICAgb25BdXRvU2F2ZUVycm9yOiAobXNnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICBsZXQgcG9zdERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMudG9vbGtpdC5leHBvcnREYXRhKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRfYnk6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJLZXlcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXAubG9hZE1hcEV4dHJhRGF0YShyZXNwb25zZS5kYXRhLm1hcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLk1ldGFGaXJlLnNldERhdGFJblRyYW5zYWN0aW9uKHBvc3REYXRhLCBgbWFwcy9kYXRhLyR7dGhpcy5tYXBJZH1gKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuSW50ZWdyYXRpb25zLnNlbmRFdmVudCh0aGlzLm1hcElkLCAnZXZlbnQnLCAnYXV0b3NhdmUnLCAnYXV0b3NhdmUnKVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uQXV0b1NhdmVTdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2VzcyBzaG91bGQgbm90IGhhcHBlbicpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTdGFydENvbm5lY3Q6ZnVuY3Rpb24oZnJvbU5vZGUsIGVkZ2VUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlQ29ubmVjdDpmdW5jdGlvbihmcm9tTm9kZSwgdG9Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgbm9kZS5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgbGV0IF9uZXdOb2RlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHc6MTUwLFxyXG4gICAgICAgICAgICAgICAgICAgIGg6MTUwLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOidpZGVhJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOidpZGVhJ1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBtYWluRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qdGstZGVtby1tYWluJyksXHJcbiAgICAgICAgICAgICAgICBjYW52YXNFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmp0ay1kZW1vLWNhbnZhcycpLFxyXG4gICAgICAgICAgICAgICAgbWluaXZpZXdFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1pbml2aWV3Jyk7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHJlbmRlcmVyID0gdGhpcy50b29sa2l0LnJlbmRlcih7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXI6Y2FudmFzRWxlbWVudCxcclxuICAgICAgICAgICAgICAgIG1pbml2aWV3OntcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6bWluaXZpZXdFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGF5b3V0OntcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOidTcHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFic29sdXRlQmFja2VkOmZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgem9vbVRvRml0OnRydWUsXHJcbiAgICAgICAgICAgICAgICB2aWV3OntcclxuICAgICAgICAgICAgICAgICAgICBub2Rlczp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZWZhdWx0Jzp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTondG1wbE5vZGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHc6IDE1MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoOiAxNTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZXM6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVmYXVsdCc6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOlsnUGVyaW1ldGVyJywgeyBzaGFwZTonQ2lyY2xlJyB9XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6J2VkZ2UtcmVsYXRpb25zaGlwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcjonU3RhdGVNYWNoaW5lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50OidCbGFuaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5czpbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWyAnUGxhaW5BcnJvdycsIHsgbG9jYXRpb246MSwgd2lkdGg6MTAsIGxlbmd0aDoxMCwgY3NzQ2xhc3M6J3JlbGF0aW9uc2hpcC1vdmVybGF5JyB9IF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmU6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9yOidTdGF0ZU1hY2hpbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6J2VkZ2UtcGVyc3BlY3RpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRzOlsgJ0JsYW5rJywgWyAnRG90JywgeyByYWRpdXM6MTAsIGNzc0NsYXNzOidvcmFuZ2UnIH1dXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGV2ZW50czp7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzRGJsQ2xpY2s6KGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGFuIElkZWEgbm9kZSBhdCB0aGUgbG9jYXRpb24gYXQgd2hpY2ggdGhlIGV2ZW50IG9jY3VycmVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9zID0gcmVuZGVyZXIubWFwRXZlbnRMb2NhdGlvbihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b29sa2l0LmFkZE5vZGUoanNQbHVtYi5leHRlbmQoX25ld05vZGUoKSwgcG9zKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBub2RlQWRkZWQ6X3JlZ2lzdGVySGFuZGxlcnMgLy8gc2VlIGJlbG93XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZHJhZ09wdGlvbnM6e1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjonLnNlZ21lbnQnLCAgICAgICAvLyBjYW4ndCBkcmFnIG5vZGVzIGJ5IHRoZSBjb2xvciBzZWdtZW50cy5cclxuICAgICAgICAgICAgICAgICAgICBzdG9wOmZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OmZ1bmN0aW9uKHBhcmFtcykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vICAgIE1vdXNlIGhhbmRsZXJzLiBTb21lIGFyZSB3aXJlZCB1cDsgYWxsIGxvZyB0aGUgY3VycmVudCBub2RlIGRhdGEgdG8gdGhlIGNvbnNvbGUuXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICBsZXQgX3R5cGVzID0gWyAncmVkJywgJ29yYW5nZScsICdncmVlbicsICdibHVlJyBdO1xyXG5cclxuICAgICAgICAgICAgbGV0IF9jbGlja0hhbmRsZXJzID0ge1xyXG4gICAgICAgICAgICAgICAgJ2NsaWNrJzp7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3JlZCc6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrIHJlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfaW5mbygnRG91YmxlIGNsaWNrIHRvIGNyZWF0ZSBhIG5ldyBpZGVhLiBSaWdodC1jbGljayB0byBtYXJrIHdpdGggYSBkaXN0aW5jdGlvbiBmbGFnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAnZ3JlZW4nOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljayBncmVlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfaW5mbygnRG91YmxlIGNsaWNrIHRvIGFkZCBhIHBhcnQuIFNpbmdsZSBjbGljayB0byBzaG93L2hpZGUgcGFydHMnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdvcmFuZ2UnOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljayBvcmFuZ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIobm9kZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2luZm8oJ0RyYWcgdG8gY3JlYXRlIGEgUGVyc3BlY3RpdmUuIERvdWJsZSBjbGljayB0byBvcGVuIFBlcnNwZWN0aXZlIEVkaXRvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JsdWUnOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljayBibHVlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pbmZvKCdEb3VibGUgY2xpY2sgdG8gY3JlYXRlIGEgbmV3IHJlbGF0ZWQgaWRlYS4gRHJhZyB0byByZWxhdGUgdG8gYW4gZXhpc3RpbmcgaWRlYS4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2RibGNsaWNrJzp7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3JlZCc6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RvdWJsZSBjbGljayByZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIobm9kZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdncmVlbic6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RvdWJsZSBjbGljayBncmVlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJ29yYW5nZSc6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RvdWJsZSBjbGljayBvcmFuZ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIobm9kZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICdibHVlJzooZWwsIG5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RvdWJsZSBjbGljayBibHVlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbGtpdC5iYXRjaCgoKT0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdOb2RlID0gdGhpcy50b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvb2xraXQuY29ubmVjdCh7c291cmNlOm5vZGUsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidwZXJzcGVjdGl2ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IF9jdXJyeUhhbmRsZXIgPSBmdW5jdGlvbihlbCwgc2VnbWVudCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IF9lbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy4nICsgc2VnbWVudCk7XHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKF9lbCwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jbGlja0hhbmRsZXJzWydjbGljayddW3NlZ21lbnRdKGVsLCBub2RlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihfZWwsICdkYmxjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBfY2xpY2tIYW5kbGVyc1snZGJsY2xpY2snXVtzZWdtZW50XShlbCwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIHNldHVwIHRoZSBjbGlja2luZyBhY3Rpb25zIGFuZCB0aGUgbGFiZWwgZHJhZyAod2hpY2ggaXMgYSBsaXR0bGUgc2hha3kgcmlnaHQgbm93OyBqc1BsdW1iJ3NcclxuICAgICAgICAgICAgLy8gZHJhZyBpcyBub3QgZXhhY3RseSBpbnRlbmRlZCBhcyBhbiBhZC1ob2MgZHJhZyBiZWNhdXNlIGl0IGFzc3VtZXMgdGhpbmdzIGFib3V0IHRoZSBub2RlJ3NcclxuICAgICAgICAgICAgLy8gb2Zmc2V0UGFyZW50LiBhIHNpbXBsZSwgZGVkaWNhdGVkLCBkcmFnIGhhbmRsZXIgaXMgc2ltcGxlIHRvIHdyaXRlKVxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBfcmVnaXN0ZXJIYW5kbGVycyhwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGhlcmUgeW91IGhhdmUgcGFyYW1zLmVsLCB0aGUgRE9NIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIC8vIGFuZCBwYXJhbXMubm9kZSwgdGhlIHVuZGVybHlpbmcgbm9kZS4gaXQgaGFzIGEgYGRhdGFgIG1lbWJlciB3aXRoIHRoZSBub2RlJ3MgcGF5bG9hZC5cclxuICAgICAgICAgICAgICAgIGxldCBlbCA9IHBhcmFtcy5lbCwgbm9kZSA9IHBhcmFtcy5ub2RlLCBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5uYW1lJyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF90eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jdXJyeUhhbmRsZXIoZWwsIF90eXBlc1tpXSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgbGFiZWwgZHJhZ2dhYmxlIChzZWUgbm90ZSBhYm92ZSkuXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLmRyYWdnYWJsZShsYWJlbCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3A6ZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEubGFiZWxQb3NpdGlvbiA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLmxlZnQsIDEwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLnRvcCwgMTApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gX2luZm8odGV4dCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm8nKS5pbm5lckhUTUwgPSB0ZXh0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvLyBhIGNvdXBsZSBvZiByYW5kb20gZXhhbXBsZXMgb2YgdGhlIGZpbHRlciBmdW5jdGlvbiwgYWxsb3dpbmcgeW91IHRvIHF1ZXJ5IHlvdXIgZGF0YVxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgbGV0IGNvdW50RWRnZXNPZlR5cGUgPSAodHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9vbGtpdC5maWx0ZXIoZnVuY3Rpb24ob2JqKSB7IHJldHVybiBvYmoub2JqZWN0VHlwZSA9PSAnRWRnZScgJiYgb2JqLmRhdGEudHlwZT09PXR5cGU7IH0pLmdldEVkZ2VDb3VudCgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBkdW1wRWRnZUNvdW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RoZXJlIGFyZSAnICsgY291bnRFZGdlc09mVHlwZSgncmVsYXRpb25zaGlwJykgKyAnIHJlbGF0aW9uc2hpcCBlZGdlcycpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RoZXJlIGFyZSAnICsgY291bnRFZGdlc09mVHlwZSgncGVyc3BlY3RpdmUnKSArICcgcGVyc3BlY3RpdmUgZWRnZXMnKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGpzUGx1bWIub24oJ3JlbGF0aW9uc2hpcEVkZ2VEdW1wJywgJ2NsaWNrJywgZHVtcEVkZ2VDb3VudHMoKSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRvb2xraXQuYmluZCgnZGF0YVVwZGF0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGR1bXBFZGdlQ291bnRzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTsgLy9qc1BsdW1iLnJlYWR5XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5tYXAgJiYgdGhpcy5tYXAuZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnRvb2xraXQubG9hZCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLm1hcC5kYXRhXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBnZXQgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFRvb2xraXQuIHByb3ZpZGUgYSBzZXQgb2YgbWV0aG9kcyB0aGF0IGNvbnRyb2wgd2hvIGNhbiBjb25uZWN0IHRvIHdoYXQsIGFuZCB3aGVuLlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7IiwiY29uc3QgQUNUSU9OUyA9IHtcclxuICAgIE1BUDogJ21hcCcsXHJcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXHJcbiAgICBDT1BZX01BUDogJ2NvcHlfbWFwJyxcclxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcclxuICAgIEhPTUU6ICdob21lJyxcclxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxyXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICd0ZXJtcycsXHJcbiAgICBMT0dPVVQ6ICdsb2dvdXQnLFxyXG4gICAgRkVFREJBQ0s6ICdmZWVkYmFjaydcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQUNUSU9OUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFDVElPTlM7IiwiY29uc3QgQ0FOVkFTID0ge1xyXG4gICAgTEVGVDogJ2xlZnQnLFxyXG4gICAgUklHSFQ6ICdyaWdodCdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQ0FOVkFTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ0FOVkFTOyIsImNvbnN0IENPTlNUQU5UUyA9IHtcclxuXHRBQ1RJT05TOiByZXF1aXJlKCcuL2FjdGlvbnMnKSxcclxuXHRDQU5WQVM6IHJlcXVpcmUoJy4vY2FudmFzJyksXHJcblx0RFNSUDogcmVxdWlyZSgnLi9kc3JwJyksXHJcblx0RURJVF9TVEFUVVM6IHJlcXVpcmUoJy4vZWRpdFN0YXR1cycpLFxyXG5cdEVMRU1FTlRTOiByZXF1aXJlKCcuL2VsZW1lbnRzJyksXHJcblx0RVZFTlRTOiByZXF1aXJlKCcuL2V2ZW50cycpLFxyXG5cdFBBR0VTOiByZXF1aXJlKCcuL3BhZ2VzJyksXHJcblx0Uk9VVEVTOiByZXF1aXJlKCcuL3JvdXRlcycpLFxyXG5cdFRBQlM6IHJlcXVpcmUoJy4vdGFicycpLFxyXG5cdFRBR1M6IHJlcXVpcmUoJy4vdGFncycpXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKENPTlNUQU5UUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENPTlNUQU5UUzsiLCJjb25zdCBEU1JQID0ge1xyXG5cdEQ6ICdEJyxcclxuXHRTOiAnUycsXHJcblx0UjogJ1InLFxyXG5cdFA6ICdQJ1xyXG59XHJcblxyXG5PYmplY3QuZnJlZXplKERTUlApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEU1JQOyIsImNvbnN0IHN0YXR1cyA9IHtcclxuICAgIExBU1RfVVBEQVRFRDogJycsXHJcbiAgICBSRUFEX09OTFk6ICdWaWV3IG9ubHknLFxyXG4gICAgU0FWSU5HOiAnU2F2aW5nLi4uJyxcclxuICAgIFNBVkVfT0s6ICdBbGwgY2hhbmdlcyBzYXZlZCcsXHJcbiAgICBTQVZFX0ZBSUxFRDogJ0NoYW5nZXMgY291bGQgbm90IGJlIHNhdmVkJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShzdGF0dXMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdGF0dXM7IiwiY29uc3QgRUxFTUVOVFMgPSB7XHJcbiAgICBBUFBfQ09OVEFJTkVSOiAnYXBwLWNvbnRhaW5lcicsXHJcbiAgICBNRVRBX1BST0dSRVNTOiAnbWV0YV9wcm9ncmVzcycsXHJcbiAgICBNRVRBX1BST0dSRVNTX05FWFQ6ICdtZXRhX3Byb2dyZXNzX25leHQnXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKEVMRU1FTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRUxFTUVOVFM7IiwiY29uc3QgRVZFTlRTID0ge1xyXG5cdFNJREVCQVJfT1BFTjogJ3NpZGViYXItb3BlbicsXHJcblx0U0lERUJBUl9DTE9TRTogJ3NpZGViYXItY2xvc2UnLFxyXG5cdFBBR0VfTkFNRTogJ3BhZ2VOYW1lJyxcclxuXHROQVY6ICduYXYnLFxyXG5cdE1BUDogJ21hcCdcclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShFVkVOVFMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFVkVOVFM7IiwiY29uc3QgQUNUSU9OUyA9IHJlcXVpcmUoJy4vYWN0aW9ucy5qcycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBQQUdFUyA9IHtcclxuICAgIE1BUDogJ21hcCcsXHJcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXHJcbiAgICBDT1BZX01BUDogJ2NvcHlfbWFwJyxcclxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcclxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxyXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICd0ZXJtcycsXHJcbiAgICBIT01FOiAnaG9tZSdcclxufTtcclxuXHJcbl8uZXh0ZW5kKClcclxuXHJcbk9iamVjdC5mcmVlemUoUEFHRVMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQQUdFUzsiLCJjb25zdCBST1VURVMgPSB7XHJcbiAgICBNQVBTX0xJU1Q6ICdtYXBzL2xpc3QvJyxcclxuICAgIE1BUFNfREFUQTogJ21hcHMvZGF0YS8nLFxyXG4gICAgTUFQU19ORVdfTUFQOiAnbWFwcy9uZXctbWFwLycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ21ldGFtYXAvdGVybXMtYW5kLWNvbmRpdGlvbnMvJyxcclxuICAgIEhPTUU6ICdtZXRhbWFwL2hvbWUvJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShST1VURVMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBST1VURVM7IiwiY29uc3QgVEFCUyA9IHtcclxuICAgIFRBQl9JRF9QUkVTRU5URVIgOiAncHJlc2VudGVyLXRhYicsXHJcbiAgICBUQUJfSURfQU5BTFlUSUNTX01BUCA6ICdhbmFseXRpY3MtdGFiLW1hcCcsXHJcbiAgICBUQUJfSURfQU5BTFlUSUNTX1RISU5HIDogJ2FuYWx5dGljcy10YWItdGhpbmcnLFxyXG4gICAgVEFCX0lEX1BFUlNQRUNUSVZFUyA6ICdwZXJzcGVjdGl2ZXMtdGFiJyxcclxuICAgIFRBQl9JRF9ESVNUSU5DVElPTlMgOiAnZGlzdGluY3Rpb25zLXRhYicsXHJcbiAgICBUQUJfSURfQVRUQUNITUVOVFMgOiAnYXR0YWNobWVudHMtdGFiJyxcclxuICAgIFRBQl9JRF9HRU5FUkFUT1IgOiAnZ2VuZXJhdG9yLXRhYicsXHJcbiAgICBUQUJfSURfU1RBTkRBUkRTIDogJ3N0YW5kYXJkcy10YWInXHJcbn07XHJcbk9iamVjdC5mcmVlemUoVEFCUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRBQlM7IiwiY29uc3QgVEFHUyA9IHtcclxuICAgIE1FVEFfQ0FOVkFTOiAnbWV0YS1jYW52YXMnLFxyXG4gICAgSE9NRTogJ2hvbWUnLFxyXG4gICAgVEVSTVM6ICd0ZXJtcycsXHJcbiAgICBNWV9NQVBTOiAnbXktbWFwcydcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoVEFHUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRBR1M7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgQWRkVGhpcyBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgICAgICAgIHQgPSB3aW5kb3cuYWRkdGhpcyB8fCB7fTtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcclxuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIGpzLnNyYyA9IGAvL3M3LmFkZHRoaXMuY29tL2pzLzMwMC9hZGR0aGlzX3dpZGdldC5qcyNwdWJpZD0ke2NvbmZpZy5wdWJpZH1gO1xyXG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwiYWRkLXRoaXMtanNcIikpO1xyXG4gICAgICAgIHRoaXMuYWRkdGhpcyA9IHdpbmRvdy5hZGR0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5hZGR0aGlzID0gdGhpcy5hZGR0aGlzIHx8IHdpbmRvdy5hZGR0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFkZFRoaXM7XHJcblxyXG5cclxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgRmFjZWJvb2sgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF07XHJcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xyXG4gICAgICAgICAgICBqcy5pZCA9IGlkO1xyXG4gICAgICAgICAgICBqcy5zcmMgPSBcIi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvc2RrLmpzXCI7XHJcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgICB9IChkb2N1bWVudCwgJ3NjcmlwdCcsICdmYWNlYm9vay1qc3NkaycpKTtcclxuICAgICAgICB0aGlzLkZCID0gd2luZG93LkZCO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLmluaXQoe1xyXG4gICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuYXBwaWQsXHJcbiAgICAgICAgICAgIHhmYm1sOiB0aGlzLmNvbmZpZy54ZmJtbCxcclxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy5jb25maWcudmVyc2lvblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLkV2ZW50LnN1YnNjcmliZSgnZWRnZS5jcmVhdGUnLCBmdW5jdGlvbiAodGFyZ2V0VXJsKSB7XHJcbiAgICAgICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCdmYWNlYm9vaycsIHRhcmdldFVybCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24uRXZlbnQuc3Vic2NyaWJlKCdlZGdlLnJlbW92ZScsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5FdmVudC5zdWJzY3JpYmUoJ21lc3NhZ2Uuc2VuZCcsIGZ1bmN0aW9uICh0YXJnZXRVcmwpIHtcclxuICAgICAgICAgICAgR29vZ2xlLnNlbmRTb2NpYWwoJ2ZhY2Vib29rJywgdGFyZ2V0VXJsKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuRkIgPSB0aGlzLkZCIHx8IHdpbmRvdy5GQjtcclxuICAgICAgICByZXR1cm4gdGhpcy5GQjtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZhY2Vib29rO1xyXG5cclxuXHJcbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIEdvb2dsZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgbGV0IHBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IHBvLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JzsgcG8uYXN5bmMgPSB0cnVlO1xyXG4gICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xyXG4gICAgICBsZXQgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XHJcbiAgICB9KSgpO1xyXG4gICAgICBcclxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxyXG4gICAgKGZ1bmN0aW9uICh3LCBkLCBzLCBsLCBpKSB7XHJcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xyXG4gICAgICAgICdndG0uc3RhcnQnOlxyXG4gICAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCBldmVudDogJ2d0bS5qcydcclxuICAgICAgfSk7IGxldCBmID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cclxuICAgICAgICAnLy93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RtLmpzP2lkPScgKyBpICsgZGw7IGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJ2RhdGFMYXllcicsIHRoaXMuY29uZmlnLnRhZ21hbmFnZXIpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoaSwgcywgbywgZywgciwgYSwgbSkge1xyXG4gICAgICBpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXSA9IHI7IGlbcl0gPSBpW3JdIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAoaVtyXS5xID0gaVtyXS5xIHx8IFtdKS5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICAgIH0sIGlbcl0ubCA9IDEgKiBuZXcgRGF0ZSgpOyBhID0gcy5jcmVhdGVFbGVtZW50KG8pLFxyXG4gICAgICBtID0gcy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTsgYS5hc3luYyA9IDE7IGEuc3JjID0gZztcclxuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcclxuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzJywgJ2dhJyk7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgdGhpcy5nYSA9IHRoaXMuZ2EgfHwgd2luZG93LmdhO1xyXG4gICAgcmV0dXJuIHRoaXMuZ2E7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgbGV0IG1vZGUgPSAnYXV0byc7XHJcbiAgICBsZXQgZG9tYWluID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICBpZihkb21haW4uc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcclxuICAgICAgbW9kZSA9ICdub25lJztcclxuICAgIH1cclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ2NyZWF0ZScsIHRoaXMuY29uZmlnLmFuYWx5dGljcywgbW9kZSk7XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyKCkge1xyXG4gICAgc3VwZXIuc2V0VXNlcigpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0JywgJ3VzZXJJZCcsIHRoaXMudXNlci51c2VySWQpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRTb2NpYWwobmV0d29yaywgdGFyZ2V0VXJsLCB0eXBlID0gJ3NlbmQnKSB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCBuZXR3b3JrLCB0eXBlLCB0YXJnZXRVcmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xyXG4gICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XHJcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICBpZiAoc291cmNlICYmIHR5cGUpIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdmFsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHZhbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgdXBkYXRlUGF0aChwYXRoKSB7XHJcbiAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCB7XHJcbiAgICAgICAgICAgIHBhZ2U6IHBhdGhcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZEV2ZW50KGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCkge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB1cmwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR29vZ2xlO1xyXG5cclxuXHJcbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIEludGVyY29tIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG5cclxuICAgICAgICBsZXQgaSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaS5jKGFyZ3VtZW50cylcclxuICAgICAgICB9O1xyXG4gICAgICAgIGkucSA9IFtdO1xyXG4gICAgICAgIGkuYyA9IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgICAgICAgIGkucS5wdXNoKGFyZ3MpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB3aW5kb3cuSW50ZXJjb20gPSBpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgICAgICBzLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICAgICAgcy5zcmMgPSBgaHR0cHM6Ly93aWRnZXQuaW50ZXJjb20uaW8vd2lkZ2V0LyR7Y29uZmlnLmFwcGlkfX1gO1xyXG4gICAgICAgICAgICBsZXQgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICAgICAgeC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzLCB4KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmludGVyY29tID0gd2luZG93LkludGVyY29tO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLmludGVyY29tID0gdGhpcy5pbnRlcmNvbSB8fCB3aW5kb3cuSW50ZXJjb207XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJjb207XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignYm9vdCcsIHtcclxuICAgICAgICAgICAgYXBwX2lkOiB0aGlzLmNvbmZpZy5hcHBpZCxcclxuICAgICAgICAgICAgbmFtZTogdGhpcy51c2VyLmZ1bGxOYW1lLFxyXG4gICAgICAgICAgICBlbWFpbDogdGhpcy51c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBjcmVhdGVkX2F0OiB0aGlzLnVzZXIuY3JlYXRlZE9uLnRpY2tzLFxyXG4gICAgICAgICAgICB1c2VyX2lkOiB0aGlzLnVzZXIudXNlcklkXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZW5kRXZlbnQoJ3VwZGF0ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRFdmVudChldmVudCA9ICd1cGRhdGUnKSB7XHJcbiAgICAgICAgc3VwZXIuc2VuZEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCd1cGRhdGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uKCd1cGRhdGUnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHN1cGVyLmxvZ291dCgpO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NodXRkb3duJyk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY29tOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuXHJcbmNsYXNzIE5ld1JlbGljIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG5cclxuICAgICAgICB0aGlzLk5ld1JlbGljID0gd2luZG93Lk5SRVVNO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLk5ld1JlbGljID0gdGhpcy5OZXdSZWxpYyB8fCB3aW5kb3cuTlJFVU07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuTmV3UmVsaWM7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbi5zZXRDdXN0b21BdHRyaWJ1dGUoJ3VzZXJuYW1lJywgdGhpcy51c2VyLmVtYWlsKTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLnNldEN1c3RvbUF0dHJpYnV0ZSgnYWNjY291bnRJRCcsIHRoaXMudXNlci51c2VySWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgICAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcclxuICAgICAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmludGVncmF0aW9uLmFkZFRvVHJhY2UodmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUGF0aChwYXRoKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuICAgICAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnNldFBhZ2VWaWV3TmFtZShwYXRoLCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5ld1JlbGljO1xyXG5cclxuXHJcbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuY29uc3QgR29vZ2xlID0gcmVxdWlyZSgnLi9nb29nbGUnKTtcclxuXHJcbmNsYXNzIFR3aXR0ZXIgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChkLCBzLCBpZCkge1xyXG4gICAgICAgICAgICBsZXQganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgICAgICAgICB0ID0gd2luZG93LnR3dHRyIHx8IHt9O1xyXG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICAgICAganMuaWQgPSBpZDtcclxuICAgICAgICAgICAganMuc3JjID0gXCJodHRwczovL3BsYXRmb3JtLnR3aXR0ZXIuY29tL3dpZGdldHMuanNcIjtcclxuICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xyXG5cclxuICAgICAgICAgICAgdC5fZSA9IFtdO1xyXG4gICAgICAgICAgICB0LnJlYWR5ID0gZnVuY3Rpb24gKGYpIHtcclxuICAgICAgICAgICAgICAgIHQuX2UucHVzaChmKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0O1xyXG4gICAgICAgIH0gKGRvY3VtZW50LCBcInNjcmlwdFwiLCBcInR3aXR0ZXItd2pzXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9uLnJlYWR5KCh0d2l0dGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHR3aXR0ZXIud2lkZ2V0cy5sb2FkKCk7XHJcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ2NsaWNrJywgdGhpcy5fY2xpY2tFdmVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgndHdlZXQnLCB0aGlzLl90d2VldEludGVudFRvQW5hbHl0aWNzKTtcclxuICAgICAgICAgICAgdHdpdHRlci5ldmVudHMuYmluZCgncmV0d2VldCcsIHRoaXMuX3JldHdlZXRJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgICAgIHR3aXR0ZXIuZXZlbnRzLmJpbmQoJ2Zhdm9yaXRlJywgdGhpcy5fZmF2SW50ZW50VG9BbmFseXRpY3MpO1xyXG4gICAgICAgICAgICB0d2l0dGVyLmV2ZW50cy5iaW5kKCdmb2xsb3cnLCB0aGlzLl9mb2xsb3dJbnRlbnRUb0FuYWx5dGljcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCB0cnlDb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IGxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cudHd0dHIgJiYgd2luZG93LnR3dHRyLndpZGdldHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cudHd0dHIud2lkZ2V0cy5sb2FkKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHJ5Q291bnQgPCA1KSB7XHJcbiAgICAgICAgICAgICAgICB0cnlDb3VudCArPSAxO1xyXG4gICAgICAgICAgICAgICAgXy5kZWxheShsb2FkLCAyNTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLnR3dHRyID0gdGhpcy50d3R0ciB8fCB3aW5kb3cudHd0dHI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHd0dHI7XHJcbiAgICB9XHJcblxyXG4gICAgX2ZvbGxvd0ludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGludGVudEV2ZW50LmRhdGEudXNlcl9pZCArIFwiIChcIiArIGludGVudEV2ZW50LmRhdGEuc2NyZWVuX25hbWUgKyBcIilcIjtcclxuICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgndHdpdHRlcicsIGxhYmVsLCBpbnRlbnRFdmVudC50eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBfcmV0d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBsYWJlbCA9IGludGVudEV2ZW50LmRhdGEuc291cmNlX3R3ZWV0X2lkO1xyXG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIF9mYXZJbnRlbnRUb0FuYWx5dGljcyhpbnRlbnRFdmVudCkge1xyXG4gICAgICAgIHRoaXMuX3R3ZWV0SW50ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIF90d2VldEludGVudFRvQW5hbHl0aWNzKGludGVudEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCFpbnRlbnRFdmVudCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBsYWJlbCA9IFwidHdlZXRcIjtcclxuICAgICAgICBHb29nbGUuc2VuZFNvY2lhbCgndHdpdHRlcicsIGxhYmVsLCBpbnRlbnRFdmVudC50eXBlKTtcclxuICAgIH1cclxuICAgIF9jbGlja0V2ZW50VG9BbmFseXRpY3MoaW50ZW50RXZlbnQpIHtcclxuICAgICAgICBpZiAoIWludGVudEV2ZW50KSByZXR1cm47XHJcbiAgICAgICAgbGV0IGxhYmVsID0gaW50ZW50RXZlbnQucmVnaW9uO1xyXG4gICAgICAgIEdvb2dsZS5zZW5kU29jaWFsKCd0d2l0dGVyJywgbGFiZWwsIGludGVudEV2ZW50LnR5cGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFR3aXR0ZXI7XHJcblxyXG5cclxuIiwiXHJcbmNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuY29uc3QgR29vZ2xlID0gcmVxdWlyZSgnLi9nb29nbGUnKTtcclxuXHJcbmNsYXNzIFVzZXJTbmFwIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgICAgIGxldCBhcGlLZXksIHMsIHg7XHJcbiAgICAgICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBhcGlLZXkgPSBjb25maWcuYXBpO1xyXG4gICAgICAgIGlmIChhcGlLZXkpIHtcclxuICAgICAgICAgICAgbGV0IHVzQ29uZiA9IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsQm94OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWxCb3hWYWx1ZTogdXNlci5lbWFpbCxcclxuICAgICAgICAgICAgICAgIGVtYWlsUmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlUmVjb3JkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdvb2dsZS5zZW5kRXZlbnQoJ2ZlZWRiYWNrJywgJ3VzZXJzbmFwJywgJ3dpZGdldCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0gd2luZG93Ll91c2Vyc25hcGNvbmZpZyA9IHVzQ29uZjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XHJcbiAgICAgICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgICAgICB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHRoaXMudXNlclNuYXAgfHwgd2luZG93LlVzZXJTbmFwO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJTbmFwO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXNlclNuYXA7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgWmVuRGVzayBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICBsZXQgek8gPSB7fTtcclxuICAgICAgICB3aW5kb3cuekVtYmVkIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGUsIHQpIHtcclxuICAgICAgICAgICAgbGV0IG4sIG8sIGQsIGksIHMsIGEgPSBbXSwgciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7IHdpbmRvdy56RW1iZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goYXJndW1lbnRzKVxyXG4gICAgICAgICAgICB9LCB3aW5kb3cuekUgPSB3aW5kb3cuekUgfHwgd2luZG93LnpFbWJlZCwgci5zcmMgPSBcImphdmFzY3JpcHQ6ZmFsc2VcIiwgci50aXRsZSA9IFwiXCIsIHIucm9sZSA9IFwicHJlc2VudGF0aW9uXCIsIChyLmZyYW1lRWxlbWVudCB8fCByKS5zdHlsZS5jc3NUZXh0ID0gXCJkaXNwbGF5OiBub25lXCIsIGQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSwgZCA9IGRbZC5sZW5ndGggLSAxXSwgZC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyLCBkKSwgaSA9IHIuY29udGVudFdpbmRvdywgcyA9IGkuZG9jdW1lbnQ7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBvID0gc1xyXG4gICAgICAgICAgICB9IGNhdGNoIChjKSB7XHJcbiAgICAgICAgICAgICAgICBuID0gZG9jdW1lbnQuZG9tYWluLCByLnNyYyA9ICdqYXZhc2NyaXB0OmxldCBkPWRvY3VtZW50Lm9wZW4oKTtkLmRvbWFpbj1cIicgKyBuICsgJ1wiO3ZvaWQoMCk7JywgbyA9IHNcclxuICAgICAgICAgICAgfSBvLm9wZW4oKS5fbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBvID0gdGhpcy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpOyBuICYmICh0aGlzLmRvbWFpbiA9IG4pLCBvLmlkID0gXCJqcy1pZnJhbWUtYXN5bmNcIiwgby5zcmMgPSBlLCB0aGlzLnQgPSArbmV3IERhdGUsIHRoaXMuemVuZGVza0hvc3QgPSB0LCB0aGlzLnpFUXVldWUgPSBhLCB0aGlzLmJvZHkuYXBwZW5kQ2hpbGQobylcclxuICAgICAgICAgICAgICAgIHpPLmxvZ2ljID0gd2luZG93LnpFO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvLndyaXRlKCc8Ym9keSBvbmxvYWQ9XCJkb2N1bWVudC5fbCgpO1wiPicpLFxyXG4gICAgICAgICAgICBvLmNsb3NlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIChcImh0dHBzOi8vYXNzZXRzLnplbmRlc2suY29tL2VtYmVkZGFibGVfZnJhbWV3b3JrL21haW4uanNcIiwgY29uZmlnLnNpdGUpO1xyXG5cclxuICAgICAgICB6Ty53aWRnZXQgPSB3aW5kb3cuekVtYmVkO1xyXG4gICAgICAgIHpPLmxvZ2ljID0gd2luZG93LnpFO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuekU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZWdyYXRpb24uaWRlbnRpZnkoeyBuYW1lOiB0aGlzLnVzZXIuZnVsbE5hbWUsIGVtYWlsOiB0aGlzLnVzZXIuZW1haWwgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jb25zdCB6ZW5EZXNrID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG5cclxuICAgIHJldHVybiB6TztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gWmVuRGVzazsiLCJjbGFzcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuXHRjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuXHRcdHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG5cdFx0dGhpcy51c2VyID0gdXNlcjtcclxuXHR9XHJcblx0XHJcblx0aW5pdCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRnZXQgaW50ZWdyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4ge307XHJcblx0fVxyXG5cdFxyXG5cdHNldFVzZXIoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0c2VuZEV2ZW50KCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZVBhdGgoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0bG9nb3V0KCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVncmF0aW9uc0Jhc2U7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgR29vZ2xlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XHJcbiAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XHJcbiAgICAgIGxldCBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvLCBzKTtcclxuICAgIH0pKCk7XHJcbiAgICAgIFxyXG4gICAgLy9Hb29nbGUgVGFnIE1hbmFnZXIgQVBJXHJcbiAgICAoZnVuY3Rpb24gKHcsIGQsIHMsIGwsIGkpIHtcclxuICAgICAgd1tsXSA9IHdbbF0gfHwgW107IHdbbF0ucHVzaCh7XHJcbiAgICAgICAgJ2d0bS5zdGFydCc6XHJcbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xyXG4gICAgICB9KTsgbGV0IGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxyXG4gICAgICAgICcvL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndG0uanM/aWQ9JyArIGkgKyBkbDsgZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLCBmKTtcclxuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgdGhpcy5jb25maWcudGFnbWFuYWdlcik7XHJcblxyXG4gICAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XHJcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIChpW3JdLnEgPSBpW3JdLnEgfHwgW10pLnB1c2goYXJndW1lbnRzKTtcclxuICAgICAgfSwgaVtyXS5sID0gMSAqIG5ldyBEYXRlKCk7IGEgPSBzLmNyZWF0ZUVsZW1lbnQobyksXHJcbiAgICAgIG0gPSBzLmdldEVsZW1lbnRzQnlUYWdOYW1lKG8pWzBdOyBhLmFzeW5jID0gMTsgYS5zcmMgPSBnO1xyXG4gICAgICBtLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsIG0pO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICB0aGlzLmdhID0gdGhpcy5nYSB8fCB3aW5kb3cuZ2E7XHJcbiAgICByZXR1cm4gdGhpcy5nYTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBzdXBlci5pbml0KCk7XHJcbiAgICBsZXQgbW9kZSA9ICdhdXRvJztcclxuICAgIGxldCBkb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgIGlmKGRvbWFpbi5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xyXG4gICAgICBtb2RlID0gJ25vbmUnO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignY3JlYXRlJywgdGhpcy5jb25maWcuYW5hbHl0aWNzLCBtb2RlKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICB9XHJcblxyXG4gIHNldFVzZXIoKSB7XHJcbiAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCAndXNlcklkJywgdGhpcy51c2VyLnVzZXJJZCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsIG5ldHdvcmssIHR5cGUsIHRhcmdldFVybCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XHJcbiAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgIGlmIChzb3VyY2UgJiYgdHlwZSkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB2YWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgdmFsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsIHtcclxuICAgICAgICAgICAgcGFnZTogcGF0aFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kRXZlbnQoZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKSB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGU7XHJcblxyXG5cclxuIiwiY29uc3QgcmlvdCA9IHdpbmRvdy5yaW90O1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBwYWdlQm9keSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZS1ib2R5LmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvQWN0aW9uLmpzJyk7XHJcblxyXG5jbGFzcyBQYWdlRmFjdG9yeSB7XHJcbiAgICBjb25zdHJ1Y3RvcihldmVudGVyLCBtZXRhRmlyZSkge1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IG5ldyBBY3Rpb25zKG1ldGFGaXJlLCBldmVudGVyLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfUFJPR1JFU1N9YCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KCcqJyk7XHJcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuY29uZmlndXJlKHsgcGFyZW50OiBgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfUFJPR1JFU1NfTkVYVH1gIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLmluaXQoKTsgLy8gaW5pdCBtZXRyb25pYyBjb3JlIGNvbXBvbmV0c1xyXG4gICAgICAgICAgICAgICAgICAgIExheW91dC5pbml0KCk7IC8vIGluaXQgbGF5b3V0XHJcbiAgICAgICAgICAgICAgICAgICAgRGVtby5pbml0KCk7IC8vIGluaXQgZGVtbyBmZWF0dXJlc1xyXG4gICAgICAgICAgICAgICAgICAgIEluZGV4LmluaXQoKTsgLy8gaW5pdCBpbmRleCBwYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgVGFza3MuaW5pdERhc2hib2FyZFdpZGdldCgpOyAvLyBpbml0IHRhc2ggZGFzaGJvYXJkIHdpZGdldFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcclxuICAgICAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZShwYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBsZXQgYWN0ID0gdGhpcy5hY3Rpb25zLmFjdChwYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIGlmICghYWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhwYXRoLCBwYXRoLCB7IGlkOiBpZCwgYWN0aW9uOiBhY3Rpb24gfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFnZUZhY3Rvcnk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgQ2FudmFzID0gcmVxdWlyZSgnLi4vLi4vY2FudmFzL2NhbnZhcycpO1xyXG5jb25zdCBkMyA9IHJlcXVpcmUoJ2QzJylcclxucmVxdWlyZSgnLi9ub2RlJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0IGp0ay1kZW1vLW1haW5cIiBzdHlsZT1cInBhZGRpbmc6IDA7IFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImp0ay1kZW1vLWNhbnZhcyBjYW52YXMtd2lkZVwiIGlkPVwiZGlhZ3JhbVwiPlxyXG5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cIm1pbml2aWV3XCI+PC9kaXY+XHJcbjwvZGl2PlxyXG48ZGl2IGlkPVwiaW5mb1wiPjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbWV0YS1jYW52YXMnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLm1hcElkID0gbnVsbDtcclxuICAgIHRoaXMuY2FudmFzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmJ1aWxkQ2FudmFzID0gKG1hcCkgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5jYW52YXMpIHtcclxuICAgICAgICAgICAgJCh0aGlzLmRpYWdyYW0pLmVtcHR5KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgd2lkdGggPSAkKHRoaXMuZGlhZ3JhbSkud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgIGhlaWdodCA9ICAkKHRoaXMuZGlhZ3JhbSkuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgeExvYyA9IHdpZHRoLzIgLSAyNSxcclxuICAgICAgICAgICAgICAgIHlMb2MgPSAxMDA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXMobWFwLCB0aGlzLm1hcElkKTtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuaW5pdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtYXAuY2hhbmdlZF9ieSAhPSBNZXRhTWFwLlVzZXIudXNlcktleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuaW5pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWlsZCA9IChvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKG9wdHMuaWQgIT0gdGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG51bGxcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub2ZmKGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubWFwSWQgPSBvcHRzLmlkO1xyXG4gICAgICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYG1hcHMvZGF0YS8ke29wdHMuaWR9YCwgdGhpcy5idWlsZENhbnZhcyk7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuRXZlbnRlci5mb3JnZXQoJ21hcCcsIHRoaXMuYnVpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIuZXZlcnkoJ21hcCcsIHRoaXMuYnVpbGQpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcclxuICAgICAgICAkKHRoaXMuZGlhZ3JhbSkuY3NzKHtcclxuICAgICAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxNTQgKyAncHgnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY29ycmVjdEhlaWdodCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi4vLi4vY2FudmFzL2NhbnZhcycpO1xyXG5jb25zdCBkMyA9IHJlcXVpcmUoJ2QzJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbmBcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ25vZGUnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdyYWR1YXRpb24tY2FwXCI+PC9pPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNzBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IGhlbHAgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGhlbHAgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1oZWxwJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICB0aGlzLmhlbHAgPSBudWxsO1xyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9oZWxwJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oZWxwID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWJlbGwtb1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBub3RpZmljYXRpb25zLmxlbmd0aCB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV4dGVybmFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IG5vdGlmaWNhdGlvbnMubGVuZ3RoIH0gcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9ueyBzOiBub3RpZmljYXRpb25zLmxlbmd0aCA9PSAwIHx8IG5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBub3RpZmljYXRpb25zIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IG5vdGlmaWNhdGlvbnMgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lXCI+eyB0aW1lIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC1pY29uIGxhYmVsLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGV2ZW50IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1ub3RpZmljYXRpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IFtdO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAgICAgXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL25vdGlmaWNhdGlvbnMnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtdHJvcGh5XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2Utc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHBvaW50cy5sZW5ndGggfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJib2xkXCI+eyBwb2ludHMubGVuZ3RoIH0gbmV3IDwvc3Bhbj4gYWNoaWV2ZW1lbnR7IHM6IHBvaW50cy5sZW5ndGggPT0gMCB8fCBwb2ludHMubGVuZ3RoID4gMSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBwb2ludHMgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgcG9pbnRzIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZVwiPnsgdGltZSB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRldGFpbHNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBldmVudCB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtcG9pbnRzJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYHVzZXJzLyR7TWV0YU1hcC5Vc2VyLnVzZXJJZH0vcG9pbnRzYCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidXNlcm5hbWUgdXNlcm5hbWUtaGlkZS1vbi1tb2JpbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VybmFtZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgYWx0PVwiXCIgaGVpZ2h0PVwiMzlcIiB3aWR0aD1cIjM5XCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwieyBwaWN0dXJlIH1cIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBkcm9wZG93bi1tZW51LWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IG1lbnUgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IG1lbnUgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtdXNlcicsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLm1lbnUgPSBbXTtcclxuICAgIHRoaXMudXNlcm5hbWUgPSAnJztcclxuICAgIHRoaXMucGljdHVyZSA9ICcnO1xyXG5cclxuICAgIHRoaXMubG9nb3V0ID0gKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAubG9nb3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5saW5rQWNjb3VudCA9ICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLkF1dGgwLmxpbmtBY2NvdW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICBzd2l0Y2goZXZlbnQuaXRlbS5saW5rKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJyNsaW5rLXNvY2lhbC1hY2NvdW50cyc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmtBY2NvdW50KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYG1ldGFtYXAvdXNlcmAsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBNZXRhTWFwLlVzZXIuZGlzcGxheU5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMucGljdHVyZSA9IE1ldGFNYXAuVXNlci5waWN0dXJlO1xyXG4gICAgICAgICAgICB0aGlzLm1lbnUgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbnJlcXVpcmUoJy4uL3Rvb2xzL3NoaW1zJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1hY3Rpb25zXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gcmVkLWhhemUgYnRuLXNtIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRkZW4tc20gaGlkZGVuLXhzXCI+QWN0aW9ucyZuYnNwOzwvc3Bhbj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxyXG4gICAgICAgICAgICA8bGkgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEgfVwiIGNsYXNzPVwieyBzdGFydDogaSA9PSAwLCBhY3RpdmU6IGkgPT0gMCB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBpZj1cInsgcGFyZW50LmdldExpbmtBbGxvd2VkKHZhbCkgfVwiIGhyZWY9XCJ7IHBhcmVudC5nZXRBY3Rpb25MaW5rKHZhbCkgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyB2YWwuaWNvbiB9XCI+PC9pPiB7IHZhbC50aXRsZSB9XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxyXG4gICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3NldHRpbmdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1nZWFyXCI+PC9pPiBTZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8c3BhbiBzdHlsZT1cInBhZGRpbmctbGVmdDogNXB4O1wiPlxyXG4gICAgICAgIDxzcGFuIGlmPVwieyBwYWdlTmFtZSB9XCJcclxuICAgICAgICAgICAgICAgIGlkPVwibWFwX25hbWVcIlxyXG4gICAgICAgICAgICAgICAgZGF0YS10eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICBkYXRhLXRpdGxlPVwiRW50ZXIgbWFwIG5hbWVcIj5cclxuICAgICAgICAgICAgeyBwYWdlTmFtZSB9XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgPC9zcGFuPlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYWN0aW9ucycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgIHRoaXMucGFnZU5hbWUgPSAnSG9tZSc7XHJcbiAgICB0aGlzLnVybCA9IE1ldGFNYXAuY29uZmlnLnNpdGUuZGIgKyAnLmZpcmViYXNlaW8uY29tJztcclxuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5nZXRBY3Rpb25MaW5rID0gKG9iaikgPT4ge1xyXG4gICAgICAgIGxldCByZXQgPSBvYmoubGluaztcclxuICAgICAgICBpZiAob2JqLnVybF9wYXJhbXMpIHtcclxuICAgICAgICAgICAgbGV0IGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgXy5lYWNoKG9iai51cmxfcGFyYW1zLCAocHJtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2godGhpc1twcm0ubmFtZV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0ID0gb2JqLmxpbmsuZm9ybWF0LmNhbGwob2JqLmxpbmssIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0TGlua0FsbG93ZWQgPSAob2JqKSA9PiB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bJyonXTtcclxuICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFBhZ2UgPSBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aDtcclxuICAgICAgICAgICAgcmV0ID0gdHJ1ZSA9PSBvYmpbJ2FsbG93ZWQtb24nXVtjdXJyZW50UGFnZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5iaW5kVG9wYWdlTmFtZSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfS9uYW1lYCwgKG5hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZU5hbWUgPSBuYW1lIHx8ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgncGFnZU5hbWUnLCAob3B0cykgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmxvYWRlZCkge1xyXG4gICAgICAgICAgICAkKHRoaXMubWFwX25hbWUpLmVkaXRhYmxlKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm1hcElkKSB7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub2ZmKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke3RoaXMubWFwSWR9L25hbWVgKTtcclxuICAgICAgICAgICAgaWYgKG9wdHMuaWQpIHtcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7b3B0cy5pZH0vbmFtZWAsIChuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFnZU5hbWUgPSBvcHRzLm5hbWUgfHwgJ0hvbWUnO1xyXG4gICAgICAgIHRoaXMubWFwSWQgPSBvcHRzLmlkO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfS9uYW1lYCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRUb3BhZ2VOYW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9hY3Rpb25zJywgKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZUhlYWRlciA9IHJlcXVpcmUoJy4vcGFnZS1oZWFkZXInKTtcclxuY29uc3QgcGFnZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vcGFnZS1jb250YWluZXInKTtcclxuY29uc3QgcGFnZUZvb3RlciA9IHJlcXVpcmUoJy4vcGFnZS1mb290ZXInKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cInBhZ2VfYm9keVwiIGNsYXNzPVwicGFnZS1oZWFkZXItZml4ZWQgcGFnZS1zaWRlYmFyLWNsb3NlZC1oaWRlLWxvZ28gcGFnZS1zaWRlYmFyLWNsb3NlZC1oaWRlLWxvZ29cIj5cclxuXHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2hlYWRlclwiPjwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250YWluZXJcIj48L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG5cclxuPGRpdiBpZD1cIm1ldGFfcGFnZV9mb290ZXJcIj48L2Rpdj5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1ib2R5JywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9oZWFkZXIsICdwYWdlLWhlYWRlcicpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfY29udGFpbmVyLCAncGFnZS1jb250YWluZXInKTtcclxuLy8gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfZGlhbG9nLCAnbWV0YS1kaWFsb2cnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2Zvb3RlciwgJ3BhZ2UtZm9vdGVyJyk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5wYWdlX2JvZHkpLmFkZENsYXNzKCdwYWdlLXNpZGViYXItcmV2ZXJzZWQnKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBcclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5wYWdlX2JvZHkpLnJlbW92ZUNsYXNzKCdwYWdlLXNpZGViYXItcmV2ZXJzZWQnKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZVNpZGViYXIgPSByZXF1aXJlKCcuL3BhZ2Utc2lkZWJhci5qcycpO1xyXG5jb25zdCBwYWdlQ29udGVudCA9IHJlcXVpcmUoJy4vcGFnZS1jb250ZW50LmpzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1jb250YWluZXJcIj5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2Vfc2lkZWJhclwiPjwvZGl2PlxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250ZW50XCI+PC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb250YWluZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3NpZGViYXIsICdwYWdlLXNpZGViYXInKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2NvbnRlbnQsICdwYWdlLWNvbnRlbnQnKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRlbnQtd3JhcHBlclwiPlxyXG4gICAgPGRpdiBpZD1cInBhZ2UtY29udGVudFwiIGNsYXNzPVwicGFnZS1jb250ZW50XCI+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWhlYWRcIj5cclxuXHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG5cclxuICAgICAgICA8ZGl2IGlkPVwiYXBwLWNvbnRhaW5lclwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY29udGVudCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgJCh0aGlzWydhcHAtY29udGFpbmVyJ10pLmNzcyh7IHdpZHRoOiBgJHt3aWR0aCAtIDQ2fXB4YCB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgICQodGhpc1snYXBwLWNvbnRhaW5lciddKS5jc3MoeyB3aWR0aDogYDEwMCVgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbiAgICAgICAgJCh0aGlzWydhcHAtY29udGFpbmVyJ10pLmNzcyh7IHdpZHRoOiBgMTAwJWAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1mb290ZXJcIiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAwO1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBhZ2UtZm9vdGVyLWlubmVyXCI+XHJcbiAgICAgICAgPGEgaHJlZj1cIiN0ZXJtc1wiPiZjb3B5OzIwMTU8L2E+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWZvb3RlcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBwYWdlTG9nbyA9IHJlcXVpcmUoJy4vcGFnZS1sb2dvLmpzJyk7XHJcbmNvbnN0IHBhZ2VBY3Rpb25zID0gcmVxdWlyZSgnLi9wYWdlLWFjdGlvbnMuanMnKTtcclxuY29uc3QgcGFnZVNlYXJjaCA9IHJlcXVpcmUoJy4vcGFnZS1zZWFyY2guanMnKTtcclxuY29uc3QgcGFnZVRvcE1lbnUgPSByZXF1aXJlKCcuL3BhZ2UtdG9wbWVudScpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cImhlYWRlci10b3BcIiBjbGFzcz1cInBhZ2UtaGVhZGVyIG5hdmJhciBuYXZiYXItZml4ZWQtdG9wXCI+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wcm9ncmVzc19uZXh0XCIgc3R5bGU9XCJvdmVyZmxvdzogaW5oZXJpdDtcIj48L2Rpdj5cclxuICAgIDxkaXYgaWQ9XCJoZWFkZXItY29udGVudFwiIGNsYXNzPVwicGFnZS1oZWFkZXItaW5uZXJcIj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9sb2dvXCI+PC9kaXY+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9hY3Rpb25zXCI+PC9kaXY+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV90b3BcIiBjbGFzcz1cInBhZ2UtdG9wXCI+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2Vfc2VhcmNoXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcG1lbnVcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1oZWFkZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2xvZ28sICdwYWdlLWxvZ28nKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2FjdGlvbnMsICdwYWdlLWFjdGlvbnMnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3RvcCwgJ3BhZ2Utc2VhcmNoJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV90b3AsICdwYWdlLXRvcG1lbnUnKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcyA9XCJwYWdlLWxvZ29cIj5cclxuICAgIDxhIGlkPVwibWV0YV9sb2dvXCIgaHJlZj1cIiNob21lXCI+XHJcbiAgICAgICAgPGltZyBzcmM9XCJhc3NldHMvaW1nL21ldGFtYXBfY2xvdWQucG5nXCIgYWx0PVwibG9nb1wiIGNsYXNzID1cImxvZ28tZGVmYXVsdFwiIC8+XHJcbiAgICA8L2E+XHJcbiAgICA8ZGl2IGlkPVwibWV0YV9tZW51X3RvZ2dsZVwiIGNsYXNzID1cIm1lbnUtdG9nZ2xlciBzaWRlYmFyLXRvZ2dsZXJcIiBzdHlsZT1cInsgZ2V0RGlzcGxheSgnbWVudScpIH1cIj5cclxuICAgICAgICA8IS0tRE9DOiBSZW1vdmUgdGhlIGFib3ZlIFwiaGlkZVwiIHRvIGVuYWJsZSB0aGUgc2lkZWJhciB0b2dnbGVyIGJ1dHRvbiBvbiBoZWFkZXItLT5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzID1cIm1lbnUtdG9nZ2xlciByZXNwb25zaXZlLXRvZ2dsZXJcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+XHJcbjwvYT5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbG9nbycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG4gICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoZWwpID0+IHtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UsICgpID0+IHtcclxuICAgICAgICB0aGlzLmRpc3BsYXkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjwhLS0gRE9DOiBBcHBseSBcInNlYXJjaC1mb3JtLWV4cGFuZGVkXCIgcmlnaHQgYWZ0ZXIgdGhlIFwic2VhcmNoLWZvcm1cIiBjbGFzcyB0byBoYXZlIGhhbGYgZXhwYW5kZWQgc2VhcmNoIGJveCAtLT5cclxuPGZvcm0gY2xhc3M9XCJzZWFyY2gtZm9ybVwiIGFjdGlvbj1cImV4dHJhX3NlYXJjaC5odG1sXCIgbWV0aG9kPVwiR0VUXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoLi4uXCIgbmFtZT1cInF1ZXJ5XCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJidG4gc3VibWl0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zZWFyY2hcIj48L2k+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuPC9mb3JtPlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1zZWFyY2gnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICBcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2Utc2lkZWJhci13cmFwcGVyXCIgc3R5bGU9XCJ7IGdldERpc3BsYXkoKSB9XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyIG5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cInBhZ2Utc2lkZWJhci1tZW51IFwiIGRhdGEta2VlcC1leHBhbmRlZD1cImZhbHNlXCIgZGF0YS1hdXRvLXNjcm9sbD1cInRydWVcIiBkYXRhLXNsaWRlLXNwZWVkPVwiMjAwXCI+XHJcblxyXG4gICAgICAgICAgICA8bGkgaWY9XCJ7IGRhdGEgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5jbGljayB9XCIgZWFjaD1cInsgZGF0YSB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBpZj1cInsgaWNvbiB9XCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIiBzdHlsZT1cImNvbG9yOiN7IGNvbG9yIH07XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ7IGFycm93OiBtZW51Lmxlbmd0aCB9XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGlmPVwieyBtZW51ICYmIG1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cInN1Yi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lbnUgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG5cclxuICAgICAgICA8L3VsPlxyXG5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2Utc2lkZWJhcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuY2xpY2sgPSBmdW5jdGlvbigpIHsgY29uc29sZS5sb2coJ2ZvbycpIH1cclxuICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XHJcbiAgICB0aGlzLmRhdGEgPSBbXTtcclxuXHJcbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL3NpZGViYXInLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoaW5jbHVkZSAmJiBkLm1lbnUgJiYgZC5tZW51KSB7XHJcbiAgICAgICAgICAgICAgICBkLm1lbnUgPSBfLmZpbHRlcihfLnNvcnRCeShkLm1lbnUsICdvcmRlcicpLCAobSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgdGhpcy5nZXREaXNwbGF5ID0gKCkgPT4ge1xyXG4gICAgICAgIGlmKCF0aGlzLmRpc3BsYXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdkaXNwbGF5OiBub25lOyc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sICgpID0+IHtcclxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbWV0YVBvaW50cyA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLXBvaW50cy5qcycpO1xyXG5jb25zdCBtZXRhSGVscCA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLWhlbHAuanMnKTtcclxuY29uc3QgbWV0YVVzZXIgPSByZXF1aXJlKCcuL21lbnUvbWV0YS11c2VyLmpzJyk7XHJcbmNvbnN0IG1ldGFOb3QgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1ub3RpZmljYXRpb25zLmpzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwidG9wLW1lbnVcIj5cclxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IHB1bGwtcmlnaHRcIj5cclxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIiBpZD1cImhlYWRlcl9kYXNoYm9hcmRfYmFyXCIgb25jbGljaz1cInsgb25DbGljayB9XCI+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgaHJlZj1cIiNob21lXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWhvbWVcIj48L2k+XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2xpPlxyXG4gICAgICAgIFxyXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIiBpZD1cImhlYWRlcl9ub3RpZmljYXRpb25fYmFyXCI+PC9saT5cclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX3BvaW50c19iYXJcIj48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl9oZWxwX2JhclwiIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCI+PC9saT5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl91c2VyX21lbnVcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLXVzZXIgZHJvcGRvd25cIj48L2xpPlxyXG4gICAgPC91bD5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRvcG1lbnUnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfcG9pbnRzX2JhciwgJ21ldGEtcG9pbnRzJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9ub3RpZmljYXRpb25fYmFyLCAnbWV0YS1ub3RpZmljYXRpb25zJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9oZWxwX2JhciwgJ21ldGEtaGVscCcpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfdXNlcl9tZW51LCAnbWV0YS11c2VyJyk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdyBtYXJnaW4tYm90dG9tLTMwXCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPnsgaGVhZGVyLnRpdGxlIH08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8bGkgZWFjaD1cInsgYXJlYXMgfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0XHRcdFx0PCEtLSBCbG9ja3F1b3RlcyAtLT5cclxuXHRcdFx0XHRcdFx0XHQ8YmxvY2txdW90ZSBjbGFzcz1cImhlcm9cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwPnsgcXVvdGUudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNtYWxsPnsgcXVvdGUuYnkgfTwvc21hbGw+XHJcblx0XHRcdFx0XHRcdFx0PC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkZHRoaXNfaG9yaXpvbnRhbF9mb2xsb3dfdG9vbGJveFwiPjwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcyA9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpZnJhbWUgaWY9XCJ7IGhlYWRlci55b3V0dWJlaWQgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ5dHBsYXllclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHQvaHRtbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQveyBoZWFkZXIueW91dHViZWlkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzID1cImZpdHZpZHNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiaGVpZ2h0OiAzMjdweDsgd2lkdGg6IDEwMCU7IGRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tbGVmdDogYXV0bzsgbWFyZ2luLXJpZ2h0OiBhdXRvOyBicm9kZXI6IDA7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcblx0XHRcdFx0XHRcdFx0PC9pZnJhbWU+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRsaW5lXCI+XHJcblx0XHRcdFx0XHRcdDxoMz57IHVzZXJOYW1lIH17IHZpc2lvbi50aXRsZSB9PC9oMz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgdmlzaW9uLnRleHQgfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdob21lJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XHJcbiAgICBcclxuICAgIHRoaXMuYXJlYXMgPSBbXVxyXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5IT01FLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuYXJlYXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLmFyZWFzLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5xdW90ZSA9IGRhdGEucXVvdGU7XHJcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcclxuICAgICAgICB0aGlzLnZpc2lvbiA9IGRhdGEudmlzaW9uO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICBcclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGJveCBncmV5LWNhc2NhZGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LXRpdGxlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1pY29uLXRoLWxhcmdlXCI+PC9pPk1ldGFNYXBzXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZj1cInsgbWVudSB9XCIgY2xhc3M9XCJhY3Rpb25zXCI+XHJcbiAgICAgICAgICAgIDxhIGVhY2g9XCJ7IG1lbnUuYnV0dG9ucyB9XCIgaHJlZj1cInsgbGluayB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQWN0aW9uQ2xpY2sgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNvZ3NcIj48L2k+IFRvb2xzIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBlYWNoPVwieyBtZW51Lm1lbnUgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk1lbnVDbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnMgcG9ydGxldC10YWJzXCI+XHJcbiAgICAgICAgICAgIDxsaSBvbmNsaWNrPVwieyBwYXJlbnQub25UYWJTd2l0Y2ggfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInsgYWN0aXZlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNteW1hcHNfMV97IGkgfVwiIGRhdGEtdG9nZ2xlPVwidGFiXCIgYXJpYS1leHBhbmRlZD1cInsgdHJ1ZTogaSA9PSAwIH1cIj5cclxuICAgICAgICAgICAgICAgIHsgdmFsLnRpdGxlIH08L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGUtdG9vbGJhclwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ0YWItcGFuZSBmYXNlIGluIHsgYWN0aXZlOiBpID09IDAgfVwiIGlkPVwibXltYXBzXzFfeyBpIH1cIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQgdGFibGUtaG92ZXJcIiBpZD1cIm15bWFwc190YWJsZV97IGkgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXBJZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInRhYmxlLWNoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlmPVwieyBwYXJlbnQuY3VycmVudFRhYiA9PSAnTXkgTWFwcycgfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiZ3JvdXAtY2hlY2thYmxlXCIgZGF0YS1zZXQ9XCIjbXltYXBzX3RhYmxlX3sgaSB9IC5jaGVja2JveGVzXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXNlcklkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlZCBPblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgaWY9XCJ7IHBhcmVudC5kYXRhICYmIHBhcmVudC5kYXRhW2ldIH1cIiBlYWNoPVwieyBwYXJlbnQuZGF0YVtpXSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiID48c3BhbiBkYXRhLXNlbGVjdG9yPVwiaWRcIiBjbGFzcyA9XCJtYXBpZFwiPnsgaWQgfTwvc3Bhbj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgcGFyZW50LmN1cnJlbnRUYWIgPT0gJ015IE1hcHMnIH1cIiB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNoZWNrYm94ZXNcIiB2YWx1ZT1cIjFcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj57IHVzZXJfaWQgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC5lZGl0YWJsZSB9XCIgY2xhc3M9XCJtZXRhX2VkaXRhYmxlX3sgaSB9XCIgZGF0YS1waz1cInsgaWQgfVwiIGRhdGEtdGl0bGU9XCJFZGl0IE1hcCBOYW1lXCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyAhdmFsLmVkaXRhYmxlIH1cIj57IG5hbWUgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjZW50ZXJcIj57IGNyZWF0ZWRfYXQgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByaXZhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNtIGJsdWUgZmlsdGVyLXN1Ym1pdFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk9wZW4gfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tZXllLW9wZW5cIj48L2k+IE9wZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbXktbWFwcycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgdGhpcy5tZW51ID0gbnVsbDtcclxuICAgIHRoaXMudGFicyA9IF8uc29ydEJ5KFt7IHRpdGxlOiAnTXkgTWFwcycsIG9yZGVyOiAwLCBlZGl0YWJsZTogdHJ1ZSB9LCB7IHRpdGxlOiAnU2hhcmVkIHdpdGggTWUnLCBvcmRlcjogMSwgZWRpdGFibGU6IGZhbHNlIH1dLCAnb3JkZXInKTtcclxuICAgIHRoaXMuY3VycmVudFRhYiA9ICdNeSBNYXBzJztcclxuXHJcbiAgICB0aGlzLm9uT3BlbiA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHtldmVudC5pdGVtLmlkfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25UYWJTd2l0Y2ggPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUYWIgPSBldmVudC5pdGVtLnZhbC50aXRsZTtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VycmVudFRhYikge1xyXG4gICAgICAgICAgICBjYXNlICdNeSBNYXBzJzpcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkFjdGlvbkNsaWNrID0gKGV2ZW50LCB0YWcpID0+IHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uTWVudUNsaWNrID0gKGV2ZW50LCB0YWcpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VGFiID09ICdNeSBNYXBzJykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50Lml0ZW0udGl0bGUudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVNYXBzID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9EZWxldGVNYXAuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzW2B0YWJsZTBgXS5maW5kKCcuYWN0aXZlJykuZmluZCgnLm1hcGlkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChzZWxlY3RlZCwgKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnB1c2goY2VsbC5pbm5lckhUTUwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZU1hcHMuZGVsZXRlQWxsKGlkcywgQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaW5kID0gdGhpc1tgdGFibGUwYF0uZmluZCgndGJvZHkgdHIgLmNoZWNrYm94ZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICBmaW5kLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5LnVuaWZvcm0udXBkYXRlKGZpbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvbXltYXBzJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVudSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBfLnNvcnRCeShkYXRhLmJ1dHRvbnMsICdvcmRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lbnU6IF8uc29ydEJ5KGRhdGEubWVudSwgJ29yZGVyJylcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkVGFibGUgPSAoaWR4LCBsaXN0LCBlZGl0YWJsZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2lkeF0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbYHRhYmxlJHtpZHh9YF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0gPSAkKHRoaXNbYG15bWFwc190YWJsZV8ke2lkeH1gXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXSA9IHRoaXNbYHRhYmxlJHtpZHh9YF0uRGF0YVRhYmxlKHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCB1c2VzIHNjcm9sbGFibGUgZGl2KHRhYmxlLXNjcm9sbGFibGUpIHdpdGggb3ZlcmZsb3c6YXV0byB0byBlbmFibGUgdmVydGljYWwgc2Nyb2xsKHNlZTogYXNzZXRzL2dsb2JhbC9wbHVnaW5zL2RhdGF0YWJsZXMvcGx1Z2lucy9ib290c3RyYXAvZGF0YVRhYmxlcy5ib290c3RyYXAuanMpLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHdoZW4gZHJvcGRvd25zIHVzZWQgdGhlIHNjcm9sbGFibGUgZGl2IHNob3VsZCBiZSByZW1vdmVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbHVtbnMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29yZGVyYWJsZSc6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcmFibGUnOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcmFibGUnOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcmFibGUnOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcmFibGUnOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb3JkZXJhYmxlJzogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzW2B0YWJsZSR7aWR4fWBdVG9vbHMgPSBuZXcgJC5mbi5kYXRhVGFibGUuVGFibGVUb29scyh0aGlzW2BkYXRhVGFibGUke2lkeH1gXSwge30pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0YWJsZVdyYXBwZXIgPSB0aGlzW2B0YWJsZSR7aWR4fWBdLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoYCNteW1hcHNfJHtpZHh9X3RhYmxlX3dyYXBwZXJgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdLmZpbmQoJy5ncm91cC1jaGVja2FibGUnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXQgPSBqUXVlcnkodGhpcykuYXR0cignZGF0YS1zZXQnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlZCA9IGpRdWVyeSh0aGlzKS5pcygnOmNoZWNrZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoc2V0KS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBqUXVlcnkudW5pZm9ybS51cGRhdGUoc2V0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0ub24oJ2NoYW5nZScsICd0Ym9keSB0ciAuY2hlY2tib3hlcycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGFibGVXcmFwcGVyLmZpbmQoJy5kYXRhVGFibGVzX2xlbmd0aCBzZWxlY3QnKS5hZGRDbGFzcygnZm9ybS1jb250cm9sIGlucHV0LXhzbWFsbCBpbnB1dC1pbmxpbmUnKTsgLy8gbW9kaWZ5IHRhYmxlIHBlciBwYWdlIGRyb3Bkb3duXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVkaXRhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoeyB1bnNhdmVkY2xhc3M6IG51bGwgfSkub24oJ3NhdmUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7aWR9L25hbWVgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0Q2hpbGQoQ09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1QpLm9yZGVyQnlDaGlsZCgnb3duZXInKS5lcXVhbFRvKE1ldGFNYXAuVXNlci51c2VySWQpLm9uKCd2YWx1ZScsICh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcclxuICAgICAgICAgICAgY29uc3QgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQob2JqLmNyZWF0ZWRfYXQpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGJ1aWxkVGFibGUoMCwgbWFwcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0Q2hpbGQoQ09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1QpLm9uKCd2YWx1ZScsICh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcclxuICAgICAgICAgICAgbGV0IG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIgPT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCB8fCAhb2JqLnNoYXJlZF93aXRoIHx8IG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXSAhPSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbWFwcyA9IF8uZmlsdGVyKG1hcHMsIChtYXApID0+IHsgcmV0dXJuIG1hcCAmJiBtYXAuaWQgfSlcclxuICAgICAgICAgICAgYnVpbGRUYWJsZSgxLCBtYXBzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+eyBoZWFkZXIudGl0bGUgfTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IGhlYWRlci50ZXh0IH08L3A+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBlYWNoPVwieyBhcmVhcyB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxyXG4gICAgXHRcdFx0XHRcdFx0PGgzPnsgdGl0bGUgfTwvaDM+XHJcbiAgICBcdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IHRleHQgfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxiPnsgdGl0bGUgfTwvYj4geyB0ZXh0IH1cclxuXHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHQ8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Rlcm1zJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICBcclxuICAgIHRoaXMuYXJlYXMgPSBbXVxyXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5URVJNU19BTkRfQ09ORElUSU9OUywgKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLmFyZWFzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5zZWN0aW9ucywgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKGluY2x1ZGUpIHtcclxuICAgICAgICAgICAgICAgIGQuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkLml0ZW1zLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5jbHVkZTIgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xyXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICBcclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5cclxuY2xhc3MgQ29tbW9uIHtcclxuXHJcbiAgICBzdGF0aWMgc3BsaXRMaW5lcyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQoL1xcbi8pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRFdmVudFRpbWUodCwgbm93KSB7XHJcbiAgICAgICAgbGV0IHRpbWUgPSBtb21lbnQodCwgJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyk7XHJcbiAgICAgICAgbGV0IG5vd3RpbWUgPSBtb21lbnQobm93LCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndDogICAgICAgJyArIHQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3c6ICAgICAnICsgbm93KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndGltZTogICAgJyArIHRpbWUuZm9ybWF0KCkpOyAvLyArICcgJyArIHRpbWUuaXNWYWxpZCgpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm93dGltZTogJyArIG5vd3RpbWUuZm9ybWF0KCkpOyAvLyArICcgJyArIG5vd3RpbWUuaXNWYWxpZCgpKTtcclxuICAgICAgICByZXR1cm4gdGltZS5mcm9tKG5vd3RpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjbGFzc0lmKGtsYXNzLCBiKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2xhc3NJZjogJyArIGtsYXNzICsgJywgJyArIGIpO1xyXG4gICAgICAgIHJldHVybiAoYiA/IGtsYXNzIDogJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGF2b2lkICckYXBwbHkgYWxyZWFkeSBpbiBwcm9ncmVzcycgZXJyb3IgKHNvdXJjZTogaHR0cHM6Ly9jb2RlcndhbGwuY29tL3Avbmdpc21hKVxyXG4gICAgc3RhdGljIHNhZmVBcHBseShmbikge1xyXG4gICAgICAgIGlmIChmbiAmJiAodHlwZW9mIChmbikgPT09ICdmdW5jdGlvbicpKSB7XHJcbiAgICAgICAgICAgIGZuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNvdXJjZTogaHR0cDovL2N0cmxxLm9yZy9jb2RlLzE5NjE2LWRldGVjdC10b3VjaC1zY3JlZW4tamF2YXNjcmlwdFxyXG4gICAgc3RhdGljIGlzVG91Y2hEZXZpY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCAobmF2aWdhdG9yLk1heFRvdWNoUG9pbnRzID4gMCkgfHwgKG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUaWNrc0Zyb21EYXRlKGRhdGUpIHtcclxuICAgICAgICBsZXQgcmV0ID0gbnVsbDtcclxuICAgICAgICBpZihkYXRlICYmIGRhdGUuZ2V0VGltZSkge1xyXG4gICAgICAgICAgICByZXQgPSBkYXRlLmdldFRpbWUoKS8xMDAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21tb247IiwiaWYgKCFTdHJpbmcucHJvdG90eXBlLmZvcm1hdCkge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgID8gYXJnc1tudW1iZXJdXG4gICAgICAgICAgICAgIDogbWF0Y2hcbiAgICAgICAgICAgIDtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0iLCJjb25zdCB1dWlkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGhleERpZ2l0cywgaSwgcywgdXVpZDtcclxuICAgIHMgPSBbXTtcclxuICAgIHMubGVuZ3RoID0gMzY7XHJcbiAgICBoZXhEaWdpdHMgPSAnMDEyMzQ1Njc4OWFiY2RlZic7XHJcbiAgICBpID0gMDtcclxuICAgIHdoaWxlIChpIDwgMzYpIHtcclxuICAgICAgICBzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSk7XHJcbiAgICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgc1sxNF0gPSAnNCc7XHJcbiAgICBzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSk7XHJcbiAgICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gJy0nO1xyXG4gICAgdXVpZCA9IHMuam9pbignJyk7XHJcbiAgICByZXR1cm4gdXVpZDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXVpZDsiXX0=
