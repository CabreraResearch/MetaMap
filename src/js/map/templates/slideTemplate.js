const go = window.go;
const mk = go.GraphObject.make;

const nodeInfo = (obj) => {
    return 'object: ' + obj + "\n" +
        'key: ' + obj.data.key + "\n" +
        'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + "\n" +
        'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + "\n";
}

const createSlideResizeHandle = (alignment) => {
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

const slideTemplate = (map) =>
        mk(go.Node, go.Panel.Auto,
            // NB: unlike groups, slides just use a normal 2-way location binding
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("width", "width").makeTwoWay(),
            new go.Binding("height", "height").makeTwoWay(),
            new go.Binding("visible", "", function (obj) {
                return obj.data.hasRegion &&
                    map.getUi().currentTabIs(map.getUi().TAB_ID_PRESENTER) &&
                    !map.getPresenter().isPresenting &&
                    !map.getPresenter().isCreatingThumbnail &&
                    map.getPresenter().currentSlideIndex === obj.data.index;
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
                    console.log(nodeInfo(target.part));
                }
            },

            mk(go.Shape, "Rectangle", {
                name: "slideborder",
                fill: 'rgba(251,170,54,.1)',
                stroke: null
            })
    );

module.exports = slideTemplate;