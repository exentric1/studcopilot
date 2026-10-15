import Flashcard from "./Flashcard.jsx";
import "./FlashcardList.css";

function FlashcardList({ cards }) {
  return (
    <div className="flashcards">
      <h2 className="flashcards__title">Карточки</h2>
      <p className="flashcards__hint">Нажмите на карточку, чтобы увидеть ответ.</p>
      <div className="flashcards__grid">
        {cards.map((card, index) => (
          <Flashcard key={index} question={card.q} answer={card.a} />
        ))}
      </div>
    </div>
  );
}

export default FlashcardList;
