import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "../contexts/UserContext";
import Cookies from "js-cookie";
import NotFound from "./NotFound";

const UserEdit = () => {
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const history = useHistory();
  const [file, setFile] = useState("");
  const [isProcesing, setIsProcessing] = useState(false);
  const [user, setUser] = useState({
    id: "",
    email: "",
    realName: "",
    phone: "",
    about: "",
    pictureId: "0",
    showRealName: false,
    showPhone: false,
    showEmail: false,
  });
  const [error, setError] = useState({
    email: "",
    realName: "",
    phone: "",
    about: "",
  });
  useEffect(() => {
    var token = Cookies.get("JWT");
    axios
      .get("/api/users/personal/" + id, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setUser(response.data);
        setFile("/../../" + response.data.pathToPicture);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    var token = Cookies.get("JWT");
    axios
      .put("/api/users", user, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        console.log(response);
        history.push("/users/" + id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function handlePictureChange(e) {
    setIsProcessing(true);
    if (e.target.files[0] === undefined) {
      setFile(undefined);
      return;
    }
    setFile(URL.createObjectURL(e.target.files[0]));
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setIsProcessing(false);
        console.log(response.data);
        setUser({ ...user, pictureId: response.data });
      })
      .catch((error) => {
        setIsProcessing(false);
        console.log(error);
      });
  }
  if (
    userInfo &&
    user &&
    (userInfo.userId === user.id || userInfo.role === "ADMIN")
  )
    return (
      <div className="register">
        <form onSubmit={handleSubmit}>
          <h2>Uređivanje vašeg profila</h2>
          <br></br>
          <label>Ime i prezime: </label>
          <input
            type="name"
            value={user.realName}
            onChange={(e) => setUser({ ...user, realName: e.target.value })}
          ></input>
          <label>Prikaz imena na profilu:</label>
          <input
            type="checkbox"
            checked={user.showRealName}
            value={user.showRealName}
            onChange={(e) =>
              setUser({ ...user, showRealName: !user.showRealName })
            }
          ></input>
          <label>E-mail: </label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          ></input>
          <label>Prikaz e-maila na profilu:</label>
          <input
            type="checkbox"
            checked={user.showEmail}
            value={user.showEmail}
            onChange={() => setUser({ ...user, showEmail: !user.showEmail })}
          ></input>
          <label>Telefon: </label>
          <input
            type="tel"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          ></input>
          <label>Prikaz telefona na profilu:</label>
          <input
            type="checkbox"
            checked={user.showPhone}
            value={user.showPhone}
            onChange={() => setUser({ ...user, showPhone: !user.showPhone })}
          ></input>
          <label>O meni:</label>
          <textarea
            value={user.about}
            onChange={(e) => setUser({ ...user, about: e.target.value })}
          ></textarea>
          <div className="Image">
            <label>Slika:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
            />
            {file && <img src={file} alt="Uploaded" />}
          </div>
          {isProcesing && (
            <button id="disabledButton" disabled={true}>
              Primjeni promjene
            </button>
          )}
          {!isProcesing && <button>Primjeni promjene</button>}
        </form>
      </div>
    );
  else return <NotFound></NotFound>;
};

export default UserEdit;
