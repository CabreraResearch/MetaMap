SandbankEditor.UI = function($scope, $timeout, $http, $resource, $modal, $log, map) {

    var self = this;

    // ----------- tab ("slider") IDs - tabs are rendered in views/maps/_form --------------
    //this.TAB_ID_HISTORY = 'history-tab';
    this.TAB_ID_PRESENTER = 'presenter-tab';
    this.TAB_ID_ANALYTICS_MAP = 'analytics-tab-map';
    this.TAB_ID_ANALYTICS_THING = 'analytics-tab-thing';
    this.TAB_ID_PERSPECTIVES = 'perspectives-tab';
    this.TAB_ID_DISTINCTIONS = 'distinctions-tab';
    this.TAB_ID_ATTACHMENTS = 'attachments-tab';
    this.TAB_ID_GENERATOR = 'generator-tab';
    this.TAB_ID_STANDARDS = 'standards-tab';

    this.init = function() {};

    // ------------ editor options for map/user ----------

    var mapEditorOptions = {};

    var defaultEditorOptions = {
        // noArrows, to, from, toFrom
        defaultRelationshipDirection: 'noArrows',
        // left, right, stacked, freehand
        defaultThingLayout: 'left',
        // lines, spotlight, both
        perspectiveMode: 'lines'
    };

    // called when map is loaded to set stored options for map
    this.setMapEditorOptions = function(options) {
        mapEditorOptions = options;
    };

    // returns appropriate values from the user profile or the default options if options are not set for the map
    this.getMapEditorOptions = function() {
        var profileOptions = ($scope.userProfile ? $scope.userProfile.editorOptions : null);
        var vals = [mapEditorOptions, profileOptions, defaultEditorOptions];
        mapEditorOptions = _.find(vals, function(val) {
            return !_.isEmpty(val);
        });
        return mapEditorOptions;
    };

    // saves default options for the user (map options are saved in autosave.js)
    function saveUserEditorOptions(options) {
        var data = {
            user: {
                editor_options: JSON.stringify(options)
            }
        };

        startSpinner();
        $http.put('/users/' + $scope.userId + '.json', data).then(
            function(response) {
                stopSpinner();
            },
            function() {
                stopSpinner();
                $scope.profileEditStatus = 'Could not save editor options';
            }
        );
    }

    // options modal

    $scope.editorOptions = new SandbankEditorOptions($scope, $http, $resource, $modal, $log);

    this.editOptions = function() {
        $scope.editorOptions.openModal(
            mapEditorOptions,
            function(options) { // onSaveDefaults
                saveUserEditorOptions(options);
            },
            function(options) { // onUpdate
                mapEditorOptions = options;
                map.getAutosave().saveNow('edit_options');
            }
        );
    };


    // ------------ state model ----------

    this.state = {};

    var defaultState = {
        showNavigator: false,
        currentTab: null,
        perspectivePointKey: null,
        distinctionThingKey: null
    };

    this.setStateData = function(data) {
        $scope.safeApply(function() {
            self.state = data || defaultState;
            //$scope.currentTab = self.state.currentTab;
        });
    };

    // TODO: Save state more frequently?? Currently it is only saved when autosave is triggered by other actions...

    this.getStateData = function() {
        return self.state;
    };

    // ----------- temporary state flags ------------

    this.zoomingToRegion = false;

    this.mouseOverGroup = null;
    this.mouseOverLink = null;

    this.dragTargetGroup = null;
    this.dragTargetPosition = null;

    this.helpTip = null;

    // ----------- handle bottom tabs ("sliders") -------------

    // in the following functions, ID is e.g. 'history-tab' (ID of one of the .bottom-tab's)

    // this is called by map.currentTabChanged, which is triggered by a $scope.$watch
    this.currentTabChanged = function(newValue, oldValue) {
        //console.log('ui, currentTabChanged: ' + newValue);
        self.state.currentTab = newValue;
    };

    this.currentTabIs = function(tabID) {
        return $scope.currentTab == tabID;
    };

    this.openTab = function(tabID) {
        $scope.safeApply(function() {
            $scope.currentTab = tabID;
        });
    };

    this.closeTab = function(tabID) {
        $scope.safeApply(function() {
            self.state.currentTab = null; // TODO: trigger autosave
            $scope.currentTab = null;
        });
    };

    this.disableTab = function(tabID) {
        // prevent opening other tabs when in P or D editor
        if ($scope.currentTab == self.TAB_ID_PERSPECTIVES || $scope.currentTab == self.TAB_ID_DISTINCTIONS) {
            return true;
        }
        return false;
    };

    this.toggleTab = function(tabID) {
        $scope.safeApply(function() {
            if ($scope.currentTab == tabID) {
                $scope.currentTab = null;
            } else if (!self.disableTab(tabID)) {
                $scope.currentTab = tabID;
            }
        });
    };

    this.toggleNavigator = function() {
        $scope.safeApply(function() {
            self.state.showNavigator = !self.state.showNavigator;
        });
    };

    this.toggleZoomingToRegion = function() {
        $scope.safeApply(function() {
            self.zoomingToRegion = !self.zoomingToRegion;
        });
    };


    // ----------------- zooming functions -------------------

    this.canZoomIn = function() {
        return map.getDiagram().scale < 32;
    };

    this.canZoomOut = function() {
        return map.getDiagram().scale > 0.25;
    };

    this.zoomIn = function() {
        var diagram = map.getDiagram();
        if (diagram.scale < 32) {
            var vb = diagram.viewportBounds.copy();
            diagram.scale = diagram.scale * 2;
            diagram.centerRect(vb);
        }
    };

    this.zoomOut = function() {
        var diagram = map.getDiagram();
        if (diagram.scale > 0.25) {
            var vb = diagram.viewportBounds.copy();
            diagram.scale = diagram.scale / 2;
            diagram.centerRect(vb);
        }
    };

    this.maybeZoomToRegion = function() {
        var diagram = map.getDiagram();
        // this flag is set by the toolbar button
        if (self.zoomingToRegion) {
            self.zoomingToRegion = false;
            //console.log('zoomToRegion, selection count: ' + diagram.selection.count);
            var rect = diagram.computePartsBounds(diagram.selection);
            diagram.zoomToRect(rect);
        }
        $scope.safeApply();
    };

    this.resetZoom = function() {
        var diagram = map.getDiagram();
        //var rect = diagram.computePartsBounds(diagram.nodes).copy();
        var rect = map.safeRect(map.computeMapBounds());
        //console.log('resetZoom, bounds: ' + rect);
        if (rect.width) {
            rect.inflate(rect.width / 5, rect.height / 5);
        }
        diagram.zoomToRect(rect);
        diagram.alignDocument(go.Spot.Center, go.Spot.Center);
        if (diagram.scale > 1) {
            diagram.scale = 1;
        }
    };

    // ------------ thing options (layout) ----------------

    this.getSelectedThingsOrDefaultLayout = function() {
        var sl = self.getSelectedThingsLayout();
        if (sl) {
            return sl;
        } else {
            return mapEditorOptions.defaultThingLayout;
        }
    };

    // returns a non-null value only if all selected items are groups with the same layout
    this.getSelectedThingsLayout = function() {
        var diagram = map.getDiagram();
        if (diagram === null || diagram.selection.count < 1)
            return null;

        var layout = null;
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (!it.value instanceof go.Group)
                return null;
            var group = it.value;
            //console.log('getSelectedThingsLayout, it.value: ' + group);
            var groupLayout = (group.data ? group.data.layout : null);
            if (layout !== null && groupLayout != layout)
                return null;
            layout = groupLayout;
        }
        //console.log('getSelectedThingsLayout: ' + layout);

        return layout;
    };

    // sets the layout of all selected things to the given layout
    this.setSelectedThingsLayout = function(layoutName) {
        var diagram = map.getDiagram();
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Group) {
                var group = it.value;
                diagram.model.setDataProperty(group.data, 'layout', layoutName);
                map.getLayouts().setDescendantLayouts(group, group.data.layout);
                map.refresh();
            }
        }
    };

    // ------------ relationship options (direction) ----------------

    this.getSelectedRelationshipsOrDefaultDirection = function() {
        var sd = self.getSelectedRelationshipsDirection();
        if (sd) {
            return sd;
        } else {
            return mapEditorOptions.defaultRelationshipDirection;
        }
    };

    // returns a non-null value only if all selected items are relationships with the same direction
    this.getSelectedRelationshipsDirection = function() {
        var diagram = map.getDiagram();
        if (diagram === null || diagram.selection.count < 1)
            return null;

        var type = null;
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (!it.value instanceof go.Link)
                return null;
            var link = it.value;
            var linkType = (link.data ? link.data.type : null);
            if (type !== null && linkType != type)
                return null;
            type = linkType;
        }

        return type;
    };

    // sets the direction of all selected relationships to the given direction
    this.setSelectedRelationshipsDirection = function(direction) {
        var diagram = map.getDiagram();
        //diagram.model.startTransaction("change relationship direction");
        var it = diagram.selection.iterator;
        while (it.next()) {
            if (it.value instanceof go.Link) {
                //diagram.model.startTransaction("change link type");
                diagram.model.setDataProperty(it.value.data, 'type', direction);
                //diagram.model.commitTransaction("change link type");
            }
        }
        //diagram.commitTransaction("change relationship direction");
    };

    // ------- handle corner clicks and double clicks --------

    var _cornerClicked = null;
    var _cornerFunction = null;
    var _cornerTimeout = 300;

    this.handleCornerClick = function(corner, thing) {
        //console.log('handleCornerClick: corner = ' + corner + ', cornerClicked = ' + _cornerClicked);
        // assume it's a single click, and set handler
        _cornerFunction = getCornerFunction(corner, 1);
        // already clicked, so it's a double click; change handler
        if (_cornerClicked == corner) {
            _cornerFunction = getCornerFunction(corner, 2);
            //console.log('handleCornerClick: double click on ' + corner);
            return;
        }
        // remember that at least one click has happened for the current corner
        _cornerClicked = corner;

        // set timer to invoke whatever handler we have ready to go (unless another click happens within the interval)
        var timer = setTimeout(function() {
            // ding! invoke it
            if (_cornerFunction == self.showCornerTip) {
                _cornerFunction(thing, corner);
            } else {
                _cornerFunction(thing); // don't pass the corner arg to things like createChild that have a different second arg
            }
            // reset handler and clicked flag
            _cornerFunction = getCornerFunction(corner, 1);
            _cornerClicked = null;
        }, _cornerTimeout);
    };

    function getCornerFunction(corner, clicks) {
        if (corner == "D") {
            return (clicks == 1 ? self.showCornerTip : map.createSister);
        } else if (corner == "S") {
            return (clicks == 1 ? map.toggleSExpansion : map.createChild);
        } else if (corner == "R") {
            return (clicks == 1 ? self.showCornerTip : map.createRToSister);
        } else if (corner == "P") {
            return (clicks == 1 ? map.togglePExpansion : map.getPerspectives().setPEditorPoint);
        } else if (corner === "") { // click on text
            return (clicks == 1 ? self.showCornerTip : editText);
        } else {
            return function() {
                //console.log('getCornerFunction: no function found for corner: ' + corner + '!');
            };
        }
    }

    // NB: in this case the thing is actually the TextBox, except in outline layout it is a Panel if the box is double-clicked...
    function editText(thing, corner) {
        if (!$scope.canEdit) {
            return null;
        }

        //console.log('editText, thing: ' + thing);
        if (thing instanceof go.Panel) { // outline layout
            var part = thing.part;
            //console.log('editText, part: ' + part);
            if (part instanceof go.Group && part.data && (part.data.layout == 'left' || part.data.layout == 'right')) {
                var textBlockName = 'externaltext-' + part.data.layout;
                var text = thing.part.findObject(textBlockName);
                if (text) {
                    thing = text;
                }
            }
        }
        map.getDiagram().commandHandler.editTextBlock(thing);
    }


    // ---------------- help tip functions - see also user.js, views/maps/help_tab ---------------

    // shows thingTip or one of the cornerXTips
    this.showCornerTip = function(thing, corner) {
        //console.log('showCornerTip');
        if (corner === '') {
            self.showHelpTip('thingTip');
        } else {
            self.showHelpTip('corner' + corner + 'Tip');
        }
    };

    this.showHelpTip = function(tip) {
        //console.log('showHelpTip: ' + tip);

        // don't show help if in presenter
        if (self.currentTabIs(self.TAB_ID_PRESENTER)) {
            return;
        }

        self.helpTip = tip;
        $scope.safeApply();
        $('#help-tip').show();

        setTimeout(function() {
            $('#help-tip').fadeOut(500, function() {
                self.helpTip = null;
                $scope.safeApply();
            });
        }, 5000);
    };

    // ------------ edit map UserTags ---------------

    $scope.tagging = new SandbankTagging($scope, $http, $resource, $modal, $log);

    this.editUserTags = function() {
        $scope.tagging.openModal(
            [$scope.mapId],
            true, // show description field
            function() {
                map.getAutosave().saveNow('edit_usertags');
            } // on update
        );
    };

    // ------------ edit map sharing ---------------

    $scope.sharing = new SandbankSharing($scope, $http, $resource, $modal, $log);

    this.editMapShares = function() {
        $scope.sharing.openModal(
            [$scope.mapId],
            function() {} // on update
        );
    };

    // ------------ print/export to image ---------------

    this.printSlides = function() {
        startSpinner();
        map.getPresenter().createSlideThumbnails();
        stopSpinner();
        setTimeout(function() {
            window.print();
        }, 500);
    };

    var MILLION = 1000 * 1000;

    this.exportToImage = function(format) {

        $scope.imageExportLoading = true;
        $('#export-image img').remove();
        map.getTemplates().showExportFooter();

        var rect = map.getDiagram().computePartsBounds(map.getDiagram().nodes).copy();

        var imageMB = rect.width * rect.height * 4 / MILLION; // 4 bytes/pixel
        //console.log('imageMB: ' + imageMB);

        // make the max size of the image 10MB
        // pngSize = imageMB * scale * scale
        // so max scale = sqrt(pngSize / imageMB)
        // These calculations don't seem to be right, but in practice using 500 here
        // we get a scale of 2.43 for an image 19984 x 3424 pixels
        // which results in a file size of 1.88 MB at 32 bits/pixel...
        // OR 28380 x 5196 pixels, scale = 3.41 => file size = 3.49 MB
        var scale = 4;
        if (imageMB) {
            scale = Math.min(4, Math.sqrt(50 / imageMB));
        }

        //console.log('image dimensions: ' + rect.width + ' x ' + rect.height + ', image bytes: ' + (rect.width * rect.height * 4) + 
        //        ', imageMB: ' + imageMB + ', scale: ' + scale);

        $scope.showImageExport = true;

        var partsToExport = new go.List();
        partsToExport.addAll(map.getDiagram().nodes);
        partsToExport.addAll(map.getDiagram().links);
        partsToExport.remove(map.getPresenter().slideBlocker);

        var doImage = $timeout(function() {
            var img = map.getDiagram().makeImage({
                parts: partsToExport,
                maxSize: new go.Size((rect.width + 200) * scale, (rect.height + 200) * scale),
                scale: scale,
                padding: 100 * scale,
                background: '#ffffff'
            });

            $('#export-image').append(img);
            $scope.imageExportLoading = false;

            map.getTemplates().hideExportFooter();
        }, 100);
    };

    // --------- utils -------------

    this.splitLines = function(text) {
        return text.split(/\n/);
    };
};