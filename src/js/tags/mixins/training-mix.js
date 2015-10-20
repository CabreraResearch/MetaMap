const CONSTANTS = require('../../constants/constants')
const NProgress = window.NProgress
const moment = require('moment')

const Cortex = require('../../training/cortex')

let TrainingMix = {
    init: function() {
        this.MetaMap = require('../../../MetaMap.js')
    },

    cortex: new Cortex(),
    userTraining: { messages: [] },
    training: {},

    getDate: function (date) {
        return moment(new Date(date)).format('YYYY-MM-DD')
    },

    saveUserTraining: function(id) {
        this.MetaMap.MetaFire.setData(this.userTraining, `${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId)}${id}`)
    },

    saveTraining: function (id, data) {
        this.MetaMap.MetaFire.updateData({
            course: data,
            updated_date: `${new Date()}`,
            updated_by: {
                user_id: this.MetaMap.User.userId,
                name: this.MetaMap.User.displayName,
                picture: this.MetaMap.User.picture
            }
        }, `${CONSTANTS.ROUTES.COURSE_LIST}${id}`)
    },

    getData: function(id) {
        if (id) {
            let that = this
            this._onceGetData = this._onceGetData || _.once(function () {

                var once = _.once(() => {
                    that.MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.TRAININGS.format(that.MetaMap.User.userId) }${id}`, (data) => {
                        that.userTraining = data
                        if (!data) {
                            that.userTraining = that.training
                            that.saveUserTraining(id)
                        }
                        if (!that.userTraining.messages) {
                            that.userTraining.messages = [that.getDefaultMessage(that.training.name)];
                            that.saveUserTraining(id)
                        }
                        that.cortex.update(that.userTraining)
                        that.update();
                        NProgress.done();
                    });
                    that.MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_OPEN, id);
                });

                that.MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.COURSE_LIST}${id}`, (data) => {
                    that.training = data;
                    that.MetaMap.Eventer.do(CONSTANTS.EVENTS.PAGE_NAME, data);

                    that.update();
                    once()
                });
            });
            this._onceGetData()
        }
    },

    messages: [],

    cortexPicture: 'src/images/cortex-avatar-small.jpg',

    getDefaultMessage: function (name) {
        return {
            message: `Hello, I'm Cortex Man. I will be your guide through ${name}`,
            author: 'cortex',
            time: `${new Date()}`
        }
    },




}

module.exports = TrainingMix