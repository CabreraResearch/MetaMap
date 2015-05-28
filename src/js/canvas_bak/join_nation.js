// functions for joining nation, with a modal dialog

window.SandbankJoinNation = {};

SandbankJoinNation = function($scope) {

    this.openModal = function(orgId, orgName) {
        var modalInstance = $modal.open({
            templateUrl: 'template_join_nation_modal.html', // see views/memberships/_template_join_nation_modal
            backdrop: 'static',
            controller: joinModalCtrl,
            windowClass: 'tags-modal',
            resolve: {
                orgId: function() {
                    return orgId;
                },
                orgName: function() {
                    return orgName;
                }
            }
        });

        modalInstance.result.then(function() {
            $scope.loadUserProfile();
        });
    };


    // --------------- controller for join modal ---------------------

    var joinModalCtrl = function($scope, $modalInstance, orgId, orgName) {

        $scope.orgId = orgId;
        $scope.orgName = orgName;

        // need a dot!
        $scope.formData = {
            joinCode: ''
        };

        $scope.error = '';

        function joinOrg() {
            $http.post('/memberships.json', {
                organization_id: $scope.orgId,
                join_code: $scope.formData.joinCode
            }).then(function(response) {
                $modalInstance.close();
                alert('Welcome! You are now a member of ' + $scope.orgName + '.');
            }, function() {
                $scope.error = "Could not join ThinkNation - did you enter the correct code?";
            });
        }

        $scope.ok = function() {
            joinOrg();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

};