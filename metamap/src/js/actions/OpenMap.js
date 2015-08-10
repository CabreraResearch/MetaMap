const ActionBase = require('./ActionBase.js');
const ELEMENTS = require('../constants/elements.js');
const TAGS = require('../constants/tags.js');
const ROUTES = require('../constants/routes.js');
const metaCanvas = require('../../tags/canvas/meta-canvas.js');

class OpenMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${ELEMENTS.APP_CONTAINER}`).empty();
        riot.mount(document.getElementById(ELEMENTS.APP_CONTAINER), TAGS.META_CANVAS);
        this.metaFire.getData(`${ROUTES.MAPS_LIST}${id}`).then((map) => {
            map.id = id;
            this.eventer.do('nav', 'map', map, ...params);
            this.eventer.do('map', map, ...params);
        });
        return true;
    }
}

module.exports = OpenMap;