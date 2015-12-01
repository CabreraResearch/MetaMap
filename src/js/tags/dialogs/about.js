const riot = require('riot');
const $ = require('jquery')
const _ = require('lodash')

const CONSTANTS = require('../../constants/constants')
const AllTags = require('../mixins/all-tags')

const html = `
<div id="about" class="modal fade">
    <div class="modal-dialog  modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">About MetaMap</h4>
            </div>
            <div class="modal-body">
                <p>Version: {version}</p>
                <p>Copyright (2015) Cabrera Research Lab</p>
            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag(CONSTANTS.TAGS.ABOUT, html, function (opts) {

    this.mixin(AllTags)

    this.data = [];
    this.version = ''
    this.copyright = ''

    this.on('update', (opts) => {
        if (opts) {
            _.extend(this.opts, opts)
            this.version = opts.version
            this.copyright = opts.copyright
        }
    })

    this.on('mount', (e, opts) => {
        $(this.about).modal('show')
    })

    this.on('unmount', () => {
        $(this.about).off('hide.bs.modal')
    })

});