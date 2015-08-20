const EVENTS = require('../constants/events');

class ActionBase {
    constructor(metaFire, eventer, pageFactory) {
        this.metaFire = metaFire;
        this.eventer = eventer;
        this.pageFactory = pageFactory;
        this.metaMap = require('../../MetaMap.js');
    }

    act() {
        
    }
    
    toggleSidebar() {
        if(this.sidebarOpen) {
            this.openSidebar();
        } else {
            this.closeSidebar();
        }
    }
    
    openSidebar() {
        this.sidebarOpen = true;
        this.eventer.do(EVENTS.SIDEBAR_OPEN);
    }
    
    closeSidebar() {
        this.sidebarOpen = false;
        this.eventer.do(EVENTS.SIDEBAR_CLOSE);
    }
}

module.exports = ActionBase;