import "./QuizQuestion.css";

function QuizQuestion({ question, selected, onSelect }) {
  const answered = selected !== null;

  function getOptionClass(optionIndex) {
    if (answered && optionIndex === question.correctIndex) {
      return "quiz__option quiz__option--correct";
    }
    if (answered && optionIndex === selected) {
      return "quiz__option quiz__option--wrong";
    }
    return "quiz__option";
  }

  return (
    <div className="quiz">
      <h2 className="quiz__question">{question.question}</h2>
      <div className="quiz__options">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            type="button"
            className={getOptionClass(optionIndex)}
            disabled={answered}
            onClick={() => onSelect(optionIndex)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizQuestion;
