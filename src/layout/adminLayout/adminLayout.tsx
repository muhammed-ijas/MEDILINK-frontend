import Header from "../../Components/admin/Header";
import SideBar from "../../Components/admin/Sidebar";
import { Outlet } from "react-router-dom";

function adminLayout() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <div className="flex bg-black">
        <div className="w-[16%]">
        <SideBar />
        </div>
       
        <div className="w-[84%] mt-[72px] bg-black"> 
        <Outlet />
        </div>
        
      </div>
    </div>
  );
}

export default adminLayout;
