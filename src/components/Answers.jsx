import React from 'react';
import PropTypes from 'prop-types';

const Answers = ({ allAnswers, allQuestions, correctAnswers }) => (
  <ol>
    {
      allQuestions.map((question, index) => {
        const isCorrect = correctAnswers && correctAnswers[index] === allAnswers[index];
        return (
          <li
            key={question.question}
            className={`${isCorrect ? 'text-success' : 'text-danger'}`}
          >
            {question.question}<br /><strong> {allAnswers[index]}</strong>
            {(correctAnswers && !isCorrect) && <span className="correct-answer">{correctAnswers[index]}</span>}
          </li>
        );
      })
    }
  </ol>
);

Answers.defaultProps = {
  correctAnswers: [],
};

Answers.propTypes = {
  allQuestions: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
  allAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswers: PropTypes.arrayOf(PropTypes.string),
};

export default Answers;
