import React from 'react';
import PropTypes from 'prop-types';
import arrowLeftImg from '../images/navigation-left-arrow.svg';
import arrowRightImg from '../images/navigation-right-arrow.svg';

const Arrow = ({
  direction, allAnswers, progress, showResults, goToPreviousQuestion, goToNextQuestion,
}) => {
  const image = direction === 'left' ? arrowLeftImg : arrowRightImg;
  const isDisabled =
    (direction === 'left' && progress === 0) || // we are at the 1st question
    (direction === 'right' && !allAnswers[progress]) ||
    (direction === 'right' && showResults); // the question hasn't been answered yet
  return (
    <button
      disabled={isDisabled}
      className={`arrow ${isDisabled ? 'is-disabled' : ''}`}
      onClick={() => (direction === 'left' ? goToPreviousQuestion() : goToNextQuestion())}
    >
      <img src={image} alt="arrow" />
    </button>
  );
};

Arrow.defaultProps = {
  goToPreviousQuestion: PropTypes.func,
  goToNextQuestion: PropTypes.func,
};

Arrow.propTypes = {
  direction: PropTypes.string.isRequired,
  allAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  progress: PropTypes.number.isRequired,
  showResults: PropTypes.bool.isRequired,
  goToPreviousQuestion: PropTypes.func,
  goToNextQuestion: PropTypes.func,
};

export default Arrow;
