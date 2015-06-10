var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');

class CRLab {

    constructor () {
        this.MetaFire = new MetaFire();
        this.Auth0 = new Auth0();
        usersnap();
    }

    get site() {
        return 'crlab';
    }

    init() {
        riot.mount('*');
    }

    login() {
        let self = this;
        this.Auth0.login().then((profile) => {
            
        });
    }

    logout() {
        this.MetaFire.logout();
        this.Auth0.logout();
    }
}

module.exports = CRLab;