import { useEffect, useState } from "react";

import { getGameHistory } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { GameData } from "../types/game";

function History() {
  const { state } = useAuth();

  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      if (!state.token) {
        setError("Vous devez être connecté.");
        setLoading(false);
        return;
      }

      try {
        const result = await getGameHistory(state.token);
        setGames(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Impossible de charger l'historique",
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [state.token]);

  if (loading) {
    return <p>Chargement de l'historique...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Historique</h1>

      {games.length === 0 ? (
        <p>Aucune partie terminée.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <strong>Partie #{game.id}</strong>
              {" — "}

              {game.endData?.result === "draw" ? (
                "Égalité"
              ) : (
                `Victoire de ${game.endData?.winner}`
              )}

              {" — "}
              {game.players.length} joueurs
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default History;