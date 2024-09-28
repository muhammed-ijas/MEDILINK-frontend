import frontpageImage from "../../../public/logo/HomePage/servicesImage-removebg-preview.png";
import { motion } from "framer-motion";
import hospitalImage from "../../../public/logo/HomePage/hospitalImage.png";
import ambulanceImage from "../../../public/logo/HomePage/ambulanceImage2.png";
import homenurseImage from "../../../public/logo/HomePage/homenurseImage.png";
import clinickImage from "../../../public/logo/HomePage/clinickImage.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {  toast } from "react-hot-toast";
// import toast from "react-toastify"

const SPServices = () => {

  const navigate = useNavigate();

  const { spInfo } = useSelector((state: RootState) => state.sp);
 
  const handleViewDetaildServices = () => {
    console.log("clicked",spInfo)
    if (spInfo.isVerified === false) {
      toast.error("You need to be verified to go to this page.");
    } else if (spInfo.serviceType === "hospital" || spInfo.serviceType === "clinic") {
      navigate("/sp/viewDetaildServices");
    } else if (spInfo.serviceType === "ambulance") {
      navigate("/sp/viewAmbulanceServices");
    } else if (spInfo.serviceType === "homeNurse") {
      navigate("/sp/viewHomeNurseServices");
    }
  };
  

  return (
    <div className="">
      {/* <Toaster position="top-center" /> */}
      <section className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-start pt-20">
        {/* Doctor Image */}
        <motion.img
          className="w-[25rem] object-cover transition-transform transform hover:scale-105 ml-10"
          src={frontpageImage}
          alt="Doctor with board"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center text-center mt-10 px-4 md:px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <h1 className="text-4xl font-bold text-blue-950 mb-4">
            Your Services
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage your healthcare services efficiently. <br /> Update, add, and
            organize your services to ensure they are <br />
            always up-to-date and accessible to your patients.
          </p>
              <button
                className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition mt-5"
                onClick={handleViewDetaildServices}
              >
                View Service Details
              </button>
        </motion.div>
      </section>

      {/* Service Cards Section */}
      <section className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hospital Card */}
          <div className="group relative service-card p-6 rounded-lg shadow-md flex flex-col hover:shadow-2xl items-center transform transition-transform hover:scale-105 bg-white text-blue-950">
            <img
              src={hospitalImage}
              alt="Hospital Services"
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Hospital Services</h2>
            <p className="text-center mb-4">
              Our hospital services encompass a wide range of medical and
              surgical care, designed to address both emergency and
              non-emergency needs. We provide advanced diagnostic and treatment
              options for various medical conditions,
            </p>
          </div>

          {/* Ambulance Card */}
          <div className="group relative service-card p-6 rounded-lg shadow-md flex flex-col hover:shadow-2xl items-center transform transition-transform hover:scale-105 bg-white text-blue-950">
            <img
              src={ambulanceImage}
              alt="Ambulance Services"
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Ambulance Services</h2>
            <p className="text-center mb-4">
              Our ambulance services offer prompt and reliable medical
              transportation for patients in need of emergency or non-emergency
              care.{" "}
            </p>
          </div>

          {/* Home Nurse Card */}
          <div className="group relative service-card p-6 rounded-lg shadow-md flex flex-col hover:shadow-2xl items-center transform transition-transform hover:scale-105 bg-white text-blue-950">
            <img
              src={homenurseImage}
              alt="Home Nurse Services"
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Home Nurse Services</h2>
            <p className="text-center mb-4">
              Our home nurse services are designed to deliver personalized
              medical care within the comfort of the patient’s home.{" "}
            </p>
          </div>

          {/* Clinic Card */}
          <div className="group relative service-card p-6 rounded-lg shadow-md flex flex-col hover:shadow-2xl items-center transform transition-transform hover:scale-105 bg-white text-blue-950">
            <img
              src={clinickImage}
              alt="Clinic Services"
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Clinic Services</h2>
            <p className="text-center mb-4">
              Our clinic services offer comprehensive outpatient care to address
              a variety of health concerns{" "}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SPServices;
