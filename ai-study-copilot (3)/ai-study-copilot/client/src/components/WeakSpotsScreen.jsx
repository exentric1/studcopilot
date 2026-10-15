import WeakSpotItem from "./WeakSpotItem.jsx";
import Button from "./Button.jsx";
import "./WeakSpotsScreen.css";

function WeakSpotsScreen({ weakSpots, onClear }) {
  return (
    <section className="weak">
      <h2 className="weak__title">Слабые места</h2>
      {weakSpots.length === 0 ? (
        <p className="weak__empty">Пока пусто. Пройдите тест, и вопросы с ошибками появятся здесь.</p>
      ) : (
        <>
          <ul className="weak__list">
            {weakSpots.map((spot) => (
              <WeakSpotItem
                key={spot.question}
                question={spot.question}
                yourAnswer={spot.yourAnswer}
                correctAnswer={spot.correctAnswer}
              />
            ))}
          </ul>
          <Button variant="secondary" onClick={onClear}>
            Очистить список
          </Button>
        </>
      )}
    </section>
  );
}

export default WeakSpotsScreen;
