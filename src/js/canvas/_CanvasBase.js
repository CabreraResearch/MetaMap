class _CanvasBase {

    constructor(canvas) {
        this.canvas = canvas
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