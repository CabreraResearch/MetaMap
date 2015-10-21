const CONSTANTS = {
	ACTIONS: require('./actions'),
	CANVAS: require('./canvas'),
	CORTEX: require('./cortex'),
	DSRP: require('./dsrp'),
	EDIT_STATUS: require('./editStatus'),
	ELEMENTS: require('./elements'),
    EVENTS: require('./events'),
    NOTIFICATION: require('./notification'),
	PAGES: require('./pages'),
	ROUTES: require('./routes'),
	TABS: require('./tabs'),
	TAGS: require('./tags')
};

Object.freeze(CONSTANTS);

module.exports = CONSTANTS;