const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit

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
                w: 50,
                h: 50,
                label: "idea",
                type: "idea",
                children: [

                ],
                labelPosition: [

                ],
                cssClass: "",
                perspective: {
                    has: false,
                    edges: [

                    ],
                    class: "none"
                },
                left: (window.innerWidth/2) - 50,
                top: (window.innerHeight/2) - 150,
                id: "d38a397c-69b6-4b98-a8d5-665786848ffb"
            }
            ],
            edges: [

            ],
            ports: [

            ]
        }
    }

    deleteRThing(child) {
        if (child && child.data && child.data.rthing && child.data.rthing.edgeId) {
            let edge = this.jsToolkit.getEdge(child.data.rthing.edgeId)
            edge.data.rthing = null
            this.jsToolkit.updateEdge(edge)
        }
    }

    recurse(node) {
        if (node && node.data && node.data.children) {
            _.each(node.data.children, (id, i) => {
                let child = this.jsToolkit.getNode(id)
                this.recurse(child)
            })
        }
        this.deleteRThing(node)
        if (node.data.parentId) {
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

    deleteEdge(edge) {
        if (edge && edge.data) {
            //Delete any r-things that are associated with the edges to be deleted
            if (edge.data.rthing && edge.data.rthing.nodeId) {
                let child = this.jsToolkit.getNode(edge.data.rthing.nodeId)
                this.recurse(child)
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
        selected = selected || this.jsToolkit.getSelection()
        try {
            selected.eachEdge((i, edge) => {
                this.deleteEdge(edge)
            });

            //Recurse over all children
            selected.eachNode((i, n) => {
                this.recurse(n)
            });
            this.jsToolkit.remove(selected)
        } catch (e) {
            this.metaMap.error(e)
        }
    }

    updateData(obj) {

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
                node.perspective = node.perspective || {
                    has: false,
                    edges: [],
                    class: 'none'
                }
                node.perspective.edges = node.perspective.edges || []
            })
        }
    }

}

module.exports = Schema