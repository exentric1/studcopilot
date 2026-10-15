import "./WeakSpotItem.css";

function WeakSpotItem({ question, yourAnswer, correctAnswer }) {
  return (
    <li className="weak-item">
      <h3 className="weak-item__question">{question}</h3>
      <p className="weak-item__answer weak-item__answer--wrong">
        <span className="weak-item__label">Ваш ответ:</span> {yourAnswer}
      </p>
      <p className="weak-item__answer weak-item__answer--correct">
        <span className="weak-item__label">Правильный ответ:</span> {correctAnswer}
      </p>
    </li>
  );
}

export default WeakSpotItem;
