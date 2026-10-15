import "./Button.css";

function Button({ children, onClick, disabled = false, variant = "primary" }) {
  const className = variant === "secondary" ? "button button--secondary" : "button";

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
