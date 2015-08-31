const SandbankEditor = require('./sbEditor');
require('./buttons/button')
// goJS templates used in the editor

SandbankEditor.Templates = function ($scope, map) {

    var self = this;

    const metaMap = require('../../MetaMap');
    const config = metaMap.config.canvas;
    const CONSTANTS = require('../constants/constants');
    // constants
    //this.groupFillColor = "#f9f9f9";

    this.init = function () { };

    // initialize template-related stuff that depends on the diagram (and therefore can't go in init())
    this.initTemplates = function (diagram) {
        diagram.groupTemplate = self.groupTemplate;
        diagram.nodeTemplate = self.slideTemplate;
        diagram.linkTemplate = self.linkTemplate;
        diagram.linkTemplateMap.add(CONSTANTS.DSRP.P, self.pLinkTemplate);
        diagram.linkTemplateMap.add(CONSTANTS.DSRP.D, self.dLinkTemplate);

        self.setTemporaryLinkTemplates(diagram.toolManager.draggingTool);
        self.setTemporaryLinkTemplates(diagram.toolManager.linkingTool);
        self.setTemporaryLinkTemplates(diagram.toolManager.relinkingTool);

        diagram.toolManager.linkingTool.portTargeted = function (realnode, realport, tempnode, tempport, toend) {
            self.handlePortTargeted(diagram, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.draggingTool.portTargeted = function (realnode, realport, tempnode, tempport, toend) {
            self.handlePortTargeted(diagram, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.relinkingTool.portTargeted = function (realnode, realport, tempnode, tempport, toend) {
            self.handlePortTargeted(diagram.toolManager.relinkingTool, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.relinkingTool.updateAdornments = function (part) {
            go.RelinkingTool.prototype.updateAdornments.call(this, part);
            var from = part.findAdornment('RelinkFrom');
            var to = part.findAdornment('RelinkTo');
            // if (from)
            //     //console.log('relinkfrom: ' + from.part.width);
        };

        diagram.toolManager.draggingTool.linkValidation = self.validateLink;
        diagram.toolManager.linkingTool.linkValidation = self.validateLink;
        diagram.toolManager.relinkingTool.linkValidation = self.validateLink;
    };

    // convenient abbreviation for creating templates
    var mk = go.GraphObject.make;

    // DSRP colors (from _variables.scss)
    //var colorD = "#f2624c";
    //var colorS = "#96c93d";
    //var colorR = "#4cbfc2";
    //var colorP = "#fbaa36";
    //var colorPLight = "#FDDDAF";
    //var colorPDark = "#C9882B";

    // var eyeSvgPath = "M 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00c 47.559,94.979, 144.341,160.00, 256.00,160.00c 111.657,0.00, 208.439-65.021, 256.00-160.00 C 464.442,161.021, 367.657,96.00, 256.00,96.00z M 382.225,180.852c 30.081,19.187, 55.571,44.887, 74.717,75.148 c-19.146,30.261-44.637,55.961-74.718,75.149C 344.427,355.257, 300.779,368.00, 256.00,368.00c-44.78,0.00-88.428-12.743-126.225-36.852 C 99.695,311.962, 74.205,286.262, 55.058,256.00c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65 C 130.725,190.866, 128.00,205.613, 128.00,221.00c0.00,70.692, 57.308,128.00, 128.00,128.00s 128.00-57.308, 128.00-128.00c0.00-15.387-2.725-30.134-7.704-43.799 C 378.286,178.39, 380.265,179.602, 382.225,180.852z M 256.00,205.00c0.00,26.51-21.49,48.00-48.00,48.00s-48.00-21.49-48.00-48.00s 21.49-48.00, 48.00-48.00 S 256.00,178.49, 256.00,205.00z";
    // var eyeBlockedSvgPath = "M 419.661,148.208 C 458.483,175.723 490.346,212.754 512.00,256.00 C 464.439,350.979 367.657,416.00 256.00,416.00 C 224.717,416.00 194.604,410.894 166.411,401.458 L 205.389,362.48 C 221.918,366.13 238.875,368.00 256.00,368.00 C 300.779,368.00 344.427,355.257 382.223,331.148 C 412.304,311.96 437.795,286.26 456.941,255.999 C 438.415,226.716 413.934,201.724 385.116,182.752 L 419.661,148.208 ZM 256.00,349.00 C 244.638,349.00 233.624,347.512 223.136,344.733 L 379.729,188.141 C 382.51,198.627 384.00,209.638 384.00,221.00 C 384.00,291.692 326.692,349.00 256.00,349.00 ZM 480.00,0.00l-26.869,0.00 L 343.325,109.806C 315.787,100.844, 286.448,96.00, 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00 c 21.329,42.596, 52.564,79.154, 90.597,106.534L0.00,453.131L0.00,480.00 l 26.869,0.00 L 480.00,26.869L 480.00,0.00 z M 208.00,157.00c 24.022,0.00, 43.923,17.647, 47.446,40.685 l-54.762,54.762C 177.647,248.923, 160.00,229.022, 160.00,205.00C 160.00,178.49, 181.49,157.00, 208.00,157.00z M 55.058,256.00 c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65C 130.725,190.866, 128.00,205.613, 128.00,221.00 c0.00,29.262, 9.825,56.224, 26.349,77.781l-29.275,29.275C 97.038,309.235, 73.197,284.67, 55.058,256.00z";
    // var paperclipSvgPath = "M 348.916,163.524l-32.476-32.461L 154.035,293.434c-26.907,26.896-26.907,70.524,0.00,97.422 c 26.902,26.896, 70.53,26.896, 97.437,0.00l 194.886-194.854c 44.857-44.831, 44.857-117.531,0.00-162.363 c-44.833-44.852-117.556-44.852-162.391,0.00L 79.335,238.212l 0.017,0.016c-0.145,0.152-0.306,0.288-0.438,0.423 c-62.551,62.548-62.551,163.928,0.00,226.453c 62.527,62.528, 163.934,62.528, 226.494,0.00c 0.137-0.137, 0.258-0.284, 0.41-0.438l 0.016,0.017 l 139.666-139.646l-32.493-32.46L 273.35,432.208l-0.008,0.00 c-0.148,0.134-0.282,0.285-0.423,0.422 c-44.537,44.529-116.99,44.529-161.538,0.00c-44.531-44.521-44.531-116.961,0.00-161.489c 0.152-0.152, 0.302-0.291, 0.444-0.423l-0.023-0.03 l 204.64-204.583c 26.856-26.869, 70.572-26.869, 97.443,0.00c 26.856,26.867, 26.856,70.574,0.00,97.42L 218.999,358.375 c-8.968,8.961-23.527,8.961-32.486,0.00c-8.947-8.943-8.947-23.516,0.00-32.46L 348.916,163.524z";

    // footer for image export
    var _exportFooter = null;

    // ------------------- debug info for groups/links --------------------------------

    function groupInfo(obj) {
        return obj.data.text + "\n" +
            'object: ' + obj + "\n" +
            'key: ' + obj.data.key + "\n" +
            'containingGroup: ' + obj.containingGroup + "\n" +
            'layout: ' + obj.layout + "\n" +
            'data.layout: ' + obj.data.layout + "\n" +
            'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + "\n" +
            'freehand position (data.loc): ' + go.Point.parse(obj.data.loc) + "\n" +
            'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + "\n" +
            'getScale(): ' + map.layouts.getScale(obj) + "\n" +
            'isLinkLabel: ' + obj.data.isLinkLabel + "\n" +
            'labeledLink: ' + obj.labeledLink + "\n";
    }

    function nodeInfo(obj) {
        return 'object: ' + obj + "\n" +
            'key: ' + obj.data.key + "\n" +
            'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + "\n" +
            'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + "\n";
    }

    function linkInfo(obj) {
        var snpos = map.layouts.getSameNodesLinkPosition(obj);
        return '' +
            'object: ' + obj + "\n" +
            'fromNode: ' + obj.fromNode + "\n" +
            'toNode: ' + obj.toNode + "\n" +
            'labelNodes: ' + obj.labelNodes.count + "\n" +
            'labelNodeIsVisible: ' + map.layouts.labelNodeIsVisible(obj) + "\n" +
            'fromPortId: ' + obj.fromPortId + "\n" +
            'toPortId: ' + obj.toPortId + "\n" +
            'category: ' + (obj.data ? obj.data.category : '') + "\n" +
            'containingGroup: ' + obj.containingGroup + "\n" +
            'fromAndToNodesAreVisible: ' + map.layouts.fromAndToNodesAreVisible(obj) + "\n" +
            'curve: ' + obj.curve + "\n" +
            'curviness: ' + obj.curviness + "\n" +
            'fromEndSegmentLength: ' + Math.round(obj.fromEndSegmentLength) + "\n" +
            'toEndSegmentLength: ' + Math.round(obj.toEndSegmentLength) + "\n" +
            'sameNodesLinkPosition: ' + snpos.index + ' of ' + snpos.count + "\n" +
        //+ 'geometry: ' + obj.geometry + "\n" +
            'getLinkStrokeWidth: ' + map.layouts.getLinkStrokeWidth(obj) + "\n";
    }

    // -----------------------------------------------------------------------------

    // NB: these are here because they are about colors;
    // similar functions that are scale-related are in layouts.js...
    function getGroupSelectionStroke(obj) {
        if (obj.isSelected) {
            if (map.perspectives.isInPEditorMode())
                return config.colors.DSRP.P;
            else if (map.perspectives.isInDEditorMode())
                return config.colors.DSRP.D;
            else
                return config.shapes.box.borderColor;
        } else {
            return config.shapes.box.borderColor;
        }
    }

    // OK, this isn't about colors, but it wants to be near the one above...
    function getGroupSelectionStrokeWidth(obj) {
        return (obj.isSelected ? config.shapes.box.borderHighlightWidth : config.shapes.box.borderWidth);
    }

    function getRLinkSelectionStroke(obj) {
        if (obj.isSelected || obj == map.ui.mouseOverLink) {
            return config.shapes.line.highlightColor; // TODO: can P links be selected?
        } else {
            return config.shapes.line.color;
        }
    }

    // -----------------------------------------------------------------------------

    // callbacks to determine when the corners should be visible

    function showDCorner(group) {
        if (map.perspectives.isDEditorThing(group)) { // mark distinction thing
            return true;
        } else if (map.perspectives.isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (map.presenter.isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return (group == map.ui.mouseOverGroup) || // show corners on mouseover
                ($scope.isTouchDevice() && group.isSelected) ||
                (canDragSelectionToBecomeSistersOf(group, false) && // drag to D (make it sisters)
                    (map.ui.dragTargetPosition === null ||
                        cannotDragSelectionToBecomeOrderedSisterOf(group))); // not showing drag above/below indicators
        }
    }

    function showSCorner(group) {
        if (map.perspectives.isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (map.presenter.isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return (group == map.ui.mouseOverGroup) || // show corners on mouseover
                ($scope.isTouchDevice() && group.isSelected) ||
                (canDragSelectionToBecomeChildrenOf(group, false) && // drag to S (make it children)
                    (map.ui.dragTargetPosition === null ||
                        cannotDragSelectionToBecomeOrderedSisterOf(group))); // not showing drag above/below indicators
        }
    }

    function showRCorner(group) {
        if (map.perspectives.isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (map.presenter.isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group == map.ui.mouseOverGroup ||
                ($scope.isTouchDevice() && group.isSelected); // show corners on mouseover
        }
    }

    function showPCorner(group) {
        if (map.perspectives.isPEditorPoint(group)) {
            return true; // mark perspective point
        } else if (map.perspectives.isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (map.presenter.isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group == map.ui.mouseOverGroup ||
                ($scope.isTouchDevice() && group.isSelected); // show corners on mouseover
        }
    }

    // when a P link should be visible

    this.showPLink = function (link) {
        var mode = map.ui.getMapEditorOptions().perspectiveMode;
        if (map.perspectives.isPEditorPoint(link.fromNode)) { // show P's when this link is from the current Point
            return true;
        } else if (map.perspectives.isInPOrDEditorMode()) { // don't show P's for non-Point things, even on mouseover
            return false;
        } else {
            return (mode == 'lines' || mode == 'both') && (link.fromNode == map.ui.mouseOverGroup || map.pIsExpanded(link.fromNode));
        }
    };

    this.showPDot = function (link) {
        return true; // map.ui.getMapEditorOptions().perspectiveMode != 'both';
    };

    // these functions are used in two modes:
    // 1. with isDropping == false, to highlight drop targets based on map.ui.dragTargetGroup and map.ui.dragTargetPosition,
    //    which are set on mouseDragEnter/mouseDragleave
    // 2. with isDropping == true, on drop, when the above indicators have gone away, but we know what the dropped
    //    and target groups are, and we want to know what the drop should do.

    function canDragSelectionToBecomeSistersOf(group, isDropping) {
        return (group == map.ui.dragTargetGroup || isDropping) &&
            map.thingsSelectedAreDescendantsOf(group);
    }

    function canDragSelectionToBecomeChildrenOf(group, isDropping) {
        return (group == map.ui.dragTargetGroup || isDropping) &&
            !map.thingsSelectedIncludeSlide() &&
            !map.thingsSelectedAreDescendantsOf(group);
    }

    // side is map.LEFT or map.RIGHT
    function canDragSelectionToBecomeOrderedSisterOf(targetGroup, side, isDropping) {
        // must be dragging single group
        var draggedGroup = map.getUniqueThingSelected();
        if (!draggedGroup) {
            return false;
        }

        // dragged and target must be Sisters in inventory layout
        return (targetGroup == map.ui.dragTargetGroup || isDropping) &&
            (map.ui.dragTargetPosition == side || isDropping) &&
            map.layouts.areSistersInInventoryLayout(draggedGroup, targetGroup);
    }

    function cannotDragSelectionToBecomeOrderedSisterOf(targetGroup) {
        return !canDragSelectionToBecomeOrderedSisterOf(targetGroup, map.LEFT) &&
            !canDragSelectionToBecomeOrderedSisterOf(targetGroup, map.RIGHT);
    }

    // handle drop on one of the three target regions (top, middle, bottom)
    // side is map.LEFT or map.RIGHT
    function handleGroupMouseDrop(event, dropTarget, side) {
        //console.log('dragAboveTarget.mouseDrop, target: ' + dropTarget + ', part: ' + dropTarget .part + ', show: ' + show);
        if (side !== null && canDragSelectionToBecomeOrderedSisterOf(dropTarget.part, side, true)) {
            map.addSelectedThingAsOrderedSisterOf(dropTarget.part, side);
        } else if (canDragSelectionToBecomeSistersOf(dropTarget.part, true)) {
            map.addSelectedThingsAsSistersOf(dropTarget.part);
        } else if (canDragSelectionToBecomeChildrenOf(dropTarget.part, true)) {
            map.addSelectedThingsAsChildrenOf(dropTarget.part);
        }
    }

    // when to show the R-thing knob on a link
    function showKnob(link) {
        return link == map.ui.mouseOverLink;
    }

    // ---------------- components for main group template ------------------

    // show only when system is collapsed
    function sCollapsedMarker() {
        return mk(go.Shape,
            new go.Binding('visible', '', function (obj) {
                return !showSCorner(obj) && obj.memberParts.count > 0 && !obj.isSubGraphExpanded;
            }).ofObject(), {
                position: new go.Point(5, 88),
                desiredSize: new go.Size(5, 10),
                geometry: go.Geometry.parse("F M0 0 L5 5 L0 10z", true),
                fill: config.colors.darkGrey,
                stroke: null,
                cursor: 'pointer',
                pickable: false
            }
            );
    }



    function attachmentPaperClip() {
        return mk(go.Shape,
            new go.Binding('visible', '', function (obj) {
                return obj.data.attachments !== null && obj.data.attachments !== undefined && obj.data.attachments.length > 0;
            }).ofObject(),
            new go.Binding('geometry', '', function (obj) {
                return go.Geometry.parse(config.shapes.paperClip.svg, true);
            }).ofObject(),
            new go.Binding('desiredSize', '', function (obj) {
                return new go.Size(512, 512); // NB: the two icons don't scale to the same proportions for some reason - ??
            }).ofObject(), {
                position: new go.Point(46, 85),
                scale: 0.02,
                stroke: config.colors.black,
                fill: config.colors.black,
                click: function (event, target) {
                    //console.log('clip clicked');
                    map.ui.toggleTab(map.ui.TAB_ID_ATTACHMENTS);
                }
            }
            );
    }

    function pEyeball() {
        return mk(go.Shape,
            new go.Binding('visible', '', function (obj) {
                return map.perspectives.isPerspectivePoint(obj);
            }).ofObject(),
            new go.Binding('geometry', '', function (obj) {
                return go.Geometry.parse(map.pIsExpanded(obj) ? config.shapes.eye.svg : config.shapes.eye.svgBlocked, true);
            }).ofObject(),
            new go.Binding('desiredSize', '', function (obj) {
                return new go.Size(512, map.pIsExpanded(obj) ? 440 : 512); // NB: the two icons don't scale to the same proportions for some reason - ??
            }).ofObject(), {
                position: new go.Point(87, 4),
                scale: 0.02,
                stroke: config.colors.black,
                fill: config.colors.black,
                pickable: false
            }
            );
    }

    // P expansion indicator - this shows when the P corner is not visible, and only if the thing is a perspective point
    function pointMarker() {
        return pEyeball();
    }

    // P view indicator
    function viewMarker() {
        return;
    }

    function getViewMarkerFill(obj) {
        var weight = map.perspectives.getPerspectiveViewWeight(obj);

        if (weight == 3) {
            return config.colors.P.dark;
        } else if (weight == 2) {
            return config.colors.DSRP.P;
        } else if (weight == 1) {
            return config.colors.P.light;
        } else {
            return "transparent";
        }
    }

    // --------- handlers for mouse drag/drop actions on groups, which need to be replicated on different target parts -------

    // position is map.LEFT, null, or map.RIGHT
    this.getGroupMouseDragEnterHandler = function (position) {
        return function (event, target, obj2) {
            //console.log('mouseDragEnter, e.dp: ' + event.documentPoint + ', target.part: ' + target.part + ', target bounds: ' + target.actualBounds);
            map.ui.dragTargetGroup = target.part;
            map.ui.dragTargetPosition = position;
            map.diagram.updateAllTargetBindings();
        };
    }

    this.groupMouseDragLeaveHandler = function (event, target, obj2) {
        map.ui.dragTargetGroup = null;
        map.ui.dragTargetPosition = null;
        map.diagram.updateAllTargetBindings();
    };

    this.getGroupMouseDropHandler = function (position) {
        return function (event, dropTarget) {
            handleGroupMouseDrop(event, dropTarget, position);
        };
    }

    const react = require('./buttons/buttonClick')
    var groupClickHandler = function (event, target) {
        // handle single or double click
        react(map, '', target)
        return true;
    };
    // -------------- group/Thing template --------------------

    var nodeHoverAdornment =
        mk(go.Adornment, "Spot",
            {
                background: "transparent",
                mouseLeave: function (e, obj) {
                    var ad = obj.part;
                    ad.adornedPart.removeAdornment("mouseHover");
                }
            },
            mk(go.Placeholder,
                {
                    background: "transparent",  // to allow this Placeholder to be "seen" by mouse events
                    isActionable: true,  // needed because this is in a temporary Layer
                    click: function (e, obj) {
                        var node = obj.part.adornedPart;
                        node.diagram.select(node);
                    }
                }),

            require('./buttons/d')(map),
            require('./buttons/s')(map),
            require('./buttons/r')(map),
            require('./buttons/p')(map)

            )

    const groupSelectionAdornmentTemplate = mk(go.Adornment, "Spot",
        mk(go.Panel, "Spot",
            mk(go.Shape, "Circle", {
                fill: null,
                stroke: "dodgerblue",
                strokeWidth: 4
            }),
            mk(go.Placeholder)  // this represents the selected Node
            )
        );

    this.groupTemplate =
    mk(go.Group, go.Panel.Vertical,
        new go.Binding("layout", "layout", function (layoutName) {
            return map.layouts.getLayout(layoutName);
        }),
        new go.Binding("movable", "", function (obj) {
            return !obj.isLinkLabel;
        }).ofObject(),
        new go.Binding("isSubGraphExpanded", "sExpanded"),
        // dim the thing if it's being dragged over another thing (drop to sister/child)
        new go.Binding('opacity', '', function (obj) {
            return (obj.isSelected && map.ui.dragTargetGroup ? 0.25 : 1);
        }).ofObject(), {
            locationObjectName: "mainpanel",
            locationSpot: go.Spot.TopLeft,
            selectionAdorned: true,
            isSubGraphExpanded: true,
            layerName: 'Foreground',
            // highlight corners
            mouseEnter: function (event, target, obj2) {
                map.ui.mouseOverGroup = target;
                map.diagram.updateAllTargetBindings();
            },
            // unhighlight corners
            mouseLeave: function (event, target, obj2) {
                map.ui.mouseOverGroup = null;
                map.diagram.updateAllTargetBindings();
            }
            // containingGroupChanged: function(part, oldgroup, newgroup) {
            //     map.diagram.model.setDataProperty(part.data, 'level', map.computeLevel(part));
            //     //part.updateTargetBindings();
            // }
        },



        mk(go.Panel, go.Panel.Spot, {
            mouseHover: function (e, obj) {
                var node = obj.part;
                nodeHoverAdornment.adornedObject = node.findObject('dragarea')
                node.addAdornment("mouseHover", nodeHoverAdornment);
            }
        },
            new go.Binding("scale", "", map.layouts.getScale).ofObject(),
            // drag area
            mk(go.Shape, config.shapes.box.shape, {
                name: "dragarea",
                position: new go.Point(0, 0),
                width: config.shapes.box.width,
                height: config.shapes.box.height,
                fill: config.shapes.box.fillColor,
                stroke: null,
                cursor: config.shapes.box.cursor,
                portId: "",
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: true,
                mouseDragEnter: self.getGroupMouseDragEnterHandler(map.LEFT),
                mouseDragLeave: self.groupMouseDragLeaveHandler,
                mouseDrop: self.getGroupMouseDropHandler(map.LEFT),

                // show debug info
                contextClick: function (event, target) {
                    if (event.control) {
                        //console.log(groupInfo(target.part));
                    }
                }

            },
                new go.Binding('stroke', '', getGroupSelectionStroke).ofObject(),
                new go.Binding('strokeWidth', '', getGroupSelectionStrokeWidth).ofObject()

                ),
            mk(go.Shape,  // provide interior area where the user can grab the node
                {
                    //position: new go.Point(0, 0),
                    fill: "transparent",
                    stroke: null,
                    desiredSize: new go.Size(config.shapes.box.width, config.shapes.box.height),
                    cursor: config.shapes.box.cursor
                }),
            mk(go.TextBlock,
                new go.Binding("text", "text").makeTwoWay(),
                new go.Binding("alignment", "alignment").makeTwoWay(),
                new go.Binding("visible", "", function (group) {
                    // always show text inside box for R-things, because external text will throw off layout
                    return true;
                }).ofObject(), {
                    //position: new go.Point(0, 0),
                    cursor: config.shapes.label.cursor,
                    font: config.shapes.label.font,
                    isMultiline: true,
                    editable: true,
                    _isNodeLabel: true,
                    click: groupClickHandler,
                    contextClick: function (event, target) {
                        if (event.control) {
                            //console.log(groupInfo(target.part));
                        }
                    }
                }
                )
            ),
        // the placeholder normally holds the child nodes, but we just use a dummy placeholder
        mk(go.Shape, {
            name: "placeholder",
            fill: "transparent",
            stroke: null,
            desiredSize: new go.Size(0, 0)
        })
        );


    this.groupTemplate.selectionAdornmentTemplate = mk(go.Adornment, "Spot",
        mk(go.Panel, "Auto",
            mk(go.Shape, config.shapes.box.shape, {
                fill: null,
                stroke: null,
                strokeWidth: 0
            }),
            mk(go.Placeholder)  // this represents the selected Node
            )
        );

    // ------------------- link template ---------------------------

    this.shapes = ['to', 'from', 'toFrom', 'noArrows']

    this.getNextRShape = function () {
        let current = self._currentRShape;
        let next = self.shapes[0];
        if (current) {
            let idx = self.shapes.indexOf(current) + 1;
            if (idx >= self.shapes.length) {
                idx = 0;
            }
            next = self.shapes[idx];
        }
        self._currentRShape = next;
        return next;
    }

    this._currentSelectedLink = null;

    this.linkTemplate =
    mk(go.Link, {
        selectionAdorned: false,
        layerName: '',
        //routing: go.Link.Orthogonal,
        relinkableFrom: true,
        relinkableTo: true,
        smoothness: 1.0,
        adjusting: go.Link.Stretch,
        reshapable: true,
        mouseEnter: function (event, target, obj2) {
            map.ui.mouseOverLink = target;
            map.diagram.updateAllTargetBindings();
        },
        mouseLeave: function (event, target, obj2) {
            map.ui.mouseOverLink = null;
            map.diagram.updateAllTargetBindings();
        },
        mouseDragEnter: function (event, target, dragObject) {
            map.ui.mouseOverLink = target;
            map.diagram.updateAllTargetBindings();
        },
        mouseDragLeave: function (event, dropTarget, dragObject) {
            map.ui.mouseOverLink = null;
            map.diagram.updateAllTargetBindings();
        },
        mouseDrop: function (event, dropTarget) {
            var parts = map.diagram.selection;
            if (parts && parts.count == 1 && parts.first() instanceof go.Group) {
                map.addThingAsRThing(parts.first(), dropTarget);
            }
        },
        click: function (event, target) {
            if (self._currentSelectedLink == target.position) {
                let shape = self.getNextRShape();
                map.ui.setSelectedRelationshipsDirection(shape);
            } else {
                self._currentSelectedLink = target.position;
            }
        },
        doubleClick: function (event, target) {
            map.createRThing(target);
        },
        contextClick: function (event, target) {
            if (event.control) {
                //console.log(linkInfo(target));
            }
        }
    },
        new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness", "curviness"),
        mk(go.Shape,
            new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(),
            new go.Binding("strokeWidth", "", map.layouts.getLinkStrokeWidth).ofObject(), {
                name: "LINKSHAPE"
            }
            ),
        // show to/from arrowheads based on link "type" attribute
        mk(go.Shape, {
            fromArrow: "Backward"
        },
            new go.Binding('fill', '', getRLinkSelectionStroke).ofObject(),
            new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(),
            new go.Binding("scale", "", map.layouts.getArrowheadScale).ofObject(),
            new go.Binding('visible', 'type', function (t) {
                return t == 'from' || t == 'toFrom';
            })
            ),
        mk(go.Shape, {
            toArrow: "Standard"
        },
            new go.Binding('fill', '', getRLinkSelectionStroke).ofObject(),
            new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(),
            new go.Binding("scale", "", map.layouts.getArrowheadScale).ofObject(),
            new go.Binding('visible', 'type', function (t) {
                return t == 'to' || t == 'toFrom';
            })
            ),

        mk(go.Panel, go.Panel.Auto, // link label "knob"
            new go.Binding('opacity', '', function (obj) {
                return (showKnob(obj) ? 1 : 0);
            }).ofObject(),
            new go.Binding("scale", "", map.layouts.getArrowheadScale).ofObject(),
            mk(go.Shape, {
                figure: "Ellipse",
                fill: config.colors.DSRP.D,
                stroke: config.colors.DSRP.D,
                width: 12,
                height: 12
            })
            )
        );

    this.pLinkTemplate =
    mk(go.Link,
        {
            curve: go.Link.Bezier,
            adjusting: go.Link.Stretch,
            reshapable: true
        },
        new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness", "curviness"),
        new go.Binding('opacity', '', function (obj) {
            return (self.showPLink(obj) ? 1 : 0);
        }).ofObject(), {
            selectionAdorned: false,
            layerName: 'Background', // make P links fall behind R links
            routing: go.Link.Normal,
            curve: go.Link.Bezier,
            adjusting: go.Link.Stretch,
            reshapable: true,
            contextClick: function (event, target) {
                if (event.control) {
                    //console.log(linkInfo(target));
                }
            }
        },
        mk(go.Shape,
            new go.Binding("strokeWidth", "", map.layouts.getLinkStrokeWidth).ofObject(), {
                name: "LINKSHAPE",
                stroke: config.colors.P.light,
                fill: config.colors.P.light
            }
            ),
        mk(go.Shape,
            // new go.Binding('visible', '', function(obj) {
            //     return (self.showPDot(obj) ? 1 : 0);
            // }).ofObject(),
            new go.Binding("scale", "", map.layouts.getArrowheadScale).ofObject(), {
                toArrow: "Circle",
                stroke: config.colors.P.light,
                fill: config.colors.P.light
            }
            )
        );

    this.dLinkTemplate =
    mk(go.Link, {
        selectable: false
    },
        mk(go.Shape, {
            name: "LINKSHAPE",
            stroke: null
        })
        );

    // ----------- temporary link/node templates, for use when dragging to create R/P lines -------------

    // define initial temporary link templates - these will be modified when handlePortTargeted is called
    this.setTemporaryLinkTemplates = function (tool) {
        tool.temporaryLink = makeTemporaryLinkTemplate();
        tool.temporaryFromNode = makeTemporaryNodeTemplate();
        tool.temporaryToNode = makeTemporaryNodeTemplate();
    };

    function makeTemporaryLinkTemplate() {
        return mk(go.Link, {
            layerName: "Tool",
            curve: go.Link.Bezier
        },
            mk(go.Shape, {
                name: 'LINKSHAPE',
                strokeWidth: 2
            })
            );
    }

    function makeTemporaryNodeTemplate() {
        return mk(go.Group, {
            layerName: "Tool"
        },
            mk(go.Shape, "Circle", {
                name: 'border',
                strokeWidth: 3,
                fill: null
            })
            );
    }

    // change color and portId of temporary link templates based on the type of link being created/relinked
    this.handlePortTargeted = function (diagram, realnode, realport, tempnode, tempport, toend) {
        // //console.log('portTargeted, realport: ' + (realport ? realport.name : '') + ', tempport: ' + (tempport ? tempport.name : '')
        //     + ', originalFromPort: ' + (ltool.originalFromPort ? ltool.originalFromPort.name : '') + ', originalToPort: ' + ltool.originalToPort);

        let tool = diagram.toolManager.draggingTool;
        var linkShape = tool.temporaryLink.findObject('LINKSHAPE');
        var fromBorder = tool.temporaryFromNode.findObject('border');
        var toBorder = tool.temporaryToNode.findObject('border');

        if (tool._dragData) {
            if (tool._dragData.portId == CONSTANTS.DSRP.P) {
                linkShape.stroke = config.colors.DSRP.P;
                fromBorder.stroke = config.colors.DSRP.P;
                toBorder.stroke = config.colors.DSRP.P;
                fromBorder.portId = CONSTANTS.DSRP.P;
                toBorder.portId = CONSTANTS.DSRP.P;
            } else {
                linkShape.stroke = config.colors.DSRP.R;
                fromBorder.stroke = config.colors.DSRP.R;
                toBorder.stroke = config.colors.DSRP.R;
                fromBorder.portId = CONSTANTS.DSRP.R;
                toBorder.portId = CONSTANTS.DSRP.R;
            }
            tempnode.scale = map.layouts.getScale(realnode);

            tool._dragData = null;
            diagram.commitTransaction("Drag");
        }
    };

    // prevent duplicate CONSTANTS.DSRP.P links in the same direction between the same two things
    this.validateLink = function (fromNode, fromPort, toNode, toPort) {
        // the P port is on top of the R port, so both P and R links get the toPort set to R by default.
        if (fromPort.portId == CONSTANTS.DSRP.P) {
            // NB: findLinksTo would be simpler, but it doesn't seem to work... (?)
            var pLinks = toNode.findLinksBetween(fromNode, CONSTANTS.DSRP.P, CONSTANTS.DSRP.P);
            //console.log('validateLink, pLinks from ' + fromNode + ':' + fromPort + ' to ' + toNode + ':' + toPort + ' = ' + pLinks.count);
            if (pLinks.count) {
                while (pLinks.next()) {
                    var pLink = pLinks.value;
                    if (pLink.fromNode == fromNode && pLink.toNode == toNode) {
                        return false;
                    }
                }
            }
        }
        return true;
    };


    // ------------------- slide node template ----------------------

    function createSlideResizeHandle(alignment) {
        return mk(go.Shape,
            new go.Binding("desiredSize", "", function (obj) {
                var slide = obj.adornedObject;
                var size = Math.min(slide.width, slide.height) * .05;
                return new go.Size(size, size);
            }).ofObject(), {
                alignment: alignment,
                cursor: "col-resize",
                fill: 'rgba(251,170,54,1)',
                stroke: null
            }
            );
    }

    this.slideTemplate =
    mk(go.Node, go.Panel.Auto,
        // NB: unlike groups, slides just use a normal 2-way location binding
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("width", "width").makeTwoWay(),
        new go.Binding("height", "height").makeTwoWay(),
        new go.Binding("visible", "", function (obj) {
            return obj.data.hasRegion &&
                map.ui.currentTabIs(map.ui.TAB_ID_PRESENTER) &&
                !map.presenter.isPresenting &&
                !map.presenter.isCreatingThumbnail &&
                map.presenter.currentSlideIndex == obj.data.index;
        }).ofObject(), {
            locationSpot: go.Spot.TopLeft,
            selectionAdorned: false,
            resizable: true,
            resizeAdornmentTemplate: mk(go.Adornment, "Spot",
                mk(go.Placeholder), // takes size and position of adorned object
                createSlideResizeHandle(go.Spot.TopLeft),
                createSlideResizeHandle(go.Spot.Top),
                createSlideResizeHandle(go.Spot.TopRight),
                createSlideResizeHandle(go.Spot.Right),
                createSlideResizeHandle(go.Spot.BottomRight),
                createSlideResizeHandle(go.Spot.Bottom),
                createSlideResizeHandle(go.Spot.BottomLeft),
                createSlideResizeHandle(go.Spot.Left)
                ),
            padding: 0,
            contextClick: function (event, target) {
                //console.log(nodeInfo(target.part));
            }
        },

        mk(go.Shape, "Rectangle", {
            name: "slideborder",
            fill: 'rgba(251,170,54,.1)',
            stroke: null
        })
        );

    // ------------------- export footer ----------------------

    // NB: this is not a template per se, in that it is added to the diagram
    // statically, rather than being bound to something in the model.
    // But we put it here because it is about creating parts and stuff.

    function createExportFooter() {
        return mk(go.Node, go.Panel.Spot, {
            layerName: 'Foreground',
            location: new go.Point(0, 0),
            scale: 1,
            opacity: 0,
            pickable: false,
            selectable: false
        },
            mk(go.Shape, "Rectangle", {
                name: "rectangle",
                height: 60,
                fill: null,
                stroke: null
            }),
            mk(go.Picture, {
                source: 'metamap/assets/img/metamap-logo-50.png',
                alignment: go.Spot.TopLeft,
                alignmentFocus: go.Spot.TopLeft,
                width: 195,
                height: 50
            }),
            mk(go.TextBlock, {
                text: "metamap.cabreraresearch.org",
                alignment: go.Spot.BottomLeft,
                alignmentFocus: go.Spot.BottomLeft,
                width: 200
            }),
            mk(go.TextBlock, {
                name: "mapTitle",
                text: "",
                textAlign: "right",
                alignment: go.Spot.TopRight,
                alignmentFocus: go.Spot.TopRight,
                width: 300
            }),
            mk(go.TextBlock, {
                name: "authorName",
                text: "",
                textAlign: "right",
                alignment: go.Spot.BottomRight,
                alignmentFocus: go.Spot.BottomRight,
                width: 300
            })
            );
    }

    // creates or refreshes the footer logo/text that is displayed in the image export
    this.addExportFooter = function () {
        if (!_exportFooter) {
            _exportFooter = createExportFooter();
            map.diagram.add(_exportFooter);
        }
    };

    this.showExportFooter = function () {
        var rect = map.computeMapBounds();
        // put footer at least 100 px below bottom of map; make it at least 500px wide
        var x = rect.x;
        var y = rect.y + rect.height + Math.max(100, rect.height / 5);
        var w = Math.max(500, rect.width);
        //console.log('showExportFooter, bounds rect: ' + rect + ', w: ' + w);
        _exportFooter.location = new go.Point(x, y);
        _exportFooter.findObject("rectangle").width = w;
        _exportFooter.findObject("mapTitle").text = "Map Title: " + $scope.mapTitle;
        _exportFooter.findObject("authorName").text = "Author: " + $scope.userName;
        _exportFooter.opacity = 1;
        _exportFooter.invalidateLayout();
    };

    this.hideExportFooter = function () {
        _exportFooter.opacity = 0;
    };

};