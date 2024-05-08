import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import useFetch from './useFetch';

const  Create = () => {
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [isProcesing, setIsPending] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [file, setFile] = useState();

    const handleCheckboxChange = (event) => {
    const checkedId = event.target.value;
    if(event.target.checked){
        setSelectedIds([selectedIds,checkedId])
    }else{
        setSelectedIds(selectedIds.filter(id=>id !== checkedId))
    }
    }
    function handlePictureChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const history = useHistory();
    const userId = 1; //dohvatiti iz cookie-a
    const {data: categories, isPending, error} = useFetch('/api/categories');
    const pathToPictures = 1;
    const handleSubmit = (e) => {
        e.preventDefault();
        const recipe = {userId, title, shortDescription, longDescription, categories, pathToPictures};
        setIsPending(true);
        console.log(recipe);
        fetch('/api/recipes', 
        {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(recipe)
        }).then(()=> {
            console.log('Novi recipe dodan');
            console.log({recipe});
            setIsPending(false);
                        history.push('/');
        }
    )
        
    }
    return (
        <div className = "create">
            <h2>Dodaj novi recipe</h2>
            <form onSubmit = {handleSubmit}>
                <label>Naziv recipea:</label>
                <input 
                    type = "text" 
                    required 
                    value = {title} 
                    onChange = {(e) => setTitle(e.target.value)}
                ></input>
                <label>Kratki opis:</label>
                <input 
                    type = "text" 
                    required 
                    value = {shortDescription} 
                    onChange = {(e) => setShortDescription(e.target.value)}
                ></input>
                <label>Postupak</label>
                <textarea 
                    required 
                    value = {longDescription} 
                    onChange = {(e) => setLongDescription(e.target.value)}

                ></textarea>
                {error && <div>{error}</div>}
                {isPending && <div>Učitavam...</div>}
                {categories && categories.map((category) =>(
                    <div className= "categories" key = {category.categoryName}>
                        <input type="checkbox" id={category.categoryName} name={category.categoryName} value={category.categoryName} onChange={(event) => { handleCheckboxChange(event) }}></input>
                        <label htmlFor={category.categoryName}>{category.categoryName}</label>
                    </div>
                ))}
                <div className="Image">
                    <h2>Add Image:</h2>
                    <input type="file" onChange={handlePictureChange} />
                    <img src={file} alt="Uploaded"/>
                </div>
                {!isProcesing && <button>Dodaj recipe</button>}
                {isProcesing && <button>Dodajem recipe....</button>}
            </form>
        </div>
    );
}
 
export default Create;