import React from 'react';
import PropTypes from 'prop-types';
import NiceButton from './NiceButton';

const Choices = ({ choices, onSelectAnswer, allAnswers }) => (
  <div className="choices">
    {
      choices.map((choice, index) => (
        <NiceButton
          key={choice}
          allAnswers={allAnswers}
          choice={choice}
          index={index}
          onSelectAnswer={onSelectAnswer}
        />))
    }
  </div>
);

Choices.propTypes = {
  allAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectAnswer: PropTypes.func.isRequired,
};

export default Choices;
