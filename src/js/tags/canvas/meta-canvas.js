const riot = require('riot')
const Canvas = require('../../canvas/Canvas')
const CONSTANTS = require('../../constants/constants')
require('./node')
const Permissions = require('../../app/Permissions')
const AllTags = require('../mixins/all-tags')

const html = `
<div class="portlet light jtk-demo-main" style="padding: 0; border-radius: 5px; border: 1px solid rgb(225, 225, 225);">
    <div class="jtk-demo-canvas canvas-wide" id="diagram">

    </div>
</div>
`

module.exports = riot.tag('meta-canvas', html, function(opts) {

    this.mixin(AllTags)

    this.mapId = null
    this.canvas = null

    this.buildCanvas = (map) => {
        if (!this.canvas) {
            $(this.diagram).empty()

            this.MetaMap.MetaFire.getData(`${CONSTANTS.ROUTES.MAPS_LIST}/${this.mapId}`).then((mapInfo) => {
                this.map = _.extend(map, mapInfo)
                this.permissions = new Permissions(this.map)
                this.canvas = new Canvas({
                    map: this.map,
                    mapId: this.mapId,
                    permissions: this.permissions,
                    attachTo: this.diagram,
                    doAutoSave: true
                })
                this.update()
            })
        }
        window.NProgress.done()
    }

    this.build = (opts) => {
        if (opts.id != this.mapId) {
            this.canvas = null
            if (this.mapId) {
                this.MetaMap.MetaFire.off(`maps/data/${this.mapId}`)
            }
            this.mapId = opts.id
            NProgress.start()

            this.MetaMap.MetaFire.on(`maps/data/${opts.id}`, this.buildCanvas)
            this.MetaMap.Eventer.forget(CONSTANTS.EVENTS.MAP, this.build)
        }
    }

    this.MetaMap.Eventer.every(CONSTANTS.EVENTS.MAP, this.build)

    this.correctHeight = () => {
        $(this.diagram).css({
            height: window.innerHeight - 120 + 'px'
        })
    }

    this.on('update', () => {
        this.correctHeight()
    })

    $(window).resize(() => {
        this.correctHeight()
    })
})