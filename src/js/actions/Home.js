const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const home = require('../tags/pages/home');

class Home extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${CONSTANTS.ELEMENTS.APP_CONTAINER}`).empty();
        riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.HOME);
        this.eventer.do(CONSTANTS.EVENTS.PAGE_NAME, { name: 'Home' }, ...params);
        this.closeSidebar();
        return true;
    }
}

module.exports = Home;