const riot = require('riot')
const VideoPlayer = require('../../tools/VideoPlayer')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<div id="training_portlet" class="portlet light">
    <div class="portlet-body">
        <div class="row margin-bottom-30">
            <div class="col-md-8 col-md-offset-4">
                <div class="embed-responsive embed-responsive-16by9">
                    <div id="training_player" ></div>
                </div>
            </div>
        </div>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.TAGS.TRAINING, html, function(opts) {

    this.mixin(AllTags)
    this.training = {}

    this.on('mount update', (event, opts) => {
        if (opts) {
            this.config = opts
            if (!this.cortex) {
                this.cortex = this.getCortex(this.config.id)
                this.cortex.getData(() => {
                    this.update()
                })
            }
            //
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, (message) => {
        if(message) {
            switch (this.cortex.massageConstant(message.action)) {
                case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:

                    break
                default:
                    if (this.player) {
                        this.player.destroy()
                    }
                    break
            }
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.PLAY_VIDEO, (message) => {
        if(message) {
            this.player = new VideoPlayer('training_player', {
                height: 390,
                width: 640,
                videoId: message.action_data.youtubeid,
                onFinish: () => {
                    this.cortex.processUserResponse({
                        action: CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO,
                        data: { buttonName: 'OK' }
                    }, message)
                }
            })
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.STOP_VIDEO, (message) => {
        if(message) {
            if (this.player) {
                this.player.destroy()
            }
        }
    })

    this.correctHeight = () => {
        $(this.training_portlet).css({
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