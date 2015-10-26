require('babel/polyfill')
require('core-js')
window.$ = window.jQuery = require('jquery')
require('jquery-ui')
require('bootstrap')
window.riot = require('riot')
window._ = require('lodash')
window.Promise = require('bluebird')

const Auth0 = require('./js/app/auth0')
const User = require('./js/app/user.js')
const Router = require('./js/app/Router.js')
const Eventer = require('./js/app/Eventer.js')
const PageFactory = require('./js/pages/PageFactory.js')
const NProgress = window.NProgress
const Config = require('./js/app//Config.js')
const ga = require('./js/integrations/google.js')
const shims = require('./js/tools/shims.js')
const Integrations = require('./js/app/Integrations')
const Cortex = require('./js/training/cortex')

class MetaMap {

    constructor() {
        this.Config = new Config()
        this.config = this.Config.config
        this.MetaFire = this.Config.MetaFire
        this.Eventer = new Eventer(this)
        this._trainings = {}
        this.onReady()
        const that = this
        Promise.onPossiblyUnhandledRejection(function (error) {
            that.error(error)
            return this
        })
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                this.Config.onReady().then((config) => {
                    this.Auth0 = new Auth0(config.auth0)
                    fulfill()
                }).catch((err) => {
                    reject(err)
                })
            })
        }
        return this._onReady
    }

    get _doCustomLogin() {
        return this.debug && localStorage['mm_fb_token'] && localStorage['mm_user_id']
    }

    init() {
        this.onReady().then(() => {
            if(this._doCustomLogin) {
                this.doCustomLogin()
            } else {
                this.Auth0.login().then((profile) => {
                    this.MetaFire.login().then((auth) => {
                        this.User = new User(profile, auth, this.Eventer, this.MetaFire)
                        this.Integrations = new Integrations(this, this.User)
                        this.User.onReady().then((user) => {
                            this.PageFactory = new PageFactory(this.Eventer, this.MetaFire)
                            this.Router = new Router(this)
                            this.Router.init()
                            this.Integrations.init()
                        })
                    })
                })
            }
        })
    }

    doCustomLogin(fbToken, userId) {
        fbToken = fbToken || localStorage['mm_fb_token']
        userId = userId || localStorage['mm_user_id']
        this.Auth0.doCustomLogin(fbToken, userId).then(() => {
            this.MetaFire.doCustomLogin(fbToken, userId).then((data) => {
                if (data.auth && data.profile) {
                    this.User = new User(data.profile, data.auth, this.Eventer, this.MetaFire)
                    this.Integrations = new Integrations(this, this.User)
                    this.User.onReady().then((user) => {
                        this.PageFactory = new PageFactory(this.Eventer, this.MetaFire)
                        this.Router = new Router(this)
                        this.Router.init()
                        this.Integrations.init()
                    })
                }
            })
        })
    }

    getCortex(trainingId) {
        if (!trainingId) {
            throw new Error('Training ID is required')
        }
        this._trainings[trainingId] = this._trainings[trainingId] || new Cortex(trainingId)
        return this._trainings[trainingId]

    }

    get debug() {
        return window.location.host.startsWith('localhost')
    }

    log(val) {
        if (!this.debug) {
            this.Integrations.sendEvent(val, 'event', 'log', 'label')
        }
        window.console.info(val)
    }

    error(val) {
        window.console.error(val)
        if (!this.debug) {
            this.Integrations.sendError(val)
        }
    }

    logout() {
        this.MetaFire.logout()
        this.Auth0.logout()
    }
}

const mm = new MetaMap()
module.exports = mm