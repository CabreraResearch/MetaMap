const riot = require('riot')
const pageBody = require('../tags/page-body.js')
const CONSTANTS = require('../constants/constants')
const Actions = require('../actions/Action.js')
const Metronic = require('../template/metronic')
const Layout = require('../template/layout')
const Demo = require('../template/demo')
const _ = require('lodash')

class PageFactory {
    constructor(eventer, metaFire) {
        this.metaFire = metaFire
        this.eventer = eventer
        this.actions = new Actions(metaFire, eventer, this)
        this.onReady()
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                $(`#${CONSTANTS.ELEMENTS.META_PROGRESS}`).remove()
                riot.mount('*')
                window.NProgress.configure({ parent: `#${CONSTANTS.ELEMENTS.META_PROGRESS_NEXT}` })

                _.delay(() => {
                    Metronic.init() // init metronic core componets
                    Layout.init() // init layout
                    Demo.init() // init demo features

                    fulfill()
                }, 250)
            })
        }
        return this._onReady
    }

    get pages() {
        this._pages = this._pages || [CONSTANTS.PAGES.HOME, CONSTANTS.PAGES.MY_MAPS, CONSTANTS.PAGES.MAP, CONSTANTS.PAGES.TERMS_AND_CONDITIONS, CONSTANTS.PAGES.COURSE_LIST, CONSTANTS.PAGES.TRAININGS]
        return this._pages
    }

    isActionPage(action) {
        return _.contains(this.pages, action)
    }

    navigate(path, id, action, ...params) {
        //The router may need to update, but the page doesn't always have to refresh
        //If we're on a page and execute a non-page action (Print, About, etc)
        //there's no need to run the action again
        let isActionNeeded = true
        if(this.isActionPage(path)) {
            if(this.currentPageId == id && this.currentPath == path) {
                isActionNeeded = false
            } else {
                this.currentPath = path
                this.currentPageId = id
            }
        }
        if(isActionNeeded) {
            let act = this.actions.act(path, id, action, ...params)
            if (!act) {
                this.eventer.do(path, path, { id: id, action: action }, ...params)
            }
        }
    }
}

module.exports = PageFactory