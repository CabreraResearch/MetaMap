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
                    if (node.data.perspective.has) {
                        node.data.perspective.class = 'open'
                        this.canvas.updateData({ node: node })
                        let sel = this.jsToolkit.select(node.data.perspective.edges)
                        sel.eachEdge((i, edge) => {
                            edge.data.visible = true
                            this.canvas.updateData({ edge: edge })
                            this.jsRenderer.setVisible(edge, true)
                        })
                        this.canvas.jsToolkit.clearSelection()
                        //this.jsRenderer.setVisible(sel, true)
                    }
                },
                eye_open: (el, node) => {
                    if (node.data.perspective.has) {
                        node.data.perspective.class = 'closed'
                        this.canvas.updateData({ node: node })
                        let sel = this.jsToolkit.select(node.data.perspective.edges)
                        sel.eachEdge((i, edge) => {
                            edge.data.visible = false
                            this.canvas.updateData({ edge: edge })
                            this.jsRenderer.setVisible(edge, false)
                        })
                        this.canvas.jsToolkit.clearSelection()
                        //this.jsRenderer.setVisible(sel, true)
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

                    let nodeData = this.canvas.rndrr.node.getNewNode({
                        parentId:node.id,
                        w:newWidth,
                        h:newHeight,
                        label: newLabel,
                        order: node.data.children.length
                    })

                    var newNode = this.canvas.jsToolkit.addNode(nodeData)

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
                var pos = this.jsRenderer.mapEventLocation(e)
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
                    //Kludge: for some reason, dragging from the P button toggle the eye class back to open
                    //This is probably desirable, but I have no idea why it's happening
                    //Creating a new perspective should then just show all perspectives
                    if (obj.edge.source.data.perspective.class == 'open') {
                        _.each(obj.edge.source.data.perspective.edges, (edgeId) => {
                            let edge = this.jsToolkit.getEdge(edgeId)
                            if (edge) {
                                edge.data.visible = true
                                this.jsRenderer.setVisible(edge, true)
                            }
                        })
                    }
                }
                //Kludge: this seems like a bit of a hack, but there isn't another way AFAIK to persist visibility on an edge
                if (obj.edge.data.visible === false) {
                    this.jsRenderer.setVisible(obj.edge, false)
                }
                return obj
            },
            onComplete: () => {

            },
            relayout: ()=> {
                let that = this
                $('.edge-relationship').off('mouseleave')
                $('.edge-relationship').off('mouseenter')

                $('.ideaNode').on('mouseenter', (event) => {
                    this.canvas.rndrr.hideRDots();
                });

                $('.edge-relationship').on('mouseenter', function (event) {
                    that.canvas.rndrr.hideRDots();
                    let className = $(this).attr('class')
                    let id = _.last(className.split(' '))
                    let edge = that.jsToolkit.getEdge(id)
                    if (edge) {
                        that.canvas.rndrr.showRDot(id, { edge: edge })
                    }
                })
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