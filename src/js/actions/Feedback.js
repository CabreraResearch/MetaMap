const ActionBase = require('./ActionBase.js');

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