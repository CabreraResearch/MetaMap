const _ = require('lodash')

class Integrations {

	constructor(metaMap, user) {
		this.config = metaMap.config;
		this.metaMap = metaMap;
		this.user = user;
		this._features = {
			google: require('../integrations/Google'),
			usersnap: require('../integrations/UserSnap'),
			addthis: require('../integrations/AddThis')
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
                try {
                    this[name].setUser();
                } catch (e) {
                    console.error(e);
                }
			}
        });
	}

	sendEvent(val, ...params) {
        if (!this.metaMap.debug) {
            _.each(this._features, (Feature, name) => {
                if (name) {
                    try {
                        this[name].sendEvent(val, ...params);
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        }
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