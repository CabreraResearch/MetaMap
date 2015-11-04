const jsPlumb = window.jsPlumb;
const Node = require('./Node')
const Edge = require('./Edge')

class Renderer {

    constructor(canvas) {
        this.canvas = canvas
        this.opts = canvas.opts
        this.node = new Node(canvas, this)
        this.edge = new Edge(canvas, this)

        const toolkit = canvas.jsToolkit

        // configure the renderer
        this.renderer = toolkit.render({
            container: this.opts.attachTo,
            elementsDraggable: !canvas.isReadOnly,
            enablePanButtons: false,
            consumeRightClick: false,
            saveStateOnExit:true,              // serialize state on page unload automatically. defaults to false.
            saveStateOnDrag:true,              // serialize state after each drag. defaults to false.
            stateHandle: 'metaMapCanvas_' + (canvas.mapId || canvas.mapName),
            saveState: function (...o) {
                debugger
            },
            layout:{
                // custom layout for this app. simple extension of the spring layout.
                type:'metamap'
            },
            //
            // this is how you can associate groups of nodes. Here, because of the
            // way I have represented the relationship in the data, we either return
            // a part's 'parent' as the posse, or if it is not a part then we
            // return the node's id. There are addToPosse and removeFromPosse
            // methods too (on the renderer, not the toolkit); these can be used
            // when transferring a part from one parent to another.
            assignPosse:(node)=> {
                return node.data.parent ? { posse:node.data.parent, active:false } : node.id;
            },
            zoomToFit:false,
            view: {
                nodes: this.node.getView(),
                edges: this.edge.getView()
            },
            events: this.canvas.events.getRenderEvents(),
            elementsDroppable:true,
            dragOptions:{
                filter:'.segment .letter',       // can't drag nodes by the color segments.
                stop:() =>{
                    // when _any_ node stops dragging, run the layout again.
                    // this will cause child nodes to snap to their new parent, and also
                    // cleanup nicely if a node is dropped on another node.
                    this.renderer.refresh();
                }
            }
        });

    }
}

module.exports = Renderer