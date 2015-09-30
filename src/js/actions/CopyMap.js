const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');

class CopyMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        if (!id) {
            return new Error('Must have a map in order to copy.');
        }
        this.metaFire.getData(`${CONSTANTS.ROUTES.MAPS_LIST}${id}`).then((oldMap) => {
            let newMap = {
                created_at: `${new Date()}`,
                owner: {
                    userId: this.metaMap.User.userId,
                    name: this.metaMap.User.displayName,
                    picture: this.metaMap.User.picture
                },
                name: this.appendCopy(oldMap.name),
                shared_with: {
                    admin: {
                        read: true,
                        write: true },
                    '*': {
                        read: false,
                        write: false }
                }
            }
            this.metaFire.getData(`${CONSTANTS.ROUTES.MAPS_DATA}${id}`).then((oldMapData) => {
                let pushState = this.metaFire.pushData(newMap, `${CONSTANTS.ROUTES.MAPS_LIST}`);
                let mapId = pushState.key();
                this.metaFire.setData(oldMapData, `${CONSTANTS.ROUTES.MAPS_DATA}${mapId}`);
                this.metaMap.Router.to(`map/${mapId}`);
            });
        });
        return true;
    }

    appendCopy(str) {
        let ret = str;
        if (!_.contains(str, '(Copy')) {
            ret = ret + ' (Copy 1)';
        } else {
            let mess = str.split(' ');
            let cnt = 2;
            if (mess.length - mess.lastIndexOf('(Copy') <= 4) {
                let grbg = mess[mess.length - 1];
                if (grbg) {
                    grbg = grbg.replace(')', '');
                    cnt = +grbg + 1;
                    ret = mess.slice(0, mess.length - 2).join(' ');
                }
            }
            ret += ` (Copy ${cnt})`;
        }
        return ret;
    }
}

module.exports = CopyMap;