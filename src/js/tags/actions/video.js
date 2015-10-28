const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
const VideoPlayer = require('../../tools/VideoPlayer')

const html = `
<div id="video_training_portal" style="border: 1px solid #e1e1e1 !important; border-radius: 5px;">
    <div class="portlet light">
        <div class="portlet-title">
            <div class="caption">
                <i class="fa fa-youtube"></i>
                <span class="caption-subject font-green-sharp bold uppercase">{ videoTitle }</span>
            </div>
        </div>
        <div class="portlet-body">
            <div class="form-group">
                <div class="embed-responsive embed-responsive-16by9">
                    <div id="training_player" ></div>
                </div>
            </div>
            <div class="right">
                <a onclick="{ onFinishVideo }" class="btn red">Finished <i class="fa fa-check-circle"></i></a>
            </div>
        </div>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO, html, function(opts) {

    this.mixin(AllTags)
    this.archived = true
    this.isPlaying = true
    this.player = null

    this.correctHeight = () => {
        $(this.video_training_portal).css({
            height: window.innerHeight - 140 + 'px'
        })
    }

    $(window).resize(() => {
        this.correctHeight()
    })

    const update = (opts) => {
        if(opts && opts.message && opts.message.action_data && opts.message.action_data.youtubeid) {
            let message = opts.message
            if (opts.cortex) {
                this.cortex = opts.cortex
            }
            this.data = message
            this.videoTitle = message.action_data.title || 'A YouTube Video'
            this.currentMessage = message
            this.player = new VideoPlayer('training_player', {
                height: 390,
                width: 640,
                videoId: opts.message.action_data.youtubeid,
                onFinish: () => {
                    this.onFinishVideo()
                }
            })
            this.correctHeight()
            this.archived = this.data.archived
            this.isPlaying = this.cortex.currentVideo == this.id || true != this.archived
            this.update()
        }
    }
    update(opts)

    this.onFinishVideo = () => {
        this.cortex.processUserResponse({
            action: CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO,
            data: { buttonName: 'Finished' }
        }, this.currentMessage)
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