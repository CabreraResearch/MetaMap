const _ = require('lodash')

class CortexMan {

    constructor(training) {
        this.training = training;
    }

    update(training) {
        this.training = training || this.training
    }

    getOutline() {
        return _.filter(this.training.course, (item) => {
            return item.Section && item.Section.length > 0
        })
    }

}

module.exports = CortexMan