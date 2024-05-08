import RecipeList from './RecipeList';
import useFetch from './useFetch';
const Home = () => {
    const {data: recipes, isPending, error} = useFetch('/api/recipes/all');
    return (  
        <div className="home">
            {error && <div>{error}</div>}
            {isPending && <div>Učitavam...</div>}
            {recipes && <RecipeList recipes= {recipes} title = "Svi recepti" ></RecipeList>}
        </div>
    );
}
 
export default Home;