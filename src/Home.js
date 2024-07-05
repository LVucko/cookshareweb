import RecipeList from './RecipeList';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import RecipeSelector from './RecipeSelector';
const Home = () => {
    const [recipes, setRecipes] = useState(null);
    const [numberOfRecipes, setNumberOfRecipes] = useState('');
    const [category, setCategory] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    useEffect(() => {
        if(numberOfRecipes && category && sortingBy)
            fetchRecipes();
    }, [sortingBy, numberOfRecipes, category]);
    function fetchRecipes(){
        axios.get('/api/recipes/' +sortingBy+ '/'+ numberOfRecipes + '/category/' + category).then((response) => {
            setRecipes(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }
    return (
        <div>
            <RecipeSelector passSorting={(data)=>{setSortingBy(data)}} passNumber={(data)=>{setNumberOfRecipes(data)}} passCategory={(data)=>{setCategory(data)}}></RecipeSelector>
            {!recipes && <div className="tight-row"><img className="row" alt="loading" src={"loading.gif"}></img></div>}
            {recipes && <RecipeList recipes= {recipes}></RecipeList>}
        </div>
    );
}
 
export default Home;