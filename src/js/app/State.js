
class State {

    constructor() {
        this.defaultState = {
            showNavigator: false,
            currentTab: null,
            perspectivePointKey: null,
            distinctionThingKey: null
        };
    }

    setStateData(data) {
        this.state = data || this.defaultState;
        //    //$scope.currentTab = self.state.currentTab;
    }

    // TODO: Save state more frequently?? Currently it is only saved when autosave is triggered by other actions...
    getStateData () {
        return this.state;
    }
}