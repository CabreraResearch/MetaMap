const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const terms = require('../tags/pages/terms');

class Terms extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${CONSTANTS.ELEMENTS.APP_CONTAINER}`).empty();
        riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.TERMS);
        this.eventer.do(CONSTANTS.EVENTS.PAGE_NAME, { name: 'Terms and Conditions' }, ...params);
        return true;
    }
}

module.exports = Terms;