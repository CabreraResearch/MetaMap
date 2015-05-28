const go = window.go;
const SlideTemplate = require('./templates/SlideTemplate.js');
const GroupTemplate = require('./templates/GroupTemplate.js');
const LinkTemplate = require('./templates/LinkTemplate.js');
const PLinkTemplate = require('./templates/PLinkTemplate.js');
const dLinkTemplate = require('./templates/dLinkTemplate.js');

// convenient abbreviation for creating templates
const mk = go.GraphObject.make;


const colorR = "#4cbfc2";
const colorP = "#fbaa36";

// footer for image export
let _exportFooter = null;

// goJS templates used in the editor
class Templates {
    constructor(editor, map) {
        this._editor = editor;
        this._map = map;

        this.slideTemplate = new SlideTemplate(map);
        this.groupTemplate = new GroupTemplate(map);
        this.linkTemplate = new LinkTemplate(map);
        this.pLinkTemplate = new PLinkTemplate(map);
        this.dLinkTemplate = dLinkTemplate(map);
    }

    initTemplates(diagram) {
        diagram.groupTemplate = this.groupTemplate.init();
        diagram.nodeTemplate = this.slideTemplate.init();
        diagram.linkTemplate = this.linkTemplate.init();
        diagram.linkTemplateMap.add('P', this.pLinkTemplate);
        diagram.linkTemplateMap.add('D', this.dLinkTemplate);

        this.setTemporaryLinkTemplates(diagram.toolManager.linkingTool);
        this.setTemporaryLinkTemplates(diagram.toolManager.relinkingTool);

        diagram.toolManager.linkingTool.portTargeted = (realnode, realport, tempnode, tempport, toend) => {
            this.handlePortTargeted(diagram.toolManager.linkingTool, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.relinkingTool.portTargeted = (realnode, realport, tempnode, tempport, toend) => {
            this.handlePortTargeted(diagram.toolManager.relinkingTool, realnode, realport, tempnode, tempport, toend);
        };

        diagram.toolManager.relinkingTool.updateAdornments = (part) => {
            go.RelinkingTool.prototype.updateAdornments.call(this, part);
            let from = part.findAdornment('RelinkFrom');
            let to = part.findAdornment('RelinkTo');
            // if (from)
            //     console.log('relinkfrom: ' + from.part.width);
        };

        diagram.toolManager.linkingTool.linkValidation = this.validateLink;
        diagram.toolManager.relinkingTool.linkValidation = this.validateLink;
    }

    // ----------- temporary link/node templates, for use when dragging to create R/P lines -------------

    // define initial temporary link templates - these will be modified when handlePortTargeted is called
    setTemporaryLinkTemplates(tool) {
        tool.temporaryLink = this.makeTemporaryLinkTemplate();
        tool.temporaryFromNode = this.makeTemporaryNodeTemplate();
        tool.temporaryToNode = this.makeTemporaryNodeTemplate();
    }

    makeTemporaryLinkTemplate() {
        return mk(go.Link, {
            layerName: "Tool"
        },
            mk(go.Shape, {
                name: 'linkshape',
                strokeWidth: 2
            })
        );
    }

    makeTemporaryNodeTemplate() {
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
    handlePortTargeted(tool, realnode, realport, tempnode, tempport, toend) {
        // console.log('portTargeted, realport: ' + (realport ? realport.name : '') + ', tempport: ' + (tempport ? tempport.name : '') 
        //     + ', originalFromPort: ' + (ltool.originalFromPort ? ltool.originalFromPort.name : '') + ', originalToPort: ' + ltool.originalToPort);

        let linkShape = tool.temporaryLink.findObject('linkshape');
        let fromBorder = tool.temporaryFromNode.findObject('border');
        let toBorder = tool.temporaryToNode.findObject('border');

        if (tool.originalFromPort && tool.originalFromPort.name === 'cornerPShape') {
            linkShape.stroke = colorP;
            fromBorder.stroke = colorP;
            toBorder.stroke = colorP;
            fromBorder.portId = 'P';
            toBorder.portId = 'P';
        } else if (tool.originalFromPort && tool.originalFromPort.name === 'cornerRShape') {
            linkShape.stroke = colorR;
            fromBorder.stroke = colorR;
            toBorder.stroke = colorR;
            fromBorder.portId = 'R';
            toBorder.portId = 'R';
        }
        tempnode.scale = this._map.layouts.getScale(realnode);
    }

    // prevent duplicate 'P' links in the same direction between the same two things
    validateLink(fromNode, fromPort, toNode, toPort) {
        // the P port is on top of the R port, so both P and R links get the toPort set to R by default.
        if (fromPort.portId === 'P') {
            // NB: findLinksTo would be simpler, but it doesn't seem to work... (?)
            let pLinks = toNode.findLinksBetween(fromNode, 'P', 'P');
            //console.log('validateLink, pLinks from ' + fromNode + ':' + fromPort + ' to ' + toNode + ':' + toPort + ' = ' + pLinks.count);
            if (pLinks.count) {
                while (pLinks.next()) {
                    let pLink = pLinks.value;
                    if (pLink.fromNode === fromNode && pLink.toNode === toNode) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // ------------------- export footer ----------------------

    // NB: this is not a template per se, in that it is added to the diagram 
    // statically, rather than being bound to something in the model.
    // But we put it here because it is about creating parts and stuff.

    createExportFooter() {
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
    addExportFooter() {
        if (!_exportFooter) {
            _exportFooter = this.createExportFooter();
            this._map.getDiagram().add(_exportFooter);
        }
    }

    showExportFooter() {
        let rect = this._map.computeMapBounds();
        // put footer at least 100 px below bottom of map; make it at least 500px wide
        let x = rect.x;
        let y = rect.y + rect.height + Math.max(100, rect.height / 5);
        let w = Math.max(500, rect.width);
        //console.log('showExportFooter, bounds rect: ' + rect + ', w: ' + w);
        _exportFooter.location = new go.Point(x, y);
        _exportFooter.findObject("rectangle").width = w;
        _exportFooter.findObject("mapTitle").text = "Map Title: " + this._editor.mapTitle;
        _exportFooter.findObject("authorName").text = "Author: " + this._editor.userName;
        _exportFooter.opacity = 1;
        _exportFooter.invalidateLayout();
    }

    hideExportFooter() {
        _exportFooter.opacity = 0;
    }
}

module.exports = Templates;