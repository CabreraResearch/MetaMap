const riot = require('riot');
const $ = require('jquery')
const _ = require('lodash')
require('typeahead.js')
require('bootstrap-select')

const CONSTANTS = require('../../constants/constants')
require('../../tools/shims');
const Sharing = require('../../app/Sharing')

const html = `
<div id="share_modal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <a id="share_public_link"
                    style="float: right; vertical-align: middle;"
                    data-clipboard-text="{window.location.host+'/'+window.location.pathname+'/maps/'+opts.map.id}"
                    onclick="{ getPublicLink }">
                        Get sharable link  <i class="fa fa-link"></i></a>
                <h4 class="modal-title">Share with others</h4>
            </div>
            <div class="modal-body">
                <p>People</p>
                <form role="form">
                    <div class="row">
                        <div id="share_typeahead" class="col-md-8">
                            <input style="height: 35px;" id="share_input" class="typeahead form-control" type="text" placeholder="Enter names or email addresses..." />
                        </div>
                        <div class="col-md-4">
                            <div class="row">
                                <div class="col-md-8">
                                    <select id="share_permission" class="selectpicker">
                                        <option value="read" data-content="<span><i class='fa fa-eye'></i> Can view</span>">Can view</option>
                                        <option value="write" data-content="<span><i class='fa fa-pencil'></i> Can edit</span>">Can edit</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <a id="share_button" class="btn btn-icon-only green" onclick="{ onShare }" style="display: none;">
                                        <i class="fa fa-plus"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div if="{ opts && opts.map && opts.map.shared_with}" class="row">
                        <br>
                        <div class="col-md-12">
                            <span
                                class="label label-default"
                                style="margin-right: 5px;"
                                if="{ i != 'admin' && (val.write || val.read) }"
                                each="{ i, val in opts.map.shared_with}">
                                <i if="{ val.write }" class="fa fa-pencil"></i>
                                <i if="{ !val.write }" class="fa fa-eye"></i>
                                </i>
                                  { val.name }
                                <i
                                    class="fa fa-times-circle"
                                    style="cursor: pointer;"
                                    onclick="{ parent.onUnShare }"
                                    >
                                </i>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Done</button>
            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag('share', html, function (opts) {

    const MetaMap = require('../../../MetaMap')
    const share = new Sharing(MetaMap.User)

    this.data = [];

    this.getPublicLink = (e, opts) => {
        debugger;
    }

    this.newShares = {}

    this.onShare = (e, opts) => {
        let newShare = {
            read: this.picker.val() == 'read' || this.picker.val() == 'write',
            write: this.picker.val() == 'write',
            name: this.suggestion.name,
            picture: this.suggestion.picture
        }
        this.opts.map.shared_with[this.suggestion.id] = newShare
        this.newShares[this.suggestion.id] = newShare

        share.addShare(this.opts.map, this.suggestion, this.opts.map.shared_with[this.suggestion.id])

        this.suggestion = null
        this.ta.typeahead('val', '')
        $(this.share_button).hide()

    }

    this.onUnShare = (e, opts) => {
        e.item.val.id = e.item.i
        delete this.opts.map.shared_with[e.item.i]
        delete this.newShares[e.item.i]
        share.removeShare(this.opts.map, e.item.val)
    }

    this.on('update', (opts) => {
        if (opts) {
            _.extend(this.opts, opts);
        }
        if (!this._onClose && this.opts.onClose) {
            this._onClose = this.opts.onClose
            $(this.share_modal).on('hidden.bs.modal', () => {
                this.opts.onClose(this.newShares)
            })
        }
    })

    this.on('mount', (e, opts) => {
        $(this.share_modal).modal('show')

        this.ta = $('#share_typeahead .typeahead').typeahead({
            highlight: true
        },{
            source: (query, syncMethod, asyncMethod) => {
                return $.ajax({
                    type: 'post',
                    url: 'https://api.metamap.co/users/find',
                    data: JSON.stringify( {
                        currentUserId: MetaMap.User.userId,
                        sessionId: MetaMap.MetaFire.firebase_token,
                        excludedUsers: _.keys(this.opts.map.shared_with),
                        search: query
                    }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        data.push({
                            id: '*',
                            picture: 'src/images/world-globe.jpg',
                            name: 'Public'
                        })
                        asyncMethod(data)
                    },
                    error : function (e) {
                        console.log(e);
                    }
                });
                },
            display: (obj) => {
                return obj.name;
            },
            templates: {
                empty: [
                '<div style="padding: 5px 10px; text-align: center;">',
                    'Unable to find any users matching this query',
                '</div>'
                ].join('\n'),
                suggestion: (value) => { return `<div><img alt="${value.name}" height="30" width="30" class="img-circle" src="${value.picture}"> ${value.name}</div>` }
            }
        })
        this.ta.on('typeahead:select', (ev, suggestion) => {
            this.suggestion = suggestion
            $(this.share_button).show()
        })
        this.ta.on('typeahead:autocomplete', (ev, suggestion) => {
            this.suggestion = suggestion
            $(this.share_button).show()
        })
        this.picker = $('.selectpicker').selectpicker({
            width: 'auto'
        })
    })
});