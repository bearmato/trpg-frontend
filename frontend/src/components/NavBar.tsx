import { Link } from "react-router-dom";
import HomePageMenu from "./HomePageMenu";
import NavBarTitle from "./NavBarTitle";
import DiceToggleButton from "./DiceToggleButton";
import { useDiceWidget } from "./DiceWidgetProvider";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

const NavBar = () => {
  const { toggleDiceWidget, isDiceWidgetVisible } = useDiceWidget();
  const { user, isAuthenticated, logout } = useAuth();
  const [avatarKey, setAvatarKey] = useState(Date.now());

  // 当用户信息变化时强制刷新头像
  useEffect(() => {
    if (user) {
      console.log("NavBar: 用户信息变化，准备刷新头像");

      // 检查localStorage中的用户信息是否与当前state一致
      try {
        const storedUserStr = localStorage.getItem("user");
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          console.log("NavBar: localStorage中的用户头像:", storedUser.avatar);
          console.log("NavBar: 当前状态中的用户头像:", user.avatar);

          // 如果localStorage中有头像但状态中没有，更新状态
          if (storedUser.avatar && (!user.avatar || user.avatar === "")) {
            console.log("NavBar: 从localStorage更新头像");
            // 这里不直接修改user，因为user是只读的，应该通过context提供的方法修改
          }
        }
      } catch (error) {
        console.error("NavBar: 检查localStorage时出错:", error);
      }

      // 刷新头像
      setAvatarKey(Date.now());
    }
  }, [user]);

  // 获取头像URL并添加时间戳防止缓存
  const getAvatarUrl = () => {
    // 如果没有用户头像，使用默认头像
    if (!user?.avatar || user.avatar === "") {
      return "/images/avatars/default-avatar.png";
    }

    // 检查是否是Cloudinary URL
    if (user.avatar.includes("cloudinary.com")) {
      // 对于Cloudinary URL，直接使用原始URL
      return user.avatar;
    }

    // 非Cloudinary URL添加时间戳参数防止缓存
    const timestamp = Date.now();
    const separator = user.avatar.includes("?") ? "&" : "?";
    return `${user.avatar}${separator}t=${timestamp}`;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-[#A31D1D]">
      <div className="navbar w-full lg:w-[98%] max-w-[1920px] mx-auto px-2 py-2">
        {/* Logo区域和移动端菜单 */}
        <div className="navbar-start flex items-center gap-2">
          {/* 移动端菜单按钮 */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current text-[#F8F2DE]"
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
        <div className="navbar-end flex items-center gap-1">
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
                <div className="w-7 lg:w-9 rounded-full overflow-hidden">
                  <img
                    alt="Avatar"
                    key={avatarKey} // 使用key强制重新渲染
                    src={getAvatarUrl()}
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
                    个人资料
                    <span className="badge">{user?.username}</span>
                  </Link>
                </li>

                <li>
                  <a onClick={handleLogout}>退出登录</a>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-ghost text-[#F8F2DE]">
              登录
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
