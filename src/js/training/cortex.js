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

    restart() {
        this.messages = []
        this.userTraining = { messages: [] }
        this.currentMessage = 0
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

    processUserResponse(obj) {
        if(obj) {
            let response = {
                time: `${new Date() }`
            }
            _.extend(obj, response)
            this.userTraining.messages.push(obj)

            switch(obj.message.toLowerCase().trim()) {
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
                    //TODO: add validation logic here
                    let currentStep = this.training.course[this.currentMessage]
                    if (obj.message == currentStep.Line) {

                    }
                    let nextStep = this.getNextMessage()
                    this.userTraining.messages.push({
                        author: 'cortex',
                        time: `${new Date() }`,
                        message: nextStep.message.message
                    })
                    this.saveUserTraining()
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
                        this.userTraining.messages = [this.getDefaultMessage(this.training.name)]
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
                ret = {
                    message: courseMsg.Line,
                    author: 'cortex',
                    time: `${new Date() }`
                }
                this.userTraining.course[courseMsg.id].archived = true
            }
        }
        return ret;
    }


    getMessages() {
        this._messages = this._messages || _.filter(_.map(this.userTraining.course, (m, idx)=>{ m.id = idx; return m }), (msg) => { return msg.Line && msg.Line.length > 0 && true != msg.archived })
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
             state.currentMessage = idx
             let messages = state.getMessages()
             while (idx < messages.length) {
                let now = idx
                idx += 1
                state.currentMessage = now
                let next = { idx: now, message: state._massageTrainingMessage(now) }
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