class Permissions {

    constructor(map) {
        this.map = map
        this.metaMap = require('../../MetaMap')
    }

    canEdit() {
        return this.isMapOwner() || this.isSharedEdit()
    }

    isMapOwner() {
        return this.map && this.map.owner.userId == this.metaMap.User.userId
    }

    isSharedEdit() {
        return this.map &&
            this.map.shared_with &&
                (this.metaMap.User.isAdmin ||
                (this.map.shared_with[this.metaMap.User.userId] && this.map.shared_with[this.metaMap.User.userId].write == true) ||
                (this.map.shared_with['*'] && this.map.shared_with['*'].write == true))
    }
}

module.exports = Permissions;