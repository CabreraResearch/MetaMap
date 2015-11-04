const riot = require('riot');
const moment = require('moment');
const _ = require('lodash');
const $ = require('jquery')
require('datatables')
require('datatables-bootstrap3-plugin')

const CONSTANTS = require('../../constants/constants')
const raw = require('../components/raw')
require('../tables/all-courses')
require('../tables/my-courses')

const html = `
<div id="my_courses_page" class="portlet box grey-cascade">
    <div class="portlet-title">
        <div class="caption">
            <i class="fa fa-icon-th-large"></i>Courses
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
                <a href="#mycourses_1_{ i }" data-toggle="tab" aria-expanded="{ true: i == 0 }">
                { val.title }</a>
            </li>
        </ul>
        <div class="table-toolbar">

        </div>
        <div class="tab-content">
            <div each="{ val, i in tabs }" class="tab-pane fase in { active: i == 0 }" id="mycourses_1_{ i }">

            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag(CONSTANTS.TAGS.COURSE_LIST, html, function (opts) {

    const MetaMap = require('../../../MetaMap.js');

    this.user = MetaMap.User;
    this.data = [];
    this.menu = null;
    let tabs = [
        { title: 'My Trainings', order: 0, editable: true, columns: [{ name: 'Check', isCheckbox: true }, { name: 'Action' }, { name: 'Created On' }, { name: 'Status' }] },
        { title: 'All Trainings', order: 1, editable: false, columns: [{ name: 'Action' }, { name: 'Created On' }, { name: 'Owner' }] }
    ];
    this.tabs = _.sortBy(tabs, 'order')

    this.currentTab = 'My Trainings';

    //Events
    this.onOpen = (event, ...o) => {
        MetaMap.Router.to(`map/${event.item.id}`);
    }

    this.onTabSwitch = (event, ...o) => {
        this.currentTab = event.item.val.title;
    }

    this.loadTable = (title, i) => {
        try {
            let node = this[`mycourses_1_${i}`]
            let tag = null;
            switch (title) {
                case 'All Trainings':
                    tag = CONSTANTS.TAGS.ALL_COURSES
                    break;
                case 'My Trainings':
                    tag = CONSTANTS.TAGS.MY_COURSES
                    break;
            }
            if (node && tag) {
                this[title] = this[title] || riot.mount(node, tag)[0];
                this[title].update();
            }
        } catch (e) {
            MetaMap.error(e)
        }
    }


    //Riot bindings
    this.on('mount', () => {
        window.NProgress.start();
    });

    this.on('update', () => {
        _.each(this.tabs, (val, i) => {
            this.loadTable(val.title, i)
        })
    })

});