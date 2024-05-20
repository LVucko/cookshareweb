import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import CommentList from "./CommentList";
import useFetch from './useFetch';
const RecipeDetails = () => {
    const [newComment, setNewComment] = useState('');
    const [isPending, setIsPending] = useState(false);
    const {id} = useParams();
    const{ data: recipe , errorRecipe, isPendingRecipe} = useFetch('/api/recipes/' + id);
    const{ data: comments , errorComments, isPendingComments} = useFetch('/api/comments/r/' + id);
    const history = useHistory();

    const handleClick= () => {
        fetch('/api/recipes/delete/'+ recipe.id, {
            method: 'DELETE'
        }).then(() => {
            history.push('/');
        })

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const comment = {userId: recipe.userId, recipeId: recipe.id, comment: newComment};
        setIsPending(true);
        console.log(recipe);
        fetch('/api/comments', 
        {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(comment)
        }).then(()=> {
            console.log('Novi Komentar dodan');
            console.log({comment});
            setIsPending(false);
                        history.push('/');
        })
    }
    return (  
        <div className= "recipe-details">
            {isPendingRecipe && <div>Loading...</div>}
            {errorRecipe && <div>{errorRecipe}</div>}
            {recipe &&
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
            {isPendingComments && <div>Loading...</div>}
            {errorComments && <div>{errorComments}</div>}
            {comments && <CommentList comments= {comments} title = "Komentari" ></CommentList>}
            <form onSubmit = {handleSubmit}>
                <label>Komentiraj: </label>
                <textarea 
                    required 
                    value = {newComment} 
                    onChange = {(e) => setNewComment(e.target.value)}
                ></textarea>
                {!isPending && <button>Dodaj komentar</button>}
                {isPending && <button>Dodajem komentar....</button>}
            </form>
        </div>

    );
}

export default RecipeDetails;