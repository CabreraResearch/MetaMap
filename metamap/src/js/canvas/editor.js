// main controller class

window.SandbankEditor = {};

window.MapEditorCtrl = function($rootScope, $scope, $http, $resource, $timeout, $modal, $log) {

    $scope.map = new SandbankEditor.Map($scope, $http, $resource, $timeout, $modal, $log);

    // window.mapData is set in _form view
    var metadata = window.mapData.map.metadata;
    $scope.sandbox = metadata.sandbox;
    $scope.mapData = window.mapData.map.data; // this gets overwritten by load() unless we are in the sandbox with no map ID
    $scope.mapId = metadata.id;
    $scope.mapTitle = metadata.name;
    $scope.mapUserTags = metadata.userTags;
    $scope.mapUrl = metadata.url;
    $scope.canEdit = metadata.canEdit;
    $scope.updatedAt = metadata.updatedAt;
    $scope.updatedBy = metadata.updatedBy; // ID
    $scope.updatedByName = metadata.updatedByName;

    $scope.editingTitle = false;

    $scope.showImageExport = false;
    $scope.imageExportLoading = true;

    $scope.currentTab = null;

    // override parent scope (see user.js) since we're editing a map
    $scope.ccsTagging.mapId = $scope.mapId;

    $scope.maybeStartEditingTitle = function() {
        if ($scope.canEdit) {
            $scope.editingTitle = true;
        }
    };

    $scope.doneEditingTitle = function() {
        //console.log('doneEditingTitle');
        $scope.editingTitle = false;
        $scope.map.getAutosave().save('edit_title');
    };

    $scope.editingTitleKeypress = function(e) {
        if (e.which == 13) {
            $scope.doneEditingTitle();
        }
    };

    $scope.print = function() {
        window.print();
    };

    // ------------ save sandbox map (sign up/sign in) ---------------

    $scope.saveSandboxMap = function() {
        var modalInstance = $modal.open({
            templateUrl: 'template_sandbox_save_modal.html', // see views/users/_template_sandbox_save_modal
            backdrop: 'static',
            controller: sandboxSaveModalCtrl,
            windowClass: 'sandbox-save-modal',
            resolve: {
                outerScope: function() {
                    return $scope;
                },
                map: function() {
                    return $scope.map;
                },
                userProfile: function() {
                    return $scope.userProfile;
                }
            }
        });

        modalInstance.result.then(function() {});
    };

    var sandboxSaveModalCtrl = function($scope, $modalInstance, outerScope, map, userProfile) {

        $scope.map = map;
        $scope.userProfile = userProfile;

        $scope.mapData = map.getDiagram().model.toJson();
        $scope.thumbnailPng = map.getPresenter().getMapThumbnail();

        function getDefaultLoginData() {
            return {
                email: '',
                password: ''
            };
        }

        // this structure is used to store the form data, as well as the validation errors returned from the server...
        function getDefaultSignupData() {
            return {
                email: '',
                first_name: '',
                last_name: '',
                password: '',
                password_confirmation: ''
            };
        }

        $scope.loginData = getDefaultLoginData();
        $scope.loginError = '';

        $scope.signupData = getDefaultSignupData();
        $scope.signupErrors = getDefaultSignupData();

        $scope.doLogin = function() {
            $scope.loginErrors = getDefaultLoginData(); // reset errors
            $http.post('/sign_in.json', {
                user: $scope.loginData
            }).then(
                function(response) {
                    // data is {id:XX, ...}
                    outerScope.setUserId(response.data.id);
                    outerScope.loadUserProfile(function() {
                        $scope.userProfile = outerScope.userProfile;
                    });
                },
                function(response) {
                    // data is {"error": "Invalid email or password"}
                    $scope.loginError = response.data.error;
                });
        };

        $scope.doSignup = function() {
            $scope.signupErrors = getDefaultSignupData(); // reset errors
            $http.post('/users.json', {
                user: $scope.signupData
            }).then(
                function(response) {
                    // data is new user ID
                    outerScope.setUserId(response.data);
                    outerScope.loadUserProfile(function() {
                        $scope.userProfile = outerScope.userProfile;
                    });
                },
                function(response) {
                    // data is e.g. {"first_name":["can't be blank"], ...}
                    _.each(_.keys(response.data), function(key) {
                        $scope.signupErrors[key] = response.data[key].join('; ');
                    });
                });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

    sandboxSaveModalCtrl.$inject = ['$scope', '$modalInstance', 'outerScope', 'map', 'userProfile'];

    // ------------- edit status message for header bar ------------------

    $scope.editStatus = '';

    $scope.LAST_UPDATED = '';
    $scope.READ_ONLY = 'View only';
    $scope.SAVING = 'Saving...';
    $scope.SAVE_OK = 'All changes saved';
    $scope.SAVE_FAILED = 'Changes could not be saved';

    $scope.updateEditStatus = function(s) {
        //console.log('updateEditStatus: ' + s);
        $scope.editStatus = s;
        if (s == $scope.SAVE_FAILED) {
            alert('Changes could not be saved - please check your network connection.');
        } else if (s == $scope.LAST_UPDATED) {
            var time = moment($scope.updatedAt).fromNow();
            var by = '';
            if ($scope.updatedBy == $scope.userId) {
                by = 'by me';
            } else if ($scope.updatedByName) {
                by = 'by ' + $scope.updatedByName;
            }
            // TODO: show 'by me' only for editable shared maps?

            $scope.editStatus = 'Last updated ' + time + ' ' + by;
        }

        // Last edit was XX ago by YY
    };


    // -------------------------------------------------------------

    function init() {
        $scope.safeApply(function() {
            $scope.map.init();

            if (!$scope.sandbox) {
                // overview diagram
                var overview = go.GraphObject.make(go.Overview, "overview-diagram", {
                    observed: $scope.map.getDiagram(),
                    contentAlignment: go.Spot.Center
                });
                var outline = overview.box.elements.first();
                outline.stroke = "#333";
            }

            //if ($scope.mapUrl) {
                $scope.map.load();
            //} else {
            //    $scope.map.loadForSandbox();
            //}

            addBehaviors();
            handleNavigation();
            handleBackspace();
        });
    }

    // misc. UI behaviors for tooltips, popups etc.
    // TODO: figure out which of these need to be reapplied after dynamic data changes (e.g. LessonBook popovers)
    function addBehaviors() {

        // NOTE: we have to use regular bootstrap tooltips for toolbar buttons (instead of ng-bootstrap ones)
        // so we can turn them off for mobile. We also put the tooltips on wrappers rather than on the actual 
        // buttons, so we can avoid the issue of stuck tooltips if a button gets disabled while the tooltip is showing.

        if (!$scope.isTouchDevice()) {
            // $('.tooltip-wrapper').tooltip({
            //     placement: 'top',
            //     container: 'body'
            // });

            // $('.dropdown-menu .btn').tooltip({
            //     placement: 'left',
            //     container: 'body'
            // }); // for layout options

            $('header, #map-title').hover(
                function() {
                    $('body.presenter-playing').addClass('hide-header');
                },
                function() {
                    $('body.presenter-playing').removeClass('hide-header');
                }
            );
        }
    }

    function handleNavigation() {
        // cross-browser tweaks:
        try {
            // http://www.opera.com/support/kb/view/827/
            opera.setOverrideHistoryNavigationMode('compatible');
            history.navigationMode = 'compatible';
        } catch (e) {
            // no biggie.
        }

        // install before-unload handler:

        function exitMessage() {
            return "Navigating away from your Map will cause any unsaved changes to be lost " +
                "(any changes you make are automatically saved, but it takes a couple of seconds).";
        }

        //        $(window).bind('beforeunload', exitMessage);

        // prevent exit prompt when the user deliberately navigates away:

        $('#header-right a').click(function() {
            $(window).unbind('beforeunload', exitMessage);
        });
    }

    function handleBackspace() {
        var BACKSPACE = 8;

        $(document).on('keydown', function(event) {
            if (event.keyCode === BACKSPACE) {
                if (!$('body :focus').is(':input')) {
                    // prevent accidental backspace when no input has focus:
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });
    }

    init();
};

window.MapEditorCtrl.$inject = ['$rootScope', '$scope', '$http', '$resource', '$timeout', '$modal', '$log'];