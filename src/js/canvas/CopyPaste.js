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

        this.data = this.canvas.exportData(true)

        console.log(this.data)
    }

    paste(event) {
        event.preventDefault()
        if (this.data) {
            let data = _.clone(this.data, true)
            
            let idMap = {}
            let newData = {
                nodes: [],
                edges: []
            }
            _.each(data.nodes, (node) => {
                idMap[node.id] = jsPlumbUtil.uuid()
            })
            _.each(data.edges, (edge) => {
                idMap[edge.data.id] = jsPlumbUtil.uuid()
            })
            _.each(data.nodes, (node) => {
                node.id = idMap[node.id]

                //update parent keys
                if (node.parentId) {
                    node.parentId = idMap[node.parentId]
                }
                //update child keys
                let children = []
                _.each(node.children, (childId) => {
                    children.push(idMap[childId])
                })
                node.children = children
                //update perspective edges
                let perspectives = []
                _.each(node.perspective.edges, (edgeId) => {
                    perspectives.push(idMap[edgeId])
                })
                node.left += 100
                if (node.labelPosition[0]) {
                    node.labelPosition[0] += 100
                }
                newData.nodes.push(node)
            })
            _.each(data.edges, (edge) => {
                edge.data.id = idMap[edge.data.id]
                edge.source = idMap[edge.source]
                edge.target = idMap[edge.target]
                if (edge.data.rthing && edge.data.rthing.nodeId) {
                    edge.data.rthing.nodeId = idMap[edge.data.rthing.nodeId]
                    edge.data.rthing.rDot = edge.data.id + '_rthing'
                }
                if (edge.data.perspective && edge.data.perspective.nodeId) {
                    edge.data.perspective.nodeId = idMap[edge.data.perspective.nodeId]
                }
                newData.edges.push(edge)
            })
            console.log(idMap)
            console.log(newData)

            this.canvas.clearSelection({ e: {}})
            _.each(newData.nodes, (n) => {
                let node = this.jsToolkit.addNode(n)
                this.canvas.addToSelection({node: node})
            })
            _.each(newData.edges, (e) => {
                let edge = this.jsToolkit.addEdge(e)
                this.canvas.addToSelection({edge: edge})
            })
            this.canvas.refresh()
        }
    }

}

module.exports = CopyPaste