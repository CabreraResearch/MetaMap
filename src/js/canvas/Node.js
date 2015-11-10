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
                        order: node.data.children.length
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

    getView() {
        return {
            all: {
                events: {
                    tap: (obj) => {
                        this.canvas.clearSelection(obj)
                    },
                    mouseenter: (obj) => {

                    },
                    contextmenu: (node, port, el, e) => {
                        if (node && node.el) {
                            $.contextMenu({
                                selector: `#${node.el.id}`,
                                items: {
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