const jsPlumbToolkit = window.jsPlumbToolkit;
const jsPlumb = window.jsPlumb;
const riot = require('riot')

const CONSTANTS = require('../constants/constants')
const _CanvasBase = require('./_CanvasBase')
require('../tags/dialogs/editName')

class Dialog extends _CanvasBase {

    constructor(canvas) {
        super(canvas)
    }

    open(label, node) {
        let modal = riot.mount(document.getElementById(CONSTANTS.ELEMENTS.META_MODAL_DIALOG_CONTAINER), CONSTANTS.TAGS.EDIT_LABEL)[0]
        modal.update({
            node: node,
            label: label,
            onDone: (val) => {
                this.canvas.jsToolkit.updateNode(node, { label: val })
            }
        })
    }

    initJsPlumbDialog() {
        jsPlumbToolkit.Dialogs.initialize({
            selector: ".dlg"
        });
    }

    openJsPlumbDialog(label, node) {

        // make the label editable via a dialog
        jsPlumbToolkit.Dialogs.show({
            id: 'dlgText',
            title: 'Enter label:',
            onOK: (d) => {
                this.canvas.jsToolkit.updateNode(node, { label: d.text })
            },
            data: {
                text: node.data.label
            }
        })
    }
}

module.exports = Dialog