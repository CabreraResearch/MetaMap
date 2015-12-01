const _ = require('lodash')
const CONSTANTS = require('../constants/constants')
const moment = require('moment')
const uuid = require('../tools/uuid')

class CortexMan {

    constructor(trainingId, trainingTag) {
        this._cortex_id = uuid()
        this.MetaMap = require('../../MetaMap')
        this.messages = []
        this.trainingId = trainingId
        this.userTraining = { messages: [] }
        this._callbacks = []
        this.currentMessageKey = 0
        this.isTimerOn = true
        this.trainingTag = trainingTag
    }

    restart() {
        this.MetaMap.MetaFire.deleteData(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`)
        this.destroy()
        // this.runCallbacks()
        // this.trainingTag.doBeforeNextStep({action: CONSTANTS.CORTEX.RESPONSE_TYPE.RESTART})
        // this.getData()
        window.location.reload()
    }

    destroy() {
        this.MetaMap.MetaFire.off(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`)
        this.MetaMap.MetaFire.off(`${CONSTANTS.ROUTES.COURSE_LIST}${this.trainingId}`)
        this.messages = []
        this.userTraining = { messages: [] }
        this.currentMessageKey = 0
        this._messageGen = null
        this._messages = null
        this.dataReady = null
        this.isTimerOn = true
        this._isDestroyed = true
        //this.trainingTag.unmount(true)
    }

    get picture() { return 'src/images/cortex-avatar-small.jpg' }

    getOutline() {
        let ret = []
        let out = _.sortBy(this.userTraining.outline, 'section_no')
        _.each(out, (section) => {
            let parts = section.section_no.split('-')
            if (parts.length === 1) {
                ret.push(section)
            } else {
                let p = _.find(ret, (s) => {
                    return s.section_no == parts[0]
                })
                p.submenu = p.submenu || []
                if (!_.any(p.submenu, (s) => {
                    return s.section_no == section.section_no
                })) {
                    p.submenu.push(section)
                }

            }
        })
        return ret
    }

    massageConstant(action) {
        let ret = ''
        if(action && action.length > 0) {
            ret = action.trim().split(' ')[0].toLowerCase().trim()
        }
        while (ret.startsWith('/')) {
            ret = ret.substr(1)
        }
        return ret
    }

    addToCallbacks(callback = _.noop) {
        if (callback && !_.contains(this._callbacks, callback)) {
            this._callbacks.push(callback)
        }
    }

    runCallbacks() {
        if (!this._runCallbacks) {
            this._runCallbacks = _.throttle(() => {
                _.each(this._callbacks, (cb) => {
                    cb(this)
                })
            }, 2000)
        }
        this._runCallbacks()
    }

    buffer(time = 1000) {
        this.isTimerOn = true
        this.runCallbacks()
        return new Promise((resolve) => {
            _.delay(() => {
                this.isTimerOn = false
                this.runCallbacks()
                resolve()
            }, time)
        })
    }

    saveUserTraining() {
        let ret = this.MetaMap.MetaFire.updateData(this.userTraining, `${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`)
        return ret
    }

    static saveTraining(id, data) {
        let MetaMap = require('../../MetaMap')
        let updateObj = {
            updated_date: `${new Date() }`,
            updated_by: {
                user_id: MetaMap.User.userId,
                name: MetaMap.User.displayName,
                picture: MetaMap.User.picture
            }
        }
        _.extend(updateObj, data)
        MetaMap.MetaFire.updateData(updateObj, `${CONSTANTS.ROUTES.COURSE_LIST}${id}`)
    }

    saveTraining(data) {
        return CortexMan.saveTraining(this.trainingId, data)
    }

    processFeedback(obj, int=50) {
        if (!obj.line) {
            int=0
        }
        this.buffer(int).then(() => {
            if (obj.line) {
                this.sendMessage({
                    message: obj.line,
                    author: 'cortex',
                    time: `${new Date() }`,
                    action: CONSTANTS.CORTEX.RESPONSE_TYPE.FEEDBACK
                })
            }
        })
    }

    sendMessage(message) {
        this.userTraining.messages = this.userTraining.messages || []
        this.userTraining.messages.push(message)
        this.runCallbacks()
        this.saveUserTraining()
        return Promise.resolve()
    }

