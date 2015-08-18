const riot = require('riot');
const NProgress = window.NProgress;
const _ = require('lodash');
const ROUTES = require('../../js/constants/routes');
const PAGES = require('../../js/constants/pages');

const html = `
<div class="portlet box grey-cascade">
    <div class="portlet-title">
        <div class="caption">
            <i class="fa fa-icon-th-large"></i>MetaMaps
        </div>
        <div if="{ menu }" class="actions">
            <a each="{ menu.buttons }" href="{ link }" onclick="{ parent.onActionClick }" class="btn btn-default btn-sm">
                <i class="{ icon }"></i> { title }
            </a>
            <div class="btn-group">
                <a class="btn btn-default btn-sm" href="javascript:;" data-toggle="dropdown">
                    <i class="fa fa-cogs"></i> Tools <i class="fa fa-angle-down"></i>
                </a>
                <ul class="dropdown-menu pull-right">
                    <li each="{ menu.menu }" onclick="{ parent.onMenuClick }">
                        <a href="{ link }">
                            <i class="{ icon }"></i> { title }
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="portlet-body">
        <ul class="nav nav-tabs portlet-tabs">
            <li onclick="{ parent.onTabSwitch }" each="{ val, i in tabs }" class="{ active: i == 0 }">
                <a href="#mymaps_1_{ i }" data-toggle="tab" aria-expanded="{ true: i == 0 }">
                { val.title }</a>
            </li>
        </ul>
        <div class="table-toolbar">

        </div>
        <div class="tab-content">
            <div each="{ val, i in tabs }" class="tab-pane fase in { active: i == 0 }" id="mymaps_1_{ i }">
                <table class="table table-striped table-bordered table-hover" id="mymaps_table_{ i }">
                    <thead>
                        <tr>
                            <th style="display: none;">
                                MapId
                            </th>
                            <th class="table-checkbox">
                                <input if="{ parent.currentTab == 'My Maps' }" type="checkbox" class="group-checkable" data-set="#mymaps_table_{ i } .checkboxes"/>
                            </th>
                            <th style="display: none;">
                                UserId
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
                        <tr if="{ parent.data && parent.data[i] }" each="{ parent.data[i] }" class="odd gradeX">
                            <td style="display: none;" ><span data-selector="id" class ="mapid">{ id }</span></td>
                            <td>
                                <input if="{ parent.currentTab == 'My Maps' }" type="checkbox" class="checkboxes" value="1"/>
                            </td>
                            <td style="display: none;">{ user_id }</td>
                            <td if="{ val.editable }" class="meta_editable_{ i }" data-pk="{ id }" data-title="Edit Map Name">{ name }</td>
                            <td if="{ !val.editable }">{ name }</td>
                            <td class="center">{ created_at }</td>
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

module.exports = riot.tag('my-maps', html, function (opts) {

    const MetaMap = require('../../entry.js');

    this.data = null;
    this.menu = null;
    this.tabs = _.sortBy([{ title: 'My Maps', order: 0, editable: true }, { title: 'Shared with Me', order: 1, editable: false }], 'order');
    this.currentTab = 'My Maps';
    
    this.onOpen = (event, ...o) => {
        MetaMap.Router.to(`map/${event.item.id}`);
    }
    
    this.onTabSwitch = (event, ...o) => {
        this.currentTab = event.item.val.title;
        switch(this.currentTab) {
            case 'My Maps': 
            
                break;
        }
    }

    this.onActionClick = (event, tag) => {
        return true;
    }

    this.onMenuClick = (event, tag) => {
        if(this.currentTab == 'My Maps') {
            switch (event.item.title.toLowerCase()) {
                case 'delete':
                    const deleteMaps = require('../../js/actions/DeleteMap.js');
                    let selected = this[`table0`].find('.active').find('.mapid');
                    let ids = [];
                    _.each(selected, (cell) => {
                        ids.push(cell.innerHTML);
                    });
                    deleteMaps.deleteAll(ids, PAGES.MY_MAPS);
                    let find = this[`table0`].find('tbody tr .checkboxes');
                    find.each(function(){
                        $(this).attr('checked', false);
                        $(this).parents('tr').removeClass('active');
                    });
                    jQuery.uniform.update(find);
                    break;
            }
        }
    }

    this.on('mount', () => {
        NProgress.start();
        MetaMap.MetaFire.on('metamap/mymaps', (data) => {
            if (data) {
                this.menu = {
                    buttons: _.sortBy(data.buttons, 'order'),
                    menu: _.sortBy(data.menu, 'order')
                };
                this.update();
            }
        });

        const buildTable = (idx, list, editable) => {
            try {
                this.data = this.data || {};
                this.data[idx] = list;
                if (this[`table${idx}`]) {
                    $(`.meta_editable_${idx}`).editable('destroy');
                    this[`dataTable${idx}`].destroy();
                }

                this.update();

                this[`table${idx}`] = $(this[`mymaps_table_${idx}`]);
                this[`dataTable${idx}`] = this[`table${idx}`].DataTable({

                    // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                    // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
                    // So when dropdowns used the scrollable div should be removed. 
                    //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',

                    //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                    'columns': [
                        {
                            orderable: false
                        }, {
                            'orderable': false
                        }, {
                            'orderable': true
                        }, {
                            'orderable': true
                        }, {
                            'orderable': true
                        }, {
                            'orderable': false
                        }, {
                            'orderable': false
                        }
                    ]
                });
                //this[`table${idx}`]Tools = new $.fn.dataTable.TableTools(this[`dataTable${idx}`], {});

                var tableWrapper = this[`table${idx}`].parent().parent().parent().find(`#mymaps_${idx}_table_wrapper`);

                this[`table${idx}`].find('.group-checkable').change(function () {
                    var set = jQuery(this).attr('data-set');
                    var checked = jQuery(this).is(':checked');
                    jQuery(set).each(function () {
                        if (checked) {
                            $(this).attr('checked', true);
                            $(this).parents('tr').addClass('active');
                        } else {
                            $(this).attr('checked', false);
                            $(this).parents('tr').removeClass('active');
                        }
                    });
                    jQuery.uniform.update(set);
                });

                this[`table${idx}`].on('change', 'tbody tr .checkboxes', function () {
                    $(this).parents('tr').toggleClass('active');
                });

                tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline'); // modify table per page dropdown

                if (editable) {
                    $(`.meta_editable_${idx}`).editable({ unsavedclass: null }).on('save', function (event, params) {
                        var id = this.dataset.pk;
                        MetaMap.MetaFire.setData(params.newValue, `maps/list/${id}/name`);
                        return true;
                    });
                }
                NProgress.done();

            } catch (e) {
                NProgress.done();
                MetaMap.error(e);
            }
        };

        MetaMap.MetaFire.getChild(ROUTES.MAPS_LIST).orderByChild('owner').equalTo(MetaMap.User.userId).on('value', (val) => {
            const list = val.val();
            const maps = _.map(list, (obj, key) => {
                obj.id = key;
                obj.created_at = moment(obj.created_at).format('YYYY-MM-DD');
                return obj;
            });
            buildTable(0, maps);
        });

        MetaMap.MetaFire.getChild(ROUTES.MAPS_LIST).on('value', (val) => {
            const list = val.val();
            const maps = _.map(list, (obj, key) => {
                if (obj.owner == MetaMap.User.userId || obj.shared_with[MetaMap.User.userId] != true) {
                    return;
                } else {
                    obj.id = key;
                    obj.created_at = moment(obj.created_at).format('YYYY-MM-DD');
                    return obj;
                }
            });

            buildTable(1, maps);
        });
    });
});