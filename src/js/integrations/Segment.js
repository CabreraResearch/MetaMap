const IntegrationsBase = require('./_IntegrationsBase')

class Segment extends IntegrationsBase {
  constructor(config, user) {
    super(config, user);
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load("mAzRXvJA5eLf2Zcso5ULM3zGU8er88x2");
    analytics.page()
    }}();

  }

  get integration() {
    return window.analytics;
  }

  init() {
    super.init();
  }

  setUser() {
    super.setUser();
    this.integration.identify(this.user.userId, { name: this.user.fullName, email: this.user.email })
  }

  static sendSocial(network, targetUrl, type = 'send') {
    window.analytics.track('social', { network: network, targetUrl: targetUrl })
  }

  sendEvent(label = '', category = '', action = '', val = 0) {
    super.sendEvent(label, category, action);
    if (this.integration) {
        if (label) {
          this.integration.track(label, {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: val
          })
      }
    }
  }

  sendError(message, isFatal = false) {
    super.sendEvent(message, isFatal);
    if (this.integration) {
        this.integration.track('exception', {
            exDescription: message,
            exFatal: isFatal
        })
    }
  }

  updatePath(path, title = '') {
    super.updatePath(path);
    if (this.integration) {
        this.integration.page(path, {
            title: title
        });
    }
  }

  static sendEvent(event, source, type, url) {
     window.analytics.track(event, { source: source, type: type, url: url });
  }

}

module.exports = Segment;


