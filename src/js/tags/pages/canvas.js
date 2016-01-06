const riot = require('riot')
const _ = require('lodash')

const Canvas = require('../../canvas/Canvas')
const CONSTANTS = require('../../constants/constants')
const Permissions = require('../../app/Permissions')
const AllTags = require('../mixins/all-tags')

const html = `
<div class="portlet light jtk-demo-main" style="padding: 0; border-radius: 5px; border: 1px solid rgb(225, 225, 225);">
    <div class="jtk-demo-canvas canvas-wide" id="diagram">

    </div>
    <div class="zoom-widget" id="zoom-widget"></div>
</div>
`

module.exports = riot.tag('canvas', html, function(opts) {

    this.mixin(AllTags)

    this.mapId = null
    this.canvas = null

    this.buildCanvas = (map) => {
        if (!this.canvas) {
            $(this.diagram).empty()

            this.Homunculus.MetaFire.getData(`${CONSTANTS.ROUTES.MAPS_LIST}/${this.mapId}`).then((mapInfo) => {
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
        } else {
            //If someone else (another user or the same user in a different browser) edits the map, reload it
            if(map && map.changed_by && ((map.changed_by.userId != this.Homunculus.User.userId || map.changed_by.userKey != this.Homunculus.User.userKey ) && map.changed_by.changeId != this.map.changed_by.changeId)) {
                this.map = map
                this.canvas.reloadData(map.data)
                this.Homunculus.MetaFire.off(`maps/data/${this.mapId}`)
                _.delay(() => {
                    this.Homunculus.MetaFire.on(`maps/data/${this.mapId}`, this.buildCanvas)
                },1000)
            }
        }
        window.NProgress.done()
    }

    this.build = (opts) => {
        if (opts.id != this.mapId) {
            this.canvas = null
            if (this.mapId) {
                this.Homunculus.MetaFire.off(`maps/data/${this.mapId}`)
            }
            this.mapId = opts.id
            NProgress.start()

            this.Homunculus.MetaFire.on(`maps/data/${this.mapId}`, this.buildCanvas)
            this.Homunculus.Eventer.forget(CONSTANTS.EVENTS.MAP, this.build)
        }
    }

    this.Homunculus.Eventer.every(CONSTANTS.EVENTS.MAP, this.build)

    this.correctHeight = () => {
        $(this.diagram).css({
            height: window.innerHeight - 120 + 'px'
        })
    }

    this.on('update', () => {
        this.correctHeight()
    })

    this.on('unmount', () => {
        this.Homunculus.MetaFire.off(`maps/data/${this.mapId}`, 'value', this.buildCanvas)
    })

    $(window).resize(() => {
        this.correctHeight()
    })
})