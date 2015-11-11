const CONSTANTS = require('../constants/constants');

class ActionBase {
    constructor(metaFire, eventer, pageFactory) {
        this.metaFire = metaFire;
        this.eventer = eventer;
        this.pageFactory = pageFactory;
        this.metaMap = require('../../MetaMap.js');
    }

    act(id, ...params) {
        return false;
    }
}

module.exports = ActionBase;