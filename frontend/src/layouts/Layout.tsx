import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
import DiceWidgetProvider from "../components/DiceWidgetProvider";

const Layout = () => {
  return (
    <DiceWidgetProvider>
      <div>
        <Navbar />
        <main className="grow">
          <Outlet /> {/* 这里渲染当前页面内容 */}
        </main>
      </div>
    </DiceWidgetProvider>
  );
};

export default Layout;
