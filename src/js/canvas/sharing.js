// functions for sharing maps, with a modal dialog

window.SandbankSharing = {};

SandbankSharing = function($scope) {

    this.openModal = function(mapIds, onUpdate) {
        var modalInstance = $modal.open({
            templateUrl: 'template_map_sharing_modal.html', // see views/shares/_template_map_sharing_modal
            backdrop: 'static',
            controller: sharingModalCtrl,
            windowClass: 'sharing-modal',
            resolve: {
                userId: function() {
                    return $scope.userId;
                },
                userProfile: function() {
                    return $scope.userProfile;
                },
                mapIds: function() {
                    return mapIds;
                },
                onUpdate: function() {
                    return onUpdate;
                }
            }
        });

        modalInstance.result.then(function() {});
    };


    // --------------- controller for sharing modal ---------------------

    var sharingModalCtrl = function($scope, $modalInstance, userId, userProfile, mapIds, onUpdate) {

        $scope.userId = userId;
        $scope.userProfile = userProfile;
        $scope.mapIds = mapIds;

        // all existing shares for selected maps
        // format: [{mapId:1, shareId:1, canEdit:true, userId:2, userEmail:'foo@bar.com', groupId:null, organizationId:null, isPublic:false }, ...]
        $scope.mapShares = [];

        // existing shares, grouped for display
        // format: [{name:'foo', userEmail:'foo@bar.com', userId: null, groupId: id, organizationId: null, isPublic:false, canEdit:true, mapIds:[1,2]}, ...]
        $scope.existingShares = [];

        // new shares added in the dialog 
        // format: [{shareType:SHARE_TYPE_INDIVIDUAL, sharePermission:SHARE_PERMISSION_CANVIEW, userEmail:'foo@bar.com', groupId:null, organizationId:null, isPublic:false }, ...]
        $scope.newShares = [];

        // all updated shares, to be saved
        // format: [{mapId:1, canEdit:false, userEmail:'foo@bar.com', groupId:null, organizationId:null, isPublic:false }, ...]
        $scope.updatedShares = [];

        // indexes of users/groups/orgs - format: [{id:1, name:'foo'}, ...]
        $scope.users = [];
        $scope.groups = [];
        $scope.organizations = [];

        // constants
        $scope.SHARE_TYPE_INDIVIDUAL = 'One or more Individuals';
        $scope.SHARE_TYPE_GROUP = 'Group';
        $scope.SHARE_TYPE_ORGANIZATION = 'ThinkNation';
        $scope.SHARE_TYPE_PUBLIC = 'All MetaMap Users';

        $scope.shareTypes = [
            $scope.SHARE_TYPE_INDIVIDUAL,
            //$scope.SHARE_TYPE_GROUP, 
            $scope.SHARE_TYPE_ORGANIZATION,
            $scope.SHARE_TYPE_PUBLIC
        ];

        $scope.SHARE_PERMISSION_CANVIEW = 'Can view';
        $scope.SHARE_PERMISSION_CANEDIT = 'Can edit';

        $scope.sharePermissions = [
            $scope.SHARE_PERMISSION_CANVIEW,
            $scope.SHARE_PERMISSION_CANEDIT
        ];

        $scope.canShareCultureMap = function(share) {
            return _.findWhere($scope.userProfile.memberships, {
                organizationId: share.organizationId,
                leader: true
            });
        };

        // get existing shares
        function loadShares(mapIds) {
            $http.get('/shares/map_shares.json?ids=' + mapIds.join(',')).then(function(response) {
                    if (response.status === 200 || response.status === 204) {
                        $scope.mapShares = response.data.mapShares;
                        $scope.users = response.data.users;
                        $scope.groups = response.data.groups;
                        $scope.organizations = response.data.organizations;
                        initExistingShares();
                        if (!$scope.existingShares.length && $scope.canAddNewShare()) {
                            $scope.addNewShare();
                        }
                    }
                },
                function() {
                    alert('Could not load sharing info');
                });
        }

        loadShares(mapIds);

        // group the existing shares by user, group, org and public
        function initExistingShares() {
            // find all emails that occur in a share
            var userEmails = _.without(_.uniq(_.pluck($scope.mapShares, 'userEmail')), null);
            // build an array of shares, one for each email, with the applicable map IDs
            var sharesByUserEmail = _.map(userEmails, function(email) {
                var user = _.findWhere($scope.users, {
                    email: email
                });
                return {
                    isDeleted: false,
                    userEmail: email,
                    userId: (user ? user.id : null),
                    groupId: null,
                    organizationId: null,
                    isPublic: false,
                    isCultureMap: false,
                    name: email,
                    // NB: for this attribute we don't try to summarize the value for all the existing shares, 
                    // because it would be too complicated to display...
                    canEdit: $scope.mapShares.length == 1 && $scope.mapShares[0].canEdit,
                    mapIds: _.pluck(_.where($scope.mapShares, {
                        userEmail: email
                    }), 'mapId')
                };
            });

            var groupIds = _.without(_.uniq(_.pluck($scope.mapShares, 'groupId')), null);
            var sharesByGroupId = _.map(groupIds, function(id) {
                var group = _.findWhere($scope.groups, {
                    id: id
                });
                return {
                    isDeleted: false,
                    userEmail: null,
                    userId: null,
                    groupId: id,
                    organizationId: null,
                    isPublic: false,
                    isCultureMap: false,
                    name: 'Group: ' + (group ? group.name : ''),
                    canEdit: $scope.mapShares.length == 1 && $scope.mapShares[0].canEdit,
                    mapIds: _.pluck(_.where($scope.mapShares, {
                        groupId: id
                    }), 'mapId')
                };
            });

            var organizationIds = _.without(_.uniq(_.pluck($scope.mapShares, 'organizationId')), null);
            var sharesByOrganizationId = _.map(organizationIds, function(id) {
                var organization = _.findWhere($scope.organizations, {
                    id: id
                });
                return {
                    isDeleted: false,
                    userEmail: null,
                    userId: null,
                    groupId: null,
                    organizationId: id,
                    isPublic: false,
                    isCultureMap: $scope.mapShares.length == 1 && $scope.mapShares[0].isCultureMap,
                    name: 'ThinkNation: ' + (organization ? organization.name : ''),
                    canEdit: $scope.mapShares.length == 1 && $scope.mapShares[0].canEdit,
                    mapIds: _.pluck(_.where($scope.mapShares, {
                        organizationId: id
                    }), 'mapId')
                };
            });

            // are any of the selected maps shared publicly?
            var publicShares = [];
            if (_.where($scope.mapShares, {
                isPublic: true
            }).length) {
                publicShares = [{
                    isDeleted: false,
                    userEmail: null,
                    userId: null,
                    groupId: null,
                    organizationId: null,
                    isPublic: true,
                    isCultureMap: false,
                    name: 'Everyone',
                    canEdit: false,
                    mapIds: _.pluck(_.where($scope.mapShares, {
                        isPublic: true
                    }), 'mapId')
                }];
            }

            $scope.existingShares = _.union(sharesByUserEmail, sharesByGroupId, sharesByOrganizationId, publicShares);
        }

        function buildUpdatedShares() {
            $scope.updatedShares = [];

            // for each selected map, decompose the existingShares (grouped by user/group/org/public) into individual shares for saving
            _.each(mapIds, function(id) {
                // get existing shares for this map
                var existingSharesForMapId = _.filter($scope.existingShares, function(existingShare) {
                    // existingShares format: [{name:'foo', userEmail:'foo@bar.com', userId: null, groupId: id, organizationId: null, isPublic:false, isCultureMap:false, canEdit:true, mapIds:[1,2]}, ...]
                    return _.contains(existingShare.mapIds, id);
                });
                // decompose these into individual shares
                _.each(existingSharesForMapId, function(es) {
                    $scope.updatedShares.push({
                        isNew: false,
                        isDeleted: es.isDeleted,
                        mapId: id,
                        userEmail: es.userEmail,
                        userId: es.userId,
                        groupId: es.groupId,
                        organizationId: es.organizationId,
                        isPublic: es.isPublic,
                        isCultureMap: es.isCultureMap,
                        canEdit: es.canEdit
                    });
                });
            });

            // add in the newShares (for each selected map)
            _.each(mapIds, function(id) {
                _.each($scope.newShares, function(ns) {
                    $scope.updatedShares.push({
                        isNew: true,
                        mapId: id,
                        userEmail: (ns.shareType == $scope.SHARE_TYPE_INDIVIDUAL ? ns.userEmail : null),
                        groupId: (ns.shareType == $scope.SHARE_TYPE_GROUP ? ns.groupId : null),
                        organizationId: (ns.shareType == $scope.SHARE_TYPE_ORGANIZATION ? ns.organizationId : null),
                        isPublic: ns.shareType == $scope.SHARE_TYPE_PUBLIC,
                        isCultureMap: ns.isCultureMap,
                        canEdit: (ns.shareType == $scope.SHARE_TYPE_PUBLIC ? false : ns.sharePermission == $scope.SHARE_PERMISSION_CANEDIT),
                        message: ns.message
                    });
                });
            });
        }

        function saveShares(onUpdate) {
            $http.put('/shares/update_map_shares', $scope.updatedShares).then(function(response) {
                    onUpdate();
                },
                function() {
                    alert('Could not save sharing info');
                });
        }

        $scope.canDeleteExistingShare = function() {
            return $scope.canAddNewShare();
        };

        $scope.deleteExistingShare = function(share) {
            share.isDeleted = true;
        };

        $scope.canAddNewShare = function() {
            // make sure all maps are owned by the current user
            var mapUserIds = _.uniq(_.pluck($scope.mapShares, 'mapUserId'));
            return mapUserIds.length == 0 || (mapUserIds.length == 1 && mapUserIds[0] == $scope.userId);
        };

        $scope.addNewShare = function() {
            // NB: isPublic and canEdit are set in buildUpdateShares
            $scope.newShares.push({
                shareType: $scope.SHARE_TYPE_INDIVIDUAL,
                sharePermission: $scope.SHARE_PERMISSION_CANVIEW,
                userEmail: '',
                groupId: ($scope.groups.length ? $scope.groups[0].id : null),
                organizationId: ($scope.organizations.length ? $scope.organizations[0].id : null),
                isCultureMap: false,
                message: ''
            });
        };

        $scope.deleteNewShare = function(share) {
            var i = _.indexOf($scope.newShares, share);
            $scope.newShares.splice(i, 1);
        };

        $scope.ok = function() {
            buildUpdatedShares();
            saveShares(onUpdate);
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };
};