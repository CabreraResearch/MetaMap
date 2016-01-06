const MetaFire = require('./Firebase')
const _ = require('lodash')

class Config {

    constructor(tags) {
        this.tags = tags
        this.config = {
            host: window.location.host,
            db: 'https://homunculus.firebaseio.com',
            site: `homunculus.firebaseio.com`
        }
        this.MetaFire = new MetaFire(this.config)
    }

    get site() {
        return 'frontend'
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                this.MetaFire.on('config', (data) => {
                    _.extend(this.config, data)
                    this.init()
                    fulfill(this.config)
                })
            })
        }

        return this._onReady
    }

    init() {
        return this.onReady()
    }
}

module.exports = Config