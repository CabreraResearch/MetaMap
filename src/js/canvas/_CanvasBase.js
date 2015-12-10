const StackTrace = require('stacktrace-js')

class _CanvasBase {
    /**
     * @param  {Canvas} canvas
     */
    constructor(canvas) {
        this.canvas = canvas
        this.stackTrace = StackTrace
    }

    get jsToolkit() {
        return this.canvas.jsToolkit
    }

    get jsRenderer() {
        return this.canvas.jsRenderer
    }

    get node() {
        this._node = this._node || this.canvas.node
        return this._node
    }

    set node(_node) {
        this._node = _node
    }

    get edge() {
        this._edge = this._edge || this.canvas.edge
        return this._edge
    }

    set edge(_edge) {
        this._edge = _edge
    }

    get dragDropHandler() {
        this._dragDropHandler = this._dragDropHandler || this.canvas.dragDropHandler
        return this._dragDropHandler
    }

    set dragDropHandler(_handler) {
        this._dragDropHandler = _handler
    }

    get schema() {
        return this.canvas.schema
    }

    get copyPaste() {
        return this.canvas.copyPaste
    }

    init() {

    }

    update() {

    }

    hideRDots() {
        this.edge.hideRDots()
    }

    showRDot(id, obj) {
        this.edge.showRDot(id, obj)
    }

}

module.exports = _CanvasBase