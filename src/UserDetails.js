import { useParams } from "react-router-dom/cjs/react-router-dom";
import useFetch from './useFetch';
import RecipeList from './RecipeList';
const UserDetails = () => {
    const {id} = useParams();
    const{data: user, error: userError, ispending: isPendingUser} = useFetch('/api/users/' + id);
    const{data: recipes, error:recipesError, ispending: isPendingRecipes} = useFetch('/api/recipes/user/' + id);
    return (  
        <div className= "recipe-details">
            {isPendingUser && <div>Loading...</div>}
            {userError && <div>{userError}</div>}
            {user &&
            <article>
                <h2>{user.username}</h2>
                <div>Datum kreiranja računa: {(user.creationDate.substring(0, 10).replaceAll('-', ' '))}</div>
                <img src={"/../../" + user.pathToPicture} alt="Profile"></img>
            </article>
            }
            <div className="home">
                {recipesError && <div>{recipesError}</div>}
                {isPendingRecipes && <div>Učitavam...</div>}
                {recipes && user && <RecipeList recipes= {recipes} title = {"Svi recepti korisnika "+ user.username} ></RecipeList>}
            </div>
        </div>
    );
}
<div></div>
 
export default UserDetails;