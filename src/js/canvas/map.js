// functions for creating and manipulating the map (i.e. Diagram)

SandbankEditor.Map = function($scope, $http, $resource, $timeout, $modal, $log) {

    var self = this;

    // ----------- constants ---------------
    this.LEFT = 'left';
    this.RIGHT = 'right';

    // ------------ instance vars ----------

    var _diagram = null;

    // components
    var _analytics = null;
    var _attachments = null;
    var _autosave = null;
    var _generator = null;
    //var _history = null;
    var _layouts = null;
    var _perspectives = null;
    var _presenter = null;
    var _standards = null;
    var _templates = null;
    var _tests = null;
    var _ui = null;

    // ------------ component accessors ----------------

    function getComponents() {
        return [
            _analytics,
            _attachments,
            _autosave,
            _generator,
            // _history, 
            _layouts,
            _perspectives,
            _presenter,
            _standards,
            _templates,
            _tests,
            _ui
        ];
    }

    this.getAnalytics = function() {
        return _analytics;
    };
    this.getAttachments = function() {
        return _attachments;
    };
    this.getAutosave = function() {
        return _autosave;
    };
    this.getGenerator = function() {
        return _generator;
    };
    // this.getHistory = function () { return _history; };
    this.getLayouts = function() {
        return _layouts;
    };
    this.getPerspectives = function() {
        return _perspectives;
    };
    this.getPresenter = function() {
        return _presenter;
    };
    this.getStandards = function() {
        return _standards;
    };
    this.getTemplates = function() {
        return _templates;
    };
    this.getTests = function() {
        return _tests;
    };
    this.getUi = function() {
        return _ui;
    };

    // -------------- map init ------------------

    this.init = function() {

        // initialize components
        _analytics = new SandbankEditor.Analytics($scope, $http, self);
        _attachments = new SandbankEditor.Attachments($scope, $http, $resource, self);
        _autosave = new SandbankEditor.Autosave($scope, $http, self);
        _generator = new SandbankEditor.Generator($scope, self);
        // _history = new SandbankEditor.History($scope, $http, self);
        _layouts = new SandbankEditor.Layouts($scope, self);
        _perspectives = new SandbankEditor.Perspectives($scope, self);
        _presenter = new SandbankEditor.Presenter($scope, self);
        _standards = new SandbankEditor.Standards($scope, self);
        _templates = new SandbankEditor.Templates($scope, self);
        _tests = new SandbankEditor.Tests($scope, self);
        _ui = new SandbankEditor.UI($scope, $timeout, $http, $resource, $modal, $log, self);

        // call init for each component, if defined
        _.each(getComponents(), function(component) {
            if (component && component.init)
                component.init();
        });

        // create diagram
        _diagram = new go.Diagram("diagram");
        _diagram.initialContentAlignment = go.Spot.Center;
        _diagram.initialViewportSpot = go.Spot.Center;
        _diagram.initialDocumentSpot = go.Spot.Center;
        _diagram.hasHorizontalScrollbar = false;
        _diagram.hasVerticalScrollbar = false;
        _diagram.padding = 500;
        _diagram.layout = _layouts.getFreehandDiagramLayout();

        initTools();
        _templates.initTemplates(_diagram); // set up templates, customize temporary link behavior 
        addDiagramListeners();

        _templates.addExportFooter();

        // watch for tab changes
        // TODO: restore non-Angular version of this
        //$scope.$watch('currentTab', function(newValue, oldValue) {
        //    self.currentTabChanged(newValue, oldValue);
        //});
    };

    // this is called by a $scope.$watch in init()
    this.currentTabChanged = function(newValue, oldValue) {
        // console.log('currentTabChanged, newValue: ' + newValue + ', oldValue: ' + oldValue);
        // notify any interested components
        _.each(getComponents(), function(component) {
            if (component && component.currentTabChanged) {
                component.currentTabChanged(newValue, oldValue);
            }
        });

        //$scope.safeApply();
    };

    this.getDiagram = function() {
        return _diagram;
    };

    // misc. tool configuration
    function initTools() {
        // disable clicking on TextBlocks to edit - we will invoke editing in other ways
        _diagram.allowTextEdit = false;

        // select text when activating editor; 
        // use shift-enter to create new lines, enter to finish editing (NB: editor has multiline=true)
        var textTool = _diagram.toolManager.textEditingTool;
        textTool.doActivate = function() {
            go.TextEditingTool.prototype.doActivate.call(textTool);
            if (textTool.defaultTextEditor !== null) {
                textTool.defaultTextEditor.select();

                textTool.defaultTextEditor.addEventListener("keydown", function(e) {
                    if (e.which == 13 && !e.shiftKey) {
                        go.TextEditingTool.prototype.acceptText.call(textTool, go.TextEditingTool.LostFocus);
                    }
                });
            }
        };

        // handle delete key on Mac (default behavior only uses fn-Delete to delete from canvas)
        _diagram.commandHandler.doKeyDown = function() {
            var e = _diagram.lastInput;
            var cmd = _diagram.commandHandler;
            if (e.event.which === 8) {
                cmd.deleteSelection();
            } else {
                go.CommandHandler.prototype.doKeyDown.call(cmd); // call base method with no arguments
            }
        };

        // [disable keyboard shortcuts, as these do not do centering on zoom, 
        // and can lead to confusion with browser zoom (which gets fired depends on focus)]
        // - turned back on to support pinch/zoom on iPad
        _diagram.allowZoom = true;

        _diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;

        // decide what kinds of Parts can be added to a Group or to top-level
        // _diagram.commandHandler.memberValidation = function (grp, node) {
        //     //if (grp instanceof go.Group && node instanceof go.Group) return false;  // cannot add Groups to Groups
        //     return true;
        // };

        // default link attributes
        _diagram.toolManager.linkingTool.archetypeLinkData = {
            type: 'noArrows'
        };

        // allow double-click in background to create a new node
        _diagram.toolManager.clickCreatingTool.archetypeNodeData = getNewThingData();

        // how long mouse must be held stationary before starting a drag-select (instead of a scroll) - default was 175ms
        _diagram.toolManager.dragSelectingTool.delay = 400;
    }

    // ----------- handling of DiagramEvents --------------------

    function addDiagramListeners() {

        // DiagramEvents to be handled here or by a component
        var diagramEvents = [
            "InitialLayoutCompleted",
            "ChangedSelection",
            "BackgroundSingleClicked",
            "SelectionCopied",
            "SelectionMoved",
            "SelectionDeleting",
            "SelectionDeleted",
            "PartCreated",
            "PartResized",
            "ClipboardChanged",
            "ClipboardPasted",
            "LinkDrawn",
            "LinkRelinked",
            "ViewportBoundsChanged"
        ];
        _.each(diagramEvents, function(eventName) {
            _diagram.addDiagramListener(eventName, function(e) {
                broadcastDiagramEvent(eventName, e);
            });
        });

        _diagram.addDiagramListener("BackgroundContextClicked", function(e) {
            // TODO: turn off in production
            //console.log('diagram model:' + _diagram.model.toJson());
        });
    }

    // broadcasts the given DiagramEvent (see apidocs for go.DiagramEvent)
    // to any components that may be interested, including this one.
    function broadcastDiagramEvent(eventName, e) {
        self.handleDiagramEvent(eventName, e);
        _.each(getComponents(), function(component) {
            if (component && component.handleDiagramEvent)
                component.handleDiagramEvent(eventName, e);
        });
        $scope.safeApply();
    }

    this.handleDiagramEvent = function(eventName, e) {
        //console.log('handleDiagramEvent: ' + eventName);
        if (eventName == 'ChangedSelection') {
            changedSelection(e);
        } else if (eventName == 'SelectionCopied') {
            selectionCopied(e);
        } else if (eventName == 'PartCreated') {
            partCreated(e);
        } else if (eventName == 'BackgroundSingleClicked') {
            _ui.showHelpTip('canvasTip');
        } else if (eventName == 'LinkDrawn') {
            linkDrawn(e);
            setNewLinkDirection(e);
        } else if (eventName == 'LinkRelinked') {
            linkRelinked(e);
        } else if (eventName == 'ClipboardChanged') {
            clipboardChanged(e);
        } else if (eventName == 'ClipboardPasted') {
            clipboardPasted(e);
        }
    };

    // handle zoom to region if applicable
    function changedSelection(e) {
        //console.log('map.changedSelection');
        _diagram.updateAllTargetBindings();
        _ui.maybeZoomToRegion();
        if (self.relationshipsSelected()) {
            _ui.showHelpTip('relationshipTip');
        }
    }

    function partCreated(e) {
        //console.log('Map, PartCreated');
        var group = e.subject;
        if (!(group instanceof go.Group)) {
            return;
        }
        _diagram.model.setDataProperty(group.data, 'layout', _ui.getMapEditorOptions().defaultThingLayout || 'left');
        _layouts.setNewPartLocationData(e);
    }

    // fix link ports when a link is created - 
    // the P and R ports both cover the whole node, and the P port is on top of the R port, 
    // so both P and R links get the toPort set to P by default.
    function linkDrawn(e) {
        var link = e.subject;
        console.log('linkDrawn, link: ' + link + ', fromPort: ' + link.fromPortId + ', toPort: ' + link.toPortId);
        if (link.fromPortId == 'P') {
            _diagram.model.startTransaction("change link category");
            _diagram.model.setDataProperty(link.data, 'toPort', 'P');
            _diagram.model.setDataProperty(link.data, 'category', 'P');
            _diagram.model.commitTransaction("change link category");
        }
        // prevent links from R to P
        else if (link.fromPortId == 'R') {
            _diagram.model.startTransaction("change link toPort");
            _diagram.model.setDataProperty(link.data, 'toPort', 'R');
            _diagram.model.commitTransaction("change link toPort");
        }
    }

    // fix link ports when a link is relinked - 
    // dragging either end of an R-link to another node will set the corresponding port to P, 
    // since P port is on top of R port, so we reset both ports to R if the category is not P.
    function linkRelinked(e) {
        var link = e.subject;
        if (link.data.category === undefined || link.data.category !== 'P') {
            _diagram.model.setDataProperty(link.data, 'fromPort', 'R');
            _diagram.model.setDataProperty(link.data, 'toPort', 'R');
        }
    }

    function setNewLinkDirection(e) {
        var link = e.subject;
        if (link.fromPortId == 'R') {
            _diagram.model.startTransaction("change link direction");
            _diagram.model.setDataProperty(link.data, 'type', _ui.getMapEditorOptions().defaultRelationshipDirection);
            _diagram.commitTransaction("change link direction");
        }
    }

    function clipboardChanged(e) {
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group) {
                console.log('clipboardChanged: part ' + part + ', mainpanel scale: ' + part.findObject('mainpanel').scale);
            }
        }
    }

    // NB: this is called when parts are copied by control-drag, NOT when the copy button is clicked
    function selectionCopied(e) {
        console.log('selectionCopied');
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group && part.isTopLevel) {
                var loc = go.Point.parse(part.data.loc);
                console.log('selectionCopied: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                _diagram.model.setDataProperty(part.data, 'loc', (loc.x + 50) + ' ' + (loc.y + 50));
                part.updateTargetBindings('loc');
            }
        }
    }

    function clipboardPasted(e) {
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group && part.isTopLevel) {
                var loc = go.Point.parse(part.data.loc);
                //console.log('clipboardPasted: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                _diagram.model.setDataProperty(part.data, 'loc', (loc.x + 50) + ' ' + (loc.y + 50));
                part.updateTargetBindings('loc');
            }
        }
    }

    // computes the bounds of all groups in the diagram - this includes all ideas/things, 
    // and excludes nodes, including slides, the slide blocker, and the export footer
    this.computeMapBounds = function() {
        var groups = new go.List(go.Group);
        var nodes = _diagram.nodes;
        while (nodes.next()) {
            if (nodes.value instanceof go.Group) {
                groups.add(nodes.value);
            }
        }
        return _diagram.computePartsBounds(groups).copy(); // return a mutable rect
    };

    // ------------ what is currently selected? ----------------

    // returns true if all selected items are things (i.e. Groups), including r-things
    this.thingsSelected = function() {
        if (_diagram == null || _diagram.selection.count < 1)
            return false;

        var it = _diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Group))
                return false;
        }

        return true;
    };

    // returns true if exactly one thing (Group) is selected
    this.thingSelected = function() {
        return _diagram !== null && _diagram.selection.count == 1 && _diagram.selection.first() instanceof go.Group;
    };

    // if a single group is selected, returns it, otherwise returns null
    this.getUniqueThingSelected = function() {
        if (_diagram !== null && _diagram.selection.count == 1 && _diagram.selection.first() instanceof go.Group) {
            return _diagram.selection.first();
        } else {
            return null;
        }
    };

    this.thingsSelectedAreMembersOf = function(group) {
        if (_diagram === null || _diagram.selection.count < 1)
            return false;

        var it = _diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Group) || it.value.containingGroup != group)
                return false;
        }

        return true;
    };

    this.thingsSelectedAreDescendantsOf = function(group) {
        if (_diagram === null || _diagram.selection.count < 1)
            return false;

        var it = _diagram.selection.iterator;
        while (it.next()) {
            var ancestors = _layouts.getAncestorGroups(it.value);
            if (_.indexOf(ancestors, group) == -1)
                return false;
        }

        return true;
    };

    this.thingsSelectedIncludeSlide = function() {
        if (_diagram === null || _diagram.selection.count < 1)
            return false;

        var it = _diagram.selection.iterator;
        while (it.next()) {
            if (it.value.data && it.value.data.category == 'slide') {
                return true;
            }
        }

        return false;
    };

    // returns true if all selected items are relationships (i.e. Links)
    this.relationshipsSelected = function() {
        if (_diagram === null || _diagram.selection.count < 1)
            return false;

        var it = _diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Link) || !_layouts.isRLink(it.value))
                return false;
        }

        return true;
    };

    // returns true if exactly one relationship (Link) is selected
    this.relationshipSelected = function() {
        return _diagram !== null && _diagram.selection.count == 1 && _diagram.selection.first() instanceof go.Link;
    };

    // ------------ load and initialize model -------------

    this.load = function() {
        var url = $scope.mapUrl + '.json';
        if ($scope.sandbox) {
            url = $scope.mapUrl + '.json?sandbox=1';
        }
        //TODO: restore non-Angular http-get for map data
        var data = { "map": { "metadata": { "sandbox": false, "id": 5547, "name": "Untitled Map", "url": "/maps/5547", "canEdit": true, "updatedAt": "2015-05-15T12:29:40.721-04:00", "updatedBy": null, "updatedByName": null, "userTags": [] }, "data": { "class": "go.GraphLinksModel", "nodeIsLinkLabelProperty": "isLinkLabel", "linkLabelKeysProperty": "labelKeys", "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [{ "key": 1, "text": "New Idea", "isGroup": true, "loc": "0 0", "layout": "left", "sExpanded": true, "pExpanded": true }], "linkDataArray": [] }, "stateData": null, "editorOptions": null, "analytics": {}, "versions": [] } };
        _diagram.model = go.Model.fromJson(data);
        _ui.setStateData(data.map.stateData);
        _ui.setMapEditorOptions(data.map.editorOptions);

        self.checkModel();
        _diagram.updateAllTargetBindings();
        _diagram.undoManager.isEnabled = true;
        _diagram.model.addChangedListener(_autosave.modelChanged);
        _autosave.saveOnModelChanged = true;
        _diagram.isReadOnly = !$scope.canEdit;
        $scope.updateEditStatus($scope.canEdit ? $scope.LAST_UPDATED : $scope.READ_ONLY);
        _ui.resetZoom();
        self.loadMapExtraData(data.map);

        // if no nodes OR in thinkquery mode, launch generator
        if ($scope.thinkquery || !_diagram.model.nodeDataArray.length) {
            _ui.openTab(_ui.TAB_ID_GENERATOR);
        }
        // if we have slides, play presentation
        else if (!$scope.canEdit && _presenter.getSlideNodeDatas().length) {
            _presenter.playSlide(1);
        }
    }

    this.loadForSandbox = function() {
        _diagram.model = go.Model.fromJson($scope.mapData);
        _ui.setStateData(''); // important! (otherwise corner highlighting breaks)
        _diagram.updateAllTargetBindings();
        _diagram.undoManager.isEnabled = true;
        _ui.resetZoom();
        $scope.canEdit = true;

        // if no nodes OR in thinkquery mode, launch generator
        if ($scope.thinkquery) {
            _ui.openTab(_ui.TAB_ID_GENERATOR);
        }
        // if we have slides, play presentation
        else if (_presenter.getSlideNodeDatas().length) {
            _presenter.playSlide(1);
        }

    };

    // fix any structural problems in the model before displaying it
    this.checkModel = function() {
        // change "isLinkLabel" property to category:"LinkLabel" (change as of goJS 1.3)
        _.each(_diagram.model.nodeDataArray, function(nodeData, index, list) {
            if (nodeData.isLinkLabel) {
                delete nodeData.isLinkLabel;
                nodeData.category = "LinkLabel";
            }
        });

        // check for the link label (r-thing) for a link being the same as the from or to node 
        // - this can cause infinite recursion in thinks like layout.getScale
        _.each(_diagram.model.linkDataArray, function(linkData, index, list) {
            var badLabelKeys = [];
            _.each(linkData.labelKeys, function(key, index2, list2) {
                if (key == linkData.from || key == linkData.to) {
                    console.log('labelKey same as from or to of link: ' + key);
                    badLabelKeys.push(key);
                }
            });
            linkData.labelKeys = _.difference(linkData.labelKeys, badLabelKeys);
        });
    };

    // loads other data besides the diagram model from the json object returned by maps/show.json
    // - this includes points, badges, versions, and map analytics
    // NB: points and badges are set at page load time in layouts/user and users/badges, but
    // we also need to be able to update them here after an autosave

    // TODO: is this still all needed with the newer userProfile stuff?
    this.loadMapExtraData = function(mapData) {
        $scope.safeApply(function() {
            //console.log('map.loadMapExtraData, mapData: ' + mapData);
            $scope.mapUserTags = mapData.metadata.userTags; // TODO: is this used anywhere?

            //$scope.map.getHistory().versionList = mapData.versions;
            $scope.map.getAnalytics().mapAnalytics = mapData.analytics;
        });
    };

    // loads model data for an individual version and displays it
    // NB: this also disables autosave; load() must be called to re-enable it
    this.loadVersion = function(id) {
        $http.get('/map_versions/' + id).then(function(response) {
            if (response.status === 200) {
                try {
                    //console.log('loaded map version with ID: ' + id);
                    _diagram.model = go.Model.fromJson(response.data);
                    _diagram.updateAllTargetBindings();
                    _diagram.undoManager.isEnabled = false;
                    _autosave.saveOnModelChanged = false;
                    _diagram.layoutDiagram(true);
                    _diagram.isReadOnly = true;
                } catch (e) {
                    alert('Could not load MetaMap version');
                    console.error(e.message);
                }
            }
        });
    };

    // set whether editing capability is temporarily suspended -
    // this is distinct from the global $scope.canEdit setting,
    // which if false prevents editing at all times
    this.setEditingBlocked = function(val) {
        if ($scope.canEdit) {
            _diagram.isReadOnly = val;
        }
    };

    // ------------- creating things in the model -------------------

    // default properties for all new Things (groups) - note that these can be overridden if needed
    function getNewThingData() {
        return {
            text: 'Idea',
            isGroup: true,
            layout: _ui.getMapEditorOptions().defaultThingLayout || 'left',
            sExpanded: true,
            pExpanded: true
        };
    }

    this.createSister = function(thing) {
        if (!$scope.canEdit) {
            return null;
        }

        var newLoc = _layouts.getNewSisterLocation(thing);
        var data = _.extend(getNewThingData(), {
            group: thing.data.group,
            text: 'Idea',
            loc: go.Point.stringify(newLoc)
        });
        _diagram.model.addNodeData(data);
        var newSister = _diagram.findNodeForData(data);

        // put new sister right after thing (not as the last sibling)
        if (thing.containingGroup) {
            self.moveSiblingNextTo(newSister, thing, self.RIGHT);
        }
        return newSister;
    };

    this.createRToSister = function(thing) {
        if (!$scope.canEdit) {
            return null;
        }

        var thingKey = _diagram.model.getKeyForNodeData(thing.data);
        //console.log('thingKey: ' + thingKey);
        var newLoc = _layouts.getNewSisterLocation(thing, true); // withR = true
        var data = _.extend(getNewThingData(), {
            group: thing.data.group,
            text: 'Idea',
            loc: go.Point.stringify(newLoc)
        });
        _diagram.model.addNodeData(data);
        var newSister = _diagram.findNodeForData(data);
        var groupKey = _diagram.model.getKeyForNodeData(data);

        // create link
        var linkData = {
            from: thingKey,
            to: groupKey,
            type: 'to',
            fromPort: 'R',
            toPort: 'R'
        };
        _diagram.model.addLinkData(linkData);

        // put new sister right after thing (not as the last sibling)
        if (thing.containingGroup) {
            self.moveSiblingNextTo(newSister, thing, self.RIGHT);
        }
        return newSister;
    };

    this.createChild = function(thing, name, x, y) {
        if (!$scope.canEdit) {
            return null;
        }

        var newLoc = _layouts.getNewChildLocation2(thing);
        if (x || y) {
            newLoc = new go.Point(x, y);
        }
        var data = _.extend(getNewThingData(), {
            group: thing.data.key,
            text: name || 'Part',
            loc: go.Point.stringify(newLoc)
        });
        _diagram.model.addNodeData(data);
        _layouts.setDescendantLayouts(thing, thing.data.layout);
        var child = _diagram.findNodeForData(data);
        child.updateTargetBindings();
        return child;
    };

    this.createRThing = function(link, name) {
        if (!$scope.canEdit) {
            return null;
        }

        // console.log('createRThing, link: ' + link + ', name: ' + name);
        // don't allow multiple R-things
        if (link.isLabeledLink) {
            // console.log('cannot create RThing, link is already labeled');
            return;
        }

        var data = _.extend(getNewThingData(), {
            text: name || 'Relationship Idea',
            //isLinkLabel: true,     // deprecated as of goJS 1.3
            category: "LinkLabel", // new as of goJS 1.3
            loc: '0 0'
        });
        _diagram.model.startTransaction("create R Thing");
        _diagram.model.addNodeData(data);
        var key = _diagram.model.getKeyForNodeData(data);
        var node = _diagram.findPartForKey(key);
        node.labeledLink = link;
        _diagram.model.commitTransaction("create R Thing");
        _diagram.updateAllTargetBindings();

        return _diagram.findNodeForData(data);
    };

    // ---------- creating things with specified names/locations - for use by generator and tests ------------

    this.createThing = function(x, y, name, layout) {
        group = _diagram.toolManager.clickCreatingTool.insertPart(new go.Point(x, y));
        _diagram.model.setDataProperty(group.data, 'text', name);
        if (layout) {
            _diagram.model.setDataProperty(group.data, 'layout', layout);
        }
        return group;
    };

    this.createRLinkWithRThing = function(thing1, thing2, name) {
        var link = self.createRLink(thing1, thing2);
        return self.createRThing(link, name);
    };

    // returns the linkData object for the new link
    this.createRLink = function(thing1, thing2) {
        _diagram.model.startTransaction('add link');
        var data = {
            type: 'noArrows',
            from: thing1.data.key,
            to: thing2.data.key,
            fromPort: 'R',
            toPort: 'R'
        };
        _diagram.model.addLinkData(data);
        _diagram.model.commitTransaction('add link');
        return _diagram.findLinkForData(data);
    };

    // returns the linkData object for the new link
    this.createPLink = function(thing1, thing2) {
        _diagram.model.startTransaction('add link');
        var data = {
            type: 'noArrows',
            from: thing1.data.key,
            to: thing2.data.key,
            fromPort: 'P',
            toPort: 'P',
            category: 'P'
        };
        _diagram.model.addLinkData(data);
        _diagram.model.commitTransaction('add link');
        _diagram.model.setDataProperty(thing1.data, 'pExpanded', true);
        return _diagram.findLinkForData(data);
    };

    // ------------- moving things in the model structure -------------------

    // returns a go.List of the items in the current selection that are Groups
    function getSelectedGroups() {
        var it = _diagram.selection.iterator;
        var members = new go.List();
        while (it.next()) {
            var part = it.value;
            if (part instanceof go.Group) {
                members.add(part);
            }
        }
        return members;
    }

    // drag to S
    this.addSelectedThingsAsChildrenOf = function(group) {
        var newMembers = getSelectedGroups();

        // check existing members so we can calculate layout
        var oldMemberBounds = self.safeRect(_diagram.computePartsBounds(group.memberParts));

        // NB: this is subject to validation by CommandHandler.isValidMember,
        // so for example, members of members of newMembers will not be added as members
        group.addMembers(newMembers);

        _layouts.layoutNewMembersRelativeTo(newMembers, group, oldMemberBounds);

        _diagram.clearSelection();
    };

    // drag to D
    this.addSelectedThingsAsSistersOf = function(group) {
        var oldMembers = getSelectedGroups();

        // if dragging to top level, move dragged things so they don't overlap the former parent
        if (!group.containingGroup) {
            // check existing members so we can calculate layout
            var oldMembersBounds = _diagram.computePartsBounds(oldMembers);
            // NB: oldMembers can be on multiple levels, so not clear which level to use for rescaling old members after drag
            var oldMembersLevel = _layouts.computeLevel(oldMembers.first());

            var it = oldMembers.iterator;
            while (it.next()) {
                var member = it.value;
                member.containingGroup = null;
            }
            _layouts.layoutOldMembersOutsideOf(oldMembers, group, oldMembersBounds, oldMembersLevel);
        }
        // if not dragging to top level, place dragged things after former parent in outline
        else {
            var it2 = oldMembers.iterator;
            while (it2.next()) {
                var member2 = it2.value;
                member2.containingGroup = group.containingGroup;
                self.moveSiblingNextTo(member2, group, self.RIGHT);
            }
        }
        _diagram.clearSelection();
    };


    // for dragging parts within a system - side is LEFT or RIGHT (i.e. above or below, resp. in inventory layout)
    this.addSelectedThingAsOrderedSisterOf = function(group, side) {
        //console.log('addSelectedThingAsOrderedSisterOf, side: ' + side);
        var thing = self.getUniqueThingSelected();
        if (!thing) {
            return;
        }
        self.moveSiblingNextTo(thing, group, side);
    };

    // moves the first thing (sibling) to be after the second thing (group)
    // in the part ordering - they are assumed to be siblings
    // side is LEFT or RIGHT
    this.moveSiblingNextTo = function(sibling, group, side) {
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
                    if (side == self.LEFT) {
                        memberOrder.add(sibling);
                        _diagram.model.setDataProperty(sibling.data, 'order', order++);
                        memberOrder.add(member);
                        _diagram.model.setDataProperty(member.data, 'order', order++);
                    } else {
                        memberOrder.add(member);
                        _diagram.model.setDataProperty(member.data, 'order', order++);
                        memberOrder.add(sibling);
                        _diagram.model.setDataProperty(sibling.data, 'order', order++);
                    }
                }
                // don't re-add the moved thing, it was added above
                else if (member != sibling) {
                    memberOrder.add(member);
                    _diagram.model.setDataProperty(member.data, 'order', order++);
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

    this.addThingAsRThing = function(thing, link) {
        thing.labeledLink = link;
        thing.updateTargetBindings();
    };

    // D corner handler (single click)
    this.toggleDFlag = function(thing) {
        _diagram.model.setDataProperty(thing.data, 'dflag', !thing.data.dflag);
        thing.updateTargetBindings();
    };

    // S corner handler (single click)
    this.toggleSExpansion = function(thing) {
        var isExpanded = !(thing.data && !thing.data.sExpanded); // expand by default if property not present
        _diagram.model.setDataProperty(thing.data, 'sExpanded', !isExpanded);
        thing.updateTargetBindings();
        _ui.showCornerTip(thing, 'S');
    };

    // P corner handler (single click)
    this.togglePExpansion = function(thing) {
        _diagram.model.setDataProperty(thing.data, 'pExpanded', !self.pIsExpanded(thing));
        thing.updateTargetBindings();
        _ui.showCornerTip(thing, "P");
    };

    this.pIsExpanded = function(group) {
        return group.data && group.data.pExpanded === true;
    };

    // ---------------------- undo/redo --------------------

    this.canUndo = function() {
        return _diagram.commandHandler.canUndo();
    };

    this.undo = function() {
        _diagram.commandHandler.undo();
        _diagram.layoutDiagram(true);
    };

    this.canRedo = function() {
        return _diagram.commandHandler.canRedo();
    };

    this.redo = function() {
        _diagram.commandHandler.redo();
        _diagram.layoutDiagram(true);
    };

    this.refresh = function() {
        _diagram.updateAllTargetBindings();
        _diagram.layoutDiagram(true);
    };

    // ------------------- utility ----------------------

    // check for a rect with NaN X/Y/W/H coords, so we can do stuff with it such as unionRect
    // (NaN,NaN,0,0) => (0,0,0,0)
    this.safeRect = function(rect) {
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

    this.loadModel = function() {
        $('#map-model-debug').val(_diagram.model.toJson());
    };

    this.saveModel = function() {
        _diagram.model = go.Model.fromJson($('#map-model-debug').val());
        _diagram.updateAllTargetBindings();
        _diagram.model.addChangedListener(_autosave.modelChanged);
        _autosave.saveOnModelChanged = true;
    };
};