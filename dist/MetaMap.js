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

},{"./js/app//Config.js":16,"./js/app/Eventer.js":17,"./js/app/Integrations":19,"./js/app/Router.js":21,"./js/app/auth0":23,"./js/app/user.js":24,"./js/integrations/google.js":44,"./js/pages/PageFactory.js":45,"./js/tools/shims.js":76,"airbrake-js":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"jquery":undefined,"jquery-ui":undefined,"lodash":undefined,"riot":"riot"}],2:[function(require,module,exports){
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
            riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.COURSE_LIST);
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
                this.openSidebar();
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

},{"../../MetaMap":1,"../tools/Common":74,"../tools/uuid.js":77,"lodash":undefined}],25:[function(require,module,exports){
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
    TRAINING: 'training'
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

},{"../actions/Action.js":2,"../constants/constants":29,"../tags/page-body.js":56,"../template/demo":70,"../template/layout":71,"../template/metronic":72,"../template/quick-sidebar":73}],46:[function(require,module,exports){
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

},{"../../../MetaMap":1,"../../constants/constants":29,"./raw":49,"moment":undefined,"perfect-scrollbar":undefined,"riot":"riot"}],49:[function(require,module,exports){
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

},{"../../../MetaMap":1,"../../app/Sharing":22,"../../constants/constants":29,"../../tools/shims":76,"bootstrap-select":undefined,"jquery":undefined,"riot":"riot","typeahead.js":undefined}],51:[function(require,module,exports){
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

},{"../../../MetaMap.js":1,"../../constants/constants":29,"../../tools/shims":76,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"moment":undefined,"riot":"riot"}],53:[function(require,module,exports){
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

},{"../../MetaMap":1,"../app/Permissions":20,"../constants/constants":29,"../tools/shims":76,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],56:[function(require,module,exports){
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
});

},{"../../MetaMap":1,"../constants/constants":29,"./page-container":57,"./page-footer":59,"./page-header":60,"riot":"riot"}],57:[function(require,module,exports){
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

},{"../../MetaMap":1,"./page-content":58,"./page-sidebar":63,"riot":"riot"}],58:[function(require,module,exports){
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

},{"../../MetaMap":1,"../constants/constants":29,"./components/quick-sidebar":48,"lodash":undefined,"riot":"riot"}],59:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<div class="page-footer" style="position: fixed; bottom: 0;">\n    <div class="page-footer-inner">\n        <a href="#terms">&copy;2015</a>\n    </div>\n</div>\n';

module.exports = riot.tag('page-footer', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],60:[function(require,module,exports){
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

},{"../../MetaMap":1,"./page-actions.js":55,"./page-logo.js":61,"./page-search.js":62,"./page-topmenu":64,"riot":"riot"}],61:[function(require,module,exports){
'use strict';

var riot = require('riot');
var CONSTANTS = require('../constants/constants');

var html = '\n<div class ="page-logo">\n    <a id="meta_logo" href="#home">\n        <img src="src/images/metamap_cloud.png" alt="logo" class ="logo-default" />\n    </a>\n\n    <div id="meta_menu_toggle" class="menu-toggler sidebar-toggler quick-sidebar-toggler" onclick="{ onClick }" style="visibility:{ getDisplay() };">\n        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->\n    </div>\n</div>\n<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">\n</a>\n';

module.exports = riot.tag('page-logo', html, function (opts) {
    var _this = this;

    var MetaMap = require('../../MetaMap');

    this.onClick = function () {
        // MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_TOGGLE);
    };

    this.getDisplay = function (el) {

        if (MetaMap && MetaMap.Router && MetaMap.Router.currentPath == CONSTANTS.PAGES.TRAININGS) {
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

},{"../../MetaMap":1,"../constants/constants":29,"riot":"riot"}],62:[function(require,module,exports){
'use strict';

var riot = require('riot');

var html = '\n<!-- DOC: Apply "search-form-expanded" right after the "search-form" class to have half expanded search box -->\n<form class="search-form" action="extra_search.html" method="GET">\n    <div class="input-group">\n        <input type="text" class="form-control input-sm" placeholder="Search..." name="query">\n            <span class="input-group-btn">\n                <a href="javascript:;" class="btn submit">\n                    <i class="fa fa-search"></i>\n                </a>\n            </span>\n        </div>\n</form>\n';

module.exports = riot.tag('page-search', html, function (opts) {

    var MetaMap = require('../../MetaMap');
});

},{"../../MetaMap":1,"riot":"riot"}],63:[function(require,module,exports){
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

},{"../../MetaMap":1,"../constants/constants":29,"riot":"riot"}],64:[function(require,module,exports){
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

},{"./menu/meta-help.js":51,"./menu/meta-notifications.js":52,"./menu/meta-points.js":53,"./menu/meta-user.js":54,"bootstrap-hover-dropdown":undefined,"jquery":undefined,"riot":"riot"}],65:[function(require,module,exports){
'use strict';

var riot = require('riot');
var NProgress = window.NProgress;
var _ = require('lodash');
var $ = require('jquery');
require('datatables');
require('datatables-bootstrap3-plugin');

var CONSTANTS = require('../../constants/constants');
var raw = require('../components/raw');
var moment = require('moment');

var html = '\n<div id="trainings_page" class="portlet box grey-cascade">\n    <div class="portlet-title">\n        <div class="caption">\n            <i class="fa fa-icon-th-large"></i>Courses\n        </div>\n    </div>\n    <div class="portlet-body">\n        <div class="tab-content">\n            <div>\n                <table class="table table-striped table-bordered table-hover" id="training_table">\n                    <thead>\n                        <tr>\n                            <th>\n                                Name\n                            </th>\n                            <th>\n                                Created On\n                            </th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr if="{ data }" each="{ data }" class="odd gradeX">\n                            <td style="vertical-align: middle;"><a href="#trainings/{id}">{ name }</a></td>\n                            <td style="vertical-align: middle;">{ created_at }</td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</div>\n';

module.exports = riot.tag(CONSTANTS.PAGES.COURSE_LIST, html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User;
    this.data = null;

    this.on('update', function () {});

    //Riot bindings
    this.on('mount', function () {
        NProgress.start();

        var buildTable = function buildTable(list) {
            try {
                _this.data = list;
                if (_this['table']) {
                    _this['dataTable'].destroy();
                }

                _this.update();

                _this['table'] = $(_this['training_table']);
                _this['dataTable'] = _this['table'].DataTable({

                    // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                    // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
                    // So when dropdowns used the scrollable div should be removed.
                    //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',
                    //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                    'columns': [{
                        name: 'Name',
                        orderable: true
                    }, {
                        name: 'Created On',
                        orderable: true
                    }]
                });

                var tableWrapper = _this['table'].parent().parent().parent().find('#training_table_wrapper');

                tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline'); // modify table per page dropdown
            } catch (e) {
                MetaMap.error(e);
            } finally {
                NProgress.done();
            }
        };

        //Fetch All maps
        MetaMap.MetaFire.getChild(CONSTANTS.ROUTES.COURSE_LIST).on('value', function (val) {
            var list = val.val();
            var maps = _.map(list, function (obj, key) {
                obj.editable = true;
                obj.id = key;
                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                return obj;
            });
            buildTable(maps);
            $('.owner-label').tooltip();
        });
    });
});

},{"../../../MetaMap.js":1,"../../constants/constants":29,"../components/raw":49,"datatables":undefined,"datatables-bootstrap3-plugin":undefined,"jquery":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],66:[function(require,module,exports){
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

var html = '\n<div id="training_portlet" class="portlet light">\n\t\t\t\t<div class="portlet-body">\n\t\t\t\t\t<div class="row margin-bottom-30">\n                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">\n\n\t\t\t\t        </div>\n                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">\n                            <div id="training_player"></div>\n\t\t\t\t        </div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n';

module.exports = riot.tag(CONSTANTS.TAGS.TRAINING, html, function (opts) {
    var _this = this;

    var MetaMap = require('../../../MetaMap.js');

    this.training = {};

    var getData = _.once(function () {
        if (_this.config.id) {
            MetaMap.MetaFire.on('' + CONSTANTS.ROUTES.COURSE_LIST + _this.config.id, function (data) {
                _this.training = data;
                MetaMap.Eventer['do'](CONSTANTS.EVENTS.PAGE_NAME, data);

                _this.update();

                NProgress.done();
            });
        }
    });

    this.on('mount update', function (event, opts) {
        if (opts) {
            _this.config = opts;
            getData();
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

},{"../../../MetaMap.js":1,"../../constants/constants":29,"../../tools/VideoPlayer":75,"riot":"riot"}],70:[function(require,module,exports){
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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');

var VideoPlayer = (function () {
    function VideoPlayer(divId) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? { height: 390, width: 640, videoId: '' } : arguments[1];

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
                    height: _this2.opts.height,
                    width: _this2.opts.width,
                    videoId: _this2.opts.videoId,
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
            if (event.data == YouTube.integration.PlayerState.ENDED) {
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

},{"../../MetaMap":1,"bluebird":undefined}],76:[function(require,module,exports){
'use strict';

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

},{}],77:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3B5TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQ291cnNlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0RlbGV0ZU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0ZlZWRiYWNrLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvSG9tZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0xvZ291dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL015TWFwcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL05ld01hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL09wZW5NYXAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9PcGVuVHJhaW5pbmcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9TaGFyZU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9Db25maWcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0V2ZW50ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9JbnRlZ3JhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1Blcm1pc3Npb25zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9Sb3V0ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1NoYXJpbmcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL2F1dGgwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC91c2VyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NhbnZhcy9jYW52YXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY2FudmFzL2xheW91dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvYWN0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvY2FudmFzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9jb25zdGFudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2RzcnAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VkaXRTdGF0dXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VsZW1lbnRzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ldmVudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL25vdGlmaWNhdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvcGFnZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3JvdXRlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFicy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFncy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvQWRkVGhpcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvR29vZ2xlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Vc2VyU25hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvWW91VHViZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvX0ludGVncmF0aW9uc0Jhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9ub2RlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9xdWljay1zaWRlYmFyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9yYXcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9kaWFsb2dzL3NoYXJlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLWhlbHAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1wb2ludHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtdXNlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtYWN0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtYm9keS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtY29udGFpbmVyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1jb250ZW50LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1mb290ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWhlYWRlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtbG9nby5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2VhcmNoLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1zaWRlYmFyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS10b3BtZW51LmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvY291cnNlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL2hvbWUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9teS1tYXBzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdGVybXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy90cmFpbmluZy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9kZW1vLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RlbXBsYXRlL2xheW91dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9tZXRyb25pYy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9xdWljay1zaWRlYmFyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3Rvb2xzL0NvbW1vbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90b29scy9WaWRlb1BsYXllci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90b29scy9zaGltcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90b29scy91dWlkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25CLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0MsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JCLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQixNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFckMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDekMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDN0MsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDL0MsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDekQsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM5QyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUNsRCxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM3QyxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDN0MsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUE7O0lBRS9DLE9BQU87QUFFRSxhQUZULE9BQU8sR0FFSzs4QkFGWixPQUFPOztBQUdMLFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMzQixZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDckMsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksY0FBYyxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDO0FBQzFHLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNmLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixlQUFPLENBQUMsNEJBQTRCLENBQUMsVUFBVSxLQUFLLEVBQUU7QUFDbEQsZ0JBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEIsbUJBQU8sSUFBSSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO0tBQ047O2lCQWRDLE9BQU87O2VBZ0JGLG1CQUFHOzs7QUFDTixnQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDaEIsb0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzdDLDBCQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDbkMsOEJBQUssS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQywrQkFBTyxFQUFFLENBQUM7cUJBQ2IsQ0FBQyxTQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDZCw4QkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUNmLENBQUMsQ0FBQztpQkFDTixDQUFDLENBQUM7YUFDTjtBQUNELG1CQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDeEI7OztlQUVHLGdCQUFHOzs7QUFDSCxnQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3RCLHVCQUFLLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDakMsMkJBQUssUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNqQywrQkFBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFLLE9BQU8sRUFBRSxPQUFLLFFBQVEsQ0FBQyxDQUFDO0FBQ2pFLCtCQUFLLFlBQVksR0FBRyxJQUFJLFlBQVksU0FBTyxPQUFLLElBQUksQ0FBQyxDQUFDO0FBQ3RELCtCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDL0IsbUNBQUssV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLE9BQUssT0FBTyxFQUFFLE9BQUssUUFBUSxDQUFDLENBQUM7QUFDaEUsbUNBQUssTUFBTSxHQUFHLElBQUksTUFBTSxRQUFNLENBQUM7QUFDL0IsbUNBQUssTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25CLG1DQUFLLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQzt5QkFDNUIsQ0FBQyxDQUFDO3FCQUNOLENBQUMsQ0FBQztpQkFDTixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7U0FDTjs7O2VBTUUsYUFBQyxHQUFHLEVBQUU7QUFDTCxnQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDYixvQkFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7YUFDNUQ7QUFDRCxrQkFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDNUI7OztlQUVJLGVBQUMsR0FBRyxFQUFFO0FBQ1Asa0JBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNiLG9CQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDN0Msb0JBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzdCO1NBQ0o7OztlQUVLLGtCQUFHO0FBQ0wsZ0JBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdkIsZ0JBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdkI7OzthQXRCUSxlQUFHO0FBQ1IsbUJBQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1NBQ3REOzs7V0FqREMsT0FBTzs7O0FBd0ViLElBQU0sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDekIsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM5RnBCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztJQUU5QyxNQUFNO2NBQU4sTUFBTTs7QUFDRyxhQURULE1BQU0sR0FDZTs4QkFEckIsTUFBTTs7MENBQ08sTUFBTTtBQUFOLGtCQUFNOzs7QUFDakIsbUNBRkYsTUFBTSw4Q0FFSyxNQUFNLEVBQUU7QUFDakIsWUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7S0FDdEI7O2lCQUpDLE1BQU07O2VBTUUsb0JBQUMsTUFBTSxFQUFFO0FBQ2YsZ0JBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsZ0JBQUksQ0FBQyxHQUFHLEVBQUU7QUFDTixvQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLHdCQUFPLE1BQU07QUFDVCx5QkFBSyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVE7QUFDM0IsOEJBQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDakMsOEJBQU07QUFBQSxBQUNWLHlCQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUztBQUM1Qiw4QkFBTSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3RDLDhCQUFNO0FBQUEsQUFDVix5QkFBSyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU87QUFDMUIsOEJBQU0sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEMsOEJBQU07QUFBQSxBQUNWLHlCQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUTtBQUMzQiw4QkFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNqQyw4QkFBTTtBQUFBLEFBQ1YseUJBQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXO0FBQzlCLDhCQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlCLDhCQUFNO0FBQUEsQUFDVix5QkFBSyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVU7QUFDN0IsOEJBQU0sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNuQyw4QkFBTTtBQUFBLEFBQ1YseUJBQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPO0FBQzFCLDhCQUFNLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hDLDhCQUFNO0FBQUEsQUFDVix5QkFBSyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU07QUFDekIsOEJBQU0sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEMsOEJBQU07QUFBQSxBQUNWLHlCQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUztBQUM1Qiw4QkFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMvQiw4QkFBTTtBQUFBLEFBQ1YseUJBQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0I7QUFDdkMsOEJBQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDL0IsOEJBQU07QUFBQSxBQUNWLHlCQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUTtBQUMzQiw4QkFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMvQiw4QkFBTTtBQUFBLEFBQ1Y7QUFDSSw4QkFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM5Qiw4QkFBTTtBQUFBLGlCQUNiO0FBQ0Qsb0JBQUksTUFBTSxFQUFFO0FBQ1IsdUJBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2hFLHdCQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztpQkFDL0I7YUFDSjtBQUNELG1CQUFPLEdBQUcsQ0FBQztTQUNkOzs7ZUFFRSxhQUFDLE1BQU0sRUFBYTtBQUNuQix1Q0F6REYsTUFBTSxxQ0F5RFE7QUFDWixnQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQyxnQkFBSSxNQUFNLEVBQUU7bURBSEQsTUFBTTtBQUFOLDBCQUFNOzs7QUFJYix1QkFBTyxNQUFNLENBQUMsR0FBRyxNQUFBLENBQVYsTUFBTSxFQUFRLE1BQU0sQ0FBQyxDQUFDO2FBQ2hDO1NBQ0o7OztXQTlEQyxNQUFNO0dBQVMsVUFBVTs7QUFrRS9CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7Ozs7Ozs7QUNyRXhCLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztJQUU5QyxVQUFVO0FBQ0QsYUFEVCxVQUFVLENBQ0EsUUFBUSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7OEJBRDFDLFVBQVU7O0FBRVIsWUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsWUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsWUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0IsWUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUM5Qzs7aUJBTkMsVUFBVTs7ZUFRVCxhQUFDLEVBQUUsRUFBYTtBQUNmLG1CQUFPLEtBQUssQ0FBQztTQUNoQjs7O2VBRVkseUJBQUc7QUFDWixnQkFBRyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ2pCLG9CQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDdEIsTUFBTTtBQUNILG9CQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDdkI7U0FDSjs7O2VBRVUsdUJBQUc7QUFDVixnQkFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsZ0JBQUksQ0FBQyxPQUFPLE1BQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2xEOzs7ZUFFVyx3QkFBRztBQUNYLGdCQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUN6QixnQkFBSSxDQUFDLE9BQU8sTUFBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbkQ7OztXQTVCQyxVQUFVOzs7QUErQmhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDakM1QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM5QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7SUFFOUMsT0FBTztjQUFQLE9BQU87O0FBQ0UsYUFEVCxPQUFPLEdBQ2M7OEJBRHJCLE9BQU87OzBDQUNNLE1BQU07QUFBTixrQkFBTTs7O0FBQ2pCLG1DQUZGLE9BQU8sOENBRUksTUFBTSxFQUFFO0tBQ3BCOztpQkFIQyxPQUFPOztlQUtOLGFBQUMsRUFBRSxFQUFhOzs7OytDQUFSLE1BQU07QUFBTixzQkFBTTs7O0FBQ2IsZ0RBTkYsT0FBTyxvREFNSyxFQUFFLFNBQUssTUFBTSxHQUFFO0FBQ3pCLGdCQUFJLENBQUMsRUFBRSxFQUFFO0FBQ0wsdUJBQU8sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQzthQUN6RDtBQUNELGdCQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sTUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDekUsb0JBQUksTUFBTSxHQUFHO0FBQ1QsOEJBQVUsT0FBSyxJQUFJLElBQUksRUFBRSxBQUFFO0FBQzNCLHlCQUFLLEVBQUU7QUFDSCw4QkFBTSxFQUFFLE1BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNO0FBQ2hDLDRCQUFJLEVBQUUsTUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDbkMsK0JBQU8sRUFBRSxNQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTztxQkFDckM7QUFDRCx3QkFBSSxFQUFFLE1BQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDbEMsK0JBQVcsRUFBRTtBQUNULDZCQUFLLEVBQUU7QUFDSCxnQ0FBSSxFQUFFLElBQUk7QUFDVixpQ0FBSyxFQUFFLElBQUksRUFBRTtBQUNqQiwyQkFBRyxFQUFFO0FBQ0QsZ0NBQUksRUFBRSxLQUFLO0FBQ1gsaUNBQUssRUFBRSxLQUFLLEVBQUU7cUJBQ3JCO2lCQUNKLENBQUE7QUFDRCxzQkFBSyxRQUFRLENBQUMsT0FBTyxNQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFVBQVUsRUFBSztBQUM3RSx3QkFBSSxTQUFTLEdBQUcsTUFBSyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sT0FBSyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBRyxDQUFDO0FBQ2hGLHdCQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDNUIsMEJBQUssUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLE9BQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFHLENBQUM7QUFDM0UsMEJBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVEsS0FBSyxDQUFHLENBQUM7aUJBQzFDLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztBQUNILG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFFUyxvQkFBQyxHQUFHLEVBQUU7QUFDWixnQkFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2QsZ0JBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRTtBQUMzQixtQkFBRyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUM7YUFDM0IsTUFBTTtBQUNILG9CQUFJLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLG9CQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDWixvQkFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlDLHdCQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqQyx3QkFBSSxJQUFJLEVBQUU7QUFDTiw0QkFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLDJCQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLDJCQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2xEO2lCQUNKO0FBQ0QsbUJBQUcsZ0JBQWMsR0FBRyxNQUFHLENBQUM7YUFDM0I7QUFDRCxtQkFBTyxHQUFHLENBQUM7U0FDZDs7O1dBeERDLE9BQU87R0FBUyxVQUFVOztBQTJEaEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM5RHpCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM5QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNwRCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7SUFFeEMsT0FBTztjQUFQLE9BQU87O0FBQ0UsYUFEVCxPQUFPLEdBQ2M7OEJBRHJCLE9BQU87OzBDQUNNLE1BQU07QUFBTixrQkFBTTs7O0FBQ2pCLG1DQUZGLE9BQU8sOENBRUksTUFBTSxFQUFFO0tBQ3BCOztpQkFIQyxPQUFPOztlQUtOLGFBQUMsRUFBRSxFQUFhOzs7K0NBQVIsTUFBTTtBQUFOLHNCQUFNOzs7QUFDYixnREFORixPQUFPLG9EQU1LLEVBQUUsU0FBSyxNQUFNLEdBQUU7QUFDekIsYUFBQyxPQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEQsZ0JBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEcsd0JBQUEsSUFBSSxDQUFDLE9BQU8sYUFBRyxZQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFLLE1BQU0sRUFBQyxDQUFDO0FBQ3BFLHlCQUFBLElBQUksQ0FBQyxPQUFPLGFBQUcsYUFBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBSyxNQUFNLEVBQUMsQ0FBQztBQUM1RSxnQkFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUVwQixtQkFBTyxJQUFJLENBQUM7U0FDZjs7O1dBZEMsT0FBTztHQUFTLFVBQVU7O0FBaUJoQyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3RCekIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDOUMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDcEQsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUV0QixTQUFTO2NBQVQsU0FBUzs7QUFDQSxhQURULFNBQVMsR0FDWTs4QkFEckIsU0FBUzs7MENBQ0ksTUFBTTtBQUFOLGtCQUFNOzs7QUFDakIsbUNBRkYsU0FBUyw4Q0FFRSxNQUFNLEVBQUU7S0FDcEI7O2lCQUhDLFNBQVM7O2VBS1IsYUFBQyxFQUFFLEVBQWE7OzsrQ0FBUixNQUFNO0FBQU4sc0JBQU07OztBQUNiLGdEQU5GLFNBQVMsb0RBTUcsRUFBRSxTQUFLLE1BQU0sR0FBRTtBQUN6QixxQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUIsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztlQUVlLG1CQUFDLEdBQUcsRUFBK0I7Z0JBQTdCLElBQUkseURBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJOztBQUM3QyxnQkFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUMsZ0JBQUk7QUFDQSxpQkFBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBQyxFQUFFLEVBQUs7QUFDaEIsMkJBQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxNQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBRyxDQUFDO0FBQ2xFLDJCQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsTUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUcsQ0FBQztpQkFDckUsQ0FBQyxDQUFDO2FBQ04sQ0FBQyxPQUFNLENBQUMsRUFBRSxFQUVWLFNBQVM7QUFDTix1QkFBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0I7U0FDSjs7O1dBdkJDLFNBQVM7R0FBUyxVQUFVOztBQTBCbEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM5QjNCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztJQUV4QyxRQUFRO2NBQVIsUUFBUTs7QUFDQyxhQURULFFBQVEsR0FDYTs4QkFEckIsUUFBUTs7MENBQ0ssTUFBTTtBQUFOLGtCQUFNOzs7QUFDakIsbUNBRkYsUUFBUSw4Q0FFRyxNQUFNLEVBQUU7QUFDakIsWUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0tBQ25DOztpQkFKQyxRQUFROztlQU1QLGVBQUc7QUFDRix1Q0FQRixRQUFRLHFDQU9NO0FBQ1osZ0JBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUNqQyxtQkFBTyxJQUFJLENBQUM7U0FDZjs7O1dBVkMsUUFBUTtHQUFTLFVBQVU7O0FBYWpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDZjFCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM5QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNwRCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7SUFFckMsSUFBSTtjQUFKLElBQUk7O0FBQ0ssYUFEVCxJQUFJLEdBQ2lCOzhCQURyQixJQUFJOzswQ0FDUyxNQUFNO0FBQU4sa0JBQU07OztBQUNqQixtQ0FGRixJQUFJLDhDQUVPLE1BQU0sRUFBRTtLQUNwQjs7aUJBSEMsSUFBSTs7ZUFLSCxhQUFDLEVBQUUsRUFBYTs7OytDQUFSLE1BQU07QUFBTixzQkFBTTs7O0FBQ2IsZ0RBTkYsSUFBSSxvREFNUSxFQUFFLFNBQUssTUFBTSxHQUFFO0FBQ3pCLGFBQUMsT0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2xELGdCQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNGLHdCQUFBLElBQUksQ0FBQyxPQUFPLGFBQUcsWUFBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBSyxNQUFNLEVBQUMsQ0FBQztBQUN6RSxnQkFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3BCLG1CQUFPLElBQUksQ0FBQztTQUNmOzs7V0FaQyxJQUFJO0dBQVMsVUFBVTs7QUFlN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNwQnRCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3BELElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7SUFFdEIsTUFBTTtjQUFOLE1BQU07O0FBQ0csYUFEVCxNQUFNLEdBQ2U7OEJBRHJCLE1BQU07OzBDQUNPLE1BQU07QUFBTixrQkFBTTs7O0FBQ2pCLG1DQUZGLE1BQU0sOENBRUssTUFBTSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDOUM7O2lCQUpDLE1BQU07O2VBTUwsYUFBQyxFQUFFLEVBQWE7OzsrQ0FBUixNQUFNO0FBQU4sc0JBQU07OztBQUNiLGdEQVBGLE1BQU0sb0RBT00sRUFBRSxTQUFLLE1BQU0sR0FBRTtBQUN6QixnQkFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN0QixtQkFBTyxJQUFJLENBQUM7U0FDZjs7O1dBVkMsTUFBTTtHQUFTLFVBQVU7O0FBYS9CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDakJ4QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDNUIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDOUMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDcEQsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0lBRXhDLE1BQU07Y0FBTixNQUFNOztBQUNHLGFBRFQsTUFBTSxHQUNlOzhCQURyQixNQUFNOzswQ0FDTyxNQUFNO0FBQU4sa0JBQU07OztBQUNqQixtQ0FGRixNQUFNLDhDQUVLLE1BQU0sRUFBRTtLQUNwQjs7aUJBSEMsTUFBTTs7ZUFLTCxhQUFDLEVBQUUsRUFBYTs7OytDQUFSLE1BQU07QUFBTixzQkFBTTs7O0FBQ2IsZ0RBTkYsTUFBTSxvREFNTSxFQUFFLFNBQUssTUFBTSxHQUFFO0FBQ3pCLGFBQUMsT0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2xELGdCQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlGLHdCQUFBLElBQUksQ0FBQyxPQUFPLGFBQUcsWUFBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBSyxNQUFNLEVBQUMsQ0FBQztBQUNoRSx5QkFBQSxJQUFJLENBQUMsT0FBTyxhQUFHLGFBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQUssTUFBTSxFQUFDLENBQUM7QUFDNUUsZ0JBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFcEIsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztXQWRDLE1BQU07R0FBUyxVQUFVOztBQWlCL0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN0QnhCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztJQUU5QyxNQUFNO2NBQU4sTUFBTTs7QUFDRyxhQURULE1BQU0sR0FDZTs4QkFEckIsTUFBTTs7MENBQ08sTUFBTTtBQUFOLGtCQUFNOzs7QUFDakIsbUNBRkYsTUFBTSw4Q0FFSyxNQUFNLEVBQUU7S0FDcEI7O2lCQUhDLE1BQU07O2VBS0wsZUFBRzs7O0FBQ0YsdUNBTkYsTUFBTSxxQ0FNUTtBQUNaLGdCQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sTUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUN6RSxvQkFBSSxNQUFNLEdBQUc7QUFDVCw4QkFBVSxPQUFLLElBQUksSUFBSSxFQUFFLEFBQUU7QUFDM0IseUJBQUssRUFBRTtBQUNILDhCQUFNLEVBQUUsTUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU07QUFDaEMsNEJBQUksRUFBRSxNQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVztBQUNuQywrQkFBTyxFQUFFLE1BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPO3FCQUNyQztBQUNELHdCQUFJLEVBQUUsa0JBQWtCO0FBQ3hCLCtCQUFXLEVBQUU7QUFDVCw2QkFBSyxFQUFFO0FBQ0gsZ0NBQUksRUFBRSxJQUFJO0FBQ1YsaUNBQUssRUFBRSxJQUFJLEVBQUU7QUFDakIsMkJBQUcsRUFBRTtBQUNELGdDQUFJLEVBQUUsS0FBSztBQUNYLGlDQUFLLEVBQUUsS0FBSyxFQUFFO3FCQUNyQjtpQkFDSixDQUFBO0FBQ0Qsb0JBQUksU0FBUyxHQUFHLE1BQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLE9BQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUcsQ0FBQztBQUNoRixvQkFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzVCLHNCQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxPQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBRyxDQUFDO0FBQ3ZFLHNCQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFRLEtBQUssQ0FBRyxDQUFDO2FBQzFDLENBQUMsQ0FBQztBQUNILG1CQUFPLElBQUksQ0FBQztTQUNmOzs7V0EvQkMsTUFBTTtHQUFTLFVBQVU7O0FBa0MvQixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3JDeEIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3BELElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOztJQUV0RCxPQUFPO2NBQVAsT0FBTzs7QUFDRSxhQURULE9BQU8sR0FDYzs4QkFEckIsT0FBTzs7MENBQ00sTUFBTTtBQUFOLGtCQUFNOzs7QUFDakIsbUNBRkYsT0FBTyw4Q0FFSSxNQUFNLEVBQUU7S0FDcEI7O2lCQUhDLE9BQU87O2VBS04sYUFBQyxFQUFFLEVBQWE7Ozs7K0NBQVIsTUFBTTtBQUFOLHNCQUFNOzs7QUFDYixnREFORixPQUFPLG9EQU1LLEVBQUUsU0FBSyxNQUFNLEdBQUU7QUFDekIsYUFBQyxPQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEQsZ0JBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxNQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN0RSxvQkFBSSxHQUFHLEVBQUU7OztBQUNMLHdCQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xHLHVCQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNaLGdDQUFBLE1BQUssT0FBTyxhQUFHLFlBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFLLE1BQU0sRUFBQyxDQUFDO0FBQzNFLGlDQUFBLE1BQUssT0FBTyxhQUFHLGFBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxTQUFLLE1BQU0sRUFBQyxDQUFDO0FBQzVELGlDQUFBLE1BQUssT0FBTyxhQUFHLGFBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFLLE1BQU0sRUFBQyxDQUFDO2lCQUN6RDthQUNKLENBQUMsQ0FBQztBQUNILG1CQUFPLElBQUksQ0FBQztTQUNmOzs7V0FsQkMsT0FBTztHQUFTLFVBQVU7O0FBcUJoQyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7OztBQzFCekIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUMxQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtBQUNuRCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQTs7SUFFNUMsWUFBWTtjQUFaLFlBQVk7O0FBQ0gsYUFEVCxZQUFZLEdBQ1M7OEJBRHJCLFlBQVk7OzBDQUNDLE1BQU07QUFBTixrQkFBTTs7O0FBQ2pCLG1DQUZGLFlBQVksOENBRUQsTUFBTSxFQUFFO0tBQ3BCOztpQkFIQyxZQUFZOztlQUtYLGFBQUMsRUFBRSxFQUFhOzs7K0NBQVIsTUFBTTtBQUFOLHNCQUFNOzs7QUFDYixnREFORixZQUFZLG9EQU1BLEVBQUUsU0FBSyxNQUFNLEdBQUU7QUFDekIsYUFBQyxPQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEQsZ0JBQUksRUFBRSxFQUFFO0FBQ0osb0JBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUcsbUJBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QixvQkFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3RCO0FBQ0QsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztXQWRDLFlBQVk7R0FBUyxVQUFVOztBQWlCckMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN0QjlCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM5QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNwRCxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQTs7SUFFMUIsUUFBUTtjQUFSLFFBQVE7O0FBQ0MsYUFEVCxRQUFRLEdBQ2E7OEJBRHJCLFFBQVE7OzBDQUNLLE1BQU07QUFBTixrQkFBTTs7O0FBQ2pCLG1DQUZGLFFBQVEsOENBRUcsTUFBTSxFQUFFO0tBQ3BCOztpQkFIQyxRQUFROztlQUtQLGFBQUMsRUFBRSxFQUFhOzs7OytDQUFSLE1BQU07QUFBTixzQkFBTTs7O0FBQ2IsZ0RBTkYsUUFBUSxvREFNSSxFQUFFLFNBQUssTUFBTSxHQUFFO0FBQ3pCLGdCQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sTUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDdEUsbUJBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFBO0FBQ1gsd0JBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQTtBQUMxQixzQkFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFBO2FBQzdCLENBQUMsQ0FBQztBQUNILG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFFUyxhQUFDLEdBQUcsRUFBRTtBQUNaLGdCQUFJLEdBQUcsRUFBRTtBQUNMLG9CQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDeEgscUJBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7YUFDcEI7U0FDSjs7O1dBcEJDLFFBQVE7R0FBUyxVQUFVOztBQXVCakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM1QjFCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM5QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNwRCxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7SUFFdkMsS0FBSztjQUFMLEtBQUs7O0FBQ0ksYUFEVCxLQUFLLEdBQ2dCOzhCQURyQixLQUFLOzswQ0FDUSxNQUFNO0FBQU4sa0JBQU07OztBQUNqQixtQ0FGRixLQUFLLDhDQUVNLE1BQU0sRUFBRTtLQUNwQjs7aUJBSEMsS0FBSzs7ZUFLSixhQUFDLEVBQUUsRUFBYTs7OytDQUFSLE1BQU07QUFBTixzQkFBTTs7O0FBQ2IsZ0RBTkYsS0FBSyxvREFNTyxFQUFFLFNBQUssTUFBTSxHQUFFO0FBQ3pCLGFBQUMsT0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2xELGdCQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVGLHdCQUFBLElBQUksQ0FBQyxPQUFPLGFBQUcsWUFBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxzQkFBc0IsRUFBRSxTQUFLLE1BQU0sRUFBQyxDQUFDO0FBQ3pGLGdCQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDcEIsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztXQVpDLEtBQUs7R0FBUyxVQUFVOztBQWU5QixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7Ozs7Ozs7O0FDcEJ2QixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkMsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUUzQixJQUFNLE1BQU0sR0FBRyxTQUFULE1BQU0sR0FBUztBQUNqQixRQUFNLEtBQUssR0FBRztBQUNWLG1CQUFXLEVBQUU7QUFDVCxjQUFFLEVBQUUsa0JBQWtCO1NBQ3pCO0tBQ0osQ0FBQTs7QUFFRCxRQUFNLEdBQUcsR0FBRztBQUNSLFlBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUk7QUFDMUIsWUFBSSxFQUFFLEVBQUU7S0FDWCxDQUFBO0FBQ0QsUUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsUUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLFFBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtBQUNqQixhQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3ZCO0FBQ0QsU0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTVCLFlBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTs7QUFFdkIsYUFBSyxXQUFXLENBQUM7QUFDakIsYUFBSyxrQkFBa0IsQ0FBQztBQUN4QjtBQUNJLGVBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUM3QixrQkFBTTtBQUFBLEtBQ2I7O0FBRUQsV0FBTyxHQUFHLENBQUM7Q0FDZCxDQUFDOztJQUVJLE1BQU07QUFFRyxhQUZULE1BQU0sQ0FFSSxJQUFJLEVBQUU7OEJBRmhCLE1BQU07O0FBR0osWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUN2QixZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM3Qzs7aUJBTkMsTUFBTTs7ZUFZRCxtQkFBRzs7O0FBQ04sZ0JBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2hCLG9CQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUM3QywwQkFBSyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFDLElBQUksRUFBSztBQUNqQyw4QkFBSyxRQUFRLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQUMsTUFBTSxFQUFLO0FBQzNDLGdDQUFJO0FBQ0EsaUNBQUMsQ0FBQyxNQUFNLENBQUMsTUFBSyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pDLHNDQUFLLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQzVCLHNDQUFLLElBQUksRUFBRSxDQUFDO0FBQ1osdUNBQU8sQ0FBQyxNQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs2QkFDN0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNSLHNDQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ2I7eUJBQ0osQ0FBQyxDQUFDO3FCQUNOLENBQUMsQ0FBQztpQkFDTixDQUFDLENBQUM7YUFDTjs7QUFFRCxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3hCOzs7ZUFFRyxnQkFBRztBQUNILG1CQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN6Qjs7O2FBM0JPLGVBQUc7QUFDUCxtQkFBTyxVQUFVLENBQUM7U0FDckI7OztXQVZDLE1BQU07OztBQXNDWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7Ozs7Ozs7O0FDdkV4QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDNUIsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBOztJQUVyQixPQUFPO0FBRUUsYUFGVCxPQUFPLENBRUcsT0FBTyxFQUFFOzhCQUZuQixPQUFPOztBQUlMLFlBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXRCLFlBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBO0tBQ25COztpQkFQQyxPQUFPOztlQVNKLGVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7QUFTbkIsZ0JBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUIsYUFBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBTTtBQUNqQixzQkFBSyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQzlCLHNCQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1NBQ047OztlQUVLLGdCQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7OztBQUNwQixnQkFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixhQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFNO0FBQ2pCLG9CQUFJLENBQUMsUUFBUSxFQUFFO0FBQ1gsMkJBQU8sT0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsMkJBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNuQixNQUFNO0FBQ0gsMkJBQUssR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDN0I7YUFDSixDQUFDLENBQUM7U0FDTjs7O2VBQ0MsYUFBQyxLQUFLLEVBQWE7Ozs4Q0FBUixNQUFNO0FBQU4sc0JBQU07OztBQUNmLGdCQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLGFBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDakIsdUJBQUssT0FBTyxNQUFBLFVBQUMsS0FBSyxTQUFLLE1BQU0sRUFBQyxDQUFDO2FBQ2xDLENBQUMsQ0FBQztTQUNOOzs7V0F6Q0MsT0FBTzs7O0FBNkNiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7Ozs7QUNoRHpCLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDL0IsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ2pDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTs7SUFFbEMsUUFBUTtBQUVDLGFBRlQsUUFBUSxDQUVFLE1BQU0sRUFBRTs4QkFGbEIsUUFBUTs7QUFHTixZQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixZQUFJLENBQUMsRUFBRSxHQUFHLElBQUksUUFBUSxjQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUscUJBQWtCLENBQUM7S0FDM0U7O2lCQUxDLFFBQVE7O2VBY0wsaUJBQUc7OztBQUNKLGdCQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNkLG9CQUFJLENBQUMsTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUMzQywwQkFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQzVCLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSzs7QUFFZiw4QkFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0FBQ3JELGtDQUFNLEVBQUUsTUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO0FBQ2xDLG9DQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7QUFDMUIsb0NBQVEsRUFBRSxVQUFVO3lCQUN2QixFQUFFLFVBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFLO0FBQzFCLGdDQUFJLEdBQUcsRUFBRTtBQUNMLHNDQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7NkJBQ2YsTUFBTTtBQUNILHVDQUFPLENBQUMsY0FBYyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztBQUNuRCxzQ0FBSyxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO0FBQ2hELDJDQUFXLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLE1BQUssY0FBYyxDQUFDLENBQUM7QUFDM0Qsc0NBQUssRUFBRSxDQUFDLG1CQUFtQixDQUFDLE1BQUssY0FBYyxFQUFFLFVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBZ0I7QUFDN0Usd0NBQUksS0FBSyxFQUFFO0FBQ1AsOENBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQiw4Q0FBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FDQUNqQixNQUFNO0FBQ0gsK0NBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztxQ0FDckI7aUNBQ0osQ0FBQyxDQUFDOzZCQUNOO3lCQUNKLENBQUMsQ0FBQztxQkFDTixDQUFDLFNBQ0ksQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNaLCtCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLGlDQUFTO3FCQUNaLENBQUMsQ0FBQztpQkFDVixDQUFDLENBQUM7QUFDSCxvQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQy9CO0FBQ0QsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0Qjs7O2VBRU0sbUJBQUc7QUFDTixnQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDaEIsb0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzdDLDJCQUFPLEVBQUUsQ0FBQztpQkFDYixDQUFDLENBQUM7YUFDTjtBQUNELG1CQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDeEI7OztlQUVPLGtCQUFDLElBQUksRUFBRTtBQUNYLG1CQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCOzs7ZUFFTSxpQkFBQyxJQUFJLEVBQUU7OztBQUNWLG1CQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUM3QixvQkFBSSxLQUFLLEdBQUcsT0FBSyxFQUFFLENBQUM7QUFDcEIsb0JBQUksSUFBSSxFQUFFO0FBQ04seUJBQUssR0FBRyxPQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDL0I7QUFDRCx1QkFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7O0FBRXBDLHlCQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFDZCxVQUFDLFFBQVEsRUFBSztBQUNWLDRCQUFJLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsNEJBQUk7QUFDQSxtQ0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3lCQUNqQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1IsbUNBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDekI7cUJBQ0osRUFDRCxVQUFDLEtBQUssRUFBSztBQUNQLCtCQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEIsOEJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDakIsQ0FBQyxDQUFDO2lCQUNWLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOOzs7ZUFFQyxZQUFDLElBQUksRUFBRSxRQUFRLEVBQW1COzs7Z0JBQWpCLEtBQUsseURBQUcsT0FBTzs7QUFDOUIsZ0JBQUksSUFBSSxFQUFFO0FBQ04sb0JBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUN0Qix3QkFBSSxLQUFLLEdBQUcsT0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsd0JBQUksTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFJLFFBQVEsRUFBSztBQUN2Qiw0QkFBSTtBQUNBLGdDQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQ3BCLHFDQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6QixzQ0FBTSxJQUFJLEtBQUssMEJBQXdCLElBQUksQ0FBRyxDQUFDOzZCQUNsRDtBQUNELGdDQUFJLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsb0NBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDbEIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNSLGlDQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6QixtQ0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3lCQUN2QjtxQkFDSixDQUFDO0FBQ0YseUJBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUMzQixDQUFDLENBQUM7YUFDTjtTQUNKOzs7ZUFFRSxhQUFDLElBQUksRUFBRSxNQUFNLEVBQVksUUFBUSxFQUFFOzs7Z0JBQTVCLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLE9BQU87O0FBQ3RCLGdCQUFJLElBQUksRUFBRTtBQUNOLG9CQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDdEIsd0JBQUksS0FBSyxHQUFHLE9BQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLHdCQUFJLFFBQVEsRUFBRTtBQUNWLDZCQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztxQkFDL0IsTUFBTTtBQUNILDZCQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNyQjtpQkFDSixDQUFDLENBQUM7YUFDTjtTQUNKOzs7ZUFFTSxpQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFDaEIsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDcEIsZ0JBQUksSUFBSSxFQUFFO0FBQ04scUJBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9CO0FBQ0QsZ0JBQUk7QUFDQSx1QkFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFDLENBQUMsRUFBSztBQUMxQix3QkFBSSxDQUFDLEVBQUU7QUFDSCwrQkFBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN2QjtpQkFDSixDQUFDLENBQUM7YUFDTixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1Isb0JBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3ZCO1NBQ0o7OztlQUVTLG9CQUFDLElBQUksRUFBRTtBQUNiLG1CQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ25DOzs7ZUFFTyxrQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFDakIsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDcEIsZ0JBQUksSUFBSSxFQUFFO0FBQ04scUJBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9CO0FBQ0QsZ0JBQUk7QUFDQSx1QkFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFDLENBQUMsRUFBSztBQUMzQix3QkFBSSxDQUFDLEVBQUU7QUFDSCwrQkFBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN2QjtpQkFDSixDQUFDLENBQUM7YUFDTixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1Isb0JBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3ZCO1NBQ0o7OztlQUVtQiw4QkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTs7O0FBQ3ZDLGdCQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3BCLGdCQUFJLElBQUksRUFBRTtBQUNOLHFCQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvQjtBQUNELGdCQUFJO0FBQ0EsdUJBQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFDLFlBQVksRUFBSztBQUN2Qyx3QkFBSTtBQUNBLCtCQUFPLElBQUksQ0FBQztxQkFDZixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1IsK0JBQUssS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDdkI7aUJBQ0osQ0FBQyxDQUFDO2FBQ04sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNSLG9CQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN2QjtTQUNKOzs7ZUFFSSxlQUFDLENBQUMsRUFBRSxJQUFJLEVBQUU7QUFDWCxnQkFBSSxDQUFDLEVBQUU7QUFDSCxvQkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekI7QUFDRCxnQkFBSSxJQUFJLEVBQUU7QUFDTixvQkFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLDRCQUEwQixJQUFJLEFBQUUsRUFBRSxDQUFDLENBQUM7YUFDbkU7U0FDSjs7O2VBRUssa0JBQUc7QUFDTCxnQkFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLHVCQUFXLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDekMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDcEI7OzthQTFMVSxlQUFHO0FBQ1YsZ0JBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2hCLG9CQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2FBQy9DO0FBQ0QsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN4Qjs7O1dBWkMsUUFBUTs7O0FBbU1kLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7QUN2TTFCLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTs7SUFFckIsWUFBWTtBQUVOLFVBRk4sWUFBWSxDQUVMLE9BQU8sRUFBRSxJQUFJLEVBQUU7d0JBRnRCLFlBQVk7O0FBR2hCLE1BQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUM3QixNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixNQUFJLENBQUMsU0FBUyxHQUFHO0FBQ2hCLFNBQU0sRUFBRSxPQUFPLENBQUMsd0JBQXdCLENBQUM7QUFDekMsV0FBUSxFQUFFLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQztBQUNwQyxVQUFPLEVBQUUsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0FBQzNDLFVBQU8sRUFBRSxPQUFPLENBQUMseUJBQXlCLENBQUM7R0FDcEQsQ0FBQztFQUNGOztjQVpJLFlBQVk7O1NBY2IsZ0JBQUc7OztBQUNBLElBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUs7QUFDdEMsUUFBSSxPQUFPLEVBQUU7QUFDckIsU0FBSTtBQUNILFVBQUksTUFBTSxHQUFHLE1BQUssTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxZQUFLLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO0FBQzVDLFlBQUssSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsWUFBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztNQUNyQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1gsWUFBSyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3RCO0tBQ0Q7SUFDSyxDQUFDLENBQUM7R0FDTjs7O1NBRUcsbUJBQUc7OztBQUNULElBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUs7QUFDaEMsUUFBSSxJQUFJLEVBQUU7QUFDTixTQUFJO0FBQ0EsYUFBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztNQUN4QixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1IsYUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNwQjtLQUNiO0lBQ0ssQ0FBQyxDQUFDO0dBQ1Q7OztTQUVRLG1CQUFDLEdBQUcsRUFBYTs7O3FDQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDakIsT0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ3JCLEtBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUs7QUFDdEMsU0FBSSxJQUFJLEVBQUU7QUFDTixVQUFJOzs7QUFDQSxnQkFBQSxPQUFLLElBQUksQ0FBQyxFQUFDLFNBQVMsTUFBQSxTQUFDLEdBQUcsU0FBSyxNQUFNLEVBQUMsQ0FBQztPQUN4QyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1IsY0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNsQjtNQUNKO0tBQ0osQ0FBQyxDQUFDO0lBQ047R0FDUDs7O1NBRVMsc0JBQUcsRUFFWjs7O1NBRUssa0JBQUc7OztBQUNSLElBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUs7QUFDaEMsUUFBSSxJQUFJLEVBQUU7QUFDbEIsU0FBSTtBQUNILGFBQUssSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7TUFDcEIsQ0FBQyxPQUFNLENBQUMsRUFBRTtBQUNWLGFBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN0QjtLQUNEO0lBQ0ssQ0FBQyxDQUFDO0dBQ1Q7OztRQXJFSSxZQUFZOzs7QUF5RWxCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDOzs7Ozs7Ozs7SUMzRXhCLFdBQVc7QUFFRixhQUZULFdBQVcsQ0FFRCxHQUFHLEVBQUU7OEJBRmYsV0FBVzs7QUFHVCxZQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtBQUNkLFlBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0tBQzFDOztpQkFMQyxXQUFXOztlQU9OLG1CQUFHO0FBQ04sbUJBQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtTQUNsRDs7O2VBRU0sbUJBQUc7QUFDTixtQkFBTyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO1NBQ2xEOzs7ZUFFUyxzQkFBRztBQUNULG1CQUFPLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtTQUN2RTs7O2VBRVcsd0JBQUc7QUFDWCxtQkFBTyxJQUFJLENBQUMsR0FBRyxJQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxLQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQUFBQyxJQUMvRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEFBQUMsQ0FBQTtTQUNsRjs7O2VBRVcsd0JBQUc7QUFDWCxtQkFBTyxJQUFJLENBQUMsR0FBRyxJQUNYLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxBQUFDLElBQzlHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEFBQUMsQ0FBQTtTQUNoRjs7O1dBaENDLFdBQVc7OztBQW1DakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUNsQzdCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7SUFFOUMsTUFBTTtBQUNHLGFBRFQsTUFBTSxDQUNJLE9BQU8sRUFBRTs4QkFEbkIsTUFBTTs7QUFFSixZQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFDekMsWUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3pCLFlBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUN2QyxZQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDL0IsWUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7S0FDekI7O2lCQVBDLE1BQU07O2VBU0osZ0JBQUc7OztBQUNILGdCQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsS0FBSyxDQUFDLFVBQUMsTUFBTSxFQUFzQztrREFBWCxNQUFNO0FBQU4sMEJBQU07Ozs7O29CQUEvQixFQUFFLHlEQUFHLEVBQUU7b0JBQUUsTUFBTSx5REFBRyxFQUFFOztBQUNwQyxzQkFBSyxJQUFJLEdBQUcsTUFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWpDLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBSyxJQUFJLENBQUMsQ0FBQztBQUNqQyxnQ0FBQSxNQUFLLFdBQVcsRUFBQyxRQUFRLE1BQUEsZ0JBQUMsTUFBSyxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sU0FBSyxNQUFNLEVBQUMsQ0FBQzs7QUFFNUQsc0JBQUssT0FBTyxNQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEQsQ0FBQyxDQUFDO0FBQ0gsZ0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzdCOzs7ZUFpQmMsMkJBQWE7Z0JBQVosTUFBTSx5REFBRyxDQUFDOztBQUN0QixnQkFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2xCLGdCQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDdkMsZ0JBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNiLG9CQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUM1RDtBQUNELG1CQUFPLElBQUksQ0FBQztTQUNmOzs7ZUFNSSxlQUFDLElBQUksRUFBRTtBQUNSLGdCQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0Qzs7O2VBRVMsb0JBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNuQixnQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQixnQkFBSSxJQUFJLEVBQUU7QUFDTixvQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDeEIsTUFBTTtBQUNILG9CQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzthQUN6QjtTQUNKOzs7ZUFFTSxpQkFBQyxJQUFJLEVBQUU7QUFDVixnQkFBSSxJQUFJLEVBQUU7QUFDTix1QkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDakQsd0JBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNKO0FBQ0QsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztlQUVDLFlBQUMsSUFBSSxFQUFFO0FBQ0wsZ0JBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLElBQUksRUFBRTtBQUNOLG9CQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM1QixvQkFBSSxDQUFDLEtBQUssTUFBSSxJQUFJLENBQUcsQ0FBQzthQUN6QjtTQUNKOzs7ZUFFRyxnQkFBRztBQUNILGdCQUFJLElBQUksR0FBRyxNQUFNLENBQUM7QUFDbEIsZ0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUN2QyxnQkFBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxXQUFXLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQSxBQUFDLEVBQUU7QUFDeEYsb0JBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ3pCLG9CQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDZix1QkFBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDdkQsMEJBQU0sSUFBSSxDQUFDLENBQUM7QUFDWix3QkFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3ZDO2FBQ0o7QUFDRCxtQkFBTyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hCOzs7ZUFTUSxtQkFBQyxJQUFJLEVBQUU7QUFDWixnQkFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixtQkFBTyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDakMsdUJBQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdCLENBQUMsQ0FBQztTQUNOOzs7YUFwRmMsZUFBRztBQUNkLGdCQUFJLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUM7QUFDMUMsZ0JBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLG9CQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDdkMsb0JBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNiLHdCQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkQ7YUFDSjtBQUNELG1CQUFPLElBQUksQ0FBQztTQUNmOzs7YUFFYyxlQUFHO0FBQ2QsbUJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztTQUNwQjs7O2FBV2UsZUFBRztBQUNmLG1CQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEM7OzthQThDYSxlQUFHO0FBQ2IsZ0JBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ25CLG9CQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMvTDtBQUNELG1CQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDM0I7OztXQW5HQyxNQUFNOzs7QUE2R1osTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Ozs7Ozs7OztBQ2pIeEIsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzFDLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzQixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQTs7QUFFbkQsSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksR0FBRyxFQUFLO0FBQ3BCLFFBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNoQixRQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLEtBQUssRUFBRTtBQUMvQixXQUFHLEdBQUcsR0FBRyxDQUFDO0tBQ2IsTUFBTTtBQUNILFlBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ2pFLGVBQUcsR0FBRyxJQUFJLENBQUM7U0FDZDtLQUNKO0FBQ0QsV0FBTyxHQUFHLENBQUM7Q0FDZCxDQUFBOztJQUVLLE9BQU87QUFFRSxhQUZULE9BQU8sQ0FFRyxJQUFJLEVBQUU7OEJBRmhCLE9BQU87O0FBR0wsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDeEMsWUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztLQUNyQzs7aUJBTkMsT0FBTzs7ZUFRRCxrQkFBQyxHQUFHLEVBQUUsUUFBUSxFQUF1QztnQkFBckMsSUFBSSx5REFBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7QUFDdkQsZ0JBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUU7QUFDMUMsb0JBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQ2Isd0JBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2Qix5QkFBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3pCLHdCQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZiwyQkFBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2lCQUN4QixFQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxTQUFJLEdBQUcsQ0FBQyxFQUFFLHFCQUFnQixRQUFRLENBQUMsRUFBRSxDQUFHLENBQUE7QUFDeEUsb0JBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ2QseUJBQUssRUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsdUJBQWtCLEdBQUcsQ0FBQyxJQUFJLGdCQUFhO0FBQ3RFLHlCQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDYix3QkFBSSxFQUFFLFNBQVMsQ0FBQyxZQUFZLENBQUMsR0FBRztBQUNoQyx3QkFBSSxPQUFLLElBQUksSUFBSSxFQUFFLEFBQUU7aUJBQ3hCLE9BQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBRyxDQUFBO2FBQzlEO1NBQ0o7OztlQUVVLHFCQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDdkIsZ0JBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUU7QUFDMUMsb0JBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxTQUFJLEdBQUcsQ0FBQyxFQUFFLHFCQUFnQixRQUFRLENBQUMsRUFBRSxDQUFHLENBQUE7QUFDekYsb0JBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ2QseUJBQUssRUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsd0JBQW1CLEdBQUcsQ0FBQyxJQUFJLGtDQUErQjtBQUN6Rix3QkFBSSxPQUFLLElBQUksSUFBSSxFQUFFLEFBQUU7aUJBQ3hCLE9BQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBRyxDQUFBO2FBQzlEO1NBQ0o7OztlQUVRLG1CQUFDLEtBQUssRUFBRSxRQUFRLEVBQXVDO2dCQUFyQyxJQUFJLHlEQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1NBRTdEOzs7V0FyQ0MsT0FBTzs7O0FBeUNiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBOzs7Ozs7Ozs7QUN6RHhCLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN2QyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDMUMsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzNCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTs7SUFFN0IsS0FBSztBQUVJLGFBRlQsS0FBSyxDQUVLLE1BQU0sRUFBRSxPQUFPLEVBQUU7OEJBRjNCLEtBQUs7O0FBR0gsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsWUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsWUFBVSxFQUV2QyxDQUFDLENBQUM7S0FDTjs7aUJBVEMsS0FBSzs7ZUFXRixpQkFBRzs7O0FBQ0osZ0JBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2Qsb0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzNDLHdCQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVMsR0FBUztBQUNsQiw4QkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ1gsb0NBQVEsRUFBRSxLQUFLO0FBQ2YsNENBQWdCLEVBQUUsSUFBSTtBQUN0QixzQ0FBVSxFQUFFO0FBQ1IscUNBQUssRUFBRSx1QkFBdUI7NkJBQ2pDO3lCQUNKLEVBQUUsVUFBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBSztBQUN2RCxnQ0FBSSxHQUFHLEVBQUU7QUFDTCxzQ0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDOzZCQUM1QixNQUFNO0FBQ0gsc0NBQUssTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3RDLDJDQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFLLE1BQU0sQ0FBQyxDQUFDOztBQUUzQyxzQ0FBSyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDNUMsMkNBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQUssUUFBUSxDQUFDLENBQUM7O0FBRS9DLHNDQUFLLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsMkNBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE1BQUssT0FBTyxDQUFDLENBQUM7O0FBRTdDLHNDQUFLLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztBQUMzRCxzQ0FBSyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzZCQUN2Qzt5QkFDSixDQUFDLENBQUM7cUJBQ04sQ0FBQTtBQUNELDBCQUFLLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUNoQyw0QkFBSSxPQUFPLEVBQUU7QUFDVCxtQ0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQixNQUFNO0FBQ0gscUNBQVMsRUFBRSxDQUFDO3lCQUNmO3FCQUNKLENBQUMsU0FBTSxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2QsaUNBQVMsRUFBRSxDQUFDO3FCQUNmLENBQUMsQ0FBQztpQkFDTixDQUFDLENBQUM7YUFDTjtBQUNELG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDdEI7OztlQUVVLHVCQUFHO0FBQ1YsZ0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ1gsMkJBQVcsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztBQUNyRCxvQkFBSSxFQUFFO0FBQ0YsMEJBQU0sRUFBRTtBQUNKLDZCQUFLLEVBQUUsMkJBQTJCO3FCQUNyQztpQkFDSjtBQUNELDBCQUFVLEVBQUU7QUFDUixnQ0FBWSxFQUFFLElBQUksQ0FBQyxNQUFNO2lCQUM1QjthQUNKLENBQUMsQ0FBQztTQUNOOzs7ZUFFSyxnQkFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ2hCLGdCQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixnQkFBSSxNQUFNLEVBQUU7QUFDUixzQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osb0JBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNqQjtTQUNKOzs7ZUFFUyxzQkFBRzs7O0FBQ1QsZ0JBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNkLG9CQUFJLENBQUMsV0FBVyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNoRCwyQkFBTyxDQUFDLE9BQUssT0FBTyxDQUFDLENBQUM7aUJBQ3pCLENBQUMsQ0FBQzthQUNOLE1BQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDeEIsb0JBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ2hELDJCQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQ3RELDRCQUFJLFFBQVEsRUFBRTtBQUNWLG1DQUFPLE9BQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFHLEVBQUUsT0FBTyxFQUFLO0FBQ3BELG9DQUFJLEdBQUcsRUFBRTtBQUNMLDJDQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7aUNBQzVCLE1BQU07QUFDSCwrQ0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUMsK0NBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLCtDQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssRUFBSztBQUMxQywrQ0FBSyxNQUFNLEdBQUcsS0FBSyxDQUFDO3FDQUN2QixDQUFDLENBQUM7QUFDSCwyQ0FBSyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDNUMsMkNBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QiwyQ0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7aUNBQzNCOzZCQUNKLENBQUMsQ0FBQzt5QkFDTixNQUFNO0FBQ0gsbUNBQU8sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7eUJBQzFDO3FCQUNKLENBQUMsQ0FBQztpQkFDTixDQUFDLENBQUM7YUFDTjtBQUNELG1CQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDM0I7OztlQUVLLGtCQUFHOzs7QUFDTCx1QkFBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMxQyx1QkFBTyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzVDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNWLHVCQUFLLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsdUJBQUssTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQix1QkFBSyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLHVCQUFLLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsdUJBQUssTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQix1QkFBSyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLHNCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzVCLENBQUMsQ0FBQztTQUNOOzs7V0F4SEMsS0FBSzs7O0FBMEhYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOzs7Ozs7Ozs7QUMvSHZCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFDLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTs7SUFFckIsSUFBSTtBQUNLLGFBRFQsSUFBSSxDQUNNLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTs4QkFENUMsSUFBSTs7QUFFRixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixZQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksRUFBRSxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNmLFlBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQzNDOztpQkFSQyxJQUFJOztlQVVDLG1CQUFHOzs7QUFDTixnQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7O0FBQ2hCLHdCQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDNUIsOEJBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDcEMsZ0NBQUksTUFBSyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksTUFBSyxPQUFPLENBQUMsTUFBSyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNFLHNDQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsc0NBQUssUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFLLE9BQU8sYUFBVyxNQUFLLElBQUksQ0FBQyxHQUFHLGNBQVcsQ0FBQzs2QkFDekU7eUJBQ0osQ0FBQyxDQUFDO3FCQUNOLENBQUMsQ0FBQztBQUNILDBCQUFLLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDN0MsOEJBQUssUUFBUSxDQUFDLEVBQUUsWUFBVSxNQUFLLElBQUksQ0FBQyxHQUFHLEVBQUksVUFBQyxJQUFJLEVBQUs7QUFDakQsZ0NBQUksSUFBSSxFQUFFO0FBQ04sb0NBQUk7QUFDQSx3Q0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDZiw0Q0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7cUNBQ3JCO0FBQ0QsMENBQUssT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixnREFBWSxFQUFFLENBQUM7aUNBQ2xCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDUiwwQ0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lDQUN6QjtBQUNELHVDQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7NkJBQ2pCO3lCQUNKLENBQUMsQ0FBQztxQkFHTixDQUFDLENBQUM7O2FBQ047QUFDRCxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3hCOzs7ZUEyRW9CLCtCQUFDLE9BQU8sRUFBRTtBQUMzQixnQkFBSSxJQUFJLEdBQUc7QUFDUCxvQkFBSSxFQUFFO0FBQ0Ysa0NBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztpQkFDMUM7YUFDSixDQUFDO1NBQ0w7OzthQS9FWSxlQUFHO0FBQ1osZ0JBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLGdCQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDdkMsbUJBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzthQUMvQjtBQUNELG1CQUFPLEdBQUcsQ0FBQztTQUNkOzs7YUFFWSxlQUFHO0FBQ1osZ0JBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDekIsb0JBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7QUFDM0Isd0JBQUksRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0Msd0JBQUksQ0FBQyxVQUFVLEdBQUc7QUFDZCw0QkFBSSxFQUFFLEVBQUU7QUFDUiw2QkFBSyxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7cUJBQ3JDLENBQUE7aUJBQ0o7YUFDSjtBQUNELG1CQUFPLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUN6RDs7O2FBRWMsZUFBRztBQUNkLGdCQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3hCLGdCQUFJLEdBQUcsRUFBRTtBQUNMLG1CQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMzQjtBQUNELGdCQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ2pDLG1CQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7YUFDakM7O0FBRUQsbUJBQU8sR0FBRyxDQUFDO1NBQ2Q7OzthQUVXLGVBQUc7QUFDWCxnQkFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsZ0JBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7QUFDckIsbUJBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUM3QjtBQUNELG1CQUFPLEdBQUcsQ0FBQztTQUNkOzs7YUFFUSxlQUFHO0FBQ1IsZ0JBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLGdCQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3RCLG1CQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7YUFDOUI7QUFDRCxtQkFBTyxHQUFHLENBQUM7U0FDZDs7O2FBRVUsZUFBRztBQUNWLGdCQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixnQkFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtBQUN4QixtQkFBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2FBQ2hDO0FBQ0QsbUJBQU8sR0FBRyxDQUFDO1NBQ2Q7OzthQUVTLGVBQUc7QUFDVCxtQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUN4Qjs7O2FBRVUsZUFBRztBQUNWLGdCQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDaEIsZ0JBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDdEIsbUJBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFBO2FBQzNDO0FBQ0QsbUJBQU8sR0FBRyxDQUFBO1NBQ2I7OzthQUVVLGVBQUc7QUFDVixtQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7U0FDckM7OztXQWpIQyxJQUFJOzs7QUE0SFYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7Ozs7OztBQ2hJdEIsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMvQixJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQzdDLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzQixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtBQUNuRCxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQTs7QUFFakQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBOztJQUViLE1BQU07QUFFRyxhQUZULE1BQU0sQ0FFSSxHQUFHLEVBQUUsS0FBSyxFQUFFOzs7OEJBRnRCLE1BQU07O0FBR0osWUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixZQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixZQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUN2QyxZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRXZCLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsU0FBSSxLQUFLLENBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDbEcsa0JBQUssT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0Qix1QkFBVyxHQUFHLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3pDLENBQUMsQ0FBQTs7QUFFRixZQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFlBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBTTtBQUNsQyxnQkFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDdkIsb0JBQUksUUFBUSxHQUFHO0FBQ1gsd0JBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUNqQyw4QkFBVSxFQUFFO0FBQ1IsOEJBQU0sRUFBRSxNQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTTtxQkFDbkM7aUJBQ0osQ0FBQztBQUNGLHNCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxpQkFBZSxNQUFLLEtBQUssQ0FBRyxDQUFDO0FBQ2hGLHNCQUFLLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQUssS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUE7YUFDbkY7U0FDSixFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVSLGFBQUssQ0FBQyxJQUFJLENBQUMsWUFBTTs7QUFFYiwwQkFBYyxDQUFDLEtBQUssQ0FBQyxZQUFZOztBQUU3QixvQkFBSSxhQUFhLENBQUE7OztBQUdqQixvQkFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDO0FBQ3RELHNDQUFrQixFQUFDLDRCQUFTLFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDNUMscUNBQWEsR0FBRyxRQUFRLENBQUE7QUFDeEIsK0JBQU87QUFDSCxnQ0FBSSxFQUFFLFFBQVE7eUJBQ2pCLENBQUE7cUJBQ0o7QUFDRCxpQ0FBYSxFQUFDLHVCQUFTLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDckMsNEJBQUksR0FBRyxHQUFHLElBQUksQ0FBQzs7QUFFZiw0QkFBRyxRQUFRLElBQUksTUFBTSxFQUFFO0FBQ25CLCtCQUFHLEdBQUcsS0FBSyxDQUFDO3lCQUNmLE1BQU07O0FBRUgsb0NBQU8sYUFBYTtBQUNoQixxQ0FBSyxhQUFhO0FBQ2Qsd0NBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsZ0JBQVMsQ0FBQyxFQUFFO0FBQUUsbURBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFBO3lDQUFFLEVBQUMsQ0FBQyxDQUFBO0FBQzdGLHlDQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUcsQ0FBQyxFQUFFO0FBQ2hDLDRDQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsNENBQUcsQUFBQyxFQUFFLENBQUMsTUFBTSxJQUFJLFFBQVEsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sSUFBTSxFQUFFLENBQUMsTUFBTSxJQUFJLFFBQVEsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sQUFBQyxFQUFFO0FBQ2pHLCtDQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osa0RBQU07eUNBQ1Q7cUNBQ0o7QUFDRCwwQ0FBTTtBQUFBLDZCQUNiO3lCQUNKO0FBQ0QsK0JBQU8sR0FBRyxDQUFDO3FCQUNkO2lCQUNKLENBQUMsQ0FBQzs7Ozs7QUFLSCxvQkFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQVksSUFBSSxFQUFFO0FBQzFCLHdCQUFJLEdBQUMsSUFBSSxJQUFFLE1BQU0sQ0FBQTtBQUNqQiwyQkFBTztBQUNILHlCQUFDLEVBQUMsRUFBRTtBQUNKLHlCQUFDLEVBQUMsRUFBRTtBQUNKLDZCQUFLLEVBQUMsTUFBTTtBQUNaLDRCQUFJLEVBQUUsSUFBSTtBQUNWLGdDQUFRLEVBQUUsRUFBRTtBQUNaLHFDQUFhLEVBQUUsRUFBRTtxQkFDcEIsQ0FBQztpQkFDTCxDQUFDOzs7QUFHRixvQkFBSSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQVksSUFBSSxFQUFFO0FBQzNCLHdCQUFJLEdBQUcsSUFBSSxJQUFJLGtCQUFrQixDQUFBO0FBQ2pDLDJCQUFPO0FBQ0gseUJBQUMsRUFBQyxFQUFFO0FBQ0oseUJBQUMsRUFBQyxFQUFFO0FBQ0osNEJBQUksRUFBQyxJQUFJO3FCQUNaLENBQUM7aUJBQ0wsQ0FBQzs7QUFFRixvQkFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDdEQsYUFBYSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7O0FBSWxFLG9CQUFJLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQVksR0FBRyxFQUFFO0FBQy9CLDJCQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDekIsd0JBQUcsR0FBRyxFQUFFO0FBQ0osK0JBQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzdCO2lCQUNKLENBQUE7OztBQUdELG9CQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzFCLDZCQUFTLEVBQUUsYUFBYTtBQUN4QixxQ0FBaUIsRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFO0FBQ3hDLG9DQUFnQixFQUFFLEtBQUs7QUFDdkIsMEJBQU0sRUFBQzs7QUFFSCw0QkFBSSxFQUFDLFNBQVM7cUJBQ2pCOzs7Ozs7OztBQVFELCtCQUFXLEVBQUMscUJBQVMsSUFBSSxFQUFFO0FBQ3ZCLCtCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztxQkFDbkU7QUFDRCw2QkFBUyxFQUFDLEtBQUs7QUFDZix3QkFBSSxFQUFDO0FBQ0QsNkJBQUssRUFBQztBQUNGLCtCQUFHLEVBQUU7QUFDRCxzQ0FBTSxFQUFFO0FBQ0osdUNBQUcsRUFBRSxhQUFTLEdBQUcsRUFBRTtBQUNmLHNEQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO3FDQUMzQjtBQUNELDhDQUFVLEVBQUUsb0JBQVMsR0FBRyxFQUFFLEVBRXpCO2lDQUNKOzZCQUNKO0FBQ0QsdUNBQVM7QUFDTCxzQ0FBTSxFQUFFLEtBQUs7QUFDYix3Q0FBUSxFQUFDLFVBQVU7NkJBQ3RCO0FBQ0QsZ0NBQUksRUFBRTtBQUNGLHNDQUFNLEVBQUUsU0FBUzs2QkFDcEI7QUFDRCxxQ0FBUyxFQUFFO0FBQ1Asc0NBQU0sRUFBRSxNQUFNOzZCQUNqQjtBQUNELGlDQUFLLEVBQUU7QUFDSCxzQ0FBTSxFQUFFLEtBQUs7QUFDYix3Q0FBUSxFQUFDLGVBQWU7QUFDeEIsdUNBQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUM7NkJBQ3BDO0FBQ0QsNENBQWdCLEVBQUU7QUFDZCxzQ0FBTSxFQUFFLE9BQU87NkJBQ2xCO0FBQ0QsNkNBQWlCLEVBQUU7QUFDZixzQ0FBTSxFQUFFLE9BQU87QUFDZixzQ0FBTSxFQUFFO0FBQ0osNENBQVEsRUFBRSxrQkFBUyxHQUFHLEVBQUU7Ozs7QUFJcEIsNENBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDeEMsNENBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7O0FBRS9CLHlDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDckMseUNBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQzs7QUFFckMsNENBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR3RFLDZDQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUUsQ0FBQyxFQUFFO0FBQy9CLGdEQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtBQUM1Qix1REFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO0FBQzFELDREQUFJLEVBQUMsY0FBYztxREFDdEIsRUFBQyxDQUFDLENBQUM7NkNBQ1AsTUFBTSxJQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtBQUNuQyx1REFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDO0FBQzFELDREQUFJLEVBQUMsbUJBQW1CO3FEQUMzQixFQUFDLENBQUMsQ0FBQzs2Q0FDUDt5Q0FDSjs7O0FBR0QsK0NBQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO3FDQUNoQztpQ0FDSjs2QkFDSjt5QkFDSjtBQUNELDZCQUFLLEVBQUM7QUFDRiwrQkFBRyxFQUFFO0FBQ0Qsc0NBQU0sRUFBRTtBQUNKLHVDQUFHLEVBQUUsYUFBVSxHQUFHLEVBQUU7QUFDaEIsNENBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLHNCQUFzQixFQUFHO0FBQzlELHFEQUFTO3lDQUNaO0FBQ0Qsc0RBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7cUNBQzNCO2lDQUNKOzZCQUNKO0FBQ0QsdUNBQVE7QUFDSixzQ0FBTSxFQUFFLEtBQUs7QUFDYix1Q0FBTyxFQUFDLENBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQzs7NkJBRXRDO0FBQ0QscUNBQVMsRUFBRTtBQUNQLHNDQUFNLEVBQUUsS0FBSztBQUNiLHlDQUFTLEVBQUMsQ0FBQyxjQUFjLEVBQUU7QUFDdkIsMENBQU0sRUFBRSxJQUFJO0FBQ1osNkNBQVMsRUFBQyxFQUFFO2lDQUNmLENBQUM7NkJBQ0w7QUFDRCx3Q0FBWSxFQUFDO0FBQ1Qsd0NBQVEsRUFBQyxtQkFBbUI7QUFDNUIsc0NBQU0sRUFBRSxXQUFXO0FBQ25CLHdDQUFRLEVBQUMsT0FBTztBQUNoQix3Q0FBUSxFQUFDLENBQ0wsQ0FBRSxZQUFZLEVBQUU7QUFDWiw0Q0FBUSxFQUFDLENBQUM7QUFDVix5Q0FBSyxFQUFDLEVBQUU7QUFDUiwwQ0FBTSxFQUFDLEVBQUU7QUFDVCw0Q0FBUSxFQUFDLHNCQUFzQjtpQ0FDbEMsQ0FBRSxDQUNOOzs2QkFFSjtBQUNELDZDQUFpQixFQUFDO0FBQ2Qsd0NBQVEsRUFBQyxtQkFBbUI7QUFDNUIsc0NBQU0sRUFBRSxXQUFXO0FBQ25CLHdDQUFRLEVBQUMsT0FBTzs2QkFDbkI7QUFDRCx1Q0FBVyxFQUFDO0FBQ1Isd0NBQVEsRUFBQyxrQkFBa0I7QUFDM0IseUNBQVMsRUFBQyxDQUFFLE9BQU8sRUFBRSxDQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDL0Qsc0NBQU0sRUFBRSxXQUFXOzZCQUN0QjtBQUNELDRDQUFnQixFQUFDO0FBQ2Isd0NBQVEsRUFBQyxrQkFBa0I7QUFDM0IseUNBQVMsRUFBQyxDQUFFLE9BQU8sRUFBRSxDQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFDckUsc0NBQU0sRUFBRSxXQUFXOzZCQUN0Qjt5QkFDSjtxQkFDSjtBQUNELDBCQUFNLEVBQUM7QUFDSCxtQ0FBVyxFQUFFLHFCQUFVLENBQUMsRUFBRTtBQUN0QiwwQ0FBYyxFQUFFLENBQUM7eUJBQ3BCO0FBQ0Qsc0NBQWMsRUFBQyx3QkFBUyxDQUFDLEVBQUU7O0FBRXZCLGdDQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7OztBQUd2QywrQkFBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFDLEVBQUUsQ0FBQTtBQUN0QiwrQkFBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFDLEVBQUUsQ0FBQTtBQUNwQixtQ0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJBQ3BEO0FBQ0QsaUNBQVMsRUFBQyxpQkFBaUI7QUFDM0IsaUNBQVMsRUFBRSxtQkFBUyxHQUFHLEVBQUU7O3lCQUV4QjtBQUNELGdDQUFRLEVBQUUsb0JBQVc7O3lCQUVwQjtxQkFDSjtBQUNELCtCQUFXLEVBQUM7QUFDUiw4QkFBTSxFQUFDLFVBQVU7QUFDbkMsNEJBQUksRUFBQyxnQkFBVzs7OztBQUlmLG9DQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7eUJBQ25CO3FCQUNjO2lCQUNKLENBQUMsQ0FBQzs7OztBQUlQLDhCQUFjLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUM5Qiw0QkFBUSxFQUFFLE1BQU07aUJBQ25CLENBQUMsQ0FBQzs7Ozs7Ozs7OztBQVdDLG9CQUFJLE1BQU0sR0FBRyxDQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUUsQ0FBQzs7QUFFMUQsb0JBQUksV0FBVyxHQUFHLFNBQWQsV0FBVyxDQUFZLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRTtBQUM5QywyQkFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ2hDLDJCQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2Qix3QkFBRyxLQUFLLElBQUksVUFBVSxFQUFFO0FBQ3BCLCtCQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7cUJBQzVCO2lCQUNKLENBQUE7O0FBRUQsb0JBQUksY0FBYyxHQUFHO0FBQ2pCLHlCQUFLLEVBQUM7QUFDRiwyQkFBRyxFQUFDLGFBQVMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUNuQix1Q0FBVyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO3lCQUN0QztBQUNELDZCQUFLLEVBQUMsZUFBUyxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ3JCLHVDQUFXLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7eUJBQ3RDO0FBQ0QsOEJBQU0sRUFBQyxnQkFBUyxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ3RCLHVDQUFXLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7eUJBQ3RDO0FBQ0QsNEJBQUksRUFBQyxjQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUU7QUFDcEIsdUNBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTt5QkFDdEM7QUFDRCw0QkFBSSxFQUFDLGNBQVMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUNwQix1Q0FBVyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO3lCQUN0QztxQkFDSjtBQUNELDRCQUFRLEVBQUM7QUFDTCwyQkFBRyxFQUFDLGFBQVMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUNuQix1Q0FBVyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3RDLG1DQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7eUJBQy9CO0FBQ0QsNkJBQUssRUFBQyxlQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUU7QUFDckIsdUNBQVcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUN0QyxnQ0FBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ25DLGdDQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7O0FBRXBDLGdDQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7QUFDOUMsZ0NBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQzs7QUFFdEIsZ0NBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDMUIsc0NBQU0sRUFBQyxJQUFJLENBQUMsRUFBRTtBQUNkLGlDQUFDLEVBQUMsUUFBUTtBQUNWLGlDQUFDLEVBQUMsU0FBUztBQUNYLHFDQUFLLEVBQUUsUUFBUTtBQUNmLHFDQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTs2QkFDL0IsQ0FBQyxDQUFDOztBQUVQLGdDQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLG9DQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7eUJBQ3ZCO0FBQ0QsOEJBQU0sRUFBQyxnQkFBUyxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ3RCLHVDQUFXLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDdEMsZ0NBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUMxQyxnQ0FBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxtQ0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUM7QUFDakQsd0NBQUksRUFBQyxrQkFBa0I7aUNBQzFCLEVBQUMsQ0FBQyxDQUFDO0FBQ0osbUNBQU8sQ0FBQyxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDO0FBQ3BELHdDQUFJLEVBQUMsYUFBYTtpQ0FDckIsRUFBQyxDQUFDLENBQUM7eUJBQ1A7QUFDRCw0QkFBSSxFQUFDLGNBQVMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUNwQix1Q0FBVyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3RDLGdDQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDMUMsZ0NBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQzs7QUFFaEUsbUNBQU8sQ0FBQyxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDO0FBQ2pELHdDQUFJLEVBQUMsbUJBQW1CO2lDQUMzQixFQUFDLENBQUMsQ0FBQztBQUNKLG1DQUFPLENBQUMsT0FBTyxDQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQztBQUNwRCx3Q0FBSSxFQUFDLGNBQWM7aUNBQ3RCLEVBQUMsQ0FBQyxDQUFDO3lCQUNQO0FBQ0QsNEJBQUksRUFBQyxjQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUU7QUFDcEIsdUNBQVcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUN0QyxnQ0FBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0QywwQ0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDeEIsa0NBQUUsRUFBRSxTQUFTO0FBQ2IscUNBQUssRUFBRSxjQUFjO0FBQ3JCLG9DQUFJLEVBQUUsY0FBVSxDQUFDLEVBQUU7QUFDZiwyQ0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7aUNBQzlDO0FBQ0Qsb0NBQUksRUFBQztBQUNELHdDQUFJLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO2lDQUN2Qjs2QkFDSixDQUFDLENBQUM7eUJBQ047cUJBQ0o7aUJBQ0osQ0FBQzs7QUFFRixvQkFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFZLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzVDLHdCQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUMxQywyQkFBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFlBQVk7QUFDakMsc0NBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQzlDLENBQUMsQ0FBQztBQUNILDJCQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsWUFBWTtBQUNwQyxzQ0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDakQsQ0FBQyxDQUFDO2lCQUNOLENBQUM7Ozs7Ozs7O0FBUUYsb0JBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzdDLHlCQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBRTs7O0FBRy9CLHdCQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRTt3QkFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUk7d0JBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUUseUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3BDLHFDQUFhLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDdEM7OztBQUdELG9DQUFnQixDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDOUIsNkJBQUssRUFBQyxpQkFBVztBQUNqQiw0Q0FBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7eUJBQzVDO0FBQ0QsNEJBQUksRUFBQyxjQUFTLENBQUMsRUFBRTtBQUNiLGdDQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUN0QixRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQzlCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FDaEMsQ0FBQTtBQUNELHdDQUFZLEVBQUUsQ0FBQTt5QkFDakI7cUJBQ0osQ0FBQyxDQUFDOzs7QUFHSCwyQkFBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFlBQVc7QUFDekMsc0NBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3BCLDhCQUFFLEVBQUUsU0FBUztBQUNiLGlDQUFLLEVBQUUsY0FBYztBQUNyQixnQ0FBSSxFQUFFLGNBQVUsQ0FBQyxFQUFFO0FBQ2YsdUNBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDOzZCQUM5QztBQUNELGdDQUFJLEVBQUM7QUFDTCxvQ0FBSSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSzs2QkFDbkI7eUJBQ0osQ0FBQyxDQUFDO3FCQUNOLENBQUMsQ0FBQztpQkFDTjs7Ozs7QUFLRCx5QkFBUyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBRXBCOzs7OztBQU1ELG9CQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7QUFDM0IsMkJBQU8sQ0FBQyxJQUFJLENBQUM7QUFDVCw0QkFBSSxFQUFFLE1BQU07QUFDWiw0QkFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSTtxQkFDdEIsQ0FBQyxDQUFBO2lCQUNMOzs7Ozs7QUFNRCxvQkFBSSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBWSxJQUFJLEVBQUU7QUFDbEMsMkJBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFTLEdBQUcsRUFBRTtBQUFFLCtCQUFPLEdBQUcsQ0FBQyxVQUFVLElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFHLElBQUksQ0FBQztxQkFBRSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7aUJBQ25ILENBQUM7QUFDRixvQkFBSSxjQUFjLEdBQUcsU0FBakIsY0FBYyxHQUFjO0FBQzVCLDJCQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3JGLDJCQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO2lCQUN0RixDQUFDOztBQUVGLHVCQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxZQUFXO0FBQ25DLGtDQUFjLEVBQUUsQ0FBQztBQUNqQixnQ0FBWSxFQUFFLENBQUM7aUJBQ2xCLENBQUMsQ0FBQTs7QUFFRix1QkFBTyxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQzs7O0FBRzlELHVCQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsVUFBUyxLQUFLLEVBQUU7QUFDOUMsd0JBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUNmLDZCQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7cUJBQ3pCO2lCQUNKLENBQUMsQ0FBQzs7QUFFSCxvQkFBSSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQVksUUFBUSxFQUFFOztBQUUvQiw0QkFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFTLENBQUMsRUFBQyxDQUFDLEVBQUU7QUFBRSwrQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtxQkFBRSxDQUFDLENBQUM7OztBQUdwRCw0QkFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFTLENBQUMsRUFBQyxDQUFDLEVBQUU7QUFDNUIsNEJBQUksT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFZLElBQUksRUFBRTtBQUN6QixnQ0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDM0IscUNBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRTtBQUM1Qyx3Q0FBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELDJDQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUNBQ2xCOzZCQUNKOztBQUVELG1DQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO3lCQUMzQixDQUFBO0FBQ0QsK0JBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDZCxDQUFDLENBQUM7QUFDSCwyQkFBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDNUIsQ0FBQTs7QUFFRCxvQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQix1QkFBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFO0FBQzFDLHdCQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ1gsd0JBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUN0Qyw0QkFBUSxLQUFLLENBQUMsT0FBTztBQUNqQiw2QkFBSyxDQUFDO0FBQ0YsZ0NBQUcsUUFBUSxFQUFFO0FBQ1QscUNBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQTs2QkFDekI7QUFBQSxBQUNMLDZCQUFLLEVBQUU7QUFDSCxxQ0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BCLGtDQUFNO0FBQUEscUJBQ2I7aUJBQ0osQ0FBQyxDQUFBOztBQUVGLHVCQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBUyxLQUFLLEVBQUU7QUFDNUMsd0JBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUNmLDRCQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1AsZ0NBQUksR0FBRyxRQUFRLENBQUE7QUFDZixvQ0FBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTt5QkFDN0I7cUJBQ0osTUFBTTtBQUNILGdDQUFRLEtBQUssQ0FBQyxPQUFPO0FBQ2pCLGlDQUFLLENBQUM7QUFDRixxQ0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQ3RCLHNDQUFNO0FBQUEsQUFDVixpQ0FBSyxFQUFFO0FBQ0gsb0NBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUN0Qyx5Q0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BCLHNDQUFNO0FBQUEseUJBQ2I7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFBO2FBQ0wsQ0FBQyxDQUFBO1NBQ0wsQ0FBQyxDQUFDO0tBRU47O2lCQTFoQkMsTUFBTTs7ZUE0aEJKLGdCQUFHLEVBRU47OztXQTloQkMsTUFBTTs7O0FBaWlCWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDL2hCeEIsQ0FBQyxDQUFDLFlBQVc7O0FBRVosV0FBUyxtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3BDLFFBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDckMsUUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEMsV0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDOUM7O0FBRUEsZ0JBQWMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsWUFBVztBQUM3QyxrQkFBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFckQsUUFBSSxPQUFPLEdBQUcsQ0FBQSxVQUFTLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzlDLFlBQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3RCLFVBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO0FBQ3ZDLFVBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxFQUFFOztBQUU5RCxZQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVE7WUFDL0IsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUU7WUFDakMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUN2QyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ3BDLGNBQWMsR0FBRyxDQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUU7WUFDOUIsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFBLEtBQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQzdELENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQzs7O0FBR3JELGtCQUFVLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7OztBQUdyQyxTQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDbEMsWUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCLENBQUMsQ0FBQzs7QUFFSCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxjQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxjQUFHLEVBQUUsRUFBRTtBQUNMLGdCQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQy9CLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUksS0FBSyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUEsQUFBQyxBQUFDLENBQUM7O0FBRWhFLGdCQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQywwQkFBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsYUFBQyxJQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEFBQUMsQ0FBQztXQUMvQjtTQUNWO09BR0k7S0FDRixDQUFBLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7OztBQUtiLFFBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDekIsUUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDbkMsVUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDM0IsWUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztBQUk3QixZQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtBQUN6QixpQkFBTyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0I7T0FDRjs7QUFFRCxlQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYixDQUFDO0dBQ0gsQ0FBQztDQUVILENBQUEsRUFBRyxDQUFDOzs7OztBQy9FTCxJQUFNLE9BQU8sR0FBRztBQUNaLFlBQVEsRUFBRSxLQUFLO0FBQ2YsaUJBQWEsRUFBRSxlQUFlO0FBQzlCLFdBQU8sRUFBRSxTQUFTO0FBQ2xCLFlBQVEsRUFBRSxVQUFVO0FBQ3BCLGNBQVUsRUFBRSxZQUFZO0FBQ3hCLFFBQUksRUFBRSxNQUFNO0FBQ1osV0FBTyxFQUFFLFFBQVE7QUFDakIsd0JBQW9CLEVBQUUsT0FBTztBQUM3QixVQUFNLEVBQUUsUUFBUTtBQUNoQixZQUFRLEVBQUUsVUFBVTtBQUNwQixhQUFTLEVBQUUsV0FBVztBQUN0QixlQUFXLEVBQUUsYUFBYTtBQUMxQixhQUFTLEVBQUUsV0FBVztDQUN6QixDQUFDOztBQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXZCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7OztBQ2xCekIsSUFBTSxNQUFNLEdBQUc7QUFDWCxRQUFJLEVBQUUsTUFBTTtBQUNaLFNBQUssRUFBRSxPQUFPO0NBQ2pCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Ozs7O0FDUHhCLElBQU0sU0FBUyxHQUFHO0FBQ2pCLFFBQU8sRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQzdCLE9BQU0sRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzNCLEtBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3ZCLFlBQVcsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ3BDLFNBQVEsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQzVCLE9BQU0sRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzNCLGFBQVksRUFBRSxPQUFPLENBQUMsZ0JBQWdCLENBQUM7QUFDMUMsTUFBSyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDekIsT0FBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDM0IsS0FBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDdkIsS0FBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUM7Q0FDdkIsQ0FBQzs7QUFFRixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUV6QixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQzs7Ozs7QUNoQjNCLElBQU0sSUFBSSxHQUFHO0FBQ1osRUFBQyxFQUFFLEdBQUc7QUFDTixFQUFDLEVBQUUsR0FBRztBQUNOLEVBQUMsRUFBRSxHQUFHO0FBQ04sRUFBQyxFQUFFLEdBQUc7Q0FDTixDQUFBOztBQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7OztBQ1R0QixJQUFNLE1BQU0sR0FBRztBQUNYLGdCQUFZLEVBQUUsRUFBRTtBQUNoQixhQUFTLEVBQUUsV0FBVztBQUN0QixVQUFNLEVBQUUsV0FBVztBQUNuQixXQUFPLEVBQUUsbUJBQW1CO0FBQzVCLGVBQVcsRUFBRSw0QkFBNEI7Q0FDNUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV0QixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7Ozs7QUNWeEIsSUFBTSxRQUFRLEdBQUc7QUFDYixpQkFBYSxFQUFFLGVBQWU7QUFDOUIsaUJBQWEsRUFBRSxlQUFlO0FBQzlCLHNCQUFrQixFQUFFLG9CQUFvQjtBQUN4QywrQkFBMkIsRUFBRSw2QkFBNkI7Q0FDN0QsQ0FBQzs7QUFFRixNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV4QixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQzs7Ozs7QUNUMUIsSUFBTSxNQUFNLEdBQUc7QUFDZCxhQUFZLEVBQUUsY0FBYztBQUM1QixjQUFhLEVBQUUsZUFBZTtBQUM5QixlQUFjLEVBQUUsZ0JBQWdCO0FBQ2hDLFVBQVMsRUFBRSxVQUFVO0FBQ3JCLElBQUcsRUFBRSxLQUFLO0FBQ1YsSUFBRyxFQUFFLEtBQUs7Q0FDVixDQUFBOztBQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXRCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7OztBQ1h4QixJQUFNLFlBQVksR0FBRztBQUNwQixJQUFHLEVBQUUsS0FBSztDQUNWLENBQUE7O0FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7Ozs7O0FDTjlCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN4QyxJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTVCLElBQU0sS0FBSyxHQUFHO0FBQ1YsT0FBRyxFQUFFLEtBQUs7QUFDVixXQUFPLEVBQUUsU0FBUztBQUNsQixZQUFRLEVBQUUsVUFBVTtBQUNwQixjQUFVLEVBQUUsWUFBWTtBQUN4QixXQUFPLEVBQUUsUUFBUTtBQUNqQix3QkFBb0IsRUFBRSxPQUFPO0FBQzdCLFFBQUksRUFBRSxNQUFNO0FBQ1osZUFBVyxFQUFFLGFBQWE7QUFDMUIsYUFBUyxFQUFFLFdBQVc7Q0FDekIsQ0FBQzs7QUFFRixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7O0FBRVYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Ozs7O0FDbkJ2QixJQUFNLE1BQU0sR0FBRztBQUNYLGFBQVMsRUFBRSxZQUFZO0FBQ3ZCLGFBQVMsRUFBRSxZQUFZO0FBQ3ZCLGdCQUFZLEVBQUUsZUFBZTtBQUM3Qix3QkFBb0IsRUFBRSwrQkFBK0I7QUFDckQsUUFBSSxFQUFFLGVBQWU7QUFDckIsaUJBQWEsRUFBRSx5QkFBeUI7QUFDeEMsZUFBVyxFQUFFLG9CQUFvQjtDQUNwQyxDQUFDOztBQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXRCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7OztBQ1p4QixJQUFNLElBQUksR0FBRztBQUNULG9CQUFnQixFQUFHLGVBQWU7QUFDbEMsd0JBQW9CLEVBQUcsbUJBQW1CO0FBQzFDLDBCQUFzQixFQUFHLHFCQUFxQjtBQUM5Qyx1QkFBbUIsRUFBRyxrQkFBa0I7QUFDeEMsdUJBQW1CLEVBQUcsa0JBQWtCO0FBQ3hDLHNCQUFrQixFQUFHLGlCQUFpQjtBQUN0QyxvQkFBZ0IsRUFBRyxlQUFlO0FBQ2xDLG9CQUFnQixFQUFHLGVBQWU7Q0FDckMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7OztBQ1p0QixJQUFNLElBQUksR0FBRztBQUNULGVBQVcsRUFBRSxhQUFhO0FBQzFCLFFBQUksRUFBRSxNQUFNO0FBQ1osU0FBSyxFQUFFLE9BQU87QUFDZCxXQUFPLEVBQUUsU0FBUztBQUNsQixTQUFLLEVBQUUsT0FBTztBQUNkLGVBQVcsRUFBRSxhQUFhO0FBQzFCLFlBQVEsRUFBRSxVQUFVO0NBQ3ZCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFcEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNadEIsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQTs7SUFFakQsT0FBTztjQUFQLE9BQU87O0FBQ0UsYUFEVCxPQUFPLENBQ0csTUFBTSxFQUFFLElBQUksRUFBRTs4QkFEeEIsT0FBTzs7QUFFTCxtQ0FGRixPQUFPLDZDQUVDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDcEIsQUFBQyxTQUFBLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7QUFDakIsZ0JBQUksRUFBRTtnQkFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzdCLGdCQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbkMsY0FBRSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsY0FBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDWCxjQUFFLENBQUMsR0FBRyx3REFBc0QsTUFBTSxDQUFDLEtBQUssQUFBRSxDQUFDO0FBQzNFLGVBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFckMsYUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDVixhQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQ25CLGlCQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoQixDQUFDOztBQUVGLG1CQUFPLENBQUMsQ0FBQztTQUNaLENBQUEsQ0FBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFFO0FBQ3ZDLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztLQUNqQzs7aUJBcEJDLE9BQU87O2VBMkJMLGdCQUFHO0FBQ0gsdUNBNUJGLE9BQU8sc0NBNEJRO1NBQ2hCOzs7YUFQYyxlQUFHO0FBQ2QsZ0JBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQzlDLG1CQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdkI7OztXQXpCQyxPQUFPO0dBQVMsZ0JBQWdCOztBQWdDdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNsQ3pCLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUE7O0lBRWpELE1BQU07WUFBTixNQUFNOztBQUNDLFdBRFAsTUFBTSxDQUNFLE1BQU0sRUFBRSxJQUFJLEVBQUU7MEJBRHRCLE1BQU07O0FBRVIsK0JBRkUsTUFBTSw2Q0FFRixNQUFNLEVBQUUsSUFBSSxFQUFFOztBQUVwQixLQUFDLFlBQVk7QUFDWCxVQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEFBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxBQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3hGLFFBQUUsQ0FBQyxHQUFHLEdBQUcsd0NBQXdDLENBQUM7QUFDbEQsVUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3RGLENBQUEsRUFBRyxDQUFDOzs7QUFHTCxLQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN4QixPQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDM0IsbUJBQVcsRUFDWCxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRO09BQ3RDLENBQUMsQ0FBQyxBQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDdEMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1VBQUUsRUFBRSxHQUFHLENBQUMsSUFBSSxXQUFXLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQUFBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxBQUFDLENBQUMsQ0FBQyxHQUFHLEdBQ3JGLHVDQUF1QyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckYsQ0FBQSxDQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVwRSxLQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzlCLE9BQUMsQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxBQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWTtBQUN6RCxTQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUEsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLEFBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQ2xELENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxBQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELE9BQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNqQyxDQUFBLENBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUseUNBQXlDLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FFakY7O2VBNUJHLE1BQU07O1dBbUNOLGdCQUFHO0FBQ0wsaUNBcENFLE1BQU0sc0NBb0NLO0FBQ2IsVUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2xCLFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2xDLFVBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUNqQyxZQUFJLEdBQUcsTUFBTSxDQUFDO09BQ2Y7QUFDRCxVQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztLQUN0Qzs7O1dBRU0sbUJBQUc7QUFDUixpQ0EvQ0UsTUFBTSx5Q0ErQ1E7QUFDaEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckQ7OztXQVFRLG1CQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNsQyxpQ0ExREUsTUFBTSwyQ0EwRFEsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQzFDLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixZQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDbEIsY0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDcEQsTUFBTTtBQUNMLGNBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN0QztPQUNGO0tBQ0Y7OztXQUVTLG9CQUFDLElBQUksRUFBRTtBQUNmLGlDQXJFRSxNQUFNLDRDQXFFUyxJQUFJLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3BCLGNBQUksRUFBRSxJQUFJO1NBQ2IsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7T0FDeEM7S0FDRjs7O1NBOUNjLGVBQUc7QUFDaEIsVUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDL0IsYUFBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0tBQ2hCOzs7V0FrQmdCLG9CQUFDLE9BQU8sRUFBRSxTQUFTLEVBQWlCO1VBQWYsSUFBSSx5REFBRyxNQUFNOztBQUNqRCxVQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUU7QUFDYixjQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztPQUN2RDtLQUNGOzs7V0F1QmUsbUJBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ3pDLFVBQUksTUFBTSxDQUFDLEVBQUUsRUFBRTtBQUNiLGNBQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO09BQzdDO0tBQ0Y7OztTQWxGRyxNQUFNO0dBQVMsZ0JBQWdCOztBQXNGckMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN2RnhCLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDdkQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztJQUU3QixRQUFRO2NBQVIsUUFBUTs7QUFDQyxhQURULFFBQVEsQ0FDRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzhCQUR4QixRQUFROztBQUVOLG1DQUZGLFFBQVEsNkNBRUEsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNwQixZQUFJLE1BQU0sWUFBQTtZQUFFLENBQUMsWUFBQTtZQUFFLENBQUMsWUFBQSxDQUFDO0FBQ2pCLFlBQUksTUFBTSxJQUFJLElBQUksRUFBRTtBQUNoQixrQkFBTSxHQUFHLEVBQUUsQ0FBQztTQUNmO0FBQ0QsY0FBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDcEIsWUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDekQsZ0JBQUksTUFBTSxHQUFHO0FBQ1Qsd0JBQVEsRUFBRSxJQUFJO0FBQ2QsNkJBQWEsRUFBRSxJQUFJLENBQUMsS0FBSztBQUN6Qiw2QkFBYSxFQUFFLElBQUk7QUFDbkIsK0JBQWUsRUFBRSxJQUFJO0FBQ3JCLG9CQUFJLEVBQUUsUUFBUTtBQUNkLHdCQUFRLEVBQUUsSUFBSTtBQUNkLDBCQUFVLEVBQUUsb0JBQVUsR0FBRyxFQUFFO0FBQ3ZCLDBCQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzVFO2FBQ0osQ0FBQztBQUNGLGtCQUFNLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDOztBQUV4RCxhQUFDLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxhQUFDLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO0FBQzNCLGFBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2YsYUFBQyxDQUFDLEdBQUcsR0FBRywwQkFBMEIsR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BELGFBQUMsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsYUFBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQjtBQUNELFlBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztLQUNuQzs7aUJBOUJDLFFBQVE7O2VBcUNOLGdCQUFHO0FBQ0gsdUNBdENGLFFBQVEsc0NBc0NPO1NBQ2hCOzs7ZUFFTSxtQkFBRztBQUNOLHVDQTFDRixRQUFRLHlDQTBDVTtTQUNuQjs7O2FBWGMsZUFBRztBQUNkLGdCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNqRCxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3hCOzs7V0FuQ0MsUUFBUTtHQUFTLGdCQUFnQjs7QUFnRHZDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDcEQxQixJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBOztJQUVqRCxPQUFPO1lBQVAsT0FBTzs7QUFDQSxXQURQLE9BQU8sQ0FDQyxNQUFNLEVBQUUsSUFBSSxFQUFFOzs7MEJBRHRCLE9BQU87O0FBRVQsK0JBRkUsT0FBTyw2Q0FFSCxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3BCLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTNDLE9BQUcsQ0FBQyxHQUFHLEdBQUcsb0NBQW9DLENBQUM7QUFDL0MsUUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLGtCQUFjLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDNUQsVUFBTSxDQUFDLHVCQUF1QixHQUFHLFlBQU07QUFDbkMsWUFBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQTtLQUN0QixDQUFBO0dBQ0Y7O2VBWEcsT0FBTzs7V0FrQlAsZ0JBQUc7QUFDTCxpQ0FuQkUsT0FBTyxzQ0FtQkk7S0FFZDs7O1dBRU0sbUJBQUc7QUFDUixpQ0F4QkUsT0FBTyx5Q0F3Qk87S0FFakI7OztXQU1RLG1CQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtBQUNsQyxpQ0FqQ0UsT0FBTywyQ0FpQ08sR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO0tBRTNDOzs7V0FFUyxvQkFBQyxJQUFJLEVBQUU7QUFDZixpQ0F0Q0UsT0FBTyw0Q0FzQ1EsSUFBSSxFQUFFO0tBRXhCOzs7U0EzQmMsZUFBRztBQUNoQixVQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUMvQixhQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7S0FDaEI7OztXQVlnQixvQkFBQyxPQUFPLEVBQUUsU0FBUyxFQUFpQjtVQUFmLElBQUkseURBQUcsTUFBTTtLQUVsRDs7O1NBOUJHLE9BQU87R0FBUyxnQkFBZ0I7O0FBNEN0QyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7Ozs7Ozs7O0lDOUNuQixnQkFBZ0I7QUFDVixVQUROLGdCQUFnQixDQUNULE1BQU0sRUFBRSxJQUFJLEVBQUU7d0JBRHJCLGdCQUFnQjs7QUFFcEIsTUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7RUFDakI7O2NBSkksZ0JBQWdCOztTQU1qQixnQkFBRyxFQUVOOzs7U0FNTSxtQkFBRyxFQUVUOzs7U0FFUSxxQkFBRyxFQUVYOzs7U0FFUyxzQkFBRyxFQUVaOzs7U0FFSyxrQkFBRyxFQUVSOzs7T0FsQmMsZUFBRztBQUNqQixVQUFPLEVBQUUsQ0FBQztHQUNWOzs7UUFaSSxnQkFBZ0I7OztBQWdDdEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ2hDbEMsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQTs7SUFFakQsTUFBTTtZQUFOLE1BQU07O0FBQ0MsV0FEUCxNQUFNLENBQ0UsTUFBTSxFQUFFLElBQUksRUFBRTswQkFEdEIsTUFBTTs7QUFFUiwrQkFGRSxNQUFNLDZDQUVGLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0FBRXBCLEtBQUMsWUFBWTtBQUNYLFVBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQUFBQyxFQUFFLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDLEFBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDeEYsUUFBRSxDQUFDLEdBQUcsR0FBRyx3Q0FBd0MsQ0FBQztBQUNsRCxVQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDdEYsQ0FBQSxFQUFHLENBQUM7OztBQUdMLEtBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3hCLE9BQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMzQixtQkFBVyxFQUNYLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVE7T0FDdEMsQ0FBQyxDQUFDLEFBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUN0QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7VUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLFdBQVcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxBQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEFBQUMsQ0FBQyxDQUFDLEdBQUcsR0FDckYsdUNBQXVDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxBQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNyRixDQUFBLENBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXBFLEtBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDOUIsT0FBQyxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxZQUFZO0FBQ3pELFNBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQSxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsQUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFDbEQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDekQsT0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2pDLENBQUEsQ0FBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSx5Q0FBeUMsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUVqRjs7ZUE1QkcsTUFBTTs7V0FtQ04sZ0JBQUc7QUFDTCxpQ0FwQ0UsTUFBTSxzQ0FvQ0s7QUFDYixVQUFJLElBQUksR0FBRyxNQUFNLENBQUM7QUFDbEIsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDbEMsVUFBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ2pDLFlBQUksR0FBRyxNQUFNLENBQUM7T0FDZjtBQUNELFVBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQ3RDOzs7V0FFTSxtQkFBRztBQUNSLGlDQS9DRSxNQUFNLHlDQStDUTtBQUNoQixVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyRDs7O1dBUVEsbUJBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ2xDLGlDQTFERSxNQUFNLDJDQTBEUSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDMUMsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BCLFlBQUksTUFBTSxJQUFJLElBQUksRUFBRTtBQUNsQixjQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNwRCxNQUFNO0FBQ0wsY0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3RDO09BQ0Y7S0FDRjs7O1dBRVMsb0JBQUMsSUFBSSxFQUFFO0FBQ2YsaUNBckVFLE1BQU0sNENBcUVTLElBQUksRUFBRTtBQUN2QixVQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDcEIsY0FBSSxFQUFFLElBQUk7U0FDYixDQUFDLENBQUM7QUFDSCxZQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztPQUN4QztLQUNGOzs7U0E5Q2MsZUFBRztBQUNoQixVQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUMvQixhQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7S0FDaEI7OztXQWtCZ0Isb0JBQUMsT0FBTyxFQUFFLFNBQVMsRUFBaUI7VUFBZixJQUFJLHlEQUFHLE1BQU07O0FBQ2pELFVBQUksTUFBTSxDQUFDLEVBQUUsRUFBRTtBQUNiLGNBQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO09BQ3ZEO0tBQ0Y7OztXQXVCZSxtQkFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDekMsVUFBSSxNQUFNLENBQUMsRUFBRSxFQUFFO0FBQ2IsY0FBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7T0FDN0M7S0FDRjs7O1NBbEZHLE1BQU07R0FBUyxnQkFBZ0I7O0FBc0ZyQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7Ozs7Ozs7O0FDeEZ4QixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFBO0FBQ3hCLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUE7QUFDbEMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUE7QUFDbkQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDL0MsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7QUFDNUMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7QUFDeEMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUE7O0lBRW5ELFdBQVc7QUFDRixhQURULFdBQVcsQ0FDRCxPQUFPLEVBQUUsUUFBUSxFQUFFOzhCQUQ3QixXQUFXOztBQUVULFlBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwRCxZQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDbEI7O2lCQU5DLFdBQVc7O2VBUU4sbUJBQUc7QUFDTixnQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDaEIsb0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQzdDLHFCQUFDLE9BQUssU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuRCx3QkFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQiw2QkFBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sUUFBTSxTQUFTLENBQUMsUUFBUSxDQUFDLGtCQUFrQixBQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUU3RSxxQkFBQyxDQUFDLEtBQUssQ0FBQyxZQUFNO0FBQ1YsZ0NBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQiw4QkFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2QsNEJBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLG9DQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXBCLCtCQUFPLEVBQUUsQ0FBQztxQkFDYixFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUNYLENBQUMsQ0FBQzthQUNOO0FBQ0QsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN4Qjs7O2VBRU8sa0JBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQWE7Ozs4Q0FBUixNQUFNO0FBQU4sc0JBQU07OztBQUNoQyxnQkFBSSxHQUFHLEdBQUcsWUFBQSxJQUFJLENBQUMsT0FBTyxFQUFDLEdBQUcsTUFBQSxZQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxTQUFLLE1BQU0sRUFBQyxDQUFDO0FBQ3hELGdCQUFJLENBQUMsR0FBRyxFQUFFOzs7QUFDTiw0QkFBQSxJQUFJLENBQUMsT0FBTyxhQUFHLFlBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFLLE1BQU0sRUFBQyxDQUFDO2FBQ3RFO1NBQ0o7OztXQWpDQyxXQUFXOzs7QUFvQ2pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDOzs7OztBQzlDN0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUE7QUFDbEMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDN0MsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUE7QUFDdEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVqQixJQUFNLElBQUkseUpBTVQsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxVQUFTLElBQUksRUFBRTs7O0FBRTFELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUUvQyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFDLEdBQUcsRUFBSztBQUN4QixZQUFJLENBQUMsTUFBSyxNQUFNLEVBQUU7QUFDZCxhQUFDLENBQUMsTUFBSyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFeEIsa0JBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFLLEtBQUssQ0FBQyxDQUFDO0FBQzFDLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFbkIsa0JBQUssTUFBTSxFQUFFLENBQUM7U0FHakIsTUFBTTtBQUNILGdCQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDeEMsc0JBQUssTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3RCO1NBQ0o7QUFDRCxpQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3BCLENBQUE7O0FBRUQsUUFBSSxDQUFDLEtBQUssR0FBRyxVQUFDLElBQUksRUFBSztBQUNuQixZQUFJLElBQUksQ0FBQyxFQUFFLElBQUksTUFBSyxLQUFLLEVBQUU7QUFDdkIsa0JBQUssTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixnQkFBSSxNQUFLLEtBQUssRUFBRTtBQUNaLHVCQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsZ0JBQWMsTUFBSyxLQUFLLENBQUcsQ0FBQzthQUNuRDtBQUNELGtCQUFLLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3JCLHFCQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWxCLG1CQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsZ0JBQWMsSUFBSSxDQUFDLEVBQUUsRUFBSSxNQUFLLFdBQVcsQ0FBQyxDQUFDO0FBQzlELG1CQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFLLEtBQUssQ0FBQyxDQUFDO1NBQzVEO0tBQ0osQ0FBQTs7QUFFRCxXQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhELFFBQUksQ0FBQyxhQUFhLEdBQUcsWUFBTTtBQUN2QixTQUFDLENBQUMsTUFBSyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDaEIsa0JBQU0sRUFBRSxNQUFNLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxJQUFJO1NBQzFDLENBQUMsQ0FBQztLQUNOLENBQUE7O0FBRUQsUUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUNwQixjQUFLLGFBQWEsRUFBRSxDQUFDO0tBQ3hCLENBQUMsQ0FBQzs7QUFFSCxLQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDbkIsY0FBSyxhQUFhLEVBQUUsQ0FBQztLQUN4QixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUM7Ozs7O0FDcEVILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25DLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUc5QyxJQUFNLElBQUksT0FDVCxDQUFBOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsSUFBSSxFQUFFLEVBRXZELENBQUMsQ0FBQzs7Ozs7QUNWSCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUV4QyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRXZELElBQU0sSUFBSSwraUdBMERULENBQUE7O0FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLFVBQVMsSUFBSSxFQUFFOzs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsR0FBRyxvQ0FBb0MsQ0FBQztBQUMxRCxRQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7QUFDaEIsZUFBTyxvRkFBbUY7QUFDMUYsY0FBTSxFQUFFLFFBQVE7QUFDaEIsZUFBTyxFQUFFLElBQUksQ0FBQyxhQUFhO0FBQzNCLFlBQUksRUFBRSxJQUFJLElBQUksRUFBRTtLQUNoQixDQUFDLENBQUM7O0FBRUgsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRTVDLFFBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQU0sRUFBRSxDQUFDLENBQUM7O0FBRTVCLFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQU07O0FBRXRCLGNBQUssTUFBTSxFQUFFLENBQUM7S0FDZCxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFNO0FBQ3ZCLFlBQUksQ0FBQyxNQUFLLE9BQU8sRUFBRTtBQUNsQixtQkFBTyxnQkFBZ0IsQ0FBQztTQUN4QixNQUFNO0FBQ04sbUJBQU8sRUFBRSxDQUFDO1NBQ1Y7S0FDRCxDQUFBOztBQUVELFFBQUksQ0FBQyxlQUFlLEdBQUcsWUFBdUI7WUFBdEIsSUFBSSx5REFBRyxJQUFJLElBQUksRUFBRTs7QUFDeEMsZUFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDOUIsQ0FBQTs7QUFFRCxRQUFJLENBQUMsUUFBUSxHQUFHLFVBQUMsR0FBRyxFQUFLO0FBQ3hCLGNBQUssUUFBUSxDQUFDLElBQUksQ0FBQztBQUNsQixtQkFBTyxFQUFFLE1BQUssVUFBVSxDQUFDLEtBQUs7QUFDOUIsa0JBQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVE7QUFDN0IsbUJBQU8sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU87QUFDN0IsZ0JBQUksRUFBRSxJQUFJLElBQUksRUFBRTtTQUNoQixDQUFDLENBQUE7QUFDRixjQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDbEIsbUJBQU8sb0JBQWtCLE1BQUssVUFBVSxDQUFDLEtBQUsscUJBQWlCO0FBQy9ELGtCQUFNLEVBQUUsUUFBUTtBQUNoQixtQkFBTyxFQUFFLE1BQUssYUFBYTtBQUMzQixnQkFBSSxFQUFFLElBQUksSUFBSSxFQUFFO1NBQ2hCLENBQUMsQ0FBQTtBQUNGLGNBQUssVUFBVSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7QUFDMUIsY0FBSyxNQUFNLEVBQUUsQ0FBQztBQUNkLGNBQUssU0FBUyxDQUFDLFNBQVMsR0FBRyxNQUFLLFNBQVMsQ0FBQyxZQUFZLENBQUE7QUFDdEQsVUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFLLFNBQVMsQ0FBQyxDQUFBO0tBQ3pCLENBQUE7O0FBRUQsUUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFDLEtBQUssRUFBSztBQUN4QixjQUFLLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDckIsY0FBSyxNQUFNLEVBQUUsQ0FBQztLQUNkLENBQUE7Q0FFRCxDQUFDLENBQUM7Ozs7O0FDMUhILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsVUFBVSxJQUFJLEVBQUU7OztBQUM5RCxRQUFJLENBQUMsYUFBYSxHQUFHLFlBQVk7QUFDN0IsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQUFBQyxJQUFJLEdBQUssSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLEdBQUksRUFBRSxDQUFDO0tBQzVELENBQUM7O0FBRUYsUUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUNwQixjQUFLLGFBQWEsRUFBRSxDQUFDO0tBQ3hCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Q0FDeEIsQ0FBQyxDQUFDOzs7OztBQ1pILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3ZCLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBOztBQUUzQixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtBQUN0RCxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM3QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQTs7QUFFNUMsSUFBTSxJQUFJLGszR0FnRVQsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLElBQUksRUFBRTs7O0FBRXJELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQzNDLFFBQU0sS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFdkMsUUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWYsUUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFDLENBQUMsRUFBRSxJQUFJLEVBQUs7QUFDOUIsaUJBQVM7S0FDWixDQUFBOztBQUVELFFBQUksQ0FBQyxPQUFPLEdBQUcsVUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFLO0FBQ3hCLGNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBSyxVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUc7QUFDNUMsZ0JBQUksRUFBRSxNQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxNQUFNLElBQUksTUFBSyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksT0FBTztBQUNqRSxpQkFBSyxFQUFFLE1BQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLE9BQU87QUFDbkMsZ0JBQUksRUFBRSxNQUFLLFVBQVUsQ0FBQyxJQUFJO0FBQzFCLG1CQUFPLEVBQUUsTUFBSyxVQUFVLENBQUMsT0FBTztTQUNuQyxDQUFBO0FBQ0QsYUFBSyxDQUFDLFFBQVEsQ0FBQyxNQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBSyxVQUFVLEVBQUUsTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFLLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBOztBQUU3RixjQUFLLFVBQVUsR0FBRyxJQUFJLENBQUE7QUFDdEIsY0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUM1QixTQUFDLENBQUMsTUFBSyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtLQUM5QixDQUFBOztBQUVELFFBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFLO0FBQzFCLFNBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUN4QixlQUFPLE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMxQyxhQUFLLENBQUMsV0FBVyxDQUFDLE1BQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQy9DLENBQUE7O0FBRUQsUUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDeEIsWUFBSSxJQUFJLEVBQUU7QUFDTixhQUFDLENBQUMsTUFBTSxDQUFDLE1BQUssSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzdCO0tBQ0osQ0FBQyxDQUFBOztBQUVGLFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxFQUFFLElBQUksRUFBSztBQUMxQixTQUFDLENBQUMsTUFBSyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDakMsY0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ2pELHFCQUFTLEVBQUUsSUFBSTtTQUNsQixFQUFDO0FBQ0Usa0JBQU0sRUFBRSxnQkFBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBSztBQUN4Qyx1QkFBTyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ1Ysd0JBQUksRUFBRSxNQUFNO0FBQ1osdUJBQUcsRUFBRSxtQ0FBbUM7QUFDeEMsd0JBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFFO0FBQ2xCLHFDQUFhLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNO0FBQ2xDLGlDQUFTLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFjO0FBQzFDLHFDQUFhLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBQ2hELDhCQUFNLEVBQUUsS0FBSztxQkFDaEIsQ0FBQztBQUNGLCtCQUFXLEVBQUUsaUNBQWlDO0FBQzlDLDJCQUFPLEVBQUUsaUJBQVUsSUFBSSxFQUFFO0FBQ3JCLDRCQUFJLENBQUMsSUFBSSxDQUFDO0FBQ04sOEJBQUUsRUFBRSxHQUFHO0FBQ1AsbUNBQU8sRUFBRSw0QkFBNEI7QUFDckMsZ0NBQUksRUFBRSxRQUFRO3lCQUNqQixDQUFDLENBQUE7QUFDRixtQ0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO3FCQUNwQjtBQUNELHlCQUFLLEVBQUcsZUFBVSxDQUFDLEVBQUU7QUFDakIsK0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2xCO2lCQUNKLENBQUMsQ0FBQzthQUNGO0FBQ0wsbUJBQU8sRUFBRSxpQkFBQyxHQUFHLEVBQUs7QUFDZCx1QkFBTyxHQUFHLENBQUMsSUFBSSxDQUFDO2FBQ25CO0FBQ0QscUJBQVMsRUFBRTtBQUNQLHFCQUFLLEVBQUUsQ0FDUCxzREFBc0QsRUFDbEQsOENBQThDLEVBQ2xELFFBQVEsQ0FDUCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDWiwwQkFBVSxFQUFFLG9CQUFDLEtBQUssRUFBSztBQUFFLCtDQUF5QixLQUFLLENBQUMsSUFBSSx5REFBb0QsS0FBSyxDQUFDLE9BQU8sV0FBTSxLQUFLLENBQUMsSUFBSSxZQUFRO2lCQUFFO2FBQzFKO1NBQ0osQ0FBQyxDQUFBO0FBQ0YsY0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLFVBQUMsRUFBRSxFQUFFLFVBQVUsRUFBSztBQUMvQyxrQkFBSyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLGFBQUMsQ0FBQyxNQUFLLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQzlCLENBQUMsQ0FBQTtBQUNGLGNBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxVQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUs7QUFDckQsa0JBQUssVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixhQUFDLENBQUMsTUFBSyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUM5QixDQUFDLENBQUE7QUFDRixjQUFLLE1BQU0sR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQzFDLGlCQUFLLEVBQUUsTUFBTTtTQUNoQixDQUFDLENBQUE7S0FDTCxDQUFDLENBQUE7Q0FDTCxDQUFDLENBQUM7Ozs7O0FDcktILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUE7O0FBRW5DLElBQU0sSUFBSSw2dkJBaUJULENBQUM7O0FBRUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVUsSUFBSSxFQUFFOzs7QUFFeEMsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRTVDLFFBQUksQ0FBQyxPQUFPLEdBQUcsVUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFLO0FBQzlCLGVBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLGVBQU8sSUFBSSxDQUFDO0tBQ2YsQ0FBQTs7QUFFRCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ25CLGVBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxVQUFDLElBQUksRUFBSztBQUMxQyxrQkFBSyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxVQUFDLENBQUMsRUFBSztBQUNqRCxvQkFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7QUFDaEMsdUJBQU8sT0FBTyxDQUFDO2FBQ2xCLENBQUMsQ0FBQztBQUNILGtCQUFLLE1BQU0sRUFBRSxDQUFDO1NBQ2pCLENBQUMsQ0FBQztLQUNOLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQzs7Ozs7QUMxQ0gsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzQixPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUNuQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRWhDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0FBQ3RELE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBOztBQUU1QixJQUFNLElBQUksZzNEQW9DVCxDQUFDOztBQUVGLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLFVBQVUsSUFBSSxFQUFFOzs7QUFFakQsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDL0MsUUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRXpFLFFBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7O0FBRTNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsVUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFLO0FBQzlCLFlBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFBO0FBQ3pCLGVBQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBSyxNQUFNLFNBQUksSUFBSSxDQUFDLEVBQUUsY0FBVyxDQUFBO0FBQzlELGdCQUFRLElBQUksQ0FBQyxJQUFJO0FBQ2IsaUJBQUssU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHO0FBQzNCLHVCQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBUSxJQUFJLENBQUMsS0FBSyxDQUFHLENBQUM7QUFDdkMsc0JBQU07QUFBQSxTQUNiO0FBQ0QsZUFBTyxJQUFJLENBQUM7S0FDZixDQUFBOztBQUVELFFBQUksQ0FBQyxPQUFPLEdBQUcsVUFBQyxJQUFJLEVBQUs7QUFDckIsZUFBTyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUMxQyxDQUFBOztBQUVELFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDbkIsZUFBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQzNCLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNaLGdCQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1AsdUJBQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQ3RCLHlCQUFLLEVBQUUsNEJBQTRCO0FBQ25DLHdCQUFJLE9BQUssSUFBSSxJQUFJLEVBQUUsQUFBRztBQUN0QiwyQkFBTyxFQUFFLEtBQUs7aUJBQ2pCLEVBQUUsTUFBTSxDQUFDLENBQUE7YUFDYjtBQUNELG1CQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFDLElBQUksRUFBSztBQUN0RixzQkFBSyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFDLENBQUMsRUFBRSxFQUFFLEVBQUs7QUFBRSxxQkFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQUFBQyxPQUFPLENBQUMsQ0FBQztpQkFBRyxDQUFDLENBQUM7QUFDMUUsc0JBQUssYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFLLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQzFFLHdCQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztBQUNoQywyQkFBTyxPQUFPLENBQUM7aUJBQ2xCLENBQUMsQ0FBQztBQUNILHNCQUFLLE1BQU0sRUFBRSxDQUFDO2FBQ2pCLENBQUMsQ0FBQztTQUNOLENBQUMsQ0FBQTtLQUNULENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQzs7Ozs7QUN6RkgsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzQixPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQTs7QUFFbkMsSUFBTSxJQUFJLDJuREErQlQsQ0FBQzs7QUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsVUFBVSxJQUFJLEVBQUU7OztBQUUxQyxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQUssRUFBRSxNQUFNLEVBQUs7QUFDOUIsZUFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0IsZUFBTyxJQUFJLENBQUM7S0FDZixDQUFBOztBQUVELFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDbkIsZUFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFlBQVUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLGNBQVcsVUFBQyxJQUFJLEVBQUs7QUFDakUsa0JBQUssTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDbkQsb0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO0FBQ2hDLHVCQUFPLE9BQU8sQ0FBQzthQUNsQixDQUFDLENBQUM7QUFDSCxrQkFBSyxNQUFNLEVBQUUsQ0FBQztTQUNqQixDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUM7Ozs7O0FDeERILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUE7O0FBRW5DLElBQU0sSUFBSSxpeEJBZVQsQ0FBQzs7QUFFRixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxJQUFJLEVBQUU7OztBQUV4QyxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFL0MsUUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFNO0FBQ2hCLGVBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNwQixDQUFBOztBQUVELFFBQUksQ0FBQyxXQUFXLEdBQUcsWUFBTTtBQUNyQixlQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQy9CLENBQUE7O0FBRUQsUUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQUssRUFBRSxNQUFNLEVBQUs7QUFDOUIsZ0JBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJO0FBQ2xCLGlCQUFLLHVCQUF1QjtBQUN4QixzQkFBSyxXQUFXLEVBQUUsQ0FBQztBQUNuQix1QkFBTyxLQUFLLENBQUM7QUFDYixzQkFBTTs7QUFBQSxBQUVWO0FBQ0ksdUJBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLHVCQUFPLElBQUksQ0FBQztBQUNaLHNCQUFNO0FBQUEsU0FDYjtLQUNKLENBQUE7O0FBRUQsUUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUNuQixlQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsaUJBQWlCLFVBQUMsSUFBSSxFQUFLO0FBQzFDLGtCQUFLLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUN6QyxrQkFBSyxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDcEMsa0JBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDakQsb0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO0FBQ2hDLHVCQUFPLE9BQU8sQ0FBQzthQUNsQixDQUFDLENBQUM7QUFDSCxrQkFBSyxNQUFNLEVBQUUsQ0FBQztTQUNqQixDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUM7Ozs7O0FDOURILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUE7O0FBRW5DLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQ25ELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFCLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBOztBQUVqRCxJQUFNLElBQUksMHFDQWdDVCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFVBQVUsSUFBSSxFQUFFOzs7QUFFNUQsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUV6QyxRQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLGlCQUFpQixDQUFDO0FBQ3RELFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztBQUVwQixRQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDMUIsWUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztBQUNuQixZQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7O0FBQ2hCLG9CQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxpQkFBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQUMsR0FBRyxFQUFLO0FBQzVCLHdCQUFJLENBQUMsSUFBSSxDQUFDLE1BQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQzdCLENBQUMsQ0FBQztBQUNILG1CQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7O1NBQzlDO0FBQ0QsZUFBTyxHQUFHLENBQUM7S0FDZCxDQUFBOztBQUVELFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDM0IsWUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxZQUFJLENBQUMsR0FBRyxFQUFFO0FBQ04sZ0JBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQzdDLGVBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2hEO0FBQ0QsWUFBSSxHQUFHLElBQUksTUFBSyxHQUFHLElBQUksV0FBVyxFQUFFO0FBQ2hDLG9CQUFRLEdBQUcsQ0FBQyxLQUFLO0FBQ2IscUJBQUssV0FBVyxDQUFDO0FBQ2pCLHFCQUFLLFlBQVk7QUFDYix1QkFBRyxHQUFHLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUM5QiwwQkFBTTtBQUFBLGFBQ2I7U0FDSjtBQUNELGVBQU8sR0FBRyxDQUFDO0tBQ2QsQ0FBQTs7QUFFRCxRQUFJLENBQUMsY0FBYyxHQUFHLFVBQUMsR0FBRyxFQUFLO0FBQzNCLG1CQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDbEMsY0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQTtBQUNwQixZQUFJLFdBQVcsQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUMxQixrQkFBSyxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7U0FDakMsTUFBTTtBQUNILGtCQUFLLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLGNBQWMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUE7U0FDbkU7QUFDRCxZQUFJLFdBQVcsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDekMsYUFBQyxDQUFDLE1BQUssUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNLEVBQUs7QUFDNUUsdUJBQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLFNBQUksTUFBSyxLQUFLLFdBQVEsQ0FBQzthQUNqRyxDQUFDLENBQUM7QUFDSCxrQkFBSyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO0FBQ0QsY0FBSyxNQUFNLEVBQUUsQ0FBQTtLQUNoQixDQUFBOztBQUVELFdBQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxVQUFDLElBQUksRUFBSztBQUN4QyxZQUFJLE1BQUssTUFBTSxFQUFFO0FBQ2IsYUFBQyxDQUFDLE1BQUssUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDO0FBQ0QsWUFBSSxNQUFLLEtBQUssRUFBRTtBQUNaLG1CQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsU0FBSSxNQUFLLEtBQUssQ0FBRyxDQUFDO0FBQ3BFLGtCQUFLLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsa0JBQUssR0FBRyxHQUFHLElBQUksQ0FBQTtTQUNsQjtBQUNELFlBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNULGtCQUFLLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3JCLG1CQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsU0FBSSxJQUFJLENBQUMsRUFBRSxFQUFJLFVBQUMsR0FBRyxFQUFLO0FBQ3JFLHNCQUFLLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUMzQixDQUFDLENBQUM7U0FDTjtBQUNELGNBQUssUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDO0FBQ3BDLGNBQUssTUFBTSxFQUFFLENBQUM7S0FDakIsQ0FBQyxDQUFDOztBQUVILFdBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQzdDLGNBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDakQsZ0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO0FBQ2hDLG1CQUFPLE9BQU8sQ0FBQztTQUNsQixDQUFDLENBQUM7QUFDSCxjQUFLLE1BQU0sRUFBRSxDQUFDO0tBQ2pCLENBQUMsQ0FBQztDQUVOLENBQUMsQ0FBQzs7Ozs7QUM5SEgsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM1QyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNsRCxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDNUMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBRXBELElBQU0sSUFBSSxvTkFVSCxDQUFDOztBQUVSLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVMsSUFBSSxFQUFFOzs7QUFFeEQsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUV6QyxRQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ25CLFlBQUksQ0FBQyxLQUFLLENBQUMsTUFBSyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNqRCxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQUssbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztLQUMxRCxDQUFDLENBQUM7Q0FFTixDQUFDLENBQUM7Ozs7O0FDM0JILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFOUMsSUFBTSxJQUFJLHVGQUtULENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxVQUFTLElBQUksRUFBRTs7O0FBRTdELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUNuQixZQUFJLENBQUMsS0FBSyxDQUFDLE1BQUssaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUM7S0FDdEQsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDOzs7OztBQ2xCSCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDcEQsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBOztBQUVyQyxJQUFNLElBQUksd1BBV1QsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxVQUFVLElBQUksRUFBRTs7O0FBRTVELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUNuQixZQUFJLENBQUMsS0FBSyxDQUFDLE1BQUssdUJBQXVCLEVBQUUsZUFBZSxDQUFDLENBQUE7QUFDekQsY0FBSyxNQUFNLEVBQUUsQ0FBQTtLQUNoQixDQUFDLENBQUE7O0FBRUYsUUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFNO0FBQ2hCLFlBQUksS0FBSyxHQUFNLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxPQUFJLENBQUM7QUFDMUMsU0FBQyxDQUFDLE1BQUssZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNsRCxDQUFBOztBQUVELEtBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDekIsY0FBSyxNQUFNLEVBQUUsQ0FBQTtLQUNoQixDQUFDLENBQUM7Q0FLTixDQUFDLENBQUM7Ozs7O0FDdkNILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFN0IsSUFBTSxJQUFJLHdLQU1ULENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsVUFBUyxJQUFJLEVBQUU7O0FBRTFELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztDQUM1QyxDQUFDLENBQUM7Ozs7O0FDYkgsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzNDLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pELElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQy9DLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUU5QyxJQUFNLElBQUksMGZBa0JULENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsVUFBUyxJQUFJLEVBQUU7OztBQUUxRCxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDbkIsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFLLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM3QyxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQUssaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDbkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFLLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM5QyxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQUssYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQ2xELENBQUMsQ0FBQztDQUVOLENBQUMsQ0FBQzs7Ozs7QUNyQ0gsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztBQUVwRCxJQUFNLElBQUksNGlCQVlULENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBUyxJQUFJLEVBQUU7OztBQUV4RCxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxPQUFPLEdBQUcsWUFBTTs7S0FFcEIsQ0FBQTs7QUFFRCxRQUFJLENBQUMsVUFBVSxHQUFHLFVBQUMsRUFBRSxFQUFLOztBQUV0QixZQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO0FBQ3JGLG1CQUFPLFNBQVMsQ0FBQTtTQUNuQixNQUFNO0FBQ0gsbUJBQU8sUUFBUSxDQUFBO1NBQ2xCO0tBQ0osQ0FBQTs7QUFFRCxXQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDeEMsY0FBSyxNQUFNLEVBQUUsQ0FBQTtLQUNoQixDQUFDLENBQUE7Ozs7Ozs7Ozs7Ozs7Q0FjTCxDQUFDLENBQUM7Ozs7O0FDbERILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFN0IsSUFBTSxJQUFJLHloQkFZVCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLFVBQVMsSUFBSSxFQUFFOztBQUUxRCxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7Q0FHNUMsQ0FBQyxDQUFDOzs7OztBQ3JCSCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBRXBELElBQU0sSUFBSSwrK0JBeUJULENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsVUFBUyxJQUFJLEVBQUU7OztBQUUzRCxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsWUFBVztBQUFFLGVBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7S0FBRSxDQUFBO0FBQzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVmLFdBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQzdDLGNBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDakQsZ0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO0FBQ2hDLGdCQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsaUJBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDaEQsMkJBQU8sQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7aUJBQzVCLENBQUMsQ0FBQzthQUNOO0FBQ0QsbUJBQU8sT0FBTyxDQUFDO1NBQ2xCLENBQUMsQ0FBQztBQUNILGNBQUssTUFBTSxFQUFFLENBQUM7S0FDakIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxVQUFVLEdBQUcsWUFBTTtBQUNwQixZQUFHLENBQUMsTUFBSyxPQUFPLEVBQUU7QUFDZCxtQkFBTyxnQkFBZ0IsQ0FBQztTQUMzQixNQUFNO0FBQ0gsbUJBQU8sRUFBRSxDQUFDO1NBQ2I7S0FDSixDQUFBOztBQUVELFdBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLFlBQU07QUFDckQsY0FBSyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLGNBQUssTUFBTSxFQUFFLENBQUM7S0FDakIsQ0FBQyxDQUFDOztBQUdILFdBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLFlBQU07QUFDcEQsY0FBSyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGNBQUssTUFBTSxFQUFFLENBQUM7S0FDakIsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDOzs7OztBQ3JFSCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzNCLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFBOztBQUVuQyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNwRCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNoRCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNoRCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFeEQsSUFBTSxJQUFJLEdBQUc7Ozs2U0F5QlosQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxVQUFTLElBQUksRUFBRTs7O0FBQzNELFFBQUksQ0FBQyxPQUFPLEdBQUcsVUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFLO0FBQzlCLGVBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLGVBQU8sSUFBSSxDQUFDO0tBQ2YsQ0FBQTs7QUFFRCxRQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFNOzs7QUFHbkIsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFLLHVCQUF1QixFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDL0QsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFLLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM5QyxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQUssZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDbEQsQ0FBQyxDQUFDO0NBRU4sQ0FBQyxDQUFDOzs7OztBQ2xESCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQyxJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzNCLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNyQixPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQTs7QUFFdkMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDdkQsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVqQyxJQUFNLElBQUksa3FDQWdDVCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxJQUFJLEVBQUU7OztBQUV6RSxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFL0MsUUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixRQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxZQUFNLEVBRXZCLENBQUMsQ0FBQTs7O0FBR0YsUUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUNuQixpQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVsQixZQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxJQUFJLEVBQUs7QUFDekIsZ0JBQUk7QUFDQSxzQkFBSyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLG9CQUFJLGNBQWEsRUFBRTtBQUNmLHNDQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUMvQjs7QUFFRCxzQkFBSyxNQUFNLEVBQUUsQ0FBQzs7QUFFZCw4QkFBYSxHQUFHLENBQUMsQ0FBQyx1QkFBc0IsQ0FBQyxDQUFDO0FBQzFDLGtDQUFpQixHQUFHLGNBQWEsQ0FBQyxTQUFTLENBQUM7Ozs7Ozs7QUFPeEMsNkJBQVMsRUFBRSxDQUNQO0FBQ0ksNEJBQUksRUFBRSxNQUFNO0FBQ1osaUNBQVMsRUFBRSxJQUFJO3FCQUNsQixFQUFFO0FBQ0MsNEJBQUksRUFBRSxZQUFZO0FBQ2xCLGlDQUFTLEVBQUUsSUFBSTtxQkFDbEIsQ0FDSjtpQkFDSixDQUFDLENBQUM7O0FBRUgsb0JBQUksWUFBWSxHQUFHLGNBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLDJCQUEyQixDQUFDOztBQUU1Riw0QkFBWSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2FBQ3JHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDUix1QkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwQixTQUFTO0FBQ04seUJBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQjtTQUNKLENBQUM7OztBQUdGLGVBQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQUcsRUFBSztBQUN6RSxnQkFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLGdCQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUs7QUFDbkMsbUJBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ25CLG1CQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNiLG1CQUFHLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkUsdUJBQU8sR0FBRyxDQUFDO2FBQ2QsQ0FBQyxDQUFDO0FBQ0gsc0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQixhQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7U0FDL0IsQ0FBQyxDQUFDO0tBQ0wsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDOzs7OztBQy9HSCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFdkQsSUFBTSxJQUFJLHdvREF1Q1QsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFTLElBQUksRUFBRTs7O0FBRW5ELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU1QyxRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNmLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBOztBQUVoQixXQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLElBQUksRUFBSztBQUNqRCxjQUFLLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxVQUFDLENBQUMsRUFBSztBQUN4RCxnQkFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7QUFDaEMsbUJBQU8sT0FBTyxDQUFDO1NBQ2xCLENBQUMsQ0FBQztBQUNILGNBQUssS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDeEIsY0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMxQixjQUFLLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUUxQixjQUFLLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFdEMsY0FBSyxNQUFNLEVBQUUsQ0FBQzs7QUFFZCxpQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3BCLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQzs7Ozs7QUNuRUgsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25DLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3JCLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBOztBQUV2QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN2RCxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQTs7QUFFbEQsSUFBTSxJQUFJLG8ySUFzRlQsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLElBQUksRUFBRTs7O0FBRXZELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUUvQyxRQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxJQUFJLEdBQUcsQ0FDUCxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQzlDLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUN0RCxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQ2pELENBQUM7QUFDRixRQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ25CLFlBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDMUQsWUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtLQUM5RDtBQUNELFFBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRW5DLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDOzs7QUFHNUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLElBQUksRUFBSztBQUN2QixZQUFJLE1BQU0sR0FBRyxTQUFTLENBQUE7QUFDdEIsWUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFBO0FBQ3BCLFlBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNkLFlBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNsQixnQkFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUEsQUFBQyxFQUFFO0FBQ3RHLHNCQUFNLEdBQUcsUUFBUSxDQUFBO0FBQ2pCLG9CQUFJLEdBQUcsU0FBUyxDQUFBO2FBQ25CLE1BQU07QUFDSCxpQkFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBSztBQUNyQyx3QkFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUMvQyw0QkFBSSw4RkFBNEYsS0FBSyxDQUFDLElBQUksb0JBQWUsS0FBSyxDQUFDLElBQUkseURBQW9ELEtBQUssQ0FBQyxPQUFPLGNBQVcsQ0FBQTtxQkFDbE47aUJBQ0osQ0FBQyxDQUFBO0FBQ0Ysb0JBQUksSUFBSSxFQUFFO0FBQ04sd0JBQUksR0FBRyxxQ0FBcUMsR0FBRyxJQUFJLENBQUM7aUJBQ3ZEO2FBQ0o7U0FDSjtBQUNELFlBQUksR0FBRyxJQUFJLDJDQUF5QyxJQUFJLFVBQUssTUFBTSxZQUFTLENBQUE7O0FBRTVFLGVBQU8sSUFBSSxDQUFDO0tBQ2YsQ0FBQTs7QUFFRCxRQUFJLENBQUMsUUFBUSxHQUFHLFVBQUMsSUFBSSxFQUFLO0FBQ3RCLFlBQUksSUFBSSw2RkFBMkYsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLG9CQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSx5REFBb0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLGNBQVcsQ0FBQTtBQUNqTyxlQUFPLElBQUksQ0FBQztLQUNmLENBQUE7OztBQUdELFFBQUksQ0FBQyxNQUFNLEdBQUcsVUFBQyxLQUFLLEVBQVc7QUFDM0IsZUFBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUcsQ0FBQztLQUM3QyxDQUFBOztBQUVELFFBQUksQ0FBQyxPQUFPLEdBQUcsVUFBQyxLQUFLLEVBQVc7QUFDNUIsWUFBSSxJQUFJLEdBQUc7QUFDUCxlQUFHLEVBQUUsS0FBSyxDQUFDLElBQUk7U0FDbEIsQ0FBQTtBQUNELGdCQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RCLENBQUE7O0FBRUQsUUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFDLEtBQUssRUFBVztBQUMzQixlQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3RCLENBQUE7O0FBRUQsUUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFDLEtBQUssRUFBVztBQUNoQyxjQUFLLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDdEMsU0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFNO0FBQ1gsYUFBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQzlCLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDUixnQkFBUSxNQUFLLFVBQVU7QUFDbkIsaUJBQUssU0FBUzs7QUFFVixzQkFBTTtBQUFBLFNBQ2I7S0FDSixDQUFBOztBQUVELFFBQUksQ0FBQyxhQUFhLEdBQUcsVUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFLO0FBQ2pDLGVBQU8sSUFBSSxDQUFDO0tBQ2YsQ0FBQTs7QUFFRCxRQUFJLENBQUMsV0FBVyxHQUFHLFVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBSztBQUMvQixZQUFJLE1BQUssVUFBVSxJQUFJLFNBQVMsRUFBRTtBQUM5QixvQkFBUSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7QUFDbEMscUJBQUssUUFBUTtBQUNULHdCQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN6RCx3QkFBSSxRQUFRLEdBQUcsZUFBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0Qsd0JBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLHFCQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLElBQUksRUFBSztBQUN2QiwyQkFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQzVCLENBQUMsQ0FBQztBQUNILDhCQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25ELHdCQUFJLElBQUksR0FBRyxlQUFjLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDdkQsd0JBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtBQUNsQix5QkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0IseUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FCQUMvQyxDQUFDLENBQUM7QUFDSCwwQkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsMEJBQU07QUFBQSxhQUNiO1NBQ0o7S0FDSixDQUFBOztBQUVELFFBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQU0sRUFFdkIsQ0FBQyxDQUFBOzs7QUFHRixRQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ25CLGlCQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEIsZUFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDNUMsZ0JBQUksSUFBSSxFQUFFO0FBQ04sc0JBQUssSUFBSSxHQUFHO0FBQ1IsMkJBQU8sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO0FBQ3hDLHdCQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztpQkFDckMsQ0FBQztBQUNGLHNCQUFLLE1BQU0sRUFBRSxDQUFDO2FBQ2pCO1NBQ0osQ0FBQyxDQUFDOztBQUVILFlBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFLO0FBQ3hDLGdCQUFJO0FBQ0Esc0JBQUssSUFBSSxHQUFHLE1BQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUM1QixzQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLG9CQUFJLGdCQUFhLEdBQUcsQ0FBRyxFQUFFO0FBQ3JCLHFCQUFDLHFCQUFtQixHQUFHLENBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0Msd0NBQWlCLEdBQUcsQ0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUNyQzs7QUFFRCxzQkFBSyxNQUFNLEVBQUUsQ0FBQzs7QUFFZCxnQ0FBYSxHQUFHLENBQUcsR0FBRyxDQUFDLENBQUMsd0JBQXFCLEdBQUcsQ0FBRyxDQUFDLENBQUM7QUFDckQsb0NBQWlCLEdBQUcsQ0FBRyxHQUFHLGdCQUFhLEdBQUcsQ0FBRyxDQUFDLFNBQVMsQ0FBQzs7Ozs7OztBQU9wRCw2QkFBUyxFQUFFLENBQ1A7QUFDSSw0QkFBSSxFQUFFLFFBQVE7QUFDZCxpQ0FBUyxFQUFFLEtBQUs7cUJBQ25CLEVBQUU7QUFDQyw0QkFBSSxFQUFFLFFBQVE7QUFDZCxpQ0FBUyxFQUFFLEtBQUs7QUFDaEIsNkJBQUssRUFBRSxPQUFPO3FCQUNqQixFQUFFO0FBQ0MsNEJBQUksRUFBRSxNQUFNO0FBQ1osaUNBQVMsRUFBRSxJQUFJO3FCQUNsQixFQUFFO0FBQ0MsNEJBQUksRUFBRSxZQUFZO0FBQ2xCLGlDQUFTLEVBQUUsSUFBSTtxQkFDbEIsRUFBRTtBQUNDLDRCQUFJLEVBQUUsUUFBUTtBQUNkLGlDQUFTLEVBQUUsS0FBSztxQkFDbkIsQ0FDSjtpQkFDSixDQUFDLENBQUM7OztBQUdILG9CQUFJLFlBQVksR0FBRyxnQkFBYSxHQUFHLENBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLGNBQVksR0FBRyxvQkFBaUIsQ0FBQzs7QUFFdkcsZ0NBQWEsR0FBRyxDQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVk7QUFDNUQsd0JBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsd0JBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUMsMEJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWTtBQUN6Qiw0QkFBSSxPQUFPLEVBQUU7QUFDVCw2QkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUIsNkJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3lCQUM1QyxNQUFNO0FBQ0gsNkJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9CLDZCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDL0M7cUJBQ0osQ0FBQyxDQUFDO0FBQ0gsMEJBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUM5QixDQUFDLENBQUM7O0FBRUgsZ0NBQWEsR0FBRyxDQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxZQUFZO0FBQ2pFLHFCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDL0MsQ0FBQyxDQUFDOztBQUVILDRCQUFZLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUMsUUFBUSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7O0FBRWxHLGlCQUFDLHFCQUFtQixHQUFHLENBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUM1Rix3QkFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQ2pDLDRCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztBQUN6QiwrQkFBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBSyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsU0FBSSxFQUFFLFdBQVEsQ0FBQztxQkFDekY7QUFDRCwyQkFBTyxJQUFJLENBQUM7aUJBQ2YsQ0FBQyxDQUFDOztBQUVILHlCQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7YUFFcEIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNSLHlCQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakIsdUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEI7U0FDSixDQUFDOzs7QUFHRixlQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxHQUFHLEVBQUs7QUFDdkUsZ0JBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN2QixhQUFDLENBQUMsSUFBSSxDQUFDLE1BQUssSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFLO0FBQ3ZCLG9CQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsd0JBQVEsR0FBRyxDQUFDLEtBQUs7QUFDYix5QkFBSyxXQUFXLENBQUM7QUFDakIseUJBQUssU0FBUztBQUNWLDRCQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFLO0FBQzdCLGdDQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUN6QyxtQ0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDbkIsbUNBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2IsbUNBQUcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2RSx1Q0FBTyxHQUFHLENBQUM7NkJBQ2QsTUFBTTtBQUNILHVDQUFPOzZCQUNWO3lCQUNKLENBQUMsQ0FBQztBQUNILDhCQUFNO0FBQUEsQUFDVix5QkFBSyxnQkFBZ0I7QUFDakIsNEJBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUs7QUFDN0IsZ0NBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNO0FBQ3ZDLCtCQUFHLENBQUMsV0FBVztBQUNkLDZCQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQSxDQUFDLEFBQUM7QUFDcEcsK0JBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDbkMsK0JBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSTtBQUNuRCwrQkFBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUEsQUFBQzs4QkFDaEQ7QUFDRix1Q0FBRyxDQUFDLFFBQVEsR0FBSSxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQUFBQyxDQUFBO0FBQ25FLHVDQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNiLHVDQUFHLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkUsMkNBQU8sR0FBRyxDQUFDO2lDQUNkLE1BQU07QUFDSCx1Q0FBTzs2QkFDVjt5QkFDSixDQUFDLENBQUM7QUFDSCw4QkFBTTtBQUFBLEFBQ1YseUJBQUssUUFBUTtBQUNULDRCQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFLO0FBQzdCLGdDQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTTtBQUN2QywrQkFBRyxDQUFDLFdBQVc7QUFDZCwrQkFBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFBLENBQUMsQUFBRTs4QkFDbEc7QUFDRix1Q0FBRyxDQUFDLFFBQVEsR0FBSSxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLEFBQUMsQ0FBQTtBQUNuRCx1Q0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDYix1Q0FBRyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZFLDJDQUFPLEdBQUcsQ0FBQztpQ0FDZCxNQUFNO0FBQ0gsdUNBQU87NkJBQ1Y7eUJBQ0osQ0FBQyxDQUFDO0FBQ0gsOEJBQU07QUFBQSxBQUNWLHlCQUFLLFVBQVU7QUFDWCw0QkFBSSxNQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDbkIsZ0NBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUs7O0FBRTdCLG1DQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNuQixtQ0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDYixtQ0FBRyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZFLHVDQUFPLEdBQUcsQ0FBQzs2QkFDZCxDQUFDLENBQUM7eUJBQ047QUFDRCw4QkFBTTtBQUFBLGlCQUNiO0FBQ0Qsb0JBQUksSUFBSSxFQUFFO0FBQ04sd0JBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBSztBQUFFLCtCQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFBO3FCQUFFLENBQUMsQ0FBQTtBQUN4RCw4QkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQy9CO2FBQ0osQ0FBQyxDQUFBO0FBQ0YsYUFBQyxDQUFDLEtBQUssQ0FBQyxZQUFNO0FBQ1YsaUJBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTthQUM5QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ1osQ0FBQyxDQUFDO0tBQ0wsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDOzs7OztBQ3ZYSCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFdkQsSUFBTSxJQUFJLDQxQkF3QlQsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFTLElBQUksRUFBRTs7O0FBRXBELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUUvQyxRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNmLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBOztBQUVoQixXQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ2pFLGNBQUssS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQzNELGdCQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztBQUNoQyxnQkFBRyxPQUFPLEVBQUU7QUFDUixpQkFBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxVQUFDLENBQUMsRUFBSztBQUNsRCx3QkFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7QUFDakMsMkJBQU8sUUFBUSxDQUFDO2lCQUNuQixDQUFDLENBQUM7YUFDTjtBQUNELG1CQUFPLE9BQU8sQ0FBQztTQUNsQixDQUFDLENBQUM7O0FBRUgsY0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMxQixjQUFLLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFdEMsY0FBSyxNQUFNLEVBQUUsQ0FBQzs7QUFFZCxpQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3BCLENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQzs7Ozs7QUN4REgsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUE7QUFDbEMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUE7QUFDdEQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUE7O0FBRXRELElBQU0sSUFBSSxvY0FhVCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBUyxJQUFJLEVBQUU7OztBQUVwRSxRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFL0MsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7O0FBRWxCLFFBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUN6QixZQUFJLE1BQUssTUFBTSxDQUFDLEVBQUUsRUFBRTtBQUNoQixtQkFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBSyxNQUFNLENBQUMsRUFBRSxFQUFJLFVBQUMsSUFBSSxFQUFLO0FBQzlFLHNCQUFLLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsdUJBQU8sQ0FBQyxPQUFPLE1BQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFckQsc0JBQUssTUFBTSxFQUFFLENBQUM7O0FBRWQseUJBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQixDQUFDLENBQUM7U0FDTjtLQUNKLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxVQUFDLEtBQUssRUFBRSxJQUFJLEVBQUs7QUFDckMsWUFBSSxJQUFJLEVBQUU7QUFDTixrQkFBSyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLG1CQUFPLEVBQUUsQ0FBQTtBQUNULGtCQUFLLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQTtTQUN0RztLQUNKLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsYUFBYSxHQUFHLFlBQU07QUFDdkIsU0FBQyxDQUFDLE1BQUssZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDekIsa0JBQU0sRUFBRSxNQUFNLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxJQUFJO1NBQzFDLENBQUMsQ0FBQztLQUNOLENBQUE7O0FBRUQsUUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUNwQixjQUFLLGFBQWEsRUFBRSxDQUFDO0tBQ3hCLENBQUMsQ0FBQzs7QUFFSCxLQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQU07QUFDbkIsY0FBSyxhQUFhLEVBQUUsQ0FBQztLQUN4QixDQUFDLENBQUM7Q0FFTixDQUFDLENBQUM7Ozs7O0FDN0RILElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTs7OztBQUkzQixJQUFJLElBQUksR0FBRyxDQUFBLFlBQVk7OztBQUduQixRQUFJLFdBQVcsR0FBRyxTQUFkLFdBQVcsR0FBZTs7QUFFMUIsWUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUU5QixZQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUMxRSxhQUFDLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzNDOztBQUVELFNBQUMsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0MsU0FBQyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxTQUFDLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUNyRCxhQUFDLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7U0FDNUU7OztBQUdELFlBQUksV0FBVyxHQUFHLFNBQWQsV0FBVyxHQUFlO0FBQzFCLGFBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQ3ZDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FDekIsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQ2hDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUNqQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FDaEMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRXJDLGFBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFaEUsZ0JBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUN4RCxpQkFBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDeEQ7O0FBRUQsZ0JBQUksQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQzdDLGlCQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDakUsTUFBTSxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQzVELGlCQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDakQsaUJBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUNuRDs7QUFFRCxhQUFDLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRXhFLGFBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ25DLENBQUM7O0FBRUYsWUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7O0FBRTVCLFlBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxHQUFlOztBQUV4QixnQkFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3BELGdCQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEQsZ0JBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN6RCxnQkFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pELGdCQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM3RCxnQkFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDakUsZ0JBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQy9ELGdCQUFJLHNCQUFzQixHQUFHLENBQUMsQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFHdEYsZ0JBQUksYUFBYSxJQUFJLE9BQU8sSUFBSSxZQUFZLElBQUksU0FBUyxFQUFFO0FBQ3ZELHFCQUFLLENBQUMsMEdBQTBHLENBQUMsQ0FBQztBQUNsSCxpQkFBQyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxpQkFBQyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6Qyw2QkFBYSxHQUFHLE9BQU8sQ0FBQztBQUN4Qiw0QkFBWSxHQUFHLE9BQU8sQ0FBQzthQUMxQjs7QUFFRCx1QkFBVyxFQUFFLENBQUM7O0FBRWQsZ0JBQUksWUFBWSxLQUFLLE9BQU8sRUFBRTtBQUMxQixpQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUcvRCxpQkFBQyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdELG9CQUFJLElBQUksR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQzs7O0FBR3hFLGlCQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7O0FBR25ELG9CQUFJLFlBQVksS0FBSyxPQUFPLEVBQUU7QUFDMUIscUJBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDO2lCQUMzRixNQUFNO0FBQ0gscUJBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDbkQ7YUFDSjs7QUFFRCxnQkFBSSxrQkFBa0IsSUFBSSxZQUFZLEVBQUU7O0FBRXBDLHdCQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUNoQztBQUNELDhCQUFrQixHQUFHLFlBQVksQ0FBQzs7O0FBR2xDLGdCQUFJLFlBQVksS0FBSyxPQUFPLEVBQUU7QUFDMUIsaUJBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDdEUsaUJBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQzthQUNuRixNQUFNO0FBQ0gsaUJBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekUsaUJBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQzthQUNuRjs7O0FBR0QsZ0JBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDL0Usb0JBQUksYUFBYSxLQUFLLE9BQU8sRUFBRTtBQUMzQixxQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN2RSxxQkFBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDM0QscUJBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ2hFLDBCQUFNLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztpQkFDeEMsTUFBTTtBQUNILHFCQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzFFLHFCQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUM3RCxxQkFBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDOUQscUJBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ3JFO2FBQ0o7OztBQUdELGdCQUFJLHNCQUFzQixLQUFLLE1BQU0sRUFBRTtBQUNuQyxpQkFBQyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQ3hFLE1BQU07QUFDSCxpQkFBQyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQzNFOzs7QUFHRCxnQkFBSSxZQUFZLEtBQUssT0FBTyxFQUFFO0FBQzFCLGlCQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2FBQ3pFLE1BQU07QUFDSCxpQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQzthQUM1RTs7O0FBR0QsZ0JBQUksa0JBQWtCLEtBQUssU0FBUyxFQUFFO0FBQ2xDLGlCQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsQ0FBQzthQUNqRSxNQUFNO0FBQ0gsaUJBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2FBQ3BFOzs7QUFHRCxnQkFBSSxpQkFBaUIsS0FBSyxPQUFPLEVBQUU7QUFDL0Isb0JBQUksYUFBYSxJQUFJLE9BQU8sRUFBRTtBQUMxQixxQkFBQyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsRCx5QkFBSyxDQUFDLG9HQUFvRyxDQUFDLENBQUM7aUJBQy9HLE1BQU07QUFDSCxxQkFBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7aUJBQ3ZFO2FBQ0osTUFBTTtBQUNILGlCQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxXQUFXLENBQUMsaUNBQWlDLENBQUMsQ0FBQzthQUMxRTs7O0FBR0QsZ0JBQUksUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFO0FBQ2xCLG9CQUFJLGdCQUFnQixLQUFLLE1BQU0sRUFBRTtBQUM3QixxQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMxRSxxQkFBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMzQyxpQ0FBUyxFQUFFLE9BQU87cUJBQ3JCLENBQUMsQ0FBQztpQkFDTixNQUFNO0FBQ0gscUJBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDN0UscUJBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDM0MsaUNBQVMsRUFBRSxNQUFNO3FCQUNwQixDQUFDLENBQUM7aUJBQ047YUFDSixNQUFNO0FBQ0gsb0JBQUksZ0JBQWdCLEtBQUssT0FBTyxFQUFFO0FBQzlCLHFCQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzFFLHFCQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzNDLGlDQUFTLEVBQUUsTUFBTTtxQkFDcEIsQ0FBQyxDQUFDO2lCQUNOLE1BQU07QUFDSCxxQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUM3RSxxQkFBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMzQyxpQ0FBUyxFQUFFLE9BQU87cUJBQ3JCLENBQUMsQ0FBQztpQkFDTjthQUNKOztBQUVELGtCQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQixrQkFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDN0IsQ0FBQzs7O0FBR0YsWUFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQWEsS0FBSyxFQUFFO0FBQzVCLGdCQUFJLE1BQU0sR0FBSSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSyxHQUFHLE1BQU0sR0FBRyxLQUFLLEFBQUMsQ0FBQztBQUN6RCxhQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxTQUFTLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQzNGLENBQUM7O0FBR0YsU0FBQyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBQzdDLGdCQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEIsYUFBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsYUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFM0IsZ0JBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtBQUNsQixpQkFBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2FBQzNGLE1BQU07QUFDSCxpQkFBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsV0FBVyxDQUFDLDZCQUE2QixDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzNGO1NBQ0osQ0FBQyxDQUFDOzs7O0FBSUgsWUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNoRSxhQUFDLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzNDOztBQUVELFlBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsRUFBRTtBQUN4RSxhQUFDLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVDOztBQUVELFlBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBRTtBQUN2RSxhQUFDLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hEOztBQUVELFlBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBRTtBQUN2RSxhQUFDLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hEOztBQUVELFlBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsRUFBRTtBQUMzRSxhQUFDLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hEOztBQUVELFlBQUksQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLEVBQUU7QUFDN0QsYUFBQyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNsRDs7QUFFRCxZQUFJLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFO0FBQ3JFLGFBQUMsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakQ7O0FBRUQsWUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xELFlBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN6RCxZQUFJLFlBQVksR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekQsWUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDN0QsWUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDakUsWUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRW5FLFNBQUMsQ0FBQyxxTEFBcUwsRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDck4sQ0FBQzs7O0FBR0YsUUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFZLEtBQUssRUFBRTtBQUNoQyxZQUFJLElBQUksR0FBSSxLQUFLLEtBQUssU0FBUyxHQUFHLG9CQUFvQixHQUFHLFlBQVksQUFBQyxDQUFDO0FBQ3ZFLFlBQUksR0FBSSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLEFBQUMsQ0FBQzs7QUFFakQsU0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUM7O0FBRWpGLFlBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUNWLGFBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDMUM7S0FDSixDQUFDOztBQUVGLFdBQU87OztBQUdILFlBQUksRUFBRSxnQkFBVzs7QUFFYix1QkFBVyxFQUFFLENBQUM7OztBQUdkLGFBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFXO0FBQ3BELDZCQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDakMsQ0FBQyxDQUFDOzs7QUFHSCxnQkFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDM0QsNkJBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztBQUMvQyxpQkFBQyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO2FBQy9FO1NBQ0o7S0FDSixDQUFDO0NBRUwsQ0FBQSxFQUFHLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7Ozs7O0FDdlJyQixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBOzs7O0FBSXRDLElBQUksTUFBTSxHQUFHLENBQUEsWUFBVzs7QUFFcEIsUUFBSSxhQUFhLEdBQUcsb0JBQW9CLENBQUM7O0FBRXpDLFFBQUksYUFBYSxHQUFHLG9CQUFvQixDQUFDOztBQUV6QyxRQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7OztBQU83RCxRQUFJLDJCQUEyQixHQUFHLFNBQTlCLDJCQUEyQixDQUFZLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDakQsWUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFdEMsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRW5DLFlBQUksSUFBSSxLQUFLLE9BQU8sSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO0FBQ3BDLGNBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDZCxNQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtBQUN6QixnQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVztBQUNoQyxvQkFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFOUMsb0JBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3JFLHNCQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2IsMkJBQU87aUJBQ1Y7YUFDSixDQUFDLENBQUM7U0FDTjs7QUFFRCxZQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDdkIsbUJBQU87U0FDVjs7QUFFRCxZQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssY0FBYyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxFQUFFO0FBQzNGLG1CQUFPO1NBQ1Y7O0FBRUQsWUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUNwRCxZQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7QUFHNUMsWUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0MsWUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUV6QyxZQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDNUQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVU7QUFDaEMsb0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDNUMscUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIscUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3pEO2FBQ0osQ0FBQyxDQUFDO1NBQ04sTUFBTTtBQUNGLGdCQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3Qzs7QUFFRCxVQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZO0FBQzlCLGFBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0IsYUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsZ0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNyRCxpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzthQUNoRTs7QUFFRCxnQkFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUM5QyxpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM1QjtTQUNKLENBQUMsQ0FBQzs7QUFFSCxZQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7QUFDbEIsZ0JBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssR0FBRyxlQUFlLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTs7QUFDckYsaUJBQUMsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2pEO1NBQ0o7S0FDSixDQUFDOzs7QUFHRixRQUFJLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixHQUFjO0FBQy9CLFNBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFTLENBQUMsRUFBRTs7QUFFakQsZ0JBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssSUFBSSxlQUFlLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTs7QUFDckgsdUJBQU87YUFDVjs7QUFFRCxnQkFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUMvQyxvQkFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxHQUFHLGVBQWUsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFOztBQUNyRixxQkFBQyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2pEO0FBQ0QsdUJBQU87YUFDVjs7QUFFRCxnQkFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7QUFDakQsdUJBQU87YUFDVjs7QUFFRCxnQkFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZDLGdCQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsZ0JBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ25DLGdCQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXpCLGdCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFDLGdCQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQ3BELGdCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUU1QyxnQkFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO0FBQ3JCLHNCQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hGLHNCQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2RixzQkFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbEQ7O0FBRUQsZ0JBQUksWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDOztBQUV4QixnQkFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3BCLGlCQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQyxtQkFBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsWUFBVztBQUMvQix3QkFBSSxVQUFVLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEtBQUssS0FBSyxFQUFFO0FBQzFHLDRCQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7QUFDeEUsZ0NBQUksQ0FBQyxVQUFVLENBQUM7QUFDWiwwQ0FBVSxFQUFFLEFBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFFLEdBQUc7NkJBQ25DLENBQUMsQ0FBQzt5QkFDTixNQUFNO0FBQ0gsb0NBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO3lCQUN4QztxQkFDSjtpQkFDSixDQUFDLENBQUM7YUFDTixNQUFNO0FBQ0gsaUJBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLGlCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLG1CQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxZQUFXO0FBQ2pDLHdCQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDMUcsNEJBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsRUFBRTtBQUN4RSxnQ0FBSSxDQUFDLFVBQVUsQ0FBQztBQUNaLDBDQUFVLEVBQUUsQUFBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUUsR0FBRzs2QkFDbkMsQ0FBQyxDQUFDO3lCQUNOLE1BQU07QUFDSCxvQ0FBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7eUJBQ3hDO3FCQUNKO2lCQUNKLENBQUMsQ0FBQzthQUNOOztBQUVELGFBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN0QixDQUFDLENBQUM7OztBQUdILFNBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQzFELGFBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixvQkFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVyQixnQkFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixnQkFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUMsZ0JBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNyQyxnQkFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7O0FBRTVELHlCQUFhLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxRCx5QkFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXpELGFBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDbEMsaUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0IsaUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDdkQsQ0FBQyxDQUFDO0FBQ0gsYUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXpDLGdCQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEdBQUcsZUFBZSxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7O0FBQ3JGLGlCQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNqRDs7QUFFRCxvQkFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0FBRTVCLGdCQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWxCLGFBQUMsQ0FBQyxJQUFJLENBQUM7QUFDSCxvQkFBSSxFQUFFLEtBQUs7QUFDWCxxQkFBSyxFQUFFLEtBQUs7QUFDWixtQkFBRyxFQUFFLEdBQUc7QUFDUix3QkFBUSxFQUFFLE1BQU07QUFDaEIsdUJBQU8sRUFBRSxpQkFBUyxHQUFHLEVBQUU7O0FBRW5CLHdCQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ3JDLHlCQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDakQ7O0FBRUQsNEJBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMzQixtQ0FBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQiwwQkFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDMUIsNEJBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDdkI7QUFDRCxxQkFBSyxFQUFFLGVBQVMsR0FBRyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUU7QUFDM0MsNEJBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMzQixtQ0FBZSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2lCQUMxRTthQUNKLENBQUMsQ0FBQztTQUNOLENBQUMsQ0FBQzs7O0FBR0gsU0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQ25ELGFBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixvQkFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVyQixnQkFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixnQkFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JDLGdCQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQzs7QUFFNUQsb0JBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztBQUU1QixnQkFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxHQUFHLGVBQWUsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFOztBQUNyRixpQkFBQyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDakQ7O0FBRUQsYUFBQyxDQUFDLElBQUksQ0FBQztBQUNILG9CQUFJLEVBQUUsS0FBSztBQUNYLHFCQUFLLEVBQUUsS0FBSztBQUNaLG1CQUFHLEVBQUUsR0FBRztBQUNSLHdCQUFRLEVBQUUsTUFBTTtBQUNoQix1QkFBTyxFQUFFLGlCQUFTLEdBQUcsRUFBRTtBQUNuQiw0QkFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzNCLG1DQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLDBCQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQiw0QkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUN2QjtBQUNELHFCQUFLLEVBQUUsZUFBUyxHQUFHLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRTtBQUMzQyxtQ0FBZSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0FBQ3ZFLDRCQUFRLENBQUMsZUFBZSxFQUFFLENBQUM7aUJBQzlCO2FBQ0osQ0FBQyxDQUFDO1NBQ04sQ0FBQyxDQUFDOzs7QUFHSCxTQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSwrQ0FBK0MsRUFBRSxZQUFVO0FBQy9FLG9CQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDeEIsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSxvQ0FBb0MsR0FBRyxTQUF2QyxvQ0FBb0MsR0FBYztBQUNsRCxZQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDekYsWUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0FBQ3ZFLHlCQUFhLEdBQUcsYUFBYSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuRTs7QUFFRCxlQUFPLGFBQWEsQ0FBQztLQUN4QixDQUFDOzs7QUFHRixRQUFJLGtCQUFrQixHQUFHLFNBQXJCLGtCQUFrQixHQUFjO0FBQ2hDLFlBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUVuQyxnQkFBUSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVqQyxZQUFJLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtBQUN2QyxtQkFBTztTQUNWOztBQUVELFlBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssSUFBSSxlQUFlLEVBQUU7QUFDakQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLG9DQUFvQyxFQUFFLENBQUMsQ0FBQztBQUNqRSxvQkFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQztLQUNKLENBQUM7OztBQUdGLFFBQUksNkJBQTZCLEdBQUcsU0FBaEMsNkJBQTZCLEdBQWU7QUFDNUMsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUNuRCxZQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsRUFBRTtBQUNyQyxhQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZO0FBQzVDLG9CQUFJLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsRUFBRTtBQUN0QyxxQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO2lCQUM5RTthQUNKLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVk7QUFDNUIsb0JBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO0FBQ3RDLHFCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLENBQUM7aUJBQzNFO2FBQ0osQ0FBQyxDQUFDO1NBQ047S0FDSixDQUFDOzs7QUFHRixRQUFJLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixHQUFjO0FBQ2xDLFlBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7OztBQUduRCxTQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDaEYsZ0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNqQyxnQkFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUMsYUFBQyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsZ0JBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO0FBQ3RDLG9CQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDeEMsMkJBQVcsQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUNwRCxvQkFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ1YscUJBQUMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQ25DO2FBQ0osTUFBTTtBQUNILG9CQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDckMsMkJBQVcsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUNqRCxvQkFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7QUFDckMsK0JBQVcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ3JDO0FBQ0Qsb0JBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUNWLHFCQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUNuQzthQUNKOztBQUVELGFBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDL0IsQ0FBQyxDQUFDOztBQUVILHFDQUE2QixFQUFFLENBQUM7OztBQUdoQyxTQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUNsRSxhQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsYUFBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVDLENBQUMsQ0FBQzs7O0FBR0gsU0FBQyxDQUFDLCtCQUErQixDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUNoRixnQkFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsRUFBRTtBQUNmLGlCQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM5Qix1QkFBTyxLQUFLLENBQUM7YUFDaEI7U0FDSixDQUFDLENBQUM7OztBQUdILFNBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDakQsYUFBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEVBQUU7QUFDekUsb0JBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUNqRCx3QkFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDdkMseUJBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO3FCQUMvQztBQUNELHFCQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3pDLE1BQU07QUFDSCxxQkFBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2pDO2FBQ0osTUFBTTtBQUNILGlCQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNqQztTQUNKLENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDbkMsYUFBQyxDQUFDLDhCQUE4QixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQUMsRUFBRTtBQUN0RCxpQkFBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxhQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBVztBQUMzRCxvQkFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDdkMscUJBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDNUM7YUFDSixDQUFDLENBQUM7U0FDTjtLQUNKLENBQUM7OztBQUdGLFFBQUksWUFBWSxHQUFHLFNBQWYsWUFBWSxHQUFjOztBQUUxQixTQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDdEQsYUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QixhQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUV0QyxhQUFDLENBQUMseUNBQXlDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQ2hFLGlCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMxQixDQUFDLENBQUM7U0FDTixDQUFDLENBQUM7OztBQUdILFNBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLHNDQUFzQyxFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQ2pGLGdCQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxFQUFFO0FBQ2YsaUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDekMsdUJBQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0osQ0FBQyxDQUFDOzs7QUFHSCxTQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSwyQkFBMkIsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUN2RSxhQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsYUFBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3BCLGFBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDNUMsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLEdBQWM7QUFDekIsWUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLFlBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQzs7QUFFbkIsWUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFOztBQUNoRCxhQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQzFELG9CQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxNQUFNLEVBQUU7QUFDOUIscUJBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDeEMsTUFBTTtBQUNILHFCQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3pDO2FBQ0osQ0FBQyxDQUFDO1NBQ04sTUFBTTs7QUFDSCxhQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVc7QUFDeEIsb0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxHQUFHLE1BQU0sRUFBRTtBQUM5QixxQkFBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUN4QyxNQUFNO0FBQ0gscUJBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDekM7YUFDSixDQUFDLENBQUM7U0FDTjs7QUFFRCxTQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBUyxDQUFDLEVBQUU7QUFDbEMsYUFBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLGFBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDcEIseUJBQVMsRUFBRSxDQUFDO2FBQ2YsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNiLG1CQUFPLEtBQUssQ0FBQztTQUNoQixDQUFDLENBQUM7S0FDTixDQUFDOzs7QUFHRixXQUFPOzs7OztBQUtILGtCQUFVLEVBQUUsc0JBQVc7QUFDbkIsd0JBQVksRUFBRSxDQUFDO1NBQ2xCOztBQUVELGdDQUF3QixFQUFFLGtDQUFTLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDekMsdUNBQTJCLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDOztBQUVELG1CQUFXLEVBQUUsdUJBQVc7O0FBRXBCLDhCQUFrQixFQUFFLENBQUM7QUFDckIsNkJBQWlCLEVBQUUsQ0FBQztBQUNwQixnQ0FBb0IsRUFBRSxDQUFDOztBQUV2QixnQkFBSSxRQUFRLENBQUMsY0FBYyxFQUFFLEVBQUU7QUFDM0IsMkNBQTJCLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDeEM7O0FBRUQsb0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQ2pEOztBQUVELG1CQUFXLEVBQUUsdUJBQVc7QUFDcEIsbUJBQU87U0FDVjs7QUFFRCxrQkFBVSxFQUFFLHNCQUFXO0FBQ25CLHVCQUFXLEVBQUUsQ0FBQztTQUNqQjs7QUFFRCxZQUFJLEVBQUUsZ0JBQVk7QUFDZCxnQkFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLGdCQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixnQkFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3JCOzs7QUFHRCx3QkFBZ0IsRUFBRSw0QkFBVztBQUN6QixtQkFBTztTQUNWOztBQUVELG1DQUEyQixFQUFFLHVDQUFXO0FBQ3BDLHlDQUE2QixFQUFFLENBQUM7U0FDbkM7O0FBRUQsd0JBQWdCLEVBQUUsNEJBQVc7QUFDekIsOEJBQWtCLEVBQUUsQ0FBQztTQUN4Qjs7QUFFRCx3QkFBZ0IsRUFBRSw0QkFBVztBQUN6QixtQkFBTyxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsYUFBYSxDQUFDO1NBQ25EOztBQUVELHdCQUFnQixFQUFFLDRCQUFXO0FBQ3pCLG1CQUFPLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxhQUFhLENBQUM7U0FDbkQ7S0FDSixDQUFDO0NBRUwsQ0FBQSxFQUFHLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Ozs7O0FDdGV4QixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7Ozs7O0FBSzNCLElBQUksUUFBUSxHQUFHLENBQUEsWUFBVzs7O0FBR3RCLFFBQUksTUFBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixRQUFJLE1BQUssR0FBRyxLQUFLLENBQUM7QUFDbEIsUUFBSSxNQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLFFBQUksTUFBTSxHQUFHLEtBQUssQ0FBQzs7QUFFbkIsUUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUV4QixRQUFJLFVBQVUsR0FBRyxlQUFlLENBQUM7O0FBRWpDLFFBQUksYUFBYSxHQUFHLGFBQWEsQ0FBQzs7QUFFbEMsUUFBSSxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQzs7QUFFMUMsUUFBSSxhQUFhLEdBQUcsYUFBYSxDQUFDOzs7O0FBSWxDLFFBQUksV0FBVyxHQUFHO0FBQ2QsY0FBTSxFQUFFLFNBQVM7QUFDakIsYUFBSyxFQUFFLFNBQVM7QUFDaEIsZUFBTyxFQUFFLFNBQVM7QUFDbEIsZ0JBQVEsRUFBRSxTQUFTO0FBQ25CLGNBQU0sRUFBRSxTQUFTO0FBQ2pCLGdCQUFRLEVBQUUsU0FBUztLQUN0QixDQUFDOzs7QUFHRixRQUFJLFVBQVUsR0FBRyxTQUFiLFVBQVUsR0FBYzs7QUFFeEIsWUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDcEUsa0JBQUssR0FBRyxJQUFJLENBQUM7U0FDaEI7O0FBRUQsY0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRCxjQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELGNBQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRWxELFlBQUksTUFBTSxFQUFFO0FBQ1IsYUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5Qjs7QUFFRCxZQUFJLE1BQU0sSUFBSSxNQUFLLElBQUksTUFBSyxFQUFFO0FBQzFCLGFBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7S0FDSixDQUFDOzs7QUFHRixRQUFJLGtCQUFrQixHQUFHLFNBQXJCLGtCQUFrQixHQUFjOztBQUVoQyxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1QyxnQkFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLGdCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjtLQUNKLENBQUM7OztBQUdGLFFBQUksY0FBYyxHQUFHLFNBQWpCLGNBQWMsR0FBYztBQUM1QixZQUFJLE1BQU0sQ0FBQztBQUNYLFlBQUksTUFBSyxFQUFFO0FBQ1AsZ0JBQUksVUFBVSxDQUFDO0FBQ2YsYUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFXO0FBQ3hCLG9CQUFJLFVBQVUsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRTtBQUNyRCwyQkFBTztpQkFDVjtBQUNELG9CQUFJLE1BQU0sRUFBRTtBQUNSLGdDQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3hCO0FBQ0Qsc0JBQU0sR0FBRyxVQUFVLENBQUMsWUFBVztBQUMzQixzQ0FBa0IsRUFBRSxDQUFDO2lCQUN4QixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1AsMEJBQVUsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQzthQUN0RCxDQUFDLENBQUM7U0FDTixNQUFNO0FBQ0gsaUJBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBVztBQUN4Qix3QkFBSSxNQUFNLEVBQUU7QUFDUixvQ0FBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN4QjtBQUNELDBCQUFNLEdBQUcsVUFBVSxDQUFDLFlBQVc7QUFDM0IsMENBQWtCLEVBQUUsQ0FBQztxQkFDeEIsRUFBRSxFQUFFLENBQUMsQ0FBQztpQkFDVixDQUFDLENBQUM7YUFDTjtLQUNKLENBQUM7OztBQUdGLFFBQUksa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLEdBQWM7O0FBRWhDLFNBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSwrQ0FBK0MsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUM3RyxhQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsZ0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTFDLGdCQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLEVBQUU7QUFDN0UsaUJBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUM7YUFDbEY7O0FBRUQsbUJBQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUQsbUJBQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckUsbUJBQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckUsbUJBQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckUsbUJBQU8sQ0FBQyxJQUFJLENBQUMsbUZBQW1GLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXJILG1CQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDcEIsQ0FBQyxDQUFDOzs7QUFHSCxTQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsdUNBQXVDLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDckcsYUFBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLGdCQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFDLGdCQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsRUFBRTtBQUN4QyxpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQix1QkFBTyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzFDLGlCQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQy9FLHVCQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDM0QsTUFBTTtBQUNILG9CQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxHQUN0QyxPQUFPLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsV0FBVyxFQUFFLEdBQ2hELFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUM5RCxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDOztBQUV0RSxpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2Qix1QkFBTyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3ZDLGlCQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzVFLHVCQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDM0Q7U0FDSixDQUFDLENBQUM7O0FBRUgsU0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLCtDQUErQyxFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQzdHLGFBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNuQixnQkFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDL0QsZ0JBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsZ0JBQUksTUFBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUMvQyxnQkFBSSxHQUFHLEVBQUU7QUFDTCx3QkFBUSxDQUFDLE9BQU8sQ0FBQztBQUNiLDBCQUFNLEVBQUUsRUFBRTtBQUNWLDJCQUFPLEVBQUUsSUFBSTtBQUNiLGdDQUFZLEVBQUUsTUFBTTtpQkFDdkIsQ0FBQyxDQUFDO0FBQ0gsaUJBQUMsQ0FBQyxJQUFJLENBQUM7QUFDSCx3QkFBSSxFQUFFLEtBQUs7QUFDWCx5QkFBSyxFQUFFLEtBQUs7QUFDWix1QkFBRyxFQUFFLEdBQUc7QUFDUiw0QkFBUSxFQUFFLE1BQU07QUFDaEIsMkJBQU8sRUFBRSxpQkFBUyxHQUFHLEVBQUU7QUFDbkIsZ0NBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkIsMEJBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2hCO0FBQ0QseUJBQUssRUFBRSxlQUFTLEdBQUcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFO0FBQzNDLGdDQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLDRCQUFJLEdBQUcsR0FBRyw2RUFBNkUsQ0FBQztBQUN4Riw0QkFBSSxNQUFLLElBQUksUUFBUSxJQUFJLE1BQU0sRUFBRTtBQUM3QixrQ0FBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDckIsTUFBTSxJQUFJLE1BQUssSUFBSSxVQUFVLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUMxQyw2QkFBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUIsNkJBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQ1oscUNBQUssRUFBRSxNQUFNO0FBQ2Isb0NBQUksRUFBRSxJQUFJOzZCQUNiLENBQUMsQ0FBQzt5QkFDTixNQUFNO0FBQ0gsaUNBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDZDtxQkFDSjtpQkFDSixDQUFDLENBQUM7YUFDTixNQUFNOztBQUVILHdCQUFRLENBQUMsT0FBTyxDQUFDO0FBQ2IsMEJBQU0sRUFBRSxFQUFFO0FBQ1YsMkJBQU8sRUFBRSxJQUFJO0FBQ2IsZ0NBQVksRUFBRSxNQUFNO2lCQUN2QixDQUFDLENBQUM7QUFDSCxzQkFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFXO0FBQ3pCLDRCQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUMxQixFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ1o7U0FDSixDQUFDLENBQUM7OztBQUdILFNBQUMsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVoRSxTQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsNEZBQTRGLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDMUosYUFBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLGdCQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMvRCxnQkFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQzlCLGlCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuRCxrQkFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQixNQUFNO0FBQ0gsaUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25ELGtCQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JCO1NBQ0osQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFjO0FBQzNCLFlBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7QUFDZCxtQkFBTztTQUNWO0FBQ0QsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLDBLQUEwSyxDQUFDLENBQUM7QUFDekwsWUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQ2pCLGdCQUFJLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDakIsb0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDMUMscUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNmLHFCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ3JCO2FBQ0osQ0FBQyxDQUFDO1NBQ047S0FDSixDQUFDOzs7QUFHRixRQUFJLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixHQUFjOzs7QUFHbEMsU0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLHlDQUF5QyxFQUFFLFlBQVc7QUFDdEcsZ0JBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEIsZ0JBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7O0FBRzlDLGNBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUduQixnQkFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7O0FBRzVCLGNBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUdsQixhQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JELENBQUMsQ0FBQzs7QUFFSCxZQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFOzs7QUFHN0QsZ0JBQUksT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QixhQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUseUNBQXlDLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDdkcsdUJBQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWxCLG9CQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQzdDLDJCQUFPLENBQUMsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7aUJBQzVEOztBQUVELHNCQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFDLHNCQUFNLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRXZDLG9CQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFO0FBQ3BDLHFCQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDMUQsMEJBQU0sQ0FBQyxHQUFHLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO2lCQUNyQzs7QUFFRCxpQkFBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUMsQ0FBQyxDQUFDO0FBQ3ZELGlCQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLENBQUM7O0FBRXZELHNCQUFNLENBQUMsR0FBRyxDQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsR0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVyRSwwQkFBVSxDQUFDLFlBQVc7QUFDbEIsMEJBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDbkIsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNaLENBQUMsQ0FBQztTQUNOOzs7QUFHRCxZQUFJLFdBQVcsR0FBRyxTQUFkLFdBQVcsQ0FBWSxFQUFFLEVBQUU7QUFDM0IsZ0JBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtBQUNoQixrQkFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN6QixNQUFNO0FBQ0gsa0JBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDNUI7U0FDSixDQUFBOztBQUVELFNBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSx1Q0FBdUMsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUN2Ryx1QkFBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3hCLENBQUMsQ0FBQztBQUNILFNBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSx1Q0FBdUMsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUNwRyx1QkFBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3hCLENBQUMsQ0FBQzs7QUFFSCxTQUFDLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVTtBQUN0RCxnQkFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMxQixpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QjtTQUNKLENBQUMsQ0FBQztLQUNOLENBQUE7OztBQUdELFFBQUksWUFBWSxHQUFHLFNBQWYsWUFBWSxHQUFjO0FBQzFCLFlBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7QUFDYixtQkFBTztTQUNWOztBQUVELFNBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVztBQUN6QixnQkFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLHdCQUF3QixDQUFDO0FBQzdHLGdCQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcscUJBQXFCLENBQUM7O0FBRWpHLGdCQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUN6RSxpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNYLGlDQUFhLEVBQUUsYUFBYTtBQUM1Qiw4QkFBVSxFQUFFLFVBQVU7QUFDdEIsMEJBQU0sRUFBRSxzQ0FBc0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztpQkFDOUUsQ0FBQyxDQUFDO2FBQ04sTUFBTTtBQUNILGlCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ1gsaUNBQWEsRUFBRSxhQUFhO0FBQzVCLDhCQUFVLEVBQUUsVUFBVTtpQkFDekIsQ0FBQyxDQUFDO2FBQ047U0FDSixDQUFDLENBQUM7S0FDTixDQUFDOzs7QUFHRixRQUFJLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixHQUFjO0FBQ25DLFlBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUU7QUFDdEIsbUJBQU87U0FDVjtBQUNELFNBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUN2QyxDQUFDOzs7QUFHRixRQUFJLDJCQUEyQixHQUFHLFNBQTlCLDJCQUEyQixHQUFjO0FBQ3pDLFlBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUU7QUFDbkIsbUJBQU87U0FDVjtBQUNELFNBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFVBQVUsRUFBRSx3QkFBd0IsRUFBRSxjQUFjLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQyxDQUFDO0tBQ25MLENBQUE7OztBQUdELFFBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLEdBQWM7QUFDOUIsU0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsdUJBQXVCLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDakcsb0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztLQUNOLENBQUM7OztBQUdGLFFBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxHQUFjOztBQUV4QixZQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDZixnQkFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsYUFBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDdEUsb0JBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsaUJBQUMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3pDLENBQUMsQ0FBQztBQUNILGFBQUMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3pDOztBQUVELFlBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO0FBQ2IsYUFBQyxDQUFDLDJEQUEyRCxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ25FLG9CQUFJLEVBQUUsd0VBQXdFO2FBQ2pGLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQzs7O0FBR0YsUUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLEdBQWM7O0FBRTFCLFNBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFXO0FBQ25FLGdCQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUM5RSxpQkFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNwQyxNQUFNLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ3hDLGlCQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3ZDO1NBQ0osQ0FBQyxDQUFDOzs7QUFHSCxTQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLFlBQVc7QUFDN0UsZ0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUNsQyxpQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQzthQUMzRTtTQUNKLENBQUMsQ0FBQzs7O0FBR0gsU0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxZQUFXO0FBQzdFLGFBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDOUUsQ0FBQyxDQUFDOzs7QUFHSCxTQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwyQkFBMkIsRUFBRSxZQUFZO0FBQ25HLGFBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbEMsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSxjQUFjLEdBQUcsU0FBakIsY0FBYyxHQUFjOztBQUU1QixTQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7OztBQUd6QixTQUFDLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDL0MscUJBQVMsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQztBQUMvQyxpQkFBSyxFQUFFLFlBQVk7U0FDdEIsQ0FBQyxDQUFDO0FBQ0gsU0FBQyxDQUFDLDhDQUE4QyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3RELHFCQUFTLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUM7QUFDL0MsaUJBQUssRUFBRSxRQUFRO1NBQ2xCLENBQUMsQ0FBQztBQUNILFNBQUMsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUN0RCxxQkFBUyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDO0FBQy9DLGlCQUFLLEVBQUUsUUFBUTtTQUNsQixDQUFDLENBQUM7QUFDSCxTQUFDLENBQUMsOENBQThDLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDdEQscUJBQVMsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQztBQUMvQyxpQkFBSyxFQUFFLFVBQVU7U0FDcEIsQ0FBQyxDQUFDO0FBQ0gsU0FBQyxDQUFDLDhGQUE4RixDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3RHLHFCQUFTLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUM7QUFDL0MsaUJBQUssRUFBRSxpQkFBaUI7U0FDM0IsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxHQUFjOzs7O0FBSTdCLFNBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUM1RixhQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDdkIsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7QUFFRixRQUFJLFlBQVksR0FBRyxTQUFmLFlBQVksR0FBYztBQUMxQixTQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDcEYsYUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQyxhQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDLGFBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN0QixDQUFDLENBQUM7O0FBRUgsU0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQ25GLGFBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEMsYUFBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3RCLENBQUMsQ0FBQzs7QUFFSCxTQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDcEYsYUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQyxhQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdEIsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsR0FBYztBQUNqQyxTQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBVztBQUNuRSxhQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDeEIsYUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3pDLENBQUMsQ0FBQztLQUNOLENBQUM7OztBQUdGLFFBQUksc0JBQXNCLEdBQUcsU0FBekIsc0JBQXNCLEdBQWM7QUFDcEMsWUFBSSxPQUFPLFFBQVEsQUFBQyxJQUFJLFVBQVUsRUFBRTtBQUNoQyxvQkFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1NBQzNEO0tBQ0osQ0FBQTs7Ozs7QUFLRCxRQUFJLGdCQUFnQixDQUFDOztBQUVyQixRQUFJLGNBQWMsR0FBRyxTQUFqQixjQUFjLEdBQWM7QUFDNUIsU0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOzs7O0FBSXpCLFNBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsMkJBQTJCLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDcEQsZ0JBQUksZ0JBQWdCLEVBQUU7QUFDbEIsZ0NBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3BDO1NBQ0osQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxHQUFjO0FBQzdCLGdCQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3hDLENBQUM7OztBQUdGLFFBQUksY0FBYyxHQUFHLFNBQWpCLGNBQWMsR0FBYztBQUM1QixZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUNsQixtQkFBTztTQUNWOztBQUVELFlBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQ2xDLGFBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUMzQix5QkFBUyxFQUFFLFVBQVU7QUFDckIsMEJBQVUsRUFBRSxNQUFNO0FBQ2xCLDBCQUFVLEVBQUUsTUFBTTtBQUNsQix3QkFBUSxFQUFFLElBQUk7QUFDZCx1QkFBTyxFQUFFO0FBQ0wseUJBQUssRUFBRTtBQUNILDRCQUFJLEVBQUUsUUFBUTtxQkFDakI7aUJBQ0o7YUFDSixDQUFDLENBQUM7U0FDTjtLQUNKLENBQUM7OztBQUdGLFFBQUksOEJBQThCLEdBQUcsU0FBakMsOEJBQThCLEdBQWM7O0FBRTVDLFlBQUksTUFBSyxJQUFJLE1BQUssRUFBRTs7O0FBRWhCLGFBQUMsQ0FBQyw2RkFBNkYsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQzdHLG9CQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBCLG9CQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUU7QUFDeEQseUJBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDaEU7O0FBRUQscUJBQUssQ0FBQyxLQUFLLENBQUMsWUFBVztBQUNuQix3QkFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUMxQyw2QkFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDakI7aUJBQ0osQ0FBQyxDQUFDOztBQUVILHFCQUFLLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDbEIsd0JBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNoRSw2QkFBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7cUJBQ3hDO2lCQUNKLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQzs7O0FBR0YsUUFBSSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFjO0FBQzNCLFlBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO0FBQ2IsYUFBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNwQiwyQkFBVyxFQUFFLFFBQVE7QUFDckIsMEJBQVUsRUFBRSxJQUFJO2FBQ25CLENBQUMsQ0FBQztTQUNOO0tBQ0osQ0FBQzs7O0FBR0YsUUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLEdBQWM7QUFDM0IsU0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDbkMsZ0JBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQixnQkFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2QyxnQkFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsZ0JBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEMsZ0JBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRW5GLGlCQUFLLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDbEIsb0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxRQUFRLEVBQUU7QUFDekMscUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUM3QixNQUFNO0FBQ0gscUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUNqQzs7QUFFRCxvQkFBSSxPQUFPLEdBQUksSUFBSSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQUFBQyxDQUFDO0FBQzFGLG9CQUFJLE9BQU8sR0FBRyxNQUFNLEVBQUU7QUFDbEIsMEJBQU0sR0FBRyxPQUFPLENBQUM7aUJBQ3BCO2FBQ0osQ0FBQyxDQUFDOztBQUVILGtCQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFekIsaUJBQUssQ0FBQyxJQUFJLENBQUMsWUFBVztBQUNsQixvQkFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFFBQVEsRUFBRTtBQUN6QyxxQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ2pDLE1BQU07QUFDSCxxQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ3JDO2FBQ0osQ0FBQyxDQUFDO1NBQ1AsQ0FBQyxDQUFDO0tBQ0wsQ0FBQTs7OztBQUlELFdBQU87OztBQUdILFlBQUksRUFBRSxnQkFBVzs7OztBQUliLHNCQUFVLEVBQUUsQ0FBQztBQUNiLDBCQUFjLEVBQUUsQ0FBQzs7O0FBR2pCLGdDQUFvQixFQUFFLENBQUM7QUFDdkIseUJBQWEsRUFBRSxDQUFDO0FBQ2hCLHdCQUFZLEVBQUUsQ0FBQztBQUNmLGlDQUFxQixFQUFFLENBQUM7QUFDeEIsMkJBQWUsRUFBRSxDQUFDO0FBQ2xCLDBCQUFjLEVBQUUsQ0FBQztBQUNqQix5QkFBYSxFQUFFLENBQUM7QUFDaEIsOEJBQWtCLEVBQUUsQ0FBQztBQUNyQix3QkFBWSxFQUFFLENBQUM7QUFDZiwyQkFBZSxFQUFFLENBQUM7QUFDbEIsc0JBQVUsRUFBRSxDQUFDO0FBQ2IsMEJBQWMsRUFBRSxDQUFDO0FBQ2pCLDBCQUFjLEVBQUUsQ0FBQztBQUNqQiw0QkFBZ0IsRUFBRSxDQUFDO0FBQ25CLHdCQUFZLEVBQUUsQ0FBQztBQUNmLHVDQUEyQixFQUFFLENBQUM7QUFDOUIsa0NBQXNCLEVBQUUsQ0FBQzs7O0FBR3pCLHdCQUFZLEVBQUUsQ0FBQztBQUNmLGdCQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUdwQywwQ0FBOEIsRUFBRSxDQUFDO1NBQ3BDOzs7QUFHRCxnQkFBUSxFQUFFLG9CQUFXO0FBQ2pCLHlCQUFhLEVBQUUsQ0FBQztBQUNoQix3QkFBWSxFQUFFLENBQUM7QUFDZixpQ0FBcUIsRUFBRSxDQUFDO0FBQ3hCLCtCQUFtQixFQUFFLENBQUM7QUFDdEIsMkJBQWUsRUFBRSxDQUFDO0FBQ2xCLHlCQUFhLEVBQUUsQ0FBQztBQUNoQiwwQkFBYyxFQUFFLENBQUM7QUFDakIsMkJBQWUsRUFBRSxDQUFDO0FBQ2xCLDBCQUFjLEVBQUUsQ0FBQztBQUNqQiwwQkFBYyxFQUFFLENBQUM7QUFDakIsNEJBQWdCLEVBQUUsQ0FBQztBQUNuQix1Q0FBMkIsRUFBRSxDQUFDO1NBQ2pDOzs7QUFHRCxzQkFBYyxFQUFFLDBCQUFXO0FBQ3ZCLGdCQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDbkI7OztBQUdELDJCQUFtQixFQUFFLDZCQUFTLEVBQUUsRUFBRTtBQUM5Qiw0QkFBZ0IsR0FBRyxFQUFFLENBQUM7U0FDekI7OztBQUdELHdCQUFnQixFQUFFLDBCQUFTLElBQUksRUFBRTtBQUM3QiwwQkFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3Qjs7O0FBR0QseUJBQWlCLEVBQUUsNkJBQVc7QUFDMUIsOEJBQWtCLEVBQUUsQ0FBQztTQUN4Qjs7O0FBR0QsZ0JBQVEsRUFBRSxrQkFBUyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQzVCLGdCQUFJLEdBQUcsR0FBRyxBQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUV0RCxnQkFBSSxFQUFFLEVBQUU7QUFDSixvQkFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0FBQ3ZFLHVCQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDMUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUU7QUFDbEYsdUJBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQzlDLE1BQU0sSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO0FBQ25GLHVCQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMvQztBQUNELG1CQUFHLEdBQUcsR0FBRyxJQUFJLE9BQU8sR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFBLEFBQUMsQ0FBQzthQUN0RDs7QUFFRCxhQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ25CLHlCQUFTLEVBQUUsR0FBRzthQUNqQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ2Q7O0FBRUQsc0JBQWMsRUFBRSx3QkFBUyxFQUFFLEVBQUU7QUFDekIsYUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQ2xCLG9CQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRTtBQUNsQywyQkFBTztpQkFDVjs7QUFFRCxvQkFBSSxNQUFNLENBQUM7O0FBRVgsb0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUM3QiwwQkFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ3hDLE1BQU07QUFDSCwwQkFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ2xDOztBQUVELGlCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDO0FBQ2YsbUNBQWUsRUFBRSxJQUFJO0FBQ3JCLHdCQUFJLEVBQUUsS0FBSztBQUNYLHlCQUFLLEVBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxNQUFNLEFBQUM7QUFDdkYsZ0NBQVksRUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLGVBQWUsQUFBQztBQUN6Ryw2QkFBUyxFQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsU0FBUyxBQUFDO0FBQzFGLDRCQUFRLEVBQUUsTUFBSyxHQUFHLE1BQU0sR0FBRyxPQUFPO0FBQ2xDLDBCQUFNLEVBQUUsTUFBTTtBQUNkLGlDQUFhLEVBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxBQUFDO0FBQzFFLCtCQUFXLEVBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxBQUFDO0FBQ3RFLGtDQUFjLEVBQUUsSUFBSTtpQkFDdkIsQ0FBQyxDQUFDOztBQUVILGlCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3pDLENBQUMsQ0FBQztTQUNOOztBQUVELHlCQUFpQixFQUFFLDJCQUFTLEVBQUUsRUFBRTtBQUM1QixhQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDbEIsb0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsRUFBRTs7QUFDMUMscUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN2QyxxQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFNUIsd0JBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7O0FBR2xCLHdCQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRTtBQUNuQyxnQ0FBUSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3FCQUNyRTtBQUNELHdCQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRTtBQUNwQyxnQ0FBUSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO3FCQUN2RTtBQUNELHdCQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRTtBQUNqQyxnQ0FBUSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO3FCQUNqRTtBQUNELHdCQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBRTtBQUNyQyxnQ0FBUSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO3FCQUN6RTtBQUNELHdCQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRTtBQUNuQyxnQ0FBUSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3FCQUNyRTs7QUFFRCxxQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUNmLG9DQUFZLEVBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxlQUFlLEFBQUM7QUFDekcsK0JBQU8sRUFBRSxJQUFJO3FCQUNoQixDQUFDLENBQUM7O0FBRUgsd0JBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7O0FBR2xCLHFCQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDbEMsMkJBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUN4QixDQUFDLENBQUM7aUJBRU47YUFDSixDQUFDLENBQUM7U0FDTjs7O0FBR0QsaUJBQVMsRUFBRSxxQkFBVztBQUNsQixvQkFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZCOzs7QUFHRCxlQUFPLEVBQUUsaUJBQVMsT0FBTyxFQUFFO0FBQ3ZCLG1CQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLGdCQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxnQkFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ2pCLG9CQUFJLEdBQUcsOEJBQThCLElBQUksT0FBTyxDQUFDLEtBQUssR0FBRyx1QkFBdUIsR0FBRyxFQUFFLENBQUEsQUFBQyxHQUFHLElBQUksR0FBRyx3SEFBd0gsR0FBRyxRQUFRLENBQUM7YUFDdk8sTUFBTSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDekIsb0JBQUksR0FBRyw4QkFBOEIsSUFBSSxPQUFPLENBQUMsS0FBSyxHQUFHLHVCQUF1QixHQUFHLEVBQUUsQ0FBQSxBQUFDLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLDJDQUEyQyxDQUFDO2FBQ25MLE1BQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ3pCLG9CQUFJLEdBQUcsOEJBQThCLElBQUksT0FBTyxDQUFDLEtBQUssR0FBRyx1QkFBdUIsR0FBRyxFQUFFLENBQUEsQUFBQyxHQUFHLHNCQUFzQixJQUFJLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUEsQUFBQyxHQUFHLGVBQWUsQ0FBQzthQUMxTCxNQUFNO0FBQ0gsb0JBQUksR0FBRyw4QkFBOEIsSUFBSSxPQUFPLENBQUMsS0FBSyxHQUFHLHVCQUF1QixHQUFHLEVBQUUsQ0FBQSxBQUFDLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLHVEQUF1RCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUEsQUFBQyxHQUFHLGVBQWUsQ0FBQzthQUN0UTs7QUFFRCxnQkFBSSxPQUFPLENBQUMsTUFBTSxFQUFFOztBQUNoQixvQkFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixvQkFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxBQUFDLEVBQUU7QUFDckMsMkJBQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUMxQjtBQUNELGtCQUFFLENBQUMsS0FBSyxDQUFDO0FBQ0wsMkJBQU8sRUFBRSxJQUFJO0FBQ2IseUJBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSTtBQUM3QywyQkFBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEtBQUssU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSztBQUNoRSx1QkFBRyxFQUFFO0FBQ0QsMkJBQUcsRUFBRSxLQUFLO0FBQ1YsOEJBQU0sRUFBRSxHQUFHO0FBQ1gsK0JBQU8sRUFBRSxHQUFHO0FBQ1osdUNBQWUsRUFBRSxNQUFNO3FCQUMxQjtBQUNELDhCQUFVLEVBQUU7QUFDUix1Q0FBZSxFQUFFLE9BQU8sQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksR0FBRyxNQUFNO0FBQ3JFLCtCQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBRztBQUNuQyw4QkFBTSxFQUFFLE1BQU07cUJBQ2pCO2lCQUNKLENBQUMsQ0FBQzthQUNOLE1BQU07O0FBQ0gsaUJBQUMsQ0FBQyxPQUFPLENBQUM7QUFDTiwyQkFBTyxFQUFFLElBQUk7QUFDYix5QkFBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJO0FBQzdDLHVCQUFHLEVBQUU7QUFDRCw4QkFBTSxFQUFFLEdBQUc7QUFDWCwrQkFBTyxFQUFFLEdBQUc7QUFDWix1Q0FBZSxFQUFFLE1BQU07cUJBQzFCO0FBQ0QsOEJBQVUsRUFBRTtBQUNSLHVDQUFlLEVBQUUsT0FBTyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxHQUFHLE1BQU07QUFDckUsK0JBQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxHQUFHO0FBQ25DLDhCQUFNLEVBQUUsTUFBTTtxQkFDakI7aUJBQ0osQ0FBQyxDQUFDO2FBQ047U0FDSjs7O0FBR0QsaUJBQVMsRUFBRSxtQkFBUyxNQUFNLEVBQUU7QUFDeEIsZ0JBQUksTUFBTSxFQUFFO0FBQ1IsaUJBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDZCw2QkFBUyxFQUFFLHFCQUFXO0FBQ2xCLHlCQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM5Qix5QkFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQzdCO2lCQUNKLENBQUMsQ0FBQzthQUNOLE1BQU07QUFDSCxpQkFBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ2pCO1NBQ0o7O0FBRUQsd0JBQWdCLEVBQUUsMEJBQVMsT0FBTyxFQUFFO0FBQ2hDLGdCQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQzVCLGlCQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQyxpQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsdUhBQXVILENBQUMsQ0FBQzthQUMzSyxNQUFNO0FBQ0gsaUJBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM1QixpQkFBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsc0NBQXNDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsK0NBQStDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUEsQUFBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDO2FBQ3hQO1NBQ0o7O0FBRUQsdUJBQWUsRUFBRSwyQkFBVztBQUN4QixhQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNsRDs7QUFFRCxhQUFLLEVBQUUsZUFBUyxPQUFPLEVBQUU7O0FBRXJCLG1CQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDckIseUJBQVMsRUFBRSxFQUFFO0FBQ2IscUJBQUssRUFBRSxRQUFRO0FBQ2Ysb0JBQUksRUFBRSxTQUFTO0FBQ2YsdUJBQU8sRUFBRSxFQUFFO0FBQ1gscUJBQUssRUFBRSxJQUFJO0FBQ1gscUJBQUssRUFBRSxJQUFJO0FBQ1gscUJBQUssRUFBRSxJQUFJO0FBQ1gsOEJBQWMsRUFBRSxDQUFDO0FBQ2pCLG9CQUFJLEVBQUUsRUFBRTthQUNYLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosZ0JBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFaEQsZ0JBQUksSUFBSSxHQUFHLFdBQVcsR0FBRyxFQUFFLEdBQUcsdUNBQXVDLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxZQUFZLElBQUksT0FBTyxDQUFDLEtBQUssR0FBRyx1RkFBdUYsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssRUFBRSxHQUFHLHdCQUF3QixHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsVUFBVSxHQUFHLEVBQUUsQ0FBQSxBQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7O0FBRXRVLGdCQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDZixpQkFBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbEM7O0FBRUQsZ0JBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO0FBQ3BCLG9CQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLEVBQUU7QUFDN0UscUJBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hDLE1BQU07QUFDSCx3QkFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLHlCQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUM5QixNQUFNO0FBQ0gseUJBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDckM7aUJBQ0o7YUFDSixNQUFNO0FBQ0gsb0JBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxRQUFRLEVBQUU7QUFDM0IscUJBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNyQyxNQUFNO0FBQ0gscUJBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN0QzthQUNKOztBQUVELGdCQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDZix3QkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbEM7O0FBRUQsZ0JBQUksT0FBTyxDQUFDLGNBQWMsR0FBRyxDQUFDLEVBQUU7QUFDNUIsMEJBQVUsQ0FBQyxZQUFXO0FBQ2xCLHFCQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUN4QixFQUFFLE9BQU8sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDckM7O0FBRUQsbUJBQU8sRUFBRSxDQUFDO1NBQ2I7OztBQUdELG1CQUFXLEVBQUUscUJBQVMsR0FBRyxFQUFFO0FBQ3ZCLGdCQUFJLEdBQUcsRUFBRTtBQUNMLGlCQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDbkIsd0JBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDMUMseUJBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNmLHlCQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQ3JCO2lCQUNKLENBQUMsQ0FBQzthQUNOLE1BQU07QUFDSCw2QkFBYSxFQUFFLENBQUM7YUFDbkI7U0FDSjs7O0FBR0QscUJBQWEsRUFBRSx1QkFBUyxHQUFHLEVBQUU7QUFDekIsYUFBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7OztBQUdELG9CQUFZLEVBQUUsd0JBQVc7QUFDckIsMEJBQWMsRUFBRSxDQUFDO1NBQ3BCOzs7QUFHRCxvQkFBWSxFQUFFLHNCQUFTLEVBQUUsRUFBRTtBQUN2QixjQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsZ0JBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDckMsdUJBQU8sRUFBRSxDQUFDO2FBQ2I7QUFDRCxtQkFBTyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDbkI7OztBQUdELHVCQUFlLEVBQUUseUJBQVMsU0FBUyxFQUFFO0FBQ2pDLGdCQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxDQUFDO2dCQUFFLEdBQUc7Z0JBQUUsTUFBTSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTdDLGlCQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEMsbUJBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLG9CQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLEVBQUU7QUFDckIsMkJBQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMzQjthQUNKO0FBQ0QsbUJBQU8sSUFBSSxDQUFDO1NBQ2Y7OztBQUdELHFCQUFhLEVBQUUseUJBQVc7QUFDdEIsZ0JBQUk7QUFDQSx3QkFBUSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNuQyx1QkFBTyxJQUFJLENBQUM7YUFDZixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1IsdUJBQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7OztBQUdELG1CQUFXLEVBQUUsdUJBQVc7QUFDcEIsZ0JBQUksQ0FBQyxHQUFHLE1BQU07Z0JBQ1YsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUNoQixnQkFBSSxFQUFFLFlBQVksSUFBSSxNQUFNLENBQUEsQUFBQyxFQUFFO0FBQzNCLGlCQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ2IsaUJBQUMsR0FBRyxRQUFRLENBQUMsZUFBZSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUM7YUFDakQ7O0FBRUQsbUJBQU87QUFDSCxxQkFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3JCLHNCQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7YUFDMUIsQ0FBQztTQUNMOztBQUVELG1CQUFXLEVBQUUscUJBQVMsTUFBTSxFQUFFO0FBQzFCLG1CQUFPLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxBQUFDLElBQUksSUFBSSxFQUFFLENBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN6RTs7O0FBR0QsYUFBSyxFQUFFLGlCQUFXO0FBQ2QsbUJBQU8sTUFBSyxDQUFDO1NBQ2hCOzs7QUFHRCxhQUFLLEVBQUUsaUJBQVc7QUFDZCxtQkFBTyxNQUFLLENBQUM7U0FDaEI7OztBQUdELGFBQUssRUFBRSxpQkFBVztBQUNkLG1CQUFPLE1BQUssQ0FBQztTQUNoQjs7O0FBR0Qsc0JBQWMsRUFBRSwwQkFBVztBQUN2QixtQkFBTyxBQUFDLE9BQU8sT0FBTyxJQUFJLFdBQVcsR0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ3pEOztBQUVELHFCQUFhLEVBQUUseUJBQVc7QUFDdEIsbUJBQU8sVUFBVSxDQUFDO1NBQ3JCOztBQUVELHFCQUFhLEVBQUUsdUJBQVMsSUFBSSxFQUFFO0FBQzFCLHNCQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3JCOztBQUVELHdCQUFnQixFQUFFLDBCQUFTLElBQUksRUFBRTtBQUM3Qix5QkFBYSxHQUFHLElBQUksQ0FBQztTQUN4Qjs7QUFFRCx3QkFBZ0IsRUFBRSw0QkFBVztBQUN6QixtQkFBTyxVQUFVLEdBQUcsYUFBYSxDQUFDO1NBQ3JDOztBQUVELDRCQUFvQixFQUFFLDhCQUFTLElBQUksRUFBRTtBQUNqQyw2QkFBaUIsR0FBRyxJQUFJLENBQUM7U0FDNUI7O0FBRUQsNEJBQW9CLEVBQUUsZ0NBQVc7QUFDN0IsbUJBQU8sVUFBVSxHQUFHLGlCQUFpQixDQUFDO1NBQ3pDOztBQUVELHdCQUFnQixFQUFFLDRCQUFXO0FBQ3pCLG1CQUFPLFVBQVUsR0FBRyxhQUFhLENBQUM7U0FDckM7OztBQUdELHFCQUFhLEVBQUUsdUJBQVMsSUFBSSxFQUFFO0FBQzFCLGdCQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNuQix1QkFBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDNUIsTUFBTTtBQUNILHVCQUFPLEVBQUUsQ0FBQzthQUNiO1NBQ0o7O0FBRUQsK0JBQXVCLEVBQUUsaUNBQVMsSUFBSSxFQUFFOztBQUVwQyxnQkFBSSxLQUFLLEdBQUc7QUFDUixvQkFBSSxFQUFHLEdBQUc7QUFDVixvQkFBSSxFQUFHLEdBQUc7QUFDVixvQkFBSSxFQUFHLEdBQUc7QUFDVixvQkFBSSxFQUFHLElBQUk7YUFDZCxDQUFDOztBQUVGLG1CQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO0tBQ0osQ0FBQztDQUVMLENBQUEsRUFBRyxDQUFDOztBQUVMLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7OztBQ2pnQzFCLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzQixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7Ozs7O0FBS3RDLElBQUksWUFBWSxHQUFHLENBQUEsWUFBWTs7O0FBRzNCLFFBQUkseUJBQXlCLEdBQUcsU0FBNUIseUJBQXlCLEdBQWU7O0FBRXhDLFNBQUMsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNyRixhQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDcEQsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSxzQkFBc0IsR0FBRyxTQUF6QixzQkFBc0IsR0FBZTtBQUNyQyxZQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMvQyxZQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRTNELFlBQUksa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLEdBQWU7QUFDakMsZ0JBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUMvRCxnQkFBSSxlQUFlLENBQUM7O0FBRXBCLDJCQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7O0FBRzlGLG9CQUFRLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMscUJBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQy9DLG9CQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVuQyxnQkFBSSxZQUFZLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0FBQzlFLGdCQUFJLGtCQUFrQixHQUFHLGVBQWUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDOzs7QUFHNUssb0JBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN6Qyx3QkFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUNyRCxvQkFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN6QyxDQUFDOztBQUVGLDBCQUFrQixFQUFFLENBQUM7QUFDckIsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU5QyxlQUFPLENBQUMsSUFBSSxDQUFDLHFEQUFxRCxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFDbEYsdUJBQVcsQ0FBQyxRQUFRLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUNqRSxDQUFDLENBQUM7O0FBRUgsZUFBTyxDQUFDLElBQUksQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBQzdGLHVCQUFXLENBQUMsV0FBVyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7U0FDcEUsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7O0FBR0YsUUFBSSx3QkFBd0IsR0FBRyxTQUEzQix3QkFBd0IsR0FBZTtBQUN2QyxZQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMvQyxZQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7O0FBRS9ELFlBQUksb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLEdBQWU7QUFDbkMsZ0JBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUNoRSxnQkFBSSxlQUFlLENBQUM7O0FBRXBCLDJCQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7O0FBRzlGLG9CQUFRLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMscUJBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQy9DLG9CQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDLENBQUM7O0FBRUYsNEJBQW9CLEVBQUUsQ0FBQztBQUN2QixnQkFBUSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDbkQsQ0FBQzs7QUFFRixXQUFPOztBQUVILFlBQUksRUFBRSxnQkFBWTs7QUFFZCxxQ0FBeUIsRUFBRSxDQUFDO0FBQzVCLGtDQUFzQixFQUFFLENBQUM7QUFDekIsb0NBQXdCLEVBQUUsQ0FBQztTQUM5QjtLQUNKLENBQUM7Q0FFTCxDQUFBLEVBQUcsQ0FBQzs7QUFFTCxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQTs7Ozs7Ozs7O0FDdEY3QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0lBRTNCLE1BQU07YUFBTixNQUFNOzhCQUFOLE1BQU07OztpQkFBTixNQUFNOztlQUVTLG9CQUFDLElBQUksRUFBRTtBQUNwQixtQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCOzs7ZUFFa0Isc0JBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRTtBQUN4QixnQkFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2hELGdCQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxFQUFFLHlCQUF5QixDQUFDLENBQUM7Ozs7O0FBS3JELG1CQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDN0I7OztlQUVhLGlCQUFDLEtBQUssRUFBRSxDQUFDLEVBQUU7O0FBRXJCLG1CQUFRLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFFO1NBQzNCOzs7OztlQUdlLG1CQUFDLEVBQUUsRUFBRTtBQUNqQixnQkFBSSxFQUFFLElBQUssT0FBUSxFQUFFLEFBQUMsS0FBSyxVQUFVLEFBQUMsRUFBRTtBQUNwQyxrQkFBRSxFQUFFLENBQUM7YUFDUjtTQUNKOzs7OztlQUdtQix5QkFBRztBQUNuQixtQkFBUSxBQUFDLGNBQWMsSUFBSSxNQUFNLElBQU0sU0FBUyxDQUFDLGNBQWMsR0FBRyxDQUFDLEFBQUMsSUFBSyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxBQUFDLENBQUU7U0FDN0c7OztlQUVzQiwwQkFBQyxJQUFJLEVBQUU7QUFDMUIsZ0JBQUksR0FBRyxHQUFHLElBQUksQ0FBQztBQUNmLGdCQUFHLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3JCLG1CQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFDLElBQUksQ0FBQzthQUM3QjtBQUNELG1CQUFPLEdBQUcsQ0FBQztTQUNkOzs7V0F2Q0MsTUFBTTs7O0FBMkNaLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7Ozs7Ozs7QUM3Q3hCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTs7SUFFN0IsV0FBVztBQUNGLGFBRFQsV0FBVyxDQUNELEtBQUssRUFBa0Q7WUFBaEQsSUFBSSx5REFBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFDOzs4QkFEL0QsV0FBVzs7QUFFVCxZQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQTtBQUNmLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZDLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtLQUNkOztpQkFOQyxXQUFXOztlQVFOLG1CQUFHOzs7QUFDTixnQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUM5RCxvQkFBSSxJQUFJLEdBQUcsU0FBUCxJQUFJLEdBQVM7QUFDYix3QkFBSSxNQUFNLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFFLENBQUMsRUFBRTtBQUNsQyw4QkFBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNwQiwrQkFBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtxQkFDckIsTUFBTTtBQUNILGtDQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO3FCQUN4QjtpQkFDSixDQUFBO0FBQ0Qsb0JBQUksRUFBRSxDQUFBO2FBQ1QsQ0FBQyxDQUFBO0FBQ0YsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN4Qjs7O2VBRUcsZ0JBQUc7OztBQUNILGdCQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDdEIsdUJBQUssTUFBTSxHQUFHLElBQUksT0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQUssRUFBRSxFQUFFO0FBQ3RDLDBCQUFNLEVBQUUsT0FBSyxJQUFJLENBQUMsTUFBTTtBQUN4Qix5QkFBSyxFQUFFLE9BQUssSUFBSSxDQUFDLEtBQUs7QUFDdEIsMkJBQU8sRUFBRSxPQUFLLElBQUksQ0FBQyxPQUFPO0FBQzFCLDBCQUFNLEVBQUU7QUFDSiwrQkFBTyxFQUFFLE9BQUssYUFBYTtBQUMzQixxQ0FBYSxFQUFFLE9BQUssbUJBQW1CO3FCQUMxQztpQkFDSixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7U0FDTjs7O2VBRVksdUJBQUMsS0FBSyxFQUFFO0FBQ2pCLGlCQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQzVCOzs7ZUFFa0IsNkJBQUMsS0FBSyxFQUFFO0FBQ3ZCLGdCQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3JELG9CQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzthQUNwQjtTQUNKOzs7ZUFNUSxxQkFBRztBQUNSLGdCQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQzNCOzs7YUFOUyxlQUFHO0FBQ1QsbUJBQU8sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUE7U0FDM0I7OztXQWpEQyxXQUFXOzs7QUF5RGpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDOzs7OztBQzNEN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzFCLFVBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVk7QUFDbEMsWUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3JCLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ3JELG1CQUFPLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFdBQVcsR0FDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUNaLEtBQUssQ0FDUjtTQUNKLENBQUMsQ0FBQztLQUNOLENBQUM7Q0FDTDs7Ozs7QUNWRCxJQUFNLElBQUksR0FBRyxnQkFBWTtBQUNyQixRQUFJLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQztBQUMxQixLQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ1AsS0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDZCxhQUFTLEdBQUcsa0JBQWtCLENBQUM7QUFDL0IsS0FBQyxHQUFHLENBQUMsQ0FBQztBQUNOLFdBQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRTtBQUNYLFNBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdELFNBQUMsSUFBSSxDQUFDLENBQUM7S0FDVjtBQUNELEtBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDWixLQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxBQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEtBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDbkMsUUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsV0FBTyxJQUFJLENBQUM7Q0FDZixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMnKTtcclxud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbnJlcXVpcmUoJ2pxdWVyeS11aScpO1xyXG5yZXF1aXJlKCdib290c3RyYXAnKTtcclxud2luZG93LnJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcclxuXHJcbmNvbnN0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9hcHAvYXV0aDAnKTtcclxuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vanMvYXBwL3VzZXIuanMnKTtcclxuY29uc3QgUm91dGVyID0gcmVxdWlyZSgnLi9qcy9hcHAvUm91dGVyLmpzJyk7XHJcbmNvbnN0IEV2ZW50ZXIgPSByZXF1aXJlKCcuL2pzL2FwcC9FdmVudGVyLmpzJyk7XHJcbmNvbnN0IFBhZ2VGYWN0b3J5ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcycpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDb25maWcgPSByZXF1aXJlKCcuL2pzL2FwcC8vQ29uZmlnLmpzJyk7XHJcbmNvbnN0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XHJcbmNvbnN0IHNoaW1zID0gcmVxdWlyZSgnLi9qcy90b29scy9zaGltcy5qcycpO1xyXG5jb25zdCBBaXJicmFrZUNsaWVudCA9IHJlcXVpcmUoJ2FpcmJyYWtlLWpzJylcclxuY29uc3QgSW50ZWdyYXRpb25zID0gcmVxdWlyZSgnLi9qcy9hcHAvSW50ZWdyYXRpb25zJylcclxuXHJcbmNsYXNzIE1ldGFNYXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuQ29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5Db25maWcuY29uZmlnO1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSB0aGlzLkNvbmZpZy5NZXRhRmlyZTtcclxuICAgICAgICB0aGlzLkV2ZW50ZXIgPSBuZXcgRXZlbnRlcih0aGlzKTtcclxuICAgICAgICB0aGlzLmFpcmJyYWtlID0gbmV3IEFpcmJyYWtlQ2xpZW50KHsgcHJvamVjdElkOiAxMTQ5MDAsIHByb2plY3RLZXk6ICdkYzk2MTFkYjZmNzcxMjBjY2VjZDFhMjczNzQ1YTVhZScgfSk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgUHJvbWlzZS5vblBvc3NpYmx5VW5oYW5kbGVkUmVqZWN0aW9uKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aGF0LmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ29uZmlnLm9uUmVhZHkoKS50aGVuKChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKGNvbmZpZy5hdXRoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dpbigpLnRoZW4oKGF1dGgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlVzZXIgPSBuZXcgVXNlcihwcm9maWxlLCBhdXRoLCB0aGlzLkV2ZW50ZXIsIHRoaXMuTWV0YUZpcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zID0gbmV3IEludGVncmF0aW9ucyh0aGlzLCB0aGlzLlVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlci5vblJlYWR5KCkudGhlbigodXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbmV3IFBhZ2VGYWN0b3J5KHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyID0gbmV3IFJvdXRlcih0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb3V0ZXIuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlYnVnKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdC5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKVxyXG4gICAgfVxyXG5cclxuICAgIGxvZyh2YWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVidWcpIHtcclxuICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHZhbCwgJ2V2ZW50JywgJ2xvZycsICdsYWJlbCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmluZm8odmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBlcnJvcih2YWwpIHtcclxuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcih2YWwpO1xyXG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXhjZXB0aW9uJylcclxuICAgICAgICAgICAgdGhpcy5haXJicmFrZS5ub3RpZnkodmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUubG9nb3V0KCk7XHJcbiAgICAgICAgdGhpcy5BdXRoMC5sb2dvdXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbW0gPSBuZXcgTWV0YU1hcCgpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG1tOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgQWN0aW9uIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBfZ2V0QWN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgIGxldCByZXQgPSB0aGlzLl9hY3Rpb25zW2FjdGlvbl07XHJcbiAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgbGV0IE1ldGhvZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHN3aXRjaChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuT1BFTl9NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9PcGVuTWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlRSQUlOSU5HUzpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL09wZW5UcmFpbmluZy5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ORVdfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTmV3TWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vQ29weU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5DT1VSU0VfTElTVDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0NvdXJzZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0RlbGV0ZU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5NWV9NQVBTOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTXlNYXBzLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0xvZ291dC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9TaGFyZU1hcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5URVJNU19BTkRfQ09ORElUSU9OUzpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL1Rlcm1zLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vRmVlZGJhY2snKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Ib21lLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0ID0gbmV3IE1ldGhvZCh0aGlzLm1ldGFGaXJlLCB0aGlzLmV2ZW50ZXIsIHRoaXMucGFnZUZhY3RvcnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1thY3Rpb25dID0gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGFjdGlvbiwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KCk7XHJcbiAgICAgICAgbGV0IG1ldGhvZCA9IHRoaXMuX2dldEFjdGlvbihhY3Rpb24pO1xyXG4gICAgICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5hY3QoLi4ucGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbjsiLCJjb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKG1ldGFGaXJlLCBldmVudGVyLCBwYWdlRmFjdG9yeSkge1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xyXG4gICAgICAgIHRoaXMucGFnZUZhY3RvcnkgPSBwYWdlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlU2lkZWJhcigpIHtcclxuICAgICAgICBpZih0aGlzLnNpZGViYXJPcGVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BlblNpZGViYXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuU2lkZWJhcigpIHtcclxuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4pO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlU2lkZWJhcigpIHtcclxuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWN0aW9uQmFzZTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIENvcHlNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgaWYgKCFpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdNdXN0IGhhdmUgYSBtYXAgaW4gb3JkZXIgdG8gY29weS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigob2xkTWFwKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBgJHtuZXcgRGF0ZSgpfWAsXHJcbiAgICAgICAgICAgICAgICBvd25lcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubWV0YU1hcC5Vc2VyLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMubWV0YU1hcC5Vc2VyLnBpY3R1cmVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmFwcGVuZENvcHkob2xkTWFwLm5hbWUpLFxyXG4gICAgICAgICAgICAgICAgc2hhcmVkX3dpdGg6IHtcclxuICAgICAgICAgICAgICAgICAgICBhZG1pbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICcqJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IGZhbHNlIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHtpZH1gKS50aGVuKChvbGRNYXBEYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHVzaFN0YXRlID0gdGhpcy5tZXRhRmlyZS5wdXNoRGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfWApO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKG9sZE1hcERhdGEsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7bWFwSWR9YCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kQ29weShzdHIpIHtcclxuICAgICAgICBsZXQgcmV0ID0gc3RyO1xyXG4gICAgICAgIGlmICghXy5jb250YWlucyhzdHIsICcoQ29weScpKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHJldCArICcgKENvcHkgMSknO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBtZXNzID0gc3RyLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAyO1xyXG4gICAgICAgICAgICBpZiAobWVzcy5sZW5ndGggLSBtZXNzLmxhc3RJbmRleE9mKCcoQ29weScpIDw9IDQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBncmJnID0gbWVzc1ttZXNzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyYmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBncmJnID0gZ3JiZy5yZXBsYWNlKCcpJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNudCA9ICtncmJnICsgMTtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSBtZXNzLnNsaWNlKDAsIG1lc3MubGVuZ3RoIC0gMikuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldCArPSBgIChDb3B5ICR7Y250fSlgO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvcHlNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvY291cnNlcycpO1xyXG5cclxuY2xhc3MgQ291cnNlcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5DT1VSU0VfTElTVCk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5QQUdFUy5DT1VSU0VfTElTVCwgeyBpZDogaWQgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ0NvdXJzZXMnIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ291cnNlczsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY2xhc3MgRGVsZXRlTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIERlbGV0ZU1hcC5kZWxldGVBbGwoW2lkXSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGRlbGV0ZUFsbChpZHMsIHBhdGggPSBDT05TVEFOVFMuUEFHRVMuSE9NRSkge1xyXG4gICAgICAgIGNvbnN0IG1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgXy5lYWNoKGlkcywgKGlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtZXRhTWFwLk1ldGFGaXJlLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHtpZH1gKTtcclxuICAgICAgICAgICAgICAgIG1ldGFNYXAuTWV0YUZpcmUuZGVsZXRlRGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgbWV0YU1hcC5Sb3V0ZXIudG8ocGF0aCk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVsZXRlTWFwOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuXHJcbmNsYXNzIEZlZWRiYWNrIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB3aW5kb3cuVXNlclNuYXA7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KCkge1xyXG4gICAgICAgIHN1cGVyLmFjdCgpO1xyXG4gICAgICAgIHRoaXMudXNlclNuYXAub3BlblJlcG9ydFdpbmRvdygpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRiYWNrOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL2hvbWUnKTtcclxuXHJcbmNsYXNzIEhvbWUgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuSE9NRSk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdIb21lJyB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSG9tZTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY2xhc3MgTG9nb3V0IGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAubG9nb3V0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTG9nb3V0OyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL215LW1hcHMnKTtcclxuXHJcbmNsYXNzIE15TWFwcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5NWV9NQVBTKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMsIHsgaWQ6IGlkIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdNeSBNYXBzJyB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTXlNYXBzOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgTmV3TWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdCgpIHtcclxuICAgICAgICBzdXBlci5hY3QoKTtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX05FV19NQVB9YCkudGhlbigoYmxhbmtNYXApID0+IHtcclxuICAgICAgICAgICAgbGV0IG5ld01hcCA9IHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IGAke25ldyBEYXRlKCl9YCxcclxuICAgICAgICAgICAgICAgIG93bmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLm1ldGFNYXAuVXNlci51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5tZXRhTWFwLlVzZXIuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdOZXcgVW50aXRsZWQgTWFwJyxcclxuICAgICAgICAgICAgICAgIHNoYXJlZF93aXRoOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRtaW46IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAnKic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiBmYWxzZSB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcclxuICAgICAgICAgICAgbGV0IG1hcElkID0gcHVzaFN0YXRlLmtleSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke21hcElkfWApO1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZXdNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IG1ldGFDYW52YXMgPSByZXF1aXJlKCcuLi90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcycpO1xyXG5cclxuY2xhc3MgT3Blbk1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG1hcCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuTUVUQV9DQU5WQVMpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmlkID0gaWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5OQVYsIENPTlNUQU5UUy5QQUdFUy5NQVAsIG1hcCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgbWFwLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuTUFQLCBtYXAsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcGVuTWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZScpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5jb25zdCB0cmFpbmluZyA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvdHJhaW5pbmcnKVxyXG5cclxuY2xhc3MgT3BlblRyYWluaW5nIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgIGxldCB0YWcgPSByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuVFJBSU5JTkcpWzBdO1xyXG4gICAgICAgICAgICB0YWcudXBkYXRlKHsgaWQ6IGlkIH0pO1xyXG4gICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9wZW5UcmFpbmluZzsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5yZXF1aXJlKCcuLi90YWdzL2RpYWxvZ3Mvc2hhcmUnKVxyXG5cclxuY2xhc3MgU2hhcmVNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigobWFwKSA9PiB7XHJcbiAgICAgICAgICAgIG1hcC5pZCA9IGlkXHJcbiAgICAgICAgICAgIFNoYXJlTWFwLmFjdCh7IG1hcDogbWFwIH0pXHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5Sb3V0ZXIuYmFjaygpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFjdChtYXApIHtcclxuICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgIGxldCBtb2RhbCA9IHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfTU9EQUxfRElBTE9HX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLlNIQVJFKVswXVxyXG4gICAgICAgICAgICBtb2RhbC51cGRhdGUobWFwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZU1hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCB0ZXJtcyA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvdGVybXMnKTtcclxuXHJcbmNsYXNzIFRlcm1zIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLlRFUk1TKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ1Rlcm1zIGFuZCBDb25kaXRpb25zJyB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGVybXM7IiwiY29uc3QgTWV0YUZpcmUgPSByZXF1aXJlKCcuL0ZpcmViYXNlJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG5cclxuY29uc3QgY29uZmlnID0gKCkgPT4ge1xyXG4gICAgY29uc3QgU0lURVMgPSB7XHJcbiAgICAgICAgQ1JMX1NUQUdJTkc6IHtcclxuICAgICAgICAgICAgZGI6ICdtZXRhLW1hcC1zdGFnaW5nJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXQgPSB7XHJcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3QsXHJcbiAgICAgICAgc2l0ZToge31cclxuICAgIH1cclxuICAgIGxldCBzZWdtZW50cyA9IHJldC5ob3N0LnNwbGl0KCcuJyk7XHJcbiAgICBsZXQgZmlyc3QgPSBzZWdtZW50c1swXTtcclxuICAgIGlmIChmaXJzdCA9PT0gJ3d3dycpIHtcclxuICAgICAgICBmaXJzdCA9IHNlZ21lbnRzWzFdO1xyXG4gICAgfVxyXG4gICAgZmlyc3QgPSBmaXJzdC5zcGxpdCgnOicpWzBdO1xyXG5cclxuICAgIHN3aXRjaCAoZmlyc3QudG9Mb3dlckNhc2UoKSkge1xyXG5cclxuICAgICAgICBjYXNlICdsb2NhbGhvc3QnOlxyXG4gICAgICAgIGNhc2UgJ21ldGEtbWFwLXN0YWdpbmcnOlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldC5zaXRlID0gU0lURVMuQ1JMX1NUQUdJTkc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXQ7XHJcbn07XHJcblxyXG5jbGFzcyBDb25maWcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhZ3MpIHtcclxuICAgICAgICB0aGlzLnRhZ3MgPSB0YWdzO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IG5ldyBNZXRhRmlyZSh0aGlzLmNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdmcm9udGVuZCc7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ2NvbmZpZycsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5vbignbWV0YW1hcC9jYW52YXMnLCAoY2FudmFzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZCh0aGlzLmNvbmZpZy5zaXRlLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmNhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLmNvbmZpZy5zaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb25maWc7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIEV2ZW50ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICBcclxuICAgICAgICByaW90Lm9ic2VydmFibGUodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRzID0ge31cclxuICAgIH1cclxuXHJcbiAgICBldmVyeShldmVudCwgcmVhY3Rpb24pIHtcclxuICAgICAgICAvL2xldCBjYWxsYmFjayA9IHJlYWN0aW9uO1xyXG4gICAgICAgIC8vaWYgKHRoaXMuZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICAgIC8vICAgIGxldCBwaWdneWJhY2sgPSB0aGlzLmV2ZW50c1tldmVudF07XHJcbiAgICAgICAgLy8gICAgY2FsbGJhY2sgPSAoLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgIHBpZ2d5YmFjayguLi5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgICAgICByZWFjdGlvbiguLi5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgIH1cclxuICAgICAgICAvL31cclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IHJlYWN0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLm9uKGV2ZW50LCByZWFjdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yZ2V0KGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xyXG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW2V2ZW50XTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRvKGV2ZW50LCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihldmVudCwgLi4ucGFyYW1zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRlcjsiLCJsZXQgRmlyZWJhc2UgPSB3aW5kb3cuRmlyZWJhc2U7XHJcbmxldCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxyXG5sZXQgbG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpXHJcblxyXG5jbGFzcyBNZXRhRmlyZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1ldGFNYXAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tZXRhTWFwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXRhTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuTWV0YU1hcC5BdXRoMC5nZXRTZXNzaW9uKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocHJvZmlsZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmNvbmZpZy5zaXRlLmF1dGgwLmFwaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBwcm9maWxlLmlkX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgZGVsZWdhdGlvblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdmaXJlYmFzZV90b2tlbicsIHRoaXMuZmlyZWJhc2VfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGlzLmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhLCAuLi5wYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoYXV0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gdGhpcy5fbG9naW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpbjtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEocGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGNoaWxkLm9uY2UoJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uKHBhdGgsIGNhbGxiYWNrLCBldmVudCA9ICd2YWx1ZScpIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWV0aG9kID0gKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzbmFwc2hvdC5leGlzdHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKGV2ZW50LCBtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyBkYXRhIGF0ICR7cGF0aH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY2hpbGQub24oZXZlbnQsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvZmYocGF0aCwgbWV0aG9kID0gJ3ZhbHVlJywgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVEYXRhKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXREYXRhKG51bGwsIHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2hEYXRhKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnB1c2goZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhSW5UcmFuc2FjdGlvbihkYXRhLCBwYXRoLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQudHJhbnNhY3Rpb24oKGN1cnJlbnRWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVycm9yKGUsIHBhdGgpIHtcclxuICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcih7IG1lc3NhZ2U6IGBQZXJtaXNzaW9uIGRlbmllZCB0byAke3BhdGh9YCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9vblJlYWR5ID0gbnVsbDtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdmaXJlYmFzZV90b2tlbicpO1xyXG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIEludGVncmF0aW9ucyB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKG1ldGFNYXAsIHVzZXIpIHtcclxuXHRcdHRoaXMuY29uZmlnID0gbWV0YU1hcC5jb25maWc7XHJcblx0XHR0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xyXG5cdFx0dGhpcy51c2VyID0gdXNlcjtcclxuXHRcdHRoaXMuX2ZlYXR1cmVzID0ge1xyXG5cdFx0XHRnb29nbGU6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9Hb29nbGUnKSxcclxuXHRcdFx0dXNlcnNuYXA6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9Vc2VyU25hcCcpLFxyXG4gICAgICAgICAgICBhZGR0aGlzOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvQWRkVGhpcycpLFxyXG4gICAgICAgICAgICB5b3V0dWJlOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvWW91VHViZScpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0aW5pdCgpIHtcclxuICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChGZWF0dXJlKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGxldCBjb25maWcgPSB0aGlzLmNvbmZpZy5zaXRlW25hbWVdO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXSA9IG5ldyBGZWF0dXJlKGNvbmZpZywgdGhpcy51c2VyKTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0uaW5pdCgpO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5zZXRVc2VyKCk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHRzZXRVc2VyKCkge1xyXG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNldFVzZXIoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRzZW5kRXZlbnQodmFsLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMubWV0YU1hcC5kZWJ1Zykge1xyXG4gICAgICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbbmFtZV0uc2VuZEV2ZW50KHZhbCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHJcblx0fVxyXG5cclxuXHRsb2dvdXQoKSB7XHJcblx0XHRfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0ubG9nb3V0KCk7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlZ3JhdGlvbnM7IiwiY2xhc3MgUGVybWlzc2lvbnMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbWFwXHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcbiAgICB9XHJcblxyXG4gICAgY2FuRWRpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc01hcE93bmVyKCkgfHwgdGhpcy5pc1NoYXJlZEVkaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIGNhblZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXBPd25lcigpIHx8IHRoaXMuaXNTaGFyZWRWaWV3KClcclxuICAgIH1cclxuXHJcbiAgICBpc01hcE93bmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJiB0aGlzLm1hcC5vd25lci51c2VySWQgPT0gdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaGFyZWRFZGl0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxyXG4gICAgICAgICAgICB0aGlzLm1hcC5zaGFyZWRfd2l0aCAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMubWV0YU1hcC5Vc2VyLmlzQWRtaW4gfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdICYmIHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkpXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaGFyZWRWaWV3KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxyXG4gICAgICAgICAgICB0aGlzLmlzU2hhcmVkRWRpdCgpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdLnJlYWQgPT0gdHJ1ZSkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlKVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBlcm1pc3Npb25zOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XHJcbmNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgUm91dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9ucyA9IG1ldGFNYXAuSW50ZWdyYXRpb25zO1xyXG4gICAgICAgIHRoaXMudXNlciA9IG1ldGFNYXAuVXNlcjtcclxuICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbWV0YU1hcC5QYWdlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBtZXRhTWFwLkV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xyXG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgaWQgPSAnJywgYWN0aW9uID0gJycsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhdGggPSB0aGlzLmdldFBhdGgodGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCB0aGlzLnBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5Lm5hdmlnYXRlKHRoaXMucGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbygnaGlzdG9yeScsIHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50UGFnZSgpIHtcclxuICAgICAgICBsZXQgcGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJztcclxuICAgICAgICBpZiAoIXRoaXMuaXNUcmFja2VkKHBhZ2UpKSB7XHJcbiAgICAgICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UgPSB0aGlzLmdldFBhdGgodGhpcy51c2VyLmhpc3RvcnlbcGFnZUNudCAtIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFBhdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcmV2aW91c1BhZ2UocGFnZU5vID0gMikge1xyXG4gICAgICAgIGxldCBwYWdlID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMCkge1xyXG4gICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSBwYWdlTm9dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByZXZpb3VzUGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmV2aW91c1BhZ2UoMik7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2socGF0aCkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb25zLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlTWFpbihoaWRlLCBwYXRoKSB7XHJcbiAgICAgICAgdGhpcy50cmFjayhwYXRoKTtcclxuICAgICAgICBpZiAoaGlkZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHRvKHBhdGgpIHtcclxuICAgICAgICBwYXRoID0gdGhpcy5nZXRQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCBwYXRoKTtcclxuICAgICAgICAgICAgcmlvdC5yb3V0ZShgJHtwYXRofWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiYWNrKCkge1xyXG4gICAgICAgIGxldCBwYXRoID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMSAmJiAodGhpcy5jdXJyZW50UGFnZSAhPSAnbXltYXBzJyB8fCB0aGlzLmN1cnJlbnRQYWdlICE9IHRoaXMucHJldmlvdXNQYWdlKSkge1xyXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5wcmV2aW91c1BhZ2U7XHJcbiAgICAgICAgICAgIGxldCBiYWNrTm8gPSAyO1xyXG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNUcmFja2VkKHBhdGgpICYmIHRoaXMudXNlci5oaXN0b3J5W2JhY2tOb10pIHtcclxuICAgICAgICAgICAgICAgIGJhY2tObyArPSAxO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UHJldmlvdXNQYWdlKGJhY2tObyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG8ocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRvTm90VHJhY2soKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9kb05vdFRyYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RvTm90VHJhY2sgPSBbQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuQ09QWV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVCwgQ09OU1RBTlRTLkFDVElPTlMuTkVXX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuRkVFREJBQ0ssIENPTlNUQU5UUy5BQ1RJT05TLlNIQVJFX01BUF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9kb05vdFRyYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVHJhY2tlZChwYXRoKSB7XHJcbiAgICAgICAgbGV0IHB0aCA9IHRoaXMuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICByZXR1cm4gXy5hbnkodGhpcy5kb05vdFRyYWNrLCAocCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXB0aC5zdGFydHNXaXRoKHApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJjb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5cclxuY29uc3QgdG9Cb29sID0gKHZhbCkgPT4ge1xyXG4gICAgbGV0IHJldCA9IGZhbHNlO1xyXG4gICAgaWYgKHZhbCA9PT0gdHJ1ZSB8fCB2YWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0ID0gdmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoXy5jb250YWlucyhbJ3RydWUnLCAneWVzJywgJzEnXSwgdmFsICsgJycudG9Mb3dlckNhc2UoKS50cmltKCkpKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxufVxyXG5cclxuY2xhc3MgU2hhcmluZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXNlcikge1xyXG4gICAgICAgIHRoaXMudXNlciA9IHVzZXJcclxuICAgICAgICB0aGlzLl9tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcbiAgICAgICAgdGhpcy5fZmIgPSB0aGlzLl9tZXRhTWFwLk1ldGFGaXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFNoYXJlKG1hcCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XHJcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmIuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICByZWFkOiB0b0Jvb2wob3B0cy5yZWFkKSxcclxuICAgICAgICAgICAgICAgIHdyaXRlOiB0b0Jvb2wob3B0cy53cml0ZSksXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBvcHRzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBwaWN0dXJlOiBvcHRzLnBpY3R1cmVcclxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHNoYXJlZCBhIG1hcCwgJHttYXAubmFtZX0sIHdpdGggeW91IWAsXHJcbiAgICAgICAgICAgICAgICBtYXBJZDogbWFwLmlkLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQ09OU1RBTlRTLk5PVElGSUNBVElPTi5NQVAsXHJcbiAgICAgICAgICAgICAgICB0aW1lOiBgJHtuZXcgRGF0ZSgpfWBcclxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdCh1c2VyRGF0YS5pZCl9YClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlU2hhcmUobWFwLCB1c2VyRGF0YSkge1xyXG4gICAgICAgIGlmIChtYXAgJiYgbWFwLmlkICYmIHVzZXJEYXRhICYmIHVzZXJEYXRhLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHJlbW92ZWQgYSBtYXAsICR7bWFwLm5hbWV9LCB0aGF0IHdhcyBwcmV2aW91c2x5IHNoYXJlZC5gLFxyXG4gICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKX1gXHJcbiAgICAgICAgICAgIH0sIGAke0NPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQodXNlckRhdGEuaWQpfWApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVkaXRTaGFyZShtYXBJZCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFyaW5nIiwiY29uc3QgQXV0aDBMb2NrID0gcmVxdWlyZSgnYXV0aDAtbG9jaycpXG5jb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcblxuY2xhc3MgQXV0aDAge1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCBtZXRhTWFwKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKGNvbmZpZy5hcGksIGNvbmZpZy5hcHApO1xuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvd0xvZ2luID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbkFmdGVyU2lnbnVwOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbChlcnIsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gcHJvZmlsZS5jdG9rZW4gPSBjdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnY3Rva2VuJywgdGhpcy5jdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIHRoaXMuaWRfdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgdGhpcy5wcm9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaF90b2tlbiA9IHByb2ZpbGUucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dMb2dpbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICAgIH1cblxuICAgIGxpbmtBY2NvdW50KCkge1xuICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICBjYWxsYmFja1VSTDogbG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSxcbiAgICAgICAgICAgIGRpY3Q6IHtcbiAgICAgICAgICAgICAgICBzaWduaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLmN0b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkZhaWwoZXJyLCByZWplY3QpIHtcbiAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycik7XG4gICAgICAgIGlmIChyZWplY3QpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuX2dldFNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIChlcnIsIHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdjdG9rZW4nKS50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBwcm9maWxlLmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ05vIHNlc3Npb24nKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRTZXNzaW9uO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnaWRfdG9rZW4nKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBudWxsO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuXG5cbiIsImNvbnN0IHV1aWQgPSByZXF1aXJlKCcuLi90b29scy91dWlkLmpzJyk7XHJcbmNvbnN0IENvbW1vbiA9IHJlcXVpcmUoJy4uL3Rvb2xzL0NvbW1vbicpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIFVzZXIge1xyXG4gICAgY29uc3RydWN0b3IocHJvZmlsZSwgYXV0aCwgZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLmF1dGggPSBhdXRoO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMudXNlcktleSA9IHV1aWQoKTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgbGV0IHRyYWNrSGlzdG9yeSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZXZlcnkoJ2hpc3RvcnknLCAocGFnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpc3RvcnkubGVuZ3RoID09IDAgfHwgcGFnZSAhPSB0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEodGhpcy5oaXN0b3J5LCBgdXNlcnMvJHt0aGlzLmF1dGgudWlkfS9oaXN0b3J5YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5vbihgdXNlcnMvJHt0aGlzLmF1dGgudWlkfWAsICh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlci5oaXN0b3J5ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSB1c2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2tIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX2lkZW50aXR5KCkge1xyXG4gICAgICAgIGxldCByZXQgPSB7fTtcclxuICAgICAgICBpZiAodGhpcy5wcm9maWxlICYmIHRoaXMucHJvZmlsZS5pZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb2ZpbGUuaWRlbnRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNyZWF0ZWRPbigpIHtcclxuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9jcmVhdGVkT24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlZE9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGR0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiBDb21tb24uZ2V0VGlja3NGcm9tRGF0ZShkdClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlZE9uIHx8IHsgZGF0ZTogbnVsbCwgdGlja3M6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuZnVsbE5hbWU7XHJcbiAgICAgICAgaWYgKHJldCkge1xyXG4gICAgICAgICAgICByZXQgPSByZXQuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXQgJiYgdGhpcy5faWRlbnRpdHkubmlja25hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmlja25hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmdWxsTmFtZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZW1haWwoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5lbWFpbCkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5lbWFpbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGljdHVyZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnBpY3R1cmUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucGljdHVyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXNlcklkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGgudWlkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0FkbWluKCkge1xyXG4gICAgICAgIGxldCByZXQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucm9sZXMpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucm9sZXMuYWRtaW4gPT0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhpc3RvcnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZmlsZS5oaXN0b3J5IHx8IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVVc2VyRWRpdG9yT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvcl9vcHRpb25zOiBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyOyIsImNvbnN0IGpzUGx1bWIgPSB3aW5kb3cuanNQbHVtYjtcclxuY29uc3QganNQbHVtYlRvb2xraXQgPSB3aW5kb3cuanNQbHVtYlRvb2xraXQ7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxuY29uc3QgUGVybWlzc2lvbnMgPSByZXF1aXJlKCcuLi9hcHAvUGVybWlzc2lvbnMnKVxyXG5cclxucmVxdWlyZSgnLi9sYXlvdXQnKVxyXG5cclxuY2xhc3MgQ2FudmFzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtYXAsIG1hcElkKSB7XHJcbiAgICAgICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICAgICAgdGhpcy5tYXBJZCA9IG1hcElkO1xyXG4gICAgICAgIHRoaXMudG9vbGtpdCA9IHt9O1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxyXG4gICAgICAgIGxldCBwZXJtaXNzaW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIGxldCByZWFkeSA9IHRoaXMubWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcElkfWApLnRoZW4oKG1hcEluZm8pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvID0gbWFwSW5mb1xyXG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG5ldyBQZXJtaXNzaW9ucyhtYXBJbmZvKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgY29uc3QgdGhyb3R0bGVTYXZlID0gXy50aHJvdHRsZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9ucy5jYW5FZGl0KCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB3aW5kb3cudG9vbGtpdC5leHBvcnREYXRhKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZF9ieToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YUluVHJhbnNhY3Rpb24ocG9zdERhdGEsIGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLkludGVncmF0aW9ucy5zZW5kRXZlbnQodGhpcy5tYXBJZCwgJ2V2ZW50JywgJ2F1dG9zYXZlJywgJ2F1dG9zYXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgIHJlYWR5LnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29ybmVyXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cclxuICAgICAgICAgICAgICAgIHZhciB0b29sa2l0ID0gd2luZG93LnRvb2xraXQgPSBqc1BsdW1iVG9vbGtpdC5uZXdJbnN0YW5jZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU3RhcnRDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCBlZGdlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29ybmVyID0gZWRnZVR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGVkZ2VUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZUNvbm5lY3Q6ZnVuY3Rpb24oZnJvbU5vZGUsIHRvTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9QcmV2ZW50IHNlbGYtcmVmZXJlbmNpbmcgY29ubmVjdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZnJvbU5vZGUgPT0gdG9Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQmV0d2VlbiB0aGUgc2FtZSB0d28gbm9kZXMsIG9ubHkgb25lIHBlcnNwZWN0aXZlIGNvbm5lY3Rpb24gbWF5IGV4aXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goY3VycmVudENvcm5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BlcnNwZWN0aXZlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gZnJvbU5vZGUuZ2V0RWRnZXMoeyBmaWx0ZXI6IGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuZGF0YS50eXBlID09ICdwZXJzcGVjdGl2ZScgfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZCA9IGVkZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoKGVkLnNvdXJjZSA9PSBmcm9tTm9kZSAmJiBlZC50YXJnZXQgPT0gdG9Ob2RlKSB8fCAoZWQudGFyZ2V0ID09IGZyb21Ob2RlICYmIGVkLnNvdXJjZSA9PSB0b05vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gZHVtbXkgZm9yIGEgbmV3IG5vZGUuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgdmFyIF9uZXdOb2RlID0gZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9dHlwZXx8XCJpZGVhXCJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3OjUwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoOjUwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDpcImlkZWFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFBvc2l0aW9uOiBbXVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGR1bW15IGZvciBhIG5ldyBwcm94eSAoZHJhZyBoYW5kbGUpXHJcbiAgICAgICAgICAgICAgICB2YXIgX25ld1Byb3h5ID0gZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8ICdwcm94eVBlcnNwZWN0aXZlJ1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHc6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6dHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtYWluRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanRrLWRlbW8tbWFpblwiKSxcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXNFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5qdGstZGVtby1jYW52YXNcIik7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vV2hlbmV2ZXIgY2hhbmdpbmcgdGhlIHNlbGVjdGlvbiwgY2xlYXIgd2hhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgdmFyIGNsZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnNldFNlbGVjdGlvbihvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25maWd1cmUgdGhlIHJlbmRlcmVyXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSB0b29sa2l0LnJlbmRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBjYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzRHJhZ2dhYmxlOiBwZXJtaXNzaW9ucy5jYW5FZGl0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlUGFuQnV0dG9uczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3VzdG9tIGxheW91dCBmb3IgdGhpcyBhcHAuIHNpbXBsZSBleHRlbnNpb24gb2YgdGhlIHNwcmluZyBsYXlvdXQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJtZXRhbWFwXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBob3cgeW91IGNhbiBhc3NvY2lhdGUgZ3JvdXBzIG9mIG5vZGVzLiBIZXJlLCBiZWNhdXNlIG9mIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdheSBJIGhhdmUgcmVwcmVzZW50ZWQgdGhlIHJlbGF0aW9uc2hpcCBpbiB0aGUgZGF0YSwgd2UgZWl0aGVyIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgcGFydCdzIFwicGFyZW50XCIgYXMgdGhlIHBvc3NlLCBvciBpZiBpdCBpcyBub3QgYSBwYXJ0IHRoZW4gd2VcclxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gdGhlIG5vZGUncyBpZC4gVGhlcmUgYXJlIGFkZFRvUG9zc2UgYW5kIHJlbW92ZUZyb21Qb3NzZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ldGhvZHMgdG9vIChvbiB0aGUgcmVuZGVyZXIsIG5vdCB0aGUgdG9vbGtpdCk7IHRoZXNlIGNhbiBiZSB1c2VkXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0cmFuc2ZlcnJpbmcgYSBwYXJ0IGZyb20gb25lIHBhcmVudCB0byBhbm90aGVyLlxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnblBvc3NlOmZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZGF0YS5wYXJlbnQgPyBbIG5vZGUuZGF0YS5wYXJlbnQsIGZhbHNlIF0gOiBub2RlLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgem9vbVRvRml0OmZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlczp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwOiBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKG9iai5ub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbihvYmopIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTpcInRtcGxOb2RlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImRlZmF1bHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwici10aGluZ1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImlkZWFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOlwidG1wbERyYWdQcm94eVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcnM6IFsnQ29udGludW91cycsICdDZW50ZXInXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UGVyc3BlY3RpdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwicHJveHlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5UmVsYXRpb25zaGlwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcInByb3h5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRibGNsaWNrOiBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqLm5vZGUuZGF0YS50eXBlID0gJ3ItdGhpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL29iai5ub2RlLnNldFR5cGUoJ3ItdGhpbmcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9VcGRhdGluZyB0aGUgbm9kZSB0eXBlIGRvZXMgbm90IHNlZW0gdG8gc3RpY2s7IGluc3RlYWQsIGNyZWF0ZSBhIG5ldyBub2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHJlbmRlcmVyLm1hcEV2ZW50TG9jYXRpb24ob2JqLmUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZXMgPSBvYmoubm9kZS5nZXRFZGdlcygpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC53ID0gZWRnZXNbMF0uc291cmNlLmRhdGEudyAqIDAuNjY3O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5oID0gZWRnZXNbMF0uc291cmNlLmRhdGEuaCAqIDAuNjY3O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKGpzUGx1bWIuZXh0ZW5kKF9uZXdOb2RlKFwici10aGluZ1wiKSwgZCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmUtY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3Rpb25zIG9uIHRoZSBuZXcgbm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8ZWRnZXMubGVuZ3RoOyBpKz0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZWRnZXNbaV0uc291cmNlID09IG9iai5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5ld05vZGUsIHRhcmdldDplZGdlc1tpXS50YXJnZXQsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZWRnZXNbaV0udGFyZ2V0ID09IG9iai5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOmVkZ2VzW2ldLnNvdXJjZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFByb3h5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RlbGV0ZSB0aGUgcHJveHkgbm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmVOb2RlKG9iai5ub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZXM6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcDogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob2JqLmUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKSA9PSAncmVsYXRpb25zaGlwLW92ZXJsYXknICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24ob2JqLmVkZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcnM6W1wiQ29udGludW91c1wiLFwiQ29udGludW91c1wiXSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9yOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcjpbXCJTdGF0ZU1hY2hpbmVcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDEuMDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZpbmVzczoxNVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcmVsYXRpb25zaGlwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50OlwiQmxhbmtcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5czpbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgXCJQbGFpbkFycm93XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOjEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDoxMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aDoxMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwicmVsYXRpb25zaGlwLW92ZXJsYXlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcFByb3h5OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcmVsYXRpb25zaGlwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50OlwiQmxhbmtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcGVyc3BlY3RpdmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludHM6WyBcIkJsYW5rXCIsIFsgXCJEb3RcIiwgeyByYWRpdXM6NSwgY3NzQ2xhc3M6XCJvcmFuZ2VcIiB9XV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmVQcm94eTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRzOlsgXCJCbGFua1wiLCBbIFwiRG90XCIsIHsgcmFkaXVzOjEsIGNzc0NsYXNzOlwib3JhbmdlX3Byb3h5XCIgfV1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBldmVudHM6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNDbGljazogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhc0RibENsaWNrOmZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBhbiBJZGVhIG5vZGUgYXQgdGhlIGxvY2F0aW9uIGF0IHdoaWNoIHRoZSBldmVudCBvY2N1cnJlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSByZW5kZXJlci5tYXBFdmVudExvY2F0aW9uKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Nb3ZlIDEvMiB0aGUgaGVpZ2h0IGFuZCB3aWR0aCB1cCBhbmQgdG8gdGhlIGxlZnQgdG8gY2VudGVyIHRoZSBub2RlIG9uIHRoZSBtb3VzZSBjbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiB3aGVuIGhlaWdodC93aWR0aCBpcyBjb25maWd1cmFibGUsIHJlbW92ZSBoYXJkLWNvZGVkIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmxlZnQgPSBwb3MubGVmdC01MFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLnRvcCA9IHBvcy50b3AtNTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuYWRkTm9kZShqc1BsdW1iLmV4dGVuZChfbmV3Tm9kZSgpLCBwb3MpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUFkZGVkOl9yZWdpc3RlckhhbmRsZXJzLCAvLyBzZWUgYmVsb3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZUFkZGVkOiBmdW5jdGlvbihvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF5b3V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyaW91cyBkcmFnL2Ryb3AgaGFuZGxlciBldmVudCBleHBlcmltZW50cyBsaXZlZCBoZXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdPcHRpb25zOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOlwiLnNlZ21lbnRcIiwgICAgICAgLy8gY2FuJ3QgZHJhZyBub2RlcyBieSB0aGUgY29sb3Igc2VnbWVudHMuXHJcblx0XHRcdFx0XHRcdHN0b3A6ZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gd2hlbiBfYW55XyBub2RlIHN0b3BzIGRyYWdnaW5nLCBydW4gdGhlIGxheW91dCBhZ2Fpbi5cclxuXHRcdFx0XHRcdFx0XHQvLyB0aGlzIHdpbGwgY2F1c2UgY2hpbGQgbm9kZXMgdG8gc25hcCB0byB0aGVpciBuZXcgcGFyZW50LCBhbmQgYWxzb1xyXG5cdFx0XHRcdFx0XHRcdC8vIGNsZWFudXAgbmljZWx5IGlmIGEgbm9kZSBpcyBkcm9wcGVkIG9uIGFub3RoZXIgbm9kZS5cclxuXHRcdFx0XHRcdFx0XHRyZW5kZXJlci5yZWZyZXNoKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhbG9ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLmluaXRpYWxpemUoe1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IFwiLmRsZ1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvIGRpYWxvZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vICAgIE1vdXNlIGhhbmRsZXJzLiBTb21lIGFyZSB3aXJlZCB1cDsgYWxsIGxvZyB0aGUgY3VycmVudCBub2RlIGRhdGEgdG8gdGhlIGNvbnNvbGUuXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIF90eXBlcyA9IFsgXCJyZWRcIiwgXCJvcmFuZ2VcIiwgXCJncmVlblwiLCBcImJsdWVcIiwgXCJ0ZXh0XCIgXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2xpY2tMb2dnZXIgPSBmdW5jdGlvbih0eXBlLCBldmVudCwgZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCArICcgJyArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZXZlbnQgPT0gJ2RibGNsaWNrJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBfY2xpY2tIYW5kbGVycyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGljazp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZDpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1InLCAnY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW46ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdHJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yYW5nZTpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ08nLCAnY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZTpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0InLCAnY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1QnLCAnY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdSJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyZWVuOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignRycsICdkYmxjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1dpZHRoID0gbm9kZS5kYXRhLncgKiAwLjY2NztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdIZWlnaHQgPSBub2RlLmRhdGEuaCAqIDAuNjY3O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5jaGlsZHJlbiA9IG5vZGUuZGF0YS5jaGlsZHJlbiB8fCBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdMYWJlbCA9ICdQYXJ0JztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Om5vZGUuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdzpuZXdXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoOm5ld0hlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogbmV3TGFiZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IG5vZGUuZGF0YS5jaGlsZHJlbi5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4ucHVzaChuZXdOb2RlLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbGF5b3V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yYW5nZTpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ08nLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3h5Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3UHJveHkoJ3Byb3h5UGVyc3BlY3RpdmUnKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bm9kZSwgdGFyZ2V0OnByb3h5Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInBlcnNwZWN0aXZlUHJveHlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInBlcnNwZWN0aXZlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZTpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0InLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3h5Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3UHJveHkoJ3Byb3h5UmVsYXRpb25zaGlwJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5vZGUsIHRhcmdldDpwcm94eU5vZGUsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpwcm94eU5vZGUsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1QnLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LkRpYWxvZ3Muc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZGxnVGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVudGVyIGxhYmVsOlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uT0s6IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQudXBkYXRlTm9kZShub2RlLCB7IGxhYmVsOmQudGV4dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Om5vZGUuZGF0YS5sYWJlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgX2N1cnJ5SGFuZGxlciA9IGZ1bmN0aW9uKGVsLCBzZWdtZW50LCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9lbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBzZWdtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKF9lbCwgXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jbGlja0hhbmRsZXJzW1wiY2xpY2tcIl1bc2VnbWVudF0oZWwsIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24oX2VsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NsaWNrSGFuZGxlcnNbXCJkYmxjbGlja1wiXVtzZWdtZW50XShlbCwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyBzZXR1cCB0aGUgY2xpY2tpbmcgYWN0aW9ucyBhbmQgdGhlIGxhYmVsIGRyYWcuIEZvciB0aGUgZHJhZyB3ZSBjcmVhdGUgYW5cclxuICAgICAgICAgICAgICAgIC8vIGluc3RhbmNlIG9mIGpzUGx1bWIgZm9yIG5vdCBvdGhlciBwdXJwb3NlIHRoYW4gdG8gbWFuYWdlIHRoZSBkcmFnZ2luZyBvZlxyXG4gICAgICAgICAgICAgICAgLy8gbGFiZWxzLiBXaGVuIGEgZHJhZyBzdGFydHMgd2Ugc2V0IHRoZSB6b29tIG9uIHRoYXQganNQbHVtYiBpbnN0YW5jZSB0b1xyXG4gICAgICAgICAgICAgICAgLy8gbWF0Y2ggb3VyIGN1cnJlbnQgem9vbS5cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWxEcmFnSGFuZGxlciA9IGpzUGx1bWIuZ2V0SW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIF9yZWdpc3RlckhhbmRsZXJzKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGhlcmUgeW91IGhhdmUgcGFyYW1zLmVsLCB0aGUgRE9NIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgcGFyYW1zLm5vZGUsIHRoZSB1bmRlcmx5aW5nIG5vZGUuIGl0IGhhcyBhIGBkYXRhYCBtZW1iZXIgd2l0aCB0aGUgbm9kZSdzIHBheWxvYWQuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0gcGFyYW1zLmVsLCBub2RlID0gcGFyYW1zLm5vZGUsIGxhYmVsID0gZWwucXVlcnlTZWxlY3RvcihcIi5uYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3R5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jdXJyeUhhbmRsZXIoZWwsIF90eXBlc1tpXSwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBsYWJlbCBkcmFnZ2FibGUgKHNlZSBub3RlIGFib3ZlKS5cclxuICAgICAgICAgICAgICAgICAgICBsYWJlbERyYWdIYW5kbGVyLmRyYWdnYWJsZShsYWJlbCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDpmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxEcmFnSGFuZGxlci5zZXRab29tKHJlbmRlcmVyLmdldFpvb20oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3A6ZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmxhYmVsUG9zaXRpb24gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQobGFiZWwuc3R5bGUubGVmdCwgMTApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLnRvcCwgMTApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZVNhdmUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIGxhYmVsIGVkaXRhYmxlIHZpYSBhIGRpYWxvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24obGFiZWwsIFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImRsZ1RleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVudGVyIGxhYmVsOlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25PSzogZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnVwZGF0ZU5vZGUobm9kZSwgeyBsYWJlbDpkLnRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Om5vZGUuZGF0YS5sYWJlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogc2hvd3MgaW5mbyBpbiB3aW5kb3cgb24gYm90dG9tIHJpZ2h0LlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIF9pbmZvKHRleHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGxvYWQgdGhlIGRhdGEuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5tYXAgJiYgdGhhdC5tYXAuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQubG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGhhdC5tYXAuZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvLyBhIGNvdXBsZSBvZiByYW5kb20gZXhhbXBsZXMgb2YgdGhlIGZpbHRlciBmdW5jdGlvbiwgYWxsb3dpbmcgeW91IHRvIHF1ZXJ5IHlvdXIgZGF0YVxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjb3VudEVkZ2VzT2ZUeXBlID0gZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b29sa2l0LmZpbHRlcihmdW5jdGlvbihvYmopIHsgcmV0dXJuIG9iai5vYmplY3RUeXBlID09IFwiRWRnZVwiICYmIG9iai5kYXRhLnR5cGU9PT10eXBlOyB9KS5nZXRFZGdlQ291bnQoKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciBkdW1wRWRnZUNvdW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYXJlIFwiICsgY291bnRFZGdlc09mVHlwZShcInJlbGF0aW9uc2hpcFwiKSArIFwiIHJlbGF0aW9uc2hpcCBlZGdlc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFyZSBcIiArIGNvdW50RWRnZXNPZlR5cGUoXCJwZXJzcGVjdGl2ZVwiKSArIFwiIHBlcnNwZWN0aXZlIGVkZ2VzXCIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB0b29sa2l0LmJpbmQoXCJkYXRhVXBkYXRlZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBkdW1wRWRnZUNvdW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm90dGxlU2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKFwicmVsYXRpb25zaGlwRWRnZUR1bXBcIiwgXCJjbGlja1wiLCBkdW1wRWRnZUNvdW50cygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0NUUkwgKyBjbGljayBlbmFibGVzIHRoZSBsYXNzb1xyXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBkZWxldGVBbGwgPSBmdW5jdGlvbihzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaW1wbGVtZW50IGxvZ2ljIHRvIGRlbGV0ZSB3aG9sZSBlZGdlK3Byb3h5K2VkZ2Ugc3RydWN0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaEVkZ2UoZnVuY3Rpb24oaSxlKSB7IGNvbnNvbGUubG9nKGUpIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL1JlY3Vyc2Ugb3ZlciBhbGwgY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5lYWNoTm9kZShmdW5jdGlvbihpLG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3Vyc2UgPSBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihub2RlICYmIG5vZGUuZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPG5vZGUuZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrPTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gdG9vbGtpdC5nZXROb2RlKG5vZGUuZGF0YS5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRGVsZXRlIGNoaWxkcmVuIGJlZm9yZSBwYXJlbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnJlbW92ZU5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNlKG4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlKHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAvL21hcCBiYWNrc3BhY2UgdG8gZGVsZXRlIGlmIGFueXRoaW5nIGlzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5dXAnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGUgPSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdG9vbGtpdC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVBbGwoc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlID0gJ3NlbGVjdCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldE1vZGUoJ3NlbGVjdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQ2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHRvb2xraXQuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQWxsKHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcclxuIiwiLyoqXHJcbiogQ3VzdG9tIGxheW91dCBmb3IgbWV0YW1hcC4gRXh0ZW5kcyB0aGUgU3ByaW5nIGxheW91dC4gQWZ0ZXIgU3ByaW5nIHJ1bnMsIHRoaXNcclxuKiBsYXlvdXQgZmluZHMgJ3BhcnQnIG5vZGVzIGFuZCBhbGlnbnMgdGhlbSB1bmRlcm5lYXRoIHRoZWlyIHBhcmVudHMuIFRoZSBhbGlnbm1lbnRcclxuKiAtIGxlZnQgb3IgcmlnaHQgLSBpcyBzZXQgaW4gdGhlIHBhcmVudCBub2RlJ3MgZGF0YSwgYXMgYHBhcnRBbGlnbmAuXHJcbipcclxuKiBMYXlvdXQgY2FuIGJlIHN1c3BlbmRlZCBvbiBhIHBlci1ub2RlIGJhc2lzIGJ5IHNldHRpbmcgYHN1c3BlbmRMYXlvdXRgIGluIHRoZSBOb2RlJ3NcclxuKiBkYXRhLlxyXG4qXHJcbiogQ2hpbGQgbm9kZXMgXHJcbiovXHJcbjsoZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0ZnVuY3Rpb24gY2hpbGROb2RlQ29tcGFyYXRvcihjMSwgYzIpIHtcclxuXHRcdGlmIChjMi5kYXRhLm9yZGVyID09IG51bGwpIHJldHVybiAtMTtcclxuXHRcdGlmIChjMS5kYXRhLm9yZGVyID09IG51bGwpIHJldHVybiAxO1xyXG5cdFx0cmV0dXJuIGMxLmRhdGEub3JkZXIgPCBjMi5kYXRhLm9yZGVyID8gLTEgOiAxO1xyXG5cdH1cclxuXHJcbiAganNQbHVtYlRvb2xraXQuTGF5b3V0c1tcIm1ldGFtYXBcIl0gPSBmdW5jdGlvbigpIHtcclxuICAgIGpzUGx1bWJUb29sa2l0LkxheW91dHMuU3ByaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdmFyIF9vbmVTZXQgPSBmdW5jdGlvbihwYXJlbnQsIHBhcmFtcywgdG9vbGtpdCkge1xyXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgIHZhciBwYWRkaW5nID0gcGFyYW1zLnBhcnRQYWRkaW5nIHx8IDIwO1xyXG4gICAgICBpZiAocGFyZW50LmRhdGEuY2hpbGRyZW4gJiYgcGFyZW50LmRhdGEuc3VzcGVuZExheW91dCAhPT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICB2YXIgYyA9IHBhcmVudC5kYXRhLmNoaWxkcmVuLFxyXG5cdFx0ICBcdGNoaWxkTm9kZXMgPSBfLm1hcCggYywgdG9vbGtpdC5nZXROb2RlICksXHJcbiAgICAgICAgICAgIHBhcmVudFBvcyA9IHRoaXMuZ2V0UG9zaXRpb24ocGFyZW50LmlkKSxcclxuICAgICAgICAgICAgcGFyZW50U2l6ZSA9IHRoaXMuZ2V0U2l6ZShwYXJlbnQuaWQpLFxyXG4gICAgICAgICAgICBtYWduZXRpemVOb2RlcyA9IFsgcGFyZW50LmlkIF0sXHJcbiAgICAgICAgICAgIGFsaWduID0gKHBhcmVudC5kYXRhLnBhcnRBbGlnbiB8fCBcInJpZ2h0XCIpID09PSBcImxlZnRcIiA/IDAgOiAxLFxyXG4gICAgICAgICAgICB5ID0gcGFyZW50UG9zWzFdICsgcGFyZW50U2l6ZVsxXSArIHBhZGRpbmc7XHJcblx0XHRcclxuXHRcdC8vIHNvcnQgbm9kZXNcdFxyXG5cdFx0Y2hpbGROb2Rlcy5zb3J0KGNoaWxkTm9kZUNvbXBhcmF0b3IpO1xyXG5cdFx0Ly8gYW5kIHJ1biB0aHJvdWdoIHRoZW0gYW5kIGFzc2lnbiBvcmRlcjsgYW55IHRoYXQgZGlkbid0IHByZXZpb3VzbHkgaGF2ZSBvcmRlciB3aWxsIGdldCBvcmRlclxyXG5cdFx0Ly8gc2V0LCBhbmQgYW55IHRoYXQgaGFkIG9yZGVyIHdpbGwgcmV0YWluIHRoZSBzYW1lIHZhbHVlLlxyXG5cdFx0Xy5lYWNoKGNoaWxkTm9kZXMsIGZ1bmN0aW9uKGNuLCBpKSB7XHJcblx0XHRcdGNuLmRhdGEub3JkZXIgPSBpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBjbiA9IGNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgIGlmKGNuKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGNoaWxkU2l6ZSA9IHRoaXMuZ2V0U2l6ZShjbi5pZCksXHJcbiAgICAgICAgICAgICAgICAgIHggPSBwYXJlbnRQb3NbMF0gKyAoYWxpZ24gKiAocGFyZW50U2l6ZVswXSAtIGNoaWxkU2l6ZVswXSkpO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGNuLmlkLCB4LCB5LCB0cnVlKTtcclxuICAgICAgICAgICAgICBtYWduZXRpemVOb2Rlcy5wdXNoKGNuLmlkKTtcclxuICAgICAgICAgICAgICB5ICs9IChjaGlsZFNpemVbMV0gKyBwYWRkaW5nKTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0fVxyXG4gICAgICAgICAgXHJcblxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcyk7XHJcblxyXG4gICAgLy8gc3Rhc2ggb3JpZ2luYWwgZW5kIGNhbGxiYWNrIGFuZCBvdmVycmlkZS4gcGxhY2UgYWxsIFBhcnQgbm9kZXMgd3J0IHRoZWlyXHJcbiAgICAvLyBwYXJlbnRzLCB0aGVuIGNhbGwgb3JpZ2luYWwgZW5kIGNhbGxiYWNrIGFuZCBmaW5hbGx5IHRlbGwgdGhlIGxheW91dFxyXG4gICAgLy8gdG8gZHJhdyBpdHNlbGYgYWdhaW4uXHJcbiAgICB2YXIgX3N1cGVyRW5kID0gdGhpcy5lbmQ7XHJcbiAgICB0aGlzLmVuZCA9IGZ1bmN0aW9uKHRvb2xraXQsIHBhcmFtcykge1xyXG4gICAgICB2YXIgbmMgPSB0b29sa2l0LmdldE5vZGVDb3VudCgpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5jOyBpKyspIHtcclxuICAgICAgICB2YXIgbiA9IHRvb2xraXQuZ2V0Tm9kZUF0KGkpO1xyXG4gICAgICAgIC8vIG9ubHkgcHJvY2VzcyBub2RlcyB0aGF0IGFyZSBub3QgUGFydCBub2RlcyAodGhlcmUgY291bGQgb2YgY291cnNlIGJlXHJcbiAgICAgICAgLy8gYSBtaWxsaW9uIHdheXMgb2YgZGV0ZXJtaW5pbmcgd2hhdCBpcyBhIFBhcnQgbm9kZS4uLmhlcmUgSSBqdXN0IHVzZVxyXG4gICAgICAgIC8vIGEgcnVkaW1lbnRhcnkgY29uc3RydWN0IGluIHRoZSBkYXRhKVxyXG4gICAgICAgIGlmIChuLmRhdGEucGFyZW50ID09IG51bGwpIHtcclxuICAgICAgICAgIF9vbmVTZXQobiwgcGFyYW1zLCB0b29sa2l0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9zdXBlckVuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcbiIsImNvbnN0IEFDVElPTlMgPSB7XHJcbiAgICBPUEVOX01BUDogJ21hcCcsXHJcbiAgICBPUEVOX1RSQUlOSU5HOiAnb3Blbl90cmFpbmluZycsXHJcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXHJcbiAgICBDT1BZX01BUDogJ2NvcHlfbWFwJyxcclxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcclxuICAgIEhPTUU6ICdob21lJyxcclxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxyXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICd0ZXJtcycsXHJcbiAgICBMT0dPVVQ6ICdsb2dvdXQnLFxyXG4gICAgRkVFREJBQ0s6ICdmZWVkYmFjaycsXHJcbiAgICBTSEFSRV9NQVA6ICdzaGFyZV9tYXAnLFxyXG4gICAgQ09VUlNFX0xJU1Q6ICdjb3Vyc2VfbGlzdCcsXHJcbiAgICBUUkFJTklOR1M6ICd0cmFpbmluZ3MnXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKEFDVElPTlMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBQ1RJT05TOyIsImNvbnN0IENBTlZBUyA9IHtcclxuICAgIExFRlQ6ICdsZWZ0JyxcclxuICAgIFJJR0hUOiAncmlnaHQnXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKENBTlZBUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENBTlZBUzsiLCJjb25zdCBDT05TVEFOVFMgPSB7XHJcblx0QUNUSU9OUzogcmVxdWlyZSgnLi9hY3Rpb25zJyksXHJcblx0Q0FOVkFTOiByZXF1aXJlKCcuL2NhbnZhcycpLFxyXG5cdERTUlA6IHJlcXVpcmUoJy4vZHNycCcpLFxyXG5cdEVESVRfU1RBVFVTOiByZXF1aXJlKCcuL2VkaXRTdGF0dXMnKSxcclxuXHRFTEVNRU5UUzogcmVxdWlyZSgnLi9lbGVtZW50cycpLFxyXG4gICAgRVZFTlRTOiByZXF1aXJlKCcuL2V2ZW50cycpLFxyXG4gICAgTk9USUZJQ0FUSU9OOiByZXF1aXJlKCcuL25vdGlmaWNhdGlvbicpLFxyXG5cdFBBR0VTOiByZXF1aXJlKCcuL3BhZ2VzJyksXHJcblx0Uk9VVEVTOiByZXF1aXJlKCcuL3JvdXRlcycpLFxyXG5cdFRBQlM6IHJlcXVpcmUoJy4vdGFicycpLFxyXG5cdFRBR1M6IHJlcXVpcmUoJy4vdGFncycpXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKENPTlNUQU5UUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENPTlNUQU5UUzsiLCJjb25zdCBEU1JQID0ge1xyXG5cdEQ6ICdEJyxcclxuXHRTOiAnUycsXHJcblx0UjogJ1InLFxyXG5cdFA6ICdQJ1xyXG59XHJcblxyXG5PYmplY3QuZnJlZXplKERTUlApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEU1JQOyIsImNvbnN0IHN0YXR1cyA9IHtcclxuICAgIExBU1RfVVBEQVRFRDogJycsXHJcbiAgICBSRUFEX09OTFk6ICdWaWV3IG9ubHknLFxyXG4gICAgU0FWSU5HOiAnU2F2aW5nLi4uJyxcclxuICAgIFNBVkVfT0s6ICdBbGwgY2hhbmdlcyBzYXZlZCcsXHJcbiAgICBTQVZFX0ZBSUxFRDogJ0NoYW5nZXMgY291bGQgbm90IGJlIHNhdmVkJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShzdGF0dXMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdGF0dXM7IiwiY29uc3QgRUxFTUVOVFMgPSB7XHJcbiAgICBBUFBfQ09OVEFJTkVSOiAnYXBwLWNvbnRhaW5lcicsXHJcbiAgICBNRVRBX1BST0dSRVNTOiAnbWV0YV9wcm9ncmVzcycsXHJcbiAgICBNRVRBX1BST0dSRVNTX05FWFQ6ICdtZXRhX3Byb2dyZXNzX25leHQnLFxyXG4gICAgTUVUQV9NT0RBTF9ESUFMT0dfQ09OVEFJTkVSOiAnbWV0YV9tb2RhbF9kaWFsb2dfY29udGFpbmVyJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShFTEVNRU5UUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVMRU1FTlRTOyIsImNvbnN0IEVWRU5UUyA9IHtcclxuXHRTSURFQkFSX09QRU46ICdzaWRlYmFyLW9wZW4nLFxyXG5cdFNJREVCQVJfQ0xPU0U6ICdzaWRlYmFyLWNsb3NlJyxcclxuXHRTSURFQkFSX1RPR0dMRTogJ3NpZGViYXItdG9nZ2xlJyxcclxuXHRQQUdFX05BTUU6ICdwYWdlTmFtZScsXHJcblx0TkFWOiAnbmF2JyxcclxuXHRNQVA6ICdtYXAnXHJcbn1cclxuXHJcbk9iamVjdC5mcmVlemUoRVZFTlRTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRVZFTlRTOyIsImNvbnN0IE5PVElGSUNBVElPTiA9IHtcclxuXHRNQVA6ICdtYXAnXHJcbn1cclxuXHJcbk9iamVjdC5mcmVlemUoTk9USUZJQ0FUSU9OKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTk9USUZJQ0FUSU9OOyIsImNvbnN0IEFDVElPTlMgPSByZXF1aXJlKCcuL2FjdGlvbnMuanMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuY29uc3QgUEFHRVMgPSB7XHJcbiAgICBNQVA6ICdtYXAnLFxyXG4gICAgTkVXX01BUDogJ25ld19tYXAnLFxyXG4gICAgQ09QWV9NQVA6ICdjb3B5X21hcCcsXHJcbiAgICBERUxFVEVfTUFQOiAnZGVsZXRlX21hcCcsXHJcbiAgICBNWV9NQVBTOiAnbXltYXBzJyxcclxuICAgIFRFUk1TX0FORF9DT05ESVRJT05TOiAndGVybXMnLFxyXG4gICAgSE9NRTogJ2hvbWUnLFxyXG4gICAgQ09VUlNFX0xJU1Q6ICdjb3Vyc2VfbGlzdCcsXHJcbiAgICBUUkFJTklOR1M6ICd0cmFpbmluZ3MnXHJcbn07XHJcblxyXG5fLmV4dGVuZCgpXHJcblxyXG5PYmplY3QuZnJlZXplKFBBR0VTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUEFHRVM7IiwiY29uc3QgUk9VVEVTID0ge1xyXG4gICAgTUFQU19MSVNUOiAnbWFwcy9saXN0LycsXHJcbiAgICBNQVBTX0RBVEE6ICdtYXBzL2RhdGEvJyxcclxuICAgIE1BUFNfTkVXX01BUDogJ21hcHMvbmV3LW1hcC8nLFxyXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICdtZXRhbWFwL3Rlcm1zLWFuZC1jb25kaXRpb25zLycsXHJcbiAgICBIT01FOiAnbWV0YW1hcC9ob21lLycsXHJcbiAgICBOT1RJRklDQVRJT05TOiAndXNlcnMvezB9L25vdGlmaWNhdGlvbnMnLFxyXG4gICAgQ09VUlNFX0xJU1Q6ICd0cmFpbmluZ3MvY291cnNlcy8nXHJcbn07XHJcblxyXG5PYmplY3QuZnJlZXplKFJPVVRFUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJPVVRFUzsiLCJjb25zdCBUQUJTID0ge1xyXG4gICAgVEFCX0lEX1BSRVNFTlRFUiA6ICdwcmVzZW50ZXItdGFiJyxcclxuICAgIFRBQl9JRF9BTkFMWVRJQ1NfTUFQIDogJ2FuYWx5dGljcy10YWItbWFwJyxcclxuICAgIFRBQl9JRF9BTkFMWVRJQ1NfVEhJTkcgOiAnYW5hbHl0aWNzLXRhYi10aGluZycsXHJcbiAgICBUQUJfSURfUEVSU1BFQ1RJVkVTIDogJ3BlcnNwZWN0aXZlcy10YWInLFxyXG4gICAgVEFCX0lEX0RJU1RJTkNUSU9OUyA6ICdkaXN0aW5jdGlvbnMtdGFiJyxcclxuICAgIFRBQl9JRF9BVFRBQ0hNRU5UUyA6ICdhdHRhY2htZW50cy10YWInLFxyXG4gICAgVEFCX0lEX0dFTkVSQVRPUiA6ICdnZW5lcmF0b3ItdGFiJyxcclxuICAgIFRBQl9JRF9TVEFOREFSRFMgOiAnc3RhbmRhcmRzLXRhYidcclxufTtcclxuT2JqZWN0LmZyZWV6ZShUQUJTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVEFCUzsiLCJjb25zdCBUQUdTID0ge1xyXG4gICAgTUVUQV9DQU5WQVM6ICdtZXRhLWNhbnZhcycsXHJcbiAgICBIT01FOiAnaG9tZScsXHJcbiAgICBURVJNUzogJ3Rlcm1zJyxcclxuICAgIE1ZX01BUFM6ICdteS1tYXBzJyxcclxuICAgIFNIQVJFOiAnc2hhcmUnLFxyXG4gICAgQ09VUlNFX0xJU1Q6ICdjb3Vyc2VfbGlzdCcsXHJcbiAgICBUUkFJTklORzogJ3RyYWluaW5nJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShUQUdTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVEFHUzsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBBZGRUaGlzIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcclxuICAgICAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgICAgICAgICAgdCA9IHdpbmRvdy5hZGR0aGlzIHx8IHt9O1xyXG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICAgICAganMuaWQgPSBpZDtcclxuICAgICAgICAgICAganMuc3JjID0gYC8vczcuYWRkdGhpcy5jb20vanMvMzAwL2FkZHRoaXNfd2lkZ2V0LmpzI3B1YmlkPSR7Y29uZmlnLnB1YmlkfWA7XHJcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuXHJcbiAgICAgICAgICAgIHQuX2UgPSBbXTtcclxuICAgICAgICAgICAgdC5yZWFkeSA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgICAgICAgICB0Ll9lLnB1c2goZik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9IChkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJhZGQtdGhpcy1qc1wiKSk7XHJcbiAgICAgICAgdGhpcy5hZGR0aGlzID0gd2luZG93LmFkZHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLmFkZHRoaXMgPSB0aGlzLmFkZHRoaXMgfHwgd2luZG93LmFkZHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWRkVGhpcztcclxuXHJcblxyXG4iLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBHb29nbGUgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcclxuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xyXG4gICAgfSkoKTtcclxuICAgICAgXHJcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcclxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAnZ3RtLnN0YXJ0JzpcclxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXHJcbiAgICAgIH0pOyBsZXQgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XHJcbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCB0aGlzLmNvbmZpZy50YWdtYW5hZ2VyKTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcclxuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcclxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcclxuICAgIHJldHVybiB0aGlzLmdhO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHN1cGVyLmluaXQoKTtcclxuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xyXG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG4gICAgaWYoZG9tYWluLnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XHJcbiAgICAgIG1vZGUgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdjcmVhdGUnLCB0aGlzLmNvbmZpZy5hbmFseXRpY3MsIG1vZGUpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcigpIHtcclxuICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsICd1c2VySWQnLCB0aGlzLnVzZXIudXNlcklkKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgaWYgKHNvdXJjZSAmJiB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCB2YWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xyXG4gICAgICAgICAgICBwYWdlOiBwYXRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRFdmVudChldmVudCwgc291cmNlLCB0eXBlLCB1cmwpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcclxuXHJcblxyXG4iLCJcclxuY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgVXNlclNuYXAgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgbGV0IGFwaUtleSwgcywgeDtcclxuICAgICAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uZmlnID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFwaUtleSA9IGNvbmZpZy5hcGk7XHJcbiAgICAgICAgaWYgKGFwaUtleSAmJiAhd2luZG93LmxvY2F0aW9uLmhvc3Quc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcclxuICAgICAgICAgICAgbGV0IHVzQ29uZiA9IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsQm94OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWxCb3hWYWx1ZTogdXNlci5lbWFpbCxcclxuICAgICAgICAgICAgICAgIGVtYWlsUmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlUmVjb3JkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdvb2dsZS5zZW5kRXZlbnQoJ2ZlZWRiYWNrJywgJ3VzZXJzbmFwJywgJ3dpZGdldCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0gd2luZG93Ll91c2Vyc25hcGNvbmZpZyA9IHVzQ29uZjtcclxuXHJcbiAgICAgICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XHJcbiAgICAgICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgICAgICB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gdGhpcy51c2VyU25hcCB8fCB3aW5kb3cuVXNlclNuYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlclNuYXA7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyU25hcDsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBZb3VUdWJlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cclxuICAgIHRhZy5zcmMgPSBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGlcIjtcclxuICAgIHZhciBmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgIGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRhZywgZmlyc3RTY3JpcHRUYWcpO1xyXG4gICAgd2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuWVQgPSB3aW5kb3cuWVRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgIHRoaXMuWVQgPSB0aGlzLllUIHx8IHdpbmRvdy5ZVDtcclxuICAgIHJldHVybiB0aGlzLllUO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHN1cGVyLmluaXQoKTtcclxuXHJcbiAgfVxyXG5cclxuICBzZXRVc2VyKCkge1xyXG4gICAgc3VwZXIuc2V0VXNlcigpO1xyXG5cclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xyXG5cclxuICB9XHJcblxyXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBZb3VUdWJlO1xyXG5cclxuXHJcbiIsImNsYXNzIEludGVncmF0aW9uc0Jhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XHJcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xyXG5cdH1cclxuXHRcclxuXHRpbml0KCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdGdldCBpbnRlZ3JhdGlvbigpIHtcclxuXHRcdHJldHVybiB7fTtcclxuXHR9XHJcblx0XHJcblx0c2V0VXNlcigpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRzZW5kRXZlbnQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRsb2dvdXQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zQmFzZTsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBHb29nbGUgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcclxuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xyXG4gICAgfSkoKTtcclxuICAgICAgXHJcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcclxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAnZ3RtLnN0YXJ0JzpcclxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXHJcbiAgICAgIH0pOyBsZXQgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XHJcbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCB0aGlzLmNvbmZpZy50YWdtYW5hZ2VyKTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcclxuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcclxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcclxuICAgIHJldHVybiB0aGlzLmdhO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHN1cGVyLmluaXQoKTtcclxuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xyXG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG4gICAgaWYoZG9tYWluLnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XHJcbiAgICAgIG1vZGUgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdjcmVhdGUnLCB0aGlzLmNvbmZpZy5hbmFseXRpY3MsIG1vZGUpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcigpIHtcclxuICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsICd1c2VySWQnLCB0aGlzLnVzZXIudXNlcklkKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgaWYgKHNvdXJjZSAmJiB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCB2YWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xyXG4gICAgICAgICAgICBwYWdlOiBwYXRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRFdmVudChldmVudCwgc291cmNlLCB0eXBlLCB1cmwpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcclxuXHJcblxyXG4iLCJjb25zdCByaW90ID0gd2luZG93LnJpb3RcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xyXG5jb25zdCBwYWdlQm9keSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZS1ib2R5LmpzJylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbmNvbnN0IEFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FjdGlvbi5qcycpXHJcbmNvbnN0IE1ldHJvbmljID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvbWV0cm9uaWMnKVxyXG5jb25zdCBMYXlvdXQgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9sYXlvdXQnKVxyXG5jb25zdCBEZW1vID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvZGVtbycpXHJcbmNvbnN0IFF1aWNrU2lkZWJhciA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL3F1aWNrLXNpZGViYXInKVxyXG5cclxuY2xhc3MgUGFnZUZhY3Rvcnkge1xyXG4gICAgY29uc3RydWN0b3IoZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBuZXcgQWN0aW9ucyhtZXRhRmlyZSwgZXZlbnRlciwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTfWApLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudCgnKicpO1xyXG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmNvbmZpZ3VyZSh7IHBhcmVudDogYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTX05FWFR9YCB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0KCk7IC8vIGluaXQgbWV0cm9uaWMgY29yZSBjb21wb25ldHNcclxuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdCgpOyAvLyBpbml0IGxheW91dFxyXG4gICAgICAgICAgICAgICAgICAgIERlbW8uaW5pdCgpOyAvLyBpbml0IGRlbW8gZmVhdHVyZXNcclxuICAgICAgICAgICAgICAgICAgICBRdWlja1NpZGViYXIuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcclxuICAgICAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZShwYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBsZXQgYWN0ID0gdGhpcy5hY3Rpb25zLmFjdChwYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIGlmICghYWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhwYXRoLCBwYXRoLCB7IGlkOiBpZCwgYWN0aW9uOiBhY3Rpb24gfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFnZUZhY3Rvcnk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzXHJcbmNvbnN0IENhbnZhcyA9IHJlcXVpcmUoJy4uLy4uL2NhbnZhcy9jYW52YXMnKVxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxucmVxdWlyZSgnLi9ub2RlJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0IGp0ay1kZW1vLW1haW5cIiBzdHlsZT1cInBhZGRpbmc6IDA7IFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImp0ay1kZW1vLWNhbnZhcyBjYW52YXMtd2lkZVwiIGlkPVwiZGlhZ3JhbVwiPlxyXG5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ21ldGEtY2FudmFzJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcblxyXG4gICAgdGhpcy5tYXBJZCA9IG51bGw7XHJcbiAgICB0aGlzLmNhbnZhcyA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5idWlsZENhbnZhcyA9IChtYXApID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FudmFzKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5kaWFncmFtKS5lbXB0eSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgQ2FudmFzKG1hcCwgdGhpcy5tYXBJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmluaXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobWFwLmNoYW5nZWRfYnkgIT0gTWV0YU1hcC5Vc2VyLnVzZXJLZXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmluaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYnVpbGQgPSAob3B0cykgPT4ge1xyXG4gICAgICAgIGlmIChvcHRzLmlkICE9IHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBudWxsXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcElkKSB7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9mZihgbWFwcy9kYXRhLyR7dGhpcy5tYXBJZH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1hcElkID0gb3B0cy5pZDtcclxuICAgICAgICAgICAgTlByb2dyZXNzLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGBtYXBzL2RhdGEvJHtvcHRzLmlkfWAsIHRoaXMuYnVpbGRDYW52YXMpO1xyXG4gICAgICAgICAgICBNZXRhTWFwLkV2ZW50ZXIuZm9yZ2V0KENPTlNUQU5UUy5FVkVOVFMuTUFQLCB0aGlzLmJ1aWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KENPTlNUQU5UUy5FVkVOVFMuTUFQLCB0aGlzLmJ1aWxkKTtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RIZWlnaHQgPSAoKSA9PiB7XHJcbiAgICAgICAgJCh0aGlzLmRpYWdyYW0pLmNzcyh7XHJcbiAgICAgICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IC0gMTIwICsgJ3B4J1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY29ycmVjdEhlaWdodCgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IEVkaXRvciA9IHJlcXVpcmUoJy4uLy4uL2NhbnZhcy9jYW52YXMnKTtcclxuXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG5gXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdub2RlJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxuY29uc3QgUHMgPSByZXF1aXJlKCdwZXJmZWN0LXNjcm9sbGJhcicpO1xuXG5jb25zdCByYXcgPSByZXF1aXJlKCcuL3JhdycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jb25zdCBodG1sID1cblx0YFxuPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmF2LWp1c3RpZmllZFwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdi10YWJzIG5hdi1qdXN0aWZpZWRcIj5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJhY3RpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNxdWlja19zaWRlYmFyX3RhYl8xXCIgZGF0YS10b2dnbGU9XCJ0YWJcIj5cbiAgICAgICAgICAgICAgICAgICAgQ29ydGV4IE1hblxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjcXVpY2tfc2lkZWJhcl90YWJfMlwiIGRhdGEtdG9nZ2xlPVwidGFiXCI+XG4gICAgICAgICAgICAgICAgICAgIE91dGxpbmVcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1wYW5lIGFjdGl2ZSBwYWdlLXF1aWNrLXNpZGViYXItY2hhdCBwYWdlLXF1aWNrLXNpZGViYXItY29udGVudC1pdGVtLXNob3duXCIgaWQ9XCJxdWlja19zaWRlYmFyX3RhYl8xXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2Vyc1wiIGRhdGEtcmFpbC1jb2xvcj1cIiNkZGRcIiBkYXRhLXdyYXBwZXItY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyLW1lc3NhZ2VzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgbWVzc2FnZXMgfVwiIGNsYXNzPVwicG9zdCB7IG91dDogYXV0aG9yID09ICdjb3J0ZXgnLCBpbjogYXV0aG9yICE9ICdjb3J0ZXgnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgaGVpZ2h0PVwiMzlcIiB3aWR0aD1cIjM5XCIgY2xhc3M9XCJhdmF0YXJcIiBhbHQ9XCJcIiBzcmM9XCJ7IHBpY3R1cmUgfVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhcnJvd1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJuYW1lXCI+eyBuYW1lIH08L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkYXRldGltZVwiPnsgcGFyZW50LmdldFJlbGF0aXZlVGltZSh0aW1lKSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgbWVzc2FnZSB9XCI+PC9yYXc+IDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1mb3JtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiY2hhdF9pbnB1dF9mb3JtXCIgb25zdWJtaXQ9XCJ7IG9uU3VibWl0IH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNoYXRfaW5wdXRcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJUeXBlIGEgbWVzc2FnZSBoZXJlLi4uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBibHVlXCI+PGkgY2xhc3M9XCJmYSBmYS1wYXBlcmNsaXBcIj48L2k+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItcGFuZSBwYWdlLXF1aWNrLXNpZGViYXItYWxlcnRzXCIgaWQ9XCJxdWlja19zaWRlYmFyX3RhYl8yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItYWxlcnRzLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cImxpc3QtaGVhZGluZ1wiPkludHJvPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cImxpc3QtaGVhZGluZ1wiPlNlY3Rpb24gMTwvaDM+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gXG5cbnJpb3QudGFnKCdxdWljay1zaWRlYmFyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG5cdHRoaXMuY29ydGV4UGljdHVyZSA9ICdzcmMvaW1hZ2VzL2NvcnRleC1hdmF0YXItc21hbGwuanBnJztcblx0dGhpcy5tZXNzYWdlcyA9IFt7XG5cdFx0bWVzc2FnZTogYEhlbGxvLCBJJ20gQ29ydGV4IE1hbi4gQXNrIG1lIGFueXRoaW5nLiBUcnkgPGNvZGU+L2hlbHA8L2NvZGU+IGlmIHlvdSBnZXQgbG9zdC5gLFxuXHRcdGF1dGhvcjogJ2NvcnRleCcsXG5cdFx0cGljdHVyZTogdGhpcy5jb3J0ZXhQaWN0dXJlLFxuXHRcdHRpbWU6IG5ldyBEYXRlKClcblx0fV07XG5cblx0Y29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKTtcblxuXHR0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7fSk7XG5cblx0dGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG5cblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHR9KTtcblxuXHR0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XG5cdFx0aWYgKCF0aGlzLmRpc3BsYXkpIHtcblx0XHRcdHJldHVybiAnZGlzcGxheTogbm9uZTsnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5nZXRSZWxhdGl2ZVRpbWUgPSAoZGF0ZSA9IG5ldyBEYXRlKCkpID0+IHtcblx0XHRyZXR1cm4gbW9tZW50KGRhdGUpLmZyb21Ob3coKTtcblx0fVxuXG5cdHRoaXMub25TdWJtaXQgPSAob2JqKSA9PiB7XG5cdFx0dGhpcy5tZXNzYWdlcy5wdXNoKHtcblx0XHRcdG1lc3NhZ2U6IHRoaXMuY2hhdF9pbnB1dC52YWx1ZSxcblx0XHRcdGF1dGhvcjogTWV0YU1hcC5Vc2VyLnVzZXJOYW1lLFxuXHRcdFx0cGljdHVyZTogTWV0YU1hcC5Vc2VyLnBpY3R1cmUsXG5cdFx0XHR0aW1lOiBuZXcgRGF0ZSgpXG5cdFx0fSlcblx0XHR0aGlzLm1lc3NhZ2VzLnB1c2goe1xuXHRcdFx0bWVzc2FnZTogYFlvdSBhc2tlZCBtZSAke3RoaXMuY2hhdF9pbnB1dC52YWx1ZX0uIFRoYXQncyBncmVhdCFgLFxuXHRcdFx0YXV0aG9yOiAnY29ydGV4Jyxcblx0XHRcdHBpY3R1cmU6IHRoaXMuY29ydGV4UGljdHVyZSxcblx0XHRcdHRpbWU6IG5ldyBEYXRlKClcblx0XHR9KVxuXHRcdHRoaXMuY2hhdF9pbnB1dC52YWx1ZSA9ICcnXG5cdFx0dGhpcy51cGRhdGUoKTtcblx0XHR0aGlzLmNoYXRfYm9keS5zY3JvbGxUb3AgPSB0aGlzLmNoYXRfYm9keS5zY3JvbGxIZWlnaHRcblx0XHRQcy51cGRhdGUodGhpcy5jaGF0X2JvZHkpXG5cdH1cblxuXHR0aGlzLnRvZ2dsZSA9IChzdGF0ZSkgPT4ge1xuXHRcdHRoaXMuZGlzcGxheSA9IHN0YXRlO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdH1cblxufSk7XG4iLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ3R5cGVhaGVhZC5qcycpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1zZWxlY3QnKVxyXG5cclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbnJlcXVpcmUoJy4uLy4uL3Rvb2xzL3NoaW1zJyk7XHJcbmNvbnN0IFNoYXJpbmcgPSByZXF1aXJlKCcuLi8uLi9hcHAvU2hhcmluZycpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwic2hhcmVfbW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBpZD1cInNoYXJlX3B1YmxpY19saW5rXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImZsb2F0OiByaWdodDsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtY2xpcGJvYXJkLXRleHQ9XCJ7d2luZG93LmxvY2F0aW9uLmhvc3QrJy8nK3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSsnL21hcHMvJytvcHRzLm1hcC5pZH1cIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IGdldFB1YmxpY0xpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBHZXQgc2hhcmFibGUgbGluayAgPGkgY2xhc3M9XCJmYSBmYS1saW5rXCI+PC9pPjwvYT5cclxuICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+U2hhcmUgd2l0aCBvdGhlcnM8L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxwPlBlb3BsZTwvcD5cclxuICAgICAgICAgICAgICAgIDxmb3JtIHJvbGU9XCJmb3JtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic2hhcmVfdHlwZWFoZWFkXCIgY2xhc3M9XCJjb2wtbWQtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHN0eWxlPVwiaGVpZ2h0OiAzNXB4O1wiIGlkPVwic2hhcmVfaW5wdXRcIiBjbGFzcz1cInR5cGVhaGVhZCBmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgbmFtZXMgb3IgZW1haWwgYWRkcmVzc2VzLi4uXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwic2hhcmVfcGVybWlzc2lvblwiIGNsYXNzPVwic2VsZWN0cGlja2VyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmVhZFwiIGRhdGEtY29udGVudD1cIjxzcGFuPjxpIGNsYXNzPSdmYSBmYS1leWUnPjwvaT4gQ2FuIHZpZXc8L3NwYW4+XCI+Q2FuIHZpZXc8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3cml0ZVwiIGRhdGEtY29udGVudD1cIjxzcGFuPjxpIGNsYXNzPSdmYSBmYS1wZW5jaWwnPjwvaT4gQ2FuIGVkaXQ8L3NwYW4+XCI+Q2FuIGVkaXQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlkPVwic2hhcmVfYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWljb24tb25seSBncmVlblwiIG9uY2xpY2s9XCJ7IG9uU2hhcmUgfVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWY9XCJ7IG9wdHMgJiYgb3B0cy5tYXAgJiYgb3B0cy5tYXAuc2hhcmVkX3dpdGh9XCIgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibGFiZWwgbGFiZWwtZGVmYXVsdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDVweDtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmPVwieyBpICE9ICdhZG1pbicgJiYgKHZhbC53cml0ZSB8fCB2YWwucmVhZCkgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgaSwgdmFsIGluIG9wdHMubWFwLnNoYXJlZF93aXRofVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGlmPVwieyB2YWwud3JpdGUgfVwiIGNsYXNzPVwiZmEgZmEtcGVuY2lsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGlmPVwieyAhdmFsLndyaXRlIH1cIiBjbGFzcz1cImZhIGZhLWV5ZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHZhbC5uYW1lIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZhIGZhLXRpbWVzLWNpcmNsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vblVuU2hhcmUgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkRvbmU8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdzaGFyZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKVxyXG4gICAgY29uc3Qgc2hhcmUgPSBuZXcgU2hhcmluZyhNZXRhTWFwLlVzZXIpXHJcblxyXG4gICAgdGhpcy5kYXRhID0gW107XHJcblxyXG4gICAgdGhpcy5nZXRQdWJsaWNMaW5rID0gKGUsIG9wdHMpID0+IHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uU2hhcmUgPSAoZSwgb3B0cykgPT4ge1xyXG4gICAgICAgIHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5zdWdnZXN0aW9uLmlkXSA9IHtcclxuICAgICAgICAgICAgcmVhZDogdGhpcy5waWNrZXIudmFsKCkgPT0gJ3JlYWQnIHx8IHRoaXMucGlja2VyLnZhbCgpID09ICd3cml0ZScsXHJcbiAgICAgICAgICAgIHdyaXRlOiB0aGlzLnBpY2tlci52YWwoKSA9PSAnd3JpdGUnLFxyXG4gICAgICAgICAgICBuYW1lOiB0aGlzLnN1Z2dlc3Rpb24ubmFtZSxcclxuICAgICAgICAgICAgcGljdHVyZTogdGhpcy5zdWdnZXN0aW9uLnBpY3R1cmVcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcmUuYWRkU2hhcmUodGhpcy5vcHRzLm1hcCwgdGhpcy5zdWdnZXN0aW9uLCB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW3RoaXMuc3VnZ2VzdGlvbi5pZF0pXHJcblxyXG4gICAgICAgIHRoaXMuc3VnZ2VzdGlvbiA9IG51bGxcclxuICAgICAgICB0aGlzLnRhLnR5cGVhaGVhZCgndmFsJywgJycpXHJcbiAgICAgICAgJCh0aGlzLnNoYXJlX2J1dHRvbikuaGlkZSgpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblVuU2hhcmUgPSAoZSwgb3B0cykgPT4ge1xyXG4gICAgICAgIGUuaXRlbS52YWwuaWQgPSBlLml0ZW0uaVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW2UuaXRlbS5pXVxyXG4gICAgICAgIHNoYXJlLnJlbW92ZVNoYXJlKHRoaXMub3B0cy5tYXAsIGUuaXRlbS52YWwpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKG9wdHMpID0+IHtcclxuICAgICAgICBpZiAob3B0cykge1xyXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLm9wdHMsIG9wdHMpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoZSwgb3B0cykgPT4ge1xyXG4gICAgICAgICQodGhpcy5zaGFyZV9tb2RhbCkubW9kYWwoJ3Nob3cnKVxyXG4gICAgICAgIHRoaXMudGEgPSAkKCcjc2hhcmVfdHlwZWFoZWFkIC50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgICBoaWdobGlnaHQ6IHRydWVcclxuICAgICAgICB9LHtcclxuICAgICAgICAgICAgc291cmNlOiAocXVlcnksIHN5bmNNZXRob2QsIGFzeW5jTWV0aG9kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWV0YW1hcC5jby91c2Vycy9maW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSgge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcklkOiBNZXRhTWFwLlVzZXIudXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uSWQ6IE1ldGFNYXAuTWV0YUZpcmUuZmlyZWJhc2VfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkVXNlcnM6IF8ua2V5cyh0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBxdWVyeVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnKicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWN0dXJlOiAnc3JjL2ltYWdlcy93b3JsZC1nbG9iZS5qcGcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1B1YmxpYydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNNZXRob2QoZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yIDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXNwbGF5OiAob2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLm5hbWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlczoge1xyXG4gICAgICAgICAgICAgICAgZW1wdHk6IFtcclxuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwicGFkZGluZzogNXB4IDEwcHg7IHRleHQtYWxpZ246IGNlbnRlcjtcIj4nLFxyXG4gICAgICAgICAgICAgICAgICAgICdVbmFibGUgdG8gZmluZCBhbnkgdXNlcnMgbWF0Y2hpbmcgdGhpcyBxdWVyeScsXHJcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgXS5qb2luKCdcXG4nKSxcclxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb246ICh2YWx1ZSkgPT4geyByZXR1cm4gYDxkaXY+PGltZyBhbHQ9XCIke3ZhbHVlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHt2YWx1ZS5waWN0dXJlfVwiPiAke3ZhbHVlLm5hbWV9PC9kaXY+YCB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGEub24oJ3R5cGVhaGVhZDpzZWxlY3QnLCAoZXYsIHN1Z2dlc3Rpb24pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gc3VnZ2VzdGlvblxyXG4gICAgICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5zaG93KClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGEub24oJ3R5cGVhaGVhZDphdXRvY29tcGxldGUnLCAoZXYsIHN1Z2dlc3Rpb24pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gc3VnZ2VzdGlvblxyXG4gICAgICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5zaG93KClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMucGlja2VyID0gJCgnLnNlbGVjdHBpY2tlcicpLnNlbGVjdHBpY2tlcih7XHJcbiAgICAgICAgICAgIHdpZHRoOiAnYXV0bydcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ncmFkdWF0aW9uLWNhcFwiPjwvaT5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjcwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBoZWxwIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBoZWxwIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtaGVscCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGVscCA9IG51bGw7XHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2hlbHAnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhlbHAgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxucmVxdWlyZSgnLi4vLi4vdG9vbHMvc2hpbXMnKVxyXG5cclxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCJcclxuICAgICAgICAgICAgICAgICBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXHJcbiAgICAgICAgICAgICAgICAgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCJcclxuICAgICAgICAgICAgICAgICBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWJlbGwtb1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBub3RpZmljYXRpb25zLmxlbmd0aCB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV4dGVybmFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IG5vdGlmaWNhdGlvbnMubGVuZ3RoIH0gcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9ueyBzOiBub3RpZmljYXRpb25zLmxlbmd0aCA9PSAwIHx8IG5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyBhbGxOb3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyB0cnVlICE9IGFyY2hpdmVkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IHZhbCwgaSBpbiBub3RpZmljYXRpb25zIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWY9XCJ7IHZhbC5waG90byAhPSBudWxsIH1cIiBjbGFzcz1cInBob3RvXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJ7dmFsLnBob3RvfVwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIGFsdD1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3ViamVjdFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZnJvbVwiPnsgdmFsLmZyb20gfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInRpbWVcIiBzdHlsZT1cInBhZGRpbmc6IDA7XCI+eyBwYXJlbnQuZ2V0VGltZSh2YWwudGltZSkgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1lc3NhZ2VcIj57IHZhbC5ldmVudCB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1ub3RpZmljYXRpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgY29uc3QgZmJQYXRoID0gQ09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdChNZXRhTWFwLlVzZXIudXNlcklkKVxyXG5cclxuICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IFtdO1xyXG4gICAgdGhpcy5hbGxOb3RpZmljYXRpb25zID0gW107XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICBsZXQgaXRlbSA9IGV2ZW50Lml0ZW0udmFsXHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHRydWUsIGAke2ZiUGF0aH0vJHtpdGVtLmlkfS9hcmNoaXZlYClcclxuICAgICAgICBzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5OT1RJRklDQVRJT04uTUFQOlxyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2l0ZW0ubWFwSWR9YCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRUaW1lID0gKHRpbWUpID0+IHtcclxuICAgICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKHRpbWUpKS5mcm9tTm93KClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldERhdGEoZmJQYXRoKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5wdXNoRGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiAnWW91IHNpZ25lZCB1cCBmb3IgTWV0YU1hcCEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBgJHtuZXcgRGF0ZSgpIH1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNoaXZlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZiUGF0aClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdChNZXRhTWFwLlVzZXIudXNlcklkKSwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbE5vdGlmaWNhdGlvbnMgPSBfLm1hcChkYXRhLCAobiwgaWQpID0+IHsgbi5pZCA9IGlkOyByZXR1cm4gbjsgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IF8uZmlsdGVyKF8uc29ydEJ5KHRoaXMuYWxsTm90aWZpY2F0aW9ucywgJ2RhdGUnKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxyXG5cclxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS10cm9waHlcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgcG9pbnRzLmxlbmd0aCB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV4dGVybmFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IHBvaW50cy5sZW5ndGggfSBuZXcgPC9zcGFuPiBhY2hpZXZlbWVudHsgczogcG9pbnRzLmxlbmd0aCA9PSAwIHx8IHBvaW50cy5sZW5ndGggPiAxIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPnZpZXcgYWxsPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IHBvaW50cyB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBwb2ludHMgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lXCI+eyB0aW1lIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC1pY29uIGxhYmVsLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGV2ZW50IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1wb2ludHMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgdXNlcnMvJHtNZXRhTWFwLlVzZXIudXNlcklkfS9wb2ludHNgLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50cyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidXNlcm5hbWUgdXNlcm5hbWUtaGlkZS1vbi1tb2JpbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VybmFtZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgaWY9XCJ7IHBpY3R1cmUgfVwiIGFsdD1cIlwiIGhlaWdodD1cIjM5XCIgd2lkdGg9XCIzOVwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cInsgcGljdHVyZSB9XCIgLz5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBtZW51IH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBtZW51IH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuYDtcclxuXHJcbnJpb3QudGFnKCdtZXRhLXVzZXInLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcblxyXG4gICAgdGhpcy5tZW51ID0gW107XHJcbiAgICB0aGlzLnVzZXJuYW1lID0gJyc7XHJcbiAgICB0aGlzLnBpY3R1cmUgPSAnJztcclxuXHJcbiAgICB0aGlzLmxvZ291dCA9ICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLmxvZ291dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGlua0FjY291bnQgPSAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5BdXRoMC5saW5rQWNjb3VudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgc3dpdGNoKGV2ZW50Lml0ZW0ubGluaykge1xyXG4gICAgICAgICAgICBjYXNlICcjbGluay1zb2NpYWwtYWNjb3VudHMnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5saW5rQWNjb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGBtZXRhbWFwL3VzZXJgLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJuYW1lID0gTWV0YU1hcC5Vc2VyLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgICAgICB0aGlzLnBpY3R1cmUgPSBNZXRhTWFwLlVzZXIucGljdHVyZTtcclxuICAgICAgICAgICAgdGhpcy5tZW51ID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxyXG5cclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbnJlcXVpcmUoJy4uL3Rvb2xzL3NoaW1zJyk7XHJcbmNvbnN0IFBlcm1pc3Npb25zID0gcmVxdWlyZSgnLi4vYXBwL1Blcm1pc3Npb25zJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWFjdGlvbnNcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biByZWQtaGF6ZSBidG4tc20gZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImhpZGRlbi1zbSBoaWRkZW4teHNcIj5BY3Rpb25zJm5ic3A7PC9zcGFuPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XHJcbiAgICAgICAgICAgIDxsaSBlYWNoPVwieyB2YWwsIGkgaW4gZGF0YSB9XCIgY2xhc3M9XCJ7IHN0YXJ0OiBpID09IDAsIGFjdGl2ZTogaSA9PSAwIH1cIj5cclxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBwYXJlbnQuZ2V0TGlua0FsbG93ZWQodmFsKSB9XCIgaHJlZj1cInsgcGFyZW50LmdldEFjdGlvbkxpbmsodmFsKSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IHZhbC5pY29uIH1cIj48L2k+IHsgdmFsLnRpdGxlIH1cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+XHJcbiAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjc2V0dGluZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdlYXJcIj48L2k+IFNldHRpbmdzXHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxzcGFuIHN0eWxlPVwicGFkZGluZy1sZWZ0OiA1cHg7XCI+XHJcbiAgICAgICAgPHNwYW4gaWY9XCJ7IHBhZ2VOYW1lIH1cIlxyXG4gICAgICAgICAgICAgICAgaWQ9XCJtYXBfbmFtZVwiXHJcbiAgICAgICAgICAgICAgICBkYXRhLXR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgIGRhdGEtdGl0bGU9XCJFbnRlciBtYXAgbmFtZVwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+XHJcbiAgICAgICAgICAgIHsgcGFnZU5hbWUgfVxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgIDwvc3Bhbj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWFjdGlvbnMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5kYXRhID0gW107XHJcbiAgICB0aGlzLnBhZ2VOYW1lID0gJ0hvbWUnO1xyXG4gICAgdGhpcy51cmwgPSBNZXRhTWFwLmNvbmZpZy5zaXRlLmRiICsgJy5maXJlYmFzZWlvLmNvbSc7XHJcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBwZXJtaXNzaW9ucyA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5nZXRBY3Rpb25MaW5rID0gKG9iaikgPT4ge1xyXG4gICAgICAgIGxldCByZXQgPSBvYmoubGluaztcclxuICAgICAgICBpZiAob2JqLnVybF9wYXJhbXMpIHtcclxuICAgICAgICAgICAgbGV0IGFyZ3MgPSBbXTtcclxuICAgICAgICAgICAgXy5lYWNoKG9iai51cmxfcGFyYW1zLCAocHJtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2godGhpc1twcm0ubmFtZV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0ID0gb2JqLmxpbmsuZm9ybWF0LmNhbGwob2JqLmxpbmssIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0TGlua0FsbG93ZWQgPSAob2JqKSA9PiB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bJyonXTtcclxuICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFBhZ2UgPSBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aDtcclxuICAgICAgICAgICAgcmV0ID0gdHJ1ZSA9PSBvYmpbJ2FsbG93ZWQtb24nXVtjdXJyZW50UGFnZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXQgJiYgdGhpcy5tYXAgJiYgcGVybWlzc2lvbnMpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChvYmoudGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1NoYXJlIE1hcCc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICdEZWxldGUgTWFwJzpcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSBwZXJtaXNzaW9ucy5pc01hcE93bmVyKClcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlUGFnZU5hbWUgPSAobWFwKSA9PiB7XHJcbiAgICAgICAgcGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMobWFwKVxyXG4gICAgICAgIHRoaXMubWFwID0gbWFwIHx8IHt9XHJcbiAgICAgICAgaWYgKHBlcm1pc3Npb25zLmlzTWFwT3duZXIoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbWFwLm5hbWUgfHwgJydcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbWFwLm5hbWUgKyAnIChTaGFyZWQgYnkgJyArIG1hcC5vd25lci5uYW1lICsgJyknXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwZXJtaXNzaW9ucyAmJiBwZXJtaXNzaW9ucy5pc01hcE93bmVyKCkpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfS9uYW1lYCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIuZXZlcnkoJ3BhZ2VOYW1lJywgKG9wdHMpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5sb2FkZWQpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9mZihgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfWApO1xyXG4gICAgICAgICAgICB0aGlzLm1hcElkID0gbnVsbFxyXG4gICAgICAgICAgICB0aGlzLm1hcCA9IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdHMuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7b3B0cy5pZH1gLCAobWFwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VOYW1lKG1hcClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFnZU5hbWUgPSBvcHRzLm5hbWUgfHwgJ0hvbWUnO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2FjdGlvbnMnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBwYWdlSGVhZGVyID0gcmVxdWlyZSgnLi9wYWdlLWhlYWRlcicpO1xyXG5jb25zdCBwYWdlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRhaW5lcicpO1xyXG5jb25zdCBwYWdlRm9vdGVyID0gcmVxdWlyZSgnLi9wYWdlLWZvb3RlcicpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwicGFnZV9ib2R5XCIgY2xhc3M9XCJwYWdlLWhlYWRlci1maXhlZCBwYWdlLXNpZGViYXItcmV2ZXJzZWRcIj5cclxuXHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2hlYWRlclwiPjwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250YWluZXJcIj48L2Rpdj5cclxuXHJcbjwvZGl2PmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWJvZHknLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2hlYWRlciwgJ3BhZ2UtaGVhZGVyJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250YWluZXIsICdwYWdlLWNvbnRhaW5lcicpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBwYWdlU2lkZWJhciA9IHJlcXVpcmUoJy4vcGFnZS1zaWRlYmFyJyk7XHJcbmNvbnN0IHBhZ2VDb250ZW50ID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRlbnQnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRhaW5lclwiPlxyXG5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfY29udGVudFwiPjwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY29udGFpbmVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250ZW50LCAncGFnZS1jb250ZW50Jyk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9xdWljay1zaWRlYmFyJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRlbnQtd3JhcHBlclwiPlxyXG4gICAgPGRpdiBpZD1cInBhZ2UtY29udGVudFwiIGNsYXNzPVwicGFnZS1jb250ZW50XCI+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWhlYWRcIj48L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cImFwcC1jb250YWluZXJcIj48L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cInF1aWNrX3NpZGViYXJfY29udGFpbmVyXCI+PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWNvbnRlbnQnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLnF1aWNrX3NpZGViYXJfY29udGFpbmVyLCAncXVpY2stc2lkZWJhcicpXHJcbiAgICAgICAgdGhpcy5yZXNpemUoKVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLnJlc2l6ZSA9ICgpID0+IHtcclxuICAgICAgICBsZXQgd2lkdGggPSBgJHt3aW5kb3cuaW5uZXJXaWR0aCAtIDQwfXB4YDtcclxuICAgICAgICAkKHRoaXNbJ2FwcC1jb250YWluZXInXSkuY3NzKHsgd2lkdGg6IHdpZHRoIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzaXplKClcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWZvb3RlclwiIHN0eWxlPVwicG9zaXRpb246IGZpeGVkOyBib3R0b206IDA7XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1mb290ZXItaW5uZXJcIj5cclxuICAgICAgICA8YSBocmVmPVwiI3Rlcm1zXCI+JmNvcHk7MjAxNTwvYT5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IHBhZ2VMb2dvID0gcmVxdWlyZSgnLi9wYWdlLWxvZ28uanMnKTtcclxuY29uc3QgcGFnZUFjdGlvbnMgPSByZXF1aXJlKCcuL3BhZ2UtYWN0aW9ucy5qcycpO1xyXG5jb25zdCBwYWdlU2VhcmNoID0gcmVxdWlyZSgnLi9wYWdlLXNlYXJjaC5qcycpO1xyXG5jb25zdCBwYWdlVG9wTWVudSA9IHJlcXVpcmUoJy4vcGFnZS10b3BtZW51Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwiaGVhZGVyLXRvcFwiIGNsYXNzPVwicGFnZS1oZWFkZXIgbmF2YmFyIG5hdmJhci1maXhlZC10b3BcIj5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3Byb2dyZXNzX25leHRcIiBzdHlsZT1cIm92ZXJmbG93OiBpbmhlcml0O1wiPjwvZGl2PlxyXG4gICAgPGRpdiBpZD1cImhlYWRlci1jb250ZW50XCIgY2xhc3M9XCJwYWdlLWhlYWRlci1pbm5lclwiPlxyXG5cclxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2xvZ29cIj48L2Rpdj5cclxuICAgICAgICBcclxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2FjdGlvbnNcIj48L2Rpdj5cclxuICAgICAgICBcclxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcFwiIGNsYXNzPVwicGFnZS10b3BcIj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9zZWFyY2hcIj48L2Rpdj5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfdG9wbWVudVwiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWhlYWRlcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfbG9nbywgJ3BhZ2UtbG9nbycpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfYWN0aW9ucywgJ3BhZ2UtYWN0aW9ucycpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfdG9wLCAncGFnZS1zZWFyY2gnKTtcclxuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3RvcCwgJ3BhZ2UtdG9wbWVudScpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzID1cInBhZ2UtbG9nb1wiPlxyXG4gICAgPGEgaWQ9XCJtZXRhX2xvZ29cIiBocmVmPVwiI2hvbWVcIj5cclxuICAgICAgICA8aW1nIHNyYz1cInNyYy9pbWFnZXMvbWV0YW1hcF9jbG91ZC5wbmdcIiBhbHQ9XCJsb2dvXCIgY2xhc3MgPVwibG9nby1kZWZhdWx0XCIgLz5cclxuICAgIDwvYT5cclxuXHJcbiAgICA8ZGl2IGlkPVwibWV0YV9tZW51X3RvZ2dsZVwiIGNsYXNzPVwibWVudS10b2dnbGVyIHNpZGViYXItdG9nZ2xlciBxdWljay1zaWRlYmFyLXRvZ2dsZXJcIiBvbmNsaWNrPVwieyBvbkNsaWNrIH1cIiBzdHlsZT1cInZpc2liaWxpdHk6eyBnZXREaXNwbGF5KCkgfTtcIj5cclxuICAgICAgICA8IS0tRE9DOiBSZW1vdmUgdGhlIGFib3ZlIFwiaGlkZVwiIHRvIGVuYWJsZSB0aGUgc2lkZWJhciB0b2dnbGVyIGJ1dHRvbiBvbiBoZWFkZXItLT5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzID1cIm1lbnUtdG9nZ2xlciByZXNwb25zaXZlLXRvZ2dsZXJcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+XHJcbjwvYT5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtbG9nbycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9ICgpID0+IHtcclxuICAgICAgIC8vIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoZWwpID0+IHtcclxuXHJcbiAgICAgICAgaWYoTWV0YU1hcCAmJiBNZXRhTWFwLlJvdXRlciAmJiBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aCA9PSBDT05TVEFOVFMuUEFHRVMuVFJBSU5JTkdTKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAndmlzaWJsZSdcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2hpZGRlbidcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfSlcclxuXHJcbi8vXHJcbi8vICAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbi8vICAgICAgICAgdGhpcy5kaXNwbGF5ID0gZmFsc2U7XHJcbi8vICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuLy8gICAgIH0pO1xyXG4vL1xyXG4vL1xyXG4vLyAgICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XHJcbi8vICAgICAgICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcclxuLy8gICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4vLyAgICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPCEtLSBET0M6IEFwcGx5IFwic2VhcmNoLWZvcm0tZXhwYW5kZWRcIiByaWdodCBhZnRlciB0aGUgXCJzZWFyY2gtZm9ybVwiIGNsYXNzIHRvIGhhdmUgaGFsZiBleHBhbmRlZCBzZWFyY2ggYm94IC0tPlxyXG48Zm9ybSBjbGFzcz1cInNlYXJjaC1mb3JtXCIgYWN0aW9uPVwiZXh0cmFfc2VhcmNoLmh0bWxcIiBtZXRob2Q9XCJHRVRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2guLi5cIiBuYW1lPVwicXVlcnlcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0biBzdWJtaXRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG48L2Zvcm0+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXNlYXJjaCcsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIFxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyLXdyYXBwZXJcIiBzdHlsZT1cInsgZ2V0RGlzcGxheSgpIH1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwYWdlLXNpZGViYXIgbmF2YmFyLWNvbGxhcHNlIGNvbGxhcHNlXCI+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwicGFnZS1zaWRlYmFyLW1lbnUgXCIgZGF0YS1rZWVwLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWF1dG8tc2Nyb2xsPVwidHJ1ZVwiIGRhdGEtc2xpZGUtc3BlZWQ9XCIyMDBcIj5cclxuXHJcbiAgICAgICAgICAgIDxsaSBpZj1cInsgZGF0YSB9XCIgb25jbGljaz1cInsgcGFyZW50LmNsaWNrIH1cIiBlYWNoPVwieyBkYXRhIH1cIj5cclxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBpY29uIH1cIiBocmVmPVwiamF2YXNjcmlwdDo7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiIHN0eWxlPVwiY29sb3I6I3sgY29sb3IgfTtcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZVwiPnsgdGl0bGUgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInsgYXJyb3c6IG1lbnUubGVuZ3RoIH1cIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8dWwgaWY9XCJ7IG1lbnUgJiYgbWVudS5sZW5ndGggfVwiIGNsYXNzPVwic3ViLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgZWFjaD1cInsgbWVudSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcblxyXG4gICAgICAgIDwvdWw+XHJcblxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1zaWRlYmFyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5jbGljayA9IGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZygnZm9vJykgfVxyXG4gICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvc2lkZWJhcicsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChpbmNsdWRlICYmIGQubWVudSAmJiBkLm1lbnUpIHtcclxuICAgICAgICAgICAgICAgIGQubWVudSA9IF8uZmlsdGVyKF8uc29ydEJ5KGQubWVudSwgJ29yZGVyJyksIChtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0uYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICB0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBcclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IG1ldGFQb2ludHMgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1wb2ludHMuanMnKTtcclxuY29uc3QgbWV0YUhlbHAgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1oZWxwLmpzJyk7XHJcbmNvbnN0IG1ldGFVc2VyID0gcmVxdWlyZSgnLi9tZW51L21ldGEtdXNlci5qcycpO1xyXG5jb25zdCBtZXRhTm90ID0gcmVxdWlyZSgnLi9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XHJcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBwdWxsLXJpZ2h0XCI+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfZGFzaGJvYXJkX2JhclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGhyZWY9XCIjaG9tZVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ob21lXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9saT5cclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX25vdGlmaWNhdGlvbl9iYXJcIj48L2xpPlxyXG5cclxuYFxyXG4gICAgICAgICAgICAvLyA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XHJcbiAgICAgICAgICAgIC8vIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX3BvaW50c19iYXJcIj48L2xpPlxyXG4rIGBcclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl9oZWxwX2JhclwiIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCI+PC9saT5cclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl91c2VyX21lbnVcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLXVzZXIgZHJvcGRvd25cIj48L2xpPlxyXG4gICAgPC91bD5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRvcG1lbnUnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIC8vVE9ETzogcmVzdG9yZSBub3RpZmljYXRpb25zIHdoZW4gbG9naWMgaXMgY29tcGxldGVcclxuICAgICAgICAvL3Jpb3QubW91bnQodGhpcy5oZWFkZXJfcG9pbnRzX2JhciwgJ21ldGEtcG9pbnRzJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9ub3RpZmljYXRpb25fYmFyLCAnbWV0YS1ub3RpZmljYXRpb25zJyk7XHJcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9oZWxwX2JhciwgJ21ldGEtaGVscCcpO1xyXG4gICAgICAgIHJpb3QubW91bnQodGhpcy5oZWFkZXJfdXNlcl9tZW51LCAnbWV0YS11c2VyJyk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2RhdGF0YWJsZXMnKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwidHJhaW5pbmdzX3BhZ2VcIiBjbGFzcz1cInBvcnRsZXQgYm94IGdyZXktY2FzY2FkZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtdGl0bGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tdGgtbGFyZ2VcIj48L2k+Q291cnNlc1xyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicG9ydGxldC1ib2R5XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWhvdmVyXCIgaWQ9XCJ0cmFpbmluZ190YWJsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlZCBPblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGlmPVwieyBkYXRhIH1cIiBlYWNoPVwieyBkYXRhIH1cIiBjbGFzcz1cIm9kZCBncmFkZVhcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+PGEgaHJlZj1cIiN0cmFpbmluZ3Mve2lkfVwiPnsgbmFtZSB9PC9hPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgY3JlYXRlZF9hdCB9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKENPTlNUQU5UUy5QQUdFUy5DT1VSU0VfTElTVCwgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMudXNlciA9IE1ldGFNYXAuVXNlcjtcclxuICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG5cclxuICAgIH0pXHJcblxyXG4gICAgLy9SaW90IGJpbmRpbmdzXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgYnVpbGRUYWJsZSA9IChsaXN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBsaXN0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbYHRhYmxlYF0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGVgXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZWBdID0gJCh0aGlzW2B0cmFpbmluZ190YWJsZWBdKTtcclxuICAgICAgICAgICAgICAgIHRoaXNbYGRhdGFUYWJsZWBdID0gdGhpc1tgdGFibGVgXS5EYXRhVGFibGUoe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBVbmNvbW1lbnQgYmVsb3cgbGluZSgnZG9tJyBwYXJhbWV0ZXIpIHRvIGZpeCB0aGUgZHJvcGRvd24gb3ZlcmZsb3cgaXNzdWUgaW4gdGhlIGRhdGF0YWJsZSBjZWxscy4gVGhlIGRlZmF1bHQgZGF0YXRhYmxlIGxheW91dFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldHVwIHVzZXMgc2Nyb2xsYWJsZSBkaXYodGFibGUtc2Nyb2xsYWJsZSkgd2l0aCBvdmVyZmxvdzphdXRvIHRvIGVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGwoc2VlOiBhc3NldHMvZ2xvYmFsL3BsdWdpbnMvZGF0YXRhYmxlcy9wbHVnaW5zL2Jvb3RzdHJhcC9kYXRhVGFibGVzLmJvb3RzdHJhcC5qcykuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU28gd2hlbiBkcm9wZG93bnMgdXNlZCB0aGUgc2Nyb2xsYWJsZSBkaXYgc2hvdWxkIGJlIHJlbW92ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nZG9tJzogJzwncm93JzwnY29sLW1kLTYgY29sLXNtLTEyJ2w+PCdjb2wtbWQtNiBjb2wtc20tMTInZj5yPnQ8J3Jvdyc8J2NvbC1tZC01IGNvbC1zbS0xMidpPjwnY29sLW1kLTcgY29sLXNtLTEyJ3A+PicsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8nYlN0YXRlU2F2ZSc6IHRydWUsIC8vIHNhdmUgZGF0YXRhYmxlIHN0YXRlKHBhZ2luYXRpb24sIHNvcnQsIGV0YykgaW4gY29va2llLlxyXG4gICAgICAgICAgICAgICAgICAgICdjb2x1bW5zJzogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTmFtZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0NyZWF0ZWQgT24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGFibGVXcmFwcGVyID0gdGhpc1tgdGFibGVgXS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAjdHJhaW5pbmdfdGFibGVfd3JhcHBlcmApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhYmxlV3JhcHBlci5maW5kKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0JykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCBpbnB1dC14c21hbGwgaW5wdXQtaW5saW5lJyk7IC8vIG1vZGlmeSB0YWJsZSBwZXIgcGFnZSBkcm9wZG93blxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLmVycm9yKGUpO1xyXG4gICAgICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vRmV0Y2ggQWxsIG1hcHNcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldENoaWxkKENPTlNUQU5UUy5ST1VURVMuQ09VUlNFX0xJU1QpLm9uKCd2YWx1ZScsICh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcclxuICAgICAgICAgICAgY29uc3QgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBidWlsZFRhYmxlKG1hcHMpO1xyXG4gICAgICAgICAgICAkKCcub3duZXItbGFiZWwnKS50b29sdGlwKClcclxuICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0XCI+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdyBtYXJnaW4tYm90dG9tLTMwXCI+XHJcblx0XHRcdFx0XHRcdDxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPnsgaGVhZGVyLnRpdGxlIH08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8bGkgZWFjaD1cInsgYXJlYXMgfVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XHJcblx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHRcdDwvdWw+XHJcblx0XHRcdFx0XHRcdFx0PCEtLSBCbG9ja3F1b3RlcyAtLT5cclxuXHRcdFx0XHRcdFx0XHQ8YmxvY2txdW90ZSBjbGFzcz1cImhlcm9cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxwPnsgcXVvdGUudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHRcdFx0PHNtYWxsPnsgcXVvdGUuYnkgfTwvc21hbGw+XHJcblx0XHRcdFx0XHRcdFx0PC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkZHRoaXNfaG9yaXpvbnRhbF9mb2xsb3dfdG9vbGJveFwiPjwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcyA9XCJjb2wtbWQtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpZnJhbWUgaWY9XCJ7IGhlYWRlci55b3V0dWJlaWQgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ5dHBsYXllclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHQvaHRtbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQveyBoZWFkZXIueW91dHViZWlkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzID1cImZpdHZpZHNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiaGVpZ2h0OiAzMjdweDsgd2lkdGg6IDEwMCU7IGRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tbGVmdDogYXV0bzsgbWFyZ2luLXJpZ2h0OiBhdXRvOyBicm9kZXI6IDA7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcblx0XHRcdFx0XHRcdFx0PC9pZnJhbWU+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRsaW5lXCI+XHJcblx0XHRcdFx0XHRcdDxoMz57IHVzZXJOYW1lIH17IHZpc2lvbi50aXRsZSB9PC9oMz5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgdmlzaW9uLnRleHQgfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdob21lJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5hcmVhcyA9IFtdXHJcbiAgICB0aGlzLmhlYWRlciA9IHt9XHJcblxyXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLkhPTUUsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuYXJlYXMsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnF1b3RlID0gZGF0YS5xdW90ZTtcclxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xyXG4gICAgICAgIHRoaXMudmlzaW9uID0gZGF0YS52aXNpb247XHJcblxyXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2RhdGF0YWJsZXMnKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcclxuXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcclxuY29uc3QgU2hhcmVNYXAgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL1NoYXJlTWFwJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgaWQ9XCJteV9tYXBzX3BhZ2VcIiBjbGFzcz1cInBvcnRsZXQgYm94IGdyZXktY2FzY2FkZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtdGl0bGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tdGgtbGFyZ2VcIj48L2k+TWV0YU1hcHNcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGlmPVwieyBtZW51IH1cIiBjbGFzcz1cImFjdGlvbnNcIj5cclxuICAgICAgICAgICAgPGEgZWFjaD1cInsgbWVudS5idXR0b25zIH1cIiBocmVmPVwieyBsaW5rIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25BY3Rpb25DbGljayB9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDo7XCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY29nc1wiPjwvaT4gVG9vbHMgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lbnUubWVudSB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uTWVudUNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBwb3J0bGV0LXRhYnNcIj5cclxuICAgICAgICAgICAgPGxpIG9uY2xpY2s9XCJ7IHBhcmVudC5vblRhYlN3aXRjaCB9XCIgZWFjaD1cInsgdmFsLCBpIGluIHRhYnMgfVwiIGNsYXNzPVwieyBhY3RpdmU6IGkgPT0gMCB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI215bWFwc18xX3sgaSB9XCIgZGF0YS10b2dnbGU9XCJ0YWJcIiBhcmlhLWV4cGFuZGVkPVwieyB0cnVlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgeyB2YWwudGl0bGUgfTwvYT5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS10b29sYmFyXCI+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInRhYi1wYW5lIGZhc2UgaW4geyBhY3RpdmU6IGkgPT0gMCB9XCIgaWQ9XCJteW1hcHNfMV97IGkgfVwiPlxyXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlclwiIGlkPVwibXltYXBzX3RhYmxlX3sgaSB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJ0YWJsZS1jaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJncm91cC1jaGVja2FibGVcIiBkYXRhLXNldD1cIiNteW1hcHNfdGFibGVfeyBpIH0gLmNoZWNrYm94ZXNcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZWQgT25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE93bmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgaWY9XCJ7IHBhcmVudC5kYXRhICYmIHBhcmVudC5kYXRhW2ldIH1cIiBlYWNoPVwieyBwYXJlbnQuZGF0YVtpXSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIHx8IHBhcmVudC51c2VyLmlzQWRtaW4gfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hlc1wiIHZhbHVlPVwiMVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc20gYmx1ZSBmaWx0ZXItc3VibWl0XCIgb25jbGljaz1cInsgcGFyZW50Lm9uT3BlbiB9XCI+T3BlbjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIH1cIiBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uU2hhcmUgfVwiPlNoYXJlIDxpIGNsYXNzPVwiZmEgZmEtc2hhcmVcIj48L2k+PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIiBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uQ29weSB9XCI+Q29weSA8aSBjbGFzcz1cImZhIGZhLWNsb25lXCI+PC9pPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IGVkaXRhYmxlIH1cIiBjbGFzcz1cIm1ldGFfZWRpdGFibGVfeyBpIH1cIiBkYXRhLXBrPVwieyBpZCB9XCIgZGF0YS10aXRsZT1cIkVkaXQgTWFwIE5hbWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyAhZWRpdGFibGUgfVwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj57IG5hbWUgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgY3JlYXRlZF9hdCB9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhdyBjb250ZW50PVwieyBwYXJlbnQuZ2V0U3RhdHVzKHRoaXMpIH1cIj48L3Jhdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgcGFyZW50LmdldE93bmVyKHRoaXMpIH1cIj48L3Jhdz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbXktbWFwcycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLnVzZXIgPSBNZXRhTWFwLlVzZXI7XHJcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgdGhpcy5tZW51ID0gbnVsbDtcclxuICAgIGxldCB0YWJzID0gW1xyXG4gICAgICAgIHsgdGl0bGU6ICdNeSBNYXBzJywgb3JkZXI6IDAsIGVkaXRhYmxlOiB0cnVlIH0sXHJcbiAgICAgICAgeyB0aXRsZTogJ1NoYXJlZCB3aXRoIE1lJywgb3JkZXI6IDEsIGVkaXRhYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIHsgdGl0bGU6ICdQdWJsaWMnLCBvcmRlcjogMiwgZWRpdGFibGU6IGZhbHNlIH1cclxuICAgIF07XHJcbiAgICBpZiAodGhpcy51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgICB0YWJzLnB1c2goeyB0aXRsZTogJ0FsbCBNYXBzJywgb3JkZXI6IDMsIGVkaXRhYmxlOiB0cnVlIH0pXHJcbiAgICAgICAgdGFicy5wdXNoKHsgdGl0bGU6ICdUZW1wbGF0ZXMnLCBvcmRlcjogNCwgZWRpdGFibGU6IHRydWUgfSlcclxuICAgIH1cclxuICAgIHRoaXMudGFicyA9IF8uc29ydEJ5KHRhYnMsICdvcmRlcicpXHJcblxyXG4gICAgdGhpcy5jdXJyZW50VGFiID0gJ015IE1hcHMnO1xyXG5cclxuICAgIC8vXHJcbiAgICB0aGlzLmdldFN0YXR1cyA9IChpdGVtKSA9PiB7XHJcbiAgICAgICAgbGV0IHN0YXR1cyA9ICdQcml2YXRlJ1xyXG4gICAgICAgIGxldCBjb2RlID0gJ2RlZmF1bHQnXHJcbiAgICAgICAgbGV0IGh0bWwgPSAnJztcclxuICAgICAgICBpZiAoaXRlbS5zaGFyZWRfd2l0aCkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5zaGFyZWRfd2l0aFsnKiddICYmIChpdGVtLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlIHx8IGl0ZW0uc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ1B1YmxpYydcclxuICAgICAgICAgICAgICAgIGNvZGUgPSAncHJpbWFyeSdcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChpdGVtLnNoYXJlZF93aXRoLCAoc2hhcmUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGFyZS5waWN0dXJlICYmIGtleSAhPSAnKicgJiYga2V5ICE9ICdhZG1pbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJsYWJlbCBvd25lci1sYWJlbFwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtcGxhY2VtZW50PVwiYm90dG9tXCIgdGl0bGU9XCIke3NoYXJlLm5hbWV9XCI+PGltZyBhbHQ9XCIke3NoYXJlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtzaGFyZS5waWN0dXJlfVwiPjwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGlmIChodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9ICc8c3BhbiBjbGFzcz1cIlwiPlNoYXJlZCB3aXRoOiA8L3NwYW4+JyArIGh0bWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaHRtbCA9IGh0bWwgfHwgYDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtJHtjb2RlfVwiPiR7c3RhdHVzfTwvc3Bhbj5gXHJcblxyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0T3duZXIgPSAoaXRlbSkgPT4ge1xyXG4gICAgICAgIGxldCBodG1sID0gYDxzcGFuIGNsYXNzPVwibGFiZWwgb3duZXItbGFiZWxcIiBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIiBkYXRhLXBsYWNlbWVudD1cImJvdHRvbVwiIHRpdGxlPVwiJHtpdGVtLm93bmVyLm5hbWV9XCI+PGltZyBhbHQ9XCIke2l0ZW0ub3duZXIubmFtZX1cIiBoZWlnaHQ9XCIzMFwiIHdpZHRoPVwiMzBcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCIke2l0ZW0ub3duZXIucGljdHVyZX1cIj48L3NwYW4+YFxyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIC8vRXZlbnRzXHJcbiAgICB0aGlzLm9uT3BlbiA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHtldmVudC5pdGVtLmlkfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25TaGFyZSA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIGxldCBvcHRzID0ge1xyXG4gICAgICAgICAgICBtYXA6IGV2ZW50Lml0ZW1cclxuICAgICAgICB9XHJcbiAgICAgICAgU2hhcmVNYXAuYWN0KG9wdHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25Db3B5ID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NvcHknKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25UYWJTd2l0Y2ggPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUYWIgPSBldmVudC5pdGVtLnZhbC50aXRsZTtcclxuICAgICAgICAgXy5kZWxheSgoKSA9PiB7XHJcbiAgICAgICAgICAgICQoJy5vd25lci1sYWJlbCcpLnRvb2x0aXAoKVxyXG4gICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRUYWIpIHtcclxuICAgICAgICAgICAgY2FzZSAnTXkgTWFwcyc6XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25BY3Rpb25DbGljayA9IChldmVudCwgdGFnKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbk1lbnVDbGljayA9IChldmVudCwgdGFnKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRhYiA9PSAnTXkgTWFwcycpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChldmVudC5pdGVtLnRpdGxlLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlTWFwcyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvRGVsZXRlTWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpc1tgdGFibGUwYF0uZmluZCgnLmFjdGl2ZScpLmZpbmQoJy5tYXBpZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpZHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2goc2VsZWN0ZWQsIChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5wdXNoKGNlbGwuaW5uZXJIVE1MKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGVNYXBzLmRlbGV0ZUFsbChpZHMsIENPTlNUQU5UUy5QQUdFUy5NWV9NQVBTKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmluZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJ3Rib2R5IHRyIC5jaGVja2JveGVzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmluZC5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeS51bmlmb3JtLnVwZGF0ZShmaW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcblxyXG4gICAgfSlcclxuXHJcbiAgICAvL1Jpb3QgYmluZGluZ3NcclxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xyXG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvbXltYXBzJywgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVudSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBfLnNvcnRCeShkYXRhLmJ1dHRvbnMsICdvcmRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lbnU6IF8uc29ydEJ5KGRhdGEubWVudSwgJ29yZGVyJylcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkVGFibGUgPSAoaWR4LCBsaXN0LCBlZGl0YWJsZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhW2lkeF0gPSBsaXN0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbYHRhYmxlJHtpZHh9YF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0gPSAkKHRoaXNbYG15bWFwc190YWJsZV8ke2lkeH1gXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXSA9IHRoaXNbYHRhYmxlJHtpZHh9YF0uRGF0YVRhYmxlKHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCB1c2VzIHNjcm9sbGFibGUgZGl2KHRhYmxlLXNjcm9sbGFibGUpIHdpdGggb3ZlcmZsb3c6YXV0byB0byBlbmFibGUgdmVydGljYWwgc2Nyb2xsKHNlZTogYXNzZXRzL2dsb2JhbC9wbHVnaW5zL2RhdGF0YWJsZXMvcGx1Z2lucy9ib290c3RyYXAvZGF0YVRhYmxlcy5ib290c3RyYXAuanMpLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHdoZW4gZHJvcGRvd25zIHVzZWQgdGhlIHNjcm9sbGFibGUgZGl2IHNob3VsZCBiZSByZW1vdmVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vJ2JTdGF0ZVNhdmUnOiB0cnVlLCAvLyBzYXZlIGRhdGF0YWJsZSBzdGF0ZShwYWdpbmF0aW9uLCBzb3J0LCBldGMpIGluIGNvb2tpZS5cclxuICAgICAgICAgICAgICAgICAgICAnY29sdW1ucyc6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0NoY2tCeCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTIwcHgnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ3JlYXRlZCBPbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1N0YXR1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vdGhpc1tgdGFibGUke2lkeH1gXVRvb2xzID0gbmV3ICQuZm4uZGF0YVRhYmxlLlRhYmxlVG9vbHModGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0sIHt9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGFibGVXcmFwcGVyID0gdGhpc1tgdGFibGUke2lkeH1gXS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAjbXltYXBzXyR7aWR4fV90YWJsZV93cmFwcGVyYCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpc1tgdGFibGUke2lkeH1gXS5maW5kKCcuZ3JvdXAtY2hlY2thYmxlJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2V0ID0galF1ZXJ5KHRoaXMpLmF0dHIoJ2RhdGEtc2V0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrZWQgPSBqUXVlcnkodGhpcykuaXMoJzpjaGVja2VkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KHNldCkuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5LnVuaWZvcm0udXBkYXRlKHNldCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdLm9uKCdjaGFuZ2UnLCAndGJvZHkgdHIgLmNoZWNrYm94ZXMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhYmxlV3JhcHBlci5maW5kKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0JykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCBpbnB1dC14c21hbGwgaW5wdXQtaW5saW5lJyk7IC8vIG1vZGlmeSB0YWJsZSBwZXIgcGFnZSBkcm9wZG93blxyXG5cclxuICAgICAgICAgICAgICAgICQoYC5tZXRhX2VkaXRhYmxlXyR7aWR4fWApLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmRhdGFzZXQucGs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YShwYXJhbXMubmV3VmFsdWUsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke2lkfS9uYW1lYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcbiAgICAgICAgICAgICAgICBNZXRhTWFwLmVycm9yKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9GZXRjaCBBbGwgbWFwc1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0Q2hpbGQoQ09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1QpLm9uKCd2YWx1ZScsICh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcclxuICAgICAgICAgICAgXy5lYWNoKHRoaXMudGFicywgKHRhYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hcHMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0YWIudGl0bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdUZW1wbGF0ZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ015IE1hcHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCA9PSBNZXRhTWFwLlVzZXIudXNlcklkKSB7IC8vT25seSBpbmNsdWRlIG15IG93biBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1NoYXJlZCB3aXRoIE1lJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgIT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCAmJiAvL0Rvbid0IGluY2x1ZGUgbXkgb3duIG1hcHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2hhcmVkX3dpdGggJiYgLy9FeGNsdWRlIGFueXRoaW5nIHRoYXQgaXNuJ3Qgc2hhcmVkIGF0IGFsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICghb2JqLnNoYXJlZF93aXRoWycqJ10gfHwgKG9iai5zaGFyZWRfd2l0aFsnKiddLnJlYWQgIT0gdHJ1ZSB8fCBvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSAhPSB0cnVlKSkgJiYgLy9FeGNsdWRlIHB1YmxpYyBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdICYmIC8vSW5jbHVkZSBzaGFyZXMgd2loIG15IHVzZXJJZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSB8fCAvL0luY2x1ZGUgYW55dGhpbmcgSSBjYW4gd3JpdGUgdG9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ucmVhZCA9PSB0cnVlKSAvL0luY2x1ZGUgYW55dGhpbmcgSSBjYW4gcmVhZCBmcm9tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gKG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXS53cml0ZSA9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1B1YmxpYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoICYmIC8vRXhjbHVkZSBhbnl0aGluZyB0aGF0IGlzbid0IHNoYXJlZCBhdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoWycqJ10gJiYgKG9iai5zaGFyZWRfd2l0aFsnKiddLnJlYWQgPT0gdHJ1ZSB8fCBvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSApIC8vSW5jbHVkZSBwdWJsaWMgbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IChvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0FsbCBNYXBzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlci5pc0FkbWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9MaWtlIGl0IHNheXMsIGFsbCBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChtYXBzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8uZmlsdGVyKG1hcHMsIChtYXApID0+IHsgcmV0dXJuIG1hcCAmJiBtYXAuaWQgfSlcclxuICAgICAgICAgICAgICAgICAgICBidWlsZFRhYmxlKHRhYi5vcmRlciwgbWFwcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJCgnLm93bmVyLWxhYmVsJykudG9vbHRpcCgpXHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+eyBoZWFkZXIudGl0bGUgfTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IGhlYWRlci50ZXh0IH08L3A+XHJcblx0XHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBlYWNoPVwieyBhcmVhcyB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxyXG4gICAgXHRcdFx0XHRcdFx0PGgzPnsgdGl0bGUgfTwvaDM+XHJcbiAgICBcdFx0XHRcdFx0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IHRleHQgfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XHJcblx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxiPnsgdGl0bGUgfTwvYj4geyB0ZXh0IH1cclxuXHRcdFx0XHRcdFx0XHQ8L2xpPlxyXG5cdFx0XHRcdFx0XHQ8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Rlcm1zJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICBcclxuICAgIHRoaXMuYXJlYXMgPSBbXVxyXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5URVJNU19BTkRfQ09ORElUSU9OUywgKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLmFyZWFzID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YS5zZWN0aW9ucywgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKGluY2x1ZGUpIHtcclxuICAgICAgICAgICAgICAgIGQuaXRlbXMgPSBfLmZpbHRlcihfLnNvcnRCeShkLml0ZW1zLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5jbHVkZTIgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xyXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICBcclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxuY29uc3QgVmlkZW9QbGF5ZXIgPSByZXF1aXJlKCcuLi8uLi90b29scy9WaWRlb1BsYXllcicpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwidHJhaW5pbmdfcG9ydGxldFwiIGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTMgY29sLW1kLTMgY29sLXNtLTYgY29sLXhzLTEyXCI+XHJcblxyXG5cdFx0XHRcdCAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctNiBjb2wtbWQtNiBjb2wtc20tNiBjb2wteHMtMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJ0cmFpbmluZ19wbGF5ZXJcIj48L2Rpdj5cclxuXHRcdFx0XHQgICAgICAgIDwvZGl2PlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZyhDT05TVEFOVFMuVEFHUy5UUkFJTklORywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcblxyXG4gICAgdGhpcy50cmFpbmluZyA9IHt9XHJcblxyXG4gICAgY29uc3QgZ2V0RGF0YSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmlkKSB7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5DT1VSU0VfTElTVH0ke3RoaXMuY29uZmlnLmlkfWAsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWluaW5nID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCB1cGRhdGUnLCAoZXZlbnQsIG9wdHMpID0+IHtcclxuICAgICAgICBpZiAob3B0cykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdHNcclxuICAgICAgICAgICAgZ2V0RGF0YSgpXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyID0gbmV3IFZpZGVvUGxheWVyKCd0cmFpbmluZ19wbGF5ZXInLCB7aGVpZ2h0OiAzOTAsIHdpZHRoOiA2NDAsIHZpZGVvSWQ6ICdkVXFSVFdDZFh0NCd9KVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcclxuICAgICAgICAkKHRoaXMudHJhaW5pbmdfcG9ydGxldCkuY3NzKHtcclxuICAgICAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxMjAgKyAncHgnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY29ycmVjdEhlaWdodCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG4vKipcclxuRGVtbyBzY3JpcHQgdG8gaGFuZGxlIHRoZSB0aGVtZSBkZW1vXHJcbioqL1xyXG52YXIgRGVtbyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBIYW5kbGUgVGhlbWUgU2V0dGluZ3NcclxuICAgIHZhciBoYW5kbGVUaGVtZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIHBhbmVsID0gJCgnLnRoZW1lLXBhbmVsJyk7XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtYm94ZWQnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgJCgnLmxheW91dC1vcHRpb24nLCBwYW5lbCkudmFsKFwiZmx1aWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZGVmYXVsdFwiKTtcclxuICAgICAgICAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xyXG4gICAgICAgICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZGVmYXVsdFwiKTtcclxuICAgICAgICBpZiAoJCgnLnNpZGViYXItcG9zLW9wdGlvbicpLmF0dHIoXCJkaXNhYmxlZFwiKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItcG9zLW9wdGlvbicsIHBhbmVsKS52YWwoTWV0cm9uaWMuaXNSVEwoKSA/ICdyaWdodCcgOiAnbGVmdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9oYW5kbGUgdGhlbWUgbGF5b3V0XHJcbiAgICAgICAgdmFyIHJlc2V0TGF5b3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuXHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1ib3hlZFwiKS5cclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKS5cclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIikuXHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIikuXHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xyXG5cclxuICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyID4gLnBhZ2UtaGVhZGVyLWlubmVyJykucmVtb3ZlQ2xhc3MoXCJjb250YWluZXJcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoJCgnLnBhZ2UtY29udGFpbmVyJykucGFyZW50KFwiLmNvbnRhaW5lclwiKS5zaXplKCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWNvbnRhaW5lcicpLmluc2VydEFmdGVyKCdib2R5ID4gLmNsZWFyZml4Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkKCcucGFnZS1mb290ZXIgPiAuY29udGFpbmVyJykuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5odG1sKCQoJy5wYWdlLWZvb3RlciA+IC5jb250YWluZXInKS5odG1sKCkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoJy5wYWdlLWZvb3RlcicpLnBhcmVudChcIi5jb250YWluZXJcIikuc2l6ZSgpID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5pbnNlcnRBZnRlcignLnBhZ2UtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmluc2VydEFmdGVyKCcucGFnZS1mb290ZXInKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJChcIi50b3AtbWVudSA+IC5uYXZiYXItbmF2ID4gbGkuZHJvcGRvd25cIikucmVtb3ZlQ2xhc3MoXCJkcm9wZG93bi1kYXJrXCIpO1xyXG5cclxuICAgICAgICAgICAgJCgnYm9keSA+IC5jb250YWluZXInKS5yZW1vdmUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgbGFzdFNlbGVjdGVkTGF5b3V0ID0gJyc7XHJcblxyXG4gICAgICAgIHZhciBzZXRMYXlvdXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGF5b3V0T3B0aW9uID0gJCgnLmxheW91dC1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyT3B0aW9uID0gJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyT3B0aW9uID0gJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIGZvb3Rlck9wdGlvbiA9ICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyUG9zT3B0aW9uID0gJCgnLnNpZGViYXItcG9zLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXJTdHlsZU9wdGlvbiA9ICQoJy5zaWRlYmFyLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXJNZW51T3B0aW9uID0gJCgnLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXJUb3BEcm9wZG93blN0eWxlID0gJCgnLnBhZ2UtaGVhZGVyLXRvcC1kcm9wZG93bi1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHNpZGViYXJPcHRpb24gPT0gXCJmaXhlZFwiICYmIGhlYWRlck9wdGlvbiA9PSBcImRlZmF1bHRcIikge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0RlZmF1bHQgSGVhZGVyIHdpdGggRml4ZWQgU2lkZWJhciBvcHRpb24gaXMgbm90IHN1cHBvcnRlZC4gUHJvY2VlZCB3aXRoIEZpeGVkIEhlYWRlciB3aXRoIEZpeGVkIFNpZGViYXIuJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhck9wdGlvbiA9ICdmaXhlZCc7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJPcHRpb24gPSAnZml4ZWQnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXNldExheW91dCgpOyAvLyByZXNldCBsYXlvdXQgdG8gZGVmYXVsdCBzdGF0ZVxyXG5cclxuICAgICAgICAgICAgaWYgKGxheW91dE9wdGlvbiA9PT0gXCJib3hlZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWJveGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNldCBoZWFkZXJcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciA+IC5wYWdlLWhlYWRlci1pbm5lcicpLmFkZENsYXNzKFwiY29udGFpbmVyXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnQgPSAkKCdib2R5ID4gLmNsZWFyZml4JykuYWZ0ZXIoJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj48L2Rpdj4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgY29udGVudFxyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtY29udGFpbmVyJykuYXBwZW5kVG8oJ2JvZHkgPiAuY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2V0IGZvb3RlclxyXG4gICAgICAgICAgICAgICAgaWYgKGZvb3Rlck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmh0bWwoJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4nICsgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgpICsgJzwvZGl2PicpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5hcHBlbmRUbygnYm9keSA+IC5jb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxhc3RTZWxlY3RlZExheW91dCAhPSBsYXlvdXRPcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIC8vbGF5b3V0IGNoYW5nZWQsIHJ1biByZXNwb25zaXZlIGhhbmRsZXI6XHJcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5ydW5SZXNpemVIYW5kbGVycygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxhc3RTZWxlY3RlZExheW91dCA9IGxheW91dE9wdGlvbjtcclxuXHJcbiAgICAgICAgICAgIC8vaGVhZGVyXHJcbiAgICAgICAgICAgIGlmIChoZWFkZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2UtaGVhZGVyLWZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLWhlYWRlclwiKS5yZW1vdmVDbGFzcyhcIm5hdmJhci1zdGF0aWMtdG9wXCIpLmFkZENsYXNzKFwibmF2YmFyLWZpeGVkLXRvcFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcInBhZ2UtaGVhZGVyLWZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLWhlYWRlclwiKS5yZW1vdmVDbGFzcyhcIm5hdmJhci1maXhlZC10b3BcIikuYWRkQ2xhc3MoXCJuYXZiYXItc3RhdGljLXRvcFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9zaWRlYmFyXHJcbiAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtZnVsbC13aWR0aCcpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJPcHRpb24gPT09ICdmaXhlZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInBhZ2Utc2lkZWJhci1tZW51XCIpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtZGVmYXVsdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdEZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1kZWZhdWx0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXItbWVudScpLnVuYmluZCgnbW91c2VlbnRlcicpLnVuYmluZCgnbW91c2VsZWF2ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyB0b3AgZHJvcGRvd24gc3R5bGVcclxuICAgICAgICAgICAgaWYgKGhlYWRlclRvcERyb3Bkb3duU3R5bGUgPT09ICdkYXJrJykge1xyXG4gICAgICAgICAgICAgICAgJChcIi50b3AtbWVudSA+IC5uYXZiYXItbmF2ID4gbGkuZHJvcGRvd25cIikuYWRkQ2xhc3MoXCJkcm9wZG93bi1kYXJrXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIi50b3AtbWVudSA+IC5uYXZiYXItbmF2ID4gbGkuZHJvcGRvd25cIikucmVtb3ZlQ2xhc3MoXCJkcm9wZG93bi1kYXJrXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2Zvb3RlclxyXG4gICAgICAgICAgICBpZiAoZm9vdGVyT3B0aW9uID09PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3NpZGViYXIgc3R5bGVcclxuICAgICAgICAgICAgaWYgKHNpZGViYXJTdHlsZU9wdGlvbiA9PT0gJ2NvbXBhY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY29tcGFjdFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1jb21wYWN0XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3NpZGViYXIgbWVudVxyXG4gICAgICAgICAgICBpZiAoc2lkZWJhck1lbnVPcHRpb24gPT09ICdob3ZlcicpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09ICdmaXhlZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoXCJhY2NvcmRpb25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJIb3ZlciBTaWRlYmFyIE1lbnUgaXMgbm90IGNvbXBhdGlibGUgd2l0aCBGaXhlZCBTaWRlYmFyIE1vZGUuIFNlbGVjdCBEZWZhdWx0IFNpZGViYXIgTW9kZSBJbnN0ZWFkLlwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9zaWRlYmFyIHBvc2l0aW9uXHJcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5pc1JUTCgpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhclBvc09wdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdyaWdodCdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdsZWZ0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJQb3NPcHRpb24gPT09ICdyaWdodCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ2xlZnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAncmlnaHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIExheW91dC5maXhDb250ZW50SGVpZ2h0KCk7IC8vIGZpeCBjb250ZW50IGhlaWdodFxyXG4gICAgICAgICAgICBMYXlvdXQuaW5pdEZpeGVkU2lkZWJhcigpOyAvLyByZWluaXRpYWxpemUgZml4ZWQgc2lkZWJhclxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSB0aGVtZSBjb2xvcnNcclxuICAgICAgICB2YXIgc2V0Q29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcclxuICAgICAgICAgICAgdmFyIGNvbG9yXyA9IChNZXRyb25pYy5pc1JUTCgpID8gY29sb3IgKyAnLXJ0bCcgOiBjb2xvcik7XHJcbiAgICAgICAgICAgICQoJyNzdHlsZV9jb2xvcicpLmF0dHIoXCJocmVmXCIsIExheW91dC5nZXRMYXlvdXRDc3NQYXRoKCkgKyAndGhlbWVzLycgKyBjb2xvcl8gKyBcIi5jc3NcIik7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICQoJy50aGVtZS1jb2xvcnMgPiBsaScsIHBhbmVsKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2xvciA9ICQodGhpcykuYXR0cihcImRhdGEtdGhlbWVcIik7XHJcbiAgICAgICAgICAgIHNldENvbG9yKGNvbG9yKTtcclxuICAgICAgICAgICAgJCgndWwgPiBsaScsIHBhbmVsKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ2RhcmsnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1hY3Rpb25zIC5idG4nKS5yZW1vdmVDbGFzcygncmVkLWhhemUnKS5hZGRDbGFzcygnYnRuLWRlZmF1bHQgYnRuLXRyYW5zcGFyZW50Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1hY3Rpb25zIC5idG4nKS5yZW1vdmVDbGFzcygnYnRuLWRlZmF1bHQgYnRuLXRyYW5zcGFyZW50JykuYWRkQ2xhc3MoJ3JlZC1oYXplJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gc2V0IGRlZmF1bHQgdGhlbWUgb3B0aW9uczpcclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtYm94ZWRcIikpIHtcclxuICAgICAgICAgICAgJCgnLmxheW91dC1vcHRpb24nLCBwYW5lbCkudmFsKFwiYm94ZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpKSB7XHJcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKSkge1xyXG4gICAgICAgICAgICAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpKSB7XHJcbiAgICAgICAgICAgICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpKSB7XHJcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKFwicmlnaHRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWxpZ2h0XCIpKSB7XHJcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoXCJsaWdodFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudVwiKSkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoXCJob3ZlclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzaWRlYmFyT3B0aW9uID0gJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgaGVhZGVyT3B0aW9uID0gJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIGZvb3Rlck9wdGlvbiA9ICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyUG9zT3B0aW9uID0gJCgnLnNpZGViYXItcG9zLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXJTdHlsZU9wdGlvbiA9ICQoJy5zaWRlYmFyLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXJNZW51T3B0aW9uID0gJCgnLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcblxyXG4gICAgICAgICQoJy5sYXlvdXQtb3B0aW9uLCAucGFnZS1oZWFkZXItdG9wLWRyb3Bkb3duLXN0eWxlLW9wdGlvbiwgLnBhZ2UtaGVhZGVyLW9wdGlvbiwgLnNpZGViYXItb3B0aW9uLCAucGFnZS1mb290ZXItb3B0aW9uLCAuc2lkZWJhci1wb3Mtb3B0aW9uLCAuc2lkZWJhci1zdHlsZS1vcHRpb24sIC5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLmNoYW5nZShzZXRMYXlvdXQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBoYW5kbGUgdGhlbWUgc3R5bGVcclxuICAgIHZhciBzZXRUaGVtZVN0eWxlID0gZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICB2YXIgZmlsZSA9IChzdHlsZSA9PT0gJ3JvdW5kZWQnID8gJ2NvbXBvbmVudHMtcm91bmRlZCcgOiAnY29tcG9uZW50cycpO1xyXG4gICAgICAgIGZpbGUgPSAoTWV0cm9uaWMuaXNSVEwoKSA/IGZpbGUgKyAnLXJ0bCcgOiBmaWxlKTtcclxuXHJcbiAgICAgICAgJCgnI3N0eWxlX2NvbXBvbmVudHMnKS5hdHRyKFwiaHJlZlwiLCBNZXRyb25pYy5nZXRHbG9iYWxDc3NQYXRoKCkgKyBmaWxlICsgXCIuY3NzXCIpO1xyXG5cclxuICAgICAgICBpZiAoJC5jb29raWUpIHtcclxuICAgICAgICAgICAgJC5jb29raWUoJ2xheW91dC1zdHlsZS1vcHRpb24nLCBzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgdGhlIHRoZW1lXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZXMgc3R5bGUgY3VzdG9tZXIgdG9vbFxyXG4gICAgICAgICAgICBoYW5kbGVUaGVtZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gaGFuZGxlIGxheW91dCBzdHlsZSBjaGFuZ2VcclxuICAgICAgICAgICAgJCgnLnRoZW1lLXBhbmVsIC5sYXlvdXQtc3R5bGUtb3B0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgIHNldFRoZW1lU3R5bGUoJCh0aGlzKS52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gc2V0IGxheW91dCBzdHlsZSBmcm9tIGNvb2tpZVxyXG4gICAgICAgICAgICBpZiAoJC5jb29raWUgJiYgJC5jb29raWUoJ2xheW91dC1zdHlsZS1vcHRpb24nKSA9PT0gJ3JvdW5kZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaGVtZVN0eWxlKCQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnRoZW1lLXBhbmVsIC5sYXlvdXQtc3R5bGUtb3B0aW9uJykudmFsKCQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0gKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlbW8iLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuY29uc3QgTWV0cm9uaWMgPSByZXF1aXJlKCcuL21ldHJvbmljJylcclxuLyoqXHJcbkNvcmUgc2NyaXB0IHRvIGhhbmRsZSB0aGUgZW50aXJlIHRoZW1lIGFuZCBjb3JlIGZ1bmN0aW9uc1xyXG4qKi9cclxudmFyIExheW91dCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBsYXlvdXRJbWdQYXRoID0gJ2FkbWluL2xheW91dDQvaW1nLyc7XHJcblxyXG4gICAgdmFyIGxheW91dENzc1BhdGggPSAnYWRtaW4vbGF5b3V0NC9jc3MvJztcclxuXHJcbiAgICB2YXIgcmVzQnJlYWtwb2ludE1kID0gTWV0cm9uaWMuZ2V0UmVzcG9uc2l2ZUJyZWFrcG9pbnQoJ21kJyk7XHJcblxyXG4gICAgLy8qIEJFR0lOOkNPUkUgSEFORExFUlMgKi8vXHJcbiAgICAvLyB0aGlzIGZ1bmN0aW9uIGhhbmRsZXMgcmVzcG9uc2l2ZSBsYXlvdXQgb24gc2NyZWVuIHNpemUgcmVzaXplIG9yIG1vYmlsZSBkZXZpY2Ugcm90YXRlLlxyXG5cclxuXHJcbiAgICAvLyBIYW5kbGUgc2lkZWJhciBtZW51IGxpbmtzXHJcbiAgICB2YXIgaGFuZGxlU2lkZWJhck1lbnVBY3RpdmVMaW5rID0gZnVuY3Rpb24obW9kZSwgZWwpIHtcclxuICAgICAgICB2YXIgdXJsID0gbG9jYXRpb24uaGFzaC50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICB2YXIgbWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xyXG5cclxuICAgICAgICBpZiAobW9kZSA9PT0gJ2NsaWNrJyB8fCBtb2RlID09PSAnc2V0Jykge1xyXG4gICAgICAgICAgICBlbCA9ICQoZWwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ21hdGNoJykge1xyXG4gICAgICAgICAgICBtZW51LmZpbmQoXCJsaSA+IGFcIikuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdXJsIG1hdGNoIGNvbmRpdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID4gMSAmJiB1cmwuc3Vic3RyKDEsIHBhdGgubGVuZ3RoIC0gMSkgPT0gcGF0aC5zdWJzdHIoMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZWwgfHwgZWwuc2l6ZSgpID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVsLmF0dHIoJ2hyZWYnKS50b0xvd2VyQ2FzZSgpID09PSAnamF2YXNjcmlwdDo7JyB8fCBlbC5hdHRyKCdocmVmJykudG9Mb3dlckNhc2UoKSA9PT0gJyMnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzbGlkZVNwZWVkID0gcGFyc2VJbnQobWVudS5kYXRhKFwic2xpZGUtc3BlZWRcIikpO1xyXG4gICAgICAgIHZhciBrZWVwRXhwYW5kID0gbWVudS5kYXRhKFwia2VlcC1leHBhbmRlZFwiKTtcclxuXHJcbiAgICAgICAgLy8gZGlzYWJsZSBhY3RpdmUgc3RhdGVzXHJcbiAgICAgICAgbWVudS5maW5kKCdsaS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgbWVudS5maW5kKCdsaSA+IGEgPiAuc2VsZWN0ZWQnKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgaWYgKG1lbnUuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnUnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgbWVudS5maW5kKCdsaS5vcGVuJykuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLnNpemUoKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz4gYSA+IC5hcnJvdy5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgIG1lbnUuZmluZCgnbGkub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbC5wYXJlbnRzKCdsaScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+IGEgPiBzcGFuLmFycm93JykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudCgndWwucGFnZS1zaWRlYmFyLW1lbnUnKS5zaXplKCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnPiBhJykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInNlbGVjdGVkXCI+PC9zcGFuPicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5jaGlsZHJlbigndWwuc3ViLW1lbnUnKS5zaXplKCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAobW9kZSA9PT0gJ2NsaWNrJykge1xyXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGUgc2lkZWJhciBtZW51XHJcbiAgICB2YXIgaGFuZGxlU2lkZWJhck1lbnUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ2NsaWNrJywgJ2xpID4gYScsIGZ1bmN0aW9uKGUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoID49IHJlc0JyZWFrcG9pbnRNZCAmJiAkKHRoaXMpLnBhcmVudHMoJy5wYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51Jykuc2l6ZSgpID09PSAxKSB7IC8vIGV4aXQgb2YgaG92ZXIgc2lkZWJhciBtZW51XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLm5leHQoKS5oYXNDbGFzcygnc3ViLW1lbnUnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkuaGFzQ2xhc3MoJ3N1Yi1tZW51IGFsd2F5cy1vcGVuJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCk7XHJcbiAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgbWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xyXG4gICAgICAgICAgICB2YXIgc3ViID0gJCh0aGlzKS5uZXh0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXV0b1Njcm9sbCA9IG1lbnUuZGF0YShcImF1dG8tc2Nyb2xsXCIpO1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVTcGVlZCA9IHBhcnNlSW50KG1lbnUuZGF0YShcInNsaWRlLXNwZWVkXCIpKTtcclxuICAgICAgICAgICAgdmFyIGtlZXBFeHBhbmQgPSBtZW51LmRhdGEoXCJrZWVwLWV4cGFuZGVkXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGtlZXBFeHBhbmQgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbignbGkub3BlbicpLmNoaWxkcmVuKCdhJykuY2hpbGRyZW4oJy5hcnJvdycpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5jaGlsZHJlbignLnN1Yi1tZW51Om5vdCguYWx3YXlzLW9wZW4pJykuc2xpZGVVcChzbGlkZVNwZWVkKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbignbGkub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBzbGlkZU9mZmVzZXQgPSAtMjAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN1Yi5pcyhcIjp2aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuYXJyb3cnLCAkKHRoaXMpKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgIHN1Yi5zbGlkZVVwKHNsaWRlU3BlZWQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvU2Nyb2xsID09PSB0cnVlICYmICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXNpZGViYXItZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5zbGltU2Nyb2xsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2Nyb2xsVG8nOiAodGhlLnBvc2l0aW9uKCkpLnRvcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbyh0aGUsIHNsaWRlT2ZmZXNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5hcnJvdycsICQodGhpcykpLmFkZENsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgc3ViLnNsaWRlRG93bihzbGlkZVNwZWVkLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b1Njcm9sbCA9PT0gdHJ1ZSAmJiAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbnUuc2xpbVNjcm9sbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Njcm9sbFRvJzogKHRoZS5wb3NpdGlvbigpKS50b3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8odGhlLCBzbGlkZU9mZmVzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIGFqYXggbGlua3Mgd2l0aGluIHNpZGViYXIgbWVudVxyXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnIGxpID4gYS5hamF4aWZ5JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XHJcbiAgICAgICAgICAgIHZhciBtZW51Q29udGFpbmVyID0gJCgnLnBhZ2Utc2lkZWJhciB1bCcpO1xyXG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSAkKCcucGFnZS1jb250ZW50Jyk7XHJcbiAgICAgICAgICAgIHZhciBwYWdlQ29udGVudEJvZHkgPSAkKCcucGFnZS1jb250ZW50IC5wYWdlLWNvbnRlbnQtYm9keScpO1xyXG5cclxuICAgICAgICAgICAgbWVudUNvbnRhaW5lci5jaGlsZHJlbignbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBtZW51Q29udGFpbmVyLmNoaWxkcmVuKCdhcnJvdy5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnbGknKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCdhID4gc3Bhbi5hcnJvdycpLmFkZENsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ2xpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTWV0cm9uaWMuc3RhcnRQYWdlTG9hZGluZygpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGUucGFyZW50cygnbGkub3BlbicpLnNpemUoKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyLW1lbnUgPiBsaS5vcGVuID4gYScpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbChyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIExheW91dC5maXhDb250ZW50SGVpZ2h0KCk7IC8vIGZpeCBjb250ZW50IGhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLmluaXRBamF4KCk7IC8vIGluaXRpYWxpemUgY29yZSBzdHVmZlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKCc8aDQ+Q291bGQgbm90IGxvYWQgdGhlIHJlcXVlc3RlZCBjb250ZW50LjwvaDQ+Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgYWpheCBsaW5rIHdpdGhpbiBtYWluIGNvbnRlbnRcclxuICAgICAgICAkKCcucGFnZS1jb250ZW50Jykub24oJ2NsaWNrJywgJy5hamF4aWZ5JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHVybCA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XHJcbiAgICAgICAgICAgIHZhciBwYWdlQ29udGVudCA9ICQoJy5wYWdlLWNvbnRlbnQnKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50Qm9keSA9ICQoJy5wYWdlLWNvbnRlbnQgLnBhZ2UtY29udGVudC1ib2R5Jyk7XHJcblxyXG4gICAgICAgICAgICBNZXRyb25pYy5zdGFydFBhZ2VMb2FkaW5nKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0QWpheCgpOyAvLyBpbml0aWFsaXplIGNvcmUgc3R1ZmZcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbCgnPGg0PkNvdWxkIG5vdCBsb2FkIHRoZSByZXF1ZXN0ZWQgY29udGVudC48L2g0PicpO1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHNjcm9sbGluZyB0byB0b3Agb24gcmVzcG9uc2l2ZSBtZW51IHRvZ2dsZXIgY2xpY2sgd2hlbiBoZWFkZXIgaXMgZml4ZWQgZm9yIG1vYmlsZSB2aWV3XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5wYWdlLWhlYWRlci1maXhlZC1tb2JpbGUgLnJlc3BvbnNpdmUtdG9nZ2xlcicsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIHNpZGViYXIgaGVpZ2h0IGZvciBmaXhlZCBzaWRlYmFyIGxheW91dC5cclxuICAgIHZhciBfY2FsY3VsYXRlRml4ZWRTaWRlYmFyVmlld3BvcnRIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2lkZWJhckhlaWdodCA9IE1ldHJvbmljLmdldFZpZXdQb3J0KCkuaGVpZ2h0IC0gJCgnLnBhZ2UtaGVhZGVyJykub3V0ZXJIZWlnaHQoKSAtIDMwO1xyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKSkge1xyXG4gICAgICAgICAgICBzaWRlYmFySGVpZ2h0ID0gc2lkZWJhckhlaWdodCAtICQoJy5wYWdlLWZvb3RlcicpLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2lkZWJhckhlaWdodDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBmaXhlZCBzaWRlYmFyXHJcbiAgICB2YXIgaGFuZGxlRml4ZWRTaWRlYmFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcclxuXHJcbiAgICAgICAgTWV0cm9uaWMuZGVzdHJveVNsaW1TY3JvbGwobWVudSk7XHJcblxyXG4gICAgICAgIGlmICgkKCcucGFnZS1zaWRlYmFyLWZpeGVkJykuc2l6ZSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoID49IHJlc0JyZWFrcG9pbnRNZCkge1xyXG4gICAgICAgICAgICBtZW51LmF0dHIoXCJkYXRhLWhlaWdodFwiLCBfY2FsY3VsYXRlRml4ZWRTaWRlYmFyVmlld3BvcnRIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKG1lbnUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBzaWRlYmFyIHRvZ2dsZXIgdG8gY2xvc2UvaGlkZSB0aGUgc2lkZWJhci5cclxuICAgIHZhciBoYW5kbGVGaXhlZFNpZGViYXJIb3ZlckVmZmVjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYm9keSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKTtcclxuICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcclxuICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnBhZ2Utc2lkZWJhci1tZW51JykucmVtb3ZlQ2xhc3MoJ3BhZ2Utc2lkZWJhci1tZW51LWNsb3NlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItY2xvc2VkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5wYWdlLXNpZGViYXItbWVudScpLmFkZENsYXNzKCdwYWdlLXNpZGViYXItbWVudS1jbG9zZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5sZXMgc2lkZWJhciB0b2dnbGVyXHJcbiAgICB2YXIgaGFuZGxlU2lkZWJhclRvZ2dsZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYm9keSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHNpZGViYXIgc2hvdy9oaWRlXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcuc2lkZWJhci10b2dnbGVyJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhciA9ICQoJy5wYWdlLXNpZGViYXInKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXJNZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XHJcbiAgICAgICAgICAgICQoXCIuc2lkZWJhci1zZWFyY2hcIiwgc2lkZWJhcikucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBib2R5LnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKTtcclxuICAgICAgICAgICAgICAgIHNpZGViYXJNZW51LnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ3NpZGViYXJfY2xvc2VkJywgJzAnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJvZHkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhck1lbnUuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1jbG9zZWRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXJNZW51LnRyaWdnZXIoXCJtb3VzZWxlYXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ3NpZGViYXJfY2xvc2VkJywgJzEnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXJIb3ZlckVmZmVjdCgpO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgdGhlIHNlYXJjaCBiYXIgY2xvc2VcclxuICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ2NsaWNrJywgJy5zaWRlYmFyLXNlYXJjaCAucmVtb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggcXVlcnkgc3VibWl0IG9uIGVudGVyIHByZXNzXHJcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhciAuc2lkZWJhci1zZWFyY2gnKS5vbigna2V5cHJlc3MnLCAnaW5wdXQuZm9ybS1jb250cm9sJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vPC0tLS0gQWRkIHRoaXMgbGluZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSB0aGUgc2VhcmNoIHN1Ym1pdChmb3Igc2lkZWJhciBzZWFyY2ggYW5kIHJlc3BvbnNpdmUgbW9kZSBvZiB0aGUgaGVhZGVyIHNlYXJjaClcclxuICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2ggLnN1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXNlYXJjaCcpLmhhc0NsYXNzKCdvcGVuJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJy5wYWdlLXNpZGViYXItZml4ZWQnKS5zaXplKCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhciAuc2lkZWJhci10b2dnbGVyJykuY2xpY2soKTsgLy90cmlnZ2VyIHNpZGViYXIgdG9nZ2xlIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5hZGRDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuc3VibWl0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIGNsb3NlIG9uIGJvZHkgY2xpY2tcclxuICAgICAgICBpZiAoJCgnLnNpZGViYXItc2VhcmNoJykuc2l6ZSgpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCAuaW5wdXQtZ3JvdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgdGhlIGhvcml6b250YWwgbWVudVxyXG4gICAgdmFyIGhhbmRsZUhlYWRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGhhbmRsZSBzZWFyY2ggYm94IGV4cGFuZC9jb2xsYXBzZVxyXG4gICAgICAgICQoJy5wYWdlLWhlYWRlcicpLm9uKCdjbGljaycsICcuc2VhcmNoLWZvcm0nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5mb3JtLWNvbnRyb2wnKS5mb2N1cygpO1xyXG5cclxuICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5zZWFyY2gtZm9ybSAuZm9ybS1jb250cm9sJykub24oJ2JsdXInLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5zZWFyY2gtZm9ybScpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykudW5iaW5kKFwiYmx1clwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBob3IgbWVudSBzZWFyY2ggZm9ybSBvbiBlbnRlciBwcmVzc1xyXG4gICAgICAgICQoJy5wYWdlLWhlYWRlcicpLm9uKCdrZXlwcmVzcycsICcuaG9yLW1lbnUgLnNlYXJjaC1mb3JtIC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5zZWFyY2gtZm9ybScpLnN1Ym1pdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBoZWFkZXIgc2VhcmNoIGJ1dHRvbiBjbGlja1xyXG4gICAgICAgICQoJy5wYWdlLWhlYWRlcicpLm9uKCdtb3VzZWRvd24nLCAnLnNlYXJjaC1mb3JtLm9wZW4gLnN1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5zZWFyY2gtZm9ybScpLnN1Ym1pdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIHRoZSBnbyB0byB0b3AgYnV0dG9uIGF0IHRoZSBmb290ZXJcclxuICAgIHZhciBoYW5kbGVHb1RvcCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSAzMDA7XHJcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gNTAwO1xyXG5cclxuICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lfGlQYWR8aVBvZC9pKSkgeyAvLyBpb3Mgc3VwcG9ydGVkXHJcbiAgICAgICAgICAgICQod2luZG93KS5iaW5kKFwidG91Y2hlbmQgdG91Y2hjYW5jZWwgdG91Y2hsZWF2ZVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IG9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZUluKGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlT3V0KGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHsgLy8gZ2VuZXJhbFxyXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVJbihkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZU91dChkdXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXHJcbiAgICAgICAgICAgIH0sIGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8vKiBFTkQ6Q09SRSBIQU5ETEVSUyAqLy9cclxuXHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAvLyBNYWluIGluaXQgbWV0aG9kcyB0byBpbml0aWFsaXplIHRoZSBsYXlvdXRcclxuICAgICAgICAvLyBJTVBPUlRBTlQhISE6IERvIG5vdCBtb2RpZnkgdGhlIGNvcmUgaGFuZGxlcnMgY2FsbCBvcmRlci5cclxuXHJcbiAgICAgICAgaW5pdEhlYWRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUhlYWRlcigpOyAvLyBoYW5kbGVzIGhvcml6b250YWwgbWVudVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldFNpZGViYXJNZW51QWN0aXZlTGluazogZnVuY3Rpb24obW9kZSwgZWwpIHtcclxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhck1lbnVBY3RpdmVMaW5rKG1vZGUsIGVsKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0U2lkZWJhcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vbGF5b3V0IGhhbmRsZXJzXHJcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhcigpOyAvLyBoYW5kbGVzIGZpeGVkIHNpZGViYXIgbWVudVxyXG4gICAgICAgICAgICBoYW5kbGVTaWRlYmFyTWVudSgpOyAvLyBoYW5kbGVzIG1haW4gbWVudVxyXG4gICAgICAgICAgICBoYW5kbGVTaWRlYmFyVG9nZ2xlcigpOyAvLyBoYW5kbGVzIHNpZGViYXIgaGlkZS9zaG93XHJcblxyXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuaXNBbmd1bGFySnNBcHAoKSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlU2lkZWJhck1lbnVBY3RpdmVMaW5rKCdtYXRjaCcpOyAvLyBpbml0IHNpZGViYXIgYWN0aXZlIGxpbmtzXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIE1ldHJvbmljLmFkZFJlc2l6ZUhhbmRsZXIoaGFuZGxlRml4ZWRTaWRlYmFyKTsgLy8gcmVpbml0aWFsaXplIGZpeGVkIHNpZGViYXIgb24gd2luZG93IHJlc2l6ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRDb250ZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRGb290ZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVHb1RvcCgpOyAvL2hhbmRsZXMgc2Nyb2xsIHRvIHRvcCBmdW5jdGlvbmFsaXR5IGluIHRoZSBmb290ZXJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEhlYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRTaWRlYmFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdENvbnRlbnQoKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gZml4IHRoZSBzaWRlYmFyIGFuZCBjb250ZW50IGhlaWdodCBhY2NvcmRpbmdseVxyXG4gICAgICAgIGZpeENvbnRlbnRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdEZpeGVkU2lkZWJhckhvdmVyRWZmZWN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0Rml4ZWRTaWRlYmFyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFyKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0TGF5b3V0SW1nUGF0aDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNZXRyb25pYy5nZXRBc3NldHNQYXRoKCkgKyBsYXlvdXRJbWdQYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldExheW91dENzc1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWV0cm9uaWMuZ2V0QXNzZXRzUGF0aCgpICsgbGF5b3V0Q3NzUGF0aDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSAoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5b3V0OyIsImNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5cclxuLyoqXHJcbkNvcmUgc2NyaXB0IHRvIGhhbmRsZSB0aGUgZW50aXJlIHRoZW1lIGFuZCBjb3JlIGZ1bmN0aW9uc1xyXG4qKi9cclxudmFyIE1ldHJvbmljID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLy8gSUUgbW9kZVxyXG4gICAgdmFyIGlzUlRMID0gZmFsc2U7XHJcbiAgICB2YXIgaXNJRTggPSBmYWxzZTtcclxuICAgIHZhciBpc0lFOSA9IGZhbHNlO1xyXG4gICAgdmFyIGlzSUUxMCA9IGZhbHNlO1xyXG5cclxuICAgIHZhciByZXNpemVIYW5kbGVycyA9IFtdO1xyXG5cclxuICAgIHZhciBhc3NldHNQYXRoID0gJy4uLy4uL2Fzc2V0cy8nO1xyXG5cclxuICAgIHZhciBnbG9iYWxJbWdQYXRoID0gJ2dsb2JhbC9pbWcvJztcclxuXHJcbiAgICB2YXIgZ2xvYmFsUGx1Z2luc1BhdGggPSAnZ2xvYmFsL3BsdWdpbnMvJztcclxuXHJcbiAgICB2YXIgZ2xvYmFsQ3NzUGF0aCA9ICdnbG9iYWwvY3NzLyc7XHJcblxyXG4gICAgLy8gdGhlbWUgbGF5b3V0IGNvbG9yIHNldFxyXG5cclxuICAgIHZhciBicmFuZENvbG9ycyA9IHtcclxuICAgICAgICAnYmx1ZSc6ICcjODlDNEY0JyxcclxuICAgICAgICAncmVkJzogJyNGMzU2NUQnLFxyXG4gICAgICAgICdncmVlbic6ICcjMWJiYzliJyxcclxuICAgICAgICAncHVycGxlJzogJyM5YjU5YjYnLFxyXG4gICAgICAgICdncmV5JzogJyM5NWE1YTYnLFxyXG4gICAgICAgICd5ZWxsb3cnOiAnI0Y4Q0IwMCdcclxuICAgIH07XHJcblxyXG4gICAgLy8gaW5pdGlhbGl6ZXMgbWFpbiBzZXR0aW5nc1xyXG4gICAgdmFyIGhhbmRsZUluaXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5jc3MoJ2RpcmVjdGlvbicpID09PSAncnRsJykge1xyXG4gICAgICAgICAgICBpc1JUTCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpc0lFOCA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTVNJRSA4LjAvKTtcclxuICAgICAgICBpc0lFOSA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTVNJRSA5LjAvKTtcclxuICAgICAgICBpc0lFMTAgPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgMTAuMC8pO1xyXG5cclxuICAgICAgICBpZiAoaXNJRTEwKSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaWUxMCcpOyAvLyBkZXRlY3QgSUUxMCB2ZXJzaW9uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNJRTEwIHx8IGlzSUU5IHx8IGlzSUU4KSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaWUnKTsgLy8gZGV0ZWN0IElFMTAgdmVyc2lvblxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gcnVucyBjYWxsYmFjayBmdW5jdGlvbnMgc2V0IGJ5IE1ldHJvbmljLmFkZFJlc3BvbnNpdmVIYW5kbGVyKCkuXHJcbiAgICB2YXIgX3J1blJlc2l6ZUhhbmRsZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gcmVpbml0aWFsaXplIG90aGVyIHN1YnNjcmliZWQgZWxlbWVudHNcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc2l6ZUhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBlYWNoID0gcmVzaXplSGFuZGxlcnNbaV07XHJcbiAgICAgICAgICAgIGVhY2guY2FsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gaGFuZGxlIHRoZSBsYXlvdXQgcmVpbml0aWFsaXphdGlvbiBvbiB3aW5kb3cgcmVzaXplXHJcbiAgICB2YXIgaGFuZGxlT25SZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcmVzaXplO1xyXG4gICAgICAgIGlmIChpc0lFOCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmhlaWdodDtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyaGVpZ2h0ID09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vcXVpdGUgZXZlbnQgc2luY2Ugb25seSBib2R5IHJlc2l6ZWQgbm90IHdpbmRvdy5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZXNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc2l6ZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3J1blJlc2l6ZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MCk7IC8vIHdhaXQgNTBtcyB1bnRpbCB3aW5kb3cgcmVzaXplIGZpbmlzaGVzLlxyXG4gICAgICAgICAgICAgICAgY3VycmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7IC8vIHN0b3JlIGxhc3QgYm9keSBjbGllbnQgaGVpZ2h0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNpemUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9ydW5SZXNpemVIYW5kbGVycygpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTApOyAvLyB3YWl0IDUwbXMgdW50aWwgd2luZG93IHJlc2l6ZSBmaW5pc2hlcy5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIHBvcnRsZXQgdG9vbHMgJiBhY3Rpb25zXHJcbiAgICB2YXIgaGFuZGxlUG9ydGxldFRvb2xzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaGFuZGxlIHBvcnRsZXQgcmVtb3ZlXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gYS5yZW1vdmUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIHBvcnRsZXQgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtcG9ydGxldC1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZWxvYWQnKS50b29sdGlwKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVtb3ZlJykudG9vbHRpcCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbmZpZycpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb2xsYXBzZSwgLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5leHBhbmQnKS50b29sdGlwKCdkZXN0cm95Jyk7XHJcblxyXG4gICAgICAgICAgICBwb3J0bGV0LnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgcG9ydGxldCBmdWxsc2NyZWVuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlIC5mdWxsc2NyZWVuJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBwb3J0bGV0ID0gJCh0aGlzKS5jbG9zZXN0KFwiLnBvcnRsZXRcIik7XHJcbiAgICAgICAgICAgIGlmIChwb3J0bGV0Lmhhc0NsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnb24nKTtcclxuICAgICAgICAgICAgICAgIHBvcnRsZXQucmVtb3ZlQ2xhc3MoJ3BvcnRsZXQtZnVsbHNjcmVlbicpO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpO1xyXG4gICAgICAgICAgICAgICAgcG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBNZXRyb25pYy5nZXRWaWV3UG9ydCgpLmhlaWdodCAtXHJcbiAgICAgICAgICAgICAgICAgICAgcG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtdGl0bGUnKS5vdXRlckhlaWdodCgpIC1cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcpKSAtXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygncGFkZGluZy1ib3R0b20nKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnb24nKTtcclxuICAgICAgICAgICAgICAgIHBvcnRsZXQuYWRkQ2xhc3MoJ3BvcnRsZXQtZnVsbHNjcmVlbicpO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpO1xyXG4gICAgICAgICAgICAgICAgcG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiBhLnJlbG9hZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKS5jaGlsZHJlbihcIi5wb3J0bGV0LWJvZHlcIik7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXVybFwiKTtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1lcnJvci1kaXNwbGF5XCIpO1xyXG4gICAgICAgICAgICBpZiAodXJsKSB7XHJcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5ibG9ja1VJKHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGVsLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnVuYmxvY2tVSShlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmh0bWwocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy51bmJsb2NrVUkoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gJ0Vycm9yIG9uIHJlbG9hZGluZyB0aGUgY29udGVudC4gUGxlYXNlIGNoZWNrIHlvdXIgY29ubmVjdGlvbiBhbmQgdHJ5IGFnYWluLic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvciA9PSBcInRvYXN0clwiICYmIHRvYXN0cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IgPT0gXCJub3RpZmljOFwiICYmICQubm90aWZpYzgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQubm90aWZpYzgoJ3ppbmRleCcsIDExNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQubm90aWZpYzgobXNnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6ICdydWJ5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaWZlOiAzMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KG1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGZvciBkZW1vIHB1cnBvc2VcclxuICAgICAgICAgICAgICAgIE1ldHJvbmljLmJsb2NrVUkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q29sb3I6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy51bmJsb2NrVUkoZWwpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbG9hZCBhamF4IGRhdGEgb24gcGFnZSBpbml0XHJcbiAgICAgICAgJCgnLnBvcnRsZXQgLnBvcnRsZXQtdGl0bGUgYS5yZWxvYWRbZGF0YS1sb2FkPVwidHJ1ZVwiXScpLmNsaWNrKCk7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb2xsYXBzZSwgLnBvcnRsZXQgLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpLmNoaWxkcmVuKFwiLnBvcnRsZXQtYm9keVwiKTtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJjb2xsYXBzZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImNvbGxhcHNlXCIpLmFkZENsYXNzKFwiZXhwYW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgZWwuc2xpZGVVcCgyMDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImV4cGFuZFwiKS5hZGRDbGFzcyhcImNvbGxhcHNlXCIpO1xyXG4gICAgICAgICAgICAgICAgZWwuc2xpZGVEb3duKDIwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBjdXN0b20gY2hlY2tib3hlcyAmIHJhZGlvcyB1c2luZyBqUXVlcnkgVW5pZm9ybSBwbHVnaW5cclxuICAgIHZhciBoYW5kbGVVbmlmb3JtID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCEkKCkudW5pZm9ybSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0ZXN0ID0gJChcImlucHV0W3R5cGU9Y2hlY2tib3hdOm5vdCgudG9nZ2xlLCAubWQtY2hlY2ssIC5tZC1yYWRpb2J0biwgLm1ha2Utc3dpdGNoLCAuaWNoZWNrKSwgaW5wdXRbdHlwZT1yYWRpb106bm90KC50b2dnbGUsIC5tZC1jaGVjaywgLm1kLXJhZGlvYnRuLCAuc3RhciwgLm1ha2Utc3dpdGNoLCAuaWNoZWNrKVwiKTtcclxuICAgICAgICBpZiAodGVzdC5zaXplKCkgPiAwKSB7XHJcbiAgICAgICAgICAgIHRlc3QuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudHMoXCIuY2hlY2tlclwiKS5zaXplKCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnVuaWZvcm0oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzbWF0ZXJpYWwgZGVzaWduIGNoZWNrYm94ZXNcclxuICAgIHZhciBoYW5kbGVNYXRlcmlhbERlc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvLyBNYXRlcmlhbCBkZXNpZ24gY2tlY2tib3ggYW5kIHJhZGlvIGVmZmVjdHNcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5tZC1jaGVja2JveCA+IGxhYmVsLCAubWQtcmFkaW8gPiBsYWJlbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgLy8gZmluZCB0aGUgZmlyc3Qgc3BhbiB3aGljaCBpcyBvdXIgY2lyY2xlL2J1YmJsZVxyXG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmNoaWxkcmVuKCdzcGFuOmZpcnN0LWNoaWxkJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBhZGQgdGhlIGJ1YmJsZSBjbGFzcyAod2UgZG8gdGhpcyBzbyBpdCBkb2VzbnQgc2hvdyBvbiBwYWdlIGxvYWQpXHJcbiAgICAgICAgICAgIGVsLmFkZENsYXNzKCdpbmMnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNsb25lIGl0XHJcbiAgICAgICAgICAgIHZhciBuZXdvbmUgPSBlbC5jbG9uZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgY2xvbmVkIHZlcnNpb24gYmVmb3JlIG91ciBvcmlnaW5hbFxyXG4gICAgICAgICAgICBlbC5iZWZvcmUobmV3b25lKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgb3JpZ2luYWwgc28gdGhhdCBpdCBpcyByZWFkeSB0byBydW4gb24gbmV4dCBjbGlja1xyXG4gICAgICAgICAgICAkKFwiLlwiICsgZWwuYXR0cihcImNsYXNzXCIpICsgXCI6bGFzdFwiLCB0aGUpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLW1kJykpIHtcclxuICAgICAgICAgICAgLy8gTWF0ZXJpYWwgZGVzaWduIGNsaWNrIGVmZmVjdFxyXG4gICAgICAgICAgICAvLyBjcmVkaXQgd2hlcmUgY3JlZGl0J3MgZHVlOyBodHRwOi8vdGhlY29kZXBsYXllci5jb20vd2Fsa3Rocm91Z2gvcmlwcGxlLWNsaWNrLWVmZmVjdC1nb29nbGUtbWF0ZXJpYWwtZGVzaWduXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50LCBjaXJjbGUsIGQsIHgsIHk7XHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnYS5idG4sIGJ1dHRvbi5idG4sIGlucHV0LmJ0biwgbGFiZWwuYnRuJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudC5maW5kKFwiLm1kLWNsaWNrLWNpcmNsZVwiKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucHJlcGVuZChcIjxzcGFuIGNsYXNzPSdtZC1jbGljay1jaXJjbGUnPjwvc3Bhbj5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2lyY2xlID0gZWxlbWVudC5maW5kKFwiLm1kLWNsaWNrLWNpcmNsZVwiKTtcclxuICAgICAgICAgICAgICAgIGNpcmNsZS5yZW1vdmVDbGFzcyhcIm1kLWNsaWNrLWFuaW1hdGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIWNpcmNsZS5oZWlnaHQoKSAmJiAhY2lyY2xlLndpZHRoKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkID0gTWF0aC5tYXgoZWxlbWVudC5vdXRlcldpZHRoKCksIGVsZW1lbnQub3V0ZXJIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlLmNzcyh7aGVpZ2h0OiBkLCB3aWR0aDogZH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHggPSBlLnBhZ2VYIC0gZWxlbWVudC5vZmZzZXQoKS5sZWZ0IC0gY2lyY2xlLndpZHRoKCkvMjtcclxuICAgICAgICAgICAgICAgIHkgPSBlLnBhZ2VZIC0gZWxlbWVudC5vZmZzZXQoKS50b3AgLSBjaXJjbGUuaGVpZ2h0KCkvMjtcclxuXHJcbiAgICAgICAgICAgICAgICBjaXJjbGUuY3NzKHt0b3A6IHkrJ3B4JywgbGVmdDogeCsncHgnfSkuYWRkQ2xhc3MoXCJtZC1jbGljay1hbmltYXRlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmxvYXRpbmcgbGFiZWxzXHJcbiAgICAgICAgdmFyIGhhbmRsZUlucHV0ID0gZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgaWYgKGVsLnZhbCgpICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsLmFkZENsYXNzKCdlZGl0ZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNsYXNzKCdlZGl0ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdrZXlkb3duJywgJy5mb3JtLW1kLWZsb2F0aW5nLWxhYmVsIC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUlucHV0KCQodGhpcykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignYmx1cicsICcuZm9ybS1tZC1mbG9hdGluZy1sYWJlbCAuZm9ybS1jb250cm9sJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBoYW5kbGVJbnB1dCgkKHRoaXMpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZWRpdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGVzIGN1c3RvbSBjaGVja2JveGVzICYgcmFkaW9zIHVzaW5nIGpRdWVyeSBpQ2hlY2sgcGx1Z2luXHJcbiAgICB2YXIgaGFuZGxlaUNoZWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCEkKCkuaUNoZWNrKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJy5pY2hlY2snKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY2hlY2tib3hDbGFzcyA9ICQodGhpcykuYXR0cignZGF0YS1jaGVja2JveCcpID8gJCh0aGlzKS5hdHRyKCdkYXRhLWNoZWNrYm94JykgOiAnaWNoZWNrYm94X21pbmltYWwtZ3JleSc7XHJcbiAgICAgICAgICAgIHZhciByYWRpb0NsYXNzID0gJCh0aGlzKS5hdHRyKCdkYXRhLXJhZGlvJykgPyAkKHRoaXMpLmF0dHIoJ2RhdGEtcmFkaW8nKSA6ICdpcmFkaW9fbWluaW1hbC1ncmV5JztcclxuXHJcbiAgICAgICAgICAgIGlmIChjaGVja2JveENsYXNzLmluZGV4T2YoJ19saW5lJykgPiAtMSB8fCByYWRpb0NsYXNzLmluZGV4T2YoJ19saW5lJykgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soe1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94Q2xhc3M6IGNoZWNrYm94Q2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9DbGFzczogcmFkaW9DbGFzcyxcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICc8ZGl2IGNsYXNzPVwiaWNoZWNrX2xpbmUtaWNvblwiPjwvZGl2PicgKyAkKHRoaXMpLmF0dHIoXCJkYXRhLWxhYmVsXCIpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuaUNoZWNrKHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja2JveENsYXNzOiBjaGVja2JveENsYXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhZGlvQ2xhc3M6IHJhZGlvQ2xhc3NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIHN3aXRjaGVzXHJcbiAgICB2YXIgaGFuZGxlQm9vdHN0cmFwU3dpdGNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCEkKCkuYm9vdHN0cmFwU3dpdGNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnLm1ha2Utc3dpdGNoJykuYm9vdHN0cmFwU3dpdGNoKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIGNvbmZpcm1hdGlvbnNcclxuICAgIHZhciBoYW5kbGVCb290c3RyYXBDb25maXJtYXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoISQoKS5jb25maXJtYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKCdbZGF0YS10b2dnbGU9Y29uZmlybWF0aW9uXScpLmNvbmZpcm1hdGlvbih7IGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLCBidG5Pa0NsYXNzOiAnYnRuIGJ0bi1zbSBidG4tc3VjY2VzcycsIGJ0bkNhbmNlbENsYXNzOiAnYnRuIGJ0bi1zbSBidG4tZGFuZ2VyJ30pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIEFjY29yZGlvbnMuXHJcbiAgICB2YXIgaGFuZGxlQWNjb3JkaW9ucyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignc2hvd24uYnMuY29sbGFwc2UnLCAnLmFjY29yZGlvbi5zY3JvbGxhYmxlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygkKGUudGFyZ2V0KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIFRhYnMuXHJcbiAgICB2YXIgaGFuZGxlVGFicyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vYWN0aXZhdGUgdGFiIGlmIHRhYiBpZCBwcm92aWRlZCBpbiB0aGUgVVJMXHJcbiAgICAgICAgaWYgKGxvY2F0aW9uLmhhc2gpIHtcclxuICAgICAgICAgICAgdmFyIHRhYmlkID0gZW5jb2RlVVJJKGxvY2F0aW9uLmhhc2guc3Vic3RyKDEpKTtcclxuICAgICAgICAgICAgJCgnYVtocmVmPVwiIycgKyB0YWJpZCArICdcIl0nKS5wYXJlbnRzKCcudGFiLXBhbmU6aGlkZGVuJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0YWJpZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xyXG4gICAgICAgICAgICAgICAgJCgnYVtocmVmPVwiIycgKyB0YWJpZCArICdcIl0nKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnYVtocmVmPVwiIycgKyB0YWJpZCArICdcIl0nKS5jbGljaygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoKS50YWJkcm9wKSB7XHJcbiAgICAgICAgICAgICQoJy50YWJiYWJsZS10YWJkcm9wIC5uYXYtcGlsbHMsIC50YWJiYWJsZS10YWJkcm9wIC5uYXYtdGFicycpLnRhYmRyb3Aoe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZmEgZmEtZWxsaXBzaXMtdlwiPjwvaT4mbmJzcDs8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIE1vZGFscy5cclxuICAgIHZhciBoYW5kbGVNb2RhbHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBmaXggc3RhY2thYmxlIG1vZGFsIGlzc3VlOiB3aGVuIDIgb3IgbW9yZSBtb2RhbHMgb3BlbmVkLCBjbG9zaW5nIG9uZSBvZiBtb2RhbCB3aWxsIHJlbW92ZSAubW9kYWwtb3BlbiBjbGFzcy5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2hpZGUuYnMubW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCQoJy5tb2RhbDp2aXNpYmxlJykuc2l6ZSgpID4gMSAmJiAkKCdodG1sJykuaGFzQ2xhc3MoJ21vZGFsLW9wZW4nKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnbW9kYWwtb3BlbicpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoJy5tb2RhbDp2aXNpYmxlJykuc2l6ZSgpIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGZpeCBwYWdlIHNjcm9sbGJhcnMgaXNzdWVcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ3Nob3cuYnMubW9kYWwnLCAnLm1vZGFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwibW9kYWwtc2Nyb2xsXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJtb2RhbC1vcGVuLW5vc2Nyb2xsXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGZpeCBwYWdlIHNjcm9sbGJhcnMgaXNzdWVcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2hpZGUuYnMubW9kYWwnLCAnLm1vZGFsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcIm1vZGFsLW9wZW4tbm9zY3JvbGxcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSBhamF4IGNvbnRlbnQgYW5kIHJlbW92ZSBjYWNoZSBvbiBtb2RhbCBjbG9zZWRcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2hpZGRlbi5icy5tb2RhbCcsICcubW9kYWw6bm90KC5tb2RhbC1jYWNoZWQpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZURhdGEoJ2JzLm1vZGFsJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIFRvb2x0aXBzLlxyXG4gICAgdmFyIGhhbmRsZVRvb2x0aXBzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gZ2xvYmFsIHRvb2x0aXBzXHJcbiAgICAgICAgJCgnLnRvb2x0aXBzJykudG9vbHRpcCgpO1xyXG5cclxuICAgICAgICAvLyBwb3J0bGV0IHRvb2x0aXBzXHJcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcclxuICAgICAgICAgICAgdGl0bGU6ICdGdWxsc2NyZWVuJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVsb2FkJykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1JlbG9hZCdcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbW92ZScpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcclxuICAgICAgICAgICAgdGl0bGU6ICdSZW1vdmUnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb25maWcnKS50b29sdGlwKHtcclxuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXHJcbiAgICAgICAgICAgIHRpdGxlOiAnU2V0dGluZ3MnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb2xsYXBzZSwgLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5leHBhbmQnKS50b29sdGlwKHtcclxuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXHJcbiAgICAgICAgICAgIHRpdGxlOiAnQ29sbGFwc2UvRXhwYW5kJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBEcm9wZG93bnNcclxuICAgIHZhciBoYW5kbGVEcm9wZG93bnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgSG9sZCBkcm9wZG93biBvbiBjbGlja1xyXG4gICAgICAgICovXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcuZHJvcGRvd24tbWVudS5ob2xkLW9uLWNsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgaGFuZGxlQWxlcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdbZGF0YS1jbG9zZT1cImFsZXJ0XCJdJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgnLmFsZXJ0JykuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5ub3RlJykuaGlkZSgpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtY2xvc2U9XCJub3RlXCJdJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5ub3RlJykuaGlkZSgpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtcmVtb3ZlPVwibm90ZVwiXScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZSBIb3dlciBEcm9wZG93bnNcclxuICAgIHZhciBoYW5kbGVEcm9wZG93bkhvdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnW2RhdGEtaG92ZXI9XCJkcm9wZG93blwiXScpLm5vdCgnLmhvdmVyLWluaXRpYWxpemVkJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5kcm9wZG93bkhvdmVyKCk7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyLWluaXRpYWxpemVkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZSB0ZXh0YXJlYSBhdXRvc2l6ZVxyXG4gICAgdmFyIGhhbmRsZVRleHRhcmVhQXV0b3NpemUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodHlwZW9mKGF1dG9zaXplKSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgYXV0b3NpemUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEuYXV0b3NpemVtZScpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgUG9wb3ZlcnNcclxuXHJcbiAgICAvLyBsYXN0IHBvcGVwIHBvcG92ZXJcclxuICAgIHZhciBsYXN0UG9wZWRQb3BvdmVyO1xyXG5cclxuICAgIHZhciBoYW5kbGVQb3BvdmVycyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5wb3BvdmVycycpLnBvcG92ZXIoKTtcclxuXHJcbiAgICAgICAgLy8gY2xvc2UgbGFzdCBkaXNwbGF5ZWQgcG9wb3ZlclxyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMucG9wb3Zlci5kYXRhLWFwaScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKGxhc3RQb3BlZFBvcG92ZXIpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RQb3BlZFBvcG92ZXIucG9wb3ZlcignaGlkZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgc2Nyb2xsYWJsZSBjb250ZW50cyB1c2luZyBqUXVlcnkgU2xpbVNjcm9sbCBwbHVnaW4uXHJcbiAgICB2YXIgaGFuZGxlU2Nyb2xsZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoJy5zY3JvbGxlcicpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIEltYWdlIFByZXZpZXcgdXNpbmcgalF1ZXJ5IEZhbmN5Ym94IHBsdWdpblxyXG4gICAgdmFyIGhhbmRsZUZhbmN5Ym94ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCFqUXVlcnkuZmFuY3lib3gpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoXCIuZmFuY3lib3gtYnV0dG9uXCIpLnNpemUoKSA+IDApIHtcclxuICAgICAgICAgICAgJChcIi5mYW5jeWJveC1idXR0b25cIikuZmFuY3lib3goe1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBBdHRyOiAnZGF0YS1yZWwnLFxyXG4gICAgICAgICAgICAgICAgcHJldkVmZmVjdDogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgbmV4dEVmZmVjdDogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgY2xvc2VCdG46IHRydWUsXHJcbiAgICAgICAgICAgICAgICBoZWxwZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luc2lkZSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gRml4IGlucHV0IHBsYWNlaG9sZGVyIGlzc3VlIGZvciBJRTggYW5kIElFOVxyXG4gICAgdmFyIGhhbmRsZUZpeElucHV0UGxhY2Vob2xkZXJGb3JJRSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vZml4IGh0bWw1IHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBmb3IgaWU3ICYgaWU4XHJcbiAgICAgICAgaWYgKGlzSUU4IHx8IGlzSUU5KSB7IC8vIGllOCAmIGllOVxyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGh0bWw1IHBsYWNlaG9sZGVyIGZpeCBmb3IgaW5wdXRzLCBpbnB1dHMgd2l0aCBwbGFjZWhvbGRlci1uby1maXggY2xhc3Mgd2lsbCBiZSBza2lwcGVkKGUuZzogd2UgbmVlZCB0aGlzIGZvciBwYXNzd29yZCBmaWVsZHMpXHJcbiAgICAgICAgICAgICQoJ2lucHV0W3BsYWNlaG9sZGVyXTpub3QoLnBsYWNlaG9sZGVyLW5vLWZpeCksIHRleHRhcmVhW3BsYWNlaG9sZGVyXTpub3QoLnBsYWNlaG9sZGVyLW5vLWZpeCknKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsKCkgPT09ICcnICYmIGlucHV0LmF0dHIoXCJwbGFjZWhvbGRlclwiKSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dC5hZGRDbGFzcyhcInBsYWNlaG9sZGVyXCIpLnZhbChpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpbnB1dC5mb2N1cyhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsKCkgPT0gaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlucHV0LmJsdXIoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbCgpID09PSAnJyB8fCBpbnB1dC52YWwoKSA9PSBpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbChpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGUgU2VsZWN0MiBEcm9wZG93bnNcclxuICAgIHZhciBoYW5kbGVTZWxlY3QyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQoKS5zZWxlY3QyKSB7XHJcbiAgICAgICAgICAgICQoJy5zZWxlY3QybWUnKS5zZWxlY3QyKHtcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlNlbGVjdFwiLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dDbGVhcjogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGhhbmRsZSBncm91cCBlbGVtZW50IGhlaWdodHNcclxuICAgIHZhciBoYW5kbGVIZWlnaHQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICQoJ1tkYXRhLWF1dG8taGVpZ2h0XScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSAkKCdbZGF0YS1oZWlnaHRdJywgcGFyZW50KTtcclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBtb2RlID0gcGFyZW50LmF0dHIoJ2RhdGEtbW9kZScpO1xyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gcGFyc2VJbnQocGFyZW50LmF0dHIoJ2RhdGEtb2Zmc2V0JykgPyBwYXJlbnQuYXR0cignZGF0YS1vZmZzZXQnKSA6IDApO1xyXG5cclxuICAgICAgICAgICAgaXRlbXMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtaGVpZ2h0JykgPT0gXCJoZWlnaHRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdoZWlnaHQnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdtaW4taGVpZ2h0JywgJycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHRfID0gKG1vZGUgPT0gJ2Jhc2UtaGVpZ2h0JyA/ICQodGhpcykub3V0ZXJIZWlnaHQoKSA6ICQodGhpcykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGhlaWdodF8gPiBoZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHRfO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCArIG9mZnNldDtcclxuXHJcbiAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLWhlaWdodCcpID09IFwiaGVpZ2h0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ21pbi1oZWlnaHQnLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vKiBFTkQ6Q09SRSBIQU5ETEVSUyAqLy9cclxuXHJcbiAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgdGhlIHRoZW1lXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vSU1QT1JUQU5UISEhOiBEbyBub3QgbW9kaWZ5IHRoZSBjb3JlIGhhbmRsZXJzIGNhbGwgb3JkZXIuXHJcblxyXG4gICAgICAgICAgICAvL0NvcmUgaGFuZGxlcnNcclxuICAgICAgICAgICAgaGFuZGxlSW5pdCgpOyAvLyBpbml0aWFsaXplIGNvcmUgdmFyaWFibGVzXHJcbiAgICAgICAgICAgIGhhbmRsZU9uUmVzaXplKCk7IC8vIHNldCBhbmQgaGFuZGxlIHJlc3BvbnNpdmVcclxuXHJcbiAgICAgICAgICAgIC8vVUkgQ29tcG9uZW50IGhhbmRsZXJzXHJcbiAgICAgICAgICAgIGhhbmRsZU1hdGVyaWFsRGVzaWduKCk7IC8vIGhhbmRsZSBtYXRlcmlhbCBkZXNpZ25cclxuICAgICAgICAgICAgaGFuZGxlVW5pZm9ybSgpOyAvLyBoYW5mbGUgY3VzdG9tIHJhZGlvICYgY2hlY2tib3hlc1xyXG4gICAgICAgICAgICBoYW5kbGVpQ2hlY2soKTsgLy8gaGFuZGxlcyBjdXN0b20gaWNoZWNrIHJhZGlvIGFuZCBjaGVja2JveGVzXHJcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcFN3aXRjaCgpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHN3aXRjaCBwbHVnaW5cclxuICAgICAgICAgICAgaGFuZGxlU2Nyb2xsZXJzKCk7IC8vIGhhbmRsZXMgc2xpbSBzY3JvbGxpbmcgY29udGVudHNcclxuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTsgLy8gaGFuZGxlIGZhbmN5IGJveFxyXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3QyKCk7IC8vIGhhbmRsZSBjdXN0b20gU2VsZWN0MiBkcm9wZG93bnNcclxuICAgICAgICAgICAgaGFuZGxlUG9ydGxldFRvb2xzKCk7IC8vIGhhbmRsZXMgcG9ydGxldCBhY3Rpb24gYmFyIGZ1bmN0aW9uYWxpdHkocmVmcmVzaCwgY29uZmlndXJlLCB0b2dnbGUsIHJlbW92ZSlcclxuICAgICAgICAgICAgaGFuZGxlQWxlcnRzKCk7IC8vaGFuZGxlIGNsb3NhYmxlZCBhbGVydHNcclxuICAgICAgICAgICAgaGFuZGxlRHJvcGRvd25zKCk7IC8vIGhhbmRsZSBkcm9wZG93bnNcclxuICAgICAgICAgICAgaGFuZGxlVGFicygpOyAvLyBoYW5kbGUgdGFic1xyXG4gICAgICAgICAgICBoYW5kbGVUb29sdGlwcygpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHRvb2x0aXBzXHJcbiAgICAgICAgICAgIGhhbmRsZVBvcG92ZXJzKCk7IC8vIGhhbmRsZXMgYm9vdHN0cmFwIHBvcG92ZXJzXHJcbiAgICAgICAgICAgIGhhbmRsZUFjY29yZGlvbnMoKTsgLy9oYW5kbGVzIGFjY29yZGlvbnNcclxuICAgICAgICAgICAgaGFuZGxlTW9kYWxzKCk7IC8vIGhhbmRsZSBtb2RhbHNcclxuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uKCk7IC8vIGhhbmRsZSBib290c3RyYXAgY29uZmlybWF0aW9uc1xyXG4gICAgICAgICAgICBoYW5kbGVUZXh0YXJlYUF1dG9zaXplKCk7IC8vIGhhbmRsZSBhdXRvc2l6ZSB0ZXh0YXJlYXNcclxuXHJcbiAgICAgICAgICAgIC8vSGFuZGxlIGdyb3VwIGVsZW1lbnQgaGVpZ2h0c1xyXG4gICAgICAgICAgICBoYW5kbGVIZWlnaHQoKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRSZXNpemVIYW5kbGVyKGhhbmRsZUhlaWdodCk7IC8vIGhhbmRsZSBhdXRvIGNhbGN1bGF0aW5nIGhlaWdodCBvbiB3aW5kb3cgcmVzaXplXHJcblxyXG4gICAgICAgICAgICAvLyBIYWNrc1xyXG4gICAgICAgICAgICBoYW5kbGVGaXhJbnB1dFBsYWNlaG9sZGVyRm9ySUUoKTsgLy9JRTggJiBJRTkgaW5wdXQgcGxhY2Vob2xkZXIgaXNzdWUgZml4XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIGNvcmUgamF2YXNjcmlwdCBhZnRlciBhamF4IGNvbXBsZXRlXHJcbiAgICAgICAgaW5pdEFqYXg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVVbmlmb3JtKCk7IC8vIGhhbmRsZXMgY3VzdG9tIHJhZGlvICYgY2hlY2tib3hlc1xyXG4gICAgICAgICAgICBoYW5kbGVpQ2hlY2soKTsgLy8gaGFuZGxlcyBjdXN0b20gaWNoZWNrIHJhZGlvIGFuZCBjaGVja2JveGVzXHJcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcFN3aXRjaCgpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHN3aXRjaCBwbHVnaW5cclxuICAgICAgICAgICAgaGFuZGxlRHJvcGRvd25Ib3ZlcigpOyAvLyBoYW5kbGVzIGRyb3Bkb3duIGhvdmVyXHJcbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbGVycygpOyAvLyBoYW5kbGVzIHNsaW0gc2Nyb2xsaW5nIGNvbnRlbnRzXHJcbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdDIoKTsgLy8gaGFuZGxlIGN1c3RvbSBTZWxlY3QyIGRyb3Bkb3duc1xyXG4gICAgICAgICAgICBoYW5kbGVGYW5jeWJveCgpOyAvLyBoYW5kbGUgZmFuY3kgYm94XHJcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3ducygpOyAvLyBoYW5kbGUgZHJvcGRvd25zXHJcbiAgICAgICAgICAgIGhhbmRsZVRvb2x0aXBzKCk7IC8vIGhhbmRsZSBib290c3RyYXAgdG9vbHRpcHNcclxuICAgICAgICAgICAgaGFuZGxlUG9wb3ZlcnMoKTsgLy8gaGFuZGxlcyBib290c3RyYXAgcG9wb3ZlcnNcclxuICAgICAgICAgICAgaGFuZGxlQWNjb3JkaW9ucygpOyAvL2hhbmRsZXMgYWNjb3JkaW9uc1xyXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBDb25maXJtYXRpb24oKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBjb25maXJtYXRpb25zXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9pbml0IG1haW4gY29tcG9uZW50c1xyXG4gICAgICAgIGluaXRDb21wb25lbnRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0QWpheCgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIHJlbWVtYmVyIGxhc3Qgb3BlbmVkIHBvcG92ZXIgdGhhdCBuZWVkcyB0byBiZSBjbG9zZWQgb24gY2xpY2tcclxuICAgICAgICBzZXRMYXN0UG9wZWRQb3BvdmVyOiBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICBsYXN0UG9wZWRQb3BvdmVyID0gZWw7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gYWRkIGNhbGxiYWNrIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgb24gd2luZG93IHJlc2l6ZVxyXG4gICAgICAgIGFkZFJlc2l6ZUhhbmRsZXI6IGZ1bmN0aW9uKGZ1bmMpIHtcclxuICAgICAgICAgICAgcmVzaXplSGFuZGxlcnMucHVzaChmdW5jKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBmdW5jdG9uIHRvIGNhbGwgX3J1bnJlc2l6ZUhhbmRsZXJzXHJcbiAgICAgICAgcnVuUmVzaXplSGFuZGxlcnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gc2Nyb2xsKGZvY3VzKSB0byBhbiBlbGVtZW50XHJcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uKGVsLCBvZmZlc2V0KSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSAoZWwgJiYgZWwuc2l6ZSgpID4gMCkgPyBlbC5vZmZzZXQoKS50b3AgOiAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWhlYWRlci1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyJykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItdG9wLWZpeGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBwb3MgLSAkKCcucGFnZS1oZWFkZXItdG9wJykuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItbWVudS1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyLW1lbnUnKS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBvcyA9IHBvcyArIChvZmZlc2V0ID8gb2ZmZXNldCA6IC0xICogZWwuaGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcG9zXHJcbiAgICAgICAgICAgIH0sICdzbG93Jyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdFNsaW1TY3JvbGw6IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICQoZWwpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gZXhpdFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaGVpZ2h0XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1oZWlnaHRcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9ICQodGhpcykuY3NzKCdoZWlnaHQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbG93UGFnZVNjcm9sbDogdHJ1ZSwgLy8gYWxsb3cgcGFnZSBzY3JvbGwgd2hlbiB0aGUgZWxlbWVudCBzY3JvbGwgaXMgZW5kZWRcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiAnN3B4JyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogKCQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIikgOiAnI2JiYicpLFxyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXJDbGFzczogKCQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKSA/ICQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKSA6ICdzbGltU2Nyb2xsRGl2JyksXHJcbiAgICAgICAgICAgICAgICAgICAgcmFpbENvbG9yOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLWNvbG9yXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLWNvbG9yXCIpIDogJyNlYWVhZWEnKSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogaXNSVEwgPyAnbGVmdCcgOiAncmlnaHQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIGFsd2F5c1Zpc2libGU6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLWFsd2F5cy12aXNpYmxlXCIpID09IFwiMVwiID8gdHJ1ZSA6IGZhbHNlKSxcclxuICAgICAgICAgICAgICAgICAgICByYWlsVmlzaWJsZTogKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC12aXNpYmxlXCIpID09IFwiMVwiID8gdHJ1ZSA6IGZhbHNlKSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlRmFkZU91dDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiLCBcIjFcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRlc3Ryb3lTbGltU2Nyb2xsOiBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAkKGVsKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIikgPT09IFwiMVwiKSB7IC8vIGRlc3Ryb3kgZXhpc3RpbmcgaW5zdGFuY2UgYmVmb3JlIHVwZGF0aW5nIHRoZSBoZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQXR0cihcInN0eWxlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ckxpc3QgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgdGhlIGN1c3RvbSBhdHRyaWJ1cmVzIHNvIGxhdGVyIHdlIHdpbGwgcmVhc3NpZ24uXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1oYW5kbGUtY29sb3JcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtd3JhcHBlci1jbGFzc1wiXSA9ICQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtcmFpbC1jb2xvclwiXSA9ICQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLWFsd2F5cy12aXNpYmxlXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1hbHdheXMtdmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC12aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1yYWlsLXZpc2libGVcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2xpbVNjcm9sbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBwZXJDbGFzczogKCQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKSA/ICQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKSA6ICdzbGltU2Nyb2xsRGl2JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlYXNzaWduIGN1c3RvbSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGF0dHJMaXN0LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZS5hdHRyKGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gZnVuY3Rpb24gdG8gc2Nyb2xsIHRvIHRoZSB0b3BcclxuICAgICAgICBzY3JvbGxUb3A6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byAgYmxvY2sgZWxlbWVudChpbmRpY2F0ZSBsb2FkaW5nKVxyXG4gICAgICAgIGJsb2NrVUk6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSAnJztcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYW5pbWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPicgKyAnPGRpdiBjbGFzcz1cImJsb2NrLXNwaW5uZXItYmFyXCI+PGRpdiBjbGFzcz1cImJvdW5jZTFcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlMlwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UzXCI+PC9kaXY+PC9kaXY+JyArICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaWNvbk9ubHkpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48aW1nIHNyYz1cIicgKyB0aGlzLmdldEdsb2JhbEltZ1BhdGgoKSArICdsb2FkaW5nLXNwaW5uZXItZ3JleS5naWZcIiBhbGlnbj1cIlwiPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy50ZXh0T25seSkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPjxzcGFuPiZuYnNwOyZuYnNwOycgKyAob3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xPQURJTkcuLi4nKSArICc8L3NwYW4+PC9kaXY+JztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48aW1nIHNyYz1cIicgKyB0aGlzLmdldEdsb2JhbEltZ1BhdGgoKSArICdsb2FkaW5nLXNwaW5uZXItZ3JleS5naWZcIiBhbGlnbj1cIlwiPjxzcGFuPiZuYnNwOyZuYnNwOycgKyAob3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xPQURJTkcuLi4nKSArICc8L3NwYW4+PC9kaXY+JztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7IC8vIGVsZW1lbnQgYmxvY2tpbmdcclxuICAgICAgICAgICAgICAgIHZhciBlbCA9ICQob3B0aW9ucy50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsLmhlaWdodCgpIDw9ICgkKHdpbmRvdykuaGVpZ2h0KCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jZW5yZXJZID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsLmJsb2NrKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBodG1sLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhc2VaOiBvcHRpb25zLnpJbmRleCA/IG9wdGlvbnMuekluZGV4IDogMTAwMCxcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXJZOiBvcHRpb25zLmNlbnJlclkgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2VucmVyWSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICcxMCUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNTUzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG9wdGlvbnMub3ZlcmxheUNvbG9yID8gb3B0aW9ucy5vdmVybGF5Q29sb3IgOiAnIzU1NScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IG9wdGlvbnMuYm94ZWQgPyAwLjA1IDogMC4xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICd3YWl0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBwYWdlIGJsb2NraW5nXHJcbiAgICAgICAgICAgICAgICAkLmJsb2NrVUkoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGh0bWwsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFzZVo6IG9wdGlvbnMuekluZGV4ID8gb3B0aW9ucy56SW5kZXggOiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGNzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNTUzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG9wdGlvbnMub3ZlcmxheUNvbG9yID8gb3B0aW9ucy5vdmVybGF5Q29sb3IgOiAnIzU1NScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IG9wdGlvbnMuYm94ZWQgPyAwLjA1IDogMC4xLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICd3YWl0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvICB1bi1ibG9jayBlbGVtZW50KGZpbmlzaCBsb2FkaW5nKVxyXG4gICAgICAgIHVuYmxvY2tVSTogZnVuY3Rpb24odGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICQodGFyZ2V0KS51bmJsb2NrKHtcclxuICAgICAgICAgICAgICAgICAgICBvblVuYmxvY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRhcmdldCkuY3NzKCdwb3NpdGlvbicsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YXJnZXQpLmNzcygnem9vbScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQudW5ibG9ja1VJKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdGFydFBhZ2VMb2FkaW5nOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYW5pbWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2Utc3Bpbm5lci1iYXInKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJwYWdlLXNwaW5uZXItYmFyXCI+PGRpdiBjbGFzcz1cImJvdW5jZTFcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlMlwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UzXCI+PC9kaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1sb2FkaW5nJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGFnZS1sb2FkaW5nXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIvPiZuYnNwOyZuYnNwOzxzcGFuPicgKyAob3B0aW9ucyAmJiBvcHRpb25zLm1lc3NhZ2UgPyBvcHRpb25zLm1lc3NhZ2UgOiAnTG9hZGluZy4uLicpICsgJzwvc3Bhbj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHN0b3BQYWdlTG9hZGluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJy5wYWdlLWxvYWRpbmcsIC5wYWdlLXNwaW5uZXItYmFyJykucmVtb3ZlKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYWxlcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXI6IFwiXCIsIC8vIGFsZXJ0cyBwYXJlbnQgY29udGFpbmVyKGJ5IGRlZmF1bHQgcGxhY2VkIGFmdGVyIHRoZSBwYWdlIGJyZWFkY3J1bWJzKVxyXG4gICAgICAgICAgICAgICAgcGxhY2U6IFwiYXBwZW5kXCIsIC8vIFwiYXBwZW5kXCIgb3IgXCJwcmVwZW5kXCIgaW4gY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsIC8vIGFsZXJ0J3MgdHlwZVxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJcIiwgLy8gYWxlcnQncyBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICBjbG9zZTogdHJ1ZSwgLy8gbWFrZSBhbGVydCBjbG9zYWJsZVxyXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHRydWUsIC8vIGNsb3NlIGFsbCBwcmV2aW91c2UgYWxlcnRzIGZpcnN0XHJcbiAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSwgLy8gYXV0byBzY3JvbGwgdG8gdGhlIGFsZXJ0IGFmdGVyIHNob3duXHJcbiAgICAgICAgICAgICAgICBjbG9zZUluU2Vjb25kczogMCwgLy8gYXV0byBjbG9zZSBhZnRlciBkZWZpbmVkIHNlY29uZHNcclxuICAgICAgICAgICAgICAgIGljb246IFwiXCIgLy8gcHV0IGljb24gYmVmb3JlIHRoZSBtZXNzYWdlXHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlkID0gTWV0cm9uaWMuZ2V0VW5pcXVlSUQoXCJNZXRyb25pY19hbGVydFwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJzxkaXYgaWQ9XCInICsgaWQgKyAnXCIgY2xhc3M9XCJNZXRyb25pYy1hbGVydHMgYWxlcnQgYWxlcnQtJyArIG9wdGlvbnMudHlwZSArICcgZmFkZSBpblwiPicgKyAob3B0aW9ucy5jbG9zZSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2J1dHRvbj4nIDogJycpICsgKG9wdGlvbnMuaWNvbiAhPT0gXCJcIiA/ICc8aSBjbGFzcz1cImZhLWxnIGZhIGZhLScgKyBvcHRpb25zLmljb24gKyAnXCI+PC9pPiAgJyA6ICcnKSArIG9wdGlvbnMubWVzc2FnZSArICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucmVzZXQpIHtcclxuICAgICAgICAgICAgICAgICQoJy5NZXRyb25pYy1hbGVydHMnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtY29udGFpbmVyLWJnLXNvbGlkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtdGl0bGUnKS5hZnRlcihodG1sKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWJhcicpLnNpemUoKSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtYmFyJykuYWZ0ZXIoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtYnJlYWRjcnVtYicpLmFmdGVyKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnBsYWNlID09IFwiYXBwZW5kXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKG9wdGlvbnMuY29udGFpbmVyKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQob3B0aW9ucy5jb250YWluZXIpLnByZXBlbmQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmZvY3VzKSB7XHJcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygkKCcjJyArIGlkKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNsb3NlSW5TZWNvbmRzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjJyArIGlkKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuY2xvc2VJblNlY29uZHMgKiAxMDAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGluaXRpYWxpemVzIHVuaWZvcm0gZWxlbWVudHNcclxuICAgICAgICBpbml0VW5pZm9ybTogZnVuY3Rpb24oZWxzKSB7XHJcbiAgICAgICAgICAgIGlmIChlbHMpIHtcclxuICAgICAgICAgICAgICAgICQoZWxzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudHMoXCIuY2hlY2tlclwiKS5zaXplKCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudW5pZm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlVW5pZm9ybSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy93ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gdXBkYXRlL3N5bmMganF1ZXJ5IHVuaWZvcm0gY2hlY2tib3ggJiByYWRpb3NcclxuICAgICAgICB1cGRhdGVVbmlmb3JtOiBmdW5jdGlvbihlbHMpIHtcclxuICAgICAgICAgICAgJC51bmlmb3JtLnVwZGF0ZShlbHMpOyAvLyB1cGRhdGUgdGhlIHVuaWZvcm0gY2hlY2tib3ggJiByYWRpb3MgVUkgYWZ0ZXIgdGhlIGFjdHVhbCBpbnB1dCBjb250cm9sIHN0YXRlIGNoYW5nZWRcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBpbml0aWFsaXplIHRoZSBmYW5jeWJveCBwbHVnaW5cclxuICAgICAgICBpbml0RmFuY3lib3g6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVGYW5jeWJveCgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vcHVibGljIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgYWN0dWFsIGlucHV0IHZhbHVlKHVzZWQgaW4gSUU5IGFuZCBJRTggZHVlIHRvIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBub3Qgc3VwcG9ydGVkKVxyXG4gICAgICAgIGdldEFjdHVhbFZhbDogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgZWwgPSAkKGVsKTtcclxuICAgICAgICAgICAgaWYgKGVsLnZhbCgpID09PSBlbC5hdHRyKFwicGxhY2Vob2xkZXJcIikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlbC52YWwoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBnZXQgYSBwYXJlbWV0ZXIgYnkgbmFtZSBmcm9tIFVSTFxyXG4gICAgICAgIGdldFVSTFBhcmFtZXRlcjogZnVuY3Rpb24ocGFyYW1OYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hTdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKSxcclxuICAgICAgICAgICAgICAgIGksIHZhbCwgcGFyYW1zID0gc2VhcmNoU3RyaW5nLnNwbGl0KFwiJlwiKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IHBhcmFtc1tpXS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsWzBdID09IHBhcmFtTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmVzY2FwZSh2YWxbMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGZvciBkZXZpY2UgdG91Y2ggc3VwcG9ydFxyXG4gICAgICAgIGlzVG91Y2hEZXZpY2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJUb3VjaEV2ZW50XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIFRvIGdldCB0aGUgY29ycmVjdCB2aWV3cG9ydCB3aWR0aCBiYXNlZCBvbiAgaHR0cDovL2FuZHlsYW5ndG9uLmNvLnVrL2FydGljbGVzL2phdmFzY3JpcHQvZ2V0LXZpZXdwb3J0LXNpemUtamF2YXNjcmlwdC9cclxuICAgICAgICBnZXRWaWV3UG9ydDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gd2luZG93LFxyXG4gICAgICAgICAgICAgICAgYSA9ICdpbm5lcic7XHJcbiAgICAgICAgICAgIGlmICghKCdpbm5lcldpZHRoJyBpbiB3aW5kb3cpKSB7XHJcbiAgICAgICAgICAgICAgICBhID0gJ2NsaWVudCc7XHJcbiAgICAgICAgICAgICAgICBlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogZVthICsgJ1dpZHRoJ10sXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGVbYSArICdIZWlnaHQnXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldFVuaXF1ZUlEOiBmdW5jdGlvbihwcmVmaXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdwcmVmaXhfJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGNoZWNrIElFOCBtb2RlXHJcbiAgICAgICAgaXNJRTg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNJRTg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gY2hlY2sgSUU5IG1vZGVcclxuICAgICAgICBpc0lFOTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpc0lFOTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL2NoZWNrIFJUTCBtb2RlXHJcbiAgICAgICAgaXNSVEw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNSVEw7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gY2hlY2sgSUU4IG1vZGVcclxuICAgICAgICBpc0FuZ3VsYXJKc0FwcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIGFuZ3VsYXIgPT0gJ3VuZGVmaW5lZCcpID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEFzc2V0c1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRBc3NldHNQYXRoOiBmdW5jdGlvbihwYXRoKSB7XHJcbiAgICAgICAgICAgIGFzc2V0c1BhdGggPSBwYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldEdsb2JhbEltZ1BhdGg6IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgZ2xvYmFsSW1nUGF0aCA9IHBhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0R2xvYmFsSW1nUGF0aDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhc3NldHNQYXRoICsgZ2xvYmFsSW1nUGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRHbG9iYWxQbHVnaW5zUGF0aDogZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICBnbG9iYWxQbHVnaW5zUGF0aCA9IHBhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0R2xvYmFsUGx1Z2luc1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbFBsdWdpbnNQYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdsb2JhbENzc1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbENzc1BhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gZ2V0IGxheW91dCBjb2xvciBjb2RlIGJ5IGNvbG9yIG5hbWVcclxuICAgICAgICBnZXRCcmFuZENvbG9yOiBmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChicmFuZENvbG9yc1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJyYW5kQ29sb3JzW25hbWVdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0UmVzcG9uc2l2ZUJyZWFrcG9pbnQ6IGZ1bmN0aW9uKHNpemUpIHtcclxuICAgICAgICAgICAgLy8gYm9vdHN0cmFwIHJlc3BvbnNpdmUgYnJlYWtwb2ludHNcclxuICAgICAgICAgICAgdmFyIHNpemVzID0ge1xyXG4gICAgICAgICAgICAgICAgJ3hzJyA6IDQ4MCwgICAgIC8vIGV4dHJhIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAnc20nIDogNzY4LCAgICAgLy8gc21hbGxcclxuICAgICAgICAgICAgICAgICdtZCcgOiA5OTIsICAgICAvLyBtZWRpdW1cclxuICAgICAgICAgICAgICAgICdsZycgOiAxMjAwICAgICAvLyBsYXJnZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNpemVzW3NpemVdID8gc2l6ZXNbc2l6ZV0gOiAwO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59ICgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRyb25pYzsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxuY29uc3QgTWV0cm9uaWMgPSByZXF1aXJlKCcuL21ldHJvbmljJylcclxuXHJcbi8qKlxyXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcclxuKiovXHJcbnZhciBRdWlja1NpZGViYXIgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gSGFuZGxlcyBxdWljayBzaWRlYmFyIHRvZ2dsZXJcclxuICAgIHZhciBoYW5kbGVRdWlja1NpZGViYXJUb2dnbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIHF1aWNrIHNpZGViYXIgdG9nZ2xlclxyXG4gICAgICAgICQoJy5wYWdlLWhlYWRlciAucXVpY2stc2lkZWJhci10b2dnbGVyLCAucGFnZS1xdWljay1zaWRlYmFyLXRvZ2dsZXInKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3BhZ2UtcXVpY2stc2lkZWJhci1vcGVuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgcXVpY2sgc2lkZWJhciBjaGF0c1xyXG4gICAgdmFyIGhhbmRsZVF1aWNrU2lkZWJhckNoYXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHdyYXBwZXIgPSAkKCcucGFnZS1xdWljay1zaWRlYmFyLXdyYXBwZXInKTtcclxuICAgICAgICB2YXIgd3JhcHBlckNoYXQgPSB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdCcpO1xyXG5cclxuICAgICAgICB2YXIgaW5pdENoYXRTbGltU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY2hhdFVzZXJzID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnMnKTtcclxuICAgICAgICAgICAgdmFyIGNoYXRVc2Vyc0hlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGNoYXRVc2Vyc0hlaWdodCA9IHdyYXBwZXIuaGVpZ2h0KCkgLSB3cmFwcGVyLmZpbmQoJy5uYXYtanVzdGlmaWVkID4gLm5hdi10YWJzJykub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNoYXQgdXNlciBsaXN0XHJcbiAgICAgICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKGNoYXRVc2Vycyk7XHJcbiAgICAgICAgICAgIGNoYXRVc2Vycy5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgY2hhdFVzZXJzSGVpZ2h0KTtcclxuICAgICAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoY2hhdFVzZXJzKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjaGF0TWVzc2FnZXMgPSB3cmFwcGVyQ2hhdC5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1tZXNzYWdlcycpO1xyXG4gICAgICAgICAgICB2YXIgY2hhdE1lc3NhZ2VzSGVpZ2h0ID0gY2hhdFVzZXJzSGVpZ2h0IC0gd3JhcHBlckNoYXQuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItZm9ybScpLm91dGVySGVpZ2h0KCkgLSB3cmFwcGVyQ2hhdC5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLW5hdicpLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyB1c2VyIGNoYXQgbWVzc2FnZXNcclxuICAgICAgICAgICAgTWV0cm9uaWMuZGVzdHJveVNsaW1TY3JvbGwoY2hhdE1lc3NhZ2VzKTtcclxuICAgICAgICAgICAgY2hhdE1lc3NhZ2VzLmF0dHIoXCJkYXRhLWhlaWdodFwiLCBjaGF0TWVzc2FnZXNIZWlnaHQpO1xyXG4gICAgICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbChjaGF0TWVzc2FnZXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluaXRDaGF0U2xpbVNjcm9sbCgpO1xyXG4gICAgICAgIE1ldHJvbmljLmFkZFJlc2l6ZUhhbmRsZXIoaW5pdENoYXRTbGltU2Nyb2xsKTsgLy8gcmVpbml0aWFsaXplIG9uIHdpbmRvdyByZXNpemVcclxuXHJcbiAgICAgICAgd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnMgLm1lZGlhLWxpc3QgPiAubWVkaWEnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdyYXBwZXJDaGF0LmFkZENsYXNzKFwicGFnZS1xdWljay1zaWRlYmFyLWNvbnRlbnQtaXRlbS1zaG93blwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlciAucGFnZS1xdWljay1zaWRlYmFyLWJhY2stdG8tbGlzdCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd3JhcHBlckNoYXQucmVtb3ZlQ2xhc3MoXCJwYWdlLXF1aWNrLXNpZGViYXItY29udGVudC1pdGVtLXNob3duXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgdGFza3NcclxuICAgIHZhciBoYW5kbGVRdWlja1NpZGViYXJBbGVydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHdyYXBwZXIgPSAkKCcucGFnZS1xdWljay1zaWRlYmFyLXdyYXBwZXInKTtcclxuICAgICAgICB2YXIgd3JhcHBlckFsZXJ0cyA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1hbGVydHMnKTtcclxuXHJcbiAgICAgICAgdmFyIGluaXRBbGVydHNTbGltU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYWxlcnRMaXN0ID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cy1saXN0Jyk7XHJcbiAgICAgICAgICAgIHZhciBhbGVydExpc3RIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBhbGVydExpc3RIZWlnaHQgPSB3cmFwcGVyLmhlaWdodCgpIC0gd3JhcHBlci5maW5kKCcubmF2LWp1c3RpZmllZCA+IC5uYXYtdGFicycpLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBhbGVydHMgbGlzdFxyXG4gICAgICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChhbGVydExpc3QpO1xyXG4gICAgICAgICAgICBhbGVydExpc3QuYXR0cihcImRhdGEtaGVpZ2h0XCIsIGFsZXJ0TGlzdEhlaWdodCk7XHJcbiAgICAgICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGFsZXJ0TGlzdCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5pdEFsZXJ0c1NsaW1TY3JvbGwoKTtcclxuICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGluaXRBbGVydHNTbGltU2Nyb2xsKTsgLy8gcmVpbml0aWFsaXplIG9uIHdpbmRvdyByZXNpemVcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL2xheW91dCBoYW5kbGVyc1xyXG4gICAgICAgICAgICBoYW5kbGVRdWlja1NpZGViYXJUb2dnbGVyKCk7IC8vIGhhbmRsZXMgcXVpY2sgc2lkZWJhcidzIHRvZ2dsZXJcclxuICAgICAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyQ2hhdCgpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyBjaGF0c1xyXG4gICAgICAgICAgICBoYW5kbGVRdWlja1NpZGViYXJBbGVydHMoKTsgLy8gaGFuZGxlcyBxdWljayBzaWRlYmFyJ3MgYWxlcnRzXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbn0gKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU2lkZWJhciIsImNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5cclxuY2xhc3MgQ29tbW9uIHtcclxuXHJcbiAgICBzdGF0aWMgc3BsaXRMaW5lcyh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQoL1xcbi8pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRFdmVudFRpbWUodCwgbm93KSB7XHJcbiAgICAgICAgbGV0IHRpbWUgPSBtb21lbnQodCwgJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyk7XHJcbiAgICAgICAgbGV0IG5vd3RpbWUgPSBtb21lbnQobm93LCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndDogICAgICAgJyArIHQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3c6ICAgICAnICsgbm93KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndGltZTogICAgJyArIHRpbWUuZm9ybWF0KCkpOyAvLyArICcgJyArIHRpbWUuaXNWYWxpZCgpKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm93dGltZTogJyArIG5vd3RpbWUuZm9ybWF0KCkpOyAvLyArICcgJyArIG5vd3RpbWUuaXNWYWxpZCgpKTtcclxuICAgICAgICByZXR1cm4gdGltZS5mcm9tKG5vd3RpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjbGFzc0lmKGtsYXNzLCBiKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2xhc3NJZjogJyArIGtsYXNzICsgJywgJyArIGIpO1xyXG4gICAgICAgIHJldHVybiAoYiA/IGtsYXNzIDogJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGF2b2lkICckYXBwbHkgYWxyZWFkeSBpbiBwcm9ncmVzcycgZXJyb3IgKHNvdXJjZTogaHR0cHM6Ly9jb2RlcndhbGwuY29tL3Avbmdpc21hKVxyXG4gICAgc3RhdGljIHNhZmVBcHBseShmbikge1xyXG4gICAgICAgIGlmIChmbiAmJiAodHlwZW9mIChmbikgPT09ICdmdW5jdGlvbicpKSB7XHJcbiAgICAgICAgICAgIGZuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHNvdXJjZTogaHR0cDovL2N0cmxxLm9yZy9jb2RlLzE5NjE2LWRldGVjdC10b3VjaC1zY3JlZW4tamF2YXNjcmlwdFxyXG4gICAgc3RhdGljIGlzVG91Y2hEZXZpY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCAobmF2aWdhdG9yLk1heFRvdWNoUG9pbnRzID4gMCkgfHwgKG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUaWNrc0Zyb21EYXRlKGRhdGUpIHtcclxuICAgICAgICBsZXQgcmV0ID0gbnVsbDtcclxuICAgICAgICBpZihkYXRlICYmIGRhdGUuZ2V0VGltZSkge1xyXG4gICAgICAgICAgICByZXQgPSBkYXRlLmdldFRpbWUoKS8xMDAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21tb247IiwiY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcclxuXHJcbmNsYXNzIFZpZGVvUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRpdklkLCBvcHRzID0geyBoZWlnaHQ6IDM5MCwgd2lkdGg6IDY0MCwgdmlkZW9JZDogJyd9KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGRpdklkXHJcbiAgICAgICAgdGhpcy5vcHRzID0gb3B0c1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxyXG4gICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICB0aGlzLl9vblJlYWR5ID0gdGhpcy5fb25SZWFkeSB8fCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB3YWl0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5ZVCAmJiB3aW5kb3cuWVQubG9hZGVkPT0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ZVCA9IHdpbmRvdy5ZVDtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHdpbmRvdy5ZVClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh3YWl0LCAyNTApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2FpdCgpXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllciA9IG5ldyB0aGlzLllULlBsYXllcih0aGlzLmlkLCB7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMub3B0cy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5vcHRzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgdmlkZW9JZDogdGhpcy5vcHRzLnZpZGVvSWQsXHJcbiAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvblJlYWR5OiB0aGlzLm9uUGxheWVyUmVhZHksXHJcbiAgICAgICAgICAgICAgICAgICAgb25TdGF0ZUNoYW5nZTogdGhpcy5vblBsYXllclN0YXRlQ2hhbmdlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUGxheWVyUmVhZHkoZXZlbnQpIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGxheVZpZGVvKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25QbGF5ZXJTdGF0ZUNoYW5nZShldmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC5kYXRhID09IFlvdVR1YmUuaW50ZWdyYXRpb24uUGxheWVyU3RhdGUuRU5ERUQpIHtcclxuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzRG9uZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb25lID09IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBzdG9wVmlkZW8oKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcFZpZGVvKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvUGxheWVyOyIsImlmICghU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxuICAgICAgICAgICAgICA6IG1hdGNoXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59IiwiY29uc3QgdXVpZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBoZXhEaWdpdHMsIGksIHMsIHV1aWQ7XHJcbiAgICBzID0gW107XHJcbiAgICBzLmxlbmd0aCA9IDM2O1xyXG4gICAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xyXG4gICAgaSA9IDA7XHJcbiAgICB3aGlsZSAoaSA8IDM2KSB7XHJcbiAgICAgICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpO1xyXG4gICAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIHNbMTRdID0gJzQnO1xyXG4gICAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpO1xyXG4gICAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJztcclxuICAgIHV1aWQgPSBzLmpvaW4oJycpO1xyXG4gICAgcmV0dXJuIHV1aWQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7Il19
