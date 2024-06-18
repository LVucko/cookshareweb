import { Link } from "react-router-dom/cjs/react-router-dom";

const RecipeList = ({recipes, title, handleDelete}) => {
    const getStars = (rating) =>{
        if(rating < 0) rating = 0;
        return ("★".repeat(Math.round(rating)) + ("☆".repeat(5- Math.round(rating))))
    }
    return (
        <>
            <h1>{title}</h1>
            <div className = "recipe-list">
                {recipes.map((recipe) =>(
                    <Link className= "recipe-preview" 
                        key = {recipe.id} to = {`/recipes/${recipe.id}`} style={{ 
                        backgroundImage: `url(${"/../../" + recipe.pathToPictures[0]})`
                      }}>
                        <div className="image-container"></div>
                        <div className="text-container">
                            <div className="text-container-header">
                                <h2>{recipe.title}</h2>
                                <h3>Autor: {recipe.username}</h3>
                            </div>
                            <p>Ocjena: {getStars(recipe.averageRating)}</p>
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