require('babel-polyfill')
require('core-js')
//Expose jQuery so that CDN scripts will work
window.$ = window.jQuery = require('jquery')
require('jquery-ui')
require('bootstrap')

const riot = require('riot')
const _ = require('lodash')
const Promise = require('bluebird')
const Auth0 = require('./js/app/auth0')
const User = require('./js/app/user.js')
const Router = require('./js/app/Router.js')
const Eventer = require('./js/app/Eventer.js')
const PageFactory = require('./js/pages/PageFactory.js')
const Config = require('./js/app//Config.js')
const shims = require('./js/tools/shims.js')
const Integrations = require('./js/app/Integrations')
const Cortex = require('./js/training/cortex')

class MetaMap {

    constructor() {
        const that = this
        Promise.config({
            // Enable warnings.
            warnings: false,
            // Enable long stack traces.
            longStackTraces: false,
            // Enable cancellation.
            cancellation: false
        })
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
        this.Config = new Config()
        this.config = this.Config.config
        this.MetaFire = this.Config.MetaFire
        this.Eventer = new Eventer(this)
        this._trainings = {}
        this.onReady()

        this.onReady().then(() => {

            if (this._doCustomLogin) {
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

    getCortex(trainingId, trainingTag) {
        if (!trainingId || !trainingTag) {
            throw new Error('Both Training ID and Tag are required')
        }
        if (this._lastCortex) {
            this._lastCortex.destroy()
        }
        this._lastCortex = new Cortex(trainingId, trainingTag)
        return this._lastCortex
    }

    get debug() {
        return window.location.host.startsWith('localhost')
    }

    log(val) {
        if (!this.debug && this.Integrations) {
            this.Integrations.sendEvent(val, 'event', 'log', 'label')
        }
        window.console.info(val)
    }

    error(val) {
        window.console.error(val)
        if (!this.debug && this.Integrations) {
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