class EditorOptions {

    constructor(user, map) {
        this.user = user;
        this.map = map;
        this.defaultEditorOptions = {
            // noArrows, to, from, toFrom
            defaultRelationshipDirection: 'noArrows',
            // left, right, stacked, freehand
            defaultThingLayout: 'left',
            // lines, spotlight, both
            perspectiveMode: 'lines'
        };
    }
    
    // called when map is loaded to set stored options for map
    setMapEditorOptions(options) {
        this.mapEditorOptions = options;
    }

        // returns appropriate values from the user profile or the default options if options are not set for the map
    getMapEditorOptions() {
        let profileOptions = (this.user.profile ? this.user.profile.editorOptions : null);
        let vals = [this.mapEditorOptions, profileOptions, this.defaultEditorOptions];
        this.mapEditorOptions = _.find(vals, function(val) {
            return !_.isEmpty(val);
        });
        return this.mapEditorOptions;
    }

    editOptions () {
        this.openModal(
            this.mapEditorOptions,
            (options) => { // onSaveDefaults
                this.user.saveUserEditorOptions(options);
            },
            (options) => { // onUpdate
                this.mapEditorOptions = options;
                this.map.autosave.saveNow('edit_options');
            }
        );
    }

    openModal(options, onSaveDefaults, onUpdate) {
        let that = this;
        let modalInstance = $modal.open({
            templateUrl: 'template_editor_options_modal.html', // see views/maps/_template_editor_options_modal
            backdrop: 'static',
            controller: that.optionsModalCtrl,
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
    }


    // --------------- controller for options modal ---------------------
    optionsModalCtrl($scope, $modalInstance, options, onSaveDefaults, onUpdate) {

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
    }
}

module.exports = EditorOptions;