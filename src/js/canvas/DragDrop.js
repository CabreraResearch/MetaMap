/**
 Drag/drop handler.
*/

const jsPlumb = window.jsPlumb;
const Biltong = window.Biltong;  // Biltong are the underlying geometry functions that jsPlumb uses.
const jsPlumbUtil = window.jsPlumbUtil;
const _ = require('lodash');
const $ = require('jquery');

const _CanvasBase = require('./_CanvasBase')

class DragDropHandler extends _CanvasBase {

    constructor(canvas, toolkit, getRenderer) {
        super(canvas)
    }

    getDragOptions() {
        return {
            filter: '.donotdrag, .name',       // can't drag nodes by the color segments.
            stop: (params) => {

                // when any two nodes with a relationship and an r-thing between them move
                // this should update the position of the r-thing to be the same as the r-dot overlay
                let info = this.jsToolkit.getObjectInfo(params.el)
                if (info && info.obj) {
                    let node = info.obj
                    let edges = node.getEdges()
                    if (edges.length > 0) {
                        let renderer = this.jsRenderer
                        _.each(edges, (edge) => {
                            if (edge.data.rthing && edge.data.rthing.nodeId) {
                                let rnode = this.jsToolkit.getNode(edge.data.rthing.nodeId),
                                    rnodeEl = renderer.getRenderedElement(rnode);
                                let dotNode = document.getElementById(edge.data.rthing.rDot)
                                if (dotNode) {
                                    let dot = $(dotNode),
                                        left = dot.css('left').split('px')[0] - (rnode.data.w / 2),
                                        top = dot.css('top').split('px')[0] - (rnode.data.h / 2);

                                    this.jsToolkit.updateNode(rnode, {
                                        left: left,
                                        top: top
                                    });
                                    renderer.setAbsolutePosition(rnodeEl, [left, top])
                                }
                            }
                        })
                    }
                }

                // when _any_ node stops dragging, run the layout again.
                // this will cause child nodes to snap to their new parent, and also
                // cleanup nicely if a node is dropped on another node.
                // but note that we do this outside the current run through the event loop,
                // as we want to allow jsplumb to finish doing everything it needs.
                window.setTimeout(this.jsRenderer.refresh, 0);
            },
            start: (params) => {

                if (this.canvas.mode != 'select' || !_.contains(params.el.className, 'jtk-surface-selected-element')) {
                    this.canvas.clearSelection({ el: params.el, node: params.el.jtk.node, e: params.e || {} })
                }

                // on start, if there is a parent, find it and stash it on the element, for us to
                // look at on stop.
                var node = params.el.jtk.node;
                if (node.data.parentId != null) {
                    var parentNode = this.jsToolkit.getNode(node.data.parentId);
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
    updateNodeAndParts(node) {
        this.jsToolkit.updateNode(node);
        if (node.data.children) {
            _.each(node.data.children, (c) => {
                let child = this.jsToolkit.getNode(c)
                this.adjustType(node, child)
                this.updateNodeAndParts(child);
            });
        }
    }

    adjustType(parent, child) {
        var depth = this.canvas.getDepth(child)
        var newSize = this.canvas.getPartSizeAtDepth(depth)
        child.data.w = newSize;
        child.data.h = newSize;
        child.data.type = this.node.getPartNodeType(child.data)
        this.jsRenderer.getLayout().setSize(child.id, [newSize, newSize])
    }

    addAsChild(sourceNode, targetNode, event) {
        jsPlumbUtil.consume(event);

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

        // find new part size
        this.adjustType(targetNode, sourceNode)

        // update target
        this.jsToolkit.updateNode(targetNode);
        // and source and its children
        this.updateNodeAndParts(sourceNode);

        return true;
    }

    reorderChild(sourceNode, targetNode, params) {
        jsPlumbUtil.consume(params.e);
        let layout = this.jsRenderer.getLayout();
        var childPositions = layout.getChildPositions(params.drag.el._metamapParent.id), idx = null;
        // here we map child positions to a list containing entries that have [ pos, delta, idx ], which we then
        // sort by delta (where delta is the distance from that node's top edge from the dropped node's top edge).
        // the first entry in this array, then, gives us the new index for the dropped node.
        let sortedLocations = (_.map(childPositions, (cp, i) => { return [cp[1], Math.abs(cp[1] - params.pos[1]), i]; })).sort((a, b) => {
            return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
        });
        // move the dropped node
        childPositions.splice(sortedLocations[0][2], 0, childPositions.splice(sourceNode.data.order, 1)[0]);
        // iterate through and reassign order.
        _.each(childPositions, (cp, i) => {
            this.jsToolkit.updateNode(cp[2], {
                order: i
            });
        });
        return true;
    }

    getDropOptions() {
        return {
            drop: (params) => {
                let sourceInfo = this.jsToolkit.getObjectInfo(params.drag.el),
                    targetInfo = this.jsToolkit.getObjectInfo(params.drop.el),
                    sourceParentId = sourceInfo.obj.data.parentId,
                    targetParentId = targetInfo.obj.data.parentId,
                    outcome = false;

                // if parent IDs are the same...(note '==' compare here; we dont want to get caught by a null vs undefined comparison on this one)
                if (sourceParentId == targetParentId) {
                    if (sourceParentId == null) {
                        outcome = this.addAsChild(sourceInfo.obj, targetInfo.obj, params.e)
                    }
                    else {
                        outcome = this.reorderChild(sourceInfo.obj, targetInfo.obj, params)
                    }
                }
                else {
                    outcome = this.addAsChild(sourceInfo.obj, targetInfo.obj, params.e)
                }

                if (outcome) {
                    this.jsRenderer.refresh();
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

    getPosseAssigner() {
        return (node) => {
            if (!node.data.parentId) {
                return node.id;
            }
            else {
                var posses = [node.id], par = node.data.parentId;
                if (this.jsToolkit.getNode(par)) {
                    while (par != null) {
                        posses.push({ id: par, active: false });
                        let parent = this.jsToolkit.getNode(par)
                        if (parent && par != node.data.parentId) {
                            par = node.data.parentId;
                        } else {
                            par = null
                        }
                    }
                }
                return posses;
            }
        };
    }

}

module.exports = DragDropHandler
