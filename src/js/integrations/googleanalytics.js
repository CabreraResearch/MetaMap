
var googleAnalytics = function (config) {
    var apiKey, e, r;
    if (config == null) {
        config = {};
    }
    apiKey = config.GOOGLE_ANALYTICS_TRACKING_ID;
    if (apiKey && window.location.hostname !== 'localhost') {
        window.GoogleAnalyticsObject = 'ga';
        window.ga || (window.ga = function () {
            (window.ga.q = window.ga.q || []).push(arguments);
        });
        window.ga.ga = +(new Date);
        e = document.createElement('script');
        r = document.getElementsByTagName('script')[0];
        e.src = '//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e, r);
        ga('create', apiKey);
        return ga('send', 'pageview');
    }
};

module.exports = googleAnalytics;


