const go = window.go;

// layouts used in the editor, for the diagram or individual Groups, plus layout-related functions
class Layouts {
    constructor(editor, map) {
        this._editor = editor;
        this._map = map;
        go.Layout.call(this);
    }

    handleDiagramEvent(eventName, e) {
        let diagram = this._map.getDiagram();
        if (eventName === 'InitialLayoutCompleted') {
            diagram.updateAllTargetBindings();
            diagram.layoutDiagram(true);
        } else if (eventName === 'SelectionMoved') {
            this.updateSelectedPartLocationData(e);
            this._map.getDiagram().layoutDiagram(true);
        } else if (eventName === 'SelectionDeleted') {
            diagram.updateAllTargetBindings();
        } else if (eventName === 'PartCreated') {
            //console.log('Layouts, PartCreated');
            // setNewPartLocationData(e);
        } else if (eventName === 'PartResized') {
            this.setResizedPartDimensionData(e);
        } else if (eventName === 'LinkDrawn') {
            this.adjustLinkLayout(e.subject);
        } else if (eventName === 'LinkRelinked') {
            this.adjustLinkLayout(e.subject);
        }
    }

    // ------------ handle location/size attributes for nodes ---------------

    // only update w/h for slides, as all other node types have fixed dimensions according to the templates
    setResizedPartDimensionData(e) {
        let diagram = this._map.getDiagram();
        let node = e.subject;
        if (node && node.category === 'slide') {
            //console.log('PartResized: ' + node.part.actualBounds);
            diagram.model.setDataProperty(node.data, 'width', node.part.actualBounds.width);
            diagram.model.setDataProperty(node.data, 'height', node.part.actualBounds.height);
        }
    }

    // set the 'loc' attribute for a new top-level node (created by double-clicking), to support freehand layout
    setNewPartLocationData(e) {
        let node = e.subject;
        if (node && node.part) {
            if (node instanceof go.Group) {
                this._map.getDiagram().model.setDataProperty(node.data, 'loc', node.part.location.x + ' ' + node.part.location.y);
            }
        }
    }

