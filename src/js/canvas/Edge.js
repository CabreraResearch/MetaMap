const jsPlumb = window.jsPlumb;
const $ = require('jquery')
const _ = require('lodash')

const _CanvasBase = require('./_CanvasBase')

const LEFT = "left"
const RIGHT = "right"
const BOTH = "left-right"

/**
 * @extends _CanvasBase
 */
class Edge extends _CanvasBase {

    constructor(canvas) {
        super(canvas)
        this.relationshipOverlays = []
    }

    getToolkitEvents() {
        return {
            beforeStartConnect: (fromNode, edgeType) => {
                let ret = {
                    type: edgeType
                }
                if (edgeType == 'perspective') {
                    _.extend(ret, {
                        visible: true,
                        perspective: {
                            nodeId: fromNode.id
                        }
                    })
                } else {
                    _.extend(ret, {
                        direction: 'none',
                        leftSize: 0,
                        rightSize: 0
                    })
                }
                return ret
            },
            beforeConnect: (fromNode, toNode, edgeData) => {
                var ret = true
                //Prevent self-referencing connections
                if (fromNode == toNode) {
                    ret = false
                } else {
                    //Between the same two nodes, only one perspective connection may exist
                    switch (edgeData.type) {
                        case 'perspective':
                            let edges = fromNode.getEdges({ filter: function (e) { return e.data.type == 'perspective' } })
                            for (let i = 0; i < edges.length; i += 1) {
                                let ed = edges[i]
                                if (ed.source == fromNode && ed.target == toNode) {
                                    ret = false
                                    break
                                }
                            }

                            if (ret) {
                                fromNode.data.perspective = fromNode.data.perspective || {
                                    has: true,
                                    edges: [],
                                    class: 'open'
                                }
                                fromNode.data.perspective.has = true
                                if (edgeData.id && !_.contains(fromNode.data.perspective.edges)) {
                                    fromNode.data.perspective.edges = fromNode.data.perspective.edges || []
                                    fromNode.data.perspective.edges.push(edgeData.id)
                                }
                                fromNode.data.perspective.class = 'open'
                                this.canvas.updateData({ node: fromNode })
                            }
                            break
                        case 'relationship':

                            break
                    }
                }
                return ret
            }
        }
    }

    getView() {
        return {
            all: {
                events: {
                    contextmenu: (node, port, el, e) => {
                        console.log('context click on edge')
                    }
                }
            },
            "default": {
                parent: 'all',
                anchors: ['Continuous', 'Continuous']
            },
            relationship: {
                parent: 'relationshipParent',
                connector: ['StateMachine', {
                    margin: 0.00001, //This seems to be the most precision that has any effect. The Edge is as close as it's going to get.
                    curviness: -1
                }]
            },
            relationshipParent: {
                cssClass: 'edge-relationship ${id}',
                parent: 'all',
                endpoint: 'Blank', //[ [ 'Dot', { radius:2, cssClass:'grey' }], [ 'Dot', { radius:2, cssClass:'grey' }]],
                overlays: [
                    ['PlainArrow', {
                        location: 1,
                        id: "left",
                        width: 5,
                        length: 5,
                        cssClass: 'relationship-overlay',
                        visible: function _visible(data) {
                            return data == null || (data.direction === LEFT || data.direction === BOTH)
                        }
                    }],
                    ['Custom', {
                        create: (component) => {
                            let id = ''
                            if (component.edge) {
                                id = component.edge.getId()
                            }
                            else if(component.getData) {
                                id = component.getData().id
                            }

                            if(id) {
                                id = `${id}_rthing`
                                let data = component.getData()
                                if (!data.nodeId && component.edge) {
                                    this.relationshipOverlays.push(id)
                                }
                            }
                            return $(`<div id="${id}" data-class="relationship-rthing"></div>`)
                        },
                        location: 0.5,
                        id: "customOverlay",
                        events: {
                            dblclick: _.throttle((params) => {
                                this.node.createRThing(params)
                            }, 100)
                        },
                        visible: true
                    }],
                    ['PlainArrow', {
                        location: 0,
                        id: "right",
                        width: 5,
                        length: 5,
                        cssClass: 'relationship-overlay',
                        visible: function _visible(data) {
                            return data == null || (data.direction === RIGHT || data.direction === BOTH)
                        },
                        direction: -1
                    }]
                ],
                events: {
                    tap: (obj) => {
                        let target = obj.e.target
                        //Ignore this event if we're clicking on the r-dot
                        if (!target.dataset || target.dataset.class != 'relationship-rthing') {
                            //Before we set this as the selected edge, get the current selection
                            let selected = this.jsToolkit.getSelection()
                            //If there is only one selected edge, proceed
                            if (selected.getEdgeCount() == 1) {
                                let isSelected = false
                                selected.eachEdge((idx, edge) => {
                                    if (edge.data.id == obj.edge.data.id) {
                                        isSelected = true
                                    }
                                })
                                //if the selected edge is this edge, this is the 2nd (or greater) click
                                if (isSelected) {
                                    this.toggleRDirection(obj.e, obj.edge, obj.connection)
                                    this.canvas.updateData(obj)
                                }
                            }
                            //Now set the selection
                            this.canvas.clearSelection(obj)

                            // SP: for now, an edge click puts it into edit mode. we have various options
                            // with this
                            //this.jsRenderer.startEditing(obj.edge, { mode:"dual" })

                            this.showRDot(obj)
                        }
                        return true
                    },
                    dblclick: _.throttle((obj) => {
                        if(obj.edge && (!obj.edge.data.rthing || !obj.edge.data.rthing.edgeId) && _.contains(obj.e.target.className, 'relationship-rthing')) {
                            this.node.createRThing(obj)
                        }
                    }, 100),
                    mouseover: (params) => {
                        this.hideRDots();
                        this.showRDot(params)
                    },
                    mouseout: (params) => {
                        this.hideRDot(params);
                    }
                }
            },
            perspective: {
                cssClass: 'edge-perspective',
                endpoints: ['Blank', ['Dot', { radius: 3, cssClass: 'orange' }]],
                parent: 'all',
                anchors: ['Continuous', 'Continuous'],
                connector: ['Straight'],
                events: {
                    tap: (obj) => {
                        this.canvas.clearSelection(obj)
                    }
                }
            }
        }
    }

