import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoctorDetails } from "../../api/user"; // Import your function from the appropriate file
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentSession } from "../../api/user";
import IsWalletHaveMoneyConfirmModal from "../../Components/user/IsWalletHaveMoneyConfirmModal";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
}

interface LocationState {
  doctorId: string;
  date: string;
  slot: string;
}

// Define a type for the body object
type PaymentBodyType = {
  amount: number;
  currency: string;
  userInfo: any; // You can replace 'any' with a more specific type if you have it
  doctorId: string;
  bookingDate: string;
  timeSlot: string;
  patientName: string;
  patientAge: number | "";
  patientEmail: string;
  patientPhone: string;
};

const UserBookingPage = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const location = useLocation();
  const { doctorId, date, slot } = (location.state || {}) as LocationState;

  const [doctorDetails, setDoctorDetails] = useState<Doctor | null>(null);
  const [bookingDate] = useState<string>(date);
  const [timeSlot] = useState<string>(slot);

  // Form fields
  const [patientName, setPatientName] = useState<string>("");
  const [patientAge, setPatientAge] = useState<number | "">("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");

  //moneychecking wallet open close
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentBody, setPaymentBody] = useState<PaymentBodyType | null>(null); // State to hold the payment body

  // Validation errors state
  const [errors, setErrors] = useState({
    patientName: "",
    patientAge: "",
    patientEmail: "",
    patientPhone: "",
  });

  //stripe
  const stripePromise = loadStripe(
    "pk_test_51PwKSd07lqBJqvJJyAybqVw6TNnXpaX9wq45ruu7k8sO2lkol3TlJ7p3i1knnXNtBUbSAIqnUk5E4RkG09AxU01d00uTDGIeEL"
  );

  useEffect(() => {
    if (doctorId) {
      const fetchDoctorDetails = async (id: string) => {
        try {
          const data: Doctor = await getDoctorDetails(id);
          setDoctorDetails(data);
        } catch (error) {
          console.error("Failed to fetch doctor details:", error);
        }
      };

      fetchDoctorDetails(doctorId);
    }
  }, [doctorId]);

  const validateForm = () => {
    let formValid = true;
    const newErrors = {
      patientName: "",
      patientAge: "",
      patientEmail: "",
      patientPhone: "",
    };

    if (!patientName) {
      newErrors.patientName = "Patient name is required";
      formValid = false;
    }

    if (!patientAge || patientAge <= 0) {
      newErrors.patientAge = "Valid age is required";
      formValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientEmail)) {
      newErrors.patientEmail = "Invalid email address";
      formValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(patientPhone)) {
      newErrors.patientPhone = "Phone number must be 10 digits";
      formValid = false;
    }

    setErrors(newErrors);
    return formValid;
  };

  const handleWalletPayment = async () => {
    if (!validateForm()) {
      return; // Don't proceed if form is invalid
    }

    const body: PaymentBodyType = {
      amount: 10,
      currency: "INR",
      userInfo,
      doctorId,
      bookingDate,
      timeSlot,
      patientName,
      patientAge,
      patientEmail,
      patientPhone,
    };

    setPaymentBody(body);

    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return; // Don't proceed if form is invalid
    }

    const stripe = await stripePromise;

    const body = {
      amount: 10,
      currency: "INR",
      successUrl: "http://localhost:3000//user/success",
      cancelUrl: "http://localhost:3000/user/cancel",
      userInfo,
      doctorId,
      bookingDate,
      timeSlot,
      patientName,
      patientAge,
      patientEmail,
      patientPhone,
    };

    const response = await createPaymentSession(body);

    const sessionId = response.id;

    const result = await stripe?.redirectToCheckout({
      sessionId: sessionId,
    });

    if (result?.error) {
      console.error("Error in Stripe Checkout:", result.error.message);
    }
  };

  if (!doctorId || !date || !slot) {
    return <p>Error: Missing booking information.</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Confirm Your Booking
        </h1>

        {doctorDetails ? (
          <div className="doctor-info mb-6 text-center">
            <h2 className="text-xl font-semibold">
              Doctor: {doctorDetails.name}
            </h2>
            <p>Specialization: {doctorDetails.specialization}</p>
          </div>
        ) : (
          <p>Loading doctor details...</p>
        )}

        <div className="booking-details mb-6">
          <p className="mb-2">
            <strong>Date:</strong> {new Date(bookingDate).toDateString()}
          </p>
          <p>
            <strong>Time Slot:</strong> {timeSlot}
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4"
              placeholder="Enter your name"
              required
            />
            {errors.patientName && (
              <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4"
              placeholder="Enter your age"
              required
            />
            {errors.patientAge && (
              <p className="text-red-500 text-xs mt-1">{errors.patientAge}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4"
              placeholder="Enter your email"
              required
            />
            {errors.patientEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.patientEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-4"
              placeholder="Enter your phone number"
              required
            />
            {errors.patientPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.patientPhone}</p>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-6 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-colors duration-200"
              >
                Stripe Payment ₹50
              </button>
              <button
                type="button"
                onClick={handleWalletPayment}
                className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors duration-200"
              >
                Wallet Payment ₹50
              </button>
            </div>
          </div>
        </form>

        {isModalOpen && paymentBody && (
          <IsWalletHaveMoneyConfirmModal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
            body={paymentBody} 
          />
        )}
      </div>
    </div>
  );
};

export default UserBookingPage;