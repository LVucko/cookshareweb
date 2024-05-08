import { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
const Login = () => {
    const [userLogin, setUserLogin] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) =>{
        e.preventDefault();
        const user  = {userLogin, password};

        fetch('/api/users/login',{
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
        <h2>Prijava:</h2>
        <p>Ne posjedujete račun?</p>
        <Link to = "/register">Kliknite ovdje za registraciju</Link>
        <form onSubmit = {handleSubmit}>
            <label>Korisničko ime ili e-mail</label>
            <input
                type = "text"
                required
                value = {userLogin}
                onChange = {(e) => setUserLogin(e.target.value)}
            ></input>

            <label>Lozinka</label>
            <input
                type = "password"
                required
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
            ></input>
            <button>Prijava</button>
        </form>
    </div> );
}
 
export default Login;