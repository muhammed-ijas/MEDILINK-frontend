import  { useState, useEffect } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getFullAppointmentList } from "../../api/SP";
import Modal from "../../Components/sp/SingleBookingDetail"; // Import the Modal component

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
  qrCode:string;
}

const AllBookingDetailsPag = () => {
  const { spInfo } = useSelector((state: RootState) => state.sp);
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [appointmentsPerPage] = useState(5); // Number of appointments per page
  const [showModal, setShowModal] = useState(false); 
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null); // Track selected appointment

  useEffect(() => {
    const fetchAppointmentDetails = async (id: string) => {
      try {
        const data = await getFullAppointmentList(id);
        setAppointmentDetails(data);
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
      }
    };
    fetchAppointmentDetails(spInfo._id);
  }, [spInfo._id]);

  const viewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true); // Open modal
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null); // Clear selected appointment when modal closes
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
    <div className="container mx-auto mt-8 p-4 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        User Appointments
      </h2>

      <div className="overflow-x-auto mt-10">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Department Name</th>
              <th className="py-2 px-4 text-left">Doctor Name</th>
              <th className="py-2 px-4 text-left">Patient Name</th>
              <th className="py-2 px-4 text-left">Appointment Date</th>
              <th className="py-2 px-4 text-left">Timeslot</th>
              <th className="py-2 px-4 text-left">Booking Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appointment) => (
              <tr key={appointment._id} className="border-t">
                <td className="py-2 px-4">{appointment.department?.name}</td>
                <td className="py-2 px-4">{appointment.doctor?.name}</td>
                <td className="py-2 px-4">{appointment.patientName}</td>
                <td className="py-2 px-4">
                  {new Date(appointment.bookingDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{appointment.timeSlot}</td>
                <td className="py-2 px-4">
                  {new Date(appointment.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{appointment.bookingStatus}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => viewDetails(appointment)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
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
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500 border border-blue-500"
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
    </div>
  );
};

export default AllBookingDetailsPag;
