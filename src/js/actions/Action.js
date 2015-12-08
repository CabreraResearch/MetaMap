const ActionBase = require('./ActionBase.js')
const CONSTANTS = require('../constants/constants')

class Action extends ActionBase {
    constructor(...params) {
        super(...params)
        this._actions = {}
    }

    _getAction(action) {
        let ret = this._actions[action]
        if (!ret) {
            let Method = null
            switch(action) {
                case CONSTANTS.ACTIONS.ABOUT:
                    Method = require('./About')
                    break
                case CONSTANTS.ACTIONS.OPEN_MAP:
                    Method = require('./OpenMap.js')
                    break
                case CONSTANTS.ACTIONS.TRAININGS:
                    Method = require('./OpenTraining.js')
                    break
                case CONSTANTS.ACTIONS.NEW_MAP:
                    Method = require('./NewMap.js')
                    break
                case CONSTANTS.ACTIONS.COPY_MAP:
                    Method = require('./CopyMap.js')
                    break
                case CONSTANTS.ACTIONS.COURSE_LIST:
                    Method = require('./Courses')
                    break
                case CONSTANTS.ACTIONS.DELETE_MAP:
                    Method = require('./DeleteMap.js')
                    break
                case CONSTANTS.ACTIONS.MY_MAPS:
                    Method = require('./MyMaps.js')
                    break
                case CONSTANTS.ACTIONS.LOGOUT:
                    Method = require('./Logout.js')
                    break
                case CONSTANTS.ACTIONS.SHARE_MAP:
                    Method = require('./ShareMap')
                    break
                case CONSTANTS.ACTIONS.TERMS_AND_CONDITIONS:
                    Method = require('./Terms.js')
                    break
                case CONSTANTS.ACTIONS.FEEDBACK:
                    Method = require('./Feedback')
                    break
                case CONSTANTS.ACTIONS.PRINT_MAP:
                    Method = require('./Print')
                    break
                default:
                    Method = require('./Home.js')
                    break
            }
            if (Method) {
                ret = new Method(this.metaFire, this.eventer, this.pageFactory)
                this._actions[action] = ret
            }
        }
        return ret
    }

    act(action, ...params) {
        super.act()
        let method = this._getAction(action)
        if (method) {
            return method.act(...params)
        }
    }

}

module.exports = Action