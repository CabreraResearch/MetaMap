const jsPlumb = window.jsPlumb;
const $ = require('jquery')
const _ = require('lodash')

const DragDropHandler = require('./DragDrop')
const _CanvasBase = require('./_CanvasBase')

class Renderer extends _CanvasBase {

    /**
     * @param  {any} canvas
     */
    constructor(canvas) {
        super(canvas)

        this.opts = canvas.opts

        const toolkit = canvas.jsToolkit

		// have to expose renderer this way to drag and drop since renderer does not exist when the
		// drag/drop handler is instantiated (and it currently does not pass itself in to any of the
		// drag/drop callbacks, something that is on the jsplumb roadmap)
		var renderer;
		let dragDropHandler = this.dragDropHandler = new DragDropHandler(canvas, toolkit, function() {
			return renderer;
		});

        let zoomToFit = this.canvas.map && this.canvas.map.data && (this.canvas.map.data.nodes.length >= 20 || (this.canvas.map.data.edges && this.canvas.map.data.edges.length >= 10))

        // configure the renderer
        renderer = this.renderer = toolkit.render({
            container: this.opts.attachTo,
            elementsDraggable: !canvas.isReadOnly,
            enablePanButtons: false,
            consumeRightClick: false,
            saveStateOnExit:true,              // setting these has no effect; investigate later
            saveStateOnDrag:true,              //
            stateHandle: 'metaMapCanvas_' + (canvas.mapId || canvas.mapName),
            layout:{
                // custom layout for this app. simple extension of the spring layout.
                type:'metamap'
            },
            zoomToFit: zoomToFit,
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
        
        if (this.canvas.metaMap.debug) {
            window.renderer = renderer
        }
    }

    update() {
        super.update()

        this.node.update()
        this.edge.update()
    }
}

module.exports = Renderer
