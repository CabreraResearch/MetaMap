const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');
const ELEMENTS = require('../constants/elements.js');
const TAGS = require('../constants/tags.js');
const home = require('../../tags/pages/home');

class Home extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${ELEMENTS.APP_CONTAINER}`).empty();
        riot.mount(document.getElementById(ELEMENTS.APP_CONTAINER), TAGS.HOME);
        this.eventer.do('pageName', { name: 'Home' }, ...params);
        this.closeSidebar();
        return true;
    }
}

module.exports = Home;