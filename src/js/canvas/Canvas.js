const jsPlumb = window.jsPlumb;
const jsPlumbToolkit = window.jsPlumbToolkit;
const $ = require('jquery')
const _ = require('lodash')

const CONSTANTS = require('../constants/constants')
const Permissions = require('../app/Permissions')
const Toolkit = require('./Toolkit')
const Node = require('./Node')
const Edge = require('./Edge')
const Renderer = require('./Renderer')
const Events = require('./Events')
const Dialog = require('./Dialog')
const Schema = require('./Schema')
const CopyPaste = require('./CopyPaste')
const Undo = require('./Undo')
const uuid = require('../tools/uuid')

require('./layout')

class Canvas {

    constructor(opts) {
        this.metaMap = require('../../MetaMap')
        this.opts = opts
        this._init(opts)
        this.config = this.metaMap.config.metamap.canvas

        jsPlumbToolkit.ready(() => {

            //Order of ops matters
            //Load the classes
            //0. Load nodes and edges
            this.node = new Node(this)
            this.edge = new Edge(this)

            //1. Load the toolkit
            this.tk = new Toolkit(this)
            this.jsToolkit = this.tk.toolkit

            //2. Prep events
            this.events = new Events(this)

            //3. Load the renderer
            this.rndrr = new Renderer(this)
            this.jsRenderer = this.rndrr.renderer

            //5: Dialog (order doesn't really matter here)
            this.dialog = new Dialog(this)

            this.schema = new Schema(this)

            //6: Load the data
            this.loadUpgradeData()

            //7: Bind the events
            this.tk.bindEvents()
            this.events.bindEvents()

            this.copyPaste = new CopyPaste(this)
            this.undo = new Undo(this)
        })
    }

    _exportData() {
        let ret = this.jsToolkit.exportData()
        _.each(ret.edges, (e) => {
            let edge = this.jsToolkit.getEdge(e.data.id)
            if(edge && edge.geometry) {
                e.geometry = edge.geometry
            }
        })
        return ret
    }

    _init(opts) {
        if (opts.map) this.map = opts.map;
        if (opts.mapId) this.mapId = opts.mapId;

        this.isReadOnly = false
        if (opts.doAutoSave == true || opts.doAutoSave == false) this.doAutoSave = opts.doAutoSave
        if (this.map && this.doAutoSave) {
            this.permissions = new Permissions(this.map)
            this.isReadOnly = !this.permissions.canEdit()
        }
    }

    //Convenience getters
    get arrowSize() {
        return this.config.shapes.arrow.size || 5
    }

    get dragDropHandler() {
        return this.rndrr.dragDropHandler
    }

    get mode() {
        if(!this._mode) {
            this._mode = 'pan'
        }
        return this._mode
    }

    set mode(val) {
        this._mode = val
        this.jsRenderer.setMode(val)
    }

    get nodeSize() {
        return this.config.shapes.node.size || 50
    }

    get partSize() {
        return this.config.shapes.part.size || 0.667
    }

    addToSelection(obj) {
        if (obj) {
            //setup our own state for selected nodes/edges
            this._selection = this._selection || { nodeIds: [], edgeIds: [] }
            $(obj.el).find('.node.border').each(function () {
                this.setAttribute('class', 'node-selected')
            })
            if (obj.node) {
                //push selected nodes onto the state
                this._selection.nodeIds.push(obj.node.id)
                let children = this.schema.getAllChildren(obj.node).ids
                this._selection.nodeIds = _.union(this._selection.nodeIds, children)
                this.jsToolkit.addToSelection(obj.node)
                let edges = this.exportData().edges
                _.each(edges, (e) => {
                    if (e.data.family && e.data.family == obj.node.data.family) {
                        if (!_.contains(this._selection.edgeIds, e.data.id)) {
                            this._selection.edgeIds.push(e.data.id)
                        }
                    }
                })
            }
            if (obj.edge) {
                //push selected edges onto the state
                this._selection.edgeIds.push(obj.edge.data.id)
                this.jsToolkit.addToSelection(obj.edge);
            }
        }
    }

    batch(cb) {
        if(cb) {
            NProgress.start()
            console.log('progress started')
            let autoSave = this.doAutoSave
            this.doAutoSave = false
            jsPlumb.setSuspendDrawing(true);
            _.delay(() => {
                let then = () => {
                    jsPlumb.setSuspendDrawing(false, true);
                    this.doAutoSave = autoSave
                    this.onAutoSave()
                    NProgress.done()
                }
                NProgress.inc()
                let promise = null
                try {
                    promise = cb()
                    NProgress.inc()
                } catch(e) {
                    console.log(e.stack)
                } finally {
                    NProgress.inc()
                    if(promise) {
                        promise.then(then)
                    } else {
                        then()
                    }
                }
            }, 50)
        }
    }

