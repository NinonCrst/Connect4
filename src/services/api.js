const API_URL = "https://connect-4-backend-1.onrender.com";

// ─────────────────────────────────────────────
// Helpers
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

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
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

/** Démarre une nouvelle partie. Retourne un GameStateDTO. */
export const startGame = ({ mode, firstPlayer, ligne, col, index, profondeur }) =>
  request("/game/start", {
    method: "POST",
    body: JSON.stringify({ mode, firstPlayer, ligne, col, index, profondeur }),
  });

/** Récupère l'état courant sans jouer de coup. */
export const getState = (gameId) =>
  request(`/game/${gameId}`);

/** Le joueur humain joue dans une colonne. Retourne un GameStateDTO. */
export const playColumn = (gameId, column) =>
  request(`/game/${gameId}/play`, {
    method: "POST",
    body: JSON.stringify({ column }),
  });

/** Déclenche un coup IA (modes tout-IA). Retourne un GameStateDTO. */
export const playIAMove = (gameId) =>
  request(`/game/${gameId}/ia-move`, { method: "POST" });

/** Annule le dernier coup. */
export const backCoup = (gameId) =>
  request(`/game/${gameId}/back`, { method: "POST" });

/** Rejoue le dernier coup annulé. */
export const forwardCoup = (gameId) =>
  request(`/game/${gameId}/forward`, { method: "POST" });

/** Modifie la profondeur Minimax. */
export const setProfondeur = (gameId, valeur) =>
  request(`/game/${gameId}/profondeur?valeur=${valeur}`, { method: "POST" });

/** Supprime la session en mémoire. */
export const deleteGame = (gameId) =>
  request(`/game/${gameId}`, { method: "DELETE" });

// ─────────────────────────────────────────────
// Sauvegardes  — /api/save
// ─────────────────────────────────────────────

/** Sauvegarde la partie courante en BDD. */
export const savePartie = (gameId) =>
  request(`/save/${gameId}`, { method: "POST" });

/** Liste toutes les sauvegardes. */
export const getAllSaves = () =>
  request("/save");

/** Liste toutes les sauvegardes avec canonique + symétrie. */
export const getAllSavesOutils = () =>
  request("/save/outils");

/** Charge une sauvegarde dans la partie courante. */
export const loadSave = (gameId, saveIndex) =>
  request(`/save/${gameId}/load/${saveIndex}`, { method: "POST" });

/** Charge une sauvegarde outils (canonique + symétrie). */
export const loadSaveOutils = (saveIndex) =>
  request(`/save/outils/${saveIndex}`);
