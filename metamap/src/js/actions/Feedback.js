const ActionBase = require('./ActionBase.js');
const ROUTES = require('../constants/routes.js');

class Feedback extends ActionBase {
    constructor(...params) {
        super(...params);
        this.userSnap = window.UserSnap;
    }

    act() {
        super.act();
        this.userSnap.openReportWindow();
        return true;
    }
}

module.exports = Feedback;