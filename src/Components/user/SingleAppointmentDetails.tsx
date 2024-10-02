import  { useState } from "react";
import { cancelAppointment,addReview } from "../../api/user";
import {toast , Toaster} from "react-hot-toast";

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
  appointment,
  updateAppointmentStatus,
}) => {
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [updatedAppointment, setUpdatedAppointment] = useState(appointment);
  

  //rating and rreview
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  //star handle

  const handleStarClick = (index: number) => {
    setRating(index + 1); 
  };

  const submitReview = async () => {
    try {
      await addReview(appointment._id, { rating, review: reviewText });
      toast.success("Review added successfully!");
      setReviewModalOpen(false);
    } catch (error) {
      toast.error("Failed to add review.");
    }
  };

  const shouldShowReviewButton = updatedAppointment.bookingStatus === "completed";





  if (!isOpen) return null;

  const handleCancel = () => {
    setReasonModalOpen(true);
  };

  const submitCancellation = async () => {
    try {
      await cancelAppointment(appointment._id, reason);
      setUpdatedAppointment((prev) => ({
        ...prev,
        bookingStatus: "cancelled",
      }));
      updateAppointmentStatus(appointment._id, "cancelled");
      toast.success("Appointment cancelled successfully!");
    } catch (error) {
      toast.error("Failed to cancel the appointment.");
    }
    setReasonModalOpen(false);
  };

  const bookingDate = new Date(appointment.bookingDate);
  const createdAt = new Date(appointment.createdAt);
  const today = new Date();
  const oneDayBefore = new Date(bookingDate);
  oneDayBefore.setDate(bookingDate.getDate() - 1);

  const isToday = today.toDateString() === bookingDate.toDateString();

  const shouldShowCancelButton =
    (updatedAppointment.bookingStatus === "pending" ||
      updatedAppointment.bookingStatus === "approved") &&
    !isToday &&
    today < oneDayBefore;

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
            &#x2715; {/* Close icon */}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6"> 
          <div className="justify-center items-center flex">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Details */}
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
            {/* Patient Details */}
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
            {/* Booking Details */}
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
            {/* Status Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Status Details
              </h3>
              <p>
                <strong>Payment Status:</strong> {appointment.paymentStatus}
              </p>
              <p>
                <strong>Booking Status:</strong>{" "}
                {updatedAppointment.bookingStatus}
              </p>
              <p>
                <strong>Booking Created At:</strong>{" "}
                {createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Conditional rendering of the cancel button */}
          {shouldShowCancelButton && (
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
          {shouldShowReviewButton && (
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={() => setReviewModalOpen(true)}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Add Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reason modal for cancellation */}
      {reasonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 md:mx-auto p-6">
            <h3 className="text-lg font-semibold mb-4">Cancel Appointment</h3>
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
      
      {/* Review modal */}
      {reviewModalOpen && (
        <div className="fixed flex inset-0 z-50  items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 md:mx-auto p-6 justify-center items-center text-center ">
            <h3 className="text-lg font-semibold mb-4 ">Add Review</h3>

            {/* Star Rating */}
            <div className="flex space-x-1 mb-4 justify-center">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  onClick={() => handleStarClick(index)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={index < rating ? "#FFD700" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-8 h-8 cursor-pointer ${
                    index < rating ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.97 2.878a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.97-2.878a1 1 0 00-1.175 0l-3.97 2.878c-.784.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.99 10.1c-.783-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z"
                  />
                </svg>
              ))}
            </div>

            {/* Review Text */}
            <div className="mb-4">
             
              <textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Write your review here..."
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded mx-2"
              >
                Close
              </button>
              <button
                onClick={submitReview}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleAppointmentDetails;
