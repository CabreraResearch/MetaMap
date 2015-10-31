const riot = require('riot')
const AllTags = require('../mixins/all-tags')
const CONSTANTS = require('../../constants/constants')
const $ = require('jquery')
const slickQuiz = require('../../../vendor/slickquiz/slickQuiz')

const html = `
<div class="portlet-body">
    <div if="{ true != archived }" style="text-align: center;">
        <img id="multiple_choice_image" style="display: none;" src="{image}"></img>
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
                let config = {
                    json: {
                        info: {
                            name: '',
                            main: '',
                            results: ''
                        },
                        questions: []
                    },
                    checkAnswerText: 'Next >>',
                    preventUnanswered: true,
                    skipStartButton: true,
                    randomSortAnswers: true,
                    perQuestionResponseMessaging: false,
                    disableRanking: true,
                    animationCallbacks: {
                        nextQuestion: (o, answer, slick) => {
                            console.log(answer)
                        },
                        checkAnswer: (o, answer, slick) => {
                            let line = null
                            if(o.isCorrect) {
                                line = `Great! That's the correct answer!`
                            }

                            let message = {
                                message: o.selectedAnswer,
                                feedback: line
                            }

                            this.cortex.processUserResponse({
                                action: CONSTANTS.CORTEX.RESPONSE_TYPE.MULTIPLE_CHOICE_ANSWER,
                                data: message
                            })
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

                let slickQuestions = config.json.questions
                _.each(this.questions, (q) => {
                    let newQ = {
                        q: q.question,
                        a: [],
                        correct: '',
                        incorrect: ''
                    }
                    _.each(q.correctAnswers, (a) => {
                        newQ.a.push({ option: a, correct: true})
                    })
                    _.each(q.incorrectAnswers, (a) => {
                        newQ.a.push({ option: a, correct: false})
                    })

                    slickQuestions.push(newQ)
                })

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