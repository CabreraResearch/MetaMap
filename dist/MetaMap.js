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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbi5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3B5TWFwLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQ291cnNlcy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0RlbGV0ZU1hcC5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0ZlZWRiYWNrLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvSG9tZS5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0xvZ291dC5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL015TWFwcy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL05ld01hcC5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL09wZW5NYXAuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9PcGVuVHJhaW5pbmcuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9TaGFyZU1hcC5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2FwcC9Db25maWcuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvYXBwL0V2ZW50ZXIuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2FwcC9JbnRlZ3JhdGlvbnMuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvYXBwL1Blcm1pc3Npb25zLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2FwcC9Sb3V0ZXIuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvYXBwL1NoYXJpbmcuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvYXBwL2F1dGgwLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2FwcC91c2VyLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2NhbnZhcy9jYW52YXMuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvY2FudmFzL2xheW91dC5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvYWN0aW9ucy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvY2FudmFzLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9jb25zdGFudHMuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2RzcnAuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VkaXRTdGF0dXMuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VsZW1lbnRzLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ldmVudHMuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL25vdGlmaWNhdGlvbi5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvcGFnZXMuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3JvdXRlcy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFicy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFncy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvQWRkVGhpcy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvR29vZ2xlLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Vc2VyU25hcC5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvWW91VHViZS5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvX0ludGVncmF0aW9uc0Jhc2UuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9ub2RlLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9xdWljay1zaWRlYmFyLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9yYXcuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvdGFncy9kaWFsb2dzL3NoYXJlLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLWhlbHAuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1wb2ludHMuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtdXNlci5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtYWN0aW9ucy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtYm9keS5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtY29udGFpbmVyLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1jb250ZW50LmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1mb290ZXIuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWhlYWRlci5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtbG9nby5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2Utc2VhcmNoLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1zaWRlYmFyLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS10b3BtZW51LmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvY291cnNlcy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL2hvbWUuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9teS1tYXBzLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdGVybXMuanMiLCIvVXNlcnMvY3Jmcm9laGxpY2gvRGV2ZWxvcG1lbnQvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy90cmFpbmluZy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9kZW1vLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3RlbXBsYXRlL2xheW91dC5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9tZXRyb25pYy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9xdWljay1zaWRlYmFyLmpzIiwiL1VzZXJzL2NyZnJvZWhsaWNoL0RldmVsb3BtZW50L01ldGFNYXAvc3JjL2pzL3Rvb2xzL0NvbW1vbi5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90b29scy9WaWRlb1BsYXllci5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90b29scy9zaGltcy5qcyIsIi9Vc2Vycy9jcmZyb2VobGljaC9EZXZlbG9wbWVudC9NZXRhTWFwL3NyYy9qcy90b29scy91dWlkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUEsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUIsT0FBTyxDQUFD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QUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsV0FBTyxJQUFJLENBQUM7Q0FDZixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJ2JhYmVsL3BvbHlmaWxsJyk7XG5yZXF1aXJlKCdjb3JlLWpzJyk7XG53aW5kb3cuJCA9IHdpbmRvdy5qUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbnJlcXVpcmUoJ2pxdWVyeS11aScpO1xucmVxdWlyZSgnYm9vdHN0cmFwJyk7XG53aW5kb3cucmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbndpbmRvdy5fID0gcmVxdWlyZSgnbG9kYXNoJyk7XG53aW5kb3cuUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5cbmNvbnN0IEF1dGgwID0gcmVxdWlyZSgnLi9qcy9hcHAvYXV0aDAnKTtcbmNvbnN0IFVzZXIgPSByZXF1aXJlKCcuL2pzL2FwcC91c2VyLmpzJyk7XG5jb25zdCBSb3V0ZXIgPSByZXF1aXJlKCcuL2pzL2FwcC9Sb3V0ZXIuanMnKTtcbmNvbnN0IEV2ZW50ZXIgPSByZXF1aXJlKCcuL2pzL2FwcC9FdmVudGVyLmpzJyk7XG5jb25zdCBQYWdlRmFjdG9yeSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvUGFnZUZhY3RvcnkuanMnKTtcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XG5jb25zdCBDb25maWcgPSByZXF1aXJlKCcuL2pzL2FwcC8vQ29uZmlnLmpzJyk7XG5jb25zdCBnYSA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcycpO1xuY29uc3Qgc2hpbXMgPSByZXF1aXJlKCcuL2pzL3Rvb2xzL3NoaW1zLmpzJyk7XG5jb25zdCBBaXJicmFrZUNsaWVudCA9IHJlcXVpcmUoJ2FpcmJyYWtlLWpzJylcbmNvbnN0IEludGVncmF0aW9ucyA9IHJlcXVpcmUoJy4vanMvYXBwL0ludGVncmF0aW9ucycpXG5cbmNsYXNzIE1ldGFNYXAge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuQ29uZmlnID0gbmV3IENvbmZpZygpO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IHRoaXMuQ29uZmlnLmNvbmZpZztcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IHRoaXMuQ29uZmlnLk1ldGFGaXJlO1xuICAgICAgICB0aGlzLkV2ZW50ZXIgPSBuZXcgRXZlbnRlcih0aGlzKTtcbiAgICAgICAgdGhpcy5haXJicmFrZSA9IG5ldyBBaXJicmFrZUNsaWVudCh7IHByb2plY3RJZDogMTE0OTAwLCBwcm9qZWN0S2V5OiAnZGM5NjExZGI2Zjc3MTIwY2NlY2QxYTI3Mzc0NWE1YWUnIH0pO1xuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIFByb21pc2Uub25Qb3NzaWJseVVuaGFuZGxlZFJlamVjdGlvbihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoYXQuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbmZpZy5vblJlYWR5KCkudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAoY29uZmlnLmF1dGgwKTtcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuQXV0aDAubG9naW4oKS50aGVuKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dpbigpLnRoZW4oKGF1dGgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Vc2VyID0gbmV3IFVzZXIocHJvZmlsZSwgYXV0aCwgdGhpcy5FdmVudGVyLCB0aGlzLk1ldGFGaXJlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMgPSBuZXcgSW50ZWdyYXRpb25zKHRoaXMsIHRoaXMuVXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlci5vblJlYWR5KCkudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYWdlRmFjdG9yeSA9IG5ldyBQYWdlRmFjdG9yeSh0aGlzLkV2ZW50ZXIsIHRoaXMuTWV0YUZpcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb3V0ZXIgPSBuZXcgUm91dGVyKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb3V0ZXIuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgZGVidWcoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdC5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKVxuICAgIH1cblxuICAgIGxvZyh2YWwpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXZlbnQnLCAnbG9nJywgJ2xhYmVsJylcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuY29uc29sZS5pbmZvKHZhbCk7XG4gICAgfVxuXG4gICAgZXJyb3IodmFsKSB7XG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKHZhbCk7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHZhbCwgJ2V4Y2VwdGlvbicpXG4gICAgICAgICAgICB0aGlzLmFpcmJyYWtlLm5vdGlmeSh2YWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ291dCgpO1xuICAgICAgICB0aGlzLkF1dGgwLmxvZ291dCgpO1xuICAgIH1cbn1cblxuY29uc3QgbW0gPSBuZXcgTWV0YU1hcCgpO1xubW9kdWxlLmV4cG9ydHMgPSBtbTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNsYXNzIEFjdGlvbiBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLl9hY3Rpb25zID0ge307XG4gICAgfVxuXG4gICAgX2dldEFjdGlvbihhY3Rpb24pIHtcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuX2FjdGlvbnNbYWN0aW9uXTtcbiAgICAgICAgaWYgKCFyZXQpIHtcbiAgICAgICAgICAgIGxldCBNZXRob2QgPSBudWxsO1xuICAgICAgICAgICAgc3dpdGNoKGFjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuT1BFTl9NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vT3Blbk1hcC5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlRSQUlOSU5HUzpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9PcGVuVHJhaW5pbmcuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ORVdfTUFQOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL05ld01hcC5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0NvcHlNYXAuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5DT1VSU0VfTElTVDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Db3Vyc2VzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9EZWxldGVNYXAuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5NWV9NQVBTOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL015TWFwcy5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Mb2dvdXQuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vU2hhcmVNYXAnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5URVJNU19BTkRfQ09ORElUSU9OUzpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9UZXJtcy5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0ZlZWRiYWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vSG9tZS5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNZXRob2QpIHtcbiAgICAgICAgICAgICAgICByZXQgPSBuZXcgTWV0aG9kKHRoaXMubWV0YUZpcmUsIHRoaXMuZXZlbnRlciwgdGhpcy5wYWdlRmFjdG9yeSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1thY3Rpb25dID0gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgYWN0KGFjdGlvbiwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdCgpO1xuICAgICAgICBsZXQgbWV0aG9kID0gdGhpcy5fZ2V0QWN0aW9uKGFjdGlvbik7XG4gICAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYWN0KC4uLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247IiwiY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihtZXRhRmlyZSwgZXZlbnRlciwgcGFnZUZhY3RvcnkpIHtcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xuICAgICAgICB0aGlzLnBhZ2VGYWN0b3J5ID0gcGFnZUZhY3Rvcnk7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdG9nZ2xlU2lkZWJhcigpIHtcbiAgICAgICAgaWYodGhpcy5zaWRlYmFyT3Blbikge1xuICAgICAgICAgICAgdGhpcy5vcGVuU2lkZWJhcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW5TaWRlYmFyKCkge1xuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOKTtcbiAgICB9XG5cbiAgICBjbG9zZVNpZGViYXIoKSB7XG4gICAgICAgIHRoaXMuc2lkZWJhck9wZW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbkJhc2U7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBDb3B5TWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdNdXN0IGhhdmUgYSBtYXAgaW4gb3JkZXIgdG8gY29weS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChvbGRNYXApID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogYCR7bmV3IERhdGUoKX1gLFxuICAgICAgICAgICAgICAgIG93bmVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogdGhpcy5hcHBlbmRDb3B5KG9sZE1hcC5uYW1lKSxcbiAgICAgICAgICAgICAgICBzaGFyZWRfd2l0aDoge1xuICAgICAgICAgICAgICAgICAgICBhZG1pbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICcqJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogZmFsc2UgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke2lkfWApLnRoZW4oKG9sZE1hcERhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcHVzaFN0YXRlID0gdGhpcy5tZXRhRmlyZS5wdXNoRGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfWApO1xuICAgICAgICAgICAgICAgIGxldCBtYXBJZCA9IHB1c2hTdGF0ZS5rZXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEob2xkTWFwRGF0YSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHttYXBJZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXBwZW5kQ29weShzdHIpIHtcbiAgICAgICAgbGV0IHJldCA9IHN0cjtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHN0ciwgJyhDb3B5JykpIHtcbiAgICAgICAgICAgIHJldCA9IHJldCArICcgKENvcHkgMSknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1lc3MgPSBzdHIuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGxldCBjbnQgPSAyO1xuICAgICAgICAgICAgaWYgKG1lc3MubGVuZ3RoIC0gbWVzcy5sYXN0SW5kZXhPZignKENvcHknKSA8PSA0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGdyYmcgPSBtZXNzW21lc3MubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKGdyYmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JiZyA9IGdyYmcucmVwbGFjZSgnKScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgY250ID0gK2dyYmcgKyAxO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBtZXNzLnNsaWNlKDAsIG1lc3MubGVuZ3RoIC0gMikuam9pbignICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCArPSBgIChDb3B5ICR7Y250fSlgO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvcHlNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvY291cnNlcycpO1xuXG5jbGFzcyBDb3Vyc2VzIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xuICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuQ09VUlNFX0xJU1QpO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLlBBR0VTLkNPVVJTRV9MSVNULCB7IGlkOiBpZCB9LCAuLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ0NvdXJzZXMnIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvdXJzZXM7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5jbGFzcyBEZWxldGVNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgIERlbGV0ZU1hcC5kZWxldGVBbGwoW2lkXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBkZWxldGVBbGwoaWRzLCBwYXRoID0gQ09OU1RBTlRTLlBBR0VTLkhPTUUpIHtcbiAgICAgICAgY29uc3QgbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIF8uZWFjaChpZHMsIChpZCkgPT4ge1xuICAgICAgICAgICAgICAgIG1ldGFNYXAuTWV0YUZpcmUuZGVsZXRlRGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke2lkfWApO1xuICAgICAgICAgICAgICAgIG1ldGFNYXAuTWV0YUZpcmUuZGVsZXRlRGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgXG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBtZXRhTWFwLlJvdXRlci50byhwYXRoKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERlbGV0ZU1hcDsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5cbmNsYXNzIEZlZWRiYWNrIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB3aW5kb3cuVXNlclNuYXA7XG4gICAgfVxuXG4gICAgYWN0KCkge1xuICAgICAgICBzdXBlci5hY3QoKTtcbiAgICAgICAgdGhpcy51c2VyU25hcC5vcGVuUmVwb3J0V2luZG93KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGZWVkYmFjazsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCBob21lID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy9ob21lJyk7XG5cbmNsYXNzIEhvbWUgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5IT01FKTtcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdIb21lJyB9LCAuLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNsYXNzIExvZ291dCBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwLmpzJyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLm1ldGFNYXAubG9nb3V0KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2dvdXQ7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvbXktbWFwcycpO1xuXG5jbGFzcyBNeU1hcHMgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5NWV9NQVBTKTtcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5QQUdFUy5NWV9NQVBTLCB7IGlkOiBpZCB9LCAuLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ015IE1hcHMnIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTXlNYXBzOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY2xhc3MgTmV3TWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KCkge1xuICAgICAgICBzdXBlci5hY3QoKTtcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19ORVdfTUFQfWApLnRoZW4oKGJsYW5rTWFwKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3TWFwID0ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IGAke25ldyBEYXRlKCl9YCxcbiAgICAgICAgICAgICAgICBvd25lcjoge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5tZXRhTWFwLlVzZXIuZGlzcGxheU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMubWV0YU1hcC5Vc2VyLnBpY3R1cmVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6ICdOZXcgVW50aXRsZWQgTWFwJyxcbiAgICAgICAgICAgICAgICBzaGFyZWRfd2l0aDoge1xuICAgICAgICAgICAgICAgICAgICBhZG1pbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICcqJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogZmFsc2UgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBwdXNoU3RhdGUgPSB0aGlzLm1ldGFGaXJlLnB1c2hEYXRhKG5ld01hcCwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9YCk7XG4gICAgICAgICAgICBsZXQgbWFwSWQgPSBwdXNoU3RhdGUua2V5KCk7XG4gICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke21hcElkfWApO1xuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci50byhgbWFwLyR7bWFwSWR9YCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3TWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCBtZXRhQ2FudmFzID0gcmVxdWlyZSgnLi4vdGFncy9jYW52YXMvbWV0YS1jYW52YXMuanMnKTtcblxuY2xhc3MgT3Blbk1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigobWFwKSA9PiB7XG4gICAgICAgICAgICBpZiAobWFwKSB7XG4gICAgICAgICAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLk1FVEFfQ0FOVkFTKTtcbiAgICAgICAgICAgICAgICBtYXAuaWQgPSBpZDtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5OQVYsIENPTlNUQU5UUy5QQUdFUy5NQVAsIG1hcCwgLi4ucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIG1hcCwgLi4ucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5NQVAsIG1hcCwgLi4ucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPcGVuTWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UnKVxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5jb25zdCB0cmFpbmluZyA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvdHJhaW5pbmcnKVxuXG5jbGFzcyBPcGVuVHJhaW5pbmcgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgbGV0IHRhZyA9IHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5UUkFJTklORylbMF07XG4gICAgICAgICAgICB0YWcudXBkYXRlKHsgaWQ6IGlkIH0pO1xuICAgICAgICAgICAgdGhpcy5vcGVuU2lkZWJhcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPcGVuVHJhaW5pbmc7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xucmVxdWlyZSgnLi4vdGFncy9kaWFsb2dzL3NoYXJlJylcblxuY2xhc3MgU2hhcmVNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG1hcCkgPT4ge1xuICAgICAgICAgICAgbWFwLmlkID0gaWRcbiAgICAgICAgICAgIFNoYXJlTWFwLmFjdCh7IG1hcDogbWFwIH0pXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLmJhY2soKVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGFjdChtYXApIHtcbiAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgbGV0IG1vZGFsID0gcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuTUVUQV9NT0RBTF9ESUFMT0dfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuU0hBUkUpWzBdXG4gICAgICAgICAgICBtb2RhbC51cGRhdGUobWFwKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJlTWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IHRlcm1zID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy90ZXJtcycpO1xuXG5jbGFzcyBUZXJtcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLlRFUk1TKTtcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdUZXJtcyBhbmQgQ29uZGl0aW9ucycgfSwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlcm1zOyIsImNvbnN0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9GaXJlYmFzZScpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbmNvbnN0IGNvbmZpZyA9ICgpID0+IHtcbiAgICBjb25zdCBTSVRFUyA9IHtcbiAgICAgICAgQ1JMX1NUQUdJTkc6IHtcbiAgICAgICAgICAgIGRiOiAnbWV0YS1tYXAtc3RhZ2luZydcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJldCA9IHtcbiAgICAgICAgaG9zdDogd2luZG93LmxvY2F0aW9uLmhvc3QsXG4gICAgICAgIHNpdGU6IHt9XG4gICAgfVxuICAgIGxldCBzZWdtZW50cyA9IHJldC5ob3N0LnNwbGl0KCcuJyk7XG4gICAgbGV0IGZpcnN0ID0gc2VnbWVudHNbMF07XG4gICAgaWYgKGZpcnN0ID09PSAnd3d3Jykge1xuICAgICAgICBmaXJzdCA9IHNlZ21lbnRzWzFdO1xuICAgIH1cbiAgICBmaXJzdCA9IGZpcnN0LnNwbGl0KCc6JylbMF07XG5cbiAgICBzd2l0Y2ggKGZpcnN0LnRvTG93ZXJDYXNlKCkpIHtcblxuICAgICAgICBjYXNlICdsb2NhbGhvc3QnOlxuICAgICAgICBjYXNlICdtZXRhLW1hcC1zdGFnaW5nJzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldC5zaXRlID0gU0lURVMuQ1JMX1NUQUdJTkc7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuY2xhc3MgQ29uZmlnIHtcblxuICAgIGNvbnN0cnVjdG9yKHRhZ3MpIHtcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IG5ldyBNZXRhRmlyZSh0aGlzLmNvbmZpZyk7XG4gICAgfVxuXG4gICAgZ2V0IHNpdGUoKSB7XG4gICAgICAgIHJldHVybiAnZnJvbnRlbmQnO1xuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLm9uKCdjb25maWcnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2NhbnZhcycsIChjYW52YXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQodGhpcy5jb25maWcuc2l0ZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuY2FudmFzID0gY2FudmFzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwodGhpcy5jb25maWcuc2l0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25SZWFkeSgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWc7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbmNsYXNzIEV2ZW50ZXIge1xuXG4gICAgY29uc3RydWN0b3IobWV0YU1hcCkge1xuICAgICAgICBcbiAgICAgICAgcmlvdC5vYnNlcnZhYmxlKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRzID0ge31cbiAgICB9XG5cbiAgICBldmVyeShldmVudCwgcmVhY3Rpb24pIHtcbiAgICAgICAgLy9sZXQgY2FsbGJhY2sgPSByZWFjdGlvbjtcbiAgICAgICAgLy9pZiAodGhpcy5ldmVudHNbZXZlbnRdKSB7XG4gICAgICAgIC8vICAgIGxldCBwaWdneWJhY2sgPSB0aGlzLmV2ZW50c1tldmVudF07XG4gICAgICAgIC8vICAgIGNhbGxiYWNrID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgICAvLyAgICAgICAgcGlnZ3liYWNrKC4uLnBhcmFtcyk7XG4gICAgICAgIC8vICAgICAgICByZWFjdGlvbiguLi5wYXJhbXMpO1xuICAgICAgICAvLyAgICB9XG4gICAgICAgIC8vfVxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcbiAgICAgICAgXy5lYWNoKGV2ZW50cywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0gcmVhY3Rpb247XG4gICAgICAgICAgICB0aGlzLm9uKGV2ZW50LCByZWFjdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvcmdldChldmVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNbZXZlbnRdO1xuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRvKGV2ZW50LCAuLi5wYXJhbXMpIHtcbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihldmVudCwgLi4ucGFyYW1zKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRlcjsiLCJsZXQgRmlyZWJhc2UgPSB3aW5kb3cuRmlyZWJhc2U7XG5sZXQgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcbmxldCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcblxuY2xhc3MgTWV0YUZpcmUge1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmZiID0gbmV3IEZpcmViYXNlKGBodHRwczovLyR7dGhpcy5jb25maWcuc2l0ZS5kYn0uZmlyZWJhc2Vpby5jb21gKTtcbiAgICB9XG5cbiAgICBnZXQgbWV0YU1hcCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tZXRhTWFwKSB7XG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9tZXRhTWFwO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuTWV0YU1hcC5BdXRoMC5nZXRTZXNzaW9uKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHByb2ZpbGUpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAubG9jay5nZXRDbGllbnQoKS5nZXREZWxlZ2F0aW9uVG9rZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5jb25maWcuc2l0ZS5hdXRoMC5hcGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRfdG9rZW46IHByb2ZpbGUuaWRfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpX3R5cGU6ICdmaXJlYmFzZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIGRlbGVnYXRpb25SZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGUuZmlyZWJhc2VfdG9rZW4gPSBkZWxlZ2F0aW9uUmVzdWx0LmlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnZmlyZWJhc2VfdG9rZW4nLCB0aGlzLmZpcmViYXNlX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYi5hdXRoV2l0aEN1c3RvbVRva2VuKHRoaXMuZmlyZWJhc2VfdG9rZW4sIChlcnJvciwgYXV0aERhdGEsIC4uLnBhcmFtcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGF1dGhEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gdGhpcy5fbG9naW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBmdWxmaWxsKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcbiAgICB9XG5cbiAgICBnZXRDaGlsZChwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZiLmNoaWxkKHBhdGgpO1xuICAgIH1cblxuICAgIGdldERhdGEocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgY2hpbGQub25jZSgndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICAoc25hcHNob3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbihwYXRoLCBjYWxsYmFjaywgZXZlbnQgPSAndmFsdWUnKSB7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgICAgIGxldCBtZXRob2QgPSAoc25hcHNob3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc25hcHNob3QuZXhpc3RzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYoZXZlbnQsIG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyBkYXRhIGF0ICR7cGF0aH1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKGV2ZW50LCBtZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2hpbGQub24oZXZlbnQsIG1ldGhvZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9mZihwYXRoLCBtZXRob2QgPSAndmFsdWUnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKG1ldGhvZCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RGF0YShkYXRhLCBwYXRoKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlRGF0YShwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldERhdGEobnVsbCwgcGF0aCk7XG4gICAgfVxuXG4gICAgcHVzaERhdGEoZGF0YSwgcGF0aCkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQucHVzaChkYXRhLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXREYXRhSW5UcmFuc2FjdGlvbihkYXRhLCBwYXRoLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQudHJhbnNhY3Rpb24oKGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVycm9yKGUsIHBhdGgpIHtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKHsgbWVzc2FnZTogYFBlcm1pc3Npb24gZGVuaWVkIHRvICR7cGF0aH1gIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLl9sb2dpbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX29uUmVhZHkgPSBudWxsO1xuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdmaXJlYmFzZV90b2tlbicpO1xuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbmNsYXNzIEludGVncmF0aW9ucyB7XG5cblx0Y29uc3RydWN0b3IobWV0YU1hcCwgdXNlcikge1xuXHRcdHRoaXMuY29uZmlnID0gbWV0YU1hcC5jb25maWc7XG5cdFx0dGhpcy5tZXRhTWFwID0gbWV0YU1hcDtcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xuXHRcdHRoaXMuX2ZlYXR1cmVzID0ge1xuXHRcdFx0Z29vZ2xlOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvR29vZ2xlJyksXG5cdFx0XHR1c2Vyc25hcDogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1VzZXJTbmFwJyksXG4gICAgICAgICAgICBhZGR0aGlzOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvQWRkVGhpcycpLFxuICAgICAgICAgICAgeW91dHViZTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1lvdVR1YmUnKVxuXHRcdH07XG5cdH1cblxuXHRpbml0KCkge1xuICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoRmVhdHVyZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGxldCBjb25maWcgPSB0aGlzLmNvbmZpZy5zaXRlW25hbWVdO1xuXHRcdFx0XHRcdHRoaXNbbmFtZV0gPSBuZXcgRmVhdHVyZShjb25maWcsIHRoaXMudXNlcik7XG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5pbml0KCk7XG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5zZXRVc2VyKCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cdHNldFVzZXIoKSB7XG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNldFVzZXIoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgfVxuXHRcdFx0fVxuICAgICAgICB9KTtcblx0fVxuXG5cdHNlbmRFdmVudCh2YWwsIC4uLnBhcmFtcykge1xuICAgICAgICBpZiAoIXRoaXMubWV0YU1hcC5kZWJ1Zykge1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNlbmRFdmVudCh2YWwsIC4uLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblx0fVxuXG5cdHVwZGF0ZVBhdGgoKSB7XG5cblx0fVxuXG5cdGxvZ291dCgpIHtcblx0XHRfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAobmFtZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHRoaXNbbmFtZV0ubG9nb3V0KCk7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHRoaXMubWV0YU1hcC5lcnJvcihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuICAgICAgICB9KTtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zOyIsImNsYXNzIFBlcm1pc3Npb25zIHtcblxuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJylcbiAgICB9XG5cbiAgICBjYW5FZGl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc01hcE93bmVyKCkgfHwgdGhpcy5pc1NoYXJlZEVkaXQoKVxuICAgIH1cblxuICAgIGNhblZpZXcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzTWFwT3duZXIoKSB8fCB0aGlzLmlzU2hhcmVkVmlldygpXG4gICAgfVxuXG4gICAgaXNNYXBPd25lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICYmIHRoaXMubWFwLm93bmVyLnVzZXJJZCA9PSB0aGlzLm1ldGFNYXAuVXNlci51c2VySWRcbiAgICB9XG5cbiAgICBpc1NoYXJlZEVkaXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxuICAgICAgICAgICAgdGhpcy5tYXAuc2hhcmVkX3dpdGggJiZcbiAgICAgICAgICAgICAgICAodGhpcy5tZXRhTWFwLlVzZXIuaXNBZG1pbiB8fFxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdICYmIHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSkgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpKVxuICAgIH1cblxuICAgIGlzU2hhcmVkVmlldygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICYmXG4gICAgICAgICAgICB0aGlzLmlzU2hhcmVkRWRpdCgpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0gJiYgdGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXS5yZWFkID09IHRydWUpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10gJiYgdGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXS5yZWFkID09IHRydWUpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcm1pc3Npb25zOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XG5jb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNsYXNzIFJvdXRlciB7XG4gICAgY29uc3RydWN0b3IobWV0YU1hcCkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9ucyA9IG1ldGFNYXAuSW50ZWdyYXRpb25zO1xuICAgICAgICB0aGlzLnVzZXIgPSBtZXRhTWFwLlVzZXI7XG4gICAgICAgIHRoaXMuUGFnZUZhY3RvcnkgPSBtZXRhTWFwLlBhZ2VGYWN0b3J5O1xuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBtZXRhTWFwLkV2ZW50ZXI7XG4gICAgICAgIHRoaXMuaXNIaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICByaW90LnJvdXRlLnN0YXJ0KCk7XG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgaWQgPSAnJywgYWN0aW9uID0gJycsIC4uLnBhcmFtcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYXRoID0gdGhpcy5nZXRQYXRoKHRhcmdldCk7XG5cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCB0aGlzLnBhdGgpO1xuICAgICAgICAgICAgdGhpcy5QYWdlRmFjdG9yeS5uYXZpZ2F0ZSh0aGlzLnBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcyk7XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbygnaGlzdG9yeScsIHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudG8odGhpcy5jdXJyZW50UGFnZSk7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYWdlKCkge1xuICAgICAgICBsZXQgcGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJztcbiAgICAgICAgaWYgKCF0aGlzLmlzVHJhY2tlZChwYWdlKSkge1xuICAgICAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcbiAgICAgICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSAxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2U7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYXRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXRoO1xuICAgIH1cblxuICAgIGdldFByZXZpb3VzUGFnZShwYWdlTm8gPSAyKSB7XG4gICAgICAgIGxldCBwYWdlID0gJ2hvbWUnO1xuICAgICAgICBsZXQgcGFnZUNudCA9IHRoaXMudXNlci5oaXN0b3J5Lmxlbmd0aDtcbiAgICAgICAgaWYgKHBhZ2VDbnQgPiAwKSB7XG4gICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSBwYWdlTm9dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZTtcbiAgICB9XG5cbiAgICBnZXQgcHJldmlvdXNQYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmV2aW91c1BhZ2UoMik7XG4gICAgfVxuXG4gICAgdHJhY2socGF0aCkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9ucy51cGRhdGVQYXRoKHBhdGgpO1xuICAgIH1cblxuICAgIHRvZ2dsZU1haW4oaGlkZSwgcGF0aCkge1xuICAgICAgICB0aGlzLnRyYWNrKHBhdGgpO1xuICAgICAgICBpZiAoaGlkZSkge1xuICAgICAgICAgICAgdGhpcy5pc0hpZGRlbiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQYXRoKHBhdGgpIHtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG5cbiAgICB0byhwYXRoKSB7XG4gICAgICAgIHBhdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1haW4odHJ1ZSwgcGF0aCk7XG4gICAgICAgICAgICByaW90LnJvdXRlKGAke3BhdGh9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiYWNrKCkge1xuICAgICAgICBsZXQgcGF0aCA9ICdob21lJztcbiAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgIGlmIChwYWdlQ250ID4gMSAmJiAodGhpcy5jdXJyZW50UGFnZSAhPSAnbXltYXBzJyB8fCB0aGlzLmN1cnJlbnRQYWdlICE9IHRoaXMucHJldmlvdXNQYWdlKSkge1xuICAgICAgICAgICAgcGF0aCA9IHRoaXMucHJldmlvdXNQYWdlO1xuICAgICAgICAgICAgbGV0IGJhY2tObyA9IDI7XG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNUcmFja2VkKHBhdGgpICYmIHRoaXMudXNlci5oaXN0b3J5W2JhY2tOb10pIHtcbiAgICAgICAgICAgICAgICBiYWNrTm8gKz0gMTtcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5nZXRQcmV2aW91c1BhZ2UoYmFja05vKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy50byhwYXRoKTtcbiAgICB9XG5cbiAgICBnZXQgZG9Ob3RUcmFjaygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kb05vdFRyYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9kb05vdFRyYWNrID0gW0NPTlNUQU5UUy5BQ1RJT05TLkRFTEVURV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQLCBDT05TVEFOVFMuQUNUSU9OUy5MT0dPVVQsIENPTlNUQU5UUy5BQ1RJT05TLk5FV19NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLLCBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kb05vdFRyYWNrO1xuICAgIH1cblxuICAgIGlzVHJhY2tlZChwYXRoKSB7XG4gICAgICAgIGxldCBwdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XG4gICAgICAgIHJldHVybiBfLmFueSh0aGlzLmRvTm90VHJhY2ssIChwKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIXB0aC5zdGFydHNXaXRoKHApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUm91dGVyOyIsImNvbnN0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcblxuY29uc3QgdG9Cb29sID0gKHZhbCkgPT4ge1xuICAgIGxldCByZXQgPSBmYWxzZTtcbiAgICBpZiAodmFsID09PSB0cnVlIHx8IHZhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0ID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmNvbnRhaW5zKFsndHJ1ZScsICd5ZXMnLCAnMSddLCB2YWwgKyAnJy50b0xvd2VyQ2FzZSgpLnRyaW0oKSkpIHtcbiAgICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuY2xhc3MgU2hhcmluZyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1c2VyKSB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXJcbiAgICAgICAgdGhpcy5fbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxuICAgICAgICB0aGlzLl9mYiA9IHRoaXMuX21ldGFNYXAuTWV0YUZpcmU7XG4gICAgfVxuXG4gICAgYWRkU2hhcmUobWFwLCB1c2VyRGF0YSwgb3B0cyA9IHsgcmVhZDogdHJ1ZSwgd3JpdGU6IGZhbHNlIH0pIHtcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZiLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHJlYWQ6IHRvQm9vbChvcHRzLnJlYWQpLFxuICAgICAgICAgICAgICAgIHdyaXRlOiB0b0Jvb2wob3B0cy53cml0ZSksXG4gICAgICAgICAgICAgICAgbmFtZTogb3B0cy5uYW1lLFxuICAgICAgICAgICAgICAgIHBpY3R1cmU6IG9wdHMucGljdHVyZVxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXG4gICAgICAgICAgICB0aGlzLl9mYi5wdXNoRGF0YSh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGAke3RoaXMudXNlci5kaXNwbGF5TmFtZX0gc2hhcmVkIGEgbWFwLCAke21hcC5uYW1lfSwgd2l0aCB5b3UhYCxcbiAgICAgICAgICAgICAgICBtYXBJZDogbWFwLmlkLFxuICAgICAgICAgICAgICAgIHR5cGU6IENPTlNUQU5UUy5OT1RJRklDQVRJT04uTUFQLFxuICAgICAgICAgICAgICAgIHRpbWU6IGAke25ldyBEYXRlKCl9YFxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdCh1c2VyRGF0YS5pZCl9YClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVNoYXJlKG1hcCwgdXNlckRhdGEpIHtcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZiLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXG4gICAgICAgICAgICB0aGlzLl9mYi5wdXNoRGF0YSh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGAke3RoaXMudXNlci5kaXNwbGF5TmFtZX0gcmVtb3ZlZCBhIG1hcCwgJHttYXAubmFtZX0sIHRoYXQgd2FzIHByZXZpb3VzbHkgc2hhcmVkLmAsXG4gICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKX1gXG4gICAgICAgICAgICB9LCBgJHtDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KHVzZXJEYXRhLmlkKX1gKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZWRpdFNoYXJlKG1hcElkLCB1c2VyRGF0YSwgb3B0cyA9IHsgcmVhZDogdHJ1ZSwgd3JpdGU6IGZhbHNlIH0pIHtcblxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJpbmciLCJjb25zdCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJylcbmNvbnN0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXG5jbGFzcyBBdXRoMCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIG1ldGFNYXApIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IG1ldGFNYXA7XG4gICAgICAgIHRoaXMubG9jayA9IG5ldyBBdXRoMExvY2soY29uZmlnLmFwaSwgY29uZmlnLmFwcCk7XG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzaG93TG9naW4gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIHByb2ZpbGUsIGlkX3Rva2VuLCBjdG9rZW4sIG9wdCwgcmVmcmVzaF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSBwcm9maWxlLmN0b2tlbiA9IGN0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdjdG9rZW4nLCB0aGlzLmN0b2tlbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkX3Rva2VuID0gcHJvZmlsZS5pZF90b2tlbiA9IGlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgdGhpcy5pZF90b2tlbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCB0aGlzLnByb2ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gcHJvZmlsZS5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRTZXNzaW9uID0gZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TG9naW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gICAgfVxuXG4gICAgbGlua0FjY291bnQoKSB7XG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgIGNhbGxiYWNrVVJMOiBsb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpLFxuICAgICAgICAgICAgZGljdDoge1xuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0xpbmsgd2l0aCBhbm90aGVyIGFjY291bnQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoaXMuY3Rva2VuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRmFpbChlcnIsIHJlamVjdCkge1xuICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyKTtcbiAgICAgICAgaWYgKHJlamVjdCkge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2Vzc2lvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBmdWxmaWxsKHRoaXMucHJvZmlsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGhpcy5fZ2V0U2Vzc2lvbikge1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWRfdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgKGVyciwgcHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkZhaWwoZXJyLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2N0b2tlbicpLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN0b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignTm8gc2Vzc2lvbicpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFNlc3Npb247XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3Byb2ZpbGUnKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG51bGw7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gQXV0aDA7XG5cblxuIiwiY29uc3QgdXVpZCA9IHJlcXVpcmUoJy4uL3Rvb2xzL3V1aWQuanMnKTtcbmNvbnN0IENvbW1vbiA9IHJlcXVpcmUoJy4uL3Rvb2xzL0NvbW1vbicpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbmNsYXNzIFVzZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2ZpbGUsIGF1dGgsIGV2ZW50ZXIsIG1ldGFGaXJlKSB7XG4gICAgICAgIHRoaXMuYXV0aCA9IGF1dGg7XG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcbiAgICAgICAgdGhpcy51c2VyS2V5ID0gdXVpZCgpO1xuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xuICAgICAgICAgICAgbGV0IHRyYWNrSGlzdG9yeSA9IF8ub25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmV2ZXJ5KCdoaXN0b3J5JywgKHBhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlzdG9yeS5sZW5ndGggPT0gMCB8fCBwYWdlICE9IHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKHRoaXMuaGlzdG9yeSwgYHVzZXJzLyR7dGhpcy5hdXRoLnVpZH0vaGlzdG9yeWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5vbihgdXNlcnMvJHt0aGlzLmF1dGgudWlkfWAsICh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIuaGlzdG9yeSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSB1c2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrSGlzdG9yeSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwodXNlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcbiAgICB9XG5cbiAgICBnZXQgX2lkZW50aXR5KCkge1xuICAgICAgICBsZXQgcmV0ID0ge307XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUgJiYgdGhpcy5wcm9maWxlLmlkZW50aXR5KSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb2ZpbGUuaWRlbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXQgY3JlYXRlZE9uKCkge1xuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9jcmVhdGVkT24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5jcmVhdGVkX2F0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGR0ID0gbmV3IERhdGUodGhpcy5faWRlbnRpdHkuY3JlYXRlZF9hdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlZE9uID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBkdCxcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IENvbW1vbi5nZXRUaWNrc0Zyb21EYXRlKGR0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlZE9uIHx8IHsgZGF0ZTogbnVsbCwgdGlja3M6IG51bGwgfTtcbiAgICB9XG5cbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XG4gICAgICAgIGxldCByZXQgPSB0aGlzLmZ1bGxOYW1lO1xuICAgICAgICBpZiAocmV0KSB7XG4gICAgICAgICAgICByZXQgPSByZXQuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJldCAmJiB0aGlzLl9pZGVudGl0eS5uaWNrbmFtZSkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmlja25hbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGdldCBmdWxsTmFtZSgpIHtcbiAgICAgICAgbGV0IHJldCA9ICcnO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkubmFtZSkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGdldCBlbWFpbCgpIHtcbiAgICAgICAgbGV0IHJldCA9ICcnO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkuZW1haWwpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LmVtYWlsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZ2V0IHBpY3R1cmUoKSB7XG4gICAgICAgIGxldCByZXQgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnBpY3R1cmUpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LnBpY3R1cmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXQgdXNlcklkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoLnVpZDtcbiAgICB9XG5cbiAgICBnZXQgaXNBZG1pbigpIHtcbiAgICAgICAgbGV0IHJldCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucm9sZXMpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LnJvbGVzLmFkbWluID09IHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0XG4gICAgfVxuXG4gICAgZ2V0IGhpc3RvcnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2ZpbGUuaGlzdG9yeSB8fCBbXTtcbiAgICB9XG5cbiAgICBzYXZlVXNlckVkaXRvck9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICBlZGl0b3Jfb3B0aW9uczogSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlcjsiLCJjb25zdCBqc1BsdW1iID0gd2luZG93LmpzUGx1bWI7XG5jb25zdCBqc1BsdW1iVG9vbGtpdCA9IHdpbmRvdy5qc1BsdW1iVG9vbGtpdDtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5jb25zdCBQZXJtaXNzaW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9QZXJtaXNzaW9ucycpXG5cbnJlcXVpcmUoJy4vbGF5b3V0JylcblxuY2xhc3MgQ2FudmFzIHtcblxuICAgIGNvbnN0cnVjdG9yKG1hcCwgbWFwSWQpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgICAgIHRoaXMubWFwSWQgPSBtYXBJZDtcbiAgICAgICAgdGhpcy50b29sa2l0ID0ge307XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxuICAgICAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xuXG4gICAgICAgIGxldCByZWFkeSA9IHRoaXMubWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcElkfWApLnRoZW4oKG1hcEluZm8pID0+IHtcbiAgICAgICAgICAgIHRoaXMubWFwSW5mbyA9IG1hcEluZm9cbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gbmV3IFBlcm1pc3Npb25zKG1hcEluZm8pXG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IHRocm90dGxlU2F2ZSA9IF8udGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb25zLmNhbkVkaXQoKSkge1xuICAgICAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogd2luZG93LnRvb2xraXQuZXhwb3J0RGF0YSgpLFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkX2J5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YUluVHJhbnNhY3Rpb24ocG9zdERhdGEsIGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xuICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHRoaXMubWFwSWQsICdldmVudCcsICdhdXRvc2F2ZScsICdhdXRvc2F2ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMCk7XG5cbiAgICAgICAgcmVhZHkudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29ybmVyXG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFRvb2xraXQuIHByb3ZpZGUgYSBzZXQgb2YgbWV0aG9kcyB0aGF0IGNvbnRyb2wgd2hvIGNhbiBjb25uZWN0IHRvIHdoYXQsIGFuZCB3aGVuLlxuICAgICAgICAgICAgICAgIHZhciB0b29sa2l0ID0gd2luZG93LnRvb2xraXQgPSBqc1BsdW1iVG9vbGtpdC5uZXdJbnN0YW5jZSh7XG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVN0YXJ0Q29ubmVjdDpmdW5jdGlvbihmcm9tTm9kZSwgZWRnZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb3JuZXIgPSBlZGdlVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBlZGdlVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCB0b05vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9QcmV2ZW50IHNlbGYtcmVmZXJlbmNpbmcgY29ubmVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZyb21Ob2RlID09IHRvTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0JldHdlZW4gdGhlIHNhbWUgdHdvIG5vZGVzLCBvbmx5IG9uZSBwZXJzcGVjdGl2ZSBjb25uZWN0aW9uIG1heSBleGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaChjdXJyZW50Q29ybmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BlcnNwZWN0aXZlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGdlcyA9IGZyb21Ob2RlLmdldEVkZ2VzKHsgZmlsdGVyOiBmdW5jdGlvbihlKSB7IHJldHVybiBlLmRhdGEudHlwZSA9PSAncGVyc3BlY3RpdmUnIH19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8ZWRnZXMubGVuZ3RoOyBpKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZCA9IGVkZ2VzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKChlZC5zb3VyY2UgPT0gZnJvbU5vZGUgJiYgZWQudGFyZ2V0ID09IHRvTm9kZSkgfHwgKGVkLnRhcmdldCA9PSBmcm9tTm9kZSAmJiBlZC5zb3VyY2UgPT0gdG9Ob2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgbm9kZS5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIHZhciBfbmV3Tm9kZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZT10eXBlfHxcImlkZWFcIlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdzo1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDpcImlkZWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFBvc2l0aW9uOiBbXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgcHJveHkgKGRyYWcgaGFuZGxlKVxuICAgICAgICAgICAgICAgIHZhciBfbmV3UHJveHkgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8ICdwcm94eVBlcnNwZWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdzoxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6MTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIG1haW5FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5qdGstZGVtby1tYWluXCIpLFxuICAgICAgICAgICAgICAgICAgICBjYW52YXNFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5qdGstZGVtby1jYW52YXNcIik7XG5cblxuICAgICAgICAgICAgICAgIC8vV2hlbmV2ZXIgY2hhbmdpbmcgdGhlIHNlbGVjdGlvbiwgY2xlYXIgd2hhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIHZhciBjbGVhclNlbGVjdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5zZXRTZWxlY3Rpb24ob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNvbmZpZ3VyZSB0aGUgcmVuZGVyZXJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSB0b29sa2l0LnJlbmRlcih7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogY2FudmFzRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNEcmFnZ2FibGU6IHBlcm1pc3Npb25zLmNhbkVkaXQoKSxcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlUGFuQnV0dG9uczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dDp7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjdXN0b20gbGF5b3V0IGZvciB0aGlzIGFwcC4gc2ltcGxlIGV4dGVuc2lvbiBvZiB0aGUgc3ByaW5nIGxheW91dC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJtZXRhbWFwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBob3cgeW91IGNhbiBhc3NvY2lhdGUgZ3JvdXBzIG9mIG5vZGVzLiBIZXJlLCBiZWNhdXNlIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyB3YXkgSSBoYXZlIHJlcHJlc2VudGVkIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGEsIHdlIGVpdGhlciByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgLy8gYSBwYXJ0J3MgXCJwYXJlbnRcIiBhcyB0aGUgcG9zc2UsIG9yIGlmIGl0IGlzIG5vdCBhIHBhcnQgdGhlbiB3ZVxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gdGhlIG5vZGUncyBpZC4gVGhlcmUgYXJlIGFkZFRvUG9zc2UgYW5kIHJlbW92ZUZyb21Qb3NzZVxuICAgICAgICAgICAgICAgICAgICAvLyBtZXRob2RzIHRvbyAob24gdGhlIHJlbmRlcmVyLCBub3QgdGhlIHRvb2xraXQpOyB0aGVzZSBjYW4gYmUgdXNlZFxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHRyYW5zZmVycmluZyBhIHBhcnQgZnJvbSBvbmUgcGFyZW50IHRvIGFub3RoZXIuXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnblBvc3NlOmZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmRhdGEucGFyZW50ID8gWyBub2RlLmRhdGEucGFyZW50LCBmYWxzZSBdIDogbm9kZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgem9vbVRvRml0OmZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2aWV3OntcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXA6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKG9iai5ub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uKG9iaikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTpcInRtcGxOb2RlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkZWE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImRlZmF1bHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyLXRoaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImlkZWFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTpcInRtcGxEcmFnUHJveHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yczogWydDb250aW51b3VzJywgJ0NlbnRlciddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVBlcnNwZWN0aXZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJwcm94eVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlbGF0aW9uc2hpcDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwicHJveHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYmxjbGljazogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmoubm9kZS5kYXRhLnR5cGUgPSAnci10aGluZydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL29iai5ub2RlLnNldFR5cGUoJ3ItdGhpbmcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVXBkYXRpbmcgdGhlIG5vZGUgdHlwZSBkb2VzIG5vdCBzZWVtIHRvIHN0aWNrOyBpbnN0ZWFkLCBjcmVhdGUgYSBuZXcgbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gcmVuZGVyZXIubWFwRXZlbnRMb2NhdGlvbihvYmouZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZXMgPSBvYmoubm9kZS5nZXRFZGdlcygpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLncgPSBlZGdlc1swXS5zb3VyY2UuZGF0YS53ICogMC42Njc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5oID0gZWRnZXNbMF0uc291cmNlLmRhdGEuaCAqIDAuNjY3O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoanNQbHVtYi5leHRlbmQoX25ld05vZGUoXCJyLXRoaW5nXCIpLCBkKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JlLWNyZWF0ZSB0aGUgZWRnZSBjb25uZWN0aW9ucyBvbiB0aGUgbmV3IG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxlZGdlcy5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZWRnZXNbaV0uc291cmNlID09IG9iai5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpuZXdOb2RlLCB0YXJnZXQ6ZWRnZXNbaV0udGFyZ2V0LCBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGVkZ2VzW2ldLnRhcmdldCA9PSBvYmoubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6ZWRnZXNbaV0uc291cmNlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFByb3h5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZGVsZXRlIHRoZSBwcm94eSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5yZW1vdmVOb2RlKG9iai5ub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlczp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob2JqLmUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKSA9PSAncmVsYXRpb25zaGlwLW92ZXJsYXknICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24ob2JqLmVkZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcnM6W1wiQ29udGludW91c1wiLFwiQ29udGludW91c1wiXSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9yOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9yOltcIlN0YXRlTWFjaGluZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDEuMDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJ2aW5lc3M6MTVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1yZWxhdGlvbnNoaXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXlzOltcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsgXCJQbGFpbkFycm93XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjoxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOjEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aDoxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcInJlbGF0aW9uc2hpcC1vdmVybGF5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcFByb3h5OntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXJlbGF0aW9uc2hpcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50OlwiQmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmU6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcGVyc3BlY3RpdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRzOlsgXCJCbGFua1wiLCBbIFwiRG90XCIsIHsgcmFkaXVzOjUsIGNzc0NsYXNzOlwib3JhbmdlXCIgfV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlUHJveHk6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcGVyc3BlY3RpdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRzOlsgXCJCbGFua1wiLCBbIFwiRG90XCIsIHsgcmFkaXVzOjEsIGNzc0NsYXNzOlwib3JhbmdlX3Byb3h5XCIgfV1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50czp7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNDbGljazogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhc0RibENsaWNrOmZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYW4gSWRlYSBub2RlIGF0IHRoZSBsb2NhdGlvbiBhdCB3aGljaCB0aGUgZXZlbnQgb2NjdXJyZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IHJlbmRlcmVyLm1hcEV2ZW50TG9jYXRpb24oZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Nb3ZlIDEvMiB0aGUgaGVpZ2h0IGFuZCB3aWR0aCB1cCBhbmQgdG8gdGhlIGxlZnQgdG8gY2VudGVyIHRoZSBub2RlIG9uIHRoZSBtb3VzZSBjbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogd2hlbiBoZWlnaHQvd2lkdGggaXMgY29uZmlndXJhYmxlLCByZW1vdmUgaGFyZC1jb2RlZCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3MubGVmdCA9IHBvcy5sZWZ0LTUwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLnRvcCA9IHBvcy50b3AtNTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoanNQbHVtYi5leHRlbmQoX25ld05vZGUoKSwgcG9zKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUFkZGVkOl9yZWdpc3RlckhhbmRsZXJzLCAvLyBzZWUgYmVsb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VBZGRlZDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxheW91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXJpb3VzIGRyYWcvZHJvcCBoYW5kbGVyIGV2ZW50IGV4cGVyaW1lbnRzIGxpdmVkIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZHJhZ09wdGlvbnM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOlwiLnNlZ21lbnRcIiwgICAgICAgLy8gY2FuJ3QgZHJhZyBub2RlcyBieSB0aGUgY29sb3Igc2VnbWVudHMuXG5cdFx0XHRcdFx0XHRzdG9wOmZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQvLyB3aGVuIF9hbnlfIG5vZGUgc3RvcHMgZHJhZ2dpbmcsIHJ1biB0aGUgbGF5b3V0IGFnYWluLlxuXHRcdFx0XHRcdFx0XHQvLyB0aGlzIHdpbGwgY2F1c2UgY2hpbGQgbm9kZXMgdG8gc25hcCB0byB0aGVpciBuZXcgcGFyZW50LCBhbmQgYWxzb1xuXHRcdFx0XHRcdFx0XHQvLyBjbGVhbnVwIG5pY2VseSBpZiBhIG5vZGUgaXMgZHJvcHBlZCBvbiBhbm90aGVyIG5vZGUuXG5cdFx0XHRcdFx0XHRcdHJlbmRlcmVyLnJlZnJlc2goKTtcblx0XHRcdFx0XHRcdH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWxvZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLmluaXRpYWxpemUoe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBcIi5kbGdcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLyBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgICAgICAgICAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgIE1vdXNlIGhhbmRsZXJzLiBTb21lIGFyZSB3aXJlZCB1cDsgYWxsIGxvZyB0aGUgY3VycmVudCBub2RlIGRhdGEgdG8gdGhlIGNvbnNvbGUuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgICAgIHZhciBfdHlwZXMgPSBbIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiZ3JlZW5cIiwgXCJibHVlXCIsIFwidGV4dFwiIF07XG5cbiAgICAgICAgICAgICAgICB2YXIgY2xpY2tMb2dnZXIgPSBmdW5jdGlvbih0eXBlLCBldmVudCwgZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQgKyAnICcgKyB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIobm9kZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoZXZlbnQgPT0gJ2RibGNsaWNrJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIF9jbGlja0hhbmRsZXJzID0ge1xuICAgICAgICAgICAgICAgICAgICBjbGljazp7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignUicsICdjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyZWVuOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0cnLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignTycsICdjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignQicsICdjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignVCcsICdjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYmxjbGljazp7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignUicsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBncmVlbjpmdW5jdGlvbihlbCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdHJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1dpZHRoID0gbm9kZS5kYXRhLncgKiAwLjY2NztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SGVpZ2h0ID0gbm9kZS5kYXRhLmggKiAwLjY2NztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5jaGlsZHJlbiA9IG5vZGUuZGF0YS5jaGlsZHJlbiB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3TGFiZWwgPSAnUGFydCc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDpub2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Om5ld1dpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoOm5ld0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IG5ld0xhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogbm9kZS5kYXRhLmNoaWxkcmVuLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGF0YS5jaGlsZHJlbi5wdXNoKG5ld05vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbGF5b3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JhbmdlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ08nLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJveHlOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdQcm94eSgncHJveHlQZXJzcGVjdGl2ZScpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5vZGUsIHRhcmdldDpwcm94eU5vZGUsIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicGVyc3BlY3RpdmVQcm94eVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOnByb3h5Tm9kZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicGVyc3BlY3RpdmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBibHVlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0InLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJveHlOb2RlID0gdG9vbGtpdC5hZGROb2RlKF9uZXdQcm94eSgncHJveHlSZWxhdGlvbnNoaXAnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpub2RlLCB0YXJnZXQ6cHJveHlOb2RlLCBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFByb3h5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1QnLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLm5hbWVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZGxnVGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25PSzogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQudXBkYXRlTm9kZShub2RlLCB7IGxhYmVsOmQudGV4dCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Om5vZGUuZGF0YS5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIF9jdXJyeUhhbmRsZXIgPSBmdW5jdGlvbihlbCwgc2VnbWVudCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2VsID0gZWwucXVlcnlTZWxlY3RvcihcIi5cIiArIHNlZ21lbnQpO1xuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKF9lbCwgXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2xpY2tIYW5kbGVyc1tcImNsaWNrXCJdW3NlZ21lbnRdKGVsLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24oX2VsLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jbGlja0hhbmRsZXJzW1wiZGJsY2xpY2tcIl1bc2VnbWVudF0oZWwsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBzZXR1cCB0aGUgY2xpY2tpbmcgYWN0aW9ucyBhbmQgdGhlIGxhYmVsIGRyYWcuIEZvciB0aGUgZHJhZyB3ZSBjcmVhdGUgYW5cbiAgICAgICAgICAgICAgICAvLyBpbnN0YW5jZSBvZiBqc1BsdW1iIGZvciBub3Qgb3RoZXIgcHVycG9zZSB0aGFuIHRvIG1hbmFnZSB0aGUgZHJhZ2dpbmcgb2ZcbiAgICAgICAgICAgICAgICAvLyBsYWJlbHMuIFdoZW4gYSBkcmFnIHN0YXJ0cyB3ZSBzZXQgdGhlIHpvb20gb24gdGhhdCBqc1BsdW1iIGluc3RhbmNlIHRvXG4gICAgICAgICAgICAgICAgLy8gbWF0Y2ggb3VyIGN1cnJlbnQgem9vbS5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbERyYWdIYW5kbGVyID0ganNQbHVtYi5nZXRJbnN0YW5jZSgpO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIF9yZWdpc3RlckhhbmRsZXJzKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBoZXJlIHlvdSBoYXZlIHBhcmFtcy5lbCwgdGhlIERPTSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBwYXJhbXMubm9kZSwgdGhlIHVuZGVybHlpbmcgbm9kZS4gaXQgaGFzIGEgYGRhdGFgIG1lbWJlciB3aXRoIHRoZSBub2RlJ3MgcGF5bG9hZC5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0gcGFyYW1zLmVsLCBub2RlID0gcGFyYW1zLm5vZGUsIGxhYmVsID0gZWwucXVlcnlTZWxlY3RvcihcIi5uYW1lXCIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90eXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2N1cnJ5SGFuZGxlcihlbCwgX3R5cGVzW2ldLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIGxhYmVsIGRyYWdnYWJsZSAoc2VlIG5vdGUgYWJvdmUpLlxuICAgICAgICAgICAgICAgICAgICBsYWJlbERyYWdIYW5kbGVyLmRyYWdnYWJsZShsYWJlbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbERyYWdIYW5kbGVyLnNldFpvb20ocmVuZGVyZXIuZ2V0Wm9vbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOmZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEubGFiZWxQb3NpdGlvbiA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQobGFiZWwuc3R5bGUubGVmdCwgMTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludChsYWJlbC5zdHlsZS50b3AsIDEwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZVNhdmUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBsYWJlbCBlZGl0YWJsZSB2aWEgYSBkaWFsb2dcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYi5vbihsYWJlbCwgXCJkYmxjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogXCJkbGdUZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRW50ZXIgbGFiZWw6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25PSzogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC51cGRhdGVOb2RlKG5vZGUsIHsgbGFiZWw6ZC50ZXh0IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpub2RlLmRhdGEubGFiZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgKiBzaG93cyBpbmZvIGluIHdpbmRvdyBvbiBib3R0b20gcmlnaHQuXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBfaW5mbyh0ZXh0KSB7XG5cbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICAgICAgLy8gbG9hZCB0aGUgZGF0YS5cbiAgICAgICAgICAgICAgICBpZiAodGhhdC5tYXAgJiYgdGhhdC5tYXAuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmxvYWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGhhdC5tYXAuZGF0YVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vIGEgY291cGxlIG9mIHJhbmRvbSBleGFtcGxlcyBvZiB0aGUgZmlsdGVyIGZ1bmN0aW9uLCBhbGxvd2luZyB5b3UgdG8gcXVlcnkgeW91ciBkYXRhXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICAgICAgdmFyIGNvdW50RWRnZXNPZlR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b29sa2l0LmZpbHRlcihmdW5jdGlvbihvYmopIHsgcmV0dXJuIG9iai5vYmplY3RUeXBlID09IFwiRWRnZVwiICYmIG9iai5kYXRhLnR5cGU9PT10eXBlOyB9KS5nZXRFZGdlQ291bnQoKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdmFyIGR1bXBFZGdlQ291bnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYXJlIFwiICsgY291bnRFZGdlc09mVHlwZShcInJlbGF0aW9uc2hpcFwiKSArIFwiIHJlbGF0aW9uc2hpcCBlZGdlc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSBhcmUgXCIgKyBjb3VudEVkZ2VzT2ZUeXBlKFwicGVyc3BlY3RpdmVcIikgKyBcIiBwZXJzcGVjdGl2ZSBlZGdlc1wiKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdG9vbGtpdC5iaW5kKFwiZGF0YVVwZGF0ZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGR1bXBFZGdlQ291bnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRocm90dGxlU2F2ZSgpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKFwicmVsYXRpb25zaGlwRWRnZUR1bXBcIiwgXCJjbGlja1wiLCBkdW1wRWRnZUNvdW50cygpKTtcblxuICAgICAgICAgICAgICAgIC8vQ1RSTCArIGNsaWNrIGVuYWJsZXMgdGhlIGxhc3NvXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5jdHJsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBkZWxldGVBbGwgPSBmdW5jdGlvbihzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAvL1RPRE86IGltcGxlbWVudCBsb2dpYyB0byBkZWxldGUgd2hvbGUgZWRnZStwcm94eStlZGdlIHN0cnVjdHVyZVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5lYWNoRWRnZShmdW5jdGlvbihpLGUpIHsgY29uc29sZS5sb2coZSkgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9SZWN1cnNlIG92ZXIgYWxsIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmVhY2hOb2RlKGZ1bmN0aW9uKGksbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3Vyc2UgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobm9kZSAmJiBub2RlLmRhdGEuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8bm9kZS5kYXRhLmNoaWxkcmVuLmxlbmd0aDsgaSs9MSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gdG9vbGtpdC5nZXROb2RlKG5vZGUuZGF0YS5jaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0RlbGV0ZSBjaGlsZHJlbiBiZWZvcmUgcGFyZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlTm9kZShub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShuKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlKHNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgbW9kZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgLy9tYXAgYmFja3NwYWNlIHRvIGRlbGV0ZSBpZiBhbnl0aGluZyBpcyBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oZG9jdW1lbnQsICdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGUgPSBudWxsXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHRvb2xraXQuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQ2OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZUFsbChzZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZSA9ICdzZWxlY3QnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuc2V0TW9kZSgnc2VsZWN0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQ2OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0b29sa2l0LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVBbGwoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvL0tMVURHRTpcbiAgICAgICAgICAgICAgICAvL1RoZSBTVkcgc2VnbWVudHMgZm9yIGxldHRlcnMgYW5kIGJ1dHRvbnMgYXJlIG5vdCBncm91cGVkIHRvZ2V0aGVyLCBzbyB0aGUgY3NzOmhvdmVyIHRyaWNrIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgICAgIC8vSW5zdGVhZCwgdXNlIGpRdWVyeVxuICAgICAgICAgICAgICAgIGNvbnN0IHRvZ2dsZU9wYWNpdHkgPSAobm9kZSwgb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9Nb3VzZSBPdmVyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsZXR0ZXIgPSAkKG5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGxldCBjc3NDbGFzcyA9IG5vZGUuY2xhc3NMaXN0WzFdXG4gICAgICAgICAgICAgICAgICAgIGxldCBidXR0b24gPSAnJ1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNzc0NsYXNzLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3AnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9ICdvcmFuZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24gPSAncmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uID0gJ2JsdWUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24gPSAnZ3JlZW4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQobGV0dGVyKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAuJHtidXR0b259LnNlZ21lbnRgKS5jc3MoJ29wYWNpdHknLCBvbilcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKCcubGV0dGVyJykuaG92ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvL01vdXNlIE92ZXJcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlT3BhY2l0eSh0aGlzLCAxKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vTW91c2UgT3V0XG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAkKCcuc2VnbWVudCcpLmhvdmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9Nb3VzZSBPdmVyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywgMSlcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vTW91c2UgT3V0XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGluaXQoKSB7XG5cbiAgICB9XG59XG5cbi8vIGdldCBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgVG9vbGtpdC4gcHJvdmlkZSBhIHNldCBvZiBtZXRob2RzIHRoYXQgY29udHJvbCB3aG8gY2FuIGNvbm5lY3QgdG8gd2hhdCwgYW5kIHdoZW4uXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzO1xuIiwiLyoqXG4qIEN1c3RvbSBsYXlvdXQgZm9yIG1ldGFtYXAuIEV4dGVuZHMgdGhlIFNwcmluZyBsYXlvdXQuIEFmdGVyIFNwcmluZyBydW5zLCB0aGlzXG4qIGxheW91dCBmaW5kcyAncGFydCcgbm9kZXMgYW5kIGFsaWducyB0aGVtIHVuZGVybmVhdGggdGhlaXIgcGFyZW50cy4gVGhlIGFsaWdubWVudFxuKiAtIGxlZnQgb3IgcmlnaHQgLSBpcyBzZXQgaW4gdGhlIHBhcmVudCBub2RlJ3MgZGF0YSwgYXMgYHBhcnRBbGlnbmAuXG4qXG4qIExheW91dCBjYW4gYmUgc3VzcGVuZGVkIG9uIGEgcGVyLW5vZGUgYmFzaXMgYnkgc2V0dGluZyBgc3VzcGVuZExheW91dGAgaW4gdGhlIE5vZGUnc1xuKiBkYXRhLlxuKlxuKiBDaGlsZCBub2RlcyBcbiovXG47KGZ1bmN0aW9uKCkge1xuXHRcblx0ZnVuY3Rpb24gY2hpbGROb2RlQ29tcGFyYXRvcihjMSwgYzIpIHtcblx0XHRpZiAoYzIuZGF0YS5vcmRlciA9PSBudWxsKSByZXR1cm4gLTE7XG5cdFx0aWYgKGMxLmRhdGEub3JkZXIgPT0gbnVsbCkgcmV0dXJuIDE7XG5cdFx0cmV0dXJuIGMxLmRhdGEub3JkZXIgPCBjMi5kYXRhLm9yZGVyID8gLTEgOiAxO1xuXHR9XG5cbiAganNQbHVtYlRvb2xraXQuTGF5b3V0c1tcIm1ldGFtYXBcIl0gPSBmdW5jdGlvbigpIHtcbiAgICBqc1BsdW1iVG9vbGtpdC5MYXlvdXRzLlNwcmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIF9vbmVTZXQgPSBmdW5jdGlvbihwYXJlbnQsIHBhcmFtcywgdG9vbGtpdCkge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgdmFyIHBhZGRpbmcgPSBwYXJhbXMucGFydFBhZGRpbmcgfHwgMjA7XG4gICAgICBpZiAocGFyZW50LmRhdGEuY2hpbGRyZW4gJiYgcGFyZW50LmRhdGEuc3VzcGVuZExheW91dCAhPT0gdHJ1ZSkge1xuXG4gICAgICAgIHZhciBjID0gcGFyZW50LmRhdGEuY2hpbGRyZW4sXG5cdFx0ICBcdGNoaWxkTm9kZXMgPSBfLm1hcCggYywgdG9vbGtpdC5nZXROb2RlICksXG4gICAgICAgICAgICBwYXJlbnRQb3MgPSB0aGlzLmdldFBvc2l0aW9uKHBhcmVudC5pZCksXG4gICAgICAgICAgICBwYXJlbnRTaXplID0gdGhpcy5nZXRTaXplKHBhcmVudC5pZCksXG4gICAgICAgICAgICBtYWduZXRpemVOb2RlcyA9IFsgcGFyZW50LmlkIF0sXG4gICAgICAgICAgICBhbGlnbiA9IChwYXJlbnQuZGF0YS5wYXJ0QWxpZ24gfHwgXCJyaWdodFwiKSA9PT0gXCJsZWZ0XCIgPyAwIDogMSxcbiAgICAgICAgICAgIHkgPSBwYXJlbnRQb3NbMV0gKyBwYXJlbnRTaXplWzFdICsgcGFkZGluZztcblx0XHRcblx0XHQvLyBzb3J0IG5vZGVzXHRcblx0XHRjaGlsZE5vZGVzLnNvcnQoY2hpbGROb2RlQ29tcGFyYXRvcik7XG5cdFx0Ly8gYW5kIHJ1biB0aHJvdWdoIHRoZW0gYW5kIGFzc2lnbiBvcmRlcjsgYW55IHRoYXQgZGlkbid0IHByZXZpb3VzbHkgaGF2ZSBvcmRlciB3aWxsIGdldCBvcmRlclxuXHRcdC8vIHNldCwgYW5kIGFueSB0aGF0IGhhZCBvcmRlciB3aWxsIHJldGFpbiB0aGUgc2FtZSB2YWx1ZS5cblx0XHRfLmVhY2goY2hpbGROb2RlcywgZnVuY3Rpb24oY24sIGkpIHtcblx0XHRcdGNuLmRhdGEub3JkZXIgPSBpO1xuXHRcdH0pO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgY24gPSBjaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYoY24pIHtcbiAgICAgICAgICAgICAgdmFyIGNoaWxkU2l6ZSA9IHRoaXMuZ2V0U2l6ZShjbi5pZCksXG4gICAgICAgICAgICAgICAgICB4ID0gcGFyZW50UG9zWzBdICsgKGFsaWduICogKHBhcmVudFNpemVbMF0gLSBjaGlsZFNpemVbMF0pKTtcblxuICAgICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGNuLmlkLCB4LCB5LCB0cnVlKTtcbiAgICAgICAgICAgICAgbWFnbmV0aXplTm9kZXMucHVzaChjbi5pZCk7XG4gICAgICAgICAgICAgIHkgKz0gKGNoaWxkU2l6ZVsxXSArIHBhZGRpbmcpO1xuICAgICAgICAgICAgfVxuXHRcdH1cbiAgICAgICAgICBcblxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIHN0YXNoIG9yaWdpbmFsIGVuZCBjYWxsYmFjayBhbmQgb3ZlcnJpZGUuIHBsYWNlIGFsbCBQYXJ0IG5vZGVzIHdydCB0aGVpclxuICAgIC8vIHBhcmVudHMsIHRoZW4gY2FsbCBvcmlnaW5hbCBlbmQgY2FsbGJhY2sgYW5kIGZpbmFsbHkgdGVsbCB0aGUgbGF5b3V0XG4gICAgLy8gdG8gZHJhdyBpdHNlbGYgYWdhaW4uXG4gICAgdmFyIF9zdXBlckVuZCA9IHRoaXMuZW5kO1xuICAgIHRoaXMuZW5kID0gZnVuY3Rpb24odG9vbGtpdCwgcGFyYW1zKSB7XG4gICAgICB2YXIgbmMgPSB0b29sa2l0LmdldE5vZGVDb3VudCgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYzsgaSsrKSB7XG4gICAgICAgIHZhciBuID0gdG9vbGtpdC5nZXROb2RlQXQoaSk7XG4gICAgICAgIC8vIG9ubHkgcHJvY2VzcyBub2RlcyB0aGF0IGFyZSBub3QgUGFydCBub2RlcyAodGhlcmUgY291bGQgb2YgY291cnNlIGJlXG4gICAgICAgIC8vIGEgbWlsbGlvbiB3YXlzIG9mIGRldGVybWluaW5nIHdoYXQgaXMgYSBQYXJ0IG5vZGUuLi5oZXJlIEkganVzdCB1c2VcbiAgICAgICAgLy8gYSBydWRpbWVudGFyeSBjb25zdHJ1Y3QgaW4gdGhlIGRhdGEpXG4gICAgICAgIGlmIChuLmRhdGEucGFyZW50ID09IG51bGwpIHtcbiAgICAgICAgICBfb25lU2V0KG4sIHBhcmFtcywgdG9vbGtpdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX3N1cGVyRW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB0aGlzLmRyYXcoKTtcbiAgICB9O1xuICB9O1xuXG59KSgpO1xuIiwiY29uc3QgQUNUSU9OUyA9IHtcbiAgICBPUEVOX01BUDogJ21hcCcsXG4gICAgT1BFTl9UUkFJTklORzogJ29wZW5fdHJhaW5pbmcnLFxuICAgIE5FV19NQVA6ICduZXdfbWFwJyxcbiAgICBDT1BZX01BUDogJ2NvcHlfbWFwJyxcbiAgICBERUxFVEVfTUFQOiAnZGVsZXRlX21hcCcsXG4gICAgSE9NRTogJ2hvbWUnLFxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxuICAgIFRFUk1TX0FORF9DT05ESVRJT05TOiAndGVybXMnLFxuICAgIExPR09VVDogJ2xvZ291dCcsXG4gICAgRkVFREJBQ0s6ICdmZWVkYmFjaycsXG4gICAgU0hBUkVfTUFQOiAnc2hhcmVfbWFwJyxcbiAgICBDT1VSU0VfTElTVDogJ2NvdXJzZV9saXN0JyxcbiAgICBUUkFJTklOR1M6ICd0cmFpbmluZ3MnXG59O1xuXG5PYmplY3QuZnJlZXplKEFDVElPTlMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFDVElPTlM7IiwiY29uc3QgQ0FOVkFTID0ge1xuICAgIExFRlQ6ICdsZWZ0JyxcbiAgICBSSUdIVDogJ3JpZ2h0J1xufTtcblxuT2JqZWN0LmZyZWV6ZShDQU5WQVMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENBTlZBUzsiLCJjb25zdCBDT05TVEFOVFMgPSB7XG5cdEFDVElPTlM6IHJlcXVpcmUoJy4vYWN0aW9ucycpLFxuXHRDQU5WQVM6IHJlcXVpcmUoJy4vY2FudmFzJyksXG5cdERTUlA6IHJlcXVpcmUoJy4vZHNycCcpLFxuXHRFRElUX1NUQVRVUzogcmVxdWlyZSgnLi9lZGl0U3RhdHVzJyksXG5cdEVMRU1FTlRTOiByZXF1aXJlKCcuL2VsZW1lbnRzJyksXG4gICAgRVZFTlRTOiByZXF1aXJlKCcuL2V2ZW50cycpLFxuICAgIE5PVElGSUNBVElPTjogcmVxdWlyZSgnLi9ub3RpZmljYXRpb24nKSxcblx0UEFHRVM6IHJlcXVpcmUoJy4vcGFnZXMnKSxcblx0Uk9VVEVTOiByZXF1aXJlKCcuL3JvdXRlcycpLFxuXHRUQUJTOiByZXF1aXJlKCcuL3RhYnMnKSxcblx0VEFHUzogcmVxdWlyZSgnLi90YWdzJylcbn07XG5cbk9iamVjdC5mcmVlemUoQ09OU1RBTlRTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDT05TVEFOVFM7IiwiY29uc3QgRFNSUCA9IHtcblx0RDogJ0QnLFxuXHRTOiAnUycsXG5cdFI6ICdSJyxcblx0UDogJ1AnXG59XG5cbk9iamVjdC5mcmVlemUoRFNSUCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRFNSUDsiLCJjb25zdCBzdGF0dXMgPSB7XG4gICAgTEFTVF9VUERBVEVEOiAnJyxcbiAgICBSRUFEX09OTFk6ICdWaWV3IG9ubHknLFxuICAgIFNBVklORzogJ1NhdmluZy4uLicsXG4gICAgU0FWRV9PSzogJ0FsbCBjaGFuZ2VzIHNhdmVkJyxcbiAgICBTQVZFX0ZBSUxFRDogJ0NoYW5nZXMgY291bGQgbm90IGJlIHNhdmVkJ1xufTtcblxuT2JqZWN0LmZyZWV6ZShzdGF0dXMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXR1czsiLCJjb25zdCBFTEVNRU5UUyA9IHtcbiAgICBBUFBfQ09OVEFJTkVSOiAnYXBwLWNvbnRhaW5lcicsXG4gICAgTUVUQV9QUk9HUkVTUzogJ21ldGFfcHJvZ3Jlc3MnLFxuICAgIE1FVEFfUFJPR1JFU1NfTkVYVDogJ21ldGFfcHJvZ3Jlc3NfbmV4dCcsXG4gICAgTUVUQV9NT0RBTF9ESUFMT0dfQ09OVEFJTkVSOiAnbWV0YV9tb2RhbF9kaWFsb2dfY29udGFpbmVyJ1xufTtcblxuT2JqZWN0LmZyZWV6ZShFTEVNRU5UUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRUxFTUVOVFM7IiwiY29uc3QgRVZFTlRTID0ge1xuXHRTSURFQkFSX09QRU46ICdzaWRlYmFyLW9wZW4nLFxuXHRTSURFQkFSX0NMT1NFOiAnc2lkZWJhci1jbG9zZScsXG5cdFNJREVCQVJfVE9HR0xFOiAnc2lkZWJhci10b2dnbGUnLFxuXHRQQUdFX05BTUU6ICdwYWdlTmFtZScsXG5cdE5BVjogJ25hdicsXG5cdE1BUDogJ21hcCdcbn1cblxuT2JqZWN0LmZyZWV6ZShFVkVOVFMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVWRU5UUzsiLCJjb25zdCBOT1RJRklDQVRJT04gPSB7XG5cdE1BUDogJ21hcCdcbn1cblxuT2JqZWN0LmZyZWV6ZShOT1RJRklDQVRJT04pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5PVElGSUNBVElPTjsiLCJjb25zdCBBQ1RJT05TID0gcmVxdWlyZSgnLi9hY3Rpb25zLmpzJyk7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNvbnN0IFBBR0VTID0ge1xuICAgIE1BUDogJ21hcCcsXG4gICAgTkVXX01BUDogJ25ld19tYXAnLFxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcbiAgICBNWV9NQVBTOiAnbXltYXBzJyxcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcbiAgICBIT01FOiAnaG9tZScsXG4gICAgQ09VUlNFX0xJU1Q6ICdjb3Vyc2VfbGlzdCcsXG4gICAgVFJBSU5JTkdTOiAndHJhaW5pbmdzJ1xufTtcblxuXy5leHRlbmQoKVxuXG5PYmplY3QuZnJlZXplKFBBR0VTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQQUdFUzsiLCJjb25zdCBST1VURVMgPSB7XG4gICAgTUFQU19MSVNUOiAnbWFwcy9saXN0LycsXG4gICAgTUFQU19EQVRBOiAnbWFwcy9kYXRhLycsXG4gICAgTUFQU19ORVdfTUFQOiAnbWFwcy9uZXctbWFwLycsXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICdtZXRhbWFwL3Rlcm1zLWFuZC1jb25kaXRpb25zLycsXG4gICAgSE9NRTogJ21ldGFtYXAvaG9tZS8nLFxuICAgIE5PVElGSUNBVElPTlM6ICd1c2Vycy97MH0vbm90aWZpY2F0aW9ucycsXG4gICAgQ09VUlNFX0xJU1Q6ICd0cmFpbmluZ3MvY291cnNlcy8nXG59O1xuXG5PYmplY3QuZnJlZXplKFJPVVRFUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUk9VVEVTOyIsImNvbnN0IFRBQlMgPSB7XG4gICAgVEFCX0lEX1BSRVNFTlRFUiA6ICdwcmVzZW50ZXItdGFiJyxcbiAgICBUQUJfSURfQU5BTFlUSUNTX01BUCA6ICdhbmFseXRpY3MtdGFiLW1hcCcsXG4gICAgVEFCX0lEX0FOQUxZVElDU19USElORyA6ICdhbmFseXRpY3MtdGFiLXRoaW5nJyxcbiAgICBUQUJfSURfUEVSU1BFQ1RJVkVTIDogJ3BlcnNwZWN0aXZlcy10YWInLFxuICAgIFRBQl9JRF9ESVNUSU5DVElPTlMgOiAnZGlzdGluY3Rpb25zLXRhYicsXG4gICAgVEFCX0lEX0FUVEFDSE1FTlRTIDogJ2F0dGFjaG1lbnRzLXRhYicsXG4gICAgVEFCX0lEX0dFTkVSQVRPUiA6ICdnZW5lcmF0b3ItdGFiJyxcbiAgICBUQUJfSURfU1RBTkRBUkRTIDogJ3N0YW5kYXJkcy10YWInXG59O1xuT2JqZWN0LmZyZWV6ZShUQUJTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUQUJTOyIsImNvbnN0IFRBR1MgPSB7XG4gICAgTUVUQV9DQU5WQVM6ICdtZXRhLWNhbnZhcycsXG4gICAgSE9NRTogJ2hvbWUnLFxuICAgIFRFUk1TOiAndGVybXMnLFxuICAgIE1ZX01BUFM6ICdteS1tYXBzJyxcbiAgICBTSEFSRTogJ3NoYXJlJyxcbiAgICBDT1VSU0VfTElTVDogJ2NvdXJzZV9saXN0JyxcbiAgICBUUkFJTklORzogJ3RyYWluaW5nJ1xufTtcblxuT2JqZWN0LmZyZWV6ZShUQUdTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUQUdTOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcblxuY2xhc3MgQWRkVGhpcyBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgICAgICAoZnVuY3Rpb24gKGQsIHMsIGlkKSB7XG4gICAgICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXG4gICAgICAgICAgICAgICAgdCA9IHdpbmRvdy5hZGR0aGlzIHx8IHt9O1xuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGpzID0gZC5jcmVhdGVFbGVtZW50KHMpO1xuICAgICAgICAgICAganMuaWQgPSBpZDtcbiAgICAgICAgICAgIGpzLnNyYyA9IGAvL3M3LmFkZHRoaXMuY29tL2pzLzMwMC9hZGR0aGlzX3dpZGdldC5qcyNwdWJpZD0ke2NvbmZpZy5wdWJpZH1gO1xuICAgICAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuXG4gICAgICAgICAgICB0Ll9lID0gW107XG4gICAgICAgICAgICB0LnJlYWR5ID0gZnVuY3Rpb24gKGYpIHtcbiAgICAgICAgICAgICAgICB0Ll9lLnB1c2goZik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgfSAoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwiYWRkLXRoaXMtanNcIikpO1xuICAgICAgICB0aGlzLmFkZHRoaXMgPSB3aW5kb3cuYWRkdGhpcztcbiAgICB9XG4gICAgXG4gICAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgICAgICB0aGlzLmFkZHRoaXMgPSB0aGlzLmFkZHRoaXMgfHwgd2luZG93LmFkZHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZHRoaXM7XG4gICAgfVxuICAgIFxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLmluaXQoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWRkVGhpcztcblxuXG4iLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXG5cbmNsYXNzIEdvb2dsZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgIC8vIEdvb2dsZSBQbHVzIEFQSVxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgcG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTsgcG8udHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBwby5hc3luYyA9IHRydWU7XG4gICAgICBwby5zcmMgPSAnaHR0cHM6Ly9hcGlzLmdvb2dsZS5jb20vanMvcGxhdGZvcm0uanMnO1xuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xuICAgIH0pKCk7XG4gICAgICBcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcbiAgICAoZnVuY3Rpb24gKHcsIGQsIHMsIGwsIGkpIHtcbiAgICAgIHdbbF0gPSB3W2xdIHx8IFtdOyB3W2xdLnB1c2goe1xuICAgICAgICAnZ3RtLnN0YXJ0JzpcbiAgICAgICAgbmV3IERhdGUoKS5nZXRUaW1lKCksIGV2ZW50OiAnZ3RtLmpzJ1xuICAgICAgfSk7IGxldCBmID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XG4gICAgICAgICcvL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndG0uanM/aWQ9JyArIGkgKyBkbDsgZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqLCBmKTtcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJ2RhdGFMYXllcicsIHRoaXMuY29uZmlnLnRhZ21hbmFnZXIpO1xuXG4gICAgKGZ1bmN0aW9uIChpLCBzLCBvLCBnLCByLCBhLCBtKSB7XG4gICAgICBpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXSA9IHI7IGlbcl0gPSBpW3JdIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xuICAgICAgfSwgaVtyXS5sID0gMSAqIG5ldyBEYXRlKCk7IGEgPSBzLmNyZWF0ZUVsZW1lbnQobyksXG4gICAgICBtID0gcy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTsgYS5hc3luYyA9IDE7IGEuc3JjID0gZztcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCAnZ2EnKTtcblxuICB9XG5cbiAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcbiAgICByZXR1cm4gdGhpcy5nYTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgc3VwZXIuaW5pdCgpO1xuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xuICAgIGxldCBkb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdDtcbiAgICBpZihkb21haW4uc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcbiAgICAgIG1vZGUgPSAnbm9uZSc7XG4gICAgfVxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ2NyZWF0ZScsIHRoaXMuY29uZmlnLmFuYWx5dGljcywgbW9kZSk7XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xuICB9XG5cbiAgc2V0VXNlcigpIHtcbiAgICBzdXBlci5zZXRVc2VyKCk7XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0JywgJ3VzZXJJZCcsIHRoaXMudXNlci51c2VySWQpO1xuICB9XG5cbiAgc3RhdGljIHNlbmRTb2NpYWwobmV0d29yaywgdGFyZ2V0VXJsLCB0eXBlID0gJ3NlbmQnKSB7XG4gICAgaWYgKHdpbmRvdy5nYSkge1xuICAgICAgd2luZG93LmdhKCdzZW5kJywgJ3NvY2lhbCcsIG5ldHdvcmssIHR5cGUsIHRhcmdldFVybCk7XG4gICAgfVxuICB9XG5cbiAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XG4gICAgICBpZiAoc291cmNlICYmIHR5cGUpIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHZhbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVQYXRoKHBhdGgpIHtcbiAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsIHtcbiAgICAgICAgICAgIHBhZ2U6IHBhdGhcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2VuZEV2ZW50KGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCkge1xuICAgIGlmICh3aW5kb3cuZ2EpIHtcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHVybCk7XG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGU7XG5cblxuIiwiXG5jb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xuXG5jbGFzcyBVc2VyU25hcCBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgICAgICBsZXQgYXBpS2V5LCBzLCB4O1xuICAgICAgICBpZiAoY29uZmlnID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGFwaUtleSA9IGNvbmZpZy5hcGk7XG4gICAgICAgIGlmIChhcGlLZXkgJiYgIXdpbmRvdy5sb2NhdGlvbi5ob3N0LnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XG4gICAgICAgICAgICBsZXQgdXNDb25mID0ge1xuICAgICAgICAgICAgICAgIGVtYWlsQm94OiB0cnVlLFxuICAgICAgICAgICAgICAgIGVtYWlsQm94VmFsdWU6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICAgICAgZW1haWxSZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25zb2xlUmVjb3JkZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9kZTogJ3JlcG9ydCcsXG4gICAgICAgICAgICAgICAgc2hvcnRjdXQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgICAgICBHb29nbGUuc2VuZEV2ZW50KCdmZWVkYmFjaycsICd1c2Vyc25hcCcsICd3aWRnZXQnLCB3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHdpbmRvdy51c2Vyc25hcGNvbmZpZyA9IHdpbmRvdy5fdXNlcnNuYXBjb25maWcgPSB1c0NvbmY7XG5cbiAgICAgICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgIHMudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICAgICAgcy5hc3luYyA9IHRydWU7XG4gICAgICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XG4gICAgICAgICAgICB4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIHguYXBwZW5kQ2hpbGQocyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHdpbmRvdy5Vc2VyU25hcDtcbiAgICB9XG5cbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgICAgIHRoaXMudXNlclNuYXAgPSB0aGlzLnVzZXJTbmFwIHx8IHdpbmRvdy5Vc2VyU25hcDtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlclNuYXA7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIHNldFVzZXIoKSB7XG4gICAgICAgIHN1cGVyLnNldFVzZXIoKTtcbiAgICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJTbmFwOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcblxuY2xhc3MgWW91VHViZSBleHRlbmRzIEludGVncmF0aW9uc0Jhc2Uge1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xuICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuICAgIHRhZy5zcmMgPSBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGlcIjtcbiAgICB2YXIgZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgZmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGFnLCBmaXJzdFNjcmlwdFRhZyk7XG4gICAgd2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLllUID0gd2luZG93LllUXG4gICAgfVxuICB9XG5cbiAgZ2V0IGludGVncmF0aW9uKCkge1xuICAgIHRoaXMuWVQgPSB0aGlzLllUIHx8IHdpbmRvdy5ZVDtcbiAgICByZXR1cm4gdGhpcy5ZVDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgc3VwZXIuaW5pdCgpO1xuXG4gIH1cblxuICBzZXRVc2VyKCkge1xuICAgIHN1cGVyLnNldFVzZXIoKTtcblxuICB9XG5cbiAgc3RhdGljIHNlbmRTb2NpYWwobmV0d29yaywgdGFyZ2V0VXJsLCB0eXBlID0gJ3NlbmQnKSB7XG5cbiAgfVxuXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcbiAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcblxuICB9XG5cbiAgdXBkYXRlUGF0aChwYXRoKSB7XG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcblxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBZb3VUdWJlO1xuXG5cbiIsImNsYXNzIEludGVncmF0aW9uc0Jhc2Uge1xuXHRjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcblx0XHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xuXHR9XG5cdFxuXHRpbml0KCkge1xuXHRcdFxuXHR9XG5cdFxuXHRnZXQgaW50ZWdyYXRpb24oKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cdFxuXHRzZXRVc2VyKCkge1xuXHRcdFxuXHR9XG5cdFxuXHRzZW5kRXZlbnQoKSB7XG5cdFx0XG5cdH1cblx0XG5cdHVwZGF0ZVBhdGgoKSB7XG5cdFx0XG5cdH1cblx0XG5cdGxvZ291dCgpIHtcblx0XHRcblx0fVxuXHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlZ3JhdGlvbnNCYXNlOyIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcblxuY2xhc3MgR29vZ2xlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcbiAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XG4gICAgICBsZXQgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XG4gICAgfSkoKTtcbiAgICAgIFxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xuICAgICAgd1tsXSA9IHdbbF0gfHwgW107IHdbbF0ucHVzaCh7XG4gICAgICAgICdndG0uc3RhcnQnOlxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXG4gICAgICB9KTsgbGV0IGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxuICAgICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgdGhpcy5jb25maWcudGFnbWFuYWdlcik7XG5cbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICAoaVtyXS5xID0gaVtyXS5xIHx8IFtdKS5wdXNoKGFyZ3VtZW50cyk7XG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcbiAgICAgIG0gPSBzLmdldEVsZW1lbnRzQnlUYWdOYW1lKG8pWzBdOyBhLmFzeW5jID0gMTsgYS5zcmMgPSBnO1xuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xuXG4gIH1cblxuICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgdGhpcy5nYSA9IHRoaXMuZ2EgfHwgd2luZG93LmdhO1xuICAgIHJldHVybiB0aGlzLmdhO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBzdXBlci5pbml0KCk7XG4gICAgbGV0IG1vZGUgPSAnYXV0byc7XG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xuICAgIGlmKGRvbWFpbi5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xuICAgICAgbW9kZSA9ICdub25lJztcbiAgICB9XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignY3JlYXRlJywgdGhpcy5jb25maWcuYW5hbHl0aWNzLCBtb2RlKTtcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gIH1cblxuICBzZXRVc2VyKCkge1xuICAgIHN1cGVyLnNldFVzZXIoKTtcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCAndXNlcklkJywgdGhpcy51c2VyLnVzZXJJZCk7XG4gIH1cblxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcbiAgICBpZiAod2luZG93LmdhKSB7XG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcbiAgICB9XG4gIH1cblxuICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XG4gICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcbiAgICAgIGlmIChzb3VyY2UgJiYgdHlwZSkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xuICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xuICAgICAgICAgICAgcGFnZTogcGF0aFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzZW5kRXZlbnQoZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKSB7XG4gICAgaWYgKHdpbmRvdy5nYSkge1xuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcblxuXG4iLCJjb25zdCByaW90ID0gd2luZG93LnJpb3RcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3NcbmNvbnN0IHBhZ2VCb2R5ID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlLWJvZHkuanMnKVxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5jb25zdCBBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9BY3Rpb24uanMnKVxuY29uc3QgTWV0cm9uaWMgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9tZXRyb25pYycpXG5jb25zdCBMYXlvdXQgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9sYXlvdXQnKVxuY29uc3QgRGVtbyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL2RlbW8nKVxuY29uc3QgUXVpY2tTaWRlYmFyID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvcXVpY2stc2lkZWJhcicpXG5cbmNsYXNzIFBhZ2VGYWN0b3J5IHtcbiAgICBjb25zdHJ1Y3RvcihldmVudGVyLCBtZXRhRmlyZSkge1xuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IG5ldyBBY3Rpb25zKG1ldGFGaXJlLCBldmVudGVyLCB0aGlzKTtcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XG4gICAgfVxuXG4gICAgb25SZWFkeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTfWApLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoJyonKTtcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuY29uZmlndXJlKHsgcGFyZW50OiBgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfUFJPR1JFU1NfTkVYVH1gIH0pO1xuXG4gICAgICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLmluaXQoKTsgLy8gaW5pdCBtZXRyb25pYyBjb3JlIGNvbXBvbmV0c1xuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdCgpOyAvLyBpbml0IGxheW91dFxuICAgICAgICAgICAgICAgICAgICBEZW1vLmluaXQoKTsgLy8gaW5pdCBkZW1vIGZlYXR1cmVzXG4gICAgICAgICAgICAgICAgICAgIFF1aWNrU2lkZWJhci5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKCk7XG4gICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xuICAgIH1cblxuICAgIG5hdmlnYXRlKHBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcykge1xuICAgICAgICBsZXQgYWN0ID0gdGhpcy5hY3Rpb25zLmFjdChwYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpO1xuICAgICAgICBpZiAoIWFjdCkge1xuICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKHBhdGgsIHBhdGgsIHsgaWQ6IGlkLCBhY3Rpb246IGFjdGlvbiB9LCAuLi5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2VGYWN0b3J5OyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3NcbmNvbnN0IENhbnZhcyA9IHJlcXVpcmUoJy4uLy4uL2NhbnZhcy9jYW52YXMnKVxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5yZXF1aXJlKCcuL25vZGUnKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBvcnRsZXQgbGlnaHQganRrLWRlbW8tbWFpblwiIHN0eWxlPVwicGFkZGluZzogMDsgXCI+XG4gICAgPGRpdiBjbGFzcz1cImp0ay1kZW1vLWNhbnZhcyBjYW52YXMtd2lkZVwiIGlkPVwiZGlhZ3JhbVwiPlxuXG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ21ldGEtY2FudmFzJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcblxuICAgIHRoaXMubWFwSWQgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzID0gbnVsbDtcblxuICAgIHRoaXMuYnVpbGRDYW52YXMgPSAobWFwKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5jYW52YXMpIHtcbiAgICAgICAgICAgICQodGhpcy5kaWFncmFtKS5lbXB0eSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXMobWFwLCB0aGlzLm1hcElkKTtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmluaXQoKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobWFwLmNoYW5nZWRfYnkgIT0gTWV0YU1hcC5Vc2VyLnVzZXJLZXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkID0gKG9wdHMpID0+IHtcbiAgICAgICAgaWYgKG9wdHMuaWQgIT0gdGhpcy5tYXBJZCkge1xuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBudWxsXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub2ZmKGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XG4gICAgICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcblxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWFwcy9kYXRhLyR7b3B0cy5pZH1gLCB0aGlzLmJ1aWxkQ2FudmFzKTtcbiAgICAgICAgICAgIE1ldGFNYXAuRXZlbnRlci5mb3JnZXQoQ09OU1RBTlRTLkVWRU5UUy5NQVAsIHRoaXMuYnVpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KENPTlNUQU5UUy5FVkVOVFMuTUFQLCB0aGlzLmJ1aWxkKTtcblxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcbiAgICAgICAgJCh0aGlzLmRpYWdyYW0pLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCArICdweCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xuY29uc3QgRWRpdG9yID0gcmVxdWlyZSgnLi4vLi4vY2FudmFzL2NhbnZhcycpO1xuXG5cbmNvbnN0IGh0bWwgPSBgXG5gXG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ25vZGUnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcbmNvbnN0IFBzID0gcmVxdWlyZSgncGVyZmVjdC1zY3JvbGxiYXInKTtcblxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi9yYXcnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9XG5cdGBcbjxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItd3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdi1qdXN0aWZpZWRcIj5cbiAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBuYXYtanVzdGlmaWVkXCI+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiYWN0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjcXVpY2tfc2lkZWJhcl90YWJfMVwiIGRhdGEtdG9nZ2xlPVwidGFiXCI+XG4gICAgICAgICAgICAgICAgICAgIENvcnRleCBNYW5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3F1aWNrX3NpZGViYXJfdGFiXzJcIiBkYXRhLXRvZ2dsZT1cInRhYlwiPlxuICAgICAgICAgICAgICAgICAgICBPdXRsaW5lXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItcGFuZSBhY3RpdmUgcGFnZS1xdWljay1zaWRlYmFyLWNoYXQgcGFnZS1xdWljay1zaWRlYmFyLWNvbnRlbnQtaXRlbS1zaG93blwiIGlkPVwicXVpY2tfc2lkZWJhcl90YWJfMVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnNcIiBkYXRhLXJhaWwtY29sb3I9XCIjZGRkXCIgZGF0YS13cmFwcGVyLWNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1tZXNzYWdlc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGVhY2g9XCJ7IG1lc3NhZ2VzIH1cIiBjbGFzcz1cInBvc3QgeyBvdXQ6IGF1dGhvciA9PSAnY29ydGV4JywgaW46IGF1dGhvciAhPSAnY29ydGV4JyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGhlaWdodD1cIjM5XCIgd2lkdGg9XCIzOVwiIGNsYXNzPVwiYXZhdGFyXCIgYWx0PVwiXCIgc3JjPVwieyBwaWN0dXJlIH1cIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXJyb3dcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwibmFtZVwiPnsgbmFtZSB9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGF0ZXRpbWVcIj57IHBhcmVudC5nZXRSZWxhdGl2ZVRpbWUodGltZSkgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IG1lc3NhZ2UgfVwiPjwvcmF3PiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItZm9ybVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImNoYXRfaW5wdXRfZm9ybVwiIG9uc3VibWl0PVwieyBvblN1Ym1pdCB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjaGF0X2lucHV0XCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiVHlwZSBhIG1lc3NhZ2UgaGVyZS4uLlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYmx1ZVwiPjxpIGNsYXNzPVwiZmEgZmEtcGFwZXJjbGlwXCI+PC9pPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLXBhbmUgcGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0c1wiIGlkPVwicXVpY2tfc2lkZWJhcl90YWJfMlwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cy1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsaXN0LWhlYWRpbmdcIj5JbnRybzwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsaXN0LWhlYWRpbmdcIj5TZWN0aW9uIDE8L2gzPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuXG5yaW90LnRhZygncXVpY2stc2lkZWJhcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuXHR0aGlzLmNvcnRleFBpY3R1cmUgPSAnc3JjL2ltYWdlcy9jb3J0ZXgtYXZhdGFyLXNtYWxsLmpwZyc7XG5cdHRoaXMubWVzc2FnZXMgPSBbe1xuXHRcdG1lc3NhZ2U6IGBIZWxsbywgSSdtIENvcnRleCBNYW4uIEFzayBtZSBhbnl0aGluZy4gVHJ5IDxjb2RlPi9oZWxwPC9jb2RlPiBpZiB5b3UgZ2V0IGxvc3QuYCxcblx0XHRhdXRob3I6ICdjb3J0ZXgnLFxuXHRcdHBpY3R1cmU6IHRoaXMuY29ydGV4UGljdHVyZSxcblx0XHR0aW1lOiBuZXcgRGF0ZSgpXG5cdH1dO1xuXG5cdGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XG5cblx0dGhpcy5vbigndXBkYXRlJywgKCkgPT4ge30pO1xuXG5cdHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuXG5cdFx0dGhpcy51cGRhdGUoKTtcblx0fSk7XG5cblx0dGhpcy5nZXREaXNwbGF5ID0gKCkgPT4ge1xuXHRcdGlmICghdGhpcy5kaXNwbGF5KSB7XG5cdFx0XHRyZXR1cm4gJ2Rpc3BsYXk6IG5vbmU7Jztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuZ2V0UmVsYXRpdmVUaW1lID0gKGRhdGUgPSBuZXcgRGF0ZSgpKSA9PiB7XG5cdFx0cmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XG5cdH1cblxuXHR0aGlzLm9uU3VibWl0ID0gKG9iaikgPT4ge1xuXHRcdHRoaXMubWVzc2FnZXMucHVzaCh7XG5cdFx0XHRtZXNzYWdlOiB0aGlzLmNoYXRfaW5wdXQudmFsdWUsXG5cdFx0XHRhdXRob3I6IE1ldGFNYXAuVXNlci51c2VyTmFtZSxcblx0XHRcdHBpY3R1cmU6IE1ldGFNYXAuVXNlci5waWN0dXJlLFxuXHRcdFx0dGltZTogbmV3IERhdGUoKVxuXHRcdH0pXG5cdFx0dGhpcy5tZXNzYWdlcy5wdXNoKHtcblx0XHRcdG1lc3NhZ2U6IGBZb3UgYXNrZWQgbWUgJHt0aGlzLmNoYXRfaW5wdXQudmFsdWV9LiBUaGF0J3MgZ3JlYXQhYCxcblx0XHRcdGF1dGhvcjogJ2NvcnRleCcsXG5cdFx0XHRwaWN0dXJlOiB0aGlzLmNvcnRleFBpY3R1cmUsXG5cdFx0XHR0aW1lOiBuZXcgRGF0ZSgpXG5cdFx0fSlcblx0XHR0aGlzLmNoYXRfaW5wdXQudmFsdWUgPSAnJ1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0dGhpcy5jaGF0X2JvZHkuc2Nyb2xsVG9wID0gdGhpcy5jaGF0X2JvZHkuc2Nyb2xsSGVpZ2h0XG5cdFx0UHMudXBkYXRlKHRoaXMuY2hhdF9ib2R5KVxuXHR9XG5cblx0dGhpcy50b2dnbGUgPSAoc3RhdGUpID0+IHtcblx0XHR0aGlzLmRpc3BsYXkgPSBzdGF0ZTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHR9XG5cbn0pO1xuIiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xuICAgIHRoaXMudXBkYXRlQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IChvcHRzKSA/IChvcHRzLmNvbnRlbnQgfHwgJycpIDogJyc7XG4gICAgfTtcblxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ3R5cGVhaGVhZC5qcycpXG5yZXF1aXJlKCdib290c3RyYXAtc2VsZWN0JylcblxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5yZXF1aXJlKCcuLi8uLi90b29scy9zaGltcycpO1xuY29uc3QgU2hhcmluZyA9IHJlcXVpcmUoJy4uLy4uL2FwcC9TaGFyaW5nJylcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJzaGFyZV9tb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8YSBpZD1cInNoYXJlX3B1YmxpY19saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJmbG9hdDogcmlnaHQ7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jbGlwYm9hcmQtdGV4dD1cInt3aW5kb3cubG9jYXRpb24uaG9zdCsnLycrd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKycvbWFwcy8nK29wdHMubWFwLmlkfVwiXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IGdldFB1YmxpY0xpbmsgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgR2V0IHNoYXJhYmxlIGxpbmsgIDxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5TaGFyZSB3aXRoIG90aGVyczwvaDQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgPHA+UGVvcGxlPC9wPlxuICAgICAgICAgICAgICAgIDxmb3JtIHJvbGU9XCJmb3JtXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzaGFyZV90eXBlYWhlYWRcIiBjbGFzcz1cImNvbC1tZC04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHN0eWxlPVwiaGVpZ2h0OiAzNXB4O1wiIGlkPVwic2hhcmVfaW5wdXRcIiBjbGFzcz1cInR5cGVhaGVhZCBmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgbmFtZXMgb3IgZW1haWwgYWRkcmVzc2VzLi4uXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJzaGFyZV9wZXJtaXNzaW9uXCIgY2xhc3M9XCJzZWxlY3RwaWNrZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmVhZFwiIGRhdGEtY29udGVudD1cIjxzcGFuPjxpIGNsYXNzPSdmYSBmYS1leWUnPjwvaT4gQ2FuIHZpZXc8L3NwYW4+XCI+Q2FuIHZpZXc8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid3JpdGVcIiBkYXRhLWNvbnRlbnQ9XCI8c3Bhbj48aSBjbGFzcz0nZmEgZmEtcGVuY2lsJz48L2k+IENhbiBlZGl0PC9zcGFuPlwiPkNhbiBlZGl0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWQ9XCJzaGFyZV9idXR0b25cIiBjbGFzcz1cImJ0biBidG4taWNvbi1vbmx5IGdyZWVuXCIgb25jbGljaz1cInsgb25TaGFyZSB9XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWY9XCJ7IG9wdHMgJiYgb3B0cy5tYXAgJiYgb3B0cy5tYXAuc2hhcmVkX3dpdGh9XCIgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImxhYmVsIGxhYmVsLWRlZmF1bHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cIm1hcmdpbi1yaWdodDogNXB4O1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmPVwieyBpICE9ICdhZG1pbicgJiYgKHZhbC53cml0ZSB8fCB2YWwucmVhZCkgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGksIHZhbCBpbiBvcHRzLm1hcC5zaGFyZWRfd2l0aH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgaWY9XCJ7IHZhbC53cml0ZSB9XCIgY2xhc3M9XCJmYSBmYS1wZW5jaWxcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGlmPVwieyAhdmFsLndyaXRlIH1cIiBjbGFzcz1cImZhIGZhLWV5ZVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdmFsLm5hbWUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJmYSBmYS10aW1lcy1jaXJjbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vblVuU2hhcmUgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkRvbmU8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnc2hhcmUnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKVxuICAgIGNvbnN0IHNoYXJlID0gbmV3IFNoYXJpbmcoTWV0YU1hcC5Vc2VyKVxuXG4gICAgdGhpcy5kYXRhID0gW107XG5cbiAgICB0aGlzLmdldFB1YmxpY0xpbmsgPSAoZSwgb3B0cykgPT4ge1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICB9XG5cbiAgICB0aGlzLm9uU2hhcmUgPSAoZSwgb3B0cykgPT4ge1xuICAgICAgICB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW3RoaXMuc3VnZ2VzdGlvbi5pZF0gPSB7XG4gICAgICAgICAgICByZWFkOiB0aGlzLnBpY2tlci52YWwoKSA9PSAncmVhZCcgfHwgdGhpcy5waWNrZXIudmFsKCkgPT0gJ3dyaXRlJyxcbiAgICAgICAgICAgIHdyaXRlOiB0aGlzLnBpY2tlci52YWwoKSA9PSAnd3JpdGUnLFxuICAgICAgICAgICAgbmFtZTogdGhpcy5zdWdnZXN0aW9uLm5hbWUsXG4gICAgICAgICAgICBwaWN0dXJlOiB0aGlzLnN1Z2dlc3Rpb24ucGljdHVyZVxuICAgICAgICB9XG4gICAgICAgIHNoYXJlLmFkZFNoYXJlKHRoaXMub3B0cy5tYXAsIHRoaXMuc3VnZ2VzdGlvbiwgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLnN1Z2dlc3Rpb24uaWRdKVxuXG4gICAgICAgIHRoaXMuc3VnZ2VzdGlvbiA9IG51bGxcbiAgICAgICAgdGhpcy50YS50eXBlYWhlYWQoJ3ZhbCcsICcnKVxuICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5oaWRlKClcbiAgICB9XG5cbiAgICB0aGlzLm9uVW5TaGFyZSA9IChlLCBvcHRzKSA9PiB7XG4gICAgICAgIGUuaXRlbS52YWwuaWQgPSBlLml0ZW0uaVxuICAgICAgICBkZWxldGUgdGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aFtlLml0ZW0uaV1cbiAgICAgICAgc2hhcmUucmVtb3ZlU2hhcmUodGhpcy5vcHRzLm1hcCwgZS5pdGVtLnZhbClcbiAgICB9XG5cbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAob3B0cykgPT4ge1xuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgXy5leHRlbmQodGhpcy5vcHRzLCBvcHRzKTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdtb3VudCcsIChlLCBvcHRzKSA9PiB7XG4gICAgICAgICQodGhpcy5zaGFyZV9tb2RhbCkubW9kYWwoJ3Nob3cnKVxuICAgICAgICB0aGlzLnRhID0gJCgnI3NoYXJlX3R5cGVhaGVhZCAudHlwZWFoZWFkJykudHlwZWFoZWFkKHtcbiAgICAgICAgICAgIGhpZ2hsaWdodDogdHJ1ZVxuICAgICAgICB9LHtcbiAgICAgICAgICAgIHNvdXJjZTogKHF1ZXJ5LCBzeW5jTWV0aG9kLCBhc3luY01ldGhvZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1ldGFtYXAuY28vdXNlcnMvZmluZCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcklkOiBNZXRhTWFwLlVzZXIudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbklkOiBNZXRhTWFwLk1ldGFGaXJlLmZpcmViYXNlX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZWRVc2VyczogXy5rZXlzKHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBxdWVyeVxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICcqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWN0dXJlOiAnc3JjL2ltYWdlcy93b3JsZC1nbG9iZS5qcGcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdQdWJsaWMnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNNZXRob2QoZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzcGxheTogKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoubmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICAgICBlbXB0eTogW1xuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwicGFkZGluZzogNXB4IDEwcHg7IHRleHQtYWxpZ246IGNlbnRlcjtcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnVW5hYmxlIHRvIGZpbmQgYW55IHVzZXJzIG1hdGNoaW5nIHRoaXMgcXVlcnknLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgXS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uOiAodmFsdWUpID0+IHsgcmV0dXJuIGA8ZGl2PjxpbWcgYWx0PVwiJHt2YWx1ZS5uYW1lfVwiIGhlaWdodD1cIjMwXCIgd2lkdGg9XCIzMFwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cIiR7dmFsdWUucGljdHVyZX1cIj4gJHt2YWx1ZS5uYW1lfTwvZGl2PmAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRhLm9uKCd0eXBlYWhlYWQ6c2VsZWN0JywgKGV2LCBzdWdnZXN0aW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXG4gICAgICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5zaG93KClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy50YS5vbigndHlwZWFoZWFkOmF1dG9jb21wbGV0ZScsIChldiwgc3VnZ2VzdGlvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gc3VnZ2VzdGlvblxuICAgICAgICAgICAgJCh0aGlzLnNoYXJlX2J1dHRvbikuc2hvdygpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMucGlja2VyID0gJCgnLnNlbGVjdHBpY2tlcicpLnNlbGVjdHBpY2tlcih7XG4gICAgICAgICAgICB3aWR0aDogJ2F1dG8nXG4gICAgICAgIH0pXG4gICAgfSlcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5cbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ncmFkdWF0aW9uLWNhcFwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI3MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IGhlbHAgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBoZWxwIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpdGxlXCI+eyB0aXRsZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuYDtcblxucmlvdC50YWcoJ21ldGEtaGVscCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuaGVscCA9IG51bGw7XG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvaGVscCcsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhlbHAgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcbnJlcXVpcmUoJy4uLy4uL3Rvb2xzL3NoaW1zJylcblxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCJcbiAgICAgICAgICAgICAgICAgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIlxuICAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICAgICAgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICAgICAgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtYmVsbC1vXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgbm90aWZpY2F0aW9ucy5sZW5ndGggfVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJib2xkXCI+eyBub3RpZmljYXRpb25zLmxlbmd0aCB9IHBlbmRpbmc8L3NwYW4+IG5vdGlmaWNhdGlvbnsgczogbm90aWZpY2F0aW9ucy5sZW5ndGggPT0gMCB8fCBub3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyBhbGxOb3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgdHJ1ZSAhPSBhcmNoaXZlZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgdmFsLCBpIGluIG5vdGlmaWNhdGlvbnMgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZj1cInsgdmFsLnBob3RvICE9IG51bGwgfVwiIGNsYXNzPVwicGhvdG9cIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJ7dmFsLnBob3RvfVwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIGFsdD1cIlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzdWJqZWN0XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZnJvbVwiPnsgdmFsLmZyb20gfTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJ0aW1lXCIgc3R5bGU9XCJwYWRkaW5nOiAwO1wiPnsgcGFyZW50LmdldFRpbWUodmFsLnRpbWUpIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1lc3NhZ2VcIj57IHZhbC5ldmVudCB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbmA7XG5cbnJpb3QudGFnKCdtZXRhLW5vdGlmaWNhdGlvbnMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICBjb25zdCBmYlBhdGggPSBDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KE1ldGFNYXAuVXNlci51c2VySWQpXG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgICB0aGlzLmFsbE5vdGlmaWNhdGlvbnMgPSBbXTtcblxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGxldCBpdGVtID0gZXZlbnQuaXRlbS52YWxcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHRydWUsIGAke2ZiUGF0aH0vJHtpdGVtLmlkfS9hcmNoaXZlYClcbiAgICAgICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLk5PVElGSUNBVElPTi5NQVA6XG4gICAgICAgICAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2l0ZW0ubWFwSWR9YCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRUaW1lID0gKHRpbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChuZXcgRGF0ZSh0aW1lKSkuZnJvbU5vdygpXG4gICAgfVxuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuZ2V0RGF0YShmYlBhdGgpXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnB1c2hEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiAnWW91IHNpZ25lZCB1cCBmb3IgTWV0YU1hcCEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKSB9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY2hpdmU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0sIGZiUGF0aClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KE1ldGFNYXAuVXNlci51c2VySWQpLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbE5vdGlmaWNhdGlvbnMgPSBfLm1hcChkYXRhLCAobiwgaWQpID0+IHsgbi5pZCA9IGlkOyByZXR1cm4gbjsgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBfLmZpbHRlcihfLnNvcnRCeSh0aGlzLmFsbE5vdGlmaWNhdGlvbnMsICdkYXRlJyksIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5cbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1zdWNjZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7IHBvaW50cy5sZW5ndGggfVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZXh0ZXJuYWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcyA9XCJib2xkXCI+eyBwb2ludHMubGVuZ3RoIH0gbmV3IDwvc3Bhbj4gYWNoaWV2ZW1lbnR7IHM6IHBvaW50cy5sZW5ndGggPT0gMCB8fCBwb2ludHMubGVuZ3RoID4gMSB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPnZpZXcgYWxsPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBwb2ludHMgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IHBvaW50cyB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRpbWVcIj57IHRpbWUgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGV0YWlsc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtc20gbGFiZWwtaWNvbiBsYWJlbC1zdWNjZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBldmVudCB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuYDtcblxucmlvdC50YWcoJ21ldGEtcG9pbnRzJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XG4gICAgdGhpcy5wb2ludHMgPSBbXTtcblxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgdXNlcnMvJHtNZXRhTWFwLlVzZXIudXNlcklkfS9wb2ludHNgLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb2ludHMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5cbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVzZXJuYW1lIHVzZXJuYW1lLWhpZGUtb24tbW9iaWxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7IHVzZXJuYW1lIH1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGlmPVwieyBwaWN0dXJlIH1cIiBhbHQ9XCJcIiBoZWlnaHQ9XCIzOVwiIHdpZHRoPVwiMzlcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCJ7IHBpY3R1cmUgfVwiIC8+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1kZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgbWVudSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IG1lbnUgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyBsaW5rIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuYDtcblxucmlvdC50YWcoJ21ldGEtdXNlcicsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuXG4gICAgdGhpcy5tZW51ID0gW107XG4gICAgdGhpcy51c2VybmFtZSA9ICcnO1xuICAgIHRoaXMucGljdHVyZSA9ICcnO1xuXG4gICAgdGhpcy5sb2dvdXQgPSAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAubG9nb3V0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5saW5rQWNjb3VudCA9ICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5BdXRoMC5saW5rQWNjb3VudCgpO1xuICAgIH1cblxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIHN3aXRjaChldmVudC5pdGVtLmxpbmspIHtcbiAgICAgICAgICAgIGNhc2UgJyNsaW5rLXNvY2lhbC1hY2NvdW50cyc6XG4gICAgICAgICAgICAgICAgdGhpcy5saW5rQWNjb3VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGBtZXRhbWFwL3VzZXJgLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IE1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZTtcbiAgICAgICAgICAgIHRoaXMucGljdHVyZSA9IE1ldGFNYXAuVXNlci5waWN0dXJlO1xuICAgICAgICAgICAgdGhpcy5tZW51ID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcbnJlcXVpcmUoJy4uL3Rvb2xzL3NoaW1zJyk7XG5jb25zdCBQZXJtaXNzaW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9QZXJtaXNzaW9ucycpXG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biByZWQtaGF6ZSBidG4tc20gZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRkZW4tc20gaGlkZGVuLXhzXCI+QWN0aW9ucyZuYnNwOzwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhIH1cIiBjbGFzcz1cInsgc3RhcnQ6IGkgPT0gMCwgYWN0aXZlOiBpID09IDAgfVwiPlxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBwYXJlbnQuZ2V0TGlua0FsbG93ZWQodmFsKSB9XCIgaHJlZj1cInsgcGFyZW50LmdldEFjdGlvbkxpbmsodmFsKSB9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyB2YWwuaWNvbiB9XCI+PC9pPiB7IHZhbC50aXRsZSB9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxuICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjc2V0dGluZ3NcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1nZWFyXCI+PC9pPiBTZXR0aW5nc1xuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgPC9kaXY+XG5cbiAgICA8c3BhbiBzdHlsZT1cInBhZGRpbmctbGVmdDogNXB4O1wiPlxuICAgICAgICA8c3BhbiBpZj1cInsgcGFnZU5hbWUgfVwiXG4gICAgICAgICAgICAgICAgaWQ9XCJtYXBfbmFtZVwiXG4gICAgICAgICAgICAgICAgZGF0YS10eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgZGF0YS10aXRsZT1cIkVudGVyIG1hcCBuYW1lXCJcbiAgICAgICAgICAgICAgICBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+XG4gICAgICAgICAgICB7IHBhZ2VOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgIDwvc3Bhbj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1hY3Rpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnBhZ2VOYW1lID0gJ0hvbWUnO1xuICAgIHRoaXMudXJsID0gTWV0YU1hcC5jb25maWcuc2l0ZS5kYiArICcuZmlyZWJhc2Vpby5jb20nO1xuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG5cbiAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xuXG4gICAgdGhpcy5nZXRBY3Rpb25MaW5rID0gKG9iaikgPT4ge1xuICAgICAgICBsZXQgcmV0ID0gb2JqLmxpbms7XG4gICAgICAgIGlmIChvYmoudXJsX3BhcmFtcykge1xuICAgICAgICAgICAgbGV0IGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChvYmoudXJsX3BhcmFtcywgKHBybSkgPT4ge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzW3BybS5uYW1lXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldCA9IG9iai5saW5rLmZvcm1hdC5jYWxsKG9iai5saW5rLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHRoaXMuZ2V0TGlua0FsbG93ZWQgPSAob2JqKSA9PiB7XG4gICAgICAgIGxldCByZXQgPSB0cnVlID09IG9ialsnYWxsb3dlZC1vbiddWycqJ107XG4gICAgICAgIGlmICghcmV0KSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFBhZ2UgPSBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aDtcbiAgICAgICAgICAgIHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bY3VycmVudFBhZ2VdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXQgJiYgdGhpcy5tYXAgJiYgcGVybWlzc2lvbnMpIHtcbiAgICAgICAgICAgIHN3aXRjaCAob2JqLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU2hhcmUgTWFwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdEZWxldGUgTWFwJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGVybWlzc2lvbnMuaXNNYXBPd25lcigpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVQYWdlTmFtZSA9IChtYXApID0+IHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMobWFwKVxuICAgICAgICB0aGlzLm1hcCA9IG1hcCB8fCB7fVxuICAgICAgICBpZiAocGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbWFwLm5hbWUgfHwgJydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFnZU5hbWUgPSBtYXAubmFtZSArICcgKFNoYXJlZCBieSAnICsgbWFwLm93bmVyLm5hbWUgKyAnKSdcbiAgICAgICAgfVxuICAgICAgICBpZiAocGVybWlzc2lvbnMgJiYgcGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XG4gICAgICAgICAgICAkKHRoaXMubWFwX25hbWUpLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfS9uYW1lYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfVxuXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmxvYWRlZCkge1xuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSgnZGVzdHJveScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1hcElkKSB7XG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9mZihgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfWApO1xuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG51bGxcbiAgICAgICAgICAgIHRoaXMubWFwID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLm1hcElkID0gb3B0cy5pZDtcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7b3B0cy5pZH1gLCAobWFwKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlTmFtZShtYXApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2VOYW1lID0gb3B0cy5uYW1lIHx8ICdIb21lJztcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvYWN0aW9ucycsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IHBhZ2VIZWFkZXIgPSByZXF1aXJlKCcuL3BhZ2UtaGVhZGVyJyk7XG5jb25zdCBwYWdlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRhaW5lcicpO1xuY29uc3QgcGFnZUZvb3RlciA9IHJlcXVpcmUoJy4vcGFnZS1mb290ZXInKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJwYWdlX2JvZHlcIiBjbGFzcz1cInBhZ2UtaGVhZGVyLWZpeGVkIHBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiPlxuXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9oZWFkZXJcIj48L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250YWluZXJcIj48L2Rpdj5cblxuPC9kaXY+YDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1ib2R5JywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2hlYWRlciwgJ3BhZ2UtaGVhZGVyJyk7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfY29udGFpbmVyLCAncGFnZS1jb250YWluZXInKTtcbiAgICB9KTtcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IHBhZ2VTaWRlYmFyID0gcmVxdWlyZSgnLi9wYWdlLXNpZGViYXInKTtcbmNvbnN0IHBhZ2VDb250ZW50ID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRlbnQnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJwYWdlLWNvbnRhaW5lclwiPlxuXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250ZW50XCI+PC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY29udGFpbmVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2NvbnRlbnQsICdwYWdlLWNvbnRlbnQnKTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvcXVpY2stc2lkZWJhcicpXG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicGFnZS1jb250ZW50LXdyYXBwZXJcIj5cbiAgICA8ZGl2IGlkPVwicGFnZS1jb250ZW50XCIgY2xhc3M9XCJwYWdlLWNvbnRlbnRcIj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1oZWFkXCI+PC9kaXY+XG5cbiAgICAgICAgPGRpdiBpZD1cImFwcC1jb250YWluZXJcIj48L2Rpdj5cblxuICAgICAgICA8ZGl2IGlkPVwicXVpY2tfc2lkZWJhcl9jb250YWluZXJcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb250ZW50JywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLnF1aWNrX3NpZGViYXJfY29udGFpbmVyLCAncXVpY2stc2lkZWJhcicpXG4gICAgICAgIHRoaXMucmVzaXplKClcbiAgICB9KVxuXG4gICAgdGhpcy5yZXNpemUgPSAoKSA9PiB7XG4gICAgICAgIGxldCB3aWR0aCA9IGAke3dpbmRvdy5pbm5lcldpZHRoIC0gNDB9cHhgO1xuICAgICAgICAkKHRoaXNbJ2FwcC1jb250YWluZXInXSkuY3NzKHsgd2lkdGg6IHdpZHRoIH0pO1xuICAgIH1cblxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnJlc2l6ZSgpXG4gICAgfSk7XG5cblxuXG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicGFnZS1mb290ZXJcIiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAwO1wiPlxuICAgIDxkaXYgY2xhc3M9XCJwYWdlLWZvb3Rlci1pbm5lclwiPlxuICAgICAgICA8YSBocmVmPVwiI3Rlcm1zXCI+JmNvcHk7MjAxNTwvYT5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1mb290ZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IHBhZ2VMb2dvID0gcmVxdWlyZSgnLi9wYWdlLWxvZ28uanMnKTtcbmNvbnN0IHBhZ2VBY3Rpb25zID0gcmVxdWlyZSgnLi9wYWdlLWFjdGlvbnMuanMnKTtcbmNvbnN0IHBhZ2VTZWFyY2ggPSByZXF1aXJlKCcuL3BhZ2Utc2VhcmNoLmpzJyk7XG5jb25zdCBwYWdlVG9wTWVudSA9IHJlcXVpcmUoJy4vcGFnZS10b3BtZW51Jyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGlkPVwiaGVhZGVyLXRvcFwiIGNsYXNzPVwicGFnZS1oZWFkZXIgbmF2YmFyIG5hdmJhci1maXhlZC10b3BcIj5cbiAgICA8ZGl2IGlkPVwibWV0YV9wcm9ncmVzc19uZXh0XCIgc3R5bGU9XCJvdmVyZmxvdzogaW5oZXJpdDtcIj48L2Rpdj5cbiAgICA8ZGl2IGlkPVwiaGVhZGVyLWNvbnRlbnRcIiBjbGFzcz1cInBhZ2UtaGVhZGVyLWlubmVyXCI+XG5cbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9sb2dvXCI+PC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2FjdGlvbnNcIj48L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfdG9wXCIgY2xhc3M9XCJwYWdlLXRvcFwiPlxuICAgICAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9zZWFyY2hcIj48L2Rpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV90b3BtZW51XCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1oZWFkZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfbG9nbywgJ3BhZ2UtbG9nbycpO1xuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2FjdGlvbnMsICdwYWdlLWFjdGlvbnMnKTtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV90b3AsICdwYWdlLXNlYXJjaCcpO1xuICAgICAgICByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3RvcCwgJ3BhZ2UtdG9wbWVudScpO1xuICAgIH0pO1xuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcyA9XCJwYWdlLWxvZ29cIj5cbiAgICA8YSBpZD1cIm1ldGFfbG9nb1wiIGhyZWY9XCIjaG9tZVwiPlxuICAgICAgICA8aW1nIHNyYz1cInNyYy9pbWFnZXMvbWV0YW1hcF9jbG91ZC5wbmdcIiBhbHQ9XCJsb2dvXCIgY2xhc3MgPVwibG9nby1kZWZhdWx0XCIgLz5cbiAgICA8L2E+XG5cbiAgICA8ZGl2IGlkPVwibWV0YV9tZW51X3RvZ2dsZVwiIGNsYXNzPVwibWVudS10b2dnbGVyIHNpZGViYXItdG9nZ2xlciBxdWljay1zaWRlYmFyLXRvZ2dsZXJcIiBvbmNsaWNrPVwieyBvbkNsaWNrIH1cIiBzdHlsZT1cInZpc2liaWxpdHk6eyBnZXREaXNwbGF5KCkgfTtcIj5cbiAgICAgICAgPCEtLURPQzogUmVtb3ZlIHRoZSBhYm92ZSBcImhpZGVcIiB0byBlbmFibGUgdGhlIHNpZGViYXIgdG9nZ2xlciBidXR0b24gb24gaGVhZGVyLS0+XG4gICAgPC9kaXY+XG48L2Rpdj5cbjxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcyA9XCJtZW51LXRvZ2dsZXIgcmVzcG9uc2l2ZS10b2dnbGVyXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1jb2xsYXBzZVwiPlxuPC9hPlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1sb2dvJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMub25DbGljayA9ICgpID0+IHtcbiAgICAgICAvLyBNZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX1RPR0dMRSk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXREaXNwbGF5ID0gKGVsKSA9PiB7XG5cbiAgICAgICAgaWYoTWV0YU1hcCAmJiBNZXRhTWFwLlJvdXRlciAmJiBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aCA9PSBDT05TVEFOVFMuUEFHRVMuVFJBSU5JTkdTKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3Zpc2libGUnXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hpZGRlbidcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeSgncGFnZU5hbWUnLCAob3B0cykgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfSlcblxuLy9cbi8vICAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XG4vLyAgICAgICAgIHRoaXMuZGlzcGxheSA9IGZhbHNlO1xuLy8gICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuLy8gICAgIH0pO1xuLy9cbi8vXG4vLyAgICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XG4vLyAgICAgICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XG4vLyAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4vLyAgICAgfSk7XG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48IS0tIERPQzogQXBwbHkgXCJzZWFyY2gtZm9ybS1leHBhbmRlZFwiIHJpZ2h0IGFmdGVyIHRoZSBcInNlYXJjaC1mb3JtXCIgY2xhc3MgdG8gaGF2ZSBoYWxmIGV4cGFuZGVkIHNlYXJjaCBib3ggLS0+XG48Zm9ybSBjbGFzcz1cInNlYXJjaC1mb3JtXCIgYWN0aW9uPVwiZXh0cmFfc2VhcmNoLmh0bWxcIiBtZXRob2Q9XCJHRVRcIj5cbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIiBwbGFjZWhvbGRlcj1cIlNlYXJjaC4uLlwiIG5hbWU9XCJxdWVyeVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJidG4gc3VibWl0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtc2VhcmNoXCI+PC9pPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG48L2Zvcm0+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXNlYXJjaCcsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICBcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyLXdyYXBwZXJcIiBzdHlsZT1cInsgZ2V0RGlzcGxheSgpIH1cIj5cbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1zaWRlYmFyIG5hdmJhci1jb2xsYXBzZSBjb2xsYXBzZVwiPlxuICAgICAgICA8dWwgY2xhc3M9XCJwYWdlLXNpZGViYXItbWVudSBcIiBkYXRhLWtlZXAtZXhwYW5kZWQ9XCJmYWxzZVwiIGRhdGEtYXV0by1zY3JvbGw9XCJ0cnVlXCIgZGF0YS1zbGlkZS1zcGVlZD1cIjIwMFwiPlxuXG4gICAgICAgICAgICA8bGkgaWY9XCJ7IGRhdGEgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5jbGljayB9XCIgZWFjaD1cInsgZGF0YSB9XCI+XG4gICAgICAgICAgICAgICAgPGEgaWY9XCJ7IGljb24gfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiIHN0eWxlPVwiY29sb3I6I3sgY29sb3IgfTtcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwieyBhcnJvdzogbWVudS5sZW5ndGggfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPHVsIGlmPVwieyBtZW51ICYmIG1lbnUubGVuZ3RoIH1cIiBjbGFzcz1cInN1Yi1tZW51XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBlYWNoPVwieyBtZW51IH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbGk+XG5cbiAgICAgICAgPC91bD5cblxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXNpZGViYXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5jbGljayA9IGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZygnZm9vJykgfVxuICAgIHRoaXMuZGlzcGxheSA9IHRydWU7XG4gICAgdGhpcy5kYXRhID0gW107XG5cbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL3NpZGViYXInLCAoZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICBpZiAoaW5jbHVkZSAmJiBkLm1lbnUgJiYgZC5tZW51KSB7XG4gICAgICAgICAgICAgICAgZC5tZW51ID0gXy5maWx0ZXIoXy5zb3J0QnkoZC5tZW51LCAnb3JkZXInKSwgKG0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0uYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuZ2V0RGlzcGxheSA9ICgpID0+IHtcbiAgICAgICAgaWYoIXRoaXMuZGlzcGxheSkge1xuICAgICAgICAgICAgcmV0dXJuICdkaXNwbGF5OiBub25lOyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9DTE9TRSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcbiAgICBcbiAgICBcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXG5cbmNvbnN0IG1ldGFQb2ludHMgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1wb2ludHMuanMnKTtcbmNvbnN0IG1ldGFIZWxwID0gcmVxdWlyZSgnLi9tZW51L21ldGEtaGVscC5qcycpO1xuY29uc3QgbWV0YVVzZXIgPSByZXF1aXJlKCcuL21lbnUvbWV0YS11c2VyLmpzJyk7XG5jb25zdCBtZXRhTm90ID0gcmVxdWlyZSgnLi9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcycpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgcHVsbC1yaWdodFwiPlxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfZGFzaGJvYXJkX2JhclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBocmVmPVwiI2hvbWVcIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWhvbWVcIj48L2k+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvbGk+XG5cbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIiBpZD1cImhlYWRlcl9ub3RpZmljYXRpb25fYmFyXCI+PC9saT5cblxuYFxuICAgICAgICAgICAgLy8gPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxuICAgICAgICAgICAgLy8gPGxpIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfcG9pbnRzX2JhclwiPjwvbGk+XG4rIGBcblxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl9oZWxwX2JhclwiIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCI+PC9saT5cblxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl91c2VyX21lbnVcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLXVzZXIgZHJvcGRvd25cIj48L2xpPlxuICAgIDwvdWw+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtdG9wbWVudScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIC8vVE9ETzogcmVzdG9yZSBub3RpZmljYXRpb25zIHdoZW4gbG9naWMgaXMgY29tcGxldGVcbiAgICAgICAgLy9yaW90Lm1vdW50KHRoaXMuaGVhZGVyX3BvaW50c19iYXIsICdtZXRhLXBvaW50cycpO1xuICAgICAgICByaW90Lm1vdW50KHRoaXMuaGVhZGVyX25vdGlmaWNhdGlvbl9iYXIsICdtZXRhLW5vdGlmaWNhdGlvbnMnKTtcbiAgICAgICAgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9oZWxwX2JhciwgJ21ldGEtaGVscCcpO1xuICAgICAgICByaW90Lm1vdW50KHRoaXMuaGVhZGVyX3VzZXJfbWVudSwgJ21ldGEtdXNlcicpO1xuICAgIH0pO1xuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnZGF0YXRhYmxlcycpXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcblxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBpZD1cInRyYWluaW5nc19wYWdlXCIgY2xhc3M9XCJwb3J0bGV0IGJveCBncmV5LWNhc2NhZGVcIj5cbiAgICA8ZGl2IGNsYXNzPVwicG9ydGxldC10aXRsZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1pY29uLXRoLWxhcmdlXCI+PC9pPkNvdXJzZXNcbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlclwiIGlkPVwidHJhaW5pbmdfdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVkIE9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBpZj1cInsgZGF0YSB9XCIgZWFjaD1cInsgZGF0YSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj48YSBocmVmPVwiI3RyYWluaW5ncy97aWR9XCI+eyBuYW1lIH08L2E+PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgY3JlYXRlZF9hdCB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZyhDT05TVEFOVFMuUEFHRVMuQ09VUlNFX0xJU1QsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuXG4gICAgdGhpcy51c2VyID0gTWV0YU1hcC5Vc2VyO1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XG5cbiAgICB9KVxuXG4gICAgLy9SaW90IGJpbmRpbmdzXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xuXG4gICAgICAgIGNvbnN0IGJ1aWxkVGFibGUgPSAobGlzdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBsaXN0O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzW2B0YWJsZWBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbYGRhdGFUYWJsZWBdLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdGhpc1tgdGFibGVgXSA9ICQodGhpc1tgdHJhaW5pbmdfdGFibGVgXSk7XG4gICAgICAgICAgICAgICAgdGhpc1tgZGF0YVRhYmxlYF0gPSB0aGlzW2B0YWJsZWBdLkRhdGFUYWJsZSh7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgdXNlcyBzY3JvbGxhYmxlIGRpdih0YWJsZS1zY3JvbGxhYmxlKSB3aXRoIG92ZXJmbG93OmF1dG8gdG8gZW5hYmxlIHZlcnRpY2FsIHNjcm9sbChzZWU6IGFzc2V0cy9nbG9iYWwvcGx1Z2lucy9kYXRhdGFibGVzL3BsdWdpbnMvYm9vdHN0cmFwL2RhdGFUYWJsZXMuYm9vdHN0cmFwLmpzKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gU28gd2hlbiBkcm9wZG93bnMgdXNlZCB0aGUgc2Nyb2xsYWJsZSBkaXYgc2hvdWxkIGJlIHJlbW92ZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxuICAgICAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXG4gICAgICAgICAgICAgICAgICAgICdjb2x1bW5zJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ3JlYXRlZCBPbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciB0YWJsZVdyYXBwZXIgPSB0aGlzW2B0YWJsZWBdLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoYCN0cmFpbmluZ190YWJsZV93cmFwcGVyYCk7XG5cbiAgICAgICAgICAgICAgICB0YWJsZVdyYXBwZXIuZmluZCgnLmRhdGFUYWJsZXNfbGVuZ3RoIHNlbGVjdCcpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wgaW5wdXQteHNtYWxsIGlucHV0LWlubGluZScpOyAvLyBtb2RpZnkgdGFibGUgcGVyIHBhZ2UgZHJvcGRvd25cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLmVycm9yKGUpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vRmV0Y2ggQWxsIG1hcHNcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5nZXRDaGlsZChDT05TVEFOVFMuUk9VVEVTLkNPVVJTRV9MSVNUKS5vbigndmFsdWUnLCAodmFsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gdmFsLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcbiAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XG4gICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBidWlsZFRhYmxlKG1hcHMpO1xuICAgICAgICAgICAgJCgnLm93bmVyLWxhYmVsJykudG9vbHRpcCgpXG4gICAgICAgfSk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93IG1hcmdpbi1ib3R0b20tMzBcIj5cblx0XHRcdFx0XHRcdDxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb2wtbWQtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT57IGhlYWRlci50aXRsZSB9PC9oMT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IGhlYWRlci50ZXh0IH08L3A+XG5cdFx0XHRcdFx0XHRcdDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbWFyZ2luLXRvcC0xMCBtYXJnaW4tYm90dG9tLTEwXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGFyZWFzIH1cIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxiPnsgdGl0bGUgfTwvYj4geyB0ZXh0IH1cblx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdFx0XHQ8IS0tIEJsb2NrcXVvdGVzIC0tPlxuXHRcdFx0XHRcdFx0XHQ8YmxvY2txdW90ZSBjbGFzcz1cImhlcm9cIj5cblx0XHRcdFx0XHRcdFx0XHQ8cD57IHF1b3RlLnRleHQgfTwvcD5cblx0XHRcdFx0XHRcdFx0XHQ8c21hbGw+eyBxdW90ZS5ieSB9PC9zbWFsbD5cblx0XHRcdFx0XHRcdFx0PC9ibG9ja3F1b3RlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZGR0aGlzX2hvcml6b250YWxfZm9sbG93X3Rvb2xib3hcIj48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcyA9XCJjb2wtbWQtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIGlmPVwieyBoZWFkZXIueW91dHViZWlkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cInl0cGxheWVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHQvaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgaGVhZGVyLnlvdXR1YmVpZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzID1cImZpdHZpZHNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImhlaWdodDogMzI3cHg7IHdpZHRoOiAxMDAlOyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bzsgYnJvZGVyOiAwO1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cblx0XHRcdFx0XHRcdFx0PC9pZnJhbWU+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRsaW5lXCI+XG5cdFx0XHRcdFx0XHQ8aDM+eyB1c2VyTmFtZSB9eyB2aXNpb24udGl0bGUgfTwvaDM+XG5cdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57IHZpc2lvbi50ZXh0IH08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnaG9tZScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLmFyZWFzID0gW11cbiAgICB0aGlzLmhlYWRlciA9IHt9XG5cbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuSE9NRSwgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuYXJlYXMsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5xdW90ZSA9IGRhdGEucXVvdGU7XG4gICAgICAgIHRoaXMuaGVhZGVyID0gZGF0YS5oZWFkZXI7XG4gICAgICAgIHRoaXMudmlzaW9uID0gZGF0YS52aXNpb247XG5cbiAgICAgICAgdGhpcy51c2VyTmFtZSA9IE1ldGFNYXAuVXNlci5mdWxsTmFtZTtcblxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5yZXF1aXJlKCdkYXRhdGFibGVzJylcbnJlcXVpcmUoJ2RhdGF0YWJsZXMtYm9vdHN0cmFwMy1wbHVnaW4nKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCByYXcgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL3JhdycpO1xuY29uc3QgU2hhcmVNYXAgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL1NoYXJlTWFwJylcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJteV9tYXBzX3BhZ2VcIiBjbGFzcz1cInBvcnRsZXQgYm94IGdyZXktY2FzY2FkZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LXRpdGxlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tdGgtbGFyZ2VcIj48L2k+TWV0YU1hcHNcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWY9XCJ7IG1lbnUgfVwiIGNsYXNzPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgPGEgZWFjaD1cInsgbWVudS5idXR0b25zIH1cIiBocmVmPVwieyBsaW5rIH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25BY3Rpb25DbGljayB9XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCI+XG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jb2dzXCI+PC9pPiBUb29scyA8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgZWFjaD1cInsgbWVudS5tZW51IH1cIiBvbmNsaWNrPVwieyBwYXJlbnQub25NZW51Q2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInsgbGluayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicG9ydGxldC1ib2R5XCI+XG4gICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBwb3J0bGV0LXRhYnNcIj5cbiAgICAgICAgICAgIDxsaSBvbmNsaWNrPVwieyBwYXJlbnQub25UYWJTd2l0Y2ggfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInsgYWN0aXZlOiBpID09IDAgfVwiPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjbXltYXBzXzFfeyBpIH1cIiBkYXRhLXRvZ2dsZT1cInRhYlwiIGFyaWEtZXhwYW5kZWQ9XCJ7IHRydWU6IGkgPT0gMCB9XCI+XG4gICAgICAgICAgICAgICAgeyB2YWwudGl0bGUgfTwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS10b29sYmFyXCI+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ0YWItcGFuZSBmYXNlIGluIHsgYWN0aXZlOiBpID09IDAgfVwiIGlkPVwibXltYXBzXzFfeyBpIH1cIj5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWhvdmVyXCIgaWQ9XCJteW1hcHNfdGFibGVfeyBpIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInRhYmxlLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJncm91cC1jaGVja2FibGVcIiBkYXRhLXNldD1cIiNteW1hcHNfdGFibGVfeyBpIH0gLmNoZWNrYm94ZXNcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZWQgT25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXR1c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPd25lclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgaWY9XCJ7IHBhcmVudC5kYXRhICYmIHBhcmVudC5kYXRhW2ldIH1cIiBlYWNoPVwieyBwYXJlbnQuZGF0YVtpXSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfHwgcGFyZW50LnVzZXIuaXNBZG1pbiB9XCIgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjaGVja2JveGVzXCIgdmFsdWU9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zbSBibHVlIGZpbHRlci1zdWJtaXRcIiBvbmNsaWNrPVwieyBwYXJlbnQub25PcGVuIH1cIj5PcGVuPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIH1cIiBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uU2hhcmUgfVwiPlNoYXJlIDxpIGNsYXNzPVwiZmEgZmEtc2hhcmVcIj48L2k+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZj1cInsgdmFsLnRpdGxlICE9ICdNeSBNYXBzJyB9XCIgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNvcHkgfVwiPkNvcHkgPGkgY2xhc3M9XCJmYSBmYS1jbG9uZVwiPjwvaT48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IGVkaXRhYmxlIH1cIiBjbGFzcz1cIm1ldGFfZWRpdGFibGVfeyBpIH1cIiBkYXRhLXBrPVwieyBpZCB9XCIgZGF0YS10aXRsZT1cIkVkaXQgTWFwIE5hbWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgIWVkaXRhYmxlIH1cIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBjcmVhdGVkX2F0IH08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgcGFyZW50LmdldFN0YXR1cyh0aGlzKSB9XCI+PC9yYXc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IHBhcmVudC5nZXRPd25lcih0aGlzKSB9XCI+PC9yYXc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbXktbWFwcycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuXG4gICAgdGhpcy51c2VyID0gTWV0YU1hcC5Vc2VyO1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gICAgdGhpcy5tZW51ID0gbnVsbDtcbiAgICBsZXQgdGFicyA9IFtcbiAgICAgICAgeyB0aXRsZTogJ015IE1hcHMnLCBvcmRlcjogMCwgZWRpdGFibGU6IHRydWUgfSxcbiAgICAgICAgeyB0aXRsZTogJ1NoYXJlZCB3aXRoIE1lJywgb3JkZXI6IDEsIGVkaXRhYmxlOiBmYWxzZSB9LFxuICAgICAgICB7IHRpdGxlOiAnUHVibGljJywgb3JkZXI6IDIsIGVkaXRhYmxlOiBmYWxzZSB9XG4gICAgXTtcbiAgICBpZiAodGhpcy51c2VyLmlzQWRtaW4pIHtcbiAgICAgICAgdGFicy5wdXNoKHsgdGl0bGU6ICdBbGwgTWFwcycsIG9yZGVyOiAzLCBlZGl0YWJsZTogdHJ1ZSB9KVxuICAgICAgICB0YWJzLnB1c2goeyB0aXRsZTogJ1RlbXBsYXRlcycsIG9yZGVyOiA0LCBlZGl0YWJsZTogdHJ1ZSB9KVxuICAgIH1cbiAgICB0aGlzLnRhYnMgPSBfLnNvcnRCeSh0YWJzLCAnb3JkZXInKVxuXG4gICAgdGhpcy5jdXJyZW50VGFiID0gJ015IE1hcHMnO1xuXG4gICAgLy9cbiAgICB0aGlzLmdldFN0YXR1cyA9IChpdGVtKSA9PiB7XG4gICAgICAgIGxldCBzdGF0dXMgPSAnUHJpdmF0ZSdcbiAgICAgICAgbGV0IGNvZGUgPSAnZGVmYXVsdCdcbiAgICAgICAgbGV0IGh0bWwgPSAnJztcbiAgICAgICAgaWYgKGl0ZW0uc2hhcmVkX3dpdGgpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLnNoYXJlZF93aXRoWycqJ10gJiYgKGl0ZW0uc2hhcmVkX3dpdGhbJyonXS5yZWFkID09IHRydWUgfHwgaXRlbS5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ1B1YmxpYydcbiAgICAgICAgICAgICAgICBjb2RlID0gJ3ByaW1hcnknXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8uZWFjaChpdGVtLnNoYXJlZF93aXRoLCAoc2hhcmUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2hhcmUucGljdHVyZSAmJiBrZXkgIT0gJyonICYmIGtleSAhPSAnYWRtaW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cImxhYmVsIG93bmVyLWxhYmVsXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1wbGFjZW1lbnQ9XCJib3R0b21cIiB0aXRsZT1cIiR7c2hhcmUubmFtZX1cIj48aW1nIGFsdD1cIiR7c2hhcmUubmFtZX1cIiBoZWlnaHQ9XCIzMFwiIHdpZHRoPVwiMzBcIiBjbGFzcz1cImltZy1jaXJjbGVcIiBzcmM9XCIke3NoYXJlLnBpY3R1cmV9XCI+PC9zcGFuPmBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9ICc8c3BhbiBjbGFzcz1cIlwiPlNoYXJlZCB3aXRoOiA8L3NwYW4+JyArIGh0bWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGh0bWwgPSBodG1sIHx8IGA8c3BhbiBjbGFzcz1cImxhYmVsIGxhYmVsLXNtIGxhYmVsLSR7Y29kZX1cIj4ke3N0YXR1c308L3NwYW4+YFxuXG4gICAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0T3duZXIgPSAoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgaHRtbCA9IGA8c3BhbiBjbGFzcz1cImxhYmVsIG93bmVyLWxhYmVsXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1wbGFjZW1lbnQ9XCJib3R0b21cIiB0aXRsZT1cIiR7aXRlbS5vd25lci5uYW1lfVwiPjxpbWcgYWx0PVwiJHtpdGVtLm93bmVyLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtpdGVtLm93bmVyLnBpY3R1cmV9XCI+PC9zcGFuPmBcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLy9FdmVudHNcbiAgICB0aGlzLm9uT3BlbiA9IChldmVudCwgLi4ubykgPT4ge1xuICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgbWFwLyR7ZXZlbnQuaXRlbS5pZH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uU2hhcmUgPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgbGV0IG9wdHMgPSB7XG4gICAgICAgICAgICBtYXA6IGV2ZW50Lml0ZW1cbiAgICAgICAgfVxuICAgICAgICBTaGFyZU1hcC5hY3Qob3B0cyk7XG4gICAgfVxuXG4gICAgdGhpcy5vbkNvcHkgPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvcHknKVxuICAgIH1cblxuICAgIHRoaXMub25UYWJTd2l0Y2ggPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGFiID0gZXZlbnQuaXRlbS52YWwudGl0bGU7XG4gICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICQoJy5vd25lci1sYWJlbCcpLnRvb2x0aXAoKVxuICAgICAgICB9LCAyNTApO1xuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VycmVudFRhYikge1xuICAgICAgICAgICAgY2FzZSAnTXkgTWFwcyc6XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub25BY3Rpb25DbGljayA9IChldmVudCwgdGFnKSA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMub25NZW51Q2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50VGFiID09ICdNeSBNYXBzJykge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5pdGVtLnRpdGxlLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVNYXBzID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9EZWxldGVNYXAuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpc1tgdGFibGUwYF0uZmluZCgnLmFjdGl2ZScpLmZpbmQoJy5tYXBpZCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaWRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChzZWxlY3RlZCwgKGNlbGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkcy5wdXNoKGNlbGwuaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZU1hcHMuZGVsZXRlQWxsKGlkcywgQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmluZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJ3Rib2R5IHRyIC5jaGVja2JveGVzJyk7XG4gICAgICAgICAgICAgICAgICAgIGZpbmQuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5LnVuaWZvcm0udXBkYXRlKGZpbmQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcblxuICAgIH0pXG5cbiAgICAvL1Jpb3QgYmluZGluZ3NcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgTlByb2dyZXNzLnN0YXJ0KCk7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvbXltYXBzJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZW51ID0ge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBfLnNvcnRCeShkYXRhLmJ1dHRvbnMsICdvcmRlcicpLFxuICAgICAgICAgICAgICAgICAgICBtZW51OiBfLnNvcnRCeShkYXRhLm1lbnUsICdvcmRlcicpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBidWlsZFRhYmxlID0gKGlkeCwgbGlzdCwgZWRpdGFibGUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpZHhdID0gbGlzdDtcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tgdGFibGUke2lkeH1gXSkge1xuICAgICAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSgnZGVzdHJveScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0gPSAkKHRoaXNbYG15bWFwc190YWJsZV8ke2lkeH1gXSk7XG4gICAgICAgICAgICAgICAgdGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0gPSB0aGlzW2B0YWJsZSR7aWR4fWBdLkRhdGFUYWJsZSh7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgdXNlcyBzY3JvbGxhYmxlIGRpdih0YWJsZS1zY3JvbGxhYmxlKSB3aXRoIG92ZXJmbG93OmF1dG8gdG8gZW5hYmxlIHZlcnRpY2FsIHNjcm9sbChzZWU6IGFzc2V0cy9nbG9iYWwvcGx1Z2lucy9kYXRhdGFibGVzL3BsdWdpbnMvYm9vdHN0cmFwL2RhdGFUYWJsZXMuYm9vdHN0cmFwLmpzKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gU28gd2hlbiBkcm9wZG93bnMgdXNlZCB0aGUgc2Nyb2xsYWJsZSBkaXYgc2hvdWxkIGJlIHJlbW92ZWQuXG4gICAgICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxuICAgICAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXG4gICAgICAgICAgICAgICAgICAgICdjb2x1bW5zJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdDaGNrQngnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTIwcHgnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ05hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdDcmVhdGVkIE9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU3RhdHVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL3RoaXNbYHRhYmxlJHtpZHh9YF1Ub29scyA9IG5ldyAkLmZuLmRhdGFUYWJsZS5UYWJsZVRvb2xzKHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLCB7fSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGFibGVXcmFwcGVyID0gdGhpc1tgdGFibGUke2lkeH1gXS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAjbXltYXBzXyR7aWR4fV90YWJsZV93cmFwcGVyYCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdLmZpbmQoJy5ncm91cC1jaGVja2FibGUnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2V0ID0galF1ZXJ5KHRoaXMpLmF0dHIoJ2RhdGEtc2V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VkID0galF1ZXJ5KHRoaXMpLmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkoc2V0KS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkudW5pZm9ybS51cGRhdGUoc2V0KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0ub24oJ2NoYW5nZScsICd0Ym9keSB0ciAuY2hlY2tib3hlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRhYmxlV3JhcHBlci5maW5kKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0JykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCBpbnB1dC14c21hbGwgaW5wdXQtaW5saW5lJyk7IC8vIG1vZGlmeSB0YWJsZSBwZXIgcGFnZSBkcm9wZG93blxuXG4gICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoeyB1bnNhdmVkY2xhc3M6IG51bGwgfSkub24oJ3NhdmUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xuICAgICAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7aWR9L25hbWVgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgICAgICAgICAgICAgIE1ldGFNYXAuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9GZXRjaCBBbGwgbWFwc1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldENoaWxkKENPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUKS5vbigndmFsdWUnLCAodmFsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gdmFsLnZhbCgpO1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMudGFicywgKHRhYikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtYXBzID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhYi50aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdUZW1wbGF0ZXMnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNeSBNYXBzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCA9PSBNZXRhTWFwLlVzZXIudXNlcklkKSB7IC8vT25seSBpbmNsdWRlIG15IG93biBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdTaGFyZWQgd2l0aCBNZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgIT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCAmJiAvL0Rvbid0IGluY2x1ZGUgbXkgb3duIG1hcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoICYmIC8vRXhjbHVkZSBhbnl0aGluZyB0aGF0IGlzbid0IHNoYXJlZCBhdCBhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFvYmouc2hhcmVkX3dpdGhbJyonXSB8fCAob2JqLnNoYXJlZF93aXRoWycqJ10ucmVhZCAhPSB0cnVlIHx8IG9iai5zaGFyZWRfd2l0aFsnKiddLndyaXRlICE9IHRydWUpKSAmJiAvL0V4Y2x1ZGUgcHVibGljIG1hcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdICYmIC8vSW5jbHVkZSBzaGFyZXMgd2loIG15IHVzZXJJZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUgfHwgLy9JbmNsdWRlIGFueXRoaW5nIEkgY2FuIHdyaXRlIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXS5yZWFkID09IHRydWUpIC8vSW5jbHVkZSBhbnl0aGluZyBJIGNhbiByZWFkIGZyb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IChvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdQdWJsaWMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aCAmJiAvL0V4Y2x1ZGUgYW55dGhpbmcgdGhhdCBpc24ndCBzaGFyZWQgYXQgYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvYmouc2hhcmVkX3dpdGhbJyonXSAmJiAob2JqLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlIHx8IG9iai5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpICkgLy9JbmNsdWRlIHB1YmxpYyBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSAob2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdBbGwgTWFwcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VyLmlzQWRtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTGlrZSBpdCBzYXlzLCBhbGwgbWFwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWFwcykge1xuICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5maWx0ZXIobWFwcywgKG1hcCkgPT4geyByZXR1cm4gbWFwICYmIG1hcC5pZCB9KVxuICAgICAgICAgICAgICAgICAgICBidWlsZFRhYmxlKHRhYi5vcmRlciwgbWFwcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoJy5vd25lci1sYWJlbCcpLnRvb2x0aXAoKVxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBvcnRsZXQgbGlnaHRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxuXHRcdFx0XHRcdFx0PGRpdiBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT57IGhlYWRlci50aXRsZSB9PC9oMT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IGhlYWRlci50ZXh0IH08L3A+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBlYWNoPVwieyBhcmVhcyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGxpbmVcIj5cbiAgICBcdFx0XHRcdFx0XHQ8aDM+eyB0aXRsZSB9PC9oMz5cbiAgICBcdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgdGV4dCB9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxuXHRcdFx0XHRcdFx0XHQ8bGkgZWFjaD1cInsgaXRlbXMgfVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IDxiPnsgdGl0bGUgfTwvYj4geyB0ZXh0IH1cblx0XHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdDwvdWw+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygndGVybXMnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuICAgIFxuICAgIHRoaXMuYXJlYXMgPSBbXVxuICAgIHRoaXMuaGVhZGVyID0ge31cblxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5URVJNU19BTkRfQ09ORElUSU9OUywgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuc2VjdGlvbnMsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgbGV0IGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgIGlmKGluY2x1ZGUpIHtcbiAgICAgICAgICAgICAgICBkLml0ZW1zID0gXy5maWx0ZXIoXy5zb3J0QnkoZC5pdGVtcywgJ29yZGVyJyksIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmNsdWRlMiA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICB0aGlzLnVzZXJOYW1lID0gTWV0YU1hcC5Vc2VyLmZ1bGxOYW1lO1xuICAgICAgICBcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgXG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcbmNvbnN0IFZpZGVvUGxheWVyID0gcmVxdWlyZSgnLi4vLi4vdG9vbHMvVmlkZW9QbGF5ZXInKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBpZD1cInRyYWluaW5nX3BvcnRsZXRcIiBjbGFzcz1cInBvcnRsZXQgbGlnaHRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0zIGNvbC1tZC0zIGNvbC1zbS02IGNvbC14cy0xMlwiPlxuXG5cdFx0XHRcdCAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTYgY29sLW1kLTYgY29sLXNtLTYgY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cInRyYWluaW5nX3BsYXllclwiPjwvZGl2PlxuXHRcdFx0XHQgICAgICAgIDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZyhDT05TVEFOVFMuVEFHUy5UUkFJTklORywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcblxuICAgIHRoaXMudHJhaW5pbmcgPSB7fVxuXG4gICAgY29uc3QgZ2V0RGF0YSA9IF8ub25jZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5pZCkge1xuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgJHtDT05TVEFOVFMuUk9VVEVTLkNPVVJTRV9MSVNUfSR7dGhpcy5jb25maWcuaWR9YCwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWluaW5nID0gZGF0YTtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5vbignbW91bnQgdXBkYXRlJywgKGV2ZW50LCBvcHRzKSA9PiB7XG4gICAgICAgIGlmIChvcHRzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdHNcbiAgICAgICAgICAgIGdldERhdGEoKVxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgVmlkZW9QbGF5ZXIoJ3RyYWluaW5nX3BsYXllcicsIHtoZWlnaHQ6IDM5MCwgd2lkdGg6IDY0MCwgdmlkZW9JZDogJ2RVcVJUV0NkWHQ0J30pXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcbiAgICAgICAgJCh0aGlzLnRyYWluaW5nX3BvcnRsZXQpLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCArICdweCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcbiAgICB9KTtcblxufSk7IiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG4vKipcbkRlbW8gc2NyaXB0IHRvIGhhbmRsZSB0aGUgdGhlbWUgZGVtb1xuKiovXG52YXIgRGVtbyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIEhhbmRsZSBUaGVtZSBTZXR0aW5nc1xuICAgIHZhciBoYW5kbGVUaGVtZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgcGFuZWwgPSAkKCcudGhlbWUtcGFuZWwnKTtcblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWJveGVkJykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAkKCcubGF5b3V0LW9wdGlvbicsIHBhbmVsKS52YWwoXCJmbHVpZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJkZWZhdWx0XCIpO1xuICAgICAgICAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xuICAgICAgICAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImRlZmF1bHRcIik7XG4gICAgICAgIGlmICgkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJykuYXR0cihcImRpc2FibGVkXCIpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgJCgnLnNpZGViYXItcG9zLW9wdGlvbicsIHBhbmVsKS52YWwoTWV0cm9uaWMuaXNSVEwoKSA/ICdyaWdodCcgOiAnbGVmdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9oYW5kbGUgdGhlbWUgbGF5b3V0XG4gICAgICAgIHZhciByZXNldExheW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1ib3hlZFwiKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikuXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIikuXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcblxuICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyID4gLnBhZ2UtaGVhZGVyLWlubmVyJykucmVtb3ZlQ2xhc3MoXCJjb250YWluZXJcIik7XG5cbiAgICAgICAgICAgIGlmICgkKCcucGFnZS1jb250YWluZXInKS5wYXJlbnQoXCIuY29udGFpbmVyXCIpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLWNvbnRhaW5lcicpLmluc2VydEFmdGVyKCdib2R5ID4gLmNsZWFyZml4Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKCcucGFnZS1mb290ZXIgPiAuY29udGFpbmVyJykuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgkKCcucGFnZS1mb290ZXIgPiAuY29udGFpbmVyJykuaHRtbCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCgnLnBhZ2UtZm9vdGVyJykucGFyZW50KFwiLmNvbnRhaW5lclwiKS5zaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5pbnNlcnRBZnRlcignLnBhZ2UtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5pbnNlcnRBZnRlcignLnBhZ2UtZm9vdGVyJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLnJlbW92ZUNsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcblxuICAgICAgICAgICAgJCgnYm9keSA+IC5jb250YWluZXInKS5yZW1vdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbGFzdFNlbGVjdGVkTGF5b3V0ID0gJyc7XG5cbiAgICAgICAgdmFyIHNldExheW91dCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGxheW91dE9wdGlvbiA9ICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJPcHRpb24gPSAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgaGVhZGVyT3B0aW9uID0gJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmb290ZXJPcHRpb24gPSAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJQb3NPcHRpb24gPSAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJTdHlsZU9wdGlvbiA9ICQoJy5zaWRlYmFyLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudU9wdGlvbiA9ICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGhlYWRlclRvcERyb3Bkb3duU3R5bGUgPSAkKCcucGFnZS1oZWFkZXItdG9wLWRyb3Bkb3duLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcblxuXG4gICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PSBcImZpeGVkXCIgJiYgaGVhZGVyT3B0aW9uID09IFwiZGVmYXVsdFwiKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0RlZmF1bHQgSGVhZGVyIHdpdGggRml4ZWQgU2lkZWJhciBvcHRpb24gaXMgbm90IHN1cHBvcnRlZC4gUHJvY2VlZCB3aXRoIEZpeGVkIEhlYWRlciB3aXRoIEZpeGVkIFNpZGViYXIuJyk7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgc2lkZWJhck9wdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgICAgICAgICAgaGVhZGVyT3B0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzZXRMYXlvdXQoKTsgLy8gcmVzZXQgbGF5b3V0IHRvIGRlZmF1bHQgc3RhdGVcblxuICAgICAgICAgICAgaWYgKGxheW91dE9wdGlvbiA9PT0gXCJib3hlZFwiKSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1ib3hlZFwiKTtcblxuICAgICAgICAgICAgICAgIC8vIHNldCBoZWFkZXJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgPiAucGFnZS1oZWFkZXItaW5uZXInKS5hZGRDbGFzcyhcImNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICB2YXIgY29udCA9ICQoJ2JvZHkgPiAuY2xlYXJmaXgnKS5hZnRlcignPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGNvbnRlbnRcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1jb250YWluZXInKS5hcHBlbmRUbygnYm9keSA+IC5jb250YWluZXInKTtcblxuICAgICAgICAgICAgICAgIC8vIHNldCBmb290ZXJcbiAgICAgICAgICAgICAgICBpZiAoZm9vdGVyT3B0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmh0bWwoJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4nICsgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgpICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmFwcGVuZFRvKCdib2R5ID4gLmNvbnRhaW5lcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxhc3RTZWxlY3RlZExheW91dCAhPSBsYXlvdXRPcHRpb24pIHtcbiAgICAgICAgICAgICAgICAvL2xheW91dCBjaGFuZ2VkLCBydW4gcmVzcG9uc2l2ZSBoYW5kbGVyOlxuICAgICAgICAgICAgICAgIE1ldHJvbmljLnJ1blJlc2l6ZUhhbmRsZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0U2VsZWN0ZWRMYXlvdXQgPSBsYXlvdXRPcHRpb247XG5cbiAgICAgICAgICAgIC8vaGVhZGVyXG4gICAgICAgICAgICBpZiAoaGVhZGVyT3B0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLWhlYWRlclwiKS5yZW1vdmVDbGFzcyhcIm5hdmJhci1zdGF0aWMtdG9wXCIpLmFkZENsYXNzKFwibmF2YmFyLWZpeGVkLXRvcFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLWhlYWRlclwiKS5yZW1vdmVDbGFzcyhcIm5hdmJhci1maXhlZC10b3BcIikuYWRkQ2xhc3MoXCJuYXZiYXItc3RhdGljLXRvcFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaWRlYmFyXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWZ1bGwtd2lkdGgnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWZpeGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1kZWZhdWx0XCIpO1xuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdEZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1kZWZhdWx0XCIpO1xuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1maXhlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhci1tZW51JykudW5iaW5kKCdtb3VzZWVudGVyJykudW5iaW5kKCdtb3VzZWxlYXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0b3AgZHJvcGRvd24gc3R5bGVcbiAgICAgICAgICAgIGlmIChoZWFkZXJUb3BEcm9wZG93blN0eWxlID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICAkKFwiLnRvcC1tZW51ID4gLm5hdmJhci1uYXYgPiBsaS5kcm9wZG93blwiKS5hZGRDbGFzcyhcImRyb3Bkb3duLWRhcmtcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLnJlbW92ZUNsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9mb290ZXJcbiAgICAgICAgICAgIGlmIChmb290ZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2lkZWJhciBzdHlsZVxuICAgICAgICAgICAgaWYgKHNpZGViYXJTdHlsZU9wdGlvbiA9PT0gJ2NvbXBhY3QnKSB7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNvbXBhY3RcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1jb21wYWN0XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NpZGViYXIgbWVudVxuICAgICAgICAgICAgaWYgKHNpZGViYXJNZW51T3B0aW9uID09PSAnaG92ZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJPcHRpb24gPT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoXCJhY2NvcmRpb25cIik7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiSG92ZXIgU2lkZWJhciBNZW51IGlzIG5vdCBjb21wYXRpYmxlIHdpdGggRml4ZWQgU2lkZWJhciBNb2RlLiBTZWxlY3QgRGVmYXVsdCBTaWRlYmFyIE1vZGUgSW5zdGVhZC5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaWRlYmFyIHBvc2l0aW9uXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuaXNSVEwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyUG9zT3B0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAnbGVmdCdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhclBvc09wdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAnbGVmdCdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIExheW91dC5maXhDb250ZW50SGVpZ2h0KCk7IC8vIGZpeCBjb250ZW50IGhlaWdodFxuICAgICAgICAgICAgTGF5b3V0LmluaXRGaXhlZFNpZGViYXIoKTsgLy8gcmVpbml0aWFsaXplIGZpeGVkIHNpZGViYXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBoYW5kbGUgdGhlbWUgY29sb3JzXG4gICAgICAgIHZhciBzZXRDb2xvciA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICAgICAgdmFyIGNvbG9yXyA9IChNZXRyb25pYy5pc1JUTCgpID8gY29sb3IgKyAnLXJ0bCcgOiBjb2xvcik7XG4gICAgICAgICAgICAkKCcjc3R5bGVfY29sb3InKS5hdHRyKFwiaHJlZlwiLCBMYXlvdXQuZ2V0TGF5b3V0Q3NzUGF0aCgpICsgJ3RoZW1lcy8nICsgY29sb3JfICsgXCIuY3NzXCIpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgJCgnLnRoZW1lLWNvbG9ycyA+IGxpJywgcGFuZWwpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb2xvciA9ICQodGhpcykuYXR0cihcImRhdGEtdGhlbWVcIik7XG4gICAgICAgICAgICBzZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICAkKCd1bCA+IGxpJywgcGFuZWwpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKGNvbG9yID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1hY3Rpb25zIC5idG4nKS5yZW1vdmVDbGFzcygncmVkLWhhemUnKS5hZGRDbGFzcygnYnRuLWRlZmF1bHQgYnRuLXRyYW5zcGFyZW50Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLWFjdGlvbnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tZGVmYXVsdCBidG4tdHJhbnNwYXJlbnQnKS5hZGRDbGFzcygncmVkLWhhemUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2V0IGRlZmF1bHQgdGhlbWUgb3B0aW9uczpcblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1ib3hlZFwiKSkge1xuICAgICAgICAgICAgJCgnLmxheW91dC1vcHRpb24nLCBwYW5lbCkudmFsKFwiYm94ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIikpIHtcbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikpIHtcbiAgICAgICAgICAgICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbChcInJpZ2h0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1saWdodFwiKSkge1xuICAgICAgICAgICAgJCgnLnNpZGViYXItc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbChcImxpZ2h0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51XCIpKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoXCJob3ZlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaWRlYmFyT3B0aW9uID0gJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGhlYWRlck9wdGlvbiA9ICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgZm9vdGVyT3B0aW9uID0gJCgnLnBhZ2UtZm9vdGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyUG9zT3B0aW9uID0gJCgnLnNpZGViYXItcG9zLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyU3R5bGVPcHRpb24gPSAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhck1lbnVPcHRpb24gPSAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoKTtcblxuICAgICAgICAkKCcubGF5b3V0LW9wdGlvbiwgLnBhZ2UtaGVhZGVyLXRvcC1kcm9wZG93bi1zdHlsZS1vcHRpb24sIC5wYWdlLWhlYWRlci1vcHRpb24sIC5zaWRlYmFyLW9wdGlvbiwgLnBhZ2UtZm9vdGVyLW9wdGlvbiwgLnNpZGViYXItcG9zLW9wdGlvbiwgLnNpZGViYXItc3R5bGUtb3B0aW9uLCAuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS5jaGFuZ2Uoc2V0TGF5b3V0KTtcbiAgICB9O1xuXG4gICAgLy8gaGFuZGxlIHRoZW1lIHN0eWxlXG4gICAgdmFyIHNldFRoZW1lU3R5bGUgPSBmdW5jdGlvbihzdHlsZSkge1xuICAgICAgICB2YXIgZmlsZSA9IChzdHlsZSA9PT0gJ3JvdW5kZWQnID8gJ2NvbXBvbmVudHMtcm91bmRlZCcgOiAnY29tcG9uZW50cycpO1xuICAgICAgICBmaWxlID0gKE1ldHJvbmljLmlzUlRMKCkgPyBmaWxlICsgJy1ydGwnIDogZmlsZSk7XG5cbiAgICAgICAgJCgnI3N0eWxlX2NvbXBvbmVudHMnKS5hdHRyKFwiaHJlZlwiLCBNZXRyb25pYy5nZXRHbG9iYWxDc3NQYXRoKCkgKyBmaWxlICsgXCIuY3NzXCIpO1xuXG4gICAgICAgIGlmICgkLmNvb2tpZSkge1xuICAgICAgICAgICAgJC5jb29raWUoJ2xheW91dC1zdHlsZS1vcHRpb24nLCBzdHlsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgdGhlIHRoZW1lXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaGFuZGxlcyBzdHlsZSBjdXN0b21lciB0b29sXG4gICAgICAgICAgICBoYW5kbGVUaGVtZSgpO1xuXG4gICAgICAgICAgICAvLyBoYW5kbGUgbGF5b3V0IHN0eWxlIGNoYW5nZVxuICAgICAgICAgICAgJCgnLnRoZW1lLXBhbmVsIC5sYXlvdXQtc3R5bGUtb3B0aW9uJykuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICBzZXRUaGVtZVN0eWxlKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNldCBsYXlvdXQgc3R5bGUgZnJvbSBjb29raWVcbiAgICAgICAgICAgIGlmICgkLmNvb2tpZSAmJiAkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpID09PSAncm91bmRlZCcpIHtcbiAgICAgICAgICAgICAgICBzZXRUaGVtZVN0eWxlKCQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykpO1xuICAgICAgICAgICAgICAgICQoJy50aGVtZS1wYW5lbCAubGF5b3V0LXN0eWxlLW9wdGlvbicpLnZhbCgkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbn0gKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVtbyIsImNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxuY29uc3QgTWV0cm9uaWMgPSByZXF1aXJlKCcuL21ldHJvbmljJylcbi8qKlxuQ29yZSBzY3JpcHQgdG8gaGFuZGxlIHRoZSBlbnRpcmUgdGhlbWUgYW5kIGNvcmUgZnVuY3Rpb25zXG4qKi9cbnZhciBMYXlvdXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBsYXlvdXRJbWdQYXRoID0gJ2FkbWluL2xheW91dDQvaW1nLyc7XG5cbiAgICB2YXIgbGF5b3V0Q3NzUGF0aCA9ICdhZG1pbi9sYXlvdXQ0L2Nzcy8nO1xuXG4gICAgdmFyIHJlc0JyZWFrcG9pbnRNZCA9IE1ldHJvbmljLmdldFJlc3BvbnNpdmVCcmVha3BvaW50KCdtZCcpO1xuXG4gICAgLy8qIEJFR0lOOkNPUkUgSEFORExFUlMgKi8vXG4gICAgLy8gdGhpcyBmdW5jdGlvbiBoYW5kbGVzIHJlc3BvbnNpdmUgbGF5b3V0IG9uIHNjcmVlbiBzaXplIHJlc2l6ZSBvciBtb2JpbGUgZGV2aWNlIHJvdGF0ZS5cblxuXG4gICAgLy8gSGFuZGxlIHNpZGViYXIgbWVudSBsaW5rc1xuICAgIHZhciBoYW5kbGVTaWRlYmFyTWVudUFjdGl2ZUxpbmsgPSBmdW5jdGlvbihtb2RlLCBlbCkge1xuICAgICAgICB2YXIgdXJsID0gbG9jYXRpb24uaGFzaC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XG5cbiAgICAgICAgaWYgKG1vZGUgPT09ICdjbGljaycgfHwgbW9kZSA9PT0gJ3NldCcpIHtcbiAgICAgICAgICAgIGVsID0gJChlbCk7XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gJ21hdGNoJykge1xuICAgICAgICAgICAgbWVudS5maW5kKFwibGkgPiBhXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgLy8gdXJsIG1hdGNoIGNvbmRpdGlvblxuICAgICAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA+IDEgJiYgdXJsLnN1YnN0cigxLCBwYXRoLmxlbmd0aCAtIDEpID09IHBhdGguc3Vic3RyKDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFlbCB8fCBlbC5zaXplKCkgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsLmF0dHIoJ2hyZWYnKS50b0xvd2VyQ2FzZSgpID09PSAnamF2YXNjcmlwdDo7JyB8fCBlbC5hdHRyKCdocmVmJykudG9Mb3dlckNhc2UoKSA9PT0gJyMnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2xpZGVTcGVlZCA9IHBhcnNlSW50KG1lbnUuZGF0YShcInNsaWRlLXNwZWVkXCIpKTtcbiAgICAgICAgdmFyIGtlZXBFeHBhbmQgPSBtZW51LmRhdGEoXCJrZWVwLWV4cGFuZGVkXCIpO1xuXG4gICAgICAgIC8vIGRpc2FibGUgYWN0aXZlIHN0YXRlc1xuICAgICAgICBtZW51LmZpbmQoJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgbWVudS5maW5kKCdsaSA+IGEgPiAuc2VsZWN0ZWQnKS5yZW1vdmUoKTtcblxuICAgICAgICBpZiAobWVudS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudScpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbWVudS5maW5kKCdsaS5vcGVuJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmNoaWxkcmVuKCcuc3ViLW1lbnUnKS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz4gYSA+IC5hcnJvdy5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICBtZW51LmZpbmQoJ2xpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWwucGFyZW50cygnbGknKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+IGEgPiBzcGFuLmFycm93JykuYWRkQ2xhc3MoJ29wZW4nKTtcblxuICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50KCd1bC5wYWdlLXNpZGViYXItbWVudScpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnPiBhJykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInNlbGVjdGVkXCI+PC9zcGFuPicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5jaGlsZHJlbigndWwuc3ViLW1lbnUnKS5zaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtb2RlID09PSAnY2xpY2snKSB7XG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgc2lkZWJhciBtZW51XG4gICAgdmFyIGhhbmRsZVNpZGViYXJNZW51ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnbGkgPiBhJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA+PSByZXNCcmVha3BvaW50TWQgJiYgJCh0aGlzKS5wYXJlbnRzKCcucGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudScpLnNpemUoKSA9PT0gMSkgeyAvLyBleGl0IG9mIGhvdmVyIHNpZGViYXIgbWVudVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCQodGhpcykubmV4dCgpLmhhc0NsYXNzKCdzdWItbWVudScpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkuaGFzQ2xhc3MoJ3N1Yi1tZW51IGFsd2F5cy1vcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpO1xuICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgbWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xuICAgICAgICAgICAgdmFyIHN1YiA9ICQodGhpcykubmV4dCgpO1xuXG4gICAgICAgICAgICB2YXIgYXV0b1Njcm9sbCA9IG1lbnUuZGF0YShcImF1dG8tc2Nyb2xsXCIpO1xuICAgICAgICAgICAgdmFyIHNsaWRlU3BlZWQgPSBwYXJzZUludChtZW51LmRhdGEoXCJzbGlkZS1zcGVlZFwiKSk7XG4gICAgICAgICAgICB2YXIga2VlcEV4cGFuZCA9IG1lbnUuZGF0YShcImtlZXAtZXhwYW5kZWRcIik7XG5cbiAgICAgICAgICAgIGlmIChrZWVwRXhwYW5kICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuKCdsaS5vcGVuJykuY2hpbGRyZW4oJ2EnKS5jaGlsZHJlbignLmFycm93JykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5jaGlsZHJlbignLnN1Yi1tZW51Om5vdCguYWx3YXlzLW9wZW4pJykuc2xpZGVVcChzbGlkZVNwZWVkKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc2xpZGVPZmZlc2V0ID0gLTIwMDtcblxuICAgICAgICAgICAgaWYgKHN1Yi5pcyhcIjp2aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmFycm93JywgJCh0aGlzKSkucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIHN1Yi5zbGlkZVVwKHNsaWRlU3BlZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b1Njcm9sbCA9PT0gdHJ1ZSAmJiAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5zbGltU2Nyb2xsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Njcm9sbFRvJzogKHRoZS5wb3NpdGlvbigpKS50b3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8odGhlLCBzbGlkZU9mZmVzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5hcnJvdycsICQodGhpcykpLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICBzdWIuc2xpZGVEb3duKHNsaWRlU3BlZWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXV0b1Njcm9sbCA9PT0gdHJ1ZSAmJiAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5zbGltU2Nyb2xsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Njcm9sbFRvJzogKHRoZS5wb3NpdGlvbigpKS50b3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8odGhlLCBzbGlkZU9mZmVzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIGFqYXggbGlua3Mgd2l0aGluIHNpZGViYXIgbWVudVxuICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ2NsaWNrJywgJyBsaSA+IGEuYWpheGlmeScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcbiAgICAgICAgICAgIHZhciBtZW51Q29udGFpbmVyID0gJCgnLnBhZ2Utc2lkZWJhciB1bCcpO1xuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gJCgnLnBhZ2UtY29udGVudCcpO1xuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50Qm9keSA9ICQoJy5wYWdlLWNvbnRlbnQgLnBhZ2UtY29udGVudC1ib2R5Jyk7XG5cbiAgICAgICAgICAgIG1lbnVDb250YWluZXIuY2hpbGRyZW4oJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIG1lbnVDb250YWluZXIuY2hpbGRyZW4oJ2Fycm93Lm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ2xpJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCdhID4gc3Bhbi5hcnJvdycpLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnbGknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBNZXRyb25pYy5zdGFydFBhZ2VMb2FkaW5nKCk7XG5cbiAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlLnBhcmVudHMoJ2xpLm9wZW4nKS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXItbWVudSA+IGxpLm9wZW4gPiBhJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbChyZXMpO1xuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdEFqYXgoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHN0dWZmXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKCc8aDQ+Q291bGQgbm90IGxvYWQgdGhlIHJlcXVlc3RlZCBjb250ZW50LjwvaDQ+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBhamF4IGxpbmsgd2l0aGluIG1haW4gY29udGVudFxuICAgICAgICAkKCcucGFnZS1jb250ZW50Jykub24oJ2NsaWNrJywgJy5hamF4aWZ5JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gJCgnLnBhZ2UtY29udGVudCcpO1xuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50Qm9keSA9ICQoJy5wYWdlLWNvbnRlbnQgLnBhZ2UtY29udGVudC1ib2R5Jyk7XG5cbiAgICAgICAgICAgIE1ldHJvbmljLnN0YXJ0UGFnZUxvYWRpbmcoKTtcblxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmZpeENvbnRlbnRIZWlnaHQoKTsgLy8gZml4IGNvbnRlbnQgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLmluaXRBamF4KCk7IC8vIGluaXRpYWxpemUgY29yZSBzdHVmZlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKCc8aDQ+Q291bGQgbm90IGxvYWQgdGhlIHJlcXVlc3RlZCBjb250ZW50LjwvaDQ+Jyk7XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgc2Nyb2xsaW5nIHRvIHRvcCBvbiByZXNwb25zaXZlIG1lbnUgdG9nZ2xlciBjbGljayB3aGVuIGhlYWRlciBpcyBmaXhlZCBmb3IgbW9iaWxlIHZpZXdcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5wYWdlLWhlYWRlci1maXhlZC1tb2JpbGUgLnJlc3BvbnNpdmUtdG9nZ2xlcicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjYWxjdWxhdGUgc2lkZWJhciBoZWlnaHQgZm9yIGZpeGVkIHNpZGViYXIgbGF5b3V0LlxuICAgIHZhciBfY2FsY3VsYXRlRml4ZWRTaWRlYmFyVmlld3BvcnRIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNpZGViYXJIZWlnaHQgPSBNZXRyb25pYy5nZXRWaWV3UG9ydCgpLmhlaWdodCAtICQoJy5wYWdlLWhlYWRlcicpLm91dGVySGVpZ2h0KCkgLSAzMDtcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpKSB7XG4gICAgICAgICAgICBzaWRlYmFySGVpZ2h0ID0gc2lkZWJhckhlaWdodCAtICQoJy5wYWdlLWZvb3RlcicpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2lkZWJhckhlaWdodDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBmaXhlZCBzaWRlYmFyXG4gICAgdmFyIGhhbmRsZUZpeGVkU2lkZWJhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xuXG4gICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKG1lbnUpO1xuXG4gICAgICAgIGlmICgkKCcucGFnZS1zaWRlYmFyLWZpeGVkJykuc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA+PSByZXNCcmVha3BvaW50TWQpIHtcbiAgICAgICAgICAgIG1lbnUuYXR0cihcImRhdGEtaGVpZ2h0XCIsIF9jYWxjdWxhdGVGaXhlZFNpZGViYXJWaWV3cG9ydEhlaWdodCgpKTtcbiAgICAgICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKG1lbnUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgc2lkZWJhciB0b2dnbGVyIHRvIGNsb3NlL2hpZGUgdGhlIHNpZGViYXIuXG4gICAgdmFyIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYm9keSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKTtcbiAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XG4gICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5wYWdlLXNpZGViYXItbWVudScpLnJlbW92ZUNsYXNzKCdwYWdlLXNpZGViYXItbWVudS1jbG9zZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnBhZ2Utc2lkZWJhci1tZW51JykuYWRkQ2xhc3MoJ3BhZ2Utc2lkZWJhci1tZW51LWNsb3NlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEhhbmxlcyBzaWRlYmFyIHRvZ2dsZXJcbiAgICB2YXIgaGFuZGxlU2lkZWJhclRvZ2dsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGJvZHkgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHNpZGViYXIgc2hvdy9oaWRlXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnNpZGViYXItdG9nZ2xlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyID0gJCgnLnBhZ2Utc2lkZWJhcicpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJNZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XG4gICAgICAgICAgICAkKFwiLnNpZGViYXItc2VhcmNoXCIsIHNpZGViYXIpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcblxuICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpKSB7XG4gICAgICAgICAgICAgICAgYm9keS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIik7XG4gICAgICAgICAgICAgICAgc2lkZWJhck1lbnUucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1jbG9zZWRcIik7XG4gICAgICAgICAgICAgICAgaWYgKCQuY29va2llKSB7XG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdzaWRlYmFyX2Nsb3NlZCcsICcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib2R5LmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKTtcbiAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNsb3NlZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS50cmlnZ2VyKFwibW91c2VsZWF2ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQuY29va2llKSB7XG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdzaWRlYmFyX2Nsb3NlZCcsICcxJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggYmFyIGNsb3NlXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnLnNpZGViYXItc2VhcmNoIC5yZW1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSB0aGUgc2VhcmNoIHF1ZXJ5IHN1Ym1pdCBvbiBlbnRlciBwcmVzc1xuICAgICAgICAkKCcucGFnZS1zaWRlYmFyIC5zaWRlYmFyLXNlYXJjaCcpLm9uKCdrZXlwcmVzcycsICdpbnB1dC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy88LS0tLSBBZGQgdGhpcyBsaW5lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSB0aGUgc2VhcmNoIHN1Ym1pdChmb3Igc2lkZWJhciBzZWFyY2ggYW5kIHJlc3BvbnNpdmUgbW9kZSBvZiB0aGUgaGVhZGVyIHNlYXJjaClcbiAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoIC5zdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKSkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5oYXNDbGFzcygnb3BlbicpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnLnBhZ2Utc2lkZWJhci1maXhlZCcpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhciAuc2lkZWJhci10b2dnbGVyJykuY2xpY2soKTsgLy90cmlnZ2VyIHNpZGViYXIgdG9nZ2xlIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgY2xvc2Ugb24gYm9keSBjbGlja1xuICAgICAgICBpZiAoJCgnLnNpZGViYXItc2VhcmNoJykuc2l6ZSgpICE9PSAwKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2ggLmlucHV0LWdyb3VwJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5oYXNDbGFzcygnb3BlbicpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHRoZSBob3Jpem9udGFsIG1lbnVcbiAgICB2YXIgaGFuZGxlSGVhZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGhhbmRsZSBzZWFyY2ggYm94IGV4cGFuZC9jb2xsYXBzZVxuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbignY2xpY2snLCAnLnNlYXJjaC1mb3JtJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5mb3JtLWNvbnRyb2wnKS5mb2N1cygpO1xuXG4gICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnNlYXJjaC1mb3JtIC5mb3JtLWNvbnRyb2wnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5zZWFyY2gtZm9ybScpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnVuYmluZChcImJsdXJcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIGhvciBtZW51IHNlYXJjaCBmb3JtIG9uIGVudGVyIHByZXNzXG4gICAgICAgICQoJy5wYWdlLWhlYWRlcicpLm9uKCdrZXlwcmVzcycsICcuaG9yLW1lbnUgLnNlYXJjaC1mb3JtIC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykuc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgaGVhZGVyIHNlYXJjaCBidXR0b24gY2xpY2tcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyJykub24oJ21vdXNlZG93bicsICcuc2VhcmNoLWZvcm0ub3BlbiAuc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykuc3VibWl0KCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHRoZSBnbyB0byB0b3AgYnV0dG9uIGF0IHRoZSBmb290ZXJcbiAgICB2YXIgaGFuZGxlR29Ub3AgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IDMwMDtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gNTAwO1xuXG4gICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpKSB7IC8vIGlvcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICQod2luZG93KS5iaW5kKFwidG91Y2hlbmQgdG91Y2hjYW5jZWwgdG91Y2hsZWF2ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlSW4oZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZU91dChkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIGdlbmVyYWxcbiAgICAgICAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlSW4oZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZU91dChkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgIH0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyogRU5EOkNPUkUgSEFORExFUlMgKi8vXG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8vIE1haW4gaW5pdCBtZXRob2RzIHRvIGluaXRpYWxpemUgdGhlIGxheW91dFxuICAgICAgICAvLyBJTVBPUlRBTlQhISE6IERvIG5vdCBtb2RpZnkgdGhlIGNvcmUgaGFuZGxlcnMgY2FsbCBvcmRlci5cblxuICAgICAgICBpbml0SGVhZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZUhlYWRlcigpOyAvLyBoYW5kbGVzIGhvcml6b250YWwgbWVudVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldFNpZGViYXJNZW51QWN0aXZlTGluazogZnVuY3Rpb24obW9kZSwgZWwpIHtcbiAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluayhtb2RlLCBlbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFNpZGViYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9sYXlvdXQgaGFuZGxlcnNcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhcigpOyAvLyBoYW5kbGVzIGZpeGVkIHNpZGViYXIgbWVudVxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhck1lbnUoKTsgLy8gaGFuZGxlcyBtYWluIG1lbnVcbiAgICAgICAgICAgIGhhbmRsZVNpZGViYXJUb2dnbGVyKCk7IC8vIGhhbmRsZXMgc2lkZWJhciBoaWRlL3Nob3dcblxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmlzQW5ndWxhckpzQXBwKCkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVTaWRlYmFyTWVudUFjdGl2ZUxpbmsoJ21hdGNoJyk7IC8vIGluaXQgc2lkZWJhciBhY3RpdmUgbGlua3NcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgTWV0cm9uaWMuYWRkUmVzaXplSGFuZGxlcihoYW5kbGVGaXhlZFNpZGViYXIpOyAvLyByZWluaXRpYWxpemUgZml4ZWQgc2lkZWJhciBvbiB3aW5kb3cgcmVzaXplXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdENvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRGb290ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlR29Ub3AoKTsgLy9oYW5kbGVzIHNjcm9sbCB0byB0b3AgZnVuY3Rpb25hbGl0eSBpbiB0aGUgZm9vdGVyXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pbml0SGVhZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRTaWRlYmFyKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRDb250ZW50KCk7XG4gICAgICAgICAgICB0aGlzLmluaXRGb290ZXIoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBmaXggdGhlIHNpZGViYXIgYW5kIGNvbnRlbnQgaGVpZ2h0IGFjY29yZGluZ2x5XG4gICAgICAgIGZpeENvbnRlbnRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRGaXhlZFNpZGViYXJIb3ZlckVmZmVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXJIb3ZlckVmZmVjdCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRGaXhlZFNpZGViYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TGF5b3V0SW1nUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gTWV0cm9uaWMuZ2V0QXNzZXRzUGF0aCgpICsgbGF5b3V0SW1nUGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRMYXlvdXRDc3NQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBNZXRyb25pYy5nZXRBc3NldHNQYXRoKCkgKyBsYXlvdXRDc3NQYXRoO1xuICAgICAgICB9XG4gICAgfTtcblxufSAoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXQ7IiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5cbi8qKlxuQ29yZSBzY3JpcHQgdG8gaGFuZGxlIHRoZSBlbnRpcmUgdGhlbWUgYW5kIGNvcmUgZnVuY3Rpb25zXG4qKi9cbnZhciBNZXRyb25pYyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gSUUgbW9kZVxuICAgIHZhciBpc1JUTCA9IGZhbHNlO1xuICAgIHZhciBpc0lFOCA9IGZhbHNlO1xuICAgIHZhciBpc0lFOSA9IGZhbHNlO1xuICAgIHZhciBpc0lFMTAgPSBmYWxzZTtcblxuICAgIHZhciByZXNpemVIYW5kbGVycyA9IFtdO1xuXG4gICAgdmFyIGFzc2V0c1BhdGggPSAnLi4vLi4vYXNzZXRzLyc7XG5cbiAgICB2YXIgZ2xvYmFsSW1nUGF0aCA9ICdnbG9iYWwvaW1nLyc7XG5cbiAgICB2YXIgZ2xvYmFsUGx1Z2luc1BhdGggPSAnZ2xvYmFsL3BsdWdpbnMvJztcblxuICAgIHZhciBnbG9iYWxDc3NQYXRoID0gJ2dsb2JhbC9jc3MvJztcblxuICAgIC8vIHRoZW1lIGxheW91dCBjb2xvciBzZXRcblxuICAgIHZhciBicmFuZENvbG9ycyA9IHtcbiAgICAgICAgJ2JsdWUnOiAnIzg5QzRGNCcsXG4gICAgICAgICdyZWQnOiAnI0YzNTY1RCcsXG4gICAgICAgICdncmVlbic6ICcjMWJiYzliJyxcbiAgICAgICAgJ3B1cnBsZSc6ICcjOWI1OWI2JyxcbiAgICAgICAgJ2dyZXknOiAnIzk1YTVhNicsXG4gICAgICAgICd5ZWxsb3cnOiAnI0Y4Q0IwMCdcbiAgICB9O1xuXG4gICAgLy8gaW5pdGlhbGl6ZXMgbWFpbiBzZXR0aW5nc1xuICAgIHZhciBoYW5kbGVJbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5jc3MoJ2RpcmVjdGlvbicpID09PSAncnRsJykge1xuICAgICAgICAgICAgaXNSVEwgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNJRTggPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgOC4wLyk7XG4gICAgICAgIGlzSUU5ID0gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFIDkuMC8pO1xuICAgICAgICBpc0lFMTAgPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgMTAuMC8pO1xuXG4gICAgICAgIGlmIChpc0lFMTApIHtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaWUxMCcpOyAvLyBkZXRlY3QgSUUxMCB2ZXJzaW9uXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNJRTEwIHx8IGlzSUU5IHx8IGlzSUU4KSB7XG4gICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ2llJyk7IC8vIGRldGVjdCBJRTEwIHZlcnNpb25cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBydW5zIGNhbGxiYWNrIGZ1bmN0aW9ucyBzZXQgYnkgTWV0cm9uaWMuYWRkUmVzcG9uc2l2ZUhhbmRsZXIoKS5cbiAgICB2YXIgX3J1blJlc2l6ZUhhbmRsZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIHJlaW5pdGlhbGl6ZSBvdGhlciBzdWJzY3JpYmVkIGVsZW1lbnRzXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzaXplSGFuZGxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlYWNoID0gcmVzaXplSGFuZGxlcnNbaV07XG4gICAgICAgICAgICBlYWNoLmNhbGwoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBoYW5kbGUgdGhlIGxheW91dCByZWluaXRpYWxpemF0aW9uIG9uIHdpbmRvdyByZXNpemVcbiAgICB2YXIgaGFuZGxlT25SZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlc2l6ZTtcbiAgICAgICAgaWYgKGlzSUU4KSB7XG4gICAgICAgICAgICB2YXIgY3VycmhlaWdodDtcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJoZWlnaHQgPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vcXVpdGUgZXZlbnQgc2luY2Ugb25seSBib2R5IHJlc2l6ZWQgbm90IHdpbmRvdy5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzaXplID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgX3J1blJlc2l6ZUhhbmRsZXJzKCk7XG4gICAgICAgICAgICAgICAgfSwgNTApOyAvLyB3YWl0IDUwbXMgdW50aWwgd2luZG93IHJlc2l6ZSBmaW5pc2hlcy5cbiAgICAgICAgICAgICAgICBjdXJyaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gc3RvcmUgbGFzdCBib2R5IGNsaWVudCBoZWlnaHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNpemUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcbiAgICAgICAgICAgICAgICB9LCA1MCk7IC8vIHdhaXQgNTBtcyB1bnRpbCB3aW5kb3cgcmVzaXplIGZpbmlzaGVzLlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBwb3J0bGV0IHRvb2xzICYgYWN0aW9uc1xuICAgIHZhciBoYW5kbGVQb3J0bGV0VG9vbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaGFuZGxlIHBvcnRsZXQgcmVtb3ZlXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IGEucmVtb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHBvcnRsZXQgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKTtcblxuICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKSkge1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVsb2FkJykudG9vbHRpcCgnZGVzdHJveScpO1xuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZW1vdmUnKS50b29sdGlwKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbmZpZycpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJykudG9vbHRpcCgnZGVzdHJveScpO1xuXG4gICAgICAgICAgICBwb3J0bGV0LnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgcG9ydGxldCBmdWxsc2NyZWVuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBwb3J0bGV0ID0gJCh0aGlzKS5jbG9zZXN0KFwiLnBvcnRsZXRcIik7XG4gICAgICAgICAgICBpZiAocG9ydGxldC5oYXNDbGFzcygncG9ydGxldC1mdWxsc2NyZWVuJykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvbicpO1xuICAgICAgICAgICAgICAgIHBvcnRsZXQucmVtb3ZlQ2xhc3MoJ3BvcnRsZXQtZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS5oZWlnaHQgLVxuICAgICAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC10aXRsZScpLm91dGVySGVpZ2h0KCkgLVxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcpKSAtXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ3BhZGRpbmctYm90dG9tJykpO1xuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnb24nKTtcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmFkZENsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoJ3BhZ2UtcG9ydGxldC1mdWxsc2NyZWVuJyk7XG4gICAgICAgICAgICAgICAgcG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gYS5yZWxvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKS5jaGlsZHJlbihcIi5wb3J0bGV0LWJvZHlcIik7XG4gICAgICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKFwiZGF0YS11cmxcIik7XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWVycm9yLWRpc3BsYXlcIik7XG4gICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuYmxvY2tVSSh7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogZWwsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb2xvcjogJ25vbmUnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnVuYmxvY2tVSShlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5odG1sKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSAnRXJyb3Igb24gcmVsb2FkaW5nIHRoZSBjb250ZW50LiBQbGVhc2UgY2hlY2sgeW91ciBjb25uZWN0aW9uIGFuZCB0cnkgYWdhaW4uJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvciA9PSBcInRvYXN0clwiICYmIHRvYXN0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciA9PSBcIm5vdGlmaWM4XCIgJiYgJC5ub3RpZmljOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQubm90aWZpYzgoJ3ppbmRleCcsIDExNTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLm5vdGlmaWM4KG1zZywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVtZTogJ3J1YnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaWZlOiAzMDAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KG1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZm9yIGRlbW8gcHVycG9zZVxuICAgICAgICAgICAgICAgIE1ldHJvbmljLmJsb2NrVUkoe1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IGVsLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q29sb3I6ICdub25lJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy51bmJsb2NrVUkoZWwpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBsb2FkIGFqYXggZGF0YSBvbiBwYWdlIGluaXRcbiAgICAgICAgJCgnLnBvcnRsZXQgLnBvcnRsZXQtdGl0bGUgYS5yZWxvYWRbZGF0YS1sb2FkPVwidHJ1ZVwiXScpLmNsaWNrKCk7XG5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbGxhcHNlLCAucG9ydGxldCAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5leHBhbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgZWwgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKS5jaGlsZHJlbihcIi5wb3J0bGV0LWJvZHlcIik7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNvbGxhcHNlXCIpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImNvbGxhcHNlXCIpLmFkZENsYXNzKFwiZXhwYW5kXCIpO1xuICAgICAgICAgICAgICAgIGVsLnNsaWRlVXAoMjAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImV4cGFuZFwiKS5hZGRDbGFzcyhcImNvbGxhcHNlXCIpO1xuICAgICAgICAgICAgICAgIGVsLnNsaWRlRG93bigyMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBjdXN0b20gY2hlY2tib3hlcyAmIHJhZGlvcyB1c2luZyBqUXVlcnkgVW5pZm9ybSBwbHVnaW5cbiAgICB2YXIgaGFuZGxlVW5pZm9ybSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoKS51bmlmb3JtKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRlc3QgPSAkKFwiaW5wdXRbdHlwZT1jaGVja2JveF06bm90KC50b2dnbGUsIC5tZC1jaGVjaywgLm1kLXJhZGlvYnRuLCAubWFrZS1zd2l0Y2gsIC5pY2hlY2spLCBpbnB1dFt0eXBlPXJhZGlvXTpub3QoLnRvZ2dsZSwgLm1kLWNoZWNrLCAubWQtcmFkaW9idG4sIC5zdGFyLCAubWFrZS1zd2l0Y2gsIC5pY2hlY2spXCIpO1xuICAgICAgICBpZiAodGVzdC5zaXplKCkgPiAwKSB7XG4gICAgICAgICAgICB0ZXN0LmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50cyhcIi5jaGVja2VyXCIpLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS51bmlmb3JtKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlc21hdGVyaWFsIGRlc2lnbiBjaGVja2JveGVzXG4gICAgdmFyIGhhbmRsZU1hdGVyaWFsRGVzaWduID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gTWF0ZXJpYWwgZGVzaWduIGNrZWNrYm94IGFuZCByYWRpbyBlZmZlY3RzXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLm1kLWNoZWNrYm94ID4gbGFiZWwsIC5tZC1yYWRpbyA+IGxhYmVsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcbiAgICAgICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IHNwYW4gd2hpY2ggaXMgb3VyIGNpcmNsZS9idWJibGVcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2hpbGRyZW4oJ3NwYW46Zmlyc3QtY2hpbGQnKTtcblxuICAgICAgICAgICAgLy8gYWRkIHRoZSBidWJibGUgY2xhc3MgKHdlIGRvIHRoaXMgc28gaXQgZG9lc250IHNob3cgb24gcGFnZSBsb2FkKVxuICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2luYycpO1xuXG4gICAgICAgICAgICAvLyBjbG9uZSBpdFxuICAgICAgICAgICAgdmFyIG5ld29uZSA9IGVsLmNsb25lKHRydWUpO1xuXG4gICAgICAgICAgICAvLyBhZGQgdGhlIGNsb25lZCB2ZXJzaW9uIGJlZm9yZSBvdXIgb3JpZ2luYWxcbiAgICAgICAgICAgIGVsLmJlZm9yZShuZXdvbmUpO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIG9yaWdpbmFsIHNvIHRoYXQgaXQgaXMgcmVhZHkgdG8gcnVuIG9uIG5leHQgY2xpY2tcbiAgICAgICAgICAgICQoXCIuXCIgKyBlbC5hdHRyKFwiY2xhc3NcIikgKyBcIjpsYXN0XCIsIHRoZSkucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtbWQnKSkge1xuICAgICAgICAgICAgLy8gTWF0ZXJpYWwgZGVzaWduIGNsaWNrIGVmZmVjdFxuICAgICAgICAgICAgLy8gY3JlZGl0IHdoZXJlIGNyZWRpdCdzIGR1ZTsgaHR0cDovL3RoZWNvZGVwbGF5ZXIuY29tL3dhbGt0aHJvdWdoL3JpcHBsZS1jbGljay1lZmZlY3QtZ29vZ2xlLW1hdGVyaWFsLWRlc2lnblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQsIGNpcmNsZSwgZCwgeCwgeTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnYS5idG4sIGJ1dHRvbi5idG4sIGlucHV0LmJ0biwgbGFiZWwuYnRuJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudC5maW5kKFwiLm1kLWNsaWNrLWNpcmNsZVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnByZXBlbmQoXCI8c3BhbiBjbGFzcz0nbWQtY2xpY2stY2lyY2xlJz48L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNpcmNsZSA9IGVsZW1lbnQuZmluZChcIi5tZC1jbGljay1jaXJjbGVcIik7XG4gICAgICAgICAgICAgICAgY2lyY2xlLnJlbW92ZUNsYXNzKFwibWQtY2xpY2stYW5pbWF0ZVwiKTtcblxuICAgICAgICAgICAgICAgIGlmKCFjaXJjbGUuaGVpZ2h0KCkgJiYgIWNpcmNsZS53aWR0aCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGQgPSBNYXRoLm1heChlbGVtZW50Lm91dGVyV2lkdGgoKSwgZWxlbWVudC5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlLmNzcyh7aGVpZ2h0OiBkLCB3aWR0aDogZH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHggPSBlLnBhZ2VYIC0gZWxlbWVudC5vZmZzZXQoKS5sZWZ0IC0gY2lyY2xlLndpZHRoKCkvMjtcbiAgICAgICAgICAgICAgICB5ID0gZS5wYWdlWSAtIGVsZW1lbnQub2Zmc2V0KCkudG9wIC0gY2lyY2xlLmhlaWdodCgpLzI7XG5cbiAgICAgICAgICAgICAgICBjaXJjbGUuY3NzKHt0b3A6IHkrJ3B4JywgbGVmdDogeCsncHgnfSkuYWRkQ2xhc3MoXCJtZC1jbGljay1hbmltYXRlXCIpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGbG9hdGluZyBsYWJlbHNcbiAgICAgICAgdmFyIGhhbmRsZUlucHV0ID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGlmIChlbC52YWwoKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2VkaXRlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmVDbGFzcygnZWRpdGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2tleWRvd24nLCAnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZUlucHV0KCQodGhpcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdibHVyJywgJy5mb3JtLW1kLWZsb2F0aW5nLWxhYmVsIC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBoYW5kbGVJbnB1dCgkKHRoaXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdlZGl0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyBjdXN0b20gY2hlY2tib3hlcyAmIHJhZGlvcyB1c2luZyBqUXVlcnkgaUNoZWNrIHBsdWdpblxuICAgIHZhciBoYW5kbGVpQ2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCEkKCkuaUNoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuaWNoZWNrJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjaGVja2JveENsYXNzID0gJCh0aGlzKS5hdHRyKCdkYXRhLWNoZWNrYm94JykgPyAkKHRoaXMpLmF0dHIoJ2RhdGEtY2hlY2tib3gnKSA6ICdpY2hlY2tib3hfbWluaW1hbC1ncmV5JztcbiAgICAgICAgICAgIHZhciByYWRpb0NsYXNzID0gJCh0aGlzKS5hdHRyKCdkYXRhLXJhZGlvJykgPyAkKHRoaXMpLmF0dHIoJ2RhdGEtcmFkaW8nKSA6ICdpcmFkaW9fbWluaW1hbC1ncmV5JztcblxuICAgICAgICAgICAgaWYgKGNoZWNrYm94Q2xhc3MuaW5kZXhPZignX2xpbmUnKSA+IC0xIHx8IHJhZGlvQ2xhc3MuaW5kZXhPZignX2xpbmUnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soe1xuICAgICAgICAgICAgICAgICAgICBjaGVja2JveENsYXNzOiBjaGVja2JveENsYXNzLFxuICAgICAgICAgICAgICAgICAgICByYWRpb0NsYXNzOiByYWRpb0NsYXNzLFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICc8ZGl2IGNsYXNzPVwiaWNoZWNrX2xpbmUtaWNvblwiPjwvZGl2PicgKyAkKHRoaXMpLmF0dHIoXCJkYXRhLWxhYmVsXCIpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcykuaUNoZWNrKHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hDbGFzczogY2hlY2tib3hDbGFzcyxcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9DbGFzczogcmFkaW9DbGFzc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgc3dpdGNoZXNcbiAgICB2YXIgaGFuZGxlQm9vdHN0cmFwU3dpdGNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgpLmJvb3RzdHJhcFN3aXRjaCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoJy5tYWtlLXN3aXRjaCcpLmJvb3RzdHJhcFN3aXRjaCgpO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBjb25maXJtYXRpb25zXG4gICAgdmFyIGhhbmRsZUJvb3RzdHJhcENvbmZpcm1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoKS5jb25maXJtYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKCdbZGF0YS10b2dnbGU9Y29uZmlybWF0aW9uXScpLmNvbmZpcm1hdGlvbih7IGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLCBidG5Pa0NsYXNzOiAnYnRuIGJ0bi1zbSBidG4tc3VjY2VzcycsIGJ0bkNhbmNlbENsYXNzOiAnYnRuIGJ0bi1zbSBidG4tZGFuZ2VyJ30pO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIEFjY29yZGlvbnMuXG4gICAgdmFyIGhhbmRsZUFjY29yZGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdzaG93bi5icy5jb2xsYXBzZScsICcuYWNjb3JkaW9uLnNjcm9sbGFibGUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygkKGUudGFyZ2V0KSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBUYWJzLlxuICAgIHZhciBoYW5kbGVUYWJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vYWN0aXZhdGUgdGFiIGlmIHRhYiBpZCBwcm92aWRlZCBpbiB0aGUgVVJMXG4gICAgICAgIGlmIChsb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgICAgICB2YXIgdGFiaWQgPSBlbmNvZGVVUkkobG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xuICAgICAgICAgICAgJCgnYVtocmVmPVwiIycgKyB0YWJpZCArICdcIl0nKS5wYXJlbnRzKCcudGFiLXBhbmU6aGlkZGVuJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFiaWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAgICAgICAkKCdhW2hyZWY9XCIjJyArIHRhYmlkICsgJ1wiXScpLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKCkudGFiZHJvcCkge1xuICAgICAgICAgICAgJCgnLnRhYmJhYmxlLXRhYmRyb3AgLm5hdi1waWxscywgLnRhYmJhYmxlLXRhYmRyb3AgLm5hdi10YWJzJykudGFiZHJvcCh7XG4gICAgICAgICAgICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZmEgZmEtZWxsaXBzaXMtdlwiPjwvaT4mbmJzcDs8aSBjbGFzcz1cImZhIGZhLWFuZ2xlLWRvd25cIj48L2k+J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgTW9kYWxzLlxuICAgIHZhciBoYW5kbGVNb2RhbHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gZml4IHN0YWNrYWJsZSBtb2RhbCBpc3N1ZTogd2hlbiAyIG9yIG1vcmUgbW9kYWxzIG9wZW5lZCwgY2xvc2luZyBvbmUgb2YgbW9kYWwgd2lsbCByZW1vdmUgLm1vZGFsLW9wZW4gY2xhc3MuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZS5icy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCQoJy5tb2RhbDp2aXNpYmxlJykuc2l6ZSgpID4gMSAmJiAkKCdodG1sJykuaGFzQ2xhc3MoJ21vZGFsLW9wZW4nKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCgnLm1vZGFsOnZpc2libGUnKS5zaXplKCkgPD0gMSkge1xuICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmaXggcGFnZSBzY3JvbGxiYXJzIGlzc3VlXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignc2hvdy5icy5tb2RhbCcsICcubW9kYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwibW9kYWwtc2Nyb2xsXCIpKSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwibW9kYWwtb3Blbi1ub3Njcm9sbFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZml4IHBhZ2Ugc2Nyb2xsYmFycyBpc3N1ZVxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2hpZGUuYnMubW9kYWwnLCAnLm1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJtb2RhbC1vcGVuLW5vc2Nyb2xsXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZW1vdmUgYWpheCBjb250ZW50IGFuZCByZW1vdmUgY2FjaGUgb24gbW9kYWwgY2xvc2VkXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZGVuLmJzLm1vZGFsJywgJy5tb2RhbDpub3QoLm1vZGFsLWNhY2hlZCknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZURhdGEoJ2JzLm1vZGFsJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBUb29sdGlwcy5cbiAgICB2YXIgaGFuZGxlVG9vbHRpcHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gZ2xvYmFsIHRvb2x0aXBzXG4gICAgICAgICQoJy50b29sdGlwcycpLnRvb2x0aXAoKTtcblxuICAgICAgICAvLyBwb3J0bGV0IHRvb2x0aXBzXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgLmZ1bGxzY3JlZW4nKS50b29sdGlwKHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxuICAgICAgICAgICAgdGl0bGU6ICdGdWxsc2NyZWVuJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZWxvYWQnKS50b29sdGlwKHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxuICAgICAgICAgICAgdGl0bGU6ICdSZWxvYWQnXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbW92ZScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXG4gICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSdcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29uZmlnJykudG9vbHRpcCh7XG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcbiAgICAgICAgICAgIHRpdGxlOiAnU2V0dGluZ3MnXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbGxhcHNlLCAucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmV4cGFuZCcpLnRvb2x0aXAoe1xuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXG4gICAgICAgICAgICB0aXRsZTogJ0NvbGxhcHNlL0V4cGFuZCdcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIERyb3Bkb3duc1xuICAgIHZhciBoYW5kbGVEcm9wZG93bnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLypcbiAgICAgICAgICBIb2xkIGRyb3Bkb3duIG9uIGNsaWNrXG4gICAgICAgICovXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLmRyb3Bkb3duLW1lbnUuaG9sZC1vbi1jbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgaGFuZGxlQWxlcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtY2xvc2U9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCcuYWxlcnQnKS5oaWRlKCk7XG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5ub3RlJykuaGlkZSgpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ1tkYXRhLWNsb3NlPVwibm90ZVwiXScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5oaWRlKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtcmVtb3ZlPVwibm90ZVwiXScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBIb3dlciBEcm9wZG93bnNcbiAgICB2YXIgaGFuZGxlRHJvcGRvd25Ib3ZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCdbZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCJdJykubm90KCcuaG92ZXItaW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5kcm9wZG93bkhvdmVyKCk7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdob3Zlci1pbml0aWFsaXplZCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRleHRhcmVhIGF1dG9zaXplXG4gICAgdmFyIGhhbmRsZVRleHRhcmVhQXV0b3NpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZihhdXRvc2l6ZSkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBhdXRvc2l6ZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYS5hdXRvc2l6ZW1lJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgUG9wb3ZlcnNcblxuICAgIC8vIGxhc3QgcG9wZXAgcG9wb3ZlclxuICAgIHZhciBsYXN0UG9wZWRQb3BvdmVyO1xuXG4gICAgdmFyIGhhbmRsZVBvcG92ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5wb3BvdmVycycpLnBvcG92ZXIoKTtcblxuICAgICAgICAvLyBjbG9zZSBsYXN0IGRpc3BsYXllZCBwb3BvdmVyXG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLnBvcG92ZXIuZGF0YS1hcGknLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAobGFzdFBvcGVkUG9wb3Zlcikge1xuICAgICAgICAgICAgICAgIGxhc3RQb3BlZFBvcG92ZXIucG9wb3ZlcignaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBzY3JvbGxhYmxlIGNvbnRlbnRzIHVzaW5nIGpRdWVyeSBTbGltU2Nyb2xsIHBsdWdpbi5cbiAgICB2YXIgaGFuZGxlU2Nyb2xsZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKCcuc2Nyb2xsZXInKTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBJbWFnZSBQcmV2aWV3IHVzaW5nIGpRdWVyeSBGYW5jeWJveCBwbHVnaW5cbiAgICB2YXIgaGFuZGxlRmFuY3lib3ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFqUXVlcnkuZmFuY3lib3gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKFwiLmZhbmN5Ym94LWJ1dHRvblwiKS5zaXplKCkgPiAwKSB7XG4gICAgICAgICAgICAkKFwiLmZhbmN5Ym94LWJ1dHRvblwiKS5mYW5jeWJveCh7XG4gICAgICAgICAgICAgICAgZ3JvdXBBdHRyOiAnZGF0YS1yZWwnLFxuICAgICAgICAgICAgICAgIHByZXZFZmZlY3Q6ICdub25lJyxcbiAgICAgICAgICAgICAgICBuZXh0RWZmZWN0OiAnbm9uZScsXG4gICAgICAgICAgICAgICAgY2xvc2VCdG46IHRydWUsXG4gICAgICAgICAgICAgICAgaGVscGVyczoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luc2lkZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEZpeCBpbnB1dCBwbGFjZWhvbGRlciBpc3N1ZSBmb3IgSUU4IGFuZCBJRTlcbiAgICB2YXIgaGFuZGxlRml4SW5wdXRQbGFjZWhvbGRlckZvcklFID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vZml4IGh0bWw1IHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBmb3IgaWU3ICYgaWU4XG4gICAgICAgIGlmIChpc0lFOCB8fCBpc0lFOSkgeyAvLyBpZTggJiBpZTlcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgaHRtbDUgcGxhY2Vob2xkZXIgZml4IGZvciBpbnB1dHMsIGlucHV0cyB3aXRoIHBsYWNlaG9sZGVyLW5vLWZpeCBjbGFzcyB3aWxsIGJlIHNraXBwZWQoZS5nOiB3ZSBuZWVkIHRoaXMgZm9yIHBhc3N3b3JkIGZpZWxkcylcbiAgICAgICAgICAgICQoJ2lucHV0W3BsYWNlaG9sZGVyXTpub3QoLnBsYWNlaG9sZGVyLW5vLWZpeCksIHRleHRhcmVhW3BsYWNlaG9sZGVyXTpub3QoLnBsYWNlaG9sZGVyLW5vLWZpeCknKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsKCkgPT09ICcnICYmIGlucHV0LmF0dHIoXCJwbGFjZWhvbGRlclwiKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYWRkQ2xhc3MoXCJwbGFjZWhvbGRlclwiKS52YWwoaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaW5wdXQuZm9jdXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PSBpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWwoJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5ibHVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsKCkgPT09ICcnIHx8IGlucHV0LnZhbCgpID09IGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbChpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIFNlbGVjdDIgRHJvcGRvd25zXG4gICAgdmFyIGhhbmRsZVNlbGVjdDIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoKS5zZWxlY3QyKSB7XG4gICAgICAgICAgICAkKCcuc2VsZWN0Mm1lJykuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiU2VsZWN0XCIsXG4gICAgICAgICAgICAgICAgYWxsb3dDbGVhcjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gaGFuZGxlIGdyb3VwIGVsZW1lbnQgaGVpZ2h0c1xuICAgIHZhciBoYW5kbGVIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAkKCdbZGF0YS1hdXRvLWhlaWdodF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgaXRlbXMgPSAkKCdbZGF0YS1oZWlnaHRdJywgcGFyZW50KTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAwO1xuICAgICAgICAgICAgdmFyIG1vZGUgPSBwYXJlbnQuYXR0cignZGF0YS1tb2RlJyk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gcGFyc2VJbnQocGFyZW50LmF0dHIoJ2RhdGEtb2Zmc2V0JykgPyBwYXJlbnQuYXR0cignZGF0YS1vZmZzZXQnKSA6IDApO1xuXG4gICAgICAgICAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtaGVpZ2h0JykgPT0gXCJoZWlnaHRcIikge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnaGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdtaW4taGVpZ2h0JywgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHRfID0gKG1vZGUgPT0gJ2Jhc2UtaGVpZ2h0JyA/ICQodGhpcykub3V0ZXJIZWlnaHQoKSA6ICQodGhpcykub3V0ZXJIZWlnaHQodHJ1ZSkpO1xuICAgICAgICAgICAgICAgIGlmIChoZWlnaHRfID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodF87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCArIG9mZnNldDtcblxuICAgICAgICAgICAgaXRlbXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLWhlaWdodCcpID09IFwiaGVpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ21pbi1oZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vKiBFTkQ6Q09SRSBIQU5ETEVSUyAqLy9cblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIHRoZSB0aGVtZVxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vSU1QT1JUQU5UISEhOiBEbyBub3QgbW9kaWZ5IHRoZSBjb3JlIGhhbmRsZXJzIGNhbGwgb3JkZXIuXG5cbiAgICAgICAgICAgIC8vQ29yZSBoYW5kbGVyc1xuICAgICAgICAgICAgaGFuZGxlSW5pdCgpOyAvLyBpbml0aWFsaXplIGNvcmUgdmFyaWFibGVzXG4gICAgICAgICAgICBoYW5kbGVPblJlc2l6ZSgpOyAvLyBzZXQgYW5kIGhhbmRsZSByZXNwb25zaXZlXG5cbiAgICAgICAgICAgIC8vVUkgQ29tcG9uZW50IGhhbmRsZXJzXG4gICAgICAgICAgICBoYW5kbGVNYXRlcmlhbERlc2lnbigpOyAvLyBoYW5kbGUgbWF0ZXJpYWwgZGVzaWduXG4gICAgICAgICAgICBoYW5kbGVVbmlmb3JtKCk7IC8vIGhhbmZsZSBjdXN0b20gcmFkaW8gJiBjaGVja2JveGVzXG4gICAgICAgICAgICBoYW5kbGVpQ2hlY2soKTsgLy8gaGFuZGxlcyBjdXN0b20gaWNoZWNrIHJhZGlvIGFuZCBjaGVja2JveGVzXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBTd2l0Y2goKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBzd2l0Y2ggcGx1Z2luXG4gICAgICAgICAgICBoYW5kbGVTY3JvbGxlcnMoKTsgLy8gaGFuZGxlcyBzbGltIHNjcm9sbGluZyBjb250ZW50c1xuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTsgLy8gaGFuZGxlIGZhbmN5IGJveFxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0MigpOyAvLyBoYW5kbGUgY3VzdG9tIFNlbGVjdDIgZHJvcGRvd25zXG4gICAgICAgICAgICBoYW5kbGVQb3J0bGV0VG9vbHMoKTsgLy8gaGFuZGxlcyBwb3J0bGV0IGFjdGlvbiBiYXIgZnVuY3Rpb25hbGl0eShyZWZyZXNoLCBjb25maWd1cmUsIHRvZ2dsZSwgcmVtb3ZlKVxuICAgICAgICAgICAgaGFuZGxlQWxlcnRzKCk7IC8vaGFuZGxlIGNsb3NhYmxlZCBhbGVydHNcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3ducygpOyAvLyBoYW5kbGUgZHJvcGRvd25zXG4gICAgICAgICAgICBoYW5kbGVUYWJzKCk7IC8vIGhhbmRsZSB0YWJzXG4gICAgICAgICAgICBoYW5kbGVUb29sdGlwcygpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHRvb2x0aXBzXG4gICAgICAgICAgICBoYW5kbGVQb3BvdmVycygpOyAvLyBoYW5kbGVzIGJvb3RzdHJhcCBwb3BvdmVyc1xuICAgICAgICAgICAgaGFuZGxlQWNjb3JkaW9ucygpOyAvL2hhbmRsZXMgYWNjb3JkaW9uc1xuICAgICAgICAgICAgaGFuZGxlTW9kYWxzKCk7IC8vIGhhbmRsZSBtb2RhbHNcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcENvbmZpcm1hdGlvbigpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIGNvbmZpcm1hdGlvbnNcbiAgICAgICAgICAgIGhhbmRsZVRleHRhcmVhQXV0b3NpemUoKTsgLy8gaGFuZGxlIGF1dG9zaXplIHRleHRhcmVhc1xuXG4gICAgICAgICAgICAvL0hhbmRsZSBncm91cCBlbGVtZW50IGhlaWdodHNcbiAgICAgICAgICAgIGhhbmRsZUhlaWdodCgpO1xuICAgICAgICAgICAgdGhpcy5hZGRSZXNpemVIYW5kbGVyKGhhbmRsZUhlaWdodCk7IC8vIGhhbmRsZSBhdXRvIGNhbGN1bGF0aW5nIGhlaWdodCBvbiB3aW5kb3cgcmVzaXplXG5cbiAgICAgICAgICAgIC8vIEhhY2tzXG4gICAgICAgICAgICBoYW5kbGVGaXhJbnB1dFBsYWNlaG9sZGVyRm9ySUUoKTsgLy9JRTggJiBJRTkgaW5wdXQgcGxhY2Vob2xkZXIgaXNzdWUgZml4XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9tYWluIGZ1bmN0aW9uIHRvIGluaXRpYXRlIGNvcmUgamF2YXNjcmlwdCBhZnRlciBhamF4IGNvbXBsZXRlXG4gICAgICAgIGluaXRBamF4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTsgLy8gaGFuZGxlcyBjdXN0b20gcmFkaW8gJiBjaGVja2JveGVzXG4gICAgICAgICAgICBoYW5kbGVpQ2hlY2soKTsgLy8gaGFuZGxlcyBjdXN0b20gaWNoZWNrIHJhZGlvIGFuZCBjaGVja2JveGVzXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBTd2l0Y2goKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBzd2l0Y2ggcGx1Z2luXG4gICAgICAgICAgICBoYW5kbGVEcm9wZG93bkhvdmVyKCk7IC8vIGhhbmRsZXMgZHJvcGRvd24gaG92ZXJcbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbGVycygpOyAvLyBoYW5kbGVzIHNsaW0gc2Nyb2xsaW5nIGNvbnRlbnRzXG4gICAgICAgICAgICBoYW5kbGVTZWxlY3QyKCk7IC8vIGhhbmRsZSBjdXN0b20gU2VsZWN0MiBkcm9wZG93bnNcbiAgICAgICAgICAgIGhhbmRsZUZhbmN5Ym94KCk7IC8vIGhhbmRsZSBmYW5jeSBib3hcbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3ducygpOyAvLyBoYW5kbGUgZHJvcGRvd25zXG4gICAgICAgICAgICBoYW5kbGVUb29sdGlwcygpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHRvb2x0aXBzXG4gICAgICAgICAgICBoYW5kbGVQb3BvdmVycygpOyAvLyBoYW5kbGVzIGJvb3RzdHJhcCBwb3BvdmVyc1xuICAgICAgICAgICAgaGFuZGxlQWNjb3JkaW9ucygpOyAvL2hhbmRsZXMgYWNjb3JkaW9uc1xuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uKCk7IC8vIGhhbmRsZSBib290c3RyYXAgY29uZmlybWF0aW9uc1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vaW5pdCBtYWluIGNvbXBvbmVudHNcbiAgICAgICAgaW5pdENvbXBvbmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5pbml0QWpheCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIHJlbWVtYmVyIGxhc3Qgb3BlbmVkIHBvcG92ZXIgdGhhdCBuZWVkcyB0byBiZSBjbG9zZWQgb24gY2xpY2tcbiAgICAgICAgc2V0TGFzdFBvcGVkUG9wb3ZlcjogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGxhc3RQb3BlZFBvcG92ZXIgPSBlbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBhZGQgY2FsbGJhY2sgYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCBvbiB3aW5kb3cgcmVzaXplXG4gICAgICAgIGFkZFJlc2l6ZUhhbmRsZXI6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICAgIHJlc2l6ZUhhbmRsZXJzLnB1c2goZnVuYyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wdWJsaWMgZnVuY3RvbiB0byBjYWxsIF9ydW5yZXNpemVIYW5kbGVyc1xuICAgICAgICBydW5SZXNpemVIYW5kbGVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gc2Nyb2xsKGZvY3VzKSB0byBhbiBlbGVtZW50XG4gICAgICAgIHNjcm9sbFRvOiBmdW5jdGlvbihlbCwgb2ZmZXNldCkge1xuICAgICAgICAgICAgdmFyIHBvcyA9IChlbCAmJiBlbC5zaXplKCkgPiAwKSA/IGVsLm9mZnNldCgpLnRvcCA6IDA7XG5cbiAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyJykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLXRvcC1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlci10b3AnKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItbWVudS1maXhlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlci1tZW51JykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBvcyA9IHBvcyArIChvZmZlc2V0ID8gb2ZmZXNldCA6IC0xICogZWwuaGVpZ2h0KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHBvc1xuICAgICAgICAgICAgfSwgJ3Nsb3cnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0U2xpbVNjcm9sbDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICQoZWwpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBleGl0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodDtcblxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhlaWdodFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWhlaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAkKHRoaXMpLmNzcygnaGVpZ2h0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zbGltU2Nyb2xsKHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dQYWdlU2Nyb2xsOiB0cnVlLCAvLyBhbGxvdyBwYWdlIHNjcm9sbCB3aGVuIHRoZSBlbGVtZW50IHNjcm9sbCBpcyBlbmRlZFxuICAgICAgICAgICAgICAgICAgICBzaXplOiAnN3B4JyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKSA/ICQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpIDogJyNiYmInKSxcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpIDogJ3NsaW1TY3JvbGxEaXYnKSxcbiAgICAgICAgICAgICAgICAgICAgcmFpbENvbG9yOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLWNvbG9yXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLWNvbG9yXCIpIDogJyNlYWVhZWEnKSxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGlzUlRMID8gJ2xlZnQnIDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGFsd2F5c1Zpc2libGU6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLWFsd2F5cy12aXNpYmxlXCIpID09IFwiMVwiID8gdHJ1ZSA6IGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgcmFpbFZpc2libGU6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKSA9PSBcIjFcIiA/IHRydWUgOiBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVGYWRlT3V0OiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIsIFwiMVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3lTbGltU2Nyb2xsOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgJChlbCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiKSA9PT0gXCIxXCIpIHsgLy8gZGVzdHJveSBleGlzdGluZyBpbnN0YW5jZSBiZWZvcmUgdXBkYXRpbmcgdGhlIGhlaWdodFxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ckxpc3QgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSB0aGUgY3VzdG9tIGF0dHJpYnVyZXMgc28gbGF0ZXIgd2Ugd2lsbCByZWFzc2lnbi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtaGFuZGxlLWNvbG9yXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXdyYXBwZXItY2xhc3NcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXJhaWwtY29sb3JcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1hbHdheXMtdmlzaWJsZVwiXSA9ICQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC12aXNpYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtcmFpbC12aXNpYmxlXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLXZpc2libGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaW1TY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpIDogJ3NsaW1TY3JvbGxEaXYnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVhc3NpZ24gY3VzdG9tIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGF0dHJMaXN0LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUuYXR0cihrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmdW5jdGlvbiB0byBzY3JvbGwgdG8gdGhlIHRvcFxuICAgICAgICBzY3JvbGxUb3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gIGJsb2NrIGVsZW1lbnQoaW5kaWNhdGUgbG9hZGluZylcbiAgICAgICAgYmxvY2tVSTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPicgKyAnPGRpdiBjbGFzcz1cImJsb2NrLXNwaW5uZXItYmFyXCI+PGRpdiBjbGFzcz1cImJvdW5jZTFcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlMlwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UzXCI+PC9kaXY+PC9kaXY+JyArICc8L2Rpdj4nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmljb25Pbmx5KSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiIGFsaWduPVwiXCI+PC9kaXY+JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy50ZXh0T25seSkge1xuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48c3Bhbj4mbmJzcDsmbmJzcDsnICsgKG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMT0FESU5HLi4uJykgKyAnPC9zcGFuPjwvZGl2Pic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48aW1nIHNyYz1cIicgKyB0aGlzLmdldEdsb2JhbEltZ1BhdGgoKSArICdsb2FkaW5nLXNwaW5uZXItZ3JleS5naWZcIiBhbGlnbj1cIlwiPjxzcGFuPiZuYnNwOyZuYnNwOycgKyAob3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xPQURJTkcuLi4nKSArICc8L3NwYW4+PC9kaXY+JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7IC8vIGVsZW1lbnQgYmxvY2tpbmdcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSAkKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZiAoZWwuaGVpZ2h0KCkgPD0gKCQod2luZG93KS5oZWlnaHQoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jZW5yZXJZID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWwuYmxvY2soe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBodG1sLFxuICAgICAgICAgICAgICAgICAgICBiYXNlWjogb3B0aW9ucy56SW5kZXggPyBvcHRpb25zLnpJbmRleCA6IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlclk6IG9wdGlvbnMuY2VucmVyWSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jZW5yZXJZIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNTUzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogb3B0aW9ucy5ib3hlZCA/IDAuMDUgOiAwLjEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICd3YWl0J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBwYWdlIGJsb2NraW5nXG4gICAgICAgICAgICAgICAgJC5ibG9ja1VJKHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaHRtbCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZVo6IG9wdGlvbnMuekluZGV4ID8gb3B0aW9ucy56SW5kZXggOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNTUzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogb3B0aW9ucy5ib3hlZCA/IDAuMDUgOiAwLjEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICd3YWl0J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvICB1bi1ibG9jayBlbGVtZW50KGZpbmlzaCBsb2FkaW5nKVxuICAgICAgICB1bmJsb2NrVUk6IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICQodGFyZ2V0KS51bmJsb2NrKHtcbiAgICAgICAgICAgICAgICAgICAgb25VbmJsb2NrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGFyZ2V0KS5jc3MoJ3Bvc2l0aW9uJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YXJnZXQpLmNzcygnem9vbScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkLnVuYmxvY2tVSSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0UGFnZUxvYWRpbmc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLXNwaW5uZXItYmFyJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInBhZ2Utc3Bpbm5lci1iYXJcIj48ZGl2IGNsYXNzPVwiYm91bmNlMVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UyXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTNcIj48L2Rpdj48L2Rpdj4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtbG9hZGluZycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJwYWdlLWxvYWRpbmdcIj48aW1nIHNyYz1cIicgKyB0aGlzLmdldEdsb2JhbEltZ1BhdGgoKSArICdsb2FkaW5nLXNwaW5uZXItZ3JleS5naWZcIi8+Jm5ic3A7Jm5ic3A7PHNwYW4+JyArIChvcHRpb25zICYmIG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMb2FkaW5nLi4uJykgKyAnPC9zcGFuPjwvZGl2PicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0b3BQYWdlTG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcucGFnZS1sb2FkaW5nLCAucGFnZS1zcGlubmVyLWJhcicpLnJlbW92ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFsZXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiBcIlwiLCAvLyBhbGVydHMgcGFyZW50IGNvbnRhaW5lcihieSBkZWZhdWx0IHBsYWNlZCBhZnRlciB0aGUgcGFnZSBicmVhZGNydW1icylcbiAgICAgICAgICAgICAgICBwbGFjZTogXCJhcHBlbmRcIiwgLy8gXCJhcHBlbmRcIiBvciBcInByZXBlbmRcIiBpbiBjb250YWluZXJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsIC8vIGFsZXJ0J3MgdHlwZVxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiXCIsIC8vIGFsZXJ0J3MgbWVzc2FnZVxuICAgICAgICAgICAgICAgIGNsb3NlOiB0cnVlLCAvLyBtYWtlIGFsZXJ0IGNsb3NhYmxlXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHRydWUsIC8vIGNsb3NlIGFsbCBwcmV2aW91c2UgYWxlcnRzIGZpcnN0XG4gICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsIC8vIGF1dG8gc2Nyb2xsIHRvIHRoZSBhbGVydCBhZnRlciBzaG93blxuICAgICAgICAgICAgICAgIGNsb3NlSW5TZWNvbmRzOiAwLCAvLyBhdXRvIGNsb3NlIGFmdGVyIGRlZmluZWQgc2Vjb25kc1xuICAgICAgICAgICAgICAgIGljb246IFwiXCIgLy8gcHV0IGljb24gYmVmb3JlIHRoZSBtZXNzYWdlXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICAgICAgdmFyIGlkID0gTWV0cm9uaWMuZ2V0VW5pcXVlSUQoXCJNZXRyb25pY19hbGVydFwiKTtcblxuICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGRpdiBpZD1cIicgKyBpZCArICdcIiBjbGFzcz1cIk1ldHJvbmljLWFsZXJ0cyBhbGVydCBhbGVydC0nICsgb3B0aW9ucy50eXBlICsgJyBmYWRlIGluXCI+JyArIChvcHRpb25zLmNsb3NlID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvYnV0dG9uPicgOiAnJykgKyAob3B0aW9ucy5pY29uICE9PSBcIlwiID8gJzxpIGNsYXNzPVwiZmEtbGcgZmEgZmEtJyArIG9wdGlvbnMuaWNvbiArICdcIj48L2k+ICAnIDogJycpICsgb3B0aW9ucy5tZXNzYWdlICsgJzwvZGl2Pic7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlc2V0KSB7XG4gICAgICAgICAgICAgICAgJCgnLk1ldHJvbmljLWFsZXJ0cycpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtY29udGFpbmVyLWJnLXNvbGlkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXRpdGxlJykuYWZ0ZXIoaHRtbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWJhcicpLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWJhcicpLmFmdGVyKGh0bWwpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtYnJlYWRjcnVtYicpLmFmdGVyKGh0bWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5wbGFjZSA9PSBcImFwcGVuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQob3B0aW9ucy5jb250YWluZXIpLmFwcGVuZChodG1sKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKG9wdGlvbnMuY29udGFpbmVyKS5wcmVwZW5kKGh0bWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZm9jdXMpIHtcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygkKCcjJyArIGlkKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNsb3NlSW5TZWNvbmRzID4gMCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyMnICsgaWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuY2xvc2VJblNlY29uZHMgKiAxMDAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGluaXRpYWxpemVzIHVuaWZvcm0gZWxlbWVudHNcbiAgICAgICAgaW5pdFVuaWZvcm06IGZ1bmN0aW9uKGVscykge1xuICAgICAgICAgICAgaWYgKGVscykge1xuICAgICAgICAgICAgICAgICQoZWxzKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudW5pZm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvL3dyTWV0cm9uaWNlciBmdW5jdGlvbiB0byB1cGRhdGUvc3luYyBqcXVlcnkgdW5pZm9ybSBjaGVja2JveCAmIHJhZGlvc1xuICAgICAgICB1cGRhdGVVbmlmb3JtOiBmdW5jdGlvbihlbHMpIHtcbiAgICAgICAgICAgICQudW5pZm9ybS51cGRhdGUoZWxzKTsgLy8gdXBkYXRlIHRoZSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zIFVJIGFmdGVyIHRoZSBhY3R1YWwgaW5wdXQgY29udHJvbCBzdGF0ZSBjaGFuZ2VkXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aGUgZmFuY3lib3ggcGx1Z2luXG4gICAgICAgIGluaXRGYW5jeWJveDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVGYW5jeWJveCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgYWN0dWFsIGlucHV0IHZhbHVlKHVzZWQgaW4gSUU5IGFuZCBJRTggZHVlIHRvIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSBub3Qgc3VwcG9ydGVkKVxuICAgICAgICBnZXRBY3R1YWxWYWw6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBlbCA9ICQoZWwpO1xuICAgICAgICAgICAgaWYgKGVsLnZhbCgpID09PSBlbC5hdHRyKFwicGxhY2Vob2xkZXJcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbC52YWwoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBnZXQgYSBwYXJlbWV0ZXIgYnkgbmFtZSBmcm9tIFVSTFxuICAgICAgICBnZXRVUkxQYXJhbWV0ZXI6IGZ1bmN0aW9uKHBhcmFtTmFtZSkge1xuICAgICAgICAgICAgdmFyIHNlYXJjaFN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpLFxuICAgICAgICAgICAgICAgIGksIHZhbCwgcGFyYW1zID0gc2VhcmNoU3RyaW5nLnNwbGl0KFwiJlwiKTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhbCA9IHBhcmFtc1tpXS5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICAgICAgaWYgKHZhbFswXSA9PSBwYXJhbU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZXNjYXBlKHZhbFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIGRldmljZSB0b3VjaCBzdXBwb3J0XG4gICAgICAgIGlzVG91Y2hEZXZpY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVFdmVudChcIlRvdWNoRXZlbnRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGdldCB0aGUgY29ycmVjdCB2aWV3cG9ydCB3aWR0aCBiYXNlZCBvbiAgaHR0cDovL2FuZHlsYW5ndG9uLmNvLnVrL2FydGljbGVzL2phdmFzY3JpcHQvZ2V0LXZpZXdwb3J0LXNpemUtamF2YXNjcmlwdC9cbiAgICAgICAgZ2V0Vmlld1BvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGUgPSB3aW5kb3csXG4gICAgICAgICAgICAgICAgYSA9ICdpbm5lcic7XG4gICAgICAgICAgICBpZiAoISgnaW5uZXJXaWR0aCcgaW4gd2luZG93KSkge1xuICAgICAgICAgICAgICAgIGEgPSAnY2xpZW50JztcbiAgICAgICAgICAgICAgICBlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGVbYSArICdXaWR0aCddLFxuICAgICAgICAgICAgICAgIGhlaWdodDogZVthICsgJ0hlaWdodCddXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFVuaXF1ZUlEOiBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiAncHJlZml4XycgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobmV3IERhdGUoKSkuZ2V0VGltZSgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjaGVjayBJRTggbW9kZVxuICAgICAgICBpc0lFODogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNJRTg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hlY2sgSUU5IG1vZGVcbiAgICAgICAgaXNJRTk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzSUU5O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vY2hlY2sgUlRMIG1vZGVcbiAgICAgICAgaXNSVEw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzUlRMO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGNoZWNrIElFOCBtb2RlXG4gICAgICAgIGlzQW5ndWxhckpzQXBwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIGFuZ3VsYXIgPT0gJ3VuZGVmaW5lZCcpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEFzc2V0c1BhdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0QXNzZXRzUGF0aDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgYXNzZXRzUGF0aCA9IHBhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0R2xvYmFsSW1nUGF0aDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgZ2xvYmFsSW1nUGF0aCA9IHBhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0R2xvYmFsSW1nUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbEltZ1BhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0R2xvYmFsUGx1Z2luc1BhdGg6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgICAgIGdsb2JhbFBsdWdpbnNQYXRoID0gcGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRHbG9iYWxQbHVnaW5zUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbFBsdWdpbnNQYXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdsb2JhbENzc1BhdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGggKyBnbG9iYWxDc3NQYXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGdldCBsYXlvdXQgY29sb3IgY29kZSBieSBjb2xvciBuYW1lXG4gICAgICAgIGdldEJyYW5kQ29sb3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChicmFuZENvbG9yc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBicmFuZENvbG9yc1tuYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFJlc3BvbnNpdmVCcmVha3BvaW50OiBmdW5jdGlvbihzaXplKSB7XG4gICAgICAgICAgICAvLyBib290c3RyYXAgcmVzcG9uc2l2ZSBicmVha3BvaW50c1xuICAgICAgICAgICAgdmFyIHNpemVzID0ge1xuICAgICAgICAgICAgICAgICd4cycgOiA0ODAsICAgICAvLyBleHRyYSBzbWFsbFxuICAgICAgICAgICAgICAgICdzbScgOiA3NjgsICAgICAvLyBzbWFsbFxuICAgICAgICAgICAgICAgICdtZCcgOiA5OTIsICAgICAvLyBtZWRpdW1cbiAgICAgICAgICAgICAgICAnbGcnIDogMTIwMCAgICAgLy8gbGFyZ2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBzaXplc1tzaXplXSA/IHNpemVzW3NpemVdIDogMDtcbiAgICAgICAgfVxuICAgIH07XG5cbn0gKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0cm9uaWM7IiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5jb25zdCBNZXRyb25pYyA9IHJlcXVpcmUoJy4vbWV0cm9uaWMnKVxuXG4vKipcbkNvcmUgc2NyaXB0IHRvIGhhbmRsZSB0aGUgZW50aXJlIHRoZW1lIGFuZCBjb3JlIGZ1bmN0aW9uc1xuKiovXG52YXIgUXVpY2tTaWRlYmFyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gSGFuZGxlcyBxdWljayBzaWRlYmFyIHRvZ2dsZXJcbiAgICB2YXIgaGFuZGxlUXVpY2tTaWRlYmFyVG9nZ2xlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gcXVpY2sgc2lkZWJhciB0b2dnbGVyXG4gICAgICAgICQoJy5wYWdlLWhlYWRlciAucXVpY2stc2lkZWJhci10b2dnbGVyLCAucGFnZS1xdWljay1zaWRlYmFyLXRvZ2dsZXInKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdwYWdlLXF1aWNrLXNpZGViYXItb3BlbicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBxdWljayBzaWRlYmFyIGNoYXRzXG4gICAgdmFyIGhhbmRsZVF1aWNrU2lkZWJhckNoYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0gJCgnLnBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyJyk7XG4gICAgICAgIHZhciB3cmFwcGVyQ2hhdCA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0Jyk7XG5cbiAgICAgICAgdmFyIGluaXRDaGF0U2xpbVNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjaGF0VXNlcnMgPSB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VycycpO1xuICAgICAgICAgICAgdmFyIGNoYXRVc2Vyc0hlaWdodDtcblxuICAgICAgICAgICAgY2hhdFVzZXJzSGVpZ2h0ID0gd3JhcHBlci5oZWlnaHQoKSAtIHdyYXBwZXIuZmluZCgnLm5hdi1qdXN0aWZpZWQgPiAubmF2LXRhYnMnKS5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICAvLyBjaGF0IHVzZXIgbGlzdFxuICAgICAgICAgICAgTWV0cm9uaWMuZGVzdHJveVNsaW1TY3JvbGwoY2hhdFVzZXJzKTtcbiAgICAgICAgICAgIGNoYXRVc2Vycy5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgY2hhdFVzZXJzSGVpZ2h0KTtcbiAgICAgICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGNoYXRVc2Vycyk7XG5cbiAgICAgICAgICAgIHZhciBjaGF0TWVzc2FnZXMgPSB3cmFwcGVyQ2hhdC5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1tZXNzYWdlcycpO1xuICAgICAgICAgICAgdmFyIGNoYXRNZXNzYWdlc0hlaWdodCA9IGNoYXRVc2Vyc0hlaWdodCAtIHdyYXBwZXJDaGF0LmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyLWZvcm0nKS5vdXRlckhlaWdodCgpIC0gd3JhcHBlckNoYXQuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1uYXYnKS5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICAvLyB1c2VyIGNoYXQgbWVzc2FnZXNcbiAgICAgICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKGNoYXRNZXNzYWdlcyk7XG4gICAgICAgICAgICBjaGF0TWVzc2FnZXMuYXR0cihcImRhdGEtaGVpZ2h0XCIsIGNoYXRNZXNzYWdlc0hlaWdodCk7XG4gICAgICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbChjaGF0TWVzc2FnZXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGluaXRDaGF0U2xpbVNjcm9sbCgpO1xuICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGluaXRDaGF0U2xpbVNjcm9sbCk7IC8vIHJlaW5pdGlhbGl6ZSBvbiB3aW5kb3cgcmVzaXplXG5cbiAgICAgICAgd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnMgLm1lZGlhLWxpc3QgPiAubWVkaWEnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3cmFwcGVyQ2hhdC5hZGRDbGFzcyhcInBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXIgLnBhZ2UtcXVpY2stc2lkZWJhci1iYWNrLXRvLWxpc3QnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3cmFwcGVyQ2hhdC5yZW1vdmVDbGFzcyhcInBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIik7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgdGFza3NcbiAgICB2YXIgaGFuZGxlUXVpY2tTaWRlYmFyQWxlcnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9ICQoJy5wYWdlLXF1aWNrLXNpZGViYXItd3JhcHBlcicpO1xuICAgICAgICB2YXIgd3JhcHBlckFsZXJ0cyA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1hbGVydHMnKTtcblxuICAgICAgICB2YXIgaW5pdEFsZXJ0c1NsaW1TY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYWxlcnRMaXN0ID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cy1saXN0Jyk7XG4gICAgICAgICAgICB2YXIgYWxlcnRMaXN0SGVpZ2h0O1xuXG4gICAgICAgICAgICBhbGVydExpc3RIZWlnaHQgPSB3cmFwcGVyLmhlaWdodCgpIC0gd3JhcHBlci5maW5kKCcubmF2LWp1c3RpZmllZCA+IC5uYXYtdGFicycpLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIC8vIGFsZXJ0cyBsaXN0XG4gICAgICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChhbGVydExpc3QpO1xuICAgICAgICAgICAgYWxlcnRMaXN0LmF0dHIoXCJkYXRhLWhlaWdodFwiLCBhbGVydExpc3RIZWlnaHQpO1xuICAgICAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoYWxlcnRMaXN0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpbml0QWxlcnRzU2xpbVNjcm9sbCgpO1xuICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGluaXRBbGVydHNTbGltU2Nyb2xsKTsgLy8gcmVpbml0aWFsaXplIG9uIHdpbmRvdyByZXNpemVcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL2xheW91dCBoYW5kbGVyc1xuICAgICAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyVG9nZ2xlcigpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyB0b2dnbGVyXG4gICAgICAgICAgICBoYW5kbGVRdWlja1NpZGViYXJDaGF0KCk7IC8vIGhhbmRsZXMgcXVpY2sgc2lkZWJhcidzIGNoYXRzXG4gICAgICAgICAgICBoYW5kbGVRdWlja1NpZGViYXJBbGVydHMoKTsgLy8gaGFuZGxlcyBxdWljayBzaWRlYmFyJ3MgYWxlcnRzXG4gICAgICAgIH1cbiAgICB9O1xuXG59ICgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrU2lkZWJhciIsImNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG5jbGFzcyBDb21tb24ge1xuXG4gICAgc3RhdGljIHNwbGl0TGluZXModGV4dCkge1xuICAgICAgICByZXR1cm4gdGV4dC5zcGxpdCgvXFxuLyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEV2ZW50VGltZSh0LCBub3cpIHtcbiAgICAgICAgbGV0IHRpbWUgPSBtb21lbnQodCwgJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyk7XG4gICAgICAgIGxldCBub3d0aW1lID0gbW9tZW50KG5vdywgJ1lZWVktTU0tREQgSEg6bW06c3MuU1NTJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0OiAgICAgICAnICsgdCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3c6ICAgICAnICsgbm93KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RpbWU6ICAgICcgKyB0aW1lLmZvcm1hdCgpKTsgLy8gKyAnICcgKyB0aW1lLmlzVmFsaWQoKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3d0aW1lOiAnICsgbm93dGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgbm93dGltZS5pc1ZhbGlkKCkpO1xuICAgICAgICByZXR1cm4gdGltZS5mcm9tKG5vd3RpbWUpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjbGFzc0lmKGtsYXNzLCBiKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2NsYXNzSWY6ICcgKyBrbGFzcyArICcsICcgKyBiKTtcbiAgICAgICAgcmV0dXJuIChiID8ga2xhc3MgOiAnJyk7XG4gICAgfVxuXG4gICAgLy8gYXZvaWQgJyRhcHBseSBhbHJlYWR5IGluIHByb2dyZXNzJyBlcnJvciAoc291cmNlOiBodHRwczovL2NvZGVyd2FsbC5jb20vcC9uZ2lzbWEpXG4gICAgc3RhdGljIHNhZmVBcHBseShmbikge1xuICAgICAgICBpZiAoZm4gJiYgKHR5cGVvZiAoZm4pID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNvdXJjZTogaHR0cDovL2N0cmxxLm9yZy9jb2RlLzE5NjE2LWRldGVjdC10b3VjaC1zY3JlZW4tamF2YXNjcmlwdFxuICAgIHN0YXRpYyBpc1RvdWNoRGV2aWNlKCkge1xuICAgICAgICByZXR1cm4gKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IChuYXZpZ2F0b3IuTWF4VG91Y2hQb2ludHMgPiAwKSB8fCAobmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFRpY2tzRnJvbURhdGUoZGF0ZSkge1xuICAgICAgICBsZXQgcmV0ID0gbnVsbDtcbiAgICAgICAgaWYoZGF0ZSAmJiBkYXRlLmdldFRpbWUpIHtcbiAgICAgICAgICAgIHJldCA9IGRhdGUuZ2V0VGltZSgpLzEwMDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21tb247IiwiY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcblxuY2xhc3MgVmlkZW9QbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGRpdklkLCBvcHRzID0geyBoZWlnaHQ6IDM5MCwgd2lkdGg6IDY0MCwgdmlkZW9JZDogJyd9KSB7XG4gICAgICAgIHRoaXMuaWQgPSBkaXZJZFxuICAgICAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxuICAgICAgICB0aGlzLmluaXQoKVxuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIHRoaXMuX29uUmVhZHkgPSB0aGlzLl9vblJlYWR5IHx8IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB3YWl0ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuWVQgJiYgd2luZG93LllULmxvYWRlZD09MSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLllUID0gd2luZG93LllUO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHdpbmRvdy5ZVClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHdhaXQsIDI1MClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3YWl0KClcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsYXllciA9IG5ldyB0aGlzLllULlBsYXllcih0aGlzLmlkLCB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLm9wdHMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLm9wdHMud2lkdGgsXG4gICAgICAgICAgICAgICAgdmlkZW9JZDogdGhpcy5vcHRzLnZpZGVvSWQsXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgIG9uUmVhZHk6IHRoaXMub25QbGF5ZXJSZWFkeSxcbiAgICAgICAgICAgICAgICAgICAgb25TdGF0ZUNoYW5nZTogdGhpcy5vblBsYXllclN0YXRlQ2hhbmdlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uUGxheWVyUmVhZHkoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBsYXlWaWRlbygpO1xuICAgIH1cblxuICAgIG9uUGxheWVyU3RhdGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEgPT0gWW91VHViZS5pbnRlZ3JhdGlvbi5QbGF5ZXJTdGF0ZS5FTkRFRCkge1xuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBpc0RvbmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbmUgPT0gdHJ1ZVxuICAgIH1cblxuICAgIHN0b3BWaWRlbygpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcFZpZGVvKCk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVmlkZW9QbGF5ZXI7IiwiaWYgKCFTdHJpbmcucHJvdG90eXBlLmZvcm1hdCkge1xuICAgIFN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24gKG1hdGNoLCBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgID8gYXJnc1tudW1iZXJdXG4gICAgICAgICAgICAgIDogbWF0Y2hcbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0iLCJjb25zdCB1dWlkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBoZXhEaWdpdHMsIGksIHMsIHV1aWQ7XG4gICAgcyA9IFtdO1xuICAgIHMubGVuZ3RoID0gMzY7XG4gICAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgMzYpIHtcbiAgICAgICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpO1xuICAgICAgICBpICs9IDE7XG4gICAgfVxuICAgIHNbMTRdID0gJzQnO1xuICAgIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKTtcbiAgICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gJy0nO1xuICAgIHV1aWQgPSBzLmpvaW4oJycpO1xuICAgIHJldHVybiB1dWlkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dWlkOyJdfQ==
