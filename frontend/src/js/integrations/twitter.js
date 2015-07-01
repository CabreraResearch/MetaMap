
var twitterApi = function (apiKey) {
    
    window.twttr = (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
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
    }(document, "script", "twitter-wjs"));

    let tryCount = 0;
    let load = () => {
        if (window.twttr && window.twttr.widgets) {
            return window.twttr.widgets.load();
        } else if(tryCount < 5) {
            tryCount += 1;
            _.delay(load, 250);
        }
    }

    return load;

};

module.exports = twitterApi;


