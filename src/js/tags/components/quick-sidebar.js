const riot = require('riot')

const Metronic = require('../../template/metronic')
const raw = require('./raw')
const CONSTANTS = require('../../constants/constants')
const Cortex = require('../../training/cortex')
const AllTags = require('../mixins/all-tags')
const ActionFactory = require('../actions/ActionFactory')

const html =
`
<div class="page-quick-sidebar-wrapper">
    <div class="page-quick-sidebar">
        <div class="nav-justified">
            <ul class="nav nav-tabs nav-justified">
                <li class="active">
                    <a href="#quick_sidebar_tab_1" data-toggle="tab">
                    Cortex Man
                    </a>
                </li>
                <li>
                    <a href="#quick_sidebar_tab_2" data-toggle="tab">
                    Outline
                    </a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active page-quick-sidebar-chat page-quick-sidebar-content-item-shown" id="quick_sidebar_tab_1">
                    <div class="page-quick-sidebar-chat-users" data-rail-color="#ddd" data-wrapper-class="page-quick-sidebar-list">
                    </div>
                    <div class="page-quick-sidebar-item">
                        <div class="page-quick-sidebar-chat-user">
                            <div id="cortex_messages" class="page-quick-sidebar-chat-user-messages">
                                <div if="{cortex}" each="{ cortex.userTraining.messages }" class="post { out: author == 'cortex', in: author != 'cortex' }">
                                    <img if="{message}" height="39" width="39" class="avatar" alt="" src="{ author == 'cortex' ? parent.cortex.picture : parent.userPicture }"/>
                                    <div if="{message}" class="message">
                                        <span class="arrow"></span>
                                        <a href="javascript:" class="name">{ name }</a>
                                        <span class="datetime">{ parent.getRelativeTime(time) }</span>
                                        <span if="{author == 'cortex'}" class="body">
                                            <raw content="{ message }"></raw>
                                            <likert if="{action=='likert'}" opts="{this}"></likert>
                                            <ok if="{action=='ok'}" opts="{this}"></ok>
                                            <video-button if="{action=='video'}" opts="{this}"></video-button>
                                        </span>
                                        <span if="{author != 'cortex'}" class="body">{message}</span>
                                    </div>
                                </div>
                                <div id="cortex_on_timer" class="post out" style="display: { none: cortex.isTimerOff };">
                                    <img height="39" width="39" class="avatar" alt="" src="{ cortex.picture }"/>
                                    <div class="message">
                                        <span class="arrow"></span>
                                        <span class="body">
                                            <img alt="" src="src/images/typing.gif"/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="page-quick-sidebar-chat-user-form">
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
                    </div>
                </div>
                <div class="tab-pane page-quick-sidebar-alerts" id="quick_sidebar_tab_2">
                    <div class="page-quick-sidebar-alerts-list">
                        <ol>
                            <li each="{ cortex.getOutline() }"><a class="list-heading">{ section }</a></li>
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

    this.on('mount', () => {
        this.userPicture = MetaMap.User.picture
    })

	this.on('update', () => {
        handleQuickSidebarToggler() // handles quick sidebar's toggler
        handleQuickSidebarChat() // handles quick sidebar's chats
        handleQuickSidebarAlerts() // handles quick sidebar's alerts
        if (this.cortex_messages) {
            _.delay(() => {
                $(this.cortex_messages).slimScroll({ scrollBy: '600px' })
            }, 250)
        }
	})

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

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
        $('body').removeClass('page-quick-sidebar-open')
    })

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, (id) => {
        this.cortex = this.cortex || MetaMap.getCortex(id)
        this.actionFactory = this.actionFactory || new ActionFactory(this.cortex)

        this.cortex.getData((data) => {
            this.update()
        })
        $('body').addClass('page-quick-sidebar-open')
    })

})

//Template logic

// Handles quick sidebar toggler
var handleQuickSidebarToggler = function () {
    // quick sidebar toggler
    $('.page-header .quick-sidebar-toggler, .page-quick-sidebar-toggler').click(function (e) {
        $('body').toggleClass('page-quick-sidebar-open')
    })
}

// Handles quick sidebar chats
var handleQuickSidebarChat = function () {
    var wrapper = $('.page-quick-sidebar-wrapper')
    var wrapperChat = wrapper.find('.page-quick-sidebar-chat')

    var initChatSlimScroll = function () {
        var chatUsers = wrapper.find('.page-quick-sidebar-chat-users')
        var chatUsersHeight

        chatUsersHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight()

        // chat user list
        Metronic.destroySlimScroll(chatUsers)
        chatUsers.attr("data-height", chatUsersHeight)
        Metronic.initSlimScroll(chatUsers)

        var chatMessages = wrapperChat.find('.page-quick-sidebar-chat-user-messages')
        var chatMessagesHeight = chatUsersHeight - wrapperChat.find('.page-quick-sidebar-chat-user-form').outerHeight() - wrapperChat.find('.page-quick-sidebar-nav').outerHeight()

        // user chat messages
        Metronic.destroySlimScroll(chatMessages)
        chatMessages.attr("data-height", chatMessagesHeight)
        Metronic.initSlimScroll(chatMessages)
    }

    initChatSlimScroll()
    Metronic.addResizeHandler(initChatSlimScroll) // reinitialize on window resize

    wrapper.find('.page-quick-sidebar-chat-users .media-list > .media').click(function () {
        wrapperChat.addClass("page-quick-sidebar-content-item-shown")
    })

    wrapper.find('.page-quick-sidebar-chat-user .page-quick-sidebar-back-to-list').click(function () {
        wrapperChat.removeClass("page-quick-sidebar-content-item-shown")
    })
}

// Handles quick sidebar tasks
var handleQuickSidebarAlerts = function () {
    var wrapper = $('.page-quick-sidebar-wrapper')
    var wrapperAlerts = wrapper.find('.page-quick-sidebar-alerts')

    var initAlertsSlimScroll = function () {
        var alertList = wrapper.find('.page-quick-sidebar-alerts-list')
        var alertListHeight

        alertListHeight = wrapper.height() - wrapper.find('.nav-justified > .nav-tabs').outerHeight()

        // alerts list
        Metronic.destroySlimScroll(alertList)
        alertList.attr("data-height", alertListHeight)
        Metronic.initSlimScroll(alertList)
    }

    initAlertsSlimScroll()
    Metronic.addResizeHandler(initAlertsSlimScroll) // reinitialize on window resize
}