class IntegrationsBase {
	constructor(config, user) {
		this.config = config;
		this.user = user;
	}
	
	init() {
		
	}
	
	get integration() {
		return {};
	}
	
	setUser() {
		
	}
	
}

module.exports = IntegrationsBase;