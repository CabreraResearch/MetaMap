const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');

class NewMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act() {
        super.act();
        this.metaFire.getData(`${CONSTANTS.ROUTES.MAPS_NEW_MAP}`).then((blankMap) => {
            let newMap = {
                created_at: `${new Date()}`,
                owner: {
                    userId: this.metaMap.User.userId,
                    name: this.metaMap.User.displayName,
                    picture: this.metaMap.User.picture
                },
                name: 'New Untitled Map',
                shared_with: {
                    admin: {
                        read: true,
                        write: true },
                    '*': {
                        read: false,
                        write: false }
                }
            }
            let pushState = this.metaFire.pushData(newMap, `${CONSTANTS.ROUTES.MAPS_LIST}`);
            let mapId = pushState.key();
            this.metaFire.setData(newMap, `${CONSTANTS.ROUTES.MAPS_DATA}${mapId}`);
            this.metaMap.Router.to(`map/${mapId}`);
        });
        return true;
    }
}

module.exports = NewMap;