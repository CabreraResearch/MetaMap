const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');

class NewMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act() {
        super.act();

        let mapId = NewMap.createMap()
        this.metaMap.MetaMap.Router.to(`map/${mapId}`);

        return true;
    }

    static createMap(opts = { title: 'New Untitled Map', map: {} }) {
        let MetaMap = require('../../MetaMap')
        let newMap = {
            created_at: `${new Date()}`,
            owner: {
                userId: MetaMap.User.userId,
                name: MetaMap.User.displayName,
                picture: MetaMap.User.picture
            },
            name: opts.title,
            shared_with: {
                admin: {
                    read: true,
                    write: true },
                '*': {
                    read: false,
                    write: false }
            },
            map: opts.map
        }
        let pushState = MetaMap.MetaFire.pushData(newMap, `${CONSTANTS.ROUTES.MAPS_LIST}`);
        let mapId = pushState.key();
        MetaMap.MetaFire.setData(newMap, `${CONSTANTS.ROUTES.MAPS_DATA}${mapId}`);

        return mapId
    }
}

module.exports = NewMap;