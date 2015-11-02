const CONSTANTS = require('../../constants/constants')
const moment = require('moment')

let TrainingMix = {
    init: function() {
        this.MetaMap = require('../../../MetaMap.js')
    },

    getDate: function (date) {
        return moment(new Date(date)).format('YYYY-MM-DD')
    },

    saveTraining: function (id, data) {
        if (id) {
            let cortex = this.MetaMap.getCortex(id)
            cortex.saveTraining(data)
        }
    },

    getData: function(id) {
        if (id) {
            let cortex = this.MetaMap.getCortex(id)
            let that = this

            cortex.getTraining((data) => {
                that.update();
            })
        }
    }

}

module.exports = TrainingMix