import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";
import { Rootstate } from "../redux/store";

function UserProtect(){
    const {userInfo} = useSelector((state: Rootstate) => state.auth);

    return userInfo ? <Outlet/> : <Navigate to="/" replace/>;
}

export default UserProtect;