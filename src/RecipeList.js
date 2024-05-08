import { Link } from "react-router-dom/cjs/react-router-dom";

const RecipeList = ({recipes, title, handleDelete}) => {

    return (  
        <div className = "recipe-list">
            <h1>{title}</h1>
            {recipes.map((recipe) =>(
                <div className= "recipe-preview" key = {recipe.id}>
                    <Link to = {`/recipes/${recipe.id}`}>
                    <h2>{recipe.title}</h2>
                    <h3>By: {recipe.username}</h3>
                    <p>{recipe.shortDescription}</p>
                    <p>{recipe.categories.toString()}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
}
 
export default RecipeList;