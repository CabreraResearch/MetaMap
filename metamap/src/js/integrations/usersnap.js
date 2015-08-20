
const userSnap = function (config) {
    let apiKey, s, x;
    if (config == null) {
        config = {};
    }
    apiKey = config.api;
    if (apiKey && window.location.hostname !== 'localhost') {
        window.usersnapconfig = {
            mode: 'report',
            shortcut: true,
            beforeOpen: function (obj) {
                const metaMap = require('../../MetaMap')               
                return window.UserSnap.setEmailBox(metaMap.User.email);
            }
        };
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//api.usersnap.com/load/' + apiKey + '.js';
        x = document.getElementsByTagName('head')[0];
        return x.appendChild(s);
    }
};

module.exports = userSnap;