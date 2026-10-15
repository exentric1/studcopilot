export async function generateStudyMaterials(text) {
  let response;
  try {
    response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    throw new Error("Не удалось связаться с сервером. Проверьте, что он запущен.");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Сервер вернул неожиданный ответ. Попробуйте ещё раз.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Что-то пошло не так. Попробуйте ещё раз.");
  }

  return data;
}
