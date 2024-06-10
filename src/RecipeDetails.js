import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import CommentList from "./CommentList";
import useFetch from './useFetch';
const RecipeDetails = () => {
    const [newComment, setNewComment] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [selectedRating, setSelectedRating] = useState("5"); 
    const {id} = useParams();
    const{ data: recipe , error: errorRecipe, isPending: isPendingRecipe} = useFetch('/api/recipes/' + id);
    const{ data: comments , error: errorComments, isPending: isPendingComments} = useFetch('/api/recipes/' + id +"/comments");
    
    const{ data: userRating, error: errorUserRating, isPending: isPendingUserRating} = useFetch('/api/recipes/' + id + '/rating');
    const history = useHistory();
    const handleClick= () => {
        fetch('/api/recipes/'+ recipe.id, {
            method: 'DELETE'
        }).then(() => {
            history.push('/');
        })
    }
    const handleRating = () => {
        const rating = {recipeId: recipe.id, rating: selectedRating};
        setIsPending(true);
        fetch("/api/recipes/" + id + "/rating", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(rating)
        }).then(()=> {
            console.log('Ocjenjena dodana');
            console.log({rating});
            setIsPending(false); 
            window.location.reload();     
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const comment = {recipeId: recipe.id, comment: newComment};
        setIsPending(true);
        console.log(recipe);
        fetch("/api/recipes/" + id +"/comments", 
        {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(comment)
        }).then(()=> {
            console.log('Novi Komentar dodan');
            console.log({comment});
            setIsPending(false); 
            window.location.reload();     
        })

    }
    return (  
        <div className= "recipe-details">

            {isPendingUserRating && <div>Loading...</div>}
            {errorUserRating && <h3>{errorRecipe}</h3>}
            {userRating>0 && <h3>Vaša ocjena: {userRating} / 5</h3>}
            {userRating<0 && <div>
                <h3>Ocjeni ovaj recept: </h3>
                <input 
                            type="radio" id="1" value="1"
                            checked={ selectedRating === "1"} 
                            onChange={() => 
                                setSelectedRating("1") 
                            } 
                /> 
                <label htmlFor="1"> 1 </label> 

                <input 
                            type="radio" id="2" value="2"
                            checked={ selectedRating === "2"} 
                            onChange={() => 
                                setSelectedRating("2") 
                            } 
                /> 
                <label htmlFor="2"> 2 </label> 

                <input 
                            type="radio" id="3" value="3"
                            checked={ selectedRating === "3"} 
                            onChange={() => 
                                setSelectedRating("3") 
                            } 
                /> 
                <label htmlFor="3"> 3 </label> 

                <input 
                            type="radio" id="4" value="4"
                            checked={ selectedRating === "4"} 
                            onChange={() => 
                                setSelectedRating("4") 
                            } 
                /> 
                <label htmlFor="4"> 4 </label> 

                <input 
                            type="radio" id="5" value="5"
                            checked={ selectedRating === "5"} 
                            onChange={() => 
                                setSelectedRating("5") 
                            } 
                /> 
                <label htmlFor="5"> 5 </label> 
                <button onClick={() => handleRating()}>Ocjeni</button>
            </div>}

            {isPendingRecipe && <div>Loading...</div>}
            {errorRecipe && <div>{errorRecipe}</div>}
            {recipe &&
                <article>
                    {recipe.averageRating < 0 &&<h3>Ovaj recept još nije ocjenjen, budi prvi!</h3>}
                    {recipe.averageRating >= 0 &&<h3>Prosječna ocjena: {recipe.averageRating} / 5</h3>}
                    <h2>{recipe.title}</h2>
                    <p>Autor: <a href = {"/users/" +recipe.userId}>{recipe.username}</a></p>
                    <div>{recipe.shortDescription}</div>
                    <div>{recipe.creationDate}</div>
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