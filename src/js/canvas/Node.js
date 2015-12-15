const jsPlumb = window.jsPlumb
const jsPlumbUtil = window.jsPlumbUtil
const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')

class Node extends _CanvasBase {

    constructor(canvas) {
        super(canvas)
        this.labelDragHandler = jsPlumb.getInstance()
    }

    //
    // dummy for a new node.
    //
    getNewNode(opts) {
        let id = jsPlumbUtil.uuid()
        let ret = {
            w:this.canvas.nodeSize,
            h:this.canvas.nodeSize,
            label:'Idea',
            type: 'idea',
            displayType: 'A',
            children: [],
            labelPosition: [],
            cssClass: '',
            perspective: {
                has: false,
                class: 'none'
            },
            partAlign: 'left',
            parts: {
                class: 'none'
            },
            isRThing: false,
            id: id,
            family: id
        }
        _.extend(ret, opts)
        return ret
    }

    bindLabelDrag(el, node) {
        let label = el.querySelector('.name[data-align="freehand"]')

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
    }

    getClickEvents() {
        return {
            click:{
                'eye-closed': (el, node) => {
                    if (node.data.perspective.has) {
                        node.data.perspective.class = 'open'
                        this.canvas.updateData({ node: node })
                        let sel = this.jsToolkit.select(node.data.perspective.edges)
                        this.jsRenderer.setVisible(sel, true)
                        this.jsRenderer.relayout()
                    }
                },
                'eye-open': (el, node) => {
                    if (node.data.perspective.has) {
                        node.data.perspective.class = 'closed'
                        this.canvas.updateData({ node: node })
                        let sel = this.jsToolkit.select(node.data.perspective.edges)
                        this.jsRenderer.setVisible(sel, false)
                    }
                },
                'parts.expanded': (el, node) => {
                    if (node.data.parts.class == 'open') {
                        node.data.parts.class = 'closed'
                        this.canvas.updateData({ node: node })

                        let recurse = (n) => {
                            if (n&& n.data.children.length > 0) {
                                _.each(n.data.children, (childId) => {
                                    let child = this.jsToolkit.getNode(childId)
                                    this.jsRenderer.setVisible(child, false)
                                    recurse(child)
                                })
                            }
                        }
                        recurse(node)
                    }
                },
                'parts.collapsed': (el, node) => {
                    if (node.data.parts.class == 'closed') {
                        node.data.parts.class = 'open'
                        this.canvas.updateData({ node: node })

                        let recurse = (n) => {
                            if (n&& n.data.children.length > 0) {
                                _.each(n.data.children, (childId) => {
                                    let child = this.jsToolkit.getNode(childId)
                                    this.jsRenderer.setVisible(child, true)
                                    recurse(child)
                                })
                            }
                        }
                        recurse(node)
                        this.jsRenderer.relayout()
                    }
                }
            },
            dblclick: {
                red: (el, node) => {
                    let newNode = this.getNewNode()
                    newNode.top = node.data.top - 150
                    newNode.left = node.data.left
                    this.jsToolkit.addNode(newNode)
                },
                green: (el, node) => {
                    if(node.data.displayType != 'idea_E') {
                        var newWidth = node.data.w * this.canvas.partSize
                        var newHeight = node.data.h * this.canvas.partSize

                        node.data.children = node.data.children || []
                        var newLabel = 'Part'

                        let displayType = this.getNextPartNodeType(node.data)
                        let nodeData = this.getNewNode({
                            parentId:node.id,
                            w:newWidth,
                            h:newHeight,
                            label: newLabel,
                            order: node.data.children.length,
                            partAlign: node.data.partAlign || 'left',
                            displayType: displayType,
                            family: node.data.family
                        })

                        if(node.data.isRThing && node.data.children.length == 0) {
                            nodeData.partAlign = 'left'
                            node.data.partAlign = 'left'
                        }
                        if(node.data.partAlign == 'freehand') {
                            nodeData.left = node.data.left+(this.getSizeForPart(nodeData)*2)
                            nodeData.top = node.data.top+(this.getSizeForPart(nodeData)*2)
                        }

                        var newNode = this.jsToolkit.addNode(nodeData)
                        console.log(newNode)
                        node.data.children.push(newNode.id)
                        node.data.parts = node.data.parts || { class: 'open' }
                        if (node.data.parts.class == 'none') {
                            node.data.parts.class = 'open'
                        }
                        this.canvas.updateData({node: node})
                    }
                },
                orange:(el, node) => {
                    let data = this.getNewNode()
                    data.top = node.data.top
                    data.left = node.data.left - 150
                    var newNode = this.jsToolkit.addNode(data)

                    let edge = this.jsToolkit.connect({source:node, target:newNode, data:{
                        type: 'perspective',
                        visible: true
                    }})
                    node.data.perspective = node.data.perspective || {}
                    node.data.perspective.has = true
                    node.data.perspective.edges = node.data.perspective.edges || []
                    node.data.perspective.edges.push(edge.getId())
                },
                blue:(el, node) => {
                    let data = this.getNewNode()
                    data.top = node.data.top
                    data.left = node.data.left + 150
                    var newNode = this.jsToolkit.addNode(data)
                    let type = 'relationship'
                    let edge = this.jsToolkit.connect({source:node, target:newNode, data:{
                        type: type,
                        direction: 'none',
                        leftSize: 0,
                        rightSize: 0,
                        visible: true
                    }})
                    let conn = this.jsRenderer.getRenderedConnection(edge.getId())
                    let overlay = conn.getOverlay("customOverlay")
                    overlay.canvas.setAttribute("id", `${edge.getId()}_rthing`)
                }
            }
        }
    }

