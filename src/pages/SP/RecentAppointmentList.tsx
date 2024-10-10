import { useLocation } from "react-router-dom";
import { getRecentAppointments } from "../../api/SP";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../Components/common/LoadingSpinner";
import Modal from "../../Components/sp/RecentAppointmentViewModal";
import PrescriptionModal from "../../Components/sp/RecentAppointmentsPrescriptionModal"; 


 interface Appointment {
  _id: string;
  user: string;
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
  bookingDate: Date;
  timeSlot: string;
  patientName: string;
  patientAge: number;
  patientEmail: string;
  patientPhone: string;
  amount: number;
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: Date;
  bookingStatus:
    | "pending"
    | "Approved"
    | "rejected"
    | "completed"
    | "cancelled";
  qrCode?: string;
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

const RecentAppointmentList = () => {
  const location = useLocation();
  const { appointmentId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]); // Specify the type here
  const [error, setError] = useState("");
  const [showViewModal , setShowViewModal] = useState(false)
  const [selectedAppointment , setSelectedAppointment] = useState<Appointment | null>(null);
  
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false); // For Prescription Modal
  const [selectedPrescription, setSelectedPrescription] = useState<Medication[] | null>(null); // For selected prescription


  useEffect(() => {
    const fetchRecentAppointments = async () => {
      setLoading(true);
      setError("");

      try {
        const recentAppointments = await getRecentAppointments(appointmentId);
        setAppointments(recentAppointments);
      } catch (err) {
        console.error("Error fetching recentAppointments:", err);
        setError("Error fetching recent appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAppointments();
  }, [appointmentId]);

 
    const viewDetails = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setShowViewModal(true); 
    };
    
    const closeViewModal = () => {
        setShowViewModal(false); 
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

  

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-auto min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Recent Appointments</h2>
      <div className="shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-indigo-600 text-white text-left">
              <th className="py-3 px-6">Booking Date</th>
              <th className="py-3 px-6">Time Slot</th>
              <th className="py-3 px-6">Patient Name</th>
              <th className="py-3 px-6">Patient Age</th>
              <th className="py-3 px-6">Patient Email</th>
              <th className="py-3 px-6">Patient Phone</th>
              <th className="py-3 px-6">Booking Status</th>
              <th className="py-3 px-6">QR Code</th>
              <th className="py-3 px-6">Actions</th>
              <th className="py-3 px-6">Prescription</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={10} className="py-4 px-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 border-b">{new Date(appointment.bookingDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6 border-b">{appointment.timeSlot}</td>
                  <td className="py-4 px-6 border-b">{appointment.patientName}</td>
                  <td className="py-4 px-6 border-b">{appointment.patientAge}</td>
                  <td className="py-4 px-6 border-b">{appointment.patientEmail}</td>
                  <td className="py-4 px-6 border-b">{appointment.patientPhone}</td>
                  <td className="py-4 px-6 border-b">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${appointment.bookingStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {appointment.bookingStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b">
                    {appointment.qrCode ? (
                      <img src={appointment.qrCode} alt="QR Code" className="w-12 h-12" />
                    ) : (
                      <span className="text-gray-500">No QR Code</span>
                    )}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => viewDetails(appointment)}
                      className="text-sm bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                    >
                      View
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b">
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
                <td colSpan={10} className="py-4 px-6 text-center text-gray-500">
                  No recent appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {selectedAppointment && (
        <Modal
          isOpen={showViewModal}
          onClose={closeViewModal}
          appointment={selectedAppointment}
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

export default RecentAppointmentList;