// main controller class

window.SandbankEditor = {};

window.MapEditorCtrl = function() {

    let ret = {};

    ret.map = new SandbankEditor.Map(ret);

    // window.mapData is set in _form view
    var metadata = window.mapData.map.metadata;
    ret.sandbox = metadata.sandbox;
    ret.mapData = window.mapData.map.data; // this gets overwritten by load() unless we are in the sandbox with no map ID
    ret.mapId = metadata.id;
    ret.mapTitle = metadata.name;
    ret.mapUserTags = metadata.userTags;
    ret.mapUrl = metadata.url;
    ret.canEdit = metadata.canEdit;
    ret.updatedAt = metadata.updatedAt;
    ret.updatedBy = metadata.updatedBy; // ID
    ret.updatedByName = metadata.updatedByName;

    ret.editingTitle = false;

    ret.showImageExport = false;
    ret.imageExportLoading = true;

    ret.currentTab = null;

    // override parent scope (see user.js) since we're editing a map
    //$scope.ccsTagging.mapId = $scope.mapId;

    ret.maybeStartEditingTitle = function() {
        if (ret.canEdit) {
            ret.editingTitle = true;
        }
    };

    ret.doneEditingTitle = function() {
        //console.log('doneEditingTitle');
        ret.editingTitle = false;
        ret.map.getAutosave().save('edit_title');
    };

    ret.editingTitleKeypress = function(e) {
        if (e.which == 13) {
            ret.doneEditingTitle();
        }
    };

    ret.print = function() {
        window.print();
    };
    
    // ------------- edit status message for header bar ------------------

    ret.editStatus = '';

    ret.LAST_UPDATED = '';
    ret.READ_ONLY = 'View only';
    ret.SAVING = 'Saving...';
    ret.SAVE_OK = 'All changes saved';
    ret.SAVE_FAILED = 'Changes could not be saved';

    ret.updateEditStatus = function(s) {
        //console.log('updateEditStatus: ' + s);
        ret.editStatus = s;
        if (s == ret.SAVE_FAILED) {
            alert('Changes could not be saved - please check your network connection.');
        } else if (s == ret.LAST_UPDATED) {
            var time = moment(ret.updatedAt).fromNow();
            var by = '';
            if (ret.updatedBy == ret.userId) {
                by = 'by me';
            } else if (ret.updatedByName) {
                by = 'by ' + ret.updatedByName;
            }
            // TODO: show 'by me' only for editable shared maps?

            ret.editStatus = 'Last updated ' + time + ' ' + by;
        }

        // Last edit was XX ago by YY
    };


    // -------------------------------------------------------------

    function init() {
        ret.map.init();

        if (!ret.sandbox) {
            // overview diagram
            //var overview = go.GraphObject.make(go.Overview, "overview-diagram", {
            //    observed: $scope.map.getDiagram(),
            //    contentAlignment: go.Spot.Center
            //});
            //var outline = overview.box.elements.first();
            //outline.stroke = "#333";
        }

        if (ret.mapUrl) {
            ret.map.load();
        } else {
            ret.map.loadForSandbox();
        }

        ret.addBehaviors();
        ret.handleNavigation();
        ret.handleBackspace();
    }

    // misc. UI behaviors for tooltips, popups etc.
    // TODO: figure out which of these need to be reapplied after dynamic data changes (e.g. LessonBook popovers)
    ret.addBehaviors = function() {

        // NOTE: we have to use regular bootstrap tooltips for toolbar buttons (instead of ng-bootstrap ones)
        // so we can turn them off for mobile. We also put the tooltips on wrappers rather than on the actual 
        // buttons, so we can avoid the issue of stuck tooltips if a button gets disabled while the tooltip is showing.

        //if (!ret.isTouchDevice()) {
        //    // $('.tooltip-wrapper').tooltip({
        //    //     placement: 'top',
        //    //     container: 'body'
        //    // });

        //    // $('.dropdown-menu .btn').tooltip({
        //    //     placement: 'left',
        //    //     container: 'body'
        //    // }); // for layout options

        //    $('header, #map-title').hover(
        //        function() {
        //            $('body.presenter-playing').addClass('hide-header');
        //        },
        //        function() {
        //            $('body.presenter-playing').removeClass('hide-header');
        //        }
        //    );
        //}
    }

    ret.handleNavigation = function() {
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

    ret.handleBackspace = function() {
        var BACKSPACE = 8;

        $(document).on('keydown', function(event) {
            if (event.keyCode == BACKSPACE) {
                if (!$('body :focus').is(':input')) {
                    // prevent accidental backspace when no input has focus:
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });
    }

    ret.safeApply = function (fn) {
        if (fn && (typeof (fn) == 'function')) {
            fn();
        }
    };

    ret.isTouchDevice = function () {
        return false;
    };

    init();

    return ret;
};