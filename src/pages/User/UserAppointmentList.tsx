import { useState, useEffect } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getFullAppointmentList } from "../../api/user";
import Modal from "../../Components/user/SingleAppointmentDetails"; // Import the Modal component
import PrescriptionModal from "../../Components/sp/RecentAppointmentsPrescriptionModal"; 


interface Appointment {
  _id: string;
  serviceProvider: {
    name: string;
    profileImage: string;
  };
  department: {
    name: string;
  };
  doctor: {
    name: string;
  };
  patientName: string;
  patientAge: number;
  patientEmail: string;
  patientPhone: string;
  bookingDate: string;
  timeSlot: string;
  amount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
  qrCode: string;
  prescription?: Medication[];
}
interface Medication {
  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions: string;
  refills?: number;
}

const UserAppointmentList = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [appointmentsPerPage] = useState(5); // Number of appointments per page
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null); // Track selected appointment

    
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false); // For Prescription Modal
  const [selectedPrescription, setSelectedPrescription] = useState<Medication[] | null>(null); // For selected prescription

  useEffect(() => {
    const fetchAppointmentDetails = async (id: string) => {
      try {
        const data = await getFullAppointmentList(id);
        setAppointmentDetails(data);
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
      }
    };
    fetchAppointmentDetails(userInfo._id);
  }, [userInfo._id]);

  const viewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const viewPrescription = (prescription: Medication[]) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
};

const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedPrescription(null);
};

  // Function to update the status of a specific appointment in the list
  const updateAppointmentStatus = (id: string, newStatus: string) => {
    setAppointmentDetails((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === id
          ? { ...appointment, bookingStatus: newStatus }
          : appointment
      )
    );
  };

  // Pagination Logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointmentDetails.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div className="overflow-x-auto min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        User Appointments
      </h2>

      <div className="shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-indigo-600 text-white text-left">
              <th className="py-3 px-6">Provider Name</th>
              <th className="py-3 px-6">Doctor Name</th>
              <th className="py-3 px-6">Patient Name</th>
              <th className="py-3 px-6">Appointment Date</th>
              <th className="py-3 px-6">Booking Date</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Action</th>
              <th className="py-3 px-6">View Prescription</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50 border-b">
                  <td className="py-4 px-6">
                    {appointment?.serviceProvider?.name}
                  </td>

                  {appointment?.doctor?.name
                      ? <td   className="py-4 px-6">
                      
                        {appointment.doctor.name}
                        
                    </td>
                      : 
                      <td   className="py-4 px-6 text-red-600">
                      Doctor deleted by admin
                    </td>
                  }

                  <td className="py-4 px-6">{appointment?.patientName}</td>
                  <td className="py-4 px-6">
                    {new Date(appointment?.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    {new Date(appointment?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        appointment?.bookingStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment?.bookingStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => viewDetails(appointment)}
                      className="text-sm bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                    >
                      View
                    </button>
                  </td>
                  <td className="py-4 px-6">
                  <button
                      onClick={() => viewPrescription(appointment.prescription || [])}
                      className="text-sm bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                    >
                      Prescription
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-6 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav>
          <ul className="inline-flex items-center space-x-2">
            {Array.from(
              {
                length: Math.ceil(
                  appointmentDetails.length / appointmentsPerPage
                ),
              },
              (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`${
                      currentPage === index + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-indigo-600 border border-indigo-600"
                    } font-bold py-2 px-4 rounded`}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title="Appointment Details"
          appointment={selectedAppointment}
          updateAppointmentStatus={updateAppointmentStatus} // Pass the update function
        />
      )}

{selectedPrescription && (
        <PrescriptionModal
          isOpen={showPrescriptionModal}
          onClose={closePrescriptionModal}
          prescription={selectedPrescription}
        />
      )}
    </div>
  );
};

export default UserAppointmentList;
