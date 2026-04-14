import React, { useState } from "react";

export default function ParametrePanel({ config, onApply, onClose }) {
  const [local, setLocal] = useState({ ...config });

  const update = (field, value) => {
    setLocal(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="overlay">
      <div className="parametre-panel">
        <h2>Paramètres</h2>

        {/* Premier joueur */}
        <div className="param-row">
          <label>Premier joueur</label>
          <select
            value={local.firstPlayer}
            onChange={e => update("firstPlayer", Number(e.target.value))}
          >
            <option value={1}>Rouge</option>
            <option value={2}>Jaune</option>
          </select>
        </div>

        {/* Nombre de lignes */}
        <div className="param-row">
          <label>Lignes</label>
          <select
            value={local.ligne}
            onChange={e => update("ligne", Number(e.target.value))}
          >
            {[4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Nombre de colonnes */}
        <div className="param-row">
          <label>Colonnes</label>
          <select
            value={local.col}
            onChange={e => update("col", Number(e.target.value))}
          >
            {[4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Index de sauvegarde */}
        <div className="param-row">
          <label>Index</label>
          <select
            value={local.index}
            onChange={e => update("index", Number(e.target.value))}
          >
            {[0,1,2,3,4,5,6,7,8,9].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Profondeur Minimax */}
        <div className="param-row">
          <label>Profondeur</label>
          <select
            value={local.profondeur}
            onChange={e => update("profondeur", Number(e.target.value))}
          >
            {[0,1,2,3,4,5,6,7].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Boutons */}
        <div className="param-buttons">
          <button onClick={() => onApply(local)}>Appliquer</button>
          <button onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
