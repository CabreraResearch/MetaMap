const go = window.go;

// functions for creating and manipulating the map (i.e. Diagram)

SandbankEditor.Map = function(editor) {

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

    ret.getComponents = function() {
        return [
            ret._analytics,
            ret._attachments,
            ret._autosave,
            ret._generator,
            // _history, 
            ret._layouts,
            ret._perspectives,
            ret._presenter,
            ret._standards,
            ret._templates,
            ret._tests,
            ret._ui
        ];
    }

    ret.getAnalytics = function() {
        return ret._analytics;
    };
    ret.getAttachments = function() {
        return ret._attachments;
    };
    ret.getAutosave = function() {
        return ret._autosave;
    };
    ret.getGenerator = function() {
        return ret._generator;
    };
    // ret.getHistory = function () { return _history; };
    ret.getLayouts = function() {
        return ret._layouts;
    };
    ret.getPerspectives = function() {
        return ret._perspectives;
    };
    ret.getPresenter = function() {
        return ret._presenter;
    };
    ret.getStandards = function() {
        return ret._standards;
    };
    ret.getTemplates = function() {
        return ret._templates;
    };
    ret.getTests = function() {
        return ret._tests;
    };
    ret.getUi = function() {
        return ret._ui;
    };

    // -------------- map init ------------------

    ret.init = function() {

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
        _.each(ret.getComponents(), function(component) {
            if (component && component.init)
                component.init();
        });

        // create diagram
        ret._diagram = new go.Diagram("diagram");
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
    ret.currentTabChanged = function(newValue, oldValue) {
        // console.log('currentTabChanged, newValue: ' + newValue + ', oldValue: ' + oldValue);
        // notify any interested components
        _.each(ret.getComponents(), function(component) {
            if (component && component.currentTabChanged) {
                component.currentTabChanged(newValue, oldValue);
            }
        });

    };

    ret.getDiagram = function() {
        return ret._diagram;
    };

    // misc. tool configuration
    ret.initTools = function() {
        // disable clicking on TextBlocks to edit - we will invoke editing in other ways
        ret._diagram.allowTextEdit = false;

        // select text when activating editor; 
        // use shift-enter to create new lines, enter to finish editing (NB: editor has multiline=true)
        var textTool = ret._diagram.toolManager.textEditingTool;
        textTool.doActivate = function() {
            go.TextEditingTool.prototype.doActivate.call(textTool);
            if (textTool.defaultTextEditor) {
                textTool.defaultTextEditor.select();

                textTool.defaultTextEditor.addEventListener("keydown", function(e) {
                    if (e.which == 13 && !e.shiftKey) {
                        go.TextEditingTool.prototype.acceptText.call(textTool, go.TextEditingTool.LostFocus);
                    }
                });
            }
        };

        // handle delete key on Mac (default behavior only uses fn-Delete to delete from canvas)
        ret._diagram.commandHandler.doKeyDown = function() {
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
    }

    // ----------- handling of DiagramEvents --------------------

    ret.addDiagramListeners = function() {

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
            ret._diagram.addDiagramListener(eventName, function(e) {
                ret.broadcastDiagramEvent(eventName, e);
            });
        });

        ret._diagram.addDiagramListener("BackgroundContextClicked", function(e) {
            // TODO: turn off in production
            //console.log('diagram model:' + _diagram.model.toJson());
        });
    }

    // broadcasts the given DiagramEvent (see apidocs for go.DiagramEvent)
    // to any components that may be interested, including ret one.
    ret.broadcastDiagramEvent = function (eventName, e) {
        ret.handleDiagramEvent(eventName, e);
        _.each(ret.getComponents(), function(component) {
            if (component && component.handleDiagramEvent)
                component.handleDiagramEvent(eventName, e);
        });
    }

    ret.handleDiagramEvent = function(eventName, e) {
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
    }

    ret.partCreated = function (e) {
        //console.log('Map, PartCreated');
        var group = e.subject;
        if (!(group instanceof go.Group)) {
            return;
        }
        ret._diagram.model.setDataProperty(group.data, 'layout', ret._ui.getMapEditorOptions().defaultThingLayout || 'left');
        ret._layouts.setNewPartLocationData(e);
    }

    // fix link ports when a link is created - 
    // the P and R ports both cover the whole node, and the P port is on top of the R port, 
    // so both P and R links get the toPort set to P by default.
    ret.linkDrawn = function (e) {
        var link = e.subject;
        console.log('linkDrawn, link: ' + link + ', fromPort: ' + link.fromPortId + ', toPort: ' + link.toPortId);
        if (link.fromPortId == 'P') {
            ret._diagram.model.startTransaction("change link category");
            ret._diagram.model.setDataProperty(link.data, 'toPort', 'P');
            ret._diagram.model.setDataProperty(link.data, 'category', 'P');
            ret._diagram.model.commitTransaction("change link category");
        }
        // prevent links from R to P
        else if (link.fromPortId == 'R') {
            ret._diagram.model.startTransaction("change link toPort");
            ret._diagram.model.setDataProperty(link.data, 'toPort', 'R');
            ret._diagram.model.commitTransaction("change link toPort");
        }
    }

    // fix link ports when a link is relinked - 
    // dragging either end of an R-link to another node will set the corresponding port to P, 
    // since P port is on top of R port, so we reset both ports to R if the category is not P.
    ret.linkRelinked = function(e) {
        var link = e.subject;
        if (!link.data.category || link.data.category !== 'P') {
            ret._diagram.model.setDataProperty(link.data, 'fromPort', 'R');
            ret._diagram.model.setDataProperty(link.data, 'toPort', 'R');
        }
    }

    ret.setNewLinkDirection = function(e) {
        var link = e.subject;
        if (link.fromPortId == 'R') {
            ret._diagram.model.startTransaction("change link direction");
            ret._diagram.model.setDataProperty(link.data, 'type', ret._ui.getMapEditorOptions().defaultRelationshipDirection);
            ret._diagram.commitTransaction("change link direction");
        }
    }

    ret.clipboardChanged = function(e) {
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group) {
                console.log('clipboardChanged: part ' + part + ', mainpanel scale: ' + part.findObject('mainpanel').scale);
            }
        }
    }

    // NB: ret is called when parts are copied by control-drag, NOT when the copy button is clicked
    ret.selectionCopied = function(e) {
        console.log('selectionCopied');
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group && part.isTopLevel) {
                var loc = go.Point.parse(part.data.loc);
                console.log('selectionCopied: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                ret._diagram.model.setDataProperty(part.data, 'loc', (loc.x + 50) + ' ' + (loc.y + 50));
                part.updateTargetBindings('loc');
            }
        }
    }

    ret.clipboardPasted = function(e) {
        var parts = e.subject.iterator;
        while (parts.next()) {
            var part = parts.value;
            if (part instanceof go.Group && part.isTopLevel) {
                var loc = go.Point.parse(part.data.loc);
                //console.log('clipboardPasted: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                ret._diagram.model.setDataProperty(part.data, 'loc', (loc.x + 50) + ' ' + (loc.y + 50));
                part.updateTargetBindings('loc');
            }
        }
    }

    // computes the bounds of all groups in the diagram - ret includes all ideas/things, 
    // and excludes nodes, including slides, the slide blocker, and the export footer
    ret.computeMapBounds = function() {
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
    ret.thingsSelected = function() {
        if (!ret._diagram || ret._diagram.selection.count < 1)
            return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Group))
                return false;
        }

        return true;
    };

    // returns true if exactly one thing (Group) is selected
    ret.thingSelected = function() {
        return ret._diagram  && ret._diagram.selection.count == 1 && ret._diagram.selection.first() instanceof go.Group;
    };

    // if a single group is selected, returns it, otherwise returns null
    ret.getUniqueThingSelected = function() {
        if (ret._diagram  && ret._diagram.selection.count == 1 && ret._diagram.selection.first() instanceof go.Group) {
            return ret._diagram.selection.first();
        } else {
            return null;
        }
    };

    ret.thingsSelectedAreMembersOf = function(group) {
        if (!ret._diagram || ret._diagram.selection.count < 1)
            return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Group) || it.value.containingGroup != group)
                return false;
        }

        return true;
    };

    ret.thingsSelectedAreDescendantsOf = function(group) {
        if (!ret._diagram || ret._diagram.selection.count < 1)
            return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            var ancestors = ret._layouts.getAncestorGroups(it.value);
            if (_.indexOf(ancestors, group) == -1)
                return false;
        }

        return true;
    };

    ret.thingsSelectedIncludeSlide = function() {
        if (!ret._diagram || ret._diagram.selection.count < 1)
            return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            if (it.value.data && it.value.data.category == 'slide') {
                return true;
            }
        }

        return false;
    };

    // returns true if all selected items are relationships (i.e. Links)
    ret.relationshipsSelected = function() {
        if (!ret._diagram || ret._diagram.selection.count < 1)
            return false;

        var it = ret._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Link) || !ret._layouts.isRLink(it.value))
                return false;
        }

        return true;
    };

    // returns true if exactly one relationship (Link) is selected
    ret.relationshipSelected = function() {
        return ret._diagram  && ret._diagram.selection.count == 1 && ret._diagram.selection.first() instanceof go.Link;
    };

    // ------------ load and initialize model -------------

    ret.load = function() {
        var url = editor.mapUrl + '.json';
        if (editor.sandbox) {
            url = editor.mapUrl + '.json?sandbox=1';
        }
        //TODO: restore non-Angular http-get for map data
        var data = { "map": { "metadata": { "sandbox": false, "id": 5547, "name": "Untitled Map", "url": "/maps/5547", "canEdit": true, "updatedAt": "2015-05-15T12:29:40.721-04:00", "updatedBy": null, "updatedByName": null, "userTags": [] }, "data": { "class": "go.GraphLinksModel", "nodeIsLinkLabelProperty": "isLinkLabel", "linkLabelKeysProperty": "labelKeys", "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [{ "key": 1, "text": "New Idea", "isGroup": true, "loc": "0 0", "layout": "left", "sExpanded": true, "pExpanded": true }], "linkDataArray": [] }, "stateData": null, "editorOptions": null, "analytics": {}, "versions": [] } };
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
    }

    ret.loadForSandbox = function() {
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
    ret.checkModel = function() {
        // change "isLinkLabel" property to category:"LinkLabel" (change as of goJS 1.3)
        _.each(ret._diagram.model.nodeDataArray, function(nodeData, index, list) {
            if (nodeData.isLinkLabel) {
                delete nodeData.isLinkLabel;
                nodeData.category = "LinkLabel";
            }
        });

        // check for the link label (r-thing) for a link being the same as the from or to node 
        // - ret can cause infinite recursion in thinks like layout.getScale
        _.each(ret._diagram.model.linkDataArray, function(linkData, index, list) {
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
    // - ret includes points, badges, versions, and map analytics
    // NB: points and badges are set at page load time in layouts/user and users/badges, but
    // we also need to be able to update them here after an autosave

    // TODO: is ret still all needed with the newer userProfile stuff?
    ret.loadMapExtraData = function(mapData) {
            //console.log('map.loadMapExtraData, mapData: ' + mapData);
            editor.mapUserTags = mapData.metadata.userTags; // TODO: is ret used anywhere?

            //$scope.map.getHistory().versionList = mapData.versions;
            editor.map.getAnalytics().mapAnalytics = mapData.analytics;
    };

    // loads model data for an individual version and displays it
    // NB: ret also disables autosave; load() must be called to re-enable it
    ret.loadVersion = function(id) {
        $http.get('/map_versions/' + id).then(function(response) {
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
    ret.setEditingBlocked = function(val) {
        if (editor.canEdit) {
            ret._diagram.isReadOnly = val;
        }
    };

    // ------------- creating things in the model -------------------

    // default properties for all new Things (groups) - note that these can be overridden if needed
    ret.getNewThingData = function() {
        return {
            text: 'Idea',
            isGroup: true,
            layout: ret._ui.getMapEditorOptions().defaultThingLayout || 'left',
            sExpanded: true,
            pExpanded: true
        };
    }

    ret.createSister = function(thing) {
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

    ret.createRToSister = function(thing) {
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

    ret.createChild = function(thing, name, x, y) {
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

    ret.createRThing = function(link, name) {
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
            category: "LinkLabel", // new as of goJS 1.3
            loc: '0 0'
        });
        ret._diagram.model.startTransaction("create R Thing");
        ret._diagram.model.addNodeData(data);
        var key = ret._diagram.model.getKeyForNodeData(data);
        var node = ret._diagram.findPartForKey(key);
        node.labeledLink = link;
        ret._diagram.model.commitTransaction("create R Thing");
        ret._diagram.updateAllTargetBindings();

        return ret._diagram.findNodeForData(data);
    };

    // ---------- creating things with specified names/locations - for use by generator and tests ------------

    ret.createThing = function(x, y, name, layout) {
        group = ret._diagram.toolManager.clickCreatingTool.insertPart(new go.Point(x, y));
        ret._diagram.model.setDataProperty(group.data, 'text', name);
        if (layout) {
            ret._diagram.model.setDataProperty(group.data, 'layout', layout);
        }
        return group;
    };

    ret.createRLinkWithRThing = function(thing1, thing2, name) {
        var link = ret.createRLink(thing1, thing2);
        return ret.createRThing(link, name);
    };

    // returns the linkData object for the new link
    ret.createRLink = function(thing1, thing2) {
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
    ret.createPLink = function(thing1, thing2) {
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
    ret.getSelectedGroups = function() {
        var it = ret._diagram.selection.iterator;
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
    ret.addSelectedThingsAsChildrenOf = function(group) {
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
    ret.addSelectedThingsAsSistersOf = function(group) {
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
    ret.addSelectedThingAsOrderedSisterOf = function(group, side) {
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
    ret.moveSiblingNextTo = function(sibling, group, side) {
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

    ret.addThingAsRThing = function(thing, link) {
        thing.labeledLink = link;
        thing.updateTargetBindings();
    };

    // D corner handler (single click)
    ret.toggleDFlag = function(thing) {
        ret._diagram.model.setDataProperty(thing.data, 'dflag', !thing.data.dflag);
        thing.updateTargetBindings();
    };

    // S corner handler (single click)
    ret.toggleSExpansion = function(thing) {
        var isExpanded = !(thing.data && !thing.data.sExpanded); // expand by default if property not present
        ret._diagram.model.setDataProperty(thing.data, 'sExpanded', !isExpanded);
        thing.updateTargetBindings();
        ret._ui.showCornerTip(thing, 'S');
    };

    // P corner handler (single click)
    ret.togglePExpansion = function(thing) {
        ret._diagram.model.setDataProperty(thing.data, 'pExpanded', !ret.pIsExpanded(thing));
        thing.updateTargetBindings();
        ret._ui.showCornerTip(thing, "P");
    };

    ret.pIsExpanded = function(group) {
        return group.data && group.data.pExpanded === true;
    };

    // ---------------------- undo/redo --------------------

    ret.canUndo = function() {
        return ret._diagram.commandHandler.canUndo();
    };

    ret.undo = function() {
        ret._diagram.commandHandler.undo();
        ret._diagram.layoutDiagram(true);
    };

    ret.canRedo = function() {
        return ret._diagram.commandHandler.canRedo();
    };

    ret.redo = function() {
        ret._diagram.commandHandler.redo();
        ret._diagram.layoutDiagram(true);
    };

    ret.refresh = function() {
        ret._diagram.updateAllTargetBindings();
        ret._diagram.layoutDiagram(true);
    };

    // ------------------- utility ----------------------

    // check for a rect with NaN X/Y/W/H coords, so we can do stuff with it such as unionRect
    // (NaN,NaN,0,0) => (0,0,0,0)
    ret.safeRect = function(rect) {
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

    ret.loadModel = function() {
        $('#map-model-debug').val(ret._diagram.model.toJson());
    };

    ret.saveModel = function() {
        ret._diagram.model = go.Model.fromJson($('#map-model-debug').val());
        ret._diagram.updateAllTargetBindings();
        ret._diagram.model.addChangedListener(ret._autosave.modelChanged);
        ret._autosave.saveOnModelChanged = true;
    };

    return ret;
};