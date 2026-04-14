import React from "react";
import Cell from "./Cell";
import ScoreBar from "./ScoreBar";

export default function Board({ gameState, onColumnClick, disabled, showScores }) {
  if (!gameState) return null;

  const { grille, grilleWin, ligne, col, tabScore } = gameState;

  // Style dynamique pour la grille
  const gridStyle = {
    gridTemplateColumns: `repeat(${col}, 1fr)`,
    gridTemplateRows: `repeat(${ligne}, 1fr)`
  };

  return (
    <div className="board-wrapper">
      {/* Numéros de colonnes */}
      <div
        className="col-numbers"
        style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}
      >
        {Array.from({ length: col }, (_, i) => (
          <div key={i} className="col-number">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Plateau */}
      <div className="board" style={gridStyle}>
        {grille.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              value={cell}
              win={grilleWin?.[i]?.[j]}
              onClick={() => !disabled && onColumnClick(j)}
            />
          ))
        )}
      </div>

      {/* ScoreBar Minimax */}
      {showScores && tabScore && (
        <ScoreBar tabScore={tabScore} col={col} />
      )}
    </div>
  );
}
