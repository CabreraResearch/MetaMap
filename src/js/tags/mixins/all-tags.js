const CONSTANTS = require('../../constants/constants')
const moment = require('moment')

let AllTags = {
    init: function() {
        this.Homunculus = require('../../../Homunculus.js')
        this.CONSTANTS = CONSTANTS
        this.NProgress = window.NProgress
        this.moment = moment
        this.cortex = null
    },

    getCortex: function(trainingId, trainingTag) {
        this.cortex = this.cortex || this.Homunculus.getCortex(trainingId, trainingTag)
        return this.cortex
    },

    getDate: function(date = '') {
        return moment(new Date(date)).format('YYYY-MM-DD')
    },

    getRelativeTime: function(date = '') {
		return moment(new Date(date)).fromNow();
	},

    getDisplay: function() {
		if (!this.display) {
			return 'display: none;';
		} else {
			return '';
		}
	}

}

module.exports = AllTags