    moveToNextMessage(obj, feedback) {
        this.isTimerOn = true
        let originalMessage = this.currentMessage

        if (feedback) {
            this.processFeedback(feedback)
        }

        this.sendMessage(obj).then(() => {
            if (true != this.userTraining.isWaitingOnFeedback) {
                let nextStep = this.getNextMessage()
                if (nextStep) {
                    let timer = 150
                    this.buffer(timer).then(() => {
                        this.sendMessage(nextStep).then(()=>{
                            originalMessage.archived = true
                            this.runCallbacks()
                            switch (nextStep.action) {
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:
                                    this.trainingTag.doNextStep(nextStep)
                                    break
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS:
                                    this.userTraining.isWaitingOnFeedback = true
                                    this.trainingTag.doNextStep(nextStep)
                                    break
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_CONTINUOUS:
                                    this.userTraining.isWaitingOnFeedback = false
                                    this.trainingTag.doNextStep(nextStep)
                                    break
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                                    this.userTraining.isWaitingOnFeedback = true
                                    this.trainingTag.doNextStep(nextStep)
                                    break
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.OK:
                                    this.trainingTag.doNextStep(nextStep)
                                    break
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.MORE:
                                    this.trainingTag.doNextStep(nextStep)
                                    break
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE:
                                    this.userTraining.isWaitingOnFeedback = true
                                    this.trainingTag.doNextStep(nextStep)
                                    break
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER:
                                    this.userTraining.isWaitingOnFeedback = true
                                    this.trainingTag.doNextStep(nextStep)
                                    break
                                default:
                                    this.MetaMap.log(`on buffer passed ${nextStep.action}`)
                                    nextStep.originalAction = nextStep.action
                                    nextStep.action = CONSTANTS.CORTEX.RESPONSE_TYPE.MORE
                                    this.moveToNextMessage(nextStep, { line: `<span>I don't supprt this <code>${nextStep.originalAction}</code> action yet, so I'm moving you to the next line.` }, 0)
                                    break
                                }
                        })
                    })
                } else {
                    this.currentMessage.archived = true
                    this.saveUserTraining()
                }
            }
        })
    }

    processUserResponse(obj, originalMessage) {
        if(obj) {
            let response = {
                time: `${new Date() }`
            }
            _.extend(obj, response)
            originalMessage = originalMessage || this.currentMessage

            if (obj.action) {
                if (obj.archived == true) {
                    this.moveToNextMessage(obj)
                } else {
                    switch (obj.action) {
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.OK:
                            obj.message = 'OK'
                            originalMessage.archived = true
                            this.moveToNextMessage(obj)
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.MORE:
                            originalMessage.archived = true
                            this.moveToNextMessage(obj)
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS:
                            this.userTraining.isWaitingOnFeedback = true
                            this.trainingTag.doNextStep(obj)
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_CONTINUOUS:
                            this.userTraining.isWaitingOnFeedback = false
                            this.trainingTag.doNextStep(obj)
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_FINISH:
                            let line = ''
                            if (originalMessage.action != CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_CONTINUOUS) {
                                this.userTraining.isWaitingOnFeedback = false
                                line = 'Great work in the canvas!'
                            }
                            originalMessage.archived = true
                            this.moveToNextMessage(obj, { line: line })
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_SAVE:
                            if (obj.data.map) {
                                originalMessage.map = obj.data.map
                                let line = `<span>Great news, you saved this map! It now appears in <a href="#!mymaps" style="color: #cb5a5e !important"><b>your list of maps</b></a> and you can access it again later here <a href="#!map/${obj.data.mapId}" style="color: #cb5a5e !important"><b>${obj.data.title}</b></a> Your map will now automatically save as you make changes, so I've hidden the Save button! Now that your map is saved, you can Share it!</span>`
                                this.moveToNextMessage(obj, { line: line })
                            }
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_SHARE:
                            if (obj.data.shared_with) {
                                this.moveToNextMessage(obj, { line: 'Great news, you shared this map with some of your friends!' })
                            }
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE:
                            this.userTraining.isWaitingOnFeedback = true
                            this.trainingTag.doNextStep(obj)
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER:
                            this.userTraining.isWaitingOnFeedback = true
                            this.trainingTag.doNextStep(obj)
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER_FINISH:
                            this.userTraining.isWaitingOnFeedback = false
                            this.moveToNextMessage(obj)
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE_ANSWER:
                            if (obj.data) {
                                obj.message = obj.data.message
                                this.moveToNextMessage(obj, { line: obj.data.feedback })
                            }
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE_FINISH:
                            this.userTraining.isWaitingOnFeedback = false
                            let feedback = `Great job. You got ${obj.data.score} out of ${obj.data.questionCount} correct!`
                            this.moveToNextMessage(obj, { line: feedback })
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                            _.each(obj.data, (val, key) => {
                                obj[key] = val
                                delete obj.data[key]
                            })
                            if (obj.request_feedback == true || obj.request_feedback == false) {
                                originalMessage.archived = true
                                if (obj.request_feedback) {
                                    this.userTraining.isWaitingOnFeedback = true
                                    this.moveToNextMessage(obj, { line: 'I\'m sorry to hear that! How can we improve it for the next version of this training?' })
                                } else {
                                    this.userTraining.isWaitingOnFeedback = false
                                    this.moveToNextMessage(obj, { line: 'Thanks for the feedback!' })
                                }
                            } else {
                                this.trainingTag.doNextStep(obj)
                            }
                            break
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:
                            let button = 'Play'
                            if (obj.data && obj.data.buttonName) {
                                button = obj.data.buttonName
                            }
                            switch (button) {
                                case 'Finished':
                                    this.trainingTag.stopVideo(originalMessage)
                                    if (originalMessage.action == CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO && !originalMessage.archived) {
                                        originalMessage.archived = true
                                        this.moveToNextMessage(obj)
                                    } else {
                                        this.trainingTag.doNextStep(originalMessage)
                                    }
                                    break
                                case 'Play':
                                    this.trainingTag.playVideo(obj)
                                    break
                            }
                            break
                        default:
                            this.MetaMap.log(`on action passed ${obj.action}`)
                            originalMessage.archived = true
                            this.moveToNextMessage(obj, { line: `<span>I don't supprt this <code>${obj.action}</code> action yet, so I'm moving you to the next line.` })
                            break
                    }
                }
            } else if(obj.message) {
                if (obj.message.startsWith('/')) {
                    switch (this.massageConstant(obj.message)) {
                        case 'help':
                            this.sendMessage({
                                author: 'cortex',
                                time: `${new Date() }`,
                                message: `<span>Help? You got it. Here are some of the things I can do for you:
                                            <ul>
                                                <li><code>/help</code> - Return help</li>
                                                <li><code>/next</code> - Skip this step and move onto the next</li>
                                                <li><code>/restart</code> - Restart this course from the beginning. Warning: this will delete your progress!</li>
                                            </ul>
                                        </span>`
                            })
                            break
                        case 'next':
                            obj.message = ''
                            this.userTraining.isWaitingOnFeedback = false
                            this.moveToNextMessage(obj, { line: 'OK... I\'ll let you skip this step.' })
                            break
                        case 'restart':
                            if (confirm('Are you sure? All of your progress will be lost!')) {
                                this.restart()
                            }
                            break
                        default:
                            this.processFeedback({
                                line: `<span>I didn't understand that command <code>${obj.message}</code>, try <code>/help</code></span>`
                            }, 0)
                            break
                    }
                } else {
                    if (this.userTraining.isWaitingOnFeedback) {
                        this.userTraining.isWaitingOnFeedback = false
                        this.moveToNextMessage(obj, { line: 'Thanks for the feedback! We\'ll use this to improve the next training!' })
                    }
                }
            }

            this.trainingTag.doBeforeNextStep(originalMessage)
            this.runCallbacks()
            this.MetaMap.Integrations.sendEvent(obj.message, 'cortex', 'chat')
        }
    }

