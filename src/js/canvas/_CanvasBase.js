const StackTrace = require('stacktrace-js')

class _CanvasBase {

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

    init() {

    }

    update() {

    }


}

module.exports = _CanvasBase