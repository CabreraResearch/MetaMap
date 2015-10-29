const riot = require('riot')
const $ = require('jquery')
const Ps = require('perfect-scrollbar')

const Metronic = require('../../template/metronic')
const raw = require('./raw')
const CONSTANTS = require('../../constants/constants')
const Cortex = require('../../training/cortex')
const AllTags = require('../mixins/all-tags')
const ActionFactory = require('../actions/ActionFactory')

const html =
`
<div id="cortex_outer_shell" class="portlet light bordered" style="padding-top: 0;">

        <div class="portlet-title tabbable-line">
            <div class="caption">
                <img height="39" width="39" class="avatar" alt="" src="{cortex.picture}"/>
                <span class="caption-subject font-dark bold uppercase">Cortex</span>
                <span id="cortex_on_timer" style="display: { none: false == cortex.isTimerOn };">
                    <img alt="" src="src/images/dots_small.gif"/>
                </span>
            </div>
            <ul class="nav nav-tabs" style="display: { none: true == cortex.isTimerOn };">
                <li class="active">
                    <a id="cortex_man_tab" href="#quick_sidebar_tab_1" data-toggle="tab" class="cortex-tabs">Chat</a>
                </li>
                <li>
                    <a id="outline_tab" href="#quick_sidebar_tab_2" data-toggle="tab" class="cortex-tabs" onclick="{updateHeight}">Outline</a>
                </li>
            </ul>
        </div>
        <div class="portlet-body">
            <div class="tab-content">
                <div class="tab-pane active" id="quick_sidebar_tab_1">
                    <div id="cortex_messages" class="cortex-chat" style="position: relative;">
                        <div if="{cortex}" each="{ cortex.userTraining.messages }" class="clear">
                            <div if="{message}" class="from-{ them: author == 'cortex', me: author != 'cortex' }">
                                <div if="{ section_no }" id="training_section_{ section_no }"></div>
                                <div if="{message}">
                                    <span if="{author == 'cortex'}">
                                        <raw content="{ message }"></raw>
                                        <ok if="{action=='ok'}" opts="{this}"></ok>
                                        <more if="{action=='more'}" opts="{this}"></more>
                                        <video-button if="{action=='video'}" opts="{this}"></video-button>
                                    </span>
                                    <span if="{author != 'cortex'}">{message}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <form id="chat_input_form" onsubmit="{ onSubmit }">
                            <div class="input-group">
                                <input id="chat_input" type="text" class="form-control" placeholder="Type a message here...">
                                <div class="input-group-btn">
                                    <button type="submit" class="btn blue"><i class="fa fa-paperclip"></i></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="tab-pane " id="quick_sidebar_tab_2">
                    <div id="cortex_outline" class="">
                        <ol>
                            <li each="{ cortex.getOutline() }" onclick="{ parent.onOutlineClick }" >
                                <h4>
                                    <a if="{ true == archived }" class="list-heading"><i class="fa fa-check-circle"></i> { section }</a>
                                    <span if="{ true != archived }" class="list-heading"><i class="fa fa-circle-thin"></i> { section }</span>
                                </h4>
                                <ol if="{ submenu }">
                                    <li each="{ submenu }" onclick="{ parent.onOutlineClick }" >
                                        <h5>
                                            <a if="{ true == archived }" class="list-heading"><i class="fa fa-check-circle"></i> { section }</a>
                                            <span if="{ true != archived }" class="list-heading"><i class="fa fa-circle-thin"></i> { section }</span>
                                        </h5>
                                    </li>
                                </ol>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`

riot.tag(CONSTANTS.TAGS.SIDEBAR, html, function(opts) {

    this.mixin(AllTags)

    this.userPicture = ''
    this.scrollToBottom = true

    this.on('mount', () => {
        this.userPicture = this.MetaMap.User.picture
    })

    this.setHeight = _.once(() => {
        Ps.initialize(this.cortex_messages, {
            suppressScrollX: true
        })
        _.delay(() => {
            let pos = $(this.cortex_messages).height()*window.innerHeight*1000
            this.cortex_messages.scrollTop = pos
        },500)
    })

    this.updateHeight = () => {
        let height = window.innerHeight-270+'px'
        $(this.cortex_messages).css({ height: height })
        $(this.cortex_outline).css({ height: height })
        let pos = $(this.cortex_messages).height()*window.innerHeight*1000
        this.cortex_messages.scrollTop = pos
        Ps.update(this.cortex_messages)
        return true
    }

	this.on('update', () => {
        if (this.cortex_messages) {
            this.setHeight()
            this.updateHeight()
        }
	})

    $(window).resize(() => {
        this.updateHeight()
    })

    this.getPosition = (id) => {
        let el = $(document.getElementById(id))

        let pos = (el && el.size() > 0) ? el.offset().top : 0
        if ($(document.getElementById('page_body')).hasClass('page-header-fixed')) {
            pos = pos - $('.page-header').height();
        } else if ($(document.getElementById('page_body')).hasClass('page-header-top-fixed')) {
            pos = pos - $('.page-header-top').height();
        } else if ($(document.getElementById('page_body')).hasClass('page-header-menu-fixed')) {
            pos = pos - $('.page-header-menu').height();
        }
        pos = pos + el.height();
        return pos
    }

    this.onOutlineClick = (e) => {
        $(this.cortex_man_tab).tab('show')

        let pos = this.getPosition(`training_section_${e.item.section_no}`)

        this.cortex_messages.scrollTop = pos
        Ps.update(this.cortex_messages)
    }

    this.onActionClick = (e) => {
        if(e.item && e.item.action) {
            this.cortex.processUserResponse({
                action: e.item.action,
                data: _.extend({}, e.target.dataset)
            }, e.item)
        }
    }

	this.onSubmit = (obj) => {
		this.cortex.processUserResponse({
			message: this.chat_input.value
        })

		this.chat_input.value = ''
		this.update()
	}

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_EVENT, () => {
        this.updateHeight()
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.PLAY_VIDEO, (data) => {
        if (data) {
            this.currentVideo = data.id
            $(`#${data.id}_video_done`).show()
            $(`#${data.id}_video_play`).hide()
            this.updateHeight()
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.STOP_VIDEO, (data) => {
        if (data) {
            this.currentVideo = null
            $(`#${data.id}_video_done`).hide()
            $(`#${data.id}_video_play`).show()
            this.updateHeight()
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, (id) => {
        this.cortex = this.cortex || this.MetaMap.getCortex(id)
        this.actionFactory = this.actionFactory || new ActionFactory(this.cortex)

        this.cortex.getData((data) => {
            this.update()
        })
    })

})