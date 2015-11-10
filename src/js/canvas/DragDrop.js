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

		this.getDragOptions = function() {
			return {
				filter:'.donotdrag',       // can't drag nodes by the color segments.
				stop:(params) => {
                    let layout = getRenderer().getLayout()
                    let isDrop = false
                    if (params.el._metamapParent) {
                        isDrop = true
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
                    }

                    //#99: create a partial fix to prevent the layout from updating in freehand
                    let isSuspended = false
                    if (info && info.obj) {
                        isSuspended = info.obj.data.children.length > 0
                        isSuspended = isSuspended && info.obj.data.suspendLayout == true
                    }
					// when _any_ node stops dragging, run the layout again.
					// this will cause child nodes to snap to their new parent, and also
					// cleanup nicely if a node is dropped on another node.
                    if (isDrop || !isSuspended) {
                        getRenderer().refresh();
                    } else {
                        console.log('Prevented re-snapping children on a parent in freehand layout')
                    }
            	},
				start:(params) => {
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

		this.getDropOptions = function() {
			return {
				drop:(params) => {

				}
			};
		}

		this.getPosseAssigner = function() {
			return function(node) {
				if (!node.data.parentId) {
					return node.id;
				}
				else {
					var posses = [node.id], par = node.data.parentId;
					while (par != null) {
						posses.push({ id:par, active:false });
						par = toolkit.getNode(par).data.parentId;
	        		}
					return posses;
				}
			};
		};
	}
}

module.exports = DragDropHandler