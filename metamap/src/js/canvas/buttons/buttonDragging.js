const go = window.go;

function ButtonDraggingTool() {
    go.DraggingTool.call(this);
    this._dragData = null;  // pass information from findDraggablePart to standardMouseSelect
}
go.Diagram.inherit(ButtonDraggingTool, go.DraggingTool);

// A drag starting at a button with _dragData is allowed because this method returns a Part so that canStart() can return true.
// Remember the _dragData that was found, so that standardMouseSelect can create and select a new Part based on that data.
ButtonDraggingTool.prototype.findDraggablePart = function () {
    var part = go.DraggingTool.prototype.findDraggablePart.call(this);
    if (part !== null) return part;
    var element = this.diagram.findObjectAt(this.diagram.lastInput.documentPoint,
        function (x) {
            // go up the Panel chain, looking for the first GraphObject with _dragData set to an object
            var o = x;
            while (o !== null && (typeof (o._dragData) !== "object")) { o = o.panel; };
            return o;  // will be either null or a GraphObject with ._dragData
        },
        null);
    if (element !== null) {
        this._dragData = element._dragData;
        return element.part;
    } else {
        this._dragData = null;
        return null;
    }
};

// Instead of the standard behavior selecting the Part at the lastInput.documentPoint,
// create a new Part and select it, so that it is dragged by the DraggingTool.
ButtonDraggingTool.prototype.standardMouseSelect = function () {
    if (this._dragData !== null) {
        this.diagram.startTransaction("Drag");
        // this method must now set this.currentPart to a selected movable Part
        var data = this.diagram.model.copyNodeData(this._dragData);
        this.diagram.model.addNodeData(data);
        var newpart = this.diagram.findNodeForData(data);
        newpart.location = this.diagram.lastInput.documentPoint;
        this.diagram.select(newpart);
        this.currentPart = newpart;
    } else {
        go.DraggingTool.prototype.standardMouseSelect.call(this);
    }
};

ButtonDraggingTool.prototype.doActivate = function () {
    go.DraggingTool.prototype.doActivate.call(this);
    if (this._dragData !== null) {
        this._dragData = null;
        // match startTransaction call performed in doActivate but
        // now performed early in standardMouseSelect (if _dragData !== null)
        this.diagram.commitTransaction("Drag");
    }
};
// end ButtonDraggingTool

module.exports = ButtonDraggingTool;