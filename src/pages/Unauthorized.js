import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Unauthorized = () => {
  return (
    <div className="not-found">
      <h2>403</h2>
      <h2>Unauthorized</h2>
      <p>Nemate pravo pristupiti toj stranici</p>
      <br></br>
      <Link to="/">Natrag na početnu...</Link>
      <br></br>
      <Link to="/login">Kliknite ovdje za prijavu</Link>
      <br></br>
      <Link to="/register">Kliknite ovdje za registraciju</Link>
    </div>
  );
};

export default Unauthorized;
