var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');
var User = require('./js/app/user.js');
var Editor = require('./js/canvas/editor.js');

class MetaMap {

    constructor() {
        this.MetaFire = FrontEnd.MetaFire;
        this.onReady();
        usersnap();
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                FrontEnd.onReady().then((config) => {
                    this.Auth0 = new Auth0(config.auth0);
                    fulfill();
                }).catch((err) => {
                    reject(err);
                });
            });
        }
        return this._onReady;
    }

    init() {
        this.onReady().then(() => {
            this.Auth0.login().then((profile) => {
                this.User = new User(profile);

                this.MetaFire.login();
                window.FrontEnd.init();
                _.delay(() => {
                    Metronic.init(); // init metronic core componets
                    Layout.init(); // init layout
                    Demo.init(); // init demo features
                    Index.init(); // init index page
                    Tasks.initDashboardWidget(); // init tash dashboard widget


                }, 250);
            });
        });
    }

    logout() {
        this.MetaFire.logout();
        this.Auth0.logout();
    }
}

module.exports = MetaMap;