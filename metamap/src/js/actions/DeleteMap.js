const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');
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

    static deleteAll(ids) {
        _.each(ids, (id) => {
            this.metaMap.MetaFire.deleteData(`${ROUTES.MAPS_DATA}${id}`);
            this.metaMap.MetaFire.deleteData(`${ROUTES.MAPS_LIST}${id}`);
        });
    }
}

module.exports = DeleteMap;