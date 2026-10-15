import "./ErrorMessage.css";

function ErrorMessage({ message }) {
  return (
    <p className="error" role="alert">
      {message}
    </p>
  );
}

export default ErrorMessage;
