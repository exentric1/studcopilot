// Встроенный движок: работает БЕЗ ИИ-модели и БЕЗ интернета.
// Это не нейросеть, а простой алгоритм: он находит самые важные предложения
// и делает из них конспект, карточки и тест. Качество ниже, чем у настоящего ИИ,
// зато приложение всегда работает.

const STOP_WORDS = new Set(
  (
    "и в во не что он на я с со как а то все она так его но да ты к у же вы за бы по только ее мне было вот от меня еще нет о из ему теперь когда даже ну вдруг ли если уже или ни быть был него до вас нибудь опять уж вам ведь там потом себя ничего ей может они тут где есть надо ней для мы тебя их чем была сам чтоб без будто чего раз тоже себе под будет ж тогда кто этот того потому этого какой совсем ним здесь этом один почти мой тем чтобы нее сейчас были куда зачем всех никогда можно при наконец два об другой хоть после над больше тот через эти нас про всего них какая много разве три эту моя впрочем хорошо свою этой перед иногда лучше чуть том нельзя такой им более всегда конечно всю между это также которые который которая которое " +
    "the a an and or but if of to in on at by for with from as is are was were be been being it its this that these those he she they we you i not no do does did has have had will would can could should may might than then so such into about over also which who whom what when where why how"
  ).split(" ")
);

// Шаблоны вопросов на двух языках: язык выбирается по тексту.
const PHRASES = {
  ru: { define: (t) => `Что такое «${t}»?`, about: (k) => `Что в конспекте сказано про «${k}»?`, fill: "Вставьте пропущенное слово" },
  en: { define: (t) => `What is ${t}?`, about: (k) => `What do the notes say about "${k}"?`, fill: "Fill in the missing word" },
};
const detectLanguage = (text) => ((text.match(/[а-яё]/gi) || []).length > text.length / 4 ? "ru" : "en");

const MAX_SUMMARY = 6;
const MAX_CARDS = 8;
const MAX_QUIZ = 5;

// ---------- Разбор текста ----------

function splitSentences(text) {
  return text
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length >= 25);
}

function words(sentence) {
  return sentence.match(/[\p{L}\p{N}-]+/gu) || [];
}

// Грубая «основа» слова: первые 5 букв. Так «память» и «памяти» считаются одним словом.
function stem(word) {
  return word.toLowerCase().slice(0, 5);
}

function isKeyword(word) {
  return word.length >= 5 && !STOP_WORDS.has(word.toLowerCase()) && !/^\d+$/.test(word);
}

function countStems(sentences) {
  const freq = new Map();
  for (const sentence of sentences) {
    for (const word of words(sentence)) {
      if (isKeyword(word)) freq.set(stem(word), (freq.get(stem(word)) || 0) + 1);
    }
  }
  return freq;
}

// ---------- Выбор важных предложений ----------

const DEFINITION = /^(.{2,60}?)\s+(?:—|–|-|это|называется|is|are|refers to)\s+(.{10,})$/i;

function rankSentences(sentences, freq) {
  return sentences
    .map((text, position) => {
      const ws = words(text);
      const sum = ws.filter(isKeyword).reduce((acc, w) => acc + (freq.get(stem(w)) || 0), 0);
      let score = sum / Math.sqrt(ws.length || 1);
      if (DEFINITION.test(text)) score *= 1.3; // определения важнее
      if (position < 2) score *= 1.15; // начало текста обычно задаёт тему
      return { text, position, score };
    })
    .sort((a, b) => b.score - a.score);
}

// Ключевое слово предложения — то, что чаще всего встречается во всём тексте.
function pickKeyword(sentence, freq) {
  const candidates = words(sentence).filter(isKeyword);
  candidates.sort(
    (a, b) => (freq.get(stem(b)) || 0) * b.length - (freq.get(stem(a)) || 0) * a.length
  );
  return candidates[0] || null;
}

function blankOut(sentence, keyword) {
  return sentence.replace(new RegExp(`(?<![\\p{L}\\p{N}-])${keyword}(?![\\p{L}\\p{N}-])`, "u"), "_____");
}

function shorten(text, max = 220) {
  return text.length <= max ? text : text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// ---------- Сборка результата ----------

function makeCard(sentence, freq, say) {
  const match = sentence.match(DEFINITION);
  if (match) {
    return { q: say.define(match[1].trim()), a: shorten(match[2].trim().replace(/[.!?]$/, ""), 180) };
  }
  const keyword = pickKeyword(sentence, freq);
  return keyword
    ? { q: say.about(keyword), a: shorten(sentence, 180) }
    : null;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Неправильные варианты берём из других слов текста. Сначала те, что похожи
// на правильное слово окончанием — чтобы ответ нельзя было угадать по форме слова.
function pickDistractors(answer, pool) {
  const others = pool.filter((w) => w.toLowerCase() !== answer.toLowerCase());
  const tail = (w) => w.slice(-2).toLowerCase();
  const similar = others.filter((w) => tail(w) === tail(answer));
  const rest = others.filter((w) => tail(w) !== tail(answer));
  return [...shuffle(similar), ...shuffle(rest)].slice(0, 3).map((w) => matchCase(w, answer));
}

// Приводим регистр первой буквы к правильному ответу, иначе его выдаёт заглавная буква.
function matchCase(word, reference) {
  if (word === word.toUpperCase()) return word; // аббревиатуры (АТФ) не трогаем
  const first = reference[0];
  const isUpper = first !== first.toLowerCase();
  return (isUpper ? word[0].toUpperCase() : word[0].toLowerCase()) + word.slice(1);
}

function makeQuizItem(sentence, freq, pool, say) {
  const keyword = pickKeyword(sentence, freq);
  if (!keyword) return null;

  const distractors = pickDistractors(keyword, pool);
  if (distractors.length < 3) return null;

  const options = shuffle([keyword, ...distractors]);
  return {
    question: `${say.fill}: «${shorten(blankOut(sentence, keyword), 200)}»`,
    options,
    correctIndex: options.indexOf(keyword),
  };
}

export function generateOffline(text) {
  const sentences = splitSentences(text);
  if (sentences.length < 3) {
    throw new Error("Для встроенного режима нужен текст хотя бы из 3 предложений.");
  }

  const say = PHRASES[detectLanguage(text)];
  const freq = countStems(sentences);
  const ranked = rankSentences(sentences, freq);

  // Конспект: лучшие предложения, но в исходном порядке — так текст читается связно.
  const summary = ranked
    .slice(0, MAX_SUMMARY)
    .sort((a, b) => a.position - b.position)
    .map((s) => shorten(s.text));

  const seenQuestions = new Set();
  const cards = ranked
    .map((s) => makeCard(s.text, freq, say))
    .filter((card) => card && !seenQuestions.has(card.q) && seenQuestions.add(card.q))
    .slice(0, MAX_CARDS);

  // Пул слов для неправильных вариантов теста (без повторов).
  const pool = [...new Map(sentences.flatMap(words).filter(isKeyword).map((w) => [w.toLowerCase(), w])).values()];
  const quiz = ranked
    .map((s) => makeQuizItem(s.text, freq, pool, say))
    .filter(Boolean)
    .slice(0, MAX_QUIZ);

  if (cards.length === 0 || quiz.length === 0) {
    throw new Error("Из этого текста не получилось собрать карточки и тест. Добавьте больше текста.");
  }

  return { summary, cards, quiz };
}
