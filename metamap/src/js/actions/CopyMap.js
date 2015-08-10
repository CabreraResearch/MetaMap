const ActionBase = require('./ActionBase.js');

class CopyMap extends ActionBase {
    constructor(...params) {
        super(...params);
    }

    act() {
        super.act();
        return true;
    }
}

module.exports = CopyMap;