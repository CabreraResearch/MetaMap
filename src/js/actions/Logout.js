const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const _ = require('lodash');

class Logout extends ActionBase {
    constructor(...params) {
        super(...params);
        this.Homunculus = require('../../Homunculus.js');
    }

    act(id, ...params) {
        super.act(id, ...params);
        this.Homunculus.logout();
        return true;
    }
}

module.exports = Logout;