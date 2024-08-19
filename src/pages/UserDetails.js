import RecipeList from "../components/RecipeList";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useState, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { isoDateToLocale } from "../utils/utilities";
import { Button, Avatar, Collapse } from "antd";
const { Panel } = Collapse;
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

  if (user)
    return (
      <div className="user-details">
        {!user && <Loading></Loading>}
        {user && (
          <div>
            <div className="row">
              <div className="tight-row">
                <Avatar size={64} src={"/../../" + user.pathToPicture} />
                <h2>{user.username}</h2>
              </div>
              <div className="tight-row">
                <h2>Član od: {user.creationDate}</h2>
                {userInfo &&
                  (userInfo.role === "ADMIN" ||
                    userInfo.userId === user.id) && (
                    <Button
                      type="primary"
                      onClick={() => {
                        history.push("/customize/" + id);
                      }}
                    >
                      Uredi profil
                    </Button>
                  )}
              </div>
            </div>
            <div className="last-row">
              {user.realName.length > 0 && <h2>Ime: {user.realName}</h2>}
              {user.phone.length > 0 && <h2>Telefon: {user.phone}</h2>}
              {user.email.length > 0 && <h2>e-mail: {user.email}</h2>}
            </div>
            <br></br>
            <h3>
              {user.about.length > 0
                ? "O meni: " + user.about
                : "Korisnik nije postavio informacije o sebi"}
            </h3>
            <br></br>
          </div>
        )}
        <Collapse bordered={false} defaultActiveKey={["1"]}>
          <Panel header={"Svi objavljeni recepti"} key="1">
            {!recipes && <Loading></Loading>}
            {recipes && (
              <RecipeList
                recipes={recipes}
                fetchRecipes={fetchAllRecipes}
              ></RecipeList>
            )}
          </Panel>
          <Panel header={"Omiljeni recepti"} key="2">
            {!favouriteRecipes && <Loading></Loading>}
            {favouriteRecipes && (
              <RecipeList
                recipes={favouriteRecipes}
                fetchRecipes={fetchFavouriteRecipes}
              ></RecipeList>
            )}
          </Panel>
        </Collapse>
      </div>
    );
  else return <Loading></Loading>;
};

export default UserDetails;
