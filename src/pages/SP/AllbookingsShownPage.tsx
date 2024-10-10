import  { useState, useEffect } from "react";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getFullAppointmentList } from "../../api/SP";
import Modal from "../../Components/sp/SingleBookingDetail"; // Import the Modal component
import LoadingSpinner from '../../Components/common/LoadingSpinner';


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
  const [loading, setLoading] = useState(true);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    setLoading(true)
    const fetchAppointmentDetails = async (id: string) => {
      try {
        const data = await getFullAppointmentList(id);
        setAppointmentDetails(data);
        
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
      }
      setLoading(false)
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

  

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  return (
    <div className="container mx-auto mt-8 p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
        User Appointments
      </h2>
  
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-indigo-600 text-white text-left">
              <th className="py-3 px-6">Department Name</th>
              <th className="py-3 px-6">Doctor Name</th>
              <th className="py-3 px-6">Patient Name</th>
              <th className="py-3 px-6">Appointment Date</th>
              <th className="py-3 px-6">Timeslot</th>
              <th className="py-3 px-6">Booking Date</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((appointment) => (
              <tr key={appointment._id} className="hover:bg-gray-50">
                <td className="py-4 px-6 border-b">{appointment.department?.name}</td>
                
                {appointment?.doctor?.name
                      ? <td   className="py-4 px-6">
                      
                        {appointment.doctor.name}
                        
                    </td>
                      : 
                      <td   className="py-4 px-6 text-red-600">
                      Doctor deleted by admin
                    </td>
                  }
                
                <td className="py-4 px-6 border-b">{appointment.patientName}</td>
                <td className="py-4 px-6 border-b">
                  {new Date(appointment.bookingDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 border-b">{appointment.timeSlot}</td>
                <td className="py-4 px-6 border-b">
                  {new Date(appointment.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 border-b">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.bookingStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {appointment.bookingStatus}
                  </span>
                </td>
                <td className="py-4 px-6 border-b">
                  <button
                    onClick={() => viewDetails(appointment)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
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
      <div className="flex justify-center mt-8">
        <nav>
          <ul className="inline-flex items-center space-x-2">
            {Array.from(
              { length: Math.ceil(appointmentDetails.length / appointmentsPerPage) },
              (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`${
                      currentPage === index + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-indigo-600 border border-indigo-600"
                    } font-bold py-2 px-4 rounded hover:bg-indigo-100 transition`}
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
