import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorDetailsFromSearchPage } from "../../api/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faClock } from "@fortawesome/free-solid-svg-icons";
import { toast, Toaster } from "react-hot-toast";
import Modal from "react-modal";
import LoadingSpinner from "../../Components/common/LoadingSpinner";


interface TimeSlot {
  slot: string;
  status: "occupied" | "not occupied";
}

interface AvailableDate {
  date: string;
  timeSlots: TimeSlot[];
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  department:{
    name:string;
  };
  contact: string;
  availableDates: AvailableDate[];
}


const DoctorDetailesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await getDoctorDetailsFromSearchPage(id);
        console.log("response response :", response);
        setSelectedDoctor(response);
      } catch (err) {
        setError("Failed to fetch doctor details.");
        toast.error("Failed to fetch doctor details.");
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedTimeSlot("");
    setModalIsOpen(true);
  };

  const handleDateSelect = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's date to midnight

    const selectedDateObj = new Date(date);
    selectedDateObj.setHours(0, 0, 0, 0); // Set selected date to midnight

    if (selectedDateObj >= today) {
      setSelectedDate(date);
      setSelectedTimeSlot("");
    } else {
      toast.error("Please select a valid date.");
    }
  };

  const handleSlotClick = (slot: string) => {
    setSelectedTimeSlot(slot);
  };

  const handleBookingClick = () => {
    navigate(`/user/userBookingPage`, {
      state: {
        doctorId: selectedDoctor?._id,
        date: selectedDate,
        slot: selectedTimeSlot,
      },
    });
  };

  return (
    <div className="mx-auto p-8 min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      <div className="text-center mb-10">
        {selectedDoctor?.specialization && (
          <h1 className="text-4xl font-semibold">
            {selectedDoctor?.department?.name} Department
          </h1>
        )}
      </div>
      {/* Doctors Section */}
      <div className="mt-12">
        {selectedDoctor ? (
          <div className="flex flex-wrap justify-center gap-9">
            <div
              key={selectedDoctor._id}
              className="bg-white mt-10 rounded-lg text-gray-500 overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative cursor-pointer"
              onClick={() => handleDoctorClick(selectedDoctor)}
            >
              <div className="p-6 text-center">
                <FontAwesomeIcon icon={faUser} className="text-6xl mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  {selectedDoctor.name}
                </h3>
                <p className="text-sm mb-2">{selectedDoctor.specialization}</p>
                <div className="flex items-center justify-center text-sm mb-3">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  <p>
                    {selectedDoctor.availableFrom} -{" "}
                    {selectedDoctor.availableTo}
                  </p>
                </div>
                <div className="flex items-center justify-center text-sm mb-4">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  <p>{selectedDoctor.contact}</p>
                </div>
                <button className="bg-gray-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-4 transition duration-300">
                  View Availability
                </button>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r"></div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No doctor details available.
          </div>
        )}

        {/* Modal for Doctor Availability */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          ariaHideApp={false}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
            <button
              onClick={() => setModalIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Select a Date
            </h2>
            <div className="flex flex-wrap justify-center">
              {selectedDoctor?.availableDates
                .filter((availableDate) => {
                  const today = new Date().setHours(0, 0, 0, 0);
                  const availableDateObj = new Date(
                    availableDate.date
                  ).setHours(0, 0, 0, 0);
                  return availableDateObj >= today;
                })
                .map((availableDate) => (
                  <button
                    key={availableDate.date}
                    className={`py-2 px-4 rounded-md m-2 ${
                      selectedDate === availableDate.date
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-600 hover:text-gray-300`}
                    onClick={() => handleDateSelect(availableDate.date)}
                  >
                    {new Date(availableDate.date).toDateString()}
                  </button>
                ))}
            </div>
            {selectedDate && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Available Time Slots for{" "}
                  {new Date(selectedDate).toDateString()}:
                </h3>
                <div className="flex flex-wrap justify-center">
                  {selectedDoctor?.availableDates
                    .find((d) => d.date === selectedDate)
                    ?.timeSlots.filter((slot) => {
                      const now = new Date();
                      const isToday =
                        new Date(selectedDate).setHours(0, 0, 0, 0) ===
                        now.setHours(0, 0, 0, 0);
                      const slotTime = new Date(`${selectedDate} ${slot.slot}`);
                      return (
                        slot.status === "not occupied" &&
                        (!isToday || slotTime > now)
                      );
                    }).length === 0 ? (
                    <p className="text-center text-gray-500">
                      No available time slots for{" "}
                      {new Date(selectedDate).toDateString()}.
                    </p>
                  ) : (
                    selectedDoctor?.availableDates
                      .find((d) => d.date === selectedDate)
                      ?.timeSlots.filter((slot) => {
                        const now = new Date();
                        const isToday =
                          new Date(selectedDate).setHours(0, 0, 0, 0) ===
                          now.setHours(0, 0, 0, 0);
                        const slotTime = new Date(
                          `${selectedDate} ${slot.slot}`
                        );
                        return (
                          slot.status === "not occupied" &&
                          (!isToday || slotTime > now)
                        );
                      })
                      .map((slot) => (
                        <button
                          key={slot.slot}
                          className={`py-2 px-4 rounded-md m-2 ${
                            selectedTimeSlot === slot.slot
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-blue-600 hover:text-gray-300`}
                          onClick={() => handleSlotClick(slot.slot)}
                        >
                          {slot.slot}
                        </button>
                      ))
                  )}
                </div>
                {selectedTimeSlot && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleBookingClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DoctorDetailesPage;
