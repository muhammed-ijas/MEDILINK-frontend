import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDepartmentDetails } from "../../api/user";
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
  department: string[];
  contact: string;
  availableDates: AvailableDate[];
}

interface Department {
  _id: string;
  name: string;
  doctors: Doctor[];
}

const DepartmentDetailedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(""); // Track selected time slot
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await getDepartmentDetails(id);
        setDepartment(response);
      } catch (err) {
        setError("Failed to fetch department details.");
        toast.error("Failed to fetch department details.");
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(""); // Reset date when selecting a new doctor
    setSelectedTimeSlot(""); // Reset time slot when selecting a new doctor
    setModalIsOpen(true); // Open the modal
  };

  const handleDateSelect = (date: string) => {
    const today = new Date();
    const selectedDateObj = new Date(date);

    // Compare the timestamps of both dates
    if (selectedDateObj.getTime() >= today.setHours(0, 0, 0, 0)) {
      setSelectedDate(date);
      setSelectedTimeSlot(""); // Reset time slot when selecting a new date
    } else {
      toast.error("Please select a valid date."); // Show error for past dates
    }
  };

  const handleSlotClick = (slot: string) => {
    setSelectedTimeSlot(slot); // Set the selected time slot
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
    <div className=" mx-auto p-8 min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      {/* Department Name */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold inline-block">
          {department?.name} Department
        </h1>
      </div>

      {/* Doctors Section */}
      <div className="mt-12">
        {department?.doctors && department.doctors.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-9 ">
            {department.doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white mt-10 rounded-lg   overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl  relative cursor-pointer"
                onClick={() => handleDoctorClick(doctor)}
              >
                {/* Icon & Doctor Info */}
                <div className="p-6 text-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className=" text-6xl mb-4 text-blue-500"
                  />
                  <h3 className="text-xl font-bold mb-2 ">{doctor.name}</h3>
                  <p className="text-sm  mb-2">{doctor.specialization}</p>

                  {/* Availability Time */}
                  <div className="flex items-center justify-center  text-sm mb-3">
                    <FontAwesomeIcon icon={faClock} className="mr-2  " />
                    <p>
                      {doctor.availableFrom} - {doctor.availableTo}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-center  text-sm mb-4">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 " />
                    <p>{doctor.contact}</p>
                  </div>

                  {/* Book Now Button */}
                  <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-full mt-4 transition duration-300">
                    View Availability
                  </button>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r "></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No doctors available in this department.
          </p>
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

            {/* Date Buttons or No Available Dates Message */}
            <div className="flex flex-wrap justify-center">
              {selectedDoctor?.availableDates &&
              selectedDoctor?.availableDates.filter((availableDate) => {
                const today = new Date().setHours(0, 0, 0, 0); // Today, with time reset to midnight
                const availableDateObj = new Date(availableDate.date).setHours(
                  0,
                  0,
                  0,
                  0
                );
                return availableDateObj >= today; // Only allow dates that are today or in the future
              }).length === 0 ? (
                <p className="text-center text-gray-500">No available dates.</p>
              ) : (
                selectedDoctor?.availableDates
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
                  ))
              )}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Available Time Slots for{" "}
                  {new Date(selectedDate).toDateString()}:
                </h3>
                <div className="flex flex-wrap justify-center">
                  {selectedDoctor?.availableDates
                    ?.find((d) => d.date === selectedDate)
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
                      ?.find((d) => d.date === selectedDate)
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
                      .map((timeSlot) => (
                        <button
                          key={timeSlot.slot}
                          className={`py-2 px-4 rounded-md m-2 ${
                            selectedTimeSlot === timeSlot.slot
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-green-600 hover:text-gray-300`}
                          onClick={() => handleSlotClick(timeSlot.slot)}
                        >
                          {timeSlot.slot}
                        </button>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Book Appointment Button */}
            {selectedDate && selectedTimeSlot && (
              <button
                onClick={handleBookingClick}
                className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-md w-full hover:bg-blue-600"
              >
                Book Appointment
              </button>
            )}

            <button
              onClick={() => setModalIsOpen(false)}
              className="mt-6 py-2 px-4 bg-red-500 text-white rounded-md w-full hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DepartmentDetailedPage;
