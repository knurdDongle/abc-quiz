import React from 'react';
import PropTypes from 'prop-types';
import Answers from './Answers';

const Results = ({
  loadNewQuestion, allAnswers, allQuestions,
  onLoadResults, onRestart, correctAnswers, resultsLoaded,
}) => {
  let numOfCorrect = 0;
  if (correctAnswers) {
    allQuestions.map((_, inx) => (correctAnswers[inx] === allAnswers[inx] ? numOfCorrect++ : null));
  }
  return (
    <div className={`results fade-out ${loadNewQuestion ? 'fade-out-active' : ''}`}>
      <div className="loader"><div className="icon" /></div>
      <div className="results-overlay" />
      <h1>{`${resultsLoaded ? `${numOfCorrect} out of ${allQuestions.length} correct!` : 'Here are your answers:'}`}</h1>
      <div className="answers">
        <Answers
          allAnswers={allAnswers}
          allQuestions={allQuestions}
          correctAnswers={correctAnswers}
        />
      </div>
      <div className="text-center">
        {
          resultsLoaded ?
            <button
              className="btn btn-dark"
              onClick={e => onRestart()}
            >
        Start Again
            </button>
            :
            <button
              className="btn btn-dark"
              onClick={e => onLoadResults()}
            >
      Submit
            </button>
        }

      </div>
    </div>
  );
};

Results.defaultProps = {
  correctAnswers: [],
};

Results.propTypes = {
  loadNewQuestion: PropTypes.bool.isRequired,
  allQuestions: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
  allAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswers: PropTypes.arrayOf(PropTypes.string),
  onLoadResults: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired,
  resultsLoaded: PropTypes.bool.isRequired,
};

export default Results;
