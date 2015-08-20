const SandbankEditor = require('./sbEditor');

// functions handling attachments

SandbankEditor.Attachments = function ($scope, $http, $resource, map) {

    var self = this;

    this.selectedThing = null;
    this.attachments = null;

    this.attachmentTypes = [
        {name: 'note', labelSingular: 'Note', labelPlural: 'Notes'}, 
        {name: 'link', labelSingular: 'Web Link', labelPlural: 'Web Links'}, 
        {name: 'task', labelSingular: 'Task', labelPlural: 'Tasks'}, 
        {name: 'map', labelSingular: 'Linked MetaMap', labelPlural: 'Linked MetaMaps'}
//        {name: 'doc', labelSingular: 'Document', labelPlural: 'Documents'}  // limit overall storage space OR simpler rules?
        // limit file types - pdf, jpg, gif, png, office?...  whitelist vs. blacklist
    ];

    this.init = function () {
    };

    this.handleDiagramEvent = function (eventName, e) {
        if (eventName == 'ChangedSelection') {
            if (map.ui.currentTabIs(map.ui.TAB_ID_ATTACHMENTS)) {
                self.stopEditingAll();
                self.saveAttachments();
                self.loadSelectedThingAttachments();
            }
        }
    };

    // called when a tab is opened or closed
    this.currentTabChanged = function(newValue, oldValue) {
        if (newValue == map.ui.TAB_ID_ATTACHMENTS) { // opening tab
            self.loadSelectedThingAttachments();
        }
        if (oldValue == map.ui.TAB_ID_ATTACHMENTS) { // closing tab
            self.saveAttachments();
        }
    };

    this.loadSelectedThingAttachments = function() {
        $scope.safeApply(function() {
            if (map.thingSelected()) {
                self.selectedThing = map.getUniqueThingSelected();
                self.attachments = self.selectedThing.data.attachments;
                if (self.attachments === undefined) {
                    self.attachments = [];
                }
            }
        });
    };

    // set all attachments to editing = false
    this.stopEditingAll = function() {
        $scope.safeApply(function() {
            if (self.attachments) {
                _.each(self.attachments, function (att) { att.editing = false; });
            }
        });
    };

    this.editingAnItem = function() {
        return self.attachments && _.findWhere(self.attachments, {editing: true}) !== undefined;
    };

    // set all other attachments to editing = false
    this.startEditing = function(attachment) {
        $scope.safeApply(function() {
            self.stopEditingAll();
            attachment.editing = true;
        });
    };

    this.saveItem = function(attachment) {
        $scope.safeApply(function() {
            attachment.editing = false;
            self.saveAttachments();
        });
    };

    this.saveAttachments = function() {
        $scope.safeApply(function() {
            //console.log('saveAttachments, selected: ' + self.selectedThing);
            if (self.selectedThing) {
                map.diagram.model.setDataProperty(self.selectedThing.data, 'attachments', self.attachments);
                self.selectedThing.updateTargetBindings();
            }
            map.autosave.saveNow('edit_attachments');
        });
    };

    this.listAttachments = function (type) {
        var atts = _.where(self.attachments, {type: type});
        return atts;
    };

    this.addAttachment = function (type) {
        var item = { type: type, editing: true };
        if (type == 'note') {
            self.attachments.push(_.extend(item, { text: '', url: '' }));
        }
        else if (type == 'link') {
            self.attachments.push(_.extend(item, { label: '', url: '' }));
        }
        else if (type == 'task') {
            self.attachments.push(_.extend(item, { text: '' }));
        }
        else if (type == 'doc') {
            self.attachments.push(_.extend(item, { name: '' }));
        }
        else if (type == 'map') {
            self.attachments.push(_.extend(item, { mapRef: { id: 0, name: ''  } }));
        }
    };

    this.isValid = function(attachment) {
        if (attachment.type == 'link') {
            return attachment.label && attachment.url && attachment.label.trim() !== '' && attachment.url.trim() !== '';
        }
        else if (attachment.type == 'note') {
            return attachment.text && attachment.text.trim() !== '';
        }
        else if (attachment.type == 'task') {
            return attachment.text && attachment.text.trim() !== '';
        }
        else if (attachment.type == 'doc') {
            return attachment.name && attachment.name.trim() !== '';
        }
        else if (attachment.type == 'map') {
            return attachment.mapRef && attachment.mapRef.id !== null && attachment.mapRef.id !== undefined;
        }
    };

    this.deleteAttachment = function (att) {
        var typeLabel = _.findWhere(self.attachmentTypes, { name: att.type }).labelSingular;
        if (confirm ('Delete ' + typeLabel + '?')) {
            var i = _.indexOf(self.attachments, att);
            self.attachments.splice(i, 1);
        }
    };

    // query server for maps containing the given text in the map name
    this.getOtherMaps = function(viewValue) {
        // NB: this URL is constructed to match the one generated by the search form on the maps page...
        var url = '/maps/visible_maps.json?utf8=%E2%9C%93&q%5Bname_cont%5D=' + viewValue;
        return $http.get(url).then(function(response) {
            return response.data.maps;
        });
    };

    this.otherMapSelected = function(viewValue, modelValue) {
        //console.log('otherMapSelected, viewValue: ' + viewValue.id + ', modelValue: ' + modelValue);
    };

    this.formatOtherMap = function (model) {
        return (model ? model.name : '');
    };

};