    /**
     * Toggle the 'direction' value for the edge, hiding and showing related overlays as necessary.
     * @param event
     * @param edge
     * @param connection
     */
    toggleRDirection(event, edge, connection) {

        let currentDirection = edge.data.direction || "none";
        connection.hideOverlays();       // hide everything and then selectively show below
        // the updateXXXX methods take a second argument that provides the updates - you do not need to manually
        // set values in the data and then call update.
        this.jsToolkit.updateEdge(edge, {
            direction: ({
                "none": "left",
                "left": "right",
                "right": "left-right",
                "left-right": "none"
            })[currentDirection]
        });
        // show the overlays we need.  use a little regex for this. the values map to the `id` values
        // of the overlays defined in the relationship edge type.
        _.each(edge.data.direction.match(/left|right/g), function (oid) {
            connection.showOverlay(oid);
        });
    }

    showRDot(params) {
        let connection = params.connection
        if (params.edge && (!params.edge.data.rthing || !params.edge.data.rthing.nodeId)) {
            let o = connection.getOverlay("customOverlay")
            if (o) {
                o.addClass('relationship-rthing-visible')
                o.show()
            }
        }
    }

    hideRDots() {
        this.jsRenderer.getJsPlumb().select().each(function (conn) {
            var o = conn.getOverlay("customOverlay");
            if (o) {
                o.removeClass('relationship-rthing-visible')
            }
        })
    }

    hideRDot(params) {
        let connection = params.connection
        let isSelected = false
        let sel = this.jsToolkit.getSelection()
        sel.eachEdge((i, edge) => {
            isSelected = isSelected || edge.data.id == params.edge.data.id
        })
        if (!isSelected) {
            var o = connection.getOverlay("customOverlay");
            if (o) {
                o.removeClass('relationship-rthing-visible')
            }
        }
    }

    onAdded(obj) {
        if (obj.edge.data.type == 'perspective') {
            if (obj.edge.data.id && !_.contains(obj.edge.source.data.perspective.edges, obj.edge.data.id)) {
                obj.edge.source.data.perspective.edges = obj.edge.source.data.perspective.edges || []
                obj.edge.source.data.perspective.edges.push(obj.edge.data.id)
                this.canvas.updateData({ node: obj.edge.source })
            }
            //Kludge: for some reason, dragging from the P button toggles the eye class back to open
            //This is probably desirable, but I have no idea why it's happening
            //Creating a new perspective should then just show all perspectives
            if (obj.edge.source.data.perspective.class == 'open') {
                _.each(obj.edge.source.data.perspective.edges, (edgeId) => {
                    let edge = this.jsToolkit.getEdge(edgeId)
                    if (edge) {
                        edge.data.visible = true
                        this.jsRenderer.setVisible(edge, true)
                    }
                })
            }
        }
        else if (obj.addedByMouse && obj.edge.data.type == 'relationship') {
            // set the ID of the r-dot's DOM element; it is used on drag stop (in DragDrop) to update
            // the position of the related r-thing.
            let conn = this.jsRenderer.getRenderedConnection(obj.edge.getId())
            let overlay = conn.getOverlay("customOverlay")
            overlay.canvas.setAttribute("id", `${obj.edge.data.id}_rthing`)
        }
        if (!obj.edge.data.family && obj.edge.source.data.family == obj.edge.target.data.family) {
            obj.edge.data.family = obj.edge.source.data.family
        }
        //Kludge: this seems like a bit of a hack, but there isn't another way AFAIK to persist visibility on an edge
        if (obj.edge.data.visible === false) {
            this.jsRenderer.setVisible(obj.edge, false)
        }
        return obj
    }


}

module.exports = Edge