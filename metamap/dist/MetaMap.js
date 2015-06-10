(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MetaMap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('babel/polyfill');
window.riot = require('riot');
window._ = require('lodash');
window.Promise = require('bluebird');
require('core-js');
window.$ = window.jQuery = require('jquery');
require('jquery-ui');
require('bootstrap');
window.Firebase = require('firebase');
window.Humanize = require('humanize-plus');
window.moment = require('moment');
window.URI = require('URIjs');
window.localforage = require('localforage');

require('./js/integrations/auth0');
require('./js/integrations/googleanalytics');
require('./js/integrations/newrelic');
require('./js/integrations/raygun');
require('./js/integrations/usersnap');

require('./tags/page-actions.tag');
require('./tags/page-container.tag');
require('./tags/page-content.tag');
require('./tags/page-footer.tag');
require('./tags/page-header.tag');
require('./tags/page-logo.tag');
require('./tags/page-search.tag');
require('./tags/page-sidebar.tag');
require('./tags/page-topmenu.tag');
require('./tags/page-body.tag');

require('./js/canvas/editor.js');
require('./js/canvas/user.js');
require('./js/canvas/editor_options.js');
require('./js/canvas/analytics.js');
require('./js/canvas/attachments.js');
require('./js/canvas/autosave.js');
require('./js/canvas/generator.js');
require('./js/canvas/layouts.js');
require('./js/canvas/map.js');
require('./js/canvas/perspectives.js');
require('./js/canvas/presenter.js');
require('./js/canvas/templates.js');
require('./js/canvas/ui.js');

var mm = require('./MetaMap');

module.exports = new mm();

},{"./MetaMap":2,"./js/canvas/analytics.js":4,"./js/canvas/attachments.js":5,"./js/canvas/autosave.js":6,"./js/canvas/editor.js":7,"./js/canvas/editor_options.js":8,"./js/canvas/generator.js":9,"./js/canvas/layouts.js":10,"./js/canvas/map.js":11,"./js/canvas/perspectives.js":12,"./js/canvas/presenter.js":13,"./js/canvas/templates.js":14,"./js/canvas/ui.js":15,"./js/canvas/user.js":16,"./js/integrations/auth0":20,"./js/integrations/googleanalytics":22,"./js/integrations/newrelic":23,"./js/integrations/raygun":24,"./js/integrations/usersnap":25,"./tags/page-actions.tag":52,"./tags/page-body.tag":53,"./tags/page-container.tag":54,"./tags/page-content.tag":55,"./tags/page-footer.tag":56,"./tags/page-header.tag":57,"./tags/page-logo.tag":58,"./tags/page-search.tag":59,"./tags/page-sidebar.tag":60,"./tags/page-topmenu.tag":61,"URIjs":undefined,"babel/polyfill":"babel/polyfill","bluebird":undefined,"bootstrap":undefined,"core-js":undefined,"firebase":undefined,"humanize-plus":undefined,"jquery":undefined,"jquery-ui":undefined,"localforage":undefined,"lodash":undefined,"moment":undefined,"riot":"riot"}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');
var User = require('./js/app/user.js');
var Editor = require('./js/map/editor.js');
var nuMap = require('./js/newmap/map.js');

var MetaMap = (function () {
    function MetaMap() {
        _classCallCheck(this, MetaMap);

        this.MetaFire = new MetaFire();
        this.Auth0 = new Auth0();
        usersnap();
    }

    _createClass(MetaMap, [{
        key: 'init',
        value: function init() {
            var _this = this;

            var self = this;
            this.Auth0.login().then(function (profile) {
                self.User = new User(profile);

                riot.mount('*');
                _.delay(function () {
                    Metronic.init(); // init metronic core componets
                    Layout.init(); // init layout
                    Demo.init(); // init demo features
                    Index.init(); // init index page
                    Tasks.initDashboardWidget(); // init tash dashboard widget
                    //var x = { cssTagging: {} }

                    //window.mapData = { "map": { "metadata": { "sandbox": false, "id": 5547, "name": "Untitled Map", "url": "/maps/5547", "canEdit": true, "updatedAt": "2015-05-15T12:29:40.721-04:00", "updatedBy": null, "updatedByName": null, "userTags": [] }, "data": { "class": "go.GraphLinksModel", "nodeIsLinkLabelProperty": "isLinkLabel", "linkLabelKeysProperty": "labelKeys", "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [{ "key": 1, "text": "New Idea", "isGroup": true, "loc": "0 0", "layout": "left", "sExpanded": true, "pExpanded": true }], "linkDataArray": [] }, "stateData": null, "editorOptions": null, "analytics": {}, "versions": [] }};
                    //window._mapEditorCtrl = MapEditorCtrl(x, x, '', '');
                    //window.CrlMap = new Editor(window.mapData);

                    nuMap();
                }, 250);
                _this.MetaFire.init();
            });
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

module.exports = MetaMap;

},{"./js/app/user.js":3,"./js/integrations/auth0":20,"./js/integrations/firebase":21,"./js/integrations/usersnap":25,"./js/map/editor.js":37,"./js/newmap/map.js":50}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var User = (function () {
    function User(profile) {
        _classCallCheck(this, User);

        this.profile = profile;
        this.params = URI(window.location).query(true);
        this.thinkquery = this.params.thinkquery ? true : false;
    }

    _createClass(User, [{
        key: 'userId',
        get: function () {
            return this.profile.user_id;
        }
    }, {
        key: 'isAdmin',
        get: function () {
            return this.profile.roles.indexOf('admin') !== -1;
        }
    }, {
        key: 'name',
        get: function () {
            return this.profile.name;
        }
    }, {
        key: 'saveUserEditorOptions',
        value: function saveUserEditorOptions(options) {
            var data = {
                user: {
                    editor_options: JSON.stringify(options)
                }
            };

            //startSpinner();
            //$http.put('/users/' + $scope.userId + '.json', data).then(
            //    function (response) {
            //        stopSpinner();
            //    },
            //    function () {
            //        stopSpinner();
            //        $scope.profileEditStatus = 'Could not save editor options';
            //    }
            //);
        }
    }]);

    return User;
})();

module.exports = User;

},{}],4:[function(require,module,exports){
// functions handling analytics
// analytics display is in views/maps/_analytics_tab_map and _analytics_tab_thing
'use strict';

SandbankEditor.Analytics = function (editor, map) {

    var self = this;

    this.init = function () {};

    this.handleDiagramEvent = function (eventName, e) {
        if (eventName == 'ChangedSelection') {
            if (map.getUi().currentTabIs(map.getUi().TAB_ID_ANALYTICS_THING)) {
                self.updateContextualAnalytics();
            }
        }
    };

    // called when a tab is opened or closed
    this.currentTabChanged = function (newValue, oldValue) {
        if (newValue == map.getUi().TAB_ID_ANALYTICS_THING) {
            // opening thing analytics tab
            self.updateContextualAnalytics();
        }
    };

    // this gets populated by map.loadMapExtraData, on load and after every autosave
    this.mapAnalytics = null;

    // --------- contextual analytics --------------
    // - these are all calculated here, unlike map analytics which are calculated on the server and connected with badges and points

    // this gets calculated by updateContextualAnalytics
    this.contextualAnalytics = {
        thingName: '',

        // thing stuff
        distinctFrom: 0,
        intentionallyDistinctFrom: 0,
        partOf: 0,
        includesParts: 0,
        relatedTo: 0,
        isRelationship: 0,
        lookingAt: 0,
        lookedAtFrom: 0,

        // R stuff
        rFromThingName: '',
        rToThingName: '',
        isRThing: false,
        isRSystem: false,
        isRPoint: false,
        isRView: false
    };

    this.updateContextualAnalytics = function () {
        //console.log('updateContextualAnalytics');
        if (!map.getUi().currentTabIs(map.getUi().TAB_ID_ANALYTICS_THING)) {
            return;
        }

        var diagram = map.getDiagram();
        var part = diagram.selection.first();
        var a = self.contextualAnalytics;

        if (part && part instanceof go.Group) {
            var thing = part;

            // thing name
            a.thingName = thing.data.text;

            // distinct from
            a.distinctFrom = _.where(diagram.model.nodeDataArray, { isGroup: true }).length - 1;

            // part of
            var level = 0;
            var thing2 = thing;
            while (thing2 = getContainingGroup(thing2)) {
                level++;
            }
            a.partOf = level;

            // includes parts
            a.includesParts = countGroups(thing);

            // related to / looking at / looked at from / intentionally distinct from
            a.relatedTo = 0;
            a.lookingAt = 0;
            a.lookedAtFrom = 0;
            a.intentionallyDistinctFrom = 0;
            var links = thing.linksConnected;
            var rConnectedThingKeys = [];
            while (links.next()) {
                var link = links.value;
                // P link
                if (link.data.category == 'P') {
                    if (link.fromNode == thing) {
                        a.lookingAt++;
                    } else if (link.toNode == thing) {
                        a.lookedAtFrom++;
                    }
                }
                // D link
                else if (link.data.category == 'D') {
                    a.intentionallyDistinctFrom++;
                }
                // R link
                else if (!link.data.category) {
                    // track keys of related things so we don't count them multiple times
                    if (link.fromNode == thing) {
                        rConnectedThingKeys.push(link.toNode.data.key);
                    } else if (link.toNode == thing) {
                        rConnectedThingKeys.push(link.fromNode.data.key);
                    }
                }
            }
            a.relatedTo = _.uniq(rConnectedThingKeys).length;

            // isRelationship
            a.isRelationship = thing.isLinkLabel;
        } else if (part && part instanceof go.Link) {
            var rel = part;

            // thing names
            a.rFromThingName = rel.fromNode.data.text;
            a.rToThingName = rel.toNode.data.text;

            // is R thing
            a.isRThing = rel.isLabeledLink;

            // is R system
            a.isRSystem = rel.isLabeledLink && countGroups(rel.labelNodes.first()) > 0;

            // is R point
            a.isRPoint = rel.isLabeledLink && isPoint(rel.labelNodes.first());

            // is R view
            a.isRView = rel.isLabeledLink && isView(rel.labelNodes.first());
        }
    };

    // returns either the containingGroup or the rThingContainingGroup, whichever is non-null
    function getContainingGroup(group) {
        return group.containingGroup || getRThingContainingGroup(group);
    }

    // if group is an R-thing between two sibling parts of a whole, returns the whole; else returns null
    function getRThingContainingGroup(group) {
        if (group.isLinkLabel) {
            var fromParent = group.labeledLink.fromNode.containingGroup;
            var toParent = group.labeledLink.toNode.containingGroup;
            if (fromParent !== null && toParent !== null && fromParent == toParent) {
                return fromParent;
            }
        }
        return null;
    }

    // counts the member parts of the group that are groups, recursively (not including the group itself)
    function countGroups(group) {
        var count = 0;
        var it = getMemberGroups(group).iterator;
        while (it.next()) {
            var part = it.value;
            count += 1 + countGroups(part);
        }

        return count;
    }

    // returns the collection of groups that are either a memberPart of this group, or an R-thing between sibling memberParts
    function getMemberGroups(group) {
        var members = new go.List();
        var it = group.memberParts;
        while (it.next()) {
            var part = it.value;
            if (part instanceof go.Group) {
                members.add(part);
                var rthing = getRThingToSibling(part); // NB: should not get duplication here, as this checks for r-things in only one direction
                if (rthing) {
                    members.add(rthing);
                }
            }
        }
        return members;
    }

    // if the group is linked by an R-thing to a sibling (with the group as the fromNode), returns the R-thing; else returns null
    function getRThingToSibling(group) {
        var it = group.findLinksOutOf();
        while (it.next()) {
            var link = it.value;
            if (link.labelNodes.count > 0 && link.toNode.containingGroup == group.containingGroup) {
                return link.labelNodes.first();
            }
        }
        return null;
    }

    function isPoint(group) {
        var it = group.findLinksOutOf();
        while (it.next()) {
            var link = it.value;
            if (link.data.category == 'P') {
                return true;
            }
        }
        return false;
    }

    function isView(group) {
        var it = group.findLinksInto();
        while (it.next()) {
            var link = it.value;
            if (link.data.category == 'P') {
                return true;
            }
        }
        return false;
    }
};

},{}],5:[function(require,module,exports){
// functions handling attachments

'use strict';

window.SandbankEditor.Attachments = function ($scope, map) {

    var self = this;

    this.selectedThing = null;
    this.attachments = null;

    this.attachmentTypes = [{ name: 'note', labelSingular: 'Note', labelPlural: 'Notes' }, { name: 'link', labelSingular: 'Web Link', labelPlural: 'Web Links' }, { name: 'task', labelSingular: 'Task', labelPlural: 'Tasks' }, { name: 'map', labelSingular: 'Linked MetaMap', labelPlural: 'Linked MetaMaps' }
    //        {name: 'doc', labelSingular: 'Document', labelPlural: 'Documents'}  // limit overall storage space OR simpler rules?
    // limit file types - pdf, jpg, gif, png, office?...  whitelist vs. blacklist
    ];

    this.init = function () {};

    this.handleDiagramEvent = function (eventName, e) {
        if (eventName == 'ChangedSelection') {
            if (map.getUi().currentTabIs(map.getUi().TAB_ID_ATTACHMENTS)) {
                self.stopEditingAll();
                self.saveAttachments();
                self.loadSelectedThingAttachments();
            }
        }
    };

    // called when a tab is opened or closed
    this.currentTabChanged = function (newValue, oldValue) {
        if (newValue == map.getUi().TAB_ID_ATTACHMENTS) {
            // opening tab
            self.loadSelectedThingAttachments();
        }
        if (oldValue == map.getUi().TAB_ID_ATTACHMENTS) {
            // closing tab
            self.saveAttachments();
        }
    };

    this.loadSelectedThingAttachments = function () {
        $scope.safeApply(function () {
            if (map.thingSelected()) {
                self.selectedThing = map.getUniqueThingSelected();
                self.attachments = self.selectedThing.data.attachments;
                if (self.attachments === undefined) {
                    self.attachments = [];
                }
            }
        });
    };

    // set all attachments to editing = false
    this.stopEditingAll = function () {
        $scope.safeApply(function () {
            if (self.attachments) {
                _.each(self.attachments, function (att) {
                    att.editing = false;
                });
            }
        });
    };

    this.editingAnItem = function () {
        return self.attachments && _.findWhere(self.attachments, { editing: true }) !== undefined;
    };

    // set all other attachments to editing = false
    this.startEditing = function (attachment) {
        $scope.safeApply(function () {
            self.stopEditingAll();
            attachment.editing = true;
        });
    };

    this.saveItem = function (attachment) {
        $scope.safeApply(function () {
            attachment.editing = false;
            self.saveAttachments();
        });
    };

    this.saveAttachments = function () {
        $scope.safeApply(function () {
            console.log('saveAttachments, selected: ' + self.selectedThing);
            if (self.selectedThing) {
                map.getDiagram().model.setDataProperty(self.selectedThing.data, 'attachments', self.attachments);
                self.selectedThing.updateTargetBindings();
            }
            map.getAutosave().saveNow('edit_attachments');
        });
    };

    this.listAttachments = function (type) {
        var atts = _.where(self.attachments, { type: type });
        return atts;
    };

    this.addAttachment = function (type) {
        var item = { type: type, editing: true };
        if (type == 'note') {
            self.attachments.push(_.extend(item, { text: '', url: '' }));
        } else if (type == 'link') {
            self.attachments.push(_.extend(item, { label: '', url: '' }));
        } else if (type == 'task') {
            self.attachments.push(_.extend(item, { text: '' }));
        } else if (type == 'doc') {
            self.attachments.push(_.extend(item, { name: '' }));
        } else if (type == 'map') {
            self.attachments.push(_.extend(item, { mapRef: { id: 0, name: '' } }));
        }
    };

    this.isValid = function (attachment) {
        if (attachment.type == 'link') {
            return attachment.label && attachment.url && attachment.label.trim() !== '' && attachment.url.trim() !== '';
        } else if (attachment.type == 'note') {
            return attachment.text && attachment.text.trim() !== '';
        } else if (attachment.type == 'task') {
            return attachment.text && attachment.text.trim() !== '';
        } else if (attachment.type == 'doc') {
            return attachment.name && attachment.name.trim() !== '';
        } else if (attachment.type == 'map') {
            return attachment.mapRef && attachment.mapRef.id !== null && attachment.mapRef.id !== undefined;
        }
    };

    this.deleteAttachment = function (att) {
        var typeLabel = _.findWhere(self.attachmentTypes, { name: att.type }).labelSingular;
        if (confirm('Delete ' + typeLabel + '?')) {
            var i = _.indexOf(self.attachments, att);
            self.attachments.splice(i, 1);
        }
    };

    // query server for maps containing the given text in the map name
    this.getOtherMaps = function (viewValue) {
        // NB: this URL is constructed to match the one generated by the search form on the maps page...
        var url = '/maps/visible_maps.json?utf8=%E2%9C%93&q%5Bname_cont%5D=' + viewValue;
        return $http.get(url).then(function (response) {
            return response.data.maps;
        });
    };

    this.otherMapSelected = function (viewValue, modelValue) {
        console.log('otherMapSelected, viewValue: ' + viewValue.id + ', modelValue: ' + modelValue);
    };

    this.formatOtherMap = function (model) {
        return model ? model.name : '';
    };
};

},{}],6:[function(require,module,exports){
// functions handling editor autosave function

'use strict';

SandbankEditor.Autosave = function (editor, map) {

    var self = this;

    var $http = {
        put: function put() {
            return new Promise(function (fulfill, reject) {});
        }
    };

    var changeTypes = [];

    this.saveOnModelChanged = true;

    // do a save next time the set interval passes with no save requests
    this.save = function (changeType) {
        changeTypes.push(changeType);
        delayedAutosave();
    };

    // do a save right now
    this.saveNow = function (changeType) {
        changeTypes.push(changeType);
        autosave();
    };

    // don't let autosave be triggered more than every N milliseconds...
    var delayedAutosave = _.debounce(autosave, 2000);

    // compile the current list of change type descriptions, process them
    // to remove duplicates, and save the current data
    function autosave() {
        // stop right here if we're in the sandbox and/or we don't have edit permissions
        if (editor.sandbox || !editor.canEdit) {
            return;
        }

        if (!changeTypes.length) {
            console.log('autosave: nothing to save!'); // shouldn't happen
            return;
        }

        // de-dupe the list of change types
        var changeList = _.uniq(changeTypes);
        //console.log('changeList: ' + changeList);
        // don't show move events unless that's all we have
        var changeListWithoutMoves = _.without(changeList, 'move');
        if (changeListWithoutMoves.length > 0) {
            changeList = changeListWithoutMoves;
        }
        //console.log('changeList without moves: ' + changeList);
        // get descriptions
        var descriptionList = _.map(changeList, function (ct) {
            return _.result(changeDescriptions, ct);
        });

        //console.log('autosave, changeList: ' + changeList + ', descriptionList: ' + descriptionList);
        var postData = {
            'name': editor.mapTitle,
            'data': map.getDiagram().model.toJson(),
            'state_data': JSON.stringify(map.getUi().getStateData()),
            'editor_options': JSON.stringify(map.getUi().getMapEditorOptions()),
            'presenter_slides': map.getPresenter().getSlideCount(),
            'activity_slides': map.getPresenter().getActivitySlideCount(),
            'change_type': changeList.join(';'),
            'change_description': descriptionList.join('; '),
            'thumbnail_png': map.getPresenter().getMapThumbnail()
        };
        var url = editor.mapUrl + '.json';

        editor.updateEditStatus(editor.SAVING);
        $http.put(url, postData).then(function (response) {
            changeTypes = [];
            editor.updateEditStatus(editor.SAVE_OK);
            // load returned data for analytics, points, badges, versions
            editor.map.loadMapExtraData(response.data.map);
        }, function () {
            editor.updateEditStatus(editor.SAVE_FAILED);
        });
    }

    // -------------- handle model changes - trigger autosave ------------------

    var changeDescriptions = {
        move: 'Moved Objects',
        undo_redo: 'Performed Undo/Redo',
        edit_title: 'Edited MetaMap Title',
        edit_description: 'Edited MetaMap Description',
        edit_usertags: 'Edit MetaMap Tags',
        edit_d: 'Edited Distinctions',
        edit_s: 'Edited Systems',
        edit_r: 'Edited Relationships',
        edit_p: 'Edited Perspectives',
        add_thing: 'Added Ideas',
        rename_thing: 'Renamed Ideas',
        delete_thing: 'Deleted Ideas',
        edit_attachments: 'Edited Attachments',
        edit_presenter: 'Edited Presenter Slides',
        edit_generator: 'Inserted Ideas from ThinkQuery',
        edit_standards: 'Edited Links to Common Core Standards'
    };

    // e is a go.ChangedEvent
    this.modelChanged = function (e) {

        if (!self.saveOnModelChanged) {
            return;
        }

        var changeType = null;
        var changeDescription = null;

        if (e.propertyName == 'type') {
            // change R type
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,n,1,o,2,A,3,r,4,r,5,o,6,w,7,s] , newParam: null, newValue: [0,t,1,o] , propertyName: type
            changeType = 'edit_r';
            changeDescription = 'Changed Relationship Types';
        } else if (e.propertyName == 'layout') {
            // change system layout
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,l,1,e,2,f,3,t] , newParam: null, newValue: [0,r,1,i,2,g,3,h,4,t] , propertyName: layout
            changeType = 'edit_s';
        } else if (e.change == go.ChangedEvent.Insert && propertyEquals(e.newValue, 'fromPort', 'R')) {
            // add link
            // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 1, newValue: [type,noArrows,__gohashid,6005,from,-2,to,-4,labelKeys,,fromPort,R,toPort,P] , propertyName: linkDataArray
            // modelChange: linkToPortId, change: ChangedEvent.Property, oldParam: null, oldValue: [0,P] , newParam: null, newValue: [0,R] , propertyName: toPort
            changeType = 'edit_r';
        } else if (e.change == go.ChangedEvent.Remove && propertyEquals(e.oldValue, 'fromPort', 'R')) {
            // delete link
            // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 1, oldValue: [type,noArrows,__gohashid,6005,from,-2,to,-4,labelKeys,,fromPort,R,toPort,R] , newParam: null, newValue: [] , propertyName: linkDataArray
            changeType = 'edit_r';
        } else if (e.propertyName == 'linkDataArray') {
            // change P/D links
            // add P link
            // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 2, newValue: [type,noArrows,__gohashid,19122,from,-2,to,-4,labelKeys,,fromPort,P,toPort,P] , propertyName: linkDataArray
            // modelChange: linkCategory, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,P] , propertyName: category
            // delete P link
            // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 2, oldValue: [type,noArrows,__gohashid,19122,from,-2,to,-4,labelKeys,,fromPort,P,toPort,P,category,P] , newParam: null, newValue: [] , propertyName: linkDataArray
            // add D link
            // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 1, newValue: [from,-7,to,-5,fromPort,D,toPort,D,category,D,__gohashid,19522] , propertyName: linkDataArray
            // remove D link
            // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 1, oldValue: [from,-7,to,-5,fromPort,D,toPort,D,category,D,__gohashid,19522] , newParam: null, newValue: [] , propertyName: linkDataArray

            if (e.newValue && e.newValue.category == 'P' || e.oldValue && e.oldValue.category == 'P') {
                changeType = 'edit_p';
            } else if (e.newValue && e.newValue.category == 'D' || e.oldValue && e.oldValue.category == 'D') {
                changeType = 'edit_d';
            }
        } else if (e.propertyName == 'category') {
            // add P link
            // modelChanged, modelChange: linkCategory, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,P] , propertyName: category
            changeType = 'edit_p';
        } else if (e.propertyName == 'group') {
            // drag into S
            // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group
            // reorder part
            // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group
            // drag to D
            // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group

            changeType = 'edit_s';
        } else if (e.propertyName == 'nodeDataArray' && e.change == go.ChangedEvent.Insert && propertyEquals(e.newValue, 'isGroup', true)) {
            // add thing
            // modelChange: nodeDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 5, newValue: [text,New Idea,isGroup,true,level,0,layout,left,sExpanded,true,pExpanded,false,dExpanded,false,__gohashid,54688,group,,key,-7] , propertyName: nodeDataArray
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,2,1,2,2,8,3,.,4,5,5,6,6,2,7,5,8, ,9,-,10,1,11,4,12,9,13,.,14,6,15,8,16,7,17,5] , propertyName: loc
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: children
            changeType = 'add_thing';
        } else if (e.propertyName == 'text') {
            // move thing
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,b,1,b,2,b,3,b,4,b] , newParam: null, newValue: [0,a,1,a,2,a,3,a,4,a] , propertyName: text
            changeType = 'rename_thing';
            changeDescription = 'Renamed Ideas';
        } else if (e.propertyName == 'nodeDataArray' && e.change == go.ChangedEvent.Remove && propertyEquals(e.oldValue, 'isGroup', true)) {
            // delete thing
            // modelChange: nodeDataArray, change: ChangedEvent.Remove, oldParam: 5, oldValue: [text,New Idea,isGroup,true,level,0,layout,left,sExpanded,true,pExpanded,false,dExpanded,false,__gohashid,54688,group,,key,-7,loc,228.5625 -149.6875,children,0,attachments,] , newParam: null, newValue: [] , propertyName: nodeDataArray
            changeType = 'delete_thing';
        } else if (e.propertyName == 'nodeDataArray' && e.change == go.ChangedEvent.Insert && propertyEquals(e.newValue, 'isGroup', false)) {
            // add slide
            // modelChange: nodeDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 5, newValue: [key,slide-0,category,slide,index,0,isGroup,false,width,200,height,200,loc,156.5625 -97.6875,level,0,children,0,title,,notes,,__gohashid,63877] , propertyName: nodeDataArray
            changeType = 'edit_presenter';
        } else if (e.propertyName == 'nodeDataArray' && e.change == go.ChangedEvent.Remove && propertyEquals(e.oldValue, 'isGroup', false)) {
            // delete slide
            //modelChange: nodeDataArray, change: ChangedEvent.Remove, oldParam: 5, oldValue: [key,slide-0,category,slide,index,0,isGroup,false,width,200,height,200,loc,156.5625 -97.6875,level,0,children,0,title,,notes,,__gohashid,63877,$$hashKey,0XN] , newParam: null, newValue: [] , propertyName: nodeDataArray
            changeType = 'edit_presenter';
        } else if (e.propertyName == 'loc' || e.propertyName == 'width' || e.propertyName == 'height') {
            // move thing or resize slide
            // move slide
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,2,1,4,2,3,3, ,4,-,5,1,6,2,7,8] , newParam: null, newValue: [0,2,1,4,2,3,3, ,4,-,5,1,6,2,7,7] , propertyName: loc
            // resize slide
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: height
            // move thing
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,4,1,7,2,9,3,.,4,8,5,7,6,5,7, ,8,-,9,1,10,2,11,2,12,.,13,8,14,7,15,5] , newParam: null, newValue: [0,5,1,4,2,0,3,.,4,3,5,1,6,2,7,5,8, ,9,-,10,1,11,2,12,1,13,.,14,1,15,8,16,7,17,5] ,            
            changeType = 'move';
        } else if (e.propertyName == 'level' || e.propertyName == 'children') {
            // these attributes are updated as a result of other actions; ignore
            changeType = null;
        } else if (e.propertyName == 'attachments') {
            // edited attachments
            changeType = 'edit_attachments';
        } else if (e.propertyName == 'sExpanded' || e.propertyName == 'pExpanded') {
            // ignore expand/collapse
            changeType = 'move';
        } else if (e.propertyName == 'FinishedUndo' || e.propertyName == 'FinishedRedo') {
            changeType = 'undo_redo';
            map.refresh();
        } else if (e.change != go.ChangedEvent.Transaction) {
            console.log('modelChanged, modelChange: ' + e.modelChange + ', change: ' + e.change + ', oldParam: ' + e.oldParam + ', oldValue: [' + _.pairs(e.oldValue) + '] ' + ', newParam: ' + e.newParam + ', newValue: [' + _.pairs(e.newValue) + '] ' + ', propertyName: ' + e.propertyName);
        }

        if (changeType) {
            map.getAnalytics().updateContextualAnalytics();
            //console.log('calling delayedAutosave, changeType: ' + changeType);
            self.save(changeType);
        }
    };

    // convenience function for checking properties
    function propertyEquals(obj, key, value) {
        return obj !== null && _.has(obj, key) && _.result(obj, key) == value;
    }
};

},{}],7:[function(require,module,exports){
// main controller class

'use strict';

window.SandbankEditor = {};

window.MapEditorCtrl = function () {

    var ret = {};

    ret.map = new SandbankEditor.Map(ret);

    // window.mapData is set in _form view
    var metadata = window.mapData.map.metadata;
    ret.sandbox = metadata.sandbox;
    ret.mapData = window.mapData.map.data; // this gets overwritten by load() unless we are in the sandbox with no map ID
    ret.mapId = metadata.id;
    ret.mapTitle = metadata.name;
    ret.mapUserTags = metadata.userTags;
    ret.mapUrl = metadata.url;
    ret.canEdit = metadata.canEdit;
    ret.updatedAt = metadata.updatedAt;
    ret.updatedBy = metadata.updatedBy; // ID
    ret.updatedByName = metadata.updatedByName;

    ret.editingTitle = false;

    ret.showImageExport = false;
    ret.imageExportLoading = true;

    ret.currentTab = null;

    // override parent scope (see user.js) since we're editing a map
    //$scope.ccsTagging.mapId = $scope.mapId;

    ret.maybeStartEditingTitle = function () {
        if (ret.canEdit) {
            ret.editingTitle = true;
        }
    };

    ret.doneEditingTitle = function () {
        //console.log('doneEditingTitle');
        ret.editingTitle = false;
        ret.map.getAutosave().save('edit_title');
    };

    ret.editingTitleKeypress = function (e) {
        if (e.which == 13) {
            ret.doneEditingTitle();
        }
    };

    ret.print = function () {
        window.print();
    };

    // ------------- edit status message for header bar ------------------

    ret.editStatus = '';

    ret.LAST_UPDATED = '';
    ret.READ_ONLY = 'View only';
    ret.SAVING = 'Saving...';
    ret.SAVE_OK = 'All changes saved';
    ret.SAVE_FAILED = 'Changes could not be saved';

    ret.updateEditStatus = function (s) {
        //console.log('updateEditStatus: ' + s);
        ret.editStatus = s;
        if (s == ret.SAVE_FAILED) {
            alert('Changes could not be saved - please check your network connection.');
        } else if (s == ret.LAST_UPDATED) {
            var time = moment(ret.updatedAt).fromNow();
            var by = '';
            if (ret.updatedBy == ret.userId) {
                by = 'by me';
            } else if (ret.updatedByName) {
                by = 'by ' + ret.updatedByName;
            }
            // TODO: show 'by me' only for editable shared maps?

            ret.editStatus = 'Last updated ' + time + ' ' + by;
        }

        // Last edit was XX ago by YY
    };

    // -------------------------------------------------------------

    function init() {
        ret.map.init();

        if (!ret.sandbox) {}

        if (ret.mapUrl) {
            ret.map.load();
        } else {
            ret.map.loadForSandbox();
        }

        ret.addBehaviors();
        ret.handleNavigation();
        ret.handleBackspace();
    }

    // misc. UI behaviors for tooltips, popups etc.
    // TODO: figure out which of these need to be reapplied after dynamic data changes (e.g. LessonBook popovers)
    ret.addBehaviors = function () {};

    ret.handleNavigation = function () {
        // cross-browser tweaks:
        try {
            // http://www.opera.com/support/kb/view/827/
            opera.setOverrideHistoryNavigationMode('compatible');
            history.navigationMode = 'compatible';
        } catch (e) {}

        // install before-unload handler:

        function exitMessage() {
            return 'Navigating away from your Map will cause any unsaved changes to be lost ' + '(any changes you make are automatically saved, but it takes a couple of seconds).';
        }

        //        $(window).bind('beforeunload', exitMessage);

        // prevent exit prompt when the user deliberately navigates away:

        $('#header-right a').click(function () {
            $(window).unbind('beforeunload', exitMessage);
        });
    };

    ret.handleBackspace = function () {
        var BACKSPACE = 8;

        $(document).on('keydown', function (event) {
            if (event.keyCode === BACKSPACE) {
                if (!$('body :focus').is(':input')) {
                    // prevent accidental backspace when no input has focus:
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });
    };

    ret.safeApply = function (fn) {
        if (fn && typeof fn === 'function') {
            fn();
        }
    };

    ret.isTouchDevice = function () {
        return false;
    };

    init();

    return ret;
};

// overview diagram
//var overview = go.GraphObject.make(go.Overview, "overview-diagram", {
//    observed: $scope.map.getDiagram(),
//    contentAlignment: go.Spot.Center
//});
//var outline = overview.box.elements.first();
//outline.stroke = "#333";

// NOTE: we have to use regular bootstrap tooltips for toolbar buttons (instead of ng-bootstrap ones)
// so we can turn them off for mobile. We also put the tooltips on wrappers rather than on the actual
// buttons, so we can avoid the issue of stuck tooltips if a button gets disabled while the tooltip is showing.

//if (!ret.isTouchDevice()) {
//    // $('.tooltip-wrapper').tooltip({
//    //     placement: 'top',
//    //     container: 'body'
//    // });

//    // $('.dropdown-menu .btn').tooltip({
//    //     placement: 'left',
//    //     container: 'body'
//    // }); // for layout options

//    $('header, #map-title').hover(
//        function() {
//            $('body.presenter-playing').addClass('hide-header');
//        },
//        function() {
//            $('body.presenter-playing').removeClass('hide-header');
//        }
//    );
//}

// no biggie.

},{}],8:[function(require,module,exports){
'use strict';

window.SandbankEditorOptions = {};

SandbankEditorOptions = function ($scope) {

    this.openModal = function (_options, _onSaveDefaults, _onUpdate) {
        var modalInstance = $modal.open({
            templateUrl: 'template_editor_options_modal.html', // see views/maps/_template_editor_options_modal
            backdrop: 'static',
            controller: optionsModalCtrl,
            windowClass: 'options-modal',
            resolve: {
                options: function options() {
                    return _options;
                },
                onSaveDefaults: function onSaveDefaults() {
                    return _onSaveDefaults;
                },
                onUpdate: function onUpdate() {
                    return _onUpdate;
                }
            }
        });

        modalInstance.result.then(function () {});
    };

    // --------------- controller for options modal ---------------------

    var optionsModalCtrl = function optionsModalCtrl($scope, $modalInstance, options, onSaveDefaults, onUpdate) {

        $scope.options = options;

        $scope.setDefaults = {
            value: false
        };

        $scope.ok = function () {
            onUpdate($scope.options);
            if ($scope.setDefaults.value) {
                onSaveDefaults($scope.options);
            }
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
};

},{}],9:[function(require,module,exports){
// functions for the generator (aka ThinkQuery)

'use strict';

var GeneratorCtrl = function GeneratorCtrl($scope) {

    var map = $scope.map;
    var diagram = $scope.map.getDiagram();

    $scope.concept1 = '';
    $scope.concept2 = '';

    $scope.echoConcept1 = function () {
        return $scope.concept1 || '...';
    };

    $scope.echoConcept2 = function () {
        return $scope.concept2 || '...';
    };

    $scope.swapConcepts = function () {
        var tmp = $scope.concept1;
        $scope.concept1 = $scope.concept2;
        $scope.concept2 = tmp;
        $scope.safeApply();
    };

    $scope.mapIt = function (question) {
        startSpinner();
        diagram = map.getDiagram();
        map.getAutosave().saveOnModelChanged = false;

        if ($scope.sandbox) {
            diagram.clear();
        }

        // figure out location for inserted stuff
        var db = map.computeMapBounds();
        var x = db.x + db.width + 200;
        var y = db.y;
        if (isNaN(x) || isNaN(y)) {
            x = y = 0;
        }
        //console.log('x, y: ' + x + ', ' + y);

        // insert the stuff and deselect it
        question(x, y);
        diagram.clearSelection();

        diagram.updateAllTargetBindings();
        diagram.layoutDiagram(true);

        map.getUi().resetZoom();

        map.getAutosave().saveOnModelChanged = true;
        map.getAutosave().save('edit_generator');
        stopSpinner();
    };

    $scope.selectedQuestion = null;

    $scope.selectQuestion = function (question) {
        $scope.selectedQuestion = question;
        if ($scope.sandbox) {
            $scope.mapIt(question);
        }
    };

    $scope.surpriseMe = function () {
        var keys = _.keys($scope.queries);
        var i = _.random(0, keys.length - 1);
        var question = $scope.queries[keys[i]];
        $scope.selectedQuestion = question;
        $scope.mapIt(question);

        $('#questions').animate({ scrollTop: i * 30 }, 1000);
    };

    // ---------- functions for creating each of the structures - see views/maps/generator_tab -----------

    $scope.queries = {

        WHAT_IS: function WHAT_IS(x, y) {
            // 1
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            diagram.model.setDataProperty(thing1.data, 'dflag', true);
            map.createChild(thing1, 'is?');
            map.createChild(thing1, 'is?');
            map.createChild(thing1, 'is?');
        },

        WHAT_IS_NOT: function WHAT_IS_NOT(x, y) {
            // 2
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            diagram.model.setDataProperty(thing1.data, 'dflag', true);
            map.createChild(thing1, 'is not?');
            map.createChild(thing1, 'is not?');
            map.createChild(thing1, 'is not?');
        },

        DISTINGUISH_BETWEEN: function DISTINGUISH_BETWEEN(x, y) {
            // 3
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            diagram.model.setDataProperty(thing1.data, 'dflag', true);
            map.createChild(thing1, 'is?');
            map.createChild(thing1, 'is?');
            map.createChild(thing1, 'is?');

            var thing2 = map.createThing(x + 250, y, $scope.echoConcept2());
            diagram.model.setDataProperty(thing2.data, 'dflag', true);
            map.createChild(thing2, 'is?');
            map.createChild(thing2, 'is?');
            map.createChild(thing2, 'is?');
        },

        COMPARE_CONTRAST: function COMPARE_CONTRAST(x, y) {
            // 4
            var thing1 = map.createThing(x - 150, y, $scope.echoConcept1());
            var thing2 = map.createThing(x + 150, y, $scope.echoConcept2());
            diagram.model.setDataProperty(thing1.data, 'dflag', true);
            diagram.model.setDataProperty(thing2.data, 'dflag', true);
            var rthing1 = map.createRLinkWithRThing(thing1, thing2, 'contrast');
            var rthing2 = map.createRLinkWithRThing(thing1, thing2, 'compare');
            diagram.model.setDataProperty(rthing1.labeledLink.data, 'type', 'toFrom');
            diagram.model.setDataProperty(rthing2.labeledLink.data, 'type', 'toFrom');
        },

        PARTS_OF: function PARTS_OF(x, y) {
            // 5
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            map.createChild(thing1, 'part?');
            map.createChild(thing1, 'part?');
            map.createChild(thing1, 'part?');
        },

        PART_OF: function PART_OF(x, y) {
            // 6
            var thing1 = map.createThing(x, y, 'part of?');
            map.createChild(thing1, $scope.echoConcept1());
        },

        PARTS_HAVE_PARTS: function PARTS_HAVE_PARTS(x, y) {
            // 7
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            var child1 = map.createChild(thing1, 'part?');
            map.createChild(child1, 'part?');
            map.createChild(child1, 'part?');
            var child2 = map.createChild(thing1, 'part?');
            map.createChild(child2, 'part?');
            map.createChild(child2, 'part?');
        },

        R_PARTS: function R_PARTS(x, y) {
            // 8
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            var thing2 = map.createThing(x + 250, y, $scope.echoConcept2());
            var rthing = map.createRLinkWithRThing(thing1, thing2, 'relationship?');
            map.createChild(rthing, 'part?');
            map.createChild(rthing, 'part?');
        },

        P_PARTS: function P_PARTS(x, y) {
            // 9
            var thing1 = map.createThing(x + 300, y, $scope.echoConcept1());
            var child1 = map.createChild(thing1, 'part seen from viewpoint of ' + $scope.echoConcept2() + '?');
            var child2 = map.createChild(thing1, 'part seen from viewpoint of ' + $scope.echoConcept2() + '?');
            var child3 = map.createChild(thing1, 'part seen from viewpoint of ' + $scope.echoConcept2() + '?');
            var thing2 = map.createThing(x, y, $scope.echoConcept2());
            map.createPLink(thing2, thing1);
            map.createPLink(thing2, child1);
            map.createPLink(thing2, child2);
            map.createPLink(thing2, child3);
        },

        RS_TO_AND_BY: function RS_TO_AND_BY(x, y) {
            // 10
            var related1 = map.createThing(x, y, 'related idea?');
            var related2 = map.createThing(x + 300, y + 50, 'related idea?');
            var related3 = map.createThing(x + 50, y + 300, 'related idea?');
            var thing = map.createThing(x + 130, y + 130, $scope.echoConcept1());
            map.createRLink(related1, thing);
            map.createRLink(related2, thing);
            map.createRLink(related3, thing);

            var thing1 = map.createThing(x + 500, y + 150, 'idea?');
            var thing2 = map.createThing(x + 750, y + 150, 'idea?');
            map.createRLinkWithRThing(thing1, thing2, $scope.echoConcept1());
        },

        WHAT_IS_R: function WHAT_IS_R(x, y) {
            // 11
            var thing1 = map.createThing(x, y, $scope.echoConcept1());
            var thing2 = map.createThing(x + 250, y, $scope.echoConcept2());
            map.createRLinkWithRThing(thing1, thing2, 'idea?');
        },

        PART_RS_ARE: function PART_RS_ARE(x, y) {
            // 12
            var thing1 = map.createThing(x + 30, y, $scope.echoConcept1(), 'freehand');
            var child1 = map.createChild(thing1, 'part?');
            var child2 = map.createChild(thing1, 'part?');
            var child3 = map.createChild(thing1, 'part?');
            diagram.model.setDataProperty(child1.data, 'loc', '-20 110');
            diagram.model.setDataProperty(child2.data, 'loc', '80 110');
            diagram.model.setDataProperty(child3.data, 'loc', '30 190');
            map.createRLinkWithRThing(child1, child2, 'relationship?');
            map.createRLinkWithRThing(child2, child3, 'relationship?');
            map.createRLinkWithRThing(child3, child1, 'relationship?');
        },

        PART_RS_EXIST: function PART_RS_EXIST(x, y) {
            // 13
            var thing1 = map.createThing(x, y, $scope.echoConcept1(), 'right');
            var child11 = map.createChild(thing1, 'part?');
            var child12 = map.createChild(thing1, 'part?');
            var child13 = map.createChild(thing1, 'part?');
            var thing2 = map.createThing(x + 250, y, $scope.echoConcept2());
            var child21 = map.createChild(thing2, 'part?');
            var child22 = map.createChild(thing2, 'part?');
            var child23 = map.createChild(thing2, 'part?');
            map.createRLink(thing1, thing2);
            map.createRLinkWithRThing(child11, child21, 'relationship?');
            map.createRLinkWithRThing(child12, child22, 'relationship?');
            map.createRLinkWithRThing(child13, child23, 'relationship?');
        },

        RS_WITH_OTHERS: function RS_WITH_OTHERS(x, y) {
            // 14
            var thing1 = map.createThing(x - 200, y, $scope.echoConcept1());
            var thing2 = map.createThing(x + 200, y, $scope.echoConcept2());
            var thing3 = map.createThing(x - 200, y + 200, 'another thing');
            var thing4 = map.createThing(x + 200, y + 200, 'another thing');
            map.createRLinkWithRThing(thing1, thing2, 'relationship?');
            map.createRLinkWithRThing(thing1, thing3, 'relationship?');
            map.createRLinkWithRThing(thing1, thing4, 'relationship?');
            map.createRLinkWithRThing(thing2, thing4, 'relationship?');
            map.createRLinkWithRThing(thing3, thing4, 'relationship?');
        },

        PARTS_OF_P: function PARTS_OF_P(x, y) {
            // 15
            var thing1 = map.createThing(x - 100, y, $scope.echoConcept1());
            var child1 = map.createChild(thing1, 'part?');
            var child2 = map.createChild(thing1, 'part?');
            var child3 = map.createChild(thing1, 'part?');
            var thing2 = map.createThing(x + 100, y, $scope.echoConcept2());
            map.createPLink(thing1, thing2);
        },

        POINT_FOR: function POINT_FOR(x, y) {
            // 16
            var thing = map.createThing(x, y, 'new perspective');
            var thing1 = map.createThing(x - 150, y + 150, $scope.echoConcept1());
            var thing2 = map.createThing(x + 150, y + 150, $scope.echoConcept2());
            var rthing = map.createRLinkWithRThing(thing1, thing2, 'relationship?');
            map.createPLink(thing, rthing);
        },

        HAS_MULTIPLE_PS: function HAS_MULTIPLE_PS(x, y) {
            // 17
            var point1 = map.createThing(x, y + 50, 'viewpoint?');
            var point2 = map.createThing(x + 250, y, 'viewpoint?');
            var point3 = map.createThing(x + 500, y + 50, 'viewpoint?');
            var view = map.createThing(x + 250, y + 250, $scope.echoConcept1());
            map.createPLink(point1, view);
            map.createPLink(point2, view);
            map.createPLink(point3, view);
        },

        PARTS_FROM_MULTIPLE_PS: function PARTS_FROM_MULTIPLE_PS(x, y) {
            // 18
            var point1 = map.createThing(x - 100, y, 'viewpoint?');
            var point2 = map.createThing(x - 100, y + 125, 'viewpoint?');
            var point3 = map.createThing(x - 100, y + 250, 'viewpoint?');
            var thing = map.createThing(x + 150, y + 25, $scope.echoConcept1());
            var child1 = map.createChild(thing, 'part seen from viewpoint?');
            var child2 = map.createChild(thing, 'part seen from viewpoint?');
            var child3 = map.createChild(thing, 'part seen from viewpoint?');
            map.createPLink(point1, child1);
            map.createPLink(point1, child2);
            map.createPLink(point2, child2);
            map.createPLink(point3, child3);
        },

        WHAT_ABOUT: function WHAT_ABOUT(x, y) {
            // 19
            $scope.queries.WHAT_IS(x, y);
            $scope.queries.PARTS_OF(x + 300, y);
            $scope.queries.PARTS_FROM_MULTIPLE_PS(x + 700, y);
            $scope.queries.RS_TO_AND_BY(x, y + 400);
        }
    }; // queries
};

SandbankEditor.Generator = function ($scope, map) {

    this.init = function () {};

    // called when a tab is opened or closed
    this.currentTabChanged = function (newValue, oldValue) {
        if (oldValue == map.getUi().TAB_ID_GENERATOR) {
            // closing tab
            map.setEditingBlocked(false);
        } else if (newValue == map.getUi().TAB_ID_GENERATOR) {
            // opening tab
            map.setEditingBlocked(true);
        }
    };

    // these get filtered out in LessonBook
    this.getPlaceholderIdeaNames = function () {
        return ['is?', 'is not?', 'part?', 'viewpoint?', 'related idea?', 'idea?', 'part seen from viewpoint?', 'contrast?', 'comparison?', 'relationship?'];
    };
};

// NB: generator is opened on load of empty map; see map.js:load()

},{}],10:[function(require,module,exports){
// layouts used in the editor, for the diagram or individual Groups, plus layout-related functions

'use strict';

SandbankEditor.Layouts = function (editor, map) {

    var self = this;

    this.init = function () {};

    this.handleDiagramEvent = function (eventName, e) {
        var diagram = map.getDiagram();
        if (eventName == 'InitialLayoutCompleted') {
            diagram.updateAllTargetBindings();
            diagram.layoutDiagram(true);
        } else if (eventName == 'SelectionMoved') {
            updateSelectedPartLocationData(e);
            map.getDiagram().layoutDiagram(true);
        } else if (eventName == 'SelectionDeleted') {
            diagram.updateAllTargetBindings();
        } else if (eventName == 'PartCreated') {} else if (eventName == 'PartResized') {
            setResizedPartDimensionData(e);
        } else if (eventName == 'LinkDrawn') {
            adjustLinkLayout(e.subject);
        } else if (eventName == 'LinkRelinked') {
            adjustLinkLayout(e.subject);
        }
    };

    // ------------ handle location/size attributes for nodes ---------------

    // only update w/h for slides, as all other node types have fixed dimensions according to the templates
    function setResizedPartDimensionData(e) {
        var diagram = map.getDiagram();
        var node = e.subject;
        if (node && node.category == 'slide') {
            //console.log('PartResized: ' + node.part.actualBounds);
            diagram.model.setDataProperty(node.data, 'width', node.part.actualBounds.width);
            diagram.model.setDataProperty(node.data, 'height', node.part.actualBounds.height);
        }
    }

    // set the 'loc' attribute for a new top-level node (created by double-clicking), to support freehand layout
    this.setNewPartLocationData = function (e) {
        var node = e.subject;
        if (node && node.part) {
            if (node instanceof go.Group) {
                map.getDiagram().model.setDataProperty(node.data, 'loc', node.part.location.x + ' ' + node.part.location.y);
            }
        }
    };

    // updates the 'loc' attribute for each selected part, to support freehand layout (does not apply to slides)
    function updateSelectedPartLocationData(e) {
        var diagram = map.getDiagram();
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Group) {
                // thing
                var part = it.value;
                var parentX = 0;
                var parentY = 0;
                if (part.containingGroup) {
                    parentX = part.containingGroup.location.x;
                    parentY = part.containingGroup.location.y;
                }
                console.log('moving group, subject: ' + e.subject + ', part: ' + part + ', height: ' + part.part.desiredSize.height + ', location: ' + part.part.location);
                if (!isNaN(part.location.x)) {
                    diagram.model.setDataProperty(part.data, 'loc', part.location.x - parentX + ' ' + (part.location.y - parentY));
                }
            }
        }
    }

    // ----------- changing layouts of things and their descendants ----------------

    this.fromAndToNodesAreVisible = function (link) {
        return link.fromNode && link.toNode && !self.hasCollapsedAncestor(link.fromNode) && !self.hasCollapsedAncestor(link.toNode);
    };

    this.labelNodeIsVisible = function (link) {
        return link.labelNodes.count && link.labelNodes.first().visible;
    };

    this.hasCollapsedAncestor = function (group) {
        while (true) {
            if (!group.containingGroup) {
                return false;
            } else if (!group.containingGroup.isSubGraphExpanded) {
                return true;
            } else {
                group = group.containingGroup;
            }
        }
    };

    // this.hasLinkLabelAncestor = function(group) {
    //     while (true) {
    //         if (!group.containingGroup) {
    //             return false;
    //         }
    //         else if (group.containingGroup.isLinkLabel) {
    //             return true;
    //         }
    //         else {
    //             group = group.containingGroup;
    //         }
    //     }
    // };

    this.getHighestAncestorWithLayout = function (group, layoutNames) {
        while (true) {
            if (!group.containingGroup) {
                return false;
            } else if (_.contains(layoutNames, group.containingGroup.data.layout)) {
                return group.containingGroup;
            } else {
                group = group.containingGroup;
            }
        }
    };

    this.areSistersInInventoryLayout = function (group1, group2) {
        return group1.containingGroup == group2.containingGroup && group1.containingGroup && _.contains(['left', 'right'], group1.containingGroup.data.layout);
    };

    this.isNotWithinInventoryLayout = function (group) {
        return !self.isWithinInventoryLayout(group);
    };

    this.isRThingWithinInventoryLayout = function (group) {
        return group.isLinkLabel && self.isWithinInventoryLayout(group);
    };

    this.isWithinInventoryLayout = function (group) {
        return self.isWithinLayout(group, ['left', 'right']);
    };

    this.isWithinLeftInventoryLayout = function (group) {
        return self.isWithinLayout(group, ['left']);
    };

    this.isWithinRightInventoryLayout = function (group) {
        return self.isWithinLayout(group, ['right']);
    };

    this.isWithinFreehandLayout = function (group) {
        return self.isWithinLayout(group, ['freehand']);
    };

    this.isWithinStackedLayout = function (group) {
        return self.isWithinLayout(group, ['stacked']);
    };

    this.isWithinLayout = function (group, layoutNames) {
        while (true) {
            if (!group.containingGroup) {
                //console.log('isWithinLayout: ' + group + 'layouts: ' + layoutNames.join() + ': false');
                return false;
            } else if (_.contains(layoutNames, group.containingGroup.data.layout)) {
                //console.log('isWithinLayout: ' + group + 'layouts: ' + layoutNames.join() + ': true');
                return true;
            } else {
                group = group.containingGroup;
            }
        }
    };

    this.showLeftTextBlock = function (group) {
        return self.isWithinRightInventoryLayout(group) && !self.isWithinStackedLayout(group) && !group.isLinkLabel;
    };

    this.showRightTextBlock = function (group) {
        return self.isWithinLeftInventoryLayout(group) && !self.isWithinStackedLayout(group) && !group.isLinkLabel;
    };

    this.setDescendantLayouts = function (group, layoutName) {
        if (layoutName == 'left' || layoutName == 'right' || layoutName == 'stacked') {
            var it = group.memberParts.iterator;
            while (it.next()) {
                var part = it.value;
                if (part instanceof go.Group && !part.isLinkLabel) {
                    part.data.layout = layoutName;
                    self.setDescendantLayouts(part, layoutName);
                }
            }
        } else if (layoutName == 'freehand') {}
    };

    this.disableLayoutForSelectedThings = function (layoutName) {
        var it = map.getDiagram().selection.iterator;
        if (!it.count) {
            return true;
        }
        while (it.next()) {
            if (!(it.value instanceof go.Group)) {
                return true;
            } else {
                var group = it.value;
                if (self.isWithinLayout(group, ['left', 'right', 'stacked'])) {
                    return true;
                }
            }
        }
        return false;
    };

    // -------------- scaling functions, etc. ----------------------

    // Computes the level of this group
    this.computeLevel = function (group) {
        //console.log('computeLevel, part: ' + part + ', containingGroup: ' + part.containingGroup);
        if (!(group instanceof go.Group) || group.containingGroup === null) {
            return 0;
        } else {
            return self.computeLevel(group.containingGroup) + 1;
        }
    };

    // gets the basic scaling for thing squares, by level
    function getThingScale(level) {
        return Math.pow(0.45, level); // 1, .45, .2025, .091125, ...
    }

    // this is only used for groups
    this.getScale = function (group, visitedGroupKeys) {
        if (group) {
            // keep track of groups we've visited to avoid infinite recursion
            // TODO: track down exactly how infinite loops are occurring,
            // or IF they still are since map.checkModel was introduced...
            if (visitedGroupKeys && Array.isArray(visitedGroupKeys)) {
                //console.log('visitedGroupKeys: ' + visitedGroupKeys);
                if (_.contains(visitedGroupKeys, group.data.key)) {
                    //console.log('hit already visited key: ' + group.data.key);
                    return 1;
                } else {
                    visitedGroupKeys.push(group.data.key);
                }
            } else {
                visitedGroupKeys = [group.data.key];
            }

            if (group.labeledLink) {
                // R-thing
                var fromScale = self.getScale(group.labeledLink.fromNode, visitedGroupKeys);
                var toScale = self.getScale(group.labeledLink.toNode, visitedGroupKeys);
                //console.log('getScale, fromScale: ' + fromScale + ', toScale: ' + toScale + ', visitedGroupKeys: ' + visitedGroupKeys.join(','));
                return Math.min(fromScale, toScale) * 0.5;
            } else if (group.containingGroup) {
                return self.getScale(group.containingGroup, visitedGroupKeys) * 0.45;
            } else {
                return getThingScale(self.computeLevel(group));
            }
        }
        return 1; // can occur when dragging R to empty space
    };

    // gets the margin to be used in stack layout between this group's children
    function getStackMargin(group) {
        return 10 / 0.45 * self.getScale(group);
    }

    // gets the margin to be used in stack layout between this group's children
    function getInventoryMargin(group) {
        if (self.computeLevel(group) <= 2) {
            return 10 * self.getScale(group);
        } else {
            return 3 * self.getScale(group);
        }
    }

    this.getExternalTextScale = function (group) {
        return 1 - 0.1 * self.computeLevel(group);
    };

    this.getLinkStrokeWidth = function (link) {
        var fromScale = self.getScale(link.fromNode);
        var toScale = self.getScale(link.toNode);
        return (link.isSelected ? 4 : 2) * Math.min(fromScale, toScale); // 2, .9, ...
    };

    // scale arrowheads based on the smallest to/from node,
    // or just the To node for P links
    this.getArrowheadScale = function (link) {
        var fromScale = self.getScale(link.fromNode);
        var toScale = self.getScale(link.toNode);
        var minScale = Math.min(fromScale, toScale);
        //console.log("getArrowheadScale, fromScale: ", fromScale, ', toScale: ', toScale, ', minScale: ', minScale);
        if (link.data.category == 'P') {
            minScale = toScale;
        }
        if (minScale >= 1) {
            return 1 * minScale;
        } else {
            return 1.5 * minScale;
        }
    };

    // -------------- creating new things ----------------------

    // Returns a location for a new sister group (thing) to the given one,
    // which will not hide any existing things (overlap is allowed).
    // The returned coordinates are absolute for a top-level group,
    // or relative to the parent otherwise - suitable for use with FreehandDiagramLayout
    // or FreehandLayout, resp.
    this.getNewSisterLocation = function (group, withR) {
        var diagram = map.getDiagram();
        // if we are within another group, things are in absolute coordinates
        // and sisters are placed above the thing; otherwise relative and below...
        var inGroup = group.containingGroup !== null;
        // ... except if withR is true, we go to the right instead of above or below.

        // start below if in group, else above; or to the right if withR
        var x, y, w, h;
        if (withR) {
            x = group.location.x + group.actualBounds.width * 2.2;
            y = group.location.y;
        } else {
            x = group.location.x;
            y = group.location.y + group.actualBounds.height * 1.1 * (inGroup ? 1 : -1);
        }
        w = group.actualBounds.width;
        h = group.actualBounds.height;

        // check for overlapping parts; if found, increment x,y and continue

        while (true) {
            var rect = new go.Rect(x, y, w, h);
            rect.grow(h / 10, w / 10, h / 10, w / 10);
            var parts = diagram.findObjectsIn(rect, null, self.isGroup);
            if (parts.count) {
                console.log('getNewSisterLocation: overlapping part found in ' + rect);
                if (withR) {
                    x += w / 10;
                    y += h / 10;
                } else {
                    x += w / 10;
                    y += h / 10 * (inGroup ? 1 : -1); // move down if in group, else up
                }
            } else {
                console.log('getNewSisterLocation: no overlapping part found in ' + rect);
                break;
            }
        }
        if (inGroup) {
            // make coordinates relative
            x -= group.containingGroup.location.x;
            y -= group.containingGroup.location.y;
        }
        return new go.Point(x + Math.random(), y + Math.random());
    };

    // Returns a location for a new child group (thing) to the given one,
    // which will not hide any existing children (overlap is allowed).
    // The returned coordinates are relative to the parent group - suitable for use with FreehandLayout.
    this.getNewChildLocation = function (group) {
        var groupBounds = group.actualBounds;
        // NB: all x/y locations are relative to the group location
        var x = 0;
        var y = groupBounds.height * 1.1;
        var w, h;
        var members = group.memberParts;
        // keep testing new rectangles until we find one that doesn't overlap with any existing member of the group
        while (true) {
            members.reset();
            var overlaps = false;
            var member, newRect, memberRect;
            while (members.next()) {
                member = members.value;
                var memberBounds = member.actualBounds;
                w = memberBounds.width;
                h = memberBounds.height;
                // find the existing member's actual bounds (absolute coords)
                memberRect = new go.Rect(memberBounds.x - groupBounds.x, memberBounds.y - groupBounds.y, memberBounds.width, memberBounds.height);
                newRect = new go.Rect(x, y, w, h);
                newRect.grow(h / 5, w / 5, h / 5, w / 5);
                overlaps = newRect.containsRect(memberRect);
                console.log('getNewChildLocation for ' + member + ': newRect = ' + newRect + ', memberRect = ' + memberRect + ', overlaps: ' + overlaps);
                if (overlaps) {
                    break;
                }
            }
            if (overlaps) {
                // increment x, y and try again
                x += w / 5;
                y += h / 5;
            } else {
                // found a good spot!
                break;
            }
        }
        return new go.Point(x, y);
    };

    // a simpler version of getNewChildLocation that places the child outside the bounds of the existing children
    this.getNewChildLocation2 = function (group) {
        var groupBounds = group.actualBounds;
        var childBounds = map.safeRect(map.getDiagram().computePartsBounds(group.memberParts));
        var x = 0;
        var y = 0;
        if (!group.memberParts.count) {
            y = groupBounds.height * 1.2;
        } else {
            y = groupBounds.height * 1.4 + childBounds.height;
        }
        //console.log('getNewChildLocation2, childBounds: ' + childBounds + ', groupBounds: ' + groupBounds + ', x: ' + x + ', y: ' + y);
        return new go.Point(x, y);
    };

    // move all the given new member groups so that their locations are relative to that of
    // the parent and its previously existing members, and scaled down appropriately
    this.layoutNewMembersRelativeTo = function (newMembers, parent, oldMemberBounds) {
        // how big was the parent system before the new groups were added?
        var systemBounds = parent.actualBounds.unionRect(oldMemberBounds);

        // figure out old/new origins - place new origin below existing system
        var oldBounds = map.getDiagram().computePartsBounds(newMembers);
        var oldOrigin = new go.Point(oldBounds.x, oldBounds.y);
        var newOrigin = new go.Point(0, systemBounds.height * 1.2);
        console.log('layoutNewMembersRelativeTo, systemBounds: ' + systemBounds + ', oldBounds: ' + oldBounds + ', oldOrigin: ' + oldOrigin + ', newOrigin: ' + newOrigin);

        // figure out new scaled locations
        // NB: we can assume newMembers are all one level down from parent (see map.addSelectedThingsAsChildrenOf),
        // so we just multiply by the standard scale factor
        var it = newMembers.iterator;
        while (it.next()) {
            var group = it.value;
            var groupBounds = group.actualBounds;
            var newX = newOrigin.x + (groupBounds.x - oldOrigin.x) * 0.45;
            var newY = newOrigin.y + (groupBounds.y - oldOrigin.y) * 0.45;
            var newLoc = go.Point.stringify(new go.Point(newX, newY));
            console.log('layoutNewMembersRelativeTo, groupBounds: ' + groupBounds + ', newLoc: ' + newLoc);
            map.getDiagram().model.setDataProperty(group.data, 'loc', newLoc);
        }
    };

    // move all the given old member groups so that their locations are absolute and above
    // the parent, and scaled up appropriately
    this.layoutOldMembersOutsideOf = function (oldMembers, parent, oldMembersBounds, oldMembersLevel) {
        // figure out scale factor (members can be dragged up multiple levels, unlike dragging into S)
        var scaleFactor = Math.pow(0.45, oldMembersLevel - self.computeLevel(parent));
        console.log('layoutOldMembersOutsideOf, scaleFactor: ' + scaleFactor);

        // figure out old/new origins - place new origin above parent, with vertical space for scaled-up oldMembers
        var parentBounds = parent.actualBounds;
        var oldOrigin = new go.Point(oldMembersBounds.x, oldMembersBounds.y);
        var newOrigin = new go.Point(parentBounds.x, parentBounds.y - oldMembersBounds.height * 1.2 / scaleFactor);

        // figure out new scaled locations
        var it = oldMembers.iterator;
        while (it.next()) {
            var group = it.value;
            var groupBounds = group.actualBounds;
            var newX = newOrigin.x + (groupBounds.x - oldOrigin.x) / scaleFactor;
            var newY = newOrigin.y + (groupBounds.y - oldOrigin.y) / scaleFactor;
            var newLoc = go.Point.stringify(new go.Point(newX, newY));
            console.log('layoutOldMembersOutsideOf, parentBounds: ' + parentBounds + ', oldMembersBounds: ' + oldMembersBounds + ', newOrigin: ' + newOrigin + ', groupBounds: ' + groupBounds + ', newLoc: ' + newLoc);
            map.getDiagram().model.setDataProperty(group.data, 'loc', go.Point.stringify(newLoc));
        }
    };

    // ----------------- accessors -------------------

    // returns the appropriate layout class by abbreviated name
    this.getLayout = function (layoutName) {
        if (layoutName == 'freehand') return new FreehandLayout();else if (layoutName == 'right') return new RightInventoryLayout();else if (layoutName == 'stacked') return new StackedLayout();else return new LeftInventoryLayout();
    };

    this.getFreehandDiagramLayout = function () {
        return new FreehandDiagramLayout();
    };

    // --------------------------------------------------------------

    // returns true if the to and from nodes for the link have a common ancestor group with one of the given layout names.
    // TODO: verify logic - what if there are multiple such ancestors? - this should return the highest one...
    function getCommonAncestorWithLayout(group1, group2, layoutNames) {
        var ancestors1 = self.getAncestorGroups(group1);
        var ancestors2 = self.getAncestorGroups(group2);
        var commonAncestors = _.intersection(ancestors1, ancestors2);
        var layoutAncestors = _.filter(commonAncestors, function (group) {
            return _.indexOf(layoutNames, group.data.layout) != -1;
        });
        if (layoutAncestors.length) {
            return layoutAncestors[0];
        } else {
            return null;
        }
    }

    // returns the ancestors of this group, including itself
    this.getAncestorGroups = function (group) {
        var ancestors = [group];
        var g = group;
        while (g.containingGroup) {
            ancestors.push(g.containingGroup);
            g = g.containingGroup;
        }
        return ancestors;
    };

    // --------------------------------------------------------------

    function FreehandDiagramLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(FreehandDiagramLayout, go.Layout);

    FreehandDiagramLayout.prototype.toString = function () {
        return 'FreehandDiagramLayout';
    };

    FreehandDiagramLayout.prototype.doLayout = function (coll) {
        //console.log('FreehandDiagramLayout.doLayout');
        var diagram = map.getDiagram();
        // diagram.startTransaction("Freehand Diagram Layout");

        //validateGroupLocations(diagram.findTopLevelGroups());
        var groups = diagram.findTopLevelGroups(); // get new iterator
        while (groups.next()) {
            var group = groups.value;
            if (!group.isLinkLabel) {
                var loc = go.Point.parse(group.data.loc);
                group.move(new go.Point(loc.x, loc.y));
                //console.log('FreehandDiagramLayout, group: ' + group + ' to location: ' + loc.x + ',' + loc.y);
            }
        }

        // all adjustment of links is done from here, not from the other layouts...
        getLinksByNodes(true);
        var links = diagram.links.iterator;
        while (links.next()) {
            var link = links.value;
            // if (isNaN(link.location.x)) {
            //     console.log('link location isNaN');
            //     link.move(new go.Point(0,0));
            // }
            // console.log('link location: ' + link.location);
            adjustLinkLayout(link);
        }

        // diagram.commitTransaction("Freehand Diagram Layout");
    };

    // if any group in the given Iterator does not have a location (data.loc), set one
    // that doesn't overlap with the other members
    function validateGroupLocations(groups) {}

    // --------------------------------------------------------------

    function FreehandLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(FreehandLayout, go.Layout);

    FreehandLayout.prototype.toString = function () {
        return 'FreehandLayout';
    };

    FreehandLayout.prototype.doLayout = function (coll) {
        var diagram = map.getDiagram();
        diagram.startTransaction('Freehand Layout');

        var x = this.group.location.x;
        var y = this.group.location.y;

        var it = this.group.memberParts.iterator;
        while (it.next()) {
            var part = it.value;
            if (part instanceof go.Group && !part.isLinkLabel) {
                var loc = go.Point.parse(part.data.loc);
                //console.log('FreehandLayout, part: ' + part.data.text + ', loc: ' + loc + ', location: ' + part.location);
                part.move(new go.Point(x + loc.x, y + loc.y));
                part.layout.doLayout(part);
            }
        }

        diagram.commitTransaction('Freehand Layout');
    };

    // --------------------------------------------------------------

    function StackedLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(StackedLayout, go.Layout);

    StackedLayout.prototype.toString = function () {
        return 'StackedLayout';
    };

    StackedLayout.prototype.doLayout = function (coll) {
        this.diagram.startTransaction('Stacked Layout');
        var margin = getStackMargin(this.group);
        var startX = this.group.location.x;
        var startY = this.group.location.y + (this.group.part.actualBounds.height + margin / 2);
        layoutMembersForStacked(this.group, startX, startY);
        this.diagram.commitTransaction('Stacked Layout');
    };

    // returns the max y value after laying out the last part
    function layoutMembersForStacked(group, startX, startY) {
        var members = getOrderedMembers(group);
        var x = startX;
        var y = startY;
        var rowCount = 0;
        var maxStartY = startY;
        _.each(members, function (part) {
            if (part instanceof go.Group && !part.isLinkLabel) {
                var margin = getStackMargin(part);
                part.move(new go.Point(x, y));
                startY = y + part.actualBounds.height + margin / 2; // start Y position for part's children

                //console.log('layoutMembersForStacked: starting layout of children of ' + part + ' at ' + Math.round(x) + ',' + Math.round(startY));

                if (part.isSubGraphExpanded) {
                    // layout children of this part; check if we've already done a taller part+children in current row
                    maxStartY = Math.max(maxStartY, layoutMembersForStacked(part, x, startY));
                    //console.log('layoutMembersForStacked: laid out children of ' + part + ', maxStartY is now ' + Math.round(maxStartY));
                } else {
                    maxStartY = Math.max(maxStartY, startY);
                }

                // decide whether to wrap
                rowCount++;
                if (rowCount < 2) {
                    // keep going on this line
                    x += part.actualBounds.width + margin;
                } else {
                    // wrap to next line
                    x = startX;
                    y = maxStartY + margin / 2;
                    rowCount = 0;
                }
            }
        });
        return maxStartY;
    }

    // --------------------------------------------------------------

    function RightInventoryLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(RightInventoryLayout, go.Layout);

    RightInventoryLayout.prototype.toString = function () {
        return 'RightInventoryLayout';
    };

    RightInventoryLayout.prototype.doLayout = function (coll) {
        //this.diagram.startTransaction("Inventory Layout");
        var startX = this.group.location.x + this.group.actualBounds.width;
        var startY = this.group.location.y + (this.group.part.actualBounds.height + getInventoryMargin(this.group));
        layoutMembersForInventory(this.group, startX, startY, 'R');
        //this.diagram.commitTransaction("Inventory Layout");
    };

    // --------------------------------------------------------------

    function LeftInventoryLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(LeftInventoryLayout, go.Layout);

    LeftInventoryLayout.prototype.toString = function () {
        return 'LeftInventoryLayout';
    };

    LeftInventoryLayout.prototype.doLayout = function (coll) {
        //console.log('LeftInventoryLayout.doLayout, group: ' + this.group + ', location: ' + this.group.location);
        // this.diagram.startTransaction("Inventory Layout");
        var startX = this.group.location.x;
        var startY = this.group.location.y + (this.group.part.actualBounds.height + getInventoryMargin(this.group));
        layoutMembersForInventory(this.group, startX, startY, 'L');
        // this.diagram.commitTransaction("Inventory Layout");
    };

    // shared stuff for Left/Right Inventory layouts...

    // returns the max y value after laying out the last part
    // side is 'L' or 'R'
    function layoutMembersForInventory(group, startX, startY, side) {
        var members = getOrderedMembers(group);
        _.each(members, function (part) {
            var x = startX; // for left, just use x
            if (side == 'R') x = startX - part.actualBounds.width; // for right, right-align parts to startX
            //console.log('layoutMembersForInventory, part: ' + part + ' to location: ' + x + ',' + startY);
            part.move(new go.Point(x, startY));
            startY += part.actualBounds.height + getInventoryMargin(part);
            if (part.isSubGraphExpanded) {
                //console.log('layoutMembersForInventory, y after moving: ' + part + ' = ' + startY);
                startY = layoutMembersForInventory(part, startX, startY, side);
            }
        });
        return startY + getInventoryMargin(group);
    }

    // returns an array of the group's (non-R-thing) members, sorted by the 'order' data property
    function getOrderedMembers(group) {
        var members = new go.List();
        var it = group.memberParts.iterator;
        while (it.next()) {
            var part = it.value;
            if (part instanceof go.Group && !part.isLinkLabel) {
                members.add(part);
            }
        }
        return _.sortBy(members.toArray(), function (member) {
            return member.data.order;
        });
    }

    // ------------------------ link routing and visibility ------------------------------

    // adjust the routing, visibility and other properties of a link according to various structural criteria
    function adjustLinkLayout(link) {
        if (!link || !link.fromNode || !link.toNode) {
            return;
        }

        // var loc = link.location;
        // if (isNaN(loc.x) || isNaN(loc.y)) {
        //     link.location = new go.Point(10, 10);
        //     console.log('adjustLinkLayout, link.location: ' + link.location);
        // }
        // console.log('adjustLinkLayout, link.location: ' + link.location);

        // see if link is within a stacked or inventory layout, or if it's a hidden P link
        var inventoryAncestor = getCommonAncestorWithLayout(link.fromNode, link.toNode, ['left', 'right']);
        var stackedAncestor = getCommonAncestorWithLayout(link.fromNode, link.toNode, ['stacked']);
        var hidePLink = link.data && link.data.category == 'P' && !map.getTemplates().showPLink(link);
        var crowdedRThing = hasCrowdedRThing(link);

        // see if this is one of multiple links between the same two nodes
        var snpos = self.getSameNodesLinkPosition(link);
        var isMultiLink = snpos.count > 1;
        //console.log('snpos for link ' + link + ': ' + snpos.index + ' of ' + snpos.count);

        if (inventoryAncestor) {
            applyInventoryCurveRouting(link, snpos, inventoryAncestor.data.layout);
        } else if (isMultiLink) {
            applyMultilinkCurveRouting(link, snpos);
        } else if (crowdedRThing) {
            applyInventoryCurveRouting(link, snpos, 'left');
        } else {
            applyStraightRouting(link);
        }

        // show link only if both connected things are visible (no collapsed ancestors);
        // hide if both are in stacked layout or if it's a P-link that we shouldn't be showing now
        if (self.fromAndToNodesAreVisible(link) && !stackedAncestor && !hidePLink) {
            link.opacity = 1;
            showLabelNodes(link, true);
        } else {
            link.opacity = 0;
            showLabelNodes(link, false);
        }
    }

    // TODO: detect when the R-thing overlaps both from and to nodes, so we can change the link routing
    function hasCrowdedRThing(link) {
        return false;
    }

    function showLabelNodes(link, show) {
        //console.log('showLabelNodes, link: ' + link + ', show: ' + show);
        var it = link.labelNodes;
        if (it) {
            while (it.next()) {
                var group = it.value;
                group.visible = show;
                if (show) {
                    group.layout.doLayout(group);
                }
            }
        }
    }

    // if link is between two things in the same inventory layout (single or multiple),
    // make the line more or less circular on the appropriate side
    function applyInventoryCurveRouting(link, snpos, ancestorLayout) {
        if (ancestorLayout == 'left') {
            link.fromSpot = go.Spot.Left;
            link.toSpot = go.Spot.Left;
        } else if (ancestorLayout == 'right') {
            link.fromSpot = go.Spot.Right;
            link.toSpot = go.Spot.Right;
        }

        // aspect ratio for the link curves - make this smaller to make them taller, larger to make them fatter
        var curveRatio = 0.6;

        var y1 = link.fromNode.actualBounds.y;
        var y2 = link.toNode.actualBounds.y;

        var yDiff = Math.abs(y2 - y1);
        var c = (yDiff === 0 ? 50 : Math.floor(yDiff * curveRatio)) + 100 * (snpos.index / snpos.count);
        //console.log("yDiff = " + yDiff + ', c = ' + c + ' (' + link.fromNode.data.text + ' - ' + p1 + ' - to ' + link.toNode.data.text + ' - ' + p2 + ')');

        link.curve = go.Link.Bezier;
        link.fromEndSegmentLength = c;
        link.toEndSegmentLength = c;
    }

    // if non-inventory link is one of multiple ones between same nodes, make it curved
    function applyMultilinkCurveRouting(link, snpos) {
        link.fromSpot = go.Spot.Default;
        link.toSpot = go.Spot.Default;
        link.curve = go.Link.Bezier;
        // curviness values based on number of links:
        // 2: -25 25
        // 3: -50 0 50
        // 4: -100 -50 0 50 100
        var rangeSize = 10 * (snpos.count - 1);
        var rangeIncrement = 10;
        if (snpos.hasRThing) {
            rangeSize = 100 * (snpos.count - 1);
            rangeIncrement = 100;
        }

        // adjust curviness for smaller scales
        var linkScaleFactor = self.getLinkStrokeWidth(link) / 2; // 2 is max stroke width
        rangeSize *= linkScaleFactor;
        rangeIncrement *= linkScaleFactor;

        var rangeStart = 0 - rangeSize / 2;

        link.curviness = (rangeStart + rangeIncrement * snpos.index) * snpos.orientation;
        // console.log('applyMultilinkCurveRouting, link: ' + link + ', curviness: ' + link.curviness);
    }

    // do normal straight lines for freehand layout, or links between descendants of things with different layouts
    function applyStraightRouting(link) {
        link.fromSpot = go.Spot.Default;
        link.toSpot = go.Spot.Default;
        link.routing = go.Link.Normal;
        link.curve = go.Link.None;
        link.curviness = 0;
    }

    // --------------- calculate how many links there are between a link's nodes ---------------

    // Returns an object of the format { index: 1, count: 2, orientation: -1, hasRThing: false },
    // indicating how many other links there are between the same pair of nodes,
    // where the given link falls within this list, and what its orientation is.
    this.getSameNodesLinkPosition = function (link) {
        var linksByNodes = getLinksByNodes(true);
        // get links with the same key as this one (connecting same nodes)
        var sameLinks = _.where(linksByNodes, {
            key: getSameNodesLinkKey(link)
        });

        // default return value
        var snpos = {
            index: 0,
            count: 1,
            orientation: 1,
            hasRThing: false
        };
        // set index, count, orientation
        for (var i = 0; i < sameLinks.length; i++) {
            if (sameLinks[i].link == link) {
                snpos = {
                    index: i,
                    count: sameLinks.length,
                    orientation: getLinkOrientation(link)
                };
            }
        }
        // check for Rthing
        for (i = 0; i < sameLinks.length; i++) {
            if (sameLinks[i].hasRThing) {
                snpos.hasRThing = true;
            }
        }
        return snpos;
    };

    var _linksByNodes = null;

    // refreshes the cached list of all links with keys, to facilitate grouping them according to connected nodes
    function getLinksByNodes(refresh) {
        //console.log('getLinksByNodes');
        if (!self._linksByNodes || refresh) {
            self._linksByNodes = [];
            var diagram = map.getDiagram();
            var links = diagram.links.iterator;
            while (links.next()) {
                var link = links.value;
                var key = getSameNodesLinkKey(link);
                if (key) {
                    self._linksByNodes.push({
                        key: key,
                        link: link,
                        hasRThing: link.labelNodes.count > 0
                    });
                }
            }
        }
        return self._linksByNodes;
    }

    // Returns a key used to group links according to which pair of nodes they connect.
    // The returned key is non-empty for regular links and P links that should be shown currently,
    // so that these will all be routed by the same rules. A null key is returned for any other
    // links, indicating that no grouping is required.
    function getSameNodesLinkKey(link) {
        //        if (self.isRLink(link) || (self.isPLink(link) && map.getTemplates().showPLink(link))) {
        if (self.isRLink(link)) {
            var key = [link.fromNode.toString(), link.toNode.toString()].sort().join('|');
            //console.log('key: ' + key);
            return key;
        } else {
            return null;
        }
    }

    // We use this to distinguish an A-B link from a B-A link (based on fromNode and toNode, which
    // is independent of the arrowhead settings) when setting curviness, because setting curviness = 25
    // on an A-B link is the same as curviness = -25 on a B-A link.
    function getLinkOrientation(link) {
        if (link.fromNode && link.toNode && link.fromNode.toString() < link.toNode.toString()) {
            return 1;
        } else {
            return -1;
        }
    }

    // -------------- link tests ---------------

    this.isRLink = function (link) {
        return link instanceof go.Link && link.data && !link.data.category && link.fromNode && link.toNode;
    };

    this.isDLink = function (link) {
        return link instanceof go.Link && link.data && link.data.category == 'D';
    };

    this.isPLink = function (link) {
        return link instanceof go.Link && link.data && link.data.category == 'P';
    };

    this.isGroup = function (obj) {
        return obj instanceof go.Group;
    };
};

//console.log('Layouts, PartCreated');
// setNewPartLocationData(e);

// stacked?

},{}],11:[function(require,module,exports){
'use strict';

var go = window.go;

// functions for creating and manipulating the map (i.e. Diagram)

SandbankEditor.Map = function (editor) {

    var ret = {};

    // ----------- constants ---------------
    ret.LEFT = 'left';
    ret.RIGHT = 'right';

    // ------------ instance vars ----------

    ret._diagram = null;

    // components
    ret._analytics = null;
    ret._attachments = null;
    ret._autosave = null;
    ret._generator = null;
    //var _history = null;
    ret._layouts = null;
    ret._perspectives = null;
    ret._presenter = null;
    ret._standards = null;
    ret._templates = null;
    ret._tests = null;
    ret._ui = null;

    // ------------ component accessors ----------------

    ret.getComponents = function () {
        return [ret._analytics, ret._attachments, ret._autosave, ret._generator,
        // _history,
        ret._layouts, ret._perspectives, ret._presenter, ret._standards, ret._templates, ret._tests, ret._ui];
    };

    ret.getAnalytics = function () {
        return ret._analytics;
    };
    ret.getAttachments = function () {
        return ret._attachments;
    };
    ret.getAutosave = function () {
        return ret._autosave;
    };
    ret.getGenerator = function () {
        return ret._generator;
    };
    // ret.getHistory = function () { return _history; };
    ret.getLayouts = function () {
        return ret._layouts;
    };
    ret.getPerspectives = function () {
        return ret._perspectives;
    };
    ret.getPresenter = function () {
        return ret._presenter;
    };
    ret.getStandards = function () {
        return ret._standards;
    };
    ret.getTemplates = function () {
        return ret._templates;
    };
    ret.getTests = function () {
        return ret._tests;
    };
    ret.getUi = function () {
        return ret._ui;
    };

    // -------------- map init ------------------

    ret.init = function () {

        // initialize components
        ret._analytics = new SandbankEditor.Analytics(editor, ret);
        ret._attachments = new SandbankEditor.Attachments(editor, ret);
        ret._autosave = new SandbankEditor.Autosave(editor, ret);
        ret._generator = new SandbankEditor.Generator(editor, ret);
        // _history = new SandbankEditor.History($scope, ret);
        ret._layouts = new SandbankEditor.Layouts(editor, ret);
        ret._perspectives = new SandbankEditor.Perspectives(editor, ret);
        ret._presenter = new SandbankEditor.Presenter(editor, ret);
        //_standards = new SandbankEditor.Standards($scope, ret);
        ret._templates = new SandbankEditor.Templates(editor, ret);
        //_tests = new SandbankEditor.Tests($scope, ret);
        ret._ui = new SandbankEditor.UI(editor, ret);

        // call init for each component, if defined
        _.each(ret.getComponents(), function (component) {
            if (component && component.init) component.init();
        });

        // create diagram
        ret._diagram = new go.Diagram('diagram');
        ret._diagram.initialContentAlignment = go.Spot.Center;
        ret._diagram.initialViewportSpot = go.Spot.Center;
        ret._diagram.initialDocumentSpot = go.Spot.Center;
        ret._diagram.hasHorizontalScrollbar = false;
        ret._diagram.hasVerticalScrollbar = false;
        ret._diagram.padding = 500;
        ret._diagram.layout = ret._layouts.getFreehandDiagramLayout();

        ret.initTools();
        ret._templates.initTemplates(ret._diagram); // set up templates, customize temporary link behavior
        ret.addDiagramListeners();

        ret._templates.addExportFooter();

        // watch for tab changes
        // TODO: restore non-Angular version of ret
        //$scope.$watch('currentTab', function(newValue, oldValue) {
        //    ret.currentTabChanged(newValue, oldValue);
        //});
    };

    // ret is called by a $scope.$watch in init()
    ret.currentTabChanged = function (newValue, oldValue) {
        // console.log('currentTabChanged, newValue: ' + newValue + ', oldValue: ' + oldValue);
        // notify any interested components
        _.each(ret.getComponents(), function (component) {
            if (component && component.currentTabChanged) {
                component.currentTabChanged(newValue, oldValue);
            }
        });
    };

    ret.getDiagram = function () {
        return ret._diagram;
    };

    // misc. tool configuration
    ret.initTools = function () {
        // disable clicking on TextBlocks to edit - we will invoke editing in other ways
        ret._diagram.allowTextEdit = false;

        // select text when activating editor;
        // use shift-enter to create new lines, enter to finish editing (NB: editor has multiline=true)
        var textTool = ret._diagram.toolManager.textEditingTool;
        textTool.doActivate = function () {
            go.TextEditingTool.prototype.doActivate.call(textTool);
            if (textTool.defaultTextEditor) {
                textTool.defaultTextEditor.select();

                textTool.defaultTextEditor.addEventListener('keydown', function (e) {
                    if (e.which == 13 && !e.shiftKey) {
                        go.TextEditingTool.prototype.acceptText.call(textTool, go.TextEditingTool.LostFocus);
                    }
                });
            }
        };

        // handle delete key on Mac (default behavior only uses fn-Delete to delete from canvas)
        ret._diagram.commandHandler.doKeyDown = function () {
            var e = ret._diagram.lastInput;
            var cmd = ret._diagram.commandHandler;
            if (e.event.which === 8) {
                cmd.deleteSelection();
            } else {
                go.CommandHandler.prototype.doKeyDown.call(cmd); // call base method with no arguments
            }
        };

        // [disable keyboard shortcuts, as these do not do centering on zoom,
        // and can lead to confusion with browser zoom (which gets fired depends on focus)]
        // - turned back on to support pinch/zoom on iPad
        ret._diagram.allowZoom = true;

        ret._diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;

        // decide what kinds of Parts can be added to a Group or to top-level
        // _diagram.commandHandler.memberValidation = function (grp, node) {
        //     //if (grp instanceof go.Group && node instanceof go.Group) return false;  // cannot add Groups to Groups
        //     return true;
        // };

        // default link attributes
        ret._diagram.toolManager.linkingTool.archetypeLinkData = {
            type: 'noArrows'
        };

        // allow double-click in background to create a new node
        ret._diagram.toolManager.clickCreatingTool.archetypeNodeData = ret.getNewThingData();

        // how long mouse must be held stationary before starting a drag-select (instead of a scroll) - default was 175ms
        ret._diagram.toolManager.dragSelectingTool.delay = 400;
    };

    // ----------- handling of DiagramEvents --------------------

    ret.addDiagramListeners = function () {

        // DiagramEvents to be handled here or by a component
        var diagramEvents = ['InitialLayoutCompleted', 'ChangedSelection', 'BackgroundSingleClicked', 'SelectionCopied', 'SelectionMoved', 'SelectionDeleting', 'SelectionDeleted', 'PartCreated', 'PartResized', 'ClipboardChanged', 'ClipboardPasted', 'LinkDrawn', 'LinkRelinked', 'ViewportBoundsChanged'];
        _.each(diagramEvents, function (eventName) {
            ret._diagram.addDiagramListener(eventName, function (e) {
                ret.broadcastDiagramEvent(eventName, e);
            });
        });

        ret._diagram.addDiagramListener('BackgroundContextClicked', function (e) {});
    };

    // broadcasts the given DiagramEvent (see apidocs for go.DiagramEvent)
    // to any components that may be interested, including ret one.
    ret.broadcastDiagramEvent = function (eventName, e) {
        ret.handleDiagramEvent(eventName, e);
        _.each(ret.getComponents(), function (component) {
            if (component && component.handleDiagramEvent) component.handleDiagramEvent(eventName, e);
        });
    };

    ret.handleDiagramEvent = function (eventName, e) {
        //console.log('handleDiagramEvent: ' + eventName);
        if (eventName == 'ChangedSelection') {
            ret.changedSelection(e);
        } else if (eventName == 'SelectionCopied') {
            ret.selectionCopied(e);
        } else if (eventName == 'PartCreated') {
            ret.partCreated(e);
        } else if (eventName == 'BackgroundSingleClicked') {
            ret._ui.showHelpTip('canvasTip');
        } else if (eventName == 'LinkDrawn') {
            ret.linkDrawn(e);
            ret.setNewLinkDirection(e);
        } else if (eventName == 'LinkRelinked') {
            ret.linkRelinked(e);
        } else if (eventName == 'ClipboardChanged') {
            ret.clipboardChanged(e);
        } else if (eventName == 'ClipboardPasted') {
            ret.clipboardPasted(e);
        }
    };

    // handle zoom to region if applicable
    ret.changedSelection = function (e) {
        //console.log('map.changedSelection');
        ret._diagram.updateAllTargetBindings();
        ret._ui.maybeZoomToRegion();
        if (ret.relationshipsSelected()) {
            ret._ui.showHelpTip('relationshipTip');
        }
    };

    ret.partCreated = function (e) {
        //console.log('Map, PartCreated');
        var group = e.subject;
        if (!(group instanceof go.Group)) {
            return;
        }
        ret._diagram.model.setDataProperty(group.data, 'layout', ret._ui.getMapEditorOptions().defaultThingLayout || 'left');
        ret._layouts.setNewPartLocationData(e);
    };

    // fix link ports when a link is created -
    // the P and R ports both cover the whole node, and the P port is on top of the R port,
    // so both P and R links get the toPort set to P by default.
    ret.linkDrawn = function (e) {
        var link = e.subject;
        console.log('linkDrawn, link: ' + link + ', fromPort: ' + link.fromPortId + ', toPort: ' + link.toPortId);
        if (link.fromPortId == 'P') {
            ret._diagram.model.startTransaction('change link category');
            ret._diagram.model.setDataProperty(link.data, 'toPort', 'P');
            ret._diagram.model.setDataProperty(link.data, 'category', 'P');
            ret._diagram.model.commitTransaction('change link category');
        }
        // prevent links from R to P
        else if (link.fromPortId == 'R') {
            ret._diagram.model.startTransaction('change link toPort');
            ret._diagram.model.setDataProperty(link.data, 'toPort', 'R');
            ret._diagram.model.commitTransaction('change link toPort');
        }
    };

    // fix link ports when a link is relinked -
    // dragging either end of an R-link to another node will set the corresponding port to P,
    // since P port is on top of R port, so we reset both ports to R if the category is not P.
    ret.linkRelinked = function (e) {
        var link = e.subject;
        if (!link.data.category || link.data.category !== 'P') {
            ret._diagram.model.setDataProperty(link.data, 'fromPort', 'R');
            ret._diagram.model.setDataProperty(link.data, 'toPort', 'R');
        }
    };

    ret.setNewLinkDirection = function (e) {
        var link = e.subject;
        if (link.fromPortId == 'R') {
            ret._diagram.model.startTransaction('change link direction');
            ret._diagram.model.setDataProperty(link.data, 'type', ret._ui.getMapEditorOptions().defaultRelationshipDirection);
            ret._diagram.commitTransaction('change link direction');
        }
    };

    ret.clipboardChanged = function (e) {
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group) {
                console.log('clipboardChanged: part ' + part + ', mainpanel scale: ' + part.findObject('mainpanel').scale);
            }
        }
    };

    // NB: ret is called when parts are copied by control-drag, NOT when the copy button is clicked
    ret.selectionCopied = function (e) {
        console.log('selectionCopied');
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group && part.isTopLevel) {
                var loc = go.Point.parse(part.data.loc);
                console.log('selectionCopied: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                ret._diagram.model.setDataProperty(part.data, 'loc', loc.x + 50 + ' ' + (loc.y + 50));
                part.updateTargetBindings('loc');
            }
        }
    };

    ret.clipboardPasted = function (e) {
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group && part.isTopLevel) {
                var loc = go.Point.parse(part.data.loc);
                //console.log('clipboardPasted: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                ret._diagram.model.setDataProperty(part.data, 'loc', loc.x + 50 + ' ' + (loc.y + 50));
                part.updateTargetBindings('loc');
            }
        }
    };

    // computes the bounds of all groups in the diagram - ret includes all ideas/things,
    // and excludes nodes, including slides, the slide blocker, and the export footer
    ret.computeMapBounds = function () {
        var groups = new go.List(go.Group);
        var nodes = ret._diagram.nodes;
        while (nodes.next()) {
            if (nodes.value instanceof go.Group) {
                groups.add(nodes.value);
            }
        }
        return ret._diagram.computePartsBounds(groups).copy(); // return a mutable rect
    };

    // ------------ what is currently selected? ----------------

    // returns true if all selected items are things (i.e. Groups), including r-things
    ret.thingsSelected = function () {
        if (!ret._diagram || ret._diagram.selection.count < 1) return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Group)) return false;
        }

        return true;
    };

    // returns true if exactly one thing (Group) is selected
    ret.thingSelected = function () {
        return ret._diagram && ret._diagram.selection.count == 1 && ret._diagram.selection.first() instanceof go.Group;
    };

    // if a single group is selected, returns it, otherwise returns null
    ret.getUniqueThingSelected = function () {
        if (ret._diagram && ret._diagram.selection.count == 1 && ret._diagram.selection.first() instanceof go.Group) {
            return ret._diagram.selection.first();
        } else {
            return null;
        }
    };

    ret.thingsSelectedAreMembersOf = function (group) {
        if (!ret._diagram || ret._diagram.selection.count < 1) return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Group) || it.value.containingGroup != group) return false;
        }

        return true;
    };

    ret.thingsSelectedAreDescendantsOf = function (group) {
        if (!ret._diagram || ret._diagram.selection.count < 1) return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            var ancestors = ret._layouts.getAncestorGroups(it.value);
            if (_.indexOf(ancestors, group) == -1) return false;
        }

        return true;
    };

    ret.thingsSelectedIncludeSlide = function () {
        if (!ret._diagram || ret._diagram.selection.count < 1) return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            if (it.value.data && it.value.data.category == 'slide') {
                return true;
            }
        }

        return false;
    };

    // returns true if all selected items are relationships (i.e. Links)
    ret.relationshipsSelected = function () {
        if (!ret._diagram || ret._diagram.selection.count < 1) return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Link) || !ret._layouts.isRLink(it.value)) return false;
        }

        return true;
    };

    // returns true if exactly one relationship (Link) is selected
    ret.relationshipSelected = function () {
        return ret._diagram && ret._diagram.selection.count == 1 && ret._diagram.selection.first() instanceof go.Link;
    };

    // ------------ load and initialize model -------------

    ret.load = function () {
        var url = editor.mapUrl + '.json';
        if (editor.sandbox) {
            url = editor.mapUrl + '.json?sandbox=1';
        }
        //TODO: restore non-Angular http-get for map data
        var data = { 'map': { 'metadata': { 'sandbox': false, 'id': 5547, 'name': 'Untitled Map', 'url': '/maps/5547', 'canEdit': true, 'updatedAt': '2015-05-15T12:29:40.721-04:00', 'updatedBy': null, 'updatedByName': null, 'userTags': [] }, 'data': { 'class': 'go.GraphLinksModel', 'nodeIsLinkLabelProperty': 'isLinkLabel', 'linkLabelKeysProperty': 'labelKeys', 'linkFromPortIdProperty': 'fromPort', 'linkToPortIdProperty': 'toPort', 'nodeDataArray': [{ 'key': 1, 'text': 'New Idea', 'isGroup': true, 'loc': '0 0', 'layout': 'left', 'sExpanded': true, 'pExpanded': true }], 'linkDataArray': [] }, 'stateData': null, 'editorOptions': null, 'analytics': {}, 'versions': [] } };
        ret._diagram.model = go.Model.fromJson(data);
        ret._ui.setStateData(data.map.stateData);
        ret._ui.setMapEditorOptions(data.map.editorOptions);

        ret.checkModel();
        ret._diagram.updateAllTargetBindings();
        ret._diagram.undoManager.isEnabled = true;
        ret._diagram.model.addChangedListener(ret._autosave.modelChanged);
        ret._autosave.saveOnModelChanged = true;
        ret._diagram.isReadOnly = !editor.canEdit;
        editor.updateEditStatus(editor.canEdit ? editor.LAST_UPDATED : editor.READ_ONLY);
        ret._ui.resetZoom();
        ret.loadMapExtraData(data.map);

        // if no nodes OR in thinkquery mode, launch generator
        if (editor.thinkquery || !ret._diagram.model.nodeDataArray.length) {
            ret._ui.openTab(ret._ui.TAB_ID_GENERATOR);
        }
        // if we have slides, play presentation
        else if (!editor.canEdit && ret._presenter.getSlideNodeDatas().length) {
            ret._presenter.playSlide(1);
        }
    };

    ret.loadForSandbox = function () {
        ret._diagram.model = go.Model.fromJson(editor.mapData);
        ret._ui.setStateData(''); // important! (otherwise corner highlighting breaks)
        ret._diagram.updateAllTargetBindings();
        ret._diagram.undoManager.isEnabled = true;
        ret._ui.resetZoom();
        editor.canEdit = true;

        // if no nodes OR in thinkquery mode, launch generator
        if (editor.thinkquery) {
            ret._ui.openTab(ret._ui.TAB_ID_GENERATOR);
        }
        // if we have slides, play presentation
        else if (ret._presenter.getSlideNodeDatas().length) {
            ret._presenter.playSlide(1);
        }
    };

    // fix any structural problems in the model before displaying it
    ret.checkModel = function () {
        // change "isLinkLabel" property to category:"LinkLabel" (change as of goJS 1.3)
        _.each(ret._diagram.model.nodeDataArray, function (nodeData, index, list) {
            if (nodeData.isLinkLabel) {
                delete nodeData.isLinkLabel;
                nodeData.category = 'LinkLabel';
            }
        });

        // check for the link label (r-thing) for a link being the same as the from or to node
        // - ret can cause infinite recursion in thinks like layout.getScale
        _.each(ret._diagram.model.linkDataArray, function (linkData, index, list) {
            var badLabelKeys = [];
            _.each(linkData.labelKeys, function (key, index2, list2) {
                if (key == linkData.from || key == linkData.to) {
                    console.log('labelKey same as from or to of link: ' + key);
                    badLabelKeys.push(key);
                }
            });
            linkData.labelKeys = _.difference(linkData.labelKeys, badLabelKeys);
        });
    };

    // loads other data besides the diagram model from the json object returned by maps/show.json
    // - ret includes points, badges, versions, and map analytics
    // NB: points and badges are set at page load time in layouts/user and users/badges, but
    // we also need to be able to update them here after an autosave

    // TODO: is ret still all needed with the newer userProfile stuff?
    ret.loadMapExtraData = function (mapData) {
        //console.log('map.loadMapExtraData, mapData: ' + mapData);
        editor.mapUserTags = mapData.metadata.userTags; // TODO: is ret used anywhere?

        //$scope.map.getHistory().versionList = mapData.versions;
        editor.map.getAnalytics().mapAnalytics = mapData.analytics;
    };

    // loads model data for an individual version and displays it
    // NB: ret also disables autosave; load() must be called to re-enable it
    ret.loadVersion = function (id) {
        $http.get('/map_versions/' + id).then(function (response) {
            if (response.status === 200) {
                try {
                    //console.log('loaded map version with ID: ' + id);
                    ret._diagram.model = go.Model.fromJson(response.data);
                    ret._diagram.updateAllTargetBindings();
                    ret._diagram.undoManager.isEnabled = false;
                    ret._autosave.saveOnModelChanged = false;
                    ret._diagram.layoutDiagram(true);
                    ret._diagram.isReadOnly = true;
                } catch (e) {
                    alert('Could not load MetaMap version');
                    console.error(e.message);
                }
            }
        });
    };

    // set whether editing capability is temporarily suspended -
    // ret is distinct from the global $scope.canEdit setting,
    // which if false prevents editing at all times
    ret.setEditingBlocked = function (val) {
        if (editor.canEdit) {
            ret._diagram.isReadOnly = val;
        }
    };

    // ------------- creating things in the model -------------------

    // default properties for all new Things (groups) - note that these can be overridden if needed
    ret.getNewThingData = function () {
        return {
            text: 'Idea',
            isGroup: true,
            layout: ret._ui.getMapEditorOptions().defaultThingLayout || 'left',
            sExpanded: true,
            pExpanded: true
        };
    };

    ret.createSister = function (thing) {
        if (!editor.canEdit) {
            return null;
        }

        var newLoc = ret._layouts.getNewSisterLocation(thing);
        var data = _.extend(ret.getNewThingData(), {
            group: thing.data.group,
            text: 'Idea',
            loc: go.Point.stringify(newLoc)
        });
        ret._diagram.model.addNodeData(data);
        var newSister = ret._diagram.findNodeForData(data);

        // put new sister right after thing (not as the last sibling)
        if (thing.containingGroup) {
            ret.moveSiblingNextTo(newSister, thing, ret.RIGHT);
        }
        return newSister;
    };

    ret.createRToSister = function (thing) {
        if (!editor.canEdit) {
            return null;
        }

        var thingKey = ret._diagram.model.getKeyForNodeData(thing.data);
        //console.log('thingKey: ' + thingKey);
        var newLoc = ret._layouts.getNewSisterLocation(thing, true); // withR = true
        var data = _.extend(ret.getNewThingData(), {
            group: thing.data.group,
            text: 'Idea',
            loc: go.Point.stringify(newLoc)
        });
        ret._diagram.model.addNodeData(data);
        var newSister = ret._diagram.findNodeForData(data);
        var groupKey = ret._diagram.model.getKeyForNodeData(data);

        // create link
        var linkData = {
            from: thingKey,
            to: groupKey,
            type: 'to',
            fromPort: 'R',
            toPort: 'R'
        };
        ret._diagram.model.addLinkData(linkData);

        // put new sister right after thing (not as the last sibling)
        if (thing.containingGroup) {
            ret.moveSiblingNextTo(newSister, thing, ret.RIGHT);
        }
        return newSister;
    };

    ret.createChild = function (thing, name, x, y) {
        if (!editor.canEdit) {
            return null;
        }

        var newLoc = ret._layouts.getNewChildLocation2(thing);
        if (x || y) {
            newLoc = new go.Point(x, y);
        }
        var data = _.extend(ret.getNewThingData(), {
            group: thing.data.key,
            text: name || 'Part',
            loc: go.Point.stringify(newLoc)
        });
        ret._diagram.model.addNodeData(data);
        ret._layouts.setDescendantLayouts(thing, thing.data.layout);
        var child = ret._diagram.findNodeForData(data);
        child.updateTargetBindings();
        return child;
    };

    ret.createRThing = function (link, name) {
        if (!editor.canEdit) {
            return null;
        }

        // console.log('createRThing, link: ' + link + ', name: ' + name);
        // don't allow multiple R-things
        if (link.isLabeledLink) {
            // console.log('cannot create RThing, link is already labeled');
            return;
        }

        var data = _.extend(ret.getNewThingData(), {
            text: name || 'Relationship Idea',
            //isLinkLabel: true,     // deprecated as of goJS 1.3
            category: 'LinkLabel', // new as of goJS 1.3
            loc: '0 0'
        });
        ret._diagram.model.startTransaction('create R Thing');
        ret._diagram.model.addNodeData(data);
        var key = ret._diagram.model.getKeyForNodeData(data);
        var node = ret._diagram.findPartForKey(key);
        node.labeledLink = link;
        ret._diagram.model.commitTransaction('create R Thing');
        ret._diagram.updateAllTargetBindings();

        return ret._diagram.findNodeForData(data);
    };

    // ---------- creating things with specified names/locations - for use by generator and tests ------------

    ret.createThing = function (x, y, name, layout) {
        group = ret._diagram.toolManager.clickCreatingTool.insertPart(new go.Point(x, y));
        ret._diagram.model.setDataProperty(group.data, 'text', name);
        if (layout) {
            ret._diagram.model.setDataProperty(group.data, 'layout', layout);
        }
        return group;
    };

    ret.createRLinkWithRThing = function (thing1, thing2, name) {
        var link = ret.createRLink(thing1, thing2);
        return ret.createRThing(link, name);
    };

    // returns the linkData object for the new link
    ret.createRLink = function (thing1, thing2) {
        ret._diagram.model.startTransaction('add link');
        var data = {
            type: 'noArrows',
            from: thing1.data.key,
            to: thing2.data.key,
            fromPort: 'R',
            toPort: 'R'
        };
        ret._diagram.model.addLinkData(data);
        ret._diagram.model.commitTransaction('add link');
        return ret._diagram.findLinkForData(data);
    };

    // returns the linkData object for the new link
    ret.createPLink = function (thing1, thing2) {
        ret._diagram.model.startTransaction('add link');
        var data = {
            type: 'noArrows',
            from: thing1.data.key,
            to: thing2.data.key,
            fromPort: 'P',
            toPort: 'P',
            category: 'P'
        };
        ret._diagram.model.addLinkData(data);
        ret._diagram.model.commitTransaction('add link');
        ret._diagram.model.setDataProperty(thing1.data, 'pExpanded', true);
        return ret._diagram.findLinkForData(data);
    };

    // ------------- moving things in the model structure -------------------

    // returns a go.List of the items in the current selection that are Groups
    ret.getSelectedGroups = function () {
        var it = ret._diagram.selection.iterator;
        var members = new go.List();
        while (it.next()) {
            var part = it.value;
            if (part instanceof go.Group) {
                members.add(part);
            }
        }
        return members;
    };

    // drag to S
    ret.addSelectedThingsAsChildrenOf = function (group) {
        var newMembers = ret.getSelectedGroups();

        // check existing members so we can calculate layout
        var oldMemberBounds = ret.safeRect(ret._diagram.computePartsBounds(group.memberParts));

        // NB: ret is subject to validation by CommandHandler.isValidMember,
        // so for example, members of members of newMembers will not be added as members
        group.addMembers(newMembers);

        ret._layouts.layoutNewMembersRelativeTo(newMembers, group, oldMemberBounds);

        ret._diagram.clearSelection();
    };

    // drag to D
    ret.addSelectedThingsAsSistersOf = function (group) {
        var oldMembers = ret.getSelectedGroups();

        // if dragging to top level, move dragged things so they don't overlap the former parent
        if (!group.containingGroup) {
            // check existing members so we can calculate layout
            var oldMembersBounds = ret._diagram.computePartsBounds(oldMembers);
            // NB: oldMembers can be on multiple levels, so not clear which level to use for rescaling old members after drag
            var oldMembersLevel = ret._layouts.computeLevel(oldMembers.first());

            var it = oldMembers.iterator;
            while (it.next()) {
                var member = it.value;
                member.containingGroup = null;
            }
            ret._layouts.layoutOldMembersOutsideOf(oldMembers, group, oldMembersBounds, oldMembersLevel);
        }
        // if not dragging to top level, place dragged things after former parent in outline
        else {
            var it2 = oldMembers.iterator;
            while (it2.next()) {
                var member2 = it2.value;
                member2.containingGroup = group.containingGroup;
                ret.moveSiblingNextTo(member2, group, ret.RIGHT);
            }
        }
        ret._diagram.clearSelection();
    };

    // for dragging parts within a system - side is LEFT or RIGHT (i.e. above or below, resp. in inventory layout)
    ret.addSelectedThingAsOrderedSisterOf = function (group, side) {
        //console.log('addSelectedThingAsOrderedSisterOf, side: ' + side);
        var thing = ret.getUniqueThingSelected();
        if (!thing) {
            return;
        }
        ret.moveSiblingNextTo(thing, group, side);
    };

    // moves the first thing (sibling) to be after the second thing (group)
    // in the part ordering - they are assumed to be siblings
    // side is LEFT or RIGHT
    ret.moveSiblingNextTo = function (sibling, group, side) {
        var parent = group.containingGroup;
        console.log('moveSiblingNextTo, sibling: ' + sibling + ', group: ' + group + ', parent: ' + parent + ', sibling.containingGroup: ' + sibling.containingGroup);

        if (!parent || sibling.containingGroup != parent) {
            console.error('Cannot do moveSiblingNextTo on non-siblings or top-level groups');
        }

        // create new member order
        var memberOrder = new go.List();
        var it = parent.memberParts;
        var order = 0;
        while (it.next()) {
            var member = it.value;
            if (member instanceof go.Group) {
                // we're at the target group, so add the moved thing either before or after it
                if (member == group) {
                    if (side == ret.LEFT) {
                        memberOrder.add(sibling);
                        ret._diagram.model.setDataProperty(sibling.data, 'order', order++);
                        memberOrder.add(member);
                        ret._diagram.model.setDataProperty(member.data, 'order', order++);
                    } else {
                        memberOrder.add(member);
                        ret._diagram.model.setDataProperty(member.data, 'order', order++);
                        memberOrder.add(sibling);
                        ret._diagram.model.setDataProperty(sibling.data, 'order', order++);
                    }
                }
                // don't re-add the moved thing, it was added above
                else if (member != sibling) {
                    memberOrder.add(member);
                    ret._diagram.model.setDataProperty(member.data, 'order', order++);
                }
            }
        }

        // clear existing members
        var newIt = memberOrder.iterator;
        while (newIt.next()) {
            var member2 = newIt.value;
            member2.containingGroup = null;
        }

        // add new members
        newIt.reset();
        while (newIt.next()) {
            var member3 = newIt.value;
            member3.containingGroup = parent;
        }
    };

    ret.addThingAsRThing = function (thing, link) {
        thing.labeledLink = link;
        thing.updateTargetBindings();
    };

    // D corner handler (single click)
    ret.toggleDFlag = function (thing) {
        ret._diagram.model.setDataProperty(thing.data, 'dflag', !thing.data.dflag);
        thing.updateTargetBindings();
    };

    // S corner handler (single click)
    ret.toggleSExpansion = function (thing) {
        var isExpanded = !(thing.data && !thing.data.sExpanded); // expand by default if property not present
        ret._diagram.model.setDataProperty(thing.data, 'sExpanded', !isExpanded);
        thing.updateTargetBindings();
        ret._ui.showCornerTip(thing, 'S');
    };

    // P corner handler (single click)
    ret.togglePExpansion = function (thing) {
        ret._diagram.model.setDataProperty(thing.data, 'pExpanded', !ret.pIsExpanded(thing));
        thing.updateTargetBindings();
        ret._ui.showCornerTip(thing, 'P');
    };

    ret.pIsExpanded = function (group) {
        return group.data && group.data.pExpanded === true;
    };

    // ---------------------- undo/redo --------------------

    ret.canUndo = function () {
        return ret._diagram.commandHandler.canUndo();
    };

    ret.undo = function () {
        ret._diagram.commandHandler.undo();
        ret._diagram.layoutDiagram(true);
    };

    ret.canRedo = function () {
        return ret._diagram.commandHandler.canRedo();
    };

    ret.redo = function () {
        ret._diagram.commandHandler.redo();
        ret._diagram.layoutDiagram(true);
    };

    ret.refresh = function () {
        ret._diagram.updateAllTargetBindings();
        ret._diagram.layoutDiagram(true);
    };

    // ------------------- utility ----------------------

    // check for a rect with NaN X/Y/W/H coords, so we can do stuff with it such as unionRect
    // (NaN,NaN,0,0) => (0,0,0,0)
    ret.safeRect = function (rect) {
        if (isNaN(rect.x)) {
            rect.x = 0;
        }
        if (isNaN(rect.y)) {
            rect.y = 0;
        }
        if (isNaN(rect.width)) {
            rect.width = 0;
        }
        if (isNaN(rect.height)) {
            rect.height = 0;
        }
        return rect;
    };

    // ------------------- debug map model ----------------------

    ret.loadModel = function () {
        $('#map-model-debug').val(ret._diagram.model.toJson());
    };

    ret.saveModel = function () {
        ret._diagram.model = go.Model.fromJson($('#map-model-debug').val());
        ret._diagram.updateAllTargetBindings();
        ret._diagram.model.addChangedListener(ret._autosave.modelChanged);
        ret._autosave.saveOnModelChanged = true;
    };

    return ret;
};

// TODO: turn off in production
//console.log('diagram model:' + _diagram.model.toJson());

},{}],12:[function(require,module,exports){
// functions for editing perspectives AND distinctions, which work similarly in the UI

'use strict';

SandbankEditor.Perspectives = function ($scope, map) {

    var self = this;

    // temporary state flag for adding/removing P/D selections programmatically
    var selectingLinkedThings = false;

    this.init = function () {};

    // called when a tab is opened or closed
    this.currentTabChanged = function (newValue, oldValue) {
        //console.log('Perspectives, currentTabChanged');
        if (newValue == map.getUi().TAB_ID_PERSPECTIVES) {
            // opening perspectives
            setPorDThing('P');
            map.setEditingBlocked(true);
        } else if (oldValue == map.getUi().TAB_ID_PERSPECTIVES) {
            // closing perspectives
            saveLinks('P');
            map.setEditingBlocked(false);
        } else if (newValue == map.getUi().TAB_ID_DISTINCTIONS) {
            // opening distinctions
            setPorDThing('D');
            map.setEditingBlocked(true);
        } else if (oldValue == map.getUi().TAB_ID_DISTINCTIONS) {
            // closing distinctions
            saveLinks('D');
            map.setEditingBlocked(false);
        }
    };

    this.handleDiagramEvent = function (eventName, e) {
        if (eventName == 'ChangedSelection') {
            if (map.getUi().currentTabIs(map.getUi().TAB_ID_PERSPECTIVES) || map.getUi().currentTabIs(map.getUi().TAB_ID_DISTINCTIONS)) {
                updateLinks();
            }
        }
    };

    // ---------- P/D Editor state

    this.isInPOrDEditorMode = function () {
        return map.getUi().state.perspectivePointKey || map.getUi().state.distinctionThingKey;
    };

    this.isInPEditorMode = function () {
        return map.getUi().state.perspectivePointKey;
    };

    this.isInDEditorMode = function () {
        return map.getUi().state.distinctionThingKey;
    };

    this.isPEditorPoint = function (group) {
        return map.getUi().state.perspectivePointKey == group.data.key;
    };

    this.isDEditorThing = function (group) {
        return map.getUi().state.distinctionThingKey == group.data.key;
    };

    // NB: this is called via map.getCornerFunction, so we get the extra corner arg, which we can ignore
    this.setPEditorPoint = function (thing, corner) {
        if ($scope.canEdit) {
            map.getUi().openTab(map.getUi().TAB_ID_PERSPECTIVES);
        }
    };

    this.setDEditorThing = function (thing) {
        if ($scope.canEdit) {
            // NB: need to select only this thing, since this is invoked
            // by a control-click, which will not automatically select just it
            map.getDiagram().clearSelection();
            thing.isSelected = true;
            map.getUi().openTab(map.getUi().TAB_ID_DISTINCTIONS);
        }
    };

    // -----------------------

    this.isPerspectivePoint = function (group) {
        var links = group.findLinksOutOf();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == 'P') {
                return true;
            }
        }
        return false;
    };

    this.isSelectedPerspectiveView = function (group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == 'P' && map.pIsExpanded(link.fromNode) && link.fromNode.isSelected) {
                return true;
            }
        }
        return false;
    };

    this.isToggledPerspectiveView = function (group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == 'P' && map.pIsExpanded(link.fromNode)) {
                return true;
            }
        }
        return false;
    };

    this.isMouseOverPerspectiveView = function (group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == 'P' && link.fromNode == map.getUi().mouseOverGroup) {
                return true;
            }
        }
        return false;
    };

    this.getPerspectiveViewWeight = function (group) {
        var mode = map.getUi().getMapEditorOptions().perspectiveMode;
        if (mode == 'spotlight' || mode == 'both') {
            return (self.isSelectedPerspectiveView(group) ? 1 : 0) + (self.isToggledPerspectiveView(group) ? 1 : 0) + (self.isMouseOverPerspectiveView(group) ? 1 : 0);
        } else {
            return 0;
        }
    };

    // -----------------------

    // category is "P" or "D" (perspectives or distinctions)
    function setPorDThing(category) {
        // if already set, must do save perspectives or save distinctions
        if (map.getUi().state.perspectivePointKey || map.getUi().state.distinctionThingKey) return;

        var thing = map.getDiagram().selection.first();
        //console.log('setPorDThing: ' + thing);
        if (thing instanceof go.Group) {
            var key = thing.data.key;
            if (category == 'P') {
                map.getUi().state.perspectivePointKey = key;
            } else if (category == 'D') {
                map.getUi().state.distinctionThingKey = key;
            }

            // select views/others
            selectLinkedThingsFor(thing, category);
        }
    }

    // this is called when the selection changes - if the thing is set,
    // adds/removes D/P links according to what is selected; otherwise
    // just shows/hides D/P links for the selected thing(s)
    function updateLinks() {
        if (selectingLinkedThings) // selection is being changed programmatically, so don't respond
            return;

        var pOrDThing = null;
        var category = null;
        if (map.getUi().state.perspectivePointKey) {
            pOrDThing = map.getDiagram().findNodeForKey(map.getUi().state.perspectivePointKey);
            category = 'P';
        } else if (map.getUi().state.distinctionThingKey) {
            pOrDThing = map.getDiagram().findNodeForKey(map.getUi().state.distinctionThingKey);
            category = 'D';
        }

        var addLinksTo = new go.List();
        var removeLinks = new go.List();

        // iterate through all things
        if (category) {
            var layers = map.getDiagram().layers;
            while (layers.next()) {
                var layer = layers.value;
                var parts = layer.parts;
                while (parts.next()) {
                    var part = parts.value;
                    if (part instanceof go.Group) {
                        // calculate links to add/remove based on selection
                        if (pOrDThing) {
                            var links = part.findLinksInto();
                            var existingLink = null;
                            while (links.next()) {
                                var link = links.value;
                                if (link.fromNode.data.key == pOrDThing.data.key && link.data.category == category) existingLink = link;
                            }

                            // decide whether to add or remove a link to the part, depending on whether
                            // it is selected and whether a link exists
                            if (!existingLink && part.isSelected) addLinksTo.add(part);else if (existingLink && !part.isSelected) removeLinks.add(existingLink);
                        }
                    }
                }
            }
        }

        // do the adding/removing of links
        var adds = addLinksTo.iterator;
        while (adds.next()) {
            map.getDiagram().model.startTransaction('add link');
            var to = adds.value;
            console.log('updateLinks: adding link from ' + pOrDThing + ' to ' + to);
            if (category == 'D' && pOrDThing.data.key == to.data.key) {
                pOrDThing.isSelected = false;
                alert('You can\'t distinguish a thing from itself!');
                continue;
            }
            map.getDiagram().model.addLinkData({
                from: pOrDThing.data.key,
                to: to.data.key,
                fromPort: category,
                toPort: category,
                category: category
            });
            map.getDiagram().model.commitTransaction('add link');
        }
        var removes = removeLinks.iterator;
        while (removes.next()) {
            var remove = removes.value;
            console.log('updateLinks: removing link from ' + remove.fromNode + ' to ' + remove.toNode);
            map.getDiagram().model.startTransaction('remove link');
            map.getDiagram().remove(remove);
            map.getDiagram().model.removeLinkData(remove.data);
            map.getDiagram().model.commitTransaction('remove link');
        }

        // show links
        map.getDiagram().updateAllTargetBindings();
    }

    function saveLinks(category) {
        var pOrDThing = null;
        if (category == 'P') {
            pOrDThing = map.getDiagram().findNodeForKey(map.getUi().state.perspectivePointKey);
            map.getUi().state.perspectivePointKey = null;
        } else if (category == 'D') {
            pOrDThing = map.getDiagram().findNodeForKey(map.getUi().state.distinctionThingKey);
            map.getUi().state.distinctionThingKey = null;
        }

        map.getDiagram().clearSelection();
        map.getDiagram().updateAllTargetBindings();
    }

    function selectLinkedThingsFor(group, category) {
        selectingLinkedThings = true;
        map.getDiagram().clearSelection();

        var links = group.findLinksOutOf();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == category) link.toNode.isSelected = true;
        }

        selectingLinkedThings = false;
    }
};

},{}],13:[function(require,module,exports){
// functions for the presenter/slides

'use strict';

SandbankEditor.Presenter = function ($scope, map) {

    var self = this;

    // constants
    this.SLIDE_BLOCKER_WIDTH = 1000;
    this.SLIDE_BLOCKER_COLOR = '#fff';
    this.SLIDE_BLOCKER_OPACITY = 0.9;

    // state vars
    this.currentSlideIndex = null;
    this.isPresenting = false;
    this.showTOC = false;
    this.isCreatingThumbnail = false;

    // mask applied around slide region when presenting
    this.slideBlocker = null;

    this.diagramAspectRatio = null;

    this.init = function () {};

    this.autosave = function () {
        map.getAutosave().save('edit_presenter');
    };

    // ---------- editing functions for different slide types -------------

    // NB: hasLinks can have values false, 1, or true (1 means only a single link)
    this.slideTypes = [{
        name: 'TITLE_BODY', label: 'Title and Body',
        hasTitle: true, hasNotes: true, hasChecks: false, hasMapRegion: false, hasMapSummary: false, hasLinks: false
    }, {
        name: 'TITLE_BODY_MAP', label: 'Title, Body and MetaMap',
        hasTitle: true, hasNotes: true, hasChecks: false, hasMapRegion: true, hasMapSummary: false, hasLinks: false
    }, {
        name: 'ACTIVITY_MAP', label: 'Lesson Activity and MetaMap',
        hasTitle: true, hasNotes: true, hasChecks: true, hasMapRegion: true, hasMapSummary: false, hasLinks: true
    }, {
        name: 'MAP_ONLY', label: 'MetaMap only',
        hasTitle: true, hasNotes: false, hasChecks: false, hasMapRegion: true, hasMapSummary: false, hasLinks: false
    }, {
        name: 'MAP_SUMMARY', label: 'MetaMap Summary',
        hasTitle: false, hasNotes: false, hasChecks: false, hasMapRegion: true, hasMapSummary: true, hasLinks: false
    }];

    // ------------------ link/attachment types -----------------------

    this.linkTypes = [{ name: '', label: '-- Select attachment type --' }, { name: 'WEB', label: 'Web Page' }, { name: 'PDF', label: 'PDF' }, { name: 'DOC', label: 'Document' }, { name: 'SPREADSHEET', label: 'Spreadsheet' }, { name: 'PRESENTATION', label: 'Presentation' }, { name: 'METAMAP', label: 'MetaMap' }, { name: 'IMAGE', label: 'Image' }, { name: 'AUDIO', label: 'Audio' }, { name: 'VIDEO', label: 'Video' }, { name: 'SURVEY', label: 'Survey' }, { name: 'WORKSHEET', label: 'Worksheet' }];

    // ------------ list of all things in the map, for map summary slides ---------------------

    this.ideaList = '';

    // only call this occasionally, as they won't be editing the map while presenter is open
    function updateIdeaList() {
        var nodes = map.getDiagram().nodes;
        var list = [];
        while (nodes.next()) {
            if (nodes.value instanceof go.Group) {
                list.push(nodes.value.data.text);
            }
        }
        list.sort();

        // filter out placeholder names - see map.js:getNewThingData, createSister, etc.
        list = _.difference(_.uniq(list, true), map.getGenerator().getPlaceholderIdeaNames(), ['New Idea', 'New Distinguished Idea', 'New Related Idea', 'New Relationship Idea', 'New Part Idea', 'Idea', 'Part', 'Relationship Idea'] // newer simplified names
        );

        self.ideaList = list.join(', ');
    }

    this.summaryAnalytics = [{ name: 'COUNT_THINGS', singularLabel: 'Distinction', pluralLabel: 'Distinctions' }, { name: 'COUNT_SYSTEMS', singularLabel: 'System', pluralLabel: 'Systems' }, { name: 'COUNT_RELATIONSHIPS', singularLabel: 'Relationship', pluralLabel: 'Relationships' }, { name: 'COUNT_PERSPECTIVES', singularLabel: 'Perspective', pluralLabel: 'Perspectives' }, { name: 'COUNT_RTHINGS', singularLabel: 'Relationship Idea', pluralLabel: 'Relationship Ideas' }, { name: 'COUNT_SYSTEM_RTHINGS', singularLabel: 'Relationship System', pluralLabel: 'Relationship Systems' }, { name: 'COUNT_SYSTEM_PERSPECTIVES', singularLabel: 'Perspective System', pluralLabel: 'Perspective Systems' }, { name: 'COUNT_DISTINCTIONS', singularLabel: 'Advanced Distinction', pluralLabel: 'Advanced Distinctions' }];

    this.addCheck = function (nodeData) {
        nodeData.checks.push({ text: '' });
        self.autosave();
    };

    this.deleteCheck = function (check, nodeData) {
        var i = _.indexOf(nodeData.checks, check);
        nodeData.checks.splice(i, 1);
        self.autosave();
    };

    this.addLink = function (nodeData) {
        nodeData.links.push({ title: '', url: '', type: '' });
        self.autosave();
    };

    this.deleteLink = function (link, nodeData) {
        var i = _.indexOf(nodeData.links, link);
        nodeData.links.splice(i, 1);
        self.autosave();
    };

    this.toggleTOC = function () {
        $scope.safeApply(function () {
            if (self.isPresenting) {
                self.showTOC = !self.showTOC;
            }
        });
    };

    // NB: can't create this in init as the diagram doesn't exist yet...
    function maybeInitSlideBlocker() {
        if (!self.slideBlocker) {
            var mk = go.GraphObject.make;
            self.slideBlocker = mk(go.Node, go.Panel.Auto, {
                layerName: 'Tool',
                opacity: self.SLIDE_BLOCKER_OPACITY
            }, mk(go.Shape, 'Rectangle', {
                fill: null,
                stroke: self.SLIDE_BLOCKER_COLOR,
                strokeWidth: 1000
            }));
            map.getDiagram().add(self.slideBlocker);
        }
    }

    // called when a tab is opened or closed
    this.currentTabChanged = function (newValue, oldValue) {
        if (oldValue == map.getUi().TAB_ID_PRESENTER) {
            // closing tab
            self.stopPresenting();
        } else if (newValue == map.getUi().TAB_ID_PRESENTER) {
            // opening tab
            // show slides (see layouts.slideTemplate, binding of visible attr)
            self.diagramAspectRatio = $('#diagram').width() / $('#diagram').height();
            console.log('diagramAspectRatio: ' + self.diagramAspectRatio);

            $scope.map.getDiagram().updateAllTargetBindings();
            updateIdeaList();
            if (!self.currentSlideIndex && self.getSlideNodeDatas().length > 0) {
                self.currentSlideIndex = 1;
            }
            self.slideThumbnailSelected(1);
        }
    };

    this.handleDiagramEvent = function (eventName, e) {
        if (!map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER)) {
            return;
        }

        if (eventName == 'SelectionDeleting') {
            var selection = e.subject;
            if (selection.count == 1) {
                var thing = selection.first();
                if (thing instanceof go.Node && thing.data.category == 'slide') {
                    if (!confirm('Delete this slide from the presentation?')) {
                        e.cancel = true;
                    }
                }
            }
        } else if (eventName == 'SelectionDeleted') {
            // if slide is deleted from canvas rather than by thumbnail x button, need to update indexes
            compactSlideIndexes();
        } else if (eventName == 'SelectionMoved' || eventName == 'PartResized') {
            // clear thumbnail cache
            thumbnailCache = [];
        } else if (eventName == 'ViewportBoundsChanged') {}
    };

    this.windowResized = _.debounce(function () {
        self.slideThumbnailSelected(self.currentSlideIndex);
    }, 1000);

    this.showSidebar = function () {
        return map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) && (!self.isPresenting || self.showTOC);
    };

    this.disableMapToolbarButtons = function () {
        return !map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) || self.isPresenting || !self.getCurrentSlideType().hasMapRegion;
    };

    // returns an array of node data objects (not the slide nodes themselves)
    this.getSlideNodeDatas = function () {
        var diagram = map.getDiagram();
        var nodes = diagram.model.nodeDataArray;
        var nodeDatas = _.filter(nodes, function (node) {
            return node.category == 'slide';
        });
        nodeDatas = _.sortBy(nodeDatas, function (nodeData) {
            return nodeData.index;
        });
        //console.log('getSlideNodeDatas, indexes: ' + _.pluck(slidesData, 'index'));
        return nodeDatas;
    };

    this.getSlideCount = function () {
        return self.getSlideNodeDatas().length;
    };

    this.getActivitySlideCount = function () {
        return _.where(self.getSlideNodeDatas(), { type: 'ACTIVITY_MAP' }).length;
    };

    this.getSlideType = function (typeName) {
        return _.findWhere(self.slideTypes, { name: typeName });
    };

    this.getCurrentSlideType = function () {
        var slide = findSlideByIndex(self.currentSlideIndex);
        if (slide) {
            return _.findWhere(self.slideTypes, { name: slide.data.type });
        } else {
            return {};
        }
    };

    function findSlideByIndex(index) {
        var diagram = map.getDiagram();
        var slideData = _.find(self.getSlideNodeDatas(), function (slideData) {
            return slideData.index == index;
        });
        if (slideData !== undefined) {
            return diagram.findNodeForKey(slideData.key);
        } else {
            return undefined;
        }
    }

    // increment is -1 or +1
    this.moveSlide = function (index, increment) {
        $scope.safeApply(function () {
            var diagram = map.getDiagram();
            var slide = findSlideByIndex(index);
            var neighbor = findSlideByIndex(index + increment);
            if (slide && neighbor) {
                //console.log('moveSlide: swapping ' + slide.data.key + ' with ' + neighbor.data.key);
                diagram.startTransaction('move slide');
                diagram.model.setDataProperty(slide.data, 'index', slide.data.index + increment);
                diagram.model.setDataProperty(neighbor.data, 'index', neighbor.data.index - increment);
                diagram.commitTransaction('move slide');
                thumbnailCache = [];
            }
        });
    };

    function compactSlideIndexes() {
        $scope.safeApply(function () {
            //console.log('compactSlideIndexes');
            var slidesData = self.getSlideNodeDatas();
            var diagram = map.getDiagram();
            var newIndex = 1;
            diagram.startTransaction('compact slide indexes');
            _.each(slidesData, function (slideData) {
                diagram.model.setDataProperty(slideData, 'index', newIndex);
                //console.log('compactSlideIndexes: set index for ' + slideData.key + ' to ' + newIndex);
                newIndex++;
            });
            diagram.commitTransaction('compact slide indexes');
        });
    }

    function getNewSlideKey() {
        var diagram = map.getDiagram();
        var i = 1;
        while (diagram.model.findNodeDataForKey('slide-' + i)) {
            i++;
        }
        return 'slide-' + i;
    }

    // NB: indexes (and keys?) must be 1-based, otherwise first slide gets screwed up
    // (somewhere the index shows up as '' instead of 0)
    function getNewSlideIndex() {
        var slides = self.getSlideNodeDatas();
        return slides.length + 1;
    }

    this.addSlide = function (typeName) {
        $scope.safeApply(function () {
            console.log('addSlide: ' + typeName);
            var diagram = map.getDiagram();

            var db = map.computeMapBounds();
            db.inflate(db.width / 20, db.height / 10);
            var newLoc = db.x + ' ' + db.y;
            var newIndex = getNewSlideIndex();

            var slideType = _.findWhere(self.slideTypes, { name: typeName });

            diagram.startTransaction('add slide');
            diagram.model.addNodeData({
                key: getNewSlideKey(),
                category: 'slide',
                index: newIndex,
                isGroup: false,
                width: db.width,
                height: db.height,
                loc: newLoc,
                level: 0,
                children: 0,
                type: typeName,
                title: '',
                notes: '',
                checks: [],
                hasRegion: slideType.hasMapRegion,
                isSummary: slideType.hasMapSummary,
                links: []
            });
            diagram.commitTransaction('add slide');
            thumbnailCache = [];

            self.slideThumbnailSelected(newIndex); // trigger display of edit form, zoom to map region if applicable
        });
    };

    this.duplicateSlide = function (index) {
        $scope.safeApply(function () {
            var diagram = map.getDiagram();
            var newIndex = getNewSlideIndex();
            var slide = findSlideByIndex(index);
            if (slide) {
                diagram.startTransaction('duplicate slide');

                // bump up indexes on subsequent slides to make room for new slide after current one
                _.each(self.getSlideNodeDatas(), function (slideData) {
                    if (slideData.index > index) {
                        diagram.model.setDataProperty(slideData, 'index', slideData.index + 1);
                    }
                });

                // NB: creating a new nodeData object here rather than copying and modifying, to avoid copying $$hashKey (??)
                diagram.model.addNodeData({
                    key: getNewSlideKey(),
                    category: 'slide',
                    index: index + 1,
                    isGroup: false,
                    width: slide.data.width,
                    height: slide.data.height,
                    loc: slide.data.loc,
                    level: 0,
                    children: 0,
                    type: slide.data.type,
                    title: slide.data.title + ' (Copy)',
                    notes: slide.data.notes,
                    checks: slide.data.checks, // clone?
                    hasRegion: slide.data.hasRegion,
                    isSummary: slide.data.isSummary,
                    links: slide.data.links // clone?
                });
                diagram.commitTransaction('duplicate slide');
                thumbnailCache = [];
            }
        });
    };

    this.removeSlide = function (index) {
        $scope.safeApply(function () {
            //console.log('removeSlide: ' + index);
            var diagram = map.getDiagram();
            var slide = findSlideByIndex(index);
            if (slide) {
                diagram.startTransaction('remove slide');
                diagram.model.removeNodeData(slide.data);
                diagram.commitTransaction('remove slide');
            }
            self.currentSlideIndex = null;
            thumbnailCache = [];
            compactSlideIndexes();
        });
    };

    var thumbnailCache = [];

    this.getSlideThumbnail = function (index) {
        return thumbnailCache[index];
    };

    this.createSlideThumbnails = function () {
        _.each(self.getSlideNodeDatas(), function (nd) {
            self.createSlideThumbnail(nd.index);
        });
    };

    this.createSlideThumbnail = function (index) {
        //console.log('createSlideThumbnail');

        var thumbWidth = 1000;
        var thumbHeight = 600;
        var diagram = map.getDiagram();

        var slide = findSlideByIndex(index);
        if (!slide) {
            return '';
        } else if (!slide.data.hasRegion && !slide.data.isSummary) {
            return '';
        } else {
            var db = diagram.documentBounds;
            var sb;
            if (slide.data.isSummary) {
                // for a summary slide we shoot the whole map
                sb = map.safeRect(map.computeMapBounds());
            } else {
                // otherwise just shoot the slide region
                sb = slide.part.actualBounds;
            }

            var imagePosition = new go.Point(sb.x, sb.y);
            //console.log('getSlideThumbnail, slide bounds: ' + sb + ', document bounds: ' + db + ', imagePosition: ' + imagePosition);

            var wScale = thumbWidth / sb.width;
            var hScale = thumbHeight / sb.height;
            var thumbScale = Math.min(wScale, hScale);
            console.log('scale: ' + wScale + ',' + hScale);

            var w = thumbScale * sb.width;
            var h = thumbScale * sb.height;
            //console.log('thumbnail w/h: ' + w + ',' + h);

            // hide slides temporarily while creating thumbnail
            self.isCreatingThumbnail = true;
            diagram.updateAllTargetBindings();

            diagram.scale = thumbScale;

            var imgData = diagram.makeImageData({
                size: new go.Size(w, h),
                position: imagePosition,
                scale: thumbScale
            });

            self.isCreatingThumbnail = false;
            diagram.updateAllTargetBindings();

            thumbnailCache[index] = imgData;

            return imgData;
        }
    };

    // gets a thumbnail of the whole map, for saving (see autosave.js)
    this.getMapThumbnail = function () {

        var diagram = map.getDiagram();
        var sb = map.safeRect(map.computeMapBounds());
        sb.grow(10, 10, 10, 10);
        var w = 150;
        var h = 100;

        // hide slides temporarily while creating thumbnail
        self.isCreatingThumbnail = true;
        diagram.updateAllTargetBindings();

        var imgData = diagram.makeImageData({
            scale: Math.min(h / sb.height, w / sb.width),
            position: new go.Point(sb.x, sb.y),
            size: new go.Size(w, h)
        });

        self.isCreatingThumbnail = false;
        diagram.updateAllTargetBindings();

        return imgData;
    };

    // called via ng-click on thumbnail
    this.slideThumbnailSelected = function (index) {
        //console.log('slideThumbnailSelected: ' + index);
        var diagram = map.getDiagram();
        var slide = findSlideByIndex(index);

        $scope.safeApply(function () {
            // NB: order of statements is important here, as selectSlide can trigger changedSelection with an empty selection sometimes... ??
            selectSlide(index);
            self.currentSlideIndex = index;
            diagram.updateAllTargetBindings(); // show/hide slide nodes - see templates.js: slideTemplate

            if (slide) {
                zoomToSlideInCenter(slide);

                if (self.isPresenting) {
                    self.showTOC = false;
                }
            }
        });
    };

    this.needsNarrowCanvas = function () {
        var slide = findSlideByIndex(self.currentSlideIndex);
        return map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) && slide != null && (slide.data.type == 'TITLE_BODY_MAP' || slide.data.type == 'ACTIVITY_MAP' || slide.data.type == 'MAP_SUMMARY');
    };

    // sets the slide node as selected in the diagram.
    function selectSlide(index) {
        $scope.safeApply(function () {
            //console.log('select slide: ' + index);
            var diagram = map.getDiagram();
            diagram.clearSelection();
            if (index) {
                var slide = findSlideByIndex(index);
                if (slide) {
                    slide.isSelected = true;
                }
            }
            // TODO: scroll to slide?
        });
    }

    this.playSlide = function (index) {
        var diagram = map.getDiagram();
        map.getUi().openTab(map.getUi().TAB_ID_PRESENTER);

        var slides = self.getSlideNodeDatas();
        if (slides.length) {
            self.showTOC = false;
            presentSlide(index);
        }
    };

    // increment is -1 or +1
    this.advanceSlide = function (increment) {
        //console.log('advanceSlide, currentSlideIndex: ' + self.currentSlideIndex);
        $scope.safeApply(function () {
            var slide = findSlideByIndex(self.currentSlideIndex);
            if (slide) {
                self.currentSlideIndex += increment;
                if (self.isPresenting) {
                    presentSlide(self.currentSlideIndex);
                }
            }
        });
    };

    function presentSlide(index) {
        //console.log('presentSlide');
        $scope.safeApply(function () {
            var diagram = map.getDiagram();
            var slide = findSlideByIndex(index);
            if (!slide) {
                return;
            }

            diagram.clearSelection();
            // NB: need to set this after clearSelection, as that will set it to null! (see changedSelection)
            self.currentSlideIndex = index;
            map.setEditingBlocked(true);
            //console.log('presentSlide, index: ' + index + ', slide: ' + slide + ', currentSlideIndex: ' + self.currentSlideIndex);

            maybeInitSlideBlocker();
            var blockerW = self.SLIDE_BLOCKER_WIDTH;

            if (slide.data.hasRegion) {
                zoomToSlideInCenter(slide);

                // show slide blocker
                self.slideBlocker.desiredSize = new go.Size(slide.actualBounds.width + 2 * blockerW, slide.actualBounds.height + 2 * blockerW);
                self.slideBlocker.location = new go.Point(slide.actualBounds.x - blockerW, slide.actualBounds.y - blockerW);
                self.slideBlocker.visible = true;
                //console.log('slideBlocker: ' + self.slideBlocker.actualBounds);
            } else if (slide.data.isSummary) {
                zoomToSlideInCenter(slide);
                self.slideBlocker.visible = false;
            } else {
                map.getUi().resetZoom();
                self.slideBlocker.visible = false;
            }

            self.isPresenting = true;
            $('body').addClass('presenter-playing');

            map.getDiagram().updateAllTargetBindings(); // hide slide nodes - see templates.js: slideTemplate
        });
    }

    // zoom the diagram to show the given slide in the center of the canvas
    function zoomToSlideInCenter(slide) {
        var diagram = map.getDiagram();

        window.setTimeout(function () {

            var halfWidth = slide.data.type != 'MAP_ONLY';
            var zoomRect = self.getLetterboxedRect(slide.actualBounds, halfWidth);
            zoomRect.inflate(zoomRect.width / 10, zoomRect.height / 10);
            diagram.zoomToRect(zoomRect, go.Diagram.Uniform);
        }, 100);
    }

    // Returns a rectangle containing the given rect, but with appropriate width or height added
    // to give it same aspect ratio as the diagram.
    this.getLetterboxedRect = function (rect, halfWidth) {

        // NB: we calculate the aspect ratio when the tab is opened,
        // rather than each time as the diagram size might be changing...
        var dar = halfWidth ? self.diagramAspectRatio / 2 : self.diagramAspectRatio;
        console.log('rect: ' + rect + ', dar: ' + dar);

        var rectAspectRatio = rect.width / rect.height;

        if (dar > rectAspectRatio) {
            // tall skinny rect, short wide target AR, so add side padding to the rect
            var lbw = rect.height * dar; // because lbw / lbh == dar == lbw / rect.height (lbh == rect.height)
            return rect.copy().inflate((lbw - rect.width) / 2, 0); // add half the width difference to each side of the rect
        } else {
            // short wide rect, tall skinny target AR, so add top/bottom padding to the rect
            var lbh = rect.width / dar; // because lbw / lbh == dar == lbh / rect.width (lbw == rect.width)
            return rect.copy().inflate(0, (lbh - rect.height) / 2); // add half the height difference to top/bottom of the rect
        }
    };

    this.stopPresenting = function () {
        $scope.safeApply(function () {
            //console.log('stopPresenting, currentSlideIndex: ' + self.currentSlideIndex);
            var diagram = map.getDiagram();

            if (self.slideBlocker) {
                self.slideBlocker.visible = false;
            }

            //self.currentSlideIndex = null;
            self.isPresenting = false;
            $('body').removeClass('presenter-playing');

            map.getDiagram().updateAllTargetBindings(); // show slide nodes

            diagram.clearSelection();
            map.setEditingBlocked(false);
            //map.getUi().resetZoom();
        });
    };
};

// adjust zooming of map region
//self.windowResized();

},{}],14:[function(require,module,exports){
// goJS templates used in the editor

'use strict';

SandbankEditor.Templates = function (editor, map) {

    var ret = this;

    // constants
    this.groupFillColor = '#f9f9f9';

    this.init = function () {};

    // initialize template-related stuff that depends on the diagram (and therefore can't go in init())
    this.initTemplates = function (diagram) {
        diagram.groupTemplate = ret.groupTemplate;
        diagram.nodeTemplate = ret.slideTemplate;
        diagram.linkTemplate = ret.linkTemplate;
        diagram.linkTemplateMap.add('P', ret.pLinkTemplate);
        diagram.linkTemplateMap.add('D', ret.dLinkTemplate);

        ret.setTemporaryLinkTemplates(diagram.toolManager.linkingTool);
        ret.setTemporaryLinkTemplates(diagram.toolManager.relinkingTool);

        diagram.toolManager.linkingTool.portTargeted = function (realnode, realport, tempnode, tempport, toend) {
            ret.handlePortTargeted(diagram.toolManager.linkingTool, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.relinkingTool.portTargeted = function (realnode, realport, tempnode, tempport, toend) {
            ret.handlePortTargeted(diagram.toolManager.relinkingTool, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.relinkingTool.updateAdornments = function (part) {
            go.RelinkingTool.prototype.updateAdornments.call(this, part);
            var from = part.findAdornment('RelinkFrom');
            var to = part.findAdornment('RelinkTo');
            // if (from)
            //     console.log('relinkfrom: ' + from.part.width);
        };

        diagram.toolManager.linkingTool.linkValidation = ret.validateLink;
        diagram.toolManager.relinkingTool.linkValidation = ret.validateLink;
    };

    // convenient abbreviation for creating templates
    var mk = go.GraphObject.make;

    // DSRP colors (from _variables.scss)
    var colorD = '#f2624c';
    var colorS = '#96c93d';
    var colorR = '#4cbfc2';
    var colorP = '#fbaa36';
    var colorPLight = '#FDDDAF';
    var colorPDark = '#C9882B';

    var eyeSvgPath = 'M 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00c 47.559,94.979, 144.341,160.00, 256.00,160.00c 111.657,0.00, 208.439-65.021, 256.00-160.00 C 464.442,161.021, 367.657,96.00, 256.00,96.00z M 382.225,180.852c 30.081,19.187, 55.571,44.887, 74.717,75.148 c-19.146,30.261-44.637,55.961-74.718,75.149C 344.427,355.257, 300.779,368.00, 256.00,368.00c-44.78,0.00-88.428-12.743-126.225-36.852 C 99.695,311.962, 74.205,286.262, 55.058,256.00c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65 C 130.725,190.866, 128.00,205.613, 128.00,221.00c0.00,70.692, 57.308,128.00, 128.00,128.00s 128.00-57.308, 128.00-128.00c0.00-15.387-2.725-30.134-7.704-43.799 C 378.286,178.39, 380.265,179.602, 382.225,180.852z M 256.00,205.00c0.00,26.51-21.49,48.00-48.00,48.00s-48.00-21.49-48.00-48.00s 21.49-48.00, 48.00-48.00 S 256.00,178.49, 256.00,205.00z';
    var eyeBlockedSvgPath = 'M 419.661,148.208 C 458.483,175.723 490.346,212.754 512.00,256.00 C 464.439,350.979 367.657,416.00 256.00,416.00 C 224.717,416.00 194.604,410.894 166.411,401.458 L 205.389,362.48 C 221.918,366.13 238.875,368.00 256.00,368.00 C 300.779,368.00 344.427,355.257 382.223,331.148 C 412.304,311.96 437.795,286.26 456.941,255.999 C 438.415,226.716 413.934,201.724 385.116,182.752 L 419.661,148.208 ZM 256.00,349.00 C 244.638,349.00 233.624,347.512 223.136,344.733 L 379.729,188.141 C 382.51,198.627 384.00,209.638 384.00,221.00 C 384.00,291.692 326.692,349.00 256.00,349.00 ZM 480.00,0.00l-26.869,0.00 L 343.325,109.806C 315.787,100.844, 286.448,96.00, 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00 c 21.329,42.596, 52.564,79.154, 90.597,106.534L0.00,453.131L0.00,480.00 l 26.869,0.00 L 480.00,26.869L 480.00,0.00 z M 208.00,157.00c 24.022,0.00, 43.923,17.647, 47.446,40.685 l-54.762,54.762C 177.647,248.923, 160.00,229.022, 160.00,205.00C 160.00,178.49, 181.49,157.00, 208.00,157.00z M 55.058,256.00 c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65C 130.725,190.866, 128.00,205.613, 128.00,221.00 c0.00,29.262, 9.825,56.224, 26.349,77.781l-29.275,29.275C 97.038,309.235, 73.197,284.67, 55.058,256.00z';
    var paperclipSvgPath = 'M 348.916,163.524l-32.476-32.461L 154.035,293.434c-26.907,26.896-26.907,70.524,0.00,97.422 c 26.902,26.896, 70.53,26.896, 97.437,0.00l 194.886-194.854c 44.857-44.831, 44.857-117.531,0.00-162.363 c-44.833-44.852-117.556-44.852-162.391,0.00L 79.335,238.212l 0.017,0.016c-0.145,0.152-0.306,0.288-0.438,0.423 c-62.551,62.548-62.551,163.928,0.00,226.453c 62.527,62.528, 163.934,62.528, 226.494,0.00c 0.137-0.137, 0.258-0.284, 0.41-0.438l 0.016,0.017 l 139.666-139.646l-32.493-32.46L 273.35,432.208l-0.008,0.00 c-0.148,0.134-0.282,0.285-0.423,0.422 c-44.537,44.529-116.99,44.529-161.538,0.00c-44.531-44.521-44.531-116.961,0.00-161.489c 0.152-0.152, 0.302-0.291, 0.444-0.423l-0.023-0.03 l 204.64-204.583c 26.856-26.869, 70.572-26.869, 97.443,0.00c 26.856,26.867, 26.856,70.574,0.00,97.42L 218.999,358.375 c-8.968,8.961-23.527,8.961-32.486,0.00c-8.947-8.943-8.947-23.516,0.00-32.46L 348.916,163.524z';

    // footer for image export
    var _exportFooter = null;

    // ------------------- debug info for groups/links --------------------------------

    function groupInfo(obj) {
        return obj.data.text + '\n' + 'object: ' + obj + '\n' + 'key: ' + obj.data.key + '\n' + 'containingGroup: ' + obj.containingGroup + '\n' + 'layout: ' + obj.layout + '\n' + 'data.layout: ' + obj.data.layout + '\n' + 'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + '\n' + 'freehand position (data.loc): ' + go.Point.parse(obj.data.loc) + '\n' + 'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + '\n' + 'getScale(): ' + map.getLayouts().getScale(obj) + '\n' + 'isLinkLabel: ' + obj.data.isLinkLabel + '\n' + 'labeledLink: ' + obj.labeledLink + '\n';
    }

    function nodeInfo(obj) {
        return 'object: ' + obj + '\n' + 'key: ' + obj.data.key + '\n' + 'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + '\n' + 'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + '\n';
    }

    function linkInfo(obj) {
        var snpos = map.getLayouts().getSameNodesLinkPosition(obj);
        return '' + 'object: ' + obj + '\n' + 'fromNode: ' + obj.fromNode + '\n' + 'toNode: ' + obj.toNode + '\n' + 'labelNodes: ' + obj.labelNodes.count + '\n' + 'labelNodeIsVisible: ' + map.getLayouts().labelNodeIsVisible(obj) + '\n' + 'fromPortId: ' + obj.fromPortId + '\n' + 'toPortId: ' + obj.toPortId + '\n' + 'category: ' + (obj.data ? obj.data.category : '') + '\n' + 'containingGroup: ' + obj.containingGroup + '\n' + 'fromAndToNodesAreVisible: ' + map.getLayouts().fromAndToNodesAreVisible(obj) + '\n' + 'curve: ' + obj.curve + '\n' + 'curviness: ' + obj.curviness + '\n' + 'fromEndSegmentLength: ' + Math.round(obj.fromEndSegmentLength) + '\n' + 'toEndSegmentLength: ' + Math.round(obj.toEndSegmentLength) + '\n' + 'sameNodesLinkPosition: ' + snpos.index + ' of ' + snpos.count + '\n' +
        //+ 'geometry: ' + obj.geometry + "\n" +
        'getLinkStrokeWidth: ' + map.getLayouts().getLinkStrokeWidth(obj) + '\n';
    }

    // -----------------------------------------------------------------------------

    // NB: these are here because they are about colors;
    // similar functions that are scale-related are in layouts.js...
    function getGroupSelectionStroke(obj) {
        if (obj.isSelected) {
            if (map.getPerspectives().isInPEditorMode()) return colorP;else if (map.getPerspectives().isInDEditorMode()) return colorD;else return '#000';
        } else {
            return '#000';
        }
    }

    // OK, this isn't about colors, but it wants to be near the one above...
    function getGroupSelectionStrokeWidth(obj) {
        return obj.isSelected ? 3 : 1;
    }

    function getRLinkSelectionStroke(obj) {
        if (obj.isSelected || obj == map.getUi().mouseOverLink) {
            return colorR; // TODO: can P links be selected?
        } else {
            return '#000';
        }
    }

    // -----------------------------------------------------------------------------

    // callbacks to determine when the corners should be visible

    function showDCorner(group) {
        if (map.getPerspectives().isDEditorThing(group)) {
            // mark distinction thing
            return true;
        } else if (map.getPerspectives().isInPOrDEditorMode()) {
            // don't show any corners if in P/D editor mode
            return false;
        } else if (map.getPresenter().isCreatingThumbnail) {
            // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group == map.getUi().mouseOverGroup || editor.isTouchDevice() && group.isSelected || canDragSelectionToBecomeSistersOf(group, false) && (!map.getUi().dragTargetPosition || cannotDragSelectionToBecomeOrderedSisterOf(group)); // not showing drag above/below indicators
        }
    }

    function showSCorner(group) {
        if (map.getPerspectives().isInPOrDEditorMode()) {
            // don't show any corners if in P/D editor mode
            return false;
        } else if (map.getPresenter().isCreatingThumbnail) {
            // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group == map.getUi().mouseOverGroup || editor.isTouchDevice() && group.isSelected || canDragSelectionToBecomeChildrenOf(group, false) && (!map.getUi().dragTargetPosition || cannotDragSelectionToBecomeOrderedSisterOf(group)); // not showing drag above/below indicators
        }
    }

    function showRCorner(group) {
        if (map.getPerspectives().isInPOrDEditorMode()) {
            // don't show any corners if in P/D editor mode
            return false;
        } else if (map.getPresenter().isCreatingThumbnail) {
            // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group == map.getUi().mouseOverGroup || editor.isTouchDevice() && group.isSelected; // show corners on mouseover
        }
    }

    function showPCorner(group) {
        if (map.getPerspectives().isPEditorPoint(group)) {
            return true; // mark perspective point
        } else if (map.getPerspectives().isInPOrDEditorMode()) {
            // don't show any corners if in P/D editor mode
            return false;
        } else if (map.getPresenter().isCreatingThumbnail) {
            // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group == map.getUi().mouseOverGroup || editor.isTouchDevice() && group.isSelected; // show corners on mouseover
        }
    }

    // when a P link should be visible

    this.showPLink = function (link) {
        var mode = map.getUi().getMapEditorOptions().perspectiveMode;
        if (map.getPerspectives().isPEditorPoint(link.fromNode)) {
            // show P's when this link is from the current Point
            return true;
        } else if (map.getPerspectives().isInPOrDEditorMode()) {
            // don't show P's for non-Point things, even on mouseover
            return false;
        } else {
            return (mode == 'lines' || mode == 'both') && (link.fromNode == map.getUi().mouseOverGroup || map.pIsExpanded(link.fromNode));
        }
    };

    this.showPDot = function (link) {
        return true; // map.getUi().getMapEditorOptions().perspectiveMode != 'both';
    };

    // these functions are used in two modes:
    // 1. with isDropping == false, to highlight drop targets based on map.getUi().dragTargetGroup and map.getUi().dragTargetPosition,
    //    which are set on mouseDragEnter/mouseDragleave
    // 2. with isDropping == true, on drop, when the above indicators have gone away, but we know what the dropped
    //    and target groups are, and we want to know what the drop should do.

    function canDragSelectionToBecomeSistersOf(group, isDropping) {
        return (group == map.getUi().dragTargetGroup || isDropping) && map.thingsSelectedAreDescendantsOf(group);
    }

    function canDragSelectionToBecomeChildrenOf(group, isDropping) {
        return (group == map.getUi().dragTargetGroup || isDropping) && !map.thingsSelectedIncludeSlide() && !map.thingsSelectedAreDescendantsOf(group);
    }

    // side is map.LEFT or map.RIGHT
    function canDragSelectionToBecomeOrderedSisterOf(targetGroup, side, isDropping) {
        // must be dragging single group
        var draggedGroup = map.getUniqueThingSelected();
        if (!draggedGroup) {
            return false;
        }

        // dragged and target must be Sisters in inventory layout
        return (targetGroup == map.getUi().dragTargetGroup || isDropping) && (map.getUi().dragTargetPosition == side || isDropping) && map.getLayouts().areSistersInInventoryLayout(draggedGroup, targetGroup);
    }

    function cannotDragSelectionToBecomeOrderedSisterOf(targetGroup) {
        return !canDragSelectionToBecomeOrderedSisterOf(targetGroup, map.LEFT) && !canDragSelectionToBecomeOrderedSisterOf(targetGroup, map.RIGHT);
    }

    // handle drop on one of the three target regions (top, middle, bottom)
    // side is map.LEFT or map.RIGHT
    function handleGroupMouseDrop(event, dropTarget, side) {
        //console.log('dragAboveTarget.mouseDrop, target: ' + dropTarget + ', part: ' + dropTarget .part + ', show: ' + show);
        if (side && canDragSelectionToBecomeOrderedSisterOf(dropTarget.part, side, true)) {
            map.addSelectedThingAsOrderedSisterOf(dropTarget.part, side);
        } else if (canDragSelectionToBecomeSistersOf(dropTarget.part, true)) {
            map.addSelectedThingsAsSistersOf(dropTarget.part);
        } else if (canDragSelectionToBecomeChildrenOf(dropTarget.part, true)) {
            map.addSelectedThingsAsChildrenOf(dropTarget.part);
        }
    }

    // when to show the R-thing knob on a link
    function showKnob(link) {
        return link == map.getUi().mouseOverLink;
    }

    // ---------------- components for main group template ------------------

    function dFlagMarker() {
        return mk(go.Shape, new go.Binding('fill', '', function (obj) {
            return obj.data.dflag ? '#000' : null;
        }).ofObject(), {
            name: 'dflag',
            position: new go.Point(0, 0),
            desiredSize: new go.Size(18, 18),
            geometry: go.Geometry.parse('F M0 1 L0 18 L18 0 L1 0z', true),
            cursor: 'pointer',
            pickable: false,
            stroke: null
        });
    }

    // "D" corner (top left, red)
    function cornerD() {
        return mk(go.Panel, go.Panel.Position, new go.Binding('opacity', '', function (obj) {
            return showDCorner(obj) ? 1 : 0;
        }).ofObject(), {
            name: 'cornerD',
            position: new go.Point(0, 0),
            desiredSize: new go.Size(50, 50),
            opacity: 0
        }, mk(go.Shape, {
            position: new go.Point(0, 0),
            desiredSize: new go.Size(50, 50),
            geometry: go.Geometry.parse('F M0 1 L0 50 L50 0 L1 0z', true),
            fill: colorD,
            stroke: null,
            cursor: 'pointer',
            click: function click(event, target) {
                //console.log('click, control:' + event.control + ', alt:' + event.alt + ', meta:' + event.meta);
                if (event.alt) {
                    // NB: a side effect of this will be to select just this group,
                    // which would not happen otherwise via control-click
                    map.getPerspectives().setDEditorThing(target.part);
                } else {
                    // handle single or double click
                    map.getUi().handleCornerClick('D', target.part);
                }
            },
            contextClick: function contextClick(event, target) {
                //console.log('contextClick:' + event);
                map.toggleDFlag(target.part);
            }
        }), mk(go.TextBlock, {
            text: 'D',
            stroke: 'white',
            font: '9px sans-serif',
            position: new go.Point(12, 15),
            pickable: false
        }));
    }

    // "S" corner (bottom left, green)
    function cornerS() {
        return mk(go.Panel, go.Panel.Position, new go.Binding('opacity', '', function (obj) {
            return showSCorner(obj) ? 1 : 0;
        }).ofObject(), {
            name: 'cornerS',
            position: new go.Point(0, 50),
            desiredSize: new go.Size(50, 50),
            opacity: 0
        }, mk(go.Shape, {
            position: new go.Point(0, 0),
            desiredSize: new go.Size(50, 50),
            geometry: go.Geometry.parse('F M0 0 L0 49 L1 50 L50 50z', true),
            fill: colorS,
            stroke: null,
            cursor: 'pointer',
            click: function click(event, target) {
                // handle single or double click
                map.getUi().handleCornerClick('S', target.part);
            }
        }),
        // expansion indicator
        mk(go.Shape, new go.Binding('position', '', function (obj) {
            return obj.isSubGraphExpanded ? new go.Point(4, 43) : new go.Point(5, 38);
        }).ofObject(), new go.Binding('angle', '', function (obj) {
            return obj.isSubGraphExpanded ? 90 : 0;
        }).ofObject(), {
            desiredSize: new go.Size(5, 10),
            geometry: go.Geometry.parse('F M0 0 L5 5 L0 10z', true),
            fill: '#333',
            stroke: null,
            cursor: 'pointer',
            pickable: false
        }), mk(go.TextBlock, {
            text: 'S',
            stroke: 'white',
            font: '9px sans-serif',
            position: new go.Point(12, 28),
            pickable: false
        }));
    }

    // show only when system is collapsed
    function sCollapsedMarker() {
        return mk(go.Shape, new go.Binding('visible', '', function (obj) {
            return !showSCorner(obj) && obj.memberParts.count > 0 && !obj.isSubGraphExpanded;
        }).ofObject(), {
            position: new go.Point(5, 88),
            desiredSize: new go.Size(5, 10),
            geometry: go.Geometry.parse('F M0 0 L5 5 L0 10z', true),
            fill: '#333',
            stroke: null,
            cursor: 'pointer',
            pickable: false
        });
    }

    // "R" corner (bottom right, blue)
    function cornerR() {
        return mk(go.Panel, go.Panel.Position, new go.Binding('opacity', '', function (obj) {
            return showRCorner(obj) ? 1 : 0;
        }).ofObject(), {
            name: 'cornerR',
            position: new go.Point(0, 0),
            desiredSize: new go.Size(100, 100),
            opacity: 0
        }, mk(go.Shape, {
            name: 'cornerRShape',
            // NB: this corner is done differently from the others:
            // 1. the overall shape is the size of the whole square, so the port falls in the middle instead of the corner;
            // 2. the geometry traces around the edges of the whole square, because otherwise the link line will
            //    show inside the main square if it's crossing one of the other 3 quadrants
            position: new go.Point(0, 0),
            desiredSize: new go.Size(100, 100),
            geometry: go.Geometry.parse('F' + 'M0 0 L0 100 ' + // top left to bottom left
            'L99 100 L100 99 L 100 0 ' + // bottom/right sides (round bottom right corner)
            'L 0 0 L 100 0 ' + // back to top left then top right
            'L 100 50 L 50 100 ' + // to midpoint of right side, midpoint of bottom side
            'L0 100z', // bottom left, return home
            true),
            fill: colorR,
            stroke: null,
            cursor: 'pointer',

            portId: 'R',
            fromLinkable: true,
            fromLinkableSelfNode: false,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: false,
            toLinkableDuplicates: true,
            click: function click(event, target) {
                // handle single or double click
                map.getUi().handleCornerClick('R', target.part);
            }
        }), mk(go.TextBlock, {
            text: 'R',
            stroke: 'white',
            font: '9px sans-serif',
            pickable: false,
            position: new go.Point(82, 78)
        }));
    }

    function attachmentPaperClip() {
        return mk(go.Shape, new go.Binding('visible', '', function (obj) {
            return obj.data.attachments && obj.data.attachments !== undefined && obj.data.attachments.length > 0;
        }).ofObject(), new go.Binding('geometry', '', function (obj) {
            return go.Geometry.parse(paperclipSvgPath, true);
        }).ofObject(), new go.Binding('desiredSize', '', function (obj) {
            return new go.Size(512, 512); // NB: the two icons don't scale to the same proportions for some reason - ??
        }).ofObject(), {
            position: new go.Point(46, 85),
            scale: 0.02,
            stroke: '#000',
            fill: '#000',
            click: function click(event, target) {
                console.log('clip clicked');
                map.getUi().toggleTab(map.getUi().TAB_ID_ATTACHMENTS);
            }
        });
    }

    function pEyeball() {
        return mk(go.Shape, new go.Binding('visible', '', function (obj) {
            return map.getPerspectives().isPerspectivePoint(obj);
        }).ofObject(), new go.Binding('geometry', '', function (obj) {
            return go.Geometry.parse(map.pIsExpanded(obj) ? eyeSvgPath : eyeBlockedSvgPath, true);
        }).ofObject(), new go.Binding('desiredSize', '', function (obj) {
            return new go.Size(512, map.pIsExpanded(obj) ? 440 : 512); // NB: the two icons don't scale to the same proportions for some reason - ??
        }).ofObject(), {
            position: new go.Point(87, 4),
            scale: 0.02,
            stroke: '#000',
            fill: '#000',
            pickable: false
        });
    }

    // P expansion indicator - this shows when the P corner is not visible, and only if the thing is a perspective point
    function pointMarker() {
        return pEyeball();
    }

    // P view indicator
    function viewMarker() {
        return mk(go.Shape, 'Border', new go.Binding('visible', '', function (obj) {
            return true;
        }).ofObject(), new go.Binding('fill', '', function (obj) {
            return getViewMarkerFill(obj);
        }).ofObject(), {
            position: new go.Point(0, 0),
            height: 18,
            width: 100,
            stroke: null
        });
    }

    function getViewMarkerFill(obj) {
        var weight = map.getPerspectives().getPerspectiveViewWeight(obj);

        if (weight == 3) {
            return colorPDark;
        } else if (weight == 2) {
            return colorP;
        } else if (weight == 1) {
            return colorPLight;
        } else {
            return 'transparent';
        }
    }

    // "P" corner (top right, orange)
    function cornerP() {
        return mk(go.Panel, go.Panel.Position, new go.Binding('opacity', '', function (obj) {
            return showPCorner(obj) ? 1 : 0;
        }).ofObject(), {
            name: 'cornerP',
            position: new go.Point(0, 0),
            desiredSize: new go.Size(100, 100),
            opacity: 0
        }, mk(go.Shape, {
            name: 'cornerPShape',
            position: new go.Point(0, 0),
            desiredSize: new go.Size(100, 100),
            // NB: this geometry covers the whole square; see note above for cornerR
            geometry: go.Geometry.parse('F' + 'M0 0 L0 100 L100 100' + // top left to bottom left to bottom right
            'L100 1 L99 0 L0 0' + // right/top sides (round top right corner)
            'L 50 0 L 100 50 ' + // to midpoint of top side, midpoint of right side
            'L100 100 0 100z', // bottom right, bottom left, return home
            true),

            fill: colorP,
            stroke: null,
            cursor: 'pointer',

            portId: 'P',
            fromLinkable: true,
            fromLinkableSelfNode: false,
            fromLinkableDuplicates: false,
            toLinkable: true,
            toLinkableSelfNode: false,
            toLinkableDuplicates: false,
            toMaxLinks: 1,
            click: function click(event, target) {
                // handle single or double click
                map.getUi().handleCornerClick('P', target.part);
            }
        }), pEyeball(), // P expansion indicator
        mk(go.TextBlock, {
            text: 'P',
            stroke: 'white',
            font: '9px sans-serif',
            pickable: false,
            position: new go.Point(81, 15)
        }));
    }

    function mainBorder() {
        return mk(go.Shape, 'Border', new go.Binding('stroke', '', getGroupSelectionStroke).ofObject(), new go.Binding('strokeWidth', '', getGroupSelectionStrokeWidth).ofObject(), {
            name: 'mainarea',
            position: new go.Point(0, 0),
            height: 100,
            width: 100,
            fill: null,
            //portId: "",
            cursor: 'pointer',
            fromLinkable: true,
            fromLinkableSelfNode: false,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: false,
            toLinkableDuplicates: true
        });
    }

    // --------- handlers for mouse drag/drop actions on groups, which need to be replicated on different target parts -------

    // position is map.LEFT, null, or map.RIGHT
    function getGroupMouseDragEnterHandler(position) {
        return function (event, target, obj2) {
            //console.log('mouseDragEnter, e.dp: ' + event.documentPoint + ', target.part: ' + target.part + ', target bounds: ' + target.actualBounds);
            map.getUi().dragTargetGroup = target.part;
            map.getUi().dragTargetPosition = position;
            map.getDiagram().updateAllTargetBindings();
        };
    }

    var groupMouseDragLeaveHandler = function groupMouseDragLeaveHandler(event, target, obj2) {
        map.getUi().dragTargetGroup = null;
        map.getUi().dragTargetPosition = null;
        map.getDiagram().updateAllTargetBindings();
    };

    function getGroupMouseDropHandler(position) {
        return function (event, dropTarget) {
            handleGroupMouseDrop(event, dropTarget, position);
        };
    }

    var groupClickHandler = function groupClickHandler(event, target) {
        // handle single or double click
        map.getUi().handleCornerClick('', target);
    };

    // --------------- targets for dragging to D or S -----------------

    function dragAboveTarget() {
        return mk(go.Panel, go.Panel.Position, {
            position: new go.Point(0, 0),
            height: 25,
            width: 100,
            mouseDragEnter: getGroupMouseDragEnterHandler(map.LEFT),
            mouseDragLeave: groupMouseDragLeaveHandler,
            mouseDrop: getGroupMouseDropHandler(map.LEFT),
            click: groupClickHandler
        },
        // drag target region
        mk(go.Shape, 'Rectangle', {
            position: new go.Point(0, 0),
            height: 25,
            width: 100,
            cursor: 'pointer',
            stroke: null,
            fill: 'transparent'
        }),
        // drag indicator bar
        mk(go.Shape, 'Border', new go.Binding('visible', '', function (obj) {
            return canDragSelectionToBecomeOrderedSisterOf(obj.part, map.LEFT, false);
        }).ofObject(), {
            position: new go.Point(0, 0),
            height: 10,
            width: 100,
            stroke: null,
            fill: '#000'
        }));
    }

    function dragIntoTarget() {
        return mk(go.Panel, go.Panel.Position, {
            position: new go.Point(0, 25),
            height: 50,
            width: 100,
            mouseDragEnter: getGroupMouseDragEnterHandler(null),
            mouseDragLeave: groupMouseDragLeaveHandler,
            mouseDrop: getGroupMouseDropHandler(null),
            click: groupClickHandler
        }, mk(go.Shape, 'Rectangle', {
            position: new go.Point(0, 0),
            height: 50,
            width: 100,
            cursor: 'pointer',
            stroke: null,
            fill: 'transparent'
        }));
    }

    function dragBelowTarget() {
        return mk(go.Panel, go.Panel.Position, {
            position: new go.Point(0, 75),
            height: 25,
            width: 100,
            mouseDragEnter: getGroupMouseDragEnterHandler(map.RIGHT),
            mouseDragLeave: groupMouseDragLeaveHandler,
            mouseDrop: getGroupMouseDropHandler(map.RIGHT),
            click: groupClickHandler
        },
        // drag target region
        mk(go.Shape, 'Rectangle', {
            position: new go.Point(0, 0),
            height: 25,
            width: 100,
            cursor: 'pointer',
            stroke: null,
            fill: 'transparent'
        }),
        // drag indicator bar
        mk(go.Shape, 'Border', new go.Binding('visible', '', function (obj) {
            return canDragSelectionToBecomeOrderedSisterOf(obj.part, map.RIGHT, false);
        }).ofObject(), {
            position: new go.Point(0, 15),
            height: 10,
            width: 100,
            stroke: null,
            fill: '#000'
        }));
    }

    // Returns the TextBlock for the group title, for use in the main group template, inside the box.
    function groupInternalTextBlock() {
        return mk(go.Panel, go.Panel.Horizontal, {
            position: new go.Point(0, 0),
            desiredSize: new go.Size(100, 100)
        }, mk(go.TextBlock, new go.Binding('text', 'text').makeTwoWay(), new go.Binding('visible', '', function (group) {
            // always show text inside box for R-things, because external text will throw off layout
            return map.getLayouts().isNotWithinInventoryLayout(group) || map.getLayouts().isRThingWithinInventoryLayout(group);
        }).ofObject(), {
            width: 80,
            margin: 10,
            alignment: go.Spot.Center,
            textAlign: 'center',
            cursor: 'move',
            font: '10px sans-serif',
            isMultiline: true,
            wrap: go.TextBlock.WrapDesiredSize,

            mouseDragEnter: getGroupMouseDragEnterHandler(null),
            mouseDragLeave: groupMouseDragLeaveHandler,
            mouseDrop: getGroupMouseDropHandler(null),
            click: groupClickHandler,
            contextClick: function contextClick(event, target) {
                if (event.control) {
                    console.log(groupInfo(target.part));
                }
            }
        }));
    }

    // Returns a TextBlock for the group title, for use in the main group template, on the left or right.
    // visibleFn is a callback to be bound to the visibility attribute of the TextBlock.
    // textAlign is 'left' or 'right'.
    function groupExternalTextBlock(visibleFn, textAlign) {
        return mk(go.TextBlock, new go.Binding('text', 'text').makeTwoWay(), new go.Binding('visible', '', visibleFn).ofObject(), new go.Binding('scale', '', map.getLayouts().getExternalTextScale).ofObject(), {
            name: 'externaltext-' + textAlign, // NB: this screws up layouts for some reason - ??
            textAlign: textAlign,
            margin: 5,
            font: '10px sans-serif',
            isMultiline: true,
            click: groupClickHandler
        });
    }

    // -------------- group/Thing template --------------------

    this.groupTemplate = mk(go.Group, go.Panel.Vertical, new go.Binding('layout', 'layout', function (layoutName) {
        return map.getLayouts().getLayout(layoutName);
    }), new go.Binding('movable', '', function (obj) {
        return !obj.isLinkLabel;
    }).ofObject(), new go.Binding('isSubGraphExpanded', 'sExpanded'),
    // dim the thing if it's being dragged over another thing (drop to sister/child)
    new go.Binding('opacity', '', function (obj) {
        return obj.isSelected && map.getUi().dragTargetGroup ? 0.25 : 1;
    }).ofObject(), {
        locationObjectName: 'mainpanel',
        locationSpot: go.Spot.TopLeft,
        selectionAdorned: false,
        isSubGraphExpanded: true,
        layerName: 'Foreground',
        // highlight corners
        mouseEnter: function mouseEnter(event, target, obj2) {
            map.getUi().mouseOverGroup = target;
            map.getDiagram().updateAllTargetBindings();
        },
        // unhighlight corners
        mouseLeave: function mouseLeave(event, target, obj2) {
            map.getUi().mouseOverGroup = null;
            map.getDiagram().updateAllTargetBindings();
        }
        // containingGroupChanged: function(part, oldgroup, newgroup) {
        //     map.getDiagram().model.setDataProperty(part.data, 'level', map.computeLevel(part));
        //     //part.updateTargetBindings();  
        // }
    }, mk(go.Panel, go.Panel.Horizontal, groupExternalTextBlock(map.getLayouts().showLeftTextBlock, 'right'), mk(go.Panel, go.Panel.Position, {
        name: 'mainpanel'
    }, new go.Binding('scale', '', map.getLayouts().getScale).ofObject(),
    // drag area
    mk(go.Shape, 'Rectangle', {
        name: 'dragarea',
        position: new go.Point(0, 0),
        width: 100,
        height: 100,
        fill: ret.groupFillColor,
        stroke: null,
        cursor: 'move',
        // show debug info
        contextClick: function contextClick(event, target) {
            if (event.control) {
                console.log(groupInfo(target.part));
            }
        }
    }), mk(go.Panel, go.Panel.Position, viewMarker(), dragAboveTarget(), dragIntoTarget(), dragBelowTarget(), groupInternalTextBlock(), cornerD(), dFlagMarker(), cornerS(), sCollapsedMarker(), cornerR(), pointMarker(), cornerP(), attachmentPaperClip(), mainBorder())), groupExternalTextBlock(map.getLayouts().showRightTextBlock, 'left')),

    // the placeholder normally holds the child nodes, but we just use a dummy placeholder
    mk(go.Shape, {
        name: 'placeholder',
        fill: 'transparent',
        stroke: null,
        desiredSize: new go.Size(0, 0)
    }));

    // ------------------- link template ---------------------------

    this.linkTemplate = mk(go.Link, {
        selectionAdorned: false,
        layerName: '',
        routing: go.Link.Normal,
        relinkableFrom: true,
        relinkableTo: true,
        mouseEnter: function mouseEnter(event, target, obj2) {
            map.getUi().mouseOverLink = target;
            map.getDiagram().updateAllTargetBindings();
        },
        mouseLeave: function mouseLeave(event, target, obj2) {
            map.getUi().mouseOverLink = null;
            map.getDiagram().updateAllTargetBindings();
        },
        mouseDragEnter: function mouseDragEnter(event, target, dragObject) {
            map.getUi().mouseOverLink = target;
            map.getDiagram().updateAllTargetBindings();
        },
        mouseDragLeave: function mouseDragLeave(event, dropTarget, dragObject) {
            map.getUi().mouseOverLink = null;
            map.getDiagram().updateAllTargetBindings();
        },
        mouseDrop: function mouseDrop(event, dropTarget) {
            var parts = map.getDiagram().selection;
            if (parts && parts.count == 1 && parts.first() instanceof go.Group) {
                map.addThingAsRThing(parts.first(), dropTarget);
            }
        },
        doubleClick: function doubleClick(event, target) {
            map.createRThing(target);
        },
        contextClick: function contextClick(event, target) {
            if (event.control) {
                console.log(linkInfo(target));
            }
        }
    }, mk(go.Shape, new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(), new go.Binding('strokeWidth', '', map.getLayouts().getLinkStrokeWidth).ofObject(), {
        name: 'LINKSHAPE'
    }),

    // show to/from arrowheads based on link "type" attribute
    mk(go.Shape, {
        fromArrow: 'Backward'
    }, new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(), new go.Binding('scale', '', map.getLayouts().getArrowheadScale).ofObject(), new go.Binding('visible', 'type', function (t) {
        return t == 'from' || t == 'toFrom';
    })), mk(go.Shape, {
        toArrow: 'Standard'
    }, new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(), new go.Binding('scale', '', map.getLayouts().getArrowheadScale).ofObject(), new go.Binding('visible', 'type', function (t) {
        return t == 'to' || t == 'toFrom';
    })), mk(go.Panel, go.Panel.Auto, // link label "knob"
    new go.Binding('opacity', '', function (obj) {
        return showKnob(obj) ? 1 : 0;
    }).ofObject(), new go.Binding('scale', '', map.getLayouts().getArrowheadScale).ofObject(), mk(go.Shape, {
        figure: 'Ellipse',
        fill: colorD,
        stroke: colorD,
        width: 12,
        height: 12
    })));

    this.pLinkTemplate = mk(go.Link, new go.Binding('opacity', '', function (obj) {
        return ret.showPLink(obj) ? 1 : 0;
    }).ofObject(), {
        selectionAdorned: false,
        layerName: 'Background', // make P links fall behind R links
        routing: go.Link.Normal,
        contextClick: function contextClick(event, target) {
            if (event.control) {
                console.log(linkInfo(target));
            }
        }
    }, mk(go.Shape, new go.Binding('strokeWidth', '', map.getLayouts().getLinkStrokeWidth).ofObject(), {
        name: 'LINKSHAPE',
        stroke: colorPLight,
        fill: colorPLight
    }), mk(go.Shape,
    // new go.Binding('visible', '', function(obj) {
    //     return (self.showPDot(obj) ? 1 : 0);
    // }).ofObject(),
    new go.Binding('scale', '', map.getLayouts().getArrowheadScale).ofObject(), {
        toArrow: 'Circle',
        stroke: colorPLight,
        fill: colorPLight
    }));

    this.dLinkTemplate = mk(go.Link, {
        selectable: false
    }, mk(go.Shape, {
        name: 'LINKSHAPE',
        stroke: null
    }));

    // ----------- temporary link/node templates, for use when dragging to create R/P lines -------------

    // define initial temporary link templates - these will be modified when handlePortTargeted is called
    this.setTemporaryLinkTemplates = function (tool) {
        tool.temporaryLink = makeTemporaryLinkTemplate();
        tool.temporaryFromNode = makeTemporaryNodeTemplate();
        tool.temporaryToNode = makeTemporaryNodeTemplate();
    };

    function makeTemporaryLinkTemplate() {
        return mk(go.Link, {
            layerName: 'Tool'
        }, mk(go.Shape, {
            name: 'linkshape',
            strokeWidth: 2
        }));
    }

    function makeTemporaryNodeTemplate() {
        return mk(go.Group, {
            layerName: 'Tool'
        }, mk(go.Shape, 'Border', {
            name: 'border',
            strokeWidth: 3,
            fill: null
        }));
    }

    // change color and portId of temporary link templates based on the type of link being created/relinked
    this.handlePortTargeted = function (tool, realnode, realport, tempnode, tempport, toend) {
        // console.log('portTargeted, realport: ' + (realport ? realport.name : '') + ', tempport: ' + (tempport ? tempport.name : '')
        //     + ', originalFromPort: ' + (ltool.originalFromPort ? ltool.originalFromPort.name : '') + ', originalToPort: ' + ltool.originalToPort);

        var linkShape = tool.temporaryLink.findObject('linkshape');
        var fromBorder = tool.temporaryFromNode.findObject('border');
        var toBorder = tool.temporaryToNode.findObject('border');

        if (tool.originalFromPort && tool.originalFromPort.name == 'cornerPShape') {
            linkShape.stroke = colorP;
            fromBorder.stroke = colorP;
            toBorder.stroke = colorP;
            fromBorder.portId = 'P';
            toBorder.portId = 'P';
        } else if (tool.originalFromPort && tool.originalFromPort.name == 'cornerRShape') {
            linkShape.stroke = colorR;
            fromBorder.stroke = colorR;
            toBorder.stroke = colorR;
            fromBorder.portId = 'R';
            toBorder.portId = 'R';
        }
        tempnode.scale = map.getLayouts().getScale(realnode);
    };

    // prevent duplicate 'P' links in the same direction between the same two things
    this.validateLink = function (fromNode, fromPort, toNode, toPort) {
        // the P port is on top of the R port, so both P and R links get the toPort set to R by default.
        if (fromPort.portId == 'P') {
            // NB: findLinksTo would be simpler, but it doesn't seem to work... (?)
            var pLinks = toNode.findLinksBetween(fromNode, 'P', 'P');
            //console.log('validateLink, pLinks from ' + fromNode + ':' + fromPort + ' to ' + toNode + ':' + toPort + ' = ' + pLinks.count);
            if (pLinks.count) {
                while (pLinks.next()) {
                    var pLink = pLinks.value;
                    if (pLink.fromNode == fromNode && pLink.toNode == toNode) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    // ------------------- slide node template ----------------------

    function createSlideResizeHandle(alignment) {
        return mk(go.Shape, new go.Binding('desiredSize', '', function (obj) {
            var slide = obj.adornedObject;
            var size = Math.min(slide.width, slide.height) * 0.05;
            return new go.Size(size, size);
        }).ofObject(), {
            alignment: alignment,
            cursor: 'col-resize',
            fill: 'rgba(251,170,54,1)',
            stroke: null
        });
    }

    this.slideTemplate = mk(go.Node, go.Panel.Auto,
    // NB: unlike groups, slides just use a normal 2-way location binding
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding('width', 'width').makeTwoWay(), new go.Binding('height', 'height').makeTwoWay(), new go.Binding('visible', '', function (obj) {
        return obj.data.hasRegion && map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) && !map.getPresenter().isPresenting && !map.getPresenter().isCreatingThumbnail && map.getPresenter().currentSlideIndex == obj.data.index;
    }).ofObject(), {
        locationSpot: go.Spot.TopLeft,
        selectionAdorned: false,
        resizable: true,
        resizeAdornmentTemplate: mk(go.Adornment, 'Spot', mk(go.Placeholder), // takes size and position of adorned object                   
        createSlideResizeHandle(go.Spot.TopLeft), createSlideResizeHandle(go.Spot.Top), createSlideResizeHandle(go.Spot.TopRight), createSlideResizeHandle(go.Spot.Right), createSlideResizeHandle(go.Spot.BottomRight), createSlideResizeHandle(go.Spot.Bottom), createSlideResizeHandle(go.Spot.BottomLeft), createSlideResizeHandle(go.Spot.Left)),
        padding: 0,
        contextClick: function contextClick(event, target) {
            console.log(nodeInfo(target.part));
        }
    }, mk(go.Shape, 'Rectangle', {
        name: 'slideborder',
        fill: 'rgba(251,170,54,.1)',
        stroke: null
    }));

    // ------------------- export footer ----------------------

    // NB: this is not a template per se, in that it is added to the diagram
    // statically, rather than being bound to something in the model.
    // But we put it here because it is about creating parts and stuff.

    function createExportFooter() {
        return mk(go.Node, go.Panel.Spot, {
            layerName: 'Foreground',
            location: new go.Point(0, 0),
            scale: 1,
            opacity: 0,
            pickable: false,
            selectable: false
        }, mk(go.Shape, 'Rectangle', {
            name: 'rectangle',
            height: 60,
            fill: null,
            stroke: null
        }), mk(go.Picture, {
            source: 'assets/img/metamap-logo-50.png',
            alignment: go.Spot.TopLeft,
            alignmentFocus: go.Spot.TopLeft,
            width: 195,
            height: 50
        }), mk(go.TextBlock, {
            text: 'metamap.cabreraresearch.org',
            alignment: go.Spot.BottomLeft,
            alignmentFocus: go.Spot.BottomLeft,
            width: 200
        }), mk(go.TextBlock, {
            name: 'mapTitle',
            text: '',
            textAlign: 'right',
            alignment: go.Spot.TopRight,
            alignmentFocus: go.Spot.TopRight,
            width: 300
        }), mk(go.TextBlock, {
            name: 'authorName',
            text: '',
            textAlign: 'right',
            alignment: go.Spot.BottomRight,
            alignmentFocus: go.Spot.BottomRight,
            width: 300
        }));
    }

    // creates or refreshes the footer logo/text that is displayed in the image export
    this.addExportFooter = function () {
        if (!_exportFooter) {
            _exportFooter = createExportFooter();
            map.getDiagram().add(_exportFooter);
        }
    };

    this.showExportFooter = function () {
        var rect = map.computeMapBounds();
        // put footer at least 100 px below bottom of map; make it at least 500px wide
        var x = rect.x;
        var y = rect.y + rect.height + Math.max(100, rect.height / 5);
        var w = Math.max(500, rect.width);
        //console.log('showExportFooter, bounds rect: ' + rect + ', w: ' + w);
        _exportFooter.location = new go.Point(x, y);
        _exportFooter.findObject('rectangle').width = w;
        _exportFooter.findObject('mapTitle').text = 'Map Title: ' + editor.mapTitle;
        _exportFooter.findObject('authorName').text = 'Author: ' + editor.userName;
        _exportFooter.opacity = 1;
        _exportFooter.invalidateLayout();
    };

    this.hideExportFooter = function () {
        _exportFooter.opacity = 0;
    };
};
// show corners on mouseover
// drag to D (make it sisters)
// show corners on mouseover
// drag to S (make it children)

},{}],15:[function(require,module,exports){
'use strict';

SandbankEditor.UI = function ($scope, map) {

    var self = this;

    // ----------- tab ("slider") IDs - tabs are rendered in views/maps/_form --------------
    //this.TAB_ID_HISTORY = 'history-tab';
    this.TAB_ID_PRESENTER = 'presenter-tab';
    this.TAB_ID_ANALYTICS_MAP = 'analytics-tab-map';
    this.TAB_ID_ANALYTICS_THING = 'analytics-tab-thing';
    this.TAB_ID_PERSPECTIVES = 'perspectives-tab';
    this.TAB_ID_DISTINCTIONS = 'distinctions-tab';
    this.TAB_ID_ATTACHMENTS = 'attachments-tab';
    this.TAB_ID_GENERATOR = 'generator-tab';
    this.TAB_ID_STANDARDS = 'standards-tab';

    this.init = function () {};

    // ------------ editor options for map/user ----------

    var mapEditorOptions = {};

    var defaultEditorOptions = {
        // noArrows, to, from, toFrom
        defaultRelationshipDirection: 'noArrows',
        // left, right, stacked, freehand
        defaultThingLayout: 'left',
        // lines, spotlight, both
        perspectiveMode: 'lines'
    };

    // called when map is loaded to set stored options for map
    this.setMapEditorOptions = function (options) {
        mapEditorOptions = options;
    };

    // returns appropriate values from the user profile or the default options if options are not set for the map
    this.getMapEditorOptions = function () {
        var profileOptions = $scope.userProfile ? $scope.userProfile.editorOptions : null;
        var vals = [mapEditorOptions, profileOptions, defaultEditorOptions];
        mapEditorOptions = _.find(vals, function (val) {
            return !_.isEmpty(val);
        });
        return mapEditorOptions;
    };

    // saves default options for the user (map options are saved in autosave.js)
    function saveUserEditorOptions(options) {
        var data = {
            user: {
                editor_options: JSON.stringify(options)
            }
        };

        startSpinner();
        $http.put('/users/' + $scope.userId + '.json', data).then(function (response) {
            stopSpinner();
        }, function () {
            stopSpinner();
            $scope.profileEditStatus = 'Could not save editor options';
        });
    }

    // options modal

    $scope.editorOptions = new SandbankEditorOptions($scope);

    this.editOptions = function () {
        $scope.editorOptions.openModal(mapEditorOptions, function (options) {
            // onSaveDefaults
            saveUserEditorOptions(options);
        }, function (options) {
            // onUpdate
            mapEditorOptions = options;
            map.getAutosave().saveNow('edit_options');
        });
    };

    // ------------ state model ----------

    this.state = {};

    var defaultState = {
        showNavigator: false,
        currentTab: null,
        perspectivePointKey: null,
        distinctionThingKey: null
    };

    this.setStateData = function (data) {};

    // TODO: Save state more frequently?? Currently it is only saved when autosave is triggered by other actions...

    this.getStateData = function () {
        return self.state;
    };

    // ----------- temporary state flags ------------

    this.zoomingToRegion = false;

    this.mouseOverGroup = null;
    this.mouseOverLink = null;

    this.dragTargetGroup = null;
    this.dragTargetPosition = null;

    this.helpTip = null;

    // ----------- handle bottom tabs ("sliders") -------------

    // in the following functions, ID is e.g. 'history-tab' (ID of one of the .bottom-tab's)

    // this is called by map.currentTabChanged, which is triggered by a $scope.$watch
    this.currentTabChanged = function (newValue, oldValue) {
        //console.log('ui, currentTabChanged: ' + newValue);
        self.state.currentTab = newValue;
    };

    this.currentTabIs = function (tabID) {
        return $scope.currentTab == tabID;
    };

    this.openTab = function (tabID) {};

    this.closeTab = function (tabID) {};

    this.disableTab = function (tabID) {
        // prevent opening other tabs when in P or D editor
        if ($scope.currentTab == self.TAB_ID_PERSPECTIVES || $scope.currentTab == self.TAB_ID_DISTINCTIONS) {
            return true;
        }
        return false;
    };

    this.toggleTab = function (tabID) {};

    this.toggleNavigator = function () {};

    this.toggleZoomingToRegion = function () {};

    // ----------------- zooming functions -------------------

    this.canZoomIn = function () {
        return map.getDiagram().scale < 32;
    };

    this.canZoomOut = function () {
        return map.getDiagram().scale > 0.25;
    };

    this.zoomIn = function () {
        var diagram = map.getDiagram();
        if (diagram.scale < 32) {
            var vb = diagram.viewportBounds.copy();
            diagram.scale = diagram.scale * 2;
            diagram.centerRect(vb);
        }
    };

    this.zoomOut = function () {
        var diagram = map.getDiagram();
        if (diagram.scale > 0.25) {
            var vb = diagram.viewportBounds.copy();
            diagram.scale = diagram.scale / 2;
            diagram.centerRect(vb);
        }
    };

    this.maybeZoomToRegion = function () {
        var diagram = map.getDiagram();
        // this flag is set by the toolbar button
        if (self.zoomingToRegion) {
            self.zoomingToRegion = false;
            console.log('zoomToRegion, selection count: ' + diagram.selection.count);
            var rect = diagram.computePartsBounds(diagram.selection);
            diagram.zoomToRect(rect);
        }
        //$scope.safeApply();
    };

    this.resetZoom = function () {
        var diagram = map.getDiagram();
        //var rect = diagram.computePartsBounds(diagram.nodes).copy();
        var rect = map.safeRect(map.computeMapBounds());
        //console.log('resetZoom, bounds: ' + rect);
        if (rect.width) {
            rect.inflate(rect.width / 5, rect.height / 5);
        }
        diagram.zoomToRect(rect);
        diagram.alignDocument(go.Spot.Center, go.Spot.Center);
        if (diagram.scale > 1) {
            diagram.scale = 1;
        }
    };

    // ------------ thing options (layout) ----------------

    this.getSelectedThingsOrDefaultLayout = function () {
        var sl = self.getSelectedThingsLayout();
        if (sl) {
            return sl;
        } else {
            return mapEditorOptions.defaultThingLayout;
        }
    };

    // returns a non-null value only if all selected items are groups with the same layout
    this.getSelectedThingsLayout = function () {
        var diagram = map.getDiagram();
        if (diagram === null || diagram.selection.count < 1) return null;

        var layout = null;
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (!it.value instanceof go.Group) return null;
            var group = it.value;
            //console.log('getSelectedThingsLayout, it.value: ' + group);
            var groupLayout = group.data ? group.data.layout : null;
            if (layout !== null && groupLayout != layout) return null;
            layout = groupLayout;
        }
        //console.log('getSelectedThingsLayout: ' + layout);

        return layout;
    };

    // sets the layout of all selected things to the given layout
    this.setSelectedThingsLayout = function (layoutName) {
        var diagram = map.getDiagram();
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Group) {
                var group = it.value;
                diagram.model.setDataProperty(group.data, 'layout', layoutName);
                map.getLayouts().setDescendantLayouts(group, group.data.layout);
                map.refresh();
            }
        }
    };

    // ------------ relationship options (direction) ----------------

    this.getSelectedRelationshipsOrDefaultDirection = function () {
        var sd = self.getSelectedRelationshipsDirection();
        if (sd) {
            return sd;
        } else {
            return mapEditorOptions.defaultRelationshipDirection;
        }
    };

    // returns a non-null value only if all selected items are relationships with the same direction
    this.getSelectedRelationshipsDirection = function () {
        var diagram = map.getDiagram();
        if (diagram === null || diagram.selection.count < 1) return null;

        var type = null;
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (!it.value instanceof go.Link) return null;
            var link = it.value;
            var linkType = link.data ? link.data.type : null;
            if (type !== null && linkType != type) return null;
            type = linkType;
        }

        return type;
    };

    // sets the direction of all selected relationships to the given direction
    this.setSelectedRelationshipsDirection = function (direction) {
        var diagram = map.getDiagram();
        //diagram.model.startTransaction("change relationship direction");
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Link) {
                //diagram.model.startTransaction("change link type");
                diagram.model.setDataProperty(it.value.data, 'type', direction);
                //diagram.model.commitTransaction("change link type");
            }
        }
        //diagram.commitTransaction("change relationship direction");
    };

    // ------- handle corner clicks and double clicks --------

    var _cornerClicked = null;
    var _cornerFunction = null;
    var _cornerTimeout = 300;

    this.handleCornerClick = function (corner, thing) {
        //console.log('handleCornerClick: corner = ' + corner + ', cornerClicked = ' + _cornerClicked);
        // assume it's a single click, and set handler
        _cornerFunction = getCornerFunction(corner, 1);
        // already clicked, so it's a double click; change handler
        if (_cornerClicked == corner) {
            _cornerFunction = getCornerFunction(corner, 2);
            console.log('handleCornerClick: double click on ' + corner);
            return;
        }
        // remember that at least one click has happened for the current corner
        _cornerClicked = corner;

        // set timer to invoke whatever handler we have ready to go (unless another click happens within the interval)
        var timer = setTimeout(function () {
            // ding! invoke it
            if (_cornerFunction == self.showCornerTip) {
                _cornerFunction(thing, corner);
            } else {
                _cornerFunction(thing); // don't pass the corner arg to things like createChild that have a different second arg
            }
            // reset handler and clicked flag
            _cornerFunction = getCornerFunction(corner, 1);
            _cornerClicked = null;
        }, _cornerTimeout);
    };

    function getCornerFunction(corner, clicks) {
        if (corner == 'D') {
            return clicks == 1 ? self.showCornerTip : map.createSister;
        } else if (corner == 'S') {
            return clicks == 1 ? map.toggleSExpansion : map.createChild;
        } else if (corner == 'R') {
            return clicks == 1 ? self.showCornerTip : map.createRToSister;
        } else if (corner == 'P') {
            return clicks == 1 ? map.togglePExpansion : map.getPerspectives().setPEditorPoint;
        } else if (corner === '') {
            // click on text
            return clicks == 1 ? self.showCornerTip : editText;
        } else {
            return function () {
                console.log('getCornerFunction: no function found for corner: ' + corner + '!');
            };
        }
    }

    // NB: in this case the thing is actually the TextBox, except in outline layout it is a Panel if the box is double-clicked...
    function editText(thing, corner) {
        if (!$scope.canEdit) {
            return null;
        }

        console.log('editText, thing: ' + thing);
        if (thing instanceof go.Panel) {
            // outline layout
            var part = thing.part;
            console.log('editText, part: ' + part);
            if (part instanceof go.Group && part.data && (part.data.layout == 'left' || part.data.layout == 'right')) {
                var textBlockName = 'externaltext-' + part.data.layout;
                var text = thing.part.findObject(textBlockName);
                if (text) {
                    thing = text;
                }
            }
        }
        map.getDiagram().commandHandler.editTextBlock(thing);
    }

    // ---------------- help tip functions - see also user.js, views/maps/help_tab ---------------

    // shows thingTip or one of the cornerXTips
    this.showCornerTip = function (thing, corner) {
        //console.log('showCornerTip');
        if (corner === '') {
            self.showHelpTip('thingTip');
        } else {
            self.showHelpTip('corner' + corner + 'Tip');
        }
    };

    this.showHelpTip = function (tip) {
        //console.log('showHelpTip: ' + tip);

        // don't show help if in presenter
        if (self.currentTabIs(self.TAB_ID_PRESENTER)) {
            return;
        }

        self.helpTip = tip;
        //$scope.safeApply();
        $('#help-tip').show();

        setTimeout(function () {
            $('#help-tip').fadeOut(500, function () {
                self.helpTip = null;
                //$scope.safeApply();
            });
        }, 5000);
    };

    // ------------ edit map UserTags ---------------

    $scope.tagging = {};

    this.editUserTags = function () {
        $scope.tagging.openModal([$scope.mapId], true, // show description field
        function () {
            map.getAutosave().saveNow('edit_usertags');
        } // on update
        );
    };

    // ------------ edit map sharing ---------------

    $scope.sharing = {};

    this.editMapShares = function () {
        $scope.sharing.openModal([$scope.mapId], function () {} // on update
        );
    };

    // ------------ print/export to image ---------------

    this.printSlides = function () {
        startSpinner();
        map.getPresenter().createSlideThumbnails();
        stopSpinner();
        setTimeout(function () {
            window.print();
        }, 500);
    };

    var MILLION = 1000 * 1000;

    this.exportToImage = function (format) {

        $scope.imageExportLoading = true;
        $('#export-image img').remove();
        map.getTemplates().showExportFooter();

        var rect = map.getDiagram().computePartsBounds(map.getDiagram().nodes).copy();

        var imageMB = rect.width * rect.height * 4 / MILLION; // 4 bytes/pixel
        //console.log('imageMB: ' + imageMB);

        // make the max size of the image 10MB
        // pngSize = imageMB * scale * scale
        // so max scale = sqrt(pngSize / imageMB)
        // These calculations don't seem to be right, but in practice using 500 here
        // we get a scale of 2.43 for an image 19984 x 3424 pixels
        // which results in a file size of 1.88 MB at 32 bits/pixel...
        // OR 28380 x 5196 pixels, scale = 3.41 => file size = 3.49 MB
        var scale = 4;
        if (imageMB) {
            scale = Math.min(4, Math.sqrt(50 / imageMB));
        }

        //console.log('image dimensions: ' + rect.width + ' x ' + rect.height + ', image bytes: ' + (rect.width * rect.height * 4) +
        //        ', imageMB: ' + imageMB + ', scale: ' + scale);

        $scope.showImageExport = true;

        var partsToExport = new go.List();
        partsToExport.addAll(map.getDiagram().nodes);
        partsToExport.addAll(map.getDiagram().links);
        partsToExport.remove(map.getPresenter().slideBlocker);

        var doImage = $timeout(function () {
            var img = map.getDiagram().makeImage({
                parts: partsToExport,
                maxSize: new go.Size((rect.width + 200) * scale, (rect.height + 200) * scale),
                scale: scale,
                padding: 100 * scale,
                background: '#ffffff'
            });

            $('#export-image').append(img);
            $scope.imageExportLoading = false;

            map.getTemplates().hideExportFooter();
        }, 100);
    };

    // --------- utils -------------

    this.splitLines = function (text) {
        return text.split(/\n/);
    };
};

//$scope.safeApply(function() {
//    self.state = data || defaultState;
//    //$scope.currentTab = self.state.currentTab;
//});

//$scope.safeApply(function() {
//    $scope.currentTab = tabID;
//});

//$scope.safeApply(function() {
//    self.state.currentTab = null; // TODO: trigger autosave
//    $scope.currentTab = null;
//});

//$scope.safeApply(function() {
//    if ($scope.currentTab == tabID) {
//        $scope.currentTab = null;
//    } else if (!self.disableTab(tabID)) {
//        $scope.currentTab = tabID;
//    }
//});

//$scope.safeApply(function() {
//    self.state.showNavigator = !self.state.showNavigator;
//});

//$scope.safeApply(function() {
//    self.zoomingToRegion = !self.zoomingToRegion;
//});

},{}],16:[function(require,module,exports){
'use strict';

window.UserCtrl = function ($scope) {

    // query string params
    $scope.params = URI(window.location).query(true);

    // auto-open thinkquery?
    $scope.thinkquery = $scope.params.thinkquery ? true : false;

    $scope.userId = window.userId; // set in layouts/user
    $scope.userIsAdmin = window.userIsAdmin;
    $scope.userName = '';
    $scope.userProfile = null;
    $scope.profileEditStatus = '';
    $scope.password = '';
    $scope.passwordConfirm = '';

    $scope.getNewWindowName = function (action, mapId) {
        if (action == 'VIEW_MAP') {
            return 'VIEW_MAP_' + mapId;
        }
    };

    // show/hide tests UI and model debug form
    $scope.showTests = false;
    $scope.showModel = false;

    $scope.toggleShowTests = function () {
        $scope.showTests = !$scope.showTests;
    };
    $scope.toggleShowModel = function () {
        $scope.showModel = !$scope.showModel;
    };

    $scope.setUserId = function (id) {
        $scope.userId = id;
    };

    function init() {
        window.addEventListener('resize', fixRowHeights);
    }

    // make all cells in a row the same height
    function fixRowHeights() {}

    $scope.loadUserProfile = function (callback) {
        if ($scope.userId) {
            var url = '/users/' + $scope.userId + '/profile.json';
            window.startSpinner();
            $http.get(url).then(function (response) {
                // success
                $scope.userProfile = response.data;
                initSelectedAdminTags();
                initSelectedFollowableOrgs();
                if ($scope.ccsTagging) {
                    $scope.ccsTagging.loadCcsTags();
                }
                window.stopSpinner();
                if (callback) {
                    callback.call();
                }
                fixRowHeights();
            }, function (reason) {
                // error
                window.stopSpinner();
                alert('Could not load user profile data');
            });
        }
    };

    $scope.loadUserProfile();

    // -------------- courses/subscriptions ------------------

    // open the Stripe Checkout dialog and get a token
    // NB: amount is stored in the Stripe plan definition
    $scope.addSubscription = function (plan) {
        var handler = StripeCheckout.configure({
            key: $scope.userProfile.account.stripeKey,
            name: 'Subscribe to MetaMap',
            image: '/assets/badge-logo-64.png',
            description: plan.name,
            panelLabel: 'Pay {{amount}}/' + plan.interval,
            amount: plan.price,
            allowRememberMe: false,
            email: $scope.userProfile.user.email,
            token: function token(_token, args) {
                console.log('token: ', _token);
                window.startSpinner();
                $http.post('/charges/subscribe', {
                    plan_id: plan.code,
                    token_id: _token.id
                }).then(function (response) {
                    $scope.loadUserProfile(function () {
                        alertify.success('Subscription created');
                    });
                }, function () {
                    $scope.loadUserProfile(function () {
                        alertify.error('Subscription could not be created');
                    });
                });
            }
        });
        handler.open();
    };

    // for buy-course-button directive
    $scope.getBuyButtonLabel = function (id) {
        var course;
        if (course = getFreeCourse(id)) {
            return 'Free';
        } else if (course = getEnrolledCourse(id)) {
            return 'Enrolled';
        } else if (course = getEnrollableCourse(id)) {
            return 'Enroll - $' + (course.price / 100).toFixed(2);
        } else {
            return '';
        }
    };

    $scope.getCourseStatusSummary = function (id) {
        var course = $scope.getCourse(id);
        if (course) {
            var text = course.stepsCompleted + ' of ' + course.steps + ' steps completed';
            if (course.enrolment) {
                text = 'Enrolled ' + course.enrolment.date + (course.enrolment.stripeData.refunded ? ' (Refunded)' : '') + ' - ' + text;
            }
            return course.code + ' - ' + text;
        } else {
            return null;
        }
    };

    $scope.getCourseCompletedPercent = function (id) {
        var course = $scope.getCourse(id);
        if (course) {
            return course.stepsCompletedPercent;
        } else {
            return null;
        }
    };

    $scope.maybeBuyCourse = function (id) {
        var course;
        if (course = getFreeCourse(id)) {
            window.location.href = '/courses/' + course.id;
        } else if (course = getEnrolledCourse(id)) {
            window.location.href = '/courses/' + course.id;
        } else if (course = getEnrollableCourse(id)) {
            $scope.buyCourse(course);
        }
    };

    $scope.getCourse = function (id) {
        var course;
        if (course = getFreeCourse(id)) {
            return course;
        } else if (course = getEnrolledCourse(id)) {
            return course;
        } else if (course = getEnrollableCourse(id)) {
            return course;
        }
        return null;
    };

    function getFreeCourse(id) {
        return $scope.userProfile && _.find($scope.userProfile.freeAccessibleCourses, function (course) {
            return course.id == id && course.enrolment == undefined;
        });
    }

    function getEnrolledCourse(id) {
        return $scope.userProfile && _.find($scope.userProfile.freeAccessibleCourses, function (course) {
            return course.id == id && course.enrolment !== undefined;
        });
    }

    function getEnrollableCourse(id) {
        return $scope.userProfile && _.find($scope.userProfile.nonFreeAccessibleCourses, function (course) {
            return course.id == id;
        });
    }

    // open the Stripe Checkout dialog and get a token
    // NB: amount is passed from our course definition
    $scope.buyCourse = function (course) {
        var handler = StripeCheckout.configure({
            key: $scope.userProfile.account.stripeKey,
            name: 'Enroll in Course',
            image: '/assets/badge-logo-64.png',
            description: course.code,
            amount: course.price,
            allowRememberMe: false,
            email: $scope.userProfile.user.email,
            token: function token(_token2, args) {
                console.log('token: ', _token2);
                window.startSpinner();
                $http.post('/charges/buy_course', {
                    course_code: course.code,
                    course_price: course.price,
                    token_id: _token2.id
                }).then(function (response) {
                    $scope.loadUserProfile(function () {
                        alertify.success('Course purchased');
                    });

                    // reload page to handle stripe bug (?) - links not clickable
                    window.setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }, function (response) {
                    $scope.loadUserProfile(function () {
                        alertify.error('Course purchase could not be completed');
                        console.log('stripe error: ', response);
                    });
                });
            }
        });
        handler.open();
    };

    $scope.cancelSubscription = function (subscription) {
        window.startSpinner();
        $http['delete']('/charges/unsubscribe?subscription_id=' + subscription.id).then(function (response) {
            $scope.loadUserProfile(function () {
                alertify.success('Subscription cancelled');
            });
        }, function () {
            $scope.loadUserProfile(function () {
                alertify.error('Subscription could not be cancelled');
            });
        });
    };

    // debug/test only
    $scope.clearCustomer = function () {
        window.startSpinner();
        $http['delete']('/charges/clear_customer').then(function (response) {
            $scope.loadUserProfile(function () {
                alertify.success('Customer cleared');
            });
        }, function () {
            $scope.loadUserProfile(function () {
                alertify.error('Customer could not be cleared');
            });
        });
    };

    // -------------- points and badges ----------------

    $scope.hasCurrentBadge = function (key, level) {
        return $scope.userProfile && $scope.userProfile.badges.current[key] == level;
    };

    $scope.hasNewBadge = function (key, level) {
        return $scope.userProfile && $scope.userProfile.badges['new'][key] == level;
    };

    $scope.hasNewBadges = function () {
        return $scope.userProfile && _.keys($scope.userProfile.badges['new']).length > 0;
    };

    $scope.getBadgeDefinition = function (key) {
        return _.findWhere($scope.userProfile.badges.definitions, {
            key: key
        });
    };

    // -------------- tutorial -----------------

    try {
        $scope.tutorialEnabled = function () {
            return window.mapData !== undefined;
        };

        // start tutorial:
        var _tutorial = new SandbankEditor.Tutorial();

        $scope.startTutorial = function () {
            _tutorial.start();
        };
    } catch (e) {}

    // -------------- feedback form -----------------

    $scope.feedback = '';

    $scope.toggleFeedback = function () {
        $('#feedback-dropdown').slideToggle('fast').find('textarea').get(0).focus();
    };

    $scope.submitFeedback = function () {
        if ($scope.feedback === '') {
            return; // empty input...
        }

        $.ajax({
            type: 'POST',
            url: '/users/feedback',
            data: {
                url: window.location.href,
                feedback: $scope.feedback
            },
            success: function success() {
                $scope.feedback = '';
                alert('Thank you for your feedback!');
            },
            error: function error() {
                console.error('error sending feedback: ', arguments);
            }
        });

        $('#feedback-dropdown').slideToggle('fast');
    };

    // --------- user's user tags -----------

    // NB: this is similar to maps tagging in tagging.js - but simpler, as we do not have to deal with
    // multiple taggable items, which means tracking existing vs. new tags, etc...

    $scope.newTag = {
        name: ''
    };

    // tag autocomplete
    $scope.getUserTags = function (viewValue) {
        var url = '/user_tags/list.json?q=' + viewValue;
        return $http.get(url).then(function (response) {
            return response.data.tags;
        });
    };

    $scope.updateUserUserTags = function () {
        var tagList = _.pluck($scope.userProfile.userTags, 'name').join(',');
        $http.put('/user_tags/update_user_user_tags', [tagList]).then(function (response) {
            $scope.loadUserProfile();
            $scope.profileEditStatus = 'Tags saved';
        }, function () {
            $scope.profileEditStatus = 'Could not save tags';
        });
    };

    $scope.deleteTag = function (tag) {
        var i = _.indexOf($scope.userProfile.userTags, tag);
        $scope.userProfile.userTags.splice(i, 1);
        $scope.updateUserUserTags();
    };

    $scope.tagSelected = function (item, model, label) {
        //console.log('tagSelected: ', item, model, label);
        $scope.addTag(item.name);
    };

    $scope.editingTagKeypress = function (e) {
        if (e.which == 13) {
            $scope.addTag($scope.newTag.name);
        }
    };

    $scope.addTag = function (tagName) {
        $scope.userProfile.userTags.push({
            name: tagName
        });
        $scope.newTag.name = '';
        $scope.updateUserUserTags();
    };

    // --------- user's/map's CCS tags -----------

    // this manages CCS tags for either the current user or the current map,
    // depending which page we're on - mapId gets overridden in editor.js if we're editing a map

    try {
        $scope.ccsTagging = new SandbankCcsTagging($scope);
        $scope.ccsTagging.mapId = null;
    } catch (e) {}

    // --------- user's admin tags -----------

    // key (index): admin tag ID; value: true/false (if user follows the admin tag)
    $scope.selectedUserAdminTags = [];

    function initSelectedAdminTags() {
        $scope.selectedUserAdminTags = [];
        _.each($scope.userProfile.adminTags, function (tag) {
            if (_.findWhere($scope.userProfile.userAdminTags, {
                id: tag.id
            })) {
                $scope.selectedUserAdminTags[tag.id] = true;
            }
        });
    }

    $scope.updateUserAdminTags = function () {
        var selectedTagNames = _.map($scope.userProfile.adminTags, function (tag) {
            return $scope.selectedUserAdminTags[tag.id] ? tag.name : null;
        });
        var tagList = _.without(selectedTagNames, null).join(',');
        $http.put('/admin_tags/update_user_admin_tags', [tagList]).then(function (response) {
            $scope.loadUserProfile();
            $scope.profileEditStatus = 'Interests saved';
        }, function () {
            $scope.profileEditStatus = 'Could not save interests';
        });
    };

    // --------- user's followed orgs -----------

    // key (index): org ID; value: true/false (if user follows the org)
    $scope.selectedFollowableOrganizations = [];

    $scope.userIsFollowingOrg = function (id) {
        return $scope.selectedFollowableOrganizations[id];
    };

    $scope.toggleUserFollowingOrg = function (id) {
        if (!$scope.selectedFollowableOrganizations[id] || confirm('Stop following this ThinkNation?')) {
            $scope.selectedFollowableOrganizations[id] = !$scope.selectedFollowableOrganizations[id];
            $scope.updateFollowedOrganizations();
        }
    };

    function initSelectedFollowableOrgs() {
        $scope.selectedFollowableOrganizations = [];
        _.each($scope.userProfile.followedOrganizations, function (org) {
            if (_.findWhere($scope.userProfile.followableOrganizations, {
                id: org.id
            })) {
                $scope.selectedFollowableOrganizations[org.id] = true;
            }
        });
    }

    $scope.updateFollowedOrganizations = function () {
        var selectedOrgIds = _.map($scope.userProfile.followableOrganizations, function (org) {
            return $scope.selectedFollowableOrganizations[org.id] ? org.id : null;
        });
        var orgIdList = _.without(selectedOrgIds, null).join(',');
        $http.put('/organization_follows/update_user_organization_follows', [orgIdList]).then(function (response) {
            $scope.loadUserProfile();
            $scope.profileEditStatus = 'ThinkNations saved';
        }, function () {
            $scope.profileEditStatus = 'Could not save ThinkNations';
        });
    };

    // ------------ auto-save user profile ---------------

    // don't let autosave be triggered more than every N milliseconds...
    $scope.autosave = _.debounce(autosaveNow, 2000);

    function autosaveNow() {
        //console.log('autosaving user profile');
        var data = {
            email: $scope.userProfile.user.email,
            alt_email: $scope.userProfile.user.altEmail,
            first_name: $scope.userProfile.user.firstName,
            last_name: $scope.userProfile.user.lastName,
            about_me: $scope.userProfile.user.aboutMe
        };
        if ($scope.passwordsMatch() && $scope.password.length) {
            data.password = $scope.password;
            data.password_confirmation = $scope.password;
        }

        startSpinner();
        $scope.profileEditStatus = 'Saving...';
        $http.put('/users/' + $scope.userId, data).then(function (response) {
            stopSpinner();
            if (_.has(data, 'password')) {
                $scope.profileEditStatus = 'Profile and password saved';
                console.log($scope.profileEditStatus);
            } else {
                $scope.profileEditStatus = 'Profile saved';
                console.log($scope.profileEditStatus);
            }
        }, function () {
            stopSpinner();
            $scope.profileEditStatus = 'Could not save profile';
        });
    }

    $scope.passwordsMatch = function () {
        return !$scope.password.length && !$scope.passwordConfirm.length || $scope.password == $scope.passwordConfirm;
    };

    // ------------ upload avatar ---------------

    // using: https://github.com/danialfarid/angular-file-upload
    $scope.onAvatarFileSelect = function ($files) {
        startSpinner();
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: 'users/' + userId,
                method: 'PUT',
                withCredentials: true,
                file: file, // or list of files: $files for html5 only
                fileFormDataName: 'user[avatar]'
            }).success(function (data, status, headers, config) {
                $scope.loadUserProfile();
                $scope.profileEditStatus = 'Photo updated';
                stopSpinner();
            }).error(function () {
                stopSpinner();
                $scope.profileEditStatus = 'Error: Could not upload photo';
            })
            //.then(success, error, progress);
            ;
        }
    };

    // --------------- view helpers -------------------

    // returns e.g. "a day ago"
    // (NB: now is obtained from the DB to ensure that we have both dates in UTC;
    //    also, SQL vs. ruby dates need to be coerced into a similar format, both in UTC - see feed.json.jbuilder)
    $scope.getEventTime = function (t, now) {
        var time = moment(t, 'YYYY-MM-DD HH:mm:ss.SSS');
        var nowtime = moment(now, 'YYYY-MM-DD HH:mm:ss.SSS');
        // console.log('t:       ' + t);
        // console.log('now:     ' + now);
        // console.log('time:    ' + time.format()); // + ' ' + time.isValid());
        // console.log('nowtime: ' + nowtime.format()); // + ' ' + nowtime.isValid());
        return time.from(nowtime);
    };

    // --------------- notifications -------------------

    $scope.getNotificationFeedUrl = function (notification) {
        if (notification.actions.length) {
            var action = notification.actions[0];
            if (action.action == 'LIKE') {
                return '/social?like_id=' + action.likeId;
            } else if (action.action == 'COMMENT') {
                return '/social?comment_id=' + action.commentId;
            } else if (action.action == 'SHARE_INDIVIDUAL') {
                return '/maps/' + action.mapId;
            } else if (action.action == 'SHARE_PUBLIC') {
                return '/social?share_id=' + action.shareId;
            }
        }
        return '';
    };

    $scope.deleteNotification = function (notification) {
        $http['delete']('/notifications/' + notification.id + '.json').then(function (response) {
            // success
            notification.deleted = true;
        }, function (reason) {
            // error
            alert('Could not delete notification');
        });
    };

    $scope.notificationVerb = function (action) {
        var verbs = {
            LIKE: 'liked this:',
            COMMENT: 'commented on this:',
            SHARE_INDIVIDUAL: 'shared a MetaMap with you',
            SHARE_PUBLIC: 'shared a MetaMap with everyone',
            MAP_FOLLOW: 'followed a MetaMap:',
            USER_FOLLOW: 'followed you'
        };
        return verbs[action];
    };

    // ------------ utility functions ---------------

    // handy function for use with ng-class on radio buttons
    $scope.classIf = function (klass, b) {
        //console.log('classIf: ' + klass + ', ' + b);
        return b ? klass : '';
    };

    // avoid '$apply already in progress' error (source: https://coderwall.com/p/ngisma)
    $scope.safeApply = function (fn) {
        //console.log('safeApply on scope: ' + $scope);

        // TODO? restore non-Angular version of this method
        //var phase = this.$root.$$phase;
        //if (phase == '$apply' || phase == '$digest') {
        if (fn && typeof fn === 'function') {
            fn();
        }
        //} else {
        //    this.$apply(fn);
        //}
    };

    // source: http://ctrlq.org/code/19616-detect-touch-screen-javascript
    $scope.isTouchDevice = function () {
        return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    };

    init();
};

// window.setTimeout(function() {
//     $('.row-height').each(function() { 
//         var highestBox = 0;
//         $('> div', this).each(function(){
//             if ($(this).height() > highestBox)
//                 highestBox = $(this).height();
//         }); 
//         $('> div', this).height(highestBox);
//     });       
// }, 300);

},{}],17:[function(require,module,exports){
'use strict';

var COLORS = {
    groupFillColor: '#f9f9f9',
    colorPLight: '#FDDDAF',
    colorPDark: '#C9882B',

    // DSRP colors (from _variables.scss)
    colorD: '#f2624c',
    colorR: '#4cbfc2',
    colorS: '#96c93d',
    colorP: '#fbaa36',

    white: '#000'
};

Object.freeze(COLORS);

module.exports = COLORS;

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Auth0Lock = require('auth0-lock');

var Auth0 = (function () {
    function Auth0() {
        _classCallCheck(this, Auth0);

        this.lock = new Auth0Lock('wsOnart23yViIShqT4wfJ18w2vt2cl32', 'metamap.auth0.com');
        this.lock.on('loading ready', function () {
            for (var _len = arguments.length, e = Array(_len), _key = 0; _key < _len; _key++) {
                e[_key] = arguments[_key];
            }
        });
    }

    _createClass(Auth0, [{
        key: 'login',
        value: function login() {
            var that = this;

            var promise = new Promise(function (fulfill, reject) {
                that.getSession().then(function (profile) {
                    if (profile) {
                        fulfill(profile);
                    } else {
                        that.lock.show({
                            closable: false,
                            loginAfterSignup: true,
                            authParams: {
                                scope: 'openid offline_access'
                            }
                        }, function (err, profile, id_token, ctoken, opt, refresh_token) {
                            if (err) {
                                reject(err);
                            } else {
                                localforage.setItem('id_token', id_token);
                                localforage.setItem('profile', profile);
                                localforage.setItem('refresh_token', refresh_token);
                                that.id_token = id_token;
                                that.profile = profile;
                                that.refresh_token = refresh_token;
                                fulfill(profile);
                            }
                        });
                    }
                });
            });
            return promise;
        }
    }, {
        key: 'linkAccount',
        value: function linkAccount() {
            var that = this;
            this.lock.show({
                callbackURL: 'https://popping-fire-897.firebaseapp.com/',
                dict: {
                    signin: {
                        title: 'Link with another account'
                    }
                },
                authParams: {
                    access_token: that.id_token || that.profile.identities[0].access_token
                }
            });
        }
    }, {
        key: 'getSession',
        value: function getSession() {
            var that = this;
            var getProfile = function getProfile(id_token, fulfill, reject) {
                return that.lock.getProfile(id_token, function (err, profile) {
                    if (err) {
                        reject(err);
                    } else {
                        localforage.setItem('id_token', id_token);
                        localforage.setItem('profile', profile);
                        that.id_token = id_token;
                        that.profile = profile;
                        fulfill(profile, id_token);
                    }
                });
            };
            var promise = new Promise(function (fulfill, reject) {
                var fulfilled = false;
                localforage.getItem('refresh_token').then(function (token) {
                    if (token) {
                        that.refresh_token = token;
                        that.lock.getClient().refreshToken(token, function (a, tokObj) {
                            getProfile(tokObj.id_token, fulfill, reject);
                        }, function (error) {
                            reject(error);
                        });
                    } else {
                        localforage.getItem('id_token').then(function (id_token) {
                            if (token) {
                                getProfile(id_token, fulfill, reject);
                            } else {
                                fulfill(null);
                            }
                        });
                    }
                });
            });
            return promise;
        }
    }, {
        key: 'logout',
        value: function logout() {
            localforage.removeItem('id_token');
            localforage.removeItem('refresh_token');
            localforage.removeItem('profile');
            this.profile = null;
            window.location.reload();
        }
    }]);

    return Auth0;
})();

module.exports = Auth0;

},{"auth0-lock":undefined}],21:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Firebase = require('firebase');

var MetaFire = (function () {
    function MetaFire() {
        _classCallCheck(this, MetaFire);

        this.fb = new Firebase('https://popping-fire-897.firebaseio.com');
    }

    _createClass(MetaFire, [{
        key: 'init',
        value: function init() {
            var _this = this;

            var that = this;
            var ret = new Promise(function (fulfill, reject) {
                localforage.getItem('id_token').then(function (id_token) {
                    MetaMap.Auth0.getSession().then(function (profile) {

                        MetaMap.Auth0.lock.getClient().getDelegationToken({
                            target: profile.clientID,
                            id_token: id_token,
                            api_type: 'firebase'
                        }, function (err, delegationResult) {
                            that.firebase_token = delegationResult.id_token;
                            localforage.setItem('firebase_token', that.firebase_token);
                            _this.fb.authWithCustomToken(that.firebase_token, function (error, authData) {
                                if (error) {
                                    reject(error);
                                } else {
                                    fulfill(authData);
                                }
                            });
                        });
                    });
                });
            });
            return ret;
        }
    }, {
        key: 'getChild',
        value: function getChild(path) {
            return this.fb.child(path);
        }
    }, {
        key: 'getData',
        value: function getData(path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            var promise = new Promise(function (resolve, reject) {
                child.on('value', function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });

            return promise;
        }
    }, {
        key: 'setData',
        value: function setData(data, path) {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            return child.set(data);
        }
    }, {
        key: 'logout',
        value: function logout() {
            this.fb.unauth();
        }
    }]);

    return MetaFire;
})();

module.exports = MetaFire;

},{"firebase":undefined}],22:[function(require,module,exports){
'use strict';

var googleAnalytics = function googleAnalytics(config) {
    var apiKey, e, r;
    if (config == null) {
        config = {};
    }
    apiKey = config.GOOGLE_ANALYTICS_TRACKING_ID;
    if (apiKey && window.location.hostname !== 'localhost') {
        window.GoogleAnalyticsObject = 'ga';
        window.ga || (window.ga = function () {
            (window.ga.q = window.ga.q || []).push(arguments);
        });
        window.ga.ga = +new Date();
        e = document.createElement('script');
        r = document.getElementsByTagName('script')[0];
        e.src = '//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e, r);
        ga('create', apiKey);
        return ga('send', 'pageview');
    }
};

module.exports = googleAnalytics;

},{}],23:[function(require,module,exports){
"use strict";

var newRelic = function newRelic(config) {
    var appId, licenseKey;
    if (config == null) {
        config = {};
    }
    licenseKey = config.NEW_RELIC_LICENSE_KEY;
    appId = config.NEW_RELIC_APPLICATION_ID;
    if (licenseKey && appId && window.location.hostname !== "localhost") {
        return (window.NREUM || (NREUM = {}), __nr_require = (function (t, e, n) {
            function r(n) {
                if (!e[n]) {
                    var o = e[n] = { exports: {} };t[n][0].call(o.exports, function (e) {
                        var o = t[n][1][e];return r(o ? o : e);
                    }, o, o.exports);
                }return e[n].exports;
            }if ("function" == typeof __nr_require) return __nr_require;for (var o = 0; o < n.length; o++) r(n[o]);return r;
        })({ QJf3ax: [function (t, e) {
                function n(t) {
                    function e(e, n, a) {
                        t && t(e, n, a), a || (a = {});for (var c = s(e), f = c.length, u = i(a, o, r), d = 0; f > d; d++) c[d].apply(u, n);return u;
                    }function a(t, e) {
                        f[t] = s(t).concat(e);
                    }function s(t) {
                        return f[t] || [];
                    }function c() {
                        return n(e);
                    }var f = {};return { on: a, emit: e, create: c, listeners: s, _events: f };
                }function r() {
                    return {};
                }var o = "nr@context",
                    i = t("gos");e.exports = n();
            }, { gos: "7eSDFh" }], ee: [function (t, e) {
                e.exports = t("QJf3ax");
            }, {}], 3: [function (t) {
                function e(t, e, n, i, s) {
                    try {
                        c ? c -= 1 : r("err", [s || new UncaughtException(t, e, n)]);
                    } catch (f) {
                        try {
                            r("ierr", [f, new Date().getTime(), !0]);
                        } catch (u) {}
                    }return "function" == typeof a ? a.apply(this, o(arguments)) : !1;
                }function UncaughtException(t, e, n) {
                    this.message = t || "Uncaught error with no additional information", this.sourceURL = e, this.line = n;
                }function n(t) {
                    r("err", [t, new Date().getTime()]);
                }var r = t("handle"),
                    o = t(5),
                    i = t("ee"),
                    a = window.onerror,
                    s = !1,
                    c = 0;t("loader").features.err = !0, window.onerror = e, NREUM.noticeError = n;try {
                    throw new Error();
                } catch (f) {
                    "stack" in f && (t(1), t(4), "addEventListener" in window && t(2), window.XMLHttpRequest && XMLHttpRequest.prototype && XMLHttpRequest.prototype.addEventListener && t(3), s = !0);
                }i.on("fn-start", function () {
                    s && (c += 1);
                }), i.on("fn-err", function (t, e, r) {
                    s && (this.thrown = !0, n(r));
                }), i.on("fn-end", function () {
                    s && !this.thrown && c > 0 && (c -= 1);
                }), i.on("internal-error", function (t) {
                    r("ierr", [t, new Date().getTime(), !0]);
                });
            }, { 1: 8, 2: 5, 3: 9, 4: 7, 5: 21, ee: "QJf3ax", handle: "D5DuLP", loader: "G9z0Bl" }], 4: [function (t) {
                function e() {}if (window.performance && window.performance.timing && window.performance.getEntriesByType) {
                    var n = t("ee"),
                        r = t("handle"),
                        o = t(2);t("loader").features.stn = !0, t(1), n.on("fn-start", function (t) {
                        var e = t[0];e instanceof Event && (this.bstStart = Date.now());
                    }), n.on("fn-end", function (t, e) {
                        var n = t[0];n instanceof Event && r("bst", [n, e, this.bstStart, Date.now()]);
                    }), o.on("fn-start", function (t, e, n) {
                        this.bstStart = Date.now(), this.bstType = n;
                    }), o.on("fn-end", function (t, e) {
                        r("bstTimer", [e, this.bstStart, Date.now(), this.bstType]);
                    }), n.on("pushState-start", function () {
                        this.time = Date.now(), this.startPath = location.pathname + location.hash;
                    }), n.on("pushState-end", function () {
                        r("bstHist", [location.pathname + location.hash, this.startPath, this.time]);
                    }), "addEventListener" in window.performance && (window.performance.addEventListener("webkitresourcetimingbufferfull", function () {
                        r("bstResource", [window.performance.getEntriesByType("resource")]), window.performance.webkitClearResourceTimings();
                    }, !1), window.performance.addEventListener("resourcetimingbufferfull", function () {
                        r("bstResource", [window.performance.getEntriesByType("resource")]), window.performance.clearResourceTimings();
                    }, !1)), document.addEventListener("scroll", e, !1), document.addEventListener("keypress", e, !1), document.addEventListener("click", e, !1);
                }
            }, { 1: 6, 2: 8, ee: "QJf3ax", handle: "D5DuLP", loader: "G9z0Bl" }], 5: [function (t, e) {
                function n(t) {
                    i.inPlace(t, ["addEventListener", "removeEventListener"], "-", r);
                }function r(t) {
                    return t[1];
                }var o = (t(1), t("ee").create()),
                    i = t(2)(o),
                    a = t("gos");if ((e.exports = o, n(window), "getPrototypeOf" in Object)) {
                    for (var s = document; s && !s.hasOwnProperty("addEventListener");) s = Object.getPrototypeOf(s);s && n(s);for (var c = XMLHttpRequest.prototype; c && !c.hasOwnProperty("addEventListener");) c = Object.getPrototypeOf(c);c && n(c);
                } else XMLHttpRequest.prototype.hasOwnProperty("addEventListener") && n(XMLHttpRequest.prototype);o.on("addEventListener-start", function (t) {
                    if (t[1]) {
                        var e = t[1];"function" == typeof e ? this.wrapped = t[1] = a(e, "nr@wrapped", function () {
                            return i(e, "fn-", null, e.name || "anonymous");
                        }) : "function" == typeof e.handleEvent && i.inPlace(e, ["handleEvent"], "fn-");
                    }
                }), o.on("removeEventListener-start", function (t) {
                    var e = this.wrapped;e && (t[1] = e);
                });
            }, { 1: 21, 2: 22, ee: "QJf3ax", gos: "7eSDFh" }], 6: [function (t, e) {
                var n = (t(2), t("ee").create()),
                    r = t(1)(n);e.exports = n, r.inPlace(window.history, ["pushState"], "-");
            }, { 1: 22, 2: 21, ee: "QJf3ax" }], 7: [function (t, e) {
                var n = (t(2), t("ee").create()),
                    r = t(1)(n);e.exports = n, r.inPlace(window, ["requestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame", "msRequestAnimationFrame"], "raf-"), n.on("raf-start", function (t) {
                    t[0] = r(t[0], "fn-");
                });
            }, { 1: 22, 2: 21, ee: "QJf3ax" }], 8: [function (t, e) {
                function n(t, e, n) {
                    var r = t[0];"string" == typeof r && (r = new Function(r)), t[0] = o(r, "fn-", null, n);
                }var r = (t(2), t("ee").create()),
                    o = t(1)(r);e.exports = r, o.inPlace(window, ["setTimeout", "setInterval", "setImmediate"], "setTimer-"), r.on("setTimer-start", n);
            }, { 1: 22, 2: 21, ee: "QJf3ax" }], 9: [function (t, e) {
                function n() {
                    c.inPlace(this, d, "fn-");
                }function r(t, e) {
                    c.inPlace(e, ["onreadystatechange"], "fn-");
                }function o(t, e) {
                    return e;
                }var i = t("ee").create(),
                    a = t(1),
                    s = t(2),
                    c = s(i),
                    f = s(a),
                    u = window.XMLHttpRequest,
                    d = ["onload", "onerror", "onabort", "onloadstart", "onloadend", "onprogress", "ontimeout"];e.exports = i, window.XMLHttpRequest = function (t) {
                    var e = new u(t);try {
                        i.emit("new-xhr", [], e), f.inPlace(e, ["addEventListener", "removeEventListener"], "-", function (t, e) {
                            return e;
                        }), e.addEventListener("readystatechange", n, !1);
                    } catch (r) {
                        try {
                            i.emit("internal-error", [r]);
                        } catch (o) {}
                    }return e;
                }, window.XMLHttpRequest.prototype = u.prototype, c.inPlace(XMLHttpRequest.prototype, ["open", "send"], "-xhr-", o), i.on("send-xhr-start", r), i.on("open-xhr-start", r);
            }, { 1: 5, 2: 22, ee: "QJf3ax" }], 10: [function (t) {
                function e(t) {
                    if ("string" == typeof t && t.length) return t.length;if ("object" != typeof t) return void 0;if ("undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer && t.byteLength) return t.byteLength;if ("undefined" != typeof Blob && t instanceof Blob && t.size) return t.size;if ("undefined" != typeof FormData && t instanceof FormData) return void 0;try {
                        return JSON.stringify(t).length;
                    } catch (e) {
                        return void 0;
                    }
                }function n(t) {
                    var n = this.params,
                        r = this.metrics;if (!this.ended) {
                        this.ended = !0;for (var i = 0; c > i; i++) t.removeEventListener(s[i], this.listener, !1);if (!n.aborted) {
                            if ((r.duration = new Date().getTime() - this.startTime, 4 === t.readyState)) {
                                n.status = t.status;var a = t.responseType,
                                    f = "arraybuffer" === a || "blob" === a || "json" === a ? t.response : t.responseText,
                                    u = e(f);if ((u && (r.rxSize = u), this.sameOrigin)) {
                                    var d = t.getResponseHeader("X-NewRelic-App-Data");d && (n.cat = d.split(", ").pop());
                                }
                            } else n.status = 0;r.cbTime = this.cbTime, o("xhr", [n, r, this.startTime]);
                        }
                    }
                }function r(t, e) {
                    var n = i(e),
                        r = t.params;r.host = n.hostname + ":" + n.port, r.pathname = n.pathname, t.sameOrigin = n.sameOrigin;
                }if (window.XMLHttpRequest && XMLHttpRequest.prototype && XMLHttpRequest.prototype.addEventListener && !/CriOS/.test(navigator.userAgent)) {
                    t("loader").features.xhr = !0;var o = t("handle"),
                        i = t(2),
                        a = t("ee"),
                        s = ["load", "error", "abort", "timeout"],
                        c = s.length,
                        f = t(1);t(4), t(3), a.on("new-xhr", function () {
                        this.totalCbs = 0, this.called = 0, this.cbTime = 0, this.end = n, this.ended = !1, this.xhrGuids = {};
                    }), a.on("open-xhr-start", function (t) {
                        this.params = { method: t[0] }, r(this, t[1]), this.metrics = {};
                    }), a.on("open-xhr-end", function (t, e) {
                        "loader_config" in NREUM && "xpid" in NREUM.loader_config && this.sameOrigin && e.setRequestHeader("X-NewRelic-ID", NREUM.loader_config.xpid);
                    }), a.on("send-xhr-start", function (t, n) {
                        var r = this.metrics,
                            o = t[0],
                            i = this;if (r && o) {
                            var f = e(o);f && (r.txSize = f);
                        }this.startTime = new Date().getTime(), this.listener = function (t) {
                            try {
                                "abort" === t.type && (i.params.aborted = !0), ("load" !== t.type || i.called === i.totalCbs && (i.onloadCalled || "function" != typeof n.onload)) && i.end(n);
                            } catch (e) {
                                try {
                                    a.emit("internal-error", [e]);
                                } catch (r) {}
                            }
                        };for (var u = 0; c > u; u++) n.addEventListener(s[u], this.listener, !1);
                    }), a.on("xhr-cb-time", function (t, e, n) {
                        this.cbTime += t, e ? this.onloadCalled = !0 : this.called += 1, this.called !== this.totalCbs || !this.onloadCalled && "function" == typeof n.onload || this.end(n);
                    }), a.on("xhr-load-added", function (t, e) {
                        var n = "" + f(t) + !!e;this.xhrGuids && !this.xhrGuids[n] && (this.xhrGuids[n] = !0, this.totalCbs += 1);
                    }), a.on("xhr-load-removed", function (t, e) {
                        var n = "" + f(t) + !!e;this.xhrGuids && this.xhrGuids[n] && (delete this.xhrGuids[n], this.totalCbs -= 1);
                    }), a.on("addEventListener-end", function (t, e) {
                        e instanceof XMLHttpRequest && "load" === t[0] && a.emit("xhr-load-added", [t[1], t[2]], e);
                    }), a.on("removeEventListener-end", function (t, e) {
                        e instanceof XMLHttpRequest && "load" === t[0] && a.emit("xhr-load-removed", [t[1], t[2]], e);
                    }), a.on("fn-start", function (t, e, n) {
                        e instanceof XMLHttpRequest && ("onload" === n && (this.onload = !0), ("load" === (t[0] && t[0].type) || this.onload) && (this.xhrCbStart = new Date().getTime()));
                    }), a.on("fn-end", function (t, e) {
                        this.xhrCbStart && a.emit("xhr-cb-time", [new Date().getTime() - this.xhrCbStart, this.onload, e], e);
                    });
                }
            }, { 1: "XL7HBI", 2: 11, 3: 9, 4: 5, ee: "QJf3ax", handle: "D5DuLP", loader: "G9z0Bl" }], 11: [function (t, e) {
                e.exports = function (t) {
                    var e = document.createElement("a"),
                        n = window.location,
                        r = {};e.href = t, r.port = e.port;var o = e.href.split("://");return (!r.port && o[1] && (r.port = o[1].split("/")[0].split("@").pop().split(":")[1]), r.port && "0" !== r.port || (r.port = "https" === o[0] ? "443" : "80"), r.hostname = e.hostname || n.hostname, r.pathname = e.pathname, r.protocol = o[0], "/" !== r.pathname.charAt(0) && (r.pathname = "/" + r.pathname), r.sameOrigin = !e.hostname || e.hostname === document.domain && e.port === n.port && e.protocol === n.protocol, r);
                };
            }, {}], gos: [function (t, e) {
                e.exports = t("7eSDFh");
            }, {}], "7eSDFh": [function (t, e) {
                function n(t, e, n) {
                    if (r.call(t, e)) return t[e];var o = n();if (Object.defineProperty && Object.keys) try {
                        return (Object.defineProperty(t, e, { value: o, writable: !0, enumerable: !1 }), o);
                    } catch (i) {}return (t[e] = o, o);
                }var r = Object.prototype.hasOwnProperty;e.exports = n;
            }, {}], D5DuLP: [function (t, e) {
                function n(t, e, n) {
                    return r.listeners(t).length ? r.emit(t, e, n) : (o[t] || (o[t] = []), void o[t].push(e));
                }var r = t("ee").create(),
                    o = {};e.exports = n, n.ee = r, r.q = o;
            }, { ee: "QJf3ax" }], handle: [function (t, e) {
                e.exports = t("D5DuLP");
            }, {}], XL7HBI: [function (t, e) {
                function n(t) {
                    var e = typeof t;return !t || "object" !== e && "function" !== e ? -1 : t === window ? 0 : i(t, o, function () {
                        return r++;
                    });
                }var r = 1,
                    o = "nr@id",
                    i = t("gos");e.exports = n;
            }, { gos: "7eSDFh" }], id: [function (t, e) {
                e.exports = t("XL7HBI");
            }, {}], loader: [function (t, e) {
                e.exports = t("G9z0Bl");
            }, {}], G9z0Bl: [function (t, e) {
                function n() {
                    var t = l.info = NREUM.info;if (t && t.licenseKey && t.applicationID && f && f.body) {
                        s(h, function (e, n) {
                            e in t || (t[e] = n);
                        }), l.proto = "https" === p.split(":")[0] || t.sslForHttp ? "https://" : "http://", a("mark", ["onload", i()]);var e = f.createElement("script");e.src = l.proto + t.agent, f.body.appendChild(e);
                    }
                }function r() {
                    "complete" === f.readyState && o();
                }function o() {
                    a("mark", ["domContent", i()]);
                }function i() {
                    return new Date().getTime();
                }var a = t("handle"),
                    s = t(1),
                    c = window,
                    f = c.document,
                    u = "addEventListener",
                    d = "attachEvent",
                    p = ("" + location).split("?")[0],
                    h = { beacon: "bam.nr-data.net", errorBeacon: "bam.nr-data.net", agent: "js-agent.newrelic.com/nr-515.min.js" },
                    l = e.exports = { offset: i(), origin: p, features: {} };f[u] ? (f[u]("DOMContentLoaded", o, !1), c[u]("load", n, !1)) : (f[d]("onreadystatechange", r), c[d]("onload", n)), a("mark", ["firstbyte", i()]);
            }, { 1: 20, handle: "D5DuLP" }], 20: [function (t, e) {
                function n(t, e) {
                    var n = [],
                        o = "",
                        i = 0;for (o in t) r.call(t, o) && (n[i] = e(o, t[o]), i += 1);return n;
                }var r = Object.prototype.hasOwnProperty;e.exports = n;
            }, {}], 21: [function (t, e) {
                function n(t, e, n) {
                    e || (e = 0), "undefined" == typeof n && (n = t ? t.length : 0);for (var r = -1, o = n - e || 0, i = Array(0 > o ? 0 : o); ++r < o;) i[r] = t[e + r];return i;
                }e.exports = n;
            }, {}], 22: [function (t, e) {
                function n(t) {
                    return !(t && "function" == typeof t && t.apply && !t[i]);
                }var r = t("ee"),
                    o = t(1),
                    i = "nr@wrapper",
                    a = Object.prototype.hasOwnProperty;e.exports = function (t) {
                    function e(t, e, r, a) {
                        function nrWrapper() {
                            var n, i, s, f;try {
                                i = this, n = o(arguments), s = r && r(n, i) || {};
                            } catch (d) {
                                u([d, "", [n, i, a], s]);
                            }c(e + "start", [n, i, a], s);try {
                                return f = t.apply(i, n);
                            } catch (p) {
                                throw (c(e + "err", [n, i, p], s), p);
                            } finally {
                                c(e + "end", [n, i, f], s);
                            }
                        }return n(t) ? t : (e || (e = ""), nrWrapper[i] = !0, f(t, nrWrapper), nrWrapper);
                    }function s(t, r, o, i) {
                        o || (o = "");var a,
                            s,
                            c,
                            f = "-" === o.charAt(0);for (c = 0; c < r.length; c++) s = r[c], a = t[s], n(a) || (t[s] = e(a, f ? s + o : o, i, s, t));
                    }function c(e, n, r) {
                        try {
                            t.emit(e, n, r);
                        } catch (o) {
                            u([o, e, n, r]);
                        }
                    }function f(t, e) {
                        if (Object.defineProperty && Object.keys) try {
                            var n = Object.keys(t);return (n.forEach(function (n) {
                                Object.defineProperty(e, n, { get: function get() {
                                        return t[n];
                                    }, set: function set(e) {
                                        return (t[n] = e, e);
                                    } });
                            }), e);
                        } catch (r) {
                            u([r]);
                        }for (var o in t) a.call(t, o) && (e[o] = t[o]);return e;
                    }function u(e) {
                        try {
                            t.emit("internal-error", e);
                        } catch (n) {}
                    }return (t || (t = r), e.inPlace = s, e.flag = i, e);
                };
            }, { 1: 21, ee: "QJf3ax" }] }, {}, ["G9z0Bl", 3, 10, 4]));
        ;NREUM.info = { beacon: "bam.nr-data.net", errorBeacon: "bam.nr-data.net", licenseKey: licenseKey, applicationID: appId, sa: 1, agent: "js-agent.newrelic.com/nr-515.min.js" };
    }
};

module.exports = newRelic;

},{}],24:[function(require,module,exports){
'use strict';

var rayGun = function rayGun(config) {
    var apiKey;
    if (config == null) {
        config = {};
    }
    apiKey = config.RAYGUN_API_KEY;
    if (apiKey && window.location.hostname !== 'localhost') {
        if (Raygun != null) {
            Raygun.init(apiKey, {
                ignore3rdPartyErrors: true
            }).attach();
        }
        return Raygun != null ? Raygun.filterSensitiveData(['password']) : void 0;
    }
};

module.exports = rayGun;

},{}],25:[function(require,module,exports){
'use strict';

var userSnap = function userSnap(config) {
    var apiKey = '032baf87-8545-4ebc-a557-934859371fa5.js',
        s,
        x;
    if (config == null) {
        config = {};
    }
    apiKey = config.USER_SNAP_API_KEY;
    if (apiKey && window.location.hostname !== 'localhost') {
        window.usersnapconfig = {
            mode: 'report',
            shortcut: true,
            beforeOpen: function beforeOpen(obj) {
                return UserSnap.setEmailBox(Doc.app.user.userName);
            }
        };
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//api.usersnap.com/load/' + apiKey + '.js';
        x = document.getElementsByTagName('head')[0];
        return x.appendChild(s);
    }
};

module.exports = userSnap;

},{}],26:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;

var Analytics = (function () {
    function Analytics(editor, map) {
        _classCallCheck(this, Analytics);

        this._editor = editor;
        this._map = map;

        // this gets populated by this._map.loadMapExtraData, on load and after every autosave
        this.mapAnalytics = null;

        // --------- contextual analytics --------------
        // - these are all calculated here, unlike map analytics which are calculated on the server and connected with badges and points

        // this gets calculated by updateContextualAnalytics
        this.contextualAnalytics = {
            thingName: '',

            // thing stuff
            distinctFrom: 0,
            intentionallyDistinctFrom: 0,
            partOf: 0,
            includesParts: 0,
            relatedTo: 0,
            isRelationship: 0,
            lookingAt: 0,
            lookedAtFrom: 0,

            // R stuff
            rFromThingName: '',
            rToThingName: '',
            isRThing: false,
            isRSystem: false,
            isRPoint: false,
            isRView: false
        };
    }

    _createClass(Analytics, [{
        key: 'handleDiagramEvent',
        value: function handleDiagramEvent(eventName, e) {
            if (eventName === 'ChangedSelection') {
                if (this._map.ui.currentTabIs(this._map.ui.TAB_ID_ANALYTICS_THING)) {
                    this.updateContextualAnalytics();
                }
            }
        }
    }, {
        key: 'currentTabChanged',

        // called when a tab is opened or closed
        value: function currentTabChanged(newValue, oldValue) {
            if (newValue === this._map.ui.TAB_ID_ANALYTICS_THING) {
                // opening thing analytics tab
                this.updateContextualAnalytics();
            }
        }
    }, {
        key: 'updateContextualAnalytics',
        value: function updateContextualAnalytics() {
            //console.log('updateContextualAnalytics');
            if (!this._map.ui.currentTabIs(this._map.ui.TAB_ID_ANALYTICS_THING)) {
                return;
            }

            var diagram = this._map.getDiagram();
            var part = diagram.selection.first();
            var a = this.contextualAnalytics;

            if (part && part instanceof go.Group) {
                var thing = part;

                // thing name
                a.thingName = thing.data.text;

                // distinct from
                a.distinctFrom = _.where(diagram.model.nodeDataArray, { isGroup: true }).length - 1;

                // part of
                var level = 0;
                var thing2 = thing;
                while (thing2 = this.getContainingGroup(thing2)) {
                    level++;
                }
                a.partOf = level;

                // includes parts
                a.includesParts = this.countGroups(thing);

                // related to / looking at / looked at from / intentionally distinct from
                a.relatedTo = 0;
                a.lookingAt = 0;
                a.lookedAtFrom = 0;
                a.intentionallyDistinctFrom = 0;
                var links = thing.linksConnected;
                var rConnectedThingKeys = [];
                while (links.next()) {
                    var link = links.value;
                    // P link
                    if (link.data.category === 'P') {
                        if (link.fromNode === thing) {
                            a.lookingAt++;
                        } else if (link.toNode === thing) {
                            a.lookedAtFrom++;
                        }
                    }
                    // D link
                    else if (link.data.category === 'D') {
                        a.intentionallyDistinctFrom++;
                    }
                    // R link
                    else if (!link.data.category) {
                        // track keys of related things so we don't count them multiple times
                        if (link.fromNode === thing) {
                            rConnectedThingKeys.push(link.toNode.data.key);
                        } else if (link.toNode === thing) {
                            rConnectedThingKeys.push(link.fromNode.data.key);
                        }
                    }
                }
                a.relatedTo = _.uniq(rConnectedThingKeys).length;

                // isRelationship
                a.isRelationship = thing.isLinkLabel;
            } else if (part && part instanceof go.Link) {
                var rel = part;

                // thing names
                a.rFromThingName = rel.fromNode.data.text;
                a.rToThingName = rel.toNode.data.text;

                // is R thing
                a.isRThing = rel.isLabeledLink;

                // is R system
                a.isRSystem = rel.isLabeledLink && this.countGroups(rel.labelNodes.first()) > 0;

                // is R point
                a.isRPoint = rel.isLabeledLink && this.isPoint(rel.labelNodes.first());

                // is R view
                a.isRView = rel.isLabeledLink && this.isView(rel.labelNodes.first());
            }
        }
    }, {
        key: 'getContainingGroup',

        // returns either the containingGroup or the rThingContainingGroup, whichever is non-null
        value: function getContainingGroup(group) {
            return group.containingGroup || this.getRThingContainingGroup(group);
        }
    }, {
        key: 'getRThingContainingGroup',

        // if group is an R-thing between two sibling parts of a whole, returns the whole; else returns null
        value: function getRThingContainingGroup(group) {
            if (group.isLinkLabel) {
                var fromParent = group.labeledLink.fromNode.containingGroup;
                var toParent = group.labeledLink.toNode.containingGroup;
                if (fromParent !== null && toParent !== null && fromParent === toParent) {
                    return fromParent;
                }
            }
            return null;
        }
    }, {
        key: 'countGroups',

        // counts the member parts of the group that are groups, recursively (not including the group itself)
        value: function countGroups(group) {
            var count = 0;
            var it = this.getMemberGroups(group).iterator;
            while (it.next()) {
                var part = it.value;
                count += 1 + this.countGroups(part);
            }

            return count;
        }
    }, {
        key: 'getMemberGroups',

        // returns the collection of groups that are either a memberPart of this group, or an R-thing between sibling memberParts
        value: function getMemberGroups(group) {
            var members = new go.List();
            var it = group.memberParts;
            while (it.next()) {
                var part = it.value;
                if (part instanceof go.Group) {
                    members.add(part);
                    var rthing = this.getRThingToSibling(part); // NB: should not get duplication here, as this checks for r-things in only one direction
                    if (rthing) {
                        members.add(rthing);
                    }
                }
            }
            return members;
        }
    }, {
        key: 'getRThingToSibling',

        // if the group is linked by an R-thing to a sibling (with the group as the fromNode), returns the R-thing; else returns null
        value: function getRThingToSibling(group) {
            var it = group.findLinksOutOf();
            while (it.next()) {
                var link = it.value;
                if (link.labelNodes.count > 0 && link.toNode.containingGroup === group.containingGroup) {
                    return link.labelNodes.first();
                }
            }
            return null;
        }
    }, {
        key: 'isPoint',
        value: function isPoint(group) {
            var it = group.findLinksOutOf();
            while (it.next()) {
                var link = it.value;
                if (link.data.category === 'P') {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'isView',
        value: function isView(group) {
            var it = group.findLinksInto();
            while (it.next()) {
                var link = it.value;
                if (link.data.category === 'P') {
                    return true;
                }
            }
            return false;
        }
    }]);

    return Analytics;
})();

module.exports = Analytics;

},{}],27:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Attachments = (function () {
    function Attachments(editor, map) {
        _classCallCheck(this, Attachments);

        this._editor = editor;
        this._map = map;

        this.selectedThing = null;
        this.attachments = null;

        this.attachmentTypes = [{ name: 'note', labelSingular: 'Note', labelPlural: 'Notes' }, { name: 'link', labelSingular: 'Web Link', labelPlural: 'Web Links' }, { name: 'task', labelSingular: 'Task', labelPlural: 'Tasks' }, { name: 'map', labelSingular: 'Linked MetaMap', labelPlural: 'Linked MetaMaps' }
        //{name: 'doc', labelSingular: 'Document', labelPlural: 'Documents'}  // limit overall storage space OR simpler rules?
        // limit file types - pdf, jpg, gif, png, office?...  whitelist vs. blacklist
        ];
    }

    _createClass(Attachments, [{
        key: 'handleDiagramEvent',
        value: function handleDiagramEvent(eventName, e) {
            if (eventName === 'ChangedSelection') {
                if (this._map.ui.currentTabIs(this._map.ui.TAB_ID_ATTACHMENTS)) {
                    this.stopEditingAll();
                    this.saveAttachments();
                    this.loadSelectedThingAttachments();
                }
            }
        }
    }, {
        key: 'currentTabChanged',

        // called when a tab is opened or closed
        value: function currentTabChanged(newValue, oldValue) {
            if (newValue === this._map.ui.TAB_ID_ATTACHMENTS) {
                // opening tab
                this.loadSelectedThingAttachments();
            }
            if (oldValue === this._map.ui.TAB_ID_ATTACHMENTS) {
                // closing tab
                this.saveAttachments();
            }
        }
    }, {
        key: 'loadSelectedThingAttachments',
        value: function loadSelectedThingAttachments() {
            if (this._map.thingSelected()) {
                this.selectedThing = this._map.getUniqueThingSelected();
                this.attachments = this.selectedThing.data.attachments;
                if (this.attachments === undefined) {
                    this.attachments = [];
                }
            }
        }
    }, {
        key: 'stopEditingAll',

        // set all attachments to editing = false
        value: function stopEditingAll() {
            if (this.attachments) {
                _.each(this.attachments, function (att) {
                    att.editing = false;
                });
            }
        }
    }, {
        key: 'editingAnItem',
        value: function editingAnItem() {
            return this.attachments && _.findWhere(this.attachments, { editing: true }) !== undefined;
        }
    }, {
        key: 'startEditing',

        // set all other attachments to editing = false
        value: function startEditing(attachment) {
            this.stopEditingAll();
            attachment.editing = true;
        }
    }, {
        key: 'saveItem',
        value: function saveItem(attachment) {
            attachment.editing = false;
            this.saveAttachments();
        }
    }, {
        key: 'saveAttachments',
        value: function saveAttachments() {
            console.log('saveAttachments, selected: ' + this.selectedThing);
            if (this.selectedThing) {
                this._map.getDiagram().model.setDataProperty(this.selectedThing.data, 'attachments', this.attachments);
                this.selectedThing.updateTargetBindings();
            }
            this._map.autosave.saveNow('edit_attachments');
        }
    }, {
        key: 'listAttachments',
        value: function listAttachments(type) {
            var atts = _.where(this.attachments, { type: type });
            return atts;
        }
    }, {
        key: 'addAttachment',
        value: function addAttachment(type) {
            var item = { type: type, editing: true };
            if (type === 'note') {
                this.attachments.push(_.extend(item, { text: '', url: '' }));
            } else if (type === 'link') {
                this.attachments.push(_.extend(item, { label: '', url: '' }));
            } else if (type === 'task') {
                this.attachments.push(_.extend(item, { text: '' }));
            } else if (type === 'doc') {
                this.attachments.push(_.extend(item, { name: '' }));
            } else if (type === 'map') {
                this.attachments.push(_.extend(item, { mapRef: { id: 0, name: '' } }));
            }
        }
    }, {
        key: 'isValid',
        value: function isValid(attachment) {
            if (attachment.type === 'link') {
                return attachment.label && attachment.url && attachment.label.trim() !== '' && attachment.url.trim() !== '';
            } else if (attachment.type === 'note') {
                return attachment.text && attachment.text.trim() !== '';
            } else if (attachment.type === 'task') {
                return attachment.text && attachment.text.trim() !== '';
            } else if (attachment.type === 'doc') {
                return attachment.name && attachment.name.trim() !== '';
            } else if (attachment.type === 'map') {
                return attachment.mapRef && attachment.mapRef.id !== null && attachment.mapRef.id !== undefined;
            }
        }
    }, {
        key: 'deleteAttachment',
        value: function deleteAttachment(att) {
            var typeLabel = _.findWhere(this.attachmentTypes, { name: att.type }).labelSingular;
            if (confirm('Delete ' + typeLabel + '?')) {
                var i = _.indexOf(this.attachments, att);
                this.attachments.splice(i, 1);
            }
        }
    }, {
        key: 'getOtherMaps',

        // query server for maps containing the given text in the map name
        value: function getOtherMaps(viewValue) {
            // NB: this URL is constructed to match the one generated by the search form on the maps page...
            var url = '/maps/visible_maps.json?utf8=%E2%9C%93&q%5Bname_cont%5D=' + viewValue;
            return $http.get(url).then(function (response) {
                return response.data.maps;
            });
        }
    }, {
        key: 'otherMapSelected',
        value: function otherMapSelected(viewValue, modelValue) {
            console.log('otherMapSelected, viewValue: ' + viewValue.id + ', modelValue: ' + modelValue);
        }
    }, {
        key: 'formatOtherMap',
        value: function formatOtherMap(model) {
            return model ? model.name : '';
        }
    }]);

    return Attachments;
})();

module.exports = Attachments;

},{}],28:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Analytics = require('./Analytics.js');
var Attachments = require('./Attachments.js');
var Autosave = require('./autosave.js');
var EditorOptions = require('./EditorOptions.js');
var Generator = require('./generator.js');
var Layouts = require('./Layouts.js');
var Perspectives = require('./Perspectives.js');
var Presenter = require('./Presenter.js');
var Templates = require('./Templates.js');
var UI = require('./UI.js');

var EditorConfig = function EditorConfig(editor, map) {
    _classCallCheck(this, EditorConfig);

    this.editor = editor;
    this.map = map;
    this.analytics = new Analytics(editor, map);
    this.attachments = new Attachments(editor, map);
    this.autosave = new Autosave(editor, map);
    this.editorOptions = new EditorOptions({}, map);
    this.generator = new Generator(editor, map);
    this.layouts = new Layouts(editor, map);
    this.perspectives = new Perspectives(editor, map);
    this.presenter = new Presenter(editor, map);
    //this.standards = new SandbankEditor.Standards(editor, map);
    this.templates = new Templates(editor, map);
    //this.tests = new SandbankEditor.Tests(editor, map);
    this.ui = new UI(editor, map);
};

module.exports = EditorConfig;

},{"./Analytics.js":26,"./Attachments.js":27,"./EditorOptions.js":29,"./Layouts.js":30,"./Perspectives.js":32,"./Presenter.js":33,"./Templates.js":34,"./UI.js":35,"./autosave.js":36,"./generator.js":38}],29:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EditorOptions = (function () {
    function EditorOptions(user, map) {
        _classCallCheck(this, EditorOptions);

        this.user = user;
        this.map = map;
        this.defaultEditorOptions = {
            // noArrows, to, from, toFrom
            defaultRelationshipDirection: 'noArrows',
            // left, right, stacked, freehand
            defaultThingLayout: 'left',
            // lines, spotlight, both
            perspectiveMode: 'lines'
        };
    }

    _createClass(EditorOptions, [{
        key: 'setMapEditorOptions',

        // called when map is loaded to set stored options for map
        value: function setMapEditorOptions(options) {
            this.mapEditorOptions = options;
        }
    }, {
        key: 'getMapEditorOptions',

        // returns appropriate values from the user profile or the default options if options are not set for the map
        value: function getMapEditorOptions() {
            var profileOptions = this.user.profile ? this.user.profile.editorOptions : null;
            var vals = [this.mapEditorOptions, profileOptions, this.defaultEditorOptions];
            this.mapEditorOptions = _.find(vals, function (val) {
                return !_.isEmpty(val);
            });
            return this.mapEditorOptions;
        }
    }, {
        key: 'editOptions',
        value: function editOptions() {
            var _this = this;

            this.openModal(this.mapEditorOptions, function (options) {
                // onSaveDefaults
                _this.user.saveUserEditorOptions(options);
            }, function (options) {
                // onUpdate
                _this.mapEditorOptions = options;
                _this.map.autosave.saveNow('edit_options');
            });
        }
    }, {
        key: 'openModal',
        value: function openModal(_options, _onSaveDefaults, _onUpdate) {
            var that = this;
            var modalInstance = $modal.open({
                templateUrl: 'template_editor_options_modal.html', // see views/maps/_template_editor_options_modal
                backdrop: 'static',
                controller: that.optionsModalCtrl,
                windowClass: 'options-modal',
                resolve: {
                    options: function options() {
                        return _options;
                    },
                    onSaveDefaults: function onSaveDefaults() {
                        return _onSaveDefaults;
                    },
                    onUpdate: function onUpdate() {
                        return _onUpdate;
                    }
                }
            });

            modalInstance.result.then(function () {});
        }
    }, {
        key: 'optionsModalCtrl',

        // --------------- controller for options modal ---------------------
        value: function optionsModalCtrl($scope, $modalInstance, options, onSaveDefaults, onUpdate) {

            $scope.options = options;

            $scope.setDefaults = {
                value: false
            };

            $scope.ok = function () {
                onUpdate($scope.options);
                if ($scope.setDefaults.value) {
                    onSaveDefaults($scope.options);
                }
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    }]);

    return EditorOptions;
})();

module.exports = EditorOptions;

},{}],30:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;

// layouts used in the editor, for the diagram or individual Groups, plus layout-related functions

var Layouts = (function () {
    function Layouts(editor, map) {
        _classCallCheck(this, Layouts);

        this._editor = editor;
        this._map = map;
        go.Layout.call(this);
    }

    _createClass(Layouts, [{
        key: 'handleDiagramEvent',
        value: function handleDiagramEvent(eventName, e) {
            var diagram = this._map.getDiagram();
            if (eventName === 'InitialLayoutCompleted') {
                diagram.updateAllTargetBindings();
                diagram.layoutDiagram(true);
            } else if (eventName === 'SelectionMoved') {
                this.updateSelectedPartLocationData(e);
                this._map.getDiagram().layoutDiagram(true);
            } else if (eventName === 'SelectionDeleted') {
                diagram.updateAllTargetBindings();
            } else if (eventName === 'PartCreated') {} else if (eventName === 'PartResized') {
                this.setResizedPartDimensionData(e);
            } else if (eventName === 'LinkDrawn') {
                this.adjustLinkLayout(e.subject);
            } else if (eventName === 'LinkRelinked') {
                this.adjustLinkLayout(e.subject);
            }
        }
    }, {
        key: 'setResizedPartDimensionData',

        // ------------ handle location/size attributes for nodes ---------------

        // only update w/h for slides, as all other node types have fixed dimensions according to the templates
        value: function setResizedPartDimensionData(e) {
            var diagram = this._map.getDiagram();
            var node = e.subject;
            if (node && node.category === 'slide') {
                //console.log('PartResized: ' + node.part.actualBounds);
                diagram.model.setDataProperty(node.data, 'width', node.part.actualBounds.width);
                diagram.model.setDataProperty(node.data, 'height', node.part.actualBounds.height);
            }
        }
    }, {
        key: 'setNewPartLocationData',

        // set the 'loc' attribute for a new top-level node (created by double-clicking), to support freehand layout
        value: function setNewPartLocationData(e) {
            var node = e.subject;
            if (node && node.part) {
                if (node instanceof go.Group) {
                    this._map.getDiagram().model.setDataProperty(node.data, 'loc', node.part.location.x + ' ' + node.part.location.y);
                }
            }
        }
    }, {
        key: 'updateSelectedPartLocationData',

        // updates the 'loc' attribute for each selected part, to support freehand layout (does not apply to slides)
        value: function updateSelectedPartLocationData(e) {
            var diagram = this._map.getDiagram();
            var it = diagram.selection.iterator;
            while (it.next()) {
                if (it.value instanceof go.Group) {
                    // thing
                    var part = it.value;
                    var parentX = 0;
                    var parentY = 0;
                    if (part.containingGroup) {
                        parentX = part.containingGroup.location.x;
                        parentY = part.containingGroup.location.y;
                    }
                    console.log('moving group, subject: ' + e.subject + ', part: ' + part + ', height: ' + part.part.desiredSize.height + ', location: ' + part.part.location);
                    if (!isNaN(part.location.x)) {
                        diagram.model.setDataProperty(part.data, 'loc', part.location.x - parentX + ' ' + (part.location.y - parentY));
                    }
                }
            }
        }
    }, {
        key: 'fromAndToNodesAreVisible',

        // ----------- changing layouts of things and their descendants ----------------

        value: function fromAndToNodesAreVisible(link) {
            return link.fromNode && link.toNode && !this.hasCollapsedAncestor(link.fromNode) && !this.hasCollapsedAncestor(link.toNode);
        }
    }, {
        key: 'labelNodeIsVisible',
        value: function labelNodeIsVisible(link) {
            return link.labelNodes.count && link.labelNodes.first().visible;
        }
    }, {
        key: 'hasCollapsedAncestor',
        value: function hasCollapsedAncestor(group) {
            while (true) {
                if (!group.containingGroup) {
                    return false;
                } else if (!group.containingGroup.isSubGraphExpanded) {
                    return true;
                } else {
                    group = group.containingGroup;
                }
            }
        }
    }, {
        key: 'getHighestAncestorWithLayout',
        value: function getHighestAncestorWithLayout(group, layoutNames) {
            while (true) {
                if (!group.containingGroup) {
                    return false;
                } else if (_.contains(layoutNames, group.containingGroup.data.layout)) {
                    return group.containingGroup;
                } else {
                    group = group.containingGroup;
                }
            }
        }
    }, {
        key: 'areSistersInInventoryLayout',
        value: function areSistersInInventoryLayout(group1, group2) {
            return group1.containingGroup === group2.containingGroup && group1.containingGroup && _.contains(['left', 'right'], group1.containingGroup.data.layout);
        }
    }, {
        key: 'isNotWithinInventoryLayout',
        value: function isNotWithinInventoryLayout(group) {
            return !this.isWithinInventoryLayout(group);
        }
    }, {
        key: 'isRThingWithinInventoryLayout',
        value: function isRThingWithinInventoryLayout(group) {
            return group.isLinkLabel && this.isWithinInventoryLayout(group);
        }
    }, {
        key: 'isWithinInventoryLayout',
        value: function isWithinInventoryLayout(group) {
            return this.isWithinLayout(group, ['left', 'right']);
        }
    }, {
        key: 'isWithinLeftInventoryLayout',
        value: function isWithinLeftInventoryLayout(group) {
            return this.isWithinLayout(group, ['left']);
        }
    }, {
        key: 'isWithinRightInventoryLayout',
        value: function isWithinRightInventoryLayout(group) {
            return this.isWithinLayout(group, ['right']);
        }
    }, {
        key: 'isWithinFreehandLayout',
        value: function isWithinFreehandLayout(group) {
            return this.isWithinLayout(group, ['freehand']);
        }
    }, {
        key: 'isWithinStackedLayout',
        value: function isWithinStackedLayout(group) {
            return this.isWithinLayout(group, ['stacked']);
        }
    }, {
        key: 'isWithinLayout',
        value: function isWithinLayout(group, layoutNames) {
            while (true) {
                if (!group.containingGroup) {
                    //console.log('isWithinLayout: ' + group + 'layouts: ' + layoutNames.join() + ': false');
                    return false;
                } else if (_.contains(layoutNames, group.containingGroup.data.layout)) {
                    //console.log('isWithinLayout: ' + group + 'layouts: ' + layoutNames.join() + ': true');
                    return true;
                } else {
                    group = group.containingGroup;
                }
            }
        }
    }, {
        key: 'showLeftTextBlock',
        value: function showLeftTextBlock(group) {
            return this.isWithinRightInventoryLayout(group) && !this.isWithinStackedLayout(group) && !group.isLinkLabel;
        }
    }, {
        key: 'showRightTextBlock',
        value: function showRightTextBlock(group) {
            return this.isWithinLeftInventoryLayout(group) && !this.isWithinStackedLayout(group) && !group.isLinkLabel;
        }
    }, {
        key: 'setDescendantLayouts',
        value: function setDescendantLayouts(group, layoutName) {
            if (layoutName === 'left' || layoutName === 'right' || layoutName === 'stacked') {
                var it = group.memberParts.iterator;
                while (it.next()) {
                    var part = it.value;
                    if (part instanceof go.Group && !part.isLinkLabel) {
                        part.data.layout = layoutName;
                        this.setDescendantLayouts(part, layoutName);
                    }
                }
            } else if (layoutName === 'freehand') {}
        }
    }, {
        key: 'disableLayoutForSelectedThings',
        value: function disableLayoutForSelectedThings(layoutName) {
            var it = this._map.getDiagram().selection.iterator;
            if (!it.count) {
                return true;
            }
            while (it.next()) {
                if (!(it.value instanceof go.Group)) {
                    return true;
                } else {
                    var group = it.value;
                    if (this.isWithinLayout(group, ['left', 'right', 'stacked'])) {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'computeLevel',

        // -------------- scaling functions, etc. ----------------------

        // Computes the level of this group
        value: function computeLevel(group) {
            //console.log('computeLevel, part: ' + part + ', containingGroup: ' + part.containingGroup);
            if (!(group instanceof go.Group) || group.containingGroup === null) {
                return 0;
            } else {
                return this.computeLevel(group.containingGroup) + 1;
            }
        }
    }, {
        key: 'getThingScale',

        // gets the basic scaling for thing squares, by level
        value: function getThingScale(level) {
            return Math.pow(0.45, level); // 1, .45, .2025, .091125, ...
        }
    }, {
        key: 'getScale',

        // this is only used for groups
        value: function getScale(group, visitedGroupKeys) {
            if (group) {
                // keep track of groups we've visited to avoid infinite recursion
                // TODO: track down exactly how infinite loops are occurring,
                // or IF they still are since this._map.checkModel was introduced...
                if (visitedGroupKeys && Array.isArray(visitedGroupKeys)) {
                    //console.log('visitedGroupKeys: ' + visitedGroupKeys);
                    if (_.contains(visitedGroupKeys, group.data.key)) {
                        //console.log('hit already visited key: ' + group.data.key);
                        return 1;
                    } else {
                        visitedGroupKeys.push(group.data.key);
                    }
                } else {
                    visitedGroupKeys = [group.data.key];
                }

                if (group.labeledLink) {
                    // R-thing
                    var fromScale = this.getScale(group.labeledLink.fromNode, visitedGroupKeys);
                    var toScale = this.getScale(group.labeledLink.toNode, visitedGroupKeys);
                    //console.log('getScale, fromScale: ' + fromScale + ', toScale: ' + toScale + ', visitedGroupKeys: ' + visitedGroupKeys.join(','));
                    return Math.min(fromScale, toScale) * 0.5;
                } else if (group.containingGroup) {
                    return this.getScale(group.containingGroup, visitedGroupKeys) * 0.45;
                } else {
                    return this.getThingScale(this.computeLevel(group));
                }
            }
            return 1; // can occur when dragging R to empty space
        }
    }, {
        key: 'getExternalTextScale',
        value: function getExternalTextScale(group) {
            return 1 - 0.1 * this.computeLevel(group);
        }
    }, {
        key: 'getLinkStrokeWidth',
        value: function getLinkStrokeWidth(link) {
            var fromScale = this.getScale(link.fromNode);
            var toScale = this.getScale(link.toNode);
            return (link.isSelected ? 4 : 2) * Math.min(fromScale, toScale); // 2, .9, ...
        }
    }, {
        key: 'getArrowheadScale',

        // scale arrowheads based on the smallest to/from node,
        // or just the To node for P links
        value: function getArrowheadScale(link) {
            var fromScale = this.getScale(link.fromNode);
            var toScale = this.getScale(link.toNode);
            var minScale = Math.min(fromScale, toScale);
            //console.log("getArrowheadScale, fromScale: ", fromScale, ', toScale: ', toScale, ', minScale: ', minScale);
            if (link.data.category === 'P') {
                minScale = toScale;
            }
            if (minScale >= 1) {
                return 1 * minScale;
            } else {
                return 1.5 * minScale;
            }
        }
    }, {
        key: 'getNewSisterLocation',

        // -------------- creating new things ----------------------

        // Returns a location for a new sister group (thing) to the given one,
        // which will not hide any existing things (overlap is allowed).
        // The returned coordinates are absolute for a top-level group,
        // or relative to the parent otherwise - suitable for use with FreehandDiagramLayout
        // or FreehandLayout, resp.
        value: function getNewSisterLocation(group, withR) {
            var diagram = this._map.getDiagram();
            // if we are within another group, things are in absolute coordinates
            // and sisters are placed above the thing; otherwise relative and below...
            var inGroup = group.containingGroup !== null;
            // ... except if withR is true, we go to the right instead of above or below.

            // start below if in group, else above; or to the right if withR
            var x = undefined,
                y = undefined,
                w = undefined,
                h = undefined;
            if (withR) {
                x = group.location.x + group.actualBounds.width * 2.2;
                y = group.location.y;
            } else {
                x = group.location.x;
                y = group.location.y + group.actualBounds.height * 1.1 * (inGroup ? 1 : -1);
            }
            w = group.actualBounds.width;
            h = group.actualBounds.height;

            // check for overlapping parts; if found, increment x,y and continue

            while (true) {
                var rect = new go.Rect(x, y, w, h);
                rect.grow(h / 10, w / 10, h / 10, w / 10);
                var parts = diagram.findObjectsIn(rect, null, this.isGroup);
                if (parts.count) {
                    console.log('getNewSisterLocation: overlapping part found in ' + rect);
                    if (withR) {
                        x += w / 10;
                        y += h / 10;
                    } else {
                        x += w / 10;
                        y += h / 10 * (inGroup ? 1 : -1); // move down if in group, else up
                    }
                } else {
                    console.log('getNewSisterLocation: no overlapping part found in ' + rect);
                    break;
                }
            }
            if (inGroup) {
                // make coordinates relative
                x -= group.containingGroup.location.x;
                y -= group.containingGroup.location.y;
            }
            return new go.Point(x + Math.random(), y + Math.random());
        }
    }, {
        key: 'getNewChildLocation',

        // Returns a location for a new child group (thing) to the given one,
        // which will not hide any existing children (overlap is allowed).
        // The returned coordinates are relative to the parent group - suitable for use with FreehandLayout.
        value: function getNewChildLocation(group) {
            var groupBounds = group.actualBounds;
            // NB: all x/y locations are relative to the group location
            var x = 0;
            var y = groupBounds.height * 1.1;
            var w = undefined,
                h = undefined;
            var members = group.memberParts;
            // keep testing new rectangles until we find one that doesn't overlap with any existing member of the group
            while (true) {
                members.reset();
                var overlaps = false;
                var member = undefined,
                    newRect = undefined,
                    memberRect = undefined;
                while (members.next()) {
                    member = members.value;
                    var memberBounds = member.actualBounds;
                    w = memberBounds.width;
                    h = memberBounds.height;
                    // find the existing member's actual bounds (absolute coords)
                    memberRect = new go.Rect(memberBounds.x - groupBounds.x, memberBounds.y - groupBounds.y, memberBounds.width, memberBounds.height);
                    newRect = new go.Rect(x, y, w, h);
                    newRect.grow(h / 5, w / 5, h / 5, w / 5);
                    overlaps = newRect.containsRect(memberRect);
                    console.log('getNewChildLocation for ' + member + ': newRect = ' + newRect + ', memberRect = ' + memberRect + ', overlaps: ' + overlaps);
                    if (overlaps) {
                        break;
                    }
                }
                if (overlaps) {
                    // increment x, y and try again
                    x += w / 5;
                    y += h / 5;
                } else {
                    // found a good spot!
                    break;
                }
            }
            return new go.Point(x, y);
        }
    }, {
        key: 'getNewChildLocation2',

        // a simpler version of getNewChildLocation that places the child outside the bounds of the existing children
        value: function getNewChildLocation2(group) {
            var groupBounds = group.actualBounds;
            var childBounds = this._map.safeRect(this._map.getDiagram().computePartsBounds(group.memberParts));
            var x = 0;
            var y = 0;
            if (!group.memberParts.count) {
                y = groupBounds.height * 1.2;
            } else {
                y = groupBounds.height * 1.4 + childBounds.height;
            }
            //console.log('getNewChildLocation2, childBounds: ' + childBounds + ', groupBounds: ' + groupBounds + ', x: ' + x + ', y: ' + y);
            return new go.Point(x, y);
        }
    }, {
        key: 'layoutNewMembersRelativeTo',

        // move all the given new member groups so that their locations are relative to that of
        // the parent and its previously existing members, and scaled down appropriately
        value: function layoutNewMembersRelativeTo(newMembers, parent, oldMemberBounds) {
            // how big was the parent system before the new groups were added?
            var systemBounds = parent.actualBounds.unionRect(oldMemberBounds);

            // figure out old/new origins - place new origin below existing system
            var oldBounds = this._map.getDiagram().computePartsBounds(newMembers);
            var oldOrigin = new go.Point(oldBounds.x, oldBounds.y);
            var newOrigin = new go.Point(0, systemBounds.height * 1.2);
            console.log('layoutNewMembersRelativeTo, systemBounds: ' + systemBounds + ', oldBounds: ' + oldBounds + ', oldOrigin: ' + oldOrigin + ', newOrigin: ' + newOrigin);

            // figure out new scaled locations
            // NB: we can assume newMembers are all one level down from parent (see this._map.addSelectedThingsAsChildrenOf),
            // so we just multiply by the standard scale factor
            var it = newMembers.iterator;
            while (it.next()) {
                var group = it.value;
                var groupBounds = group.actualBounds;
                var newX = newOrigin.x + (groupBounds.x - oldOrigin.x) * 0.45;
                var newY = newOrigin.y + (groupBounds.y - oldOrigin.y) * 0.45;
                var newLoc = go.Point.stringify(new go.Point(newX, newY));
                console.log('layoutNewMembersRelativeTo, groupBounds: ' + groupBounds + ', newLoc: ' + newLoc);
                this._map.getDiagram().model.setDataProperty(group.data, 'loc', newLoc);
            }
        }
    }, {
        key: 'layoutOldMembersOutsideOf',

        // move all the given old member groups so that their locations are absolute and above
        // the parent, and scaled up appropriately
        value: function layoutOldMembersOutsideOf(oldMembers, parent, oldMembersBounds, oldMembersLevel) {
            // figure out scale factor (members can be dragged up multiple levels, unlike dragging into S)
            var scaleFactor = Math.pow(0.45, oldMembersLevel - this.computeLevel(parent));
            console.log('layoutOldMembersOutsideOf, scaleFactor: ' + scaleFactor);

            // figure out old/new origins - place new origin above parent, with vertical space for scaled-up oldMembers
            var parentBounds = parent.actualBounds;
            var oldOrigin = new go.Point(oldMembersBounds.x, oldMembersBounds.y);
            var newOrigin = new go.Point(parentBounds.x, parentBounds.y - oldMembersBounds.height * 1.2 / scaleFactor);

            // figure out new scaled locations
            var it = oldMembers.iterator;
            while (it.next()) {
                var group = it.value;
                var groupBounds = group.actualBounds;
                var newX = newOrigin.x + (groupBounds.x - oldOrigin.x) / scaleFactor;
                var newY = newOrigin.y + (groupBounds.y - oldOrigin.y) / scaleFactor;
                var newLoc = go.Point.stringify(new go.Point(newX, newY));
                console.log('layoutOldMembersOutsideOf, parentBounds: ' + parentBounds + ', oldMembersBounds: ' + oldMembersBounds + ', newOrigin: ' + newOrigin + ', groupBounds: ' + groupBounds + ', newLoc: ' + newLoc);
                this._map.getDiagram().model.setDataProperty(group.data, 'loc', go.Point.stringify(newLoc));
            }
        }
    }, {
        key: 'getLayout',

        // ----------------- accessors -------------------

        // returns the appropriate layout class by abbreviated name
        value: function getLayout(layoutName) {
            var LeftInventoryLayout = require('./layouts/LeftInventoryLayout.js');
            var RightInventoryLayout = require('./layouts/RightInventoryLayout.js');
            var StackedLayout = require('./layouts/StackedLayout.js');
            var FreehandLayout = require('./layouts/FreehandLayout.js');
            if (layoutName === 'freehand') return new FreehandLayout();else if (layoutName === 'right') return new RightInventoryLayout();else if (layoutName === 'stacked') return new StackedLayout();else return new LeftInventoryLayout();
        }
    }, {
        key: 'getFreehandDiagramLayout',
        value: function getFreehandDiagramLayout() {
            var FreehandDiagramLayout = require('./layouts/FreehandDiagramLayout.js');
            return new FreehandDiagramLayout();
        }
    }, {
        key: 'getCommonAncestorWithLayout',

        // --------------------------------------------------------------

        // returns true if the to and from nodes for the link have a common ancestor group with one of the given layout names.
        // TODO: verify logic - what if there are multiple such ancestors? - this should return the highest one...
        value: function getCommonAncestorWithLayout(group1, group2, layoutNames) {
            var ancestors1 = this.getAncestorGroups(group1);
            var ancestors2 = this.getAncestorGroups(group2);
            var commonAncestors = _.intersection(ancestors1, ancestors2);
            var layoutAncestors = _.filter(commonAncestors, function (group) {
                return _.indexOf(layoutNames, group.data.layout) !== -1;
            });
            if (layoutAncestors.length) {
                return layoutAncestors[0];
            } else {
                return null;
            }
        }
    }, {
        key: 'getAncestorGroups',

        // returns the ancestors of this group, including itself
        value: function getAncestorGroups(group) {
            var ancestors = [group];
            var g = group;
            while (g.containingGroup) {
                ancestors.push(g.containingGroup);
                g = g.containingGroup;
            }
            return ancestors;
        }
    }, {
        key: 'validateGroupLocations',

        // --------------------------------------------------------------

        // if any group in the given Iterator does not have a location (data.loc), set one
        // that doesn't overlap with the other members
        value: function validateGroupLocations(groups) {}
    }, {
        key: 'adjustLinkLayout',

        // --------------------------------------------------------------

        // ------------------------ link routing and visibility ------------------------------

        // adjust the routing, visibility and other properties of a link according to various structural criteria
        value: function adjustLinkLayout(link) {
            if (!link || !link.fromNode || !link.toNode) {
                return;
            }

            // let loc = link.location;
            // if (isNaN(loc.x) || isNaN(loc.y)) {
            //     link.location = new go.Point(10, 10);
            //     console.log('adjustLinkLayout, link.location: ' + link.location);
            // }
            // console.log('adjustLinkLayout, link.location: ' + link.location);

            // see if link is within a stacked or inventory layout, or if it's a hidden P link
            var inventoryAncestor = this.getCommonAncestorWithLayout(link.fromNode, link.toNode, ['left', 'right']);
            var stackedAncestor = this.getCommonAncestorWithLayout(link.fromNode, link.toNode, ['stacked']);
            var hidePLink = link.data && link.data.category === 'P' && !this._map.templates.showPLink(link);
            var crowdedRThing = this.hasCrowdedRThing(link);

            // see if this is one of multiple links between the same two nodes
            var snpos = this.getSameNodesLinkPosition(link);
            var isMultiLink = snpos.count > 1;
            //console.log('snpos for link ' + link + ': ' + snpos.index + ' of ' + snpos.count);

            if (inventoryAncestor) {
                this.applyInventoryCurveRouting(link, snpos, inventoryAncestor.data.layout);
            } else if (isMultiLink) {
                this.applyMultilinkCurveRouting(link, snpos);
            } else if (crowdedRThing) {
                this.applyInventoryCurveRouting(link, snpos, 'left');
            } else {
                this.applyStraightRouting(link);
            }

            // show link only if both connected things are visible (no collapsed ancestors);
            // hide if both are in stacked layout or if it's a P-link that we shouldn't be showing now
            if (this.fromAndToNodesAreVisible(link) && !stackedAncestor && !hidePLink) {
                link.opacity = 1;
                this.showLabelNodes(link, true);
            } else {
                link.opacity = 0;
                this.showLabelNodes(link, false);
            }
        }
    }, {
        key: 'hasCrowdedRThing',

        // TODO: detect when the R-thing overlaps both from and to nodes, so we can change the link routing
        value: function hasCrowdedRThing(link) {
            return false;
        }
    }, {
        key: 'showLabelNodes',
        value: function showLabelNodes(link, show) {
            //console.log('showLabelNodes, link: ' + link + ', show: ' + show);
            var it = link.labelNodes;
            if (it) {
                while (it.next()) {
                    var group = it.value;
                    group.visible = show;
                    if (show) {
                        group.layout.doLayout(group);
                    }
                }
            }
        }
    }, {
        key: 'applyInventoryCurveRouting',

        // if link is between two things in the same inventory layout (single or multiple),
        // make the line more or less circular on the appropriate side
        value: function applyInventoryCurveRouting(link, snpos, ancestorLayout) {
            if (ancestorLayout === 'left') {
                link.fromSpot = go.Spot.Left;
                link.toSpot = go.Spot.Left;
            } else if (ancestorLayout === 'right') {
                link.fromSpot = go.Spot.Right;
                link.toSpot = go.Spot.Right;
            }

            // aspect ratio for the link curves - make this smaller to make them taller, larger to make them fatter
            var curveRatio = 0.6;

            var y1 = link.fromNode.actualBounds.y;
            var y2 = link.toNode.actualBounds.y;

            var yDiff = Math.abs(y2 - y1);
            var c = (yDiff === 0 ? 50 : Math.floor(yDiff * curveRatio)) + 100 * (snpos.index / snpos.count);
            //console.log("yDiff = " + yDiff + ', c = ' + c + ' (' + link.fromNode.data.text + ' - ' + p1 + ' - to ' + link.toNode.data.text + ' - ' + p2 + ')');

            link.curve = go.Link.Bezier;
            link.fromEndSegmentLength = c;
            link.toEndSegmentLength = c;
        }
    }, {
        key: 'applyMultilinkCurveRouting',

        // if non-inventory link is one of multiple ones between same nodes, make it curved
        value: function applyMultilinkCurveRouting(link, snpos) {
            link.fromSpot = go.Spot.Default;
            link.toSpot = go.Spot.Default;
            link.curve = go.Link.Bezier;
            // curviness values based on number of links:
            // 2: -25 25
            // 3: -50 0 50
            // 4: -100 -50 0 50 100
            var rangeSize = 10 * (snpos.count - 1);
            var rangeIncrement = 10;
            if (snpos.hasRThing) {
                rangeSize = 100 * (snpos.count - 1);
                rangeIncrement = 100;
            }

            // adjust curviness for smaller scales
            var linkScaleFactor = this.getLinkStrokeWidth(link) / 2; // 2 is max stroke width
            rangeSize *= linkScaleFactor;
            rangeIncrement *= linkScaleFactor;

            var rangeStart = 0 - rangeSize / 2;

            link.curviness = (rangeStart + rangeIncrement * snpos.index) * snpos.orientation;
            // console.log('applyMultilinkCurveRouting, link: ' + link + ', curviness: ' + link.curviness);
        }
    }, {
        key: 'applyStraightRouting',

        // do normal straight lines for freehand layout, or links between descendants of things with different layouts
        value: function applyStraightRouting(link) {
            link.fromSpot = go.Spot.Default;
            link.toSpot = go.Spot.Default;
            link.routing = go.Link.Normal;
            link.curve = go.Link.None;
            link.curviness = 0;
        }
    }, {
        key: 'getSameNodesLinkPosition',

        // --------------- calculate how many links there are between a link's nodes ---------------

        // Returns an object of the format { index: 1, count: 2, orientation: -1, hasRThing: false },
        // indicating how many other links there are between the same pair of nodes,
        // where the given link falls within this list, and what its orientation is.
        value: function getSameNodesLinkPosition(link) {
            var linksByNodes = this.getLinksByNodes(true);
            // get links with the same key as this one (connecting same nodes)
            var sameLinks = _.where(linksByNodes, {
                key: this.getSameNodesLinkKey(link)
            });

            // default return value
            var snpos = {
                index: 0,
                count: 1,
                orientation: 1,
                hasRThing: false
            };
            // set index, count, orientation
            for (var i = 0; i < sameLinks.length; i++) {
                if (sameLinks[i].link === link) {
                    snpos = {
                        index: i,
                        count: sameLinks.length,
                        orientation: this.getLinkOrientation(link)
                    };
                }
            }
            // check for Rthing
            for (var i = 0; i < sameLinks.length; i++) {
                if (sameLinks[i].hasRThing) {
                    snpos.hasRThing = true;
                }
            }
            return snpos;
        }
    }, {
        key: 'getStackMargin',

        // gets the margin to be used in stack layout between this group's children
        value: function getStackMargin(group) {
            return 10 / 0.45 * this.getScale(group);
        }
    }, {
        key: 'layoutMembersForStacked',

        // returns the max y value after laying out the last part
        value: function layoutMembersForStacked(group, startX, startY) {
            var _this = this;

            var members = this.getOrderedMembers(group);
            var x = startX;
            var y = startY;
            var rowCount = 0;
            var maxStartY = startY;
            _.each(members, function (part) {
                if (part instanceof go.Group && !part.isLinkLabel) {
                    var margin = _this.getStackMargin(part);
                    part.move(new go.Point(x, y));
                    startY = y + part.actualBounds.height + margin / 2; // start Y position for part's children

                    //console.log('layoutMembersForStacked: starting layout of children of ' + part + ' at ' + Math.round(x) + ',' + Math.round(startY));

                    if (part.isSubGraphExpanded) {
                        // layout children of this part; check if we've already done a taller part+children in current row
                        maxStartY = Math.max(maxStartY, _this.layoutMembersForStacked(part, x, startY));
                        //console.log('layoutMembersForStacked: laid out children of ' + part + ', maxStartY is now ' + Math.round(maxStartY));
                    } else {
                        maxStartY = Math.max(maxStartY, startY);
                    }

                    // decide whether to wrap
                    rowCount++;
                    if (rowCount < 2) {
                        // keep going on this line
                        x += part.actualBounds.width + margin;
                    } else {
                        // wrap to next line
                        x = startX;
                        y = maxStartY + margin / 2;
                        rowCount = 0;
                    }
                }
            });
            return maxStartY;
        }
    }, {
        key: 'getInventoryMargin',

        // shared stuff for Left/Right Inventory layouts...

        // gets the margin to be used in stack layout between this group's children
        value: function getInventoryMargin(group) {
            if (this.computeLevel(group) <= 2) {
                return 10 * this.getScale(group);
            } else {
                return 3 * this.getScale(group);
            }
        }
    }, {
        key: 'layoutMembersForInventory',

        // returns the max y value after laying out the last part
        // side is 'L' or 'R'
        value: function layoutMembersForInventory(group, startX, startY, side) {
            var _this2 = this;

            var members = this.getOrderedMembers(group);
            _.each(members, function (part) {
                var x = startX; // for left, just use x
                if (side === 'R') x = startX - part.actualBounds.width; // for right, right-align parts to startX
                //console.log('layoutMembersForInventory, part: ' + part + ' to location: ' + x + ',' + startY);
                part.move(new go.Point(x, startY));
                startY += part.actualBounds.height + _this2.getInventoryMargin(part);
                if (part.isSubGraphExpanded) {
                    //console.log('layoutMembersForInventory, y after moving: ' + part + ' = ' + startY);
                    startY = _this2.layoutMembersForInventory(part, startX, startY, side);
                }
            });
            return startY + this.getInventoryMargin(group);
        }
    }, {
        key: 'getOrderedMembers',

        // returns an array of the group's (non-R-thing) members, sorted by the 'order' data property
        value: function getOrderedMembers(group) {
            var members = new go.List();
            var it = group.memberParts.iterator;
            while (it.next()) {
                var part = it.value;
                if (part instanceof go.Group && !part.isLinkLabel) {
                    members.add(part);
                }
            }
            return _.sortBy(members.toArray(), function (member) {
                return member.data.order;
            });
        }
    }, {
        key: 'getLinksByNodes',

        // refreshes the cached list of all links with keys, to facilitate grouping them according to connected nodes
        value: function getLinksByNodes(refresh) {
            //console.log('getLinksByNodes');
            if (!this._linksByNodes || refresh) {
                this._linksByNodes = [];
                var diagram = this._map.getDiagram();
                var links = diagram.links.iterator;
                while (links.next()) {
                    var link = links.value;
                    var key = this.getSameNodesLinkKey(link);
                    if (key) {
                        this._linksByNodes.push({
                            key: key,
                            link: link,
                            hasRThing: link.labelNodes.count > 0
                        });
                    }
                }
            }
            return this._linksByNodes;
        }
    }, {
        key: 'getSameNodesLinkKey',

        // Returns a key used to group links according to which pair of nodes they connect.
        // The returned key is non-empty for regular links and P links that should be shown currently,
        // so that these will all be routed by the same rules. A null key is returned for any other
        // links, indicating that no grouping is required.
        value: function getSameNodesLinkKey(link) {
            //        if (this.isRLink(link) || (this.isPLink(link) && this._map.templates.showPLink(link))) {
            if (this.isRLink(link)) {
                var key = [link.fromNode.toString(), link.toNode.toString()].sort().join('|');
                //console.log('key: ' + key);
                return key;
            } else {
                return null;
            }
        }
    }, {
        key: 'getLinkOrientation',

        // We use this to distinguish an A-B link from a B-A link (based on fromNode and toNode, which
        // is independent of the arrowhead settings) when setting curviness, because setting curviness = 25
        // on an A-B link is the same as curviness = -25 on a B-A link.
        value: function getLinkOrientation(link) {
            if (link.fromNode && link.toNode && link.fromNode.toString() < link.toNode.toString()) {
                return 1;
            } else {
                return -1;
            }
        }
    }, {
        key: 'isRLink',

        // -------------- link tests ---------------

        value: function isRLink(link) {
            return link instanceof go.Link && link.data && !link.data.category && link.fromNode && link.toNode;
        }
    }, {
        key: 'isDLink',
        value: function isDLink(link) {
            return link instanceof go.Link && link.data && link.data.category === 'D';
        }
    }, {
        key: 'isPLink',
        value: function isPLink(link) {
            return link instanceof go.Link && link.data && link.data.category === 'P';
        }
    }, {
        key: 'isGroup',
        value: function isGroup(obj) {
            return obj instanceof go.Group;
        }
    }]);

    return Layouts;
})();

module.exports = Layouts;

//console.log('Layouts, PartCreated');
// setNewPartLocationData(e);

// stacked?

},{"./layouts/FreehandDiagramLayout.js":39,"./layouts/FreehandLayout.js":40,"./layouts/LeftInventoryLayout.js":41,"./layouts/RightInventoryLayout.js":42,"./layouts/StackedLayout.js":43}],31:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EditorConfig = require('./EditorConfig.js');

var MILLION = 1000 * 1000;
var LEFT = 'left';
var RIGHT = 'right';
var go = window.go;

var Map = (function () {
    function Map() {
        var config = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Map);

        this._editor = config.Editor;

        this._config = new EditorConfig(this._editor, this);
        this.analytics = this._config.analytics;
        this.attachments = this._config.attachments;
        this.autosave = this._config.autosave;
        this.editorOptions = this._config.editorOptions;
        this.generator = this._config.generator;
        this.layouts = this._config.layouts;
        this.perspectives = this._config.perspectives;
        this.presenter = this._config.presenter;
        this.standards = this._config.standards;
        this.templates = this._config.templates;
        this.tests = this._config.tests;
        this.ui = this._config.ui;

        //this._analytics = new SandbankEditor.Analytics(this._editor, this);
        //this._attachments = new SandbankEditor.Attachments(this._editor, this);
        //this._autosave = new SandbankEditor.Autosave(this._editor, this);
        //this._generator = new SandbankEditor.Generator(this._editor, this);
        //this._layouts = new SandbankEditor.Layouts(this._editor, this);
        //this._perspectives = new SandbankEditor.Perspectives(this._editor, this);
        //this._presenter = new SandbankEditor.Presenter(this._editor, this);
        //this._standards = new SandbankEditor.Standards(this._editor, this);
        //this._templates = new SandbankEditor.Templates(this._editor, this);
        //this._tests = new SandbankEditor.Tests(this._editor, this);
        //this._ui = new SandbankEditor.UI(this._editor, this);

        // call init for each component, if defined
        _.each(this.getComponents(), function (component) {
            if (component && component.init) component.init();
        });

        // create diagram
        this._diagram = new go.Diagram('diagram');
        this._diagram.initialContentAlignment = go.Spot.Center;
        this._diagram.initialViewportSpot = go.Spot.Center;
        this._diagram.initialDocumentSpot = go.Spot.Center;
        this._diagram.hasHorizontalScrollbar = false;
        this._diagram.hasVerticalScrollbar = false;
        this._diagram.padding = 500;
        this._diagram.layout = this.layouts.getFreehandDiagramLayout();

        this.initTools();
        this.templates.initTemplates(this._diagram); // set up templates, customize temporary link behavior
        this.addDiagramListeners();

        this.templates.addExportFooter();
    }

    _createClass(Map, [{
        key: 'printSlides',
        value: function printSlides() {
            this.presenter.createSlideThumbnails();

            setTimeout(function () {
                window.print();
            }, 500);
        }
    }, {
        key: 'exportToImage',
        value: function exportToImage(format) {
            var _this = this;

            this.imageExportLoading = true;
            $('#export-image img').remove();
            this.templates.showExportFooter();

            var rect = this.getDiagram().computePartsBounds(this.getDiagram().nodes).copy();

            var imageMB = rect.width * rect.height * 4 / MILLION; // 4 bytes/pixel
            //console.log('imageMB: ' + imageMB);

            // make the max size of the image 10MB
            // pngSize = imageMB * scale * scale
            // so max scale = sqrt(pngSize / imageMB)
            // These calculations don't seem to be right, but in practice using 500 here
            // we get a scale of 2.43 for an image 19984 x 3424 pixels
            // which results in a file size of 1.88 MB at 32 bits/pixel...
            // OR 28380 x 5196 pixels, scale = 3.41 => file size = 3.49 MB
            var scale = 4;
            if (imageMB) {
                scale = Math.min(4, Math.sqrt(50 / imageMB));
            }

            //console.log('image dimensions: ' + rect.width + ' x ' + rect.height + ', image bytes: ' + (rect.width * rect.height * 4) +
            //        ', imageMB: ' + imageMB + ', scale: ' + scale);

            this.showImageExport = true;

            var partsToExport = new go.List();
            partsToExport.addAll(this.getDiagram().nodes);
            partsToExport.addAll(this.getDiagram().links);
            partsToExport.remove(this.presenter.slideBlocker);

            var doImage = $timeout(function () {
                var img = _this.getDiagram().makeImage({
                    parts: partsToExport,
                    maxSize: new go.Size((rect.width + 200) * scale, (rect.height + 200) * scale),
                    scale: scale,
                    padding: 100 * scale,
                    background: '#ffffff'
                });

                $('#export-image').append(img);
                _this.imageExportLoading = false;

                _this.templates.hideExportFooter();
            }, 100);
        }
    }, {
        key: 'getComponents',

        // ------------ component accessors ----------------

        value: function getComponents() {
            return [this.analytics, this.attachments, this.autosave, this.generator,
            // this._history,
            this.layouts, this.perspectives, this.presenter, this.standards, this.templates, this.tests, this.ui];
        }
    }, {
        key: 'currentTab',
        get: function () {
            return this._currentTab;
        },
        set: function (val) {
            // watch for tab changes
            // TODO: restore non-Angular version of this
            //this._editor.$watch('currentTab', function(newValue, oldValue) {
            //    this.currentTabChanged(newValue, oldValue);
            //});
            this.currentTabChanged(this._currentTab, val);
            this._currentTab = val;
        }
    }, {
        key: 'currentTabChanged',

        // this is called by a this._editor.$watch in init()
        value: function currentTabChanged(newValue, oldValue) {
            // console.log('currentTabChanged, newValue: ' + newValue + ', oldValue: ' + oldValue);
            // notify any interested components
            _.each(this.getComponents(), function (component) {
                if (component && component.currentTabChanged) {
                    component.currentTabChanged(newValue, oldValue);
                }
            });

            //this._editor.safeApply();
        }
    }, {
        key: 'getDiagram',
        value: function getDiagram() {
            return this._diagram;
        }
    }, {
        key: 'initTools',

        // misc. tool configuration
        value: function initTools() {
            var _this2 = this;

            // disable clicking on TextBlocks to edit - we will invoke editing in other ways
            this._diagram.allowTextEdit = false;

            // select text when activating editor;
            // use shift-enter to create new lines, enter to finish editing (NB: editor has multiline=true)
            var textTool = this._diagram.toolManager.textEditingTool;
            textTool.doActivate = function () {
                go.TextEditingTool.prototype.doActivate.call(textTool);
                if (textTool.defaultTextEditor) {
                    textTool.defaultTextEditor.select();

                    textTool.defaultTextEditor.addEventListener('keydown', function (e) {
                        if (e.which === 13 && !e.shiftKey) {
                            go.TextEditingTool.prototype.acceptText.call(textTool, go.TextEditingTool.LostFocus);
                        }
                    });
                }
            };

            // handle delete key on Mac (default behavior only uses fn-Delete to delete from canvas)
            this._diagram.commandHandler.doKeyDown = function () {
                var e = _this2._diagram.lastInput;
                var cmd = _this2._diagram.commandHandler;
                if (e.event.which === 8) {
                    cmd.deleteSelection();
                } else {
                    go.CommandHandler.prototype.doKeyDown.call(cmd); // call base method with no arguments
                }
            };

            // [disable keyboard shortcuts, as these do not do centering on zoom,
            // and can lead to confusion with browser zoom (which gets fired depends on focus)]
            // - turned back on to support pinch/zoom on iPad
            this._diagram.allowZoom = true;

            this._diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;

            // decide what kinds of Parts can be added to a Group or to top-level
            // this._diagram.commandHandler.memberValidation (grp, node) {
            //     //if (grp instanceof go.Group && node instanceof go.Group) return false;  // cannot add Groups to Groups
            //     return true;
            // };

            // default link attributes
            this._diagram.toolManager.linkingTool.archetypeLinkData = {
                type: 'noArrows'
            };

            // allow double-click in background to create a new node
            this._diagram.toolManager.clickCreatingTool.archetypeNodeData = this.getNewThingData();

            // how long mouse must be held stationary before starting a drag-select (instead of a scroll) - default was 175ms
            this._diagram.toolManager.dragSelectingTool.delay = 400;
        }
    }, {
        key: 'addDiagramListeners',

        // ----------- handling of DiagramEvents --------------------

        value: function addDiagramListeners() {
            var _this3 = this;

            // DiagramEvents to be handled here or by a component
            var diagramEvents = ['InitialLayoutCompleted', 'ChangedSelection', 'BackgroundSingleClicked', 'SelectionCopied', 'SelectionMoved', 'SelectionDeleting', 'SelectionDeleted', 'PartCreated', 'PartResized', 'ClipboardChanged', 'ClipboardPasted', 'LinkDrawn', 'LinkRelinked', 'ViewportBoundsChanged'];
            _.each(diagramEvents, function (eventName) {
                _this3._diagram.addDiagramListener(eventName, function (e) {
                    _this3.broadcastDiagramEvent(eventName, e);
                });
            });

            this._diagram.addDiagramListener('BackgroundContextClicked', function (e) {});
        }
    }, {
        key: 'broadcastDiagramEvent',

        // broadcasts the given DiagramEvent (see apidocs for go.DiagramEvent)
        // to any components that may be interested, including this one.
        value: function broadcastDiagramEvent(eventName, e) {
            this.handleDiagramEvent(eventName, e);
            _.each(this.getComponents(), function (component) {
                if (component && component.handleDiagramEvent) component.handleDiagramEvent(eventName, e);
            });
        }
    }, {
        key: 'handleDiagramEvent',
        value: function handleDiagramEvent(eventName, e) {
            //console.log('handleDiagramEvent: ' + eventName);
            if (eventName === 'ChangedSelection') {
                this.changedSelection(e);
            } else if (eventName === 'SelectionCopied') {
                this.selectionCopied(e);
            } else if (eventName === 'PartCreated') {
                this.partCreated(e);
            } else if (eventName === 'BackgroundSingleClicked') {
                this.ui.showHelpTip('canvasTip');
            } else if (eventName === 'LinkDrawn') {
                this.linkDrawn(e);
                this.setNewLinkDirection(e);
            } else if (eventName === 'LinkRelinked') {
                this.linkRelinked(e);
            } else if (eventName === 'ClipboardChanged') {
                this.clipboardChanged(e);
            } else if (eventName === 'ClipboardPasted') {
                this.clipboardPasted(e);
            }
        }
    }, {
        key: 'changedSelection',

        // handle zoom to region if applicable
        value: function changedSelection(e) {
            //console.log('this.changedSelection');
            this._diagram.updateAllTargetBindings();
            this.ui.maybeZoomToRegion();
            if (this.relationshipsSelected()) {
                this.ui.showHelpTip('relationshipTip');
            }
        }
    }, {
        key: 'partCreated',
        value: function partCreated(e) {
            //console.log('Map, PartCreated');
            var group = e.subject;
            if (!(group instanceof go.Group)) {
                return;
            }
            this._diagram.model.setDataProperty(group.data, 'layout', this.editorOptions.defaultThingLayout || 'left');
            this.layouts.setNewPartLocationData(e);
        }
    }, {
        key: 'linkDrawn',

        // fix link ports when a link is created -
        // the P and R ports both cover the whole node, and the P port is on top of the R port,
        // so both P and R links get the toPort set to P by default.
        value: function linkDrawn(e) {
            var link = e.subject;
            console.log('linkDrawn, link: ' + link + ', fromPort: ' + link.fromPortId + ', toPort: ' + link.toPortId);
            if (link.fromPortId === 'P') {
                this._diagram.model.startTransaction('change link category');
                this._diagram.model.setDataProperty(link.data, 'toPort', 'P');
                this._diagram.model.setDataProperty(link.data, 'category', 'P');
                this._diagram.model.commitTransaction('change link category');
            }
            // prevent links from R to P
            else if (link.fromPortId === 'R') {
                this._diagram.model.startTransaction('change link toPort');
                this._diagram.model.setDataProperty(link.data, 'toPort', 'R');
                this._diagram.model.commitTransaction('change link toPort');
            }
        }
    }, {
        key: 'linkRelinked',

        // fix link ports when a link is relinked -
        // dragging either end of an R-link to another node will set the corresponding port to P,
        // since P port is on top of R port, so we reset both ports to R if the category is not P.
        value: function linkRelinked(e) {
            var link = e.subject;
            if (!link.data.category || link.data.category !== 'P') {
                this._diagram.model.setDataProperty(link.data, 'fromPort', 'R');
                this._diagram.model.setDataProperty(link.data, 'toPort', 'R');
            }
        }
    }, {
        key: 'setNewLinkDirection',
        value: function setNewLinkDirection(e) {
            var link = e.subject;
            if (link.fromPortId === 'R') {
                this._diagram.model.startTransaction('change link direction');
                this._diagram.model.setDataProperty(link.data, 'type', this.editorOptions.defaultRelationshipDirection);
                this._diagram.commitTransaction('change link direction');
            }
        }
    }, {
        key: 'clipboardChanged',
        value: function clipboardChanged(e) {
            var parts = e.subject.iterator;
            while (parts.next()) {
                var part = parts.value;
                if (part instanceof go.Group) {
                    console.log('clipboardChanged: part ' + part + ', mainpanel scale: ' + part.findObject('mainpanel').scale);
                }
            }
        }
    }, {
        key: 'selectionCopied',

        // NB: this is called when parts are copied by control-drag, NOT when the copy button is clicked
        value: function selectionCopied(e) {
            console.log('selectionCopied');
            var parts = e.subject.iterator;
            while (parts.next()) {
                var part = parts.value;
                if (part instanceof go.Group && part.isTopLevel) {
                    var loc = go.Point.parse(part.data.loc);
                    console.log('selectionCopied: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                    this._diagram.model.setDataProperty(part.data, 'loc', loc.x + 50 + ' ' + (loc.y + 50));
                    part.updateTargetBindings('loc');
                }
            }
        }
    }, {
        key: 'clipboardPasted',
        value: function clipboardPasted(e) {
            var parts = e.subject.iterator;
            while (parts.next()) {
                var part = parts.value;
                if (part instanceof go.Group && part.isTopLevel) {
                    var loc = go.Point.parse(part.data.loc);
                    //console.log('clipboardPasted: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                    this._diagram.model.setDataProperty(part.data, 'loc', loc.x + 50 + ' ' + (loc.y + 50));
                    part.updateTargetBindings('loc');
                }
            }
        }
    }, {
        key: 'computeMapBounds',

        // computes the bounds of all groups in the diagram - this includes all ideas/things,
        // and excludes nodes, including slides, the slide blocker, and the export footer
        value: function computeMapBounds() {
            var groups = new go.List(go.Group);
            var nodes = this._diagram.nodes;
            while (nodes.next()) {
                if (nodes.value instanceof go.Group) {
                    groups.add(nodes.value);
                }
            }
            return this._diagram.computePartsBounds(groups).copy(); // return a mutable rect
        }
    }, {
        key: 'thingsSelected',

        // ------------ what is currently selected? ----------------

        // returns true if all selected items are things (i.e. Groups), including r-things
        value: function thingsSelected() {
            if (!this._diagram || this._diagram.selection.count < 1) return false;

            var it = this._diagram.selection.iterator;
            while (it.next()) {
                if (!(it.value instanceof go.Group)) return false;
            }

            return true;
        }
    }, {
        key: 'thingSelected',

        // returns true if exactly one thing (Group) is selected
        value: function thingSelected() {
            return this._diagram && this._diagram.selection.count === 1 && this._diagram.selection.first() instanceof go.Group;
        }
    }, {
        key: 'getUniqueThingSelected',

        // if a single group is selected, returns it, otherwise returns null
        value: function getUniqueThingSelected() {
            if (this._diagram && this._diagram.selection.count === 1 && this._diagram.selection.first() instanceof go.Group) {
                return this._diagram.selection.first();
            } else {
                return null;
            }
        }
    }, {
        key: 'thingsSelectedAreMembersOf',
        value: function thingsSelectedAreMembersOf(group) {
            if (!this._diagram || this._diagram.selection.count < 1) return false;

            var it = this._diagram.selection.iterator;
            while (it.next()) {
                if (!(it.value instanceof go.Group) || it.value.containingGroup !== group) return false;
            }

            return true;
        }
    }, {
        key: 'thingsSelectedAreDescendantsOf',
        value: function thingsSelectedAreDescendantsOf(group) {
            if (!this._diagram || this._diagram.selection.count < 1) return false;

            var it = this._diagram.selection.iterator;
            while (it.next()) {
                var ancestors = this.layouts.getAncestorGroups(it.value);
                if (_.indexOf(ancestors, group) === -1) return false;
            }

            return true;
        }
    }, {
        key: 'thingsSelectedIncludeSlide',
        value: function thingsSelectedIncludeSlide() {
            if (!this._diagram || this._diagram.selection.count < 1) return false;

            var it = this._diagram.selection.iterator;
            while (it.next()) {
                if (it.value.data && it.value.data.category === 'slide') {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'relationshipsSelected',

        // returns true if all selected items are relationships (i.e. Links)
        value: function relationshipsSelected() {
            if (!this._diagram || this._diagram.selection.count < 1) return false;

            var it = this._diagram.selection.iterator;
            while (it.next()) {
                if (!(it.value instanceof go.Link) || !this.layouts.isRLink(it.value)) return false;
            }

            return true;
        }
    }, {
        key: 'relationshipSelected',

        // returns true if exactly one relationship (Link) is selected
        value: function relationshipSelected() {
            return this._diagram && this._diagram.selection.count === 1 && this._diagram.selection.first() instanceof go.Link;
        }
    }, {
        key: 'load',

        // ------------ load and initialize model -------------

        value: function load() {
            var url = this._editor.mapUrl + '.json';
            if (this._editor.sandbox) {
                url = this._editor.mapUrl + '.json?sandbox=1';
            }
            //TODO: restore non-Angular http-get for map data
            var data = { 'map': { 'metadata': { 'sandbox': false, 'id': 5547, 'name': 'Untitled Map', 'url': '/maps/5547', 'canEdit': true, 'updatedAt': '2015-05-15T12:29:40.721-04:00', 'updatedBy': null, 'updatedByName': null, 'userTags': [] }, 'data': { 'class': 'go.GraphLinksModel', 'nodeIsLinkLabelProperty': 'isLinkLabel', 'linkLabelKeysProperty': 'labelKeys', 'linkFromPortIdProperty': 'fromPort', 'linkToPortIdProperty': 'toPort', 'nodeDataArray': [{ 'key': 1, 'text': 'New Idea', 'isGroup': true, 'loc': '0 0', 'layout': 'left', 'sExpanded': true, 'pExpanded': true }], 'linkDataArray': [] }, 'stateData': null, editorOptions: null, 'analytics': {}, 'versions': [] } };
            this._diagram.model = go.Model.fromJson(data);
            //this._ui.setStateData(data.map.stateData);
            //this._ui.setMapEditorOptions(data.map._editorOptions);

            this.checkModel();
            this._diagram.updateAllTargetBindings();
            this._diagram.undoManager.isEnabled = true;
            this._diagram.model.addChangedListener(this.autosave.modelChanged);
            this.autosave.saveOnModelChanged = true;
            this._diagram.isReadOnly = !this._editor.canEdit;
            this._editor.updateEditStatus(this._editor.canEdit ? this._editor.LAST_UPDATED : this._editor.READ_ONLY);
            this.ui.resetZoom();
            this.loadMapExtraData(data.map);

            // if no nodes OR in thinkquery mode, launch generator
            if (this._editor.thinkquery || !this._diagram.model.nodeDataArray.length) {
                this.ui.openTab(this.ui.TAB_ID_GENERATOR);
            }
            // if we have slides, play presentation
            else if (!this._editor.canEdit && this.presenter.getSlideNodeDatas().length) {
                this.presenter.playSlide(1);
            }
        }
    }, {
        key: 'loadForSandbox',
        value: function loadForSandbox() {
            this._diagram.model = go.Model.fromJson(this._editor.mapData);
            this.ui.setStateData(''); // important! (otherwise corner highlighting breaks)
            this._diagram.updateAllTargetBindings();
            this._diagram.undoManager.isEnabled = true;
            this.ui.resetZoom();
            this._editor.canEdit = true;

            // if no nodes OR in thinkquery mode, launch generator
            if (this._editor.thinkquery) {
                this.ui.openTab(this.ui.TAB_ID_GENERATOR);
            }
            // if we have slides, play presentation
            else if (this.presenter.getSlideNodeDatas().length) {
                this.presenter.playSlide(1);
            }
        }
    }, {
        key: 'checkModel',

        // fix any structural problems in the model before displaying it
        value: function checkModel() {
            // change "isLinkLabel" property to category:"LinkLabel" (change as of goJS 1.3)
            _.each(this._diagram.model.nodeDataArray, function (nodeData, index, list) {
                if (nodeData.isLinkLabel) {
                    delete nodeData.isLinkLabel;
                    nodeData.category = 'LinkLabel';
                }
            });

            // check for the link label (r-thing) for a link being the same as the from or to node
            // - this can cause infinite recursion in thinks like layout.getScale
            _.each(this._diagram.model.linkDataArray, function (linkData, index, list) {
                var badLabelKeys = [];
                _.each(linkData.labelKeys, function (key, index2, list2) {
                    if (key === linkData.from || key === linkData.to) {
                        console.log('labelKey same as from or to of link: ' + key);
                        badLabelKeys.push(key);
                    }
                });
                linkData.labelKeys = _.difference(linkData.labelKeys, badLabelKeys);
            });
        }
    }, {
        key: 'loadMapExtraData',

        // loads other data besides the diagram model from the json object returned by maps/show.json
        // - this includes points, badges, versions, and map analytics
        // NB: points and badges are set at page load time in layouts/user and users/badges, but
        // we also need to be able to update them here after an autosave

        // TODO: is this still all needed with the newer userProfile stuff?
        value: function loadMapExtraData(mapData) {
            //console.log('map.loadMapExtraData, mapData: ' + mapData);
            this._editor.mapUserTags = mapData.metadata.userTags; // TODO: is this used anywhere?

            //this._editor.map.getHistory().versionList = mapData.versions;
            this.analytics.mapAnalytics = mapData.analytics;
        }
    }, {
        key: 'loadVersion',

        // loads model data for an individual version and displays it
        // NB: this also disables autosave; load() must be called to re-enable it
        value: function loadVersion(id) {
            var _this4 = this;

            $http.get('/mapthis._versions/' + id).then(function (response) {
                if (response.status === 200) {
                    try {
                        //console.log('loaded map version with ID: ' + id);
                        _this4._diagram.model = go.Model.fromJson(response.data);
                        _this4._diagram.updateAllTargetBindings();
                        _this4._diagram.undoManager.isEnabled = false;
                        _this4.autosave.saveOnModelChanged = false;
                        _this4._diagram.layoutDiagram(true);
                        _this4._diagram.isReadOnly = true;
                    } catch (e) {
                        alert('Could not load MetaMap version');
                        console.error(e.message);
                    }
                }
            });
        }
    }, {
        key: 'setEditingBlocked',

        // set whether editing capability is temporarily suspended -
        // this is distinct from the global this._editor.canEdit setting,
        // which if false prevents editing at all times
        value: function setEditingBlocked(val) {
            if (this._editor.canEdit) {
                this._diagram.isReadOnly = val;
            }
        }
    }, {
        key: 'getNewThingData',

        // ------------- creating things in the model -------------------

        // default properties for all new Things (groups) - note that these can be overridden if needed
        value: function getNewThingData() {
            return {
                text: 'Idea',
                isGroup: true,
                layout: this.editorOptions.defaultThingLayout || 'left',
                sExpanded: true,
                pExpanded: true
            };
        }
    }, {
        key: 'createSister',
        value: function createSister(thing) {
            if (!this._editor.canEdit) {
                return null;
            }

            var newLoc = this.layouts.getNewSisterLocation(thing);
            var data = _.extend(this.getNewThingData(), {
                group: thing.data.group,
                text: 'Idea',
                loc: go.Point.stringify(newLoc)
            });
            this._diagram.model.addNodeData(data);
            var newSister = this._diagram.findNodeForData(data);

            // put new sister right after thing (not as the last sibling)
            if (thing.containingGroup) {
                this.moveSiblingNextTo(newSister, thing, RIGHT);
            }
            return newSister;
        }
    }, {
        key: 'createRToSister',
        value: function createRToSister(thing) {
            if (!this._editor.canEdit) {
                return null;
            }

            var thingKey = this._diagram.model.getKeyForNodeData(thing.data);
            //console.log('thingKey: ' + thingKey);
            var newLoc = this.layouts.getNewSisterLocation(thing, true); // withR = true
            var data = _.extend(this.getNewThingData(), {
                group: thing.data.group,
                text: 'Idea',
                loc: go.Point.stringify(newLoc)
            });
            this._diagram.model.addNodeData(data);
            var newSister = this._diagram.findNodeForData(data);
            var groupKey = this._diagram.model.getKeyForNodeData(data);

            // create link
            var linkData = {
                from: thingKey,
                to: groupKey,
                type: 'to',
                fromPort: 'R',
                toPort: 'R'
            };
            this._diagram.model.addLinkData(linkData);

            // put new sister right after thing (not as the last sibling)
            if (thing.containingGroup) {
                this.moveSiblingNextTo(newSister, thing, RIGHT);
            }
            return newSister;
        }
    }, {
        key: 'createChild',
        value: function createChild(thing, name, x, y) {
            if (!this._editor.canEdit) {
                return null;
            }

            var newLoc = this.layouts.getNewChildLocation2(thing);
            if (x || y) {
                newLoc = new go.Point(x, y);
            }
            var data = _.extend(this.getNewThingData(), {
                group: thing.data.key,
                text: name || 'Part',
                loc: go.Point.stringify(newLoc)
            });
            this._diagram.model.addNodeData(data);
            this.layouts.setDescendantLayouts(thing, thing.data.layout);
            var child = this._diagram.findNodeForData(data);
            child.updateTargetBindings();
            return child;
        }
    }, {
        key: 'createRThing',
        value: function createRThing(link, name) {
            if (!this._editor.canEdit) {
                return null;
            }

            // console.log('createRThing, link: ' + link + ', name: ' + name);
            // don't allow multiple R-things
            if (link.isLabeledLink) {
                // console.log('cannot create RThing, link is already labeled');
                return;
            }

            var data = _.extend(this.getNewThingData(), {
                text: name || 'Relationship Idea',
                //isLinkLabel: true,     // deprecated as of goJS 1.3
                category: 'LinkLabel', // new as of goJS 1.3
                loc: '0 0'
            });
            this._diagram.model.startTransaction('create R Thing');
            this._diagram.model.addNodeData(data);
            var key = this._diagram.model.getKeyForNodeData(data);
            var node = this._diagram.findPartForKey(key);
            node.labeledLink = link;
            this._diagram.model.commitTransaction('create R Thing');
            this._diagram.updateAllTargetBindings();

            return this._diagram.findNodeForData(data);
        }
    }, {
        key: 'createThing',

        // ---------- creating things with specified names/locations - for use by generator and tests ------------

        value: function createThing(x, y, name, layout) {
            var group = this._diagram.toolManager.clickCreatingTool.insertPart(new go.Point(x, y));
            this._diagram.model.setDataProperty(group.data, 'text', name);
            if (layout) {
                this._diagram.model.setDataProperty(group.data, 'layout', layout);
            }
            return group;
        }
    }, {
        key: 'createRLinkWithRThing',
        value: function createRLinkWithRThing(thing1, thing2, name) {
            var link = this.createRLink(thing1, thing2);
            return this.createRThing(link, name);
        }
    }, {
        key: 'createRLink',

        // returns the linkData object for the new link
        value: function createRLink(thing1, thing2) {
            this._diagram.model.startTransaction('add link');
            var data = {
                type: 'noArrows',
                from: thing1.data.key,
                to: thing2.data.key,
                fromPort: 'R',
                toPort: 'R'
            };
            this._diagram.model.addLinkData(data);
            this._diagram.model.commitTransaction('add link');
            return this._diagram.findLinkForData(data);
        }
    }, {
        key: 'createPLink',

        // returns the linkData object for the new link
        value: function createPLink(thing1, thing2) {
            this._diagram.model.startTransaction('add link');
            var data = {
                type: 'noArrows',
                from: thing1.data.key,
                to: thing2.data.key,
                fromPort: 'P',
                toPort: 'P',
                category: 'P'
            };
            this._diagram.model.addLinkData(data);
            this._diagram.model.commitTransaction('add link');
            this._diagram.model.setDataProperty(thing1.data, 'pExpanded', true);
            return this._diagram.findLinkForData(data);
        }
    }, {
        key: 'getSelectedGroups',

        // ------------- moving things in the model structure -------------------

        // returns a go.List of the items in the current selection that are Groups
        value: function getSelectedGroups() {
            var it = this._diagram.selection.iterator;
            var members = new go.List();
            while (it.next()) {
                var part = it.value;
                if (part instanceof go.Group) {
                    members.add(part);
                }
            }
            return members;
        }
    }, {
        key: 'addSelectedThingsAsChildrenOf',

        // drag to S
        value: function addSelectedThingsAsChildrenOf(group) {
            var newMembers = this.getSelectedGroups();

            // check existing members so we can calculate layout
            var oldMemberBounds = this.safeRect(this._diagram.computePartsBounds(group.memberParts));

            // NB: this is subject to validation by CommandHandler.isValidMember,
            // so for example, members of members of newMembers will not be added as members
            group.addMembers(newMembers);

            this.layouts.layoutNewMembersRelativeTo(newMembers, group, oldMemberBounds);

            this._diagram.clearSelection();
        }
    }, {
        key: 'addSelectedThingsAsSistersOf',

        // drag to D
        value: function addSelectedThingsAsSistersOf(group) {
            var oldMembers = this.getSelectedGroups();

            // if dragging to top level, move dragged things so they don't overlap the former parent
            if (!group.containingGroup) {
                // check existing members so we can calculate layout
                var oldMembersBounds = this._diagram.computePartsBounds(oldMembers);
                // NB: oldMembers can be on multiple levels, so not clear which level to use for rescaling old members after drag
                var oldMembersLevel = this.layouts.computeLevel(oldMembers.first());

                var it = oldMembers.iterator;
                while (it.next()) {
                    var member = it.value;
                    member.containingGroup = null;
                }
                this.layouts.layoutOldMembersOutsideOf(oldMembers, group, oldMembersBounds, oldMembersLevel);
            }
            // if not dragging to top level, place dragged things after former parent in outline
            else {
                var it2 = oldMembers.iterator;
                while (it2.next()) {
                    var member2 = it2.value;
                    member2.containingGroup = group.containingGroup;
                    this.moveSiblingNextTo(member2, group, RIGHT);
                }
            }
            this._diagram.clearSelection();
        }
    }, {
        key: 'addSelectedThingAsOrderedSisterOf',

        // for dragging parts within a system - side is LEFT or RIGHT (i.e. above or below, resp. in inventory layout)
        value: function addSelectedThingAsOrderedSisterOf(group, side) {
            //console.log('addSelectedThingAsOrderedSisterOf, side: ' + side);
            var thing = this.getUniqueThingSelected();
            if (!thing) {
                return;
            }
            this.moveSiblingNextTo(thing, group, side);
        }
    }, {
        key: 'moveSiblingNextTo',

        // moves the first thing (sibling) to be after the second thing (group)
        // in the part ordering - they are assumed to be siblings
        // side is LEFT or RIGHT
        value: function moveSiblingNextTo(sibling, group, side) {
            var parent = group.containingGroup;
            console.log('moveSiblingNextTo, sibling: ' + sibling + ', group: ' + group + ', parent: ' + parent + ', sibling.containingGroup: ' + sibling.containingGroup);

            if (!parent || sibling.containingGroup !== parent) {
                console.error('Cannot do moveSiblingNextTo on non-siblings or top-level groups');
            }

            // create new member order
            var memberOrder = new go.List();
            var it = parent.memberParts;
            var order = 0;
            while (it.next()) {
                var member = it.value;
                if (member instanceof go.Group) {
                    // we're at the target group, so add the moved thing either before or after it
                    if (member === group) {
                        if (side === LEFT) {
                            memberOrder.add(sibling);
                            this._diagram.model.setDataProperty(sibling.data, 'order', order++);
                            memberOrder.add(member);
                            this._diagram.model.setDataProperty(member.data, 'order', order++);
                        } else {
                            memberOrder.add(member);
                            this._diagram.model.setDataProperty(member.data, 'order', order++);
                            memberOrder.add(sibling);
                            this._diagram.model.setDataProperty(sibling.data, 'order', order++);
                        }
                    }
                    // don't re-add the moved thing, it was added above
                    else if (member !== sibling) {
                        memberOrder.add(member);
                        this._diagram.model.setDataProperty(member.data, 'order', order++);
                    }
                }
            }

            // clear existing members
            var newIt = memberOrder.iterator;
            while (newIt.next()) {
                var member2 = newIt.value;
                member2.containingGroup = null;
            }

            // add new members
            newIt.reset();
            while (newIt.next()) {
                var member3 = newIt.value;
                member3.containingGroup = parent;
            }
        }
    }, {
        key: 'addThingAsRThing',
        value: function addThingAsRThing(thing, link) {
            thing.labeledLink = link;
            thing.updateTargetBindings();
        }
    }, {
        key: 'toggleDFlag',

        // D corner handler (single click)
        value: function toggleDFlag(thing) {
            this._diagram.model.setDataProperty(thing.data, 'dflag', !thing.data.dflag);
            thing.updateTargetBindings();
        }
    }, {
        key: 'toggleSExpansion',

        // S corner handler (single click)
        value: function toggleSExpansion(thing) {
            var isExpanded = !(thing.data && !thing.data.sExpanded); // expand by default if property not present
            this._diagram.model.setDataProperty(thing.data, 'sExpanded', !isExpanded);
            thing.updateTargetBindings();
            this.ui.showCornerTip(thing, 'S');
        }
    }, {
        key: 'togglePExpansion',

        // P corner handler (single click)
        value: function togglePExpansion(thing) {
            this._diagram.model.setDataProperty(thing.data, 'pExpanded', !this.pIsExpanded(thing));
            thing.updateTargetBindings();
            this.ui.showCornerTip(thing, 'P');
        }
    }, {
        key: 'pIsExpanded',
        value: function pIsExpanded(group) {
            return group.data && group.data.pExpanded === true;
        }
    }, {
        key: 'canUndo',

        // ---------------------- undo/redo --------------------

        value: function canUndo() {
            return this._diagram.commandHandler.canUndo();
        }
    }, {
        key: 'undo',
        value: function undo() {
            this._diagram.commandHandler.undo();
            this._diagram.layoutDiagram(true);
        }
    }, {
        key: 'canRedo',
        value: function canRedo() {
            return this._diagram.commandHandler.canRedo();
        }
    }, {
        key: 'redo',
        value: function redo() {
            this._diagram.commandHandler.redo();
            this._diagram.layoutDiagram(true);
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this._diagram.updateAllTargetBindings();
            this._diagram.layoutDiagram(true);
        }
    }, {
        key: 'safeRect',

        // ------------------- utility ----------------------

        // check for a rect with NaN X/Y/W/H coords, so we can do stuff with it such as unionRect
        // (NaN,NaN,0,0) => (0,0,0,0)
        value: function safeRect(rect) {
            if (isNaN(rect.x)) {
                rect.x = 0;
            }
            if (isNaN(rect.y)) {
                rect.y = 0;
            }
            if (isNaN(rect.width)) {
                rect.width = 0;
            }
            if (isNaN(rect.height)) {
                rect.height = 0;
            }
            return rect;
        }
    }, {
        key: 'loadModel',

        // ------------------- debug map model ----------------------
        value: function loadModel() {
            $('#map-model-debug').val(this._diagram.model.toJson());
        }
    }, {
        key: 'saveModel',
        value: function saveModel() {
            this._diagram.model = go.Model.fromJson($('#map-model-debug').val());
            this._diagram.updateAllTargetBindings();
            this._diagram.model.addChangedListener(this.autosave.modelChanged);
            this.autosave.saveOnModelChanged = true;
        }
    }]);

    return Map;
})();

module.exports = Map;

// TODO: turn off in production
//console.log('diagram model:' + this._diagram.model.toJson());

},{"./EditorConfig.js":28}],32:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;

// functions for editing perspectives AND distinctions, which work similarly in the UI

var Perspectives = (function () {
    function Perspectives(editor, map) {
        _classCallCheck(this, Perspectives);

        // temporary state flag for adding/removing P/D selections programmatically
        this.selectingLinkedThings = false;

        this._editor = editor;
        this._map = map;
    }

    _createClass(Perspectives, [{
        key: 'currentTabChanged',
        value: function currentTabChanged(newValue, oldValue) {
            //console.log('Perspectives, currentTabChanged');
            if (newValue === this._map.ui.TAB_ID_PERSPECTIVES) {
                // opening perspectives
                this.setPorDThing('P');
                this._map.setEditingBlocked(true);
            } else if (oldValue === this._map.ui.TAB_ID_PERSPECTIVES) {
                // closing perspectives
                this.saveLinks('P');
                this._map.setEditingBlocked(false);
            } else if (newValue === this._map.ui.TAB_ID_DISTINCTIONS) {
                // opening distinctions
                this.setPorDThing('D');
                this._map.setEditingBlocked(true);
            } else if (oldValue === this._map.ui.TAB_ID_DISTINCTIONS) {
                // closing distinctions
                this.saveLinks('D');
                this._map.setEditingBlocked(false);
            }
        }
    }, {
        key: 'handleDiagramEvent',
        value: function handleDiagramEvent(eventName, e) {
            if (eventName === 'ChangedSelection') {
                if (this._map.ui.currentTabIs(this._map.ui.TAB_ID_PERSPECTIVES) || this._map.ui.currentTabIs(this._map.ui.TAB_ID_DISTINCTIONS)) {
                    this.updateLinks();
                }
            }
        }
    }, {
        key: 'isInPOrDEditorMode',

        // ---------- P/D Editor state

        value: function isInPOrDEditorMode() {
            return this._map.ui.state.perspectivePointKey || this._map.ui.state.distinctionThingKey;
        }
    }, {
        key: 'isInPEditorMode',
        value: function isInPEditorMode() {
            return this._map.ui.state.perspectivePointKey;
        }
    }, {
        key: 'isInDEditorMode',
        value: function isInDEditorMode() {
            return this._map.ui.state.distinctionThingKey;
        }
    }, {
        key: 'isPEditorPoint',
        value: function isPEditorPoint(group) {
            return this._map.ui.state.perspectivePointKey === group.data.key;
        }
    }, {
        key: 'isDEditorThing',
        value: function isDEditorThing(group) {
            return this._map.ui.state.distinctionThingKey === group.data.key;
        }
    }, {
        key: 'setPEditorPoint',

        // NB: this is called via this._map.getCornerFunction, so we get the extra corner arg, which we can ignore
        value: function setPEditorPoint(thing, corner) {
            if (this._editor.canEdit) {
                this._map.ui.openTab(this._map.ui.TAB_ID_PERSPECTIVES);
            }
        }
    }, {
        key: 'setDEditorThing',
        value: function setDEditorThing(thing) {
            if (this._editor.canEdit) {
                // NB: need to select only this thing, since this is invoked
                // by a control-click, which will not automatically select just it
                this._map.getDiagram().clearSelection();
                thing.isSelected = true;
                this._map.ui.openTab(this._map.ui.TAB_ID_DISTINCTIONS);
            }
        }
    }, {
        key: 'isPerspectivePoint',

        // -----------------------

        value: function isPerspectivePoint(group) {
            var links = group.findLinksOutOf();
            while (links.next()) {
                var link = links.value;
                if (link.data.category === 'P') {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'isSelectedPerspectiveView',
        value: function isSelectedPerspectiveView(group) {
            var links = group.findLinksInto();
            while (links.next()) {
                var link = links.value;
                if (link.data.category === 'P' && this._map.pIsExpanded(link.fromNode) && link.fromNode.isSelected) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'isToggledPerspectiveView',
        value: function isToggledPerspectiveView(group) {
            var links = group.findLinksInto();
            while (links.next()) {
                var link = links.value;
                if (link.data.category === 'P' && this._map.pIsExpanded(link.fromNode)) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'isMouseOverPerspectiveView',
        value: function isMouseOverPerspectiveView(group) {
            var links = group.findLinksInto();
            while (links.next()) {
                var link = links.value;
                if (link.data.category === 'P' && link.fromNode === this._map.ui.mouseOverGroup) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'getPerspectiveViewWeight',
        value: function getPerspectiveViewWeight(group) {
            var mode = this._map.ui.getMapEditorOptions().perspectiveMode;
            if (mode === 'spotlight' || mode === 'both') {
                return (this.isSelectedPerspectiveView(group) ? 1 : 0) + (this.isToggledPerspectiveView(group) ? 1 : 0) + (this.isMouseOverPerspectiveView(group) ? 1 : 0);
            } else {
                return 0;
            }
        }
    }, {
        key: 'setPorDThing',

        // -----------------------

        // category is "P" or "D" (perspectives or distinctions)
        value: function setPorDThing(category) {
            // if already set, must do save perspectives or save distinctions
            if (this._map.ui.state.perspectivePointKey || this._map.ui.state.distinctionThingKey) return;

            var thing = this._map.getDiagram().selection.first();
            //console.log('setPorDThing: ' + thing);
            if (thing instanceof go.Group) {
                var key = thing.data.key;
                if (category === 'P') {
                    this._map.ui.state.perspectivePointKey = key;
                } else if (category === 'D') {
                    this._map.ui.state.distinctionThingKey = key;
                }

                // select views/others
                this.selectLinkedThingsFor(thing, category);
            }
        }
    }, {
        key: 'updateLinks',

        // this is called when the selection changes - if the thing is set,
        // adds/removes D/P links according to what is selected; otherwise
        // just shows/hides D/P links for the selected thing(s)
        value: function updateLinks() {
            if (this.selectingLinkedThings) // selection is being changed programmatically, so don't respond
                return;

            var pOrDThing = null;
            var category = null;
            if (this._map.ui.state.perspectivePointKey) {
                pOrDThing = this._map.getDiagram().findNodeForKey(this._map.ui.state.perspectivePointKey);
                category = 'P';
            } else if (this._map.ui.state.distinctionThingKey) {
                pOrDThing = this._map.getDiagram().findNodeForKey(this._map.ui.state.distinctionThingKey);
                category = 'D';
            }

            var addLinksTo = new go.List();
            var removeLinks = new go.List();

            // iterate through all things
            if (category) {
                var layers = this._map.getDiagram().layers;
                while (layers.next()) {
                    var layer = layers.value;
                    var parts = layer.parts;
                    while (parts.next()) {
                        var part = parts.value;
                        if (part instanceof go.Group) {
                            // calculate links to add/remove based on selection
                            if (pOrDThing) {
                                var links = part.findLinksInto();
                                var existingLink = null;
                                while (links.next()) {
                                    var link = links.value;
                                    if (link.fromNode.data.key === pOrDThing.data.key && link.data.category === category) existingLink = link;
                                }

                                // decide whether to add or remove a link to the part, depending on whether
                                // it is selected and whether a link exists
                                if (!existingLink && part.isSelected) addLinksTo.add(part);else if (existingLink && !part.isSelected) removeLinks.add(existingLink);
                            }
                        }
                    }
                }
            }

            // do the adding/removing of links
            var adds = addLinksTo.iterator;
            while (adds.next()) {
                this._map.getDiagram().model.startTransaction('add link');
                var to = adds.value;
                console.log('updateLinks: adding link from ' + pOrDThing + ' to ' + to);
                if (category === 'D' && pOrDThing.data.key === to.data.key) {
                    pOrDThing.isSelected = false;
                    alert('You can\'t distinguish a thing from itself!');
                    continue;
                }
                this._map.getDiagram().model.addLinkData({
                    from: pOrDThing.data.key,
                    to: to.data.key,
                    fromPort: category,
                    toPort: category,
                    category: category
                });
                this._map.getDiagram().model.commitTransaction('add link');
            }
            var removes = removeLinks.iterator;
            while (removes.next()) {
                var remove = removes.value;
                console.log('updateLinks: removing link from ' + remove.fromNode + ' to ' + remove.toNode);
                this._map.getDiagram().model.startTransaction('remove link');
                this._map.getDiagram().remove(remove);
                this._map.getDiagram().model.removeLinkData(remove.data);
                this._map.getDiagram().model.commitTransaction('remove link');
            }

            // show links
            this._map.getDiagram().updateAllTargetBindings();
        }
    }, {
        key: 'saveLinks',
        value: function saveLinks(category) {
            var pOrDThing = null;
            if (category === 'P') {
                pOrDThing = this._map.getDiagram().findNodeForKey(this._map.ui.state.perspectivePointKey);
                this._map.ui.state.perspectivePointKey = null;
            } else if (category === 'D') {
                pOrDThing = this._map.getDiagram().findNodeForKey(this._map.ui.state.distinctionThingKey);
                this._map.ui.state.distinctionThingKey = null;
            }

            this._map.getDiagram().clearSelection();
            this._map.getDiagram().updateAllTargetBindings();
        }
    }, {
        key: 'selectLinkedThingsFor',
        value: function selectLinkedThingsFor(group, category) {
            this.selectingLinkedThings = true;
            this._map.getDiagram().clearSelection();

            var links = group.findLinksOutOf();
            while (links.next()) {
                var link = links.value;
                if (link.data.category === category) link.toNode.isSelected = true;
            }

            this.selectingLinkedThings = false;
        }
    }]);

    return Perspectives;
})();

module.exports = Perspectives;

},{}],33:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;
var SLIDE_BLOCKER_WIDTH = 1000;
var SLIDE_BLOCKER_COLOR = '#fff';
var SLIDE_BLOCKER_OPACITY = 0.9;

// functions for the presenter/slides

var Presenter = (function () {
    function Presenter(editor, map) {
        _classCallCheck(this, Presenter);

        this._editor = editor;
        this._map = map;

        this.currentSlideIndex = null;
        this.isPresenting = false;
        this.showTOC = false;
        this.isCreatingThumbnail = false;

        // mask applied around slide region when presenting
        this.slideBlocker = null;

        this.diagramAspectRatio = null;

        // NB: hasLinks can have values false, 1, or true (1 means only a single link)
        this.slideTypes = [{
            name: 'TITLE_BODY', label: 'Title and Body',
            hasTitle: true, hasNotes: true, hasChecks: false, hasMapRegion: false, hasMapSummary: false, hasLinks: false
        }, {
            name: 'TITLE_BODY_MAP', label: 'Title, Body and MetaMap',
            hasTitle: true, hasNotes: true, hasChecks: false, hasMapRegion: true, hasMapSummary: false, hasLinks: false
        }, {
            name: 'ACTIVITY_MAP', label: 'Lesson Activity and MetaMap',
            hasTitle: true, hasNotes: true, hasChecks: true, hasMapRegion: true, hasMapSummary: false, hasLinks: true
        }, {
            name: 'MAP_ONLY', label: 'MetaMap only',
            hasTitle: true, hasNotes: false, hasChecks: false, hasMapRegion: true, hasMapSummary: false, hasLinks: false
        }, {
            name: 'MAP_SUMMARY', label: 'MetaMap Summary',
            hasTitle: false, hasNotes: false, hasChecks: false, hasMapRegion: true, hasMapSummary: true, hasLinks: false
        }];

        // ------------------ link/attachment types -----------------------
        this.linkTypes = [{ name: '', label: '-- Select attachment type --' }, { name: 'WEB', label: 'Web Page' }, { name: 'PDF', label: 'PDF' }, { name: 'DOC', label: 'Document' }, { name: 'SPREADSHEET', label: 'Spreadsheet' }, { name: 'PRESENTATION', label: 'Presentation' }, { name: 'METAMAP', label: 'MetaMap' }, { name: 'IMAGE', label: 'Image' }, { name: 'AUDIO', label: 'Audio' }, { name: 'VIDEO', label: 'Video' }, { name: 'SURVEY', label: 'Survey' }, { name: 'WORKSHEET', label: 'Worksheet' }];

        // ------------ list of all things in the map, for map summary slides ---------------------
        this.ideaList = '';

        this.summaryAnalytics = [{ name: 'COUNT_THINGS', singularLabel: 'Distinction', pluralLabel: 'Distinctions' }, { name: 'COUNT_SYSTEMS', singularLabel: 'System', pluralLabel: 'Systems' }, { name: 'COUNT_RELATIONSHIPS', singularLabel: 'Relationship', pluralLabel: 'Relationships' }, { name: 'COUNT_PERSPECTIVES', singularLabel: 'Perspective', pluralLabel: 'Perspectives' }, { name: 'COUNT_RTHINGS', singularLabel: 'Relationship Idea', pluralLabel: 'Relationship Ideas' }, { name: 'COUNT_SYSTEM_RTHINGS', singularLabel: 'Relationship System', pluralLabel: 'Relationship Systems' }, { name: 'COUNT_SYSTEM_PERSPECTIVES', singularLabel: 'Perspective System', pluralLabel: 'Perspective Systems' }, { name: 'COUNT_DISTINCTIONS', singularLabel: 'Advanced Distinction', pluralLabel: 'Advanced Distinctions' }];

        this.thumbnailCache = [];
    }

    _createClass(Presenter, [{
        key: 'autosave',
        value: function autosave() {
            this._map.autosave.save('edit_presenter');
        }
    }, {
        key: 'updateIdeaList',

        // ---------- editing functions for different slide types -------------

        // only call this occasionally, as they won't be editing the map while presenter is open
        value: function updateIdeaList() {
            var nodes = this._map.getDiagram().nodes;
            var list = [];
            while (nodes.next()) {
                if (nodes.value instanceof go.Group) {
                    list.push(nodes.value.data.text);
                }
            }
            list.sort();

            // filter out placeholder names - see this._map.js:getNewThingData, createSister, etc.
            list = _.difference(_.uniq(list, true), this._map.generator.getPlaceholderIdeaNames(), ['New Idea', 'New Distinguished Idea', 'New Related Idea', 'New Relationship Idea', 'New Part Idea', 'Idea', 'Part', 'Relationship Idea'] // newer simplified names
            );

            this.ideaList = list.join(', ');
        }
    }, {
        key: 'addCheck',
        value: function addCheck(nodeData) {
            nodeData.checks.push({ text: '' });
            this.autosave();
        }
    }, {
        key: 'deleteCheck',
        value: function deleteCheck(check, nodeData) {
            var i = _.indexOf(nodeData.checks, check);
            nodeData.checks.splice(i, 1);
            this.autosave();
        }
    }, {
        key: 'addLink',
        value: function addLink(nodeData) {
            nodeData.links.push({ title: '', url: '', type: '' });
            this.autosave();
        }
    }, {
        key: 'deleteLink',
        value: function deleteLink(link, nodeData) {
            var i = _.indexOf(nodeData.links, link);
            nodeData.links.splice(i, 1);
            this.autosave();
        }
    }, {
        key: 'toggleTOC',
        value: function toggleTOC() {
            if (this.isPresenting) {
                this.showTOC = !this.showTOC;
            }
        }
    }, {
        key: 'maybeInitSlideBlocker',

        // NB: can't create this in init as the diagram doesn't exist yet...
        value: function maybeInitSlideBlocker() {
            if (!this.slideBlocker) {
                var mk = go.GraphObject.make;
                this.slideBlocker = mk(go.Node, go.Panel.Auto, {
                    layerName: 'Tool',
                    opacity: SLIDE_BLOCKER_OPACITY
                }, mk(go.Shape, 'Rectangle', {
                    fill: null,
                    stroke: SLIDE_BLOCKER_COLOR,
                    strokeWidth: 1000
                }));
                this._map.getDiagram().add(this.slideBlocker);
            }
        }
    }, {
        key: 'currentTabChanged',

        // called when a tab is opened or closed
        value: function currentTabChanged(newValue, oldValue) {
            if (oldValue === this._map.ui.TAB_ID_PRESENTER) {
                // closing tab
                this.stopPresenting();
            } else if (newValue === this._map.ui.TAB_ID_PRESENTER) {
                // opening tab
                // show slides (see layouts.slideTemplate, binding of visible attr)
                this.diagramAspectRatio = $('#diagram').width() / $('#diagram').height();
                console.log('diagramAspectRatio: ' + this.diagramAspectRatio);

                this._map.getDiagram().updateAllTargetBindings();
                this.updateIdeaList();
                if (!this.currentSlideIndex && this.getSlideNodeDatas().length > 0) {
                    this.currentSlideIndex = 1;
                }
                this.slideThumbnailSelected(1);
            }
        }
    }, {
        key: 'handleDiagramEvent',
        value: function handleDiagramEvent(eventName, e) {
            if (!this._map.ui.currentTabIs(this._map.ui.TAB_ID_PRESENTER)) {
                return;
            }

            if (eventName === 'SelectionDeleting') {
                var selection = e.subject;
                if (selection.count === 1) {
                    var thing = selection.first();
                    if (thing instanceof go.Node && thing.data.category === 'slide') {
                        if (!confirm('Delete this slide from the presentation?')) {
                            e.cancel = true;
                        }
                    }
                }
            } else if (eventName === 'SelectionDeleted') {
                // if slide is deleted from canvas rather than by thumbnail x button, need to update indexes
                this.compactSlideIndexes();
            } else if (eventName === 'SelectionMoved' || eventName === 'PartResized') {
                // clear thumbnail cache
                this.thumbnailCache = [];
            } else if (eventName === 'ViewportBoundsChanged') {}
        }
    }, {
        key: 'windowResized',
        get: function () {
            var _this = this;

            if (!this._windowResized) {
                this._windowResized = _.debounce(function () {
                    _this.slideThumbnailSelected(_this.currentSlideIndex);
                }, 1000);
            }
            return this._windowResized;
        }
    }, {
        key: 'showSidebar',
        value: function showSidebar() {
            return this._map.ui.currentTabIs(this._map.ui.TAB_ID_PRESENTER) && (!this.isPresenting || this.showTOC);
        }
    }, {
        key: 'disableMapToolbarButtons',
        value: function disableMapToolbarButtons() {
            return !this._map.ui.currentTabIs(this._map.ui.TAB_ID_PRESENTER) || this.isPresenting || !this.getCurrentSlideType().hasMapRegion;
        }
    }, {
        key: 'getSlideNodeDatas',

        // returns an array of node data objects (not the slide nodes themselves)
        value: function getSlideNodeDatas() {
            var diagram = this._map.getDiagram();
            var nodes = diagram.model.nodeDataArray;
            var nodeDatas = _.filter(nodes, function (node) {
                return node.category === 'slide';
            });
            nodeDatas = _.sortBy(nodeDatas, function (nodeData) {
                return nodeData.index;
            });
            //console.log('getSlideNodeDatas, indexes: ' + _.pluck(slidesData, 'index'));
            return nodeDatas;
        }
    }, {
        key: 'getSlideCount',
        value: function getSlideCount() {
            return this.getSlideNodeDatas().length;
        }
    }, {
        key: 'getActivitySlideCount',
        value: function getActivitySlideCount() {
            return _.where(this.getSlideNodeDatas(), { type: 'ACTIVITY_MAP' }).length;
        }
    }, {
        key: 'getSlideType',
        value: function getSlideType(typeName) {
            return _.findWhere(this.slideTypes, { name: typeName });
        }
    }, {
        key: 'getCurrentSlideType',
        value: function getCurrentSlideType() {
            var slide = this.findSlideByIndex(this.currentSlideIndex);
            if (slide) {
                return _.findWhere(this.slideTypes, { name: slide.data.type });
            } else {
                return {};
            }
        }
    }, {
        key: 'findSlideByIndex',
        value: function findSlideByIndex(index) {
            var diagram = this._map.getDiagram();
            var slideData = _.find(this.getSlideNodeDatas(), function (slideData) {
                return slideData.index === index;
            });
            if (slideData) {
                return diagram.findNodeForKey(slideData.key);
            } else {
                return undefined;
            }
        }
    }, {
        key: 'moveSlide',

        // increment is -1 or +1
        value: function moveSlide(index, increment) {

            var diagram = this._map.getDiagram();
            var slide = this.findSlideByIndex(index);
            var neighbor = this.findSlideByIndex(index + increment);
            if (slide && neighbor) {
                //console.log('moveSlide: swapping ' + slide.data.key + ' with ' + neighbor.data.key);
                diagram.startTransaction('move slide');
                diagram.model.setDataProperty(slide.data, 'index', slide.data.index + increment);
                diagram.model.setDataProperty(neighbor.data, 'index', neighbor.data.index - increment);
                diagram.commitTransaction('move slide');
                this.thumbnailCache = [];
            }
        }
    }, {
        key: 'compactSlideIndexes',
        value: function compactSlideIndexes() {

            //console.log('compactSlideIndexes');
            var slidesData = this.getSlideNodeDatas();
            var diagram = this._map.getDiagram();
            var newIndex = 1;
            diagram.startTransaction('compact slide indexes');
            _.each(slidesData, function (slideData) {
                diagram.model.setDataProperty(slideData, 'index', newIndex);
                //console.log('compactSlideIndexes: set index for ' + slideData.key + ' to ' + newIndex);
                newIndex++;
            });
            diagram.commitTransaction('compact slide indexes');
        }
    }, {
        key: 'getNewSlideKey',
        value: function getNewSlideKey() {
            var diagram = this._map.getDiagram();
            var i = 1;
            while (diagram.model.findNodeDataForKey('slide-' + i)) {
                i++;
            }
            return 'slide-' + i;
        }
    }, {
        key: 'getNewSlideIndex',

        // NB: indexes (and keys?) must be 1-based, otherwise first slide gets screwed up
        // (somewhere the index shows up as '' instead of 0)
        value: function getNewSlideIndex() {
            var slides = this.getSlideNodeDatas();
            return slides.length + 1;
        }
    }, {
        key: 'addSlide',
        value: function addSlide(typeName) {

            console.log('addSlide: ' + typeName);
            var diagram = this._map.getDiagram();

            var db = this._map.computeMapBounds();
            db.inflate(db.width / 20, db.height / 10);
            var newLoc = db.x + ' ' + db.y;
            var newIndex = this.getNewSlideIndex();

            var slideType = _.findWhere(this.slideTypes, { name: typeName });

            diagram.startTransaction('add slide');
            diagram.model.addNodeData({
                key: this.getNewSlideKey(),
                category: 'slide',
                index: newIndex,
                isGroup: false,
                width: db.width,
                height: db.height,
                loc: newLoc,
                level: 0,
                children: 0,
                type: typeName,
                title: '',
                notes: '',
                checks: [],
                hasRegion: slideType.hasMapRegion,
                isSummary: slideType.hasMapSummary,
                links: []
            });
            diagram.commitTransaction('add slide');
            this.thumbnailCache = [];

            this.slideThumbnailSelected(newIndex); // trigger display of edit form, zoom to map region if applicable
        }
    }, {
        key: 'duplicateSlide',
        value: function duplicateSlide(index) {

            var diagram = this._map.getDiagram();
            var newIndex = this.getNewSlideIndex();
            var slide = this.findSlideByIndex(index);
            if (slide) {
                diagram.startTransaction('duplicate slide');

                // bump up indexes on subsequent slides to make room for new slide after current one
                _.each(this.getSlideNodeDatas(), function (slideData) {
                    if (slideData.index > index) {
                        diagram.model.setDataProperty(slideData, 'index', slideData.index + 1);
                    }
                });

                // NB: creating a new nodeData object here rather than copying and modifying, to avoid copying $$hashKey (??)
                diagram.model.addNodeData({
                    key: this.getNewSlideKey(),
                    category: 'slide',
                    index: index + 1,
                    isGroup: false,
                    width: slide.data.width,
                    height: slide.data.height,
                    loc: slide.data.loc,
                    level: 0,
                    children: 0,
                    type: slide.data.type,
                    title: slide.data.title + ' (Copy)',
                    notes: slide.data.notes,
                    checks: slide.data.checks, // clone?
                    hasRegion: slide.data.hasRegion,
                    isSummary: slide.data.isSummary,
                    links: slide.data.links // clone?
                });
                diagram.commitTransaction('duplicate slide');
                this.thumbnailCache = [];
            }
        }
    }, {
        key: 'removeSlide',
        value: function removeSlide(index) {

            //console.log('removeSlide: ' + index);
            var diagram = this._map.getDiagram();
            var slide = this.findSlideByIndex(index);
            if (slide) {
                diagram.startTransaction('remove slide');
                diagram.model.removeNodeData(slide.data);
                diagram.commitTransaction('remove slide');
            }
            this.currentSlideIndex = null;
            this.thumbnailCache = [];
            this.compactSlideIndexes();
        }
    }, {
        key: 'getSlideThumbnail',
        value: function getSlideThumbnail(index) {
            return this.thumbnailCache[index];
        }
    }, {
        key: 'createSlideThumbnails',
        value: function createSlideThumbnails() {
            var _this2 = this;

            _.each(this.getSlideNodeDatas(), function (nd) {
                _this2.createSlideThumbnail(nd.index);
            });
        }
    }, {
        key: 'createSlideThumbnail',
        value: function createSlideThumbnail(index) {
            //console.log('createSlideThumbnail');

            var thumbWidth = 1000;
            var thumbHeight = 600;
            var diagram = this._map.getDiagram();

            var slide = this.findSlideByIndex(index);
            if (!slide) {
                return '';
            } else if (!slide.data.hasRegion && !slide.data.isSummary) {
                return '';
            } else {
                var db = diagram.documentBounds;
                var sb = undefined;
                if (slide.data.isSummary) {
                    // for a summary slide we shoot the whole map
                    sb = this._map.safeRect(this._map.computeMapBounds());
                } else {
                    // otherwise just shoot the slide region
                    sb = slide.part.actualBounds;
                }

                var imagePosition = new go.Point(sb.x, sb.y);
                //console.log('getSlideThumbnail, slide bounds: ' + sb + ', document bounds: ' + db + ', imagePosition: ' + imagePosition);

                var wScale = thumbWidth / sb.width;
                var hScale = thumbHeight / sb.height;
                var thumbScale = Math.min(wScale, hScale);
                console.log('scale: ' + wScale + ',' + hScale);

                var w = thumbScale * sb.width;
                var h = thumbScale * sb.height;
                //console.log('thumbnail w/h: ' + w + ',' + h);

                // hide slides temporarily while creating thumbnail
                this.isCreatingThumbnail = true;
                diagram.updateAllTargetBindings();

                diagram.scale = thumbScale;

                var imgData = diagram.makeImageData({
                    size: new go.Size(w, h),
                    position: imagePosition,
                    scale: thumbScale
                });

                this.isCreatingThumbnail = false;
                diagram.updateAllTargetBindings();

                this.thumbnailCache[index] = imgData;

                return imgData;
            }
        }
    }, {
        key: 'getMapThumbnail',

        // gets a thumbnail of the whole map, for saving (see autosave.js)
        value: function getMapThumbnail() {

            var diagram = this._map.getDiagram();
            var sb = this._map.safeRect(this._map.computeMapBounds());
            sb.grow(10, 10, 10, 10);
            var w = 150;
            var h = 100;

            // hide slides temporarily while creating thumbnail
            this.isCreatingThumbnail = true;
            diagram.updateAllTargetBindings();

            var imgData = diagram.makeImageData({
                scale: Math.min(h / sb.height, w / sb.width),
                position: new go.Point(sb.x, sb.y),
                size: new go.Size(w, h)
            });

            this.isCreatingThumbnail = false;
            diagram.updateAllTargetBindings();

            return imgData;
        }
    }, {
        key: 'slideThumbnailSelected',

        // called via ng-click on thumbnail
        value: function slideThumbnailSelected(index) {
            //console.log('slideThumbnailSelected: ' + index);
            var diagram = this._map.getDiagram();
            var slide = this.findSlideByIndex(index);

            // NB: order of statements is important here, as selectSlide can trigger changedSelection with an empty selection sometimes... ??
            this.selectSlide(index);
            this.currentSlideIndex = index;
            diagram.updateAllTargetBindings(); // show/hide slide nodes - see templates.js: slideTemplate

            if (slide) {
                this.zoomToSlideInCenter(slide);

                if (this.isPresenting) {
                    this.showTOC = false;
                }
            }
        }
    }, {
        key: 'needsNarrowCanvas',
        value: function needsNarrowCanvas() {
            var slide = this.findSlideByIndex(this.currentSlideIndex);
            return this._map.ui.currentTabIs(this._map.ui.TAB_ID_PRESENTER) && slide != null && (slide.data.type === 'TITLE_BODY_MAP' || slide.data.type === 'ACTIVITY_MAP' || slide.data.type === 'MAP_SUMMARY');
        }
    }, {
        key: 'selectSlide',

        // sets the slide node as selected in the diagram.
        value: function selectSlide(index) {

            //console.log('select slide: ' + index);
            var diagram = this._map.getDiagram();
            diagram.clearSelection();
            if (index) {
                var slide = this.findSlideByIndex(index);
                if (slide) {
                    slide.isSelected = true;
                }
            }
            // TODO: scroll to slide?
        }
    }, {
        key: 'playSlide',
        value: function playSlide(index) {
            var diagram = this._map.getDiagram();
            this._map.ui.openTab(this._map.ui.TAB_ID_PRESENTER);

            var slides = this.getSlideNodeDatas();
            if (slides.length) {
                this.showTOC = false;
                this.presentSlide(index);
            }
        }
    }, {
        key: 'advanceSlide',

        // increment is -1 or +1
        value: function advanceSlide(increment) {
            //console.log('advanceSlide, currentSlideIndex: ' + this.currentSlideIndex);

            var slide = this.findSlideByIndex(this.currentSlideIndex);
            if (slide) {
                this.currentSlideIndex += increment;
                if (this.isPresenting) {
                    this.presentSlide(this.currentSlideIndex);
                }
            }
        }
    }, {
        key: 'presentSlide',
        value: function presentSlide(index) {
            //console.log('presentSlide');

            var diagram = this._map.getDiagram();
            var slide = this.findSlideByIndex(index);
            if (!slide) {
                return;
            }

            diagram.clearSelection();
            // NB: need to set this after clearSelection, as that will set it to null! (see changedSelection)
            this.currentSlideIndex = index;
            this._map.setEditingBlocked(true);
            //console.log('presentSlide, index: ' + index + ', slide: ' + slide + ', currentSlideIndex: ' + this.currentSlideIndex);

            this.maybeInitSlideBlocker();
            var blockerW = SLIDE_BLOCKER_WIDTH;

            if (slide.data.hasRegion) {
                this.zoomToSlideInCenter(slide);

                // show slide blocker
                this.slideBlocker.desiredSize = new go.Size(slide.actualBounds.width + 2 * blockerW, slide.actualBounds.height + 2 * blockerW);
                this.slideBlocker.location = new go.Point(slide.actualBounds.x - blockerW, slide.actualBounds.y - blockerW);
                this.slideBlocker.visible = true;
                //console.log('slideBlocker: ' + this.slideBlocker.actualBounds);
            } else if (slide.data.isSummary) {
                this.zoomToSlideInCenter(slide);
                this.slideBlocker.visible = false;
            } else {
                this._map.ui.resetZoom();
                this.slideBlocker.visible = false;
            }

            this.isPresenting = true;
            $('body').addClass('presenter-playing');

            this._map.getDiagram().updateAllTargetBindings(); // hide slide nodes - see templates.js: slideTemplate
        }
    }, {
        key: 'zoomToSlideInCenter',

        // zoom the diagram to show the given slide in the center of the canvas
        value: function zoomToSlideInCenter(slide) {
            var _this3 = this;

            var diagram = this._map.getDiagram();

            window.setTimeout(function () {

                var halfWidth = slide.data.type !== 'MAP_ONLY';
                var zoomRect = _this3.getLetterboxedRect(slide.actualBounds, halfWidth);
                zoomRect.inflate(zoomRect.width / 10, zoomRect.height / 10);
                diagram.zoomToRect(zoomRect, go.Diagram.Uniform);
            }, 100);
        }
    }, {
        key: 'getLetterboxedRect',

        // Returns a rectangle containing the given rect, but with appropriate width or height added
        // to give it same aspect ratio as the diagram.
        value: function getLetterboxedRect(rect, halfWidth) {

            // NB: we calculate the aspect ratio when the tab is opened,
            // rather than each time as the diagram size might be changing...
            var dar = halfWidth ? this.diagramAspectRatio / 2 : this.diagramAspectRatio;
            console.log('rect: ' + rect + ', dar: ' + dar);

            var rectAspectRatio = rect.width / rect.height;

            if (dar > rectAspectRatio) {
                // tall skinny rect, short wide target AR, so add side padding to the rect
                var lbw = rect.height * dar; // because lbw / lbh == dar == lbw / rect.height (lbh == rect.height)
                return rect.copy().inflate((lbw - rect.width) / 2, 0); // add half the width difference to each side of the rect
            } else {
                // short wide rect, tall skinny target AR, so add top/bottom padding to the rect
                var lbh = rect.width / dar; // because lbw / lbh == dar == lbh / rect.width (lbw == rect.width)
                return rect.copy().inflate(0, (lbh - rect.height) / 2); // add half the height difference to top/bottom of the rect
            }
        }
    }, {
        key: 'stopPresenting',
        value: function stopPresenting() {

            //console.log('stopPresenting, currentSlideIndex: ' + this.currentSlideIndex);
            var diagram = this._map.getDiagram();

            if (this.slideBlocker) {
                this.slideBlocker.visible = false;
            }

            //this.currentSlideIndex = null;
            this.isPresenting = false;
            $('body').removeClass('presenter-playing');

            this._map.getDiagram().updateAllTargetBindings(); // show slide nodes

            diagram.clearSelection();
            this._map.setEditingBlocked(false);
            //this._map.ui.resetZoom();
        }
    }]);

    return Presenter;
})();

module.exports = Presenter;

// adjust zooming of map region
//this.windowResized();

},{}],34:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;
var SlideTemplate = require('./templates/SlideTemplate.js');
var GroupTemplate = require('./templates/GroupTemplate.js');
var LinkTemplate = require('./templates/LinkTemplate.js');
var PLinkTemplate = require('./templates/PLinkTemplate.js');
var dLinkTemplate = require('./templates/dLinkTemplate.js');

// convenient abbreviation for creating templates
var mk = go.GraphObject.make;

var colorR = '#4cbfc2';
var colorP = '#fbaa36';

// footer for image export
var _exportFooter = null;

// goJS templates used in the editor

var Templates = (function () {
    function Templates(editor, map) {
        _classCallCheck(this, Templates);

        this._editor = editor;
        this._map = map;

        this.slideTemplate = new SlideTemplate(map);
        this.groupTemplate = new GroupTemplate(map);
        this.linkTemplate = new LinkTemplate(map);
        this.pLinkTemplate = new PLinkTemplate(map);
        this.dLinkTemplate = dLinkTemplate(map);
    }

    _createClass(Templates, [{
        key: 'initTemplates',
        value: function initTemplates(diagram) {
            var _this = this;

            diagram.groupTemplate = this.groupTemplate.init();
            diagram.nodeTemplate = this.slideTemplate.init();
            diagram.linkTemplate = this.linkTemplate.init();
            diagram.linkTemplateMap.add('P', this.pLinkTemplate);
            diagram.linkTemplateMap.add('D', this.dLinkTemplate);

            this.setTemporaryLinkTemplates(diagram.toolManager.linkingTool);
            this.setTemporaryLinkTemplates(diagram.toolManager.relinkingTool);

            diagram.toolManager.linkingTool.portTargeted = function (realnode, realport, tempnode, tempport, toend) {
                _this.handlePortTargeted(diagram.toolManager.linkingTool, realnode, realport, tempnode, tempport, toend);
            };

            diagram.toolManager.relinkingTool.portTargeted = function (realnode, realport, tempnode, tempport, toend) {
                _this.handlePortTargeted(diagram.toolManager.relinkingTool, realnode, realport, tempnode, tempport, toend);
            };

            diagram.toolManager.relinkingTool.updateAdornments = function (part) {
                go.RelinkingTool.prototype.updateAdornments.call(_this, part);
                var from = part.findAdornment('RelinkFrom');
                var to = part.findAdornment('RelinkTo');
                // if (from)
                //     console.log('relinkfrom: ' + from.part.width);
            };

            diagram.toolManager.linkingTool.linkValidation = this.validateLink;
            diagram.toolManager.relinkingTool.linkValidation = this.validateLink;
        }
    }, {
        key: 'setTemporaryLinkTemplates',

        // ----------- temporary link/node templates, for use when dragging to create R/P lines -------------

        // define initial temporary link templates - these will be modified when handlePortTargeted is called
        value: function setTemporaryLinkTemplates(tool) {
            tool.temporaryLink = this.makeTemporaryLinkTemplate();
            tool.temporaryFromNode = this.makeTemporaryNodeTemplate();
            tool.temporaryToNode = this.makeTemporaryNodeTemplate();
        }
    }, {
        key: 'makeTemporaryLinkTemplate',
        value: function makeTemporaryLinkTemplate() {
            return mk(go.Link, {
                layerName: 'Tool'
            }, mk(go.Shape, {
                name: 'linkshape',
                strokeWidth: 2
            }));
        }
    }, {
        key: 'makeTemporaryNodeTemplate',
        value: function makeTemporaryNodeTemplate() {
            return mk(go.Group, {
                layerName: 'Tool'
            }, mk(go.Shape, 'Border', {
                name: 'border',
                strokeWidth: 3,
                fill: null
            }));
        }
    }, {
        key: 'handlePortTargeted',

        // change color and portId of temporary link templates based on the type of link being created/relinked
        value: function handlePortTargeted(tool, realnode, realport, tempnode, tempport, toend) {
            // console.log('portTargeted, realport: ' + (realport ? realport.name : '') + ', tempport: ' + (tempport ? tempport.name : '')
            //     + ', originalFromPort: ' + (ltool.originalFromPort ? ltool.originalFromPort.name : '') + ', originalToPort: ' + ltool.originalToPort);

            var linkShape = tool.temporaryLink.findObject('linkshape');
            var fromBorder = tool.temporaryFromNode.findObject('border');
            var toBorder = tool.temporaryToNode.findObject('border');

            if (tool.originalFromPort && tool.originalFromPort.name === 'cornerPShape') {
                linkShape.stroke = colorP;
                fromBorder.stroke = colorP;
                toBorder.stroke = colorP;
                fromBorder.portId = 'P';
                toBorder.portId = 'P';
            } else if (tool.originalFromPort && tool.originalFromPort.name === 'cornerRShape') {
                linkShape.stroke = colorR;
                fromBorder.stroke = colorR;
                toBorder.stroke = colorR;
                fromBorder.portId = 'R';
                toBorder.portId = 'R';
            }
            tempnode.scale = this._map.layouts.getScale(realnode);
        }
    }, {
        key: 'validateLink',

        // prevent duplicate 'P' links in the same direction between the same two things
        value: function validateLink(fromNode, fromPort, toNode, toPort) {
            // the P port is on top of the R port, so both P and R links get the toPort set to R by default.
            if (fromPort.portId === 'P') {
                // NB: findLinksTo would be simpler, but it doesn't seem to work... (?)
                var pLinks = toNode.findLinksBetween(fromNode, 'P', 'P');
                //console.log('validateLink, pLinks from ' + fromNode + ':' + fromPort + ' to ' + toNode + ':' + toPort + ' = ' + pLinks.count);
                if (pLinks.count) {
                    while (pLinks.next()) {
                        var pLink = pLinks.value;
                        if (pLink.fromNode === fromNode && pLink.toNode === toNode) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    }, {
        key: 'createExportFooter',

        // ------------------- export footer ----------------------

        // NB: this is not a template per se, in that it is added to the diagram
        // statically, rather than being bound to something in the model.
        // But we put it here because it is about creating parts and stuff.

        value: function createExportFooter() {
            return mk(go.Node, go.Panel.Spot, {
                layerName: 'Foreground',
                location: new go.Point(0, 0),
                scale: 1,
                opacity: 0,
                pickable: false,
                selectable: false
            }, mk(go.Shape, 'Rectangle', {
                name: 'rectangle',
                height: 60,
                fill: null,
                stroke: null
            }), mk(go.Picture, {
                source: 'assets/img/metamap-logo-50.png',
                alignment: go.Spot.TopLeft,
                alignmentFocus: go.Spot.TopLeft,
                width: 195,
                height: 50
            }), mk(go.TextBlock, {
                text: 'metamap.cabreraresearch.org',
                alignment: go.Spot.BottomLeft,
                alignmentFocus: go.Spot.BottomLeft,
                width: 200
            }), mk(go.TextBlock, {
                name: 'mapTitle',
                text: '',
                textAlign: 'right',
                alignment: go.Spot.TopRight,
                alignmentFocus: go.Spot.TopRight,
                width: 300
            }), mk(go.TextBlock, {
                name: 'authorName',
                text: '',
                textAlign: 'right',
                alignment: go.Spot.BottomRight,
                alignmentFocus: go.Spot.BottomRight,
                width: 300
            }));
        }
    }, {
        key: 'addExportFooter',

        // creates or refreshes the footer logo/text that is displayed in the image export
        value: function addExportFooter() {
            if (!_exportFooter) {
                _exportFooter = this.createExportFooter();
                this._map.getDiagram().add(_exportFooter);
            }
        }
    }, {
        key: 'showExportFooter',
        value: function showExportFooter() {
            var rect = this._map.computeMapBounds();
            // put footer at least 100 px below bottom of map; make it at least 500px wide
            var x = rect.x;
            var y = rect.y + rect.height + Math.max(100, rect.height / 5);
            var w = Math.max(500, rect.width);
            //console.log('showExportFooter, bounds rect: ' + rect + ', w: ' + w);
            _exportFooter.location = new go.Point(x, y);
            _exportFooter.findObject('rectangle').width = w;
            _exportFooter.findObject('mapTitle').text = 'Map Title: ' + this._editor.mapTitle;
            _exportFooter.findObject('authorName').text = 'Author: ' + this._editor.userName;
            _exportFooter.opacity = 1;
            _exportFooter.invalidateLayout();
        }
    }, {
        key: 'hideExportFooter',
        value: function hideExportFooter() {
            _exportFooter.opacity = 0;
        }
    }]);

    return Templates;
})();

module.exports = Templates;

},{"./templates/GroupTemplate.js":44,"./templates/LinkTemplate.js":45,"./templates/PLinkTemplate.js":46,"./templates/SlideTemplate.js":47,"./templates/dLinkTemplate.js":48}],35:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TABS = require('../constants/tabs.js');
var go = window.go;

var UI = (function () {
    function UI(editor, map) {
        _classCallCheck(this, UI);

        this.map = map;
        this.editor = editor;

        this.zoomingToRegion = false;

        this.mouseOverGroup = null;
        this.mouseOverLink = null;

        this.dragTargetGroup = null;
        this.dragTargetPosition = null;

        this.helpTip = null;
        this.state = {};

        this._cornerClicked = null;
        this._cornerFunction = null;
        this._cornerTimeout = 300;
    }

    _createClass(UI, [{
        key: 'currentTabChanged',

        // ----------- handle bottom tabs ('sliders') -------------

        // in the following functions, ID is e.g. 'history-tab' (ID of one of the .bottom-tab's)

        // this is called by map.currentTabChanged, which is triggered by a this.$watch
        value: function currentTabChanged(newValue, oldValue) {
            //console.log('ui, currentTabChanged: ' + newValue);
            this.state.currentTab = newValue;
        }
    }, {
        key: 'currentTabIs',
        value: function currentTabIs(tabID) {
            return this.currentTab === tabID;
        }
    }, {
        key: 'openTab',
        value: function openTab(tabID) {
            this.currentTab = tabID;
        }
    }, {
        key: 'closeTab',
        value: function closeTab(tabID) {
            this.state.currentTab = null; // TODO: trigger autosave
            this.currentTab = null;
        }
    }, {
        key: 'disableTab',
        value: function disableTab(tabID) {
            // prevent opening other tabs when in P or D editor
            if (this.currentTab === TABS.TAB_ID_PERSPECTIVES || this.currentTab === TABS.TAB_ID_DISTINCTIONS) {
                return true;
            }
            return false;
        }
    }, {
        key: 'toggleTab',
        value: function toggleTab(tabID) {
            if (this.currentTab === tabID) {
                this.currentTab = null;
            } else if (!this.disableTab(tabID)) {
                this.currentTab = tabID;
            }
        }
    }, {
        key: 'toggleNavigator',
        value: function toggleNavigator() {
            this.state.showNavigator = !this.state.showNavigator;
        }
    }, {
        key: 'toggleZoomingToRegion',
        value: function toggleZoomingToRegion() {
            this.zoomingToRegion = !this.zoomingToRegion;
        }
    }, {
        key: 'getStateData',
        value: function getStateData() {}
    }, {
        key: 'setStateData',
        value: function setStateData() {}
    }, {
        key: 'canZoomIn',

        // ----------------- zooming functions -------------------
        value: function canZoomIn() {
            return this.map.getDiagram().scale < 32;
        }
    }, {
        key: 'canZoomOut',
        value: function canZoomOut() {
            return this.map.getDiagram().scale > 0.25;
        }
    }, {
        key: 'zoomIn',
        value: function zoomIn() {
            var diagram = this.map.getDiagram();
            if (diagram.scale < 32) {
                var vb = diagram.viewportBounds.copy();
                diagram.scale = diagram.scale * 2;
                diagram.centerRect(vb);
            }
        }
    }, {
        key: 'zoomOut',
        value: function zoomOut() {
            var diagram = this.map.getDiagram();
            if (diagram.scale > 0.25) {
                var vb = diagram.viewportBounds.copy();
                diagram.scale = diagram.scale / 2;
                diagram.centerRect(vb);
            }
        }
    }, {
        key: 'maybeZoomToRegion',
        value: function maybeZoomToRegion() {
            var diagram = this.map.getDiagram();
            // this flag is set by the toolbar button
            if (this.zoomingToRegion) {
                this.zoomingToRegion = false;
                console.log('zoomToRegion, selection count: ' + diagram.selection.count);
                var rect = diagram.computePartsBounds(diagram.selection);
                diagram.zoomToRect(rect);
            }
        }
    }, {
        key: 'resetZoom',
        value: function resetZoom() {
            var diagram = this.map.getDiagram();
            //let rect = diagram.computePartsBounds(diagram.nodes).copy();
            var rect = this.map.safeRect(this.map.computeMapBounds());
            //console.log('resetZoom, bounds: ' + rect);
            if (rect.width) {
                rect.inflate(rect.width / 5, rect.height / 5);
            }
            diagram.zoomToRect(rect);
            diagram.alignDocument(go.Spot.Center, go.Spot.Center);
            if (diagram.scale > 1) {
                diagram.scale = 1;
            }
        }
    }, {
        key: 'getSelectedThingsOrDefaultLayout',

        // ------------ thing options (layout) ----------------

        value: function getSelectedThingsOrDefaultLayout() {
            var sl = this.getSelectedThingsLayout();
            if (sl) {
                return sl;
            } else {
                return mapEditorOptions.defaultThingLayout;
            }
        }
    }, {
        key: 'getSelectedThingsLayout',

        // returns a non-null value only if all selected items are groups with the same layout
        value: function getSelectedThingsLayout() {
            var diagram = this.map.getDiagram();
            if (!diagram || diagram.selection.count < 1) return null;

            var layout = null;
            var it = diagram.selection.iterator;
            while (it.next()) {
                if (!it.value instanceof go.Group) return null;
                var group = it.value;
                //console.log('getSelectedThingsLayout, it.value: ' + group);
                var groupLayout = group.data ? group.data.layout : null;
                if (layout !== null && groupLayout !== layout) return null;
                layout = groupLayout;
            }
            //console.log('getSelectedThingsLayout: ' + layout);

            return layout;
        }
    }, {
        key: 'setSelectedThingsLayout',

        // sets the layout of all selected things to the given layout
        value: function setSelectedThingsLayout(layoutName) {
            var diagram = this.map.getDiagram();
            var it = diagram.selection.iterator;
            while (it.next()) {
                if (it.value instanceof go.Group) {
                    var group = it.value;
                    diagram.model.setDataProperty(group.data, 'layout', layoutName);
                    this.map.layouts.setDescendantLayouts(group, group.data.layout);
                    this.map.refresh();
                }
            }
        }
    }, {
        key: 'getSelectedRelationshipsOrDefaultDirection',

        // ------------ relationship options (direction) ----------------

        value: function getSelectedRelationshipsOrDefaultDirection() {
            var sd = this.getSelectedRelationshipsDirection();
            if (sd) {
                return sd;
            } else {
                return mapEditorOptions.defaultRelationshipDirection;
            }
        }
    }, {
        key: 'getSelectedRelationshipsDirection',

        // returns a non-null value only if all selected items are relationships with the same direction
        value: function getSelectedRelationshipsDirection() {
            var diagram = this.map.getDiagram();
            if (!diagram || diagram.selection.count < 1) return null;

            var type = null;
            var it = diagram.selection.iterator;
            while (it.next()) {
                if (!it.value instanceof go.Link) return null;
                var link = it.value;
                var linkType = link.data ? link.data.type : null;
                if (type !== null && linkType !== type) return null;
                type = linkType;
            }

            return type;
        }
    }, {
        key: 'setSelectedRelationshipsDirection',

        // sets the direction of all selected relationships to the given direction
        value: function setSelectedRelationshipsDirection(direction) {
            var diagram = this.map.getDiagram();
            //diagram.model.startTransaction('change relationship direction');
            var it = diagram.selection.iterator;
            while (it.next()) {
                if (it.value instanceof go.Link) {
                    //diagram.model.startTransaction('change link type');
                    diagram.model.setDataProperty(it.value.data, 'type', direction);
                    //diagram.model.commitTransaction('change link type');
                }
            }
            //diagram.commitTransaction('change relationship direction');
        }
    }, {
        key: 'handleCornerClick',

        // ------- handle corner clicks and double clicks --------
        value: function handleCornerClick(corner, thing) {
            var _this = this;

            //console.log('handleCornerClick: corner = ' + corner + ', cornerClicked = ' + _cornerClicked);
            // assume it's a single click, and set handler
            this._cornerClickedCnt = 1;
            var _cornerFunction = this.getCornerFunction(corner, this._cornerClickedCnt);
            // already clicked, so it's a double click; change handler
            if (this._cornerClicked === corner) {
                this._cornerClickedCnt += 1;
                _cornerFunction = this.getCornerFunction(corner, this._cornerClickedCnt);
                console.log('handleCornerClick: double click on ' + corner);
                return;
            }
            // remember that at least one click has happened for the current corner
            this._cornerClicked = corner;

            // set timer to invoke whatever handler we have ready to go (unless another click happens within the interval)
            var timer = setTimeout(function () {
                // ding! invoke it
                if (_cornerFunction === _this.showCornerTip) {
                    _this.showCornerTip(thing, corner);
                } else {
                    _this.execCornerFunction(corner, _this._cornerClickedCnt, thing); // don't pass the corner arg to things like createChild that have a different second arg
                }
                _this._cornerClickedCnt = 0;
                _this._cornerClicked = null;
            }, this._cornerTimeout);
        }
    }, {
        key: 'execCornerFunction',
        value: function execCornerFunction(corner, clicks) {
            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            if (corner === 'D') {
                var _map;

                return clicks === 1 ? this.showCornerTip.apply(this, args) : (_map = this.map).createSister.apply(_map, args);
            } else if (corner === 'S') {
                var _map2, _map3;

                return clicks === 1 ? (_map2 = this.map).toggleSExpansion.apply(_map2, args) : (_map3 = this.map).createChild.apply(_map3, args);
            } else if (corner === 'R') {
                var _map4;

                return clicks === 1 ? this.showCornerTip.apply(this, args) : (_map4 = this.map).createRToSister.apply(_map4, args);
            } else if (corner === 'P') {
                var _map5, _map$perspectives;

                return clicks === 1 ? (_map5 = this.map).togglePExpansion.apply(_map5, args) : (_map$perspectives = this.map.perspectives).setPEditorPoint.apply(_map$perspectives, args);
            } else if (corner === '') {
                // click on text
                return clicks === 1 ? this.showCornerTip.apply(this, args) : this.editText.apply(this, args);
            } else {
                return function () {
                    console.log('getCornerFunction: no function found for corner: ' + corner + '!');
                };
            }
        }
    }, {
        key: 'getCornerFunction',
        value: function getCornerFunction(corner, clicks) {
            if (corner === 'D') {
                return clicks === 1 ? this.showCornerTip : this.map.createSister;
            } else if (corner === 'S') {
                return clicks === 1 ? this.map.toggleSExpansion : this.map.createChild;
            } else if (corner === 'R') {
                return clicks === 1 ? this.showCornerTip : this.map.createRToSister;
            } else if (corner === 'P') {
                return clicks === 1 ? this.map.togglePExpansion : this.map.perspectives.setPEditorPoint;
            } else if (corner === '') {
                // click on text
                return clicks === 1 ? this.showCornerTip : this.editText;
            } else {
                return function () {
                    console.log('getCornerFunction: no function found for corner: ' + corner + '!');
                };
            }
        }
    }, {
        key: 'editText',

        // NB: in this case the thing is actually the TextBox, except in outline layout it is a Panel if the box is double-clicked...
        value: function editText(thing, corner) {
            if (!this.canEdit) {
                return null;
            }

            console.log('editText, thing: ' + thing);
            if (thing instanceof go.Panel) {
                // outline layout
                var part = thing.part;
                console.log('editText, part: ' + part);
                if (part instanceof go.Group && part.data && (part.data.layout === 'left' || part.data.layout === 'right')) {
                    var textBlockName = 'externaltext-' + part.data.layout;
                    var text = thing.part.findObject(textBlockName);
                    if (text) {
                        thing = text;
                    }
                }
            }
            this.map.getDiagram().commandHandler.editTextBlock(thing);
        }
    }, {
        key: 'showCornerTip',

        // ---------------- help tip functions - see also user.js, views/maps/help_tab ---------------

        // shows thingTip or one of the cornerXTips
        value: function showCornerTip(thing, corner) {
            //console.log('showCornerTip');
            if (corner === '') {
                this.showHelpTip('thingTip');
            } else {
                this.showHelpTip('corner' + corner + 'Tip');
            }
        }
    }, {
        key: 'showHelpTip',
        value: function showHelpTip(tip) {
            var _this2 = this;

            //console.log('showHelpTip: ' + tip);

            // don't show help if in presenter
            if (this.currentTabIs(TABS.TAB_ID_PRESENTER)) {
                return;
            }

            this.helpTip = tip;
            //this.safeApply();
            $('#help-tip').show();

            setTimeout(function () {
                $('#help-tip').fadeOut(500, function () {
                    _this2.helpTip = null;
                    //this.safeApply();
                });
            }, 5000);
        }
    }]);

    return UI;
})();

module.exports = UI;

},{"../constants/tabs.js":19}],36:[function(require,module,exports){
// functions handling editor autosave function
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $http = {
    put: function put() {
        return new Promise(function (fulfill, reject) {});
    }
};

var changeDescriptions = {
    move: 'Moved Objects',
    undo_redo: 'Performed Undo/Redo',
    edit_title: 'Edited MetaMap Title',
    edit_description: 'Edited MetaMap Description',
    edit_usertags: 'Edit MetaMap Tags',
    edit_d: 'Edited Distinctions',
    edit_s: 'Edited Systems',
    edit_r: 'Edited Relationships',
    edit_p: 'Edited Perspectives',
    add_thing: 'Added Ideas',
    rename_thing: 'Renamed Ideas',
    delete_thing: 'Deleted Ideas',
    edit_attachments: 'Edited Attachments',
    edit_presenter: 'Edited Presenter Slides',
    edit_generator: 'Inserted Ideas from ThinkQuery',
    edit_standards: 'Edited Links to Common Core Standards'
};

var go = window.go;

var Autosave = (function () {
    function Autosave(editor, map) {
        _classCallCheck(this, Autosave);

        this._editor = editor;
        this._map = map;
        this.changeTypes = [];
        this.saveOnModelChanged = true;
    }

    _createClass(Autosave, [{
        key: 'save',
        value: function save(changeType) {
            this.changeTypes.push(changeType);
            this.delayedAutosave();
        }
    }, {
        key: 'saveNow',

        // do a save right now
        value: function saveNow(changeType) {
            this.changeTypes.push(changeType);
            this.autosave();
        }
    }, {
        key: 'delayedAutosave',

        // don't let autosave be triggered more than every N milliseconds...
        get: function () {
            if (!this._delayedAutoSave) {
                this._delayedAutoSave = _.debounce(this.autosave, 2000);
            }
            return this._delayedAutoSave;
        }
    }, {
        key: 'autosave',

        // compile the current list of change type descriptions, process them
        // to remove duplicates, and save the current data
        value: function autosave() {}
    }, {
        key: 'modelChanged',

        // -------------- handle model changes - trigger autosave ------------------

        // e is a go.ChangedEvent
        value: function modelChanged(e) {

            if (!self.saveOnModelChanged) {
                return;
            }

            var changeType = null;
            var changeDescription = null;

            if (e.propertyName === 'type') {
                // change R type
                // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,n,1,o,2,A,3,r,4,r,5,o,6,w,7,s] , newParam: null, newValue: [0,t,1,o] , propertyName: type
                changeType = 'edit_r';
                changeDescription = 'Changed Relationship Types';
            } else if (e.propertyName === 'layout') {
                // change system layout
                // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,l,1,e,2,f,3,t] , newParam: null, newValue: [0,r,1,i,2,g,3,h,4,t] , propertyName: layout
                changeType = 'edit_s';
            } else if (e.change === go.ChangedEvent.Insert && this.propertyEquals(e.newValue, 'fromPort', 'R')) {
                // add link
                // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 1, newValue: [type,noArrows,__gohashid,6005,from,-2,to,-4,labelKeys,,fromPort,R,toPort,P] , propertyName: linkDataArray
                // modelChange: linkToPortId, change: ChangedEvent.Property, oldParam: null, oldValue: [0,P] , newParam: null, newValue: [0,R] , propertyName: toPort
                changeType = 'edit_r';
            } else if (e.change === go.ChangedEvent.Remove && this.propertyEquals(e.oldValue, 'fromPort', 'R')) {
                // delete link
                // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 1, oldValue: [type,noArrows,__gohashid,6005,from,-2,to,-4,labelKeys,,fromPort,R,toPort,R] , newParam: null, newValue: [] , propertyName: linkDataArray
                changeType = 'edit_r';
            } else if (e.propertyName === 'linkDataArray') {
                // change P/D links
                // add P link
                // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 2, newValue: [type,noArrows,__gohashid,19122,from,-2,to,-4,labelKeys,,fromPort,P,toPort,P] , propertyName: linkDataArray
                // modelChange: linkCategory, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,P] , propertyName: category
                // delete P link
                // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 2, oldValue: [type,noArrows,__gohashid,19122,from,-2,to,-4,labelKeys,,fromPort,P,toPort,P,category,P] , newParam: null, newValue: [] , propertyName: linkDataArray
                // add D link
                // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 1, newValue: [from,-7,to,-5,fromPort,D,toPort,D,category,D,__gohashid,19522] , propertyName: linkDataArray
                // remove D link
                // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 1, oldValue: [from,-7,to,-5,fromPort,D,toPort,D,category,D,__gohashid,19522] , newParam: null, newValue: [] , propertyName: linkDataArray

                if (e.newValue && e.newValue.category === 'P' || e.oldValue && e.oldValue.category === 'P') {
                    changeType = 'edit_p';
                } else if (e.newValue && e.newValue.category === 'D' || e.oldValue && e.oldValue.category === 'D') {
                    changeType = 'edit_d';
                }
            } else if (e.propertyName === 'category') {
                // add P link
                // modelChanged, modelChange: linkCategory, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,P] , propertyName: category
                changeType = 'edit_p';
            } else if (e.propertyName === 'group') {
                // drag into S
                // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group
                // reorder part
                // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group
                // drag to D
                // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group

                changeType = 'edit_s';
            } else if (e.propertyName === 'nodeDataArray' && e.change === go.ChangedEvent.Insert && this.propertyEquals(e.newValue, 'isGroup', true)) {
                // add thing
                // modelChange: nodeDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 5, newValue: [text,New Idea,isGroup,true,level,0,layout,left,sExpanded,true,pExpanded,false,dExpanded,false,__gohashid,54688,group,,key,-7] , propertyName: nodeDataArray
                // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,2,1,2,2,8,3,.,4,5,5,6,6,2,7,5,8, ,9,-,10,1,11,4,12,9,13,.,14,6,15,8,16,7,17,5] , propertyName: loc
                // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: children
                changeType = 'add_thing';
            } else if (e.propertyName === 'text') {
                // move thing
                // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,b,1,b,2,b,3,b,4,b] , newParam: null, newValue: [0,a,1,a,2,a,3,a,4,a] , propertyName: text
                changeType = 'rename_thing';
                changeDescription = 'Renamed Ideas';
            } else if (e.propertyName === 'nodeDataArray' && e.change === go.ChangedEvent.Remove && this.propertyEquals(e.oldValue, 'isGroup', true)) {
                // delete thing
                // modelChange: nodeDataArray, change: ChangedEvent.Remove, oldParam: 5, oldValue: [text,New Idea,isGroup,true,level,0,layout,left,sExpanded,true,pExpanded,false,dExpanded,false,__gohashid,54688,group,,key,-7,loc,228.5625 -149.6875,children,0,attachments,] , newParam: null, newValue: [] , propertyName: nodeDataArray
                changeType = 'delete_thing';
            } else if (e.propertyName === 'nodeDataArray' && e.change === go.ChangedEvent.Insert && this.propertyEquals(e.newValue, 'isGroup', false)) {
                // add slide
                // modelChange: nodeDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 5, newValue: [key,slide-0,category,slide,index,0,isGroup,false,width,200,height,200,loc,156.5625 -97.6875,level,0,children,0,title,,notes,,__gohashid,63877] , propertyName: nodeDataArray
                changeType = 'edit_presenter';
            } else if (e.propertyName === 'nodeDataArray' && e.change === go.ChangedEvent.Remove && this.propertyEquals(e.oldValue, 'isGroup', false)) {
                // delete slide
                //modelChange: nodeDataArray, change: ChangedEvent.Remove, oldParam: 5, oldValue: [key,slide-0,category,slide,index,0,isGroup,false,width,200,height,200,loc,156.5625 -97.6875,level,0,children,0,title,,notes,,__gohashid,63877,$$hashKey,0XN] , newParam: null, newValue: [] , propertyName: nodeDataArray
                changeType = 'edit_presenter';
            } else if (e.propertyName === 'loc' || e.propertyName === 'width' || e.propertyName === 'height') {
                // move thing or resize slide
                // move slide
                // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,2,1,4,2,3,3, ,4,-,5,1,6,2,7,8] , newParam: null, newValue: [0,2,1,4,2,3,3, ,4,-,5,1,6,2,7,7] , propertyName: loc
                // resize slide
                // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: height
                // move thing
                // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,4,1,7,2,9,3,.,4,8,5,7,6,5,7, ,8,-,9,1,10,2,11,2,12,.,13,8,14,7,15,5] , newParam: null, newValue: [0,5,1,4,2,0,3,.,4,3,5,1,6,2,7,5,8, ,9,-,10,1,11,2,12,1,13,.,14,1,15,8,16,7,17,5] ,            
                changeType = 'move';
            } else if (e.propertyName === 'level' || e.propertyName === 'children') {
                // these attributes are updated as a result of other actions; ignore
                changeType = null;
            } else if (e.propertyName === 'attachments') {
                // edited attachments
                changeType = 'edit_attachments';
            } else if (e.propertyName === 'sExpanded' || e.propertyName === 'pExpanded') {
                // ignore expand/collapse
                changeType = 'move';
            } else if (e.propertyName === 'FinishedUndo' || e.propertyName === 'FinishedRedo') {
                changeType = 'undo_redo';
                this._map.refresh();
            } else if (e.change !== go.ChangedEvent.Transaction) {
                console.log('modelChanged, modelChange: ' + e.modelChange + ', change: ' + e.change + ', oldParam: ' + e.oldParam + ', oldValue: [' + _.pairs(e.oldValue) + '] ' + ', newParam: ' + e.newParam + ', newValue: [' + _.pairs(e.newValue) + '] ' + ', propertyName: ' + e.propertyName);
            }

            if (changeType) {
                this._map.analytics.updateContextualAnalytics();
                //console.log('calling delayedAutosave, changeType: ' + changeType);
                self.save(changeType);
            }
        }
    }, {
        key: 'propertyEquals',

        // convenience function for checking properties
        value: function propertyEquals(obj, key, value) {
            return obj !== null && _.has(obj, key) && _.result(obj, key) === value;
        }
    }]);

    return Autosave;
})();

module.exports = Autosave;

// stop right here if we're in the sandbox and/or we don't have edit permissions
//if (this._editor.sandbox || !this._editor.canEdit) {
//    return;
//}

//if (!this.changeTypes.length) {
//    console.log('autosave: nothing to save!'); // shouldn't happen
//    return;
//}

//// de-dupe the list of change types
//let changeList = _.uniq(this.changeTypes);
////console.log('changeList: ' + changeList);
//// don't show move events unless that's all we have
//let changeListWithoutMoves = _.without(changeList, 'move');
//if (changeListWithoutMoves.length > 0) {
//    changeList = changeListWithoutMoves;
//}
////console.log('changeList without moves: ' + changeList);
//// get descriptions
//let descriptionList = _.map(changeList, (ct) => {
//    return _.result(changeDescriptions, ct);
//});

////console.log('autosave, changeList: ' + changeList + ', descriptionList: ' + descriptionList);
//let postData = {
//    "name": this._editor.mapTitle,
//    "data": this._map.getDiagram().model.toJson(),
//    "state_data": JSON.stringify(this._map.ui.getStateData()),
//    "editor_options": JSON.stringify(this._map._editorOptions),
//    "presenter_slides": this._map.presenter.getSlideCount(),
//    "activity_slides": this._map.presenter.getActivitySlideCount(),
//    "change_type": changeList.join(';'),
//    "change_description": descriptionList.join('; '),
//    "thumbnail_png": this._map.presenter.getMapThumbnail()
//};
//let url = this._editor.mapUrl + '.json';

//this._editor.updateEditStatus(this._editor.SAVING);
//$http.put(url, postData).then(
//    (response) => {
//        this.changeTypes = [];
//        this._editor.updateEditStatus(this._editor.SAVE_OK);
//        // load returned data for analytics, points, badges, versions
//        this._editor.this._map.loadMapExtraData(response.data.map);
//    },
//    () => {
//        this._editor.updateEditStatus(this._editor.SAVE_FAILED);
//    });

},{}],37:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var editStatus = require('../constants/editStatus.js');
var common = require('../tools/Common.js');
var BACKSPACE = 8;
var Map = require('./Map.js');

var Editor = (function () {
    function Editor(mapData) {
        _classCallCheck(this, Editor);

        this.mapData = mapData;
        var metadata = mapData.map.metadata;
        this.sandbox = metadata.sandbox;
        this.mapData = window.mapData.map.data; // this gets overwritten by load() unless we are in the sandbox with no map ID
        this.mapId = metadata.id;
        this.mapTitle = metadata.name;
        this.mapUserTags = metadata.userTags;
        this.mapUrl = metadata.url;
        this.canEdit = metadata.canEdit;
        this.updatedAt = metadata.updatedAt;
        this.updatedBy = metadata.updatedBy; // ID
        this.updatedByName = metadata.updatedByName;
        this.editingTitle = false;
        this.editStatus = '';

        this.showImageExport = false;
        this.imageExportLoading = true;

        this.currentTab = null;

        // override parent scope (see user.js) since we're editing a map
        //this.ccsTagging.mapId = this.mapId;

        this.map = new Map({ Editor: this });

        if (!this.sandbox) {}

        if (this.mapUrl) {
            this.map.load();
        } else {
            this.map.loadForSandbox();
        }

        this.addBehaviors();
        this.handleNavigation();
        this.handleBackspace();
    }

    _createClass(Editor, [{
        key: 'maybeStartEditingTitle',
        value: function maybeStartEditingTitle() {
            if (this.canEdit) {
                this.editingTitle = true;
            }
        }
    }, {
        key: 'doneEditingTitle',
        value: function doneEditingTitle() {
            //console.log('doneEditingTitle');
            this.editingTitle = false;
            this.map.autosave.save('edit_title');
        }
    }, {
        key: 'editingTitleKeypress',
        value: function editingTitleKeypress(e) {
            if (e.which === 13) {
                this.doneEditingTitle();
            }
        }
    }, {
        key: 'print',
        value: function print() {
            window.print();
        }
    }, {
        key: 'saveSandboxMap',

        // ------------ save sandbox map (sign up/sign in) ---------------

        value: function saveSandboxMap() {
            var _this = this;

            var modalInstance = $modal.open({
                templateUrl: 'template_sandbox_save_modal.html', // see views/users/_template_sandbox_save_modal
                backdrop: 'static',
                controller: this.sandboxSaveModalCtrl,
                windowClass: 'sandbox-save-modal',
                resolve: {
                    outerScope: function outerScope() {
                        return _this;
                    },
                    map: function map() {
                        return _this.map;
                    },
                    userProfile: function userProfile() {
                        return _this.userProfile;
                    }
                }
            });

            modalInstance.result.then(function () {});
        }
    }, {
        key: 'updateEditStatus',
        value: function updateEditStatus(s) {
            //console.log('updateEditStatus: ' + s);
            this.editStatus = s;
            if (s === editStatus.SAVE_FAILED) {
                alert('Changes could not be saved - please check your network connection.');
            } else if (s === editStatus.LAST_UPDATED) {
                var time = moment(this.updatedAt).fromNow();
                var by = '';
                if (this.updatedBy === this.userId) {
                    by = 'by me';
                } else if (this.updatedByName) {
                    by = 'by ' + this.updatedByName;
                }
                // TODO: show 'by me' only for editable shared maps?

                this.editStatus = 'Last updated ' + time + ' ' + by;
            }

            // Last edit was XX ago by YY
        }
    }, {
        key: 'addBehaviors',

        // misc. UI behaviors for tooltips, popups etc.
        // TODO: figure out which of these need to be reapplied after dynamic data changes (e.g. LessonBook popovers)
        value: function addBehaviors() {

            // NOTE: we have to use regular bootstrap tooltips for toolbar buttons (instead of ng-bootstrap ones)
            // so we can turn them off for mobile. We also put the tooltips on wrappers rather than on the actual
            // buttons, so we can avoid the issue of stuck tooltips if a button gets disabled while the tooltip is showing.

            if (!common.isTouchDevice()) {
                // $('.tooltip-wrapper').tooltip({
                //     placement: 'top',
                //     container: 'body'
                // });

                // $('.dropdown-menu .btn').tooltip({
                //     placement: 'left',
                //     container: 'body'
                // }); // for layout options

                $('header, #map-title').hover(function () {
                    $('body.presenter-playing').addClass('hide-header');
                }, function () {
                    $('body.presenter-playing').removeClass('hide-header');
                });
            }
        }
    }, {
        key: 'handleNavigation',
        value: function handleNavigation() {
            // cross-browser tweaks:
            try {
                // http://www.opera.com/support/kb/view/827/
                opera.setOverrideHistoryNavigationMode('compatible');
                history.navigationMode = 'compatible';
            } catch (e) {}

            // install before-unload handler:

            var exitMessage = function exitMessage() {
                return 'Navigating away from your Map will cause any unsaved changes to be lost ' + '(any changes you make are automatically saved, but it takes a couple of seconds).';
            };

            //        $(window).bind('beforeunload', exitMessage);

            // prevent exit prompt when the user deliberately navigates away:

            $('#header-right a').click(function () {
                $(window).unbind('beforeunload', exitMessage);
            });
        }
    }, {
        key: 'handleBackspace',
        value: function handleBackspace() {
            $(document).on('keydown', function (event) {
                if (event.keyCode === BACKSPACE) {
                    if (!$('body :focus').is(':input')) {
                        // prevent accidental backspace when no input has focus:
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            });
        }
    }]);

    return Editor;
})();

module.exports = Editor;

// overview diagram
//let overview = go.GraphObject.make(go.Overview, "overview-diagram", {
//    observed: this.map.getDiagram(),
//    contentAlignment: go.Spot.Center
//});
//let outline = overview.box.elements.first();
//outline.stroke = "#333";

// no biggie.

},{"../constants/editStatus.js":18,"../tools/Common.js":51,"./Map.js":31}],38:[function(require,module,exports){
// functions for the generator (aka ThinkQuery)
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Generator = (function () {
    function Generator(editor, map) {
        var _this = this;

        _classCallCheck(this, Generator);

        this._map = map;
        this._diagram = map.getDiagram();
        this.concept1 = '';
        this.concept2 = '';
        this.selectedQuestion = null;

        // ---------- functions for creating each of the structures - see views/maps/generator_tab -----------
        this.queries = {

            WHAT_IS: function WHAT_IS(x, y) {
                // 1
                var thing1 = _this._map.createThing(x, y, _this.echoConcept1());
                _this._diagram.model.setDataProperty(thing1.data, 'dflag', true);
                _this._map.createChild(thing1, 'is?');
                _this._map.createChild(thing1, 'is?');
                _this._map.createChild(thing1, 'is?');
            },

            WHAT_IS_NOT: function WHAT_IS_NOT(x, y) {
                // 2
                var thing1 = _this._map.createThing(x, y, _this.echoConcept1());
                _this._diagram.model.setDataProperty(thing1.data, 'dflag', true);
                _this._map.createChild(thing1, 'is not?');
                _this._map.createChild(thing1, 'is not?');
                _this._map.createChild(thing1, 'is not?');
            },

            DISTINGUISH_BETWEEN: function DISTINGUISH_BETWEEN(x, y) {
                // 3
                var thing1 = _this._map.createThing(x, y, _this.echoConcept1());
                _this._diagram.model.setDataProperty(thing1.data, 'dflag', true);
                _this._map.createChild(thing1, 'is?');
                _this._map.createChild(thing1, 'is?');
                _this._map.createChild(thing1, 'is?');

                var thing2 = _this._map.createThing(x + 250, y, _this.echoConcept2());
                _this._diagram.model.setDataProperty(thing2.data, 'dflag', true);
                _this._map.createChild(thing2, 'is?');
                _this._map.createChild(thing2, 'is?');
                _this._map.createChild(thing2, 'is?');
            },

            COMPARE_CONTRAST: function COMPARE_CONTRAST(x, y) {
                // 4
                var thing1 = _this._map.createThing(x - 150, y, _this.echoConcept1());
                var thing2 = _this._map.createThing(x + 150, y, _this.echoConcept2());
                _this._diagram.model.setDataProperty(thing1.data, 'dflag', true);
                _this._diagram.model.setDataProperty(thing2.data, 'dflag', true);
                var rthing1 = _this._map.createRLinkWithRThing(thing1, thing2, 'contrast');
                var rthing2 = _this._map.createRLinkWithRThing(thing1, thing2, 'compare');
                _this._diagram.model.setDataProperty(rthing1.labeledLink.data, 'type', 'toFrom');
                _this._diagram.model.setDataProperty(rthing2.labeledLink.data, 'type', 'toFrom');
            },

            PARTS_OF: function PARTS_OF(x, y) {
                // 5
                var thing1 = _this._map.createThing(x, y, _this.echoConcept1());
                _this._map.createChild(thing1, 'part?');
                _this._map.createChild(thing1, 'part?');
                _this._map.createChild(thing1, 'part?');
            },

            PART_OF: function PART_OF(x, y) {
                // 6
                var thing1 = _this._map.createThing(x, y, 'part of?');
                _this._map.createChild(thing1, _this.echoConcept1());
            },

            PARTS_HAVE_PARTS: function PARTS_HAVE_PARTS(x, y) {
                // 7
                var thing1 = _this._map.createThing(x, y, _this.echoConcept1());
                var child1 = _this._map.createChild(thing1, 'part?');
                _this._map.createChild(child1, 'part?');
                _this._map.createChild(child1, 'part?');
                var child2 = _this._map.createChild(thing1, 'part?');
                _this._map.createChild(child2, 'part?');
                _this._map.createChild(child2, 'part?');
            },

            R_PARTS: function R_PARTS(x, y) {
                // 8
                var thing1 = _this._map.createThing(x, y, _this.echoConcept1());
                var thing2 = _this._map.createThing(x + 250, y, _this.echoConcept2());
                var rthing = _this._map.createRLinkWithRThing(thing1, thing2, 'relationship?');
                _this._map.createChild(rthing, 'part?');
                _this._map.createChild(rthing, 'part?');
            },

            P_PARTS: function P_PARTS(x, y) {
                // 9
                var thing1 = _this._map.createThing(x + 300, y, _this.echoConcept1());
                var child1 = _this._map.createChild(thing1, 'part seen from viewpoint of ' + _this.echoConcept2() + '?');
                var child2 = _this._map.createChild(thing1, 'part seen from viewpoint of ' + _this.echoConcept2() + '?');
                var child3 = _this._map.createChild(thing1, 'part seen from viewpoint of ' + _this.echoConcept2() + '?');
                var thing2 = _this._map.createThing(x, y, _this.echoConcept2());
                _this._map.createPLink(thing2, thing1);
                _this._map.createPLink(thing2, child1);
                _this._map.createPLink(thing2, child2);
                _this._map.createPLink(thing2, child3);
            },

            RS_TO_AND_BY: function RS_TO_AND_BY(x, y) {
                // 10
                var related1 = _this._map.createThing(x, y, 'related idea?');
                var related2 = _this._map.createThing(x + 300, y + 50, 'related idea?');
                var related3 = _this._map.createThing(x + 50, y + 300, 'related idea?');
                var thing = _this._map.createThing(x + 130, y + 130, _this.echoConcept1());
                _this._map.createRLink(related1, thing);
                _this._map.createRLink(related2, thing);
                _this._map.createRLink(related3, thing);

                var thing1 = _this._map.createThing(x + 500, y + 150, 'idea?');
                var thing2 = _this._map.createThing(x + 750, y + 150, 'idea?');
                _this._map.createRLinkWithRThing(thing1, thing2, _this.echoConcept1());
            },

            WHAT_IS_R: function WHAT_IS_R(x, y) {
                // 11
                var thing1 = _this._map.createThing(x, y, _this.echoConcept1());
                var thing2 = _this._map.createThing(x + 250, y, _this.echoConcept2());
                _this._map.createRLinkWithRThing(thing1, thing2, 'idea?');
            },

            PART_RS_ARE: function PART_RS_ARE(x, y) {
                // 12
                var thing1 = _this._map.createThing(x + 30, y, _this.echoConcept1(), 'freehand');
                var child1 = _this._map.createChild(thing1, 'part?');
                var child2 = _this._map.createChild(thing1, 'part?');
                var child3 = _this._map.createChild(thing1, 'part?');
                _this._diagram.model.setDataProperty(child1.data, 'loc', '-20 110');
                _this._diagram.model.setDataProperty(child2.data, 'loc', '80 110');
                _this._diagram.model.setDataProperty(child3.data, 'loc', '30 190');
                _this._map.createRLinkWithRThing(child1, child2, 'relationship?');
                _this._map.createRLinkWithRThing(child2, child3, 'relationship?');
                _this._map.createRLinkWithRThing(child3, child1, 'relationship?');
            },

            PART_RS_EXIST: function PART_RS_EXIST(x, y) {
                // 13
                var thing1 = _this._map.createThing(x, y, _this.echoConcept1(), 'right');
                var child11 = _this._map.createChild(thing1, 'part?');
                var child12 = _this._map.createChild(thing1, 'part?');
                var child13 = _this._map.createChild(thing1, 'part?');
                var thing2 = _this._map.createThing(x + 250, y, _this.echoConcept2());
                var child21 = _this._map.createChild(thing2, 'part?');
                var child22 = _this._map.createChild(thing2, 'part?');
                var child23 = _this._map.createChild(thing2, 'part?');
                _this._map.createRLink(thing1, thing2);
                _this._map.createRLinkWithRThing(child11, child21, 'relationship?');
                _this._map.createRLinkWithRThing(child12, child22, 'relationship?');
                _this._map.createRLinkWithRThing(child13, child23, 'relationship?');
            },

            RS_WITH_OTHERS: function RS_WITH_OTHERS(x, y) {
                // 14
                var thing1 = _this._map.createThing(x - 200, y, _this.echoConcept1());
                var thing2 = _this._map.createThing(x + 200, y, _this.echoConcept2());
                var thing3 = _this._map.createThing(x - 200, y + 200, 'another thing');
                var thing4 = _this._map.createThing(x + 200, y + 200, 'another thing');
                _this._map.createRLinkWithRThing(thing1, thing2, 'relationship?');
                _this._map.createRLinkWithRThing(thing1, thing3, 'relationship?');
                _this._map.createRLinkWithRThing(thing1, thing4, 'relationship?');
                _this._map.createRLinkWithRThing(thing2, thing4, 'relationship?');
                _this._map.createRLinkWithRThing(thing3, thing4, 'relationship?');
            },

            PARTS_OF_P: function PARTS_OF_P(x, y) {
                // 15
                var thing1 = _this._map.createThing(x - 100, y, _this.echoConcept1());
                var child1 = _this._map.createChild(thing1, 'part?');
                var child2 = _this._map.createChild(thing1, 'part?');
                var child3 = _this._map.createChild(thing1, 'part?');
                var thing2 = _this._map.createThing(x + 100, y, _this.echoConcept2());
                _this._map.createPLink(thing1, thing2);
            },

            POINT_FOR: function POINT_FOR(x, y) {
                // 16
                var thing = _this._map.createThing(x, y, 'new perspective');
                var thing1 = _this._map.createThing(x - 150, y + 150, _this.echoConcept1());
                var thing2 = _this._map.createThing(x + 150, y + 150, _this.echoConcept2());
                var rthing = _this._map.createRLinkWithRThing(thing1, thing2, 'relationship?');
                _this._map.createPLink(thing, rthing);
            },

            HAS_MULTIPLE_PS: function HAS_MULTIPLE_PS(x, y) {
                // 17
                var point1 = _this._map.createThing(x, y + 50, 'viewpoint?');
                var point2 = _this._map.createThing(x + 250, y, 'viewpoint?');
                var point3 = _this._map.createThing(x + 500, y + 50, 'viewpoint?');
                var view = _this._map.createThing(x + 250, y + 250, _this.echoConcept1());
                _this._map.createPLink(point1, view);
                _this._map.createPLink(point2, view);
                _this._map.createPLink(point3, view);
            },

            PARTS_FROM_MULTIPLE_PS: function PARTS_FROM_MULTIPLE_PS(x, y) {
                // 18
                var point1 = _this._map.createThing(x - 100, y, 'viewpoint?');
                var point2 = _this._map.createThing(x - 100, y + 125, 'viewpoint?');
                var point3 = _this._map.createThing(x - 100, y + 250, 'viewpoint?');
                var thing = _this._map.createThing(x + 150, y + 25, _this.echoConcept1());
                var child1 = _this._map.createChild(thing, 'part seen from viewpoint?');
                var child2 = _this._map.createChild(thing, 'part seen from viewpoint?');
                var child3 = _this._map.createChild(thing, 'part seen from viewpoint?');
                _this._map.createPLink(point1, child1);
                _this._map.createPLink(point1, child2);
                _this._map.createPLink(point2, child2);
                _this._map.createPLink(point3, child3);
            },

            WHAT_ABOUT: function WHAT_ABOUT(x, y) {
                // 19
                _this.queries.WHAT_IS(x, y);
                _this.queries.PARTS_OF(x + 300, y);
                _this.queries.PARTS_FROM_MULTIPLE_PS(x + 700, y);
                _this.queries.RS_TO_AND_BY(x, y + 400);
            }
        }; // queries
    }

    _createClass(Generator, [{
        key: 'echoConcept1',
        value: function echoConcept1() {
            return this.concept1 || '...';
        }
    }, {
        key: 'echoConcept2',
        value: function echoConcept2() {
            return this.concept2 || '...';
        }
    }, {
        key: 'swapConcepts',
        value: function swapConcepts() {
            var tmp = this.concept1;
            this.concept1 = this.concept2;
            this.concept2 = tmp;
        }
    }, {
        key: 'mapIt',
        value: function mapIt(question) {

            this._map.autosave.saveOnModelChanged = false;

            if ($scope.sandbox) {
                this._diagram.clear();
            }

            // figure out location for inserted stuff
            var db = this._map.computeMapBounds();
            var x = db.x + db.width + 200;
            var y = db.y;
            if (isNaN(x) || isNaN(y)) {
                x = y = 0;
            }
            //console.log('x, y: ' + x + ', ' + y);

            // insert the stuff and deselect it
            question(x, y);
            this._diagram.clearSelection();

            this._diagram.updateAllTargetBindings();
            this._diagram.layoutDiagram(true);

            this._map.ui.resetZoom();

            this._map.autosave.saveOnModelChanged = true;
            this._map.autosave.save('edit_generator');
        }
    }, {
        key: 'selectQuestion',
        value: function selectQuestion(question) {
            this.selectedQuestion = question;
            if ($scope.sandbox) {
                this.mapIt(question);
            }
        }
    }, {
        key: 'surpriseMe',
        value: function surpriseMe() {
            var keys = _.keys(this.queries);
            var i = _.random(0, keys.length - 1);
            var question = this.queries[keys[i]];
            this.selectedQuestion = question;
            this.mapIt(question);

            $('#questions').animate({ scrollTop: i * 30 }, 1000);
        }
    }, {
        key: 'currentTabChanged',

        // called when a tab is opened or closed
        value: function currentTabChanged(newValue, oldValue) {
            if (oldValue === this._map.ui.TAB_ID_GENERATOR) {
                // closing tab
                this._map.setEditingBlocked(false);
            } else if (newValue === this._map.ui.TAB_ID_GENERATOR) {
                // opening tab
                this._map.setEditingBlocked(true);
            }
        }
    }, {
        key: 'getPlaceholderIdeaNames',

        // these get filtered out in LessonBook
        value: function getPlaceholderIdeaNames() {
            return ['is?', 'is not?', 'part?', 'viewpoint?', 'related idea?', 'idea?', 'part seen from viewpoint?', 'contrast?', 'comparison?', 'relationship?'];
        }
    }]);

    return Generator;
})();

module.exports = Generator;

},{}],39:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var go = window.go;
var Layouts = require("../Layouts.js");

var FreehandDiagramLayout = (function (_Layouts) {
    function FreehandDiagramLayout() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _classCallCheck(this, FreehandDiagramLayout);

        _get(Object.getPrototypeOf(FreehandDiagramLayout.prototype), "constructor", this).apply(this, args);
    }

    _inherits(FreehandDiagramLayout, _Layouts);

    _createClass(FreehandDiagramLayout, [{
        key: "toString",
        value: function toString() {
            return "FreehandDiagramLayout";
        }
    }, {
        key: "doLayout",
        value: function doLayout(coll) {
            //console.log('FreehandDiagramLayout.doLayout');
            var diagram = this._map.getDiagram();
            // diagram.startTransaction("Freehand Diagram Layout");

            //validateGroupLocations(diagram.findTopLevelGroups());
            var groups = diagram.findTopLevelGroups(); // get new iterator
            while (groups.next()) {
                var group = groups.value;
                if (!group.isLinkLabel) {
                    var loc = go.Point.parse(group.data.loc);
                    group.move(new go.Point(loc.x, loc.y));
                    //console.log('FreehandDiagramLayout, group: ' + group + ' to location: ' + loc.x + ',' + loc.y);
                }
            }

            // all adjustment of links is done from here, not from the other layouts...
            this.getLinksByNodes(true);
            var links = diagram.links.iterator;
            while (links.next()) {
                var link = links.value;
                // if (isNaN(link.location.x)) {
                //     console.log('link location isNaN');
                //     link.move(new go.Point(0,0));
                // }
                // console.log('link location: ' + link.location);
                this.adjustLinkLayout(link);
            }

            // diagram.commitTransaction("Freehand Diagram Layout");
        }
    }]);

    return FreehandDiagramLayout;
})(Layouts);

go.Diagram.inherit(FreehandDiagramLayout, go.Layout);

module.exports = FreehandDiagramLayout;

},{"../Layouts.js":30}],40:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var go = window.go;
var Layouts = require("../Layouts");

var FreehandLayout = (function (_Layouts) {
    function FreehandLayout() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _classCallCheck(this, FreehandLayout);

        _get(Object.getPrototypeOf(FreehandLayout.prototype), "constructor", this).apply(this, args);
    }

    _inherits(FreehandLayout, _Layouts);

    _createClass(FreehandLayout, [{
        key: "toString",
        value: function toString() {
            return "FreehandLayout";
        }
    }, {
        key: "doLayout",
        value: function doLayout(coll) {
            var diagram = this._map.getDiagram();
            diagram.startTransaction("Freehand Layout");

            var x = this.group.location.x;
            var y = this.group.location.y;

            var it = this.group.memberParts.iterator;
            while (it.next()) {
                var part = it.value;
                if (part instanceof go.Group && !part.isLinkLabel) {
                    var loc = go.Point.parse(part.data.loc);
                    //console.log('FreehandLayout, part: ' + part.data.text + ', loc: ' + loc + ', location: ' + part.location);
                    part.move(new go.Point(x + loc.x, y + loc.y));
                    part.layout.doLayout(part);
                }
            }

            diagram.commitTransaction("Freehand Layout");
        }
    }]);

    return FreehandLayout;
})(Layouts);

go.Diagram.inherit(FreehandLayout, go.Layout);

module.exports = FreehandLayout;

},{"../Layouts":30}],41:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var go = window.go;
var Layouts = require('../Layouts.js');

var LeftInventoryLayout = (function (_Layouts) {
    function LeftInventoryLayout() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _classCallCheck(this, LeftInventoryLayout);

        _get(Object.getPrototypeOf(LeftInventoryLayout.prototype), 'constructor', this).apply(this, args);
    }

    _inherits(LeftInventoryLayout, _Layouts);

    _createClass(LeftInventoryLayout, [{
        key: 'toString',
        value: function toString() {
            return 'LeftInventoryLayout';
        }
    }, {
        key: 'doLayout',
        value: function doLayout(coll) {
            //console.log('LeftInventoryLayout.doLayout, group: ' + this.group + ', location: ' + this.group.location);
            // this.diagram.startTransaction("Inventory Layout");
            var startX = this.group.location.x;
            var startY = this.group.location.y + (this.group.part.actualBounds.height + this.getInventoryMargin(this.group));
            this.layoutMembersForInventory(this.group, startX, startY, 'L');
            // this.diagram.commitTransaction("Inventory Layout");
        }
    }]);

    return LeftInventoryLayout;
})(Layouts);

go.Diagram.inherit(LeftInventoryLayout, go.Layout);

module.exports = LeftInventoryLayout;

},{"../Layouts.js":30}],42:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var go = window.go;
var Layouts = require('../Layouts.js');

var RightInventoryLayout = (function (_Layouts) {
    function RightInventoryLayout() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _classCallCheck(this, RightInventoryLayout);

        _get(Object.getPrototypeOf(RightInventoryLayout.prototype), 'constructor', this).apply(this, args);
    }

    _inherits(RightInventoryLayout, _Layouts);

    _createClass(RightInventoryLayout, [{
        key: 'toString',
        value: function toString() {
            return 'RightInventoryLayout';
        }
    }, {
        key: 'doLayout',
        value: function doLayout(coll) {
            //this.diagram.startTransaction("Inventory Layout");
            var startX = this.group.location.x + this.group.actualBounds.width;
            var startY = this.group.location.y + (this.group.part.actualBounds.height + this.getInventoryMargin(this.group));
            this.layoutMembersForInventory(this.group, startX, startY, 'R');
            //this.diagram.commitTransaction("Inventory Layout");
        }
    }]);

    return RightInventoryLayout;
})(Layouts);

go.Diagram.inherit(RightInventoryLayout, go.Layout);

module.exports = RightInventoryLayout;

},{"../Layouts.js":30}],43:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var go = window.go;
var Layouts = require("../Layouts.js");

var StackedLayout = (function (_Layouts) {
    function StackedLayout() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _classCallCheck(this, StackedLayout);

        _get(Object.getPrototypeOf(StackedLayout.prototype), "constructor", this).apply(this, args);
    }

    _inherits(StackedLayout, _Layouts);

    _createClass(StackedLayout, [{
        key: "toString",
        value: function toString() {
            return "StackedLayout";
        }
    }, {
        key: "doLayout",
        value: function doLayout(coll) {
            this.diagram.startTransaction("Stacked Layout");
            var margin = this.getStackMargin(this.group);
            var startX = this.group.location.x;
            var startY = this.group.location.y + (this.group.part.actualBounds.height + margin / 2);
            this.layoutMembersForStacked(this.group, startX, startY);
            this.diagram.commitTransaction("Stacked Layout");
        }
    }]);

    return StackedLayout;
})(Layouts);

go.Diagram.inherit(StackedLayout, go.Layout);

module.exports = StackedLayout;

},{"../Layouts.js":30}],44:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;
var mk = go.GraphObject.make;

var COLORS = require('../../constants/colors.js');

var eyeSvgPath = 'M 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00c 47.559,94.979, 144.341,160.00, 256.00,160.00c 111.657,0.00, 208.439-65.021, 256.00-160.00 C 464.442,161.021, 367.657,96.00, 256.00,96.00z M 382.225,180.852c 30.081,19.187, 55.571,44.887, 74.717,75.148 c-19.146,30.261-44.637,55.961-74.718,75.149C 344.427,355.257, 300.779,368.00, 256.00,368.00c-44.78,0.00-88.428-12.743-126.225-36.852 C 99.695,311.962, 74.205,286.262, 55.058,256.00c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65 C 130.725,190.866, 128.00,205.613, 128.00,221.00c0.00,70.692, 57.308,128.00, 128.00,128.00s 128.00-57.308, 128.00-128.00c0.00-15.387-2.725-30.134-7.704-43.799 C 378.286,178.39, 380.265,179.602, 382.225,180.852z M 256.00,205.00c0.00,26.51-21.49,48.00-48.00,48.00s-48.00-21.49-48.00-48.00s 21.49-48.00, 48.00-48.00 S 256.00,178.49, 256.00,205.00z';
var eyeBlockedSvgPath = 'M 419.661,148.208 C 458.483,175.723 490.346,212.754 512.00,256.00 C 464.439,350.979 367.657,416.00 256.00,416.00 C 224.717,416.00 194.604,410.894 166.411,401.458 L 205.389,362.48 C 221.918,366.13 238.875,368.00 256.00,368.00 C 300.779,368.00 344.427,355.257 382.223,331.148 C 412.304,311.96 437.795,286.26 456.941,255.999 C 438.415,226.716 413.934,201.724 385.116,182.752 L 419.661,148.208 ZM 256.00,349.00 C 244.638,349.00 233.624,347.512 223.136,344.733 L 379.729,188.141 C 382.51,198.627 384.00,209.638 384.00,221.00 C 384.00,291.692 326.692,349.00 256.00,349.00 ZM 480.00,0.00l-26.869,0.00 L 343.325,109.806C 315.787,100.844, 286.448,96.00, 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00 c 21.329,42.596, 52.564,79.154, 90.597,106.534L0.00,453.131L0.00,480.00 l 26.869,0.00 L 480.00,26.869L 480.00,0.00 z M 208.00,157.00c 24.022,0.00, 43.923,17.647, 47.446,40.685 l-54.762,54.762C 177.647,248.923, 160.00,229.022, 160.00,205.00C 160.00,178.49, 181.49,157.00, 208.00,157.00z M 55.058,256.00 c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65C 130.725,190.866, 128.00,205.613, 128.00,221.00 c0.00,29.262, 9.825,56.224, 26.349,77.781l-29.275,29.275C 97.038,309.235, 73.197,284.67, 55.058,256.00z';
var paperclipSvgPath = 'M 348.916,163.524l-32.476-32.461L 154.035,293.434c-26.907,26.896-26.907,70.524,0.00,97.422 c 26.902,26.896, 70.53,26.896, 97.437,0.00l 194.886-194.854c 44.857-44.831, 44.857-117.531,0.00-162.363 c-44.833-44.852-117.556-44.852-162.391,0.00L 79.335,238.212l 0.017,0.016c-0.145,0.152-0.306,0.288-0.438,0.423 c-62.551,62.548-62.551,163.928,0.00,226.453c 62.527,62.528, 163.934,62.528, 226.494,0.00c 0.137-0.137, 0.258-0.284, 0.41-0.438l 0.016,0.017 l 139.666-139.646l-32.493-32.46L 273.35,432.208l-0.008,0.00 c-0.148,0.134-0.282,0.285-0.423,0.422 c-44.537,44.529-116.99,44.529-161.538,0.00c-44.531-44.521-44.531-116.961,0.00-161.489c 0.152-0.152, 0.302-0.291, 0.444-0.423l-0.023-0.03 l 204.64-204.583c 26.856-26.869, 70.572-26.869, 97.443,0.00c 26.856,26.867, 26.856,70.574,0.00,97.42L 218.999,358.375 c-8.968,8.961-23.527,8.961-32.486,0.00c-8.947-8.943-8.947-23.516,0.00-32.46L 348.916,163.524z';

var GroupTemplate = (function () {
    function GroupTemplate(map) {
        _classCallCheck(this, GroupTemplate);

        this._map = map;
    }

    _createClass(GroupTemplate, [{
        key: 'init',
        value: function init() {
            var _this = this;

            return mk(go.Group, go.Panel.Vertical, new go.Binding('layout', 'layout', function (layoutName) {
                return _this._map.layouts.getLayout(layoutName);
            }), new go.Binding('movable', '', function (obj) {
                return !obj.isLinkLabel;
            }).ofObject(), new go.Binding('isSubGraphExpanded', 'sExpanded'),
            // dim the thing if it's being dragged over another thing (drop to sister/child)
            new go.Binding('opacity', '', function (obj) {
                return obj.isSelected && _this._map.ui.dragTargetGroup ? 0.25 : 1;
            }).ofObject(), {
                locationObjectName: 'mainpanel',
                locationSpot: go.Spot.TopLeft,
                selectionAdorned: false,
                isSubGraphExpanded: true,
                layerName: 'Foreground',
                // highlight corners
                mouseEnter: function mouseEnter(event, target, obj2) {
                    _this._map.ui.mouseOverGroup = target;
                    _this._map.getDiagram().updateAllTargetBindings();
                },
                // unhighlight corners
                mouseLeave: function mouseLeave(event, target, obj2) {
                    _this._map.ui.mouseOverGroup = null;
                    _this._map.getDiagram().updateAllTargetBindings();
                }
                // containingGroupChanged: function(part, oldgroup, newgroup) {
                //     this._map.getDiagram().model.setDataProperty(part.data, 'level', this._map.computeLevel(part));
                //     //part.updateTargetBindings();  
                // }
            }, mk(go.Panel, go.Panel.Horizontal, this.groupExternalTextBlock(this._map.layouts.showLeftTextBlock, 'right'), mk(go.Panel, go.Panel.Position, {
                name: 'mainpanel'
            }, new go.Binding('scale', '', this._map.layouts.getScale).ofObject(),
            // drag area
            mk(go.Shape, 'Rectangle', {
                name: 'dragarea',
                position: new go.Point(0, 0),
                width: 100,
                height: 100,
                fill: COLORS.groupFillColor,
                stroke: null,
                cursor: 'move',
                // show debug info
                contextClick: function contextClick(event, target) {
                    if (event.control) {
                        console.log(_this.groupInfo(target.part));
                    }
                }
            }), mk(go.Panel, go.Panel.Position, this.viewMarker(), this.dragAboveTarget(), this.dragIntoTarget(), this.dragBelowTarget(), this.groupInternalTextBlock(), this.cornerD(), this.dFlagMarker(), this.cornerS(), this.sCollapsedMarker(), this.cornerR(), this.pointMarker(), this.cornerP(), this.attachmentPaperClip(), this.mainBorder())), this.groupExternalTextBlock(this._map.layouts.showRightTextBlock, 'left')),

            // the placeholder normally holds the child nodes, but we just use a dummy placeholder
            mk(go.Shape, {
                name: 'placeholder',
                fill: 'transparent',
                stroke: null,
                desiredSize: new go.Size(0, 0)
            }));
        }
    }, {
        key: 'groupInfo',
        value: function groupInfo(obj) {
            return obj.data.text + '\n' + 'object: ' + obj + '\n' + 'key: ' + obj.data.key + '\n' + 'containingGroup: ' + obj.containingGroup + '\n' + 'layout: ' + obj.layout + '\n' + 'data.layout: ' + obj.data.layout + '\n' + 'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + '\n' + 'freehand position (data.loc): ' + go.Point.parse(obj.data.loc) + '\n' + 'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + '\n' + 'getScale(): ' + this._map.layouts.getScale(obj) + '\n' + 'isLinkLabel: ' + obj.data.isLinkLabel + '\n' + 'labeledLink: ' + obj.labeledLink + '\n';
        }
    }, {
        key: 'viewMarker',

        // P view indicator
        value: function viewMarker() {
            var _this2 = this;

            return mk(go.Shape, 'Border', new go.Binding('visible', '', function (obj) {
                return true;
            }).ofObject(), new go.Binding('fill', '', function (obj) {
                return _this2.getViewMarkerFill(obj);
            }).ofObject(), {
                position: new go.Point(0, 0),
                height: 18,
                width: 100,
                stroke: null
            });
        }
    }, {
        key: 'getViewMarkerFill',
        value: function getViewMarkerFill(obj) {
            var weight = this._map.perspectives.getPerspectiveViewWeight(obj);

            if (weight === 3) {
                return COLORS.colorPDark;
            } else if (weight === 2) {
                return COLORS.colorP;
            } else if (weight === 1) {
                return COLORS.colorPLight;
            } else {
                return 'transparent';
            }
        }
    }, {
        key: 'dragAboveTarget',

        // --------------- targets for dragging to D or S -----------------
        value: function dragAboveTarget() {
            var _this3 = this;

            return mk(go.Panel, go.Panel.Position, {
                position: new go.Point(0, 0),
                height: 25,
                width: 100,
                mouseDragEnter: this.getGroupMouseDragEnterHandler(this._map.LEFT),
                mouseDragLeave: function mouseDragLeave() {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    _this3.groupMouseDragLeaveHandler.apply(_this3, args);
                },
                mouseDrop: this.getGroupMouseDropHandler(this._map.LEFT),
                click: function click() {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    _this3.groupClickHandler.apply(_this3, args);
                }
            },
            // drag target region
            mk(go.Shape, 'Rectangle', {
                position: new go.Point(0, 0),
                height: 25,
                width: 100,
                cursor: 'pointer',
                stroke: null,
                fill: 'transparent'
            }),
            // drag indicator bar
            mk(go.Shape, 'Border', new go.Binding('visible', '', function (obj) {
                return _this3.canDragSelectionToBecomeOrderedSisterOf(obj.part, _this3._map.LEFT, false);
            }).ofObject(), {
                position: new go.Point(0, 0),
                height: 10,
                width: 100,
                stroke: null,
                fill: '#000'
            }));
        }
    }, {
        key: 'dragIntoTarget',
        value: function dragIntoTarget() {
            var _this4 = this;

            return mk(go.Panel, go.Panel.Position, {
                position: new go.Point(0, 25),
                height: 50,
                width: 100,
                mouseDragEnter: this.getGroupMouseDragEnterHandler(null),
                mouseDragLeave: function mouseDragLeave() {
                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                    }

                    _this4.groupMouseDragLeaveHandler.apply(_this4, args);
                },
                mouseDrop: this.getGroupMouseDropHandler(null),
                click: function click() {
                    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        args[_key4] = arguments[_key4];
                    }

                    _this4.groupClickHandler.apply(_this4, args);
                }
            }, mk(go.Shape, 'Rectangle', {
                position: new go.Point(0, 0),
                height: 50,
                width: 100,
                cursor: 'pointer',
                stroke: null,
                fill: 'transparent'
            }));
        }
    }, {
        key: 'dragBelowTarget',
        value: function dragBelowTarget() {
            var _this5 = this;

            return mk(go.Panel, go.Panel.Position, {
                position: new go.Point(0, 75),
                height: 25,
                width: 100,
                mouseDragEnter: this.getGroupMouseDragEnterHandler(this._map.RIGHT),
                mouseDragLeave: function mouseDragLeave() {
                    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                        args[_key5] = arguments[_key5];
                    }

                    _this5.groupMouseDragLeaveHandler.apply(_this5, args);
                },
                mouseDrop: this.getGroupMouseDropHandler(this._map.RIGHT),
                click: function click() {
                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    _this5.groupClickHandler.apply(_this5, args);
                }
            },
            // drag target region
            mk(go.Shape, 'Rectangle', {
                position: new go.Point(0, 0),
                height: 25,
                width: 100,
                cursor: 'pointer',
                stroke: null,
                fill: 'transparent'
            }),
            // drag indicator bar
            mk(go.Shape, 'Border', new go.Binding('visible', '', function (obj) {
                return _this5.canDragSelectionToBecomeOrderedSisterOf(obj.part, _this5._map.RIGHT, false);
            }).ofObject(), {
                position: new go.Point(0, 15),
                height: 10,
                width: 100,
                stroke: null,
                fill: '#000'
            }));
        }
    }, {
        key: 'groupInternalTextBlock',

        // Returns the TextBlock for the group title, for use in the main group template, inside the box.
        value: function groupInternalTextBlock() {
            var _this6 = this;

            return mk(go.Panel, go.Panel.Horizontal, {
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100)
            }, mk(go.TextBlock, new go.Binding('text', 'text').makeTwoWay(), new go.Binding('visible', '', function (group) {
                // always show text inside box for R-things, because external text will throw off layout
                return _this6._map.layouts.isNotWithinInventoryLayout(group) || _this6._map.layouts.isRThingWithinInventoryLayout(group);
            }).ofObject(), {
                width: 80,
                margin: 10,
                alignment: go.Spot.Center,
                textAlign: 'center',
                cursor: 'move',
                font: '10px sans-serif',
                isMultiline: true,
                wrap: go.TextBlock.WrapDesiredSize,

                mouseDragEnter: this.getGroupMouseDragEnterHandler(null),
                mouseDragLeave: function mouseDragLeave() {
                    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                        args[_key7] = arguments[_key7];
                    }

                    _this6.groupMouseDragLeaveHandler.apply(_this6, args);
                },
                mouseDrop: this.getGroupMouseDropHandler(null),
                click: function click() {
                    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                        args[_key8] = arguments[_key8];
                    }

                    _this6.groupClickHandler.apply(_this6, args);
                },
                contextClick: function contextClick(event, target) {
                    if (event.control) {
                        console.log(_this6.groupInfo(target.part));
                    }
                }
            }));
        }
    }, {
        key: 'groupExternalTextBlock',

        // Returns a TextBlock for the group title, for use in the main group template, on the left or right.
        // visibleFn is a callback to be bound to the visibility attribute of the TextBlock.
        // textAlign is 'left' or 'right'.
        value: function groupExternalTextBlock(visibleFn, textAlign) {
            var _this7 = this;

            return mk(go.TextBlock, new go.Binding('text', 'text').makeTwoWay(), new go.Binding('visible', '', visibleFn).ofObject(), new go.Binding('scale', '', this._map.layouts.getExternalTextScale).ofObject(), {
                name: 'externaltext-' + textAlign, // NB: this screws up layouts for some reason - ??
                textAlign: textAlign,
                margin: 5,
                font: '10px sans-serif',
                isMultiline: true,
                click: function click() {
                    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                        args[_key9] = arguments[_key9];
                    }

                    _this7.groupClickHandler.apply(_this7, args);
                }
            });
        }
    }, {
        key: 'getGroupMouseDragEnterHandler',

        // --------- handlers for mouse drag/drop actions on groups, which need to be replicated on different target parts -------

        // position is this._map.LEFT, null, or this._map.RIGHT
        value: function getGroupMouseDragEnterHandler(position) {
            var _this8 = this;

            return function (event, target, obj2) {
                //console.log('mouseDragEnter, e.dp: ' + event.documentPoint + ', target.part: ' + target.part + ', target bounds: ' + target.actualBounds);
                _this8._map.ui.dragTargetGroup = target.part;
                _this8._map.ui.dragTargetPosition = position;
                _this8._map.getDiagram().updateAllTargetBindings();
            };
        }
    }, {
        key: 'groupMouseDragLeaveHandler',
        value: function groupMouseDragLeaveHandler(event, target, obj2) {
            this._map.ui.dragTargetGroup = null;
            this._map.ui.dragTargetPosition = null;
            this._map.getDiagram().updateAllTargetBindings();
        }
    }, {
        key: 'getGroupMouseDropHandler',
        value: function getGroupMouseDropHandler(position) {
            var _this9 = this;

            return function (event, dropTarget) {
                _this9.handleGroupMouseDrop(event, dropTarget, position);
            };
        }
    }, {
        key: 'groupClickHandler',
        value: function groupClickHandler(event, target) {
            // handle single or double click
            this._map.ui.handleCornerClick('', target);
        }
    }, {
        key: 'handleGroupMouseDrop',

        // handle drop on one of the three target regions (top, middle, bottom)
        // side is this._map.LEFT or this._map.RIGHT
        value: function handleGroupMouseDrop(event, dropTarget, side) {
            //console.log('dragAboveTarget.mouseDrop, target: ' + dropTarget + ', part: ' + dropTarget .part + ', show: ' + show);
            if (side && this.canDragSelectionToBecomeOrderedSisterOf(dropTarget.part, side, true)) {
                this._map.addSelectedThingAsOrderedSisterOf(dropTarget.part, side);
            } else if (this.canDragSelectionToBecomeSistersOf(dropTarget.part, true)) {
                this._map.addSelectedThingsAsSistersOf(dropTarget.part);
            } else if (this.canDragSelectionToBecomeChildrenOf(dropTarget.part, true)) {
                this._map.addSelectedThingsAsChildrenOf(dropTarget.part);
            }
        }
    }, {
        key: 'getGroupSelectionStroke',

        // -----------------------------------------------------------------------------

        // NB: these are here because they are about colors;
        // similar functions that are scale-related are in layouts.js...
        value: function getGroupSelectionStroke(obj) {
            if (obj.isSelected) {
                if (this._map.perspectives.isInPEditorMode()) return COLORS.colorP;else if (this._map.perspectives.isInDEditorMode()) return COLORS.colorD;else return COLORS.white;
            } else {
                return COLORS.white;
            }
        }
    }, {
        key: 'getGroupSelectionStrokeWidth',

        // OK, this isn't about colors, but it wants to be near the one above...
        value: function getGroupSelectionStrokeWidth(obj) {
            return obj.isSelected ? 3 : 1;
        }
    }, {
        key: 'showDCorner',

        // -----------------------------------------------------------------------------

        // callbacks to determine when the corners should be visible

        value: function showDCorner(group) {
            if (this._map.perspectives.isDEditorThing(group)) {
                // mark distinction thing
                return true;
            } else if (this._map.perspectives.isInPOrDEditorMode()) {
                // don't show any corners if in P/D editor mode
                return false;
            } else if (this._map.presenter.isCreatingThumbnail) {
                // don't show any corners if capturing thumbnail
                return false;
            } else {
                return group === this._map.ui.mouseOverGroup || /*this.isTouchDevice() &&*/group.isSelected || this.canDragSelectionToBecomeSistersOf(group, false) && (!this._map.ui.dragTargetPosition || this.cannotDragSelectionToBecomeOrderedSisterOf(group)); // not showing drag above/below indicators
            }
        }
    }, {
        key: 'showSCorner',
        value: function showSCorner(group) {
            if (this._map.perspectives.isInPOrDEditorMode()) {
                // don't show any corners if in P/D editor mode
                return false;
            } else if (this._map.presenter.isCreatingThumbnail) {
                // don't show any corners if capturing thumbnail
                return false;
            } else {
                return group === this._map.ui.mouseOverGroup || /*$scope.isTouchDevice() &&*/group.isSelected || this.canDragSelectionToBecomeChildrenOf(group, false) && (!this._map.ui.dragTargetPosition || this.cannotDragSelectionToBecomeOrderedSisterOf(group)); // not showing drag above/below indicators
            }
        }
    }, {
        key: 'showRCorner',
        value: function showRCorner(group) {
            if (this._map.perspectives.isInPOrDEditorMode()) {
                // don't show any corners if in P/D editor mode
                return false;
            } else if (this._map.presenter.isCreatingThumbnail) {
                // don't show any corners if capturing thumbnail
                return false;
            } else {
                return group === this._map.ui.mouseOverGroup || /*$scope.isTouchDevice() &&*/group.isSelected; // show corners on mouseover
            }
        }
    }, {
        key: 'showPCorner',
        value: function showPCorner(group) {
            if (this._map.perspectives.isPEditorPoint(group)) {
                return true; // mark perspective point
            } else if (this._map.perspectives.isInPOrDEditorMode()) {
                // don't show any corners if in P/D editor mode
                return false;
            } else if (this._map.presenter.isCreatingThumbnail) {
                // don't show any corners if capturing thumbnail
                return false;
            } else {
                return group === this._map.ui.mouseOverGroup || /*$scope.isTouchDevice() &&*/group.isSelected; // show corners on mouseover
            }
        }
    }, {
        key: 'showPDot',
        value: function showPDot(link) {
            return true; // this._map.ui.getMapEditorOptions().perspectiveMode != 'both';
        }
    }, {
        key: 'canDragSelectionToBecomeSistersOf',

        // these functions are used in two modes:
        // 1. with isDropping == false, to highlight drop targets based on this._map.ui.dragTargetGroup and this._map.ui.dragTargetPosition,
        //    which are set on mouseDragEnter/mouseDragleave
        // 2. with isDropping == true, on drop, when the above indicators have gone away, but we know what the dropped
        //    and target groups are, and we want to know what the drop should do.

        value: function canDragSelectionToBecomeSistersOf(group, isDropping) {
            return (group === this._map.ui.dragTargetGroup || isDropping) && this._map.thingsSelectedAreDescendantsOf(group);
        }
    }, {
        key: 'canDragSelectionToBecomeChildrenOf',
        value: function canDragSelectionToBecomeChildrenOf(group, isDropping) {
            return (group === this._map.ui.dragTargetGroup || isDropping) && !this._map.thingsSelectedIncludeSlide() && !this._map.thingsSelectedAreDescendantsOf(group);
        }
    }, {
        key: 'canDragSelectionToBecomeOrderedSisterOf',

        // side is this._map.LEFT or this._map.RIGHT
        value: function canDragSelectionToBecomeOrderedSisterOf(targetGroup, side, isDropping) {
            // must be dragging single group
            var draggedGroup = this._map.getUniqueThingSelected();
            if (!draggedGroup) {
                return false;
            }

            // dragged and target must be Sisters in inventory layout
            return (targetGroup === this._map.ui.dragTargetGroup || isDropping) && (this._map.ui.dragTargetPosition === side || isDropping) && this._map.layouts.areSistersInInventoryLayout(draggedGroup, targetGroup);
        }
    }, {
        key: 'cannotDragSelectionToBecomeOrderedSisterOf',
        value: function cannotDragSelectionToBecomeOrderedSisterOf(targetGroup) {
            return !this.canDragSelectionToBecomeOrderedSisterOf(targetGroup, this._map.LEFT) && !this.canDragSelectionToBecomeOrderedSisterOf(targetGroup, this._map.RIGHT);
        }
    }, {
        key: 'dFlagMarker',

        // ---------------- components for main group template ------------------

        value: function dFlagMarker() {
            return mk(go.Shape, new go.Binding('fill', '', function (obj) {
                return obj.data.dflag ? '#000' : null;
            }).ofObject(), {
                name: 'dflag',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(18, 18),
                geometry: go.Geometry.parse('F M0 1 L0 18 L18 0 L1 0z', true),
                cursor: 'pointer',
                pickable: false,
                stroke: null
            });
        }
    }, {
        key: 'cornerD',

        // 'D' corner (top left, red)
        value: function cornerD() {
            var _this10 = this;

            return mk(go.Panel, go.Panel.Position, new go.Binding('opacity', '', function (obj) {
                return _this10.showDCorner(obj) ? 1 : 0;
            }).ofObject(), {
                name: 'cornerD',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                opacity: 0
            }, mk(go.Shape, {
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                geometry: go.Geometry.parse('F M0 1 L0 50 L50 0 L1 0z', true),
                fill: COLORS.colorD,
                stroke: null,
                cursor: 'pointer',
                click: function click(event, target) {
                    //console.log('click, control:' + event.control + ', alt:' + event.alt + ', meta:' + event.meta);
                    if (event.alt) {
                        // NB: a side effect of this will be to select just this group,
                        // which would not happen otherwise via control-click
                        _this10._map.perspectives.setDEditorThing(target.part);
                    } else {
                        // handle single or double click
                        _this10._map.ui.handleCornerClick('D', target.part);
                    }
                },
                contextClick: function contextClick(event, target) {
                    //console.log('contextClick:' + event);
                    _this10._map.toggleDFlag(target.part);
                }
            }), mk(go.TextBlock, {
                text: 'D',
                stroke: 'white',
                font: '9px sans-serif',
                position: new go.Point(12, 15),
                pickable: false
            }));
        }
    }, {
        key: 'cornerS',

        // 'S' corner (bottom left, green)
        value: function cornerS() {
            var _this11 = this;

            var that = this;
            return mk(go.Panel, go.Panel.Position, new go.Binding('opacity', '', function (obj) {
                return _this11.showSCorner(obj) ? 1 : 0;
            }).ofObject(), {
                name: 'cornerS',
                position: new go.Point(0, 50),
                desiredSize: new go.Size(50, 50),
                opacity: 0
            }, mk(go.Shape, {
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                geometry: go.Geometry.parse('F M0 0 L0 49 L1 50 L50 50z', true),
                fill: COLORS.colorS,
                stroke: null,
                cursor: 'pointer',
                click: function click(event, target) {
                    // handle single or double click
                    that._map.ui.handleCornerClick('S', target.part);
                }
            }),
            // expansion indicator
            mk(go.Shape, new go.Binding('position', '', function (obj) {
                return obj.isSubGraphExpanded ? new go.Point(4, 43) : new go.Point(5, 38);
            }).ofObject(), new go.Binding('angle', '', function (obj) {
                return obj.isSubGraphExpanded ? 90 : 0;
            }).ofObject(), {
                desiredSize: new go.Size(5, 10),
                geometry: go.Geometry.parse('F M0 0 L5 5 L0 10z', true),
                fill: '#333',
                stroke: null,
                cursor: 'pointer',
                pickable: false
            }), mk(go.TextBlock, {
                text: 'S',
                stroke: 'white',
                font: '9px sans-serif',
                position: new go.Point(12, 28),
                pickable: false
            }));
        }
    }, {
        key: 'sCollapsedMarker',

        // show only when system is collapsed
        value: function sCollapsedMarker() {
            var _this12 = this;

            return mk(go.Shape, new go.Binding('visible', '', function (obj) {
                return !_this12.showSCorner(obj) && obj.memberParts.count > 0 && !obj.isSubGraphExpanded;
            }).ofObject(), {
                position: new go.Point(5, 88),
                desiredSize: new go.Size(5, 10),
                geometry: go.Geometry.parse('F M0 0 L5 5 L0 10z', true),
                fill: '#333',
                stroke: null,
                cursor: 'pointer',
                pickable: false
            });
        }
    }, {
        key: 'cornerR',

        // 'R' corner (bottom right, blue)
        value: function cornerR() {
            var _this13 = this;

            return mk(go.Panel, go.Panel.Position, new go.Binding('opacity', '', function (obj) {
                return _this13.showRCorner(obj) ? 1 : 0;
            }).ofObject(), {
                name: 'cornerR',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                opacity: 0
            }, mk(go.Shape, {
                name: 'cornerRShape',
                // NB: this corner is done differently from the others:
                // 1. the overall shape is the size of the whole square, so the port falls in the middle instead of the corner;
                // 2. the geometry traces around the edges of the whole square, because otherwise the link line will
                //    show inside the main square if it's crossing one of the other 3 quadrants
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                geometry: go.Geometry.parse('F' + 'M0 0 L0 100 ' + // top left to bottom left
                'L99 100 L100 99 L 100 0 ' + // bottom/right sides (round bottom right corner)
                'L 0 0 L 100 0 ' + // back to top left then top right
                'L 100 50 L 50 100 ' + // to midpoint of right side, midpoint of bottom side
                'L0 100z', // bottom left, return home
                true),
                fill: COLORS.colorR,
                stroke: null,
                cursor: 'pointer',

                portId: 'R',
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: true,
                click: function click(event, target) {
                    // handle single or double click
                    _this13._map.ui.handleCornerClick('R', target.part);
                }
            }), mk(go.TextBlock, {
                text: 'R',
                stroke: 'white',
                font: '9px sans-serif',
                pickable: false,
                position: new go.Point(82, 78)
            }));
        }
    }, {
        key: 'attachmentPaperClip',
        value: function attachmentPaperClip() {
            var _this14 = this;

            return mk(go.Shape, new go.Binding('visible', '', function (obj) {
                return obj.data.attachments && obj.data.attachments !== undefined && obj.data.attachments.length > 0;
            }).ofObject(), new go.Binding('geometry', '', function (obj) {
                return go.Geometry.parse(paperclipSvgPath, true);
            }).ofObject(), new go.Binding('desiredSize', '', function (obj) {
                return new go.Size(512, 512); // NB: the two icons don't scale to the same proportions for some reason - ??
            }).ofObject(), {
                position: new go.Point(46, 85),
                scale: 0.02,
                stroke: '#000',
                fill: '#000',
                click: function click(event, target) {
                    console.log('clip clicked');
                    _this14._map.ui.toggleTab(_this14._map.ui.TAB_ID_ATTACHMENTS);
                }
            });
        }
    }, {
        key: 'pEyeball',
        value: function pEyeball() {
            var _this15 = this;

            return mk(go.Shape, new go.Binding('visible', '', function (obj) {
                return _this15._map.perspectives.isPerspectivePoint(obj);
            }).ofObject(), new go.Binding('geometry', '', function (obj) {
                return go.Geometry.parse(_this15._map.pIsExpanded(obj) ? eyeSvgPath : eyeBlockedSvgPath, true);
            }).ofObject(), new go.Binding('desiredSize', '', function (obj) {
                return new go.Size(512, _this15._map.pIsExpanded(obj) ? 440 : 512); // NB: the two icons don't scale to the same proportions for some reason - ??
            }).ofObject(), {
                position: new go.Point(87, 4),
                scale: 0.02,
                stroke: '#000',
                fill: '#000',
                pickable: false
            });
        }
    }, {
        key: 'pointMarker',

        // P expansion indicator - this shows when the P corner is not visible, and only if the thing is a perspective point
        value: function pointMarker() {
            return this.pEyeball();
        }
    }, {
        key: 'cornerP',

        // 'P' corner (top right, orange)
        value: function cornerP() {
            var _this16 = this;

            return mk(go.Panel, go.Panel.Position, new go.Binding('opacity', '', function (obj) {
                return _this16.showPCorner(obj) ? 1 : 0;
            }).ofObject(), {
                name: 'cornerP',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                opacity: 0
            }, mk(go.Shape, {
                name: 'cornerPShape',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                // NB: this geometry covers the whole square; see note above for cornerR
                geometry: go.Geometry.parse('F' + 'M0 0 L0 100 L100 100' + // top left to bottom left to bottom right
                'L100 1 L99 0 L0 0' + // right/top sides (round top right corner)
                'L 50 0 L 100 50 ' + // to midpoint of top side, midpoint of right side
                'L100 100 0 100z', // bottom right, bottom left, return home
                true),

                fill: COLORS.colorP,
                stroke: null,
                cursor: 'pointer',

                portId: 'P',
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
                toMaxLinks: 1,
                click: function click(event, target) {
                    // handle single or double click
                    _this16._map.ui.handleCornerClick('P', target.part);
                }
            }), this.pEyeball(), // P expansion indicator
            mk(go.TextBlock, {
                text: 'P',
                stroke: 'white',
                font: '9px sans-serif',
                pickable: false,
                position: new go.Point(81, 15)
            }));
        }
    }, {
        key: 'mainBorder',
        value: function mainBorder() {
            return mk(go.Shape, 'Border', new go.Binding('stroke', '', this.getGroupSelectionStroke).ofObject(), new go.Binding('strokeWidth', '', this.getGroupSelectionStrokeWidth).ofObject(), {
                name: 'mainarea',
                position: new go.Point(0, 0),
                height: 100,
                width: 100,
                fill: null,
                //portId: '',
                cursor: 'pointer',
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: true
            });
        }
    }]);

    return GroupTemplate;
})();

module.exports = GroupTemplate;
// show corners on mouseover
// drag to D (make it sisters)
// show corners on mouseover
// drag to S (make it children)

},{"../../constants/colors.js":17}],45:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;
var mk = go.GraphObject.make;

var COLORS = require('../../constants/colors.js');

var LinkTemplate = (function () {
    function LinkTemplate(map) {
        _classCallCheck(this, LinkTemplate);

        this._map = map;
    }

    _createClass(LinkTemplate, [{
        key: 'init',
        value: function init() {
            var _this = this;

            return mk(go.Link, {
                selectionAdorned: false,
                layerName: '',
                routing: go.Link.Normal,
                relinkableFrom: true,
                relinkableTo: true,
                mouseEnter: function mouseEnter(event, target, obj2) {
                    _this._map.ui.mouseOverLink = target;
                    _this._map.getDiagram().updateAllTargetBindings();
                },
                mouseLeave: function mouseLeave(event, target, obj2) {
                    _this._map.ui.mouseOverLink = null;
                    _this._map.getDiagram().updateAllTargetBindings();
                },
                mouseDragEnter: function mouseDragEnter(event, target, dragObject) {
                    _this._map.ui.mouseOverLink = target;
                    _this._map.getDiagram().updateAllTargetBindings();
                },
                mouseDragLeave: function mouseDragLeave(event, dropTarget, dragObject) {
                    _this._map.ui.mouseOverLink = null;
                    _this._map.getDiagram().updateAllTargetBindings();
                },
                mouseDrop: function mouseDrop(event, dropTarget) {
                    var parts = _this._map.getDiagram().selection;
                    if (parts && parts.count === 1 && parts.first() instanceof go.Group) {
                        _this._map.addThingAsRThing(parts.first(), dropTarget);
                    }
                },
                doubleClick: function doubleClick(event, target) {
                    _this._map.createRThing(target);
                },
                contextClick: function contextClick(event, target) {
                    if (event.control) {
                        console.log(_this.linkInfo(target));
                    }
                }
            }, mk(go.Shape, new go.Binding('stroke', '', this.getRLinkSelectionStroke).ofObject(), new go.Binding('strokeWidth', '', this._map.layouts.getLinkStrokeWidth).ofObject(), {
                name: 'LINKSHAPE'
            }),

            // show to/from arrowheads based on link 'type' attribute
            mk(go.Shape, {
                fromArrow: 'Backward'
            }, new go.Binding('stroke', '', this.getRLinkSelectionStroke).ofObject(), new go.Binding('scale', '', this._map.layouts.getArrowheadScale).ofObject(), new go.Binding('visible', 'type', function (t) {
                return t === 'from' || t === 'toFrom';
            })), mk(go.Shape, {
                toArrow: 'Standard'
            }, new go.Binding('stroke', '', this.getRLinkSelectionStroke).ofObject(), new go.Binding('scale', '', this._map.layouts.getArrowheadScale).ofObject(), new go.Binding('visible', 'type', function (t) {
                return t === 'to' || t === 'toFrom';
            })), mk(go.Panel, go.Panel.Auto, // link label 'knob'
            new go.Binding('opacity', '', function (obj) {
                return _this.showKnob(obj) ? 1 : 0;
            }).ofObject(), new go.Binding('scale', '', this._map.layouts.getArrowheadScale).ofObject(), mk(go.Shape, {
                figure: 'Ellipse',
                fill: COLORS.colorD,
                stroke: COLORS.colorD,
                width: 12,
                height: 12
            })));
        }
    }, {
        key: 'linkInfo',
        value: function linkInfo(obj) {
            var snpos = this._map.layouts.getSameNodesLinkPosition(obj);
            return '' + 'object: ' + obj + '\n' + 'fromNode: ' + obj.fromNode + '\n' + 'toNode: ' + obj.toNode + '\n' + 'labelNodes: ' + obj.labelNodes.count + '\n' + 'labelNodeIsVisible: ' + this._map.layouts.labelNodeIsVisible(obj) + '\n' + 'fromPortId: ' + obj.fromPortId + '\n' + 'toPortId: ' + obj.toPortId + '\n' + 'category: ' + (obj.data ? obj.data.category : '') + '\n' + 'containingGroup: ' + obj.containingGroup + '\n' + 'fromAndToNodesAreVisible: ' + this._map.layouts.fromAndToNodesAreVisible(obj) + '\n' + 'curve: ' + obj.curve + '\n' + 'curviness: ' + obj.curviness + '\n' + 'fromEndSegmentLength: ' + Math.round(obj.fromEndSegmentLength) + '\n' + 'toEndSegmentLength: ' + Math.round(obj.toEndSegmentLength) + '\n' + 'sameNodesLinkPosition: ' + snpos.index + ' of ' + snpos.count + '\n' +
            //+ 'geometry: ' + obj.geometry + '\n' +
            'getLinkStrokeWidth: ' + this._map.layouts.getLinkStrokeWidth(obj) + '\n';
        }
    }, {
        key: 'showKnob',

        // when to show the R-thing knob on a link
        value: function showKnob(link) {
            return link === this._map.ui.mouseOverLink;
        }
    }, {
        key: 'getRLinkSelectionStroke',
        value: function getRLinkSelectionStroke(obj) {
            if (obj.isSelected || obj === this._map.ui.mouseOverLink) {
                return COLORS.colorR; // TODO: can P links be selected?
            } else {
                return '#000';
            }
        }
    }]);

    return LinkTemplate;
})();

module.exports = LinkTemplate;

},{"../../constants/colors.js":17}],46:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;
var mk = go.GraphObject.make;

var COLORS = require('../../constants/colors.js');

var PLinkTemplate = (function () {
    function PLinkTemplate(map) {
        _classCallCheck(this, PLinkTemplate);

        this._map = map;
    }

    _createClass(PLinkTemplate, [{
        key: 'init',
        value: function init() {
            var _this = this;

            return mk(go.Link, new go.Binding('opacity', '', function (obj) {
                return _this.showPLink(obj) ? 1 : 0;
            }).ofObject(), {
                selectionAdorned: false,
                layerName: 'Background', // make P links fall behind R links
                routing: go.Link.Normal,
                contextClick: function contextClick(event, target) {
                    if (event.control) {
                        console.log(_this.linkInfo(target));
                    }
                }
            }, mk(go.Shape, new go.Binding('strokeWidth', '', this._map.layouts.getLinkStrokeWidth).ofObject(), {
                name: 'LINKSHAPE',
                stroke: COLORS.colorPLight,
                fill: COLORS.colorPLight
            }), mk(go.Shape,
            // new go.Binding('visible', '', function(obj) {
            //     return (self.showPDot(obj) ? 1 : 0);
            // }).ofObject(),
            new go.Binding('scale', '', this._map.layouts.getArrowheadScale).ofObject(), {
                toArrow: 'Circle',
                stroke: COLORS.colorPLight,
                fill: COLORS.colorPLight
            }));
        }
    }, {
        key: 'linkInfo',
        value: function linkInfo(obj) {
            var snpos = this._map.layouts.getSameNodesLinkPosition(obj);
            return '' + 'object: ' + obj + '\n' + 'fromNode: ' + obj.fromNode + '\n' + 'toNode: ' + obj.toNode + '\n' + 'labelNodes: ' + obj.labelNodes.count + '\n' + 'labelNodeIsVisible: ' + this._map.layouts.labelNodeIsVisible(obj) + '\n' + 'fromPortId: ' + obj.fromPortId + '\n' + 'toPortId: ' + obj.toPortId + '\n' + 'category: ' + (obj.data ? obj.data.category : '') + '\n' + 'containingGroup: ' + obj.containingGroup + '\n' + 'fromAndToNodesAreVisible: ' + this._map.layouts.fromAndToNodesAreVisible(obj) + '\n' + 'curve: ' + obj.curve + '\n' + 'curviness: ' + obj.curviness + '\n' + 'fromEndSegmentLength: ' + Math.round(obj.fromEndSegmentLength) + '\n' + 'toEndSegmentLength: ' + Math.round(obj.toEndSegmentLength) + '\n' + 'sameNodesLinkPosition: ' + snpos.index + ' of ' + snpos.count + '\n' +
            //+ 'geometry: ' + obj.geometry + '\n' +
            'getLinkStrokeWidth: ' + this._map.layouts.getLinkStrokeWidth(obj) + '\n';
        }
    }, {
        key: 'showPLink',

        // when a P link should be visible
        value: function showPLink(link) {
            var mode = this._map.ui.getMapEditorOptions().perspectiveMode;
            if (this._map.perspectives.isPEditorPoint(link.fromNode)) {
                // show P's when this link is from the current Point
                return true;
            } else if (this._map.perspectives.isInPOrDEditorMode()) {
                // don't show P's for non-Point things, even on mouseover
                return false;
            } else {
                return (mode === 'lines' || mode === 'both') && (link.fromNode === this._map.ui.mouseOverGroup || this._map.pIsExpanded(link.fromNode));
            }
        }
    }]);

    return PLinkTemplate;
})();

module.exports = PLinkTemplate;

},{"../../constants/colors.js":17}],47:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var go = window.go;
var mk = go.GraphObject.make;
var COLORS = require('../../constants/colors.js');

var SlideTemplate = (function () {
    function SlideTemplate(map) {
        _classCallCheck(this, SlideTemplate);

        this._map = map;
    }

    _createClass(SlideTemplate, [{
        key: 'init',
        value: function init() {
            var _this = this;

            return mk(go.Node, go.Panel.Auto,
            // NB: unlike groups, slides just use a normal 2-way location binding
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding('width', 'width').makeTwoWay(), new go.Binding('height', 'height').makeTwoWay(), new go.Binding('visible', '', function (obj) {
                return obj.data.hasRegion && _this._map.ui.currentTabIs(_this._map.ui.TAB_ID_PRESENTER) && !_this._map.presenter.isPresenting && !_this._map.presenter.isCreatingThumbnail && _this._map.presenter.currentSlideIndex === obj.data.index;
            }).ofObject(), {
                locationSpot: go.Spot.TopLeft,
                selectionAdorned: false,
                resizable: true,
                resizeAdornmentTemplate: mk(go.Adornment, 'Spot', mk(go.Placeholder), // takes size and position of adorned object                   
                this.createSlideResizeHandle(go.Spot.TopLeft), this.createSlideResizeHandle(go.Spot.Top), this.createSlideResizeHandle(go.Spot.TopRight), this.createSlideResizeHandle(go.Spot.Right), this.createSlideResizeHandle(go.Spot.BottomRight), this.createSlideResizeHandle(go.Spot.Bottom), this.createSlideResizeHandle(go.Spot.BottomLeft), this.createSlideResizeHandle(go.Spot.Left)),
                padding: 0,
                contextClick: function contextClick(event, target) {
                    console.log(_this.nodeInfo(target.part));
                }
            }, mk(go.Shape, 'Rectangle', {
                name: 'slideborder',
                fill: 'rgba(251,170,54,.1)',
                stroke: null
            }));
        }
    }, {
        key: 'nodeInfo',
        value: function nodeInfo(obj) {
            return 'object: ' + obj + '\n' + 'key: ' + obj.data.key + '\n' + 'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + '\n' + 'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + '\n';
        }
    }, {
        key: 'createSlideResizeHandle',
        value: function createSlideResizeHandle(alignment) {
            return mk(go.Shape, new go.Binding('desiredSize', '', function (obj) {
                var slide = obj.adornedObject;
                var size = Math.min(slide.width, slide.height) * 0.05;
                return new go.Size(size, size);
            }).ofObject(), {
                alignment: alignment,
                cursor: 'col-resize',
                fill: 'rgba(251,170,54,1)',
                stroke: null
            });
        }
    }]);

    return SlideTemplate;
})();

module.exports = SlideTemplate;

},{"../../constants/colors.js":17}],48:[function(require,module,exports){
"use strict";

var go = window.go;
var mk = go.GraphObject.make;

var dLinkTemplate = function dLinkTemplate(map) {
    return mk(go.Link, {
        selectable: false
    }, mk(go.Shape, {
        name: "LINKSHAPE",
        stroke: null
    }));
};

module.exports = dLinkTemplate;

},{}],49:[function(require,module,exports){
"use strict";
/*
*  Copyright (C) 1998-2015 by Northwoods Software Corporation. All Rights Reserved.
*/

// A custom Tool for moving a label on a Node

/**
* @constructor
* @extends Tool
* @class
* This tool only works when the Node has a label (any GraphObject) marked with
* { _isNodeLabel: true } that is positioned in a Spot Panel.
* It works by modifying that label's GraphObject.alignment property to have an
* offset from the center of the panel.
*/
function NodeLabelDraggingTool() {
  go.Tool.call(this);
  this.name = "NodeLabelDragging";

  /** @type {GraphObject} */
  this.label = null;
  /** @type {Point} */
  this._originalAlignment = null;
  /** @type {Point} */
  this._originalCenter = null;
}
go.Diagram.inherit(NodeLabelDraggingTool, go.Tool);

/**
* This tool can only start if the mouse has moved enough so that it is not a click,
* and if the mouse down point is on a GraphObject "label" in a Spot Panel,
* as determined by findLabel().
* @this {NodeLabelDraggingTool}
* @return {boolean}
*/
NodeLabelDraggingTool.prototype.canStart = function () {
  if (!go.Tool.prototype.canStart.call(this)) return false;
  var diagram = this.diagram;
  if (diagram === null) return false;
  // require left button & that it has moved far enough away from the mouse down point, so it isn't a click
  var e = diagram.lastInput;
  if (!e.left) return false;
  if (!this.isBeyondDragSize()) return false;

  return this.findLabel() !== null;
};

/**
* From the GraphObject at the mouse point, search up the visual tree until we get to
* an object that has the "_isNodeLabel" property set to true, that is in a Spot Panel,
* and that is not the first element of that Panel (i.e. not the main element of the panel).
* @this {NodeLabelDraggingTool}
* @return {GraphObject} This returns null if no such label is at the mouse down point.
*/
NodeLabelDraggingTool.prototype.findLabel = function () {
  var diagram = this.diagram;
  var e = diagram.firstInput;
  var elt = diagram.findObjectAt(e.documentPoint, null, null);

  if (elt === null || !(elt.part instanceof go.Node)) return null;
  while (elt.panel !== null && (elt.panel.type === go.Panel.Spot || elt.panel.type === go.Panel.Horizontal) && elt.panel.elt(0) !== elt) {
    if (elt._isNodeLabel) return elt;
    elt = elt.panel;
  }
  return null;
};

/**
* Start a transaction, call findLabel and remember it as the "label" property,
* and remember the original value for the label's alignment property.
* @this {NodeLabelDraggingTool}
*/
NodeLabelDraggingTool.prototype.doActivate = function () {
  this.startTransaction("Shifted Label");
  this.label = this.findLabel();
  if (this.label !== null) {
    this._originalAlignment = this.label.alignment.copy();
    var main = this.label.panel.findMainElement();
    this._originalCenter = main.getDocumentPoint(go.Spot.Center);
  }
  go.Tool.prototype.doActivate.call(this);
};

/**
* Stop any ongoing transaction.
* @this {NodeLabelDraggingTool}
*/
NodeLabelDraggingTool.prototype.doDeactivate = function () {
  go.Tool.prototype.doDeactivate.call(this);
  this.stopTransaction();
};

/**
* Clear any reference to a label element.
* @this {NodeLabelDraggingTool}
*/
NodeLabelDraggingTool.prototype.doStop = function () {
  this.label = null;
  go.Tool.prototype.doStop.call(this);
};

/**
* Restore the label's original value for GraphObject.alignment.
* @this {NodeLabelDraggingTool}
*/
NodeLabelDraggingTool.prototype.doCancel = function () {
  if (this.label !== null) {
    this.label.alignment = this._originalAlignment;
  }
  go.Tool.prototype.doCancel.call(this);
};

/**
* During the drag, call updateAlignment in order to set the GraphObject.alignment of the label.
* @this {NodeLabelDraggingTool}
*/
NodeLabelDraggingTool.prototype.doMouseMove = function () {
  if (!this.isActive) return;
  this.updateAlignment();
};

/**
* At the end of the drag, update the alignment of the label and finish the tool,
* completing a transaction.
* @this {NodeLabelDraggingTool}
*/
NodeLabelDraggingTool.prototype.doMouseUp = function () {
  if (!this.isActive) return;
  this.updateAlignment();
  this.transactionResult = "Shifted Label";
  this.stopTool();
};

/**
* Save the label's GraphObject.alignment as an absolute offset from the center of the Spot Panel
* that the label is in.
* @this {NodeLabelDraggingTool}
*/
NodeLabelDraggingTool.prototype.updateAlignment = function () {
  if (this.label === null) return;
  var last = this.diagram.lastInput.documentPoint;
  var cntr = this._originalCenter;
  this.label.alignment = new go.Spot(0.5, 0.5, last.x - cntr.x, last.y - cntr.y);
};

module.exports = NodeLabelDraggingTool;

},{}],50:[function(require,module,exports){
"use strict";

var go = window.go;
var NodeLabelDraggingTool = require("./NodeLabelDraggingTool.js");
function init() {
    var $ = go.GraphObject.make; // for conciseness in defining templates

    var myDiagram = $(go.Diagram, "diagram", // must name or refer to the DIV HTML element
    {
        // start everything in the middle of the viewport
        initialContentAlignment: go.Spot.Center,
        // have mouse wheel events zoom in and out instead of scroll up and down
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        // support double-click in background creating a new node
        "clickCreatingTool.archetypeNodeData": { text: "new node" },
        // enable undo & redo
        "undoManager.isEnabled": true
    });

    // install the NodeLabelDraggingTool as a "mouse move" tool
    myDiagram.toolManager.mouseMoveTools.insertAt(0, new NodeLabelDraggingTool());

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    // define the Node template
    myDiagram.nodeTemplate = $(go.Node, "Spot", { locationObjectName: "ICON", locationSpot: go.Spot.Center }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), { selectionObjectName: "ICON" },
    // define the node primary shape
    $(go.Shape, "RoundedRectangle", {
        name: "ICON",
        parameter1: 10, // the corner has a medium radius
        desiredSize: new go.Size(40, 40),
        fill: $(go.Brush, go.Brush.Linear, { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
        stroke: "black",
        portId: "",
        fromLinkable: true,
        fromLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkable: true,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true,
        cursor: "pointer"
    }), $(go.Shape, // provide interior area where the user can grab the node
    { fill: "transparent", stroke: null, desiredSize: new go.Size(30, 30) }), $(go.TextBlock, {
        font: "bold 11pt helvetica, bold arial, sans-serif",
        editable: true, // editing the text automatically updates the model data
        _isNodeLabel: true,
        margin: 1,
        cursor: "move" // visual hint that the user can do something with this node label
    }, new go.Binding("text", "text").makeTwoWay(),
    // The GraphObject.alignment property is what the NodeLabelDraggingTool modifies.
    // This TwoWay binding saves any changes to the same named property on the node data.
    new go.Binding("alignment", "alignment", go.Spot.parse).makeTwoWay(go.Spot.stringify)));

    // unlike the normal selection Adornment, this one includes a Button
    myDiagram.nodeTemplate.selectionAdornmentTemplate = $(go.Adornment, "Spot", $(go.Panel, "Auto", $(go.Shape, { fill: null, stroke: "blue", strokeWidth: 2 }), $(go.Placeholder) // this represents the selected Node
    ),
    // the button to create a "next" node, at the top-right corner
    $("Button", {
        alignment: go.Spot.BottomLeft,
        click: addNodeAndLink // this function is defined below
    }, $(go.Shape, "PlusLine", { desiredSize: new go.Size(6, 6) })) // end button
    ); // end Adornment

    /*
    
    var clicked = obj.part;
      if (clicked !== null) {
        var thisemp = clicked.data;
        myDiagram.startTransaction("add employee");
        var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
        var newemp = { key: nextkey, name: "(new person)", title: "", parent: thisemp.key };
        myDiagram.model.addNodeData(newemp);
        myDiagram.commitTransaction("add employee");
      }
       */

    // clicking the button inserts a new node to the right of the selected node,
    // and adds a link to that new node
    function addNodeAndLink(e, obj) {
        var adorn = obj.part;
        e.handled = true;
        var diagram = adorn.diagram;
        diagram.startTransaction("Add State");

        // get the node data for which the user clicked the button
        var fromNode = adorn.adornedPart;
        var fromData = fromNode.data;
        // create a new "State" data object, positioned off to the right of the adorned Node
        var toData = { text: "new", parent: adorn.data.key };
        var p = fromNode.location.copy();
        p.y += 75;
        toData.loc = go.Point.stringify(p); // the "loc" property is a string, not a Point object
        // add the new node data to the model
        var model = diagram.model;
        model.addNodeData(toData);

        // create a link data from the old node data to the new node data
        var linkdata = {
            from: model.getKeyForNodeData(fromData), // or just: fromData.id
            to: model.getKeyForNodeData(toData),
            text: "transition"
        };
        // and add the link data to the model
        model.addLinkData(linkdata);

        // select the new Node
        var newnode = diagram.findNodeForData(toData);
        diagram.select(newnode);

        diagram.commitTransaction("Add State");

        // if the new node is off-screen, scroll the diagram to show the new node
        diagram.scrollToRect(newnode.actualBounds);
    }

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate = $(go.Link, // the whole link panel
    { curve: go.Link.Bezier, adjusting: go.Link.Stretch, reshapable: true }, new go.Binding("points").makeTwoWay(), new go.Binding("curviness", "curviness"), $(go.Shape, // the link shape
    { isPanelMain: true, stroke: "black", strokeWidth: 1.5 }), $(go.Shape, // the arrowhead
    { toArrow: "standard", stroke: null }), $(go.Panel, "Auto", $(go.Shape, // the link shape
    {
        fill: $(go.Brush, go.Brush.Radial, { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
        stroke: null
    }), $(go.TextBlock, "transition", // the label
    {
        textAlign: "center",
        font: "10pt helvetica, arial, sans-serif",
        stroke: "black",
        margin: 4,
        editable: true // editing the text automatically updates the model data
    }, new go.Binding("text", "text").makeTwoWay())));

    function save() {
        document.getElementById("mySavedModel").value = myDiagram.model.toJson();
        myDiagram.isModified = false;
    }
    var load = function load() {
        myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    };

    // read in the JSON-format data from the "mySavedModel" element
    load();
}

// Show the diagram's model in JSON format

module.exports = init;

},{"./NodeLabelDraggingTool.js":49}],51:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    }, {
        key: 'safeApply',

        // avoid '$apply already in progress' error (source: https://coderwall.com/p/ngisma)
        value: function safeApply(fn) {
            if (fn && typeof fn === 'function') {
                fn();
            }
        }
    }, {
        key: 'isTouchDevice',

        // source: http://ctrlq.org/code/19616-detect-touch-screen-javascript
        value: function isTouchDevice() {
            return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        }
    }]);

    return Common;
})();

module.exports = Common;

},{}],52:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-actions', '<div class="page-actions"> <div class="btn-group"> <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <span class="hidden-sm hidden-xs">Actions&nbsp;</span><i class="fa fa-angle-down"></i> </button> <ul class="dropdown-menu" role="menu"> <li class="start active "> <a href="javascript:;"> <i class="fa fa-pencil-square-o"> New Map </i> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-print"> Export/Print </i> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-tag"> Tag Map </i> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-copy"></i> Duplicate Map </a> </li> <li> <a href="javascript:;"> <i class="fa fa-users"></i> Share Map </a> </li> <li class="divider"> </li> <li> <a href="javascript:;"> <i class="fa fa-gear"></i> Settings </a> </li> </ul> </div> <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Page Title </span> </div>', function(opts) {
});
},{"riot":"riot"}],53:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-body', '<div class="page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo"> <page-header></page-header> <div class="clearfix"> </div> <page-container></page-container> <page-footer></page-footer> </div>', function(opts) {
});
},{"riot":"riot"}],54:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-container', '<div class="page-container"> <page-sidebar></page-sidebar> <page-content></page-content> </div>', function(opts) {
});
},{"riot":"riot"}],55:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-content', '<div class="page-content-wrapper"> <div class="page-content"> <div class="page-head"> <div id="app-container"> <div id="diagram" style="position:absolute; background-color: white; height: 100%; width: 80%; "></div> </div> </div> </div> </div>', function(opts) {
});
},{"riot":"riot"}],56:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-footer', '<div class="page-footer"> <div class="page-footer-inner"> 2015 &copy; Cabrera Research Lab </div> <div class="scroll-to-top"> <i class="icon-arrow-up"></i> </div> </div>', function(opts) {
});
},{"riot":"riot"}],57:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-header', '<div id="header-top" class="page-header navbar navbar-fixed-top"> <div id="header-content" class="page-header-inner"> <page-logo></page-logo> <page-actions></page-actions> <div class="page-top"> <page-search></page-search> <page-topmenu></page-topmenu> </div> </div> </div>', function(opts) {
});
},{"riot":"riot"}],58:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-logo', '<div class="page-logo"> <a href="index.html"> <img src="assets/img/metamap_cloud.png" alt="logo" class="logo-default"> </a> <div class="menu-toggler sidebar-toggler">  </div> </div> <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"> </a>', function(opts) {
});
},{"riot":"riot"}],59:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-search', ' <form class="search-form" action="extra_search.html" method="GET"> <div class="input-group"> <input type="text" class="form-control input-sm" placeholder="Search..." name="query"> <span class="input-group-btn"> <a href="javascript:;" class="btn submit"><i class="fa fa-search"></i></a> </span> </div> </form>', function(opts) {
});
},{"riot":"riot"}],60:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-sidebar', '<div class="page-sidebar-wrapper">   <div class="page-sidebar navbar-collapse collapse">        <ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200"> <li onclick="{ parent.click }" each="{ data }"> <a if="{ icon }" href="javascript:;"> <i class="{ icon }" riot-style="color:#{ color };"></i> <span class="title">{ title }</span> <span class="{ arrow: menu.length }"></span> </a> <ul if="{ menu.length }" class="sub-menu"> <li each="{ menu }"> <a href="javascript:;"> <i class="{ icon }"></i> <span class="title">{ title }</span> </a> </li> </ul> </li> </ul> </div> </div>', function(opts) {

this.click = function () {
    console.log('foo');
};

var that = this;
that.data = [];
that.MetaMap = MetaMap;
that.MetaMap.MetaFire.getData('menu/sidebar').then(function (data) {
    that.data = data;
    that.update();
});
});
},{"riot":"riot"}],61:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag('page-topmenu', '<div class="top-menu"> <ul class="nav navbar-nav pull-right"> <li class="separator hide"></li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_notification_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-bell-o"></i> <span class="badge badge-success"> 1 </span> </a> <ul class="dropdown-menu"> <li class="external"> <h3> <span class="bold">1 pending</span> notification </h3> <a href="javascript:;">view all</a> </li> <li> <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <span class="time">just now</span> <span class="details"> <span class="label label-sm label-icon label-success"> <i class="fa fa-plus"></i> </span> New user registered. </span> </a> </li> </ul> </li> </ul> </li> <li class="separator hide"></li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_points_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-trophy"></i> <span class="badge badge-success"> 3 </span> </a> <ul class="dropdown-menu"> <li class="external"> <h3> <span class="bold">3 new</span> achievements </h3> <a href="javascript:;">view all</a> </li> <li> <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <span class="time">just now</span> <span class="details"> <span class="label label-sm label-icon label-success"> <i class="fa fa-plus"></i> </span> Created a perspective circle! </span> </a> </li> </ul> </li> </ul> </li>  <li class="separator hide"></li>  <li class="dropdown" id="header_dashboard_bar"> <a class="dropdown-toggle" href="javascript:;"> <i class="fa fa-home"></i> </a> </li> <li class="separator hide"></li>  <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_help_bar"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <i class="fa fa-graduation-cap"></i> </a> <ul class="dropdown-menu"> <li> <ul class="dropdown-menu-list scroller" style="height: 270px;" data-handle-color="#637283"> <li> <a href="javascript:;"> <i class="fa fa-lightbulb-o"></i> <span class="title">Tutorial</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-question"></i> <span class="title">FAQ</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-life-ring"></i> <span class="title">Support</span> </a> </li> <li onclick="UserSnap.openReportWindow();"> <a href="javascript:;" > <i class="fa fa-frown-o"></i> <span class="title">Feedback</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-bullseye"></i> <span class="title">Inline Training</span> </a> </li> <li> <a href="javascript:;"> <i class="fa fa-laptop"></i> <span class="title">Online Training</span> </a> </li> </ul> </li> </ul> </li> <li class="separator hide"> </li> <li class="dropdown dropdown-user dropdown"> <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> <span class="username username-hide-on-mobile"> { username } </span> <img alt="" height="39" width="39" class="img-circle" riot-src="{ picture }"> </a> <ul class="dropdown-menu dropdown-menu-default"> <li> <a href="javascript:;"> <i class="fa fa-user"></i> My Profile </a> </li> <li onclick="{ linkAccount }"> <a href="javascript:;"> <i class="fa fa-compress"></i> Link Account </a> </li> <li onclick="{ logout }"> <a href="javascript:;"> <i class="fa fa-sign-out"></i> Log Out </a> </li> </ul> </li> </ul> </div>', function(opts) {
this.username = '';
this.picture = '';

var that = this;
localforage.getItem('profile').then(function (profile) {
    that.username = profile.nickname;
    that.picture = profile.picture || 'assets/admin/layout4/img/avatar.jpg';
    that.update();
});

this.logout = function () {
    MetaMap.Auth0.logout();
};

this.linkAccount = function () {
    MetaMap.Auth0.linkAccount();
};
});
},{"riot":"riot"}]},{},[1])(1)
});