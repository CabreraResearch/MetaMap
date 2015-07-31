const Auth0 = require('./js/app/auth0');
const User = require('./js/app/user.js');
const Router = require('./js/app/Router.js');
const Eventer = require('./js/app/Eventer.js');
const PageFactory = require('./js/pages/PageFactory.js');
const NProgress = window.NProgress;

class MetaMap {

    constructor() {
        this.config = FrontEnd.config;
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
                    this.User = new User(profile, auth, this.Eventer, this.MetaFire);
                    this.User.onReady().then(() => {
                        this.PageFactory = new PageFactory(this.Eventer, this.MetaFire);
                        this.Router = new Router(this);
                    });
                });
            });
        });
    }

    logout() {
        this.MetaFire.logout();
        this.Auth0.logout();
    }
}

module.exports = MetaMap;