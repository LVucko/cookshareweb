import { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
const Login = () => {
    const [isProcesing, setIsProcessing] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState({
        userLogin: '',
        password: ''
    })
    const handleSubmit = (e) =>{
        e.preventDefault();
        setIsProcessing(true);
        setLoginError('');
    fetch('/api/users/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
      })
        .then(response => {
            if (response.ok) {
            return response.json();
            } else {
                if(response.status === 404){
                    setIsProcessing(false);
                    setLoginError("Pogrešno korisničko ime ili lozinka!");
                    throw new Error("User not found");
                }
                
            }
            }
        ).then(data => {
            var token = data.token;
            var date = new Date();
            var expiresIn = data.expiresIn;
            date.setTime(date.getTime() + expiresIn);
            var expirationDate = date.toUTCString();
            document.cookie = "token=" + token  + "; Expires=" + expirationDate +"; path=/";
            setIsProcessing(false);
            //redirect na nesta
            
          })
          .catch(error => {
            console.error('There was a problem with the Fetch operation:', error);
          });
    }
    return ( 
    <div className = "register">
        <h2>Prijava:</h2>
        <h4>Ne posjedujete račun?</h4>
        <Link to = "/register">Kliknite ovdje za registraciju</Link>
        <p><br></br></p>
        <form onSubmit = {handleSubmit}>
            <label>Korisničko ime ili e-mail: </label>
            <input
                type = "text"
                required
                value = {user.userLogin}
                onChange = {(e) => setUser({...user, userLogin: e.target.value})}
            ></input>
            <label>Lozinka: </label>
            <input
                type = "password"
                required
                value = {user.password}
                onChange = {(e) => setUser({...user, password: e.target.value})}
            ></input>
            {loginError && <p>{loginError}</p>}
            <p><br></br></p>
            {user.userLogin && user.password && !isProcesing &&<button>Prijava</button>}
            {(!user.userLogin || !user.password || isProcesing) &&<button id="disabledButton">Prijava</button>}
            
        </form>
    </div> 
    );
}
 
export default Login;