import UserContext from "./UserContext";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const RecipeEdit = () => {
  const { userInfo } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [allCategories, setAllCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [pictureIds, setPictureIds] = useState([]);
  const [file, setFile] = useState("");
  const [isProcesing, setIsProcessing] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const [recipeCategories, setRecipeCategories] = useState(null);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((response) => {
        console.log(response.data);
        setAllCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("/api/recipes/" + id)
      .then((response) => {
        setTitle(response.data.title);
        setRecipeCategories(response.data.categories);
        setShortDescription(response.data.shortDescription);
        setLongDescription(response.data.longDescription);
        setFile("/../../" + response.data.pathToPictures[0]);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (allCategories && recipeCategories) {
      var checkedCategories = [];
      allCategories.forEach((category) => {
        if (recipeCategories.includes(category.name)) {
          checkedCategories.push(category.id.toString());
        }
      });
      setSelectedCategories(checkedCategories);
    }
  }, [allCategories, recipeCategories]);

  const handleCheckboxChange = (event) => {
    console.log(selectedCategories);
    const checkedId = event.target.value;
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, checkedId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== checkedId)
      );
    }
  };

  function handlePictureChange(e) {
    setIsProcessing(true);
    if (e.target.files[0] === undefined) {
      setFile(undefined);
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
        setIsProcessing(false);
        setPictureIds([response.data]);
      })
      .catch((error) => {
        setIsProcessing(false);
        console.log(error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    var token = Cookies.get("JWT");
    if (token === null) {
      return;
      //ako istekne token ili nesta
    }
    axios
      .put(
        "/api/recipes",
        {
          id: id,
          title: title,
          shortDescription: shortDescription,
          longDescription: longDescription,
          categories: selectedCategories,
          pictureIds: pictureIds,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        setIsProcessing(false);
        history.push("/recipes/" + id);
      })
      .catch((error) => {
        setIsProcessing(false);
        console.log(error);
      });
  };
  if (userInfo)
    return (
      <div className="register">
        <h2>Izmjena recepta: </h2>
        <p>
          <br></br>
        </p>
        <form onSubmit={handleSubmit}>
          <label>Naziv recepta:</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <label>Kratki opis:</label>
          <input
            type="text"
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          ></input>
          <label>Postupak</label>
          <textarea
            required
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
          ></textarea>
          <label>Kategorije (barem jedna):</label>
          {recipeCategories &&
            allCategories &&
            allCategories.map((category) => (
              <div className="categories" key={category.name}>
                <label htmlFor={category.name}>
                  <input
                    type="checkbox"
                    defaultChecked={recipeCategories.includes(category.name)}
                    id={category.id}
                    name={category.name}
                    value={category.id}
                    onChange={(event) => {
                      handleCheckboxChange(event);
                    }}
                  ></input>
                  {category.name}
                </label>
              </div>
            ))}
          <div className="Image">
            <label>Slika:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
            />
            {file && <img src={file} alt="Uploaded" />}
          </div>
          {!isProcesing && <button>Izmjeni recept</button>}
          {isProcesing && (
            <button id="disabledButton" disabled={true}>
              Izmjeni recept
            </button>
          )}
        </form>
      </div>
    );
  else return <div className="register"></div>;
};

export default RecipeEdit;
