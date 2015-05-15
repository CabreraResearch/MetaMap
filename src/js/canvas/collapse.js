// a simple controller for use with the ng-bootstrap collapse directive
// - use these attributes:
//   - ng-click="toggleExpanded(XXX)" on the clickable thing (or toggleExpandedExclusively to have max one expanded thing)
//   - collapse="!isExpanded(XXX)" on the collapsible element

function CollapseCtrl($scope) {

    $scope.expandedElts = [];

    $scope.isExpanded = function(elt) {
        return _.indexOf($scope.expandedElts, elt) != -1;
    };

    $scope.toggleExpanded = function(elt) {
        if ($scope.isExpanded(elt))
            $scope.expandedElts = _.without($scope.expandedElts, elt);
        else
            $scope.expandedElts.push(elt);
    };


    $scope.toggleExpandedExclusively = function(elt) {
        if ($scope.isExpanded(elt))
            $scope.expandedElts = [];
        else
            $scope.expandedElts = [elt];
    };
}

CollapseCtrl.$inject = ['$scope'];