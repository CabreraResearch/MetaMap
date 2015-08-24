const IntegrationsBase = require('./_IntegrationsBase')

class ZenDesk extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);
        let zO = {};
        window.zEmbed ||
        function (e, t) {
            let n, o, d, i, s, a = [], r = document.createElement("iframe"); window.zEmbed = function () {
                a.push(arguments)
            }, window.zE = window.zE || window.zEmbed, r.src = "javascript:false", r.title = "", r.role = "presentation", (r.frameElement || r).style.cssText = "display: none", d = document.getElementsByTagName("script"), d = d[d.length - 1], d.parentNode.insertBefore(r, d), i = r.contentWindow, s = i.document;
            try {
                o = s
            } catch (c) {
                n = document.domain, r.src = 'javascript:let d=document.open();d.domain="' + n + '";void(0);', o = s
            } o.open()._l = function () {
                let o = this.createElement("script"); n && (this.domain = n), o.id = "js-iframe-async", o.src = e, this.t = +new Date, this.zendeskHost = t, this.zEQueue = a, this.body.appendChild(o)
                zO.logic = window.zE;
            },
            o.write('<body onload="document._l();">'),
            o.close()
        }
            ("https://assets.zendesk.com/embeddable_framework/main.js", config.site);

        zO.widget = window.zEmbed;
        zO.logic = window.zE;
    }

    init() {
        super.init()
    }

    get integration() {
        return window.zE;
    }

    setUser() {
        super.setUser();
        this.integration(() => {
            this.integration.identify({ name: this.user.fullName, email: this.user.email });
        });
    }

}

const zenDesk = function (config) {

    return zO;
};

module.exports = ZenDesk;