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
        this.currentMessageKey = 0
        this.isTimerOff = true
    }

    restart() {
        this.messages = []
        this.userTraining = { messages: [] }
        this.currentMessageKey = 0
        this._messageGen = null
        this._messages = null
        this.MetaMap.MetaFire.deleteData(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`)
        this._onceGetData = null
        this.isTimerOff = true
        this.getData()
    }

    get picture() { return 'src/images/cortex-avatar-small.jpg' }

    getOutline() {
        return _.filter(this.training.course, (item) => {
            return item.section && item.section.length > 0
        })
    }

    massageConstant(action) {
        let ret = ''
        if(action && action.length > 0) {
            ret = action.trim().split(' ')[0].toLowerCase().trim()
        }
        return ret
    }

    runCallbacks() {
        _.each(this._callbacks, (cb) => {
            cb(this)
        })
    }

    processFeedback(obj) {
        this.userTraining.messages.push({
                message: obj.line,
                author: 'cortex',
                time: `${new Date() }`
        })
        this.saveUserTraining()
    }

    processUserResponse(obj, originalMessage) {
        if(obj) {
            let response = {
                time: `${new Date() }`
            }
            _.extend(obj, response)

            const moveToNextMessage = (feedback) => {
                this.userTraining.messages.push(obj)

                if (feedback) {
                    this.processFeedback(feedback)
                }
                //TODO: add validation logic here
//                 let currentStep = this.training.course[this.currentMessageKey]
//                 if (obj.message == currentStep.line) {
//
//                 }
                if (!this.userTraining.isWaitingOnFeedback) {
                    let nextStep = this.getNextMessage()
                    if (nextStep) {
                        this.userTraining.messages.push(nextStep)
                        switch (this.massageConstant(nextStep.action)) {
                            case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:
                                this.processUserResponse({
                                    action: CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO
                                }, nextStep)
                                break
                            case CONSTANTS.CORTEX.RESPONSE_TYPE.TIMER:
                                this.isTimerOff = false
                                this.runCallbacks()
                                _.delay(() => {
                                    this.processUserResponse({
                                        action: CONSTANTS.CORTEX.RESPONSE_TYPE.TIMER
                                    }, nextStep)
                                    this.isTimerOff = true
                                }, 5000)
                                break
                        }
                    } else {
                        this.currentMessage.archived = true
                    }
                }
                this.saveUserTraining()
            }

            if(obj.action) {
                switch(this.massageConstant(obj.action)) {
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.OK:
                        obj.message = 'OK'
                        moveToNextMessage()
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.TIMER:
                        moveToNextMessage()
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                        _.each(obj.data, (val, key) => {
                            obj[key] = val
                            delete obj.data[key]
                        })
                        if (obj.request_feedback) {
                            this.userTraining.isWaitingOnFeedback = true
                            moveToNextMessage({ line: 'I\'m sorry to hear that! How can we make improve this for the next version of this training?' })
                        } else {
                            moveToNextMessage({ line: 'Thanks for the feedback!' })
                        }
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:
                        let button = 'Play'
                        if (obj.data && obj.data.buttonName) {
                            button = obj.data.buttonName
                        }
                        switch (button) {
                            case 'OK':
                                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.STOP_VIDEO, originalMessage)
                                if (!originalMessage.archived) {
                                    obj.message = 'OK'
                                    moveToNextMessage()
                                }
                                break
                            case 'Play':
                                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.PLAY_VIDEO, originalMessage)
                                break
                        }
                        break
                }
            } else if(obj.message) {
                switch(this.massageConstant(obj.message)) {
                    case 'help':
                        this.userTraining.messages.push({
                            author: 'cortex',
                            time: `${new Date() }`,
                            message: `<span>Help? You got it. Here are some of the things I can do for you:
                                        <ul>
                                            <li><code>help</code> - Return help</li>
                                            <li><code>restart</code> - Restart this course from the beginning. Warning: this will delete your progress!</li>
                                        </ul>
                                    </span>`
                        })
                        break
                    case 'restart':
                        if(confirm('Are you sure? All of your progress will be lost!')) {
                            this.restart()
                        }
                        break

                    default:
                        if (this.userTraining.isWaitingOnFeedback) {
                            this.userTraining.isWaitingOnFeedback = false
                            moveToNextMessage({ line: 'Thanks for the feedback! We\'ll use this to improve the next training!' })
                        }
                        break
                }
            }
            this.runCallbacks()
        }
    }

    saveUserTraining() {
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
                this.MetaMap.MetaFire.getData(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`).then((data) => {
                    this.userTraining = data
                    if (!data) {
                        this.userTraining = this.training
                        this.runCallbacks()
                    }
                    if (!this.userTraining.messages) {
                        this.userTraining.messages = [this.getNextMessage()]
                    } else {
                        this.currentMessageKey = this.userTraining.messages.length - 1
                        this.currentMessage = this.userTraining.messages[this.currentMessageKey]
                        if (this.currentMessage.action && this.currentMessage.action != CONSTANTS.CORTEX.RESPONSE_TYPE.OK) {
                            this.processUserResponse({ action: this.currentMessage.action, data: {}}, this.currentMessage)
                        }
                        this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, this.currentMessage)
                    }
                    this.saveUserTraining()
                    this.runCallbacks()
                    NProgress.done()
                })
                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_OPEN, this.trainingId)
            })

            this.MetaMap.MetaFire.getData(`${CONSTANTS.ROUTES.COURSE_LIST}${this.trainingId}`).then((data) => {
                this.training = data
                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.PAGE_NAME, data)
                once()
            })
        })
        this._onceGetData()

    }

    _massageTrainingMessage(idx=0) {
        let ret = null
        if (this.userTraining) {
            let messages = this.getMessages()
            let courseMsg = messages[idx]
            if (courseMsg) {
                courseMsg.message = courseMsg.line
                courseMsg.author = 'cortex'
                courseMsg.time = `${new Date() }`
                ret = courseMsg

                if (this.userTraining.messages) {
                    //guarantee that all previous messages are archived
                    let back = 1
                    let len = this.userTraining.messages.length
                    let lastMessage = this.userTraining.messages[len-back]
                    while(lastMessage && true != lastMessage.archived) {
                        lastMessage.archived=true
                        back += 1
                        lastMessage = this.userTraining.messages[len-back]
                    }
                }
                this.userTraining.course[courseMsg.id].archived = true
            }
        }
        return ret
    }

    getMessages() {
        this._messages = this._messages || _.filter(_.map(this.userTraining.course, (m, idx) => {
                let n = _.extend({}, m)
                n.id = idx
                return n
        }), (msg) => {
                return msg.line && msg.line.length > 0 && true != msg.archived
            })
        return this._messages
    }

    getMessageGenerator() {
        const state = this
        this.__messageGen = this.__messageGen ||
         function* (idx = 0) {
             state.currentMessageKey = idx
             let messages = state.getMessages()
             while (idx < messages.length) {
                let now = idx
                idx += 1
                state.currentMessageKey = now
                let next = state._massageTrainingMessage(now)
                state.currentMessage = next
                state.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, next)
                yield next
            }
        }
        return this.__messageGen
    }

    getNextMessage() {
        if (!this._messageGen) {
            let generator = this.getMessageGenerator()
            this._messageGen = generator()
        }
        let ret = this._messageGen.next().value
        return ret
    }

}

module.exports = CortexMan