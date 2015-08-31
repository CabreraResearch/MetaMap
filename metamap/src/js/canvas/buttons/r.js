const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let react = require('./buttonClick')
let generic = require('./generic')

const rButton = (map) => {
    const opts = {
        port: CONSTANTS.DSRP.R,
        position: go.Spot.BottomRight,
        click: function (event, target) {
            react(map, opts.port, target);
        },
        contextClick: function (event, target) {
        },
        doubleClick: function (event, target) {

        }
    };

    return generic(map, opts);

}

module.exports = rButton;