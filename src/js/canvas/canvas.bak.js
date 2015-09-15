const jsPlumb = window.jsPlumb;
const jsPlumbToolkit = window.jsPlumbToolkit;
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
            this.toolkit = window.toolkit = jsPlumbToolkit.newInstance({
                // autoSave:true,
                // saveUrl:'https://localhost:10',
                // onAutoSaveError: (msg) => {
                //     throttleSave();
                //     return true;
                // },
                // onAutoSaveSuccess: (response) => {
                //     console.log('Success should not happen')
                // },
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
            let _newNode = function() {
                return {
                    w:100,
                    h:100,
                    label:'idea',
                    type:'idea'
                };
            };

            let mainElement = document.querySelector('.jtk-demo-main'),
                canvasElement = mainElement.querySelector('.jtk-demo-canvas');


            let renderer = this.toolkit.render({
                container:canvasElement,
                layout:{
                    type:'metamap'
                },
                zoomToFit: true,
                assignPosse:function(node) {
                    return node.data.parent || node.id;
                },
                view:{
                    nodes:{
                        'default':{
                            template:'tmplNode'
                        },
                        "proxy":{
                            template:"tmplDragProxy"
                        }
                    },
                    edges:{
                        'default':{
                            anchor:["Continuous","Continuous"]
                        },
                        relationship:{
                            cssClass:'edge-relationship',
                            connector:'StateMachine',
                            endpoint:'Blank',
                            overlays:[
                                [ 'PlainArrow', { location:1, width:10, length:10, cssClass:'relationship-overlay' } ]
                            ]
                        },
                        perspective:{
                            connector:'StateMachine',
                            cssClass:'edge-perspective',
                            endpoints:[ 'Blank', [ 'Dot', { radius:10, cssClass:'orange' }]]
                        }
                    }
                },
                events:{
                    canvasClick: (e) => {
                        this.toolkit.clearSelection();
                    },
                    canvasDblClick: (e) => {
                        // add an Idea node at the location at which the event occurred.
                        let pos = renderer.mapEventLocation(e);
                        this.toolkit.addNode(jsPlumb.extend(_newNode(), pos));
                    },
                    nodeAdded:_registerHandlers // see below
                },
                dragOptions:{
                    filter:'.segment',       // can't drag nodes by the color segments.
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

            let _types = [ 'red', 'orange', 'green', 'blue' ];

            let _clickHandlers = {
                'click':{
                    'red':function(el, node) {
                        console.log('click red');
                        console.dir(node.data);
                        _info('Double click to create a new idea. Right-click to mark with a distinction flag');
                    },
                    'green':function(el, node) {
                        console.log('click green');
                        console.dir(node.data);
                        _info('Double click to add a part. Single click to show/hide parts');
                    },
                    'orange':function(el, node) {
                        console.log('click orange');
                        console.dir(node.data);
                        _info('Drag to create a Perspective. Double click to open Perspective Editor');
                    },
                    'blue':function(el, node) {
                        console.log('click blue');
                        console.dir(node.data);
                        _info('Double click to create a new related idea. Drag to relate to an existing idea.');
                    }
                },
                'dblclick':{
                    'red':function(el, node) {
                        console.log('double click red');
                        console.dir(node.data);
                    },
                    'green':function(el, node) {
                        console.log('double click green');
                        console.dir(node.data);
                    },
                    'orange':function(el, node) {
                        console.log('double click orange');
                        console.dir(node.data);
                    },
                    'blue':(el, node) => {
                        console.log('double click blue');
                        console.dir(node.data);
                        this.toolkit.batch(()=> {
                            let newNode = this.toolkit.addNode(_newNode());
                            this.toolkit.connect({source:node, target:newNode, data:{
                                type:'perspective'
                            }});
                        });
                    }
                }
            };

            let _curryHandler = function(el, segment, node) {
                let _el = el.querySelector('.' + segment);
                jsPlumb.on(_el, 'click', function () {
                    _clickHandlers['click'][segment](el, node);
                });
                jsPlumb.on(_el, 'dblclick', function () {
                    _clickHandlers['dblclick'][segment](el, node);
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
                let el = params.el, node = params.node, label = el.querySelector('.name');
                for (let i = 0; i < _types.length; i++) {
                    _curryHandler(el, _types[i], node);
                }

                $(label).editable({
                    unsavedclass: null,
                    mode: 'inline',
                    toggle: 'dblclick',
                    type: 'textarea'
                }).on('save', (event, params) => {
                    var info = renderer.getObjectInfo(label);
                    that.toolkit.updateNode(info.obj, { label: params.newValue });
                });

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
            }

            function _info(text) {
                document.getElementById('info').innerHTML = text;
            }

            if (this.map && this.map.data) {
                this.toolkit.load({
                    type: 'json',
                    data: this.map.data
                })
            }

            // --------------------------------------------------------------------------------------------------------
            // a couple of random examples of the filter function, allowing you to query your data
            // --------------------------------------------------------------------------------------------------------

            let countEdgesOfType = (type) => {
                return this.toolkit.filter(function(obj) { return obj.objectType == 'Edge' && obj.data.type===type; }).getEdgeCount()
            };
            let dumpEdgeCounts = function() {
                console.log('There are ' + countEdgesOfType('relationship') + ' relationship edges');
                console.log('There are ' + countEdgesOfType('perspective') + ' perspective edges');
            };

            jsPlumb.on('relationshipEdgeDump', 'click', dumpEdgeCounts());

            jsPlumb.on(document, 'keyup', (event) => {
                switch (event.keyCode) {
                    case 46:
                        let selected = this.toolkit.getSelection();
                        this.toolkit.remove(selected);
                        break;
                }
            })

            this.toolkit.bind('dataUpdated', function() {
                dumpEdgeCounts();
            });

         }); //jsplumb ready
    }

    init() {

    }
}

// get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.

module.exports = Canvas;