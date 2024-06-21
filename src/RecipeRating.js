function RecipeRating({ passRating }) {
    function handleRating(selectedRating){
        console.log(selectedRating);
        passRating(selectedRating);
    }
    return (
        <div className="recipe-rating">
            <input type="radio" id="5" value="5"
                onChange={() => handleRating("5") } 
            /> 
            <label htmlFor="5">★</label> 

            <input type="radio" id="4" value="4"
                onChange={() => handleRating("4") } 
            /> 
            <label htmlFor="4">★</label> 

            <input type="radio" id="3" value="3"
                onChange={() => handleRating("3") } 
            /> 
            <label htmlFor="3">★</label> 

            <input type="radio" id="2" value="2"
                onChange={() => handleRating("2") } 
            /> 
            <label htmlFor="2">★</label> 

            <input type="radio" id="1" value="1"
                onChange={() => handleRating("1") } 
            /> 
            <label htmlFor="1">★</label> 
        </div>
    );
}

export default RecipeRating;