const ActionBase = require('./ActionBase.js');

class Feedback extends ActionBase {
    constructor(...params) {
        super(...params);
        this.userSnap = window.UserSnap;
    }

    act() {
        super.act();
        if(this.userSnap) {
            this.userSnap.openReportWindow();
        }
        this.Homunculus.Router.back()
        return true;
    }
}

module.exports = Feedback;