import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyGames } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { GameData } from "../types/game";

function Games() {
  const { state } = useAuth();

  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGames() {
      if (!state.token) {
        setError("Vous devez être connecté.");
        setLoading(false);
        return;
      }

      try {
        const result = await getMyGames(state.token);
        setGames(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Impossible de charger les parties",
        );
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [state.token]);

  if (loading) {
    return <p>Chargement des parties...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Mes parties</h1>

      <Link to="/games/new">
        Nouvelle partie
      </Link>

      {games.length === 0 ? (
        <p>Aucune partie pour le moment.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <Link to={`/games/${game.id}`}>
                Partie #{game.id}
              </Link>

              {" — "}

              {game.status === "pending" && "En attente"}
              {game.status === "started" && "En cours"}
              {game.status === "ended" && "Terminée"}

              {" — "}

              {game.players.length}/{game.maxPlayers} joueurs
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Games;