const editStatus = require('../constants/editStatus.js');
const common = require('../tools/Common.js');
const BACKSPACE = 8;
const Map = require('./Map.js');

class Editor {

    constructor(mapData) {
        this.mapData = mapData;
        let metadata = mapData.map.metadata;
        this.sandbox = metadata.sandbox;
        this.mapData = window.mapData.map.data; // this gets overwritten by load() unless we are in the sandbox with no map ID
        this.mapId = metadata.id;
        this.mapTitle = metadata.name;
        this.mapUserTags = metadata.userTags;
        this.mapUrl = metadata.url;
        this.canEdit = metadata.canEdit;
        this.updatedAt = metadata.updatedAt;
        this.updatedBy = metadata.updatedBy; // ID
        this.updatedByName = metadata.updatedByName;
        this.editingTitle = false;
        this.editStatus = '';

        this.showImageExport = false;
        this.imageExportLoading = true;

        this.currentTab = null;

        // override parent scope (see user.js) since we're editing a map
        //this.ccsTagging.mapId = this.mapId;

        this.map = new Map({ Editor: this });
        
        if (!this.sandbox) {
            // overview diagram
            //let overview = go.GraphObject.make(go.Overview, "overview-diagram", {
            //    observed: this.map.getDiagram(),
            //    contentAlignment: go.Spot.Center
            //});
            //let outline = overview.box.elements.first();
            //outline.stroke = "#333";
        }

        if (this.mapUrl) {
            this.map.load();
        } else {
            this.map.loadForSandbox();
        }

        this.addBehaviors();
        this.handleNavigation();
        this.handleBackspace();

    }

    maybeStartEditingTitle() {
        if (this.canEdit) {
            this.editingTitle = true;
        }
    }

    doneEditingTitle() {
        //console.log('doneEditingTitle');
        this.editingTitle = false;
        this.map.getAutosave().save('edit_title');
    }

    editingTitleKeypress(e) {
        if (e.which === 13) {
            this.doneEditingTitle();
        }
    }

    print() {
        window.print();
    }

    // ------------ save sandbox map (sign up/sign in) ---------------

    saveSandboxMap() {
        let modalInstance = $modal.open({
            templateUrl: 'template_sandbox_save_modal.html', // see views/users/_template_sandbox_save_modal
            backdrop: 'static',
            controller: this.sandboxSaveModalCtrl,
            windowClass: 'sandbox-save-modal',
            resolve: {
                outerScope: () => {
                    return this;
                },
                map: () => {
                    return this.map;
                },
                userProfile: () => {
                    return this.userProfile;
                }
            }
        });

        modalInstance.result.then(() => { });
    }

    updateEditStatus(s) {
        //console.log('updateEditStatus: ' + s);
        this.editStatus = s;
        if (s === editStatus.SAVE_FAILED) {
            alert('Changes could not be saved - please check your network connection.');
        } else if (s === editStatus.LAST_UPDATED) {
            let time = moment(this.updatedAt).fromNow();
            let by = '';
            if (this.updatedBy === this.userId) {
                by = 'by me';
            } else if (this.updatedByName) {
                by = 'by ' + this.updatedByName;
            }
            // TODO: show 'by me' only for editable shared maps?

            this.editStatus = 'Last updated ' + time + ' ' + by;
        }

        // Last edit was XX ago by YY
    }

    // misc. UI behaviors for tooltips, popups etc.
    // TODO: figure out which of these need to be reapplied after dynamic data changes (e.g. LessonBook popovers)
    addBehaviors() {

        // NOTE: we have to use regular bootstrap tooltips for toolbar buttons (instead of ng-bootstrap ones)
        // so we can turn them off for mobile. We also put the tooltips on wrappers rather than on the actual 
        // buttons, so we can avoid the issue of stuck tooltips if a button gets disabled while the tooltip is showing.

        if (!common.isTouchDevice()) {
            // $('.tooltip-wrapper').tooltip({
            //     placement: 'top',
            //     container: 'body'
            // });

            // $('.dropdown-menu .btn').tooltip({
            //     placement: 'left',
            //     container: 'body'
            // }); // for layout options

            $('header, #map-title').hover(
                () => {
                    $('body.presenter-playing').addClass('hide-header');
                },
                () => {
                    $('body.presenter-playing').removeClass('hide-header');
                }
            );
        }
    }

    handleNavigation() {
        // cross-browser tweaks:
        try {
            // http://www.opera.com/support/kb/view/827/
            opera.setOverrideHistoryNavigationMode('compatible');
            history.navigationMode = 'compatible';
        } catch (e) {
            // no biggie.
        }

        // install before-unload handler:

        let exitMessage = () => {
            return "Navigating away from your Map will cause any unsaved changes to be lost " +
                "(any changes you make are automatically saved, but it takes a couple of seconds).";
        }

        //        $(window).bind('beforeunload', exitMessage);

        // prevent exit prompt when the user deliberately navigates away:

        $('#header-right a').click( () => {
            $(window).unbind('beforeunload', exitMessage);
        });
    }

    handleBackspace() {
        $(document).on('keydown', (event) => {
            if (event.keyCode === BACKSPACE) {
                if (!$('body :focus').is(':input')) {
                    // prevent accidental backspace when no input has focus:
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });
    }

}

module.exports = Editor;