import Header from "../../Components/user/Header";
import Footer from "../../Components/user/Footer";
import { Outlet } from "react-router-dom";


function UserLayout (){
    return(
        <>
        <Header/>
        <Outlet/>
        <Footer/>
        </>
    )
}

export default UserLayout;