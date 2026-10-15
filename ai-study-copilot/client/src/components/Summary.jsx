import "./Summary.css";

function Summary({ points }) {
  return (
    <div className="summary">
      <h2 className="summary__title">Краткий конспект</h2>
      <ul className="summary__list">
        {points.map((point, index) => (
          <li key={index} className="summary__item">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Summary;
