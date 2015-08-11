const riot = require('riot');

module.exports = riot.tag('link', '<span></span>', function (opts) {
    this.updateContent = function () {
        this.root.innerHTML = (opts) ? (opts.content || '') : '';
    };

    this.on('update', () => {
        this.updateContent();
    });

    this.updateContent();
});