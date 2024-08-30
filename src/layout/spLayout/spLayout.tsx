import Header from "../../Components/sp/Header";
import Footer from "../../Components/sp/Footer";
import { Outlet } from "react-router-dom";


function SPLayout (){
    return(
        <>
        <Header/>
        <Outlet/>
        <Footer/>
        </>
    )
}

export default SPLayout;