const IntegrationsBase = require('./_IntegrationsBase')

class Google extends IntegrationsBase {
  constructor(config, user) {
    super(config, user);

    (function () {
        let a = undefined, m = undefined
        window['GoogleAnalyticsObject'] = 'ga'; window['ga'] = window['ga'] ||
            function () {
                (window['ga'].q = window['ga'].q || []).push(arguments)
        }, window['ga'].l = 1 * new Date(); a = document.createElement('script'),
        m=document.getElementsByTagName('script')[0];a.async=1;a.src='//www.google-analytics.com/analytics.js';m.parentNode.insertBefore(a,m)
    })();

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

  }

  get integration() {
    return window.ga;
  }

  init() {
    super.init();
    let mode = 'auto';
    let domain = window.location.host;
    if(domain.startsWith('localhost')) {
      mode = 'none';
    }
    this.integration('create', this.config.analytics, mode);
    this.integration('require', 'displayfeatures');
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

  sendEvent(label = '', category = '', action = '', val = 0) {
    super.sendEvent(label, category, action);
    if (this.integration) {
        if (label) {
          this.integration('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: val
          });
      } else {
        this.integration('send', 'event', label);
      }
    }
  }

  sendError(message, isFatal = false) {
    super.sendEvent(message, isFatal);
    if (this.integration) {
        this.integration('send', 'exception', {
            exDescription: message,
            exFatal: isFatal
        });
    }
  }

  updatePath(path, title = '') {
    super.updatePath(path);
    if (this.integration) {
        this.integration('set', {
            page: path,
            title: title
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


