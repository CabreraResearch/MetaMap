// functions for user-tagging maps, with a modal dialog

// NB: the complexity here is due to the need to show existing tags that may apply 
// to any number of the selected maps, vs. new tags that will be added to all selected maps -
// the tagging info needs to be grouped and ungrouped when loading and saving to handle this.

window.SandbankTagging = {};

SandbankTagging = function($scope, $http, $resource, $modal, $log) {

    this.openModal = function (mapIds, showDescription, onUpdate) {
        var modalInstance = $modal.open({
            templateUrl: 'template_map_tagging_modal.html', // see views/user_tags/_template_map_tagging_modal
            backdrop: 'static',
            controller: tagsModalCtrl,
            windowClass: 'tags-modal',
            resolve: {
                mapIds: function() { return mapIds; },
                showDescription: function() { return showDescription; },
                onUpdate: function() { return onUpdate; }
            }
        });

        modalInstance.result.then(function() {});
    };


    // --------------- controller for tags modal ---------------------

    var tagsModalCtrl = function ($scope, $modalInstance, mapIds, showDescription, onUpdate) {

        $scope.mapIds = mapIds;

        // all existing tags for selected maps - format: [{mapId: 1, tagId: 1, tagName:'foo'}, ...]
        $scope.mapUserTags = [];    
        
        // existing tags, grouped for display - format: [{name:'foo', mapIds:[1,2]}, ...]
        $scope.existingTags = [];   

        // new tags added in the dialog - format: [{name:'foo'}, ...]
        $scope.newTags = [];        

        // all updated tags, to be saved - tags format: [{mapId: 1, userTags: "foo, bar, bam"}, ...]
        $scope.updatedTags = { description: '', tags: [] };

        $scope.showDescription = showDescription;

        function loadTags(mapIds) {
            $http.get('/user_tags/map_user_tags.json?ids=' + mapIds.join(',')).then(function(response) {
                $scope.mapUserTags = response.data.mapUserTags;
                // NB: the map description is always passed back if we only pass one map ID, 
                // but we may not display it in the dialog - depends on the value of the showDescription flag.
                if (mapIds.length == 1) {
                    $scope.updatedTags.description = response.data.mapDescription;
                }
                initExistingTags();
                $scope.addNewTag();
            },
            function() {
                alert('Could not load tags');
            });
        }

        loadTags(mapIds);

        function initExistingTags() {
            var tagNames = _.uniq(_.pluck($scope.mapUserTags, 'tagName')).sort();
            $scope.existingTags = _.map(tagNames, function(name) {
                var mapUserTagsForName = _.where($scope.mapUserTags, {tagName: name});
                var mapIds = _.pluck(mapUserTagsForName, 'mapId');
                return { 
                    name:name, 
                    mapIds:mapIds
                };
            });
        }

        function buildUpdatedTags() {
          $scope.updatedTags.tags = [];
          _.each(mapIds, function(id) {
              var existingTagsForId = _.filter($scope.existingTags, function(existingTag) { 
                // existingTag format: {name:'foo', mapIds:[1,2]}
                return _.contains(existingTag.mapIds, id);
              });
              $scope.updatedTags.tags.push({
                  mapId: id, 
                  userTags: _.union(
                      _.pluck(existingTagsForId, 'name'),
                      _.without(_.pluck($scope.newTags, 'name'), '') // remove empty tags
                  ).join(', ')
              });
          });
        }

        function saveTags(onUpdate) {
            $http.put('/user_tags/update_map_user_tags', [$scope.updatedTags]).then(function(response) {
                onUpdate();
            },
            function() {
                alert('Could not save tags');
            });
        }

        $scope.deleteExistingTag = function(tag) {
            var i = _.indexOf($scope.existingTags, tag);
            $scope.existingTags.splice(i, 1);
        };  

        $scope.addNewTag = function() {
            $scope.newTags.push({name: ''});
        };

        $scope.tagSelected = function(item, model, label) {
          //console.log('tagSelected: ' + item + ', ' + model + ', ' + label);
          $scope.addNewTag();
        };

        $scope.editingTagKeypress = function(e) {
            if (e.which == 13) {
                $scope.addNewTag();
            }
        };

        $scope.deleteNewTag = function(tag) {
            var i = _.indexOf($scope.newTags, tag);
            $scope.newTags.splice(i, 1);
            if (!$scope.newTags.length) {
                $scope.addNewTag(); // always leave at least one tag field
            }
        };


        // tag autocomplete
        $scope.getUserTags = function(viewValue) {
            var url = '/user_tags/list.json?q=' + viewValue; 
            return $http.get(url).then(function(response) {
                return response.data.tags;
            });
        };

        $scope.ok = function () {
            buildUpdatedTags();
            saveTags(onUpdate);
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    tagsModalCtrl.$inject = ['$scope', '$modalInstance', 'mapIds', 'showDescription', 'onUpdate'];
};
