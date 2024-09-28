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

  // const submitCompletion = async () => {

    
  //   try {
  //     await completeAppointment(appointment._id);
  //     setAppointment((prev) => ({
  //       ...prev,
  //       bookingStatus: "completed",
  //     }));
  //     updateAppointmentStatus(appointment._id, "completed");
  //     toast.success("Appointment completed successfully!");
  //   } catch (error) {
  //     toast.error("Failed to complete the appointment.");
  //   }
  //   setCompletionConfirmationModalOpen(false);
  // };
  const submitCompletion = async () => {
    try {
      // Get the current date and time
      const now = new Date();
      // console.log("now date :", now);
  
      // Convert appointment date and time slot to a Date object
      const appointmentDate = new Date(appointment.bookingDate);
      // console.log("converted appointmentDate :", appointmentDate);
  
      // Log time slot for debugging
      // console.log("appointment.timeSlot:", appointment.timeSlot);
  
      // Extract the start time from the time slot (before the " - ")
      const [startTime] = appointment.timeSlot.split(' - ');
      // console.log("Start time:", startTime);
  
      // Extract the hour and minutes from the start time (assuming it's in "HH:mm" format)
      const [appointmentHour, appointmentMinute] = startTime.split(':').map(Number);
      // console.log("appointmentHour appointmentMinute :", appointmentHour, appointmentMinute);
  
      // Check for NaN values
      if (isNaN(appointmentHour) || isNaN(appointmentMinute)) {
        // console.error('Invalid time slot:', appointment.timeSlot);
        toast.error("Invalid time slot format.");
        return; // Exit the function
      }
  
      // Set the time of the appointmentDate to match the start time
      appointmentDate.setHours(appointmentHour, appointmentMinute, 0, 0);
  
      // Log dates for debugging
      // console.log('Current Date and Time:', now);
      // console.log('Appointment Date and Time:', appointmentDate);
  
      // Check if the current date and time are before the appointment date and time
      if (now < appointmentDate) {
        toast.error("You can't complete the appointment before the scheduled date and time.");
        return; // Exit the function
      }
  
      // Proceed with completion
      await completeAppointment(appointment._id);
      setAppointment((prev) => ({
        ...prev,
        bookingStatus: "completed",
      }));
      updateAppointmentStatus(appointment._id, "completed");
      toast.success("Appointment completed successfully!");
  
    } catch (error) {
      console.error('Error completing appointment:', error); // Log error details for debugging
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
      updateAppointmentStatus(appointment._id, "cancelled"); // Update the parent list

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
      <Toaster position="top-center"/>
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

        {/* qr code showing */}
        <div className="justify-center mt-4 items-center flex">
          {appointment.qrCode && (
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Your QR Code:
              </h2>
              <img
                src={appointment.qrCode}
                alt="QR Code"
                className="w-32 h-32 border border-gray-300 rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Service Details
              </h3>

              <img
                src={appointment.serviceProvider?.profileImage}
                alt={`${appointment.serviceProvider?.name}'s profile`}
                className="w-16 h-16 rounded-full border border-gray-300 shadow-md"
              />
              <p>
                <strong>Service Provider:</strong>{" "}
                {appointment.serviceProvider.name}
              </p>
              <p>
                <strong>Department:</strong> {appointment.department?.name}
              </p>
              <p>
                <strong>Doctor Name:</strong> {appointment.doctor?.name}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Patient Details
              </h3>
              <p>
                <strong>Patient Name:</strong> {appointment.patientName}
              </p>
              <p>
                <strong>Patient Age:</strong> {appointment.patientAge}
              </p>
              <p>
                <strong>Patient Email:</strong> {appointment.patientEmail}
              </p>
              <p>
                <strong>Patient Phone:</strong> {appointment.patientPhone}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Booking Details
              </h3>
              <p>
                <strong>Appointment Date:</strong>{" "}
                {bookingDate.toLocaleDateString()}
              </p>
              <p>
                <strong>Time Slot:</strong> {appointment.timeSlot}
              </p>
              <p>
                <strong>Amount:</strong> {appointment.amount} Rupees
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Status Details
              </h3>
              <p>
                <strong>Payment Status:</strong> {appointment.paymentStatus}
              </p>
              <p>
                <strong>Booking Status:</strong> {appointment.bookingStatus}
              </p>
              <p>
                <strong>Booking Created At:</strong>{" "}
                {createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

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
            {appointment.bookingStatus === "pending" ||
              (appointment.bookingStatus === "approved" && (
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 mx-2"
                >
                  Reject
                </button>
              ))}
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
          {/* completion  Confirmation modal */}
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
