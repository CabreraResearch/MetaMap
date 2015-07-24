const go = window.go;
const Layouts = require('../Layouts.js');

class LeftInventoryLayout extends Layouts {
    constructor(...args) {
        super(...args);
    }

    toString() {
        return "LeftInventoryLayout";
    }

    doLayout(coll) {
        //console.log('LeftInventoryLayout.doLayout, group: ' + this.group + ', location: ' + this.group.location);
        // this.diagram.startTransaction("Inventory Layout");
        let startX = this.group.location.x;
        let startY = this.group.location.y + (this.group.part.actualBounds.height + this.getInventoryMargin(this.group));
        this.layoutMembersForInventory(this.group, startX, startY, 'L');
        // this.diagram.commitTransaction("Inventory Layout");
    }
}

go.Diagram.inherit(LeftInventoryLayout, go.Layout);

module.exports = LeftInventoryLayout;