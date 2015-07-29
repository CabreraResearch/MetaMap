var Auth0 = require('./js/app/auth0');
var User = require('./js/app/user.js');
var Router = require('./js/app/Router.js');
var Eventer = require('./js/app/Eventer.js');

class MetaMap {

    constructor() {
        this.MetaFire = FrontEnd.MetaFire;
        this.Eventer = new Eventer(this);
        
        this.onReady();
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
                this.MetaFire.login().then((auth) => {
                    this.User = new User(profile, auth);
                });
                
                riot.mount('*');
                NProgress.configure({ parent: '#meta_progress' });
                
                this.Router = new Router(this);

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