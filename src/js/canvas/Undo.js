const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit
const jsPlumbUtil = window.jsPlumbUtil

const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')

class Undo extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        this.jsToolkit.bind('nodeAdded', (node) => {
            this.addChange({ add: {node: node} })
        })
        this.jsToolkit.bind('nodeRemoved', (node) => {
            this.addChange({remove: {node: node} })
        })
        this.jsToolkit.bind('edgeAdded', (edge) => {
            this.addChange({add: {edge: edge} })
        })
        this.jsToolkit.bind('edgeRemoved', (edge) => {
            this.addChange({remove: {edge: edge} })
        })

        jsPlumb.on(document, 'keydown', (event) => {
            if (event.ctrlKey) {
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
        if(change && change.remove) {
            if(change.remove.node) {
                try {
                    this.jsToolkit.removeNode(change.remove.node.node.id)
                } catch(e) {
                    try {
                        this.jsToolkit.removeNode(change.remove.node.node)
                    } catch(e) {
                        console.log(`Couldn't delete node`, change.remove.node)
                    }
                }
            }
            if(change.remove.edge) {
                try {
                    this.jsToolkit.removeEdge(change.edge.edge.data.id)
                } catch(e) {
                    try {
                        this.jsToolkit.removeEdge(change.edge.edge)
                    } catch(e) {
                        console.log(`Couldn't delete edge`, change.remove.edge)
                    }

                }
            }
        }
    }

    add(change) {
        if(change && change.add) {
            if(change.add.node) {
                try {
                    this.jsToolkit.addNode(change.add.node.node.data)
                } catch(e) {
                    console.log(`Couldn't delete node`, change.add.node)
                }
            }
            if(change.add.edge) {
                try {
                    this.jsToolkit.addEdge(change.edge.edge.data)
                } catch(e) {
                    console.log(`Couldn't delete edge`, change.add.edge)
                }
            }
        }
    }

    undo(event) {
        if(this.currentChange > 0) {
            let newChange = this.currentChange - 1
            let change = this.changes[newChange]
            if(change) {
                this._isUndoRedo = true

                this.remove({ remove: change.add })
                this.add({ add: change.remove })

                this.canvas.refresh()
                this.currentChange = newChange
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

                this.remove(change)
                this.add(change)

                this.canvas.refresh()
                this.currentChange = newChange+1
                this._isUndoRedo = false
            }
        }
    }

}

module.exports = Undo