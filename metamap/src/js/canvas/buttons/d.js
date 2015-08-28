const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let react = require('./buttonClick')

const dButton = (map) => {
    return mk(go.Panel, "Auto",
        {
            alignment: go.Spot.TopLeft
        },

        mk("CornerButton", "Auto", {
            cursor: 'pointer',
            _dragData: { portId: CONSTANTS.DSRP.D },
            portId: CONSTANTS.DSRP.D,
            click: function (event, target) {
                if (event.alt) {
                    // NB: a side effect of this will be to select just this group,
                    // which would not happen otherwise via control-click
                    map.perspectives.setDEditorThing(target.part.adornedPart);
                } else {
                    react(map, CONSTANTS.DSRP.D, target);
                }
            },
            contextClick: function (event, target) {
                //console.log('contextClick:' + event);
                map.toggleDFlag(target.part.adornedPart);
            }
        },
            mk(go.Shape, {
                desiredSize: new go.Size(20, 20),
                geometryString: config.shapes.corners.D.path,
                fill: config.colors.DSRP.D,
                stroke: null,
                strokeWidth: 0
            }
                ))
        )
}

module.exports = dButton;