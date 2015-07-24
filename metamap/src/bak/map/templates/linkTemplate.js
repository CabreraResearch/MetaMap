const go = window.go;
const mk = go.GraphObject.make;

const COLORS = require('../../constants/colors.js');

class LinkTemplate {
    constructor(map) {
        this._map = map;
    }
    init() {
        return mk(go.Link, {
            selectionAdorned: false,
            layerName: '',
            routing: go.Link.Normal,
            relinkableFrom: true,
            relinkableTo: true,
            mouseEnter: (event, target, obj2) => {
                this._map.ui.mouseOverLink = target;
                this._map.getDiagram().updateAllTargetBindings();
            },
            mouseLeave: (event, target, obj2) => {
                this._map.ui.mouseOverLink = null;
                this._map.getDiagram().updateAllTargetBindings();
            },
            mouseDragEnter: (event, target, dragObject) => {
                this._map.ui.mouseOverLink = target;
                this._map.getDiagram().updateAllTargetBindings();
            },
            mouseDragLeave: (event, dropTarget, dragObject) => {
                this._map.ui.mouseOverLink = null;
                this._map.getDiagram().updateAllTargetBindings();
            },
            mouseDrop: (event, dropTarget) => {
                var parts = this._map.getDiagram().selection;
                if (parts && parts.count === 1 && parts.first() instanceof go.Group) {
                    this._map.addThingAsRThing(parts.first(), dropTarget);
                }
            },
            doubleClick: (event, target) => {
                this._map.createRThing(target);
            },
            contextClick: (event, target) => {
                if (event.control) {
                    console.log(this.linkInfo(target));
                }
            }
        },
            mk(go.Shape,
                new go.Binding('stroke', '', this.getRLinkSelectionStroke).ofObject(),
                new go.Binding('strokeWidth', '', this._map.layouts.getLinkStrokeWidth).ofObject(), {
                    name: 'LINKSHAPE'
                }
            ),

            // show to/from arrowheads based on link 'type' attribute
            mk(go.Shape, {
                fromArrow: 'Backward'
            },
                new go.Binding('stroke', '', this.getRLinkSelectionStroke).ofObject(),
                new go.Binding('scale', '', this._map.layouts.getArrowheadScale).ofObject(),
                new go.Binding('visible', 'type', (t) => {
                    return t === 'from' || t === 'toFrom';
                })
            ),
            mk(go.Shape, {
                toArrow: 'Standard'
            },
                new go.Binding('stroke', '', this.getRLinkSelectionStroke).ofObject(),
                new go.Binding('scale', '', this._map.layouts.getArrowheadScale).ofObject(),
                new go.Binding('visible', 'type', (t) => {
                    return t === 'to' || t === 'toFrom';
                })
            ),
            mk(go.Panel, go.Panel.Auto, // link label 'knob'
                new go.Binding('opacity', '', (obj) => {
                    return (this.showKnob(obj) ? 1 : 0);
                }).ofObject(),
                new go.Binding('scale', '', this._map.layouts.getArrowheadScale).ofObject(),
                mk(go.Shape, {
                    figure: 'Ellipse',
                    fill: COLORS.colorD,
                    stroke: COLORS.colorD,
                    width: 12,
                    height: 12
                })
            )
        );
    }

    linkInfo(obj) {
        var snpos = this._map.layouts.getSameNodesLinkPosition(obj);
        return '' +
            'object: ' + obj + '\n' +
            'fromNode: ' + obj.fromNode + '\n' +
            'toNode: ' + obj.toNode + '\n' +
            'labelNodes: ' + obj.labelNodes.count + '\n' +
            'labelNodeIsVisible: ' + this._map.layouts.labelNodeIsVisible(obj) + '\n' +
            'fromPortId: ' + obj.fromPortId + '\n' +
            'toPortId: ' + obj.toPortId + '\n' +
            'category: ' + (obj.data ? obj.data.category : '') + '\n' +
            'containingGroup: ' + obj.containingGroup + '\n' +
            'fromAndToNodesAreVisible: ' + this._map.layouts.fromAndToNodesAreVisible(obj) + '\n' +
            'curve: ' + obj.curve + '\n' +
            'curviness: ' + obj.curviness + '\n' +
            'fromEndSegmentLength: ' + Math.round(obj.fromEndSegmentLength) + '\n' +
            'toEndSegmentLength: ' + Math.round(obj.toEndSegmentLength) + '\n' +
            'sameNodesLinkPosition: ' + snpos.index + ' of ' + snpos.count + '\n' +
            //+ 'geometry: ' + obj.geometry + '\n' +
            'getLinkStrokeWidth: ' + this._map.layouts.getLinkStrokeWidth(obj) + '\n';
    }

    // when to show the R-thing knob on a link
    showKnob(link) {
        return link === this._map.ui.mouseOverLink;
    }

    getRLinkSelectionStroke(obj) {
        if (obj.isSelected || obj === this._map.ui.mouseOverLink) {
            return COLORS.colorR; // TODO: can P links be selected?
        } else {
            return '#000';
        }
    }
}
module.exports = LinkTemplate;