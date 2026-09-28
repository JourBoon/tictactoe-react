import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createGame } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function CreateGame() {
  const navigate = useNavigate();
  const { state } = useAuth();

  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!state.token) {
      setError("Vous devez être connecté.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const game = await createGame(
        state.token,
        minPlayers,
        maxPlayers,
      );

      navigate(`/games/${game.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de créer la partie",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Nouvelle partie</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="minPlayers">
            Nombre minimum de joueurs
          </label>

          <input
            id="minPlayers"
            type="number"
            min="2"
            value={minPlayers}
            onChange={(event) =>
              setMinPlayers(Number(event.target.value))
            }
          />
        </div>

        <div>
          <label htmlFor="maxPlayers">
            Nombre maximum de joueurs
          </label>

          <input
            id="maxPlayers"
            type="number"
            min={minPlayers}
            value={maxPlayers}
            onChange={(event) =>
              setMaxPlayers(Number(event.target.value))
            }
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer la partie"}
        </button>
      </form>
    </main>
  );
}

export default CreateGame;