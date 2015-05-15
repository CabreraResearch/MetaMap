var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');

class MetaMap {

    constructor () {
        this.MetaFire = new MetaFire();
        this.Auth0 = new Auth0();
        usersnap();
    }

    init() {
        this.Auth0.login().then((profile) => {
            riot.mount('*');
            _.delay(function () {
                Metronic.init(); // init metronic core componets
                Layout.init(); // init layout
                Demo.init(); // init demo features
                Index.init(); // init index page
                Tasks.initDashboardWidget(); // init tash dashboard widget
            }, 250);
            this.MetaFire.init();
        });
    }

    logout() {
        this.MetaFire.logout();
        this.Auth0.logout();
    }
}

module.exports = MetaMap;