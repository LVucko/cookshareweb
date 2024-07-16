import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import UserContext from "../contexts/UserContext";
const Register = () => {
  const { userInfo } = useContext(UserContext);
  const history = useHistory();
  const [file, setFile] = useState("");
  const [user, setUser] = useState({
    username: "",
    email: "",
    realName: "",
    phone: "",
    password: "",
    repeatPassword: "",
    pictureId: "0",
  });
  const [error, setError] = useState({
    username: "",
    email: "",
    realName: "",
    phone: "",
    password: "",
    repeatPassword: "",
    pictureId: "",
  });

  function handlePictureChange(e) {
    if (e.target.files[0] === undefined) {
      setFile(undefined);
      return;
    }
    setFile(URL.createObjectURL(e.target.files[0]));
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setUser({ ...user, pictureId: response.data });
      })
      .catch((error) => {
        setUser({ ...user, pictureId: 0 });
        console.log(error);
      });
  }

  const onUsernameChange = (e) => {
    setUser({ ...user, username: e });
    if (e === null || e.length === 0) {
      setError({ ...error, username: "Molimo unesite korisničko ime" });
    } else if (e.length < 6) {
      setError({
        ...error,
        username: "Korisničko ime mora biti barem 6 znakova",
      });
    } else if (e.match(/^[A-Za-z]\w{5,29}$/)) {
      setError({ ...error, username: null });
    } else {
      setError({
        ...error,
        username:
          "Korisničko ime mora počinjati slovom, a može sadržavati brojeve i znak _",
      });
    }
  };

  const onEmailChange = (e) => {
    setUser({ ...user, email: e });
    if (e.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)) {
      setError({ ...error, email: null });
    } else {
      setError({ ...error, email: "Molimo unesite ispravan e-mail" });
    }
  };

  const onPasswordChange = (e) => {
    setUser({ ...user, password: e });
    if (
      e.match(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/
      )
    ) {
      setError({ ...error, password: null });
    } else {
      setError({
        ...error,
        password:
          "Lozinka mora sadržavati 8-20 znakova, broj, veliko i malo slovo, i poseban znak",
      });
    }
  };

  const onRepeatPasswordChange = (e) => {
    setUser({ ...user, repeatPassword: e });
    if (e === user.password) {
      setError({ ...error, repeatPassword: null });
    } else {
      setError({ ...error, repeatPassword: "Lozinke se ne podudaraju" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/register", user, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status === 200) history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (!userInfo)
    return (
      <div className="register">
        <h2>Kreiranje novog korisničkog profila:</h2>
        <h4>Već posjedujete račun?</h4>
        <Link to="/login">Kliknite ovdje za prijavu</Link>
        <p>
          <br></br>
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            Korisničko ime: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={user.username}
            onChange={(e) => onUsernameChange(e.target.value)}
            onBlur={(e) => onUsernameChange(e.target.value)}
          ></input>
          {error.username && <p>{error.username}</p>}
          <label>
            Adresa e-pošte: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            required
            value={user.email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={(e) => onEmailChange(e.target.value)}
          ></input>
          {error.email && <p>{error.email}</p>}
          <label>Ime i Prezime: </label>
          <input
            type="name"
            value={user.realName}
            onChange={(e) => setUser({ ...user, realName: e.target.value })}
          ></input>
          <label>Broj telefona: </label>
          <input
            type="tel"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          ></input>
          <label>
            Lozinka: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="password"
            required
            value={user.password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={(e) => onPasswordChange(e.target.value)}
          ></input>
          {error.password && <p>{error.password}</p>}
          <label>
            Ponovi lozinku: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="password"
            required
            value={user.repeatPassword}
            onChange={(e) => onRepeatPasswordChange(e.target.value)}
            onBlur={(e) => onRepeatPasswordChange(e.target.value)}
          ></input>
          {error.repeatPassword && <p>{error.repeatPassword}</p>}
          <div className="Image">
            <label>Slika profila:</label>
            <input
              type="file"
              onChange={handlePictureChange}
              accept="image/*"
            />
            {file && <img src={file} alt="Uploaded" />}
          </div>
          <label>
            Polja označena sa <span style={{ color: "red" }}>*</span> su
            obavezna
          </label>
          <p>
            <br></br>
          </p>
          {(error.username ||
            error.email ||
            error.password ||
            error.repeatPassword ||
            !user.username ||
            !user.email ||
            !user.password ||
            !user.repeatPassword) && (
            <button id="disabledButton" disabled={true}>
              Registiraj se
            </button>
          )}
          {!error.username &&
            !error.email &&
            !error.password &&
            !error.repeatPassword &&
            user.username &&
            user.email &&
            user.password &&
            user.repeatPassword && <button>Registiraj se</button>}
        </form>
      </div>
    );
  else
    return (
      <div className="register">
        <h2>Već ste prijavljeni</h2>
        <p>
          <br></br>
        </p>
        <Link to="/">Početna stranica</Link>
      </div>
    );
};

export default Register;
