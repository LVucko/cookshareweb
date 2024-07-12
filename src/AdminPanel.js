import { useEffect, useState, useContext } from "react";
import axios from "axios";
import CommentList from "./CommentList";
import RecipeList from "./RecipeList";
import CategoryList from "./CategoryList";
import Cookies from "js-cookie";
import UserContext from "./UserContext";
import NotFound from "./NotFound";
import ImageBox from "./ImageBox";
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
        console.log(response.data);
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
        setUser(response.data);
      })
      .catch((error) => {
        setUserError("unable to fetch user with that ID");
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
          <div className="first-column">
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
                  <h1>Set new user role:</h1>
                  <div className="role-selector">
                    <div>
                      <label>Promjeni rolu korisnika: </label>
                      <select value={newRole} onChange={handleRoleChange}>
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <button onClick={changeRole}>
                      Promjeni rolu korisniku {user.username}
                    </button>
                  </div>
                  <div className="comments-container">
                    <h2>Svi komentari korisnika {user.username}</h2>
                    {userComments && userComments.length !== 0 && (
                      <CommentList
                        comments={userComments}
                        fetchComments={fetchComments}
                      ></CommentList>
                    )}
                  </div>
                  <div className="recipe-container">
                    <h2>Svi korisnika {user.username}</h2>
                    {recipes && recipes.length !== 0 && (
                      <RecipeList recipes={recipes}></RecipeList>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="second-column">
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
              <div>
                <ImageBox pictures={pictures}></ImageBox>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  else return <NotFound></NotFound>;
};

export default AdminPanel;
