const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');

class NewMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act() {
        super.act();

        let mapId = NewMap.createMap().mapId
        this.metaMap.Router.to(`map/${mapId}`);

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
            }
        }
        let pushState = MetaMap.MetaFire.pushData(newMap, `${CONSTANTS.ROUTES.MAPS_LIST}`);
        let mapId = pushState.key();
        let mapData = {
            changed_by: {
                userId: MetaMap.User.userId,
                name: MetaMap.User.displayName,
                picture: MetaMap.User.picture
            },
            data: opts.map
        }
        MetaMap.MetaFire.setData(mapData, `${CONSTANTS.ROUTES.MAPS_DATA}${mapId}`);

        return { mapId: mapId, map: _.extend(newMap,mapData) }
    }
}

module.exports = NewMap;