import "./Header.css";

function Header({ screen, hasResult, weakCount, onNavigate }) {
  const links = [{ screen: "home", label: "Главная" }];

  if (hasResult) {
    links.push({ screen: "result", label: "Результат" });
  }

  links.push({
    screen: "weak",
    label: weakCount > 0 ? `Слабые места (${weakCount})` : "Слабые места",
  });

  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">AI Study Copilot</h1>
        <nav className="header__nav">
          {links.map((link) => (
            <button
              key={link.screen}
              type="button"
              className={
                screen === link.screen ? "header__link header__link--active" : "header__link"
              }
              onClick={() => onNavigate(link.screen)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