    //Whenever changing the selection, clear what was previously selected
    clearSelection(obj) {
        const toolkit = this.jsToolkit
        if (!obj || !obj.e || !obj.e.ctrlKey) {
            this.mode = 'pan'
            toolkit.clearSelection();
            //clear our internal state
            this._selection = { nodeIds: [], edgeIds: [] }
            $('.node-selected').each(function () {
                this.setAttribute('class', 'node border')
            })
        }
        this.rndrr.hideRDots()
        this.addToSelection(obj)
    }

    // --------------------------------------------------------------------------------------------------------
    // a couple of random examples of the filter function, allowing you to query your data
    // --------------------------------------------------------------------------------------------------------
    countEdgesOfType(type) {
        return this.jsToolkit.filter(function (obj) { return obj.objectType == "Edge" && obj.data.type === type; }).getEdgeCount()
    }

    exportData(limitToSelected = false) {
        let ret = this._exportData()
        if (limitToSelected && this._selection) {
            ret = _.clone(ret)

            //In case of a lasso, the selection needs to be updated
            this.getSelection()
            //getSelection rarely has the actual selection; use our own state
            // let selected = this.jsToolkit.getSelection()
            ret.edges = _.remove(ret.edges, (edge) => {
                let ret = _.contains(this._selection.edgeIds, edge.data.id)
                return ret
            })
            ret.nodes = _.remove(ret.nodes, (node) => {
                let ret = _.contains(this._selection.nodeIds, node.id)
                return ret
            })
        }
        return ret
    }

    getDepth(node, d = 0) {
        let ret = d
        if (node) {
            if (node.data.parentId == null) ret = d;
            else {
                ret = this.getDepth(this.jsToolkit.getNode(node.data.parentId), ++d);
            }
        }
        return ret
    }

    /**
    *
    */
    getPartSizeAtDepth(depth) {
        var s = this.nodeSize, ps = this.partSize;
        for (var i = 1; i <= depth; i++) {
            s *= ps;
        }
        return s;
    }

    getSelection() {
        let sel = this.jsToolkit.getSelection()
        sel.eachNode((i,node) => {
            if(!_.contains(this._selection.nodeIds, node.id)) {
                this.addToSelection({node: node})
            }
        })
        sel.eachEdge((i,edge) => {
            if(!_.contains(this._selection.edgeIds, edge.getId())) {
                this.addToSelection({edge: edge})
            }
        })

        return this._selection
    }

    loadData(map = this.map) {
        this._data = map
        let old = this.doAutoSave
        this.doAutoSave = false
        this.jsToolkit.load({
            type: 'json',
            data: map
        })
        this.doAutoSave = old
    }

    // load the data.
    loadUpgradeData(map = this.map) {
        if ((!map || !map.data) && this.doAutoSave && !this.isReadOnly) {
            map = map || {}
            map.data = this.schema.getDefaultMap()
            this.map = map
        }
        if (map && map.data) {
            this.schema.upgrade(map.data)
            this.loadData(map.data)
        }
    }

    onAutoSave() {
        this._data = this._exportData()
        if (this.doAutoSave && this.permissions.canEdit()) {
            let postData = {
                data: this._data,
                changed_by: {
                    userId: this.metaMap.User.userId,
                    userName: this.metaMap.User.fullName,
                    userKey: this.metaMap.User.userKey,
                    changeId: uuid()
                }
            }
            this.metaMap.MetaFire.setDataInTransaction(postData, `maps/data/${this.mapId}`).catch((err) => {
                //Only show 1 warning
                if(this.doAutoSave) {
                    window.alert("Something went wrong. Your map is no longer be saved. Please refresh your browser and try again.")
                    this.metaMap.error(err)
                }
                this.doAutoSave = false
            })
            this.metaMap.Integrations.sendEvent('autosave', { mapId: this.mapId, mapName: this.mapName, map: postData })
        }
    }

    reInit(opts) {
        this._init(opts)
    }

    reloadData(map) {
        this._data = map
        let old = this.doAutoSave
        this.doAutoSave = false
        this.jsToolkit.clear()
        this.jsToolkit.load({
            type: 'json',
            data: map
        })
        _.delay(() => {
            this.doAutoSave = old
        },500)
    }

    refresh() {
        //I don't think these should be required, but they seem to be
        this.jsRenderer.relayout()
        this.jsRenderer.refresh()
    }

    update() {
        this.tk.update()
        this.events.update()
        this.rndrr.update()
        this.dialog.update()
    }

    updateData(obj, doRefresh = true) {
        this.schema.updateData(obj)

        if (doRefresh) {
            this.refresh()
            //This line is most likely redundant as updateEdge should implicitly do it
            this.jsToolkit.fire('dataUpdated')
        }
        this.update()
    }

}

module.exports = Canvas;
