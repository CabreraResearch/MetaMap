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

},{"./js/app//Config.js":16,"./js/app/Eventer.js":17,"./js/app/Integrations":19,"./js/app/Router.js":21,"./js/app/auth0":23,"./js/app/user.js":24,"./js/integrations/google.js":44,"./js/pages/PageFactory.js":45,"./js/tools/shims.js":77,"airbrake-js":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"jquery":undefined,"jquery-ui":undefined,"lodash":undefined,"riot":"riot"}],2:[function(require,module,exports){
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
                    case CONSTANTS.ACTIONS.OPEN_MAP:
                        Method = require('./OpenMap.js');
                        break;
                    case CONSTANTS.ACTIONS.TRAININGS:
                        Method = require('./OpenTraining.js');
                        break;
                    case CONSTANTS.ACTIONS.NEW_MAP:
                        Method = require('./NewMap.js');
                        break;
                    case CONSTANTS.ACTIONS.COPY_MAP:
                        Method = require('./CopyMap.js');
                        break;
                    case CONSTANTS.ACTIONS.COURSE_LIST:
                        Method = require('./Courses');
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
                this.closeSidebar();

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

},{"../constants/constants":29,"./ActionBase.js":3,"./CopyMap.js":4,"./Courses":5,"./DeleteMap.js":6,"./Feedback":7,"./Home.js":8,"./Logout.js":9,"./MyMaps.js":10,"./NewMap.js":11,"./OpenMap.js":12,"./OpenTraining.js":13,"./ShareMap":14,"./Terms.js":15}],3:[function(require,module,exports){
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
        value: function act(id) {
            return false;
        }
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
        value: function openSidebar(id) {
            this.sidebarOpen = true;
            this.eventer['do'](CONSTANTS.EVENTS.SIDEBAR_OPEN, id);
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

},{"../../MetaMap.js":1,"../constants/constants":29}],4:[function(require,module,exports){
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

},{"../constants/constants":29,"./ActionBase.js":3}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var riot = require('riot');
var ActionBase = require('./ActionBase.js');
var CONSTANTS = require('../constants/constants');
var home = require('../tags/pages/courses');

var Courses = (function (_ActionBase) {
    _inherits(Courses, _ActionBase);

    function Courses() {
        _classCallCheck(this, Courses);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Courses.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(Courses, [{
        key: 'act',
        value: function act(id) {
            var _get2, _eventer, _eventer2;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(Courses.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            $('#' + CONSTANTS.ELEMENTS.APP_CONTAINER).empty();
            var tag = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.COURSE_LIST)[0];
            tag.update();
            (_eventer = this.eventer)['do'].apply(_eventer, [CONSTANTS.PAGES.COURSE_LIST, { id: id }].concat(params));
            (_eventer2 = this.eventer)['do'].apply(_eventer2, [CONSTANTS.EVENTS.PAGE_NAME, { name: 'Courses' }].concat(params));
            this.closeSidebar();

            return true;
        }
    }]);

    return Courses;
})(ActionBase);

module.exports = Courses;

},{"../constants/constants":29,"../tags/pages/courses":65,"./ActionBase.js":3,"riot":"riot"}],6:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"../constants/constants":29,"./ActionBase.js":3,"lodash":undefined}],7:[function(require,module,exports){
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

},{"./ActionBase.js":3}],8:[function(require,module,exports){
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

},{"../constants/constants":29,"../tags/pages/home":66,"./ActionBase.js":3,"riot":"riot"}],9:[function(require,module,exports){
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

},{"../../MetaMap.js":1,"../constants/constants":29,"./ActionBase.js":3,"lodash":undefined}],10:[function(require,module,exports){
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

},{"../constants/constants":29,"../tags/pages/my-maps":67,"./ActionBase.js":3,"riot":"riot"}],11:[function(require,module,exports){
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

},{"../constants/constants":29,"./ActionBase.js":3}],12:[function(require,module,exports){
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
                    (_eventer = _this.eventer)['do'].apply(_eventer, [CONSTANTS.EVENTS.NAV, CONSTANTS.PAGES.MAP, map].concat(params));
                    (_eventer2 = _this.eventer)['do'].apply(_eventer2, [CONSTANTS.EVENTS.PAGE_NAME, map].concat(params));
                    (_eventer3 = _this.eventer)['do'].apply(_eventer3, [CONSTANTS.EVENTS.MAP, map].concat(params));
                }
            });
            return true;
        }
    }]);

    return OpenMap;
})(ActionBase);

module.exports = OpenMap;

},{"../constants/constants":29,"../tags/canvas/meta-canvas.js":46,"./ActionBase.js":3,"riot":"riot"}],13:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var riot = require('riot');
var ActionBase = require('./ActionBase');
var CONSTANTS = require('../constants/constants');
var training = require('../tags/pages/training');

var OpenTraining = (function (_ActionBase) {
    _inherits(OpenTraining, _ActionBase);

    function OpenTraining() {
        _classCallCheck(this, OpenTraining);

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(OpenTraining.prototype), 'constructor', this).apply(this, params);
    }

    _createClass(OpenTraining, [{
        key: 'act',
        value: function act(id) {
            var _get2;

            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            (_get2 = _get(Object.getPrototypeOf(OpenTraining.prototype), 'act', this)).call.apply(_get2, [this, id].concat(params));
            $('#' + CONSTANTS.ELEMENTS.APP_CONTAINER).empty();
            if (id) {
                var tag = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.TRAINING)[0];
                tag.update({ id: id });
                this.openSidebar(id);
            }
            return true;
        }
    }]);

    return OpenTraining;
})(ActionBase);

module.exports = OpenTraining;

},{"../constants/constants":29,"../tags/pages/training":69,"./ActionBase":3,"riot":"riot"}],14:[function(require,module,exports){
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

},{"../constants/constants":29,"../tags/dialogs/share":50,"./ActionBase.js":3,"riot":"riot"}],15:[function(require,module,exports){
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

},{"../constants/constants":29,"../tags/pages/terms":68,"./ActionBase.js":3,"riot":"riot"}],16:[function(require,module,exports){
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

},{"./Firebase":18,"lodash":undefined}],17:[function(require,module,exports){
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

},{"lodash":undefined,"riot":"riot"}],18:[function(require,module,exports){
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
                            // if (!snapshot.exists()) {
                            //     child.off(event, method);
                            //     throw new Error(`There is no data at ${path}`);
                            // }
                            var data = snapshot.val();
                            callback(data);
                        } catch (e) {
                            //child.off(event, method);
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

},{"../../MetaMap.js":1,"bluebird":undefined,"localforage":undefined}],19:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');

var Integrations = (function () {
	function Integrations(metaMap, user) {
		_classCallCheck(this, Integrations);

		this.config = metaMap.config;
		this.metaMap = metaMap;
		this.user = user;
		this._features = {
			google: require('../integrations/Google'),
			usersnap: require('../integrations/UserSnap'),
			addthis: require('../integrations/AddThis'),
			youtube: require('../integrations/YouTube')
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

},{"../integrations/AddThis":39,"../integrations/Google":40,"../integrations/UserSnap":41,"../integrations/YouTube":42,"lodash":undefined}],20:[function(require,module,exports){
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

},{"../../MetaMap":1}],21:[function(require,module,exports){
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

},{"../constants/constants":29,"riot":"riot"}],22:[function(require,module,exports){
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

},{"../../MetaMap":1,"../constants/constants":29,"localforage":undefined,"lodash":undefined}],23:[function(require,module,exports){
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

},{"auth0-lock":undefined,"bluebird":undefined,"localforage":undefined,"lodash":undefined}],24:[function(require,module,exports){
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

},{"../../MetaMap":1,"../tools/Common":75,"../tools/uuid.js":78,"lodash":undefined}],25:[function(require,module,exports){
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
                        type: type,
                        children: [],
                        labelPosition: []
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

                            var newNode = toolkit.addNode({
                                parent: node.id,
                                w: newWidth,
                                h: newHeight,
                                label: newLabel,
                                order: node.data.children.length
                            });

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
            });
        });
    }

    _createClass(Canvas, [{
        key: 'init',
        value: function init() {}
    }]);

    return Canvas;
})();

module.exports = Canvas;

},{"../../MetaMap":1,"../app/Permissions":20,"../constants/constants":29,"./layout":26,"lodash":undefined}],26:[function(require,module,exports){
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
      var padding = params.partPadding || 5;
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

},{}],27:[function(require,module,exports){
'use strict';

var ACTIONS = {
    OPEN_MAP: 'map',
    OPEN_TRAINING: 'open_training',
    NEW_MAP: 'new_map',
    COPY_MAP: 'copy_map',
    DELETE_MAP: 'delete_map',
    HOME: 'home',
    MY_MAPS: 'mymaps',
    TERMS_AND_CONDITIONS: 'terms',
    LOGOUT: 'logout',
    FEEDBACK: 'feedback',
    SHARE_MAP: 'share_map',
    COURSE_LIST: 'course_list',
    TRAININGS: 'trainings'
};

Object.freeze(ACTIONS);

module.exports = ACTIONS;

},{}],28:[function(require,module,exports){
'use strict';

var CANVAS = {
    LEFT: 'left',
    RIGHT: 'right'
};

Object.freeze(CANVAS);

module.exports = CANVAS;

},{}],29:[function(require,module,exports){
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

},{"./actions":27,"./canvas":28,"./dsrp":30,"./editStatus":31,"./elements":32,"./events":33,"./notification":34,"./pages":35,"./routes":36,"./tabs":37,"./tags":38}],30:[function(require,module,exports){
'use strict';

var DSRP = {
	D: 'D',
	S: 'S',
	R: 'R',
	P: 'P'
};

Object.freeze(DSRP);

module.exports = DSRP;

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
'use strict';

var ELEMENTS = {
    APP_CONTAINER: 'app-container',
    META_PROGRESS: 'meta_progress',
    META_PROGRESS_NEXT: 'meta_progress_next',
    META_MODAL_DIALOG_CONTAINER: 'meta_modal_dialog_container'
};

Object.freeze(ELEMENTS);

module.exports = ELEMENTS;

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
'use strict';

var NOTIFICATION = {
	MAP: 'map'
};

Object.freeze(NOTIFICATION);

module.exports = NOTIFICATION;

},{}],35:[function(require,module,exports){
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
    HOME: 'home',
    COURSE_LIST: 'course_list',
    TRAININGS: 'trainings'
};

_.extend();

Object.freeze(PAGES);

module.exports = PAGES;

},{"./actions.js":27,"lodash":undefined}],36:[function(require,module,exports){
'use strict';

var ROUTES = {
    MAPS_LIST: 'maps/list/',
    MAPS_DATA: 'maps/data/',
    MAPS_NEW_MAP: 'maps/new-map/',
    TERMS_AND_CONDITIONS: 'metamap/terms-and-conditions/',
    HOME: 'metamap/home/',
    NOTIFICATIONS: 'users/{0}/notifications',
    TRAININGS: 'users/{0}/trainings/',
    COURSE_LIST: 'trainings/courses/'
};

Object.freeze(ROUTES);

module.exports = ROUTES;

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
'use strict';

var TAGS = {
    META_CANVAS: 'meta-canvas',
    HOME: 'home',
    TERMS: 'terms',
    MY_MAPS: 'my-maps',
    SHARE: 'share',
    COURSE_LIST: 'course_list',
    TRAINING: 'training',
    ALL_COURSES: 'all-courses',
    MY_COURSES: 'my-courses',
    SIDEBAR: 'quick-sidebar'
};

Object.freeze(TAGS);

module.exports = TAGS;

},{}],39:[function(require,module,exports){
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

},{"./_IntegrationsBase":43}],40:[function(require,module,exports){
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

},{"./_IntegrationsBase":43}],41:[function(require,module,exports){
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

},{"./_IntegrationsBase":43,"./google":44}],42:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntegrationsBase = require('./_IntegrationsBase');

var YouTube = (function (_IntegrationsBase) {
  _inherits(YouTube, _IntegrationsBase);

  function YouTube(config, user) {
    var _this = this;

    _classCallCheck(this, YouTube);

    _get(Object.getPrototypeOf(YouTube.prototype), 'constructor', this).call(this, config, user);
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = function () {
      _this.YT = window.YT;
    };
  }

  _createClass(YouTube, [{
    key: 'init',
    value: function init() {
      _get(Object.getPrototypeOf(YouTube.prototype), 'init', this).call(this);
    }
  }, {
    key: 'setUser',
    value: function setUser() {
      _get(Object.getPrototypeOf(YouTube.prototype), 'setUser', this).call(this);
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(val, event, source, type) {
      _get(Object.getPrototypeOf(YouTube.prototype), 'sendEvent', this).call(this, val, event, source, type);
    }
  }, {
    key: 'updatePath',
    value: function updatePath(path) {
      _get(Object.getPrototypeOf(YouTube.prototype), 'updatePath', this).call(this, path);
    }
  }, {
    key: 'integration',
    get: function get() {
      this.YT = this.YT || window.YT;
      return this.YT;
    }
  }], [{
    key: 'sendSocial',
    value: function sendSocial(network, targetUrl) {
      var type = arguments.length <= 2 || arguments[2] === undefined ? 'send' : arguments[2];
    }
  }]);

  return YouTube;
})(IntegrationsBase);

module.exports = YouTube;

},{"./_IntegrationsBase":43}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{"./_IntegrationsBase":43}],45:[function(require,module,exports){
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

},{"../actions/Action.js":2,"../constants/constants":29,"../tags/page-body.js":57,"../template/demo":72,"../template/layout":73,"../template/metronic":74}],46:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var Canvas = require('../../canvas/canvas');
var CONSTANTS = require('../../constants/constants');
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
            MetaMap.Eventer.forget(CONSTANTS.EVENTS.MAP, _this.build);
        }
    };

    MetaMap.Eventer.every(CONSTANTS.EVENTS.MAP, this.build);

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

},{"../../../MetaMap.js":1,"../../canvas/canvas":25,"../../constants/constants":29,"./node":47,"riot":"riot"}],47:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var Editor = require('../../canvas/canvas');

var html = '\n';

module.exports = riot.tag('node', html, function (opts) {});

},{"../../canvas/canvas":25,"riot":"riot"}],48:[function(require,module,exports){
'use strict';

var riot = require('riot');
var moment = require('moment');
var Ps = require('perfect-scrollbar');

var Metronic = require('../../template/metronic');
var raw = require('./raw');
var CONSTANTS = require('../../constants/constants');
var TrainingMix = require('../mixins/training-mix');

var html = '\n<div class="page-quick-sidebar-wrapper">\n    <div class="page-quick-sidebar">\n        <div class="nav-justified">\n            <ul class="nav nav-tabs nav-justified">\n                <li class="active">\n                    <a href="#quick_sidebar_tab_1" data-toggle="tab">\n                    Cortex Man\n                    </a>\n                </li>\n                <li>\n                    <a href="#quick_sidebar_tab_2" data-toggle="tab">\n                    Outline\n                    </a>\n                </li>\n            </ul>\n            <div class="tab-content">\n                <div class="tab-pane active page-quick-sidebar-chat page-quick-sidebar-content-item-shown" id="quick_sidebar_tab_1">\n                    <div class="page-quick-sidebar-chat-users" data-rail-color="#ddd" data-wrapper-class="page-quick-sidebar-list">\n                    </div>\n                    <div class="page-quick-sidebar-item">\n                        <div class="page-quick-sidebar-chat-user">\n                            <div class="page-quick-sidebar-chat-user-messages">\n                                <div each="{ userTraining.messages }" class="post { out: author == \'cortex\', in: author != \'cortex\' }">\n                                    <img height="39" width="39" class="avatar" alt="" src="{ author == \'cortex\' ? parent.cortexPicture : parent.userPicture }"/>\n                                    <div class="message">\n                                        <span class="arrow"></span>\n                                        <a href="javascript:;" class="name">{ name }</a>\n                                        <span class="datetime">{ parent.getRelativeTime(time) }</span>\n                                        <span class="body">\n                                        <raw content="{ message }"></raw> </span>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="page-quick-sidebar-chat-user-form">\n                                <form id="chat_input_form" onsubmit="{ onSubmit }">\n                                    <div class="input-group">\n                                        <input id="chat_input" type="text" class="form-control" placeholder="Type a message here...">\n                                        <div class="input-group-btn">\n                                            <button type="submit" class="btn blue"><i class="fa fa-paperclip"></i></button>\n                                        </div>\n                                    </div>\n                                </form>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class="tab-pane page-quick-sidebar-alerts" id="quick_sidebar_tab_2">\n                    <div class="page-quick-sidebar-alerts-list">\n                        <h3 class="list-heading">Intro</h3>\n                        <h3 class="list-heading">Section 1</h3>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n';

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

riot.tag(CONSTANTS.TAGS.SIDEBAR, html, function (opts) {
    var _this = this;

    this.mixin(TrainingMix);

    var MetaMap = require('../../../MetaMap');

    this.userPicture = '';

    this.on('mount', function () {
        handleQuickSidebarToggler(); // handles quick sidebar's toggler
        handleQuickSidebarChat(); // handles quick sidebar's chats
        handleQuickSidebarAlerts(); // handles quick sidebar's alerts
        _this.userPicture = MetaMap.User.picture;
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
        _this.userTraining.messages.push({
            message: _this.chat_input.value,
            time: new Date()
        });

        _this.saveTraining(_this.trainingId);
        _this.chat_input.value = '';
        _this.update();
    };

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        $('body').removeClass('page-quick-sidebar-open');
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function (id) {
        _this.trainingId = id;
        _this.getData(id);
        $('body').addClass('page-quick-sidebar-open');
    });
});

},{"../../../MetaMap":1,"../../constants/constants":29,"../../template/metronic":74,"../mixins/training-mix":55,"./raw":49,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],49:[function(require,module,exports){
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

},{"riot":"riot"}],50:[function(require,module,exports){
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

},{"../../../MetaMap":1,"../../app/Sharing":22,"../../constants/constants":29,"../../tools/shims":77,"bootstrap-select":undefined,"jquery":undefined,"riot":"riot","typeahead.js":undefined}],51:[function(require,module,exports){
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

},{"../../../MetaMap":1,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],52:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('bootstrap-hover-dropdown');
var moment = require('moment');

var CONSTANTS = require('../../constants/constants');
require('../../tools/shims');

var html = '<a href="javascript:;"\n                 class="dropdown-toggle"\n                 data-toggle="dropdown"\n                 data-hover="dropdown"\n                 data-close-others="true">\n                    <i class="fa fa-bell-o"></i>\n                    <span class="badge badge-success">\n                        { notifications.length }\n                    </span>\n                </a>\n                <ul class="dropdown-menu">\n                    <li class="external">\n                        <h3>\n                            <span class ="bold">{ notifications.length } pending</span> notification{ s: notifications.length == 0 || notifications.length > 1 }\n                        </h3>\n                        <a if="{ allNotifications.length > 1 }" href="javascript:;">view all</a>\n                    </li>\n                    <li>\n                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">\n                            <li if="{ true != archived }"\n                                each="{ val, i in notifications }"\n                                onclick="{ parent.onClick }">\n                                <a>\n                                    <span if="{ val.photo != null }" class="photo">\n\t\t\t\t\t\t\t\t\t\t<img src="{val.photo}" class="img-circle" alt="">\n                                    </span>\n                                    <span class="subject">\n\t\t\t\t\t\t\t\t\t\t<span class="from">{ val.from }</span>\n\t\t\t\t\t\t\t\t\t\t<span class="time" style="padding: 0;">{ parent.getTime(val.time) }</span>\n                                    </span>\n                                    <span class="message">{ val.event }</span>\n                                </a>\n                            </li>\n                        </ul>\n                    </li>\n                </ul>\n';

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

},{"../../../MetaMap.js":1,"../../constants/constants":29,"../../tools/shims":77,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"moment":undefined,"riot":"riot"}],53:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],54:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],55:[function(require,module,exports){
'use strict';

var CONSTANTS = require('../../constants/constants');
var NProgress = window.NProgress;

var TrainingMix = {
    init: function init() {
        this.MetaMap = require('../../../MetaMap.js');
    },

    userTraining: { messages: [] },
    training: {},

    saveTraining: function saveTraining(id) {
        this.MetaMap.MetaFire.setData(this.userTraining, '' + CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) + id);
    },

    getData: function getData(id) {
        var _this = this;

        if (id) {
            (function () {
                var that = _this;
                _this._onceGetData = _this._onceGetData || _.once(function () {

                    var once = _.once(function () {
                        that.MetaMap.MetaFire.on('' + CONSTANTS.ROUTES.TRAININGS.format(that.MetaMap.User.userId) + id, function (data) {
                            that.userTraining = data;
                            if (!data) {
                                that.userTraining = that.training;
                                that.saveTraining(id);
                            }
                            if (!that.userTraining.messages) {
                                that.userTraining.messages = [that.getDefaultMessage()];
                                that.saveTraining(id);
                            }
                            that.update();
                            NProgress.done();
                        });
                        that.MetaMap.Eventer['do'](CONSTANTS.EVENTS.SIDEBAR_OPEN, id);
                    });

                    that.MetaMap.MetaFire.on('' + CONSTANTS.ROUTES.COURSE_LIST + id, function (data) {
                        that.training = data;
                        that.MetaMap.Eventer['do'](CONSTANTS.EVENTS.PAGE_NAME, data);

                        that.update();
                        once();
                    });
                });
                _this._onceGetData();
            })();
        }
    },

    messages: [],

    cortexPicture: 'src/images/cortex-avatar-small.jpg',

    getDefaultMessage: function getDefaultMessage() {
        return {
            message: 'Hello, I\'m Cortex Man. Ask me anything. Try <code>/help</code> if you get lost.',
            author: 'cortex',
            time: new Date()
        };
    }

};

module.exports = TrainingMix;

},{"../../../MetaMap.js":1,"../../constants/constants":29}],56:[function(require,module,exports){
'use strict';

var riot = require('riot');
var $ = require('jquery');
require('bootstrap-hover-dropdown');

var CONSTANTS = require('../constants/constants');
require('../tools/shims');
var Permissions = require('../app/Permissions');

var html = '\n<div id="page_actions" class="page-actions">\n    <div class="btn-group">\n        <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">\n            <span class="hidden-sm hidden-xs">Actions&nbsp;</span>\n            <i class="fa fa-angle-down"></i>\n        </button>\n        <ul class="dropdown-menu" role="menu">\n            <li each="{ val, i in data }" class="{ start: i == 0, active: i == 0 }">\n                <a if="{ parent.getLinkAllowed(val) }" href="{ parent.getActionLink(val) }">\n                    <i class="{ val.icon }"></i> { val.title }\n                </a>\n            </li>\n            <li class="divider"></li>\n            <li>\n                <a href="#settings">\n                    <i class="fa fa-gear"></i> Settings\n                </a>\n            </li>\n        </ul>\n    </div>\n\n    <span style="padding-left: 5px;">\n        <span if="{ pageName }"\n                id="map_name"\n                data-type="text"\n                data-title="Enter map name"\n                style="vertical-align: middle;">\n            { pageName }\n        </span>\n    </span>\n</div>\n';

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

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        $(_this.page_actions).css({ 'padding-left': '0' });
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        $(_this.page_actions).css({ 'padding-left': '70px' });
    });
});

},{"../../MetaMap":1,"../app/Permissions":20,"../constants/constants":29,"../tools/shims":77,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],57:[function(require,module,exports){
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

    this.on('update', function () {
        _this.header = _this.header || riot.mount(_this.meta_page_header, 'page-header')[0];
        _this.container = _this.container || riot.mount(_this.meta_page_container, 'page-container')[0];
    });
});

},{"../../MetaMap":1,"../constants/constants":29,"./page-container":58,"./page-footer":60,"./page-header":61,"riot":"riot"}],58:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageContent = require('./page-content');

var html = '\n<div class="page-container">\n\n    <div id="meta_page_content"></div>\n</div>\n';

module.exports = riot.tag('page-container', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('update', function () {
        _this.content = _this.content || riot.mount(_this.meta_page_content, 'page-content')[0];
    });
});

},{"../../MetaMap":1,"./page-content":59,"riot":"riot"}],59:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');
var _ = require('lodash');
require('./components/quick-sidebar');

var html = '\n<div class="page-content-wrapper">\n    <div id="page-content" class="page-content">\n\n        <div class="page-head"></div>\n\n        <div id="app-container"></div>\n\n        <div id="quick_sidebar_container"></div>\n    </div>\n</div>\n';

module.exports = riot.tag('page-content', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('update', function () {
        _this.sidebar = _this.sidebar || riot.mount(_this.quick_sidebar_container, 'quick-sidebar')[0];
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

},{"../../MetaMap":1,"../constants/constants":29,"./components/quick-sidebar":48,"lodash":undefined,"riot":"riot"}],60:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<div class="page-footer" style="position: fixed; bottom: 0;">\n    <div class="page-footer-inner">\n        <a href="#terms">&copy;2015</a>\n    </div>\n</div>\n';

module.exports = riot.tag('page-footer', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],61:[function(require,module,exports){
'use strict';

var riot = require('riot');
var pageLogo = require('./page-logo.js');
var pageActions = require('./page-actions.js');
var pageSearch = require('./page-search.js');
var pageTopMenu = require('./page-topmenu');

var html = '\n<div id="header-top" class="page-header navbar navbar-fixed-top">\n    <div id="meta_progress_next" style="overflow: inherit;"></div>\n    <div id="header-content" class="page-header-inner">\n\n        <div id="meta_page_logo"></div>\n\n        <div id="meta_page_actions"></div>\n\n        <div id="meta_page_top" class="page-top">\n            <div id="meta_page_search"></div>\n\n            <div id="meta_page_topmenu"></div>\n        </div>\n\n    </div>\n\n</div>\n';

module.exports = riot.tag('page-header', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.on('update', function () {
        _this.logo = _this.logo || riot.mount(_this.meta_page_logo, 'page-logo')[0];
        _this.actions = _this.actions || riot.mount(_this.meta_page_actions, 'page-actions')[0];
        _this.search = _this.search || riot.mount(_this.meta_page_top, 'page-search')[0];
        _this.topmenu = _this.topmenu || riot.mount(_this.meta_page_top, 'page-topmenu')[0];
    });
});

},{"../../MetaMap":1,"./page-actions.js":56,"./page-logo.js":62,"./page-search.js":63,"./page-topmenu":64,"riot":"riot"}],62:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');

var html = '\n<div class ="page-logo">\n    <a id="meta_logo" href="#home">\n        <img src="src/images/metamap_cloud.png" alt="logo" class ="logo-default" />\n    </a>\n\n    <div id="meta_menu_toggle" class="menu-toggler sidebar-toggler quick-sidebar-toggler" onclick="{ onClick }" style="visibility:{ getDisplay() };">\n        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->\n    </div>\n</div>\n<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">\n</a>\n';

module.exports = riot.tag('page-logo', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.isSidebarOpen = false;

    var toggle = function toggle(state) {
        if (_this.isSidebarOpen != state) {
            _this.isSidebarOpen = state;
            $(_this.meta_menu_toggle).click();
        }
    };

    this.onClick = function () {
        // MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_TOGGLE);
    };

    this.getDisplay = function (el) {
        if (MetaMap && MetaMap.Router && MetaMap.Router.currentPath == CONSTANTS.PAGES.TRAININGS) {
            toggle(true);
            return 'visible';
        } else {
            return 'hidden';
        }
    };

    MetaMap.Eventer.every('pageName', function (opts) {
        _this.update();
    });
});

},{"../../MetaMap":1,"../constants/constants":29,"riot":"riot"}],63:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<!-- DOC: Apply "search-form-expanded" right after the "search-form" class to have half expanded search box -->\n<form class="search-form" action="extra_search.html" method="GET">\n    <div class="input-group">\n        <input type="text" class="form-control input-sm" placeholder="Search..." name="query">\n            <span class="input-group-btn">\n                <a href="javascript:;" class="btn submit">\n                    <i class="fa fa-search"></i>\n                </a>\n            </span>\n        </div>\n</form>\n';

module.exports = riot.tag('page-search', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],64:[function(require,module,exports){
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
        return true;
    };

    this.on('update', function () {
        //TODO: restore notifications when logic is complete
        //riot.mount(this.header_points_bar, 'meta-points');
        _this.notifications = _this.notifications || riot.mount(_this.header_notification_bar, 'meta-notifications');
        _this.help = _this.help || riot.mount(_this.header_help_bar, 'meta-help');
        _this.user = _this.user || riot.mount(_this.header_user_menu, 'meta-user');
    });
});

},{"./menu/meta-help.js":51,"./menu/meta-notifications.js":52,"./menu/meta-points.js":53,"./menu/meta-user.js":54,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],65:[function(require,module,exports){
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
require('../tables/all-courses');
require('../tables/my-courses');

var html = '\n<div id="my_courses_page" class="portlet box grey-cascade">\n    <div class="portlet-title">\n        <div class="caption">\n            <i class="fa fa-icon-th-large"></i>Courses\n        </div>\n        <div if="{ menu }" class="actions">\n            <a each="{ menu.buttons }" href="{ link }" onclick="{ parent.onActionClick }" class="btn btn-default btn-sm">\n                <i class="{ icon }"></i> { title }\n            </a>\n            <div class="btn-group">\n                <a class="btn btn-default btn-sm" href="javascript:;" data-toggle="dropdown">\n                    <i class="fa fa-cogs"></i> Tools <i class="fa fa-angle-down"></i>\n                </a>\n                <ul class="dropdown-menu pull-right">\n                    <li each="{ menu.menu }" onclick="{ parent.onMenuClick }">\n                        <a href="{ link }">\n                            <i class="{ icon }"></i> { title }\n                        </a>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class="portlet-body">\n        <ul class="nav nav-tabs portlet-tabs">\n            <li onclick="{ parent.onTabSwitch }" each="{ val, i in tabs }" class="{ active: i == 0 }">\n                <a href="#mycourses_1_{ i }" data-toggle="tab" aria-expanded="{ true: i == 0 }">\n                { val.title }</a>\n            </li>\n        </ul>\n        <div class="table-toolbar">\n\n        </div>\n        <div class="tab-content">\n            <div each="{ val, i in tabs }" class="tab-pane fase in { active: i == 0 }" id="mycourses_1_{ i }">\n\n            </div>\n        </div>\n    </div>\n</div>\n';

module.exports = riot.tag(CONSTANTS.TAGS.COURSE_LIST, html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User;
    this.data = [];
    this.menu = null;
    var tabs = [{ title: 'My Trainings', order: 0, editable: true, columns: [{ name: 'Check', isCheckbox: true }, { name: 'Action' }, { name: 'Created On' }, { name: 'Status' }] }, { title: 'All Trainings', order: 1, editable: false, columns: [{ name: 'Action' }, { name: 'Created On' }, { name: 'Owner' }] }];
    this.tabs = _.sortBy(tabs, 'order');

    this.currentTab = 'My Trainings';

    //Events
    this.onOpen = function (event) {
        MetaMap.Router.to('map/' + event.item.id);
    };

    this.onTabSwitch = function (event) {
        _this.currentTab = event.item.val.title;
    };

    this.loadTable = function (title, i) {
        try {
            var node = _this['mycourses_1_' + i];
            var tag = null;
            switch (title) {
                case 'All Trainings':
                    tag = CONSTANTS.TAGS.ALL_COURSES;
                    break;
                case 'My Trainings':
                    tag = CONSTANTS.TAGS.MY_COURSES;
                    break;
            }
            if (node && tag) {
                _this[title] = _this[title] || riot.mount(node, tag)[0];
                _this[title].update();
            }
        } catch (e) {
            MetaMap.error(e);
        }
    };

    //Riot bindings
    this.on('mount', function () {
        NProgress.start();
    });

    this.on('update', function () {
        _.each(_this.tabs, function (val, i) {
            _this.loadTable(val.title, i);
        });
    });
});

},{"../../../MetaMap.js":1,"../../constants/constants":29,"../components/raw":49,"../tables/all-courses":70,"../tables/my-courses":71,"datatables":undefined,"datatables-bootstrap3-plugin":undefined,"jquery":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],66:[function(require,module,exports){
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

},{"../../../MetaMap":1,"../../constants/constants":29,"riot":"riot"}],67:[function(require,module,exports){
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
    var tabs = [{ title: 'My Maps', order: 0, editable: true, columns: [{ name: 'Check', isCheckbox: true }, { name: 'Action' }, { name: 'Created On' }, { name: 'Status' }] }, { title: 'Shared with Me', order: 1, editable: false, columns: [{ name: 'Action' }, { name: 'Created On' }, { name: 'Owner' }] }, { title: 'Public', order: 2, editable: false, columns: [{ name: 'Action' }, { name: 'Created On' }, { name: 'Owner' }] }];
    if (this.user.isAdmin) {
        tabs.push({ title: 'All Maps', order: 3, editable: true, columns: [{ name: 'Action' }, { name: 'Created On' }, { name: 'Owner' }] });
        tabs.push({ title: 'Templates', order: 4, editable: true, columns: [{ name: 'Action' }, { name: 'Created On' }, { name: 'Owner' }] });
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

},{"../../../MetaMap.js":1,"../../actions/DeleteMap.js":6,"../../actions/ShareMap":14,"../../constants/constants":29,"../components/raw":49,"datatables":undefined,"datatables-bootstrap3-plugin":undefined,"jquery":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],68:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"../../constants/constants":29,"riot":"riot"}],69:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var CONSTANTS = require('../../constants/constants');
var VideoPlayer = require('../../tools/VideoPlayer');
var TrainingMix = require('../mixins/training-mix');

var html = '\n<div id="training_portlet" class="portlet light">\n    <div class="portlet-body">\n        <div class="row margin-bottom-30">\n            <div class="col-md-8 col-md-offset-4">\n                <div class="embed-responsive embed-responsive-16by9">\n                    <div id="training_player" ></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n';

