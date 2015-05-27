const Analytics = require('./Analytics.js');
const Attachments = require('./Attachments.js');
const Autosave = require('./autosave.js');
const Generator = require('./generator.js');
const Layouts = require('./Layouts.js');
const Perspectives = require('./Perspectives.js');
const Presenter = require('./Presenter.js');
const Templates = require('./Templates.js');
const UI = require('./UI.js');

class EditorConfig {
    constructor(editor, map) {
        this.editor = editor;
        this.map = map;
        this.analytics = new Analytics(editor, map);
        this.attachments = new Attachments(editor, map);
        this.autosave = new Autosave(editor, map);
        this.generator = new Generator(editor, map);
        this.layouts = new Layouts(editor, map);
        this.perspectives = new Perspectives(editor, map);
        this.presenter = new Presenter(editor, map);
        //this.standards = new SandbankEditor.Standards(editor, map);
        this.templates = new Templates(editor, map);
        //this.tests = new SandbankEditor.Tests(editor, map);
        this.ui = new UI(editor, map);
    }

}

module.exports = EditorConfig;