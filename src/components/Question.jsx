import React from 'react';
import PropTypes from 'prop-types';
import Choices from './Choices';

const Question = ({
  allAnswers, currentQuestion, onSelectAnswer, loadNewQuestion,
}) => {
  const { question, choices } = currentQuestion;
  return (
    <div className={`question fade-out ${loadNewQuestion ? 'fade-out-active' : ''}`}>
      <h1>{question}</h1>
      <Choices allAnswers={allAnswers} choices={choices} onSelectAnswer={onSelectAnswer} />
    </div>
  );
};

Question.propTypes = {
  allAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentQuestion: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onSelectAnswer: PropTypes.func.isRequired,
  loadNewQuestion: PropTypes.bool.isRequired,
};

export default Question;
