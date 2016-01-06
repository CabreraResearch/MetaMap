const jsPlumbToolkit = window.jsPlumbToolkit
const _CanvasBase = require('./_CanvasBase')
const _ = require('lodash')

class Toolkit extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        let edgeEvents = this.edge.getToolkitEvents()

        // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.
        this.toolkit = jsPlumbToolkit.newInstance(edgeEvents)
        if (this.canvas.Homunculus.debug) {
            window.toolkit = this.toolkit
        }

    }

    bindEvents() {
        this.toolkit.bind("dataUpdated", () => {
            this.canvas.update()
            this.canvas.onAutoSave()
        })
    }
}

module.exports = Toolkit