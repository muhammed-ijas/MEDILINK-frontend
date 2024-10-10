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
const AllbookingsShownPage = lazy(()=> import("../pages/SP/AllbookingsShownPage"));
const SingleDepartmentDetailsPage = lazy(()=> import("../pages/SP/SingleDepartmentDetailsPage"));
const ViewSingleDoctorDetaildpage = lazy(()=> import("../pages/SP/ViewSingleDoctorDetaildpage"));

const EditDoctorPage = lazy(()=> import("../pages/SP/EditDoctorPage"));

const AddDoctorToDepartmentPage = lazy(()=> import("../pages/SP/SPAddDoctor"));

const RecentAppointmentListPage = lazy(()=> import("../pages/SP/RecentAppointmentList"));

const MessagesPage = lazy(()=> import("../pages/SP/Messages"))



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

            {/* for hospitals and clinicks */}
            <Route path="viewDetaildServices" element={<DetailedServicePage />} />
            {/* for home nurses */}
            <Route path="viewHomeNurseServices" element={<HomeNurseDetailsServices />} />
            {/* for ambulances */}
            <Route path="viewAmbulanceServices" element={<AmbulanceDetailsServices />} />

            {/* after clicking a specific department */}
            <Route path="viewSingleDepartmentDetails" element={<SingleDepartmentDetailsPage/>} />

            {/* after clicking a specific doctor from department */}
            <Route path="viewSingleDoctorDetaildpage" element={<ViewSingleDoctorDetaildpage/>} />

            {/* to show users recent appointments */}
            <Route path="viewRecentAppointmentOfUser" element={<RecentAppointmentListPage/>} />

            <Route path="addDoctorToDepartment" element={<AddDoctorToDepartmentPage/>} />

            <Route path="editSingleDoctorDetaildpage" element={<EditDoctorPage/>} />

            {/* show entire appointments which got that provider */}
            <Route path="bookings" element={<AllbookingsShownPage />} />
          </Route>
          <Route path="signup" element={<SignupPage />} />
          <Route path="otp" element={<OtpPage />} />
          <Route path="login" element={<LoginPage />} />

          <Route path="messages" element={<MessagesPage />} />

        </Routes>
      </Suspense>
    );
  }
  
  export default SPRoutes;
