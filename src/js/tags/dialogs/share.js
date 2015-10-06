const riot = require('riot');
const $ = require('jquery')
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
                <a style="float: right; vertical-align: middle;" onclick="{ getPublicLink }">Get sharable link  <i class="fa fa-link"></i></a>
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
                        <div class="col-md-12">
                            <span class="label" if="{i != '*' && i != 'admin'}" each="{val, i in opts.map.shared_with}">{ val.name }</span>
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

    this.onShare = (e, opts) => {
        this.opts.map.shared_with[this.suggestion.id] = {
            read: this.picker.val() == 'read' || this.picker.val() == 'write',
            write: this.picker.val() == 'write',
            name: this.suggestion.name,
            picture: this.suggestion.picture
        }
        share.addShare(this.opts.map, this.suggestion, this.opts.map.shared_with[this.suggestion.id])

        this.suggestion = null
        this.ta.typeahead('val', '')
        $(this.share_button).hide()
    }

    this.on('update', (opts) => {
        if (opts) {
            _.extend(this.opts, opts);
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
                        sessionId: MetaMap.Auth0.ctoken,
                        search: query
                    }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        asyncMethod(data);
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