const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit
const jsPlumbUtil = window.jsPlumbUtil

const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')

class Schema extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

    }

    getDefaultMap() {
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
                id: jsPlumbUtil.uuid(),
                family: jsPlumbUtil.uuid()
            }],
            edges: [],
            ports: []
        }
    }

    deleteRThing(child) {
        if (child && child.data && child.data.rthing && child.data.rthing.edgeId) {
            let edge = this.jsToolkit.getEdge(child.data.rthing.edgeId)
            if(edge) {
                edge.data.rthing = null
                this.jsToolkit.updateEdge(edge)
            }
        }
    }

    getAllChildren(node, ret=[]) {
        if (node && node.data && node.data.children) {
            _.each(node.data.children, (id, i) => {
                if (!_.contains(ret, id)) {
                    let child = this.jsToolkit.getNode(id)
                    ret.push(id)
                    this.getAllChildren(child, ret)
                }
            })
        }
        return ret
    }

    getRoot(node, map) {
        let root = node
        let parent = _.find(map.nodes, (n) => { return node.id == node.parentId })
        if (parent && parent.id != root.id) {
            root = this.getRoot(parent)
        }
        return root
    }

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

    recurseDelete(node) {
        if (node) {
            if (node.data && node.data.children) {
                //break reference to array to handle mutations
                let children = _.clone(node.data.children)
                _.each(children, (id, i) => {
                    let child = this.jsToolkit.getNode(id)
                    //delete parentId before recursing for performance
                    delete child.data.parentId
                    this.recurseDelete(child)
                })
            }
            this.deleteRThing(node)
            if (node.data.parentId) {
                //In the case where we're deleting only parts, update their parents
                let parent = this.jsToolkit.getNode(node.data.parentId)
                if (parent) {
                    parent.data.children = _.remove(parent.data.children, (id) => { return id != node.data.id })
                    this.jsToolkit.updateNode(parent)
                }
            }
            _.each(node.getAllEdges(), (edge) => {
                this.deleteEdge(edge)
            })
            //Delete children before parents
            this.jsToolkit.removeNode(node)
        }
    }

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

    updateData(obj={}) {
        if (obj.edge) {
            this.jsToolkit.updateEdge(obj.edge)
        }
        if (obj.node) {
            this.jsToolkit.updateNode(obj.node)
        }
    }

    //Ensure that all changes to the data structure get populated on all objects
    upgrade(map) {
        if (map) {
            _.each(map.edges, (edge) => {
                if (edge.data.type == 'relationship') {
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

            })
            _.each(map.nodes, (node) => {
                node.w = node.w || this.canvas.nodeSize
                node.h = node.h || this.canvas.nodeSize
                node.label = node.label || 'idea'
                node.type = node.type || 'idea'
                node.children = node.children || []
                node.labelPosition = node.labelPosition || []
                node.cssClass = node.cssClass || ''
                node.partAlign = node.partAlign || 'left'
                node.suspendLayout = node.suspendLayout || false
                node.parts = node.parts || { class: 'none' }
                node.perspective = node.perspective || {
                    has: false,
                    edges: [],
                    class: 'none'
                }
                node.perspective.edges = node.perspective.edges || []
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