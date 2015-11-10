const jsPlumbToolkit = window.jsPlumbToolkit
const _CanvasBase = require('./_CanvasBase')
const _ = require('lodash')

class Toolkit extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.
        this.toolkit = jsPlumbToolkit.newInstance({
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
                            var edges = fromNode.getEdges({ filter: function (e) { return e.data.type == 'perspective' } })
                            for (var i = 0; i < edges.length; i+= 1) {
                                var ed = edges[i]
                                if ((ed.source == fromNode && ed.target == toNode) || (ed.target == fromNode && ed.source == toNode)) {
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
                                fromNode.data.perspective.edges = fromNode.data.perspective.edges || []
                                fromNode.data.perspective.class = 'open'
                                this.canvas.updateData({ node: fromNode })
                            }
                            break
                    }
                }
                return ret
            },
            saveStateOnExit:true,              // serialize state on page unload automatically. defaults to false.
            saveStateOnDrag:true,              // serialize state after each drag. defaults to false.
            stateHandle: 'metaMapCanvas_' + (canvas.mapId || canvas.mapName),
            saveState: function (...o) {
                debugger
            }
        })
    }

    bindEvents() {
        this.toolkit.bind("dataUpdated", () => {
            this.canvas.update()
            //this.canvas.dumpEdgeCounts();
            this.canvas.jsRenderer.State.save()
            this.canvas.onAutoSave()
        })
    }
}

module.exports = Toolkit