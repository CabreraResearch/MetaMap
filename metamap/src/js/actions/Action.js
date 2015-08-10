const ActionBase = require('./ActionBase.js');

class Action extends ActionBase {
    constructor(...params) {
        super(...params);
        this._actions = {};
    }

    _getAction(action) {
        let ret = this._actions[action];
        if (!ret) {
            let Method = null;
            switch(action) {
                case 'map':
                    Method = require('./OpenMap.js');
                    break;
                case 'new_map':
                    Method = require('./NewMap.js');
                    break;
                case 'copy_map':
                    Method = require('./CopyMap.js');
                    break;
                case 'delete_map':
                    Method = require('./DeleteMap.js');
                    break;
            }
            if (Method) {
                ret = new Method(this.metaFire, this.eventer, this.pageFactory);
                this._actions[action] = ret;
            }
        }
        return ret;
    }

    act(action, ...params) {
        super.act();
        let method = this._getAction(action);
        if (method) {
            return method.act(...params);
        }
    }

}

module.exports = Action;