// UserProtected.tsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

const UserProtected = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);

    return userInfo ? <Outlet /> : <Navigate to="/user/home" replace />;
};

export default UserProtected;
