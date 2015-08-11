const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');
const ELEMENTS = require('../constants/elements.js');
const TAGS = require('../constants/tags.js');
const terms = require('../../tags/pages/terms');

class Terms extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${ELEMENTS.APP_CONTAINER}`).empty();
        riot.mount(document.getElementById(ELEMENTS.APP_CONTAINER), TAGS.TERMS);
        this.eventer.do('pageName', { name: 'Terms and Conditions' }, ...params);
        return true;
    }
}

module.exports = Terms;