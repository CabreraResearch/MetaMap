const riot = require('riot');
const CONSTANTS = require('../constants/constants');
const _ = require('lodash');

const html = `
<div class="page-content-wrapper">
    <div id="page-content" class="page-content">

        <div class="page-head"></div>

        <div id="app-container"></div>
    </div>
</div>
`;

module.exports = riot.tag('page-content', html, function (opts) {

    const Homunculus = require('../../Homunculus');

    this.on('update', () => {
        this.resize()
    })

    this.resize = () => {
        let width = `${window.innerWidth - 40}px`;
        $(this['app-container']).css({ width: width });
    }

    $(window).on('resize', () => {
        this.resize()
    });

});