import React from "react";

export default function StatusBar({ gameState }) {
  if (!gameState) return null;

  const { currentTurn, playerTurn, mode } = gameState;

  // Texte du tour
  const turnText =
    currentTurn === 1 ? "Rouge" :
    currentTurn === 2 ? "Jaune" :
    "—";

  return (
    <div className="status-bar">
      <div>
        <strong>Tour :</strong>{" "}
        <span className={currentTurn === 1 ? "turn-1" : "turn-2"}>
          {turnText}
        </span>
      </div>

      {/* Indication joueur humain dans les modes mixtes */}
      {mode >= 3 && mode <= 5 && (
        <div className="indication-label">
          {playerTurn === 0
            ? "Le joueur humain commence"
            : "L'IA commence"}
        </div>
      )}
    </div>
  );
}

