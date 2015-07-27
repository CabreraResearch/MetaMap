let Auth0Lock = require('auth0-lock');

class Auth0 {

    constructor(config) {
        this.config = config;
        this.lock = new Auth0Lock(config.api, config.app);
        this.lock.on('loading ready', (...e) => {
            
        });
    }

    login() {
        if (!this._login) {
            this._login = new Promise((fulfill, reject) => {
                this.getSession().then((profile) => {
                    if (profile) {
                        fulfill(profile);
                    } else {
                        this.lock.show({
                            closable: false,
                            loginAfterSignup: true,
                            authParams: {
                                scope: 'openid offline_access'
                            }
                        }, (err, profile, id_token, ctoken, opt, refresh_token) => {
                            if (err) {
                                this.logout();
                                reject(err);
                            } else {
                                localforage.setItem('id_token', id_token);
                                localforage.setItem('profile', profile);

                                this.ctoken = ctoken;
                                this.id_token = id_token;
                                this.profile = profile;
                                this.refresh_token = refresh_token;
                                fulfill(profile);
                            }
                        });
                    }
                });
            });
        }
        return this._login;
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
        });
    }

    getSession() {
        if (!this._getSession) {
            this._getSession = new Promise((fulfill, reject) => {
                localforage.getItem('id_token').then((id_token) => {
                    if (id_token) {
                        return this.lock.getProfile(id_token, (err, profile) => {
                            if (err) {
                                this.logout();
                                reject(err);
                            } else {
                                localforage.setItem('id_token', id_token);
                                localforage.setItem('profile', profile);
                                this.id_token = id_token;
                                this.profile = profile;
                                fulfill(profile, id_token);
                            }
                        });
                    } else {
                        fulfill(null);
                    }
                });
            });
        }
        return this._getSession;
    }
    logout() {
        localforage.removeItem('id_token');
        localforage.removeItem('profile');
        this.profile = null;
        window.location.reload();
    }
}
module.exports = Auth0;


