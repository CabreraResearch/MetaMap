const _ = require('lodash')
const CONSTANTS = require('../constants/constants')
const NProgress = window.NProgress
const moment = require('moment')

class CortexMan {

    constructor(trainingId) {
        this.MetaMap = require('../../MetaMap')
        this.messages = []
        this.trainingId = trainingId
        this.userTraining = { messages: [] }
        this._callbacks = []
        this.currentMessage = 0
    }

    get picture() { return 'src/images/cortex-avatar-small.jpg' }

    getOutline() {
        return _.filter(this.training.course, (item) => {
            return item.Section && item.Section.length > 0
        })
    }

    processUserResponse(obj) {
        let currentStep = this.training.course[this.currentMessage]
        //TODO: add validation logic here
        if (obj.message == currentStep.Line) {

        }
        let response = {
            time: `${new Date() }`
        }
        _.extend(obj, response)
        this.userTraining.messages.push(obj)
        let nextStep = this.getNextMessage()
        this.userTraining.messages.push({
            author: 'cortex',
            time: `${new Date() }`,
            message: nextStep.message.Line
        })

        this.MetaMap.MetaFire.updateData(this.userTraining, `${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`)
    }

    saveTraining(data) {
        let updateObj = {
            updated_date: `${new Date() }`,
            updated_by: {
                user_id: this.MetaMap.User.userId,
                name: this.MetaMap.User.displayName,
                picture: this.MetaMap.User.picture
            }
        }
        _.extend(updateObj, data)
        this.MetaMap.MetaFire.updateData(updateObj, `${CONSTANTS.ROUTES.COURSE_LIST}${this.trainingId}`)
    }

    getData(callback = _.noop) {
        if (callback && !_.contains(this._callbacks, callback)) {
            this._callbacks.push(callback)
        }
        this._onceGetData = this._onceGetData || _.once(function () {

            var once = _.once(() => {
                this.MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`, (data) => {
                    this.userTraining = data
                    if (!data) {
                        this.userTraining = this.training
                        this.saveUserTraining(this.trainingId)
                    }
                    if (!this.userTraining.messages) {
                        this.userTraining.messages = [this.getDefaultMessage(this.training.name)]
                        this.saveUserTraining(this.trainingId)
                    }
                    _.each(this._callbacks, (cb) => {
                        cb(this)
                    })
                    NProgress.done()
                })
                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_OPEN, this.trainingId)
            })

            this.MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.COURSE_LIST}${this.trainingId}`, (data) => {
                this.training = data
                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.PAGE_NAME, data)

                _.each(this._callbacks, (cb) => {
                    cb(this)
                })
                once()
            })
        })
        this._onceGetData()

    }

    getDefaultMessage(name) {
        return {
            message: `Hello, I'm Cortex Man. I will be your guide through ${name}`,
            author: 'cortex',
            time: `${new Date() }`
        }
    }

    getMessageGenerator() {
        const state = this
        this.__messageGen = this.__messageGen ||
         function* (idx = 0) {
             state.currentMessage = idx
             let messages = _.filter(state.training.course, (msg) => { return msg.Line && msg.Line.length > 0 })
             while (idx < messages.length) {
                let now = idx
                idx += 1
                state.currentMessage = now
                yield { idx: now, message: messages[now] }
            }
        }
        return this.__messageGen
    }

    getNextMessage() {
        if (!this._messageGen) {
            let generator = this.getMessageGenerator()
            this._messageGen = generator()
        }
        return this._messageGen.next().value
    }

}

module.exports = CortexMan