const riot = require('riot');
const $ = require('jquery')
require('typeahead.js')
const CONSTANTS = require('../../constants/constants')
require('../../tools/shims');
require('bootstrap-select')

const html = `
<div id="share_modal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <a style="float: right; vertical-align: middle;">Get sharable link  <i class="fa fa-link"></i></a>
                <h4 class="modal-title">Share with others</h4>
            </div>
            <div class="modal-body">
                <p>People</p>
                <form role="form">
                    <div class="row">
                        <div id="share_typeahead" class="col-md-8">
                            <input style="height: 35px;" id="share_input" class="typeahead form-control" type="text" placeholder="Public" />
                        </div>
                        <div class="col-md-4">
                            <select id="share_permission" class="selectpicker">
                                <option data-content="<span><i class='fa fa-eye'></i> Can view</span>">Can view</option>
                                <option data-content="<span><i class='fa fa-pencil'></i> Can edit</span>">Can edit</option>
                            </select>
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

    this.data = [];

    this.on('mount', () => {
        $('#share_typeahead .typeahead').typeahead({
            highlight: true
        },{
            source: (query, syncMethod, asyncMethod) => {
                return $.ajax({
                    type: 'post',
                    url: 'https://api.metamap.co/users/find',
                    data: JSON.stringify( {
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
        $('.selectpicker').selectpicker({
            width: 'auto'
        })
    })
});