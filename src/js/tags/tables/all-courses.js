const riot = require('riot');
const moment = require('moment');
const NProgress = window.NProgress;
const _ = require('lodash');
const $ = require('jquery')
const Dropzone = require('dropzone')

require('datatables')
require('datatables-bootstrap3-plugin')

const CONSTANTS = require('../../constants/constants');
const raw = require('../components/raw');

const html = `
<table class="table table-striped table-bordered table-hover" id="{tableId}">
    <thead>
        <tr>
            <th each="{columns}">{name}</th>
        </tr>
    </thead>
    <tbody>
        <tr if="{ data }" each="{ data }" class="odd gradeX">
            <td>
                <a class="btn btn-sm red" onclick="{ parent.onStart }">Start <i class="fa fa-play"></i></a>
            </td>
            <td class="{ meta_editable: parent.editable}" data-pk="{ id }" data-name="name" data-title="Edit Course Name" style="vertical-align: middle;">{ name }</td>
            <td class="{ meta_editable: parent.editable}" data-pk="{ id }" data-name="description" data-title="Edit Course Description" style="vertical-align: middle;">{ description }</td>
            <td if="{ parent.user.isAdmin }" >
                <form  method="{ parent.onUpload }" url="/noupload" class="dropzone" id="training_upload_{ id }"></form>
            </td>
        </tr>
    </tbody>
</table>
`;

module.exports = riot.tag(CONSTANTS.TAGS.ALL_COURSES, html, function (opts) {

    const MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User
    this.data = []
    this.editable = false
    this.tableId = 'all_courses'
    this.dropzones = {}

    this.columns = [
        {
            name: 'Action',
            orderable: false,
            width: '120px'
        },
        {
            name: 'Name',
            orderable: true
        }, {
            name: 'Description',
            orderable: true
        }
    ]
    if (this.user.isAdmin) {
        this.columns.push({name: 'Upload Training', orderable: false})
    }

    //Events
    this.onStart = (event, ...o) => {
        MetaMap.Router.to(`trainings/${event.item.id}`);
    }

    this.onUpload = (files) => {
        console.log(files)
    }

    this.initDropzone = (id) => {
        try {
            this.dropzones[id] = this.dropzones[id] ||
            new Dropzone('#training_upload_' + id, {
                url: '/noup',
                paramName: "file", // The name that will be used to transfer the file
                maxFiles: 0,
                addRemoveLinks: true,
                autoProcessQueue: false,
                dictMaxFilesExceeded: 'One training at a time!',
                acceptedFiles: '.csv',
                init: function() {
                    this.on('drop', function (e) {
                        if (!e.dataTransfer.files[0].name.endsWith('.csv')) {
                            throw Error('Invalid file type')
                        }
                    });
                    this.on("addedfile", function (file) {
                        console.log(file)
                    });
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    this.buildTable = () => {
        try {
            if (this.table) {
                this.table.find(`.meta_editable`).editable('destroy');
                this.dataTable.destroy();
            }

            this.table = $(document.getElementById([this.tableId]));
            this.dataTable = this.table.DataTable({

                // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
                // So when dropdowns used the scrollable div should be removed.
                //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',
                //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                'columns': this.columns
            });

            var tableWrapper = this.table.parent().parent().parent().find(`#${this.tableId}_table_wrapper`);

            tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline'); // modify table per page dropdown

             this.table.find(`.meta_editable`).editable({ unsavedclass: null }).on('save', function (event, params) {
                if (this.dataset && this.dataset.pk) {
                    var id = this.dataset.pk;
                    MetaMap.MetaFire.setData(params.newValue, `${CONSTANTS.ROUTES.COURSE_LIST}/${id}/${this.dataset.name}`);
                }
                return true;
            });
        } catch (e) {

        } finally {
            NProgress.done()
        }
    }

    //Riot bindings
    this.on('mount', () => {
        this.editable = this.user.isAdmin
    });

    const once = _.once(() => {
        MetaMap.MetaFire.on(CONSTANTS.ROUTES.COURSE_LIST, (list) => {
            this.data = _.map(list, (obj, key) => {
                obj.id = key;
                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD');
                return obj;
            });
            if (this.data) {
                this.update()
                this.buildTable(0, this.data);
                _.each(this.data, (d) => {
                    this.initDropzone(d.id)
                })
            }
        });
    })

    this.on('update', () => {
        once()
    })
});