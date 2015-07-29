let uuid = require('../tools/uuid.js');

class User {
    constructor(profile, auth) {
        this.auth = auth;
        this.profile = profile;
        this.params = URI(window.location).query(true);
        this.thinkquery = (this.params.thinkquery ? true : false);
        this.userKey = uuid();

        FrontEnd.MetaFire.on(`users/${auth.uid}`, (user) => {
            this.profile = user;
        });
    }

    get userId() {
        return this.profile.user_id;
    }

    get isAdmin() {
        return this.profile.roles.indexOf('admin') !== -1;
    }

    get name() {
        return this.profile.name;
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