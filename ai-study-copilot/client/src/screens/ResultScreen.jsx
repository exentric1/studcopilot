// Экран 2: конспект + карточки (кликни — увидишь ответ).

import { useState } from "react";

// Подпись: чем именно сделан результат (честно говорим, если это не нейросеть)
const ENGINE_LABELS = {
  cloud: "Сгенерировано облачным ИИ.",
  ollama: "Сгенерировано локальной нейросетью (Ollama).",
  offline:
    "Встроенный режим без нейросети: пересказ — это важнейшие предложения из текста, а тест — «вставь пропущенное слово». Для умных вопросов подключите ИИ (см. README).",
};

function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button className={flipped ? "card card--flipped" : "card"} onClick={() => setFlipped(!flipped)}>
      <span className="card__label">{flipped ? "Ответ" : "Вопрос"}</span>
      <span className="card__text">{flipped ? card.a : card.q}</span>
    </button>
  );
}

export default function ResultScreen({ result, onStartQuiz }) {
  return (
    <section className="stack stack--large">
      <p className={result.engine === "offline" ? "notice notice--warn" : "notice"}>
        {ENGINE_LABELS[result.engine]}
      </p>

      <div className="stack">
        <h2>Краткий конспект</h2>
        <ul className="list">
          {result.summary.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
      </div>

      <div className="stack">
        <h2>Карточки</h2>
        <p className="muted">Нажмите на карточку, чтобы увидеть ответ.</p>
        <div className="grid">
          {result.cards.map((card, i) => <Flashcard key={i} card={card} />)}
        </div>
      </div>

      <button className="button" onClick={onStartQuiz}>Пройти тест</button>
    </section>
  );
}
