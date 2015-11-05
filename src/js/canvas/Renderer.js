const jsPlumb = window.jsPlumb;
const Node = require('./Node')
const Edge = require('./Edge')
const DragDropHandler = require('./DragDrop')
const _CanvasBase = require('./_CanvasBase')

class Renderer extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        this.opts = canvas.opts
        this.node = new Node(canvas, this)
        this.edge = new Edge(canvas, this)

        const toolkit = canvas.jsToolkit	
			
		// have to expose renderer this way to drag and drop since renderer does not exist when the
		// drag/drop handler is instantiated (and it currently does not pass itself in to any of the 
		// drag/drop callbacks, something that is on the jsplumb roadmap)
		var renderer;
		let dragDropHandler = new DragDropHandler(toolkit, function() {
			return renderer;
		});

        // configure the renderer
        renderer = this.renderer = toolkit.render({
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
            zoomToFit:false,
            view: {
                nodes: this.node.getView(),
                edges: this.edge.getView()
            },
            events: this.canvas.events.getRenderEvents(),
            elementsDroppable:!canvas.isReadOnly,
			assignPosse:dragDropHandler.getPosseAssigner(),
            dragOptions:dragDropHandler.getDragOptions(),
			dropOptions:dragDropHandler.getDropOptions()
        });

    }

    update() {
        super.update()

        this.node.update()
        this.edge.update()
    }
}

module.exports = Renderer