class Auth0 {

    init(opts) {
        this.config = opts;
        return this.config;
    }

    login(username, password) {
        var authResponse;
        authResponse = null;
        return authResponse;
    }

    getSession() {
        var promise;
        promise = null;
        return promise;
    }

    logout() {
        var logoutReq;
        logoutReq = null;//getLogout();
        return logoutReq;
    }
}
module.exports = Auth0;


