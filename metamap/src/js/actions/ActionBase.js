class ActionBase {
    constructor(metaFire, eventer, pageFactory) {
        this.metaFire = metaFire;
        this.eventer = eventer;
        this.pageFactory = pageFactory;
    }

    act() {
        
    }
}

module.exports = ActionBase;