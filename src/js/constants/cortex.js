const CORTEX = {
	RESPONSE_TYPE: {
        OK: 'ok',
        VIDEO: 'video',
        VIDEO_BUTTON: 'video-button',
        TIMER: 'timer',
        LIKERT: 'likert',
        MULTIPLE_CHOICE: 'multiple-choice',
        MORE: 'more',
        CANVAS: 'canvas',
        CANVAS_SAVE: 'canvas_save',
        CANVAS_SHARE: 'canvas_share',
        CANVAS_FINISH: 'canvas_finish',
        FEEDBACK: 'feedback',
        DEFAULT: 'default',
        RESTART: 'restart',
        MULTIPLE_CHOICE_ANSWER: 'multiple-choice-answer',
        MULTIPLE_CHOICE_FINISH: 'multiple-choice-finish'
    }
}

Object.freeze(CORTEX);

module.exports = CORTEX;