import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import useFetch from './useFetch';
import axios from "axios"
import Cookies from 'js-cookie';

const  Create = () => {
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [isProcesing, setIsPending] = useState(false);
    const [categories, setSelectedIds] = useState([]);
    const [pictureIds, setPictureIds] = useState([]);
    const [file, setFile] = useState();

    const history = useHistory();
    const {data: allCategories, isPending, error} = useFetch('/api/categories');

    const handleCheckboxChange = (event) => {
    const checkedId = event.target.value;
    if(event.target.checked){
        setSelectedIds([...categories,checkedId])
    }else{
        setSelectedIds(categories.filter(id=>id !== checkedId))
    }
    
    }

    function handlePictureChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        fetch('api/upload', {
            method: 'POST',
            body: formData
          })
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('File upload failed');
            }
          })
          .then(data => {
            setPictureIds([data]);
            console.log('Server response:', data);
          })
          .catch(error => {
            console.error('Error uploading file:', error);
          });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        var token = Cookies.get('JWT');
        if(token===null){
            
        }
        axios.post('/api/recipes', {title: title, shortDescription: shortDescription, categories: categories, pictureIds: pictureIds}, {headers: { Authorization: "Bearer " + token }})
        .then((response) => {
            history.push("/recipes/"+ response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className = "create">
            <h2>Dodaj novi recept</h2>
            <form onSubmit = {handleSubmit}>
                <label>Naziv recepta:</label>
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
                <label>Kategorije (barem jedna):</label>
                {error && <div>{error}</div>}
                {isPending && <div>Učitavam...</div>}
                {allCategories && allCategories.map((category) =>(
                    <div className= "categories" key = {category.name}>
                        <label htmlFor={category.name}>
                            <input type="checkbox" id={category.id} name={category.name} value={category.id} onChange={(event) => { handleCheckboxChange(event) }}></input>
                            {category.name}
                        </label>
                    </div>
                ))}
                <div className="Image">
                    <h2>Add Image:</h2>
                    <input type="file" onChange={handlePictureChange} />
                    <img src={file} alt="Uploaded"/>
                </div>
                {!isProcesing && <button>Dodaj recept</button>}
                {isProcesing && <button>Dodajem recept....</button>}
            </form>
        </div>
    );
}
 
export default Create;