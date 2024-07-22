import UserContext from "../contexts/UserContext";
import { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import NotFound from "./NotFound";

const RecipeEdit = () => {
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const history = useHistory();
  const [file, setFile] = useState("");
  const [isProcesing, setIsProcessing] = useState(false);
  const [recipe, setRecipe] = useState({
    id: id,
    userId: "",
    title: "",
    shortDescription: "",
    longDescription: "",
    categories: "",
    pictureIds: [],
  });
  const [allCategories, setAllCategories] = useState(null);

  useEffect(() => {
    axios
      .get("/api/recipes/" + id)
      .then((response) => {
        setRecipe({
          ...recipe,
          userId: response.data.userId,
          title: response.data.title,
          categories: response.data.categories,
          shortDescription: response.data.shortDescription,
          longDescription: response.data.longDescription,
        });
        setFile("/../../" + response.data.pathToPictures[0]);
        axios
          .get("/api/categories")
          .then((response) => {
            setAllCategories(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (allCategories && recipe) {
      var checkedCategories = [];
      allCategories.forEach((category) => {
        if (recipe.categories.includes(category.name)) {
          checkedCategories.push(category.id.toString());
        }
      });
      setRecipe({
        ...recipe,
        categories: checkedCategories,
      });
    }
  }, [allCategories]);

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
        console.log(response.data);
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
      .put("/api/recipes", recipe, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        history.push("/recipes/" + id);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((error) => {
        setIsProcessing(false);
      });
  };
  if (
    userInfo &&
    recipe &&
    (userInfo.userId === recipe.userId ||
      userInfo.role === "MODERATOR" ||
      userInfo.role === "ADMIN")
  )
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
          <label>Postupak</label>
          <textarea
            required
            value={recipe.longDescription}
            onChange={(e) =>
              setRecipe({ ...recipe, longDescription: e.target.value })
            }
          ></textarea>
          <label>Kategorije (barem jedna):</label>
          {recipe &&
            allCategories &&
            allCategories.map((category) => (
              <div className="categories" key={category.name}>
                <label htmlFor={category.name}>
                  <input
                    type="checkbox"
                    defaultChecked={recipe.categories.includes(category.name)}
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
  else return <NotFound></NotFound>;
};

export default RecipeEdit;
