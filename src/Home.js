import RecipeList from './RecipeList';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import RecipeSelector from './RecipeSelector';
const Home = () => {
    const [latestRecipes, setLatestRecipes] = useState(null);
    const [numberOfRecipes, setNumberOfRecipes] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    useEffect(() => {
        if(numberOfRecipes){
            fetchLatestRecipes(numberOfRecipes);
        }
    }, [numberOfRecipes]);
    function fetchLatestRecipes(number){
        axios.get('/api/recipes/latest/'+number).then((response) => {
            setLatestRecipes(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }
    return (
        <div>
            <RecipeSelector passSorting={(data)=>{setSortingBy(data)}} passNumber={(data)=>{setNumberOfRecipes(data)}}></RecipeSelector>
            {!latestRecipes && <div>Učitavam recepte...</div>}
            {latestRecipes && <RecipeList recipes= {latestRecipes} title = "Najnoviji recepti: " ></RecipeList>}
        </div>
    );
}
 
export default Home;