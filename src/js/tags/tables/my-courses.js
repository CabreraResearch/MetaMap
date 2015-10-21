const riot = require('riot')
const moment = require('moment')
const NProgress = window.NProgress
const _ = require('lodash')
const $ = require('jquery')
require('datatables')
require('datatables-bootstrap3-plugin')

const CONSTANTS = require('../../constants/constants')
const raw = require('../components/raw')

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
                <a class="btn btn-sm red" onclick="{ parent.onStart }">Continue <i class="fa fa-play"></i></a>
            </td>
            <td style="vertical-align: middle">{ name }</td>
            <td style="vertical-align: middle">{ description }</td>
        </tr>
    </tbody>
</table>
`

module.exports = riot.tag(CONSTANTS.TAGS.MY_COURSES, html, function (opts) {

    const MetaMap = require('../../../MetaMap.js')

    this.user = MetaMap.User
    this.data = []
    this.editable = false
    this.tableId = 'my_courses'

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

    //Events
    this.onStart = (event, ...o) => {
        MetaMap.Router.to(`trainings/${event.item.id}`)
    }

    this.buildTable = () => {
        try {

            this.update()

            this.table = $(document.getElementById(this.tableId))
            this.dataTable = this.table.DataTable({

                // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
                // So when dropdowns used the scrollable div should be removed.
                //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',
                //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                'columns': this.columns
            })

            var tableWrapper = this.table.parent().parent().parent().find(`#${this.tableId}_table_wrapper`)

            tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline') // modify table per page dropdown
        } catch (e) {

        } finally {
            NProgress.done()
        }
    }

    //Riot bindings
    this.on('mount', () => {

    })

    const once = _.once(() => {
        MetaMap.MetaFire.on(CONSTANTS.ROUTES.TRAININGS.format(this.user.userId), (list) => {
            this.data = _.map(list, (obj, key) => {
                obj.id = key
                obj.created_at = moment(new Date(obj.created_at)).format('YYYY-MM-DD')
                return obj
            })
            this.update()
            this.buildTable(0, this.data)
        })
    })

    this.on('update', () => {
        once()
    })

})