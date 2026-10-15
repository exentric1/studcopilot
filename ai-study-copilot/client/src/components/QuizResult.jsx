import Button from "./Button.jsx";
import "./QuizResult.css";

function QuizResult({ score, total, mistakesCount, onOpenWeakSpots, onBackToResult }) {
  return (
    <section className="quiz-result">
      <h2 className="quiz-result__title">Тест завершён</h2>
      <p className="quiz-result__score">
        Правильных ответов: {score} из {total}
      </p>
      <p className="quiz-result__text">
        {mistakesCount > 0
          ? "Вопросы с ошибками сохранены в разделе «Слабые места»."
          : "Ошибок нет. Отличный результат!"}
      </p>
      <div className="quiz-result__actions">
        {mistakesCount > 0 && <Button onClick={onOpenWeakSpots}>Слабые места</Button>}
        <Button variant="secondary" onClick={onBackToResult}>
          К конспекту
        </Button>
      </div>
    </section>
  );
}

export default QuizResult;
