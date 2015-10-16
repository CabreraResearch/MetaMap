const riot = require('riot');
const NProgress = window.NProgress;
const CONSTANTS = require('../../constants/constants');

const html = `
<div class="portlet light">
				<div class="portlet-body">
					<div class="row margin-bottom-30">
						<div if="{ training }" class="col-md-12">
                            <h1>{ training.name }</h1>
                            <p>{ training.text }</p>
						</div>
					</div>
				</div>
			</div>
`;

module.exports = riot.tag(CONSTANTS.PAGES.TRAINING, html, function(opts) {

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

});