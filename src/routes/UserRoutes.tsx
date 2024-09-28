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

const HospitalClinicDetailsPage = lazy(()=> import("../pages/User/HospitalClinicDetailsPage"))
const DepartmentDetailesPage = lazy(()=> import("../pages/User/DepartmentDetailesPage"))
const DoctorDetailesPage = lazy(()=> import("../pages/User/DoctorDetailesPage"))

const AmbulanceDetailesPage = lazy(()=> import("../pages/User/AmbulanceDetailesPage"))
const HomeNurseDetailedPage = lazy(()=> import("../pages/User/HomeNurseDetailesPage"))

const UserBookingPage = lazy(()=> import("../pages/User/UserBookingPage"))
const UserBookingSuccessPage = lazy(()=> import("../Components/user/UserAppointmentSuccess") )
const UserBookingCancelPage = lazy(()=> import ("../Components/user/UserAppoinmentCancel"))
const UserAppointmentDetailsPage =  lazy(()=> import ("../pages/User/UserAppointmentList"))

const MessagesPage =  lazy(()=> import ("../pages/User/Messages"))

const BlockedByAdmin =  lazy(()=> import ("../pages/Blocked"))



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

          <Route path="hospitalClinicDetailedPage/:id" element={<HospitalClinicDetailsPage />} />
          <Route path="departmentDetailedPage/:id" element={<DepartmentDetailesPage />} />
          <Route path="doctorDetailedPage/:id" element={<DoctorDetailesPage />} />
          <Route path="ambulanceDetailedPage/:id" element={<AmbulanceDetailesPage />} />
          <Route path="homeNurseDetailedPage/:id" element={<HomeNurseDetailedPage />} />

          <Route path="userBookingPage" element={<UserBookingPage />} />

          <Route path="success" element={<UserBookingSuccessPage />} />
          <Route path="cancel" element={<UserBookingCancelPage />} />
          <Route path="bookings" element={< UserAppointmentDetailsPage/>} />
          <Route path="blocked" element={<BlockedByAdmin />} /> 
         

        </Route>

        <Route path="messages" element={<MessagesPage />} />

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