import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDoctorDetails, getAppointmentDetails } from '../../api/SP'; 
import Modal from "../../Components/sp/SingleBookingDetail"; // Import the Modal component
import PrescriptionModal from '../../Components/sp/PrescriptionModal';
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
    prescription: string;
}



interface DoctorDetails {
  _id: string;
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  doctorProfileImage: string; 
  appointments: Appointment[];
  yearsOfExperience: string;
  validCertificate:string;
}

const ViewSingleDoctorDetaildpage = () => {
  const location = useLocation();
  const { doctorId } = location.state || {};

  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [appointmentDetails, setAppointmentDetails] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false); 
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false); 
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [showCertificate, setShowCertificate] = useState(false);


  const navigate = useNavigate();


  useEffect(() => {
    if (!doctorId) {
      setError('Error: Doctor ID is missing.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const doctorData = await getDoctorDetails(doctorId);
        const appointmentData = await getAppointmentDetails(doctorId); 
        console.log(appointmentData)
        if (!doctorData || !appointmentData) {
          setError('No doctor details or appointments found.');
        } else {
          setDoctorDetails(doctorData); 
          setAppointmentDetails(appointmentData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching doctor and appointment details.'); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  // Open view modal
  const viewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true); 
  };

   //close view modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null); 
  };

  //prescription modal open
  const addPrescription = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAddPrescriptionModal(true); 
  };

   //close prescription modal
   const closePrescriptionModal = () => {
    setShowAddPrescriptionModal(false);
    setSelectedAppointment(null); 
  };

  //to go to recentppointments page
  const viewRecentAppointments = (appointmentId:string) => {
    navigate("/sp/viewRecentAppointmentOfUser", {
      state: { appointmentId },
    });
  };
  
 

  const updateAppointmentStatus = (id: string, newStatus: string) => {
    setAppointmentDetails((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === id
          ? { ...appointment, bookingStatus: newStatus }
          : appointment
      )
    );
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!doctorDetails || !Object.keys(doctorDetails).length) {
    return <div>No doctor details found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <h2 className="text-4xl text-black font-bold text-center mb-4" >Doctor's Profile</h2>

      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <img
          src={doctorDetails.doctorProfileImage || 'default-profile-image-url'}
          alt={doctorDetails.name}
          className="object-cover w-40 h-40 rounded-full border-4 border-gray-300 shadow-lg"
        />
      </div>

      <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">{doctorDetails.name || 'Doctor Name'}</h2>


      {/* Doctor's Specialization, Availability, Contact, and Years of Experience */}
      <div className="text-center mb-6">
        <h2 className="text-2xl text-gray-600 font-semibold mb-2">{doctorDetails.specialization || 'Specialization'}</h2>
        <p className="text-lg text-gray-600 mb-2">Available: {doctorDetails.availableFrom || 'N/A'} - {doctorDetails.availableTo || 'N/A'}</p>
        <p className="text-lg text-gray-600 mb-2">Contact: {doctorDetails.contact || 'N/A'}</p>
        <p className="text-lg text-gray-600 font-semibold mb-4">
          Years of Experience: {doctorDetails.yearsOfExperience || 'N/A'}
        </p>
      </div>

      {/* Certificate Section */}
      <div className="text-center">
        <button
          className="text-blue-600 hover:underline font-semibold"
          onClick={() => setShowCertificate(!showCertificate)}
        >
          {showCertificate ? 'Hide Certificate' : 'View Certificate'}
        </button>
        {/* Toggle Certificate Image */}
        {showCertificate && (
          <div className="mt-4">
            <img
              src={doctorDetails.validCertificate || 'default-certificate-image-url'}
              alt="Doctor's Certificate"
              className="mx-auto w-64 h-auto border-2 border-gray-300 shadow-lg rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="justify-center items-center flex mb-3 mt-4">
  <h3 className="text-2xl font-bold text-gray-700 mb-6">Appointment Details</h3>
</div>

<div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
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
        <th className="py-3 px-6">Recent Appointments</th>
      </tr>
    </thead>
    <tbody>
      {appointmentDetails.length > 0 ? (
        appointmentDetails.map((appointment) => (
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
                onClick={() => addPrescription(appointment)}
                className="text-sm bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
              >
                Prescription
              </button>
            </td>
            <td className="py-4 px-6 border-b">
              <button
                onClick={() => viewRecentAppointments(appointment._id)}
                className="text-sm bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
              >
                Check
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={11} className="py-4 px-6 text-center text-gray-500 border-b">
            No appointments available.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title="Appointment Details"
          appointment={selectedAppointment}
          updateAppointmentStatus={updateAppointmentStatus} 
        />
      )}

      {selectedAppointment && (
        <PrescriptionModal
          isOpen={showAddPrescriptionModal}
          closePrescriptionModal={closePrescriptionModal}
          appointment={selectedAppointment}
        />
      )}

    </div>
  );
};

export default ViewSingleDoctorDetaildpage;
