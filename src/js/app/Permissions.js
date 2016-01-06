class Permissions {

    constructor(map) {
        this.map = map || {}
        this.permitAll = this.map.isTraining || false
        this.Homunculus = require('../../Homunculus')
    }

    canEdit() {
        return this.isMapOwner() || this.isSharedEdit()
    }

    canView() {
        return this.isMapOwner() || this.isSharedView()
    }

    isMapOwner() {
        return this.permitAll || (this.map && this.map.owner.userId == this.Homunculus.User.userId)
    }

    isSharedEdit() {
        return this.permitAll ||
            (this.map &&
                this.map.shared_with &&
                    (this.Homunculus.User.isAdmin ||
                    (this.map.shared_with[this.Homunculus.User.userId] && this.map.shared_with[this.Homunculus.User.userId].write == true) ||
                    (this.map.shared_with['*'] && this.map.shared_with['*'].write == true)))
    }

    isSharedView() {
        return this.permitAll ||
            (this.map &&
                this.isSharedEdit() ||
                    (this.map.shared_with[this.Homunculus.User.userId] && this.map.shared_with[this.Homunculus.User.userId].read == true) ||
                    (this.map.shared_with['*'] && this.map.shared_with['*'].read == true))
    }
}

module.exports = Permissions;