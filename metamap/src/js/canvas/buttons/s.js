const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let react = require('./buttonClick')

const sButton = (map) => {
    return mk(go.Panel, "Auto",
        {
            alignment: go.Spot.BottomLeft,
        },

        mk("CornerButton", "Auto", {
            cursor: 'pointer',
            portId: CONSTANTS.DSRP.S,
            _dragData: { portId: CONSTANTS.DSRP.S },
        },
            mk(go.Shape, {
                desiredSize: new go.Size(20, 20),
                geometryString: config.shapes.corners.S.path,
                fill: config.colors.DSRP.S,
                stroke: null,
                strokeWidth: 0
            }
                )
            )
        )
}

module.exports = sButton;