import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const PictureUpload = ({
  pathToPicture,
  setId,
  setIsProcessing,
  defaultPictureId,
}) => {
  const [file, setFile] = useState("");

  useEffect(() => {
    if (pathToPicture !== undefined) setFile(pathToPicture);
  }, []);
  function handleUpload(e) {
    setIsProcessing(true);
    if (e.target.files[0] === undefined) {
      if (pathToPicture === undefined) {
        setFile(undefined);
        if (defaultPictureId === undefined) setId(0);
        else setId(defaultPictureId);
      } else {
        setFile(pathToPicture);
        setId(null);
      }
      setIsProcessing(false);
      return;
    }
    setFile(URL.createObjectURL(e.target.files[0]));
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log(response.data);
        setIsProcessing(false);
        setId(response.data);
      })
      .catch((error) => {
        setIsProcessing(false);
        console.log(error);
      });
  }
  return (
    <div className="Image">
      <label>Slika:</label>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {file && <img src={file} alt="Uploaded" />}
    </div>
  );
};

export default PictureUpload;
