import { createContext, useEffect, useReducer, type ReactNode, type Dispatch } from "react";

import type { AuthAction, AuthState } from "../types/auth.ts";

const initialState: AuthState = {
  user: null,
  token: null,
};


//Pour que le navigateur stock la connexion (session) en cours.
//Cela évite que l'user soit déconnecté à chaque raffraichissement.
function getInitialState(): AuthState {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      return initialState;
    }

    try{
      return {
        user: JSON.parse(storedUser),
        token: storedToken,
      };
    } catch (error) {
        console.error("Erreur lors de la récupération de l'état initial :", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        return initialState;
    }
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return initialState;

    default:
      return state;
  }
}

interface AuthContextProps {
    state: AuthState;
    dispatch: Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextProps |  null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState, getInitialState);

  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [state.user, state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}