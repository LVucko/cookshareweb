import { useEffect, useState } from "react";
import axios from "axios";
import { getJWT } from "../utils/utilities";

const FavouriteButton = ({ id, numberOfFavourites, fetchRecipe }) => {
  const [isFavourite, setIsFavorite] = useState(false);
  useEffect(() => {
    fetchIsFavourite();
  }, []);
  const fetchIsFavourite = () => {
    var token = getJWT();
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
  function handleFavourite() {
    var token = getJWT();
    if (!isFavourite) {
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
          fetchRecipe();
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
            fetchRecipe();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }

  return (
    <>
      {isFavourite && (
        <button
          id="unfavourite"
          onClick={() => {
            handleFavourite();
          }}
        >
          {numberOfFavourites} ❤
        </button>
      )}
      {!isFavourite && (
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
