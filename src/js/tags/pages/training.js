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
            switch (this.cortex.massageConstant(message.action)) {
                case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                    let opts = { message: message, cortex: this.cortex }
                    this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT, opts)[0]
                    this.step.update(opts)
                    break
                case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:

                    break
                default:
                    if (this.step) {
                        this.step.unmount()
                        this.step = null
                    }
                    break
            }
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.PLAY_VIDEO, (message) => {
        if (message) {
            let opts = { message: message, cortex: this.cortex }
            this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO, opts)[0]
            this.step.update(opts)
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.STOP_VIDEO, (message) => {
        if (message) {
            this.step.unmount()
            this.step = null
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