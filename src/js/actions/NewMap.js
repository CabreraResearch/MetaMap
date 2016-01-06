const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const _ = require('lodash')

class NewMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act() {
        super.act();

        let mapId = NewMap.createMap().mapId
        this.Homunculus.Router.to(`map/${mapId}`);

        return true;
    }

    static createMap(opts = { title: 'New Untitled Map', map: {} }) {
        let Homunculus = require('../../Homunculus')
        let newMap = {
            created_at: `${new Date()}`,
            owner: {
                userId: Homunculus.User.userId,
                name: Homunculus.User.displayName,
                picture: Homunculus.User.picture
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
        let pushState = Homunculus.MetaFire.pushData(newMap, `${CONSTANTS.ROUTES.MAPS_LIST}`);
        let mapId = pushState.key();
        let mapData = {
            changed_by: {
                userId: Homunculus.User.userId,
                name: Homunculus.User.displayName,
                picture: Homunculus.User.picture
            },
            data: opts.map
        }
        Homunculus.MetaFire.setData(mapData, `${CONSTANTS.ROUTES.MAPS_DATA}${mapId}`);

        return { mapId: mapId, map: _.extend(newMap,mapData) }
    }
}

module.exports = NewMap;