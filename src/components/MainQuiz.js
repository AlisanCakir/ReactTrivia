import React from "react";
import Button from "@material-ui/core/Button";
import Lottie from 'react-lottie';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as animationData from '../lottieJson/simpleLoader.json'
import * as corretAnswerLtt from '../lottieJson/funkyChicken.json'
import * as wrongAnswerLtt from '../lottieJson/somethingWentWrong.json'

import "../styles.css";

class MainQuiz extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentQuestion: 0,
      myAnswer: null,
      options: [],
      score: 0,
      disabled: true,
      isEnd: false,
      getQuestions: [],
      questions: [],
      answer: [],
      nextButtonCounter: 0,
      isDataReady: false,
      isAnswerCorrect: false
    };
  };

  componentDidMount = async () => {
    await this.loadQuizData()
  }

  componentDidUpdate(prevProps, prevState) {
    const randomNum = Math.floor(Math.random() * 4);
    const { getQuestions, currentQuestion } = this.state;
    if (currentQuestion !== prevState.currentQuestion) {

      this.setState({
        disabled: true,
        questions: getQuestions[currentQuestion].question,
        options: getQuestions[currentQuestion].incorrect_answers.concat(getQuestions[currentQuestion].incorrect_answers.splice(randomNum, 0, getQuestions[currentQuestion].correct_answer)),
        answer: getQuestions[currentQuestion].correct_answer,
      })
    }
  }

  prepareData = () => {
    const { getQuestions, currentQuestion } = this.state;
    const randomNum = Math.floor(Math.random() * 4);
    this.setState({
      questions: getQuestions[currentQuestion].question,
      options: getQuestions[currentQuestion].incorrect_answers.concat(getQuestions[currentQuestion].incorrect_answers.splice(randomNum, 0, getQuestions[currentQuestion].correct_answer)),
      answer: getQuestions[currentQuestion].correct_answer
    });
  };

  loadQuizData = () => {
    const { selectedDifficulty, categoryId } = this.props.location.state
    const controlDifficulty = (selectedDifficulty === 'any' || !selectedDifficulty) ? '' : `&difficulty=${selectedDifficulty}`
    const fetchLink = `https://opentdb.com/api.php?amount=3&category=${categoryId}${controlDifficulty}&type=multiple`
    fetch(
      fetchLink
    ).then(res => {
      return res.json();
    }).then(loadedQuestions => {
      this.setState({ getQuestions: loadedQuestions.results, isDataReady: true })
      this.prepareData()
    })
      .catch(err => {
        console.error(err);
      });
  }

  nextQuestionHandler = () => {
    const { myAnswer, answer, score, nextButtonCounter, currentQuestion } = this.state;

    if (myAnswer === answer && nextButtonCounter % 2 === 0) {
      this.setState({
        score: score + 100,
        isAnswerCorrect: true,
        currentQuestion: currentQuestion + 1,
      });
    }
    else if ((myAnswer !== answer && nextButtonCounter % 2 === 0)) {
      this.setState({
        isAnswerCorrect: false,
        currentQuestion: currentQuestion + 1,
      });
    }
    this.setState({
      nextButtonCounter: nextButtonCounter + 1,
    })
  };

  checkAnswer = answer => {
    this.setState({ myAnswer: answer, disabled: false })
  };

  finishHandler = () => {
    const { myAnswer, answer, score, currentQuestion, getQuestions } = this.state;

    if (myAnswer === answer) {
      this.setState({
        score: score + 100
      });
    }
    if (currentQuestion === getQuestions.length - 1) {
      this.setState({
        isEnd: true
      });
    }
  };


  quesStatus = () => {
    const { isAnswerCorrect, score } = this.state;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: isAnswerCorrect ? corretAnswerLtt.default : wrongAnswerLtt.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
    return (
      <div className="App">
        <Lottie
          options={defaultOptions}
          height={150}
          width={150}
        />
        <div>
          {isAnswerCorrect ? <h1>Great Work</h1> : <h1>Whoops wrong answer</h1>}
          {isAnswerCorrect && <h2>You have earned 100 points</h2>}
          <h2>Total: {score} points</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.nextQuestionHandler()}
          >
            Next
            </Button>
        </div>
      </div>
    )
  }

  dataWaiting = () => {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
    return (
      <div className="App">
        <Lottie
          options={defaultOptions}
          height={500}
          width={500}
        />
      </div>
    )
  }

  theEndView = () => {
    const { score, getQuestions } = this.state;

    return (
      <div className="result" >
        <h3>Game Over your Final score is {score} points </h3>
        <p>
          The correct answer's for the questions was
          <ul>
            {getQuestions.map((item, index) => (
              <li key={index}>
                {item.correct_answer}
              </li>
            ))}
          </ul>
        </p>
      </div>
    );
  }

  getGeneralView = () => {
    const { options, myAnswer, currentQuestion, isEnd, questions, getQuestions, disabled } = this.state;
    if (isEnd) {
      return (
        <div>
          {this.theEndView()}
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <h1>{questions} </h1>
          {options.map(option => (
            <p
              key={option.id}
              className={`ui floating message options ${myAnswer === option ? "selected" : null} `}
              onClick={() => this.checkAnswer(option)}
            >
              {option}
            </p>
          ))}
          {currentQuestion < getQuestions.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              disabled={disabled}
              style={{marginRight: 150, marginLeft: 150, marginTop: 50}}
              onClick={() => this.nextQuestionHandler()}
            >
              Next
            </Button>
          )}
          {currentQuestion === this.state.getQuestions.length - 1 && (
            <Button
              variant="contained"
              color="secondary"
              style={{marginRight: 150, marginLeft: 150, marginTop: 50}}
              onClick={() => this.finishHandler()}
            >
              Finish
            </Button>
          )}
        </div>
      )
    }
  }

  getScreen = () => {
    const { nextButtonCounter } = this.state;
    return (
      <div>
        {nextButtonCounter % 2 === 0 ? this.getGeneralView() : this.quesStatus()}
      </div>
    )
  }

  getHeader = () => {
    const { currentQuestion, getQuestions, score, isDataReady, nextButtonCounter } = this.state;
    return (
      <AppBar style={{backgroundColor: '#0075C3'}}>
          {isDataReady &&
            <Toolbar style={{ justifyContent: 'space-around' }}>
              {nextButtonCounter % 2 === 0 && <Typography variant="h6">{`Questions ${currentQuestion + 1}/${getQuestions.length} remaining `}</Typography>}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6"> Total</Typography>
                <Typography variant="h6">{score} points</Typography>
              </div>
            </Toolbar>
          }
      </AppBar>
    )
  }


  render() {
    const { isDataReady, getQuestions } = this.state;
    console.warn('get data', getQuestions)
    return (
      <div>
        {this.getHeader()}
        {isDataReady ? this.getScreen() : this.dataWaiting()}
      </div>
    )
  }
}

export default MainQuiz;
