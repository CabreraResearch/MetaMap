const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
const _ = require('lodash');

class DeleteMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        DeleteMap.deleteAll([id]);
        return true;
    }

    static deleteAll(ids, path = CONSTANTS.PAGES.HOME) {
        const metaMap = require('../../MetaMap.js');
        try {
            _.each(ids, (id) => {
                metaMap.MetaFire.deleteData(`${CONSTANTS.ROUTES.MAPS_DATA}${id}`);
                metaMap.MetaFire.deleteData(`${CONSTANTS.ROUTES.MAPS_LIST}${id}`);
            });
        } catch(e) {
            
        } finally {
            metaMap.Router.to(path);
        }        
    }
}

module.exports = DeleteMap;