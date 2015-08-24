const IntegrationsBase = require('./_IntegrationsBase')
const Google = require('./google');

class Facebook extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        } (document, 'script', 'facebook-jssdk'));
        this.FB = window.FB;
    }
    
    init() {
        super.init();
        this.integration.init({
            appId: this.config.appid,
            xfbml: this.config.xfbml,
            version: this.config.version
        });

        this.integration.Event.subscribe('edge.create', function (targetUrl) {
            Google.sendSocial('facebook', targetUrl);
        });

        this.integration.Event.subscribe('edge.remove', function (targetUrl) {
            Google.sendSocial('facebook', targetUrl);
        });

        this.integration.Event.subscribe('message.send', function (targetUrl) {
            Google.sendSocial('facebook', targetUrl);
        });
    }
    
    get integration() {
        this.FB = this.FB || window.FB;
        return this.FB;
    }
    
}

module.exports = Facebook;


