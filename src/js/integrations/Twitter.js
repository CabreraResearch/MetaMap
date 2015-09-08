const IntegrationsBase = require('./_IntegrationsBase')
const Google = require('./google');

class Twitter extends IntegrationsBase {
    constructor(config, user) {
        super(config, user);
        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function (f) {
                t._e.push(f);
            };

            return t;
        } (document, "script", "twitter-wjs"));
    }

    init() {
        super.init();
        this.integration.ready((twitter) => {
            twitter.widgets.load();
            twitter.events.bind('click', this._clickEventToAnalytics);
            twitter.events.bind('tweet', this._tweetIntentToAnalytics);
            twitter.events.bind('retweet', this._retweetIntentToAnalytics);
            twitter.events.bind('favorite', this._favIntentToAnalytics);
            twitter.events.bind('follow', this._followIntentToAnalytics);
        });

        let tryCount = 0;
        let load = () => {
            if (window.twttr && window.twttr.widgets) {
                return window.twttr.widgets.load();
            } else if (tryCount < 5) {
                tryCount += 1;
                _.delay(load, 250);
            }
        }
    }

    get integration() {
        this.twttr = this.twttr || window.twttr;
        return this.twttr;
    }

    _followIntentToAnalytics(intentEvent) {
        if (!intentEvent) return;
        let label = intentEvent.data.user_id + " (" + intentEvent.data.screen_name + ")";
        Google.sendSocial('twitter', label, intentEvent.type);
    }

    _retweetIntentToAnalytics(intentEvent) {
        if (!intentEvent) return;
        let label = intentEvent.data.source_tweet_id;
        Google.sendSocial('twitter', label, intentEvent.type);
    }

    _favIntentToAnalytics(intentEvent) {
        this._tweetIntentToAnalytics(intentEvent);
    }

    _tweetIntentToAnalytics(intentEvent) {
        if (!intentEvent) return;
        let label = "tweet";
        Google.sendSocial('twitter', label, intentEvent.type);
    }
    _clickEventToAnalytics(intentEvent) {
        if (!intentEvent) return;
        let label = intentEvent.region;
        Google.sendSocial('twitter', label, intentEvent.type);
    }
}

module.exports = Twitter;


