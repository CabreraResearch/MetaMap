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
const AirbrakeClient = require('airbrake-js')
const Integrations = require('./js/app/Integrations')

class MetaMap {

    constructor() {
        this.Config = new Config();
        this.config = this.Config.config;
        this.MetaFire = this.Config.MetaFire;
        this.Eventer = new Eventer(this);
        this.airbrake = new AirbrakeClient({ projectId: 114900, projectKey: 'dc9611db6f77120ccecd1a273745a5ae' });
        this.onReady();
        const that = this;
        Promise.onPossiblyUnhandledRejection(function (error) {
            that.error(error);
            return this;
        });
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                this.Config.onReady().then((config) => {
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
                    this.Integrations = new Integrations(this, this.User);
                    this.User.onReady().then((user) => {
                        this.PageFactory = new PageFactory(this.Eventer, this.MetaFire);
                        this.Router = new Router(this);
                        this.Router.init();
                        this.Integrations.init();
                    });
                });
            });
        });
    }

    log(val) {
        this.Integrations.sendEvent(val, 'event', 'log', 'label')
        window.console.info(val);
    }

    error(val) {
        window.console.error(val);
        this.Integrations.sendEvent(val, 'exception')
        this.airbrake.notify(val);
    }

    logout() {
        this.MetaFire.logout();
        this.Auth0.logout();
    }
}

const mm = new MetaMap();
module.exports = mm;