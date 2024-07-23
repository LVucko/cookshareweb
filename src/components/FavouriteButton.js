import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const FavouriteButton = ({ id, numberOfFavourites, fetchRecipe }) => {
  const [isFavourite, setIsFavorite] = useState(false);
  useEffect(() => {
    fetchIsFavourite();
  }, []);
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
          -1 ❤ ({numberOfFavourites})
        </button>
      )}
      {!isFavourite && (
        <button
          id="favourite"
          onClick={() => {
            handleFavourite();
          }}
        >
          +1 ❤ ({numberOfFavourites})
        </button>
      )}
    </>
  );
};

export default FavouriteButton;
