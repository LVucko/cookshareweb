import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "../contexts/UserContext";
import NotFound from "./NotFound";
import PictureUpload from "../components/PictureUpload";
import { getJWT } from "../utils/utilities";
import { validateEmail } from "../utils/registrationValidator";
const UserEdit = () => {
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const history = useHistory();
  const [isProcesing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState({
    email: "",
    realName: "",
    phone: "",
    about: "",
  });
  useEffect(() => {
    if (userInfo) {
      var token = getJWT();
      axios
        .get("/api/users/personal/" + id, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          console.log(response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    var token = getJWT();
    axios
      .put("/api/users", user, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        history.push("/users/" + id);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Email taken")
          setError({ ...error, email: "e-mail je već u upotrebi" });
      });
  };

  const onEmailChange = (e) => {
    setUser({ ...user, email: e });
    setError({ ...error, email: validateEmail(e) });
  };

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
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={(e) => onEmailChange(e.target.value)}
          ></input>
          <p>{error.email}</p>
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
          <PictureUpload
            pathToPicture={"/../../" + user.pathToPicture}
            setId={(e) => {
              setUser({ ...user, pictureId: e });
            }}
            setIsProcessing={(e) => setIsProcessing(e)}
          ></PictureUpload>
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
