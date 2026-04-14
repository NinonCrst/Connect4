import React from "react";

export default function Cell({ value, win, onClick }) {
  let className = "disc ";

  if (value === 0) className += "cell-empty";
  else if (value === 1) className += win ? "cell-p1-win" : "cell-p1";
  else if (value === 2) className += win ? "cell-p2-win" : "cell-p2";

  return (
    <div className="cell" onClick={onClick}>
      <div className={className} />
    </div>
  );
}

