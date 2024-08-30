import { Route, Routes } from "react-router-dom";
import UserRoutes from './UserRoutes';
import MainPage from "../pages/MainPage";
import SPRoutes from "./SPRouter";
import AdminRoutes from "./AdminRoutes"

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/user/*" element={<UserRoutes />} />
            <Route path="/sp/*" element={<SPRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
    );
}

export default AppRouter;
