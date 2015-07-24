const go = window.go;
const Layouts = require('../Layouts.js');

class StackedLayout extends Layouts {
    constructor(...args) {
        super(...args);
    }

    toString() {
        return "StackedLayout";
    }

    doLayout(coll) {
        this.diagram.startTransaction("Stacked Layout");
        let margin = this.getStackMargin(this.group);
        let startX = this.group.location.x;
        let startY = this.group.location.y + (this.group.part.actualBounds.height + margin / 2);
        this.layoutMembersForStacked(this.group, startX, startY);
        this.diagram.commitTransaction("Stacked Layout");
    }

}

go.Diagram.inherit(StackedLayout, go.Layout);

module.exports = StackedLayout;