const go = window.go;
const mk = go.GraphObject.make;

const groupFillColor = '#f9f9f9';
const colorPLight = '#FDDDAF';
const colorPDark = '#C9882B';

// DSRP colors (from _variables.scss)
const colorD = '#f2624c';
const colorS = '#96c93d';
const colorP = '#fbaa36';

const eyeSvgPath = 'M 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00c 47.559,94.979, 144.341,160.00, 256.00,160.00c 111.657,0.00, 208.439-65.021, 256.00-160.00 C 464.442,161.021, 367.657,96.00, 256.00,96.00z M 382.225,180.852c 30.081,19.187, 55.571,44.887, 74.717,75.148 c-19.146,30.261-44.637,55.961-74.718,75.149C 344.427,355.257, 300.779,368.00, 256.00,368.00c-44.78,0.00-88.428-12.743-126.225-36.852 C 99.695,311.962, 74.205,286.262, 55.058,256.00c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65 C 130.725,190.866, 128.00,205.613, 128.00,221.00c0.00,70.692, 57.308,128.00, 128.00,128.00s 128.00-57.308, 128.00-128.00c0.00-15.387-2.725-30.134-7.704-43.799 C 378.286,178.39, 380.265,179.602, 382.225,180.852z M 256.00,205.00c0.00,26.51-21.49,48.00-48.00,48.00s-48.00-21.49-48.00-48.00s 21.49-48.00, 48.00-48.00 S 256.00,178.49, 256.00,205.00z';
const eyeBlockedSvgPath = 'M 419.661,148.208 C 458.483,175.723 490.346,212.754 512.00,256.00 C 464.439,350.979 367.657,416.00 256.00,416.00 C 224.717,416.00 194.604,410.894 166.411,401.458 L 205.389,362.48 C 221.918,366.13 238.875,368.00 256.00,368.00 C 300.779,368.00 344.427,355.257 382.223,331.148 C 412.304,311.96 437.795,286.26 456.941,255.999 C 438.415,226.716 413.934,201.724 385.116,182.752 L 419.661,148.208 ZM 256.00,349.00 C 244.638,349.00 233.624,347.512 223.136,344.733 L 379.729,188.141 C 382.51,198.627 384.00,209.638 384.00,221.00 C 384.00,291.692 326.692,349.00 256.00,349.00 ZM 480.00,0.00l-26.869,0.00 L 343.325,109.806C 315.787,100.844, 286.448,96.00, 256.00,96.00C 144.341,96.00, 47.559,161.021,0.00,256.00 c 21.329,42.596, 52.564,79.154, 90.597,106.534L0.00,453.131L0.00,480.00 l 26.869,0.00 L 480.00,26.869L 480.00,0.00 z M 208.00,157.00c 24.022,0.00, 43.923,17.647, 47.446,40.685 l-54.762,54.762C 177.647,248.923, 160.00,229.022, 160.00,205.00C 160.00,178.49, 181.49,157.00, 208.00,157.00z M 55.058,256.00 c 19.146-30.262, 44.637-55.962, 74.717-75.148c 1.959-1.25, 3.938-2.461, 5.929-3.65C 130.725,190.866, 128.00,205.613, 128.00,221.00 c0.00,29.262, 9.825,56.224, 26.349,77.781l-29.275,29.275C 97.038,309.235, 73.197,284.67, 55.058,256.00z';
const paperclipSvgPath = 'M 348.916,163.524l-32.476-32.461L 154.035,293.434c-26.907,26.896-26.907,70.524,0.00,97.422 c 26.902,26.896, 70.53,26.896, 97.437,0.00l 194.886-194.854c 44.857-44.831, 44.857-117.531,0.00-162.363 c-44.833-44.852-117.556-44.852-162.391,0.00L 79.335,238.212l 0.017,0.016c-0.145,0.152-0.306,0.288-0.438,0.423 c-62.551,62.548-62.551,163.928,0.00,226.453c 62.527,62.528, 163.934,62.528, 226.494,0.00c 0.137-0.137, 0.258-0.284, 0.41-0.438l 0.016,0.017 l 139.666-139.646l-32.493-32.46L 273.35,432.208l-0.008,0.00 c-0.148,0.134-0.282,0.285-0.423,0.422 c-44.537,44.529-116.99,44.529-161.538,0.00c-44.531-44.521-44.531-116.961,0.00-161.489c 0.152-0.152, 0.302-0.291, 0.444-0.423l-0.023-0.03 l 204.64-204.583c 26.856-26.869, 70.572-26.869, 97.443,0.00c 26.856,26.867, 26.856,70.574,0.00,97.42L 218.999,358.375 c-8.968,8.961-23.527,8.961-32.486,0.00c-8.947-8.943-8.947-23.516,0.00-32.46L 348.916,163.524z';

