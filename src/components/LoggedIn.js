import { Link } from "react-router-dom/cjs/react-router-dom";
const LoggedIn = () => {
  return (
    <div className="register">
      <br></br>
      <h2>Već ste prijavljeni</h2>
      <br></br>
      <Link to="/">Početna stranica</Link>
    </div>
  );
};

export default LoggedIn;
