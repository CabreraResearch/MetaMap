let Firebase = window.Firebase; //require('firebase');
let Promise = window.Promise;
let localforage = window.localforage;

class MetaFire {

    constructor (config) {
        this.config = config;
        this.fb = new Firebase(`https://${this.config.site.db}.firebaseio.com`);
    }

    login() {
        if (!this._login) {
            this._login = new Promise((fulfill, reject) => {
                localforage.getItem('id_token').then((id_token) => {
                    window.MetaMap.Auth0.getSession().then((profile) => {

                        window.MetaMap.Auth0.lock.getClient().getDelegationToken({
                            target: profile.clientID,
                            id_token: id_token,
                            api_type: 'firebase'
                        }, (err, delegationResult) => {
                            this.firebase_token = delegationResult.id_token;
                            localforage.setItem('firebase_token', this.firebase_token);
                            this.fb.authWithCustomToken(this.firebase_token, (error, authData) => {
                                if (error) {
                                    window.FrontEnd.error(error);
                                    reject(error);
                                } else {
                                    fulfill(authData);
                                }
                            });
                        });
                    });
                });
            });
            this._onReady = this._login;
        }
        return this._login;
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                fulfill();
            });
        }
        return this._onReady;
    }

    getChild(path) {
        return this.fb.child(path);
    }

    getData (path) {
        return this.onReady().then(() => {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            return new Promise((resolve, reject) => {

                child.orderByChild('order').on('value',
                (snapshot) => {
                    let data = snapshot.val();
                    try {
                        resolve(data);
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
                },
                (error) => {
                    window.FrontEnd.error({ message: `Cannot access ${path}` });
                    reject(error);
                });
            });
        });
    }

    on (path, callback, event = 'value' ) {
        if (path) {
            this.onReady().then(() => {
                let child = this.getChild(path);
                child.orderByChild('order').on(event, (snapshot) => {
                    let data = snapshot.val();
                    try {
                        callback(data);
                    } catch (e) {
                        window.FrontEnd.error(e);
                    }
                });
            });
        }
    }

    setData (data, path) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        return child.set(data);
    }

    logout () {
        this.fb.unauth();
    }
}
module.exports = MetaFire;