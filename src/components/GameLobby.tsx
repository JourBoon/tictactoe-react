import { type FormEvent, useState } from "react";

interface GameLobbyProps {
  minPlayers: number;
  playerCount: number;
  loading: boolean;
  onInvite: (email: string) => Promise<void>;
  onStart: () => Promise<void>;
}

function GameLobby({
  minPlayers,
  playerCount,
  loading,
  onInvite,
  onStart,
}: GameLobbyProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleInvite(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    try {
      await onInvite(email);
      setEmail("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'inviter le joueur",
      );
    }
  }

  async function handleStart() {
    setError("");

    try {
      await onStart();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de démarrer la partie",
      );
    }
  }

  return (
    <section className="game-info">
      <h2>Préparation de la partie</h2>

      <h3>Inviter un joueur</h3>

      <form onSubmit={handleInvite}>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Invitation..." : "Inviter"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <button
        type="button"
        onClick={handleStart}
        disabled={loading || playerCount < minPlayers}
      >
        {loading ? "Lancement..." : "Lancer la partie"}
      </button>

      {playerCount < minPlayers && (
        <p>
          Il faut au moins {minPlayers} joueurs pour commencer.
        </p>
      )}
    </section>
  );
}

export default GameLobby;