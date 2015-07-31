const riot = require('riot');
const NProgress = window.NProgress;

const html = `
<div class="row">
    <div class="col-md-12">
        <div class="portlet box grey-cascade">
            <div class="portlet-title">
                <div class="caption">
                    <i class="fa fa-icon-th-large"></i>My Maps
                </div>
                <div if="{ menu }" class="actions">
                    <a each="{ menu.buttons }" href="{ link }" class="btn btn-default btn-sm">
                        <i class="{ icon }"></i> { title }
                    </a>
                    <div class="btn-group">
                        <a class="btn btn-default btn-sm" href="javascript:;" data-toggle="dropdown">
                            <i class="fa fa-cogs"></i> Tools <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="dropdown-menu pull-right">
                            <li each="{ menu.menu }">
                                <a href="{ link }">
                                    <i class="{ icon }"></i> { title }
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="portlet-body">
                <div class="table-toolbar">

                </div>
                <table class="table table-striped table-bordered table-hover" id="mymaps_table">
                    <thead>
                        <tr>
                            <th style="display: none;">
                                MapId
                            </th>
                            <th class="table-checkbox">
                                <input type="checkbox" class="group-checkable" data-set="#mymaps_table .checkboxes"/>
                            </th>
                            <th>
                                User ID
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Created On
                            </th>
                            <th>
                                Status
                            </th>
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr each="{ data }" class="odd gradeX">
                            <td style="display: none;">
                                { id }
                            </td>
                            <td>
                                <input type="checkbox" class="checkboxes" value="1"/>
                            </td>
                            <td>{ user_id }</td>
                            <td class="meta-editable" data-pk="{ id }" data-title="Edit Map Name">{ name }</td>
                            <td class="center">
                                { created_at }
                            </td>
                            <td>
                                <span class="label label-sm label-success">
                                    Private
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-sm blue filter-submit" onclick="{ parent.onOpen }">
                                    <i class="fa fa-icon-eye-open"></i> Open
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag('meta-table', html, function(opts) {

    const MetaMap = require('../../entry.js');

    this.data = null;
    this.menu = null;

    this.onOpen = (event, ...o) => {
        MetaMap.Router.to(`map/${event.item.id}`);
    }

    this.on('mount', () => {
        NProgress.start();
        FrontEnd.MetaFire.on('metamap/mymaps', (data) => {
            this.menu = {
                buttons: _.sortBy(data.buttons, 'order'),
                menu: _.sortBy(data.menu, 'order')
            };
            this.update();
        });

        FrontEnd.MetaFire.on('maps/list', (data) => {

            try {
                this.data = _.map(data, (obj, key) => {
                    obj.id = key;
                    return obj;
                });
                this.update();

                if (!this.table) {
                    this.table = $(this.mymaps_table);
                    this.table.dataTable({

                        // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                        // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
                        // So when dropdowns used the scrollable div should be removed. 
                        //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

                        //"bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
                        "columns": [
                            {
                                visible: false
                            }, {
                                "orderable": false
                            }, {
                                "orderable": true
                            }, {
                                "orderable": true
                            }, {
                                "orderable": true
                            }, {
                                "orderable": false
                            }, {
                                "orderable": false
                            }
                        ]
                    });

                    $('.meta-editable').editable('destroy');

                    var tableWrapper = this.table.parent().parent().parent().find('#mymaps_table_wrapper');

                    this.table.find('.group-checkable').change(function() {
                        var set = jQuery(this).attr("data-set");
                        var checked = jQuery(this).is(":checked");
                        jQuery(set).each(function() {
                            if (checked) {
                                $(this).attr("checked", true);
                                $(this).parents('tr').addClass("active");
                            } else {
                                $(this).attr("checked", false);
                                $(this).parents('tr').removeClass("active");
                            }
                        });
                        jQuery.uniform.update(set);
                    });

                    this.table.on('change', 'tbody tr .checkboxes', function() {
                        $(this).parents('tr').toggleClass("active");
                    });

                    tableWrapper.find('.dataTables_length select').addClass("form-control input-xsmall input-inline"); // modify table per page dropdown
                } else {
                    this.table.dataTable();
                }

                $('.meta-editable').editable().on('save', function(event, params) {
                    var id = this.dataset.pk;
                    MetaMap.MetaFire.setData(params.newValue, `maps/list/${id}/name`);
                });

                NProgress.done();

            } catch (e) {
                NProgress.done();
                window.FrontEnd.error(e);
            }
        });
    });
});