    // updates the 'loc' attribute for each selected part, to support freehand layout (does not apply to slides)
    updateSelectedPartLocationData(e) {
        let diagram = this._map.getDiagram();
        let it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Group) { // thing
                let part = it.value;
                let parentX = 0;
                let parentY = 0;
                if (part.containingGroup) {
                    parentX = part.containingGroup.location.x;
                    parentY = part.containingGroup.location.y;
                }
                console.log('moving group, subject: ' + e.subject + ', part: ' + part + ', height: ' + part.part.desiredSize.height + ', location: ' + part.part.location);
                if (!isNaN(part.location.x)) {
                    diagram.model.setDataProperty(part.data, 'loc', (part.location.x - parentX) + ' ' + (part.location.y - parentY));
                }
            }
        }
    }

    // ----------- changing layouts of things and their descendants ----------------

    fromAndToNodesAreVisible(link) {
        return link.fromNode &&
            link.toNode &&
            !this.hasCollapsedAncestor(link.fromNode) &&
            !this.hasCollapsedAncestor(link.toNode);
    }

    labelNodeIsVisible(link) {
        return link.labelNodes.count && link.labelNodes.first().visible;
    }

    hasCollapsedAncestor(group) {
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

    getHighestAncestorWithLayout(group, layoutNames) {
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

    areSistersInInventoryLayout(group1, group2) {
        return group1.containingGroup === group2.containingGroup &&
            group1.containingGroup &&
            _.contains(['left', 'right'], group1.containingGroup.data.layout);
    }

    isNotWithinInventoryLayout(group) {
        return !this.isWithinInventoryLayout(group);
    }

    isRThingWithinInventoryLayout(group) {
        return group.isLinkLabel && this.isWithinInventoryLayout(group);
    }

    isWithinInventoryLayout(group) {
        return this.isWithinLayout(group, ['left', 'right']);
    }

    isWithinLeftInventoryLayout(group) {
        return this.isWithinLayout(group, ['left']);
    }

    isWithinRightInventoryLayout(group) {
        return this.isWithinLayout(group, ['right']);
    }

    isWithinFreehandLayout(group) {
        return this.isWithinLayout(group, ['freehand']);
    }

    isWithinStackedLayout(group) {
        return this.isWithinLayout(group, ['stacked']);
    }

    isWithinLayout(group, layoutNames) {
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

    showLeftTextBlock(group) {
        return this.isWithinRightInventoryLayout(group) &&
            !this.isWithinStackedLayout(group) &&
            !group.isLinkLabel;
    }

    showRightTextBlock(group) {
        return this.isWithinLeftInventoryLayout(group) &&
            !this.isWithinStackedLayout(group) &&
            !group.isLinkLabel;
    }

    setDescendantLayouts(group, layoutName) {
        if (layoutName === 'left' || layoutName === 'right' || layoutName === 'stacked') {
            let it = group.memberParts.iterator;
            while (it.next()) {
                let part = it.value;
                if (part instanceof go.Group && !part.isLinkLabel) {
                    part.data.layout = layoutName;
                    this.setDescendantLayouts(part, layoutName);
                }
            }
        } else if (layoutName === 'freehand') {
            // stacked?
        }
    }

    disableLayoutForSelectedThings(layoutName) {
        let it = this._map.getDiagram().selection.iterator;
        if (!it.count) {
            return true;
        }
        while (it.next()) {
            if (!(it.value instanceof go.Group)) {
                return true;
            } else {
                let group = it.value;
                if (this.isWithinLayout(group, ['left', 'right', 'stacked'])) {
                    return true;
                }
            }
        }
        return false;
    }

    // -------------- scaling functions, etc. ----------------------

    // Computes the level of this group
    computeLevel(group) {
        //console.log('computeLevel, part: ' + part + ', containingGroup: ' + part.containingGroup);
        if (!(group instanceof go.Group) || group.containingGroup === null) {
            return 0;
        } else {
            return this.computeLevel(group.containingGroup) + 1;
        }
    }

    // gets the basic scaling for thing squares, by level
    getThingScale(level) {
        return Math.pow(0.45, level); // 1, .45, .2025, .091125, ...
    }

    // this is only used for groups
    getScale(group, visitedGroupKeys) {
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

            if (group.labeledLink) { // R-thing
                let fromScale = this.getScale(group.labeledLink.fromNode, visitedGroupKeys);
                let toScale = this.getScale(group.labeledLink.toNode, visitedGroupKeys);
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

    

    

    getExternalTextScale(group) {
        return 1 - 0.1 * this.computeLevel(group);
    }

    getLinkStrokeWidth(link) {
        let fromScale = this.getScale(link.fromNode);
        let toScale = this.getScale(link.toNode);
        return (link.isSelected ? 4 : 2) * Math.min(fromScale, toScale); // 2, .9, ...
    }

    // scale arrowheads based on the smallest to/from node, 
    // or just the To node for P links
    getArrowheadScale(link) {
        let fromScale = this.getScale(link.fromNode);
        let toScale = this.getScale(link.toNode);
        let minScale = Math.min(fromScale, toScale);
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

    // -------------- creating new things ----------------------

    // Returns a location for a new sister group (thing) to the given one, 
    // which will not hide any existing things (overlap is allowed). 
    // The returned coordinates are absolute for a top-level group, 
    // or relative to the parent otherwise - suitable for use with FreehandDiagramLayout
    // or FreehandLayout, resp.
    getNewSisterLocation(group, withR) {
        let diagram = this._map.getDiagram();
        // if we are within another group, things are in absolute coordinates
        // and sisters are placed above the thing; otherwise relative and below...
        let inGroup = (group.containingGroup !== null);
        // ... except if withR is true, we go to the right instead of above or below.

        // start below if in group, else above; or to the right if withR
        let x, y, w, h;
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
            let rect = new go.Rect(x, y, w, h);
            rect.grow(h / 10, w / 10, h / 10, w / 10);
            let parts = diagram.findObjectsIn(rect, null, this.isGroup);
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
        if (inGroup) { // make coordinates relative
            x -= group.containingGroup.location.x;
            y -= group.containingGroup.location.y;
        }
        return new go.Point(x + Math.random(), y + Math.random());
    }

    // Returns a location for a new child group (thing) to the given one,
    // which will not hide any existing children (overlap is allowed).
    // The returned coordinates are relative to the parent group - suitable for use with FreehandLayout.
    getNewChildLocation(group) {
        let groupBounds = group.actualBounds;
        // NB: all x/y locations are relative to the group location
        let x = 0;
        let y = groupBounds.height * 1.1;
        let w, h;
        let members = group.memberParts;
        // keep testing new rectangles until we find one that doesn't overlap with any existing member of the group
        while (true) {
            members.reset();
            let overlaps = false;
            let member, newRect, memberRect;
            while (members.next()) {
                member = members.value;
                let memberBounds = member.actualBounds;
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

    // a simpler version of getNewChildLocation that places the child outside the bounds of the existing children
    getNewChildLocation2(group) {
        let groupBounds = group.actualBounds;
        let childBounds = this._map.safeRect(this._map.getDiagram().computePartsBounds(group.memberParts));
        let x = 0;
        let y = 0;
        if (!group.memberParts.count) {
            y = groupBounds.height * 1.2;
        } else {
            y = groupBounds.height * 1.4 + childBounds.height;
        }
        //console.log('getNewChildLocation2, childBounds: ' + childBounds + ', groupBounds: ' + groupBounds + ', x: ' + x + ', y: ' + y);
        return new go.Point(x, y);
    }

    // move all the given new member groups so that their locations are relative to that of 
    // the parent and its previously existing members, and scaled down appropriately
    layoutNewMembersRelativeTo(newMembers, parent, oldMemberBounds) {
        // how big was the parent system before the new groups were added?
        let systemBounds = parent.actualBounds.unionRect(oldMemberBounds);

        // figure out old/new origins - place new origin below existing system
        let oldBounds = this._map.getDiagram().computePartsBounds(newMembers);
        let oldOrigin = new go.Point(oldBounds.x, oldBounds.y);
        let newOrigin = new go.Point(0, systemBounds.height * 1.2);
        console.log('layoutNewMembersRelativeTo, systemBounds: ' + systemBounds + ', oldBounds: ' + oldBounds +
            ', oldOrigin: ' + oldOrigin + ', newOrigin: ' + newOrigin);

        // figure out new scaled locations
        // NB: we can assume newMembers are all one level down from parent (see this._map.addSelectedThingsAsChildrenOf), 
        // so we just multiply by the standard scale factor
        let it = newMembers.iterator;
        while (it.next()) {
            let group = it.value;
            let groupBounds = group.actualBounds;
            let newX = newOrigin.x + (groupBounds.x - oldOrigin.x) * 0.45;
            let newY = newOrigin.y + (groupBounds.y - oldOrigin.y) * 0.45;
            let newLoc = go.Point.stringify(new go.Point(newX, newY));
            console.log('layoutNewMembersRelativeTo, groupBounds: ' + groupBounds + ', newLoc: ' + newLoc);
            this._map.getDiagram().model.setDataProperty(group.data, 'loc', newLoc);
        }
    }

    // move all the given old member groups so that their locations are absolute and above
    // the parent, and scaled up appropriately
    layoutOldMembersOutsideOf(oldMembers, parent, oldMembersBounds, oldMembersLevel) {
        // figure out scale factor (members can be dragged up multiple levels, unlike dragging into S)
        let scaleFactor = Math.pow(0.45, oldMembersLevel - this.computeLevel(parent));
        console.log('layoutOldMembersOutsideOf, scaleFactor: ' + scaleFactor);

        // figure out old/new origins - place new origin above parent, with vertical space for scaled-up oldMembers
        let parentBounds = parent.actualBounds;
        let oldOrigin = new go.Point(oldMembersBounds.x, oldMembersBounds.y);
        let newOrigin = new go.Point(parentBounds.x, parentBounds.y - oldMembersBounds.height * 1.2 / scaleFactor);

        // figure out new scaled locations
        let it = oldMembers.iterator;
        while (it.next()) {
            let group = it.value;
            let groupBounds = group.actualBounds;
            let newX = newOrigin.x + (groupBounds.x - oldOrigin.x) / scaleFactor;
            let newY = newOrigin.y + (groupBounds.y - oldOrigin.y) / scaleFactor;
            let newLoc = go.Point.stringify(new go.Point(newX, newY));
            console.log('layoutOldMembersOutsideOf, parentBounds: ' + parentBounds + ', oldMembersBounds: ' + oldMembersBounds +
                ', newOrigin: ' + newOrigin + ', groupBounds: ' + groupBounds + ', newLoc: ' + newLoc);
            this._map.getDiagram().model.setDataProperty(group.data, 'loc', go.Point.stringify(newLoc));
        }
    }

    // ----------------- accessors -------------------

    // returns the appropriate layout class by abbreviated name
    getLayout(layoutName) {
        const LeftInventoryLayout = require('./layouts/LeftInventoryLayout.js');
        const RightInventoryLayout = require('./layouts/RightInventoryLayout.js');
        const StackedLayout = require('./layouts/StackedLayout.js');
        const FreehandLayout = require('./layouts/FreehandLayout.js');
        if (layoutName === 'freehand')
            return new FreehandLayout();
        else if (layoutName === 'right')
            return new RightInventoryLayout();
        else if (layoutName === 'stacked')
            return new StackedLayout();
        else
            return new LeftInventoryLayout();
    }

    getFreehandDiagramLayout() {
        const FreehandDiagramLayout = require('./layouts/FreehandDiagramLayout.js');
        return new FreehandDiagramLayout();
    }

    // --------------------------------------------------------------

    // returns true if the to and from nodes for the link have a common ancestor group with one of the given layout names.
    // TODO: verify logic - what if there are multiple such ancestors? - this should return the highest one...
    getCommonAncestorWithLayout(group1, group2, layoutNames) {
        let ancestors1 = this.getAncestorGroups(group1);
        let ancestors2 = this.getAncestorGroups(group2);
        let commonAncestors = _.intersection(ancestors1, ancestors2);
        let layoutAncestors = _.filter(commonAncestors, function (group) {
            return _.indexOf(layoutNames, group.data.layout) !== -1;
        });
        if (layoutAncestors.length) {
            return layoutAncestors[0];
        } else {
            return null;
        }
    }

    // returns the ancestors of this group, including itself
    getAncestorGroups(group) {
        let ancestors = [group];
        let g = group;
        while (g.containingGroup) {
            ancestors.push(g.containingGroup);
            g = g.containingGroup;
        }
        return ancestors;
    }

    // --------------------------------------------------------------




    // if any group in the given Iterator does not have a location (data.loc), set one
    // that doesn't overlap with the other members
    validateGroupLocations(groups) {

    }

    // --------------------------------------------------------------



    // ------------------------ link routing and visibility ------------------------------

    // adjust the routing, visibility and other properties of a link according to various structural criteria
    adjustLinkLayout(link) {
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
        let inventoryAncestor = this.getCommonAncestorWithLayout(link.fromNode, link.toNode, ['left', 'right']);
        let stackedAncestor = this.getCommonAncestorWithLayout(link.fromNode, link.toNode, ['stacked']);
        let hidePLink = (link.data && link.data.category === 'P' && !this._map.templates.showPLink(link));
        let crowdedRThing = this.hasCrowdedRThing(link);

        // see if this is one of multiple links between the same two nodes
        let snpos = this.getSameNodesLinkPosition(link);
        let isMultiLink = (snpos.count > 1);
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

    // TODO: detect when the R-thing overlaps both from and to nodes, so we can change the link routing
    hasCrowdedRThing(link) {
        return false;
    }

    showLabelNodes(link, show) {
        //console.log('showLabelNodes, link: ' + link + ', show: ' + show);
        let it = link.labelNodes;
        if (it) {
            while (it.next()) {
                let group = it.value;
                group.visible = show;
                if (show) {
                    group.layout.doLayout(group);
                }
            }
        }
    }

    // if link is between two things in the same inventory layout (single or multiple),
    // make the line more or less circular on the appropriate side
    applyInventoryCurveRouting(link, snpos, ancestorLayout) {
        if (ancestorLayout === 'left') {
            link.fromSpot = go.Spot.Left;
            link.toSpot = go.Spot.Left;
        } else if (ancestorLayout === 'right') {
            link.fromSpot = go.Spot.Right;
            link.toSpot = go.Spot.Right;
        }

        // aspect ratio for the link curves - make this smaller to make them taller, larger to make them fatter
        let curveRatio = 0.6;

        let y1 = link.fromNode.actualBounds.y;
        let y2 = link.toNode.actualBounds.y;

        let yDiff = Math.abs(y2 - y1);
        let c = (yDiff === 0 ? 50 : Math.floor(yDiff * curveRatio)) + 100 * (snpos.index / snpos.count);
        //console.log("yDiff = " + yDiff + ', c = ' + c + ' (' + link.fromNode.data.text + ' - ' + p1 + ' - to ' + link.toNode.data.text + ' - ' + p2 + ')');

        link.curve = go.Link.Bezier;
        link.fromEndSegmentLength = c;
        link.toEndSegmentLength = c;
    }

    // if non-inventory link is one of multiple ones between same nodes, make it curved
    applyMultilinkCurveRouting(link, snpos) {
        link.fromSpot = go.Spot.Default;
        link.toSpot = go.Spot.Default;
        link.curve = go.Link.Bezier;
        // curviness values based on number of links:
        // 2: -25 25
        // 3: -50 0 50
        // 4: -100 -50 0 50 100
        let rangeSize = 10 * (snpos.count - 1);
        let rangeIncrement = 10;
        if (snpos.hasRThing) {
            rangeSize = 100 * (snpos.count - 1);
            rangeIncrement = 100;
        }

        // adjust curviness for smaller scales
        let linkScaleFactor = this.getLinkStrokeWidth(link) / 2; // 2 is max stroke width
        rangeSize *= linkScaleFactor;
        rangeIncrement *= linkScaleFactor;

        let rangeStart = 0 - rangeSize / 2;

        link.curviness = (rangeStart + rangeIncrement * snpos.index) * snpos.orientation;
        // console.log('applyMultilinkCurveRouting, link: ' + link + ', curviness: ' + link.curviness); 
    }

    // do normal straight lines for freehand layout, or links between descendants of things with different layouts
    applyStraightRouting(link) {
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
    getSameNodesLinkPosition(link) {
        let linksByNodes = this.getLinksByNodes(true);
        // get links with the same key as this one (connecting same nodes)
        let sameLinks = _.where(linksByNodes, {
            key: this.getSameNodesLinkKey(link)
        });

        // default return value
        let snpos = {
            index: 0,
            count: 1,
            orientation: 1,
            hasRThing: false
        };
        // set index, count, orientation
        for (let i = 0; i < sameLinks.length; i++) {
            if (sameLinks[i].link === link) {
                snpos = {
                    index: i,
                    count: sameLinks.length,
                    orientation: this.getLinkOrientation(link)
                };
            }
        }
        // check for Rthing
        for (let i = 0; i < sameLinks.length; i++) {
            if (sameLinks[i].hasRThing) {
                snpos.hasRThing = true;
            }
        }
        return snpos;
    }

    // gets the margin to be used in stack layout between this group's children
    getStackMargin(group) {
        return (10 / 0.45) * this.getScale(group);
    }

    // returns the max y value after laying out the last part
    layoutMembersForStacked(group, startX, startY) {
        let members = this.getOrderedMembers(group);
        let x = startX;
        let y = startY;
        let rowCount = 0;
        let maxStartY = startY;
        _.each(members, (part) => {
            if (part instanceof go.Group && !part.isLinkLabel) {
                let margin = this.getStackMargin(part);
                part.move(new go.Point(x, y));
                startY = y + part.actualBounds.height + margin / 2; // start Y position for part's children

                //console.log('layoutMembersForStacked: starting layout of children of ' + part + ' at ' + Math.round(x) + ',' + Math.round(startY));

                if (part.isSubGraphExpanded) {
                    // layout children of this part; check if we've already done a taller part+children in current row
                    maxStartY = Math.max(maxStartY, this.layoutMembersForStacked(part, x, startY));
                    //console.log('layoutMembersForStacked: laid out children of ' + part + ', maxStartY is now ' + Math.round(maxStartY));
                } else {
                    maxStartY = Math.max(maxStartY, startY);
                }

                // decide whether to wrap
                rowCount++;
                if (rowCount < 2) { // keep going on this line
                    x += part.actualBounds.width + margin;
                } else { // wrap to next line
                    x = startX;
                    y = maxStartY + margin / 2;
                    rowCount = 0;
                }
            }
        });
        return maxStartY;
    }

    // shared stuff for Left/Right Inventory layouts...

    // gets the margin to be used in stack layout between this group's children
    getInventoryMargin(group) {
        if (this.computeLevel(group) <= 2) {
            return 10 * this.getScale(group);
        } else {
            return 3 * this.getScale(group);
        }
    }

    // returns the max y value after laying out the last part
    // side is 'L' or 'R'
    layoutMembersForInventory(group, startX, startY, side) {
        let members = this.getOrderedMembers(group);
        _.each(members, (part) => {
            let x = startX; // for left, just use x
            if (side === 'R')
                x = startX - part.actualBounds.width; // for right, right-align parts to startX
            //console.log('layoutMembersForInventory, part: ' + part + ' to location: ' + x + ',' + startY);
            part.move(new go.Point(x, startY));
            startY += part.actualBounds.height + this.getInventoryMargin(part);
            if (part.isSubGraphExpanded) {
                //console.log('layoutMembersForInventory, y after moving: ' + part + ' = ' + startY);
                startY = this.layoutMembersForInventory(part, startX, startY, side);
            }
        });
        return startY + this.getInventoryMargin(group);
    }

    // returns an array of the group's (non-R-thing) members, sorted by the 'order' data property
    getOrderedMembers(group) {
        let members = new go.List();
        let it = group.memberParts.iterator;
        while (it.next()) {
            let part = it.value;
            if (part instanceof go.Group && !part.isLinkLabel) {
                members.add(part);
            }
        }
        return _.sortBy(members.toArray(), function (member) {
            return member.data.order;
        });
    }

    // refreshes the cached list of all links with keys, to facilitate grouping them according to connected nodes
    getLinksByNodes(refresh) {
        //console.log('getLinksByNodes');
        if (!this._linksByNodes || refresh) {
            this._linksByNodes = [];
            let diagram = this._map.getDiagram();
            let links = diagram.links.iterator;
            while (links.next()) {
                let link = links.value;
                let key = this.getSameNodesLinkKey(link);
                if (key) {
                    this._linksByNodes.push({
                        key: key,
                        link: link,
                        hasRThing: (link.labelNodes.count > 0)
                    });
                }
            }
        }
        return this._linksByNodes;
    }

    // Returns a key used to group links according to which pair of nodes they connect.
    // The returned key is non-empty for regular links and P links that should be shown currently,
    // so that these will all be routed by the same rules. A null key is returned for any other 
    // links, indicating that no grouping is required.
    getSameNodesLinkKey(link) {
        //        if (this.isRLink(link) || (this.isPLink(link) && this._map.templates.showPLink(link))) {
        if (this.isRLink(link)) {
            let key = [link.fromNode.toString(), link.toNode.toString()].sort().join('|');
            //console.log('key: ' + key);
            return key;
        } else {
            return null;
        }
    }

    // We use this to distinguish an A-B link from a B-A link (based on fromNode and toNode, which
    // is independent of the arrowhead settings) when setting curviness, because setting curviness = 25
    // on an A-B link is the same as curviness = -25 on a B-A link.
    getLinkOrientation(link) {
        if (link.fromNode && link.toNode && link.fromNode.toString() < link.toNode.toString()) {
            return 1;
        } else {
            return -1;
        }
    }

    // -------------- link tests ---------------

    isRLink(link) {
        return link instanceof go.Link && link.data && !link.data.category && link.fromNode && link.toNode;
    }

    isDLink(link) {
        return link instanceof go.Link && link.data && link.data.category === 'D';
    }

    isPLink(link) {
        return link instanceof go.Link && link.data && link.data.category === 'P';
    }

    isGroup(obj) {
        return obj instanceof go.Group;
    }

}

module.exports = Layouts;
