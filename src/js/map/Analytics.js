const go = window.go;

class Analytics {
    constructor(editor, map) {
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

    handleDiagramEvent(eventName, e) {
        if (eventName === 'ChangedSelection') {
            if (this._map.getUi().currentTabIs(this._map.getUi().TAB_ID_ANALYTICS_THING)) {
                this.updateContextualAnalytics();
            }
        }
    }

    // called when a tab is opened or closed
    currentTabChanged(newValue, oldValue) {
        if (newValue === this._map.getUi().TAB_ID_ANALYTICS_THING) { // opening thing analytics tab
            this.updateContextualAnalytics();
        }
    }

    updateContextualAnalytics() {
        //console.log('updateContextualAnalytics');
        if (!this._map.getUi().currentTabIs(this._map.getUi().TAB_ID_ANALYTICS_THING)) {
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
                    }
                    else if (link.toNode === thing) {
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
                    }
                    else if (link.toNode === thing) {
                        rConnectedThingKeys.push(link.fromNode.data.key);
                    }
                }
            }
            a.relatedTo = _.uniq(rConnectedThingKeys).length;

            // isRelationship
            a.isRelationship = thing.isLinkLabel;
        }
        else if (part && part instanceof go.Link) {
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

    // returns either the containingGroup or the rThingContainingGroup, whichever is non-null
    getContainingGroup(group) {
        return group.containingGroup || this.getRThingContainingGroup(group);
    }

    // if group is an R-thing between two sibling parts of a whole, returns the whole; else returns null
    getRThingContainingGroup(group) {
        if (group.isLinkLabel) {
            var fromParent = group.labeledLink.fromNode.containingGroup;
            var toParent = group.labeledLink.toNode.containingGroup;
            if (fromParent !== null && toParent !== null && fromParent === toParent) {
                return fromParent;
            }
        }
        return null;
    }

    // counts the member parts of the group that are groups, recursively (not including the group itself)
    countGroups(group) {
        var count = 0;
        var it = this.getMemberGroups(group).iterator;
        while (it.next()) {
            var part = it.value;
            count += 1 + this.countGroups(part);
        }

        return count;
    }

    // returns the collection of groups that are either a memberPart of this group, or an R-thing between sibling memberParts
    getMemberGroups(group) {
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

    // if the group is linked by an R-thing to a sibling (with the group as the fromNode), returns the R-thing; else returns null
    getRThingToSibling(group) {
        var it = group.findLinksOutOf();
        while (it.next()) {
            var link = it.value;
            if (link.labelNodes.count > 0 && link.toNode.containingGroup === group.containingGroup) {
                return link.labelNodes.first();
            }
        }
        return null;
    }

    isPoint(group) {
        var it = group.findLinksOutOf();
        while (it.next()) {
            var link = it.value;
            if (link.data.category === 'P') {
                return true;
            }
        }
        return false;
    }

    isView(group) {
        var it = group.findLinksInto();
        while (it.next()) {
            var link = it.value;
            if (link.data.category === 'P') {
                return true;
            }
        }
        return false;
    }

}

module.exports = Analytics;