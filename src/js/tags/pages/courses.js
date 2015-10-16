const riot = require('riot');
const NProgress = window.NProgress;
const _ = require('lodash');
const $ = require('jquery')
require('datatables')
require('datatables-bootstrap3-plugin')

const CONSTANTS = require('../../constants/constants');
const raw = require('../components/raw');
const moment = require('moment');

const html = `
<div id="trainings_page" class="portlet box grey-cascade">
    <div class="portlet-title">
        <div class="caption">
            <i class="fa fa-icon-th-large"></i>Courses
        </div>
    </div>
    <div class="portlet-body">
        <div class="tab-content">
            <div>
                <table class="table table-striped table-bordered table-hover" id="training_table">
                    <thead>
                        <tr>
                            <th>
                                Name
                            </th>
                            <th>
                                Created On
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr if="{ data }" each="{ data }" class="odd gradeX">
                            <td style="vertical-align: middle;"><a href="#trainings/{id}">{ name }</a></td>
                            <td style="vertical-align: middle;">{ created_at }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag(CONSTANTS.PAGES.COURSE_LIST, html, function (opts) {

    const MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User;
    this.data = null;

    this.on('update', () => {

    })

    //Riot bindings
    this.on('mount', () => {
        NProgress.start();

        const buildTable = (list) => {
            try {
                this.data = list;
                if (this[`table`]) {
                    this[`dataTable`].destroy();
                }

                this.update();

                this[`table`] = $(this[`training_table`]);
                this[`dataTable`] = this[`table`].DataTable({

                    // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                    // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
                    // So when dropdowns used the scrollable div should be removed.
                    //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',
                    //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                    'columns': [
                        {
                            name: 'Name',
                            orderable: true
                        }, {
                            name: 'Created On',
                            orderable: true
                        }
                    ]
                });

                var tableWrapper = this[`table`].parent().parent().parent().find(`#training_table_wrapper`);

                tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline'); // modify table per page dropdown
            } catch (e) {
                MetaMap.error(e);
            } finally {
                NProgress.done();
            }
        };

        //Fetch All maps
        MetaMap.MetaFire.getChild(CONSTANTS.ROUTES.COURSE_LIST).on('value', (val) => {
            const list = val.val();
            const maps = _.map(list, (obj, key) => {
                obj.editable = true
                obj.id = key;
                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                return obj;
            });
            buildTable(maps);
            $('.owner-label').tooltip()
       });
    });
});