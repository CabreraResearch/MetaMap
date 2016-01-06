const riot = require('riot')
const _ = require('lodash')
const $ = require('jquery')
const Dropzone = require('dropzone')
const Papa = require('papaparse')

require('datatables')
require('datatables-bootstrap3-plugin')

const CONSTANTS = require('../../constants/constants')
const raw = require('../components/raw')
const TrainingMix = require('../mixins/training-mix')

const html = `
<table class="table table-striped table-bordered table-hover" id="{tableId}">
    <thead>
        <tr>
            <th each="{columns}">{name}</th>
        </tr>
    </thead>
    <tbody>
        <tr if="{ data }" each="{ data }" class="odd gradeX">
            <td style="vertical-align: middle">
                <a class="btn btn-sm red" onclick="{ parent.onStart }">Start <i class="fa fa-play"></i></a>
                <a if="{ parent.user.isAdmin }" class="btn btn-sm blue" onclick="{ parent.onDownload }">Save <i class="fa fa-cloud-download"></i></a>
            </td>
            <td class="{ meta_editable: parent.editable}" data-pk="{ id }" data-name="name" data-title="Edit Course Name" style="vertical-align: middle">
                { name }
            </td>
            <td class="{ meta_editable: parent.editable}" data-pk="{ id }" data-name="description" data-title="Edit Course Description" style="vertical-align: middle">
                { description }
            </td>
            <td style="vertical-align: middle">
                { course ? course.length : 0 } Steps
            </td>
            <td if="{ parent.user.isAdmin }" style="vertical-align: middle">
                { parent.getDate(updated_date) }
            </td>
            <td if="{ parent.user.isAdmin }" style="vertical-align: middle">
                <span class="label owner-label" data-toggle="tooltip" data-placement="bottom" title="{ updated_by.name }">
                    <img alt="{ updated_by.name }" height="30" width="30" class="img-circle" src="{ updated_by.picture }" />
                </span>
            </td>
            <td if="{ parent.user.isAdmin }" >
                <form  method="{ parent.onUpload }" url="/noupload" class="dropzone" id="training_upload_{ id }"></form>
            </td>
        </tr>
    </tbody>
</table>
`

