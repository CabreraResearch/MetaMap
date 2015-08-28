const go = window.go;
const CONSTANTS = require('../../constants/constants');
const react = require('./buttonClick')

function ButtonDraggingTool(map) {
    go.DraggingTool.call(this);
    this._dragData = null;  // pass information from findDraggablePart to standardMouseSelect
    this.map = map;
}
go.Diagram.inherit(ButtonDraggingTool, go.DraggingTool);

// ButtonDraggingTool.prototype.canStart = function (...params) {
//     if (!this.isEnabled) return false;
//     var diagram = this.diagram;
//     if (diagram === null) return false;
//     if (!diagram.allowHorizontalScroll && !diagram.allowVerticalScroll) return false;
//     // require right button & that it has moved far enough away from the mouse down point, so it isn't a click
//     // CHANGED to check InputEvent.right INSTEAD OF InputEvent.left
//     if (!diagram.lastInput.left) return false;
//     // don't include the following check when this tool is running modally
//     if (!(this.diagram.lastInput.documentPoint) ||
//         !this.diagram.findObjectAt(this.diagram.lastInput.documentPoint) ||
//         !this.diagram.findObjectAt(this.diagram.lastInput.documentPoint).part.adornedPart) return false;
//     // if (diagram.currentTool !== this) {
//     //     // mouse needs to have moved from the mouse-down point
//     if (this.isBeyondDragSize()) {
//              alert('drag')
//          }
//     // }
//     return true;
// }
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

// ButtonDraggingTool.prototype.standardMouseClick = function (event, obj) {
//     if (this._dragData !== null) {
//         let node = this.diagram.findObjectAt(this.diagram.lastInput.documentPoint).part.adornedPart;
//         let target = node.findObject('mainpanel');
//         switch (this._dragData.portId) {
//             case CONSTANTS.DSRP.D:
//                 if (event.alt) {
//                     // NB: a side effect of this will be to select just this group,
//                     // which would not happen otherwise via control-click
//                     this.map.perspectives.setDEditorThing(target.part.adornedPart);
//                 } else {
//                     react(this.map, CONSTANTS.DSRP.D, target);
//                 }
//                 break;
//             case CONSTANTS.DSRP.S:
//                 react(this.map, CONSTANTS.DSRP.S, target);
//                 break;
//             case CONSTANTS.DSRP.R:
//                 react(this.map, CONSTANTS.DSRP.R, target);
//                 break;
//             case CONSTANTS.DSRP.P:
//                 react(this.map, CONSTANTS.DSRP.P, target);
//                 break;
//         }
//     }
// }
//
// ButtonDraggingTool.prototype.doMouseDown = function (event, obj) {
//     //go.DraggingTool.prototype.doMouseDown.apply(this, arguments);
//     //this.standardMouseClick.apply(this, arguments);
//     if (this._dragData !== null) {
//
//     }
//     if (this.isBeyondDragSize()) {
//         alert('drag')
//     }
// };

// Instead of the standard behavior selecting the Part at the lastInput.documentPoint,
// create a new Part and select it, so that it is dragged by the DraggingTool.
ButtonDraggingTool.prototype.standardMouseSelect = function (event, obj) {
    if (this._dragData !== null) {
        if (this._dragData.portId == CONSTANTS.DSRP.P || this._dragData.portId == CONSTANTS.DSRP.R) {
            this.diagram.startTransaction("Drag");
            // this method must now set this.currentPart to a selected movable Part

            this.diagram.allowLink = true;
            var tool = this.diagram.toolManager.linkingTool;
            var node = this.diagram.findObjectAt(this.diagram.lastInput.documentPoint).part.adornedPart;
            tool.startObject = node.findObject('dragarea');
            tool.archetypeLinkData.text = this._dragData.portId;
            this.diagram.currentTool = tool;
            tool.doActivate();

            this.map.templates.groupMouseDragLeaveHandler()

            // var data = this.diagram.model.copyNodeData(this._dragData);
            // this.diagram.model.addNodeData(data);
            // var newpart = this.diagram.findNodeForData(data);
            // newpart.location = this.diagram.lastInput.documentPoint;
            // this.diagram.select(newpart);
            // this.currentPart = newpart;
        }
    } else {
        go.DraggingTool.prototype.standardMouseSelect.call(this);
    }
};

ButtonDraggingTool.prototype.doActivate = function (event, obj) {
    go.DraggingTool.prototype.doActivate.apply(this, arguments);
};

module.exports = ButtonDraggingTool;