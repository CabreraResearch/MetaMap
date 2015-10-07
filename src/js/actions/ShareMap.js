const riot = require('riot')
const ActionBase = require('./ActionBase.js');
const CONSTANTS = require('../constants/constants');
require('../tags/dialogs/share')

class ShareMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act(id, ...params) {
        super.act(id, ...params);
        this.metaFire.getData(`${CONSTANTS.ROUTES.MAPS_LIST}${id}`).then((map) => {
            map.id = id
            ShareMap.act({ map: map })
            this.metaMap.Router.back()
        });
        return true;
    }

    static act(map) {
        if (map) {
            let modal = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.META_MODAL_DIALOG_CONTAINER), CONSTANTS.TAGS.SHARE)[0]
            modal.update(map)
        }
    }
}

module.exports = ShareMap;