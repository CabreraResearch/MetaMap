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
            this.metaMap.getCortex(id)
            let tag = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.TRAINING)[0];
            tag.update({ id: id });
        }
        return true;
    }
}

module.exports = OpenTraining;