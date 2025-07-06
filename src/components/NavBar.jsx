import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">PNK Inmobiliaria</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Inicio</Link>
          <Link className="nav-link" to="/publicar">Publicar Propiedad</Link>
          <Link className="nav-link" to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
