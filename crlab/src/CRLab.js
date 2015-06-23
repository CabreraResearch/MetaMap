let MetaFire = require('./js/integrations/firebase');
let Auth0 = require('./js/integrations/auth0');
let usersnap = require('./js/integrations/usersnap');
let riot = window.riot;

const config = () => {
    const SITES = {
        CRL: {
            frontEnd: 'crlab',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'Cabrera Research Lab',
            favico: 'crlab/dist/img/ico/favicon.ico'
        },
        THINK_WATER: {
            frontEnd: 'thinkwater',
            db: 'popping-fire-897',
            metaMapUrl: '',
            title: 'ThinkWater',
            favico: 'crlab/dist/img/ico/favicon.ico'
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
    case 'crlab':
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

class CRLab {

    constructor(tags) {
        this.tags = tags;
        this.config = config();

        document.title = this.config.site.title;
        let favico = document.getElementById('favico');
        favico.setAttribute('href', this.config.favico);

        this.MetaFire = new MetaFire(this.config);
        this.Auth0 = new Auth0(this.config);
        usersnap();
    }

    get site() {
        return this.config.site.frontEnd;
    }

    init() {
        //_.each(this.tags, (tag) => {
        //    riot.mount(tag, this);
        //});
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