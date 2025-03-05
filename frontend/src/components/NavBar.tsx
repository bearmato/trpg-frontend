import { Link } from "react-router-dom";
import HomePageMenu from "./HomePageMenu";
import LoginButton from "./LoginButton";
import NavBarTitle from "./NavBarTitle";
import ThemeButton from "./ThemeButton";
import DiceToggleButton from "./DiceToggleButton";
import { useDiceWidget } from "./DiceWidgetProvider";

const NavBar = () => {
  const { toggleDiceWidget, isDiceWidgetVisible } = useDiceWidget();
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
        <DiceToggleButton
          toggleDiceWidget={toggleDiceWidget}
          isDiceWidgetVisible={isDiceWidgetVisible}
        />
        <ThemeButton />
        <LoginButton />
      </div>
    </div>
  );
};

export default NavBar;
