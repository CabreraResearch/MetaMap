const riot = require('riot')
const VideoPlayer = require('../../tools/VideoPlayer')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
require('../components/quick-sidebar')
require('../actions/likert')

const html = `
<div id="training_portlet" class="portlet light">
    <div class="portlet-body" style="padding-top: 0;">
        <div class="row">
            <div id="quick_sidebar_cell" class="col-md-4">
                <div id="quick_sidebar_container"></div>
            </div>
            <div class="col-md-8">
                <div class="row">
                    <div id="training_next_step"></div>
                </div>
                <div class="row" if="{ videoTitle }" class="embed-responsive embed-responsive-16by9" style="border: 1px solid #e1e1e1 !important;">
                    <div class="portlet light">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="fa fa-youtube"></i>
                                <span class="caption-subject font-green-sharp bold uppercase">{ videoTitle }</span>
                            </div>
                        </div>
                        <div class="portlet-body form">
                            <form role="form" lpformnum="3">
                                <div class="form-group">
                                    <div class="embed-responsive embed-responsive-16by9">
                                        <div id="training_player" ></div>
                                    </div>
                                </div>
                                <div class="right">
                                    <button onclick="{ onFinishVideo }" class="btn red">Finished</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.TAGS.TRAINING, html, function(opts) {

    this.mixin(AllTags)
    this.training = {}
    this.videoTitle = null

    this.on('mount update', (event, opts) => {
        this.sidebar = this.sidebar || riot.mount(this.quick_sidebar_container, 'quick-sidebar')[0]
        if (opts) {
            this.config = opts
            if (!this.cortex) {
                this.cortex = this.getCortex(this.config.id)
                this.cortex.getData(() => {
                    this.update()
                })
            }
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, (message) => {
        if (message) {

            if (this.step) {

            }

            switch (this.cortex.massageConstant(message.action)) {
                case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                    let opts = { message: message, cortex: this.cortex }
                    this.step = riot.mount(this.training_next_step, 'likert', opts)[0]
                    this.step.update(opts)
                    break
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

    this.onFinishVideo = () => {
        this.cortex.processUserResponse({
            action: CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO,
            data: { buttonName: 'OK' }
        }, this.currentMessage)
    }

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.PLAY_VIDEO, (message) => {
        if(message && message.action_data && message.action_data.youtubeid) {
            this.videoTitle = message.action_data.title || 'A YouTube Video'
            this.currentMessage = message
            this.player = new VideoPlayer('training_player', {
                height: 390,
                width: 640,
                videoId: message.action_data.youtubeid,
                onFinish: () => {
                    this.onFinishVideo()
                }
            })
            this.update()
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.STOP_VIDEO, (message) => {
        if (message) {
            this.videoTitle = null
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


    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
        $(this.quick_sidebar_cell).addClass('hidden')
        $(this.quick_sidebar_cell).removeClass('show')
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, (id) => {
        $(this.quick_sidebar_cell).addClass('show')
        $(this.quick_sidebar_cell).removeClass('hidden')
     })

})