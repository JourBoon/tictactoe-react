import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";

function Navbar() {
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();

    function handleLogout() {
        dispatch({ type: "LOGOUT" });

        navigate("/login");
    }

    return (
        <nav>
            <Link to="/games">Mes parties</Link>
            <Link to="/games/new">Créer une partie</Link>
            <Link to="/history">Historique</Link>
            
            <span style={{ marginLeft: "auto" }}>
                {state.user?.email}
            </span>

            <button onClick={handleLogout}>Déconnexion</button>
        </nav>
    );
}  

export default Navbar;