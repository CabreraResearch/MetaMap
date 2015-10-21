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
    }

    get picture() { return 'src/images/cortex-avatar-small.jpg' }

    getOutline() {
        return _.filter(this.training.course, (item) => {
            return item.Section && item.Section.length > 0
        })
    }

    saveUserResponse(obj) {
        let response = {
            time: `${new Date() }`
        }
        _.extend(response, obj)
        this.userTraining.push(response)
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

    getData(callback) {
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

}

module.exports = CortexMan