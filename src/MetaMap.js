var MetaFire = require('./js/integrations/firebase');
var Auth0 = require('./js/integrations/auth0');
var usersnap = require('./js/integrations/usersnap');

class MetaMap {

    constructor () {
        this.MetaFire = new MetaFire();
        this.Auth0 = new Auth0();
        usersnap();
    }

    init() {
        this.Auth0.login().then((profile) => {
            riot.mount('*');
            _.delay(() => {
                Metronic.init(); // init metronic core componets
                Layout.init(); // init layout
                Demo.init(); // init demo features
                Index.init(); // init index page
                Tasks.initDashboardWidget(); // init tash dashboard widget
                var x = { cssTagging: {} }

                window.mapData = { "map": { "metadata": { "sandbox": false, "id": 5547, "name": "Untitled Map", "url": "/maps/5547", "canEdit": true, "updatedAt": "2015-05-15T12:29:40.721-04:00", "updatedBy": null, "updatedByName": null, "userTags": [] }, "data": { "class": "go.GraphLinksModel", "nodeIsLinkLabelProperty": "isLinkLabel", "linkLabelKeysProperty": "labelKeys", "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [{ "key": 1, "text": "New Idea", "isGroup": true, "loc": "0 0", "layout": "left", "sExpanded": true, "pExpanded": true }], "linkDataArray": [] }, "stateData": null, "editorOptions": null, "analytics": {}, "versions": [] }};

                window._userCtrl = UserCtrl(x, x, '', '')
                window._mapEditorCtrl = MapEditorCtrl(x, x, '', '');

            }, 250);
            this.MetaFire.init();
        });
    }

    logout() {
        this.MetaFire.logout();
        this.Auth0.logout();
    }
}

module.exports = MetaMap;