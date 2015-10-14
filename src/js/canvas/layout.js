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

    var _oneSet = function(parent, params, toolkit) {
      params = params || {};
      var padding = params.partPadding || 20;
      if (parent.data.children && parent.data.suspendLayout !== true) {

        var c = parent.data.children,
		  	childNodes = _.map( c, toolkit.getNode ),
            parentPos = this.getPosition(parent.id),
            parentSize = this.getSize(parent.id),
            magnetizeNodes = [ parent.id ],
            align = (parent.data.partAlign || "right") === "left" ? 0 : 1,
            y = parentPos[1] + parentSize[1] + padding;
		
		// sort nodes	
		childNodes.sort(childNodeComparator);
		// and run through them and assign order; any that didn't previously have order will get order
		// set, and any that had order will retain the same value.
		_.each(childNodes, function(cn, i) {
			cn.data.order = i;
		});

		for (var i = 0; i < childNodes.length; i++) {
			var cn = childNodes[i];
            if(cn) {
              var childSize = this.getSize(cn.id),
                  x = parentPos[0] + (align * (parentSize[0] - childSize[0]));

              this.setPosition(cn.id, x, y, true);
              magnetizeNodes.push(cn.id);
              y += (childSize[1] + padding);
            }
		}
          

      }
    }.bind(this);

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
        if (n.data.parent == null) {
          _oneSet(n, params, toolkit);
        }
      }

      _superEnd.apply(this, arguments);
      this.draw();
    };
  };

})();
