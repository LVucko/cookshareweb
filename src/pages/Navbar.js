import { Link } from "react-router-dom";
import { useContext } from "react";
import { useState } from "react";
import UserContext from "../contexts/UserContext";
import Hamburger from "hamburger-react";
const Navbar = () => {
  const { userInfo, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
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
      <div className="navbar-mobile">
        <div className="row">
          <Link to="/">
            <h1>
              C<span style={{ color: "#4d4d4d" }}>ook</span>S
              <span style={{ color: "#4d4d4d" }}>hare</span>
            </h1>
          </Link>
          <Hamburger toggled={isOpen} toggle={setIsOpen} />
        </div>
        {isOpen && (
          <div className="links">
            <Link
              to="/"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Početna
            </Link>
            {userInfo && (
              <Link
                to="/create"
                className="create"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Predaj recept
              </Link>
            )}
            {userInfo && userInfo.role === "ADMIN" && (
              <Link
                to="/admin"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Admin panel
              </Link>
            )}
            {!userInfo && (
              <Link
                to="/register"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Registracija
              </Link>
            )}
            {!userInfo && (
              <Link
                to="/login"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Prijava
              </Link>
            )}
            {userInfo && (
              <>
                <Link
                  to={"/users/" + userInfo.userId}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Moj profil
                </Link>
                <Link
                  to=""
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Odjava
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
