import { useEffect, useState } from "react";

const ImageBox = ({ pictures }) => {
  const [currentPictureIndex, setCurrentPictureIndex] = useState(
    pictures.length - 1
  );
  return (
    <div className="image-box">
      <img
        className="background-image"
        src={"/../../" + pictures[currentPictureIndex]}
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
            {"<"}
          </button>
        )}
        <button className="delete-button">delete</button>
        {currentPictureIndex < pictures.length - 1 && (
          <button
            className="left-right-button"
            onClick={() => {
              setCurrentPictureIndex(currentPictureIndex + 1);
            }}
          >
            {">"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageBox;
