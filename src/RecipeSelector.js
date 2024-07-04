import { useEffect, useState } from "react";
import axios from "axios";


function RecipeSelector({ passSorting, passNumber, passCategory }) {
    const [number, setNumber] = useState('15');
    const [sorting, setSorting] = useState('latest');
    const [category, setCategory] = useState('0');
    const [categories, setCategories] = useState();
    useEffect(() => {
        axios.get('/api/categories').then((response) => {
            setCategories(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        passNumber(number);
    }, [number]);
    useEffect(() => {
        passSorting(sorting);
    }, [sorting]);
    useEffect(() => {
        passCategory(category);
    }, [category])
    const handleNumberChange = (event) => {
        setNumber(event.target.value);
    };
    const handleSortingChange = (event) => {
        setSorting(event.target.value);
    };
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <div>
            <div className='recipe-selector'>
                    <div>
                    <label>Sortiraj po:  </label>
                        <select value={sorting} onChange={handleSortingChange}>
                            <option value="latest">najnoviji</option>
                            <option value="best">najbolje ocjenjeni</option>
                            <option value="least">najmanje ocjenjeni</option>
                        </select>

                    </div>
                    <div>
                        <label>Broj prikazanih recepata:  </label>
                        <select value={number} onChange={handleNumberChange}>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="60">60</option>
                        </select>

                    </div>
                    <div>
                        <label>Kategorija:  </label>
                        <select value={category} onChange={handleCategoryChange}>
                            <option key = "0" value="0">Sve</option>
                            {categories && categories.map((category) =>(
                                <option key = {category.id} value = {category.id}>{category.name}</option>
                            ))};
                        </select>
                    </div>
                </div>
        </div>
    );
}

export default RecipeSelector;