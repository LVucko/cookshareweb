import { Link } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";

const Register = () => {
    const [file, setFile] = useState('');
    const [user, setUser] = useState({
        username: '', 
        email: '',
        realName: '', 
        phone: '',
        password: '',
        repeatPassword: '',
        pictureId: '4'
    })
    const [error, setError] = useState({
        username: '', 
        email: '',
        realName: '', 
        phone: '',
        password: '',
        repeatPassword: '',
        pictureId: ''
        })
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
            setUser({...user, pictureId: data});
            console.log('Server response:', data);
          })
          .catch(error => {
            console.error('Error uploading file:', error);
          });
    }
    const onUsernameChange = e => {
        setUser({...user, username: e});
        if(e === null || e.length === 0){
            setError({...error, username: "Molimo unesite korisničko ime"});
        }
        else if(e.length < 6){
            setError({...error, username: "Korisničko ime mora biti barem 6 znakova"});
        }
        else if(e.match(/^[A-Za-z]\w{5,29}$/)){
            setError({...error, username: null});
        }
        else{
            setError({...error, username: "Korisničko ime mora počinjati slovom, a može sadržavati brojeve i znak _"});
        }
        
    }
    const onEmailChange = e => {
        setUser({...user, email: e});
        if(e.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)){
            setError({...error, email: null});
        } 
        else{
            setError({...error, email: "Molimo unesite ispravan e-mail"});
        }
    }
    const onPasswordChange = e => {
        setUser({...user, password: e});
        if(e.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/)){
            setError({...error, password: null});
        }
        else{
            setError({...error, password: "Lozinka mora sadržavati 8-20 znakova, broj, veliko i malo slovo, i poseban znak"});
        }
        
    }
    const onRepeatPasswordChange = e => {
        setUser({...user, repeatPassword: e});
        if(e === user.password){
            setError({...error, repeatPassword: null});
        }
        else{
            setError({...error, repeatPassword: "Lozinke se ne podudaraju"});
        }
    }
    
    const handleSubmit = (e) =>{
        e.preventDefault();
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
        <h4>Već posjedujete račun?</h4>
        <Link to = "/login">Kliknite ovdje za prijavu</Link>
        <p><br></br></p>
        <form onSubmit = {handleSubmit}>
            <label>Korisničko ime: <span style={{color: "red"}}>*</span></label>
            <input
                type = "text"
                required
                value = {user.username}
                onChange = {(e) => onUsernameChange(e.target.value)}
                onBlur = {(e) => onUsernameChange(e.target.value)}
            ></input>
            {error.username && <p>{error.username}</p>}
            <label>Adresa e-pošte: <span style={{color: "red"}}>*</span></label>
            <input
                type = "email"
                required
                value = {user.email}
                onChange = {(e) => onEmailChange(e.target.value)}
                onBlur={(e) => onEmailChange(e.target.value)}
            ></input>
            {error.email && <p>{error.email}</p>}
            <label>Ime i Prezime: </label>
            <input
                type = "name"
                value = {user.realName}
                onChange = {(e) => setUser({...user, realName: e.target.value})}
            ></input>
            <label>Broj telefona: </label>
            <input
                type = "tel"
                value = {user.phone}
                onChange = {(e) => setUser({...user, phone: e.target.value})}
            ></input>
            <label>Lozinka: <span style={{color: "red"}}>*</span></label>
            <input
                type = "password"
                required
                value = {user.password}
                onChange = {(e) => onPasswordChange(e.target.value)}
                onBlur  = {(e) => onPasswordChange(e.target.value)}
            ></input>
            {error.password && <p>{error.password}</p>}
            <label>Ponovi lozinku: <span style={{color: "red"}}>*</span></label>
            <input
                type = "password"
                required
                value = {user.repeatPassword}
                onChange = {(e) => onRepeatPasswordChange(e.target.value)}
                onBlur = {(e) => onRepeatPasswordChange(e.target.value)}
            ></input>
            {error.repeatPassword && <p>{error.repeatPassword}</p> }
            <div className="Image">
                    <label>Slika profila:</label>
                    <input type="file"
                    onChange={handleChange}
                    accept="image/*" 
                    />
                    {file && <img src={file} alt="Uploaded"/>}
            </div>
            <label>Polja označena sa <span style={{color: "red"}}>*</span> su obavezna</label>
            <p><br></br></p>
            {((error.username || error.email || error.password || error.repeatPassword) || (!user.username || !user.email || !user.password || !user.repeatPassword)) 
            && <button id="disabledButton">Registiraj se</button>}
            {(!error.username && !error.email && !error.password && !error.repeatPassword) && user.username && user.email && user.password && user.repeatPassword 
            && <button>Registiraj se</button>}
        </form>
    </div> );
}
 
export default Register;