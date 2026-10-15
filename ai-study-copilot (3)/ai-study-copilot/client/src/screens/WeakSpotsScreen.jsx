// Экран 4: вопросы, в которых были ошибки (хранятся в браузере, см. weakSpots.js).

export default function WeakSpotsScreen({ weakSpots, onClear }) {
  if (weakSpots.length === 0) {
    return (
      <section className="stack">
        <h2>Слабые места</h2>
        <p className="muted">Пока пусто. Пройдите тест, и вопросы с ошибками появятся здесь.</p>
      </section>
    );
  }

  return (
    <section className="stack">
      <h2>Слабые места</h2>
      <ul className="stack list--plain">
        {weakSpots.map((spot) => (
          <li key={spot.question} className="box stack">
            <h3>{spot.question}</h3>
            <p className="answer answer--wrong"><b>Ваш ответ:</b> {spot.yourAnswer}</p>
            <p className="answer answer--right"><b>Правильный ответ:</b> {spot.correctAnswer}</p>
          </li>
        ))}
      </ul>
      <button className="button button--secondary" onClick={onClear}>Очистить список</button>
    </section>
  );
}
