const riot = require('riot')
const NProgress = window.NProgress
const CONSTANTS = require('../../constants/constants')
const VideoPlayer = require('../../tools/VideoPlayer')

const html = `
<div id="training_portlet" class="portlet light">
				<div class="portlet-body">
					<div class="row margin-bottom-30">
                        <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">

				        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div id="training_player"></div>
				        </div>
					</div>
				</div>
			</div>
`;

module.exports = riot.tag(CONSTANTS.TAGS.TRAINING, html, function(opts) {

    const MetaMap = require('../../../MetaMap.js');

    this.training = {}

    const getData = _.once(() => {
        if (this.config.id) {
            MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.COURSE_LIST}${this.config.id}`, (data) => {
                this.training = data;
                MetaMap.Eventer.do(CONSTANTS.EVENTS.PAGE_NAME, data);

                this.update();

                NProgress.done();
            });
        }
    });

    this.on('mount update', (event, opts) => {
        if (opts) {
            this.config = opts
            getData()
            this.player = new VideoPlayer('training_player', {height: 390, width: 640, videoId: 'dUqRTWCdXt4'})
        }
    });

    this.correctHeight = () => {
        $(this.training_portlet).css({
            height: window.innerHeight - 120 + 'px'
        });
    }

    this.on('update', () => {
        this.correctHeight();
    });

    $(window).resize(() => {
        this.correctHeight();
    });

});