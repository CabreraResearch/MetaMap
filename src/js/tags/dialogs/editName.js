const riot = require('riot');
const $ = require('jquery')
const _ = require('lodash')

const CONSTANTS = require('../../constants/constants')
const AllTags = require('../mixins/all-tags')

const html = `
<div id="edit_text_modal" class="modal fade" style="position: absolute; top: {top}; left: {left}">
    <div class="modal-dialog  modal-sm">
        <div class="modal-content">
            <div class="modal-body">
                <form role="form">
                    <div class="form-body">
                        <div class="form-group">
                            <label>Edit label:</label>
                            <textarea id="node_label" class="form-control">{ labelText }</textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag(CONSTANTS.TAGS.EDIT_LABEL, html, function (opts) {

    this.mixin(AllTags)

    this.data = [];

    this.labelText = ''

    this.onDone = (e, opts) => {
        this.opts.onDone(this.node_label.innerText)
    }

    this.on('update', (opts) => {
        if (opts) {
            _.extend(this.opts, opts)
            this.left = opts.node.data.left+'px'
            this.top = opts.node.data.top+'px'
            this.labelText = opts.label.innerText
            if (!this._onClose) {
                this._onClose = {}
                $(this.node_label).on('input propertychange', () => {
                    this.labelText = this.node_label.value
                    opts.onDone(this.node_label.value)
                })

                $(this.edit_text_modal).on('hide.bs.modal', () => {
                    this.labelText = this.node_label.value
                    opts.onDone(this.node_label.value)
                    $(this.edit_text_modal).empty()
                })
            }
        }
    })

    this.on('mount', (e, opts) => {
        $(this.edit_text_modal).modal('show')
    })

    this.on('unmount', () => {
        $(this.node_label).off('input propertychange')
        $(this.edit_text_modal).off('hide.bs.modal')
    })

});