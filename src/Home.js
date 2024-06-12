import RecipeList from './RecipeList';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
const Home = () => {
    const [latestRecipes, setLatestRecipes] = useState(null);
    useEffect(() => {
        axios.get('/api/recipes/latest/10').then((response) => {
        setLatestRecipes(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (  
        <div className="home">
            {!latestRecipes && <div>Učitavam recepte...</div>}
            {latestRecipes && <RecipeList recipes= {latestRecipes} title = "Najnoviji recepti: " ></RecipeList>}
        </div>
    );
}
 
export default Home;