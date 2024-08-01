import RecipeList from "../components/RecipeList";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useState, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { isoDateToLocale } from "../utils/utilities";
const UserDetails = () => {
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [favouriteRecipes, setFavouriteRecipes] = useState(null);
  const history = useHistory();
  useEffect(() => {
    axios
      .get("/api/users/" + id)
      .then((response) => {
        response.data.creationDate = isoDateToLocale(
          response.data.creationDate
        );
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    fetchAllRecipes();
    fetchFavouriteRecipes();
  }, [id]);

  function fetchAllRecipes() {
    axios
      .get("/api/recipes/user/" + id)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchFavouriteRecipes() {
    axios
      .get("/api/recipes/user/" + id + "/favourites")
      .then((response) => {
        setFavouriteRecipes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="user-details">
      {!user && <Loading></Loading>}
      {user && (
        <div>
          <div className="row">
            <div className="tight-row">
              <img
                className="user-picture"
                src={"/../../" + user.pathToPicture}
                alt="Profile"
              ></img>
              <h2>{user.username}</h2>
            </div>
            <div className="tight-row">
              <h2>Član od: {user.creationDate}</h2>
              {userInfo &&
                (userInfo.role === "MODERATOR" ||
                  userInfo.role === "ADMIN" ||
                  userInfo.userId === user.id) && (
                  <button
                    onClick={() => {
                      history.push("/customize/" + id);
                    }}
                  >
                    Uredi profil
                  </button>
                )}
            </div>
          </div>
          <div className="last-row">
            {user.realName.length > 0 && <h2>Ime: {user.realName}</h2>}
            {user.phone.length > 0 && <h2>Telefon: {user.phone}</h2>}
            {user.email.length > 0 && <h2>e-mail: {user.email}</h2>}
          </div>
          <br></br>
          <h3 className="last-row">
            {user.about.length > 0
              ? "O meni: " + user.about
              : "Korisnik nije postavio informacije o sebi"}
          </h3>
          <br></br>
        </div>
      )}
      {!recipes && <Loading></Loading>}
      {recipes && user && (
        <>
          <h2>Svi recepti korisnika {user.username}:</h2>
          <div className="scrollable-box">
            <RecipeList
              recipes={recipes}
              fetchRecipes={fetchAllRecipes}
            ></RecipeList>
          </div>
        </>
      )}
      {!favouriteRecipes && <Loading></Loading>}
      <br></br>
      {favouriteRecipes && user && (
        <>
          <h2>Omiljeni recepti korisnika {user.username}:</h2>
          <div className="scrollable-box">
            <RecipeList
              recipes={favouriteRecipes}
              fetchRecipes={fetchFavouriteRecipes}
            ></RecipeList>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
