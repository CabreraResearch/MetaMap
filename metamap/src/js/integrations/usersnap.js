
const IntegrationsBase = require('./_IntegrationsBase')
const Google = require('./google');

class UserSnap extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);
        let apiKey, s, x;
        if (config == null) {
            config = {};
        }
        apiKey = config.api;
        if (apiKey) {
            let usConf = {
                emailBox: true,
                emailBoxValue: user.email,
                emailRequired: true,
                consoleRecorder: true,
                mode: 'report',
                shortcut: true,
                beforeOpen: function (obj) {
                    Google.sendEvent('feedback', 'usersnap', 'widget', window.location.href);
                }
            };
            window.usersnapconfig = window._usersnapconfig = usConf;
            
            s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = '//api.usersnap.com/load/' + apiKey + '.js';
            x = document.getElementsByTagName('head')[0];
            x.appendChild(s);
        }
        this.userSnap = window.UserSnap;
    }
    
    get integration() {
        this.userSnap = this.userSnap || window.UserSnap;
        return this.userSnap;
    }
    
    init() {
        super.init();
    }
    
    setUser() {
        super.setUser();
    }
    
}


module.exports = UserSnap;