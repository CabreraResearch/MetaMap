const EditorConfig = require('./EditorConfig.js');

const MILLION = 1000 * 1000;
const LEFT = 'left';
const RIGHT = 'right';
const go = window.go;


class Map {
    constructor(config = {}) {
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
        _.each(this.getComponents(), (component) => {
            if (component && component.init)
                component.init();
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

    printSlides() {
        this.presenter.createSlideThumbnails();

        setTimeout(() => {
            window.print();
        }, 500);
    }

    exportToImage(format) {

        this.imageExportLoading = true;
        $('#export-image img').remove();
        this.templates.showExportFooter();

        let rect = this.getDiagram().computePartsBounds(this.getDiagram().nodes).copy();

        let imageMB = rect.width * rect.height * 4 / MILLION; // 4 bytes/pixel
        //console.log('imageMB: ' + imageMB);

        // make the max size of the image 10MB
        // pngSize = imageMB * scale * scale
        // so max scale = sqrt(pngSize / imageMB)
        // These calculations don't seem to be right, but in practice using 500 here
        // we get a scale of 2.43 for an image 19984 x 3424 pixels
        // which results in a file size of 1.88 MB at 32 bits/pixel...
        // OR 28380 x 5196 pixels, scale = 3.41 => file size = 3.49 MB
        let scale = 4;
        if (imageMB) {
            scale = Math.min(4, Math.sqrt(50 / imageMB));
        }

        //console.log('image dimensions: ' + rect.width + ' x ' + rect.height + ', image bytes: ' + (rect.width * rect.height * 4) + 
        //        ', imageMB: ' + imageMB + ', scale: ' + scale);

        this.showImageExport = true;

        let partsToExport = new go.List();
        partsToExport.addAll(this.getDiagram().nodes);
        partsToExport.addAll(this.getDiagram().links);
        partsToExport.remove(this.presenter.slideBlocker);

        let doImage = $timeout(() => {
            let img = this.getDiagram().makeImage({
                parts: partsToExport,
                maxSize: new go.Size((rect.width + 200) * scale, (rect.height + 200) * scale),
                scale: scale,
                padding: 100 * scale,
                background: '#ffffff'
            });

            $('#export-image').append(img);
            this.imageExportLoading = false;

            this.templates.hideExportFooter();
        }, 100);
    }

    // ------------ component accessors ----------------

    getComponents() {
        return [
            this.analytics,
            this.attachments,
            this.autosave,
            this.generator,
            // this._history, 
            this.layouts,
            this.perspectives,
            this.presenter,
            this.standards,
            this.templates,
            this.tests,
            this.ui
        ];
    }

    get currentTab() {
        return this._currentTab;
    }

    set currentTab(val) {
        // watch for tab changes
        // TODO: restore non-Angular version of this
        //this._editor.$watch('currentTab', function(newValue, oldValue) {
        //    this.currentTabChanged(newValue, oldValue);
        //});
        this.currentTabChanged(this._currentTab, val);
        this._currentTab = val;
    }

    // this is called by a this._editor.$watch in init()
    currentTabChanged(newValue, oldValue) {
        // console.log('currentTabChanged, newValue: ' + newValue + ', oldValue: ' + oldValue);
        // notify any interested components
        _.each(this.getComponents(), (component) => {
            if (component && component.currentTabChanged) {
                component.currentTabChanged(newValue, oldValue);
            }
        });

        //this._editor.safeApply();
    }

    getDiagram() {
        return this._diagram;
    }

    // misc. tool configuration
    initTools() {
        // disable clicking on TextBlocks to edit - we will invoke editing in other ways
        this._diagram.allowTextEdit = false;

        // select text when activating editor; 
        // use shift-enter to create new lines, enter to finish editing (NB: editor has multiline=true)
        let textTool = this._diagram.toolManager.textEditingTool;
        textTool.doActivate = () => {
            go.TextEditingTool.prototype.doActivate.call(textTool);
            if (textTool.defaultTextEditor) {
                textTool.defaultTextEditor.select();

                textTool.defaultTextEditor.addEventListener("keydown", (e) => {
                    if (e.which === 13 && !e.shiftKey) {
                        go.TextEditingTool.prototype.acceptText.call(textTool, go.TextEditingTool.LostFocus);
                    }
                });
            }
        };

        // handle delete key on Mac (default behavior only uses fn-Delete to delete from canvas)
        this._diagram.commandHandler.doKeyDown = () => {
            let e = this._diagram.lastInput;
            let cmd = this._diagram.commandHandler;
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

    // ----------- handling of DiagramEvents --------------------

    addDiagramListeners() {

        // DiagramEvents to be handled here or by a component
        let diagramEvents = [
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
        _.each(diagramEvents, (eventName) => {
            this._diagram.addDiagramListener(eventName, (e) => {
                this.broadcastDiagramEvent(eventName, e);
            });
        });

        this._diagram.addDiagramListener("BackgroundContextClicked", (e) => {
            // TODO: turn off in production
            //console.log('diagram model:' + this._diagram.model.toJson());
        });
    }

    // broadcasts the given DiagramEvent (see apidocs for go.DiagramEvent)
    // to any components that may be interested, including this one.
    broadcastDiagramEvent(eventName, e) {
        this.handleDiagramEvent(eventName, e);
        _.each(this.getComponents(), (component) => {
            if (component && component.handleDiagramEvent)
                component.handleDiagramEvent(eventName, e);
        });

    }

    handleDiagramEvent(eventName, e) {
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

    // handle zoom to region if applicable
    changedSelection(e) {
        //console.log('this.changedSelection');
        this._diagram.updateAllTargetBindings();
        this.ui.maybeZoomToRegion();
        if (this.relationshipsSelected()) {
            this.ui.showHelpTip('relationshipTip');
        }
    }

    partCreated(e) {
        //console.log('Map, PartCreated');
        let group = e.subject;
        if (!(group instanceof go.Group)) {
            return;
        }
        this._diagram.model.setDataProperty(group.data, 'layout', this.editorOptions.defaultThingLayout || 'left');
        this.layouts.setNewPartLocationData(e);
    }

    // fix link ports when a link is created - 
    // the P and R ports both cover the whole node, and the P port is on top of the R port, 
    // so both P and R links get the toPort set to P by default.
    linkDrawn(e) {
        let link = e.subject;
        console.log('linkDrawn, link: ' + link + ', fromPort: ' + link.fromPortId + ', toPort: ' + link.toPortId);
        if (link.fromPortId === 'P') {
            this._diagram.model.startTransaction("change link category");
            this._diagram.model.setDataProperty(link.data, 'toPort', 'P');
            this._diagram.model.setDataProperty(link.data, 'category', 'P');
            this._diagram.model.commitTransaction("change link category");
        }
            // prevent links from R to P
        else if (link.fromPortId === 'R') {
            this._diagram.model.startTransaction("change link toPort");
            this._diagram.model.setDataProperty(link.data, 'toPort', 'R');
            this._diagram.model.commitTransaction("change link toPort");
        }
    }

    // fix link ports when a link is relinked - 
    // dragging either end of an R-link to another node will set the corresponding port to P, 
    // since P port is on top of R port, so we reset both ports to R if the category is not P.
    linkRelinked(e) {
        let link = e.subject;
        if (!link.data.category || link.data.category !== 'P') {
            this._diagram.model.setDataProperty(link.data, 'fromPort', 'R');
            this._diagram.model.setDataProperty(link.data, 'toPort', 'R');
        }
    }

    setNewLinkDirection(e) {
        let link = e.subject;
        if (link.fromPortId === 'R') {
            this._diagram.model.startTransaction("change link direction");
            this._diagram.model.setDataProperty(link.data, 'type', this.editorOptions.defaultRelationshipDirection);
            this._diagram.commitTransaction("change link direction");
        }
    }

    clipboardChanged(e) {
        let parts = e.subject.iterator;
        while (parts.next()) {
            let part = parts.value;
            if (part instanceof go.Group) {
                console.log('clipboardChanged: part ' + part + ', mainpanel scale: ' + part.findObject('mainpanel').scale);
            }
        }
    }

    // NB: this is called when parts are copied by control-drag, NOT when the copy button is clicked
    selectionCopied(e) {
        console.log('selectionCopied');
        let parts = e.subject.iterator;
        while (parts.next()) {
            let part = parts.value;
            if (part instanceof go.Group && part.isTopLevel) {
                let loc = go.Point.parse(part.data.loc);
                console.log('selectionCopied: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                this._diagram.model.setDataProperty(part.data, 'loc', (loc.x + 50) + ' ' + (loc.y + 50));
                part.updateTargetBindings('loc');
            }
        }
    }

    clipboardPasted(e) {
        let parts = e.subject.iterator;
        while (parts.next()) {
            let part = parts.value;
            if (part instanceof go.Group && part.isTopLevel) {
                let loc = go.Point.parse(part.data.loc);
                //console.log('clipboardPasted: updating loc of part ' + part + ' = ' + loc + ', scale: ' + part.scale);
                this._diagram.model.setDataProperty(part.data, 'loc', (loc.x + 50) + ' ' + (loc.y + 50));
                part.updateTargetBindings('loc');
            }
        }
    }

    // computes the bounds of all groups in the diagram - this includes all ideas/things, 
    // and excludes nodes, including slides, the slide blocker, and the export footer
    computeMapBounds() {
        let groups = new go.List(go.Group);
        let nodes = this._diagram.nodes;
        while (nodes.next()) {
            if (nodes.value instanceof go.Group) {
                groups.add(nodes.value);
            }
        }
        return this._diagram.computePartsBounds(groups).copy(); // return a mutable rect
    }

    // ------------ what is currently selected? ----------------

    // returns true if all selected items are things (i.e. Groups), including r-things
    thingsSelected() {
        if (!this._diagram || this._diagram.selection.count < 1)
            return false;

        let it = this._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Group))
                return false;
        }

        return true;
    }

    // returns true if exactly one thing (Group) is selected
    thingSelected() {
        return this._diagram && this._diagram.selection.count === 1 && this._diagram.selection.first() instanceof go.Group;
    }

    // if a single group is selected, returns it, otherwise returns null
    getUniqueThingSelected() {
        if (this._diagram && this._diagram.selection.count === 1 && this._diagram.selection.first() instanceof go.Group) {
            return this._diagram.selection.first();
        } else {
            return null;
        }
    }

    thingsSelectedAreMembersOf(group) {
        if (!this._diagram || this._diagram.selection.count < 1)
            return false;

        let it = this._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Group) || it.value.containingGroup !== group)
                return false;
        }

        return true;
    }

    thingsSelectedAreDescendantsOf(group) {
        if (!this._diagram || this._diagram.selection.count < 1)
            return false;

        let it = this._diagram.selection.iterator;
        while (it.next()) {
            let ancestors = this.layouts.getAncestorGroups(it.value);
            if (_.indexOf(ancestors, group) === -1)
                return false;
        }

        return true;
    }

    thingsSelectedIncludeSlide() {
        if (!this._diagram || this._diagram.selection.count < 1)
            return false;

        let it = this._diagram.selection.iterator;
        while (it.next()) {
            if (it.value.data && it.value.data.category === 'slide') {
                return true;
            }
        }

        return false;
    }

    // returns true if all selected items are relationships (i.e. Links)
    relationshipsSelected() {
        if (!this._diagram || this._diagram.selection.count < 1)
            return false;

        let it = this._diagram.selection.iterator;
        while (it.next()) {
            if (!(it.value instanceof go.Link) || !this.layouts.isRLink(it.value))
                return false;
        }

        return true;
    }

    // returns true if exactly one relationship (Link) is selected
    relationshipSelected() {
        return this._diagram && this._diagram.selection.count === 1 && this._diagram.selection.first() instanceof go.Link;
    }

    // ------------ load and initialize model -------------

    load() {
        let url = this._editor.mapUrl + '.json';
        if (this._editor.sandbox) {
            url = this._editor.mapUrl + '.json?sandbox=1';
        }
        //TODO: restore non-Angular http-get for map data
        let data = { "map": { "metadata": { "sandbox": false, "id": 5547, "name": "Untitled Map", "url": "/maps/5547", "canEdit": true, "updatedAt": "2015-05-15T12:29:40.721-04:00", "updatedBy": null, "updatedByName": null, "userTags": [] }, "data": { "class": "go.GraphLinksModel", "nodeIsLinkLabelProperty": "isLinkLabel", "linkLabelKeysProperty": "labelKeys", "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [{ "key": 1, "text": "New Idea", "isGroup": true, "loc": "0 0", "layout": "left", "sExpanded": true, "pExpanded": true }], "linkDataArray": [] }, "stateData": null, editorOptions: null, "analytics": {}, "versions": [] } };
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

    loadForSandbox() {
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

    // fix any structural problems in the model before displaying it
    checkModel() {
        // change "isLinkLabel" property to category:"LinkLabel" (change as of goJS 1.3)
        _.each(this._diagram.model.nodeDataArray, (nodeData, index, list) => {
            if (nodeData.isLinkLabel) {
                delete nodeData.isLinkLabel;
                nodeData.category = "LinkLabel";
            }
        });

        // check for the link label (r-thing) for a link being the same as the from or to node 
        // - this can cause infinite recursion in thinks like layout.getScale
        _.each(this._diagram.model.linkDataArray, (linkData, index, list) => {
            let badLabelKeys = [];
            _.each(linkData.labelKeys, (key, index2, list2) => {
                if (key === linkData.from || key === linkData.to) {
                    console.log('labelKey same as from or to of link: ' + key);
                    badLabelKeys.push(key);
                }
            });
            linkData.labelKeys = _.difference(linkData.labelKeys, badLabelKeys);
        });
    }

    // loads other data besides the diagram model from the json object returned by maps/show.json
    // - this includes points, badges, versions, and map analytics
    // NB: points and badges are set at page load time in layouts/user and users/badges, but
    // we also need to be able to update them here after an autosave

    // TODO: is this still all needed with the newer userProfile stuff?
    loadMapExtraData(mapData) {
        //console.log('map.loadMapExtraData, mapData: ' + mapData);
        this._editor.mapUserTags = mapData.metadata.userTags; // TODO: is this used anywhere?

        //this._editor.map.getHistory().versionList = mapData.versions;
        this.analytics.mapAnalytics = mapData.analytics;
    }

    // loads model data for an individual version and displays it
    // NB: this also disables autosave; load() must be called to re-enable it
    loadVersion(id) {
        $http.get('/mapthis._versions/' + id).then((response) => {
            if (response.status === 200) {
                try {
                    //console.log('loaded map version with ID: ' + id);
                    this._diagram.model = go.Model.fromJson(response.data);
                    this._diagram.updateAllTargetBindings();
                    this._diagram.undoManager.isEnabled = false;
                    this.autosave.saveOnModelChanged = false;
                    this._diagram.layoutDiagram(true);
                    this._diagram.isReadOnly = true;
                } catch (e) {
                    alert('Could not load MetaMap version');
                    console.error(e.message);
                }
            }
        });
    }

    // set whether editing capability is temporarily suspended -
    // this is distinct from the global this._editor.canEdit setting,
    // which if false prevents editing at all times
    setEditingBlocked(val) {
        if (this._editor.canEdit) {
            this._diagram.isReadOnly = val;
        }
    }

    // ------------- creating things in the model -------------------

    // default properties for all new Things (groups) - note that these can be overridden if needed
    getNewThingData() {
        return {
            text: 'Idea',
            isGroup: true,
            layout: this.editorOptions.defaultThingLayout || 'left',
            sExpanded: true,
            pExpanded: true
        };
    }

    createSister(thing) {
        if (!this._editor.canEdit) {
            return null;
        }

        let newLoc = this.layouts.getNewSisterLocation(thing);
        let data = _.extend(this.getNewThingData(), {
            group: thing.data.group,
            text: 'Idea',
            loc: go.Point.stringify(newLoc)
        });
        this._diagram.model.addNodeData(data);
        let newSister = this._diagram.findNodeForData(data);

        // put new sister right after thing (not as the last sibling)
        if (thing.containingGroup) {
            this.moveSiblingNextTo(newSister, thing, RIGHT);
        }
        return newSister;
    }

    createRToSister(thing) {
        if (!this._editor.canEdit) {
            return null;
        }

        let thingKey = this._diagram.model.getKeyForNodeData(thing.data);
        //console.log('thingKey: ' + thingKey);
        let newLoc = this.layouts.getNewSisterLocation(thing, true); // withR = true
        let data = _.extend(this.getNewThingData(), {
            group: thing.data.group,
            text: 'Idea',
            loc: go.Point.stringify(newLoc)
        });
        this._diagram.model.addNodeData(data);
        let newSister = this._diagram.findNodeForData(data);
        let groupKey = this._diagram.model.getKeyForNodeData(data);

        // create link
        let linkData = {
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

    createChild(thing, name, x, y) {
        if (!this._editor.canEdit) {
            return null;
        }

        let newLoc = this.layouts.getNewChildLocation2(thing);
        if (x || y) {
            newLoc = new go.Point(x, y);
        }
        let data = _.extend(this.getNewThingData(), {
            group: thing.data.key,
            text: name || 'Part',
            loc: go.Point.stringify(newLoc)
        });
        this._diagram.model.addNodeData(data);
        this.layouts.setDescendantLayouts(thing, thing.data.layout);
        let child = this._diagram.findNodeForData(data);
        child.updateTargetBindings();
        return child;
    }

    createRThing(link, name) {
        if (!this._editor.canEdit) {
            return null;
        }

        // console.log('createRThing, link: ' + link + ', name: ' + name);
        // don't allow multiple R-things
        if (link.isLabeledLink) {
            // console.log('cannot create RThing, link is already labeled');
            return;
        }

        let data = _.extend(this.getNewThingData(), {
            text: name || 'Relationship Idea',
            //isLinkLabel: true,     // deprecated as of goJS 1.3
            category: "LinkLabel", // new as of goJS 1.3
            loc: '0 0'
        });
        this._diagram.model.startTransaction("create R Thing");
        this._diagram.model.addNodeData(data);
        let key = this._diagram.model.getKeyForNodeData(data);
        let node = this._diagram.findPartForKey(key);
        node.labeledLink = link;
        this._diagram.model.commitTransaction("create R Thing");
        this._diagram.updateAllTargetBindings();

        return this._diagram.findNodeForData(data);
    }

    // ---------- creating things with specified names/locations - for use by generator and tests ------------

    createThing(x, y, name, layout) {
        let group = this._diagram.toolManager.clickCreatingTool.insertPart(new go.Point(x, y));
        this._diagram.model.setDataProperty(group.data, 'text', name);
        if (layout) {
            this._diagram.model.setDataProperty(group.data, 'layout', layout);
        }
        return group;
    }

    createRLinkWithRThing(thing1, thing2, name) {
        let link = this.createRLink(thing1, thing2);
        return this.createRThing(link, name);
    }

    // returns the linkData object for the new link
    createRLink(thing1, thing2) {
        this._diagram.model.startTransaction('add link');
        let data = {
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

    // returns the linkData object for the new link
    createPLink(thing1, thing2) {
        this._diagram.model.startTransaction('add link');
        let data = {
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

    // ------------- moving things in the model structure -------------------

    // returns a go.List of the items in the current selection that are Groups
    getSelectedGroups() {
        let it = this._diagram.selection.iterator;
        let members = new go.List();
        while (it.next()) {
            let part = it.value;
            if (part instanceof go.Group) {
                members.add(part);
            }
        }
        return members;
    }

    // drag to S
    addSelectedThingsAsChildrenOf(group) {
        let newMembers = this.getSelectedGroups();

        // check existing members so we can calculate layout
        let oldMemberBounds = this.safeRect(this._diagram.computePartsBounds(group.memberParts));

        // NB: this is subject to validation by CommandHandler.isValidMember,
        // so for example, members of members of newMembers will not be added as members
        group.addMembers(newMembers);

        this.layouts.layoutNewMembersRelativeTo(newMembers, group, oldMemberBounds);

        this._diagram.clearSelection();
    }

    // drag to D
    addSelectedThingsAsSistersOf(group) {
        let oldMembers = this.getSelectedGroups();

        // if dragging to top level, move dragged things so they don't overlap the former parent
        if (!group.containingGroup) {
            // check existing members so we can calculate layout
            let oldMembersBounds = this._diagram.computePartsBounds(oldMembers);
            // NB: oldMembers can be on multiple levels, so not clear which level to use for rescaling old members after drag
            let oldMembersLevel = this.layouts.computeLevel(oldMembers.first());

            let it = oldMembers.iterator;
            while (it.next()) {
                let member = it.value;
                member.containingGroup = null;
            }
            this.layouts.layoutOldMembersOutsideOf(oldMembers, group, oldMembersBounds, oldMembersLevel);
        }
            // if not dragging to top level, place dragged things after former parent in outline
        else {
            let it2 = oldMembers.iterator;
            while (it2.next()) {
                let member2 = it2.value;
                member2.containingGroup = group.containingGroup;
                this.moveSiblingNextTo(member2, group, RIGHT);
            }
        }
        this._diagram.clearSelection();
    }


    // for dragging parts within a system - side is LEFT or RIGHT (i.e. above or below, resp. in inventory layout)
    addSelectedThingAsOrderedSisterOf(group, side) {
        //console.log('addSelectedThingAsOrderedSisterOf, side: ' + side);
        let thing = this.getUniqueThingSelected();
        if (!thing) {
            return;
        }
        this.moveSiblingNextTo(thing, group, side);
    }

    // moves the first thing (sibling) to be after the second thing (group)
    // in the part ordering - they are assumed to be siblings
    // side is LEFT or RIGHT
    moveSiblingNextTo(sibling, group, side) {
        let parent = group.containingGroup;
        console.log('moveSiblingNextTo, sibling: ' + sibling + ', group: ' + group + ', parent: ' + parent + ', sibling.containingGroup: ' + sibling.containingGroup);

        if (!parent || sibling.containingGroup !== parent) {
            console.error('Cannot do moveSiblingNextTo on non-siblings or top-level groups');
        }

        // create new member order
        let memberOrder = new go.List();
        let it = parent.memberParts;
        let order = 0;
        while (it.next()) {
            let member = it.value;
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
        let newIt = memberOrder.iterator;
        while (newIt.next()) {
            let member2 = newIt.value;
            member2.containingGroup = null;
        }

        // add new members
        newIt.reset();
        while (newIt.next()) {
            let member3 = newIt.value;
            member3.containingGroup = parent;
        }
    }

    addThingAsRThing(thing, link) {
        thing.labeledLink = link;
        thing.updateTargetBindings();
    }

    // D corner handler (single click)
    toggleDFlag(thing) {
        this._diagram.model.setDataProperty(thing.data, 'dflag', !thing.data.dflag);
        thing.updateTargetBindings();
    }

    // S corner handler (single click)
    toggleSExpansion(thing) {
        let isExpanded = !(thing.data && !thing.data.sExpanded); // expand by default if property not present
        this._diagram.model.setDataProperty(thing.data, 'sExpanded', !isExpanded);
        thing.updateTargetBindings();
        this.ui.showCornerTip(thing, 'S');
    }

    // P corner handler (single click)
    togglePExpansion(thing) {
        this._diagram.model.setDataProperty(thing.data, 'pExpanded', !this.pIsExpanded(thing));
        thing.updateTargetBindings();
        this.ui.showCornerTip(thing, "P");
    }

    pIsExpanded(group) {
        return group.data && group.data.pExpanded === true;
    }

    // ---------------------- undo/redo --------------------

    canUndo() {
        return this._diagram.commandHandler.canUndo();
    }

    undo() {
        this._diagram.commandHandler.undo();
        this._diagram.layoutDiagram(true);
    }

    canRedo() {
        return this._diagram.commandHandler.canRedo();
    }

    redo() {
        this._diagram.commandHandler.redo();
        this._diagram.layoutDiagram(true);
    }

    refresh() {
        this._diagram.updateAllTargetBindings();
        this._diagram.layoutDiagram(true);
    }

    // ------------------- utility ----------------------

    // check for a rect with NaN X/Y/W/H coords, so we can do stuff with it such as unionRect
    // (NaN,NaN,0,0) => (0,0,0,0)
    safeRect(rect) {
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

    // ------------------- debug map model ----------------------
    loadModel() {
        $('#map-model-debug').val(this._diagram.model.toJson());
    }

    saveModel() {
        this._diagram.model = go.Model.fromJson($('#map-model-debug').val());
        this._diagram.updateAllTargetBindings();
        this._diagram.model.addChangedListener(this.autosave.modelChanged);
        this.autosave.saveOnModelChanged = true;
    }
}

module.exports = Map;
