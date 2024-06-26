import RecipeList from './RecipeList';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import RecipeSelector from './RecipeSelector';
const Home = () => {
    const [recipes, setRecipes] = useState(null);
    const [numberOfRecipes, setNumberOfRecipes] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    useEffect(() => {
        if(numberOfRecipes){
            fetchRecipes(numberOfRecipes);
        }
    }, [sortingBy, numberOfRecipes]);
    function fetchRecipes(number){
        axios.get('/api/recipes/' +sortingBy+ '/'+number).then((response) => {
            setRecipes(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }
    return (
        <div>
            <RecipeSelector passSorting={(data)=>{setSortingBy(data)}} passNumber={(data)=>{setNumberOfRecipes(data)}}></RecipeSelector>
            {!recipes && <div>Učitavam recepte...</div>}
            {recipes && <RecipeList recipes= {recipes}></RecipeList>}
        </div>
    );
}
 
export default Home;