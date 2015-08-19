const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');
const _ = require('lodash');
const PAGES = require('../constants/pages.js');

class Logout extends ActionBase {
    constructor(...params) {
        super(...params);
        this.metaMap = require('../../entry.js');
    }

    act(id, ...params) {
        super.act(id, ...params);
        this.metaMap.logout();
        return true;
    }
}

module.exports = Logout;