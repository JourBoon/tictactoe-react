import type { User } from '../types/auth';
import type { GameData } from "../types/game";

const API_URL = "http://localhost:8000";

async function request<T>(
    path: string,
    options: RequestInit = {},
    token?: string,
): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    const text = response.status === 204 ? "" : await response.text();

    let data: any = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(
            `Erreur HTTP ${response.status}: ${text}`,
            );
        }
    }

    if (!response.ok) {
        throw new Error(
            data?.error ??
            `Erreur HTTP ${response.status}`,
        );
    }

    return data as T;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export function login(email: string, password: string) {
    return request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ 
            email, 
            password 
        }),
    });
}

export function register(email: string, password: string) {
    return request<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ 
            email, 
            password 
        }),
    });
}


//Historique
export function getMyGames(token: string) {
  return request<GameData[]>("/games/mine", {}, token);
}

export function getGameHistory(token: string) {
  return request<GameData[]>("/games/history", {}, token);
}

export function createGame(
  token: string,
  minPlayers: number,
  maxPlayers: number,
) {
  return request<GameData>(
    "/games",
    {
      method: "POST",
      body: JSON.stringify({
        minPlayers,
        maxPlayers,
      }),
    },
    token,
  );
}

export function getGame(token: string, gameId: number) {
  return request<GameData>(`/games/${gameId}`, {}, token);
}

export function invitePlayer(
  token: string,
  gameId: number,
  email: string,
) {
  return request<{ message: string; player: User }>(
    `/games/${gameId}/invite`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
    token,
  );
}

export function startGame(
  token: string,
  gameId: number,
  currentTurnUserId?: number,
) {
  return request<GameData>(
    `/games/${gameId}/start`,
    {
      method: "POST",
      body: JSON.stringify({
        currentTurnUserId,
      }),
    },
    token,
  );
}

export function updateGameState(
  token: string,
  gameId: number,
  state: string,
  currentTurnUserId?: number,
  ended = false,
  endData?: string,
) {
  const body: {
    state: string;
    currentTurnUserId?: number;
    ended?: boolean;
    endData?: unknown;
  } = {
    state,
    ended,
    endData,
  };

  if (currentTurnUserId !== undefined) {
    body.currentTurnUserId = currentTurnUserId;
  }

  return request<GameData>(
    `/games/${gameId}/state`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
    token,
  );
}