import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        <Outlet /> {/* 这里渲染当前页面内容 */}
      </main>
    </div>
  );
};

export default Layout;
