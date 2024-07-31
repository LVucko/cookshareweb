import { useEffect, useState, useContext } from "react";
import axios from "axios";
import CommentList from "../components/CommentList";
import RecipeList from "../components/RecipeList";
import CategoryList from "../components/CategoryList";
import UserContext from "../contexts/UserContext";
import NotFound from "./NotFound";
import ImageBox from "../components/ImageBox";
import { isoDateToLocale, getJWT } from "../utils/utilities";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const AdminPanel = () => {
  const { userInfo } = useContext(UserContext);
  const [userId, setId] = useState("");
  const [user, setUser] = useState(null);
  const [userComments, setUserComments] = useState("");
  const [userError, setUserError] = useState("");
  const [recipes, setRecipes] = useState("");
  const [allCategories, setAllCategories] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newRole, setNewRole] = useState("USER");
  const [pictures, setPictures] = useState();
  const history = useHistory();

  useEffect(() => {
    if (userInfo) {
      fetchCategories();
      fetchPictures();
    }
  }, [userInfo]);
  useEffect(() => {
    if (user) {
      fetchComments();
      fetchRecipes();
    }
  }, [user]);

  const handleRoleChange = (event) => {
    setNewRole(event.target.value);
  };
  function fetchPictures() {
    const token = getJWT();
    axios
      .get("/api/upload", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setPictures(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function addCategory() {
    const token = getJWT();
    axios
      .post(
        "/api/categories/" + newCategory,
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        fetchCategories();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function changeRole() {
    var token = getJWT();
    axios
      .post(
        "/api/users/" + user.id + "/role/" + newRole,
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchCategories() {
    axios
      .get("/api/categories")
      .then((response) => {
        setAllCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchComments() {
    var token = getJWT();
    axios
      .get("/api/users/" + userId + "/comments", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setUserComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchRecipes() {
    axios
      .get("/api/recipes/user/" + userId)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function getUserById() {
    if (!userId) {
      setUserError("ID ne može biti prazan");
      return;
    }
    var token = getJWT();
    axios
      .get("/api/users/personal/" + userId, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        console.log(response.data);
        setUserError("");
        response.data.creationDate = isoDateToLocale(
          response.data.creationDate
        );
        setUser(response.data);
      })
      .catch((error) => {
        setUserError("Nepostoji korisnik s tim IDem");
        setUser(null);
        console.log(error);
      });
  }
  if (userInfo && userInfo.role === "ADMIN")
    return (
      <div className="admin-panel">
        <h1>ADMIN PANEL</h1>
        <div className="last-row"></div>
        <div className="admin-container">
          <div className="admin-row">
            <div className="user-information">
              <h3>ID korisnika:</h3>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setId(e.target.value)}
              ></input>
              <button onClick={getUserById}>Pronađi korisnika</button>
              {userError && <h2>Greška: {userError}</h2>}
              {user && (
                <>
                  <h2>Username : {user.username}</h2>
                  <img
                    className="user-picture"
                    src={"/../../" + user.pathToPicture}
                    alt="Profile"
                  ></img>
                  <p>Napravljen: {user.creationDate}</p>
                  <p>Email: {user.email}</p>
                  <p>Ime: {user.realName}</p>
                  <p>Telefon: {user.phone}</p>
                  <button
                    onClick={() => {
                      history.push("/customize/" + user.id);
                    }}
                  >
                    Uredi profil korisnika
                  </button>
                  <div className="role-selector">
                    <div>
                      <label>Nova uloga korisnika:</label>
                      <select value={newRole} onChange={handleRoleChange}>
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button onClick={changeRole}>Promjeni</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {pictures && (
              <div className="image-manager">
                <ImageBox
                  pictures={pictures}
                  fetchPictures={fetchPictures}
                ></ImageBox>
              </div>
            )}
            <div className="category-manager">
              <h3>Dodaj novu kategoriju:</h3>
              <input
                type="text"
                required
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              ></input>
              <button onClick={addCategory}>Dodaj novu kategoriju</button>
              {allCategories && (
                <CategoryList
                  categories={allCategories}
                  fetchCategories={fetchCategories}
                ></CategoryList>
              )}
            </div>
            {user && (
              <>
                {userComments && userComments.length !== 0 && (
                  <div className="comments-container">
                    <h2>Svi komentari korisnika {user.username}</h2>
                    <CommentList
                      comments={userComments}
                      fetchComments={fetchComments}
                    />
                  </div>
                )}
                {recipes && recipes.length !== 0 && (
                  <div className="recipe-container">
                    <h2>Svi recepti korisnika {user.username}</h2>
                    <RecipeList recipes={recipes} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  else if (!userInfo || (userInfo && userInfo.role !== "ADMIN"))
    return <NotFound />;
};

export default AdminPanel;
