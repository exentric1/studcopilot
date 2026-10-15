import { useState } from "react";
import QuizQuestion from "./QuizQuestion.jsx";
import QuizResult from "./QuizResult.jsx";
import Button from "./Button.jsx";
import "./QuizScreen.css";

function QuizScreen({ quiz, onFinish, onOpenWeakSpots, onBackToResult }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = quiz[index];
  const isLast = index === quiz.length - 1;

  function handleSelect(optionIndex) {
    if (selected !== null) return;

    setSelected(optionIndex);

    if (optionIndex === question.correctIndex) {
      setScore(score + 1);
    } else {
      setMistakes([
        ...mistakes,
        {
          question: question.question,
          yourAnswer: question.options[optionIndex],
          correctAnswer: question.options[question.correctIndex],
        },
      ]);
    }
  }

  function handleNext() {
    if (isLast) {
      onFinish(mistakes);
      setFinished(true);
    } else {
      setIndex(index + 1);
      setSelected(null);
    }
  }

  if (finished) {
    return (
      <QuizResult
        score={score}
        total={quiz.length}
        mistakesCount={mistakes.length}
        onOpenWeakSpots={onOpenWeakSpots}
        onBackToResult={onBackToResult}
      />
    );
  }

  return (
    <section className="quiz-screen">
      <p className="quiz-screen__progress">
        Вопрос {index + 1} из {quiz.length}
      </p>
      <QuizQuestion question={question} selected={selected} onSelect={handleSelect} />
      {selected !== null && (
        <Button onClick={handleNext}>{isLast ? "Завершить" : "Дальше"}</Button>
      )}
    </section>
  );
}

export default QuizScreen;
