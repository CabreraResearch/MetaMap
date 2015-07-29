let uuid = require('../tools/uuid.js');

class User {
    constructor(profile, auth, eventer) {
        this.auth = auth;
        this.eventer = eventer;
        this.params = URI(window.location).query(true);
        this.thinkquery = (this.params.thinkquery ? true : false);
        this.userKey = uuid();
        this.onReady();
    }

    onReady() {
        if (!this._onReady) {
            let trackHistory = _.once(() => {
                this.eventer.every('history', (page) => {
                    if (this.history.length == 0 || page != this.history[this.history.length - 1]) {
                        this.history.push(page);
                        FrontEnd.MetaFire.setData(this.history, `users/${this.auth.uid}/history`);
                    }
                });
            });
            this._onReady = new Promise((fulfill, reject) => {
                FrontEnd.MetaFire.on(`users/${this.auth.uid}`, (user) => {
                    if (!user.history) {
                        user.history = [];
                    }
                    this.profile = user;
                    trackHistory();
                    fulfill(user);
                });

                
            });
        }
        return this._onReady;
    }

    get userId() {
        return this.auth.uid;
    }

    get isAdmin() {
        return this.profile.roles.indexOf('admin') !== -1;
    }

    get name() {
        return this.profile.name;
    }

    get history() {
        return this.profile.history;
    }

    saveUserEditorOptions(options) {
        let data = {
            user: {
                editor_options: JSON.stringify(options)
            }
        };

        //startSpinner();
        //$http.put('/users/' + $scope.userId + '.json', data).then(
        //    function (response) {
        //        stopSpinner();
        //    },
        //    function () {
        //        stopSpinner();
        //        $scope.profileEditStatus = 'Could not save editor options';
        //    }
        //);
    }
}

module.exports = User;