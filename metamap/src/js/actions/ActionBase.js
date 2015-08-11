class ActionBase {
    constructor(metaFire, eventer, pageFactory) {
        this.metaFire = metaFire;
        this.eventer = eventer;
        this.pageFactory = pageFactory;
        this.metaMap = require('../../entry.js');
    }

    act() {
        
    }
}

module.exports = ActionBase;