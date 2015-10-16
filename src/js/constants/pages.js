const ACTIONS = require('./actions.js');
const _ = require('lodash');

const PAGES = {
    MAP: 'map',
    NEW_MAP: 'new_map',
    COPY_MAP: 'copy_map',
    DELETE_MAP: 'delete_map',
    MY_MAPS: 'mymaps',
    TERMS_AND_CONDITIONS: 'terms',
    HOME: 'home',
    COURSE_LIST: 'course_list',
    TRAINING: 'training'
};

_.extend()

Object.freeze(PAGES);

module.exports = PAGES;