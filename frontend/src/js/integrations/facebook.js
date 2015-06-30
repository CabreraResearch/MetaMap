
var facebookApi = function (apiKey) {
    
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: '847702775304906',
            xfbml: true,
            version: 'v2.3'
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    return window.fbAsyncInit;
};

module.exports = facebookApi;


