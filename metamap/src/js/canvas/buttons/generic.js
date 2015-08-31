const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

const generic = (map, opts = {}) => {
    const outerSize = config.shapes.corners.all.size + config.shapes.corners.all.borderSize;
    const port = CONSTANTS.DSRP[opts.port];
    const position = opts.position;
    const focus = opts.position.opposite();
    const geometry = config.shapes.corners[opts.port].pathOuter;
    const borderFill = config.colors[opts.port].dark;
    const innerSize = config.shapes.corners.all.size;
    const innerFill = config.colors.DSRP[opts.port];
    const cursor = config.shapes.corners.all.cursor;

    return mk(go.Panel, "Spot",
        {
            alignment: position,
            alignmentFocus: focus
        },

        mk("CornerButton", "Auto", {
            cursor: cursor,
            _dragData: { portId: port },
            portId: port,
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true
        },
            mk(go.Shape, {
                cursor: cursor,
                portId: port,
                desiredSize: new go.Size(outerSize, outerSize),
                geometryString: geometry,
                fill: borderFill,
                stroke: null,
                strokeWidth: 0
            }
                )
            ),

        mk("CornerButton", "Auto", {
            cursor: cursor,
            isActionable: true,
            click: function (event, adorn) {
                const target = adorn.part.adornedPart;
                console.log(`clicked ${port}`)
                if (opts.click) {
                    opts.click.apply(this, [event, target]);
                }
            },
            doubleClick: function (event, adorn) {
                const target = adorn.part.adornedPart;
                target.clicks = 2;
                console.log(`double clicked ${port}`)
                if (opts.doubleClick) {
                    opts.doubleClick.apply(this, [event, target]);
                }
            },
            contextClick: function (event, adorn) {
                const target = adorn.part.adornedPart;
                console.log(`context clicked ${port}`)
                if (opts.contextClick) {
                    opts.contextClick.apply(this, [event, target]);
                }
            }
        },
            mk(go.Shape, {
                desiredSize: new go.Size(innerSize, innerSize),
                geometryString: geometry,
                fill: innerFill,
                stroke: null,
                strokeWidth: 0
            }
                )
            ),

        mk(go.TextBlock, { text: port, stroke: config.shapes.corners.all.labelColor, font: config.shapes.corners.all.font })
    )

}

module.exports = generic;