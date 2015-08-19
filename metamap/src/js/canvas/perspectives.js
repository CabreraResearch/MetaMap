// functions for editing perspectives AND distinctions, which work similarly in the UI

SandbankEditor.Perspectives = function($scope, map) {

    var self = this;

    // temporary state flag for adding/removing P/D selections programmatically
    var selectingLinkedThings = false;

    this.init = function() {};

    // called when a tab is opened or closed
    this.currentTabChanged = function(newValue, oldValue) {
        //console.log('Perspectives, currentTabChanged');
        if (newValue == map.ui.TAB_ID_PERSPECTIVES) { // opening perspectives
            setPorDThing('P');
            map.setEditingBlocked(true);
        } else if (oldValue == map.ui.TAB_ID_PERSPECTIVES) { // closing perspectives
            saveLinks('P');
            map.setEditingBlocked(false);
        } else if (newValue == map.ui.TAB_ID_DISTINCTIONS) { // opening distinctions
            setPorDThing('D');
            map.setEditingBlocked(true);
        } else if (oldValue == map.ui.TAB_ID_DISTINCTIONS) { // closing distinctions
            saveLinks('D');
            map.setEditingBlocked(false);
        }
    };

    this.handleDiagramEvent = function(eventName, e) {
        if (eventName == 'ChangedSelection') {
            if (map.ui.currentTabIs(map.ui.TAB_ID_PERSPECTIVES) || map.ui.currentTabIs(map.ui.TAB_ID_DISTINCTIONS)) {
                updateLinks();
            }
        }
    };

    // ---------- P/D Editor state

    this.isInPOrDEditorMode = function() {
        return map.ui.state.perspectivePointKey !== null || map.ui.state.distinctionThingKey !== null;
    };

    this.isInPEditorMode = function() {
        return map.ui.state.perspectivePointKey !== null;
    };

    this.isInDEditorMode = function() {
        return map.ui.state.distinctionThingKey !== null;
    };

    this.isPEditorPoint = function(group) {
        return map.ui.state.perspectivePointKey == group.data.key;
    };

    this.isDEditorThing = function(group) {
        return map.ui.state.distinctionThingKey == group.data.key;
    };

    // NB: this is called via map.getCornerFunction, so we get the extra corner arg, which we can ignore
    this.setPEditorPoint = function(thing, corner) {
        if ($scope.canEdit) {
            map.ui.openTab(map.ui.TAB_ID_PERSPECTIVES);
        }
    };

    this.setDEditorThing = function(thing) {
        if ($scope.canEdit) {
            // NB: need to select only this thing, since this is invoked
            // by a control-click, which will not automatically select just it
            map.diagram.clearSelection();
            thing.isSelected = true;
            map.ui.openTab(map.ui.TAB_ID_DISTINCTIONS);
        }
    };

    // -----------------------

    this.isPerspectivePoint = function(group) {
        var links = group.findLinksOutOf();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == 'P') {
                return true;
            }
        }
        return false;
    };

    this.isSelectedPerspectiveView = function(group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == 'P' && map.pIsExpanded(link.fromNode) && link.fromNode.isSelected) {
                return true;
            }
        }
        return false;
    };

    this.isToggledPerspectiveView = function(group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == 'P' && map.pIsExpanded(link.fromNode)) {
                return true;
            }
        }
        return false;
    };

    this.isMouseOverPerspectiveView = function(group) {
        var links = group.findLinksInto();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == 'P' && link.fromNode == map.ui.mouseOverGroup) {
                return true;
            }
        }
        return false;
    };

    this.getPerspectiveViewWeight = function(group) {
        var mode = map.ui.getMapEditorOptions().perspectiveMode;
        if (mode == 'spotlight' || mode == 'both') {
            return (self.isSelectedPerspectiveView(group) ? 1 : 0) +
                (self.isToggledPerspectiveView(group) ? 1 : 0) +
                (self.isMouseOverPerspectiveView(group) ? 1 : 0);
        } else {
            return 0;
        }
    };

    // -----------------------

    // category is "P" or "D" (perspectives or distinctions)
    function setPorDThing(category) {
        // if already set, must do save perspectives or save distinctions
        if (map.ui.state.perspectivePointKey || map.ui.state.distinctionThingKey)
            return;

        var thing = map.diagram.selection.first();
        //console.log('setPorDThing: ' + thing);
        if (thing instanceof go.Group) {
            var key = thing.data.key;
            if (category == "P") {
                map.ui.state.perspectivePointKey = key;
            } else if (category == "D") {
                map.ui.state.distinctionThingKey = key;
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
        if (map.ui.state.perspectivePointKey) {
            pOrDThing = map.diagram.findNodeForKey(map.ui.state.perspectivePointKey);
            category = "P";
        } else if (map.ui.state.distinctionThingKey) {
            pOrDThing = map.diagram.findNodeForKey(map.ui.state.distinctionThingKey);
            category = "D";
        }

        var addLinksTo = new go.List();
        var removeLinks = new go.List();

        // iterate through all things
        if (category) {
            var layers = map.diagram.layers;
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
                                if (link.fromNode.data.key == pOrDThing.data.key && link.data.category == category)
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
            map.diagram.model.startTransaction('add link');
            var to = adds.value;
            //console.log('updateLinks: adding link from ' + pOrDThing + ' to ' + to);
            if (category == "D" && pOrDThing.data.key == to.data.key) {
                pOrDThing.isSelected = false;
                alert("You can't distinguish a thing from itself!");
                continue;
            }
            map.diagram.model.addLinkData({
                from: pOrDThing.data.key,
                to: to.data.key,
                fromPort: category,
                toPort: category,
                category: category
            });
            map.diagram.model.commitTransaction('add link');
        }
        var removes = removeLinks.iterator;
        while (removes.next()) {
            var remove = removes.value;
            //console.log('updateLinks: removing link from ' + remove.fromNode + ' to ' + remove.toNode);
            map.diagram.model.startTransaction('remove link');
            map.diagram.remove(remove);
            map.diagram.model.removeLinkData(remove.data);
            map.diagram.model.commitTransaction('remove link');
        }

        // show links
        map.diagram.updateAllTargetBindings();
    }

    function saveLinks(category) {
        var pOrDThing = null;
        if (category == "P") {
            pOrDThing = map.diagram.findNodeForKey(map.ui.state.perspectivePointKey);
            map.ui.state.perspectivePointKey = null;
        } else if (category == "D") {
            pOrDThing = map.diagram.findNodeForKey(map.ui.state.distinctionThingKey);
            map.ui.state.distinctionThingKey = null;
        }

        map.diagram.clearSelection();
        map.diagram.updateAllTargetBindings();
    }

    function selectLinkedThingsFor(group, category) {
        selectingLinkedThings = true;
        map.diagram.clearSelection();

        var links = group.findLinksOutOf();
        while (links.next()) {
            var link = links.value;
            if (link.data.category == category)
                link.toNode.isSelected = true;
        }

        selectingLinkedThings = false;
    }
};