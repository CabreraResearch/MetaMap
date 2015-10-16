const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const home = require('../tags/pages/courses');

class Courses extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        $(`#${CONSTANTS.ELEMENTS.APP_CONTAINER}`).empty();
        riot.mount(document.getElementById(CONSTANTS.ELEMENTS.APP_CONTAINER), CONSTANTS.TAGS.COURSE_LIST);
        this.eventer.do(CONSTANTS.PAGES.COURSE_LIST, { id: id }, ...params);
        this.eventer.do(CONSTANTS.EVENTS.PAGE_NAME, { name: 'Courses' }, ...params);
        this.closeSidebar();

        return true;
    }
}

module.exports = Courses;