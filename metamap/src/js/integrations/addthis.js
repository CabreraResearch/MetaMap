const IntegrationsBase = require('./_IntegrationsBase')

class AddThis extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = window.addthis || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = `//s7.addthis.com/js/300/addthis_widget.js#pubid=${config.pubid}`;
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function (f) {
                t._e.push(f);
            };
            
            return t;
        } (document, "script", "add-this-js"));
        this.addthis = window.addthis;
    }
    
    get integration() {
        this.addthis = this.addthis || window.addthis;
        return this.addthis;
    }
    
    init() {
        super.init();
    }
}

module.exports = AddThis;


