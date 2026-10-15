import { useState } from "react";
import "./Flashcard.css";

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={flipped ? "flashcard flashcard--flipped" : "flashcard"}
      onClick={() => setFlipped(!flipped)}
    >
      <span className="flashcard__label">{flipped ? "Ответ" : "Вопрос"}</span>
      <span className="flashcard__text">{flipped ? answer : question}</span>
    </button>
  );
}

export default Flashcard;
