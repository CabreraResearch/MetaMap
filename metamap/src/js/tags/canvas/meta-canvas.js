const riot = require('riot');
const NProgress = window.NProgress;
const editor = require('../../canvas/editor');
const html = `
<div class="portlet light">
    <div class="portlet-body" id="diagram"></div>
</div>
<div id="overview-diagram" style="display: none;"></div>
`;

module.exports = riot.tag('meta-canvas', html, function(opts) {

    const MetaMap = require('../../../MetaMap.js');

    this.mapId = null;
    this.canvas = null;

    this.buildCanvas = (map) => {
        if (!this.canvas) {
            $(this.diagram).empty();
            $(this['overview-diagram']).empty();

            var x = {
                mapId: this.mapId,
                ccsTagging: {},
                safeApply: function(fn, ...params) {
                    if (fn) {
                        fn(...params);
                    }
                },
                $watch: function() {},
                get: function() { return { then: function() {} } },
                isTouchDevice: function() { return false; }
            }

            this.update();

            x.mapData = map;
            map.metadata = {
                sandbox: null,
                canEdit: true
            };
            map.state_data = {
                "showNavigator": false,
                "currentTab": null,
                "perspectivePointKey": null,
                "distinctionThingKey": null
            }
            map.editor_options = {
                "defaultRelationshipDirection": "noArrows",
                "defaultThingLayout": "left",
                "perspectiveMode": "lines"
            }

            this.canvas = MapEditorCtrl(x, x, x, x, x);
        } else {
            if (map.changed_by != MetaMap.User.userKey) {
                this.canvas.map.load(map.data)
            }
        }
        NProgress.done();
    }

    this.build = (opts) => {
        if (opts.id != this.mapId) {
            this.canvas = null
            if (this.mapId) {
                MetaMap.MetaFire.off(`maps/data/${this.mapId}`);
            }
            this.mapId = opts.id;
            NProgress.start();

            MetaMap.MetaFire.on(`maps/data/${opts.id}`, this.buildCanvas);
            MetaMap.Eventer.forget('map', this.build);
        }
    }

    MetaMap.Eventer.every('map', this.build);

    this.correctHeight = () => {
        $(this.diagram).css({
            height: window.innerHeight - 154 + 'px'
        });
    }

    this.on('update', () => {
        this.correctHeight();
    });

    $(window).resize(() => {
        this.correctHeight();
    });
});