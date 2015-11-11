/**
 Drag/drop handler.
 */

const jsPlumb = window.jsPlumb;
const Biltong = window.Biltong;  // Biltong are the underlying geometry functions that jsPlumb uses.
const jsPlumbUtil = window.jsPlumbUtil;
const _ = require('lodash')
const $ = require('jquery')

class DragDropHandler {

    constructor(canvas, toolkit, getRenderer) {

        this.getDragOptions = function () {
            return {
                filter: '.donotdrag',       // can't drag nodes by the color segments.
                stop: (params) => {
                    /*                    let layout = getRenderer().getLayout()
                     if (params.el._metamapParent) {
                     let parentBounds = layout.getChildBounds(params.el._metamapParent.id),
                     r1 = {x:params.pos[0],y:params.pos[1], w:params.el.offsetWidth, h:params.el.offsetHeight},
                     r2 = {x:parentBounds.xmin, y:parentBounds.ymin, w:parentBounds.xmax-parentBounds.xmin, h:parentBounds.ymax - parentBounds.ymin};

                     if (Biltong.intersects(r1, r2)) {
                     jsPlumbUtil.consume(params.e);
                     var childPositions = layout.getChildPositions(params.el._metamapParent.id), idx = null;
                     // remove this one from child positions
                     var entry = _.remove(childPositions, function(e) { return e[2] == params.el.jtk.node; })[0];
                     for (var i = 0; i < childPositions.length; i++) {
                     if (params.pos[1] <= childPositions[i][1]) {
                     idx = i; break;
                     }
                     else if (i < childPositions.length - 1 && params.pos[1] < childPositions[i+1][1]) {
                     idx = i+1; break;
                     }
                     }

                     if (idx == null) {
                     idx = childPositions.length - 1;
                     }

                     // re-insert entry
                     childPositions.splice(idx, 0, entry);

                     // now set order in all child nodes
                     _.each(childPositions, function(cp, i) {
                     cp[2].data.order = i;
                     });

                     // save the data
                     canvas.onAutoSave(canvas.exportData())

                     }

                     params.el._metamapParent = null;
                     }
                     let info = toolkit.getObjectInfo(params.el)
                     if (info && info.obj) {
                     let node = info.obj
                     let edges = node.getEdges()
                     if (edges.length > 0) {
                     _.each(edges, (edge) => {
                     if (edge.data.rthing && edge.data.rthing.nodeId) {
                     let rnode = toolkit.getNode(edge.data.rthing.nodeId)
                     let dot = $('#' + edge.data.rthing.rDot)
                     rnode.data.left = dot.css('left').split('px')[0] - (rnode.data.h/2)
                     rnode.data.top = dot.css('top').split('px')[0] - (rnode.data.h / 2)
                     toolkit.updateNode(rnode)
                     layout.relayout()
                     }
                     })
                     }
                     }*/

                    // when _any_ node stops dragging, run the layout again.
                    // this will cause child nodes to snap to their new parent, and also
                    // cleanup nicely if a node is dropped on another node.
                    getRenderer().refresh();
                },
                start: (params) => {
                    // on start, if there is a parent, find it and stash it on the element, for us to
                    // look at on stop.
                    var node = params.el.jtk.node;
                    if (node.data.parentId != null) {
                        var parentNode = toolkit.getNode(node.data.parentId);
                        if (!parentNode.data.suspendLayout) {
                            params.el._metamapParent = parentNode;
                        }
                        else {
                            params.el._metamapParent = null;
                        }
                    }
                }
            }
        }

        //
        // fires update events to the toolkit for the given node and all of its children and their children
        // etc
        //
        function updateNodeAndParts(node, toolkit) {
            toolkit.updateNode(node);
            if (node.data.children) {
                _.each(node.data.children, function (c) {
                    updateNodeAndParts(toolkit.getNode(c), toolkit);
                });
            }
        }

        function addAsChild(sourceNode, targetNode, event) {
            jsPlumbUtil.consume(event);

            // remove from current parent, if exists
            if (sourceNode.data.parentId) {
                var sourceParent = toolkit.getNode(sourceNode.data.parentId);
                _.remove(sourceParent.data.children, function (c) {
                    return c === sourceNode.id;
                });
                toolkit.updateNode(sourceParent)
            }

            // add to new parent, change parent ref in child
            targetNode.data.children = targetNode.data.children || [];
            targetNode.data.children.push(sourceNode.id);
            sourceNode.data.parentId = targetNode.id;

            // find new part size
            var depth = canvas.getDepth(sourceNode)
            var newSize = canvas.getPartSizeAtDepth(depth)
            sourceNode.data.w = newSize;
            sourceNode.data.h = newSize;
            getRenderer().getLayout().setSize(sourceNode.id, [newSize, newSize])

            // update target
            toolkit.updateNode(targetNode);
            // and source and its children
            updateNodeAndParts(sourceNode, toolkit);

            return true;
        }

        function reorderChild(sourceNode, targetNode, params) {
            jsPlumbUtil.consume(params.e);
            let layout = getRenderer().getLayout();
            var childPositions = layout.getChildPositions(params.drag.el._metamapParent.id), idx = null;
            // here we map child positions to a list containing entries that have [ pos, delta, idx ], which we then
            // sort by delta (where delta is the distance from that node's top edge from the dropped node's top edge).
            // the first entry in this array, then, gives us the new index for the dropped node.
            let sortedLocations = (_.map(childPositions, function(cp, i) { return [cp[1], Math.abs(cp[1] - params.pos[1]), i ]; })).sort(function(a, b) {
                return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
            });
            // move the dropped node
            childPositions.splice(sortedLocations[0][2], 0, childPositions.splice(sourceNode.data.order, 1)[0]);
            // iterate through and reassign order.
            _.each(childPositions, function(cp, i) {
                toolkit.updateNode(cp[2], {
                    order:i
                });
            });
            return true;
        }

        this.getDropOptions = function () {
            return {
                drop: (params) => {
                    let sourceInfo = toolkit.getObjectInfo(params.drag.el),
                        targetInfo = toolkit.getObjectInfo(params.drop.el),
                        sourceParentId = sourceInfo.obj.data.parentId,
                        targetParentId = targetInfo.obj.data.parentId,
                        outcome = false;

                    // if parent IDs are the same...(note '==' compare here; we dont want to get caught by a null vs undefined comparison on this one)
                    if (sourceParentId == targetParentId) {
                        if (sourceParentId == null) {
                            outcome = addAsChild(sourceInfo.obj, targetInfo.obj, params.e)
                        }
                        else {
                            outcome = reorderChild(sourceInfo.obj, targetInfo.obj, params)
                        }
                    }
                    else {
                        outcome = addAsChild(sourceInfo.obj, targetInfo.obj, params.e)
                    }

                    if (outcome) {
                        getRenderer().refresh();
                    }

                    return outcome;
                },
                over: (params) => {
                    console.log("drag over", params)
                },
                out: (params) => {
                    console.log("drag out", params)
                }
            };
        }

        this.getPosseAssigner = function () {
            return function (node) {
                if (!node.data.parentId) {
                    return node.id;
                }
                else {
                    var posses = [node.id], par = node.data.parentId;
                    while (par != null) {
                        posses.push({ id: par, active: false });
                        par = toolkit.getNode(par).data.parentId;
                    }
                    return posses;
                }
            };
        };
    }
}

module.exports = DragDropHandler
