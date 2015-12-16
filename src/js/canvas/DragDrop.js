/**
 Drag/drop handler.
*/

const jsPlumb = window.jsPlumb;
const Biltong = window.Biltong;  // Biltong are the underlying geometry functions that jsPlumb uses.
const jsPlumbUtil = window.jsPlumbUtil;
const _ = require('lodash');
const $ = require('jquery');

const _CanvasBase = require('./_CanvasBase')

/**
 * @extends _CanvasBase
 */
class DragDropHandler extends _CanvasBase {

    constructor(canvas, toolkit, getRenderer) {
        super(canvas)
    }

    static repositionRthingOnEdge(edge, canvas) {
        if (edge && edge.data.rthing && edge.data.rthing.nodeId) {
            let rnode = canvas.jsToolkit.getNode(edge.data.rthing.nodeId),
                rnodeEl = canvas.jsRenderer.getRenderedElement(rnode);
            let dotNode = document.getElementById(edge.data.rthing.rDot)
            if (dotNode) {
                let dot = $(dotNode),
                    left = dot.css('left').split('px')[0] - (rnode.data.w / 2),
                    top = dot.css('top').split('px')[0] - (rnode.data.h / 2);

                canvas.jsToolkit.updateNode(rnode, {
                    left: left,
                    top: top
                });
                canvas.jsRenderer.setAbsolutePosition(rnodeEl, [left, top])
            }
        }
    }

    repositionRThing(node) {
        if(node) {
            let edges = node.getEdges()
            _.each(edges, (edge) => { DragDropHandler.repositionRthingOnEdge(edge, this)  })
            //If every member of the posse dragged together, it wouldn't be necessary to do this
            if(node.data.children.length > 0) {
                _.each(node.data.children, (id) => {
                    let child = this.jsToolkit.getNode(id)
                    this.repositionRThing(child)
                })
            }
        }
    }

