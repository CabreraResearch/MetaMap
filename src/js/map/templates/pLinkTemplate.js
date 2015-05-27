const go = window.go;
const mk = go.GraphObject.make;

const linkInfo = (map, obj) => {
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

// when a P link should be visible
const showPLink = (map, link) => {
    var mode = map.getUi().getMapEditorOptions().perspectiveMode;
    if (map.getPerspectives().isPEditorPoint(link.fromNode)) { // show P's when this link is from the current Point
        return true;
    } else if (map.getPerspectives().isInPOrDEditorMode()) { // don't show P's for non-Point things, even on mouseover
        return false;
    } else {
        return (mode === 'lines' || mode === 'both') && (link.fromNode === map.getUi().mouseOverGroup || map.pIsExpanded(link.fromNode));
    }
};

const pLinkTemplate = (map) =>
    mk(go.Link,
        new go.Binding('opacity', '', function (obj) {
            return (showPLink(map, obj) ? 1 : 0);
        }).ofObject(), {
            selectionAdorned: false,
            layerName: 'Background', // make P links fall behind R links
            routing: go.Link.Normal,
            contextClick: function (event, target) {
                if (event.control) {
                    console.log(linkInfo(map, target));
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

module.exports = pLinkTemplate;