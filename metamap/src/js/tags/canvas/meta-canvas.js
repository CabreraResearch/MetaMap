const riot = require('riot');
const NProgress = window.NProgress;
const Editor = require('../../canvas/canvas');
const d3 = require('d3')

const html = `
<div class="portlet light">
    <div id="toolbox">
        <input type="file" id="hidden-file-upload"/>
        <a id="upload-input" title="upload graph""><i class="fa fa-cloud-upload"></i></a>
        <a id="download-input" title="download graph"><i class="fa fa-cloud-download"></i></a>
        <a id="delete-graph" title="delete graph"><i class="fa fa-trash-o"></i></a>
    </div>
    <div class="portlet-body" id="diagram">

    </div>
</div>

<style scoped>
#toolbox{
    position: fixed;
    bottom: 40px;
    left: 280px;
    margin-bottom: 0.5em;
    margin-left: 1em;
    border: 2px solid #EEEEEE;
    border-radius: 5px;
    padding: 1em;
    z-index: 5;
}

#toolbox input{
    width: 30px;
    opacity: 0.4;
}
#toolbox input:hover{
    opacity: 1;
    cursor: pointer;
}

#hidden-file-upload{
    display: none;
}

#download-input{
    margin: 0 0.5em;
}

.conceptG text{
    pointer-events: none;
}

marker{
    fill: #333;
}

g.conceptG circle{
    fill: #F6FBFF;
    stroke: #333;
    stroke-width: 2px;
}

g.conceptG:hover circle{
    fill: rgb(200, 238, 241);
}

g.selected circle{
    fill: rgb(250, 232, 255);
}
g.selected:hover circle{
    fill: rgb(250, 232, 255);
}

path.link {
    fill: none;
    stroke: #333;
    stroke-width: 6px;
    cursor: default;
}

path.link:hover{
    stroke: rgb(94, 196, 204);
}

g.connect-node circle{
    fill: #BEFFFF;
}

path.link.hidden{
    stroke-width: 0;
}

path.link.selected {
    stroke: rgb(229, 172, 247);
}
</style>
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

            // initial node data
            var nodes = [{title: "new concept", id: 0, x: xLoc, y: yLoc},
                        {title: "new concept", id: 1, x: xLoc, y: yLoc + 200}];
            var edges = [{source: nodes[1], target: nodes[0]}];


            /** MAIN SVG **/
            var svg = d3.select(this.diagram).append("svg")
                .attr('width', width)
                .attr('height', height);

            var graph = new Editor(svg, nodes, edges);
                graph.setIdCt(2);
            graph.updateGraph();

            this.update();


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