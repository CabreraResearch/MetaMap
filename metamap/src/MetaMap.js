require('babel/polyfill');
require('core-js');
window.$ = window.jQuery = require('jquery');
require('jquery-ui');
require('bootstrap');
window.riot = require('riot');
window._ = require('lodash');
window.Promise = require('bluebird');

const Auth0 = require('./js/app/auth0');
const User = require('./js/app/user.js');
const Router = require('./js/app/Router.js');
const Eventer = require('./js/app/Eventer.js');
const PageFactory = require('./js/pages/PageFactory.js');
const NProgress = window.NProgress;
const Config = require('./js/app//Config.js');
const ga = require('./js/integrations/google.js');
const shims = require('./js/tools/shims.js');

class MetaMap {

    constructor() {
        this._config = new Config();
        this.config = this._config.config;
        this.MetaFire = this._config.MetaFire;
        this.Eventer = new Eventer(this);
        
        this.onReady();
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                this._config.onReady().then((config) => {
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
                        this.Router.init();
                    });
                });
            });
        });
    }
    
    log(val) {
        if (window.ga) {
            window.ga('send', 'event', 'log', 'label', val);
        }
        console.log(val);
    }

    error(val) {
        if (window.ga) {
            window.ga('send', 'exception', {
                'exDescription': val.message,
                'exFatal': true
            });
        }
        console.error(val);
    }

    logout() {
        this.MetaFire.logout();
        this.Auth0.logout();
    }
}

const mm = new MetaMap();
module.exports = mm;