module.exports = riot.tag(CONSTANTS.TAGS.TRAINING, html, function (opts) {
    var _this = this;

    this.mixin(TrainingMix);

    this.training = {};

    this.on('mount update', function (event, opts) {
        if (opts) {
            _this.config = opts;
            _this.getData(_this.config.id);
            _this.player = new VideoPlayer('training_player', { height: 390, width: 640, videoId: 'dUqRTWCdXt4' });
        }
    });

    this.correctHeight = function () {
        $(_this.training_portlet).css({
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

},{"../../constants/constants":29,"../../tools/VideoPlayer":76,"../mixins/training-mix":55,"riot":"riot"}],70:[function(require,module,exports){
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

var html = '\n<table class="table table-striped table-bordered table-hover" id="{tableId}">\n    <thead>\n        <tr>\n            <th each="{columns}">{name}</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr if="{ data }" each="{ data }" class="odd gradeX">\n            <td>\n                <a class="btn btn-sm red" onclick="{ parent.onStart }">Start <i class="fa fa-play"></i></a>\n            </td>\n            <td class="{ meta_editable: parent.editable}" data-pk="{ id }" data-name="name" data-title="Edit Course Name" style="vertical-align: middle;">{ name }</td>\n            <td class="{ meta_editable: parent.editable}" data-pk="{ id }" data-name="description" data-title="Edit Course Description" style="vertical-align: middle;">{ description }</td>\n        </tr>\n    </tbody>\n</table>\n';

module.exports = riot.tag(CONSTANTS.TAGS.ALL_COURSES, html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User;
    this.data = [];
    this.editable = false;
    this.tableId = 'all_courses';

    this.columns = [{
        name: 'Action',
        orderable: false,
        width: '120px'
    }, {
        name: 'Name',
        orderable: true
    }, {
        name: 'Description',
        orderable: true
    }];

    //Events
    this.onStart = function (event) {
        MetaMap.Router.to('trainings/' + event.item.id);
    };

    this.buildTable = function () {
        try {
            if (_this.table) {
                _this.table.find('.meta_editable').editable('destroy');
                _this.dataTable.destroy();
            }

            _this.table = $(document.getElementById([_this.tableId]));
            _this.dataTable = _this.table.DataTable({

                // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
                // So when dropdowns used the scrollable div should be removed.
                //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',
                //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                'columns': _this.columns
            });

            var tableWrapper = _this.table.parent().parent().parent().find('#' + _this.tableId + '_table_wrapper');

            tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline'); // modify table per page dropdown

            _this.table.find('.meta_editable').editable({ unsavedclass: null }).on('save', function (event, params) {
                if (this.dataset && this.dataset.pk) {
                    var id = this.dataset.pk;
                    MetaMap.MetaFire.setData(params.newValue, CONSTANTS.ROUTES.COURSE_LIST + '/' + id + '/' + this.dataset.name);
                }
                return true;
            });
        } catch (e) {} finally {
            NProgress.done();
        }
    };

    //Riot bindings
    this.on('mount', function () {
        _this.editable = _this.user.isAdmin;
    });

    var once = _.once(function () {
        MetaMap.MetaFire.on(CONSTANTS.ROUTES.COURSE_LIST, function (list) {
            _this.data = _.map(list, function (obj, key) {
                obj.id = key;
                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                return obj;
            });
            if (_this.data) {
                _this.update();
                _this.buildTable(0, _this.data);
            }
        });
    });

    this.on('update', function () {
        once();
    });
});

},{"../../../MetaMap.js":1,"../../constants/constants":29,"../components/raw":49,"datatables":undefined,"datatables-bootstrap3-plugin":undefined,"jquery":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],71:[function(require,module,exports){
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

var html = '\n<table class="table table-striped table-bordered table-hover" id="{tableId}">\n    <thead>\n        <tr>\n            <th each="{columns}">{name}</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr if="{ data }" each="{ data }" class="odd gradeX">\n            <td>\n                <a class="btn btn-sm red" onclick="{ parent.onStart }">Continue <i class="fa fa-play"></i></a>\n            </td>\n            <td style="vertical-align: middle;">{ name }</td>\n            <td style="vertical-align: middle;">{ description }</td>\n        </tr>\n    </tbody>\n</table>\n';

module.exports = riot.tag(CONSTANTS.TAGS.MY_COURSES, html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User;
    this.data = [];
    this.editable = false;
    this.tableId = 'my_courses';

    this.columns = [{
        name: 'Action',
        orderable: false,
        width: '120px'
    }, {
        name: 'Name',
        orderable: true
    }, {
        name: 'Description',
        orderable: true
    }];

    //Events
    this.onStart = function (event) {
        MetaMap.Router.to('trainings/' + event.item.id);
    };

    this.buildTable = function () {
        try {
            if (_this.table) {
                _this.table.find('.meta_editable').editable('destroy');
                _this.dataTable.destroy();
            }

            _this.update();

            _this.table = $(document.getElementById([_this.tableId]));
            _this.dataTable = _this.table.DataTable({

                // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
                // So when dropdowns used the scrollable div should be removed.
                //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',
                //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                'columns': _this.columns
            });

            var tableWrapper = _this.table.parent().parent().parent().find('#' + _this.tableId + '_table_wrapper');

            tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline'); // modify table per page dropdown

            _this.table.find('.meta_editable').editable({ unsavedclass: null }).on('save', function (event, params) {
                if (this.dataset && this.dataset.pk) {
                    var id = this.dataset.pk;
                    MetaMap.MetaFire.setData(params.newValue, CONSTANTS.ROUTES.COURSE_LIST + '/' + id + '/name');
                }
                return true;
            });
        } catch (e) {} finally {
            NProgress.done();
        }
    };

    //Riot bindings
    this.on('mount', function () {});

    var once = _.once(function () {
        MetaMap.MetaFire.on(CONSTANTS.ROUTES.TRAININGS.format(_this.user.userId), function (list) {
            _this.data = _.map(list, function (obj, key) {
                obj.id = key;
                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                return obj;
            });
            _this.update();
            _this.buildTable(0, _this.data);
        });
    });

    this.on('update', function () {
        once();
    });
});

},{"../../../MetaMap.js":1,"../../constants/constants":29,"../components/raw":49,"datatables":undefined,"datatables-bootstrap3-plugin":undefined,"jquery":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],72:[function(require,module,exports){
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

},{"jquery":undefined}],73:[function(require,module,exports){
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

},{"./metronic":74,"jquery":undefined}],74:[function(require,module,exports){
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

},{"jquery":undefined}],75:[function(require,module,exports){
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

},{"moment":undefined}],76:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');

var VideoPlayer = (function () {
    function VideoPlayer(divId) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? { videoId: '' } : arguments[1];

        _classCallCheck(this, VideoPlayer);

        this.id = divId;
        this.opts = opts;
        this.metaMap = require('../../MetaMap');
        this.init();
    }

    _createClass(VideoPlayer, [{
        key: 'onReady',
        value: function onReady() {
            var _this = this;

            this._onReady = this._onReady || new Promise(function (resolve, reject) {
                var wait = function wait() {
                    if (window.YT && window.YT.loaded == 1) {
                        _this.YT = window.YT;
                        resolve(window.YT);
                    } else {
                        setTimeout(wait, 250);
                    }
                };
                wait();
            });
            return this._onReady;
        }
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            this.onReady().then(function () {
                _this2.player = new _this2.YT.Player(_this2.id, {
                    videoId: _this2.opts.videoId,
                    frameborder: 0,
                    events: {
                        onReady: _this2.onPlayerReady,
                        onStateChange: _this2.onPlayerStateChange
                    }
                });
            });
        }
    }, {
        key: 'onPlayerReady',
        value: function onPlayerReady(event) {
            event.target.playVideo();
        }
    }, {
        key: 'onPlayerStateChange',
        value: function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.ENDED) {
                this.done = true;
            }
        }
    }, {
        key: 'stopVideo',
        value: function stopVideo() {
            this.player.stopVideo();
        }
    }, {
        key: 'isDone',
        get: function get() {
            return this.done == true;
        }
    }]);

    return VideoPlayer;
})();

