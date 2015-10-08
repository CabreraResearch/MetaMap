const riot = require('riot');
const moment = require('moment');
const NProgress = window.NProgress;
const _ = require('lodash');
const $ = require('jquery')
require('datatables')
require('datatables-bootstrap3-plugin')

const CONSTANTS = require('../../constants/constants');
const raw = require('../components/raw');
const ShareMap = require('../../actions/ShareMap')

const html = `
<div id="my_maps_page" class="portlet box grey-cascade">
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
                            <th class="table-checkbox">
                                <input if="{ val.title == 'My Maps' }" type="checkbox" class="group-checkable" data-set="#mymaps_table_{ i } .checkboxes"/>
                            </th>
                            <th>
                                Action
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Created On
                            </th>
                            <th if="{ val.title == 'My Maps' }">
                                Status
                            </th>
                            </th>
                            <th if="{ val.title != 'My Maps' }">
                                Owner
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr if="{ parent.data && parent.data[i] }" each="{ parent.data[i] }" class="odd gradeX">
                            <td>
                                <input if="{ val.title == 'My Maps' || parent.user.isAdmin }" type="checkbox" class="checkboxes" value="1"/>
                            </td>
                            <td>
                                <button class="btn btn-sm blue filter-submit" onclick="{ parent.onOpen }">Open</button>
                                <a if="{ val.title == 'My Maps' }" class="btn btn-sm red" onclick="{ parent.onShare }">Share <i class="fa fa-share"></i></a>
                                <a if="{ val.title != 'My Maps' }" class="btn btn-sm red" onclick="{ parent.onCopy }">Copy <i class="fa fa-clone"></i></a>
                            </td>
                            <td if="{ editable }" class="meta_editable_{ i }" data-pk="{ id }" data-title="Edit Map Name" style="vertical-align: middle;">{ name }</td>
                            <td if="{ !editable }" style="vertical-align: middle;">{ name }</td>
                            <td style="vertical-align: middle;">{ created_at }</td>
                            <td if="{ val.title == 'My Maps' }">
                                <raw content="{ parent.getStatus(this) }"></raw>
                            </td>
                            <td if="{ val.title != 'My Maps' }">
                                <raw content="{ parent.getOwner(this) }"></raw>
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

    const MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User;
    this.data = null;
    this.menu = null;
    let tabs = [
        { title: 'My Maps', order: 0, editable: true },
        { title: 'Shared with Me', order: 1, editable: false },
        { title: 'Public', order: 2, editable: false }
    ];
    if (this.user.isAdmin) {
        tabs.push({ title: 'All Maps', order: 3, editable: true })
        tabs.push({ title: 'Templates', order: 4, editable: true })
    }
    this.tabs = _.sortBy(tabs, 'order')

    this.currentTab = 'My Maps';

    //
    this.getStatus = (item) => {
        let status = 'Private'
        let code = 'default'
        let html = '';
        if (item.shared_with) {
            if (item.shared_with['*'] && (item.shared_with['*'].read == true || item.shared_with['*'].write == true)) {
                status = 'Public'
                code = 'primary'
            } else {
                _.each(item.shared_with, (share, key) => {
                    if (share.picture && key != '*' && key != 'admin') {
                        html += `<span class="label owner-label" data-toggle="tooltip" data-placement="bottom" title="${share.name}"><img alt="${share.name}" height="30" width="30" class="img-circle" src="${share.picture}"></span>`
                    }
                })
                if (html) {
                    html = '<span class="">Shared with: </span>' + html;
                }
            }
        }
        html = html || `<span class="label label-sm label-${code}">${status}</span>`

        return html;
    }

    this.getOwner = (item) => {
        let html = `<span class="label owner-label" data-toggle="tooltip" data-placement="bottom" title="${item.owner.name}"><img alt="${item.owner.name}" height="30" width="30" class="img-circle" src="${item.owner.picture}"></span>`
        return html;
    }

    //Events
    this.onOpen = (event, ...o) => {
        MetaMap.Router.to(`map/${event.item.id}`);
    }

    this.onShare = (event, ...o) => {
        let opts = {
            map: event.item
        }
        ShareMap.act(opts);
    }

    this.onCopy = (event, ...o) => {
        console.log('copy')
    }

    this.onTabSwitch = (event, ...o) => {
        this.currentTab = event.item.val.title;
         _.delay(() => {
            $('.owner-label').tooltip()
        }, 250);
        switch (this.currentTab) {
            case 'My Maps':

                break;
        }
    }

    this.onActionClick = (event, tag) => {
        return true;
    }

    this.onMenuClick = (event, tag) => {
        if (this.currentTab == 'My Maps') {
            switch (event.item.title.toLowerCase()) {
                case 'delete':
                    const deleteMaps = require('../../actions/DeleteMap.js');
                    let selected = this[`table0`].find('.active').find('.mapid');
                    let ids = [];
                    _.each(selected, (cell) => {
                        ids.push(cell.innerHTML);
                    });
                    deleteMaps.deleteAll(ids, CONSTANTS.PAGES.MY_MAPS);
                    let find = this[`table0`].find('tbody tr .checkboxes');
                    find.each(function () {
                        $(this).attr('checked', false);
                        $(this).parents('tr').removeClass('active');
                    });
                    jQuery.uniform.update(find);
                    break;
            }
        }
    }

    this.on('update', () => {

    })

    //Riot bindings
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
                            name: 'ChckBx',
                            orderable: false
                        }, {
                            name: 'Action',
                            orderable: false,
                            width: '120px'
                        }, {
                            name: 'Name',
                            orderable: true
                        }, {
                            name: 'Created On',
                            orderable: true
                        }, {
                            name: 'Status',
                            orderable: false
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

                $(`.meta_editable_${idx}`).editable({ unsavedclass: null }).on('save', function (event, params) {
                    if (this.dataset && this.dataset.pk) {
                        var id = this.dataset.pk;
                        MetaMap.MetaFire.setData(params.newValue, `${CONSTANTS.ROUTES.MAPS_LIST}/${id}/name`);
                    }
                    return true;
                });

                NProgress.done();

            } catch (e) {
                NProgress.done();
                MetaMap.error(e);
            }
        };

        //Fetch All maps
        MetaMap.MetaFire.getChild(CONSTANTS.ROUTES.MAPS_LIST).on('value', (val) => {
            const list = val.val();
            _.each(this.tabs, (tab) => {
                let maps = null;
                switch (tab.title) {
                    case 'Templates':
                    case 'My Maps':
                        maps = _.map(list, (obj, key) => {
                            if (obj.owner.userId == MetaMap.User.userId) { //Only include my own maps
                                obj.editable = true
                                obj.id = key;
                                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                                return obj;
                            } else {
                                return;
                            }
                        });
                        break;
                    case 'Shared with Me':
                        maps = _.map(list, (obj, key) => {
                            if (obj.owner.userId != MetaMap.User.userId && //Don't include my own maps
                                obj.shared_with && //Exclude anything that isn't shared at all
                                (!obj.shared_with['*'] || (obj.shared_with['*'].read != true || obj.shared_with['*'].write != true)) && //Exclude public maps
                                obj.shared_with[MetaMap.User.userId] && //Include shares wih my userId
                                (obj.shared_with[MetaMap.User.userId].write == true || //Include anything I can write to
                                obj.shared_with[MetaMap.User.userId].read == true) //Include anything I can read from
                                ) {
                                obj.editable = (obj.shared_with[MetaMap.User.userId].write == true)
                                obj.id = key;
                                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                                return obj;
                            } else {
                                return;
                            }
                        });
                        break;
                    case 'Public':
                        maps = _.map(list, (obj, key) => {
                            if (obj.owner.userId != MetaMap.User.userId && //Don't include my own maps
                                obj.shared_with && //Exclude anything that isn't shared at all
                                (obj.shared_with['*'] && (obj.shared_with['*'].read == true || obj.shared_with['*'].write == true) ) //Include public maps
                                ) {
                                obj.editable = (obj.shared_with['*'].write == true)
                                obj.id = key;
                                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                                return obj;
                            } else {
                                return;
                            }
                        });
                        break;
                    case 'All Maps':
                        if (this.user.isAdmin) {
                            maps = _.map(list, (obj, key) => {
                                //Like it says, all maps
                                obj.editable = true
                                obj.id = key;
                                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                                return obj;
                            });
                        }
                        break;
                }
                if (maps) {
                    maps = _.filter(maps, (map) => { return map && map.id })
                    buildTable(tab.order, maps);
                }
            })
            _.delay(() => {
                $('.owner-label').tooltip()
            }, 250);
       });
    });
});