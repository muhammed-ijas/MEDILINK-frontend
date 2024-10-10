import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllServiceDetails } from "../../api/SP";
import Spinner from "../../Components/common/LoadingSpinner";
import placeholderImage from "../../../public/logo/HomePage/beat-heart-hospital.svg";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import EditDepartmentModal from "../../Components/sp/EditdepartmentModal";
// import ConfirmationModal from "../../Components/common/Confirmationmodal";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  doctorProfileImage: string;
}

interface Department {
  _id: string;
  name: string;
  description?: string;
  doctors: Doctor[];
}

const DetailedServicesPage = () => {
  const { spInfo } = useSelector((state: RootState) => state.sp);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);


  const navigate = useNavigate();

  const handleAddNewDepartment = () => {
    if (spInfo.isVerified === false) {
      message.error("You need to be verified to add a new department.");
    } else {
      navigate("/sp/addDepartment");
    }
  };
  
  const handleViewClick = () => {
    if (spInfo.isVerified === false) {
      message.error("You need to be verified to view this department.");
    } else if (selectedDepartment) {
      navigate("/sp/viewSingleDepartmentDetails", {
        state: { department: selectedDepartment },
      });
    }
  };

  const fetchDepartments = async () => {
    if (!spInfo?._id) {
      message.error("Service provider ID is missing.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getAllServiceDetails(spInfo._id);
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      message.error("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [spInfo._id]);

  // const handleEditClick = () => {
  //   if (spInfo.isVerified === false) {
  //     message.error("You need to be verified to edit a department.");
  //   } else {
  //     setEditModalVisible(true);
  //   }
  // };

  const handleModalClose = () => {
    setEditModalVisible(false);
    setSelectedDepartment(null); // Ensure the selectedDepartment is cleared
  };

  // const handleDeleteClick = async (departmentId: string) => {
  //   if (!spInfo.isVerified) {
  //     message.error("You need to be verified to delete a department.");
  //     return;
  //   }
  //   setDepartmentToDelete(departmentId);
  //   setConfirmModalVisible(true);
  // };

  // const handleConfirmDelete = async () => {
  //   if (!departmentToDelete) return;
  //   try {
  //     const response = await deleteDepartment(spInfo._id, departmentToDelete);
  //     if (response.status === 200) {
  //       toast.success("Successfully deleted");
  //       setTimeout(() => {
  //         // Update the departments state here hey
  //         setDepartments((prevDepartments) =>
  //           prevDepartments.filter(
  //             (department) => department._id !== departmentToDelete
  //           )
  //         );
  //         fetchDepartments();
  //         setSelectedDepartment(null);
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to delete the department.");
  //   } finally {
  //     setConfirmModalVisible(false);
  //     setDepartmentToDelete(null);
  //   }
  // };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="relative mb-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center mb-4">
            Your Departments
          </h1>
          <button
            onClick={handleAddNewDepartment}
            className="border rounded-md p-2 border-blue-900 text-blue-900 text-sm font-semibold hover:bg-blue-900 hover:text-white hover:shadow-lg transition-all transform hover:scale-105"
          >
            Add New Department
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <motion.div
            key={department._id}
            layoutId={department._id}
            className="relative bg-white rounded-lg shadow-md p-6 cursor-pointer flex flex-col items-center overflow-hidden"
            onClick={() => setSelectedDepartment(department)}
            whileHover={{ scale: 1.05 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="absolute top-0 left-0 w-full h-32 z-0"
              style={{ transform: "translateY(-10px)" }}
            >
              <path
                fill="#000b76"
                fillOpacity="1"
                d="M0,320L48,304C96,288,192,256,288,218.7C384,181,480,139,576,144C672,149,768,203,864,218.7C960,235,1056,213,1152,224C1248,235,1344,277,1392,298.7L1440,320L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              ></path>
            </svg>
            <div className="relative z-10 bg-white rounded-full w-20 h-20 flex items-center justify-center border-4 border-gray-100 mb-6">
              <img
                src={placeholderImage}
                alt={department.name}
                className="object-cover w-16 h-16"
              />
            </div>

            <h2 className="text-xl font-semibold mb-2 text-center z-10">
              {department.name}
            </h2>
            <p className="text-gray-600 text-center z-10">
              {department.doctors.length}{" "}
              {department.doctors.length === 1 ? "doctor" : "doctors"}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedDepartment && (
          <motion.div
            layoutId={selectedDepartment._id}
            className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={() => setSelectedDepartment(null)}
          >
            <motion.div
              className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
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
              <div className="relative z-10 mb-6 bg-white rounded-full w-20 h-20 flex items-center justify-center border-4 border-gray-100">
                <img
                  src={placeholderImage}
                  alt={selectedDepartment.name}
                  className="object-cover w-16 h-16"
                />
              </div>

              <h2 className="text-2xl font-bold mb-4 text-center">
                {selectedDepartment.name}
              </h2>
              <p className="text-gray-600 text-center z-10">
              {selectedDepartment.doctors.length}{" "}
              {selectedDepartment.doctors.length === 1 ? "doctor" : "doctors"}
            </p>

            

              {/* <h3 className="text-xl font-semibold mb-3 text-center">
                Doctors:
              </h3>
              <div className="w-full flex flex-col items-center">
                {selectedDepartment.doctors.length > 0 ? (
                  <ul className="space-y-6 w-full max-h-80 overflow-y-auto px-6">
                    {selectedDepartment.doctors.map((doctor) => (
                      <li
                        key={doctor._id}
                        className="p-6 bg-white rounded-3xl shadow-lg flex flex-col items-center border border-gray-200 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                      >
                        <div className="flex flex-col items-center mb-6">
                          <div className="relative w-24 h-24">
                            <img
                              src={
                                doctor?.doctorProfileImage ||
                                "/path/to/default-image.jpg"
                              }
                              alt={doctor.name}
                              className="w-full h-full rounded-full object-cover shadow-md"
                            />
                            <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 hover:bg-opacity-0 transition-all duration-300 ease-in-out flex items-center justify-center opacity-0 hover:opacity-100">
                              <p className="text-white text-xs">
                                Doctor's Image
                              </p>
                            </div>
                          </div>
                          <h3 className="text-xl text-gray-900 font-semibold mt-4">
                            {doctor.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {doctor.specialization}
                          </p>
                        </div>

                        <div className="w-full border-t border-gray-200 pt-4 text-center">
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">
                              Specialization:{" "}
                            </span>
                            {doctor.specialization}
                          </p>
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">
                              Available From:{" "}
                            </span>
                            {doctor.availableFrom}
                          </p>
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">
                              Available To:{" "}
                            </span>
                            {doctor.availableTo}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Contact: </span>
                            {doctor.contact}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">
                    No doctors available.
                  </p>
                )}
              </div> */}

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="bg-red-500 text-white font-semibold py-1 px-4 rounded-md hover:bg-red-600 transition-transform transform  mr-2"
                >
                  Close
                </button>
                {/* <button
                  className="bg-[#000b76] text-white font-semibold py-1 px-4 rounded-md hover:bg-[#1e266a] transition-transform transform"
                  onClick={handleEditClick}
                >
                  Edit
                </button> */}
                <button
                  className="bg-[#000b76] text-white font-semibold py-1 px-4 rounded-md hover:bg-[#1e266a] transition-transform transform"
                  onClick={handleViewClick}
                >
                  View
                </button>
                {/* <button
                  onClick={() => handleDeleteClick(selectedDepartment._id)}
                  className="bg-red-500 text-white font-semibold py-1 px-4 rounded-md hover:bg-red-600 transition-transform transform  mr-2"
                >
                  Delete
                </button> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedDepartment && (
        <EditDepartmentModal
          key={selectedDepartment._id} // Force re-render by adding a key
          open={editModalVisible}
          onClose={handleModalClose}
          departmentData={selectedDepartment}
          spId={spInfo._id}
          refreshDepartments={fetchDepartments}
        />
      )}
      {/* <ConfirmationModal
        isVisible={confirmModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModalVisible(false)}
      /> */}
    </div>
  );
};

export default DetailedServicesPage;
