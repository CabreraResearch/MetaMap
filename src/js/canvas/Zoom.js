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


        this.slider = noUiSlider.create(this.el, {
            start: [Math.round(this.jsRenderer.getZoom())],
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
            this.jsRenderer.setZoom(values[0])
        })
        /*

        */

    }

}

module.exports = Zoom