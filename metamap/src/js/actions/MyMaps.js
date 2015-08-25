const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const home = require('../tags/pages/my-maps');

class MyMaps extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${CONSTANTS.ELEMENTS.APP_CONTAINER}`).empty();
        riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.MY_MAPS);
        this.eventer.do(CONSTANTS.PAGES.MY_MAPS, { id: id }, ...params);
        this.eventer.do(CONSTANTS.EVENTS.PAGE_NAME, { name: 'My Maps' }, ...params);
        this.closeSidebar();
        
        return true;
    }
}

module.exports = MyMaps;