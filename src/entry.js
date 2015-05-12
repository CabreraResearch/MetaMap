
riot = require('riot');
require('jquery');
require('lodash');
//require('./js/integrations/auth0');
require('./js/integrations/googleanalytics');
require('./js/integrations/newrelic');
require('./js/integrations/raygun');
require('./js/integrations/usersnap');

require('./tags/footer.tag');
riot.mount('*');