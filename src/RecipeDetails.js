import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import CommentList from "./CommentList";
import axios from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";
import UserContext from "./UserContext"
import { decodeToken } from "react-jwt";
const RecipeDetails = () => {
    const {userInfo} = useContext(UserContext);
    const [recipe, setRecipe] = useState('');
    const [comments, setComments] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [selectedRating, setSelectedRating] = useState("5"); 
    const [userRating, setUserRating] = useState('');
    const {id} = useParams();
    useEffect(() => {
        fetchRecipe();
        if(decodeToken(Cookies.get('JWT'))){
            fetchUserRating()
        };
        fetchComments();
    },[]);
    const fetchRecipe = () =>{
        axios.get('/api/recipes/' + id).then((response) => {
            var isodate = new Date(response.data.creationDate);
            response.data.creationDate = isodate.toLocaleDateString('hr-HR')
            setRecipe(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const fetchUserRating = () =>{
        var token = Cookies.get('JWT');
        axios.get("/api/recipes/" + id + "/rating", {headers: { Authorization: "Bearer " + token }})
        .then((response) => {
            setUserRating(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const fetchComments = () =>{
        axios.get('/api/recipes/' + id +"/comments")
        .then((response) =>{
            setComments(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const handleRating = () => {
        setIsPending(true);
        const rating = {recipeId: id, rating: selectedRating};
        var token = Cookies.get('JWT');
        setIsPending(true);
        axios.post("/api/recipes/" + id + "/rating", rating, {headers: { Authorization: "Bearer " + token }})
        .then((response)=> {
            setUserRating(selectedRating);
            setIsPending(false); 
            fetchRecipe();
        }).catch((error) =>{
            console.log(error);
        });
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const comment = {recipeId: id, comment: newComment};
        setIsPending(true);
        var token = Cookies.get("JWT");
        axios.post("/api/recipes/" + id +"/comments", comment, {headers: { Authorization: "Bearer " + token }})
        .then((response) => {
            console.log('Novi Komentar dodan');
            fetchComments();
            setIsPending(false);
            setNewComment('');
        }).catch((error) => {
            setIsPending(false);
            console.log(error);
        });

    }
    return (  
        <div className= "recipe-details">
            {!recipe && <div>Loading...</div>}
            {recipe &&
                <article>
                    <h2>{recipe.title}</h2>
                    <p>Kategorije: {recipe.categories.toString()}</p>
                    {recipe.averageRating < 0 &&<h3>Ovaj recept još nije ocjenjen, budi prvi!</h3>}
                    {recipe.averageRating >= 0 &&<h3>Prosječna ocjena: {recipe.averageRating} / 5</h3>}
                    {userRating>0 && <h3>Vaša ocjena: {userRating} / 5</h3>}
                    {userRating<0 &&
                    <div>
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
                    
                    <p>Autor: <a href = {"/users/" +recipe.userId}>{recipe.username}</a></p>
                    <div>{recipe.shortDescription}</div>
                    <div>Datum kreiranja recepta: {recipe.creationDate}</div>
                    
                    <div>{recipe.longDescription}</div>
                    <img src={"/../../" + recipe.pathToPictures[0]} alt="Recipe"></img>
                </article>
                }
            {userInfo &&
                <form className="comment-new" onSubmit = {handleSubmit}>
                    <textarea 
                    placeholder="Napišite novi komentar"
                    required 
                    value = {newComment} 
                    onChange = {(e) => setNewComment(e.target.value)}
                    ></textarea>
                    {!isPending && <button>Dodaj komentar</button>}
                    {isPending && <button id="disabledButton" disabled={true}>Dodajem komentar....</button>}
                </form>
            }
            {!userInfo &&
                <form className="comment-new">
                    <textarea 
                    placeholder="Morate biti prijavljeni kako bi ste ostavili novi komentar"
                    disabled = {true}
                    onChange = {(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button id="disabledButton" disabled={true}>Komentirajte</button>
                </form>
            }
            <h2>Komentari:</h2>
            {!userInfo && <div>Prijavite se da bi ste mogli komentirati.</div>}
            {!comments && <div>Učitavam komentare</div>}
            {comments && <CommentList comments= {comments}></CommentList>}
            {comments.length === 0 && <div>Ovaj recept još nema komentara, budite prvi!</div>}
            
            
        </div>

    );
}

export default RecipeDetails;