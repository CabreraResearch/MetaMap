const go = window.go;
const mk = go.GraphObject.make;
const metaMap = require('../../../MetaMap');
const config = metaMap.config.canvas;
const CONSTANTS = require('../../constants/constants');

let generic = require('./generic')

const dButton = (map) => {
    const opts = {
        port: CONSTANTS.DSRP.D,
        position: go.Spot.TopLeft,
        click: function (event, target) {
            if (event.alt) {
                // NB: a side effect of this will be to select just this group,
                // which would not happen otherwise via control-click
                map.perspectives.setDEditorThing(target.part.adornedPart);
            } else {
                //react(map, opts.port, target);
                //map.ui.showCornerTip()
            }
        },
        contextClick: function (event, target) {
            //console.log('contextClick:' + event);
            map.toggleDFlag(target.part.adornedPart);
        },
        doubleClick: function (event, target) {
            map.createSister(target, 'Idea')
        }
    };

    return generic(map, opts);

}

module.exports = dButton;