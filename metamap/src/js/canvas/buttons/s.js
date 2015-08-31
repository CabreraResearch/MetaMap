const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let generic = require('./generic')

const sButton = (map) => {
    const opts = {
        port: CONSTANTS.DSRP.S,
        position: go.Spot.BottomLeft,
        isExpanded: function (target) {
          return !(target.data && !target.data.sExpanded); // expand by default if property not present
        },
        click: function (event, target) {
            map.diagram.model.setDataProperty(target.data, 'sExpanded', !opts.isExpanded(target));
            target.updateTargetBindings();
            map.ui.showCornerTip(target, CONSTANTS.DSRP.S);
        },
        contextClick: function (event, target) {
        },
        doubleClick: function (event, target) {
            if (!opts.isExpanded(target)) { opts.click(event, target);}
            map.createChild(target, 'Part');
        }
    };

    return generic(map, opts);
}

module.exports = sButton;