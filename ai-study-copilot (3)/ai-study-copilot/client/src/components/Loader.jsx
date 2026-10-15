import "./Loader.css";

function Loader() {
  return (
    <div className="loader" role="status">
      <span className="loader__spinner" />
      <span className="loader__text">Генерируем конспект, карточки и тест…</span>
    </div>
  );
}

export default Loader;
