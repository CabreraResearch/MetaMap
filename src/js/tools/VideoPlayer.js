const Promise = require('bluebird')

class VideoPlayer {
    constructor(divId, opts = { videoId: ''}) {
        this.id = divId
        this.opts = opts
        this.metaMap = require('../../MetaMap')
        this.init()
    }

    onReady() {
        this._onReady = this._onReady || new Promise((resolve, reject) => {
            let wait = () => {
                if (window.YT && window.YT.loaded==1) {
                    this.YT = window.YT
                    resolve(window.YT)
                } else {
                    setTimeout(wait, 250)
                }
            }
            wait()
        })
        return this._onReady
    }

    init() {
        this.onReady().then(() => {
            this.player = this.player || new this.YT.Player(this.id, {
                videoId: this.opts.videoId,
                frameborder: 0,
                height: this.opts.height || 360,
                width: this.opts.width || 640,
                events: {
                    onReady: (event) => {
                        this.onPlayerReady(event)
                    },
                    onStateChange: (event) => {
                        this.onPlayerStateChange(event)
                    }
                }
            })
        })
    }

    onPlayerReady(event) {
        event.target.playVideo()
    }

    onPlayerStateChange(event) {
        if (event.data == window.YT.PlayerState.ENDED) {
            this.done = true
            if (this.opts.onFinish) {
                this.opts.onFinish()
            }
        }
    }

    get isDone() {
        return this.done == true
    }

    stopVideo() {
        this.player.stopVideo()
    }

    destroy() {
        if (this.player) {
            try {
                this.player.destroy()
            } catch (e) {
                console.log(e)
            } finally {
                this.player = null
            }
        }
    }

}

module.exports = VideoPlayer