import { Link } from "react-router-dom/cjs/react-router-dom.min";
import UserContext from "../contexts/UserContext";
import { useContext } from "react";
const NavbarLinks = ({ hamburgerStatus }) => {
  const { userInfo, logout } = useContext(UserContext);

  return (
    <div className="links">
      <Link
        to="/"
        onClick={() => {
          hamburgerStatus(false);
        }}
      >
        Početna
      </Link>
      {userInfo && userInfo.role !== "GUEST" && (
        <Link
          to="/create"
          className="create"
          onClick={() => {
            hamburgerStatus(false);
          }}
        >
          Predaj recept
        </Link>
      )}
      {userInfo && userInfo.role === "ADMIN" && (
        <Link
          to="/admin"
          onClick={() => {
            hamburgerStatus(false);
          }}
        >
          Admin panel
        </Link>
      )}
      {userInfo && userInfo.role === "GUEST" && (
        <Link
          to="/register"
          onClick={() => {
            hamburgerStatus(false);
          }}
        >
          Registracija
        </Link>
      )}
      {userInfo && userInfo.role === "GUEST" && (
        <Link
          to="/login"
          onClick={() => {
            hamburgerStatus(false);
          }}
        >
          Prijava
        </Link>
      )}
      {userInfo && userInfo.role !== "GUEST" && (
        <>
          <Link
            to={"/users/" + userInfo.userId}
            onClick={() => {
              hamburgerStatus(false);
            }}
          >
            Moj profil
          </Link>
          <Link
            to=""
            onClick={() => {
              logout();
              hamburgerStatus(false);
            }}
          >
            Odjava
          </Link>
        </>
      )}
    </div>
  );
};

export default NavbarLinks;
