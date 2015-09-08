const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const _ = require('lodash');

class Logout extends ActionBase {
    constructor(...params) {
        super(...params);
        this.metaMap = require('../../MetaMap.js');
    }

    act(id, ...params) {
        super.act(id, ...params);
        this.metaMap.logout();
        return true;
    }
}

module.exports = Logout;