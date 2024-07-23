import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CommentList from "../components/CommentList";
import UserContext from "../contexts/UserContext";
import RecipeRating from "../components/RecipeRating";
import NewComment from "../components/NewComment";
import StarRating from "../components/StarRating";
import Loading from "../components/Loading";
import FavouriteButton from "../components/FavouriteButton";

const RecipeDetails = () => {
  const { userInfo } = useContext(UserContext);
  const [recipe, setRecipe] = useState("");
  const [comments, setComments] = useState("");
  const [isFavourite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    fetchRecipe();
    fetchComments();
    fetchIsFavourite();
  }, []);

  const fetchRecipe = () => {
    axios
      .get("/api/recipes/" + id)
      .then((response) => {
        var isodate = new Date(response.data.creationDate);
        response.data.creationDate = isodate.toLocaleDateString("hr-HR");
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
  const fetchIsFavourite = () => {
    var token = Cookies.get("JWT");
    axios
      .get("/api/recipes/" + id + "/favourite", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsFavorite(response.data);
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
    var token = Cookies.get("JWT");
    axios
      .delete("/api/recipes/" + id, {
        headers: { Authorization: "Bearer " + token },
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

  function handleFavourite() {
    var token = Cookies.get("JWT");
    if (!isFavourite) {
      console.log("nije favorit");
      axios
        .post(
          "/api/recipes/" + id + "/favourite",
          {},
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(() => {
          setIsFavorite(!isFavourite);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (isFavourite) {
      if (isFavourite) {
        axios
          .delete("/api/recipes/" + id + "/favourite", {
            headers: { Authorization: "Bearer " + token },
          })
          .then(() => {
            setIsFavorite(!isFavourite);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
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
            <h3>
              Kategorije: {recipe.categories.toString().replaceAll(",", ", ")}
            </h3>
            {!userInfo && <h3>Prijavite se za ocjenjivanje</h3>}
            {userInfo && (
              <h3 className="tight-row">
                Vaša ocjena:{" "}
                <RecipeRating
                  id={id}
                  fetchAverageRating={fetchAverageRating}
                ></RecipeRating>
              </h3>
            )}
          </div>
          <div className="row">
            <h4>
              Autor: <a href={"/users/" + recipe.userId}>{recipe.username}</a>
            </h4>
            <div className="tight-row">
              <h4>Objavljen: {recipe.creationDate}</h4>
              {userInfo && (
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
                  <button
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    Obriši recept
                  </button>
                )}
              {userInfo &&
                (userInfo.role === "MODERATOR" ||
                  userInfo.role === "ADMIN" ||
                  userInfo.userId === recipe.userId) && (
                  <button
                    onClick={() => {
                      handleEdit();
                    }}
                  >
                    Uredi recept
                  </button>
                )}
            </div>
          </div>
          <div className="last-row"></div>
          <div>{recipe.shortDescription}</div>
          <div>{recipe.longDescription}</div>
          <img src={"/../../" + recipe.pathToPictures[0]} alt="Recipe"></img>
        </article>
      )}
      {comments && (
        <NewComment id={id} fetchComments={fetchComments}></NewComment>
      )}
      <h2>Komentari:</h2>
      {!comments && <Loading></Loading>}
      {comments && (
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
