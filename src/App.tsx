import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Games from "./pages/Games.tsx";
import CreateGame from "./pages/CreateGame.tsx";
import Game from "./pages/Game.tsx";
import History from "./pages/History.tsx";
import NotFound from "./pages/NotFound.tsx";

import Layout from "./components/Layout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={ <Navigate to="/games" replace/>}/>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path='/games' element={<Games />} />
          <Route path='/games/new' element={<CreateGame />} />
          <Route path='/games/:id' element={<Game />} />
          <Route path='/history' element={<History />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;