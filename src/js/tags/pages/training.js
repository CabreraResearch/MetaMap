const riot = require('riot')
const VideoPlayer = require('../../tools/VideoPlayer')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
require('../components/quick-sidebar')

const html = `
<div id="training_portlet" class="portlet light">
    <div class="portlet-body">
        <div class="row">
            <div id="quick_sidebar_cell" class="col-md-4">
                <div id="quick_sidebar_container"></div>
            </div>
            <div class="col-md-8">
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
        if(message && message.action_data && message.action_data.youtubeid) {
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


    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
        $(this.quick_sidebar_cell).addClass('hidden')
        $(this.quick_sidebar_cell).removeClass('show')
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, (id) => {
        $(this.quick_sidebar_cell).addClass('show')
        $(this.quick_sidebar_cell).removeClass('hidden')
     })

})