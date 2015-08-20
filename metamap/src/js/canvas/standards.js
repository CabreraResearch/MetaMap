const SandbankEditor = require('./sbEditor');
// common core standards tab -
// this is delegated to the SandbankCcsTagging module, which handles CCS 
// for a map OR the user profile - see tagging_ccs.js

SandbankEditor.Standards = function ($scope, map) {

    var self = this;

    this.init = function () {
    };

    // called when a tab is opened or closed
    this.currentTabChanged = function(newValue, oldValue) {
        if (newValue == map.ui().TAB_ID_STANDARDS) { // opening tab
            // if there are no links, show the modal
            if ($scope.canEdit && !$scope.ccsTagging.links.length) {
                $scope.ccsTagging.addLink();                
            }
        }
        if (oldValue == map.ui().TAB_ID_STANDARDS) { // closing tab
        }
    };
};