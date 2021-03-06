const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const Promise = require('bluebird')
const _ = require('lodash')

class CopyMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        Homunculus.Router.back()
        CopyMap.copyMap(id, true)
        return true;
    }

    static appendCopy(str) {
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

    static copyMap(id, openMap = false) {
        if (!id) {
            return new Error('Must have a map in order to copy.');
        }
        return new Promise((resolve, reject) => {
            let Homunculus = require('../../Homunculus')
            Homunculus.MetaFire.getData(`${CONSTANTS.ROUTES.MAPS_LIST}${id}`).then((oldMap) => {
                if(oldMap) {
                    let newMap = {
                        created_at: `${new Date()}`,
                        owner: {
                            userId: Homunculus.User.userId,
                            name: Homunculus.User.displayName,
                            picture: Homunculus.User.picture
                        },
                        name: CopyMap.appendCopy(oldMap.name),
                        shared_with: {
                            admin: {
                                read: true,
                                write: true },
                            '*': {
                                read: false,
                                write: false }
                        }
                    }
                    Homunculus.MetaFire.getData(`${CONSTANTS.ROUTES.MAPS_DATA}${id}`).then((oldMapData) => {
                        let pushState = Homunculus.MetaFire.pushData(newMap, `${CONSTANTS.ROUTES.MAPS_LIST}`);
                        let mapId = pushState.key();
                        Homunculus.MetaFire.setData(oldMapData, `${CONSTANTS.ROUTES.MAPS_DATA}${mapId}`);
                        resolve(_.extend(oldMap, oldMapData))
                        if (openMap) {
                            Homunculus.Router.to(`map/${mapId}`);
                        } 
                    });
                } else {
                    resolve(null)
                }
            })
        })
    }
}

module.exports = CopyMap;