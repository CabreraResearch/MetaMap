const riot = require('riot')

const CONSTANTS = require('../../constants/constants')
const likert = require('./likert')
const ok = require('./ok')
const multipleChoice = require('./multiple-choice')
const video = require('./video')
const videoButton = require('./video-button')
const more = require('./more')
const canvas = require('./canvas')
const defaults = require('./default')
const shortanswer = require('./short-answer')

class ActionFactory {

    constructor(cortex) {
        this.cortex = cortex
    }

}

module.exports = ActionFactory