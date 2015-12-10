const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit
const jsPlumbUtil = window.jsPlumbUtil

const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')

/**
 * @extends _CanvasBase
 */
class CopyPaste extends _CanvasBase {
    /**
     * @param  {Canvas} canvas
     */
    constructor(canvas) {
        super(canvas)

        jsPlumb.on(document, 'keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.keyCode) {
                    case 67: //c
                        this.copy(event)
                        break
                    case 86: //v
                        this.paste(event)
                        break
                }
            }
        })
    }
    /**
     * Copy the current selection
     * @param  {any} event
     */
    copy(event) {
        this._copyData = null
        this.data = this.canvas.exportData(true)
    }

    /**
     * Take a collection of nodes and edges and create an exact copy of them
     * @param  {any} data
     * @param  {function} edgeCallback
     */
    clone(data, callback) {
        let newData = {
            nodes: [],
            edges: []
        }
        if (data) {
            jsPlumb.batch(() => {
                let idMap = {}

                //1. Match each existing node id to a new UUID
                _.each(data.nodes, (node) => {
                    idMap[node.id] = jsPlumbUtil.uuid()
                })
                //2. Match each existing edge id to a new UUID
                _.each(data.edges, (edge) => {
                    idMap[edge.data.id] = jsPlumbUtil.uuid()
                })

                //3: Map the selected nodes to new objects
                newData.nodes = _.map(data.nodes, (node) => {
                    let ret = {
                        children: [],
                        cssClass: node.cssClass,
                        h: node.h,
                        id: idMap[node.id],
                        label: node.label,
                        labelPosition: [],
                        order: node.order || 0,
                        partAlign: node.partAlign,
                        isRThing: node.isRThing,
                        rthing: node.rthing || {},
                        perspective: { edges: [], class: 'none', has: false },
                        suspendLayout: node.suspendLayout || false,
                        family: node.family,
                        type: node.type,
                        w: node.w,
                        parts: {
                            class: 'none'
                        }
                    }

                    //update parent keys
                    if (node.parentId) {
                        ret.parentId = idMap[node.parentId]
                    }

                    //update child keys
                    _.each(node.children, (childId) => {
                        ret.children.push(idMap[childId])
                    })

                    if (ret.children.length > 0) {
                        ret.parts.class = 'open'
                    }

                    if(ret.isRThing) {
                        ret.rthing.edgeId = idMap[ret.rthing.edgeId]
                        ret.rthing.eDot = idMap[ret.rthing.edgeId]+'_rthing'
                    }

                    //update perspective edges
                    _.each(node.perspective.edges, (edgeId) => {
                        ret.perspective.edges.push(idMap[edgeId])
                        ret.perspective.has = node.perspective.has
                        ret.perspective.class = node.perspective.class
                    })

                    if (node.left) {
                        //position the new node just to the right of the copied node
                        ret.left = node.left + 200
                        let topMove = 0
                        //If copying edges, move down as well
                        if (data.edges.length > 0) topMove = 200
                        ret.top = node.top + topMove
                    }

                    if (node.labelPosition[0]) {
                        ret.labelPosition = [node.labelPosition[0] + 100, node.labelPosition[1]]
                    }
                    return ret
                })

                //4: map over the edges and return new objects
                newData.edges = _.map(data.edges, (edge) => {
                    let ret = {
                        data: {
                            id: idMap[edge.data.id],
                            direction: edge.data.direction || 'none',
                            type: edge.data.type,
                            rthing: {},
                            perspective: {}
                        },
                        source: idMap[edge.source] || edge.source,
                        target: idMap[edge.target] || edge.target
                    }

                    if (edge.data.rthing && edge.data.rthing.nodeId) {
                        ret.data.rthing = {
                            nodeId: idMap[edge.data.rthing.nodeId],
                            rDot: ret.data.id + '_rthing'
                        }
                    }

                    if (edge.data.perspective && edge.data.perspective.nodeId) {
                        ret.data.perspective = {
                            nodeId: idMap[edge.data.perspective.nodeId]
                        }
                    }
                    return ret
                })

                this.canvas.clearSelection({ e: {} })
                let newNodes = {}
                _.each(newData.nodes, (n) => {
                    newNodes[n.id] = this.jsToolkit.addNode(n)
                    this.canvas.addToSelection({ node: newNodes[n.id] })
                })
                _.each(newData.edges, (e) => {
                    if (newNodes[e.source] && newNodes[e.target]) {
                        let edge = this.jsToolkit.addEdge(e)
                        this.canvas.addToSelection({ edge: edge })
                    } else {
                        let target = this.jsToolkit.getNode(e.target)
                        let source = this.jsToolkit.getNode(e.source)
                        if (source && target) {
                            let edge = this.jsToolkit.addEdge(e)
                            this.canvas.addToSelection({ edge: edge })
                        }
                    }
                })

                if (callback) {
                    callback(data, idMap, newData)
                }
            });
            this.canvas.refresh()
        }
        return newData
    }
    /**
     * Clone the current selection and insert it as a copy into the map
     * @param  {any} event
     */
    paste(event) {
        if (this.data) {

            //It's possible to paste multiple times from the same copy. In case we do this, operate on the last mutation instead of the original
            //To prevent writing over object references, this could include _.clone(obj, true) in the assignment
            let data = (this._copyData) ? this._copyData : this.data

            let newData = this.clone(data)

            this._copyData = newData
        }
    }

}

module.exports = CopyPaste