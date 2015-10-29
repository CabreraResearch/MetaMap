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
        this.runCallbacks()
        this._onceGetData = null
        this.isTimerOff = true
        this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, {})
        this.getData()
    }

    get picture() { return 'src/images/cortex-avatar-small.jpg' }

    getOutline() {
        let ret = [];
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
        return ret;
    }

    massageConstant(action) {
        let ret = ''
        if(action && action.length > 0) {
            ret = action.trim().split(' ')[0].toLowerCase().trim()
        }
        while (ret.startsWith('/')) {
            ret = ret.substr(1);
        }
        return ret
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
        this.isTimerOff = false
        //this.runCallbacks()
        return new Promise((resolve) => {
            _.delay(() => {
                this.isTimerOff = true
                this.runCallbacks()
                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_EVENT)
                resolve()
            }, time)
        })
    }

    processFeedback(obj) {
        this.buffer(750).then(()=>{
            this.MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_EVENT)
            this.userTraining.messages.push({
                    message: obj.line,
                    author: 'cortex',
                    time: `${new Date() }`,
                    action: CONSTANTS.CORTEX.RESPONSE_TYPE.FEEDBACK
            })
            this.saveUserTraining()
        })
    }

    processUserResponse(obj, originalMessage) {
        if(obj) {
            let response = {
                time: `${new Date() }`
            }
            _.extend(obj, response)
            originalMessage = originalMessage || this.currentMessage

            const moveToNextMessage = (feedback) => {
                this.userTraining.messages.push(obj)

                if (feedback) {
                    this.processFeedback(feedback)
                }
                if (true != this.userTraining.isWaitingOnFeedback) {
                    let nextStep = this.getNextMessage()
                    if (nextStep) {
                        let timer = (nextStep.action == CONSTANTS.CORTEX.RESPONSE_TYPE.MORE) ? 5000 : 750
                        this.buffer(timer).then(() => {
                            this.userTraining.messages.push(nextStep)
                            switch (nextStep.action) {
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:
                                    this.processUserResponse({
                                        action: CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO
                                    }, nextStep)
                                    break
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS:
                                    this.userTraining.isWaitingOnFeedback = true
                                    this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, nextStep)
                                    break;
                                case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                                    this.userTraining.isWaitingOnFeedback = true
                                    this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, nextStep)
                                    break;
                                default:
                                    this.MetaMap.log(`on buffer passed ${nextStep.action}`)
                                    this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, nextStep)
                                    break
                            }
                            this.saveUserTraining()
                        })

                    } else {
                        this.currentMessage.archived = true
                    }
                }
                this.saveUserTraining()
            }

            if (obj.action) {
                let msg = null
                switch(obj.action) {
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.OK:
                        obj.message = 'OK'
                        moveToNextMessage()
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.MORE:
                        moveToNextMessage()
                        this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, originalMessage)
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS:
                        this.userTraining.isWaitingOnFeedback = true
                        this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, originalMessage)
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_FINISH:
                        this.userTraining.isWaitingOnFeedback = false
                        moveToNextMessage({ line: 'Great work in the canvas!' })
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_SAVE:
                        if (obj.data.map) {
                            originalMessage.map = obj.data.map
                            moveToNextMessage({ line: `<span>Great news, you saved this map! It now appears in <a href="#!mymaps" style="color: #cb5a5e !important;"><b>your list of maps</b></a> and you can access it again later here <a href="#!maps/${obj.data.mapId}" style="color: #cb5a5e !important;"><b>${obj.data.title}</b></a> Your map will now automatically save as you make changes, so I've hidden the Save button! Now that your map is saved, you can Share it!</span>` })
                        }
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_SHARE:
                        if (obj.data.shared_with) {
                            moveToNextMessage({ line: 'Great news, you shared this map with some of your friends!' })
                        }
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                        _.each(obj.data, (val, key) => {
                            obj[key] = val
                            delete obj.data[key]
                        })
                        if (!this.userTraining.isWaitingOnFeedback || obj.request_feedback == true || obj.request_feedback == false) {
                            if (obj.request_feedback) {
                                this.userTraining.isWaitingOnFeedback = true
                                moveToNextMessage({ line: 'I\'m sorry to hear that! How can we make improve this for the next version of this training?' })
                            } else {
                                this.userTraining.isWaitingOnFeedback = false
                                moveToNextMessage({ line: 'Thanks for the feedback!' })
                            }
                        } else {
                            let msg = (obj.action_data) ? obj : originalMessage
                            this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, msg)
                        }
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:
                        let button = 'Play'
                        if (obj.data && obj.data.buttonName) {
                            button = obj.data.buttonName
                        }
                        switch (button) {
                            case 'Finished':
                                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.STOP_VIDEO, originalMessage)
                                if (!originalMessage.archived) {
                                    moveToNextMessage()
                                }
                                break
                            case 'Play':
                                this.MetaMap.Eventer.do(CONSTANTS.EVENTS.PLAY_VIDEO, originalMessage)
                                break
                        }
                        break
                    default:
                        this.MetaMap.log(`on action passed ${obj.action}`)
                        moveToNextMessage({ line: `<span>I don't supprt this <code>${obj.action}</code> action yet, so I'm moving you to the next line.` })
                        break
                }
            } else if(obj.message) {
                if (obj.message.startsWith('/')) {
                    switch (this.massageConstant(obj.message)) {
                        case 'help':
                            this.userTraining.messages.push({
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
                            moveToNextMessage({ line: 'OK... I\'ll let you skip this step.' })
                            break
                        case 'restart':
                            if (confirm('Are you sure? All of your progress will be lost!')) {
                                this.restart()
                            }
                            break
                        default:
                            this.userTraining.messages.push({
                                author: 'cortex',
                                time: `${new Date() }`,
                                message: `<span>I didn't understand that command <code>${obj.message}</code>, try <code>/help</code></span>`
                            })
                            break
                    }
                } else {
                    if (this.userTraining.isWaitingOnFeedback) {
                        this.userTraining.isWaitingOnFeedback = false
                        moveToNextMessage({ line: 'Thanks for the feedback! We\'ll use this to improve the next training!' })
                    }
                }
            }
            this.runCallbacks()
            this.MetaMap.Integrations.sendEvent(obj.message, 'cortex', 'chat')
        }
    }

    saveUserTraining() {
        this.MetaMap.MetaFire.updateData(this.userTraining, `${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`)
        this.runCallbacks()
        this.MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_EVENT)
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

            this.timerIsOff = true
            var once = _.once(() => {
                this.MetaMap.MetaFire.getData(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`).then((data) => {
                    this.userTraining = data
                    if (!data) {
                        this.userTraining = this.training
                        this.runCallbacks()
                    }
                    if (!this.userTraining.messages) {
                        this.userTraining.messages = [this.getNextMessage()]
                    }
                    this.currentMessageKey = _.findLastIndex(this.userTraining.messages, (m) => { return m.action && m.action != CONSTANTS.CORTEX.RESPONSE_TYPE.FEEDBACK && true != m.is_ignored })
                    this.currentMessage = this.userTraining.messages[this.currentMessageKey]
                    if (this.currentMessage.action &&
                        this.currentMessage.action != CONSTANTS.CORTEX.RESPONSE_TYPE.OK &&
                        this.currentMessage.action != CONSTANTS.CORTEX.RESPONSE_TYPE.MORE) {
                        this.processUserResponse(this.currentMessage)
                    } else {
                        this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, this.currentMessage)
                    }

                    this.saveUserTraining()
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
                if (next.section_no) {
                    _.each(state.userTraining.outline, (item) => {
                        if (item.section_no == next.section_no) {
                            item.archived=true
                        }
                    })
                }
                //state.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, next)
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