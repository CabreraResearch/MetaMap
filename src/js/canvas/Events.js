const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit;
const _CanvasBase = require('./_CanvasBase')

class Events extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        this.labelDragHandler = jsPlumb.getInstance()
    }

    get _types() {
        this.__types = this.__types || [ ['red', 'D'], ['orange', 'P'], ['green', 'S'], ['blue','R'], ['text'] ]
        return this.__types
    }

    get _clickHandlers() {
        //
        // setup the clicking actions and the label drag. For the drag we create an
        // instance of jsPlumb for not other purpose than to manage the dragging of
        // labels. When a drag starts we set the zoom on that jsPlumb instance to
        // match our current zoom.
        //
        this.__clickHandlers = this.__clickHandlers || {
            click:{
                red:(el, node) => {
                    this.clickLogger('R', 'click', el, node)
                },
                green:(el, node) => {
                    this.clickLogger('G', 'click', el, node)
                },
                orange:(el, node) => {
                    this.clickLogger('O', 'click', el, node)
                },
                blue:(el, node) => {
                    this.clickLogger('B', 'click', el, node)
                },
                text:(el, node) => {
                    this.clickLogger('T', 'click', el, node)
                }
            },
            dblclick:{
                red:(el, node) => {
                    this.clickLogger('R', 'dblclick', el, node)
                    this.canvas.jsToolkit.addNode(this.canvas.node.getNewNode())
                },
                green:(el, node) => {
                    this.clickLogger('G', 'dblclick', el, node)
                    var newWidth = node.data.w * this.canvas.partSize
                    var newHeight = node.data.h * this.canvas.partSize

                    node.data.children = node.data.children || []
                    var newLabel = 'Part'

                    var newNode = this.canvas.jsToolkit.addNode({
                        parentId:node.id,
                        w:newWidth,
                        h:newHeight,
                        label: newLabel,
                        order: node.data.children.length
                        })

                    node.data.children.push(newNode.id)
                    this.canvas.jsRenderer.relayout()
                },
                orange:(el, node) => {
                    this.clickLogger('O', 'dblclick', el, node)
                    var newNode = this.canvas.jsToolkit.addNode(this.canvas.node.getNewNode())

                    this.canvas.jsToolkit.connect({source:node, target:newNode, data:{
                        type:'perspective'
                    }})
                },
                blue:(el, node) => {
                    this.clickLogger('B', 'dblclick', el, node)
                    var newNode = this.canvas.jsToolkit.addNode(this.canvas.node.getNewNode())

                    this.canvas.jsToolkit.connect({source:node, target:newNode, data:{
                        type: 'relationship',
                        direction: 'none',
                        leftSize: 0,
                        rightSize: 0
                    }})
                },
                text:(el, node) => {
                    this.clickLogger('T', 'dblclick', el, node)
                    var label = el.querySelector('.name')
                    jsPlumbToolkit.Dialogs.show({
                        id: 'dlgText',
                        title: 'Enter label:',
                        onOK: function (d) {
                            this.canvas.jsToolkit.updateNode(node, { label:d.text })
                        },
                        data:{
                            text:node.data.label
                        }
                    })
                }
            }
        }
        return this.__clickHandlers
    }

    clickLogger(type, event, el, node) {
        console.log(event + ' ' + type)
        console.dir(node.data)
        if(event == 'dblclick') {
            this.canvas.jsToolkit.clearSelection()
        }
    }

    _curryHandler(el, array, node) {
        let segment = array[0]
        let letter = array[1]
        let _el = el.querySelector('.' + segment)
        jsPlumb.on(_el, 'click', () => {
            this._clickHandlers['click'][segment](el, node)
        })
        jsPlumb.on(_el, 'dblclick', () => {
            this._clickHandlers['dblclick'][segment](el, node)
        })
        if (letter) {
            let _el = el.querySelector('.' + letter)
            jsPlumb.on(_el, 'click', () => {
                this._clickHandlers['click'][segment](el, node)
            })
            jsPlumb.on(_el, 'dblclick', () => {
                this._clickHandlers['dblclick'][segment](el, node)
            })
        }
    }

    registerHandlers(params) {
        // here you have params.el, the DOM element
        // and params.node, the underlying node. it has a `data` member with the node's payload.
        var el = params.el, node = params.node, label = el.querySelector('.name')
        for (var i = 0; i < this._types.length; i++) {
            this._curryHandler(el, this._types[i], node)
        }

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

        // make the label editable via a dialog
        jsPlumb.on(label, 'dblclick', () => {
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
        })

    }

    getRenderEvents() {
        return {
            canvasClick: (e)=> {
                this.canvas.clearSelection()
            },
            canvasDblClick:(e)=> {
                // add an Idea node at the location at which the event occurred.
                var pos = this.canvas.jsRenderer.mapEventLocation(e)
                //Move 1/2 the height and width up and to the left to center the node on the mouse click
                //TODO: when height/width is configurable, remove hard-coded values
                pos.left = pos.left-50
                pos.top = pos.top-50
                this.canvas.jsToolkit.addNode(jsPlumb.extend(this.canvas.node.getNewNode(), pos))
            },
            contextmenu:  (node, port, el, e) => {
                debugger
            },
            nodeAdded: (params) => { this.registerHandlers(params) }, // see below
            edgeAdded: (obj)=> {
                if(!obj.edge.data.direction) {
                    obj.edge.data.direction = 'none'
                    obj.edge.data.leftSize = 0
                    obj.edge.data.rightSize = 0
                    this.jsToolkit.updateEdge(obj.edge)
                    this.jsRenderer.repaint()
                }
                return obj
            },
            relayout: ()=> {
                //various drag/drop handler event experiments lived here
            }/*,
            nodeDropped:(params)=> {
                let target = params.target
                let source = params.source
                let sourceId = params.source.data.id
                let targetId = params.target.data.id

                //If the source was previously a child of any parent, disassociate
                if (source.data.parent) {
                    let oldParent = this.canvas.jsToolkit.getNode(source.data.parent)
                    if (oldParent) {
                        oldParent.data.children = _.remove(oldParent.data.children, (id) => { return id == sourceId })
                        this.canvas.jsToolkit.updateNode(oldParent)
                    }
                }

                //Assign the source to the new parent
                target.data.children = target.data.children || []
                target.data.children.push(source.data.id)
                this.canvas.jsToolkit.updateNode(target)

                //Update the source
                source.data.parent = targetId
                source.data.h = target.data.h * this.canvas.partSize
                source.data.w = target.data.w * this.canvas.partSize
                source.data.order = target.children.length
                this.canvas.jsToolkit.updateNode(source)

                this.canvas.jsRenderer.refresh()
            }*/
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

        let mode = null;
        //map backspace to delete if anything is selected
        jsPlumb.on(document, 'keyup', (event) => {
            mode = null
            var selected = toolkit.getSelection();
            switch (event.keyCode) {
                case 8:
                    if(selected) {
                        event.preventDefault()
                    }
                    this.canvas.deleteAll(selected);
                    break
                case 17:
                    selected.eachNode((i, node) => {
                        let info = toolkit.getObjectInfo(node)
                        if (info.el) {
                            $(info.el).find('.node-border').each(function () {
                                this.setAttribute('class', 'node-selected')
                            })
                        }
                        if (info.els) {
                            _.each(info.els, (array) => {
                                _.each(array, (el) => {
                                    if (el.innerHTML) {
                                        $(el).find('.node-border').each(function () {
                                            this.setAttribute('class', 'node-selected')
                                        })
                                    }
                                })
                            })
                        }
                    })

                    break
                case 46:
                    this.canvas.deleteAll(selected);
                    break;
            }
        })

        jsPlumb.on(document, 'contextmenu', (event) => {
            event.preventDefault()
        })

        jsPlumb.on(document, 'keydown', (event) => {
            if (event.ctrlKey) {
                if (!mode) {
                    mode = 'select'
                    renderer.setMode('select')
                }
            } else {
                switch (event.keyCode) {
                    case 8:
                        event.preventDefault()
                        break;
                    case 46:
                        var selected = toolkit.getSelection();
                        this.canvas.deleteAll(selected);
                        break;
                }
            }
        })
    }
}

module.exports = Events