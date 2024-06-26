import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function RecipeRating({id, fetchAverageRating}) {
    const [userRating, setUserRating] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
            fetchUserRating();
    },[]);
    const fetchUserRating = () =>{
        var token = Cookies.get('JWT');
        axios.get("/api/recipes/" + id + "/rating", {headers: { Authorization: "Bearer " + token }})
        .then((response) => {
            setUserRating(response.data);
            setSelectedRating(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    function handleRating(rating){
        if(isDisabled) return;
        setIsDisabled(true);
        console.log(selectedRating);
        setSelectedRating(rating);
        const newRating = {recipeId: id, rating: rating};
        var token = Cookies.get('JWT');
        if(userRating<=0)
            axios.post("/api/recipes/" + id + "/rating", newRating, {headers: { Authorization: "Bearer " + token }})
            .then(()=> {
                fetchAverageRating();
                fetchUserRating();
                setIsDisabled(false);
            }).catch((error) =>{
                console.log(error);
                setSelectedRating(userRating);
                setIsDisabled(false);
            });
        else  axios.put("/api/recipes/" + id + "/rating", newRating, {headers: { Authorization: "Bearer " + token }})
            .then(()=> {
                fetchAverageRating();
                fetchUserRating();
                setIsDisabled(false);
            }).catch((error) =>{
                console.log(error);
                setSelectedRating(userRating);
                setIsDisabled(false);
            });
    }

    return (
        <div className="recipe-rating">
            <input type="radio" id="5" value={5}
                checked = {selectedRating === 5}
                onChange={() => handleRating(5) } 
            /> 
            <label htmlFor="5">★</label> 

            <input type="radio" id="4" value={4}
                checked = {selectedRating === 4}
                onChange={() => handleRating(4) } 
            /> 
            <label htmlFor="4">★</label> 

            <input type="radio" id="3" value={3}
                checked = {selectedRating === 3}
                onChange={() => handleRating(3) } 
            /> 
            <label htmlFor="3">★</label> 

            <input type="radio" id="2" value={2}
            checked = {selectedRating === 2}  
                onChange={() => handleRating(2) } 
            /> 
            <label htmlFor="2">★</label> 

            <input type="radio" id="1" value={1}
            checked = {selectedRating === 1}
                onChange={() => handleRating(1) } 
            /> 
            <label htmlFor="1">★</label> 
        </div>
    );
}

export default RecipeRating;