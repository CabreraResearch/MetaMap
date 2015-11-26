const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit
const jsPlumbUtil = window.jsPlumbUtil

const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')

class CopyPaste extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        jsPlumb.on(document, 'keydown', (event) => {
            if (event.ctrlKey) {
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

    copy(event) {
        event.preventDefault()

        this._copyData = null
        this.data = this.canvas.exportData(true)

        console.log(this.data)
    }

    paste(event) {
        event.preventDefault()
        if (this.data) {

            //It's possible to paste multiple times from the same copy. In case we do this, operate on the last mutation instead of the original
            //To prevent writing over object references, this could include _.clone(obj, true) in the assignment
            let data = (this._copyData) ? this._copyData : this.data

            let idMap = {}
            let newData = {
                nodes: [],
                edges: []
            }

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
                    perspective: { edges: [], class: 'none', has: false },
                    suspendLayout: node.suspendLayout || false,
                    type: node.type,
                    w: node.w
                }

                //update parent keys
                if (node.parentId) {
                    ret.parentId = idMap[node.parentId]
                }

                //update child keys
                _.each(node.children, (childId) => {
                    ret.children.push(idMap[childId])
                })

                //update perspective edges
                _.each(node.perspective.edges, (edgeId) => {
                    ret.perspective.edges.push(idMap[edgeId])
                    ret.perspective.has = node.perspective.has
                    ret.perspective.class = node.perspective.class
                })

                if (node.left) {
                    //position the new node just to the right of the copied node
                    ret.left = node.left + 100
                    let topMove = 0
                    //If copying edges, move down as well
                    if (data.edges.length > 0) topMove = 100
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
                    source: idMap[edge.source],
                    target: idMap[edge.target]
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

            this._copyData = newData

            this.canvas.clearSelection({ e: {} })
            let newNodes = {}
            _.each(newData.nodes, (n) => {
                newNodes[n.id] = this.jsToolkit.addNode(n)
                this.canvas.addToSelection({node: newNodes[n.id]})
            })
            _.each(newData.edges, (e) => {
                if (newNodes[e.source] && newNodes[e.target]) {
                    let edge = this.jsToolkit.addEdge(e)
                    this.canvas.addToSelection({ edge: edge })
                }
            })
            this.canvas.refresh()
        }
    }

}

module.exports = CopyPaste