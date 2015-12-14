const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit
const jsPlumbUtil = window.jsPlumbUtil

const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')
const DragDrop = require('./DragDrop')

/**
 * @extends _CanvasBase
 */
class Schema extends _CanvasBase {
    /**
     * @param  {Canvas} canvas
     */
    constructor(canvas) {
        super(canvas)

    }

    /**
     * Demote an identity to a part. Safely clones the identity (and any children) to a new structure.
     * @param  {any} source
     * @param  {any} target
     */
    attachPart(source, target) {
        if (source && target) {
            jsPlumb.batch(() => {
                // remove from current parent, if exists
                if (source.data.parentId) {
                    var sourceParent = this.jsToolkit.getNode(source.data.parentId);
                    _.remove(sourceParent.data.children, (c) => {
                        return c === source.id;
                    });
                    this.jsToolkit.updateNode(sourceParent)
                }

                let children = this.getAllChildren(source).nodes
                _.each(children, (child) => {
                    child.type = this.node.getNextPartNodeType(child)
                    //If attaching to an R-thing, we need to go back two
                    if(target.data.isRThing) {
                        child.type = this.node.getNextPartNodeType(child)
                    }
                    let size = this.node.getSizeForPart(child)
                    child.h = size
                    child.w = size
                    child.family = target.data.id
                    child.left = ''
                    child.top = ''
                    child.partAlign = target.data.partAlign || 'left'
                })
                let nodes = [source.data].concat(children)
                source.data.type = this.node.getNextPartNodeType(target.data)
                let size = this.node.getSizeForPart(source.data)
                source.data.h = this.canvas.nodeSize
                source.data.w = this.canvas.nodeSize
                source.data.parentId = target.data.id
                source.data.family = target.data.family
                source.data.w = size
                source.data.h = size
                source.data.left = ''
                source.data.top = ''
                source.data.partAlign = target.data.partAlign || 'left'

                let allEdges = this.getAllEdges()
                let nodeIds = _.map(nodes, (n) => { return n.id })
                let edges = _.map(_.filter(allEdges, (e) => {
                    return _.contains(nodeIds, e.source) || _.contains(nodeIds, e.target)
                }, (e) => {
                    return e.data
                }))

                let callbacks = {
                    beforeNodeCallback: _.noop,
                    beforeEdgeCallback: (edge, idMap, data) => {
                        if (edge && edge.data.rthing && edge.data.rthing.nodeId && !idMap[edge.data.rthing.nodeId]) {
                            let node = this.jsToolkit.getNode(edge.data.rthing.nodeId)
                            if (node) {
                                idMap[edge.data.rthing.nodeId] = jsPlumbUtil.uuid()
                                data.nodes.push(node.data)
                            }
                        }
                    },
                    postprocess: (oldData, idMap, newData) => {
                        _.each(newData.edges, (edge) => {
                            if (edge && edge.data.rthing && edge.data.rthing.nodeId) {
                                _.delay(() => {
                                    DragDrop.repositionRthingOnEdge(edge, this.canvas)
                                }, 250)
                            }
                        })
                    }
                }

                let parts = this.copyPaste.clone({ nodes: nodes, edges: edges }, callbacks)
                this.deleteNode(source)
                let root = this.getRoot(parts.nodes[0], this.canvas.exportData())

                target.data.children.push(root.id)
                this.canvas.updateData({ node: target })

                let node = this.jsToolkit.getNode(root.id)
                this.updateEdgeTypes(node)
            })
        }
    }

    /**
     * Promote a part to an identity. Safely clones the part (and any children) to a new structure.
     * @param  {any} source
     * @param  {any} target
     */
    detachPart(source, target) {
        if (source && target) {
            jsPlumb.batch(() => {
                target.data.children = _.remove(target.data.children, (id) => {
                    return id != source.data.id
                })
                this.canvas.updateData({ node: target })

                source.children = _.compact(source.children)
                let children = this.getAllChildren(source).nodes
                _.each(children, (child) => {
                    child.type = this.node.getPrevPartNodeType(child)
                    //If detaching from an R-thing, we need to go back two
                    if(target.data.isRThing) {
                        child.type = this.node.getPrevPartNodeType(child)
                    }
                    let size = this.node.getSizeForPart(child)
                    child.h = size
                    child.w = size
                    child.left = ''
                    child.top = ''
                    child.family = source.data.id
                    child.labelPosition = []
                    child.children = _.compact(child.children)
                })
                let nodes = [source.data].concat(children)
                source.data.type = 'idea_A'
                source.data.h = this.canvas.nodeSize
                source.data.w = this.canvas.nodeSize
                source.data.parentId = ''
                source.data.family = source.data.id
                source.data.labelPosition = []

                if (!target.data.isRThing) {
                    source.data.top = target.data.top
                    source.data.left = target.data.left+100
                } else {
                    source.data.top = target.data.top+150
                    source.data.left = target.data.left
                }

                let allEdges = this.getAllEdges()
                let nodeIds = _.map(nodes, (n) => { return n.id })
                let edges = _.map(_.filter(allEdges, (e) => {
                    return _.contains(nodeIds, e.source) || _.contains(nodeIds, e.target)
                }, (e) => {
                    return e.data
                }))

                this.copyPaste.clone({ nodes: nodes, edges: edges })
                _.each(nodes, (node) => {
                    this.delete({ node: node })
                })
            })
        }
    }

