import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NiceButton extends Component {
  get selected() {
    const { allAnswers, choice } = this.props;
    return allAnswers.includes(choice);
  }
  getLetter = index => {
    const letters = ['A', 'B', 'C'];
    return letters[index];
  }
  handleClick = e => {
    const { choice, onSelectAnswer } = this.props;

    // add the highlight class first and then go to the next questions
    this.button.classList.add('is-selected', 'is-highlighted');

    setTimeout(evt => {
      onSelectAnswer(choice);
    }, 500);
  }
  render() {
    const { choice, index } = this.props;
    return (
      <button ref={input => { this.button = input; }} className={`btn btn-huge ${this.selected ? 'is-selected' : ''}`} onClick={this.handleClick} >
        <span className="letter">{this.getLetter(index)}</span>
        {choice}
      </button>
    );
  }
}

NiceButton.propTypes = {
  allAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  choice: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onSelectAnswer: PropTypes.func.isRequired,
};

export default NiceButton;
