/**
 Drag/drop handler.
*/

const jsPlumb = window.jsPlumb;
const Biltong = window.Biltong;  // Biltong are the underlying geometry functions that jsPlumb uses.
const jsPlumbUtil = window.jsPlumbUtil;

class DragDropHandler {
	
	constructor(canvas, toolkit, getRenderer) {
	
		this.getDragOptions = function() {
			return {
				filter:'.donotdrag',       // can't drag nodes by the color segments.
				stop:(params) => {
					if (params.el._metamapParent) {
						let layout = getRenderer().getLayout(),
							parentBounds = layout.getChildBounds(params.el._metamapParent.id),
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

					
					// when _any_ node stops dragging, run the layout again.
					// this will cause child nodes to snap to their new parent, and also
					// cleanup nicely if a node is dropped on another node.
					getRenderer().refresh();
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
		
		//
		// fires update events to the toolkit for the given node and all of its children and their children
		// etc
		//
		function updateNodeAndParts(node, toolkit) {
			toolkit.updateNode(node);
			if (node.data.children) {
				_.each(node.data.children, function(c) {
					updateNodeAndParts(toolkit.getNode(c), toolkit);
				});
		    }
		}
	
		this.getDropOptions = function() {
			return {
				drop:(params) => {
					var sourceInfo = toolkit.getObjectInfo(params.drag.el);
					var targetInfo = toolkit.getObjectInfo(params.drop.el);

					if (sourceInfo.obj.data.parentId) {
						jsPlumbUtil.consume(params.e);
						var sourceParent = toolkit.getNode(sourceInfo.obj.data.parentId);
						_.remove(sourceParent.data.children, function(c) { return c === sourceInfo.id; });

						targetInfo.obj.data.children = targetInfo.obj.data.children || [];
						targetInfo.obj.data.children.push(sourceInfo.id);

						sourceInfo.obj.data.parentId = targetInfo.id;

						// update the source, original source parent, and target. This will ensure the child
						// belongs to the right posses now.
						toolkit.updateNode(sourceParent);
					    toolkit.updateNode(targetInfo.obj);
						updateNodeAndParts(sourceInfo.obj, toolkit);

						return true;
					}
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