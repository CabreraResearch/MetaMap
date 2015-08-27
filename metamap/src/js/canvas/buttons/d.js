const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let react = require('./buttonClick')

const dButton = (map) => {
    return mk("Button", "Auto", {
        isActionable: false,
        alignment: go.Spot.TopLeft,
        cursor: 'pointer',
        portId: CONSTANTS.DSRP.D,
        fromLinkable: true,
        fromLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkable: true,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true,
        toMaxLinks: 1,
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
        },
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
            desiredSize: new go.Size(20, 20),
            geometryString: config.shapes.corners.D.path,
            fill: config.colors.DSRP.D,
            stroke: null,
            strokeWidth: 0,
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
            mouseDragEnter: function (event, target) {
                debugger;

            },
            mouseDragLeave: function (event, target) {
                debugger;

            },
            mouseDrop: function (event, target) {
                debugger;

            }
        }
            ))
}

module.exports = dButton;