module.exports = riot.tag(CONSTANTS.TAGS.ALL_COURSES, html, function (opts) {

    this.mixin(TrainingMix)

    const Homunculus = require('../../../Homunculus.js')

    this.user = Homunculus.User
    this.data = []
    this.editable = false
    this.tableId = 'all_courses'
    this.dropzones = {}

    this.columns = [
        {
            name: 'Action',
            orderable: false,
            width: '140px'
        },
        {
            name: 'Name',
            orderable: true
        }, {
            name: 'Description',
            orderable: true
        }, {
            name: 'Length',
            orderable: true
        }

    ]
    if (this.user.isAdmin) {
        this.columns.push({name: 'Last Updated', orderable: true})
        this.columns.push({name: 'Last Updated By', orderable: true})
        this.columns.push({name: 'Upload Training', orderable: false})
    }

    //Events
    this.onStart = (event, ...o) => {
        Homunculus.Router.to(`trainings/${event.item.id}`)
    }

    this.onDownload = (event, ...o) => {
        let id = event.item.id
        if (id && this._data[id]) {
            let csv = 'data:text/csvcharset=utf-8,' + Papa.unparse(this._data[id].course)
            let encodedUri = encodeURI(csv)
            let link = document.createElement('a')
            link.setAttribute('href', encodedUri)
            link.setAttribute('download', this._data[id].name + '.csv')

            link.click()
        }
    }

    this.initDropzone = (id) => {
        try {
            const tagThis = this
            tagThis.dropzones[id] = tagThis.dropzones[id] ||
                new Dropzone('#training_upload_' + id, {
                    url: '/noup',
                    paramName: "file", // The name that will be used to transfer the file
                    maxFiles: 0,
                    addRemoveLinks: true,
                    autoProcessQueue: false,
                    dictMaxFilesExceeded: 'One training at a time!',
                    acceptedFiles: '.csv',
                    init: function() {
                        const dzThis = this
                        dzThis.on('drop', function (e) {
                            if (dzThis.files.length > 0 || !e.dataTransfer.files[0].name.endsWith('.csv')) {
                                throw new Error('Only 1 CSV file at a time.')
                            }
                        })
                        dzThis.on('addedfile', function (file) {
                            Papa.parse(file, {
                                header: true,
                                complete: function (results, file) {
                                    let outline = _.map(_.filter(results.data, (line) => { return line.Section }), (line) => { return { section: line.Section, section_no: line['Section No'] }  })

                                    let course = _.map(_.filter(results.data, (line) => { return line.Line }), (line, lineNo) => {
                                        let ret = {
                                            section: line.Section || '',
                                            section_no: line['Section No'] || '',
                                            person: 'Cortex',
                                            line: line.Line || '',
                                            action: (line.Action || '').toLowerCase().trim().split(' ').join('-').trim(),
                                            //display: line.Display
                                        }
                                        try {
                                            if (line['Action Data']) {
                                                ret.action_data = JSON.parse(line['Action Data'])
                                            }
                                        } catch (e) {
                                            ret.action_data = line['Action Data']
                                            window.alert(`Couldn't import Action Data for line number ${lineNo+1}: "${ret.action_data}"`)
                                            Homunculus.error(e)
                                            Homunculus.error({message: ret.action_data })
                                        }
                                        return ret;
                                    })
                                    tagThis.saveTraining(id, { course: course, outline: outline })
                                    dzThis.removeAllFiles(true)
                                }
                            })
                        })
                    }
            })
        } catch (e) {
            console.log(e)
        }
    }

    this.buildTable = () => {
        try {
            if (this.table) {
                if (this.user.isAdmin) {
                    this.table.find(`.meta_editable`).editable('destroy')
                }
                this.dataTable.destroy()
            }

            this.table = $(document.getElementById(this.tableId))
            if(!this.dataTable) {
                this.dataTable = this.table.DataTable({

                    // Uncomment below line('dom' parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                    // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
                    // So when dropdowns used the scrollable div should be removed.
                    //'dom': '<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>',
                    //'bStateSave': true, // save datatable state(pagination, sort, etc) in cookie.
                    'columns': this.columns
                })
            } else {
                this.dataTable.draw()
            }
            var tableWrapper = this.table.parent().parent().parent().find(`#${this.tableId}_table_wrapper`)

            tableWrapper.find('.dataTables_length select').addClass('form-control input-xsmall input-inline') // modify table per page dropdown

            if (this.user.isAdmin) {
                let tag = this
                this.table.find(`.meta_editable`).editable({ unsavedclass: null }).on('save', function (event, params) {
                    if (this.dataset && this.dataset.pk) {
                        let id = this.dataset.pk
                        let update = {}
                        update[this.dataset.name] = params.newValue
                        tag.saveTraining(id, update)
                    }
                    return true
                })
            }
        } catch (e) {

        } finally {
            window.NProgress.done()
        }
    }

    //Riot bindings
    this.on('mount', () => {
        this.editable = this.user.isAdmin
    })

    const once = _.once(() => {
        Homunculus.MetaFire.on(CONSTANTS.ROUTES.COURSE_LIST, (list) => {
            this._data = list
            this.data = _.map(this._data, (obj, key) => {
                obj.id = key
                obj.created_at = this.getDate(obj.created_at)
                return obj
            })
            if (this.data) {
                this.update()
                this.buildTable(0, this.data)

                if (this.user.isAdmin) {
                    _.each(this.data, (d) => {
                        this.initDropzone(d.id)
                    })
                }
            }
        })
    })

    this.on('update', () => {
        once()
    })
})