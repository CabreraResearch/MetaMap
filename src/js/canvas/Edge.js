const jsPlumb = window.jsPlumb;
const $ = require('jquery')
const _CanvasBase = require('./_CanvasBase')

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
                    mouseover: (e) => {
                        console.log("You were right; it's mouseover, not mouseenter.")
                    },
                    mouseout: (e) => {
                        console.log("You were right; it's mouseout, not mouseleave.")
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
                    margin: 0.00001,
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
                        id: "leftArrow",
                        width: '${leftSize}', //it took an age to figure out how to make this work. The `0+` part is what did it in the end (otherwise the overlays would always appear)
                        length: '${leftSize}',
                        qwidth: 10,
                        qheight: 10,
                        cssClass: 'relationship-overlay',
                        visible: "${direction == 1}",
                        events: {
                            click: function () {
                                alert("you clicked an arrow")
                            }
                        }
                    }],
                    ['Custom', {
                        create: (component) => {
                            let ret = $(`<div data-class="relationship-rthing" style="display: none; background: #B3C2C7; border-radius: 50%; visibility: hidden;"></div>`)
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
                        }
                    }],
                    [ 'PlainArrow', {
                        location: 0,
                        id: "rightArrow",
                        width: '${rightSize}',
                        length: '${rightSize}',
                        cssClass: 'relationship-overlay',
                        visible: "${direction == -1}",
                        direction: -1
                    } ]
                ],
                events: {
                    tap: (obj) => {
                        this.canvas.clearSelection(obj)

                        if (obj.e.target.getAttribute('class') == 'relationship-overlay' || obj.edge.data.direction == 'none') {
                            this.toggleRDirection(obj.e, obj.edge, obj.connection)
                            this.canvas.updateData(obj)
                        }
                        this.showRDot(obj.connection)
                        return true
                    },
                    mouseover: (params) => {
                        this.hideRDots();
                        this.showRDot(params.connection)
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

    toggleRDirection(event, edge, connection) {
        let newDirection = 'none'
        switch (edge.data.direction) {
            case 'left':
                newDirection = 'right'
                break
            case 'right':
                newDirection = 'left-right'
                break
            case 'left-right':
                newDirection = 'none'
                break
            case 'none':
                newDirection = 'left'
                break
        }
        edge.data.direction = newDirection
        edge.data.leftSize = (newDirection == 'left' || newDirection == 'left-right' ) ? this.canvas.arrowSize : 0
        edge.data.rightSize = (newDirection == 'right' || newDirection == 'left-right' ) ? this.canvas.arrowSize : 0

        //At this moment, you'd think jsPlumb has everything needed to render the overlay correctly;
        //however, simply updating the data seems to have no effect (until you refresh the page)
        //so, use the setVisible() methods to tell jsPlumb, "no, really, show/hide these things"

        let left = false
        let right = false
        switch (newDirection) {
            case 'left':
                left = true
                break
            case 'right':
                right = true
                break
            case 'left-right':
                left = true
                right = true
                break
        }

        let overlays = connection.getOverlays()
        _.each(overlays, (o, key) => {
            if (o.loc == 0) {
                if (left) {
                    o.show()
                } else {
                    o.hide()
                }
                //o.setVisible(left)
            } else {
                if (right) {
                    o.show()
                } else {
                    o.hide()
                }
            }
        })


        this.jsToolkit.updateEdge(edge)


        //I don't think these should be required, but they seem to be
        this.jsRenderer.relayout()
        this.jsRenderer.refresh()

        //This line is most likely redundant as updateEdge should implicitly do it
        this.jsToolkit.fire('dataUpdated')

        console.log('changed direction to ' + newDirection + ' the arrow should have updated in the UI')
    }

    showRDot(connection) {
        connection.getOverlay("customOverlay").show()
    }

    hideRDots() {
        /*$('.relationship-rthing')
         .css('display', 'none')
         .css('visibility', 'hidden')
         .removeClass('relationship-rthing')
         .off('dblclick')*/
        console.log("hide RDOTS; disabled temporarily by Simon")
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