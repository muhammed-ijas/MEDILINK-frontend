import React, { useState } from "react";
import {toast , Toaster} from "react-hot-toast";
import {
  approveAppointment,
  cancelAppointment,
  completeAppointment,
} from "../../api/SP";
import ConfirmationModal from "../../Components/sp/ApproveAppointmentModal";
import CompleteConfirmationModal from "../../Components/sp/CompleteApointmentConfirmationModal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  appointment: {
    _id: string;
    serviceProvider: { name: string; profileImage: string };
    department: { name: string };
    doctor: { name: string };
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
  };
  updateAppointmentStatus: (id: string, status: string) => void;
}

const SingleAppointmentDetails: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  appointment: initialAppointment,
  updateAppointmentStatus,
}) => {
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [completeConfirmationModalOpen, setCompletionConfirmationModalOpen] =
    useState(false);
  const [appointment, setAppointment] = useState(initialAppointment);
  const [actionType, setActionType] = useState<
    "approve" | "cancel" | "complete" | null
  >(null);
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const bookingDate = new Date(appointment.bookingDate);
  const createdAt = new Date(appointment.createdAt);

  const shouldShowButtons =
    appointment.bookingStatus === "pending" ||
    appointment.bookingStatus === "approved" ||
    appointment.bookingStatus === "completed";

  const handleApprove = () => {
    setActionType("approve");
    setConfirmationModalOpen(true);
  };

  const handleCancel = () => {
    setActionType("cancel");
    setReasonModalOpen(true);
  };

  const handleComplete = () => {
    setActionType("complete");
    setCompletionConfirmationModalOpen(true);
  };

  const submitCompletion = async () => {
    try {
      const now = new Date();
      const appointmentDate = new Date(appointment.bookingDate);
      
      const [startTime] = appointment.timeSlot.split(' - ');
      const [appointmentHour, appointmentMinute] = startTime.split(':').map(Number);
  
      if (isNaN(appointmentHour) || isNaN(appointmentMinute)) {
        toast.error("Invalid time slot format.");
        return; 
      }
        appointmentDate.setHours(appointmentHour, appointmentMinute, 0, 0);
  
  
      if (now < appointmentDate) {
        toast.error("You can't complete the appointment before the scheduled date and time.");
        return; 
      }
  
      await completeAppointment(appointment._id);
      setAppointment((prev) => ({
        ...prev,
        bookingStatus: "completed",
      }));
      updateAppointmentStatus(appointment._id, "completed");
      toast.success("Appointment completed successfully!");
  
    } catch (error) {
      console.error('Error completing appointment:', error); 
      toast.error("Failed to complete the appointment.");
    } finally {
      setCompletionConfirmationModalOpen(false);
    }
  };
  

  const submitApproval = async () => {
    try {
      await approveAppointment(appointment._id);
      setAppointment((prev) => ({
        ...prev,
        bookingStatus: "approved",
      }));
      updateAppointmentStatus(appointment._id, "approved");
      toast.success("Appointment approved successfully!");
    } catch (error) {
      toast.error("Failed to approve the appointment.");
    }
    setConfirmationModalOpen(false);
  };

  const submitCancellation = async () => {
    try {
      await cancelAppointment(appointment._id, reason);
      setAppointment((prev) => ({
        ...prev,
        bookingStatus: "cancelled",
      }));
      updateAppointmentStatus(appointment._id, "cancelled"); 

      toast.success("Appointment cancelled successfully!");
    } catch (error) {
      toast.error("Failed to cancel the appointment.");
    }
    setReasonModalOpen(false);
    setConfirmationModalOpen(false);
  };

  const confirmAction = () => {
    if (actionType === "approve") {
      submitApproval();
    }
  };

  const confirmCompleteAction = () => {
    if (actionType === "complete") {
      submitCompletion();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &#x2715;
          </button>
        </div>
  
        {/* QR code showing */}
        <div className="flex justify-center mt-6 items-center">
          {appointment.qrCode && (
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Your QR Code:
              </h2>
              <img
                src={appointment.qrCode}
                alt="QR Code"
                className="w-48 h-48 border border-gray-300 rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
  
        {/* Modal Content */}
        <div className="p-6">
         
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              {/* Service Details */}
              <tr className="border-b">
                <td className="p-4 font-semibold">Service Provider</td>
                <td className="p-4">{appointment.serviceProvider.name}</td>
                <td className="p-4" rowSpan={3}>
                  <img
                    src={appointment.serviceProvider?.profileImage}
                    alt={`${appointment.serviceProvider?.name}'s profile`}
                    className="w-16 h-16 rounded-full border border-gray-300 shadow-md"
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-semibold">Department</td>
                <td className="p-4">{appointment.department?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-semibold">Doctor Name</td>
                <td className="p-4">{appointment.doctor?.name}</td>
              </tr>
  
              {/* Patient Details */}
              <tr className="border-b">
                <td className="p-4 font-semibold">Patient Name</td>
                <td className="p-4">{appointment.patientName}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-semibold">Patient Age</td>
                <td className="p-4">{appointment.patientAge}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-semibold">Patient Email</td>
                <td className="p-4">{appointment.patientEmail}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-semibold">Patient Phone</td>
                <td className="p-4">{appointment.patientPhone}</td>
              </tr>
  
              {/* Booking Details */}
              <tr className="border-b">
                <td className="p-4 font-semibold">Appointment Date</td>
                <td className="p-4">{bookingDate.toLocaleDateString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-semibold">Time Slot</td>
                <td className="p-4">{appointment.timeSlot}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-semibold">Amount</td>
                <td className="p-4">50 Rupees</td>
              </tr>
  
              {/* Status Details */}
              <tr className="border-b">
                <td className="p-4 font-semibold">Payment Status</td>
                <td className="p-4">{appointment.paymentStatus}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-semibold">Booking Status</td>
                <td className="p-4">{appointment.bookingStatus}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Booking Created At</td>
                <td className="p-4">{createdAt.toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
  
          {/* Action Buttons */}
          {shouldShowButtons && (
            <div className="flex justify-center items-center mt-6">
              {appointment.bookingStatus === "pending" && (
                <button
                  onClick={handleApprove}
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 mx-2"
                >
                  Approve
                </button>
              )}
            </div>
          )}
          <div className="flex justify-center items-center mt-6">
            {(appointment.bookingStatus === "pending" ||
              appointment.bookingStatus === "approved") && (
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 mx-2"
              >
                Reject
              </button>
            )}
          </div>
  
          <div className="flex justify-center items-center mt-6">
            {appointment.bookingStatus === "approved" && (
              <button
                onClick={handleComplete}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 mx-2"
              >
                Complete
              </button>
            )}
          </div>
  
          {/* Reason modal for cancellation */}
          {reasonModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 md:mx-auto p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Cancel Appointment
                </h3>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Reason for cancellation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setReasonModalOpen(false)}
                    className="bg-gray-300 text-black py-2 px-4 rounded mx-2"
                  >
                    Close
                  </button>
                  <button
                    onClick={submitCancellation}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
              
            </div>
          )}
            <div className="flex justify-end ">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all duration-200"
          >
            Close
          </button>
        </div>
  
          {/* Confirmation modal */}
          <ConfirmationModal
            isVisible={confirmationModalOpen}
            onConfirm={confirmAction}
            onCancel={() => setConfirmationModalOpen(false)}
            title={
              actionType === "approve"
                ? "Approve Appointment"
                : "Cancel Appointment"
            }
            message={
              actionType === "approve"
                ? "Are you sure you want to approve this appointment?"
                : "Are you sure you want to cancel this appointment?"
            }
          />
  
          {/* Completion Confirmation modal */}
          <CompleteConfirmationModal
            isVisible={completeConfirmationModalOpen}
            onConfirm={confirmCompleteAction}
            onCancel={() => setCompletionConfirmationModalOpen(false)}
            title={"Complete Appointment"}
            message={"Are you sure you want to complete this appointment?"}
          />
        </div>
      
      </div>
    </div>
  );
  
};

export default SingleAppointmentDetails;
