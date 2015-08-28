const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let react = require('./buttonClick')

const rButton = (map) => {
    return mk(go.Panel, "Auto",
        {
            alignment: go.Spot.BottomRight
        },

        mk("CornerButton", "Auto", {
            cursor: 'pointer',
            _dragData: { portId: CONSTANTS.DSRP.R },
            portId: CONSTANTS.DSRP.R,
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
            mouseDragEnter: function (event, target) {
                debugger;
                //getGroupMouseDragEnterHandler(map.LEFT)
            },
            mouseDragLeave: function (event, target) {
                debugger;
                //groupMouseDragLeaveHandler()
            },
            mouseDrop: function (event, target) {
                debugger;
                //getGroupMouseDropHandler(map.LEFT)
            }
        },
            mk(go.Shape, {
                alignment: go.Spot.BottomRight,
                cursor: 'pointer',
                portId: CONSTANTS.DSRP.R,
                desiredSize: new go.Size(20, 20),
                geometryString: config.shapes.corners.R.path,
                fill: config.colors.DSRP.R,
                stroke: null,
                strokeWidth: 0
            }
                )
            )
        )
}

module.exports = rButton;