const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');
const PAGES = require('../constants/pages.js');
const TAGS = require('../constants/tags.js');
const ELEMENTS = require('../constants/elements.js');
const EVENTS = require('../constants/events.js');
const home = require('../tags/pages/my-maps');

class MyMaps extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${ELEMENTS.APP_CONTAINER}`).empty();
        riot.mount(document.getElementById(ELEMENTS.APP_CONTAINER), TAGS.MY_MAPS);
        this.eventer.do(PAGES.MY_MAPS, { id: id }, ...params);
        this.eventer.do(EVENTS.PAGE_NAME, { name: 'My Maps' }, ...params);
        this.closeSidebar();
        
        return true;
    }
}

module.exports = MyMaps;