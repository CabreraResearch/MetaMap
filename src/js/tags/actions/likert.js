const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<div if="{range}" class="input-group">
    <div>On a scale of 1 to {range.length}, where 1 is <em>{left}</em> and {range.length} is <em>{right}</em>, how would you rate this?</div>
    <ul if="{!archived}" class="likert">
        <li each="{ val, i in range }">
            <input onclick="{ parent.onClick }" type="radio" name="{name}" value="{i+1}" /><p style="text-align: center;">{i+1}</p>
        </li>
    </ul>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT, html, function(opts) {

    this.mixin(AllTags)

    this.archived = true

    const update = (o) => {
        if (o && o.if) {
            if (o.opts.cortex) {
                this.sidebar = o.opts
            } else if (o.opts.parent.cortex) {
                this.sidebar = o.opts.parent
            } else if (o.opts.parent.parent.cortex) {
                this.sidebar = o.opts.parent.parent
            }
            this.data = o.opts
            this.archived = this.data.archived
            if (!this.archived && this.data.action_data) {
                this.range = []
                this.range.length = this.data.action_data.length || 10
                this.left = this.data.action_data.left
                this.right = this.data.action_data.right
                this.name = this.data.action_data.name
            }
        }
    }
    update(opts)

    this.value = null

    this.onClick = (e) => {
        this.value = e.target.value
        let per = (this.value / this.range.length) * 100
        let message = {
            message: `${this.value} out of ${this.range.length}`,
            answer: this.value,
            previous_action: CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT,
            request_feedback: (per < 80)
        }

        this.sidebar.cortex.processUserResponse({
            action: CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT,
            data: message
        }, this.data._item)
    }

    this.on('mount update', (event, opts) => {
        update(opts)
    })

})