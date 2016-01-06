const CONSTANTS = require('../constants/constants');

class ActionBase {
    constructor(metaFire, eventer, pageFactory) {
        this.metaFire = metaFire;
        this.eventer = eventer;
        this.pageFactory = pageFactory;
        this.Homunculus = require('../../Homunculus.js');
    }

    act(id, ...params) {
        return false;
    }
}

module.exports = ActionBase;