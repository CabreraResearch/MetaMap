const _ = require('lodash')

class Integrations {

	constructor(metaMap, user) {
		this.config = metaMap.config;
		this.metaMap = metaMap;
		this.user = user;
		this._features = {
			google: require('../integrations/Google'),
			usersnap: require('../integrations/UserSnap'),
            addthis: require('../integrations/AddThis'),
            youtube: require('../integrations/YouTube')
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

    _all(callback, ...params) {
        _.each(this._features, (Feature, name) => {
            if (name && this[name]) {
                try {
                    this[name][callback](...params);
                } catch (e) {
                    console.error(e);
                }
			}
        });
    }

	setUser() {
        this._all('setUser')
	}

	sendEvent(...params) {
        this._all('sendEvent', ...params)
    }

    sendError(message, isFatal = false) {
        this._all(message, isFatal)
    }

	updatePath(...params) {
        this._all('updatePath', ...params)
	}

	logout(...params) {
		this._all('logout', ...params)
	}

}

module.exports = Integrations;