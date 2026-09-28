import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main>
      <h1>404</h1>

      <p>
        Cette page n'existe pas.
      </p>

      <Link to="/games">
        Retour aux parties
      </Link>
    </main>
  );
}

export default NotFound;