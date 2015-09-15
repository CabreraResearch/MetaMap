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
            // $scope.map.loadMapExtraData(response.data.map);
            this.metaMap.MetaFire.setDataInTransaction(postData, `maps/data/${this.mapId}`);
            this.metaMap.Integrations.sendEvent(this.mapId, 'event', 'autosave', 'autosave')
        }, 500);

        jsPlumbToolkit.ready(() => {


            // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.
            var toolkit = window.toolkit = jsPlumbToolkit.newInstance({
                model: {
                    beforeStartConnect:(fromNode, edgeType) => {
                        return true;
                    },
                    beforeConnect:(fromNode, toNode) => {
                        return true;
                    }
                }
            });
            this.toolkit = toolkit;

            //
            // dummy for a new node.
            //
            var _newNode = function() {
                return {
                    w:100,
                    h:100,
                    label:"idea",
                    type:'idea'
                };
            };

            var mainElement = document.querySelector(".jtk-demo-main"),
                canvasElement = mainElement.querySelector(".jtk-demo-canvas")


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
                        "default":{
                            template: "tmplNode",
                            events: {
                                tap: (obj) => {
                                    this.toolkit.clearSelection()
                                    this.toolkit.setSelection(obj.node);
                                }
                            }
                        },
                        "proxy":{
                            template:"tmplDragProxy"
                        }
                    },
                    edges:{
                        "default":{
                            anchors:["Continuous","Continuous"],
                            events: {
                                tap: (obj) => {
                                    this.toolkit.clearSelection()
                                    this.toolkit.setSelection(obj.edge);
                                }
                            }
                        },
                        relationship:{
                            cssClass:"edge-relationship",
                            connector:"StateMachine",
                            endpoint:"Blank",
                            overlays:[
                                [ "PlainArrow", { location:1, width:10, length:10, cssClass:"relationship-overlay" } ]
                            ],
                            events: {
                                tap: (obj) => {
                                    this.toolkit.clearSelection()
                                    this.toolkit.setSelection(obj.edge);
                                }
                            }
                        },
                        perspective:{
                            connector:"StateMachine",
                            cssClass:"edge-perspective",
                            endpoints: ["Blank", ["Dot", { radius: 10, cssClass: "orange" }]],
                            events: {
                                tap: (obj) => {
                                    this.toolkit.clearSelection()
                                    this.toolkit.setSelection(obj.edge);
                                }
                            }
                        }
                    }
                },
                events:{
                    canvasClick: (e) => {
                        this.toolkit.clearSelection();
                    },
                    canvasDblClick: function (e) {
                        // add an Idea node at the location at which the event occurred.
                        var pos = renderer.mapEventLocation(e);
                        toolkit.addNode(jsPlumb.extend(_newNode(), pos));
                    },
                    nodeAdded:_registerHandlers // see below
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

            var _types = [ "red", "orange", "green", "blue" ];

            var _clickHandlers = {
                "click":{
                    "red":function(el, node) {
                        console.log("click red");
                        console.dir(node.data);
                        _info("Double click to create a new idea. Right-click to mark with a distinction flag");
                    },
                    "green":function(el, node) {
                        console.log("click green");
                        console.dir(node.data);
                        _info("Double click to add a part. Single click to show/hide parts");
                    },
                    "orange":function(el, node) {
                        console.log("click orange");
                        console.dir(node.data);
                        _info("Drag to create a Perspective. Double click to open Perspective Editor");
                    },
                    "blue":function(el, node) {
                        console.log("click blue");
                        console.dir(node.data);
                        _info("Double click to create a new related idea. Drag to relate to an existing idea.");
                    }
                },
                "dblclick":{
                    "red":function(el, node) {
                        console.log("double click red");
                        console.dir(node.data);
                    },
                    "green":function(el, node) {
                        console.log("double click green");
                        console.dir(node.data);
                    },
                    "orange":function(el, node) {
                        console.log("double click orange");
                        console.dir(node.data);
                    },
                    "blue":function(el, node) {
                        console.log("double click blue");
                        console.dir(node.data);
                        toolkit.batch(function() {
                            var newNode = toolkit.addNode(_newNode());
                            toolkit.connect({source:node, target:newNode, data:{
                                type:"perspective"
                            }});
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
                document.getElementById("info").innerHTML = text;
            }


        // ----------------------------------------------------------------------------------------------------------------------

            // load the data.
            if (this.map && this.map.data) {
                this.toolkit.load({
                    type: 'json',
                    data: this.map.data
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

            jsPlumb.on("relationshipEdgeDump", "click", dumpEdgeCounts());

            jsPlumb.on(document, 'keyup', (event) => {
                switch (event.keyCode) {
                    case 46:
                        let selected = this.toolkit.getSelection();
                        this.toolkit.remove(selected);
                        break;
                }
            })

            toolkit.bind("dataUpdated", function () {
                throttleSave();
                dumpEdgeCounts();
            });

        });

    }

    init() {

    }
}

// get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.

module.exports = Canvas;