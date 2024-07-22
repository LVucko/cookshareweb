import RecipeList from "../components/RecipeList";
import RecipeSelector from "../components/RecipeSelector";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";

const Home = () => {
  const [recipes, setRecipes] = useState(null);
  const [numberOfRecipes, setNumberOfRecipes] = useState("");
  const [category, setCategory] = useState("");
  const [sortingBy, setSortingBy] = useState("");
  useEffect(() => {
    if (numberOfRecipes && category && sortingBy) fetchRecipes();
  }, [sortingBy, numberOfRecipes, category]);
  function fetchRecipes() {
    axios
      .get(
        "/api/recipes/" +
          sortingBy +
          "/" +
          numberOfRecipes +
          "/category/" +
          category
      )
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div>
      <RecipeSelector
        passSorting={(data) => {
          setSortingBy(data);
        }}
        passNumber={(data) => {
          setNumberOfRecipes(data);
        }}
        passCategory={(data) => {
          setCategory(data);
        }}
      ></RecipeSelector>
      {!recipes && <Loading></Loading>}
      {recipes && (
        <RecipeList recipes={recipes} fetchRecipes={fetchRecipes}></RecipeList>
      )}
    </div>
  );
};

export default Home;
