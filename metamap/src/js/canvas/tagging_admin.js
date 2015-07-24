// functions for admin-tagging maps, with a modal dialog

window.SandbankAdminTagging = {};

SandbankAdminTagging = function($scope, $http, $resource, $modal, $log) {

    this.openModal = function (mapId, onUpdate) {
        var modalInstance = $modal.open({
            templateUrl: 'template_map_admin_tagging_modal.html', // see views/admin_tags/_template_map_admin_tagging_modal
            backdrop: 'static',
            controller: tagsModalCtrl,
            windowClass: 'tags-modal',
            resolve: {
                mapId: function() { return mapId; },
                onUpdate: function() { return onUpdate; }
            }
        });

        modalInstance.result.then(function() {});
    };


    // --------------- controller for tags modal ---------------------

    var tagsModalCtrl = function ($scope, $modalInstance, mapId, onUpdate) {

        $scope.mapId = mapId;

        // admin tags applied to the map
        $scope.mapAdminTags = [];
        // list of all admin tags
        $scope.adminTagList = [];

        // checkbox selections for admin tags - key (index): admin tag ID; value: true/false (if map has the admin tag)
        $scope.selectedAdminTags = [];

        function initSelectedAdminTags() {
            $scope.selectedAdminTags = [];
            _.each($scope.adminTagList, function(tag) {
                if (_.findWhere($scope.mapAdminTags, { id: tag.id })) {
                    $scope.selectedAdminTags[tag.id] = true;
                }
            });
        }

        function loadTags(mapId) {
            $http.get('/admin_tags/map_admin_tags.json?id=' + mapId).then(function(response) {
                $scope.mapAdminTags = response.data.mapAdminTags;
                $scope.adminTagList = response.data.adminTagList;
                initSelectedAdminTags();
            },
            function() {
                alert('Could not load tags');
            });
        }

        loadTags(mapId);

        function saveTags(onUpdate) {
            var selectedTagNames = _.map($scope.adminTagList, function(tag) {
                return $scope.selectedAdminTags[tag.id] ? tag.name : null;
            });
            var tagList = _.without(selectedTagNames, null).join(',');

            $http.put('/admin_tags/update_map_admin_tags', [{ mapId: $scope.mapId, adminTags: tagList }]).then(function(response) {
                onUpdate();
            },
            function() {
                alert('Could not save tags');
            });
        }

        $scope.ok = function () {
            saveTags(onUpdate);
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    tagsModalCtrl.$inject = ['$scope', '$modalInstance', 'mapId', 'onUpdate'];
};
