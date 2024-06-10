import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { useContext } from "react";
import UserContext from "./UserContext"
import { decodeToken, useJwt } from "react-jwt";
const Login = () => {
    const history = useHistory();
    const [isProcesing, setIsProcessing] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [user, setUser] = useState({
        userLogin: '',
        password: ''
    })
    const{login} = useContext(UserContext);
    const handleLogin = (e) =>{
        e.preventDefault();
        setIsProcessing(true);
        setLoginError('');
        axios.post('/api/users/login', user)
        .then((response) => {
            const token  = response.data.token;
            const expiresIn = response.data.expiresIn;
            const date = new Date();
            date.setTime(date.getTime() + expiresIn);
            Cookies.set('JWT', token, {expires : date})
            login(decodeToken(token).UserId);
            setIsProcessing(false);
            history.push('/');
        }).catch((error) => {
            if(error.response.status === 404){
                setLoginError("Ne postoji korisnik s tim imenom");
            }
            if(error.response.status === 401){
                setLoginError("Pogrešna zaporka");
            }
            setIsProcessing(false);
            console.log(error);
        });

    }
    return ( 
    <div className = "register">
        <h2>Prijava:</h2>
        <h4>Ne posjedujete račun?</h4>
        <Link to = "/register">Kliknite ovdje za registraciju</Link>
        <p><br></br></p>
        <form onSubmit = {handleLogin}>
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