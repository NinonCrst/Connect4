export default function StatusBar({ gameState }) {
  if (!gameState) return null;
  const { currentTurn, playerTurn, mode } = gameState;

  const turnLabel = currentTurn === 1 ? "Rouge" : currentTurn === 2 ? "Jaune" : "—";

  // "Votre couleur" — affiché uniquement en mode mixte IA/Joueur
  const mixedModes = [3, 4, 5];
  let indicationLabel = "";
  if (mixedModes.includes(mode) && playerTurn !== -1) {
    // playerTurn 0 = humain est joueur 1 (rouge), 1 = humain est joueur 2 (jaune)
    indicationLabel = playerTurn === 0 ? "Votre couleur : rouge" : "Votre couleur : jaune";
  }

  return (
    <div className="status-bar">
      <span className={`turn-label turn-${currentTurn}`}>Tour : {turnLabel}</span>
      {indicationLabel && <span className="indication-label">{indicationLabel}</span>}
    </div>
  );
}