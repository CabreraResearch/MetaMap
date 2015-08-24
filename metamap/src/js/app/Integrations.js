const _ = require('lodash')

const UserSnap = require('../integrations/UserSnap');
const ZenDesk = require('../integrations/Zendesk');
const Google = require('../integrations/Google');
const Twiiter = require('../integrations/Twitter');
const Facebook = require('../integrations/Facebook');
const AddThis = require('../integrations/addthis');
const Intercom = require('../integrations/Intercom');

class Integrations {

	constructor(metaMap, user) {
		this.config = metaMap.config;
		this.metaMap = metaMap;
		this.user = user;
		this._features = {};

		this._features.google = Google;
		this._features.usersnap = UserSnap;
		this._features.intercom = Intercom;
		this._features.zendesk = ZenDesk;
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

}

module.exports = Integrations;