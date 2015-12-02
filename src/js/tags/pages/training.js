const riot = require('riot')
const _ = require('lodash')

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

    this.on('update', (o) => {
        if (o) {
            this.config = o
            if (!this.cortex) {
                this.cortex = this.getCortex(this.config.id, this)
                this.sidebar = this.sidebar || riot.mount(this.quick_sidebar_container, 'quick-sidebar')[0]
                this.cortex.getData().then(() => {
                    this.update()
                    this.sidebar.update()
                })
                this.sidebar.setCortex({cortex: this.cortex})
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
            this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO)[0]
            this.step.update(o)
        }
    }

    this.doBeforeNextStep = (message) => {
        if (message) {
            this.update()
            if (this.step) {
                if (message.action == CONSTANTS.CORTEX.RESPONSE_TYPE.RESTART) {
                    this.unmountStep()
                } else {
                    this.step.update(message)
                }
            }
        }
    }

    this.doNextStep = (message) => {
        if (message) {
            _.delay(() => {
                if (message.action != CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_CONTINUOUS && message.action != CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_CONTINUOUS_FINISH) {
                    this.unmountStep()
                } else {
                    this.guaranteeStep()
                }
                this.update()
                this.correctHeight()
                let o = { message: message, cortex: this.cortex }
                switch (message.action) {
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT)[0]
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.VIDEO:
                        buildVideo(o)
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS)[0]
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS_CONTINUOUS:
                        if (!this.step) {
                            this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.CANVAS)[0]
                        }
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE)[0]
                        break
                    case CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER)[0]
                        break
                    default:
                        this.step = riot.mount(this.training_next_step, CONSTANTS.CORTEX.RESPONSE_TYPE.DEFAULT)[0]
                        break
                }
                if (this.step) {
                    this.step.update(o)
                }
            }, 1500)
        }
    }

    this.playVideo = (message) => {
        let o = { message: message, cortex: this.cortex }
        this.sidebar.playVideo(message)
        buildVideo(o)
    }

    this.stopVideo = (message) => {
        if (message) {
            this.sidebar.stopVideo(message)
            this.unmountStep()
        }
    }
})