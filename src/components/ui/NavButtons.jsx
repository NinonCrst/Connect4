import React from "react";

export default function NavButtons({ onBack, onForward, onRestart, onStop }) {
  return (
    <div className="nav-buttons">
      <button onClick={onBack}>Back</button>
      <button onClick={onForward}>Forward</button>
      <button onClick={onRestart}>Restart</button>
      <button onClick={onStop}>Stop</button>
    </div>
  );
}