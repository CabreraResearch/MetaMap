const CONSTANTS = require('../../constants/constants')
const NProgress = window.NProgress
const moment = require('moment')

let AllTags = {
    init: function() {
        this.MetaMap = require('../../../MetaMap.js')
        this.CONSTANTS = CONSTANTS
        this.NProgress = NProgress
        this.moment = moment
        this.cortex = null
    },

    getCortex: function(trainingId) {
        this.cortex = this.cortex || this.MetaMap.getCortex(trainingId)
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