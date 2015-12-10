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

    this.close = _.once((e, opts) => {
        this.labelText = this.node_label.value
        this.opts.onDone(this.node_label.value)
        $(this.edit_text_modal).modal('hide')
        $(this.edit_text_modal).empty()
    })

    this.on('update', (opts) => {
        if (opts) {
            _.extend(this.opts, opts)
            this.left = opts.node.data.left+'px'
            this.top = (opts.node.data.top-100)+'px'
            if(opts.node.data.left < 300) {
                this.left = 300
            }
            if(opts.node.data.top < 200) {
                this.top = 200
            }
            if(opts.node.data.left > (window.innerWidth-400)) {
                this.left = window.innerWidth - 500 +'px'
            }
            if(opts.node.data.top > (window.innerHeight-300)) {
                this.top = window.innerHeight - 400 +'px'
            }
            this.labelText = opts.label.innerText
            if (!this._onClose) {
                this._onClose = {}
                $(this.node_label).on('input propertychange', () => {
                    this.labelText = this.node_label.value
                    opts.onDone(this.node_label.value)
                })

                $(this.edit_text_modal).on('shown.bs.modal', () => {
                    this.node_label.focus()
                })

                $(this.edit_text_modal).on('hide.bs.modal', () => {
                    this.close()
                })
            }
        }
    })

    this.onClickOut = (e) => {
        if(e.target.className == 'modal-backdrop fade in') {
            this.close()
        }
    }

    this.on('mount', (e, opts) => {
        $(this.edit_text_modal).modal('show')
        $(document).on('click', this.onClickOut)
    })

    this.on('unmount', () => {
        $(this.node_label).off('input propertychange')
        $(this.edit_text_modal).off('hide.bs.modal')
        $(document).off('click', this.onClickOut)
    })

});