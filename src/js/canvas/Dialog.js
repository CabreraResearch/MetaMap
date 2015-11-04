const jsPlumbToolkit = window.jsPlumbToolkit;

class Dialog {

    constructor(canvas) {
        this.canvas = canvas

        // ------------------------- dialogs -------------------------------------

        jsPlumbToolkit.Dialogs.initialize({
            selector: ".dlg"
        });

        // ------------------------- / dialogs ----------------------------------

    }
}

module.exports = Dialog