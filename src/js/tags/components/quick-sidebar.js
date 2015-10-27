const riot = require('riot')

const Metronic = require('../../template/metronic')
const raw = require('./raw')
const CONSTANTS = require('../../constants/constants')
const Cortex = require('../../training/cortex')
const AllTags = require('../mixins/all-tags')
const ActionFactory = require('../actions/ActionFactory')

const html =
`
<div class="portlet light bordered">

        <div class="portlet-title tabbable-line">
            <div class="caption">
                <img height="39" width="39" class="avatar" alt="" src="{cortex.picture}"/>
                <span class="caption-subject font-dark bold uppercase">Cortex</span>
                <span id="cortex_on_timer" style="display: { none: cortex.isTimerOff };">
                    <img height="39" alt="" src="src/images/dots.gif"/>
                </span>
            </div>
            <ul class="nav nav-tabs">
                <li class="active">
                    <a id="cortex_man_tab" href="#quick_sidebar_tab_1" data-toggle="tab" style="color: #7FB0DA;">
                    Chat
                    </a>
                </li>
                <li>
                    <a id="outline_tab" href="#quick_sidebar_tab_2" data-toggle="tab" style="color: #7FB0DA;">
                    Outline
                    </a>
                </li>
            </ul>
        </div>
        <div class="portlet-body">
            <div class="tab-content">
                <div class="tab-pane active" id="quick_sidebar_tab_1">
                    <div id="cortex_messages" class="cortex-chat">
                        <div if="{cortex}" each="{ cortex.userTraining.messages }" class="clear">
                            <div if="{message}" class="from-{ them: author == 'cortex', me: author != 'cortex' }">
                                <div if="{ section_no }" id="training_section_{ section_no }"></div>
                                <div if="{message}">
                                    <span if="{author == 'cortex'}">
                                        <raw content="{ message }"></raw>
                                        <likert if="{action=='likert'}" opts="{this}"></likert>
                                        <ok if="{action=='ok'}" opts="{this}"></ok>
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
                    <div class="">
                        <ol>
                            <li each="{ cortex.getOutline() }" onclick="{ parent.onOutlineClick }" >
                                <a if="{ true == archived }" class="list-heading">{ section }</a>
                                <span if="{ true != archived }" class="list-heading">{ section }</span>
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
    const MetaMap = require('../../../MetaMap')

    this.userPicture = ''
    this.scrollToBottom = true

    this.on('mount', () => {
        this.userPicture = MetaMap.User.picture
    })

	this.on('update', () => {
        if (this.cortex_messages) {
            if (this.scrollToBottom == true) {
                _.delay(() => {
                    $(this.cortex_messages).slimScroll({ scrollTo: `1000px`, height: window.innerHeight - 290 + 'px' })
                }, 250)
            }
        }
	})

    $(window).resize(() => {
        this.update()
    })

    this.onOutlineClick = (e) => {
        $(this.cortex_man_tab).tab('show')
        this.scrollToBottom = false
        let offset = ((+e.item.section_no.split('-').join('.'))-1)*100

        $(this.cortex_messages).slimScroll({ scrollTo: offset + 'px' })
        let that = this
        let cb = (e, pos) => {
            that.scrollToBottom = true
            $(that.cortex_messages).slimScroll().off('slimscroll', cb)
        }
        $(this.cortex_messages).slimScroll().on('slimscroll', cb)

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

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.PLAY_VIDEO, (data) => {
        if (data) {
            this.currentVideo = data.id
            $(`#${data.id}_video_done`).show()
            $(`#${data.id}_video_play`).hide()
        }
    })

    this.MetaMap.Eventer.on(CONSTANTS.EVENTS.STOP_VIDEO, (data) => {
        if (data) {
            this.currentVideo = null
            $(`#${data.id}_video_done`).hide()
            $(`#${data.id}_video_play`).show()
        }
    })

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, (id) => {
        this.cortex = this.cortex || MetaMap.getCortex(id)
        this.actionFactory = this.actionFactory || new ActionFactory(this.cortex)

        this.cortex.getData((data) => {
            this.update()
        })
    })

})