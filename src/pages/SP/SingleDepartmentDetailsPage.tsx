import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { getAllDoctorDetailsInsideADepartment } from "../../api/SP";
import LoadingSpinner from "../../Components/common/LoadingSpinner";
import { FaUserMd } from "react-icons/fa"; // Importing an icon (Doctor)
import SlotsDetailedModal from "../../Components/sp/SlotsDetailedModal";
import DeleteDoctorModal from "../../Components/sp/DeleteDoctorModal";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  doctorProfileImage: string;
}

const DepartmentDetails = () => {
  const location = useLocation();
  const { department } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State to hold the list of doctors
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  if (!department) {
    return <div>No department details found</div>;
  }

  const [isSlotsModalOpen, setIsSlotsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!department) return;

    const fetchDoctors = async () => {
      try {
        const fetchedDoctors = await getAllDoctorDetailsInsideADepartment(
          department._id
        );
        setDoctors(fetchedDoctors || []); // Ensure setDoctors receives an array
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [department]); // Dependency array includes department




  //slots modal
  const viewDoctorSlotsDoctorButton = (doctorId: string) => {
    setSelectedDoctorId(doctorId); // Set the selected doctor id
    setIsSlotsModalOpen(true); // Open the modal
  };

  const closeSlotsModal = () => {
    setIsSlotsModalOpen(false); // Close the modal
    setSelectedDoctorId(null); // Reset the selected doctor
  };


  //delete doctor modal open 
  
  const DeleteDoctorButton = (doctorId: string) => {
    setSelectedDoctorId(doctorId); // Set the selected doctor id
    setIsDeleteModalOpen(true); // Open the modal
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); // Close the modal
    setSelectedDoctorId(null); // Reset the selected doctor
  };

  const handleDoctorDelete = (doctorId: string) => {
    setDoctors((prevDoctors) => 
      prevDoctors.filter((doctor) => doctor._id !== doctorId) // Filter out the deleted doctor
    );
  };

  const viewDoctorButton = (doctorId: string) => {
    navigate("/sp/viewSingleDoctorDetaildpage", {
      state: { doctorId },
    });
  };

  const editDoctorButton = (doctorId: string) => {
    navigate("/sp/editSingleDoctorDetaildpage", {
      state: { doctorId, department },
    });
  };

  const AddDoctor = (departmentId: string) => {
    console.log(departmentId);
    navigate("/sp/addDoctorToDepartment", {
      state: { departmentId },
    });
  };

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-6">
      <h1 className="text-4xl font-bold text-center mb-4">{department.name}</h1>

      <div className="flex justify-center mb-6">
        <button
          className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-all"
          onClick={() => AddDoctor(department._id)}
        >
          Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
        {Array.isArray(doctors) && doctors.length > 0 ? (
          doctors.map((doctor: Doctor) => (
            <div
              key={doctor._id}
              className="relative bg-white rounded-lg shadow-lg p-4 flex flex-col items-center"
              style={{ height: "350px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                className="absolute top-0 left-0 w-full h-32 z-0"
                style={{ transform: "translateY(-15px)" }}
              >
                <path
                  fill="#000b76"
                  fillOpacity="1"
                  d="M0,320L48,304C96,288,192,256,288,218.7C384,181,480,139,576,144C672,149,768,203,864,218.7C960,235,1056,213,1152,224C1248,235,1344,277,1392,298.7L1440,320L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                ></path>
              </svg>

              {/* Doctor Image */}
              <div className="relative z-10 mb-6 bg-white rounded-full w-24 h-24 flex items-center justify-center border-4 border-gray-100">
                <img
                  src={doctor.doctorProfileImage}
                  alt={doctor.name}
                  className="object-cover w-20 h-20 rounded-full"
                />
              </div>

              {/* Doctor Details */}
              <h3 className="text-xl font-semibold text-center mb-2 truncate w-full">
                {doctor.name}
              </h3>
              <p className="text-gray-600 text-center mb-2 truncate w-full">
                {doctor.specialization}
              </p>
              <p className="text-gray-600 text-center">
                Available: {doctor.availableFrom} - {doctor.availableTo}
              </p>
              <p className="text-gray-600 text-center">
                Contact: {doctor.contact}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <button
                  className="bg-green-500 text-white py-1 px-3 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-green-600"
                  onClick={() => viewDoctorButton(doctor._id)}
                >
                  Profile
                </button>
                <button
                  className="bg-black text-white py-1 px-3 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-gray-900"
                  onClick={() => editDoctorButton(doctor._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-black text-white py-1 px-3 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-gray-900"
                  onClick={() => viewDoctorSlotsDoctorButton(doctor._id)}
                >
                  Slots 
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-red-600"
                  onClick={() => DeleteDoctorButton(doctor._id)}
                >
                  Delete
                </button>
              </div>

              {isSlotsModalOpen && selectedDoctorId && (
                <SlotsDetailedModal
                  doctorId={selectedDoctorId}
                  onClose={closeSlotsModal}
                />
              )}


              {isDeleteModalOpen && selectedDoctorId && (
                <DeleteDoctorModal
                  doctorId={selectedDoctorId}
                  onClose={closeDeleteModal}
                  onDelete={handleDoctorDelete} // Pass the delete handler

                />
              )}
            </div>
          ))
        ) : (
          <>
            <div className="flex flex-col items-center justify-center flex-grow"></div>

            <div className="flex flex-col items-center justify-center flex-grow">
              <FaUserMd className="text-6xl text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-500 text-center mb-2">
                No doctors found in this department.
              </p>
              <p className="text-md text-gray-600 text-center">
                Please encourage your providers to add doctors now!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetails;
