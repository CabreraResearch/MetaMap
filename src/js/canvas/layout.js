const jsPlumb = window.jsPlumb;
const jsPlumbToolkit = window.jsPlumbToolkit;
const $ = require('jquery')
const _ = require('lodash')

/**
* Custom layout for Homunculus. Extends the Spring layout. After Spring runs, this
* layout finds 'part' nodes and aligns them underneath their parents. The alignment
* - left or right - is set in the parent node's data, as `partAlign`.
*
* Layout can be suspended on a per-node basis by setting `suspendLayout` in the Node's
* data.
*
* Child nodes
*/
;(function() {

	function childNodeComparator(c1, c2) {
		if (!c1 || c2.data.order == null) return -1;
		if (!c1 || c1.data.order == null) return 1;
		return c1.data.order < c2.data.order ? -1 : 1;
	}

    function _updateBounds(bounds, x, x2, y, y2) {
        bounds.xmin = Math.min(bounds.xmin, x, x2);
        bounds.xmax = Math.max(bounds.xmax, x, x2);
        bounds.ymin = Math.min(bounds.ymin, y, y2);
        bounds.ymax = Math.max(bounds.ymax, y, y2);
    }

  jsPlumbToolkit.Layouts["Homunculus"] = function() {
    jsPlumbToolkit.Layouts.Spring.apply(this, arguments);

    var originalLocationMap = {}, self = this, magnetizeNodes = [],
        _childPositions = {}, _childBounds = {};

    var _oneSet = function(parentNode, position, size, params, toolkit) {
      params = params || {};
      var padding = params.partPadding || 5,
          parentSize = size || this.getSize(parentNode.id),             // get its size
      // we need to track the entire Y size of the node plus all its children, for nested layouts. Where
      // previously we would place a child and then increment the Y cursor by the size of the child plus
      // the padding, we now need to render all the child's child nodes and increment our Y cursor to take them
      // all into account.
          totalHeightForThisNode = parentSize[1];

        // look for nodes that have children but no parent.
      if (parentNode.data.suspendLayout !== true && parentNode.data.children) {

          originalLocationMap[parentNode.id] = {};

          var c = parentNode.data.children,                                 // get child node IDs
              childNodes = _.map(c, toolkit.getNode),                   // map them to actual Node objects
              parentPos = position || this.getPosition(parentNode.id),      // get the position of the parent (if not provided)

              align = (parentNode.data.partAlign || "right") === "left" ? 0 : 1,// and the face to align to.

          // and finally, move the Y cursor down to accomodate the size of the parent. Here, when nesting, the
              // parent size is actually the size of the parent plus all of its children and the padding in
              // between them all
              y = parentPos[1] + parentSize[1] + padding;

          //magnetizeNodes.push( parentNode.id );

          // sort nodes
          childNodes.sort(childNodeComparator);
          // and run through them and assign order; any that didn't previously have order will get order
          // set, and any that had order will retain the same value.
          _.each(childNodes, function (cn, i) {
              if (cn) {
                  cn.data.order = i;
              }
          });

          _childPositions[parentNode.id] = [];
          var childBounds = {xmin:Infinity, xmax:-Infinity, ymin:Infinity, ymax:-Infinity};

          for (var i = 0; i < childNodes.length; i++) {
              var cn = childNodes[i];
              if (cn) {
                  var childSize = this.getSize(cn.id),
                      x = parentPos[0] + (align * (parentSize[0] - childSize[0]));

                  if (originalLocationMap[parentNode.id][cn.id] == null) {
                      var p = this.getPosition(cn.id);
                      originalLocationMap[parentNode.id][cn.id] = [p[0], p[1]];
                  }

                  _updateBounds(childBounds, x, x + childSize[0], y, y + childSize[1]);
                  _childPositions[parentNode.id].push([x,y,cn]);

                  this.setPosition(cn.id, x, y, true);
                  //magnetizeNodes.push(cn.id);

                  var childRenderedHeight = _oneSet(cn, [x,y], childSize, params, toolkit);

                  y += (childRenderedHeight + padding);
                  totalHeightForThisNode += (childRenderedHeight + padding);
              }
          }

          // gives us the bounds of the child nodes. when we subsequently drag a child node we can check if
          // it at least intersects this rectangle. If so, we find its new natural ordering (on drag stop),
          // and set it, and redraw.
          _childBounds[parentNode.id] = childBounds;

      }
        return totalHeightForThisNode;
    }.bind(this);

      var _restore = function(parentId) {
          if (originalLocationMap[parentId]) {
              for (var id in originalLocationMap[parentId]) {
                  self.setPosition(id, originalLocationMap[parentId][id][0], originalLocationMap[parentId][id][1], true);
              }
          }
      };

      /**
       * Suspends the part ordering layout for the given node.
       * @param node Toolkit Node to suspend part ordering for. This must be the Toolkit's Node, as we want to
       * manipulate a value inside its backing data.
       * @param state True to suspend, false to enable.  Suspending the layout causes the last auto generate positions
       * to be re-applied to the part nodes.
       */
      this.setSuspended = function(node, state) {
          node.data.suspendLayout = state;
          if (state) {
              _restore(node.id);
          }
      };

    // stash original end callback and override. place all Part nodes wrt their
    // parents, then call original end callback and finally tell the layout
    // to draw itself again.
    var _superEnd = this.end;
    this.end = function(toolkit, params) {
      magnetizeNodes.length = 0;
      var nc = toolkit.getNodeCount();
      for (var i = 0; i < nc; i++) {
        var n = toolkit.getNodeAt(i);
        // only process nodes that are not Part nodes (there could of course be
        // a million ways of determining what is a Part node...here I just use
        // a rudimentary construct in the data)
        if (n.data.parentId == null && n.data.layoutChildren !== false) {
          _oneSet(n, null, null, params, toolkit);
        }
      }

      _superEnd.apply(this, arguments);
      this.draw();
    };

    // accessors for the child layout data (used by the child drag stuff)
    this.getChildBounds = function(nodeId) {
        return _childBounds[nodeId];
    };

    this.getChildPositions = function(nodeId) {
        return _childPositions[nodeId];
    };

  };

})();
