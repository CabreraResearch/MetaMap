const jsPlumbToolkit = window.jsPlumbToolkit;
const _CanvasBase = require('./_CanvasBase')

class Dialog extends _CanvasBase {

    constructor(canvas) {
        super(canvas)
        
        // ------------------------- dialogs -------------------------------------

        jsPlumbToolkit.Dialogs.initialize({
            selector: ".dlg"
        });

        // ------------------------- / dialogs ----------------------------------

    }
}

module.exports = Dialog