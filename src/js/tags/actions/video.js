const riot = require('riot')
const $ = require('jquery')
const _ = require('lodash')

const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
const VideoPlayer = require('../../tools/VideoPlayer')

const html = `
<div class="portlet-title">
    <div class="caption">
        <i class="fa fa-youtube"></i>
        <span class="caption-subject font-green-sharp bold uppercase">{ videoTitle }</span>
    </div>
</div>
<div class="portlet-body">
    <div class="form-group">
        <div class="">
            <div id="training_player" ></div>
        </div>
    </div>
    <div class="finish">
        <a onclick="{ onFinishVideo }" class="btn red">Finished <i class="fa fa-check-circle"></i></a>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO, html, function(opts) {

    this.mixin(AllTags)
    this.archived = true
    this.isPlaying = true
    this.player = null

    this.correctHeight = () => {
        let root = $(document.getElementById('canvas_training_default'))
        let height = root.height()-140
        let width = root.width() - 40
        let newWidth = height * 1.778
        let newHeight = height
        if (newWidth > width) {
            newHeight = width / 1.778
            newWidth = width
        }

        let video = $('#training_player')
        video.data('aspectRatio', '1.778')
            .removeAttr('height')
            .removeAttr('width')
            .height(newHeight)
            .width(newWidth)
    }

    $(window).resize(() => {
        this.correctHeight()
    })

    const update = (o) => {
        if(o && o.message && o.message.action_data && o.message.action_data.youtubeid) {
            let message = o.message
            if (o.cortex) {
                this.cortex = o.cortex
            }
            this.data = message
            this.videoTitle = message.action_data.title || 'A YouTube Video'
            this.currentMessage = message
            this.player = new VideoPlayer('training_player', {
                videoId: o.message.action_data.youtubeid,
                onFinish: () => {
                    this.onFinishVideo()
                }
            })
            this.correctHeight()
            this.archived = this.data.archived
            this.isPlaying = this.cortex.currentVideo == this.id || true != this.archived
            this.update()
        }
        this.correctHeight()
    }
    update(opts)

    this.onFinishVideo = () => {
        this.cortex.processUserResponse({
            action: CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO,
            data: { buttonName: 'Finished' }
        })
        this.videoTitle = null
        this.destroy()
    }

    this.destroy = () => {
        if (this.player) {
            this.player.destroy()
        }
    }

    this.on('mount update', (opts) => {
        update(opts)
    })

    this.on('unmount', () => {
        this.destroy()
    })
})