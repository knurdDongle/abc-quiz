import React from 'react';
import data from '../api/Data';
import Question from './Question';
import Results from './Results';
import Progress from './Progress';
import Arrow from './Arrow';
import defaultImage from '../images/truck.svg';

class App extends React.Component {
  state = {
    allQuestions: data.allQuestions,
    currentQuestion: data.allQuestions[0],
    progress: 0,
    allAnswers: [],
    correctAnswers: null,
    loadNewQuestion: false,
    showResults: false,
    loadingResults: false,
    resultsLoaded: false,
  };

  handleSelectAnswer = answer => {
    const { allAnswers, progress } = this.state;
    const currentAnswer = allAnswers[progress];
    if (currentAnswer) {
      // replace answer

      allAnswers[progress] = answer;
      this.setState({
        allAnswers,
      }, this.goToNextQuestion());
    } else {
      this.setState({
        allAnswers: [...allAnswers, answer],
      }, this.goToNextQuestion());
    }
  }

  goToNextQuestion = () => {
    const { progress, allQuestions } = this.state;
    this.setState({ loadNewQuestion: true });

    // we have the question faded out

    setTimeout(() => {
      if (progress < allQuestions.length - 1) {
        this.setState({
          progress: progress + 1,
          currentQuestion: allQuestions[progress + 1],
          loadNewQuestion: false,
        });
      } else {
        this.setState({
          showResults: true,
          loadNewQuestion: false,
        });
      }
    }, 300);
  }

  goToPreviousQuestion = () => {
    const { progress, allQuestions, showResults } = this.state;
    this.setState({ loadNewQuestion: true });

    // we have the question faded out

    setTimeout(() => {
      if (progress > 0 && !showResults) {
        this.setState({
          progress: progress - 1,
          currentQuestion: allQuestions[progress - 1],
          loadNewQuestion: false,
        });
      } else {
        this.setState({
          showResults: false,
          loadNewQuestion: false,

          /*
           * currentQuestion: allQuestions[progress],
           * on your own to choose , last quesion is set behind the scenes
           */

        });
      }
    }, 300);
  }

  handleLoadResults = () => {
    this.setState({ loadingResults: true });

    // correct answers url https://api.myjson.com/bins/zgpjb

    fetch('https://api.myjson.com/bins/zgpjb')
      .then(res => res.json())
      .then(parsedJSON => {
        const { correctAnswers } = parsedJSON;
        this.setState({
          correctAnswers,
          loadingResults: false,
          resultsLoaded: true,
        });
      })
      .catch(e => {
        this.setState({
          loadingResults: false,
          resultsLoaded: true,
        });
      });

    // fake delay
    setTimeout(() => {
      this.setState({
        loadingResults: true,
      });
    }, 1000);
  }

  handleRestart = () => {
    this.setState({
      currentQuestion: this.state.allQuestions[0],
      progress: 0,
      correctAnswers: null,
      allAnswers: [],
      resultsLoaded: false,
      showResults: false,
    });
  }

  render() {
    const {
      currentQuestion, loadNewQuestion, showResults, allQuestions, allAnswers,
      loadingResults, correctAnswers, resultsLoaded, progress,
    } = this.state;
    const { image } = currentQuestion;
    const headerImage = !showResults ? image : defaultImage;
    const navIsActive = allAnswers.length > 0;
    return (
      <div className={`${loadingResults ? 'is-loading-results' : ''} ${resultsLoaded ? 'is-showing-results' : 'no-results-loaded'}`}>
        <header>
          <img
            className={`fade-out ${loadNewQuestion ? 'fade-out-active' : ''}`}
            src={headerImage}
            alt="logo"
          />
        </header>
        <div className="content">
          <Progress
            total={allQuestions.length}
            progress={allAnswers.length}
          />
          {
            !showResults ?
              <Question
                allAnswers={allAnswers}
                currentQuestion={currentQuestion}
                onSelectAnswer={this.handleSelectAnswer}
                loadNewQuestion={loadNewQuestion}
              />
              :
              <Results
                loadNewQuestion={loadNewQuestion}
                allAnswers={allAnswers}
                allQuestions={allQuestions}
                correctAnswers={correctAnswers}
                onLoadResults={this.handleLoadResults}
                onRestart={this.handleRestart}
                resultsLoaded={resultsLoaded}
              />
          }
        </div>
        <div className={`navigation text-center ${navIsActive ? 'is-active' : ''}`}>
          <Arrow
            direction="left"
            allAnswers={allAnswers}
            progress={progress}
            showResults={showResults}
            goToPreviousQuestion={this.goToPreviousQuestion}
            goToNextQuestion={this.goToNextQuestion}
          />
          <Arrow
            direction="right"
            allAnswers={allAnswers}
            progress={progress}
            showResults={showResults}
            goToPreviousQuestion={this.goToPreviousQuestion}
            goToNextQuestion={this.goToNextQuestion}
          />
        </div>
      </div>
    );
  }
}

export default App;
