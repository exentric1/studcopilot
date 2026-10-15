import Summary from "./Summary.jsx";
import FlashcardList from "./FlashcardList.jsx";
import Button from "./Button.jsx";
import "./ResultScreen.css";

function ResultScreen({ result, onStartQuiz }) {
  return (
    <section className="result">
      <Summary points={result.summary} />
      <FlashcardList cards={result.cards} />
      <Button onClick={onStartQuiz}>Пройти тест</Button>
    </section>
  );
}

export default ResultScreen;
