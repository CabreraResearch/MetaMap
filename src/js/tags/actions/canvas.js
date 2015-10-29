const riot = require('riot')
const $ = require('jquery')
const _ = require('lodash')

const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
const Canvas = require('../../canvas/canvas')
const Permissions = require('../../app/Permissions')
const ShareMap = require('../../actions/ShareMap')

const html = `
<div id="canvas_training_portal" style="border: 1px solid #e1e1e1 !important; border-radius: 5px;">
    <div class="portlet light">
        <div class="portlet-body">
            <div id="canvas_training_portal_diagram">

            </div>
            <div class="save">
                <a if="{ hasSave }" onclick="{ onSave }" class="btn green">Save <i class="fa fa-save"></i></a>
                <a if="{ !hasSave }" onclick="{ onShare }" class="btn blue">Share <i class="fa fa-share"></i></a>
            </div>
            <div class="finish">
                <a if="{ hasFinish }" onclick="{ onFinish }" class="btn red">Finished <i class="fa fa-check-circle"></i></a>
                <a if="{ !hasFinish }" onclick="{ onDone }" class="btn red">Finished <i class="fa fa-check-circle"></i></a>
            </div>
        </div>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS, html, function(opts) {

    this.mixin(AllTags)
    this.archived = true
    this.hasSave = true
    this.hasFinish = true

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
            this.title = this.data.action_data.title || this.cortex.training.name + ' Map ' + this.data.id

            this.hasSave = !this.data.map
            this.hasFinish = !this.archived

            if (!this.canvas) {
                let opts = {
                    attachTo: this.canvas_training_portal_diagram,
                    doAutoSave: false
                }
                let makeCanvas = (o) => {
                    if (!o.map) {
                        this.data.map = null
                        this.hasSave = true
                    }
                    this.canvas = this.canvas || new Canvas(o)
                    this.correctHeight()
                    this.update()
                }
                if (this.data.mapId) {
                    this.MetaMap.MetaFire.getData(`maps/list/${this.data.mapId}`).then((info) => {
                        if (info) {
                            this.MetaMap.MetaFire.getData(`maps/data/${this.data.mapId}`).then((map) => {
                                if (map) {
                                    this.data.map = _.extend(map, info)
                                    opts = _.extend(opts, {
                                        map: this.data.map,
                                        mapId: this.data.mapId,
                                        doAutoSave: true
                                    })
                                    makeCanvas(opts)
                                } else {
                                    makeCanvas(opts)
                                }
                            })
                        } else {
                            makeCanvas(opts)
                        }
                    })

                } else {
                    makeCanvas(opts)
                }

            }
        }
    }
    update(opts)

    this.on('update', (opts) => {
        update(opts)
    })

    this.onSave = () => {
        if (!this.data.map) {
            let newMap = require('../../actions/NewMap')
            this.hasSave = false
            let map = this.canvas.exportData()
            let nuMap = newMap.createMap({ title: this.title, map: map })
            this.data.map = nuMap.map
            this.data.mapId = nuMap.mapId
            this.cortex.processUserResponse({
                action: CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_SAVE,
                is_ignored: true,
                data: {
                    mapId: this.data.mapId,
                    map: this.data.map,
                    title: this.title
                }
            })
            this.canvas.reInit({
                map: this.data.map,
                mapId: this.data.mapId,
                doAutoSave: true
            })
            this.update()
        }
    }

    this.onShare = () => {
        if (this.data.map) {
            ShareMap.act({
                map: this.data.map,
                onClose: (shared_with) => {
                    if (!_.isEmpty(shared_with)) {
                        this.cortex.processUserResponse({
                            action: CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_SHARE,
                            is_ignored: true,
                            data: {
                                shared_with: shared_with
                            }
                        })
                    }
                }
            });
        }
    }

    this.onDone = () => {

    }

    this.onFinish = () => {
        let map = this.canvas.exportData()
        this.cortex.processUserResponse({
            action: CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_FINISH,
            data: {
                map: map
            }
        })
    }

})