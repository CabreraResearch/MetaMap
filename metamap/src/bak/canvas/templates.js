// goJS templates used in the editor

SandbankEditor.Templates = function(editor, map) {

    var ret = this;

    // constants
    this.groupFillColor = "#f9f9f9";

    this.init = function() {};

    // initialize template-related stuff that depends on the diagram (and therefore can't go in init())
    this.initTemplates = function(diagram) {
        diagram.groupTemplate = ret.groupTemplate;
        diagram.nodeTemplate = ret.slideTemplate;
        diagram.linkTemplate = ret.linkTemplate;
        diagram.linkTemplateMap.add('P', ret.pLinkTemplate);
        diagram.linkTemplateMap.add('D', ret.dLinkTemplate);

        ret.setTemporaryLinkTemplates(diagram.toolManager.linkingTool);
        ret.setTemporaryLinkTemplates(diagram.toolManager.relinkingTool);

        diagram.toolManager.linkingTool.portTargeted = function(realnode, realport, tempnode, tempport, toend) {
            ret.handlePortTargeted(diagram.toolManager.linkingTool, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.relinkingTool.portTargeted = function(realnode, realport, tempnode, tempport, toend) {
            ret.handlePortTargeted(diagram.toolManager.relinkingTool, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.relinkingTool.updateAdornments = function(part) {
            go.RelinkingTool.prototype.updateAdornments.call(this, part);
            var from = part.findAdornment('RelinkFrom');
            var to = part.findAdornment('RelinkTo');
            // if (from)
            //     console.log('relinkfrom: ' + from.part.width);
        };

        diagram.toolManager.linkingTool.linkValidation = ret.validateLink;
        diagram.toolManager.relinkingTool.linkValidation = ret.validateLink;
    };

    // convenient abbreviation for creating templates
    var mk = go.GraphObject.make;

    // DSRP colors (from _variables.scss)
    var colorD = "#f2624c";
    var colorS = "#96c93d";
    var colorR = "#4cbfc2";
    var colorP = "#fbaa36";
    var colorPLight = "#FDDDAF";
    var colorPDark = "#C9882B";

    var eyeSvgPath = "M 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00c 47.559,94.979, 144.341,160.00, 256.00,160.00c 111.657,0.00, 208.439-65.021, 256.00-160.00 C 464.442,161.021, 367.657,96.00, 256.00,96.00z M 382.225,180.852c 30.081,19.187, 55.571,44.887, 74.717,75.148 c-19.146,30.261-44.637,55.961-74.718,75.149C 344.427,355.257, 300.779,368.00, 256.00,368.00c-44.78,0.00-88.428-12.743-126.225-36.852 C 99.695,311.962, 74.205,286.262, 55.058,256.00c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65 C 130.725,190.866, 128.00,205.613, 128.00,221.00c0.00,70.692, 57.308,128.00, 128.00,128.00s 128.00-57.308, 128.00-128.00c0.00-15.387-2.725-30.134-7.704-43.799 C 378.286,178.39, 380.265,179.602, 382.225,180.852z M 256.00,205.00c0.00,26.51-21.49,48.00-48.00,48.00s-48.00-21.49-48.00-48.00s 21.49-48.00, 48.00-48.00 S 256.00,178.49, 256.00,205.00z";
    var eyeBlockedSvgPath = "M 419.661,148.208 C 458.483,175.723 490.346,212.754 512.00,256.00 C 464.439,350.979 367.657,416.00 256.00,416.00 C 224.717,416.00 194.604,410.894 166.411,401.458 L 205.389,362.48 C 221.918,366.13 238.875,368.00 256.00,368.00 C 300.779,368.00 344.427,355.257 382.223,331.148 C 412.304,311.96 437.795,286.26 456.941,255.999 C 438.415,226.716 413.934,201.724 385.116,182.752 L 419.661,148.208 ZM 256.00,349.00 C 244.638,349.00 233.624,347.512 223.136,344.733 L 379.729,188.141 C 382.51,198.627 384.00,209.638 384.00,221.00 C 384.00,291.692 326.692,349.00 256.00,349.00 ZM 480.00,0.00l-26.869,0.00 L 343.325,109.806C 315.787,100.844, 286.448,96.00, 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00 c 21.329,42.596, 52.564,79.154, 90.597,106.534L0.00,453.131L0.00,480.00 l 26.869,0.00 L 480.00,26.869L 480.00,0.00 z M 208.00,157.00c 24.022,0.00, 43.923,17.647, 47.446,40.685 l-54.762,54.762C 177.647,248.923, 160.00,229.022, 160.00,205.00C 160.00,178.49, 181.49,157.00, 208.00,157.00z M 55.058,256.00 c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65C 130.725,190.866, 128.00,205.613, 128.00,221.00 c0.00,29.262, 9.825,56.224, 26.349,77.781l-29.275,29.275C 97.038,309.235, 73.197,284.67, 55.058,256.00z";
    var paperclipSvgPath = "M 348.916,163.524l-32.476-32.461L 154.035,293.434c-26.907,26.896-26.907,70.524,0.00,97.422 c 26.902,26.896, 70.53,26.896, 97.437,0.00l 194.886-194.854c 44.857-44.831, 44.857-117.531,0.00-162.363 c-44.833-44.852-117.556-44.852-162.391,0.00L 79.335,238.212l 0.017,0.016c-0.145,0.152-0.306,0.288-0.438,0.423 c-62.551,62.548-62.551,163.928,0.00,226.453c 62.527,62.528, 163.934,62.528, 226.494,0.00c 0.137-0.137, 0.258-0.284, 0.41-0.438l 0.016,0.017 l 139.666-139.646l-32.493-32.46L 273.35,432.208l-0.008,0.00 c-0.148,0.134-0.282,0.285-0.423,0.422 c-44.537,44.529-116.99,44.529-161.538,0.00c-44.531-44.521-44.531-116.961,0.00-161.489c 0.152-0.152, 0.302-0.291, 0.444-0.423l-0.023-0.03 l 204.64-204.583c 26.856-26.869, 70.572-26.869, 97.443,0.00c 26.856,26.867, 26.856,70.574,0.00,97.42L 218.999,358.375 c-8.968,8.961-23.527,8.961-32.486,0.00c-8.947-8.943-8.947-23.516,0.00-32.46L 348.916,163.524z";

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
            'getScale(): ' + map.getLayouts().getScale(obj) + "\n" +
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
        var snpos = map.getLayouts().getSameNodesLinkPosition(obj);
        return '' +
            'object: ' + obj + "\n" +
            'fromNode: ' + obj.fromNode + "\n" +
            'toNode: ' + obj.toNode + "\n" +
            'labelNodes: ' + obj.labelNodes.count + "\n" +
            'labelNodeIsVisible: ' + map.getLayouts().labelNodeIsVisible(obj) + "\n" +
            'fromPortId: ' + obj.fromPortId + "\n" +
            'toPortId: ' + obj.toPortId + "\n" +
            'category: ' + (obj.data ? obj.data.category : '') + "\n" +
            'containingGroup: ' + obj.containingGroup + "\n" +
            'fromAndToNodesAreVisible: ' + map.getLayouts().fromAndToNodesAreVisible(obj) + "\n" +
            'curve: ' + obj.curve + "\n" +
            'curviness: ' + obj.curviness + "\n" +
            'fromEndSegmentLength: ' + Math.round(obj.fromEndSegmentLength) + "\n" +
            'toEndSegmentLength: ' + Math.round(obj.toEndSegmentLength) + "\n" +
            'sameNodesLinkPosition: ' + snpos.index + ' of ' + snpos.count + "\n" +
            //+ 'geometry: ' + obj.geometry + "\n" +
            'getLinkStrokeWidth: ' + map.getLayouts().getLinkStrokeWidth(obj) + "\n";
    }

    // -----------------------------------------------------------------------------

    // NB: these are here because they are about colors; 
    // similar functions that are scale-related are in layouts.js...
    function getGroupSelectionStroke(obj) {
        if (obj.isSelected) {
            if (map.getPerspectives().isInPEditorMode())
                return colorP;
            else if (map.getPerspectives().isInDEditorMode())
                return colorD;
            else
                return "#000";
        } else {
            return "#000";
        }
    }

    // OK, this isn't about colors, but it wants to be near the one above...
    function getGroupSelectionStrokeWidth(obj) {
        return (obj.isSelected ? 3 : 1);
    }

    function getRLinkSelectionStroke(obj) {
        if (obj.isSelected || obj == map.getUi().mouseOverLink) {
            return colorR; // TODO: can P links be selected?
        } else {
            return "#000";
        }
    }

    // -----------------------------------------------------------------------------

    // callbacks to determine when the corners should be visible

    function showDCorner(group) {
        if (map.getPerspectives().isDEditorThing(group)) { // mark distinction thing
            return true;
        } else if (map.getPerspectives().isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (map.getPresenter().isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return (group == map.getUi().mouseOverGroup) || // show corners on mouseover
                (editor.isTouchDevice() && group.isSelected) ||
                (canDragSelectionToBecomeSistersOf(group, false) && // drag to D (make it sisters)
                    (!map.getUi().dragTargetPosition ||
                        cannotDragSelectionToBecomeOrderedSisterOf(group))); // not showing drag above/below indicators
        }
    }

    function showSCorner(group) {
        if (map.getPerspectives().isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (map.getPresenter().isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return (group == map.getUi().mouseOverGroup) || // show corners on mouseover
                (editor.isTouchDevice() && group.isSelected) ||
                (canDragSelectionToBecomeChildrenOf(group, false) && // drag to S (make it children)
                    (!map.getUi().dragTargetPosition ||
                        cannotDragSelectionToBecomeOrderedSisterOf(group))); // not showing drag above/below indicators
        }
    }

    function showRCorner(group) {
        if (map.getPerspectives().isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (map.getPresenter().isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group == map.getUi().mouseOverGroup ||
                (editor.isTouchDevice() && group.isSelected); // show corners on mouseover
        }
    }

    function showPCorner(group) {
        if (map.getPerspectives().isPEditorPoint(group)) {
            return true; // mark perspective point
        } else if (map.getPerspectives().isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (map.getPresenter().isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group == map.getUi().mouseOverGroup ||
                (editor.isTouchDevice() && group.isSelected); // show corners on mouseover
        }
    }

    // when a P link should be visible

    this.showPLink = function(link) {
        var mode = map.getUi().getMapEditorOptions().perspectiveMode;
        if (map.getPerspectives().isPEditorPoint(link.fromNode)) { // show P's when this link is from the current Point
            return true;
        } else if (map.getPerspectives().isInPOrDEditorMode()) { // don't show P's for non-Point things, even on mouseover
            return false;
        } else {
            return (mode == 'lines' || mode == 'both') && (link.fromNode == map.getUi().mouseOverGroup || map.pIsExpanded(link.fromNode));
        }
    };

    this.showPDot = function(link) {
        return true; // map.getUi().getMapEditorOptions().perspectiveMode != 'both';
    };

    // these functions are used in two modes:
    // 1. with isDropping == false, to highlight drop targets based on map.getUi().dragTargetGroup and map.getUi().dragTargetPosition,
    //    which are set on mouseDragEnter/mouseDragleave
    // 2. with isDropping == true, on drop, when the above indicators have gone away, but we know what the dropped
    //    and target groups are, and we want to know what the drop should do.

    function canDragSelectionToBecomeSistersOf(group, isDropping) {
        return (group == map.getUi().dragTargetGroup || isDropping) &&
            map.thingsSelectedAreDescendantsOf(group);
    }

    function canDragSelectionToBecomeChildrenOf(group, isDropping) {
        return (group == map.getUi().dragTargetGroup || isDropping) &&
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
        return (targetGroup == map.getUi().dragTargetGroup || isDropping) &&
            (map.getUi().dragTargetPosition == side || isDropping) &&
            map.getLayouts().areSistersInInventoryLayout(draggedGroup, targetGroup);
    }

    function cannotDragSelectionToBecomeOrderedSisterOf(targetGroup) {
        return !canDragSelectionToBecomeOrderedSisterOf(targetGroup, map.LEFT) &&
            !canDragSelectionToBecomeOrderedSisterOf(targetGroup, map.RIGHT);
    }

    // handle drop on one of the three target regions (top, middle, bottom)
    // side is map.LEFT or map.RIGHT
    function handleGroupMouseDrop(event, dropTarget, side) {
        //console.log('dragAboveTarget.mouseDrop, target: ' + dropTarget + ', part: ' + dropTarget .part + ', show: ' + show);
        if (side  && canDragSelectionToBecomeOrderedSisterOf(dropTarget.part, side, true)) {
            map.addSelectedThingAsOrderedSisterOf(dropTarget.part, side);
        } else if (canDragSelectionToBecomeSistersOf(dropTarget.part, true)) {
            map.addSelectedThingsAsSistersOf(dropTarget.part);
        } else if (canDragSelectionToBecomeChildrenOf(dropTarget.part, true)) {
            map.addSelectedThingsAsChildrenOf(dropTarget.part);
        }
    }

    // when to show the R-thing knob on a link
    function showKnob(link) {
        return link == map.getUi().mouseOverLink;
    }

    // ---------------- components for main group template ------------------

    function dFlagMarker() {
        return mk(go.Shape,
            new go.Binding('fill', '', function(obj) {
                return obj.data.dflag ? '#000' : null;
            }).ofObject(), {
                name: "dflag",
                position: new go.Point(0, 0),
                desiredSize: new go.Size(18, 18),
                geometry: go.Geometry.parse("F M0 1 L0 18 L18 0 L1 0z", true),
                cursor: "pointer",
                pickable: false,
                stroke: null
            }
        );
    }

    // "D" corner (top left, red)
    function cornerD() {
        return mk(go.Panel, go.Panel.Position,
            new go.Binding('opacity', '', function(obj) {
                return (showDCorner(obj) ? 1 : 0);
            }).ofObject(), {
                name: "cornerD",
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                opacity: 0
            },
            mk(go.Shape, {
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                geometry: go.Geometry.parse("F M0 1 L0 50 L50 0 L1 0z", true),
                fill: colorD,
                stroke: null,
                cursor: 'pointer',
                click: function(event, target) {
                    //console.log('click, control:' + event.control + ', alt:' + event.alt + ', meta:' + event.meta);
                    if (event.alt) {
                        // NB: a side effect of this will be to select just this group,
                        // which would not happen otherwise via control-click
                        map.getPerspectives().setDEditorThing(target.part);
                    } else {
                        // handle single or double click
                        map.getUi().handleCornerClick("D", target.part);
                    }
                },
                contextClick: function(event, target) {
                    //console.log('contextClick:' + event);
                    map.toggleDFlag(target.part);
                }
            }),
            mk(go.TextBlock, {
                text: "D",
                stroke: "white",
                font: '9px sans-serif',
                position: new go.Point(12, 15),
                pickable: false
            })
        );
    }

    // "S" corner (bottom left, green)
    function cornerS() {
        return mk(go.Panel, go.Panel.Position,
            new go.Binding('opacity', '', function(obj) {
                return (showSCorner(obj) ? 1 : 0);
            }).ofObject(), {
                name: "cornerS",
                position: new go.Point(0, 50),
                desiredSize: new go.Size(50, 50),
                opacity: 0
            },
            mk(go.Shape, {
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                geometry: go.Geometry.parse("F M0 0 L0 49 L1 50 L50 50z", true),
                fill: colorS,
                stroke: null,
                cursor: 'pointer',
                click: function(event, target) {
                    // handle single or double click
                    map.getUi().handleCornerClick("S", target.part);
                }
            }),
            // expansion indicator
            mk(go.Shape,
                new go.Binding('position', '', function(obj) {
                    return (obj.isSubGraphExpanded ? new go.Point(4, 43) : new go.Point(5, 38));
                }).ofObject(),
                new go.Binding('angle', '', function(obj) {
                    return (obj.isSubGraphExpanded ? 90 : 0);
                }).ofObject(), {
                    desiredSize: new go.Size(5, 10),
                    geometry: go.Geometry.parse("F M0 0 L5 5 L0 10z", true),
                    fill: "#333",
                    stroke: null,
                    cursor: 'pointer',
                    pickable: false
                }
            ),
            mk(go.TextBlock, {
                text: "S",
                stroke: "white",
                font: '9px sans-serif',
                position: new go.Point(12, 28),
                pickable: false
            })
        );
    }

    // show only when system is collapsed
    function sCollapsedMarker() {
        return mk(go.Shape,
            new go.Binding('visible', '', function(obj) {
                return !showSCorner(obj) && obj.memberParts.count > 0 && !obj.isSubGraphExpanded;
            }).ofObject(), {
                position: new go.Point(5, 88),
                desiredSize: new go.Size(5, 10),
                geometry: go.Geometry.parse("F M0 0 L5 5 L0 10z", true),
                fill: '#333',
                stroke: null,
                cursor: 'pointer',
                pickable: false
            }
        );
    }

    // "R" corner (bottom right, blue)
    function cornerR() {
        return mk(go.Panel, go.Panel.Position,
            new go.Binding('opacity', '', function(obj) {
                return (showRCorner(obj) ? 1 : 0);
            }).ofObject(), {
                name: "cornerR",
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                opacity: 0
            },
            mk(go.Shape, {
                name: "cornerRShape",
                // NB: this corner is done differently from the others:
                // 1. the overall shape is the size of the whole square, so the port falls in the middle instead of the corner;
                // 2. the geometry traces around the edges of the whole square, because otherwise the link line will
                //    show inside the main square if it's crossing one of the other 3 quadrants 
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                geometry: go.Geometry.parse("F" +
                    "M0 0 L0 100 " + // top left to bottom left
                    "L99 100 L100 99 L 100 0 " + // bottom/right sides (round bottom right corner)
                    "L 0 0 L 100 0 " + // back to top left then top right
                    "L 100 50 L 50 100 " + // to midpoint of right side, midpoint of bottom side
                    "L0 100z", // bottom left, return home
                    true),
                fill: colorR,
                stroke: null,
                cursor: 'pointer',

                portId: "R",
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: true,
                click: function(event, target) {
                    // handle single or double click
                    map.getUi().handleCornerClick("R", target.part);
                }
            }),
            mk(go.TextBlock, {
                text: "R",
                stroke: "white",
                font: '9px sans-serif',
                pickable: false,
                position: new go.Point(82, 78)
            })
        );
    }

    function attachmentPaperClip() {
        return mk(go.Shape,
            new go.Binding('visible', '', function(obj) {
                return !_.isEmpty(obj.data.attachments);
            }).ofObject(),
            new go.Binding('geometry', '', function(obj) {
                return go.Geometry.parse(paperclipSvgPath, true);
            }).ofObject(),
            new go.Binding('desiredSize', '', function(obj) {
                return new go.Size(512, 512); // NB: the two icons don't scale to the same proportions for some reason - ??
            }).ofObject(), {
                position: new go.Point(46, 85),
                scale: 0.02,
                stroke: '#000',
                fill: '#000',
                click: function(event, target) {
                    console.log('clip clicked');
                    map.getUi().toggleTab(map.getUi().TAB_ID_ATTACHMENTS);
                }
            }
        );
    }

    function pEyeball() {
        return mk(go.Shape,
            new go.Binding('visible', '', function(obj) {
                return map.getPerspectives().isPerspectivePoint(obj);
            }).ofObject(),
            new go.Binding('geometry', '', function(obj) {
                return go.Geometry.parse(map.pIsExpanded(obj) ? eyeSvgPath : eyeBlockedSvgPath, true);
            }).ofObject(),
            new go.Binding('desiredSize', '', function(obj) {
                return new go.Size(512, map.pIsExpanded(obj) ? 440 : 512); // NB: the two icons don't scale to the same proportions for some reason - ??
            }).ofObject(), {
                position: new go.Point(87, 4),
                scale: 0.02,
                stroke: '#000',
                fill: '#000',
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
        return mk(go.Shape, "Border",
            new go.Binding('visible', '', function(obj) {
                return true;
            }).ofObject(),
            new go.Binding('fill', '', function(obj) {
                return getViewMarkerFill(obj);
            }).ofObject(), {
                position: new go.Point(0, 0),
                height: 18,
                width: 100,
                stroke: null
            }
        );
    }

    function getViewMarkerFill(obj) {
        var weight = map.getPerspectives().getPerspectiveViewWeight(obj);

        if (weight == 3) {
            return colorPDark;
        } else if (weight == 2) {
            return colorP;
        } else if (weight == 1) {
            return colorPLight;
        } else {
            return "transparent";
        }
    }

    // "P" corner (top right, orange)
    function cornerP() {
        return mk(go.Panel, go.Panel.Position,
            new go.Binding('opacity', '', function(obj) {
                return (showPCorner(obj) ? 1 : 0);
            }).ofObject(), {
                name: "cornerP",
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                opacity: 0
            },
            mk(go.Shape, {
                name: "cornerPShape",
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                // NB: this geometry covers the whole square; see note above for cornerR
                geometry: go.Geometry.parse("F" +
                    "M0 0 L0 100 L100 100" + // top left to bottom left to bottom right
                    "L100 1 L99 0 L0 0" + // right/top sides (round top right corner)
                    "L 50 0 L 100 50 " + // to midpoint of top side, midpoint of right side
                    "L100 100 0 100z", // bottom right, bottom left, return home
                    true),

                fill: colorP,
                stroke: null,
                cursor: 'pointer',

                portId: "P",
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
                toMaxLinks: 1,
                click: function(event, target) {
                    // handle single or double click
                    map.getUi().handleCornerClick("P", target.part);
                }
            }),
            pEyeball(), // P expansion indicator
            mk(go.TextBlock, {
                text: "P",
                stroke: "white",
                font: '9px sans-serif',
                pickable: false,
                position: new go.Point(81, 15)
            })
        );
    }

    function mainBorder() {
        return mk(go.Shape, "Border",
            new go.Binding('stroke', '', getGroupSelectionStroke).ofObject(),
            new go.Binding('strokeWidth', '', getGroupSelectionStrokeWidth).ofObject(), {
                name: "mainarea",
                position: new go.Point(0, 0),
                height: 100,
                width: 100,
                fill: null,
                //portId: "",
                cursor: "pointer",
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: true
            }
        );
    }

    // --------- handlers for mouse drag/drop actions on groups, which need to be replicated on different target parts -------

    // position is map.LEFT, null, or map.RIGHT
    function getGroupMouseDragEnterHandler(position) {
        return function(event, target, obj2) {
            //console.log('mouseDragEnter, e.dp: ' + event.documentPoint + ', target.part: ' + target.part + ', target bounds: ' + target.actualBounds);
            map.getUi().dragTargetGroup = target.part;
            map.getUi().dragTargetPosition = position;
            map.getDiagram().updateAllTargetBindings();
        };
    }

    var groupMouseDragLeaveHandler = function(event, target, obj2) {
        map.getUi().dragTargetGroup = null;
        map.getUi().dragTargetPosition = null;
        map.getDiagram().updateAllTargetBindings();
    };

    function getGroupMouseDropHandler(position) {
        return function(event, dropTarget) {
            handleGroupMouseDrop(event, dropTarget, position);
        };
    }

    var groupClickHandler = function(event, target) {
        // handle single or double click
        map.getUi().handleCornerClick("", target);
    };

    // --------------- targets for dragging to D or S -----------------

    function dragAboveTarget() {
        return mk(go.Panel, go.Panel.Position, {
                position: new go.Point(0, 0),
                height: 25,
                width: 100,
                mouseDragEnter: getGroupMouseDragEnterHandler(map.LEFT),
                mouseDragLeave: groupMouseDragLeaveHandler,
                mouseDrop: getGroupMouseDropHandler(map.LEFT),
                click: groupClickHandler
            },
            // drag target region
            mk(go.Shape, "Rectangle", {
                position: new go.Point(0, 0),
                height: 25,
                width: 100,
                cursor: "pointer",
                stroke: null,
                fill: 'transparent'
            }),
            // drag indicator bar
            mk(go.Shape, "Border",
                new go.Binding('visible', '', function(obj) {
                    return canDragSelectionToBecomeOrderedSisterOf(obj.part, map.LEFT, false);
                }).ofObject(), {
                    position: new go.Point(0, 0),
                    height: 10,
                    width: 100,
                    stroke: null,
                    fill: '#000'
                }
            )
        );
    }

    function dragIntoTarget() {
        return mk(go.Panel, go.Panel.Position, {
                position: new go.Point(0, 25),
                height: 50,
                width: 100,
                mouseDragEnter: getGroupMouseDragEnterHandler(null),
                mouseDragLeave: groupMouseDragLeaveHandler,
                mouseDrop: getGroupMouseDropHandler(null),
                click: groupClickHandler
            },
            mk(go.Shape, "Rectangle", {
                position: new go.Point(0, 0),
                height: 50,
                width: 100,
                cursor: "pointer",
                stroke: null,
                fill: 'transparent'
            })
        );
    }

    function dragBelowTarget() {
        return mk(go.Panel, go.Panel.Position, {
                position: new go.Point(0, 75),
                height: 25,
                width: 100,
                mouseDragEnter: getGroupMouseDragEnterHandler(map.RIGHT),
                mouseDragLeave: groupMouseDragLeaveHandler,
                mouseDrop: getGroupMouseDropHandler(map.RIGHT),
                click: groupClickHandler
            },
            // drag target region
            mk(go.Shape, "Rectangle", {
                position: new go.Point(0, 0),
                height: 25,
                width: 100,
                cursor: "pointer",
                stroke: null,
                fill: 'transparent'
            }),
            // drag indicator bar
            mk(go.Shape, "Border",
                new go.Binding('visible', '', function(obj) {
                    return canDragSelectionToBecomeOrderedSisterOf(obj.part, map.RIGHT, false);
                }).ofObject(), {
                    position: new go.Point(0, 15),
                    height: 10,
                    width: 100,
                    stroke: null,
                    fill: '#000'
                }
            )
        );
    }

    // Returns the TextBlock for the group title, for use in the main group template, inside the box.
    function groupInternalTextBlock() {
        return mk(go.Panel, go.Panel.Horizontal, {
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100)
            },
            mk(go.TextBlock,
                new go.Binding("text", "text").makeTwoWay(),
                new go.Binding("visible", "", function(group) {
                    // always show text inside box for R-things, because external text will throw off layout
                    return map.getLayouts().isNotWithinInventoryLayout(group) ||
                        map.getLayouts().isRThingWithinInventoryLayout(group);
                }).ofObject(), {
                    width: 80,
                    margin: 10,
                    alignment: go.Spot.Center,
                    textAlign: 'center',
                    cursor: "move",
                    font: '10px sans-serif',
                    isMultiline: true,
                    wrap: go.TextBlock.WrapDesiredSize,

                    mouseDragEnter: getGroupMouseDragEnterHandler(null),
                    mouseDragLeave: groupMouseDragLeaveHandler,
                    mouseDrop: getGroupMouseDropHandler(null),
                    click: groupClickHandler,
                    contextClick: function(event, target) {
                        if (event.control) {
                            console.log(groupInfo(target.part));
                        }
                    }
                }
            )
        );
    }

    // Returns a TextBlock for the group title, for use in the main group template, on the left or right.
    // visibleFn is a callback to be bound to the visibility attribute of the TextBlock.
    // textAlign is 'left' or 'right'.
    function groupExternalTextBlock(visibleFn, textAlign) {
        return mk(go.TextBlock,
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("visible", "", visibleFn).ofObject(),
            new go.Binding("scale", "", map.getLayouts().getExternalTextScale).ofObject(), {
                name: 'externaltext-' + textAlign, // NB: this screws up layouts for some reason - ??
                textAlign: textAlign,
                margin: 5,
                font: '10px sans-serif',
                isMultiline: true,
                click: groupClickHandler
            }
        );
    }

    // -------------- group/Thing template --------------------

    this.groupTemplate =
        mk(go.Group, go.Panel.Vertical,
            new go.Binding("layout", "layout", function(layoutName) {
                return map.getLayouts().getLayout(layoutName);
            }),
            new go.Binding("movable", "", function(obj) {
                return !obj.isLinkLabel;
            }).ofObject(),
            new go.Binding("isSubGraphExpanded", "sExpanded"),
            // dim the thing if it's being dragged over another thing (drop to sister/child)
            new go.Binding('opacity', '', function(obj) {
                return (obj.isSelected && map.getUi().dragTargetGroup ? 0.25 : 1);
            }).ofObject(), {
                locationObjectName: "mainpanel",
                locationSpot: go.Spot.TopLeft,
                selectionAdorned: false,
                isSubGraphExpanded: true,
                layerName: 'Foreground',
                // highlight corners
                mouseEnter: function(event, target, obj2) {
                    map.getUi().mouseOverGroup = target;
                    map.getDiagram().updateAllTargetBindings();
                },
                // unhighlight corners
                mouseLeave: function(event, target, obj2) {
                    map.getUi().mouseOverGroup = null;
                    map.getDiagram().updateAllTargetBindings();
                }
                // containingGroupChanged: function(part, oldgroup, newgroup) { 
                //     map.getDiagram().model.setDataProperty(part.data, 'level', map.computeLevel(part)); 
                //     //part.updateTargetBindings();   
                // }
            },
            mk(go.Panel, go.Panel.Horizontal,
                groupExternalTextBlock(map.getLayouts().showLeftTextBlock, 'right'),
                mk(go.Panel, go.Panel.Position, {
                        name: "mainpanel"
                    },
                    new go.Binding("scale", "", map.getLayouts().getScale).ofObject(),
                    // drag area
                    mk(go.Shape, "Rectangle", {
                        name: "dragarea",
                        position: new go.Point(0, 0),
                        width: 100,
                        height: 100,
                        fill: ret.groupFillColor,
                        stroke: null,
                        cursor: "move",
                        // show debug info
                        contextClick: function(event, target) {
                            if (event.control) {
                                console.log(groupInfo(target.part));
                            }
                        }
                    }),
                    mk(go.Panel, go.Panel.Position,
                        viewMarker(),
                        dragAboveTarget(),
                        dragIntoTarget(),
                        dragBelowTarget(),
                        groupInternalTextBlock(),
                        cornerD(),
                        dFlagMarker(),
                        cornerS(),
                        sCollapsedMarker(),
                        cornerR(),
                        pointMarker(),
                        cornerP(),
                        attachmentPaperClip(),
                        mainBorder()
                    )
                ),
                groupExternalTextBlock(map.getLayouts().showRightTextBlock, 'left')
            ),

            // the placeholder normally holds the child nodes, but we just use a dummy placeholder
            mk(go.Shape, {
                name: "placeholder",
                fill: "transparent",
                stroke: null,
                desiredSize: new go.Size(0, 0)
            })
    );

    // ------------------- link template ---------------------------

    this.linkTemplate =
        mk(go.Link, {
                selectionAdorned: false,
                layerName: '',
                routing: go.Link.Normal,
                relinkableFrom: true,
                relinkableTo: true,
                mouseEnter: function(event, target, obj2) {
                    map.getUi().mouseOverLink = target;
                    map.getDiagram().updateAllTargetBindings();
                },
                mouseLeave: function(event, target, obj2) {
                    map.getUi().mouseOverLink = null;
                    map.getDiagram().updateAllTargetBindings();
                },
                mouseDragEnter: function(event, target, dragObject) {
                    map.getUi().mouseOverLink = target;
                    map.getDiagram().updateAllTargetBindings();
                },
                mouseDragLeave: function(event, dropTarget, dragObject) {
                    map.getUi().mouseOverLink = null;
                    map.getDiagram().updateAllTargetBindings();
                },
                mouseDrop: function(event, dropTarget) {
                    var parts = map.getDiagram().selection;
                    if (parts && parts.count == 1 && parts.first() instanceof go.Group) {
                        map.addThingAsRThing(parts.first(), dropTarget);
                    }
                },
                doubleClick: function(event, target) {
                    map.createRThing(target);
                },
                contextClick: function(event, target) {
                    if (event.control) {
                        console.log(linkInfo(target));
                    }
                }
            },
            mk(go.Shape,
                new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(),
                new go.Binding("strokeWidth", "", map.getLayouts().getLinkStrokeWidth).ofObject(), {
                    name: "LINKSHAPE"
                }
            ),

            // show to/from arrowheads based on link "type" attribute
            mk(go.Shape, {
                    fromArrow: "Backward"
                },
                new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(),
                new go.Binding("scale", "", map.getLayouts().getArrowheadScale).ofObject(),
                new go.Binding('visible', 'type', function(t) {
                    return t == 'from' || t == 'toFrom';
                })
            ),
            mk(go.Shape, {
                    toArrow: "Standard"
                },
                new go.Binding('stroke', '', getRLinkSelectionStroke).ofObject(),
                new go.Binding("scale", "", map.getLayouts().getArrowheadScale).ofObject(),
                new go.Binding('visible', 'type', function(t) {
                    return t == 'to' || t == 'toFrom';
                })
            ),

            mk(go.Panel, go.Panel.Auto, // link label "knob"
                new go.Binding('opacity', '', function(obj) {
                    return (showKnob(obj) ? 1 : 0);
                }).ofObject(),
                new go.Binding("scale", "", map.getLayouts().getArrowheadScale).ofObject(),
                mk(go.Shape, {
                    figure: "Ellipse",
                    fill: colorD,
                    stroke: colorD,
                    width: 12,
                    height: 12
                })
            )
    );

    this.pLinkTemplate =
        mk(go.Link,
            new go.Binding('opacity', '', function(obj) {
                return (ret.showPLink(obj) ? 1 : 0);
            }).ofObject(), {
                selectionAdorned: false,
                layerName: 'Background', // make P links fall behind R links
                routing: go.Link.Normal,
                contextClick: function(event, target) {
                    if (event.control) {
                        console.log(linkInfo(target));
                    }
                }
            },
            mk(go.Shape,
                new go.Binding("strokeWidth", "", map.getLayouts().getLinkStrokeWidth).ofObject(), {
                    name: "LINKSHAPE",
                    stroke: colorPLight,
                    fill: colorPLight
                }
            ),
            mk(go.Shape,
                // new go.Binding('visible', '', function(obj) {
                //     return (self.showPDot(obj) ? 1 : 0);
                // }).ofObject(),
                new go.Binding("scale", "", map.getLayouts().getArrowheadScale).ofObject(), {
                    toArrow: "Circle",
                    stroke: colorPLight,
                    fill: colorPLight
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
    this.setTemporaryLinkTemplates = function(tool) {
        tool.temporaryLink = makeTemporaryLinkTemplate();
        tool.temporaryFromNode = makeTemporaryNodeTemplate();
        tool.temporaryToNode = makeTemporaryNodeTemplate();
    };

    function makeTemporaryLinkTemplate() {
        return mk(go.Link, {
                layerName: "Tool"
            },
            mk(go.Shape, {
                name: 'linkshape',
                strokeWidth: 2
            })
        );
    }

    function makeTemporaryNodeTemplate() {
        return mk(go.Group, {
                layerName: "Tool"
            },
            mk(go.Shape, "Border", {
                name: 'border',
                strokeWidth: 3,
                fill: null
            })
        );
    }

    // change color and portId of temporary link templates based on the type of link being created/relinked
    this.handlePortTargeted = function(tool, realnode, realport, tempnode, tempport, toend) {
        // console.log('portTargeted, realport: ' + (realport ? realport.name : '') + ', tempport: ' + (tempport ? tempport.name : '') 
        //     + ', originalFromPort: ' + (ltool.originalFromPort ? ltool.originalFromPort.name : '') + ', originalToPort: ' + ltool.originalToPort);

        var linkShape = tool.temporaryLink.findObject('linkshape');
        var fromBorder = tool.temporaryFromNode.findObject('border');
        var toBorder = tool.temporaryToNode.findObject('border');
        var portId = 'R';

        if (tool.originalFromPort && tool.originalFromPort.name == 'cornerPShape') {
            portId = 'P';
            linkShape.stroke = colorP;
            fromBorder.stroke = colorP;
            toBorder.stroke = colorP;
            fromBorder.portId = 'P';
            toBorder.portId = 'P';
        } else if (tool.originalFromPort && tool.originalFromPort.name == 'cornerRShape') {
            linkShape.stroke = colorR;
            fromBorder.stroke = colorR;
            toBorder.stroke = colorR;
            fromBorder.portId = 'R';
            toBorder.portId = 'R';
        }
        realnode.temporaryFromPortId = portId;
        tempnode.scale = map.getLayouts().getScale(realnode);
    };

    // prevent duplicate 'P' links in the same direction between the same two things
    this.validateLink = function(fromNode, fromPort, toNode, toPort) {
        // the P port is on top of the R port, so both P and R links get the toPort set to R by default.
        if (fromPort.portId == 'P') {
            // NB: findLinksTo would be simpler, but it doesn't seem to work... (?)
            var pLinks = toNode.findLinksBetween(fromNode, 'P', 'P');
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
            new go.Binding("desiredSize", "", function(obj) {
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
            new go.Binding("visible", "", function(obj) {
                return obj.data.hasRegion &&
                    map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) &&
                    !map.getPresenter().isPresenting &&
                    !map.getPresenter().isCreatingThumbnail &&
                    map.getPresenter().currentSlideIndex == obj.data.index;
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
                contextClick: function(event, target) {
                    console.log(nodeInfo(target.part));
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
                source: 'assets/img/metamap-logo-50.png',
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
    this.addExportFooter = function() {
        if (!_exportFooter) {
            _exportFooter = createExportFooter();
            map.getDiagram().add(_exportFooter);
        }
    };

    this.showExportFooter = function() {
        var rect = map.computeMapBounds();
        // put footer at least 100 px below bottom of map; make it at least 500px wide
        var x = rect.x;
        var y = rect.y + rect.height + Math.max(100, rect.height / 5);
        var w = Math.max(500, rect.width);
        //console.log('showExportFooter, bounds rect: ' + rect + ', w: ' + w);
        _exportFooter.location = new go.Point(x, y);
        _exportFooter.findObject("rectangle").width = w;
        _exportFooter.findObject("mapTitle").text = "Map Title: " + editor.mapTitle;
        _exportFooter.findObject("authorName").text = "Author: " + editor.userName;
        _exportFooter.opacity = 1;
        _exportFooter.invalidateLayout();
    };

    this.hideExportFooter = function() {
        _exportFooter.opacity = 0;
    };

};