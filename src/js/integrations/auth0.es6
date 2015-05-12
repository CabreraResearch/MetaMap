class Auth0 {

    init(opts) {
        this.config = opts;
        return this.config;
    }

    login(username, password) {
        var authResponse;
        authResponse = postLogin({
            username: username,
            password: password
        });
        return authResponse;
    }

    getSession() {
        var promise;
        promise = app.api.getCurrentUser();
        return promise;
    }

    logout() {
        var logoutReq;
        logoutReq = getLogout();
        return logoutReq;
    }
}
module.exports = Auth0;


