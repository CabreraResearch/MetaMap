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
                    this.YT = window.YT;
                    resolve(window.YT)
                } else {
                    setTimeout(wait, 250)
                }
            }
            wait()
        })
        return this._onReady;
    }

    init() {
        this.onReady().then(() => {
            this.player = new this.YT.Player(this.id, {
                videoId: this.opts.videoId,
                frameborder: 0,
                events: {
                    onReady: this.onPlayerReady,
                    onStateChange: this.onPlayerStateChange
                }
            });
        });
    }

    onPlayerReady(event) {
        event.target.playVideo();
    }

    onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
            this.done = true;
        }
    }

    get isDone() {
        return this.done == true
    }

    stopVideo() {
        this.player.stopVideo();
    }

}

module.exports = VideoPlayer;