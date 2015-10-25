/**
* Custom layout for metamap. Extends the Spring layout. After Spring runs, this
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
		if (c2.data.order == null) return -1;
		if (c1.data.order == null) return 1;
		return c1.data.order < c2.data.order ? -1 : 1;
	}

  jsPlumbToolkit.Layouts["metamap"] = function() {
    jsPlumbToolkit.Layouts.Spring.apply(this, arguments);

    var originalLocationMap = {}, self = this;

    var _oneSet = function(parent, params, toolkit) {
      params = params || {};
      var padding = params.partPadding || 5;
      if (parent.data.children) {

          if (parent.data.suspendLayout !== true) {
              originalLocationMap[parent.id] = {};

              var c = parent.data.children,
                  childNodes = _.map(c, toolkit.getNode),
                  parentPos = this.getPosition(parent.id),
                  parentSize = this.getSize(parent.id),
                  magnetizeNodes = [ parent.id ],
                  align = (parent.data.partAlign || "right") === "left" ? 0 : 1,
                  y = parentPos[1] + parentSize[1] + padding;

              // sort nodes
              childNodes.sort(childNodeComparator);
              // and run through them and assign order; any that didn't previously have order will get order
              // set, and any that had order will retain the same value.
              _.each(childNodes, function (cn, i) {
                  cn.data.order = i;
              });

              for (var i = 0; i < childNodes.length; i++) {
                  var cn = childNodes[i];
                  if (cn) {
                      var childSize = this.getSize(cn.id),
                          x = parentPos[0] + (align * (parentSize[0] - childSize[0]));

                      if (originalLocationMap[parent.id][cn.id] == null) {
                          var p = this.getPosition(cn.id);
                          originalLocationMap[parent.id][cn.id] = [p[0], p[1]];
                      }

                      this.setPosition(cn.id, x, y, true);
                      magnetizeNodes.push(cn.id);
                      y += (childSize[1] + padding);
                  }
              }
          }
          else {

          }

      }
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
      var nc = toolkit.getNodeCount();
      for (var i = 0; i < nc; i++) {
        var n = toolkit.getNodeAt(i);
        // only process nodes that are not Part nodes (there could of course be
        // a million ways of determining what is a Part node...here I just use
        // a rudimentary construct in the data)
        if (n.data.parent == null && n.data.layoutChildren !== false) {
          _oneSet(n, params, toolkit);
        }
      }

      _superEnd.apply(this, arguments);
      this.draw();
    };
  };

})();
