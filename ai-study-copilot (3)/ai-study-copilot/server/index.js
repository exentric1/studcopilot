// HTTP-сервер. Принимает текст конспекта, отдаёт конспект + карточки + тест.
// Вся логика ИИ — в ai.js, этот файл только принимает запросы.

import "dotenv/config";
import express from "express";
import cors from "cors";

// ai.js читает переменные окружения при загрузке, поэтому импортируем его после dotenv
const { generateMaterials } = await import("./ai.js");

const PORT = process.env.PORT || 3001;
const MAX_TEXT_LENGTH = 15000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.post("/api/generate", async (req, res) => {
  const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

  if (!text) {
    return res.status(400).json({ error: "Введите текст конспекта." });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: `Текст слишком длинный. Максимум ${MAX_TEXT_LENGTH} символов.` });
  }

  try {
    res.json(await generateMaterials(text));
  } catch (err) {
    // сюда попадаем, только если не справился даже встроенный движок (например, текст слишком короткий)
    res.status(422).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  const message = err.status === 413 ? "Текст слишком длинный." : "Некорректный запрос.";
  res.status(err.status || 500).json({ error: message });
});

app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
