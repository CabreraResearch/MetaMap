const IntegrationsBase = require('./_IntegrationsBase')

class Intercom extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);

        let i = function () {
            i.c(arguments)
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args)
        };
        window.Intercom = i;
        try {
            let s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = `https://widget.intercom.io/widget/${config.appid}}`;
            let x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        } catch (e) {

        }
        this.intercom = window.Intercom;
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
            name: this.user.fullName,
            email: this.user.email,
            created_at: this.user.createdOn.ticks,
            user_id: this.user.userId
        });
        this.sendEvent('update');
    }

    sendEvent(event = 'update') {
        super.sendEvent(event);
        this.integration('update');
    }

    updatePath(path) {
        this.integration('update');
    }
    
    logout() {
        super.logout();
        this.integration('shutdown');
    }

}

module.exports = Intercom;