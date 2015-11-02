let Promise = require('bluebird')
let localforage = require('localforage')

class MetaFire {

    constructor(config) {
        this.config = config;
        this.fb = new window.Firebase(`https://${this.config.site.db}.firebaseio.com`);
    }

    get metaMap() {
        if (!this._metaMap) {
            this._metaMap = require('../../MetaMap.js');
        }
        return this._metaMap;
    }

    doCustomLogin(fbToken, userId) {
        return new Promise((resolve, reject) => {
            if (fbToken && userId) {
                this.fb.authWithCustomToken(fbToken, (error, authData) => {
                    if (error) {
                        reject()
                    } else {
                        this.fb.child(`users/${userId}`).once('value', (val) => {
                            let profile = val.val()
                            if (profile) {
                                localStorage['mm_fb_token'] = fbToken
                                localStorage['mm_user_id'] = userId
                                authData.uid = userId
                                resolve({ profile: profile, auth: authData })
                            } else {
                                reject()
                            }
                        })
                    }
                })
            } else {
                reject()
            }
        })
    }

    login() {
        if (!this._login) {
            this._login = new Promise((resolve, reject) => {
                this.metaMap.Auth0.getSession()
                    .then((profile) => {

                        if (profile.firebase && profile.profile) {
                            this.fb = profile.firebase
                            resolve(profile.authData)
                        } else {
                            this.metaMap.Auth0.lock.getClient().getDelegationToken({
                                target: this.config.site.auth0.api,
                                id_token: profile.id_token,
                                api_type: 'firebase'
                            }, (err, delegationResult) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    profile.firebase_token = delegationResult.id_token;
                                    this.firebase_token = delegationResult.id_token;
                                    localforage.setItem('firebase_token', this.firebase_token);
                                    this.fb.authWithCustomToken(this.firebase_token, (error, authData, ...params) => {
                                        if (error) {
                                            this.metaMap.error(error);
                                            reject(error);
                                        } else {
                                            resolve(authData);
                                        }
                                    });
                                }
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        debugger;
                    });
            });
            this._onReady = this._login;
        }
        return this._login;
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((resolve, reject) => {
                resolve();
            });
        }
        return this._onReady;
    }

    getChild(path) {
        return this.fb.child(path);
    }

    getData(path) {
        return this.onReady().then(() => {
            var child = this.fb;
            if (path) {
                child = this.getChild(path);
            }
            return new Promise((resolve, reject) => {

                child.once('value',
                    (snapshot) => {
                        let data = snapshot.val();
                        try {
                            resolve(data);
                        } catch (e) {
                            this.metaMap.error(e);
                        }
                    },
                    (error) => {
                        this.error(e, path);
                        reject(error);
                    });
            });
        });
    }

    on(path, callback, event = 'value') {
        if (path) {
            this.onReady().then(() => {
                let child = this.getChild(path);
                let method = (snapshot) => {
                    try {
                        // if (!snapshot.exists()) {
                        //     child.off(event, method);
                        //     throw new Error(`There is no data at ${path}`);
                        // }
                        let data = snapshot.val();
                        callback(data);
                    } catch (e) {
                        //child.off(event, method);
                        this.error(e, path);
                    }
                };
                child.on(event, method);
            });
        }
    }

    off(path, method = 'value', callback) {
        if (path) {
            this.onReady().then(() => {
                let child = this.getChild(path);
                if (callback) {
                    child.off(method, callback);
                } else {
                    child.off(method);
                }
            });
        }
    }

    setData(data, path) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        try {
            return child.set(data, (e) => {
                if (e) {
                    this.error(e, path);
                }
            });
        } catch (e) {
            this.error(e, path);
        }
    }

    updateData(data, path) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        try {
            return new Promise((resolve, reject) => {
                child.update(data, (e) => {
                    if (e) {
                        this.error(e, path);
                        reject(e)
                    } else {
                        resolve()
                    }
                })
            })
        } catch (e) {
            this.error(e, path);
        }
    }

    deleteData(path) {
        return this.setData(null, path);
    }

    pushData(data, path) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        try {
            return child.push(data, (e) => {
                if (e) {
                    this.error(e, path);
                }
            });
        } catch (e) {
            this.error(e, path);
        }
    }

    setDataInTransaction(data, path, callback) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        try {
            return child.transaction((currentValue) => {
                try {
                    return data;
                } catch (e) {
                    this.error(e, path);
                }
            });
        } catch (e) {
            this.error(e, path);
        }
    }

    error(e, path) {
        if (e) {
            this.metaMap.error(e);
        }
        if (path) {
            this.metaMap.error({ message: `Permission denied to ${path}` });
        }
    }

    logout() {
        this._login = null;
        this._onReady = null;
        localforage.removeItem('firebase_token');
        this.fb.unauth();
    }
}
module.exports = MetaFire;