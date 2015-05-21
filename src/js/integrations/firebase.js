let Firebase = require('firebase');

class MetaFire {

    constructor () {
        this.fb = new Firebase("https://popping-fire-897.firebaseio.com");
    }

    init() {
        let that = this;
        let ret = new Promise((fulfill, reject) => {
            localforage.getItem('id_token').then((id_token) => {
                MetaMap.Auth0.getSession().then((profile) => {

                    MetaMap.Auth0.lock.getClient().getDelegationToken({
                        target: profile.clientID,
                        id_token: id_token,
                        api_type: 'firebase'
                    }, (err, delegationResult) => {
                        that.firebase_token = delegationResult.id_token;
                        localforage.setItem('firebase_token', that.firebase_token);
                        this.fb.authWithCustomToken(that.firebase_token, (error, authData) => {
                            if (error) {
                                reject(error);
                            } else {
                                fulfill(authData);
                            }
                        }); 
                    });
                });
            });
        });
        return ret;
    }

    getChild(path) {
        return this.fb.child(path);
    }

    getData (path) {
        var child = this.fb;
        if (path) {
            child = this.getChild(path);
        }
        var promise = new Promise( (resolve, reject) => {
            child.on('value',
                (snapshot) => {
                    resolve(snapshot.val());
                },
                (error) => {
                    reject(error);
                });
        });
        
        return promise;
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


