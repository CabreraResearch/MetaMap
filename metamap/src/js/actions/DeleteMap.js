const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');
const _ = require('lodash');
const PAGES = require('../constants/pages.js');

class DeleteMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        DeleteMap.deleteAll([id]);
        return true;
    }

    static deleteAll(ids, path = PAGES.HOME) {
        const metaMap = require('../../entry.js');
        try {
            _.each(ids, (id) => {
                metaMap.MetaFire.deleteData(`${ROUTES.MAPS_DATA}${id}`);
                metaMap.MetaFire.deleteData(`${ROUTES.MAPS_LIST}${id}`);
            });
        } catch(e) {
            
        } finally {
            metaMap.Router.to(path);
        }        
    }
}

module.exports = DeleteMap;