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
    <div className="bg-[#A31D1D]">
      <div className="navbar w-full lg:w-[95%] max-w-[1920px] mx-auto px-4 py-2">
        {/* Logo区域和移动端菜单 */}
        <div className="navbar-start flex items-center gap-4">
          {/* 移动端菜单按钮 */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current text-[#F8F2DE]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-[#A31D1D] rounded-box w-52"
            >
              <HomePageMenu />
            </ul>
          </div>
          <NavBarTitle />
        </div>

        {/* 中间菜单区域 - 桌面端 */}
        <div className="navbar-center hidden lg:flex">
          <HomePageMenu />
        </div>

        {/* 右侧功能区 */}
        <div className="navbar-end flex items-center gap-2">
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
                <div className="w-8 lg:w-10 rounded-full overflow-hidden">
                  <img
                    alt="Avatar"
                    src={user?.avatar || "/images/avatars/default-avatar.png"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/avatars/default-avatar.png";
                    }}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#F8F2DE] rounded-box w-52 text-[#A31D1D]"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Personal Profile
                    <span className="badge">{user?.username}</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Log Out</a>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-ghost text-[#F8F2DE]">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
