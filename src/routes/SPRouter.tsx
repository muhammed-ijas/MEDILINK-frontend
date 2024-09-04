import { Suspense ,lazy } from "react"
import { Routes,Route } from "react-router-dom"
import LoadingSpinner from "../Components/common/LoadingSpinner"
import SPLayout from "../layout/spLayout/spLayout";

const SignupPage = lazy(() => import("../pages/SP/SPSignupPage"));
const OtpPage = lazy(()=> import("../pages/SP/SPOtp"))
const LoginPage = lazy(()=> import("../pages/SP/SPLogin"))
const HomePage = lazy(()=> import("../pages/SP/SPHome"))
const ProfilePage = lazy(()=> import("../pages/SP/SPProfile"))
const ServicesPage = lazy(()=> import("../pages/SP/SPServices"))
const AddDepartmentPage = lazy(()=> import("../pages/SP/SPAddDepartment"))
const AboutPage = lazy(()=> import("../pages/SP/SPAbout"))
const ContactPage = lazy(()=> import("../pages/SP/SPContact"))
const DetailedServicePage = lazy(()=> import("../pages/SP/DetailedServicesPage"))
const HomeNurseDetailsServices = lazy(()=> import("../pages/SP/DetailedHomeNurseService"))
const AmbulanceDetailsServices = lazy(()=> import("../pages/SP/DetailedAmbulanceServices"))




function SPRoutes() {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<SPLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="addDepartment" element={<AddDepartmentPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="viewDetaildServices" element={<DetailedServicePage />} />
            <Route path="viewHomeNurseServices" element={<HomeNurseDetailsServices />} />
            <Route path="viewAmbulanceServices" element={<AmbulanceDetailsServices />} />
          </Route>
          <Route path="signup" element={<SignupPage />} />
          <Route path="otp" element={<OtpPage />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Suspense>
    );
  }
  
  export default SPRoutes;
