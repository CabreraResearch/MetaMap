let TABS = require('../constants/tabs.js');
let go = window.go;

class UI {
    constructor(editor, map) {
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

    // ----------- handle bottom tabs ('sliders') -------------

    // in the following functions, ID is e.g. 'history-tab' (ID of one of the .bottom-tab's)

    // this is called by map.currentTabChanged, which is triggered by a this.$watch
    currentTabChanged(newValue, oldValue) {
        //console.log('ui, currentTabChanged: ' + newValue);
        this.state.currentTab = newValue;
    }

    currentTabIs(tabID) {
        return this.currentTab === tabID;
    }

    openTab(tabID) {
        this.currentTab = tabID;
    }

    closeTab(tabID) {
        this.state.currentTab = null; // TODO: trigger autosave
        this.currentTab = null;
    }

    disableTab(tabID) {
        // prevent opening other tabs when in P or D editor
        if (this.currentTab === TABS.TAB_ID_PERSPECTIVES || this.currentTab === TABS.TAB_ID_DISTINCTIONS) {
            return true;
        }
        return false;
    }

    toggleTab(tabID) {
        if (this.currentTab === tabID) {
            this.currentTab = null;
        } else if (!this.disableTab(tabID)) {
            this.currentTab = tabID;
        }
    }

    toggleNavigator() {
        this.state.showNavigator = !this.state.showNavigator;
    }

    toggleZoomingToRegion() {
        this.zoomingToRegion = !this.zoomingToRegion;
    }

    getStateData() {
        
    }

    setStateData() {
        
    }

    // ----------------- zooming functions -------------------
    canZoomIn() {
        return this.map.getDiagram().scale < 32;
    }

    canZoomOut() {
        return this.map.getDiagram().scale > 0.25;
    }

    zoomIn() {
        let diagram = this.map.getDiagram();
        if (diagram.scale < 32) {
            let vb = diagram.viewportBounds.copy();
            diagram.scale = diagram.scale * 2;
            diagram.centerRect(vb);
        }
    }

    zoomOut() {
        let diagram = this.map.getDiagram();
        if (diagram.scale > 0.25) {
            let vb = diagram.viewportBounds.copy();
            diagram.scale = diagram.scale / 2;
            diagram.centerRect(vb);
        }
    }

    maybeZoomToRegion() {
        let diagram = this.map.getDiagram();
        // this flag is set by the toolbar button
        if (this.zoomingToRegion) {
            this.zoomingToRegion = false;
            console.log('zoomToRegion, selection count: ' + diagram.selection.count);
            let rect = diagram.computePartsBounds(diagram.selection);
            diagram.zoomToRect(rect);
        }
    }

    resetZoom() {
        let diagram = this.map.getDiagram();
        //let rect = diagram.computePartsBounds(diagram.nodes).copy();
        let rect = this.map.safeRect(this.map.computeMapBounds());
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

    // ------------ thing options (layout) ----------------

    getSelectedThingsOrDefaultLayout () {
        let sl = this.getSelectedThingsLayout();
        if (sl) {
            return sl;
        } else {
            return mapEditorOptions.defaultThingLayout;
        }
    }

    // returns a non-null value only if all selected items are groups with the same layout
    getSelectedThingsLayout () {
        let diagram = this.map.getDiagram();
        if (!diagram || diagram.selection.count < 1)
            return null;

        let layout = null;
        let it = diagram.selection.iterator;
        while (it.next()) {
            if (!it.value instanceof go.Group)
                return null;
            let group = it.value;
            //console.log('getSelectedThingsLayout, it.value: ' + group);
            let groupLayout = (group.data ? group.data.layout : null);
            if (layout !== null && groupLayout !== layout)
                return null;
            layout = groupLayout;
        }
        //console.log('getSelectedThingsLayout: ' + layout);

        return layout;
    }

    // sets the layout of all selected things to the given layout
    setSelectedThingsLayout (layoutName) {
        let diagram = this.map.getDiagram();
        let it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Group) {
                let group = it.value;
                diagram.model.setDataProperty(group.data, 'layout', layoutName);
                this.map.layouts.setDescendantLayouts(group, group.data.layout);
                this.map.refresh();
            }
        }
    }

    // ------------ relationship options (direction) ----------------

    getSelectedRelationshipsOrDefaultDirection () {
        let sd = this.getSelectedRelationshipsDirection();
        if (sd) {
            return sd;
        } else {
            return mapEditorOptions.defaultRelationshipDirection;
        }
    }

