const SandbankEditor = require('./sbEditor');
// functions handling history display

SandbankEditor.History = function($scope, $http, map) {

    var self = this;

    // this is updated on map load and after every autosave, in map.loadMapExtraData
    this.versionList = null;
    this.currentVersion = null; // e.g. { index: 0, id: 2, change_description: ..., created_at: ... }
    this.isPlaying = false;
    this.playTimer = null;

    this.init = function() {};

    // called when a tab is opened or closed
    this.currentTabChanged = function(newValue, oldValue) {
        if (newValue == map.ui().TAB_ID_HISTORY) { // opening tab
            // load current version, but in read-only mode
            var version = _.last(self.versionList);
            if (version) {
                self.loadVersion(version);
            }
        }
        if (oldValue == map.ui().TAB_ID_HISTORY) { // closing tab
            // reload map
            map.load();
        }
    };

    // loads model data for an individual version and displays it
    this.loadVersion = function(version) {
        self.currentVersion = version;
        map.loadVersion(version.id);

        window.setTimeout(function () {
            // center view on current history item:
            $('#history-list-wrapper').center($('#history-list .current'));
        }, 10);
    };

    this.getVersionDescription = function(version) {
        return (version ? version.change_description : '');
    };

    this.advanceVersion = function(increment) {
        if (self.versionList) {
            var currentIndex = _.indexOf(self.versionList, self.currentVersion);
            var newIndex = currentIndex + increment;
            if (currentIndex != -1 && newIndex >= 0 && newIndex <= self.versionList.length - 1) {
                self.currentVersion = self.versionList[newIndex];
                self.loadVersion(self.currentVersion);
            }
        }
    };

    this.firstVersion = function() {
        if (self.versionList) {
            self.currentVersion = self.versionList[0];
            self.loadVersion(self.currentVersion);
        }
    };

    this.lastVersion = function() {
        if (self.versionList) {
            self.currentVersion = self.versionList[self.versionList.length - 1];
            self.loadVersion(self.currentVersion);
        }
    };

    this.isOnFirstVersion = function() {
        // return self.versionList != null && self.currentVersion != null && _.first(self.versionList).id == self.currentVersion.id;
        return self.versionList && _.indexOf(self.versionList, self.currentVersion) === 0;
    };

    this.isOnLastVersion = function() {
        // return self.versionList != null && self.currentVersion != null && _.last(self.versionList).id == self.currentVersion.id;
        return self.versionList && _.indexOf(self.versionList, self.currentVersion) == self.versionList.length - 1;
    };

    this.startPlaying = function() {
        self.isPlaying = true;
        keepPlaying();
        $scope.safeApply();
    };

    function keepPlaying() {
        if (self.currentVersion == _.last(self.versionList)) {
            self.firstVersion();
        }
        else {
            self.advanceVersion(1);
        }
        self.playTimer = setTimeout(keepPlaying, 1000);
    }

    this.stopPlaying = function() {
        self.isPlaying = false;
        clearTimeout(self.playTimer);
        $scope.safeApply();
    };
};
