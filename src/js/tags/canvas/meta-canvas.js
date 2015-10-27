const riot = require('riot')
const NProgress = window.NProgress
const Canvas = require('../../canvas/canvas')
const CONSTANTS = require('../../constants/constants')
require('./node')
const Permissions = require('../../app/Permissions')
const AllTags = require('../mixins/all-tags')

const html = `
<div class="portlet light jtk-demo-main" style="padding: 0 ">
    <div class="jtk-demo-canvas canvas-wide" id="diagram">

    </div>
</div>
`

module.exports = riot.tag('meta-canvas', html, function(opts) {

    this.mixin(AllTags)

    this.mapId = null
    this.canvas = null

    this.throttleSave = _.throttle((data) => {
        if (this.permissions.canEdit()) {
            //KLUDGE: looks like the exportData now includes invalid property values (Infinity) and types (methods)
            //Parsing to/from string fixes for now
            data = JSON.parse(JSON.stringify(data))
            let postData = {
                data: data,
                changed_by: {
                    userId: this.MetaMap.User.userId
                }
            }
            this.MetaMap.MetaFire.setDataInTransaction(postData, `maps/data/${this.mapId}`)
            this.MetaMap.Integrations.sendEvent(this.mapId, 'autosave', this.mapInfo.name)
        }
    }, 500)


    this.buildCanvas = (map) => {
        if (!this.canvas) {
            $(this.diagram).empty()

            let ready = this.MetaMap.MetaFire.getData(`${CONSTANTS.ROUTES.MAPS_LIST}/${this.mapId}`).then((mapInfo) => {
                this.mapInfo = mapInfo
                this.permissions = new Permissions(mapInfo)
            })
            ready.then(() => {
                this.canvas = new Canvas({
                    map: map,
                    mapId: this.mapId,
                    mapInfo: this.mapInfo,
                    permissions: this.permissions,
                    attachTo: this.diagram,
                    onSave: (data) => { this.throttleSave(data) }
                })
                this.canvas.init()

                this.update()
            })
        } else {
            if (map.changed_by != this.MetaMap.User.userKey) {
                this.canvas.init()
            }
        }
        NProgress.done()
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