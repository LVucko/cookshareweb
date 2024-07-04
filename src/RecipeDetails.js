import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import CommentList from "./CommentList";
import axios from "axios";
import { useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import UserContext from "./UserContext"
import RecipeRating from "./RecipeRating";
import NewComment from "./NewComment";
import StarRating from "./StarRating";
import Cookies from "js-cookie";
const RecipeDetails = () => {
    const {userInfo} = useContext(UserContext);
    const [recipe, setRecipe] = useState('');
    const [comments, setComments] = useState('');
    const {id} = useParams();
    const history = useHistory();
    useEffect(() => {
        fetchRecipe();
        fetchComments();
    },[]);

    const fetchRecipe = () =>{
        axios.get('/api/recipes/' + id).then((response) => {
            var isodate = new Date(response.data.creationDate);
            response.data.creationDate = isodate.toLocaleDateString('hr-HR');
            setRecipe(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const fetchAverageRating = () =>{
        axios.get('/api/recipes/' + id + '/rating/average').then((response) => {
            setRecipe({...recipe, averageRating: response.data});
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
    function handleDelete(){
        var token = Cookies.get("JWT");
        axios.delete("/api/recipes/"+ id, {headers: { Authorization: "Bearer " + token }})
        .then(() => {
            history.push("/");
        }).catch((error) => {
            console.log(error);
        });
    }
    function handleEdit(){
        history.push("/edit/"+id);
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
                    {!userInfo && <h3>Prijavite se za ocjenjivanje</h3>}
                    {userInfo && <h3 className="tight-row">Vaša ocjena: <RecipeRating id={id} fetchAverageRating={fetchAverageRating}></RecipeRating></h3>}
                </div>
                <div className="last-row">
                    <h4>Autor: <a href = {"/users/" +recipe.userId}>{recipe.username}</a></h4>
                    <h4>Datum kreiranja recepta: {recipe.creationDate}</h4>
                    
                </div>
                <div>{recipe.shortDescription}</div>
                <div>{recipe.longDescription}</div>
                {userInfo && (userInfo.role === "MODERATOR" || userInfo.role === "ADMIN" || userInfo.userId === id)  && 
                <button onClick={()=>{handleDelete()}}>Obriši recept</button>}
                {userInfo && (userInfo.role === "MODERATOR" || userInfo.role === "ADMIN" || userInfo.userId === recipe.userId)  && 
                <button onClick={()=>{handleEdit()}}>Uredi recept</button>}
                <img src={"/../../" + recipe.pathToPictures[0]} alt="Recipe"></img>
            </article>
            }
            {comments && <NewComment id={id} fetchComments={fetchComments}></NewComment>}
            <h2>Komentari:</h2>
            {!comments && <div>Učitavam komentare</div>}
            {comments && <CommentList comments= {comments} fetchComments={fetchComments}></CommentList>}
            {comments.length === 0 && <div>Ovaj recept još nema komentara, budite prvi!</div>}
        </div>

    );
}

export default RecipeDetails;