const jsPlumb = window.jsPlumb;
const jsPlumbToolkit = window.jsPlumbToolkit;

class Canvas {

    constructor(map, mapId) {
        this.map = map;
        this.mapId = mapId;
        this.toolkit = {};
        this.metaMap = require('../../MetaMap')

        jsPlumbToolkit.ready(() => {
            this.toolkit = jsPlumbToolkit.newInstance({
                autoSave:true,
                saveUrl:"https://localhost:10",
                onAutoSaveError: (msg) => {
                   var postData = {
                        data: this.toolkit.exportData(),
                        changed_by: this.metaMap.User.userKey
                    };
                    // $scope.map.loadMapExtraData(response.data.map);
                    this.metaMap.MetaFire.setDataInTransaction(postData, `maps/data/${this.mapId}`);
                    this.metaMap.Integrations.sendEvent(this.mapId, 'event', 'autosave', 'autosave')
                },
                onAutoSaveSuccess: (response) => {
                    console.log('Success should not happen')
                },
                model: {
                    beforeStartConnect:function(fromNode, edgeType) {
                        return true;
                    },
                    beforeConnect:function(fromNode, toNode) {
                        return true;
                    }
                }
            });

            //
            // dummy for a new node.
            //
            var _newNode = function() {
                return {
                    w:150,
                    h:150,
                    label:"idea",
                    type:'idea'
                };
            };

            var mainElement = document.querySelector(".jtk-demo-main"),
                canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
                miniviewElement = mainElement.querySelector(".miniview");


            var renderer = this.toolkit.render({
                container:canvasElement,
                miniview:{
                    container:miniviewElement
                },
                layout:{
                    type:"Spring",
                    absoluteBacked:false
                },
                zoomToFit:true,
                view:{
                    nodes:{
                        "default":{
                            template:"tmplNode",
                            parameters: {
                                w: 150,
                                h: 150
                            }
                        }
                    },
                    edges:{
                        "default":{
                            anchor:["Perimeter", { shape:"Circle" }]
                        },
                        relationship:{
                            cssClass:"edge-relationship",
                            connector:"StateMachine",
                            endpoint:"Blank",
                            overlays:[
                                [ "PlainArrow", { location:1, width:10, length:10, cssClass:"relationship-overlay" } ]
                            ]
                        },
                        perspective:{
                            connector:"StateMachine",
                            cssClass:"edge-perspective",
                            endpoints:[ "Blank", [ "Dot", { radius:10, cssClass:"orange" }]]
                        }
                    }
                },
                events:{
                    canvasDblClick:(e) => {
                        // add an Idea node at the location at which the event occurred.
                        var pos = renderer.mapEventLocation(e);
                        this.toolkit.addNode(jsPlumb.extend(_newNode(), pos));
                    },
                    nodeAdded:_registerHandlers // see below
                },
                dragOptions:{
                    filter:".segment",       // can't drag nodes by the color segments.
                    stop:function() {

                    },
                    start:function(params) {

                    }
                }
            });


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
                    "blue":(el, node) => {
                        console.log("double click blue");
                        console.dir(node.data);
                        this.toolkit.batch(()=> {
                            var newNode = this.toolkit.addNode(_newNode());
                            this.toolkit.connect({source:node, target:newNode, data:{
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
            // setup the clicking actions and the label drag (which is a little shaky right now; jsPlumb's
            // drag is not exactly intended as an ad-hoc drag because it assumes things about the node's
            // offsetParent. a simple, dedicated, drag handler is simple to write)
            //
            function _registerHandlers(params) {
                // here you have params.el, the DOM element
                // and params.node, the underlying node. it has a `data` member with the node's payload.
                var el = params.el, node = params.node, label = el.querySelector(".name");
                for (var i = 0; i < _types.length; i++) {
                    _curryHandler(el, _types[i], node);
                }

                // make the label draggable (see note above).
                jsPlumb.draggable(label, {
                    stop:function(e) {
                        node.data.labelPosition = [
                            parseInt(label.style.left, 10),
                            parseInt(label.style.top, 10)
                        ]
                    }
                });
            }

            function _info(text) {
                document.getElementById("info").innerHTML = text;
            }

            // --------------------------------------------------------------------------------------------------------
            // a couple of random examples of the filter function, allowing you to query your data
            // --------------------------------------------------------------------------------------------------------

            var countEdgesOfType = (type) => {
                return this.toolkit.filter(function(obj) { return obj.objectType == "Edge" && obj.data.type===type; }).getEdgeCount()
            };
            var dumpEdgeCounts = function() {
                console.log("There are " + countEdgesOfType("relationship") + " relationship edges");
                console.log("There are " + countEdgesOfType("perspective") + " perspective edges");
            };

            jsPlumb.on("relationshipEdgeDump", "click", dumpEdgeCounts());

            this.toolkit.bind("dataUpdated", function() {
                dumpEdgeCounts();
            });

        }); //jsPlumb.ready
    }

    init() {
        if (this.map && this.map.data) {
            this.toolkit.load({
                type: 'json',
                data: this.map.data
            })
        }
    }
}

// get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.

module.exports = Canvas;