    getDragOptions() {
        return {
            filter: '.donotdrag, .name',       // can't drag nodes by the color segments.
            stop: (params) => {

                // when any two nodes with a relationship and an r-thing between them move
                // this should update the position of the r-thing to be the same as the r-dot overlay
                let info = this.jsToolkit.getObjectInfo(params.el)
                let doRepo = (info && null != info.obj)

                //If we're dragging a part that is not in freehand layout,
                //and it's not being dropped onto anyone else,
                //it will snap back immediately after this event fires
                if(info.obj.data.type != 'idea_A' && info.obj.data.partAlign != 'freehand' && (!params.drop || !params.drop.el)) {
                    doRepo = false
                }
                if (doRepo) {
                    let node = info.obj
                    this.repositionRThing(node)
                }

                // when _any_ node stops dragging, run the layout again.
                // this will cause child nodes to snap to their new parent, and also
                // cleanup nicely if a node is dropped on another node.
                // but note that we do this outside the current run through the event loop,
                // as we want to allow jsplumb to finish doing everything it needs.
                window.setTimeout(this.jsRenderer.refresh, 0);
            },
            start: (params) => {

                if (this.canvas.mode != 'select' || ($(params.el).find('.node-selected').length == 0)) {
                    this.canvas.clearSelection({ el: params.el, node: params.el.jtk.node, e: params.e || {} })
                }
                if (this.canvas.mode == 'select') {
                    if(this.jsToolkit.getSelection().getNodeCount() == 0) {
                        let selected = $('.node-selected')
                        selected.each((idx, el) => {
                            let nodeEl = el.parentElement.parentElement.parentElement
                            $(nodeEl).addClass('jsplumb-drag-select')
                            jsPlumb.addToDragSelection(nodeEl)
                            let nodeId = nodeEl.dataset.jtkNodeId
                            let node = this.jsToolkit.getNode(nodeId)
                            this.canvas.addToSelection({node: node, el: nodeEl})
                        })
                    }
                }
                // on start, if there is a parent, find it and stash it on the element, for us to
                // look at on stop.
                var node = params.el.jtk.node;
                if (node.data.parentId != null) {
                    var parentNode = this.jsToolkit.getNode(node.data.parentId);
                    if (parentNode && !parentNode.data.suspendLayout) {
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
    updateNodeAndParts(node, isRthing=false) {
        this.jsToolkit.updateNode(node);
        if (node.data.children) {
            _.each(node.data.children, (c) => {
                let child = this.jsToolkit.getNode(c)
                this.adjustType(node, child, isRthing)
                this.updateNodeAndParts(child, isRthing);
            });
        }
    }

    adjustType(parent, child, isRthing=false) {
        var depth = this.canvas.getDepth(child)
        if(isRthing) {
            depth += 1
            child.data.type = this.node.getNextPartNodeType(child.data)
        }
        var newSize = this.canvas.getPartSizeAtDepth(depth)
        child.data.w = newSize;
        child.data.h = newSize;
        child.data.type = this.node.getNextPartNodeType(child.data)
        child.data.family = parent.data.family
        child.data.partAlign = parent.data.partAlign || 'left'
        this.jsRenderer.getLayout().setSize(child.id, [newSize, newSize])
    }

    addAsChild(sourceNode, targetNode, event) {
        jsPlumbUtil.consume(event);

        let selection = this.canvas.getSelection()
        if(selection.nodeIds.length <= 1) {
            this.schema.attachPart(sourceNode, targetNode)
        } else {
            _.each(selection.nodeIds, (id) => {
                let node = this.jsToolkit.getNode(id)
                this.schema.attachPart(node, targetNode)
            })
        }

        return true;
    }

    reorderChild(sourceNode, targetNode, params) {
        jsPlumbUtil.consume(params.e);
        let layout = this.jsRenderer.getLayout();
        if(params.drag.el._metamapParent) {
            var childPositions = layout.getChildPositions(params.drag.el._metamapParent.id)
            // here we map child positions to a list containing entries that have [ pos, delta, idx ], which we then
            // sort by delta (where delta is the distance from that node's top edge from the dropped node's top edge).
            // the first entry in this array, then, gives us the new index for the dropped node.
            if(!childPositions) {
                console.log('No positions')
            } else {
                let mappedLocations = _.map(childPositions, (cp, i) => {
                    return [cp[1], Math.abs(cp[1] - params.drop.position[1]), i];
                })
                let sortedLocations = mappedLocations.sort((a, b) => {
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
            }
        }
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
                else if (sourceInfo.obj.data.family == targetInfo.obj.data.family) {
                    //If the target is the root node, we're detaching the part
                    if(targetInfo.obj.data.type == 'idea_A' || (targetInfo.obj.data.type == 'idea_B' && targetInfo.obj.data.isRThing)) {
                        this.schema.detachPart(sourceInfo.obj, targetInfo.obj)
                        $(params.drop.el).removeClass('jsplumb-drag-hover-detach')
                    }
                    //If the source is the root node, then we're moving the system
                    else if(sourceInfo.obj.data.type != 'idea_A') {
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
                let drag = this.jsToolkit.getObjectInfo(params.drag.el).obj
                let drop = this.jsToolkit.getObjectInfo(params.drop.el).obj
                if(drag.data.family == drop.data.family) {
                    if(!drop.data.parentId) {
                        $(params.drop.el).addClass('jsplumb-drag-hover-detach')
                    } else if(drag.data.type != drop.data.type) {
                        $(params.drop.el).addClass('jsplumb-drag-hover-none')
                    }
                } else {
                    $(params.drop.el).addClass('jsplumb-drag-hover-attach')
                }
            },
            out: (params) => {
                let drag = this.jsToolkit.getObjectInfo(params.drag.el).obj
                let drop = this.jsToolkit.getObjectInfo(params.drop.el).obj
                if(drag.data.family == drop.data.family) {
                    if (!drop.data.parentId) {
                        $(params.drop.el).removeClass('jsplumb-drag-hover-detach')
                    } else {
                        $(params.drop.el).removeClass('jsplumb-drag-hover-none')
                    }
                } else {
                    $(params.drop.el).removeClass('jsplumb-drag-hover-attach')
                }
            }
        };
    }

    getPosseAssigner() {
        return (node) => {
            if (!node.data.parentId) {
                return node.id;
            }
            else {
                let posses = [node.id]
                let par = node.data.parentId
                let parent = this.jsToolkit.getNode(par)
                if (parent) {
                    while (par != null) {
                        posses.push({ id: parent.data.id, active: false });
                        parent = this.jsToolkit.getNode(parent.data.parentId)
                        if (parent && parent.data.id != node.data.parentId) {
                            par = parent.data.id;
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
