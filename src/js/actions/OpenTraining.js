const riot = require('riot')
const ActionBase = require('./ActionBase')
const CONSTANTS = require('../constants/constants')
const training = require('../tags/pages/training')

class OpenTraining extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${CONSTANTS.ELEMENTS.APP_CONTAINER}`).empty();
        if (id) {
            let tag = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.PAGES.TRAINING)[0];
            tag.update({ id: id });
            this.openSidebar();
        }
        return true;
    }
}

module.exports = OpenTraining;