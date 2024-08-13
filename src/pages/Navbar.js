import { useState } from "react";
import Hamburger from "hamburger-react";
import NavbarLinks from "../components/NavbarLinks";
import Logo from "../components/Logo";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className="navbar">
        <Logo></Logo>
        <NavbarLinks
          hamburgerStatus={(e) => {
            setIsOpen(e);
          }}
        ></NavbarLinks>
      </nav>
      <div className="navbar-mobile">
        <div className="row">
          <Logo></Logo>
          <Hamburger toggled={isOpen} toggle={setIsOpen} />
        </div>
        {isOpen && (
          <NavbarLinks
            hamburgerStatus={(e) => {
              setIsOpen(e);
            }}
          ></NavbarLinks>
        )}
      </div>
    </>
  );
};

export default Navbar;
