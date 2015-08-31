const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let react = require('./buttonClick')
let generic = require('./generic')

const pButton = (map) => {
    const opts = {
        port: CONSTANTS.DSRP.P,
        position: go.Spot.TopRight,
        click: function (event, target) {
            map.togglePExpansion(target)
        },
        contextClick: function (event, target) {

        },
        doubleClick: function (event, target) {
            map.createRToSister(target, 'Idea')
        }
    };

    return generic(map, opts);
}

module.exports = pButton;