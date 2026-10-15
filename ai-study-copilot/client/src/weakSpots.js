const STORAGE_KEY = "ai-study-copilot-weak-spots";

export function loadWeakSpots() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function addWeakSpots(newSpots) {
  const current = loadWeakSpots();
  const knownQuestions = new Set(current.map((spot) => spot.question));
  const freshSpots = newSpots.filter((spot) => !knownQuestions.has(spot.question));
  const updated = [...current, ...freshSpots];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearWeakSpots() {
  localStorage.removeItem(STORAGE_KEY);
}
