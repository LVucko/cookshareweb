import { Link } from "react-router-dom/cjs/react-router-dom";
import StarRating from "./StarRating";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import { getJWT } from "../utils/utilities";
import { Button } from "antd";

const RecipeList = ({ recipes, fetchRecipes }) => {
  const { userInfo } = useContext(UserContext);
  function handleDelete(id) {
    axios
      .delete("/api/recipes/" + id, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then(() => {
        fetchRecipes();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <Link
          className="recipe-preview"
          key={recipe.id}
          to={`/recipes/${recipe.id}`}
          style={{
            backgroundImage: `url(${"/../../" + recipe.pathToPictures[0]})`,
          }}
        >
          <div className="row">
            {userInfo &&
              (userInfo.role === "MODERATOR" || userInfo.role === "ADMIN") && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(recipe.id);
                  }}
                >
                  Obriši
                </Button>
              )}
            <StarRating rating={recipe.averageRating}></StarRating>
          </div>
          <div className="text-container">
            <div className="text-container-header">
              <h2>{recipe.title}</h2>
              <h3>{recipe.username}</h3>
            </div>
            <p>
              Kategorije:{" "}
              {recipe.categories.toString().replaceAll(",", ", ").toLowerCase()}
            </p>
            <p>{recipe.shortDescription}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecipeList;
