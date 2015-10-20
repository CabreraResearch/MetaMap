const riot = require('riot')
const NProgress = window.NProgress
const CONSTANTS = require('../../constants/constants')
const VideoPlayer = require('../../tools/VideoPlayer')
const TrainingMix = require('../mixins/training-mix')

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

    this.mixin(TrainingMix)

    this.training = {}

    this.on('mount update', (event, opts) => {
        if (opts) {
            this.config = opts
            this.getData(this.config.id)
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