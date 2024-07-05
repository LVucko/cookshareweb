import { Link } from "react-router-dom/cjs/react-router-dom";
import StarRating from "./StarRating";

const RecipeList = ({recipes}) => {
    return (
        <div className = "recipe-list">
            {recipes.map((recipe) =>(
                <Link className= "recipe-preview" 
                    key = {recipe.id} to = {`/recipes/${recipe.id}`} style={{ 
                    backgroundImage: `url(${"/../../" + recipe.pathToPictures[0]})`
                    }}>
                    <div className="row">
                        <div></div> 
                        <StarRating rating={recipe.averageRating}></StarRating>
                    </div>
                    <div className="text-container">
                        <div className="text-container-header">
                            <h2>{recipe.title}</h2>
                            <h3>{recipe.username}</h3>
                        </div>
                        <p>Kategorije: {recipe.categories.toString().replaceAll(',',", ").toLowerCase()}</p>
                        <p>{recipe.shortDescription}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
 
export default RecipeList;