import { Link } from "react-router-dom/cjs/react-router-dom.min";
const Logo = () => {
  return (
    <Link to="/">
      <h1>
        C<span style={{ color: "#4d4d4d" }}>ook</span>S
        <span style={{ color: "#4d4d4d" }}>hare</span>
      </h1>
    </Link>
  );
};

export default Logo;
