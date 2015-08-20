const uuid = require('../tools/uuid.js');
const MetaMap = window.MetaMap;

class User {
    constructor(profile, auth, eventer, metaFire) {
        this.auth = auth;
        this.eventer = eventer;
        this.metaFire = metaFire;
        this.userKey = uuid();
        this.onReady();
    }

    onReady() {
        if (!this._onReady) {
            let trackHistory = _.once(() => {
                this.eventer.every('history', (page) => {
                    if (this.history.length == 0 || page != this.history[this.history.length - 1]) {
                        this.history.push(page);
                        this.metaFire.setData(this.history, `users/${this.auth.uid}/history`);
                    }
                });
            });
            this._onReady = new Promise((fulfill, reject) => {
                this.metaFire.on(`users/${this.auth.uid}`, (user) => {
                    if (user) {
                        if (!user.history) {
                            user.history = [];
                        }
                        this.profile = user;
                        trackHistory();
                        fulfill(user);
                    }
                });

                
            });
        }
        return this._onReady;
    }

    get displayName() {
        let ret = this.fullName;
        if (this.profile && this.profile.identity) {
            if (ret) {
                ret = ret.split(' ')[0];
            }
            if (!ret) {
                ret = this.profile.identity.nickname;
            }
        }

        return ret;
    }
    
    get fullName() {
        let ret = '';
        if (this.profile && this.profile.identity) {
            if (this.profile.identity.name) {
                ret = this.profile.identity.name;
            }
        }
        return ret;
    }

    get picture() {
        let ret = '';
        if (this.profile && this.profile.identity) {
            ret = this.profile.identity.picture;
        }
        return ret;
    }

    get userId() {
        return this.auth.uid;
    }

    get isAdmin() {
        let ret = false;
        if (this.profile && this.profile.identity) {
            ret = this.profile.identity.roles.indexOf('admin') !== -1;
        }
        return ret;
    }

    get history() {
        return this.profile.history || [];
    }
    saveUserEditorOptions(options) {
        let data = {
            user: {
                editor_options: JSON.stringify(options)
            }
        };
    }
}

module.exports = User;