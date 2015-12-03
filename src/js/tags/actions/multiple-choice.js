const riot = require('riot')
const $ = require('jquery')
const _ = require('lodash')

const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
const slickQuiz = require('../../../vendor/slickquiz/slickQuiz')

const html = `
<div class="portlet-body">
    <div if="{ true != archived }" style="text-align: center;">
        <div class="row">
            <div class="col-md-12">
                <img if="{image}" id="multiple_choice_image" class="img-responsive" alt="Responsive image" src="{image}"></img>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="" id="training_multiple_choice">
                    <h1 class="quizName"><!-- where the quiz name goes --></h1>

                    <div class="quizArea">
                        <div class="quizHeader">
                            <a class="button startQuiz">Get Started!</a>
                        </div>
                    </div>

                    <div class="quizResults" style="display: none;">
                        <h3 class="quizScore">You Scored: <span><!-- where the quiz score goes --></span></h3>

                        <h3 class="quizLevel"><strong>Ranking:</strong> <span><!-- where the quiz ranking level goes --></span></h3>

                        <div class="quizResultsCopy">
                            <!-- where the quiz result copy goes -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style scoped>

strong { font-weight: bold; }
em { font-style: italic; }
ul { list-style-type: circle; }
ol { list-style-type: decimal; }
ol li { list-style-type: decimal; margin-left: 20px; }

</style>
`

module.exports = riot.tag(CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE, html, function(opts) {

    this.mixin(AllTags)

    this.questions = {}

    const update = (o) => {
        if (o && o.message && o.message.action_data) {
            if (o.cortex) {
                this.cortex = o.cortex
            }
            this.data = o.message
            this.id = this.data.id
            this.archived = this.data.archived
            if (!this.quiz && !this.archived && document.getElementById('training_multiple_choice')) {
                this.questions = this.data.action_data.questions
                _.each(this.questions, (q) => {
                    if (q.question) {
                        q.q = q.question
                    }
                })

                let config = {
                    json: {
                        info: {
                            name: '',
                            main: '',
                            results: ''
                        },
                        questions: this.questions
                    },
                    checkAnswerText: 'Next >>',
                    preventUnanswered: true,
                    skipStartButton: true,
                    perQuestionResponseMessaging: false,
                    disableRanking: true,
                    animationCallbacks: {
                        nextQuestion: (o, answer, slick) => {
                            this.image = ''
                            if (o.questionNo >= 0) {
                                let q = this.questions[o.questionNo]
                                if (q && q.image) {
                                    this.image = q.image
                                }
                            }
                            this.update()
                        },
                        checkAnswer: (o, answer, slick) => {
                            let line = null
                            if (o.questionNo >= 0) {
                                let q = this.questions[o.questionNo]

                                if (o.isCorrect) {
                                    line = q.correctText || `Great! That's the correct answer!`
                                } else {
                                    if (q.incorrectText) {
                                        line = q.incorrectText
                                    } else {
                                        if (o.correctAnswers.length > 1) {
                                            line = `I'm sorry, but the correct answers were <b>${o.correctAnswers.join(' and ') }</b>.`
                                        } else {
                                            line = `I'm sorry, but the correct answer was <b>${o.correctAnswers[0]}</b>.`
                                        }
                                    }
                                }

                                let message = {
                                    message: o.selectedAnswer,
                                    feedback: line,
                                    answer: o
                                }

                                this.cortex.processUserResponse({
                                    action: CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE_ANSWER,
                                    data: message
                                })
                            }
                        }
                    },
                    events: {
                        onCompleteQuiz: (o, results) => {
                            o.results = results
                            this.cortex.processUserResponse({
                                action: CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE_FINISH,
                                data: o
                            })
                        }
                    }
                }

                this.quiz = this.quiz || $(this.training_multiple_choice).slickQuiz(config)
            }
        }
    }
    update(opts)

    this.value = null

    this.onClick = (e) => {
        this.value = e.target.value
    }

    this.on('mount update', (event, opts) => {
        update(opts)
    })

})