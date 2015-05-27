const go = window.go;

// functions for editing perspectives AND distinctions, which work similarly in the UI
class Perspectives {
    constructor(editor, map) {
        // temporary state flag for adding/removing P/D selections programmatically
        this.selectingLinkedThings = false;

        this._editor = editor;
        this._map = map;
    }

    currentTabChanged(newValue, oldValue) {
        //console.log('Perspectives, currentTabChanged');
        if (newValue === this._map.getUi().TAB_ID_PERSPECTIVES) { // opening perspectives
            this.setPorDThing('P');
            this._map.setEditingBlocked(true);
        } else if (oldValue === this._map.getUi().TAB_ID_PERSPECTIVES) { // closing perspectives
            this.saveLinks('P');
            this._map.setEditingBlocked(false);
        } else if (newValue === this._map.getUi().TAB_ID_DISTINCTIONS) { // opening distinctions
            this.setPorDThing('D');
            this._map.setEditingBlocked(true);
        } else if (oldValue === this._map.getUi().TAB_ID_DISTINCTIONS) { // closing distinctions
            this.saveLinks('D');
            this._map.setEditingBlocked(false);
        }
    }

    handleDiagramEvent(eventName, e) {
        if (eventName === 'ChangedSelection') {
            if (this._map.getUi().currentTabIs(this._map.getUi().TAB_ID_PERSPECTIVES) || this._map.getUi().currentTabIs(this._map.getUi().TAB_ID_DISTINCTIONS)) {
                this.updateLinks();
            }
        }
    }

    // ---------- P/D Editor state

    isInPOrDEditorMode() {
        return this._map.getUi().state.perspectivePointKey || this._map.getUi().state.distinctionThingKey;
    }

    isInPEditorMode() {
        return this._map.getUi().state.perspectivePointKey;
    }

    isInDEditorMode() {
        return this._map.getUi().state.distinctionThingKey;
    }

    isPEditorPoint(group) {
        return this._map.getUi().state.perspectivePointKey === group.data.key;
    }

    isDEditorThing(group) {
        return this._map.getUi().state.distinctionThingKey === group.data.key;
    }

    // NB: this is called via this._map.getCornerFunction, so we get the extra corner arg, which we can ignore
    setPEditorPoint(thing, corner) {
        if (this._editor.canEdit) {
            this._map.getUi().openTab(this._map.getUi().TAB_ID_PERSPECTIVES);
        }
    }

    setDEditorThing(thing) {
        if (this._editor.canEdit) {
            // NB: need to select only this thing, since this is invoked
            // by a control-click, which will not automatically select just it
            this._map.getDiagram().clearSelection();
            thing.isSelected = true;
            this._map.getUi().openTab(this._map.getUi().TAB_ID_DISTINCTIONS);
        }
    }

    // -----------------------

    isPerspectivePoint(group) {
        var links = group.findLinksOutOf();
        while (links.next()) {
            var link = links.value;
            if (link.data.category === 'P') {
                return true;
            }
        }
        return false;
    }

    isSelectedPerspectiveView(group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category === 'P' && this._map.pIsExpanded(link.fromNode) && link.fromNode.isSelected) {
                return true;
            }
        }
        return false;
    }

    isToggledPerspectiveView(group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category === 'P' && this._map.pIsExpanded(link.fromNode)) {
                return true;
            }
        }
        return false;
    }

    isMouseOverPerspectiveView(group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category === 'P' && link.fromNode === this._map.getUi().mouseOverGroup) {
                return true;
            }
        }
        return false;
    }

    getPerspectiveViewWeight(group) {
        var mode = this._map.getUi().getMapEditorOptions().perspectiveMode;
        if (mode === 'spotlight' || mode === 'both') {
            return (this.isSelectedPerspectiveView(group) ? 1 : 0) +
                (this.isToggledPerspectiveView(group) ? 1 : 0) +
                (this.isMouseOverPerspectiveView(group) ? 1 : 0);
        } else {
            return 0;
        }
    }

    // -----------------------

    // category is "P" or "D" (perspectives or distinctions)
    setPorDThing(category) {
        // if already set, must do save perspectives or save distinctions
        if (this._map.getUi().state.perspectivePointKey || this._map.getUi().state.distinctionThingKey)
            return;

        var thing = this._map.getDiagram().selection.first();
        //console.log('setPorDThing: ' + thing);
        if (thing instanceof go.Group) {
            var key = thing.data.key;
            if (category === "P") {
                this._map.getUi().state.perspectivePointKey = key;
            } else if (category === "D") {
                this._map.getUi().state.distinctionThingKey = key;
            }

            // select views/others
            this.selectLinkedThingsFor(thing, category);
        }
    }

    // this is called when the selection changes - if the thing is set,
    // adds/removes D/P links according to what is selected; otherwise
    // just shows/hides D/P links for the selected thing(s)
    updateLinks() {
        if (this.selectingLinkedThings) // selection is being changed programmatically, so don't respond
            return;

        var pOrDThing = null;
        var category = null;
        if (this._map.getUi().state.perspectivePointKey) {
            pOrDThing = this._map.getDiagram().findNodeForKey(this._map.getUi().state.perspectivePointKey);
            category = "P";
        } else if (this._map.getUi().state.distinctionThingKey) {
            pOrDThing = this._map.getDiagram().findNodeForKey(this._map.getUi().state.distinctionThingKey);
            category = "D";
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
                                if (link.fromNode.data.key === pOrDThing.data.key && link.data.category === category)
                                    existingLink = link;
                            }

                            // decide whether to add or remove a link to the part, depending on whether 
                            // it is selected and whether a link exists
                            if (!existingLink && part.isSelected)
                                addLinksTo.add(part);
                            else if (existingLink && !part.isSelected)
                                removeLinks.add(existingLink);
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
            if (category === "D" && pOrDThing.data.key === to.data.key) {
                pOrDThing.isSelected = false;
                alert("You can't distinguish a thing from itself!");
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

    saveLinks(category) {
        var pOrDThing = null;
        if (category === "P") {
            pOrDThing = this._map.getDiagram().findNodeForKey(this._map.getUi().state.perspectivePointKey);
            this._map.getUi().state.perspectivePointKey = null;
        } else if (category === "D") {
            pOrDThing = this._map.getDiagram().findNodeForKey(this._map.getUi().state.distinctionThingKey);
            this._map.getUi().state.distinctionThingKey = null;
        }

        this._map.getDiagram().clearSelection();
        this._map.getDiagram().updateAllTargetBindings();
    }

    selectLinkedThingsFor(group, category) {
        this.selectingLinkedThings = true;
        this._map.getDiagram().clearSelection();

        var links = group.findLinksOutOf();
        while (links.next()) {
            var link = links.value;
            if (link.data.category === category)
                link.toNode.isSelected = true;
        }

        this.selectingLinkedThings = false;
    }
}

module.exports = Perspectives;