    /**
     * Delete an object (edge or node)
     * @param  {any} obj
     */
    delete(obj) {
        if (obj) {
            if (obj.node) {
                this.jsToolkit.removeNode(obj.node)
            }
            if (obj.edge) {
                this.deleteEdge(obj.edge)
            }
        }
    }
    /**
     * Delete everything in the current selection
     * @param  {any} selected
     */
    deleteAll(selected) {
        jsPlumb.batch(() => {
            selected = selected || this.jsToolkit.getSelection()
            try {
                selected.eachEdge((i, edge) => {
                    this.deleteEdge(edge)
                });

                //Recurse over all children
                selected.eachNode((i, n) => {
                    this.recurseDelete(n)
                });
                this.jsToolkit.remove(selected)
            } catch (e) {
                this.metaMap.error(e)
            }
        })
    }


    /**
     * Safely delete an edge. Handles R-things and perspectives.
     * @param  {any} edge
     */
    deleteEdge(edge) {
        if (edge && edge.data) {
            //Delete any r-things that are associated with the edges to be deleted
            if (edge.data.rthing && edge.data.rthing.nodeId) {
                let child = this.jsToolkit.getNode(edge.data.rthing.nodeId)
                this.recurseDelete(child)
            }
            if (edge.data.perspective && edge.data.perspective.has && edge.data.perspective.nodeId) {
                let child = this.jsToolkit.getNode(edge.data.perspective.nodeId)
                child.data.perspective.edges = _.remove(child.data.perspective.edges, (id) => { return id != edge.data.id })
                child.data.perspective.has = child.data.perspective.edges.length > 0
                child.data.perspective.class = (child.data.perspective.has) ? child.data.perspective.class : 'none'
                this.jsToolkit.updateNode(child)
            }
            this.jsToolkit.removeEdge(edge)
        }
    }


    /**
     * Safely delete a node and it's descendants
     * @param  {any} node
     */
    deleteNode(node) {
        if(node && node.data) {
            this.recurseDelete(node)
        }
    }

    /**
     * Safely delete an R-thing from an edge
     * @param  {object} child
     */
    deleteRThing(child) {
        if (child && child.data && child.data.rthing && child.data.rthing.edgeId) {
            let edge = this.jsToolkit.getEdge(child.data.rthing.edgeId)
            if(edge) {
                edge.data.rthing = {}
                this.jsToolkit.updateEdge(edge)
            }
        }
    }

    /**
     * For a given node, get all its children
     * @param  {object} node
     * @param  {object} ret
     */
    getAllChildren(node, ret={ids: [], nodes: []}) {
        if (node && node.data && node.data.children) {
            _.each(node.data.children, (id, i) => {
                if (!_.contains(ret.ids, id)) {
                    let child = this.jsToolkit.getNode(id)
                    if (child) {
                        ret.ids.push(id)
                        ret.nodes.push(child.data)
                        this.getAllChildren(child, ret)
                    } else {
                        //TODO: should probably delete the reference
                    }
                }
            })
        }
        return ret
    }

    /**
     * Get all edges
     */
    getAllEdges() {
        let data = this.canvas.exportData()
        return data.edges
    }

    /**
     * Get an map with a single node to start with
     */
    getDefaultMap() {
        let id = jsPlumbUtil.uuid()
        return {
            nodes: [{
                w: this.canvas.nodeSize,
                h: this.canvas.nodeSize,
                label: "idea",
                type: "idea_A",
                children: [],
                labelPosition: [],
                cssClass: "",
                perspective: {
                    has: false,
                    edges: [],
                    class: "none"
                },
                left: (window.innerWidth/2) - 50,
                top: (window.innerHeight/2) - 150,
                id: id,
                family: id
            }],
            edges: [],
            ports: []
        }
    }
    /**
     * For any given node, return the root
     * @param  {any} node
     * @param  {any} map
     */
    getRoot(node, map) {
        let root = node
        let parent = _.find(map.nodes, (n) => { return node.id == node.parentId })
        if (parent && parent.id != root.id) {
            root = this.getRoot(parent)
        }
        return root
    }
    /**
     * Recurse over the hierarchy, executing a callback for each child
     * @param  {any} node
     * @param  {any} map
     * @param  {any} callback
     */
    recurse(node, map, callback) {
        if (node && map && callback) {
            if (node && node.children) {
                //break reference to array to handle mutations
                let children = _.clone(node.children)
                _.each(children, (id, i) => {
                    let child = _.find(map.nodes, (n) => { return n.id == id })
                    if (child) {
                        this.recurse(child, map, callback)
                    }
                })
            }
            callback(node)
        }
    }

