const go = window.go;
const mk = go.GraphObject.make;
const COLORS = require('../../constants/colors.js');

class SlideTemplate {
    constructor(map) {
        this._map = map;
    }
    init() {
        return mk(go.Node, go.Panel.Auto,
            // NB: unlike groups, slides just use a normal 2-way location binding
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding('width', 'width').makeTwoWay(),
            new go.Binding('height', 'height').makeTwoWay(),
            new go.Binding('visible', '', (obj) => {
                return obj.data.hasRegion &&
                    this._map.ui.currentTabIs(this._map.ui.TAB_ID_PRESENTER) &&
                    !this._map.presenter.isPresenting &&
                    !this._map.presenter.isCreatingThumbnail &&
                    this._map.presenter.currentSlideIndex === obj.data.index;
            }).ofObject(), {
                locationSpot: go.Spot.TopLeft,
                selectionAdorned: false,
                resizable: true,
                resizeAdornmentTemplate: mk(go.Adornment, 'Spot',
                    mk(go.Placeholder), // takes size and position of adorned object                    
                    this.createSlideResizeHandle(go.Spot.TopLeft),
                    this.createSlideResizeHandle(go.Spot.Top),
                    this.createSlideResizeHandle(go.Spot.TopRight),
                    this.createSlideResizeHandle(go.Spot.Right),
                    this.createSlideResizeHandle(go.Spot.BottomRight),
                    this.createSlideResizeHandle(go.Spot.Bottom),
                    this.createSlideResizeHandle(go.Spot.BottomLeft),
                    this.createSlideResizeHandle(go.Spot.Left)
                ),
                padding: 0,
                contextClick: (event, target) => {
                    console.log(this.nodeInfo(target.part));
                }
            },
            mk(go.Shape, 'Rectangle', {
                name: 'slideborder',
                fill: 'rgba(251,170,54,.1)',
                stroke: null
            })
        );
    }

    nodeInfo(obj) {
        return 'object: ' + obj + '\n' +
            'key: ' + obj.data.key + '\n' +
            'position: ' + parseInt(obj.position.x, 10) + ', ' + parseInt(obj.position.y, 10) + '\n' +
            'width/height: ' + parseInt(obj.actualBounds.width, 10) + '/' + parseInt(obj.actualBounds.height, 10) + '\n';
    }

    createSlideResizeHandle(alignment) {
        return mk(go.Shape,
            new go.Binding('desiredSize', '', (obj) => {
                var slide = obj.adornedObject;
                var size = Math.min(slide.width, slide.height) * .05;
                return new go.Size(size, size);
            }).ofObject(), {
                alignment: alignment,
                cursor: 'col-resize',
                fill: 'rgba(251,170,54,1)',
                stroke: null
            }
        );
    }
}
module.exports = SlideTemplate;