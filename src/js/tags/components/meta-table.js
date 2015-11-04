const riot = require('riot')
const moment = require('moment')
const _ = require('lodash');
const $ = require('jquery')
require('datatables')
require('datatables-bootstrap3-plugin')

const CONSTANTS = require('../../constants/constants')
const raw = require('./raw')
const tr = require('./tr')

const html = `
<div id="{tableId}" class="portlet box grey-cascade">
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
            <div each="{ val, i in tabs }" class="tab-pane fase in { active: i == 0 }" id="{ tableId+'_1_'+i }">
                <table class="table table-striped table-bordered table-hover" id="{ tableId+'_'+i }">
                    <meta-tbody opts="{ columns: val.columns, tableId: parent.tableId, rows: parent.data[i] }"></meta-tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag('meta-table', html, function (opts) {

    this.tabs = []
    this.tableId = null

});