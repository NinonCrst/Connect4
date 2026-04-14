const API_URL = "https://connect-4-backend-1.onrender.com";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) throw new Error(`Erreur ${res.status} sur ${path}`);
  if (res.status === 204) return null;
  return res.json();
}

// ─────────────────────────────────────────────
// Jeu  — /api/game
// ─────────────────────────────────────────────

export async function startGame(data) {
  const response = await fetch(`${API_URL}/api/game/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  return response.json();
}

export const getState = (gameId) =>
  request(`/game/${gameId}`);

export const playColumn = (gameId, column) =>
  request(`/game/${gameId}/play`, {
    method: "POST",
    body: JSON.stringify({ column }),
  });

export const playIAMove = (gameId) =>
  request(`/game/${gameId}/ia-move`, { method: "POST" });

export const backCoup = (gameId) =>
  request(`/game/${gameId}/back`, { method: "POST" });

export const forwardCoup = (gameId) =>
  request(`/game/${gameId}/forward`, { method: "POST" });

export const setProfondeur = (gameId, valeur) =>
  request(`/game/${gameId}/profondeur?valeur=${valeur}`, { method: "POST" });

export const deleteGame = (gameId) =>
  request(`/game/${gameId}`, { method: "DELETE" });

// ─────────────────────────────────────────────
// Sauvegardes  — /api/save
// ─────────────────────────────────────────────

export const savePartie = (gameId) =>
  request(`/save/${gameId}`, { method: "POST" });

export const getAllSaves = () =>
  request("/save");

export const getAllSavesOutils = () =>
  request("/save/outils");

export const loadSave = (gameId, saveIndex) =>
  request(`/save/${gameId}/load/${saveIndex}`, { method: "POST" });

export const loadSaveOutils = (saveIndex) =>
  request(`/save/outils/${saveIndex}`);
