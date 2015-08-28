const SandbankEditor = require('./sbEditor');

// layouts used in the editor, for the diagram or individual Groups, plus layout-related functions

SandbankEditor.Layouts = function($scope, map) {

    var self = this;

    const metaMap = require('../../MetaMap');
    const config = metaMap.config.canvas;
    const CONSTANTS = require('../constants/constants');

    this.init = function() {};

    this.handleDiagramEvent = function(eventName, e) {
        var diagram = map.diagram;
        if (eventName == 'InitialLayoutCompleted') {
            diagram.updateAllTargetBindings();
            diagram.layoutDiagram(true);
        } else if (eventName == 'SelectionMoved') {
            updateSelectedPartLocationData(e);
            map.diagram.layoutDiagram(true);
        } else if (eventName == 'SelectionDeleted') {
            diagram.updateAllTargetBindings();
        } else if (eventName == 'PartCreated') {
            //console.log('Layouts, PartCreated');
            // setNewPartLocationData(e);
        } else if (eventName == 'PartResized') {
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
        var diagram = map.diagram;
        var node = e.subject;
        if (node && node.category == 'slide') {
            //console.log('PartResized: ' + node.part.actualBounds);
            diagram.model.setDataProperty(node.data, 'width', node.part.actualBounds.width);
            diagram.model.setDataProperty(node.data, 'height', node.part.actualBounds.height);
        }
    }

    // set the 'loc' attribute for a new top-level node (created by double-clicking), to support freehand layout
    this.setNewPartLocationData = function(e) {
        var node = e.subject;
        if (node && node.part) {
            if (node instanceof go.Group) {
                map.diagram.model.setDataProperty(node.data, 'loc', node.part.location.x + ' ' + node.part.location.y);
            }
        }
    };

    // updates the 'loc' attribute for each selected part, to support freehand layout (does not apply to slides)
    function updateSelectedPartLocationData(e) {
        var diagram = map.diagram;
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Group) { // thing
                var part = it.value;
                var parentX = 0;
                var parentY = 0;
                if (part.containingGroup) {
                    parentX = part.containingGroup.location.x;
                    parentY = part.containingGroup.location.y;
                }
                //console.log('moving group, subject: ' + e.subject + ', part: ' + part + ', height: ' + part.part.desiredSize.height + ', location: ' + part.part.location);
                if (!isNaN(part.location.x)) {
                    diagram.model.setDataProperty(part.data, 'loc', (part.location.x - parentX) + ' ' + (part.location.y - parentY));
                }
            }
        }
    }

    // ----------- changing layouts of things and their descendants ----------------

    this.fromAndToNodesAreVisible = function(link) {
        return link.fromNode &&
            link.toNode &&
            !self.hasCollapsedAncestor(link.fromNode) &&
            !self.hasCollapsedAncestor(link.toNode);
    };

    this.labelNodeIsVisible = function(link) {
        return link.labelNodes.count && link.labelNodes.first().visible;
    };

    this.hasCollapsedAncestor = function(group) {
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

    this.getHighestAncestorWithLayout = function(group, layoutNames) {
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

    this.areSistersInInventoryLayout = function(group1, group2) {
        return group1.containingGroup == group2.containingGroup &&
            group1.containingGroup &&
            _.contains(['left', 'right'], group1.containingGroup.data.layout);
    };

    this.isNotWithinInventoryLayout = function(group) {
        return !self.isWithinInventoryLayout(group);
    };

    this.isRThingWithinInventoryLayout = function(group) {
        return group.isLinkLabel && self.isWithinInventoryLayout(group);
    };

    this.isWithinInventoryLayout = function(group) {
        return self.isWithinLayout(group, ['left', 'right']);
    };

    this.isWithinLeftInventoryLayout = function(group) {
        return self.isWithinLayout(group, ['left']);
    };

    this.isWithinRightInventoryLayout = function(group) {
        return self.isWithinLayout(group, ['right']);
    };

    this.isWithinFreehandLayout = function(group) {
        return self.isWithinLayout(group, ['freehand']);
    };

    this.isWithinStackedLayout = function(group) {
        return self.isWithinLayout(group, ['stacked']);
    };

    this.isWithinLayout = function(group, layoutNames) {
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

    this.showLeftTextBlock = function(group) {
        return self.isWithinRightInventoryLayout(group) &&
            !self.isWithinStackedLayout(group) &&
            !group.isLinkLabel;
    };

    this.showRightTextBlock = function(group) {
        return self.isWithinLeftInventoryLayout(group) &&
            !self.isWithinStackedLayout(group) &&
            !group.isLinkLabel;
    };

    this.setDescendantLayouts = function(group, layoutName) {
        if (layoutName == 'left' || layoutName == 'right' || layoutName == 'stacked') {
            var it = group.memberParts.iterator;
            while (it.next()) {
                var part = it.value;
                if (part instanceof go.Group && !part.isLinkLabel) {
                    part.data.layout = layoutName;
                    self.setDescendantLayouts(part, layoutName);
                }
            }
        } else if (layoutName == 'freehand') {
            // stacked?
        }
    };

    this.disableLayoutForSelectedThings = function(layoutName) {
        var it = map.diagram.selection.iterator;
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
    this.computeLevel = function(group) {
        //console.log('computeLevel, part: ' + part + ', containingGroup: ' + part.containingGroup);
        if (!(group instanceof go.Group) || group.containingGroup === null) {
            return 0;
        } else {
            return self.computeLevel(group.containingGroup) + 1;
        }
    };

    // gets the basic scaling for thing squares, by level
    function getThingScale(level) {
        return Math.pow(0.7, level); // 1, .45, .2025, .091125, ...
    }

    // this is only used for groups
    this.getScale = function(group, visitedGroupKeys) {
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

            if (group.labeledLink) { // R-thing
                var fromScale = self.getScale(group.labeledLink.fromNode, visitedGroupKeys);
                var toScale = self.getScale(group.labeledLink.toNode, visitedGroupKeys);
                //console.log('getScale, fromScale: ' + fromScale + ', toScale: ' + toScale + ', visitedGroupKeys: ' + visitedGroupKeys.join(','));
                return Math.min(fromScale, toScale) * 0.5;
            } else if (group.containingGroup) {
                return self.getScale(group.containingGroup, visitedGroupKeys) * 0.7;
            } else {
                return getThingScale(self.computeLevel(group));
            }
        }
        return 1; // can occur when dragging R to empty space
    };

    // gets the margin to be used in stack layout between this group's children
    function getStackMargin(group) {
        return (10 / 0.7) * self.getScale(group);
    }

    // gets the margin to be used in stack layout between this group's children
    function getInventoryMargin(group) {
        if (self.computeLevel(group) <= 2) {
            return 10 * self.getScale(group);
        } else {
            return 3 * self.getScale(group);
        }
    }

    this.getExternalTextScale = function(group) {
        return 1;
    };

    this.getLinkStrokeWidth = function(link) {
        var fromScale = self.getScale(link.fromNode);
        var toScale = self.getScale(link.toNode);
        return (link.isSelected ? config.shapes.line.borderHighlightWidth : config.shapes.line.borderWidth) * Math.min(fromScale, toScale); // 2, .9, ...
    };

    // scale arrowheads based on the smallest to/from node,
    // or just the To node for P links
    this.getArrowheadScale = function(link) {
        var fromScale = self.getScale(link.fromNode);
        var toScale = self.getScale(link.toNode);
        var minScale = Math.min(fromScale, toScale);
        //console.log("getArrowheadScale, fromScale: ", fromScale, ', toScale: ', toScale, ', minScale: ', minScale);
        if (link.data.category == CONSTANTS.DSRP.P) {
            minScale = toScale;
        }
        if (minScale >= 1) {
            return config.shapes.line.arrowSize * minScale;
        } else {
            return (config.shapes.line.arrowSize+0.5) * minScale;
        }
    };

    // -------------- creating new things ----------------------

    // Returns a location for a new sister group (thing) to the given one,
    // which will not hide any existing things (overlap is allowed).
    // The returned coordinates are absolute for a top-level group,
    // or relative to the parent otherwise - suitable for use with FreehandDiagramLayout
    // or FreehandLayout, resp.
    this.getNewSisterLocation = function(group, withR) {
        var diagram = map.diagram;
        // if we are within another group, things are in absolute coordinates
        // and sisters are placed above the thing; otherwise relative and below...
        var inGroup = (group.containingGroup !== null);
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
                //console.log('getNewSisterLocation: overlapping part found in ' + rect);
                if (withR) {
                    x += w / 10;
                    y += h / 10;
                } else {
                    x += w / 10;
                    y += h / 10 * (inGroup ? 1 : -1); // move down if in group, else up
                }
            } else {
                //console.log('getNewSisterLocation: no overlapping part found in ' + rect);
                break;
            }
        }
        if (inGroup) { // make coordinates relative
            x -= group.containingGroup.location.x;
            y -= group.containingGroup.location.y;
        }
        return new go.Point(x + Math.random(), y + Math.random());
    };

    // Returns a location for a new child group (thing) to the given one,
    // which will not hide any existing children (overlap is allowed).
    // The returned coordinates are relative to the parent group - suitable for use with FreehandLayout.
    this.getNewChildLocation = function(group) {
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
                //console.log('getNewChildLocation for ' + member + ': newRect = ' + newRect + ', memberRect = ' + memberRect + ', overlaps: ' + overlaps);
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
    this.getNewChildLocation2 = function(group) {
        var groupBounds = group.actualBounds;
        var childBounds = map.safeRect(map.diagram.computePartsBounds(group.memberParts));
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
    this.layoutNewMembersRelativeTo = function(newMembers, parent, oldMemberBounds) {
        // how big was the parent system before the new groups were added?
        var systemBounds = parent.actualBounds.unionRect(oldMemberBounds);

        // figure out old/new origins - place new origin below existing system
        var oldBounds = map.diagram.computePartsBounds(newMembers);
        var oldOrigin = new go.Point(oldBounds.x, oldBounds.y);
        var newOrigin = new go.Point(0, systemBounds.height * 1.2);
        //console.log('layoutNewMembersRelativeTo, systemBounds: ' + systemBounds + ', oldBounds: ' + oldBounds +  ', oldOrigin: ' + oldOrigin + ', newOrigin: ' + newOrigin);

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
            //console.log('layoutNewMembersRelativeTo, groupBounds: ' + groupBounds + ', newLoc: ' + newLoc);
            map.diagram.model.setDataProperty(group.data, 'loc', newLoc);
        }
    };

    // move all the given old member groups so that their locations are absolute and above
    // the parent, and scaled up appropriately
    this.layoutOldMembersOutsideOf = function(oldMembers, parent, oldMembersBounds, oldMembersLevel) {
        // figure out scale factor (members can be dragged up multiple levels, unlike dragging into S)
        var scaleFactor = Math.pow(0.45, oldMembersLevel - self.computeLevel(parent));
        //console.log('layoutOldMembersOutsideOf, scaleFactor: ' + scaleFactor);

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
            //console.log('layoutOldMembersOutsideOf, parentBounds: ' + parentBounds + ', oldMembersBounds: ' + oldMembersBounds + ', newOrigin: ' + newOrigin + ', groupBounds: ' + groupBounds + ', newLoc: ' + newLoc);
            map.diagram.model.setDataProperty(group.data, 'loc', go.Point.stringify(newLoc));
        }
    };

    // ----------------- accessors -------------------

    // returns the appropriate layout class by abbreviated name
    this.getLayout = function(layoutName) {
        if (layoutName == 'freehand')
            return new FreehandLayout();
        else if (layoutName == 'right')
            return new RightInventoryLayout();
        else if (layoutName == 'stacked')
            return new StackedLayout();
        else
            return new LeftInventoryLayout();
    };

    this.getFreehandDiagramLayout = function() {
        return new FreehandDiagramLayout();
    };

    // --------------------------------------------------------------

    // returns true if the to and from nodes for the link have a common ancestor group with one of the given layout names.
    // TODO: verify logic - what if there are multiple such ancestors? - this should return the highest one...
    function getCommonAncestorWithLayout(group1, group2, layoutNames) {
        var ancestors1 = self.getAncestorGroups(group1);
        var ancestors2 = self.getAncestorGroups(group2);
        var commonAncestors = _.intersection(ancestors1, ancestors2);
        var layoutAncestors = _.filter(commonAncestors, function(group) {
            return _.indexOf(layoutNames, group.data.layout) != -1;
        });
        if (layoutAncestors.length) {
            return layoutAncestors[0];
        } else {
            return null;
        }
    }

    // returns the ancestors of this group, including itself
    this.getAncestorGroups = function(group) {
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

    FreehandDiagramLayout.prototype.toString = function() {
        return "FreehandDiagramLayout";
    };

    FreehandDiagramLayout.prototype.doLayout = function(coll) {
        //console.log('FreehandDiagramLayout.doLayout');
        var diagram = map.diagram;
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
            //     //console.log('link location isNaN');
            //     link.move(new go.Point(0,0));
            // }
            // //console.log('link location: ' + link.location);
            adjustLinkLayout(link);
        }

        // diagram.commitTransaction("Freehand Diagram Layout");
    };


    // if any group in the given Iterator does not have a location (data.loc), set one
    // that doesn't overlap with the other members
    function validateGroupLocations(groups) {

    }

    // --------------------------------------------------------------

    function FreehandLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(FreehandLayout, go.Layout);

    FreehandLayout.prototype.toString = function() {
        return "FreehandLayout";
    };

    FreehandLayout.prototype.doLayout = function(coll) {
        var diagram = map.diagram;
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
    };

    // --------------------------------------------------------------

    function StackedLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(StackedLayout, go.Layout);

    StackedLayout.prototype.toString = function() {
        return "StackedLayout";
    };

    StackedLayout.prototype.doLayout = function(coll) {
        this.diagram.startTransaction("Stacked Layout");
        var margin = getStackMargin(this.group);
        var startX = this.group.location.x;
        var startY = this.group.location.y + (this.group.part.actualBounds.height + margin / 2);
        layoutMembersForStacked(this.group, startX, startY);
        this.diagram.commitTransaction("Stacked Layout");
    };

    // returns the max y value after laying out the last part
    function layoutMembersForStacked(group, startX, startY) {
        var members = getOrderedMembers(group);
        var x = startX;
        var y = startY;
        var rowCount = 0;
        var maxStartY = startY;
        _.each(members, function(part) {
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

    // --------------------------------------------------------------

    function RightInventoryLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(RightInventoryLayout, go.Layout);

    RightInventoryLayout.prototype.toString = function() {
        return "RightInventoryLayout";
    };

    RightInventoryLayout.prototype.doLayout = function(coll) {
        //this.diagram.startTransaction("Inventory Layout");
        var startX = this.group.location.x + this.group.actualBounds.width;
        var startY = this.group.location.y + (this.group.part.actualBounds.height + getInventoryMargin(this.group));
        layoutMembersForInventory(this.group, startX, startY, CONSTANTS.DSRP.R);
        //this.diagram.commitTransaction("Inventory Layout");
    };

    // --------------------------------------------------------------

    function LeftInventoryLayout() {
        go.Layout.call(this);
    }

    go.Diagram.inherit(LeftInventoryLayout, go.Layout);

    LeftInventoryLayout.prototype.toString = function() {
        return "LeftInventoryLayout";
    };

    LeftInventoryLayout.prototype.doLayout = function(coll) {
        //console.log('LeftInventoryLayout.doLayout, group: ' + this.group + ', location: ' + this.group.location);
        // this.diagram.startTransaction("Inventory Layout");
        var startX = this.group.location.x;
        var startY = this.group.location.y + (this.group.part.actualBounds.height + getInventoryMargin(this.group));
        layoutMembersForInventory(this.group, startX, startY, 'L');
        // this.diagram.commitTransaction("Inventory Layout");
    };

    // shared stuff for Left/Right Inventory layouts...

    // returns the max y value after laying out the last part
    // side is 'L' or CONSTANTS.DSRP.R
    function layoutMembersForInventory(group, startX, startY, side) {
        var members = getOrderedMembers(group);
        _.each(members, function(part) {
            var x = startX; // for left, just use x
            if (side == CONSTANTS.DSRP.R)
                x = startX - part.actualBounds.width; // for right, right-align parts to startX
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
        return _.sortBy(members.toArray(), function(member) {
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
        //     //console.log('adjustLinkLayout, link.location: ' + link.location);
        // }
        // //console.log('adjustLinkLayout, link.location: ' + link.location);

        // see if link is within a stacked or inventory layout, or if it's a hidden P link
        var inventoryAncestor = getCommonAncestorWithLayout(link.fromNode, link.toNode, ['left', 'right']);
        var stackedAncestor = getCommonAncestorWithLayout(link.fromNode, link.toNode, ['stacked']);
        var hidePLink = (link.data && link.data.category == CONSTANTS.DSRP.P && !map.templates.showPLink(link));
        //var crowdedRThing = hasCrowdedRThing(link);

        // see if this is one of multiple links between the same two nodes
        var snpos = self.getSameNodesLinkPosition(link);
        var isMultiLink = (snpos.count > 1);
        //console.log('snpos for link ' + link + ': ' + snpos.index + ' of ' + snpos.count);

        if (inventoryAncestor) {
            applyInventoryCurveRouting(link, snpos, inventoryAncestor.data.layout);
        } else if(isMultiLink) {
            applyMultilinkCurveRouting(link, snpos);
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
        // //console.log('applyMultilinkCurveRouting, link: ' + link + ', curviness: ' + link.curviness);
    }

    // do normal straight lines for freehand layout, or links between descendants of things with different layouts
    function applyStraightRouting(link) {
        link.fromSpot = go.Spot.Default;
        link.toSpot = go.Spot.Default;
        link.routing = go.Link.Normal;
        link.curve = go.Link.Bezier;
        link.curviness = 25;
    }

    // --------------- calculate how many links there are between a link's nodes ---------------

    // Returns an object of the format { index: 1, count: 2, orientation: -1, hasRThing: false },
    // indicating how many other links there are between the same pair of nodes,
    // where the given link falls within this list, and what its orientation is.
    this.getSameNodesLinkPosition = function(link) {
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
            var diagram = map.diagram;
            var links = diagram.links.iterator;
            while (links.next()) {
                var link = links.value;
                var key = getSameNodesLinkKey(link);
                if (key) {
                    self._linksByNodes.push({
                        key: key,
                        link: link,
                        hasRThing: (link.labelNodes.count > 0)
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
        //        if (self.isRLink(link) || (self.isPLink(link) && map.templates.showPLink(link))) {
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

    this.isRLink = function(link) {
        return link instanceof go.Link && link.data && link.data.category === undefined && link.fromNode && link.toNode;
    };

    this.isDLink = function(link) {
        return link instanceof go.Link && link.data && link.data.category == CONSTANTS.DSRP.D;
    };

    this.isPLink = function(link) {
        return link instanceof go.Link && link.data && link.data.category == CONSTANTS.DSRP.P;
    };

    this.isGroup = function(obj) {
        return obj instanceof go.Group;
    };
};