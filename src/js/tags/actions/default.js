const riot = require('riot')
const $ = require('jquery')
const _ = require('lodash')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<div class="portlet-body">
    <div if="{ hasFinish }" id="epilepsy_gif" style="text-align: center;">
        <img src="src/images/arrow_gray_blue.gif"></img>
    </div>
    <div if="{ true != archived }" class="finish">
        <a if="{ hasFinish }" onclick="{ onFinish }" class="btn red">{_.capitalize(data.action)} <i class="fa fa-check-circle"></i></a>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.DEFAULT, html, function(opts) {

    this.mixin(AllTags)
    this.archived = true
    this.hasFinish = true

    this.stopEpilepsy = _.once(() => {
        _.delay(() => {
            $(this.epilepsy_gif).hide()
        }, 10000)
    })

    const update = (o) => {
        if(o && o.message) {
            let message = o.message
            if (o.cortex) {
                this.cortex = o.cortex
            }
            this.data = message
            this.archived = this.data.archived
            this.hasFinish = !this.archived
            switch (this.data.action) {
                case CONSTANTS.CORTEX.RESPONSE_TYPE.OK:
                case CONSTANTS.CORTEX.RESPONSE_TYPE.MORE:

                    break
                default:
                    this.hasFinish = false
                    break
            }
        }
        this.stopEpilepsy()
    }
    update(opts)

    this.on('update', (opts) => {
        update(opts)
    })

    this.onFinish = () => {
        this.cortex.processUserResponse({
            action: this.data.action,
            data: { buttonName: 'Finished' }
        })
    }
})