class GroupTemplate {
    constructor(map) {
        this._map = map;
    }

    init() {
        return mk(go.Group, go.Panel.Vertical,
            new go.Binding('layout', 'layout', (layoutName) => {
                return this._map.getLayouts().getLayout(layoutName);
            }),
            new go.Binding('movable', '', (obj) => {
                return !obj.isLinkLabel;
            }).ofObject(),
            new go.Binding('isSubGraphExpanded', 'sExpanded'),
            // dim the thing if it's being dragged over another thing (drop to sister/child)
            new go.Binding('opacity', '', (obj) => {
                return (obj.isSelected && this._map.getUi().dragTargetGroup ? 0.25 : 1);
            }).ofObject(), {
                locationObjectName: 'mainpanel',
                locationSpot: go.Spot.TopLeft,
                selectionAdorned: false,
                isSubGraphExpanded: true,
                layerName: 'Foreground',
                // highlight corners
                mouseEnter: (event, target, obj2) => {
                    this._map.getUi().mouseOverGroup = target;
                    this._map.getDiagram().updateAllTargetBindings();
                },
                // unhighlight corners
                mouseLeave: (event, target, obj2) => {
                    this._map.getUi().mouseOverGroup = null;
                    this._map.getDiagram().updateAllTargetBindings();
                }
                // containingGroupChanged: function(part, oldgroup, newgroup) { 
                //     this._map.getDiagram().model.setDataProperty(part.data, 'level', this._map.computeLevel(part)); 
                //     //part.updateTargetBindings();   
                // }
            },
            mk(go.Panel, go.Panel.Horizontal,
                this.groupExternalTextBlock(this._map.getLayouts().showLeftTextBlock, 'right'),
                mk(go.Panel, go.Panel.Position, {
                        name: 'mainpanel'
                    },
                    new go.Binding('scale', '', this._map.getLayouts().getScale).ofObject(),
                    // drag area
                    mk(go.Shape, 'Rectangle', {
                        name: 'dragarea',
                        position: new go.Point(0, 0),
                        width: 100,
                        height: 100,
                        fill: groupFillColor,
                        stroke: null,
                        cursor: 'move',
                        // show debug info
                        contextClick: (event, target) => {
                            if (event.control) {
                                console.log(this.groupInfo(target.part));
                            }
                        }
                    }),
                    mk(go.Panel, go.Panel.Position,
                        this.viewMarker(),
                        this.dragAboveTarget(),
                        this.dragIntoTarget(),
                        this.dragBelowTarget(),
                        this.groupInternalTextBlock(),
                        this.cornerD(),
                        this.dFlagMarker(),
                        this.cornerS(),
                        this.sCollapsedMarker(),
                        this.cornerR(),
                        this.pointMarker(),
                        this.cornerP(),
                        this.attachmentPaperClip(),
                        this.mainBorder()
                    )
                ),
                this.groupExternalTextBlock(this._map.getLayouts().showRightTextBlock, 'left')
            ),

            // the placeholder normally holds the child nodes, but we just use a dummy placeholder
            mk(go.Shape, {
                name: 'placeholder',
                fill: 'transparent',
                stroke: null,
                desiredSize: new go.Size(0, 0)
            })
        );
    }

    groupInfo(obj) {
        return obj.data.text + '\n' +
            'object: ' + obj + '\n' +
            'key: ' + obj.data.key + '\n' +
            'containingGroup: ' + obj.containingGroup + '\n' +
            'layout: ' + obj.layout + '\n' +
            'data.layout: ' + obj.data.layout + '\n' +
            'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + '\n' +
            'freehand position (data.loc): ' + go.Point.parse(obj.data.loc) + '\n' +
            'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + '\n' +
            'getScale(): ' + this._map.getLayouts().getScale(obj) + '\n' +
            'isLinkLabel: ' + obj.data.isLinkLabel + '\n' +
            'labeledLink: ' + obj.labeledLink + '\n';
    }

