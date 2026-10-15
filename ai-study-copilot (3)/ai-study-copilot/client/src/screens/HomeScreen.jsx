// Экран 1: вставить текст и нажать «Сгенерировать».

export default function HomeScreen({ text, loading, error, onTextChange, onGenerate }) {
  return (
    <section className="stack">
      <h2>Вставьте конспект</h2>
      <p className="muted">
        Вставьте текст лекции — получите краткий пересказ, карточки и мини-тест.
      </p>
      <textarea
        className="textarea"
        value={text}
        placeholder="Вставьте текст сюда…"
        disabled={loading}
        onChange={(event) => onTextChange(event.target.value)}
      />
      {error && <p className="error" role="alert">{error}</p>}
      <button className="button" onClick={onGenerate} disabled={loading}>
        Сгенерировать
      </button>
      {loading && (
        <div className="loader" role="status">
          <span className="spinner" /> Генерируем конспект, карточки и тест…
        </div>
      )}
    </section>
  );
}
