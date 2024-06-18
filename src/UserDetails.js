import { useParams } from "react-router-dom/cjs/react-router-dom";
import RecipeList from './RecipeList';
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const UserDetails = () => {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState(null);
    useEffect(() => {
        axios.get('/api/users/' + id).then((response) => {
        setUser(response.data);
        });
    }, [id]);
    useEffect(() => {
        axios.get('/api/recipes/user/' + id).then((response) => {
        setRecipes(response.data);
        });
    }, [id]);

    return (  
        <div>
            {!user && <div>Loading...</div>}
            {user &&
            <article>
                <h2>{user.username}</h2>
                <div>Datum kreiranja računa: {(user.creationDate.substring(0, 10).replaceAll('-', ' '))}</div>
                <img src={"/../../" + user.pathToPicture} alt="Profile"></img>
            </article>
            }
            <div>
                {!recipes && <div>Učitavam...</div>}
                {recipes && user && <RecipeList recipes= {recipes} title = {"Svi recepti korisnika "+ user.username} ></RecipeList>}
            </div>
        </div>
    );
}
<div></div>
 
export default UserDetails;