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
            default:{
                parent: 'all',
                anchors:['Continuous','Continuous'],

            },
            connector: {
                parent: 'all',
                connector:['StateMachine', {
                    margin: 1.01,
                    curviness:15
                }]
            },
            relationship:{
                cssClass:'edge-relationship',
                parent: 'connector',
                endpoint:'Blank',
                overlays:[
                    [ 'PlainArrow', {
                        location:1,
                        width:0+'${leftSize}', //it took an age to figure out how to make this work. The `0+` part is what did it in the end (otherwise the overlays would always appear)
                        length:0+'${leftSize}',
                        cssClass:'relationship-overlay'
                    }],
                    ['Custom', {
                        create: (component) => {
                            const id = `${component.id}_rthing`
                            this.relationshipOverlays.push(id)
                            return $(`<div id="${id}" data-class="relationship-rthing" style="display: none; background: #B3C2C7; border-radius: 50%; visibility: hidden;"></div>`);
                        },
                        location:0.5,
                        id:"customOverlay"
                    }],
                    [ 'PlainArrow', {
                        location:0,
                        width:0+'${rightSize}',
                        length:0+'${rightSize}',
                        cssClass: 'relationship-overlay',
                        direction: -1
                    } ]
                ],
                events: {
                    tap: (obj) => {
                        this.canvas.clearSelection(obj)

                        //Something of a kludge here.
                        //The custom overlays are not nested within the structure of the edge;
                        //rather, they're popped to the end of the canvas and positioned absolute
                        //so, standard CSS hover tricks won't work to show/hide this thing
                        $('#' + obj.connection.id + '_rthing')
                            .css('display', 'block')
                            .css('background', '')
                            .css('visibility', 'initial')
                            .addClass('relationship-rthing')

                        if (obj.e.target.getAttribute('class') == 'relationship-overlay' || obj.edge.data.direction == 'none') {
                            let newDirection = 'none'
                            switch (obj.edge.data.direction) {
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
                            obj.edge.data.direction = newDirection
                            obj.edge.data.leftSize = (newDirection == 'left' || newDirection == 'left-right' ) ? this.canvas.arrowSize : 0
                            obj.edge.data.rightSize = (newDirection == 'right' || newDirection == 'left-right' ) ? this.canvas.arrowSize : 0

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

                            let overlays = obj.connection.getOverlays()
                            _.each(overlays, (o, key) => {
                                if (o.loc == 0) {
                                    o.setVisible(left)
                                } else {
                                    o.setVisible(right)
                                }
                            })

                            //Update the edge
                            this.canvas.jsToolkit.updateEdge(obj.edge)

                            //I don't think these should be required, but they seem to be
                            this.canvas.jsRenderer.relayout()
                            this.canvas.jsRenderer.refresh()

                            //This line is most likely redundant as updateEdge should implicitly do it
                            this.canvas.jsToolkit.fire('dataUpdated')
                        }

                    },
                    rThingCreate: (obj) => {
                        //obj.node.data.type = 'r-thing'
                        //obj.node.setType('r-thing')
                        //Updating the node type does not seem to stick instead, create a new node
                        var d = this.canvas.jsRenderer.mapEventLocation(obj.e)
                        var edges = obj.node.getEdges()

                        d.w = edges[0].source.data.w * this.canvas.partSize
                        d.h = edges[0].source.data.h * this.canvas.partSize

                        var newNode = this.canvas.jsToolkit.addNode(jsPlumb.extend(this.canvas.node.getNewNode('r-thing'), d))

                        //re-create the edge connections on the new node
                        for (var i = 0; i < edges.length; i+=1) {
                            if(edges[i].source == obj.node) {
                                this.canvas.jsToolkit.connect({source:newNode, target:edges[i].target, data:{
                                    type:'relationship'
                                }})
                            } else if(edges[i].target == obj.node) {
                                this.canvas.jsToolkit.connect({source:edges[i].source, target:newNode, data:{
                                    type:'relationshipProxy'
                                }})
                            }
                        }

                        //delete the proxy node
                        this.canvas.jsToolkit.removeNode(obj.node)
                    }
                }
            },
            perspective:{
                cssClass:'edge-perspective',
                endpoints:[ 'Blank', [ 'Dot', { radius:5, cssClass:'orange' }]],
                parent: 'connector',
                events: {
                    tap: (obj) => {
                        this.canvas.clearSelection(obj)
                    }
                }
            }
        }
    }
}

module.exports = Edge