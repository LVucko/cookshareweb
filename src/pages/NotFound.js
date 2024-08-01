import { Link } from "react-router-dom/cjs/react-router-dom.min";

const NotFound = () => {
  return (
    <div className="not-found">
      <h2>404</h2>
      <h2>Not found</h2>
      <p>Stranica kojoj ste probali pristupiti ne postoji</p>
      <Link to="/">Natrag na početnu...</Link>
    </div>
  );
};

export default NotFound;
