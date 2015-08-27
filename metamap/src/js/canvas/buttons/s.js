const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let react = require('./buttonClick')

const sButton = (map) => {
    return mk("CornerButton", "Auto", {
        alignment: go.Spot.BottomLeft,
        cursor: 'pointer',
        portId: CONSTANTS.DSRP.S,
        fromLinkable: true,
        fromLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkable: true,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true,
        toMaxLinks: 1,
        click: function (event, target) {
            react(map, CONSTANTS.DSRP.S, target);
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
            geometryString: config.shapes.corners.S.path,
            fill: config.colors.DSRP.S,
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

module.exports = sButton;