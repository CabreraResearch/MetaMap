const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
const $ = require('jquery')
const jsPsych = require('../../../vendor/jspsych/jspsych')
require('../../../vendor/jspsych/jspsych-survey-likert')

const html = `
<div id="canvas_training_likert" style="border: 1px solid #e1e1e1 !important; border-radius: 5px;">
    <div class="portlet light">
        <div if="{ true != archived }" class="portlet-body">
            <div if="{range}" class="input-group">
                <div id="likert_scale"></div>
            </div>
            <div class="finish">
                <a if="{ hasFinish }" onclick="{ onFinish }" class="btn red">Finished <i class="fa fa-check-circle"></i></a>
            </div>
        </div>
    </div>
</div>

<style scoped>
/*
 * CSS for jsPsych experiments.
 *
 * This stylesheet provides minimal styling to make jsPsych
 * experiments look polished without any additional styles.
 *
 */

/*
 *
 * fonts and type
 *
 */

@import url(https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,400,700);

html {
 font-family: 'Open Sans', 'Arial', sans-serif;
 font-size: 18px;
 line-height: 1.6em;
}

body {
	margin: 0;
	padding: 0;
}

p {
    clear:both;
}

.very-small {
    font-size: 50%;
}

.small {
    font-size: 75%;
}

.large {
    font-size: 125%;
}

.very-large {
    font-size: 150%;
}

/*
 *
 * Classes for changing location of things
 *
 */

.left {
    float: left;
}

.right {
    float: right;
}

.center-content {
    text-align: center;
}

/*
 *
 * Form elements like input fields and buttons
 *
 */

input[type="text"] {
    font-family: 'Open Sans', 'Arial', sans-sefif;
    font-size: 14px;
}

button {
    padding: 0.8em;
    background-color: #eaeaea;
    border: 1px solid #eaeaea;
    color: #555;
    font-weight: bold;
    font-family: 'Open Sans', 'Arial', sans-serif;
    font-size: 14px;
    cursor: pointer;
}

button:hover {
    border:1px solid #ccc;
}

/*
 *
 * Container holding jsPsych content
 *
 */


.jspsych-display-element {
    width: 800px;
    margin: 50px auto 50px auto;
}

/*
 *
 * jsPsych progress bar
 *
 */

#jspsych-progressbar-container {
	color: #777;
	border-bottom: 2px solid #dedede;
	background-color: #f3f3f3;
	margin-bottom: 1em;
	text-align: center;
	padding: 10px 0px;
}

#jspsych-progressbar-container s {

}

#jspsych-progressbar-outer {
	background-color: #dedede;
	border-radius: 5px;
	padding: 1px;
	width: 800px;
	margin: auto;
}

#jspsych-progressbar-inner {
	background-color: #aaa; /* #3EB3D7; */
	width: 0%;
	height: 1em;
	border-radius: 5px;
}

/*
 *
 * PLUGIN: jspsych-animation
 *
 */

#jspsych-animation-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/*
 *
 * PLUGIN: jspsych-categorize-animation
 *
 */

#jspsych-categorize-animation-stimulus {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/*
 *
 * PLUGIN: jspsych-categorize
 *
 */

#jspsych-categorize-stimulus {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.feedback {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/*
 *
 * PLUGIN: jspsych-free-sort
 *
 */

#jspsych-free-sort-arena {
    margin-left: auto;
    margin-right: auto;
    border: 2px solid #444;
}

.jspsych-free-sort-draggable {
  cursor: move;
}

#jspsych-free-sort-done-btn {
  display: block;
  margin: auto;
  margin-top: 25px;
}

/*
 *
 * PLUGIN: jspsych-instructions
 *
 */

 .jspsych-instructions-nav {
   text-align: center;
   margin-top: 2em;
 }

 .jspsych-instructions-nav button {
   margin: 20px;
 }
/*
 *
 * PLUGIN: jspsych-multi-stim-multi-response
 *
 */

#jspsych-multi-stim-multi-response-stimulus {
  display: block;
  margin: auto;
}

/*
 *
 * PLUGIN: jspsych-palmer
 *
 */

#jspsych-palmer-snapCanvas {
    margin-left: auto;
    margin-right: auto;
}

/*
 *
 * PLUGIN: jspsych-same-different
 *
 */

.jspsych-same-different-stimulus {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/*
 *
 * PLUGIN: jspsych-single-stim
 *
 */

#jspsych-single-stim-stimulus {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/*
 *
 * PLUGIN: jspsych-survey-text
 *
 */

 .jspsych-survey-text {
     margin: 0.25em 0em;
 }

 .jspsych-survey-text-question {
     margin: 2em 0em;
 }

 /*
  *
  * PLUGIN: jspsych-survey-likert
  *
  */

.jspsych-survey-likert-sliderlabels {
  font-size: 75%;
  line-height: 1.15em;
}

.jspsych-survey-likert-question {
  margin-top: 2em;
  margin-bottom: 2em;
}

.jspsych-survey-likert-text {
  text-align: center;
}

#jspsych-survey-likert-next {
  display: block;
  margin: auto;
}

/*
*
* PLUGIN: jspsych-visual-search-circle
*
*/

#jspsych-visual-search-circle-svg {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/*
 *
 * PLUGIN: jspsych-vsl-animate-occlusion
 *
 */

#jspsych-vsl-animate-occlusion-canvas {
  display: block;
  margin: auto;
}

/*
 *
 * PLUGIN: jspsych-xab
 *
 */

 .jspsych-xab-stimulus {
   display: block;
   margin-left: auto;
   margin-right: auto;
 }

</style>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT, html, function(opts) {

    this.mixin(AllTags)

    this.archived = true
    this.hasFinish = false

    this.correctHeight = () => {
        $(this.canvas_training_likert).css({
            height: window.innerHeight - 140 + 'px'
        })
    }

    $(window).resize(() => {
        this.correctHeight()
     })

    const update = (o) => {
        if (o && o.message && o.message.action == CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT) {
            if (o.cortex) {
                this.cortex = o.cortex
            }
            this.data = o.message
            this.id = this.data.id
            this.archived = this.data.archived
            if (!this.archived && this.data.action_data) {

                if (!this.likert) {
                    if (this.data.action_data.range) {
                        this.range = this.data.action_data.range
                        this.direction = this.data.action_data.direction || 'right'
                        switch (this.direction) {
                            case 'left':

                                break
                            default:

                                break
                        }
                        this.question = [`Between ${this.range[0]} and ${this.range[this.range.length-1]}, how would you rate this?`]
                    } else {
                        this.range = []
                        for (let i = 0; i < this.data.action_data.length; i += 1) {
                            this.range.push(i + 1)
                        }
                        this.left = this.data.action_data.left
                        this.right = this.data.action_data.right
                        this.name = this.data.action_data.name
                        this.question = [`On a scale of ${this.range[0]} to ${this.range.length}, where ${this.range[0]} is ${this.left} and ${this.range.length} is ${this.right}, how would you rate this?`]
                    }

                    var likert_block = {
                        type: 'survey-likert',
                        questions: [this.question],
                        labels: [[this.range]], // need one scale for every question on a page
                        intervals: [[this.range.length]] // note the the intervals and labels don't necessarily need to match.
                    }

                    this.likert = {}
                    $(this[`likert_scale`]).empty()

                    jsPsych.init({
                        display_element: $(this[`likert_scale`]),
                        experiment_structure: [likert_block],

                        on_finish: () => {
                            jsPsych.endExperiment()
                            let data = jsPsych.data.getData()[0]
                            let response = JSON.parse(data.responses)
                            this.value = response.Q0
                            let per = (this.value / this.range.length) * 100
                            let line = `${this.value} out of ${this.range.length}`
                            if (this.direction) {
                                line = this.range[this.value]
                            }
                            let message = {
                                message: line,
                                answer: this.value,
                                previous_action: CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT,
                                request_feedback: (per < 80),
                                response_time: data.time_elapsed
                            }

                            this.cortex.processUserResponse({
                                action: CONSTANTS.CORTEX.RESPONSE_TYPE.LIKERT,
                                data: message
                            }, this.data._item)
                        }
                    })
                }
            }
        }
        this.correctHeight()
    }
    update(opts)

    this.value = null

    this.onClick = (e) => {

    }

    this.on('mount update', (event, opts) => {
        update(opts)
    })

})