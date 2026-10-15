import Button from "./Button.jsx";
import Loader from "./Loader.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import "./HomeScreen.css";

function HomeScreen({ text, loading, error, onTextChange, onGenerate }) {
  return (
    <section className="home">
      <h2 className="home__title">Вставьте конспект</h2>
      <p className="home__hint">
        Вставьте текст лекции или конспекта, и вы получите краткий пересказ, карточки и мини-тест.
      </p>
      <textarea
        className="home__textarea"
        value={text}
        placeholder="Вставьте текст сюда…"
        disabled={loading}
        onChange={(event) => onTextChange(event.target.value)}
      />
      {error && <ErrorMessage message={error} />}
      <Button onClick={onGenerate} disabled={loading}>
        Сгенерировать
      </Button>
      {loading && <Loader />}
    </section>
  );
}

export default HomeScreen;
