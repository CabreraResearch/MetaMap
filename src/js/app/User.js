const uuid = require('../tools/uuid.js')
const Common = require('../tools/Common')
const _ = require('lodash')

class User {
    constructor(profile, auth, eventer, metaFire) {
        this.auth = auth
        this.eventer = eventer
        this.metaFire = metaFire
        this.userKey = uuid()
        this.onReady()
        this.metaMap = require('../../MetaMap')
    }

    onReady() {
        if (!this._onReady) {
            let trackHistory = _.once(() => {
                this.eventer.every('history', (page) => {
                    if (this.history.length == 0 || page != this.history[this.history.length - 1]) {
                        this.history.push(page)
                        this.metaFire.setData(this.history, `users/${this.auth.uid}/history`)
                    }
                })
            })
            this._onReady = new Promise((fulfill, reject) => {
                this.metaFire.on(`users/${this.auth.uid}`, (user) => {
                    if (user) {
                        try {
                            if (!user.history) {
                                user.history = []
                            }
                            this.profile = user
                            trackHistory()
                        } catch (e) {
                            this.metaMap.error(e)
                        }
                        fulfill(user)
                    }
                })


            })
        }
        return this._onReady
    }

    get _identity() {
        let ret = {}
        if (this.profile && this.profile.identity) {
            ret = this.profile.identity
        }
        return ret
    }

    get createdOn() {
        if (null == this._createdOn) {
            if (this._identity.created_at) {
                let dt = new Date(this._identity.created_at)
                this._createdOn = {
                    date: dt,
                    ticks: Common.getTicksFromDate(dt)
                }
            }
        }
        return this._createdOn || { date: null, ticks: null }
    }

    get displayName() {
        let ret = this.fullName
        if (ret) {
            ret = ret.split(' ')[0]
        }
        if (!ret && this._identity.nickname) {
            ret = this._identity.nickname
        }

        return ret
    }

    get fullName() {
        let ret = ''
        if (this._identity.name) {
            ret = this._identity.name
        }
        return ret
    }

    get email() {
        let ret = ''
        if (this._identity.email) {
            ret = this._identity.email
        }
        return ret
    }

    get picture() {
        let ret = ''
        if (this._identity.picture) {
            ret = this._identity.picture
        }
        return ret
    }

    get userId() {
        return this.auth.uid
    }

    get isAdmin() {
        let ret = false
        if (this._identity.roles) {
            ret = this._identity.roles.admin == true
        }
        return ret
    }

    get history() {
        return this.profile.history || []
    }

    saveUserEditorOptions(options) {
        let data = {
            user: {
                editor_options: JSON.stringify(options)
            }
        }
    }
}

module.exports = User