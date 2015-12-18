const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit
const jsPlumbUtil = window.jsPlumbUtil

const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')

class Undo extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        this.jsToolkit.bind('nodeUpdated', (obj) => {

        })
        this.jsRenderer.bind('nodeMoveStart', (obj) => {

        })
        this.jsRenderer.bind('nodeMoveEnd', (obj) => {
            if(obj.pos && obj.pos[0] == 0 && obj.pos[1] == 0) {
                let data = _.clone(obj.node.data, true)
                // _.delay(() => {
                //     obj.node.data = data
                //     this.canvas.updateData({ node: obj.node }, {left: data.left, top: data.top})
                //     this.canvas.jsRenderer.setAbsolutePosition(obj.el, [data.left, data.top])
                //     this.jsRenderer.refresh()
                // }, 1)
            }
        })
        this.jsToolkit.bind('nodeAdded', (obj) => {
            let data = _.clone(obj.node.data, true)
            this.addChange({ add: {node: data} })
        })
        this.jsToolkit.bind('nodeRemoved', (obj) => {
            let data = _.clone(obj.node.data, true)
            this.addChange({remove: {node: data} })
        })
        this.jsToolkit.bind('edgeAdded', (obj) => {
            let e = {
                data: _.clone(obj.edge.data, true),
                source: obj.edge.source.data.id,
                target: obj.edge.target.data.id
            }
            this.addChange({add: {edge: e} })
        })
        this.jsToolkit.bind('edgeRemoved', (obj) => {
            let e = {
                data: _.clone(obj.edge.data, true),
                source: obj.edge.source.data.id,
                target: obj.edge.target.data.id
            }
            this.addChange({remove: {edge: e} })
        })

        jsPlumb.on(document, 'keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.keyCode) {
                    case 90: //z
                        this.undo(event)
                        break
                    case 89: //y
                        this.redo(event)
                        break
                }
            }
        })
    }

    addChange(obj) {
        if(true != this._isUndoRedo) {
            this.changes.push(obj)
            this.currentChange += 1
        }
    }

    get currentChange() {
        this._currentChange = this._currentChange || 0
        return this._currentChange
    }

    set currentChange(v) {
        this._currentChange = v
    }

    get changes() {
        this._changes = this._changes || []
        return this._changes
    }

    remove(change) {
        let ret = true
        if(change && change.remove) {
            if(change.remove.node) {
                try {
                    this.jsToolkit.removeNode(change.remove.node.id)
                } catch(e) {
                    try {
                        let node = this.jsToolkit.getNode(change.remove.node.id)
                        this.jsToolkit.removeNode(node)
                    } catch(e) {
                        console.log(`Couldn't delete node`, change.remove.node)
                        ret = false
                    }
                }
            }
            if(change.remove.edge) {
                try {
                    this.jsToolkit.removeEdge(change.remove.edge.data.id)
                } catch(e) {
                    try {
                        let edge = this.jsToolkit.getEdge(change.remove.edge.data.id)
                        this.jsToolkit.removeEdge(edge)
                    } catch(e) {
                        console.log(`Couldn't delete edge`, change.remove.edge)
                        ret = false
                    }
                }
            }
        }
        return ret
    }

    add(change) {
        let ret = true
        if(change && change.add) {
            if(change.add.node) {
                try {
                    this.jsToolkit.addNode(change.add.node)
                } catch(e) {
                    console.log(`Couldn't add node`, change.add.node)
                    ret = false
                }
            }
            if(change.add.edge) {
                try {
                    this.jsToolkit.addEdge(change.add.edge)
                } catch(e) {
                    try {
                        let target = this.jsToolkit.getNode(change.add.edge.target)
                        let source = this.jsToolkit.getNode(change.add.edge.source)
                        this.jsToolkit.connect({source:source, target:target, data: change.add.edge.data })
                    } catch(e) {
                        console.log(`Couldn't add edge`, change.add.edge)
                        ret = false
                    }
                }
            }
        }
        return ret
    }

    undo(event) {
        if(this.currentChange > 0) {
            let newChange = this.currentChange - 1
            let change = this.changes[newChange]
            if(change) {
                this._isUndoRedo = true

                let success = this.remove({ remove: change.add })
                success = success && this.add({ add: change.remove })

                if(success) {
                    this.canvas.refresh()
                    this.currentChange = newChange
                }
                this._isUndoRedo = false
            }
        }
    }

    redo(event) {
        if(this.currentChange < this.changes.length) {
            let newChange = this.currentChange
            let change = this.changes[newChange]
            if(change) {
                this._isUndoRedo = true

                let success = this.remove(change)
                success = success && this.add(change)

                if(success) {
                    this.canvas.refresh()
                    this.currentChange = newChange+1
                }
                this._isUndoRedo = false
            }
        }
    }

}

module.exports = Undo