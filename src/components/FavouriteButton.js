import { useEffect, useState } from "react";
import axios from "axios";
import { getJWT } from "../utils/utilities";
import { Button, Tooltip } from "antd";

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
        <Tooltip placement="right" title={"Ukloni iz omiljenih recepata"}>
          <Button
            type="primary"
            style={{ background: "#cc235b" }}
            onClick={() => {
              handleFavourite();
            }}
          >
            {numberOfFavourites} ❤
          </Button>
        </Tooltip>
      ) : (
        <Tooltip placement="right" title={"Dodaj u omiljene recepte"}>
          <Button
            type="primary"
            onClick={() => {
              handleFavourite();
            }}
          >
            {numberOfFavourites} ❤
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default FavouriteButton;
