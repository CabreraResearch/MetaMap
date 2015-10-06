const IntegrationsBase = require('./_IntegrationsBase')

class NewRelic extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);

        this.NewRelic = window.NREUM;
    }

    get integration() {
        this.NewRelic = this.NewRelic || window.NREUM;
        return this.NewRelic;
    }

    init() {
        super.init();
    }

    setUser() {
        super.setUser();
        if (this.integration && this.integration.setCustomAttribute) {
            this.integration.setCustomAttribute('username', this.user.email);
            this.integration.setCustomAttribute('acccountID', this.user.userId);
        }
    }

    sendEvent(val, event, source, type) {
        super.sendEvent(val, event, source, type);
        if (this.integration) {
            this.integration.addToTrace(val);
        }
    }

    updatePath(path) {
        super.updatePath(path);
        if (this.integration) {
            this.setPageViewName(path, window.location.hostname);
        }
    }


}

module.exports = NewRelic;


