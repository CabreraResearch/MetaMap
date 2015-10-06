const riot = require('riot');
const NProgress = window.NProgress;
const Canvas = require('../../canvas/canvas');
require('./node')

const html = `
<div class="portlet light jtk-demo-main" style="padding: 0; ">
    <div class="jtk-demo-canvas canvas-wide" id="diagram">

    </div>
</div>
`;

module.exports = riot.tag('meta-canvas', html, function(opts) {

    const MetaMap = require('../../../MetaMap.js');

    this.mapId = null;
    this.canvas = null;

    this.buildCanvas = (map) => {
        if (!this.canvas) {
            $(this.diagram).empty();

            var width = $(this.diagram).width(),
                height =  $(this.diagram).height();

            var xLoc = width/2 - 25,
                yLoc = 100;

            this.canvas = new Canvas(map, this.mapId);
            this.canvas.init();

            this.update();


        } else {
            if (map.changed_by != MetaMap.User.userKey) {
                this.canvas.init();
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
            height: window.innerHeight - 120 + 'px'
        });
    }

    this.on('update', () => {
        this.correctHeight();
    });

    $(window).resize(() => {
        this.correctHeight();
    });
});