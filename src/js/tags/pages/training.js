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
            <div id="quick_sidebar_cell" class="col-md-4 col-lg-3">
                <div id="quick_sidebar_container"></div>
            </div>
            <div class="col-md-8 col-lg-9">
                <div class="row">
                    <div id="canvas_training_default" style="border: 1px solid #e1e1e1 !important; border-radius: 5px;">
                        <div id="training_next_step_parent" class="portlet light">
                            <div id="training_next_step"></div>
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

    this.correctHeight = () => {
        $(this.training_portlet).css({
            height: window.innerHeight - 120 + 'px'
        })
        $(this.canvas_training_default).css({
            height: window.innerHeight - 140 + 'px'
        })
    }

    $(window).resize(() => {
        this.correctHeight()
    })

    this.guaranteeStep = () => {
        let _step = document.getElementById('training_next_step')
        if (!_step) {
            let _parent = document.getElementById('training_next_step_parent')
            _parent.innerHTML = '<div id="training_next_step"></div>'
            _step = document.getElementById('training_next_step')
            this.training_next_step = _step
        }
        return _step
    }

    this.on('mount update', (event, o) => {
        this.sidebar = this.sidebar || riot.mount(this.quick_sidebar_container, 'quick-sidebar')[0]
        if (o) {
            this.config = o
            if (!this.cortex) {
                this.cortex = this.getCortex(this.config.id)
                this.cortex.getData().then(() => {
                    this.update()
                })
            }
        }
        this.correctHeight()
    })

    this.unmountStep = () => {
        if (this.step) {
            this.step.unmount()
            this.step = null
        }
        this.guaranteeStep()
    }

    const buildVideo = (o) => {
        if (o) {
            this.guaranteeStep()
            this.update()
            this.correctHeight()
            this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO, o)[0]
            this.step.update(o)
        }
    }

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.BEFORE_TRAINING_NEXT_STEP, (message) => {
        if (message) {
            this.update()
            if (this.step) {
                this.step.update(message)
            }
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.TRAINING_NEXT_STEP, (message) => {
        if (message) {
            _.delay(() => {
                this.guaranteeStep()
                this.update()
                this.correctHeight()
                let o = { message: message, cortex: this.cortex }
                switch (message.action) {
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT, o)[0]
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:
                        buildVideo(o)
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS, o)[0]
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE, o)[0]
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER, o)[0]
                        break
                    default:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.DEFAULT, o)[0]
                        break
                }
                if (this.step) {
                    this.step.update(o)
                }
            }, 1500)
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.PLAY_VIDEO, (message) => {
        let o = { message: message, cortex: this.cortex }
        buildVideo(o)
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.STOP_VIDEO, (message) => {
        if (message) {
            this.unmountStep()
        }
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