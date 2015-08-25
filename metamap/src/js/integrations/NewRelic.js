const IntegrationsBase = require('./_IntegrationsBase')

class NewRelic extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);

        this.NewRelic = window.NREUM;
    }
    
    get integration() {
        this.NewRelic = this.NewRelic || window.NREUM;
        return this.addthis;
    }
    
    init() {
        super.init();
    }
}

module.exports = NewRelic;


