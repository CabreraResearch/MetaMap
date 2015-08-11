const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');

class NewMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act() {
        super.act();
        this.metaFire.getData(`${ROUTES.MAPS_NEW_MAP}`).then((blankMap) => {
            let newMap = {
                created_at: new Date(),
                owner: this.metaMap.User.userId,
                name: 'Untitled Map'
            }
            let pushState = this.metaFire.pushData(newMap, `${ROUTES.MAPS_LIST}`);
            let mapId = pushState.key();
            this.metaFire.setData(blankMap, `${ROUTES.MAPS_DATA}${mapId}`);
            this.metaMap.Router.to(`map/${mapId}`);
        });
        return true;
    }
}

module.exports = NewMap;