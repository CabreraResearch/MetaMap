const riot = require('riot');
const NProgress = window.NProgress;
const CONSTANTS = require('../../constants/constants');

const html = `
<div id="training_portlet" class="portlet light">
				<div class="portlet-body">
					<div class="row margin-bottom-30">
						
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