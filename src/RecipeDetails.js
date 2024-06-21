import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import CommentList from "./CommentList";
import axios from "axios";
import Cookies from "js-cookie";
import { useContext } from "react";
import UserContext from "./UserContext"
import RecipeRating from "./RecipeRating";
import NewComment from "./NewComment";
import StarRating from "./StarRating";
const RecipeDetails = () => {

    const {userInfo} = useContext(UserContext);
    const [recipe, setRecipe] = useState('');
    const [comments, setComments] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [isDisabled, setIsDisabled] = useState('');
    const [userRating, setUserRating] = useState('');
    const {id} = useParams();
    useEffect(() => {
        fetchRecipe();
        if(Cookies.get("JWT")){
            setIsDisabled(false);
            fetchUserRating();
        }else setIsDisabled(true);
        fetchComments();
    },[]);
    const getStars = (rating) =>{
        return 100 - (20*rating);
    }
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
        axios.get('/api/recipes/' + id + "/comments")
        .then((response) =>{
            setComments(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    function handleRating(rating){
        setIsPending(true);
        const newRating = {recipeId: id, rating: rating};
        var token = Cookies.get('JWT');
        setIsPending(true);
        axios.post("/api/recipes/" + id + "/rating", newRating, {headers: { Authorization: "Bearer " + token }})
        .then(()=> {
            setUserRating(rating);
            setIsPending(false); 
            fetchRecipe();
        }).catch((error) =>{
            console.log(error);
        });
   
    }
    function handleComment(comment){
        const newComment = {recipeId: id, comment: comment};
        setIsPending(true);
        var token = Cookies.get("JWT");
        axios.post("/api/recipes/" + id +"/comments", newComment, {headers: { Authorization: "Bearer " + token }})
        .then((response) => {
            fetchComments();
            setIsPending(false);
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
                <div className="row">
                    <h2>{recipe.title}</h2>
                    {recipe.averageRating < 0 &&<h3>Nije ocjenjen</h3>}
                    {recipe.averageRating >= 0 && <h3><StarRating rating={recipe.averageRating} title = {"Ocjena:"}></StarRating></h3>}
                </div>
                <div className="row">
                <h3>Kategorije: {recipe.categories.toString()}</h3>
                    {userRating>0 && <h3><StarRating rating={userRating} title = {"Vaša ocjena:"}></StarRating></h3>}
                    {!userRating && <h3>Prijavite se za ocjenjivanje</h3>}
                    {userRating<0 && <h3><RecipeRating passRating={handleRating}></RecipeRating></h3>}
                </div>
                <div className="last-row">
                    <h4>Autor: <a href = {"/users/" +recipe.userId}>{recipe.username}</a></h4>
                    <h4>Datum kreiranja recepta: {recipe.creationDate}</h4>
                </div>
                <div>{recipe.shortDescription}</div>
                <div>{recipe.longDescription}</div>
                <img src={"/../../" + recipe.pathToPictures[0]} alt="Recipe"></img>
            </article>
            }
            {comments && <NewComment isPending={isPending} isDisabled={isDisabled} passComment={handleComment}></NewComment>}
            <h2>Komentari:</h2>
            {!comments && <div>Učitavam komentare</div>}
            {comments && <CommentList comments= {comments}></CommentList>}
            {comments.length === 0 && <div>Ovaj recept još nema komentara, budite prvi!</div>}
        </div>

    );
}

export default RecipeDetails;