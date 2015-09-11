const riot = require('riot');
const moment = require('moment')
const Ps = require('perfect-scrollbar');

const CONSTANTS = require('../../constants/constants');

const html = `
<div class="page-sidebar-wrapper" style="{ getDisplay() }">
    <div id="chat_shell" class="page-sidebar panel" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
        <div class="panel-heading">
            <div id="bot_title" class="panel-title chat-welcome">Cortex Man</div>
        </div>
        <div id="chat_body" class="panel-body" style="position: absolute;">
            <ul class="media-list example-chat-messages" id="example-messages">
                <li class="media">
                    <div class="media-body">
                        <div class="media">
                            <a class="pull-left" href="#"><img height="39" width="39" class="media-object img-circle" src="{ cortexPicture }"></a>
                            <div class="media-body bubble">Hello, I'm Cortex Man. Ask me anything. Try <code>/help</code> if you get lost.<small class="text-muted"><br>{ getRelativeTime() }</small></div>
                        </div>
                    </div>
                </li>
                <li each="{ messages }" class="media">
                    <div class="media-body">
                        <div class="media">
                            <a class="pull-{ left: author == 'cortex', right: author != 'cortex' }" href="#"><img height="39" width="39" class="media-object img-circle" src="{ picture }"></a>
                            <div class="media-body bubble">{ message }<small class="text-muted"><br>{ parent.getRelativeTime(time) }</small></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="panel-footer" style="position: fixed; width: 233px; bottom: 24px;">
            <div class="row">
                <div class="col-lg-12">
                    <form onsubmit="{ onSubmit }">
                        <div class="input-group">
                            <input id="chat_input" type="text" class="form-control" placeholder="Enter message...">
                            <span class="input-group-btn">
                                <button class="btn btn-default" type="submit">Send</button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
`

riot.tag('chat', html, function (opts) {

    this.messages = [];
    this.cortexPicture = 'src/images/cortex-avatar-small.jpg';

    const MetaMap = require('../../../MetaMap');

    this.correctHeight = () => {
        this.chat_shell.style.height = (window.innerHeight - 120) + 'px'
        this.chat_body.style.height = (window.innerHeight - 267) + 'px'
        Ps.update(this.chat_body);
    }

    $(window).resize(() => {
        this.correctHeight();
    });

    this.on('update', () => {
        this.correctHeight();
    });

    this.on('mount', () => {
        Ps.initialize(this.chat_body);
        this.update();
    });

    this.getDisplay = () => {
        if(!this.display) {
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

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_TOGGLE, () => {
        this.toggle(!this.display);
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
        this.toggle(false);
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, () => {
        this.toggle(true);
    });

});