    getData(callback = _.noop) {
        if (true !== this._isDestroyed) {
            this.addToCallbacks(callback)
            this.trainingTag.doBeforeNextStep(this.currentMessage)

            if (this.dataReady) {
                this.runCallbacks()
                this.trainingTag.doNextStep(this.currentMessage)
            }

            this.dataReady = this.dataReady || new Promise((resolve, reject) => {

                this.isTimerOn = true
                var once = _.once(() => {
                    this.MetaMap.MetaFire.getData(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`).then((data) => {
                        this.userTraining = data
                        if (!data) {
                            this.userTraining = this.training
                            this.runCallbacks()
                        }
                        let prms = Promise.resolve()
                        if (!this.userTraining.messages) {
                            prms = this.sendMessage(this.getNextMessage())
                        }

                        prms.then(() => {
                            //Order of operations
                            //1: Save the training so the user sees the messages
                            this.isTimerOn = false
                            this.runCallbacks()

                            //2: Cache the current message
                            this.currentMessageKey = _.findLastIndex(this.userTraining.messages, (m) => { return m.person == 'Cortex' })

                            if (this.currentMessageKey >= 0) {
                                this.currentMessage = this.userTraining.messages[this.currentMessageKey]

                                //3: Action
                                if (this.currentMessage.action &&
                                    this.currentMessage.action != CONSTANTS.CORTEX.RESPONSE_TYPE.OK &&
                                    this.currentMessage.action != CONSTANTS.CORTEX.RESPONSE_TYPE.MORE) {
                                    this.processUserResponse(this.currentMessage)
                                } else {
                                    this.trainingTag.doNextStep(this.currentMessage)
                                }
                            } else {
                                this.trainingTag.doNextStep({ action: CONSTANTS.CORTEX.RESPONSE_TYPE.MORE })
                            }
                            resolve()
                            window.NProgress.done()
                        })
                    })
                })

                this.MetaMap.MetaFire.getData(`${CONSTANTS.ROUTES.COURSE_LIST}${this.trainingId}`).then((data) => {
                    this.training = data
                    this.MetaMap.Eventer.do(CONSTANTS.EVENTS.PAGE_NAME, data)
                    once()
                    once = _.noop
                })

            })
        }
        return this.dataReady
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
                if (next.section_no) {
                    _.each(state.userTraining.outline, (item) => {
                        if (item.section_no == next.section_no) {
                            item.archived=true
                        }
                    })
                }
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