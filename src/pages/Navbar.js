import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
const Navbar = () => {
  const { userInfo, logout } = useContext(UserContext);
  return (
    <nav className="navbar">
      <Link to="/">
        <h1>
          C<span style={{ color: "#4d4d4d" }}>ook</span>S
          <span style={{ color: "#4d4d4d" }}>hare</span>
        </h1>
      </Link>
      <div className="links">
        <Link to="/">Početna</Link>
        {userInfo && (
          <Link to="/create" className="create">
            Predaj recept
          </Link>
        )}
        {userInfo && userInfo.role === "ADMIN" && (
          <Link to="/admin">Admin panel</Link>
        )}
        {!userInfo && <Link to="/register">Registracija</Link>}
        {!userInfo && <Link to="/login">Prijava</Link>}
        {userInfo && (
          <>
            <Link to={"/users/" + userInfo.userId}>Moj profil</Link>
            <Link to="" onClick={logout}>
              Odjava
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
