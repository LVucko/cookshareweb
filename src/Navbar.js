import {Link}from 'react-router-dom';
const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>The Cook Book</h1>
            <div className = "links">
                <Link to = "/">Početna</Link>
                <Link to = "/create" className = "create">Predaj recept</Link>
                <Link to = "/register">Registracija</Link>
                <Link to = "/login">Prijava</Link>
            </div>
        </nav>
      );
}
 
export default Navbar;