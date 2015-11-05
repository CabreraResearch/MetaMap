const jsPlumb = window.jsPlumb;
const jsPlumbToolkit = window.jsPlumbToolkit;
const _ = require('lodash')
const CONSTANTS = require('../constants/constants')
const Permissions = require('../app/Permissions')
const Toolkit = require('./Toolkit')
const Node = require('./Node')
const Renderer = require('./Renderer')
const Events = require('./Events')
const Dialog = require('./Dialog')

require('./layout')

class Canvas {

    constructor(opts) {
        this.metaMap = require('../../MetaMap')
        this.opts = opts
        this._init(opts)
        this.config = this.metaMap.config.metamap.canvas

        jsPlumbToolkit.ready(() => {

            //Load the classes
            //Order of ops matters
            //1. Load the toolkit
            this.tk = new Toolkit(this)
            this.jsToolkit = this.tk.toolkit

            //2. Prep events
            this.events = new Events(this)

            //3. Load the renderer
            this.rndrr = new Renderer(this)
            this.jsRenderer = this.rndrr.renderer

            //4: Load the node
            this.node = new Node(this)

            //5: Dialog (order doesn't really matter here)
            this.dialog = new Dialog(this)

            //6: Load the data
            this.loadData()

            //7: Bind the events
            this.tk.bindEvents()
            this.events.bindEvents()

        })
    }

    _init(opts) {
        if(opts.map) this.map = opts.map;
        if(opts.mapId) this.mapId = opts.mapId;

        this.isReadOnly = false
        if(opts.doAutoSave == true || opts.doAutoSave == false) this.doAutoSave = opts.doAutoSave
        if (this.map && this.doAutoSave) {
            this.permissions = new Permissions(this.map)
            this.isReadOnly = !this.permissions.canEdit()
        }
    }

    reInit(opts) {
         this._init(opts)
    }

    onAutoSave(data) {
        if (this.doAutoSave && this.permissions.canEdit()) {
            //KLUDGE: looks like the exportData now includes invalid property values (Infinity) and types (methods)
            //Parsing to/from string fixes for now
            data = JSON.parse(JSON.stringify(data))
            let postData = {
                data: data,
                changed_by: {
                    userId: this.metaMap.User.userId
                }
            }
            this.metaMap.MetaFire.setDataInTransaction(postData, `maps/data/${this.mapId}`)
            this.metaMap.Integrations.sendEvent(this.mapId, 'autosave', this.map.name)
        }
    }

    // load the data.
    loadData() {
        const toolkit = this.jsToolkit
        const renderer = this.jsRenderer

        if (this.map && this.map.data) {
            toolkit.load({
                type: 'json',
                data: this.map.data
            })
            let state = localStorage.getItem(`jtk-state-metaMapCanvas_${this.mapId || this.mapName}`)
            renderer.State.restore(state)
            toolkit.eachEdge((i,e) => {
                //console.log(e)
            })
        }
    }

    exportData() {
        let ret = JSON.parse(JSON.stringify(this.jsToolkit.exportData()))
        return ret
    }

    //Whenever changing the selection, clear what was previously selected
    clearSelection(obj) {
        const toolkit = this.jsToolkit
        toolkit.clearSelection();
        $('.node-selected').each(function () {
            this.setAttribute('class', 'node-border')
        })
        this.rndrr.hideRDots()

        if (obj) {
            $(obj.el).find('.node-border').each(function () {
                this.setAttribute('class', 'node-selected')
            })
            if (obj.node) {
                toolkit.setSelection(obj.node);
            }
            if (obj.edge) {
                toolkit.setSelection(obj.edge);
            }
        }
    }

    updateData(obj) {

        if (obj.edge) {
            this.jsToolkit.updateEdge(obj.edge)
        }
        if (obj.node) {
            this.jsToolkit.updateNode(obj.node)
        }

        //I don't think these should be required, but they seem to be
        this.jsRenderer.relayout()
        this.jsRenderer.refresh()

        //This line is most likely redundant as updateEdge should implicitly do it
        this.jsToolkit.fire('dataUpdated')
        this.update()
    }

    update() {
        this.tk.update()
        this.events.update()
        this.rndrr.update()
        this.dialog.update()
    }

    deleteAll(selected) {
        const toolkit = this.jsToolkit

        const deleteRThing = (child) => {
            if (child.data.rthing && child.data.rthing.edgeId) {
                let edge = toolkit.getEdge(child.data.rthing.edgeId)
                edge.data.rthing = null
                toolkit.updateEdge(edge)
            }
        }

        const recurse = (node) => {
            if(node && node.data.children) {
                _.each(node.data.children, (id, i) => {
                    let child = toolkit.getNode(id)
                    recurse(child)
                })
            }
            deleteRThing(node)
            //Delete children before parents
            toolkit.removeNode(node)
        }

        selected.eachEdge(function(i,edge) {
            //Delete any r-things that are associated with the edges to be deleted
            if (edge.rthing && edge.rthing.nodeId) {
                let child = toolkit.getNode(edge.rthing.nodeId)
                recurse(child)
            }
        });

        //Recurse over all children
        selected.eachNode((i,n) => {
            recurse(n)
        });
        toolkit.remove(selected)
    }

    get partSize() {
        return this.config.shapes.part.size || 0.667
    }

    get nodeSize() {
        return this.config.shapes.node.size || 50
    }

    get arrowSize() {
        return this.config.shapes.arrow.size || 5
    }

    // --------------------------------------------------------------------------------------------------------
    // a couple of random examples of the filter function, allowing you to query your data
    // --------------------------------------------------------------------------------------------------------
    countEdgesOfType(type) {
        return this.jsToolkit.filter(function(obj) { return obj.objectType == "Edge" && obj.data.type===type; }).getEdgeCount()
    }

    dumpEdgeCounts() {
        console.log("There are " + this.countEdgesOfType("relationship") + " relationship edges");
        console.log("There are " + this.countEdgesOfType("perspective") + " perspective edges");
    }

}

module.exports = Canvas;
