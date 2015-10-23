const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<div if="{range}" class="input-group">
    <div>On a scale of 1 to {range.length}, where 1 is <em>{left}</em> and {range.length} is <em>{right}</em>, how would you rate this</div>
    <ul class="likert">
        <li each="{ val, i in range }">
            <input onclick="{ parent.onClick }" type="radio" name="{name}" value="{i}" /><p style="text-align: center;">{i}</p>
        </li>
    </ul>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT, html, function(opts) {

    this.mixin(AllTags)

    const update = (o) => {
        if (o && o.Action == 'Likert' && o['Action Data']) {
            this.range = []
            this.range.length = o['Action Data'].length || 10
            this.left = o['Action Data'].left
            this.right = o['Action Data'].right
            this.name = o['Action Data'].name
        }
    }
    update(opts)

    this.value = null

    this.onClick = (e) => {
        this.value = e.target.value
    }

    this.on('mount update', (event, opts) => {
        update(opts)
    })

})