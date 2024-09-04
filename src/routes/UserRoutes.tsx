import { Suspense ,lazy } from "react"
import { Routes,Route } from "react-router-dom"
import LoadingSpinner from "../Components/common/LoadingSpinner"
import UserLayout from "../layout/userLayout/UserLayout"

import UserProtected from "../protected/UserProtected"; // Import UserProtected



const SignupPage = lazy(()=> import("../pages/User/UserSignup"))
const LoginPage = lazy(()=> import("../pages/User/UserLogin"))
const OTPpage = lazy(()=> import("../pages/User/UserOTP"))
const HomePage = lazy(()=> import("../pages/User/UserHome"))
const ForgetOtp = lazy(()=> import("../Components/user/ForgetOtp"))
const ResetPassword = lazy(() => import("../Components/user/ResetPassword"));
const ForgetEmail = lazy(() => import("../Components/user/ForgetEmail"));
const ProfilePage = lazy(() => import("../pages/User/UserProfile"));
const ServicesPage = lazy(() => import("../pages/User/UserServices"));
const AboutPage = lazy(() => import("../pages/User/UserAbout"));
const ContactPage = lazy(() => import("../pages/User/UserContact"));
const AppointmentPage = lazy(() => import("../pages/User/UserAppointments"));



function UserRoutes (){
  return (
    <Suspense fallback={<LoadingSpinner/>}>
        <Routes >
        <Route element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />

          <Route element={<UserProtected />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="services" element={<ServicesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="appointment" element={<AppointmentPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="otp" element={<OTPpage />} />
        {/* <Route path="home" element={<HomePage />} /> */}
        <Route path="fOtp" element={<ForgetOtp />} />
        <Route path="resetPassword" element={<ResetPassword />} />
        <Route path="verifyEmail" element={<ForgetEmail />} />
        </Routes>
    </Suspense>
  )
}
export default UserRoutes;