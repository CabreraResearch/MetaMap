const riot = require('riot');

const html = `
<thead>
    <tr>
        <th if="{columns}"
            each="{columns}"
            class="{ 'table-checkbox': isCheckbox == true }"
        >
            <input if="{ isCheckbox == true }" type="checkbox" class="group-checkable" data-set="#{ parent.tableId } .checkboxes"/>
            {name}
        </th>
    </tr>
</thead>
<tbody>
    <tr if="{ rows }" each="{ val, i in rows }" class="odd gradeX">
        <td if="{ parent.hasCheckboxes }">
            <input type="checkbox" class="checkboxes" value="1"/>
        </td>
        <td if="{ parent.actions }">
            <a data-type="{name}" each="{ parent.actions }" class="btn btn-sm { color }" onclick="{ parent.onClick }">{name} <i class="fa {icon}"></i></a>
        </td>
        <td each="{ data in val }" if="{ parent.columns[i].editable }" class="{ meta_editable: editable }" data-pk="{ id }" style="vertical-align: middle;">{ val }</td>

        <td style="vertical-align: middle;">{ created_at }</td>
        <td if="{ val.title == 'My Maps' }">
            <raw content="{ parent.getStatus(this) }"></raw>
        </td>
        <td if="{ val.title != 'My Maps' }">
            <raw content="{ parent.getOwner(this) }"></raw>
        </td>
    </tr>
</tbody>
`;

module.exports = riot.tag('meta-tbody', html, function (opts) {
    this.columns = null;
    this.rows = null;
    this.tableId = ''
    this.hasCheckboxes = false

    this.updateContent = function () {
        if (!this.columns || opts) {
            this.columns = this.columns || opts.columns;
            this.tableId = opts.tableId
        }
        this.update();
    };

    this.on('update', () => {
        this.updateContent();
    });

    this.updateContent();
});