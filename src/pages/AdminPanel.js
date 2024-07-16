import { useEffect, useState, useContext } from "react";
import axios from "axios";
import CommentList from "../components/CommentList";
import RecipeList from "../components/RecipeList";
import CategoryList from "../components/CategoryList";
import Cookies from "js-cookie";
import UserContext from "../contexts/UserContext";
import NotFound from "./NotFound";
import ImageBox from "../components/ImageBox";
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

  useEffect(() => {
    fetchCategories();
    fetchPictures();
  }, []);
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
    var token = Cookies.get("JWT");
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
    var token = Cookies.get("JWT");
    axios
      .post(
        "/api/categories/" + newCategory,
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        fetchCategories();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function changeRole() {
    var token = Cookies.get("JWT");
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
    axios
      .get("/api/users/" + userId + "/comments")
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
    if (!userId) return;
    axios
      .get("/api/users/" + userId)
      .then((response) => {
        setUserError("");
        var isodate = new Date(response.data.creationDate);
        response.data.creationDate = isodate.toLocaleDateString("hr-HR");
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
            {pictures && (
              <div className="image-manager">
                <ImageBox
                  pictures={pictures}
                  fetchPictures={fetchPictures}
                ></ImageBox>
              </div>
            )}

            {user && (
              <>
                {userComments && userComments.length !== 0 && (
                  <div className="comments-container">
                    <h2>Svi komentari korisnika {user.username}</h2>
                    <CommentList
                      comments={userComments}
                      fetchComments={fetchComments}
                    ></CommentList>
                  </div>
                )}
                {recipes && recipes.length !== 0 && (
                  <div className="recipe-container">
                    <h2>Svi recepti korisnika {user.username}</h2>
                    <RecipeList recipes={recipes}></RecipeList>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  else return <NotFound></NotFound>;
};

export default AdminPanel;
