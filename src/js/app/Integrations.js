const _ = require('lodash')

class Integrations {

	constructor(Homunculus, user) {
		this.config = Homunculus.config;
		this.Homunculus = Homunculus;
		this.user = user;
		this._features = {
			// google: require('../integrations/Google'),
			// usersnap: require('../integrations/UserSnap'),
            // youtube: require('../integrations/YouTube'),
            // segment : require('../integrations/Segment')
		};
	}

	init() {
        _.each(this._features, (Feature, name) => {
            if (Feature) {
				try {
					let config = this.config[name];
					this[name] = new Feature(config, this.user);
					this[name].init();
					this[name].setUser();
				} catch (e) {
					this.Homunculus.error(e);
				}
			}
        });
    }

    _all(callback, ...params) {
        _.each(this._features, (Feature, name) => {
            if (name && this[name] && this[name][callback]) {
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