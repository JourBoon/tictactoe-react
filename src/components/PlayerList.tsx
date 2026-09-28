import type { User } from "../types/auth";

interface PlayerListProps {
  players: User[];
  currentTurnUserId: number | null;
}

function PlayerList({ players, currentTurnUserId }: PlayerListProps) {
  return (
    <>
      <h2>Joueurs</h2>

      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.email}

            {player.id === currentTurnUserId && (
              <strong> — Tour actuel</strong>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default PlayerList;