import React, { Component } from 'react'
import questionData from '../questions.json'
import ProgressBar from 'react-bootstrap/ProgressBar'
import StarRatingComponent from 'react-star-rating-component';


class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iscorrectSelected: false,
            iswrongSelected: false,
            index: 0,
            options: [],
            correct_answer: '',
            FilterQuestion: {},
            isSelected: '',
            correct_css: {},
            wrong_css: {},
            iscorrect: false,
            isChecked: false,
            headerProgress: 1,
            score: 0,
            currentQuestionLength: 0,
            remainingQuestion: '',
            boolean: true,
            rating: '',
            isStart : false
        }
    }

    componentDidMount() {
        const { index } = this.state
        let suffleAnswers = [questionData[index].incorrect_answers[0], questionData[index].incorrect_answers[1],
        questionData[index].incorrect_answers[2], questionData[index].correct_answer]

        let sortedShuffleOptions = suffleAnswers.sort((a, b) => 0.5 - Math.random());

        //Remove Special Characters from Question Object
        const FilterQuestion = JSON.parse(JSON.stringify(questionData[index], (k, v) =>
            (k === "question" || k === 'correct_answer' || k === 'category')
                ? v.replace(/%20|%3A|%27|%3F/g, ' ')
                : v
        ));
        //Remove Special Characters from Shuffle answer Array
        const options = JSON.parse(JSON.stringify(sortedShuffleOptions, (k, v) =>
            (k === "0" || k === '1' || k === '2' || k === '3')
                ? v.replace(/%20|%3A|%27|%3F/g, ' ')
                : v
        ));
        const correct_answer = FilterQuestion.correct_answer
        const rating = questionData[index].difficulty

        let Stars;

        if (rating === 'easy') {
            Stars = 1
        }
        else if (rating === 'medium') {
            Stars = 2
        }
        else {
            Stars = 3
        }

        this.setState({ correct_answer, options: options, FilterQuestion, remainingQuestion: questionData.length, rating: Stars })
    }

    checkoption = (e) => {

        let correct_css = {
            border: '1px solid #007bff',
            color: '#007bff',
            cursor: 'not-allowed',
            pointerEvents: 'none',



        }
        let wrong_css = {
            border: '1px solid #b3aeae',
            color: '#b3aeae',
            cursor: 'not-allowed',
            pointerEvents: 'none',

        }

        if (e == this.state.correct_answer) {
            this.setState({ iscorrect: true, score: this.state.score + 1, })
        }

        console.log(e)
        this.setState({ correct_css: correct_css, wrong_css: wrong_css, isSelected: e, isChecked: true, currentQuestionLength: this.state.currentQuestionLength + 1, remainingQuestion: this.state.remainingQuestion - 1 })


    }
    nextQues = () => {

        if (this.state.index === 19) {
            this.setState({ isfinish: true })
        }
        else {
            console.log(this.state.remainingQuestion)
            this.setState({ iscorrect: false, isChecked: false, headerProgress: this.state.headerProgress + 1 })
            console.log('clicked')
            let index = this.state.index + 1
            let suffleAnswers;
            if (questionData[index].type === 'boolean') {
                suffleAnswers = [questionData[index].incorrect_answers[0], questionData[index].correct_answer]
                this.setState({ boolean: false })
            }
            else {
                this.setState({ boolean: true })
                suffleAnswers = [questionData[index].incorrect_answers[0].replace(/%20|%3A|%27|%3F/g, ' '), questionData[index].incorrect_answers[1].replace(/%20|%3A|%27|%3F/g, ' '),
                questionData[index].incorrect_answers[2].replace(/%20|%3A|%27|%3F/g, ' '), questionData[index].correct_answer.replace(/%20|%3A|%27|%3F/g, ' ')]
            }

            let sortedShuffleOptions = suffleAnswers.sort((a, b) => 0.5 - Math.random());

            //Remove Special Characters from Question Object
            const FilterQuestion = JSON.parse(JSON.stringify(questionData[index], (k, v) =>
                (k === "question" || k === 'correct_answer' || k === 'category')
                    ? v.replace(/%20|%3A|%27|%3F|%22|%2C/g, ' ')
                    : v
            ));
            //Remove Special Characters from Shuffle answer Array
            // const options = JSON.parse(JSON.stringify(sortedShuffleOptions, (k, v) =>

            //     (k === "0" || k === '1' || k === '2' || k === '3' || k === 'True' || k === 'False')
            //         ? v.replace(/%20|%3A|%27|%3F/g, ' ')
            //         : v
            // ));
            const correct_answer = FilterQuestion.correct_answer
            const rating = questionData[index].difficulty

            let Stars;

            if (rating === 'easy') {
                Stars = 1
            }
            else if (rating === 'medium') {
                Stars = 2
            }
            else {
                Stars = 3
            }
            this.setState({ correct_answer, options: sortedShuffleOptions, FilterQuestion, index ,rating : Stars})
        }

    }

    finish = () => {
            this.setState({isStart : false})
    }
    render() {
        console.log('remainingQuestion', this.state.remainingQuestion)

        const { options, index, FilterQuestion, correct_css, wrong_css, correct_answer, headerProgress, score, currentQuestionLength, remainingQuestion, isChecked } = this.state;
        let newheaderProgress = (headerProgress / questionData.length) * 100;
        let currentPercentage = currentQuestionLength > 0 ? (score / currentQuestionLength) * 100 : 0
        let maxScore = (((score / questionData.length) + (remainingQuestion / questionData.length)) * 100)
        let minScore = (score / questionData.length) * 100
        console.log(currentPercentage)
        return (
            <div className='maincontainer'>
               {this.state.isStart === true && <div className='quizcontent'>
                    <div className='headerImg'>
                        <img src={process.env.PUBLIC_URL + '/assets/images/Expertizo-logo.png'} style={{ width: '100px' }} />
                        <p>Expertizo Engineering React Quiz Challenge</p>
                    </div>
                    <div className='headerprogressBar'>
                        <ProgressBar now={newheaderProgress.toFixed(1)} label={`${newheaderProgress.toFixed(1)}%`} />
                    </div>
                    <div className='questionLength'>
                        <p className='questionNum'>Question {index + 1}/{questionData.length}</p>
                        <p className='category'>{FilterQuestion.category}</p>
                        <p> <StarRatingComponent
                            name="Difficulty"
                            starCount={5}
                            editing={false}
                            value={this.state.rating}

                        /></p>
                    </div>
                    <div className='Questioncontent'>
                        <div className='question'>
                            <p>{FilterQuestion.question}</p>
                        </div>
                        <div className='answers'>
                            <div>

                                {isChecked && <p className='opt' style={options[0] == correct_answer ? correct_css : wrong_css} onClick={() => this.checkoption(options[0])}>{options[0]}</p>}
                                {!isChecked && <p className='opt' onClick={() => this.checkoption(options[0])}>{options[0]}</p>}

                                {isChecked && <p className='opt' style={options[1] == correct_answer ? correct_css : wrong_css} onClick={() => this.checkoption(options[1])}>{options[1]}</p>}
                                {!isChecked && <p className='opt' onClick={() => this.checkoption(options[1])}>{options[1]}</p>}


                            </div>
                            {this.state.boolean && <div>
                                {isChecked && <p className='opt' style={options[2] == correct_answer ? correct_css : wrong_css} onClick={() => this.checkoption(options[2])}>{options[2]}</p>}
                                {!isChecked && <p className='opt' onClick={() => this.checkoption(options[2])}>{options[2]}</p>}

                                {isChecked && <p className='opt' style={options[3] == correct_answer ? correct_css : wrong_css} onClick={() => this.checkoption(options[3])}>{options[3]}</p>}
                                {!isChecked && <p className='opt' onClick={() => this.checkoption(options[3])}>{options[3]}</p>}

                            </div>}
                        </div>
                        <div className='nextQuestion'>
                            <div>
                                {this.state.isChecked === true && this.state.iscorrect && <p className='Selectedanswer'>Correct!</p>}
                                {this.state.isChecked === true && !this.state.iscorrect && <p className='Selectedanswer'>Sorry!</p>}


                            </div>
                            {!this.state.isfinish && this.state.isChecked && <div className='shownextBtn'>
                                <p onClick={this.nextQues} className='nextBtn'>
                                    Next Question
                                </p>
                            </div>}
                            {this.state.isfinish && this.state.isChecked && <div className='shownextBtn'>
                                <p onClick={this.finish} className='nextBtn'>
                                    Finish
                                </p>
                            </div>}

                        </div>

                        <div className='overallScore'>
                            <div className='progressscore'>
                                <p>Current Score : {currentPercentage}%</p>
                                <p>MaxScore : {maxScore}%</p>
                            </div>
                            <ProgressBar>
                                <ProgressBar striped variant="success" now={minScore.toFixed(1)} label={`${minScore.toFixed(2)}%`} key={1} />
                                <ProgressBar striped variant="warning" now={currentPercentage.toFixed(2)} label={`Curr ${currentPercentage.toFixed(2)}%`} key={2} />
                                <ProgressBar striped variant="danger" now={maxScore.toFixed(2)} label={`Max ${maxScore.toFixed(2)}%`} key={3} />
                            </ProgressBar>
                        </div>
                    </div>
                </div>}
               {this.state.isStart === false && <div>
                    <p className='startBtn' onClick={()=>this.setState({isStart : true})}>Start Quiz</p>
                </div>}
            </div>
        )
    }
}

export default MainScreen
