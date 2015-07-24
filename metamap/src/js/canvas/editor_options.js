window.SandbankEditorOptions = {};

SandbankEditorOptions = function($scope, $http, $resource, $modal, $log) {

    this.openModal = function(options, onSaveDefaults, onUpdate) {
        var modalInstance = $modal.open({
            templateUrl: 'template_editor_options_modal.html', // see views/maps/_template_editor_options_modal
            backdrop: 'static',
            controller: optionsModalCtrl,
            windowClass: 'options-modal',
            resolve: {
                options: function() {
                    return options;
                },
                onSaveDefaults: function() {
                    return onSaveDefaults;
                },
                onUpdate: function() {
                    return onUpdate;
                }
            }
        });

        modalInstance.result.then(function() {});
    };


    // --------------- controller for options modal ---------------------

    var optionsModalCtrl = function($scope, $modalInstance, options, onSaveDefaults, onUpdate) {

        $scope.options = options;

        $scope.setDefaults = {
            value: false
        };

        $scope.ok = function() {
            onUpdate($scope.options);
            if ($scope.setDefaults.value) {
                onSaveDefaults($scope.options);
            }
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

    optionsModalCtrl.$inject = ['$scope', '$modalInstance', 'options', 'onSaveDefaults', 'onUpdate'];
};