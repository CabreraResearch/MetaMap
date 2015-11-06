const _CanvasBase = require('./_CanvasBase')

class Node extends _CanvasBase {

    constructor(canvas) {
        super(canvas)
    }

    //
    // dummy for a new node.
    //
    getNewNode(opts) {
        let ret = {
            w:this.canvas.nodeSize,
            h:this.canvas.nodeSize,
            label:'idea',
            type: 'idea',
            children: [],
            labelPosition: [],
            cssClass: ''
        }
        _.extend(ret, opts)
        return ret
    }

    getView() {
        return {
            all: {
                events: {
                    tap: (obj) => {
                        this.canvas.clearSelection(obj)
                    },
                    mouseover: (obj) => {
                        this.canvas.rndrr.hideRDots();
                    },
                    contextmenu: (node, port, el, e) => {
                        if (node && node.el) {
                            $.contextMenu({
                                selector: `#${node.el.id}`,
                                items: {
                                    copy: {
                                        name: 'Copy',
                                        callback: function(key, opt){
                                            alert('Clicked on ' + key)
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            },
            default: {
                parent: 'all',
                template:'tmplNode'
            },
            idea: {
                parent: 'default'
            },
            'r-thing': {
                parent: 'idea'
            }
        }
    }
}

module.exports = Node