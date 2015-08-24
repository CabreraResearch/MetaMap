/// <reference path="../../../../typings/riotjs/riotjs.d.ts" />

const riot = require('riot');
const ActionBase = require('./ActionBase.js');
const ELEMENTS = require('../constants/elements.js');
const TAGS = require('../constants/tags.js');
const ROUTES = require('../constants/routes.js');
const EVENTS = require('../constants/events.js');
const metaCanvas = require('../tags/canvas/meta-canvas.js');

class OpenMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${ELEMENTS.APP_CONTAINER}`).empty();
        this.metaFire.getData(`${ROUTES.MAPS_LIST}${id}`).then((map) => {
            if (map) {
                riot.mount(document.getElementById(ELEMENTS.APP_CONTAINER), TAGS.META_CANVAS);
                map.id = id;
                this.eventer.do(EVENTS.NAV, 'map', map, ...params);
                this.eventer.do(EVENTS.PAGE_NAME, map, ...params);
                this.eventer.do(EVENTS.MAP, map, ...params);
                this.openSidebar();
            }
        });
        return true;
    }
}

module.exports = OpenMap;