    // P view indicator
    viewMarker() {
        return mk(go.Shape, 'Border',
            new go.Binding('visible', '', (obj) => {
                return true;
            }).ofObject(),
            new go.Binding('fill', '', (obj) => {
                return this.getViewMarkerFill(obj);
            }).ofObject(), {
                position: new go.Point(0, 0),
                height: 18,
                width: 100,
                stroke: null
            }
        );
    }

    getViewMarkerFill(obj) {
        let weight = this._map.getPerspectives().getPerspectiveViewWeight(obj);

        if (weight === 3) {
            return colorPDark;
        } else if (weight === 2) {
            return colorP;
        } else if (weight === 1) {
            return colorPLight;
        } else {
            return 'transparent';
        }
    }

    // --------------- targets for dragging to D or S -----------------
    dragAboveTarget() {
        return mk(go.Panel, go.Panel.Position, {
            position: new go.Point(0, 0),
            height: 25,
            width: 100,
            mouseDragEnter: this.getGroupMouseDragEnterHandler(this._map.LEFT),
            mouseDragLeave: this.groupMouseDragLeaveHandler,
            mouseDrop: this.getGroupMouseDropHandler(this._map.LEFT),
            click: this.groupClickHandler
        },
            // drag target region
            mk(go.Shape, 'Rectangle', {
                position: new go.Point(0, 0),
                height: 25,
                width: 100,
                cursor: 'pointer',
                stroke: null,
                fill: 'transparent'
            }),
            // drag indicator bar
            mk(go.Shape, 'Border',
                new go.Binding('visible', '', (obj) => {
                    return this.canDragSelectionToBecomeOrderedSisterOf(obj.part, this._map.LEFT, false);
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

    dragIntoTarget() {
        return mk(go.Panel, go.Panel.Position, {
            position: new go.Point(0, 25),
            height: 50,
            width: 100,
            mouseDragEnter: this.getGroupMouseDragEnterHandler(null),
            mouseDragLeave: this.groupMouseDragLeaveHandler,
            mouseDrop: this.getGroupMouseDropHandler(null),
            click: this.groupClickHandler
        },
            mk(go.Shape, 'Rectangle', {
                position: new go.Point(0, 0),
                height: 50,
                width: 100,
                cursor: 'pointer',
                stroke: null,
                fill: 'transparent'
            })
        );
    }

    dragBelowTarget() {
        return mk(go.Panel, go.Panel.Position, {
            position: new go.Point(0, 75),
            height: 25,
            width: 100,
            mouseDragEnter: this.getGroupMouseDragEnterHandler(this._map.RIGHT),
            mouseDragLeave: this.groupMouseDragLeaveHandler,
            mouseDrop: this.getGroupMouseDropHandler(this._map.RIGHT),
            click: this.groupClickHandler
        },
            // drag target region
            mk(go.Shape, 'Rectangle', {
                position: new go.Point(0, 0),
                height: 25,
                width: 100,
                cursor: 'pointer',
                stroke: null,
                fill: 'transparent'
            }),
            // drag indicator bar
            mk(go.Shape, 'Border',
                new go.Binding('visible', '', (obj) => {
                    return this.canDragSelectionToBecomeOrderedSisterOf(obj.part, this._map.RIGHT, false);
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
    groupInternalTextBlock() {
        return mk(go.Panel, go.Panel.Horizontal, {
            position: new go.Point(0, 0),
            desiredSize: new go.Size(100, 100)
        },
            mk(go.TextBlock,
                new go.Binding('text', 'text').makeTwoWay(),
                new go.Binding('visible', '', (group) => {
                    // always show text inside box for R-things, because external text will throw off layout
                    return this._map.getLayouts().isNotWithinInventoryLayout(group) ||
                        this._map.getLayouts().isRThingWithinInventoryLayout(group);
                }).ofObject(), {
                    width: 80,
                    margin: 10,
                    alignment: go.Spot.Center,
                    textAlign: 'center',
                    cursor: 'move',
                    font: '10px sans-serif',
                    isMultiline: true,
                    wrap: go.TextBlock.WrapDesiredSize,

                    mouseDragEnter: this.getGroupMouseDragEnterHandler(null),
                    mouseDragLeave: this.groupMouseDragLeaveHandler,
                    mouseDrop: this.getGroupMouseDropHandler(null),
                    click: this.groupClickHandler,
                    contextClick: (event, target) => {
                        if (event.control) {
                            console.log(this.groupInfo(target.part));
                        }
                    }
                }
            )
        );
    }

    // Returns a TextBlock for the group title, for use in the main group template, on the left or right.
    // visibleFn is a callback to be bound to the visibility attribute of the TextBlock.
    // textAlign is 'left' or 'right'.
    groupExternalTextBlock(visibleFn, textAlign) {
        return mk(go.TextBlock,
            new go.Binding('text', 'text').makeTwoWay(),
            new go.Binding('visible', '', visibleFn).ofObject(),
            new go.Binding('scale', '', this._map.getLayouts().getExternalTextScale).ofObject(), {
                name: 'externaltext-' + textAlign, // NB: this screws up layouts for some reason - ??
                textAlign: textAlign,
                margin: 5,
                font: '10px sans-serif',
                isMultiline: true,
                click: this.groupClickHandler
            }
        );
    }

    // --------- handlers for mouse drag/drop actions on groups, which need to be replicated on different target parts -------

    // position is this._map.LEFT, null, or this._map.RIGHT
    getGroupMouseDragEnterHandler(position) {
        return (event, target, obj2) => {
            //console.log('mouseDragEnter, e.dp: ' + event.documentPoint + ', target.part: ' + target.part + ', target bounds: ' + target.actualBounds);
            this._map.getUi().dragTargetGroup = target.part;
            this._map.getUi().dragTargetPosition = position;
            this._map.getDiagram().updateAllTargetBindings();
        };
    }

    groupMouseDragLeaveHandler(event, target, obj2) {
        this._map.getUi().dragTargetGroup = null;
        this._map.getUi().dragTargetPosition = null;
        this._map.getDiagram().updateAllTargetBindings();
    }

    getGroupMouseDropHandler(position) {
        return (event, dropTarget) => {
            this.handleGroupMouseDrop(event, dropTarget, position);
        };
    }

    groupClickHandler(event, target) {
        // handle single or double click
        this._map.getUi().handleCornerClick('', target);
    }

    // handle drop on one of the three target regions (top, middle, bottom)
    // side is this._map.LEFT or this._map.RIGHT
    handleGroupMouseDrop(event, dropTarget, side) {
        //console.log('dragAboveTarget.mouseDrop, target: ' + dropTarget + ', part: ' + dropTarget .part + ', show: ' + show);
        if (side && this.canDragSelectionToBecomeOrderedSisterOf(dropTarget.part, side, true)) {
            this._map.addSelectedThingAsOrderedSisterOf(dropTarget.part, side);
        } else if (this.canDragSelectionToBecomeSistersOf(dropTarget.part, true)) {
            this._map.addSelectedThingsAsSistersOf(dropTarget.part);
        } else if (this.canDragSelectionToBecomeChildrenOf(dropTarget.part, true)) {
            this._map.addSelectedThingsAsChildrenOf(dropTarget.part);
        }
    }

    // -----------------------------------------------------------------------------

    // NB: these are here because they are about colors; 
    // similar functions that are scale-related are in layouts.js...
    getGroupSelectionStroke(obj) {
        if (obj.isSelected) {
            if (this._map.getPerspectives().isInPEditorMode())
                return colorP;
            else if (this._map.getPerspectives().isInDEditorMode())
                return colorD;
            else
                return '#000';
        } else {
            return '#000';
        }
    }

    // OK, this isn't about colors, but it wants to be near the one above...
    getGroupSelectionStrokeWidth(obj) {
        return (obj.isSelected ? 3 : 1);
    }

    // -----------------------------------------------------------------------------

    // callbacks to determine when the corners should be visible

    showDCorner(group) {
        if (this._map.getPerspectives().isDEditorThing(group)) { // mark distinction thing
            return true;
        } else if (this._map.getPerspectives().isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (this._map.getPresenter().isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return (group === this._map.getUi().mouseOverGroup) || // show corners on mouseover
                (/*this.isTouchDevice() &&*/ group.isSelected) ||
                (this.canDragSelectionToBecomeSistersOf(group, false) && // drag to D (make it sisters)
                    (!this._map.getUi().dragTargetPosition ||
                        this.cannotDragSelectionToBecomeOrderedSisterOf(group))); // not showing drag above/below indicators
        }
    }

    showSCorner(group) {
        if (this._map.getPerspectives().isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (this._map.getPresenter().isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return (group === this._map.getUi().mouseOverGroup) || // show corners on mouseover
                (/*$scope.isTouchDevice() &&*/ group.isSelected) ||
                (this.canDragSelectionToBecomeChildrenOf(group, false) && // drag to S (make it children)
                    (!this._map.getUi().dragTargetPosition ||
                        this.cannotDragSelectionToBecomeOrderedSisterOf(group))); // not showing drag above/below indicators
        }
    }

    showRCorner(group) {
        if (this._map.getPerspectives().isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (this._map.getPresenter().isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group === this._map.getUi().mouseOverGroup ||
                (/*$scope.isTouchDevice() &&*/ group.isSelected); // show corners on mouseover
        }
    }

    showPCorner(group) {
        if (this._map.getPerspectives().isPEditorPoint(group)) {
            return true; // mark perspective point
        } else if (this._map.getPerspectives().isInPOrDEditorMode()) { // don't show any corners if in P/D editor mode
            return false;
        } else if (this._map.getPresenter().isCreatingThumbnail) { // don't show any corners if capturing thumbnail
            return false;
        } else {
            return group === this._map.getUi().mouseOverGroup ||
                (/*$scope.isTouchDevice() &&*/ group.isSelected); // show corners on mouseover
        }
    }

    showPDot (link) {
        return true; // this._map.getUi().getMapEditorOptions().perspectiveMode != 'both';
    }

    // these functions are used in two modes:
    // 1. with isDropping == false, to highlight drop targets based on this._map.getUi().dragTargetGroup and this._map.getUi().dragTargetPosition,
    //    which are set on mouseDragEnter/mouseDragleave
    // 2. with isDropping == true, on drop, when the above indicators have gone away, but we know what the dropped
    //    and target groups are, and we want to know what the drop should do.

    canDragSelectionToBecomeSistersOf(group, isDropping) {
        return (group === this._map.getUi().dragTargetGroup || isDropping) &&
            this._map.thingsSelectedAreDescendantsOf(group);
    }

    canDragSelectionToBecomeChildrenOf(group, isDropping) {
        return (group === this._map.getUi().dragTargetGroup || isDropping) &&
            !this._map.thingsSelectedIncludeSlide() &&
            !this._map.thingsSelectedAreDescendantsOf(group);
    }

    // side is this._map.LEFT or this._map.RIGHT
    canDragSelectionToBecomeOrderedSisterOf(targetGroup, side, isDropping) {
        // must be dragging single group
        let draggedGroup = this._map.getUniqueThingSelected();
        if (!draggedGroup) {
            return false;
        }

        // dragged and target must be Sisters in inventory layout
        return (targetGroup == this._map.getUi().dragTargetGroup || isDropping) &&
            (this._map.getUi().dragTargetPosition === side || isDropping) &&
            this._map.getLayouts().areSistersInInventoryLayout(draggedGroup, targetGroup);
    }


    cannotDragSelectionToBecomeOrderedSisterOf(targetGroup) {
        return !this.canDragSelectionToBecomeOrderedSisterOf(targetGroup, this._map.LEFT) &&
            !this.canDragSelectionToBecomeOrderedSisterOf(targetGroup, this._map.RIGHT);
    }

    // ---------------- components for main group template ------------------

    dFlagMarker() {
        return mk(go.Shape,
            new go.Binding('fill', '', (obj) => {
                return obj.data.dflag ? '#000' : null;
            }).ofObject(), {
                name: 'dflag',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(18, 18),
                geometry: go.Geometry.parse('F M0 1 L0 18 L18 0 L1 0z', true),
                cursor: 'pointer',
                pickable: false,
                stroke: null
            }
        );
    }


    // 'D' corner (top left, red)
    cornerD() {
        return mk(go.Panel, go.Panel.Position,
            new go.Binding('opacity', '', (obj) => {
                return (this.showDCorner(obj) ? 1 : 0);
            }).ofObject(), {
                name: 'cornerD',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                opacity: 0
            },
            mk(go.Shape, {
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                geometry: go.Geometry.parse('F M0 1 L0 50 L50 0 L1 0z', true),
                fill: colorD,
                stroke: null,
                cursor: 'pointer',
                click: (event, target) => {
                    //console.log('click, control:' + event.control + ', alt:' + event.alt + ', meta:' + event.meta);
                    if (event.alt) {
                        // NB: a side effect of this will be to select just this group,
                        // which would not happen otherwise via control-click
                        this._map.getPerspectives().setDEditorThing(target.part);
                    } else {
                        // handle single or double click
                        this._map.getUi().handleCornerClick('D', target.part);
                    }
                },
                contextClick: (event, target) => {
                    //console.log('contextClick:' + event);
                    this._map.toggleDFlag(target.part);
                }
            }),
            mk(go.TextBlock, {
                text: 'D',
                stroke: 'white',
                font: '9px sans-serif',
                position: new go.Point(12, 15),
                pickable: false
            })
        );
    }

    // 'S' corner (bottom left, green)
    cornerS() {
        return mk(go.Panel, go.Panel.Position,
            new go.Binding('opacity', '', (obj) => {
                return (this.showSCorner(obj) ? 1 : 0);
            }).ofObject(), {
                name: 'cornerS',
                position: new go.Point(0, 50),
                desiredSize: new go.Size(50, 50),
                opacity: 0
            },
            mk(go.Shape, {
                position: new go.Point(0, 0),
                desiredSize: new go.Size(50, 50),
                geometry: go.Geometry.parse('F M0 0 L0 49 L1 50 L50 50z', true),
                fill: colorS,
                stroke: null,
                cursor: 'pointer',
                click: (event, target) => {
                    // handle single or double click
                    this._map.getUi().handleCornerClick('S', target.part);
                }
            }),
            // expansion indicator
            mk(go.Shape,
                new go.Binding('position', '', (obj) => {
                    return (obj.isSubGraphExpanded ? new go.Point(4, 43) : new go.Point(5, 38));
                }).ofObject(),
                new go.Binding('angle', '', (obj) => {
                    return (obj.isSubGraphExpanded ? 90 : 0);
                }).ofObject(), {
                    desiredSize: new go.Size(5, 10),
                    geometry: go.Geometry.parse('F M0 0 L5 5 L0 10z', true),
                    fill: '#333',
                    stroke: null,
                    cursor: 'pointer',
                    pickable: false
                }
            ),
            mk(go.TextBlock, {
                text: 'S',
                stroke: 'white',
                font: '9px sans-serif',
                position: new go.Point(12, 28),
                pickable: false
            })
        );
    }

    // show only when system is collapsed
    sCollapsedMarker() {
        return mk(go.Shape,
            new go.Binding('visible', '', (obj) => {
                return !this.showSCorner(obj) && obj.memberParts.count > 0 && !obj.isSubGraphExpanded;
            }).ofObject(), {
                position: new go.Point(5, 88),
                desiredSize: new go.Size(5, 10),
                geometry: go.Geometry.parse('F M0 0 L5 5 L0 10z', true),
                fill: '#333',
                stroke: null,
                cursor: 'pointer',
                pickable: false
            }
        );
    }


    // 'R' corner (bottom right, blue)
    cornerR() {
        return mk(go.Panel, go.Panel.Position,
            new go.Binding('opacity', '', (obj) => {
                return (this.showRCorner(obj) ? 1 : 0);
            }).ofObject(), {
                name: 'cornerR',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                opacity: 0
            },
            mk(go.Shape, {
                name: 'cornerRShape',
                // NB: this corner is done differently from the others:
                // 1. the overall shape is the size of the whole square, so the port falls in the middle instead of the corner;
                // 2. the geometry traces around the edges of the whole square, because otherwise the link line will
                //    show inside the main square if it's crossing one of the other 3 quadrants 
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                geometry: go.Geometry.parse('F' +
                    'M0 0 L0 100 ' + // top left to bottom left
                    'L99 100 L100 99 L 100 0 ' + // bottom/right sides (round bottom right corner)
                    'L 0 0 L 100 0 ' + // back to top left then top right
                    'L 100 50 L 50 100 ' + // to midpoint of right side, midpoint of bottom side
                    'L0 100z', // bottom left, return home
                    true),
                fill: colorR,
                stroke: null,
                cursor: 'pointer',

                portId: 'R',
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: true,
                click: (event, target) => {
                    // handle single or double click
                    this._map.getUi().handleCornerClick('R', target.part);
                }
            }),
            mk(go.TextBlock, {
                text: 'R',
                stroke: 'white',
                font: '9px sans-serif',
                pickable: false,
                position: new go.Point(82, 78)
            })
        );
    }

    attachmentPaperClip() {
        return mk(go.Shape,
            new go.Binding('visible', '', (obj) => {
                return obj.data.attachments && obj.data.attachments !== undefined && obj.data.attachments.length > 0;
            }).ofObject(),
            new go.Binding('geometry', '', (obj) => {
                return go.Geometry.parse(paperclipSvgPath, true);
            }).ofObject(),
            new go.Binding('desiredSize', '', (obj) => {
                return new go.Size(512, 512); // NB: the two icons don't scale to the same proportions for some reason - ??
            }).ofObject(), {
                position: new go.Point(46, 85),
                scale: 0.02,
                stroke: '#000',
                fill: '#000',
                click: (event, target) => {
                    console.log('clip clicked');
                    this._map.getUi().toggleTab(this._map.getUi().TAB_ID_ATTACHMENTS);
                }
            }
        );
    }

    pEyeball() {
        return mk(go.Shape,
            new go.Binding('visible', '', (obj) => {
                return this._map.getPerspectives().isPerspectivePoint(obj);
            }).ofObject(),
            new go.Binding('geometry', '', (obj) => {
                return go.Geometry.parse(this._map.pIsExpanded(obj) ? eyeSvgPath : eyeBlockedSvgPath, true);
            }).ofObject(),
            new go.Binding('desiredSize', '', (obj) => {
                return new go.Size(512, this._map.pIsExpanded(obj) ? 440 : 512); // NB: the two icons don't scale to the same proportions for some reason - ??
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
    pointMarker() {
        return this.pEyeball();
    }

    // 'P' corner (top right, orange)
    cornerP() {
        return mk(go.Panel, go.Panel.Position,
            new go.Binding('opacity', '', (obj) => {
                return (this.showPCorner(obj) ? 1 : 0);
            }).ofObject(), {
                name: 'cornerP',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                opacity: 0
            },
            mk(go.Shape, {
                name: 'cornerPShape',
                position: new go.Point(0, 0),
                desiredSize: new go.Size(100, 100),
                // NB: this geometry covers the whole square; see note above for cornerR
                geometry: go.Geometry.parse('F' +
                    'M0 0 L0 100 L100 100' + // top left to bottom left to bottom right
                    'L100 1 L99 0 L0 0' + // right/top sides (round top right corner)
                    'L 50 0 L 100 50 ' + // to midpoint of top side, midpoint of right side
                    'L100 100 0 100z', // bottom right, bottom left, return home
                    true),

                fill: colorP,
                stroke: null,
                cursor: 'pointer',

                portId: 'P',
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
                toMaxLinks: 1,
                click: (event, target) => {
                    // handle single or double click
                    this._map.getUi().handleCornerClick('P', target.part);
                }
            }),
            this.pEyeball(), // P expansion indicator
            mk(go.TextBlock, {
                text: 'P',
                stroke: 'white',
                font: '9px sans-serif',
                pickable: false,
                position: new go.Point(81, 15)
            })
        );
    }

    mainBorder() {
        return mk(go.Shape, 'Border',
            new go.Binding('stroke', '', this.getGroupSelectionStroke).ofObject(),
            new go.Binding('strokeWidth', '', this.getGroupSelectionStrokeWidth).ofObject(), {
                name: 'mainarea',
                position: new go.Point(0, 0),
                height: 100,
                width: 100,
                fill: null,
                //portId: '',
                cursor: 'pointer',
                fromLinkable: true,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: false,
                toLinkableDuplicates: true
            }
        );
    }
}

module.exports = GroupTemplate;