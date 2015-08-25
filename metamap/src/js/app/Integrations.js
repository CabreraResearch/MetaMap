const _ = require('lodash')

const Twiiter = require('../integrations/Twitter');
const Facebook = require('../integrations/Facebook');

class Integrations {

	constructor(metaMap, user) {
		this.config = metaMap.config;
		this.metaMap = metaMap;
		this.user = user;
		this._features = {
			google: require('../integrations/Google'),
			usersnap: require('../integrations/UserSnap'),
			intercom: require('../integrations/Intercom'),
			zendesk: require('../integrations/Zendesk'),
			addthis: require('../integrations/AddThis'),
			newrelic: require('../integrations/NewRelic')
		};
	}

	init() {
        _.each(this._features, (Feature, name) => {
            if (Feature) {
				try {
					let config = this.config.site[name];
					this[name] = new Feature(config, this.user);
					this[name].init();
					this[name].setUser();
				} catch (e) {
					this.metaMap.error(e);
				}
			}
        });
    }

	setUser() {
		_.each(this._features, (Feature, name) => {
            if (name) {
				this[name].setUser();
			}
        });
	}
	
	sendEvent(val, ...params) {
		_.each(this._features, (Feature, name) => {
            if (name) {
				this[name].sendEvent(val, ...params);
			}
        });
	}

	updatePath() {
		
	}
	
	logout() {
		_.each(this._features, (Feature, name) => {
            if (name) {
				try {
					this[name].logout();
				} catch(e) {
					this.metaMap.error(e);
				}
			}
        });
	}

}

module.exports = Integrations;