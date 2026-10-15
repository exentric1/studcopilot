// Экран 3: тест по одному вопросу. В конце — итог и сохранение ошибок.

import { useState } from "react";

export default function QuizScreen({ quiz, onFinish, onOpenWeakSpots, onBackToResult }) {
  const [index, setIndex] = useState(0);          // номер текущего вопроса
  const [selected, setSelected] = useState(null); // номер выбранного варианта (null — ещё не выбрал)
  const [mistakes, setMistakes] = useState([]);   // вопросы, где ответили неверно
  const [finished, setFinished] = useState(false);

  const question = quiz[index];
  const isLast = index === quiz.length - 1;

  function choose(optionIndex) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex !== question.correctIndex) {
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

  function next() {
    if (isLast) {
      onFinish(mistakes);
      setFinished(true);
    } else {
      setIndex(index + 1);
      setSelected(null);
    }
  }

  function optionClass(i) {
    if (selected === null) return "option";
    if (i === question.correctIndex) return "option option--correct";
    if (i === selected) return "option option--wrong";
    return "option";
  }

  if (finished) {
    return (
      <section className="stack">
        <h2>Тест завершён</h2>
        <p className="score">Правильных ответов: {quiz.length - mistakes.length} из {quiz.length}</p>
        <p className="muted">
          {mistakes.length > 0
            ? "Вопросы с ошибками сохранены в разделе «Слабые места»."
            : "Ошибок нет. Отличный результат!"}
        </p>
        <div className="row">
          {mistakes.length > 0 && <button className="button" onClick={onOpenWeakSpots}>Слабые места</button>}
          <button className="button button--secondary" onClick={onBackToResult}>К конспекту</button>
        </div>
      </section>
    );
  }

  return (
    <section className="stack stack--large">
      <p className="muted">Вопрос {index + 1} из {quiz.length}</p>
      <h2>{question.question}</h2>
      <div className="stack">
        {question.options.map((option, i) => (
          <button key={i} className={optionClass(i)} disabled={selected !== null} onClick={() => choose(i)}>
            {option}
          </button>
        ))}
      </div>
      {selected !== null && (
        <button className="button" onClick={next}>{isLast ? "Завершить" : "Дальше"}</button>
      )}
    </section>
  );
}
