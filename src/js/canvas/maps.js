// controller for user's maps/dashboard

window.MapsCtrl = function($scope) {

    $scope.searchText = '';

    $scope.listingParams = new GorgesGrid.ListingParams();
    $scope.listingParams.sortBy = 'updated_at';
    $scope.listingParams.sortOrder = 'desc';

    $scope.listingParams.viewName = $scope.params.viewName || 'all'; // set default view
    $scope.rowSelection = new GorgesGrid.RowSelection();
    $scope.viewTreeState = new GorgesGrid.ViewTreeState();
    $scope.viewTreeState.expandedViews = ['orgs_belonged_to'];
    $scope.maps = [];
    $scope.views = [];
    $scope.users = [];

    $scope.tagging = new SandbankTagging($scope);
    $scope.adminTagging = new SandbankAdminTagging($scope);
    $scope.sharing = new SandbankSharing($scope);

    $scope.openTaggingModal = function() {
        $scope.tagging.openModal(
            $scope.getSelectedMapIds(),
            false, // don't show description field (TODO: show if it's a single map that the user can edit?)
            function() {
                $scope.loadMaps();
            } // on update
        );
    };

    $scope.openAdminTaggingModal = function() {
        $scope.adminTagging.openModal(
            $scope.getSelectedMapIds()[0],
            function() {
                $scope.loadMaps();
            } // on update
        );
    };

    $scope.openSharingModal = function() {
        $scope.sharing.openModal(
            $scope.getSelectedMapIds(),
            function() {
                $scope.loadMaps();
            } // on update
        );
    };

    // ---------------- row selection -----------------

    // TODO: add conditions for enabling tag/share/delete buttons based on permissions of selected maps

    $scope.getSelectedMapIds = function() {
        var ids = [];
        _.each($scope.rowSelection.selectedRowIndexes, function(element, index, list) {
            if (element) {
                if ($scope.maps[index]) { // should always be true
                    ids.push($scope.maps[index].id);
                }
            }
        });
        return ids;
    };

    // ---------------- respond to view/page changes -----------------

    $scope.maybeSetView = function(view) {
        // don't set the view if a parent view is clicked on
        if (!view.isParent) {
            $scope.listingParams.viewName = view.name;
            $scope.loadMaps();
        }
        $scope.viewTreeState.expandView(view.name);
    };

    $scope.pageSelected = function() {
        $scope.loadMaps();
    };

    $scope.setSortBy = function(col) {
        $scope.listingParams.setSortBy(col);
        $scope.loadMaps();
    };

    $scope.doSearch = function() {
        $scope.loadMaps();
    };

    $scope.resetSearch = function() {
        $scope.searchText = '';
        $scope.loadMaps();
    };

    // ---------------- map data -----------------

    $scope.loadMaps = function() {
        startSpinner();
        $http.get('/maps.json?' + $scope.listingParams.toQueryString() +
            '&search=' + $scope.searchText
        ).then(function(response) {
                // get updated params
                _.extend($scope.listingParams, response.data.listingParams);
                $scope.rowSelection.deselectAll();
                $scope.views = response.data.views;
                $scope.maps = response.data.maps;
                $scope.users = response.data.users;
                $scope.viewTreeState.expandView($scope.params.expandView);
                stopSpinner();
            },
            function() {
                stopSpinner();
            alert('Could not load list of MetaMaps');
            });
    };

    $scope.loadMaps();

    // -------------- view helpers -----------------

    $scope.listUserTags = function(map) {
        return _.pluck(map.userTags, 'name').join(', ');
    };

    $scope.listCcsTags = function(map) {
        return _.pluck(map.ccsTags, 'name').join(', ');
    };

    $scope.listAdminTags = function(map) {
        return _.pluck(map.adminTags, 'name').join(', ');
    };

    $scope.getUserName = function(map) {
        if (map.userId === $scope.userId) {
            return "Me";
        } else {
            var user = _.findWhere($scope.users, {
                id: map.userId
            });
            return (user ? user.name : '');
        }
    };

    // ------------- star a map -----------------

    $scope.toggleStar = function(map) {
        console.log('toggleStar');
        $http.post('/maps/' + map.id + '/toggle_star').then(function(response) {
                $scope.loadMaps(); // reload to update total in TOC
            },
            function() {});
    };

    // ------------- delete maps -----------------

    $scope.confirmDeleteSelected = function() {
        var mapIds = $scope.getSelectedMapIds();

        // if (mapIds.length == 1) {
        //     alertify.confirm('Delete selected MetaMap?', function(e) {
        //         if (e) {
        //             deleteSelected(mapIds);
        //         }
        //     });
        // } else if (mapIds.length > 1) {
        //     alertify.confirm('Delete ' + mapIds.length + ' selected MetaMaps?', function(e) {
        //         if (e) {
        //             setTimeout(function() { // this is required to make multiple alertify confirms work...
        //                 alertify.confirm('You are deleting multiple MetaMaps, are you really sure?', function(e2) {
        //                     if (e2) {
        //                         deleteSelected(mapIds);
        //                     }
        //                 });
        //             }, 1000);
        //         }
        //     });
        // }

        if (mapIds.length == 1) {
            if (confirm('Delete selected MetaMap?')) {
                deleteSelected(mapIds);
            }
        } else if (mapIds.length > 1) {
            if (confirm('Delete ' + mapIds.length + ' selected MetaMaps?')) {
                if (confirm('You are deleting multiple MetaMaps, are you really sure?')) {
                    deleteSelected(mapIds);
                }
            }
        }
    };

    function deleteSelected(mapIds) {
        $http.post('/maps/delete_multiple', mapIds).then(function(response) {
                if (response.status === 200 || response.status === 204) {
                    $scope.loadMaps();
                    alertify.success((mapIds.length > 1 ? 'MetaMaps' : 'MetaMap') + ' deleted');
                } else {
                    alertify.error('Could not delete MetaMaps');
                }
            },
            function() {
                alert('Could not delete MetaMaps');
            });
    }
};