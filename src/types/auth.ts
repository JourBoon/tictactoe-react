export interface User {
  id: number;
  email: string;
  profilePicture: string | null;
}

//Equivalent de Session
export interface AuthState {
  user: User | null;
  token: string | null;
}

export type AuthAction = | {
  type: "LOGIN";
  payload: {
    user: User;
    token: string;
  };
} | {
  type: "LOGOUT";
}