import React from "react";

export default function PlayPauseButtons({ paused, onPlay, onPause }) {
  return (
    <div className="play-pause-buttons">
      {!paused ? (
        <button onClick={onPause}>Pause</button>
      ) : (
        <button onClick={onPlay}>Play</button>
      )}
    </div>
  );
}
