const BASE_URL = "https://connect-4-backend-1.onrender.com";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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
  request("/api/game/start", {
    method: "POST",
    body: JSON.stringify({ mode, firstPlayer, ligne, col, index, profondeur }),
  });

/** Récupère l'état courant sans jouer de coup. */
export const getState = (gameId) =>
  request(`/api/game/${gameId}`);

/** Le joueur humain joue dans une colonne. Retourne un GameStateDTO. */
export const playColumn = (gameId, column) =>
  request(`/api/game/${gameId}/play`, {
    method: "POST",
    body: JSON.stringify({ column }),
  });

/** Déclenche un coup IA (modes tout-IA). Retourne un GameStateDTO. */
export const playIAMove = (gameId) =>
  request(`/api/game/${gameId}/ia-move`, { method: "POST" });

/** Annule le dernier coup. */
export const backCoup = (gameId) =>
  request(`/api/game/${gameId}/back`, { method: "POST" });

/** Rejoue le dernier coup annulé. */
export const forwardCoup = (gameId) =>
  request(`/api/game/${gameId}/forward`, { method: "POST" });

/** Modifie la profondeur Minimax. */
export const setProfondeur = (gameId, valeur) =>
  request(`/api/game/${gameId}/profondeur?valeur=${valeur}`, { method: "POST" });

/** Supprime la session en mémoire. */
export const deleteGame = (gameId) =>
  request(`/api/game/${gameId}`, { method: "DELETE" });

// ─────────────────────────────────────────────
// Sauvegardes  — /api/save
// ─────────────────────────────────────────────

/** Sauvegarde la partie courante en BDD. */
export const savePartie = (gameId) =>
  request(`/api/save/${gameId}`, { method: "POST" });

/** Liste toutes les sauvegardes. */
export const getAllSaves = () =>
  request("/api/save");

/** Liste toutes les sauvegardes avec canonique + symétrie. */
export const getAllSavesOutils = () =>
  request("/api/save/outils");

/** Charge une sauvegarde dans la partie courante. */
export const loadSave = (gameId, saveIndex) =>
  request(`/api/save/${gameId}/load/${saveIndex}`, { method: "POST" });

/** Charge une sauvegarde outils (canonique + symétrie). */
export const loadSaveOutils = (saveIndex) =>
  request(`/api/save/outils/${saveIndex}`);
