const Auth0Lock = require('auth0-lock')
const localforage = require('localforage')
const _ = require('lodash')
const Promise = require('bluebird')

class Auth0 {

    constructor(config, metaMap) {
        this.config = config
        this.metaMap = require('../../MetaMap')
        this.lock = new Auth0Lock(config.api, config.app)
        this.lock.on('loading ready', (...e) => {

        })
    }

    login() {
        if (!this._login) {
            this._login = new Promise((fulfill, reject) => {
                let showLogin = () => {
                    this.lock.show({
                        closable: false,
                        loginAfterSignup: true,
                        authParams: {
                            scope: 'openid offline_access'
                        }
                    }, (err, profile, id_token, ctoken, opt, refresh_token) => {
                        if (err) {
                            this.onFail(err, reject)
                        } else {
                            this.ctoken = profile.ctoken = ctoken
                            localforage.setItem('ctoken', this.ctoken)

                            this.id_token = profile.id_token = id_token
                            localforage.setItem('id_token', this.id_token)

                            this.profile = profile
                            localforage.setItem('profile', this.profile)

                            this.refresh_token = profile.refresh_token = refresh_token
                            this._getSession = fulfill(profile)
                        }
                    })
                }
                this.getSession().then((profile) => {
                    if (profile) {
                        fulfill(profile)
                    } else {
                        showLogin()
                    }
                }).catch((err) => {
                    showLogin()
                })
            })
        }
        return this._login
    }

    linkAccount() {
        this.lock.show({
            callbackURL: location.href.replace(location.hash, ''),
            dict: {
                signin: {
                    title: 'Link with another account'
                }
            },
            authParams: {
                access_token: this.ctoken
            }
        })
    }

    onFail(err, reject) {
        this.metaMap.error(err)
        if (reject) {
            reject(err)
            this.logout()
        }
    }

    getSession() {
        if (this.profile) {
            this._getSession = new Promise((fulfill, reject) => {
                fulfill(this.profile)
            })
        }
        else if (!this._getSession) {
            this._getSession = new Promise((fulfill, reject) => {
                return localforage.getItem('id_token').then((id_token) => {
                    if (id_token) {
                        return this.lock.getProfile(id_token, (err, profile) => {
                            if (err) {
                                this.onFail(err, reject)
                            } else {
                                localforage.setItem('id_token', id_token)
                                localforage.setItem('profile', profile)
                                localforage.getItem('ctoken').then((token) => {
                                    this.ctoken = token
                                })
                                this.id_token = profile.id_token = id_token
                                this.profile = profile
                                return fulfill(profile)
                            }
                        })
                    } else {
                        return reject(new Error('No session'))
                    }
                })
            })
        }
        return this._getSession
    }

    logout() {
        localforage.removeItem('id_token').then(() => {
            return localforage.removeItem('profile')
        }).then(() => {
            this.profile = null
            this.ctoken = null
            this.id_token = null
            this.refresh_token = null
            this._login = null
            this._getSession = null
            this.metaMap.Router.to('home')
            window.location.reload()
        })
    }
}
module.exports = Auth0


