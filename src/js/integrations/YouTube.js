const IntegrationsBase = require('./_IntegrationsBase')

class YouTube extends IntegrationsBase {
  constructor(config, user) {
    super(config, user);
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = () => {
        this.YT = window.YT
    }
  }

  get integration() {
    this.YT = this.YT || window.YT;
    return this.YT;
  }

  init() {
    super.init();

  }

  setUser() {
    super.setUser();

  }

  static sendSocial(network, targetUrl, type = 'send') {

  }

  sendEvent(val, event, source, type) {
    super.sendEvent(val, event, source, type);

  }

  updatePath(path) {
    super.updatePath(path);

  }

}

module.exports = YouTube;


