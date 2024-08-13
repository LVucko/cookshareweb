import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { getJWT, isoDateToLocale } from "../utils/utilities";
import CommentList from "../components/CommentList";
import UserContext from "../contexts/UserContext";
import RecipeRating from "../components/RecipeRating";
import NewComment from "../components/NewComment";
import StarRating from "../components/StarRating";
import Loading from "../components/Loading";
import FavouriteButton from "../components/FavouriteButton";
import { Button, Image } from "antd";
const RecipeDetails = () => {
  const { userInfo } = useContext(UserContext);
  const [recipe, setRecipe] = useState("");
  const [comments, setComments] = useState("");
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    fetchRecipe();
    fetchComments();
  }, []);

  const fetchRecipe = () => {
    axios
      .get("/api/recipes/" + id)
      .then((response) => {
        response.data.creationDate = isoDateToLocale(
          response.data.creationDate
        );
        setRecipe(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchAverageRating = () => {
    axios
      .get("/api/recipes/" + id + "/rating/average")
      .then((response) => {
        setRecipe({ ...recipe, averageRating: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchComments = () => {
    axios
      .get("/api/recipes/" + id + "/comments")
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function handleDelete() {
    axios
      .delete("/api/recipes/" + id, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEdit() {
    history.push("/edit/" + id);
  }

  return (
    <div className="recipe-details">
      {!recipe && <Loading></Loading>}
      {recipe && (
        <article>
          <div className="row">
            <h2>{recipe.title}</h2>
            {recipe.averageRating < 0 && <h3>Nije ocjenjen</h3>}
            {recipe.averageRating >= 0 && (
              <h3>
                <StarRating
                  rating={recipe.averageRating}
                  title={"Ocjena:"}
                ></StarRating>
              </h3>
            )}
          </div>
          <div className="row">
            <h3 style={{ color: "#f1356d" }}>
              Kategorije: {recipe.categories.toString().replaceAll(",", ", ")}
            </h3>
            {userInfo && userInfo.role === "GUEST" && (
              <h3>Prijavite se za ocjenjivanje</h3>
            )}
            {userInfo && userInfo.role !== "GUEST" && (
              <div className="tight-row">
                <h3 style={{ color: "#f1356d" }}>Vaša ocjena: </h3>
                <h3>
                  <RecipeRating
                    id={id}
                    fetchAverageRating={fetchAverageRating}
                  ></RecipeRating>
                </h3>
              </div>
            )}
          </div>
          <div className="row">
            <h4>
              Autor:{" "}
              <a
                style={{ color: "#f1356d", textDecoration: "underline" }}
                href={"/users/" + recipe.userId}
              >
                {recipe.username}
              </a>
            </h4>
            <div className="tight-row">
              <h4>Objavljen: {recipe.creationDate}</h4>
              {userInfo && userInfo.role !== "GUEST" && (
                <FavouriteButton
                  id={id}
                  numberOfFavourites={recipe.numberOfFavourites}
                  fetchRecipe={fetchRecipe}
                ></FavouriteButton>
              )}
            </div>
          </div>
          <div className="row">
            <div></div>
            <div>
              {userInfo &&
                (userInfo.role === "MODERATOR" ||
                  userInfo.role === "ADMIN" ||
                  userInfo.userId === recipe.userId) && (
                  <Button
                    type="primary"
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    Obriši recept
                  </Button>
                )}
              {userInfo &&
                (userInfo.role === "MODERATOR" ||
                  userInfo.role === "ADMIN" ||
                  userInfo.userId === recipe.userId) && (
                  <Button
                    type="primary"
                    onClick={() => {
                      handleEdit();
                    }}
                  >
                    Uredi recept
                  </Button>
                )}
            </div>
          </div>

          <div className="last-row"></div>
          <p>{recipe.shortDescription}</p>
          <br></br>
          <p>{recipe.longDescription}</p>
          <br></br>
          <div className="row">
            <div></div>
            <Image
              style={{ maxHeight: "500px" }}
              src={"/../../" + recipe.pathToPictures[0]}
              fallback={"/../../default.jpg"}
            />
            <div></div>
          </div>
          <br></br>
        </article>
      )}
      {userInfo && comments && (
        <NewComment
          id={id}
          fetchComments={fetchComments}
          isActive={userInfo.role !== "GUEST"}
        ></NewComment>
      )}
      <h2>Komentari:</h2>
      {!comments && <Loading></Loading>}
      {comments.length > 0 && (
        <CommentList
          comments={comments}
          fetchComments={fetchComments}
        ></CommentList>
      )}
      {comments.length === 0 && (
        <div>Ovaj recept još nema komentara, budite prvi!</div>
      )}
    </div>
  );
};

export default RecipeDetails;
