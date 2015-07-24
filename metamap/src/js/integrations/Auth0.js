let Auth0Lock = require('auth0-lock');

class Auth0 {

    constructor() {
        this.lock = new Auth0Lock('wsOnart23yViIShqT4wfJ18w2vt2cl32', 'metamap.auth0.com');
        this.lock.on('loading ready', (...e) => {
            
        });
    }

    login() {
        let that = this;
        
        let promise = new Promise((fulfill, reject) => {
            that.getSession().then((profile) => {
                if (profile) {
                    fulfill(profile);
                } else {
                    that.lock.show({
                        closable: false,
                        loginAfterSignup: true,
                        authParams: {
                            scope: 'openid offline_access'
                        }
                    }, (err, profile, id_token, ctoken, opt, refresh_token) => {
                        if (err) {
                            reject(err);
                        } else {
                            localforage.setItem('id_token', id_token);
                            localforage.setItem('profile', profile);

                            that.ctoken = ctoken;
                            that.id_token = id_token;
                            that.profile = profile;
                            that.refresh_token = refresh_token;
                            fulfill(profile);
                        }
                    });
                }
            });
        });
        return promise;
    }

    linkAccount() {
        let that = this;
        this.lock.show({
            callbackURL: 'https://popping-fire-897.firebaseapp.com/',
            dict: {
                signin: {
                    title: 'Link with another account'
                }
            },
            authParams: {
                access_token: that.ctoken
            }
        });
    }

    getSession() {
        let that = this;
        let getProfile = (id_token, fulfill, reject) => {
            return that.lock.getProfile(id_token, function(err, profile) {
                if (err) {
                    reject(err);
                } else {
                    localforage.setItem('id_token', id_token);
                    localforage.setItem('profile', profile);
                    that.id_token = id_token;
                    that.profile = profile;
                    fulfill(profile, id_token);
                }
            });
        }
        let promise = new Promise((fulfill, reject) => {
            let fulfilled = false;
            
            localforage.getItem('id_token').then((id_token) => {
                if (id_token) {
                    getProfile(id_token, fulfill, reject);
                } else {
                    fulfill(null);
                }
            });
                
            
        });
        return promise;
    }
    logout() {
        localforage.removeItem('id_token');
        localforage.removeItem('profile');
        this.profile = null;
        window.location.reload();
    }
}
module.exports = Auth0;


