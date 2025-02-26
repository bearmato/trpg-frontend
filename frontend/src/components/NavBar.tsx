import { Link } from "react-router-dom";
import HomePageMenuButton from "./HomePageMenuButton";
import LoginButton from "./LoginButton";
import NavBarTitle from "./NavBarTitle";
import ThemeButton from "./ThemeButton";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 ">
      <div className="navbar-start">
        <HomePageMenuButton />
      </div>
      <div className="navbar-center">
        <Link to={"/"}>
          <NavBarTitle />
        </Link>
      </div>
      <div className="navbar-end">
        <ThemeButton />
        <LoginButton />
      </div>
    </div>
  );
};

export default NavBar;
