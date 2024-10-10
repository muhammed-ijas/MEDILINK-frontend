import { useState } from "react";
import { cancelAppointment, addReview } from "../../api/user";
import { toast, Toaster } from "react-hot-toast";

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

  const shouldShowReviewButton =
    updatedAppointment.bookingStatus === "completed";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-80 transition-opacity duration-300 ease-in-out">
      <Toaster position="top-center" />
      <div className="bg-gray-100 rounded-xl shadow-lg max-w-3xl w-full mx-4 md:mx-auto p-8 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="border-b border-gray-400 pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-900 hover:text-gray-800 transition"
          >
            &#x2715; {/* Close icon */}
          </button>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-center mt-6">
          {appointment.qrCode && (
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your QR Code:
              </h2>
              <img
                src={appointment.qrCode}
                alt="QR Code"
                className="w-64 h-64 border-4 border-gray-600 rounded-lg shadow-lg" // Increased size
              />
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="mt-6">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-gray-700">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Service Provider</td>
                <td className="px-4 py-2">
                  {appointment?.serviceProvider?.name}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Department</td>
                <td className="px-4 py-2">{appointment?.department?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Doctor Name</td>
                <td className="px-4 py-2">
                  {appointment?.doctor?.name
                    ? appointment.doctor.name
                    : "Doctor deleted by admin"}
                </td>
              </tr>

              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Patient Name</td>
                <td className="px-4 py-2">{appointment?.patientName}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Patient Age</td>
                <td className="px-4 py-2">{appointment?.patientAge}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Patient Email</td>
                <td className="px-4 py-2">{appointment?.patientEmail}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Patient Phone</td>
                <td className="px-4 py-2">{appointment?.patientPhone}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Appointment Date</td>
                <td className="px-4 py-2">
                  {bookingDate?.toLocaleDateString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Time Slot</td>
                <td className="px-4 py-2">{appointment?.timeSlot}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Amount</td>
                <td className="px-4 py-2">₹50</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Payment Status</td>
                <td className="px-4 py-2">{appointment?.paymentStatus}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Booking Status</td>
                <td className="px-4 py-2">
                  {updatedAppointment?.bookingStatus}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Booking Created At</td>
                <td className="px-4 py-2">{createdAt.toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          {shouldShowCancelButton && (
            <button
              onClick={handleCancel}
              className="mr-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-all duration-200"
            >
              Cancel
            </button>
          )}
          {shouldShowReviewButton && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-all duration-200"
            >
              Add Review
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all duration-200"
          >
            Close
          </button>
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
    </div>
  );
};

export default SingleAppointmentDetails;
