const riot = require('riot');
const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const metaCanvas = require('../tags/pages/canvas');

class OpenMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${CONSTANTS.ELEMENTS.APP_CONTAINER}`).empty();
        this.metaFire.getData(`${CONSTANTS.ROUTES.MAPS_LIST}${id}`).then((map) => {
            if (map) {
                riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.META_CANVAS);
                map.id = id;
                this.eventer.do(CONSTANTS.EVENTS.NAV, CONSTANTS.PAGES.MAP, map, ...params);
                this.eventer.do(CONSTANTS.EVENTS.PAGE_NAME, map, ...params);
                this.eventer.do(CONSTANTS.EVENTS.MAP, map, ...params);
            }
        });
        return true;
    }
}

module.exports = OpenMap;