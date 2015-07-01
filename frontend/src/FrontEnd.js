let MetaFire = require('./js/integrations/firebase');
let Auth0 = require('./js/integrations/auth0');
let usersnap = require('./js/integrations/usersnap');
let riot = window.riot;
let Router = require('./js/core/Router');
let ga = require('./js/integrations/google.js');
let twitter = require('./js/integrations/twitter.js');
let facebook = require('./js/integrations/facebook.js');

const imageUrl = '//c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/';

const config = () => {
    const SITES = {
        CRL: {
            frontEnd: 'crlab',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'Cabrera Research Lab',
            google: {
                analytics: 'UA-63193554-2',
                tagmanager: 'GTM-KZQ2C2'
            }
        },
        THINK_WATER: {
            frontEnd: 'thinkwater',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'ThinkWater',
            google: {
                analytics: 'UA-63193554-2',
                tagmanager: 'GTM-KZQ2C2'
            }
        }
    }

    const ret = {
        host: window.location.host,
        site: {}
    }
    let segments = ret.host.split('.');
    let first = segments[0];
    if (first === 'www') {
        first = segments[1];
    }
    switch (first.toLowerCase()) {
        case 'meta-map-staging':
        case 'frontend':
            ret.site = SITES['CRL'];
            break;
        case 'thinkwater-staging':
        case 'thinkwater':
            ret.site = SITES['THINK_WATER'];
            break;
        default:
            //For now, default to CRL
            ret.site = SITES['CRL'];
            break;
    }

    Object.freeze(ret);
    return ret;
};

class FrontEnd {

    constructor(tags) {
        this.tags = tags;
        this.config = config();

        document.title = this.config.site.title;
        let favico = document.getElementById('favico');
        favico.setAttribute('href', `${imageUrl}${this.config.site.frontEnd}/favicon.ico`);

        this.MetaFire = new MetaFire(this.config);
        this.Auth0 = new Auth0(this.config);

        ga(this.config.site.google);
        this.initTwitter = twitter();
        this.initFacebook = facebook();
        usersnap();
    }

    initSocial() {
        this.initTwitter();
        this.initFacebook();
    }

    get site() {
        return this.config.site.frontEnd;
    }

    init() {
        //_.each(this.tags, (tag) => {
        //    riot.mount(tag, this);
        //});
        riot.mount('*');
        this.Router = new Router();
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

module.exports = FrontEnd;