// functions handling editor autosave function

SandbankEditor.Autosave = function($scope, map) {

    var self = this;

    var $http = {
        put: () => {
            return new Promise((fulfill, reject) => {});
        }
    };

    var changeTypes = [];

    this.saveOnModelChanged = true;

    // do a save next time the set interval passes with no save requests
    this.save = function(changeType) {
        changeTypes.push(changeType);
        delayedAutosave();
    };

    // do a save right now
    this.saveNow = function(changeType) {
        changeTypes.push(changeType);
        autosave();
    };

    // don't let autosave be triggered more than every N milliseconds...
    var delayedAutosave = _.debounce(autosave, 2000);

    // compile the current list of change type descriptions, process them 
    // to remove duplicates, and save the current data
    function autosave() {
        // stop right here if we're in the sandbox and/or we don't have edit permissions
        if ($scope.sandbox || !$scope.canEdit) {
            return;
        }

        if (!changeTypes.length) {
            console.log('autosave: nothing to save!'); // shouldn't happen
            return;
        }

        // de-dupe the list of change types
        var changeList = _.uniq(changeTypes);
        //console.log('changeList: ' + changeList);
        // don't show move events unless that's all we have
        var changeListWithoutMoves = _.without(changeList, 'move');
        if (changeListWithoutMoves.length > 0) {
            changeList = changeListWithoutMoves;
        }
        //console.log('changeList without moves: ' + changeList);
        // get descriptions
        var descriptionList = _.map(changeList, function(ct) {
            return _.result(changeDescriptions, ct);
        });

        //console.log('autosave, changeList: ' + changeList + ', descriptionList: ' + descriptionList);
        var postData = {
            "name": $scope.mapTitle,
            "data": map.getDiagram().model.toJson(),
            "state_data": JSON.stringify(map.getUi().getStateData()),
            "editor_options": JSON.stringify(map.getUi().getMapEditorOptions()),
            "presenter_slides": map.getPresenter().getSlideCount(),
            "activity_slides": map.getPresenter().getActivitySlideCount(),
            "change_type": changeList.join(';'),
            "change_description": descriptionList.join('; '),
            "thumbnail_png": map.getPresenter().getMapThumbnail()
        };
        var url = $scope.mapUrl + '.json';

        $scope.updateEditStatus($scope.SAVING);
        $http.put(url, postData).then(
            function(response) {
                changeTypes = [];
                $scope.updateEditStatus($scope.SAVE_OK);
                // load returned data for analytics, points, badges, versions
                $scope.map.loadMapExtraData(response.data.map);
            },
            function() {
                $scope.updateEditStatus($scope.SAVE_FAILED);
            });
    }



    // -------------- handle model changes - trigger autosave ------------------

    var changeDescriptions = {
        move: 'Moved Objects',
        undo_redo: 'Performed Undo/Redo',
        edit_title: 'Edited MetaMap Title',
        edit_description: 'Edited MetaMap Description',
        edit_usertags: 'Edit MetaMap Tags',
        edit_d: 'Edited Distinctions',
        edit_s: 'Edited Systems',
        edit_r: 'Edited Relationships',
        edit_p: 'Edited Perspectives',
        add_thing: 'Added Ideas',
        rename_thing: 'Renamed Ideas',
        delete_thing: 'Deleted Ideas',
        edit_attachments: 'Edited Attachments',
        edit_presenter: 'Edited Presenter Slides',
        edit_generator: 'Inserted Ideas from ThinkQuery',
        edit_standards: 'Edited Links to Common Core Standards'
    };

    // e is a go.ChangedEvent
    this.modelChanged = function(e) {

        if (!self.saveOnModelChanged) {
            return;
        }

        var changeType = null;
        var changeDescription = null;

        if (e.propertyName == 'type') {
            // change R type
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,n,1,o,2,A,3,r,4,r,5,o,6,w,7,s] , newParam: null, newValue: [0,t,1,o] , propertyName: type
            changeType = 'edit_r';
            changeDescription = 'Changed Relationship Types';
        } else if (e.propertyName == 'layout') {
            // change system layout
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,l,1,e,2,f,3,t] , newParam: null, newValue: [0,r,1,i,2,g,3,h,4,t] , propertyName: layout 
            changeType = 'edit_s';
        } else if (e.change == go.ChangedEvent.Insert && propertyEquals(e.newValue, 'fromPort', 'R')) {
            // add link
            // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 1, newValue: [type,noArrows,__gohashid,6005,from,-2,to,-4,labelKeys,,fromPort,R,toPort,P] , propertyName: linkDataArray
            // modelChange: linkToPortId, change: ChangedEvent.Property, oldParam: null, oldValue: [0,P] , newParam: null, newValue: [0,R] , propertyName: toPort 
            changeType = 'edit_r';
        } else if (e.change == go.ChangedEvent.Remove && propertyEquals(e.oldValue, 'fromPort', 'R')) {
            // delete link
            // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 1, oldValue: [type,noArrows,__gohashid,6005,from,-2,to,-4,labelKeys,,fromPort,R,toPort,R] , newParam: null, newValue: [] , propertyName: linkDataArray 
            changeType = 'edit_r';
        } else if (e.propertyName == 'linkDataArray') {
            // change P/D links
            // add P link
            // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 2, newValue: [type,noArrows,__gohashid,19122,from,-2,to,-4,labelKeys,,fromPort,P,toPort,P] , propertyName: linkDataArray 
            // modelChange: linkCategory, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,P] , propertyName: category 
            // delete P link
            // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 2, oldValue: [type,noArrows,__gohashid,19122,from,-2,to,-4,labelKeys,,fromPort,P,toPort,P,category,P] , newParam: null, newValue: [] , propertyName: linkDataArray 
            // add D link
            // modelChange: linkDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 1, newValue: [from,-7,to,-5,fromPort,D,toPort,D,category,D,__gohashid,19522] , propertyName: linkDataArray 
            // remove D link
            // modelChange: linkDataArray, change: ChangedEvent.Remove, oldParam: 1, oldValue: [from,-7,to,-5,fromPort,D,toPort,D,category,D,__gohashid,19522] , newParam: null, newValue: [] , propertyName: linkDataArray 

            if ((e.newValue && e.newValue.category == 'P') ||
                (e.oldValue && e.oldValue.category == 'P')) {
                changeType = 'edit_p';
            } else if ((e.newValue && e.newValue.category == 'D') ||
                (e.oldValue && e.oldValue.category == 'D')) {
                changeType = 'edit_d';
            }
        } else if (e.propertyName == 'category') {
            // add P link
            // modelChanged, modelChange: linkCategory, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,P] , propertyName: category 
            changeType = 'edit_p';
        } else if (e.propertyName == 'group') {
            // drag into S
            // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group 
            // reorder part
            // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group 
            // drag to D
            // modelChanged, modelChange: nodeGroupKey, change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: group 

            changeType = 'edit_s';
        } else if (e.propertyName == 'nodeDataArray' && e.change == go.ChangedEvent.Insert && propertyEquals(e.newValue, 'isGroup', true)) {
            // add thing
            // modelChange: nodeDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 5, newValue: [text,New Idea,isGroup,true,level,0,layout,left,sExpanded,true,pExpanded,false,dExpanded,false,__gohashid,54688,group,,key,-7] , propertyName: nodeDataArray 
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [0,2,1,2,2,8,3,.,4,5,5,6,6,2,7,5,8, ,9,-,10,1,11,4,12,9,13,.,14,6,15,8,16,7,17,5] , propertyName: loc 
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: children 
            changeType = 'add_thing';
        } else if (e.propertyName == 'text') {
            // move thing
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,b,1,b,2,b,3,b,4,b] , newParam: null, newValue: [0,a,1,a,2,a,3,a,4,a] , propertyName: text 
            changeType = 'rename_thing';
            changeDescription = 'Renamed Ideas';
        } else if (e.propertyName == 'nodeDataArray' && e.change == go.ChangedEvent.Remove && propertyEquals(e.oldValue, 'isGroup', true)) {
            // delete thing
            // modelChange: nodeDataArray, change: ChangedEvent.Remove, oldParam: 5, oldValue: [text,New Idea,isGroup,true,level,0,layout,left,sExpanded,true,pExpanded,false,dExpanded,false,__gohashid,54688,group,,key,-7,loc,228.5625 -149.6875,children,0,attachments,] , newParam: null, newValue: [] , propertyName: nodeDataArray 
            changeType = 'delete_thing';
        } else if (e.propertyName == 'nodeDataArray' && e.change == go.ChangedEvent.Insert && propertyEquals(e.newValue, 'isGroup', false)) {
            // add slide
            // modelChange: nodeDataArray, change: ChangedEvent.Insert, oldParam: null, oldValue: [] , newParam: 5, newValue: [key,slide-0,category,slide,index,0,isGroup,false,width,200,height,200,loc,156.5625 -97.6875,level,0,children,0,title,,notes,,__gohashid,63877] , propertyName: nodeDataArray 
            changeType = 'edit_presenter';
        } else if (e.propertyName == 'nodeDataArray' && e.change == go.ChangedEvent.Remove && propertyEquals(e.oldValue, 'isGroup', false)) {
            // delete slide
            //modelChange: nodeDataArray, change: ChangedEvent.Remove, oldParam: 5, oldValue: [key,slide-0,category,slide,index,0,isGroup,false,width,200,height,200,loc,156.5625 -97.6875,level,0,children,0,title,,notes,,__gohashid,63877,$$hashKey,0XN] , newParam: null, newValue: [] , propertyName: nodeDataArray 
            changeType = 'edit_presenter';
        } else if (e.propertyName == 'loc' || e.propertyName == 'width' || e.propertyName == 'height') {
            // move thing or resize slide
            // move slide
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,2,1,4,2,3,3, ,4,-,5,1,6,2,7,8] , newParam: null, newValue: [0,2,1,4,2,3,3, ,4,-,5,1,6,2,7,7] , propertyName: loc 
            // resize slide
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [] , newParam: null, newValue: [] , propertyName: height 
            // move thing
            // modelChange: , change: ChangedEvent.Property, oldParam: null, oldValue: [0,4,1,7,2,9,3,.,4,8,5,7,6,5,7, ,8,-,9,1,10,2,11,2,12,.,13,8,14,7,15,5] , newParam: null, newValue: [0,5,1,4,2,0,3,.,4,3,5,1,6,2,7,5,8, ,9,-,10,1,11,2,12,1,13,.,14,1,15,8,16,7,17,5] ,             
            changeType = 'move';
        } else if (e.propertyName == 'level' || e.propertyName == 'children') {
            // these attributes are updated as a result of other actions; ignore
            changeType = null;
        } else if (e.propertyName == 'attachments') {
            // edited attachments
            changeType = 'edit_attachments';
        } else if (e.propertyName == 'sExpanded' || e.propertyName == 'pExpanded') {
            // ignore expand/collapse
            changeType = 'move';
        } else if (e.propertyName == 'FinishedUndo' || e.propertyName == 'FinishedRedo') {
            changeType = 'undo_redo';
            map.refresh();
        } else if (e.change != go.ChangedEvent.Transaction) {
            console.log('modelChanged, modelChange: ' + e.modelChange +
                ', change: ' + e.change +
                ', oldParam: ' + e.oldParam +
                ', oldValue: [' + _.pairs(e.oldValue) + '] ' +
                ', newParam: ' + e.newParam +
                ', newValue: [' + _.pairs(e.newValue) + '] ' +
                ', propertyName: ' + e.propertyName
            );
        }

        if (changeType) {
            map.getAnalytics().updateContextualAnalytics();
            //console.log('calling delayedAutosave, changeType: ' + changeType);
            self.save(changeType);
        }
    };

    // convenience function for checking properties
    function propertyEquals(obj, key, value) {
        return obj !== null && _.has(obj, key) && _.result(obj, key) == value;
    }


};