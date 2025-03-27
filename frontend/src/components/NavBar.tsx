import { Link } from "react-router-dom";
import HomePageMenu from "./HomePageMenu";
import NavBarTitle from "./NavBarTitle";
import DiceToggleButton from "./DiceToggleButton";
import { useDiceWidget } from "./DiceWidgetProvider";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const NavBar = () => {
  const { toggleDiceWidget, isDiceWidgetVisible } = useDiceWidget();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-[#A31D1D] flex-col lg:flex-row">
      <div className="w-full lg:w-[95%] max-w-[1920px] mx-auto flex flex-wrap lg:flex-nowrap items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          {/* 移动端菜单按钮 */}
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
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
          </button>

          {/* Logo */}
          <NavBarTitle />
        </div>

        {/* 桌面端菜单 */}
        <div className="hidden lg:flex flex-1 justify-center">
          <HomePageMenu />
        </div>

        {/* 右侧功能区 - 始终显示在最右侧 */}
        <div className="flex items-center gap-2">
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
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
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

      {/* 移动端展开菜单 */}
      <div
        className={`w-full lg:hidden ${
          isMobileMenuOpen ? "flex" : "hidden"
        } flex-col items-center pb-4`}
      >
        <HomePageMenu />
      </div>
    </div>
  );
};

export default NavBar;
