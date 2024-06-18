import RecipeList from './RecipeList';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
const Home = () => {
    const [latestRecipes, setLatestRecipes] = useState(null);
    const [numberOfRecipes, setNumberOfRecipes] = useState('10');
    useEffect(() => {
        fetchLatestRecipes(10);
    }, []);
    function fetchLatestRecipes(number){
        axios.get('/api/recipes/latest/'+number).then((response) => {
            setLatestRecipes(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }
    const handleChange = (event) => {
        setNumberOfRecipes(event.target.value);
        fetchLatestRecipes(event.target.value);
      };

    return (  
        <div>
            <div>
                <label>Broj prikazanih recepata:  </label>
                <select value={numberOfRecipes} onChange={handleChange}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>

            </div>
            {!latestRecipes && <div>Učitavam recepte...</div>}
            {latestRecipes && <RecipeList recipes= {latestRecipes} title = "Najnoviji recepti: " ></RecipeList>}
        </div>
    );
}
 
export default Home;