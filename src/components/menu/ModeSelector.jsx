import React from "react";

export default function ModeSelector({ onSelect, loading, compact }) {
  const modes = [
    { id: 0, label: "0 joueur random", desc: "IA random vs IA random" },
    { id: 1, label: "0 joueur IA", desc: "IA Minimax vs IA Minimax" },
    { id: 2, label: "0 joueur IA BDD", desc: "IA Minimax+BDD vs IA Minimax+BDD" },
    { id: 3, label: "1 joueur random", desc: "IA random vs Joueur" },
    { id: 4, label: "1 joueur IA", desc: "IA Minimax vs Joueur" },
    { id: 5, label: "1 joueur IA BDD", desc: "IA Minimax+BDD vs Joueur" },
    { id: 6, label: "2 joueurs", desc: "Joueur vs Joueur" },
  ];

  if (compact) {
    return (
      <div className="mode-selector-compact">
        {modes.map(m => (
          <button
            key={m.id}
            className="mode-btn"
            disabled={loading}
            onClick={() => onSelect(m.id)}
          >
            <span className="mode-label">{m.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mode-selector">
      <h1>Connect 4</h1>
      <h2>Choisissez un mode de jeu</h2>

      <div className="mode-list">
        {modes.map(m => (
          <button
            key={m.id}
            className="mode-btn"
            disabled={loading}
            onClick={() => onSelect(m.id)}
          >
            <span className="mode-label">{m.label}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

