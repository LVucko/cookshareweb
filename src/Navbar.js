import {Link}from 'react-router-dom';
import { useContext } from "react";
import UserContext from "./UserContext"
const Navbar = () => {
    const {userInfo, logout} = useContext(UserContext);
    return (
        <nav className="navbar">
            <h1>C<span style={{color: '#4d4d4d'}}>ook</span>S<span style={{color: '#4d4d4d'}}>hare</span></h1>
            <div className = "links">
                <Link to = "/">Početna</Link>
                {userInfo && <Link to = "/create" className = "create">Predaj recept</Link>}
                {!userInfo &&<Link to = "/register">Registracija</Link>}
                {!userInfo && <Link to = "/login">Prijava</Link>}
                {userInfo && <Link to = "" onClick={logout}>Odjava</Link>}
            </div>
        </nav>
      );
}
 
export default Navbar;