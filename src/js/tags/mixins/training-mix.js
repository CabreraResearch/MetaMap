const CONSTANTS = require('../../constants/constants')
const moment = require('moment')
const Cortex = require('../../training/cortex')

let TrainingMix = {
    init: function() {
        this.MetaMap = require('../../../MetaMap.js')
    },

    getDate: function (date) {
        return moment(new Date(date)).format('YYYY-MM-DD')
    },

    saveTraining: function (id, data) {
        if (id) {
            Cortex.saveTraining(id, data)
        }
    }

}

module.exports = TrainingMix