import { Link } from "react-router-dom";
import HomePageMenu from "./HomePageMenu";
import LoginButton from "./LoginButton";
import NavBarTitle from "./NavBarTitle";
import ThemeButton from "./ThemeButton";

const NavBar = () => {
  return (
    <div className="navbar bg-[#A31D1D] ">
      <div className="navbar-start">
        <Link to={"/"}>
          <NavBarTitle />
        </Link>
      </div>
      <div className="navbar-center">
        <HomePageMenu />
      </div>
      <div className="navbar-end">
        <ThemeButton />
        <LoginButton />
      </div>
    </div>
  );
};

export default NavBar;
