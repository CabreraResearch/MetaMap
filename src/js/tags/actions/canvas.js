const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
const Canvas = require('../../canvas/canvas')
const Permissions = require('../../app/Permissions')

const html = `
<div id="canvas_training_portal" style="border: 1px solid #e1e1e1 !important; border-radius: 5px;">
    <div class="portlet light">
        <div class="portlet-body">
            <div id="canvas_training_portal_diagram">

            </div>
            <div class="right">
                <a onclick="{ onSave }" class="btn green">Save <i class="fa fa-save"></i></a>
                <a onclick="{ onShare }" class="btn blue">Share <i class="fa fa-share"></i></a>
                <a onclick="{ onFinish }" class="btn red">Finished <i class="fa fa-check-circle"></i></a>
            </div>
        </div>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS, html, function(opts) {

    this.mixin(AllTags)
    this.archived = true

    this.correctHeight = () => {
        $(this.canvas_training_portal).css({
            height: window.innerHeight - 140 + 'px'
        })
        $(this.canvas_training_portal_diagram).css({
            height: window.innerHeight - 205 + 'px'
        })
    }

    $(window).resize(() => {
        this.correctHeight()
    })

    const update = (o) => {
        if(opts && opts.message) {
            let message = opts.message
            if (opts.cortex) {
                this.cortex = opts.cortex
            }
            this.data = message
            this.archived = this.data.archived
            if (!this.canvas) {
                this.canvas = new Canvas({
                    attachTo: this.canvas_training_portal_diagram,
                    permissions: new Permissions({ isTraining: true }),
                    onSave: (data) => {  }
                })
                this.canvas.init()
                this.correctHeight()
            }
        }
    }
    update(opts)

    this.on('update', (opts) => {
        update(opts)
    })

})