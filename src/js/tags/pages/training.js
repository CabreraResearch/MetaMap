const riot = require('riot')
const NProgress = window.NProgress
const CONSTANTS = require('../../constants/constants')
const VideoPlayer = require('../../tools/VideoPlayer')

const html = `
<div id="training_portlet" class="portlet light">
    <div class="portlet-body">
        <div class="row margin-bottom-30">
            <div class="col-md-8 col-md-offset-4">
                <div class="embed-responsive embed-responsive-16by9">
                    <div id="training_player" ></div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

module.exports = riot.tag(CONSTANTS.TAGS.TRAINING, html, function(opts) {

    const MetaMap = require('../../../MetaMap.js');

    this.training = {}

    const saveTraining = () => {
        MetaMap.MetaFire.setData(this.userTraining, `${CONSTANTS.ROUTES.TRAININGS.format(MetaMap.User.userId)}${this.config.id}`)
    }

    const getData = _.once(() => {
        if (this.config.id) {
            var once = _.once(()=>{
                MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.TRAININGS.format(MetaMap.User.userId)}${this.config.id}`, (data) => {
                    this.userTraining = data
                    if(!data) {
                        this.userTraining = this.training
                        saveTraining()
                    }
                    this.update();
                    NProgress.done();
                });
                MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_OPEN);
            });

            MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.COURSE_LIST}${this.config.id}`, (data) => {
                this.training = data;
                MetaMap.Eventer.do(CONSTANTS.EVENTS.PAGE_NAME, data);

                this.update();
                once()
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