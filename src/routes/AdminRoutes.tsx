import  { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "../Components/common/AdminLoadingSpinner.tsx"


const AdminLayout = lazy(() => import("../layout/adminLayout/adminLayout.tsx"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard.tsx"));
const AdminProtected = lazy(() => import("../protected/AdminProtected.tsx"));
const RequestsPage = lazy(() => import("../pages/Admin/Requests.tsx"))
const ServicesPage = lazy(() => import("../pages/Admin/Services.tsx"))
const UsersPage = lazy(() => import("../pages/Admin/AdminUsers.tsx"))


function AdminRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<AdminProtected />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AdminRoutes;
