const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<button id="{id}_video_play" data-button-name="Play" class="btn btn-sm red video-play" style="{ isPlaying ? 'display: none;' : '' }" onclick="{onClick}">{ archived ? 'Replay' : 'Play' } <i class="fa fa-youtube-play"></i></button>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO_BUTTON, html, function(opts) {

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
            this.data = {
                action: o.opts.action,
                action_data: o.opts.action_data,
                archived: o.opts.archived,
                id: o.opts.id
            }
            this.archived = o.opts.archived
            this.isPlaying = this.sidebar.currentVideo == o.opts.id || true != this.archived
        }
    }
    update(opts)

    this.value = null

    this.onClick = (e) => {
        this.sidebar.cortex.processUserResponse(this.data)
    }

    this.on('mount update', (event, opts) => {
        update(opts)
    })

})