const CONSTANTS = require('../../constants/constants')
const NProgress = window.NProgress

let TrainingMix = {
    init: function() {
        this.MetaMap = require('../../../MetaMap.js')
    },

    userTraining: { messages: [] },
    training: {},

    saveUserTraining: function(id) {
        this.MetaMap.MetaFire.setData(this.userTraining, `${CONSTANTS.ROUTES.TRAININGS.format(this.MetaMap.User.userId)}${id}`)
    },

    saveTraining: function (id, data) {
        this.MetaMap.MetaFire.setData(data, `${CONSTANTS.ROUTES.COURSE_LIST}${id}/course`)
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
                            that.userTraining.messages = [that.getDefaultMessage()];
                            that.saveUserTraining(id)
                        }
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

    getDefaultMessage: function () {
        return {
            message: `Hello, I'm Cortex Man. Ask me anything. Try <code>/help</code> if you get lost.`,
            author: 'cortex',
            time: new Date()
        }
    },




}

module.exports = TrainingMix