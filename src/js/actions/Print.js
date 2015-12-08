const riot = require('riot')
const ActionBase = require('./ActionBase.js')
const CONSTANTS = require('../constants/constants')
require('../tags/dialogs/about')

class Print extends ActionBase {
    constructor(...params) {
        super(...params)
    }

    act(id, ...params) {
        super.act(id, ...params)

        var printContents = document.getElementById(CONSTANTS.ELEMENTS.CANVAS).innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;

        this.metaMap.Router.back()

        return true
    }

}

module.exports = Print