// SaveList.jsx
// Équivalent de VueData : liste toutes les sauvegardes BDD,
// permet d'en sélectionner une et de la charger dans la partie courante

import { useState, useEffect } from "react";
import { getAllSaves, loadSave } from "../../services/api";

export default function SaveList({ gameId, onLoad, onCancel }) {
  const [saves,    setSaves]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Charge la liste au montage — équivalent de saveOpenBdd()
  useEffect(() => {
    getAllSaves()
      .then(setSaves)
      .catch(() => setError("Impossible de charger les sauvegardes."))
      .finally(() => setLoading(false));
  }, []);

  // Charge la sauvegarde sélectionnée — équivalent de ouvrirSauvegarde()
  const handleOpen = async () => {
    if (selected === null) return;
    try {
      const newState = await loadSave(gameId, selected);
      onLoad(newState);
    } catch (e) {
      setError("Erreur lors du chargement.");
    }
  };

  if (loading) return <div className="save-list"><p>Chargement...</p></div>;
  if (error)   return <div className="save-list"><p className="error">{error}</p></div>;

  return (
    <div className="save-list">
      <h2>Sélectionner une sauvegarde</h2>

      <div className="save-table-wrapper">
        <table className="save-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Premier joueur</th>
              <th>Lignes</th>
              <th>Colonnes</th>
              <th>Mode</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {saves.map(save => (
              <tr
                key={save.index}
                className={selected === save.index ? "selected" : ""}
                onClick={() => setSelected(save.index)}
              >
                <td>{save.index}</td>
                <td>{save.firstPlayer === 1 ? "Rouge" : "Jaune"}</td>
                <td>{save.ligne}</td>
                <td>{save.col}</td>
                <td>{save.mode}</td>
                <td>{save.statut ? "En cours" : "Terminée"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="save-buttons">
        <button onClick={handleOpen} disabled={selected === null}>Ouvrir</button>
        <button onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
}