module.exports = VideoPlayer;

},{"../../MetaMap":1,"bluebird":undefined}],77:[function(require,module,exports){
'use strict';

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

},{}],78:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3B5TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQ291cnNlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0RlbGV0ZU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0ZlZWRiYWNrLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvSG9tZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0xvZ291dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL015TWFwcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL05ld01hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL09wZW5NYXAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9PcGVuVHJhaW5pbmcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9TaGFyZU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9Db25maWcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0V2ZW50ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9JbnRlZ3JhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1Blcm1pc3Npb25zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9Sb3V0ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1NoYXJpbmcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL2F1dGgwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC91c2VyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NhbnZhcy9jYW52YXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY2FudmFzL2xheW91dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvYWN0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvY2FudmFzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9jb25zdGFudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2RzcnAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VkaXRTdGF0dXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VsZW1lbnRzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ldmVudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL25vdGlmaWNhdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvcGFnZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3JvdXRlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFicy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFncy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvQWRkVGhpcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvR29vZ2xlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Vc2VyU25hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvWW91VHViZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvX0ludGVncmF0aW9uc0Jhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9ub2RlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9xdWljay1zaWRlYmFyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9yYXcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9kaWFsb2dzL3NoYXJlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLWhlbHAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1wb2ludHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtdXNlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21peGlucy90cmFpbmluZy1taXguanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWFjdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWJvZHkuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRhaW5lci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtY29udGVudC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtZm9vdGVyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1oZWFkZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWxvZ28uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXNlYXJjaC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtdG9wbWVudS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL2NvdXJzZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9ob21lLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvbXktbWFwcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL3Rlcm1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdHJhaW5pbmcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy90YWJsZXMvYWxsLWNvdXJzZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy90YWJsZXMvbXktY291cnNlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9kZW1vLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RlbXBsYXRlL2xheW91dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9tZXRyb25pYy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90b29scy9Db21tb24uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvVmlkZW9QbGF5ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvc2hpbXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvdXVpZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQixPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckIsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXJDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzdDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9DLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7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LE1BQU0sQ0FBQyxBQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEtBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDbkMsUUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsV0FBTyxJQUFJLENBQUM7Q0FDZixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMnKTtcclxud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbnJlcXVpcmUoJ2pxdWVyeS11aScpO1xyXG5yZXF1aXJlKCdib290c3RyYXAnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxuXHJcbmNvbnN0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9hcHAvYXV0aDAnKTtcclxuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vanMvYXBwL3VzZXIuanMnKTtcclxuY29uc3QgUm91dGVyID0gcmVxdWlyZSgnLi9qcy9hcHAvUm91dGVyLmpzJyk7XHJcbmNvbnN0IEV2ZW50ZXIgPSByZXF1aXJlKCcuL2pzL2FwcC9FdmVudGVyLmpzJyk7XHJcbmNvbnN0IFBhZ2VGYWN0b3J5ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcycpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDb25maWcgPSByZXF1aXJlKCcuL2pzL2FwcC8vQ29uZmlnLmpzJyk7XHJcbmNvbnN0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XHJcbmNvbnN0IHNoaW1zID0gcmVxdWlyZSgnLi9qcy90b29scy9zaGltcy5qcycpO1xyXG5jb25zdCBBaXJicmFrZUNsaWVudCA9IHJlcXVpcmUoJ2FpcmJyYWtlLWpzJylcclxuY29uc3QgSW50ZWdyYXRpb25zID0gcmVxdWlyZSgnLi9qcy9hcHAvSW50ZWdyYXRpb25zJylcclxuXHJcbmNsYXNzIE1ldGFNYXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuQ29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5Db25maWcuY29uZmlnO1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSB0aGlzLkNvbmZpZy5NZXRhRmlyZTtcclxuICAgICAgICB0aGlzLkV2ZW50ZXIgPSBuZXcgRXZlbnRlcih0aGlzKTtcclxuICAgICAgICB0aGlzLmFpcmJyYWtlID0gbmV3IEFpcmJyYWtlQ2xpZW50KHsgcHJvamVjdElkOiAxMTQ5MDAsIHByb2plY3RLZXk6ICdkYzk2MTFkYjZmNzcxMjBjY2VjZDFhMjczNzQ1YTVhZScgfSk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgUHJvbWlzZS5vblBvc3NpYmx5VW5oYW5kbGVkUmVqZWN0aW9uKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aGF0LmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ29uZmlnLm9uUmVhZHkoKS50aGVuKChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKGNvbmZpZy5hdXRoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dpbigpLnRoZW4oKGF1dGgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlVzZXIgPSBuZXcgVXNlcihwcm9maWxlLCBhdXRoLCB0aGlzLkV2ZW50ZXIsIHRoaXMuTWV0YUZpcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zID0gbmV3IEludGVncmF0aW9ucyh0aGlzLCB0aGlzLlVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlci5vblJlYWR5KCkudGhlbigodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbmV3IFBhZ2VGYWN0b3J5KHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyID0gbmV3IFJvdXRlcih0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb3V0ZXIuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlYnVnKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdC5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKVxyXG4gICAgfVxyXG5cclxuICAgIGxvZyh2YWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVidWcpIHtcclxuICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHZhbCwgJ2V2ZW50JywgJ2xvZycsICdsYWJlbCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmluZm8odmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBlcnJvcih2YWwpIHtcclxuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcih2YWwpO1xyXG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXhjZXB0aW9uJylcclxuICAgICAgICAgICAgdGhpcy5haXJicmFrZS5ub3RpZnkodmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dvdXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbW0gPSBuZXcgTWV0YU1hcCgpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG1tOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgQWN0aW9uIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBfZ2V0QWN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgIGxldCByZXQgPSB0aGlzLl9hY3Rpb25zW2FjdGlvbl07XHJcbiAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgbGV0IE1ldGhvZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHN3aXRjaChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuT1BFTl9NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9PcGVuTWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlRSQUlOSU5HUzpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL09wZW5UcmFpbmluZy5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ORVdfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTmV3TWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vQ29weU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5DT1VSU0VfTElTVDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0NvdXJzZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0RlbGV0ZU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5NWV9NQVBTOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTXlNYXBzLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0xvZ291dC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9TaGFyZU1hcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5URVJNU19BTkRfQ09ORElUSU9OUzpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL1Rlcm1zLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vRmVlZGJhY2snKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Ib21lLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0ID0gbmV3IE1ldGhvZCh0aGlzLm1ldGFGaXJlLCB0aGlzLmV2ZW50ZXIsIHRoaXMucGFnZUZhY3RvcnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1thY3Rpb25dID0gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGFjdGlvbiwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KCk7XHJcbiAgICAgICAgbGV0IG1ldGhvZCA9IHRoaXMuX2dldEFjdGlvbihhY3Rpb24pO1xyXG4gICAgICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKVxyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmFjdCguLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uOyIsImNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IobWV0YUZpcmUsIGV2ZW50ZXIsIHBhZ2VGYWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5wYWdlRmFjdG9yeSA9IHBhZ2VGYWN0b3J5O1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVTaWRlYmFyKCkge1xyXG4gICAgICAgIGlmKHRoaXMuc2lkZWJhck9wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuU2lkZWJhcigpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuU2lkZWJhcihpZCkge1xyXG4gICAgICAgIHRoaXMuc2lkZWJhck9wZW4gPSB0cnVlXHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCBpZClcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZVNpZGViYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zaWRlYmFyT3BlbiA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSlcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb25CYXNlOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgQ29weU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICBpZiAoIWlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ011c3QgaGF2ZSBhIG1hcCBpbiBvcmRlciB0byBjb3B5LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChvbGRNYXApID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld01hcCA9IHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IGAke25ldyBEYXRlKCl9YCxcclxuICAgICAgICAgICAgICAgIG93bmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5tZXRhTWFwLlVzZXIuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMuYXBwZW5kQ29weShvbGRNYXAubmFtZSksXHJcbiAgICAgICAgICAgICAgICBzaGFyZWRfd2l0aDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkbWluOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgJyonOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogZmFsc2UgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke2lkfWApLnRoZW4oKG9sZE1hcERhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBwdXNoU3RhdGUgPSB0aGlzLm1ldGFGaXJlLnB1c2hEYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9YCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWFwSWQgPSBwdXNoU3RhdGUua2V5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEob2xkTWFwRGF0YSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHttYXBJZH1gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke21hcElkfWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRDb3B5KHN0cikge1xyXG4gICAgICAgIGxldCByZXQgPSBzdHI7XHJcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHN0ciwgJyhDb3B5JykpIHtcclxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgJyAoQ29weSAxKSc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG1lc3MgPSBzdHIuc3BsaXQoJyAnKTtcclxuICAgICAgICAgICAgbGV0IGNudCA9IDI7XHJcbiAgICAgICAgICAgIGlmIChtZXNzLmxlbmd0aCAtIG1lc3MubGFzdEluZGV4T2YoJyhDb3B5JykgPD0gNCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyYmcgPSBtZXNzW21lc3MubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JiZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYmcgPSBncmJnLnJlcGxhY2UoJyknLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY250ID0gK2dyYmcgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IG1lc3Muc2xpY2UoMCwgbWVzcy5sZW5ndGggLSAyKS5qb2luKCcgJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0ICs9IGAgKENvcHkgJHtjbnR9KWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29weU1hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBob21lID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy9jb3Vyc2VzJyk7XHJcblxyXG5jbGFzcyBDb3Vyc2VzIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgbGV0IHRhZyA9IHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5DT1VSU0VfTElTVClbMF07XHJcbiAgICAgICAgdGFnLnVwZGF0ZSgpXHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5QQUdFUy5DT1VSU0VfTElTVCwgeyBpZDogaWQgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ0NvdXJzZXMnIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ291cnNlczsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY2xhc3MgRGVsZXRlTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIERlbGV0ZU1hcC5kZWxldGVBbGwoW2lkXSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRlbGV0ZUFsbChpZHMsIHBhdGggPSBDT05TVEFOVFMuUEFHRVMuSE9NRSkge1xyXG4gICAgICAgIGNvbnN0IG1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgXy5lYWNoKGlkcywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtZXRhTWFwLk1ldGFGaXJlLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHtpZH1gKTtcclxuICAgICAgICAgICAgICAgIG1ldGFNYXAuTWV0YUZpcmUuZGVsZXRlRGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgbWV0YU1hcC5Sb3V0ZXIudG8ocGF0aCk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVsZXRlTWFwOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuXHJcbmNsYXNzIEZlZWRiYWNrIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB3aW5kb3cuVXNlclNuYXA7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KCkge1xyXG4gICAgICAgIHN1cGVyLmFjdCgpO1xyXG4gICAgICAgIHRoaXMudXNlclNuYXAub3BlblJlcG9ydFdpbmRvdygpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRiYWNrOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL2hvbWUnKTtcclxuXHJcbmNsYXNzIEhvbWUgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuSE9NRSk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdIb21lJyB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSG9tZTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY2xhc3MgTG9nb3V0IGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAubG9nb3V0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTG9nb3V0OyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL215LW1hcHMnKTtcclxuXHJcbmNsYXNzIE15TWFwcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5NWV9NQVBTKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMsIHsgaWQ6IGlkIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdNeSBNYXBzJyB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTXlNYXBzOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgTmV3TWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdCgpIHtcclxuICAgICAgICBzdXBlci5hY3QoKTtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX05FV19NQVB9YCkudGhlbigoYmxhbmtNYXApID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld01hcCA9IHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IGAke25ldyBEYXRlKCl9YCxcclxuICAgICAgICAgICAgICAgIG93bmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5tZXRhTWFwLlVzZXIuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdOZXcgVW50aXRsZWQgTWFwJyxcclxuICAgICAgICAgICAgICAgIHNoYXJlZF93aXRoOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRtaW46IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAnKic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiBmYWxzZSB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcclxuICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke21hcElkfWApO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZXdNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IG1ldGFDYW52YXMgPSByZXF1aXJlKCcuLi90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcycpO1xyXG5cclxuY2xhc3MgT3Blbk1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG1hcCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuTUVUQV9DQU5WQVMpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmlkID0gaWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5OQVYsIENPTlNUQU5UUy5QQUdFUy5NQVAsIG1hcCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgbWFwLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuTUFQLCBtYXAsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcGVuTWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZScpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5jb25zdCB0cmFpbmluZyA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvdHJhaW5pbmcnKVxyXG5cclxuY2xhc3MgT3BlblRyYWluaW5nIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgIGxldCB0YWcgPSByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuVFJBSU5JTkcpWzBdO1xyXG4gICAgICAgICAgICB0YWcudXBkYXRlKHsgaWQ6IGlkIH0pO1xyXG4gICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3BlblRyYWluaW5nOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbnJlcXVpcmUoJy4uL3RhZ3MvZGlhbG9ncy9zaGFyZScpXHJcblxyXG5jbGFzcyBTaGFyZU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChtYXApID0+IHtcclxuICAgICAgICAgICAgbWFwLmlkID0gaWRcclxuICAgICAgICAgICAgU2hhcmVNYXAuYWN0KHsgbWFwOiBtYXAgfSlcclxuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci5iYWNrKClcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWN0KG1hcCkge1xyXG4gICAgICAgIGlmIChtYXApIHtcclxuICAgICAgICAgICAgbGV0IG1vZGFsID0gcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuTUVUQV9NT0RBTF9ESUFMT0dfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuU0hBUkUpWzBdXHJcbiAgICAgICAgICAgIG1vZGFsLnVwZGF0ZShtYXApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJlTWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IHRlcm1zID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy90ZXJtcycpO1xyXG5cclxuY2xhc3MgVGVybXMgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuVEVSTVMpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnVGVybXMgYW5kIENvbmRpdGlvbnMnIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXJtczsiLCJjb25zdCBNZXRhRmlyZSA9IHJlcXVpcmUoJy4vRmlyZWJhc2UnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5jb25zdCBjb25maWcgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBTSVRFUyA9IHtcclxuICAgICAgICBDUkxfU1RBR0lORzoge1xyXG4gICAgICAgICAgICBkYjogJ21ldGEtbWFwLXN0YWdpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJldCA9IHtcclxuICAgICAgICBob3N0OiB3aW5kb3cubG9jYXRpb24uaG9zdCxcclxuICAgICAgICBzaXRlOiB7fVxyXG4gICAgfVxyXG4gICAgbGV0IHNlZ21lbnRzID0gcmV0Lmhvc3Quc3BsaXQoJy4nKTtcclxuICAgIGxldCBmaXJzdCA9IHNlZ21lbnRzWzBdO1xyXG4gICAgaWYgKGZpcnN0ID09PSAnd3d3Jykge1xyXG4gICAgICAgIGZpcnN0ID0gc2VnbWVudHNbMV07XHJcbiAgICB9XHJcbiAgICBmaXJzdCA9IGZpcnN0LnNwbGl0KCc6JylbMF07XHJcblxyXG4gICAgc3dpdGNoIChmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XHJcblxyXG4gICAgICAgIGNhc2UgJ2xvY2FsaG9zdCc6XHJcbiAgICAgICAgY2FzZSAnbWV0YS1tYXAtc3RhZ2luZyc6XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0LnNpdGUgPSBTSVRFUy5DUkxfU1RBR0lORztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJldDtcclxufTtcclxuXHJcbmNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFncykge1xyXG4gICAgICAgIHRoaXMudGFncyA9IHRhZ3M7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcoKTtcclxuICAgICAgICB0aGlzLk1ldGFGaXJlID0gbmV3IE1ldGFGaXJlKHRoaXMuY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l0ZSgpIHtcclxuICAgICAgICByZXR1cm4gJ2Zyb250ZW5kJztcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5vbignY29uZmlnJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2NhbnZhcycsIChjYW52YXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKHRoaXMuY29uZmlnLnNpdGUsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHRoaXMuY29uZmlnLnNpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25SZWFkeSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZzsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG5cclxuY2xhc3MgRXZlbnRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWV0YU1hcCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJpb3Qub2JzZXJ2YWJsZSh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fVxyXG4gICAgfVxyXG5cclxuICAgIGV2ZXJ5KGV2ZW50LCByZWFjdGlvbikge1xyXG4gICAgICAgIC8vbGV0IGNhbGxiYWNrID0gcmVhY3Rpb247XHJcbiAgICAgICAgLy9pZiAodGhpcy5ldmVudHNbZXZlbnRdKSB7XHJcbiAgICAgICAgLy8gICAgbGV0IHBpZ2d5YmFjayA9IHRoaXMuZXZlbnRzW2V2ZW50XTtcclxuICAgICAgICAvLyAgICBjYWxsYmFjayA9ICguLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAvLyAgICAgICAgcGlnZ3liYWNrKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgLy8gICAgICAgIHJlYWN0aW9uKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgLy8gICAgfVxyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xyXG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0gcmVhY3Rpb247XHJcbiAgICAgICAgICAgIHRoaXMub24oZXZlbnQsIHJlYWN0aW9uKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JnZXQoZXZlbnQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XHJcbiAgICAgICAgXy5lYWNoKGV2ZW50cywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNbZXZlbnRdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vZmYoZXZlbnQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZG8oZXZlbnQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xyXG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKGV2ZW50LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudGVyOyIsImxldCBGaXJlYmFzZSA9IHdpbmRvdy5GaXJlYmFzZTtcclxubGV0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXHJcbmxldCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcclxuXHJcbmNsYXNzIE1ldGFGaXJlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmZiID0gbmV3IEZpcmViYXNlKGBodHRwczovLyR7dGhpcy5jb25maWcuc2l0ZS5kYn0uZmlyZWJhc2Vpby5jb21gKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbWV0YU1hcCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX21ldGFNYXApIHtcclxuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21ldGFNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9sb2dpbikge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5NZXRhTWFwLkF1dGgwLmdldFNlc3Npb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChwcm9maWxlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuTWV0YU1hcC5BdXRoMC5sb2NrLmdldENsaWVudCgpLmdldERlbGVnYXRpb25Ub2tlbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMuY29uZmlnLnNpdGUuYXV0aDAuYXBpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRfdG9rZW46IHByb2ZpbGUuaWRfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGlfdHlwZTogJ2ZpcmViYXNlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBkZWxlZ2F0aW9uUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGUuZmlyZWJhc2VfdG9rZW4gPSBkZWxlZ2F0aW9uUmVzdWx0LmlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZWJhc2VfdG9rZW4gPSBkZWxlZ2F0aW9uUmVzdWx0LmlkX3Rva2VuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2ZpcmViYXNlX3Rva2VuJywgdGhpcy5maXJlYmFzZV90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYi5hdXRoV2l0aEN1c3RvbVRva2VuKHRoaXMuZmlyZWJhc2VfdG9rZW4sIChlcnJvciwgYXV0aERhdGEsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChhdXRoRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSB0aGlzLl9sb2dpbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmdWxmaWxsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaGlsZChwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmIuY2hpbGQocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YShwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2hpbGQub25jZSgndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIChzbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb24ocGF0aCwgY2FsbGJhY2ssIGV2ZW50ID0gJ3ZhbHVlJykge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgICAgIGxldCBtZXRob2QgPSAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoIXNuYXBzaG90LmV4aXN0cygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjaGlsZC5vZmYoZXZlbnQsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIGRhdGEgYXQgJHtwYXRofWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gc25hcHNob3QudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jaGlsZC5vZmYoZXZlbnQsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uKGV2ZW50LCBtZXRob2QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb2ZmKHBhdGgsIG1ldGhvZCA9ICd2YWx1ZScsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKG1ldGhvZCwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEoZGF0YSwgcGF0aCkge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQuc2V0KGRhdGEsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlRGF0YShwYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0RGF0YShudWxsLCBwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoRGF0YShkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5wdXNoKGRhdGEsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YUluVHJhbnNhY3Rpb24oZGF0YSwgcGF0aCwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnRyYW5zYWN0aW9uKChjdXJyZW50VmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlcnJvcihlLCBwYXRoKSB7XHJcbiAgICAgICAgaWYgKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoeyBtZXNzYWdlOiBgUGVybWlzc2lvbiBkZW5pZWQgdG8gJHtwYXRofWAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLl9sb2dpbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fb25SZWFkeSA9IG51bGw7XHJcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnZmlyZWJhc2VfdG9rZW4nKTtcclxuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5jbGFzcyBJbnRlZ3JhdGlvbnMge1xyXG5cclxuXHRjb25zdHJ1Y3RvcihtZXRhTWFwLCB1c2VyKSB7XHJcblx0XHR0aGlzLmNvbmZpZyA9IG1ldGFNYXAuY29uZmlnO1xyXG5cdFx0dGhpcy5tZXRhTWFwID0gbWV0YU1hcDtcclxuXHRcdHRoaXMudXNlciA9IHVzZXI7XHJcblx0XHR0aGlzLl9mZWF0dXJlcyA9IHtcclxuXHRcdFx0Z29vZ2xlOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvR29vZ2xlJyksXHJcblx0XHRcdHVzZXJzbmFwOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvVXNlclNuYXAnKSxcclxuICAgICAgICAgICAgYWRkdGhpczogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL0FkZFRoaXMnKSxcclxuICAgICAgICAgICAgeW91dHViZTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1lvdVR1YmUnKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGluaXQoKSB7XHJcbiAgICAgICAgXy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoRmVhdHVyZSkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRsZXQgY29uZmlnID0gdGhpcy5jb25maWcuc2l0ZVtuYW1lXTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0gPSBuZXcgRmVhdHVyZShjb25maWcsIHRoaXMudXNlcik7XHJcblx0XHRcdFx0XHR0aGlzW25hbWVdLmluaXQoKTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0uc2V0VXNlcigpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblx0c2V0VXNlcigpIHtcclxuXHRcdF8uZWFjaCh0aGlzLl9mZWF0dXJlcywgKEZlYXR1cmUsIG5hbWUpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tuYW1lXS5zZXRVc2VyKCk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxuXHJcblx0c2VuZEV2ZW50KHZhbCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1ldGFNYXAuZGVidWcpIHtcclxuICAgICAgICAgICAgXy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNlbmRFdmVudCh2YWwsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdHVwZGF0ZVBhdGgoKSB7XHJcblxyXG5cdH1cclxuXHJcblx0bG9nb3V0KCkge1xyXG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR0aGlzW25hbWVdLmxvZ291dCgpO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zOyIsImNsYXNzIFBlcm1pc3Npb25zIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcclxuICAgICAgICB0aGlzLm1hcCA9IG1hcFxyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxyXG4gICAgfVxyXG5cclxuICAgIGNhbkVkaXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXBPd25lcigpIHx8IHRoaXMuaXNTaGFyZWRFZGl0KClcclxuICAgIH1cclxuXHJcbiAgICBjYW5WaWV3KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzTWFwT3duZXIoKSB8fCB0aGlzLmlzU2hhcmVkVmlldygpXHJcbiAgICB9XHJcblxyXG4gICAgaXNNYXBPd25lcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgJiYgdGhpcy5tYXAub3duZXIudXNlcklkID09IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZFxyXG4gICAgfVxyXG5cclxuICAgIGlzU2hhcmVkRWRpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgJiZcclxuICAgICAgICAgICAgdGhpcy5tYXAuc2hhcmVkX3dpdGggJiZcclxuICAgICAgICAgICAgICAgICh0aGlzLm1ldGFNYXAuVXNlci5pc0FkbWluIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpKVxyXG4gICAgfVxyXG5cclxuICAgIGlzU2hhcmVkVmlldygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgJiZcclxuICAgICAgICAgICAgdGhpcy5pc1NoYXJlZEVkaXQoKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0gJiYgdGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXS5yZWFkID09IHRydWUpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddLnJlYWQgPT0gdHJ1ZSlcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQZXJtaXNzaW9uczsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vdHlwaW5ncy9yaW90anMvcmlvdGpzLmQudHNcIiAvPlxyXG5jb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIFJvdXRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXRhTWFwKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbnMgPSBtZXRhTWFwLkludGVncmF0aW9ucztcclxuICAgICAgICB0aGlzLnVzZXIgPSBtZXRhTWFwLlVzZXI7XHJcbiAgICAgICAgdGhpcy5QYWdlRmFjdG9yeSA9IG1ldGFNYXAuUGFnZUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyID0gbWV0YU1hcC5FdmVudGVyO1xyXG4gICAgICAgIHRoaXMuaXNIaWRkZW4gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHJpb3Qucm91dGUuc3RhcnQoKTtcclxuICAgICAgICByaW90LnJvdXRlKCh0YXJnZXQsIGlkID0gJycsIGFjdGlvbiA9ICcnLCAuLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wYXRoID0gdGhpcy5nZXRQYXRoKHRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1haW4odHJ1ZSwgdGhpcy5wYXRoKTtcclxuICAgICAgICAgICAgdGhpcy5QYWdlRmFjdG9yeS5uYXZpZ2F0ZSh0aGlzLnBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oJ2hpc3RvcnknLCB3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50byh0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFBhZ2UoKSB7XHJcbiAgICAgICAgbGV0IHBhZ2UgPSB3aW5kb3cubG9jYXRpb24uaGFzaCB8fCAnaG9tZSc7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzVHJhY2tlZChwYWdlKSkge1xyXG4gICAgICAgICAgICBsZXQgcGFnZUNudCA9IHRoaXMudXNlci5oaXN0b3J5Lmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKHBhZ2VDbnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRQYXRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJldmlvdXNQYWdlKHBhZ2VObyA9IDIpIHtcclxuICAgICAgICBsZXQgcGFnZSA9ICdob21lJztcclxuICAgICAgICBsZXQgcGFnZUNudCA9IHRoaXMudXNlci5oaXN0b3J5Lmxlbmd0aDtcclxuICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcclxuICAgICAgICAgICAgcGFnZSA9IHRoaXMuZ2V0UGF0aCh0aGlzLnVzZXIuaGlzdG9yeVtwYWdlQ250IC0gcGFnZU5vXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwcmV2aW91c1BhZ2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UHJldmlvdXNQYWdlKDIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYWNrKHBhdGgpIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9ucy51cGRhdGVQYXRoKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZU1haW4oaGlkZSwgcGF0aCkge1xyXG4gICAgICAgIHRoaXMudHJhY2socGF0aCk7XHJcbiAgICAgICAgaWYgKGhpZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0hpZGRlbiA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXRoKHBhdGgpIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB3aGlsZSAocGF0aC5zdGFydHNXaXRoKCchJykgfHwgcGF0aC5zdGFydHNXaXRoKCcjJykpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICB0byhwYXRoKSB7XHJcbiAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1haW4odHJ1ZSwgcGF0aCk7XHJcbiAgICAgICAgICAgIHJpb3Qucm91dGUoYCR7cGF0aH1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYmFjaygpIHtcclxuICAgICAgICBsZXQgcGF0aCA9ICdob21lJztcclxuICAgICAgICBsZXQgcGFnZUNudCA9IHRoaXMudXNlci5oaXN0b3J5Lmxlbmd0aDtcclxuICAgICAgICBpZiAocGFnZUNudCA+IDEgJiYgKHRoaXMuY3VycmVudFBhZ2UgIT0gJ215bWFwcycgfHwgdGhpcy5jdXJyZW50UGFnZSAhPSB0aGlzLnByZXZpb3VzUGFnZSkpIHtcclxuICAgICAgICAgICAgcGF0aCA9IHRoaXMucHJldmlvdXNQYWdlO1xyXG4gICAgICAgICAgICBsZXQgYmFja05vID0gMjtcclxuICAgICAgICAgICAgd2hpbGUgKCF0aGlzLmlzVHJhY2tlZChwYXRoKSAmJiB0aGlzLnVzZXIuaGlzdG9yeVtiYWNrTm9dKSB7XHJcbiAgICAgICAgICAgICAgICBiYWNrTm8gKz0gMTtcclxuICAgICAgICAgICAgICAgIHBhdGggPSB0aGlzLmdldFByZXZpb3VzUGFnZShiYWNrTm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnRvKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBkb05vdFRyYWNrKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZG9Ob3RUcmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLl9kb05vdFRyYWNrID0gW0NPTlNUQU5UUy5BQ1RJT05TLkRFTEVURV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQLCBDT05TVEFOVFMuQUNUSU9OUy5MT0dPVVQsIENPTlNUQU5UUy5BQ1RJT05TLk5FV19NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLLCBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZG9Ob3RUcmFjaztcclxuICAgIH1cclxuXHJcbiAgICBpc1RyYWNrZWQocGF0aCkge1xyXG4gICAgICAgIGxldCBwdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XHJcbiAgICAgICAgcmV0dXJuIF8uYW55KHRoaXMuZG9Ob3RUcmFjaywgKHApID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICFwdGguc3RhcnRzV2l0aChwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXI7IiwiY29uc3QgbG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpXHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxuXHJcbmNvbnN0IHRvQm9vbCA9ICh2YWwpID0+IHtcclxuICAgIGxldCByZXQgPSBmYWxzZTtcclxuICAgIGlmICh2YWwgPT09IHRydWUgfHwgdmFsID09PSBmYWxzZSkge1xyXG4gICAgICAgIHJldCA9IHZhbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKF8uY29udGFpbnMoWyd0cnVlJywgJ3llcycsICcxJ10sIHZhbCArICcnLnRvTG93ZXJDYXNlKCkudHJpbSgpKSkge1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXQ7XHJcbn1cclxuXHJcbmNsYXNzIFNoYXJpbmcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHVzZXIpIHtcclxuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyXHJcbiAgICAgICAgdGhpcy5fbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxyXG4gICAgICAgIHRoaXMuX2ZiID0gdGhpcy5fbWV0YU1hcC5NZXRhRmlyZTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTaGFyZShtYXAsIHVzZXJEYXRhLCBvcHRzID0geyByZWFkOiB0cnVlLCB3cml0ZTogZmFsc2UgfSkge1xyXG4gICAgICAgIGlmIChtYXAgJiYgbWFwLmlkICYmIHVzZXJEYXRhICYmIHVzZXJEYXRhLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgcmVhZDogdG9Cb29sKG9wdHMucmVhZCksXHJcbiAgICAgICAgICAgICAgICB3cml0ZTogdG9Cb29sKG9wdHMud3JpdGUpLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogb3B0cy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgcGljdHVyZTogb3B0cy5waWN0dXJlXHJcbiAgICAgICAgICAgIH0sIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcC5pZH0vc2hhcmVkX3dpdGgvJHt1c2VyRGF0YS5pZH1gKVxyXG4gICAgICAgICAgICB0aGlzLl9mYi5wdXNoRGF0YSh7XHJcbiAgICAgICAgICAgICAgICBldmVudDogYCR7dGhpcy51c2VyLmRpc3BsYXlOYW1lfSBzaGFyZWQgYSBtYXAsICR7bWFwLm5hbWV9LCB3aXRoIHlvdSFgLFxyXG4gICAgICAgICAgICAgICAgbWFwSWQ6IG1hcC5pZCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IENPTlNUQU5UUy5OT1RJRklDQVRJT04uTUFQLFxyXG4gICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKX1gXHJcbiAgICAgICAgICAgIH0sIGAke0NPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQodXNlckRhdGEuaWQpfWApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVNoYXJlKG1hcCwgdXNlckRhdGEpIHtcclxuICAgICAgICBpZiAobWFwICYmIG1hcC5pZCAmJiB1c2VyRGF0YSAmJiB1c2VyRGF0YS5pZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9mYi5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcC5pZH0vc2hhcmVkX3dpdGgvJHt1c2VyRGF0YS5pZH1gKVxyXG4gICAgICAgICAgICB0aGlzLl9mYi5wdXNoRGF0YSh7XHJcbiAgICAgICAgICAgICAgICBldmVudDogYCR7dGhpcy51c2VyLmRpc3BsYXlOYW1lfSByZW1vdmVkIGEgbWFwLCAke21hcC5uYW1lfSwgdGhhdCB3YXMgcHJldmlvdXNseSBzaGFyZWQuYCxcclxuICAgICAgICAgICAgICAgIHRpbWU6IGAke25ldyBEYXRlKCl9YFxyXG4gICAgICAgICAgICB9LCBgJHtDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KHVzZXJEYXRhLmlkKX1gKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlZGl0U2hhcmUobWFwSWQsIHVzZXJEYXRhLCBvcHRzID0geyByZWFkOiB0cnVlLCB3cml0ZTogZmFsc2UgfSkge1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcmluZyIsImNvbnN0IEF1dGgwTG9jayA9IHJlcXVpcmUoJ2F1dGgwLWxvY2snKVxuY29uc3QgbG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5cbmNsYXNzIEF1dGgwIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgbWV0YU1hcCkge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gbWV0YU1hcDtcbiAgICAgICAgdGhpcy5sb2NrID0gbmV3IEF1dGgwTG9jayhjb25maWcuYXBpLCBjb25maWcuYXBwKTtcbiAgICAgICAgdGhpcy5sb2NrLm9uKCdsb2FkaW5nIHJlYWR5JywgKC4uLmUpID0+IHtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2dpbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sb2dpbikge1xuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHNob3dMb2dpbiA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NrLnNob3coe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5BZnRlclNpZ251cDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZTogJ29wZW5pZCBvZmZsaW5lX2FjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgcHJvZmlsZSwgaWRfdG9rZW4sIGN0b2tlbiwgb3B0LCByZWZyZXNoX3Rva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkZhaWwoZXJyLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN0b2tlbiA9IHByb2ZpbGUuY3Rva2VuID0gY3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2N0b2tlbicsIHRoaXMuY3Rva2VuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBwcm9maWxlLmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnaWRfdG9rZW4nLCB0aGlzLmlkX3Rva2VuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHRoaXMucHJvZmlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hfdG9rZW4gPSBwcm9maWxlLnJlZnJlc2hfdG9rZW4gPSByZWZyZXNoX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRTZXNzaW9uKCkudGhlbigocHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMb2dpbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzaG93TG9naW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpbjtcbiAgICB9XG5cbiAgICBsaW5rQWNjb3VudCgpIHtcbiAgICAgICAgdGhpcy5sb2NrLnNob3coe1xuICAgICAgICAgICAgY2FsbGJhY2tVUkw6IGxvY2F0aW9uLmhyZWYucmVwbGFjZShsb2NhdGlvbi5oYXNoLCAnJyksXG4gICAgICAgICAgICBkaWN0OiB7XG4gICAgICAgICAgICAgICAgc2lnbmluOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGluayB3aXRoIGFub3RoZXIgYWNjb3VudCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXV0aFBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdGhpcy5jdG9rZW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25GYWlsKGVyciwgcmVqZWN0KSB7XG4gICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlcnIpO1xuICAgICAgICBpZiAocmVqZWN0KSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIHRoaXMubG9nb3V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTZXNzaW9uKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9maWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9nZXRTZXNzaW9uID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGZ1bGZpbGwodGhpcy5wcm9maWxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLl9nZXRTZXNzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9nZXRTZXNzaW9uID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGZvcmFnZS5nZXRJdGVtKCdpZF90b2tlbicpLnRoZW4oKGlkX3Rva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZF90b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jay5nZXRQcm9maWxlKGlkX3Rva2VuLCAoZXJyLCBwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbChlcnIsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnaWRfdG9rZW4nLCBpZF90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCBwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnY3Rva2VuJykudGhlbigodG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkX3Rva2VuID0gcHJvZmlsZS5pZF90b2tlbiA9IGlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdObyBzZXNzaW9uJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0U2Vzc2lvbjtcbiAgICB9XG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ2lkX3Rva2VuJykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgncHJvZmlsZScpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmN0b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmlkX3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaF90b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9nZXRTZXNzaW9uID0gbnVsbDtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBBdXRoMDtcblxuXG4iLCJjb25zdCB1dWlkID0gcmVxdWlyZSgnLi4vdG9vbHMvdXVpZC5qcycpO1xyXG5jb25zdCBDb21tb24gPSByZXF1aXJlKCcuLi90b29scy9Db21tb24nKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5jbGFzcyBVc2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb2ZpbGUsIGF1dGgsIGV2ZW50ZXIsIG1ldGFGaXJlKSB7XHJcbiAgICAgICAgdGhpcy5hdXRoID0gYXV0aDtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcclxuICAgICAgICB0aGlzLnVzZXJLZXkgPSB1dWlkKCk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XHJcbiAgICAgICAgICAgIGxldCB0cmFja0hpc3RvcnkgPSBfLm9uY2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmV2ZXJ5KCdoaXN0b3J5JywgKHBhZ2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oaXN0b3J5Lmxlbmd0aCA9PSAwIHx8IHBhZ2UgIT0gdGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpc3RvcnkucHVzaChwYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKHRoaXMuaGlzdG9yeSwgYHVzZXJzLyR7dGhpcy5hdXRoLnVpZH0vaGlzdG9yeWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0YUZpcmUub24oYHVzZXJzLyR7dGhpcy5hdXRoLnVpZH1gLCAodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXIuaGlzdG9yeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIuaGlzdG9yeSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gdXNlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrSGlzdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IF9pZGVudGl0eSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0ge307XHJcbiAgICAgICAgaWYgKHRoaXMucHJvZmlsZSAmJiB0aGlzLnByb2ZpbGUuaWRlbnRpdHkpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5wcm9maWxlLmlkZW50aXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjcmVhdGVkT24oKSB7XHJcbiAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5fY3JlYXRlZE9uKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5jcmVhdGVkX2F0KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZHQgPSBuZXcgRGF0ZSh0aGlzLl9pZGVudGl0eS5jcmVhdGVkX2F0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZWRPbiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlOiBkdCxcclxuICAgICAgICAgICAgICAgICAgICB0aWNrczogQ29tbW9uLmdldFRpY2tzRnJvbURhdGUoZHQpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZWRPbiB8fCB7IGRhdGU6IG51bGwsIHRpY2tzOiBudWxsIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRpc3BsYXlOYW1lKCkge1xyXG4gICAgICAgIGxldCByZXQgPSB0aGlzLmZ1bGxOYW1lO1xyXG4gICAgICAgIGlmIChyZXQpIHtcclxuICAgICAgICAgICAgcmV0ID0gcmV0LnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmV0ICYmIHRoaXMuX2lkZW50aXR5Lm5pY2tuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5Lm5pY2tuYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZnVsbE5hbWUoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5uYW1lKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5Lm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVtYWlsKCkge1xyXG4gICAgICAgIGxldCByZXQgPSAnJztcclxuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkuZW1haWwpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkuZW1haWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBpY3R1cmUoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5waWN0dXJlKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LnBpY3R1cmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHVzZXJJZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoLnVpZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNBZG1pbigpIHtcclxuICAgICAgICBsZXQgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnJvbGVzKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LnJvbGVzLmFkbWluID09IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldFxyXG4gICAgfVxyXG5cclxuICAgIGdldCBoaXN0b3J5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2ZpbGUuaGlzdG9yeSB8fCBbXTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlVXNlckVkaXRvck9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICB1c2VyOiB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3Jfb3B0aW9uczogSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXNlcjsiLCJjb25zdCBqc1BsdW1iID0gd2luZG93LmpzUGx1bWI7XHJcbmNvbnN0IGpzUGx1bWJUb29sa2l0ID0gd2luZG93LmpzUGx1bWJUb29sa2l0O1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbmNvbnN0IFBlcm1pc3Npb25zID0gcmVxdWlyZSgnLi4vYXBwL1Blcm1pc3Npb25zJylcclxuXHJcbnJlcXVpcmUoJy4vbGF5b3V0JylcclxuXHJcbmNsYXNzIENhbnZhcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWFwLCBtYXBJZCkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbWFwO1xyXG4gICAgICAgIHRoaXMubWFwSWQgPSBtYXBJZDtcclxuICAgICAgICB0aGlzLnRvb2xraXQgPSB7fTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJylcclxuICAgICAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgcmVhZHkgPSB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHttYXBJZH1gKS50aGVuKChtYXBJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubWFwSW5mbyA9IG1hcEluZm9cclxuICAgICAgICAgICAgcGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMobWFwSW5mbylcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnN0IHRocm90dGxlU2F2ZSA9IF8udGhyb3R0bGUoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocGVybWlzc2lvbnMuY2FuRWRpdCgpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zdERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogd2luZG93LnRvb2xraXQuZXhwb3J0RGF0YSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRfYnk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLk1ldGFGaXJlLnNldERhdGFJblRyYW5zYWN0aW9uKHBvc3REYXRhLCBgbWFwcy9kYXRhLyR7dGhpcy5tYXBJZH1gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHRoaXMubWFwSWQsICdldmVudCcsICdhdXRvc2F2ZScsICdhdXRvc2F2ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICByZWFkeS50aGVuKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENvcm5lclxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGdldCBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgVG9vbGtpdC4gcHJvdmlkZSBhIHNldCBvZiBtZXRob2RzIHRoYXQgY29udHJvbCB3aG8gY2FuIGNvbm5lY3QgdG8gd2hhdCwgYW5kIHdoZW4uXHJcbiAgICAgICAgICAgICAgICB2YXIgdG9vbGtpdCA9IHdpbmRvdy50b29sa2l0ID0ganNQbHVtYlRvb2xraXQubmV3SW5zdGFuY2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVN0YXJ0Q29ubmVjdDpmdW5jdGlvbihmcm9tTm9kZSwgZWRnZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudENvcm5lciA9IGVkZ2VUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBlZGdlVHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCB0b05vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJldCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vUHJldmVudCBzZWxmLXJlZmVyZW5jaW5nIGNvbm5lY3Rpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZyb21Ob2RlID09IHRvTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0JldHdlZW4gdGhlIHNhbWUgdHdvIG5vZGVzLCBvbmx5IG9uZSBwZXJzcGVjdGl2ZSBjb25uZWN0aW9uIG1heSBleGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKGN1cnJlbnRDb3JuZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdwZXJzcGVjdGl2ZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGdlcyA9IGZyb21Ob2RlLmdldEVkZ2VzKHsgZmlsdGVyOiBmdW5jdGlvbihlKSB7IHJldHVybiBlLmRhdGEudHlwZSA9PSAncGVyc3BlY3RpdmUnIH19KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxlZGdlcy5sZW5ndGg7IGkrPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWQgPSBlZGdlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKChlZC5zb3VyY2UgPT0gZnJvbU5vZGUgJiYgZWQudGFyZ2V0ID09IHRvTm9kZSkgfHwgKGVkLnRhcmdldCA9PSBmcm9tTm9kZSAmJiBlZC5zb3VyY2UgPT0gdG9Ob2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIGR1bW15IGZvciBhIG5ldyBub2RlLlxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIHZhciBfbmV3Tm9kZSA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPXR5cGV8fFwiaWRlYVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdzo1MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaDo1MCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6XCJpZGVhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxQb3NpdGlvbjogW11cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgcHJveHkgKGRyYWcgaGFuZGxlKVxyXG4gICAgICAgICAgICAgICAgdmFyIF9uZXdQcm94eSA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gdHlwZSB8fCAncHJveHlQZXJzcGVjdGl2ZSdcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3OjEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoOjEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbWFpbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmp0ay1kZW1vLW1haW5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanRrLWRlbW8tY2FudmFzXCIpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvL1doZW5ldmVyIGNoYW5naW5nIHRoZSBzZWxlY3Rpb24sIGNsZWFyIHdoYXQgd2FzIHByZXZpb3VzbHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgIHZhciBjbGVhclNlbGVjdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5zZXRTZWxlY3Rpb24ob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uZmlndXJlIHRoZSByZW5kZXJlclxyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gdG9vbGtpdC5yZW5kZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogY2FudmFzRWxlbWVudCxcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0RyYWdnYWJsZTogcGVybWlzc2lvbnMuY2FuRWRpdCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZVBhbkJ1dHRvbnM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxheW91dDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGN1c3RvbSBsYXlvdXQgZm9yIHRoaXMgYXBwLiBzaW1wbGUgZXh0ZW5zaW9uIG9mIHRoZSBzcHJpbmcgbGF5b3V0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwibWV0YW1hcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgaG93IHlvdSBjYW4gYXNzb2NpYXRlIGdyb3VwcyBvZiBub2Rlcy4gSGVyZSwgYmVjYXVzZSBvZiB0aGVcclxuICAgICAgICAgICAgICAgICAgICAvLyB3YXkgSSBoYXZlIHJlcHJlc2VudGVkIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGEsIHdlIGVpdGhlciByZXR1cm5cclxuICAgICAgICAgICAgICAgICAgICAvLyBhIHBhcnQncyBcInBhcmVudFwiIGFzIHRoZSBwb3NzZSwgb3IgaWYgaXQgaXMgbm90IGEgcGFydCB0aGVuIHdlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBub2RlJ3MgaWQuIFRoZXJlIGFyZSBhZGRUb1Bvc3NlIGFuZCByZW1vdmVGcm9tUG9zc2VcclxuICAgICAgICAgICAgICAgICAgICAvLyBtZXRob2RzIHRvbyAob24gdGhlIHJlbmRlcmVyLCBub3QgdGhlIHRvb2xraXQpOyB0aGVzZSBjYW4gYmUgdXNlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdHJhbnNmZXJyaW5nIGEgcGFydCBmcm9tIG9uZSBwYXJlbnQgdG8gYW5vdGhlci5cclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25Qb3NzZTpmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmRhdGEucGFyZW50ID8gWyBub2RlLmRhdGEucGFyZW50LCBmYWxzZSBdIDogbm9kZS5pZDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHpvb21Ub0ZpdDpmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB2aWV3OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXM6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcDogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihvYmoubm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW91c2VlbnRlcjogZnVuY3Rpb24ob2JqKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsTm9kZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlYToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJkZWZhdWx0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInItdGhpbmdcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJpZGVhXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTpcInRtcGxEcmFnUHJveHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JzOiBbJ0NvbnRpbnVvdXMnLCAnQ2VudGVyJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVBlcnNwZWN0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcInByb3h5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlbGF0aW9uc2hpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJwcm94eVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYmxjbGljazogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL29iai5ub2RlLmRhdGEudHlwZSA9ICdyLXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmoubm9kZS5zZXRUeXBlKCdyLXRoaW5nJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVXBkYXRpbmcgdGhlIG5vZGUgdHlwZSBkb2VzIG5vdCBzZWVtIHRvIHN0aWNrOyBpbnN0ZWFkLCBjcmVhdGUgYSBuZXcgbm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSByZW5kZXJlci5tYXBFdmVudExvY2F0aW9uKG9iai5lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gb2JqLm5vZGUuZ2V0RWRnZXMoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQudyA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLncgKiAwLjY2NztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQuaCA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLmggKiAwLjY2NztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShqc1BsdW1iLmV4dGVuZChfbmV3Tm9kZShcInItdGhpbmdcIiksIGQpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JlLWNyZWF0ZSB0aGUgZWRnZSBjb25uZWN0aW9ucyBvbiB0aGUgbmV3IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9MSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVkZ2VzW2ldLnNvdXJjZSA9PSBvYmoubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpuZXdOb2RlLCB0YXJnZXQ6ZWRnZXNbaV0udGFyZ2V0LCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGVkZ2VzW2ldLnRhcmdldCA9PSBvYmoubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTplZGdlc1tpXS5zb3VyY2UsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgdGhlIHByb3h5IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlTm9kZShvYmoubm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXA6IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9iai5lLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT0gJ3JlbGF0aW9uc2hpcC1vdmVybGF5JyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKG9iai5lZGdlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JzOltcIkNvbnRpbnVvdXNcIixcIkNvbnRpbnVvdXNcIl0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3I6W1wiU3RhdGVNYWNoaW5lXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxLjAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJ2aW5lc3M6MTVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXJlbGF0aW9uc2hpcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheXM6W1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIFwiUGxhaW5BcnJvd1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjoxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcInJlbGF0aW9uc2hpcC1vdmVybGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBQcm94eTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXJlbGF0aW9uc2hpcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRzOlsgXCJCbGFua1wiLCBbIFwiRG90XCIsIHsgcmFkaXVzOjUsIGNzc0NsYXNzOlwib3JhbmdlXCIgfV1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlUHJveHk6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1wZXJzcGVjdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czoxLCBjc3NDbGFzczpcIm9yYW5nZV9wcm94eVwiIH1dXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNEYmxDbGljazpmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYW4gSWRlYSBub2RlIGF0IHRoZSBsb2NhdGlvbiBhdCB3aGljaCB0aGUgZXZlbnQgb2NjdXJyZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gcmVuZGVyZXIubWFwRXZlbnRMb2NhdGlvbihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTW92ZSAxLzIgdGhlIGhlaWdodCBhbmQgd2lkdGggdXAgYW5kIHRvIHRoZSBsZWZ0IHRvIGNlbnRlciB0aGUgbm9kZSBvbiB0aGUgbW91c2UgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogd2hlbiBoZWlnaHQvd2lkdGggaXMgY29uZmlndXJhYmxlLCByZW1vdmUgaGFyZC1jb2RlZCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy5sZWZ0ID0gcG9zLmxlZnQtNTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy50b3AgPSBwb3MudG9wLTUwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoanNQbHVtYi5leHRlbmQoX25ld05vZGUoKSwgcG9zKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVBZGRlZDpfcmVnaXN0ZXJIYW5kbGVycywgLy8gc2VlIGJlbG93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VBZGRlZDogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxheW91dDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhcmlvdXMgZHJhZy9kcm9wIGhhbmRsZXIgZXZlbnQgZXhwZXJpbWVudHMgbGl2ZWQgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBkcmFnT3B0aW9uczp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjpcIi5zZWdtZW50XCIsICAgICAgIC8vIGNhbid0IGRyYWcgbm9kZXMgYnkgdGhlIGNvbG9yIHNlZ21lbnRzLlxyXG5cdFx0XHRcdFx0XHRzdG9wOmZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHdoZW4gX2FueV8gbm9kZSBzdG9wcyBkcmFnZ2luZywgcnVuIHRoZSBsYXlvdXQgYWdhaW4uXHJcblx0XHRcdFx0XHRcdFx0Ly8gdGhpcyB3aWxsIGNhdXNlIGNoaWxkIG5vZGVzIHRvIHNuYXAgdG8gdGhlaXIgbmV3IHBhcmVudCwgYW5kIGFsc29cclxuXHRcdFx0XHRcdFx0XHQvLyBjbGVhbnVwIG5pY2VseSBpZiBhIG5vZGUgaXMgZHJvcHBlZCBvbiBhbm90aGVyIG5vZGUuXHJcblx0XHRcdFx0XHRcdFx0cmVuZGVyZXIucmVmcmVzaCgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWxvZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5pbml0aWFsaXplKHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBcIi5kbGdcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLyBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4gICAgICAgICAgICAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyAgICBNb3VzZSBoYW5kbGVycy4gU29tZSBhcmUgd2lyZWQgdXA7IGFsbCBsb2cgdGhlIGN1cnJlbnQgbm9kZSBkYXRhIHRvIHRoZSBjb25zb2xlLlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBfdHlwZXMgPSBbIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiZ3JlZW5cIiwgXCJibHVlXCIsIFwidGV4dFwiIF07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNsaWNrTG9nZ2VyID0gZnVuY3Rpb24odHlwZSwgZXZlbnQsIGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQgKyAnICcgKyB0eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50ID09ICdkYmxjbGljaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgX2NsaWNrSGFuZGxlcnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdSJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyZWVuOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignRycsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdPJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdCJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdUJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRibGNsaWNrOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignUicsICdkYmxjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmVlbjpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0cnLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9IG5vZGUuZGF0YS53ICogMC42Njc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SGVpZ2h0ID0gbm9kZS5kYXRhLmggKiAwLjY2NztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4gPSBub2RlLmRhdGEuY2hpbGRyZW4gfHwgW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3TGFiZWwgPSAnUGFydCc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDpub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHc6bmV3V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaDpuZXdIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IG5ld0xhYmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBub2RlLmRhdGEuY2hpbGRyZW4ubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmNoaWxkcmVuLnB1c2gobmV3Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5yZWxheW91dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdPJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVBlcnNwZWN0aXZlJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5vZGUsIHRhcmdldDpwcm94eU5vZGUsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwZXJzcGVjdGl2ZVByb3h5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOnByb3h5Tm9kZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwZXJzcGVjdGl2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdCJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVJlbGF0aW9uc2hpcCcpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpub2RlLCB0YXJnZXQ6cHJveHlOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwUHJveHlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdUJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLm5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImRsZ1RleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9LOiBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnVwZGF0ZU5vZGUobm9kZSwgeyBsYWJlbDpkLnRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpub2RlLmRhdGEubGFiZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIF9jdXJyeUhhbmRsZXIgPSBmdW5jdGlvbihlbCwgc2VnbWVudCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLlwiICsgc2VnbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYi5vbihfZWwsIFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2xpY2tIYW5kbGVyc1tcImNsaWNrXCJdW3NlZ21lbnRdKGVsLCBub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKF9lbCwgXCJkYmxjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jbGlja0hhbmRsZXJzW1wiZGJsY2xpY2tcIl1bc2VnbWVudF0oZWwsIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0dXAgdGhlIGNsaWNraW5nIGFjdGlvbnMgYW5kIHRoZSBsYWJlbCBkcmFnLiBGb3IgdGhlIGRyYWcgd2UgY3JlYXRlIGFuXHJcbiAgICAgICAgICAgICAgICAvLyBpbnN0YW5jZSBvZiBqc1BsdW1iIGZvciBub3Qgb3RoZXIgcHVycG9zZSB0aGFuIHRvIG1hbmFnZSB0aGUgZHJhZ2dpbmcgb2ZcclxuICAgICAgICAgICAgICAgIC8vIGxhYmVscy4gV2hlbiBhIGRyYWcgc3RhcnRzIHdlIHNldCB0aGUgem9vbSBvbiB0aGF0IGpzUGx1bWIgaW5zdGFuY2UgdG9cclxuICAgICAgICAgICAgICAgIC8vIG1hdGNoIG91ciBjdXJyZW50IHpvb20uXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsRHJhZ0hhbmRsZXIgPSBqc1BsdW1iLmdldEluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBfcmVnaXN0ZXJIYW5kbGVycyhwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBoZXJlIHlvdSBoYXZlIHBhcmFtcy5lbCwgdGhlIERPTSBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHBhcmFtcy5ub2RlLCB0aGUgdW5kZXJseWluZyBub2RlLiBpdCBoYXMgYSBgZGF0YWAgbWVtYmVyIHdpdGggdGhlIG5vZGUncyBwYXlsb2FkLlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHBhcmFtcy5lbCwgbm9kZSA9IHBhcmFtcy5ub2RlLCBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY3VycnlIYW5kbGVyKGVsLCBfdHlwZXNbaV0sIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgbGFiZWwgZHJhZ2dhYmxlIChzZWUgbm90ZSBhYm92ZSkuXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxEcmFnSGFuZGxlci5kcmFnZ2FibGUobGFiZWwsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRHJhZ0hhbmRsZXIuc2V0Wm9vbShyZW5kZXJlci5nZXRab29tKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOmZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5sYWJlbFBvc2l0aW9uID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLmxlZnQsIDEwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChsYWJlbC5zdHlsZS50b3AsIDEwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVTYXZlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBsYWJlbCBlZGl0YWJsZSB2aWEgYSBkaWFsb2dcclxuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGxhYmVsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LkRpYWxvZ3Muc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogXCJkbGdUZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uT0s6IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC51cGRhdGVOb2RlKG5vZGUsIHsgbGFiZWw6ZC50ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpub2RlLmRhdGEubGFiZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAqIHNob3dzIGluZm8gaW4gd2luZG93IG9uIGJvdHRvbSByaWdodC5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBfaW5mbyh0ZXh0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBsb2FkIHRoZSBkYXRhLlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQubWFwICYmIHRoYXQubWFwLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoYXQubWFwLmRhdGFcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgLy8gYSBjb3VwbGUgb2YgcmFuZG9tIGV4YW1wbGVzIG9mIHRoZSBmaWx0ZXIgZnVuY3Rpb24sIGFsbG93aW5nIHlvdSB0byBxdWVyeSB5b3VyIGRhdGFcclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY291bnRFZGdlc09mVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9vbGtpdC5maWx0ZXIoZnVuY3Rpb24ob2JqKSB7IHJldHVybiBvYmoub2JqZWN0VHlwZSA9PSBcIkVkZ2VcIiAmJiBvYmouZGF0YS50eXBlPT09dHlwZTsgfSkuZ2V0RWRnZUNvdW50KClcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgZHVtcEVkZ2VDb3VudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFyZSBcIiArIGNvdW50RWRnZXNPZlR5cGUoXCJyZWxhdGlvbnNoaXBcIikgKyBcIiByZWxhdGlvbnNoaXAgZWRnZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSBhcmUgXCIgKyBjb3VudEVkZ2VzT2ZUeXBlKFwicGVyc3BlY3RpdmVcIikgKyBcIiBwZXJzcGVjdGl2ZSBlZGdlc1wiKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdG9vbGtpdC5iaW5kKFwiZGF0YVVwZGF0ZWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHVtcEVkZ2VDb3VudHMoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZVNhdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihcInJlbGF0aW9uc2hpcEVkZ2VEdW1wXCIsIFwiY2xpY2tcIiwgZHVtcEVkZ2VDb3VudHMoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9DVFJMICsgY2xpY2sgZW5hYmxlcyB0aGUgbGFzc29cclxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oZG9jdW1lbnQsICdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZGVsZXRlQWxsID0gZnVuY3Rpb24oc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RPRE86IGltcGxlbWVudCBsb2dpYyB0byBkZWxldGUgd2hvbGUgZWRnZStwcm94eStlZGdlIHN0cnVjdHVyZVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmVhY2hFZGdlKGZ1bmN0aW9uKGksZSkgeyBjb25zb2xlLmxvZyhlKSB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9SZWN1cnNlIG92ZXIgYWxsIGNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaE5vZGUoZnVuY3Rpb24oaSxuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN1cnNlID0gZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobm9kZSAmJiBub2RlLmRhdGEuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxub2RlLmRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBpKz0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IHRvb2xraXQuZ2V0Tm9kZShub2RlLmRhdGEuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0RlbGV0ZSBjaGlsZHJlbiBiZWZvcmUgcGFyZW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmVOb2RlKG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShuKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnJlbW92ZShzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG1vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgLy9tYXAgYmFja3NwYWNlIHRvIGRlbGV0ZSBpZiBhbnl0aGluZyBpcyBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlID0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHRvb2xraXQuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQ2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQWxsKHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZSA9ICdzZWxlY3QnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5zZXRNb2RlKCdzZWxlY3QnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0NjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0b29sa2l0LmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUFsbChzZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG5cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7XHJcbiIsIi8qKlxyXG4qIEN1c3RvbSBsYXlvdXQgZm9yIG1ldGFtYXAuIEV4dGVuZHMgdGhlIFNwcmluZyBsYXlvdXQuIEFmdGVyIFNwcmluZyBydW5zLCB0aGlzXHJcbiogbGF5b3V0IGZpbmRzICdwYXJ0JyBub2RlcyBhbmQgYWxpZ25zIHRoZW0gdW5kZXJuZWF0aCB0aGVpciBwYXJlbnRzLiBUaGUgYWxpZ25tZW50XHJcbiogLSBsZWZ0IG9yIHJpZ2h0IC0gaXMgc2V0IGluIHRoZSBwYXJlbnQgbm9kZSdzIGRhdGEsIGFzIGBwYXJ0QWxpZ25gLlxyXG4qXHJcbiogTGF5b3V0IGNhbiBiZSBzdXNwZW5kZWQgb24gYSBwZXItbm9kZSBiYXNpcyBieSBzZXR0aW5nIGBzdXNwZW5kTGF5b3V0YCBpbiB0aGUgTm9kZSdzXHJcbiogZGF0YS5cclxuKlxyXG4qIENoaWxkIG5vZGVzXHJcbiovXHJcbjsoZnVuY3Rpb24oKSB7XHJcblxyXG5cdGZ1bmN0aW9uIGNoaWxkTm9kZUNvbXBhcmF0b3IoYzEsIGMyKSB7XHJcblx0XHRpZiAoYzIuZGF0YS5vcmRlciA9PSBudWxsKSByZXR1cm4gLTE7XHJcblx0XHRpZiAoYzEuZGF0YS5vcmRlciA9PSBudWxsKSByZXR1cm4gMTtcclxuXHRcdHJldHVybiBjMS5kYXRhLm9yZGVyIDwgYzIuZGF0YS5vcmRlciA/IC0xIDogMTtcclxuXHR9XHJcblxyXG4gIGpzUGx1bWJUb29sa2l0LkxheW91dHNbXCJtZXRhbWFwXCJdID0gZnVuY3Rpb24oKSB7XHJcbiAgICBqc1BsdW1iVG9vbGtpdC5MYXlvdXRzLlNwcmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHZhciBfb25lU2V0ID0gZnVuY3Rpb24ocGFyZW50LCBwYXJhbXMsIHRvb2xraXQpIHtcclxuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICB2YXIgcGFkZGluZyA9IHBhcmFtcy5wYXJ0UGFkZGluZyB8fCA1O1xyXG4gICAgICBpZiAocGFyZW50LmRhdGEuY2hpbGRyZW4gJiYgcGFyZW50LmRhdGEuc3VzcGVuZExheW91dCAhPT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICB2YXIgYyA9IHBhcmVudC5kYXRhLmNoaWxkcmVuLFxyXG5cdFx0ICBcdGNoaWxkTm9kZXMgPSBfLm1hcCggYywgdG9vbGtpdC5nZXROb2RlICksXHJcbiAgICAgICAgICAgIHBhcmVudFBvcyA9IHRoaXMuZ2V0UG9zaXRpb24ocGFyZW50LmlkKSxcclxuICAgICAgICAgICAgcGFyZW50U2l6ZSA9IHRoaXMuZ2V0U2l6ZShwYXJlbnQuaWQpLFxyXG4gICAgICAgICAgICBtYWduZXRpemVOb2RlcyA9IFsgcGFyZW50LmlkIF0sXHJcbiAgICAgICAgICAgIGFsaWduID0gKHBhcmVudC5kYXRhLnBhcnRBbGlnbiB8fCBcInJpZ2h0XCIpID09PSBcImxlZnRcIiA/IDAgOiAxLFxyXG4gICAgICAgICAgICB5ID0gcGFyZW50UG9zWzFdICsgcGFyZW50U2l6ZVsxXSArIHBhZGRpbmc7XHJcblxyXG5cdFx0Ly8gc29ydCBub2Rlc1xyXG5cdFx0Y2hpbGROb2Rlcy5zb3J0KGNoaWxkTm9kZUNvbXBhcmF0b3IpO1xyXG5cdFx0Ly8gYW5kIHJ1biB0aHJvdWdoIHRoZW0gYW5kIGFzc2lnbiBvcmRlcjsgYW55IHRoYXQgZGlkbid0IHByZXZpb3VzbHkgaGF2ZSBvcmRlciB3aWxsIGdldCBvcmRlclxyXG5cdFx0Ly8gc2V0LCBhbmQgYW55IHRoYXQgaGFkIG9yZGVyIHdpbGwgcmV0YWluIHRoZSBzYW1lIHZhbHVlLlxyXG5cdFx0Xy5lYWNoKGNoaWxkTm9kZXMsIGZ1bmN0aW9uKGNuLCBpKSB7XHJcblx0XHRcdGNuLmRhdGEub3JkZXIgPSBpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBjbiA9IGNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgIGlmKGNuKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGNoaWxkU2l6ZSA9IHRoaXMuZ2V0U2l6ZShjbi5pZCksXHJcbiAgICAgICAgICAgICAgICAgIHggPSBwYXJlbnRQb3NbMF0gKyAoYWxpZ24gKiAocGFyZW50U2l6ZVswXSAtIGNoaWxkU2l6ZVswXSkpO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGNuLmlkLCB4LCB5LCB0cnVlKTtcclxuICAgICAgICAgICAgICBtYWduZXRpemVOb2Rlcy5wdXNoKGNuLmlkKTtcclxuICAgICAgICAgICAgICB5ICs9IChjaGlsZFNpemVbMV0gKyBwYWRkaW5nKTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0fVxyXG5cclxuXHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKTtcclxuXHJcbiAgICAvLyBzdGFzaCBvcmlnaW5hbCBlbmQgY2FsbGJhY2sgYW5kIG92ZXJyaWRlLiBwbGFjZSBhbGwgUGFydCBub2RlcyB3cnQgdGhlaXJcclxuICAgIC8vIHBhcmVudHMsIHRoZW4gY2FsbCBvcmlnaW5hbCBlbmQgY2FsbGJhY2sgYW5kIGZpbmFsbHkgdGVsbCB0aGUgbGF5b3V0XHJcbiAgICAvLyB0byBkcmF3IGl0c2VsZiBhZ2Fpbi5cclxuICAgIHZhciBfc3VwZXJFbmQgPSB0aGlzLmVuZDtcclxuICAgIHRoaXMuZW5kID0gZnVuY3Rpb24odG9vbGtpdCwgcGFyYW1zKSB7XHJcbiAgICAgIHZhciBuYyA9IHRvb2xraXQuZ2V0Tm9kZUNvdW50KCk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmM7IGkrKykge1xyXG4gICAgICAgIHZhciBuID0gdG9vbGtpdC5nZXROb2RlQXQoaSk7XHJcbiAgICAgICAgLy8gb25seSBwcm9jZXNzIG5vZGVzIHRoYXQgYXJlIG5vdCBQYXJ0IG5vZGVzICh0aGVyZSBjb3VsZCBvZiBjb3Vyc2UgYmVcclxuICAgICAgICAvLyBhIG1pbGxpb24gd2F5cyBvZiBkZXRlcm1pbmluZyB3aGF0IGlzIGEgUGFydCBub2RlLi4uaGVyZSBJIGp1c3QgdXNlXHJcbiAgICAgICAgLy8gYSBydWRpbWVudGFyeSBjb25zdHJ1Y3QgaW4gdGhlIGRhdGEpXHJcbiAgICAgICAgaWYgKG4uZGF0YS5wYXJlbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgX29uZVNldChuLCBwYXJhbXMsIHRvb2xraXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgX3N1cGVyRW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgfTtcclxuICB9O1xyXG5cclxufSkoKTtcclxuIiwiY29uc3QgQUNUSU9OUyA9IHtcclxuICAgIE9QRU5fTUFQOiAnbWFwJyxcclxuICAgIE9QRU5fVFJBSU5JTkc6ICdvcGVuX3RyYWluaW5nJyxcclxuICAgIE5FV19NQVA6ICduZXdfbWFwJyxcclxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxyXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxyXG4gICAgSE9NRTogJ2hvbWUnLFxyXG4gICAgTVlfTUFQUzogJ215bWFwcycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcclxuICAgIExPR09VVDogJ2xvZ291dCcsXHJcbiAgICBGRUVEQkFDSzogJ2ZlZWRiYWNrJyxcclxuICAgIFNIQVJFX01BUDogJ3NoYXJlX21hcCcsXHJcbiAgICBDT1VSU0VfTElTVDogJ2NvdXJzZV9saXN0JyxcclxuICAgIFRSQUlOSU5HUzogJ3RyYWluaW5ncydcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQUNUSU9OUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFDVElPTlM7IiwiY29uc3QgQ0FOVkFTID0ge1xyXG4gICAgTEVGVDogJ2xlZnQnLFxyXG4gICAgUklHSFQ6ICdyaWdodCdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQ0FOVkFTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ0FOVkFTOyIsImNvbnN0IENPTlNUQU5UUyA9IHtcclxuXHRBQ1RJT05TOiByZXF1aXJlKCcuL2FjdGlvbnMnKSxcclxuXHRDQU5WQVM6IHJlcXVpcmUoJy4vY2FudmFzJyksXHJcblx0RFNSUDogcmVxdWlyZSgnLi9kc3JwJyksXHJcblx0RURJVF9TVEFUVVM6IHJlcXVpcmUoJy4vZWRpdFN0YXR1cycpLFxyXG5cdEVMRU1FTlRTOiByZXF1aXJlKCcuL2VsZW1lbnRzJyksXHJcbiAgICBFVkVOVFM6IHJlcXVpcmUoJy4vZXZlbnRzJyksXHJcbiAgICBOT1RJRklDQVRJT046IHJlcXVpcmUoJy4vbm90aWZpY2F0aW9uJyksXHJcblx0UEFHRVM6IHJlcXVpcmUoJy4vcGFnZXMnKSxcclxuXHRST1VURVM6IHJlcXVpcmUoJy4vcm91dGVzJyksXHJcblx0VEFCUzogcmVxdWlyZSgnLi90YWJzJyksXHJcblx0VEFHUzogcmVxdWlyZSgnLi90YWdzJylcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoQ09OU1RBTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ09OU1RBTlRTOyIsImNvbnN0IERTUlAgPSB7XHJcblx0RDogJ0QnLFxyXG5cdFM6ICdTJyxcclxuXHRSOiAnUicsXHJcblx0UDogJ1AnXHJcbn1cclxuXHJcbk9iamVjdC5mcmVlemUoRFNSUCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERTUlA7IiwiY29uc3Qgc3RhdHVzID0ge1xyXG4gICAgTEFTVF9VUERBVEVEOiAnJyxcclxuICAgIFJFQURfT05MWTogJ1ZpZXcgb25seScsXHJcbiAgICBTQVZJTkc6ICdTYXZpbmcuLi4nLFxyXG4gICAgU0FWRV9PSzogJ0FsbCBjaGFuZ2VzIHNhdmVkJyxcclxuICAgIFNBVkVfRkFJTEVEOiAnQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQnXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKHN0YXR1cyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXR1czsiLCJjb25zdCBFTEVNRU5UUyA9IHtcclxuICAgIEFQUF9DT05UQUlORVI6ICdhcHAtY29udGFpbmVyJyxcclxuICAgIE1FVEFfUFJPR1JFU1M6ICdtZXRhX3Byb2dyZXNzJyxcclxuICAgIE1FVEFfUFJPR1JFU1NfTkVYVDogJ21ldGFfcHJvZ3Jlc3NfbmV4dCcsXHJcbiAgICBNRVRBX01PREFMX0RJQUxPR19DT05UQUlORVI6ICdtZXRhX21vZGFsX2RpYWxvZ19jb250YWluZXInXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKEVMRU1FTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRUxFTUVOVFM7IiwiY29uc3QgRVZFTlRTID0ge1xyXG5cdFNJREVCQVJfT1BFTjogJ3NpZGViYXItb3BlbicsXHJcblx0U0lERUJBUl9DTE9TRTogJ3NpZGViYXItY2xvc2UnLFxyXG5cdFNJREVCQVJfVE9HR0xFOiAnc2lkZWJhci10b2dnbGUnLFxyXG5cdFBBR0VfTkFNRTogJ3BhZ2VOYW1lJyxcclxuXHROQVY6ICduYXYnLFxyXG5cdE1BUDogJ21hcCdcclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShFVkVOVFMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFVkVOVFM7IiwiY29uc3QgTk9USUZJQ0FUSU9OID0ge1xyXG5cdE1BUDogJ21hcCdcclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShOT1RJRklDQVRJT04pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOT1RJRklDQVRJT047IiwiY29uc3QgQUNUSU9OUyA9IHJlcXVpcmUoJy4vYWN0aW9ucy5qcycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jb25zdCBQQUdFUyA9IHtcclxuICAgIE1BUDogJ21hcCcsXHJcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXHJcbiAgICBDT1BZX01BUDogJ2NvcHlfbWFwJyxcclxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcclxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxyXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICd0ZXJtcycsXHJcbiAgICBIT01FOiAnaG9tZScsXHJcbiAgICBDT1VSU0VfTElTVDogJ2NvdXJzZV9saXN0JyxcclxuICAgIFRSQUlOSU5HUzogJ3RyYWluaW5ncydcclxufTtcclxuXHJcbl8uZXh0ZW5kKClcclxuXHJcbk9iamVjdC5mcmVlemUoUEFHRVMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQQUdFUzsiLCJjb25zdCBST1VURVMgPSB7XHJcbiAgICBNQVBTX0xJU1Q6ICdtYXBzL2xpc3QvJyxcclxuICAgIE1BUFNfREFUQTogJ21hcHMvZGF0YS8nLFxyXG4gICAgTUFQU19ORVdfTUFQOiAnbWFwcy9uZXctbWFwLycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ21ldGFtYXAvdGVybXMtYW5kLWNvbmRpdGlvbnMvJyxcclxuICAgIEhPTUU6ICdtZXRhbWFwL2hvbWUvJyxcclxuICAgIE5PVElGSUNBVElPTlM6ICd1c2Vycy97MH0vbm90aWZpY2F0aW9ucycsXHJcbiAgICBUUkFJTklOR1M6ICd1c2Vycy97MH0vdHJhaW5pbmdzLycsXHJcbiAgICBDT1VSU0VfTElTVDogJ3RyYWluaW5ncy9jb3Vyc2VzLydcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoUk9VVEVTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUk9VVEVTOyIsImNvbnN0IFRBQlMgPSB7XHJcbiAgICBUQUJfSURfUFJFU0VOVEVSIDogJ3ByZXNlbnRlci10YWInLFxyXG4gICAgVEFCX0lEX0FOQUxZVElDU19NQVAgOiAnYW5hbHl0aWNzLXRhYi1tYXAnLFxyXG4gICAgVEFCX0lEX0FOQUxZVElDU19USElORyA6ICdhbmFseXRpY3MtdGFiLXRoaW5nJyxcclxuICAgIFRBQl9JRF9QRVJTUEVDVElWRVMgOiAncGVyc3BlY3RpdmVzLXRhYicsXHJcbiAgICBUQUJfSURfRElTVElOQ1RJT05TIDogJ2Rpc3RpbmN0aW9ucy10YWInLFxyXG4gICAgVEFCX0lEX0FUVEFDSE1FTlRTIDogJ2F0dGFjaG1lbnRzLXRhYicsXHJcbiAgICBUQUJfSURfR0VORVJBVE9SIDogJ2dlbmVyYXRvci10YWInLFxyXG4gICAgVEFCX0lEX1NUQU5EQVJEUyA6ICdzdGFuZGFyZHMtdGFiJ1xyXG59O1xyXG5PYmplY3QuZnJlZXplKFRBQlMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUQUJTOyIsImNvbnN0IFRBR1MgPSB7XHJcbiAgICBNRVRBX0NBTlZBUzogJ21ldGEtY2FudmFzJyxcclxuICAgIEhPTUU6ICdob21lJyxcclxuICAgIFRFUk1TOiAndGVybXMnLFxyXG4gICAgTVlfTUFQUzogJ215LW1hcHMnLFxyXG4gICAgU0hBUkU6ICdzaGFyZScsXHJcbiAgICBDT1VSU0VfTElTVDogJ2NvdXJzZV9saXN0JyxcclxuICAgIFRSQUlOSU5HOiAndHJhaW5pbmcnLFxyXG4gICAgQUxMX0NPVVJTRVM6ICdhbGwtY291cnNlcycsXHJcbiAgICBNWV9DT1VSU0VTOiAnbXktY291cnNlcycsXHJcbiAgICBTSURFQkFSOiAncXVpY2stc2lkZWJhcidcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoVEFHUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRBR1M7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgQWRkVGhpcyBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICAgICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XHJcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcclxuICAgICAgICAgICAgICAgIHQgPSB3aW5kb3cuYWRkdGhpcyB8fCB7fTtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcclxuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XHJcbiAgICAgICAgICAgIGpzLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIGpzLnNyYyA9IGAvL3M3LmFkZHRoaXMuY29tL2pzLzMwMC9hZGR0aGlzX3dpZGdldC5qcyNwdWJpZD0ke2NvbmZpZy5wdWJpZH1gO1xyXG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcblxyXG4gICAgICAgICAgICB0Ll9lID0gW107XHJcbiAgICAgICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xyXG4gICAgICAgICAgICAgICAgdC5fZS5wdXNoKGYpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwiYWRkLXRoaXMtanNcIikpO1xyXG4gICAgICAgIHRoaXMuYWRkdGhpcyA9IHdpbmRvdy5hZGR0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5hZGR0aGlzID0gdGhpcy5hZGR0aGlzIHx8IHdpbmRvdy5hZGR0aGlzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFkZFRoaXM7XHJcblxyXG5cclxuIiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgR29vZ2xlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XHJcbiAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XHJcbiAgICAgIGxldCBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvLCBzKTtcclxuICAgIH0pKCk7XHJcbiAgICAgIFxyXG4gICAgLy9Hb29nbGUgVGFnIE1hbmFnZXIgQVBJXHJcbiAgICAoZnVuY3Rpb24gKHcsIGQsIHMsIGwsIGkpIHtcclxuICAgICAgd1tsXSA9IHdbbF0gfHwgW107IHdbbF0ucHVzaCh7XHJcbiAgICAgICAgJ2d0bS5zdGFydCc6XHJcbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xyXG4gICAgICB9KTsgbGV0IGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxyXG4gICAgICAgICcvL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndG0uanM/aWQ9JyArIGkgKyBkbDsgZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLCBmKTtcclxuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgdGhpcy5jb25maWcudGFnbWFuYWdlcik7XHJcblxyXG4gICAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XHJcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIChpW3JdLnEgPSBpW3JdLnEgfHwgW10pLnB1c2goYXJndW1lbnRzKTtcclxuICAgICAgfSwgaVtyXS5sID0gMSAqIG5ldyBEYXRlKCk7IGEgPSBzLmNyZWF0ZUVsZW1lbnQobyksXHJcbiAgICAgIG0gPSBzLmdldEVsZW1lbnRzQnlUYWdOYW1lKG8pWzBdOyBhLmFzeW5jID0gMTsgYS5zcmMgPSBnO1xyXG4gICAgICBtLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsIG0pO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICB0aGlzLmdhID0gdGhpcy5nYSB8fCB3aW5kb3cuZ2E7XHJcbiAgICByZXR1cm4gdGhpcy5nYTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBzdXBlci5pbml0KCk7XHJcbiAgICBsZXQgbW9kZSA9ICdhdXRvJztcclxuICAgIGxldCBkb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgIGlmKGRvbWFpbi5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xyXG4gICAgICBtb2RlID0gJ25vbmUnO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignY3JlYXRlJywgdGhpcy5jb25maWcuYW5hbHl0aWNzLCBtb2RlKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICB9XHJcblxyXG4gIHNldFVzZXIoKSB7XHJcbiAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCAndXNlcklkJywgdGhpcy51c2VyLnVzZXJJZCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsIG5ldHdvcmssIHR5cGUsIHRhcmdldFVybCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XHJcbiAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgIGlmIChzb3VyY2UgJiYgdHlwZSkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB2YWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgdmFsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsIHtcclxuICAgICAgICAgICAgcGFnZTogcGF0aFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kRXZlbnQoZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKSB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGU7XHJcblxyXG5cclxuIiwiXHJcbmNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcclxuY29uc3QgR29vZ2xlID0gcmVxdWlyZSgnLi9nb29nbGUnKTtcclxuXHJcbmNsYXNzIFVzZXJTbmFwIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgICAgIGxldCBhcGlLZXksIHMsIHg7XHJcbiAgICAgICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZyA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBhcGlLZXkgPSBjb25maWcuYXBpO1xyXG4gICAgICAgIGlmIChhcGlLZXkgJiYgIXdpbmRvdy5sb2NhdGlvbi5ob3N0LnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XHJcbiAgICAgICAgICAgIGxldCB1c0NvbmYgPSB7XHJcbiAgICAgICAgICAgICAgICBlbWFpbEJveDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtYWlsQm94VmFsdWU6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICAgICAgICBlbWFpbFJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uc29sZVJlY29yZGVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbW9kZTogJ3JlcG9ydCcsXHJcbiAgICAgICAgICAgICAgICBzaG9ydGN1dDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBHb29nbGUuc2VuZEV2ZW50KCdmZWVkYmFjaycsICd1c2Vyc25hcCcsICd3aWRnZXQnLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHdpbmRvdy51c2Vyc25hcGNvbmZpZyA9IHdpbmRvdy5fdXNlcnNuYXBjb25maWcgPSB1c0NvbmY7XHJcblxyXG4gICAgICAgICAgICBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgICAgICBzLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICAgICAgcy5zcmMgPSAnLy9hcGkudXNlcnNuYXAuY29tL2xvYWQvJyArIGFwaUtleSArICcuanMnO1xyXG4gICAgICAgICAgICB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcclxuICAgICAgICAgICAgeC5hcHBlbmRDaGlsZChzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHdpbmRvdy5Vc2VyU25hcDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHRoaXMudXNlclNuYXAgfHwgd2luZG93LlVzZXJTbmFwO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJTbmFwO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFVzZXIoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0VXNlcigpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXNlclNuYXA7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgWW91VHViZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcclxuICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuXHJcbiAgICB0YWcuc3JjID0gXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9pZnJhbWVfYXBpXCI7XHJcbiAgICB2YXIgZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XHJcbiAgICBmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YWcsIGZpcnN0U2NyaXB0VGFnKTtcclxuICAgIHdpbmRvdy5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLllUID0gd2luZG93LllUXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICB0aGlzLllUID0gdGhpcy5ZVCB8fCB3aW5kb3cuWVQ7XHJcbiAgICByZXR1cm4gdGhpcy5ZVDtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBzdXBlci5pbml0KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgc2V0VXNlcigpIHtcclxuICAgIHN1cGVyLnNldFVzZXIoKTtcclxuXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcclxuXHJcbiAgfVxyXG5cclxuICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XHJcbiAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcclxuXHJcbiAgfVxyXG5cclxuICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gWW91VHViZTtcclxuXHJcblxyXG4iLCJjbGFzcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuXHRjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuXHRcdHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG5cdFx0dGhpcy51c2VyID0gdXNlcjtcclxuXHR9XHJcblx0XHJcblx0aW5pdCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRnZXQgaW50ZWdyYXRpb24oKSB7XHJcblx0XHRyZXR1cm4ge307XHJcblx0fVxyXG5cdFxyXG5cdHNldFVzZXIoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0c2VuZEV2ZW50KCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZVBhdGgoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0bG9nb3V0KCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVncmF0aW9uc0Jhc2U7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5cclxuY2xhc3MgR29vZ2xlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XHJcbiAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XHJcbiAgICAgIGxldCBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvLCBzKTtcclxuICAgIH0pKCk7XHJcbiAgICAgIFxyXG4gICAgLy9Hb29nbGUgVGFnIE1hbmFnZXIgQVBJXHJcbiAgICAoZnVuY3Rpb24gKHcsIGQsIHMsIGwsIGkpIHtcclxuICAgICAgd1tsXSA9IHdbbF0gfHwgW107IHdbbF0ucHVzaCh7XHJcbiAgICAgICAgJ2d0bS5zdGFydCc6XHJcbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xyXG4gICAgICB9KTsgbGV0IGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxyXG4gICAgICAgICcvL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndG0uanM/aWQ9JyArIGkgKyBkbDsgZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLCBmKTtcclxuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgdGhpcy5jb25maWcudGFnbWFuYWdlcik7XHJcblxyXG4gICAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XHJcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIChpW3JdLnEgPSBpW3JdLnEgfHwgW10pLnB1c2goYXJndW1lbnRzKTtcclxuICAgICAgfSwgaVtyXS5sID0gMSAqIG5ldyBEYXRlKCk7IGEgPSBzLmNyZWF0ZUVsZW1lbnQobyksXHJcbiAgICAgIG0gPSBzLmdldEVsZW1lbnRzQnlUYWdOYW1lKG8pWzBdOyBhLmFzeW5jID0gMTsgYS5zcmMgPSBnO1xyXG4gICAgICBtLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsIG0pO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXQgaW50ZWdyYXRpb24oKSB7XHJcbiAgICB0aGlzLmdhID0gdGhpcy5nYSB8fCB3aW5kb3cuZ2E7XHJcbiAgICByZXR1cm4gdGhpcy5nYTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBzdXBlci5pbml0KCk7XHJcbiAgICBsZXQgbW9kZSA9ICdhdXRvJztcclxuICAgIGxldCBkb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcclxuICAgIGlmKGRvbWFpbi5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xyXG4gICAgICBtb2RlID0gJ25vbmUnO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignY3JlYXRlJywgdGhpcy5jb25maWcuYW5hbHl0aWNzLCBtb2RlKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICB9XHJcblxyXG4gIHNldFVzZXIoKSB7XHJcbiAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCAndXNlcklkJywgdGhpcy51c2VyLnVzZXJJZCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsIG5ldHdvcmssIHR5cGUsIHRhcmdldFVybCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XHJcbiAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgIGlmIChzb3VyY2UgJiYgdHlwZSkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB2YWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgdmFsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICB1cGRhdGVQYXRoKHBhdGgpIHtcclxuICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsIHtcclxuICAgICAgICAgICAgcGFnZTogcGF0aFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kRXZlbnQoZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKSB7XHJcbiAgICBpZiAod2luZG93LmdhKSB7XHJcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGU7XHJcblxyXG5cclxuIiwiY29uc3QgcmlvdCA9IHdpbmRvdy5yaW90XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3NcclxuY29uc3QgcGFnZUJvZHkgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2UtYm9keS5qcycpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5jb25zdCBBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9BY3Rpb24uanMnKVxyXG5jb25zdCBNZXRyb25pYyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL21ldHJvbmljJylcclxuY29uc3QgTGF5b3V0ID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvbGF5b3V0JylcclxuY29uc3QgRGVtbyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL2RlbW8nKVxyXG5cclxuY2xhc3MgUGFnZUZhY3Rvcnkge1xyXG4gICAgY29uc3RydWN0b3IoZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBuZXcgQWN0aW9ucyhtZXRhRmlyZSwgZXZlbnRlciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTfWApLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudCgnKicpO1xyXG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmNvbmZpZ3VyZSh7IHBhcmVudDogYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTX05FWFR9YCB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0KCk7IC8vIGluaXQgbWV0cm9uaWMgY29yZSBjb21wb25ldHNcclxuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdCgpOyAvLyBpbml0IGxheW91dFxyXG4gICAgICAgICAgICAgICAgICAgIERlbW8uaW5pdCgpOyAvLyBpbml0IGRlbW8gZmVhdHVyZXNcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMjUwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlKHBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcykge1xyXG4gICAgICAgIGxldCBhY3QgPSB0aGlzLmFjdGlvbnMuYWN0KHBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgaWYgKCFhY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKHBhdGgsIHBhdGgsIHsgaWQ6IGlkLCBhY3Rpb246IGFjdGlvbiB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWdlRmFjdG9yeTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3NcclxuY29uc3QgQ2FudmFzID0gcmVxdWlyZSgnLi4vLi4vY2FudmFzL2NhbnZhcycpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuL25vZGUnKVxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBvcnRsZXQgbGlnaHQganRrLWRlbW8tbWFpblwiIHN0eWxlPVwicGFkZGluZzogMDsgXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwianRrLWRlbW8tY2FudmFzIGNhbnZhcy13aWRlXCIgaWQ9XCJkaWFncmFtXCI+XHJcblxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbWV0YS1jYW52YXMnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLm1hcElkID0gbnVsbDtcclxuICAgIHRoaXMuY2FudmFzID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmJ1aWxkQ2FudmFzID0gKG1hcCkgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5jYW52YXMpIHtcclxuICAgICAgICAgICAgJCh0aGlzLmRpYWdyYW0pLmVtcHR5KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXMobWFwLCB0aGlzLm1hcElkKTtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuaW5pdCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtYXAuY2hhbmdlZF9ieSAhPSBNZXRhTWFwLlVzZXIudXNlcktleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuaW5pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWlsZCA9IChvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKG9wdHMuaWQgIT0gdGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG51bGxcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub2ZmKGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubWFwSWQgPSBvcHRzLmlkO1xyXG4gICAgICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYG1hcHMvZGF0YS8ke29wdHMuaWR9YCwgdGhpcy5idWlsZENhbnZhcyk7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuRXZlbnRlci5mb3JnZXQoQ09OU1RBTlRTLkVWRU5UUy5NQVAsIHRoaXMuYnVpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIuZXZlcnkoQ09OU1RBTlRTLkVWRU5UUy5NQVAsIHRoaXMuYnVpbGQpO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcclxuICAgICAgICAkKHRoaXMuZGlhZ3JhbSkuY3NzKHtcclxuICAgICAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxMjAgKyAncHgnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY29ycmVjdEhlaWdodCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi4vLi4vY2FudmFzL2NhbnZhcycpO1xyXG5cclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbmBcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ25vZGUnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuY29uc3QgUHMgPSByZXF1aXJlKCdwZXJmZWN0LXNjcm9sbGJhcicpO1xyXG5cclxuY29uc3QgTWV0cm9uaWMgPSByZXF1aXJlKCcuLi8uLi90ZW1wbGF0ZS9tZXRyb25pYycpXHJcbmNvbnN0IHJhdyA9IHJlcXVpcmUoJy4vcmF3Jyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgVHJhaW5pbmdNaXggPSByZXF1aXJlKCcuLi9taXhpbnMvdHJhaW5pbmctbWl4JylcclxuXHJcbmNvbnN0IGh0bWwgPVxyXG5cdGBcclxuPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdi1qdXN0aWZpZWRcIj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdi10YWJzIG5hdi1qdXN0aWZpZWRcIj5cclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjcXVpY2tfc2lkZWJhcl90YWJfMVwiIGRhdGEtdG9nZ2xlPVwidGFiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgQ29ydGV4IE1hblxyXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNxdWlja19zaWRlYmFyX3RhYl8yXCIgZGF0YS10b2dnbGU9XCJ0YWJcIj5cclxuICAgICAgICAgICAgICAgICAgICBPdXRsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLXBhbmUgYWN0aXZlIHBhZ2UtcXVpY2stc2lkZWJhci1jaGF0IHBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIiBpZD1cInF1aWNrX3NpZGViYXJfdGFiXzFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnNcIiBkYXRhLXJhaWwtY29sb3I9XCIjZGRkXCIgZGF0YS13cmFwcGVyLWNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyLW1lc3NhZ2VzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB1c2VyVHJhaW5pbmcubWVzc2FnZXMgfVwiIGNsYXNzPVwicG9zdCB7IG91dDogYXV0aG9yID09ICdjb3J0ZXgnLCBpbjogYXV0aG9yICE9ICdjb3J0ZXgnIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cImF2YXRhclwiIGFsdD1cIlwiIHNyYz1cInsgYXV0aG9yID09ICdjb3J0ZXgnID8gcGFyZW50LmNvcnRleFBpY3R1cmUgOiBwYXJlbnQudXNlclBpY3R1cmUgfVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXJyb3dcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJuYW1lXCI+eyBuYW1lIH08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRhdGV0aW1lXCI+eyBwYXJlbnQuZ2V0UmVsYXRpdmVUaW1lKHRpbWUpIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgbWVzc2FnZSB9XCI+PC9yYXc+IDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyLWZvcm1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImNoYXRfaW5wdXRfZm9ybVwiIG9uc3VibWl0PVwieyBvblN1Ym1pdCB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY2hhdF9pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cIlR5cGUgYSBtZXNzYWdlIGhlcmUuLi5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBibHVlXCI+PGkgY2xhc3M9XCJmYSBmYS1wYXBlcmNsaXBcIj48L2k+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLXBhbmUgcGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0c1wiIGlkPVwicXVpY2tfc2lkZWJhcl90YWJfMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItYWxlcnRzLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwibGlzdC1oZWFkaW5nXCI+SW50cm88L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsaXN0LWhlYWRpbmdcIj5TZWN0aW9uIDE8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gXHJcblxyXG4vLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgdG9nZ2xlclxyXG52YXIgaGFuZGxlUXVpY2tTaWRlYmFyVG9nZ2xlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIHF1aWNrIHNpZGViYXIgdG9nZ2xlclxyXG4gICAgJCgnLnBhZ2UtaGVhZGVyIC5xdWljay1zaWRlYmFyLXRvZ2dsZXIsIC5wYWdlLXF1aWNrLXNpZGViYXItdG9nZ2xlcicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdwYWdlLXF1aWNrLXNpZGViYXItb3BlbicpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgY2hhdHNcclxudmFyIGhhbmRsZVF1aWNrU2lkZWJhckNoYXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgd3JhcHBlciA9ICQoJy5wYWdlLXF1aWNrLXNpZGViYXItd3JhcHBlcicpO1xyXG4gICAgdmFyIHdyYXBwZXJDaGF0ID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQnKTtcclxuXHJcbiAgICB2YXIgaW5pdENoYXRTbGltU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjaGF0VXNlcnMgPSB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VycycpO1xyXG4gICAgICAgIHZhciBjaGF0VXNlcnNIZWlnaHQ7XHJcblxyXG4gICAgICAgIGNoYXRVc2Vyc0hlaWdodCA9IHdyYXBwZXIuaGVpZ2h0KCkgLSB3cmFwcGVyLmZpbmQoJy5uYXYtanVzdGlmaWVkID4gLm5hdi10YWJzJykub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgLy8gY2hhdCB1c2VyIGxpc3RcclxuICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChjaGF0VXNlcnMpO1xyXG4gICAgICAgIGNoYXRVc2Vycy5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgY2hhdFVzZXJzSGVpZ2h0KTtcclxuICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbChjaGF0VXNlcnMpO1xyXG5cclxuICAgICAgICB2YXIgY2hhdE1lc3NhZ2VzID0gd3JhcHBlckNoYXQuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItbWVzc2FnZXMnKTtcclxuICAgICAgICB2YXIgY2hhdE1lc3NhZ2VzSGVpZ2h0ID0gY2hhdFVzZXJzSGVpZ2h0IC0gd3JhcHBlckNoYXQuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItZm9ybScpLm91dGVySGVpZ2h0KCkgLSB3cmFwcGVyQ2hhdC5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLW5hdicpLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIC8vIHVzZXIgY2hhdCBtZXNzYWdlc1xyXG4gICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKGNoYXRNZXNzYWdlcyk7XHJcbiAgICAgICAgY2hhdE1lc3NhZ2VzLmF0dHIoXCJkYXRhLWhlaWdodFwiLCBjaGF0TWVzc2FnZXNIZWlnaHQpO1xyXG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGNoYXRNZXNzYWdlcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIGluaXRDaGF0U2xpbVNjcm9sbCgpO1xyXG4gICAgTWV0cm9uaWMuYWRkUmVzaXplSGFuZGxlcihpbml0Q2hhdFNsaW1TY3JvbGwpOyAvLyByZWluaXRpYWxpemUgb24gd2luZG93IHJlc2l6ZVxyXG5cclxuICAgIHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJzIC5tZWRpYS1saXN0ID4gLm1lZGlhJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdyYXBwZXJDaGF0LmFkZENsYXNzKFwicGFnZS1xdWljay1zaWRlYmFyLWNvbnRlbnQtaXRlbS1zaG93blwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXIgLnBhZ2UtcXVpY2stc2lkZWJhci1iYWNrLXRvLWxpc3QnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd3JhcHBlckNoYXQucmVtb3ZlQ2xhc3MoXCJwYWdlLXF1aWNrLXNpZGViYXItY29udGVudC1pdGVtLXNob3duXCIpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgdGFza3NcclxudmFyIGhhbmRsZVF1aWNrU2lkZWJhckFsZXJ0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB3cmFwcGVyID0gJCgnLnBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyJyk7XHJcbiAgICB2YXIgd3JhcHBlckFsZXJ0cyA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1hbGVydHMnKTtcclxuXHJcbiAgICB2YXIgaW5pdEFsZXJ0c1NsaW1TY3JvbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFsZXJ0TGlzdCA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1hbGVydHMtbGlzdCcpO1xyXG4gICAgICAgIHZhciBhbGVydExpc3RIZWlnaHQ7XHJcblxyXG4gICAgICAgIGFsZXJ0TGlzdEhlaWdodCA9IHdyYXBwZXIuaGVpZ2h0KCkgLSB3cmFwcGVyLmZpbmQoJy5uYXYtanVzdGlmaWVkID4gLm5hdi10YWJzJykub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgLy8gYWxlcnRzIGxpc3RcclxuICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChhbGVydExpc3QpO1xyXG4gICAgICAgIGFsZXJ0TGlzdC5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgYWxlcnRMaXN0SGVpZ2h0KTtcclxuICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbChhbGVydExpc3QpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpbml0QWxlcnRzU2xpbVNjcm9sbCgpO1xyXG4gICAgTWV0cm9uaWMuYWRkUmVzaXplSGFuZGxlcihpbml0QWxlcnRzU2xpbVNjcm9sbCk7IC8vIHJlaW5pdGlhbGl6ZSBvbiB3aW5kb3cgcmVzaXplXHJcbn07XHJcblxyXG5yaW90LnRhZyhDT05TVEFOVFMuVEFHUy5TSURFQkFSLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgdGhpcy5taXhpbihUcmFpbmluZ01peClcclxuXHJcblx0Y29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLnVzZXJQaWN0dXJlID0gJydcclxuXHJcblx0dGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyVG9nZ2xlcigpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyB0b2dnbGVyXHJcbiAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyQ2hhdCgpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyBjaGF0c1xyXG4gICAgICAgIGhhbmRsZVF1aWNrU2lkZWJhckFsZXJ0cygpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyBhbGVydHNcclxuXHRcdHRoaXMudXNlclBpY3R1cmUgPSBNZXRhTWFwLlVzZXIucGljdHVyZVxyXG5cdH0pO1xyXG5cclxuXHR0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XHJcblx0XHRpZiAoIXRoaXMuZGlzcGxheSkge1xyXG5cdFx0XHRyZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7JztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiAnJztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXMuZ2V0UmVsYXRpdmVUaW1lID0gKGRhdGUgPSBuZXcgRGF0ZSgpKSA9PiB7XHJcblx0XHRyZXR1cm4gbW9tZW50KGRhdGUpLmZyb21Ob3coKTtcclxuXHR9XHJcblxyXG5cdHRoaXMub25TdWJtaXQgPSAob2JqKSA9PiB7XHJcblx0XHR0aGlzLnVzZXJUcmFpbmluZy5tZXNzYWdlcy5wdXNoKHtcclxuXHRcdFx0bWVzc2FnZTogdGhpcy5jaGF0X2lucHV0LnZhbHVlLFxyXG5cdFx0XHR0aW1lOiBuZXcgRGF0ZSgpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5zYXZlVHJhaW5pbmcodGhpcy50cmFpbmluZ0lkKVxyXG5cdFx0dGhpcy5jaGF0X2lucHV0LnZhbHVlID0gJydcclxuXHRcdHRoaXMudXBkYXRlKClcclxuXHR9XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncGFnZS1xdWljay1zaWRlYmFyLW9wZW4nKVxyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoaWQpID0+IHtcclxuICAgICAgICB0aGlzLnRyYWluaW5nSWQgPSBpZFxyXG4gICAgICAgIHRoaXMuZ2V0RGF0YShpZClcclxuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3BhZ2UtcXVpY2stc2lkZWJhci1vcGVuJylcclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdyYXcnLCAnPHNwYW4+PC9zcGFuPicsIGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IChvcHRzKSA/IChvcHRzLmNvbnRlbnQgfHwgJycpIDogJyc7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgndHlwZWFoZWFkLmpzJylcclxucmVxdWlyZSgnYm9vdHN0cmFwLXNlbGVjdCcpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxucmVxdWlyZSgnLi4vLi4vdG9vbHMvc2hpbXMnKTtcclxuY29uc3QgU2hhcmluZyA9IHJlcXVpcmUoJy4uLy4uL2FwcC9TaGFyaW5nJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgaWQ9XCJzaGFyZV9tb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxhIGlkPVwic2hhcmVfcHVibGljX2xpbmtcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0OyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jbGlwYm9hcmQtdGV4dD1cInt3aW5kb3cubG9jYXRpb24uaG9zdCsnLycrd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKycvbWFwcy8nK29wdHMubWFwLmlkfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgZ2V0UHVibGljTGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdldCBzaGFyYWJsZSBsaW5rICA8aSBjbGFzcz1cImZhIGZhLWxpbmtcIj48L2k+PC9hPlxyXG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5TaGFyZSB3aXRoIG90aGVyczwvaDQ+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPHA+UGVvcGxlPC9wPlxyXG4gICAgICAgICAgICAgICAgPGZvcm0gcm9sZT1cImZvcm1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzaGFyZV90eXBlYWhlYWRcIiBjbGFzcz1cImNvbC1tZC04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7XCIgaWQ9XCJzaGFyZV9pbnB1dFwiIGNsYXNzPVwidHlwZWFoZWFkIGZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJFbnRlciBuYW1lcyBvciBlbWFpbCBhZGRyZXNzZXMuLi5cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJzaGFyZV9wZXJtaXNzaW9uXCIgY2xhc3M9XCJzZWxlY3RwaWNrZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyZWFkXCIgZGF0YS1jb250ZW50PVwiPHNwYW4+PGkgY2xhc3M9J2ZhIGZhLWV5ZSc+PC9pPiBDYW4gdmlldzwvc3Bhbj5cIj5DYW4gdmlldzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIndyaXRlXCIgZGF0YS1jb250ZW50PVwiPHNwYW4+PGkgY2xhc3M9J2ZhIGZhLXBlbmNpbCc+PC9pPiBDYW4gZWRpdDwvc3Bhbj5cIj5DYW4gZWRpdDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWQ9XCJzaGFyZV9idXR0b25cIiBjbGFzcz1cImJ0biBidG4taWNvbi1vbmx5IGdyZWVuXCIgb25jbGljaz1cInsgb25TaGFyZSB9XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZj1cInsgb3B0cyAmJiBvcHRzLm1hcCAmJiBvcHRzLm1hcC5zaGFyZWRfd2l0aH1cIiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJsYWJlbCBsYWJlbC1kZWZhdWx0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cIm1hcmdpbi1yaWdodDogNXB4O1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWY9XCJ7IGkgIT0gJ2FkbWluJyAmJiAodmFsLndyaXRlIHx8IHZhbC5yZWFkKSB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBpLCB2YWwgaW4gb3B0cy5tYXAuc2hhcmVkX3dpdGh9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgaWY9XCJ7IHZhbC53cml0ZSB9XCIgY2xhc3M9XCJmYSBmYS1wZW5jaWxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgaWY9XCJ7ICF2YWwud3JpdGUgfVwiIGNsYXNzPVwiZmEgZmEtZXllXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdmFsLm5hbWUgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZmEgZmEtdGltZXMtY2lyY2xlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uVW5TaGFyZSB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+RG9uZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3NoYXJlJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpXHJcbiAgICBjb25zdCBzaGFyZSA9IG5ldyBTaGFyaW5nKE1ldGFNYXAuVXNlcilcclxuXHJcbiAgICB0aGlzLmRhdGEgPSBbXTtcclxuXHJcbiAgICB0aGlzLmdldFB1YmxpY0xpbmsgPSAoZSwgb3B0cykgPT4ge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25TaGFyZSA9IChlLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLnN1Z2dlc3Rpb24uaWRdID0ge1xyXG4gICAgICAgICAgICByZWFkOiB0aGlzLnBpY2tlci52YWwoKSA9PSAncmVhZCcgfHwgdGhpcy5waWNrZXIudmFsKCkgPT0gJ3dyaXRlJyxcclxuICAgICAgICAgICAgd3JpdGU6IHRoaXMucGlja2VyLnZhbCgpID09ICd3cml0ZScsXHJcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuc3VnZ2VzdGlvbi5uYW1lLFxyXG4gICAgICAgICAgICBwaWN0dXJlOiB0aGlzLnN1Z2dlc3Rpb24ucGljdHVyZVxyXG4gICAgICAgIH1cclxuICAgICAgICBzaGFyZS5hZGRTaGFyZSh0aGlzLm9wdHMubWFwLCB0aGlzLnN1Z2dlc3Rpb24sIHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5zdWdnZXN0aW9uLmlkXSlcclxuXHJcbiAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gbnVsbFxyXG4gICAgICAgIHRoaXMudGEudHlwZWFoZWFkKCd2YWwnLCAnJylcclxuICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5oaWRlKClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uVW5TaGFyZSA9IChlLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgZS5pdGVtLnZhbC5pZCA9IGUuaXRlbS5pXHJcbiAgICAgICAgZGVsZXRlIHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGhbZS5pdGVtLmldXHJcbiAgICAgICAgc2hhcmUucmVtb3ZlU2hhcmUodGhpcy5vcHRzLm1hcCwgZS5pdGVtLnZhbClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAob3B0cykgPT4ge1xyXG4gICAgICAgIGlmIChvcHRzKSB7XHJcbiAgICAgICAgICAgIF8uZXh0ZW5kKHRoaXMub3B0cywgb3B0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsIChlLCBvcHRzKSA9PiB7XHJcbiAgICAgICAgJCh0aGlzLnNoYXJlX21vZGFsKS5tb2RhbCgnc2hvdycpXHJcbiAgICAgICAgdGhpcy50YSA9ICQoJyNzaGFyZV90eXBlYWhlYWQgLnR5cGVhaGVhZCcpLnR5cGVhaGVhZCh7XHJcbiAgICAgICAgICAgIGhpZ2hsaWdodDogdHJ1ZVxyXG4gICAgICAgIH0se1xyXG4gICAgICAgICAgICBzb3VyY2U6IChxdWVyeSwgc3luY01ldGhvZCwgYXN5bmNNZXRob2QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS5tZXRhbWFwLmNvL3VzZXJzL2ZpbmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VySWQ6IE1ldGFNYXAuVXNlci51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25JZDogTWV0YU1hcC5NZXRhRmlyZS5maXJlYmFzZV90b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRVc2VyczogXy5rZXlzKHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IHF1ZXJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICcqJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6ICdzcmMvaW1hZ2VzL3dvcmxkLWdsb2JlLmpwZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUHVibGljJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luY01ldGhvZChkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmoubmFtZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICBlbXB0eTogW1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJwYWRkaW5nOiA1cHggMTBweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ1VuYWJsZSB0byBmaW5kIGFueSB1c2VycyBtYXRjaGluZyB0aGlzIHF1ZXJ5JyxcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICBdLmpvaW4oJ1xcbicpLFxyXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbjogKHZhbHVlKSA9PiB7IHJldHVybiBgPGRpdj48aW1nIGFsdD1cIiR7dmFsdWUubmFtZX1cIiBoZWlnaHQ9XCIzMFwiIHdpZHRoPVwiMzBcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCIke3ZhbHVlLnBpY3R1cmV9XCI+ICR7dmFsdWUubmFtZX08L2Rpdj5gIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50YS5vbigndHlwZWFoZWFkOnNlbGVjdCcsIChldiwgc3VnZ2VzdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXHJcbiAgICAgICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLnNob3coKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50YS5vbigndHlwZWFoZWFkOmF1dG9jb21wbGV0ZScsIChldiwgc3VnZ2VzdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXHJcbiAgICAgICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLnNob3coKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5waWNrZXIgPSAkKCcuc2VsZWN0cGlja2VyJykuc2VsZWN0cGlja2VyKHtcclxuICAgICAgICAgICAgd2lkdGg6ICdhdXRvJ1xyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdyYWR1YXRpb24tY2FwXCI+PC9pPlxyXG4gICAgICAgIDwvYT5cclxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNzBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IGhlbHAgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGhlbHAgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1oZWxwJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oZWxwID0gbnVsbDtcclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvaGVscCcsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVscCA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuLi8uLi90b29scy9zaGltcycpXHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIlxyXG4gICAgICAgICAgICAgICAgIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCJcclxuICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcclxuICAgICAgICAgICAgICAgICBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIlxyXG4gICAgICAgICAgICAgICAgIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtYmVsbC1vXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2Utc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IG5vdGlmaWNhdGlvbnMubGVuZ3RoIH1cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3MgPVwiYm9sZFwiPnsgbm90aWZpY2F0aW9ucy5sZW5ndGggfSBwZW5kaW5nPC9zcGFuPiBub3RpZmljYXRpb257IHM6IG5vdGlmaWNhdGlvbnMubGVuZ3RoID09IDAgfHwgbm90aWZpY2F0aW9ucy5sZW5ndGggPiAxIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWY9XCJ7IGFsbE5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPnZpZXcgYWxsPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IHRydWUgIT0gYXJjaGl2ZWQgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgdmFsLCBpIGluIG5vdGlmaWNhdGlvbnMgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZj1cInsgdmFsLnBob3RvICE9IG51bGwgfVwiIGNsYXNzPVwicGhvdG9cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cInt2YWwucGhvdG99XCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgYWx0PVwiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzdWJqZWN0XCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJmcm9tXCI+eyB2YWwuZnJvbSB9PC9zcGFuPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwidGltZVwiIHN0eWxlPVwicGFkZGluZzogMDtcIj57IHBhcmVudC5nZXRUaW1lKHZhbC50aW1lKSB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWVzc2FnZVwiPnsgdmFsLmV2ZW50IH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuYDtcclxuXHJcbnJpb3QudGFnKCdtZXRhLW5vdGlmaWNhdGlvbnMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICBjb25zdCBmYlBhdGggPSBDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KE1ldGFNYXAuVXNlci51c2VySWQpXHJcblxyXG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gW107XHJcbiAgICB0aGlzLmFsbE5vdGlmaWNhdGlvbnMgPSBbXTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGxldCBpdGVtID0gZXZlbnQuaXRlbS52YWxcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEodHJ1ZSwgYCR7ZmJQYXRofS8ke2l0ZW0uaWR9L2FyY2hpdmVgKVxyXG4gICAgICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLk5PVElGSUNBVElPTi5NQVA6XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgbWFwLyR7aXRlbS5tYXBJZH1gKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldFRpbWUgPSAodGltZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBtb21lbnQobmV3IERhdGUodGltZSkpLmZyb21Ob3coKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0RGF0YShmYlBhdGgpXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6ICdZb3Ugc2lnbmVkIHVwIGZvciBNZXRhTWFwIScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IGAke25ldyBEYXRlKCkgfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY2hpdmU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZmJQYXRoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KE1ldGFNYXAuVXNlci51c2VySWQpLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsTm90aWZpY2F0aW9ucyA9IF8ubWFwKGRhdGEsIChuLCBpZCkgPT4geyBuLmlkID0gaWQ7IHJldHVybiBuOyAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gXy5maWx0ZXIoXy5zb3J0QnkodGhpcy5hbGxOb3RpZmljYXRpb25zLCAnZGF0ZScpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBwb2ludHMubGVuZ3RoIH1cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3MgPVwiYm9sZFwiPnsgcG9pbnRzLmxlbmd0aCB9IG5ldyA8L3NwYW4+IGFjaGlldmVtZW50eyBzOiBwb2ludHMubGVuZ3RoID09IDAgfHwgcG9pbnRzLmxlbmd0aCA+IDEgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+dmlldyBhbGw8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNTBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgcG9pbnRzIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IHBvaW50cyB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVcIj57IHRpbWUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkZXRhaWxzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxhYmVsIGxhYmVsLXNtIGxhYmVsLWljb24gbGFiZWwtc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZXZlbnQgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuYDtcclxuXHJcbnJpb3QudGFnKCdtZXRhLXBvaW50cycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIHRoaXMucG9pbnRzID0gW107XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGB1c2Vycy8ke01ldGFNYXAuVXNlci51c2VySWR9L3BvaW50c2AsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxyXG5cclxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1c2VybmFtZSB1c2VybmFtZS1oaWRlLW9uLW1vYmlsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHVzZXJuYW1lIH1cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPGltZyBpZj1cInsgcGljdHVyZSB9XCIgYWx0PVwiXCIgaGVpZ2h0PVwiMzlcIiB3aWR0aD1cIjM5XCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwieyBwaWN0dXJlIH1cIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBkcm9wZG93bi1tZW51LWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IG1lbnUgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IG1lbnUgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtdXNlcicsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLm1lbnUgPSBbXTtcclxuICAgIHRoaXMudXNlcm5hbWUgPSAnJztcclxuICAgIHRoaXMucGljdHVyZSA9ICcnO1xyXG5cclxuICAgIHRoaXMubG9nb3V0ID0gKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAubG9nb3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5saW5rQWNjb3VudCA9ICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLkF1dGgwLmxpbmtBY2NvdW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICBzd2l0Y2goZXZlbnQuaXRlbS5saW5rKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJyNsaW5rLXNvY2lhbC1hY2NvdW50cyc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmtBY2NvdW50KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYG1ldGFtYXAvdXNlcmAsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBNZXRhTWFwLlVzZXIuZGlzcGxheU5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMucGljdHVyZSA9IE1ldGFNYXAuVXNlci5waWN0dXJlO1xyXG4gICAgICAgICAgICB0aGlzLm1lbnUgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3NcclxuXHJcbmxldCBUcmFpbmluZ01peCA9IHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKVxyXG4gICAgfSxcclxuXHJcbiAgICB1c2VyVHJhaW5pbmc6IHsgbWVzc2FnZXM6IFtdIH0sXHJcbiAgICB0cmFpbmluZzoge30sXHJcblxyXG4gICAgc2F2ZVRyYWluaW5nOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHRoaXMuTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHRoaXMudXNlclRyYWluaW5nLCBgJHtDT05TVEFOVFMuUk9VVEVTLlRSQUlOSU5HUy5mb3JtYXQodGhpcy5NZXRhTWFwLlVzZXIudXNlcklkKX0ke2lkfWApXHJcbiAgICB9LFxyXG5cclxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgICAgICAgICB0aGlzLl9vbmNlR2V0RGF0YSA9IHRoaXMuX29uY2VHZXREYXRhIHx8IF8ub25jZShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG9uY2UgPSBfLm9uY2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuTWV0YU1hcC5NZXRhRmlyZS5vbihgJHtDT05TVEFOVFMuUk9VVEVTLlRSQUlOSU5HUy5mb3JtYXQodGhhdC5NZXRhTWFwLlVzZXIudXNlcklkKSB9JHtpZH1gLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVzZXJUcmFpbmluZyA9IGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVzZXJUcmFpbmluZyA9IHRoYXQudHJhaW5pbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2F2ZVRyYWluaW5nKGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC51c2VyVHJhaW5pbmcubWVzc2FnZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXNlclRyYWluaW5nLm1lc3NhZ2VzID0gW3RoYXQuZ2V0RGVmYXVsdE1lc3NhZ2UoKV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNhdmVUcmFpbmluZyhpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuTWV0YU1hcC5FdmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCBpZCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGF0Lk1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5DT1VSU0VfTElTVH0ke2lkfWAsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50cmFpbmluZyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5NZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9uY2UoKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vbmNlR2V0RGF0YSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtZXNzYWdlczogW10sXHJcblxyXG4gICAgY29ydGV4UGljdHVyZTogJ3NyYy9pbWFnZXMvY29ydGV4LWF2YXRhci1zbWFsbC5qcGcnLFxyXG5cclxuICAgIGdldERlZmF1bHRNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYEhlbGxvLCBJJ20gQ29ydGV4IE1hbi4gQXNrIG1lIGFueXRoaW5nLiBUcnkgPGNvZGU+L2hlbHA8L2NvZGU+IGlmIHlvdSBnZXQgbG9zdC5gLFxyXG4gICAgICAgICAgICBhdXRob3I6ICdjb3J0ZXgnLFxyXG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG5cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVHJhaW5pbmdNaXgiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5yZXF1aXJlKCcuLi90b29scy9zaGltcycpO1xyXG5jb25zdCBQZXJtaXNzaW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9QZXJtaXNzaW9ucycpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwicGFnZV9hY3Rpb25zXCIgY2xhc3M9XCJwYWdlLWFjdGlvbnNcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biByZWQtaGF6ZSBidG4tc20gZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImhpZGRlbi1zbSBoaWRkZW4teHNcIj5BY3Rpb25zJm5ic3A7PC9zcGFuPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XHJcbiAgICAgICAgICAgIDxsaSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YSB9XCIgY2xhc3M9XCJ7IHN0YXJ0OiBpID09IDAsIGFjdGl2ZTogaSA9PSAwIH1cIj5cclxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBwYXJlbnQuZ2V0TGlua0FsbG93ZWQodmFsKSB9XCIgaHJlZj1cInsgcGFyZW50LmdldEFjdGlvbkxpbmsodmFsKSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIj48L2k+IHsgdmFsLnRpdGxlIH1cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+XHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjc2V0dGluZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdlYXJcIj48L2k+IFNldHRpbmdzXHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxzcGFuIHN0eWxlPVwicGFkZGluZy1sZWZ0OiA1cHg7XCI+XHJcbiAgICAgICAgPHNwYW4gaWY9XCJ7IHBhZ2VOYW1lIH1cIlxyXG4gICAgICAgICAgICAgICAgaWQ9XCJtYXBfbmFtZVwiXHJcbiAgICAgICAgICAgICAgICBkYXRhLXR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgIGRhdGEtdGl0bGU9XCJFbnRlciBtYXAgbmFtZVwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+XHJcbiAgICAgICAgICAgIHsgcGFnZU5hbWUgfVxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgIDwvc3Bhbj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWFjdGlvbnMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB0aGlzLnBhZ2VOYW1lID0gJ0hvbWUnO1xyXG4gICAgdGhpcy51cmwgPSBNZXRhTWFwLmNvbmZpZy5zaXRlLmRiICsgJy5maXJlYmFzZWlvLmNvbSc7XHJcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBwZXJtaXNzaW9ucyA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5nZXRBY3Rpb25MaW5rID0gKG9iaikgPT4ge1xyXG4gICAgICAgIGxldCByZXQgPSBvYmoubGluaztcclxuICAgICAgICBpZiAob2JqLnVybF9wYXJhbXMpIHtcclxuICAgICAgICAgICAgbGV0IGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgXy5lYWNoKG9iai51cmxfcGFyYW1zLCAocHJtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2godGhpc1twcm0ubmFtZV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0ID0gb2JqLmxpbmsuZm9ybWF0LmNhbGwob2JqLmxpbmssIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0TGlua0FsbG93ZWQgPSAob2JqKSA9PiB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bJyonXTtcclxuICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFBhZ2UgPSBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aDtcclxuICAgICAgICAgICAgcmV0ID0gdHJ1ZSA9PSBvYmpbJ2FsbG93ZWQtb24nXVtjdXJyZW50UGFnZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXQgJiYgdGhpcy5tYXAgJiYgcGVybWlzc2lvbnMpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChvYmoudGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1NoYXJlIE1hcCc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICdEZWxldGUgTWFwJzpcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSBwZXJtaXNzaW9ucy5pc01hcE93bmVyKClcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlUGFnZU5hbWUgPSAobWFwKSA9PiB7XHJcbiAgICAgICAgcGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMobWFwKVxyXG4gICAgICAgIHRoaXMubWFwID0gbWFwIHx8IHt9XHJcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmlzTWFwT3duZXIoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbWFwLm5hbWUgfHwgJydcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbWFwLm5hbWUgKyAnIChTaGFyZWQgYnkgJyArIG1hcC5vd25lci5uYW1lICsgJyknXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwZXJtaXNzaW9ucyAmJiBwZXJtaXNzaW9ucy5pc01hcE93bmVyKCkpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfS9uYW1lYCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIuZXZlcnkoJ3BhZ2VOYW1lJywgKG9wdHMpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5sb2FkZWQpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9mZihgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfWApO1xyXG4gICAgICAgICAgICB0aGlzLm1hcElkID0gbnVsbFxyXG4gICAgICAgICAgICB0aGlzLm1hcCA9IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdHMuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7b3B0cy5pZH1gLCAobWFwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VOYW1lKG1hcClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFnZU5hbWUgPSBvcHRzLm5hbWUgfHwgJ0hvbWUnO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2FjdGlvbnMnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5wYWdlX2FjdGlvbnMpLmNzcyh7ICdwYWRkaW5nLWxlZnQnOiAnMCcgfSlcclxuICAgIH0pO1xyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5wYWdlX2FjdGlvbnMpLmNzcyh7ICdwYWRkaW5nLWxlZnQnOiAnNzBweCcgfSlcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZUhlYWRlciA9IHJlcXVpcmUoJy4vcGFnZS1oZWFkZXInKTtcclxuY29uc3QgcGFnZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vcGFnZS1jb250YWluZXInKTtcclxuY29uc3QgcGFnZUZvb3RlciA9IHJlcXVpcmUoJy4vcGFnZS1mb290ZXInKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cInBhZ2VfYm9keVwiIGNsYXNzPVwicGFnZS1oZWFkZXItZml4ZWQgcGFnZS1zaWRlYmFyLXJldmVyc2VkXCI+XHJcblxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9oZWFkZXJcIj48L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfY29udGFpbmVyXCI+PC9kaXY+XHJcblxyXG48L2Rpdj5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1ib2R5JywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXIgfHwgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9oZWFkZXIsICdwYWdlLWhlYWRlcicpWzBdO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5jb250YWluZXIgfHwgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250YWluZXIsICdwYWdlLWNvbnRhaW5lcicpWzBdO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBwYWdlQ29udGVudCA9IHJlcXVpcmUoJy4vcGFnZS1jb250ZW50Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1jb250YWluZXJcIj5cclxuXHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2NvbnRlbnRcIj48L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvbnRhaW5lcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQgfHwgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250ZW50LCAncGFnZS1jb250ZW50JylbMF07XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9xdWljay1zaWRlYmFyJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRlbnQtd3JhcHBlclwiPlxyXG4gICAgPGRpdiBpZD1cInBhZ2UtY29udGVudFwiIGNsYXNzPVwicGFnZS1jb250ZW50XCI+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWhlYWRcIj48L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cImFwcC1jb250YWluZXJcIj48L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cInF1aWNrX3NpZGViYXJfY29udGFpbmVyXCI+PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvbnRlbnQnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2lkZWJhciA9IHRoaXMuc2lkZWJhciB8fCByaW90Lm1vdW50KHRoaXMucXVpY2tfc2lkZWJhcl9jb250YWluZXIsICdxdWljay1zaWRlYmFyJylbMF1cclxuICAgICAgICB0aGlzLnJlc2l6ZSgpXHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMucmVzaXplID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCB3aWR0aCA9IGAke3dpbmRvdy5pbm5lcldpZHRoIC0gNDB9cHhgO1xyXG4gICAgICAgICQodGhpc1snYXBwLWNvbnRhaW5lciddKS5jc3MoeyB3aWR0aDogd2lkdGggfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2UtZm9vdGVyXCIgc3R5bGU9XCJwb3NpdGlvbjogZml4ZWQ7IGJvdHRvbTogMDtcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwYWdlLWZvb3Rlci1pbm5lclwiPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjdGVybXNcIj4mY29weTsyMDE1PC9hPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1mb290ZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZUxvZ28gPSByZXF1aXJlKCcuL3BhZ2UtbG9nby5qcycpO1xyXG5jb25zdCBwYWdlQWN0aW9ucyA9IHJlcXVpcmUoJy4vcGFnZS1hY3Rpb25zLmpzJyk7XHJcbmNvbnN0IHBhZ2VTZWFyY2ggPSByZXF1aXJlKCcuL3BhZ2Utc2VhcmNoLmpzJyk7XHJcbmNvbnN0IHBhZ2VUb3BNZW51ID0gcmVxdWlyZSgnLi9wYWdlLXRvcG1lbnUnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgaWQ9XCJoZWFkZXItdG9wXCIgY2xhc3M9XCJwYWdlLWhlYWRlciBuYXZiYXIgbmF2YmFyLWZpeGVkLXRvcFwiPlxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcHJvZ3Jlc3NfbmV4dFwiIHN0eWxlPVwib3ZlcmZsb3c6IGluaGVyaXQ7XCI+PC9kaXY+XHJcbiAgICA8ZGl2IGlkPVwiaGVhZGVyLWNvbnRlbnRcIiBjbGFzcz1cInBhZ2UtaGVhZGVyLWlubmVyXCI+XHJcblxyXG4gICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfbG9nb1wiPjwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2FjdGlvbnNcIj48L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV90b3BcIiBjbGFzcz1cInBhZ2UtdG9wXCI+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2Vfc2VhcmNoXCI+PC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcG1lbnVcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICA8L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1oZWFkZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2dvID0gdGhpcy5sb2dvIHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfbG9nbywgJ3BhZ2UtbG9nbycpWzBdO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IHRoaXMuYWN0aW9ucyB8fCByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2FjdGlvbnMsICdwYWdlLWFjdGlvbnMnKVswXTtcclxuICAgICAgICB0aGlzLnNlYXJjaCA9IHRoaXMuc2VhcmNoIHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfdG9wLCAncGFnZS1zZWFyY2gnKVswXTtcclxuICAgICAgICB0aGlzLnRvcG1lbnUgPSB0aGlzLnRvcG1lbnUgfHwgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV90b3AsICdwYWdlLXRvcG1lbnUnKVswXTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcyA9XCJwYWdlLWxvZ29cIj5cclxuICAgIDxhIGlkPVwibWV0YV9sb2dvXCIgaHJlZj1cIiNob21lXCI+XHJcbiAgICAgICAgPGltZyBzcmM9XCJzcmMvaW1hZ2VzL21ldGFtYXBfY2xvdWQucG5nXCIgYWx0PVwibG9nb1wiIGNsYXNzID1cImxvZ28tZGVmYXVsdFwiIC8+XHJcbiAgICA8L2E+XHJcblxyXG4gICAgPGRpdiBpZD1cIm1ldGFfbWVudV90b2dnbGVcIiBjbGFzcz1cIm1lbnUtdG9nZ2xlciBzaWRlYmFyLXRvZ2dsZXIgcXVpY2stc2lkZWJhci10b2dnbGVyXCIgb25jbGljaz1cInsgb25DbGljayB9XCIgc3R5bGU9XCJ2aXNpYmlsaXR5OnsgZ2V0RGlzcGxheSgpIH07XCI+XHJcbiAgICAgICAgPCEtLURPQzogUmVtb3ZlIHRoZSBhYm92ZSBcImhpZGVcIiB0byBlbmFibGUgdGhlIHNpZGViYXIgdG9nZ2xlciBidXR0b24gb24gaGVhZGVyLS0+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbjxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcyA9XCJtZW51LXRvZ2dsZXIgcmVzcG9uc2l2ZS10b2dnbGVyXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1jb2xsYXBzZVwiPlxyXG48L2E+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWxvZ28nLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLmlzU2lkZWJhck9wZW4gPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgdG9nZ2xlID0gKHN0YXRlKSA9PiB7XHJcbiAgICAgICAgaWYodGhpcy5pc1NpZGViYXJPcGVuICE9IHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaWRlYmFyT3BlbiA9IHN0YXRlXHJcbiAgICAgICAgICAgICQodGhpcy5tZXRhX21lbnVfdG9nZ2xlKS5jbGljaygpXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAvLyBNZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX1RPR0dMRSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXREaXNwbGF5ID0gKGVsKSA9PiB7XHJcbiAgICAgICAgaWYoTWV0YU1hcCAmJiBNZXRhTWFwLlJvdXRlciAmJiBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aCA9PSBDT05TVEFOVFMuUEFHRVMuVFJBSU5JTkdTKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZSh0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm4gJ3Zpc2libGUnXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICdoaWRkZW4nXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgncGFnZU5hbWUnLCAob3B0cykgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH0pXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48IS0tIERPQzogQXBwbHkgXCJzZWFyY2gtZm9ybS1leHBhbmRlZFwiIHJpZ2h0IGFmdGVyIHRoZSBcInNlYXJjaC1mb3JtXCIgY2xhc3MgdG8gaGF2ZSBoYWxmIGV4cGFuZGVkIHNlYXJjaCBib3ggLS0+XHJcbjxmb3JtIGNsYXNzPVwic2VhcmNoLWZvcm1cIiBhY3Rpb249XCJleHRyYV9zZWFyY2guaHRtbFwiIG1ldGhvZD1cIkdFVFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIiBwbGFjZWhvbGRlcj1cIlNlYXJjaC4uLlwiIG5hbWU9XCJxdWVyeVwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiYnRuIHN1Ym1pdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbjwvZm9ybT5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2Utc2VhcmNoJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxyXG5cclxuY29uc3QgbWV0YVBvaW50cyA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLXBvaW50cy5qcycpO1xyXG5jb25zdCBtZXRhSGVscCA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLWhlbHAuanMnKTtcclxuY29uc3QgbWV0YVVzZXIgPSByZXF1aXJlKCcuL21lbnUvbWV0YS11c2VyLmpzJyk7XHJcbmNvbnN0IG1ldGFOb3QgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1ub3RpZmljYXRpb25zLmpzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwidG9wLW1lbnVcIj5cclxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IHB1bGwtcmlnaHRcIj5cclxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIiBpZD1cImhlYWRlcl9kYXNoYm9hcmRfYmFyXCIgb25jbGljaz1cInsgb25DbGljayB9XCI+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgaHJlZj1cIiNob21lXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWhvbWVcIj48L2k+XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2xpPlxyXG5cclxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfbm90aWZpY2F0aW9uX2JhclwiPjwvbGk+XHJcblxyXG5gXHJcbiAgICAgICAgICAgIC8vIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cclxuICAgICAgICAgICAgLy8gPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfcG9pbnRzX2JhclwiPjwvbGk+XHJcbisgYFxyXG5cclxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XHJcbiAgICAgICAgPGxpIGlkPVwiaGVhZGVyX2hlbHBfYmFyXCIgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIj48L2xpPlxyXG5cclxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XHJcbiAgICAgICAgPGxpIGlkPVwiaGVhZGVyX3VzZXJfbWVudVwiIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tdXNlciBkcm9wZG93blwiPjwvbGk+XHJcbiAgICA8L3VsPlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtdG9wbWVudScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIC8vVE9ETzogcmVzdG9yZSBub3RpZmljYXRpb25zIHdoZW4gbG9naWMgaXMgY29tcGxldGVcclxuICAgICAgICAvL3Jpb3QubW91bnQodGhpcy5oZWFkZXJfcG9pbnRzX2JhciwgJ21ldGEtcG9pbnRzJyk7XHJcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zPXRoaXMubm90aWZpY2F0aW9ucyB8fCByaW90Lm1vdW50KHRoaXMuaGVhZGVyX25vdGlmaWNhdGlvbl9iYXIsICdtZXRhLW5vdGlmaWNhdGlvbnMnKTtcclxuICAgICAgICB0aGlzLmhlbHA9dGhpcy5oZWxwIHx8IHJpb3QubW91bnQodGhpcy5oZWFkZXJfaGVscF9iYXIsICdtZXRhLWhlbHAnKTtcclxuICAgICAgICB0aGlzLnVzZXI9dGhpcy51c2VyIHx8IHJpb3QubW91bnQodGhpcy5oZWFkZXJfdXNlcl9tZW51LCAnbWV0YS11c2VyJyk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzJylcclxucmVxdWlyZSgnZGF0YXRhYmxlcy1ib290c3RyYXAzLXBsdWdpbicpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKVxyXG5yZXF1aXJlKCcuLi90YWJsZXMvYWxsLWNvdXJzZXMnKVxyXG5yZXF1aXJlKCcuLi90YWJsZXMvbXktY291cnNlcycpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwibXlfY291cnNlc19wYWdlXCIgY2xhc3M9XCJwb3J0bGV0IGJveCBncmV5LWNhc2NhZGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LXRpdGxlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1pY29uLXRoLWxhcmdlXCI+PC9pPkNvdXJzZXNcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGlmPVwieyBtZW51IH1cIiBjbGFzcz1cImFjdGlvbnNcIj5cclxuICAgICAgICAgICAgPGEgZWFjaD1cInsgbWVudS5idXR0b25zIH1cIiBocmVmPVwieyBsaW5rIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25BY3Rpb25DbGljayB9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDo7XCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY29nc1wiPjwvaT4gVG9vbHMgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lbnUubWVudSB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uTWVudUNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBwb3J0bGV0LXRhYnNcIj5cclxuICAgICAgICAgICAgPGxpIG9uY2xpY2s9XCJ7IHBhcmVudC5vblRhYlN3aXRjaCB9XCIgZWFjaD1cInsgdmFsLCBpIGluIHRhYnMgfVwiIGNsYXNzPVwieyBhY3RpdmU6IGkgPT0gMCB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI215Y291cnNlc18xX3sgaSB9XCIgZGF0YS10b2dnbGU9XCJ0YWJcIiBhcmlhLWV4cGFuZGVkPVwieyB0cnVlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgeyB2YWwudGl0bGUgfTwvYT5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS10b29sYmFyXCI+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInRhYi1wYW5lIGZhc2UgaW4geyBhY3RpdmU6IGkgPT0gMCB9XCIgaWQ9XCJteWNvdXJzZXNfMV97IGkgfVwiPlxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKENPTlNUQU5UUy5UQUdTLkNPVVJTRV9MSVNULCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcblxyXG4gICAgdGhpcy51c2VyID0gTWV0YU1hcC5Vc2VyO1xyXG4gICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB0aGlzLm1lbnUgPSBudWxsO1xyXG4gICAgbGV0IHRhYnMgPSBbXHJcbiAgICAgICAgeyB0aXRsZTogJ015IFRyYWluaW5ncycsIG9yZGVyOiAwLCBlZGl0YWJsZTogdHJ1ZSwgY29sdW1uczogW3sgbmFtZTogJ0NoZWNrJywgaXNDaGVja2JveDogdHJ1ZSB9LCB7IG5hbWU6ICdBY3Rpb24nIH0sIHsgbmFtZTogJ0NyZWF0ZWQgT24nIH0sIHsgbmFtZTogJ1N0YXR1cycgfV0gfSxcclxuICAgICAgICB7IHRpdGxlOiAnQWxsIFRyYWluaW5ncycsIG9yZGVyOiAxLCBlZGl0YWJsZTogZmFsc2UsIGNvbHVtbnM6IFt7IG5hbWU6ICdBY3Rpb24nIH0sIHsgbmFtZTogJ0NyZWF0ZWQgT24nIH0sIHsgbmFtZTogJ093bmVyJyB9XSB9XHJcbiAgICBdO1xyXG4gICAgdGhpcy50YWJzID0gXy5zb3J0QnkodGFicywgJ29yZGVyJylcclxuXHJcbiAgICB0aGlzLmN1cnJlbnRUYWIgPSAnTXkgVHJhaW5pbmdzJztcclxuXHJcbiAgICAvL0V2ZW50c1xyXG4gICAgdGhpcy5vbk9wZW4gPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgbWFwLyR7ZXZlbnQuaXRlbS5pZH1gKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uVGFiU3dpdGNoID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VGFiID0gZXZlbnQuaXRlbS52YWwudGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sb2FkVGFibGUgPSAodGl0bGUsIGkpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXNbYG15Y291cnNlc18xXyR7aX1gXVxyXG4gICAgICAgICAgICBsZXQgdGFnID0gbnVsbDtcclxuICAgICAgICAgICAgc3dpdGNoICh0aXRsZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnQWxsIFRyYWluaW5ncyc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gQ09OU1RBTlRTLlRBR1MuQUxMX0NPVVJTRVNcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ015IFRyYWluaW5ncyc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gQ09OU1RBTlRTLlRBR1MuTVlfQ09VUlNFU1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub2RlICYmIHRhZykge1xyXG4gICAgICAgICAgICAgICAgdGhpc1t0aXRsZV0gPSB0aGlzW3RpdGxlXSB8fCByaW90Lm1vdW50KG5vZGUsIHRhZylbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzW3RpdGxlXS51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgTWV0YU1hcC5lcnJvcihlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9SaW90IGJpbmRpbmdzXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICBfLmVhY2godGhpcy50YWJzLCAodmFsLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFRhYmxlKHZhbC50aXRsZSwgaSlcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdyBtYXJnaW4tYm90dG9tLTMwXCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPnsgaGVhZGVyLnRpdGxlIH08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8bGkgZWFjaD1cInsgYXJlYXMgfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0XHRcdFx0PCEtLSBCbG9ja3F1b3RlcyAtLT5cclxuXHRcdFx0XHRcdFx0XHQ8YmxvY2txdW90ZSBjbGFzcz1cImhlcm9cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwPnsgcXVvdGUudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNtYWxsPnsgcXVvdGUuYnkgfTwvc21hbGw+XHJcblx0XHRcdFx0XHRcdFx0PC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkZHRoaXNfaG9yaXpvbnRhbF9mb2xsb3dfdG9vbGJveFwiPjwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcyA9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpZnJhbWUgaWY9XCJ7IGhlYWRlci55b3V0dWJlaWQgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ5dHBsYXllclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHQvaHRtbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQveyBoZWFkZXIueW91dHViZWlkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzID1cImZpdHZpZHNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiaGVpZ2h0OiAzMjdweDsgd2lkdGg6IDEwMCU7IGRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tbGVmdDogYXV0bzsgbWFyZ2luLXJpZ2h0OiBhdXRvOyBicm9kZXI6IDA7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcblx0XHRcdFx0XHRcdFx0PC9pZnJhbWU+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRsaW5lXCI+XHJcblx0XHRcdFx0XHRcdDxoMz57IHVzZXJOYW1lIH17IHZpc2lvbi50aXRsZSB9PC9oMz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgdmlzaW9uLnRleHQgfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdob21lJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5hcmVhcyA9IFtdXHJcbiAgICB0aGlzLmhlYWRlciA9IHt9XHJcblxyXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLkhPTUUsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuYXJlYXMsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnF1b3RlID0gZGF0YS5xdW90ZTtcclxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xyXG4gICAgICAgIHRoaXMudmlzaW9uID0gZGF0YS52aXNpb247XHJcblxyXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2RhdGF0YWJsZXMnKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcclxuY29uc3QgU2hhcmVNYXAgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL1NoYXJlTWFwJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgaWQ9XCJteV9tYXBzX3BhZ2VcIiBjbGFzcz1cInBvcnRsZXQgYm94IGdyZXktY2FzY2FkZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtdGl0bGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tdGgtbGFyZ2VcIj48L2k+TWV0YU1hcHNcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGlmPVwieyBtZW51IH1cIiBjbGFzcz1cImFjdGlvbnNcIj5cclxuICAgICAgICAgICAgPGEgZWFjaD1cInsgbWVudS5idXR0b25zIH1cIiBocmVmPVwieyBsaW5rIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25BY3Rpb25DbGljayB9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDo7XCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY29nc1wiPjwvaT4gVG9vbHMgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lbnUubWVudSB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uTWVudUNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBwb3J0bGV0LXRhYnNcIj5cclxuICAgICAgICAgICAgPGxpIG9uY2xpY2s9XCJ7IHBhcmVudC5vblRhYlN3aXRjaCB9XCIgZWFjaD1cInsgdmFsLCBpIGluIHRhYnMgfVwiIGNsYXNzPVwieyBhY3RpdmU6IGkgPT0gMCB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI215bWFwc18xX3sgaSB9XCIgZGF0YS10b2dnbGU9XCJ0YWJcIiBhcmlhLWV4cGFuZGVkPVwieyB0cnVlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgeyB2YWwudGl0bGUgfTwvYT5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS10b29sYmFyXCI+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInRhYi1wYW5lIGZhc2UgaW4geyBhY3RpdmU6IGkgPT0gMCB9XCIgaWQ9XCJteW1hcHNfMV97IGkgfVwiPlxyXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlclwiIGlkPVwibXltYXBzX3RhYmxlX3sgaSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJ0YWJsZS1jaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJncm91cC1jaGVja2FibGVcIiBkYXRhLXNldD1cIiNteW1hcHNfdGFibGVfeyBpIH0gLmNoZWNrYm94ZXNcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZWQgT25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE93bmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgaWY9XCJ7IHBhcmVudC5kYXRhICYmIHBhcmVudC5kYXRhW2ldIH1cIiBlYWNoPVwieyBwYXJlbnQuZGF0YVtpXSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIHx8IHBhcmVudC51c2VyLmlzQWRtaW4gfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hlc1wiIHZhbHVlPVwiMVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc20gYmx1ZSBmaWx0ZXItc3VibWl0XCIgb25jbGljaz1cInsgcGFyZW50Lm9uT3BlbiB9XCI+T3BlbjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIH1cIiBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uU2hhcmUgfVwiPlNoYXJlIDxpIGNsYXNzPVwiZmEgZmEtc2hhcmVcIj48L2k+PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIiBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uQ29weSB9XCI+Q29weSA8aSBjbGFzcz1cImZhIGZhLWNsb25lXCI+PC9pPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IGVkaXRhYmxlIH1cIiBjbGFzcz1cIm1ldGFfZWRpdGFibGVfeyBpIH1cIiBkYXRhLXBrPVwieyBpZCB9XCIgZGF0YS10aXRsZT1cIkVkaXQgTWFwIE5hbWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyAhZWRpdGFibGUgfVwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj57IG5hbWUgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgY3JlYXRlZF9hdCB9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhdyBjb250ZW50PVwieyBwYXJlbnQuZ2V0U3RhdHVzKHRoaXMpIH1cIj48L3Jhdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgcGFyZW50LmdldE93bmVyKHRoaXMpIH1cIj48L3Jhdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbXktbWFwcycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLnVzZXIgPSBNZXRhTWFwLlVzZXI7XHJcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgdGhpcy5tZW51ID0gbnVsbDtcclxuICAgIGxldCB0YWJzID0gW1xyXG4gICAgICAgIHsgdGl0bGU6ICdNeSBNYXBzJywgb3JkZXI6IDAsIGVkaXRhYmxlOiB0cnVlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQ2hlY2snLCBpc0NoZWNrYm94OiB0cnVlIH0sIHsgbmFtZTogJ0FjdGlvbicgfSwgeyBuYW1lOiAnQ3JlYXRlZCBPbicgfSwgeyBuYW1lOiAnU3RhdHVzJyB9XSB9LFxyXG4gICAgICAgIHsgdGl0bGU6ICdTaGFyZWQgd2l0aCBNZScsIG9yZGVyOiAxLCBlZGl0YWJsZTogZmFsc2UsIGNvbHVtbnM6IFt7IG5hbWU6ICdBY3Rpb24nIH0sIHsgbmFtZTogJ0NyZWF0ZWQgT24nIH0sIHsgbmFtZTogJ093bmVyJyB9XSB9LFxyXG4gICAgICAgIHsgdGl0bGU6ICdQdWJsaWMnLCBvcmRlcjogMiwgZWRpdGFibGU6IGZhbHNlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdPd25lcicgfV0gfVxyXG4gICAgXTtcclxuICAgIGlmICh0aGlzLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICAgIHRhYnMucHVzaCh7IHRpdGxlOiAnQWxsIE1hcHMnLCBvcmRlcjogMywgZWRpdGFibGU6IHRydWUsIGNvbHVtbnM6IFt7IG5hbWU6ICdBY3Rpb24nIH0sIHsgbmFtZTogJ0NyZWF0ZWQgT24nIH0sIHsgbmFtZTogJ093bmVyJyB9XSB9KVxyXG4gICAgICAgIHRhYnMucHVzaCh7IHRpdGxlOiAnVGVtcGxhdGVzJywgb3JkZXI6IDQsIGVkaXRhYmxlOiB0cnVlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdPd25lcicgfV0gfSlcclxuICAgIH1cclxuICAgIHRoaXMudGFicyA9IF8uc29ydEJ5KHRhYnMsICdvcmRlcicpXHJcblxyXG4gICAgdGhpcy5jdXJyZW50VGFiID0gJ015IE1hcHMnO1xyXG5cclxuICAgIC8vXHJcbiAgICB0aGlzLmdldFN0YXR1cyA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgbGV0IHN0YXR1cyA9ICdQcml2YXRlJ1xyXG4gICAgICAgIGxldCBjb2RlID0gJ2RlZmF1bHQnXHJcbiAgICAgICAgbGV0IGh0bWwgPSAnJztcclxuICAgICAgICBpZiAoaXRlbS5zaGFyZWRfd2l0aCkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5zaGFyZWRfd2l0aFsnKiddICYmIChpdGVtLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlIHx8IGl0ZW0uc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ1B1YmxpYydcclxuICAgICAgICAgICAgICAgIGNvZGUgPSAncHJpbWFyeSdcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChpdGVtLnNoYXJlZF93aXRoLCAoc2hhcmUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGFyZS5waWN0dXJlICYmIGtleSAhPSAnKicgJiYga2V5ICE9ICdhZG1pbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJsYWJlbCBvd25lci1sYWJlbFwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtcGxhY2VtZW50PVwiYm90dG9tXCIgdGl0bGU9XCIke3NoYXJlLm5hbWV9XCI+PGltZyBhbHQ9XCIke3NoYXJlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtzaGFyZS5waWN0dXJlfVwiPjwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGlmIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9ICc8c3BhbiBjbGFzcz1cIlwiPlNoYXJlZCB3aXRoOiA8L3NwYW4+JyArIGh0bWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaHRtbCA9IGh0bWwgfHwgYDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtJHtjb2RlfVwiPiR7c3RhdHVzfTwvc3Bhbj5gXHJcblxyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0T3duZXIgPSAoaXRlbSkgPT4ge1xyXG4gICAgICAgIGxldCBodG1sID0gYDxzcGFuIGNsYXNzPVwibGFiZWwgb3duZXItbGFiZWxcIiBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIiBkYXRhLXBsYWNlbWVudD1cImJvdHRvbVwiIHRpdGxlPVwiJHtpdGVtLm93bmVyLm5hbWV9XCI+PGltZyBhbHQ9XCIke2l0ZW0ub3duZXIubmFtZX1cIiBoZWlnaHQ9XCIzMFwiIHdpZHRoPVwiMzBcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCIke2l0ZW0ub3duZXIucGljdHVyZX1cIj48L3NwYW4+YFxyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIC8vRXZlbnRzXHJcbiAgICB0aGlzLm9uT3BlbiA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHtldmVudC5pdGVtLmlkfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25TaGFyZSA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIGxldCBvcHRzID0ge1xyXG4gICAgICAgICAgICBtYXA6IGV2ZW50Lml0ZW1cclxuICAgICAgICB9XHJcbiAgICAgICAgU2hhcmVNYXAuYWN0KG9wdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25Db3B5ID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NvcHknKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25UYWJTd2l0Y2ggPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUYWIgPSBldmVudC5pdGVtLnZhbC50aXRsZTtcclxuICAgICAgICAgXy5kZWxheSgoKSA9PiB7XHJcbiAgICAgICAgICAgICQoJy5vd25lci1sYWJlbCcpLnRvb2x0aXAoKVxyXG4gICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRUYWIpIHtcclxuICAgICAgICAgICAgY2FzZSAnTXkgTWFwcyc6XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25BY3Rpb25DbGljayA9IChldmVudCwgdGFnKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbk1lbnVDbGljayA9IChldmVudCwgdGFnKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRhYiA9PSAnTXkgTWFwcycpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChldmVudC5pdGVtLnRpdGxlLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlTWFwcyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvRGVsZXRlTWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpc1tgdGFibGUwYF0uZmluZCgnLmFjdGl2ZScpLmZpbmQoJy5tYXBpZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2goc2VsZWN0ZWQsIChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5wdXNoKGNlbGwuaW5uZXJIVE1MKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGVNYXBzLmRlbGV0ZUFsbChpZHMsIENPTlNUQU5UUy5QQUdFUy5NWV9NQVBTKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmluZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJ3Rib2R5IHRyIC5jaGVja2JveGVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmluZC5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeS51bmlmb3JtLnVwZGF0ZShmaW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcblxyXG4gICAgfSlcclxuXHJcbiAgICAvL1Jpb3QgYmluZGluZ3NcclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvbXltYXBzJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVudSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBfLnNvcnRCeShkYXRhLmJ1dHRvbnMsICdvcmRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lbnU6IF8uc29ydEJ5KGRhdGEubWVudSwgJ29yZGVyJylcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkVGFibGUgPSAoaWR4LCBsaXN0LCBlZGl0YWJsZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2lkeF0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbYHRhYmxlJHtpZHh9YF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0gPSAkKHRoaXNbYG15bWFwc190YWJsZV8ke2lkeH1gXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXSA9IHRoaXNbYHRhYmxlJHtpZHh9YF0uRGF0YVRhYmxlKHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCB1c2VzIHNjcm9sbGFibGUgZGl2KHRhYmxlLXNjcm9sbGFibGUpIHdpdGggb3ZlcmZsb3c6YXV0byB0byBlbmFibGUgdmVydGljYWwgc2Nyb2xsKHNlZTogYXNzZXRzL2dsb2JhbC9wbHVnaW5zL2RhdGF0YWJsZXMvcGx1Z2lucy9ib290c3RyYXAvZGF0YVRhYmxlcy5ib290c3RyYXAuanMpLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHdoZW4gZHJvcGRvd25zIHVzZWQgdGhlIHNjcm9sbGFibGUgZGl2IHNob3VsZCBiZSByZW1vdmVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJ2JTdGF0ZVNhdmUnOiB0cnVlLCAvLyBzYXZlIGRhdGF0YWJsZSBzdGF0ZShwYWdpbmF0aW9uLCBzb3J0LCBldGMpIGluIGNvb2tpZS5cclxuICAgICAgICAgICAgICAgICAgICAnY29sdW1ucyc6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0NoY2tCeCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTIwcHgnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ3JlYXRlZCBPbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1N0YXR1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vdGhpc1tgdGFibGUke2lkeH1gXVRvb2xzID0gbmV3ICQuZm4uZGF0YVRhYmxlLlRhYmxlVG9vbHModGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0sIHt9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGFibGVXcmFwcGVyID0gdGhpc1tgdGFibGUke2lkeH1gXS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAjbXltYXBzXyR7aWR4fV90YWJsZV93cmFwcGVyYCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpc1tgdGFibGUke2lkeH1gXS5maW5kKCcuZ3JvdXAtY2hlY2thYmxlJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2V0ID0galF1ZXJ5KHRoaXMpLmF0dHIoJ2RhdGEtc2V0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrZWQgPSBqUXVlcnkodGhpcykuaXMoJzpjaGVja2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KHNldCkuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5LnVuaWZvcm0udXBkYXRlKHNldCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdLm9uKCdjaGFuZ2UnLCAndGJvZHkgdHIgLmNoZWNrYm94ZXMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhYmxlV3JhcHBlci5maW5kKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0JykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCBpbnB1dC14c21hbGwgaW5wdXQtaW5saW5lJyk7IC8vIG1vZGlmeSB0YWJsZSBwZXIgcGFnZSBkcm9wZG93blxyXG5cclxuICAgICAgICAgICAgICAgICQoYC5tZXRhX2VkaXRhYmxlXyR7aWR4fWApLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmRhdGFzZXQucGs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YShwYXJhbXMubmV3VmFsdWUsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke2lkfS9uYW1lYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLmVycm9yKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9GZXRjaCBBbGwgbWFwc1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0Q2hpbGQoQ09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1QpLm9uKCd2YWx1ZScsICh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcclxuICAgICAgICAgICAgXy5lYWNoKHRoaXMudGFicywgKHRhYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hcHMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0YWIudGl0bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdUZW1wbGF0ZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ015IE1hcHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCA9PSBNZXRhTWFwLlVzZXIudXNlcklkKSB7IC8vT25seSBpbmNsdWRlIG15IG93biBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1NoYXJlZCB3aXRoIE1lJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgIT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCAmJiAvL0Rvbid0IGluY2x1ZGUgbXkgb3duIG1hcHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2hhcmVkX3dpdGggJiYgLy9FeGNsdWRlIGFueXRoaW5nIHRoYXQgaXNuJ3Qgc2hhcmVkIGF0IGFsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICghb2JqLnNoYXJlZF93aXRoWycqJ10gfHwgKG9iai5zaGFyZWRfd2l0aFsnKiddLnJlYWQgIT0gdHJ1ZSB8fCBvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSAhPSB0cnVlKSkgJiYgLy9FeGNsdWRlIHB1YmxpYyBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdICYmIC8vSW5jbHVkZSBzaGFyZXMgd2loIG15IHVzZXJJZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSB8fCAvL0luY2x1ZGUgYW55dGhpbmcgSSBjYW4gd3JpdGUgdG9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ucmVhZCA9PSB0cnVlKSAvL0luY2x1ZGUgYW55dGhpbmcgSSBjYW4gcmVhZCBmcm9tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gKG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXS53cml0ZSA9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1B1YmxpYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoICYmIC8vRXhjbHVkZSBhbnl0aGluZyB0aGF0IGlzbid0IHNoYXJlZCBhdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoWycqJ10gJiYgKG9iai5zaGFyZWRfd2l0aFsnKiddLnJlYWQgPT0gdHJ1ZSB8fCBvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSApIC8vSW5jbHVkZSBwdWJsaWMgbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IChvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0FsbCBNYXBzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlci5pc0FkbWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9MaWtlIGl0IHNheXMsIGFsbCBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChtYXBzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8uZmlsdGVyKG1hcHMsIChtYXApID0+IHsgcmV0dXJuIG1hcCAmJiBtYXAuaWQgfSlcclxuICAgICAgICAgICAgICAgICAgICBidWlsZFRhYmxlKHRhYi5vcmRlciwgbWFwcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJCgnLm93bmVyLWxhYmVsJykudG9vbHRpcCgpXHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+eyBoZWFkZXIudGl0bGUgfTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IGhlYWRlci50ZXh0IH08L3A+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBlYWNoPVwieyBhcmVhcyB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxyXG4gICAgXHRcdFx0XHRcdFx0PGgzPnsgdGl0bGUgfTwvaDM+XHJcbiAgICBcdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IHRleHQgfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxiPnsgdGl0bGUgfTwvYj4geyB0ZXh0IH1cclxuXHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHQ8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Rlcm1zJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICBcclxuICAgIHRoaXMuYXJlYXMgPSBbXVxyXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5URVJNU19BTkRfQ09ORElUSU9OUywgKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLmFyZWFzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5zZWN0aW9ucywgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKGluY2x1ZGUpIHtcclxuICAgICAgICAgICAgICAgIGQuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkLml0ZW1zLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5jbHVkZTIgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xyXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICBcclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxuY29uc3QgVmlkZW9QbGF5ZXIgPSByZXF1aXJlKCcuLi8uLi90b29scy9WaWRlb1BsYXllcicpXHJcbmNvbnN0IFRyYWluaW5nTWl4ID0gcmVxdWlyZSgnLi4vbWl4aW5zL3RyYWluaW5nLW1peCcpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwidHJhaW5pbmdfcG9ydGxldFwiIGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC00XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZW1iZWQtcmVzcG9uc2l2ZSBlbWJlZC1yZXNwb25zaXZlLTE2Ynk5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cInRyYWluaW5nX3BsYXllclwiID48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoQ09OU1RBTlRTLlRBR1MuVFJBSU5JTkcsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICB0aGlzLm1peGluKFRyYWluaW5nTWl4KVxyXG5cclxuICAgIHRoaXMudHJhaW5pbmcgPSB7fVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50IHVwZGF0ZScsIChldmVudCwgb3B0cykgPT4ge1xyXG4gICAgICAgIGlmIChvcHRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gb3B0c1xyXG4gICAgICAgICAgICB0aGlzLmdldERhdGEodGhpcy5jb25maWcuaWQpXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyID0gbmV3IFZpZGVvUGxheWVyKCd0cmFpbmluZ19wbGF5ZXInLCB7aGVpZ2h0OiAzOTAsIHdpZHRoOiA2NDAsIHZpZGVvSWQ6ICdkVXFSVFdDZFh0NCd9KVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcclxuICAgICAgICAkKHRoaXMudHJhaW5pbmdfcG9ydGxldCkuY3NzKHtcclxuICAgICAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxMjAgKyAncHgnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY29ycmVjdEhlaWdodCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzJylcclxucmVxdWlyZSgnZGF0YXRhYmxlcy1ib290c3RyYXAzLXBsdWdpbicpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IHJhdyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvcmF3Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWhvdmVyXCIgaWQ9XCJ7dGFibGVJZH1cIj5cclxuICAgIDx0aGVhZD5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0aCBlYWNoPVwie2NvbHVtbnN9XCI+e25hbWV9PC90aD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90aGVhZD5cclxuICAgIDx0Ym9keT5cclxuICAgICAgICA8dHIgaWY9XCJ7IGRhdGEgfVwiIGVhY2g9XCJ7IGRhdGEgfVwiIGNsYXNzPVwib2RkIGdyYWRlWFwiPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uU3RhcnQgfVwiPlN0YXJ0IDxpIGNsYXNzPVwiZmEgZmEtcGxheVwiPjwvaT48L2E+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZCBjbGFzcz1cInsgbWV0YV9lZGl0YWJsZTogcGFyZW50LmVkaXRhYmxlfVwiIGRhdGEtcGs9XCJ7IGlkIH1cIiBkYXRhLW5hbWU9XCJuYW1lXCIgZGF0YS10aXRsZT1cIkVkaXQgQ291cnNlIE5hbWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICA8dGQgY2xhc3M9XCJ7IG1ldGFfZWRpdGFibGU6IHBhcmVudC5lZGl0YWJsZX1cIiBkYXRhLXBrPVwieyBpZCB9XCIgZGF0YS1uYW1lPVwiZGVzY3JpcHRpb25cIiBkYXRhLXRpdGxlPVwiRWRpdCBDb3Vyc2UgRGVzY3JpcHRpb25cIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBkZXNjcmlwdGlvbiB9PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90Ym9keT5cclxuPC90YWJsZT5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoQ09OU1RBTlRTLlRBR1MuQUxMX0NPVVJTRVMsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLnVzZXIgPSBNZXRhTWFwLlVzZXJcclxuICAgIHRoaXMuZGF0YSA9IFtdXHJcbiAgICB0aGlzLmVkaXRhYmxlID0gZmFsc2VcclxuICAgIHRoaXMudGFibGVJZCA9ICdhbGxfY291cnNlcydcclxuXHJcbiAgICB0aGlzLmNvbHVtbnMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnQWN0aW9uJyxcclxuICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgd2lkdGg6ICcxMjBweCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ05hbWUnLFxyXG4gICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdEZXNjcmlwdGlvbicsXHJcbiAgICAgICAgICAgIG9yZGVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgIF1cclxuXHJcbiAgICAvL0V2ZW50c1xyXG4gICAgdGhpcy5vblN0YXJ0ID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYHRyYWluaW5ncy8ke2V2ZW50Lml0ZW0uaWR9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWlsZFRhYmxlID0gKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYmxlLmZpbmQoYC5tZXRhX2VkaXRhYmxlYCkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVRhYmxlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy50YWJsZSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoW3RoaXMudGFibGVJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhVGFibGUgPSB0aGlzLnRhYmxlLkRhdGFUYWJsZSh7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcclxuICAgICAgICAgICAgICAgIC8vIHNldHVwIHVzZXMgc2Nyb2xsYWJsZSBkaXYodGFibGUtc2Nyb2xsYWJsZSkgd2l0aCBvdmVyZmxvdzphdXRvIHRvIGVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGwoc2VlOiBhc3NldHMvZ2xvYmFsL3BsdWdpbnMvZGF0YXRhYmxlcy9wbHVnaW5zL2Jvb3RzdHJhcC9kYXRhVGFibGVzLmJvb3RzdHJhcC5qcykuXHJcbiAgICAgICAgICAgICAgICAvLyBTbyB3aGVuIGRyb3Bkb3ducyB1c2VkIHRoZSBzY3JvbGxhYmxlIGRpdiBzaG91bGQgYmUgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxyXG4gICAgICAgICAgICAgICAgLy8nYlN0YXRlU2F2ZSc6IHRydWUsIC8vIHNhdmUgZGF0YXRhYmxlIHN0YXRlKHBhZ2luYXRpb24sIHNvcnQsIGV0YykgaW4gY29va2llLlxyXG4gICAgICAgICAgICAgICAgJ2NvbHVtbnMnOiB0aGlzLmNvbHVtbnNcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFibGVXcmFwcGVyID0gdGhpcy50YWJsZS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAjJHt0aGlzLnRhYmxlSWR9X3RhYmxlX3dyYXBwZXJgKTtcclxuXHJcbiAgICAgICAgICAgIHRhYmxlV3JhcHBlci5maW5kKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0JykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCBpbnB1dC14c21hbGwgaW5wdXQtaW5saW5lJyk7IC8vIG1vZGlmeSB0YWJsZSBwZXIgcGFnZSBkcm9wZG93blxyXG5cclxuICAgICAgICAgICAgIHRoaXMudGFibGUuZmluZChgLm1ldGFfZWRpdGFibGVgKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuZGF0YXNldC5waztcclxuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLkNPVVJTRV9MSVNUfS8ke2lkfS8ke3RoaXMuZGF0YXNldC5uYW1lfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL1Jpb3QgYmluZGluZ3NcclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZWRpdGFibGUgPSB0aGlzLnVzZXIuaXNBZG1pblxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgb25jZSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLkNPVVJTRV9MSVNULCAobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgIG9iai5jcmVhdGVkX2F0ID0gbW9tZW50KG5ldyBEYXRlKG9iai5jcmVhdGVkX2F0KSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZFRhYmxlKDAsIHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIG9uY2UoKVxyXG4gICAgfSlcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2RhdGF0YWJsZXMnKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQgdGFibGUtaG92ZXJcIiBpZD1cInt0YWJsZUlkfVwiPlxyXG4gICAgPHRoZWFkPlxyXG4gICAgICAgIDx0cj5cclxuICAgICAgICAgICAgPHRoIGVhY2g9XCJ7Y29sdW1uc31cIj57bmFtZX08L3RoPlxyXG4gICAgICAgIDwvdHI+XHJcbiAgICA8L3RoZWFkPlxyXG4gICAgPHRib2R5PlxyXG4gICAgICAgIDx0ciBpZj1cInsgZGF0YSB9XCIgZWFjaD1cInsgZGF0YSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1zbSByZWRcIiBvbmNsaWNrPVwieyBwYXJlbnQub25TdGFydCB9XCI+Q29udGludWUgPGkgY2xhc3M9XCJmYSBmYS1wbGF5XCI+PC9pPjwvYT5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPHRkIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj57IG5hbWUgfTwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBkZXNjcmlwdGlvbiB9PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90Ym9keT5cclxuPC90YWJsZT5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoQ09OU1RBTlRTLlRBR1MuTVlfQ09VUlNFUywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMudXNlciA9IE1ldGFNYXAuVXNlclxyXG4gICAgdGhpcy5kYXRhID0gW11cclxuICAgIHRoaXMuZWRpdGFibGUgPSBmYWxzZVxyXG4gICAgdGhpcy50YWJsZUlkID0gJ215X2NvdXJzZXMnXHJcblxyXG4gICAgdGhpcy5jb2x1bW5zID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ0FjdGlvbicsXHJcbiAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAnMTIwcHgnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcclxuICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBuYW1lOiAnRGVzY3JpcHRpb24nLFxyXG4gICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICBdXHJcblxyXG4gICAgLy9FdmVudHNcclxuICAgIHRoaXMub25TdGFydCA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGB0cmFpbmluZ3MvJHtldmVudC5pdGVtLmlkfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYnVpbGRUYWJsZSA9ICgpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZS5maW5kKGAubWV0YV9lZGl0YWJsZWApLmVkaXRhYmxlKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFUYWJsZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChbdGhpcy50YWJsZUlkXSkpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFUYWJsZSA9IHRoaXMudGFibGUuRGF0YVRhYmxlKHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBVbmNvbW1lbnQgYmVsb3cgbGluZSgnZG9tJyBwYXJhbWV0ZXIpIHRvIGZpeCB0aGUgZHJvcGRvd24gb3ZlcmZsb3cgaXNzdWUgaW4gdGhlIGRhdGF0YWJsZSBjZWxscy4gVGhlIGRlZmF1bHQgZGF0YXRhYmxlIGxheW91dFxyXG4gICAgICAgICAgICAgICAgLy8gc2V0dXAgdXNlcyBzY3JvbGxhYmxlIGRpdih0YWJsZS1zY3JvbGxhYmxlKSB3aXRoIG92ZXJmbG93OmF1dG8gdG8gZW5hYmxlIHZlcnRpY2FsIHNjcm9sbChzZWU6IGFzc2V0cy9nbG9iYWwvcGx1Z2lucy9kYXRhdGFibGVzL3BsdWdpbnMvYm9vdHN0cmFwL2RhdGFUYWJsZXMuYm9vdHN0cmFwLmpzKS5cclxuICAgICAgICAgICAgICAgIC8vIFNvIHdoZW4gZHJvcGRvd25zIHVzZWQgdGhlIHNjcm9sbGFibGUgZGl2IHNob3VsZCBiZSByZW1vdmVkLlxyXG4gICAgICAgICAgICAgICAgLy8nZG9tJzogJzwncm93JzwnY29sLW1kLTYgY29sLXNtLTEyJ2w+PCdjb2wtbWQtNiBjb2wtc20tMTInZj5yPnQ8J3Jvdyc8J2NvbC1tZC01IGNvbC1zbS0xMidpPjwnY29sLW1kLTcgY29sLXNtLTEyJ3A+PicsXHJcbiAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXHJcbiAgICAgICAgICAgICAgICAnY29sdW1ucyc6IHRoaXMuY29sdW1uc1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0YWJsZVdyYXBwZXIgPSB0aGlzLnRhYmxlLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoYCMke3RoaXMudGFibGVJZH1fdGFibGVfd3JhcHBlcmApO1xyXG5cclxuICAgICAgICAgICAgdGFibGVXcmFwcGVyLmZpbmQoJy5kYXRhVGFibGVzX2xlbmd0aCBzZWxlY3QnKS5hZGRDbGFzcygnZm9ybS1jb250cm9sIGlucHV0LXhzbWFsbCBpbnB1dC1pbmxpbmUnKTsgLy8gbW9kaWZ5IHRhYmxlIHBlciBwYWdlIGRyb3Bkb3duXHJcblxyXG4gICAgICAgICAgICAgdGhpcy50YWJsZS5maW5kKGAubWV0YV9lZGl0YWJsZWApLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGFzZXQgJiYgdGhpcy5kYXRhc2V0LnBrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YShwYXJhbXMubmV3VmFsdWUsIGAke0NPTlNUQU5UUy5ST1VURVMuQ09VUlNFX0xJU1R9LyR7aWR9L25hbWVgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9SaW90IGJpbmRpbmdzXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBvbmNlID0gXy5vbmNlKCgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuVFJBSU5JTkdTLmZvcm1hdCh0aGlzLnVzZXIudXNlcklkKSwgKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgdGhpcy5idWlsZFRhYmxlKDAsIHRoaXMuZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICBvbmNlKClcclxuICAgIH0pXHJcblxyXG59KTsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuLyoqXHJcbkRlbW8gc2NyaXB0IHRvIGhhbmRsZSB0aGUgdGhlbWUgZGVtb1xyXG4qKi9cclxudmFyIERlbW8gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gSGFuZGxlIFRoZW1lIFNldHRpbmdzXHJcbiAgICB2YXIgaGFuZGxlVGhlbWUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHZhciBwYW5lbCA9ICQoJy50aGVtZS1wYW5lbCcpO1xyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWJveGVkJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbChcImZsdWlkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbChcImRlZmF1bHRcIik7XHJcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImRlZmF1bHRcIik7XHJcbiAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXBvcy1vcHRpb24nKS5hdHRyKFwiZGlzYWJsZWRcIikgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKE1ldHJvbmljLmlzUlRMKCkgPyAncmlnaHQnIDogJ2xlZnQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaGFuZGxlIHRoZW1lIGxheW91dFxyXG4gICAgICAgIHZhciByZXNldExheW91dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLlxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2UtYm94ZWRcIikuXHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikuXHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpLlxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2UtaGVhZGVyLWZpeGVkXCIpLlxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcclxuXHJcbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciA+IC5wYWdlLWhlYWRlci1pbm5lcicpLnJlbW92ZUNsYXNzKFwiY29udGFpbmVyXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWNvbnRhaW5lcicpLnBhcmVudChcIi5jb250YWluZXJcIikuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1jb250YWluZXInKS5pbnNlcnRBZnRlcignYm9keSA+IC5jbGVhcmZpeCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJCgnLnBhZ2UtZm9vdGVyID4gLmNvbnRhaW5lcicpLnNpemUoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgkKCcucGFnZS1mb290ZXIgPiAuY29udGFpbmVyJykuaHRtbCgpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcucGFnZS1mb290ZXInKS5wYXJlbnQoXCIuY29udGFpbmVyXCIpLnNpemUoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaW5zZXJ0QWZ0ZXIoJy5wYWdlLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5pbnNlcnRBZnRlcignLnBhZ2UtZm9vdGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLnJlbW92ZUNsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcclxuXHJcbiAgICAgICAgICAgICQoJ2JvZHkgPiAuY29udGFpbmVyJykucmVtb3ZlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGxhc3RTZWxlY3RlZExheW91dCA9ICcnO1xyXG5cclxuICAgICAgICB2YXIgc2V0TGF5b3V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGxheW91dE9wdGlvbiA9ICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhck9wdGlvbiA9ICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIGhlYWRlck9wdGlvbiA9ICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBmb290ZXJPcHRpb24gPSAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhclBvc09wdGlvbiA9ICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyU3R5bGVPcHRpb24gPSAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudU9wdGlvbiA9ICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyVG9wRHJvcGRvd25TdHlsZSA9ICQoJy5wYWdlLWhlYWRlci10b3AtZHJvcGRvd24tc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09IFwiZml4ZWRcIiAmJiBoZWFkZXJPcHRpb24gPT0gXCJkZWZhdWx0XCIpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdEZWZhdWx0IEhlYWRlciB3aXRoIEZpeGVkIFNpZGViYXIgb3B0aW9uIGlzIG5vdCBzdXBwb3J0ZWQuIFByb2NlZWQgd2l0aCBGaXhlZCBIZWFkZXIgd2l0aCBGaXhlZCBTaWRlYmFyLicpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICAgICAgICAgIHNpZGViYXJPcHRpb24gPSAnZml4ZWQnO1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyT3B0aW9uID0gJ2ZpeGVkJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzZXRMYXlvdXQoKTsgLy8gcmVzZXQgbGF5b3V0IHRvIGRlZmF1bHQgc3RhdGVcclxuXHJcbiAgICAgICAgICAgIGlmIChsYXlvdXRPcHRpb24gPT09IFwiYm94ZWRcIikge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1ib3hlZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgaGVhZGVyXHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgPiAucGFnZS1oZWFkZXItaW5uZXInKS5hZGRDbGFzcyhcImNvbnRhaW5lclwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ID0gJCgnYm9keSA+IC5jbGVhcmZpeCcpLmFmdGVyKCc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2V0IGNvbnRlbnRcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWNvbnRhaW5lcicpLmFwcGVuZFRvKCdib2R5ID4gLmNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNldCBmb290ZXJcclxuICAgICAgICAgICAgICAgIGlmIChmb290ZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5odG1sKCc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+JyArICQoJy5wYWdlLWZvb3RlcicpLmh0bWwoKSArICc8L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuYXBwZW5kVG8oJ2JvZHkgPiAuY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChsYXN0U2VsZWN0ZWRMYXlvdXQgIT0gbGF5b3V0T3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAvL2xheW91dCBjaGFuZ2VkLCBydW4gcmVzcG9uc2l2ZSBoYW5kbGVyOlxyXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMucnVuUmVzaXplSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXN0U2VsZWN0ZWRMYXlvdXQgPSBsYXlvdXRPcHRpb247XHJcblxyXG4gICAgICAgICAgICAvL2hlYWRlclxyXG4gICAgICAgICAgICBpZiAoaGVhZGVyT3B0aW9uID09PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICQoXCIucGFnZS1oZWFkZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXZiYXItc3RhdGljLXRvcFwiKS5hZGRDbGFzcyhcIm5hdmJhci1maXhlZC10b3BcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICQoXCIucGFnZS1oZWFkZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXZiYXItZml4ZWQtdG9wXCIpLmFkZENsYXNzKFwibmF2YmFyLXN0YXRpYy10b3BcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc2lkZWJhclxyXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWZ1bGwtd2lkdGgnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWRlZmF1bHRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmluaXRGaXhlZFNpZGViYXJIb3ZlckVmZmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtZGVmYXVsdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKS51bmJpbmQoJ21vdXNlZW50ZXInKS51bmJpbmQoJ21vdXNlbGVhdmUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdG9wIGRyb3Bkb3duIHN0eWxlXHJcbiAgICAgICAgICAgIGlmIChoZWFkZXJUb3BEcm9wZG93blN0eWxlID09PSAnZGFyaycpIHtcclxuICAgICAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLmFkZENsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLnJlbW92ZUNsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9mb290ZXJcclxuICAgICAgICAgICAgaWYgKGZvb3Rlck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9zaWRlYmFyIHN0eWxlXHJcbiAgICAgICAgICAgIGlmIChzaWRlYmFyU3R5bGVPcHRpb24gPT09ICdjb21wYWN0Jykge1xyXG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNvbXBhY3RcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY29tcGFjdFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9zaWRlYmFyIG1lbnVcclxuICAgICAgICAgICAgaWYgKHNpZGViYXJNZW51T3B0aW9uID09PSAnaG92ZXInKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkudmFsKFwiYWNjb3JkaW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiSG92ZXIgU2lkZWJhciBNZW51IGlzIG5vdCBjb21wYXRpYmxlIHdpdGggRml4ZWQgU2lkZWJhciBNb2RlLiBTZWxlY3QgRGVmYXVsdCBTaWRlYmFyIE1vZGUgSW5zdGVhZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc2lkZWJhciBwb3NpdGlvblxyXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuaXNSVEwoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJQb3NPcHRpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAncmlnaHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAnbGVmdCdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyUG9zT3B0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdsZWZ0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcclxuICAgICAgICAgICAgTGF5b3V0LmluaXRGaXhlZFNpZGViYXIoKTsgLy8gcmVpbml0aWFsaXplIGZpeGVkIHNpZGViYXJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgdGhlbWUgY29sb3JzXHJcbiAgICAgICAgdmFyIHNldENvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2xvcl8gPSAoTWV0cm9uaWMuaXNSVEwoKSA/IGNvbG9yICsgJy1ydGwnIDogY29sb3IpO1xyXG4gICAgICAgICAgICAkKCcjc3R5bGVfY29sb3InKS5hdHRyKFwiaHJlZlwiLCBMYXlvdXQuZ2V0TGF5b3V0Q3NzUGF0aCgpICsgJ3RoZW1lcy8nICsgY29sb3JfICsgXCIuY3NzXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAkKCcudGhlbWUtY29sb3JzID4gbGknLCBwYW5lbCkuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY29sb3IgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXRoZW1lXCIpO1xyXG4gICAgICAgICAgICBzZXRDb2xvcihjb2xvcik7XHJcbiAgICAgICAgICAgICQoJ3VsID4gbGknLCBwYW5lbCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT09ICdkYXJrJykge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtYWN0aW9ucyAuYnRuJykucmVtb3ZlQ2xhc3MoJ3JlZC1oYXplJykuYWRkQ2xhc3MoJ2J0bi1kZWZhdWx0IGJ0bi10cmFuc3BhcmVudCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtYWN0aW9ucyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2J0bi1kZWZhdWx0IGJ0bi10cmFuc3BhcmVudCcpLmFkZENsYXNzKCdyZWQtaGF6ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHNldCBkZWZhdWx0IHRoZW1lIG9wdGlvbnM6XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWJveGVkXCIpKSB7XHJcbiAgICAgICAgICAgICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbChcImJveGVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKSkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIikpIHtcclxuICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKSkge1xyXG4gICAgICAgICAgICAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKSkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbChcInJpZ2h0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1saWdodFwiKSkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKFwibGlnaHRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIikpIHtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkudmFsKFwiaG92ZXJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2lkZWJhck9wdGlvbiA9ICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIGhlYWRlck9wdGlvbiA9ICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBmb290ZXJPcHRpb24gPSAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhclBvc09wdGlvbiA9ICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyU3R5bGVPcHRpb24gPSAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudU9wdGlvbiA9ICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG5cclxuICAgICAgICAkKCcubGF5b3V0LW9wdGlvbiwgLnBhZ2UtaGVhZGVyLXRvcC1kcm9wZG93bi1zdHlsZS1vcHRpb24sIC5wYWdlLWhlYWRlci1vcHRpb24sIC5zaWRlYmFyLW9wdGlvbiwgLnBhZ2UtZm9vdGVyLW9wdGlvbiwgLnNpZGViYXItcG9zLW9wdGlvbiwgLnNpZGViYXItc3R5bGUtb3B0aW9uLCAuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS5jaGFuZ2Uoc2V0TGF5b3V0KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gaGFuZGxlIHRoZW1lIHN0eWxlXHJcbiAgICB2YXIgc2V0VGhlbWVTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIGZpbGUgPSAoc3R5bGUgPT09ICdyb3VuZGVkJyA/ICdjb21wb25lbnRzLXJvdW5kZWQnIDogJ2NvbXBvbmVudHMnKTtcclxuICAgICAgICBmaWxlID0gKE1ldHJvbmljLmlzUlRMKCkgPyBmaWxlICsgJy1ydGwnIDogZmlsZSk7XHJcblxyXG4gICAgICAgICQoJyNzdHlsZV9jb21wb25lbnRzJykuYXR0cihcImhyZWZcIiwgTWV0cm9uaWMuZ2V0R2xvYmFsQ3NzUGF0aCgpICsgZmlsZSArIFwiLmNzc1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCQuY29va2llKSB7XHJcbiAgICAgICAgICAgICQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJywgc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIHRoZSB0aGVtZVxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBoYW5kbGVzIHN0eWxlIGN1c3RvbWVyIHRvb2xcclxuICAgICAgICAgICAgaGFuZGxlVGhlbWUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSBsYXlvdXQgc3R5bGUgY2hhbmdlXHJcbiAgICAgICAgICAgICQoJy50aGVtZS1wYW5lbCAubGF5b3V0LXN0eWxlLW9wdGlvbicpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICBzZXRUaGVtZVN0eWxlKCQodGhpcykudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldCBsYXlvdXQgc3R5bGUgZnJvbSBjb29raWVcclxuICAgICAgICAgICAgaWYgKCQuY29va2llICYmICQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykgPT09ICdyb3VuZGVkJykge1xyXG4gICAgICAgICAgICAgICAgc2V0VGhlbWVTdHlsZSgkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpKTtcclxuICAgICAgICAgICAgICAgICQoJy50aGVtZS1wYW5lbCAubGF5b3V0LXN0eWxlLW9wdGlvbicpLnZhbCgkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59ICgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZW1vIiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbmNvbnN0IE1ldHJvbmljID0gcmVxdWlyZSgnLi9tZXRyb25pYycpXHJcbi8qKlxyXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcclxuKiovXHJcbnZhciBMYXlvdXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgbGF5b3V0SW1nUGF0aCA9ICdhZG1pbi9sYXlvdXQ0L2ltZy8nO1xyXG5cclxuICAgIHZhciBsYXlvdXRDc3NQYXRoID0gJ2FkbWluL2xheW91dDQvY3NzLyc7XHJcblxyXG4gICAgdmFyIHJlc0JyZWFrcG9pbnRNZCA9IE1ldHJvbmljLmdldFJlc3BvbnNpdmVCcmVha3BvaW50KCdtZCcpO1xyXG5cclxuICAgIC8vKiBCRUdJTjpDT1JFIEhBTkRMRVJTICovL1xyXG4gICAgLy8gdGhpcyBmdW5jdGlvbiBoYW5kbGVzIHJlc3BvbnNpdmUgbGF5b3V0IG9uIHNjcmVlbiBzaXplIHJlc2l6ZSBvciBtb2JpbGUgZGV2aWNlIHJvdGF0ZS5cclxuXHJcblxyXG4gICAgLy8gSGFuZGxlIHNpZGViYXIgbWVudSBsaW5rc1xyXG4gICAgdmFyIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluayA9IGZ1bmN0aW9uKG1vZGUsIGVsKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IGxvY2F0aW9uLmhhc2gudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgdmFyIG1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGUgPT09ICdjbGljaycgfHwgbW9kZSA9PT0gJ3NldCcpIHtcclxuICAgICAgICAgICAgZWwgPSAkKGVsKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdtYXRjaCcpIHtcclxuICAgICAgICAgICAgbWVudS5maW5kKFwibGkgPiBhXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9ICQodGhpcykuYXR0cihcImhyZWZcIikudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIC8vIHVybCBtYXRjaCBjb25kaXRpb25cclxuICAgICAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA+IDEgJiYgdXJsLnN1YnN0cigxLCBwYXRoLmxlbmd0aCAtIDEpID09IHBhdGguc3Vic3RyKDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWVsIHx8IGVsLnNpemUoKSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbC5hdHRyKCdocmVmJykudG9Mb3dlckNhc2UoKSA9PT0gJ2phdmFzY3JpcHQ6OycgfHwgZWwuYXR0cignaHJlZicpLnRvTG93ZXJDYXNlKCkgPT09ICcjJykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2xpZGVTcGVlZCA9IHBhcnNlSW50KG1lbnUuZGF0YShcInNsaWRlLXNwZWVkXCIpKTtcclxuICAgICAgICB2YXIga2VlcEV4cGFuZCA9IG1lbnUuZGF0YShcImtlZXAtZXhwYW5kZWRcIik7XHJcblxyXG4gICAgICAgIC8vIGRpc2FibGUgYWN0aXZlIHN0YXRlc1xyXG4gICAgICAgIG1lbnUuZmluZCgnbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIG1lbnUuZmluZCgnbGkgPiBhID4gLnNlbGVjdGVkJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGlmIChtZW51Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51JykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG1lbnUuZmluZCgnbGkub3BlbicpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmNoaWxkcmVuKCcuc3ViLW1lbnUnKS5zaXplKCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+IGEgPiAuYXJyb3cub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICBtZW51LmZpbmQoJ2xpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWwucGFyZW50cygnbGknKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnPiBhID4gc3Bhbi5hcnJvdycpLmFkZENsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnQoJ3VsLnBhZ2Utc2lkZWJhci1tZW51Jykuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz4gYScpLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJzZWxlY3RlZFwiPjwvc3Bhbj4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuY2hpbGRyZW4oJ3VsLnN1Yi1tZW51Jykuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGUgPT09ICdjbGljaycpIHtcclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlIHNpZGViYXIgbWVudVxyXG4gICAgdmFyIGhhbmRsZVNpZGViYXJNZW51ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICdsaSA+IGEnLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA+PSByZXNCcmVha3BvaW50TWQgJiYgJCh0aGlzKS5wYXJlbnRzKCcucGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudScpLnNpemUoKSA9PT0gMSkgeyAvLyBleGl0IG9mIGhvdmVyIHNpZGViYXIgbWVudVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkuaGFzQ2xhc3MoJ3N1Yi1tZW51JykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykubmV4dCgpLmhhc0NsYXNzKCdzdWItbWVudSBhbHdheXMtb3BlbicpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpO1xyXG4gICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIG1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcclxuICAgICAgICAgICAgdmFyIHN1YiA9ICQodGhpcykubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGF1dG9TY3JvbGwgPSBtZW51LmRhdGEoXCJhdXRvLXNjcm9sbFwiKTtcclxuICAgICAgICAgICAgdmFyIHNsaWRlU3BlZWQgPSBwYXJzZUludChtZW51LmRhdGEoXCJzbGlkZS1zcGVlZFwiKSk7XHJcbiAgICAgICAgICAgIHZhciBrZWVwRXhwYW5kID0gbWVudS5kYXRhKFwia2VlcC1leHBhbmRlZFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChrZWVwRXhwYW5kICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5jaGlsZHJlbignYScpLmNoaWxkcmVuKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuKCdsaS5vcGVuJykuY2hpbGRyZW4oJy5zdWItbWVudTpub3QoLmFsd2F5cy1vcGVuKScpLnNsaWRlVXAoc2xpZGVTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgc2xpZGVPZmZlc2V0ID0gLTIwMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdWIuaXMoXCI6dmlzaWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLmFycm93JywgJCh0aGlzKSkucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICBzdWIuc2xpZGVVcChzbGlkZVNwZWVkLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b1Njcm9sbCA9PT0gdHJ1ZSAmJiAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbnUuc2xpbVNjcm9sbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Njcm9sbFRvJzogKHRoZS5wb3NpdGlvbigpKS50b3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8odGhlLCBzbGlkZU9mZmVzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuYXJyb3cnLCAkKHRoaXMpKS5hZGRDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgIHN1Yi5zbGlkZURvd24oc2xpZGVTcGVlZCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF1dG9TY3JvbGwgPT09IHRydWUgJiYgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXNpZGViYXItY2xvc2VkJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51LnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzY3JvbGxUbyc6ICh0aGUucG9zaXRpb24oKSkudG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvKHRoZSwgc2xpZGVPZmZlc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBhamF4IGxpbmtzIHdpdGhpbiBzaWRlYmFyIG1lbnVcclxuICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ2NsaWNrJywgJyBsaSA+IGEuYWpheGlmeScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG4gICAgICAgICAgICB2YXIgbWVudUNvbnRhaW5lciA9ICQoJy5wYWdlLXNpZGViYXIgdWwnKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gJCgnLnBhZ2UtY29udGVudCcpO1xyXG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnRCb2R5ID0gJCgnLnBhZ2UtY29udGVudCAucGFnZS1jb250ZW50LWJvZHknKTtcclxuXHJcbiAgICAgICAgICAgIG1lbnVDb250YWluZXIuY2hpbGRyZW4oJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgbWVudUNvbnRhaW5lci5jaGlsZHJlbignYXJyb3cub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ2xpJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbignYSA+IHNwYW4uYXJyb3cnKS5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIE1ldHJvbmljLnN0YXJ0UGFnZUxvYWRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlLnBhcmVudHMoJ2xpLm9wZW4nKS5zaXplKCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhci1tZW51ID4gbGkub3BlbiA+IGEnKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0QWpheCgpOyAvLyBpbml0aWFsaXplIGNvcmUgc3R1ZmZcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbCgnPGg0PkNvdWxkIG5vdCBsb2FkIHRoZSByZXF1ZXN0ZWQgY29udGVudC48L2g0PicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIGFqYXggbGluayB3aXRoaW4gbWFpbiBjb250ZW50XHJcbiAgICAgICAgJCgnLnBhZ2UtY29udGVudCcpLm9uKCdjbGljaycsICcuYWpheGlmeScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSAkKCcucGFnZS1jb250ZW50Jyk7XHJcbiAgICAgICAgICAgIHZhciBwYWdlQ29udGVudEJvZHkgPSAkKCcucGFnZS1jb250ZW50IC5wYWdlLWNvbnRlbnQtYm9keScpO1xyXG5cclxuICAgICAgICAgICAgTWV0cm9uaWMuc3RhcnRQYWdlTG9hZGluZygpO1xyXG5cclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmZpeENvbnRlbnRIZWlnaHQoKTsgLy8gZml4IGNvbnRlbnQgaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdEFqYXgoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHN0dWZmXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwoJzxoND5Db3VsZCBub3QgbG9hZCB0aGUgcmVxdWVzdGVkIGNvbnRlbnQuPC9oND4nKTtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBzY3JvbGxpbmcgdG8gdG9wIG9uIHJlc3BvbnNpdmUgbWVudSB0b2dnbGVyIGNsaWNrIHdoZW4gaGVhZGVyIGlzIGZpeGVkIGZvciBtb2JpbGUgdmlld1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucGFnZS1oZWFkZXItZml4ZWQtbW9iaWxlIC5yZXNwb25zaXZlLXRvZ2dsZXInLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBzaWRlYmFyIGhlaWdodCBmb3IgZml4ZWQgc2lkZWJhciBsYXlvdXQuXHJcbiAgICB2YXIgX2NhbGN1bGF0ZUZpeGVkU2lkZWJhclZpZXdwb3J0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNpZGViYXJIZWlnaHQgPSBNZXRyb25pYy5nZXRWaWV3UG9ydCgpLmhlaWdodCAtICQoJy5wYWdlLWhlYWRlcicpLm91dGVySGVpZ2h0KCkgLSAzMDtcclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikpIHtcclxuICAgICAgICAgICAgc2lkZWJhckhlaWdodCA9IHNpZGViYXJIZWlnaHQgLSAkKCcucGFnZS1mb290ZXInKS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNpZGViYXJIZWlnaHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgZml4ZWQgc2lkZWJhclxyXG4gICAgdmFyIGhhbmRsZUZpeGVkU2lkZWJhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XHJcblxyXG4gICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKG1lbnUpO1xyXG5cclxuICAgICAgICBpZiAoJCgnLnBhZ2Utc2lkZWJhci1maXhlZCcpLnNpemUoKSA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA+PSByZXNCcmVha3BvaW50TWQpIHtcclxuICAgICAgICAgICAgbWVudS5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgX2NhbGN1bGF0ZUZpeGVkU2lkZWJhclZpZXdwb3J0SGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbChtZW51KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgc2lkZWJhciB0b2dnbGVyIHRvIGNsb3NlL2hpZGUgdGhlIHNpZGViYXIuXHJcbiAgICB2YXIgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGJvZHkgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSk7XHJcbiAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItY2xvc2VkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5wYWdlLXNpZGViYXItbWVudScpLnJlbW92ZUNsYXNzKCdwYWdlLXNpZGViYXItbWVudS1jbG9zZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcucGFnZS1zaWRlYmFyLW1lbnUnKS5hZGRDbGFzcygncGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFubGVzIHNpZGViYXIgdG9nZ2xlclxyXG4gICAgdmFyIGhhbmRsZVNpZGViYXJUb2dnbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGJvZHkgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBzaWRlYmFyIHNob3cvaGlkZVxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnNpZGViYXItdG9nZ2xlcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXIgPSAkKCcucGFnZS1zaWRlYmFyJyk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xyXG4gICAgICAgICAgICAkKFwiLnNpZGViYXItc2VhcmNoXCIsIHNpZGViYXIpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgYm9keS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIik7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNsb3NlZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICgkLmNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdzaWRlYmFyX2Nsb3NlZCcsICcwJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBib2R5LmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKTtcclxuICAgICAgICAgICAgICAgIHNpZGViYXJNZW51LmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS50cmlnZ2VyKFwibW91c2VsZWF2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgkLmNvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdzaWRlYmFyX2Nsb3NlZCcsICcxJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QoKTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggYmFyIGNsb3NlXHJcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICcuc2lkZWJhci1zZWFyY2ggLnJlbW92ZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSB0aGUgc2VhcmNoIHF1ZXJ5IHN1Ym1pdCBvbiBlbnRlciBwcmVzc1xyXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXIgLnNpZGViYXItc2VhcmNoJykub24oJ2tleXByZXNzJywgJ2lucHV0LmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLzwtLS0tIEFkZCB0aGlzIGxpbmVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgdGhlIHNlYXJjaCBzdWJtaXQoZm9yIHNpZGViYXIgc2VhcmNoIGFuZCByZXNwb25zaXZlIG1vZGUgb2YgdGhlIGhlYWRlciBzZWFyY2gpXHJcbiAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoIC5zdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5oYXNDbGFzcygnb3BlbicpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcucGFnZS1zaWRlYmFyLWZpeGVkJykuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXIgLnNpZGViYXItdG9nZ2xlcicpLmNsaWNrKCk7IC8vdHJpZ2dlciBzaWRlYmFyIHRvZ2dsZSBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuYWRkQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBjbG9zZSBvbiBib2R5IGNsaWNrXHJcbiAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXNlYXJjaCcpLnNpemUoKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2ggLmlucHV0LWdyb3VwJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCgnLnNpZGViYXItc2VhcmNoJykuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIHRoZSBob3Jpem9udGFsIG1lbnVcclxuICAgIHZhciBoYW5kbGVIZWFkZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBoYW5kbGUgc2VhcmNoIGJveCBleHBhbmQvY29sbGFwc2VcclxuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbignY2xpY2snLCAnLnNlYXJjaC1mb3JtJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuZm9ybS1jb250cm9sJykuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAuc2VhcmNoLWZvcm0gLmZvcm0tY29udHJvbCcpLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnVuYmluZChcImJsdXJcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgaG9yIG1lbnUgc2VhcmNoIGZvcm0gb24gZW50ZXIgcHJlc3NcclxuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbigna2V5cHJlc3MnLCAnLmhvci1tZW51IC5zZWFyY2gtZm9ybSAuZm9ybS1jb250cm9sJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgaGVhZGVyIHNlYXJjaCBidXR0b24gY2xpY2tcclxuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbignbW91c2Vkb3duJywgJy5zZWFyY2gtZm9ybS5vcGVuIC5zdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5zdWJtaXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyB0aGUgZ28gdG8gdG9wIGJ1dHRvbiBhdCB0aGUgZm9vdGVyXHJcbiAgICB2YXIgaGFuZGxlR29Ub3AgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gMzAwO1xyXG4gICAgICAgIHZhciBkdXJhdGlvbiA9IDUwMDtcclxuXHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSkpIHsgLy8gaW9zIHN1cHBvcnRlZFxyXG4gICAgICAgICAgICAkKHdpbmRvdykuYmluZChcInRvdWNoZW5kIHRvdWNoY2FuY2VsIHRvdWNobGVhdmVcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVJbihkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZU91dChkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vIGdlbmVyYWxcclxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlSW4oZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVPdXQoZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxyXG4gICAgICAgICAgICB9LCBkdXJhdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLyogRU5EOkNPUkUgSEFORExFUlMgKi8vXHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgLy8gTWFpbiBpbml0IG1ldGhvZHMgdG8gaW5pdGlhbGl6ZSB0aGUgbGF5b3V0XHJcbiAgICAgICAgLy8gSU1QT1JUQU5UISEhOiBEbyBub3QgbW9kaWZ5IHRoZSBjb3JlIGhhbmRsZXJzIGNhbGwgb3JkZXIuXHJcblxyXG4gICAgICAgIGluaXRIZWFkZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVIZWFkZXIoKTsgLy8gaGFuZGxlcyBob3Jpem9udGFsIG1lbnVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRTaWRlYmFyTWVudUFjdGl2ZUxpbms6IGZ1bmN0aW9uKG1vZGUsIGVsKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluayhtb2RlLCBlbCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdFNpZGViYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL2xheW91dCBoYW5kbGVyc1xyXG4gICAgICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXIoKTsgLy8gaGFuZGxlcyBmaXhlZCBzaWRlYmFyIG1lbnVcclxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhck1lbnUoKTsgLy8gaGFuZGxlcyBtYWluIG1lbnVcclxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhclRvZ2dsZXIoKTsgLy8gaGFuZGxlcyBzaWRlYmFyIGhpZGUvc2hvd1xyXG5cclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmlzQW5ndWxhckpzQXBwKCkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluaygnbWF0Y2gnKTsgLy8gaW5pdCBzaWRlYmFyIGFjdGl2ZSBsaW5rc1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGhhbmRsZUZpeGVkU2lkZWJhcik7IC8vIHJlaW5pdGlhbGl6ZSBmaXhlZCBzaWRlYmFyIG9uIHdpbmRvdyByZXNpemVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0Q29udGVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0Rm9vdGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlR29Ub3AoKTsgLy9oYW5kbGVzIHNjcm9sbCB0byB0b3AgZnVuY3Rpb25hbGl0eSBpbiB0aGUgZm9vdGVyXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0U2lkZWJhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRDb250ZW50KCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEZvb3RlcigpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGZpeCB0aGUgc2lkZWJhciBhbmQgY29udGVudCBoZWlnaHQgYWNjb3JkaW5nbHlcclxuICAgICAgICBmaXhDb250ZW50SGVpZ2h0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRGaXhlZFNpZGViYXJIb3ZlckVmZmVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdEZpeGVkU2lkZWJhcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhcigpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldExheW91dEltZ1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWV0cm9uaWMuZ2V0QXNzZXRzUGF0aCgpICsgbGF5b3V0SW1nUGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRMYXlvdXRDc3NQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1ldHJvbmljLmdldEFzc2V0c1BhdGgoKSArIGxheW91dENzc1BhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0gKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuXHJcbi8qKlxyXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcclxuKiovXHJcbnZhciBNZXRyb25pYyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8vIElFIG1vZGVcclxuICAgIHZhciBpc1JUTCA9IGZhbHNlO1xyXG4gICAgdmFyIGlzSUU4ID0gZmFsc2U7XHJcbiAgICB2YXIgaXNJRTkgPSBmYWxzZTtcclxuICAgIHZhciBpc0lFMTAgPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgcmVzaXplSGFuZGxlcnMgPSBbXTtcclxuXHJcbiAgICB2YXIgYXNzZXRzUGF0aCA9ICcuLi8uLi9hc3NldHMvJztcclxuXHJcbiAgICB2YXIgZ2xvYmFsSW1nUGF0aCA9ICdnbG9iYWwvaW1nLyc7XHJcblxyXG4gICAgdmFyIGdsb2JhbFBsdWdpbnNQYXRoID0gJ2dsb2JhbC9wbHVnaW5zLyc7XHJcblxyXG4gICAgdmFyIGdsb2JhbENzc1BhdGggPSAnZ2xvYmFsL2Nzcy8nO1xyXG5cclxuICAgIC8vIHRoZW1lIGxheW91dCBjb2xvciBzZXRcclxuXHJcbiAgICB2YXIgYnJhbmRDb2xvcnMgPSB7XHJcbiAgICAgICAgJ2JsdWUnOiAnIzg5QzRGNCcsXHJcbiAgICAgICAgJ3JlZCc6ICcjRjM1NjVEJyxcclxuICAgICAgICAnZ3JlZW4nOiAnIzFiYmM5YicsXHJcbiAgICAgICAgJ3B1cnBsZSc6ICcjOWI1OWI2JyxcclxuICAgICAgICAnZ3JleSc6ICcjOTVhNWE2JyxcclxuICAgICAgICAneWVsbG93JzogJyNGOENCMDAnXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGluaXRpYWxpemVzIG1haW4gc2V0dGluZ3NcclxuICAgIHZhciBoYW5kbGVJbml0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuY3NzKCdkaXJlY3Rpb24nKSA9PT0gJ3J0bCcpIHtcclxuICAgICAgICAgICAgaXNSVEwgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXNJRTggPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgOC4wLyk7XHJcbiAgICAgICAgaXNJRTkgPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgOS4wLyk7XHJcbiAgICAgICAgaXNJRTEwID0gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFIDEwLjAvKTtcclxuXHJcbiAgICAgICAgaWYgKGlzSUUxMCkge1xyXG4gICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2llMTAnKTsgLy8gZGV0ZWN0IElFMTAgdmVyc2lvblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzSUUxMCB8fCBpc0lFOSB8fCBpc0lFOCkge1xyXG4gICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2llJyk7IC8vIGRldGVjdCBJRTEwIHZlcnNpb25cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHJ1bnMgY2FsbGJhY2sgZnVuY3Rpb25zIHNldCBieSBNZXRyb25pYy5hZGRSZXNwb25zaXZlSGFuZGxlcigpLlxyXG4gICAgdmFyIF9ydW5SZXNpemVIYW5kbGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHJlaW5pdGlhbGl6ZSBvdGhlciBzdWJzY3JpYmVkIGVsZW1lbnRzXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNpemVIYW5kbGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZWFjaCA9IHJlc2l6ZUhhbmRsZXJzW2ldO1xyXG4gICAgICAgICAgICBlYWNoLmNhbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGhhbmRsZSB0aGUgbGF5b3V0IHJlaW5pdGlhbGl6YXRpb24gb24gd2luZG93IHJlc2l6ZVxyXG4gICAgdmFyIGhhbmRsZU9uUmVzaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlc2l6ZTtcclxuICAgICAgICBpZiAoaXNJRTgpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJoZWlnaHQ7XHJcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmhlaWdodCA9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvL3F1aXRlIGV2ZW50IHNpbmNlIG9ubHkgYm9keSByZXNpemVkIG5vdCB3aW5kb3cuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNpemUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9ydW5SZXNpemVIYW5kbGVycygpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTApOyAvLyB3YWl0IDUwbXMgdW50aWwgd2luZG93IHJlc2l6ZSBmaW5pc2hlcy5cclxuICAgICAgICAgICAgICAgIGN1cnJoZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBzdG9yZSBsYXN0IGJvZHkgY2xpZW50IGhlaWdodFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzaXplID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwKTsgLy8gd2FpdCA1MG1zIHVudGlsIHdpbmRvdyByZXNpemUgZmluaXNoZXMuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBwb3J0bGV0IHRvb2xzICYgYWN0aW9uc1xyXG4gICAgdmFyIGhhbmRsZVBvcnRsZXRUb29scyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGhhbmRsZSBwb3J0bGV0IHJlbW92ZVxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IGEucmVtb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBwb3J0bGV0ID0gJCh0aGlzKS5jbG9zZXN0KFwiLnBvcnRsZXRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoJ3BhZ2UtcG9ydGxldC1mdWxsc2NyZWVuJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgLmZ1bGxzY3JlZW4nKS50b29sdGlwKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVsb2FkJykudG9vbHRpcCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbW92ZScpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb25maWcnKS50b29sdGlwKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJykudG9vbHRpcCgnZGVzdHJveScpO1xyXG5cclxuICAgICAgICAgICAgcG9ydGxldC5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHBvcnRsZXQgZnVsbHNjcmVlblxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgcG9ydGxldCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpO1xyXG4gICAgICAgICAgICBpZiAocG9ydGxldC5oYXNDbGFzcygncG9ydGxldC1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgICAgICAgICBwb3J0bGV0LnJlbW92ZUNsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS5oZWlnaHQgLVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LXRpdGxlJykub3V0ZXJIZWlnaHQoKSAtXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygncGFkZGluZy10b3AnKSkgLVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ29uJyk7XHJcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmFkZENsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gYS5yZWxvYWQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKS5jbG9zZXN0KFwiLnBvcnRsZXRcIikuY2hpbGRyZW4oXCIucG9ydGxldC1ib2R5XCIpO1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKFwiZGF0YS11cmxcIik7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9ICQodGhpcykuYXR0cihcImRhdGEtZXJyb3ItZGlzcGxheVwiKTtcclxuICAgICAgICAgICAgaWYgKHVybCkge1xyXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuYmxvY2tVSSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBlbCxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb2xvcjogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy51bmJsb2NrVUkoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5odG1sKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9ICdFcnJvciBvbiByZWxvYWRpbmcgdGhlIGNvbnRlbnQuIFBsZWFzZSBjaGVjayB5b3VyIGNvbm5lY3Rpb24gYW5kIHRyeSBhZ2Fpbi4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IgPT0gXCJ0b2FzdHJcIiAmJiB0b2FzdHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yID09IFwibm90aWZpYzhcIiAmJiAkLm5vdGlmaWM4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLm5vdGlmaWM4KCd6aW5kZXgnLCAxMTUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLm5vdGlmaWM4KG1zZywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiAncnVieScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlmZTogMzAwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChtc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgZGVtbyBwdXJwb3NlXHJcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5ibG9ja1VJKHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGxvYWQgYWpheCBkYXRhIG9uIHBhZ2UgaW5pdFxyXG4gICAgICAgICQoJy5wb3J0bGV0IC5wb3J0bGV0LXRpdGxlIGEucmVsb2FkW2RhdGEtbG9hZD1cInRydWVcIl0nKS5jbGljaygpO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmV4cGFuZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKS5jaGlsZHJlbihcIi5wb3J0bGV0LWJvZHlcIik7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY29sbGFwc2VcIikpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZVwiKS5hZGRDbGFzcyhcImV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGVsLnNsaWRlVXAoMjAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJleHBhbmRcIikuYWRkQ2xhc3MoXCJjb2xsYXBzZVwiKTtcclxuICAgICAgICAgICAgICAgIGVsLnNsaWRlRG93bigyMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgY3VzdG9tIGNoZWNrYm94ZXMgJiByYWRpb3MgdXNpbmcgalF1ZXJ5IFVuaWZvcm0gcGx1Z2luXHJcbiAgICB2YXIgaGFuZGxlVW5pZm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghJCgpLnVuaWZvcm0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGVzdCA9ICQoXCJpbnB1dFt0eXBlPWNoZWNrYm94XTpub3QoLnRvZ2dsZSwgLm1kLWNoZWNrLCAubWQtcmFkaW9idG4sIC5tYWtlLXN3aXRjaCwgLmljaGVjayksIGlucHV0W3R5cGU9cmFkaW9dOm5vdCgudG9nZ2xlLCAubWQtY2hlY2ssIC5tZC1yYWRpb2J0biwgLnN0YXIsIC5tYWtlLXN3aXRjaCwgLmljaGVjaylcIik7XHJcbiAgICAgICAgaWYgKHRlc3Quc2l6ZSgpID4gMCkge1xyXG4gICAgICAgICAgICB0ZXN0LmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS51bmlmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlc21hdGVyaWFsIGRlc2lnbiBjaGVja2JveGVzXHJcbiAgICB2YXIgaGFuZGxlTWF0ZXJpYWxEZXNpZ24gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy8gTWF0ZXJpYWwgZGVzaWduIGNrZWNrYm94IGFuZCByYWRpbyBlZmZlY3RzXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcubWQtY2hlY2tib3ggPiBsYWJlbCwgLm1kLXJhZGlvID4gbGFiZWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IHNwYW4gd2hpY2ggaXMgb3VyIGNpcmNsZS9idWJibGVcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKS5jaGlsZHJlbignc3BhbjpmaXJzdC1jaGlsZCcpO1xyXG5cclxuICAgICAgICAgICAgLy8gYWRkIHRoZSBidWJibGUgY2xhc3MgKHdlIGRvIHRoaXMgc28gaXQgZG9lc250IHNob3cgb24gcGFnZSBsb2FkKVxyXG4gICAgICAgICAgICBlbC5hZGRDbGFzcygnaW5jJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBjbG9uZSBpdFxyXG4gICAgICAgICAgICB2YXIgbmV3b25lID0gZWwuY2xvbmUodHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBhZGQgdGhlIGNsb25lZCB2ZXJzaW9uIGJlZm9yZSBvdXIgb3JpZ2luYWxcclxuICAgICAgICAgICAgZWwuYmVmb3JlKG5ld29uZSk7XHJcblxyXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIG9yaWdpbmFsIHNvIHRoYXQgaXQgaXMgcmVhZHkgdG8gcnVuIG9uIG5leHQgY2xpY2tcclxuICAgICAgICAgICAgJChcIi5cIiArIGVsLmF0dHIoXCJjbGFzc1wiKSArIFwiOmxhc3RcIiwgdGhlKS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1tZCcpKSB7XHJcbiAgICAgICAgICAgIC8vIE1hdGVyaWFsIGRlc2lnbiBjbGljayBlZmZlY3RcclxuICAgICAgICAgICAgLy8gY3JlZGl0IHdoZXJlIGNyZWRpdCdzIGR1ZTsgaHR0cDovL3RoZWNvZGVwbGF5ZXIuY29tL3dhbGt0aHJvdWdoL3JpcHBsZS1jbGljay1lZmZlY3QtZ29vZ2xlLW1hdGVyaWFsLWRlc2lnblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCwgY2lyY2xlLCBkLCB4LCB5O1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ2EuYnRuLCBidXR0b24uYnRuLCBpbnB1dC5idG4sIGxhYmVsLmJ0bicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuZmluZChcIi5tZC1jbGljay1jaXJjbGVcIikubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnByZXBlbmQoXCI8c3BhbiBjbGFzcz0nbWQtY2xpY2stY2lyY2xlJz48L3NwYW4+XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNpcmNsZSA9IGVsZW1lbnQuZmluZChcIi5tZC1jbGljay1jaXJjbGVcIik7XHJcbiAgICAgICAgICAgICAgICBjaXJjbGUucmVtb3ZlQ2xhc3MoXCJtZC1jbGljay1hbmltYXRlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFjaXJjbGUuaGVpZ2h0KCkgJiYgIWNpcmNsZS53aWR0aCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IE1hdGgubWF4KGVsZW1lbnQub3V0ZXJXaWR0aCgpLCBlbGVtZW50Lm91dGVySGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZS5jc3Moe2hlaWdodDogZCwgd2lkdGg6IGR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB4ID0gZS5wYWdlWCAtIGVsZW1lbnQub2Zmc2V0KCkubGVmdCAtIGNpcmNsZS53aWR0aCgpLzI7XHJcbiAgICAgICAgICAgICAgICB5ID0gZS5wYWdlWSAtIGVsZW1lbnQub2Zmc2V0KCkudG9wIC0gY2lyY2xlLmhlaWdodCgpLzI7XHJcblxyXG4gICAgICAgICAgICAgICAgY2lyY2xlLmNzcyh7dG9wOiB5KydweCcsIGxlZnQ6IHgrJ3B4J30pLmFkZENsYXNzKFwibWQtY2xpY2stYW5pbWF0ZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZsb2F0aW5nIGxhYmVsc1xyXG4gICAgICAgIHZhciBoYW5kbGVJbnB1dCA9IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChlbC52YWwoKSAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBlbC5hZGRDbGFzcygnZWRpdGVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmVDbGFzcygnZWRpdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbigna2V5ZG93bicsICcuZm9ybS1tZC1mbG9hdGluZy1sYWJlbCAuZm9ybS1jb250cm9sJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBoYW5kbGVJbnB1dCgkKHRoaXMpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2JsdXInLCAnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaGFuZGxlSW5wdXQoJCh0aGlzKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5mb3JtLW1kLWZsb2F0aW5nLWxhYmVsIC5mb3JtLWNvbnRyb2wnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2VkaXRlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlcyBjdXN0b20gY2hlY2tib3hlcyAmIHJhZGlvcyB1c2luZyBqUXVlcnkgaUNoZWNrIHBsdWdpblxyXG4gICAgdmFyIGhhbmRsZWlDaGVjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghJCgpLmlDaGVjaykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcuaWNoZWNrJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGNoZWNrYm94Q2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtY2hlY2tib3gnKSA/ICQodGhpcykuYXR0cignZGF0YS1jaGVja2JveCcpIDogJ2ljaGVja2JveF9taW5pbWFsLWdyZXknO1xyXG4gICAgICAgICAgICB2YXIgcmFkaW9DbGFzcyA9ICQodGhpcykuYXR0cignZGF0YS1yYWRpbycpID8gJCh0aGlzKS5hdHRyKCdkYXRhLXJhZGlvJykgOiAnaXJhZGlvX21pbmltYWwtZ3JleSc7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hlY2tib3hDbGFzcy5pbmRleE9mKCdfbGluZScpID4gLTEgfHwgcmFkaW9DbGFzcy5pbmRleE9mKCdfbGluZScpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuaUNoZWNrKHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja2JveENsYXNzOiBjaGVja2JveENsYXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhZGlvQ2xhc3M6IHJhZGlvQ2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0OiAnPGRpdiBjbGFzcz1cImljaGVja19saW5lLWljb25cIj48L2Rpdj4nICsgJCh0aGlzKS5hdHRyKFwiZGF0YS1sYWJlbFwiKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmlDaGVjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hDbGFzczogY2hlY2tib3hDbGFzcyxcclxuICAgICAgICAgICAgICAgICAgICByYWRpb0NsYXNzOiByYWRpb0NsYXNzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBzd2l0Y2hlc1xyXG4gICAgdmFyIGhhbmRsZUJvb3RzdHJhcFN3aXRjaCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghJCgpLmJvb3RzdHJhcFN3aXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJy5tYWtlLXN3aXRjaCcpLmJvb3RzdHJhcFN3aXRjaCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBjb25maXJtYXRpb25zXHJcbiAgICB2YXIgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCEkKCkuY29uZmlybWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPWNvbmZpcm1hdGlvbl0nKS5jb25maXJtYXRpb24oeyBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSwgYnRuT2tDbGFzczogJ2J0biBidG4tc20gYnRuLXN1Y2Nlc3MnLCBidG5DYW5jZWxDbGFzczogJ2J0biBidG4tc20gYnRuLWRhbmdlcid9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBBY2NvcmRpb25zLlxyXG4gICAgdmFyIGhhbmRsZUFjY29yZGlvbnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ3Nob3duLmJzLmNvbGxhcHNlJywgJy5hY2NvcmRpb24uc2Nyb2xsYWJsZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oJChlLnRhcmdldCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBUYWJzLlxyXG4gICAgdmFyIGhhbmRsZVRhYnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL2FjdGl2YXRlIHRhYiBpZiB0YWIgaWQgcHJvdmlkZWQgaW4gdGhlIFVSTFxyXG4gICAgICAgIGlmIChsb2NhdGlvbi5oYXNoKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWJpZCA9IGVuY29kZVVSSShsb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XHJcbiAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykucGFyZW50cygnLnRhYi1wYW5lOmhpZGRlbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFiaWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcclxuICAgICAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykuY2xpY2soKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKCkudGFiZHJvcCkge1xyXG4gICAgICAgICAgICAkKCcudGFiYmFibGUtdGFiZHJvcCAubmF2LXBpbGxzLCAudGFiYmFibGUtdGFiZHJvcCAubmF2LXRhYnMnKS50YWJkcm9wKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImZhIGZhLWVsbGlwc2lzLXZcIj48L2k+Jm5ic3A7PGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPidcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBNb2RhbHMuXHJcbiAgICB2YXIgaGFuZGxlTW9kYWxzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gZml4IHN0YWNrYWJsZSBtb2RhbCBpc3N1ZTogd2hlbiAyIG9yIG1vcmUgbW9kYWxzIG9wZW5lZCwgY2xvc2luZyBvbmUgb2YgbW9kYWwgd2lsbCByZW1vdmUgLm1vZGFsLW9wZW4gY2xhc3MuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRlLmJzLm1vZGFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICgkKCcubW9kYWw6dmlzaWJsZScpLnNpemUoKSA+IDEgJiYgJCgnaHRtbCcpLmhhc0NsYXNzKCdtb2RhbC1vcGVuJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcubW9kYWw6dmlzaWJsZScpLnNpemUoKSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBmaXggcGFnZSBzY3JvbGxiYXJzIGlzc3VlXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdzaG93LmJzLm1vZGFsJywgJy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcIm1vZGFsLXNjcm9sbFwiKSkge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwibW9kYWwtb3Blbi1ub3Njcm9sbFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBmaXggcGFnZSBzY3JvbGxiYXJzIGlzc3VlXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRlLmJzLm1vZGFsJywgJy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJtb2RhbC1vcGVuLW5vc2Nyb2xsXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgYWpheCBjb250ZW50IGFuZCByZW1vdmUgY2FjaGUgb24gbW9kYWwgY2xvc2VkXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCAnLm1vZGFsOm5vdCgubW9kYWwtY2FjaGVkKScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVEYXRhKCdicy5tb2RhbCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBUb29sdGlwcy5cclxuICAgIHZhciBoYW5kbGVUb29sdGlwcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGdsb2JhbCB0b29sdGlwc1xyXG4gICAgICAgICQoJy50b29sdGlwcycpLnRvb2x0aXAoKTtcclxuXHJcbiAgICAgICAgLy8gcG9ydGxldCB0b29sdGlwc1xyXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgLmZ1bGxzY3JlZW4nKS50b29sdGlwKHtcclxuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXHJcbiAgICAgICAgICAgIHRpdGxlOiAnRnVsbHNjcmVlbidcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbG9hZCcpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcclxuICAgICAgICAgICAgdGl0bGU6ICdSZWxvYWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZW1vdmUnKS50b29sdGlwKHtcclxuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXHJcbiAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29uZmlnJykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1NldHRpbmdzJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxyXG4gICAgICAgICAgICB0aXRsZTogJ0NvbGxhcHNlL0V4cGFuZCdcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgRHJvcGRvd25zXHJcbiAgICB2YXIgaGFuZGxlRHJvcGRvd25zID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgIEhvbGQgZHJvcGRvd24gb24gY2xpY2tcclxuICAgICAgICAqL1xyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLmRyb3Bkb3duLW1lbnUuaG9sZC1vbi1jbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGhhbmRsZUFsZXJ0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtY2xvc2U9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJy5hbGVydCcpLmhpZGUoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLmhpZGUoKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ1tkYXRhLWNsb3NlPVwibm90ZVwiXScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLmhpZGUoKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ1tkYXRhLXJlbW92ZT1cIm5vdGVcIl0nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGUgSG93ZXIgRHJvcGRvd25zXHJcbiAgICB2YXIgaGFuZGxlRHJvcGRvd25Ib3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJ1tkYXRhLWhvdmVyPVwiZHJvcGRvd25cIl0nKS5ub3QoJy5ob3Zlci1pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZHJvcGRvd25Ib3ZlcigpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdob3Zlci1pbml0aWFsaXplZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGUgdGV4dGFyZWEgYXV0b3NpemVcclxuICAgIHZhciBoYW5kbGVUZXh0YXJlYUF1dG9zaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZihhdXRvc2l6ZSkgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGF1dG9zaXplKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhLmF1dG9zaXplbWUnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIFBvcG92ZXJzXHJcblxyXG4gICAgLy8gbGFzdCBwb3BlcCBwb3BvdmVyXHJcbiAgICB2YXIgbGFzdFBvcGVkUG9wb3ZlcjtcclxuXHJcbiAgICB2YXIgaGFuZGxlUG9wb3ZlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcucG9wb3ZlcnMnKS5wb3BvdmVyKCk7XHJcblxyXG4gICAgICAgIC8vIGNsb3NlIGxhc3QgZGlzcGxheWVkIHBvcG92ZXJcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLnBvcG92ZXIuZGF0YS1hcGknLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmIChsYXN0UG9wZWRQb3BvdmVyKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0UG9wZWRQb3BvdmVyLnBvcG92ZXIoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIHNjcm9sbGFibGUgY29udGVudHMgdXNpbmcgalF1ZXJ5IFNsaW1TY3JvbGwgcGx1Z2luLlxyXG4gICAgdmFyIGhhbmRsZVNjcm9sbGVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKCcuc2Nyb2xsZXInKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBJbWFnZSBQcmV2aWV3IHVzaW5nIGpRdWVyeSBGYW5jeWJveCBwbHVnaW5cclxuICAgIHZhciBoYW5kbGVGYW5jeWJveCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghalF1ZXJ5LmZhbmN5Ym94KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKFwiLmZhbmN5Ym94LWJ1dHRvblwiKS5zaXplKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICQoXCIuZmFuY3lib3gtYnV0dG9uXCIpLmZhbmN5Ym94KHtcclxuICAgICAgICAgICAgICAgIGdyb3VwQXR0cjogJ2RhdGEtcmVsJyxcclxuICAgICAgICAgICAgICAgIHByZXZFZmZlY3Q6ICdub25lJyxcclxuICAgICAgICAgICAgICAgIG5leHRFZmZlY3Q6ICdub25lJyxcclxuICAgICAgICAgICAgICAgIGNsb3NlQnRuOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaGVscGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnNpZGUnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEZpeCBpbnB1dCBwbGFjZWhvbGRlciBpc3N1ZSBmb3IgSUU4IGFuZCBJRTlcclxuICAgIHZhciBoYW5kbGVGaXhJbnB1dFBsYWNlaG9sZGVyRm9ySUUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL2ZpeCBodG1sNSBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgZm9yIGllNyAmIGllOFxyXG4gICAgICAgIGlmIChpc0lFOCB8fCBpc0lFOSkgeyAvLyBpZTggJiBpZTlcclxuICAgICAgICAgICAgLy8gdGhpcyBpcyBodG1sNSBwbGFjZWhvbGRlciBmaXggZm9yIGlucHV0cywgaW5wdXRzIHdpdGggcGxhY2Vob2xkZXItbm8tZml4IGNsYXNzIHdpbGwgYmUgc2tpcHBlZChlLmc6IHdlIG5lZWQgdGhpcyBmb3IgcGFzc3dvcmQgZmllbGRzKVxyXG4gICAgICAgICAgICAkKCdpbnB1dFtwbGFjZWhvbGRlcl06bm90KC5wbGFjZWhvbGRlci1uby1maXgpLCB0ZXh0YXJlYVtwbGFjZWhvbGRlcl06bm90KC5wbGFjZWhvbGRlci1uby1maXgpJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbCgpID09PSAnJyAmJiBpbnB1dC5hdHRyKFwicGxhY2Vob2xkZXJcIikgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYWRkQ2xhc3MoXCJwbGFjZWhvbGRlclwiKS52YWwoaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaW5wdXQuZm9jdXMoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbCgpID09IGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PT0gJycgfHwgaW5wdXQudmFsKCkgPT0gaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWwoaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlIFNlbGVjdDIgRHJvcGRvd25zXHJcbiAgICB2YXIgaGFuZGxlU2VsZWN0MiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICgkKCkuc2VsZWN0Mikge1xyXG4gICAgICAgICAgICAkKCcuc2VsZWN0Mm1lJykuc2VsZWN0Mih7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJTZWxlY3RcIixcclxuICAgICAgICAgICAgICAgIGFsbG93Q2xlYXI6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBoYW5kbGUgZ3JvdXAgZWxlbWVudCBoZWlnaHRzXHJcbiAgICB2YXIgaGFuZGxlSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAkKCdbZGF0YS1hdXRvLWhlaWdodF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gJCgnW2RhdGEtaGVpZ2h0XScsIHBhcmVudCk7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICB2YXIgbW9kZSA9IHBhcmVudC5hdHRyKCdkYXRhLW1vZGUnKTtcclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHBhcnNlSW50KHBhcmVudC5hdHRyKCdkYXRhLW9mZnNldCcpID8gcGFyZW50LmF0dHIoJ2RhdGEtb2Zmc2V0JykgOiAwKTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLWhlaWdodCcpID09IFwiaGVpZ2h0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnaGVpZ2h0JywgJycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnbWluLWhlaWdodCcsICcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0XyA9IChtb2RlID09ICdiYXNlLWhlaWdodCcgPyAkKHRoaXMpLm91dGVySGVpZ2h0KCkgOiAkKHRoaXMpLm91dGVySGVpZ2h0KHRydWUpKTtcclxuICAgICAgICAgICAgICAgIGlmIChoZWlnaHRfID4gaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0XztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgKyBvZmZzZXQ7XHJcblxyXG4gICAgICAgICAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1oZWlnaHQnKSA9PSBcImhlaWdodFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdtaW4taGVpZ2h0JywgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyogRU5EOkNPUkUgSEFORExFUlMgKi8vXHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIHRoZSB0aGVtZVxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvL0lNUE9SVEFOVCEhITogRG8gbm90IG1vZGlmeSB0aGUgY29yZSBoYW5kbGVycyBjYWxsIG9yZGVyLlxyXG5cclxuICAgICAgICAgICAgLy9Db3JlIGhhbmRsZXJzXHJcbiAgICAgICAgICAgIGhhbmRsZUluaXQoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHZhcmlhYmxlc1xyXG4gICAgICAgICAgICBoYW5kbGVPblJlc2l6ZSgpOyAvLyBzZXQgYW5kIGhhbmRsZSByZXNwb25zaXZlXHJcblxyXG4gICAgICAgICAgICAvL1VJIENvbXBvbmVudCBoYW5kbGVyc1xyXG4gICAgICAgICAgICBoYW5kbGVNYXRlcmlhbERlc2lnbigpOyAvLyBoYW5kbGUgbWF0ZXJpYWwgZGVzaWduXHJcbiAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTsgLy8gaGFuZmxlIGN1c3RvbSByYWRpbyAmIGNoZWNrYm94ZXNcclxuICAgICAgICAgICAgaGFuZGxlaUNoZWNrKCk7IC8vIGhhbmRsZXMgY3VzdG9tIGljaGVjayByYWRpbyBhbmQgY2hlY2tib3hlc1xyXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBTd2l0Y2goKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBzd2l0Y2ggcGx1Z2luXHJcbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbGVycygpOyAvLyBoYW5kbGVzIHNsaW0gc2Nyb2xsaW5nIGNvbnRlbnRzXHJcbiAgICAgICAgICAgIGhhbmRsZUZhbmN5Ym94KCk7IC8vIGhhbmRsZSBmYW5jeSBib3hcclxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0MigpOyAvLyBoYW5kbGUgY3VzdG9tIFNlbGVjdDIgZHJvcGRvd25zXHJcbiAgICAgICAgICAgIGhhbmRsZVBvcnRsZXRUb29scygpOyAvLyBoYW5kbGVzIHBvcnRsZXQgYWN0aW9uIGJhciBmdW5jdGlvbmFsaXR5KHJlZnJlc2gsIGNvbmZpZ3VyZSwgdG9nZ2xlLCByZW1vdmUpXHJcbiAgICAgICAgICAgIGhhbmRsZUFsZXJ0cygpOyAvL2hhbmRsZSBjbG9zYWJsZWQgYWxlcnRzXHJcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3ducygpOyAvLyBoYW5kbGUgZHJvcGRvd25zXHJcbiAgICAgICAgICAgIGhhbmRsZVRhYnMoKTsgLy8gaGFuZGxlIHRhYnNcclxuICAgICAgICAgICAgaGFuZGxlVG9vbHRpcHMoKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCB0b29sdGlwc1xyXG4gICAgICAgICAgICBoYW5kbGVQb3BvdmVycygpOyAvLyBoYW5kbGVzIGJvb3RzdHJhcCBwb3BvdmVyc1xyXG4gICAgICAgICAgICBoYW5kbGVBY2NvcmRpb25zKCk7IC8vaGFuZGxlcyBhY2NvcmRpb25zXHJcbiAgICAgICAgICAgIGhhbmRsZU1vZGFscygpOyAvLyBoYW5kbGUgbW9kYWxzXHJcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcENvbmZpcm1hdGlvbigpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIGNvbmZpcm1hdGlvbnNcclxuICAgICAgICAgICAgaGFuZGxlVGV4dGFyZWFBdXRvc2l6ZSgpOyAvLyBoYW5kbGUgYXV0b3NpemUgdGV4dGFyZWFzXHJcblxyXG4gICAgICAgICAgICAvL0hhbmRsZSBncm91cCBlbGVtZW50IGhlaWdodHNcclxuICAgICAgICAgICAgaGFuZGxlSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUmVzaXplSGFuZGxlcihoYW5kbGVIZWlnaHQpOyAvLyBoYW5kbGUgYXV0byBjYWxjdWxhdGluZyBoZWlnaHQgb24gd2luZG93IHJlc2l6ZVxyXG5cclxuICAgICAgICAgICAgLy8gSGFja3NcclxuICAgICAgICAgICAgaGFuZGxlRml4SW5wdXRQbGFjZWhvbGRlckZvcklFKCk7IC8vSUU4ICYgSUU5IGlucHV0IHBsYWNlaG9sZGVyIGlzc3VlIGZpeFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vbWFpbiBmdW5jdGlvbiB0byBpbml0aWF0ZSBjb3JlIGphdmFzY3JpcHQgYWZ0ZXIgYWpheCBjb21wbGV0ZVxyXG4gICAgICAgIGluaXRBamF4OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlVW5pZm9ybSgpOyAvLyBoYW5kbGVzIGN1c3RvbSByYWRpbyAmIGNoZWNrYm94ZXNcclxuICAgICAgICAgICAgaGFuZGxlaUNoZWNrKCk7IC8vIGhhbmRsZXMgY3VzdG9tIGljaGVjayByYWRpbyBhbmQgY2hlY2tib3hlc1xyXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBTd2l0Y2goKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBzd2l0Y2ggcGx1Z2luXHJcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3duSG92ZXIoKTsgLy8gaGFuZGxlcyBkcm9wZG93biBob3ZlclxyXG4gICAgICAgICAgICBoYW5kbGVTY3JvbGxlcnMoKTsgLy8gaGFuZGxlcyBzbGltIHNjcm9sbGluZyBjb250ZW50c1xyXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3QyKCk7IC8vIGhhbmRsZSBjdXN0b20gU2VsZWN0MiBkcm9wZG93bnNcclxuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTsgLy8gaGFuZGxlIGZhbmN5IGJveFxyXG4gICAgICAgICAgICBoYW5kbGVEcm9wZG93bnMoKTsgLy8gaGFuZGxlIGRyb3Bkb3duc1xyXG4gICAgICAgICAgICBoYW5kbGVUb29sdGlwcygpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHRvb2x0aXBzXHJcbiAgICAgICAgICAgIGhhbmRsZVBvcG92ZXJzKCk7IC8vIGhhbmRsZXMgYm9vdHN0cmFwIHBvcG92ZXJzXHJcbiAgICAgICAgICAgIGhhbmRsZUFjY29yZGlvbnMoKTsgLy9oYW5kbGVzIGFjY29yZGlvbnNcclxuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uKCk7IC8vIGhhbmRsZSBib290c3RyYXAgY29uZmlybWF0aW9uc1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vaW5pdCBtYWluIGNvbXBvbmVudHNcclxuICAgICAgICBpbml0Q29tcG9uZW50czogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEFqYXgoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byByZW1lbWJlciBsYXN0IG9wZW5lZCBwb3BvdmVyIHRoYXQgbmVlZHMgdG8gYmUgY2xvc2VkIG9uIGNsaWNrXHJcbiAgICAgICAgc2V0TGFzdFBvcGVkUG9wb3ZlcjogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgbGFzdFBvcGVkUG9wb3ZlciA9IGVsO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGFkZCBjYWxsYmFjayBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIG9uIHdpbmRvdyByZXNpemVcclxuICAgICAgICBhZGRSZXNpemVIYW5kbGVyOiBmdW5jdGlvbihmdW5jKSB7XHJcbiAgICAgICAgICAgIHJlc2l6ZUhhbmRsZXJzLnB1c2goZnVuYyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3RvbiB0byBjYWxsIF9ydW5yZXNpemVIYW5kbGVyc1xyXG4gICAgICAgIHJ1blJlc2l6ZUhhbmRsZXJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgX3J1blJlc2l6ZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvIHNjcm9sbChmb2N1cykgdG8gYW4gZWxlbWVudFxyXG4gICAgICAgIHNjcm9sbFRvOiBmdW5jdGlvbihlbCwgb2ZmZXNldCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gKGVsICYmIGVsLnNpemUoKSA+IDApID8gZWwub2Zmc2V0KCkudG9wIDogMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlcicpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLXRvcC1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyLXRvcCcpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLW1lbnUtZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlci1tZW51JykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwb3MgPSBwb3MgKyAob2ZmZXNldCA/IG9mZmVzZXQgOiAtMSAqIGVsLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHBvc1xyXG4gICAgICAgICAgICB9LCAnc2xvdycpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRTbGltU2Nyb2xsOiBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAkKGVsKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIGV4aXRcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhlaWdodFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9ICQodGhpcykuYXR0cihcImRhdGEtaGVpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAkKHRoaXMpLmNzcygnaGVpZ2h0Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zbGltU2Nyb2xsKHtcclxuICAgICAgICAgICAgICAgICAgICBhbGxvd1BhZ2VTY3JvbGw6IHRydWUsIC8vIGFsbG93IHBhZ2Ugc2Nyb2xsIHdoZW4gdGhlIGVsZW1lbnQgc2Nyb2xsIGlzIGVuZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogJzdweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKSA/ICQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpIDogJyNiYmInKSxcclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhaWxDb2xvcjogKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKSA/ICQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKSA6ICcjZWFlYWVhJyksXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGlzUlRMID8gJ2xlZnQnIDogJ3JpZ2h0JyxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICBhbHdheXNWaXNpYmxlOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1hbHdheXMtdmlzaWJsZVwiKSA9PSBcIjFcIiA/IHRydWUgOiBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcmFpbFZpc2libGU6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKSA9PSBcIjFcIiA/IHRydWUgOiBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUZhZGVPdXQ6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIiwgXCIxXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZXN0cm95U2xpbVNjcm9sbDogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgJChlbCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpID09PSBcIjFcIikgeyAvLyBkZXN0cm95IGV4aXN0aW5nIGluc3RhbmNlIGJlZm9yZSB1cGRhdGluZyB0aGUgaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBjdXN0b20gYXR0cmlidXJlcyBzbyBsYXRlciB3ZSB3aWxsIHJlYXNzaWduLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtaGFuZGxlLWNvbG9yXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXdyYXBwZXItY2xhc3NcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXJhaWwtY29sb3JcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWFsd2F5cy12aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1hbHdheXMtdmlzaWJsZVwiXSA9ICQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtcmFpbC12aXNpYmxlXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyByZWFzc2lnbiBjdXN0b20gYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChhdHRyTGlzdCwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUuYXR0cihrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGZ1bmN0aW9uIHRvIHNjcm9sbCB0byB0aGUgdG9wXHJcbiAgICAgICAgc2Nyb2xsVG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gIGJsb2NrIGVsZW1lbnQoaW5kaWNhdGUgbG9hZGluZylcclxuICAgICAgICBibG9ja1VJOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj4nICsgJzxkaXYgY2xhc3M9XCJibG9jay1zcGlubmVyLWJhclwiPjxkaXYgY2xhc3M9XCJib3VuY2UxXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlM1wiPjwvZGl2PjwvZGl2PicgKyAnPC9kaXY+JztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmljb25Pbmx5KSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIgYWxpZ249XCJcIj48L2Rpdj4nO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMudGV4dE9ubHkpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48c3Bhbj4mbmJzcDsmbmJzcDsnICsgKG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMT0FESU5HLi4uJykgKyAnPC9zcGFuPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIgYWxpZ249XCJcIj48c3Bhbj4mbmJzcDsmbmJzcDsnICsgKG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMT0FESU5HLi4uJykgKyAnPC9zcGFuPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnRhcmdldCkgeyAvLyBlbGVtZW50IGJsb2NraW5nXHJcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSAkKG9wdGlvbnMudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5oZWlnaHQoKSA8PSAoJCh3aW5kb3cpLmhlaWdodCgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY2VucmVyWSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbC5ibG9jayh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaHRtbCxcclxuICAgICAgICAgICAgICAgICAgICBiYXNlWjogb3B0aW9ucy56SW5kZXggPyBvcHRpb25zLnpJbmRleCA6IDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyWTogb3B0aW9ucy5jZW5yZXJZICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNlbnJlclkgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDU1M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAnd2FpdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gcGFnZSBibG9ja2luZ1xyXG4gICAgICAgICAgICAgICAgJC5ibG9ja1VJKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBodG1sLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhc2VaOiBvcHRpb25zLnpJbmRleCA/IG9wdGlvbnMuekluZGV4IDogMTAwMCxcclxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDU1M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAnd2FpdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byAgdW4tYmxvY2sgZWxlbWVudChmaW5pc2ggbG9hZGluZylcclxuICAgICAgICB1bmJsb2NrVUk6IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAkKHRhcmdldCkudW5ibG9jayh7XHJcbiAgICAgICAgICAgICAgICAgICAgb25VbmJsb2NrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YXJnZXQpLmNzcygncG9zaXRpb24nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGFyZ2V0KS5jc3MoJ3pvb20nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkLnVuYmxvY2tVSSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RhcnRQYWdlTG9hZGluZzogZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLXNwaW5uZXItYmFyJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGFnZS1zcGlubmVyLWJhclwiPjxkaXYgY2xhc3M9XCJib3VuY2UxXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlM1wiPjwvZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtbG9hZGluZycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInBhZ2UtbG9hZGluZ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiLz4mbmJzcDsmbmJzcDs8c3Bhbj4nICsgKG9wdGlvbnMgJiYgb3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xvYWRpbmcuLi4nKSArICc8L3NwYW4+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdG9wUGFnZUxvYWRpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcucGFnZS1sb2FkaW5nLCAucGFnZS1zcGlubmVyLWJhcicpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFsZXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiBcIlwiLCAvLyBhbGVydHMgcGFyZW50IGNvbnRhaW5lcihieSBkZWZhdWx0IHBsYWNlZCBhZnRlciB0aGUgcGFnZSBicmVhZGNydW1icylcclxuICAgICAgICAgICAgICAgIHBsYWNlOiBcImFwcGVuZFwiLCAvLyBcImFwcGVuZFwiIG9yIFwicHJlcGVuZFwiIGluIGNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLCAvLyBhbGVydCdzIHR5cGVcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiXCIsIC8vIGFsZXJ0J3MgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgY2xvc2U6IHRydWUsIC8vIG1ha2UgYWxlcnQgY2xvc2FibGVcclxuICAgICAgICAgICAgICAgIHJlc2V0OiB0cnVlLCAvLyBjbG9zZSBhbGwgcHJldmlvdXNlIGFsZXJ0cyBmaXJzdFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsIC8vIGF1dG8gc2Nyb2xsIHRvIHRoZSBhbGVydCBhZnRlciBzaG93blxyXG4gICAgICAgICAgICAgICAgY2xvc2VJblNlY29uZHM6IDAsIC8vIGF1dG8gY2xvc2UgYWZ0ZXIgZGVmaW5lZCBzZWNvbmRzXHJcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiIC8vIHB1dCBpY29uIGJlZm9yZSB0aGUgbWVzc2FnZVxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpZCA9IE1ldHJvbmljLmdldFVuaXF1ZUlEKFwiTWV0cm9uaWNfYWxlcnRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwiTWV0cm9uaWMtYWxlcnRzIGFsZXJ0IGFsZXJ0LScgKyBvcHRpb25zLnR5cGUgKyAnIGZhZGUgaW5cIj4nICsgKG9wdGlvbnMuY2xvc2UgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9idXR0b24+JyA6ICcnKSArIChvcHRpb25zLmljb24gIT09IFwiXCIgPyAnPGkgY2xhc3M9XCJmYS1sZyBmYSBmYS0nICsgb3B0aW9ucy5pY29uICsgJ1wiPjwvaT4gICcgOiAnJykgKyBvcHRpb25zLm1lc3NhZ2UgKyAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuTWV0cm9uaWMtYWxlcnRzJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWNvbnRhaW5lci1iZy1zb2xpZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXRpdGxlJykuYWZ0ZXIoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcucGFnZS1iYXInKS5zaXplKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWJhcicpLmFmdGVyKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWJyZWFkY3J1bWInKS5hZnRlcihodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5wbGFjZSA9PSBcImFwcGVuZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChvcHRpb25zLmNvbnRhaW5lcikuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKG9wdGlvbnMuY29udGFpbmVyKS5wcmVwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5mb2N1cykge1xyXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oJCgnIycgKyBpZCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jbG9zZUluU2Vjb25kcyA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBvcHRpb25zLmNsb3NlSW5TZWNvbmRzICogMTAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplcyB1bmlmb3JtIGVsZW1lbnRzXHJcbiAgICAgICAgaW5pdFVuaWZvcm06IGZ1bmN0aW9uKGVscykge1xyXG4gICAgICAgICAgICBpZiAoZWxzKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVscykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnVuaWZvcm0oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvIHVwZGF0ZS9zeW5jIGpxdWVyeSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zXHJcbiAgICAgICAgdXBkYXRlVW5pZm9ybTogZnVuY3Rpb24oZWxzKSB7XHJcbiAgICAgICAgICAgICQudW5pZm9ybS51cGRhdGUoZWxzKTsgLy8gdXBkYXRlIHRoZSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zIFVJIGFmdGVyIHRoZSBhY3R1YWwgaW5wdXQgY29udHJvbCBzdGF0ZSBjaGFuZ2VkXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aGUgZmFuY3lib3ggcGx1Z2luXHJcbiAgICAgICAgaW5pdEZhbmN5Ym94OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBoZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGFjdHVhbCBpbnB1dCB2YWx1ZSh1c2VkIGluIElFOSBhbmQgSUU4IGR1ZSB0byBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgbm90IHN1cHBvcnRlZClcclxuICAgICAgICBnZXRBY3R1YWxWYWw6IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgIGVsID0gJChlbCk7XHJcbiAgICAgICAgICAgIGlmIChlbC52YWwoKSA9PT0gZWwuYXR0cihcInBsYWNlaG9sZGVyXCIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWwudmFsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gZ2V0IGEgcGFyZW1ldGVyIGJ5IG5hbWUgZnJvbSBVUkxcclxuICAgICAgICBnZXRVUkxQYXJhbWV0ZXI6IGZ1bmN0aW9uKHBhcmFtTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoU3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSksXHJcbiAgICAgICAgICAgICAgICBpLCB2YWwsIHBhcmFtcyA9IHNlYXJjaFN0cmluZy5zcGxpdChcIiZcIik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBwYXJhbXNbaV0uc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbFswXSA9PSBwYXJhbU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5lc2NhcGUodmFsWzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBjaGVjayBmb3IgZGV2aWNlIHRvdWNoIHN1cHBvcnRcclxuICAgICAgICBpc1RvdWNoRGV2aWNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiVG91Y2hFdmVudFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBUbyBnZXQgdGhlIGNvcnJlY3Qgdmlld3BvcnQgd2lkdGggYmFzZWQgb24gIGh0dHA6Ly9hbmR5bGFuZ3Rvbi5jby51ay9hcnRpY2xlcy9qYXZhc2NyaXB0L2dldC12aWV3cG9ydC1zaXplLWphdmFzY3JpcHQvXHJcbiAgICAgICAgZ2V0Vmlld1BvcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IHdpbmRvdyxcclxuICAgICAgICAgICAgICAgIGEgPSAnaW5uZXInO1xyXG4gICAgICAgICAgICBpZiAoISgnaW5uZXJXaWR0aCcgaW4gd2luZG93KSkge1xyXG4gICAgICAgICAgICAgICAgYSA9ICdjbGllbnQnO1xyXG4gICAgICAgICAgICAgICAgZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGVbYSArICdXaWR0aCddLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBlW2EgKyAnSGVpZ2h0J11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRVbmlxdWVJRDogZnVuY3Rpb24ocHJlZml4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncHJlZml4XycgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobmV3IERhdGUoKSkuZ2V0VGltZSgpKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBjaGVjayBJRTggbW9kZVxyXG4gICAgICAgIGlzSUU4OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzSUU4O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGNoZWNrIElFOSBtb2RlXHJcbiAgICAgICAgaXNJRTk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNJRTk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9jaGVjayBSVEwgbW9kZVxyXG4gICAgICAgIGlzUlRMOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzUlRMO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGNoZWNrIElFOCBtb2RlXHJcbiAgICAgICAgaXNBbmd1bGFySnNBcHA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBhbmd1bGFyID09ICd1bmRlZmluZWQnKSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBc3NldHNQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0QXNzZXRzUGF0aDogZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICBhc3NldHNQYXRoID0gcGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRHbG9iYWxJbWdQYXRoOiBmdW5jdGlvbihwYXRoKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbEltZ1BhdGggPSBwYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdsb2JhbEltZ1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbEltZ1BhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0R2xvYmFsUGx1Z2luc1BhdGg6IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgZ2xvYmFsUGx1Z2luc1BhdGggPSBwYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdsb2JhbFBsdWdpbnNQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGggKyBnbG9iYWxQbHVnaW5zUGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRHbG9iYWxDc3NQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGggKyBnbG9iYWxDc3NQYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGdldCBsYXlvdXQgY29sb3IgY29kZSBieSBjb2xvciBuYW1lXHJcbiAgICAgICAgZ2V0QnJhbmRDb2xvcjogZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoYnJhbmRDb2xvcnNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBicmFuZENvbG9yc1tuYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldFJlc3BvbnNpdmVCcmVha3BvaW50OiBmdW5jdGlvbihzaXplKSB7XHJcbiAgICAgICAgICAgIC8vIGJvb3RzdHJhcCByZXNwb25zaXZlIGJyZWFrcG9pbnRzXHJcbiAgICAgICAgICAgIHZhciBzaXplcyA9IHtcclxuICAgICAgICAgICAgICAgICd4cycgOiA0ODAsICAgICAvLyBleHRyYSBzbWFsbFxyXG4gICAgICAgICAgICAgICAgJ3NtJyA6IDc2OCwgICAgIC8vIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAnbWQnIDogOTkyLCAgICAgLy8gbWVkaXVtXHJcbiAgICAgICAgICAgICAgICAnbGcnIDogMTIwMCAgICAgLy8gbGFyZ2VcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzaXplc1tzaXplXSA/IHNpemVzW3NpemVdIDogMDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSAoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWV0cm9uaWM7IiwiY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5jbGFzcyBDb21tb24ge1xyXG5cclxuICAgIHN0YXRpYyBzcGxpdExpbmVzKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGV4dC5zcGxpdCgvXFxuLyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEV2ZW50VGltZSh0LCBub3cpIHtcclxuICAgICAgICBsZXQgdGltZSA9IG1vbWVudCh0LCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnKTtcclxuICAgICAgICBsZXQgbm93dGltZSA9IG1vbWVudChub3csICdZWVlZLU1NLUREIEhIOm1tOnNzLlNTUycpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0OiAgICAgICAnICsgdCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vdzogICAgICcgKyBub3cpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aW1lOiAgICAnICsgdGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgdGltZS5pc1ZhbGlkKCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3d0aW1lOiAnICsgbm93dGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgbm93dGltZS5pc1ZhbGlkKCkpO1xyXG4gICAgICAgIHJldHVybiB0aW1lLmZyb20obm93dGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNsYXNzSWYoa2xhc3MsIGIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbGFzc0lmOiAnICsga2xhc3MgKyAnLCAnICsgYik7XHJcbiAgICAgICAgcmV0dXJuIChiID8ga2xhc3MgOiAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYXZvaWQgJyRhcHBseSBhbHJlYWR5IGluIHByb2dyZXNzJyBlcnJvciAoc291cmNlOiBodHRwczovL2NvZGVyd2FsbC5jb20vcC9uZ2lzbWEpXHJcbiAgICBzdGF0aWMgc2FmZUFwcGx5KGZuKSB7XHJcbiAgICAgICAgaWYgKGZuICYmICh0eXBlb2YgKGZuKSA9PT0gJ2Z1bmN0aW9uJykpIHtcclxuICAgICAgICAgICAgZm4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc291cmNlOiBodHRwOi8vY3RybHEub3JnL2NvZGUvMTk2MTYtZGV0ZWN0LXRvdWNoLXNjcmVlbi1qYXZhc2NyaXB0XHJcbiAgICBzdGF0aWMgaXNUb3VjaERldmljZSgpIHtcclxuICAgICAgICByZXR1cm4gKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IChuYXZpZ2F0b3IuTWF4VG91Y2hQb2ludHMgPiAwKSB8fCAobmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFRpY2tzRnJvbURhdGUoZGF0ZSkge1xyXG4gICAgICAgIGxldCByZXQgPSBudWxsO1xyXG4gICAgICAgIGlmKGRhdGUgJiYgZGF0ZS5nZXRUaW1lKSB7XHJcbiAgICAgICAgICAgIHJldCA9IGRhdGUuZ2V0VGltZSgpLzEwMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1vbjsiLCJjb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxyXG5cclxuY2xhc3MgVmlkZW9QbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGl2SWQsIG9wdHMgPSB7IHZpZGVvSWQ6ICcnfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBkaXZJZFxyXG4gICAgICAgIHRoaXMub3B0cyA9IG9wdHNcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJylcclxuICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgdGhpcy5fb25SZWFkeSA9IHRoaXMuX29uUmVhZHkgfHwgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgd2FpdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuWVQgJiYgd2luZG93LllULmxvYWRlZD09MSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuWVQgPSB3aW5kb3cuWVQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh3aW5kb3cuWVQpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQod2FpdCwgMjUwKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdhaXQoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgdGhpcy5ZVC5QbGF5ZXIodGhpcy5pZCwge1xyXG4gICAgICAgICAgICAgICAgdmlkZW9JZDogdGhpcy5vcHRzLnZpZGVvSWQsXHJcbiAgICAgICAgICAgICAgICBmcmFtZWJvcmRlcjogMCxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uUmVhZHk6IHRoaXMub25QbGF5ZXJSZWFkeSxcclxuICAgICAgICAgICAgICAgICAgICBvblN0YXRlQ2hhbmdlOiB0aGlzLm9uUGxheWVyU3RhdGVDaGFuZ2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25QbGF5ZXJSZWFkeShldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wbGF5VmlkZW8oKTtcclxuICAgIH1cclxuXHJcbiAgICBvblBsYXllclN0YXRlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEgPT0gWVQuUGxheWVyU3RhdGUuRU5ERUQpIHtcclxuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzRG9uZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb25lID09IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBzdG9wVmlkZW8oKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcFZpZGVvKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvUGxheWVyOyIsImlmICghU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxuICAgICAgICAgICAgICA6IG1hdGNoXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59IiwiY29uc3QgdXVpZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBoZXhEaWdpdHMsIGksIHMsIHV1aWQ7XHJcbiAgICBzID0gW107XHJcbiAgICBzLmxlbmd0aCA9IDM2O1xyXG4gICAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xyXG4gICAgaSA9IDA7XHJcbiAgICB3aGlsZSAoaSA8IDM2KSB7XHJcbiAgICAgICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpO1xyXG4gICAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIHNbMTRdID0gJzQnO1xyXG4gICAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpO1xyXG4gICAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJztcclxuICAgIHV1aWQgPSBzLmpvaW4oJycpO1xyXG4gICAgcmV0dXJuIHV1aWQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7Il19
