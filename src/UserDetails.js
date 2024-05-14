import { useParams } from "react-router-dom/cjs/react-router-dom";
import useFetch from './useFetch';
import RecipeList from './RecipeList';
const UserDetails = () => {
    const {id} = useParams();
    const{data: user, userError, isPendingUser} = useFetch('/api/users/' + id);
    const{data: recipes, recipesError, isPendingRecipes} = useFetch('/api/recipes/userrecipes/' + id);
    return (  
        <div className= "recipe-details">
            {isPendingUser && <div>Loading...</div>}
            {userError && <div>{userError}</div>}
            {user &&
            <article>
                <h2>{user.username}</h2>
                <div>{Date(user.creationDate.replace(' ', 'T')).toString()}</div>
                <img src={"/../../" + user.pathToPicture} alt="Profile"></img>
            </article>
            }
            <div className="home">
            {recipesError && <div>{recipesError}</div>}
            {isPendingRecipes && <div>Učitavam...</div>}
            {recipes && <RecipeList recipes= {recipes} title = {"Svi recepti korisnika "+ user.username} ></RecipeList>}
        </div>
        </div>
    );
}
<div></div>
 
export default UserDetails;