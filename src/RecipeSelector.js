import { useEffect, useState } from "react";

function RecipeSelector({ passSorting, passNumber }) {
    const [number, setNumber] = useState('10');
    const [sorting, setSorting] = useState('latest');
    useEffect(() => {
        passNumber(number);
    }, [number]);
    useEffect(() => {
        passSorting(sorting);
    }, [sorting]);
    const handleNumberChange = (event) => {
        setNumber(event.target.value);
    };
    const handleSortingChange = (event) => {
        setSorting(event.target.value);
    };
    return (
        <div>
        <div className='recipe-selector'>
                <div>
                    <label>Sortiraj po </label>
                    <select value={sorting} onChange={handleSortingChange}>
                        <option value="latest">najnoviji</option>
                        <option value="best">najbolje ocjenjeni</option>
                        <option value="worst">najmanje ocjenjeni</option>
                    </select>

                </div>
                <div>
                    <label>Broj prikazanih recepata:  </label>
                    <select value={number} onChange={handleNumberChange}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>

                </div>
            </div>
        </div>
    );
}

export default RecipeSelector;