import type { User } from "./auth";

export interface GameData {
  id: number;
  creatorId: number;
  minPlayers: number;
  maxPlayers: number;
  status: "pending" | "started" | "ended";
  players: User[];
  currentTurnUserId: number | null;
  isYourTurn: boolean;
  state: string;
  endData: {
    result: "winner" | "draw";
    winner: string | null;
  } | null;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
}