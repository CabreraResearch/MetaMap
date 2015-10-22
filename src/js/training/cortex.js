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
    }

    restart() {
        this.messages = []
        this.userTraining = { messages: [] }
        this.currentMessageKey = 0
        this._messageGen = null
        this._messages = null
        this.MetaMap.MetaFire.deleteData(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`)
    }

    get picture() { return 'src/images/cortex-avatar-small.jpg' }

    getOutline() {
        return _.filter(this.training.course, (item) => {
            return item.Section && item.Section.length > 0
        })
    }

    massageConstant(action) {
        let ret = ''
        if(action && action.length > 0) {
            ret = action.trim().split(' ')[0].toLowerCase().trim()
        }
        return ret
    }

    processUserResponse(obj) {
        if(obj) {
            let response = {
                time: `${new Date() }`
            }
            _.extend(obj, response)

            const moveToNextMessage = () => {
                this.userTraining.messages.push(obj)

                //TODO: add validation logic here
                let currentStep = this.training.course[this.currentMessageKey]
                if (obj.message == currentStep.Line) {

                }
                let nextStep = this.getNextMessage()
                if(nextStep) {
                    this.userTraining.messages.push(nextStep)
                    switch(this.massageConstant(nextStep.Action)) {
                        case CONSTANTS.CORTEX.RESPONSE_TYPE.TIMER:
                            _.delay(()=>{
                                this.processUserResponse({
                                    action: CONSTANTS.CORTEX.RESPONSE_TYPE.TIMER
                                })
                            }, 5000)
                            break
                    }
                }
                this.saveUserTraining()
            }

            if(obj.action) {
                switch(this.massageConstant(obj.action)) {
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.OK:
                        obj.message = 'OK'
                        moveToNextMessage()
                        break;
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.TIMER:
                        moveToNextMessage()
                        break;
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
                        break;
                    case 'restart':
                        if(confirm('Are you sure? All of your progress will be lost!')) {
                            this.restart()
                        }
                        break;

                    default:
                        moveToNextMessage()
                        break
                }
            }
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
                this.MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId) }${this.trainingId}`, (data) => {
                    this.userTraining = data
                    if (!data) {
                        this.userTraining = this.training
                    }
                    if (!this.userTraining.messages) {
                        this.userTraining.messages = [this.getNextMessage()]
                    } else {
                        let lastStep = this.userTraining.messages[this.userTraining.messages.length-1]
                        this.MetaMap.Eventer.do(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, lastStep)
                    }
                    this.saveUserTraining()
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

    _massageTrainingMessage(idx=0) {
        let ret = null
        if (this.userTraining) {
            let messages = this.getMessages()
            let courseMsg = messages[idx]
            if (courseMsg) {
                courseMsg.message = courseMsg.Line
                courseMsg.author = 'cortex'
                courseMsg.time = `${new Date() }`
                ret = courseMsg

                if (this.userTraining.messages) {
                    //guarantee that all previous messages are archived
                    let back = 1
                    let lastMessage = this.userTraining.messages[idx-back]
                    while(lastMessage && true != lastMessage.archived) {
                        lastMessage.archived=true
                        back += 1
                        lastMessage = this.userTraining.messages[idx-back]
                    }
                }
            }
        }
        return ret;
    }


    getMessages() {
        this._messages = this._messages || _.filter(_.map(this.userTraining.course, (m, idx)=>{ let n = _.extend({}, m); n.id = idx; return n }), (msg) => { return msg.Line && msg.Line.length > 0 && true != msg.archived })
        return this._messages
    }

    getDefaultMessage(name) {
        return this._massageTrainingMessage(0) || {
            message: `Hello, I'm Cortex Man. I will be your guide through ${name}`,
            author: 'cortex',
            time: `${new Date() }`
        }
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
        return this._messageGen.next().value
    }

}

module.exports = CortexMan