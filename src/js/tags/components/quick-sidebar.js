const riot = require('riot');
const moment = require('moment')
const Ps = require('perfect-scrollbar');

const raw = require('./raw');
const CONSTANTS = require('../../constants/constants');

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
                            <div class="page-quick-sidebar-chat-user-messages">
                                <div each="{ messages }" class="post { out: author == 'cortex', in: author != 'cortex' }">
                                    <img height="39" width="39" class="avatar" alt="" src="{ picture }"/>
                                    <div class="message">
                                        <span class="arrow"></span>
                                        <a href="javascript:;" class="name">{ name }</a>
                                        <span class="datetime">{ parent.getRelativeTime(time) }</span>
                                        <span class="body">
                                        <raw content="{ message }"></raw> </span>
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
                        <h3 class="list-heading">Intro</h3>
                        <h3 class="list-heading">Section 1</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`

riot.tag('quick-sidebar', html, function(opts) {

	this.cortexPicture = 'src/images/cortex-avatar-small.jpg';
	this.messages = [{
		message: `Hello, I'm Cortex Man. Ask me anything. Try <code>/help</code> if you get lost.`,
		author: 'cortex',
		picture: this.cortexPicture,
		time: new Date()
	}];

	const MetaMap = require('../../../MetaMap');

	this.on('update', () => {});

	this.on('mount', () => {

		this.update();
	});

	this.getDisplay = () => {
		if (!this.display) {
			return 'display: none;';
		} else {
			return '';
		}
	}

	this.getRelativeTime = (date = new Date()) => {
		return moment(date).fromNow();
	}

	this.onSubmit = (obj) => {
		this.messages.push({
			message: this.chat_input.value,
			author: MetaMap.User.userName,
			picture: MetaMap.User.picture,
			time: new Date()
		})
		this.messages.push({
			message: `You asked me ${this.chat_input.value}. That's great!`,
			author: 'cortex',
			picture: this.cortexPicture,
			time: new Date()
		})
		this.chat_input.value = ''
		this.update();
		this.chat_body.scrollTop = this.chat_body.scrollHeight
		Ps.update(this.chat_body)
	}

	this.toggle = (state) => {
		this.display = state;
		this.update();
	}

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, function () {
        $('body').removeClass('page-quick-sidebar-open')
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, function () {
        $('body').addClass('page-quick-sidebar-open')
    });

});
