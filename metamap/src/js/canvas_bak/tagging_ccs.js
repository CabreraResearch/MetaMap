// functions for tagging maps or users with common core standards, with a modal dialog

window.SandbankCcsTagging = {};

SandbankCcsTagging = function($scope) {

    var self = this;

    // this is set in either user.js or editor.js, and tells us if we're 
    // editing CCS tags for the current user or for the current map
    this.mapId = null;

    // the list of links to standards for this map or user.
    // each link is a wrapper for the standard, with this format:
    // { standard: { name: "K.CC.A.1", statement: "..." }, editing: false }
    this.links = [];

    this.addLink = function() {
        var link = {
            standard: null,
            editing: true
        };
        self.links.push(link);
        self.openModal(link);
    };

    this.deleteLink = function(link) {
        var i = _.indexOf(self.links, link);
        self.links.splice(i, 1);
        self.saveCcsTags();
    };

    this.editingALink = function() {
        return self.links && _.findWhere(self.links, {
            editing: true
        }) !== undefined;
    };

    // returns an list of names of the selected standards
    this.getLinkNames = function() {
        return _.map(self.links, function(link) {
            return link.standard.name;
        }).join(',');
    };

    this.loadCcsTags = function() {
        if (self.mapId) {
            $http.get('/common_core_standards/map_ccs_tags.json?id=' + self.mapId).then(function(response) {
                    _.each(response.data.mapCcsTags, function(tag) {
                        self.links.push({
                            standard: tag,
                            editing: false
                        });
                    });
                },
                function() {});
        } else {
            _.each($scope.userProfile.userCcsTags, function(tag) {
                self.links.push({
                    standard: tag,
                    editing: false
                });
            });
        }
    };

    this.saveCcsTags = function() {
        if (self.mapId) {
            $http.put('/common_core_standards/update_map_ccs_tags', [{
                mapId: self.mapId,
                ccsTags: self.getLinkNames()
            }]).then(
                function(response) {},
                function() {
                    alert('Could not save Common Core Standards');
                });
        } else {
            $http.put('/common_core_standards/update_user_ccs_tags', [self.getLinkNames()]).then(function(response) {
                    // $scope.loadUserProfile();
                    // $scope.profileEditStatus = 'CCS Tags saved';
                },
                function() {
                    $scope.profileEditStatus = 'Could not save CCS tags';
                });
        }
    };

    this.openModal = function(link, onUpdate) {
        var modalInstance = $modal.open({
            templateUrl: 'template_ccs_tagging_modal.html',
            backdrop: 'static',
            controller: ccsTagsModalCtrl,
            windowClass: 'standards-modal',
            resolve: {
                link: function() {
                    return link;
                },
                onUpdate: function() {
                    return onUpdate;
                }
            }
        });

        modalInstance.result.then(function() {});
    };

    // --------------- controller for tags modal ---------------------

    var ccsTagsModalCtrl = function($scope, $modalInstance, link, onUpdate) {

        // the list of all standards, which the user selects from
        $scope.standards = [];
        $scope.selection = {
            standard: link.standard
        };

        // TODO: cache these somehow??
        $scope.loadStandards = function() {
            var url = '/common_core_standards.json';
            $http.get(url).then(function(response) {
                $scope.standards = response.data.standards;
                $scope.applyFilters();
            });
        };

        $scope.loadStandards();

        $scope.filters = {
            // possible values for filter vars
            filteredStandardTypes: [], // these don't actually get filtered, but naming for consistency
            filteredGrades: [],
            filteredCategories: [],
            filteredStandards: [],

            // filter vars
            standardTypeFilter: null,
            gradeFilter: null,
            categoryFilter: null
        }

        // filter the drop-downs and the standards list according to current selections
        $scope.applyFilters = function() {
            // get standard types (e.g. 'Mathematics')
            $scope.filters.filteredStandardTypes = _.uniq(_.pluck($scope.standards, 'standard'));

            // get grade options for selected standard
            $scope.filters.filteredGrades = _.uniq(_.pluck(_.where($scope.standards, {
                standard: $scope.filters.standardTypeFilter
            }), 'grade'));

            // get category options for selected standard and grade
            $scope.filters.filteredCategories = _.uniq(_.pluck(_.where($scope.standards, {
                standard: $scope.filters.standardTypeFilter,
                grade: $scope.filters.gradeFilter
            }), 'category'));

            // get standards for selected standard, grade and category
            $scope.filters.filteredStandards = _.filter($scope.standards, function(std) {
                return (!$scope.filters.standardTypeFilter || std.standard == $scope.filters.standardTypeFilter) &&
                    (!$scope.filters.gradeFilter || std.grade == $scope.filters.gradeFilter) &&
                    (!$scope.filters.categoryFilter || std.category == $scope.filters.categoryFilter);
            });
        };

        // set the filter drop-downs to match the selected standard
        $scope.setFilters = function(link) {
            if (link.standard) {
                $scope.filters.standardTypeFilter = link.standard.standard;
                $scope.filters.gradeFilter = link.standard.grade;
                $scope.filters.categoryFilter = link.standard.category;
            } else {
                $scope.filters.standardTypeFilter = null;
                $scope.filters.gradeFilter = null;
                $scope.filters.categoryFilter = null;
            }
            $scope.applyFilters();
        };

        $scope.setFilters(link);

        $scope.ok = function() {
            link.standard = $scope.selection.standard;
            link.editing = false;
            $modalInstance.close();
            self.saveCcsTags();
        };

        $scope.cancel = function() {
            link.editing = false;
            // if we were adding a new link, get rid of it
            if (!link.standard) {
                self.deleteLink(link);
            }
            $modalInstance.dismiss('cancel');
        };

    };
};