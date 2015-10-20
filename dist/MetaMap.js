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
var Integrations = require('./js/app/Integrations');

var MetaMap = (function () {
    function MetaMap() {
        _classCallCheck(this, MetaMap);

        this.Config = new Config();
        this.config = this.Config.config;
        this.MetaFire = this.Config.MetaFire;
        this.Eventer = new Eventer(this);
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

},{"./js/app//Config.js":16,"./js/app/Eventer.js":17,"./js/app/Integrations":19,"./js/app/Router.js":21,"./js/app/auth0":23,"./js/app/user.js":24,"./js/integrations/google.js":44,"./js/pages/PageFactory.js":45,"./js/tools/shims.js":77,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"jquery":undefined,"jquery-ui":undefined,"lodash":undefined,"riot":"riot"}],2:[function(require,module,exports){
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
                            var target = params.target;
                            var source = params.source;
                            var sourceId = params.source.data.id;
                            var targetId = params.target.data.id;

                            //If the source was previously a child of any parent, disassociate
                            if (source.data.parent) {
                                var oldParent = toolkit.getNode(source.data.parent);
                                if (oldParent) {
                                    oldParent.data.children = _.remove(oldParent.data.children, function (id) {
                                        return id == sourceId;
                                    });
                                    toolkit.updateNode(oldParent);
                                }
                            }

                            //Assign the source to the new parent
                            target.data.children = target.data.children || [];
                            target.data.children.push(source.data.id);
                            toolkit.updateNode(target);

                            //Update the source
                            source.data.parent = targetId;
                            source.data.h = target.data.h * 0.667;
                            source.data.w = target.data.w * 0.667;
                            source.data.order = target.children.length;
                            toolkit.updateNode(source);

                            renderer.refresh();
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

var Metronic = require('../../template/metronic');
var raw = require('./raw');
var CONSTANTS = require('../../constants/constants');
var TrainingMix = require('../mixins/training-mix');

var html = '\n<div class="page-quick-sidebar-wrapper">\n    <div class="page-quick-sidebar">\n        <div class="nav-justified">\n            <ul class="nav nav-tabs nav-justified">\n                <li class="active">\n                    <a href="#quick_sidebar_tab_1" data-toggle="tab">\n                    Cortex Man\n                    </a>\n                </li>\n                <li>\n                    <a href="#quick_sidebar_tab_2" data-toggle="tab">\n                    Outline\n                    </a>\n                </li>\n            </ul>\n            <div class="tab-content">\n                <div class="tab-pane active page-quick-sidebar-chat page-quick-sidebar-content-item-shown" id="quick_sidebar_tab_1">\n                    <div class="page-quick-sidebar-chat-users" data-rail-color="#ddd" data-wrapper-class="page-quick-sidebar-list">\n                    </div>\n                    <div class="page-quick-sidebar-item">\n                        <div class="page-quick-sidebar-chat-user">\n                            <div id="cortex_messages" class="page-quick-sidebar-chat-user-messages">\n                                <div each="{ userTraining.messages }" class="post { out: author == \'cortex\', in: author != \'cortex\' }">\n                                    <img height="39" width="39" class="avatar" alt="" src="{ author == \'cortex\' ? parent.cortexPicture : parent.userPicture }"/>\n                                    <div class="message">\n                                        <span class="arrow"></span>\n                                        <a href="javascript:;" class="name">{ name }</a>\n                                        <span class="datetime">{ parent.getRelativeTime(time) }</span>\n                                        <span class="body">\n                                        <raw content="{ message }"></raw> </span>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class="page-quick-sidebar-chat-user-form">\n                                <form id="chat_input_form" onsubmit="{ onSubmit }">\n                                    <div class="input-group">\n                                        <input id="chat_input" type="text" class="form-control" placeholder="Type a message here...">\n                                        <div class="input-group-btn">\n                                            <button type="submit" class="btn blue"><i class="fa fa-paperclip"></i></button>\n                                        </div>\n                                    </div>\n                                </form>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class="tab-pane page-quick-sidebar-alerts" id="quick_sidebar_tab_2">\n                    <div class="page-quick-sidebar-alerts-list">\n                        <h3 class="list-heading">Intro</h3>\n                        <h3 class="list-heading">Section 1</h3>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n';

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

    this.on('update', function () {
        handleQuickSidebarToggler(); // handles quick sidebar's toggler
        handleQuickSidebarChat(); // handles quick sidebar's chats
        handleQuickSidebarAlerts(); // handles quick sidebar's alerts
        _this.userPicture = MetaMap.User.picture;
        $(_this.cortex_messages).slimScroll({ scrollBy: '100px' });
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

},{"../../../MetaMap":1,"../../constants/constants":29,"../../template/metronic":74,"../mixins/training-mix":55,"./raw":49,"moment":undefined,"riot":"riot"}],49:[function(require,module,exports){
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
                    disableFadeOut: true,
                    start: '.page-quick-sidebar-chat-user-form'
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvTWV0YU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3B5TWFwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQ291cnNlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0RlbGV0ZU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0ZlZWRiYWNrLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvSG9tZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0xvZ291dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL015TWFwcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL05ld01hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL09wZW5NYXAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9PcGVuVHJhaW5pbmcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9TaGFyZU1hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9Db25maWcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0V2ZW50ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9JbnRlZ3JhdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1Blcm1pc3Npb25zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC9Sb3V0ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL1NoYXJpbmcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvYXBwL2F1dGgwLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2FwcC91c2VyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NhbnZhcy9jYW52YXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY2FudmFzL2xheW91dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvYWN0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvY2FudmFzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9jb25zdGFudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2RzcnAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VkaXRTdGF0dXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2VsZW1lbnRzLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ldmVudHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL25vdGlmaWNhdGlvbi5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvcGFnZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3JvdXRlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFicy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvdGFncy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvQWRkVGhpcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvR29vZ2xlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL2ludGVncmF0aW9ucy9Vc2VyU25hcC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvWW91VHViZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvX0ludGVncmF0aW9uc0Jhc2UuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL2NhbnZhcy9ub2RlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9xdWljay1zaWRlYmFyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9yYXcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9kaWFsb2dzL3NoYXJlLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLWhlbHAuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21lbnUvbWV0YS1wb2ludHMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtdXNlci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL21peGlucy90cmFpbmluZy1taXguanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWFjdGlvbnMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWJvZHkuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWNvbnRhaW5lci5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtY29udGVudC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtZm9vdGVyLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1oZWFkZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWxvZ28uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXNlYXJjaC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtdG9wbWVudS5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL2NvdXJzZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9ob21lLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvbXktbWFwcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL3Rlcm1zLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdHJhaW5pbmcuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy90YWJsZXMvYWxsLWNvdXJzZXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdGFncy90YWJsZXMvbXktY291cnNlcy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9kZW1vLmpzIiwiRDovR2l0aHViL01ldGFNYXAvc3JjL2pzL3RlbXBsYXRlL2xheW91dC5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9tZXRyb25pYy5qcyIsIkQ6L0dpdGh1Yi9NZXRhTWFwL3NyYy9qcy90b29scy9Db21tb24uanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvVmlkZW9QbGF5ZXIuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvc2hpbXMuanMiLCJEOi9HaXRodWIvTWV0YU1hcC9zcmMvanMvdG9vbHMvdXVpZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQixPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckIsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXJDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzdDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9DLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7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RyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3RCxTQUFDLElBQUksQ0FBQyxDQUFDO0tBQ1Y7QUFDRCxLQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ1osS0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxLQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ25DLFFBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCLFdBQU8sSUFBSSxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCdiYWJlbC9wb2x5ZmlsbCcpO1xyXG5yZXF1aXJlKCdjb3JlLWpzJyk7XHJcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5yZXF1aXJlKCdqcXVlcnktdWknKTtcclxucmVxdWlyZSgnYm9vdHN0cmFwJyk7XHJcbndpbmRvdy5yaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG53aW5kb3cuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG53aW5kb3cuUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XHJcblxyXG5jb25zdCBBdXRoMCA9IHJlcXVpcmUoJy4vanMvYXBwL2F1dGgwJyk7XHJcbmNvbnN0IFVzZXIgPSByZXF1aXJlKCcuL2pzL2FwcC91c2VyLmpzJyk7XHJcbmNvbnN0IFJvdXRlciA9IHJlcXVpcmUoJy4vanMvYXBwL1JvdXRlci5qcycpO1xyXG5jb25zdCBFdmVudGVyID0gcmVxdWlyZSgnLi9qcy9hcHAvRXZlbnRlci5qcycpO1xyXG5jb25zdCBQYWdlRmFjdG9yeSA9IHJlcXVpcmUoJy4vanMvcGFnZXMvUGFnZUZhY3RvcnkuanMnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgQ29uZmlnID0gcmVxdWlyZSgnLi9qcy9hcHAvL0NvbmZpZy5qcycpO1xyXG5jb25zdCBnYSA9IHJlcXVpcmUoJy4vanMvaW50ZWdyYXRpb25zL2dvb2dsZS5qcycpO1xyXG5jb25zdCBzaGltcyA9IHJlcXVpcmUoJy4vanMvdG9vbHMvc2hpbXMuanMnKTtcclxuY29uc3QgSW50ZWdyYXRpb25zID0gcmVxdWlyZSgnLi9qcy9hcHAvSW50ZWdyYXRpb25zJylcclxuXHJcbmNsYXNzIE1ldGFNYXAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuQ29uZmlnID0gbmV3IENvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5Db25maWcuY29uZmlnO1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSB0aGlzLkNvbmZpZy5NZXRhRmlyZTtcclxuICAgICAgICB0aGlzLkV2ZW50ZXIgPSBuZXcgRXZlbnRlcih0aGlzKTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICBQcm9taXNlLm9uUG9zc2libHlVbmhhbmRsZWRSZWplY3Rpb24oZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoYXQuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db25maWcub25SZWFkeSgpLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQXV0aDAgPSBuZXcgQXV0aDAoY29uZmlnLmF1dGgwKTtcclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuQXV0aDAubG9naW4oKS50aGVuKChwcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ2luKCkudGhlbigoYXV0aCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlciA9IG5ldyBVc2VyKHByb2ZpbGUsIGF1dGgsIHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMgPSBuZXcgSW50ZWdyYXRpb25zKHRoaXMsIHRoaXMuVXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Vc2VyLm9uUmVhZHkoKS50aGVuKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFnZUZhY3RvcnkgPSBuZXcgUGFnZUZhY3RvcnkodGhpcy5FdmVudGVyLCB0aGlzLk1ldGFGaXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb3V0ZXIgPSBuZXcgUm91dGVyKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvdXRlci5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGVidWcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0LnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpXHJcbiAgICB9XHJcblxyXG4gICAgbG9nKHZhbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICB0aGlzLkludGVncmF0aW9ucy5zZW5kRXZlbnQodmFsLCAnZXZlbnQnLCAnbG9nJywgJ2xhYmVsJylcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LmNvbnNvbGUuaW5mbyh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGVycm9yKHZhbCkge1xyXG4gICAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKHZhbCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRlYnVnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLnNlbmRFdmVudCh2YWwsICdleGNlcHRpb24nKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5NZXRhRmlyZS5sb2dvdXQoKTtcclxuICAgICAgICB0aGlzLkF1dGgwLmxvZ291dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBtbSA9IG5ldyBNZXRhTWFwKCk7XHJcbm1vZHVsZS5leHBvcnRzID0gbW07IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBBY3Rpb24gZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5fYWN0aW9ucyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIF9nZXRBY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuX2FjdGlvbnNbYWN0aW9uXTtcclxuICAgICAgICBpZiAoIXJldCkge1xyXG4gICAgICAgICAgICBsZXQgTWV0aG9kID0gbnVsbDtcclxuICAgICAgICAgICAgc3dpdGNoKGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5PUEVOX01BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL09wZW5NYXAuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuVFJBSU5JTkdTOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vT3BlblRyYWluaW5nLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLk5FV19NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9OZXdNYXAuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuQ09QWV9NQVA6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Db3B5TWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkNPVVJTRV9MSVNUOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vQ291cnNlcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ERUxFVEVfTUFQOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vRGVsZXRlTWFwLmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLk1ZX01BUFM6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9NeU1hcHMuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuTE9HT1VUOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vTG9nb3V0LmpzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlNIQVJFX01BUDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL1NoYXJlTWFwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlRFUk1TX0FORF9DT05ESVRJT05TOlxyXG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vVGVybXMuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuRkVFREJBQ0s6XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9GZWVkYmFjaycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0hvbWUuanMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoTWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSBuZXcgTWV0aG9kKHRoaXMubWV0YUZpcmUsIHRoaXMuZXZlbnRlciwgdGhpcy5wYWdlRmFjdG9yeSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3Rpb25zW2FjdGlvbl0gPSByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoYWN0aW9uLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoKTtcclxuICAgICAgICBsZXQgbWV0aG9kID0gdGhpcy5fZ2V0QWN0aW9uKGFjdGlvbik7XHJcbiAgICAgICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpXHJcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYWN0KC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247IiwiY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXRhRmlyZSwgZXZlbnRlciwgcGFnZUZhY3RvcnkpIHtcclxuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyID0gZXZlbnRlcjtcclxuICAgICAgICB0aGlzLnBhZ2VGYWN0b3J5ID0gcGFnZUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVNpZGViYXIoKSB7XHJcbiAgICAgICAgaWYodGhpcy5zaWRlYmFyT3Blbikge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5TaWRlYmFyKGlkKSB7XHJcbiAgICAgICAgdGhpcy5zaWRlYmFyT3BlbiA9IHRydWVcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sIGlkKVxyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlU2lkZWJhcigpIHtcclxuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gZmFsc2VcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFKVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbkJhc2U7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBDb3B5TWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIGlmICghaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignTXVzdCBoYXZlIGEgbWFwIGluIG9yZGVyIHRvIGNvcHkuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG9sZE1hcCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3TWFwID0ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogYCR7bmV3IERhdGUoKX1gLFxyXG4gICAgICAgICAgICAgICAgb3duZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlOiB0aGlzLm1ldGFNYXAuVXNlci5waWN0dXJlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbmFtZTogdGhpcy5hcHBlbmRDb3B5KG9sZE1hcC5uYW1lKSxcclxuICAgICAgICAgICAgICAgIHNoYXJlZF93aXRoOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRtaW46IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAnKic6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiBmYWxzZSB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7aWR9YCkudGhlbigob2xkTWFwRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcclxuICAgICAgICAgICAgICAgIGxldCBtYXBJZCA9IHB1c2hTdGF0ZS5rZXkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuc2V0RGF0YShvbGRNYXBEYXRhLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke21hcElkfWApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci50byhgbWFwLyR7bWFwSWR9YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZENvcHkoc3RyKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHN0cjtcclxuICAgICAgICBpZiAoIV8uY29udGFpbnMoc3RyLCAnKENvcHknKSkge1xyXG4gICAgICAgICAgICByZXQgPSByZXQgKyAnIChDb3B5IDEpJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbWVzcyA9IHN0ci5zcGxpdCgnICcpO1xyXG4gICAgICAgICAgICBsZXQgY250ID0gMjtcclxuICAgICAgICAgICAgaWYgKG1lc3MubGVuZ3RoIC0gbWVzcy5sYXN0SW5kZXhPZignKENvcHknKSA8PSA0KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JiZyA9IG1lc3NbbWVzcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGlmIChncmJnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JiZyA9IGdyYmcucmVwbGFjZSgnKScsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjbnQgPSArZ3JiZyArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gbWVzcy5zbGljZSgwLCBtZXNzLmxlbmd0aCAtIDIpLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXQgKz0gYCAoQ29weSAke2NudH0pYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb3B5TWFwOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL2NvdXJzZXMnKTtcclxuXHJcbmNsYXNzIENvdXJzZXMgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICBsZXQgdGFnID0gcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLkNPVVJTRV9MSVNUKVswXTtcclxuICAgICAgICB0YWcudXBkYXRlKClcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLlBBR0VTLkNPVVJTRV9MSVNULCB7IGlkOiBpZCB9LCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnQ291cnNlcycgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb3Vyc2VzOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jbGFzcyBEZWxldGVNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgRGVsZXRlTWFwLmRlbGV0ZUFsbChbaWRdKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZGVsZXRlQWxsKGlkcywgcGF0aCA9IENPTlNUQU5UUy5QQUdFUy5IT01FKSB7XHJcbiAgICAgICAgY29uc3QgbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfLmVhY2goaWRzLCAoaWQpID0+IHtcclxuICAgICAgICAgICAgICAgIG1ldGFNYXAuTWV0YUZpcmUuZGVsZXRlRGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke2lkfWApO1xyXG4gICAgICAgICAgICAgICAgbWV0YU1hcC5NZXRhRmlyZS5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICBtZXRhTWFwLlJvdXRlci50byhwYXRoKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZWxldGVNYXA7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5cclxuY2xhc3MgRmVlZGJhY2sgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHdpbmRvdy5Vc2VyU25hcDtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KCk7XHJcbiAgICAgICAgdGhpcy51c2VyU25hcC5vcGVuUmVwb3J0V2luZG93KCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmVlZGJhY2s7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvaG9tZScpO1xyXG5cclxuY2xhc3MgSG9tZSBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5IT01FKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ0hvbWUnIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIb21lOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG5jbGFzcyBMb2dvdXQgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubWV0YU1hcC5sb2dvdXQoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMb2dvdXQ7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvbXktbWFwcycpO1xyXG5cclxuY2xhc3MgTXlNYXBzIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLk1ZX01BUFMpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuUEFHRVMuTVlfTUFQUywgeyBpZDogaWQgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ015IE1hcHMnIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNeU1hcHM7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBOZXdNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KCkge1xyXG4gICAgICAgIHN1cGVyLmFjdCgpO1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTkVXX01BUH1gKS50aGVuKChibGFua01hcCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV3TWFwID0ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogYCR7bmV3IERhdGUoKX1gLFxyXG4gICAgICAgICAgICAgICAgb3duZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlOiB0aGlzLm1ldGFNYXAuVXNlci5waWN0dXJlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ05ldyBVbnRpdGxlZCBNYXAnLFxyXG4gICAgICAgICAgICAgICAgc2hhcmVkX3dpdGg6IHtcclxuICAgICAgICAgICAgICAgICAgICBhZG1pbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICcqJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IGZhbHNlIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcHVzaFN0YXRlID0gdGhpcy5tZXRhRmlyZS5wdXNoRGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfWApO1xyXG4gICAgICAgICAgICBsZXQgbWFwSWQgPSBwdXNoU3RhdGUua2V5KCk7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuc2V0RGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7bWFwSWR9YCk7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke21hcElkfWApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5ld01hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgbWV0YUNhbnZhcyA9IHJlcXVpcmUoJy4uL3RhZ3MvY2FudmFzL21ldGEtY2FudmFzLmpzJyk7XHJcblxyXG5jbGFzcyBPcGVuTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCkudGhlbigobWFwKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5NRVRBX0NBTlZBUyk7XHJcbiAgICAgICAgICAgICAgICBtYXAuaWQgPSBpZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLk5BViwgQ09OU1RBTlRTLlBBR0VTLk1BUCwgbWFwLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCBtYXAsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5NQVAsIG1hcCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9wZW5NYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlJylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbmNvbnN0IHRyYWluaW5nID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy90cmFpbmluZycpXHJcblxyXG5jbGFzcyBPcGVuVHJhaW5pbmcgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcclxuICAgICAgICBpZiAoaWQpIHtcclxuICAgICAgICAgICAgbGV0IHRhZyA9IHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5UUkFJTklORylbMF07XHJcbiAgICAgICAgICAgIHRhZy51cGRhdGUoeyBpZDogaWQgfSk7XHJcbiAgICAgICAgICAgIHRoaXMub3BlblNpZGViYXIoaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcGVuVHJhaW5pbmc7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxucmVxdWlyZSgnLi4vdGFncy9kaWFsb2dzL3NoYXJlJylcclxuXHJcbmNsYXNzIFNoYXJlTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcclxuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0ke2lkfWApLnRoZW4oKG1hcCkgPT4ge1xyXG4gICAgICAgICAgICBtYXAuaWQgPSBpZFxyXG4gICAgICAgICAgICBTaGFyZU1hcC5hY3QoeyBtYXA6IG1hcCB9KVxyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLmJhY2soKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhY3QobWFwKSB7XHJcbiAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICBsZXQgbW9kYWwgPSByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX01PREFMX0RJQUxPR19DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5TSEFSRSlbMF1cclxuICAgICAgICAgICAgbW9kYWwudXBkYXRlKG1hcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hhcmVNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxyXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgdGVybXMgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL3Rlcm1zJyk7XHJcblxyXG5jbGFzcyBUZXJtcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xyXG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5URVJNUyk7XHJcbiAgICAgICAgdGhpcy5ldmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCB7IG5hbWU6ICdUZXJtcyBhbmQgQ29uZGl0aW9ucycgfSwgLi4ucGFyYW1zKTtcclxuICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcm1zOyIsImNvbnN0IE1ldGFGaXJlID0gcmVxdWlyZSgnLi9GaXJlYmFzZScpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNvbnN0IGNvbmZpZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IFNJVEVTID0ge1xyXG4gICAgICAgIENSTF9TVEFHSU5HOiB7XHJcbiAgICAgICAgICAgIGRiOiAnbWV0YS1tYXAtc3RhZ2luZydcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmV0ID0ge1xyXG4gICAgICAgIGhvc3Q6IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxyXG4gICAgICAgIHNpdGU6IHt9XHJcbiAgICB9XHJcbiAgICBsZXQgc2VnbWVudHMgPSByZXQuaG9zdC5zcGxpdCgnLicpO1xyXG4gICAgbGV0IGZpcnN0ID0gc2VnbWVudHNbMF07XHJcbiAgICBpZiAoZmlyc3QgPT09ICd3d3cnKSB7XHJcbiAgICAgICAgZmlyc3QgPSBzZWdtZW50c1sxXTtcclxuICAgIH1cclxuICAgIGZpcnN0ID0gZmlyc3Quc3BsaXQoJzonKVswXTtcclxuXHJcbiAgICBzd2l0Y2ggKGZpcnN0LnRvTG93ZXJDYXNlKCkpIHtcclxuXHJcbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcclxuICAgICAgICBjYXNlICdtZXRhLW1hcC1zdGFnaW5nJzpcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTLkNSTF9TVEFHSU5HO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmV0O1xyXG59O1xyXG5cclxuY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWdzKSB7XHJcbiAgICAgICAgdGhpcy50YWdzID0gdGFncztcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZygpO1xyXG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXRlKCkge1xyXG4gICAgICAgIHJldHVybiAnZnJvbnRlbmQnO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk1ldGFGaXJlLm9uKCdjb25maWcnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUub24oJ21ldGFtYXAvY2FudmFzJywgKGNhbnZhcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQodGhpcy5jb25maWcuc2l0ZSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwodGhpcy5jb25maWcuc2l0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vblJlYWR5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcblxyXG5jbGFzcyBFdmVudGVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXRhTWFwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmlvdC5vYnNlcnZhYmxlKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9XHJcbiAgICB9XHJcblxyXG4gICAgZXZlcnkoZXZlbnQsIHJlYWN0aW9uKSB7XHJcbiAgICAgICAgLy9sZXQgY2FsbGJhY2sgPSByZWFjdGlvbjtcclxuICAgICAgICAvL2lmICh0aGlzLmV2ZW50c1tldmVudF0pIHtcclxuICAgICAgICAvLyAgICBsZXQgcGlnZ3liYWNrID0gdGhpcy5ldmVudHNbZXZlbnRdO1xyXG4gICAgICAgIC8vICAgIGNhbGxiYWNrID0gKC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICBwaWdneWJhY2soLi4ucGFyYW1zKTtcclxuICAgICAgICAvLyAgICAgICAgcmVhY3Rpb24oLi4ucGFyYW1zKTtcclxuICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XHJcbiAgICAgICAgXy5lYWNoKGV2ZW50cywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSByZWFjdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5vbihldmVudCwgcmVhY3Rpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcmdldChldmVudCwgY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgZXZlbnRzID0gZXZlbnQuc3BsaXQoJyAnKTtcclxuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tldmVudF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldmVudCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldmVudCwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkbyhldmVudCwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XHJcbiAgICAgICAgXy5lYWNoKGV2ZW50cywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoZXZlbnQsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50ZXI7IiwibGV0IEZpcmViYXNlID0gd2luZG93LkZpcmViYXNlO1xyXG5sZXQgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcclxubGV0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxyXG5cclxuY2xhc3MgTWV0YUZpcmUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuZmIgPSBuZXcgRmlyZWJhc2UoYGh0dHBzOi8vJHt0aGlzLmNvbmZpZy5zaXRlLmRifS5maXJlYmFzZWlvLmNvbWApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtZXRhTWFwKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbWV0YU1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWV0YU1hcDtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAuZ2V0U2Vzc2lvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHByb2ZpbGUpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5NZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5jb25maWcuc2l0ZS5hdXRoMC5hcGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF90b2tlbjogcHJvZmlsZS5pZF90b2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIGRlbGVnYXRpb25SZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZS5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnZmlyZWJhc2VfdG9rZW4nLCB0aGlzLmZpcmViYXNlX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZiLmF1dGhXaXRoQ3VzdG9tVG9rZW4odGhpcy5maXJlYmFzZV90b2tlbiwgKGVycm9yLCBhdXRoRGF0YSwgLi4ucGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKGF1dGhEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IHRoaXMuX2xvZ2luO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW47XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldENoaWxkKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBjaGlsZC5vbmNlKCd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gc25hcHNob3QudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbihwYXRoLCBjYWxsYmFjaywgZXZlbnQgPSAndmFsdWUnKSB7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG1ldGhvZCA9IChzbmFwc2hvdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICghc25hcHNob3QuZXhpc3RzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gZGF0YSBhdCAke3BhdGh9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NoaWxkLm9mZihldmVudCwgbWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY2hpbGQub24oZXZlbnQsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvZmYocGF0aCwgbWV0aG9kID0gJ3ZhbHVlJywgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5vZmYobWV0aG9kLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YShkYXRhLCBwYXRoKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcclxuICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVEYXRhKHBhdGgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXREYXRhKG51bGwsIHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2hEYXRhKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnB1c2goZGF0YSwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRhSW5UcmFuc2FjdGlvbihkYXRhLCBwYXRoLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XHJcbiAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQudHJhbnNhY3Rpb24oKGN1cnJlbnRWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVycm9yKGUsIHBhdGgpIHtcclxuICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcih7IG1lc3NhZ2U6IGBQZXJtaXNzaW9uIGRlbmllZCB0byAke3BhdGh9YCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9vblJlYWR5ID0gbnVsbDtcclxuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdmaXJlYmFzZV90b2tlbicpO1xyXG4gICAgICAgIHRoaXMuZmIudW5hdXRoKCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBNZXRhRmlyZTsiLCJjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIEludGVncmF0aW9ucyB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKG1ldGFNYXAsIHVzZXIpIHtcclxuXHRcdHRoaXMuY29uZmlnID0gbWV0YU1hcC5jb25maWc7XHJcblx0XHR0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xyXG5cdFx0dGhpcy51c2VyID0gdXNlcjtcclxuXHRcdHRoaXMuX2ZlYXR1cmVzID0ge1xyXG5cdFx0XHRnb29nbGU6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9Hb29nbGUnKSxcclxuXHRcdFx0dXNlcnNuYXA6IHJlcXVpcmUoJy4uL2ludGVncmF0aW9ucy9Vc2VyU25hcCcpLFxyXG4gICAgICAgICAgICBhZGR0aGlzOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvQWRkVGhpcycpLFxyXG4gICAgICAgICAgICB5b3V0dWJlOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvWW91VHViZScpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0aW5pdCgpIHtcclxuICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChGZWF0dXJlKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGxldCBjb25maWcgPSB0aGlzLmNvbmZpZy5zaXRlW25hbWVdO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXSA9IG5ldyBGZWF0dXJlKGNvbmZpZywgdGhpcy51c2VyKTtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0uaW5pdCgpO1xyXG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5zZXRVc2VyKCk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5tZXRhTWFwLmVycm9yKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHRzZXRVc2VyKCkge1xyXG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNldFVzZXIoKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRzZW5kRXZlbnQodmFsLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMubWV0YU1hcC5kZWJ1Zykge1xyXG4gICAgICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbbmFtZV0uc2VuZEV2ZW50KHZhbCwgLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHJcblx0fVxyXG5cclxuXHRsb2dvdXQoKSB7XHJcblx0XHRfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHRoaXNbbmFtZV0ubG9nb3V0KCk7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnRlZ3JhdGlvbnM7IiwiY2xhc3MgUGVybWlzc2lvbnMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbWFwXHJcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcbiAgICB9XHJcblxyXG4gICAgY2FuRWRpdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc01hcE93bmVyKCkgfHwgdGhpcy5pc1NoYXJlZEVkaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIGNhblZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNNYXBPd25lcigpIHx8IHRoaXMuaXNTaGFyZWRWaWV3KClcclxuICAgIH1cclxuXHJcbiAgICBpc01hcE93bmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJiB0aGlzLm1hcC5vd25lci51c2VySWQgPT0gdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaGFyZWRFZGl0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxyXG4gICAgICAgICAgICB0aGlzLm1hcC5zaGFyZWRfd2l0aCAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMubWV0YU1hcC5Vc2VyLmlzQWRtaW4gfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdICYmIHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkpXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaGFyZWRWaWV3KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxyXG4gICAgICAgICAgICB0aGlzLmlzU2hhcmVkRWRpdCgpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdLnJlYWQgPT0gdHJ1ZSkgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddICYmIHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlKVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBlcm1pc3Npb25zOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XHJcbmNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgUm91dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcclxuICAgICAgICB0aGlzLmludGVncmF0aW9ucyA9IG1ldGFNYXAuSW50ZWdyYXRpb25zO1xyXG4gICAgICAgIHRoaXMudXNlciA9IG1ldGFNYXAuVXNlcjtcclxuICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5ID0gbWV0YU1hcC5QYWdlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBtZXRhTWFwLkV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgcmlvdC5yb3V0ZS5zdGFydCgpO1xyXG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgaWQgPSAnJywgYWN0aW9uID0gJycsIC4uLnBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhdGggPSB0aGlzLmdldFBhdGgodGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCB0aGlzLnBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLlBhZ2VGYWN0b3J5Lm5hdmlnYXRlKHRoaXMucGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbygnaGlzdG9yeScsIHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50UGFnZSgpIHtcclxuICAgICAgICBsZXQgcGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJztcclxuICAgICAgICBpZiAoIXRoaXMuaXNUcmFja2VkKHBhZ2UpKSB7XHJcbiAgICAgICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UgPSB0aGlzLmdldFBhdGgodGhpcy51c2VyLmhpc3RvcnlbcGFnZUNudCAtIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFBhdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcmV2aW91c1BhZ2UocGFnZU5vID0gMikge1xyXG4gICAgICAgIGxldCBwYWdlID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMCkge1xyXG4gICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSBwYWdlTm9dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByZXZpb3VzUGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmV2aW91c1BhZ2UoMik7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhY2socGF0aCkge1xyXG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb25zLnVwZGF0ZVBhdGgocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlTWFpbihoaWRlLCBwYXRoKSB7XHJcbiAgICAgICAgdGhpcy50cmFjayhwYXRoKTtcclxuICAgICAgICBpZiAoaGlkZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFBhdGgocGF0aCkge1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIHRvKHBhdGgpIHtcclxuICAgICAgICBwYXRoID0gdGhpcy5nZXRQYXRoKHBhdGgpO1xyXG4gICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCBwYXRoKTtcclxuICAgICAgICAgICAgcmlvdC5yb3V0ZShgJHtwYXRofWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiYWNrKCkge1xyXG4gICAgICAgIGxldCBwYXRoID0gJ2hvbWUnO1xyXG4gICAgICAgIGxldCBwYWdlQ250ID0gdGhpcy51c2VyLmhpc3RvcnkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChwYWdlQ250ID4gMSAmJiAodGhpcy5jdXJyZW50UGFnZSAhPSAnbXltYXBzJyB8fCB0aGlzLmN1cnJlbnRQYWdlICE9IHRoaXMucHJldmlvdXNQYWdlKSkge1xyXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5wcmV2aW91c1BhZ2U7XHJcbiAgICAgICAgICAgIGxldCBiYWNrTm8gPSAyO1xyXG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNUcmFja2VkKHBhdGgpICYmIHRoaXMudXNlci5oaXN0b3J5W2JhY2tOb10pIHtcclxuICAgICAgICAgICAgICAgIGJhY2tObyArPSAxO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UHJldmlvdXNQYWdlKGJhY2tObyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG8ocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRvTm90VHJhY2soKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9kb05vdFRyYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RvTm90VHJhY2sgPSBbQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuQ09QWV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVCwgQ09OU1RBTlRTLkFDVElPTlMuTkVXX01BUCwgQ09OU1RBTlRTLkFDVElPTlMuRkVFREJBQ0ssIENPTlNUQU5UUy5BQ1RJT05TLlNIQVJFX01BUF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9kb05vdFRyYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVHJhY2tlZChwYXRoKSB7XHJcbiAgICAgICAgbGV0IHB0aCA9IHRoaXMuZ2V0UGF0aChwYXRoKTtcclxuICAgICAgICByZXR1cm4gXy5hbnkodGhpcy5kb05vdFRyYWNrLCAocCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXB0aC5zdGFydHNXaXRoKHApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJjb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5cclxuY29uc3QgdG9Cb29sID0gKHZhbCkgPT4ge1xyXG4gICAgbGV0IHJldCA9IGZhbHNlO1xyXG4gICAgaWYgKHZhbCA9PT0gdHJ1ZSB8fCB2YWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgcmV0ID0gdmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoXy5jb250YWlucyhbJ3RydWUnLCAneWVzJywgJzEnXSwgdmFsICsgJycudG9Mb3dlckNhc2UoKS50cmltKCkpKSB7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxufVxyXG5cclxuY2xhc3MgU2hhcmluZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IodXNlcikge1xyXG4gICAgICAgIHRoaXMudXNlciA9IHVzZXJcclxuICAgICAgICB0aGlzLl9tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpXHJcbiAgICAgICAgdGhpcy5fZmIgPSB0aGlzLl9tZXRhTWFwLk1ldGFGaXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFNoYXJlKG1hcCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XHJcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmIuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICByZWFkOiB0b0Jvb2wob3B0cy5yZWFkKSxcclxuICAgICAgICAgICAgICAgIHdyaXRlOiB0b0Jvb2wob3B0cy53cml0ZSksXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBvcHRzLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBwaWN0dXJlOiBvcHRzLnBpY3R1cmVcclxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHNoYXJlZCBhIG1hcCwgJHttYXAubmFtZX0sIHdpdGggeW91IWAsXHJcbiAgICAgICAgICAgICAgICBtYXBJZDogbWFwLmlkLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQ09OU1RBTlRTLk5PVElGSUNBVElPTi5NQVAsXHJcbiAgICAgICAgICAgICAgICB0aW1lOiBgJHtuZXcgRGF0ZSgpfWBcclxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdCh1c2VyRGF0YS5pZCl9YClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlU2hhcmUobWFwLCB1c2VyRGF0YSkge1xyXG4gICAgICAgIGlmIChtYXAgJiYgbWFwLmlkICYmIHVzZXJEYXRhICYmIHVzZXJEYXRhLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZiLnB1c2hEYXRhKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBgJHt0aGlzLnVzZXIuZGlzcGxheU5hbWV9IHJlbW92ZWQgYSBtYXAsICR7bWFwLm5hbWV9LCB0aGF0IHdhcyBwcmV2aW91c2x5IHNoYXJlZC5gLFxyXG4gICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKX1gXHJcbiAgICAgICAgICAgIH0sIGAke0NPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQodXNlckRhdGEuaWQpfWApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVkaXRTaGFyZShtYXBJZCwgdXNlckRhdGEsIG9wdHMgPSB7IHJlYWQ6IHRydWUsIHdyaXRlOiBmYWxzZSB9KSB7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFyaW5nIiwiY29uc3QgQXV0aDBMb2NrID0gcmVxdWlyZSgnYXV0aDAtbG9jaycpXG5jb25zdCBsb2NhbGZvcmFnZSA9IHJlcXVpcmUoJ2xvY2FsZm9yYWdlJylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJylcblxuY2xhc3MgQXV0aDAge1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnLCBtZXRhTWFwKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLm1ldGFNYXAgPSBtZXRhTWFwO1xuICAgICAgICB0aGlzLmxvY2sgPSBuZXcgQXV0aDBMb2NrKGNvbmZpZy5hcGksIGNvbmZpZy5hcHApO1xuICAgICAgICB0aGlzLmxvY2sub24oJ2xvYWRpbmcgcmVhZHknLCAoLi4uZSkgPT4ge1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ2luKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvZ2luKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dpbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2hvd0xvZ2luID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpbkFmdGVyU2lnbnVwOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnb3BlbmlkIG9mZmxpbmVfYWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBwcm9maWxlLCBpZF90b2tlbiwgY3Rva2VuLCBvcHQsIHJlZnJlc2hfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbChlcnIsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gcHJvZmlsZS5jdG9rZW4gPSBjdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnY3Rva2VuJywgdGhpcy5jdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIHRoaXMuaWRfdG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgdGhpcy5wcm9maWxlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaF90b2tlbiA9IHByb2ZpbGUucmVmcmVzaF90b2tlbiA9IHJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdldFNlc3Npb24oKS50aGVuKChwcm9maWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dMb2dpbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ2luO1xuICAgIH1cblxuICAgIGxpbmtBY2NvdW50KCkge1xuICAgICAgICB0aGlzLmxvY2suc2hvdyh7XG4gICAgICAgICAgICBjYWxsYmFja1VSTDogbG9jYXRpb24uaHJlZi5yZXBsYWNlKGxvY2F0aW9uLmhhc2gsICcnKSxcbiAgICAgICAgICAgIGRpY3Q6IHtcbiAgICAgICAgICAgICAgICBzaWduaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMaW5rIHdpdGggYW5vdGhlciBhY2NvdW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLmN0b2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkZhaWwoZXJyLCByZWplY3QpIHtcbiAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKGVycik7XG4gICAgICAgIGlmIChyZWplY3QpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNlc3Npb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVsZmlsbCh0aGlzLnByb2ZpbGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuX2dldFNlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2lkX3Rva2VuJykudGhlbigoaWRfdG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NrLmdldFByb2ZpbGUoaWRfdG9rZW4sIChlcnIsIHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdpZF90b2tlbicsIGlkX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgncHJvZmlsZScsIHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdjdG9rZW4nKS50aGVuKCh0b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBwcm9maWxlLmlkX3Rva2VuID0gaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxmaWxsKHByb2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ05vIHNlc3Npb24nKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRTZXNzaW9uO1xuICAgIH1cblxuICAgIGxvZ291dCgpIHtcbiAgICAgICAgbG9jYWxmb3JhZ2UucmVtb3ZlSXRlbSgnaWRfdG9rZW4nKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdwcm9maWxlJyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaWRfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2dldFNlc3Npb24gPSBudWxsO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwO1xuXG5cbiIsImNvbnN0IHV1aWQgPSByZXF1aXJlKCcuLi90b29scy91dWlkLmpzJyk7XHJcbmNvbnN0IENvbW1vbiA9IHJlcXVpcmUoJy4uL3Rvb2xzL0NvbW1vbicpO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJylcclxuXHJcbmNsYXNzIFVzZXIge1xyXG4gICAgY29uc3RydWN0b3IocHJvZmlsZSwgYXV0aCwgZXZlbnRlciwgbWV0YUZpcmUpIHtcclxuICAgICAgICB0aGlzLmF1dGggPSBhdXRoO1xyXG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XHJcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xyXG4gICAgICAgIHRoaXMudXNlcktleSA9IHV1aWQoKTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcclxuICAgICAgICAgICAgbGV0IHRyYWNrSGlzdG9yeSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZXZlcnkoJ2hpc3RvcnknLCAocGFnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpc3RvcnkubGVuZ3RoID09IDAgfHwgcGFnZSAhPSB0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEodGhpcy5oaXN0b3J5LCBgdXNlcnMvJHt0aGlzLmF1dGgudWlkfS9oaXN0b3J5YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5vbihgdXNlcnMvJHt0aGlzLmF1dGgudWlkfWAsICh1c2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5oaXN0b3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlci5oaXN0b3J5ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSB1c2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2tIaXN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX2lkZW50aXR5KCkge1xyXG4gICAgICAgIGxldCByZXQgPSB7fTtcclxuICAgICAgICBpZiAodGhpcy5wcm9maWxlICYmIHRoaXMucHJvZmlsZS5pZGVudGl0eSkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb2ZpbGUuaWRlbnRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNyZWF0ZWRPbigpIHtcclxuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9jcmVhdGVkT24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkdCA9IG5ldyBEYXRlKHRoaXMuX2lkZW50aXR5LmNyZWF0ZWRfYXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlZE9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGR0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiBDb21tb24uZ2V0VGlja3NGcm9tRGF0ZShkdClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlZE9uIHx8IHsgZGF0ZTogbnVsbCwgdGlja3M6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuZnVsbE5hbWU7XHJcbiAgICAgICAgaWYgKHJldCkge1xyXG4gICAgICAgICAgICByZXQgPSByZXQuc3BsaXQoJyAnKVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFyZXQgJiYgdGhpcy5faWRlbnRpdHkubmlja25hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmlja25hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBmdWxsTmFtZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZW1haWwoKSB7XHJcbiAgICAgICAgbGV0IHJldCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5lbWFpbCkge1xyXG4gICAgICAgICAgICByZXQgPSB0aGlzLl9pZGVudGl0eS5lbWFpbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcGljdHVyZSgpIHtcclxuICAgICAgICBsZXQgcmV0ID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnBpY3R1cmUpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucGljdHVyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXNlcklkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGgudWlkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0FkbWluKCkge1xyXG4gICAgICAgIGxldCByZXQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucm9sZXMpIHtcclxuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkucm9sZXMuYWRtaW4gPT0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhpc3RvcnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZmlsZS5oaXN0b3J5IHx8IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVVc2VyRWRpdG9yT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgICAgIGVkaXRvcl9vcHRpb25zOiBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyOyIsImNvbnN0IGpzUGx1bWIgPSB3aW5kb3cuanNQbHVtYjtcclxuY29uc3QganNQbHVtYlRvb2xraXQgPSB3aW5kb3cuanNQbHVtYlRvb2xraXQ7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxuY29uc3QgUGVybWlzc2lvbnMgPSByZXF1aXJlKCcuLi9hcHAvUGVybWlzc2lvbnMnKVxyXG5cclxucmVxdWlyZSgnLi9sYXlvdXQnKVxyXG5cclxuY2xhc3MgQ2FudmFzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtYXAsIG1hcElkKSB7XHJcbiAgICAgICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICAgICAgdGhpcy5tYXBJZCA9IG1hcElkO1xyXG4gICAgICAgIHRoaXMudG9vbGtpdCA9IHt9O1xyXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxyXG4gICAgICAgIGxldCBwZXJtaXNzaW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIGxldCByZWFkeSA9IHRoaXMubWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcElkfWApLnRoZW4oKG1hcEluZm8pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvID0gbWFwSW5mb1xyXG4gICAgICAgICAgICBwZXJtaXNzaW9ucyA9IG5ldyBQZXJtaXNzaW9ucyhtYXBJbmZvKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgY29uc3QgdGhyb3R0bGVTYXZlID0gXy50aHJvdHRsZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwZXJtaXNzaW9ucy5jYW5FZGl0KCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB3aW5kb3cudG9vbGtpdC5leHBvcnREYXRhKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZF9ieToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YUluVHJhbnNhY3Rpb24ocG9zdERhdGEsIGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhTWFwLkludGVncmF0aW9ucy5zZW5kRXZlbnQodGhpcy5tYXBJZCwgJ2V2ZW50JywgJ2F1dG9zYXZlJywgJ2F1dG9zYXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgIHJlYWR5LnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29ybmVyXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGEgbmV3IGluc3RhbmNlIG9mIHRoZSBUb29sa2l0LiBwcm92aWRlIGEgc2V0IG9mIG1ldGhvZHMgdGhhdCBjb250cm9sIHdobyBjYW4gY29ubmVjdCB0byB3aGF0LCBhbmQgd2hlbi5cclxuICAgICAgICAgICAgICAgIHZhciB0b29sa2l0ID0gd2luZG93LnRvb2xraXQgPSBqc1BsdW1iVG9vbGtpdC5uZXdJbnN0YW5jZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlU3RhcnRDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCBlZGdlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29ybmVyID0gZWRnZVR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGVkZ2VUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZUNvbm5lY3Q6ZnVuY3Rpb24oZnJvbU5vZGUsIHRvTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9QcmV2ZW50IHNlbGYtcmVmZXJlbmNpbmcgY29ubmVjdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZnJvbU5vZGUgPT0gdG9Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQmV0d2VlbiB0aGUgc2FtZSB0d28gbm9kZXMsIG9ubHkgb25lIHBlcnNwZWN0aXZlIGNvbm5lY3Rpb24gbWF5IGV4aXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goY3VycmVudENvcm5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BlcnNwZWN0aXZlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gZnJvbU5vZGUuZ2V0RWRnZXMoeyBmaWx0ZXI6IGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuZGF0YS50eXBlID09ICdwZXJzcGVjdGl2ZScgfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZCA9IGVkZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoKGVkLnNvdXJjZSA9PSBmcm9tTm9kZSAmJiBlZC50YXJnZXQgPT0gdG9Ob2RlKSB8fCAoZWQudGFyZ2V0ID09IGZyb21Ob2RlICYmIGVkLnNvdXJjZSA9PSB0b05vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gZHVtbXkgZm9yIGEgbmV3IG5vZGUuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgdmFyIF9uZXdOb2RlID0gZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9dHlwZXx8XCJpZGVhXCJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3OjUwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoOjUwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDpcImlkZWFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFBvc2l0aW9uOiBbXVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGR1bW15IGZvciBhIG5ldyBwcm94eSAoZHJhZyBoYW5kbGUpXHJcbiAgICAgICAgICAgICAgICB2YXIgX25ld1Byb3h5ID0gZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8ICdwcm94eVBlcnNwZWN0aXZlJ1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHc6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6dHlwZVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBtYWluRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanRrLWRlbW8tbWFpblwiKSxcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXNFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5qdGstZGVtby1jYW52YXNcIik7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vV2hlbmV2ZXIgY2hhbmdpbmcgdGhlIHNlbGVjdGlvbiwgY2xlYXIgd2hhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgdmFyIGNsZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnNldFNlbGVjdGlvbihvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb25maWd1cmUgdGhlIHJlbmRlcmVyXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSB0b29sa2l0LnJlbmRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBjYW52YXNFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzRHJhZ2dhYmxlOiBwZXJtaXNzaW9ucy5jYW5FZGl0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlUGFuQnV0dG9uczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3VzdG9tIGxheW91dCBmb3IgdGhpcyBhcHAuIHNpbXBsZSBleHRlbnNpb24gb2YgdGhlIHNwcmluZyBsYXlvdXQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJtZXRhbWFwXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBob3cgeW91IGNhbiBhc3NvY2lhdGUgZ3JvdXBzIG9mIG5vZGVzLiBIZXJlLCBiZWNhdXNlIG9mIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdheSBJIGhhdmUgcmVwcmVzZW50ZWQgdGhlIHJlbGF0aW9uc2hpcCBpbiB0aGUgZGF0YSwgd2UgZWl0aGVyIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgcGFydCdzIFwicGFyZW50XCIgYXMgdGhlIHBvc3NlLCBvciBpZiBpdCBpcyBub3QgYSBwYXJ0IHRoZW4gd2VcclxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gdGhlIG5vZGUncyBpZC4gVGhlcmUgYXJlIGFkZFRvUG9zc2UgYW5kIHJlbW92ZUZyb21Qb3NzZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ldGhvZHMgdG9vIChvbiB0aGUgcmVuZGVyZXIsIG5vdCB0aGUgdG9vbGtpdCk7IHRoZXNlIGNhbiBiZSB1c2VkXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0cmFuc2ZlcnJpbmcgYSBwYXJ0IGZyb20gb25lIHBhcmVudCB0byBhbm90aGVyLlxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnblBvc3NlOmZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZGF0YS5wYXJlbnQgPyB7IHBvc3NlOm5vZGUuZGF0YS5wYXJlbnQsIGFjdGl2ZTpmYWxzZSB9IDogbm9kZS5pZDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHpvb21Ub0ZpdDpmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB2aWV3OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXM6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcDogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihvYmoubm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW91c2VlbnRlcjogZnVuY3Rpb24ob2JqKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsTm9kZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlYToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJkZWZhdWx0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInItdGhpbmdcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJpZGVhXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTpcInRtcGxEcmFnUHJveHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JzOiBbJ0NvbnRpbnVvdXMnLCAnQ2VudGVyJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVBlcnNwZWN0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcInByb3h5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm94eVJlbGF0aW9uc2hpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJwcm94eVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYmxjbGljazogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL29iai5ub2RlLmRhdGEudHlwZSA9ICdyLXRoaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmoubm9kZS5zZXRUeXBlKCdyLXRoaW5nJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVXBkYXRpbmcgdGhlIG5vZGUgdHlwZSBkb2VzIG5vdCBzZWVtIHRvIHN0aWNrOyBpbnN0ZWFkLCBjcmVhdGUgYSBuZXcgbm9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQgPSByZW5kZXJlci5tYXBFdmVudExvY2F0aW9uKG9iai5lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gb2JqLm5vZGUuZ2V0RWRnZXMoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQudyA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLncgKiAwLjY2NztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQuaCA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLmggKiAwLjY2NztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShqc1BsdW1iLmV4dGVuZChfbmV3Tm9kZShcInItdGhpbmdcIiksIGQpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JlLWNyZWF0ZSB0aGUgZWRnZSBjb25uZWN0aW9ucyBvbiB0aGUgbmV3IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGVkZ2VzLmxlbmd0aDsgaSs9MSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVkZ2VzW2ldLnNvdXJjZSA9PSBvYmoubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpuZXdOb2RlLCB0YXJnZXQ6ZWRnZXNbaV0udGFyZ2V0LCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGVkZ2VzW2ldLnRhcmdldCA9PSBvYmoubm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTplZGdlc1tpXS5zb3VyY2UsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgdGhlIHByb3h5IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlTm9kZShvYmoubm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXA6IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9iai5lLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT0gJ3JlbGF0aW9uc2hpcC1vdmVybGF5JyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKG9iai5lZGdlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JzOltcIkNvbnRpbnVvdXNcIixcIkNvbnRpbnVvdXNcIl0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3I6W1wiU3RhdGVNYWNoaW5lXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxLjAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJ2aW5lc3M6MTVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXJlbGF0aW9uc2hpcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheXM6W1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIFwiUGxhaW5BcnJvd1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjoxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6MTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcInJlbGF0aW9uc2hpcC1vdmVybGF5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBQcm94eTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXJlbGF0aW9uc2hpcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRzOlsgXCJCbGFua1wiLCBbIFwiRG90XCIsIHsgcmFkaXVzOjUsIGNzc0NsYXNzOlwib3JhbmdlXCIgfV1dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlUHJveHk6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1wZXJzcGVjdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czoxLCBjc3NDbGFzczpcIm9yYW5nZV9wcm94eVwiIH1dXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiY29ubmVjdG9yXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNEYmxDbGljazpmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYW4gSWRlYSBub2RlIGF0IHRoZSBsb2NhdGlvbiBhdCB3aGljaCB0aGUgZXZlbnQgb2NjdXJyZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gcmVuZGVyZXIubWFwRXZlbnRMb2NhdGlvbihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTW92ZSAxLzIgdGhlIGhlaWdodCBhbmQgd2lkdGggdXAgYW5kIHRvIHRoZSBsZWZ0IHRvIGNlbnRlciB0aGUgbm9kZSBvbiB0aGUgbW91c2UgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogd2hlbiBoZWlnaHQvd2lkdGggaXMgY29uZmlndXJhYmxlLCByZW1vdmUgaGFyZC1jb2RlZCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy5sZWZ0ID0gcG9zLmxlZnQtNTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy50b3AgPSBwb3MudG9wLTUwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoanNQbHVtYi5leHRlbmQoX25ld05vZGUoKSwgcG9zKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVBZGRlZDpfcmVnaXN0ZXJIYW5kbGVycywgLy8gc2VlIGJlbG93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VBZGRlZDogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWxheW91dDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3ZhcmlvdXMgZHJhZy9kcm9wIGhhbmRsZXIgZXZlbnQgZXhwZXJpbWVudHMgbGl2ZWQgaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cdFx0XHRcdFx0XHRub2RlRHJvcHBlZDpmdW5jdGlvbihwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSBwYXJhbXMudGFyZ2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gcGFyYW1zLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNvdXJjZUlkID0gcGFyYW1zLnNvdXJjZS5kYXRhLmlkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SWQgPSBwYXJhbXMudGFyZ2V0LmRhdGEuaWRcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZSBzb3VyY2Ugd2FzIHByZXZpb3VzbHkgYSBjaGlsZCBvZiBhbnkgcGFyZW50LCBkaXNhc3NvY2lhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuZGF0YS5wYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2xkUGFyZW50ID0gdG9vbGtpdC5nZXROb2RlKHNvdXJjZS5kYXRhLnBhcmVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2xkUGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFBhcmVudC5kYXRhLmNoaWxkcmVuID0gXy5yZW1vdmUob2xkUGFyZW50LmRhdGEuY2hpbGRyZW4sIChpZCkgPT4geyByZXR1cm4gaWQgPT0gc291cmNlSWQgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC51cGRhdGVOb2RlKG9sZFBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQXNzaWduIHRoZSBzb3VyY2UgdG8gdGhlIG5ldyBwYXJlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5kYXRhLmNoaWxkcmVuID0gdGFyZ2V0LmRhdGEuY2hpbGRyZW4gfHwgW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5kYXRhLmNoaWxkcmVuLnB1c2goc291cmNlLmRhdGEuaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnVwZGF0ZU5vZGUodGFyZ2V0KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVXBkYXRlIHRoZSBzb3VyY2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZS5kYXRhLnBhcmVudCA9IHRhcmdldElkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UuZGF0YS5oID0gdGFyZ2V0LmRhdGEuaCAqIDAuNjY3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UuZGF0YS53ID0gdGFyZ2V0LmRhdGEudyAqIDAuNjY3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2UuZGF0YS5vcmRlciA9IHRhcmdldC5jaGlsZHJlbi5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQudXBkYXRlTm9kZShzb3VyY2UpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIucmVmcmVzaCgpXHJcblx0XHRcdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cdFx0XHRcdFx0ZWxlbWVudHNEcm9wcGFibGU6dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBkcmFnT3B0aW9uczp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjpcIi5zZWdtZW50XCIsICAgICAgIC8vIGNhbid0IGRyYWcgbm9kZXMgYnkgdGhlIGNvbG9yIHNlZ21lbnRzLlxyXG5cdFx0XHRcdFx0XHRzdG9wOmZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHdoZW4gX2FueV8gbm9kZSBzdG9wcyBkcmFnZ2luZywgcnVuIHRoZSBsYXlvdXQgYWdhaW4uXHJcblx0XHRcdFx0XHRcdFx0Ly8gdGhpcyB3aWxsIGNhdXNlIGNoaWxkIG5vZGVzIHRvIHNuYXAgdG8gdGhlaXIgbmV3IHBhcmVudCwgYW5kIGFsc29cclxuXHRcdFx0XHRcdFx0XHQvLyBjbGVhbnVwIG5pY2VseSBpZiBhIG5vZGUgaXMgZHJvcHBlZCBvbiBhbm90aGVyIG5vZGUuXHJcblx0XHRcdFx0XHRcdFx0cmVuZGVyZXIucmVmcmVzaCgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWxvZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5pbml0aWFsaXplKHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBcIi5kbGdcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLyBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4gICAgICAgICAgICAvLyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyAgICBNb3VzZSBoYW5kbGVycy4gU29tZSBhcmUgd2lyZWQgdXA7IGFsbCBsb2cgdGhlIGN1cnJlbnQgbm9kZSBkYXRhIHRvIHRoZSBjb25zb2xlLlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBfdHlwZXMgPSBbIFwicmVkXCIsIFwib3JhbmdlXCIsIFwiZ3JlZW5cIiwgXCJibHVlXCIsIFwidGV4dFwiIF07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNsaWNrTG9nZ2VyID0gZnVuY3Rpb24odHlwZSwgZXZlbnQsIGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQgKyAnICcgKyB0eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50ID09ICdkYmxjbGljaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgX2NsaWNrSGFuZGxlcnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdSJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyZWVuOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignRycsICdjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdPJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdCJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdUJywgJ2NsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRibGNsaWNrOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignUicsICdkYmxjbGljaycsIGVsLCBub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5hZGROb2RlKF9uZXdOb2RlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmVlbjpmdW5jdGlvbihlbCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0cnLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9IG5vZGUuZGF0YS53ICogMC42Njc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3SGVpZ2h0ID0gbm9kZS5kYXRhLmggKiAwLjY2NztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4gPSBub2RlLmRhdGEuY2hpbGRyZW4gfHwgW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3TGFiZWwgPSAnUGFydCc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDpub2RlLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHc6bmV3V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaDpuZXdIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IG5ld0xhYmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBub2RlLmRhdGEuY2hpbGRyZW4ubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmNoaWxkcmVuLnB1c2gobmV3Tm9kZS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5yZWxheW91dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmFuZ2U6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdPJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVBlcnNwZWN0aXZlJykpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOm5vZGUsIHRhcmdldDpwcm94eU5vZGUsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwZXJzcGVjdGl2ZVByb3h5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOnByb3h5Tm9kZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJwZXJzcGVjdGl2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdCJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3Tm9kZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm94eU5vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld1Byb3h5KCdwcm94eVJlbGF0aW9uc2hpcCcpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpub2RlLCB0YXJnZXQ6cHJveHlOb2RlLCBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwUHJveHlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6cHJveHlOb2RlLCB0YXJnZXQ6bmV3Tm9kZSwgZGF0YTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ZnVuY3Rpb24oZWwsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdUJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLm5hbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImRsZ1RleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbnRlciBsYWJlbDpcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9LOiBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnVwZGF0ZU5vZGUobm9kZSwgeyBsYWJlbDpkLnRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpub2RlLmRhdGEubGFiZWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIF9jdXJyeUhhbmRsZXIgPSBmdW5jdGlvbihlbCwgc2VnbWVudCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLlwiICsgc2VnbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYi5vbihfZWwsIFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2xpY2tIYW5kbGVyc1tcImNsaWNrXCJdW3NlZ21lbnRdKGVsLCBub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKF9lbCwgXCJkYmxjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jbGlja0hhbmRsZXJzW1wiZGJsY2xpY2tcIl1bc2VnbWVudF0oZWwsIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0dXAgdGhlIGNsaWNraW5nIGFjdGlvbnMgYW5kIHRoZSBsYWJlbCBkcmFnLiBGb3IgdGhlIGRyYWcgd2UgY3JlYXRlIGFuXHJcbiAgICAgICAgICAgICAgICAvLyBpbnN0YW5jZSBvZiBqc1BsdW1iIGZvciBub3Qgb3RoZXIgcHVycG9zZSB0aGFuIHRvIG1hbmFnZSB0aGUgZHJhZ2dpbmcgb2ZcclxuICAgICAgICAgICAgICAgIC8vIGxhYmVscy4gV2hlbiBhIGRyYWcgc3RhcnRzIHdlIHNldCB0aGUgem9vbSBvbiB0aGF0IGpzUGx1bWIgaW5zdGFuY2UgdG9cclxuICAgICAgICAgICAgICAgIC8vIG1hdGNoIG91ciBjdXJyZW50IHpvb20uXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsRHJhZ0hhbmRsZXIgPSBqc1BsdW1iLmdldEluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBfcmVnaXN0ZXJIYW5kbGVycyhwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBoZXJlIHlvdSBoYXZlIHBhcmFtcy5lbCwgdGhlIERPTSBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHBhcmFtcy5ub2RlLCB0aGUgdW5kZXJseWluZyBub2RlLiBpdCBoYXMgYSBgZGF0YWAgbWVtYmVyIHdpdGggdGhlIG5vZGUncyBwYXlsb2FkLlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHBhcmFtcy5lbCwgbm9kZSA9IHBhcmFtcy5ub2RlLCBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY3VycnlIYW5kbGVyKGVsLCBfdHlwZXNbaV0sIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgbGFiZWwgZHJhZ2dhYmxlIChzZWUgbm90ZSBhYm92ZSkuXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxEcmFnSGFuZGxlci5kcmFnZ2FibGUobGFiZWwsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRHJhZ0hhbmRsZXIuc2V0Wm9vbShyZW5kZXJlci5nZXRab29tKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmxhYmVsUG9zaXRpb24gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQobGFiZWwuc3R5bGUubGVmdCwgMTApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLnRvcCwgMTApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZVNhdmUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIGxhYmVsIGVkaXRhYmxlIHZpYSBhIGRpYWxvZ1xyXG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24obGFiZWwsIFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqc1BsdW1iVG9vbGtpdC5EaWFsb2dzLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZGxnVGV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRW50ZXIgbGFiZWw6XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk9LOiBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQudXBkYXRlTm9kZShub2RlLCB7IGxhYmVsOiBkLnRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IG5vZGUuZGF0YS5sYWJlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogc2hvd3MgaW5mbyBpbiB3aW5kb3cgb24gYm90dG9tIHJpZ2h0LlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIF9pbmZvKHRleHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGxvYWQgdGhlIGRhdGEuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5tYXAgJiYgdGhhdC5tYXAuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQubG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGhhdC5tYXAuZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAvLyBhIGNvdXBsZSBvZiByYW5kb20gZXhhbXBsZXMgb2YgdGhlIGZpbHRlciBmdW5jdGlvbiwgYWxsb3dpbmcgeW91IHRvIHF1ZXJ5IHlvdXIgZGF0YVxyXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjb3VudEVkZ2VzT2ZUeXBlID0gZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b29sa2l0LmZpbHRlcihmdW5jdGlvbihvYmopIHsgcmV0dXJuIG9iai5vYmplY3RUeXBlID09IFwiRWRnZVwiICYmIG9iai5kYXRhLnR5cGU9PT10eXBlOyB9KS5nZXRFZGdlQ291bnQoKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciBkdW1wRWRnZUNvdW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYXJlIFwiICsgY291bnRFZGdlc09mVHlwZShcInJlbGF0aW9uc2hpcFwiKSArIFwiIHJlbGF0aW9uc2hpcCBlZGdlc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFyZSBcIiArIGNvdW50RWRnZXNPZlR5cGUoXCJwZXJzcGVjdGl2ZVwiKSArIFwiIHBlcnNwZWN0aXZlIGVkZ2VzXCIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB0b29sa2l0LmJpbmQoXCJkYXRhVXBkYXRlZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBkdW1wRWRnZUNvdW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm90dGxlU2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKFwicmVsYXRpb25zaGlwRWRnZUR1bXBcIiwgXCJjbGlja1wiLCBkdW1wRWRnZUNvdW50cygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0NUUkwgKyBjbGljayBlbmFibGVzIHRoZSBsYXNzb1xyXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihkb2N1bWVudCwgJ21vdXNlZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBkZWxldGVBbGwgPSBmdW5jdGlvbihzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogaW1wbGVtZW50IGxvZ2ljIHRvIGRlbGV0ZSB3aG9sZSBlZGdlK3Byb3h5K2VkZ2Ugc3RydWN0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaEVkZ2UoZnVuY3Rpb24oaSxlKSB7IGNvbnNvbGUubG9nKGUpIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL1JlY3Vyc2Ugb3ZlciBhbGwgY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5lYWNoTm9kZShmdW5jdGlvbihpLG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlY3Vyc2UgPSBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihub2RlICYmIG5vZGUuZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPG5vZGUuZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrPTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gdG9vbGtpdC5nZXROb2RlKG5vZGUuZGF0YS5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRGVsZXRlIGNoaWxkcmVuIGJlZm9yZSBwYXJlbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnJlbW92ZU5vZGUobm9kZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWN1cnNlKG4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlKHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbW9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAvL21hcCBiYWNrc3BhY2UgdG8gZGVsZXRlIGlmIGFueXRoaW5nIGlzIHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5dXAnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGUgPSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdG9vbGtpdC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDY6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVBbGwoc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlID0gJ3NlbGVjdCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldE1vZGUoJ3NlbGVjdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQ2OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHRvb2xraXQuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQWxsKHNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcclxuIiwiLyoqXHJcbiogQ3VzdG9tIGxheW91dCBmb3IgbWV0YW1hcC4gRXh0ZW5kcyB0aGUgU3ByaW5nIGxheW91dC4gQWZ0ZXIgU3ByaW5nIHJ1bnMsIHRoaXNcclxuKiBsYXlvdXQgZmluZHMgJ3BhcnQnIG5vZGVzIGFuZCBhbGlnbnMgdGhlbSB1bmRlcm5lYXRoIHRoZWlyIHBhcmVudHMuIFRoZSBhbGlnbm1lbnRcclxuKiAtIGxlZnQgb3IgcmlnaHQgLSBpcyBzZXQgaW4gdGhlIHBhcmVudCBub2RlJ3MgZGF0YSwgYXMgYHBhcnRBbGlnbmAuXHJcbipcclxuKiBMYXlvdXQgY2FuIGJlIHN1c3BlbmRlZCBvbiBhIHBlci1ub2RlIGJhc2lzIGJ5IHNldHRpbmcgYHN1c3BlbmRMYXlvdXRgIGluIHRoZSBOb2RlJ3NcclxuKiBkYXRhLlxyXG4qXHJcbiogQ2hpbGQgbm9kZXNcclxuKi9cclxuOyhmdW5jdGlvbigpIHtcclxuXHJcblx0ZnVuY3Rpb24gY2hpbGROb2RlQ29tcGFyYXRvcihjMSwgYzIpIHtcclxuXHRcdGlmIChjMi5kYXRhLm9yZGVyID09IG51bGwpIHJldHVybiAtMTtcclxuXHRcdGlmIChjMS5kYXRhLm9yZGVyID09IG51bGwpIHJldHVybiAxO1xyXG5cdFx0cmV0dXJuIGMxLmRhdGEub3JkZXIgPCBjMi5kYXRhLm9yZGVyID8gLTEgOiAxO1xyXG5cdH1cclxuXHJcbiAganNQbHVtYlRvb2xraXQuTGF5b3V0c1tcIm1ldGFtYXBcIl0gPSBmdW5jdGlvbigpIHtcclxuICAgIGpzUGx1bWJUb29sa2l0LkxheW91dHMuU3ByaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdmFyIF9vbmVTZXQgPSBmdW5jdGlvbihwYXJlbnQsIHBhcmFtcywgdG9vbGtpdCkge1xyXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgIHZhciBwYWRkaW5nID0gcGFyYW1zLnBhcnRQYWRkaW5nIHx8IDU7XHJcbiAgICAgIGlmIChwYXJlbnQuZGF0YS5jaGlsZHJlbiAmJiBwYXJlbnQuZGF0YS5zdXNwZW5kTGF5b3V0ICE9PSB0cnVlKSB7XHJcblxyXG4gICAgICAgIHZhciBjID0gcGFyZW50LmRhdGEuY2hpbGRyZW4sXHJcblx0XHQgIFx0Y2hpbGROb2RlcyA9IF8ubWFwKCBjLCB0b29sa2l0LmdldE5vZGUgKSxcclxuICAgICAgICAgICAgcGFyZW50UG9zID0gdGhpcy5nZXRQb3NpdGlvbihwYXJlbnQuaWQpLFxyXG4gICAgICAgICAgICBwYXJlbnRTaXplID0gdGhpcy5nZXRTaXplKHBhcmVudC5pZCksXHJcbiAgICAgICAgICAgIG1hZ25ldGl6ZU5vZGVzID0gWyBwYXJlbnQuaWQgXSxcclxuICAgICAgICAgICAgYWxpZ24gPSAocGFyZW50LmRhdGEucGFydEFsaWduIHx8IFwicmlnaHRcIikgPT09IFwibGVmdFwiID8gMCA6IDEsXHJcbiAgICAgICAgICAgIHkgPSBwYXJlbnRQb3NbMV0gKyBwYXJlbnRTaXplWzFdICsgcGFkZGluZztcclxuXHJcblx0XHQvLyBzb3J0IG5vZGVzXHJcblx0XHRjaGlsZE5vZGVzLnNvcnQoY2hpbGROb2RlQ29tcGFyYXRvcik7XHJcblx0XHQvLyBhbmQgcnVuIHRocm91Z2ggdGhlbSBhbmQgYXNzaWduIG9yZGVyOyBhbnkgdGhhdCBkaWRuJ3QgcHJldmlvdXNseSBoYXZlIG9yZGVyIHdpbGwgZ2V0IG9yZGVyXHJcblx0XHQvLyBzZXQsIGFuZCBhbnkgdGhhdCBoYWQgb3JkZXIgd2lsbCByZXRhaW4gdGhlIHNhbWUgdmFsdWUuXHJcblx0XHRfLmVhY2goY2hpbGROb2RlcywgZnVuY3Rpb24oY24sIGkpIHtcclxuXHRcdFx0Y24uZGF0YS5vcmRlciA9IGk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGNuID0gY2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYoY24pIHtcclxuICAgICAgICAgICAgICB2YXIgY2hpbGRTaXplID0gdGhpcy5nZXRTaXplKGNuLmlkKSxcclxuICAgICAgICAgICAgICAgICAgeCA9IHBhcmVudFBvc1swXSArIChhbGlnbiAqIChwYXJlbnRTaXplWzBdIC0gY2hpbGRTaXplWzBdKSk7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb24oY24uaWQsIHgsIHksIHRydWUpO1xyXG4gICAgICAgICAgICAgIG1hZ25ldGl6ZU5vZGVzLnB1c2goY24uaWQpO1xyXG4gICAgICAgICAgICAgIHkgKz0gKGNoaWxkU2l6ZVsxXSArIHBhZGRpbmcpO1xyXG4gICAgICAgICAgICB9XHJcblx0XHR9XHJcblxyXG5cclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpO1xyXG5cclxuICAgIC8vIHN0YXNoIG9yaWdpbmFsIGVuZCBjYWxsYmFjayBhbmQgb3ZlcnJpZGUuIHBsYWNlIGFsbCBQYXJ0IG5vZGVzIHdydCB0aGVpclxyXG4gICAgLy8gcGFyZW50cywgdGhlbiBjYWxsIG9yaWdpbmFsIGVuZCBjYWxsYmFjayBhbmQgZmluYWxseSB0ZWxsIHRoZSBsYXlvdXRcclxuICAgIC8vIHRvIGRyYXcgaXRzZWxmIGFnYWluLlxyXG4gICAgdmFyIF9zdXBlckVuZCA9IHRoaXMuZW5kO1xyXG4gICAgdGhpcy5lbmQgPSBmdW5jdGlvbih0b29sa2l0LCBwYXJhbXMpIHtcclxuICAgICAgdmFyIG5jID0gdG9vbGtpdC5nZXROb2RlQ291bnQoKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYzsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG4gPSB0b29sa2l0LmdldE5vZGVBdChpKTtcclxuICAgICAgICAvLyBvbmx5IHByb2Nlc3Mgbm9kZXMgdGhhdCBhcmUgbm90IFBhcnQgbm9kZXMgKHRoZXJlIGNvdWxkIG9mIGNvdXJzZSBiZVxyXG4gICAgICAgIC8vIGEgbWlsbGlvbiB3YXlzIG9mIGRldGVybWluaW5nIHdoYXQgaXMgYSBQYXJ0IG5vZGUuLi5oZXJlIEkganVzdCB1c2VcclxuICAgICAgICAvLyBhIHJ1ZGltZW50YXJ5IGNvbnN0cnVjdCBpbiB0aGUgZGF0YSlcclxuICAgICAgICBpZiAobi5kYXRhLnBhcmVudCA9PSBudWxsKSB7XHJcbiAgICAgICAgICBfb25lU2V0KG4sIHBhcmFtcywgdG9vbGtpdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBfc3VwZXJFbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG59KSgpO1xyXG4iLCJjb25zdCBBQ1RJT05TID0ge1xyXG4gICAgT1BFTl9NQVA6ICdtYXAnLFxyXG4gICAgT1BFTl9UUkFJTklORzogJ29wZW5fdHJhaW5pbmcnLFxyXG4gICAgTkVXX01BUDogJ25ld19tYXAnLFxyXG4gICAgQ09QWV9NQVA6ICdjb3B5X21hcCcsXHJcbiAgICBERUxFVEVfTUFQOiAnZGVsZXRlX21hcCcsXHJcbiAgICBIT01FOiAnaG9tZScsXHJcbiAgICBNWV9NQVBTOiAnbXltYXBzJyxcclxuICAgIFRFUk1TX0FORF9DT05ESVRJT05TOiAndGVybXMnLFxyXG4gICAgTE9HT1VUOiAnbG9nb3V0JyxcclxuICAgIEZFRURCQUNLOiAnZmVlZGJhY2snLFxyXG4gICAgU0hBUkVfTUFQOiAnc2hhcmVfbWFwJyxcclxuICAgIENPVVJTRV9MSVNUOiAnY291cnNlX2xpc3QnLFxyXG4gICAgVFJBSU5JTkdTOiAndHJhaW5pbmdzJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShBQ1RJT05TKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQUNUSU9OUzsiLCJjb25zdCBDQU5WQVMgPSB7XHJcbiAgICBMRUZUOiAnbGVmdCcsXHJcbiAgICBSSUdIVDogJ3JpZ2h0J1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShDQU5WQVMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDQU5WQVM7IiwiY29uc3QgQ09OU1RBTlRTID0ge1xyXG5cdEFDVElPTlM6IHJlcXVpcmUoJy4vYWN0aW9ucycpLFxyXG5cdENBTlZBUzogcmVxdWlyZSgnLi9jYW52YXMnKSxcclxuXHREU1JQOiByZXF1aXJlKCcuL2RzcnAnKSxcclxuXHRFRElUX1NUQVRVUzogcmVxdWlyZSgnLi9lZGl0U3RhdHVzJyksXHJcblx0RUxFTUVOVFM6IHJlcXVpcmUoJy4vZWxlbWVudHMnKSxcclxuICAgIEVWRU5UUzogcmVxdWlyZSgnLi9ldmVudHMnKSxcclxuICAgIE5PVElGSUNBVElPTjogcmVxdWlyZSgnLi9ub3RpZmljYXRpb24nKSxcclxuXHRQQUdFUzogcmVxdWlyZSgnLi9wYWdlcycpLFxyXG5cdFJPVVRFUzogcmVxdWlyZSgnLi9yb3V0ZXMnKSxcclxuXHRUQUJTOiByZXF1aXJlKCcuL3RhYnMnKSxcclxuXHRUQUdTOiByZXF1aXJlKCcuL3RhZ3MnKVxyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShDT05TVEFOVFMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDT05TVEFOVFM7IiwiY29uc3QgRFNSUCA9IHtcclxuXHREOiAnRCcsXHJcblx0UzogJ1MnLFxyXG5cdFI6ICdSJyxcclxuXHRQOiAnUCdcclxufVxyXG5cclxuT2JqZWN0LmZyZWV6ZShEU1JQKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRFNSUDsiLCJjb25zdCBzdGF0dXMgPSB7XHJcbiAgICBMQVNUX1VQREFURUQ6ICcnLFxyXG4gICAgUkVBRF9PTkxZOiAnVmlldyBvbmx5JyxcclxuICAgIFNBVklORzogJ1NhdmluZy4uLicsXHJcbiAgICBTQVZFX09LOiAnQWxsIGNoYW5nZXMgc2F2ZWQnLFxyXG4gICAgU0FWRV9GQUlMRUQ6ICdDaGFuZ2VzIGNvdWxkIG5vdCBiZSBzYXZlZCdcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoc3RhdHVzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RhdHVzOyIsImNvbnN0IEVMRU1FTlRTID0ge1xyXG4gICAgQVBQX0NPTlRBSU5FUjogJ2FwcC1jb250YWluZXInLFxyXG4gICAgTUVUQV9QUk9HUkVTUzogJ21ldGFfcHJvZ3Jlc3MnLFxyXG4gICAgTUVUQV9QUk9HUkVTU19ORVhUOiAnbWV0YV9wcm9ncmVzc19uZXh0JyxcclxuICAgIE1FVEFfTU9EQUxfRElBTE9HX0NPTlRBSU5FUjogJ21ldGFfbW9kYWxfZGlhbG9nX2NvbnRhaW5lcidcclxufTtcclxuXHJcbk9iamVjdC5mcmVlemUoRUxFTUVOVFMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFTEVNRU5UUzsiLCJjb25zdCBFVkVOVFMgPSB7XHJcblx0U0lERUJBUl9PUEVOOiAnc2lkZWJhci1vcGVuJyxcclxuXHRTSURFQkFSX0NMT1NFOiAnc2lkZWJhci1jbG9zZScsXHJcblx0U0lERUJBUl9UT0dHTEU6ICdzaWRlYmFyLXRvZ2dsZScsXHJcblx0UEFHRV9OQU1FOiAncGFnZU5hbWUnLFxyXG5cdE5BVjogJ25hdicsXHJcblx0TUFQOiAnbWFwJ1xyXG59XHJcblxyXG5PYmplY3QuZnJlZXplKEVWRU5UUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVWRU5UUzsiLCJjb25zdCBOT1RJRklDQVRJT04gPSB7XHJcblx0TUFQOiAnbWFwJ1xyXG59XHJcblxyXG5PYmplY3QuZnJlZXplKE5PVElGSUNBVElPTik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5PVElGSUNBVElPTjsiLCJjb25zdCBBQ1RJT05TID0gcmVxdWlyZSgnLi9hY3Rpb25zLmpzJyk7XHJcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuXHJcbmNvbnN0IFBBR0VTID0ge1xyXG4gICAgTUFQOiAnbWFwJyxcclxuICAgIE5FV19NQVA6ICduZXdfbWFwJyxcclxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxyXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxyXG4gICAgTVlfTUFQUzogJ215bWFwcycsXHJcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ3Rlcm1zJyxcclxuICAgIEhPTUU6ICdob21lJyxcclxuICAgIENPVVJTRV9MSVNUOiAnY291cnNlX2xpc3QnLFxyXG4gICAgVFJBSU5JTkdTOiAndHJhaW5pbmdzJ1xyXG59O1xyXG5cclxuXy5leHRlbmQoKVxyXG5cclxuT2JqZWN0LmZyZWV6ZShQQUdFUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBBR0VTOyIsImNvbnN0IFJPVVRFUyA9IHtcclxuICAgIE1BUFNfTElTVDogJ21hcHMvbGlzdC8nLFxyXG4gICAgTUFQU19EQVRBOiAnbWFwcy9kYXRhLycsXHJcbiAgICBNQVBTX05FV19NQVA6ICdtYXBzL25ldy1tYXAvJyxcclxuICAgIFRFUk1TX0FORF9DT05ESVRJT05TOiAnbWV0YW1hcC90ZXJtcy1hbmQtY29uZGl0aW9ucy8nLFxyXG4gICAgSE9NRTogJ21ldGFtYXAvaG9tZS8nLFxyXG4gICAgTk9USUZJQ0FUSU9OUzogJ3VzZXJzL3swfS9ub3RpZmljYXRpb25zJyxcclxuICAgIFRSQUlOSU5HUzogJ3VzZXJzL3swfS90cmFpbmluZ3MvJyxcclxuICAgIENPVVJTRV9MSVNUOiAndHJhaW5pbmdzL2NvdXJzZXMvJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShST1VURVMpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBST1VURVM7IiwiY29uc3QgVEFCUyA9IHtcclxuICAgIFRBQl9JRF9QUkVTRU5URVIgOiAncHJlc2VudGVyLXRhYicsXHJcbiAgICBUQUJfSURfQU5BTFlUSUNTX01BUCA6ICdhbmFseXRpY3MtdGFiLW1hcCcsXHJcbiAgICBUQUJfSURfQU5BTFlUSUNTX1RISU5HIDogJ2FuYWx5dGljcy10YWItdGhpbmcnLFxyXG4gICAgVEFCX0lEX1BFUlNQRUNUSVZFUyA6ICdwZXJzcGVjdGl2ZXMtdGFiJyxcclxuICAgIFRBQl9JRF9ESVNUSU5DVElPTlMgOiAnZGlzdGluY3Rpb25zLXRhYicsXHJcbiAgICBUQUJfSURfQVRUQUNITUVOVFMgOiAnYXR0YWNobWVudHMtdGFiJyxcclxuICAgIFRBQl9JRF9HRU5FUkFUT1IgOiAnZ2VuZXJhdG9yLXRhYicsXHJcbiAgICBUQUJfSURfU1RBTkRBUkRTIDogJ3N0YW5kYXJkcy10YWInXHJcbn07XHJcbk9iamVjdC5mcmVlemUoVEFCUyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRBQlM7IiwiY29uc3QgVEFHUyA9IHtcclxuICAgIE1FVEFfQ0FOVkFTOiAnbWV0YS1jYW52YXMnLFxyXG4gICAgSE9NRTogJ2hvbWUnLFxyXG4gICAgVEVSTVM6ICd0ZXJtcycsXHJcbiAgICBNWV9NQVBTOiAnbXktbWFwcycsXHJcbiAgICBTSEFSRTogJ3NoYXJlJyxcclxuICAgIENPVVJTRV9MSVNUOiAnY291cnNlX2xpc3QnLFxyXG4gICAgVFJBSU5JTkc6ICd0cmFpbmluZycsXHJcbiAgICBBTExfQ09VUlNFUzogJ2FsbC1jb3Vyc2VzJyxcclxuICAgIE1ZX0NPVVJTRVM6ICdteS1jb3Vyc2VzJyxcclxuICAgIFNJREVCQVI6ICdxdWljay1zaWRlYmFyJ1xyXG59O1xyXG5cclxuT2JqZWN0LmZyZWV6ZShUQUdTKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVEFHUzsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBBZGRUaGlzIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgICAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcclxuICAgICAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxyXG4gICAgICAgICAgICAgICAgdCA9IHdpbmRvdy5hZGR0aGlzIHx8IHt9O1xyXG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTtcclxuICAgICAgICAgICAganMuaWQgPSBpZDtcclxuICAgICAgICAgICAganMuc3JjID0gYC8vczcuYWRkdGhpcy5jb20vanMvMzAwL2FkZHRoaXNfd2lkZ2V0LmpzI3B1YmlkPSR7Y29uZmlnLnB1YmlkfWA7XHJcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuXHJcbiAgICAgICAgICAgIHQuX2UgPSBbXTtcclxuICAgICAgICAgICAgdC5yZWFkeSA9IGZ1bmN0aW9uIChmKSB7XHJcbiAgICAgICAgICAgICAgICB0Ll9lLnB1c2goZik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9IChkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJhZGQtdGhpcy1qc1wiKSk7XHJcbiAgICAgICAgdGhpcy5hZGR0aGlzID0gd2luZG93LmFkZHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLmFkZHRoaXMgPSB0aGlzLmFkZHRoaXMgfHwgd2luZG93LmFkZHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWRkVGhpcztcclxuXHJcblxyXG4iLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBHb29nbGUgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcclxuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xyXG4gICAgfSkoKTtcclxuICAgICAgXHJcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcclxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAnZ3RtLnN0YXJ0JzpcclxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXHJcbiAgICAgIH0pOyBsZXQgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XHJcbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCB0aGlzLmNvbmZpZy50YWdtYW5hZ2VyKTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcclxuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcclxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcclxuICAgIHJldHVybiB0aGlzLmdhO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHN1cGVyLmluaXQoKTtcclxuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xyXG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG4gICAgaWYoZG9tYWluLnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XHJcbiAgICAgIG1vZGUgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdjcmVhdGUnLCB0aGlzLmNvbmZpZy5hbmFseXRpY3MsIG1vZGUpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcigpIHtcclxuICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsICd1c2VySWQnLCB0aGlzLnVzZXIudXNlcklkKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgaWYgKHNvdXJjZSAmJiB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCB2YWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xyXG4gICAgICAgICAgICBwYWdlOiBwYXRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRFdmVudChldmVudCwgc291cmNlLCB0eXBlLCB1cmwpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcclxuXHJcblxyXG4iLCJcclxuY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxyXG5jb25zdCBHb29nbGUgPSByZXF1aXJlKCcuL2dvb2dsZScpO1xyXG5cclxuY2xhc3MgVXNlclNuYXAgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAgICAgbGV0IGFwaUtleSwgcywgeDtcclxuICAgICAgICBpZiAoY29uZmlnID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uZmlnID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFwaUtleSA9IGNvbmZpZy5hcGk7XHJcbiAgICAgICAgaWYgKGFwaUtleSAmJiAhd2luZG93LmxvY2F0aW9uLmhvc3Quc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcclxuICAgICAgICAgICAgbGV0IHVzQ29uZiA9IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsQm94OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWxCb3hWYWx1ZTogdXNlci5lbWFpbCxcclxuICAgICAgICAgICAgICAgIGVtYWlsUmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlUmVjb3JkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcclxuICAgICAgICAgICAgICAgIHNob3J0Y3V0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmVmb3JlT3BlbjogZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIEdvb2dsZS5zZW5kRXZlbnQoJ2ZlZWRiYWNrJywgJ3VzZXJzbmFwJywgJ3dpZGdldCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0gd2luZG93Ll91c2Vyc25hcGNvbmZpZyA9IHVzQ29uZjtcclxuXHJcbiAgICAgICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgIHMuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICBzLnNyYyA9ICcvL2FwaS51c2Vyc25hcC5jb20vbG9hZC8nICsgYXBpS2V5ICsgJy5qcyc7XHJcbiAgICAgICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgICAgICB4LmFwcGVuZENoaWxkKHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gdGhpcy51c2VyU25hcCB8fCB3aW5kb3cuVXNlclNuYXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlclNuYXA7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXNlcigpIHtcclxuICAgICAgICBzdXBlci5zZXRVc2VyKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyU25hcDsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBZb3VUdWJlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XHJcbiAgICBzdXBlcihjb25maWcsIHVzZXIpO1xyXG4gICAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cclxuICAgIHRhZy5zcmMgPSBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGlcIjtcclxuICAgIHZhciBmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgIGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRhZywgZmlyc3RTY3JpcHRUYWcpO1xyXG4gICAgd2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuWVQgPSB3aW5kb3cuWVRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgIHRoaXMuWVQgPSB0aGlzLllUIHx8IHdpbmRvdy5ZVDtcclxuICAgIHJldHVybiB0aGlzLllUO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHN1cGVyLmluaXQoKTtcclxuXHJcbiAgfVxyXG5cclxuICBzZXRVc2VyKCkge1xyXG4gICAgc3VwZXIuc2V0VXNlcigpO1xyXG5cclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xyXG5cclxuICB9XHJcblxyXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBZb3VUdWJlO1xyXG5cclxuXHJcbiIsImNsYXNzIEludGVncmF0aW9uc0Jhc2Uge1xyXG5cdGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xyXG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XHJcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xyXG5cdH1cclxuXHRcclxuXHRpbml0KCkge1xyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdGdldCBpbnRlZ3JhdGlvbigpIHtcclxuXHRcdHJldHVybiB7fTtcclxuXHR9XHJcblx0XHJcblx0c2V0VXNlcigpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRzZW5kRXZlbnQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlUGF0aCgpIHtcclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRsb2dvdXQoKSB7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zQmFzZTsiLCJjb25zdCBJbnRlZ3JhdGlvbnNCYXNlID0gcmVxdWlyZSgnLi9fSW50ZWdyYXRpb25zQmFzZScpXHJcblxyXG5jbGFzcyBHb29nbGUgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcclxuICBjb25zdHJ1Y3Rvcihjb25maWcsIHVzZXIpIHtcclxuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XHJcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcclxuICAgICAgbGV0IHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07IHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocG8sIHMpO1xyXG4gICAgfSkoKTtcclxuICAgICAgXHJcbiAgICAvL0dvb2dsZSBUYWcgTWFuYWdlciBBUElcclxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xyXG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcclxuICAgICAgICAnZ3RtLnN0YXJ0JzpcclxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXHJcbiAgICAgIH0pOyBsZXQgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXHJcbiAgICAgICAgaiA9IGQuY3JlYXRlRWxlbWVudChzKSwgZGwgPSBsICE9ICdkYXRhTGF5ZXInID8gJyZsPScgKyBsIDogJyc7IGouYXN5bmMgPSB0cnVlOyBqLnNyYyA9XHJcbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xyXG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCB0aGlzLmNvbmZpZy50YWdtYW5hZ2VyKTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcclxuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgKGlbcl0ucSA9IGlbcl0ucSB8fCBbXSkucHVzaChhcmd1bWVudHMpO1xyXG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcclxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XHJcbiAgICAgIG0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSwgbSk7XHJcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcclxuICAgIHRoaXMuZ2EgPSB0aGlzLmdhIHx8IHdpbmRvdy5nYTtcclxuICAgIHJldHVybiB0aGlzLmdhO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHN1cGVyLmluaXQoKTtcclxuICAgIGxldCBtb2RlID0gJ2F1dG8nO1xyXG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xyXG4gICAgaWYoZG9tYWluLnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XHJcbiAgICAgIG1vZGUgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgICB0aGlzLmludGVncmF0aW9uKCdjcmVhdGUnLCB0aGlzLmNvbmZpZy5hbmFseXRpY3MsIG1vZGUpO1xyXG4gICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcigpIHtcclxuICAgIHN1cGVyLnNldFVzZXIoKTtcclxuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsICd1c2VySWQnLCB0aGlzLnVzZXIudXNlcklkKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xyXG4gICAgaWYgKHdpbmRvdy5nYSkge1xyXG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcclxuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xyXG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcclxuICAgICAgaWYgKHNvdXJjZSAmJiB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCBzb3VyY2UsIHR5cGUsIHZhbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCB2YWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xyXG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcclxuICAgIGlmICh0aGlzLmludGVncmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xyXG4gICAgICAgICAgICBwYWdlOiBwYXRoXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbmRFdmVudChldmVudCwgc291cmNlLCB0eXBlLCB1cmwpIHtcclxuICAgIGlmICh3aW5kb3cuZ2EpIHtcclxuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcclxuXHJcblxyXG4iLCJjb25zdCByaW90ID0gd2luZG93LnJpb3RcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xyXG5jb25zdCBwYWdlQm9keSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZS1ib2R5LmpzJylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbmNvbnN0IEFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FjdGlvbi5qcycpXHJcbmNvbnN0IE1ldHJvbmljID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvbWV0cm9uaWMnKVxyXG5jb25zdCBMYXlvdXQgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9sYXlvdXQnKVxyXG5jb25zdCBEZW1vID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvZGVtbycpXHJcblxyXG5jbGFzcyBQYWdlRmFjdG9yeSB7XHJcbiAgICBjb25zdHJ1Y3RvcihldmVudGVyLCBtZXRhRmlyZSkge1xyXG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcclxuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xyXG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IG5ldyBBY3Rpb25zKG1ldGFGaXJlLCBldmVudGVyLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblJlYWR5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfUFJPR1JFU1N9YCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KCcqJyk7XHJcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuY29uZmlndXJlKHsgcGFyZW50OiBgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfUFJPR1JFU1NfTkVYVH1gIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLmluaXQoKTsgLy8gaW5pdCBtZXRyb25pYyBjb3JlIGNvbXBvbmV0c1xyXG4gICAgICAgICAgICAgICAgICAgIExheW91dC5pbml0KCk7IC8vIGluaXQgbGF5b3V0XHJcbiAgICAgICAgICAgICAgICAgICAgRGVtby5pbml0KCk7IC8vIGluaXQgZGVtbyBmZWF0dXJlc1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgbmF2aWdhdGUocGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgbGV0IGFjdCA9IHRoaXMuYWN0aW9ucy5hY3QocGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcclxuICAgICAgICBpZiAoIWFjdCkge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50ZXIuZG8ocGF0aCwgcGF0aCwgeyBpZDogaWQsIGFjdGlvbjogYWN0aW9uIH0sIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2VGYWN0b3J5OyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xyXG5jb25zdCBDYW52YXMgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJylcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbnJlcXVpcmUoJy4vbm9kZScpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodCBqdGstZGVtby1tYWluXCIgc3R5bGU9XCJwYWRkaW5nOiAwOyBcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJqdGstZGVtby1jYW52YXMgY2FudmFzLXdpZGVcIiBpZD1cImRpYWdyYW1cIj5cclxuXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtZXRhLWNhbnZhcycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMubWFwSWQgPSBudWxsO1xyXG4gICAgdGhpcy5jYW52YXMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuYnVpbGRDYW52YXMgPSAobWFwKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhbnZhcykge1xyXG4gICAgICAgICAgICAkKHRoaXMuZGlhZ3JhbSkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbmV3IENhbnZhcyhtYXAsIHRoaXMubWFwSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG1hcC5jaGFuZ2VkX2J5ICE9IE1ldGFNYXAuVXNlci51c2VyS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkID0gKG9wdHMpID0+IHtcclxuICAgICAgICBpZiAob3B0cy5pZCAhPSB0aGlzLm1hcElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbnVsbFxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJZCkge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYG1hcHMvZGF0YS8ke3RoaXMubWFwSWR9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG9wdHMuaWQ7XHJcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgbWFwcy9kYXRhLyR7b3B0cy5pZH1gLCB0aGlzLmJ1aWxkQ2FudmFzKTtcclxuICAgICAgICAgICAgTWV0YU1hcC5FdmVudGVyLmZvcmdldChDT05TVEFOVFMuRVZFTlRTLk1BUCwgdGhpcy5idWlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeShDT05TVEFOVFMuRVZFTlRTLk1BUCwgdGhpcy5idWlsZCk7XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0SGVpZ2h0ID0gKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5kaWFncmFtKS5jc3Moe1xyXG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCArICdweCdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBFZGl0b3IgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJyk7XHJcblxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuYFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnbm9kZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKVxyXG5cclxuY29uc3QgTWV0cm9uaWMgPSByZXF1aXJlKCcuLi8uLi90ZW1wbGF0ZS9tZXRyb25pYycpXHJcbmNvbnN0IHJhdyA9IHJlcXVpcmUoJy4vcmF3Jyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgVHJhaW5pbmdNaXggPSByZXF1aXJlKCcuLi9taXhpbnMvdHJhaW5pbmctbWl4JylcclxuXHJcbmNvbnN0IGh0bWwgPVxyXG5cdGBcclxuPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdi1qdXN0aWZpZWRcIj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdi10YWJzIG5hdi1qdXN0aWZpZWRcIj5cclxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjcXVpY2tfc2lkZWJhcl90YWJfMVwiIGRhdGEtdG9nZ2xlPVwidGFiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgQ29ydGV4IE1hblxyXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNxdWlja19zaWRlYmFyX3RhYl8yXCIgZGF0YS10b2dnbGU9XCJ0YWJcIj5cclxuICAgICAgICAgICAgICAgICAgICBPdXRsaW5lXHJcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLXBhbmUgYWN0aXZlIHBhZ2UtcXVpY2stc2lkZWJhci1jaGF0IHBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIiBpZD1cInF1aWNrX3NpZGViYXJfdGFiXzFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnNcIiBkYXRhLXJhaWwtY29sb3I9XCIjZGRkXCIgZGF0YS13cmFwcGVyLWNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjb3J0ZXhfbWVzc2FnZXNcIiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItbWVzc2FnZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGVhY2g9XCJ7IHVzZXJUcmFpbmluZy5tZXNzYWdlcyB9XCIgY2xhc3M9XCJwb3N0IHsgb3V0OiBhdXRob3IgPT0gJ2NvcnRleCcsIGluOiBhdXRob3IgIT0gJ2NvcnRleCcgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGhlaWdodD1cIjM5XCIgd2lkdGg9XCIzOVwiIGNsYXNzPVwiYXZhdGFyXCIgYWx0PVwiXCIgc3JjPVwieyBhdXRob3IgPT0gJ2NvcnRleCcgPyBwYXJlbnQuY29ydGV4UGljdHVyZSA6IHBhcmVudC51c2VyUGljdHVyZSB9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhcnJvd1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cIm5hbWVcIj57IG5hbWUgfTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGF0ZXRpbWVcIj57IHBhcmVudC5nZXRSZWxhdGl2ZVRpbWUodGltZSkgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhdyBjb250ZW50PVwieyBtZXNzYWdlIH1cIj48L3Jhdz4gPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItZm9ybVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiY2hhdF9pbnB1dF9mb3JtXCIgb25zdWJtaXQ9XCJ7IG9uU3VibWl0IH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjaGF0X2lucHV0XCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiVHlwZSBhIG1lc3NhZ2UgaGVyZS4uLlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJsdWVcIj48aSBjbGFzcz1cImZhIGZhLXBhcGVyY2xpcFwiPjwvaT48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWItcGFuZSBwYWdlLXF1aWNrLXNpZGViYXItYWxlcnRzXCIgaWQ9XCJxdWlja19zaWRlYmFyX3RhYl8yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1hbGVydHMtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsaXN0LWhlYWRpbmdcIj5JbnRybzwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cImxpc3QtaGVhZGluZ1wiPlNlY3Rpb24gMTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmBcclxuXHJcbi8vIEhhbmRsZXMgcXVpY2sgc2lkZWJhciB0b2dnbGVyXHJcbnZhciBoYW5kbGVRdWlja1NpZGViYXJUb2dnbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gcXVpY2sgc2lkZWJhciB0b2dnbGVyXHJcbiAgICAkKCcucGFnZS1oZWFkZXIgLnF1aWNrLXNpZGViYXItdG9nZ2xlciwgLnBhZ2UtcXVpY2stc2lkZWJhci10b2dnbGVyJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3BhZ2UtcXVpY2stc2lkZWJhci1vcGVuJyk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8vIEhhbmRsZXMgcXVpY2sgc2lkZWJhciBjaGF0c1xyXG52YXIgaGFuZGxlUXVpY2tTaWRlYmFyQ2hhdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB3cmFwcGVyID0gJCgnLnBhZ2UtcXVpY2stc2lkZWJhci13cmFwcGVyJyk7XHJcbiAgICB2YXIgd3JhcHBlckNoYXQgPSB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdCcpO1xyXG5cclxuICAgIHZhciBpbml0Q2hhdFNsaW1TY3JvbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNoYXRVc2VycyA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJzJyk7XHJcbiAgICAgICAgdmFyIGNoYXRVc2Vyc0hlaWdodDtcclxuXHJcbiAgICAgICAgY2hhdFVzZXJzSGVpZ2h0ID0gd3JhcHBlci5oZWlnaHQoKSAtIHdyYXBwZXIuZmluZCgnLm5hdi1qdXN0aWZpZWQgPiAubmF2LXRhYnMnKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAvLyBjaGF0IHVzZXIgbGlzdFxyXG4gICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKGNoYXRVc2Vycyk7XHJcbiAgICAgICAgY2hhdFVzZXJzLmF0dHIoXCJkYXRhLWhlaWdodFwiLCBjaGF0VXNlcnNIZWlnaHQpO1xyXG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGNoYXRVc2Vycyk7XHJcblxyXG4gICAgICAgIHZhciBjaGF0TWVzc2FnZXMgPSB3cmFwcGVyQ2hhdC5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1tZXNzYWdlcycpO1xyXG4gICAgICAgIHZhciBjaGF0TWVzc2FnZXNIZWlnaHQgPSBjaGF0VXNlcnNIZWlnaHQgLSB3cmFwcGVyQ2hhdC5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlci1mb3JtJykub3V0ZXJIZWlnaHQoKSAtIHdyYXBwZXJDaGF0LmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItbmF2Jykub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgLy8gdXNlciBjaGF0IG1lc3NhZ2VzXHJcbiAgICAgICAgTWV0cm9uaWMuZGVzdHJveVNsaW1TY3JvbGwoY2hhdE1lc3NhZ2VzKTtcclxuICAgICAgICBjaGF0TWVzc2FnZXMuYXR0cihcImRhdGEtaGVpZ2h0XCIsIGNoYXRNZXNzYWdlc0hlaWdodCk7XHJcbiAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoY2hhdE1lc3NhZ2VzKTtcclxuICAgIH07XHJcblxyXG4gICAgaW5pdENoYXRTbGltU2Nyb2xsKCk7XHJcbiAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGluaXRDaGF0U2xpbVNjcm9sbCk7IC8vIHJlaW5pdGlhbGl6ZSBvbiB3aW5kb3cgcmVzaXplXHJcblxyXG4gICAgd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlcnMgLm1lZGlhLWxpc3QgPiAubWVkaWEnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd3JhcHBlckNoYXQuYWRkQ2xhc3MoXCJwYWdlLXF1aWNrLXNpZGViYXItY29udGVudC1pdGVtLXNob3duXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWNoYXQtdXNlciAucGFnZS1xdWljay1zaWRlYmFyLWJhY2stdG8tbGlzdCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3cmFwcGVyQ2hhdC5yZW1vdmVDbGFzcyhcInBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8vIEhhbmRsZXMgcXVpY2sgc2lkZWJhciB0YXNrc1xyXG52YXIgaGFuZGxlUXVpY2tTaWRlYmFyQWxlcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHdyYXBwZXIgPSAkKCcucGFnZS1xdWljay1zaWRlYmFyLXdyYXBwZXInKTtcclxuICAgIHZhciB3cmFwcGVyQWxlcnRzID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cycpO1xyXG5cclxuICAgIHZhciBpbml0QWxlcnRzU2xpbVNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYWxlcnRMaXN0ID0gd3JhcHBlci5maW5kKCcucGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cy1saXN0Jyk7XHJcbiAgICAgICAgdmFyIGFsZXJ0TGlzdEhlaWdodDtcclxuXHJcbiAgICAgICAgYWxlcnRMaXN0SGVpZ2h0ID0gd3JhcHBlci5oZWlnaHQoKSAtIHdyYXBwZXIuZmluZCgnLm5hdi1qdXN0aWZpZWQgPiAubmF2LXRhYnMnKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAvLyBhbGVydHMgbGlzdFxyXG4gICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKGFsZXJ0TGlzdCk7XHJcbiAgICAgICAgYWxlcnRMaXN0LmF0dHIoXCJkYXRhLWhlaWdodFwiLCBhbGVydExpc3RIZWlnaHQpO1xyXG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGFsZXJ0TGlzdCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGluaXRBbGVydHNTbGltU2Nyb2xsKCk7XHJcbiAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGluaXRBbGVydHNTbGltU2Nyb2xsKTsgLy8gcmVpbml0aWFsaXplIG9uIHdpbmRvdyByZXNpemVcclxufTtcclxuXHJcbnJpb3QudGFnKENPTlNUQU5UUy5UQUdTLlNJREVCQVIsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICB0aGlzLm1peGluKFRyYWluaW5nTWl4KVxyXG5cclxuXHRjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMudXNlclBpY3R1cmUgPSAnJ1xyXG5cclxuXHR0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyVG9nZ2xlcigpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyB0b2dnbGVyXHJcbiAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyQ2hhdCgpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyBjaGF0c1xyXG4gICAgICAgIGhhbmRsZVF1aWNrU2lkZWJhckFsZXJ0cygpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyBhbGVydHNcclxuICAgICAgICB0aGlzLnVzZXJQaWN0dXJlID0gTWV0YU1hcC5Vc2VyLnBpY3R1cmVcclxuICAgICAgICAkKHRoaXMuY29ydGV4X21lc3NhZ2VzKS5zbGltU2Nyb2xsKHsgc2Nyb2xsQnk6ICcxMDBweCcgfSlcclxuXHR9KTtcclxuXHJcblx0dGhpcy5nZXREaXNwbGF5ID0gKCkgPT4ge1xyXG5cdFx0aWYgKCF0aGlzLmRpc3BsYXkpIHtcclxuXHRcdFx0cmV0dXJuICdkaXNwbGF5OiBub25lOyc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gJyc7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzLmdldFJlbGF0aXZlVGltZSA9IChkYXRlID0gbmV3IERhdGUoKSkgPT4ge1xyXG5cdFx0cmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XHJcblx0fVxyXG5cclxuXHR0aGlzLm9uU3VibWl0ID0gKG9iaikgPT4ge1xyXG5cdFx0dGhpcy51c2VyVHJhaW5pbmcubWVzc2FnZXMucHVzaCh7XHJcblx0XHRcdG1lc3NhZ2U6IHRoaXMuY2hhdF9pbnB1dC52YWx1ZSxcclxuXHRcdFx0dGltZTogbmV3IERhdGUoKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMuc2F2ZVRyYWluaW5nKHRoaXMudHJhaW5pbmdJZClcclxuXHRcdHRoaXMuY2hhdF9pbnB1dC52YWx1ZSA9ICcnXHJcblx0XHR0aGlzLnVwZGF0ZSgpXHJcblx0fVxyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UsICgpID0+IHtcclxuICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3BhZ2UtcXVpY2stc2lkZWJhci1vcGVuJylcclxuICAgIH0pO1xyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgKGlkKSA9PiB7XHJcbiAgICAgICAgdGhpcy50cmFpbmluZ0lkID0gaWRcclxuICAgICAgICB0aGlzLmdldERhdGEoaWQpXHJcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdwYWdlLXF1aWNrLXNpZGViYXItb3BlbicpXHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncmF3JywgJzxzcGFuPjwvc3Bhbj4nLCBmdW5jdGlvbiAob3B0cykge1xyXG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAob3B0cykgPyAob3B0cy5jb250ZW50IHx8ICcnKSA6ICcnO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ3R5cGVhaGVhZC5qcycpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1zZWxlY3QnKVxyXG5cclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbnJlcXVpcmUoJy4uLy4uL3Rvb2xzL3NoaW1zJyk7XHJcbmNvbnN0IFNoYXJpbmcgPSByZXF1aXJlKCcuLi8uLi9hcHAvU2hhcmluZycpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwic2hhcmVfbW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBpZD1cInNoYXJlX3B1YmxpY19saW5rXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImZsb2F0OiByaWdodDsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcIlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtY2xpcGJvYXJkLXRleHQ9XCJ7d2luZG93LmxvY2F0aW9uLmhvc3QrJy8nK3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSsnL21hcHMvJytvcHRzLm1hcC5pZH1cIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IGdldFB1YmxpY0xpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBHZXQgc2hhcmFibGUgbGluayAgPGkgY2xhc3M9XCJmYSBmYS1saW5rXCI+PC9pPjwvYT5cclxuICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+U2hhcmUgd2l0aCBvdGhlcnM8L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxwPlBlb3BsZTwvcD5cclxuICAgICAgICAgICAgICAgIDxmb3JtIHJvbGU9XCJmb3JtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic2hhcmVfdHlwZWFoZWFkXCIgY2xhc3M9XCJjb2wtbWQtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHN0eWxlPVwiaGVpZ2h0OiAzNXB4O1wiIGlkPVwic2hhcmVfaW5wdXRcIiBjbGFzcz1cInR5cGVhaGVhZCBmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgbmFtZXMgb3IgZW1haWwgYWRkcmVzc2VzLi4uXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwic2hhcmVfcGVybWlzc2lvblwiIGNsYXNzPVwic2VsZWN0cGlja2VyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmVhZFwiIGRhdGEtY29udGVudD1cIjxzcGFuPjxpIGNsYXNzPSdmYSBmYS1leWUnPjwvaT4gQ2FuIHZpZXc8L3NwYW4+XCI+Q2FuIHZpZXc8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3cml0ZVwiIGRhdGEtY29udGVudD1cIjxzcGFuPjxpIGNsYXNzPSdmYSBmYS1wZW5jaWwnPjwvaT4gQ2FuIGVkaXQ8L3NwYW4+XCI+Q2FuIGVkaXQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlkPVwic2hhcmVfYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWljb24tb25seSBncmVlblwiIG9uY2xpY2s9XCJ7IG9uU2hhcmUgfVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWY9XCJ7IG9wdHMgJiYgb3B0cy5tYXAgJiYgb3B0cy5tYXAuc2hhcmVkX3dpdGh9XCIgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibGFiZWwgbGFiZWwtZGVmYXVsdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDVweDtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmPVwieyBpICE9ICdhZG1pbicgJiYgKHZhbC53cml0ZSB8fCB2YWwucmVhZCkgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgaSwgdmFsIGluIG9wdHMubWFwLnNoYXJlZF93aXRofVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGlmPVwieyB2YWwud3JpdGUgfVwiIGNsYXNzPVwiZmEgZmEtcGVuY2lsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGlmPVwieyAhdmFsLndyaXRlIH1cIiBjbGFzcz1cImZhIGZhLWV5ZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHZhbC5uYW1lIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZhIGZhLXRpbWVzLWNpcmNsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vblVuU2hhcmUgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPkRvbmU8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdzaGFyZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKVxyXG4gICAgY29uc3Qgc2hhcmUgPSBuZXcgU2hhcmluZyhNZXRhTWFwLlVzZXIpXHJcblxyXG4gICAgdGhpcy5kYXRhID0gW107XHJcblxyXG4gICAgdGhpcy5nZXRQdWJsaWNMaW5rID0gKGUsIG9wdHMpID0+IHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uU2hhcmUgPSAoZSwgb3B0cykgPT4ge1xyXG4gICAgICAgIHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5zdWdnZXN0aW9uLmlkXSA9IHtcclxuICAgICAgICAgICAgcmVhZDogdGhpcy5waWNrZXIudmFsKCkgPT0gJ3JlYWQnIHx8IHRoaXMucGlja2VyLnZhbCgpID09ICd3cml0ZScsXHJcbiAgICAgICAgICAgIHdyaXRlOiB0aGlzLnBpY2tlci52YWwoKSA9PSAnd3JpdGUnLFxyXG4gICAgICAgICAgICBuYW1lOiB0aGlzLnN1Z2dlc3Rpb24ubmFtZSxcclxuICAgICAgICAgICAgcGljdHVyZTogdGhpcy5zdWdnZXN0aW9uLnBpY3R1cmVcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hhcmUuYWRkU2hhcmUodGhpcy5vcHRzLm1hcCwgdGhpcy5zdWdnZXN0aW9uLCB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW3RoaXMuc3VnZ2VzdGlvbi5pZF0pXHJcblxyXG4gICAgICAgIHRoaXMuc3VnZ2VzdGlvbiA9IG51bGxcclxuICAgICAgICB0aGlzLnRhLnR5cGVhaGVhZCgndmFsJywgJycpXHJcbiAgICAgICAgJCh0aGlzLnNoYXJlX2J1dHRvbikuaGlkZSgpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblVuU2hhcmUgPSAoZSwgb3B0cykgPT4ge1xyXG4gICAgICAgIGUuaXRlbS52YWwuaWQgPSBlLml0ZW0uaVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW2UuaXRlbS5pXVxyXG4gICAgICAgIHNoYXJlLnJlbW92ZVNoYXJlKHRoaXMub3B0cy5tYXAsIGUuaXRlbS52YWwpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKG9wdHMpID0+IHtcclxuICAgICAgICBpZiAob3B0cykge1xyXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLm9wdHMsIG9wdHMpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoZSwgb3B0cykgPT4ge1xyXG4gICAgICAgICQodGhpcy5zaGFyZV9tb2RhbCkubW9kYWwoJ3Nob3cnKVxyXG4gICAgICAgIHRoaXMudGEgPSAkKCcjc2hhcmVfdHlwZWFoZWFkIC50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgICBoaWdobGlnaHQ6IHRydWVcclxuICAgICAgICB9LHtcclxuICAgICAgICAgICAgc291cmNlOiAocXVlcnksIHN5bmNNZXRob2QsIGFzeW5jTWV0aG9kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWV0YW1hcC5jby91c2Vycy9maW5kJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSgge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcklkOiBNZXRhTWFwLlVzZXIudXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uSWQ6IE1ldGFNYXAuTWV0YUZpcmUuZmlyZWJhc2VfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4Y2x1ZGVkVXNlcnM6IF8ua2V5cyh0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoOiBxdWVyeVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnKicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWN0dXJlOiAnc3JjL2ltYWdlcy93b3JsZC1nbG9iZS5qcGcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1B1YmxpYydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNNZXRob2QoZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yIDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXNwbGF5OiAob2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLm5hbWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlczoge1xyXG4gICAgICAgICAgICAgICAgZW1wdHk6IFtcclxuICAgICAgICAgICAgICAgICc8ZGl2IHN0eWxlPVwicGFkZGluZzogNXB4IDEwcHg7IHRleHQtYWxpZ246IGNlbnRlcjtcIj4nLFxyXG4gICAgICAgICAgICAgICAgICAgICdVbmFibGUgdG8gZmluZCBhbnkgdXNlcnMgbWF0Y2hpbmcgdGhpcyBxdWVyeScsXHJcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgXS5qb2luKCdcXG4nKSxcclxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb246ICh2YWx1ZSkgPT4geyByZXR1cm4gYDxkaXY+PGltZyBhbHQ9XCIke3ZhbHVlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHt2YWx1ZS5waWN0dXJlfVwiPiAke3ZhbHVlLm5hbWV9PC9kaXY+YCB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGEub24oJ3R5cGVhaGVhZDpzZWxlY3QnLCAoZXYsIHN1Z2dlc3Rpb24pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gc3VnZ2VzdGlvblxyXG4gICAgICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5zaG93KClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGEub24oJ3R5cGVhaGVhZDphdXRvY29tcGxldGUnLCAoZXYsIHN1Z2dlc3Rpb24pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gc3VnZ2VzdGlvblxyXG4gICAgICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5zaG93KClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMucGlja2VyID0gJCgnLnNlbGVjdHBpY2tlcicpLnNlbGVjdHBpY2tlcih7XHJcbiAgICAgICAgICAgIHdpZHRoOiAnYXV0bydcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcblxyXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ncmFkdWF0aW9uLWNhcFwiPjwvaT5cclxuICAgICAgICA8L2E+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjcwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBoZWxwIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBoZWxwIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG5gO1xyXG5cclxucmlvdC50YWcoJ21ldGEtaGVscCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGVscCA9IG51bGw7XHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL2hlbHAnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhlbHAgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxucmVxdWlyZSgnLi4vLi4vdG9vbHMvc2hpbXMnKVxyXG5cclxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCJcclxuICAgICAgICAgICAgICAgICBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXHJcbiAgICAgICAgICAgICAgICAgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCJcclxuICAgICAgICAgICAgICAgICBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWJlbGwtb1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBub3RpZmljYXRpb25zLmxlbmd0aCB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV4dGVybmFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IG5vdGlmaWNhdGlvbnMubGVuZ3RoIH0gcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9ueyBzOiBub3RpZmljYXRpb25zLmxlbmd0aCA9PSAwIHx8IG5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGlmPVwieyBhbGxOb3RpZmljYXRpb25zLmxlbmd0aCA+IDEgfVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj52aWV3IGFsbDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudS1saXN0IHNjcm9sbGVyXCIgc3R5bGU9XCJoZWlnaHQ6IDI1MHB4O1wiIGRhdGEtaGFuZGxlLWNvbG9yPVwiIzYzNzI4M1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyB0cnVlICE9IGFyY2hpdmVkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IHZhbCwgaSBpbiBub3RpZmljYXRpb25zIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWY9XCJ7IHZhbC5waG90byAhPSBudWxsIH1cIiBjbGFzcz1cInBob3RvXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJ7dmFsLnBob3RvfVwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIGFsdD1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3ViamVjdFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZnJvbVwiPnsgdmFsLmZyb20gfTwvc3Bhbj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInRpbWVcIiBzdHlsZT1cInBhZGRpbmc6IDA7XCI+eyBwYXJlbnQuZ2V0VGltZSh2YWwudGltZSkgfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1lc3NhZ2VcIj57IHZhbC5ldmVudCB9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1ub3RpZmljYXRpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgY29uc3QgZmJQYXRoID0gQ09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdChNZXRhTWFwLlVzZXIudXNlcklkKVxyXG5cclxuICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IFtdO1xyXG4gICAgdGhpcy5hbGxOb3RpZmljYXRpb25zID0gW107XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcclxuICAgICAgICBsZXQgaXRlbSA9IGV2ZW50Lml0ZW0udmFsXHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHRydWUsIGAke2ZiUGF0aH0vJHtpdGVtLmlkfS9hcmNoaXZlYClcclxuICAgICAgICBzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5OT1RJRklDQVRJT04uTUFQOlxyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2l0ZW0ubWFwSWR9YCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRUaW1lID0gKHRpbWUpID0+IHtcclxuICAgICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKHRpbWUpKS5mcm9tTm93KClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldERhdGEoZmJQYXRoKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5wdXNoRGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiAnWW91IHNpZ25lZCB1cCBmb3IgTWV0YU1hcCEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBgJHtuZXcgRGF0ZSgpIH1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNoaXZlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZiUGF0aClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdChNZXRhTWFwLlVzZXIudXNlcklkKSwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsbE5vdGlmaWNhdGlvbnMgPSBfLm1hcChkYXRhLCAobiwgaWQpID0+IHsgbi5pZCA9IGlkOyByZXR1cm4gbjsgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IF8uZmlsdGVyKF8uc29ydEJ5KHRoaXMuYWxsTm90aWZpY2F0aW9ucywgJ2RhdGUnKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdib290c3RyYXAtaG92ZXItZHJvcGRvd24nKVxyXG5cclxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS10cm9waHlcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgcG9pbnRzLmxlbmd0aCB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImV4dGVybmFsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IHBvaW50cy5sZW5ndGggfSBuZXcgPC9zcGFuPiBhY2hpZXZlbWVudHsgczogcG9pbnRzLmxlbmd0aCA9PSAwIHx8IHBvaW50cy5sZW5ndGggPiAxIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiPnZpZXcgYWxsPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IHBvaW50cyB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBwb2ludHMgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aW1lXCI+eyB0aW1lIH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC1pY29uIGxhYmVsLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGV2ZW50IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbmA7XHJcblxyXG5yaW90LnRhZygnbWV0YS1wb2ludHMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihgdXNlcnMvJHtNZXRhTWFwLlVzZXIudXNlcklkfS9wb2ludHNgLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50cyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IGh0bWwgPSBgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidXNlcm5hbWUgdXNlcm5hbWUtaGlkZS1vbi1tb2JpbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB1c2VybmFtZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgaWY9XCJ7IHBpY3R1cmUgfVwiIGFsdD1cIlwiIGhlaWdodD1cIjM5XCIgd2lkdGg9XCIzOVwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cInsgcGljdHVyZSB9XCIgLz5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBtZW51IH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyBtZW51IH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuYDtcclxuXHJcbnJpb3QudGFnKCdtZXRhLXVzZXInLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcblxyXG4gICAgdGhpcy5tZW51ID0gW107XHJcbiAgICB0aGlzLnVzZXJuYW1lID0gJyc7XHJcbiAgICB0aGlzLnBpY3R1cmUgPSAnJztcclxuXHJcbiAgICB0aGlzLmxvZ291dCA9ICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLmxvZ291dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGlua0FjY291bnQgPSAoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5BdXRoMC5saW5rQWNjb3VudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XHJcbiAgICAgICAgc3dpdGNoKGV2ZW50Lml0ZW0ubGluaykge1xyXG4gICAgICAgICAgICBjYXNlICcjbGluay1zb2NpYWwtYWNjb3VudHMnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5saW5rQWNjb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGBtZXRhbWFwL3VzZXJgLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJuYW1lID0gTWV0YU1hcC5Vc2VyLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgICAgICB0aGlzLnBpY3R1cmUgPSBNZXRhTWFwLlVzZXIucGljdHVyZTtcclxuICAgICAgICAgICAgdGhpcy5tZW51ID0gXy5maWx0ZXIoXy5zb3J0QnkoZGF0YSwgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzXHJcblxyXG5sZXQgVHJhaW5pbmdNaXggPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLk1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJylcclxuICAgIH0sXHJcblxyXG4gICAgdXNlclRyYWluaW5nOiB7IG1lc3NhZ2VzOiBbXSB9LFxyXG4gICAgdHJhaW5pbmc6IHt9LFxyXG5cclxuICAgIHNhdmVUcmFpbmluZzogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICB0aGlzLk1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YSh0aGlzLnVzZXJUcmFpbmluZywgYCR7Q09OU1RBTlRTLlJPVVRFUy5UUkFJTklOR1MuZm9ybWF0KHRoaXMuTWV0YU1hcC5Vc2VyLnVzZXJJZCl9JHtpZH1gKVxyXG4gICAgfSxcclxuXHJcbiAgICBnZXREYXRhOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIGlmIChpZCkge1xyXG4gICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgICAgICAgICAgdGhpcy5fb25jZUdldERhdGEgPSB0aGlzLl9vbmNlR2V0RGF0YSB8fCBfLm9uY2UoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBvbmNlID0gXy5vbmNlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Lk1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5UUkFJTklOR1MuZm9ybWF0KHRoYXQuTWV0YU1hcC5Vc2VyLnVzZXJJZCkgfSR7aWR9YCwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51c2VyVHJhaW5pbmcgPSBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51c2VyVHJhaW5pbmcgPSB0aGF0LnRyYWluaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNhdmVUcmFpbmluZyhpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQudXNlclRyYWluaW5nLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVzZXJUcmFpbmluZy5tZXNzYWdlcyA9IFt0aGF0LmdldERlZmF1bHRNZXNzYWdlKCldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zYXZlVHJhaW5pbmcoaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Lk1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfT1BFTiwgaWQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhhdC5NZXRhTWFwLk1ldGFGaXJlLm9uKGAke0NPTlNUQU5UUy5ST1VURVMuQ09VUlNFX0xJU1R9JHtpZH1gLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQudHJhaW5pbmcgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuTWV0YU1hcC5FdmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCBkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBvbmNlKClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fb25jZUdldERhdGEoKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWVzc2FnZXM6IFtdLFxyXG5cclxuICAgIGNvcnRleFBpY3R1cmU6ICdzcmMvaW1hZ2VzL2NvcnRleC1hdmF0YXItc21hbGwuanBnJyxcclxuXHJcbiAgICBnZXREZWZhdWx0TWVzc2FnZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBIZWxsbywgSSdtIENvcnRleCBNYW4uIEFzayBtZSBhbnl0aGluZy4gVHJ5IDxjb2RlPi9oZWxwPC9jb2RlPiBpZiB5b3UgZ2V0IGxvc3QuYCxcclxuICAgICAgICAgICAgYXV0aG9yOiAnY29ydGV4JyxcclxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWluaW5nTWl4IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1ob3Zlci1kcm9wZG93bicpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcclxucmVxdWlyZSgnLi4vdG9vbHMvc2hpbXMnKTtcclxuY29uc3QgUGVybWlzc2lvbnMgPSByZXF1aXJlKCcuLi9hcHAvUGVybWlzc2lvbnMnKVxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cInBhZ2VfYWN0aW9uc1wiIGNsYXNzPVwicGFnZS1hY3Rpb25zXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gcmVkLWhhemUgYnRuLXNtIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIiBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRkZW4tc20gaGlkZGVuLXhzXCI+QWN0aW9ucyZuYnNwOzwvc3Bhbj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxyXG4gICAgICAgICAgICA8bGkgZWFjaD1cInsgdmFsLCBpIGluIGRhdGEgfVwiIGNsYXNzPVwieyBzdGFydDogaSA9PSAwLCBhY3RpdmU6IGkgPT0gMCB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSBpZj1cInsgcGFyZW50LmdldExpbmtBbGxvd2VkKHZhbCkgfVwiIGhyZWY9XCJ7IHBhcmVudC5nZXRBY3Rpb25MaW5rKHZhbCkgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyB2YWwuaWNvbiB9XCI+PC9pPiB7IHZhbC50aXRsZSB9XHJcbiAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxyXG4gICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3NldHRpbmdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1nZWFyXCI+PC9pPiBTZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8c3BhbiBzdHlsZT1cInBhZGRpbmctbGVmdDogNXB4O1wiPlxyXG4gICAgICAgIDxzcGFuIGlmPVwieyBwYWdlTmFtZSB9XCJcclxuICAgICAgICAgICAgICAgIGlkPVwibWFwX25hbWVcIlxyXG4gICAgICAgICAgICAgICAgZGF0YS10eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICBkYXRhLXRpdGxlPVwiRW50ZXIgbWFwIG5hbWVcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPlxyXG4gICAgICAgICAgICB7IHBhZ2VOYW1lIH1cclxuICAgICAgICA8L3NwYW4+XHJcbiAgICA8L3NwYW4+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1hY3Rpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy5wYWdlTmFtZSA9ICdIb21lJztcclxuICAgIHRoaXMudXJsID0gTWV0YU1hcC5jb25maWcuc2l0ZS5kYiArICcuZmlyZWJhc2Vpby5jb20nO1xyXG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuZ2V0QWN0aW9uTGluayA9IChvYmopID0+IHtcclxuICAgICAgICBsZXQgcmV0ID0gb2JqLmxpbms7XHJcbiAgICAgICAgaWYgKG9iai51cmxfcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIGxldCBhcmdzID0gW107XHJcbiAgICAgICAgICAgIF8uZWFjaChvYmoudXJsX3BhcmFtcywgKHBybSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKHRoaXNbcHJtLm5hbWVdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldCA9IG9iai5saW5rLmZvcm1hdC5jYWxsKG9iai5saW5rLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldExpbmtBbGxvd2VkID0gKG9iaikgPT4ge1xyXG4gICAgICAgIGxldCByZXQgPSB0cnVlID09IG9ialsnYWxsb3dlZC1vbiddWycqJ107XHJcbiAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gTWV0YU1hcC5Sb3V0ZXIuY3VycmVudFBhdGg7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bY3VycmVudFBhZ2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmV0ICYmIHRoaXMubWFwICYmIHBlcm1pc3Npb25zKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAob2JqLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdTaGFyZSBNYXAnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnRGVsZXRlIE1hcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGVybWlzc2lvbnMuaXNNYXBPd25lcigpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVBhZ2VOYW1lID0gKG1hcCkgPT4ge1xyXG4gICAgICAgIHBlcm1pc3Npb25zID0gbmV3IFBlcm1pc3Npb25zKG1hcClcclxuICAgICAgICB0aGlzLm1hcCA9IG1hcCB8fCB7fVxyXG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5pc01hcE93bmVyKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG1hcC5uYW1lIHx8ICcnXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTmFtZSA9IG1hcC5uYW1lICsgJyAoU2hhcmVkIGJ5ICcgKyBtYXAub3duZXIubmFtZSArICcpJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGVybWlzc2lvbnMgJiYgcGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5tYXBfbmFtZSkuZWRpdGFibGUoeyB1bnNhdmVkY2xhc3M6IG51bGwgfSkub24oJ3NhdmUnLCAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH0vbmFtZWApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMubG9hZGVkKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5tYXBfbmFtZSkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcclxuICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vZmYoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7dGhpcy5tYXBJZH1gKTtcclxuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG51bGxcclxuICAgICAgICAgICAgdGhpcy5tYXAgPSBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRzLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFwSWQgPSBvcHRzLmlkO1xyXG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke29wdHMuaWR9YCwgKG1hcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlTmFtZShtYXApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhZ2VOYW1lID0gb3B0cy5uYW1lIHx8ICdIb21lJztcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9hY3Rpb25zJywgKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UsICgpID0+IHtcclxuICAgICAgICAkKHRoaXMucGFnZV9hY3Rpb25zKS5jc3MoeyAncGFkZGluZy1sZWZ0JzogJzAnIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sICgpID0+IHtcclxuICAgICAgICAkKHRoaXMucGFnZV9hY3Rpb25zKS5jc3MoeyAncGFkZGluZy1sZWZ0JzogJzcwcHgnIH0pXHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IHBhZ2VIZWFkZXIgPSByZXF1aXJlKCcuL3BhZ2UtaGVhZGVyJyk7XHJcbmNvbnN0IHBhZ2VDb250YWluZXIgPSByZXF1aXJlKCcuL3BhZ2UtY29udGFpbmVyJyk7XHJcbmNvbnN0IHBhZ2VGb290ZXIgPSByZXF1aXJlKCcuL3BhZ2UtZm9vdGVyJyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgaWQ9XCJwYWdlX2JvZHlcIiBjbGFzcz1cInBhZ2UtaGVhZGVyLWZpeGVkIHBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiPlxyXG5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfaGVhZGVyXCI+PC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImNsZWFyZml4XCI+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2NvbnRhaW5lclwiPjwvZGl2PlxyXG5cclxuPC9kaXY+YDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtYm9keScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLmhlYWRlciA9IHRoaXMuaGVhZGVyIHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfaGVhZGVyLCAncGFnZS1oZWFkZXInKVswXTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyIHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfY29udGFpbmVyLCAncGFnZS1jb250YWluZXInKVswXTtcclxuICAgIH0pO1xyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgcGFnZUNvbnRlbnQgPSByZXF1aXJlKCcuL3BhZ2UtY29udGVudCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBhZ2UtY29udGFpbmVyXCI+XHJcblxyXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250ZW50XCI+PC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb250YWluZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy5jb250ZW50IHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfY29udGVudCwgJ3BhZ2UtY29udGVudCcpWzBdO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvcXVpY2stc2lkZWJhcicpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicGFnZS1jb250ZW50LXdyYXBwZXJcIj5cclxuICAgIDxkaXYgaWQ9XCJwYWdlLWNvbnRlbnRcIiBjbGFzcz1cInBhZ2UtY29udGVudFwiPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1oZWFkXCI+PC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgaWQ9XCJhcHAtY29udGFpbmVyXCI+PC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgaWQ9XCJxdWlja19zaWRlYmFyX2NvbnRhaW5lclwiPjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb250ZW50JywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLnNpZGViYXIgPSB0aGlzLnNpZGViYXIgfHwgcmlvdC5tb3VudCh0aGlzLnF1aWNrX3NpZGViYXJfY29udGFpbmVyLCAncXVpY2stc2lkZWJhcicpWzBdXHJcbiAgICAgICAgdGhpcy5yZXNpemUoKVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLnJlc2l6ZSA9ICgpID0+IHtcclxuICAgICAgICBsZXQgd2lkdGggPSBgJHt3aW5kb3cuaW5uZXJXaWR0aCAtIDQwfXB4YDtcclxuICAgICAgICAkKHRoaXNbJ2FwcC1jb250YWluZXInXSkuY3NzKHsgd2lkdGg6IHdpZHRoIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVzaXplKClcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG5cclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3M9XCJwYWdlLWZvb3RlclwiIHN0eWxlPVwicG9zaXRpb246IGZpeGVkOyBib3R0b206IDA7XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1mb290ZXItaW5uZXJcIj5cclxuICAgICAgICA8YSBocmVmPVwiI3Rlcm1zXCI+JmNvcHk7MjAxNTwvYT5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtZm9vdGVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IHBhZ2VMb2dvID0gcmVxdWlyZSgnLi9wYWdlLWxvZ28uanMnKTtcclxuY29uc3QgcGFnZUFjdGlvbnMgPSByZXF1aXJlKCcuL3BhZ2UtYWN0aW9ucy5qcycpO1xyXG5jb25zdCBwYWdlU2VhcmNoID0gcmVxdWlyZSgnLi9wYWdlLXNlYXJjaC5qcycpO1xyXG5jb25zdCBwYWdlVG9wTWVudSA9IHJlcXVpcmUoJy4vcGFnZS10b3BtZW51Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwiaGVhZGVyLXRvcFwiIGNsYXNzPVwicGFnZS1oZWFkZXIgbmF2YmFyIG5hdmJhci1maXhlZC10b3BcIj5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX3Byb2dyZXNzX25leHRcIiBzdHlsZT1cIm92ZXJmbG93OiBpbmhlcml0O1wiPjwvZGl2PlxyXG4gICAgPGRpdiBpZD1cImhlYWRlci1jb250ZW50XCIgY2xhc3M9XCJwYWdlLWhlYWRlci1pbm5lclwiPlxyXG5cclxuICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2xvZ29cIj48L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9hY3Rpb25zXCI+PC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgaWQ9XCJtZXRhX3BhZ2VfdG9wXCIgY2xhc3M9XCJwYWdlLXRvcFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3NlYXJjaFwiPjwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV90b3BtZW51XCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgPC9kaXY+XHJcblxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtaGVhZGVyJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMubG9nbyA9IHRoaXMubG9nbyB8fCByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2xvZ28sICdwYWdlLWxvZ28nKVswXTtcclxuICAgICAgICB0aGlzLmFjdGlvbnMgPSB0aGlzLmFjdGlvbnMgfHwgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9hY3Rpb25zLCAncGFnZS1hY3Rpb25zJylbMF07XHJcbiAgICAgICAgdGhpcy5zZWFyY2ggPSB0aGlzLnNlYXJjaCB8fCByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX3RvcCwgJ3BhZ2Utc2VhcmNoJylbMF07XHJcbiAgICAgICAgdGhpcy50b3BtZW51ID0gdGhpcy50b3BtZW51IHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfdG9wLCAncGFnZS10b3BtZW51JylbMF07XHJcbiAgICB9KTtcclxuXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcclxuXHJcbmNvbnN0IGh0bWwgPSBgXHJcbjxkaXYgY2xhc3MgPVwicGFnZS1sb2dvXCI+XHJcbiAgICA8YSBpZD1cIm1ldGFfbG9nb1wiIGhyZWY9XCIjaG9tZVwiPlxyXG4gICAgICAgIDxpbWcgc3JjPVwic3JjL2ltYWdlcy9tZXRhbWFwX2Nsb3VkLnBuZ1wiIGFsdD1cImxvZ29cIiBjbGFzcyA9XCJsb2dvLWRlZmF1bHRcIiAvPlxyXG4gICAgPC9hPlxyXG5cclxuICAgIDxkaXYgaWQ9XCJtZXRhX21lbnVfdG9nZ2xlXCIgY2xhc3M9XCJtZW51LXRvZ2dsZXIgc2lkZWJhci10b2dnbGVyIHF1aWNrLXNpZGViYXItdG9nZ2xlclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiIHN0eWxlPVwidmlzaWJpbGl0eTp7IGdldERpc3BsYXkoKSB9O1wiPlxyXG4gICAgICAgIDwhLS1ET0M6IFJlbW92ZSB0aGUgYWJvdmUgXCJoaWRlXCIgdG8gZW5hYmxlIHRoZSBzaWRlYmFyIHRvZ2dsZXIgYnV0dG9uIG9uIGhlYWRlci0tPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG48YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3MgPVwibWVudS10b2dnbGVyIHJlc3BvbnNpdmUtdG9nZ2xlclwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItY29sbGFwc2VcIj5cclxuPC9hPlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1sb2dvJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XHJcblxyXG4gICAgdGhpcy5pc1NpZGViYXJPcGVuID0gZmFsc2U7XHJcblxyXG4gICAgdmFyIHRvZ2dsZSA9IChzdGF0ZSkgPT4ge1xyXG4gICAgICAgIGlmKHRoaXMuaXNTaWRlYmFyT3BlbiAhPSBzdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2lkZWJhck9wZW4gPSBzdGF0ZVxyXG4gICAgICAgICAgICAkKHRoaXMubWV0YV9tZW51X3RvZ2dsZSkuY2xpY2soKVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5vbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgLy8gTWV0YU1hcC5FdmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9UT0dHTEUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0RGlzcGxheSA9IChlbCkgPT4ge1xyXG4gICAgICAgIGlmKE1ldGFNYXAgJiYgTWV0YU1hcC5Sb3V0ZXIgJiYgTWV0YU1hcC5Sb3V0ZXIuY3VycmVudFBhdGggPT0gQ09OU1RBTlRTLlBBR0VTLlRSQUlOSU5HUykge1xyXG4gICAgICAgICAgICB0b2dnbGUodHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuICd2aXNpYmxlJ1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnaGlkZGVuJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBNZXRhTWFwLkV2ZW50ZXIuZXZlcnkoJ3BhZ2VOYW1lJywgKG9wdHMpID0+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9KVxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPCEtLSBET0M6IEFwcGx5IFwic2VhcmNoLWZvcm0tZXhwYW5kZWRcIiByaWdodCBhZnRlciB0aGUgXCJzZWFyY2gtZm9ybVwiIGNsYXNzIHRvIGhhdmUgaGFsZiBleHBhbmRlZCBzZWFyY2ggYm94IC0tPlxyXG48Zm9ybSBjbGFzcz1cInNlYXJjaC1mb3JtXCIgYWN0aW9uPVwiZXh0cmFfc2VhcmNoLmh0bWxcIiBtZXRob2Q9XCJHRVRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgcGxhY2Vob2xkZXI9XCJTZWFyY2guLi5cIiBuYW1lPVwicXVlcnlcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0biBzdWJtaXRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXNlYXJjaFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG48L2Zvcm0+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXNlYXJjaCcsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIFxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcclxuXHJcbmNvbnN0IG1ldGFQb2ludHMgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1wb2ludHMuanMnKTtcclxuY29uc3QgbWV0YUhlbHAgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1oZWxwLmpzJyk7XHJcbmNvbnN0IG1ldGFVc2VyID0gcmVxdWlyZSgnLi9tZW51L21ldGEtdXNlci5qcycpO1xyXG5jb25zdCBtZXRhTm90ID0gcmVxdWlyZSgnLi9tZW51L21ldGEtbm90aWZpY2F0aW9ucy5qcycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XHJcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBwdWxsLXJpZ2h0XCI+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCIgaWQ9XCJoZWFkZXJfZGFzaGJvYXJkX2JhclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGhyZWY9XCIjaG9tZVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1ob21lXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9saT5cclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX25vdGlmaWNhdGlvbl9iYXJcIj48L2xpPlxyXG5cclxuYFxyXG4gICAgICAgICAgICAvLyA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XHJcbiAgICAgICAgICAgIC8vIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX3BvaW50c19iYXJcIj48L2xpPlxyXG4rIGBcclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl9oZWxwX2JhclwiIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tZXh0ZW5kZWQgZHJvcGRvd24tbm90aWZpY2F0aW9uIGRyb3Bkb3duXCI+PC9saT5cclxuXHJcbiAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yIGhpZGVcIj48L2xpPlxyXG4gICAgICAgIDxsaSBpZD1cImhlYWRlcl91c2VyX21lbnVcIiBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLXVzZXIgZHJvcGRvd25cIj48L2xpPlxyXG4gICAgPC91bD5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLXRvcG1lbnUnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICAvL1RPRE86IHJlc3RvcmUgbm90aWZpY2F0aW9ucyB3aGVuIGxvZ2ljIGlzIGNvbXBsZXRlXHJcbiAgICAgICAgLy9yaW90Lm1vdW50KHRoaXMuaGVhZGVyX3BvaW50c19iYXIsICdtZXRhLXBvaW50cycpO1xyXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucz10aGlzLm5vdGlmaWNhdGlvbnMgfHwgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9ub3RpZmljYXRpb25fYmFyLCAnbWV0YS1ub3RpZmljYXRpb25zJyk7XHJcbiAgICAgICAgdGhpcy5oZWxwPXRoaXMuaGVscCB8fCByaW90Lm1vdW50KHRoaXMuaGVhZGVyX2hlbHBfYmFyLCAnbWV0YS1oZWxwJyk7XHJcbiAgICAgICAgdGhpcy51c2VyPXRoaXMudXNlciB8fCByaW90Lm1vdW50KHRoaXMuaGVhZGVyX3VzZXJfbWVudSwgJ21ldGEtdXNlcicpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnZGF0YXRhYmxlcycpXHJcbnJlcXVpcmUoJ2RhdGF0YWJsZXMtYm9vdHN0cmFwMy1wbHVnaW4nKVxyXG5cclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbmNvbnN0IHJhdyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvcmF3JylcclxucmVxdWlyZSgnLi4vdGFibGVzL2FsbC1jb3Vyc2VzJylcclxucmVxdWlyZSgnLi4vdGFibGVzL215LWNvdXJzZXMnKVxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cIm15X2NvdXJzZXNfcGFnZVwiIGNsYXNzPVwicG9ydGxldCBib3ggZ3JleS1jYXNjYWRlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicG9ydGxldC10aXRsZVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtaWNvbi10aC1sYXJnZVwiPjwvaT5Db3Vyc2VzXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZj1cInsgbWVudSB9XCIgY2xhc3M9XCJhY3Rpb25zXCI+XHJcbiAgICAgICAgICAgIDxhIGVhY2g9XCJ7IG1lbnUuYnV0dG9ucyB9XCIgaHJlZj1cInsgbGluayB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQWN0aW9uQ2xpY2sgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNvZ3NcIj48L2k+IFRvb2xzIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBlYWNoPVwieyBtZW51Lm1lbnUgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk1lbnVDbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnMgcG9ydGxldC10YWJzXCI+XHJcbiAgICAgICAgICAgIDxsaSBvbmNsaWNrPVwieyBwYXJlbnQub25UYWJTd2l0Y2ggfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInsgYWN0aXZlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNteWNvdXJzZXNfMV97IGkgfVwiIGRhdGEtdG9nZ2xlPVwidGFiXCIgYXJpYS1leHBhbmRlZD1cInsgdHJ1ZTogaSA9PSAwIH1cIj5cclxuICAgICAgICAgICAgICAgIHsgdmFsLnRpdGxlIH08L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGUtdG9vbGJhclwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ0YWItcGFuZSBmYXNlIGluIHsgYWN0aXZlOiBpID09IDAgfVwiIGlkPVwibXljb3Vyc2VzXzFfeyBpIH1cIj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZyhDT05TVEFOVFMuVEFHUy5DT1VSU0VfTElTVCwgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG5cclxuICAgIHRoaXMudXNlciA9IE1ldGFNYXAuVXNlcjtcclxuICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy5tZW51ID0gbnVsbDtcclxuICAgIGxldCB0YWJzID0gW1xyXG4gICAgICAgIHsgdGl0bGU6ICdNeSBUcmFpbmluZ3MnLCBvcmRlcjogMCwgZWRpdGFibGU6IHRydWUsIGNvbHVtbnM6IFt7IG5hbWU6ICdDaGVjaycsIGlzQ2hlY2tib3g6IHRydWUgfSwgeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdTdGF0dXMnIH1dIH0sXHJcbiAgICAgICAgeyB0aXRsZTogJ0FsbCBUcmFpbmluZ3MnLCBvcmRlcjogMSwgZWRpdGFibGU6IGZhbHNlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdPd25lcicgfV0gfVxyXG4gICAgXTtcclxuICAgIHRoaXMudGFicyA9IF8uc29ydEJ5KHRhYnMsICdvcmRlcicpXHJcblxyXG4gICAgdGhpcy5jdXJyZW50VGFiID0gJ015IFRyYWluaW5ncyc7XHJcblxyXG4gICAgLy9FdmVudHNcclxuICAgIHRoaXMub25PcGVuID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2V2ZW50Lml0ZW0uaWR9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblRhYlN3aXRjaCA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRhYiA9IGV2ZW50Lml0ZW0udmFsLnRpdGxlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9hZFRhYmxlID0gKHRpdGxlLCBpKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzW2BteWNvdXJzZXNfMV8ke2l9YF1cclxuICAgICAgICAgICAgbGV0IHRhZyA9IG51bGw7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0FsbCBUcmFpbmluZ3MnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IENPTlNUQU5UUy5UQUdTLkFMTF9DT1VSU0VTXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdNeSBUcmFpbmluZ3MnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IENPTlNUQU5UUy5UQUdTLk1ZX0NPVVJTRVNcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm9kZSAmJiB0YWcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbdGl0bGVdID0gdGhpc1t0aXRsZV0gfHwgcmlvdC5tb3VudChub2RlLCB0YWcpWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpc1t0aXRsZV0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIE1ldGFNYXAuZXJyb3IoZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vUmlvdCBiaW5kaW5nc1xyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcbiAgICAgICAgTlByb2dyZXNzLnN0YXJ0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgXy5lYWNoKHRoaXMudGFicywgKHZhbCwgaSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRUYWJsZSh2YWwudGl0bGUsIGkpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbWFyZ2luLWJvdHRvbS0zMFwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMT57IGhlYWRlci50aXRsZSB9PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPnsgaGVhZGVyLnRleHQgfTwvcD5cclxuXHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGFyZWFzIH1cIj5cclxuXHRcdFx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4gPGI+eyB0aXRsZSB9PC9iPiB7IHRleHQgfVxyXG5cdFx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8L3VsPlxyXG5cdFx0XHRcdFx0XHRcdDwhLS0gQmxvY2txdW90ZXMgLS0+XHJcblx0XHRcdFx0XHRcdFx0PGJsb2NrcXVvdGUgY2xhc3M9XCJoZXJvXCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8cD57IHF1b3RlLnRleHQgfTwvcD5cclxuXHRcdFx0XHRcdFx0XHRcdDxzbWFsbD57IHF1b3RlLmJ5IH08L3NtYWxsPlxyXG5cdFx0XHRcdFx0XHRcdDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZGR0aGlzX2hvcml6b250YWxfZm9sbG93X3Rvb2xib3hcIj48L2Rpdj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3MgPVwiY29sLW1kLTZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIGlmPVwieyBoZWFkZXIueW91dHViZWlkIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwieXRwbGF5ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0L2h0bWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3sgaGVhZGVyLnlvdXR1YmVpZCB9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcyA9XCJmaXR2aWRzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImhlaWdodDogMzI3cHg7IHdpZHRoOiAxMDAlOyBkaXNwbGF5OiBibG9jazsgbWFyZ2luLWxlZnQ6IGF1dG87IG1hcmdpbi1yaWdodDogYXV0bzsgYnJvZGVyOiAwO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG5cdFx0XHRcdFx0XHRcdDwvaWZyYW1lPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxyXG5cdFx0XHRcdFx0XHQ8aDM+eyB1c2VyTmFtZSB9eyB2aXNpb24udGl0bGUgfTwvaDM+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57IHZpc2lvbi50ZXh0IH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5gO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygnaG9tZScsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xyXG5cclxuICAgIHRoaXMuYXJlYXMgPSBbXVxyXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxyXG5cclxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5IT01FLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuYXJlYXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLmFyZWFzLCAnb3JkZXInKSwgKGQpID0+IHtcclxuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5xdW90ZSA9IGRhdGEucXVvdGU7XHJcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcclxuICAgICAgICB0aGlzLnZpc2lvbiA9IGRhdGEudmlzaW9uO1xyXG5cclxuICAgICAgICB0aGlzLnVzZXJOYW1lID0gTWV0YU1hcC5Vc2VyLmZ1bGxOYW1lO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgfSk7XHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzJylcclxucmVxdWlyZSgnZGF0YXRhYmxlcy1ib290c3RyYXAzLXBsdWdpbicpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IHJhdyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvcmF3Jyk7XHJcbmNvbnN0IFNoYXJlTWFwID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9TaGFyZU1hcCcpXHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48ZGl2IGlkPVwibXlfbWFwc19wYWdlXCIgY2xhc3M9XCJwb3J0bGV0IGJveCBncmV5LWNhc2NhZGVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LXRpdGxlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1pY29uLXRoLWxhcmdlXCI+PC9pPk1ldGFNYXBzXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZj1cInsgbWVudSB9XCIgY2xhc3M9XCJhY3Rpb25zXCI+XHJcbiAgICAgICAgICAgIDxhIGVhY2g9XCJ7IG1lbnUuYnV0dG9ucyB9XCIgaHJlZj1cInsgbGluayB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQWN0aW9uQ2xpY2sgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNvZ3NcIj48L2k+IFRvb2xzIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBlYWNoPVwieyBtZW51Lm1lbnUgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk1lbnVDbGljayB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ7IGljb24gfVwiPjwvaT4geyB0aXRsZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnMgcG9ydGxldC10YWJzXCI+XHJcbiAgICAgICAgICAgIDxsaSBvbmNsaWNrPVwieyBwYXJlbnQub25UYWJTd2l0Y2ggfVwiIGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInsgYWN0aXZlOiBpID09IDAgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNteW1hcHNfMV97IGkgfVwiIGRhdGEtdG9nZ2xlPVwidGFiXCIgYXJpYS1leHBhbmRlZD1cInsgdHJ1ZTogaSA9PSAwIH1cIj5cclxuICAgICAgICAgICAgICAgIHsgdmFsLnRpdGxlIH08L2E+XHJcbiAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGUtdG9vbGJhclwiPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ0YWItcGFuZSBmYXNlIGluIHsgYWN0aXZlOiBpID09IDAgfVwiIGlkPVwibXltYXBzXzFfeyBpIH1cIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQgdGFibGUtaG92ZXJcIiBpZD1cIm15bWFwc190YWJsZV97IGkgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwidGFibGUtY2hlY2tib3hcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiZ3JvdXAtY2hlY2thYmxlXCIgZGF0YS1zZXQ9XCIjbXltYXBzX3RhYmxlX3sgaSB9IC5jaGVja2JveGVzXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVkIE9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPd25lclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGlmPVwieyBwYXJlbnQuZGF0YSAmJiBwYXJlbnQuZGF0YVtpXSB9XCIgZWFjaD1cInsgcGFyZW50LmRhdGFbaV0gfVwiIGNsYXNzPVwib2RkIGdyYWRlWFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB8fCBwYXJlbnQudXNlci5pc0FkbWluIH1cIiB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNoZWNrYm94ZXNcIiB2YWx1ZT1cIjFcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNtIGJsdWUgZmlsdGVyLXN1Ym1pdFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk9wZW4gfVwiPk9wZW48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vblNoYXJlIH1cIj5TaGFyZSA8aSBjbGFzcz1cImZhIGZhLXNoYXJlXCI+PC9pPjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZj1cInsgdmFsLnRpdGxlICE9ICdNeSBNYXBzJyB9XCIgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNvcHkgfVwiPkNvcHkgPGkgY2xhc3M9XCJmYSBmYS1jbG9uZVwiPjwvaT48L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyBlZGl0YWJsZSB9XCIgY2xhc3M9XCJtZXRhX2VkaXRhYmxlX3sgaSB9XCIgZGF0YS1waz1cInsgaWQgfVwiIGRhdGEtdGl0bGU9XCJFZGl0IE1hcCBOYW1lXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgbmFtZSB9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZj1cInsgIWVkaXRhYmxlIH1cIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj57IGNyZWF0ZWRfYXQgfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYXcgY29udGVudD1cInsgcGFyZW50LmdldFN0YXR1cyh0aGlzKSB9XCI+PC9yYXc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IHBhcmVudC5nZXRPd25lcih0aGlzKSB9XCI+PC9yYXc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuYDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ215LW1hcHMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcblxyXG4gICAgdGhpcy51c2VyID0gTWV0YU1hcC5Vc2VyO1xyXG4gICAgdGhpcy5kYXRhID0gbnVsbDtcclxuICAgIHRoaXMubWVudSA9IG51bGw7XHJcbiAgICBsZXQgdGFicyA9IFtcclxuICAgICAgICB7IHRpdGxlOiAnTXkgTWFwcycsIG9yZGVyOiAwLCBlZGl0YWJsZTogdHJ1ZSwgY29sdW1uczogW3sgbmFtZTogJ0NoZWNrJywgaXNDaGVja2JveDogdHJ1ZSB9LCB7IG5hbWU6ICdBY3Rpb24nIH0sIHsgbmFtZTogJ0NyZWF0ZWQgT24nIH0sIHsgbmFtZTogJ1N0YXR1cycgfV0gfSxcclxuICAgICAgICB7IHRpdGxlOiAnU2hhcmVkIHdpdGggTWUnLCBvcmRlcjogMSwgZWRpdGFibGU6IGZhbHNlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdPd25lcicgfV0gfSxcclxuICAgICAgICB7IHRpdGxlOiAnUHVibGljJywgb3JkZXI6IDIsIGVkaXRhYmxlOiBmYWxzZSwgY29sdW1uczogW3sgbmFtZTogJ0FjdGlvbicgfSwgeyBuYW1lOiAnQ3JlYXRlZCBPbicgfSwgeyBuYW1lOiAnT3duZXInIH1dIH1cclxuICAgIF07XHJcbiAgICBpZiAodGhpcy51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgICB0YWJzLnB1c2goeyB0aXRsZTogJ0FsbCBNYXBzJywgb3JkZXI6IDMsIGVkaXRhYmxlOiB0cnVlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdPd25lcicgfV0gfSlcclxuICAgICAgICB0YWJzLnB1c2goeyB0aXRsZTogJ1RlbXBsYXRlcycsIG9yZGVyOiA0LCBlZGl0YWJsZTogdHJ1ZSwgY29sdW1uczogW3sgbmFtZTogJ0FjdGlvbicgfSwgeyBuYW1lOiAnQ3JlYXRlZCBPbicgfSwgeyBuYW1lOiAnT3duZXInIH1dIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLnRhYnMgPSBfLnNvcnRCeSh0YWJzLCAnb3JkZXInKVxyXG5cclxuICAgIHRoaXMuY3VycmVudFRhYiA9ICdNeSBNYXBzJztcclxuXHJcbiAgICAvL1xyXG4gICAgdGhpcy5nZXRTdGF0dXMgPSAoaXRlbSkgPT4ge1xyXG4gICAgICAgIGxldCBzdGF0dXMgPSAnUHJpdmF0ZSdcclxuICAgICAgICBsZXQgY29kZSA9ICdkZWZhdWx0J1xyXG4gICAgICAgIGxldCBodG1sID0gJyc7XHJcbiAgICAgICAgaWYgKGl0ZW0uc2hhcmVkX3dpdGgpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uc2hhcmVkX3dpdGhbJyonXSAmJiAoaXRlbS5zaGFyZWRfd2l0aFsnKiddLnJlYWQgPT0gdHJ1ZSB8fCBpdGVtLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdQdWJsaWMnXHJcbiAgICAgICAgICAgICAgICBjb2RlID0gJ3ByaW1hcnknXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfLmVhY2goaXRlbS5zaGFyZWRfd2l0aCwgKHNoYXJlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hhcmUucGljdHVyZSAmJiBrZXkgIT0gJyonICYmIGtleSAhPSAnYWRtaW4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwibGFiZWwgb3duZXItbGFiZWxcIiBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIiBkYXRhLXBsYWNlbWVudD1cImJvdHRvbVwiIHRpdGxlPVwiJHtzaGFyZS5uYW1lfVwiPjxpbWcgYWx0PVwiJHtzaGFyZS5uYW1lfVwiIGhlaWdodD1cIjMwXCIgd2lkdGg9XCIzMFwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cIiR7c2hhcmUucGljdHVyZX1cIj48L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAoaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSAnPHNwYW4gY2xhc3M9XCJcIj5TaGFyZWQgd2l0aDogPC9zcGFuPicgKyBodG1sO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGh0bWwgPSBodG1sIHx8IGA8c3BhbiBjbGFzcz1cImxhYmVsIGxhYmVsLXNtIGxhYmVsLSR7Y29kZX1cIj4ke3N0YXR1c308L3NwYW4+YFxyXG5cclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldE93bmVyID0gKGl0ZW0pID0+IHtcclxuICAgICAgICBsZXQgaHRtbCA9IGA8c3BhbiBjbGFzcz1cImxhYmVsIG93bmVyLWxhYmVsXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1wbGFjZW1lbnQ9XCJib3R0b21cIiB0aXRsZT1cIiR7aXRlbS5vd25lci5uYW1lfVwiPjxpbWcgYWx0PVwiJHtpdGVtLm93bmVyLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtpdGVtLm93bmVyLnBpY3R1cmV9XCI+PC9zcGFuPmBcclxuICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICAvL0V2ZW50c1xyXG4gICAgdGhpcy5vbk9wZW4gPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgbWFwLyR7ZXZlbnQuaXRlbS5pZH1gKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uU2hhcmUgPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICBsZXQgb3B0cyA9IHtcclxuICAgICAgICAgICAgbWFwOiBldmVudC5pdGVtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNoYXJlTWFwLmFjdChvcHRzKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQ29weSA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjb3B5JylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uVGFiU3dpdGNoID0gKGV2ZW50LCAuLi5vKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VGFiID0gZXZlbnQuaXRlbS52YWwudGl0bGU7XHJcbiAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xyXG4gICAgICAgICAgICAkKCcub3duZXItbGFiZWwnKS50b29sdGlwKClcclxuICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5jdXJyZW50VGFiKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ015IE1hcHMnOlxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9uQWN0aW9uQ2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub25NZW51Q2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUYWIgPT0gJ015IE1hcHMnKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQuaXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkZWxldGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZU1hcHMgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL0RlbGV0ZU1hcC5qcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJy5hY3RpdmUnKS5maW5kKCcubWFwaWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHNlbGVjdGVkLCAoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChjZWxsLmlubmVySFRNTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlTWFwcy5kZWxldGVBbGwoaWRzLCBDT05TVEFOVFMuUEFHRVMuTVlfTUFQUyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmQgPSB0aGlzW2B0YWJsZTBgXS5maW5kKCd0Ym9keSB0ciAuY2hlY2tib3hlcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmQuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBqUXVlcnkudW5pZm9ybS51cGRhdGUoZmluZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xyXG5cclxuICAgIH0pXHJcblxyXG4gICAgLy9SaW90IGJpbmRpbmdzXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICBOUHJvZ3Jlc3Muc3RhcnQoKTtcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL215bWFwcycsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lbnUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogXy5zb3J0QnkoZGF0YS5idXR0b25zLCAnb3JkZXInKSxcclxuICAgICAgICAgICAgICAgICAgICBtZW51OiBfLnNvcnRCeShkYXRhLm1lbnUsICdvcmRlcicpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBidWlsZFRhYmxlID0gKGlkeCwgbGlzdCwgZWRpdGFibGUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtpZHhdID0gbGlzdDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzW2B0YWJsZSR7aWR4fWBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzW2BkYXRhVGFibGUke2lkeH1gXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdID0gJCh0aGlzW2BteW1hcHNfdGFibGVfJHtpZHh9YF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0gPSB0aGlzW2B0YWJsZSR7aWR4fWBdLkRhdGFUYWJsZSh7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVuY29tbWVudCBiZWxvdyBsaW5lKCdkb20nIHBhcmFtZXRlcikgdG8gZml4IHRoZSBkcm9wZG93biBvdmVyZmxvdyBpc3N1ZSBpbiB0aGUgZGF0YXRhYmxlIGNlbGxzLiBUaGUgZGVmYXVsdCBkYXRhdGFibGUgbGF5b3V0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgdXNlcyBzY3JvbGxhYmxlIGRpdih0YWJsZS1zY3JvbGxhYmxlKSB3aXRoIG92ZXJmbG93OmF1dG8gdG8gZW5hYmxlIHZlcnRpY2FsIHNjcm9sbChzZWU6IGFzc2V0cy9nbG9iYWwvcGx1Z2lucy9kYXRhdGFibGVzL3BsdWdpbnMvYm9vdHN0cmFwL2RhdGFUYWJsZXMuYm9vdHN0cmFwLmpzKS5cclxuICAgICAgICAgICAgICAgICAgICAvLyBTbyB3aGVuIGRyb3Bkb3ducyB1c2VkIHRoZSBzY3JvbGxhYmxlIGRpdiBzaG91bGQgYmUgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLydkb20nOiAnPCdyb3cnPCdjb2wtbWQtNiBjb2wtc20tMTInbD48J2NvbC1tZC02IGNvbC1zbS0xMidmPnI+dDwncm93JzwnY29sLW1kLTUgY29sLXNtLTEyJ2k+PCdjb2wtbWQtNyBjb2wtc20tMTIncD4+JyxcclxuICAgICAgICAgICAgICAgICAgICAvLydiU3RhdGVTYXZlJzogdHJ1ZSwgLy8gc2F2ZSBkYXRhdGFibGUgc3RhdGUocGFnaW5hdGlvbiwgc29ydCwgZXRjKSBpbiBjb29raWUuXHJcbiAgICAgICAgICAgICAgICAgICAgJ2NvbHVtbnMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdDaGNrQngnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyMHB4J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTmFtZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0NyZWF0ZWQgT24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdTdGF0dXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXNbYHRhYmxlJHtpZHh9YF1Ub29scyA9IG5ldyAkLmZuLmRhdGFUYWJsZS5UYWJsZVRvb2xzKHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdLCB7fSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlV3JhcHBlciA9IHRoaXNbYHRhYmxlJHtpZHh9YF0ucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZChgI215bWFwc18ke2lkeH1fdGFibGVfd3JhcHBlcmApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXNbYHRhYmxlJHtpZHh9YF0uZmluZCgnLmdyb3VwLWNoZWNrYWJsZScpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNldCA9IGpRdWVyeSh0aGlzKS5hdHRyKCdkYXRhLXNldCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VkID0galF1ZXJ5KHRoaXMpLmlzKCc6Y2hlY2tlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeShzZXQpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeS51bmlmb3JtLnVwZGF0ZShzZXQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpc1tgdGFibGUke2lkeH1gXS5vbignY2hhbmdlJywgJ3Rib2R5IHRyIC5jaGVja2JveGVzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0YWJsZVdyYXBwZXIuZmluZCgnLmRhdGFUYWJsZXNfbGVuZ3RoIHNlbGVjdCcpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wgaW5wdXQteHNtYWxsIGlucHV0LWlubGluZScpOyAvLyBtb2RpZnkgdGFibGUgcGVyIHBhZ2UgZHJvcGRvd25cclxuXHJcbiAgICAgICAgICAgICAgICAkKGAubWV0YV9lZGl0YWJsZV8ke2lkeH1gKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNldCAmJiB0aGlzLmRhdGFzZXQucGspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHtpZH0vbmFtZWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgTWV0YU1hcC5lcnJvcihlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vRmV0Y2ggQWxsIG1hcHNcclxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLmdldENoaWxkKENPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUKS5vbigndmFsdWUnLCAodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB2YWwudmFsKCk7XHJcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnRhYnMsICh0YWIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXBzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGFiLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVGVtcGxhdGVzJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNeSBNYXBzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgPT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCkgeyAvL09ubHkgaW5jbHVkZSBteSBvd24gbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdTaGFyZWQgd2l0aCBNZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoICYmIC8vRXhjbHVkZSBhbnl0aGluZyB0aGF0IGlzbid0IHNoYXJlZCBhdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIW9iai5zaGFyZWRfd2l0aFsnKiddIHx8IChvYmouc2hhcmVkX3dpdGhbJyonXS5yZWFkICE9IHRydWUgfHwgb2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgIT0gdHJ1ZSkpICYmIC8vRXhjbHVkZSBwdWJsaWMgbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXSAmJiAvL0luY2x1ZGUgc2hhcmVzIHdpaCBteSB1c2VySWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUgfHwgLy9JbmNsdWRlIGFueXRoaW5nIEkgY2FuIHdyaXRlIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLnJlYWQgPT0gdHJ1ZSkgLy9JbmNsdWRlIGFueXRoaW5nIEkgY2FuIHJlYWQgZnJvbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IChvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdQdWJsaWMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCAhPSBNZXRhTWFwLlVzZXIudXNlcklkICYmIC8vRG9uJ3QgaW5jbHVkZSBteSBvd24gbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aCAmJiAvL0V4Y2x1ZGUgYW55dGhpbmcgdGhhdCBpc24ndCBzaGFyZWQgYXQgYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iai5zaGFyZWRfd2l0aFsnKiddICYmIChvYmouc2hhcmVkX3dpdGhbJyonXS5yZWFkID09IHRydWUgfHwgb2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSkgKSAvL0luY2x1ZGUgcHVibGljIG1hcHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSAob2JqLnNoYXJlZF93aXRoWycqJ10ud3JpdGUgPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBbGwgTWFwcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTGlrZSBpdCBzYXlzLCBhbGwgbWFwc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5lZGl0YWJsZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobWFwcykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLmZpbHRlcihtYXBzLCAobWFwKSA9PiB7IHJldHVybiBtYXAgJiYgbWFwLmlkIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRUYWJsZSh0YWIub3JkZXIsIG1hcHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICQoJy5vd25lci1sYWJlbCcpLnRvb2x0aXAoKVxyXG4gICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBjbGFzcz1cInBvcnRsZXQgbGlnaHRcIj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG9ydGxldC1ib2R5XCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93IG1hcmdpbi1ib3R0b20tMzBcIj5cclxuXHRcdFx0XHRcdFx0PGRpdiBpZj1cInsgaGVhZGVyIH1cIiBjbGFzcz1cImNvbC1tZC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxPnsgaGVhZGVyLnRpdGxlIH08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxyXG5cdFx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgYXJlYXMgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGxpbmVcIj5cclxuICAgIFx0XHRcdFx0XHRcdDxoMz57IHRpdGxlIH08L2gzPlxyXG4gICAgXHRcdFx0XHRcdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyB0ZXh0IH08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxsaSBlYWNoPVwieyBpdGVtcyB9XCI+XHJcblx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XHJcblx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0PC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCd0ZXJtcycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcclxuXHJcbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xyXG4gICAgXHJcbiAgICB0aGlzLmFyZWFzID0gW11cclxuICAgIHRoaXMuaGVhZGVyID0ge31cclxuXHJcbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuVEVSTVNfQU5EX0NPTkRJVElPTlMsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hcmVhcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEuc2VjdGlvbnMsICdvcmRlcicpLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xyXG4gICAgICAgICAgICBpZihpbmNsdWRlKSB7XHJcbiAgICAgICAgICAgICAgICBkLml0ZW1zID0gXy5maWx0ZXIoXy5zb3J0QnkoZC5pdGVtcywgJ29yZGVyJyksIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluY2x1ZGUyID0gZC5hcmNoaXZlICE9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGUyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcclxuICAgICAgICB0aGlzLnVzZXJOYW1lID0gTWV0YU1hcC5Vc2VyLmZ1bGxOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcclxuICAgIH0pO1xyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXHJcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3NcclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXHJcbmNvbnN0IFZpZGVvUGxheWVyID0gcmVxdWlyZSgnLi4vLi4vdG9vbHMvVmlkZW9QbGF5ZXInKVxyXG5jb25zdCBUcmFpbmluZ01peCA9IHJlcXVpcmUoJy4uL21peGlucy90cmFpbmluZy1taXgnKVxyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPGRpdiBpZD1cInRyYWluaW5nX3BvcnRsZXRcIiBjbGFzcz1cInBvcnRsZXQgbGlnaHRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IG1hcmdpbi1ib3R0b20tMzBcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC04IGNvbC1tZC1vZmZzZXQtNFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVtYmVkLXJlc3BvbnNpdmUgZW1iZWQtcmVzcG9uc2l2ZS0xNmJ5OVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJ0cmFpbmluZ19wbGF5ZXJcIiA+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKENPTlNUQU5UUy5UQUdTLlRSQUlOSU5HLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG4gICAgdGhpcy5taXhpbihUcmFpbmluZ01peClcclxuXHJcbiAgICB0aGlzLnRyYWluaW5nID0ge31cclxuXHJcbiAgICB0aGlzLm9uKCdtb3VudCB1cGRhdGUnLCAoZXZlbnQsIG9wdHMpID0+IHtcclxuICAgICAgICBpZiAob3B0cykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdHNcclxuICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMuY29uZmlnLmlkKVxyXG4gICAgICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBWaWRlb1BsYXllcigndHJhaW5pbmdfcGxheWVyJywge2hlaWdodDogMzkwLCB3aWR0aDogNjQwLCB2aWRlb0lkOiAnZFVxUlRXQ2RYdDQnfSlcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RIZWlnaHQgPSAoKSA9PiB7XHJcbiAgICAgICAgJCh0aGlzLnRyYWluaW5nX3BvcnRsZXQpLmNzcyh7XHJcbiAgICAgICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IC0gMTIwICsgJ3B4J1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY29ycmVjdEhlaWdodCgpO1xyXG4gICAgfSk7XHJcblxyXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xyXG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcclxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcclxucmVxdWlyZSgnZGF0YXRhYmxlcycpXHJcbnJlcXVpcmUoJ2RhdGF0YWJsZXMtYm9vdHN0cmFwMy1wbHVnaW4nKVxyXG5cclxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xyXG5jb25zdCByYXcgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL3JhdycpO1xyXG5cclxuY29uc3QgaHRtbCA9IGBcclxuPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlclwiIGlkPVwie3RhYmxlSWR9XCI+XHJcbiAgICA8dGhlYWQ+XHJcbiAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICA8dGggZWFjaD1cIntjb2x1bW5zfVwiPntuYW1lfTwvdGg+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGhlYWQ+XHJcbiAgICA8dGJvZHk+XHJcbiAgICAgICAgPHRyIGlmPVwieyBkYXRhIH1cIiBlYWNoPVwieyBkYXRhIH1cIiBjbGFzcz1cIm9kZCBncmFkZVhcIj5cclxuICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vblN0YXJ0IH1cIj5TdGFydCA8aSBjbGFzcz1cImZhIGZhLXBsYXlcIj48L2k+PC9hPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQgY2xhc3M9XCJ7IG1ldGFfZWRpdGFibGU6IHBhcmVudC5lZGl0YWJsZX1cIiBkYXRhLXBrPVwieyBpZCB9XCIgZGF0YS1uYW1lPVwibmFtZVwiIGRhdGEtdGl0bGU9XCJFZGl0IENvdXJzZSBOYW1lXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgbmFtZSB9PC90ZD5cclxuICAgICAgICAgICAgPHRkIGNsYXNzPVwieyBtZXRhX2VkaXRhYmxlOiBwYXJlbnQuZWRpdGFibGV9XCIgZGF0YS1waz1cInsgaWQgfVwiIGRhdGEtbmFtZT1cImRlc2NyaXB0aW9uXCIgZGF0YS10aXRsZT1cIkVkaXQgQ291cnNlIERlc2NyaXB0aW9uXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgZGVzY3JpcHRpb24gfTwvdGQ+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGJvZHk+XHJcbjwvdGFibGU+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKENPTlNUQU5UUy5UQUdTLkFMTF9DT1VSU0VTLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XHJcblxyXG4gICAgdGhpcy51c2VyID0gTWV0YU1hcC5Vc2VyXHJcbiAgICB0aGlzLmRhdGEgPSBbXVxyXG4gICAgdGhpcy5lZGl0YWJsZSA9IGZhbHNlXHJcbiAgICB0aGlzLnRhYmxlSWQgPSAnYWxsX2NvdXJzZXMnXHJcblxyXG4gICAgdGhpcy5jb2x1bW5zID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ0FjdGlvbicsXHJcbiAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdpZHRoOiAnMTIwcHgnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcclxuICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBuYW1lOiAnRGVzY3JpcHRpb24nLFxyXG4gICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICBdXHJcblxyXG4gICAgLy9FdmVudHNcclxuICAgIHRoaXMub25TdGFydCA9IChldmVudCwgLi4ubykgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGB0cmFpbmluZ3MvJHtldmVudC5pdGVtLmlkfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYnVpbGRUYWJsZSA9ICgpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZS5maW5kKGAubWV0YV9lZGl0YWJsZWApLmVkaXRhYmxlKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFUYWJsZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMudGFibGUgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFt0aGlzLnRhYmxlSWRdKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVRhYmxlID0gdGhpcy50YWJsZS5EYXRhVGFibGUoe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVuY29tbWVudCBiZWxvdyBsaW5lKCdkb20nIHBhcmFtZXRlcikgdG8gZml4IHRoZSBkcm9wZG93biBvdmVyZmxvdyBpc3N1ZSBpbiB0aGUgZGF0YXRhYmxlIGNlbGxzLiBUaGUgZGVmYXVsdCBkYXRhdGFibGUgbGF5b3V0XHJcbiAgICAgICAgICAgICAgICAvLyBzZXR1cCB1c2VzIHNjcm9sbGFibGUgZGl2KHRhYmxlLXNjcm9sbGFibGUpIHdpdGggb3ZlcmZsb3c6YXV0byB0byBlbmFibGUgdmVydGljYWwgc2Nyb2xsKHNlZTogYXNzZXRzL2dsb2JhbC9wbHVnaW5zL2RhdGF0YWJsZXMvcGx1Z2lucy9ib290c3RyYXAvZGF0YVRhYmxlcy5ib290c3RyYXAuanMpLlxyXG4gICAgICAgICAgICAgICAgLy8gU28gd2hlbiBkcm9wZG93bnMgdXNlZCB0aGUgc2Nyb2xsYWJsZSBkaXYgc2hvdWxkIGJlIHJlbW92ZWQuXHJcbiAgICAgICAgICAgICAgICAvLydkb20nOiAnPCdyb3cnPCdjb2wtbWQtNiBjb2wtc20tMTInbD48J2NvbC1tZC02IGNvbC1zbS0xMidmPnI+dDwncm93JzwnY29sLW1kLTUgY29sLXNtLTEyJ2k+PCdjb2wtbWQtNyBjb2wtc20tMTIncD4+JyxcclxuICAgICAgICAgICAgICAgIC8vJ2JTdGF0ZVNhdmUnOiB0cnVlLCAvLyBzYXZlIGRhdGF0YWJsZSBzdGF0ZShwYWdpbmF0aW9uLCBzb3J0LCBldGMpIGluIGNvb2tpZS5cclxuICAgICAgICAgICAgICAgICdjb2x1bW5zJzogdGhpcy5jb2x1bW5zXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhYmxlV3JhcHBlciA9IHRoaXMudGFibGUucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZChgIyR7dGhpcy50YWJsZUlkfV90YWJsZV93cmFwcGVyYCk7XHJcblxyXG4gICAgICAgICAgICB0YWJsZVdyYXBwZXIuZmluZCgnLmRhdGFUYWJsZXNfbGVuZ3RoIHNlbGVjdCcpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wgaW5wdXQteHNtYWxsIGlucHV0LWlubGluZScpOyAvLyBtb2RpZnkgdGFibGUgcGVyIHBhZ2UgZHJvcGRvd25cclxuXHJcbiAgICAgICAgICAgICB0aGlzLnRhYmxlLmZpbmQoYC5tZXRhX2VkaXRhYmxlYCkuZWRpdGFibGUoeyB1bnNhdmVkY2xhc3M6IG51bGwgfSkub24oJ3NhdmUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNldCAmJiB0aGlzLmRhdGFzZXQucGspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmRhdGFzZXQucGs7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5zZXREYXRhKHBhcmFtcy5uZXdWYWx1ZSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5DT1VSU0VfTElTVH0vJHtpZH0vJHt0aGlzLmRhdGFzZXQubmFtZX1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIE5Qcm9ncmVzcy5kb25lKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9SaW90IGJpbmRpbmdzXHJcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcclxuICAgICAgICB0aGlzLmVkaXRhYmxlID0gdGhpcy51c2VyLmlzQWRtaW5cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IG9uY2UgPSBfLm9uY2UoKCkgPT4ge1xyXG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5DT1VSU0VfTElTVCwgKGxpc3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZSgwLCB0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcclxuICAgICAgICBvbmNlKClcclxuICAgIH0pXHJcbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XHJcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xyXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5yZXF1aXJlKCdkYXRhdGFibGVzJylcclxucmVxdWlyZSgnZGF0YXRhYmxlcy1ib290c3RyYXAzLXBsdWdpbicpXHJcblxyXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XHJcbmNvbnN0IHJhdyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvcmF3Jyk7XHJcblxyXG5jb25zdCBodG1sID0gYFxyXG48dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWhvdmVyXCIgaWQ9XCJ7dGFibGVJZH1cIj5cclxuICAgIDx0aGVhZD5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0aCBlYWNoPVwie2NvbHVtbnN9XCI+e25hbWV9PC90aD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90aGVhZD5cclxuICAgIDx0Ym9keT5cclxuICAgICAgICA8dHIgaWY9XCJ7IGRhdGEgfVwiIGVhY2g9XCJ7IGRhdGEgfVwiIGNsYXNzPVwib2RkIGdyYWRlWFwiPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tc20gcmVkXCIgb25jbGljaz1cInsgcGFyZW50Lm9uU3RhcnQgfVwiPkNvbnRpbnVlIDxpIGNsYXNzPVwiZmEgZmEtcGxheVwiPjwvaT48L2E+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxyXG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgZGVzY3JpcHRpb24gfTwvdGQ+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGJvZHk+XHJcbjwvdGFibGU+XHJcbmA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKENPTlNUQU5UUy5UQUdTLk1ZX0NPVVJTRVMsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XHJcblxyXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcclxuXHJcbiAgICB0aGlzLnVzZXIgPSBNZXRhTWFwLlVzZXJcclxuICAgIHRoaXMuZGF0YSA9IFtdXHJcbiAgICB0aGlzLmVkaXRhYmxlID0gZmFsc2VcclxuICAgIHRoaXMudGFibGVJZCA9ICdteV9jb3Vyc2VzJ1xyXG5cclxuICAgIHRoaXMuY29sdW1ucyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdBY3Rpb24nLFxyXG4gICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICB3aWR0aDogJzEyMHB4J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnTmFtZScsXHJcbiAgICAgICAgICAgIG9yZGVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgbmFtZTogJ0Rlc2NyaXB0aW9uJyxcclxuICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG5cclxuICAgIC8vRXZlbnRzXHJcbiAgICB0aGlzLm9uU3RhcnQgPSAoZXZlbnQsIC4uLm8pID0+IHtcclxuICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgdHJhaW5pbmdzLyR7ZXZlbnQuaXRlbS5pZH1gKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkVGFibGUgPSAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFibGUuZmluZChgLm1ldGFfZWRpdGFibGVgKS5lZGl0YWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhVGFibGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50YWJsZSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoW3RoaXMudGFibGVJZF0pKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhVGFibGUgPSB0aGlzLnRhYmxlLkRhdGFUYWJsZSh7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcclxuICAgICAgICAgICAgICAgIC8vIHNldHVwIHVzZXMgc2Nyb2xsYWJsZSBkaXYodGFibGUtc2Nyb2xsYWJsZSkgd2l0aCBvdmVyZmxvdzphdXRvIHRvIGVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGwoc2VlOiBhc3NldHMvZ2xvYmFsL3BsdWdpbnMvZGF0YXRhYmxlcy9wbHVnaW5zL2Jvb3RzdHJhcC9kYXRhVGFibGVzLmJvb3RzdHJhcC5qcykuXHJcbiAgICAgICAgICAgICAgICAvLyBTbyB3aGVuIGRyb3Bkb3ducyB1c2VkIHRoZSBzY3JvbGxhYmxlIGRpdiBzaG91bGQgYmUgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxyXG4gICAgICAgICAgICAgICAgLy8nYlN0YXRlU2F2ZSc6IHRydWUsIC8vIHNhdmUgZGF0YXRhYmxlIHN0YXRlKHBhZ2luYXRpb24sIHNvcnQsIGV0YykgaW4gY29va2llLlxyXG4gICAgICAgICAgICAgICAgJ2NvbHVtbnMnOiB0aGlzLmNvbHVtbnNcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFibGVXcmFwcGVyID0gdGhpcy50YWJsZS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKGAjJHt0aGlzLnRhYmxlSWR9X3RhYmxlX3dyYXBwZXJgKTtcclxuXHJcbiAgICAgICAgICAgIHRhYmxlV3JhcHBlci5maW5kKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0JykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCBpbnB1dC14c21hbGwgaW5wdXQtaW5saW5lJyk7IC8vIG1vZGlmeSB0YWJsZSBwZXIgcGFnZSBkcm9wZG93blxyXG5cclxuICAgICAgICAgICAgIHRoaXMudGFibGUuZmluZChgLm1ldGFfZWRpdGFibGVgKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuZGF0YXNldC5waztcclxuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLkNPVVJTRV9MSVNUfS8ke2lkfS9uYW1lYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vUmlvdCBiaW5kaW5nc1xyXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgb25jZSA9IF8ub25jZSgoKSA9PiB7XHJcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLlRSQUlOSU5HUy5mb3JtYXQodGhpcy51c2VyLnVzZXJJZCksIChsaXN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqLmlkID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZSgwLCB0aGlzLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgb25jZSgpXHJcbiAgICB9KVxyXG5cclxufSk7IiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcbi8qKlxyXG5EZW1vIHNjcmlwdCB0byBoYW5kbGUgdGhlIHRoZW1lIGRlbW9cclxuKiovXHJcbnZhciBEZW1vID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIEhhbmRsZSBUaGVtZSBTZXR0aW5nc1xyXG4gICAgdmFyIGhhbmRsZVRoZW1lID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgcGFuZWwgPSAkKCcudGhlbWUtcGFuZWwnKTtcclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1ib3hlZCcpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAkKCcubGF5b3V0LW9wdGlvbicsIHBhbmVsKS52YWwoXCJmbHVpZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJkZWZhdWx0XCIpO1xyXG4gICAgICAgICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XHJcbiAgICAgICAgJCgnLnBhZ2UtZm9vdGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJkZWZhdWx0XCIpO1xyXG4gICAgICAgIGlmICgkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJykuYXR0cihcImRpc2FibGVkXCIpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbChNZXRyb25pYy5pc1JUTCgpID8gJ3JpZ2h0JyA6ICdsZWZ0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2hhbmRsZSB0aGVtZSBsYXlvdXRcclxuICAgICAgICB2YXIgcmVzZXRMYXlvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5cclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWJveGVkXCIpLlxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpLlxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKS5cclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKS5cclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XHJcblxyXG4gICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgPiAucGFnZS1oZWFkZXItaW5uZXInKS5yZW1vdmVDbGFzcyhcImNvbnRhaW5lclwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkKCcucGFnZS1jb250YWluZXInKS5wYXJlbnQoXCIuY29udGFpbmVyXCIpLnNpemUoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtY29udGFpbmVyJykuaW5zZXJ0QWZ0ZXIoJ2JvZHkgPiAuY2xlYXJmaXgnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWZvb3RlciA+IC5jb250YWluZXInKS5zaXplKCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmh0bWwoJCgnLnBhZ2UtZm9vdGVyID4gLmNvbnRhaW5lcicpLmh0bWwoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCgnLnBhZ2UtZm9vdGVyJykucGFyZW50KFwiLmNvbnRhaW5lclwiKS5zaXplKCkgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmluc2VydEFmdGVyKCcucGFnZS1jb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuaW5zZXJ0QWZ0ZXIoJy5wYWdlLWZvb3RlcicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiLnRvcC1tZW51ID4gLm5hdmJhci1uYXYgPiBsaS5kcm9wZG93blwiKS5yZW1vdmVDbGFzcyhcImRyb3Bkb3duLWRhcmtcIik7XHJcblxyXG4gICAgICAgICAgICAkKCdib2R5ID4gLmNvbnRhaW5lcicpLnJlbW92ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBsYXN0U2VsZWN0ZWRMYXlvdXQgPSAnJztcclxuXHJcbiAgICAgICAgdmFyIHNldExheW91dCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBsYXlvdXRPcHRpb24gPSAkKCcubGF5b3V0LW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXJPcHRpb24gPSAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXJPcHRpb24gPSAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgZm9vdGVyT3B0aW9uID0gJCgnLnBhZ2UtZm9vdGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXJQb3NPcHRpb24gPSAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhclN0eWxlT3B0aW9uID0gJCgnLnNpZGViYXItc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhck1lbnVPcHRpb24gPSAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIGhlYWRlclRvcERyb3Bkb3duU3R5bGUgPSAkKCcucGFnZS1oZWFkZXItdG9wLWRyb3Bkb3duLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PSBcImZpeGVkXCIgJiYgaGVhZGVyT3B0aW9uID09IFwiZGVmYXVsdFwiKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnRGVmYXVsdCBIZWFkZXIgd2l0aCBGaXhlZCBTaWRlYmFyIG9wdGlvbiBpcyBub3Qgc3VwcG9ydGVkLiBQcm9jZWVkIHdpdGggRml4ZWQgSGVhZGVyIHdpdGggRml4ZWQgU2lkZWJhci4nKTtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyT3B0aW9uID0gJ2ZpeGVkJztcclxuICAgICAgICAgICAgICAgIGhlYWRlck9wdGlvbiA9ICdmaXhlZCc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc2V0TGF5b3V0KCk7IC8vIHJlc2V0IGxheW91dCB0byBkZWZhdWx0IHN0YXRlXHJcblxyXG4gICAgICAgICAgICBpZiAobGF5b3V0T3B0aW9uID09PSBcImJveGVkXCIpIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2UtYm94ZWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2V0IGhlYWRlclxyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyID4gLnBhZ2UtaGVhZGVyLWlubmVyJykuYWRkQ2xhc3MoXCJjb250YWluZXJcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udCA9ICQoJ2JvZHkgPiAuY2xlYXJmaXgnKS5hZnRlcignPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PicpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNldCBjb250ZW50XHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1jb250YWluZXInKS5hcHBlbmRUbygnYm9keSA+IC5jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgZm9vdGVyXHJcbiAgICAgICAgICAgICAgICBpZiAoZm9vdGVyT3B0aW9uID09PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPicgKyAkKCcucGFnZS1mb290ZXInKS5odG1sKCkgKyAnPC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmFwcGVuZFRvKCdib2R5ID4gLmNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobGFzdFNlbGVjdGVkTGF5b3V0ICE9IGxheW91dE9wdGlvbikge1xyXG4gICAgICAgICAgICAgICAgLy9sYXlvdXQgY2hhbmdlZCwgcnVuIHJlc3BvbnNpdmUgaGFuZGxlcjpcclxuICAgICAgICAgICAgICAgIE1ldHJvbmljLnJ1blJlc2l6ZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGFzdFNlbGVjdGVkTGF5b3V0ID0gbGF5b3V0T3B0aW9uO1xyXG5cclxuICAgICAgICAgICAgLy9oZWFkZXJcclxuICAgICAgICAgICAgaWYgKGhlYWRlck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFkZENsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2UtaGVhZGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2YmFyLXN0YXRpYy10b3BcIikuYWRkQ2xhc3MoXCJuYXZiYXItZml4ZWQtdG9wXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1oZWFkZXItZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2UtaGVhZGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2YmFyLWZpeGVkLXRvcFwiKS5hZGRDbGFzcyhcIm5hdmJhci1zdGF0aWMtdG9wXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3NpZGViYXJcclxuICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1mdWxsLXdpZHRoJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1maXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwicGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1kZWZhdWx0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIExheW91dC5pbml0Rml4ZWRTaWRlYmFySG92ZXJFZmZlY3QoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWRlZmF1bHRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInBhZ2Utc2lkZWJhci1tZW51XCIpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtZml4ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhci1tZW51JykudW5iaW5kKCdtb3VzZWVudGVyJykudW5iaW5kKCdtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRvcCBkcm9wZG93biBzdHlsZVxyXG4gICAgICAgICAgICBpZiAoaGVhZGVyVG9wRHJvcGRvd25TdHlsZSA9PT0gJ2RhcmsnKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnRvcC1tZW51ID4gLm5hdmJhci1uYXYgPiBsaS5kcm9wZG93blwiKS5hZGRDbGFzcyhcImRyb3Bkb3duLWRhcmtcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnRvcC1tZW51ID4gLm5hdmJhci1uYXYgPiBsaS5kcm9wZG93blwiKS5yZW1vdmVDbGFzcyhcImRyb3Bkb3duLWRhcmtcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vZm9vdGVyXHJcbiAgICAgICAgICAgIGlmIChmb290ZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc2lkZWJhciBzdHlsZVxyXG4gICAgICAgICAgICBpZiAoc2lkZWJhclN0eWxlT3B0aW9uID09PSAnY29tcGFjdCcpIHtcclxuICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1jb21wYWN0XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNvbXBhY3RcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc2lkZWJhciBtZW51XHJcbiAgICAgICAgICAgIGlmIChzaWRlYmFyTWVudU9wdGlvbiA9PT0gJ2hvdmVyJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJPcHRpb24gPT0gJ2ZpeGVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbChcImFjY29yZGlvblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkhvdmVyIFNpZGViYXIgTWVudSBpcyBub3QgY29tcGF0aWJsZSB3aXRoIEZpeGVkIFNpZGViYXIgTW9kZS4gU2VsZWN0IERlZmF1bHQgU2lkZWJhciBNb2RlIEluc3RlYWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3NpZGViYXIgcG9zaXRpb25cclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmlzUlRMKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyUG9zT3B0aW9uID09PSAnbGVmdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ3JpZ2h0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ2xlZnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhclBvc09wdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZnJvbnRlbmQtbGluaycpLnRvb2x0aXAoJ2Rlc3Ryb3knKS50b29sdGlwKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAnbGVmdCdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdyaWdodCdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTGF5b3V0LmZpeENvbnRlbnRIZWlnaHQoKTsgLy8gZml4IGNvbnRlbnQgaGVpZ2h0XHJcbiAgICAgICAgICAgIExheW91dC5pbml0Rml4ZWRTaWRlYmFyKCk7IC8vIHJlaW5pdGlhbGl6ZSBmaXhlZCBzaWRlYmFyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHRoZW1lIGNvbG9yc1xyXG4gICAgICAgIHZhciBzZXRDb2xvciA9IGZ1bmN0aW9uIChjb2xvcikge1xyXG4gICAgICAgICAgICB2YXIgY29sb3JfID0gKE1ldHJvbmljLmlzUlRMKCkgPyBjb2xvciArICctcnRsJyA6IGNvbG9yKTtcclxuICAgICAgICAgICAgJCgnI3N0eWxlX2NvbG9yJykuYXR0cihcImhyZWZcIiwgTGF5b3V0LmdldExheW91dENzc1BhdGgoKSArICd0aGVtZXMvJyArIGNvbG9yXyArIFwiLmNzc1wiKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgJCgnLnRoZW1lLWNvbG9ycyA+IGxpJywgcGFuZWwpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbG9yID0gJCh0aGlzKS5hdHRyKFwiZGF0YS10aGVtZVwiKTtcclxuICAgICAgICAgICAgc2V0Q29sb3IoY29sb3IpO1xyXG4gICAgICAgICAgICAkKCd1bCA+IGxpJywgcGFuZWwpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbG9yID09PSAnZGFyaycpIHtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWFjdGlvbnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdyZWQtaGF6ZScpLmFkZENsYXNzKCdidG4tZGVmYXVsdCBidG4tdHJhbnNwYXJlbnQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWFjdGlvbnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdidG4tZGVmYXVsdCBidG4tdHJhbnNwYXJlbnQnKS5hZGRDbGFzcygncmVkLWhhemUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBzZXQgZGVmYXVsdCB0aGVtZSBvcHRpb25zOlxyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1ib3hlZFwiKSkge1xyXG4gICAgICAgICAgICAkKCcubGF5b3V0LW9wdGlvbicsIHBhbmVsKS52YWwoXCJib3hlZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIikpIHtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtaGVhZGVyLWZpeGVkXCIpKSB7XHJcbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikpIHtcclxuICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIikpIHtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItcG9zLW9wdGlvbicsIHBhbmVsKS52YWwoXCJyaWdodFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtbGlnaHRcIikpIHtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbChcImxpZ2h0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51XCIpKSB7XHJcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbChcImhvdmVyXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNpZGViYXJPcHRpb24gPSAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXJPcHRpb24gPSAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgZm9vdGVyT3B0aW9uID0gJCgnLnBhZ2UtZm9vdGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXJQb3NPcHRpb24gPSAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhclN0eWxlT3B0aW9uID0gJCgnLnNpZGViYXItc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhck1lbnVPcHRpb24gPSAkKCcuc2lkZWJhci1tZW51LW9wdGlvbicsIHBhbmVsKS52YWwoKTtcclxuXHJcbiAgICAgICAgJCgnLmxheW91dC1vcHRpb24sIC5wYWdlLWhlYWRlci10b3AtZHJvcGRvd24tc3R5bGUtb3B0aW9uLCAucGFnZS1oZWFkZXItb3B0aW9uLCAuc2lkZWJhci1vcHRpb24sIC5wYWdlLWZvb3Rlci1vcHRpb24sIC5zaWRlYmFyLXBvcy1vcHRpb24sIC5zaWRlYmFyLXN0eWxlLW9wdGlvbiwgLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkuY2hhbmdlKHNldExheW91dCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGhhbmRsZSB0aGVtZSBzdHlsZVxyXG4gICAgdmFyIHNldFRoZW1lU3R5bGUgPSBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIHZhciBmaWxlID0gKHN0eWxlID09PSAncm91bmRlZCcgPyAnY29tcG9uZW50cy1yb3VuZGVkJyA6ICdjb21wb25lbnRzJyk7XHJcbiAgICAgICAgZmlsZSA9IChNZXRyb25pYy5pc1JUTCgpID8gZmlsZSArICctcnRsJyA6IGZpbGUpO1xyXG5cclxuICAgICAgICAkKCcjc3R5bGVfY29tcG9uZW50cycpLmF0dHIoXCJocmVmXCIsIE1ldHJvbmljLmdldEdsb2JhbENzc1BhdGgoKSArIGZpbGUgKyBcIi5jc3NcIik7XHJcblxyXG4gICAgICAgIGlmICgkLmNvb2tpZSkge1xyXG4gICAgICAgICAgICAkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicsIHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgIC8vbWFpbiBmdW5jdGlvbiB0byBpbml0aWF0ZSB0aGUgdGhlbWVcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gaGFuZGxlcyBzdHlsZSBjdXN0b21lciB0b29sXHJcbiAgICAgICAgICAgIGhhbmRsZVRoZW1lKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBoYW5kbGUgbGF5b3V0IHN0eWxlIGNoYW5nZVxyXG4gICAgICAgICAgICAkKCcudGhlbWUtcGFuZWwgLmxheW91dC1zdHlsZS1vcHRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgc2V0VGhlbWVTdHlsZSgkKHRoaXMpLnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgbGF5b3V0IHN0eWxlIGZyb20gY29va2llXHJcbiAgICAgICAgICAgIGlmICgkLmNvb2tpZSAmJiAkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicpID09PSAncm91bmRlZCcpIHtcclxuICAgICAgICAgICAgICAgIHNldFRoZW1lU3R5bGUoJC5jb29raWUoJ2xheW91dC1zdHlsZS1vcHRpb24nKSk7XHJcbiAgICAgICAgICAgICAgICAkKCcudGhlbWUtcGFuZWwgLmxheW91dC1zdHlsZS1vcHRpb24nKS52YWwoJC5jb29raWUoJ2xheW91dC1zdHlsZS1vcHRpb24nKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSAoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVtbyIsImNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxyXG5jb25zdCBNZXRyb25pYyA9IHJlcXVpcmUoJy4vbWV0cm9uaWMnKVxyXG4vKipcclxuQ29yZSBzY3JpcHQgdG8gaGFuZGxlIHRoZSBlbnRpcmUgdGhlbWUgYW5kIGNvcmUgZnVuY3Rpb25zXHJcbioqL1xyXG52YXIgTGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIGxheW91dEltZ1BhdGggPSAnYWRtaW4vbGF5b3V0NC9pbWcvJztcclxuXHJcbiAgICB2YXIgbGF5b3V0Q3NzUGF0aCA9ICdhZG1pbi9sYXlvdXQ0L2Nzcy8nO1xyXG5cclxuICAgIHZhciByZXNCcmVha3BvaW50TWQgPSBNZXRyb25pYy5nZXRSZXNwb25zaXZlQnJlYWtwb2ludCgnbWQnKTtcclxuXHJcbiAgICAvLyogQkVHSU46Q09SRSBIQU5ETEVSUyAqLy9cclxuICAgIC8vIHRoaXMgZnVuY3Rpb24gaGFuZGxlcyByZXNwb25zaXZlIGxheW91dCBvbiBzY3JlZW4gc2l6ZSByZXNpemUgb3IgbW9iaWxlIGRldmljZSByb3RhdGUuXHJcblxyXG5cclxuICAgIC8vIEhhbmRsZSBzaWRlYmFyIG1lbnUgbGlua3NcclxuICAgIHZhciBoYW5kbGVTaWRlYmFyTWVudUFjdGl2ZUxpbmsgPSBmdW5jdGlvbihtb2RlLCBlbCkge1xyXG4gICAgICAgIHZhciB1cmwgPSBsb2NhdGlvbi5oYXNoLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XHJcblxyXG4gICAgICAgIGlmIChtb2RlID09PSAnY2xpY2snIHx8IG1vZGUgPT09ICdzZXQnKSB7XHJcbiAgICAgICAgICAgIGVsID0gJChlbCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnbWF0Y2gnKSB7XHJcbiAgICAgICAgICAgIG1lbnUuZmluZChcImxpID4gYVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB1cmwgbWF0Y2ggY29uZGl0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC5sZW5ndGggPiAxICYmIHVybC5zdWJzdHIoMSwgcGF0aC5sZW5ndGggLSAxKSA9PSBwYXRoLnN1YnN0cigxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFlbCB8fCBlbC5zaXplKCkgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZWwuYXR0cignaHJlZicpLnRvTG93ZXJDYXNlKCkgPT09ICdqYXZhc2NyaXB0OjsnIHx8IGVsLmF0dHIoJ2hyZWYnKS50b0xvd2VyQ2FzZSgpID09PSAnIycpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNsaWRlU3BlZWQgPSBwYXJzZUludChtZW51LmRhdGEoXCJzbGlkZS1zcGVlZFwiKSk7XHJcbiAgICAgICAgdmFyIGtlZXBFeHBhbmQgPSBtZW51LmRhdGEoXCJrZWVwLWV4cGFuZGVkXCIpO1xyXG5cclxuICAgICAgICAvLyBkaXNhYmxlIGFjdGl2ZSBzdGF0ZXNcclxuICAgICAgICBtZW51LmZpbmQoJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICBtZW51LmZpbmQoJ2xpID4gYSA+IC5zZWxlY3RlZCcpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBpZiAobWVudS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudScpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBtZW51LmZpbmQoJ2xpLm9wZW4nKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5jaGlsZHJlbignLnN1Yi1tZW51Jykuc2l6ZSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnPiBhID4gLmFycm93Lm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgbWVudS5maW5kKCdsaS5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsLnBhcmVudHMoJ2xpJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz4gYSA+IHNwYW4uYXJyb3cnKS5hZGRDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50KCd1bC5wYWdlLXNpZGViYXItbWVudScpLnNpemUoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+IGEnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwic2VsZWN0ZWRcIj48L3NwYW4+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmNoaWxkcmVuKCd1bC5zdWItbWVudScpLnNpemUoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChtb2RlID09PSAnY2xpY2snKSB7XHJcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZSBzaWRlYmFyIG1lbnVcclxuICAgIHZhciBoYW5kbGVTaWRlYmFyTWVudSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnbGkgPiBhJywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPj0gcmVzQnJlYWtwb2ludE1kICYmICQodGhpcykucGFyZW50cygnLnBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnUnKS5zaXplKCkgPT09IDEpIHsgLy8gZXhpdCBvZiBob3ZlciBzaWRlYmFyIG1lbnVcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCQodGhpcykubmV4dCgpLmhhc0NsYXNzKCdzdWItbWVudScpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLm5leHQoKS5oYXNDbGFzcygnc3ViLW1lbnUgYWx3YXlzLW9wZW4nKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKTtcclxuICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XHJcbiAgICAgICAgICAgIHZhciBzdWIgPSAkKHRoaXMpLm5leHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhdXRvU2Nyb2xsID0gbWVudS5kYXRhKFwiYXV0by1zY3JvbGxcIik7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZVNwZWVkID0gcGFyc2VJbnQobWVudS5kYXRhKFwic2xpZGUtc3BlZWRcIikpO1xyXG4gICAgICAgICAgICB2YXIga2VlcEV4cGFuZCA9IG1lbnUuZGF0YShcImtlZXAtZXhwYW5kZWRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoa2VlcEV4cGFuZCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuKCdsaS5vcGVuJykuY2hpbGRyZW4oJ2EnKS5jaGlsZHJlbignLmFycm93JykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbignbGkub3BlbicpLmNoaWxkcmVuKCcuc3ViLW1lbnU6bm90KC5hbHdheXMtb3BlbiknKS5zbGlkZVVwKHNsaWRlU3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuKCdsaS5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHNsaWRlT2ZmZXNldCA9IC0yMDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3ViLmlzKFwiOnZpc2libGVcIikpIHtcclxuICAgICAgICAgICAgICAgICQoJy5hcnJvdycsICQodGhpcykpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgc3ViLnNsaWRlVXAoc2xpZGVTcGVlZCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF1dG9TY3JvbGwgPT09IHRydWUgJiYgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXNpZGViYXItY2xvc2VkJykgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51LnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzY3JvbGxUbyc6ICh0aGUucG9zaXRpb24oKSkudG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvKHRoZSwgc2xpZGVPZmZlc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLmFycm93JywgJCh0aGlzKSkuYWRkQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICBzdWIuc2xpZGVEb3duKHNsaWRlU3BlZWQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvU2Nyb2xsID09PSB0cnVlICYmICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXNpZGViYXItZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5zbGltU2Nyb2xsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2Nyb2xsVG8nOiAodGhlLnBvc2l0aW9uKCkpLnRvcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbyh0aGUsIHNsaWRlT2ZmZXNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgYWpheCBsaW5rcyB3aXRoaW4gc2lkZWJhciBtZW51XHJcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICcgbGkgPiBhLmFqYXhpZnknLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG9wKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuICAgICAgICAgICAgdmFyIG1lbnVDb250YWluZXIgPSAkKCcucGFnZS1zaWRlYmFyIHVsJyk7XHJcbiAgICAgICAgICAgIHZhciBwYWdlQ29udGVudCA9ICQoJy5wYWdlLWNvbnRlbnQnKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50Qm9keSA9ICQoJy5wYWdlLWNvbnRlbnQgLnBhZ2UtY29udGVudC1ib2R5Jyk7XHJcblxyXG4gICAgICAgICAgICBtZW51Q29udGFpbmVyLmNoaWxkcmVuKCdsaS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIG1lbnVDb250YWluZXIuY2hpbGRyZW4oJ2Fycm93Lm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCdsaScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykuY2hpbGRyZW4oJ2EgPiBzcGFuLmFycm93JykuYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnbGknKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBNZXRyb25pYy5zdGFydFBhZ2VMb2FkaW5nKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZS5wYXJlbnRzKCdsaS5vcGVuJykuc2l6ZSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXItbWVudSA+IGxpLm9wZW4gPiBhJykuY2xpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgTGF5b3V0LmZpeENvbnRlbnRIZWlnaHQoKTsgLy8gZml4IGNvbnRlbnQgaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdEFqYXgoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHN0dWZmXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwoJzxoND5Db3VsZCBub3QgbG9hZCB0aGUgcmVxdWVzdGVkIGNvbnRlbnQuPC9oND4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBhamF4IGxpbmsgd2l0aGluIG1haW4gY29udGVudFxyXG4gICAgICAgICQoJy5wYWdlLWNvbnRlbnQnKS5vbignY2xpY2snLCAnLmFqYXhpZnknLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG9wKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJsID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2VDb250ZW50ID0gJCgnLnBhZ2UtY29udGVudCcpO1xyXG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnRCb2R5ID0gJCgnLnBhZ2UtY29udGVudCAucGFnZS1jb250ZW50LWJvZHknKTtcclxuXHJcbiAgICAgICAgICAgIE1ldHJvbmljLnN0YXJ0UGFnZUxvYWRpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXHJcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbChyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIExheW91dC5maXhDb250ZW50SGVpZ2h0KCk7IC8vIGZpeCBjb250ZW50IGhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLmluaXRBamF4KCk7IC8vIGluaXRpYWxpemUgY29yZSBzdHVmZlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKCc8aDQ+Q291bGQgbm90IGxvYWQgdGhlIHJlcXVlc3RlZCBjb250ZW50LjwvaDQ+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgc2Nyb2xsaW5nIHRvIHRvcCBvbiByZXNwb25zaXZlIG1lbnUgdG9nZ2xlciBjbGljayB3aGVuIGhlYWRlciBpcyBmaXhlZCBmb3IgbW9iaWxlIHZpZXdcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnBhZ2UtaGVhZGVyLWZpeGVkLW1vYmlsZSAucmVzcG9uc2l2ZS10b2dnbGVyJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjYWxjdWxhdGUgc2lkZWJhciBoZWlnaHQgZm9yIGZpeGVkIHNpZGViYXIgbGF5b3V0LlxyXG4gICAgdmFyIF9jYWxjdWxhdGVGaXhlZFNpZGViYXJWaWV3cG9ydEhlaWdodCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzaWRlYmFySGVpZ2h0ID0gTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS5oZWlnaHQgLSAkKCcucGFnZS1oZWFkZXInKS5vdXRlckhlaWdodCgpIC0gMzA7XHJcbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpKSB7XHJcbiAgICAgICAgICAgIHNpZGViYXJIZWlnaHQgPSBzaWRlYmFySGVpZ2h0IC0gJCgnLnBhZ2UtZm9vdGVyJykub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaWRlYmFySGVpZ2h0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIGZpeGVkIHNpZGViYXJcclxuICAgIHZhciBoYW5kbGVGaXhlZFNpZGViYXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbWVudSA9ICQoJy5wYWdlLXNpZGViYXItbWVudScpO1xyXG5cclxuICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChtZW51KTtcclxuXHJcbiAgICAgICAgaWYgKCQoJy5wYWdlLXNpZGViYXItZml4ZWQnKS5zaXplKCkgPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPj0gcmVzQnJlYWtwb2ludE1kKSB7XHJcbiAgICAgICAgICAgIG1lbnUuYXR0cihcImRhdGEtaGVpZ2h0XCIsIF9jYWxjdWxhdGVGaXhlZFNpZGViYXJWaWV3cG9ydEhlaWdodCgpKTtcclxuICAgICAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwobWVudSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIHNpZGViYXIgdG9nZ2xlciB0byBjbG9zZS9oaWRlIHRoZSBzaWRlYmFyLlxyXG4gICAgdmFyIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBib2R5ID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpO1xyXG4gICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyJykub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcucGFnZS1zaWRlYmFyLW1lbnUnKS5yZW1vdmVDbGFzcygncGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuaGFzQ2xhc3MoJ3BhZ2Utc2lkZWJhci1jbG9zZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnBhZ2Utc2lkZWJhci1tZW51JykuYWRkQ2xhc3MoJ3BhZ2Utc2lkZWJhci1tZW51LWNsb3NlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmxlcyBzaWRlYmFyIHRvZ2dsZXJcclxuICAgIHZhciBoYW5kbGVTaWRlYmFyVG9nZ2xlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBib2R5ID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgc2lkZWJhciBzaG93L2hpZGVcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5zaWRlYmFyLXRvZ2dsZXInLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyID0gJCgnLnBhZ2Utc2lkZWJhcicpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhck1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcclxuICAgICAgICAgICAgJChcIi5zaWRlYmFyLXNlYXJjaFwiLCBzaWRlYmFyKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIikpIHtcclxuICAgICAgICAgICAgICAgIGJvZHkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhck1lbnUucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1jbG9zZWRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoJC5jb29raWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmNvb2tpZSgnc2lkZWJhcl9jbG9zZWQnLCAnMCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYm9keS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIik7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNsb3NlZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2lkZWJhck1lbnUudHJpZ2dlcihcIm1vdXNlbGVhdmVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoJC5jb29raWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmNvb2tpZSgnc2lkZWJhcl9jbG9zZWQnLCAnMScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSB0aGUgc2VhcmNoIGJhciBjbG9zZVxyXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnLnNpZGViYXItc2VhcmNoIC5yZW1vdmUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgdGhlIHNlYXJjaCBxdWVyeSBzdWJtaXQgb24gZW50ZXIgcHJlc3NcclxuICAgICAgICAkKCcucGFnZS1zaWRlYmFyIC5zaWRlYmFyLXNlYXJjaCcpLm9uKCdrZXlwcmVzcycsICdpbnB1dC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy88LS0tLSBBZGQgdGhpcyBsaW5lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggc3VibWl0KGZvciBzaWRlYmFyIHNlYXJjaCBhbmQgcmVzcG9uc2l2ZSBtb2RlIG9mIHRoZSBoZWFkZXIgc2VhcmNoKVxyXG4gICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCAuc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCgnLnNpZGViYXItc2VhcmNoJykuaGFzQ2xhc3MoJ29wZW4nKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnLnBhZ2Utc2lkZWJhci1maXhlZCcpLnNpemUoKSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyIC5zaWRlYmFyLXRvZ2dsZXInKS5jbGljaygpOyAvL3RyaWdnZXIgc2lkZWJhciB0b2dnbGUgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLmFkZENsYXNzKFwib3BlblwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBoYW5kbGUgY2xvc2Ugb24gYm9keSBjbGlja1xyXG4gICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5zaXplKCkgIT09IDApIHtcclxuICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoIC5pbnB1dC1ncm91cCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXNlYXJjaCcpLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2gnKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyB0aGUgaG9yaXpvbnRhbCBtZW51XHJcbiAgICB2YXIgaGFuZGxlSGVhZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gaGFuZGxlIHNlYXJjaCBib3ggZXhwYW5kL2NvbGxhcHNlXHJcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyJykub24oJ2NsaWNrJywgJy5zZWFyY2gtZm9ybScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcIm9wZW5cIik7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmZvcm0tY29udHJvbCcpLmZvY3VzKCk7XHJcblxyXG4gICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnNlYXJjaC1mb3JtIC5mb3JtLWNvbnRyb2wnKS5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS51bmJpbmQoXCJibHVyXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIGhvciBtZW51IHNlYXJjaCBmb3JtIG9uIGVudGVyIHByZXNzXHJcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyJykub24oJ2tleXByZXNzJywgJy5ob3ItbWVudSAuc2VhcmNoLWZvcm0gLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIGhlYWRlciBzZWFyY2ggYnV0dG9uIGNsaWNrXHJcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyJykub24oJ21vdXNlZG93bicsICcuc2VhcmNoLWZvcm0ub3BlbiAuc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykuc3VibWl0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgdGhlIGdvIHRvIHRvcCBidXR0b24gYXQgdGhlIGZvb3RlclxyXG4gICAgdmFyIGhhbmRsZUdvVG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IDMwMDtcclxuICAgICAgICB2YXIgZHVyYXRpb24gPSA1MDA7XHJcblxyXG4gICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpKSB7IC8vIGlvcyBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJ0b3VjaGVuZCB0b3VjaGNhbmNlbCB0b3VjaGxlYXZlXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlSW4oZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVPdXQoZHVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgeyAvLyBnZW5lcmFsXHJcbiAgICAgICAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IG9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuZmFkZUluKGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlT3V0KGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcclxuICAgICAgICAgICAgfSwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLy8qIEVORDpDT1JFIEhBTkRMRVJTICovL1xyXG5cclxuICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgIC8vIE1haW4gaW5pdCBtZXRob2RzIHRvIGluaXRpYWxpemUgdGhlIGxheW91dFxyXG4gICAgICAgIC8vIElNUE9SVEFOVCEhITogRG8gbm90IG1vZGlmeSB0aGUgY29yZSBoYW5kbGVycyBjYWxsIG9yZGVyLlxyXG5cclxuICAgICAgICBpbml0SGVhZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlSGVhZGVyKCk7IC8vIGhhbmRsZXMgaG9yaXpvbnRhbCBtZW51XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0U2lkZWJhck1lbnVBY3RpdmVMaW5rOiBmdW5jdGlvbihtb2RlLCBlbCkge1xyXG4gICAgICAgICAgICBoYW5kbGVTaWRlYmFyTWVudUFjdGl2ZUxpbmsobW9kZSwgZWwpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRTaWRlYmFyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy9sYXlvdXQgaGFuZGxlcnNcclxuICAgICAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFyKCk7IC8vIGhhbmRsZXMgZml4ZWQgc2lkZWJhciBtZW51XHJcbiAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51KCk7IC8vIGhhbmRsZXMgbWFpbiBtZW51XHJcbiAgICAgICAgICAgIGhhbmRsZVNpZGViYXJUb2dnbGVyKCk7IC8vIGhhbmRsZXMgc2lkZWJhciBoaWRlL3Nob3dcclxuXHJcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5pc0FuZ3VsYXJKc0FwcCgpKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVTaWRlYmFyTWVudUFjdGl2ZUxpbmsoJ21hdGNoJyk7IC8vIGluaXQgc2lkZWJhciBhY3RpdmUgbGlua3NcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTWV0cm9uaWMuYWRkUmVzaXplSGFuZGxlcihoYW5kbGVGaXhlZFNpZGViYXIpOyAvLyByZWluaXRpYWxpemUgZml4ZWQgc2lkZWJhciBvbiB3aW5kb3cgcmVzaXplXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdENvbnRlbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdEZvb3RlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUdvVG9wKCk7IC8vaGFuZGxlcyBzY3JvbGwgdG8gdG9wIGZ1bmN0aW9uYWxpdHkgaW4gdGhlIGZvb3RlclxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0SGVhZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFNpZGViYXIoKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0Q29udGVudCgpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRGb290ZXIoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBmaXggdGhlIHNpZGViYXIgYW5kIGNvbnRlbnQgaGVpZ2h0IGFjY29yZGluZ2x5XHJcbiAgICAgICAgZml4Q29udGVudEhlaWdodDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0Rml4ZWRTaWRlYmFySG92ZXJFZmZlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXJIb3ZlckVmZmVjdCgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRGaXhlZFNpZGViYXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXIoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRMYXlvdXRJbWdQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1ldHJvbmljLmdldEFzc2V0c1BhdGgoKSArIGxheW91dEltZ1BhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0TGF5b3V0Q3NzUGF0aDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNZXRyb25pYy5nZXRBc3NldHNQYXRoKCkgKyBsYXlvdXRDc3NQYXRoO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG59ICgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXQ7IiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXHJcblxyXG4vKipcclxuQ29yZSBzY3JpcHQgdG8gaGFuZGxlIHRoZSBlbnRpcmUgdGhlbWUgYW5kIGNvcmUgZnVuY3Rpb25zXHJcbioqL1xyXG52YXIgTWV0cm9uaWMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvLyBJRSBtb2RlXHJcbiAgICB2YXIgaXNSVEwgPSBmYWxzZTtcclxuICAgIHZhciBpc0lFOCA9IGZhbHNlO1xyXG4gICAgdmFyIGlzSUU5ID0gZmFsc2U7XHJcbiAgICB2YXIgaXNJRTEwID0gZmFsc2U7XHJcblxyXG4gICAgdmFyIHJlc2l6ZUhhbmRsZXJzID0gW107XHJcblxyXG4gICAgdmFyIGFzc2V0c1BhdGggPSAnLi4vLi4vYXNzZXRzLyc7XHJcblxyXG4gICAgdmFyIGdsb2JhbEltZ1BhdGggPSAnZ2xvYmFsL2ltZy8nO1xyXG5cclxuICAgIHZhciBnbG9iYWxQbHVnaW5zUGF0aCA9ICdnbG9iYWwvcGx1Z2lucy8nO1xyXG5cclxuICAgIHZhciBnbG9iYWxDc3NQYXRoID0gJ2dsb2JhbC9jc3MvJztcclxuXHJcbiAgICAvLyB0aGVtZSBsYXlvdXQgY29sb3Igc2V0XHJcblxyXG4gICAgdmFyIGJyYW5kQ29sb3JzID0ge1xyXG4gICAgICAgICdibHVlJzogJyM4OUM0RjQnLFxyXG4gICAgICAgICdyZWQnOiAnI0YzNTY1RCcsXHJcbiAgICAgICAgJ2dyZWVuJzogJyMxYmJjOWInLFxyXG4gICAgICAgICdwdXJwbGUnOiAnIzliNTliNicsXHJcbiAgICAgICAgJ2dyZXknOiAnIzk1YTVhNicsXHJcbiAgICAgICAgJ3llbGxvdyc6ICcjRjhDQjAwJ1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBpbml0aWFsaXplcyBtYWluIHNldHRpbmdzXHJcbiAgICB2YXIgaGFuZGxlSW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmNzcygnZGlyZWN0aW9uJykgPT09ICdydGwnKSB7XHJcbiAgICAgICAgICAgIGlzUlRMID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlzSUU4ID0gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFIDguMC8pO1xyXG4gICAgICAgIGlzSUU5ID0gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFIDkuMC8pO1xyXG4gICAgICAgIGlzSUUxMCA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTVNJRSAxMC4wLyk7XHJcblxyXG4gICAgICAgIGlmIChpc0lFMTApIHtcclxuICAgICAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpZTEwJyk7IC8vIGRldGVjdCBJRTEwIHZlcnNpb25cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc0lFMTAgfHwgaXNJRTkgfHwgaXNJRTgpIHtcclxuICAgICAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpZScpOyAvLyBkZXRlY3QgSUUxMCB2ZXJzaW9uXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBydW5zIGNhbGxiYWNrIGZ1bmN0aW9ucyBzZXQgYnkgTWV0cm9uaWMuYWRkUmVzcG9uc2l2ZUhhbmRsZXIoKS5cclxuICAgIHZhciBfcnVuUmVzaXplSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyByZWluaXRpYWxpemUgb3RoZXIgc3Vic2NyaWJlZCBlbGVtZW50c1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzaXplSGFuZGxlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVhY2ggPSByZXNpemVIYW5kbGVyc1tpXTtcclxuICAgICAgICAgICAgZWFjaC5jYWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBoYW5kbGUgdGhlIGxheW91dCByZWluaXRpYWxpemF0aW9uIG9uIHdpbmRvdyByZXNpemVcclxuICAgIHZhciBoYW5kbGVPblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciByZXNpemU7XHJcbiAgICAgICAgaWYgKGlzSUU4KSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyaGVpZ2h0O1xyXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJoZWlnaHQgPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy9xdWl0ZSBldmVudCBzaW5jZSBvbmx5IGJvZHkgcmVzaXplZCBub3Qgd2luZG93LlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzaXplID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwKTsgLy8gd2FpdCA1MG1zIHVudGlsIHdpbmRvdyByZXNpemUgZmluaXNoZXMuXHJcbiAgICAgICAgICAgICAgICBjdXJyaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gc3RvcmUgbGFzdCBib2R5IGNsaWVudCBoZWlnaHRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc2l6ZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3J1blJlc2l6ZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MCk7IC8vIHdhaXQgNTBtcyB1bnRpbCB3aW5kb3cgcmVzaXplIGZpbmlzaGVzLlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgcG9ydGxldCB0b29scyAmIGFjdGlvbnNcclxuICAgIHZhciBoYW5kbGVQb3J0bGV0VG9vbHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBoYW5kbGUgcG9ydGxldCByZW1vdmVcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiBhLnJlbW92ZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgcG9ydGxldCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlIC5mdWxsc2NyZWVuJykudG9vbHRpcCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbG9hZCcpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcclxuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZW1vdmUnKS50b29sdGlwKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29uZmlnJykudG9vbHRpcCgnZGVzdHJveScpO1xyXG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbGxhcHNlLCAucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmV4cGFuZCcpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcclxuXHJcbiAgICAgICAgICAgIHBvcnRsZXQucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGhhbmRsZSBwb3J0bGV0IGZ1bGxzY3JlZW5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgLmZ1bGxzY3JlZW4nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIHBvcnRsZXQgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKTtcclxuICAgICAgICAgICAgaWYgKHBvcnRsZXQuaGFzQ2xhc3MoJ3BvcnRsZXQtZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvbicpO1xyXG4gICAgICAgICAgICAgICAgcG9ydGxldC5yZW1vdmVDbGFzcygncG9ydGxldC1mdWxsc2NyZWVuJyk7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoJ3BhZ2UtcG9ydGxldC1mdWxsc2NyZWVuJyk7XHJcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IE1ldHJvbmljLmdldFZpZXdQb3J0KCkuaGVpZ2h0IC1cclxuICAgICAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC10aXRsZScpLm91dGVySGVpZ2h0KCkgLVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ3BhZGRpbmctdG9wJykpIC1cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdwYWRkaW5nLWJvdHRvbScpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvbicpO1xyXG4gICAgICAgICAgICAgICAgcG9ydGxldC5hZGRDbGFzcygncG9ydGxldC1mdWxsc2NyZWVuJyk7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoJ3BhZ2UtcG9ydGxldC1mdWxsc2NyZWVuJyk7XHJcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IGEucmVsb2FkJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpLmNoaWxkcmVuKFwiLnBvcnRsZXQtYm9keVwiKTtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICQodGhpcykuYXR0cihcImRhdGEtdXJsXCIpO1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWVycm9yLWRpc3BsYXlcIik7XHJcbiAgICAgICAgICAgIGlmICh1cmwpIHtcclxuICAgICAgICAgICAgICAgIE1ldHJvbmljLmJsb2NrVUkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q29sb3I6ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuaHRtbChyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnVuYmxvY2tVSShlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSAnRXJyb3Igb24gcmVsb2FkaW5nIHRoZSBjb250ZW50LiBQbGVhc2UgY2hlY2sgeW91ciBjb25uZWN0aW9uIGFuZCB0cnkgYWdhaW4uJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yID09IFwidG9hc3RyXCIgJiYgdG9hc3RyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvciA9PSBcIm5vdGlmaWM4XCIgJiYgJC5ub3RpZmljOCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5ub3RpZmljOCgnemluZGV4JywgMTE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5ub3RpZmljOChtc2csIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVtZTogJ3J1YnknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpZmU6IDMwMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQobXNnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGRlbW8gcHVycG9zZVxyXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuYmxvY2tVSSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBlbCxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb2xvcjogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnVuYmxvY2tVSShlbCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBsb2FkIGFqYXggZGF0YSBvbiBwYWdlIGluaXRcclxuICAgICAgICAkKCcucG9ydGxldCAucG9ydGxldC10aXRsZSBhLnJlbG9hZFtkYXRhLWxvYWQ9XCJ0cnVlXCJdJykuY2xpY2soKTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbGxhcHNlLCAucG9ydGxldCAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5leHBhbmQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKS5jbG9zZXN0KFwiLnBvcnRsZXRcIikuY2hpbGRyZW4oXCIucG9ydGxldC1ib2R5XCIpO1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNvbGxhcHNlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiY29sbGFwc2VcIikuYWRkQ2xhc3MoXCJleHBhbmRcIik7XHJcbiAgICAgICAgICAgICAgICBlbC5zbGlkZVVwKDIwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiZXhwYW5kXCIpLmFkZENsYXNzKFwiY29sbGFwc2VcIik7XHJcbiAgICAgICAgICAgICAgICBlbC5zbGlkZURvd24oMjAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBIYW5kbGVzIGN1c3RvbSBjaGVja2JveGVzICYgcmFkaW9zIHVzaW5nIGpRdWVyeSBVbmlmb3JtIHBsdWdpblxyXG4gICAgdmFyIGhhbmRsZVVuaWZvcm0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoISQoKS51bmlmb3JtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRlc3QgPSAkKFwiaW5wdXRbdHlwZT1jaGVja2JveF06bm90KC50b2dnbGUsIC5tZC1jaGVjaywgLm1kLXJhZGlvYnRuLCAubWFrZS1zd2l0Y2gsIC5pY2hlY2spLCBpbnB1dFt0eXBlPXJhZGlvXTpub3QoLnRvZ2dsZSwgLm1kLWNoZWNrLCAubWQtcmFkaW9idG4sIC5zdGFyLCAubWFrZS1zd2l0Y2gsIC5pY2hlY2spXCIpO1xyXG4gICAgICAgIGlmICh0ZXN0LnNpemUoKSA+IDApIHtcclxuICAgICAgICAgICAgdGVzdC5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50cyhcIi5jaGVja2VyXCIpLnNpemUoKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykudW5pZm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXNtYXRlcmlhbCBkZXNpZ24gY2hlY2tib3hlc1xyXG4gICAgdmFyIGhhbmRsZU1hdGVyaWFsRGVzaWduID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vIE1hdGVyaWFsIGRlc2lnbiBja2Vja2JveCBhbmQgcmFkaW8gZWZmZWN0c1xyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnLm1kLWNoZWNrYm94ID4gbGFiZWwsIC5tZC1yYWRpbyA+IGxhYmVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAvLyBmaW5kIHRoZSBmaXJzdCBzcGFuIHdoaWNoIGlzIG91ciBjaXJjbGUvYnViYmxlXHJcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2hpbGRyZW4oJ3NwYW46Zmlyc3QtY2hpbGQnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgYnViYmxlIGNsYXNzICh3ZSBkbyB0aGlzIHNvIGl0IGRvZXNudCBzaG93IG9uIHBhZ2UgbG9hZClcclxuICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2luYycpO1xyXG5cclxuICAgICAgICAgICAgLy8gY2xvbmUgaXRcclxuICAgICAgICAgICAgdmFyIG5ld29uZSA9IGVsLmNsb25lKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gYWRkIHRoZSBjbG9uZWQgdmVyc2lvbiBiZWZvcmUgb3VyIG9yaWdpbmFsXHJcbiAgICAgICAgICAgIGVsLmJlZm9yZShuZXdvbmUpO1xyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBvcmlnaW5hbCBzbyB0aGF0IGl0IGlzIHJlYWR5IHRvIHJ1biBvbiBuZXh0IGNsaWNrXHJcbiAgICAgICAgICAgICQoXCIuXCIgKyBlbC5hdHRyKFwiY2xhc3NcIikgKyBcIjpsYXN0XCIsIHRoZSkucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtbWQnKSkge1xyXG4gICAgICAgICAgICAvLyBNYXRlcmlhbCBkZXNpZ24gY2xpY2sgZWZmZWN0XHJcbiAgICAgICAgICAgIC8vIGNyZWRpdCB3aGVyZSBjcmVkaXQncyBkdWU7IGh0dHA6Ly90aGVjb2RlcGxheWVyLmNvbS93YWxrdGhyb3VnaC9yaXBwbGUtY2xpY2stZWZmZWN0LWdvb2dsZS1tYXRlcmlhbC1kZXNpZ25cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQsIGNpcmNsZSwgZCwgeCwgeTtcclxuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdhLmJ0biwgYnV0dG9uLmJ0biwgaW5wdXQuYnRuLCBsYWJlbC5idG4nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50LmZpbmQoXCIubWQtY2xpY2stY2lyY2xlXCIpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wcmVwZW5kKFwiPHNwYW4gY2xhc3M9J21kLWNsaWNrLWNpcmNsZSc+PC9zcGFuPlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjaXJjbGUgPSBlbGVtZW50LmZpbmQoXCIubWQtY2xpY2stY2lyY2xlXCIpO1xyXG4gICAgICAgICAgICAgICAgY2lyY2xlLnJlbW92ZUNsYXNzKFwibWQtY2xpY2stYW5pbWF0ZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZighY2lyY2xlLmhlaWdodCgpICYmICFjaXJjbGUud2lkdGgoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGQgPSBNYXRoLm1heChlbGVtZW50Lm91dGVyV2lkdGgoKSwgZWxlbWVudC5vdXRlckhlaWdodCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBjaXJjbGUuY3NzKHtoZWlnaHQ6IGQsIHdpZHRoOiBkfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgeCA9IGUucGFnZVggLSBlbGVtZW50Lm9mZnNldCgpLmxlZnQgLSBjaXJjbGUud2lkdGgoKS8yO1xyXG4gICAgICAgICAgICAgICAgeSA9IGUucGFnZVkgLSBlbGVtZW50Lm9mZnNldCgpLnRvcCAtIGNpcmNsZS5oZWlnaHQoKS8yO1xyXG5cclxuICAgICAgICAgICAgICAgIGNpcmNsZS5jc3Moe3RvcDogeSsncHgnLCBsZWZ0OiB4KydweCd9KS5hZGRDbGFzcyhcIm1kLWNsaWNrLWFuaW1hdGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaXJjbGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGbG9hdGluZyBsYWJlbHNcclxuICAgICAgICB2YXIgaGFuZGxlSW5wdXQgPSBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICBpZiAoZWwudmFsKCkgIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgZWwuYWRkQ2xhc3MoJ2VkaXRlZCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWwucmVtb3ZlQ2xhc3MoJ2VkaXRlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2tleWRvd24nLCAnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaGFuZGxlSW5wdXQoJCh0aGlzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdibHVyJywgJy5mb3JtLW1kLWZsb2F0aW5nLWxhYmVsIC5mb3JtLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUlucHV0KCQodGhpcykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuZm9ybS1tZC1mbG9hdGluZy1sYWJlbCAuZm9ybS1jb250cm9sJykuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdlZGl0ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhhbmRsZXMgY3VzdG9tIGNoZWNrYm94ZXMgJiByYWRpb3MgdXNpbmcgalF1ZXJ5IGlDaGVjayBwbHVnaW5cclxuICAgIHZhciBoYW5kbGVpQ2hlY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoISQoKS5pQ2hlY2spIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnLmljaGVjaycpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGVja2JveENsYXNzID0gJCh0aGlzKS5hdHRyKCdkYXRhLWNoZWNrYm94JykgPyAkKHRoaXMpLmF0dHIoJ2RhdGEtY2hlY2tib3gnKSA6ICdpY2hlY2tib3hfbWluaW1hbC1ncmV5JztcclxuICAgICAgICAgICAgdmFyIHJhZGlvQ2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtcmFkaW8nKSA/ICQodGhpcykuYXR0cignZGF0YS1yYWRpbycpIDogJ2lyYWRpb19taW5pbWFsLWdyZXknO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoZWNrYm94Q2xhc3MuaW5kZXhPZignX2xpbmUnKSA+IC0xIHx8IHJhZGlvQ2xhc3MuaW5kZXhPZignX2xpbmUnKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmlDaGVjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hDbGFzczogY2hlY2tib3hDbGFzcyxcclxuICAgICAgICAgICAgICAgICAgICByYWRpb0NsYXNzOiByYWRpb0NsYXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydDogJzxkaXYgY2xhc3M9XCJpY2hlY2tfbGluZS1pY29uXCI+PC9kaXY+JyArICQodGhpcykuYXR0cihcImRhdGEtbGFiZWxcIilcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soe1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94Q2xhc3M6IGNoZWNrYm94Q2xhc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9DbGFzczogcmFkaW9DbGFzc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgc3dpdGNoZXNcclxuICAgIHZhciBoYW5kbGVCb290c3RyYXBTd2l0Y2ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoISQoKS5ib290c3RyYXBTd2l0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcubWFrZS1zd2l0Y2gnKS5ib290c3RyYXBTd2l0Y2goKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgY29uZmlybWF0aW9uc1xyXG4gICAgdmFyIGhhbmRsZUJvb3RzdHJhcENvbmZpcm1hdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghJCgpLmNvbmZpcm1hdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1jb25maXJtYXRpb25dJykuY29uZmlybWF0aW9uKHsgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksIGJ0bk9rQ2xhc3M6ICdidG4gYnRuLXNtIGJ0bi1zdWNjZXNzJywgYnRuQ2FuY2VsQ2xhc3M6ICdidG4gYnRuLXNtIGJ0bi1kYW5nZXInfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgQWNjb3JkaW9ucy5cclxuICAgIHZhciBoYW5kbGVBY2NvcmRpb25zID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdzaG93bi5icy5jb2xsYXBzZScsICcuYWNjb3JkaW9uLnNjcm9sbGFibGUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvKCQoZS50YXJnZXQpKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgVGFicy5cclxuICAgIHZhciBoYW5kbGVUYWJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9hY3RpdmF0ZSB0YWIgaWYgdGFiIGlkIHByb3ZpZGVkIGluIHRoZSBVUkxcclxuICAgICAgICBpZiAobG9jYXRpb24uaGFzaCkge1xyXG4gICAgICAgICAgICB2YXIgdGFiaWQgPSBlbmNvZGVVUkkobG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xyXG4gICAgICAgICAgICAkKCdhW2hyZWY9XCIjJyArIHRhYmlkICsgJ1wiXScpLnBhcmVudHMoJy50YWItcGFuZTpoaWRkZW4nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhYmlkID0gJCh0aGlzKS5hdHRyKFwiaWRcIik7XHJcbiAgICAgICAgICAgICAgICAkKCdhW2hyZWY9XCIjJyArIHRhYmlkICsgJ1wiXScpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCdhW2hyZWY9XCIjJyArIHRhYmlkICsgJ1wiXScpLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJCgpLnRhYmRyb3ApIHtcclxuICAgICAgICAgICAgJCgnLnRhYmJhYmxlLXRhYmRyb3AgLm5hdi1waWxscywgLnRhYmJhYmxlLXRhYmRyb3AgLm5hdi10YWJzJykudGFiZHJvcCh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1lbGxpcHNpcy12XCI+PC9pPiZuYnNwOzxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgTW9kYWxzLlxyXG4gICAgdmFyIGhhbmRsZU1vZGFscyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGZpeCBzdGFja2FibGUgbW9kYWwgaXNzdWU6IHdoZW4gMiBvciBtb3JlIG1vZGFscyBvcGVuZWQsIGNsb3Npbmcgb25lIG9mIG1vZGFsIHdpbGwgcmVtb3ZlIC5tb2RhbC1vcGVuIGNsYXNzLlxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZS5icy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoJCgnLm1vZGFsOnZpc2libGUnKS5zaXplKCkgPiAxICYmICQoJ2h0bWwnKS5oYXNDbGFzcygnbW9kYWwtb3BlbicpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdtb2RhbC1vcGVuJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCgnLm1vZGFsOnZpc2libGUnKS5zaXplKCkgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gZml4IHBhZ2Ugc2Nyb2xsYmFycyBpc3N1ZVxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignc2hvdy5icy5tb2RhbCcsICcubW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJtb2RhbC1zY3JvbGxcIikpIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcIm1vZGFsLW9wZW4tbm9zY3JvbGxcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gZml4IHBhZ2Ugc2Nyb2xsYmFycyBpc3N1ZVxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZS5icy5tb2RhbCcsICcubW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKFwibW9kYWwtb3Blbi1ub3Njcm9sbFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFqYXggY29udGVudCBhbmQgcmVtb3ZlIGNhY2hlIG9uIG1vZGFsIGNsb3NlZFxyXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZGVuLmJzLm1vZGFsJywgJy5tb2RhbDpub3QoLm1vZGFsLWNhY2hlZCknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlRGF0YSgnYnMubW9kYWwnKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgVG9vbHRpcHMuXHJcbiAgICB2YXIgaGFuZGxlVG9vbHRpcHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBnbG9iYWwgdG9vbHRpcHNcclxuICAgICAgICAkKCcudG9vbHRpcHMnKS50b29sdGlwKCk7XHJcblxyXG4gICAgICAgIC8vIHBvcnRsZXQgdG9vbHRpcHNcclxuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlIC5mdWxsc2NyZWVuJykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxyXG4gICAgICAgICAgICB0aXRsZTogJ0Z1bGxzY3JlZW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZWxvYWQnKS50b29sdGlwKHtcclxuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXHJcbiAgICAgICAgICAgIHRpdGxlOiAnUmVsb2FkJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVtb3ZlJykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1JlbW92ZSdcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbmZpZycpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcclxuICAgICAgICAgICAgdGl0bGU6ICdTZXR0aW5ncydcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmNvbGxhcHNlLCAucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmV4cGFuZCcpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcclxuICAgICAgICAgICAgdGl0bGU6ICdDb2xsYXBzZS9FeHBhbmQnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIERyb3Bkb3duc1xyXG4gICAgdmFyIGhhbmRsZURyb3Bkb3ducyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICBIb2xkIGRyb3Bkb3duIG9uIGNsaWNrXHJcbiAgICAgICAgKi9cclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5kcm9wZG93bi1tZW51LmhvbGQtb24tY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBoYW5kbGVBbGVydHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJ1tkYXRhLWNsb3NlPVwiYWxlcnRcIl0nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCcuYWxlcnQnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdbZGF0YS1jbG9zZT1cIm5vdGVcIl0nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdbZGF0YS1yZW1vdmU9XCJub3RlXCJdJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5ub3RlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlIEhvd2VyIERyb3Bkb3duc1xyXG4gICAgdmFyIGhhbmRsZURyb3Bkb3duSG92ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCdbZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCJdJykubm90KCcuaG92ZXItaW5pdGlhbGl6ZWQnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmRyb3Bkb3duSG92ZXIoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaG92ZXItaW5pdGlhbGl6ZWQnKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlIHRleHRhcmVhIGF1dG9zaXplXHJcbiAgICB2YXIgaGFuZGxlVGV4dGFyZWFBdXRvc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YoYXV0b3NpemUpID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICBhdXRvc2l6ZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYS5hdXRvc2l6ZW1lJykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBQb3BvdmVyc1xyXG5cclxuICAgIC8vIGxhc3QgcG9wZXAgcG9wb3ZlclxyXG4gICAgdmFyIGxhc3RQb3BlZFBvcG92ZXI7XHJcblxyXG4gICAgdmFyIGhhbmRsZVBvcG92ZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLnBvcG92ZXJzJykucG9wb3ZlcigpO1xyXG5cclxuICAgICAgICAvLyBjbG9zZSBsYXN0IGRpc3BsYXllZCBwb3BvdmVyXHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5wb3BvdmVyLmRhdGEtYXBpJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAobGFzdFBvcGVkUG9wb3Zlcikge1xyXG4gICAgICAgICAgICAgICAgbGFzdFBvcGVkUG9wb3Zlci5wb3BvdmVyKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSGFuZGxlcyBzY3JvbGxhYmxlIGNvbnRlbnRzIHVzaW5nIGpRdWVyeSBTbGltU2Nyb2xsIHBsdWdpbi5cclxuICAgIHZhciBoYW5kbGVTY3JvbGxlcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBNZXRyb25pYy5pbml0U2xpbVNjcm9sbCgnLnNjcm9sbGVyJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZXMgSW1hZ2UgUHJldmlldyB1c2luZyBqUXVlcnkgRmFuY3lib3ggcGx1Z2luXHJcbiAgICB2YXIgaGFuZGxlRmFuY3lib3ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIWpRdWVyeS5mYW5jeWJveCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJChcIi5mYW5jeWJveC1idXR0b25cIikuc2l6ZSgpID4gMCkge1xyXG4gICAgICAgICAgICAkKFwiLmZhbmN5Ym94LWJ1dHRvblwiKS5mYW5jeWJveCh7XHJcbiAgICAgICAgICAgICAgICBncm91cEF0dHI6ICdkYXRhLXJlbCcsXHJcbiAgICAgICAgICAgICAgICBwcmV2RWZmZWN0OiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICBuZXh0RWZmZWN0OiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGhlbHBlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5zaWRlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBGaXggaW5wdXQgcGxhY2Vob2xkZXIgaXNzdWUgZm9yIElFOCBhbmQgSUU5XHJcbiAgICB2YXIgaGFuZGxlRml4SW5wdXRQbGFjZWhvbGRlckZvcklFID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9maXggaHRtbDUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIGZvciBpZTcgJiBpZThcclxuICAgICAgICBpZiAoaXNJRTggfHwgaXNJRTkpIHsgLy8gaWU4ICYgaWU5XHJcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgaHRtbDUgcGxhY2Vob2xkZXIgZml4IGZvciBpbnB1dHMsIGlucHV0cyB3aXRoIHBsYWNlaG9sZGVyLW5vLWZpeCBjbGFzcyB3aWxsIGJlIHNraXBwZWQoZS5nOiB3ZSBuZWVkIHRoaXMgZm9yIHBhc3N3b3JkIGZpZWxkcylcclxuICAgICAgICAgICAgJCgnaW5wdXRbcGxhY2Vob2xkZXJdOm5vdCgucGxhY2Vob2xkZXItbm8tZml4KSwgdGV4dGFyZWFbcGxhY2Vob2xkZXJdOm5vdCgucGxhY2Vob2xkZXItbm8tZml4KScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PT0gJycgJiYgaW5wdXQuYXR0cihcInBsYWNlaG9sZGVyXCIpICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmFkZENsYXNzKFwicGxhY2Vob2xkZXJcIikudmFsKGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlucHV0LmZvY3VzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PSBpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5wdXQuYmx1cihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsKCkgPT09ICcnIHx8IGlucHV0LnZhbCgpID09IGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsKGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEhhbmRsZSBTZWxlY3QyIERyb3Bkb3duc1xyXG4gICAgdmFyIGhhbmRsZVNlbGVjdDIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJCgpLnNlbGVjdDIpIHtcclxuICAgICAgICAgICAgJCgnLnNlbGVjdDJtZScpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiU2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICBhbGxvd0NsZWFyOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gaGFuZGxlIGdyb3VwIGVsZW1lbnQgaGVpZ2h0c1xyXG4gICAgdmFyIGhhbmRsZUhlaWdodCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgJCgnW2RhdGEtYXV0by1oZWlnaHRdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHBhcmVudCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9ICQoJ1tkYXRhLWhlaWdodF0nLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgdmFyIG1vZGUgPSBwYXJlbnQuYXR0cignZGF0YS1tb2RlJyk7XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBwYXJzZUludChwYXJlbnQuYXR0cignZGF0YS1vZmZzZXQnKSA/IHBhcmVudC5hdHRyKCdkYXRhLW9mZnNldCcpIDogMCk7XHJcblxyXG4gICAgICAgICAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1oZWlnaHQnKSA9PSBcImhlaWdodFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2hlaWdodCcsICcnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ21pbi1oZWlnaHQnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodF8gPSAobW9kZSA9PSAnYmFzZS1oZWlnaHQnID8gJCh0aGlzKS5vdXRlckhlaWdodCgpIDogJCh0aGlzKS5vdXRlckhlaWdodCh0cnVlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGVpZ2h0XyA+IGhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodF87XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0ICsgb2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgaXRlbXMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtaGVpZ2h0JykgPT0gXCJoZWlnaHRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnbWluLWhlaWdodCcsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8qIEVORDpDT1JFIEhBTkRMRVJTICovL1xyXG5cclxuICAgIHJldHVybiB7XHJcblxyXG4gICAgICAgIC8vbWFpbiBmdW5jdGlvbiB0byBpbml0aWF0ZSB0aGUgdGhlbWVcclxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy9JTVBPUlRBTlQhISE6IERvIG5vdCBtb2RpZnkgdGhlIGNvcmUgaGFuZGxlcnMgY2FsbCBvcmRlci5cclxuXHJcbiAgICAgICAgICAgIC8vQ29yZSBoYW5kbGVyc1xyXG4gICAgICAgICAgICBoYW5kbGVJbml0KCk7IC8vIGluaXRpYWxpemUgY29yZSB2YXJpYWJsZXNcclxuICAgICAgICAgICAgaGFuZGxlT25SZXNpemUoKTsgLy8gc2V0IGFuZCBoYW5kbGUgcmVzcG9uc2l2ZVxyXG5cclxuICAgICAgICAgICAgLy9VSSBDb21wb25lbnQgaGFuZGxlcnNcclxuICAgICAgICAgICAgaGFuZGxlTWF0ZXJpYWxEZXNpZ24oKTsgLy8gaGFuZGxlIG1hdGVyaWFsIGRlc2lnblxyXG4gICAgICAgICAgICBoYW5kbGVVbmlmb3JtKCk7IC8vIGhhbmZsZSBjdXN0b20gcmFkaW8gJiBjaGVja2JveGVzXHJcbiAgICAgICAgICAgIGhhbmRsZWlDaGVjaygpOyAvLyBoYW5kbGVzIGN1c3RvbSBpY2hlY2sgcmFkaW8gYW5kIGNoZWNrYm94ZXNcclxuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwU3dpdGNoKCk7IC8vIGhhbmRsZSBib290c3RyYXAgc3dpdGNoIHBsdWdpblxyXG4gICAgICAgICAgICBoYW5kbGVTY3JvbGxlcnMoKTsgLy8gaGFuZGxlcyBzbGltIHNjcm9sbGluZyBjb250ZW50c1xyXG4gICAgICAgICAgICBoYW5kbGVGYW5jeWJveCgpOyAvLyBoYW5kbGUgZmFuY3kgYm94XHJcbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdDIoKTsgLy8gaGFuZGxlIGN1c3RvbSBTZWxlY3QyIGRyb3Bkb3duc1xyXG4gICAgICAgICAgICBoYW5kbGVQb3J0bGV0VG9vbHMoKTsgLy8gaGFuZGxlcyBwb3J0bGV0IGFjdGlvbiBiYXIgZnVuY3Rpb25hbGl0eShyZWZyZXNoLCBjb25maWd1cmUsIHRvZ2dsZSwgcmVtb3ZlKVxyXG4gICAgICAgICAgICBoYW5kbGVBbGVydHMoKTsgLy9oYW5kbGUgY2xvc2FibGVkIGFsZXJ0c1xyXG4gICAgICAgICAgICBoYW5kbGVEcm9wZG93bnMoKTsgLy8gaGFuZGxlIGRyb3Bkb3duc1xyXG4gICAgICAgICAgICBoYW5kbGVUYWJzKCk7IC8vIGhhbmRsZSB0YWJzXHJcbiAgICAgICAgICAgIGhhbmRsZVRvb2x0aXBzKCk7IC8vIGhhbmRsZSBib290c3RyYXAgdG9vbHRpcHNcclxuICAgICAgICAgICAgaGFuZGxlUG9wb3ZlcnMoKTsgLy8gaGFuZGxlcyBib290c3RyYXAgcG9wb3ZlcnNcclxuICAgICAgICAgICAgaGFuZGxlQWNjb3JkaW9ucygpOyAvL2hhbmRsZXMgYWNjb3JkaW9uc1xyXG4gICAgICAgICAgICBoYW5kbGVNb2RhbHMoKTsgLy8gaGFuZGxlIG1vZGFsc1xyXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBDb25maXJtYXRpb24oKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBjb25maXJtYXRpb25zXHJcbiAgICAgICAgICAgIGhhbmRsZVRleHRhcmVhQXV0b3NpemUoKTsgLy8gaGFuZGxlIGF1dG9zaXplIHRleHRhcmVhc1xyXG5cclxuICAgICAgICAgICAgLy9IYW5kbGUgZ3JvdXAgZWxlbWVudCBoZWlnaHRzXHJcbiAgICAgICAgICAgIGhhbmRsZUhlaWdodCgpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFJlc2l6ZUhhbmRsZXIoaGFuZGxlSGVpZ2h0KTsgLy8gaGFuZGxlIGF1dG8gY2FsY3VsYXRpbmcgaGVpZ2h0IG9uIHdpbmRvdyByZXNpemVcclxuXHJcbiAgICAgICAgICAgIC8vIEhhY2tzXHJcbiAgICAgICAgICAgIGhhbmRsZUZpeElucHV0UGxhY2Vob2xkZXJGb3JJRSgpOyAvL0lFOCAmIElFOSBpbnB1dCBwbGFjZWhvbGRlciBpc3N1ZSBmaXhcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgY29yZSBqYXZhc2NyaXB0IGFmdGVyIGFqYXggY29tcGxldGVcclxuICAgICAgICBpbml0QWpheDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTsgLy8gaGFuZGxlcyBjdXN0b20gcmFkaW8gJiBjaGVja2JveGVzXHJcbiAgICAgICAgICAgIGhhbmRsZWlDaGVjaygpOyAvLyBoYW5kbGVzIGN1c3RvbSBpY2hlY2sgcmFkaW8gYW5kIGNoZWNrYm94ZXNcclxuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwU3dpdGNoKCk7IC8vIGhhbmRsZSBib290c3RyYXAgc3dpdGNoIHBsdWdpblxyXG4gICAgICAgICAgICBoYW5kbGVEcm9wZG93bkhvdmVyKCk7IC8vIGhhbmRsZXMgZHJvcGRvd24gaG92ZXJcclxuICAgICAgICAgICAgaGFuZGxlU2Nyb2xsZXJzKCk7IC8vIGhhbmRsZXMgc2xpbSBzY3JvbGxpbmcgY29udGVudHNcclxuICAgICAgICAgICAgaGFuZGxlU2VsZWN0MigpOyAvLyBoYW5kbGUgY3VzdG9tIFNlbGVjdDIgZHJvcGRvd25zXHJcbiAgICAgICAgICAgIGhhbmRsZUZhbmN5Ym94KCk7IC8vIGhhbmRsZSBmYW5jeSBib3hcclxuICAgICAgICAgICAgaGFuZGxlRHJvcGRvd25zKCk7IC8vIGhhbmRsZSBkcm9wZG93bnNcclxuICAgICAgICAgICAgaGFuZGxlVG9vbHRpcHMoKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCB0b29sdGlwc1xyXG4gICAgICAgICAgICBoYW5kbGVQb3BvdmVycygpOyAvLyBoYW5kbGVzIGJvb3RzdHJhcCBwb3BvdmVyc1xyXG4gICAgICAgICAgICBoYW5kbGVBY2NvcmRpb25zKCk7IC8vaGFuZGxlcyBhY2NvcmRpb25zXHJcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcENvbmZpcm1hdGlvbigpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIGNvbmZpcm1hdGlvbnNcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL2luaXQgbWFpbiBjb21wb25lbnRzXHJcbiAgICAgICAgaW5pdENvbXBvbmVudHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRBamF4KCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gcmVtZW1iZXIgbGFzdCBvcGVuZWQgcG9wb3ZlciB0aGF0IG5lZWRzIHRvIGJlIGNsb3NlZCBvbiBjbGlja1xyXG4gICAgICAgIHNldExhc3RQb3BlZFBvcG92ZXI6IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgIGxhc3RQb3BlZFBvcG92ZXIgPSBlbDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBhZGQgY2FsbGJhY2sgYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCBvbiB3aW5kb3cgcmVzaXplXHJcbiAgICAgICAgYWRkUmVzaXplSGFuZGxlcjogZnVuY3Rpb24oZnVuYykge1xyXG4gICAgICAgICAgICByZXNpemVIYW5kbGVycy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vcHVibGljIGZ1bmN0b24gdG8gY2FsbCBfcnVucmVzaXplSGFuZGxlcnNcclxuICAgICAgICBydW5SZXNpemVIYW5kbGVyczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIF9ydW5SZXNpemVIYW5kbGVycygpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byBzY3JvbGwoZm9jdXMpIHRvIGFuIGVsZW1lbnRcclxuICAgICAgICBzY3JvbGxUbzogZnVuY3Rpb24oZWwsIG9mZmVzZXQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IChlbCAmJiBlbC5zaXplKCkgPiAwKSA/IGVsLm9mZnNldCgpLnRvcCA6IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtaGVhZGVyLWZpeGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBwb3MgLSAkKCcucGFnZS1oZWFkZXInKS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWhlYWRlci10b3AtZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvcyAtICQoJy5wYWdlLWhlYWRlci10b3AnKS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWhlYWRlci1tZW51LWZpeGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBwb3MgLSAkKCcucGFnZS1oZWFkZXItbWVudScpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcG9zID0gcG9zICsgKG9mZmVzZXQgPyBvZmZlc2V0IDogLTEgKiBlbC5oZWlnaHQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBwb3NcclxuICAgICAgICAgICAgfSwgJ3Nsb3cnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0U2xpbVNjcm9sbDogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgJChlbCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBleGl0XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1oZWlnaHRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWhlaWdodFwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gJCh0aGlzKS5jc3MoJ2hlaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcykuc2xpbVNjcm9sbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dQYWdlU2Nyb2xsOiB0cnVlLCAvLyBhbGxvdyBwYWdlIHNjcm9sbCB3aGVuIHRoZSBlbGVtZW50IHNjcm9sbCBpcyBlbmRlZFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6ICc3cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKSA6ICcjYmJiJyksXHJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpIDogJ3NsaW1TY3JvbGxEaXYnKSxcclxuICAgICAgICAgICAgICAgICAgICByYWlsQ29sb3I6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikgOiAnI2VhZWFlYScpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBpc1JUTCA/ICdsZWZ0JyA6ICdyaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgYWx3YXlzVmlzaWJsZTogKCQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIikgPT0gXCIxXCIgPyB0cnVlIDogZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhaWxWaXNpYmxlOiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLXZpc2libGVcIikgPT0gXCIxXCIgPyB0cnVlIDogZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVGYWRlT3V0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItZm9ybSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIiwgXCIxXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZXN0cm95U2xpbVNjcm9sbDogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgJChlbCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpID09PSBcIjFcIikgeyAvLyBkZXN0cm95IGV4aXN0aW5nIGluc3RhbmNlIGJlZm9yZSB1cGRhdGluZyB0aGUgaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUF0dHIoXCJzdHlsZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBjdXN0b20gYXR0cmlidXJlcyBzbyBsYXRlciB3ZSB3aWxsIHJlYXNzaWduLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtaGFuZGxlLWNvbG9yXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXdyYXBwZXItY2xhc3NcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLXJhaWwtY29sb3JcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWFsd2F5cy12aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1hbHdheXMtdmlzaWJsZVwiXSA9ICQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtcmFpbC12aXNpYmxlXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyByZWFzc2lnbiBjdXN0b20gYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChhdHRyTGlzdCwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUuYXR0cihrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGZ1bmN0aW9uIHRvIHNjcm9sbCB0byB0aGUgdG9wXHJcbiAgICAgICAgc2Nyb2xsVG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gIGJsb2NrIGVsZW1lbnQoaW5kaWNhdGUgbG9hZGluZylcclxuICAgICAgICBibG9ja1VJOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj4nICsgJzxkaXYgY2xhc3M9XCJibG9jay1zcGlubmVyLWJhclwiPjxkaXYgY2xhc3M9XCJib3VuY2UxXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlM1wiPjwvZGl2PjwvZGl2PicgKyAnPC9kaXY+JztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmljb25Pbmx5KSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIgYWxpZ249XCJcIj48L2Rpdj4nO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMudGV4dE9ubHkpIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSAnPGRpdiBjbGFzcz1cImxvYWRpbmctbWVzc2FnZSAnICsgKG9wdGlvbnMuYm94ZWQgPyAnbG9hZGluZy1tZXNzYWdlLWJveGVkJyA6ICcnKSArICdcIj48c3Bhbj4mbmJzcDsmbmJzcDsnICsgKG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMT0FESU5HLi4uJykgKyAnPC9zcGFuPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIgYWxpZ249XCJcIj48c3Bhbj4mbmJzcDsmbmJzcDsnICsgKG9wdGlvbnMubWVzc2FnZSA/IG9wdGlvbnMubWVzc2FnZSA6ICdMT0FESU5HLi4uJykgKyAnPC9zcGFuPjwvZGl2Pic7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnRhcmdldCkgeyAvLyBlbGVtZW50IGJsb2NraW5nXHJcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSAkKG9wdGlvbnMudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5oZWlnaHQoKSA8PSAoJCh3aW5kb3cpLmhlaWdodCgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY2VucmVyWSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbC5ibG9jayh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogaHRtbCxcclxuICAgICAgICAgICAgICAgICAgICBiYXNlWjogb3B0aW9ucy56SW5kZXggPyBvcHRpb25zLnpJbmRleCA6IDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyWTogb3B0aW9ucy5jZW5yZXJZICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNlbnJlclkgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDU1M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAnd2FpdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gcGFnZSBibG9ja2luZ1xyXG4gICAgICAgICAgICAgICAgJC5ibG9ja1VJKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBodG1sLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhc2VaOiBvcHRpb25zLnpJbmRleCA/IG9wdGlvbnMuekluZGV4IDogMTAwMCxcclxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDU1M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBvcHRpb25zLm92ZXJsYXlDb2xvciA/IG9wdGlvbnMub3ZlcmxheUNvbG9yIDogJyM1NTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAnd2FpdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byAgdW4tYmxvY2sgZWxlbWVudChmaW5pc2ggbG9hZGluZylcclxuICAgICAgICB1bmJsb2NrVUk6IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAkKHRhcmdldCkudW5ibG9jayh7XHJcbiAgICAgICAgICAgICAgICAgICAgb25VbmJsb2NrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YXJnZXQpLmNzcygncG9zaXRpb24nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGFyZ2V0KS5jc3MoJ3pvb20nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkLnVuYmxvY2tVSSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RhcnRQYWdlTG9hZGluZzogZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLXNwaW5uZXItYmFyJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGFnZS1zcGlubmVyLWJhclwiPjxkaXYgY2xhc3M9XCJib3VuY2UxXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlM1wiPjwvZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtbG9hZGluZycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInBhZ2UtbG9hZGluZ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiLz4mbmJzcDsmbmJzcDs8c3Bhbj4nICsgKG9wdGlvbnMgJiYgb3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xvYWRpbmcuLi4nKSArICc8L3NwYW4+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzdG9wUGFnZUxvYWRpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcucGFnZS1sb2FkaW5nLCAucGFnZS1zcGlubmVyLWJhcicpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFsZXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiBcIlwiLCAvLyBhbGVydHMgcGFyZW50IGNvbnRhaW5lcihieSBkZWZhdWx0IHBsYWNlZCBhZnRlciB0aGUgcGFnZSBicmVhZGNydW1icylcclxuICAgICAgICAgICAgICAgIHBsYWNlOiBcImFwcGVuZFwiLCAvLyBcImFwcGVuZFwiIG9yIFwicHJlcGVuZFwiIGluIGNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLCAvLyBhbGVydCdzIHR5cGVcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiXCIsIC8vIGFsZXJ0J3MgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgY2xvc2U6IHRydWUsIC8vIG1ha2UgYWxlcnQgY2xvc2FibGVcclxuICAgICAgICAgICAgICAgIHJlc2V0OiB0cnVlLCAvLyBjbG9zZSBhbGwgcHJldmlvdXNlIGFsZXJ0cyBmaXJzdFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IHRydWUsIC8vIGF1dG8gc2Nyb2xsIHRvIHRoZSBhbGVydCBhZnRlciBzaG93blxyXG4gICAgICAgICAgICAgICAgY2xvc2VJblNlY29uZHM6IDAsIC8vIGF1dG8gY2xvc2UgYWZ0ZXIgZGVmaW5lZCBzZWNvbmRzXHJcbiAgICAgICAgICAgICAgICBpY29uOiBcIlwiIC8vIHB1dCBpY29uIGJlZm9yZSB0aGUgbWVzc2FnZVxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpZCA9IE1ldHJvbmljLmdldFVuaXF1ZUlEKFwiTWV0cm9uaWNfYWxlcnRcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwiTWV0cm9uaWMtYWxlcnRzIGFsZXJ0IGFsZXJ0LScgKyBvcHRpb25zLnR5cGUgKyAnIGZhZGUgaW5cIj4nICsgKG9wdGlvbnMuY2xvc2UgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9idXR0b24+JyA6ICcnKSArIChvcHRpb25zLmljb24gIT09IFwiXCIgPyAnPGkgY2xhc3M9XCJmYS1sZyBmYSBmYS0nICsgb3B0aW9ucy5pY29uICsgJ1wiPjwvaT4gICcgOiAnJykgKyBvcHRpb25zLm1lc3NhZ2UgKyAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuTWV0cm9uaWMtYWxlcnRzJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWNvbnRhaW5lci1iZy1zb2xpZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLXRpdGxlJykuYWZ0ZXIoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcucGFnZS1iYXInKS5zaXplKCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWJhcicpLmFmdGVyKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdlLWJyZWFkY3J1bWInKS5hZnRlcihodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5wbGFjZSA9PSBcImFwcGVuZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChvcHRpb25zLmNvbnRhaW5lcikuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKG9wdGlvbnMuY29udGFpbmVyKS5wcmVwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5mb2N1cykge1xyXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG8oJCgnIycgKyBpZCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jbG9zZUluU2Vjb25kcyA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnIycgKyBpZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBvcHRpb25zLmNsb3NlSW5TZWNvbmRzICogMTAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplcyB1bmlmb3JtIGVsZW1lbnRzXHJcbiAgICAgICAgaW5pdFVuaWZvcm06IGZ1bmN0aW9uKGVscykge1xyXG4gICAgICAgICAgICBpZiAoZWxzKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVscykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnVuaWZvcm0oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvIHVwZGF0ZS9zeW5jIGpxdWVyeSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zXHJcbiAgICAgICAgdXBkYXRlVW5pZm9ybTogZnVuY3Rpb24oZWxzKSB7XHJcbiAgICAgICAgICAgICQudW5pZm9ybS51cGRhdGUoZWxzKTsgLy8gdXBkYXRlIHRoZSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zIFVJIGFmdGVyIHRoZSBhY3R1YWwgaW5wdXQgY29udHJvbCBzdGF0ZSBjaGFuZ2VkXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aGUgZmFuY3lib3ggcGx1Z2luXHJcbiAgICAgICAgaW5pdEZhbmN5Ym94OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvL3B1YmxpYyBoZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGFjdHVhbCBpbnB1dCB2YWx1ZSh1c2VkIGluIElFOSBhbmQgSUU4IGR1ZSB0byBwbGFjZWhvbGRlciBhdHRyaWJ1dGUgbm90IHN1cHBvcnRlZClcclxuICAgICAgICBnZXRBY3R1YWxWYWw6IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgIGVsID0gJChlbCk7XHJcbiAgICAgICAgICAgIGlmIChlbC52YWwoKSA9PT0gZWwuYXR0cihcInBsYWNlaG9sZGVyXCIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWwudmFsKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gZ2V0IGEgcGFyZW1ldGVyIGJ5IG5hbWUgZnJvbSBVUkxcclxuICAgICAgICBnZXRVUkxQYXJhbWV0ZXI6IGZ1bmN0aW9uKHBhcmFtTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoU3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSksXHJcbiAgICAgICAgICAgICAgICBpLCB2YWwsIHBhcmFtcyA9IHNlYXJjaFN0cmluZy5zcGxpdChcIiZcIik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSBwYXJhbXNbaV0uc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbFswXSA9PSBwYXJhbU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5lc2NhcGUodmFsWzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBjaGVjayBmb3IgZGV2aWNlIHRvdWNoIHN1cHBvcnRcclxuICAgICAgICBpc1RvdWNoRGV2aWNlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiVG91Y2hFdmVudFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBUbyBnZXQgdGhlIGNvcnJlY3Qgdmlld3BvcnQgd2lkdGggYmFzZWQgb24gIGh0dHA6Ly9hbmR5bGFuZ3Rvbi5jby51ay9hcnRpY2xlcy9qYXZhc2NyaXB0L2dldC12aWV3cG9ydC1zaXplLWphdmFzY3JpcHQvXHJcbiAgICAgICAgZ2V0Vmlld1BvcnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IHdpbmRvdyxcclxuICAgICAgICAgICAgICAgIGEgPSAnaW5uZXInO1xyXG4gICAgICAgICAgICBpZiAoISgnaW5uZXJXaWR0aCcgaW4gd2luZG93KSkge1xyXG4gICAgICAgICAgICAgICAgYSA9ICdjbGllbnQnO1xyXG4gICAgICAgICAgICAgICAgZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGVbYSArICdXaWR0aCddLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBlW2EgKyAnSGVpZ2h0J11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRVbmlxdWVJRDogZnVuY3Rpb24ocHJlZml4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncHJlZml4XycgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobmV3IERhdGUoKSkuZ2V0VGltZSgpKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBjaGVjayBJRTggbW9kZVxyXG4gICAgICAgIGlzSUU4OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzSUU4O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGNoZWNrIElFOSBtb2RlXHJcbiAgICAgICAgaXNJRTk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNJRTk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy9jaGVjayBSVEwgbW9kZVxyXG4gICAgICAgIGlzUlRMOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzUlRMO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGNoZWNrIElFOCBtb2RlXHJcbiAgICAgICAgaXNBbmd1bGFySnNBcHA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBhbmd1bGFyID09ICd1bmRlZmluZWQnKSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBc3NldHNQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0QXNzZXRzUGF0aDogZnVuY3Rpb24ocGF0aCkge1xyXG4gICAgICAgICAgICBhc3NldHNQYXRoID0gcGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXRHbG9iYWxJbWdQYXRoOiBmdW5jdGlvbihwYXRoKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbEltZ1BhdGggPSBwYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdsb2JhbEltZ1BhdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbEltZ1BhdGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0R2xvYmFsUGx1Z2luc1BhdGg6IGZ1bmN0aW9uKHBhdGgpIHtcclxuICAgICAgICAgICAgZ2xvYmFsUGx1Z2luc1BhdGggPSBwYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdsb2JhbFBsdWdpbnNQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGggKyBnbG9iYWxQbHVnaW5zUGF0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRHbG9iYWxDc3NQYXRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0c1BhdGggKyBnbG9iYWxDc3NQYXRoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIGdldCBsYXlvdXQgY29sb3IgY29kZSBieSBjb2xvciBuYW1lXHJcbiAgICAgICAgZ2V0QnJhbmRDb2xvcjogZnVuY3Rpb24obmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoYnJhbmRDb2xvcnNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBicmFuZENvbG9yc1tuYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldFJlc3BvbnNpdmVCcmVha3BvaW50OiBmdW5jdGlvbihzaXplKSB7XHJcbiAgICAgICAgICAgIC8vIGJvb3RzdHJhcCByZXNwb25zaXZlIGJyZWFrcG9pbnRzXHJcbiAgICAgICAgICAgIHZhciBzaXplcyA9IHtcclxuICAgICAgICAgICAgICAgICd4cycgOiA0ODAsICAgICAvLyBleHRyYSBzbWFsbFxyXG4gICAgICAgICAgICAgICAgJ3NtJyA6IDc2OCwgICAgIC8vIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAnbWQnIDogOTkyLCAgICAgLy8gbWVkaXVtXHJcbiAgICAgICAgICAgICAgICAnbGcnIDogMTIwMCAgICAgLy8gbGFyZ2VcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzaXplc1tzaXplXSA/IHNpemVzW3NpemVdIDogMDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxufSAoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWV0cm9uaWM7IiwiY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG5jbGFzcyBDb21tb24ge1xyXG5cclxuICAgIHN0YXRpYyBzcGxpdExpbmVzKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGV4dC5zcGxpdCgvXFxuLyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEV2ZW50VGltZSh0LCBub3cpIHtcclxuICAgICAgICBsZXQgdGltZSA9IG1vbWVudCh0LCAnWVlZWS1NTS1ERCBISDptbTpzcy5TU1MnKTtcclxuICAgICAgICBsZXQgbm93dGltZSA9IG1vbWVudChub3csICdZWVlZLU1NLUREIEhIOm1tOnNzLlNTUycpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0OiAgICAgICAnICsgdCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vdzogICAgICcgKyBub3cpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aW1lOiAgICAnICsgdGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgdGltZS5pc1ZhbGlkKCkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub3d0aW1lOiAnICsgbm93dGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgbm93dGltZS5pc1ZhbGlkKCkpO1xyXG4gICAgICAgIHJldHVybiB0aW1lLmZyb20obm93dGltZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNsYXNzSWYoa2xhc3MsIGIpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbGFzc0lmOiAnICsga2xhc3MgKyAnLCAnICsgYik7XHJcbiAgICAgICAgcmV0dXJuIChiID8ga2xhc3MgOiAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYXZvaWQgJyRhcHBseSBhbHJlYWR5IGluIHByb2dyZXNzJyBlcnJvciAoc291cmNlOiBodHRwczovL2NvZGVyd2FsbC5jb20vcC9uZ2lzbWEpXHJcbiAgICBzdGF0aWMgc2FmZUFwcGx5KGZuKSB7XHJcbiAgICAgICAgaWYgKGZuICYmICh0eXBlb2YgKGZuKSA9PT0gJ2Z1bmN0aW9uJykpIHtcclxuICAgICAgICAgICAgZm4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc291cmNlOiBodHRwOi8vY3RybHEub3JnL2NvZGUvMTk2MTYtZGV0ZWN0LXRvdWNoLXNjcmVlbi1qYXZhc2NyaXB0XHJcbiAgICBzdGF0aWMgaXNUb3VjaERldmljZSgpIHtcclxuICAgICAgICByZXR1cm4gKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8IChuYXZpZ2F0b3IuTWF4VG91Y2hQb2ludHMgPiAwKSB8fCAobmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFRpY2tzRnJvbURhdGUoZGF0ZSkge1xyXG4gICAgICAgIGxldCByZXQgPSBudWxsO1xyXG4gICAgICAgIGlmKGRhdGUgJiYgZGF0ZS5nZXRUaW1lKSB7XHJcbiAgICAgICAgICAgIHJldCA9IGRhdGUuZ2V0VGltZSgpLzEwMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1vbjsiLCJjb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxyXG5cclxuY2xhc3MgVmlkZW9QbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGl2SWQsIG9wdHMgPSB7IHZpZGVvSWQ6ICcnfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBkaXZJZFxyXG4gICAgICAgIHRoaXMub3B0cyA9IG9wdHNcclxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJylcclxuICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgdGhpcy5fb25SZWFkeSA9IHRoaXMuX29uUmVhZHkgfHwgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgd2FpdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuWVQgJiYgd2luZG93LllULmxvYWRlZD09MSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuWVQgPSB3aW5kb3cuWVQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh3aW5kb3cuWVQpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQod2FpdCwgMjUwKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdhaXQoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLm9uUmVhZHkoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgdGhpcy5ZVC5QbGF5ZXIodGhpcy5pZCwge1xyXG4gICAgICAgICAgICAgICAgdmlkZW9JZDogdGhpcy5vcHRzLnZpZGVvSWQsXHJcbiAgICAgICAgICAgICAgICBmcmFtZWJvcmRlcjogMCxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uUmVhZHk6IHRoaXMub25QbGF5ZXJSZWFkeSxcclxuICAgICAgICAgICAgICAgICAgICBvblN0YXRlQ2hhbmdlOiB0aGlzLm9uUGxheWVyU3RhdGVDaGFuZ2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25QbGF5ZXJSZWFkeShldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wbGF5VmlkZW8oKTtcclxuICAgIH1cclxuXHJcbiAgICBvblBsYXllclN0YXRlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEgPT0gWVQuUGxheWVyU3RhdGUuRU5ERUQpIHtcclxuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzRG9uZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb25lID09IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBzdG9wVmlkZW8oKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcFZpZGVvKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvUGxheWVyOyIsImlmICghU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQpIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxuICAgICAgICAgICAgICA6IG1hdGNoXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59IiwiY29uc3QgdXVpZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBoZXhEaWdpdHMsIGksIHMsIHV1aWQ7XHJcbiAgICBzID0gW107XHJcbiAgICBzLmxlbmd0aCA9IDM2O1xyXG4gICAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnO1xyXG4gICAgaSA9IDA7XHJcbiAgICB3aGlsZSAoaSA8IDM2KSB7XHJcbiAgICAgICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpO1xyXG4gICAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIHNbMTRdID0gJzQnO1xyXG4gICAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpO1xyXG4gICAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJztcclxuICAgIHV1aWQgPSBzLmpvaW4oJycpO1xyXG4gICAgcmV0dXJuIHV1aWQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7Il19
