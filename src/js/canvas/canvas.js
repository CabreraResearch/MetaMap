const jsPlumb = window.jsPlumb;
const jsPlumbToolkit = window.jsPlumbToolkit;
const _ = require('lodash')

require('./layout')

class Canvas {

    constructor(map, mapId) {
        this.map = map;
        this.mapId = mapId;
        this.toolkit = {};
        this.metaMap = require('../../MetaMap')

        let that = this;

        const throttleSave = _.throttle(() => {
            let postData = {
                data: this.toolkit.exportData(),
                changed_by: this.metaMap.User.userKey
            };
            this.metaMap.MetaFire.setDataInTransaction(postData, `maps/data/${this.mapId}`);
            this.metaMap.Integrations.sendEvent(this.mapId, 'event', 'autosave', 'autosave')
        }, 500);

        jsPlumbToolkit.ready(function() {

            var currentCorner

            // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.
            var toolkit = window.toolkit = jsPlumbToolkit.newInstance({
                beforeStartConnect:function(fromNode, edgeType) {
                    currentCorner = edgeType
                    return {
                        type: edgeType
                    }
                },
                beforeConnect:function(fromNode, toNode) {
                    var ret = true;
                    //Prevent self-referencing connections
                    if(fromNode == toNode) {
                        ret = false;
                    } else {
                        //Between the same two nodes, only one perspective connection may exist
                        switch(currentCorner) {
                            case 'perspective':
                                var edges = fromNode.getEdges({ filter: function(e) { return e.data.type == 'perspective' }})
                                for(var i=0; i<edges.length; i+= 1) {
                                    var ed = edges[i];
                                    if((ed.source == fromNode && ed.target == toNode) || (ed.target == fromNode && ed.source == toNode)) {
                                        ret = false;
                                        break;
                                    }
                                }
                                break;
                        }
                    }
                    return ret;
                }
            });

            //
            // dummy for a new node.
            //
            var _newNode = function(type) {
                type=type||"idea"
                return {
                    w:100,
                    h:100,
                    label:"idea",
                    type:type
                };
            };

            // dummy for a new proxy (drag handle)
            var _newProxy = function(type) {
                type = type || 'proxyPerspective'
                return {
                    w:10,
                    h:10,
                    type:type
                };
            };

            var mainElement = document.querySelector(".jtk-demo-main"),
                canvasElement = mainElement.querySelector(".jtk-demo-canvas");


            //Whenever changing the selection, clear what was previously selected
            var clearSelection = function(obj) {
                toolkit.clearSelection();
                if(obj) {
                    toolkit.setSelection(obj);
                }
            }

            // configure the renderer
            var renderer = toolkit.render({
                container:canvasElement,
                layout:{
                    // custom layout for this app. simple extension of the spring layout.
                    type:"metamap"
                },
                //
                // this is how you can associate groups of nodes. Here, because of the
                // way I have represented the relationship in the data, we either return
                // a part's "parent" as the posse, or if it is not a part then we
                // return the node's id. There are addToPosse and removeFromPosse
                // methods too (on the renderer, not the toolkit); these can be used
                // when transferring a part from one parent to another.
                assignPosse:function(node) {
                    return node.data.parent || node.id;
                },
                zoomToFit:true,
                view:{
                    nodes:{
                        all: {
                            events: {
                                tap: function(obj) {
                                    clearSelection(obj.node)
                                },
                                mouseenter: function(obj) {

                                }
                            }
                        },
                        default: {
                            parent: "all",
                            template:"tmplNode"
                        },
                        idea: {
                            parent: "default"
                        },
                        "r-thing": {
                            parent: "idea"
                        },
                        proxy: {
                            parent: "all",
                            template:"tmplDragProxy",
                            anchors: ['Continuous', 'Center']
                        },
                        proxyPerspective: {
                            parent: "proxy"
                        },
                        proxyRelationship: {
                            parent: "proxy",
                            events: {
                                dblclick: function(obj) {
                                    //obj.node.data.type = 'r-thing'
                                    //obj.node.setType('r-thing')
                                    //Updating the node type does not seem to stick; instead, create a new node
                                    var d = renderer.mapEventLocation(obj.e)
                                    var edges = obj.node.getEdges()

                                    d.w = edges[0].source.data.w * 0.8;
                                    d.h = edges[0].source.data.h * 0.8;

                                    var newNode = toolkit.addNode(jsPlumb.extend(_newNode("r-thing"), d));

                                    //re-create the edge connections on the new node
                                    for(var i=0; i<edges.length; i+=1) {
                                        if(edges[i].source == obj.node) {
                                            toolkit.connect({source:newNode, target:edges[i].target, data:{
                                                type:"relationship"
                                            }});
                                        } else if(edges[i].target == obj.node) {
                                            toolkit.connect({source:edges[i].source, target:newNode, data:{
                                                type:"relationshipProxy"
                                            }});
                                        }
                                    }

                                    //delete the proxy node
                                    toolkit.removeNode(obj.node);
                                }
                            }
                        }
                    },
                    edges:{
                        all: {
                            events: {
                                tap: function (obj) {
                                    if(obj.e.target.getAttribute('class') == 'relationship-overlay' ) {
                                        debugger;
                                    }
                                    clearSelection(obj.edge)
                                }
                            }
                        },
                        default:{
                            parent: "all",
                            anchors:["Continuous","Continuous"],

                        },
                        connector: {
                            parent: "all",
                            connector:["StateMachine", {
                                margin: 1.01,
                                curviness:30
                            }]
                        },
                        relationship:{
                            cssClass:"edge-relationship",
                            parent: "connector",
                            endpoint:"Blank",
                            overlays:[
                                [ "PlainArrow", {
                                    location:1,
                                    width:10,
                                    length:10,
                                    cssClass:"relationship-overlay"
                                } ]
                            ]

                        },
                        relationshipProxy:{
                            cssClass:"edge-relationship",
                            parent: "connector",
                            endpoint:"Blank"
                        },
                        perspective:{
                            cssClass:"edge-perspective",
                            endpoints:[ "Blank", [ "Dot", { radius:10, cssClass:"orange" }]],
                            parent: "connector"
                        },
                        perspectiveProxy:{
                            cssClass:"edge-perspective",
                            endpoints:[ "Blank", [ "Dot", { radius:1, cssClass:"orange_proxy" }]],
                            parent: "connector"
                        }
                    }
                },
                events:{
                    canvasClick: function (e) {
                        clearSelection();
                    },
                    canvasDblClick:function(e) {
                        // add an Idea node at the location at which the event occurred.
                        var pos = renderer.mapEventLocation(e);
                        //Move 1/2 the height and width up and to the left to center the node on the mouse click
                        //TODO: when height/width is configurable, remove hard-coded values
                        pos.left = pos.left-50
                        pos.top = pos.top-50
                        toolkit.addNode(jsPlumb.extend(_newNode(), pos));
                    },
                    nodeAdded:_registerHandlers, // see below
                    edgeAdded: function(obj) {
                        //
                    },
                    relayout: function() {


                        var currentDrag = null;

                        var nodes = document.querySelectorAll('.Leaded_square_frame_1_ > path')
                        _.each(nodes, function(n){
                        n.setAttribute('draggable', 'true');
                        n.addEventListener('drop', function() {
                            debugger
                        })
                        n.addEventListener('dragstart', function() {
                            debugger
                        })
                        n.addEventListener('drag', function() {
                            debugger
                        })
                        n.addEventListener('dragenter', function() {
                            debugger
                        })
                        n.addEventListener('dragleave', function() {
                            debugger
                        })
                        n.addEventListener('dragover', function() {
                            debugger
                        })
                        n.addEventListener('dragend', function() {
                            debugger
                        })
                        var isDragging = false;
                        $(n)
                            .mousedown(function(event) {
                                isDragging = false;
                            })
                            .mousemove(function(event) {
                                isDragging = true;
                                currentDrag = this
                            })
                            .mouseup(function(event) {
                                var target = event.target.parentNode.parentNode.parentNode.parentNode
                                if(target != this) {

                                }

                                //var wasDragging = isDragging;
                                isDragging = false;
                            });

                        });


        //
        //                 $('.jtk-node').mouseup(function(event) {
        //                     if(currentDrag != this) {
        //                         debugger
        //                     }
        //                 })
        //
        //                 $('.jtk-node').draggable()
        //                 $('.jtk-node').droppable({
        //                     drop: function() {
        //                         debugger
        //                     }
        //                 })

                    }
                },
                dragOptions:{
                    filter:".segment"       // can't drag nodes by the color segments.
                }
            });

        // ------------------------- dialogs -------------------------------------

        jsPlumbToolkit.Dialogs.initialize({
            selector: ".dlg"
        });

        // ------------------------- / dialogs ----------------------------------


        //  ----------------------------------------------------------------------------------------
        //
        //    Mouse handlers. Some are wired up; all log the current node data to the console.
        //
        // -----------------------------------------------------------------------------------------

            var _types = [ "red", "orange", "green", "blue", "text" ];

            var clickLogger = function(type, event, el, node) {
                console.log(event + ' ' + type);
                console.dir(node.data);
                if(event == 'dblclick') {
                    toolkit.clearSelection();
                }
            }

            var _clickHandlers = {
                click:{
                    red:function(el, node) {
                        clickLogger('R', 'click', el, node)
                    },
                    green:function(el, node) {
                        clickLogger('G', 'click', el, node)
                    },
                    orange:function(el, node) {
                        clickLogger('O', 'click', el, node)
                    },
                    blue:function(el, node) {
                        clickLogger('B', 'click', el, node)
                    },
                    text:function(el, node) {
                        clickLogger('T', 'click', el, node)
                    }
                },
                dblclick:{
                    red:function(el, node) {
                        clickLogger('R', 'dblclick', el, node)
                        toolkit.addNode(_newNode());
                    },
                    green:function(el, node) {
                        clickLogger('G', 'dblclick', el, node)
                        var newWidth = node.data.w * 0.8;
                        var newHeight = node.data.h * 0.8;

                        node.data.children = node.data.children || [];
                        var newLabel = node.data.label + ": Part " + (node.data.children.length+1);

                        var newNode = toolkit.addNode({parent:node.id,w:newWidth,h:newHeight,label: newLabel});
                        node.data.children.push(newNode.id);
                        renderer.relayout();
                    },
                    orange:function(el, node) {
                        clickLogger('O', 'dblclick', el, node)
                        var newNode = toolkit.addNode(_newNode());
                        var proxyNode = toolkit.addNode(_newProxy('proxyPerspective'));

                        toolkit.connect({source:node, target:proxyNode, data:{
                            type:"perspectiveProxy"
                        }});
                        toolkit.connect({source:proxyNode, target:newNode, data:{
                            type:"perspective"
                        }});
                    },
                    blue:function(el, node) {
                        clickLogger('B', 'dblclick', el, node)
                        var newNode = toolkit.addNode(_newNode());
                        var proxyNode = toolkit.addNode(_newProxy('proxyRelationship'));

                        toolkit.connect({source:node, target:proxyNode, data:{
                            type:"relationshipProxy"
                        }});
                        toolkit.connect({source:proxyNode, target:newNode, data:{
                            type:"relationship"
                        }});
                    },
                    text:function(el, node) {
                        clickLogger('T', 'dblclick', el, node)
                        var label = el.querySelector(".name");
                        jsPlumbToolkit.Dialogs.show({
                            id: "dlgText",
                            title: "Enter label:",
                            onOK: function (d) {
                                toolkit.updateNode(node, { label:d.text });
                            },
                            data:{
                                text:node.data.label
                            }
                        });
                    }
                }
            };

            var _curryHandler = function(el, segment, node) {
                var _el = el.querySelector("." + segment);
                jsPlumb.on(_el, "click", function () {
                    _clickHandlers["click"][segment](el, node);
                });
                jsPlumb.on(_el, "dblclick", function () {
                    _clickHandlers["dblclick"][segment](el, node);
                });
            };

            //
            // setup the clicking actions and the label drag. For the drag we create an
            // instance of jsPlumb for not other purpose than to manage the dragging of
            // labels. When a drag starts we set the zoom on that jsPlumb instance to
            // match our current zoom.
            //
            var labelDragHandler = jsPlumb.getInstance();
            function _registerHandlers(params) {
                // here you have params.el, the DOM element
                // and params.node, the underlying node. it has a `data` member with the node's payload.
                var el = params.el, node = params.node, label = el.querySelector(".name");
                for (var i = 0; i < _types.length; i++) {
                    _curryHandler(el, _types[i], node);
                }

                // make the label draggable (see note above).
                labelDragHandler.draggable(label, {
                    start:function() {
                    labelDragHandler.setZoom(renderer.getZoom());
                    },
                    stop:function(e) {
                        node.data.labelPosition = [
                            parseInt(label.style.left, 10),
                            parseInt(label.style.top, 10)
                        ]
                    }
                });

                // make the label editable via a dialog
                jsPlumb.on(label, "dblclick", function() {
                jsPlumbToolkit.Dialogs.show({
                        id: "dlgText",
                        title: "Enter label:",
                        onOK: function (d) {
                            toolkit.updateNode(node, { label:d.text });
                        },
                        data:{
                        text:node.data.label
                        }
                    });
                });
            }

            /**
            * shows info in window on bottom right.
            */
            function _info(text) {

            }


        // ----------------------------------------------------------------------------------------------------------------------

            // load the data.
            if (that.map && that.map.data) {
                toolkit.load({
                    type: 'json',
                    data: that.map.data
                })
            } else {
                toolkit.load({
                    url:"data.json"
                });
            }

        // --------------------------------------------------------------------------------------------------------
        // a couple of random examples of the filter function, allowing you to query your data
        // --------------------------------------------------------------------------------------------------------

            var countEdgesOfType = function(type) {
                return toolkit.filter(function(obj) { return obj.objectType == "Edge" && obj.data.type===type; }).getEdgeCount()
            };
            var dumpEdgeCounts = function() {
                console.log("There are " + countEdgesOfType("relationship") + " relationship edges");
                console.log("There are " + countEdgesOfType("perspective") + " perspective edges");
            };

            toolkit.bind("dataUpdated", function() {
                dumpEdgeCounts();
                //TODO: wire up autosave here
            })

            jsPlumb.on("relationshipEdgeDump", "click", dumpEdgeCounts());

            //CTRL + click enables the lasso
            jsPlumb.on(document, 'mousedown', function(event) {
                if(event.ctrlKey) {
                    renderer.setMode('select')
                }
            });

            //CTRL + click enables the lasso
            jsPlumb.on('beforeDrop', function(event) {
                debugger;
            });

            var deleteAll = function(selected) {
                //TODO: implement logic to delete whole edge+proxy+edge structure
                selected.eachEdge(function(i,e) { console.log(e) });

                //Recurse over all children
                selected.eachNode(function(i,n) {
                    var recurse = function(node) {
                        if(node && node.data.children) {
                            for(var i=0; i<node.data.children.length; i+=1) {
                                var child = toolkit.getNode(node.data.children[i]);
                                recurse(child);
                            }
                        }
                        //Delete children before parents
                        toolkit.removeNode(node)
                    }
                    recurse(n);
                });
                toolkit.remove(selected);
            }

            //map backspace to delete if anything is selected
            jsPlumb.on(document, 'keyup', function(event) {
                var selected = toolkit.getSelection();
                switch (event.keyCode) {
                    case 8:
                        if(selected) {
                            event.preventDefault()
                        }
                    case 46:
                        deleteAll(selected);
                        break;
                }
            })

            jsPlumb.on(document, 'keydown', function(event) {
                switch (event.keyCode) {
                    case 46:
                        var selected = toolkit.getSelection();
                        deleteAll(selected);
                        break;
                }
            })

        });

    }

    init() {

    }
}

// get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.

module.exports = Canvas;