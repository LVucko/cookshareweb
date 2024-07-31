import { useState } from "react";
import axios from "axios";
import { getJWT } from "../utils/utilities";
const ImageBox = ({ pictures, fetchPictures }) => {
  const [currentPictureIndex, setCurrentPictureIndex] = useState(
    pictures.length - 1
  );
  function handleDelete() {
    var token = getJWT();
    axios
      .delete("/api/upload/" + pictures[currentPictureIndex].id, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        fetchPictures();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="image-box">
      <img
        className="background-image"
        src={"/../../" + pictures[currentPictureIndex].pathToPicture}
        alt="Recipe"
      ></img>
      <div className="buttons">
        {currentPictureIndex > 0 && (
          <button
            className="left-right-button"
            onClick={() => {
              setCurrentPictureIndex(currentPictureIndex - 1);
            }}
          >
            {" < "}
          </button>
        )}
        <button className="delete-button" onClick={handleDelete}>
          delete
        </button>
        {currentPictureIndex < pictures.length - 1 && (
          <button
            className="left-right-button"
            onClick={() => {
              setCurrentPictureIndex(currentPictureIndex + 1);
            }}
          >
            {" > "}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageBox;