    // returns a non-null value only if all selected items are relationships with the same direction
    getSelectedRelationshipsDirection() {
        let diagram = this.map.getDiagram();
        if (!diagram || diagram.selection.count < 1)
            return null;

        let type = null;
        let it = diagram.selection.iterator;
        while (it.next()) {
            if (!it.value instanceof go.Link)
                return null;
            let link = it.value;
            let linkType = (link.data ? link.data.type : null);
            if (type !== null && linkType !== type)
                return null;
            type = linkType;
        }

        return type;
    }

    // sets the direction of all selected relationships to the given direction
    setSelectedRelationshipsDirection (direction) {
        let diagram = this.map.getDiagram();
        //diagram.model.startTransaction('change relationship direction');
        let it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Link) {
                //diagram.model.startTransaction('change link type');
                diagram.model.setDataProperty(it.value.data, 'type', direction);
                //diagram.model.commitTransaction('change link type');
            }
        }
        //diagram.commitTransaction('change relationship direction');
    }

    // ------- handle corner clicks and double clicks --------
    handleCornerClick (corner, thing) {
        //console.log('handleCornerClick: corner = ' + corner + ', cornerClicked = ' + _cornerClicked);
        // assume it's a single click, and set handler
        this._cornerClickedCnt = 1;
        let _cornerFunction = this.getCornerFunction(corner, this._cornerClickedCnt);
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
        let timer = setTimeout(() => {
            // ding! invoke it
            if (_cornerFunction === this.showCornerTip) {
                this.showCornerTip(thing, corner);
            } else {
                this.execCornerFunction(corner, this._cornerClickedCnt, thing); // don't pass the corner arg to things like createChild that have a different second arg
            }
            this._cornerClickedCnt = 0;
            this._cornerClicked = null;
        }, this._cornerTimeout);
    }

    execCornerFunction(corner, clicks, ...args) {
        if (corner === 'D') {
            return (clicks === 1 ? this.showCornerTip(...args) : this.map.createSister(...args));
        } else if (corner === 'S') {
            return (clicks === 1 ? this.map.toggleSExpansion(...args) : this.map.createChild(...args));
        } else if (corner === 'R') {
            return (clicks === 1 ? this.showCornerTip(...args) : this.map.createRToSister(...args));
        } else if (corner === 'P') {
            return (clicks === 1 ? this.map.togglePExpansion(...args) : this.map.perspectives.setPEditorPoint(...args));
        } else if (corner === '') { // click on text
            return (clicks === 1 ? this.showCornerTip(...args) : this.editText(...args));
        } else {
            return () => {
                console.log('getCornerFunction: no function found for corner: ' + corner + '!');
            };
        }
    }

    getCornerFunction(corner, clicks) {
        if (corner === 'D') {
            return (clicks === 1 ? this.showCornerTip : this.map.createSister);
        } else if (corner === 'S') {
            return (clicks === 1 ? this.map.toggleSExpansion : this.map.createChild);
        } else if (corner === 'R') {
            return (clicks === 1 ? this.showCornerTip : this.map.createRToSister);
        } else if (corner === 'P') {
            return (clicks === 1 ? this.map.togglePExpansion : this.map.perspectives.setPEditorPoint);
        } else if (corner === '') { // click on text
            return (clicks === 1 ? this.showCornerTip : this.editText);
        } else {
            return () => {
                console.log('getCornerFunction: no function found for corner: ' + corner + '!');
            };
        }
    }

    // NB: in this case the thing is actually the TextBox, except in outline layout it is a Panel if the box is double-clicked...
    editText(thing, corner) {
        if (!this.canEdit) {
            return null;
        }

        console.log('editText, thing: ' + thing);
        if (thing instanceof go.Panel) { // outline layout
            let part = thing.part;
            console.log('editText, part: ' + part);
            if (part instanceof go.Group && part.data && (part.data.layout === 'left' || part.data.layout === 'right')) {
                let textBlockName = 'externaltext-' + part.data.layout;
                let text = thing.part.findObject(textBlockName);
                if (text) {
                    thing = text;
                }
            }
        }
        this.map.getDiagram().commandHandler.editTextBlock(thing);
    }


    // ---------------- help tip functions - see also user.js, views/maps/help_tab ---------------

    // shows thingTip or one of the cornerXTips
    showCornerTip(thing, corner) {
        //console.log('showCornerTip');
        if (corner === '') {
            this.showHelpTip('thingTip');
        } else {
            this.showHelpTip('corner' + corner + 'Tip');
        }
    }

    showHelpTip(tip) {
        //console.log('showHelpTip: ' + tip);

        // don't show help if in presenter
        if (this.currentTabIs(TABS.TAB_ID_PRESENTER)) {
            return;
        }

        this.helpTip = tip;
        //this.safeApply();
        $('#help-tip').show();

        setTimeout( () => {
            $('#help-tip').fadeOut(500, () => {
                this.helpTip = null;
                //this.safeApply();
            });
        }, 5000);
    }

}

module.exports = UI;