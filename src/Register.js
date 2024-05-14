import { Link } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [realName, setRealName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [pathToPicture, setPathToPicture] = useState('/asdasdada');
    const [file, setFile] = useState('');
    function handleChange(e) {
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
            setPathToPicture(data);
            console.log('Server response:', data);
          })
          .catch(error => {
            console.error('Error uploading file:', error);
          });
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        
        const user  = {username, email, password, realName, phone, pathToPicture};

        fetch('/api/users/register',{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        }).then(()=> {
            console.log('new blog added');
            console.log({user});
        }
    )
    }

    return ( 
    <div className = "register">
        <h2>Kreiranje novog korisničkog profila:</h2>
        <p>Već posjedujete račun?</p>
        <Link to = "/login">Kliknite ovdje za prijavu</Link>
        <form onSubmit = {handleSubmit}>
            <label>Korisničko ime</label>
            <input
                type = "text"
                required
                value = {username}
                onChange = {(e) => setUsername(e.target.value)}
            ></input>
            <label>e-mail</label>
            <input
                type = "email"
                required
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
            ></input>
            <label>Ime i Prezime (opcionalno)</label>
            <input
                type = "name"
                value = {realName}
                onChange = {(e) => setRealName(e.target.value)}
            ></input>
            <label>Broj telefona(opcionalno)</label>
            <input
                type = "tel"
                value = {phone}
                onChange = {(e) => setPhone(e.target.value)}
            ></input>
            <label>Lozinka: </label>
            <input
                type = "password"
                required
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
            ></input>
            <label>Ponovi lozinku: </label>
            <input
                type = "password"
                required
                value = {repeatPassword}
                onChange = {(e) => setRepeatPassword(e.target.value)}
            ></input>
            <div className="Image">
                    <h2>Add Image:</h2>
                    <input type="file" onChange={handleChange} />
                    <img src={file} alt="Uploaded"/>
            </div>
            <button>Register</button>
        </form>
    </div> );
}
 
export default Register;