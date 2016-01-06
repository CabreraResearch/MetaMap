const riot = require('riot');
const $ = require('jquery')
const _ = require('lodash')
const CONSTANTS = require('../../constants/constants');

const html = `
<div class="portlet light">
				<div class="portlet-body">
					<div class="row margin-bottom-30">
						<div if="{ header }" class="col-md-12">
                            <h1>{ header.title }</h1>
                            <p>{ header.text }</p>
						</div>
					</div>
                    <div each="{ areas }">
                        <div class="headline">
    						<h3>{ title }</h3>
    					</div>
                        <div>
                            <p>{ text }</p>
                        </div>
                        <ul class="list-unstyled margin-top-10 margin-bottom-10">
							<li each="{ items }">
								<i class="{ icon }"></i> <b>{ title }</b> { text }
							</li>
						</ul>
                    </div>
				</div>
			</div>
`;

module.exports = riot.tag('terms', html, function(opts) {

    const Homunculus = require('../../../Homunculus.js');

    this.areas = []
    this.header = {}

    Homunculus.MetaFire.on(CONSTANTS.ROUTES.TERMS_AND_CONDITIONS, (data) => {
        this.areas = _.filter(_.sortBy(data.sections, 'order'), (d) => {
            let include = d.archive != true;
            if(include) {
                d.items = _.filter(_.sortBy(d.items, 'order'), (d) => {
                    let include2 = d.archive != true;
                    return include2;
                });
            }
            return include;
        });

        this.header = data.header;
        this.userName = Homunculus.User.fullName;

        this.update();

        window.NProgress.done();
    });
});