    changeAlignment(node, align, doRefresh, el) {
        if (node && align) {
            node.data.suspendLayout = align == 'freehand'
            node.data.partAlign = align
            if(!node.data.left || !node.data.top) {
                let el = $(this.jsRenderer.getRenderedElement(node))
                node.data.left = el.css('left').split('px')[0]
                node.data.top = el.css('top').split('px')[0]
            }
            _.each(node.data.children, (childId) => {
                let child = this.jsToolkit.getNode(childId)
                let el = this.jsRenderer.getRenderedElement(node)
                this.changeAlignment(child, align, false, el)
            })
            if(el) {
                this.bindLabelDrag(el, node)
            }
            this.canvas.updateData({ node: node }, doRefresh)
            this.dragDropHandler.repositionRThing(node)
        }
    }

    getView() {
        return {
            all: {
                events: {
                    tap: (obj) => {
                        if (!_.contains(obj.e.target.className, 'name')) {
                            this.canvas.clearSelection(obj)
                        }
                    },
                    mouseover: (obj) => {
                        this.hideRDots()
                    },
                    contextmenu: (obj, port, el, e) => {
                        this.canvas.clearSelection()
                        if (obj && obj.el) {
                            let node = obj.node
                            $.contextMenu({
                                selector: `#${obj.el.id}`,
                                items: {
                                    layout: {
                                        name: 'Layout',
                                        icon: ' icn-Sstack',
                                        items: {
                                            left: {
                                                name: 'Left Align',
                                                icon: ' icn-Sleft',
                                                callback: () => {
                                                    this.changeAlignment(node, 'left', true)
                                                }
                                            },
                                            right: {
                                                name: 'Right Align',
                                                icon: ' icn-Sright',
                                                callback: () => {
                                                    this.changeAlignment(node, 'right', true)
                                                }
                                            },
                                            free: {
                                                name: 'Free Hand',
                                                icon: ' icn-Sfreehand',
                                                callback: () => {
                                                    this.changeAlignment(node, 'freehand', true, obj.el)
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            },
            idea: {
                parent: 'all',
                template:'node'
            }
        }
    }

    onAdded(obj) {

    }

    _getPartNodeType(node, inc = 1) {
        let ret = 'A'
        if (node) {
            let types = ['A', 'B', 'C', 'D', 'E']
            let displayType = node.displayType
            if (inc >= 1 && displayType != 'E') {
                ret = types[types.indexOf(displayType)+inc]
            }
            else if(inc <= -1 && displayType != 'A'){
                ret = types[types.indexOf(displayType)+inc]
            } else {
                ret = node.displayType
            }
            if(!ret) ret = node.displayType
        }
        return ret;
    }

    getPrevPartNodeType(node, parent) {
        let inc = -1

        let ret = this._getPartNodeType(node, inc)
        if (parent) {
            let pSize = this.getSizeForPart(parent)
            let cSize = this.getSizeForPart(node)

            if(cSize==pSize) ret = this._getPartNodeType(node, inc)
            else {
                while (cSize >= pSize && ret != 'A') {
                    ret = this._getPartNodeType({ displayType: ret }, inc)
                    cSize = this.getSizeForPart({ displayType: ret })
                }
            }
        }
        return ret
    }

    getNextPartNodeType(node, parent) {
        let inc = 1

        let ret = this._getPartNodeType(node, inc)
        if (parent) {
            let pSize = this.getSizeForPart(parent)
            let cSize = this.getSizeForPart({displayType: ret})
            while (cSize >= pSize && ret != 'E') {
                inc += 1
                ret = this._getPartNodeType({displayType: ret}, inc)
                cSize = this.getSizeForPart({ displayType: ret })
            }
        }
        return ret
    }

    getSizeForPart(node) {
        let ret = this.canvas.nodeSize
        switch (node.displayType) {
            case 'B':
                ret *= this.canvas.partSize
                break;
            case 'C':
                ret *= Math.pow(this.canvas.partSize,2)
                break;
            case 'D':
                ret *= Math.pow(this.canvas.partSize,3)
                break;
            case 'E':
                ret *= Math.pow(this.canvas.partSize,4)
                break;
        }
        return ret
    }

    createNode(e) {
         // add an Idea node at the location at which the event occurred.
        var pos = this.jsRenderer.mapEventLocation(e)
        //Move 1/2 the height and width up and to the left to center the node on the mouse click
        //TODO: when height/width is configurable, remove hard-coded values
        pos.left = pos.left-50
        pos.top = pos.top-50
        this.jsToolkit.addNode(jsPlumb.extend(this.getNewNode(), pos))
    }

    createRThing(obj) {
        let edgeId = obj.edge.getId()
        let dotEl = document.getElementById(edgeId + '_rthing')
        let left = this.jsRenderer.mapEventLocation(obj.e).left
        let top = this.jsRenderer.mapEventLocation(obj.e).top
        let size = obj.edge.source.data.w * this.canvas.partSize

        if (dotEl) {
            let dot = $(dotEl)
            left = dot.css('left').split('px')[0] - (size / 2)
            top = dot.css('top').split('px')[0] - (size / 2)
        }

        let d = {
            w: size,
            h: size,
            left: left,
            top: top,
            partAlign: 'left'
        }

        let rType = this.getNextPartNodeType(obj.edge.source.data)
        let nodeData = jsPlumb.extend(this.getNewNode({ displayType: rType, cssClass: 'donotdrag' }), d)
        nodeData.isRThing = true
        nodeData.rthing = {
            edgeId: edgeId,
            rDot: edgeId + '_rthing'
        }
        let newNode = this.canvas.jsToolkit.addNode(nodeData)
        obj.edge.data.rthing = {
            nodeId: newNode.id,
            rDot: edgeId + '_rthing'
        }

        this.hideRDots()

        this.canvas.updateData({ node: newNode, edge: obj.edge })
        this.dragDropHandler.repositionRThing(newNode)
    }
}

module.exports = Node