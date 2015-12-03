const riot = require('riot')
const $ = require('jquery')
const _ = require('lodash')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<div class="portlet-body">
    <img if="{image}" class="img-responsive" alt="Responsive image" src="{image}"></img>
    <h1 if="{text}" style="text-align: center;">{text}</h1>
    <div if="{ true != archived }" class="finish">
        <a if="{ hasFinish }" onclick="{ onFinish }" class="btn red">{ getAction(data.action) } <i class="fa fa-check-circle"></i></a>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.DEFAULT, html, function(opts) {

    this.mixin(AllTags)
    this.archived = true
    this.hasFinish = true
    this.image = null
    this.text = null

    const update = (o) => {
        if(o && o.message) {
            let message = o.message
            if (o.cortex) {
                this.cortex = o.cortex
            }
            this.data = message
            this.archived = this.data.archived
            this.hasFinish = !this.archived

            this.image = this.data.image
            this.text = this.data.text

            switch (this.data.action) {
                case CONSTANTS.CORTEX.RESPONSE_TYPE.OK:
                case CONSTANTS.CORTEX.RESPONSE_TYPE.MORE:

                    break
                default:
                    this.hasFinish = false
                    break
            }
        }
    }
    update(opts)

    this.on('update', (opts) => {
        update(opts)
    })

    this.getAction = (action) => {
        return _.capitalize(action)
    }

    this.onFinish = () => {
        this.cortex.processUserResponse({
            action: this.data.action,
            data: { buttonName: 'Finished' }
        })
    }
})