const jsPlumb = window.jsPlumb
const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')

class Node extends _CanvasBase {

    constructor(canvas) {
        super(canvas)
    }

    //
    // dummy for a new node.
    //
    getNewNode(opts) {
        let ret = {
            w:this.canvas.nodeSize,
            h:this.canvas.nodeSize,
            label:'Idea',
            type: 'idea_A',
            children: [],
            labelPosition: [],
            cssClass: '',
            perspective: {
                has: false,
                edges: [],
                class: 'none'
            },
            partAlign: 'left'
        }
        _.extend(ret, opts)
        return ret
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
                    }
                },
                'eye-open': (el, node) => {
                    if (node.data.perspective.has) {
                        node.data.perspective.class = 'closed'
                        this.canvas.updateData({ node: node })
                        let sel = this.jsToolkit.select(node.data.perspective.edges)
                        this.jsRenderer.setVisible(sel, true)
                    }
                }
            },
            dblclick: {
                red: (el, node) => {
                    let newNode = this.getNewNode()
                    this.jsToolkit.addNode(newNode)
                },
                green:(el, node) => {
                    var newWidth = node.data.w * this.canvas.partSize
                    var newHeight = node.data.h * this.canvas.partSize

                    node.data.children = node.data.children || []
                    var newLabel = 'Part'

                    let type = this.getPartNodeType(node.data)
                    let nodeData = this.getNewNode({
                        parentId:node.id,
                        w:newWidth,
                        h:newHeight,
                        label: newLabel,
                        order: node.data.children.length,
                        partAlign: node.data.partAlign || 'left',
                        type: type
                    })

                    var newNode = this.jsToolkit.addNode(nodeData)

                    node.data.children.push(newNode.id)
                    this.canvas.updateData({node: node})
                },
                orange:(el, node) => {
                    let data = this.getNewNode()
                    var newNode = this.jsToolkit.addNode(data)

                    this.jsToolkit.connect({source:node, target:newNode, data:{
                        type: 'perspective',
                        visible: true
                    }})
                },
                blue:(el, node) => {
                    let data = this.getNewNode()
                    var newNode = this.jsToolkit.addNode(data)

                    this.jsToolkit.connect({source:node, target:newNode, data:{
                        type: 'relationship',
                        direction: 'none',
                        leftSize: 0,
                        rightSize: 0,
                        visible: true
                    }})
                }
            }
        }
    }

    changeAlignment(node, align, doRefresh) {
        if (node && align) {
            node.data.suspendLayout = align == 'freehand'
            node.data.partAlign = align
            _.each(node.data.children, (childId) => {
                let child = this.jsToolkit.getNode(childId)
                this.changeAlignment(child, align, false)
            })
            this.canvas.updateData({ node: node }, doRefresh)
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
                        this.canvas.rndrr.hideRDots();
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
                                                    this.changeAlignment(node, 'freehand', true)
                                                }
                                            }
                                        }
                                    },
                                    copy: {
                                        name: 'Copy',
                                        callback: function(key, opt){
                                            alert('Clicked on ' + key)
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            },
            idea_A: {
                parent: 'all',
                template:'nodeA'
            },
            idea_B: {
                parent: 'all',
                template:'nodeB'
            },
            idea_C: {
                parent: 'all',
                template:'nodeC'
            },
            idea_D: {
                parent: 'all',
                template:'nodeD'
            },
            idea_E: {
                parent: 'all',
                template:'nodeE'
            }
        }
    }

    onAdded(obj) {

    }

    getPartNodeType(node) {
        let ret = 'idea_A'
        if (node) {
            let types = ['A', 'B', 'C', 'D', 'E']
            let type = node.type.split('_')[1]
            if (type != 'E') {
                ret = `idea_${types[types.indexOf(type)+1]}`
            } else {
                ret = ''
            }

        }
        return ret;
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
        let dotEl = document.getElementById(obj.edge.data.id + '_rthing')
        let left = this.jsRenderer.mapEventLocation(obj.e).left
        let top = this.jsRenderer.mapEventLocation(obj.e).top
        let size = obj.edge.source.data.w * this.canvas.partSize

        if (dotEl) {
            let dot = $(dotEl)
            left = dot.position().left - (size / 2)
            top = dot.position().top - (size / 2)
        }

        let d = {
            w: size,
            h: size,
            left: left,
            top: top,
            partAlign: 'freehand'
        }

        let rType = this.getPartNodeType(obj.edge.source.data)
        let nodeData = jsPlumb.extend(this.getNewNode({ type: rType, cssClass: 'donotdrag' }), d)
        nodeData.rthing = {
            edgeId: obj.edge.data.id,
            rDot: obj.edge.data.id + '_rthing'
        }
        let newNode = this.canvas.jsToolkit.addNode(nodeData)
        obj.edge.data.rthing = {
            nodeId: newNode.id,
            rDot: obj.edge.data.id + '_rthing'
        }

        this.hideRDots()

        this.canvas.updateData({ node: newNode, edge: obj.edge })
    }
}

module.exports = Node