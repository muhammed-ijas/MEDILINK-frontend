import  { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "../Components/common/LoadingSpinner"


const AdminLayout = lazy(() => import("../layout/adminLayout/adminLayout.tsx"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard.tsx"));
const AdminProtected = lazy(() => import("../protected/AdminProtected.tsx"));
const UsersPage = lazy(() => import("../pages/Admin/Users.tsx"))
const RequestsPage = lazy(() => import("../pages/Admin/Requests.tsx"))
const ServicesPage = lazy(() => import("../pages/Admin/Services.tsx"))


function AdminRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<AdminProtected />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/services" element={<ServicesPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AdminRoutes;
