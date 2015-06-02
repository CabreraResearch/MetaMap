const go = window.go;
let Layouts = require('../Layouts');

class FreehandLayout extends Layouts {
    constructor(...args) {
        super(...args);
    }

    toString() {
        return "FreehandLayout";
    }

    doLayout(coll) {
        let diagram = this._map.getDiagram();
        diagram.startTransaction("Freehand Layout");

        let x = this.group.location.x;
        let y = this.group.location.y;

        let it = this.group.memberParts.iterator;
        while (it.next()) {
            let part = it.value;
            if (part instanceof go.Group && !part.isLinkLabel) {
                let loc = go.Point.parse(part.data.loc);
                //console.log('FreehandLayout, part: ' + part.data.text + ', loc: ' + loc + ', location: ' + part.location);
                part.move(new go.Point(x + loc.x, y + loc.y));
                part.layout.doLayout(part);
            }
        }

        diagram.commitTransaction("Freehand Layout");
    }
}

go.Diagram.inherit(FreehandLayout, go.Layout);

module.exports = FreehandLayout;