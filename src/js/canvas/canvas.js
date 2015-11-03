const jsPlumb = window.jsPlumb;
const jsPlumbToolkit = window.jsPlumbToolkit;
const _ = require('lodash')
const CONSTANTS = require('../constants/constants')
const Permissions = require('../app/Permissions')

require('./layout')

class Canvas {

    constructor(opts) {
        this.metaMap = require('../../MetaMap')
        let that = this;
        this.toolkit = {};
        this._init(opts)

        this.onAutoSave = _.throttle((data) => {
            if (this.doAutoSave && this.permissions.canEdit()) {
                //KLUDGE: looks like the exportData now includes invalid property values (Infinity) and types (methods)
                //Parsing to/from string fixes for now
                data = JSON.parse(JSON.stringify(data))
                let postData = {
                    data: data,
                    changed_by: {
                        userId: this.metaMap.User.userId
                    }
                }
                this.metaMap.MetaFire.setDataInTransaction(postData, `maps/data/${this.mapId}`)
                this.metaMap.Integrations.sendEvent(this.mapId, 'autosave', this.map.name)
            }
        }, 500)

        jsPlumbToolkit.ready(function () {

            var currentCorner

            // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.
            var toolkit = that.toolkit = jsPlumbToolkit.newInstance({
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
                    w:50,
                    h:50,
                    label:"idea",
                    type: type,
                    children: [],
                    labelPosition: []
                };
            };

            //Whenever changing the selection, clear what was previously selected
            var clearSelection = function(obj) {
                toolkit.clearSelection();
                $('.node-selected').each(function () {
                    this.setAttribute('class', 'node-border')
                })
                if (obj) {
                    $(obj.el).find('.node-border').each(function () {
                        this.setAttribute('class', 'node-selected')
                    })
                    if (obj.node) {
                        toolkit.setSelection(obj.node);
                    }
                    if (obj.edge) {
                        toolkit.setSelection(obj.edge);
                    }
                }
            }

            // configure the renderer
            var renderer = toolkit.render({
                container: opts.attachTo,
                elementsDraggable: !that.isReadOnly,
                enablePanButtons: false,
                consumeRightClick: false,
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
                    return node.data.parent ? { posse:node.data.parent, active:false } : node.id;
                },
                zoomToFit:false,
                view:{
                    nodes:{
                        all: {
                            events: {
                                tap: function(obj) {
                                    clearSelection(obj)
                                },
                                mouseenter: function(obj) {

                                },
                                contextmenu: function (node, port, el, e) {
                                    if (node && node.el) {
                                        $.contextMenu({
                                            selector: `#${node.el.id}`,
                                            items: {
                                                copy: {
                                                    name: "Copy",
                                                    callback: function(key, opt){
                                                        alert("Clicked on " + key);
                                                    }
                                                }
                                            }
                                        });
                                    }
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
                        }
                    },
                    edges:{
                        all: {
                            events: {
                                tap: function (obj) {
                                    if(obj.e.target.getAttribute('class') == 'relationship-overlay' ) {
                                        debugger;
                                    }
                                    clearSelection(obj)
                                },
                                contextmenu: function (node, port, el, e) {
                                    debugger
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
                                curviness:15
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
                            ],
                            events: {
                                rThingCreate: function(obj) {
                                    //obj.node.data.type = 'r-thing'
                                    //obj.node.setType('r-thing')
                                    //Updating the node type does not seem to stick; instead, create a new node
                                    var d = renderer.mapEventLocation(obj.e)
                                    var edges = obj.node.getEdges()

                                    d.w = edges[0].source.data.w * 0.667;
                                    d.h = edges[0].source.data.h * 0.667;

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
                        },
                        perspective:{
                            cssClass:"edge-perspective",
                            endpoints:[ "Blank", [ "Dot", { radius:5, cssClass:"orange" }]],
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
                    contextmenu: function (node, port, el, e) {
                        debugger
                    },
                    nodeAdded:_registerHandlers, // see below
                    edgeAdded: function(obj) {
                        //
                    },
                    relayout: function() {
                        //various drag/drop handler event experiments lived here
                    },
                    nodeDropped:function(params) {
                        let target = params.target
                        let source = params.source
                        let sourceId = params.source.data.id
                        let targetId = params.target.data.id

                        //If the source was previously a child of any parent, disassociate
                        if (source.data.parent) {
                            let oldParent = toolkit.getNode(source.data.parent)
                            if (oldParent) {
                                oldParent.data.children = _.remove(oldParent.data.children, (id) => { return id == sourceId })
                                toolkit.updateNode(oldParent);
                            }
                        }

                        //Assign the source to the new parent
                        target.data.children = target.data.children || []
                        target.data.children.push(source.data.id)
                        toolkit.updateNode(target)

                        //Update the source
                        source.data.parent = targetId
                        source.data.h = target.data.h * 0.667
                        source.data.w = target.data.w * 0.667
                        source.data.order = target.children.length
                        toolkit.updateNode(source)

                        renderer.refresh()
                    }
                },
                elementsDroppable:true,
                dragOptions:{
                    filter:".segment",       // can't drag nodes by the color segments.
                    stop:function() {
                        // when _any_ node stops dragging, run the layout again.
                        // this will cause child nodes to snap to their new parent, and also
                        // cleanup nicely if a node is dropped on another node.
                        renderer.refresh();
                    }
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
                        var newWidth = node.data.w * 0.667;
                        var newHeight = node.data.h * 0.667;

                        node.data.children = node.data.children || [];
                        var newLabel = 'Part';

                        var newNode = toolkit.addNode({
                            parent:node.id,
                            w:newWidth,
                            h:newHeight,
                            label: newLabel,
                            order: node.data.children.length
                            });

                        node.data.children.push(newNode.id);
                        renderer.relayout();
                    },
                    orange:function(el, node) {
                        clickLogger('O', 'dblclick', el, node)
                        var newNode = toolkit.addNode(_newNode());

                        toolkit.connect({source:node, target:newNode, data:{
                            type:"perspective"
                        }});
                    },
                    blue:function(el, node) {
                        clickLogger('B', 'dblclick', el, node)
                        var newNode = toolkit.addNode(_newNode());

                        toolkit.connect({source:node, target:newNode, data:{
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
                    start: function () {
                        labelDragHandler.setZoom(renderer.getZoom());
                    },
                    stop: function (e) {
                        node.data.labelPosition = [
                            parseInt(label.style.left, 10),
                            parseInt(label.style.top, 10)
                        ]
                        that.onAutoSave(toolkit.exportData())
                    }
                });

                // make the label editable via a dialog
                jsPlumb.on(label, "dblclick", function () {
                    jsPlumbToolkit.Dialogs.show({
                        id: "dlgText",
                        title: "Enter label:",
                        onOK: function (d) {
                            toolkit.updateNode(node, { label: d.text });
                        },
                        data: {
                            text: node.data.label
                        }
                    });
                });
            }

        // ----------------------------------------------------------------------------------------------------------------------

            // load the data.
            if (that.map && that.map.data) {
                toolkit.load({
                    type: 'json',
                    data: that.map.data
                })
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
                that.onAutoSave(toolkit.exportData())
            })

            jsPlumb.on("relationshipEdgeDump", "click", dumpEdgeCounts());

            //CTRL + click enables the lasso
            jsPlumb.on(document, 'mousedown', function(event) {
                if (event.ctrlKey) {
                    event.preventDefault()
                }
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

            let mode = null;
            //map backspace to delete if anything is selected
            jsPlumb.on(document, 'keyup', function(event) {
                mode = null
                var selected = toolkit.getSelection();
                switch (event.keyCode) {
                    case 8:
                        if(selected) {
                            event.preventDefault()
                        }
                        deleteAll(selected);
                        break
                    case 17:
                        selected.eachNode((i, node) => {
                            let info = toolkit.getObjectInfo(node)
                            if (info.el) {
                                $(info.el).find('.node-border').each(function () {
                                    this.setAttribute('class', 'node-selected')
                                })
                            }
                            if (info.els) {
                                _.each(info.els, (array) => {
                                    _.each(array, (el) => {
                                        if (el.innerHTML) {
                                            $(el).find('.node-border').each(function () {
                                                this.setAttribute('class', 'node-selected')
                                            })
                                        }
                                    })
                                })
                            }
                        })

                        break
                    case 46:
                        deleteAll(selected);
                        break;
                }
            })

            jsPlumb.on(document, 'contextmenu', function(event) {
                event.preventDefault()
            })

            jsPlumb.on(document, 'keydown', function(event) {
                if (event.ctrlKey) {
                    if (!mode) {
                        mode = 'select'
                        renderer.setMode('select')
                    }
                } else {
                    switch (event.keyCode) {
                        case 8:
                            event.preventDefault()
                            break;
                        case 46:
                            var selected = toolkit.getSelection();
                            deleteAll(selected);
                            break;
                    }
                }
            })
        })
    }

    _init(opts) {
        if(opts.map) this.map = opts.map;
        if(opts.mapId) this.mapId = opts.mapId;

        this.isReadOnly = false
        if(opts.doAutoSave == true || opts.doAutoSave == false) this.doAutoSave = opts.doAutoSave
        if (this.map && this.doAutoSave) {
            this.permissions = new Permissions(this.map)
            this.isReadOnly = !this.permissions.canEdit()
        }
    }

    reInit(opts) {
         this._init(opts)
    }

    exportData() {
        let ret = JSON.parse(JSON.stringify(this.toolkit.exportData()))
        return ret
    }


}

module.exports = Canvas;
