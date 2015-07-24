// controller for list of top maps

window.TopMapsCtrl = function($scope, $http, $resource, $modal, $log) {

    $scope.topMaps = [];
    $scope.users = [];

    // NB: this is duplicated in feed.js, but we repeat it here to make this controller independent
    $scope.organizations = [];

    $scope.organizationId = '';

    // ---------------- map data -----------------

    $scope.loadTopMaps = function() {
        //startSpinner();
        $http.get('/maps/top_maps.json?organizationId=' + $scope.organizationId).then(function(response) {
                $scope.organizations = response.data.organizations;
                $scope.topMaps = response.data.topMaps;
                $scope.users = response.data.users;
                //  stopSpinner();
            },
            function() {
                //stopSpinner();
                alert('Could not load list of top maps');
            });
    };

    $scope.loadTopMaps();

    // -------------- view helpers -----------------

    $scope.getUserName = function(userId) {
        var user = _.findWhere($scope.users, {
            id: userId
        });
        return (user ? user.name : '');
    };

};

window.TopMapsCtrl.$inject = ['$scope', '$http', '$resource', '$modal', '$log'];