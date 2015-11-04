const jsPlumb = window.jsPlumb;

class Edge {

    constructor(canvas) {
        this.canvas = canvas
    }

    getView() {
        return {
            all: {
                events: {
                    connect: (sourceId, targetId, scope, connection) => {
                            debugger
                    },
                    tap: (obj) => {
                        if(obj.e.target.getAttribute('class') == 'relationship-overlay' || obj.edge.data.direction == 'none' ) {
                            let newDirection = 'none'
                            let overlays = obj.connection.getOverlays()
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

                            _.each(overlays, (o, key) => {
                                if (o.loc == 0) {
                                    o.setVisible(left)
                                    console.log('left is visible '+left)
                                } else {
                                    o.setVisible(right)
                                    console.log('right is visible '+right)
                                }
                            })

                            this.canvas.jsToolkit.updateEdge(obj.edge)
                            this.canvas.jsRenderer.relayout()
                            this.canvas.jsRenderer.refresh()
                            this.canvas.jsToolkit.fire('dataUpdated')
                        }
                        this.canvas.clearSelection(obj)
                    },
                    contextmenu: (node, port, el, e) => {
                        debugger
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
                        width:0+'${leftSize}',
                        length:0+'${leftSize}',
                        cssClass:'relationship-overlay'
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
                parent: 'connector'
            }
        }
    }
}

module.exports = Edge