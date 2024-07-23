import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { useEffect } from "react";

const RecipeCreate = () => {
  const { userInfo } = useContext(UserContext);
  const [recipe, setRecipe] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    categories: [],
    pictureIds: [0],
  });
  const [allCategories, setAllCategories] = useState();
  const [file, setFile] = useState("");
  const [isProcesing, setIsProcessing] = useState(false);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((response) => {
        setAllCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCheckboxChange = (event) => {
    const checkedId = event.target.value;
    if (event.target.checked) {
      setRecipe({
        ...recipe,
        categories: [...recipe.categories, checkedId],
      });
    } else {
      setRecipe({
        ...recipe,
        categories: recipe.categories.filter((id) => id !== checkedId),
      });
    }
  };

  function handlePictureChange(e) {
    setIsProcessing(true);
    if (e.target.files[0] === undefined) {
      setRecipe({ ...recipe, pictureIds: [0] });
      setFile(undefined);
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
        setIsProcessing(false);
        setRecipe({ ...recipe, pictureIds: [response.data] });
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
    axios
      .post("/api/recipes", recipe, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        history.push("/recipes/" + response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  if (userInfo)
    return (
      <div className="register">
        <h2>Dodaj novi recept</h2>
        <p>
          <br></br>
        </p>
        <form onSubmit={handleSubmit}>
          <label>Naziv recepta:</label>
          <input
            type="text"
            required
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          ></input>
          <label>Kratki opis:</label>
          <input
            type="text"
            required
            value={recipe.shortDescription}
            onChange={(e) =>
              setRecipe({ ...recipe, shortDescription: e.target.value })
            }
          ></input>
          <label>Postupak:</label>
          <textarea
            required
            value={recipe.longDescription}
            onChange={(e) =>
              setRecipe({ ...recipe, longDescription: e.target.value })
            }
          ></textarea>
          <label>Kategorije:</label>
          {allCategories &&
            allCategories.map((category) => (
              <div className="categories" key={category.name}>
                <label htmlFor={category.name}>
                  <input
                    type="checkbox"
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
          {!isProcesing && <button>Dodaj recept</button>}
          {isProcesing && (
            <button id="disabledButton" disabled={true}>
              Dodaj recept
            </button>
          )}
        </form>
      </div>
    );
  else
    return (
      <div className="register">
        <h2>Morate biti ulogirani kako bi se objavili recept</h2>
        <p>
          <br></br>
        </p>
        <Link to="/login">Kliknite ovdje za prijavu</Link>
        <p>
          <br></br>
        </p>
        <Link to="/register">Kliknite ovdje za registraciju</Link>
      </div>
    );
};

export default RecipeCreate;