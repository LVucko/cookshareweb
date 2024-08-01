import { useEffect, useState } from "react";
import axios from "axios";
import { getJWT } from "../utils/utilities";

const FavouriteButton = ({ id, numberOfFavourites, fetchRecipe }) => {
  const [isFavourite, setIsFavorite] = useState(false);
  useEffect(() => {
    fetchIsFavourite();
  }, []);
  const fetchIsFavourite = () => {
    axios
      .get("/api/recipes/" + id + "/favourite", {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then((response) => {
        setIsFavorite(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function handleFavourite() {
    if (!isFavourite) {
      axios
        .post(
          "/api/recipes/" + id + "/favourite",
          {},
          {
            headers: { Authorization: "Bearer " + getJWT() },
          }
        )
        .then(() => {
          setIsFavorite(!isFavourite);
          fetchRecipe();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .delete("/api/recipes/" + id + "/favourite", {
          headers: { Authorization: "Bearer " + getJWT() },
        })
        .then(() => {
          setIsFavorite(!isFavourite);
          fetchRecipe();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <>
      {isFavourite ? (
        <button
          id="unfavourite"
          onClick={() => {
            handleFavourite();
          }}
        >
          {numberOfFavourites} ❤
        </button>
      ) : (
        <button
          id="favourite"
          onClick={() => {
            handleFavourite();
          }}
        >
          {numberOfFavourites} ❤
        </button>
      )}
    </>
  );
};

export default FavouriteButton;
