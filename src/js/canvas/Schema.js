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

    //
    // fires update events to the toolkit for the given node and all of its children and their children
    // etc
    //
    updateNodeAndParts(node, opts) {
        this.jsToolkit.updateNode(node);
        if (node.data.children) {
            _.each(node.data.children, (c) => {
                let child = this.jsToolkit.getNode(c)
                this.adjustType(node, child, opts)
                this.updateNodeAndParts(child, opts);
            });
        }
    }

    adjustType(parent, child, opts) {
        var depth = this.canvas.getDepth(child)
        if(opts.isRthing) {
            depth += 1
            child.data.displayType = this.node.getNextPartNodeType(child.data)
        }
        var newSize = this.canvas.getPartSizeAtDepth(depth)
        child.data.w = newSize;
        child.data.h = newSize;
        child.data.displayType = this.node.getNextPartNodeType(child.data)
        child.data.family = parent.data.family
        child.data.partAlign = parent.data.partAlign || 'left'
        this.canvas.updateData({node: child})
        this.jsRenderer.getLayout().setSize(child.id, [newSize, newSize])
    }

    /**
     * Demote an identity to a part.
     * @param  {any} source
     * @param  {any} target
     */
    attachPart(sourceNode, targetNode, event) {
        jsPlumbUtil.consume(event);
        jsPlumb.batch(() => {
            // remove from current parent, if exists
            if (sourceNode.data.parentId) {
                var sourceParent = this.jsToolkit.getNode(sourceNode.data.parentId);
                _.remove(sourceParent.data.children, (c) => {
                    return c === sourceNode.id;
                });
                this.jsToolkit.updateNode(sourceParent)
            }

            // add to new parent, change parent ref in child
            targetNode.data.children = targetNode.data.children || [];
            targetNode.data.children.push(sourceNode.id);
            sourceNode.data.parentId = targetNode.id;

            if (targetNode.data.parts.class == 'none') {
                targetNode.data.parts.class = 'open'
            }

            // find new part size
            this.adjustType(targetNode, sourceNode, { isRthing: targetNode.data.isRThing, target: targetNode })

            // update target
            this.jsToolkit.updateNode(targetNode);
            // and source and its children
            this.updateNodeAndParts(sourceNode, { isRthing: targetNode.data.isRThing, target: targetNode });
        })
        return true;
    }

    /**
     * Promote a part to an identity.
     * @param  {any} source
     * @param  {any} target
     */
    detachPart(source, target, event) {
        jsPlumbUtil.consume(event);
        jsPlumb.batch(() => {
            target.data.children = _.remove(target.data.children, (id) => {
                return id != source.data.id
            })
            if (target.data.children.length == 0) {
                target.data.parts.class = 'none'
            }
            this.canvas.updateData({ node: target })

            source.data.displayType = 'A'
            source.data.h = this.canvas.nodeSize
            source.data.w = this.canvas.nodeSize
            source.data.parentId = ''
            source.data.family = source.data.id
            source.data.labelPosition = []
            source.data.partAlign = 'left'

            if (!target.data.isRThing) {
                source.data.top = target.data.top
                source.data.left = target.data.left+100
            } else {
                source.data.top = target.data.top+150
                source.data.left = target.data.left
            }

            this.canvas.updateData({ node: source })
            this.jsRenderer.getLayout().setSize(source.data.id, [this.canvas.nodeSize, this.canvas.nodeSize])

            source.data.children = _.compact(source.data.children)
            let children = this.getAllChildren(source).jNodes
            _.each(children, (child) => {
                let parent = _.filter(children, (c) => { return c.id == child.data.parentId })[0] || source
                child.data.displayType = this.node.getPrevPartNodeType(child.data,parent.data)
                //If detaching from an R-thing, we need to go back two
                if(target.data.isRThing) {
                    child.data.displayType = this.node.getPrevPartNodeType(child.data)
                }

                let size = this.node.getSizeForPart(child.data)
                child.data.h = size
                child.data.w = size

                child.data.partAlign = 'left'
                child.data.family = source.data.id
                child.data.labelPosition = []
                child.data.children = _.compact(child.data.children)
                this.canvas.updateData({ node: child })
                this.jsRenderer.getLayout().setSize(child.data.id, [size, size])
            })
        })
        return true;
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
            if (edge.data.perspective && edge.data.perspective.nodeId) {
                let child = this.jsToolkit.getNode(edge.data.perspective.nodeId)
                child.data.perspective.edges = _.remove(child.data.perspective.edges, (id) => { return id != edge.getId() })
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
    getAllChildren(node, ret={ids: [], nodes: [], jNodes: []}) {
        if (node && node.data && node.data.children) {
            _.each(node.data.children, (id, i) => {
                if (!_.contains(ret.ids, id)) {
                    let child = this.jsToolkit.getNode(id)
                    if (child) {
                        ret.ids.push(id)
                        ret.nodes.push(child.data)
                        ret.jNodes.push(child)
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
                displayType: "A",
                type: 'idea',
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
    updateData(obj={}, opts={}) {
        if (obj.edge) {
            this.jsToolkit.updateEdge(obj.edge, opts)
        }
        if (obj.node) {
            this.jsToolkit.updateNode(obj.node, opts)
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
                    edge.data.type = 'relationship'
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
                delete edge.geometry
            })
            _.each(map.nodes, (node) => {
                node.w = node.w || this.canvas.nodeSize
                node.h = node.h || this.canvas.nodeSize
                node.label = node.label || 'idea'
                if(!node.type) {
                    node.type = 'idea'
                } else {
                    let oldType = node.type.split('_')[1]
                    if (oldType) {
                        node.displayType = oldType
                        node.type = 'idea'
                    }
                }
                node.displayType = node.displayType || 'A'
                node.children = _.compact(node.children || [])
                _.each(node.children, (id) => {
                    if (!_.any(map.nodes, (n) => {
                        return n.id == id
                    })) {
                        node.children = _.remove(node.children, id)
                    }
                })
                node.labelPosition = node.labelPosition || []
                node.cssClass = node.cssClass || ''
                node.partAlign = node.partAlign || 'left'
                node.suspendLayout = node.suspendLayout || false
                node.parts = node.parts || { class: 'none' }
                if (node.children.length == 0) {
                    node.parts.class = 'none'
                } else {
                    if (node.parts.class != 'open' || node.parts.class != 'closed') {
                        node.parts.class = 'open'
                    }
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