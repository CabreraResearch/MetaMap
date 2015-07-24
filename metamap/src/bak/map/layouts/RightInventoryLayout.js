const go = window.go;
const Layouts = require('../Layouts.js');

class RightInventoryLayout extends Layouts {
    constructor(...args) {
        super(...args);
    }

    toString() {
        return "RightInventoryLayout";
    }

    doLayout(coll) {
        //this.diagram.startTransaction("Inventory Layout");
        let startX = this.group.location.x + this.group.actualBounds.width;
        let startY = this.group.location.y + (this.group.part.actualBounds.height + this.getInventoryMargin(this.group));
        this.layoutMembersForInventory(this.group, startX, startY, 'R');
        //this.diagram.commitTransaction("Inventory Layout");
    }
}

go.Diagram.inherit(RightInventoryLayout, go.Layout);

module.exports = RightInventoryLayout;