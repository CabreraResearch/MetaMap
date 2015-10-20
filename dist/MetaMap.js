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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL01ldGFNYXAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQWN0aW9uLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0FjdGlvbkJhc2UuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvQ29weU1hcC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Db3Vyc2VzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0RlbGV0ZU1hcC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9GZWVkYmFjay5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9Ib21lLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL0xvZ291dC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYWN0aW9ucy9NeU1hcHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvTmV3TWFwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL09wZW5NYXAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FjdGlvbnMvT3BlblRyYWluaW5nLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1NoYXJlTWFwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hY3Rpb25zL1Rlcm1zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvQ29uZmlnLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvRXZlbnRlci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvYXBwL0ZpcmViYXNlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvSW50ZWdyYXRpb25zLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvUGVybWlzc2lvbnMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC9Sb3V0ZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC9TaGFyaW5nLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9hcHAvYXV0aDAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2FwcC91c2VyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jYW52YXMvY2FudmFzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jYW52YXMvbGF5b3V0LmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvYWN0aW9ucy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NhbnZhcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL2RzcnAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9lZGl0U3RhdHVzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9jb25zdGFudHMvZWxlbWVudHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ldmVudHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9ub3RpZmljYXRpb24uanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy9wYWdlcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3JvdXRlcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvY29uc3RhbnRzL3RhYnMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL2NvbnN0YW50cy90YWdzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvQWRkVGhpcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL0dvb2dsZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL1VzZXJTbmFwLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvWW91VHViZS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvaW50ZWdyYXRpb25zL19JbnRlZ3JhdGlvbnNCYXNlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9jYW52YXMvbWV0YS1jYW52YXMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvY2FudmFzL25vZGUuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvY29tcG9uZW50cy9xdWljay1zaWRlYmFyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL2NvbXBvbmVudHMvcmF3LmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL2RpYWxvZ3Mvc2hhcmUuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLWhlbHAuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLW5vdGlmaWNhdGlvbnMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvbWVudS9tZXRhLXBvaW50cy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9tZW51L21ldGEtdXNlci5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9taXhpbnMvdHJhaW5pbmctbWl4LmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtYWN0aW9ucy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLWJvZHkuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1jb250YWluZXIuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZS1jb250ZW50LmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtZm9vdGVyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtaGVhZGVyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2UtbG9nby5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXNlYXJjaC5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlLXRvcG1lbnUuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvY291cnNlcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdGFncy9wYWdlcy9ob21lLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3BhZ2VzL215LW1hcHMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdGVybXMuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvcGFnZXMvdHJhaW5pbmcuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RhZ3MvdGFibGVzL2FsbC1jb3Vyc2VzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90YWdzL3RhYmxlcy9teS1jb3Vyc2VzLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9kZW1vLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90ZW1wbGF0ZS9sYXlvdXQuanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3RlbXBsYXRlL21ldHJvbmljLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90b29scy9Db21tb24uanMiLCIvVXNlcnMvc2ltb24vd29yay9jYWJyZXJhL01ldGFNYXAvc3JjL2pzL3Rvb2xzL1ZpZGVvUGxheWVyLmpzIiwiL1VzZXJzL3NpbW9uL3dvcmsvY2FicmVyYS9NZXRhTWFwL3NyYy9qcy90b29scy9zaGltcy5qcyIsIi9Vc2Vycy9zaW1vbi93b3JrL2NhYnJlcmEvTWV0YU1hcC9zcmMvanMvdG9vbHMvdXVpZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQixPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckIsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsTUFBTSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENB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QixLQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ04sV0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFO0FBQ1gsU0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0QsU0FBQyxJQUFJLENBQUMsQ0FBQztLQUNWO0FBQ0QsS0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNaLEtBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEFBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsS0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNuQyxRQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNsQixXQUFPLElBQUksQ0FBQztDQUNmLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnYmFiZWwvcG9seWZpbGwnKTtcbnJlcXVpcmUoJ2NvcmUtanMnKTtcbndpbmRvdy4kID0gd2luZG93LmpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xucmVxdWlyZSgnanF1ZXJ5LXVpJyk7XG5yZXF1aXJlKCdib290c3RyYXAnKTtcbndpbmRvdy5yaW90ID0gcmVxdWlyZSgncmlvdCcpO1xud2luZG93Ll8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbndpbmRvdy5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcblxuY29uc3QgQXV0aDAgPSByZXF1aXJlKCcuL2pzL2FwcC9hdXRoMCcpO1xuY29uc3QgVXNlciA9IHJlcXVpcmUoJy4vanMvYXBwL3VzZXIuanMnKTtcbmNvbnN0IFJvdXRlciA9IHJlcXVpcmUoJy4vanMvYXBwL1JvdXRlci5qcycpO1xuY29uc3QgRXZlbnRlciA9IHJlcXVpcmUoJy4vanMvYXBwL0V2ZW50ZXIuanMnKTtcbmNvbnN0IFBhZ2VGYWN0b3J5ID0gcmVxdWlyZSgnLi9qcy9wYWdlcy9QYWdlRmFjdG9yeS5qcycpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IENvbmZpZyA9IHJlcXVpcmUoJy4vanMvYXBwLy9Db25maWcuanMnKTtcbmNvbnN0IGdhID0gcmVxdWlyZSgnLi9qcy9pbnRlZ3JhdGlvbnMvZ29vZ2xlLmpzJyk7XG5jb25zdCBzaGltcyA9IHJlcXVpcmUoJy4vanMvdG9vbHMvc2hpbXMuanMnKTtcbmNvbnN0IEludGVncmF0aW9ucyA9IHJlcXVpcmUoJy4vanMvYXBwL0ludGVncmF0aW9ucycpXG5cbmNsYXNzIE1ldGFNYXAge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuQ29uZmlnID0gbmV3IENvbmZpZygpO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IHRoaXMuQ29uZmlnLmNvbmZpZztcbiAgICAgICAgdGhpcy5NZXRhRmlyZSA9IHRoaXMuQ29uZmlnLk1ldGFGaXJlO1xuICAgICAgICB0aGlzLkV2ZW50ZXIgPSBuZXcgRXZlbnRlcih0aGlzKTtcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBQcm9taXNlLm9uUG9zc2libHlVbmhhbmRsZWRSZWplY3Rpb24oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICB0aGF0LmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5Db25maWcub25SZWFkeSgpLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkF1dGgwID0gbmV3IEF1dGgwKGNvbmZpZy5hdXRoMCk7XG4gICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLkF1dGgwLmxvZ2luKCkudGhlbigocHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuTWV0YUZpcmUubG9naW4oKS50aGVuKChhdXRoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXNlciA9IG5ldyBVc2VyKHByb2ZpbGUsIGF1dGgsIHRoaXMuRXZlbnRlciwgdGhpcy5NZXRhRmlyZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zID0gbmV3IEludGVncmF0aW9ucyh0aGlzLCB0aGlzLlVzZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlVzZXIub25SZWFkeSgpLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFnZUZhY3RvcnkgPSBuZXcgUGFnZUZhY3RvcnkodGhpcy5FdmVudGVyLCB0aGlzLk1ldGFGaXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyID0gbmV3IFJvdXRlcih0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm91dGVyLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGRlYnVnKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3Quc3RhcnRzV2l0aCgnbG9jYWxob3N0JylcbiAgICB9XG5cbiAgICBsb2codmFsKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgdGhpcy5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHZhbCwgJ2V2ZW50JywgJ2xvZycsICdsYWJlbCcpXG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmNvbnNvbGUuaW5mbyh2YWwpO1xuICAgIH1cblxuICAgIGVycm9yKHZhbCkge1xuICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcih2YWwpO1xuICAgICAgICBpZiAoIXRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgIHRoaXMuSW50ZWdyYXRpb25zLnNlbmRFdmVudCh2YWwsICdleGNlcHRpb24nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLk1ldGFGaXJlLmxvZ291dCgpO1xuICAgICAgICB0aGlzLkF1dGgwLmxvZ291dCgpO1xuICAgIH1cbn1cblxuY29uc3QgbW0gPSBuZXcgTWV0YU1hcCgpO1xubW9kdWxlLmV4cG9ydHMgPSBtbTsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNsYXNzIEFjdGlvbiBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLl9hY3Rpb25zID0ge307XG4gICAgfVxuXG4gICAgX2dldEFjdGlvbihhY3Rpb24pIHtcbiAgICAgICAgbGV0IHJldCA9IHRoaXMuX2FjdGlvbnNbYWN0aW9uXTtcbiAgICAgICAgaWYgKCFyZXQpIHtcbiAgICAgICAgICAgIGxldCBNZXRob2QgPSBudWxsO1xuICAgICAgICAgICAgc3dpdGNoKGFjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuT1BFTl9NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vT3Blbk1hcC5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLlRSQUlOSU5HUzpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9PcGVuVHJhaW5pbmcuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5ORVdfTUFQOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL05ld01hcC5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0NvcHlNYXAuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5DT1VSU0VfTElTVDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Db3Vyc2VzJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgQ09OU1RBTlRTLkFDVElPTlMuREVMRVRFX01BUDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9EZWxldGVNYXAuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5NWV9NQVBTOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL015TWFwcy5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkxPR09VVDpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9Mb2dvdXQuanMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVA6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vU2hhcmVNYXAnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuQUNUSU9OUy5URVJNU19BTkRfQ09ORElUSU9OUzpcbiAgICAgICAgICAgICAgICAgICAgTWV0aG9kID0gcmVxdWlyZSgnLi9UZXJtcy5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLOlxuICAgICAgICAgICAgICAgICAgICBNZXRob2QgPSByZXF1aXJlKCcuL0ZlZWRiYWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIE1ldGhvZCA9IHJlcXVpcmUoJy4vSG9tZS5qcycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNZXRob2QpIHtcbiAgICAgICAgICAgICAgICByZXQgPSBuZXcgTWV0aG9kKHRoaXMubWV0YUZpcmUsIHRoaXMuZXZlbnRlciwgdGhpcy5wYWdlRmFjdG9yeSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1thY3Rpb25dID0gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgYWN0KGFjdGlvbiwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdCgpO1xuICAgICAgICBsZXQgbWV0aG9kID0gdGhpcy5fZ2V0QWN0aW9uKGFjdGlvbik7XG4gICAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKClcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYWN0KC4uLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb247IiwiY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihtZXRhRmlyZSwgZXZlbnRlciwgcGFnZUZhY3RvcnkpIHtcbiAgICAgICAgdGhpcy5tZXRhRmlyZSA9IG1ldGFGaXJlO1xuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBldmVudGVyO1xuICAgICAgICB0aGlzLnBhZ2VGYWN0b3J5ID0gcGFnZUZhY3Rvcnk7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdG9nZ2xlU2lkZWJhcigpIHtcbiAgICAgICAgaWYodGhpcy5zaWRlYmFyT3Blbikge1xuICAgICAgICAgICAgdGhpcy5vcGVuU2lkZWJhcigpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlU2lkZWJhcigpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuU2lkZWJhcihpZCkge1xuICAgICAgICB0aGlzLnNpZGViYXJPcGVuID0gdHJ1ZVxuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sIGlkKVxuICAgIH1cblxuICAgIGNsb3NlU2lkZWJhcigpIHtcbiAgICAgICAgdGhpcy5zaWRlYmFyT3BlbiA9IGZhbHNlXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvbkJhc2U7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBDb3B5TWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdNdXN0IGhhdmUgYSBtYXAgaW4gb3JkZXIgdG8gY29weS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChvbGRNYXApID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogYCR7bmV3IERhdGUoKX1gLFxuICAgICAgICAgICAgICAgIG93bmVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogdGhpcy5hcHBlbmRDb3B5KG9sZE1hcC5uYW1lKSxcbiAgICAgICAgICAgICAgICBzaGFyZWRfd2l0aDoge1xuICAgICAgICAgICAgICAgICAgICBhZG1pbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICcqJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTogZmFsc2UgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuZ2V0RGF0YShgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfREFUQX0ke2lkfWApLnRoZW4oKG9sZE1hcERhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcHVzaFN0YXRlID0gdGhpcy5tZXRhRmlyZS5wdXNoRGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfWApO1xuICAgICAgICAgICAgICAgIGxldCBtYXBJZCA9IHB1c2hTdGF0ZS5rZXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFGaXJlLnNldERhdGEob2xkTWFwRGF0YSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0RBVEF9JHttYXBJZH1gKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXBwZW5kQ29weShzdHIpIHtcbiAgICAgICAgbGV0IHJldCA9IHN0cjtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHN0ciwgJyhDb3B5JykpIHtcbiAgICAgICAgICAgIHJldCA9IHJldCArICcgKENvcHkgMSknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG1lc3MgPSBzdHIuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGxldCBjbnQgPSAyO1xuICAgICAgICAgICAgaWYgKG1lc3MubGVuZ3RoIC0gbWVzcy5sYXN0SW5kZXhPZignKENvcHknKSA8PSA0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGdyYmcgPSBtZXNzW21lc3MubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKGdyYmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JiZyA9IGdyYmcucmVwbGFjZSgnKScsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgY250ID0gK2dyYmcgKyAxO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBtZXNzLnNsaWNlKDAsIG1lc3MubGVuZ3RoIC0gMikuam9pbignICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCArPSBgIChDb3B5ICR7Y250fSlgO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvcHlNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgaG9tZSA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvY291cnNlcycpO1xuXG5jbGFzcyBDb3Vyc2VzIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xuICAgICAgICBsZXQgdGFnID0gcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLkNPVVJTRV9MSVNUKVswXTtcbiAgICAgICAgdGFnLnVwZGF0ZSgpXG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuUEFHRVMuQ09VUlNFX0xJU1QsIHsgaWQ6IGlkIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnQ291cnNlcycgfSwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ291cnNlczsiLCJjb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNsYXNzIERlbGV0ZU1hcCBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgRGVsZXRlTWFwLmRlbGV0ZUFsbChbaWRdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGRlbGV0ZUFsbChpZHMsIHBhdGggPSBDT05TVEFOVFMuUEFHRVMuSE9NRSkge1xuICAgICAgICBjb25zdCBtZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcC5qcycpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXy5lYWNoKGlkcywgKGlkKSA9PiB7XG4gICAgICAgICAgICAgICAgbWV0YU1hcC5NZXRhRmlyZS5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7aWR9YCk7XG4gICAgICAgICAgICAgICAgbWV0YU1hcC5NZXRhRmlyZS5kZWxldGVEYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfSR7aWR9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIG1ldGFNYXAuUm91dGVyLnRvKHBhdGgpO1xuICAgICAgICB9ICAgICAgICBcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVsZXRlTWFwOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcblxuY2xhc3MgRmVlZGJhY2sgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHdpbmRvdy5Vc2VyU25hcDtcbiAgICB9XG5cbiAgICBhY3QoKSB7XG4gICAgICAgIHN1cGVyLmFjdCgpO1xuICAgICAgICB0aGlzLnVzZXJTbmFwLm9wZW5SZXBvcnRXaW5kb3coKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZlZWRiYWNrOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IGhvbWUgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2VzL2hvbWUnKTtcblxuY2xhc3MgSG9tZSBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLkhPTUUpO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5QQUdFX05BTUUsIHsgbmFtZTogJ0hvbWUnIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIb21lOyIsImNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuY2xhc3MgTG9nb3V0IGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMubWV0YU1hcC5sb2dvdXQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ291dDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCBob21lID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy9teS1tYXBzJyk7XG5cbmNsYXNzIE15TWFwcyBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcbiAgICAgICAgcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLk1ZX01BUFMpO1xuICAgICAgICB0aGlzLmV2ZW50ZXIuZG8oQ09OU1RBTlRTLlBBR0VTLk1ZX01BUFMsIHsgaWQ6IGlkIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnTXkgTWFwcycgfSwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5jbG9zZVNpZGViYXIoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNeU1hcHM7IiwiY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZS5qcycpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuXG5jbGFzcyBOZXdNYXAgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoKSB7XG4gICAgICAgIHN1cGVyLmFjdCgpO1xuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX05FV19NQVB9YCkudGhlbigoYmxhbmtNYXApID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdNYXAgPSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlZF9hdDogYCR7bmV3IERhdGUoKX1gLFxuICAgICAgICAgICAgICAgIG93bmVyOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLm1ldGFNYXAuVXNlci5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogdGhpcy5tZXRhTWFwLlVzZXIucGljdHVyZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbmFtZTogJ05ldyBVbnRpdGxlZCBNYXAnLFxuICAgICAgICAgICAgICAgIHNoYXJlZF93aXRoOiB7XG4gICAgICAgICAgICAgICAgICAgIGFkbWluOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgJyonOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHB1c2hTdGF0ZSA9IHRoaXMubWV0YUZpcmUucHVzaERhdGEobmV3TWFwLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH1gKTtcbiAgICAgICAgICAgIGxldCBtYXBJZCA9IHB1c2hTdGF0ZS5rZXkoKTtcbiAgICAgICAgICAgIHRoaXMubWV0YUZpcmUuc2V0RGF0YShuZXdNYXAsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19EQVRBfSR7bWFwSWR9YCk7XG4gICAgICAgICAgICB0aGlzLm1ldGFNYXAuUm91dGVyLnRvKGBtYXAvJHttYXBJZH1gKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOZXdNYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IG1ldGFDYW52YXMgPSByZXF1aXJlKCcuLi90YWdzL2NhbnZhcy9tZXRhLWNhbnZhcy5qcycpO1xuXG5jbGFzcyBPcGVuTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICAkKGAjJHtDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUn1gKS5lbXB0eSgpO1xuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChtYXApID0+IHtcbiAgICAgICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgICAgICByaW90Lm1vdW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKENPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSKSwgQ09OU1RBTlRTLlRBR1MuTUVUQV9DQU5WQVMpO1xuICAgICAgICAgICAgICAgIG1hcC5pZCA9IGlkO1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLk5BViwgQ09OU1RBTlRTLlBBR0VTLk1BUCwgbWFwLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgbWFwLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLk1BUCwgbWFwLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9wZW5NYXA7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgQWN0aW9uQmFzZSA9IHJlcXVpcmUoJy4vQWN0aW9uQmFzZScpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcbmNvbnN0IHRyYWluaW5nID0gcmVxdWlyZSgnLi4vdGFncy9wYWdlcy90cmFpbmluZycpXG5cbmNsYXNzIE9wZW5UcmFpbmluZyBleHRlbmRzIEFjdGlvbkJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlciguLi5wYXJhbXMpO1xuICAgIH1cblxuICAgIGFjdChpZCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyLmFjdChpZCwgLi4ucGFyYW1zKTtcbiAgICAgICAgJChgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVJ9YCkuZW1wdHkoKTtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICBsZXQgdGFnID0gcmlvdC5tb3VudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChDT05TVEFOVFMuRUxFTUVOVFMuQVBQX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLlRSQUlOSU5HKVswXTtcbiAgICAgICAgICAgIHRhZy51cGRhdGUoeyBpZDogaWQgfSk7XG4gICAgICAgICAgICB0aGlzLm9wZW5TaWRlYmFyKGlkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT3BlblRyYWluaW5nOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IEFjdGlvbkJhc2UgPSByZXF1aXJlKCcuL0FjdGlvbkJhc2UuanMnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbnJlcXVpcmUoJy4uL3RhZ3MvZGlhbG9ncy9zaGFyZScpXG5cbmNsYXNzIFNoYXJlTWFwIGV4dGVuZHMgQWN0aW9uQmFzZSB7XG4gICAgY29uc3RydWN0b3IoLi4ucGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKC4uLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgYWN0KGlkLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIuYWN0KGlkLCAuLi5wYXJhbXMpO1xuICAgICAgICB0aGlzLm1ldGFGaXJlLmdldERhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9JHtpZH1gKS50aGVuKChtYXApID0+IHtcbiAgICAgICAgICAgIG1hcC5pZCA9IGlkXG4gICAgICAgICAgICBTaGFyZU1hcC5hY3QoeyBtYXA6IG1hcCB9KVxuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLlJvdXRlci5iYWNrKClcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHN0YXRpYyBhY3QobWFwKSB7XG4gICAgICAgIGlmIChtYXApIHtcbiAgICAgICAgICAgIGxldCBtb2RhbCA9IHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfTU9EQUxfRElBTE9HX0NPTlRBSU5FUiksIENPTlNUQU5UUy5UQUdTLlNIQVJFKVswXVxuICAgICAgICAgICAgbW9kYWwudXBkYXRlKG1hcClcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZU1hcDsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBBY3Rpb25CYXNlID0gcmVxdWlyZSgnLi9BY3Rpb25CYXNlLmpzJyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCB0ZXJtcyA9IHJlcXVpcmUoJy4uL3RhZ3MvcGFnZXMvdGVybXMnKTtcblxuY2xhc3MgVGVybXMgZXh0ZW5kcyBBY3Rpb25CYXNlIHtcbiAgICBjb25zdHJ1Y3RvciguLi5wYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoLi4ucGFyYW1zKTtcbiAgICB9XG5cbiAgICBhY3QoaWQsIC4uLnBhcmFtcykge1xuICAgICAgICBzdXBlci5hY3QoaWQsIC4uLnBhcmFtcyk7XG4gICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5BUFBfQ09OVEFJTkVSfWApLmVtcHR5KCk7XG4gICAgICAgIHJpb3QubW91bnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQ09OU1RBTlRTLkVMRU1FTlRTLkFQUF9DT05UQUlORVIpLCBDT05TVEFOVFMuVEFHUy5URVJNUyk7XG4gICAgICAgIHRoaXMuZXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlBBR0VfTkFNRSwgeyBuYW1lOiAnVGVybXMgYW5kIENvbmRpdGlvbnMnIH0sIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMuY2xvc2VTaWRlYmFyKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXJtczsiLCJjb25zdCBNZXRhRmlyZSA9IHJlcXVpcmUoJy4vRmlyZWJhc2UnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG5jb25zdCBjb25maWcgPSAoKSA9PiB7XG4gICAgY29uc3QgU0lURVMgPSB7XG4gICAgICAgIENSTF9TVEFHSU5HOiB7XG4gICAgICAgICAgICBkYjogJ21ldGEtbWFwLXN0YWdpbmcnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXQgPSB7XG4gICAgICAgIGhvc3Q6IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxuICAgICAgICBzaXRlOiB7fVxuICAgIH1cbiAgICBsZXQgc2VnbWVudHMgPSByZXQuaG9zdC5zcGxpdCgnLicpO1xuICAgIGxldCBmaXJzdCA9IHNlZ21lbnRzWzBdO1xuICAgIGlmIChmaXJzdCA9PT0gJ3d3dycpIHtcbiAgICAgICAgZmlyc3QgPSBzZWdtZW50c1sxXTtcbiAgICB9XG4gICAgZmlyc3QgPSBmaXJzdC5zcGxpdCgnOicpWzBdO1xuXG4gICAgc3dpdGNoIChmaXJzdC50b0xvd2VyQ2FzZSgpKSB7XG5cbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcbiAgICAgICAgY2FzZSAnbWV0YS1tYXAtc3RhZ2luZyc6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXQuc2l0ZSA9IFNJVEVTLkNSTF9TVEFHSU5HO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbmNsYXNzIENvbmZpZyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0YWdzKSB7XG4gICAgICAgIHRoaXMudGFncyA9IHRhZ3M7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgIHRoaXMuTWV0YUZpcmUgPSBuZXcgTWV0YUZpcmUodGhpcy5jb25maWcpO1xuICAgIH1cblxuICAgIGdldCBzaXRlKCkge1xuICAgICAgICByZXR1cm4gJ2Zyb250ZW5kJztcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5vbignY29uZmlnJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5NZXRhRmlyZS5vbignbWV0YW1hcC9jYW52YXMnLCAoY2FudmFzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKHRoaXMuY29uZmlnLnNpdGUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdWxmaWxsKHRoaXMuY29uZmlnLnNpdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlYWR5O1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHkoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90JylcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuXG5jbGFzcyBFdmVudGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKG1ldGFNYXApIHtcbiAgICAgICAgXG4gICAgICAgIHJpb3Qub2JzZXJ2YWJsZSh0aGlzKTtcblxuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9XG4gICAgfVxuXG4gICAgZXZlcnkoZXZlbnQsIHJlYWN0aW9uKSB7XG4gICAgICAgIC8vbGV0IGNhbGxiYWNrID0gcmVhY3Rpb247XG4gICAgICAgIC8vaWYgKHRoaXMuZXZlbnRzW2V2ZW50XSkge1xuICAgICAgICAvLyAgICBsZXQgcGlnZ3liYWNrID0gdGhpcy5ldmVudHNbZXZlbnRdO1xuICAgICAgICAvLyAgICBjYWxsYmFjayA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgICAgLy8gICAgICAgIHBpZ2d5YmFjayguLi5wYXJhbXMpO1xuICAgICAgICAvLyAgICAgICAgcmVhY3Rpb24oLi4ucGFyYW1zKTtcbiAgICAgICAgLy8gICAgfVxuICAgICAgICAvL31cbiAgICAgICAgbGV0IGV2ZW50cyA9IGV2ZW50LnNwbGl0KCcgJyk7XG4gICAgICAgIF8uZWFjaChldmVudHMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XSA9IHJlYWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5vbihldmVudCwgcmVhY3Rpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3JnZXQoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub2ZmKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkbyhldmVudCwgLi4ucGFyYW1zKSB7XG4gICAgICAgIGxldCBldmVudHMgPSBldmVudC5zcGxpdCgnICcpO1xuICAgICAgICBfLmVhY2goZXZlbnRzLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoZXZlbnQsIC4uLnBhcmFtcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50ZXI7IiwibGV0IEZpcmViYXNlID0gd2luZG93LkZpcmViYXNlO1xubGV0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5sZXQgbG9jYWxmb3JhZ2UgPSByZXF1aXJlKCdsb2NhbGZvcmFnZScpXG5cbmNsYXNzIE1ldGFGaXJlIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5mYiA9IG5ldyBGaXJlYmFzZShgaHR0cHM6Ly8ke3RoaXMuY29uZmlnLnNpdGUuZGJ9LmZpcmViYXNlaW8uY29tYCk7XG4gICAgfVxuXG4gICAgZ2V0IG1ldGFNYXAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWV0YU1hcCkge1xuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbWV0YU1hcDtcbiAgICB9XG5cbiAgICBsb2dpbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9sb2dpbikge1xuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgd2luZG93Lk1ldGFNYXAuQXV0aDAuZ2V0U2Vzc2lvbigpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChwcm9maWxlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5NZXRhTWFwLkF1dGgwLmxvY2suZ2V0Q2xpZW50KCkuZ2V0RGVsZWdhdGlvblRva2VuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRoaXMuY29uZmlnLnNpdGUuYXV0aDAuYXBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBwcm9maWxlLmlkX3Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaV90eXBlOiAnZmlyZWJhc2UnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAoZXJyLCBkZWxlZ2F0aW9uUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlLmZpcmViYXNlX3Rva2VuID0gZGVsZWdhdGlvblJlc3VsdC5pZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlYmFzZV90b2tlbiA9IGRlbGVnYXRpb25SZXN1bHQuaWRfdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2ZpcmViYXNlX3Rva2VuJywgdGhpcy5maXJlYmFzZV90b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmIuYXV0aFdpdGhDdXN0b21Ub2tlbih0aGlzLmZpcmViYXNlX3Rva2VuLCAoZXJyb3IsIGF1dGhEYXRhLCAuLi5wYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVsZmlsbChhdXRoRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fb25SZWFkeSA9IHRoaXMuX2xvZ2luO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dpbjtcbiAgICB9XG5cbiAgICBvblJlYWR5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX29uUmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgZ2V0Q2hpbGQocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mYi5jaGlsZChwYXRoKTtcbiAgICB9XG5cbiAgICBnZXREYXRhKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25SZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5mYjtcbiAgICAgICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGNoaWxkLm9uY2UoJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgKHNuYXBzaG90KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb24ocGF0aCwgY2FsbGJhY2ssIGV2ZW50ID0gJ3ZhbHVlJykge1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgICAgICAgICBsZXQgbWV0aG9kID0gKHNuYXBzaG90KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoIXNuYXBzaG90LmV4aXN0cygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgY2hpbGQub2ZmKGV2ZW50LCBtZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gZGF0YSBhdCAke3BhdGh9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY2hpbGQub2ZmKGV2ZW50LCBtZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2hpbGQub24oZXZlbnQsIG1ldGhvZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9mZihwYXRoLCBtZXRob2QgPSAndmFsdWUnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZChwYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub2ZmKG1ldGhvZCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm9mZihtZXRob2QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RGF0YShkYXRhLCBwYXRoKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuZmI7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZXQoZGF0YSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKGUsIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlRGF0YShwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldERhdGEobnVsbCwgcGF0aCk7XG4gICAgfVxuXG4gICAgcHVzaERhdGEoZGF0YSwgcGF0aCkge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQucHVzaChkYXRhLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoZSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXREYXRhSW5UcmFuc2FjdGlvbihkYXRhLCBwYXRoLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmZiO1xuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY2hpbGQgPSB0aGlzLmdldENoaWxkKHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQudHJhbnNhY3Rpb24oKGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihlLCBwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVycm9yKGUsIHBhdGgpIHtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgdGhpcy5tZXRhTWFwLmVycm9yKHsgbWVzc2FnZTogYFBlcm1pc3Npb24gZGVuaWVkIHRvICR7cGF0aH1gIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICB0aGlzLl9sb2dpbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX29uUmVhZHkgPSBudWxsO1xuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdmaXJlYmFzZV90b2tlbicpO1xuICAgICAgICB0aGlzLmZiLnVuYXV0aCgpO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gTWV0YUZpcmU7IiwiY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbmNsYXNzIEludGVncmF0aW9ucyB7XG5cblx0Y29uc3RydWN0b3IobWV0YU1hcCwgdXNlcikge1xuXHRcdHRoaXMuY29uZmlnID0gbWV0YU1hcC5jb25maWc7XG5cdFx0dGhpcy5tZXRhTWFwID0gbWV0YU1hcDtcblx0XHR0aGlzLnVzZXIgPSB1c2VyO1xuXHRcdHRoaXMuX2ZlYXR1cmVzID0ge1xuXHRcdFx0Z29vZ2xlOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvR29vZ2xlJyksXG5cdFx0XHR1c2Vyc25hcDogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1VzZXJTbmFwJyksXG4gICAgICAgICAgICBhZGR0aGlzOiByZXF1aXJlKCcuLi9pbnRlZ3JhdGlvbnMvQWRkVGhpcycpLFxuICAgICAgICAgICAgeW91dHViZTogcmVxdWlyZSgnLi4vaW50ZWdyYXRpb25zL1lvdVR1YmUnKVxuXHRcdH07XG5cdH1cblxuXHRpbml0KCkge1xuICAgICAgICBfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoRmVhdHVyZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGxldCBjb25maWcgPSB0aGlzLmNvbmZpZy5zaXRlW25hbWVdO1xuXHRcdFx0XHRcdHRoaXNbbmFtZV0gPSBuZXcgRmVhdHVyZShjb25maWcsIHRoaXMudXNlcik7XG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5pbml0KCk7XG5cdFx0XHRcdFx0dGhpc1tuYW1lXS5zZXRVc2VyKCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHR0aGlzLm1ldGFNYXAuZXJyb3IoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cdHNldFVzZXIoKSB7XG5cdFx0Xy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNldFVzZXIoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgfVxuXHRcdFx0fVxuICAgICAgICB9KTtcblx0fVxuXG5cdHNlbmRFdmVudCh2YWwsIC4uLnBhcmFtcykge1xuICAgICAgICBpZiAoIXRoaXMubWV0YU1hcC5kZWJ1Zykge1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMuX2ZlYXR1cmVzLCAoRmVhdHVyZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW25hbWVdLnNlbmRFdmVudCh2YWwsIC4uLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblx0fVxuXG5cdHVwZGF0ZVBhdGgoKSB7XG5cblx0fVxuXG5cdGxvZ291dCgpIHtcblx0XHRfLmVhY2godGhpcy5fZmVhdHVyZXMsIChGZWF0dXJlLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAobmFtZSkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHRoaXNbbmFtZV0ubG9nb3V0KCk7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHRoaXMubWV0YU1hcC5lcnJvcihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuICAgICAgICB9KTtcblx0fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZWdyYXRpb25zOyIsImNsYXNzIFBlcm1pc3Npb25zIHtcblxuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgICAgICB0aGlzLm1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJylcbiAgICB9XG5cbiAgICBjYW5FZGl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc01hcE93bmVyKCkgfHwgdGhpcy5pc1NoYXJlZEVkaXQoKVxuICAgIH1cblxuICAgIGNhblZpZXcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzTWFwT3duZXIoKSB8fCB0aGlzLmlzU2hhcmVkVmlldygpXG4gICAgfVxuXG4gICAgaXNNYXBPd25lcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICYmIHRoaXMubWFwLm93bmVyLnVzZXJJZCA9PSB0aGlzLm1ldGFNYXAuVXNlci51c2VySWRcbiAgICB9XG5cbiAgICBpc1NoYXJlZEVkaXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAmJlxuICAgICAgICAgICAgdGhpcy5tYXAuc2hhcmVkX3dpdGggJiZcbiAgICAgICAgICAgICAgICAodGhpcy5tZXRhTWFwLlVzZXIuaXNBZG1pbiB8fFxuICAgICAgICAgICAgICAgICh0aGlzLm1hcC5zaGFyZWRfd2l0aFt0aGlzLm1ldGFNYXAuVXNlci51c2VySWRdICYmIHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0ud3JpdGUgPT0gdHJ1ZSkgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXSAmJiB0aGlzLm1hcC5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpKVxuICAgIH1cblxuICAgIGlzU2hhcmVkVmlldygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICYmXG4gICAgICAgICAgICB0aGlzLmlzU2hhcmVkRWRpdCgpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMubWFwLnNoYXJlZF93aXRoW3RoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZF0gJiYgdGhpcy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5tZXRhTWFwLlVzZXIudXNlcklkXS5yZWFkID09IHRydWUpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMubWFwLnNoYXJlZF93aXRoWycqJ10gJiYgdGhpcy5tYXAuc2hhcmVkX3dpdGhbJyonXS5yZWFkID09IHRydWUpXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcm1pc3Npb25zOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi90eXBpbmdzL3Jpb3Rqcy9yaW90anMuZC50c1wiIC8+XG5jb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNsYXNzIFJvdXRlciB7XG4gICAgY29uc3RydWN0b3IobWV0YU1hcCkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9ucyA9IG1ldGFNYXAuSW50ZWdyYXRpb25zO1xuICAgICAgICB0aGlzLnVzZXIgPSBtZXRhTWFwLlVzZXI7XG4gICAgICAgIHRoaXMuUGFnZUZhY3RvcnkgPSBtZXRhTWFwLlBhZ2VGYWN0b3J5O1xuICAgICAgICB0aGlzLmV2ZW50ZXIgPSBtZXRhTWFwLkV2ZW50ZXI7XG4gICAgICAgIHRoaXMuaXNIaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICByaW90LnJvdXRlLnN0YXJ0KCk7XG4gICAgICAgIHJpb3Qucm91dGUoKHRhcmdldCwgaWQgPSAnJywgYWN0aW9uID0gJycsIC4uLnBhcmFtcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYXRoID0gdGhpcy5nZXRQYXRoKHRhcmdldCk7XG5cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlTWFpbih0cnVlLCB0aGlzLnBhdGgpO1xuICAgICAgICAgICAgdGhpcy5QYWdlRmFjdG9yeS5uYXZpZ2F0ZSh0aGlzLnBhdGgsIGlkLCBhY3Rpb24sIC4uLnBhcmFtcyk7XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbygnaGlzdG9yeScsIHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudG8odGhpcy5jdXJyZW50UGFnZSk7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYWdlKCkge1xuICAgICAgICBsZXQgcGFnZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8ICdob21lJztcbiAgICAgICAgaWYgKCF0aGlzLmlzVHJhY2tlZChwYWdlKSkge1xuICAgICAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAocGFnZUNudCA+IDApIHtcbiAgICAgICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSAxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2U7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYXRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXRoO1xuICAgIH1cblxuICAgIGdldFByZXZpb3VzUGFnZShwYWdlTm8gPSAyKSB7XG4gICAgICAgIGxldCBwYWdlID0gJ2hvbWUnO1xuICAgICAgICBsZXQgcGFnZUNudCA9IHRoaXMudXNlci5oaXN0b3J5Lmxlbmd0aDtcbiAgICAgICAgaWYgKHBhZ2VDbnQgPiAwKSB7XG4gICAgICAgICAgICBwYWdlID0gdGhpcy5nZXRQYXRoKHRoaXMudXNlci5oaXN0b3J5W3BhZ2VDbnQgLSBwYWdlTm9dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZTtcbiAgICB9XG5cbiAgICBnZXQgcHJldmlvdXNQYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmV2aW91c1BhZ2UoMik7XG4gICAgfVxuXG4gICAgdHJhY2socGF0aCkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9ucy51cGRhdGVQYXRoKHBhdGgpO1xuICAgIH1cblxuICAgIHRvZ2dsZU1haW4oaGlkZSwgcGF0aCkge1xuICAgICAgICB0aGlzLnRyYWNrKHBhdGgpO1xuICAgICAgICBpZiAoaGlkZSkge1xuICAgICAgICAgICAgdGhpcy5pc0hpZGRlbiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQYXRoKHBhdGgpIHtcbiAgICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJyEnKSB8fCBwYXRoLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG5cbiAgICB0byhwYXRoKSB7XG4gICAgICAgIHBhdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU1haW4odHJ1ZSwgcGF0aCk7XG4gICAgICAgICAgICByaW90LnJvdXRlKGAke3BhdGh9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiYWNrKCkge1xuICAgICAgICBsZXQgcGF0aCA9ICdob21lJztcbiAgICAgICAgbGV0IHBhZ2VDbnQgPSB0aGlzLnVzZXIuaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgIGlmIChwYWdlQ250ID4gMSAmJiAodGhpcy5jdXJyZW50UGFnZSAhPSAnbXltYXBzJyB8fCB0aGlzLmN1cnJlbnRQYWdlICE9IHRoaXMucHJldmlvdXNQYWdlKSkge1xuICAgICAgICAgICAgcGF0aCA9IHRoaXMucHJldmlvdXNQYWdlO1xuICAgICAgICAgICAgbGV0IGJhY2tObyA9IDI7XG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNUcmFja2VkKHBhdGgpICYmIHRoaXMudXNlci5oaXN0b3J5W2JhY2tOb10pIHtcbiAgICAgICAgICAgICAgICBiYWNrTm8gKz0gMTtcbiAgICAgICAgICAgICAgICBwYXRoID0gdGhpcy5nZXRQcmV2aW91c1BhZ2UoYmFja05vKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy50byhwYXRoKTtcbiAgICB9XG5cbiAgICBnZXQgZG9Ob3RUcmFjaygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kb05vdFRyYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9kb05vdFRyYWNrID0gW0NPTlNUQU5UUy5BQ1RJT05TLkRFTEVURV9NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkNPUFlfTUFQLCBDT05TVEFOVFMuQUNUSU9OUy5MT0dPVVQsIENPTlNUQU5UUy5BQ1RJT05TLk5FV19NQVAsIENPTlNUQU5UUy5BQ1RJT05TLkZFRURCQUNLLCBDT05TVEFOVFMuQUNUSU9OUy5TSEFSRV9NQVBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kb05vdFRyYWNrO1xuICAgIH1cblxuICAgIGlzVHJhY2tlZChwYXRoKSB7XG4gICAgICAgIGxldCBwdGggPSB0aGlzLmdldFBhdGgocGF0aCk7XG4gICAgICAgIHJldHVybiBfLmFueSh0aGlzLmRvTm90VHJhY2ssIChwKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIXB0aC5zdGFydHNXaXRoKHApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUm91dGVyOyIsImNvbnN0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcblxuY29uc3QgdG9Cb29sID0gKHZhbCkgPT4ge1xuICAgIGxldCByZXQgPSBmYWxzZTtcbiAgICBpZiAodmFsID09PSB0cnVlIHx8IHZhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0ID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChfLmNvbnRhaW5zKFsndHJ1ZScsICd5ZXMnLCAnMSddLCB2YWwgKyAnJy50b0xvd2VyQ2FzZSgpLnRyaW0oKSkpIHtcbiAgICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuY2xhc3MgU2hhcmluZyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih1c2VyKSB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXJcbiAgICAgICAgdGhpcy5fbWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxuICAgICAgICB0aGlzLl9mYiA9IHRoaXMuX21ldGFNYXAuTWV0YUZpcmU7XG4gICAgfVxuXG4gICAgYWRkU2hhcmUobWFwLCB1c2VyRGF0YSwgb3B0cyA9IHsgcmVhZDogdHJ1ZSwgd3JpdGU6IGZhbHNlIH0pIHtcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZiLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHJlYWQ6IHRvQm9vbChvcHRzLnJlYWQpLFxuICAgICAgICAgICAgICAgIHdyaXRlOiB0b0Jvb2wob3B0cy53cml0ZSksXG4gICAgICAgICAgICAgICAgbmFtZTogb3B0cy5uYW1lLFxuICAgICAgICAgICAgICAgIHBpY3R1cmU6IG9wdHMucGljdHVyZVxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXG4gICAgICAgICAgICB0aGlzLl9mYi5wdXNoRGF0YSh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGAke3RoaXMudXNlci5kaXNwbGF5TmFtZX0gc2hhcmVkIGEgbWFwLCAke21hcC5uYW1lfSwgd2l0aCB5b3UhYCxcbiAgICAgICAgICAgICAgICBtYXBJZDogbWFwLmlkLFxuICAgICAgICAgICAgICAgIHR5cGU6IENPTlNUQU5UUy5OT1RJRklDQVRJT04uTUFQLFxuICAgICAgICAgICAgICAgIHRpbWU6IGAke25ldyBEYXRlKCl9YFxuICAgICAgICAgICAgfSwgYCR7Q09OU1RBTlRTLlJPVVRFUy5OT1RJRklDQVRJT05TLmZvcm1hdCh1c2VyRGF0YS5pZCl9YClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVNoYXJlKG1hcCwgdXNlckRhdGEpIHtcbiAgICAgICAgaWYgKG1hcCAmJiBtYXAuaWQgJiYgdXNlckRhdGEgJiYgdXNlckRhdGEuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZiLmRlbGV0ZURhdGEoYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7bWFwLmlkfS9zaGFyZWRfd2l0aC8ke3VzZXJEYXRhLmlkfWApXG4gICAgICAgICAgICB0aGlzLl9mYi5wdXNoRGF0YSh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGAke3RoaXMudXNlci5kaXNwbGF5TmFtZX0gcmVtb3ZlZCBhIG1hcCwgJHttYXAubmFtZX0sIHRoYXQgd2FzIHByZXZpb3VzbHkgc2hhcmVkLmAsXG4gICAgICAgICAgICAgICAgdGltZTogYCR7bmV3IERhdGUoKX1gXG4gICAgICAgICAgICB9LCBgJHtDT05TVEFOVFMuUk9VVEVTLk5PVElGSUNBVElPTlMuZm9ybWF0KHVzZXJEYXRhLmlkKX1gKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZWRpdFNoYXJlKG1hcElkLCB1c2VyRGF0YSwgb3B0cyA9IHsgcmVhZDogdHJ1ZSwgd3JpdGU6IGZhbHNlIH0pIHtcblxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJpbmciLCJjb25zdCBBdXRoMExvY2sgPSByZXF1aXJlKCdhdXRoMC1sb2NrJylcbmNvbnN0IGxvY2FsZm9yYWdlID0gcmVxdWlyZSgnbG9jYWxmb3JhZ2UnKVxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXG5jbGFzcyBBdXRoMCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIG1ldGFNYXApIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IG1ldGFNYXA7XG4gICAgICAgIHRoaXMubG9jayA9IG5ldyBBdXRoMExvY2soY29uZmlnLmFwaSwgY29uZmlnLmFwcCk7XG4gICAgICAgIHRoaXMubG9jay5vbignbG9hZGluZyByZWFkeScsICguLi5lKSA9PiB7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5fbG9naW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2luID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzaG93TG9naW4gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luQWZ0ZXJTaWdudXA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoUGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICdvcGVuaWQgb2ZmbGluZV9hY2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnIsIHByb2ZpbGUsIGlkX3Rva2VuLCBjdG9rZW4sIG9wdCwgcmVmcmVzaF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25GYWlsKGVyciwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSBwcm9maWxlLmN0b2tlbiA9IGN0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdjdG9rZW4nLCB0aGlzLmN0b2tlbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkX3Rva2VuID0gcHJvZmlsZS5pZF90b2tlbiA9IGlkX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgdGhpcy5pZF90b2tlbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Byb2ZpbGUnLCB0aGlzLnByb2ZpbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoX3Rva2VuID0gcHJvZmlsZS5yZWZyZXNoX3Rva2VuID0gcmVmcmVzaF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRTZXNzaW9uID0gZnVsZmlsbChwcm9maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2Vzc2lvbigpLnRoZW4oKHByb2ZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TG9naW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0xvZ2luKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9naW47XG4gICAgfVxuXG4gICAgbGlua0FjY291bnQoKSB7XG4gICAgICAgIHRoaXMubG9jay5zaG93KHtcbiAgICAgICAgICAgIGNhbGxiYWNrVVJMOiBsb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgJycpLFxuICAgICAgICAgICAgZGljdDoge1xuICAgICAgICAgICAgICAgIHNpZ25pbjoge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0xpbmsgd2l0aCBhbm90aGVyIGFjY291bnQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGF1dGhQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoaXMuY3Rva2VuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uRmFpbChlcnIsIHJlamVjdCkge1xuICAgICAgICB0aGlzLm1ldGFNYXAuZXJyb3IoZXJyKTtcbiAgICAgICAgaWYgKHJlamVjdCkge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2Vzc2lvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBmdWxmaWxsKHRoaXMucHJvZmlsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGhpcy5fZ2V0U2Vzc2lvbikge1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnaWRfdG9rZW4nKS50aGVuKChpZF90b2tlbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaWRfdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2suZ2V0UHJvZmlsZShpZF90b2tlbiwgKGVyciwgcHJvZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkZhaWwoZXJyLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2lkX3Rva2VuJywgaWRfdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdwcm9maWxlJywgcHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2N0b2tlbicpLnRoZW4oKHRva2VuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN0b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IHByb2ZpbGUuaWRfdG9rZW4gPSBpZF90b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9maWxlID0gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGZpbGwocHJvZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignTm8gc2Vzc2lvbicpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFNlc3Npb247XG4gICAgfVxuXG4gICAgbG9nb3V0KCkge1xuICAgICAgICBsb2NhbGZvcmFnZS5yZW1vdmVJdGVtKCdpZF90b2tlbicpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLnJlbW92ZUl0ZW0oJ3Byb2ZpbGUnKTtcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5pZF90b2tlbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hfdG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fbG9naW4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fZ2V0U2Vzc2lvbiA9IG51bGw7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gQXV0aDA7XG5cblxuIiwiY29uc3QgdXVpZCA9IHJlcXVpcmUoJy4uL3Rvb2xzL3V1aWQuanMnKTtcbmNvbnN0IENvbW1vbiA9IHJlcXVpcmUoJy4uL3Rvb2xzL0NvbW1vbicpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbmNsYXNzIFVzZXIge1xuICAgIGNvbnN0cnVjdG9yKHByb2ZpbGUsIGF1dGgsIGV2ZW50ZXIsIG1ldGFGaXJlKSB7XG4gICAgICAgIHRoaXMuYXV0aCA9IGF1dGg7XG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XG4gICAgICAgIHRoaXMubWV0YUZpcmUgPSBtZXRhRmlyZTtcbiAgICAgICAgdGhpcy51c2VyS2V5ID0gdXVpZCgpO1xuICAgICAgICB0aGlzLm9uUmVhZHkoKTtcbiAgICAgICAgdGhpcy5tZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fb25SZWFkeSkge1xuICAgICAgICAgICAgbGV0IHRyYWNrSGlzdG9yeSA9IF8ub25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudGVyLmV2ZXJ5KCdoaXN0b3J5JywgKHBhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlzdG9yeS5sZW5ndGggPT0gMCB8fCBwYWdlICE9IHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5zZXREYXRhKHRoaXMuaGlzdG9yeSwgYHVzZXJzLyR7dGhpcy5hdXRoLnVpZH0vaGlzdG9yeWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX29uUmVhZHkgPSBuZXcgUHJvbWlzZSgoZnVsZmlsbCwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXRhRmlyZS5vbihgdXNlcnMvJHt0aGlzLmF1dGgudWlkfWAsICh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5oaXN0b3J5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIuaGlzdG9yeSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2ZpbGUgPSB1c2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrSGlzdG9yeSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGZpbGwodXNlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcbiAgICB9XG5cbiAgICBnZXQgX2lkZW50aXR5KCkge1xuICAgICAgICBsZXQgcmV0ID0ge307XG4gICAgICAgIGlmICh0aGlzLnByb2ZpbGUgJiYgdGhpcy5wcm9maWxlLmlkZW50aXR5KSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb2ZpbGUuaWRlbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXQgY3JlYXRlZE9uKCkge1xuICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9jcmVhdGVkT24pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pZGVudGl0eS5jcmVhdGVkX2F0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGR0ID0gbmV3IERhdGUodGhpcy5faWRlbnRpdHkuY3JlYXRlZF9hdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlZE9uID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBkdCxcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IENvbW1vbi5nZXRUaWNrc0Zyb21EYXRlKGR0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlZE9uIHx8IHsgZGF0ZTogbnVsbCwgdGlja3M6IG51bGwgfTtcbiAgICB9XG5cbiAgICBnZXQgZGlzcGxheU5hbWUoKSB7XG4gICAgICAgIGxldCByZXQgPSB0aGlzLmZ1bGxOYW1lO1xuICAgICAgICBpZiAocmV0KSB7XG4gICAgICAgICAgICByZXQgPSByZXQuc3BsaXQoJyAnKVswXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJldCAmJiB0aGlzLl9pZGVudGl0eS5uaWNrbmFtZSkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmlja25hbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGdldCBmdWxsTmFtZSgpIHtcbiAgICAgICAgbGV0IHJldCA9ICcnO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkubmFtZSkge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5faWRlbnRpdHkubmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGdldCBlbWFpbCgpIHtcbiAgICAgICAgbGV0IHJldCA9ICcnO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkuZW1haWwpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LmVtYWlsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgZ2V0IHBpY3R1cmUoKSB7XG4gICAgICAgIGxldCByZXQgPSAnJztcbiAgICAgICAgaWYgKHRoaXMuX2lkZW50aXR5LnBpY3R1cmUpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LnBpY3R1cmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBnZXQgdXNlcklkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoLnVpZDtcbiAgICB9XG5cbiAgICBnZXQgaXNBZG1pbigpIHtcbiAgICAgICAgbGV0IHJldCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5faWRlbnRpdHkucm9sZXMpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMuX2lkZW50aXR5LnJvbGVzLmFkbWluID09IHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0XG4gICAgfVxuXG4gICAgZ2V0IGhpc3RvcnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2ZpbGUuaGlzdG9yeSB8fCBbXTtcbiAgICB9XG5cbiAgICBzYXZlVXNlckVkaXRvck9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICBlZGl0b3Jfb3B0aW9uczogSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlcjsiLCJjb25zdCBqc1BsdW1iID0gd2luZG93LmpzUGx1bWI7XG5jb25zdCBqc1BsdW1iVG9vbGtpdCA9IHdpbmRvdy5qc1BsdW1iVG9vbGtpdDtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5jb25zdCBQZXJtaXNzaW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9QZXJtaXNzaW9ucycpXG5cbnJlcXVpcmUoJy4vbGF5b3V0JylcblxuY2xhc3MgQ2FudmFzIHtcblxuICAgIGNvbnN0cnVjdG9yKG1hcCwgbWFwSWQpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgICAgIHRoaXMubWFwSWQgPSBtYXBJZDtcbiAgICAgICAgdGhpcy50b29sa2l0ID0ge307XG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxuICAgICAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xuXG4gICAgICAgIGxldCByZWFkeSA9IHRoaXMubWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke21hcElkfWApLnRoZW4oKG1hcEluZm8pID0+IHtcbiAgICAgICAgICAgIHRoaXMubWFwSW5mbyA9IG1hcEluZm9cbiAgICAgICAgICAgIHBlcm1pc3Npb25zID0gbmV3IFBlcm1pc3Npb25zKG1hcEluZm8pXG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IHRocm90dGxlU2F2ZSA9IF8udGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb25zLmNhbkVkaXQoKSkge1xuICAgICAgICAgICAgICAgIGxldCBwb3N0RGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogd2luZG93LnRvb2xraXQuZXhwb3J0RGF0YSgpLFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkX2J5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMubWV0YU1hcC5Vc2VyLnVzZXJJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YUluVHJhbnNhY3Rpb24ocG9zdERhdGEsIGBtYXBzL2RhdGEvJHt0aGlzLm1hcElkfWApO1xuICAgICAgICAgICAgICAgIHRoaXMubWV0YU1hcC5JbnRlZ3JhdGlvbnMuc2VuZEV2ZW50KHRoaXMubWFwSWQsICdldmVudCcsICdhdXRvc2F2ZScsICdhdXRvc2F2ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMCk7XG5cbiAgICAgICAgcmVhZHkudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Q29ybmVyXG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFRvb2xraXQuIHByb3ZpZGUgYSBzZXQgb2YgbWV0aG9kcyB0aGF0IGNvbnRyb2wgd2hvIGNhbiBjb25uZWN0IHRvIHdoYXQsIGFuZCB3aGVuLlxuICAgICAgICAgICAgICAgIHZhciB0b29sa2l0ID0gd2luZG93LnRvb2xraXQgPSBqc1BsdW1iVG9vbGtpdC5uZXdJbnN0YW5jZSh7XG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVN0YXJ0Q29ubmVjdDpmdW5jdGlvbihmcm9tTm9kZSwgZWRnZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb3JuZXIgPSBlZGdlVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBlZGdlVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVDb25uZWN0OmZ1bmN0aW9uKGZyb21Ob2RlLCB0b05vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9QcmV2ZW50IHNlbGYtcmVmZXJlbmNpbmcgY29ubmVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZyb21Ob2RlID09IHRvTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0JldHdlZW4gdGhlIHNhbWUgdHdvIG5vZGVzLCBvbmx5IG9uZSBwZXJzcGVjdGl2ZSBjb25uZWN0aW9uIG1heSBleGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaChjdXJyZW50Q29ybmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BlcnNwZWN0aXZlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZGdlcyA9IGZyb21Ob2RlLmdldEVkZ2VzKHsgZmlsdGVyOiBmdW5jdGlvbihlKSB7IHJldHVybiBlLmRhdGEudHlwZSA9PSAncGVyc3BlY3RpdmUnIH19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8ZWRnZXMubGVuZ3RoOyBpKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlZCA9IGVkZ2VzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKChlZC5zb3VyY2UgPT0gZnJvbU5vZGUgJiYgZWQudGFyZ2V0ID09IHRvTm9kZSkgfHwgKGVkLnRhcmdldCA9PSBmcm9tTm9kZSAmJiBlZC5zb3VyY2UgPT0gdG9Ob2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgbm9kZS5cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIHZhciBfbmV3Tm9kZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZT10eXBlfHxcImlkZWFcIlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdzo1MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6NTAsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDpcImlkZWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbFBvc2l0aW9uOiBbXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBkdW1teSBmb3IgYSBuZXcgcHJveHkgKGRyYWcgaGFuZGxlKVxuICAgICAgICAgICAgICAgIHZhciBfbmV3UHJveHkgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8ICdwcm94eVBlcnNwZWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdzoxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGg6MTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOnR5cGVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIG1haW5FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5qdGstZGVtby1tYWluXCIpLFxuICAgICAgICAgICAgICAgICAgICBjYW52YXNFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5qdGstZGVtby1jYW52YXNcIik7XG5cblxuICAgICAgICAgICAgICAgIC8vV2hlbmV2ZXIgY2hhbmdpbmcgdGhlIHNlbGVjdGlvbiwgY2xlYXIgd2hhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIHZhciBjbGVhclNlbGVjdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5zZXRTZWxlY3Rpb24ob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGNvbmZpZ3VyZSB0aGUgcmVuZGVyZXJcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSB0b29sa2l0LnJlbmRlcih7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogY2FudmFzRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNEcmFnZ2FibGU6IHBlcm1pc3Npb25zLmNhbkVkaXQoKSxcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlUGFuQnV0dG9uczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGxheW91dDp7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjdXN0b20gbGF5b3V0IGZvciB0aGlzIGFwcC4gc2ltcGxlIGV4dGVuc2lvbiBvZiB0aGUgc3ByaW5nIGxheW91dC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJtZXRhbWFwXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBob3cgeW91IGNhbiBhc3NvY2lhdGUgZ3JvdXBzIG9mIG5vZGVzLiBIZXJlLCBiZWNhdXNlIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyB3YXkgSSBoYXZlIHJlcHJlc2VudGVkIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGEsIHdlIGVpdGhlciByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgLy8gYSBwYXJ0J3MgXCJwYXJlbnRcIiBhcyB0aGUgcG9zc2UsIG9yIGlmIGl0IGlzIG5vdCBhIHBhcnQgdGhlbiB3ZVxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gdGhlIG5vZGUncyBpZC4gVGhlcmUgYXJlIGFkZFRvUG9zc2UgYW5kIHJlbW92ZUZyb21Qb3NzZVxuICAgICAgICAgICAgICAgICAgICAvLyBtZXRob2RzIHRvbyAob24gdGhlIHJlbmRlcmVyLCBub3QgdGhlIHRvb2xraXQpOyB0aGVzZSBjYW4gYmUgdXNlZFxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHRyYW5zZmVycmluZyBhIHBhcnQgZnJvbSBvbmUgcGFyZW50IHRvIGFub3RoZXIuXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnblBvc3NlOmZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmRhdGEucGFyZW50ID8geyBwb3NzZTpub2RlLmRhdGEucGFyZW50LCBhY3RpdmU6ZmFsc2UgfSA6IG5vZGUuaWQ7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHpvb21Ub0ZpdDpmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlldzp7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlczp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbihvYmoubm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbihvYmopIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsTm9kZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJkZWZhdWx0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwici10aGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJpZGVhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6XCJ0bXBsRHJhZ1Byb3h5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcnM6IFsnQ29udGludW91cycsICdDZW50ZXInXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlQZXJzcGVjdGl2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwicHJveHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJveHlSZWxhdGlvbnNoaXA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcInByb3h5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vb2JqLm5vZGUuZGF0YS50eXBlID0gJ3ItdGhpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vYmoubm9kZS5zZXRUeXBlKCdyLXRoaW5nJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1VwZGF0aW5nIHRoZSBub2RlIHR5cGUgZG9lcyBub3Qgc2VlbSB0byBzdGljazsgaW5zdGVhZCwgY3JlYXRlIGEgbmV3IG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHJlbmRlcmVyLm1hcEV2ZW50TG9jYXRpb24ob2JqLmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2VzID0gb2JqLm5vZGUuZ2V0RWRnZXMoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC53ID0gZWRnZXNbMF0uc291cmNlLmRhdGEudyAqIDAuNjY3O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQuaCA9IGVkZ2VzWzBdLnNvdXJjZS5kYXRhLmggKiAwLjY2NztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gdG9vbGtpdC5hZGROb2RlKGpzUGx1bWIuZXh0ZW5kKF9uZXdOb2RlKFwici10aGluZ1wiKSwgZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZS1jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGlvbnMgb24gdGhlIG5ldyBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8ZWRnZXMubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVkZ2VzW2ldLnNvdXJjZSA9PSBvYmoubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bmV3Tm9kZSwgdGFyZ2V0OmVkZ2VzW2ldLnRhcmdldCwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInJlbGF0aW9uc2hpcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlZGdlc1tpXS50YXJnZXQgPT0gb2JqLm5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOmVkZ2VzW2ldLnNvdXJjZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RlbGV0ZSB0aGUgcHJveHkgbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQucmVtb3ZlTm9kZShvYmoubm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZXM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG9iai5lLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgPT0gJ3JlbGF0aW9uc2hpcC1vdmVybGF5JyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyU2VsZWN0aW9uKG9iai5lZGdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImFsbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JzOltcIkNvbnRpbnVvdXNcIixcIkNvbnRpbnVvdXNcIl0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3Rvcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IFwiYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvcjpbXCJTdGF0ZU1hY2hpbmVcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxLjAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VydmluZXNzOjE1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXA6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NDbGFzczpcImVkZ2UtcmVsYXRpb25zaGlwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogXCJjb25uZWN0b3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6XCJCbGFua1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5czpbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIFwiUGxhaW5BcnJvd1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDoxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6MTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJyZWxhdGlvbnNoaXAtb3ZlcmxheVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXBQcm94eTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOlwiZWRnZS1yZWxhdGlvbnNoaXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDpcIkJsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czo1LCBjc3NDbGFzczpcIm9yYW5nZVwiIH1dXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZVByb3h5OntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6XCJlZGdlLXBlcnNwZWN0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czpbIFwiQmxhbmtcIiwgWyBcIkRvdFwiLCB7IHJhZGl1czoxLCBjc3NDbGFzczpcIm9yYW5nZV9wcm94eVwiIH1dXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBcImNvbm5lY3RvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBldmVudHM6e1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXNEYmxDbGljazpmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGFuIElkZWEgbm9kZSBhdCB0aGUgbG9jYXRpb24gYXQgd2hpY2ggdGhlIGV2ZW50IG9jY3VycmVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSByZW5kZXJlci5tYXBFdmVudExvY2F0aW9uKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTW92ZSAxLzIgdGhlIGhlaWdodCBhbmQgd2lkdGggdXAgYW5kIHRvIHRoZSBsZWZ0IHRvIGNlbnRlciB0aGUgbm9kZSBvbiB0aGUgbW91c2UgY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE86IHdoZW4gaGVpZ2h0L3dpZHRoIGlzIGNvbmZpZ3VyYWJsZSwgcmVtb3ZlIGhhcmQtY29kZWQgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLmxlZnQgPSBwb3MubGVmdC01MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy50b3AgPSBwb3MudG9wLTUwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5hZGROb2RlKGpzUGx1bWIuZXh0ZW5kKF9uZXdOb2RlKCksIHBvcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVBZGRlZDpfcmVnaXN0ZXJIYW5kbGVycywgLy8gc2VlIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlQWRkZWQ6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXlvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyaW91cyBkcmFnL2Ryb3AgaGFuZGxlciBldmVudCBleHBlcmltZW50cyBsaXZlZCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXHRcdFx0XHRcdFx0bm9kZURyb3BwZWQ6ZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0XHRcdFx0XHRcdGFsZXJ0KFwibm9kZSBcIiArIHBhcmFtcy5zb3VyY2UuaWQgKyBcIiB3YXMgZHJvcHBlZCBvbiBcIiArIHBhcmFtcy50YXJnZXQuaWQpO1xuXHRcdFx0XHRcdFx0fVxuICAgICAgICAgICAgICAgICAgICB9LFxuXHRcdFx0XHRcdGVsZW1lbnRzRHJvcHBhYmxlOnRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRyYWdPcHRpb25zOntcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjpcIi5zZWdtZW50XCIsICAgICAgIC8vIGNhbid0IGRyYWcgbm9kZXMgYnkgdGhlIGNvbG9yIHNlZ21lbnRzLlxuXHRcdFx0XHRcdFx0c3RvcDpmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Ly8gd2hlbiBfYW55XyBub2RlIHN0b3BzIGRyYWdnaW5nLCBydW4gdGhlIGxheW91dCBhZ2Fpbi5cblx0XHRcdFx0XHRcdFx0Ly8gdGhpcyB3aWxsIGNhdXNlIGNoaWxkIG5vZGVzIHRvIHNuYXAgdG8gdGhlaXIgbmV3IHBhcmVudCwgYW5kIGFsc29cblx0XHRcdFx0XHRcdFx0Ly8gY2xlYW51cCBuaWNlbHkgaWYgYSBub2RlIGlzIGRyb3BwZWQgb24gYW5vdGhlciBub2RlLlxuXHRcdFx0XHRcdFx0XHRyZW5kZXJlci5yZWZyZXNoKCk7XG5cdFx0XHRcdFx0XHR9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFsb2dzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAganNQbHVtYlRvb2xraXQuRGlhbG9ncy5pbml0aWFsaXplKHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogXCIuZGxnXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8gZGlhbG9ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuICAgICAgICAgICAgLy8gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICBNb3VzZSBoYW5kbGVycy4gU29tZSBhcmUgd2lyZWQgdXA7IGFsbCBsb2cgdGhlIGN1cnJlbnQgbm9kZSBkYXRhIHRvIHRoZSBjb25zb2xlLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgICAgICB2YXIgX3R5cGVzID0gWyBcInJlZFwiLCBcIm9yYW5nZVwiLCBcImdyZWVuXCIsIFwiYmx1ZVwiLCBcInRleHRcIiBdO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNsaWNrTG9nZ2VyID0gZnVuY3Rpb24odHlwZSwgZXZlbnQsIGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50ICsgJyAnICsgdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG5vZGUuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGV2ZW50ID09ICdkYmxjbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBfY2xpY2tIYW5kbGVycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1InLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBncmVlbjpmdW5jdGlvbihlbCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdHJywgJ2NsaWNrJywgZWwsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JhbmdlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ08nLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBibHVlOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ0InLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1QnLCAnY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2s6e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkOmZ1bmN0aW9uKGVsLCBub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tMb2dnZXIoJ1InLCAnZGJsY2xpY2snLCBlbCwgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW46ZnVuY3Rpb24oZWwsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0xvZ2dlcignRycsICdkYmxjbGljaycsIGVsLCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9IG5vZGUuZGF0YS53ICogMC42Njc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0hlaWdodCA9IG5vZGUuZGF0YS5oICogMC42Njc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4gPSBub2RlLmRhdGEuY2hpbGRyZW4gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0xhYmVsID0gJ1BhcnQnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6bm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdzpuZXdXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaDpuZXdIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBuZXdMYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IG5vZGUuZGF0YS5jaGlsZHJlbi5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRhdGEuY2hpbGRyZW4ucHVzaChuZXdOb2RlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlci5yZWxheW91dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yYW5nZTpmdW5jdGlvbihlbCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdPJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3h5Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3UHJveHkoJ3Byb3h5UGVyc3BlY3RpdmUnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpub2RlLCB0YXJnZXQ6cHJveHlOb2RlLCBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInBlcnNwZWN0aXZlUHJveHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LmNvbm5lY3Qoe3NvdXJjZTpwcm94eU5vZGUsIHRhcmdldDpuZXdOb2RlLCBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTpcInBlcnNwZWN0aXZlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZTpmdW5jdGlvbihlbCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdCJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0b29sa2l0LmFkZE5vZGUoX25ld05vZGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3h5Tm9kZSA9IHRvb2xraXQuYWRkTm9kZShfbmV3UHJveHkoJ3Byb3h5UmVsYXRpb25zaGlwJykpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5jb25uZWN0KHtzb3VyY2U6bm9kZSwgdGFyZ2V0OnByb3h5Tm9kZSwgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6XCJyZWxhdGlvbnNoaXBQcm94eVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQuY29ubmVjdCh7c291cmNlOnByb3h5Tm9kZSwgdGFyZ2V0Om5ld05vZGUsIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOlwicmVsYXRpb25zaGlwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpmdW5jdGlvbihlbCwgbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrTG9nZ2VyKCdUJywgJ2RibGNsaWNrJywgZWwsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gZWwucXVlcnlTZWxlY3RvcihcIi5uYW1lXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LkRpYWxvZ3Muc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImRsZ1RleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRW50ZXIgbGFiZWw6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uT0s6IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnVwZGF0ZU5vZGUobm9kZSwgeyBsYWJlbDpkLnRleHQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDpub2RlLmRhdGEubGFiZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBfY3VycnlIYW5kbGVyID0gZnVuY3Rpb24oZWwsIHNlZ21lbnQsIG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9lbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBzZWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAganNQbHVtYi5vbihfZWwsIFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NsaWNrSGFuZGxlcnNbXCJjbGlja1wiXVtzZWdtZW50XShlbCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKF9lbCwgXCJkYmxjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2xpY2tIYW5kbGVyc1tcImRibGNsaWNrXCJdW3NlZ21lbnRdKGVsLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gc2V0dXAgdGhlIGNsaWNraW5nIGFjdGlvbnMgYW5kIHRoZSBsYWJlbCBkcmFnLiBGb3IgdGhlIGRyYWcgd2UgY3JlYXRlIGFuXG4gICAgICAgICAgICAgICAgLy8gaW5zdGFuY2Ugb2YganNQbHVtYiBmb3Igbm90IG90aGVyIHB1cnBvc2UgdGhhbiB0byBtYW5hZ2UgdGhlIGRyYWdnaW5nIG9mXG4gICAgICAgICAgICAgICAgLy8gbGFiZWxzLiBXaGVuIGEgZHJhZyBzdGFydHMgd2Ugc2V0IHRoZSB6b29tIG9uIHRoYXQganNQbHVtYiBpbnN0YW5jZSB0b1xuICAgICAgICAgICAgICAgIC8vIG1hdGNoIG91ciBjdXJyZW50IHpvb20uXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICB2YXIgbGFiZWxEcmFnSGFuZGxlciA9IGpzUGx1bWIuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBfcmVnaXN0ZXJIYW5kbGVycyhwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGVyZSB5b3UgaGF2ZSBwYXJhbXMuZWwsIHRoZSBET00gZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgcGFyYW1zLm5vZGUsIHRoZSB1bmRlcmx5aW5nIG5vZGUuIGl0IGhhcyBhIGBkYXRhYCBtZW1iZXIgd2l0aCB0aGUgbm9kZSdzIHBheWxvYWQuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHBhcmFtcy5lbCwgbm9kZSA9IHBhcmFtcy5ub2RlLCBsYWJlbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIubmFtZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jdXJyeUhhbmRsZXIoZWwsIF90eXBlc1tpXSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBsYWJlbCBkcmFnZ2FibGUgKHNlZSBub3RlIGFib3ZlKS5cbiAgICAgICAgICAgICAgICAgICAgbGFiZWxEcmFnSGFuZGxlci5kcmFnZ2FibGUobGFiZWwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OmZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxEcmFnSGFuZGxlci5zZXRab29tKHJlbmRlcmVyLmdldFpvb20oKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcDpmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5kYXRhLmxhYmVsUG9zaXRpb24gPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGxhYmVsLnN0eWxlLmxlZnQsIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQobGFiZWwuc3R5bGUudG9wLCAxMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVTYXZlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgbGFiZWwgZWRpdGFibGUgdmlhIGEgZGlhbG9nXG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWIub24obGFiZWwsIFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGpzUGx1bWJUb29sa2l0LkRpYWxvZ3Muc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiZGxnVGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVudGVyIGxhYmVsOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uT0s6IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xraXQudXBkYXRlTm9kZShub2RlLCB7IGxhYmVsOmQudGV4dCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6bm9kZS5kYXRhLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICogc2hvd3MgaW5mbyBpbiB3aW5kb3cgb24gYm90dG9tIHJpZ2h0LlxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gX2luZm8odGV4dCkge1xuXG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgICAgIC8vIGxvYWQgdGhlIGRhdGEuXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQubWFwICYmIHRoYXQubWFwLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9vbGtpdC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoYXQubWFwLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvLyBhIGNvdXBsZSBvZiByYW5kb20gZXhhbXBsZXMgb2YgdGhlIGZpbHRlciBmdW5jdGlvbiwgYWxsb3dpbmcgeW91IHRvIHF1ZXJ5IHlvdXIgZGF0YVxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgICAgIHZhciBjb3VudEVkZ2VzT2ZUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9vbGtpdC5maWx0ZXIoZnVuY3Rpb24ob2JqKSB7IHJldHVybiBvYmoub2JqZWN0VHlwZSA9PSBcIkVkZ2VcIiAmJiBvYmouZGF0YS50eXBlPT09dHlwZTsgfSkuZ2V0RWRnZUNvdW50KClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBkdW1wRWRnZUNvdW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlIGFyZSBcIiArIGNvdW50RWRnZXNPZlR5cGUoXCJyZWxhdGlvbnNoaXBcIikgKyBcIiByZWxhdGlvbnNoaXAgZWRnZXNcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYXJlIFwiICsgY291bnRFZGdlc09mVHlwZShcInBlcnNwZWN0aXZlXCIpICsgXCIgcGVyc3BlY3RpdmUgZWRnZXNcIik7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRvb2xraXQuYmluZChcImRhdGFVcGRhdGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBkdW1wRWRnZUNvdW50cygpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZVNhdmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAganNQbHVtYi5vbihcInJlbGF0aW9uc2hpcEVkZ2VEdW1wXCIsIFwiY2xpY2tcIiwgZHVtcEVkZ2VDb3VudHMoKSk7XG5cbiAgICAgICAgICAgICAgICAvL0NUUkwgKyBjbGljayBlbmFibGVzIHRoZSBsYXNzb1xuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oZG9jdW1lbnQsICdtb3VzZWRvd24nLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGVsZXRlQWxsID0gZnVuY3Rpb24oc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBpbXBsZW1lbnQgbG9naWMgdG8gZGVsZXRlIHdob2xlIGVkZ2UrcHJveHkrZWRnZSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuZWFjaEVkZ2UoZnVuY3Rpb24oaSxlKSB7IGNvbnNvbGUubG9nKGUpIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vUmVjdXJzZSBvdmVyIGFsbCBjaGlsZHJlblxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5lYWNoTm9kZShmdW5jdGlvbihpLG4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN1cnNlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5vZGUgJiYgbm9kZS5kYXRhLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPG5vZGUuZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IHRvb2xraXQuZ2V0Tm9kZShub2RlLmRhdGEuY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9EZWxldGUgY2hpbGRyZW4gYmVmb3JlIHBhcmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnJlbW92ZU5vZGUobm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3Vyc2Uobik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0b29sa2l0LnJlbW92ZShzZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IG1vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vbWFwIGJhY2tzcGFjZSB0byBkZWxldGUgaWYgYW55dGhpbmcgaXMgc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICBqc1BsdW1iLm9uKGRvY3VtZW50LCAna2V5dXAnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBtb2RlID0gbnVsbFxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0b29sa2l0LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0NjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVBbGwoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGpzUGx1bWIub24oZG9jdW1lbnQsICdrZXlkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbW9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGUgPSAnc2VsZWN0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLnNldE1vZGUoJ3NlbGVjdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSA0NjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdG9vbGtpdC5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlQWxsKHNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBpbml0KCkge1xuXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcbiIsIi8qKlxuKiBDdXN0b20gbGF5b3V0IGZvciBtZXRhbWFwLiBFeHRlbmRzIHRoZSBTcHJpbmcgbGF5b3V0LiBBZnRlciBTcHJpbmcgcnVucywgdGhpc1xuKiBsYXlvdXQgZmluZHMgJ3BhcnQnIG5vZGVzIGFuZCBhbGlnbnMgdGhlbSB1bmRlcm5lYXRoIHRoZWlyIHBhcmVudHMuIFRoZSBhbGlnbm1lbnRcbiogLSBsZWZ0IG9yIHJpZ2h0IC0gaXMgc2V0IGluIHRoZSBwYXJlbnQgbm9kZSdzIGRhdGEsIGFzIGBwYXJ0QWxpZ25gLlxuKlxuKiBMYXlvdXQgY2FuIGJlIHN1c3BlbmRlZCBvbiBhIHBlci1ub2RlIGJhc2lzIGJ5IHNldHRpbmcgYHN1c3BlbmRMYXlvdXRgIGluIHRoZSBOb2RlJ3NcbiogZGF0YS5cbipcbiogQ2hpbGQgbm9kZXNcbiovXG47KGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGNoaWxkTm9kZUNvbXBhcmF0b3IoYzEsIGMyKSB7XG5cdFx0aWYgKGMyLmRhdGEub3JkZXIgPT0gbnVsbCkgcmV0dXJuIC0xO1xuXHRcdGlmIChjMS5kYXRhLm9yZGVyID09IG51bGwpIHJldHVybiAxO1xuXHRcdHJldHVybiBjMS5kYXRhLm9yZGVyIDwgYzIuZGF0YS5vcmRlciA/IC0xIDogMTtcblx0fVxuXG4gIGpzUGx1bWJUb29sa2l0LkxheW91dHNbXCJtZXRhbWFwXCJdID0gZnVuY3Rpb24oKSB7XG4gICAganNQbHVtYlRvb2xraXQuTGF5b3V0cy5TcHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBfb25lU2V0ID0gZnVuY3Rpb24ocGFyZW50LCBwYXJhbXMsIHRvb2xraXQpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgIHZhciBwYWRkaW5nID0gcGFyYW1zLnBhcnRQYWRkaW5nIHx8IDU7XG4gICAgICBpZiAocGFyZW50LmRhdGEuY2hpbGRyZW4gJiYgcGFyZW50LmRhdGEuc3VzcGVuZExheW91dCAhPT0gdHJ1ZSkge1xuXG4gICAgICAgIHZhciBjID0gcGFyZW50LmRhdGEuY2hpbGRyZW4sXG5cdFx0ICBcdGNoaWxkTm9kZXMgPSBfLm1hcCggYywgdG9vbGtpdC5nZXROb2RlICksXG4gICAgICAgICAgICBwYXJlbnRQb3MgPSB0aGlzLmdldFBvc2l0aW9uKHBhcmVudC5pZCksXG4gICAgICAgICAgICBwYXJlbnRTaXplID0gdGhpcy5nZXRTaXplKHBhcmVudC5pZCksXG4gICAgICAgICAgICBtYWduZXRpemVOb2RlcyA9IFsgcGFyZW50LmlkIF0sXG4gICAgICAgICAgICBhbGlnbiA9IChwYXJlbnQuZGF0YS5wYXJ0QWxpZ24gfHwgXCJyaWdodFwiKSA9PT0gXCJsZWZ0XCIgPyAwIDogMSxcbiAgICAgICAgICAgIHkgPSBwYXJlbnRQb3NbMV0gKyBwYXJlbnRTaXplWzFdICsgcGFkZGluZztcblxuXHRcdC8vIHNvcnQgbm9kZXNcblx0XHRjaGlsZE5vZGVzLnNvcnQoY2hpbGROb2RlQ29tcGFyYXRvcik7XG5cdFx0Ly8gYW5kIHJ1biB0aHJvdWdoIHRoZW0gYW5kIGFzc2lnbiBvcmRlcjsgYW55IHRoYXQgZGlkbid0IHByZXZpb3VzbHkgaGF2ZSBvcmRlciB3aWxsIGdldCBvcmRlclxuXHRcdC8vIHNldCwgYW5kIGFueSB0aGF0IGhhZCBvcmRlciB3aWxsIHJldGFpbiB0aGUgc2FtZSB2YWx1ZS5cblx0XHRfLmVhY2goY2hpbGROb2RlcywgZnVuY3Rpb24oY24sIGkpIHtcblx0XHRcdGNuLmRhdGEub3JkZXIgPSBpO1xuXHRcdH0pO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgY24gPSBjaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgaWYoY24pIHtcbiAgICAgICAgICAgICAgdmFyIGNoaWxkU2l6ZSA9IHRoaXMuZ2V0U2l6ZShjbi5pZCksXG4gICAgICAgICAgICAgICAgICB4ID0gcGFyZW50UG9zWzBdICsgKGFsaWduICogKHBhcmVudFNpemVbMF0gLSBjaGlsZFNpemVbMF0pKTtcblxuICAgICAgICAgICAgICB0aGlzLnNldFBvc2l0aW9uKGNuLmlkLCB4LCB5LCB0cnVlKTtcbiAgICAgICAgICAgICAgbWFnbmV0aXplTm9kZXMucHVzaChjbi5pZCk7XG4gICAgICAgICAgICAgIHkgKz0gKGNoaWxkU2l6ZVsxXSArIHBhZGRpbmcpO1xuICAgICAgICAgICAgfVxuXHRcdH1cblxuXG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gc3Rhc2ggb3JpZ2luYWwgZW5kIGNhbGxiYWNrIGFuZCBvdmVycmlkZS4gcGxhY2UgYWxsIFBhcnQgbm9kZXMgd3J0IHRoZWlyXG4gICAgLy8gcGFyZW50cywgdGhlbiBjYWxsIG9yaWdpbmFsIGVuZCBjYWxsYmFjayBhbmQgZmluYWxseSB0ZWxsIHRoZSBsYXlvdXRcbiAgICAvLyB0byBkcmF3IGl0c2VsZiBhZ2Fpbi5cbiAgICB2YXIgX3N1cGVyRW5kID0gdGhpcy5lbmQ7XG4gICAgdGhpcy5lbmQgPSBmdW5jdGlvbih0b29sa2l0LCBwYXJhbXMpIHtcbiAgICAgIHZhciBuYyA9IHRvb2xraXQuZ2V0Tm9kZUNvdW50KCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5jOyBpKyspIHtcbiAgICAgICAgdmFyIG4gPSB0b29sa2l0LmdldE5vZGVBdChpKTtcbiAgICAgICAgLy8gb25seSBwcm9jZXNzIG5vZGVzIHRoYXQgYXJlIG5vdCBQYXJ0IG5vZGVzICh0aGVyZSBjb3VsZCBvZiBjb3Vyc2UgYmVcbiAgICAgICAgLy8gYSBtaWxsaW9uIHdheXMgb2YgZGV0ZXJtaW5pbmcgd2hhdCBpcyBhIFBhcnQgbm9kZS4uLmhlcmUgSSBqdXN0IHVzZVxuICAgICAgICAvLyBhIHJ1ZGltZW50YXJ5IGNvbnN0cnVjdCBpbiB0aGUgZGF0YSlcbiAgICAgICAgaWYgKG4uZGF0YS5wYXJlbnQgPT0gbnVsbCkge1xuICAgICAgICAgIF9vbmVTZXQobiwgcGFyYW1zLCB0b29sa2l0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3VwZXJFbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gIH07XG5cbn0pKCk7XG4iLCJjb25zdCBBQ1RJT05TID0ge1xuICAgIE9QRU5fTUFQOiAnbWFwJyxcbiAgICBPUEVOX1RSQUlOSU5HOiAnb3Blbl90cmFpbmluZycsXG4gICAgTkVXX01BUDogJ25ld19tYXAnLFxuICAgIENPUFlfTUFQOiAnY29weV9tYXAnLFxuICAgIERFTEVURV9NQVA6ICdkZWxldGVfbWFwJyxcbiAgICBIT01FOiAnaG9tZScsXG4gICAgTVlfTUFQUzogJ215bWFwcycsXG4gICAgVEVSTVNfQU5EX0NPTkRJVElPTlM6ICd0ZXJtcycsXG4gICAgTE9HT1VUOiAnbG9nb3V0JyxcbiAgICBGRUVEQkFDSzogJ2ZlZWRiYWNrJyxcbiAgICBTSEFSRV9NQVA6ICdzaGFyZV9tYXAnLFxuICAgIENPVVJTRV9MSVNUOiAnY291cnNlX2xpc3QnLFxuICAgIFRSQUlOSU5HUzogJ3RyYWluaW5ncydcbn07XG5cbk9iamVjdC5mcmVlemUoQUNUSU9OUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQUNUSU9OUzsiLCJjb25zdCBDQU5WQVMgPSB7XG4gICAgTEVGVDogJ2xlZnQnLFxuICAgIFJJR0hUOiAncmlnaHQnXG59O1xuXG5PYmplY3QuZnJlZXplKENBTlZBUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ0FOVkFTOyIsImNvbnN0IENPTlNUQU5UUyA9IHtcblx0QUNUSU9OUzogcmVxdWlyZSgnLi9hY3Rpb25zJyksXG5cdENBTlZBUzogcmVxdWlyZSgnLi9jYW52YXMnKSxcblx0RFNSUDogcmVxdWlyZSgnLi9kc3JwJyksXG5cdEVESVRfU1RBVFVTOiByZXF1aXJlKCcuL2VkaXRTdGF0dXMnKSxcblx0RUxFTUVOVFM6IHJlcXVpcmUoJy4vZWxlbWVudHMnKSxcbiAgICBFVkVOVFM6IHJlcXVpcmUoJy4vZXZlbnRzJyksXG4gICAgTk9USUZJQ0FUSU9OOiByZXF1aXJlKCcuL25vdGlmaWNhdGlvbicpLFxuXHRQQUdFUzogcmVxdWlyZSgnLi9wYWdlcycpLFxuXHRST1VURVM6IHJlcXVpcmUoJy4vcm91dGVzJyksXG5cdFRBQlM6IHJlcXVpcmUoJy4vdGFicycpLFxuXHRUQUdTOiByZXF1aXJlKCcuL3RhZ3MnKVxufTtcblxuT2JqZWN0LmZyZWV6ZShDT05TVEFOVFMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENPTlNUQU5UUzsiLCJjb25zdCBEU1JQID0ge1xuXHREOiAnRCcsXG5cdFM6ICdTJyxcblx0UjogJ1InLFxuXHRQOiAnUCdcbn1cblxuT2JqZWN0LmZyZWV6ZShEU1JQKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEU1JQOyIsImNvbnN0IHN0YXR1cyA9IHtcbiAgICBMQVNUX1VQREFURUQ6ICcnLFxuICAgIFJFQURfT05MWTogJ1ZpZXcgb25seScsXG4gICAgU0FWSU5HOiAnU2F2aW5nLi4uJyxcbiAgICBTQVZFX09LOiAnQWxsIGNoYW5nZXMgc2F2ZWQnLFxuICAgIFNBVkVfRkFJTEVEOiAnQ2hhbmdlcyBjb3VsZCBub3QgYmUgc2F2ZWQnXG59O1xuXG5PYmplY3QuZnJlZXplKHN0YXR1cyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhdHVzOyIsImNvbnN0IEVMRU1FTlRTID0ge1xuICAgIEFQUF9DT05UQUlORVI6ICdhcHAtY29udGFpbmVyJyxcbiAgICBNRVRBX1BST0dSRVNTOiAnbWV0YV9wcm9ncmVzcycsXG4gICAgTUVUQV9QUk9HUkVTU19ORVhUOiAnbWV0YV9wcm9ncmVzc19uZXh0JyxcbiAgICBNRVRBX01PREFMX0RJQUxPR19DT05UQUlORVI6ICdtZXRhX21vZGFsX2RpYWxvZ19jb250YWluZXInXG59O1xuXG5PYmplY3QuZnJlZXplKEVMRU1FTlRTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFTEVNRU5UUzsiLCJjb25zdCBFVkVOVFMgPSB7XG5cdFNJREVCQVJfT1BFTjogJ3NpZGViYXItb3BlbicsXG5cdFNJREVCQVJfQ0xPU0U6ICdzaWRlYmFyLWNsb3NlJyxcblx0U0lERUJBUl9UT0dHTEU6ICdzaWRlYmFyLXRvZ2dsZScsXG5cdFBBR0VfTkFNRTogJ3BhZ2VOYW1lJyxcblx0TkFWOiAnbmF2Jyxcblx0TUFQOiAnbWFwJ1xufVxuXG5PYmplY3QuZnJlZXplKEVWRU5UUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRVZFTlRTOyIsImNvbnN0IE5PVElGSUNBVElPTiA9IHtcblx0TUFQOiAnbWFwJ1xufVxuXG5PYmplY3QuZnJlZXplKE5PVElGSUNBVElPTik7XG5cbm1vZHVsZS5leHBvcnRzID0gTk9USUZJQ0FUSU9OOyIsImNvbnN0IEFDVElPTlMgPSByZXF1aXJlKCcuL2FjdGlvbnMuanMnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuY29uc3QgUEFHRVMgPSB7XG4gICAgTUFQOiAnbWFwJyxcbiAgICBORVdfTUFQOiAnbmV3X21hcCcsXG4gICAgQ09QWV9NQVA6ICdjb3B5X21hcCcsXG4gICAgREVMRVRFX01BUDogJ2RlbGV0ZV9tYXAnLFxuICAgIE1ZX01BUFM6ICdteW1hcHMnLFxuICAgIFRFUk1TX0FORF9DT05ESVRJT05TOiAndGVybXMnLFxuICAgIEhPTUU6ICdob21lJyxcbiAgICBDT1VSU0VfTElTVDogJ2NvdXJzZV9saXN0JyxcbiAgICBUUkFJTklOR1M6ICd0cmFpbmluZ3MnXG59O1xuXG5fLmV4dGVuZCgpXG5cbk9iamVjdC5mcmVlemUoUEFHRVMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBBR0VTOyIsImNvbnN0IFJPVVRFUyA9IHtcbiAgICBNQVBTX0xJU1Q6ICdtYXBzL2xpc3QvJyxcbiAgICBNQVBTX0RBVEE6ICdtYXBzL2RhdGEvJyxcbiAgICBNQVBTX05FV19NQVA6ICdtYXBzL25ldy1tYXAvJyxcbiAgICBURVJNU19BTkRfQ09ORElUSU9OUzogJ21ldGFtYXAvdGVybXMtYW5kLWNvbmRpdGlvbnMvJyxcbiAgICBIT01FOiAnbWV0YW1hcC9ob21lLycsXG4gICAgTk9USUZJQ0FUSU9OUzogJ3VzZXJzL3swfS9ub3RpZmljYXRpb25zJyxcbiAgICBUUkFJTklOR1M6ICd1c2Vycy97MH0vdHJhaW5pbmdzLycsXG4gICAgQ09VUlNFX0xJU1Q6ICd0cmFpbmluZ3MvY291cnNlcy8nXG59O1xuXG5PYmplY3QuZnJlZXplKFJPVVRFUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUk9VVEVTOyIsImNvbnN0IFRBQlMgPSB7XG4gICAgVEFCX0lEX1BSRVNFTlRFUiA6ICdwcmVzZW50ZXItdGFiJyxcbiAgICBUQUJfSURfQU5BTFlUSUNTX01BUCA6ICdhbmFseXRpY3MtdGFiLW1hcCcsXG4gICAgVEFCX0lEX0FOQUxZVElDU19USElORyA6ICdhbmFseXRpY3MtdGFiLXRoaW5nJyxcbiAgICBUQUJfSURfUEVSU1BFQ1RJVkVTIDogJ3BlcnNwZWN0aXZlcy10YWInLFxuICAgIFRBQl9JRF9ESVNUSU5DVElPTlMgOiAnZGlzdGluY3Rpb25zLXRhYicsXG4gICAgVEFCX0lEX0FUVEFDSE1FTlRTIDogJ2F0dGFjaG1lbnRzLXRhYicsXG4gICAgVEFCX0lEX0dFTkVSQVRPUiA6ICdnZW5lcmF0b3ItdGFiJyxcbiAgICBUQUJfSURfU1RBTkRBUkRTIDogJ3N0YW5kYXJkcy10YWInXG59O1xuT2JqZWN0LmZyZWV6ZShUQUJTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUQUJTOyIsImNvbnN0IFRBR1MgPSB7XG4gICAgTUVUQV9DQU5WQVM6ICdtZXRhLWNhbnZhcycsXG4gICAgSE9NRTogJ2hvbWUnLFxuICAgIFRFUk1TOiAndGVybXMnLFxuICAgIE1ZX01BUFM6ICdteS1tYXBzJyxcbiAgICBTSEFSRTogJ3NoYXJlJyxcbiAgICBDT1VSU0VfTElTVDogJ2NvdXJzZV9saXN0JyxcbiAgICBUUkFJTklORzogJ3RyYWluaW5nJyxcbiAgICBBTExfQ09VUlNFUzogJ2FsbC1jb3Vyc2VzJyxcbiAgICBNWV9DT1VSU0VTOiAnbXktY291cnNlcycsXG4gICAgU0lERUJBUjogJ3F1aWNrLXNpZGViYXInXG59O1xuXG5PYmplY3QuZnJlZXplKFRBR1MpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRBR1M7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuXG5jbGFzcyBBZGRUaGlzIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG4gICAgICAgIChmdW5jdGlvbiAoZCwgcywgaWQpIHtcbiAgICAgICAgICAgIHZhciBqcywgZmpzID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXSxcbiAgICAgICAgICAgICAgICB0ID0gd2luZG93LmFkZHRoaXMgfHwge307XG4gICAgICAgICAgICBpZiAoZC5nZXRFbGVtZW50QnlJZChpZCkpIHJldHVybiB0O1xuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7XG4gICAgICAgICAgICBqcy5pZCA9IGlkO1xuICAgICAgICAgICAganMuc3JjID0gYC8vczcuYWRkdGhpcy5jb20vanMvMzAwL2FkZHRoaXNfd2lkZ2V0LmpzI3B1YmlkPSR7Y29uZmlnLnB1YmlkfWA7XG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG5cbiAgICAgICAgICAgIHQuX2UgPSBbXTtcbiAgICAgICAgICAgIHQucmVhZHkgPSBmdW5jdGlvbiAoZikge1xuICAgICAgICAgICAgICAgIHQuX2UucHVzaChmKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICB9IChkb2N1bWVudCwgXCJzY3JpcHRcIiwgXCJhZGQtdGhpcy1qc1wiKSk7XG4gICAgICAgIHRoaXMuYWRkdGhpcyA9IHdpbmRvdy5hZGR0aGlzO1xuICAgIH1cbiAgICBcbiAgICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgICAgIHRoaXMuYWRkdGhpcyA9IHRoaXMuYWRkdGhpcyB8fCB3aW5kb3cuYWRkdGhpcztcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkdGhpcztcbiAgICB9XG4gICAgXG4gICAgaW5pdCgpIHtcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBZGRUaGlzO1xuXG5cbiIsImNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcblxuY2xhc3MgR29vZ2xlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG4gICAgLy8gR29vZ2xlIFBsdXMgQVBJXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBwbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOyBwby50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHBvLmFzeW5jID0gdHJ1ZTtcbiAgICAgIHBvLnNyYyA9ICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcyc7XG4gICAgICBsZXQgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTsgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbywgcyk7XG4gICAgfSkoKTtcbiAgICAgIFxuICAgIC8vR29vZ2xlIFRhZyBNYW5hZ2VyIEFQSVxuICAgIChmdW5jdGlvbiAodywgZCwgcywgbCwgaSkge1xuICAgICAgd1tsXSA9IHdbbF0gfHwgW107IHdbbF0ucHVzaCh7XG4gICAgICAgICdndG0uc3RhcnQnOlxuICAgICAgICBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgZXZlbnQ6ICdndG0uanMnXG4gICAgICB9KTsgbGV0IGYgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdLFxuICAgICAgICBqID0gZC5jcmVhdGVFbGVtZW50KHMpLCBkbCA9IGwgIT0gJ2RhdGFMYXllcicgPyAnJmw9JyArIGwgOiAnJzsgai5hc3luYyA9IHRydWU7IGouc3JjID1cbiAgICAgICAgJy8vd3d3Lmdvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcz9pZD0nICsgaSArIGRsOyBmLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGosIGYpO1xuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnZGF0YUxheWVyJywgdGhpcy5jb25maWcudGFnbWFuYWdlcik7XG5cbiAgICAoZnVuY3Rpb24gKGksIHMsIG8sIGcsIHIsIGEsIG0pIHtcbiAgICAgIGlbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddID0gcjsgaVtyXSA9IGlbcl0gfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICAoaVtyXS5xID0gaVtyXS5xIHx8IFtdKS5wdXNoKGFyZ3VtZW50cyk7XG4gICAgICB9LCBpW3JdLmwgPSAxICogbmV3IERhdGUoKTsgYSA9IHMuY3JlYXRlRWxlbWVudChvKSxcbiAgICAgIG0gPSBzLmdldEVsZW1lbnRzQnlUYWdOYW1lKG8pWzBdOyBhLmFzeW5jID0gMTsgYS5zcmMgPSBnO1xuICAgICAgbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLCBtKTtcbiAgICB9KSh3aW5kb3csIGRvY3VtZW50LCAnc2NyaXB0JywgJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsICdnYScpO1xuXG4gIH1cblxuICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgdGhpcy5nYSA9IHRoaXMuZ2EgfHwgd2luZG93LmdhO1xuICAgIHJldHVybiB0aGlzLmdhO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBzdXBlci5pbml0KCk7XG4gICAgbGV0IG1vZGUgPSAnYXV0byc7XG4gICAgbGV0IGRvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xuICAgIGlmKGRvbWFpbi5zdGFydHNXaXRoKCdsb2NhbGhvc3QnKSkge1xuICAgICAgbW9kZSA9ICdub25lJztcbiAgICB9XG4gICAgdGhpcy5pbnRlZ3JhdGlvbignY3JlYXRlJywgdGhpcy5jb25maWcuYW5hbHl0aWNzLCBtb2RlKTtcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gIH1cblxuICBzZXRVc2VyKCkge1xuICAgIHN1cGVyLnNldFVzZXIoKTtcbiAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCAndXNlcklkJywgdGhpcy51c2VyLnVzZXJJZCk7XG4gIH1cblxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcbiAgICBpZiAod2luZG93LmdhKSB7XG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAnc29jaWFsJywgbmV0d29yaywgdHlwZSwgdGFyZ2V0VXJsKTtcbiAgICB9XG4gIH1cblxuICBzZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKSB7XG4gICAgc3VwZXIuc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSk7XG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcbiAgICAgIGlmIChzb3VyY2UgJiYgdHlwZSkge1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgdmFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVBhdGgocGF0aCkge1xuICAgIHN1cGVyLnVwZGF0ZVBhdGgocGF0aCk7XG4gICAgaWYgKHRoaXMuaW50ZWdyYXRpb24pIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2V0Jywge1xuICAgICAgICAgICAgcGFnZTogcGF0aFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsICdwYWdldmlldycpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzZW5kRXZlbnQoZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKSB7XG4gICAgaWYgKHdpbmRvdy5nYSkge1xuICAgICAgd2luZG93LmdhKCdzZW5kJywgZXZlbnQsIHNvdXJjZSwgdHlwZSwgdXJsKTtcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdvb2dsZTtcblxuXG4iLCJcbmNvbnN0IEludGVncmF0aW9uc0Jhc2UgPSByZXF1aXJlKCcuL19JbnRlZ3JhdGlvbnNCYXNlJylcbmNvbnN0IEdvb2dsZSA9IHJlcXVpcmUoJy4vZ29vZ2xlJyk7XG5cbmNsYXNzIFVzZXJTbmFwIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XG4gICAgICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG4gICAgICAgIGxldCBhcGlLZXksIHMsIHg7XG4gICAgICAgIGlmIChjb25maWcgPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnID0ge307XG4gICAgICAgIH1cbiAgICAgICAgYXBpS2V5ID0gY29uZmlnLmFwaTtcbiAgICAgICAgaWYgKGFwaUtleSAmJiAhd2luZG93LmxvY2F0aW9uLmhvc3Quc3RhcnRzV2l0aCgnbG9jYWxob3N0JykpIHtcbiAgICAgICAgICAgIGxldCB1c0NvbmYgPSB7XG4gICAgICAgICAgICAgICAgZW1haWxCb3g6IHRydWUsXG4gICAgICAgICAgICAgICAgZW1haWxCb3hWYWx1ZTogdXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgICBlbWFpbFJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbnNvbGVSZWNvcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2RlOiAncmVwb3J0JyxcbiAgICAgICAgICAgICAgICBzaG9ydGN1dDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIEdvb2dsZS5zZW5kRXZlbnQoJ2ZlZWRiYWNrJywgJ3VzZXJzbmFwJywgJ3dpZGdldCcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2luZG93LnVzZXJzbmFwY29uZmlnID0gd2luZG93Ll91c2Vyc25hcGNvbmZpZyA9IHVzQ29uZjtcblxuICAgICAgICAgICAgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgcy50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgICAgICBzLmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgIHMuc3JjID0gJy8vYXBpLnVzZXJzbmFwLmNvbS9sb2FkLycgKyBhcGlLZXkgKyAnLmpzJztcbiAgICAgICAgICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICAgICAgeC5hcHBlbmRDaGlsZChzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVzZXJTbmFwID0gd2luZG93LlVzZXJTbmFwO1xuICAgIH1cblxuICAgIGdldCBpbnRlZ3JhdGlvbigpIHtcbiAgICAgICAgdGhpcy51c2VyU25hcCA9IHRoaXMudXNlclNuYXAgfHwgd2luZG93LlVzZXJTbmFwO1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyU25hcDtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgc2V0VXNlcigpIHtcbiAgICAgICAgc3VwZXIuc2V0VXNlcigpO1xuICAgIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gVXNlclNuYXA7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuXG5jbGFzcyBZb3VUdWJlIGV4dGVuZHMgSW50ZWdyYXRpb25zQmFzZSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuICAgIHN1cGVyKGNvbmZpZywgdXNlcik7XG4gICAgdmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXG4gICAgdGFnLnNyYyA9IFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaVwiO1xuICAgIHZhciBmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICBmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YWcsIGZpcnN0U2NyaXB0VGFnKTtcbiAgICB3aW5kb3cub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuWVQgPSB3aW5kb3cuWVRcbiAgICB9XG4gIH1cblxuICBnZXQgaW50ZWdyYXRpb24oKSB7XG4gICAgdGhpcy5ZVCA9IHRoaXMuWVQgfHwgd2luZG93LllUO1xuICAgIHJldHVybiB0aGlzLllUO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBzdXBlci5pbml0KCk7XG5cbiAgfVxuXG4gIHNldFVzZXIoKSB7XG4gICAgc3VwZXIuc2V0VXNlcigpO1xuXG4gIH1cblxuICBzdGF0aWMgc2VuZFNvY2lhbChuZXR3b3JrLCB0YXJnZXRVcmwsIHR5cGUgPSAnc2VuZCcpIHtcblxuICB9XG5cbiAgc2VuZEV2ZW50KHZhbCwgZXZlbnQsIHNvdXJjZSwgdHlwZSkge1xuICAgIHN1cGVyLnNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpO1xuXG4gIH1cblxuICB1cGRhdGVQYXRoKHBhdGgpIHtcbiAgICBzdXBlci51cGRhdGVQYXRoKHBhdGgpO1xuXG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFlvdVR1YmU7XG5cblxuIiwiY2xhc3MgSW50ZWdyYXRpb25zQmFzZSB7XG5cdGNvbnN0cnVjdG9yKGNvbmZpZywgdXNlcikge1xuXHRcdHRoaXMuY29uZmlnID0gY29uZmlnO1xuXHRcdHRoaXMudXNlciA9IHVzZXI7XG5cdH1cblx0XG5cdGluaXQoKSB7XG5cdFx0XG5cdH1cblx0XG5cdGdldCBpbnRlZ3JhdGlvbigpIHtcblx0XHRyZXR1cm4ge307XG5cdH1cblx0XG5cdHNldFVzZXIoKSB7XG5cdFx0XG5cdH1cblx0XG5cdHNlbmRFdmVudCgpIHtcblx0XHRcblx0fVxuXHRcblx0dXBkYXRlUGF0aCgpIHtcblx0XHRcblx0fVxuXHRcblx0bG9nb3V0KCkge1xuXHRcdFxuXHR9XG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVncmF0aW9uc0Jhc2U7IiwiY29uc3QgSW50ZWdyYXRpb25zQmFzZSA9IHJlcXVpcmUoJy4vX0ludGVncmF0aW9uc0Jhc2UnKVxuXG5jbGFzcyBHb29nbGUgZXh0ZW5kcyBJbnRlZ3JhdGlvbnNCYXNlIHtcbiAgY29uc3RydWN0b3IoY29uZmlnLCB1c2VyKSB7XG4gICAgc3VwZXIoY29uZmlnLCB1c2VyKTtcbiAgICAvLyBHb29nbGUgUGx1cyBBUElcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7IHBvLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JzsgcG8uYXN5bmMgPSB0cnVlO1xuICAgICAgcG8uc3JjID0gJ2h0dHBzOi8vYXBpcy5nb29nbGUuY29tL2pzL3BsYXRmb3JtLmpzJztcbiAgICAgIGxldCBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdOyBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBvLCBzKTtcbiAgICB9KSgpO1xuICAgICAgXG4gICAgLy9Hb29nbGUgVGFnIE1hbmFnZXIgQVBJXG4gICAgKGZ1bmN0aW9uICh3LCBkLCBzLCBsLCBpKSB7XG4gICAgICB3W2xdID0gd1tsXSB8fCBbXTsgd1tsXS5wdXNoKHtcbiAgICAgICAgJ2d0bS5zdGFydCc6XG4gICAgICAgIG5ldyBEYXRlKCkuZ2V0VGltZSgpLCBldmVudDogJ2d0bS5qcydcbiAgICAgIH0pOyBsZXQgZiA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF0sXG4gICAgICAgIGogPSBkLmNyZWF0ZUVsZW1lbnQocyksIGRsID0gbCAhPSAnZGF0YUxheWVyJyA/ICcmbD0nICsgbCA6ICcnOyBqLmFzeW5jID0gdHJ1ZTsgai5zcmMgPVxuICAgICAgICAnLy93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RtLmpzP2lkPScgKyBpICsgZGw7IGYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaiwgZik7XG4gICAgfSkod2luZG93LCBkb2N1bWVudCwgJ3NjcmlwdCcsICdkYXRhTGF5ZXInLCB0aGlzLmNvbmZpZy50YWdtYW5hZ2VyKTtcblxuICAgIChmdW5jdGlvbiAoaSwgcywgbywgZywgciwgYSwgbSkge1xuICAgICAgaVsnR29vZ2xlQW5hbHl0aWNzT2JqZWN0J10gPSByOyBpW3JdID0gaVtyXSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIChpW3JdLnEgPSBpW3JdLnEgfHwgW10pLnB1c2goYXJndW1lbnRzKTtcbiAgICAgIH0sIGlbcl0ubCA9IDEgKiBuZXcgRGF0ZSgpOyBhID0gcy5jcmVhdGVFbGVtZW50KG8pLFxuICAgICAgbSA9IHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUobylbMF07IGEuYXN5bmMgPSAxOyBhLnNyYyA9IGc7XG4gICAgICBtLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsIG0pO1xuICAgIH0pKHdpbmRvdywgZG9jdW1lbnQsICdzY3JpcHQnLCAnLy93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzJywgJ2dhJyk7XG5cbiAgfVxuXG4gIGdldCBpbnRlZ3JhdGlvbigpIHtcbiAgICB0aGlzLmdhID0gdGhpcy5nYSB8fCB3aW5kb3cuZ2E7XG4gICAgcmV0dXJuIHRoaXMuZ2E7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHN1cGVyLmluaXQoKTtcbiAgICBsZXQgbW9kZSA9ICdhdXRvJztcbiAgICBsZXQgZG9tYWluID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XG4gICAgaWYoZG9tYWluLnN0YXJ0c1dpdGgoJ2xvY2FsaG9zdCcpKSB7XG4gICAgICBtb2RlID0gJ25vbmUnO1xuICAgIH1cbiAgICB0aGlzLmludGVncmF0aW9uKCdjcmVhdGUnLCB0aGlzLmNvbmZpZy5hbmFseXRpY3MsIG1vZGUpO1xuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgfVxuXG4gIHNldFVzZXIoKSB7XG4gICAgc3VwZXIuc2V0VXNlcigpO1xuICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NldCcsICd1c2VySWQnLCB0aGlzLnVzZXIudXNlcklkKTtcbiAgfVxuXG4gIHN0YXRpYyBzZW5kU29jaWFsKG5ldHdvcmssIHRhcmdldFVybCwgdHlwZSA9ICdzZW5kJykge1xuICAgIGlmICh3aW5kb3cuZ2EpIHtcbiAgICAgIHdpbmRvdy5nYSgnc2VuZCcsICdzb2NpYWwnLCBuZXR3b3JrLCB0eXBlLCB0YXJnZXRVcmwpO1xuICAgIH1cbiAgfVxuXG4gIHNlbmRFdmVudCh2YWwsIGV2ZW50LCBzb3VyY2UsIHR5cGUpIHtcbiAgICBzdXBlci5zZW5kRXZlbnQodmFsLCBldmVudCwgc291cmNlLCB0eXBlKTtcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xuICAgICAgaWYgKHNvdXJjZSAmJiB0eXBlKSB7XG4gICAgICAgIHRoaXMuaW50ZWdyYXRpb24oJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbnRlZ3JhdGlvbignc2VuZCcsIGV2ZW50LCB2YWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlUGF0aChwYXRoKSB7XG4gICAgc3VwZXIudXBkYXRlUGF0aChwYXRoKTtcbiAgICBpZiAodGhpcy5pbnRlZ3JhdGlvbikge1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZXQnLCB7XG4gICAgICAgICAgICBwYWdlOiBwYXRoXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmludGVncmF0aW9uKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHNlbmRFdmVudChldmVudCwgc291cmNlLCB0eXBlLCB1cmwpIHtcbiAgICBpZiAod2luZG93LmdhKSB7XG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCBldmVudCwgc291cmNlLCB0eXBlLCB1cmwpO1xuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gR29vZ2xlO1xuXG5cbiIsImNvbnN0IHJpb3QgPSB3aW5kb3cucmlvdFxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xuY29uc3QgcGFnZUJvZHkgPSByZXF1aXJlKCcuLi90YWdzL3BhZ2UtYm9keS5qcycpXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJylcbmNvbnN0IEFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0FjdGlvbi5qcycpXG5jb25zdCBNZXRyb25pYyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL21ldHJvbmljJylcbmNvbnN0IExheW91dCA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL2xheW91dCcpXG5jb25zdCBEZW1vID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvZGVtbycpXG5cbmNsYXNzIFBhZ2VGYWN0b3J5IHtcbiAgICBjb25zdHJ1Y3RvcihldmVudGVyLCBtZXRhRmlyZSkge1xuICAgICAgICB0aGlzLm1ldGFGaXJlID0gbWV0YUZpcmU7XG4gICAgICAgIHRoaXMuZXZlbnRlciA9IGV2ZW50ZXI7XG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IG5ldyBBY3Rpb25zKG1ldGFGaXJlLCBldmVudGVyLCB0aGlzKTtcbiAgICAgICAgdGhpcy5vblJlYWR5KCk7XG4gICAgfVxuXG4gICAgb25SZWFkeSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vblJlYWR5KSB7XG4gICAgICAgICAgICB0aGlzLl9vblJlYWR5ID0gbmV3IFByb21pc2UoKGZ1bGZpbGwsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICQoYCMke0NPTlNUQU5UUy5FTEVNRU5UUy5NRVRBX1BST0dSRVNTfWApLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHJpb3QubW91bnQoJyonKTtcbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuY29uZmlndXJlKHsgcGFyZW50OiBgIyR7Q09OU1RBTlRTLkVMRU1FTlRTLk1FVEFfUFJPR1JFU1NfTkVYVH1gIH0pO1xuXG4gICAgICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLmluaXQoKTsgLy8gaW5pdCBtZXRyb25pYyBjb3JlIGNvbXBvbmV0c1xuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuaW5pdCgpOyAvLyBpbml0IGxheW91dFxuICAgICAgICAgICAgICAgICAgICBEZW1vLmluaXQoKTsgLy8gaW5pdCBkZW1vIGZlYXR1cmVzXG5cbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbCgpO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fb25SZWFkeTtcbiAgICB9XG5cbiAgICBuYXZpZ2F0ZShwYXRoLCBpZCwgYWN0aW9uLCAuLi5wYXJhbXMpIHtcbiAgICAgICAgbGV0IGFjdCA9IHRoaXMuYWN0aW9ucy5hY3QocGF0aCwgaWQsIGFjdGlvbiwgLi4ucGFyYW1zKTtcbiAgICAgICAgaWYgKCFhY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRlci5kbyhwYXRoLCBwYXRoLCB7IGlkOiBpZCwgYWN0aW9uOiBhY3Rpb24gfSwgLi4ucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYWdlRmFjdG9yeTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpXG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzXG5jb25zdCBDYW52YXMgPSByZXF1aXJlKCcuLi8uLi9jYW52YXMvY2FudmFzJylcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxucmVxdWlyZSgnLi9ub2RlJylcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0IGp0ay1kZW1vLW1haW5cIiBzdHlsZT1cInBhZGRpbmc6IDA7IFwiPlxuICAgIDxkaXYgY2xhc3M9XCJqdGstZGVtby1jYW52YXMgY2FudmFzLXdpZGVcIiBpZD1cImRpYWdyYW1cIj5cblxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdtZXRhLWNhbnZhcycsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XG5cbiAgICB0aGlzLm1hcElkID0gbnVsbDtcbiAgICB0aGlzLmNhbnZhcyA9IG51bGw7XG5cbiAgICB0aGlzLmJ1aWxkQ2FudmFzID0gKG1hcCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuY2FudmFzKSB7XG4gICAgICAgICAgICAkKHRoaXMuZGlhZ3JhbSkuZW1wdHkoKTtcblxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBuZXcgQ2FudmFzKG1hcCwgdGhpcy5tYXBJZCk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5pbml0KCk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG1hcC5jaGFuZ2VkX2J5ICE9IE1ldGFNYXAuVXNlci51c2VyS2V5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuaW5pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIE5Qcm9ncmVzcy5kb25lKCk7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZCA9IChvcHRzKSA9PiB7XG4gICAgICAgIGlmIChvcHRzLmlkICE9IHRoaXMubWFwSWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gbnVsbFxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSWQpIHtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9mZihgbWFwcy9kYXRhLyR7dGhpcy5tYXBJZH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWFwSWQgPSBvcHRzLmlkO1xuICAgICAgICAgICAgTlByb2dyZXNzLnN0YXJ0KCk7XG5cbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYG1hcHMvZGF0YS8ke29wdHMuaWR9YCwgdGhpcy5idWlsZENhbnZhcyk7XG4gICAgICAgICAgICBNZXRhTWFwLkV2ZW50ZXIuZm9yZ2V0KENPTlNUQU5UUy5FVkVOVFMuTUFQLCB0aGlzLmJ1aWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1ldGFNYXAuRXZlbnRlci5ldmVyeShDT05TVEFOVFMuRVZFTlRTLk1BUCwgdGhpcy5idWlsZCk7XG5cbiAgICB0aGlzLmNvcnJlY3RIZWlnaHQgPSAoKSA9PiB7XG4gICAgICAgICQodGhpcy5kaWFncmFtKS5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxMjAgKyAncHgnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcbiAgICAgICAgdGhpcy5jb3JyZWN0SGVpZ2h0KCk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IEVkaXRvciA9IHJlcXVpcmUoJy4uLy4uL2NhbnZhcy9jYW52YXMnKTtcblxuXG5jb25zdCBodG1sID0gYFxuYFxuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdub2RlJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5cbmNvbnN0IE1ldHJvbmljID0gcmVxdWlyZSgnLi4vLi4vdGVtcGxhdGUvbWV0cm9uaWMnKVxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi9yYXcnKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcbmNvbnN0IFRyYWluaW5nTWl4ID0gcmVxdWlyZSgnLi4vbWl4aW5zL3RyYWluaW5nLW1peCcpXG5cbmNvbnN0IGh0bWwgPVxuXHRgXG48ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLXdyYXBwZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuYXYtanVzdGlmaWVkXCI+XG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnMgbmF2LWp1c3RpZmllZFwiPlxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImFjdGl2ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3F1aWNrX3NpZGViYXJfdGFiXzFcIiBkYXRhLXRvZ2dsZT1cInRhYlwiPlxuICAgICAgICAgICAgICAgICAgICBDb3J0ZXggTWFuXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNxdWlja19zaWRlYmFyX3RhYl8yXCIgZGF0YS10b2dnbGU9XCJ0YWJcIj5cbiAgICAgICAgICAgICAgICAgICAgT3V0bGluZVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLXBhbmUgYWN0aXZlIHBhZ2UtcXVpY2stc2lkZWJhci1jaGF0IHBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIiBpZD1cInF1aWNrX3NpZGViYXJfdGFiXzFcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJzXCIgZGF0YS1yYWlsLWNvbG9yPVwiI2RkZFwiIGRhdGEtd3JhcHBlci1jbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItbWVzc2FnZXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBlYWNoPVwieyB1c2VyVHJhaW5pbmcubWVzc2FnZXMgfVwiIGNsYXNzPVwicG9zdCB7IG91dDogYXV0aG9yID09ICdjb3J0ZXgnLCBpbjogYXV0aG9yICE9ICdjb3J0ZXgnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgaGVpZ2h0PVwiMzlcIiB3aWR0aD1cIjM5XCIgY2xhc3M9XCJhdmF0YXJcIiBhbHQ9XCJcIiBzcmM9XCJ7IGF1dGhvciA9PSAnY29ydGV4JyA/IHBhcmVudC5jb3J0ZXhQaWN0dXJlIDogcGFyZW50LnVzZXJQaWN0dXJlIH1cIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXJyb3dcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzPVwibmFtZVwiPnsgbmFtZSB9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGF0ZXRpbWVcIj57IHBhcmVudC5nZXRSZWxhdGl2ZVRpbWUodGltZSkgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IG1lc3NhZ2UgfVwiPjwvcmF3PiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItZm9ybVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImNoYXRfaW5wdXRfZm9ybVwiIG9uc3VibWl0PVwieyBvblN1Ym1pdCB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjaGF0X2lucHV0XCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiVHlwZSBhIG1lc3NhZ2UgaGVyZS4uLlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYmx1ZVwiPjxpIGNsYXNzPVwiZmEgZmEtcGFwZXJjbGlwXCI+PC9pPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLXBhbmUgcGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0c1wiIGlkPVwicXVpY2tfc2lkZWJhcl90YWJfMlwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1xdWljay1zaWRlYmFyLWFsZXJ0cy1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsaXN0LWhlYWRpbmdcIj5JbnRybzwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJsaXN0LWhlYWRpbmdcIj5TZWN0aW9uIDE8L2gzPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYFxuXG4vLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgdG9nZ2xlclxudmFyIGhhbmRsZVF1aWNrU2lkZWJhclRvZ2dsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gcXVpY2sgc2lkZWJhciB0b2dnbGVyXG4gICAgJCgnLnBhZ2UtaGVhZGVyIC5xdWljay1zaWRlYmFyLXRvZ2dsZXIsIC5wYWdlLXF1aWNrLXNpZGViYXItdG9nZ2xlcicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygncGFnZS1xdWljay1zaWRlYmFyLW9wZW4nKTtcbiAgICB9KTtcbn07XG5cbi8vIEhhbmRsZXMgcXVpY2sgc2lkZWJhciBjaGF0c1xudmFyIGhhbmRsZVF1aWNrU2lkZWJhckNoYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHdyYXBwZXIgPSAkKCcucGFnZS1xdWljay1zaWRlYmFyLXdyYXBwZXInKTtcbiAgICB2YXIgd3JhcHBlckNoYXQgPSB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdCcpO1xuXG4gICAgdmFyIGluaXRDaGF0U2xpbVNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNoYXRVc2VycyA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJzJyk7XG4gICAgICAgIHZhciBjaGF0VXNlcnNIZWlnaHQ7XG5cbiAgICAgICAgY2hhdFVzZXJzSGVpZ2h0ID0gd3JhcHBlci5oZWlnaHQoKSAtIHdyYXBwZXIuZmluZCgnLm5hdi1qdXN0aWZpZWQgPiAubmF2LXRhYnMnKS5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgIC8vIGNoYXQgdXNlciBsaXN0XG4gICAgICAgIE1ldHJvbmljLmRlc3Ryb3lTbGltU2Nyb2xsKGNoYXRVc2Vycyk7XG4gICAgICAgIGNoYXRVc2Vycy5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgY2hhdFVzZXJzSGVpZ2h0KTtcbiAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoY2hhdFVzZXJzKTtcblxuICAgICAgICB2YXIgY2hhdE1lc3NhZ2VzID0gd3JhcHBlckNoYXQuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXItbWVzc2FnZXMnKTtcbiAgICAgICAgdmFyIGNoYXRNZXNzYWdlc0hlaWdodCA9IGNoYXRVc2Vyc0hlaWdodCAtIHdyYXBwZXJDaGF0LmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyLWZvcm0nKS5vdXRlckhlaWdodCgpIC0gd3JhcHBlckNoYXQuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1uYXYnKS5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgIC8vIHVzZXIgY2hhdCBtZXNzYWdlc1xuICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChjaGF0TWVzc2FnZXMpO1xuICAgICAgICBjaGF0TWVzc2FnZXMuYXR0cihcImRhdGEtaGVpZ2h0XCIsIGNoYXRNZXNzYWdlc0hlaWdodCk7XG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGNoYXRNZXNzYWdlcyk7XG4gICAgfTtcblxuICAgIGluaXRDaGF0U2xpbVNjcm9sbCgpO1xuICAgIE1ldHJvbmljLmFkZFJlc2l6ZUhhbmRsZXIoaW5pdENoYXRTbGltU2Nyb2xsKTsgLy8gcmVpbml0aWFsaXplIG9uIHdpbmRvdyByZXNpemVcblxuICAgIHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1jaGF0LXVzZXJzIC5tZWRpYS1saXN0ID4gLm1lZGlhJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB3cmFwcGVyQ2hhdC5hZGRDbGFzcyhcInBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIik7XG4gICAgfSk7XG5cbiAgICB3cmFwcGVyLmZpbmQoJy5wYWdlLXF1aWNrLXNpZGViYXItY2hhdC11c2VyIC5wYWdlLXF1aWNrLXNpZGViYXItYmFjay10by1saXN0JykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB3cmFwcGVyQ2hhdC5yZW1vdmVDbGFzcyhcInBhZ2UtcXVpY2stc2lkZWJhci1jb250ZW50LWl0ZW0tc2hvd25cIik7XG4gICAgfSk7XG59O1xuXG4vLyBIYW5kbGVzIHF1aWNrIHNpZGViYXIgdGFza3NcbnZhciBoYW5kbGVRdWlja1NpZGViYXJBbGVydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHdyYXBwZXIgPSAkKCcucGFnZS1xdWljay1zaWRlYmFyLXdyYXBwZXInKTtcbiAgICB2YXIgd3JhcHBlckFsZXJ0cyA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1hbGVydHMnKTtcblxuICAgIHZhciBpbml0QWxlcnRzU2xpbVNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFsZXJ0TGlzdCA9IHdyYXBwZXIuZmluZCgnLnBhZ2UtcXVpY2stc2lkZWJhci1hbGVydHMtbGlzdCcpO1xuICAgICAgICB2YXIgYWxlcnRMaXN0SGVpZ2h0O1xuXG4gICAgICAgIGFsZXJ0TGlzdEhlaWdodCA9IHdyYXBwZXIuaGVpZ2h0KCkgLSB3cmFwcGVyLmZpbmQoJy5uYXYtanVzdGlmaWVkID4gLm5hdi10YWJzJykub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAvLyBhbGVydHMgbGlzdFxuICAgICAgICBNZXRyb25pYy5kZXN0cm95U2xpbVNjcm9sbChhbGVydExpc3QpO1xuICAgICAgICBhbGVydExpc3QuYXR0cihcImRhdGEtaGVpZ2h0XCIsIGFsZXJ0TGlzdEhlaWdodCk7XG4gICAgICAgIE1ldHJvbmljLmluaXRTbGltU2Nyb2xsKGFsZXJ0TGlzdCk7XG4gICAgfTtcblxuICAgIGluaXRBbGVydHNTbGltU2Nyb2xsKCk7XG4gICAgTWV0cm9uaWMuYWRkUmVzaXplSGFuZGxlcihpbml0QWxlcnRzU2xpbVNjcm9sbCk7IC8vIHJlaW5pdGlhbGl6ZSBvbiB3aW5kb3cgcmVzaXplXG59O1xuXG5yaW90LnRhZyhDT05TVEFOVFMuVEFHUy5TSURFQkFSLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICB0aGlzLm1peGluKFRyYWluaW5nTWl4KVxuXG5cdGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLnVzZXJQaWN0dXJlID0gJydcblxuXHR0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyVG9nZ2xlcigpOyAvLyBoYW5kbGVzIHF1aWNrIHNpZGViYXIncyB0b2dnbGVyXG4gICAgICAgIGhhbmRsZVF1aWNrU2lkZWJhckNoYXQoKTsgLy8gaGFuZGxlcyBxdWljayBzaWRlYmFyJ3MgY2hhdHNcbiAgICAgICAgaGFuZGxlUXVpY2tTaWRlYmFyQWxlcnRzKCk7IC8vIGhhbmRsZXMgcXVpY2sgc2lkZWJhcidzIGFsZXJ0c1xuXHRcdHRoaXMudXNlclBpY3R1cmUgPSBNZXRhTWFwLlVzZXIucGljdHVyZVxuXHR9KTtcblxuXHR0aGlzLmdldERpc3BsYXkgPSAoKSA9PiB7XG5cdFx0aWYgKCF0aGlzLmRpc3BsYXkpIHtcblx0XHRcdHJldHVybiAnZGlzcGxheTogbm9uZTsnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5nZXRSZWxhdGl2ZVRpbWUgPSAoZGF0ZSA9IG5ldyBEYXRlKCkpID0+IHtcblx0XHRyZXR1cm4gbW9tZW50KGRhdGUpLmZyb21Ob3coKTtcblx0fVxuXG5cdHRoaXMub25TdWJtaXQgPSAob2JqKSA9PiB7XG5cdFx0dGhpcy51c2VyVHJhaW5pbmcubWVzc2FnZXMucHVzaCh7XG5cdFx0XHRtZXNzYWdlOiB0aGlzLmNoYXRfaW5wdXQudmFsdWUsXG5cdFx0XHR0aW1lOiBuZXcgRGF0ZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5zYXZlVHJhaW5pbmcodGhpcy50cmFpbmluZ0lkKVxuXHRcdHRoaXMuY2hhdF9pbnB1dC52YWx1ZSA9ICcnXG5cdFx0dGhpcy51cGRhdGUoKVxuXHR9XG5cbiAgICBNZXRhTWFwLkV2ZW50ZXIub24oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX0NMT1NFLCAoKSA9PiB7XG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncGFnZS1xdWljay1zaWRlYmFyLW9wZW4nKVxuICAgIH0pO1xuXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoaWQpID0+IHtcbiAgICAgICAgdGhpcy50cmFpbmluZ0lkID0gaWRcbiAgICAgICAgdGhpcy5nZXREYXRhKGlkKVxuICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3BhZ2UtcXVpY2stc2lkZWJhci1vcGVuJylcbiAgICB9KTtcblxufSk7XG4iLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdyYXcnLCAnPHNwYW4+PC9zcGFuPicsIGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgdGhpcy51cGRhdGVDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gKG9wdHMpID8gKG9wdHMuY29udGVudCB8fCAnJykgOiAnJztcbiAgICB9O1xuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlQ29udGVudCgpO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgndHlwZWFoZWFkLmpzJylcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1zZWxlY3QnKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJylcbnJlcXVpcmUoJy4uLy4uL3Rvb2xzL3NoaW1zJyk7XG5jb25zdCBTaGFyaW5nID0gcmVxdWlyZSgnLi4vLi4vYXBwL1NoYXJpbmcnKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBpZD1cInNoYXJlX21vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxhIGlkPVwic2hhcmVfcHVibGljX2xpbmtcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImZsb2F0OiByaWdodDsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLWNsaXBib2FyZC10ZXh0PVwie3dpbmRvdy5sb2NhdGlvbi5ob3N0KycvJyt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUrJy9tYXBzLycrb3B0cy5tYXAuaWR9XCJcbiAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgZ2V0UHVibGljTGluayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBHZXQgc2hhcmFibGUgbGluayAgPGkgY2xhc3M9XCJmYSBmYS1saW5rXCI+PC9pPjwvYT5cbiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPlNoYXJlIHdpdGggb3RoZXJzPC9oND5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj5cbiAgICAgICAgICAgICAgICA8cD5QZW9wbGU8L3A+XG4gICAgICAgICAgICAgICAgPGZvcm0gcm9sZT1cImZvcm1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cInNoYXJlX3R5cGVhaGVhZFwiIGNsYXNzPVwiY29sLW1kLThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7XCIgaWQ9XCJzaGFyZV9pbnB1dFwiIGNsYXNzPVwidHlwZWFoZWFkIGZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJFbnRlciBuYW1lcyBvciBlbWFpbCBhZGRyZXNzZXMuLi5cIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNoYXJlX3Blcm1pc3Npb25cIiBjbGFzcz1cInNlbGVjdHBpY2tlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJyZWFkXCIgZGF0YS1jb250ZW50PVwiPHNwYW4+PGkgY2xhc3M9J2ZhIGZhLWV5ZSc+PC9pPiBDYW4gdmlldzwvc3Bhbj5cIj5DYW4gdmlldzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3cml0ZVwiIGRhdGEtY29udGVudD1cIjxzcGFuPjxpIGNsYXNzPSdmYSBmYS1wZW5jaWwnPjwvaT4gQ2FuIGVkaXQ8L3NwYW4+XCI+Q2FuIGVkaXQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZD1cInNoYXJlX2J1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1pY29uLW9ubHkgZ3JlZW5cIiBvbmNsaWNrPVwieyBvblNoYXJlIH1cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZj1cInsgb3B0cyAmJiBvcHRzLm1hcCAmJiBvcHRzLm1hcC5zaGFyZWRfd2l0aH1cIiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibGFiZWwgbGFiZWwtZGVmYXVsdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwibWFyZ2luLXJpZ2h0OiA1cHg7XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWY9XCJ7IGkgIT0gJ2FkbWluJyAmJiAodmFsLndyaXRlIHx8IHZhbC5yZWFkKSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgaSwgdmFsIGluIG9wdHMubWFwLnNoYXJlZF93aXRofVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBpZj1cInsgdmFsLndyaXRlIH1cIiBjbGFzcz1cImZhIGZhLXBlbmNpbFwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgaWY9XCJ7ICF2YWwud3JpdGUgfVwiIGNsYXNzPVwiZmEgZmEtZXllXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWwubmFtZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZhIGZhLXRpbWVzLWNpcmNsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uVW5TaGFyZSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+RG9uZTwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdzaGFyZScsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpXG4gICAgY29uc3Qgc2hhcmUgPSBuZXcgU2hhcmluZyhNZXRhTWFwLlVzZXIpXG5cbiAgICB0aGlzLmRhdGEgPSBbXTtcblxuICAgIHRoaXMuZ2V0UHVibGljTGluayA9IChlLCBvcHRzKSA9PiB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgIH1cblxuICAgIHRoaXMub25TaGFyZSA9IChlLCBvcHRzKSA9PiB7XG4gICAgICAgIHRoaXMub3B0cy5tYXAuc2hhcmVkX3dpdGhbdGhpcy5zdWdnZXN0aW9uLmlkXSA9IHtcbiAgICAgICAgICAgIHJlYWQ6IHRoaXMucGlja2VyLnZhbCgpID09ICdyZWFkJyB8fCB0aGlzLnBpY2tlci52YWwoKSA9PSAnd3JpdGUnLFxuICAgICAgICAgICAgd3JpdGU6IHRoaXMucGlja2VyLnZhbCgpID09ICd3cml0ZScsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLnN1Z2dlc3Rpb24ubmFtZSxcbiAgICAgICAgICAgIHBpY3R1cmU6IHRoaXMuc3VnZ2VzdGlvbi5waWN0dXJlXG4gICAgICAgIH1cbiAgICAgICAgc2hhcmUuYWRkU2hhcmUodGhpcy5vcHRzLm1hcCwgdGhpcy5zdWdnZXN0aW9uLCB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW3RoaXMuc3VnZ2VzdGlvbi5pZF0pXG5cbiAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0gbnVsbFxuICAgICAgICB0aGlzLnRhLnR5cGVhaGVhZCgndmFsJywgJycpXG4gICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLmhpZGUoKVxuICAgIH1cblxuICAgIHRoaXMub25VblNoYXJlID0gKGUsIG9wdHMpID0+IHtcbiAgICAgICAgZS5pdGVtLnZhbC5pZCA9IGUuaXRlbS5pXG4gICAgICAgIGRlbGV0ZSB0aGlzLm9wdHMubWFwLnNoYXJlZF93aXRoW2UuaXRlbS5pXVxuICAgICAgICBzaGFyZS5yZW1vdmVTaGFyZSh0aGlzLm9wdHMubWFwLCBlLml0ZW0udmFsKVxuICAgIH1cblxuICAgIHRoaXMub24oJ3VwZGF0ZScsIChvcHRzKSA9PiB7XG4gICAgICAgIGlmIChvcHRzKSB7XG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLm9wdHMsIG9wdHMpO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub24oJ21vdW50JywgKGUsIG9wdHMpID0+IHtcbiAgICAgICAgJCh0aGlzLnNoYXJlX21vZGFsKS5tb2RhbCgnc2hvdycpXG4gICAgICAgIHRoaXMudGEgPSAkKCcjc2hhcmVfdHlwZWFoZWFkIC50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xuICAgICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXG4gICAgICAgIH0se1xuICAgICAgICAgICAgc291cmNlOiAocXVlcnksIHN5bmNNZXRob2QsIGFzeW5jTWV0aG9kKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWV0YW1hcC5jby91c2Vycy9maW5kJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VySWQ6IE1ldGFNYXAuVXNlci51c2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uSWQ6IE1ldGFNYXAuTWV0YUZpcmUuZmlyZWJhc2VfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlZFVzZXJzOiBfLmtleXModGhpcy5vcHRzLm1hcC5zaGFyZWRfd2l0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IHF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJyonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY3R1cmU6ICdzcmMvaW1hZ2VzL3dvcmxkLWdsb2JlLmpwZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1B1YmxpYydcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luY01ldGhvZChkYXRhKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvciA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXNwbGF5OiAob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5uYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlczoge1xuICAgICAgICAgICAgICAgIGVtcHR5OiBbXG4gICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJwYWRkaW5nOiA1cHggMTBweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPicsXG4gICAgICAgICAgICAgICAgICAgICdVbmFibGUgdG8gZmluZCBhbnkgdXNlcnMgbWF0Y2hpbmcgdGhpcyBxdWVyeScsXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICAgICBdLmpvaW4oJ1xcbicpLFxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb246ICh2YWx1ZSkgPT4geyByZXR1cm4gYDxkaXY+PGltZyBhbHQ9XCIke3ZhbHVlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHt2YWx1ZS5waWN0dXJlfVwiPiAke3ZhbHVlLm5hbWV9PC9kaXY+YCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudGEub24oJ3R5cGVhaGVhZDpzZWxlY3QnLCAoZXYsIHN1Z2dlc3Rpb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbiA9IHN1Z2dlc3Rpb25cbiAgICAgICAgICAgICQodGhpcy5zaGFyZV9idXR0b24pLnNob3coKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRhLm9uKCd0eXBlYWhlYWQ6YXV0b2NvbXBsZXRlJywgKGV2LCBzdWdnZXN0aW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSBzdWdnZXN0aW9uXG4gICAgICAgICAgICAkKHRoaXMuc2hhcmVfYnV0dG9uKS5zaG93KClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5waWNrZXIgPSAkKCcuc2VsZWN0cGlja2VyJykuc2VsZWN0cGlja2VyKHtcbiAgICAgICAgICAgIHdpZHRoOiAnYXV0bydcbiAgICAgICAgfSlcbiAgICB9KVxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcblxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWdyYWR1YXRpb24tY2FwXCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjcwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBpZj1cInsgaGVscCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2g9XCJ7IGhlbHAgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyBsaW5rIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj57IHRpdGxlIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG5gO1xuXG5yaW90LnRhZygnbWV0YS1oZWxwJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLm9uQ2xpY2sgPSAoZXZlbnQsIHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5oZWxwID0gbnVsbDtcbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5vbignbWV0YW1hcC9oZWxwJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGVscCA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5cbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxucmVxdWlyZSgnLi4vLi4vdG9vbHMvc2hpbXMnKVxuXG5jb25zdCBodG1sID0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIlxuICAgICAgICAgICAgICAgICBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICBkYXRhLWhvdmVyPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICBkYXRhLWNsb3NlLW90aGVycz1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1iZWxsLW9cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2Utc3VjY2Vzc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyBub3RpZmljYXRpb25zLmxlbmd0aCB9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IG5vdGlmaWNhdGlvbnMubGVuZ3RoIH0gcGVuZGluZzwvc3Bhbj4gbm90aWZpY2F0aW9ueyBzOiBub3RpZmljYXRpb25zLmxlbmd0aCA9PSAwIHx8IG5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWY9XCJ7IGFsbE5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMSB9XCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPnZpZXcgYWxsPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51LWxpc3Qgc2Nyb2xsZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7XCIgZGF0YS1oYW5kbGUtY29sb3I9XCIjNjM3MjgzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyB0cnVlICE9IGFyY2hpdmVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWNoPVwieyB2YWwsIGkgaW4gbm90aWZpY2F0aW9ucyB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljaz1cInsgcGFyZW50Lm9uQ2xpY2sgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGlmPVwieyB2YWwucGhvdG8gIT0gbnVsbCB9XCIgY2xhc3M9XCJwaG90b1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8aW1nIHNyYz1cInt2YWwucGhvdG99XCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgYWx0PVwiXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN1YmplY3RcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJmcm9tXCI+eyB2YWwuZnJvbSB9PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInRpbWVcIiBzdHlsZT1cInBhZGRpbmc6IDA7XCI+eyBwYXJlbnQuZ2V0VGltZSh2YWwudGltZSkgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWVzc2FnZVwiPnsgdmFsLmV2ZW50IH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuYDtcblxucmlvdC50YWcoJ21ldGEtbm90aWZpY2F0aW9ucycsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuICAgIGNvbnN0IGZiUGF0aCA9IENPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQoTWV0YU1hcC5Vc2VyLnVzZXJJZClcblxuICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IFtdO1xuICAgIHRoaXMuYWxsTm90aWZpY2F0aW9ucyA9IFtdO1xuXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgbGV0IGl0ZW0gPSBldmVudC5pdGVtLnZhbFxuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEodHJ1ZSwgYCR7ZmJQYXRofS8ke2l0ZW0uaWR9L2FyY2hpdmVgKVxuICAgICAgICBzd2l0Y2ggKGl0ZW0udHlwZSkge1xuICAgICAgICAgICAgY2FzZSBDT05TVEFOVFMuTk9USUZJQ0FUSU9OLk1BUDpcbiAgICAgICAgICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgbWFwLyR7aXRlbS5tYXBJZH1gKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmdldFRpbWUgPSAodGltZSkgPT4ge1xuICAgICAgICByZXR1cm4gbW9tZW50KG5ldyBEYXRlKHRpbWUpKS5mcm9tTm93KClcbiAgICB9XG5cbiAgICB0aGlzLm9uKCdtb3VudCcsICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5nZXREYXRhKGZiUGF0aClcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUucHVzaERhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6ICdZb3Ugc2lnbmVkIHVwIGZvciBNZXRhTWFwIScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiBgJHtuZXcgRGF0ZSgpIH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjaGl2ZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSwgZmJQYXRoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuTk9USUZJQ0FUSU9OUy5mb3JtYXQoTWV0YU1hcC5Vc2VyLnVzZXJJZCksIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxsTm90aWZpY2F0aW9ucyA9IF8ubWFwKGRhdGEsIChuLCBpZCkgPT4geyBuLmlkID0gaWQ7IHJldHVybiBuOyAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IF8uZmlsdGVyKF8uc29ydEJ5KHRoaXMuYWxsTm90aWZpY2F0aW9ucywgJ2RhdGUnKSwgKGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcblxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtdHJvcGh5XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLXN1Y2Nlc3NcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgcG9pbnRzLmxlbmd0aCB9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJleHRlcm5hbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzID1cImJvbGRcIj57IHBvaW50cy5sZW5ndGggfSBuZXcgPC9zcGFuPiBhY2hpZXZlbWVudHsgczogcG9pbnRzLmxlbmd0aCA9PSAwIHx8IHBvaW50cy5sZW5ndGggPiAxIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCI+dmlldyBhbGw8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUtbGlzdCBzY3JvbGxlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNTBweDtcIiBkYXRhLWhhbmRsZS1jb2xvcj1cIiM2MzcyODNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgaWY9XCJ7IHBvaW50cyB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgcG9pbnRzIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwieyBwYXJlbnQub25DbGljayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZVwiPnsgdGltZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkZXRhaWxzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC1pY29uIGxhYmVsLXN1Y2Nlc3NcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGV2ZW50IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG5gO1xuXG5yaW90LnRhZygnbWV0YS1wb2ludHMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xuXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIHBhcmFtcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMub24oJ21vdW50JywgKCkgPT4ge1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKGB1c2Vycy8ke01ldGFNYXAuVXNlci51c2VySWR9L3BvaW50c2AsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvaW50cyA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcblxuY29uc3QgaHRtbCA9IGA8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgZGF0YS1ob3Zlcj1cImRyb3Bkb3duXCIgZGF0YS1jbG9zZS1vdGhlcnM9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidXNlcm5hbWUgdXNlcm5hbWUtaGlkZS1vbi1tb2JpbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdXNlcm5hbWUgfVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgaWY9XCJ7IHBpY3R1cmUgfVwiIGFsdD1cIlwiIGhlaWdodD1cIjM5XCIgd2lkdGg9XCIzOVwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cInsgcGljdHVyZSB9XCIgLz5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBkcm9wZG93bi1tZW51LWRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGlmPVwieyBtZW51IH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgZWFjaD1cInsgbWVudSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkNsaWNrIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG5gO1xuXG5yaW90LnRhZygnbWV0YS11c2VyJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XG5cbiAgICB0aGlzLm1lbnUgPSBbXTtcbiAgICB0aGlzLnVzZXJuYW1lID0gJyc7XG4gICAgdGhpcy5waWN0dXJlID0gJyc7XG5cbiAgICB0aGlzLmxvZ291dCA9ICgpID0+IHtcbiAgICAgICAgTWV0YU1hcC5sb2dvdXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmxpbmtBY2NvdW50ID0gKCkgPT4ge1xuICAgICAgICBNZXRhTWFwLkF1dGgwLmxpbmtBY2NvdW50KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vbkNsaWNrID0gKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgc3dpdGNoKGV2ZW50Lml0ZW0ubGluaykge1xuICAgICAgICAgICAgY2FzZSAnI2xpbmstc29jaWFsLWFjY291bnRzJzpcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmtBY2NvdW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYG1ldGFtYXAvdXNlcmAsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVzZXJuYW1lID0gTWV0YU1hcC5Vc2VyLmRpc3BsYXlOYW1lO1xuICAgICAgICAgICAgdGhpcy5waWN0dXJlID0gTWV0YU1hcC5Vc2VyLnBpY3R1cmU7XG4gICAgICAgICAgICB0aGlzLm1lbnUgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgaW5jbHVkZSA9IGQuYXJjaGl2ZSAhPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsImNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xuXG5sZXQgVHJhaW5pbmdNaXggPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKVxuICAgIH0sXG5cbiAgICB1c2VyVHJhaW5pbmc6IHsgbWVzc2FnZXM6IFtdIH0sXG4gICAgdHJhaW5pbmc6IHt9LFxuXG4gICAgc2F2ZVRyYWluaW5nOiBmdW5jdGlvbihpZCkge1xuICAgICAgICB0aGlzLk1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YSh0aGlzLnVzZXJUcmFpbmluZywgYCR7Q09OU1RBTlRTLlJPVVRFUy5UUkFJTklOR1MuZm9ybWF0KHRoaXMuTWV0YU1hcC5Vc2VyLnVzZXJJZCl9JHtpZH1gKVxuICAgIH0sXG5cbiAgICBnZXREYXRhOiBmdW5jdGlvbihpZCkge1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGxldCB0aGF0ID0gdGhpc1xuICAgICAgICAgICAgdGhpcy5fb25jZUdldERhdGEgPSB0aGlzLl9vbmNlR2V0RGF0YSB8fCBfLm9uY2UoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIG9uY2UgPSBfLm9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lk1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5UUkFJTklOR1MuZm9ybWF0KHRoYXQuTWV0YU1hcC5Vc2VyLnVzZXJJZCkgfSR7aWR9YCwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXNlclRyYWluaW5nID0gZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51c2VyVHJhaW5pbmcgPSB0aGF0LnRyYWluaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zYXZlVHJhaW5pbmcoaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoYXQudXNlclRyYWluaW5nLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51c2VyVHJhaW5pbmcubWVzc2FnZXMgPSBbdGhhdC5nZXREZWZhdWx0TWVzc2FnZSgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNhdmVUcmFpbmluZyhpZClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5NZXRhTWFwLkV2ZW50ZXIuZG8oQ09OU1RBTlRTLkVWRU5UUy5TSURFQkFSX09QRU4sIGlkKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoYXQuTWV0YU1hcC5NZXRhRmlyZS5vbihgJHtDT05TVEFOVFMuUk9VVEVTLkNPVVJTRV9MSVNUfSR7aWR9YCwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50cmFpbmluZyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuTWV0YU1hcC5FdmVudGVyLmRvKENPTlNUQU5UUy5FVkVOVFMuUEFHRV9OQU1FLCBkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBvbmNlKClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fb25jZUdldERhdGEoKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1lc3NhZ2VzOiBbXSxcblxuICAgIGNvcnRleFBpY3R1cmU6ICdzcmMvaW1hZ2VzL2NvcnRleC1hdmF0YXItc21hbGwuanBnJyxcblxuICAgIGdldERlZmF1bHRNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBgSGVsbG8sIEknbSBDb3J0ZXggTWFuLiBBc2sgbWUgYW55dGhpbmcuIFRyeSA8Y29kZT4vaGVscDwvY29kZT4gaWYgeW91IGdldCBsb3N0LmAsXG4gICAgICAgICAgICBhdXRob3I6ICdjb3J0ZXgnLFxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgfSxcblxuXG5cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWluaW5nTWl4IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcblxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5yZXF1aXJlKCcuLi90b29scy9zaGltcycpO1xuY29uc3QgUGVybWlzc2lvbnMgPSByZXF1aXJlKCcuLi9hcHAvUGVybWlzc2lvbnMnKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBpZD1cInBhZ2VfYWN0aW9uc1wiIGNsYXNzPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biByZWQtaGF6ZSBidG4tc20gZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGRhdGEtaG92ZXI9XCJkcm9wZG93blwiIGRhdGEtY2xvc2Utb3RoZXJzPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRkZW4tc20gaGlkZGVuLXhzXCI+QWN0aW9ucyZuYnNwOzwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IHZhbCwgaSBpbiBkYXRhIH1cIiBjbGFzcz1cInsgc3RhcnQ6IGkgPT0gMCwgYWN0aXZlOiBpID09IDAgfVwiPlxuICAgICAgICAgICAgICAgIDxhIGlmPVwieyBwYXJlbnQuZ2V0TGlua0FsbG93ZWQodmFsKSB9XCIgaHJlZj1cInsgcGFyZW50LmdldEFjdGlvbkxpbmsodmFsKSB9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyB2YWwuaWNvbiB9XCI+PC9pPiB7IHZhbC50aXRsZSB9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPlxuICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjc2V0dGluZ3NcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1nZWFyXCI+PC9pPiBTZXR0aW5nc1xuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgPC9kaXY+XG5cbiAgICA8c3BhbiBzdHlsZT1cInBhZGRpbmctbGVmdDogNXB4O1wiPlxuICAgICAgICA8c3BhbiBpZj1cInsgcGFnZU5hbWUgfVwiXG4gICAgICAgICAgICAgICAgaWQ9XCJtYXBfbmFtZVwiXG4gICAgICAgICAgICAgICAgZGF0YS10eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgZGF0YS10aXRsZT1cIkVudGVyIG1hcCBuYW1lXCJcbiAgICAgICAgICAgICAgICBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+XG4gICAgICAgICAgICB7IHBhZ2VOYW1lIH1cbiAgICAgICAgPC9zcGFuPlxuICAgIDwvc3Bhbj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1hY3Rpb25zJywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB0aGlzLnBhZ2VOYW1lID0gJ0hvbWUnO1xuICAgIHRoaXMudXJsID0gTWV0YU1hcC5jb25maWcuc2l0ZS5kYiArICcuZmlyZWJhc2Vpby5jb20nO1xuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG5cbiAgICBsZXQgcGVybWlzc2lvbnMgPSBudWxsO1xuXG4gICAgdGhpcy5nZXRBY3Rpb25MaW5rID0gKG9iaikgPT4ge1xuICAgICAgICBsZXQgcmV0ID0gb2JqLmxpbms7XG4gICAgICAgIGlmIChvYmoudXJsX3BhcmFtcykge1xuICAgICAgICAgICAgbGV0IGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChvYmoudXJsX3BhcmFtcywgKHBybSkgPT4ge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh0aGlzW3BybS5uYW1lXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldCA9IG9iai5saW5rLmZvcm1hdC5jYWxsKG9iai5saW5rLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHRoaXMuZ2V0TGlua0FsbG93ZWQgPSAob2JqKSA9PiB7XG4gICAgICAgIGxldCByZXQgPSB0cnVlID09IG9ialsnYWxsb3dlZC1vbiddWycqJ107XG4gICAgICAgIGlmICghcmV0KSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFBhZ2UgPSBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aDtcbiAgICAgICAgICAgIHJldCA9IHRydWUgPT0gb2JqWydhbGxvd2VkLW9uJ11bY3VycmVudFBhZ2VdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXQgJiYgdGhpcy5tYXAgJiYgcGVybWlzc2lvbnMpIHtcbiAgICAgICAgICAgIHN3aXRjaCAob2JqLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU2hhcmUgTWFwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdEZWxldGUgTWFwJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGVybWlzc2lvbnMuaXNNYXBPd25lcigpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVQYWdlTmFtZSA9IChtYXApID0+IHtcbiAgICAgICAgcGVybWlzc2lvbnMgPSBuZXcgUGVybWlzc2lvbnMobWFwKVxuICAgICAgICB0aGlzLm1hcCA9IG1hcCB8fCB7fVxuICAgICAgICBpZiAocGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VOYW1lID0gbWFwLm5hbWUgfHwgJydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFnZU5hbWUgPSBtYXAubmFtZSArICcgKFNoYXJlZCBieSAnICsgbWFwLm93bmVyLm5hbWUgKyAnKSdcbiAgICAgICAgfVxuICAgICAgICBpZiAocGVybWlzc2lvbnMgJiYgcGVybWlzc2lvbnMuaXNNYXBPd25lcigpKSB7XG4gICAgICAgICAgICAkKHRoaXMubWFwX25hbWUpLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgKGV2ZW50LCBwYXJhbXMpID0+IHtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfS9uYW1lYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfVxuXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmxvYWRlZCkge1xuICAgICAgICAgICAgJCh0aGlzLm1hcF9uYW1lKS5lZGl0YWJsZSgnZGVzdHJveScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1hcElkKSB7XG4gICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9mZihgJHtDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVH0vJHt0aGlzLm1hcElkfWApO1xuICAgICAgICAgICAgdGhpcy5tYXBJZCA9IG51bGxcbiAgICAgICAgICAgIHRoaXMubWFwID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLmlkKSB7XG4gICAgICAgICAgICB0aGlzLm1hcElkID0gb3B0cy5pZDtcbiAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oYCR7Q09OU1RBTlRTLlJPVVRFUy5NQVBTX0xJU1R9LyR7b3B0cy5pZH1gLCAobWFwKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlTmFtZShtYXApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhZ2VOYW1lID0gb3B0cy5uYW1lIHx8ICdIb21lJztcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIE1ldGFNYXAuTWV0YUZpcmUub24oJ21ldGFtYXAvYWN0aW9ucycsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuZGF0YSA9IF8uZmlsdGVyKF8uc29ydEJ5KGRhdGEsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgdmFyIGluY2x1ZGUgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBpbmNsdWRlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIE1ldGFNYXAuRXZlbnRlci5vbihDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfQ0xPU0UsICgpID0+IHtcbiAgICAgICAgJCh0aGlzLnBhZ2VfYWN0aW9ucykuY3NzKHsgJ3BhZGRpbmctbGVmdCc6ICcwJyB9KVxuICAgIH0pO1xuXG4gICAgTWV0YU1hcC5FdmVudGVyLm9uKENPTlNUQU5UUy5FVkVOVFMuU0lERUJBUl9PUEVOLCAoKSA9PiB7XG4gICAgICAgICQodGhpcy5wYWdlX2FjdGlvbnMpLmNzcyh7ICdwYWRkaW5nLWxlZnQnOiAnNzBweCcgfSlcbiAgICB9KTtcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IHBhZ2VIZWFkZXIgPSByZXF1aXJlKCcuL3BhZ2UtaGVhZGVyJyk7XG5jb25zdCBwYWdlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9wYWdlLWNvbnRhaW5lcicpO1xuY29uc3QgcGFnZUZvb3RlciA9IHJlcXVpcmUoJy4vcGFnZS1mb290ZXInKTtcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJwYWdlX2JvZHlcIiBjbGFzcz1cInBhZ2UtaGVhZGVyLWZpeGVkIHBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiPlxuXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9oZWFkZXJcIj48L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJjbGVhcmZpeFwiPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9jb250YWluZXJcIj48L2Rpdj5cblxuPC9kaXY+YDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1ib2R5JywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlciB8fCByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2hlYWRlciwgJ3BhZ2UtaGVhZGVyJylbMF07XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5jb250YWluZXIgfHwgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250YWluZXIsICdwYWdlLWNvbnRhaW5lcicpWzBdO1xuICAgIH0pO1xuXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgcGFnZUNvbnRlbnQgPSByZXF1aXJlKCcuL3BhZ2UtY29udGVudCcpO1xuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBhZ2UtY29udGFpbmVyXCI+XG5cbiAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX2NvbnRlbnRcIj48L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1jb250YWluZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnQgfHwgcmlvdC5tb3VudCh0aGlzLm1ldGFfcGFnZV9jb250ZW50LCAncGFnZS1jb250ZW50JylbMF07XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL3F1aWNrLXNpZGViYXInKVxuXG5jb25zdCBodG1sID0gYFxuPGRpdiBjbGFzcz1cInBhZ2UtY29udGVudC13cmFwcGVyXCI+XG4gICAgPGRpdiBpZD1cInBhZ2UtY29udGVudFwiIGNsYXNzPVwicGFnZS1jb250ZW50XCI+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBhZ2UtaGVhZFwiPjwvZGl2PlxuXG4gICAgICAgIDxkaXYgaWQ9XCJhcHAtY29udGFpbmVyXCI+PC9kaXY+XG5cbiAgICAgICAgPGRpdiBpZD1cInF1aWNrX3NpZGViYXJfY29udGFpbmVyXCI+PC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2UtY29udGVudCcsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnNpZGViYXIgPSB0aGlzLnNpZGViYXIgfHwgcmlvdC5tb3VudCh0aGlzLnF1aWNrX3NpZGViYXJfY29udGFpbmVyLCAncXVpY2stc2lkZWJhcicpWzBdXG4gICAgICAgIHRoaXMucmVzaXplKClcbiAgICB9KVxuXG4gICAgdGhpcy5yZXNpemUgPSAoKSA9PiB7XG4gICAgICAgIGxldCB3aWR0aCA9IGAke3dpbmRvdy5pbm5lcldpZHRoIC0gNDB9cHhgO1xuICAgICAgICAkKHRoaXNbJ2FwcC1jb250YWluZXInXSkuY3NzKHsgd2lkdGg6IHdpZHRoIH0pO1xuICAgIH1cblxuICAgICQod2luZG93KS5vbigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnJlc2l6ZSgpXG4gICAgfSk7XG5cblxuXG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicGFnZS1mb290ZXJcIiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAwO1wiPlxuICAgIDxkaXYgY2xhc3M9XCJwYWdlLWZvb3Rlci1pbm5lclwiPlxuICAgICAgICA8YSBocmVmPVwiI3Rlcm1zXCI+JmNvcHk7MjAxNTwvYT5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS1mb290ZXInLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IHBhZ2VMb2dvID0gcmVxdWlyZSgnLi9wYWdlLWxvZ28uanMnKTtcbmNvbnN0IHBhZ2VBY3Rpb25zID0gcmVxdWlyZSgnLi9wYWdlLWFjdGlvbnMuanMnKTtcbmNvbnN0IHBhZ2VTZWFyY2ggPSByZXF1aXJlKCcuL3BhZ2Utc2VhcmNoLmpzJyk7XG5jb25zdCBwYWdlVG9wTWVudSA9IHJlcXVpcmUoJy4vcGFnZS10b3BtZW51Jyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGlkPVwiaGVhZGVyLXRvcFwiIGNsYXNzPVwicGFnZS1oZWFkZXIgbmF2YmFyIG5hdmJhci1maXhlZC10b3BcIj5cbiAgICA8ZGl2IGlkPVwibWV0YV9wcm9ncmVzc19uZXh0XCIgc3R5bGU9XCJvdmVyZmxvdzogaW5oZXJpdDtcIj48L2Rpdj5cbiAgICA8ZGl2IGlkPVwiaGVhZGVyLWNvbnRlbnRcIiBjbGFzcz1cInBhZ2UtaGVhZGVyLWlubmVyXCI+XG5cbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9sb2dvXCI+PC9kaXY+XG5cbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV9hY3Rpb25zXCI+PC9kaXY+XG5cbiAgICAgICAgPGRpdiBpZD1cIm1ldGFfcGFnZV90b3BcIiBjbGFzcz1cInBhZ2UtdG9wXCI+XG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3NlYXJjaFwiPjwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGlkPVwibWV0YV9wYWdlX3RvcG1lbnVcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cblxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWhlYWRlcicsIGh0bWwsIGZ1bmN0aW9uKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi9NZXRhTWFwJyk7XG5cbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nbyA9IHRoaXMubG9nbyB8fCByaW90Lm1vdW50KHRoaXMubWV0YV9wYWdlX2xvZ28sICdwYWdlLWxvZ28nKVswXTtcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gdGhpcy5hY3Rpb25zIHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfYWN0aW9ucywgJ3BhZ2UtYWN0aW9ucycpWzBdO1xuICAgICAgICB0aGlzLnNlYXJjaCA9IHRoaXMuc2VhcmNoIHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfdG9wLCAncGFnZS1zZWFyY2gnKVswXTtcbiAgICAgICAgdGhpcy50b3BtZW51ID0gdGhpcy50b3BtZW51IHx8IHJpb3QubW91bnQodGhpcy5tZXRhX3BhZ2VfdG9wLCAncGFnZS10b3BtZW51JylbMF07XG4gICAgfSk7XG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzID1cInBhZ2UtbG9nb1wiPlxuICAgIDxhIGlkPVwibWV0YV9sb2dvXCIgaHJlZj1cIiNob21lXCI+XG4gICAgICAgIDxpbWcgc3JjPVwic3JjL2ltYWdlcy9tZXRhbWFwX2Nsb3VkLnBuZ1wiIGFsdD1cImxvZ29cIiBjbGFzcyA9XCJsb2dvLWRlZmF1bHRcIiAvPlxuICAgIDwvYT5cblxuICAgIDxkaXYgaWQ9XCJtZXRhX21lbnVfdG9nZ2xlXCIgY2xhc3M9XCJtZW51LXRvZ2dsZXIgc2lkZWJhci10b2dnbGVyIHF1aWNrLXNpZGViYXItdG9nZ2xlclwiIG9uY2xpY2s9XCJ7IG9uQ2xpY2sgfVwiIHN0eWxlPVwidmlzaWJpbGl0eTp7IGdldERpc3BsYXkoKSB9O1wiPlxuICAgICAgICA8IS0tRE9DOiBSZW1vdmUgdGhlIGFib3ZlIFwiaGlkZVwiIHRvIGVuYWJsZSB0aGUgc2lkZWJhciB0b2dnbGVyIGJ1dHRvbiBvbiBoZWFkZXItLT5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIGNsYXNzID1cIm1lbnUtdG9nZ2xlciByZXNwb25zaXZlLXRvZ2dsZXJcIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLWNvbGxhcHNlXCI+XG48L2E+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKCdwYWdlLWxvZ28nLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5pc1NpZGViYXJPcGVuID0gZmFsc2U7XG5cbiAgICB2YXIgdG9nZ2xlID0gKHN0YXRlKSA9PiB7XG4gICAgICAgIGlmKHRoaXMuaXNTaWRlYmFyT3BlbiAhPSBzdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5pc1NpZGViYXJPcGVuID0gc3RhdGVcbiAgICAgICAgICAgICQodGhpcy5tZXRhX21lbnVfdG9nZ2xlKS5jbGljaygpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5vbkNsaWNrID0gKCkgPT4ge1xuICAgICAgIC8vIE1ldGFNYXAuRXZlbnRlci5kbyhDT05TVEFOVFMuRVZFTlRTLlNJREVCQVJfVE9HR0xFKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldERpc3BsYXkgPSAoZWwpID0+IHtcbiAgICAgICAgaWYoTWV0YU1hcCAmJiBNZXRhTWFwLlJvdXRlciAmJiBNZXRhTWFwLlJvdXRlci5jdXJyZW50UGF0aCA9PSBDT05TVEFOVFMuUEFHRVMuVFJBSU5JTkdTKSB7XG4gICAgICAgICAgICB0b2dnbGUodHJ1ZSlcbiAgICAgICAgICAgIHJldHVybiAndmlzaWJsZSdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnaGlkZGVuJ1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTWV0YU1hcC5FdmVudGVyLmV2ZXJ5KCdwYWdlTmFtZScsIChvcHRzKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlKClcbiAgICB9KVxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcblxuY29uc3QgaHRtbCA9IGBcbjwhLS0gRE9DOiBBcHBseSBcInNlYXJjaC1mb3JtLWV4cGFuZGVkXCIgcmlnaHQgYWZ0ZXIgdGhlIFwic2VhcmNoLWZvcm1cIiBjbGFzcyB0byBoYXZlIGhhbGYgZXhwYW5kZWQgc2VhcmNoIGJveCAtLT5cbjxmb3JtIGNsYXNzPVwic2VhcmNoLWZvcm1cIiBhY3Rpb249XCJleHRyYV9zZWFyY2guaHRtbFwiIG1ldGhvZD1cIkdFVFwiPlxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoLi4uXCIgbmFtZT1cInF1ZXJ5XCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBjbGFzcz1cImJ0biBzdWJtaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1zZWFyY2hcIj48L2k+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbjwvZm9ybT5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3BhZ2Utc2VhcmNoJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKTtcblxuICAgIFxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnYm9vdHN0cmFwLWhvdmVyLWRyb3Bkb3duJylcblxuY29uc3QgbWV0YVBvaW50cyA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLXBvaW50cy5qcycpO1xuY29uc3QgbWV0YUhlbHAgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1oZWxwLmpzJyk7XG5jb25zdCBtZXRhVXNlciA9IHJlcXVpcmUoJy4vbWVudS9tZXRhLXVzZXIuanMnKTtcbmNvbnN0IG1ldGFOb3QgPSByZXF1aXJlKCcuL21lbnUvbWV0YS1ub3RpZmljYXRpb25zLmpzJyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwidG9wLW1lbnVcIj5cbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBwdWxsLXJpZ2h0XCI+XG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIiBpZD1cImhlYWRlcl9kYXNoYm9hcmRfYmFyXCIgb25jbGljaz1cInsgb25DbGljayB9XCI+XG4gICAgICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGhyZWY9XCIjaG9tZVwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtaG9tZVwiPjwvaT5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cblxuICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XG4gICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duIGRyb3Bkb3duLWV4dGVuZGVkIGRyb3Bkb3duLW5vdGlmaWNhdGlvbiBkcm9wZG93blwiIGlkPVwiaGVhZGVyX25vdGlmaWNhdGlvbl9iYXJcIj48L2xpPlxuXG5gXG4gICAgICAgICAgICAvLyA8bGkgY2xhc3M9XCJzZXBhcmF0b3IgaGlkZVwiPjwvbGk+XG4gICAgICAgICAgICAvLyA8bGkgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIiBpZD1cImhlYWRlcl9wb2ludHNfYmFyXCI+PC9saT5cbisgYFxuXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cbiAgICAgICAgPGxpIGlkPVwiaGVhZGVyX2hlbHBfYmFyXCIgY2xhc3M9XCJkcm9wZG93biBkcm9wZG93bi1leHRlbmRlZCBkcm9wZG93bi1ub3RpZmljYXRpb24gZHJvcGRvd25cIj48L2xpPlxuXG4gICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvciBoaWRlXCI+PC9saT5cbiAgICAgICAgPGxpIGlkPVwiaGVhZGVyX3VzZXJfbWVudVwiIGNsYXNzPVwiZHJvcGRvd24gZHJvcGRvd24tdXNlciBkcm9wZG93blwiPjwvbGk+XG4gICAgPC91bD5cbjwvZGl2PlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZygncGFnZS10b3BtZW51JywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuICAgIHRoaXMub25DbGljayA9IChldmVudCwgcGFyYW1zKSA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMub24oJ3VwZGF0ZScsICgpID0+IHtcbiAgICAgICAgLy9UT0RPOiByZXN0b3JlIG5vdGlmaWNhdGlvbnMgd2hlbiBsb2dpYyBpcyBjb21wbGV0ZVxuICAgICAgICAvL3Jpb3QubW91bnQodGhpcy5oZWFkZXJfcG9pbnRzX2JhciwgJ21ldGEtcG9pbnRzJyk7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucz10aGlzLm5vdGlmaWNhdGlvbnMgfHwgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9ub3RpZmljYXRpb25fYmFyLCAnbWV0YS1ub3RpZmljYXRpb25zJyk7XG4gICAgICAgIHRoaXMuaGVscD10aGlzLmhlbHAgfHwgcmlvdC5tb3VudCh0aGlzLmhlYWRlcl9oZWxwX2JhciwgJ21ldGEtaGVscCcpO1xuICAgICAgICB0aGlzLnVzZXI9dGhpcy51c2VyIHx8IHJpb3QubW91bnQodGhpcy5oZWFkZXJfdXNlcl9tZW51LCAnbWV0YS11c2VyJyk7XG4gICAgfSk7XG5cbn0pOyIsImNvbnN0IHJpb3QgPSByZXF1aXJlKCdyaW90Jyk7XG5jb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5jb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcbnJlcXVpcmUoJ2RhdGF0YWJsZXMnKVxucmVxdWlyZSgnZGF0YXRhYmxlcy1ib290c3RyYXAzLXBsdWdpbicpXG5cbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKVxuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKVxucmVxdWlyZSgnLi4vdGFibGVzL2FsbC1jb3Vyc2VzJylcbnJlcXVpcmUoJy4uL3RhYmxlcy9teS1jb3Vyc2VzJylcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgaWQ9XCJteV9jb3Vyc2VzX3BhZ2VcIiBjbGFzcz1cInBvcnRsZXQgYm94IGdyZXktY2FzY2FkZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LXRpdGxlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXB0aW9uXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWljb24tdGgtbGFyZ2VcIj48L2k+Q291cnNlc1xuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBpZj1cInsgbWVudSB9XCIgY2xhc3M9XCJhY3Rpb25zXCI+XG4gICAgICAgICAgICA8YSBlYWNoPVwieyBtZW51LmJ1dHRvbnMgfVwiIGhyZWY9XCJ7IGxpbmsgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbkFjdGlvbkNsaWNrIH1cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIj5cbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIiBocmVmPVwiamF2YXNjcmlwdDo7XCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNvZ3NcIj48L2k+IFRvb2xzIDxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBlYWNoPVwieyBtZW51Lm1lbnUgfVwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vbk1lbnVDbGljayB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwieyBsaW5rIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiB7IHRpdGxlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cbiAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdi10YWJzIHBvcnRsZXQtdGFic1wiPlxuICAgICAgICAgICAgPGxpIG9uY2xpY2s9XCJ7IHBhcmVudC5vblRhYlN3aXRjaCB9XCIgZWFjaD1cInsgdmFsLCBpIGluIHRhYnMgfVwiIGNsYXNzPVwieyBhY3RpdmU6IGkgPT0gMCB9XCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNteWNvdXJzZXNfMV97IGkgfVwiIGRhdGEtdG9nZ2xlPVwidGFiXCIgYXJpYS1leHBhbmRlZD1cInsgdHJ1ZTogaSA9PSAwIH1cIj5cbiAgICAgICAgICAgICAgICB7IHZhbC50aXRsZSB9PC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlLXRvb2xiYXJcIj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRhYi1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGVhY2g9XCJ7IHZhbCwgaSBpbiB0YWJzIH1cIiBjbGFzcz1cInRhYi1wYW5lIGZhc2UgaW4geyBhY3RpdmU6IGkgPT0gMCB9XCIgaWQ9XCJteWNvdXJzZXNfMV97IGkgfVwiPlxuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoQ09OU1RBTlRTLlRBR1MuQ09VUlNFX0xJU1QsIGh0bWwsIGZ1bmN0aW9uIChvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcC5qcycpO1xuXG4gICAgdGhpcy51c2VyID0gTWV0YU1hcC5Vc2VyO1xuICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIHRoaXMubWVudSA9IG51bGw7XG4gICAgbGV0IHRhYnMgPSBbXG4gICAgICAgIHsgdGl0bGU6ICdNeSBUcmFpbmluZ3MnLCBvcmRlcjogMCwgZWRpdGFibGU6IHRydWUsIGNvbHVtbnM6IFt7IG5hbWU6ICdDaGVjaycsIGlzQ2hlY2tib3g6IHRydWUgfSwgeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdTdGF0dXMnIH1dIH0sXG4gICAgICAgIHsgdGl0bGU6ICdBbGwgVHJhaW5pbmdzJywgb3JkZXI6IDEsIGVkaXRhYmxlOiBmYWxzZSwgY29sdW1uczogW3sgbmFtZTogJ0FjdGlvbicgfSwgeyBuYW1lOiAnQ3JlYXRlZCBPbicgfSwgeyBuYW1lOiAnT3duZXInIH1dIH1cbiAgICBdO1xuICAgIHRoaXMudGFicyA9IF8uc29ydEJ5KHRhYnMsICdvcmRlcicpXG5cbiAgICB0aGlzLmN1cnJlbnRUYWIgPSAnTXkgVHJhaW5pbmdzJztcblxuICAgIC8vRXZlbnRzXG4gICAgdGhpcy5vbk9wZW4gPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2V2ZW50Lml0ZW0uaWR9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5vblRhYlN3aXRjaCA9IChldmVudCwgLi4ubykgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRUYWIgPSBldmVudC5pdGVtLnZhbC50aXRsZTtcbiAgICB9XG5cbiAgICB0aGlzLmxvYWRUYWJsZSA9ICh0aXRsZSwgaSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzW2BteWNvdXJzZXNfMV8ke2l9YF1cbiAgICAgICAgICAgIGxldCB0YWcgPSBudWxsO1xuICAgICAgICAgICAgc3dpdGNoICh0aXRsZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ0FsbCBUcmFpbmluZ3MnOlxuICAgICAgICAgICAgICAgICAgICB0YWcgPSBDT05TVEFOVFMuVEFHUy5BTExfQ09VUlNFU1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdNeSBUcmFpbmluZ3MnOlxuICAgICAgICAgICAgICAgICAgICB0YWcgPSBDT05TVEFOVFMuVEFHUy5NWV9DT1VSU0VTXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUgJiYgdGFnKSB7XG4gICAgICAgICAgICAgICAgdGhpc1t0aXRsZV0gPSB0aGlzW3RpdGxlXSB8fCByaW90Lm1vdW50KG5vZGUsIHRhZylbMF07XG4gICAgICAgICAgICAgICAgdGhpc1t0aXRsZV0udXBkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIE1ldGFNYXAuZXJyb3IoZSlcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy9SaW90IGJpbmRpbmdzXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICBfLmVhY2godGhpcy50YWJzLCAodmFsLCBpKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRUYWJsZSh2YWwudGl0bGUsIGkpXG4gICAgICAgIH0pXG4gICAgfSlcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IE5Qcm9ncmVzcyA9IHdpbmRvdy5OUHJvZ3Jlc3M7XG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicG9ydGxldC1ib2R5XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdyBtYXJnaW4tYm90dG9tLTMwXCI+XG5cdFx0XHRcdFx0XHQ8ZGl2IGlmPVwieyBoZWFkZXIgfVwiIGNsYXNzPVwiY29sLW1kLTZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+eyBoZWFkZXIudGl0bGUgfTwvaDE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxuXHRcdFx0XHRcdFx0XHQ8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIG1hcmdpbi10b3AtMTAgbWFyZ2luLWJvdHRvbS0xMFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxsaSBlYWNoPVwieyBhcmVhcyB9XCI+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XG5cdFx0XHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdFx0PC91bD5cblx0XHRcdFx0XHRcdFx0PCEtLSBCbG9ja3F1b3RlcyAtLT5cblx0XHRcdFx0XHRcdFx0PGJsb2NrcXVvdGUgY2xhc3M9XCJoZXJvXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHA+eyBxdW90ZS50ZXh0IH08L3A+XG5cdFx0XHRcdFx0XHRcdFx0PHNtYWxsPnsgcXVvdGUuYnkgfTwvc21hbGw+XG5cdFx0XHRcdFx0XHRcdDwvYmxvY2txdW90ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWRkdGhpc19ob3Jpem9udGFsX2ZvbGxvd190b29sYm94XCI+PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3MgPVwiY29sLW1kLTZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlmcmFtZSBpZj1cInsgaGVhZGVyLnlvdXR1YmVpZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJ5dHBsYXllclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0L2h0bWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9XCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC97IGhlYWRlci55b3V0dWJlaWQgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcyA9XCJmaXR2aWRzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJoZWlnaHQ6IDMyN3B4OyB3aWR0aDogMTAwJTsgZGlzcGxheTogYmxvY2s7IG1hcmdpbi1sZWZ0OiBhdXRvOyBtYXJnaW4tcmlnaHQ6IGF1dG87IGJyb2RlcjogMDtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG5cdFx0XHRcdFx0XHRcdDwvaWZyYW1lPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkbGluZVwiPlxuXHRcdFx0XHRcdFx0PGgzPnsgdXNlck5hbWUgfXsgdmlzaW9uLnRpdGxlIH08L2gzPlxuXHRcdFx0XHRcdDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyB2aXNpb24udGV4dCB9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ2hvbWUnLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICBjb25zdCBNZXRhTWFwID0gcmVxdWlyZSgnLi4vLi4vLi4vTWV0YU1hcCcpO1xuXG4gICAgdGhpcy5hcmVhcyA9IFtdXG4gICAgdGhpcy5oZWFkZXIgPSB7fVxuXG4gICAgTWV0YU1hcC5NZXRhRmlyZS5vbihDT05TVEFOVFMuUk9VVEVTLkhPTUUsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuYXJlYXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLmFyZWFzLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgIHZhciBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gaW5jbHVkZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucXVvdGUgPSBkYXRhLnF1b3RlO1xuICAgICAgICB0aGlzLmhlYWRlciA9IGRhdGEuaGVhZGVyO1xuICAgICAgICB0aGlzLnZpc2lvbiA9IGRhdGEudmlzaW9uO1xuXG4gICAgICAgIHRoaXMudXNlck5hbWUgPSBNZXRhTWFwLlVzZXIuZnVsbE5hbWU7XG5cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnZGF0YXRhYmxlcycpXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcblxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcbmNvbnN0IFNoYXJlTWFwID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9TaGFyZU1hcCcpXG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGlkPVwibXlfbWFwc19wYWdlXCIgY2xhc3M9XCJwb3J0bGV0IGJveCBncmV5LWNhc2NhZGVcIj5cbiAgICA8ZGl2IGNsYXNzPVwicG9ydGxldC10aXRsZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1pY29uLXRoLWxhcmdlXCI+PC9pPk1ldGFNYXBzXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlmPVwieyBtZW51IH1cIiBjbGFzcz1cImFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxhIGVhY2g9XCJ7IG1lbnUuYnV0dG9ucyB9XCIgaHJlZj1cInsgbGluayB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uQWN0aW9uQ2xpY2sgfVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY29nc1wiPjwvaT4gVG9vbHMgPGkgY2xhc3M9XCJmYSBmYS1hbmdsZS1kb3duXCI+PC9pPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGVhY2g9XCJ7IG1lbnUubWVudSB9XCIgb25jbGljaz1cInsgcGFyZW50Lm9uTWVudUNsaWNrIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ7IGxpbmsgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwieyBpY29uIH1cIj48L2k+IHsgdGl0bGUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInBvcnRsZXQtYm9keVwiPlxuICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnMgcG9ydGxldC10YWJzXCI+XG4gICAgICAgICAgICA8bGkgb25jbGljaz1cInsgcGFyZW50Lm9uVGFiU3dpdGNoIH1cIiBlYWNoPVwieyB2YWwsIGkgaW4gdGFicyB9XCIgY2xhc3M9XCJ7IGFjdGl2ZTogaSA9PSAwIH1cIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI215bWFwc18xX3sgaSB9XCIgZGF0YS10b2dnbGU9XCJ0YWJcIiBhcmlhLWV4cGFuZGVkPVwieyB0cnVlOiBpID09IDAgfVwiPlxuICAgICAgICAgICAgICAgIHsgdmFsLnRpdGxlIH08L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGUtdG9vbGJhclwiPlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgdmFsLCBpIGluIHRhYnMgfVwiIGNsYXNzPVwidGFiLXBhbmUgZmFzZSBpbiB7IGFjdGl2ZTogaSA9PSAwIH1cIiBpZD1cIm15bWFwc18xX3sgaSB9XCI+XG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlclwiIGlkPVwibXltYXBzX3RhYmxlX3sgaSB9XCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJ0YWJsZS1jaGVja2JveFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiZ3JvdXAtY2hlY2thYmxlXCIgZGF0YS1zZXQ9XCIjbXltYXBzX3RhYmxlX3sgaSB9IC5jaGVja2JveGVzXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGVkIE9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT3duZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGlmPVwieyBwYXJlbnQuZGF0YSAmJiBwYXJlbnQuZGF0YVtpXSB9XCIgZWFjaD1cInsgcGFyZW50LmRhdGFbaV0gfVwiIGNsYXNzPVwib2RkIGdyYWRlWFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlmPVwieyB2YWwudGl0bGUgPT0gJ015IE1hcHMnIHx8IHBhcmVudC51c2VyLmlzQWRtaW4gfVwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hlc1wiIHZhbHVlPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc20gYmx1ZSBmaWx0ZXItc3VibWl0XCIgb25jbGljaz1cInsgcGFyZW50Lm9uT3BlbiB9XCI+T3BlbjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBpZj1cInsgdmFsLnRpdGxlID09ICdNeSBNYXBzJyB9XCIgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vblNoYXJlIH1cIj5TaGFyZSA8aSBjbGFzcz1cImZhIGZhLXNoYXJlXCI+PC9pPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaWY9XCJ7IHZhbC50aXRsZSAhPSAnTXkgTWFwcycgfVwiIGNsYXNzPVwiYnRuIGJ0bi1zbSByZWRcIiBvbmNsaWNrPVwieyBwYXJlbnQub25Db3B5IH1cIj5Db3B5IDxpIGNsYXNzPVwiZmEgZmEtY2xvbmVcIj48L2k+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyBlZGl0YWJsZSB9XCIgY2xhc3M9XCJtZXRhX2VkaXRhYmxlX3sgaSB9XCIgZGF0YS1waz1cInsgaWQgfVwiIGRhdGEtdGl0bGU9XCJFZGl0IE1hcCBOYW1lXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgbmFtZSB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7ICFlZGl0YWJsZSB9XCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgbmFtZSB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgY3JlYXRlZF9hdCB9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgaWY9XCJ7IHZhbC50aXRsZSA9PSAnTXkgTWFwcycgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmF3IGNvbnRlbnQ9XCJ7IHBhcmVudC5nZXRTdGF0dXModGhpcykgfVwiPjwvcmF3PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlmPVwieyB2YWwudGl0bGUgIT0gJ015IE1hcHMnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhdyBjb250ZW50PVwieyBwYXJlbnQuZ2V0T3duZXIodGhpcykgfVwiPjwvcmF3PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG48L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ215LW1hcHMnLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcblxuICAgIHRoaXMudXNlciA9IE1ldGFNYXAuVXNlcjtcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICAgIHRoaXMubWVudSA9IG51bGw7XG4gICAgbGV0IHRhYnMgPSBbXG4gICAgICAgIHsgdGl0bGU6ICdNeSBNYXBzJywgb3JkZXI6IDAsIGVkaXRhYmxlOiB0cnVlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQ2hlY2snLCBpc0NoZWNrYm94OiB0cnVlIH0sIHsgbmFtZTogJ0FjdGlvbicgfSwgeyBuYW1lOiAnQ3JlYXRlZCBPbicgfSwgeyBuYW1lOiAnU3RhdHVzJyB9XSB9LFxuICAgICAgICB7IHRpdGxlOiAnU2hhcmVkIHdpdGggTWUnLCBvcmRlcjogMSwgZWRpdGFibGU6IGZhbHNlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdPd25lcicgfV0gfSxcbiAgICAgICAgeyB0aXRsZTogJ1B1YmxpYycsIG9yZGVyOiAyLCBlZGl0YWJsZTogZmFsc2UsIGNvbHVtbnM6IFt7IG5hbWU6ICdBY3Rpb24nIH0sIHsgbmFtZTogJ0NyZWF0ZWQgT24nIH0sIHsgbmFtZTogJ093bmVyJyB9XSB9XG4gICAgXTtcbiAgICBpZiAodGhpcy51c2VyLmlzQWRtaW4pIHtcbiAgICAgICAgdGFicy5wdXNoKHsgdGl0bGU6ICdBbGwgTWFwcycsIG9yZGVyOiAzLCBlZGl0YWJsZTogdHJ1ZSwgY29sdW1uczogW3sgbmFtZTogJ0FjdGlvbicgfSwgeyBuYW1lOiAnQ3JlYXRlZCBPbicgfSwgeyBuYW1lOiAnT3duZXInIH1dIH0pXG4gICAgICAgIHRhYnMucHVzaCh7IHRpdGxlOiAnVGVtcGxhdGVzJywgb3JkZXI6IDQsIGVkaXRhYmxlOiB0cnVlLCBjb2x1bW5zOiBbeyBuYW1lOiAnQWN0aW9uJyB9LCB7IG5hbWU6ICdDcmVhdGVkIE9uJyB9LCB7IG5hbWU6ICdPd25lcicgfV0gfSlcbiAgICB9XG4gICAgdGhpcy50YWJzID0gXy5zb3J0QnkodGFicywgJ29yZGVyJylcblxuICAgIHRoaXMuY3VycmVudFRhYiA9ICdNeSBNYXBzJztcblxuICAgIC8vXG4gICAgdGhpcy5nZXRTdGF0dXMgPSAoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgc3RhdHVzID0gJ1ByaXZhdGUnXG4gICAgICAgIGxldCBjb2RlID0gJ2RlZmF1bHQnXG4gICAgICAgIGxldCBodG1sID0gJyc7XG4gICAgICAgIGlmIChpdGVtLnNoYXJlZF93aXRoKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5zaGFyZWRfd2l0aFsnKiddICYmIChpdGVtLnNoYXJlZF93aXRoWycqJ10ucmVhZCA9PSB0cnVlIHx8IGl0ZW0uc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgIHN0YXR1cyA9ICdQdWJsaWMnXG4gICAgICAgICAgICAgICAgY29kZSA9ICdwcmltYXJ5J1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLmVhY2goaXRlbS5zaGFyZWRfd2l0aCwgKHNoYXJlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoYXJlLnBpY3R1cmUgJiYga2V5ICE9ICcqJyAmJiBrZXkgIT0gJ2FkbWluJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJsYWJlbCBvd25lci1sYWJlbFwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtcGxhY2VtZW50PVwiYm90dG9tXCIgdGl0bGU9XCIke3NoYXJlLm5hbWV9XCI+PGltZyBhbHQ9XCIke3NoYXJlLm5hbWV9XCIgaGVpZ2h0PVwiMzBcIiB3aWR0aD1cIjMwXCIgY2xhc3M9XCJpbWctY2lyY2xlXCIgc3JjPVwiJHtzaGFyZS5waWN0dXJlfVwiPjwvc3Bhbj5gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGlmIChodG1sKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSAnPHNwYW4gY2xhc3M9XCJcIj5TaGFyZWQgd2l0aDogPC9zcGFuPicgKyBodG1sO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBodG1sID0gaHRtbCB8fCBgPHNwYW4gY2xhc3M9XCJsYWJlbCBsYWJlbC1zbSBsYWJlbC0ke2NvZGV9XCI+JHtzdGF0dXN9PC9zcGFuPmBcblxuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICB0aGlzLmdldE93bmVyID0gKGl0ZW0pID0+IHtcbiAgICAgICAgbGV0IGh0bWwgPSBgPHNwYW4gY2xhc3M9XCJsYWJlbCBvd25lci1sYWJlbFwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtcGxhY2VtZW50PVwiYm90dG9tXCIgdGl0bGU9XCIke2l0ZW0ub3duZXIubmFtZX1cIj48aW1nIGFsdD1cIiR7aXRlbS5vd25lci5uYW1lfVwiIGhlaWdodD1cIjMwXCIgd2lkdGg9XCIzMFwiIGNsYXNzPVwiaW1nLWNpcmNsZVwiIHNyYz1cIiR7aXRlbS5vd25lci5waWN0dXJlfVwiPjwvc3Bhbj5gXG4gICAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8vRXZlbnRzXG4gICAgdGhpcy5vbk9wZW4gPSAoZXZlbnQsIC4uLm8pID0+IHtcbiAgICAgICAgTWV0YU1hcC5Sb3V0ZXIudG8oYG1hcC8ke2V2ZW50Lml0ZW0uaWR9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5vblNoYXJlID0gKGV2ZW50LCAuLi5vKSA9PiB7XG4gICAgICAgIGxldCBvcHRzID0ge1xuICAgICAgICAgICAgbWFwOiBldmVudC5pdGVtXG4gICAgICAgIH1cbiAgICAgICAgU2hhcmVNYXAuYWN0KG9wdHMpO1xuICAgIH1cblxuICAgIHRoaXMub25Db3B5ID0gKGV2ZW50LCAuLi5vKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb3B5JylcbiAgICB9XG5cbiAgICB0aGlzLm9uVGFiU3dpdGNoID0gKGV2ZW50LCAuLi5vKSA9PiB7XG4gICAgICAgIHRoaXMuY3VycmVudFRhYiA9IGV2ZW50Lml0ZW0udmFsLnRpdGxlO1xuICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAkKCcub3duZXItbGFiZWwnKS50b29sdGlwKClcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRUYWIpIHtcbiAgICAgICAgICAgIGNhc2UgJ015IE1hcHMnOlxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9uQWN0aW9uQ2xpY2sgPSAoZXZlbnQsIHRhZykgPT4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm9uTWVudUNsaWNrID0gKGV2ZW50LCB0YWcpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRhYiA9PSAnTXkgTWFwcycpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQuaXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlTWFwcyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvRGVsZXRlTWFwLmpzJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXNbYHRhYmxlMGBdLmZpbmQoJy5hY3RpdmUnKS5maW5kKCcubWFwaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goc2VsZWN0ZWQsIChjZWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChjZWxsLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGVNYXBzLmRlbGV0ZUFsbChpZHMsIENPTlNUQU5UUy5QQUdFUy5NWV9NQVBTKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmQgPSB0aGlzW2B0YWJsZTBgXS5maW5kKCd0Ym9keSB0ciAuY2hlY2tib3hlcycpO1xuICAgICAgICAgICAgICAgICAgICBmaW5kLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGpRdWVyeS51bmlmb3JtLnVwZGF0ZShmaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XG5cbiAgICB9KVxuXG4gICAgLy9SaW90IGJpbmRpbmdzXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKCdtZXRhbWFwL215bWFwcycsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWVudSA9IHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogXy5zb3J0QnkoZGF0YS5idXR0b25zLCAnb3JkZXInKSxcbiAgICAgICAgICAgICAgICAgICAgbWVudTogXy5zb3J0QnkoZGF0YS5tZW51LCAnb3JkZXInKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYnVpbGRUYWJsZSA9IChpZHgsIGxpc3QsIGVkaXRhYmxlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaWR4XSA9IGxpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbYHRhYmxlJHtpZHh9YF0pIHtcbiAgICAgICAgICAgICAgICAgICAgJChgLm1ldGFfZWRpdGFibGVfJHtpZHh9YCkuZWRpdGFibGUoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tgZGF0YVRhYmxlJHtpZHh9YF0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdID0gJCh0aGlzW2BteW1hcHNfdGFibGVfJHtpZHh9YF0pO1xuICAgICAgICAgICAgICAgIHRoaXNbYGRhdGFUYWJsZSR7aWR4fWBdID0gdGhpc1tgdGFibGUke2lkeH1gXS5EYXRhVGFibGUoe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVuY29tbWVudCBiZWxvdyBsaW5lKCdkb20nIHBhcmFtZXRlcikgdG8gZml4IHRoZSBkcm9wZG93biBvdmVyZmxvdyBpc3N1ZSBpbiB0aGUgZGF0YXRhYmxlIGNlbGxzLiBUaGUgZGVmYXVsdCBkYXRhdGFibGUgbGF5b3V0XG4gICAgICAgICAgICAgICAgICAgIC8vIHNldHVwIHVzZXMgc2Nyb2xsYWJsZSBkaXYodGFibGUtc2Nyb2xsYWJsZSkgd2l0aCBvdmVyZmxvdzphdXRvIHRvIGVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGwoc2VlOiBhc3NldHMvZ2xvYmFsL3BsdWdpbnMvZGF0YXRhYmxlcy9wbHVnaW5zL2Jvb3RzdHJhcC9kYXRhVGFibGVzLmJvb3RzdHJhcC5qcykuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHdoZW4gZHJvcGRvd25zIHVzZWQgdGhlIHNjcm9sbGFibGUgZGl2IHNob3VsZCBiZSByZW1vdmVkLlxuICAgICAgICAgICAgICAgICAgICAvLydkb20nOiAnPCdyb3cnPCdjb2wtbWQtNiBjb2wtc20tMTInbD48J2NvbC1tZC02IGNvbC1zbS0xMidmPnI+dDwncm93JzwnY29sLW1kLTUgY29sLXNtLTEyJ2k+PCdjb2wtbWQtNyBjb2wtc20tMTIncD4+JyxcbiAgICAgICAgICAgICAgICAgICAgLy8nYlN0YXRlU2F2ZSc6IHRydWUsIC8vIHNhdmUgZGF0YXRhYmxlIHN0YXRlKHBhZ2luYXRpb24sIHNvcnQsIGV0YykgaW4gY29va2llLlxuICAgICAgICAgICAgICAgICAgICAnY29sdW1ucyc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ2hja0J4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyMHB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQ3JlYXRlZCBPbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1N0YXR1cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy90aGlzW2B0YWJsZSR7aWR4fWBdVG9vbHMgPSBuZXcgJC5mbi5kYXRhVGFibGUuVGFibGVUb29scyh0aGlzW2BkYXRhVGFibGUke2lkeH1gXSwge30pO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlV3JhcHBlciA9IHRoaXNbYHRhYmxlJHtpZHh9YF0ucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZChgI215bWFwc18ke2lkeH1fdGFibGVfd3JhcHBlcmApO1xuXG4gICAgICAgICAgICAgICAgdGhpc1tgdGFibGUke2lkeH1gXS5maW5kKCcuZ3JvdXAtY2hlY2thYmxlJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNldCA9IGpRdWVyeSh0aGlzKS5hdHRyKCdkYXRhLXNldCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlZCA9IGpRdWVyeSh0aGlzKS5pcygnOmNoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5KHNldCkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5LnVuaWZvcm0udXBkYXRlKHNldCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzW2B0YWJsZSR7aWR4fWBdLm9uKCdjaGFuZ2UnLCAndGJvZHkgdHIgLmNoZWNrYm94ZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0YWJsZVdyYXBwZXIuZmluZCgnLmRhdGFUYWJsZXNfbGVuZ3RoIHNlbGVjdCcpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wgaW5wdXQteHNtYWxsIGlucHV0LWlubGluZScpOyAvLyBtb2RpZnkgdGFibGUgcGVyIHBhZ2UgZHJvcGRvd25cblxuICAgICAgICAgICAgICAgICQoYC5tZXRhX2VkaXRhYmxlXyR7aWR4fWApLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNldCAmJiB0aGlzLmRhdGFzZXQucGspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuZGF0YXNldC5waztcbiAgICAgICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YShwYXJhbXMubmV3VmFsdWUsIGAke0NPTlNUQU5UUy5ST1VURVMuTUFQU19MSVNUfS8ke2lkfS9uYW1lYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKTtcbiAgICAgICAgICAgICAgICBNZXRhTWFwLmVycm9yKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vRmV0Y2ggQWxsIG1hcHNcbiAgICAgICAgTWV0YU1hcC5NZXRhRmlyZS5nZXRDaGlsZChDT05TVEFOVFMuUk9VVEVTLk1BUFNfTElTVCkub24oJ3ZhbHVlJywgKHZhbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHZhbC52YWwoKTtcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnRhYnMsICh0YWIpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbWFwcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0YWIudGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVGVtcGxhdGVzJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTXkgTWFwcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBzID0gXy5tYXAobGlzdCwgKG9iaiwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5vd25lci51c2VySWQgPT0gTWV0YU1hcC5Vc2VyLnVzZXJJZCkgeyAvL09ubHkgaW5jbHVkZSBteSBvd24gbWFwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnU2hhcmVkIHdpdGggTWUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmoub3duZXIudXNlcklkICE9IE1ldGFNYXAuVXNlci51c2VySWQgJiYgLy9Eb24ndCBpbmNsdWRlIG15IG93biBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aCAmJiAvL0V4Y2x1ZGUgYW55dGhpbmcgdGhhdCBpc24ndCBzaGFyZWQgYXQgYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICghb2JqLnNoYXJlZF93aXRoWycqJ10gfHwgKG9iai5zaGFyZWRfd2l0aFsnKiddLnJlYWQgIT0gdHJ1ZSB8fCBvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSAhPSB0cnVlKSkgJiYgLy9FeGNsdWRlIHB1YmxpYyBtYXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXSAmJiAvL0luY2x1ZGUgc2hhcmVzIHdpaCBteSB1c2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9iai5zaGFyZWRfd2l0aFtNZXRhTWFwLlVzZXIudXNlcklkXS53cml0ZSA9PSB0cnVlIHx8IC8vSW5jbHVkZSBhbnl0aGluZyBJIGNhbiB3cml0ZSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2hhcmVkX3dpdGhbTWV0YU1hcC5Vc2VyLnVzZXJJZF0ucmVhZCA9PSB0cnVlKSAvL0luY2x1ZGUgYW55dGhpbmcgSSBjYW4gcmVhZCBmcm9tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWRpdGFibGUgPSAob2JqLnNoYXJlZF93aXRoW01ldGFNYXAuVXNlci51c2VySWRdLndyaXRlID09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUHVibGljJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcHMgPSBfLm1hcChsaXN0LCAob2JqLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqLm93bmVyLnVzZXJJZCAhPSBNZXRhTWFwLlVzZXIudXNlcklkICYmIC8vRG9uJ3QgaW5jbHVkZSBteSBvd24gbWFwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouc2hhcmVkX3dpdGggJiYgLy9FeGNsdWRlIGFueXRoaW5nIHRoYXQgaXNuJ3Qgc2hhcmVkIGF0IGFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JqLnNoYXJlZF93aXRoWycqJ10gJiYgKG9iai5zaGFyZWRfd2l0aFsnKiddLnJlYWQgPT0gdHJ1ZSB8fCBvYmouc2hhcmVkX3dpdGhbJyonXS53cml0ZSA9PSB0cnVlKSApIC8vSW5jbHVkZSBwdWJsaWMgbWFwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gKG9iai5zaGFyZWRfd2l0aFsnKiddLndyaXRlID09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmNyZWF0ZWRfYXQgPSBtb21lbnQobmV3IERhdGUob2JqLmNyZWF0ZWRfYXQpKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQWxsIE1hcHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlci5pc0FkbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0xpa2UgaXQgc2F5cywgYWxsIG1hcHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmVkaXRhYmxlID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouaWQgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5jcmVhdGVkX2F0ID0gbW9tZW50KG5ldyBEYXRlKG9iai5jcmVhdGVkX2F0KSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1hcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwcyA9IF8uZmlsdGVyKG1hcHMsIChtYXApID0+IHsgcmV0dXJuIG1hcCAmJiBtYXAuaWQgfSlcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRUYWJsZSh0YWIub3JkZXIsIG1hcHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBfLmRlbGF5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKCcub3duZXItbGFiZWwnKS50b29sdGlwKClcbiAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgfSk7XG4gICAgfSk7XG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9jb25zdGFudHMnKTtcblxuY29uc3QgaHRtbCA9IGBcbjxkaXYgY2xhc3M9XCJwb3J0bGV0IGxpZ2h0XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicm93IG1hcmdpbi1ib3R0b20tMzBcIj5cblx0XHRcdFx0XHRcdDxkaXYgaWY9XCJ7IGhlYWRlciB9XCIgY2xhc3M9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDE+eyBoZWFkZXIudGl0bGUgfTwvaDE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+eyBoZWFkZXIudGV4dCB9PC9wPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgZWFjaD1cInsgYXJlYXMgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRsaW5lXCI+XG4gICAgXHRcdFx0XHRcdFx0PGgzPnsgdGl0bGUgfTwvaDM+XG4gICAgXHRcdFx0XHRcdDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57IHRleHQgfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC11bnN0eWxlZCBtYXJnaW4tdG9wLTEwIG1hcmdpbi1ib3R0b20tMTBcIj5cblx0XHRcdFx0XHRcdFx0PGxpIGVhY2g9XCJ7IGl0ZW1zIH1cIj5cblx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cInsgaWNvbiB9XCI+PC9pPiA8Yj57IHRpdGxlIH08L2I+IHsgdGV4dCB9XG5cdFx0XHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdFx0XHQ8L3VsPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cbmA7XG5cbm1vZHVsZS5leHBvcnRzID0gcmlvdC50YWcoJ3Rlcm1zJywgaHRtbCwgZnVuY3Rpb24ob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcbiAgICBcbiAgICB0aGlzLmFyZWFzID0gW11cbiAgICB0aGlzLmhlYWRlciA9IHt9XG5cbiAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuVEVSTVNfQU5EX0NPTkRJVElPTlMsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuYXJlYXMgPSBfLmZpbHRlcihfLnNvcnRCeShkYXRhLnNlY3Rpb25zLCAnb3JkZXInKSwgKGQpID0+IHtcbiAgICAgICAgICAgIGxldCBpbmNsdWRlID0gZC5hcmNoaXZlICE9IHRydWU7XG4gICAgICAgICAgICBpZihpbmNsdWRlKSB7XG4gICAgICAgICAgICAgICAgZC5pdGVtcyA9IF8uZmlsdGVyKF8uc29ydEJ5KGQuaXRlbXMsICdvcmRlcicpLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5jbHVkZTIgPSBkLmFyY2hpdmUgIT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGUyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGU7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5oZWFkZXIgPSBkYXRhLmhlYWRlcjtcbiAgICAgICAgdGhpcy51c2VyTmFtZSA9IE1ldGFNYXAuVXNlci5mdWxsTmFtZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIFxuICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgIH0pO1xufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKVxuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzc1xuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpXG5jb25zdCBWaWRlb1BsYXllciA9IHJlcXVpcmUoJy4uLy4uL3Rvb2xzL1ZpZGVvUGxheWVyJylcbmNvbnN0IFRyYWluaW5nTWl4ID0gcmVxdWlyZSgnLi4vbWl4aW5zL3RyYWluaW5nLW1peCcpXG5cbmNvbnN0IGh0bWwgPSBgXG48ZGl2IGlkPVwidHJhaW5pbmdfcG9ydGxldFwiIGNsYXNzPVwicG9ydGxldCBsaWdodFwiPlxuICAgIDxkaXYgY2xhc3M9XCJwb3J0bGV0LWJvZHlcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBtYXJnaW4tYm90dG9tLTMwXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTggY29sLW1kLW9mZnNldC00XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVtYmVkLXJlc3BvbnNpdmUgZW1iZWQtcmVzcG9uc2l2ZS0xNmJ5OVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwidHJhaW5pbmdfcGxheWVyXCIgPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG5gO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJpb3QudGFnKENPTlNUQU5UUy5UQUdTLlRSQUlOSU5HLCBodG1sLCBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICB0aGlzLm1peGluKFRyYWluaW5nTWl4KVxuXG4gICAgdGhpcy50cmFpbmluZyA9IHt9XG5cbiAgICB0aGlzLm9uKCdtb3VudCB1cGRhdGUnLCAoZXZlbnQsIG9wdHMpID0+IHtcbiAgICAgICAgaWYgKG9wdHMpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gb3B0c1xuICAgICAgICAgICAgdGhpcy5nZXREYXRhKHRoaXMuY29uZmlnLmlkKVxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgVmlkZW9QbGF5ZXIoJ3RyYWluaW5nX3BsYXllcicsIHtoZWlnaHQ6IDM5MCwgd2lkdGg6IDY0MCwgdmlkZW9JZDogJ2RVcVJUV0NkWHQ0J30pXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY29ycmVjdEhlaWdodCA9ICgpID0+IHtcbiAgICAgICAgJCh0aGlzLnRyYWluaW5nX3BvcnRsZXQpLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCAtIDEyMCArICdweCdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvcnJlY3RIZWlnaHQoKTtcbiAgICB9KTtcblxufSk7IiwiY29uc3QgcmlvdCA9IHJlcXVpcmUoJ3Jpb3QnKTtcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuY29uc3QgTlByb2dyZXNzID0gd2luZG93Lk5Qcm9ncmVzcztcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKVxucmVxdWlyZSgnZGF0YXRhYmxlcycpXG5yZXF1aXJlKCdkYXRhdGFibGVzLWJvb3RzdHJhcDMtcGx1Z2luJylcblxuY29uc3QgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vLi4vY29uc3RhbnRzL2NvbnN0YW50cycpO1xuY29uc3QgcmF3ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yYXcnKTtcblxuY29uc3QgaHRtbCA9IGBcbjx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtYm9yZGVyZWQgdGFibGUtaG92ZXJcIiBpZD1cInt0YWJsZUlkfVwiPlxuICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPlxuICAgICAgICAgICAgPHRoIGVhY2g9XCJ7Y29sdW1uc31cIj57bmFtZX08L3RoPlxuICAgICAgICA8L3RyPlxuICAgIDwvdGhlYWQ+XG4gICAgPHRib2R5PlxuICAgICAgICA8dHIgaWY9XCJ7IGRhdGEgfVwiIGVhY2g9XCJ7IGRhdGEgfVwiIGNsYXNzPVwib2RkIGdyYWRlWFwiPlxuICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1zbSByZWRcIiBvbmNsaWNrPVwieyBwYXJlbnQub25TdGFydCB9XCI+U3RhcnQgPGkgY2xhc3M9XCJmYSBmYS1wbGF5XCI+PC9pPjwvYT5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQgY2xhc3M9XCJ7IG1ldGFfZWRpdGFibGU6IHBhcmVudC5lZGl0YWJsZX1cIiBkYXRhLXBrPVwieyBpZCB9XCIgZGF0YS1uYW1lPVwibmFtZVwiIGRhdGEtdGl0bGU9XCJFZGl0IENvdXJzZSBOYW1lXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1wiPnsgbmFtZSB9PC90ZD5cbiAgICAgICAgICAgIDx0ZCBjbGFzcz1cInsgbWV0YV9lZGl0YWJsZTogcGFyZW50LmVkaXRhYmxlfVwiIGRhdGEtcGs9XCJ7IGlkIH1cIiBkYXRhLW5hbWU9XCJkZXNjcmlwdGlvblwiIGRhdGEtdGl0bGU9XCJFZGl0IENvdXJzZSBEZXNjcmlwdGlvblwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj57IGRlc2NyaXB0aW9uIH08L3RkPlxuICAgICAgICA8L3RyPlxuICAgIDwvdGJvZHk+XG48L3RhYmxlPlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZyhDT05TVEFOVFMuVEFHUy5BTExfQ09VUlNFUywgaHRtbCwgZnVuY3Rpb24gKG9wdHMpIHtcblxuICAgIGNvbnN0IE1ldGFNYXAgPSByZXF1aXJlKCcuLi8uLi8uLi9NZXRhTWFwLmpzJyk7XG5cbiAgICB0aGlzLnVzZXIgPSBNZXRhTWFwLlVzZXJcbiAgICB0aGlzLmRhdGEgPSBbXVxuICAgIHRoaXMuZWRpdGFibGUgPSBmYWxzZVxuICAgIHRoaXMudGFibGVJZCA9ICdhbGxfY291cnNlcydcblxuICAgIHRoaXMuY29sdW1ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ0FjdGlvbicsXG4gICAgICAgICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd2lkdGg6ICcxMjBweCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ05hbWUnLFxuICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6ICdEZXNjcmlwdGlvbicsXG4gICAgICAgICAgICBvcmRlcmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgIF1cblxuICAgIC8vRXZlbnRzXG4gICAgdGhpcy5vblN0YXJ0ID0gKGV2ZW50LCAuLi5vKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuUm91dGVyLnRvKGB0cmFpbmluZ3MvJHtldmVudC5pdGVtLmlkfWApO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGRUYWJsZSA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJsZS5maW5kKGAubWV0YV9lZGl0YWJsZWApLmVkaXRhYmxlKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhVGFibGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChbdGhpcy50YWJsZUlkXSkpO1xuICAgICAgICAgICAgdGhpcy5kYXRhVGFibGUgPSB0aGlzLnRhYmxlLkRhdGFUYWJsZSh7XG5cbiAgICAgICAgICAgICAgICAvLyBVbmNvbW1lbnQgYmVsb3cgbGluZSgnZG9tJyBwYXJhbWV0ZXIpIHRvIGZpeCB0aGUgZHJvcGRvd24gb3ZlcmZsb3cgaXNzdWUgaW4gdGhlIGRhdGF0YWJsZSBjZWxscy4gVGhlIGRlZmF1bHQgZGF0YXRhYmxlIGxheW91dFxuICAgICAgICAgICAgICAgIC8vIHNldHVwIHVzZXMgc2Nyb2xsYWJsZSBkaXYodGFibGUtc2Nyb2xsYWJsZSkgd2l0aCBvdmVyZmxvdzphdXRvIHRvIGVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGwoc2VlOiBhc3NldHMvZ2xvYmFsL3BsdWdpbnMvZGF0YXRhYmxlcy9wbHVnaW5zL2Jvb3RzdHJhcC9kYXRhVGFibGVzLmJvb3RzdHJhcC5qcykuXG4gICAgICAgICAgICAgICAgLy8gU28gd2hlbiBkcm9wZG93bnMgdXNlZCB0aGUgc2Nyb2xsYWJsZSBkaXYgc2hvdWxkIGJlIHJlbW92ZWQuXG4gICAgICAgICAgICAgICAgLy8nZG9tJzogJzwncm93JzwnY29sLW1kLTYgY29sLXNtLTEyJ2w+PCdjb2wtbWQtNiBjb2wtc20tMTInZj5yPnQ8J3Jvdyc8J2NvbC1tZC01IGNvbC1zbS0xMidpPjwnY29sLW1kLTcgY29sLXNtLTEyJ3A+PicsXG4gICAgICAgICAgICAgICAgLy8nYlN0YXRlU2F2ZSc6IHRydWUsIC8vIHNhdmUgZGF0YXRhYmxlIHN0YXRlKHBhZ2luYXRpb24sIHNvcnQsIGV0YykgaW4gY29va2llLlxuICAgICAgICAgICAgICAgICdjb2x1bW5zJzogdGhpcy5jb2x1bW5zXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRhYmxlV3JhcHBlciA9IHRoaXMudGFibGUucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZChgIyR7dGhpcy50YWJsZUlkfV90YWJsZV93cmFwcGVyYCk7XG5cbiAgICAgICAgICAgIHRhYmxlV3JhcHBlci5maW5kKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0JykuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCBpbnB1dC14c21hbGwgaW5wdXQtaW5saW5lJyk7IC8vIG1vZGlmeSB0YWJsZSBwZXIgcGFnZSBkcm9wZG93blxuXG4gICAgICAgICAgICAgdGhpcy50YWJsZS5maW5kKGAubWV0YV9lZGl0YWJsZWApLmVkaXRhYmxlKHsgdW5zYXZlZGNsYXNzOiBudWxsIH0pLm9uKCdzYXZlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhc2V0ICYmIHRoaXMuZGF0YXNldC5waykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmRhdGFzZXQucGs7XG4gICAgICAgICAgICAgICAgICAgIE1ldGFNYXAuTWV0YUZpcmUuc2V0RGF0YShwYXJhbXMubmV3VmFsdWUsIGAke0NPTlNUQU5UUy5ST1VURVMuQ09VUlNFX0xJU1R9LyR7aWR9LyR7dGhpcy5kYXRhc2V0Lm5hbWV9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9SaW90IGJpbmRpbmdzXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZWRpdGFibGUgPSB0aGlzLnVzZXIuaXNBZG1pblxuICAgIH0pO1xuXG4gICAgY29uc3Qgb25jZSA9IF8ub25jZSgoKSA9PiB7XG4gICAgICAgIE1ldGFNYXAuTWV0YUZpcmUub24oQ09OU1RBTlRTLlJPVVRFUy5DT1VSU0VfTElTVCwgKGxpc3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZFRhYmxlKDAsIHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pXG5cbiAgICB0aGlzLm9uKCd1cGRhdGUnLCAoKSA9PiB7XG4gICAgICAgIG9uY2UoKVxuICAgIH0pXG59KTsiLCJjb25zdCByaW90ID0gcmVxdWlyZSgncmlvdCcpO1xuY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG5jb25zdCBOUHJvZ3Jlc3MgPSB3aW5kb3cuTlByb2dyZXNzO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5yZXF1aXJlKCdkYXRhdGFibGVzJylcbnJlcXVpcmUoJ2RhdGF0YWJsZXMtYm9vdHN0cmFwMy1wbHVnaW4nKVxuXG5jb25zdCBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJyk7XG5jb25zdCByYXcgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL3JhdycpO1xuXG5jb25zdCBodG1sID0gYFxuPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ib3JkZXJlZCB0YWJsZS1ob3ZlclwiIGlkPVwie3RhYmxlSWR9XCI+XG4gICAgPHRoZWFkPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGggZWFjaD1cIntjb2x1bW5zfVwiPntuYW1lfTwvdGg+XG4gICAgICAgIDwvdHI+XG4gICAgPC90aGVhZD5cbiAgICA8dGJvZHk+XG4gICAgICAgIDx0ciBpZj1cInsgZGF0YSB9XCIgZWFjaD1cInsgZGF0YSB9XCIgY2xhc3M9XCJvZGQgZ3JhZGVYXCI+XG4gICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLXNtIHJlZFwiIG9uY2xpY2s9XCJ7IHBhcmVudC5vblN0YXJ0IH1cIj5Db250aW51ZSA8aSBjbGFzcz1cImZhIGZhLXBsYXlcIj48L2k+PC9hPlxuICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cInZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XCI+eyBuYW1lIH08L3RkPlxuICAgICAgICAgICAgPHRkIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZTtcIj57IGRlc2NyaXB0aW9uIH08L3RkPlxuICAgICAgICA8L3RyPlxuICAgIDwvdGJvZHk+XG48L3RhYmxlPlxuYDtcblxubW9kdWxlLmV4cG9ydHMgPSByaW90LnRhZyhDT05TVEFOVFMuVEFHUy5NWV9DT1VSU0VTLCBodG1sLCBmdW5jdGlvbiAob3B0cykge1xuXG4gICAgY29uc3QgTWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uLy4uL01ldGFNYXAuanMnKTtcblxuICAgIHRoaXMudXNlciA9IE1ldGFNYXAuVXNlclxuICAgIHRoaXMuZGF0YSA9IFtdXG4gICAgdGhpcy5lZGl0YWJsZSA9IGZhbHNlXG4gICAgdGhpcy50YWJsZUlkID0gJ215X2NvdXJzZXMnXG5cbiAgICB0aGlzLmNvbHVtbnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdBY3Rpb24nLFxuICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdpZHRoOiAnMTIwcHgnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcbiAgICAgICAgICAgIG9yZGVyYWJsZTogdHJ1ZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiAnRGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgb3JkZXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICBdXG5cbiAgICAvL0V2ZW50c1xuICAgIHRoaXMub25TdGFydCA9IChldmVudCwgLi4ubykgPT4ge1xuICAgICAgICBNZXRhTWFwLlJvdXRlci50byhgdHJhaW5pbmdzLyR7ZXZlbnQuaXRlbS5pZH1gKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkVGFibGUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy50YWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFibGUuZmluZChgLm1ldGFfZWRpdGFibGVgKS5lZGl0YWJsZSgnZGVzdHJveScpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVRhYmxlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAgICAgdGhpcy50YWJsZSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoW3RoaXMudGFibGVJZF0pKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVRhYmxlID0gdGhpcy50YWJsZS5EYXRhVGFibGUoe1xuXG4gICAgICAgICAgICAgICAgLy8gVW5jb21tZW50IGJlbG93IGxpbmUoJ2RvbScgcGFyYW1ldGVyKSB0byBmaXggdGhlIGRyb3Bkb3duIG92ZXJmbG93IGlzc3VlIGluIHRoZSBkYXRhdGFibGUgY2VsbHMuIFRoZSBkZWZhdWx0IGRhdGF0YWJsZSBsYXlvdXRcbiAgICAgICAgICAgICAgICAvLyBzZXR1cCB1c2VzIHNjcm9sbGFibGUgZGl2KHRhYmxlLXNjcm9sbGFibGUpIHdpdGggb3ZlcmZsb3c6YXV0byB0byBlbmFibGUgdmVydGljYWwgc2Nyb2xsKHNlZTogYXNzZXRzL2dsb2JhbC9wbHVnaW5zL2RhdGF0YWJsZXMvcGx1Z2lucy9ib290c3RyYXAvZGF0YVRhYmxlcy5ib290c3RyYXAuanMpLlxuICAgICAgICAgICAgICAgIC8vIFNvIHdoZW4gZHJvcGRvd25zIHVzZWQgdGhlIHNjcm9sbGFibGUgZGl2IHNob3VsZCBiZSByZW1vdmVkLlxuICAgICAgICAgICAgICAgIC8vJ2RvbSc6ICc8J3Jvdyc8J2NvbC1tZC02IGNvbC1zbS0xMidsPjwnY29sLW1kLTYgY29sLXNtLTEyJ2Y+cj50PCdyb3cnPCdjb2wtbWQtNSBjb2wtc20tMTInaT48J2NvbC1tZC03IGNvbC1zbS0xMidwPj4nLFxuICAgICAgICAgICAgICAgIC8vJ2JTdGF0ZVNhdmUnOiB0cnVlLCAvLyBzYXZlIGRhdGF0YWJsZSBzdGF0ZShwYWdpbmF0aW9uLCBzb3J0LCBldGMpIGluIGNvb2tpZS5cbiAgICAgICAgICAgICAgICAnY29sdW1ucyc6IHRoaXMuY29sdW1uc1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0YWJsZVdyYXBwZXIgPSB0aGlzLnRhYmxlLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoYCMke3RoaXMudGFibGVJZH1fdGFibGVfd3JhcHBlcmApO1xuXG4gICAgICAgICAgICB0YWJsZVdyYXBwZXIuZmluZCgnLmRhdGFUYWJsZXNfbGVuZ3RoIHNlbGVjdCcpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wgaW5wdXQteHNtYWxsIGlucHV0LWlubGluZScpOyAvLyBtb2RpZnkgdGFibGUgcGVyIHBhZ2UgZHJvcGRvd25cblxuICAgICAgICAgICAgIHRoaXMudGFibGUuZmluZChgLm1ldGFfZWRpdGFibGVgKS5lZGl0YWJsZSh7IHVuc2F2ZWRjbGFzczogbnVsbCB9KS5vbignc2F2ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNldCAmJiB0aGlzLmRhdGFzZXQucGspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kYXRhc2V0LnBrO1xuICAgICAgICAgICAgICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLnNldERhdGEocGFyYW1zLm5ld1ZhbHVlLCBgJHtDT05TVEFOVFMuUk9VVEVTLkNPVVJTRV9MSVNUfS8ke2lkfS9uYW1lYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgTlByb2dyZXNzLmRvbmUoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9SaW90IGJpbmRpbmdzXG4gICAgdGhpcy5vbignbW91bnQnLCAoKSA9PiB7XG5cbiAgICB9KTtcblxuICAgIGNvbnN0IG9uY2UgPSBfLm9uY2UoKCkgPT4ge1xuICAgICAgICBNZXRhTWFwLk1ldGFGaXJlLm9uKENPTlNUQU5UUy5ST1VURVMuVFJBSU5JTkdTLmZvcm1hdCh0aGlzLnVzZXIudXNlcklkKSwgKGxpc3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IF8ubWFwKGxpc3QsIChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIG9iai5pZCA9IGtleTtcbiAgICAgICAgICAgICAgICBvYmouY3JlYXRlZF9hdCA9IG1vbWVudChuZXcgRGF0ZShvYmouY3JlYXRlZF9hdCkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgICAgICAgIHRoaXMuYnVpbGRUYWJsZSgwLCB0aGlzLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBkYXRlJywgKCkgPT4ge1xuICAgICAgICBvbmNlKClcbiAgICB9KVxuXG59KTsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jylcbi8qKlxuRGVtbyBzY3JpcHQgdG8gaGFuZGxlIHRoZSB0aGVtZSBkZW1vXG4qKi9cbnZhciBEZW1vID0gZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gSGFuZGxlIFRoZW1lIFNldHRpbmdzXG4gICAgdmFyIGhhbmRsZVRoZW1lID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBwYW5lbCA9ICQoJy50aGVtZS1wYW5lbCcpO1xuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtYm94ZWQnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICQoJy5sYXlvdXQtb3B0aW9uJywgcGFuZWwpLnZhbChcImZsdWlkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnLnNpZGViYXItb3B0aW9uJywgcGFuZWwpLnZhbChcImRlZmF1bHRcIik7XG4gICAgICAgICQoJy5wYWdlLWhlYWRlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZml4ZWRcIik7XG4gICAgICAgICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXBvcy1vcHRpb24nKS5hdHRyKFwiZGlzYWJsZWRcIikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbChNZXRyb25pYy5pc1JUTCgpID8gJ3JpZ2h0JyA6ICdsZWZ0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2hhbmRsZSB0aGVtZSBsYXlvdXRcbiAgICAgICAgdmFyIHJlc2V0TGF5b3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLlxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWJveGVkXCIpLlxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpLlxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKS5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLXJldmVyc2VkXCIpO1xuXG4gICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgPiAucGFnZS1oZWFkZXItaW5uZXInKS5yZW1vdmVDbGFzcyhcImNvbnRhaW5lclwiKTtcblxuICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWNvbnRhaW5lcicpLnBhcmVudChcIi5jb250YWluZXJcIikuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtY29udGFpbmVyJykuaW5zZXJ0QWZ0ZXIoJ2JvZHkgPiAuY2xlYXJmaXgnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCQoJy5wYWdlLWZvb3RlciA+IC5jb250YWluZXInKS5zaXplKCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1mb290ZXInKS5odG1sKCQoJy5wYWdlLWZvb3RlciA+IC5jb250YWluZXInKS5odG1sKCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcucGFnZS1mb290ZXInKS5wYXJlbnQoXCIuY29udGFpbmVyXCIpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLWZvb3RlcicpLmluc2VydEFmdGVyKCcucGFnZS1jb250YWluZXInKTtcbiAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmluc2VydEFmdGVyKCcucGFnZS1mb290ZXInKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJChcIi50b3AtbWVudSA+IC5uYXZiYXItbmF2ID4gbGkuZHJvcGRvd25cIikucmVtb3ZlQ2xhc3MoXCJkcm9wZG93bi1kYXJrXCIpO1xuXG4gICAgICAgICAgICAkKCdib2R5ID4gLmNvbnRhaW5lcicpLnJlbW92ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBsYXN0U2VsZWN0ZWRMYXlvdXQgPSAnJztcblxuICAgICAgICB2YXIgc2V0TGF5b3V0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgbGF5b3V0T3B0aW9uID0gJCgnLmxheW91dC1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhck9wdGlvbiA9ICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBoZWFkZXJPcHRpb24gPSAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIGZvb3Rlck9wdGlvbiA9ICQoJy5wYWdlLWZvb3Rlci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhclBvc09wdGlvbiA9ICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhclN0eWxlT3B0aW9uID0gJCgnLnNpZGViYXItc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJNZW51T3B0aW9uID0gJCgnLnNpZGViYXItbWVudS1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgaGVhZGVyVG9wRHJvcGRvd25TdHlsZSA9ICQoJy5wYWdlLWhlYWRlci10b3AtZHJvcGRvd24tc3R5bGUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuXG5cbiAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09IFwiZml4ZWRcIiAmJiBoZWFkZXJPcHRpb24gPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnRGVmYXVsdCBIZWFkZXIgd2l0aCBGaXhlZCBTaWRlYmFyIG9wdGlvbiBpcyBub3Qgc3VwcG9ydGVkLiBQcm9jZWVkIHdpdGggRml4ZWQgSGVhZGVyIHdpdGggRml4ZWQgU2lkZWJhci4nKTtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXItb3B0aW9uJywgcGFuZWwpLnZhbChcImZpeGVkXCIpO1xuICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgICAgICAgICBzaWRlYmFyT3B0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgICAgICBoZWFkZXJPcHRpb24gPSAnZml4ZWQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNldExheW91dCgpOyAvLyByZXNldCBsYXlvdXQgdG8gZGVmYXVsdCBzdGF0ZVxuXG4gICAgICAgICAgICBpZiAobGF5b3V0T3B0aW9uID09PSBcImJveGVkXCIpIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWJveGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGhlYWRlclxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciA+IC5wYWdlLWhlYWRlci1pbm5lcicpLmFkZENsYXNzKFwiY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIHZhciBjb250ID0gJCgnYm9keSA+IC5jbGVhcmZpeCcpLmFmdGVyKCc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgY29udGVudFxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWNvbnRhaW5lcicpLmFwcGVuZFRvKCdib2R5ID4gLmNvbnRhaW5lcicpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2V0IGZvb3RlclxuICAgICAgICAgICAgICAgIGlmIChmb290ZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuaHRtbCgnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPicgKyAkKCcucGFnZS1mb290ZXInKS5odG1sKCkgKyAnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyJykuYXBwZW5kVG8oJ2JvZHkgPiAuY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGFzdFNlbGVjdGVkTGF5b3V0ICE9IGxheW91dE9wdGlvbikge1xuICAgICAgICAgICAgICAgIC8vbGF5b3V0IGNoYW5nZWQsIHJ1biByZXNwb25zaXZlIGhhbmRsZXI6XG4gICAgICAgICAgICAgICAgTWV0cm9uaWMucnVuUmVzaXplSGFuZGxlcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RTZWxlY3RlZExheW91dCA9IGxheW91dE9wdGlvbjtcblxuICAgICAgICAgICAgLy9oZWFkZXJcbiAgICAgICAgICAgIGlmIChoZWFkZXJPcHRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKTtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2UtaGVhZGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2YmFyLXN0YXRpYy10b3BcIikuYWRkQ2xhc3MoXCJuYXZiYXItZml4ZWQtdG9wXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKTtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2UtaGVhZGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2YmFyLWZpeGVkLXRvcFwiKS5hZGRDbGFzcyhcIm5hdmJhci1zdGF0aWMtdG9wXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NpZGViYXJcbiAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoJ3BhZ2UtZnVsbC13aWR0aCcpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyT3B0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1maXhlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWRlZmF1bHRcIik7XG4gICAgICAgICAgICAgICAgICAgIExheW91dC5pbml0Rml4ZWRTaWRlYmFySG92ZXJFZmZlY3QoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWRlZmF1bHRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCJwYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWZpeGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKS51bmJpbmQoJ21vdXNlZW50ZXInKS51bmJpbmQoJ21vdXNlbGVhdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRvcCBkcm9wZG93biBzdHlsZVxuICAgICAgICAgICAgaWYgKGhlYWRlclRvcERyb3Bkb3duU3R5bGUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgICQoXCIudG9wLW1lbnUgPiAubmF2YmFyLW5hdiA+IGxpLmRyb3Bkb3duXCIpLmFkZENsYXNzKFwiZHJvcGRvd24tZGFya1wiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcIi50b3AtbWVudSA+IC5uYXZiYXItbmF2ID4gbGkuZHJvcGRvd25cIikucmVtb3ZlQ2xhc3MoXCJkcm9wZG93bi1kYXJrXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2Zvb3RlclxuICAgICAgICAgICAgaWYgKGZvb3Rlck9wdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2UtZm9vdGVyLWZpeGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zaWRlYmFyIHN0eWxlXG4gICAgICAgICAgICBpZiAoc2lkZWJhclN0eWxlT3B0aW9uID09PSAnY29tcGFjdCcpIHtcbiAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY29tcGFjdFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNvbXBhY3RcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vc2lkZWJhciBtZW51XG4gICAgICAgICAgICBpZiAoc2lkZWJhck1lbnVPcHRpb24gPT09ICdob3ZlcicpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2lkZWJhck9wdGlvbiA9PSAnZml4ZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbChcImFjY29yZGlvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJIb3ZlciBTaWRlYmFyIE1lbnUgaXMgbm90IGNvbXBhdGlibGUgd2l0aCBGaXhlZCBTaWRlYmFyIE1vZGUuIFNlbGVjdCBEZWZhdWx0IFNpZGViYXIgTW9kZSBJbnN0ZWFkLlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnBhZ2Utc2lkZWJhci1tZW51XCIpLmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtaG92ZXItc3VibWVudVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoXCIucGFnZS1zaWRlYmFyLW1lbnVcIikucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3NpZGViYXIgcG9zaXRpb25cbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5pc1JUTCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNpZGViYXJQb3NPcHRpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAncmlnaHQnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdsZWZ0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyUG9zT3B0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcyhcInBhZ2Utc2lkZWJhci1yZXZlcnNlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Zyb250ZW5kLWxpbmsnKS50b29sdGlwKCdkZXN0cm95JykudG9vbHRpcCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdsZWZ0J1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkucmVtb3ZlQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmcm9udGVuZC1saW5rJykudG9vbHRpcCgnZGVzdHJveScpLnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAncmlnaHQnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgTGF5b3V0LmZpeENvbnRlbnRIZWlnaHQoKTsgLy8gZml4IGNvbnRlbnQgaGVpZ2h0XG4gICAgICAgICAgICBMYXlvdXQuaW5pdEZpeGVkU2lkZWJhcigpOyAvLyByZWluaXRpYWxpemUgZml4ZWQgc2lkZWJhclxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGhhbmRsZSB0aGVtZSBjb2xvcnNcbiAgICAgICAgdmFyIHNldENvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgICAgICB2YXIgY29sb3JfID0gKE1ldHJvbmljLmlzUlRMKCkgPyBjb2xvciArICctcnRsJyA6IGNvbG9yKTtcbiAgICAgICAgICAgICQoJyNzdHlsZV9jb2xvcicpLmF0dHIoXCJocmVmXCIsIExheW91dC5nZXRMYXlvdXRDc3NQYXRoKCkgKyAndGhlbWVzLycgKyBjb2xvcl8gKyBcIi5jc3NcIik7XG4gICAgICAgIH07XG5cblxuICAgICAgICAkKCcudGhlbWUtY29sb3JzID4gbGknLCBwYW5lbCkuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbG9yID0gJCh0aGlzKS5hdHRyKFwiZGF0YS10aGVtZVwiKTtcbiAgICAgICAgICAgIHNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgICQoJ3VsID4gbGknLCBwYW5lbCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXG4gICAgICAgICAgICBpZiAoY29sb3IgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlLWFjdGlvbnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdyZWQtaGF6ZScpLmFkZENsYXNzKCdidG4tZGVmYXVsdCBidG4tdHJhbnNwYXJlbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtYWN0aW9ucyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2J0bi1kZWZhdWx0IGJ0bi10cmFuc3BhcmVudCcpLmFkZENsYXNzKCdyZWQtaGF6ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzZXQgZGVmYXVsdCB0aGVtZSBvcHRpb25zOlxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWJveGVkXCIpKSB7XG4gICAgICAgICAgICAkKCcubGF5b3V0LW9wdGlvbicsIHBhbmVsKS52YWwoXCJib3hlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItZml4ZWRcIikpIHtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWhlYWRlci1maXhlZFwiKSkge1xuICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLWZvb3Rlci1maXhlZFwiKSkge1xuICAgICAgICAgICAgJCgnLnBhZ2UtZm9vdGVyLW9wdGlvbicsIHBhbmVsKS52YWwoXCJmaXhlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItcmV2ZXJzZWRcIikpIHtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXBvcy1vcHRpb24nLCBwYW5lbCkudmFsKFwicmlnaHRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWxpZ2h0XCIpKSB7XG4gICAgICAgICAgICAkKCcuc2lkZWJhci1zdHlsZS1vcHRpb24nLCBwYW5lbCkudmFsKFwibGlnaHRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJChcIi5wYWdlLXNpZGViYXItbWVudVwiKS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWhvdmVyLXN1Ym1lbnVcIikpIHtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbChcImhvdmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNpZGViYXJPcHRpb24gPSAkKCcuc2lkZWJhci1vcHRpb24nLCBwYW5lbCkudmFsKCk7XG4gICAgICAgICAgICB2YXIgaGVhZGVyT3B0aW9uID0gJCgnLnBhZ2UtaGVhZGVyLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBmb290ZXJPcHRpb24gPSAkKCcucGFnZS1mb290ZXItb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJQb3NPcHRpb24gPSAkKCcuc2lkZWJhci1wb3Mtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHNpZGViYXJTdHlsZU9wdGlvbiA9ICQoJy5zaWRlYmFyLXN0eWxlLW9wdGlvbicsIHBhbmVsKS52YWwoKTtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyTWVudU9wdGlvbiA9ICQoJy5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLnZhbCgpO1xuXG4gICAgICAgICQoJy5sYXlvdXQtb3B0aW9uLCAucGFnZS1oZWFkZXItdG9wLWRyb3Bkb3duLXN0eWxlLW9wdGlvbiwgLnBhZ2UtaGVhZGVyLW9wdGlvbiwgLnNpZGViYXItb3B0aW9uLCAucGFnZS1mb290ZXItb3B0aW9uLCAuc2lkZWJhci1wb3Mtb3B0aW9uLCAuc2lkZWJhci1zdHlsZS1vcHRpb24sIC5zaWRlYmFyLW1lbnUtb3B0aW9uJywgcGFuZWwpLmNoYW5nZShzZXRMYXlvdXQpO1xuICAgIH07XG5cbiAgICAvLyBoYW5kbGUgdGhlbWUgc3R5bGVcbiAgICB2YXIgc2V0VGhlbWVTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgICAgIHZhciBmaWxlID0gKHN0eWxlID09PSAncm91bmRlZCcgPyAnY29tcG9uZW50cy1yb3VuZGVkJyA6ICdjb21wb25lbnRzJyk7XG4gICAgICAgIGZpbGUgPSAoTWV0cm9uaWMuaXNSVEwoKSA/IGZpbGUgKyAnLXJ0bCcgOiBmaWxlKTtcblxuICAgICAgICAkKCcjc3R5bGVfY29tcG9uZW50cycpLmF0dHIoXCJocmVmXCIsIE1ldHJvbmljLmdldEdsb2JhbENzc1BhdGgoKSArIGZpbGUgKyBcIi5jc3NcIik7XG5cbiAgICAgICAgaWYgKCQuY29va2llKSB7XG4gICAgICAgICAgICAkLmNvb2tpZSgnbGF5b3V0LXN0eWxlLW9wdGlvbicsIHN0eWxlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8vbWFpbiBmdW5jdGlvbiB0byBpbml0aWF0ZSB0aGUgdGhlbWVcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBoYW5kbGVzIHN0eWxlIGN1c3RvbWVyIHRvb2xcbiAgICAgICAgICAgIGhhbmRsZVRoZW1lKCk7XG5cbiAgICAgICAgICAgIC8vIGhhbmRsZSBsYXlvdXQgc3R5bGUgY2hhbmdlXG4gICAgICAgICAgICAkKCcudGhlbWUtcGFuZWwgLmxheW91dC1zdHlsZS1vcHRpb24nKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgIHNldFRoZW1lU3R5bGUoJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2V0IGxheW91dCBzdHlsZSBmcm9tIGNvb2tpZVxuICAgICAgICAgICAgaWYgKCQuY29va2llICYmICQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykgPT09ICdyb3VuZGVkJykge1xuICAgICAgICAgICAgICAgIHNldFRoZW1lU3R5bGUoJC5jb29raWUoJ2xheW91dC1zdHlsZS1vcHRpb24nKSk7XG4gICAgICAgICAgICAgICAgJCgnLnRoZW1lLXBhbmVsIC5sYXlvdXQtc3R5bGUtb3B0aW9uJykudmFsKCQuY29va2llKCdsYXlvdXQtc3R5bGUtb3B0aW9uJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxufSAoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZW1vIiwiY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpXG5jb25zdCBNZXRyb25pYyA9IHJlcXVpcmUoJy4vbWV0cm9uaWMnKVxuLyoqXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcbioqL1xudmFyIExheW91dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGxheW91dEltZ1BhdGggPSAnYWRtaW4vbGF5b3V0NC9pbWcvJztcblxuICAgIHZhciBsYXlvdXRDc3NQYXRoID0gJ2FkbWluL2xheW91dDQvY3NzLyc7XG5cbiAgICB2YXIgcmVzQnJlYWtwb2ludE1kID0gTWV0cm9uaWMuZ2V0UmVzcG9uc2l2ZUJyZWFrcG9pbnQoJ21kJyk7XG5cbiAgICAvLyogQkVHSU46Q09SRSBIQU5ETEVSUyAqLy9cbiAgICAvLyB0aGlzIGZ1bmN0aW9uIGhhbmRsZXMgcmVzcG9uc2l2ZSBsYXlvdXQgb24gc2NyZWVuIHNpemUgcmVzaXplIG9yIG1vYmlsZSBkZXZpY2Ugcm90YXRlLlxuXG5cbiAgICAvLyBIYW5kbGUgc2lkZWJhciBtZW51IGxpbmtzXG4gICAgdmFyIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluayA9IGZ1bmN0aW9uKG1vZGUsIGVsKSB7XG4gICAgICAgIHZhciB1cmwgPSBsb2NhdGlvbi5oYXNoLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgdmFyIG1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcblxuICAgICAgICBpZiAobW9kZSA9PT0gJ2NsaWNrJyB8fCBtb2RlID09PSAnc2V0Jykge1xuICAgICAgICAgICAgZWwgPSAkKGVsKTtcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnbWF0Y2gnKSB7XG4gICAgICAgICAgICBtZW51LmZpbmQoXCJsaSA+IGFcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9ICQodGhpcykuYXR0cihcImhyZWZcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAvLyB1cmwgbWF0Y2ggY29uZGl0aW9uXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID4gMSAmJiB1cmwuc3Vic3RyKDEsIHBhdGgubGVuZ3RoIC0gMSkgPT0gcGF0aC5zdWJzdHIoMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWVsIHx8IGVsLnNpemUoKSA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWwuYXR0cignaHJlZicpLnRvTG93ZXJDYXNlKCkgPT09ICdqYXZhc2NyaXB0OjsnIHx8IGVsLmF0dHIoJ2hyZWYnKS50b0xvd2VyQ2FzZSgpID09PSAnIycpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzbGlkZVNwZWVkID0gcGFyc2VJbnQobWVudS5kYXRhKFwic2xpZGUtc3BlZWRcIikpO1xuICAgICAgICB2YXIga2VlcEV4cGFuZCA9IG1lbnUuZGF0YShcImtlZXAtZXhwYW5kZWRcIik7XG5cbiAgICAgICAgLy8gZGlzYWJsZSBhY3RpdmUgc3RhdGVzXG4gICAgICAgIG1lbnUuZmluZCgnbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBtZW51LmZpbmQoJ2xpID4gYSA+IC5zZWxlY3RlZCcpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChtZW51Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51JykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtZW51LmZpbmQoJ2xpLm9wZW4nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuY2hpbGRyZW4oJy5zdWItbWVudScpLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnPiBhID4gLmFycm93Lm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgIG1lbnUuZmluZCgnbGkub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBlbC5wYXJlbnRzKCdsaScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJz4gYSA+IHNwYW4uYXJyb3cnKS5hZGRDbGFzcygnb3BlbicpO1xuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnQoJ3VsLnBhZ2Utc2lkZWJhci1tZW51Jykuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+IGEnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwic2VsZWN0ZWRcIj48L3NwYW4+Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmNoaWxkcmVuKCd1bC5zdWItbWVudScpLnNpemUoKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1vZGUgPT09ICdjbGljaycpIHtcbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoIDwgcmVzQnJlYWtwb2ludE1kICYmICQoJy5wYWdlLXNpZGViYXInKS5oYXNDbGFzcyhcImluXCIpKSB7IC8vIGNsb3NlIHRoZSBtZW51IG9uIG1vYmlsZSB2aWV3IHdoaWxlIGxhb2RpbmcgYSBwYWdlXG4gICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBzaWRlYmFyIG1lbnVcbiAgICB2YXIgaGFuZGxlU2lkZWJhck1lbnUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICdsaSA+IGEnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoID49IHJlc0JyZWFrcG9pbnRNZCAmJiAkKHRoaXMpLnBhcmVudHMoJy5wYWdlLXNpZGViYXItbWVudS1ob3Zlci1zdWJtZW51Jykuc2l6ZSgpID09PSAxKSB7IC8vIGV4aXQgb2YgaG92ZXIgc2lkZWJhciBtZW51XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCkuaGFzQ2xhc3MoJ3N1Yi1tZW51JykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtaGVhZGVyIC5yZXNwb25zaXZlLXRvZ2dsZXInKS5jbGljaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKHRoaXMpLm5leHQoKS5oYXNDbGFzcygnc3ViLW1lbnUgYWx3YXlzLW9wZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhcmVudCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCk7XG4gICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XG4gICAgICAgICAgICB2YXIgc3ViID0gJCh0aGlzKS5uZXh0KCk7XG5cbiAgICAgICAgICAgIHZhciBhdXRvU2Nyb2xsID0gbWVudS5kYXRhKFwiYXV0by1zY3JvbGxcIik7XG4gICAgICAgICAgICB2YXIgc2xpZGVTcGVlZCA9IHBhcnNlSW50KG1lbnUuZGF0YShcInNsaWRlLXNwZWVkXCIpKTtcbiAgICAgICAgICAgIHZhciBrZWVwRXhwYW5kID0gbWVudS5kYXRhKFwia2VlcC1leHBhbmRlZFwiKTtcblxuICAgICAgICAgICAgaWYgKGtlZXBFeHBhbmQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4oJ2xpLm9wZW4nKS5jaGlsZHJlbignYScpLmNoaWxkcmVuKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbignbGkub3BlbicpLmNoaWxkcmVuKCcuc3ViLW1lbnU6bm90KC5hbHdheXMtb3BlbiknKS5zbGlkZVVwKHNsaWRlU3BlZWQpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5jaGlsZHJlbignbGkub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzbGlkZU9mZmVzZXQgPSAtMjAwO1xuXG4gICAgICAgICAgICBpZiAoc3ViLmlzKFwiOnZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICAkKCcuYXJyb3cnLCAkKHRoaXMpKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgICAgICAgICAgc3ViLnNsaWRlVXAoc2xpZGVTcGVlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvU2Nyb2xsID09PSB0cnVlICYmICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51LnNsaW1TY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2Nyb2xsVG8nOiAodGhlLnBvc2l0aW9uKCkpLnRvcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbyh0aGUsIHNsaWRlT2ZmZXNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmFycm93JywgJCh0aGlzKSkuYWRkQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIHN1Yi5zbGlkZURvd24oc2xpZGVTcGVlZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdXRvU2Nyb2xsID09PSB0cnVlICYmICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51LnNsaW1TY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2Nyb2xsVG8nOiAodGhlLnBvc2l0aW9uKCkpLnRvcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbyh0aGUsIHNsaWRlT2ZmZXNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgYWpheCBsaW5rcyB3aXRoaW4gc2lkZWJhciBtZW51XG4gICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignY2xpY2snLCAnIGxpID4gYS5hamF4aWZ5JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgTWV0cm9uaWMuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xuICAgICAgICAgICAgdmFyIG1lbnVDb250YWluZXIgPSAkKCcucGFnZS1zaWRlYmFyIHVsJyk7XG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSAkKCcucGFnZS1jb250ZW50Jyk7XG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnRCb2R5ID0gJCgnLnBhZ2UtY29udGVudCAucGFnZS1jb250ZW50LWJvZHknKTtcblxuICAgICAgICAgICAgbWVudUNvbnRhaW5lci5jaGlsZHJlbignbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgbWVudUNvbnRhaW5lci5jaGlsZHJlbignYXJyb3cub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnbGknKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICQodGhpcykuY2hpbGRyZW4oJ2EgPiBzcGFuLmFycm93JykuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgaWYgKE1ldHJvbmljLmdldFZpZXdQb3J0KCkud2lkdGggPCByZXNCcmVha3BvaW50TWQgJiYgJCgnLnBhZ2Utc2lkZWJhcicpLmhhc0NsYXNzKFwiaW5cIikpIHsgLy8gY2xvc2UgdGhlIG1lbnUgb24gbW9iaWxlIHZpZXcgd2hpbGUgbGFvZGluZyBhIHBhZ2VcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1oZWFkZXIgLnJlc3BvbnNpdmUtdG9nZ2xlcicpLmNsaWNrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIE1ldHJvbmljLnN0YXJ0UGFnZUxvYWRpbmcoKTtcblxuICAgICAgICAgICAgdmFyIHRoZSA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGUucGFyZW50cygnbGkub3BlbicpLnNpemUoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2Utc2lkZWJhci1tZW51ID4gbGkub3BlbiA+IGEnKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VDb250ZW50Qm9keS5odG1sKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIExheW91dC5maXhDb250ZW50SGVpZ2h0KCk7IC8vIGZpeCBjb250ZW50IGhlaWdodFxuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5pbml0QWpheCgpOyAvLyBpbml0aWFsaXplIGNvcmUgc3R1ZmZcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIGFqYXhPcHRpb25zLCB0aHJvd25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy5zdG9wUGFnZUxvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwoJzxoND5Db3VsZCBub3QgbG9hZCB0aGUgcmVxdWVzdGVkIGNvbnRlbnQuPC9oND4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIGFqYXggbGluayB3aXRoaW4gbWFpbiBjb250ZW50XG4gICAgICAgICQoJy5wYWdlLWNvbnRlbnQnKS5vbignY2xpY2snLCAnLmFqYXhpZnknLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUb3AoKTtcblxuICAgICAgICAgICAgdmFyIHVybCA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSAkKCcucGFnZS1jb250ZW50Jyk7XG4gICAgICAgICAgICB2YXIgcGFnZUNvbnRlbnRCb2R5ID0gJCgnLnBhZ2UtY29udGVudCAucGFnZS1jb250ZW50LWJvZHknKTtcblxuICAgICAgICAgICAgTWV0cm9uaWMuc3RhcnRQYWdlTG9hZGluZygpO1xuXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuZ2V0Vmlld1BvcnQoKS53aWR0aCA8IHJlc0JyZWFrcG9pbnRNZCAmJiAkKCcucGFnZS1zaWRlYmFyJykuaGFzQ2xhc3MoXCJpblwiKSkgeyAvLyBjbG9zZSB0aGUgbWVudSBvbiBtb2JpbGUgdmlldyB3aGlsZSBsYW9kaW5nIGEgcGFnZVxuICAgICAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAucmVzcG9uc2l2ZS10b2dnbGVyJykuY2xpY2soKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnN0b3BQYWdlTG9hZGluZygpO1xuICAgICAgICAgICAgICAgICAgICBwYWdlQ29udGVudEJvZHkuaHRtbChyZXMpO1xuICAgICAgICAgICAgICAgICAgICBMYXlvdXQuZml4Q29udGVudEhlaWdodCgpOyAvLyBmaXggY29udGVudCBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuaW5pdEFqYXgoKTsgLy8gaW5pdGlhbGl6ZSBjb3JlIHN0dWZmXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBhamF4T3B0aW9ucywgdGhyb3duRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZUNvbnRlbnRCb2R5Lmh0bWwoJzxoND5Db3VsZCBub3QgbG9hZCB0aGUgcmVxdWVzdGVkIGNvbnRlbnQuPC9oND4nKTtcbiAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMuc3RvcFBhZ2VMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBzY3JvbGxpbmcgdG8gdG9wIG9uIHJlc3BvbnNpdmUgbWVudSB0b2dnbGVyIGNsaWNrIHdoZW4gaGVhZGVyIGlzIGZpeGVkIGZvciBtb2JpbGUgdmlld1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnBhZ2UtaGVhZGVyLWZpeGVkLW1vYmlsZSAucmVzcG9uc2l2ZS10b2dnbGVyJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvcCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBzaWRlYmFyIGhlaWdodCBmb3IgZml4ZWQgc2lkZWJhciBsYXlvdXQuXG4gICAgdmFyIF9jYWxjdWxhdGVGaXhlZFNpZGViYXJWaWV3cG9ydEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2lkZWJhckhlaWdodCA9IE1ldHJvbmljLmdldFZpZXdQb3J0KCkuaGVpZ2h0IC0gJCgnLnBhZ2UtaGVhZGVyJykub3V0ZXJIZWlnaHQoKSAtIDMwO1xuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1mb290ZXItZml4ZWRcIikpIHtcbiAgICAgICAgICAgIHNpZGViYXJIZWlnaHQgPSBzaWRlYmFySGVpZ2h0IC0gJCgnLnBhZ2UtZm9vdGVyJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaWRlYmFySGVpZ2h0O1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIGZpeGVkIHNpZGViYXJcbiAgICB2YXIgaGFuZGxlRml4ZWRTaWRlYmFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZW51ID0gJCgnLnBhZ2Utc2lkZWJhci1tZW51Jyk7XG5cbiAgICAgICAgTWV0cm9uaWMuZGVzdHJveVNsaW1TY3JvbGwobWVudSk7XG5cbiAgICAgICAgaWYgKCQoJy5wYWdlLXNpZGViYXItZml4ZWQnKS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNZXRyb25pYy5nZXRWaWV3UG9ydCgpLndpZHRoID49IHJlc0JyZWFrcG9pbnRNZCkge1xuICAgICAgICAgICAgbWVudS5hdHRyKFwiZGF0YS1oZWlnaHRcIiwgX2NhbGN1bGF0ZUZpeGVkU2lkZWJhclZpZXdwb3J0SGVpZ2h0KCkpO1xuICAgICAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwobWVudSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBzaWRlYmFyIHRvZ2dsZXIgdG8gY2xvc2UvaGlkZSB0aGUgc2lkZWJhci5cbiAgICB2YXIgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBib2R5ID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpO1xuICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICQoJy5wYWdlLXNpZGViYXInKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcygncGFnZS1zaWRlYmFyLWNsb3NlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnBhZ2Utc2lkZWJhci1tZW51JykucmVtb3ZlQ2xhc3MoJ3BhZ2Utc2lkZWJhci1tZW51LWNsb3NlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKCdwYWdlLXNpZGViYXItY2xvc2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcucGFnZS1zaWRlYmFyLW1lbnUnKS5hZGRDbGFzcygncGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gSGFubGVzIHNpZGViYXIgdG9nZ2xlclxuICAgIHZhciBoYW5kbGVTaWRlYmFyVG9nZ2xlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYm9keSA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKTtcblxuICAgICAgICAvLyBoYW5kbGUgc2lkZWJhciBzaG93L2hpZGVcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcuc2lkZWJhci10b2dnbGVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIHNpZGViYXIgPSAkKCcucGFnZS1zaWRlYmFyJyk7XG4gICAgICAgICAgICB2YXIgc2lkZWJhck1lbnUgPSAkKCcucGFnZS1zaWRlYmFyLW1lbnUnKTtcbiAgICAgICAgICAgICQoXCIuc2lkZWJhci1zZWFyY2hcIiwgc2lkZWJhcikucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuXG4gICAgICAgICAgICBpZiAoYm9keS5oYXNDbGFzcyhcInBhZ2Utc2lkZWJhci1jbG9zZWRcIikpIHtcbiAgICAgICAgICAgICAgICBib2R5LnJlbW92ZUNsYXNzKFwicGFnZS1zaWRlYmFyLWNsb3NlZFwiKTtcbiAgICAgICAgICAgICAgICBzaWRlYmFyTWVudS5yZW1vdmVDbGFzcyhcInBhZ2Utc2lkZWJhci1tZW51LWNsb3NlZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoJC5jb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ3NpZGViYXJfY2xvc2VkJywgJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJvZHkuYWRkQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpO1xuICAgICAgICAgICAgICAgIHNpZGViYXJNZW51LmFkZENsYXNzKFwicGFnZS1zaWRlYmFyLW1lbnUtY2xvc2VkXCIpO1xuICAgICAgICAgICAgICAgIGlmIChib2R5Lmhhc0NsYXNzKFwicGFnZS1zaWRlYmFyLWZpeGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXJNZW51LnRyaWdnZXIoXCJtb3VzZWxlYXZlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJC5jb29raWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ3NpZGViYXJfY2xvc2VkJywgJzEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFySG92ZXJFZmZlY3QoKTtcblxuICAgICAgICAvLyBoYW5kbGUgdGhlIHNlYXJjaCBiYXIgY2xvc2VcbiAgICAgICAgJCgnLnBhZ2Utc2lkZWJhcicpLm9uKCdjbGljaycsICcuc2lkZWJhci1zZWFyY2ggLnJlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggcXVlcnkgc3VibWl0IG9uIGVudGVyIHByZXNzXG4gICAgICAgICQoJy5wYWdlLXNpZGViYXIgLnNpZGViYXItc2VhcmNoJykub24oJ2tleXByZXNzJywgJ2lucHV0LmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLzwtLS0tIEFkZCB0aGlzIGxpbmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaGFuZGxlIHRoZSBzZWFyY2ggc3VibWl0KGZvciBzaWRlYmFyIHNlYXJjaCBhbmQgcmVzcG9uc2l2ZSBtb2RlIG9mIHRoZSBoZWFkZXIgc2VhcmNoKVxuICAgICAgICAkKCcuc2lkZWJhci1zZWFyY2ggLnN1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmICgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuaGFzQ2xhc3MoXCJwYWdlLXNpZGViYXItY2xvc2VkXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXNlYXJjaCcpLmhhc0NsYXNzKCdvcGVuJykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcucGFnZS1zaWRlYmFyLWZpeGVkJykuc2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1zaWRlYmFyIC5zaWRlYmFyLXRvZ2dsZXInKS5jbGljaygpOyAvL3RyaWdnZXIgc2lkZWJhciB0b2dnbGUgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuYWRkQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCcpLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykuc3VibWl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBjbG9zZSBvbiBib2R5IGNsaWNrXG4gICAgICAgIGlmICgkKCcuc2lkZWJhci1zZWFyY2gnKS5zaXplKCkgIT09IDApIHtcbiAgICAgICAgICAgICQoJy5zaWRlYmFyLXNlYXJjaCAuaW5wdXQtZ3JvdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJy5zaWRlYmFyLXNlYXJjaCcpLmhhc0NsYXNzKCdvcGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNpZGViYXItc2VhcmNoJykucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgdGhlIGhvcml6b250YWwgbWVudVxuICAgIHZhciBoYW5kbGVIZWFkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gaGFuZGxlIHNlYXJjaCBib3ggZXhwYW5kL2NvbGxhcHNlXG4gICAgICAgICQoJy5wYWdlLWhlYWRlcicpLm9uKCdjbGljaycsICcuc2VhcmNoLWZvcm0nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmZvcm0tY29udHJvbCcpLmZvY3VzKCk7XG5cbiAgICAgICAgICAgICQoJy5wYWdlLWhlYWRlciAuc2VhcmNoLWZvcm0gLmZvcm0tY29udHJvbCcpLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNlYXJjaC1mb3JtJykucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgICAgICQodGhpcykudW5iaW5kKFwiYmx1clwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoYW5kbGUgaG9yIG1lbnUgc2VhcmNoIGZvcm0gb24gZW50ZXIgcHJlc3NcbiAgICAgICAgJCgnLnBhZ2UtaGVhZGVyJykub24oJ2tleXByZXNzJywgJy5ob3ItbWVudSAuc2VhcmNoLWZvcm0gLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBoZWFkZXIgc2VhcmNoIGJ1dHRvbiBjbGlja1xuICAgICAgICAkKCcucGFnZS1oZWFkZXInKS5vbignbW91c2Vkb3duJywgJy5zZWFyY2gtZm9ybS5vcGVuIC5zdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2VhcmNoLWZvcm0nKS5zdWJtaXQoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgdGhlIGdvIHRvIHRvcCBidXR0b24gYXQgdGhlIGZvb3RlclxuICAgIHZhciBoYW5kbGVHb1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gMzAwO1xuICAgICAgICB2YXIgZHVyYXRpb24gPSA1MDA7XG5cbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZXxpUGFkfGlQb2QvaSkpIHsgLy8gaW9zIHN1cHBvcnRlZFxuICAgICAgICAgICAgJCh3aW5kb3cpLmJpbmQoXCJ0b3VjaGVuZCB0b3VjaGNhbmNlbCB0b3VjaGxlYXZlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVJbihkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlT3V0KGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHsgLy8gZ2VuZXJhbFxuICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IG9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2Nyb2xsLXRvLXRvcCcpLmZhZGVJbihkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNjcm9sbC10by10b3AnKS5mYWRlT3V0KGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5zY3JvbGwtdG8tdG9wJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxuICAgICAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vKiBFTkQ6Q09SRSBIQU5ETEVSUyAqLy9cblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLy8gTWFpbiBpbml0IG1ldGhvZHMgdG8gaW5pdGlhbGl6ZSB0aGUgbGF5b3V0XG4gICAgICAgIC8vIElNUE9SVEFOVCEhITogRG8gbm90IG1vZGlmeSB0aGUgY29yZSBoYW5kbGVycyBjYWxsIG9yZGVyLlxuXG4gICAgICAgIGluaXRIZWFkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlSGVhZGVyKCk7IC8vIGhhbmRsZXMgaG9yaXpvbnRhbCBtZW51XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2lkZWJhck1lbnVBY3RpdmVMaW5rOiBmdW5jdGlvbihtb2RlLCBlbCkge1xuICAgICAgICAgICAgaGFuZGxlU2lkZWJhck1lbnVBY3RpdmVMaW5rKG1vZGUsIGVsKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0U2lkZWJhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL2xheW91dCBoYW5kbGVyc1xuICAgICAgICAgICAgaGFuZGxlRml4ZWRTaWRlYmFyKCk7IC8vIGhhbmRsZXMgZml4ZWQgc2lkZWJhciBtZW51XG4gICAgICAgICAgICBoYW5kbGVTaWRlYmFyTWVudSgpOyAvLyBoYW5kbGVzIG1haW4gbWVudVxuICAgICAgICAgICAgaGFuZGxlU2lkZWJhclRvZ2dsZXIoKTsgLy8gaGFuZGxlcyBzaWRlYmFyIGhpZGUvc2hvd1xuXG4gICAgICAgICAgICBpZiAoTWV0cm9uaWMuaXNBbmd1bGFySnNBcHAoKSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZVNpZGViYXJNZW51QWN0aXZlTGluaygnbWF0Y2gnKTsgLy8gaW5pdCBzaWRlYmFyIGFjdGl2ZSBsaW5rc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBNZXRyb25pYy5hZGRSZXNpemVIYW5kbGVyKGhhbmRsZUZpeGVkU2lkZWJhcik7IC8vIHJlaW5pdGlhbGl6ZSBmaXhlZCBzaWRlYmFyIG9uIHdpbmRvdyByZXNpemVcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0Q29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEZvb3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVHb1RvcCgpOyAvL2hhbmRsZXMgc2Nyb2xsIHRvIHRvcCBmdW5jdGlvbmFsaXR5IGluIHRoZSBmb290ZXJcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNpZGViYXIoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdENvbnRlbnQoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEZvb3RlcigpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGZpeCB0aGUgc2lkZWJhciBhbmQgY29udGVudCBoZWlnaHQgYWNjb3JkaW5nbHlcbiAgICAgICAgZml4Q29udGVudEhlaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEZpeGVkU2lkZWJhckhvdmVyRWZmZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZUZpeGVkU2lkZWJhckhvdmVyRWZmZWN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdEZpeGVkU2lkZWJhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoYW5kbGVGaXhlZFNpZGViYXIoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRMYXlvdXRJbWdQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBNZXRyb25pYy5nZXRBc3NldHNQYXRoKCkgKyBsYXlvdXRJbWdQYXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldExheW91dENzc1BhdGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIE1ldHJvbmljLmdldEFzc2V0c1BhdGgoKSArIGxheW91dENzc1BhdGg7XG4gICAgICAgIH1cbiAgICB9O1xuXG59ICgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDsiLCJjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5JylcblxuLyoqXG5Db3JlIHNjcmlwdCB0byBoYW5kbGUgdGhlIGVudGlyZSB0aGVtZSBhbmQgY29yZSBmdW5jdGlvbnNcbioqL1xudmFyIE1ldHJvbmljID0gZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBJRSBtb2RlXG4gICAgdmFyIGlzUlRMID0gZmFsc2U7XG4gICAgdmFyIGlzSUU4ID0gZmFsc2U7XG4gICAgdmFyIGlzSUU5ID0gZmFsc2U7XG4gICAgdmFyIGlzSUUxMCA9IGZhbHNlO1xuXG4gICAgdmFyIHJlc2l6ZUhhbmRsZXJzID0gW107XG5cbiAgICB2YXIgYXNzZXRzUGF0aCA9ICcuLi8uLi9hc3NldHMvJztcblxuICAgIHZhciBnbG9iYWxJbWdQYXRoID0gJ2dsb2JhbC9pbWcvJztcblxuICAgIHZhciBnbG9iYWxQbHVnaW5zUGF0aCA9ICdnbG9iYWwvcGx1Z2lucy8nO1xuXG4gICAgdmFyIGdsb2JhbENzc1BhdGggPSAnZ2xvYmFsL2Nzcy8nO1xuXG4gICAgLy8gdGhlbWUgbGF5b3V0IGNvbG9yIHNldFxuXG4gICAgdmFyIGJyYW5kQ29sb3JzID0ge1xuICAgICAgICAnYmx1ZSc6ICcjODlDNEY0JyxcbiAgICAgICAgJ3JlZCc6ICcjRjM1NjVEJyxcbiAgICAgICAgJ2dyZWVuJzogJyMxYmJjOWInLFxuICAgICAgICAncHVycGxlJzogJyM5YjU5YjYnLFxuICAgICAgICAnZ3JleSc6ICcjOTVhNWE2JyxcbiAgICAgICAgJ3llbGxvdyc6ICcjRjhDQjAwJ1xuICAgIH07XG5cbiAgICAvLyBpbml0aWFsaXplcyBtYWluIHNldHRpbmdzXG4gICAgdmFyIGhhbmRsZUluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmNzcygnZGlyZWN0aW9uJykgPT09ICdydGwnKSB7XG4gICAgICAgICAgICBpc1JUTCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpc0lFOCA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTVNJRSA4LjAvKTtcbiAgICAgICAgaXNJRTkgPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUgOS4wLyk7XG4gICAgICAgIGlzSUUxMCA9ICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTVNJRSAxMC4wLyk7XG5cbiAgICAgICAgaWYgKGlzSUUxMCkge1xuICAgICAgICAgICAgJCgnaHRtbCcpLmFkZENsYXNzKCdpZTEwJyk7IC8vIGRldGVjdCBJRTEwIHZlcnNpb25cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0lFMTAgfHwgaXNJRTkgfHwgaXNJRTgpIHtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnaWUnKTsgLy8gZGV0ZWN0IElFMTAgdmVyc2lvblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIHJ1bnMgY2FsbGJhY2sgZnVuY3Rpb25zIHNldCBieSBNZXRyb25pYy5hZGRSZXNwb25zaXZlSGFuZGxlcigpLlxuICAgIHZhciBfcnVuUmVzaXplSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gcmVpbml0aWFsaXplIG90aGVyIHN1YnNjcmliZWQgZWxlbWVudHNcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNpemVIYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVhY2ggPSByZXNpemVIYW5kbGVyc1tpXTtcbiAgICAgICAgICAgIGVhY2guY2FsbCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGhhbmRsZSB0aGUgbGF5b3V0IHJlaW5pdGlhbGl6YXRpb24gb24gd2luZG93IHJlc2l6ZVxuICAgIHZhciBoYW5kbGVPblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVzaXplO1xuICAgICAgICBpZiAoaXNJRTgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyaGVpZ2h0O1xuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmhlaWdodCA9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy9xdWl0ZSBldmVudCBzaW5jZSBvbmx5IGJvZHkgcmVzaXplZCBub3Qgd2luZG93LlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNpemUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfcnVuUmVzaXplSGFuZGxlcnMoKTtcbiAgICAgICAgICAgICAgICB9LCA1MCk7IC8vIHdhaXQgNTBtcyB1bnRpbCB3aW5kb3cgcmVzaXplIGZpbmlzaGVzLlxuICAgICAgICAgICAgICAgIGN1cnJoZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyBzdG9yZSBsYXN0IGJvZHkgY2xpZW50IGhlaWdodFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2l6ZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIF9ydW5SZXNpemVIYW5kbGVycygpO1xuICAgICAgICAgICAgICAgIH0sIDUwKTsgLy8gd2FpdCA1MG1zIHVudGlsIHdpbmRvdyByZXNpemUgZmluaXNoZXMuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHBvcnRsZXQgdG9vbHMgJiBhY3Rpb25zXG4gICAgdmFyIGhhbmRsZVBvcnRsZXRUb29scyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBoYW5kbGUgcG9ydGxldCByZW1vdmVcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gYS5yZW1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgcG9ydGxldCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpO1xuXG4gICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpKSB7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlIC5mdWxsc2NyZWVuJykudG9vbHRpcCgnZGVzdHJveScpO1xuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5yZWxvYWQnKS50b29sdGlwKCdkZXN0cm95Jyk7XG4gICAgICAgICAgICBwb3J0bGV0LmZpbmQoJy5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbW92ZScpLnRvb2x0aXAoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgIHBvcnRsZXQuZmluZCgnLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29uZmlnJykudG9vbHRpcCgnZGVzdHJveScpO1xuICAgICAgICAgICAgcG9ydGxldC5maW5kKCcucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb2xsYXBzZSwgLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5leHBhbmQnKS50b29sdGlwKCdkZXN0cm95Jyk7XG5cbiAgICAgICAgICAgIHBvcnRsZXQucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBwb3J0bGV0IGZ1bGxzY3JlZW5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlIC5mdWxsc2NyZWVuJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHBvcnRsZXQgPSAkKHRoaXMpLmNsb3Nlc3QoXCIucG9ydGxldFwiKTtcbiAgICAgICAgICAgIGlmIChwb3J0bGV0Lmhhc0NsYXNzKCdwb3J0bGV0LWZ1bGxzY3JlZW4nKSkge1xuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29uJyk7XG4gICAgICAgICAgICAgICAgcG9ydGxldC5yZW1vdmVDbGFzcygncG9ydGxldC1mdWxsc2NyZWVuJyk7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLnJlbW92ZUNsYXNzKCdwYWdlLXBvcnRsZXQtZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBNZXRyb25pYy5nZXRWaWV3UG9ydCgpLmhlaWdodCAtXG4gICAgICAgICAgICAgICAgICAgIHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LXRpdGxlJykub3V0ZXJIZWlnaHQoKSAtXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHBvcnRsZXQuY2hpbGRyZW4oJy5wb3J0bGV0LWJvZHknKS5jc3MoJ3BhZGRpbmctdG9wJykpIC1cbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQocG9ydGxldC5jaGlsZHJlbignLnBvcnRsZXQtYm9keScpLmNzcygncGFkZGluZy1ib3R0b20nKSk7XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdvbicpO1xuICAgICAgICAgICAgICAgIHBvcnRsZXQuYWRkQ2xhc3MoJ3BvcnRsZXQtZnVsbHNjcmVlbicpO1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5hZGRDbGFzcygncGFnZS1wb3J0bGV0LWZ1bGxzY3JlZW4nKTtcbiAgICAgICAgICAgICAgICBwb3J0bGV0LmNoaWxkcmVuKCcucG9ydGxldC1ib2R5JykuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiBhLnJlbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpLmNoaWxkcmVuKFwiLnBvcnRsZXQtYm9keVwiKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXVybFwiKTtcbiAgICAgICAgICAgIHZhciBlcnJvciA9ICQodGhpcykuYXR0cihcImRhdGEtZXJyb3ItZGlzcGxheVwiKTtcbiAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICBNZXRyb25pYy5ibG9ja1VJKHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBlbCxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNvbG9yOiAnbm9uZSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWV0cm9uaWMudW5ibG9ja1VJKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmh0bWwocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgYWpheE9wdGlvbnMsIHRocm93bkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBNZXRyb25pYy51bmJsb2NrVUkoZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9ICdFcnJvciBvbiByZWxvYWRpbmcgdGhlIGNvbnRlbnQuIFBsZWFzZSBjaGVjayB5b3VyIGNvbm5lY3Rpb24gYW5kIHRyeSBhZ2Fpbi4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yID09IFwidG9hc3RyXCIgJiYgdG9hc3RyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yID09IFwibm90aWZpYzhcIiAmJiAkLm5vdGlmaWM4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5ub3RpZmljOCgnemluZGV4JywgMTE1MDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQubm90aWZpYzgobXNnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiAncnVieScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpZmU6IDMwMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQobXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBmb3IgZGVtbyBwdXJwb3NlXG4gICAgICAgICAgICAgICAgTWV0cm9uaWMuYmxvY2tVSSh7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogZWwsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb2xvcjogJ25vbmUnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIE1ldHJvbmljLnVuYmxvY2tVSShlbCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGxvYWQgYWpheCBkYXRhIG9uIHBhZ2UgaW5pdFxuICAgICAgICAkKCcucG9ydGxldCAucG9ydGxldC10aXRsZSBhLnJlbG9hZFtkYXRhLWxvYWQ9XCJ0cnVlXCJdJykuY2xpY2soKTtcblxuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2NsaWNrJywgJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLmV4cGFuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcykuY2xvc2VzdChcIi5wb3J0bGV0XCIpLmNoaWxkcmVuKFwiLnBvcnRsZXQtYm9keVwiKTtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY29sbGFwc2VcIikpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiY29sbGFwc2VcIikuYWRkQ2xhc3MoXCJleHBhbmRcIik7XG4gICAgICAgICAgICAgICAgZWwuc2xpZGVVcCgyMDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiZXhwYW5kXCIpLmFkZENsYXNzKFwiY29sbGFwc2VcIik7XG4gICAgICAgICAgICAgICAgZWwuc2xpZGVEb3duKDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIGN1c3RvbSBjaGVja2JveGVzICYgcmFkaW9zIHVzaW5nIGpRdWVyeSBVbmlmb3JtIHBsdWdpblxuICAgIHZhciBoYW5kbGVVbmlmb3JtID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgpLnVuaWZvcm0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGVzdCA9ICQoXCJpbnB1dFt0eXBlPWNoZWNrYm94XTpub3QoLnRvZ2dsZSwgLm1kLWNoZWNrLCAubWQtcmFkaW9idG4sIC5tYWtlLXN3aXRjaCwgLmljaGVjayksIGlucHV0W3R5cGU9cmFkaW9dOm5vdCgudG9nZ2xlLCAubWQtY2hlY2ssIC5tZC1yYWRpb2J0biwgLnN0YXIsIC5tYWtlLXN3aXRjaCwgLmljaGVjaylcIik7XG4gICAgICAgIGlmICh0ZXN0LnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgIHRlc3QuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKFwiLmNoZWNrZXJcIikuc2l6ZSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnVuaWZvcm0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzbWF0ZXJpYWwgZGVzaWduIGNoZWNrYm94ZXNcbiAgICB2YXIgaGFuZGxlTWF0ZXJpYWxEZXNpZ24gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBNYXRlcmlhbCBkZXNpZ24gY2tlY2tib3ggYW5kIHJhZGlvIGVmZmVjdHNcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcubWQtY2hlY2tib3ggPiBsYWJlbCwgLm1kLXJhZGlvID4gbGFiZWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGUgPSAkKHRoaXMpO1xuICAgICAgICAgICAgLy8gZmluZCB0aGUgZmlyc3Qgc3BhbiB3aGljaCBpcyBvdXIgY2lyY2xlL2J1YmJsZVxuICAgICAgICAgICAgdmFyIGVsID0gJCh0aGlzKS5jaGlsZHJlbignc3BhbjpmaXJzdC1jaGlsZCcpO1xuXG4gICAgICAgICAgICAvLyBhZGQgdGhlIGJ1YmJsZSBjbGFzcyAod2UgZG8gdGhpcyBzbyBpdCBkb2VzbnQgc2hvdyBvbiBwYWdlIGxvYWQpXG4gICAgICAgICAgICBlbC5hZGRDbGFzcygnaW5jJyk7XG5cbiAgICAgICAgICAgIC8vIGNsb25lIGl0XG4gICAgICAgICAgICB2YXIgbmV3b25lID0gZWwuY2xvbmUodHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIGFkZCB0aGUgY2xvbmVkIHZlcnNpb24gYmVmb3JlIG91ciBvcmlnaW5hbFxuICAgICAgICAgICAgZWwuYmVmb3JlKG5ld29uZSk7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgb3JpZ2luYWwgc28gdGhhdCBpdCBpcyByZWFkeSB0byBydW4gb24gbmV4dCBjbGlja1xuICAgICAgICAgICAgJChcIi5cIiArIGVsLmF0dHIoXCJjbGFzc1wiKSArIFwiOmxhc3RcIiwgdGhlKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1tZCcpKSB7XG4gICAgICAgICAgICAvLyBNYXRlcmlhbCBkZXNpZ24gY2xpY2sgZWZmZWN0XG4gICAgICAgICAgICAvLyBjcmVkaXQgd2hlcmUgY3JlZGl0J3MgZHVlOyBodHRwOi8vdGhlY29kZXBsYXllci5jb20vd2Fsa3Rocm91Z2gvcmlwcGxlLWNsaWNrLWVmZmVjdC1nb29nbGUtbWF0ZXJpYWwtZGVzaWduXG4gICAgICAgICAgICB2YXIgZWxlbWVudCwgY2lyY2xlLCBkLCB4LCB5O1xuICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdhLmJ0biwgYnV0dG9uLmJ0biwgaW5wdXQuYnRuLCBsYWJlbC5idG4nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZihlbGVtZW50LmZpbmQoXCIubWQtY2xpY2stY2lyY2xlXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucHJlcGVuZChcIjxzcGFuIGNsYXNzPSdtZC1jbGljay1jaXJjbGUnPjwvc3Bhbj5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2lyY2xlID0gZWxlbWVudC5maW5kKFwiLm1kLWNsaWNrLWNpcmNsZVwiKTtcbiAgICAgICAgICAgICAgICBjaXJjbGUucmVtb3ZlQ2xhc3MoXCJtZC1jbGljay1hbmltYXRlXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYoIWNpcmNsZS5oZWlnaHQoKSAmJiAhY2lyY2xlLndpZHRoKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IE1hdGgubWF4KGVsZW1lbnQub3V0ZXJXaWR0aCgpLCBlbGVtZW50Lm91dGVySGVpZ2h0KCkpO1xuICAgICAgICAgICAgICAgICAgICBjaXJjbGUuY3NzKHtoZWlnaHQ6IGQsIHdpZHRoOiBkfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeCA9IGUucGFnZVggLSBlbGVtZW50Lm9mZnNldCgpLmxlZnQgLSBjaXJjbGUud2lkdGgoKS8yO1xuICAgICAgICAgICAgICAgIHkgPSBlLnBhZ2VZIC0gZWxlbWVudC5vZmZzZXQoKS50b3AgLSBjaXJjbGUuaGVpZ2h0KCkvMjtcblxuICAgICAgICAgICAgICAgIGNpcmNsZS5jc3Moe3RvcDogeSsncHgnLCBsZWZ0OiB4KydweCd9KS5hZGRDbGFzcyhcIm1kLWNsaWNrLWFuaW1hdGVcIik7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjaXJjbGUucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZsb2F0aW5nIGxhYmVsc1xuICAgICAgICB2YXIgaGFuZGxlSW5wdXQgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgaWYgKGVsLnZhbCgpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBlbC5hZGRDbGFzcygnZWRpdGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNsYXNzKCdlZGl0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbigna2V5ZG93bicsICcuZm9ybS1tZC1mbG9hdGluZy1sYWJlbCAuZm9ybS1jb250cm9sJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaGFuZGxlSW5wdXQoJCh0aGlzKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ2JsdXInLCAnLmZvcm0tbWQtZmxvYXRpbmctbGFiZWwgLmZvcm0tY29udHJvbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGhhbmRsZUlucHV0KCQodGhpcykpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuZm9ybS1tZC1mbG9hdGluZy1sYWJlbCAuZm9ybS1jb250cm9sJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2VkaXRlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGVzIGN1c3RvbSBjaGVja2JveGVzICYgcmFkaW9zIHVzaW5nIGpRdWVyeSBpQ2hlY2sgcGx1Z2luXG4gICAgdmFyIGhhbmRsZWlDaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoKS5pQ2hlY2spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5pY2hlY2snKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNoZWNrYm94Q2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtY2hlY2tib3gnKSA/ICQodGhpcykuYXR0cignZGF0YS1jaGVja2JveCcpIDogJ2ljaGVja2JveF9taW5pbWFsLWdyZXknO1xuICAgICAgICAgICAgdmFyIHJhZGlvQ2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtcmFkaW8nKSA/ICQodGhpcykuYXR0cignZGF0YS1yYWRpbycpIDogJ2lyYWRpb19taW5pbWFsLWdyZXknO1xuXG4gICAgICAgICAgICBpZiAoY2hlY2tib3hDbGFzcy5pbmRleE9mKCdfbGluZScpID4gLTEgfHwgcmFkaW9DbGFzcy5pbmRleE9mKCdfbGluZScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmlDaGVjayh7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94Q2xhc3M6IGNoZWNrYm94Q2xhc3MsXG4gICAgICAgICAgICAgICAgICAgIHJhZGlvQ2xhc3M6IHJhZGlvQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgIGluc2VydDogJzxkaXYgY2xhc3M9XCJpY2hlY2tfbGluZS1pY29uXCI+PC9kaXY+JyArICQodGhpcykuYXR0cihcImRhdGEtbGFiZWxcIilcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pQ2hlY2soe1xuICAgICAgICAgICAgICAgICAgICBjaGVja2JveENsYXNzOiBjaGVja2JveENsYXNzLFxuICAgICAgICAgICAgICAgICAgICByYWRpb0NsYXNzOiByYWRpb0NsYXNzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBzd2l0Y2hlc1xuICAgIHZhciBoYW5kbGVCb290c3RyYXBTd2l0Y2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCEkKCkuYm9vdHN0cmFwU3dpdGNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJCgnLm1ha2Utc3dpdGNoJykuYm9vdHN0cmFwU3dpdGNoKCk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIGNvbmZpcm1hdGlvbnNcbiAgICB2YXIgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJCgpLmNvbmZpcm1hdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1jb25maXJtYXRpb25dJykuY29uZmlybWF0aW9uKHsgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksIGJ0bk9rQ2xhc3M6ICdidG4gYnRuLXNtIGJ0bi1zdWNjZXNzJywgYnRuQ2FuY2VsQ2xhc3M6ICdidG4gYnRuLXNtIGJ0bi1kYW5nZXInfSk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgQWNjb3JkaW9ucy5cbiAgICB2YXIgaGFuZGxlQWNjb3JkaW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkub24oJ3Nob3duLmJzLmNvbGxhcHNlJywgJy5hY2NvcmRpb24uc2Nyb2xsYWJsZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvKCQoZS50YXJnZXQpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIFRhYnMuXG4gICAgdmFyIGhhbmRsZVRhYnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9hY3RpdmF0ZSB0YWIgaWYgdGFiIGlkIHByb3ZpZGVkIGluIHRoZSBVUkxcbiAgICAgICAgaWYgKGxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgICAgIHZhciB0YWJpZCA9IGVuY29kZVVSSShsb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XG4gICAgICAgICAgICAkKCdhW2hyZWY9XCIjJyArIHRhYmlkICsgJ1wiXScpLnBhcmVudHMoJy50YWItcGFuZTpoaWRkZW4nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB0YWJpZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAgICAgICAgICQoJ2FbaHJlZj1cIiMnICsgdGFiaWQgKyAnXCJdJykuY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnYVtocmVmPVwiIycgKyB0YWJpZCArICdcIl0nKS5jbGljaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoKS50YWJkcm9wKSB7XG4gICAgICAgICAgICAkKCcudGFiYmFibGUtdGFiZHJvcCAubmF2LXBpbGxzLCAudGFiYmFibGUtdGFiZHJvcCAubmF2LXRhYnMnKS50YWJkcm9wKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1lbGxpcHNpcy12XCI+PC9pPiZuYnNwOzxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG93blwiPjwvaT4nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBNb2RhbHMuXG4gICAgdmFyIGhhbmRsZU1vZGFscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBmaXggc3RhY2thYmxlIG1vZGFsIGlzc3VlOiB3aGVuIDIgb3IgbW9yZSBtb2RhbHMgb3BlbmVkLCBjbG9zaW5nIG9uZSBvZiBtb2RhbCB3aWxsIHJlbW92ZSAubW9kYWwtb3BlbiBjbGFzcy5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRlLmJzLm1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoJCgnLm1vZGFsOnZpc2libGUnKS5zaXplKCkgPiAxICYmICQoJ2h0bWwnKS5oYXNDbGFzcygnbW9kYWwtb3BlbicpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygnbW9kYWwtb3BlbicpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcubW9kYWw6dmlzaWJsZScpLnNpemUoKSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZpeCBwYWdlIHNjcm9sbGJhcnMgaXNzdWVcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdzaG93LmJzLm1vZGFsJywgJy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJtb2RhbC1zY3JvbGxcIikpIHtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYWRkQ2xhc3MoXCJtb2RhbC1vcGVuLW5vc2Nyb2xsXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmaXggcGFnZSBzY3JvbGxiYXJzIGlzc3VlXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignaGlkZS5icy5tb2RhbCcsICcubW9kYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5yZW1vdmVDbGFzcyhcIm1vZGFsLW9wZW4tbm9zY3JvbGxcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJlbW92ZSBhamF4IGNvbnRlbnQgYW5kIHJlbW92ZSBjYWNoZSBvbiBtb2RhbCBjbG9zZWRcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCAnLm1vZGFsOm5vdCgubW9kYWwtY2FjaGVkKScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlRGF0YSgnYnMubW9kYWwnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZXMgQm9vdHN0cmFwIFRvb2x0aXBzLlxuICAgIHZhciBoYW5kbGVUb29sdGlwcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBnbG9iYWwgdG9vbHRpcHNcbiAgICAgICAgJCgnLnRvb2x0aXBzJykudG9vbHRpcCgpO1xuXG4gICAgICAgIC8vIHBvcnRsZXQgdG9vbHRpcHNcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSAuZnVsbHNjcmVlbicpLnRvb2x0aXAoe1xuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXG4gICAgICAgICAgICB0aXRsZTogJ0Z1bGxzY3JlZW4nXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcucG9ydGxldCA+IC5wb3J0bGV0LXRpdGxlID4gLnRvb2xzID4gLnJlbG9hZCcpLnRvb2x0aXAoe1xuICAgICAgICAgICAgY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JyksXG4gICAgICAgICAgICB0aXRsZTogJ1JlbG9hZCdcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAucmVtb3ZlJykudG9vbHRpcCh7XG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcbiAgICAgICAgICAgIHRpdGxlOiAnUmVtb3ZlJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLnBvcnRsZXQgPiAucG9ydGxldC10aXRsZSA+IC50b29scyA+IC5jb25maWcnKS50b29sdGlwKHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpLFxuICAgICAgICAgICAgdGl0bGU6ICdTZXR0aW5ncydcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuY29sbGFwc2UsIC5wb3J0bGV0ID4gLnBvcnRsZXQtdGl0bGUgPiAudG9vbHMgPiAuZXhwYW5kJykudG9vbHRpcCh7XG4gICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSxcbiAgICAgICAgICAgIHRpdGxlOiAnQ29sbGFwc2UvRXhwYW5kJ1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlcyBCb290c3RyYXAgRHJvcGRvd25zXG4gICAgdmFyIGhhbmRsZURyb3Bkb3ducyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKlxuICAgICAgICAgIEhvbGQgZHJvcGRvd24gb24gY2xpY2tcbiAgICAgICAgKi9cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICcuZHJvcGRvd24tbWVudS5ob2xkLW9uLWNsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBoYW5kbGVBbGVydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdbZGF0YS1jbG9zZT1cImFsZXJ0XCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJy5hbGVydCcpLmhpZGUoKTtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm5vdGUnKS5oaWRlKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5vbignY2xpY2snLCAnW2RhdGEtY2xvc2U9XCJub3RlXCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLmhpZGUoKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLm9uKCdjbGljaycsICdbZGF0YS1yZW1vdmU9XCJub3RlXCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcubm90ZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIEhvd2VyIERyb3Bkb3duc1xuICAgIHZhciBoYW5kbGVEcm9wZG93bkhvdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJ1tkYXRhLWhvdmVyPVwiZHJvcGRvd25cIl0nKS5ub3QoJy5ob3Zlci1pbml0aWFsaXplZCcpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmRyb3Bkb3duSG92ZXIoKTtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyLWluaXRpYWxpemVkJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGV4dGFyZWEgYXV0b3NpemVcbiAgICB2YXIgaGFuZGxlVGV4dGFyZWFBdXRvc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodHlwZW9mKGF1dG9zaXplKSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGF1dG9zaXplKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhLmF1dG9zaXplbWUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGVzIEJvb3RzdHJhcCBQb3BvdmVyc1xuXG4gICAgLy8gbGFzdCBwb3BlcCBwb3BvdmVyXG4gICAgdmFyIGxhc3RQb3BlZFBvcG92ZXI7XG5cbiAgICB2YXIgaGFuZGxlUG9wb3ZlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnBvcG92ZXJzJykucG9wb3ZlcigpO1xuXG4gICAgICAgIC8vIGNsb3NlIGxhc3QgZGlzcGxheWVkIHBvcG92ZXJcblxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMucG9wb3Zlci5kYXRhLWFwaScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChsYXN0UG9wZWRQb3BvdmVyKSB7XG4gICAgICAgICAgICAgICAgbGFzdFBvcGVkUG9wb3Zlci5wb3BvdmVyKCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIHNjcm9sbGFibGUgY29udGVudHMgdXNpbmcgalF1ZXJ5IFNsaW1TY3JvbGwgcGx1Z2luLlxuICAgIHZhciBoYW5kbGVTY3JvbGxlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgTWV0cm9uaWMuaW5pdFNsaW1TY3JvbGwoJy5zY3JvbGxlcicpO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGVzIEltYWdlIFByZXZpZXcgdXNpbmcgalF1ZXJ5IEZhbmN5Ym94IHBsdWdpblxuICAgIHZhciBoYW5kbGVGYW5jeWJveCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIWpRdWVyeS5mYW5jeWJveCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCQoXCIuZmFuY3lib3gtYnV0dG9uXCIpLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgICQoXCIuZmFuY3lib3gtYnV0dG9uXCIpLmZhbmN5Ym94KHtcbiAgICAgICAgICAgICAgICBncm91cEF0dHI6ICdkYXRhLXJlbCcsXG4gICAgICAgICAgICAgICAgcHJldkVmZmVjdDogJ25vbmUnLFxuICAgICAgICAgICAgICAgIG5leHRFZmZlY3Q6ICdub25lJyxcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoZWxwZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5zaWRlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRml4IGlucHV0IHBsYWNlaG9sZGVyIGlzc3VlIGZvciBJRTggYW5kIElFOVxuICAgIHZhciBoYW5kbGVGaXhJbnB1dFBsYWNlaG9sZGVyRm9ySUUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9maXggaHRtbDUgcGxhY2Vob2xkZXIgYXR0cmlidXRlIGZvciBpZTcgJiBpZThcbiAgICAgICAgaWYgKGlzSUU4IHx8IGlzSUU5KSB7IC8vIGllOCAmIGllOVxuICAgICAgICAgICAgLy8gdGhpcyBpcyBodG1sNSBwbGFjZWhvbGRlciBmaXggZm9yIGlucHV0cywgaW5wdXRzIHdpdGggcGxhY2Vob2xkZXItbm8tZml4IGNsYXNzIHdpbGwgYmUgc2tpcHBlZChlLmc6IHdlIG5lZWQgdGhpcyBmb3IgcGFzc3dvcmQgZmllbGRzKVxuICAgICAgICAgICAgJCgnaW5wdXRbcGxhY2Vob2xkZXJdOm5vdCgucGxhY2Vob2xkZXItbm8tZml4KSwgdGV4dGFyZWFbcGxhY2Vob2xkZXJdOm5vdCgucGxhY2Vob2xkZXItbm8tZml4KScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PT0gJycgJiYgaW5wdXQuYXR0cihcInBsYWNlaG9sZGVyXCIpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5hZGRDbGFzcyhcInBsYWNlaG9sZGVyXCIpLnZhbChpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5mb2N1cyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LnZhbCgpID09IGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmJsdXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC52YWwoKSA9PT0gJycgfHwgaW5wdXQudmFsKCkgPT0gaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsKGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgU2VsZWN0MiBEcm9wZG93bnNcbiAgICB2YXIgaGFuZGxlU2VsZWN0MiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCgpLnNlbGVjdDIpIHtcbiAgICAgICAgICAgICQoJy5zZWxlY3QybWUnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJTZWxlY3RcIixcbiAgICAgICAgICAgICAgICBhbGxvd0NsZWFyOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBoYW5kbGUgZ3JvdXAgZWxlbWVudCBoZWlnaHRzXG4gICAgdmFyIGhhbmRsZUhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICQoJ1tkYXRhLWF1dG8taGVpZ2h0XScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBpdGVtcyA9ICQoJ1tkYXRhLWhlaWdodF0nLCBwYXJlbnQpO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDA7XG4gICAgICAgICAgICB2YXIgbW9kZSA9IHBhcmVudC5hdHRyKCdkYXRhLW1vZGUnKTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBwYXJzZUludChwYXJlbnQuYXR0cignZGF0YS1vZmZzZXQnKSA/IHBhcmVudC5hdHRyKCdkYXRhLW9mZnNldCcpIDogMCk7XG5cbiAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1oZWlnaHQnKSA9PSBcImhlaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ21pbi1oZWlnaHQnLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodF8gPSAobW9kZSA9PSAnYmFzZS1oZWlnaHQnID8gJCh0aGlzKS5vdXRlckhlaWdodCgpIDogJCh0aGlzKS5vdXRlckhlaWdodCh0cnVlKSk7XG4gICAgICAgICAgICAgICAgaWYgKGhlaWdodF8gPiBoZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0XztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0ICsgb2Zmc2V0O1xuXG4gICAgICAgICAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtaGVpZ2h0JykgPT0gXCJoZWlnaHRcIikge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnbWluLWhlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8qIEVORDpDT1JFIEhBTkRMRVJTICovL1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgdGhlIHRoZW1lXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9JTVBPUlRBTlQhISE6IERvIG5vdCBtb2RpZnkgdGhlIGNvcmUgaGFuZGxlcnMgY2FsbCBvcmRlci5cblxuICAgICAgICAgICAgLy9Db3JlIGhhbmRsZXJzXG4gICAgICAgICAgICBoYW5kbGVJbml0KCk7IC8vIGluaXRpYWxpemUgY29yZSB2YXJpYWJsZXNcbiAgICAgICAgICAgIGhhbmRsZU9uUmVzaXplKCk7IC8vIHNldCBhbmQgaGFuZGxlIHJlc3BvbnNpdmVcblxuICAgICAgICAgICAgLy9VSSBDb21wb25lbnQgaGFuZGxlcnNcbiAgICAgICAgICAgIGhhbmRsZU1hdGVyaWFsRGVzaWduKCk7IC8vIGhhbmRsZSBtYXRlcmlhbCBkZXNpZ25cbiAgICAgICAgICAgIGhhbmRsZVVuaWZvcm0oKTsgLy8gaGFuZmxlIGN1c3RvbSByYWRpbyAmIGNoZWNrYm94ZXNcbiAgICAgICAgICAgIGhhbmRsZWlDaGVjaygpOyAvLyBoYW5kbGVzIGN1c3RvbSBpY2hlY2sgcmFkaW8gYW5kIGNoZWNrYm94ZXNcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcFN3aXRjaCgpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHN3aXRjaCBwbHVnaW5cbiAgICAgICAgICAgIGhhbmRsZVNjcm9sbGVycygpOyAvLyBoYW5kbGVzIHNsaW0gc2Nyb2xsaW5nIGNvbnRlbnRzXG4gICAgICAgICAgICBoYW5kbGVGYW5jeWJveCgpOyAvLyBoYW5kbGUgZmFuY3kgYm94XG4gICAgICAgICAgICBoYW5kbGVTZWxlY3QyKCk7IC8vIGhhbmRsZSBjdXN0b20gU2VsZWN0MiBkcm9wZG93bnNcbiAgICAgICAgICAgIGhhbmRsZVBvcnRsZXRUb29scygpOyAvLyBoYW5kbGVzIHBvcnRsZXQgYWN0aW9uIGJhciBmdW5jdGlvbmFsaXR5KHJlZnJlc2gsIGNvbmZpZ3VyZSwgdG9nZ2xlLCByZW1vdmUpXG4gICAgICAgICAgICBoYW5kbGVBbGVydHMoKTsgLy9oYW5kbGUgY2xvc2FibGVkIGFsZXJ0c1xuICAgICAgICAgICAgaGFuZGxlRHJvcGRvd25zKCk7IC8vIGhhbmRsZSBkcm9wZG93bnNcbiAgICAgICAgICAgIGhhbmRsZVRhYnMoKTsgLy8gaGFuZGxlIHRhYnNcbiAgICAgICAgICAgIGhhbmRsZVRvb2x0aXBzKCk7IC8vIGhhbmRsZSBib290c3RyYXAgdG9vbHRpcHNcbiAgICAgICAgICAgIGhhbmRsZVBvcG92ZXJzKCk7IC8vIGhhbmRsZXMgYm9vdHN0cmFwIHBvcG92ZXJzXG4gICAgICAgICAgICBoYW5kbGVBY2NvcmRpb25zKCk7IC8vaGFuZGxlcyBhY2NvcmRpb25zXG4gICAgICAgICAgICBoYW5kbGVNb2RhbHMoKTsgLy8gaGFuZGxlIG1vZGFsc1xuICAgICAgICAgICAgaGFuZGxlQm9vdHN0cmFwQ29uZmlybWF0aW9uKCk7IC8vIGhhbmRsZSBib290c3RyYXAgY29uZmlybWF0aW9uc1xuICAgICAgICAgICAgaGFuZGxlVGV4dGFyZWFBdXRvc2l6ZSgpOyAvLyBoYW5kbGUgYXV0b3NpemUgdGV4dGFyZWFzXG5cbiAgICAgICAgICAgIC8vSGFuZGxlIGdyb3VwIGVsZW1lbnQgaGVpZ2h0c1xuICAgICAgICAgICAgaGFuZGxlSGVpZ2h0KCk7XG4gICAgICAgICAgICB0aGlzLmFkZFJlc2l6ZUhhbmRsZXIoaGFuZGxlSGVpZ2h0KTsgLy8gaGFuZGxlIGF1dG8gY2FsY3VsYXRpbmcgaGVpZ2h0IG9uIHdpbmRvdyByZXNpemVcblxuICAgICAgICAgICAgLy8gSGFja3NcbiAgICAgICAgICAgIGhhbmRsZUZpeElucHV0UGxhY2Vob2xkZXJGb3JJRSgpOyAvL0lFOCAmIElFOSBpbnB1dCBwbGFjZWhvbGRlciBpc3N1ZSBmaXhcbiAgICAgICAgfSxcblxuICAgICAgICAvL21haW4gZnVuY3Rpb24gdG8gaW5pdGlhdGUgY29yZSBqYXZhc2NyaXB0IGFmdGVyIGFqYXggY29tcGxldGVcbiAgICAgICAgaW5pdEFqYXg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlVW5pZm9ybSgpOyAvLyBoYW5kbGVzIGN1c3RvbSByYWRpbyAmIGNoZWNrYm94ZXNcbiAgICAgICAgICAgIGhhbmRsZWlDaGVjaygpOyAvLyBoYW5kbGVzIGN1c3RvbSBpY2hlY2sgcmFkaW8gYW5kIGNoZWNrYm94ZXNcbiAgICAgICAgICAgIGhhbmRsZUJvb3RzdHJhcFN3aXRjaCgpOyAvLyBoYW5kbGUgYm9vdHN0cmFwIHN3aXRjaCBwbHVnaW5cbiAgICAgICAgICAgIGhhbmRsZURyb3Bkb3duSG92ZXIoKTsgLy8gaGFuZGxlcyBkcm9wZG93biBob3ZlclxuICAgICAgICAgICAgaGFuZGxlU2Nyb2xsZXJzKCk7IC8vIGhhbmRsZXMgc2xpbSBzY3JvbGxpbmcgY29udGVudHNcbiAgICAgICAgICAgIGhhbmRsZVNlbGVjdDIoKTsgLy8gaGFuZGxlIGN1c3RvbSBTZWxlY3QyIGRyb3Bkb3duc1xuICAgICAgICAgICAgaGFuZGxlRmFuY3lib3goKTsgLy8gaGFuZGxlIGZhbmN5IGJveFxuICAgICAgICAgICAgaGFuZGxlRHJvcGRvd25zKCk7IC8vIGhhbmRsZSBkcm9wZG93bnNcbiAgICAgICAgICAgIGhhbmRsZVRvb2x0aXBzKCk7IC8vIGhhbmRsZSBib290c3RyYXAgdG9vbHRpcHNcbiAgICAgICAgICAgIGhhbmRsZVBvcG92ZXJzKCk7IC8vIGhhbmRsZXMgYm9vdHN0cmFwIHBvcG92ZXJzXG4gICAgICAgICAgICBoYW5kbGVBY2NvcmRpb25zKCk7IC8vaGFuZGxlcyBhY2NvcmRpb25zXG4gICAgICAgICAgICBoYW5kbGVCb290c3RyYXBDb25maXJtYXRpb24oKTsgLy8gaGFuZGxlIGJvb3RzdHJhcCBjb25maXJtYXRpb25zXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9pbml0IG1haW4gY29tcG9uZW50c1xuICAgICAgICBpbml0Q29tcG9uZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRBamF4KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wdWJsaWMgZnVuY3Rpb24gdG8gcmVtZW1iZXIgbGFzdCBvcGVuZWQgcG9wb3ZlciB0aGF0IG5lZWRzIHRvIGJlIGNsb3NlZCBvbiBjbGlja1xuICAgICAgICBzZXRMYXN0UG9wZWRQb3BvdmVyOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgbGFzdFBvcGVkUG9wb3ZlciA9IGVsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGFkZCBjYWxsYmFjayBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIG9uIHdpbmRvdyByZXNpemVcbiAgICAgICAgYWRkUmVzaXplSGFuZGxlcjogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgICAgcmVzaXplSGFuZGxlcnMucHVzaChmdW5jKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdG9uIHRvIGNhbGwgX3J1bnJlc2l6ZUhhbmRsZXJzXG4gICAgICAgIHJ1blJlc2l6ZUhhbmRsZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9ydW5SZXNpemVIYW5kbGVycygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byBzY3JvbGwoZm9jdXMpIHRvIGFuIGVsZW1lbnRcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uKGVsLCBvZmZlc2V0KSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gKGVsICYmIGVsLnNpemUoKSA+IDApID8gZWwub2Zmc2V0KCkudG9wIDogMDtcblxuICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItZml4ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBwb3MgPSBwb3MgLSAkKCcucGFnZS1oZWFkZXInKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2VfYm9keScpKS5oYXNDbGFzcygncGFnZS1oZWFkZXItdG9wLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyLXRvcCcpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKCdwYWdlLWhlYWRlci1tZW51LWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zIC0gJCgnLnBhZ2UtaGVhZGVyLW1lbnUnKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcG9zID0gcG9zICsgKG9mZmVzZXQgPyBvZmZlc2V0IDogLTEgKiBlbC5oZWlnaHQoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcG9zXG4gICAgICAgICAgICB9LCAnc2xvdycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRTbGltU2Nyb2xsOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgJChlbCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1pbml0aWFsaXplZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIGV4aXRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImRhdGEtaGVpZ2h0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9ICQodGhpcykuYXR0cihcImRhdGEtaGVpZ2h0XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9ICQodGhpcykuY3NzKCdoZWlnaHQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaW1TY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICBhbGxvd1BhZ2VTY3JvbGw6IHRydWUsIC8vIGFsbG93IHBhZ2Ugc2Nyb2xsIHdoZW4gdGhlIGVsZW1lbnQgc2Nyb2xsIGlzIGVuZGVkXG4gICAgICAgICAgICAgICAgICAgIHNpemU6ICc3cHgnLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogKCQodGhpcykuYXR0cihcImRhdGEtaGFuZGxlLWNvbG9yXCIpID8gJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIikgOiAnI2JiYicpLFxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxuICAgICAgICAgICAgICAgICAgICByYWlsQ29sb3I6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtY29sb3JcIikgOiAnI2VhZWFlYScpLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogaXNSVEwgPyAnbGVmdCcgOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgYWx3YXlzVmlzaWJsZTogKCQodGhpcykuYXR0cihcImRhdGEtYWx3YXlzLXZpc2libGVcIikgPT0gXCIxXCIgPyB0cnVlIDogZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgICByYWlsVmlzaWJsZTogKCQodGhpcykuYXR0cihcImRhdGEtcmFpbC12aXNpYmxlXCIpID09IFwiMVwiID8gdHJ1ZSA6IGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZUZhZGVPdXQ6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIiwgXCIxXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveVNsaW1TY3JvbGw6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAkKGVsKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJkYXRhLWluaXRpYWxpemVkXCIpID09PSBcIjFcIikgeyAvLyBkZXN0cm95IGV4aXN0aW5nIGluc3RhbmNlIGJlZm9yZSB1cGRhdGluZyB0aGUgaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQXR0cihcImRhdGEtaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQXR0cihcInN0eWxlXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyTGlzdCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSBjdXN0b20gYXR0cmlidXJlcyBzbyBsYXRlciB3ZSB3aWxsIHJlYXNzaWduLlxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1oYW5kbGUtY29sb3JcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1oYW5kbGUtY29sb3JcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWhhbmRsZS1jb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS13cmFwcGVyLWNsYXNzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtd3JhcHBlci1jbGFzc1wiXSA9ICQodGhpcykuYXR0cihcImRhdGEtd3JhcHBlci1jbGFzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLWNvbG9yXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyTGlzdFtcImRhdGEtcmFpbC1jb2xvclwiXSA9ICQodGhpcykuYXR0cihcImRhdGEtcmFpbC1jb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1hbHdheXMtdmlzaWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ckxpc3RbXCJkYXRhLWFsd2F5cy12aXNpYmxlXCJdID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1hbHdheXMtdmlzaWJsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiZGF0YS1yYWlsLXZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJMaXN0W1wiZGF0YS1yYWlsLXZpc2libGVcIl0gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXJhaWwtdmlzaWJsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2xpbVNjcm9sbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICgkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgPyAkKHRoaXMpLmF0dHIoXCJkYXRhLXdyYXBwZXItY2xhc3NcIikgOiAnc2xpbVNjcm9sbERpdicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhlID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyByZWFzc2lnbiBjdXN0b20gYXR0cmlidXRlc1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goYXR0ckxpc3QsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZS5hdHRyKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGZ1bmN0aW9uIHRvIHNjcm9sbCB0byB0aGUgdG9wXG4gICAgICAgIHNjcm9sbFRvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBNZXRyb25pYy5zY3JvbGxUbygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHdyTWV0cm9uaWNlciBmdW5jdGlvbiB0byAgYmxvY2sgZWxlbWVudChpbmRpY2F0ZSBsb2FkaW5nKVxuICAgICAgICBibG9ja1VJOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xuICAgICAgICAgICAgdmFyIGh0bWwgPSAnJztcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+JyArICc8ZGl2IGNsYXNzPVwiYmxvY2stc3Bpbm5lci1iYXJcIj48ZGl2IGNsYXNzPVwiYm91bmNlMVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UyXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTNcIj48L2Rpdj48L2Rpdj4nICsgJzwvZGl2Pic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaWNvbk9ubHkpIHtcbiAgICAgICAgICAgICAgICBodG1sID0gJzxkaXYgY2xhc3M9XCJsb2FkaW5nLW1lc3NhZ2UgJyArIChvcHRpb25zLmJveGVkID8gJ2xvYWRpbmctbWVzc2FnZS1ib3hlZCcgOiAnJykgKyAnXCI+PGltZyBzcmM9XCInICsgdGhpcy5nZXRHbG9iYWxJbWdQYXRoKCkgKyAnbG9hZGluZy1zcGlubmVyLWdyZXkuZ2lmXCIgYWxpZ249XCJcIj48L2Rpdj4nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnRleHRPbmx5KSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPjxzcGFuPiZuYnNwOyZuYnNwOycgKyAob3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xPQURJTkcuLi4nKSArICc8L3NwYW4+PC9kaXY+JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibG9hZGluZy1tZXNzYWdlICcgKyAob3B0aW9ucy5ib3hlZCA/ICdsb2FkaW5nLW1lc3NhZ2UtYm94ZWQnIDogJycpICsgJ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiIGFsaWduPVwiXCI+PHNwYW4+Jm5ic3A7Jm5ic3A7JyArIChvcHRpb25zLm1lc3NhZ2UgPyBvcHRpb25zLm1lc3NhZ2UgOiAnTE9BRElORy4uLicpICsgJzwvc3Bhbj48L2Rpdj4nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50YXJnZXQpIHsgLy8gZWxlbWVudCBibG9ja2luZ1xuICAgICAgICAgICAgICAgIHZhciBlbCA9ICQob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlmIChlbC5oZWlnaHQoKSA8PSAoJCh3aW5kb3cpLmhlaWdodCgpKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNlbnJlclkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbC5ibG9jayh7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGh0bWwsXG4gICAgICAgICAgICAgICAgICAgIGJhc2VaOiBvcHRpb25zLnpJbmRleCA/IG9wdGlvbnMuekluZGV4IDogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyWTogb3B0aW9ucy5jZW5yZXJZICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNlbnJlclkgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICcxMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q1NTOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG9wdGlvbnMub3ZlcmxheUNvbG9yID8gb3B0aW9ucy5vdmVybGF5Q29sb3IgOiAnIzU1NScsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3dhaXQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIHBhZ2UgYmxvY2tpbmdcbiAgICAgICAgICAgICAgICAkLmJsb2NrVUkoe1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBodG1sLFxuICAgICAgICAgICAgICAgICAgICBiYXNlWjogb3B0aW9ucy56SW5kZXggPyBvcHRpb25zLnpJbmRleCA6IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q1NTOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG9wdGlvbnMub3ZlcmxheUNvbG9yID8gb3B0aW9ucy5vdmVybGF5Q29sb3IgOiAnIzU1NScsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBvcHRpb25zLmJveGVkID8gMC4wNSA6IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3dhaXQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3ck1ldHJvbmljZXIgZnVuY3Rpb24gdG8gIHVuLWJsb2NrIGVsZW1lbnQoZmluaXNoIGxvYWRpbmcpXG4gICAgICAgIHVuYmxvY2tVSTogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgJCh0YXJnZXQpLnVuYmxvY2soe1xuICAgICAgICAgICAgICAgICAgICBvblVuYmxvY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0YXJnZXQpLmNzcygncG9zaXRpb24nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRhcmdldCkuY3NzKCd6b29tJywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQudW5ibG9ja1VJKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhcnRQYWdlTG9hZGluZzogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2Utc3Bpbm5lci1iYXInKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2JvZHknKSkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGFnZS1zcGlubmVyLWJhclwiPjxkaXYgY2xhc3M9XCJib3VuY2UxXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiYm91bmNlM1wiPjwvZGl2PjwvZGl2PicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcucGFnZS1sb2FkaW5nJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInBhZ2UtbG9hZGluZ1wiPjxpbWcgc3JjPVwiJyArIHRoaXMuZ2V0R2xvYmFsSW1nUGF0aCgpICsgJ2xvYWRpbmctc3Bpbm5lci1ncmV5LmdpZlwiLz4mbmJzcDsmbmJzcDs8c3Bhbj4nICsgKG9wdGlvbnMgJiYgb3B0aW9ucy5tZXNzYWdlID8gb3B0aW9ucy5tZXNzYWdlIDogJ0xvYWRpbmcuLi4nKSArICc8L3NwYW4+PC9kaXY+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RvcFBhZ2VMb2FkaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJy5wYWdlLWxvYWRpbmcsIC5wYWdlLXNwaW5uZXItYmFyJykucmVtb3ZlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWxlcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXI6IFwiXCIsIC8vIGFsZXJ0cyBwYXJlbnQgY29udGFpbmVyKGJ5IGRlZmF1bHQgcGxhY2VkIGFmdGVyIHRoZSBwYWdlIGJyZWFkY3J1bWJzKVxuICAgICAgICAgICAgICAgIHBsYWNlOiBcImFwcGVuZFwiLCAvLyBcImFwcGVuZFwiIG9yIFwicHJlcGVuZFwiIGluIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJywgLy8gYWxlcnQncyB0eXBlXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJcIiwgLy8gYWxlcnQncyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgY2xvc2U6IHRydWUsIC8vIG1ha2UgYWxlcnQgY2xvc2FibGVcbiAgICAgICAgICAgICAgICByZXNldDogdHJ1ZSwgLy8gY2xvc2UgYWxsIHByZXZpb3VzZSBhbGVydHMgZmlyc3RcbiAgICAgICAgICAgICAgICBmb2N1czogdHJ1ZSwgLy8gYXV0byBzY3JvbGwgdG8gdGhlIGFsZXJ0IGFmdGVyIHNob3duXG4gICAgICAgICAgICAgICAgY2xvc2VJblNlY29uZHM6IDAsIC8vIGF1dG8gY2xvc2UgYWZ0ZXIgZGVmaW5lZCBzZWNvbmRzXG4gICAgICAgICAgICAgICAgaWNvbjogXCJcIiAvLyBwdXQgaWNvbiBiZWZvcmUgdGhlIG1lc3NhZ2VcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB2YXIgaWQgPSBNZXRyb25pYy5nZXRVbmlxdWVJRChcIk1ldHJvbmljX2FsZXJ0XCIpO1xuXG4gICAgICAgICAgICB2YXIgaHRtbCA9ICc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwiTWV0cm9uaWMtYWxlcnRzIGFsZXJ0IGFsZXJ0LScgKyBvcHRpb25zLnR5cGUgKyAnIGZhZGUgaW5cIj4nICsgKG9wdGlvbnMuY2xvc2UgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9idXR0b24+JyA6ICcnKSArIChvcHRpb25zLmljb24gIT09IFwiXCIgPyAnPGkgY2xhc3M9XCJmYS1sZyBmYSBmYS0nICsgb3B0aW9ucy5pY29uICsgJ1wiPjwvaT4gICcgOiAnJykgKyBvcHRpb25zLm1lc3NhZ2UgKyAnPC9kaXY+JztcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucmVzZXQpIHtcbiAgICAgICAgICAgICAgICAkKCcuTWV0cm9uaWMtYWxlcnRzJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9ib2R5JykpLmhhc0NsYXNzKFwicGFnZS1jb250YWluZXItYmctc29saWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtdGl0bGUnKS5hZnRlcihodG1sKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnLnBhZ2UtYmFyJykuc2l6ZSgpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2UtYmFyJykuYWZ0ZXIoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcucGFnZS1icmVhZGNydW1iJykuYWZ0ZXIoaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnBsYWNlID09IFwiYXBwZW5kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJChvcHRpb25zLmNvbnRhaW5lcikuYXBwZW5kKGh0bWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQob3B0aW9ucy5jb250YWluZXIpLnByZXBlbmQoaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5mb2N1cykge1xuICAgICAgICAgICAgICAgIE1ldHJvbmljLnNjcm9sbFRvKCQoJyMnICsgaWQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2xvc2VJblNlY29uZHMgPiAwKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnIycgKyBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSwgb3B0aW9ucy5jbG9zZUluU2Vjb25kcyAqIDEwMDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZXMgdW5pZm9ybSBlbGVtZW50c1xuICAgICAgICBpbml0VW5pZm9ybTogZnVuY3Rpb24oZWxzKSB7XG4gICAgICAgICAgICBpZiAoZWxzKSB7XG4gICAgICAgICAgICAgICAgJChlbHMpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudHMoXCIuY2hlY2tlclwiKS5zaXplKCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS51bmlmb3JtKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlVW5pZm9ybSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vd3JNZXRyb25pY2VyIGZ1bmN0aW9uIHRvIHVwZGF0ZS9zeW5jIGpxdWVyeSB1bmlmb3JtIGNoZWNrYm94ICYgcmFkaW9zXG4gICAgICAgIHVwZGF0ZVVuaWZvcm06IGZ1bmN0aW9uKGVscykge1xuICAgICAgICAgICAgJC51bmlmb3JtLnVwZGF0ZShlbHMpOyAvLyB1cGRhdGUgdGhlIHVuaWZvcm0gY2hlY2tib3ggJiByYWRpb3MgVUkgYWZ0ZXIgdGhlIGFjdHVhbCBpbnB1dCBjb250cm9sIHN0YXRlIGNoYW5nZWRcbiAgICAgICAgfSxcblxuICAgICAgICAvL3B1YmxpYyBmdW5jdGlvbiB0byBpbml0aWFsaXplIHRoZSBmYW5jeWJveCBwbHVnaW5cbiAgICAgICAgaW5pdEZhbmN5Ym94OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhhbmRsZUZhbmN5Ym94KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wdWJsaWMgaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBhY3R1YWwgaW5wdXQgdmFsdWUodXNlZCBpbiBJRTkgYW5kIElFOCBkdWUgdG8gcGxhY2Vob2xkZXIgYXR0cmlidXRlIG5vdCBzdXBwb3J0ZWQpXG4gICAgICAgIGdldEFjdHVhbFZhbDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGVsID0gJChlbCk7XG4gICAgICAgICAgICBpZiAoZWwudmFsKCkgPT09IGVsLmF0dHIoXCJwbGFjZWhvbGRlclwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsLnZhbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vcHVibGljIGZ1bmN0aW9uIHRvIGdldCBhIHBhcmVtZXRlciBieSBuYW1lIGZyb20gVVJMXG4gICAgICAgIGdldFVSTFBhcmFtZXRlcjogZnVuY3Rpb24ocGFyYW1OYW1lKSB7XG4gICAgICAgICAgICB2YXIgc2VhcmNoU3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSksXG4gICAgICAgICAgICAgICAgaSwgdmFsLCBwYXJhbXMgPSBzZWFyY2hTdHJpbmcuc3BsaXQoXCImXCIpO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gcGFyYW1zW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsWzBdID09IHBhcmFtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5lc2NhcGUodmFsWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjaGVjayBmb3IgZGV2aWNlIHRvdWNoIHN1cHBvcnRcbiAgICAgICAgaXNUb3VjaERldmljZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiVG91Y2hFdmVudFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gZ2V0IHRoZSBjb3JyZWN0IHZpZXdwb3J0IHdpZHRoIGJhc2VkIG9uICBodHRwOi8vYW5keWxhbmd0b24uY28udWsvYXJ0aWNsZXMvamF2YXNjcmlwdC9nZXQtdmlld3BvcnQtc2l6ZS1qYXZhc2NyaXB0L1xuICAgICAgICBnZXRWaWV3UG9ydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZSA9IHdpbmRvdyxcbiAgICAgICAgICAgICAgICBhID0gJ2lubmVyJztcbiAgICAgICAgICAgIGlmICghKCdpbm5lcldpZHRoJyBpbiB3aW5kb3cpKSB7XG4gICAgICAgICAgICAgICAgYSA9ICdjbGllbnQnO1xuICAgICAgICAgICAgICAgIGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogZVthICsgJ1dpZHRoJ10sXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBlW2EgKyAnSGVpZ2h0J11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0VW5pcXVlSUQ6IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgICAgICAgICAgcmV0dXJuICdwcmVmaXhfJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGNoZWNrIElFOCBtb2RlXG4gICAgICAgIGlzSUU4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0lFODtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjaGVjayBJRTkgbW9kZVxuICAgICAgICBpc0lFOTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNJRTk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9jaGVjayBSVEwgbW9kZVxuICAgICAgICBpc1JUTDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNSVEw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hlY2sgSUU4IG1vZGVcbiAgICAgICAgaXNBbmd1bGFySnNBcHA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgYW5ndWxhciA9PSAndW5kZWZpbmVkJykgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0QXNzZXRzUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRBc3NldHNQYXRoOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgICAgICBhc3NldHNQYXRoID0gcGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRHbG9iYWxJbWdQYXRoOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgICAgICBnbG9iYWxJbWdQYXRoID0gcGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRHbG9iYWxJbWdQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NldHNQYXRoICsgZ2xvYmFsSW1nUGF0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRHbG9iYWxQbHVnaW5zUGF0aDogZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgZ2xvYmFsUGx1Z2luc1BhdGggPSBwYXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEdsb2JhbFBsdWdpbnNQYXRoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NldHNQYXRoICsgZ2xvYmFsUGx1Z2luc1BhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0R2xvYmFsQ3NzUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzUGF0aCArIGdsb2JhbENzc1BhdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gZ2V0IGxheW91dCBjb2xvciBjb2RlIGJ5IGNvbG9yIG5hbWVcbiAgICAgICAgZ2V0QnJhbmRDb2xvcjogZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgaWYgKGJyYW5kQ29sb3JzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJyYW5kQ29sb3JzW25hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmVzcG9uc2l2ZUJyZWFrcG9pbnQ6IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgICAgICAgIC8vIGJvb3RzdHJhcCByZXNwb25zaXZlIGJyZWFrcG9pbnRzXG4gICAgICAgICAgICB2YXIgc2l6ZXMgPSB7XG4gICAgICAgICAgICAgICAgJ3hzJyA6IDQ4MCwgICAgIC8vIGV4dHJhIHNtYWxsXG4gICAgICAgICAgICAgICAgJ3NtJyA6IDc2OCwgICAgIC8vIHNtYWxsXG4gICAgICAgICAgICAgICAgJ21kJyA6IDk5MiwgICAgIC8vIG1lZGl1bVxuICAgICAgICAgICAgICAgICdsZycgOiAxMjAwICAgICAvLyBsYXJnZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHNpemVzW3NpemVdID8gc2l6ZXNbc2l6ZV0gOiAwO1xuICAgICAgICB9XG4gICAgfTtcblxufSAoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXRyb25pYzsiLCJjb25zdCBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcblxuY2xhc3MgQ29tbW9uIHtcblxuICAgIHN0YXRpYyBzcGxpdExpbmVzKHRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQoL1xcbi8pO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRFdmVudFRpbWUodCwgbm93KSB7XG4gICAgICAgIGxldCB0aW1lID0gbW9tZW50KHQsICdZWVlZLU1NLUREIEhIOm1tOnNzLlNTUycpO1xuICAgICAgICBsZXQgbm93dGltZSA9IG1vbWVudChub3csICdZWVlZLU1NLUREIEhIOm1tOnNzLlNTUycpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndDogICAgICAgJyArIHQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm93OiAgICAgJyArIG5vdyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aW1lOiAgICAnICsgdGltZS5mb3JtYXQoKSk7IC8vICsgJyAnICsgdGltZS5pc1ZhbGlkKCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm93dGltZTogJyArIG5vd3RpbWUuZm9ybWF0KCkpOyAvLyArICcgJyArIG5vd3RpbWUuaXNWYWxpZCgpKTtcbiAgICAgICAgcmV0dXJuIHRpbWUuZnJvbShub3d0aW1lKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY2xhc3NJZihrbGFzcywgYikge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbGFzc0lmOiAnICsga2xhc3MgKyAnLCAnICsgYik7XG4gICAgICAgIHJldHVybiAoYiA/IGtsYXNzIDogJycpO1xuICAgIH1cblxuICAgIC8vIGF2b2lkICckYXBwbHkgYWxyZWFkeSBpbiBwcm9ncmVzcycgZXJyb3IgKHNvdXJjZTogaHR0cHM6Ly9jb2RlcndhbGwuY29tL3Avbmdpc21hKVxuICAgIHN0YXRpYyBzYWZlQXBwbHkoZm4pIHtcbiAgICAgICAgaWYgKGZuICYmICh0eXBlb2YgKGZuKSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAgIGZuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzb3VyY2U6IGh0dHA6Ly9jdHJscS5vcmcvY29kZS8xOTYxNi1kZXRlY3QtdG91Y2gtc2NyZWVuLWphdmFzY3JpcHRcbiAgICBzdGF0aWMgaXNUb3VjaERldmljZSgpIHtcbiAgICAgICAgcmV0dXJuICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCAobmF2aWdhdG9yLk1heFRvdWNoUG9pbnRzID4gMCkgfHwgKG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMCkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRUaWNrc0Zyb21EYXRlKGRhdGUpIHtcbiAgICAgICAgbGV0IHJldCA9IG51bGw7XG4gICAgICAgIGlmKGRhdGUgJiYgZGF0ZS5nZXRUaW1lKSB7XG4gICAgICAgICAgICByZXQgPSBkYXRlLmdldFRpbWUoKS8xMDAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbW9uOyIsImNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5cbmNsYXNzIFZpZGVvUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihkaXZJZCwgb3B0cyA9IHsgdmlkZW9JZDogJyd9KSB7XG4gICAgICAgIHRoaXMuaWQgPSBkaXZJZFxuICAgICAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgICAgIHRoaXMubWV0YU1hcCA9IHJlcXVpcmUoJy4uLy4uL01ldGFNYXAnKVxuICAgICAgICB0aGlzLmluaXQoKVxuICAgIH1cblxuICAgIG9uUmVhZHkoKSB7XG4gICAgICAgIHRoaXMuX29uUmVhZHkgPSB0aGlzLl9vblJlYWR5IHx8IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB3YWl0ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuWVQgJiYgd2luZG93LllULmxvYWRlZD09MSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLllUID0gd2luZG93LllUO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHdpbmRvdy5ZVClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHdhaXQsIDI1MClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3YWl0KClcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVhZHk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5vblJlYWR5KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsYXllciA9IG5ldyB0aGlzLllULlBsYXllcih0aGlzLmlkLCB7XG4gICAgICAgICAgICAgICAgdmlkZW9JZDogdGhpcy5vcHRzLnZpZGVvSWQsXG4gICAgICAgICAgICAgICAgZnJhbWVib3JkZXI6IDAsXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgIG9uUmVhZHk6IHRoaXMub25QbGF5ZXJSZWFkeSxcbiAgICAgICAgICAgICAgICAgICAgb25TdGF0ZUNoYW5nZTogdGhpcy5vblBsYXllclN0YXRlQ2hhbmdlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uUGxheWVyUmVhZHkoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBsYXlWaWRlbygpO1xuICAgIH1cblxuICAgIG9uUGxheWVyU3RhdGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEgPT0gWVQuUGxheWVyU3RhdGUuRU5ERUQpIHtcbiAgICAgICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaXNEb25lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lID09IHRydWVcbiAgICB9XG5cbiAgICBzdG9wVmlkZW8oKSB7XG4gICAgICAgIHRoaXMucGxheWVyLnN0b3BWaWRlbygpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvUGxheWVyOyIsImlmICghU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQpIHtcbiAgICBTdHJpbmcucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxuICAgICAgICAgICAgICA6IG1hdGNoXG4gICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuICAgIH07XG59IiwiY29uc3QgdXVpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGV4RGlnaXRzLCBpLCBzLCB1dWlkO1xuICAgIHMgPSBbXTtcbiAgICBzLmxlbmd0aCA9IDM2O1xuICAgIGhleERpZ2l0cyA9ICcwMTIzNDU2Nzg5YWJjZGVmJztcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IDM2KSB7XG4gICAgICAgIHNbaV0gPSBoZXhEaWdpdHMuc3Vic3RyKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDB4MTApLCAxKTtcbiAgICAgICAgaSArPSAxO1xuICAgIH1cbiAgICBzWzE0XSA9ICc0JztcbiAgICBzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSk7XG4gICAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJztcbiAgICB1dWlkID0gcy5qb2luKCcnKTtcbiAgICByZXR1cm4gdXVpZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdXVpZDsiXX0=
