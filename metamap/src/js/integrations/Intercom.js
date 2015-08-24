const IntegrationsBase = require('./_IntegrationsBase')

class Intercom extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);
        let intercomSettings = window.intercomSettings;
        let w = window;
        let ic = w.Intercom;
        if (typeof ic === "function") {
            ic('reattach_activator');
            ic('update', intercomSettings);
        } else {
            let d = document;
            let i = function () {
                i.c(arguments)
            };
            i.q = [];
            i.c = function (args) {
                i.q.push(args)
            };
            w.Intercom = i;
            function l() {
                let s = d.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = `https://widget.intercom.io/widget/${config.apiKey}}`;
                let x = d.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            }
            if (w.attachEvent) {
                w.attachEvent('onload', l);
            } else {
                w.addEventListener('load', l, false);
            }
        }
        this.intercom = w.Intercom;
    }

    get integration() {
        this.intercom = this.intercom || window.Intercom;
        return this.intercom;
    }

    init() {
        super.init();
    }

    setUser() {
        super.setUser();
        this.integration('boot', {
            app_id: this.config.appid,
            name: this.user.fullName, // TODO: The current logged in user's full name
            email: this.user.email, // TODO: The current logged in user's email address.
            created_at: this.user.createdOn.ticks // TODO: The current logged in user's sign-up date as a Unix timestamp.
        });
    }

}

module.exports = Intercom;