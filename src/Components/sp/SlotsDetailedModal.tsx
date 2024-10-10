import React, { useEffect, useState } from "react";
import { getDoctorSlotsDetails } from "../../api/SP"; // Assuming this is the API call
import LoadingSpinner from "../common/LoadingSpinner";

interface TimeSlot {
  slot: string;
  status: "occupied" | "not occupied";
  user?: {
    name: string;
    email: string;
  };
}

interface AvailableDate {
  date: string; // Keeping it as a string for simplicity
  timeSlots: TimeSlot[];
}

interface DeleteDoctorModalProps {
  doctorId: string;
  onClose: () => void;
}

const SlotsDetailedModal: React.FC<DeleteDoctorModalProps> = ({
  doctorId,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorSlots = async () => {
      try {
        setLoading(true);
        const slotsDetails = await getDoctorSlotsDetails(doctorId);
        setAvailableDates(slotsDetails); // Assuming slotsDetails is an array of available dates
      } catch (error) {
        setError("Failed to load doctor slots");
        console.error("Error fetching doctor slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorSlots();
  }, [doctorId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-3/4 max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Doctor's Available Slots</h2>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : availableDates.length > 0 ? (
          <div className="space-y-6">
            {availableDates.map((dateItem, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {new Date(dateItem.date).toLocaleDateString()}
                </h3>
                <div className="grid grid-cols-6 gap-4">
                  {dateItem.timeSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`relative group p-3 rounded-md text-center transition-all duration-300 transform ${
                        slot.status === "occupied"
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      } hover:scale-110 hover:bg-indigo-500 cursor-pointer`}
                    >
                      {/* Display the slot time */}
                      <p className="text-sm">{slot.slot}</p>
                      <p className="text-sm">
                        {slot.status === "occupied" ? "Occupied" : "Available"}
                      </p>

                      {/* Large card with details */}
                      {slot.status === "occupied" && slot.user && (
                        <div className="absolute inset-0 bg-blue-500 text-white p-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transform group-hover:scale-123 transition-all duration-300 z-10">
                          <p className="text-xs font-semibold">
                            {slot.user.name}
                          </p>
                          <p className="text-[8px] break-all">
                            {slot.user.email}
                          </p>
                        </div>
                      )}

                      {/* Placeholder for available slots */}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No available slots found for this doctor.</p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotsDetailedModal;
