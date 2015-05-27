const go = window.go;
const mk = go.GraphObject.make;

const colorR = "#4cbfc2";

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

// when to show the R-thing knob on a link
const showKnob = (map, link) => {
    return link === map.getUi().mouseOverLink;
}

const getRLinkSelectionStroke = (map, obj) => {
    if (obj.isSelected || obj === map.getUi().mouseOverLink) {
        return colorR; // TODO: can P links be selected?
    } else {
        return "#000";
    }
}

const linkTemplate = (map) =>
        mk(go.Link, {
            selectionAdorned: false,
            layerName: '',
            routing: go.Link.Normal,
            relinkableFrom: true,
            relinkableTo: true,
            mouseEnter: function (event, target, obj2) {
                map.getUi().mouseOverLink = target;
                map.getDiagram().updateAllTargetBindings();
            },
            mouseLeave: function (event, target, obj2) {
                map.getUi().mouseOverLink = null;
                map.getDiagram().updateAllTargetBindings();
            },
            mouseDragEnter: function (event, target, dragObject) {
                map.getUi().mouseOverLink = target;
                map.getDiagram().updateAllTargetBindings();
            },
            mouseDragLeave: function (event, dropTarget, dragObject) {
                map.getUi().mouseOverLink = null;
                map.getDiagram().updateAllTargetBindings();
            },
            mouseDrop: function (event, dropTarget) {
                var parts = map.getDiagram().selection;
                if (parts && parts.count === 1 && parts.first() instanceof go.Group) {
                    map.addThingAsRThing(parts.first(), dropTarget);
                }
            },
            doubleClick: function (event, target) {
                map.createRThing(target);
            },
            contextClick: function (event, target) {
                if (event.control) {
                    console.log(linkInfo(map, target));
                }
            }
        },
            mk(go.Shape,
                new go.Binding('stroke', '', () => getRLinkSelectionStroke(map)).ofObject(),
                new go.Binding("strokeWidth", "", map.getLayouts().getLinkStrokeWidth).ofObject(), {
                    name: "LINKSHAPE"
                }
            ),

            // show to/from arrowheads based on link "type" attribute
            mk(go.Shape, {
                fromArrow: "Backward"
            },
                new go.Binding('stroke', '', () => getRLinkSelectionStroke(map)).ofObject(),
                new go.Binding("scale", "", map.getLayouts().getArrowheadScale).ofObject(),
                new go.Binding('visible', 'type', function (t) {
                    return t === 'from' || t === 'toFrom';
                })
            ),
            mk(go.Shape, {
                toArrow: "Standard"
            },
                new go.Binding('stroke', '', () => getRLinkSelectionStroke(map)).ofObject(),
                new go.Binding("scale", "", map.getLayouts().getArrowheadScale).ofObject(),
                new go.Binding('visible', 'type', function (t) {
                    return t === 'to' || t === 'toFrom';
                })
            ),

            mk(go.Panel, go.Panel.Auto, // link label "knob"
                new go.Binding('opacity', '', function (obj) {
                    return (showKnob(map, obj) ? 1 : 0);
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

module.exports = linkTemplate;