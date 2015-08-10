const ActionBase = require('./ActionBase.js');

class DeleteMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act() {
        super.act();
        return true;
    }
}

module.exports = DeleteMap;