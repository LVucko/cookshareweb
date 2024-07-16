import RecipeList from "../components/RecipeList";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState(null);
  useEffect(() => {
    axios
      .get("/api/users/" + id)
      .then((response) => {
        var isodate = new Date(response.data.creationDate);
        response.data.creationDate = isodate.toLocaleDateString("hr-HR");
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("/api/recipes/user/" + id)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <div className="user-details">
      {!user && <div>Loading...</div>}
      {user && (
        <div>
          <div className="last-row">
            <div className="tight-row">
              <img
                className="user-picture"
                src={"/../../" + user.pathToPicture}
                alt="Profile"
              ></img>
              <h2>{user.username}</h2>
            </div>
            <div>Datum kreiranja računa: {user.creationDate}</div>
          </div>
        </div>
      )}
      <div>
        {!recipes && <div>Učitavam...</div>}
        {recipes && user && (
          <>
            <h2>Svi recepti korisnika {user.username}</h2>
            <RecipeList recipes={recipes}></RecipeList>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
