const jsPlumbToolkit = window.jsPlumbToolkit
const _CanvasBase = require('./_CanvasBase')
const _ = require('lodash')

class Toolkit extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        let config = {
            saveStateOnExit:true,              // serialize state on page unload automatically. defaults to false.
            saveStateOnDrag:true,              // serialize state after each drag. defaults to false.
            stateHandle: 'metaMapCanvas_' + (canvas.mapId || canvas.mapName)
        }
        let edgeEvents = this.edge.getToolkitEvents()
        _.extend(config, edgeEvents)

        // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.
        this.toolkit = jsPlumbToolkit.newInstance(config)
    }

    bindEvents() {
        this.toolkit.bind("dataUpdated", () => {
            this.canvas.update()
            this.canvas.jsRenderer.State.save()
            this.canvas.onAutoSave()
        })
    }
}

module.exports = Toolkit