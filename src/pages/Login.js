import UserContext from "../contexts/UserContext";
import { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import LoggedIn from "../components/LoggedIn";
import Loading from "../components/Loading";
const Login = () => {
  const history = useHistory();
  const [isProcesing, setIsProcessing] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState({
    userLogin: "",
    password: "",
  });
  const { userInfo, login } = useContext(UserContext);
  const handleLogin = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setLoginError("");
    axios
      .post("/api/users/login", user)
      .then((response) => {
        const token = response.data.token;
        const expiresIn = response.data.expiresIn;
        const date = new Date();
        date.setTime(date.getTime() + expiresIn);
        Cookies.set("JWT", token, { expires: date });
        login({
          userId: decodeToken(Cookies.get("JWT")).UserId,
          role: decodeToken(Cookies.get("JWT")).Role,
        });
        history.goBack();
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setLoginError("Ne postoji korisnik s tim imenom");
        }
        if (error.response.status === 401) {
          setLoginError("Pogrešna zaporka");
        }
        console.log(error);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  if (userInfo && userInfo.role === "GUEST")
    return (
      <div className="register">
        <h2>Prijava:</h2>
        <h4>Ne posjedujete račun?</h4>
        <Link to="/register">Kliknite ovdje za registraciju</Link>
        <p>
          <br></br>
        </p>
        <form onSubmit={handleLogin}>
          <label>Korisničko ime ili e-mail: </label>
          <input
            type="text"
            required
            value={user.userLogin}
            onChange={(e) => setUser({ ...user, userLogin: e.target.value })}
          ></input>
          <label>Lozinka: </label>
          <input
            type="password"
            required
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          ></input>
          {loginError && <p>{loginError}</p>}
          {!loginError && (
            <p>
              <br></br>
            </p>
          )}
          {user.userLogin && user.password && !isProcesing && (
            <button>Prijava</button>
          )}
          {(!user.userLogin || !user.password || isProcesing) && (
            <button id="disabledButton">Prijava</button>
          )}
        </form>
      </div>
    );
  else if (userInfo && userInfo.role !== "GUEST") return <LoggedIn />;
  else return <Loading></Loading>;
};

export default Login;
