// Главный компонент. Хранит все данные и решает, какой экран показать.
// Экраны лежат в папке screens/ — по одному файлу на каждый.

import { useState } from "react";
import { generateStudyMaterials } from "./api.js";
import { loadWeakSpots, addWeakSpots, clearWeakSpots } from "./weakSpots.js";
import HomeScreen from "./screens/HomeScreen.jsx";
import ResultScreen from "./screens/ResultScreen.jsx";
import QuizScreen from "./screens/QuizScreen.jsx";
import WeakSpotsScreen from "./screens/WeakSpotsScreen.jsx";

export default function App() {
  const [screen, setScreen] = useState("home"); // "home" | "result" | "quiz" | "weak"
  const [text, setText] = useState("");
  const [result, setResult] = useState(null); // { engine, summary, cards, quiz }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weakSpots, setWeakSpots] = useState(loadWeakSpots);

  async function handleGenerate() {
    if (!text.trim()) {
      setError("Вставьте текст конспекта.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setResult(await generateStudyMaterials(text));
      setScreen("result");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const navigation = [
    { screen: "home", label: "Главная" },
    ...(result ? [{ screen: "result", label: "Результат" }] : []),
    { screen: "weak", label: `Слабые места${weakSpots.length ? ` (${weakSpots.length})` : ""}` },
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>AI Study Copilot</h1>
        <nav>
          {navigation.map((item) => (
            <button
              key={item.screen}
              className={screen === item.screen ? "chip chip--active" : "chip"}
              onClick={() => setScreen(item.screen)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {screen === "home" && (
          <HomeScreen
            text={text}
            loading={loading}
            error={error}
            onTextChange={(value) => { setText(value); setError(""); }}
            onGenerate={handleGenerate}
          />
        )}
        {screen === "result" && <ResultScreen result={result} onStartQuiz={() => setScreen("quiz")} />}
        {screen === "quiz" && (
          <QuizScreen
            quiz={result.quiz}
            onFinish={(mistakes) => setWeakSpots(addWeakSpots(mistakes))}
            onOpenWeakSpots={() => setScreen("weak")}
            onBackToResult={() => setScreen("result")}
          />
        )}
        {screen === "weak" && (
          <WeakSpotsScreen
            weakSpots={weakSpots}
            onClear={() => { clearWeakSpots(); setWeakSpots([]); }}
          />
        )}
      </main>
    </div>
  );
}