    /**
     * Recursively delete a node and all of its children
     * @param  {any} node
     */
    recurseDelete(node) {
        if (node) {
            if (node.data && node.data.children) {
                //break reference to array to handle mutations
                let children = _.clone(node.data.children)
                _.each(children, (id, i) => {
                    let child = this.jsToolkit.getNode(id)
                    //delete parentId before recursing for performance
                    if(child) {
                        delete child.data.parentId
                        this.recurseDelete(child)
                    }
                })
            }
            this.deleteRThing(node)
            if (node.data.parentId) {
                //In the case where we're deleting only parts, update their parents
                let parent = this.jsToolkit.getNode(node.data.parentId)
                if (parent) {
                    parent.data.children = _.remove(parent.data.children, (id) => { return id != node.data.id })
                    if (parent.data.children.length == 0) {
                        parent.data.parts.class = 'none'
                    }
                    this.jsToolkit.updateNode(parent)
                }
            }
            _.each(node.getAllEdges(), (edge) => {
                this.delete({ edge: edge })
            })
            //Delete children before parents
            this.delete({ node: node })
        }
    }


    /**
     * Update a node or an edge
     * @param  {any} obj={}
     */
    updateData(obj={}) {
        if (obj.edge) {
            this.jsToolkit.updateEdge(obj.edge)
        }
        if (obj.node) {
            this.jsToolkit.updateNode(obj.node)
        }
    }

    updateEdgeTypes(node) {
        if(node) {
            let edges = node.getAllEdges()
            _.each(edges, (edge) => {
                if (edge.source.data.family == edge.target.data.family) {
                    if(edge.data.type != 'relationshipPart')  {
                        this.jsToolkit.setType(edge, "relationshipPart")
                        this.canvas.updateData({ edge: edge })
                    }
                } else {
                    if(edge.data.type != 'relationship')  {
                        this.jsToolkit.setType(edge, "relationship")
                        this.canvas.updateData({ edge: edge })
                    }
                }
            })
            if (node.data.children > 0) {
                _.each(node.data.children, (c) => {
                    let child = this.jsToolkit.getNode(c)
                    this.updateEdgeTypes(child)
                })
            }
        }
    }

    /**
     * Ensure that all changes to the data structure get populated on all objects.
     * Whenever the data model is updated, checks should be added here to guarantee backwards compatibility
     * @param  {any} map
     */
    upgrade(map) {
        if (map) {
            _.each(map.edges, (edge) => {
                if (edge.data.type == 'relationship' || edge.data.type == 'relationshipPart') {
                    edge.data.direction = edge.data.direction || 'none'
                    edge.data.leftSize = edge.data.leftSize || 0
                    edge.data.rightSize = edge.data.rightSize || 0
                } else {
                    delete edge.data.direction
                    delete edge.data.leftSize
                    delete edge.data.rightSize
                }
                if (edge.data.visible !== true || edge.data.visible !== false) {
                    edge.data.visible = true
                }
                delete edge.data.geometry
            })
            _.each(map.nodes, (node) => {
                node.w = node.w || this.canvas.nodeSize
                node.h = node.h || this.canvas.nodeSize
                node.label = node.label || 'idea'
                node.type = node.type || 'idea'
                node.children = _.compact(node.children || [])
                node.labelPosition = node.labelPosition || []
                node.cssClass = node.cssClass || ''
                node.partAlign = node.partAlign || 'left'
                node.suspendLayout = node.suspendLayout || false
                node.parts = node.parts || { class: 'none' }
                if (node.children.length == 0) {
                    node.parts.class = 'none'
                }
                node.perspective = node.perspective || {
                    has: false,
                    edges: [],
                    class: 'none'
                }
                node.perspective.edges = _.compact(node.perspective.edges || [])
                node.isRThing = true == (node.rthing && null != node.rthing.edgeId)

                if (!node.family) {
                    let root = this.getRoot(node, map)
                    if (!root.family) {
                        root.family = jsPlumbUtil.uuid()
                    }
                    if (root) {
                        this.recurse(root, map, (child) => {
                            child.family = root.family
                        })
                    }
                }
            })
        }
    }

}

module.exports = Schema