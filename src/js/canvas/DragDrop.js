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
            node.data.children = node.data.children || []
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
                if(info.obj.data.displayType != 'A' && info.obj.data.partAlign != 'freehand' && (!params.drop || !params.drop.el)) {
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
                        params.el._HomunculusParent = parentNode;
                    }
                    else {
                        params.el._HomunculusParent = null;
                    }
                }
            }
        }
    }

    reorderChild(sourceNode, targetNode, params) {
        jsPlumbUtil.consume(params.e);
        let layout = this.jsRenderer.getLayout();
        if(params.drag.el._HomunculusParent) {
            var childPositions = layout.getChildPositions(params.drag.el._HomunculusParent.id)
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
                    outcome = false

                let selection = this.canvas.getSelection()
                //Prevent unintended attach/detach/reorder by evaluating source/target
                //in the context of the current selection
                let isGroupDragging = _.any(selection.nodeIds, (id) => {
                    return sourceInfo.obj.data.id == id || targetInfo.obj.data.id == id
                })
                if(!isGroupDragging) {
                    let targetChildren = this.schema.getAllChildren(targetInfo.obj).ids
                    let sourceChildren = this.schema.getAllChildren(sourceInfo.obj).ids
                    isGroupDragging = _.any(targetChildren, (id) => {
                        return sourceInfo.obj.data.id == id || targetInfo.obj.data.id == id
                    })
                    isGroupDragging = isGroupDragging || _.any(sourceChildren, (id) => {
                        return sourceInfo.obj.data.id == id || targetInfo.obj.data.id == id
                    })

                }
                if(isGroupDragging) {
                    return
                }

                // if parent IDs are the same...(note '==' compare here; we dont want to get caught by a null vs undefined comparison on this one)
                if (sourceParentId == targetParentId) {
                    if (!sourceParentId) {
                        let totalHeight = targetInfo.obj.data.h+10
                        let targetChildren = this.schema.getAllChildren(targetInfo.obj).jNodes
                        _.each(targetChildren, (child) => {
                            totalHeight += 10 + child.data.h
                        })
                        let count = selection.nodeIds.length
                        let originalAlign = targetInfo.obj.data.partAlign

                        if(count > 1) {
                            this.node.changeAlignment(targetInfo.obj, 'freehand', true)
                        }
                        _.each(selection.nodeIds, (id) => {
                            let node = this.jsToolkit.getNode(id)
                            if(count > 1) {
                                let el = this.jsRenderer.getRenderedElement(node)
                                let bounds = el.getBoundingClientRect()
                                let left = (bounds.right) + (node.data.w*2)
                                let top = (bounds.top) + totalHeight
                                console.log(left, top)
                                node.data.left = left
                                node.data.top = top
                            }
                        })
                        _.each(selection.nodeIds, (id) => {
                            let node = this.jsToolkit.getNode(id)
                            if(!node.data.parentId || node.data.family == node.data.id) {
                                outcome = this.schema.attachPart(node, targetInfo.obj, params.e)
                            }
                        })
                        if(originalAlign != targetInfo.obj.data.partAlign) {
                            //this.node.changeAlignment(targetInfo.obj, originalAlign, true)
                        }
                        $(params.drop.el).removeClass('jsplumb-drag-hover-attach')
                    }
                    else {
                        outcome = this.reorderChild(sourceInfo.obj, targetInfo.obj, params)
                    }
                }
                else if (sourceInfo.obj.data.family == targetInfo.obj.data.family) {
                    //If the target is the root node, we're detaching the part
                    if(targetInfo.obj.data.displayType == 'A' || (targetInfo.obj.data.displayType == 'B' && targetInfo.obj.data.isRThing)) {
                        this.schema.detachPart(sourceInfo.obj, targetInfo.obj, params.e)
                        $(params.drop.el).removeClass('jsplumb-drag-hover-detach')
                    }
                    //If the source is the root node, then we're moving the system
                    else if(sourceInfo.obj.data.displayType != 'A') {
                        outcome = this.reorderChild(sourceInfo.obj, targetInfo.obj, params)
                    }
                }
                else {
                    outcome = this.schema.attachPart(sourceInfo.obj, targetInfo.obj, params.e)
                    $(params.drop.el).removeClass('jsplumb-drag-hover-attach')
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
                $(params.drop.el).removeClass('jsplumb-drag-hover-detach')
                $(params.drop.el).removeClass('jsplumb-drag-hover-none')
                $(params.drop.el).removeClass('jsplumb-drag-hover-attach')
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
