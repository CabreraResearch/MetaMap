const jsPlumb = window.jsPlumb
const jsPlumbToolkit = window.jsPlumbToolkit
const jsPlumbUtil = window.jsPlumbUtil

const _CanvasBase = require('./_CanvasBase')
const $ = require('jquery')
const _ = require('lodash')
const noUiSlider = require('nouislider')

class Zoom extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        this.el = document.getElementById('zoom-widget')

        this.currentZoom = Math.round(this.jsRenderer.getZoom())
        this.slider = noUiSlider.create(this.el, {
            start: [this.currentZoom],
            orientation: 'vertical',
            snap: true,
            direction: 'rtl',
            range: {
                min: 0,
                '8%': 0.1,
                '16%': 0.2,
                '24%': 0.3,
                '32%': 0.4,
                '40%': 0.5,
                '48%': 0.6,
                '56%': 0.7,
                '64%': 0.8,
                '72%': 0.9,
                '80%': 1,
                '88%': 2,
                max: 3
            }
        })

        this.slider.on('update', ( values, handle, unencoded, tap ) => {
            let val = 0.1
            let zoom = values[0]
            if(zoom != this.currentZoom) {
                if(zoom < this.currentZoom) {
                    val = -val
                    if(zoom > 1) {
                        val = -1
                    }
                } else {
                    if(zoom >= 1) {
                        val = 1
                    }
                }
                this.currentZoom = zoom
                this.jsRenderer.nudgeZoom(val)
            }
        })
        /*

        */

    }

}

module.exports = Zoom