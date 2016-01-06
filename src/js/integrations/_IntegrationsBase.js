class IntegrationsBase {
	constructor(config, user) {
		this.config = config;
        this.user = user;
        this.Homunculus = require('../../Homunculus')
	}

	init() {

	}

	get integration() {
		return {};
	}

	setUser() {

	}

	sendEvent() {

    }

    sendError(message, isFatal = false) {

    }

	updatePath() {

	}

	logout() {

	}

}

module.exports = IntegrationsBase;