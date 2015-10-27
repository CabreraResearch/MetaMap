const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<button id="{id}_video_done" data-button-name="OK" class="btn btn-sm red video-done" style="{ isPlaying ? '' : 'display: none;' }" onclick="{onClick}">Done <i class="fa fa-caret-right"></i></button>
<button id="{id}_video_play" data-button-name="Play" class="btn btn-sm red video-play" style="{ isPlaying ? 'display: none;' : '' }" onclick="{onClick}">{ archived ? 'Replay' : 'Play' } <i class="fa fa-youtube-play"></i></button>
`

module.exports = riot.tag('video-button', html, function(opts) {

    this.mixin(AllTags)
    this.archived = true
    this.isPlaying = true

    const update = (o) => {
        if (o && o.if) {
            if (o.opts.cortex) {
                this.sidebar = o.opts
            } else if (o.opts.parent.cortex) {
                this.sidebar = o.opts.parent
            } else if (o.opts.parent.parent.cortex) {
                this.sidebar = o.opts.parent.parent
            }
            this.data = o.opts
            this.archived = this.data.archived
            this.isPlaying = this.sidebar.currentVideo == this.data.id || true != this.archived
        }
    }
    update(opts)

    this.value = null

    this.onClick = (e) => {
        this.sidebar.cortex.processUserResponse({
            action: CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO,
            data: _.extend({}, e.target.dataset)
        }, this.data._item)

    }

    this.on('mount update', (event, opts) => {
        update(opts)
    })

})