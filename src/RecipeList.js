import { Link } from "react-router-dom/cjs/react-router-dom";
import StarRating from "./StarRating";

const RecipeList = ({recipes}) => {
    const getStars = (rating) =>{
        if(rating < 0) rating = 0;
        return ("★".repeat(Math.round(rating)) + ("☆".repeat(5- Math.round(rating))))
    }
    return (
        <>
            <div className = "recipe-list">
                {recipes.map((recipe) =>(
                    <Link className= "recipe-preview" 
                        key = {recipe.id} to = {`/recipes/${recipe.id}`} style={{ 
                        backgroundImage: `url(${"/../../" + recipe.pathToPictures[0]})`
                      }}>
                        <div className="row">
                        <div></div> <StarRating rating={recipe.averageRating}></StarRating>
                        </div>
                        <div className="text-container">
                            <div className="text-container-header">
                                <h2>{recipe.title}</h2>
                                <h3>Autor: {recipe.username}</h3>
                            </div>
                            <p>Kategorije: {recipe.categories.toString().replace(',',", ")}</p>
                            <p>{recipe.shortDescription}</p>
                        </div>
                        
                    </Link>
                ))}
            </div>
        </>
    );
}
 
export default RecipeList;