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
            label:'idea',
            type: 'idea',
            children: [],
            labelPosition: [],
            cssClass: '',
            perspective: {
                has: false,
                edges: [],
                class: 'none'
            }
        }
        _.extend(ret, opts)
        return ret
    }

    getClickEvents() {
        return {
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

                    let nodeData = this.getNewNode({
                        parentId:node.id,
                        w:newWidth,
                        h:newHeight,
                        label: newLabel,
                        order: node.data.children.length,
                        partAlign:  'left'
                    })

                    var newNode = this.jsToolkit.addNode(nodeData)

                    node.data.children.push(newNode.id)
                    this.jsRenderer.relayout()
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
            default: {
                parent: 'all',
                template:'tmplNode'
            },
            idea: {
                parent: 'default'
            },
            'r-thing': {
                parent: 'idea'
            }
        }
    }

    onAdded(obj) {

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
}

module.exports = Node