import { useState, useEffect, useCallback, useRef } from "react";
import {
  startGame, playColumn, playIAMove,
  backCoup, forwardCoup, setProfondeur,
  savePartie, deleteGame,
} from "./services/api";
import ModeSelector      from "./components/menu/ModeSelector";
import ParametrePanel    from "./components/menu/ParametrePanel";
import Board             from "./components/board/Board";
import StatusBar         from "./components/ui/StatusBar";
import NavButtons        from "./components/ui/NavButtons";
import PlayPauseButtons  from "./components/ui/PlayPauseButtons";
import WinnerModal       from "./components/ui/WinnerModal";
import SaveList          from "./components/saves/SaveList";
import "./index.css";

// ─────────────────────────────────────────────
// Constantes de mode  (identiques à GameService)
// ─────────────────────────────────────────────
const MODE_CVC       = 0;
const MODE_IAVIA     = 1;
const MODE_IAVIA_BDD = 2;
const MODE_CVP       = 3;
const MODE_IAVP      = 4;
const MODE_IAVP_BDD  = 5;
const MODE_PVP       = 6;

const FULL_IA_MODES  = [MODE_CVC, MODE_IAVIA, MODE_IAVIA_BDD];
const IA_DELAY_MS    = 600;

export default function App() {
  // ─── État global ───────────────────────────
  const [gameState, setGameState] = useState(null);
  const [config, setConfig] = useState({
    firstPlayer: 1,
    ligne: 6,
    col: 7,
    index: 0,
    profondeur: 2,
  });

  // ─── UI ────────────────────────────────────
  const [view, setView]         = useState("menu");   // "menu" | "game" | "saves"
  const [showParams, setShowParams] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [paused, setPaused]         = useState(false);
  const [loading, setLoading]       = useState(false);

  // ─── Référence pour la boucle IA vs IA ────
  const iaLoopRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const startIALoop = useCallback((gameId) => {
    stopIALoop();
    const tick = async () => {
      if (pausedRef.current) {
        iaLoopRef.current = setTimeout(tick, IA_DELAY_MS);
        return;
      }
      try {
        const state = await playIAMove(gameId);
        setGameState(state);
        if (state.status === "ONGOING") {
          iaLoopRef.current = setTimeout(tick, IA_DELAY_MS);
        }
      } catch (e) {
        console.error("Erreur IA loop :", e);
      }
    };
    iaLoopRef.current = setTimeout(tick, IA_DELAY_MS);
  }, []);

  const stopIALoop = () => {
    if (iaLoopRef.current) {
      clearTimeout(iaLoopRef.current);
      iaLoopRef.current = null;
    }
  };

  useEffect(() => () => stopIALoop(), []);

  // ─────────────────────────────────────────────────────────────────
  // Démarrer une partie
  // ─────────────────────────────────────────────────────────────────
  const handleStart = async (mode) => {
    setLoading(true);
    stopIALoop();
    try {
      const state = await startGame({ mode, ...config });
      setGameState(state);
      setView("game");
      setPaused(false);
      setShowScores(false);

      if (FULL_IA_MODES.includes(mode)) {
        startIALoop(state.gameId);
      }
    } catch (e) {
      console.error("Erreur démarrage :", e);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // Coup humain
  // ─────────────────────────────────────────────────────────────────
  const handleColumnClick = async (col) => {
    if (!gameState || gameState.status !== "ONGOING") return;
    if (FULL_IA_MODES.includes(gameState.mode))       return;
    setLoading(true);
    try {
      const state = await playColumn(gameState.gameId, col);
      setGameState(state);
    } catch (e) {
      console.error("Erreur coup :", e);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────────
  const handleBack = async () => {
    if (!gameState) return;
    const state = await backCoup(gameState.gameId);
    setGameState(state);
  };

  const handleForward = async () => {
    if (!gameState) return;
    const state = await forwardCoup(gameState.gameId);
    setGameState(state);
  };

  // ─────────────────────────────────────────────────────────────────
  // Play / Pause IA
  // ─────────────────────────────────────────────────────────────────
  const handlePlay = () => {
    setPaused(false);
    if (!iaLoopRef.current && gameState?.status === "ONGOING") {
      startIALoop(gameState.gameId);
    }
  };

  const handlePause = () => setPaused(true);

  // ─────────────────────────────────────────────────────────────────
  // Restart
  // ─────────────────────────────────────────────────────────────────
  const handleRestart = () => {
    if (!gameState) return;
    handleStart(gameState.mode);
  };

  // ─────────────────────────────────────────────────────────────────
  // Stop
  // ─────────────────────────────────────────────────────────────────
  const handleStop = async () => {
    stopIALoop();
    if (gameState) {
      try { await deleteGame(gameState.gameId); } catch (_) {}
    }
    setGameState(null);
    setView("menu");
  };

  // ─────────────────────────────────────────────────────────────────
  // Profondeur Minimax
  // ─────────────────────────────────────────────────────────────────
  const handleSetProfondeur = async (val) => {
    setConfig(c => ({ ...c, profondeur: val }));
    if (gameState) {
      const state = await setProfondeur(gameState.gameId, val);
      setGameState(state);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // Sauvegarde
  // ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!gameState) return;
    await savePartie(gameState.gameId);
  };

  const handleSaveLoaded = (newState) => {
    setGameState(newState);
    setView("game");
    stopIALoop();
    if (FULL_IA_MODES.includes(newState.mode) && newState.status === "ONGOING") {
      startIALoop(newState.gameId);
    }
  };

  const isFullIA = gameState && FULL_IA_MODES.includes(gameState.mode);
  const gameOver = gameState && gameState.status !== "ONGOING";

  return (
    <div className="app">
      {/* ── Menu principal ── */}
      {view === "menu" && (
        <div className="window">
          <div className="window-title">Connect 4</div>
          <div className="window-body">
            <ModeSelector
              onSelect={handleStart}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* ── Vue de jeu ── */}
      {view === "game" && gameState && (
        <div className="window">
          <div className="window-title">Connect 4</div>
          <div className="window-body game-layout">
            {/* Colonne gauche */}
            <div className="left-panel">
              <ModeSelector
                compact
                onSelect={handleStart}
                loading={loading}
              />
              <div className="panel-separator" />
              <button onClick={() => setShowParams(p => !p)}>Paramètres</button>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setView("saves")}>Open in</button>
            </div>

            {/* Centre */}
            <div className="center-panel">
              <StatusBar gameState={gameState} />
              <Board
                gameState={gameState}
                onColumnClick={handleColumnClick}
                disabled={loading || isFullIA || gameOver}
                showScores={showScores}
              />
            </div>

            {/* Colonne droite */}
            <div className="right-panel">
              <NavButtons
                onBack={handleBack}
                onForward={handleForward}
                onRestart={handleRestart}
                onStop={handleStop}
              />
              {isFullIA && (
                <PlayPauseButtons
                  paused={paused}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              )}
              <div className="profondeur-control">
                <label>Profondeur</label>
                <select
                  value={config.profondeur}
                  onChange={e => handleSetProfondeur(Number(e.target.value))}
                >
                  {[0,1,2,3,4,5,6,7].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => setShowScores(s => !s)}>
                {showScores ? "Masquer scores" : "Afficher scores"}
              </button>
            </div>
          </div>

          {showParams && (
            <ParametrePanel
              config={config}
              onApply={(newConfig) => {
                setConfig(newConfig);
                setShowParams(false);
              }}
              onClose={() => setShowParams(false)}
            />
          )}

          {gameOver && (
            <WinnerModal
              status={gameState.status}
              onNext={() => setView("menu")}
            />
          )}
        </div>
      )}

      {/* ── Liste des sauvegardes ── */}
      {view === "saves" && (
        <div className="window">
          <div className="window-title">Connect 4 - Sauvegardes</div>
          <div className="window-body">
            <SaveList
              gameId={gameState?.gameId}
              onLoad={handleSaveLoaded}
              onCancel={() => setView("game")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
