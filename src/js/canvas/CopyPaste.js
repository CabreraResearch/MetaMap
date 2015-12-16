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
     * @param  {object} callbacks
     */
    clone(data, opts={ beforeNodeCallback: null, beforeEdgeCallback: null, preprocess: null, postprocess: null }) {
        let newData = {
            nodes: [],
            edges: []
        }
        if (data) {
            jsPlumb.batch(() => {
                let idMap = {}
                let bounds = {}
                //1. Match each existing node id to a new UUID
                _.each(data.nodes, (node) => {
                    idMap[node.id] = jsPlumbUtil.uuid()
                    if(!bounds.left) bounds.left = node.left
                    if(!bounds.right) bounds.right = node.left
                    if(!bounds.top) bounds.top = node.top
                    if(!bounds.bottom) bounds.bottom = node.top

                    if(node.left < bounds.left) bounds.left = node.left
                    if(node.left > bounds.right) bounds.right = node.left
                    if(node.top < bounds.top) bounds.top = node.top
                    if(node.top > bounds.bottom) bounds.bottom = node.top
                    if(opts.beforeNodeCallback) opts.beforeNodeCallback(node, idMap, data)
                })
                //2. Match each existing edge id to a new UUID
                _.each(data.edges, (edge) => {
                    idMap[edge.data.id] = jsPlumbUtil.uuid()
                    if(opts.beforeEdgeCallback) opts.beforeEdgeCallback(edge, idMap, data)
                })

                if(opts.preprocess) opts.preprocess(idMap, data)

                //3: Map the selected nodes to new objects
                newData.nodes = _.map(data.nodes, (node) => {
                    let ret = _.clone(node, true)
                    ret.children = []
                    ret.left = ''
                    ret.top = ''
                    ret.id = idMap[node.id]
                    ret.labelPosition = []
                    ret.order = ret.order || 0
                    ret.rthing = ret.rthing || {}
                    ret.perspective = { edges: [], class: 'none', has: false },
                    ret.suspendLayout = ret.suspendLayout || false,
                    ret.parts = { class: 'none' }

                    //update parent keys
                    if (node.parentId) {
                        ret.parentId = idMap[node.parentId] || node.parentId
                    }

                    //update child keys
                    _.each(node.children, (childId) => {
                        if(childId && idMap[childId]) {
                            ret.children.push(idMap[childId])
                        }
                    })

                    ret.children = _.compact(ret.children)
                    if (ret.children.length > 0) {
                        ret.parts.class = 'open'
                    }

                    if(ret.isRThing) {
                        let id = idMap[ret.rthing.edgeId] || node.rthing.edgeId
                        ret.rthing.edgeId = id
                        ret.rthing.rDot = ret.id+'_rthing'
                    }

                    //update perspective edges
                    if(node.perspective) {
                        _.each(node.perspective.edges, (edgeId) => {
                            if(edgeId && idMap[edgeId]) {
                                ret.perspective.edges.push(idMap[edgeId])
                                ret.perspective.has = node.perspective.has
                                ret.perspective.class = node.perspective.class
                            }
                        })
                    }
                    if (node.left) {

                        let leftAdjust = Math.abs(bounds.left-bounds.right)+(node.w*2)
                        let topAdjust = Math.abs(bounds.top-bounds.bottom)+(node.w*2)
                        if(leftAdjust <= topAdjust) {
                            ret.top = node.top
                            ret.left = node.left + leftAdjust
                        } else {
                            ret.left = node.left
                            ret.top = node.top + topAdjust
                        }
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
                        let id = idMap[edge.data.rthing.nodeId] || edge.data.rthing.nodeId
                        ret.data.rthing = {
                            nodeId: id,
                            rDot: id + '_rthing'
                        }
                    }

                    if (edge.data.perspective && edge.data.perspective.nodeId) {
                        ret.data.perspective = {
                            nodeId: idMap[edge.data.perspective.nodeId] || edge.data.perspective.nodeId
                        }
                    }
                    return ret
                })

                this.canvas.clearSelection({ e: {} })
                let newNodes = {}
                _.each(newData.nodes, (node) => {
                    if(opts.afterNodeCallback) opts.afterNodeCallback(node, idMap, newData)
                    if (!node.parentId) {
                        node.family = node.id
                        if (node.children.length > 0) {
                            this.schema.recurse(node, data, (child) => {
                                child.family = node.id
                            })
                        }
                    }
                    newNodes[node.id] = this.jsToolkit.addNode(node)
                    this.canvas.addToSelection({ node: newNodes[node.id], el: this.jsRenderer.getRenderedElement(newNodes[node.id]) })
                    _.delay(()=>{
                        this.canvas.addToSelection({ node: newNodes[node.id], el: this.jsRenderer.getRenderedElement(newNodes[node.id]) })
                    }, 250)
                })
                newData.jsNodes = newNodes
                _.each(newData.edges, (e) => {
                    if(opts.afterEdgeCallback) opts.afterEdgeCallback(e, idMap, newData)
                    if (newNodes[e.source] && newNodes[e.target]) {
                        let edge = this.jsToolkit.addEdge(e)
                        this.canvas.addToSelection({ edge: edge })
                    } else {
                        let target = this.jsToolkit.getNode(e.target)
                        let source = this.jsToolkit.getNode(e.source)
                        if (source && target) {
                            let edge = this.jsToolkit.addEdge(e)
                            this.canvas.addToSelection({ edge: edge, el: this.jsRenderer.getRenderedElement(edge) })
                        }
                    }
                })

                if (opts.postprocess) {
                    opts.postprocess(data, idMap, newData)
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

            let callbacks = {
                beforeNodeCallback: (node, idMap, data) => {
                    let isRthing = node.isRThing
                    if(isRthing) {
                        let edge = _.find(data.edges, (e) => { return e.id == node.rthing.edgeId })
                        let e = null
                        if(!edge) {
                            e = this.jsToolkit.getEdge(node.rthing.edgeId)
                            if(e) {
                                edge = {
                                    data: e.data,
                                    source: e.source.data.id,
                                    target: e.target.data.id
                                }
                            }
                        }
                        if(edge) {
                            let target, source
                            if(!idMap[edge.target]) {
                                target = this.jsToolkit.getNode(edge.target)
                            }
                            if(!idMap[edge.source]) {
                                source = this.jsToolkit.getNode(edge.source)
                            }
                            if ((target || idMap[edge.target]) && (source || idMap[edge.source])) {
                                data.edges.push(edge)
                            }
                            if(target && source) {
                                idMap[target.data.id] = jsPlumbUtil.uuid()
                                data.nodes.push(target.data)
                                idMap[source.data.id] = jsPlumbUtil.uuid()
                                data.nodes.push(source.data)
                            }
                        }
                    }
                },
                beforeEdgeCallback: (edge, idMap, data) => {
                    if(edge.rthing && edge.rthing.nodeId) {
                        if(!idMap[edge.rthing.nodeId]) {
                            let node = this.jsToolkit.getNode(edge.rthing.nodeId)
                            if(node) {
                                callbacks.beforeNodeCallback(node, idMap, data)
                                data.nodes.push(node.data)
                                idMap[node.id] = jsPlumbUtil.uuid()
                                let children = this.schema.getAllChildren(node).nodes
                                _.each(children, (c) => {
                                    if(!_.any(data.nodes), (n) => { return n.id == c.id }) {
                                        data.nodes.push(c)
                                        idMap[c.id] = jsPlumbUtil.uuid()
                                    }
                                })
                            }
                        }
                    }
                }
            }

            let newData = this.clone(data, callbacks)
            this.canvas.mode = 'select'
            this._copyData = newData
        }
    }

}

module.exports = CopyPaste