const riot = require('riot')

const CONSTANTS = require('../../constants/constants')
const likert = require('./likert')
const ok = require('./ok')
const multipleChoice = require('./multiple-choice')
const video = require('./video')
const more = require('./more')

class ActionFactory {

    constructor(cortex) {
        this.cortex = cortex
    }

}

module.exports = ActionFactory