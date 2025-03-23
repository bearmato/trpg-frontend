import { Link } from "react-router-dom";
import HomePageMenu from "./HomePageMenu";
import NavBarTitle from "./NavBarTitle";
import DiceToggleButton from "./DiceToggleButton";
import { useDiceWidget } from "./DiceWidgetProvider";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
  const { toggleDiceWidget, isDiceWidgetVisible } = useDiceWidget();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-[#A31D1D]">
      <div className="navbar-start">
        <NavBarTitle />
      </div>
      <div className="navbar-center">
        <HomePageMenu />
      </div>
      <div className="navbar-end">
        <DiceToggleButton
          toggleDiceWidget={toggleDiceWidget}
          isDiceWidgetVisible={isDiceWidgetVisible}
        />

        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="用户头像" src="https://via.placeholder.com/80" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  个人资料
                  <span className="badge">{user?.username}</span>
                </Link>
              </li>
              <li>
                <a>设置</a>
              </li>
              <li>
                <a onClick={handleLogout}>登出</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost text-[#F8F2DE]">
              登录
            </Link>
            <Link to="/register" className="btn btn-primary text-[#F8F2DE]">
              注册
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
