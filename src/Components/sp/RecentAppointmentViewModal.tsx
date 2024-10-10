import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
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
  };
}

export interface Medication {
  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions: string;
  refills?: number;
}

const SingleAppointmentDetails: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  appointment: initialAppointment,
}) => {
  const [appointment] = useState(initialAppointment);

  if (!isOpen) return null;

  const bookingDate = new Date(appointment.bookingDate);
  const createdAt = new Date(appointment.createdAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-80 transition-opacity duration-300 ease-in-out">
      <div className="bg-gray-100 rounded-xl shadow-lg max-w-3xl w-full mx-4 md:mx-auto p-8 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="border-b border-gray-400 pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-800 transition"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center mt-6">
          {appointment.qrCode && (
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your QR Code</h2>
              <img
                src={appointment.qrCode}
                alt="QR Code"
                className="w-48 h-48 border-4 border-gray-600 rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="mt-6">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-gray-700">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Provider</td>
                <td className="px-4 py-2">{appointment.serviceProvider.name}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Department</td>
                <td className="px-4 py-2">{appointment.department.name}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Doctor</td>
                <td className="px-4 py-2">{appointment.doctor.name}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Patient Name</td>
                <td className="px-4 py-2">{appointment.patientName}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Age</td>
                <td className="px-4 py-2">{appointment.patientAge}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Email</td>
                <td className="px-4 py-2">{appointment.patientEmail}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Phone</td>
                <td className="px-4 py-2">{appointment.patientPhone}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Appointment Date</td>
                <td className="px-4 py-2">{bookingDate.toLocaleDateString()}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Time Slot</td>
                <td className="px-4 py-2">{appointment.timeSlot}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Amount</td>
                <td className="px-4 py-2">₹50</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Payment Status</td>
                <td className="px-4 py-2">{appointment.paymentStatus}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Booking Status</td>
                <td className="px-4 py-2">{appointment.bookingStatus}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Created At</td>
                <td className="px-4 py-2">{createdAt.toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleAppointmentDetails;
