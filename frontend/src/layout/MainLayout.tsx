import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <>
      <div className="relative dark:bg-[#050b0a] text-gray-700 dark:text-slate-50 overflow-hidden min-h-screen flex flex-col w-full max-w-[1600px]">
        <Navbar />
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default MainLayout;