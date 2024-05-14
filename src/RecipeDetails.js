import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import useFetch from './useFetch';
const RecipeDetails = () => {
    const {id} = useParams();
    const{ data: recipe , error, isPending} = useFetch('/api/recipes/' + id);
    const history = useHistory();
    const handleClick= () => {
        fetch('/api/recipes/delete/'+ recipe.id, {
            method: 'DELETE'
        }).then(() => {
            history.push('/');
        })

    }
    return (  
        <div className= "recipe-details">
            {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}
            { recipe &&
            <article>
                <h2>{recipe.title}</h2>
                <p>Autor: <a href = {"/users/" +recipe.userId}>{recipe.username}</a></p>
                <div>{recipe.shortDescription}</div>
                <div>{Date(recipe.creationDate.replace(' ', 'T')).toString()}</div>
                <p>Kategorije: {recipe.categories.toString()}</p>
                <div>{recipe.longDescription}</div>
                <img src={"/../../" + recipe.pathToPictures[0]} alt="Recipe"></img>
                <button onClick={() => handleClick(recipe.id)}>delete</button>
            </article>

            }
        </div>
    );
}
<div></div>
 
export default RecipeDetails;