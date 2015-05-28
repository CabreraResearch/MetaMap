const go = window.go;
const mk = go.GraphObject.make;

const COLORS = require('../../constants/colors.js');

class PLinkTemplate {
    constructor(map) {
        this._map = map;
    }
    init() {
        return mk(go.Link,
            new go.Binding('opacity', '', (obj) => {
                return (this.showPLink(obj) ? 1 : 0);
            }).ofObject(), {
                selectionAdorned: false,
                layerName: 'Background', // make P links fall behind R links
                routing: go.Link.Normal,
                contextClick: (event, target) => {
                    if (event.control) {
                        console.log(this.linkInfo(target));
                    }
                }
            },
            mk(go.Shape,
                new go.Binding('strokeWidth', '', this._map.layouts.getLinkStrokeWidth).ofObject(), {
                    name: 'LINKSHAPE',
                    stroke: COLORS.colorPLight,
                    fill: COLORS.colorPLight
                }
            ),
            mk(go.Shape,
                // new go.Binding('visible', '', function(obj) {
                //     return (self.showPDot(obj) ? 1 : 0);
                // }).ofObject(),
                new go.Binding('scale', '', this._map.layouts.getArrowheadScale).ofObject(), {
                    toArrow: 'Circle',
                    stroke: COLORS.colorPLight,
                    fill: COLORS.colorPLight
                }
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

    // when a P link should be visible
    showPLink(link) {
        var mode = this._map.ui.getMapEditorOptions().perspectiveMode;
        if (this._map.perspectives.isPEditorPoint(link.fromNode)) { // show P's when this link is from the current Point
            return true;
        } else if (this._map.perspectives.isInPOrDEditorMode()) { // don't show P's for non-Point things, even on mouseover
            return false;
        } else {
            return (mode === 'lines' || mode === 'both') && (link.fromNode === this._map.ui.mouseOverGroup || this._map.pIsExpanded(link.fromNode));
        }
    }
}

module.exports = PLinkTemplate;