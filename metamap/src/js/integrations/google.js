const IntegrationsBase = require('./_IntegrationsBase')

class Google extends IntegrationsBase {
  constructor(config, user) {
    super(config, user);
    // Google Plus API
    (function () {
      let po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/platform.js';
      let s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
      
    //Google Tag Manager API
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({
        'gtm.start':
        new Date().getTime(), event: 'gtm.js'
      }); let f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
        '//www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', this.config.tagmanager);

    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date(); a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  }

  get integration() {
    this.ga = this.ga || window.ga;
    return this.ga;
  }

  init() {
    super.init();
    let mode = 'auto';
    let domain = window.location.host;
    if(domain.startsWith('localhost')) {
      mode = 'none';
    }
    this.integration('create', this.config.analytics, mode);
    this.integration('send', 'pageview');
  }

  setUser() {
    super.setUser();
    this.integration('set', 'userId', this.user.userId);
  }

  static sendSocial(network, targetUrl, type = 'send') {
    if (window.ga) {
      window.ga('send', 'social', network, type, targetUrl);
    }
  }

  sendEvent(val, event, source, type) {
    super.sendEvent(val, event, source, type);
    if (this.integration) {
      if (source && type) {
        this.integration('send', event, source, type, val);
      } else {
        this.integration('send', event, val);
      }
    }
  }
  
  updatePath(path) {
    super.updatePath(path);
    if (this.integration) {
        this.integration('set', {
            page: path
        });
        this.integration('send', 'pageview');
    }
  }

  static sendEvent(event, source, type, url) {
    if (window.ga) {
      window.ga('send', event, source, type, url);
    }
  }

}

module.exports = Google;


