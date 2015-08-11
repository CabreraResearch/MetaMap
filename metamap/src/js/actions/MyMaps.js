const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');
const PAGES = require('../constants/pages.js');
const TAGS = require('../constants/tags.js');
const home = require('../../tags/pages/home');

class Home extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        this.eventer.do(PAGES.MY_MAPS, { id: id }, ...params);
        return true;
    }
}

module.exports = Home;