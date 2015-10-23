const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<div class="row">
    <div class="col-xs-6"></div>
    <div class="col-xs-6"></div>
    <div class="col-xs-6"></div>
    <div class="col-xs-6"></div>
</div>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE, html, function(opts) {

    this.mixin(AllTags)

    const update = (o) => {
        if (o) {
            this.range = []
            this.range.length = o.length || 10
            this.left = o.left
            this.right = o.right
            this.name = o.name
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