const jsPlumb = window.jsPlumb;
const $ = require('jquery')
const _ = require('lodash')

const _CanvasBase = require('./_CanvasBase')

const LEFT = "left"
const RIGHT = "right"
const BOTH = "left-right"

class Edge extends _CanvasBase {

    constructor(canvas) {
        super(canvas)
        this.relationshipOverlays = []
    }

    bindHover() {

    }

    getView() {
        return {
            all: {
                events: {
                    mouseenter: (e) => {
                        window.alert(`It's a LIE! This event is not implemented!`)
                    },
                    mouseleave: (e) => {
                        window.alert(`It's a LIE! This event is not implemented!`)
                    },
                    contextmenu: (node, port, el, e) => {
                        console.log('context click on edge')
                    }
                }
            },
            "default": {
                parent: 'all',
                anchors: ['Continuous', 'Continuous']
            },
            connector: {
                parent: 'all',
                connector: ['StateMachine', {
                    margin: 0.00001, //This seems to be the most precision that has any effect. The Edge is as close as it's going to get.
                    curviness: 15
                }]
            },
            relationship: {
                cssClass: 'edge-relationship ${id}',
                parent: 'connector',
                endpoint: 'Blank', //[ [ 'Dot', { radius:2, cssClass:'grey' }], [ 'Dot', { radius:2, cssClass:'grey' }]],
                overlays: [
                    [ 'PlainArrow', {
                        location: 1,
                        id: "left",
                        width: '${leftSize}',
                        length: '${leftSize}',
                        cssClass: 'relationship-overlay',
                        visible:function _visible(data) {
                            return data == null || (data.direction === LEFT || data.direction === BOTH)
                        }
                    }],
                    ['Custom', {
                        create: (component) => {
                            let ret = $(`<div data-class="relationship-rthing" style="background: #B3C2C7; border-radius: 50%; visibility: hidden;"></div>`)
                            let data = component.getData()
                            if (!data.nodeId && component.edge) {
                                const id = `${component.edge.data.id}_rthing`
                                this.relationshipOverlays.push(id)

                                //Unfortunately, any classes supplied here will be stripped out; so hard code the styles needed and massage them later
                                //ret = $(`<div id="${id}" data-class="relationship-rthing" style="display: none; background: #B3C2C7; border-radius: 50%; visibility: hidden;"></div>`)

                                ret = $(`<div id="${id}" data-class="relationship-rthing" style="background: #B3C2C7; border-radius: 50%; "></div>`)
                            }
                            return ret
                        },
                        location: 0.5,
                        id: "customOverlay",
                        events: {
                            tap: function () {
                                alert("hey");
                            },
                            dblclick: function (params) {
                                console.log("dblclick on RDOT overlay")
                            }
                        },
                        visible:false
                    }],
                    [ 'PlainArrow', {
                        location: 0,
                        id: "right",
                        width: '${rightSize}',
                        length: '${rightSize}',
                        cssClass: 'relationship-overlay',
                        visible:function _visible(data) {
                            return data == null || (data.direction === RIGHT || data.direction === BOTH)
                        },
                        direction: -1
                    } ]
                ],
                events: {
                    tap: (obj) => {
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

                        this.showRDot(obj.connection)
                        return true
                    },
                    mouseover: (params) => {
                        this.hideRDots();
                        this.showRDot(params.connection)
                    },
                    mouseout: (params) => {
                        this.hideRDot(params.connection);
                    }
                }
            },
            perspective: {
                cssClass: 'edge-perspective',
                endpoints: [ 'Blank', [ 'Dot', { radius: 5, cssClass: 'orange' }]],
                parent: 'connector',
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
        _.each(edge.data.direction.match(/left|right/g), function(oid) {
            connection.showOverlay(oid);
        });
    }

    showRDot(connection) {
        connection.getOverlay("customOverlay").show()
    }

    hideRDots() {
        this.jsRenderer.getJsPlumb().select().each(function(conn) {
            var o = conn.getOverlay("customOverlay");
            if (o) o.hide();
        })
    }

    hideRDot(connection) {
        connection.getOverlay("customOverlay").hide()
    }

    createRThing(obj) {
        let dot = $('#' + obj.edge.data.id + '_rthing')
        let size = obj.edge.source.data.w * this.canvas.partSize

        let d = {
            w: size,
            h: size,
            left: dot.position().left - (size / 2),
            top: dot.position().top - (size / 2)
        }

        let nodeData = jsPlumb.extend(this.canvas.node.getNewNode({ type: 'r-thing', cssClass: 'donotdrag'}), d)
        nodeData.rthing = {
            edgeId: obj.edge.data.id,
            rDot: obj.edge.data.id + '_rthing'
        }
        let newNode = this.canvas.jsToolkit.addNode(nodeData)
        obj.edge.data.rthing = {
            nodeId: newNode.id,
            rDot: obj.edge.data.id + '_rthing'
        }

        this.hideRDots()

        this.canvas.updateData({ node: newNode, edge: obj.edge })
    }

}

module.exports = Edge