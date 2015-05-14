class Auth0 {

    constructor() {
        this.lock = new Auth0Lock('wsOnart23yViIShqT4wfJ18w2vt2cl32', 'metamap.auth0.com');
    }

    login() {
        let that = this;
        
        let promise = new Promise((fulfill, reject) => {
            that.getSession().then((profile) => {
                if (profile) {
                    fulfill(profile);
                } else {
                    that.lock.show({
                        authParams: {
                            scope: 'openid offline_access'
                        }
                    }, (err, profile, id_token, ctoken, opt, refresh_token) => {
                        if (err) {
                            reject(err);
                        } else {
                            localforage.setItem('id_token', id_token);
                            localforage.setItem('profile', profile);
                            localforage.setItem('refresh_token', refresh_token);
                            that.profile = profile;
                            fulfill(profile);
                        }
                    });
                }
            });
        });
        return promise;
    }

    getSession() {
        let that = this;
        let getProfile = (id_token, fulfill, reject) => {
            return that.lock.getProfile(id_token, function(err, profile) {
                if (err) {
                    reject(err);
                } else {
                    fulfill(profile);
                }
            });
        }
        let promise = new Promise((fulfill, reject) => {
            let fulfilled = false;
            localforage.getItem('refresh_token').then((token) => {
                if (token) {
                    that.lock.getClient().refreshToken(token, (a, tokObj) => {
                        getProfile(tokObj.id_token, fulfill, reject);
                    }, (error) => {
                        reject(error);
                    });
                } else {
                    localforage.getItem('id_token').then((id_token) => {
                        if (token) {
                            getProfile(id_token, fulfill, reject);
                        } else {
                            fulfill(null);
                        }
                    });
                }
            });
        });
        return promise;
    }
    logout() {
        localforage.removeItem('id_token');
        localforage.removeItem('refresh_token');
        this.lock.logout();
    }
}
module.exports = Auth0;


