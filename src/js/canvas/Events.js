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
        this.__types = this.__types || [ ['red', 'D'], ['orange', 'P'], ['green', 'S'], ['blue','R'], ['eye_closed'], ['eye_open'] ]
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
                eye_closed: (el, node) => {
                    this.clickLogger('eye closed', 'click', el, node)
                    if (node.data.perspective.has) {
                        node.data.perspective.class = 'open'
                        this.canvas.updateData({ node: node })
                        let sel = this.jsToolkit.select(node.data.perspective.edges)
                        this.jsRenderer.setVisible(sel, true)
                    }
                },
                eye_open: (el, node) => {
                    this.clickLogger('eye open', 'click', el, node)
                    if (node.data.perspective.has) {
                        node.data.perspective.class = 'closed'
                        this.canvas.updateData({ node: node })
                        let sel = this.jsToolkit.select(node.data.perspective.edges)
                        this.jsRenderer.setVisible(sel, true)
                    }
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

        //Using an array allows multiple, separate objects to be bound to the same segment logic
        _.each(array, (selector) => {
            let _el = el.querySelector('.' + selector)
            jsPlumb.on(_el, 'click', () => {
                if(this._clickHandlers['click'][segment]) {
                    this._clickHandlers['click'][segment](el, node)
                }
            })
            jsPlumb.on(_el, 'dblclick', () => {
                if (this._clickHandlers['dblclick'][segment]) {
                    this._clickHandlers['dblclick'][segment](el, node)
                }
            })
        })
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

        jsPlumb.on(label, 'dblclick', () => {
            //this.canvas.dialog.show(label, node)
            this.canvas.dialog.open(label, node)
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
                if (obj.edge.data.type == 'perspective') {
                    if (!_.contains(obj.edge.source.data.perspective.edges, obj.edge.data.id)) {
                        obj.edge.source.data.perspective.edges.push(obj.edge.data.id)
                        this.canvas.updateData({ node: obj.edge.source })
                    }
                }
                return obj
            },
            onComplete: () => {

            },
            relayout: ()=> {

                // this has all been moved now. the node stuff is in Node.js, in the
                // mouseover event. The edge is also mouseover, in Edge.js, for the relationship
                // edge type.

                //let that = this
                //$('.edge-relationship').off('mouseleave')
                //$('.edge-relationship').off('mouseenter')


                //$('.ideaNode').on('mouseenter', (event) => {
                //    this.canvas.rndrr.hideRDots();
                //});

				/* The Mouseover event is what you want to register on an edge. That is done now, in Edge.js
                $('.edge-relationship').on('mouseenter', function (event) {
                    that.canvas.rndrr.hideRDots();
                    let className = $(this).attr('class')
                    let id = _.last(className.split(' '))
                    let edge = that.jsToolkit.getEdge(id)
                    if (edge) {
                        that.canvas.rndrr.showRDot(id, { edge: edge })
                    }
                })
				*/
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

        let mode = null;
        //map backspace to delete if anything is selected
        jsPlumb.on(document, 'keyup', (event) => {
            mode = null
            var selected = toolkit.getSelection();
            switch (event.keyCode) {
                case 8:
                    if(event.target.nodeName.toLowerCase() != 'textarea' && event.target.nodeName.toLowerCase() != 'input' && selected) {
                        event.preventDefault()
                        this.canvas.deleteAll(selected)
                    }
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
                        if (event.target.nodeName.toLowerCase() != 'textarea' && event.target.nodeName.toLowerCase() != 'input') {
                            event.preventDefault()
                        }
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