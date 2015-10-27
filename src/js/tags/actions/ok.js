const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')

const html = `
<a if="{!archived}" data-button-name="OK" class="btn btn-sm red" onclick="{onClick}">OK <i class="fa fa-caret-right"></i></a>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.OK, html, function(opts) {

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
        }
    }
    update(opts)

    this.value = null

    this.onClick = (e) => {
        this.sidebar.cortex.processUserResponse({
            action: CONSTANTS.CORTEX.RESPONSE_TYPE.OK,
            data: _.extend({}, e.target.dataset)
        }, this.data._item)

    }

    this.on('mount update', (event, opts) => {
        update(opts)
    })

})