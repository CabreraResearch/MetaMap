// functions for org profile

var OrganizationCtrl = function($scope, $http, $interpolate) {

    // these are set in views/organization/edit:
    // window.org
    // window.orgType
    // window.orgBannerHeadingTemplate
    // window.orgBannerBodyTemplate 
    // window.orgMissionTemplate

    $scope.org = window.org;
    $scope.orgType = window.orgType;

    $scope.tabCciIds = window.tabCciIds;

    $scope.selectedTabCciIds = [];

    // function initSelectedTabCciIds() {
    //     $scope.selectedTabCciIds = [];
    _.each($scope.tabCciIds, function(id) {
        $scope.selectedTabCciIds[id] = true;
    });
    // }

    // initSelectedTabCciIds();

    $scope.getOrgBannerHeading = function() {
        if ($scope.org && $scope.org.vision && $scope.org.vision.length) {
            return window.orgBannerHeadingTemplate.replace('%VISION', $scope.org.vision);
        } else {
            return null;
        }
    };

    $scope.getOrgBannerBody = function() {
        if ($scope.org && $scope.org.vision && $scope.org.vision.length) {
            return window.orgBannerBodyTemplate;
        } else {
            return null;
        }
    };

    // no substitution is done here, but maybe in the future...
    $scope.getOrgMission = function() {
        return window.orgMissionTemplate;
    };

    // $scope.loadOrg = function() {
    //     if ($scope.userId) {
    //         var url = '/organizations/' + $scope.orgId + '.json';
    //         window.startSpinner();
    //         $http.get(url).then(
    //             function(response) { // success
    //                 $scope.org = response.data;
    //                 window.stopSpinner();
    //                 // alert('Could not load org profile data');
    //             },
    //             function(reason) { // error
    //                 window.stopSpinner();
    //                 alert('Could not load org profile data');
    //             }
    //         );
    //     }
    // };

    // $scope.loadOrg();


    // ------------ auto-save org ---------------

    // don't let autosave be triggered more than every N milliseconds...
    // $scope.autosave = _.debounce(autosaveNow, 2000);

    // function autosaveNow() {
    //     //console.log('autosaving user profile');
    //     var data = {
    //         email: $scope.userProfile.user.email,
    //         alt_email: $scope.userProfile.user.altEmail,
    //         first_name: $scope.userProfile.user.firstName,
    //         last_name: $scope.userProfile.user.lastName,
    //         about_me: $scope.userProfile.user.aboutMe
    //     };

    //     startSpinner();
    //     $scope.orgProfileEditStatus = 'Saving...';
    //     $http.put('/users/' + $scope.userId, data).then(
    //         function(response) {
    //             stopSpinner();
    //             if (_.has(data, 'password')) {
    //                 $scope.profileEditStatus = 'Profile and password saved';
    //                 console.log($scope.profileEditStatus);
    //             } else {
    //                 $scope.profileEditStatus = 'Profile saved';
    //                 console.log($scope.profileEditStatus);
    //             }
    //         },
    //         function() {
    //             stopSpinner();
    //             $scope.profileEditStatus = 'Could not save profile';
    //         }
    //     );
    // }

};

OrganizationCtrl.$inject = ['$scope', '$http'];