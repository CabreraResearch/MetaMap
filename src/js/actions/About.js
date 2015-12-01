const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
require('../tags/dialogs/about')

class About extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        fetch('./about.json').then((ret) => { return ret.json() }).then((json) => {
            About.act(json)
            this.metaMap.Router.back()
        });
        return true;
    }

    static act(json) {
        if (json) {
            let modal = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.META_MODAL_DIALOG_CONTAINER), CONSTANTS.TAGS.ABOUT)[0]
            modal.update(json)
        }
    }
}

module.exports = About;