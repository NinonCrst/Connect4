import React from "react";

export default function WinnerModal({ status, onNext }) {
  let message = "";

  if (status === "WIN_P1") message = "Le joueur rouge a gagné !";
  else if (status === "WIN_P2") message = "Le joueur jaune a gagné !";
  else if (status === "DRAW")   message = "Match nul !";

  return (
    <div className="overlay">
      <div className="winner-modal">
        <div className="winner-message">{message}</div>
        <button onClick={onNext}>Retour au menu</button>
      </div>
    </div>
  );
}
