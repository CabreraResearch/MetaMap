const go = window.go;
const Layouts = require('../Layouts.js');

class FreehandDiagramLayout extends Layouts {
    constructor(...args) {
        super(...args);
    }

    toString() {
        return "FreehandDiagramLayout";
    }

    doLayout(coll) {
        //console.log('FreehandDiagramLayout.doLayout');
        let diagram = this._map.getDiagram();
        // diagram.startTransaction("Freehand Diagram Layout");

        //validateGroupLocations(diagram.findTopLevelGroups());
        let groups = diagram.findTopLevelGroups(); // get new iterator
        while (groups.next()) {
            let group = groups.value;
            if (!group.isLinkLabel) {
                let loc = go.Point.parse(group.data.loc);
                group.move(new go.Point(loc.x, loc.y));
                //console.log('FreehandDiagramLayout, group: ' + group + ' to location: ' + loc.x + ',' + loc.y);
            }
        }

        // all adjustment of links is done from here, not from the other layouts...
        this.getLinksByNodes(true);
        let links = diagram.links.iterator;
        while (links.next()) {
            let link = links.value;
            // if (isNaN(link.location.x)) {
            //     console.log('link location isNaN');
            //     link.move(new go.Point(0,0));
            // }
            // console.log('link location: ' + link.location);
            this.adjustLinkLayout(link);
        }

        // diagram.commitTransaction("Freehand Diagram Layout");
    }
}

go.Diagram.inherit(FreehandDiagramLayout, go.Layout);

module.exports = FreehandDiagramLayout;