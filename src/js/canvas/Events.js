const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit;
const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')

class Events extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        this.labelDragHandler = jsPlumb.getInstance()
    }

    get _types() {
        this.__types = this.__types || [['red', 'D'], ['orange', 'P'], ['green', 'S'], ['blue', 'R'], ['eye-closed'], ['eye-open'], ['parts.expanded'], ['parts.collapsed']]
        return this.__types
    }

    get _clickHandlers() {
        //
        // setup the clicking actions and the label drag. For the drag we create an
        // instance of jsPlumb for not other purpose than to manage the dragging of
        // labels. When a drag starts we set the zoom on that jsPlumb instance to
        // match our current zoom.
        //
        if (!this.__clickHandlers) {
            let events = {
                click: {

                },
                dblclick: {

                }
            }
            let edgeEvents = this.edge.getClickEvents()
            let nodeEvents = this.node.getClickEvents()
            _.extend(events, edgeEvents)
            _.extend(events, nodeEvents)

            this.__clickHandlers = events
        }
        return this.__clickHandlers
    }

    _curryHandler(el, array, node) {
        let segment = array[0]

        //Using an array allows multiple, separate objects to be bound to the same segment logic
        _.each(array, (selector) => {
            let _el = el.querySelectorAll('.' + selector)
            jsPlumb.on(_el, 'click', (e) => {
                if (this._clickHandlers['click'][segment]) {
                    this._clickHandlers['click'][segment](el, node)
                }
            })
            jsPlumb.on(_el, 'dblclick', _.throttle((e) => {
                this.canvas.clearSelection({ e: e })
                if (this._clickHandlers['dblclick'][segment]) {
                    this._clickHandlers['dblclick'][segment](el, node)
                }
            }, 200))
        })
    }

    registerHandlers(params) {
        // here you have params.el, the DOM element
        // and params.node, the underlying node. it has a `data` member with the node's payload.
        var el = params.el, node = params.node, label = el.querySelector('.name[data-align="freehand"]')
        for (var i = 0; i < this._types.length; i++) {
            this._curryHandler(el, this._types[i], node)
        }

        if (label) {
            // make the label draggable (see note above).
            this.labelDragHandler.draggable(label, {
                start: () => {
                    this.labelDragHandler.setZoom(this.canvas.jsRenderer.getZoom())
                },
                stop: (e) => {
                    node.data.labelPosition = [
                        parseInt(label.style.left, 10),
                        parseInt(label.style.top, 10)
                    ]
                    this.canvas.onAutoSave(this.canvas.jsToolkit.exportData())
                }
            })
        }
        let editLabel = el.querySelectorAll('.name')
        jsPlumb.on(editLabel, 'dblclick', (e) => {
            e.preventDefault()
            this.canvas.dialog.open(e.target, node)
        })
    }

    getRenderEvents() {
        return {
            canvasClick: (e) => {
                this.canvas.clearSelection({ e: e })
            },
            canvasDblClick: (e) => {
                this.node.createNode(e)
            },
            contextmenu: (node, port, el, e) => {
                debugger
            },
            nodeAdded: (params) => {
                this.registerHandlers(params)
                this.node.onAdded(params)
            },
            edgeAdded: (obj) => {
                this.edge.onAdded(obj)
            },
            onComplete: () => {

            },
            relayout: () => {
                // not necessary now, as we handle all this in mouseover events on edges.
            }
        }
    }

    bindEvents() {
        const toolkit = this.canvas.jsToolkit
        const renderer = this.canvas.jsRenderer

        jsPlumb.on("relationshipEdgeDump", "click", () => { this.canvas.dumpEdgeCounts() });

        //CTRL + click enables the lasso
        jsPlumb.on(document, 'mousedown', (event) => {
            if (event.ctrlKey) {
                event.preventDefault()
            }
        });

        //map backspace to delete if anything is selected
        jsPlumb.on(document, 'keyup', (event) => {
            var selected = toolkit.getSelection();
            switch (event.keyCode) {
                case 8: //backspace
                    if (event.target.nodeName.toLowerCase() != 'textarea' && event.target.nodeName.toLowerCase() != 'input' && selected) {
                        event.preventDefault()
                        this.schema.deleteAll(selected)
                    }
                    break
                case 46: //delete
                    this.schema.deleteAll(selected)
                    break
                case 17: //ctrl
                    selected.eachNode((i, node) => {
                        let info = toolkit.getObjectInfo(node)
                        if (info.el) {
                            $(info.el).find('.node.border').each(function () {
                                this.setAttribute('class', 'node-selected')
                            })
                        }
                        if (info.els) {
                            _.each(info.els, (array) => {
                                _.each(array, (el) => {
                                    if (el.innerHTML) {
                                        $(el).find('.node.border').each(function () {
                                            this.setAttribute('class', 'node-selected')
                                        })
                                    }
                                })
                            })
                        }
                    })
                    break
            }
        })

        jsPlumb.on(document, 'contextmenu', (event) => {
            event.preventDefault()
        })

        jsPlumb.on(document, 'keydown', (event) => {
            if (event.ctrlKey && event.keyCode == 17) {
                if (this.canvas.mode != 'select') {
                    this.canvas.mode = 'select'
                    renderer.setMode('select')
                }
            } else {
                switch (event.keyCode) {
                    case 8: //backspace
                        if (event.target.nodeName.toLowerCase() != 'textarea' && event.target.nodeName.toLowerCase() != 'input') {
                            event.preventDefault()
                        }
                        break
                    case 65: //a
                        if (event.ctrlKey) {
                            event.preventDefault()

                            toolkit.eachNode((i, node) => {
                                this.canvas.addToSelection({ node: node })
                            })
                            toolkit.eachEdge((i, edge) => {
                                this.canvas.addToSelection({ edge: edge })
                            })

                        }
                        break
                }
            }
        })
    }
}

module.exports = Events