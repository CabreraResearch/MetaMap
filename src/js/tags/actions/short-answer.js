const riot = require('riot')
const $ = require('jquery')
const _ = require('lodash')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<div class="portlet-body">
    <form role="form">
        <div class="form-body">
            <div class="form-group">
                <h2>{question}</h2>
                <textarea if="{ true != archived }" id="short_answer_response" type="text" class="form-control input-circle" style="margin: 0px -1px 0px 0px; height: 115px; width: 100%;"></textarea>
            </div>
        </div>
    </form>
    <div if="{ hasFinish }" class="finish">
        <a onclick="{ onFinish }" class="btn red">Finished <i class="fa fa-check-circle"></i></a>
    </div>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER, html, function(opts) {

    this.mixin(AllTags)
    this.archived = true
    this.hasFinish = true

    const update = (o) => {
        if(o && o.message && o.message.action_data) {
            let message = o.message
            if (o.cortex) {
                this.cortex = o.cortex
            }
            this.data = o.message
            this.archived = this.data.archived
            this.hasFinish = !this.archived
            this.question = this.data.action_data.question
        }
    }
    update(opts)

    this.on('update', (opts) => {
        update(opts)
    })

    this.onFinish = () => {
        let answer = this.short_answer_response.value
        if(!answer || answer.length == 0) {
            alert('An answer is required!')
        } else {
            this.cortex.processUserResponse({
                action: CONSTANTS.CORTEX.RESPONSE_TYPE.SHORT_ANSWER_FINISH,
                data: {
                    answer: this.short_answer_response.innerHTML,
                    message: this.short_answer_response.innerHTML
                }
            })
        }
    }
})