import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board.tsx";
import GameLobby from "../components/GameLobby.tsx";
import PlayerList from "../components/PlayerList.tsx";

import {
  getGame,
  invitePlayer,
  startGame,
  updateGameState,
} from "../services/api";

import {
  getBoard,
  getWinner,
  isDraw,
} from "../utils/gameLogic";

import { useAuth } from "../hooks/useAuth";
import type { GameData } from "../types/game";

function Game() {
  const { id } = useParams();
  const { state } = useAuth();

  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadGame() {
    if (!state.token || !id) {
      setError("Impossible de charger la partie.");
      setLoading(false);
      return;
    }

    try {
      const result = await getGame(state.token, Number(id));

      setGame(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de charger la partie",
      );
    } finally {
      setLoading(false);
    }
  }

  //Rechargement automatique toute les 10 secondes
  //TODO à changer on veut pas que ca se recharge meme quand la partie est terminée.
  useEffect(() => {
    loadGame();

    const interval = setInterval(() => {
      loadGame();
    }, 1000);

    return () => {
        clearInterval(interval)
    };
  }, [state.token, id]);

  async function handleInvite(email: string) {
    if (!state.token || !id) {
      throw new Error("Vous devez être connecté pour inviter un joueur.");
    }

    setActionLoading(true);

    try {
      await invitePlayer(state.token, Number(id), email);

      await loadGame();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleStart() {
    if (!state.token || !id || !game) {
      throw new Error("Impossible de démarrer la partie.");
    }

    setActionLoading(true);

    try {
      const firstPlayer = game.players[0];

      const updatedGame = await startGame(
        state.token,
        Number(id),
        firstPlayer?.id,
      );

      setGame(updatedGame);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <p>Chargement de la partie...</p>;
  }

  if (error && !game) {
    return <p>{error}</p>;
  }

  if (!game) {
    return <p>Partie introuvable.</p>;
  }

  const isCreator = state.user?.id === game.creatorId;

  async function handleCellClick(index: number) {
    if (!state.token || !id || !game) return;

    if (game.status !== "started") return;

    if (!game.isYourTurn) return;

    const board = getBoard(game.state);

    if (board[index] !== "") return;

    const playerIndex = game.players.findIndex(
      (player) => player.id === state.user?.id,
    );

    if (playerIndex === -1) return;

    const symbol = playerIndex === 0 ? "X" : "O";

    const winnerPlayer = game.players.find(
      (_, index) => index === (symbol === "X" ? 0 : 1),
    );

    const newBoard = [...board];
    newBoard[index] = symbol;

    const winner = getWinner(newBoard);
    const draw = !winner && isDraw(newBoard);

    setActionLoading(true);
    setError("");

    try {
      if (winner || draw) {
        const updatedGame = await updateGameState(
          state.token,
          Number(id),
          JSON.stringify({
            board: newBoard,
          }),
          undefined,
          true,
          JSON.stringify({
            result: winner ? "winner" : "draw",
            winner: winnerPlayer?.email ?? null,
          })
        );

        setGame(updatedGame);
        return;
      }

      const nextPlayer = game.players[(playerIndex + 1) % game.players.length];

      const updatedGame = await updateGameState(
        state.token,
        Number(id),
        JSON.stringify({
          board: newBoard,
        }),
        nextPlayer.id,
      );

      setGame(updatedGame);
    } catch (error) {
      //Debug je comprends pas pourquoi l'erreur s'affiche poas
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : String(error),
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <main>
        <h1>Partie #{game.id}</h1>

        {error && <p>{error}</p>}

        <p>
        Statut :{" "}
        {game.status === "pending" && "En attente"}
        {game.status === "started" && "En cours"}
        {game.status === "ended" && "Terminée"}
        </p>

        {game.status === "ended" && (
        <section>
            <h2>Partie terminée</h2>

            {game.endData?.result === "draw" ? (
            <p>Égalité !</p>
            ) : (
            <p>
                Le joueur {game.endData?.winner ?? "inconnu"} a gagné !
            </p>
            )}
        </section>
        )}

        <h2>Joueurs</h2>

        <PlayerList
          players={game.players}
          currentTurnUserId={game.currentTurnUserId}
        />

        {game.status === "pending" && isCreator && (
          <GameLobby
            minPlayers={game.minPlayers}
            playerCount={game.players.length}
            loading={actionLoading}
            onInvite={handleInvite}
            onStart={handleStart}
          />
        )}

        {game.status === "pending" && !isCreator && (
        <p>
            En attente du lancement de la partie par le
            créateur.
        </p>
        )}

        {game.status === "started" && (
        <>
            <h2>Plateau</h2>

            <Board
              board={getBoard(game.state)}
              onCellClick={handleCellClick}
              disabled={!game.isYourTurn || actionLoading}
            />

            <p>
            {game.isYourTurn
                ? "C'est votre tour."
                : "Ce n'est pas votre tour."}
            </p>
        </>
        )}
    </main>
    );
}

export default Game;
